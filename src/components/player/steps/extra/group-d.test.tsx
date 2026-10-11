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

const SEEDS = Array.from({ length: 16 }, (_, i) => `sessie:${i}`);

/** De teksten in de volgorde waarin ze met deze rol op het scherm staan. */
function shownOrder(role: 'button' | 'radio', texts: readonly string[]) {
  return screen
    .getAllByRole(role)
    .map((element) => texts.find((text) => element.textContent?.includes(text)))
    .filter((text): text is string => text !== undefined);
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

describe('groep D: keuzes staan niet op een vaste plek', () => {
  it('Durf je schudt de antwoorden per keer; de inzet blijft van weinig naar veel', async () => {
    const user = userEvent.setup();
    const step = { ...demo('durf-je', 'bet'), options: ['Ik ben ziek.', 'Ik zijn ziek.', 'Ik bent ziek.', 'Ik is ziek.'], answer: 'Ik ben ziek.' };
    const answerAt = new Set<number>();
    for (const seed of SEEDS) {
      const view = renderStep(BetStep, step, undefined, seed);
      const order = shownOrder('radio', step.options);
      expect([...order].sort()).toEqual([...step.options].sort());
      answerAt.add(order.indexOf(step.answer));
      expect(shownOrder('radio', ['Ik gok', 'Vrij zeker', 'Heel zeker'])).toEqual(['Ik gok', 'Vrij zeker', 'Heel zeker']);

      await user.click(screen.getByRole('radio', { name: step.answer }));
      expect(view.state.response.value).toBe(step.answer);
      view.unmount();
    }
    expect(answerAt.size).toBeGreaterThan(2);
  });

  it('Durf je houdt dezelfde volgorde bij dezelfde sleutel (verversen)', () => {
    const step = demo('durf-je', 'bet');
    const orders = new Set<string>();
    for (const seed of SEEDS) {
      const first = renderStep(BetStep, step, undefined, seed);
      const before = shownOrder('radio', step.options);
      first.unmount();
      const again = renderStep(BetStep, step, undefined, seed);
      expect(shownOrder('radio', step.options)).toEqual(before);
      again.unmount();
      orders.add(before.join('|'));
    }
    expect(orders.size).toBe(2);
  });

  it('alinea-stapel: de zin voor de volgende laag staat niet altijd bovenaan', async () => {
    const user = userEvent.setup();
    const step = demo('alinea-stapel', 'stack');
    const texts = step.layers.map((layer) => layer.text);
    const nextAt = new Set<string>();
    for (const seed of SEEDS.slice(0, 8)) {
      const view = renderStep(StackStep, step, undefined, seed);
      for (const [placed, text] of texts.entries()) {
        const left = shownOrder('button', texts.slice(placed));
        expect([...left].sort()).toEqual(texts.slice(placed).sort());
        nextAt.add(`${placed}:${left.indexOf(text)}`);
        await user.click(screen.getByRole('button', { name: (name) => name.startsWith(text) }));
      }
      expect(view.state.locked).toBe(true);
      expect(view.state.response).toMatchObject({ placed: step.layers.length, mistakes: 0 });
      view.unmount();
    }
    // De eerste en de tweede laag staan bij verschillende sleutels op verschillende plekken.
    expect([...nextAt].filter((key) => key.startsWith('0:')).length).toBeGreaterThan(1);
    expect([...nextAt].filter((key) => key.startsWith('1:')).length).toBeGreaterThan(1);
  });
});
