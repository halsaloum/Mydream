import { getWord, THEMES, themeWords, type BankWord } from '@/content/words';
import type { Grade } from '@/engine/fsrs';
import { shuffle } from '@/engine/hash';
import type { PlanStep } from '@/engine/plan';
import type { SessionState } from '@/engine/session';
import type { WordResponse } from '@/engine/words';
import { daysBetween, dueIds, learnCard, reviewCard, type Card, type DayLog, type WordsData } from './memory';
import { composeItem, GENERAL_SITUATIONS, lookupWordStep, parseWordKey, situationFor, wordTaskItem, type Task } from './steps';

/**
 * De ronde van de dag.
 *
 * - Herhalen: woorden die volgens FSRS vandaag terug moeten komen, elk met één opdracht. De
 *   opdracht wisselt per keer (zelf typen in een nieuwe zin, de vaste combinatie, de situatie
 *   benoemen, een eigen zin, de betekenis met inzet), zodat je het woord steeds anders ophaalt.
 * - Nieuw: per woord eerst raden uit de zin, dan de kaart, en daarna met tussenpozen ophalen,
 *   meedenken in een gesprek en een eigen zin. Andere woorden en herhalingen vullen de tussenpozen,
 *   zodat opeenvolgende oefeningen niet altijd direct naast elkaar staan. Dit meet geen vergeten.
 * - Aan het eind schrijf je een korte tekst met een paar nieuwe woorden samen, en haal je elk
 *   nieuw woord nog één keer op.
 */

export const MAX_REVIEWS = 40;
const WARMUP = 3;
const MAX_ACTIVE = 3;
const NEW_TASKS: readonly Task[] = ['guess', 'card', 'recall0', 'chat', 'use0'];
/** Minimaal aantal andere opdrachten tussen twee taken van hetzelfde nieuwe woord. */
const MIN_GAP: readonly number[] = [0, 0, 2, 2, 2];
/**
 * Wisselende herhaalopdrachten volgens het aantal eerdere beoordelingen. Productie (typen,
 * schrijven) wisselt met herkenning. De eindige bank kan dezelfde context later opnieuw tonen.
 */
const REVIEW_ROTATION: readonly Task[] = ['recall2', 'colloc', 'use1', 'name', 'recall0', 'chat', 'recall1', 'meaning'];
const RECALLS: readonly Task[] = ['recall0', 'recall1', 'recall2'];
/** Bij geschatte FSRS-stabiliteit vanaf zeven dagen vervalt de beginletterhulp. */
const FREE: Partial<Record<Task, Task>> = { recall0: 'free0', recall1: 'free1', recall2: 'free2' };
const FREE_FROM = 7;

/** Welke opdracht een woord bij deze herhaling krijgt. Na een fout altijd zelf typen, met steuntje. */
export function reviewTask(card: Card): Task {
  const count = card.reps + card.lapses;
  if (card.log[card.log.length - 1] === 1) return RECALLS[count % RECALLS.length]!;
  const task = REVIEW_ROTATION[count % REVIEW_ROTATION.length]!;
  return card.s >= FREE_FROM ? (FREE[task] ?? task) : task;
}

/* ------------------------------------------------------------------ nieuwe woorden kiezen */

const VAK = THEMES.filter((theme) => theme.group === 'vak').map((theme) => theme.id);
const ALGEMEEN = THEMES.filter((theme) => theme.group === 'algemeen').map((theme) => theme.id);

/** Het laatste thema uit deze groep waar nieuwe woorden uit kwamen. */
function lastTheme(days: Record<string, DayLog>, group: readonly string[]): string | null {
  const ordered = Object.keys(days).sort().reverse();
  for (const day of ordered) {
    const themes = days[day]?.themes ?? [];
    for (let i = themes.length - 1; i >= 0; i--) if (group.includes(themes[i]!)) return themes[i]!;
  }
  return null;
}

const bare = (text: string) => text.toLocaleLowerCase('nl').replace(/^(de|het|een)\s+/, '').trim();

/**
 * De bank markeert verwante woorden voor spreiding bij eerste aanbieding. Sommige studies vinden
 * interferentie bij semantisch gegroepeerde nieuwe woorden; dit is geen wet voor elke leerling.
 */
