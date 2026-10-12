import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ArgumentLesson } from '@/content/argumentation/types';
import { fingerprint } from '@/engine/hash';
import { emptyArgumentAnswer, gradeArgument } from '@/lib/argumentation/learning';
import { testArgumentLesson } from '@/lib/argumentation/test-fixtures';
import { theoryPages } from '@/lib/argumentation/theory-pages';
import { ArgumentDataSchema, ARGUMENTS_KEY, EMPTY_ARGUMENTS, pickArgumentData, useArgumentation } from './argumentation';
import { applyImport, exportData, parseImport, resetProgress } from './transfer';

const readingModel = vi.hoisted(() => ({ revision: 'initial' }));
vi.mock('@/lib/argumentation/theory-pages', () => ({
  theoryPages: () => [{ id: `reading-${readingModel.revision}`, kind: 'start', title: 'Eerste leespagina', label: 'Voorbereiding' }],
}));

beforeEach(() => { readingModel.revision = 'initial'; useArgumentation.getState().reset(); });

function solve(lesson: ArgumentLesson, firstWrong = false) {
  useArgumentation.getState().start(lesson);
  for (const [index, exercise] of lesson.exercises.entries()) {
    const answer = emptyArgumentAnswer();
    if (exercise.kind === 'choice') answer.value = firstWrong && index === 0 ? exercise.options.find((option) => option.id !== exercise.answer)!.id : exercise.answer;
    else if (exercise.kind === 'reflection') { answer.value = 'Mijn eigen analyse'; answer.rubric = Object.fromEntries(exercise.rubric.map((_, index) => [String(index), true])); }
    else answer.placements = Object.fromEntries(exercise.cards.map((card) => [card.id, card.category]));
    useArgumentation.getState().answer(lesson.id, exercise.id, answer);
    useArgumentation.getState().check(lesson.id, exercise.id, gradeArgument(exercise, answer));
    if (firstWrong && index === 0 && !lesson.checkpoint && exercise.kind === 'choice') {
      useArgumentation.getState().answer(lesson.id, exercise.id, { checked: false, value: exercise.answer });
      useArgumentation.getState().check(lesson.id, exercise.id, 1);
    }
  }
  useArgumentation.getState().finish(lesson);
}

