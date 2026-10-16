import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { getDemo } from '@/content/demo';
import type { StepKind, StepOf } from '@/content/schema';
import type { ResponseOf } from '@/engine/responses';
import { renderStep } from '../test-utils';
import { DilemmaStep } from './dilemma';
import { StrawmanStep } from './strawman';

vi.mock('@/lib/sound', () => ({ play: vi.fn() }));

function demo<K extends StepKind>(slug: string, kind: K): StepOf<K> {
  const step = getDemo(slug)!.step;
  if (step.kind !== kind) throw new Error(`Wrong demo kind: ${slug}`);
  return step as StepOf<K>;
}

const strawman = demo('stroman', 'strawman');
const dilemma = demo('vals-dilemma', 'dilemma');

describe('StrawmanStep', () => {
  test('explains an incorrect chunk, finds both distortions with click and keyboard, and repairs a wrong final choice', async () => {
    const user = userEvent.setup();
    const view = renderStep(StrawmanStep, strawman);
    expect(screen.queryByRole('region', { name: 'Een eerlijke reactie kiezen' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Mila vindt ons weekoverleg dus' }));
    expect(view.state.response.mistakes).toBe(1);
    expect(await screen.findByText('Dit klopt nog: het gaat over Mila en over het weekoverleg.')).toBeInTheDocument();
    expect(view.state.response.found).toEqual([]);

    screen.getByRole('button', { name: 'zonde van de tijd.' }).focus();
    await user.keyboard('{Enter}');
    expect(view.state.response.found).toEqual(['korter']);
    expect(screen.getByText('Mila schreef: korter')).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Een eerlijke reactie kiezen' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'spreken we elkaar helemaal niet meer.' }));
    expect(view.state.response.found).toEqual(['korter', 'half-uur']);

    const choices = screen.getByRole('region', { name: 'Een eerlijke reactie kiezen' });
    await user.click(within(choices).getByRole('button', { name: strawman.options[0]!.t }));
    expect(view.state.response.mistakes).toBe(2);
    expect(view.state.response.tried).toEqual([0]);
    expect(view.state.locked).toBe(false);
    expect(within(choices).getByRole('button', { name: /Mila heeft gewoon een hekel/ })).toBeDisabled();
    expect(within(choices).getByText(strawman.options[0]!.why)).toBeInTheDocument();

    await user.click(within(choices).getByRole('button', { name: strawman.options[1]!.t }));
    expect(view.state.response.fair).toBe(true);
    expect(view.state.locked).toBe(true);
    expect(screen.getByRole('region', { name: 'Eerlijk hersteld' })).toHaveTextContent('Dat lijkt mij te krap');
    expect(screen.getByRole('heading', { name: 'Geen stroman meer' })).toBeInTheDocument();
    expect(within(choices).getAllByRole('button').every((button) => (button as HTMLButtonElement).disabled)).toBe(true);
  });

  test('reconstructs the found chunks and rejected answer from the saved response', async () => {
    const user = userEvent.setup();
    const saved: ResponseOf<'strawman'> = { kind: 'strawman', found: ['korter', 'half-uur'], tried: [2], fair: false, mistakes: 1 };
    const view = renderStep(StrawmanStep, strawman, saved);
    expect(screen.getByRole('button', { name: 'zonde van de tijd.' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Mila schreef: een half uur')).toBeInTheDocument();
    const choices = screen.getByRole('region', { name: 'Een eerlijke reactie kiezen' });
    expect(within(choices).getByRole('button', { name: /Mila wil minder overleggen/ })).toBeDisabled();
    expect(within(choices).getByText(strawman.options[2]!.why)).toBeInTheDocument();
    within(choices).getByRole('button', { name: strawman.options[1]!.t }).focus();
    await user.keyboard(' ');
    expect(view.state.response).toMatchObject({ found: saved.found, tried: [2], fair: true, mistakes: 1 });
    expect(view.state.locked).toBe(true);
  });

  test('respects an externally locked step before the correction is complete', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StrawmanStep step={strawman} response={{ kind: 'strawman', found: [], tried: [], fair: false, mistakes: 0 }} onChange={onChange} locked correct={false} stepKey="locked" seed="locked" onSubmit={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'zonde van de tijd.' }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getAllByRole('button').every((button) => (button as HTMLButtonElement).disabled)).toBe(true);
  });
});

describe('DilemmaStep', () => {
  test('rejects repeated horns, adds alternatives by click and keyboard, and repairs the final argument', async () => {
    const user = userEvent.setup();
    const view = renderStep(DilemmaStep, dilemma);
    expect(screen.queryByRole('region', { name: 'Een eerlijke afweging kiezen' })).not.toBeInTheDocument();
    const candidates = screen.getByRole('region', { name: 'Ontbrekende mogelijkheden kiezen' });

    await user.click(within(candidates).getByRole('button', { name: dilemma.candidates[1]!.t }));
    expect(view.state.response.tried).toEqual([1]);
    expect(view.state.response.mistakes).toBe(1);
    expect(view.state.response.added).toEqual([]);
    expect(within(candidates).getByText(dilemma.candidates[1]!.why)).toBeInTheDocument();
    expect(within(candidates).getByRole('button', { name: /Een nog grotere parkeergarage/ })).toBeDisabled();

    within(candidates).getByRole('button', { name: dilemma.candidates[0]!.t }).focus();
    await user.keyboard('{Enter}');
    expect(view.state.response.added).toEqual([0]);
    expect(within(screen.getByRole('region', { name: 'De mogelijkheden' })).getByText('pendelbus')).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Een eerlijke afweging kiezen' })).not.toBeInTheDocument();
    await user.click(within(candidates).getByRole('button', { name: dilemma.candidates[2]!.t }));
    expect(view.state.response.added).toEqual([0, 2]);

    const choices = screen.getByRole('region', { name: 'Een eerlijke afweging kiezen' });
    await user.click(within(choices).getByRole('button', { name: dilemma.options[0]!.t }));
    expect(view.state.response.triedOptions).toEqual([0]);
    expect(view.state.response.mistakes).toBe(2);
    expect(view.state.locked).toBe(false);
    expect(within(choices).getByText(dilemma.options[0]!.why)).toBeInTheDocument();
    await user.click(within(choices).getByRole('button', { name: dilemma.options[1]!.t }));
    expect(view.state.response.honest).toBe(true);
    expect(view.state.locked).toBe(true);
    expect(screen.getByRole('heading', { name: 'Meer dan twee wegen' })).toBeInTheDocument();
    expect(within(choices).getAllByRole('button').every((button) => (button as HTMLButtonElement).disabled)).toBe(true);
  });

  test('resumes from saved alternatives and failed guesses without resetting mistakes', async () => {
    const user = userEvent.setup();
    const saved: ResponseOf<'dilemma'> = { kind: 'dilemma', added: [2, 0], tried: [3], triedOptions: [2], honest: false, mistakes: 2 };
    const view = renderStep(DilemmaStep, dilemma, saved);
    const signs = screen.getByRole('region', { name: 'De mogelijkheden' });
    expect(within(signs).getByText('pendelbus')).toBeInTheDocument();
    expect(within(signs).getByText('fietsenstallingen')).toBeInTheDocument();
    const choices = screen.getByRole('region', { name: 'Een eerlijke afweging kiezen' });
    expect(within(choices).getByRole('button', { name: /Wie tegen de garage is/ })).toBeDisabled();
    expect(within(choices).getByText(dilemma.options[2]!.why)).toBeInTheDocument();
    within(choices).getByRole('button', { name: dilemma.options[1]!.t }).focus();
    await user.keyboard(' ');
    expect(view.state.response).toMatchObject({ added: [2, 0], tried: [3], triedOptions: [2], honest: true, mistakes: 2 });
    expect(view.state.locked).toBe(true);
  });

  test('respects an externally locked step even when the alternative stage is incomplete', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DilemmaStep step={dilemma} response={{ kind: 'dilemma', added: [], tried: [], triedOptions: [], honest: false, mistakes: 0 }} onChange={onChange} locked correct={false} stepKey="locked" seed="locked" onSubmit={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: dilemma.candidates[0]!.t }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getAllByRole('button').every((button) => (button as HTMLButtonElement).disabled)).toBe(true);
  });
});

test('choice order is repeatable for a saved seed and varies between sessions', () => {
  const orders = new Set<string>();
  for (const seed of ['first', 'second', 'third', 'fourth']) {
    const first = renderStep(DilemmaStep, dilemma, undefined, seed);
    const region = screen.getByRole('region', { name: 'Ontbrekende mogelijkheden kiezen' });
    const order = within(region).getAllByRole('button').map((button) => button.textContent).join('|');
    orders.add(order);
    first.unmount();
    const repeated = renderStep(DilemmaStep, dilemma, undefined, seed);
    expect(within(screen.getByRole('region', { name: 'Ontbrekende mogelijkheden kiezen' })).getAllByRole('button').map((button) => button.textContent).join('|')).toBe(order);
    repeated.unmount();
  }
  expect(orders.size).toBeGreaterThan(1);
});
