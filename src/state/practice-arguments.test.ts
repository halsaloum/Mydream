import { beforeEach, describe, expect, it } from 'vitest';
import { currentKey } from '@/engine/session';
import type { Step } from '@/content/schema';
import type { Response } from '@/engine/responses';
import { lookupPracticeStep, practiceTopic, practiceTopicForQuestion, practiceTopics } from '@/lib/practice/catalog';
import { EMPTY_ARGUMENTS, useArgumentation } from './argumentation';
import { EMPTY_PROGRESS, useProgress } from './progress';
import { EMPTY_SENTENCES, useSentences } from './sentences';
import { applyImport, exportData, parseImport } from './transfer';
import { EMPTY_PRACTICE, PRACTICE_KEY, PracticeDataSchema, isProtectedPracticeTopic, usePractice } from './practice';

const now = Date.parse('2026-10-15T10:00:00Z');
const learnedAt = '2026-10-14T10:00:00.000Z';
const modern = practiceTopics.find(topic => topic.course === 'argumentatie' && topic.questions.length)!;
function seedLegacy(...ids: string[]) {
  useProgress.getState().replace({ ...EMPTY_PROGRESS, lessons: Object.fromEntries(ids.map(id => [id, { attempts: 1, bestAccuracy: 100, lastAccuracy: 100, firstCompletedAt: learnedAt, lastCompletedAt: learnedAt }])) });
}
function seedModern() {
  useArgumentation.getState().replace({ ...EMPTY_ARGUMENTS, records: { [modern.lessonId]: { attempts: 1, bestScore: 100, lastScore: 100, completedAt: learnedAt, lastPracticedAt: learnedAt, reviewOn: '2026-10-15', history: [] } } });
}
function response(step: Step): Response {
  if (step.kind === 'choice' || step.kind === 'type') return { kind: step.kind, value: step.answer };
  if (step.kind === 'sort') return { kind: 'sort', assign: step.items.map(item => item.b) };
  throw new Error(`Onverwachte fixture ${step.kind}`);
}
function protectedTopicFor(key: string) {
  const topicKey = practiceTopicForQuestion(key), topic = topicKey && practiceTopic(topicKey);
  return Boolean(topic && isProtectedPracticeTopic(topic));
}
beforeEach(() => {
  useProgress.getState().replace(EMPTY_PROGRESS);
  useArgumentation.getState().replace(EMPTY_ARGUMENTS);
  useSentences.getState().replace(EMPTY_SENTENCES);
  usePractice.getState().reset();
  window.localStorage.clear();
});

describe('beschermde argumentatiechecks naast historische rondes', () => {
  it('houdt beide argumentatiecatalogi in de nieuwe ronde en bewaart een historische gemengde ronde letterlijk', async () => {
    seedLegacy('l1', 'a20'); seedModern();
    usePractice.getState().start(now);
    const original = usePractice.getState().session!;
    expect(original.plan.some(key => !protectedTopicFor(key))).toBe(true);
    const key = currentKey(original)!;
    usePractice.getState().dispatch({ type: 'respond', response: response(lookupPracticeStep(key)!.step), now: now + 1000 });
    usePractice.getState().dispatch({ type: 'check', now: now + 2000 });
    const historical = { session: usePractice.getState().session, sources: usePractice.getState().sources, checkedOn: usePractice.getState().checkedOn };
    usePractice.getState().start(now + 3000, true);
    const protectedRound = usePractice.getState().argumentSession!;
    expect(protectedRound.plan.every(protectedTopicFor)).toBe(true);
    const owners = protectedRound.plan.map(practiceTopicForQuestion);
    expect(owners).toContain('schrijven:a20');
    expect(owners).toContain(modern.key);
    expect(owners).not.toContain('schrijven:l1');
    expect(usePractice.getState().session).toEqual(historical.session);
    expect(usePractice.getState().sources).toEqual(historical.sources);
    expect(usePractice.getState().checkedOn).toEqual(historical.checkedOn);
    const saved = window.localStorage.getItem(PRACTICE_KEY)!;
    usePractice.setState(EMPTY_PRACTICE);
    window.localStorage.setItem(PRACTICE_KEY, saved);
    await usePractice.persist.rehydrate();
    expect(usePractice.getState().argumentSession).toEqual(protectedRound);
    expect(usePractice.getState().session).toEqual(historical.session);
  });

  it('verwerkt een beschermde ronde eenmalig zonder oude sessie of oorspronkelijke lesresultaten te overschrijven', () => {
    seedLegacy('l1'); usePractice.getState().start(now);
    const historical = usePractice.getState().session;
    seedModern();
    const originalArgumentRecords = useArgumentation.getState().records;
    usePractice.getState().start(now, true);
    const item = lookupPracticeStep(currentKey(usePractice.getState().argumentSession!)!)!;
    usePractice.getState().dispatch({ type: 'respond', response: response(item.step), now: now + 1000 }, true);
    usePractice.getState().dispatch({ type: 'check', now: now + 2000 }, true);
    usePractice.getState().dispatch({ type: 'advance', now: now + 3000 }, true);
    expect(usePractice.getState().argumentSession).toMatchObject({ phase: 'done', committed: true });
    expect(usePractice.getState().records[modern.key]).toMatchObject({ reviews: 1, lastScore: 1, due: '2026-10-18' });
    expect(usePractice.getState().session).toEqual(historical);
    expect(useArgumentation.getState().records).toEqual(originalArgumentRecords);
    expect(useProgress.getState().lessons.l1!.attempts).toBe(1);
    usePractice.getState().dispatch({ type: 'advance', now: now + 4000 }, true);
    expect(usePractice.getState().records[modern.key]!.reviews).toBe(1);
  });

  it('neemt beide rondes mee in reservekopieën en maakt een oude kopie zonder nieuwe velden compatibel', () => {
    seedLegacy('l1', 'a20'); seedModern();
    usePractice.getState().start(now); usePractice.getState().start(now, true);
    const original = usePractice.getState().session, protectedRound = usePractice.getState().argumentSession;
    const exported = exportData();
    usePractice.getState().reset();
    const parsed = parseImport(exported);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) applyImport(parsed.data);
    expect(usePractice.getState().session).toEqual(original);
    expect(usePractice.getState().argumentSession).toEqual(protectedRound);
    const old = PracticeDataSchema.parse({ records: {}, session: original, sources: {}, checkedOn: {} });
    expect(old.argumentSession).toBeNull();
    expect(old.session).toEqual(original);
    const mixed = PracticeDataSchema.parse({ ...old, argumentSession: original });
    expect(mixed.argumentSession).toBeNull();
    expect(mixed.session).toEqual(original);
  });

  it('wist alleen de gekozen ronde en behoudt bestaande vraagsleutels en eerste pogingen', () => {
    seedLegacy('l1', 'a20'); seedModern();
    usePractice.getState().start(now); usePractice.getState().start(now, true);
    const original = usePractice.getState().session;
    const protectedRound = usePractice.getState().argumentSession!;
    expect(protectedRound.plan.every(key => lookupPracticeStep(key)?.key === key)).toBe(true);
    usePractice.getState().discard(true);
    expect(usePractice.getState().argumentSession).toBeNull();
    expect(usePractice.getState().session).toEqual(original);
    usePractice.getState().start(now, true);
    const restored = usePractice.getState().argumentSession;
    usePractice.getState().discard();
    expect(usePractice.getState().session).toBeNull();
    expect(usePractice.getState().argumentSession).toEqual(restored);
  });
});
