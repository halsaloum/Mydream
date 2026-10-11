// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { getWord, type BankWord } from '@/content/words';
import { BOVENDIEN, DELEGEREN, DRAAGVLAK, KNOOP_DOORHAKKEN } from '@/content/words/bank/_voorbeelden';
import { createSession, type SessionState } from '@/engine/session';
import { addDays } from '@/lib/dates';
import { EMPTY_WORDS, learnCard, longestStreak, retention, reviewCard, wordStreak, type DayLog, type WordsData } from './memory';
import { buildRound, clash, commitRound, interleave, reviewTask } from './plan';
import { parseWordKey, wordTaskItem } from './steps';

const TODAY = '2026-10-11';
const word = (entry: typeof DRAAGVLAK, theme: string): BankWord => ({ ...entry, theme });
const WORDS4 = [word(DRAAGVLAK, 'besluiten'), word(DELEGEREN, 'leidinggeven'), word(BOVENDIEN, 'verbanden'), word(KNOOP_DOORHAKKEN, 'uitdrukkingen')];

/** Een ronde die helemaal goed ging: alles in één keer goed, eigen zinnen "klopt". */
function perfect(plan: ReturnType<typeof buildRound>['plan'], bet: 1 | 2 | 3 = 2): SessionState {
  const session = createSession('test', 'lesson', plan, 0);
  const firstTry: Record<string, number> = {};
  const responses: SessionState['responses'] = {};
  plan.forEach((item, pos) => {
    const kind = item.step.kind;
    if (kind === 'use') responses[String(pos)] = { kind: 'use', value: 'x', compared: true, rating: 2 };
    if (kind === 'bet' && item.step.kind === 'bet') responses[String(pos)] = { kind: 'bet', value: item.step.answer, bet };
    if (!['guess', 'word', 'use'].includes(kind)) firstTry[item.key] = 1;
  });
  return { ...session, phase: 'done', pos: plan.length, firstTry, responses, activeMs: 120_000 };
}

describe('nieuwe woorden door elkaar', () => {
  it('elk nieuw woord krijgt zijn taken op volgorde, met andere opdrachten ertussen', () => {
    const reviews = WORDS4.slice(0, 2).map((entry) => wordTaskItem(entry, 'recall2'));
    const plan = interleave(WORDS4.slice(2), [...reviews, ...reviews.map((item) => wordTaskItem(getWord(item.key.split(':')[1]!) ?? WORDS4[0]!, 'colloc'))]);
    for (const entry of WORDS4.slice(2)) {
      const positions = plan.flatMap((item, pos) => (parseWordKey(item.key)?.kind === 'task' && item.key.includes(`:${entry.id}:`) ? [pos] : []));
      const tasks = positions.map((pos) => (parseWordKey(plan[pos]!.key) as { task: string }).task);
      expect(tasks).toEqual(['guess', 'card', 'recall0', 'chat', 'use0']);
      // Na de kaart zit er steeds minstens één andere opdracht tussen.
      for (let i = 2; i < positions.length; i++) expect(positions[i]! - positions[i - 1]!).toBeGreaterThan(1);
    }
  });

  it('woorden die je makkelijk verwart, horen niet op dezelfde dag', () => {
    const overdragen: BankWord = { ...word(DELEGEREN, 'leidinggeven'), id: 'overdragen', word: 'overdragen', synonyms: [] };
    expect(clash(word(DELEGEREN, 'leidinggeven'), overdragen)).toBe(true);
    expect(clash(word(DRAAGVLAK, 'besluiten'), word(BOVENDIEN, 'verbanden'))).toBe(false);
    const draagkracht: BankWord = { ...word(DELEGEREN, 'besluiten'), id: 'draagkracht', word: 'draagkracht', article: 'de', synonyms: [], contrast: undefined };
    expect(clash(word(DRAAGVLAK, 'besluiten'), draagkracht)).toBe(true);
  });
});

