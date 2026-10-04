import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlanStep } from '@/engine/plan';
import { createSession, SessionSchema, sessionReducer, summarize, type SessionAction, type SessionState } from '@/engine/session';
import { lookupStep, planFor } from '@/lib/plans';
import { useProgress } from './progress';
import { validatedStorage } from './storage';

/**
 * Lopende sessies, per les (en één voor herhaling). Wordt na elke actie bewaard, zodat een les
 * na verversen of later precies op dezelfde plek verdergaat.
 */
export const REVIEW_SESSION_ID = 'herhaling';
const SESSION_LIMIT = 30;

/** Een sessie is alleen bruikbaar als alle stappen nog bestaan en het lesplan niet is veranderd. */
function isUsable(id: string, session: SessionState): boolean {
  if (!session.queue.every((key) => lookupStep(key))) return false;
  if (session.mode === 'review') return true;
  const plan = planFor(id);
  return plan !== undefined && plan.map((item) => item.key).join('|') === session.plan.join('|');
}

const SessionsDataSchema = z.object({
  byId: z.record(z.string(), z.unknown()).transform((record) => {
    const out: Record<string, SessionState> = {};
    for (const [id, raw] of Object.entries(record)) {
      const parsed = SessionSchema.safeParse(raw);
      if (parsed.success && isUsable(id, parsed.data)) out[id] = parsed.data;
    }
    return out;
  }),
});

type SessionsData = z.output<typeof SessionsDataSchema>;

type SessionsActions = {
  /** Start een nieuwe sessie (overschrijft een eventuele oude). */
  start: (id: string, mode: SessionState['mode'], plan: readonly PlanStep[]) => SessionState;
  dispatch: (id: string, action: SessionAction) => void;
  discard: (id: string) => void;
  reset: () => void;
};

function prune(byId: Record<string, SessionState>): Record<string, SessionState> {
  const entries = Object.entries(byId);
  if (entries.length <= SESSION_LIMIT) return byId;
  entries.sort(([, a], [, b]) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  return Object.fromEntries(entries.slice(0, SESSION_LIMIT));
}

export const SESSIONS_KEY = 'pennig:sessies';

export const useSessions = create<SessionsData & SessionsActions>()(
  persist(
    (set, get) => ({
      byId: {},
      start: (id, mode, plan) => {
        const session = createSession(id, mode, plan, Date.now());
        set((state) => ({ byId: prune({ ...state.byId, [id]: session }) }));
        return session;
      },
      dispatch: (id, action) => {
        const before = get().byId[id];
        if (!before) return;
        let after = sessionReducer(before, action, lookupStep);
        if (after === before) return;

        const progress = useProgress.getState();
        progress.addActiveTime(after.activeMs - before.activeMs);
        if (after.phase === 'done' && !after.committed) {
          progress.recordSession(after, summarize(after, lookupStep));
          after = sessionReducer(after, { type: 'commit' }, lookupStep);
        }
        set((state) => ({ byId: { ...state.byId, [id]: after } }));
      },
      discard: (id) =>
        set((state) => {
          const byId = { ...state.byId };
          delete byId[id];
          return { byId };
        }),
      reset: () => set({ byId: {} }),
    }),
    {
      name: SESSIONS_KEY,
      version: 1,
      storage: validatedStorage(SessionsDataSchema),
      partialize: ({ byId }) => ({ byId }),
      skipHydration: true,
    },
  ),
);

/** De meest recente, nog niet afgeronde lessessie. */
export function latestOpenLessonSession(byId: Record<string, SessionState>): SessionState | undefined {
  return Object.values(byId)
    .filter((session) => session.mode === 'lesson' && session.phase !== 'done')
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0];
}
