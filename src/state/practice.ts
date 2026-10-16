import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSession, SessionSchema, sessionReducer, summarize, type SessionAction, type SessionState } from '@/engine/session';
import { dayKey } from '@/lib/dates';
import { lookupPracticeStep, practiceTopic, practiceTopicForQuestion, type PracticeTopic } from '@/lib/practice/catalog';
import { completedPracticeTopics, duePracticeTopics, practiceBatch, practiceQuestion, reviewPractice } from '@/lib/practice/schedule';
import { useProgress } from './progress';
import { useArgumentation } from './argumentation';
import { useSentences } from './sentences';
import { validatedStorage } from './storage';

export const PracticeRecordSchema = z.object({
  sourceCompletedAt: z.iso.datetime(), due: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  lastDay: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(), successfulDays: z.int().nonnegative(),
  reviews: z.int().nonnegative(), lastScore: z.number().min(0).max(1).nullable(),
});
export function isProtectedPracticeTopic(topic: Pick<PracticeTopic, 'course' | 'lessonId'>): boolean {
  return topic.course === 'argumentatie' || (topic.course === 'schrijven' && /^a(?:2\d|3[0-5])$/.test(topic.lessonId));
}
export function isProtectedPracticeSession(session: SessionState): boolean {
  return session.plan.every(key => {
    const topicKey = practiceTopicForQuestion(key), topic = topicKey && practiceTopic(topicKey);
    return Boolean(topic && isProtectedPracticeTopic(topic));
  });
}
function usable(session: SessionState) {
  return session.id === 'gespreid-ophalen' && session.mode === 'review' && session.pos < session.queue.length
    && new Set(session.plan).size === session.plan.length
    && session.plan.every(key => lookupPracticeStep(key))
    && session.queue.every(key => session.plan.includes(key));
}
const SourcesSchema = z.record(z.string(), PracticeRecordSchema);
const CheckedOnSchema = z.record(z.string(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/));
export const PracticeDataSchema = z.object({
  records: SourcesSchema,
  session: SessionSchema.nullable().transform(session => session && usable(session) ? session : null),
  sources: SourcesSchema,
  checkedOn: CheckedOnSchema.default({}),
  // Parallel fields preserve a historical mixed round while the UI offers only protected material.
  argumentSession: SessionSchema.nullable().default(null).transform(session => session && usable(session) && isProtectedPracticeSession(session) ? session : null),
  argumentSources: SourcesSchema.default({}), argumentCheckedOn: CheckedOnSchema.default({}),
});
export type PracticeData = z.output<typeof PracticeDataSchema>;
export const EMPTY_PRACTICE: PracticeData = { records: {}, session: null, sources: {}, checkedOn: {}, argumentSession: null, argumentSources: {}, argumentCheckedOn: {} };
export const PRACTICE_KEY = 'pennig:gespreid-ophalen';

type Actions = {
  start: (now?: number, argumentOnly?: boolean) => void; dispatch: (action: SessionAction, argumentOnly?: boolean) => void;
  discard: (argumentOnly?: boolean) => void; replace: (data: PracticeData) => void; reset: () => void;
};

/** De bestaande lesresultaten blijven intact: dit zijn afzonderlijke, korte kennischecks. */
export const usePractice = create<PracticeData & Actions>()(persist((set, get) => ({
  ...EMPTY_PRACTICE,
  start: (now = Date.now(), argumentOnly = false) => {
    const existing = argumentOnly ? get().argumentSession : get().session;
    if (existing && usable(existing)) return;
    const allTopics = completedPracticeTopics(useProgress.getState(), useArgumentation.getState(), useSentences.getState(), get().records);
    const topics = argumentOnly ? allTopics.filter(isProtectedPracticeTopic) : allTopics;
    const batch = practiceBatch(duePracticeTopics(topics, dayKey(now)));
    if (!batch.length) return;
    const session = createSession('gespreid-ophalen', 'review', batch.map(practiceQuestion), now);
    const sources = Object.fromEntries(batch.map(topic => [topic.key, topic.schedule]));
    set(argumentOnly ? { argumentSession: session, argumentSources: sources, argumentCheckedOn: {} } : { session, sources, checkedOn: {} });
  },
  dispatch: (action, argumentOnly = false) => {
    const before = argumentOnly ? get().argumentSession : get().session;
    if (!before || !usable(before) || (argumentOnly && !isProtectedPracticeSession(before)) || action.type === 'commit') return;
    const session = sessionReducer(before, action, lookupPracticeStep);
    if (session === before) return;
    const checkedOn = { ...(argumentOnly ? get().argumentCheckedOn : get().checkedOn) };
    for (const key of Object.keys(session.firstTry)) {
      if (!(key in before.firstTry)) checkedOn[key] = dayKey(action.now);
    }
    if (session.phase !== 'done' || session.committed) {
      set(argumentOnly ? { argumentSession: session, argumentCheckedOn: checkedOn } : { session, checkedOn });
      return;
    }
    const records = { ...get().records }, sources = argumentOnly ? get().argumentSources : get().sources;
    for (const [key, score] of Object.entries(session.firstTry)) {
      const topic = practiceTopicForQuestion(key), source = topic && sources[topic];
      if (topic && source) records[topic] = reviewPractice(source, score, checkedOn[key] ?? dayKey(Date.parse(session.startedAt)));
    }
    const committed = { ...session, committed: true };
    set(argumentOnly ? { records, argumentSession: committed, argumentCheckedOn: checkedOn } : { records, session: committed, checkedOn });
    const summary = summarize(session, lookupPracticeStep);
    useProgress.getState().recordSession(session, summary, Date.parse(session.finishedAt!));
    useProgress.getState().addActiveTime(summary.activeMs, Date.parse(session.finishedAt!));
  },
  discard: (argumentOnly = false) => set(argumentOnly ? { argumentSession: null, argumentSources: {}, argumentCheckedOn: {} } : { session: null, sources: {}, checkedOn: {} }),
  replace: data => set(data), reset: () => set(EMPTY_PRACTICE),
}), {
  name: PRACTICE_KEY, version: 1, storage: validatedStorage(PracticeDataSchema), skipHydration: true,
  partialize: ({ records, session, sources, checkedOn, argumentSession, argumentSources, argumentCheckedOn }) => ({ records, session, sources, checkedOn, argumentSession, argumentSources, argumentCheckedOn }),
}));

export function pickPracticeData({ records, session, sources, checkedOn, argumentSession, argumentSources, argumentCheckedOn }: PracticeData): PracticeData {
  return { records, session, sources, checkedOn, argumentSession, argumentSources, argumentCheckedOn };
}
export function usePracticeDueCount(argumentOnly = false): number {
  const lessons = useProgress(state => state.lessons);
  const argumentsRecords = useArgumentation(state => state.records);
  const sentenceRecords = useSentences(state => state.records);
  const records = usePractice(state => state.records);
  const topics = completedPracticeTopics({ lessons }, { records: argumentsRecords }, { records: sentenceRecords }, records);
  return duePracticeTopics(argumentOnly ? topics.filter(isProtectedPracticeTopic) : topics).length;
}