export function clash(a: BankWord, b: BankWord): boolean {
  const near = (x: BankWord, y: BankWord) => {
    const word = bare(y.word);
    const related = [x.contrast?.word, ...(x.synonyms ?? []), ...(x.opposites ?? []), ...(x.family ?? [])];
    return related.some((other) => other !== undefined && bare(other) === word);
  };
  return near(a, b) || near(b, a);
}

function pickFrom(group: readonly string[], start: string | null, count: number, taken: Set<string>, picked: BankWord[], avoid: readonly BankWord[]): string[] {
  const used: string[] = [];
  if (count <= 0 || group.length === 0) return used;
  const first = start && group.includes(start) ? group.indexOf(start) : 0;
  for (let step = 0; step < group.length && count > 0; step++) {
    const themeId = group[(first + step) % group.length]!;
    let took = false;
    for (const word of themeWords(themeId)) {
      if (count <= 0) break;
      if (taken.has(word.id) || picked.some((other) => clash(word, other)) || avoid.some((other) => clash(word, other))) continue;
      picked.push(word);
      taken.add(word.id);
      count--;
      took = true;
    }
    if (took) used.push(themeId);
  }
  return used;
}

const nextIn = (group: readonly string[], last: string | null) => (last === null ? (group[0] ?? null) : (group[(group.indexOf(last) + 1) % group.length] ?? null));

/**
 * De nieuwe woorden voor een ronde. Elke dag een ander vakthema en een ander algemeen thema (zo
 * blijft het afwisselend), binnen het thema de belangrijkste woorden eerst, en nooit twee woorden
 * die je makkelijk verwart op dezelfde dag: ook niet met de woorden die je vandaag al leerde
 * (`avoid`).
 */
export function chooseNewWords(
  data: WordsData,
  count: number,
  exclude: readonly string[] = [],
  avoid: readonly BankWord[] = [],
): { words: BankWord[]; themes: string[] } {
  const taken = new Set([...Object.keys(data.cards), ...exclude]);
  const picked: BankWord[] = [];
  const themes: string[] = [];
  const preferred = data.next && VAK.includes(data.next) ? data.next : null;
  const preferredGeneral = data.next && ALGEMEEN.includes(data.next) ? data.next : null;
  // Een thema dat je zelf koos, gaat voor, ook uit de groep die je instelling overslaat.
  const offFocus = (data.focus === 'algemeen' && preferred) || (data.focus === 'vak' && preferredGeneral);
  if (offFocus) themes.push(...pickFrom([offFocus], offFocus, count, taken, picked, avoid));
  const left = count - picked.length;
  const vakCount = data.focus === 'vak' ? left : data.focus === 'algemeen' ? 0 : Math.ceil(left * 0.6);
  const vakStart = preferred ?? nextIn(VAK, lastTheme(data.days, VAK));
  const algStart = preferredGeneral ?? nextIn(ALGEMEEN, lastTheme(data.days, ALGEMEEN));
  themes.push(...pickFrom(VAK, vakStart, vakCount, taken, picked, avoid));
  themes.push(...pickFrom(ALGEMEEN, algStart, count - picked.length, taken, picked, avoid));
  // Is één groep op, dan vult de andere aan.
  if (picked.length < count) themes.push(...pickFrom(VAK, vakStart, count - picked.length, taken, picked, avoid));
  return { words: picked, themes: [...new Set(themes)] };
}

/* ------------------------------------------------------------------ de ronde bouwen */

export type WordRound = {
  day: string;
  /** 0 = de ronde van de dag, 1, 2, … = extra rondes. */
  round: number;
  newIds: string[];
  reviewIds: string[];
  themes: string[];
  plan: PlanStep[];
};

type Track = { word: BankWord; next: number; lastAt: number };

/** Nieuwe woorden en herhalingen door elkaar, met tussenpozen per woord. Puur en vast per dag. */
export function interleave(newWords: readonly BankWord[], reviews: readonly PlanStep[]): PlanStep[] {
  const out: PlanStep[] = [];
  const queue = [...reviews];
  out.push(...queue.splice(0, Math.min(WARMUP, queue.length)));
  const pending: Track[] = newWords.map((word) => ({ word, next: 0, lastAt: -Infinity }));
  const active: Track[] = [];
  const emit = (track: Track) => {
    out.push(wordTaskItem(track.word, NEW_TASKS[track.next]!));
    track.lastAt = out.length - 1;
    track.next++;
    if (track.next >= NEW_TASKS.length) active.splice(active.indexOf(track), 1);
  };
  const waited = (track: Track) => out.length - track.lastAt - 1;
  while (pending.length || active.length || queue.length) {
    const ready = active.find((track) => waited(track) >= (MIN_GAP[track.next] ?? 0));
    if (ready) emit(ready);
    else if (pending.length && active.length < MAX_ACTIVE) {
      const track = pending.shift()!;
      active.push(track);
      emit(track);
    } else if (queue.length) out.push(queue.shift()!);
    else {
      // Niets meer om de tussenpoos mee te vullen: het woord dat het langst wacht, gaat voor.
      const longest = [...active].sort((a, b) => waited(b) - waited(a))[0]!;
      emit(longest);
    }
  }
  return out;
}

