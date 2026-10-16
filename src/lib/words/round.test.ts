import { beforeEach, describe, expect, it } from 'vitest';
import { dayKey } from '@/lib/dates';
import { useWordRound, useWords } from '@/state/words';
import { EMPTY_WORDS } from './memory';
import { startRound } from './round';

beforeEach(() => {
  useWords.setState(EMPTY_WORDS);
  useWordRound.setState({ current: null, checked: null });
});

describe('rondes starten', () => {
  it('is vandaag al af, dan start "vandaag" geen extra ronde vanzelf', () => {
    const now = Date.parse('2026-10-11T12:00:00');
    const today = dayKey(now);
    useWords.setState({ days: { [today]: { added: [], reviewed: [], kept: [], themes: [], done: true, ms: 0 } } });
    expect(startRound('today', now)).toBeNull();
    expect(useWordRound.getState().current).toBeNull();
    expect(startRound('extra', now)?.round).toBe(1);
  });

  it('een lopende ronde van vandaag gaat verder in plaats van opnieuw te beginnen', () => {
    const now = Date.parse('2026-10-11T12:00:00');
    const first = startRound('today', now);
    expect(first?.round).toBe(0);
    expect(startRound('today', now + 60_000)?.session.id).toBe(first?.session.id);
  });
});
