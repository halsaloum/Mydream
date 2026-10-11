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

const SEEDS = Array.from({ length: 16 }, (_, i) => `sessie:${i}`);

/** De teksten in de volgorde waarin ze als knop op het scherm staan. */
function shownOrder(texts: readonly string[]) {
  return screen
    .getAllByRole('button')
    .map((button) => texts.find((text) => button.textContent?.includes(text)))
    .filter((text): text is string => text !== undefined);
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

describe('groep C: keuzes staan niet op een vaste plek', () => {
  test('AmbiguityStep schudt de zinsvarianten per keer en bewaart de plek in de inhoud', async () => {
    const user = userEvent.setup();
    const step = demoStep('twee-betekenissen', 'ambiguity');
    const texts = step.options.map((option) => option.t);
    const orders = new Set<string>();
    const firstFit = new Set<string>();
    for (const seed of SEEDS.slice(0, 8)) {
      const view = renderStep(AmbiguityStep, step, undefined, seed);
      const order = shownOrder(texts);
      expect([...order].sort()).toEqual([...texts].sort());
      orders.add(order.join('|'));
      firstFit.add(order.find((text) => step.options.find((option) => option.t === text)?.fits) ?? '');

      await user.click(screen.getByRole('button', { name: /Met de verrekijker zag ik de man/i }));
      await user.click(screen.getByRole('button', { name: /Ik zag de man die een verrekijker/i }));
      expect(view.state.response).toMatchObject({ solved: { A: 1, B: 2 }, mistakes: 0 });
      view.unmount();
    }
    expect(orders.size).toBeGreaterThan(2);
    // De eerste passende zin is niet steeds die van betekenis A.
    expect(firstFit.size).toBe(2);
  });

  test('AmbiguityStep houdt dezelfde volgorde bij dezelfde sleutel (verversen)', () => {
    const step = demoStep('twee-betekenissen', 'ambiguity');
    const texts = step.options.map((option) => option.t);
    const first = renderStep(AmbiguityStep, step, undefined, 'vast');
    const before = shownOrder(texts);
    first.unmount();
    renderStep(AmbiguityStep, step, undefined, 'vast');
    expect(shownOrder(texts)).toEqual(before);
  });

  test('ChatStep schudt de antwoorden per ronde en bewaart de keuze als plek in de inhoud', async () => {
    const user = userEvent.setup();
    const step = demoStep('chat-scenario', 'chat');
    const round = step.rounds[0]!;
    const rightAt = new Set<number>();
    for (const seed of SEEDS) {
      const view = renderStep(ChatStep, step, undefined, seed);
      const order = shownOrder(round.options);
      expect([...order].sort()).toEqual([...round.options].sort());
      rightAt.add(order.indexOf(round.options[round.right]!));

      await user.click(screen.getByRole('button', { name: round.options[round.right]! }));
      expect(view.state.response.picks).toEqual([round.right]);
      view.unmount();
    }
    expect(rightAt).toEqual(new Set([0, 1]));
  });

  test('ChatStep schudt elke ronde apart', () => {
    const step = demoStep('chat-scenario', 'chat');
    const shown = (picks: number[]) =>
      SEEDS.map((seed) => {
        const view = renderStep(ChatStep, step, { kind: 'chat', picks }, seed);
        const order = shownOrder(step.rounds[picks.length]!.options).map((text) => step.rounds[picks.length]!.options.indexOf(text));
        view.unmount();
        return order.join('');
      });
    // Met dezelfde sleutel kan ronde 2 anders staan dan ronde 1.
    const first = shown([]);
    const second = shown([0]);
    expect(first.some((order, i) => order !== second[i])).toBe(true);
  });

  test('IntentStep schudt de antwoorden per situatie', async () => {
    const user = userEvent.setup();
    const step = demoStep('zegt-en-bedoelt', 'intent');
    const round = step.rounds[0]!;
    const rightAt = new Set<number>();
    for (const seed of SEEDS) {
      const view = renderStep(IntentStep, step, undefined, seed);
      const order = shownOrder(round.replies);
      expect([...order].sort()).toEqual([...round.replies].sort());
      rightAt.add(order.indexOf(round.replies[round.right]!));

      await user.click(screen.getByRole('button', { name: round.replies[round.right]! }));
      expect(view.state.response).toMatchObject({ done: [0], mistakes: 0 });
      view.unmount();
    }
    expect(rightAt).toEqual(new Set([0, 1]));
  });

  test('ScaleStep schudt de argumenten; de schaal bewaart id’s', async () => {
    const user = userEvent.setup();
    const step = demoStep('weegschaal', 'scale');
    const texts = step.args.map((arg) => arg.t);
    const orders = new Set<string>();
    for (const seed of SEEDS.slice(0, 8)) {
      const view = renderStep(ScaleStep, step, undefined, seed);
      const order = shownOrder(texts);
      expect([...order].sort()).toEqual([...texts].sort());
      orders.add(order.join('|'));

      await user.click(screen.getByRole('button', { name: /feit · weegt 3/i }));
      await user.click(screen.getByRole('button', { name: /voorbeeld · weegt 2/i }));
      expect(view.state.response).toMatchObject({ on: ['feit', 'voorbeeld'], mistakes: 0 });
      view.unmount();
    }
    expect(orders.size).toBeGreaterThan(2);
  });

  test('ToneStep houdt de toonschaal op volgorde, ook met een andere sleutel', () => {
    const step = demoStep('toonregelaar', 'tone');
    const names = step.levels.map((level) => level.name);
    for (const seed of SEEDS.slice(0, 4)) {
      const view = renderStep(ToneStep, step, undefined, seed);
      expect(shownOrder(names)).toEqual(names);
      view.unmount();
    }
  });
});
