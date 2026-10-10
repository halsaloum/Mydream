import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CompoundWidget, judgePair, shelfFor } from './compound-widget';
import type { WidgetProps } from './widgets';

// jsdom heeft geen canvas en geen WebGL: de werkbank valt terug op iconen, de knoppen doen het werk.
vi.mock('@/lib/confetti', () => ({ celebrate: vi.fn(), originOf: () => undefined }));
vi.mock('@/lib/toy3d/toy-canvas', () => ({ ToyCanvas: ({ fallback }: { fallback?: React.ReactNode }) => fallback ?? null }));

const BANK: WidgetProps<'compound'>['data'] = {
  q: 'Bouw de samenstelling',
  rounds: [
    {
      clue: 'Een kast voor boeken',
      parts: ['boek', 'kast'],
      result: 'boekenkast',
      options: ['boekkast', 'boekenkast'],
      answer: 'boekenkast',
      note: 'boek heeft alleen het meervoud boeken.',
      swap: 'Andersom wordt het een boek.',
    },
    {
      clue: 'Een pot om een plant in te zetten',
      parts: ['bloem', 'pot'],
      result: 'bloempot',
      options: ['bloemenpot', 'bloempot'],
      answer: 'bloempot',
      note: 'Je hoort niets tussen de delen.',
    },
  ],
  note: 'Twee samenstellingen gebouwd.',
};

function show() {
  const onSolved = vi.fn();
  function Harness() {
    const [solved, setSolved] = useState(false);
    return (
      <CompoundWidget
        data={BANK}
        solved={solved}
        onSolved={() => {
          onSolved();
          setSolved(true);
        }}
      />
    );
  }
  render(<Harness />);
  return onSolved;
}

describe('samenstelbank', () => {
  it('zet de delen en afleiders op tafel, steeds in dezelfde volgorde', () => {
    const shelf = shelfFor(BANK.rounds, 0);
    expect(shelf).toEqual(expect.arrayContaining(['boek', 'kast', 'bloem', 'pot']));
    expect(shelf).toHaveLength(4);
    expect(shelfFor(BANK.rounds, 0)).toEqual(shelf);
    expect(shelfFor(BANK.rounds, 1)).not.toContain('bloempot');
  });

  it('herkent de goede volgorde en de omgekeerde', () => {
    const round = BANK.rounds[0]!;
    expect(judgePair(round, ['boek', 'kast'])).toBe('goed');
    expect(judgePair(round, ['kast', 'boek'])).toBe('andersom');
    expect(judgePair(round, ['boek', 'pot'])).toBe('fout');
  });

  it('legt uit dat het laatste deel de baas is, en bouwt dan alle rondes', async () => {
    const user = userEvent.setup();
    const onSolved = show();
    await user.click(screen.getByRole('button', { name: 'kast' }));
    await user.click(screen.getByRole('button', { name: 'boek' }));
    expect(screen.getByText('Andersom wordt het een boek.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'pot' }));
    expect(screen.getByText(/Een pot hoort hier niet bij/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'boek' }));
    await user.click(screen.getByRole('button', { name: 'kast' }));
    await user.click(screen.getByRole('button', { name: 'boekkast' }));
    expect(screen.getByText(/boekkast\? Kijk naar de naad/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'boekenkast' }));
    expect(screen.getByText(BANK.rounds[0]!.note)).toBeInTheDocument();
    expect(onSolved).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /Volgende samenstelling/ }));
    expect(screen.getByText('Een pot om een plant in te zetten')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'bloem' }));
    await user.click(screen.getByRole('button', { name: 'pot' }));
    await user.click(screen.getByRole('button', { name: 'bloempot' }));
    expect(onSolved).toHaveBeenCalledOnce();
    expect(screen.getByText(BANK.note)).toBeInTheDocument();
  });

  it('toont een eerder gebouwde bank meteen af, met de laatste samenstelling', () => {
    render(<CompoundWidget data={BANK} solved onSolved={vi.fn()} />);
    expect(screen.getByText('Alle 2 samenstellingen gebouwd')).toBeInTheDocument();
    expect(screen.getByText('bloempot')).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Kies de spelling' })).not.toBeInTheDocument();
  });
});
