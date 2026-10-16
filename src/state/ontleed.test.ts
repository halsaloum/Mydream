import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getOntleedLesson, ontleedLessons } from '@/content/ontleed';
import type { Question } from '@/content/ontleed/types';
import type { Answer } from '@/lib/ontleed/grade';
import { learningDay, retrievalEvidenceCount } from '@/lib/ontleed/learning';
import { getSectionCoach } from '@/lib/ontleed/lesson-coach';
import { EMPTY_ONTLEED, ONTLEED_KEY, OntleedDataSchema, hasTransferCriteria, transferWordCount, useOntleed } from './ontleed';

const DAY = 86_400_000;
const NOW = Date.parse('2026-10-15T10:00:00Z');
const lesson = getOntleedLesson('betekenis-woord-zin-context')!;
const other = getOntleedLesson('betekenis-verwijzing')!;
const draft = 'Mijn eerste voorbeeld bevat een duidelijke uitleg over de gekozen woorden en hun betekenis.';
function right(question: Question): Answer {
  if (question.kind === 'choice') return question.answer;
  if (question.kind === 'type') return question.accept[0]!;
  if (question.kind === 'mark') return [...question.targets];
  const remaining = question.tokens.map((_, index) => index);
  return question.accept[0]!.split(' ').map(token => {
    const found = remaining.find(index => question.tokens[index] === token)!;
    remaining.splice(remaining.indexOf(found), 1);
    return found;
  });
}
function answerPractice(target = lesson, wrongFirst = false) {
  useOntleed.getState().start(target.id);
  target.practice.forEach((question, index) => {
    const value = wrongFirst && index === 0 && question.kind === 'choice' ? (question.answer + 1) % question.options.length : right(question);
    useOntleed.getState().answer(target.id, question.id, value, true, question.concept);
  });
  useOntleed.getState().patch(target.id, { draft, checks: target.transfer.checklist.map((_, index) => index) });
}
function complete(target = lesson, wrongFirst = false) {
  answerPractice(target, wrongFirst);
  useOntleed.getState().complete(target.id, target.practice.map(question => question.id), target.transfer.checklist.length);
}
function begin(target = lesson) {
  const question = target.retrieval[0]!;
  useOntleed.getState().beginReview([{ lessonId: target.id, questionId: question.id }]);
  return question;
}
async function reload() {
  const saved = window.localStorage.getItem(ONTLEED_KEY)!;
  useOntleed.setState(EMPTY_ONTLEED);
  window.localStorage.setItem(ONTLEED_KEY, saved);
  await useOntleed.persist.rehydrate();
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
  useOntleed.getState().replace(EMPTY_ONTLEED);
  window.localStorage.clear();
});

