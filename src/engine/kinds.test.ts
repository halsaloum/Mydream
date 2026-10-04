// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { demoEntries, getDemo } from '@/content/demo';
import type { Step, StepOf } from '@/content/schema';
import { evaluate, isComplete } from './grade';
import { betConsequence, clampCount, dictationDiff, EXTRA_RESPONSE_SCHEMAS, extraFeedback, speedScore, STEP_MODES } from './kinds';
import type { PlanStep } from './plan';
import { initialResponse, type Response } from './responses';
import { createSession, sessionReducer, summarize } from './session';

const demo = <K extends Step['kind']>(slug: string) => getDemo(slug)!.step as StepOf<K>;

function runTask(step: Step, responses: Response[]) {
  const item: PlanStep = { key: 'demo:s0#x', lessonId: 'demo', step, source: { stepIndex: 0 } };
  const lookup = (key: string) => (key === item.key ? item : undefined);
  let state = createSession('demo', 'lesson', [item], 0);
  responses.forEach((response, i) => {
    state = sessionReducer(state, { type: 'respond', response, now: (i + 1) * 1000 }, lookup);
  });
  return { state, summary: summarize(state, lookup) };
}

describe('demoset oefenvormen', () => {
  it('bevat voor elke nieuwe oefenvorm een gevalideerd voorbeeld', () => {
    const kinds = new Set(demoEntries.map((entry) => entry.step.kind));
    for (const schema of EXTRA_RESPONSE_SCHEMAS) expect(kinds.has(schema.shape.kind.value)).toBe(true);
    expect(demoEntries).toHaveLength(19);
  });

  it('elke vorm heeft een modus', () => {
    demoEntries.forEach((entry) => expect(STEP_MODES[entry.step.kind]).toBeDefined());
  });
});

describe('zelfcontrolerende oefeningen', () => {
  it('rondt automatisch af; fouten geven een lagere score en een plek in de herhaling, zonder herhaling in de les', () => {
    const step = demo<'ladder'>('betekenisladder');
    const { state, summary } = runTask(step, [
      { kind: 'ladder', placed: 1, mistakes: 1 },
      { kind: 'ladder', placed: 5, mistakes: 1 },
    ]);
    expect(state.phase).toBe('feedback');
    expect(state.queue).toHaveLength(1);
    expect(summary.accuracy).toBe(83);
    expect(summary.missed).toHaveLength(1);
  });

  it('zonder fouten: volle score en van de herhaalstapel af', () => {
    const { summary } = runTask(demo('verwijsdraad'), [{ kind: 'refs', linked: 3, mistakes: 0 }]);
    expect(summary).toMatchObject({ accuracy: 100, firstTryCorrect: 1 });
    expect(summary.cleared).toHaveLength(1);
  });

  it('ontdekvormen tellen niet mee in de score', () => {
    const step = demo<'train'>('zinstrein');
    const { state, summary } = runTask(step, [{ kind: 'train', front: 'P', seen: ['S', 'T', 'P'] }]);
    expect(state.phase).toBe('feedback');
    expect(state.lastCorrect).toBe(true);
    expect(summary.graded).toBe(0);
    expect(summary.missed).toHaveLength(0);
  });

  it('swipe-kaarten: score per kaart en de tekst uit de mock', () => {
    const step = demo<'swipe'>('swipe-kaarten');
    const answers = step.cards.map((card, i) => (i === 2 ? !card.ok : card.ok));
    const response: Response = { kind: 'swipe', answers };
    expect(isComplete(step, response)).toBe(true);
    const outcome = evaluate(step, response);
    expect(outcome.score).toBeCloseTo(5 / 6);
    expect(extraFeedback(step, response as never, outcome)).toEqual({ title: 'Mooi zo!', body: 'Je hebt 5 van de 6 zinnen goed beoordeeld.' });
  });

  it('zinstang: veertien woorden in de tang, korter na verplaatsen', () => {
    const step = demo<'clamp'>('zinstang');
    expect(clampCount(step, { a: 'mid', b: 'mid', c: 'mid', d: 'mid' })).toBe(14);
    expect(clampCount(step, { a: 'front', b: 'mid', c: 'mid', d: 'mid' })).toBe(15);
    expect(isComplete(step, { kind: 'clamp', pos: { a: 'mid', b: 'mid', c: 'after', d: 'after' } })).toBe(true);
  });

  it('snelrondje: tien punten, vanaf de derde op rij twintig', () => {
    expect(speedScore([{ ok: true }, { ok: true }, { ok: true }, { ok: false }, { ok: true }])).toEqual({ points: 50, combo: 1, best: 3, correct: 4 });
  });
});

describe('gecontroleerde nieuwe vormen', () => {
  it('Durf je?: goed met twijfel komt terug, fout komt achteraan opnieuw', () => {
    const step = demo<'bet'>('durf-je');
    expect(evaluate(step, { kind: 'bet', value: step.answer, bet: 1 })).toMatchObject({ correct: true, requeue: false, review: 'miss' });
    expect(evaluate(step, { kind: 'bet', value: step.answer, bet: 3 })).toMatchObject({ correct: true, review: 'clear' });
    expect(evaluate(step, { kind: 'bet', value: step.options[0]!, bet: 2 })).toMatchObject({ correct: false, requeue: true });
    expect(betConsequence(false, 1)).toBe('Fout, maar je wist dat je twijfelde. Dat is ook kennis.');
  });

  it('dictee: hoofdletters en punt tellen mee, spaties niet', () => {
    const step = demo<'dictation'>('dictee');
    expect(evaluate(step, { kind: 'dictation', value: '  Mijn vrouw  draagt een blauwe jas. ', plays: 1, shown: false }).correct).toBe(true);
    expect(evaluate(step, { kind: 'dictation', value: 'mijn vrouw draagt een blauwe jas', plays: 1, shown: false }).correct).toBe(false);
    expect(dictationDiff(step.sentence, 'Mijn vrouw draagt een blouwe jas.').filter((word) => !word.ok).map((word) => word.word)).toEqual(['blauwe']);
  });

  it('beginantwoorden passen bij hun stap', () => {
    demoEntries.forEach((entry) => expect(initialResponse(entry.step).kind).toBe(entry.step.kind));
  });
});
