import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MotionGlobalConfig } from 'motion/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getDemo } from '@/content/demo';
import type { StepOf } from '@/content/schema';
import { speedScore } from '@/engine/kinds';
import { renderStep } from '../test-utils';
import { MorphStep } from './morph';
import { SpeedStep, speedOrder } from './speed';
import { SwipeStep } from './swipe';
import { TimelineStep } from './timeline';
import { TrainStep } from './train';

afterEach(() => {
  vi.useRealTimers();
  MotionGlobalConfig.skipAnimations = false;
});

const SEEDS = Array.from({ length: 12 }, (_, i) => `les:${i}`);

/** De kaart die nu bovenop de stapel ligt (beurt `turn`, vanaf 0). */
function shownCard(step: StepOf<'swipe'>, turn: number) {
  const text = screen.getByText(`Kaart ${turn + 1} van ${step.cards.length}`).nextElementSibling?.textContent;
  const index = step.cards.findIndex((card) => card.t === text);
  expect(index).toBeGreaterThanOrEqual(0);
  return index;
}

/**
 * Wacht op het volgende item in het snelrondje; geeft de index in de inhoud. Zet de animaties
 * uit, want het volgende item verschijnt pas als het vorige helemaal weg is.
 */
async function nextItem(step: StepOf<'speed'>, asked: readonly number[]) {
  let index = -1;
  await waitFor(() => {
    const shown = screen.getAllByText('Eén woord of twee?');
    expect(shown).toHaveLength(1);
    const text = shown[0]!.previousElementSibling?.textContent;
    index = step.items.findIndex((item) => `${item.a}?${item.b}` === text);
    expect(index).toBeGreaterThanOrEqual(0);
    expect(asked.at(-1)).not.toBe(index);
  });
  return index;
}