describe('Ontleed: fouten herstellen zonder eerste pogingen te overschrijven', () => {
  it('bewaart de fout, echte verbetering, latere oefenwachtrij en voorspelling na herladen', async () => {
    const question = lesson.practice[0]!;
    if (question.kind !== 'choice') throw new Error('Choice fixture required.');
    useOntleed.getState().answer(lesson.id, question.id, (question.answer + 1) % question.options.length, true, question.concept);
    const first = useOntleed.getState().sessions[lesson.id]!.answers[question.id];
    useOntleed.getState().retry(lesson.id, question.id, question.answer);
    useOntleed.getState().patch(lesson.id, { predictions: { '0': { draft: 'Ik vervang de woordgroep.', revealed: true } } });
    useOntleed.getState().setWritingDraft('Mijn eigen tekst blijft staan.');
    await reload();
    const session = useOntleed.getState().sessions[lesson.id]!;
    expect(session.answers[question.id]).toEqual(first);
    expect(session.corrections[question.id]).toMatchObject({ correct: true });
    expect(session.predictions['0']).toEqual({ draft: 'Ik vervang de woordgroep.', revealed: true });
    expect(useOntleed.getState().mistakes[`${lesson.id}:${question.id}`]).toMatchObject({ resolved: false, due: NOW + DAY, attempts: 0 });
    expect(useOntleed.getState().writingDraft).toBe('Mijn eigen tekst blijft staan.');
    useOntleed.getState().repair(lesson.id, question.id, question.answer);
    expect(useOntleed.getState().sessions[lesson.id]!.repairs[question.id]?.correct).toBe(true);
    expect(useOntleed.getState().sessions[lesson.id]!.answers[question.id]).toEqual(first);
  });

  it('herhaalt fouten van onafgeronde lessen en vereist twee verschillende dagen om ze af te voeren', () => {
    const question = lesson.practice[0]!;
    if (question.kind !== 'choice') throw new Error('Choice fixture required.');
    useOntleed.getState().answer(lesson.id, question.id, (question.answer + 1) % question.options.length, false, question.concept);
    const key = `${lesson.id}:${question.id}`;
    for (const at of [NOW + DAY, NOW + DAY + 60_000, NOW + 2 * DAY]) {
      vi.setSystemTime(at);
      useOntleed.getState().beginReview([{ lessonId: lesson.id, questionId: question.id, source: 'mistake' }]);
      expect(useOntleed.getState().reviewRound).not.toBeNull();
      useOntleed.getState().review(lesson.id, question.id, question.answer, true, question.concept, at);
      expect(useOntleed.getState().mistakes[key]!.resolved).toBe(at === NOW + 2 * DAY);
      useOntleed.getState().closeReview();
    }
    expect(useOntleed.getState().completed[lesson.id]).toBeUndefined();
    expect(useOntleed.getState().mistakes[key]!.successfulDays).toHaveLength(2);
  });

  it('herkent oude opgeslagen fouten en voegt nieuwe velden toe zonder oude antwoorden te veranderen', () => {
    const question = lesson.practice[0]!;
    const attempt = { answer: 0, correct: false, concept: question.concept, at: NOW };
    const parsed = OntleedDataSchema.parse({ sessions: { [lesson.id]: { step: 2, answers: { [question.id]: attempt }, draft: 'bewaard', checks: [], startedAt: NOW } }, completed: {}, retrieval: {}, reviewAnswers: {}, lastLesson: lesson.id });
    expect(parsed.sessions[lesson.id]!.answers[question.id]).toEqual(attempt);
    expect(parsed.sessions[lesson.id]!.corrections).toEqual({});
    expect(parsed.sessions[lesson.id]!.theoryProgress).toEqual({});
    expect(parsed.mistakes[`${lesson.id}:${question.id}`]?.resolved).toBe(false);
    expect(parsed.writingDraft).toBe('');
    const retrievalQuestion = lesson.retrieval[0]!;
    const withOldReview = OntleedDataSchema.parse({ ...parsed, reviewAnswers: { [`${lesson.id}:${retrievalQuestion.id}`]: { ...attempt, concept: retrievalQuestion.concept } } });
    expect(withOldReview.mistakes[`${lesson.id}:${retrievalQuestion.id}`]?.resolved).toBe(false);
  });

  it('verwerpt losse verbeteringen, toekomstige aanwijzingen en onmogelijke foutgegevens bij import', () => {
    complete(); begin();
    const data = useOntleed.getState();
    const round = data.reviewRound!;
    const attempt = { answer: 0, correct: true, at: NOW, concept: 'test' };
    expect(OntleedDataSchema.safeParse({ ...data, reviewRound: { ...round, corrections: { '0': attempt } } }).success).toBe(false);
    expect(OntleedDataSchema.safeParse({ ...data, reviewRound: { ...round, assisted: [1] } }).success).toBe(false);
    const mistake = { lessonId: lesson.id, questionId: lesson.practice[0]!.id, due: NOW, addedAt: NOW, last: NOW, misses: 1, attempts: 1, correct: 1, successfulDays: ['2026-10-15'], resolved: false };
    expect(OntleedDataSchema.safeParse({ ...data, mistakes: { 'verkeerde:sleutel': mistake } }).success).toBe(false);
    const key = `${mistake.lessonId}:${mistake.questionId}`;
    expect(OntleedDataSchema.safeParse({ ...data, mistakes: { [key]: { ...mistake, resolved: true } } }).success).toBe(false);
    expect(OntleedDataSchema.safeParse({ ...data, mistakes: { [key]: { ...mistake, successfulDays: ['2026-02-30'] } } }).success).toBe(false);
    const question = lesson.retrieval[0]!;
    expect(() => useOntleed.getState().review(lesson.id, question.id, right(question), true, question.concept, Number.MAX_VALUE)).not.toThrow();
    expect(useOntleed.getState().reviewRound!.responses).toEqual({});
  });
});

