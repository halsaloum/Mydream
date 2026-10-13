import { beforeEach, describe, expect, it } from 'vitest';
import type { DebugExercise, GateExercise, SentenceExercise, SentenceLesson } from '@/content/sentences/types';
import { fingerprint } from '@/engine/hash';
import { emptySentenceAnswer } from '@/lib/sentences/learning';
import { applyImport, exportData, parseImport, resetProgress } from './transfer';
import { EMPTY_SENTENCES, pickSentenceData, SENTENCES_KEY, SentenceDataSchema, useSentences } from './sentences';

const base = { support: 'zelfstandig' as const, ruleId: 'rule', prompt: 'Controleer de zin.', hint: 'Bekijk de vorm.', explanation: 'Dit volgt uit de vorm.' };
const gate: GateExercise = {
  ...base, id: 'gate', kind: 'gate', diagnosis: { prompt: 'Kies de persoonsvorm.', tokens: [{ id: 's', text: 'zij' }, { id: 'v', text: 'werkt' }], targets: ['v'], feedback: 'Verander de tijd.' },
  options: [{ id: 'yes', text: 'Klopt', feedback: 'Goed.' }, { id: 'no', text: 'Klopt niet', feedback: 'Controleer nogmaals.' }], answer: 'yes',
};
const debug: DebugExercise = { ...base, id: 'debug', kind: 'debug', tokens: [{ id: 's', text: 'zij' }, { id: 'v', text: 'werk' }], targets: ['v'], instruction: 'Herstel de persoonsvorm.', repairs: ['Zij werkt.'] };
const arena: SentenceExercise[] = [
  { ...base, id: 'slots', kind: 'slots', blocks: [{ id: 's', text: 'Zij' }, { id: 'v', text: 'werkt' }, { id: 'a', text: 'vandaag' }], slots: [{ id: 'front', label: 'Voorveld', capacity: 1 }, { id: 'middle', label: 'Midden' }], initial: { front: [], middle: ['s', 'a', 'v'] }, accept: [{ front: ['s'], middle: ['v', 'a'] }] },
  gate,
  { ...base, id: 'tether', kind: 'tether', tokens: [{ id: 's', text: 'Zij' }, { id: 'v', text: 'werkt' }], links: [{ from: 's', to: 'v' }] },
  { ...base, id: 'mutate', kind: 'mutate', original: 'Zij werkt.', target: 'time', variants: [{ id: 'time', label: 'Tijd vooraan', blocks: [{ id: 'a', text: 'Vandaag' }, { id: 'v', text: 'werkt' }, { id: 's', text: 'zij' }], order: ['a', 'v', 's'], note: 'De persoonsvorm is tweede.' }] },
  { ...debug, id: 'arena-debug' },
  { ...base, id: 'half', kind: 'slots', support: 'half', blocks: [{ id: 's', text: 'Zij' }, { id: 'v', text: 'werkt' }], slots: [{ id: 'front', label: 'Voorveld' }, { id: 'middle', label: 'Midden' }], initial: { front: [], middle: ['s', 'v'] }, accept: [{ front: ['s'], middle: ['v'] }], segmentation: { prompt: 'Knip de zin.', tokens: [{ id: 's', text: 'Zij' }, { id: 'v', text: 'werkt' }], boundaries: [1], feedback: 'Onderwerp en persoonsvorm zijn afzonderlijke blokken.' } },
];
const lesson: SentenceLesson = {
  id: 'test-zinnen', number: 1, title: 'Oefenen met zinnen', teaser: 'Zinsbouw.', minutes: 10, objectives: ['Herken de vorm.'],
  discovery: { question: 'Wat verandert?', variants: [{ id: 'plain', label: 'Neutraal', sentence: 'Zij werkt.', note: 'Het onderwerp staat vooraan.', blocks: [{ text: 'Zij', role: 'onderwerp' }, { text: 'werkt', role: 'persoonsvorm' }], scene: 'classroom' }], takeaway: 'De volgorde doet ertoe.' },
  rules: [{ id: 'rule', when: 'Bij een mededeling', then: 'Persoonsvorm op plaats twee.', nuance: 'Plaats twee telt zinsdelen.', sourceIds: [] }], decision: [],
  arena, debugger: Array.from({ length: 4 }, (_, index) => ({ ...debug, id: `debug-${index}` })), summary: { title: 'Onthoud', points: ['Controleer de vorm.'], transfer: 'Gebruik dit bij het schrijven.' }, legacyLessonIds: [],
};