function situationKey(themes: readonly string[], day: string): string {
  const theme = THEMES.find((candidate) => themes.includes(candidate.id) && candidate.situations.length > 0);
  const n = Math.abs(daysBetween('2026-01-01', day));
  return theme ? `${theme.id}.${n % theme.situations.length}` : `algemeen.${n % GENERAL_SITUATIONS.length}`;
}

/** Kies voor de schrijfopdracht eerst vakwoorden, dan een algemeen woord; hoogstens drie. */
function composeWords(words: readonly BankWord[]): BankWord[] {
  const vak = words.filter((word) => VAK.includes(word.theme));
  const rest = words.filter((word) => !VAK.includes(word.theme));
  return [...vak.slice(0, 2), ...rest.slice(0, 1), ...vak.slice(2)].slice(0, 3);
}

export function buildRound(data: WordsData, day: string, round: number, exclude: readonly string[] = []): WordRound {
  const reviewIds = round === 0 ? dueIds(data.cards, day).filter((id) => getWord(id)).slice(0, MAX_REVIEWS) : [];
  const learnedToday = (data.days[day]?.added ?? []).map(getWord).filter((word) => word !== undefined);
  const { words, themes } = chooseNewWords(data, data.perDay, exclude, learnedToday);
  const reviews = shuffle(
    `${day}:${round}`,
    reviewIds.map((id) => wordTaskItem(getWord(id)!, reviewTask(data.cards[id]!))),
  );
  const plan = interleave(words, reviews);
  if (words.length >= 2) {
    const key = situationKey(themes, day);
    const situation = situationFor(key);
    if (situation) plan.push(composeItem(composeWords(words), situation, key));
  }
  plan.push(...shuffle(`${day}:${round}:eind`, words).map((word) => wordTaskItem(word, 'recall1')));
  return { day, round, newIds: words.map((word) => word.id), reviewIds, themes, plan };
}

/** Ruwe schatting van de duur in minuten: schrijven duurt langer dan kiezen. */
export function estimateMinutes(plan: readonly PlanStep[]): number {
  const seconds = plan.reduce((sum, item) => sum + (item.step.kind === 'use' ? 90 : item.step.kind === 'word' ? 45 : 25), 0);
  return Math.max(1, Math.round(seconds / 60));
}

/* ------------------------------------------------------------------ nakijken */

type Result = { task: Task; score: number | null; response: WordResponse | null };

/** De uitkomst per woord uit een (afgeronde of afgebroken) ronde. */
export function wordResults(session: SessionState): Map<string, Result[]> {
  const results = new Map<string, Result[]>();
  session.plan.forEach((key) => {
    const parsed = parseWordKey(key);
    if (parsed?.kind !== 'task') return;
    const pos = session.queue.indexOf(key);
    const reached = session.phase === 'done' || pos < session.pos || (pos === session.pos && session.phase === 'feedback');
    if (!reached) return;
    const raw = session.responses[String(pos)];
    const response = raw && 'kind' in raw && ['word', 'guess', 'recall', 'scene', 'use'].includes(raw.kind) ? (raw as WordResponse) : null;
    const list = results.get(parsed.wordId) ?? [];
    list.push({ task: parsed.task, score: session.firstTry[key] ?? null, response });
    results.set(parsed.wordId, list);
  });
  return results;
}

function ratingGrade(result: Result): Grade | null {
  if (result.response?.kind !== 'use' || result.response.rating === null) return null;
  return result.response.rating === 2 ? 3 : result.response.rating === 1 ? 2 : 1;
}

