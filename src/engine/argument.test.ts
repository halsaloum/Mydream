// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { ARGUMENT_DEMOS } from '@/content/demo/argumenten';
import { StepSchema, type Step, type StepOf } from '@/content/schema';
import {
  argumentEvaluate, argumentFits, argumentInitialResponse, argumentIsComplete,
  dilemmaAdd, dilemmaAllAdded, dilemmaPick, dilemmaSigns,
  evidenceBar, evidenceChoose, evidenceFitting, evidenceStatus,
  inspectFix, inspectFlawed, inspectLabel, inspectSelect, inspectVerdictOf,
  reasonCheck, reasonLines, reasonNextPair, reasonWay,
  rebutParagraph, rebutPick, slopeBalls, slopeJudge, slopePick,
  strawmanPick, strawmanTap, strawmanTwists, supportBlocks, supportPick,
  type ArgumentKind, type ArgumentResponse, type ArgumentResponseOf,
} from './argument';
import { isComplete } from './grade';
import { ResponseSchema, responseFits } from './responses';
import type { PlanStep } from './plan';
import { createSession, sessionReducer, summarize } from './session';

const kinds: ArgumentKind[] = ['reason', 'support', 'evidence', 'rebut', 'strawman', 'slope', 'dilemma', 'inspect'];
const demo = <K extends ArgumentKind>(kind: K): StepOf<K> => {
  const item = ARGUMENT_DEMOS.find((entry) => entry.step.kind === kind)!;
  return StepSchema.parse(item.step) as StepOf<K>;
};
const initial = <K extends ArgumentKind>(step: StepOf<K>) => argumentInitialResponse(step) as ArgumentResponseOf<K>;
const goodIndex = (options: readonly { ok?: boolean }[]) => options.findIndex((option) => option.ok === true);
const badIndex = (options: readonly { ok?: boolean }[]) => options.findIndex((option) => option.ok !== true);

/** Save and reload the real response shape used by lesson/session persistence. */
function reload<R extends ArgumentResponse>(step: Step, response: R): R {
  const saved = ResponseSchema.parse(JSON.parse(JSON.stringify(response)));
  expect(responseFits(step, saved)).toBe(true);
  return saved as R;
}

describe('Want of dus: twee richtingen en meerdere paren', () => {
  it('vraagt beide correcte richtingen per paar en bewaart fouten na de overgang', () => {
    const step = demo('reason');
    let state = initial(step);
    expect(argumentIsComplete(step, state)).toBe(false);
    expect(reasonNextPair(step, state)).toEqual(state);

    const wrong = reasonCheck(step, { ...state, top: 'claim', word: 'dus' });
    expect(wrong.note?.tone).toBe('wrong');
    expect(wrong.response).toMatchObject({ pair: 0, found: [], mistakes: 1 });
    state = reload(step, wrong.response);
    state = reasonCheck(step, { ...state, top: 'claim', word: 'want' }).response;
    expect(state.found).toEqual(['want']);
    expect(reasonNextPair(step, state)).toEqual(state);
    expect(argumentIsComplete(step, state)).toBe(false);
    expect(reasonCheck(step, state).response).toEqual(state);

    state = reasonCheck(step, { ...state, top: 'reason', word: 'dus' }).response;
    expect(argumentIsComplete(step, state)).toBe(false);
    state = reasonNextPair(step, state);
    expect(state).toMatchObject({ pair: 1, found: [], mistakes: 1, ...step.pairs[1]!.start });
    state = reload(step, state);
    state = reasonCheck(step, { ...state, top: 'reason', word: 'dus' }).response;
    expect(argumentIsComplete(step, state)).toBe(false);
    state = reasonCheck(step, { ...state, top: 'claim', word: 'want' }).response;
    expect(isComplete(step, state)).toBe(true);
    expect(reasonNextPair(step, state)).toEqual(state);
    expect(argumentEvaluate(step, state)).toMatchObject({ score: 0.8, correct: false, review: 'miss', requeue: false });
  });

  it('plaatst bij want het argument tweede en bij dus het standpunt tweede', () => {
    const step = demo('reason');
    const claimFirst = { ...initial(step), top: 'claim' as const, word: 'want' as const };
    const reasonFirst = { ...claimFirst, top: 'reason' as const, word: 'dus' as const };
    expect(reasonLines(step, claimFirst).bottom.role).toBe('reason');
    expect(reasonLines(step, reasonFirst).bottom.role).toBe('claim');
    expect(reasonWay(step, 0, 'want').filter((part) => part.claim).map((part) => part.t)).toEqual([step.pairs[0]!.claim.lead]);
    expect(reasonWay(step, 0, 'dus').filter((part) => part.claim).map((part) => part.t)).toEqual([step.pairs[0]!.claim.mid]);
  });
});

