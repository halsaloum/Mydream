import { beforeEach, describe, expect, it } from 'vitest';
import type { Step } from '@/content/schema';
import { currentKey, currentResponse } from '@/engine/session';
import type { Response } from '@/engine/responses';
import { lookupPracticeStep } from '@/lib/practice/catalog';
import { dayKey } from '@/lib/dates';
import { EMPTY_ARGUMENTS, useArgumentation } from './argumentation';
import { EMPTY_SENTENCES, useSentences } from './sentences';
import { EMPTY_PROGRESS, useProgress } from './progress';
import { EMPTY_PRACTICE, PRACTICE_KEY, PracticeDataSchema, usePractice } from './practice';
import { applyImport, exportData, parseImport, resetProgress } from './transfer';

const now = new Date('2026-10-15T10:00:00.000Z').getTime();
const learnedAt = '2026-10-14T10:00:00.000Z';
function correctAnswer(step: Step): Response {
  if (step.kind === 'choice') return { kind: 'choice', value: step.answer };
  if (step.kind === 'type') return { kind: 'type', value: step.answer };
  if (step.kind === 'recall') return { kind: 'recall', value: step.answers[0]! };
  if (step.kind === 'rewrite') return { kind: 'rewrite', value: step.accept[0]! };
  if (step.kind === 'sort') return { kind: 'sort', assign: step.items.map((item) => item.b) };
  if (step.kind === 'fix') return { kind: 'fix', index: step.wrong, value: step.answer };
  throw new Error(`Testfixture gebruikt onverwachte taak: ${step.kind}`);
}
function seedLesson() {
  useProgress.getState().replace({ ...EMPTY_PROGRESS, lessons: { l1: { attempts: 1, bestAccuracy: 100, lastAccuracy: 100, firstCompletedAt: learnedAt, lastCompletedAt: learnedAt } } });
}
beforeEach(() => {
  useProgress.getState().reset(); useArgumentation.getState().replace(EMPTY_ARGUMENTS);
  useSentences.getState().replace(EMPTY_SENTENCES); usePractice.getState().reset();
  window.localStorage.clear();
});