describe('Ontleed: bewaarde interactieve uitleg', () => {
  it('behoudt een eerder onthulde uitleg als een optionele notitie korter wordt', async () => {
    useOntleed.getState().patch(lesson.id, { predictions: { '0': { draft: 'Mijn eerdere lange voorspelling.', revealed: true } } });
    useOntleed.getState().patch(lesson.id, { predictions: { '0': { draft: 'Duidelijk', revealed: true } } });
    await reload();
    expect(useOntleed.getState().sessions[lesson.id]!.predictions['0']).toEqual({ draft: 'Duidelijk', revealed: true });
  });

  it('hervat bekeken voorbeelden en een kennischeck na herladen en import, en wist ze bij een herstart', async () => {
    const progress = { '0': { viewed: [0], answer: getSectionCoach(lesson, 0).check.answer } };
    useOntleed.getState().patch(lesson.id, { theoryProgress: progress });
    progress['0'].viewed.push(999);
    await reload();
    const saved = useOntleed.getState().sessions[lesson.id]!.theoryProgress;
    expect(saved).toEqual({ '0': { viewed: [0], answer: getSectionCoach(lesson, 0).check.answer } });
    const exported = JSON.parse(window.localStorage.getItem(ONTLEED_KEY)!).state;
    useOntleed.getState().replace(EMPTY_ONTLEED);
    useOntleed.getState().replace(exported);
    expect(useOntleed.getState().sessions[lesson.id]!.theoryProgress).toEqual(saved);
    useOntleed.getState().restart(lesson.id);
    expect(useOntleed.getState().sessions[lesson.id]!.theoryProgress).toEqual({});
  });

  it('bewaart alleen bestaande secties, unieke voorbeeldnummers en geldige antwoordopties', () => {
    const optionCount = getSectionCoach(lesson, 0).check.options.length;
    useOntleed.getState().patch(lesson.id, { theoryProgress: {
      '0': { viewed: [0, 0, lesson.sections[0]!.examples.length, 999], answer: optionCount },
      '01': { viewed: [0], answer: 0 },
      '-1': { viewed: [], answer: 0 },
      [String(lesson.sections.length)]: { viewed: [], answer: 0 },
    } });
    expect(useOntleed.getState().sessions[lesson.id]!.theoryProgress).toEqual({ '0': { viewed: [0] } });
    useOntleed.getState().patch(lesson.id, { theoryProgress: { '0': { viewed: [0, -1], answer: -1 } } });
    expect(useOntleed.getState().sessions[lesson.id]!.theoryProgress).toEqual({ '0': { viewed: [0] } });
  });

  it('normaliseert verouderde uitlegvoortgang bij import zonder andere lesgegevens te verliezen', () => {
    useOntleed.getState().start(lesson.id);
    useOntleed.getState().patch(lesson.id, { draft: 'Mijn bewaarde tekst', step: 1 });
    const session = useOntleed.getState().sessions[lesson.id]!;
    const imported = OntleedDataSchema.parse({ ...EMPTY_ONTLEED, sessions: { [lesson.id]: {
      ...session, theoryProgress: { '0': { viewed: [0, 0, 999], answer: 999 }, '999': { viewed: [0], answer: 0 } },
    } } });
    expect(imported.sessions[lesson.id]).toMatchObject({ draft: 'Mijn bewaarde tekst', step: 1, theoryProgress: { '0': { viewed: [0] } } });
    const legacy: Partial<typeof session> = { ...session };
    delete legacy.theoryProgress;
    const older = OntleedDataSchema.parse({ ...EMPTY_ONTLEED, sessions: { [lesson.id]: legacy } });
    expect(older.sessions[lesson.id]!.theoryProgress).toEqual({});
    expect(older.sessions[lesson.id]!.draft).toBe(session.draft);
  });
});

