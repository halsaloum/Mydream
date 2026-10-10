import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { getDemo } from '@/content/demo';
import type { StepKind, StepOf } from '@/content/schema';
import { AmbiguityStep } from './ambiguity';
import { ChatStep } from './chat';
import { IntentStep } from './intent';
import { ScaleStep } from './scale';
import { ToneStep } from './tone';
import { renderStep } from '../test-utils';

afterEach(() => {
  vi.useRealTimers();
});

function demoStep<K extends StepKind>(slug: string, kind: K): StepOf<K> {
  const step = getDemo(slug)!.step;
  if (step.kind !== kind) throw new Error(`Demo ${slug} is geen ${kind}`);
  return step as StepOf<K>;
}

describe('groep C extra oefenvormen', () => {
  test('AmbiguityStep telt een misser en koppelt beide betekenissen', async () => {
    const user = userEvent.setup();
    const step = demoStep('twee-betekenissen', 'ambiguity');
    const view = renderStep(AmbiguityStep, step);

    await user.click(screen.getByRole('button', { name: /Gisteren zag ik de man/i }));
    expect(view.state.response.mistakes).toBe(1);
    expect(screen.getByText(/nog steeds twee dingen betekenen/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Met de verrekijker zag ik de man/i }));
    await user.click(screen.getByRole('button', { name: /Ik zag de man die een verrekijker/i }));

    expect(view.state.locked).toBe(true);
    expect(view.state.response.solved).toEqual({ A: 1, B: 2 });
  });

  test('ChatStep bewaart picks, corrigeert fout verstuurd bericht en rondt na drie picks af', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const step = demoStep('chat-scenario', 'chat');
    const view = renderStep(ChatStep, step);

    await user.click(screen.getByRole('button', { name: /Ja, dat ken ik wel regelen/i }));
    expect(screen.getByText(/verbeterd voor het versturen: ken → kan/i)).toBeInTheDocument();
    expect(screen.getByText(/Anouk typt/i)).toBeInTheDocument();
    await act(async () => vi.advanceTimersByTime(1200));

    await user.click(screen.getByRole('button', { name: /Ligt jouw oplader/i }));
    await act(async () => vi.advanceTimersByTime(1200));
    await user.click(screen.getByRole('button', { name: /sneller dan de bus/i }));

    expect(view.state.locked).toBe(true);
    expect(view.state.response.picks).toEqual([1, 1, 0]);
    expect(screen.getByText('Top. Tot morgen!')).toBeInTheDocument();
  });

  test('ToneStep kan met toetsenbord een passende toon versturen', async () => {
    const user = userEvent.setup();
    const step = demoStep('toonregelaar', 'tone');
    const view = renderStep(ToneStep, step);

    await user.click(screen.getByRole('button', { name: 'Verstuur' }));
    expect(screen.getByText(/Nog te los/i)).toBeInTheDocument();

    screen.getByRole('button', { name: 'netjes' }).focus();
    await user.keyboard('{Enter}');
    await user.click(screen.getByRole('button', { name: 'Verstuur' }));

    expect(view.state.locked).toBe(true);
    expect(view.state.response.sent).toEqual([1, 2]);
  });

  test('IntentStep houdt fouten bij en gaat ronde voor ronde verder', async () => {
    const user = userEvent.setup();
    const step = demoStep('zegt-en-bedoelt', 'intent');
    const view = renderStep(IntentStep, step);

    await user.click(screen.getByRole('button', { name: 'Ja.' }));
    expect(view.state.response.mistakes).toBe(1);
    await user.click(screen.getByRole('button', { name: /Alsjeblieft/i }));
    await user.click(screen.getByRole('button', { name: /Volgende/i }));
    await user.click(screen.getByRole('button', { name: /raam dichtdoen/i }));
    await user.click(screen.getByRole('button', { name: /Volgende/i }));
    await user.click(screen.getByRole('button', { name: /Om twee uur/i }));

    expect(view.state.locked).toBe(true);
    expect(view.state.response.done).toEqual([0, 1, 2]);
  });

  test('ScaleStep respecteert max, telt zwakke argumenten als fout en voltooit met feit plus voorbeeld', async () => {
    const user = userEvent.setup();
    const step = demoStep('weegschaal', 'scale');
    const view = renderStep(ScaleStep, step);

    await user.click(screen.getByRole('button', { name: /mening · weegt 1/i }));
    expect(view.state.response.mistakes).toBe(1);
    await user.click(screen.getByRole('button', { name: /feit · weegt 3/i }));
    await user.click(screen.getByRole('button', { name: /voorbeeld · weegt 2/i }));
    expect(view.state.response.mistakes).toBe(2);

    await user.click(screen.getByRole('button', { name: /mening · weegt 1/i }));
    await user.click(screen.getByRole('button', { name: /voorbeeld · weegt 2/i }));

    expect(view.state.locked).toBe(true);
    expect(view.state.response.on).toEqual(['feit', 'voorbeeld']);
  });
});