describe('groep A oefenvormen', () => {
  it('rondt swipe-kaarten af met alleen pijltjestoetsen', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const step = getDemo('swipe-kaarten')!.step as StepOf<'swipe'>;
    const { state } = renderStep(SwipeStep, step);

    const shown: number[] = [];
    for (let turn = 0; turn < step.cards.length; turn++) {
      const index = shownCard(step, turn);
      shown.push(index);
      await user.keyboard(step.cards[index]!.ok ? '{ArrowRight}' : '{ArrowLeft}');
      expect(state.response.answers).toHaveLength(turn + 1);
      expect(state.locked).toBe(false);
      await user.keyboard('{Enter}');
    }

    await waitFor(() => expect(state.locked).toBe(true));
    // Elke kaart precies één keer, en alles goed: dan zijn de antwoorden die uit de inhoud.
    expect(shown.toSorted()).toEqual([0, 1, 2, 3, 4, 5]);
    expect(state.response.answers).toEqual([true, true, false, true, false, true]);
    expect(state.correct).toBe(true);
  });

  it('schudt de swipe-stapel per keer tonen, vast na verversen', () => {
    const step = getDemo('swipe-kaarten')!.step as StepOf<'swipe'>;
    const firsts = SEEDS.map((seed) => {
      const view = renderStep(SwipeStep, step, undefined, seed);
      const first = shownCard(step, 0);
      view.unmount();
      return first;
    });
    expect(new Set(firsts).size).toBeGreaterThan(2);

    // Zelfde sleutel met een half antwoord (zoals na verversen): de stapel ligt nog zo.
    const order = SEEDS.slice(0, 3).map((seed) => {
      const view = renderStep(SwipeStep, step, { kind: 'swipe', answers: [true, true] }, seed);
      const third = shownCard(step, 2);
      view.unmount();
      const again = renderStep(SwipeStep, step, { kind: 'swipe', answers: [true, true] }, seed);
      expect(shownCard(step, 2)).toBe(third);
      again.unmount();
      return third;
    });
    expect(order).toHaveLength(3);
  });

  it('telt een fout bij de getoonde swipe-kaart, niet bij de kaart op die plek in de inhoud', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const step = getDemo('swipe-kaarten')!.step as StepOf<'swipe'>;
    const seed = SEEDS.find((candidate) => {
      const view = renderStep(SwipeStep, step, undefined, candidate);
      const first = shownCard(step, 0);
      view.unmount();
      return step.cards[first]!.ok !== step.cards[0]!.ok;
    });
    expect(seed).toBeDefined();
    const { state } = renderStep(SwipeStep, step, undefined, seed);

    for (let turn = 0; turn < step.cards.length; turn++) {
      const ok = step.cards[shownCard(step, turn)]!.ok;
      // Alleen de eerste kaart fout beoordelen.
      await user.keyboard(ok === (turn !== 0) ? '{ArrowRight}' : '{ArrowLeft}');
      await user.keyboard('{Enter}');
    }

    await waitFor(() => expect(state.locked).toBe(true));
    expect(state.response.answers.filter((answer, i) => answer === step.cards[i]!.ok)).toHaveLength(5);
    expect(state.correct).toBe(false);
    expect(screen.getByText('5 van 6 goed')).toBeInTheDocument();
  });

  it('houdt de beoordeelde kaart en haar uitleg na verversen vast totdat je verdergaat', async () => {
    const user = userEvent.setup();
    const step = getDemo('swipe-kaarten')!.step as StepOf<'swipe'>;
    const before = renderStep(SwipeStep, step);
    const card = shownCard(step, 0);
    await user.click(screen.getByRole('button', { name: step.cards[card]!.ok ? /^Goed$/ : /^Fout$/ }));
    const saved = before.state.response;
    const explanation = step.cards[card]!.why;
    expect(saved).toMatchObject({ reviewed: 0 });
    before.unmount();

    const restored = renderStep(SwipeStep, step, saved);
    expect(shownCard(step, 0)).toBe(card);
    expect(screen.getByText((text) => text.includes(explanation))).toBeVisible();
    expect(screen.getByRole('button', { name: /^Goed$/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /^Fout$/ })).toBeDisabled();
    await user.keyboard('{Enter}');
    expect(restored.state.response).toMatchObject({ reviewed: 1 });
    expect(shownCard(step, 1)).not.toBe(card);
  });

  it('vindt vijf echte woorden in woordbouwer', async () => {
    const user = userEvent.setup();
    const step = getDemo('woordbouwer')!.step as StepOf<'morph'>;
    const { state } = renderStep(MorphStep, step);

    await user.click(screen.getByRole('radio', { name: '-baar' }));
    await user.click(screen.getByRole('radio', { name: '-heid' }));
    await user.click(screen.getByRole('radio', { name: 'on-' }));
    await user.click(screen.getByRole('radio', { name: '-heid' }));

    await waitFor(() => expect(state.locked).toBe(true));
    expect(state.response.found).toEqual(expect.arrayContaining(['||', '|baar|', '|baar|heid', 'on|baar|heid', 'on|baar|']));
  });

  it('bezoekt alle tijden met schuif-labels', async () => {
    const user = userEvent.setup();
    const step = getDemo('tijdschuif')!.step as StepOf<'timeline'>;
    const { state } = renderStep(TimelineStep, step);

    await user.click(screen.getByRole('button', { name: /net klaar/i }));
    await user.click(screen.getByRole('button', { name: /^nu/i }));
    await user.click(screen.getByRole('button', { name: /morgen/i }));

    await waitFor(() => expect(state.locked).toBe(true));
    expect(state.response.seen.toSorted()).toEqual([0, 1, 2, 3]);
  });

  it('snelrondje scoort combo en sluit bij tijd op', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    MotionGlobalConfig.skipAnimations = true;
    const step = getDemo('snelrondje')!.step as StepOf<'speed'>;
    const { state } = renderStep(SpeedStep, step);

    await user.click(screen.getByRole('button', { name: /start met klok/i }));
    const asked: number[] = [];
    for (let turn = 0; turn < 3; turn++) {
      asked.push(await nextItem(step, asked));
      await user.click(screen.getByRole('button', { name: step.items[asked.at(-1)!]!.joined ? /aan elkaar/i : /^los$/i }));
      act(() => vi.advanceTimersByTime(500));
    }
    act(() => vi.advanceTimersByTime(21_000));

    await waitFor(() => expect(state.locked).toBe(true));
    expect(state.response.finished).toBe(true);
    expect(speedScore(state.response.answers)).toMatchObject({ points: 40, combo: 3, best: 3 });
  });

  it('snelrondje zonder klok vraagt elk item één keer, geschud, en bewaart de index uit de inhoud', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    MotionGlobalConfig.skipAnimations = true;
    const step = getDemo('snelrondje')!.step as StepOf<'speed'>;
    const { state } = renderStep(SpeedStep, step, undefined, 'les:1');

    await user.click(screen.getByRole('button', { name: /zonder klok/i }));
    const shown: number[] = [];
    for (let turn = 0; turn < step.items.length; turn++) {
      shown.push(await nextItem(step, shown));
      await user.keyboard(step.items[shown.at(-1)!]!.joined ? '1' : '2');
      act(() => vi.advanceTimersByTime(500));
    }

    await waitFor(() => expect(state.locked).toBe(true));
    const asked = state.response.answers.map((answer) => answer.item);
    expect(asked).toEqual(shown);
    expect(asked).toEqual(speedOrder('les:1', step.items.length, 0));
    expect(asked.toSorted((a, b) => a - b)).toEqual(step.items.map((_, i) => i));
    expect(asked).not.toEqual(step.items.map((_, i) => i));
    expect(state.response.answers.every((answer) => answer.ok)).toBe(true);
  });

  it('snelrondje zonder klok vraagt na een half rondje van vóór het schudden alleen de rest', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    MotionGlobalConfig.skipAnimations = true;
    const step = getDemo('snelrondje')!.step as StepOf<'speed'>;
    const n = step.items.length;
    // Bewaard antwoord uit de tijd dat de items in de volgorde van de inhoud kwamen.
    const before = [0, 1, 2].map((item) => ({ item, ok: true }));
    expect(speedOrder('les:1', n, 0).slice(3).toSorted((a, b) => a - b)).not.toEqual(step.items.map((_, i) => i).slice(3));
    const { state } = renderStep(SpeedStep, step, { kind: 'speed', answers: before, clock: false, endsAt: null, finished: false }, 'les:1');

    const shown = before.map((answer) => answer.item);
    for (let turn = before.length; turn < n; turn++) {
      shown.push(await nextItem(step, shown));
      await user.keyboard(step.items[shown.at(-1)!]!.joined ? '1' : '2');
      act(() => vi.advanceTimersByTime(500));
    }

    await waitFor(() => expect(state.locked).toBe(true));
    const asked = state.response.answers.map((answer) => answer.item);
    expect(asked).toEqual(shown);
    expect(asked.toSorted((a, b) => a - b)).toEqual(step.items.map((_, i) => i));
  });

  it('snelrondje schudt elke ronde opnieuw zonder hetzelfde item twee keer achter elkaar', () => {
    for (const n of [4, 5, 8]) {
      const firsts = new Set<number>();
      for (const seed of SEEDS) {
        let previous: number[] | null = null;
        for (let round = 0; round < 6; round++) {
          const order = speedOrder(seed, n, round);
          expect(order.toSorted((a, b) => a - b)).toEqual(Array.from({ length: n }, (_, i) => i));
          if (previous) expect(order[0]).not.toBe(previous[n - 1]);
          if (round === 0) firsts.add(order[0]!);
          previous = order;
        }
        expect(speedOrder(seed, n, 1)).not.toEqual(speedOrder(seed, n, 0));
      }
      expect(firsts.size).toBeGreaterThan(1);
    }
  });

  it('zinstrein verzamelt elke vooropplaatsing', async () => {
    const user = userEvent.setup();
    const step = getDemo('zinstrein')!.step as StepOf<'train'>;
    const { state } = renderStep(TrainStep, step);

    await user.click(screen.getByRole('button', { name: 'ik' }));
    await user.click(screen.getByRole('button', { name: 'morgen' }));
    await user.click(screen.getByRole('button', { name: 'naar kantoor' }));

    await waitFor(() => expect(state.locked).toBe(true));
    expect(state.response.front).toBe('P');
    expect(state.response.seen.toSorted()).toEqual(['P', 'S', 'T']);
  });
});