/** Hoe het nieuwe woord aan het eind van de eerste dag zit: alles goed, iets fout, of het eind fout. */
export function newWordGrade(results: readonly Result[]): Grade {
  const scored = results.filter((result) => result.score !== null);
  const final = results.find((result) => result.task === 'recall1');
  let grade: Grade;
  if (final && final.score !== null && final.score < 1) grade = 1;
  else if (scored.length > 0 && scored.every((result) => (result.score ?? 0) >= 1)) grade = 3;
  else if (scored.length > 0) grade = 2;
  else grade = 1;
  const use = results.map(ratingGrade).find((g) => g !== null);
  if (use !== undefined && use !== null && use < grade) grade = Math.max(1, use) as Grade;
  return grade;
}

/** Beoordeling van een herhaling: de eerste poging, met inzet of zelfoordeel waar dat er is. */
export function reviewGrade(results: readonly Result[]): Grade | null {
  const result = results.find((item) => item.task !== 'guess' && item.task !== 'card');
  if (!result) return null;
  const use = ratingGrade(result);
  if (result.task === 'use0' || result.task === 'use1') return use;
  if (result.score === null) return null;
  return result.score < 1 ? 1 : 3;
}

/** Een ronde verwerken in de woordgegevens: nieuwe woorden beginnen, herhalingen bijwerken. */
export function commitRound(
  data: WordsData,
  round: Pick<WordRound, 'day' | 'round' | 'newIds' | 'reviewIds' | 'themes'>,
  session: SessionState,
  bets: Record<string, 1 | 2 | 3> = {},
): WordsData {
  const results = wordResults(session);
  const cards = { ...data.cards };
  const added: string[] = [];
  const reviewed: string[] = [];
  const kept: string[] = [];
  for (const id of round.newIds) {
    const list = results.get(id) ?? [];
    // Pas een nieuw woord als je de kaart gezien hebt (en als het nog in de bank staat).
    if (!getWord(id) || !list.some((result) => result.task === 'card') || cards[id]) continue;
    const first = list.find((result) => result.task === 'recall0');
    const end = newWordGrade(list);
    cards[id] = first && first.score !== null ? learnCard(first.score >= 1 ? 3 : 1, round.day, end) : learnCard(end, round.day);
    added.push(id);
  }
  for (const id of round.reviewIds) {
    const card = cards[id];
    const list = results.get(id);
    if (!card || !list || !getWord(id) || card.last === round.day) continue;
    let grade = reviewGrade(list);
    if (grade === null) continue;
    const bet = bets[id];
    if (grade === 3 && bet === 3) grade = 4;
    if (grade === 3 && bet === 1) grade = 2;
    cards[id] = reviewCard(card, grade, round.day);
    reviewed.push(id);
    if (grade > 1) kept.push(id);
  }
  // Alleen de thema's waar je echt woorden uit leerde, tellen (voor de afwisseling en je gekozen thema).
  const addedThemes = new Set(added.map((id) => getWord(id)?.theme).filter((theme) => theme !== undefined));
  const before = data.days[round.day];
  const finished = session.phase === 'done';
  const day: DayLog = {
    added: [...new Set([...(before?.added ?? []), ...added])],
    reviewed: [...new Set([...(before?.reviewed ?? []), ...reviewed])],
    kept: [...new Set([...(before?.kept ?? []), ...kept])],
    themes: [...new Set([...(before?.themes ?? []), ...round.themes.filter((theme) => addedThemes.has(theme))])],
    done: (before?.done ?? false) || (finished && round.round === 0),
    ms: (before?.ms ?? 0) + session.activeMs,
  };
  const next = data.next && addedThemes.has(data.next) ? null : data.next;
  return { ...data, next, cards, days: { ...data.days, [round.day]: day } };
}

/** De inzet bij "Wat betekent …?" per woord (die staat in het antwoord, niet in de score). */
export function sessionBets(session: SessionState): Record<string, 1 | 2 | 3> {
  const bets: Record<string, 1 | 2 | 3> = {};
  session.plan.forEach((key) => {
    const parsed = parseWordKey(key);
    if (parsed?.kind !== 'task' || parsed.task !== 'meaning') return;
    const response = session.responses[String(session.queue.indexOf(key))];
    if (response?.kind === 'bet' && response.bet) bets[parsed.wordId] = response.bet;
  });
  return bets;
}

/** Bestaan alle stappen van een opgeslagen ronde nog? */
export function roundUsable(session: SessionState): boolean {
  return session.queue.every((key) => lookupWordStep(key) !== undefined);
}