describe('Onderbouwen en weerleggen: fouten herstellen voordat de volgende vraag opent', () => {
  it('support houdt de vraag open bij een fout en telt herhaald klikken op dezelfde afleider niet opnieuw', () => {
    const step = demo('support');
    let state = initial(step);
    const bad = badIndex(step.levels[0]!.options);
    const wrong = supportPick(step, state, bad);
    expect(wrong.note?.tone).toBe('wrong');
    expect(wrong.response.level).toBe(0);
    state = reload(step, wrong.response);
    expect(supportPick(step, state, bad).response).toEqual(state);
    expect(isComplete(step, state)).toBe(false);
    for (let level = 0; level < step.levels.length; level++) {
      state = supportPick(step, state, goodIndex(step.levels[level]!.options)).response;
      expect(state.tried).toEqual([]);
      expect(argumentIsComplete(step, state)).toBe(level === step.levels.length - 1);
    }
    expect(supportBlocks(step, state.level).map((block) => block.role)).toEqual(['standpunt', 'argument', 'uitleg', 'feit']);
    expect(argumentEvaluate(step, state)).toMatchObject({ score: 0.75, correct: false, review: 'miss' });
  });

  it('rebut bouwt pas na een passend antwoord het toegegeven deel en de weerlegging op', () => {
    const step = demo('rebut');
    let state = initial(step);
    const bad = badIndex(step.rounds[0]!.options);
    state = rebutPick(step, state, bad).response;
    expect(state).toMatchObject({ round: 0, mistakes: 1, tried: [bad] });
    expect(rebutParagraph(step, state.round)).toHaveLength(1);
    state = reload(step, state);
    expect(rebutPick(step, state, bad).response).toEqual(state);
    for (let round = 0; round < step.rounds.length; round++) {
      expect(isComplete(step, state)).toBe(false);
      state = rebutPick(step, state, goodIndex(step.rounds[round]!.options)).response;
    }
    expect(isComplete(step, state)).toBe(true);
    expect(rebutParagraph(step, state.round).map((part) => part.part)).toEqual(['base', 'concede', 'rebut', 'concede', 'rebut']);
    expect(argumentEvaluate(step, state)).toMatchObject({ score: 0.667, correct: false, review: 'miss' });
  });
});

describe('Bewijsbalk: iedere rij moet bij het bewijs passen', () => {
  it('rondt niet af na één juiste rij en herstelt een te sterke claim per rij', () => {
    const step = demo('evidence');
    let state = initial(step);
    expect(evidenceFitting(step, state)).toBe(1);
    expect(isComplete(step, state)).toBe(false);
    const row = step.rows[0]!;
    const excessive = row.options.findIndex((option) => option.need > row.known);
    state = evidenceChoose(state, excessive);
    expect(evidenceStatus(row, excessive)).toBe('stellig');
    expect(evidenceBar(row, excessive).promise).toBeGreaterThan(evidenceBar(row, excessive).known);
    state = reload(step, state);
    state = evidenceChoose(state, row.best);
    expect(isComplete(step, state)).toBe(false);
    for (let index = 1; index < step.rows.length; index++) {
      state = evidenceChoose({ ...state, sel: index }, step.rows[index]!.best);
    }
    expect(isComplete(step, state)).toBe(true);
    // The slider is exploratory: its current claim matters, and it has no first-attempt score.
    expect(argumentEvaluate(step, state)).toMatchObject({ score: null, correct: true, review: null });
  });
});