describe('de ronde van de dag', () => {
  it('eindigt met een schrijfopdracht en nog één keer ophalen per nieuw woord', () => {
    const round = buildRound({ ...EMPTY_WORDS, perDay: 3 }, TODAY, 0);
    const keys = round.plan.map((item) => item.key);
    expect(new Set(keys).size).toBe(keys.length);
    const fresh = round.newIds.length;
    if (fresh >= 2) expect(keys.some((key) => key.includes(':samen:'))).toBe(true);
    const tail = keys.slice(-fresh).map((key) => parseWordKey(key));
    tail.forEach((parsed) => expect(parsed?.kind === 'task' && parsed.task).toBe('recall1'));
    expect(round.reviewIds).toEqual([]);
  });

  it('een goede eerste dag: het woord komt morgen terug, en de dag telt voor je reeks', () => {
    const round = buildRound({ ...EMPTY_WORDS, perDay: 2 }, TODAY, 0);
    const data = commitRound(EMPTY_WORDS, round, perfect(round.plan));
    for (const id of round.newIds) {
      const card = data.cards[id]!;
      expect(card.due).toBe(addDays(TODAY, 1));
      expect(card.log).toEqual([3, 3]);
    }
    expect(data.days[TODAY]).toMatchObject({ added: round.newIds, done: true });
    expect(wordStreak(data.days, TODAY)).toBe(1);
  });

  it('herhalingen werken het geheugen bij; wat je vergat, komt morgen terug', () => {
    const start: WordsData = {
      ...EMPTY_WORDS,
      cards: { draagvlak: learnCard(3, addDays(TODAY, -1), 3), delegeren: learnCard(3, addDays(TODAY, -1), 3) },
    };
    const round = buildRound({ ...start, perDay: 0 }, TODAY, 0);
    expect(round.reviewIds.sort()).toEqual(['delegeren', 'draagvlak'].filter((id) => getWord(id)).sort());
    const session = perfect(round.plan);
    const forgot = round.plan.find((item) => item.key.includes(':draagvlak:'));
    if (forgot) session.firstTry[forgot.key] = 0;
    const data = commitRound(start, round, session);
    if (getWord('draagvlak')) {
      expect(data.cards.draagvlak!.due).toBe(addDays(TODAY, 1));
      expect(data.cards.draagvlak!.lapses).toBe(1);
    }
    if (getWord('delegeren')) expect(data.cards.delegeren!.due > addDays(TODAY, 1)).toBe(true);
    expect(retention(data.days, TODAY).reviewed).toBe(round.reviewIds.length);
  });

  it('herhaalopdrachten wisselen, worden zonder beginletter als het woord zit, en zijn na een fout weer ophalen', () => {
    let card = learnCard(3, '2026-01-01', 3);
    expect(reviewTask(card)).toBe('recall2');
    card = reviewCard(card, 3, '2026-01-02');
    expect(reviewTask(card)).toBe('colloc');
    card = reviewCard(card, 1, '2026-01-10');
    expect(['recall0', 'recall1', 'recall2']).toContain(reviewTask(card));
    const strong = { ...learnCard(4, '2026-01-01'), s: 40, reps: 4, log: [4, 3, 3, 3] };
    expect(['free0', 'free1', 'free2', 'name', 'chat', 'meaning', 'use1', 'colloc']).toContain(reviewTask(strong));
    expect(reviewTask({ ...strong, reps: 4, lapses: 0 })).toBe('free0');
  });
});

describe('reeks en onthouden', () => {
  const day = (done: boolean, reviewed: string[] = [], kept: string[] = []): DayLog => ({ added: [], reviewed, kept, themes: [], done, ms: 0 });
  it('telt dagen op rij en de langste reeks', () => {
    const days = { [addDays(TODAY, -3)]: day(true), [addDays(TODAY, -2)]: day(true), [addDays(TODAY, -1)]: day(true), [TODAY]: day(false) };
    expect(wordStreak(days, TODAY)).toBe(3);
    expect(longestStreak({ ...days, [addDays(TODAY, -10)]: day(true) })).toBe(3);
  });
  it('onthouden telt alleen herhalingen', () => {
    expect(retention({ [TODAY]: day(true, ['a', 'b', 'c', 'd'], ['a', 'b', 'c']) }, TODAY)).toEqual({ reviewed: 4, kept: 3 });
  });
});