describe('Ontleed: uitgestelde productie als apart bewijs', () => {
  const productive = ontleedLessons.find(target => target.retrieval.some(question => question.kind === 'type'))!;
  const question = productive.retrieval.find(candidate => candidate.kind === 'type')!;
  function attempt(at: number, options: { hint?: boolean; wrong?: boolean } = {}) {
    vi.setSystemTime(at);
    useOntleed.getState().beginReview([{ lessonId: productive.id, questionId: question.id }]);
    if (options.hint) useOntleed.getState().markReviewAssisted();
    useOntleed.getState().review(productive.id, question.id, options.wrong ? 'een fout antwoord' : right(question), true, question.concept, at);
    useOntleed.getState().closeReview();
  }

  it('telt dagen eenmaal, bewaart productie naast afronding en geeft een hint geen zelfstandig bewijs', () => {
    complete(productive);
    attempt(NOW + DAY, { hint: true });
    expect(retrievalEvidenceCount(useOntleed.getState().retrieval[productive.id])).toBe(0);
    attempt(NOW + DAY);
    attempt(NOW + DAY + 60_000);
    expect(retrievalEvidenceCount(useOntleed.getState().retrieval[productive.id])).toBe(1);
    attempt(NOW + 2 * DAY);
    expect(retrievalEvidenceCount(useOntleed.getState().retrieval[productive.id])).toBe(2);
    expect(useOntleed.getState().completed[productive.id]!.count).toBe(1);
  });

  it('telt een verbeterde fout niet als een juiste eerste productie', () => {
    complete(productive);
    const at = NOW + DAY;
    useOntleed.getState().beginReview([{ lessonId: productive.id, questionId: question.id }]);
    useOntleed.getState().review(productive.id, question.id, 'onjuist', false, question.concept, at);
    const schedule = useOntleed.getState().retrieval[productive.id];
    useOntleed.getState().retryReview(right(question));
    expect(useOntleed.getState().reviewRound!.responses['0']!.correct).toBe(false);
    expect(useOntleed.getState().reviewRound!.corrections['0']!.correct).toBe(true);
    expect(useOntleed.getState().retrieval[productive.id]).toEqual(schedule);
    expect(retrievalEvidenceCount(schedule)).toBe(0);
  });

  it('telt meerkeuze en markeren niet als productie, ook als het eerste antwoord klopt', () => {
    for (const kind of ['choice', 'mark']) {
      const target = ontleedLessons.find(candidate => candidate.retrieval.some(item => item.kind === kind));
      if (!target) continue;
      const item = target.retrieval.find(candidate => candidate.kind === kind)!;
      complete(target);
      useOntleed.getState().beginReview([{ lessonId: target.id, questionId: item.id }]);
      useOntleed.getState().review(target.id, item.id, right(item), true, item.concept, NOW + DAY);
      expect(retrievalEvidenceCount(useOntleed.getState().retrieval[target.id])).toBe(0);
      useOntleed.getState().closeReview();
    }
  });

  it('gebruikt de Nederlandse kalenderdag, ook rond middernacht en zomertijd', () => {
    expect(learningDay(Date.parse('2026-10-15T22:30:00Z'))).toBe('2026-10-16');
    expect(learningDay(Date.parse('2026-12-01T22:30:00Z'))).toBe('2026-12-01');
  });
});
afterEach(() => { vi.useRealTimers(); });

