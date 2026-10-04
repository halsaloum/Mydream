// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { getLessonEntry } from '@/content/catalog';
import { buildPlan } from './plan';
import { createSession, currentKey, currentResponse, isRetry, sessionProgress, sessionReducer, summarize, type SessionState } from './session';

const plan = buildPlan(getLessonEntry('z1')!.lesson);
const byKey = new Map(plan.map((item) => [item.key, item]));
const lookup = (key: string) => byKey.get(key);
const kinds = plan.map((item) => item.step.kind);

function current(state: SessionState) {
  const key = currentKey(state);
  return key ? byKey.get(key)! : undefined;
}

describe('sessieverloop', () => {
  it('heeft het verwachte plan', () => {
    expect(kinds).toEqual(['explain', 'choice', 'rewrite', 'fix']);
  });

  it('doorloopt uitleg, zet fouten achteraan en rondt af', () => {
    let state = createSession('z1', 'lesson', plan, 1_000);
    const t = (s: number) => 1_000 + s * 1_000;

    // Uitleg: niet verder voordat elk deel klaar is.
    const explain = current(state)!.step;
    if (explain.kind !== 'explain') throw new Error('verwacht uitleg');
    expect(sessionReducer(state, { type: 'advance', now: t(1) }, lookup)).toBe(state);
    state = sessionReducer(
      state,
      { type: 'respond', response: { kind: 'explain', panel: 2, reached: 2, labs: {}, solved: ['0:mark', '1:swap'] }, now: t(2) },
      lookup,
    );
    state = sessionReducer(state, { type: 'advance', now: t(3) }, lookup);
    expect(current(state)!.step.kind).toBe('choice');

    // Fout antwoord: feedback blijft staan, de stap komt achteraan terug.
    state = sessionReducer(state, { type: 'respond', response: { kind: 'choice', value: 'speelt' }, now: t(4) }, lookup);
    state = sessionReducer(state, { type: 'check', now: t(5) }, lookup);
    expect(state.phase).toBe('feedback');
    expect(state.lastCorrect).toBe(false);
    expect(state.queue).toHaveLength(plan.length + 1);
    // Antwoorden is op slot tijdens feedback.
    expect(sessionReducer(state, { type: 'respond', response: { kind: 'choice', value: 'spelen' }, now: t(6) }, lookup)).toBe(state);
    state = sessionReducer(state, { type: 'advance', now: t(7) }, lookup);

    state = sessionReducer(
      state,
      { type: 'respond', response: { kind: 'rewrite', value: 'Elke zaterdag zwemmen we in het meer.' }, now: t(8) },
      lookup,
    );
    state = sessionReducer(state, { type: 'check', now: t(9) }, lookup);
    expect(state.lastCorrect).toBe(true);
    state = sessionReducer(state, { type: 'advance', now: t(10) }, lookup);

    state = sessionReducer(state, { type: 'respond', response: { kind: 'fix', index: 5, value: 'werken' }, now: t(11) }, lookup);
    state = sessionReducer(state, { type: 'check', now: t(12) }, lookup);
    state = sessionReducer(state, { type: 'advance', now: t(13) }, lookup);

    // Herhaling begint met een leeg antwoord.
    expect(isRetry(state)).toBe(true);
    expect(currentResponse(state, current(state)!)).toEqual({ kind: 'choice', value: null });
    state = sessionReducer(state, { type: 'respond', response: { kind: 'choice', value: 'spelen' }, now: t(14) }, lookup);
    state = sessionReducer(state, { type: 'check', now: t(15) }, lookup);
    state = sessionReducer(state, { type: 'advance', now: t(16) }, lookup);

    expect(state.phase).toBe('done');
    expect(sessionProgress(state)).toBe(1);
    const summary = summarize(state, lookup);
    expect(summary).toMatchObject({ graded: 3, firstTryCorrect: 2, accuracy: 67, retries: 1, bestCombo: 3 });
    expect(summary.missed).toEqual([plan[1]!.key]);
    expect(summary.activeMs).toBe(16_000);
  });

  it('telt lange pauzes niet als oefentijd', () => {
    let state = createSession('z1', 'lesson', plan, 0);
    state = sessionReducer(state, { type: 'respond', response: { kind: 'explain', panel: 1, reached: 1, labs: {}, solved: [] }, now: 3_600_000 }, lookup);
    expect(state.activeMs).toBe(60_000);
  });
});
