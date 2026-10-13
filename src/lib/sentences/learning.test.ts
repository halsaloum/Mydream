import { describe, expect, it } from 'vitest';
import type { DebugExercise, GateExercise, MutatorExercise, SentenceExercise, SentenceLesson, SlotExercise, TetherExercise } from '@/content/sentences/types';
import { answerReady, diagnosisCorrect, emptySentenceAnswer, gradeSentence, lessonAccuracy, lessonProgress, lessonSolved, normalizeRepair, sanitizeSentenceAnswer, segmentationCorrect } from './learning';

const base = { support: 'zelfstandig' as const, ruleId: 'rule', prompt: 'Controleer de zin.', hint: 'Bekijk de vorm.', explanation: 'Dit volgt uit de vorm.' };
const slots: SlotExercise = {
  ...base, id: 'slots', kind: 'slots', blocks: [{ id: 's', text: 'De leerling' }, { id: 'v', text: 'werkt' }, { id: 'a', text: 'vandaag' }],
  slots: [{ id: 'front', label: 'Voorveld', capacity: 1 }, { id: 'middle', label: 'Midden' }],
  initial: { front: [], middle: ['s', 'a', 'v'] }, accept: [{ front: ['s'], middle: ['v', 'a'] }, { front: ['a'], middle: ['v', 's'] }],
};
const gate: GateExercise = {
  ...base, id: 'gate', kind: 'gate', diagnosis: { prompt: 'Kies de persoonsvorm.', tokens: [{ id: 's', text: 'zij' }, { id: 'v', text: 'werkt' }], targets: ['v'], feedback: 'Verander de tijd.' },
  options: [{ id: 'yes', text: 'De zin klopt.', feedback: 'Het onderwerp past.' }, { id: 'no', text: 'De zin klopt niet.', feedback: 'Controleer nogmaals.' }], answer: 'yes',
};
const tether: TetherExercise = { ...base, id: 'tether', kind: 'tether', tokens: [{ id: 'a', text: 'het' }, { id: 'b', text: 'boek' }, { id: 'c', text: 'ligt' }], links: [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }] };
const mutate: MutatorExercise = {
  ...base, id: 'mutate', kind: 'mutate', original: 'Zij leest.', target: 'time',
  variants: [
    { id: 'time', label: 'Tijd vooraan', blocks: [{ id: 'a', text: 'Vandaag' }, { id: 'v', text: 'leest' }, { id: 's', text: 'zij' }], order: ['a', 'v', 's'], note: 'De persoonsvorm blijft tweede.' },
    { id: 'plain', label: 'Onderwerp vooraan', blocks: [{ id: 's', text: 'Zij' }, { id: 'v', text: 'leest' }], order: ['s', 'v'], note: 'Neutrale volgorde.' },
  ],
};
const debug: DebugExercise = { ...base, id: 'debug', kind: 'debug', tokens: [{ id: 's', text: 'zij' }, { id: 'v', text: 'werk' }], targets: ['v'], instruction: 'Herstel de persoonsvorm.', repairs: ['Zij werkt, omdat zij tijd heeft.'] };

const withAnswer = (patch: Partial<ReturnType<typeof emptySentenceAnswer>>) => ({ ...emptySentenceAnswer(), ...patch });

