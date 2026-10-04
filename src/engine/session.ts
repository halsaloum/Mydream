import { z } from 'zod';
import { evaluate, isComplete } from './grade';
import { isScored, stepMode } from './kinds';
import type { PlanStep } from './plan';
import { initialResponse, responseFits, ResponseSchema, type Response } from './responses';

/**
 * Het verloop van één lessessie als pure toestandsmachine.
 *
 *   answering ──controleer──▶ feedback ──doorgaan──▶ answering (volgende stap) … ▶ done
 *
 * Een fout beantwoorde stap komt achteraan de wachtrij terug ("Nog een keer"), zoals in de
 * oorspronkelijke app. De toestand is serialiseerbaar en wordt na elke actie bewaard.
 */
export const SESSION_VERSION = 1;
const ACTIVE_GAP_MS = 60_000;

export const SessionSchema = z.object({
  v: z.literal(SESSION_VERSION),
  id: z.string(),
  mode: z.enum(['lesson', 'review']),
  /** Sleutels van het oorspronkelijke plan. */
  plan: z.array(z.string()).min(1),
  /** Plan plus herhalingen. */
  queue: z.array(z.string()).min(1),
  pos: z.int().nonnegative(),
  phase: z.enum(['answering', 'feedback', 'done']),
  lastCorrect: z.boolean().nullable(),
  /** Antwoord per wachtrijpositie. */
  responses: z.record(z.string(), ResponseSchema),
  /** Score van de eerste poging per stap (0–1). */
  firstTry: z.record(z.string(), z.number().min(0).max(1)),
  /** Wat er met de herhaalstapel gebeurt, vastgelegd bij de eerste poging. */
  flags: z.record(z.string(), z.enum(['miss', 'clear'])),
  combo: z.int().nonnegative(),
  bestCombo: z.int().nonnegative(),
  startedAt: z.string(),
  updatedAt: z.string(),
  finishedAt: z.string().nullable(),
  activeMs: z.number().nonnegative(),
  committed: z.boolean(),
});

export type SessionState = z.infer<typeof SessionSchema>;
export type Lookup = (key: string) => PlanStep | undefined;

export type SessionAction =
  | { type: 'respond'; response: Response; now: number }
  | { type: 'check'; now: number }
  | { type: 'advance'; now: number }
  | { type: 'commit' };

export function createSession(id: string, mode: SessionState['mode'], plan: readonly PlanStep[], now: number): SessionState {
  const keys = plan.map((item) => item.key);
  const iso = new Date(now).toISOString();
  return {
    v: SESSION_VERSION,
    id,
    mode,
    plan: keys,
    queue: keys,
    pos: 0,
    phase: 'answering',
    lastCorrect: null,
    responses: {},
    firstTry: {},
    flags: {},
    combo: 0,
    bestCombo: 0,
    startedAt: iso,
    updatedAt: iso,
    finishedAt: null,
    activeMs: 0,
    committed: false,
  };
}

export function currentKey(state: SessionState): string | undefined {
  return state.queue[state.pos];
}

/** Het antwoord op de huidige positie, of een leeg antwoord als er nog niets (passends) is. */
export function currentResponse(state: SessionState, item: PlanStep): Response {
  const saved = state.responses[String(state.pos)];
  return saved && responseFits(item.step, saved) ? saved : initialResponse(item.step);
}

/** Is dit een herhaling van een eerder fout beantwoorde stap? */
export function isRetry(state: SessionState): boolean {
  return state.pos >= state.plan.length;
}

function touch(state: SessionState, now: number): SessionState {
  const gap = now - Date.parse(state.updatedAt);
  const active = Number.isFinite(gap) && gap > 0 ? Math.min(gap, ACTIVE_GAP_MS) : 0;
  return { ...state, updatedAt: new Date(now).toISOString(), activeMs: state.activeMs + active };
}

