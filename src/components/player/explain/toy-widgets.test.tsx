import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ComponentType } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { BinsWidget, CastWidget, MorphWidget } from './toy-widgets';
import type { WidgetProps } from './widgets';

// jsdom heeft geen WebGL: het 3D-beeld valt terug op een icoon, de knoppen doen het werk.
vi.mock('@/lib/confetti', () => ({ celebrate: vi.fn(), originOf: () => undefined }));
vi.mock('@/lib/toy3d/toy-canvas', () => ({ ToyCanvas: ({ fallback }: { fallback?: React.ReactNode }) => fallback ?? null }));

function show<K extends 'bins' | 'morph' | 'cast'>(Widget: ComponentType<WidgetProps<K>>, data: WidgetProps<K>['data']) {
  const onSolved = vi.fn();
  function Harness() {
    const [solved, setSolved] = useState(false);
    return (
      <Widget
        data={data}
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

const BINS: WidgetProps<'bins'>['data'] = {
  bins: ['de', 'het'],
  items: [
    { thing: 'kast', bin: 0, note: 'de kast.' },
    { thing: 'glas', bin: 1, note: 'het glas.', hint: 'Een vol glas of een volle glas?' },
    { thing: 'pan', bin: 0, note: 'de pan.' },
  ],
  note: 'Alles gesorteerd.',
};

describe('sorteertafel', () => {
  it('vraagt eerst een voorwerp, geeft een tip bij een foute bak en is klaar als alles staat', async () => {
    const user = userEvent.setup();
    const onSolved = show(BinsWidget, BINS);
    await user.click(screen.getByRole('button', { name: 'Zet in: de' }));
    expect(screen.getByText('Kies eerst een voorwerp.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'glas' }));
    await user.click(screen.getByRole('button', { name: 'Zet in: de' }));
    expect(screen.getByText('Een vol glas of een volle glas?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Zet in: het' }));
    expect(screen.getByText('het glas.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /glas/ })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'kast' }));
    await user.click(screen.getByRole('button', { name: 'Zet in: de' }));
    expect(onSolved).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'pan' }));
    await user.click(screen.getByRole('button', { name: 'Zet in: de' }));
    expect(onSolved).toHaveBeenCalledTimes(1);
  });
});

const MORPH: WidgetProps<'morph'>['data'] = {
  rounds: [
    { thing: 'kast', from: 'de kast', ask: 'één kleine kast', effect: 'klein', options: ['de kastje', 'het kastje'], answer: 'het kastje', note: '-je is het hoofd.' },
    { thing: 'boek', from: 'het boek', ask: 'een … boek (rood)', effect: 'kleur', paint: 'rood', options: ['een rood boek', 'een rode boek'], answer: 'een rood boek', note: 'Geen -e.' },
  ],
  note: 'Twee vormen gemaakt.',
};

describe('vormmachine', () => {
  it('laat een foute vorm zien, legt de goede uit en gaat ronde voor ronde', async () => {
    const user = userEvent.setup();
    const onSolved = show(MorphWidget, MORPH);
    await user.click(screen.getByRole('button', { name: 'de kastje' }));
    expect(screen.getByText(/de kastje\? Nog niet/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'het kastje' }));
    expect(screen.getByText('-je is het hoofd.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Volgende/ }));
    expect(screen.getByText('Ronde 2 van 2')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'een rood boek' }));
    expect(onSolved).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Alle 2 vormen gemaakt')).toBeInTheDocument();
  });
});

const CAST: WidgetProps<'cast'>['data'] = {
  rounds: [
    {
      text: 'kippenei',
      ask: 'Tik het hoofd van kippenei',
      cast: ['kip', 'ei', 'glas'],
      answer: ['ei'],
      then: { q: 'De of het?', options: ['de kippenei', 'het kippenei'], answer: 'het kippenei' },
      note: 'Een kippenei is een ei.',
    },
    { text: 'Pim zet de pot op de kast.', ask: 'Tik alle argumenten van zetten', cast: ['pim', 'pot', 'kast', 'zon'], answer: ['pim', 'pot', 'kast'], note: 'Drie argumenten.' },
    { text: 'Het regent.', ask: 'Tik alle argumenten van regenen', cast: ['zon', 'huis'], answer: [], note: 'Nul argumenten.' },
  ],
  note: 'Klaar met het toneel.',
};

describe('toneel', () => {
  it('controleert één tik meteen en stelt dan de vervolgvraag', async () => {
    const user = userEvent.setup();
    show(CastWidget, CAST);
    await user.click(screen.getByRole('button', { name: 'kip' }));
    expect(screen.getByText(/Niet kip/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'ei' }));
    await user.click(screen.getByRole('button', { name: 'de kippenei' }));
    expect(screen.getByText(/de kippenei\? Nog niet/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'het kippenei' }));
    expect(screen.getByText('Een kippenei is een ei.')).toBeInTheDocument();
  });

  it('kiest meer voorwerpen met Klaar, meldt wat er mist of te veel is, en kent Niets', async () => {
    const user = userEvent.setup();
    const onSolved = show(CastWidget, CAST);
    await user.click(screen.getByRole('button', { name: 'ei' }));
    await user.click(screen.getByRole('button', { name: 'het kippenei' }));
    await user.click(screen.getByRole('button', { name: /Volgende/ }));

    await user.click(screen.getByRole('button', { name: 'Pim' }));
    await user.click(screen.getByRole('button', { name: 'zon' }));
    await user.click(screen.getByRole('button', { name: /Klaar/ }));
    expect(screen.getByText('zon hoort er niet bij.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'pot' }));
    await user.click(screen.getByRole('button', { name: /Klaar/ }));
    expect(screen.getByText('Er ontbreekt nog één.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'kast' }));
    await user.click(screen.getByRole('button', { name: /Klaar/ }));
    expect(screen.getByText('Drie argumenten.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Volgende/ }));

    await user.click(screen.getByRole('button', { name: 'Niets' }));
    expect(onSolved).toHaveBeenCalledTimes(1);
  });
});
