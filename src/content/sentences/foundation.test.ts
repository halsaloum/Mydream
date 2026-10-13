import { describe, expect, it } from 'vitest';
import { foundationLessons } from './foundation';
import type { SentenceExercise, SentenceLesson } from './types';

function required<T>(value: T | undefined, label: string): T {
  if (value === undefined) throw new Error(`Missing fixture: ${label}`);
  return value;
}

function lesson(number: number): SentenceLesson {
  const result = foundationLessons.find((item) => item.number === number);
  if (!result) throw new Error(`Missing foundation lesson ${number}`);
  return result;
}

function exercise(number: number, index: number): SentenceExercise {
  return required(lesson(number).arena[index - 1], `lesson ${number} exercise ${index}`);
}

describe('Dutch grammar in the sentence foundations', () => {
  it('selects the full noun-phrase subject without accidentally including its finite verb', () => {
    const item = exercise(1, 2);
    if (item.kind !== 'gate') throw new Error('Expected a diagnosis gate');
    expect(item.diagnosis.tokens.filter((token) => item.diagnosis.targets.includes(token.id)).map((token) => token.text).join(' '))
      .toBe('De twee cursisten bij het raam');
    expect(item.options.find((option) => option.id === item.answer)?.text).toBe('Zij lezen een tekst.');
  });

  it('links the singular subject head across a plural prepositional modifier', () => {
    const item = exercise(2, 3);
    if (item.kind !== 'tether') throw new Error('Expected an agreement bridge');
    const link = required(item.links[0], 'subject agreement link');
    expect(item.tokens.find((token) => token.id === link.from)?.text).toBe('team');
    expect(item.tokens.find((token) => token.id === link.to)?.text).toBe('werkt');
    expect(item.links).not.toContainEqual({ from: 'w4', to: 'w5' });
  });

  it('retains grammatical agreement variation for een aantal without extending it to het aantal', () => {
    const item = exercise(2, 6);
    if (item.kind !== 'gate') throw new Error('Expected an agreement gate');
    expect(item.answer).toBe('beide');
    expect(lesson(2).debugger.find((entry) => entry.prompt === 'Het aantal bezoekers nemen toe.')?.repairs)
      .toEqual(['Het aantal bezoekers neemt toe.']);
  });

  it('attaches a result property to the affected object instead of the painter', () => {
    const item = exercise(3, 3);
    if (item.kind !== 'tether') throw new Error('Expected a property bridge');
    const link = required(item.links[0], 'result property link');
    expect(item.tokens.find((token) => token.id === link.from)?.text).toBe('deur');
    expect(item.tokens.find((token) => token.id === link.to)?.text).toBe('groen.');
  });

  it('distinguishes an object-like measure and a rare complement of kwijt zijn', () => {
    const measure = exercise(4, 5);
    const lost = exercise(4, 6);
    if (measure.kind !== 'gate' || lost.kind !== 'gate') throw new Error('Expected analysis gates');
    expect(measure.answer).toBe('maat');
    expect(lost.answer).toBe('oorzakelijk');
    expect(lost.diagnosis.tokens.filter((token) => lost.diagnosis.targets.includes(token.id)).map((token) => token.text))
      .toEqual(['ben', 'kwijt.']);
    expect(required(lesson(4).rules[2], 'object analysis rule').sourceIds).toContain('eans-oorzakelijkvoorwerp');
  });
});