/** Rond de huidige stap af: uitkomst vastleggen en naar de feedback. */
function finalize(state: SessionState, key: string, item: PlanStep, response: Response, now: number): SessionState {
  const outcome = evaluate(item.step, response);
  const scored = isScored(item.step) && outcome.score !== null;
  const combo = scored ? (outcome.correct ? state.combo + 1 : 0) : state.combo;
  return touch(
    {
      ...state,
      phase: 'feedback',
      lastCorrect: outcome.correct,
      combo,
      bestCombo: Math.max(state.bestCombo, combo),
      firstTry: scored && !(key in state.firstTry) ? { ...state.firstTry, [key]: outcome.score ?? 0 } : state.firstTry,
      flags: outcome.review && !(key in state.flags) ? { ...state.flags, [key]: outcome.review } : state.flags,
      queue: outcome.requeue ? [...state.queue, key] : state.queue,
    },
    now,
  );
}

export function sessionReducer(state: SessionState, action: SessionAction, lookup: Lookup): SessionState {
  if (action.type === 'commit') return { ...state, committed: true };
  if (state.phase === 'done') return state;

  const key = currentKey(state);
  const item = key ? lookup(key) : undefined;
  if (!key || !item) return state;
  const response = currentResponse(state, item);

  switch (action.type) {
    case 'respond': {
      if (state.phase !== 'answering' || action.response.kind !== item.step.kind) return state;
      const next = touch({ ...state, responses: { ...state.responses, [String(state.pos)]: action.response } }, action.now);
      // Zelfcontrolerende oefeningen ronden zichzelf af zodra ze klaar zijn.
      if (stepMode(item.step) === 'task' && isComplete(item.step, action.response)) return finalize(next, key, item, action.response, action.now);
      return next;
    }
    case 'check': {
      if (state.phase !== 'answering' || stepMode(item.step) !== 'graded' || !isComplete(item.step, response)) return state;
      return finalize(state, key, item, response, action.now);
    }
    case 'advance': {
      const canAdvance =
        state.phase === 'feedback' || (state.phase === 'answering' && stepMode(item.step) === 'teach' && isComplete(item.step, response));
      if (!canAdvance) return state;
      const pos = state.pos + 1;
      const done = pos >= state.queue.length;
      return touch(
        {
          ...state,
          pos: done ? state.pos : pos,
          phase: done ? 'done' : 'answering',
          lastCorrect: null,
          finishedAt: done ? new Date(action.now).toISOString() : null,
        },
        action.now,
      );
    }
  }
}

export type SessionSummary = {
  graded: number;
  firstTryCorrect: number;
  /** Percentage oefeningen dat in één keer goed was. */
  accuracy: number;
  retries: number;
  /** Stappen voor de herhaalstapel (fout, of goed maar met twijfel). */
  missed: string[];
  /** Stappen die van de herhaalstapel af mogen. */
  cleared: string[];
  activeMs: number;
  bestCombo: number;
};

export function summarize(state: SessionState, lookup: Lookup): SessionSummary {
  const gradedKeys = state.plan.filter((key) => {
    const item = lookup(key);
    return item ? isScored(item.step) : false;
  });
  const total = gradedKeys.reduce((sum, key) => sum + (state.firstTry[key] ?? 0), 0);
  const cleared = state.plan.filter((key) => state.flags[key] === 'clear');
  const missed = state.plan.filter((key) => state.flags[key] === 'miss');
  return {
    graded: gradedKeys.length,
    firstTryCorrect: gradedKeys.filter((key) => state.firstTry[key] === 1).length,
    accuracy: gradedKeys.length ? Math.round((total / gradedKeys.length) * 100) : 100,
    retries: state.queue.length - state.plan.length,
    missed,
    cleared,
    activeMs: state.activeMs,
    bestCombo: state.bestCombo,
  };
}

/** Voortgang binnen de sessie voor de voortgangsbalk (0–1). */
export function sessionProgress(state: SessionState): number {
  if (state.phase === 'done') return 1;
  const finished = state.pos + (state.phase === 'feedback' && state.lastCorrect ? 1 : 0);
  return Math.min(1, finished / state.queue.length);
}
