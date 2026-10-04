import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { getDemo } from '@/content/demo';
import type { StepKind, StepOf } from '@/content/schema';
import { BetStep } from './bet';
import { DictationStep } from './dictation';
import { ProofreadStep } from './proofread';
import { StackStep } from './stack';
import { renderStep } from '../test-utils';

function demo<K extends StepKind>(slug: string, kind: K): StepOf<K> {
  const step = getDemo(slug)?.step;
  expect(step?.kind).toBe(kind);
  return step as StepOf<K>;
}

describe('groep D extra oefenvormen', () => {
  it('bouwt de alinea-stapel en telt een verkeerde laag', async () => {
    const user = userEvent.setup();
    const step = demo('alinea-stapel', 'stack');
    const view = renderStep(StackStep, step);

    await user.click(screen.getByRole('button', { name: /Je beweegt elke dag/i }));
    expect(view.state.response.mistakes).toBe(1);
    expect(screen.getByText('Een kernzin zegt in één keer waar de alinea over gaat.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Fietsen naar je werk/i }));
    await user.click(screen.getByRole('button', { name: /Je beweegt elke dag/i }));
    await user.click(screen.getByRole('button', { name: /Zo ben ik/i }));
    await user.click(screen.getByRole('button', { name: /Daarom laat ik/i }));

    expect(view.state.locked).toBe(true);
    expect(view.state.response.placed).toBe(step.layers.length);
    expect(screen.getByRole('heading', { name: 'Zo leest je alinea' })).toBeInTheDocument();
  });

  it('vindt alle eindredactie-fouten en telt misgetikte woorden', async () => {
    const user = userEvent.setup();
    const step = demo('eindredactie', 'proofread');
    const view = renderStep(ProofreadStep, step);

    await user.click(screen.getByRole('button', { name: 'Gisteren' }));
    expect(view.state.response.slips).toBe(1);

    for (const word of ['gestuurt.', 'als', 'wilt', 'utrecht.', 'door geven?']) {
      await user.click(screen.getByRole('button', { name: word }));
    }

    expect(view.state.locked).toBe(true);
    expect(view.state.response.found).toEqual([8, 12, 17, 24, 30]);
    expect(screen.getByText('doorgeven?')).toBeInTheDocument();
  });

  it('controleert Durf je met antwoord en inzet', async () => {
    const user = userEvent.setup();
    const step = demo('durf-je', 'bet');
    const view = renderStep(BetStep, step);

    await user.click(screen.getByRole('radio', { name: /Ik blijf thuis, omdat ik ziek ben/i }));
    await user.click(screen.getByRole('radio', { name: /Heel zeker/i }));
    await user.click(screen.getByTestId('player-submit'));

    expect(view.state.locked).toBe(true);
    expect(view.state.correct).toBe(true);
    expect(view.state.response).toMatchObject({ value: step.answer, bet: 3 });
    expect(screen.getByText('Heel zeker en goed: dit beheers je. Deze vraag hoeft niet snel terug te komen.')).toBeInTheDocument();
  });

  it('dictee toont de zin zonder speech en controleert met Enter via toetsenbord', async () => {
    const user = userEvent.setup();
    const step = demo('dictee', 'dictation');
    const view = renderStep(DictationStep, step);

    await user.click(screen.getByRole('button', { name: 'Speel de zin af' }));
    expect(view.state.response.plays).toBe(1);
    expect(view.state.response.shown).toBe(true);

    await user.click(screen.getByLabelText('Jouw zin'));
    await user.keyboard('Mijn vrouw draagt een blauwe jas.{Enter}');

    expect(view.state.locked).toBe(true);
    expect(view.state.correct).toBe(true);
    expect(screen.getByRole('status', { name: 'Dictee nagekeken' })).toBeInTheDocument();
  });
});