beforeEach(() => { useSentences.getState().reset(); });

function solve(task: SentenceExercise) {
  const store = useSentences.getState();
  if (task.support === 'half') {
    store.answer(lesson.id, task.id, { boundaries: task.segmentation!.boundaries });
    expect(store.segment(lesson, task)).toBe(true);
  }
  if (task.kind === 'gate' || task.kind === 'debug') {
    store.answer(lesson.id, task.id, { selected: task.kind === 'gate' ? task.diagnosis.targets : task.targets });
    expect(store.diagnose(lesson, task)).toBe(true);
  }
  if (task.kind === 'slots') store.answer(lesson.id, task.id, { placements: task.accept[0] });
  else if (task.kind === 'gate') store.answer(lesson.id, task.id, { choice: task.answer });
  else if (task.kind === 'tether') store.answer(lesson.id, task.id, { links: task.links });
  else if (task.kind === 'mutate') store.answer(lesson.id, task.id, { variant: task.target, order: task.variants.find((variant) => variant.id === task.target)!.order });
  else store.answer(lesson.id, task.id, { text: task.repairs[0] });
  expect(store.check(lesson, task)).toBe(true);
}

function solveLesson() {
  useSentences.getState().start(lesson);
  [...lesson.arena, ...lesson.debugger].forEach(solve);
}

