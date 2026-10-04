// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { getLessonEntry } from '@/content/catalog';
import type { Step, StepOf } from '@/content/schema';
import { criteriaStatus, expectedAnswer, isComplete, isCorrect, isFormExercise } from './grade';
import { shuffledIndices } from './hash';
import { buildPlan } from './plan';
import { initialResponse, type Response } from './responses';

function stepFrom(lessonId: string, predicate: (step: Step) => boolean): Step {
  const plan = buildPlan(getLessonEntry(lessonId)!.lesson);
  const found = plan.find((item) => predicate(item.step));
  if (!found) throw new Error(`Geen stap in ${lessonId}`);
  return found.step;
}

const rewrite = (lessonId: string, source: string) =>
  stepFrom(lessonId, (s) => s.kind === 'rewrite' && s.source === source) as StepOf<'rewrite'>;

describe('lesplan', () => {
  it('haalt snelle checks uit de uitleg en zet ze direct erachter', () => {
    const plan = buildPlan(getLessonEntry('k1')!.lesson);
    expect(plan.map((item) => item.step.kind)).toEqual(['explain', 'choice', 'sort', 'choice', 'type', 'fix']);
    const explain = plan[0]!.step;
    expect(explain.kind === 'explain' && explain.panels.every((panel) => !panel.quiz)).toBe(true);
    expect(plan[1]!.step).toMatchObject({ kind: 'choice', prompt: 'Welke is goed gespeld?', answer: 'klein' });
  });

  it('geeft stabiele, unieke sleutels', () => {
    const lesson = getLessonEntry('w1')!.lesson;
    const a = buildPlan(lesson).map((item) => item.key);
    expect(buildPlan(lesson).map((item) => item.key)).toEqual(a);
    expect(new Set(a).size).toBe(a.length);
    expect(a[0]).toMatch(/^w1:s0#[a-z0-9]+$/);
  });

  it('schudt reproduceerbaar en nooit in de goede volgorde', () => {
    for (let n = 2; n < 9; n++) {
      const order = shuffledIndices(`sleutel-${n}`, n);
      expect(order).toEqual(shuffledIndices(`sleutel-${n}`, n));
      expect([...order].sort((x, y) => x - y)).toEqual(Array.from({ length: n }, (_, i) => i));
      expect(order.every((value, i) => value === i)).toBe(false);
    }
  });
});

describe('beoordeling', () => {
  it('meerkeuze en invullen', () => {
    const choice = stepFrom('k1', (s) => s.kind === 'choice' && s.answer === 'koud');
    expect(isCorrect(choice, { kind: 'choice', value: 'koud' })).toBe(true);
    expect(isCorrect(choice, { kind: 'choice', value: 'kout' })).toBe(false);
    expect(isComplete(choice, { kind: 'choice', value: null })).toBe(false);

    const type = stepFrom('g1', (s) => s.kind === 'type' && s.answer === 'lanen');
    expect(isCorrect(type, { kind: 'type', value: '  Lanen ' })).toBe(true);
    expect(isCorrect(type, { kind: 'type', value: 'laanen' })).toBe(false);
  });

  it('woorden ordenen en alinea ordenen', () => {
    const order = stepFrom('p1', (s) => s.kind === 'order') as StepOf<'order'>;
    const right = ['Mijn broer', 'heeft', 'de rode fiets', 'gekocht'].map((tile) => order.tiles.indexOf(tile));
    expect(isCorrect(order, { kind: 'order', placed: right })).toBe(true);
    expect(isCorrect(order, { kind: 'order', placed: [...right].reverse() })).toBe(false);
    expect(isComplete(order, { kind: 'order', placed: right.slice(0, 2) })).toBe(false);

    const paragraph = stepFrom('a1', (s) => s.kind === 'paragraph');
    expect(isCorrect(paragraph, { kind: 'paragraph', placed: [0, 1, 2, 3] })).toBe(true);
    expect(isCorrect(paragraph, { kind: 'paragraph', placed: [1, 0, 2, 3] })).toBe(false);
  });

  it('sorteren', () => {
    const sort = stepFrom('w1', (s) => s.kind === 'sort') as StepOf<'sort'>;
    const right: Response = { kind: 'sort', assign: sort.items.map((item) => item.b) };
    expect(isCorrect(sort, right)).toBe(true);
    expect(isCorrect(sort, { kind: 'sort', assign: sort.items.map((item) => 1 - item.b) })).toBe(false);
    expect(isComplete(sort, initialResponse(sort))).toBe(false);
  });

  it('fout verbeteren: juiste woord én juiste verbetering', () => {
    const fix = stepFrom('k1', (s) => s.kind === 'fix');
    expect(isCorrect(fix, { kind: 'fix', index: 1, value: 'Trein' })).toBe(true);
    expect(isCorrect(fix, { kind: 'fix', index: 0, value: 'trein' })).toBe(false);
    expect(isCorrect(fix, { kind: 'fix', index: 1, value: 'treijn' })).toBe(false);
    expect(expectedAnswer(fix)).toBe('treijn → trein');
  });

  it('herschrijven: inhoud los, vorm streng wanneer de opdracht over vorm gaat', () => {
    const content = rewrite('p2', 'Het uitzicht was heel erg mooi.');
    expect(isFormExercise(content)).toBe(false);
    expect(isCorrect(content, { kind: 'rewrite', value: 'het uitzicht was prachtig' })).toBe(true);

    const comma = rewrite('s2', 'Toen ik thuiskwam lag de kat op de bank.');
    expect(isFormExercise(comma)).toBe(true);
    expect(isCorrect(comma, { kind: 'rewrite', value: 'Toen ik thuiskwam, lag de kat op de bank.' })).toBe(true);
    expect(isCorrect(comma, { kind: 'rewrite', value: 'Toen ik thuiskwam lag de kat op de bank.' })).toBe(false);

    const capitals = rewrite('z3', 'ga je mee naar utrecht');
    expect(isCorrect(capitals, { kind: 'rewrite', value: 'Ga je mee naar Utrecht ?' })).toBe(true);
    expect(isCorrect(capitals, { kind: 'rewrite', value: 'ga je mee naar utrecht?' })).toBe(false);
  });

  it('vrij schrijven: woorden tellen en taakeisen afvinken', () => {
    const write = stepFrom('s2', (s) => s.kind === 'write') as StepOf<'write'>;
    const short = criteriaStatus(write, 'Hoewel ik moe was, ging ik.');
    expect(short.enoughWords).toBe(false);
    expect(short.criteria.every((criterion) => criterion.met)).toBe(true);
    const text =
      'Hoewel ik eigenlijk geen enkele zin had om te gaan hardlopen, trok ik toch mijn schoenen aan en liep ik een rondje door het park.';
    expect(isComplete(write, { kind: 'write', value: text })).toBe(true);
    expect(isComplete(write, { kind: 'write', value: text.replace(',', '') })).toBe(false);
  });

  it('uitleg is pas af als elk deel klaar is', () => {
    const explain = stepFrom('l1', (s) => s.kind === 'explain') as StepOf<'explain'>;
    const last = explain.panels.length - 1;
    const response: Response = { kind: 'explain', panel: last, reached: last, labs: {}, solved: [] };
    expect(isComplete(explain, response)).toBe(false);
    expect(isComplete(explain, { ...response, solved: [`${last}:mark`] })).toBe(true);
    expect(isComplete(explain, { ...response, panel: 0, solved: [`${last}:mark`] })).toBe(false);
  });
});