describe('Zinnen: bewijs vóór oefenfeedback', () => {
  it('controleert de volledige volgorde binnen ieder vak en accepteert twee geldige varianten', () => {
    expect(gradeSentence(slots, withAnswer({ placements: { front: ['s'], middle: ['v', 'a'] } }))).toBe(true);
    expect(gradeSentence(slots, withAnswer({ placements: { front: ['a'], middle: ['v', 's'] } }))).toBe(true);
    expect(gradeSentence(slots, withAnswer({ placements: { front: ['s'], middle: ['a', 'v'] } }))).toBe(false);
  });

  it('weigert ontbrekende, dubbele, onbekende of te veel blokken in een vak', () => {
    const invalidPlacements: Record<string, string[]>[] = [{ front: ['s'], middle: ['v'] }, { front: ['s'], middle: ['v', 'a', 'a'] }, { front: ['s'], middle: ['v', 'a'], hidden: ['x'] }, { front: ['s', 'v'], middle: ['a'] }];
    for (const placements of invalidPlacements) {
      expect(answerReady(slots, withAnswer({ placements }))).toBe(false);
    }
    expect(gradeSentence(slots, emptySentenceAnswer())).toBe(false);
  });

  it('vereist bij halfsteun de echte zinsdeelgrenzen en een afgeronde segmentatiestap', () => {
    const half: SlotExercise = { ...slots, support: 'half', segmentation: { prompt: 'Knip de zin.', tokens: [{ id: 's', text: 'zij' }, { id: 'v', text: 'werkt' }, { id: 'a', text: 'vandaag' }], boundaries: [1, 2], feedback: 'Elke groep blijft bijeen.' } };
    const answer = withAnswer({ placements: half.accept[0], boundaries: [2, 1] });
    expect(segmentationCorrect(half, answer)).toBe(true);
    expect(gradeSentence(half, answer)).toBe(false);
    expect(gradeSentence(half, { ...answer, segmentationPassed: true })).toBe(true);
    expect(gradeSentence(half, { ...answer, boundaries: [1, 1], segmentationPassed: true })).toBe(false);
    expect(gradeSentence({ ...half, segmentation: undefined }, { ...answer, segmentationPassed: true })).toBe(false);
  });

  it('laat een keuze of correct opgeslagen vlaggetje nooit de verplichte diagnose vervangen', () => {
    expect(gradeSentence(gate, withAnswer({ choice: 'yes', diagnosisPassed: true }))).toBe(false);
    expect(gradeSentence(gate, withAnswer({ choice: 'yes', selected: ['v'] }))).toBe(false);
    expect(gradeSentence(gate, withAnswer({ choice: 'yes', selected: ['v'], diagnosisPassed: true }))).toBe(true);
    expect(diagnosisCorrect(gate, withAnswer({ selected: ['v', 'v'] }))).toBe(false);
    expect(diagnosisCorrect(gate, withAnswer({ selected: ['s', 'v'] }))).toBe(false);
  });

  it('vereist alle verbindingen in de juiste richting, zonder extra of dubbele lijnen', () => {
    expect(gradeSentence(tether, withAnswer({ links: [...tether.links].reverse() }))).toBe(true);
    expect(gradeSentence(tether, withAnswer({ links: tether.links.slice(0, 1) }))).toBe(false);
    expect(gradeSentence(tether, withAnswer({ links: [...tether.links, tether.links[0]!] }))).toBe(false);
    expect(gradeSentence(tether, withAnswer({ links: [{ from: 'b', to: 'a' }, tether.links[1]!] }))).toBe(false);
    expect(gradeSentence(tether, withAnswer({ links: [...tether.links, { from: 'a', to: 'c' }] }))).toBe(false);
  });

  it('vereist zowel de gevraagde transformatie als haar volledige blokvolgorde', () => {
    expect(gradeSentence(mutate, withAnswer({ variant: 'time', order: ['a', 'v', 's'] }))).toBe(true);
    expect(gradeSentence(mutate, withAnswer({ variant: 'plain', order: ['s', 'v'] }))).toBe(false);
    expect(gradeSentence(mutate, withAnswer({ variant: 'time', order: ['a', 's', 'v'] }))).toBe(false);
    expect(gradeSentence(mutate, withAnswer({ variant: 'time', order: ['a', 'v', 's', 's'] }))).toBe(false);
  });

  it('normaliseert alleen hoofdletters, witruimte en de laatste punt in constrained herstel', () => {
    const answer = withAnswer({ selected: ['v'], diagnosisPassed: true, text: '  ZIJ   werkt,\n omdat zij tijd heeft  ' });
    expect(gradeSentence(debug, answer)).toBe(true);
    expect(gradeSentence(debug, { ...answer, text: 'Zij werkt omdat zij tijd heeft.' })).toBe(false);
    expect(gradeSentence(debug, { ...answer, text: 'Zij werkt, omdat zij tijd heeft!' })).toBe(false);
    expect(gradeSentence(debug, { ...answer, selected: ['s'] })).toBe(false);
    expect(normalizeRepair('Een onafgemaakte zin...')).toBe('een onafgemaakte zin...');
  });

  it('herberekent hervatte controles en trekt ongeldige fasevlaggen in', () => {
    const forged = withAnswer({ selected: ['s'], diagnosisPassed: true, checked: true, correct: true, choice: 'yes' });
    expect(sanitizeSentenceAnswer(gate, forged)).toMatchObject({ diagnosisPassed: false, checked: false, correct: false });
    const mistaken = withAnswer({ selected: ['v'], diagnosisPassed: true, checked: true, correct: true, choice: 'no' });
    expect(sanitizeSentenceAnswer(gate, mistaken)).toMatchObject({ diagnosisPassed: true, checked: true, correct: false });
  });

  it('telt alleen gecontroleerd en werkelijk opgelost werk voor volledige afronding', () => {
    const arena = Array.from({ length: 6 }, (_, index): SentenceExercise => ({ ...slots, id: `arena-${index}` }));
    const debuggerTasks = Array.from({ length: 4 }, (_, index) => ({ ...debug, id: `debug-${index}` }));
    const lesson = { arena, debugger: debuggerTasks } as SentenceLesson;
    const answers = Object.fromEntries([...arena.map((task) => [task.id, withAnswer({ placements: slots.accept[0], checked: true, correct: false })]), ...debuggerTasks.map((task) => [task.id, withAnswer({ selected: ['v'], diagnosisPassed: true, text: debug.repairs[0], checked: true, correct: false })])]);
    expect(lessonSolved(lesson, answers)).toBe(true);
    expect(lessonProgress(lesson, answers)).toEqual({ solved: 10, total: 10 });
    expect(lessonSolved({ ...lesson, arena: arena.slice(0, 5) }, answers)).toBe(false);
    expect(lessonSolved(lesson, { ...answers, 'arena-0': { ...answers['arena-0']!, checked: false, correct: true } })).toBe(false);
    expect(lessonAccuracy(lesson, { 'arena-0': 1, 'debug-0': 1, unrelated: 1 })).toBe(20);
  });
});
