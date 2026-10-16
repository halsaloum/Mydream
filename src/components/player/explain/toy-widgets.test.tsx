import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ComponentType } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { THINGS, type ThingId } from '@/content/things';
import type { BinsProps } from '@/lib/toy3d/scenes/bins';
import type { CastProps } from '@/lib/toy3d/scenes/cast';
import { BinsWidget, CastWidget, MorphWidget } from './toy-widgets';
import type { WidgetProps } from './widgets';

// jsdom heeft geen WebGL: het 3D-beeld valt terug op een icoon, de knoppen doen het werk.
// Wat de widget aan de 3D-scène geeft, en hoe die een tik terugmeldt, houden we hier bij.
const canvas = vi.hoisted(() => ({ props: null as unknown, onTap: undefined as ((id: string) => void) | undefined }));
vi.mock('@/lib/confetti', () => ({ celebrate: vi.fn(), originOf: () => undefined }));
vi.mock('@/lib/toy3d/toy-canvas', () => ({
  ToyCanvas: ({ fallback, props, onTap }: { fallback?: React.ReactNode; props: unknown; onTap?: (id: string) => void }) => {
    canvas.props = props;
    canvas.onTap = onTap;
    return fallback ?? null;
  },
}));

const SEEDS = Array.from({ length: 16 }, (_, i) => `keer:${i}`);

/** De namen op de knoppen in een groep, in de volgorde op het scherm. */
const names = (group: string) =>
  within(screen.getByRole('group', { name: group }))
    .getAllByRole('button')
    .map((button) => button.textContent);

