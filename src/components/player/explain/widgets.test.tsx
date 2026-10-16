import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ComponentType } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { BlendWidget, BuildWidget, MarkWidget, SwapWidget, WheelWidget, type WidgetProps } from './widgets';

vi.mock('@/lib/confetti', () => ({ celebrate: vi.fn(), originOf: () => undefined }));

function show<K extends 'mark' | 'build' | 'wheel' | 'blend' | 'swap'>(Widget: ComponentType<WidgetProps<K>>, data: WidgetProps<K>['data'], seed = 'test') {
  const onSolved = vi.fn();
  function Harness() {
    const [solved, setSolved] = useState(false);
    return (
      <Widget
        seed={seed}
        data={data}
        solved={solved}
        onSolved={() => {
          onSolved();
          setSolved(true);
        }}
      />
    );
  }
  const view = render(<Harness />);
  return { onSolved, unmount: view.unmount };
}

/** De getoonde volgorde voor een reeks sleutels; de eerste keer met een verse render per sleutel. */
function ordersFor(read: (seed: string) => string[]) {
  return Array.from({ length: 16 }, (_, i) => read(`ronde-${i}`));
}

/** Een rijtje losse woorden zoals in de les over -arts: de inhoud zet de doelwoorden om en om, vanaf het eerste. */
const LIST: WidgetProps<'mark'>['data'] = {
  q: 'Tik de artsen met een tussen-n of tussen-s aan',
  sentence: 'kinderarts tandarts vrouwenarts huisarts dierenarts oogarts',
  targets: [0, 2, 4],
  note: 'Kinder-, vrouwen- en dieren-.',
};

const wordsShown = (data: WidgetProps<'mark'>['data'], seed: string) => {
  const { unmount } = show(MarkWidget, data, seed);
  const labels = screen.getAllByRole('button').map((button) => button.textContent ?? '');
  unmount();
  return labels;
};

describe('markeren', () => {
  it('schudt een rijtje losse woorden per ronde, maar vast binnen dezelfde ronde', () => {
    const words = LIST.sentence.split(' ');
    const targets = LIST.targets.map((i) => words[i]);
    const orders = ordersFor((seed) => wordsShown(LIST, seed));
    for (const order of orders) expect([...order].sort()).toEqual([...words].sort());
    expect(orders.some((order) => !targets.includes(order[0]))).toBe(true);
    expect(new Set(orders.map((order) => order.join(' '))).size).toBeGreaterThan(1);
    expect(wordsShown(LIST, 'ronde-4')).toEqual(orders[4]);
  });

  it('houdt een zin in leesvolgorde, ook zonder leestekens', () => {
    const sentences = ['moeder zet water en een computer op tafel in het huis', 'Wij fietsen naar de winkel en kopen twee fietsen.'];
    for (const sentence of sentences) {
      const data: WidgetProps<'mark'>['data'] = { q: 'Tik aan', sentence, targets: [1], note: 'Klaar.' };
      for (const seed of ['a', 'b', 'c', 'd']) expect(wordsShown(data, seed)).toEqual(sentence.split(' '));
    }
  });

  it('telt het aangetikte woord, waar het ook staat', async () => {
    expect(wordsShown(LIST, 'test')).not.toEqual(LIST.sentence.split(' '));
    const user = userEvent.setup();
    const { onSolved } = show(MarkWidget, LIST);
    await user.click(screen.getByRole('button', { name: 'tandarts' }));
    expect(screen.getByText('“tandarts” hoort er niet bij. 0 van 3 gevonden.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'dierenarts' }));
    expect(screen.getByRole('button', { name: 'dierenarts' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'kinderarts' }));
    expect(onSolved).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'vrouwenarts' }));
    expect(onSolved).toHaveBeenCalledTimes(1);
  });
});

const BUILD: WidgetProps<'build'>['data'] = { stem: 'hon', endings: ['d', 't', 'dt'], answer: 'd', note: 'Verlengen: honden.' };

const endingsShown = (seed: string) => {
  const { unmount } = show(BuildWidget, BUILD, seed);
  const labels = within(screen.getByRole('group', { name: 'Uitgangen' }))
    .getAllByRole('button')
    .map((button) => button.getAttribute('aria-label') ?? '');
  unmount();
  return labels;
};

describe('bouwen', () => {
  it('schudt de uitgangen per ronde, maar vast binnen dezelfde ronde', () => {
    const orders = ordersFor(endingsShown);
    expect(new Set(orders.map((order) => order.indexOf(BUILD.answer))).size).toBeGreaterThan(1);
    for (const order of orders) expect([...order].sort()).toEqual([...BUILD.endings].sort());
    expect(endingsShown('ronde-3')).toEqual(orders[3]);
  });

  it('keurt op de uitgang zelf, waar hij ook staat', async () => {
    const user = userEvent.setup();
    const { onSolved } = show(BuildWidget, BUILD);
    await user.click(screen.getByRole('button', { name: 'dt' }));
    expect(screen.getByText('Nog niet. Denk aan de regel hierboven.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'd' }));
    expect(onSolved).toHaveBeenCalledTimes(1);
  });
});

const WHEEL: WidgetProps<'wheel'>['data'] = {
  start: 'r',
  end: 'm',
  options: [{ v: 'a', mean: 'ram' }, { v: 'aa', mean: 'raam' }, { v: 'uu' }, { v: 'eu' }],
  need: 2,
  note: 'Twee echte woorden.',
};

const vowelsShown = (seed: string) => {
  const { unmount } = show(WheelWidget, WHEEL, seed);
  const labels = screen.getAllByRole('radio').map((radio) => radio.textContent ?? '');
  unmount();
  return labels;
};

describe('klinkerwiel', () => {
  it('zet de echte woorden niet steeds vooraan', () => {
    const orders = ordersFor(vowelsShown);
    expect(new Set(orders.map((order) => order[0])).size).toBeGreaterThan(1);
    expect(orders.some((order) => order.indexOf('uu') < order.indexOf('aa'))).toBe(true);
    expect(vowelsShown('ronde-5')).toEqual(orders[5]);
  });

  it('telt de gekozen klinker, niet de plek', async () => {
    const user = userEvent.setup();
    const { onSolved } = show(WheelWidget, WHEEL);
    await user.click(screen.getByRole('radio', { name: 'uu' }));
    expect(screen.getByText('geen Nederlands woord')).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'aa' }));
    expect(screen.getByText('raam')).toBeInTheDocument();
    expect(screen.getByText('1 van 2 echte woorden gevonden')).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'a' }));
    expect(onSolved).toHaveBeenCalledTimes(1);
  });
});

