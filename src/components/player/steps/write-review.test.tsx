import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { StepOf } from '@/content/schema';
import { isComplete } from '@/engine/grade';
import { isScored } from '@/engine/kinds';
import { ResponseSchema, responseFits } from '@/engine/responses';
import { renderStep } from './test-utils';
import { WriteStep } from './text-steps';

const step: StepOf<'write'> = {
  kind: 'write', prompt: 'Onderbouw je voorstel.', intro: 'Gebruik een reden en een beperking.',
  minWords: 3, must: [], why: 'Je hebt je eigen tekst nagekeken.',
  rubric: { criteria: ['Mijn reden ondersteunt mijn standpunt.', 'Ik benoem een beperking.'], example: 'Een proef kan helpen, mits we het resultaat meten.' },
};

describe('schrijven met inhoudelijke zelfcontrole', () => {
  it('vereist een eigen tekst en vergelijking, en reset de controle na een wijziging', () => {
    const { state } = renderStep(WriteStep, step);
    expect(screen.getByRole('button', { name: 'Vergelijk met een voorbeeld' })).toBeDisabled();
    fireEvent.change(screen.getByRole('textbox', { name: 'Jouw tekst' }), { target: { value: 'Laten we beginnen met een proef.' } });
    expect(isComplete(step, state.response)).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'Vergelijk met een voorbeeld' }));
    expect(screen.getByText(step.rubric!.example)).toBeVisible();
    for (const checkbox of screen.getAllByRole('checkbox')) fireEvent.click(checkbox);
    expect(isComplete(step, state.response)).toBe(true);
    const saved = ResponseSchema.parse(JSON.parse(JSON.stringify(state.response)));
    expect(responseFits(step, saved)).toBe(true);
    expect(isComplete(step, saved)).toBe(true);
    fireEvent.change(screen.getByRole('textbox', { name: 'Jouw tekst' }), { target: { value: 'Laten we een meetbare proef beginnen.' } });
    expect(isComplete(step, state.response)).toBe(false);
    expect(screen.getAllByRole('checkbox').every((checkbox) => !(checkbox as HTMLInputElement).checked)).toBe(true);
    expect(screen.getByText(step.rubric!.example)).toBeVisible();
  });

  it('rekent eigen beoordeling niet als objectieve score en accepteert oudere schrijfreacties', () => {
    expect(isScored(step)).toBe(false);
    const old = ResponseSchema.parse({ kind: 'write', value: 'Mijn eerste eigen tekst.' });
    expect(responseFits(step, old)).toBe(true);
    expect(isComplete(step, old)).toBe(false);
    expect(isComplete({ ...step, rubric: undefined }, old)).toBe(true);
    expect(responseFits(step, { kind: 'write', value: '', selfChecks: [true] })).toBe(false);
  });
});