describe('bewaarde gespreide kennischecks', () => {
  it('houdt een check leeg totdat echte afgeronde stof op een latere dag klaarstaat', () => {
    usePractice.getState().start(now);
    expect(usePractice.getState().session).toBeNull();
    seedLesson(); usePractice.getState().start(Date.parse(learnedAt));
    expect(usePractice.getState().session).toBeNull();
    usePractice.getState().start(now);
    expect(usePractice.getState().session?.plan).toHaveLength(1);
    expect(Object.keys(useProgress.getState().lessons)).toEqual(['l1']);
  });

  it('bewaart antwoord en feedback bij hervatten, telt de eerste poging en verwerkt afronden eenmalig', async () => {
    seedLesson(); usePractice.getState().start(now);
    const initial = usePractice.getState().session!;
    const item = lookupPracticeStep(currentKey(initial)!)!;
    const correct = correctAnswer(item.step);
    if (!('value' in correct)) throw new Error('De l1-fixture hoort een getypt antwoord te zijn.');
    usePractice.getState().dispatch({ type: 'respond', response: { ...correct, value: 'onjuistantwoord' }, now: now + 1000 });
    usePractice.getState().dispatch({ type: 'check', now: now + 2000 });
    expect(usePractice.getState().session?.firstTry[item.key]).toBe(0);
    const saved = window.localStorage.getItem(PRACTICE_KEY);
    usePractice.setState(EMPTY_PRACTICE);
    window.localStorage.setItem(PRACTICE_KEY, saved!);
    await usePractice.persist.rehydrate();
    expect(usePractice.getState().session?.phase).toBe('feedback');
    expect(currentResponse(usePractice.getState().session!, item)).toMatchObject({ value: 'onjuistantwoord' });
    usePractice.getState().dispatch({ type: 'advance', now: now + 3000 });
    usePractice.getState().dispatch({ type: 'respond', response: correct, now: now + 4000 });
    usePractice.getState().dispatch({ type: 'check', now: now + 5000 });
    usePractice.getState().dispatch({ type: 'advance', now: now + 6000 });
    expect(usePractice.getState().session).toMatchObject({ phase: 'done', committed: true });
    expect(usePractice.getState().records['schrijven:l1']).toMatchObject({ reviews: 1, lastScore: 0, due: '2026-10-16' });
    expect(useProgress.getState().history[0]).toMatchObject({ mode: 'review', accuracy: 0, graded: 1 });
    expect(useProgress.getState().lessons.l1?.attempts).toBe(1);
    const sessions = useProgress.getState().activity[dayKey(now)]!.sessions;
    usePractice.getState().dispatch({ type: 'advance', now: now + 7000 });
    expect(useProgress.getState().activity[dayKey(now)]!.sessions).toBe(sessions);
    expect(usePractice.getState().records['schrijven:l1']?.reviews).toBe(1);
  });

  it('verlengt de termijn alleen na een zelfstandig goed eerste antwoord', () => {
    seedLesson(); usePractice.getState().start(now);
    const item = lookupPracticeStep(currentKey(usePractice.getState().session!)!)!;
    usePractice.getState().dispatch({ type: 'respond', response: correctAnswer(item.step), now: now + 1000 });
    usePractice.getState().dispatch({ type: 'check', now: now + 2000 });
    usePractice.getState().dispatch({ type: 'advance', now: now + 3000 });
    expect(usePractice.getState().records['schrijven:l1']).toMatchObject({ lastScore: 1, successfulDays: 1, due: '2026-10-18' });
    usePractice.getState().discard(); usePractice.getState().start(now + 4000);
    expect(usePractice.getState().session).toBeNull();
  });

  it('neemt herhaling mee in export/import en behoudt oudere exports zonder nieuwe gegevens', () => {
    seedLesson(); usePractice.getState().start(now);
    const exported = exportData();
    usePractice.getState().reset();
    const parsed = parseImport(exported);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) applyImport(parsed.data);
    expect(usePractice.getState().session?.plan).toHaveLength(1);
    const legacy = JSON.parse(exported) as Record<string, unknown>;
    delete legacy.practice;
    const older = parseImport(JSON.stringify(legacy));
    expect(older.ok).toBe(true);
    if (older.ok) applyImport(older.data);
    expect(usePractice.getState().session).toBeNull();
    expect(useProgress.getState().lessons.l1?.attempts).toBe(1);
    resetProgress();
    expect(usePractice.getState().records).toEqual({});
  });

  it('gebruikt de echte dag van de eerste controle als je pas veel later de feedback sluit', () => {
    seedLesson(); usePractice.getState().start(now);
    const item = lookupPracticeStep(currentKey(usePractice.getState().session!)!)!;
    usePractice.getState().dispatch({ type: 'respond', response: correctAnswer(item.step), now: now + 1000 });
    usePractice.getState().dispatch({ type: 'check', now: now + 2000 });
    usePractice.getState().dispatch({ type: 'advance', now: now + 10 * 86400000 });
    expect(usePractice.getState().records['schrijven:l1']).toMatchObject({ lastDay: '2026-10-15', due: '2026-10-18' });
    const finishedAt = usePractice.getState().session?.finishedAt;
    usePractice.getState().start(now + 10 * 86400000 + 1000);
    expect(usePractice.getState().session?.phase).toBe('done');
    expect(usePractice.getState().session?.finishedAt).toBe(finishedAt);
  });

  it('laat een verouderde herhaalvraag vervallen zonder eerdere resultaten te wissen', () => {
    seedLesson(); usePractice.getState().start(now);
    const state = usePractice.getState();
    const parsed = PracticeDataSchema.safeParse({ records: state.records, sources: state.sources, session: { ...state.session!, plan: ['verwijderde-stap'], queue: ['verwijderde-stap'] } });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.session).toBeNull();
    expect(useProgress.getState().lessons.l1).toBeDefined();
  });
});