describe('Ontleed: echte lespogingen en overdracht', () => {
  it('bewaart het eerste antwoord en beschermt het tegen een patch en een tweede controle', () => {
    const question = lesson.practice[0]!;
    if (question.kind !== 'choice') throw new Error('Deze fixture hoort een keuzevraag te zijn.');
    const wrong = (question.answer + 1) % question.options.length;
    useOntleed.getState().answer(lesson.id, question.id, wrong, true, 'vervalst begrip');
    const first = useOntleed.getState().sessions[lesson.id]!.answers[question.id]!;
    expect(first).toMatchObject({ answer: wrong, correct: false, concept: question.concept });
    useOntleed.getState().answer(lesson.id, question.id, question.answer, true, question.concept);
    useOntleed.getState().patch(lesson.id, { answers: {}, startedAt: 0 } as never);
    expect(useOntleed.getState().sessions[lesson.id]!.answers[question.id]).toEqual(first);
    expect(useOntleed.getState().sessions[lesson.id]!.startedAt).toBe(NOW);
    useOntleed.getState().answer(lesson.id, 'onbekende-vraag', 0, true, 'onbekend');
    expect(Object.keys(useOntleed.getState().sessions[lesson.id]!.answers)).toEqual([question.id]);
  });

  it('kopieert gemarkeerde indices zodat een caller een bewaard eerste antwoord niet achteraf kan wijzigen', () => {
    const question = other.practice.find(candidate => candidate.kind === 'mark')!;
    if (question.kind !== 'mark') throw new Error('Deze fixture hoort markeren te ondersteunen.');
    const answer = [...question.targets];
    useOntleed.getState().answer(other.id, question.id, answer, true, question.concept);
    answer.pop();
    expect(useOntleed.getState().sessions[other.id]!.answers[question.id]!.answer).toEqual(question.targets);
  });

  it('bewaart een onvoltooid en een gecontroleerd experiment bij herladen', async () => {
    const initial = { variant: 1, visited: [0, 1], placements: { '0': 1 } };
    useOntleed.getState().patch(lesson.id, { labDraft: initial });
    await reload();
    expect(useOntleed.getState().sessions[lesson.id]!.labDraft).toEqual(initial);
    const checked = { ...initial, checked: true, answer: [0, 2], correct: false };
    useOntleed.getState().patch(lesson.id, { labDraft: checked });
    await reload();
    expect(useOntleed.getState().sessions[lesson.id]!.labDraft).toEqual(checked);
    useOntleed.getState().restart(lesson.id);
    expect(useOntleed.getState().sessions[lesson.id]!.labDraft).toBeUndefined();
  });

  it('vereist alle echte oefenvragen, minstens twaalf woorden en ieder werkelijk criterium', () => {
    answerPractice();
    const ids = lesson.practice.map(question => question.id), count = lesson.transfer.checklist.length;
    useOntleed.getState().complete(lesson.id, [ids[0]!], count);
    expect(useOntleed.getState().completed[lesson.id]).toBeUndefined();
    useOntleed.getState().patch(lesson.id, { draft: 'te kort' });
    useOntleed.getState().complete(lesson.id, ids, count);
    expect(useOntleed.getState().completed[lesson.id]).toBeUndefined();
    expect(transferWordCount('... ... ... ... ... ... ... ... ... ... ... ...')).toBe(0);
    useOntleed.getState().patch(lesson.id, { draft, checks: [0] });
    useOntleed.getState().complete(lesson.id, ids, count);
    expect(useOntleed.getState().completed[lesson.id]).toBeUndefined();
    expect(hasTransferCriteria(Array.from({ length: count }, (_, index) => index + 1), count)).toBe(false);
    expect(hasTransferCriteria(Array.from({ length: count }, () => 0), count)).toBe(false);
    const session = useOntleed.getState().sessions[lesson.id]!;
    useOntleed.setState({ sessions: { [lesson.id]: { ...session, checks: Array.from({ length: count }, (_, index) => index + 1) } } });
    useOntleed.getState().complete(lesson.id, ids, count);
    expect(useOntleed.getState().completed[lesson.id]).toBeUndefined();
    useOntleed.getState().patch(lesson.id, { checks: Array.from({ length: count }, (_, index) => index) });
    useOntleed.getState().complete(lesson.id, ids, count);
    expect(useOntleed.getState().completed[lesson.id]).toMatchObject({ count: 1, accuracy: 100 });
    expect(useOntleed.getState().retrieval[lesson.id]).toMatchObject({ due: NOW + DAY, interval: 0, attempts: 0 });
  });

  it('rondt een sessie eenmalig af en maakt herstart op dezelfde kloktijd werkelijk onafgerond', () => {
    complete(lesson, true);
    const initial = useOntleed.getState().completed[lesson.id]!;
    expect(initial.accuracy).toBe(80);
    useOntleed.getState().complete(lesson.id, lesson.practice.map(question => question.id), lesson.transfer.checklist.length);
    expect(useOntleed.getState().completed[lesson.id]).toEqual(initial);
    const retrieval = useOntleed.getState().retrieval[lesson.id];
    useOntleed.getState().restart(lesson.id);
    const fresh = useOntleed.getState().sessions[lesson.id]!;
    expect(fresh.answers).toEqual({});
    expect(fresh.startedAt).toBeGreaterThan(initial.at);
    expect(useOntleed.getState().completed[lesson.id]!.at >= fresh.startedAt).toBe(false);
    useOntleed.getState().complete(lesson.id, lesson.practice.map(question => question.id), lesson.transfer.checklist.length);
    expect(useOntleed.getState().completed[lesson.id]!.count).toBe(1);
    answerPractice();
    useOntleed.getState().complete(lesson.id, lesson.practice.map(question => question.id), lesson.transfer.checklist.length);
    expect(useOntleed.getState().completed[lesson.id]).toMatchObject({ count: 2, accuracy: 100, firstAccuracy: 80 });
    expect(useOntleed.getState().retrieval[lesson.id]).toEqual(retrieval);
    expect(useOntleed.getState().completed[lesson.id]!.at).toBeGreaterThanOrEqual(fresh.startedAt);
  });

  it('hervat een geïmporteerde deelsessie zonder het eerste antwoord, schrijfwerk of positie te verliezen', async () => {
    answerPractice(lesson, true);
    useOntleed.getState().patch(lesson.id, { step: 4 });
    const before = useOntleed.getState().sessions[lesson.id];
    const parsed = OntleedDataSchema.parse(JSON.parse(window.localStorage.getItem(ONTLEED_KEY)!).state);
    useOntleed.getState().replace(EMPTY_ONTLEED);
    useOntleed.getState().replace(parsed);
    await reload();
    expect(useOntleed.getState().sessions[lesson.id]).toEqual(before);
    expect(useOntleed.getState().completed).toEqual({});
    expect(typeof useOntleed.getState().complete).toBe('function');
  });
});