describe('Drogredenen: herkennen én eerlijk herstellen', () => {
  it('strawman vraagt alle verdraaiingen voordat een eerlijke reactie kan worden gekozen', () => {
    const step = demo('strawman');
    let state = initial(step);
    const good = goodIndex(step.options);
    expect(strawmanPick(step, state, good).response).toEqual(state);
    const plain = step.response.chunks.findIndex((chunk) => !chunk.twist);
    state = strawmanTap(step, state, plain).response;
    expect(state.mistakes).toBe(1);
    state = reload(step, state);
    const twists = step.response.chunks.flatMap((chunk, index) => chunk.twist ? [index] : []);
    for (const index of twists) {
      const before = state;
      state = strawmanTap(step, state, index).response;
      expect(strawmanTap(step, state, index).response).toEqual(state);
      expect(state.found.length).toBe(before.found.length + 1);
      expect(isComplete(step, state)).toBe(false);
    }
    const bad = badIndex(step.options);
    state = strawmanPick(step, state, bad).response;
    expect(strawmanPick(step, state, bad).response).toEqual(state);
    state = strawmanPick(step, state, good).response;
    expect(isComplete(step, state)).toBe(true);
    expect(argumentEvaluate(step, state)).toMatchObject({ score: 0.6, review: 'miss' });
  });

  it('slope vraagt eerst elke schakel en daarna een eerlijke versie', () => {
    const step = demo('slope');
    let state = initial(step);
    const good = goodIndex(step.options);
    expect(slopePick(step, state, good).response).toEqual(state);
    state = slopeJudge(step, state, !step.links[0]!.holds).response;
    expect(state).toMatchObject({ judged: 0, mistakes: 1 });
    state = reload(step, state);
    for (const link of step.links) {
      state = slopeJudge(step, state, link.holds).response;
      expect(isComplete(step, state)).toBe(false);
    }
    expect(slopeBalls(step, state.judged)).toEqual({ real: 0, ghost: 3 });
    const bad = badIndex(step.options);
    state = slopePick(step, state, bad).response;
    expect(slopePick(step, state, bad).response).toEqual(state);
    state = slopePick(step, state, good).response;
    expect(isComplete(step, state)).toBe(true);
    expect(argumentEvaluate(step, state)).toMatchObject({ score: 0.667, review: 'miss' });
  });

  it('dilemma vraagt verschillende geldige alternatieven vóór de eerlijke slotversie', () => {
    const step = demo('dilemma');
    let state = initial(step);
    const good = goodIndex(step.options);
    expect(dilemmaPick(step, state, good).response).toEqual(state);
    const badCandidate = badIndex(step.candidates);
    state = dilemmaAdd(step, state, badCandidate).response;
    expect(state.added).toEqual([]);
    state = reload(step, state);
    expect(dilemmaAdd(step, state, badCandidate).response).toEqual(state);
    const alternatives = step.candidates.flatMap((candidate, index) => candidate.ok === true ? [index] : []);
    for (const index of alternatives) {
      state = dilemmaAdd(step, state, index).response;
      expect(dilemmaAdd(step, state, index).response).toEqual(state);
      expect(isComplete(step, state)).toBe(false);
    }
    expect(dilemmaAllAdded(step, state)).toBe(true);
    expect(dilemmaSigns(step, state).filter((sign) => sign.added && sign.t)).toHaveLength(alternatives.length);
    const bad = badIndex(step.options);
    state = dilemmaPick(step, state, bad).response;
    expect(dilemmaPick(step, state, bad).response).toEqual(state);
    state = dilemmaPick(step, state, good).response;
    expect(isComplete(step, state)).toBe(true);
    expect(argumentEvaluate(step, state)).toMatchObject({ score: 0.6, review: 'miss' });
  });
});