const BLEND: WidgetProps<'blend'>['data'] = {
  letters: ['i', 'j', 'e', 'u', 'o'],
  pairs: [
    { s: 'ij', ex: 'ijs' },
    { s: 'eu', ex: 'neus' },
  ],
  note: 'Twee klanken geplakt.',
};

const lettersShown = (seed: string) => {
  const { unmount } = show(BlendWidget, BLEND, seed);
  const labels = within(screen.getByRole('group', { name: 'Letters' }))
    .getAllByRole('button')
    .map((button) => button.textContent ?? '');
  unmount();
  return labels;
};

describe('letters plakken', () => {
  it('legt de letters van een paar niet steeds naast elkaar', () => {
    const orders = ordersFor(lettersShown);
    expect(orders.some((order) => order.join('') !== BLEND.letters.join(''))).toBe(true);
    expect(orders.some((order) => Math.abs(order.indexOf('i') - order.indexOf('j')) > 1)).toBe(true);
    expect(lettersShown('ronde-7')).toEqual(orders[7]);
  });

  it('plakt de aangetikte letters, waar ze ook staan', async () => {
    const user = userEvent.setup();
    const { onSolved } = show(BlendWidget, BLEND);
    await user.click(screen.getByRole('button', { name: 'j' }));
    await user.click(screen.getByRole('button', { name: 'i' }));
    expect(screen.getByText('ji is hier geen klank. Probeer een ander paar.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'i' }));
    await user.click(screen.getByRole('button', { name: 'j' }));
    expect(screen.getByText('ijs')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'e' }));
    await user.click(screen.getByRole('button', { name: 'u' }));
    expect(onSolved).toHaveBeenCalledTimes(1);
  });
});

const blocksShown = (data: WidgetProps<'swap'>['data'], seed: string) => {
  const { unmount } = show(SwapWidget, data, seed);
  const labels = screen.getAllByRole('listitem').map((item) => item.textContent ?? '');
  unmount();
  return labels;
};

describe('wisselen', () => {
  it('houdt de bedoelde beginvolgorde uit de inhoud', () => {
    const data: WidgetProps<'swap'>['data'] = { goal: 'Persoonsvorm op plek 2.', blocks: ['Gisteren', 'ik', 'zag', 'haar'], accept: ['Gisteren zag ik haar'], note: 'Inversie.' };
    for (const seed of ['a', 'b', 'c']) expect(blocksShown(data, seed)).toEqual(data.blocks);
  });

  it('begint nooit al goed, ook niet als de inhoud dat wel doet', () => {
    const data: WidgetProps<'swap'>['data'] = { goal: 'Maak de zin.', blocks: ['Ik', 'lees', 'een boek'], accept: ['Ik lees een boek'], note: 'Klaar.' };
    const orders = ordersFor((seed) => blocksShown(data, seed));
    for (const order of orders) {
      expect(data.accept).not.toContain(order.join(' '));
      expect([...order].sort()).toEqual([...data.blocks].sort());
    }
    expect(new Set(orders.map((order) => order.join(' '))).size).toBeGreaterThan(1);
    expect(blocksShown(data, 'ronde-2')).toEqual(orders[2]);
  });

  it('schudt de beginvolgorde als de opdracht alleen sorteren is', () => {
    // Uit de les over het alfabet: de inhoud begint precies omgekeerd.
    const data: WidgetProps<'swap'>['data'] = { goal: 'Zet de woorden op alfabet', blocks: ['ik', 'ijs', 'iglo', 'iets'], accept: ['iets iglo ijs ik'], note: 'De ij staat als i + j.' };
    const orders = ordersFor((seed) => blocksShown(data, seed));
    for (const order of orders) {
      expect(data.accept).not.toContain(order.join(' '));
      expect([...order].sort()).toEqual([...data.blocks].sort());
    }
    expect(orders.some((order) => order.join(' ') !== data.blocks.join(' '))).toBe(true);
    expect(new Set(orders.map((order) => order.join(' '))).size).toBeGreaterThan(2);
    expect(blocksShown(data, 'ronde-6')).toEqual(orders[6]);
  });

  it('is klaar zodra een goede volgorde ligt', async () => {
    const user = userEvent.setup();
    const data: WidgetProps<'swap'>['data'] = { goal: 'Persoonsvorm op plek 2.', blocks: ['Gisteren', 'ik', 'zag', 'haar'], accept: ['Gisteren zag ik haar'], note: 'Inversie.' };
    const { onSolved } = show(SwapWidget, data);
    await user.click(screen.getByRole('button', { name: 'ik' }));
    await user.click(screen.getByRole('button', { name: 'zag' }));
    expect(onSolved).toHaveBeenCalledTimes(1);
  });
});
