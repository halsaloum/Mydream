// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { demoEntries, getDemo } from '@/content/demo';
import type { Step, StepOf } from '@/content/schema';
import { evaluate, isComplete } from './grade';
import { betConsequence, clampCount, dictationDiff, EXTRA_RESPONSE_SCHEMAS, extraFeedback, extraFits, isScored, speedScore, STEP_MODES } from './kinds';
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
    expect(demoEntries).toHaveLength(37);
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

  it('een onbecijferde woordgok vervuilt het percentage en de eerste-pogingenteller niet', () => {
    const step = demo<'guess'>('raad-eerst');
    expect(isScored(step)).toBe(false);
    const item: PlanStep = { key: 'guess', lessonId: 'demo', step, source: { stepIndex: 0 } };
    const lookup = () => item;
    let state = createSession('demo', 'lesson', [item], 0);
    const response: Response = { kind: 'guess', value: step.options[0] ?? null };
    state = sessionReducer(state, { type: 'respond', response, now: 1000 }, lookup);
    state = sessionReducer(state, { type: 'check', now: 2000 }, lookup);
    expect(state.firstTry).toEqual({});
    expect(summarize(state, lookup)).toMatchObject({ graded: 0, firstTryCorrect: 0 });
  });

  it('swipe-kaarten: score per kaart en de tekst uit de mock', () => {
    const step = demo<'swipe'>('swipe-kaarten');
    const answers = step.cards.map((card, i) => (i === 2 ? !card.ok : card.ok));
    const response: Response = { kind: 'swipe', answers };
    expect(isComplete(step, response)).toBe(true);
    const outcome = evaluate(step, response);
    expect(outcome.score).toBeCloseTo(5 / 6);
    expect(extraFeedback(step, response as never, outcome)).toEqual({ title: 'Afgerond met oefenpunten', body: 'Je hebt 5 van de 6 zinnen goed beoordeeld.' });
  });

  it('rondt de swipe-stapel pas af na het bekijken van de laatste uitleg, met compatibele oude antwoorden', () => {
    const step = demo<'swipe'>('swipe-kaarten');
    const answers = step.cards.map((card) => card.ok);
    const pending: Response = { kind: 'swipe', answers, reviewed: answers.length - 1 };
    expect(isComplete(step, pending)).toBe(false);
    expect(isComplete(step, { ...pending, reviewed: answers.length })).toBe(true);
    expect(isComplete(step, { kind: 'swipe', answers })).toBe(true);
    expect(extraFits(step, { ...pending, reviewed: answers.length + 1 })).toBe(false);
    expect(extraFits(step, { ...pending, reviewed: 0 })).toBe(false);
    const { state } = runTask(step, [pending]);
    expect(state.phase).toBe('answering');
  });

  it('een snelle herhaling wist geen fout; één goed antwoord bewijst niet de hele snelreeks', () => {
    const step = demo<'speed'>('snelrondje');
    const partial: Response = { kind: 'speed', answers: [{ item: 0, ok: true }], clock: true, endsAt: 20_000, finished: true };
    expect(evaluate(step, partial)).toMatchObject({ correct: false, review: 'miss' });
    expect(evaluate(step, partial).score).toBeCloseTo(1 / step.items.length, 2);
    expect(extraFeedback(step, partial, evaluate(step, partial)).body).toContain(`${step.items.length - 1} combinaties zijn nog niet geoefend`);
    const answers = step.items.map((_, item) => ({ item, ok: item !== 0 }));
    const corrected = { ...partial, answers: [...answers, { item: 0, ok: true }] };
    expect(evaluate(step, corrected).score).toBeCloseTo((step.items.length - 1) / step.items.length, 2);
  });

  it('authored completion text does not hide mistakes in a task', () => {
    const step = { ...demo<'ladder'>('betekenisladder'), done: { title: 'Alles perfect!', text: 'Deze woorden liggen van zwak naar sterk.' } };
    const response: Response = { kind: 'ladder', placed: step.steps.length, mistakes: 2 };
    const feedback = extraFeedback(step, response, evaluate(step, response));
    expect(feedback.title).toBe('Afgerond met oefenpunten');
    expect(feedback.body).toContain('2 verkeerde keuzes');
    expect(feedback.body).toContain(step.done.text);
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
    const apostrof = { ...step, sentence: "We gaan 's avonds met de auto's." };
    expect(evaluate(apostrof, { kind: 'dictation', value: 'We gaan ’s avonds met de auto’s.', plays: 1, shown: false }).correct).toBe(true);
    expect(dictationDiff(apostrof.sentence, 'We gaan ’s avonds met de autos.').filter((word) => !word.ok).map((word) => word.word)).toEqual(["auto's."]);
  });

  it('beginantwoorden passen bij hun stap', () => {
    demoEntries.forEach((entry) => expect(initialResponse(entry.step).kind).toBe(entry.step.kind));
  });
});
