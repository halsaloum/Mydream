import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SessionState, SessionSummary } from '@/engine/session';
import { dayKey } from '@/lib/dates';
import { lookupStep } from '@/lib/plans';
import { validatedStorage } from './storage';

/** Een record waarvan ongeldige of verouderde entries worden overgeslagen in plaats van alles te verwerpen. */
function lenientRecord<T>(value: z.ZodType<T>, keep: (key: string, value: T) => boolean = () => true) {
  return z.record(z.string(), z.unknown()).transform((record) => {
    const out: Record<string, T> = {};
    for (const [key, raw] of Object.entries(record)) {
      const parsed = value.safeParse(raw);
      if (parsed.success && keep(key, parsed.data)) out[key] = parsed.data;
    }
    return out;
  });
}

const LessonProgressSchema = z.object({
  attempts: z.int().positive(),
  bestAccuracy: z.number().min(0).max(100),
  lastAccuracy: z.number().min(0).max(100),
  firstCompletedAt: z.string(),
  lastCompletedAt: z.string(),
});

const ReviewItemSchema = z.object({
  key: z.string(),
  lessonId: z.string(),
  addedAt: z.string(),
  lastMissedAt: z.string(),
  misses: z.int().positive(),
});

const DayActivitySchema = z.object({
  activeMs: z.number().nonnegative(),
  sessions: z.int().nonnegative(),
  exercises: z.int().nonnegative(),
});

const HistoryEntrySchema = z.object({
  id: z.string(),
  mode: z.enum(['lesson', 'review']),
  at: z.string(),
  accuracy: z.number().min(0).max(100),
  graded: z.int().nonnegative(),
  activeMs: z.number().nonnegative(),
});

export const ProgressDataSchema = z.object({
  lessons: lenientRecord(LessonProgressSchema),
  /** Oefenpunten waarvan de stap niet meer bestaat (gewijzigde inhoud) worden niet geladen. */
  review: lenientRecord(ReviewItemSchema, (key) => lookupStep(key) !== undefined),
  activity: lenientRecord(DayActivitySchema, (key) => /^\d{4}-\d{2}-\d{2}$/.test(key)),
  history: z.array(z.unknown()).transform((entries) =>
    entries.flatMap((entry) => {
      const parsed = HistoryEntrySchema.safeParse(entry);
      return parsed.success ? [parsed.data] : [];
    }),
  ),
});

export type LessonProgress = z.infer<typeof LessonProgressSchema>;
export type ReviewItem = z.infer<typeof ReviewItemSchema>;
export type DayActivity = z.infer<typeof DayActivitySchema>;
export type HistoryEntry = z.infer<typeof HistoryEntrySchema>;
export type ProgressData = z.output<typeof ProgressDataSchema>;

export const EMPTY_PROGRESS: ProgressData = { lessons: {}, review: {}, activity: {}, history: [] };
const HISTORY_LIMIT = 60;

type ProgressActions = {
  /** Verwerkt een afgeronde sessie: lesresultaat, oefenpunten en geschiedenis. */
  recordSession: (session: SessionState, summary: SessionSummary, now?: number) => void;
  /** Telt actieve oefentijd mee voor vandaag, ook als een les nog niet af is. */
  addActiveTime: (ms: number, now?: number) => void;
  removeReviewItem: (key: string) => void;
  replace: (data: ProgressData) => void;
  reset: () => void;
};

function bumpDay(activity: ProgressData['activity'], now: number, patch: Partial<DayActivity>) {
  const key = dayKey(now);
  const day = activity[key] ?? { activeMs: 0, sessions: 0, exercises: 0 };
  return {
    ...activity,
    [key]: {
      activeMs: day.activeMs + (patch.activeMs ?? 0),
      sessions: day.sessions + (patch.sessions ?? 0),
      exercises: day.exercises + (patch.exercises ?? 0),
    },
  };
}

export const PROGRESS_KEY = 'pennig:voortgang';

export const useProgress = create<ProgressData & ProgressActions>()(
  persist(
    (set) => ({
      ...EMPTY_PROGRESS,
      recordSession: (session, summary, now = Date.now()) =>
        set((state) => {
          const at = new Date(now).toISOString();
          const lessons = { ...state.lessons };
          if (session.mode === 'lesson') {
            const previous = lessons[session.id];
            lessons[session.id] = {
              attempts: (previous?.attempts ?? 0) + 1,
              bestAccuracy: Math.max(previous?.bestAccuracy ?? 0, summary.accuracy),
              lastAccuracy: summary.accuracy,
              firstCompletedAt: previous?.firstCompletedAt ?? at,
              lastCompletedAt: at,
            };
          }
          const review = { ...state.review };
          for (const key of summary.cleared) delete review[key];
          for (const key of summary.missed) {
            const item = lookupStep(key);
            if (!item) continue;
            const existing = review[key];
            review[key] = {
              key,
              lessonId: item.lessonId,
              addedAt: existing?.addedAt ?? at,
              lastMissedAt: at,
              misses: (existing?.misses ?? 0) + 1,
            };
          }
          const history = [
            { id: session.id, mode: session.mode, at, accuracy: summary.accuracy, graded: summary.graded, activeMs: summary.activeMs },
            ...state.history,
          ].slice(0, HISTORY_LIMIT);
          return {
            lessons,
            review,
            history,
            activity: bumpDay(state.activity, now, { sessions: 1, exercises: summary.graded }),
          };
        }),
      addActiveTime: (ms, now = Date.now()) => {
        if (ms <= 0) return;
        set((state) => ({ activity: bumpDay(state.activity, now, { activeMs: ms }) }));
      },
      removeReviewItem: (key) =>
        set((state) => {
          const review = { ...state.review };
          delete review[key];
          return { review };
        }),
      replace: (data) => set(data),
      reset: () => set(EMPTY_PROGRESS),
    }),
    {
      name: PROGRESS_KEY,
      version: 1,
      storage: validatedStorage(ProgressDataSchema),
      partialize: ({ lessons, review, activity, history }) => ({ lessons, review, activity, history }),
      skipHydration: true,
    },
  ),
);

export function pickProgressData(state: ProgressData): ProgressData {
  return { lessons: state.lessons, review: state.review, activity: state.activity, history: state.history };
}