describe('Keuring: alle zinnen beoordelen, drogredenen herstellen', () => {
  it('kan niet vroeg afronden door alleen de foute zinnen te herstellen', () => {
    const step = demo('inspect');
    let state = initial(step);
    for (const row of inspectFlawed(step)) {
      state = inspectSelect(state, row);
      state = inspectLabel(step, state, inspectVerdictOf(step, row)).response;
      const item = step.rows[row]!;
      if (!('fallacy' in item)) throw new Error('Expected a flawed row');
      state = inspectFix(step, state, goodIndex(item.fixes)).response;
    }
    expect(state.fixed).toEqual(inspectFlawed(step));
    expect(argumentIsComplete(step, state)).toBe(false);
    state = reload(step, state);
    for (let row = 0; row < step.rows.length; row++) {
      if (state.judged.includes(row)) continue;
      state = inspectLabel(step, inspectSelect(state, row), 0).response;
    }
    expect(isComplete(step, state)).toBe(true);
  });

  it('vraagt een juist oordeel vóór herstel en telt oordelen én reparaties in de score', () => {
    const step = demo('inspect');
    let state = inspectSelect(initial(step), 2);
    const flawed = step.rows[2]!;
    if (!('fallacy' in flawed)) throw new Error('Expected a flawed row');
    const fix = goodIndex(flawed.fixes);
    expect(inspectFix(step, state, fix).response).toEqual(state);
    state = inspectLabel(step, state, 0).response;
    expect(state).toMatchObject({ judged: [], fixed: [], mistakes: 1 });
    expect(inspectLabel(step, state, 0).response).toEqual(state);
    state = reload(step, state);
    for (let row = 0; row < step.rows.length; row++) {
      state = inspectLabel(step, inspectSelect(state, row), inspectVerdictOf(step, row)).response;
      const item = step.rows[row]!;
      if ('fallacy' in item) state = inspectFix(step, state, goodIndex(item.fixes)).response;
    }
    expect(isComplete(step, state)).toBe(true);
    // Five verdicts plus two repairs = seven successful decisions, with one mistake.
    expect(argumentEvaluate(step, state)).toMatchObject({ score: 0.875, correct: false, review: 'miss', requeue: false });
  });

  it('houdt de sessie in answering tot ook de correcte rijen beoordeeld zijn', () => {
    const step = demo('inspect');
    const item: PlanStep = { key: 'inspect:test#x', lessonId: 'inspect', step, source: { stepIndex: 0 } };
    const lookup = (key: string) => key === item.key ? item : undefined;
    let session = createSession('inspect', 'lesson', [item], 0);
    let response = initial(step);
    let time = 0;
    const dispatch = () => { session = sessionReducer(session, { type: 'respond', response, now: ++time * 1000 }, lookup); };
    for (const row of inspectFlawed(step)) {
      response = inspectLabel(step, inspectSelect(response, row), inspectVerdictOf(step, row)).response;
      dispatch();
      const item = step.rows[row]!;
      if ('fallacy' in item) response = inspectFix(step, response, goodIndex(item.fixes)).response;
      dispatch();
    }
    expect(session.phase).toBe('answering');
    for (let row = 0; row < step.rows.length; row++) {
      if (response.judged.includes(row)) continue;
      response = inspectLabel(step, inspectSelect(response, row), 0).response;
      dispatch();
    }
    expect(session.phase).toBe('feedback');
    expect(summarize(session, lookup)).toMatchObject({ firstTryCorrect: 1, accuracy: 100, missed: [] });
  });
});

