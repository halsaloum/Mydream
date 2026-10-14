import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSession, SessionSchema, sessionReducer, summarize, type SessionAction, type SessionState } from '@/engine/session';
import { dayKey } from '@/lib/dates';
import { lookupPracticeStep, practiceTopicForQuestion } from '@/lib/practice/catalog';
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

function usable(session: SessionState) {
  return session.id === 'gespreid-ophalen' && session.mode === 'review' && session.pos < session.queue.length
    && new Set(session.plan).size === session.plan.length
    && session.plan.every((key) => lookupPracticeStep(key))
    && session.queue.every((key) => session.plan.includes(key));
}

export const PracticeDataSchema = z.object({
  records: z.record(z.string(), PracticeRecordSchema),
  session: SessionSchema.nullable().transform((session) => session && usable(session) ? session : null),
  sources: z.record(z.string(), PracticeRecordSchema),
  checkedOn: z.record(z.string(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).default({}),
});
export type PracticeData = z.output<typeof PracticeDataSchema>;
export const EMPTY_PRACTICE: PracticeData = { records: {}, session: null, sources: {}, checkedOn: {} };
export const PRACTICE_KEY = 'pennig:gespreid-ophalen';

type Actions = {
  start: (now?: number) => void; dispatch: (action: SessionAction) => void;
  discard: () => void; replace: (data: PracticeData) => void; reset: () => void;
};

/** De bestaande lesresultaten blijven intact: dit zijn afzonderlijke, korte kennischecks. */
export const usePractice = create<PracticeData & Actions>()(persist((set, get) => ({
  ...EMPTY_PRACTICE,
  start: (now = Date.now()) => {
    if (get().session && usable(get().session!)) return;
    const topics = completedPracticeTopics(useProgress.getState(), useArgumentation.getState(), useSentences.getState(), get().records);
    const batch = practiceBatch(duePracticeTopics(topics, dayKey(now)));
    if (!batch.length) return;
    set({ session: createSession('gespreid-ophalen', 'review', batch.map(practiceQuestion), now), sources: Object.fromEntries(batch.map((topic) => [topic.key, topic.schedule])), checkedOn: {} });
  },
  dispatch: (action) => {
    const before = get().session;
    if (!before || !usable(before) || action.type === 'commit') return;
    const session = sessionReducer(before, action, lookupPracticeStep);
    if (session === before) return;
    const checkedOn = { ...get().checkedOn };
    for (const key of Object.keys(session.firstTry)) {
      if (!(key in before.firstTry)) checkedOn[key] = dayKey(action.now);
    }
    if (session.phase !== 'done' || session.committed) { set({ session, checkedOn }); return; }
    const records = { ...get().records };
    for (const [key, score] of Object.entries(session.firstTry)) {
      const topic = practiceTopicForQuestion(key);
      const source = topic && get().sources[topic];
      if (topic && source) records[topic] = reviewPractice(source, score, checkedOn[key] ?? dayKey(Date.parse(session.startedAt)));
    }
    set({ records, session: { ...session, committed: true }, checkedOn });
    const summary = summarize(session, lookupPracticeStep);
    useProgress.getState().recordSession(session, summary, Date.parse(session.finishedAt!));
    useProgress.getState().addActiveTime(summary.activeMs, Date.parse(session.finishedAt!));
  },
  discard: () => set({ session: null, sources: {}, checkedOn: {} }),
  replace: (data) => set(data), reset: () => set(EMPTY_PRACTICE),
}), {
  name: PRACTICE_KEY, version: 1, storage: validatedStorage(PracticeDataSchema), skipHydration: true,
  partialize: ({ records, session, sources, checkedOn }) => ({ records, session, sources, checkedOn }),
}));

export function pickPracticeData({ records, session, sources, checkedOn }: PracticeData): PracticeData { return { records, session, sources, checkedOn }; }

export function usePracticeDueCount(): number {
  const lessons = useProgress((state) => state.lessons);
  const argumentsRecords = useArgumentation((state) => state.records);
  const sentenceRecords = useSentences((state) => state.records);
  const records = usePractice((state) => state.records);
  return duePracticeTopics(completedPracticeTopics({ lessons }, { records: argumentsRecords }, { records: sentenceRecords }, records)).length;
}