describe('argumentatievoortgang', () => {
  it('begint lezen op pagina nul en wist die positie alleen bij een nieuwe sessie', () => {
    useArgumentation.getState().start(testArgumentLesson);
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]?.theoryPage).toBe(0);
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]?.readingSignature).toBe(fingerprint(theoryPages(testArgumentLesson)));
    useArgumentation.getState().setTheoryPage(testArgumentLesson.id, 2);
    useArgumentation.getState().start(testArgumentLesson);
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]?.theoryPage).toBe(2);
    useArgumentation.getState().start(testArgumentLesson, true);
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]?.theoryPage).toBe(0);
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]?.readingSignature).toBe(fingerprint(theoryPages(testArgumentLesson)));
    useArgumentation.getState().setTheoryPage(testArgumentLesson.id, 1);
    useArgumentation.getState().start({ ...testArgumentLesson, teaser: 'Nieuwe versie van deze les.' });
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]?.theoryPage).toBe(0);
    useArgumentation.getState().setTheoryPage(testArgumentLesson.id, 3);
    useArgumentation.getState().reset();
    useArgumentation.getState().start(testArgumentLesson);
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]?.theoryPage).toBe(0);
  });
  it('vernieuwt een oude leespositie zonder leessignatuur en behoudt al het oefenwerk', () => {
    solve(testArgumentLesson);
    useArgumentation.getState().start(testArgumentLesson, true);
    useArgumentation.getState().answer(testArgumentLesson.id, 'choice', { value: 'a', confidence: 2, reasoning: 'Dit antwoord wil ik later herzien.' });
    useArgumentation.getState().check(testArgumentLesson.id, 'choice', 0);
    useArgumentation.getState().move(testArgumentLesson.id, 2);
    useArgumentation.getState().openTheory(testArgumentLesson.id);
    useArgumentation.getState().setTheoryPage(testArgumentLesson.id, 3);
    const legacy = JSON.parse(JSON.stringify(pickArgumentData(useArgumentation.getState()))) as { sessions: Record<string, Record<string, unknown>> };
    delete legacy.sessions[testArgumentLesson.id]!.readingSignature;
    useArgumentation.getState().replace(ArgumentDataSchema.parse(legacy));
    const before = useArgumentation.getState().sessions[testArgumentLesson.id]!;
    const records = useArgumentation.getState().records;
    expect(before).toMatchObject({ theoryPage: 3, cursor: 0, resumeCursor: 2, firstTry: { choice: 0 }, firstConfidence: { choice: 2 } });
    expect(before.readingSignature).toBeUndefined();
    useArgumentation.getState().start(testArgumentLesson);
    const after = useArgumentation.getState().sessions[testArgumentLesson.id]!;
    expect(after).toEqual({ ...before, theoryPage: 0, readingSignature: fingerprint(theoryPages(testArgumentLesson)) });
    expect(after.answers).toBe(before.answers);
    expect(after.firstTry).toBe(before.firstTry);
    expect(after.firstConfidence).toBe(before.firstConfidence);
    expect(useArgumentation.getState().records).toBe(records);
  });
  it('bewaart een actuele leessignatuur en leespositie zonder de oefensessie aan te raken', () => {
    useArgumentation.getState().start(testArgumentLesson);
    useArgumentation.getState().answer(testArgumentLesson.id, 'choice', { value: 'b', confidence: 1 });
    useArgumentation.getState().check(testArgumentLesson.id, 'choice', 1);
    useArgumentation.getState().move(testArgumentLesson.id, 2);
    useArgumentation.getState().setTheoryPage(testArgumentLesson.id, 3);
    const before = useArgumentation.getState();
    expect(before.sessions[testArgumentLesson.id]?.readingSignature).toBe(fingerprint(theoryPages(testArgumentLesson)));
    useArgumentation.getState().start(testArgumentLesson);
    expect(useArgumentation.getState()).toBe(before);
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]?.theoryPage).toBe(3);
  });
  it('zet alleen de leespositie terug wanneer het onafhankelijke leespaginamodel verandert', () => {
    solve(testArgumentLesson);
    useArgumentation.getState().setTheoryPage(testArgumentLesson.id, 3);
    const before = useArgumentation.getState().sessions[testArgumentLesson.id]!;
    const records = useArgumentation.getState().records;
    readingModel.revision = 'with-foundation-pages';
    useArgumentation.getState().start(testArgumentLesson);
    const after = useArgumentation.getState().sessions[testArgumentLesson.id]!;
    const readingSignature = fingerprint(theoryPages(testArgumentLesson));
    expect(readingSignature).not.toBe(before.readingSignature);
    expect(after).toEqual({ ...before, theoryPage: 0, readingSignature });
    expect(after.answers).toBe(before.answers);
    expect(after.firstTry).toBe(before.firstTry);
    expect(after.firstConfidence).toBe(before.firstConfidence);
    expect(after).toMatchObject({ finished: true, cursor: before.cursor, resumeCursor: before.resumeCursor });
    expect(useArgumentation.getState().records).toBe(records);
  });
  it('laat antwoorden en oefenpositie intact bij bladeren en theorie herlezen', () => {
    useArgumentation.getState().start(testArgumentLesson);
    useArgumentation.getState().answer(testArgumentLesson.id, 'choice', { value: 'a', confidence: 2, reasoning: 'Ik controleer de ontbrekende verbindingsstap.' });
    useArgumentation.getState().check(testArgumentLesson.id, 'choice', 0);
    useArgumentation.getState().move(testArgumentLesson.id, 2);
    const before = useArgumentation.getState().sessions[testArgumentLesson.id]!;
    useArgumentation.getState().setTheoryPage(testArgumentLesson.id, 3);
    const after = useArgumentation.getState().sessions[testArgumentLesson.id]!;
    expect(after).toEqual({ ...before, theoryPage: 3 });
    expect(after.answers).toBe(before.answers);
    expect(after.firstTry).toBe(before.firstTry);
    expect(after.firstConfidence).toBe(before.firstConfidence);
    useArgumentation.getState().openTheory(testArgumentLesson.id);
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]).toMatchObject({ cursor: 0, resumeCursor: 2, theoryPage: 3 });
    useArgumentation.getState().resume(testArgumentLesson.id);
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]).toMatchObject({ cursor: 2, theoryPage: 3 });
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]?.answers).toBe(before.answers);
  });
  it('negeert ongeldige leespagina’s en maakt geen ontbrekende oefensessie aan', () => {
    useArgumentation.getState().start(testArgumentLesson);
    useArgumentation.getState().setTheoryPage(testArgumentLesson.id, 2);
    const before = useArgumentation.getState().sessions;
    for (const invalid of [-1, -0.5, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      useArgumentation.getState().setTheoryPage(testArgumentLesson.id, invalid);
      expect(useArgumentation.getState().sessions).toBe(before);
    }
    useArgumentation.getState().setTheoryPage('missing-lesson', 1);
    expect(useArgumentation.getState().sessions).toBe(before);
  });
  it('laat afgeronde lessen op een andere leespagina teruglezen zonder voortgang te wijzigen', () => {
    solve(testArgumentLesson);
    const before = useArgumentation.getState().sessions[testArgumentLesson.id]!;
    const records = useArgumentation.getState().records;
    useArgumentation.getState().setTheoryPage(testArgumentLesson.id, 2);
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]).toEqual({ ...before, theoryPage: 2 });
    expect(useArgumentation.getState().records).toBe(records);
    useArgumentation.getState().openTheory(testArgumentLesson.id);
    useArgumentation.getState().setTheoryPage(testArgumentLesson.id, 1);
    useArgumentation.getState().resume(testArgumentLesson.id);
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]).toMatchObject({ finished: true, cursor: testArgumentLesson.exercises.length + 1, theoryPage: 1 });
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]?.answers).toBe(before.answers);
    expect(useArgumentation.getState().records).toBe(records);
  });
  it('bewaart de leespagina en oefenantwoorden bij een pick/replace-herstel', () => {
    useArgumentation.getState().start(testArgumentLesson);
    useArgumentation.getState().answer(testArgumentLesson.id, 'choice', { value: 'b', confidence: 1 });
    useArgumentation.getState().move(testArgumentLesson.id, 2);
    useArgumentation.getState().setTheoryPage(testArgumentLesson.id, 3);
    const saved = ArgumentDataSchema.parse(JSON.parse(JSON.stringify(pickArgumentData(useArgumentation.getState()))));
    useArgumentation.getState().reset();
    useArgumentation.getState().replace(saved);
    useArgumentation.getState().start(testArgumentLesson);
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]).toEqual(saved.sessions[testArgumentLesson.id]);
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]).toMatchObject({ cursor: 2, theoryPage: 3, answers: { choice: { value: 'b', confidence: 1 } } });
  });
  it('geeft oude opslag zonder leespagina een nulpositie en behoudt de oefensessie', async () => {
    useArgumentation.getState().start(testArgumentLesson);
    useArgumentation.getState().move(testArgumentLesson.id, 2);
    useArgumentation.getState().answer(testArgumentLesson.id, 'choice', { value: 'a' });
    const legacy = JSON.parse(window.localStorage.getItem(ARGUMENTS_KEY)!) as { state: { sessions: Record<string, Record<string, unknown>> } };
    delete legacy.state.sessions[testArgumentLesson.id]!.theoryPage;
    const parsed = ArgumentDataSchema.parse(legacy.state);
    expect(parsed.sessions[testArgumentLesson.id]?.theoryPage).toBe(0);
    useArgumentation.setState(EMPTY_ARGUMENTS);
    window.localStorage.setItem(ARGUMENTS_KEY, JSON.stringify(legacy));
    await useArgumentation.persist.rehydrate();
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]).toMatchObject({ cursor: 2, theoryPage: 0, answers: { choice: { value: 'a' } } });
  });
  it('importeert oude sessies met pagina nul en verwerpt negatieve opgeslagen posities', () => {
    useArgumentation.getState().start(testArgumentLesson);
    useArgumentation.getState().answer(testArgumentLesson.id, 'choice', { value: 'b' });
    const legacy = JSON.parse(exportData()) as { arguments: { sessions: Record<string, Record<string, unknown>> } };
    delete legacy.arguments.sessions[testArgumentLesson.id]!.theoryPage;
    const parsed = parseImport(JSON.stringify(legacy));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      resetProgress();
      applyImport(parsed.data);
      expect(useArgumentation.getState().sessions[testArgumentLesson.id]).toMatchObject({ theoryPage: 0, answers: { choice: { value: 'b' } } });
    }
    legacy.arguments.sessions[testArgumentLesson.id]!.theoryPage = -1;
    expect(parseImport(JSON.stringify(legacy)).ok).toBe(false);
  });
  it('houdt het eerste antwoord vast bij herstel en verwerkt afronden eenmaal', () => {
    solve(testArgumentLesson, true);
    expect(useArgumentation.getState().records['test-lesson']).toMatchObject({ attempts: 1, bestScore: 50, lastScore: 50 });
    expect(useArgumentation.getState().sessions['test-lesson']?.firstTry.choice).toBe(0);
    useArgumentation.getState().finish(testArgumentLesson);
    expect(useArgumentation.getState().records['test-lesson']?.attempts).toBe(1);
  });
  it('markeert een onvoldoende checkpoint niet als voltooid en laat een nieuwe poging toe', () => {
    const lesson = { ...testArgumentLesson, checkpoint: true };
    solve(lesson, true);
    expect(useArgumentation.getState().records[lesson.id]?.completedAt).toBeNull();
    useArgumentation.getState().start(lesson, true);
    solve(lesson);
    expect(useArgumentation.getState().records[lesson.id]).toMatchObject({ attempts: 2, bestScore: 100, lastScore: 100 });
    expect(useArgumentation.getState().records[lesson.id]?.completedAt).toBeTruthy();
  });
  it('weigert af te ronden bij onafgemaakte opdrachten of ontbrekende zelfcontrole', () => {
    useArgumentation.getState().start(testArgumentLesson);
    useArgumentation.getState().finish(testArgumentLesson);
    expect(useArgumentation.getState().records).toEqual({});
    solve(testArgumentLesson);
    useArgumentation.getState().start(testArgumentLesson, true);
    const incomplete = useArgumentation.getState().sessions[testArgumentLesson.id]!;
    useArgumentation.setState({ sessions: { [testArgumentLesson.id]: { ...incomplete, answers: Object.fromEntries(testArgumentLesson.exercises.map((exercise) => [exercise.id, { ...emptyArgumentAnswer(), checked: true, score: exercise.kind === 'reflection' ? null : 1 }])) } } });
    useArgumentation.getState().finish(testArgumentLesson);
    expect(useArgumentation.getState().records[testArgumentLesson.id]?.attempts).toBe(1);
  });
  it('bewaart de plek bij theorieherlezing, ook in een afgeronde sessie', () => {
    useArgumentation.getState().start(testArgumentLesson);
    useArgumentation.getState().move(testArgumentLesson.id, 3);
    useArgumentation.getState().openTheory(testArgumentLesson.id);
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]?.cursor).toBe(0);
    useArgumentation.getState().resume(testArgumentLesson.id);
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]?.cursor).toBe(3);
    solve(testArgumentLesson);
    useArgumentation.getState().openTheory(testArgumentLesson.id);
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]).toMatchObject({ finished: true, cursor: 0 });
    useArgumentation.getState().resume(testArgumentLesson.id);
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]?.cursor).toBe(4);
  });
  it('hervat bij verversen en vernieuwt een sessie als de lesinhoud verandert', async () => {
    useArgumentation.getState().start(testArgumentLesson);
    useArgumentation.getState().move(testArgumentLesson.id, 2);
    useArgumentation.getState().setTheoryPage(testArgumentLesson.id, 3);
    const saved = window.localStorage.getItem(ARGUMENTS_KEY)!;
    useArgumentation.setState(EMPTY_ARGUMENTS);
    window.localStorage.setItem(ARGUMENTS_KEY, saved);
    await useArgumentation.persist.rehydrate();
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]?.cursor).toBe(2);
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]?.theoryPage).toBe(3);
    useArgumentation.getState().start({ ...testArgumentLesson, teaser: 'Gewijzigde analyse.' });
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]?.cursor).toBe(0);
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]?.theoryPage).toBe(0);
  });
  it('neemt argumenten en eigen teksten mee in export, import en wissen', () => {
    solve(testArgumentLesson);
    const raw = exportData();
    const parsed = parseImport(raw);
    expect(parsed.ok).toBe(true);
    resetProgress();
    expect(useArgumentation.getState().records).toEqual({});
    if (parsed.ok) applyImport(parsed.data);
    expect(useArgumentation.getState().records[testArgumentLesson.id]?.bestScore).toBe(100);
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]?.answers.reflection?.value).toBe('Mijn eigen analyse');
    const old = JSON.parse(raw) as Record<string, unknown>;
    delete old.arguments;
    const oldParsed = parseImport(JSON.stringify(old));
    if (oldParsed.ok) applyImport(oldParsed.data);
    expect(useArgumentation.getState().records).toEqual({});
  });
  it('bewaart geschreven werk bij een nieuwe oefenpoging en begrenst het portfolio', () => {
    for (let attempt = 0; attempt < 12; attempt++) {
      useArgumentation.getState().start(testArgumentLesson, true);
      solve(testArgumentLesson);
    }
    const record = useArgumentation.getState().records[testArgumentLesson.id]!;
    expect(record.attempts).toBe(12);
    expect(record.history).toHaveLength(10);
    expect(record.history[0]?.writings.reflection).toBe('Mijn eigen analyse');
    useArgumentation.getState().start(testArgumentLesson, true);
    expect(useArgumentation.getState().sessions[testArgumentLesson.id]?.answers).toEqual({});
    expect(useArgumentation.getState().records[testArgumentLesson.id]?.history).toHaveLength(10);
  });
  it('legt de oorspronkelijke zekerheid vast en laat herkansingen haar niet herschrijven', () => {
    useArgumentation.getState().start(testArgumentLesson);
    useArgumentation.getState().answer(testArgumentLesson.id, 'choice', { value: 'a', confidence: 3, reasoning: 'Ik veronderstel dat de eerste lezing doorslaggevend is.' });
    useArgumentation.getState().check(testArgumentLesson.id, 'choice', 0);
    useArgumentation.getState().answer(testArgumentLesson.id, 'choice', { checked: false, value: 'b', confidence: 0 });
    useArgumentation.getState().check(testArgumentLesson.id, 'choice', 1);
    const session = useArgumentation.getState().sessions[testArgumentLesson.id]!;
    expect(session.firstTry.choice).toBe(0);
    expect(session.firstConfidence.choice).toBe(3);
    expect(session.answers.choice?.confidence).toBe(0);
    expect(session.answers.choice?.reasoning).toContain('eerste lezing');
  });
});
