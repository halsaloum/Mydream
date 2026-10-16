import { render, screen, within } from '@testing-library/react';
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

const SEEDS = Array.from({ length: 16 }, (_, i) => `keer:${i}`);

function show(seed = 'test') {
  const onSolved = vi.fn();
  function Harness() {
    const [solved, setSolved] = useState(false);
    return (
      <CompoundWidget seed={seed}
        data={BANK}
        solved={solved}
        onSolved={() => {
          onSolved();
          setSolved(true);
        }}
      />
    );
  }
  const { unmount } = render(<Harness />);
  return Object.assign(onSolved, { unmount });
}

describe('samenstelbank', () => {
  it('zet de delen en afleiders op tafel, met dezelfde sleutel steeds in dezelfde volgorde', () => {
    const shelf = shelfFor(BANK.rounds, 0, 'test');
    expect(shelf).toEqual(expect.arrayContaining(['boek', 'kast', 'bloem', 'pot']));
    expect(shelf).toHaveLength(4);
    expect(shelfFor(BANK.rounds, 0, 'test')).toEqual(shelf);
    expect(shelfFor(BANK.rounds, 1, 'test')).not.toContain('bloempot');
  });

  it('zet de tafel elke keer anders neer, en het eerste deel staat niet steeds vóór het tweede', () => {
    const shelves = SEEDS.map((seed) => shelfFor(BANK.rounds, 0, seed));
    expect(new Set(shelves.map((shelf) => shelf.join(','))).size).toBeGreaterThan(SEEDS.length / 2);
    expect(shelves.some((shelf) => shelf.indexOf('kast') < shelf.indexOf('boek'))).toBe(true);
    expect(shelves.some((shelf) => shelf.indexOf('boek') < shelf.indexOf('kast'))).toBe(true);
  });

  it('kiest de afleiders elke keer anders uit de andere rondes', () => {
    const rounds: WidgetProps<'compound'>['data']['rounds'] = [
      ...BANK.rounds,
      { clue: 'Een koek uit de pan', parts: ['pan', 'koek'], result: 'pannenkoek', options: ['pannenkoek', 'pannekoek'], answer: 'pannenkoek', note: 'Meervoud pannen.' },
      { clue: 'Een boot van een visser', parts: ['visser', 'boot'], result: 'vissersboot', options: ['vissersboot', 'visserboot'], answer: 'vissersboot', note: 'Tussen-s.' },
    ];
    const extras = new Set(SEEDS.map((seed) => shelfFor(rounds, 0, seed).filter((id) => !rounds[0]!.parts.includes(id)).sort().join(',')));
    expect(extras.size).toBeGreaterThan(1);
  });

  it('zet de spellingen elke keer in een andere volgorde', async () => {
    const user = userEvent.setup();
    const first = new Set<string | null>();
    for (const seed of SEEDS) {
      const { unmount } = show(seed);
      await user.click(screen.getByRole('button', { name: 'boek' }));
      await user.click(screen.getByRole('button', { name: 'kast' }));
      const shown = within(screen.getByRole('group', { name: 'Kies de spelling' }))
        .getAllByRole('button')
        .map((button) => button.textContent);
      expect([...shown].sort()).toEqual([...BANK.rounds[0]!.options].sort());
      first.add(shown[0]!);
      unmount();
    }
    expect(first.size).toBeGreaterThan(1);
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
    render(<CompoundWidget seed="test" data={BANK} solved onSolved={vi.fn()} />);
    expect(screen.getByText('Alle 2 samenstellingen gebouwd')).toBeInTheDocument();
    expect(screen.getByText('bloempot')).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Kies de spelling' })).not.toBeInTheDocument();
  });
});
