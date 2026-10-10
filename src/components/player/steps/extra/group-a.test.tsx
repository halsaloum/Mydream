import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getDemo } from '@/content/demo';
import type { StepOf } from '@/content/schema';
import { speedScore } from '@/engine/kinds';
import { renderStep } from '../test-utils';
import { MorphStep } from './morph';
import { SpeedStep } from './speed';
import { SwipeStep } from './swipe';
import { TimelineStep } from './timeline';
import { TrainStep } from './train';

afterEach(() => {
  vi.useRealTimers();
});

describe('groep A oefenvormen', () => {
  it('rondt swipe-kaarten af met alleen pijltjestoetsen', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const step = getDemo('swipe-kaarten')!.step as StepOf<'swipe'>;
    const { state } = renderStep(SwipeStep, step);

    for (const key of ['{ArrowRight}', '{ArrowRight}', '{ArrowLeft}', '{ArrowRight}', '{ArrowLeft}', '{ArrowRight}']) {
      await user.keyboard(key);
      act(() => vi.advanceTimersByTime(420));
    }

    await waitFor(() => expect(state.locked).toBe(true));
    expect(state.response.answers).toEqual([true, true, false, true, false, true]);
    expect(state.correct).toBe(true);
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
    const step = getDemo('snelrondje')!.step as StepOf<'speed'>;
    const { state } = renderStep(SpeedStep, step);

    await user.click(screen.getByRole('button', { name: /start met klok/i }));
    await user.click(screen.getByRole('button', { name: /aan elkaar/i }));
    act(() => vi.advanceTimersByTime(500));
    await user.click(screen.getByRole('button', { name: /^los$/i }));
    act(() => vi.advanceTimersByTime(500));
    await user.click(screen.getByRole('button', { name: /aan elkaar/i }));
    act(() => vi.advanceTimersByTime(21_000));

    await waitFor(() => expect(state.locked).toBe(true));
    expect(state.response.finished).toBe(true);
    expect(speedScore(state.response.answers)).toMatchObject({ points: 40, combo: 3, best: 3 });
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