describe('Opgeslagen argumentatie-antwoorden blijven geldig voor hun eigen oefening', () => {
  it.each(kinds)('%s bewaart een onvoltooide beginstand en verwerpt een antwoord van een ander type', (kind) => {
    const step = demo(kind);
    const state = argumentInitialResponse(step)!;
    expect(reload(step, state)).toEqual(state);
    expect(isComplete(step, state)).toBe(false);
    const other = argumentInitialResponse(demo(kind === 'reason' ? 'support' : 'reason'))!;
    expect(responseFits(step, other)).toBe(false);
  });

  it('verwerpt indices die na een inhoudswijziging niet meer bestaan', () => {
    const reason = demo('reason');
    expect(argumentFits(reason, { ...initial(reason), pair: reason.pairs.length })).toBe(false);
    const support = demo('support');
    expect(argumentFits(support, { ...initial(support), level: support.levels.length + 1 })).toBe(false);
    const evidence = demo('evidence');
    const state = initial(evidence);
    expect(argumentFits(evidence, { ...state, pick: [evidence.rows[0]!.options.length, ...state.pick.slice(1)] })).toBe(false);
    const rebut = demo('rebut');
    expect(argumentFits(rebut, { ...initial(rebut), round: rebut.rounds.length + 1 })).toBe(false);
    const strawman = demo('strawman');
    expect(argumentFits(strawman, { ...initial(strawman), found: ['unknown-twist'] })).toBe(false);
    const slope = demo('slope');
    expect(argumentFits(slope, { ...initial(slope), judged: slope.links.length + 1 })).toBe(false);
    const dilemma = demo('dilemma');
    expect(argumentFits(dilemma, { ...initial(dilemma), added: [badIndex(dilemma.candidates)] })).toBe(false);
    const inspect = demo('inspect');
    expect(argumentFits(inspect, { ...initial(inspect), sel: inspect.rows.length })).toBe(false);
  });

  it('verwerpt een stroman-reactie die de herkenningsfase overslaat of verdraaiingen dubbel opslaat', () => {
    const step = demo('strawman');
    expect(argumentFits(step, { ...initial(step), fair: true })).toBe(false);
    const twist = strawmanTwists(step)[0]!;
    expect(argumentFits(step, { ...initial(step), found: [twist, twist] })).toBe(false);
  });

  it('verwerpt een hellend-vlakantwoord dat een eerlijke slotversie vóór de schakels opslaat', () => {
    const step = demo('slope');
    expect(argumentFits(step, { ...initial(step), honest: true })).toBe(false);
  });

  it('verwerpt een dilemma zonder verschillende alternatieven, ook als de JSON structureel geldig is', () => {
    const step = demo('dilemma');
    expect(argumentFits(step, { ...initial(step), honest: true })).toBe(false);
    const candidate = goodIndex(step.candidates);
    const duplicate = { ...initial(step), added: [candidate, candidate] };
    expect(ResponseSchema.safeParse(duplicate).success).toBe(true);
    expect(argumentFits(step, duplicate)).toBe(false);
    expect(dilemmaAllAdded(step, duplicate)).toBe(false);
  });

  it('verwerpt keuring-reparaties voor correcte of nog niet beoordeelde rijen', () => {
    const step = demo('inspect');
    const sound = step.rows.findIndex((row) => !('fallacy' in row));
    const flawed = inspectFlawed(step)[0]!;
    expect(argumentFits(step, { ...initial(step), judged: [sound], fixed: [sound] })).toBe(false);
    expect(argumentFits(step, { ...initial(step), fixed: [flawed] })).toBe(false);
    expect(argumentFits(step, { ...initial(step), judged: [flawed, flawed] })).toBe(false);
  });

  it('verwerpt correcte keuzes in tried zodat een hervatte oefening niet onoplosbaar wordt', () => {
    const support = demo('support');
    const rebut = demo('rebut');
    const strawman = demo('strawman');
    const slope = demo('slope');
    const dilemma = demo('dilemma');
    const states: { step: Step; response: ArgumentResponse }[] = [
      { step: support, response: { ...initial(support), tried: [goodIndex(support.levels[0]!.options)] } },
      { step: rebut, response: { ...initial(rebut), tried: [goodIndex(rebut.rounds[0]!.options)] } },
      { step: strawman, response: { ...initial(strawman), found: strawmanTwists(strawman), tried: [goodIndex(strawman.options)] } },
      { step: slope, response: { ...initial(slope), judged: slope.links.length, tried: [goodIndex(slope.options)] } },
      { step: dilemma, response: { ...initial(dilemma), tried: [goodIndex(dilemma.candidates)] } },
      { step: dilemma, response: {
        ...initial(dilemma),
        added: dilemma.candidates.flatMap((candidate, index) => candidate.ok === true ? [index] : []),
        triedOptions: [goodIndex(dilemma.options)],
      } },
    ];
    for (const { step, response } of states) {
      expect(ResponseSchema.safeParse(response).success).toBe(true);
      expect(argumentFits(step, response), step.kind).toBe(false);
      expect(responseFits(step, response), step.kind).toBe(false);
    }
  });
});