describe('Zinnen: hervatten en eerlijke oefenvoortgang', () => {
  it('bewaart sectie, oefenpositie en ontdekte varianten zonder oefenwerk te wissen', () => {
    const store = useSentences.getState();
    store.start(lesson);
    store.setTab(lesson.id, 'arena');
    store.setExerciseIndex(lesson.id, 'arena', 2);
    store.setExerciseIndex(lesson.id, 'debugger', 1);
    store.visitVariant(lesson.id, 'plain');
    store.visitVariant(lesson.id, 'plain');
    store.visitVariant(lesson.id, 'unknown');
    solve(gate);
    const before = useSentences.getState();
    store.start(lesson);
    expect(useSentences.getState()).toBe(before);
    expect(before.sessions[lesson.id]).toMatchObject({ tab: 'arena', arenaIndex: 2, debuggerIndex: 1, visitedVariants: ['plain'] });
    store.setExerciseIndex(lesson.id, 'arena', 6);
    store.setExerciseIndex(lesson.id, 'debugger', -1);
    expect(useSentences.getState()).toBe(before);
  });

  it('houdt keuzes en vrije reparaties achter de echte diagnosestap', () => {
    const store = useSentences.getState();
    store.start(lesson);
    store.answer(lesson.id, gate.id, { selected: ['v'], diagnosisPassed: true, choice: 'yes', checked: true, correct: true });
    expect(useSentences.getState().sessions[lesson.id]?.answers.gate).toMatchObject({ selected: ['v'], diagnosisPassed: false, choice: '', checked: false, correct: false });
    expect(store.check(lesson, gate)).toBe(false);
    expect(useSentences.getState().sessions[lesson.id]?.firstTry).toEqual({});
    expect(store.diagnose(lesson, gate)).toBe(true);
    store.answer(lesson.id, gate.id, { choice: 'yes' });
    expect(store.check(lesson, gate)).toBe(true);
    const task = lesson.debugger[0]!;
    store.answer(lesson.id, task.id, { text: task.repairs[0], diagnosisPassed: true });
    expect(useSentences.getState().sessions[lesson.id]?.answers[task.id]).toBeUndefined();
    expect(store.check(lesson, task)).toBe(false);
  });

  it('maakt halfsteun niet controleerbaar voordat segmentatie werkelijk is afgerond', () => {
    const store = useSentences.getState();
    store.start(lesson);
    const task = lesson.arena[5]!;
    if (task.kind !== 'slots') throw new Error('Expected slots fixture');
    store.answer(lesson.id, task.id, { placements: task.accept[0], boundaries: [1], segmentationPassed: true });
    expect(store.check(lesson, task)).toBe(false);
    expect(useSentences.getState().sessions[lesson.id]?.firstTry).toEqual({});
    expect(store.segment(lesson, task)).toBe(true);
    expect(store.check(lesson, task)).toBe(true);
    store.answer(lesson.id, task.id, { boundaries: [] });
    expect(useSentences.getState().sessions[lesson.id]?.answers.half).toMatchObject({ segmentationPassed: false, checked: false, correct: false });
    expect(store.segment(lesson, task)).toBe(false);
    expect(store.check(lesson, task)).toBe(false);
  });

  it('bewaart een eerste fout onafhankelijk van een geslaagde herkansing', () => {
    const store = useSentences.getState();
    store.start(lesson);
    store.answer(lesson.id, gate.id, { selected: ['v'] });
    store.diagnose(lesson, gate);
    store.answer(lesson.id, gate.id, { choice: 'no' });
    expect(store.check(lesson, gate)).toBe(false);
    expect(useSentences.getState().sessions[lesson.id]?.firstTry.gate).toBe(0);
    store.answer(lesson.id, gate.id, { choice: 'yes', correct: true });
    expect(useSentences.getState().sessions[lesson.id]?.answers.gate).toMatchObject({ checked: false, correct: false });
    expect(store.check(lesson, gate)).toBe(true);
    solveLesson();
    expect(store.complete(lesson)).toBe(true);
    expect(useSentences.getState().records[lesson.id]).toMatchObject({ attempts: 1, lastAccuracy: 90, bestAccuracy: 90 });
    expect(useSentences.getState().sessions[lesson.id]?.firstTry.gate).toBe(0);
  });

  it('vereist alle tien echte oplossingen en schrijft een afronding slechts één keer weg', () => {
    const store = useSentences.getState();
    store.start(lesson);
    expect(store.complete(lesson)).toBe(false);
    lesson.arena.forEach(solve);
    expect(store.complete(lesson)).toBe(false);
    lesson.debugger.slice(0, 3).forEach(solve);
    expect(store.complete(lesson)).toBe(false);
    solve(lesson.debugger[3]!);
    expect(store.complete(lesson)).toBe(true);
    expect(store.complete(lesson)).toBe(true);
    expect(useSentences.getState().records[lesson.id]?.attempts).toBe(1);
    expect(useSentences.getState().sessions[lesson.id]).toMatchObject({ finished: true, tab: 'codex' });
    const before = useSentences.getState();
    store.answer(lesson.id, gate.id, { choice: 'no' });
    expect(useSentences.getState()).toBe(before);
  });

  it('controleert herstelde vlaggen opnieuw en aanvaardt geen vervalste oefeninhoud', () => {
    const store = useSentences.getState();
    store.start(lesson);
    const data = pickSentenceData(useSentences.getState());
    store.replace({ ...data, sessions: { [lesson.id]: { ...data.sessions[lesson.id]!, finished: true, answers: { gate: { ...emptySentenceAnswer(), selected: ['s'], diagnosisPassed: true, choice: 'yes', checked: true, correct: true } } } } });
    store.start(lesson);
    expect(useSentences.getState().sessions[lesson.id]).toMatchObject({ finished: false, answers: { gate: { diagnosisPassed: false, checked: false, correct: false } } });
    expect(store.complete(lesson)).toBe(false);
    store.answer(lesson.id, gate.id, { selected: ['v'] });
    store.diagnose(lesson, gate);
    store.answer(lesson.id, gate.id, { choice: 'no' });
    expect(store.check(lesson, { ...gate, answer: 'no' })).toBe(false);
    expect(useSentences.getState().sessions[lesson.id]?.firstTry).toEqual({});
  });

  it('hervat lokale opslag met stabiele antwoorden en begint een gewijzigde les opnieuw', async () => {
    const store = useSentences.getState();
    store.start(lesson);
    solve(gate);
    store.setTab(lesson.id, 'debugger');
    store.setExerciseIndex(lesson.id, 'debugger', 2);
    const saved = window.localStorage.getItem(SENTENCES_KEY)!;
    useSentences.setState(EMPTY_SENTENCES);
    window.localStorage.setItem(SENTENCES_KEY, saved);
    await useSentences.persist.rehydrate();
    store.start(lesson);
    expect(useSentences.getState().sessions[lesson.id]).toMatchObject({ tab: 'debugger', debuggerIndex: 2, answers: { gate: { checked: true, correct: true } }, firstTry: { gate: 1 } });
    const revised = { ...lesson, title: 'Herziene les' };
    store.start(revised);
    expect(useSentences.getState().sessions[lesson.id]).toMatchObject({ signature: fingerprint(revised), tab: 'ontdek', answers: {}, firstTry: {}, finished: false });
  });

  it('laat herstarten oefenwerk wissen en eerdere oefenrecords behouden', () => {
    solveLesson();
    useSentences.getState().complete(lesson);
    useSentences.getState().restart(lesson);
    expect(useSentences.getState().sessions[lesson.id]).toMatchObject({ tab: 'ontdek', answers: {}, firstTry: {}, finished: false });
    expect(useSentences.getState().records[lesson.id]?.attempts).toBe(1);
    expect(SentenceDataSchema.safeParse(pickSentenceData(useSentences.getState())).success).toBe(true);
  });

  it('neemt zinnen mee in export/import/wissen en blijft compatibel met oude bestanden', () => {
    solveLesson();
    useSentences.getState().complete(lesson);
    useSentences.getState().setTransfer(lesson.id, 'Vandaag werk ik aan mijn eigen formulering.');
    const exported = exportData();
    const parsed = parseImport(exported);
    expect(parsed.ok).toBe(true);
    resetProgress();
    expect(useSentences.getState().records).toEqual({});
    if (!parsed.ok) throw new Error(parsed.error);
    applyImport(parsed.data);
    useSentences.getState().start(lesson);
    expect(useSentences.getState().records[lesson.id]?.lastAccuracy).toBe(100);
    expect(useSentences.getState().sessions[lesson.id]?.answers['debug-0']?.text).toBe('Zij werkt.');
    expect(useSentences.getState().sessions[lesson.id]?.transferText).toBe('Vandaag werk ik aan mijn eigen formulering.');
    const old = JSON.parse(exported) as Record<string, unknown>;
    delete old.sentences;
    const legacy = parseImport(JSON.stringify(old));
    expect(legacy.ok).toBe(true);
    if (legacy.ok) applyImport(legacy.data);
    expect(useSentences.getState().records).toEqual({});
    expect(useSentences.getState().sessions).toEqual({});
    const damaged = JSON.parse(exported) as { sentences: { sessions: Record<string, { answers: Record<string, { checked: unknown }> }> } };
    damaged.sentences.sessions[lesson.id]!.answers.gate!.checked = 'yes';
    expect(parseImport(JSON.stringify(damaged)).ok).toBe(false);
  });

  it('bewaart ongescoorde eigen zinnen ook na afronden en valideert oudere sessies zonder dit veld', async () => {
    solveLesson();
    useSentences.getState().complete(lesson);
    useSentences.getState().setTransfer(lesson.id, 'Ik oefen deze vorm in mijn eigen zin.');
    useSentences.getState().start(lesson);
    expect(useSentences.getState().sessions[lesson.id]?.transferText).toBe('Ik oefen deze vorm in mijn eigen zin.');
    expect(useSentences.getState().records[lesson.id]?.lastAccuracy).toBe(100);
    const before = useSentences.getState();
    useSentences.getState().setTransfer(lesson.id, 'x'.repeat(3001));
    expect(useSentences.getState()).toBe(before);
    const saved = window.localStorage.getItem(SENTENCES_KEY)!;
    useSentences.setState(EMPTY_SENTENCES);
    window.localStorage.setItem(SENTENCES_KEY, saved);
    await useSentences.persist.rehydrate();
    expect(useSentences.getState().sessions[lesson.id]?.transferText).toBe('Ik oefen deze vorm in mijn eigen zin.');
    const old = JSON.parse(saved) as { state: { sessions: Record<string, { transferText?: string }> } };
    delete old.state.sessions[lesson.id]!.transferText;
    expect(SentenceDataSchema.parse(old.state).sessions[lesson.id]?.transferText).toBe('');
  });
});