function show<K extends 'bins' | 'morph' | 'cast'>(Widget: ComponentType<WidgetProps<K>>, data: WidgetProps<K>['data'], seed = 'test') {
  const onSolved = vi.fn();
  function Harness() {
    const [solved, setSolved] = useState(false);
    return (
      <Widget seed={seed}
        data={data}
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

  // Zoals in de inhoud: eerst alles voor de ene bak, dan alles voor de andere.
  const GROUPED: WidgetProps<'bins'>['data'] = {
    bins: ['de', 'het'],
    items: [
      { thing: 'kast', bin: 0, note: 'de kast.' },
      { thing: 'pan', bin: 0, note: 'de pan.' },
      { thing: 'kip', bin: 0, note: 'de kip.' },
      { thing: 'glas', bin: 1, note: 'het glas.' },
      { thing: 'ei', bin: 1, note: 'het ei.' },
      { thing: 'boek', bin: 1, note: 'het boek.' },
    ],
    note: 'Alles gesorteerd.',
  };
  const word = (id: ThingId) => THINGS[id].word;
  const content = GROUPED.items.map((item) => word(item.thing));

  it('zet de voorwerpen elke keer anders op tafel, in 3D en eronder in dezelfde volgorde', () => {
    const orders = new Set<string>();
    for (const seed of SEEDS) {
      const { unmount } = show(BinsWidget, GROUPED, seed);
      const shown = names('Voorwerpen');
      expect([...shown].sort()).toEqual([...content].sort());
      expect((canvas.props as BinsProps).items.map(word)).toEqual(shown);
      orders.add(shown.join(','));
      unmount();
    }
    // Niet steeds de volgorde van de inhoud, en niet steeds een voorwerp uit de eerste bak vooraan.
    expect(orders.size).toBeGreaterThan(SEEDS.length / 2);
    expect([...orders].some((order) => GROUPED.items.find((item) => word(item.thing) === order.split(',')[0])!.bin === 1)).toBe(true);
  });

  it('dezelfde sleutel geeft dezelfde tafel', () => {
    const first = show(BinsWidget, GROUPED, 'vast');
    const before = names('Voorwerpen');
    first.unmount();
    show(BinsWidget, GROUPED, 'vast');
    expect(names('Voorwerpen')).toEqual(before);
  });

  it('een tik in 3D telt voor het voorwerp op die plek, en het nakijken blijft per voorwerp', () => {
    const onSolved = show(BinsWidget, GROUPED, 'tik');
    const shown = names('Voorwerpen');
    expect(shown).not.toEqual(content);
    const tiles = within(screen.getByRole('group', { name: 'Voorwerpen' })).getAllByRole('button');
    shown.forEach((name, d) => {
      const item = GROUPED.items.find((other) => word(other.thing) === name)!;
      act(() => canvas.onTap!(`item:${d}`));
      expect(tiles[d]).toHaveAttribute('aria-pressed', 'true');
      expect((canvas.props as BinsProps).selected).toBe(d);
      act(() => canvas.onTap!(`bin:${1 - item.bin}`));
      expect((canvas.props as BinsProps).wrong?.item).toBe(d);
      act(() => canvas.onTap!(`bin:${item.bin}`));
      expect((canvas.props as BinsProps).placed[d]).toBe(item.bin);
      expect(tiles[d]).toBeDisabled();
    });
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

  it('zet de vormen elke keer in een andere volgorde, ook als het antwoord in de inhoud vooraan staat', async () => {
    const data: WidgetProps<'morph'>['data'] = {
      rounds: [
        { thing: 'kast', from: 'de kast', ask: 'twee kasten', effect: 'veel', options: ['kasten', 'kastten', 'kastens'], answer: 'kasten', note: 'Meervoud op -en.' },
        { thing: 'pan', from: 'de pan', ask: 'twee pannen', effect: 'veel', options: ['pannen', 'panen', 'pans'], answer: 'pannen', note: 'Dubbele n.' },
      ],
      note: 'Klaar.',
    };
    const user = userEvent.setup();
    const first = new Set<string | null>();
    const second = new Set<string | null>();
    for (const seed of SEEDS) {
      const { unmount } = show(MorphWidget, data, seed);
      const shown = names('Kies de vorm');
      expect([...shown].sort()).toEqual([...data.rounds[0]!.options].sort());
      first.add(shown[0]!);
      await user.click(screen.getByRole('button', { name: 'kasten' }));
      await user.click(screen.getByRole('button', { name: /Volgende/ }));
      second.add(names('Kies de vorm')[0]!);
      unmount();
    }
    expect(first.size).toBeGreaterThan(1);
    expect(second.size).toBeGreaterThan(1);
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

  it('zet de kring en de vervolgvraag elke keer anders, ook als het antwoord in de inhoud vooraan staat', async () => {
    const data: WidgetProps<'cast'>['data'] = {
      rounds: [
        {
          text: 'kippenei',
          ask: 'Tik het hoofd van kippenei',
          cast: ['ei', 'kip', 'glas', 'pot'],
          answer: ['ei'],
          then: { q: 'De of het?', options: ['het kippenei', 'de kippenei', 'den kippenei'], answer: 'het kippenei' },
          note: 'Een kippenei is een ei.',
        },
      ],
      note: 'Klaar.',
    };
    const user = userEvent.setup();
    const front = new Set<string | null>();
    const then = new Set<string | null>();
    for (const seed of SEEDS) {
      const { unmount } = show(CastWidget, data, seed);
      const shown = names('Voorwerpen in de kring');
      expect([...shown].sort()).toEqual(data.rounds[0]!.cast.map((id) => THINGS[id].word).sort());
      // De 3D-kring krijgt dezelfde volgorde: wat eerst staat, staat naar je toe.
      expect((canvas.props as CastProps).cast.map((id) => THINGS[id].word)).toEqual(shown);
      front.add(shown[0]!);
      await user.click(screen.getByRole('button', { name: 'ei' }));
      const options = names('De of het?');
      expect([...options].sort()).toEqual([...data.rounds[0]!.then!.options].sort());
      then.add(options[0]!);
      unmount();
    }
    expect(front.size).toBeGreaterThan(1);
    expect(then.size).toBeGreaterThan(1);
  });
});