describe('Ontleed: bewaarde gespreide kennischecks', () => {
  it('staat geen los antwoord, ongeldige vraag, vervangende ronde of volgende vraag zonder eerste antwoord toe', () => {
    complete();
    const question = lesson.retrieval[0]!;
    useOntleed.getState().review(lesson.id, question.id, right(question), true, question.concept);
    expect(useOntleed.getState().retrieval[lesson.id]!.attempts).toBe(0);
    useOntleed.getState().beginReview([{ lessonId: other.id, questionId: other.retrieval[0]!.id }, { lessonId: lesson.id, questionId: 'verwijderd' }]);
    expect(useOntleed.getState().reviewRound).toBeNull();
    begin();
    const round = useOntleed.getState().reviewRound;
    useOntleed.getState().beginReview([{ lessonId: lesson.id, questionId: lesson.retrieval[1]!.id }]);
    expect(useOntleed.getState().reviewRound).toEqual(round);
    useOntleed.getState().advanceReview();
    expect(useOntleed.getState().reviewRound!.position).toBe(0);
    useOntleed.getState().review(lesson.id, lesson.retrieval[1]!.id, right(lesson.retrieval[1]!), true, question.concept);
    expect(useOntleed.getState().retrieval[lesson.id]!.attempts).toBe(0);
    useOntleed.getState().review(lesson.id, question.id, right(question), true, question.concept);
    useOntleed.getState().advanceReview();
    useOntleed.getState().advanceReview();
    expect(useOntleed.getState().reviewRound!.position).toBe(1);
    useOntleed.getState().review(lesson.id, question.id, right(question), true, question.concept);
    expect(useOntleed.getState().retrieval[lesson.id]!.attempts).toBe(1);
  });

  it('houdt alleen unieke afgeronde lessen over en kopieert de vraagselectie', () => {
    complete(); complete(other);
    const items = [{ lessonId: lesson.id, questionId: lesson.retrieval[0]!.id }, { lessonId: lesson.id, questionId: lesson.retrieval[1]!.id }, { lessonId: other.id, questionId: other.retrieval[0]!.id }];
    useOntleed.getState().beginReview(items);
    items[0]!.questionId = 'achteraf-gewijzigd';
    expect(useOntleed.getState().reviewRound!.items).toEqual([{ lessonId: lesson.id, questionId: lesson.retrieval[0]!.id }, { lessonId: other.id, questionId: other.retrieval[0]!.id }]);
  });

  it('beperkt een grote selectie tot acht kennischecks', () => {
    const selected = ontleedLessons.slice(0, 10);
    useOntleed.getState().replace({ ...EMPTY_ONTLEED,
      completed: Object.fromEntries(selected.map(target => [target.id, { at: NOW, accuracy: 100, firstAccuracy: 100, count: 1 }])),
      retrieval: Object.fromEntries(selected.map(target => [target.id, { due: NOW + DAY, interval: 0, attempts: 0, correct: 0, last: 0 }])),
    });
    useOntleed.getState().beginReview(selected.map(target => ({ lessonId: target.id, questionId: target.retrieval[0]!.id })));
    expect(useOntleed.getState().reviewRound!.items).toHaveLength(8);
  });

  it('plant na de eerste dag bij goede eerste antwoorden 3, 7, 21 en 21 dagen; een fout zet terug naar 1', () => {
    complete();
    expect(useOntleed.getState().retrieval[lesson.id]!.due).toBe(NOW + DAY);
    for (const days of [3, 7, 21, 21]) {
      const at = useOntleed.getState().retrieval[lesson.id]!.due;
      vi.setSystemTime(at);
      const question = begin();
      useOntleed.getState().review(lesson.id, question.id, right(question), true, question.concept, at);
      expect(useOntleed.getState().retrieval[lesson.id]!.due).toBe(at + days * DAY);
      useOntleed.getState().advanceReview(); useOntleed.getState().closeReview();
    }
    const at = useOntleed.getState().retrieval[lesson.id]!.due;
    vi.setSystemTime(at);
    const question = begin();
    if (question.kind !== 'choice') throw new Error('Deze fixture hoort een keuzevraag te zijn.');
    useOntleed.getState().review(lesson.id, question.id, (question.answer + 1) % question.options.length, true, question.concept, at);
    expect(useOntleed.getState().retrieval[lesson.id]).toMatchObject({ due: at + DAY, interval: 0, attempts: 5, correct: 4 });
  });

  it('bewaart foutfeedback en planning over herladen en telt dezelfde ronde nooit tweemaal', async () => {
    complete();
    const question = begin();
    if (question.kind !== 'choice') throw new Error('Deze fixture hoort een keuzevraag te zijn.');
    const at = NOW + DAY;
    useOntleed.getState().review(lesson.id, question.id, (question.answer + 1) % question.options.length, false, question.concept, at);
    const retrieval = useOntleed.getState().retrieval[lesson.id];
    await reload();
    expect(useOntleed.getState().reviewRound!.responses['0']).toMatchObject({ correct: false, at });
    useOntleed.getState().review(lesson.id, question.id, right(question), true, question.concept, at + DAY);
    expect(useOntleed.getState().retrieval[lesson.id]).toEqual(retrieval);
    useOntleed.getState().advanceReview();
    await reload();
    expect(useOntleed.getState().reviewRound!.position).toBe(1);
    useOntleed.getState().advanceReview();
    useOntleed.getState().review(lesson.id, question.id, right(question), true, question.concept);
    expect(useOntleed.getState().retrieval[lesson.id]).toEqual(retrieval);
  });

  it('verwerpt onmogelijke imports en laat alleen een verouderde actieve vraag vervallen', () => {
    complete(); begin();
    const { sessions, completed, retrieval, reviewAnswers, reviewRound, lastLesson } = useOntleed.getState();
    const data = { sessions, completed, retrieval, reviewAnswers, reviewRound, lastLesson };
    expect(OntleedDataSchema.safeParse({ ...data, reviewRound: { ...reviewRound, position: 2 } }).success).toBe(false);
    expect(OntleedDataSchema.safeParse({ ...data, reviewRound: { ...reviewRound, position: 1 } }).success).toBe(false);
    expect(OntleedDataSchema.safeParse({ ...data, retrieval: { [lesson.id]: { ...retrieval[lesson.id], correct: 2, attempts: 1 } } }).success).toBe(false);
    useOntleed.getState().replace({ ...data, reviewRound: { ...reviewRound!, position: 2 } });
    expect(useOntleed.getState().reviewRound).toEqual(reviewRound);
    const stale = OntleedDataSchema.parse({ ...data, reviewRound: { ...reviewRound, items: [{ lessonId: lesson.id, questionId: 'verouderde-vraag' }] } });
    expect(stale.reviewRound).toBeNull();
    expect(stale.completed).toEqual(completed);
    expect(stale.retrieval).toEqual(retrieval);
    const older = { ...data } as Partial<typeof data>;
    delete older.reviewRound;
    expect(OntleedDataSchema.parse(older).reviewRound).toBeNull();
    expect(OntleedDataSchema.parse({ ...older, retrieval: {} }).retrieval[lesson.id]).toMatchObject({ due: NOW + DAY, interval: 0, attempts: 0 });
  });
});
