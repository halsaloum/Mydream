import { cleanup, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { StepOf } from '@/content/schema';
import { orderedText } from '@/engine/grade';
import { ChoiceStep } from './choice-step';
import { FixStep } from './fix-step';
import { OrderStep, ParagraphStep } from './order-steps';
import { startOrder } from './sequence';
import { SortStep } from './sort-step';
import { renderStep } from './test-utils';

const seeds = (n: number) => Array.from({ length: n }, (_, i) => `ronde-${i}`);

/** Zoals de inhoud het vaak doet: het goede antwoord eerst. */
const choice: StepOf<'choice'> = {
  kind: 'choice',
  prompt: 'Welke schrijfwijze is goed?',
  before: '',
  after: '',
  options: ['ideeën', 'ideeen', "idee'en", 'ideëen'],
  answer: 'ideeën',
  why: 'Trema op de derde e.',
};

const pair: StepOf<'choice'> = { ...choice, options: ['zei', 'zij'], answer: 'zei' };

/** De zichtbare keuzes, van boven naar beneden, zonder het nummertje ervoor. */
function shownOptions() {
  return screen.getAllByRole('radio').map((radio) => (radio.textContent ?? '').replace(/^\d+/, ''));
}

describe('ChoiceStep schudt de keuzes', () => {
  it('zet het goede antwoord niet steeds op dezelfde plek', () => {
    const places = seeds(24).map((seed) => {
      renderStep(ChoiceStep, choice, undefined, seed);
      const place = shownOptions().indexOf(choice.answer);
      cleanup();
      return place;
    });
    expect(new Set(places)).toEqual(new Set([0, 1, 2, 3]));
  });

  it('zet bij twee keuzes het antwoord soms eerst en soms tweede', () => {
    const places = seeds(16).map((seed) => {
      renderStep(ChoiceStep, pair, undefined, seed);
      const place = shownOptions().indexOf(pair.answer);
      cleanup();
      return place;
    });
    expect(places).toContain(0);
    expect(places).toContain(1);
  });

  it('houdt dezelfde volgorde met dezelfde sleutel, ook na kiezen en opnieuw laden', async () => {
    const user = userEvent.setup();
    renderStep(ChoiceStep, choice, undefined, 'vast');
    const before = shownOptions();
    expect(before.toSorted()).toEqual([...choice.options].toSorted());

    await user.click(screen.getByRole('radio', { name: /ideeen$/ }));
    expect(shownOptions()).toEqual(before);

    cleanup();
    renderStep(ChoiceStep, choice, undefined, 'vast');
    expect(shownOptions()).toEqual(before);
  });

  it('nummert en kiest met cijfertoetsen in de getoonde volgorde', async () => {
    const user = userEvent.setup();
    const { state } = renderStep(ChoiceStep, choice, undefined, 'ronde-3');
    const radios = screen.getAllByRole('radio');
    radios.forEach((radio, i) => expect(radio.textContent).toMatch(new RegExp(`^${i + 1}\\D`)));

    await user.keyboard('2');
    expect(state.response).toEqual({ kind: 'choice', value: shownOptions()[1] });
    await user.keyboard('4');
    expect(state.response).toEqual({ kind: 'choice', value: shownOptions()[3] });
  });

  it('keurt het goede antwoord goed, waar het ook staat', async () => {
    for (const seed of ['ronde-0', 'ronde-1', 'ronde-2']) {
      const user = userEvent.setup();
      const { state } = renderStep(ChoiceStep, choice, undefined, seed);
      await user.click(screen.getByRole('radio', { name: /ideeën$/ }));
      await user.click(screen.getByTestId('player-submit'));
      expect(state.correct).toBe(true);
      cleanup();
    }
  });
});

/** Uit de inhoud: de oplossing is een draaiing van de getoonde volgorde ([1, 2, 0]). */
const order: StepOf<'order'> = {
  kind: 'order',
  prompt: 'Zet de woorden in de goede volgorde.',
  tiles: ['taalkundigen', 'wij', 'jonge'],
  answer: 'wij jonge taalkundigen',
  why: 'Lidwoord, bijvoeglijk naamwoord, zelfstandig naamwoord.',
};

const paragraph: StepOf<'paragraph'> = {
  kind: 'paragraph',
  prompt: 'Maak er een alinea van.',
  parts: [
    { role: 'Kernzin', text: 'Lezen maakt je slimmer.' },
    { role: 'Uitleg', text: 'Je leert nieuwe woorden.' },
    { role: 'Voorbeeld', text: 'Zo leerde ik het woord "dromerig".' },
    { role: 'Afronding', text: 'Lees dus elke dag een kwartier.' },
  ],
  why: 'Kernzin eerst.',
};

/** De kaartjes op de stapel, van links naar rechts. */
function poolTexts() {
  const pool = screen.getByRole('group', { name: 'Kaartjes om te leggen' });
  return within(pool)
    .getAllByRole('button')
    .map((tile) => tile.textContent ?? '');
}

describe('volgorde-oefeningen beginnen nooit opgelost', () => {
  const solvedOrder = (placed: readonly number[]) => orderedText(order, { kind: 'order', placed: [...placed] }) === order.answer;

  it('legt de stapel nooit in de goede volgorde, ook niet als die niet de volgorde van de inhoud is', () => {
    const starts = seeds(600).map((seed) => startOrder(seed, order.tiles.length, solvedOrder));
    expect(starts.some(solvedOrder)).toBe(false);
    // Alle vijf andere volgordes komen voor, ongeveer even vaak.
    const counts = new Map<string, number>();
    for (const start of starts) counts.set(start.join(''), (counts.get(start.join('')) ?? 0) + 1);
    expect(counts.size).toBe(5);
    for (const count of counts.values()) expect(count).toBeGreaterThan(80);
  });

  it('vindt ook bij twee kaartjes een volgorde die nog niet goed is', () => {
    const solved = (placed: readonly number[]) => placed[0] === 0;
    for (const seed of seeds(50)) expect(startOrder(seed, 2, solved)).toEqual([1, 0]);
  });

  it('schudt de woorden per keer anders en keurt de goede zin goed', async () => {
    const shown = new Set<string>();
    for (const seed of seeds(8)) {
      renderStep(OrderStep, order, undefined, seed);
      const texts = poolTexts();
      expect(texts.join(' ')).not.toBe(order.answer);
      shown.add(texts.join(' '));
      cleanup();
    }
    expect(shown.size).toBeGreaterThan(1);

    const user = userEvent.setup();
    const { state } = renderStep(OrderStep, order, undefined, 'ronde-1');
    for (const word of ['wij', 'jonge', 'taalkundigen']) await user.click(screen.getByRole('button', { name: `${word}. Activeer om te leggen.` }));
    await user.click(screen.getByTestId('player-submit'));
    expect(state.correct).toBe(true);
  });

  it('legt de zinnen van een alinea nooit in de goede volgorde, en per keer anders', () => {
    const texts = paragraph.parts.map((part) => part.text);
    const shown = new Set<string>();
    for (const seed of seeds(30)) {
      renderStep(ParagraphStep, paragraph, undefined, seed);
      const pool = poolTexts();
      expect(pool).not.toEqual(texts);
      expect(pool.toSorted()).toEqual(texts.toSorted());
      shown.add(pool.join('|'));
      cleanup();
    }
    expect(shown.size).toBeGreaterThan(5);
  });

  it('houdt de stapel vast met dezelfde sleutel', () => {
    renderStep(OrderStep, order, undefined, 'vast');
    const first = poolTexts();
    cleanup();
    renderStep(OrderStep, order, undefined, 'vast');
    expect(poolTexts()).toEqual(first);
  });
});

/** Zoals veel sorteeroefeningen in de inhoud: eerst alle kaartjes van bak 1, dan die van bak 2. */
const sort: StepOf<'sort'> = {
  kind: 'sort',
  prompt: 'Hoofdletter of niet?',
  buckets: ['hoofdletter', 'kleine letter'],
  items: [
    { t: 'Utrecht', b: 0 },
    { t: 'maandag', b: 1 },
    { t: 'Fries', b: 0 },
    { t: 'Ramadan', b: 0 },
    { t: 'zomer', b: 1 },
    { t: 'euro', b: 1 },
  ].toSorted((x, y) => x.b - y.b),
  why: 'Namen krijgen een hoofdletter.',
};

/** De kaartjes die nog op de stapel liggen, in de getoonde volgorde. */
function openTexts() {
  const pool = screen.getByRole('group', { name: 'Nog te sorteren' });
  return within(pool)
    .getAllByRole('button')
    .map((tile) => tile.textContent ?? '');
}

describe('SortStep schudt de kaartjes', () => {
  it('toont de kaartjes niet per bak op een rij', () => {
    const firstBuckets = new Set<number>();
    const orders = new Set<string>();
    for (const seed of seeds(16)) {
      renderStep(SortStep, sort, undefined, seed);
      const texts = openTexts();
      expect(texts.toSorted()).toEqual(sort.items.map((item) => item.t).toSorted());
      firstBuckets.add(sort.items.find((item) => item.t === texts[0])!.b);
      orders.add(texts.join('|'));
      cleanup();
    }
    expect(firstBuckets).toEqual(new Set([0, 1]));
    expect(orders.size).toBeGreaterThan(8);
  });

  it('houdt de volgorde vast met dezelfde sleutel', () => {
    renderStep(SortStep, sort, undefined, 'vast');
    const first = openTexts();
    cleanup();
    renderStep(SortStep, sort, undefined, 'vast');
    expect(openTexts()).toEqual(first);
  });

  it('bewaart per kaartje de bak in de volgorde van de inhoud en keurt goed', async () => {
    const user = userEvent.setup();
    const { state } = renderStep(SortStep, sort, undefined, 'ronde-5');
    const shown = openTexts();

    // Cijfertoets op het kaartje: de bakken zelf blijven op hun plek (1 = hoofdletter, 2 = kleine letter).
    const first = sort.items.findIndex((item) => item.t === shown[0]);
    screen.getByRole('button', { name: `${shown[0]}. Kies een bak.` }).focus();
    await user.keyboard(String(sort.items[first]!.b + 1));
    expect(state.response.assign[first]).toBe(sort.items[first]!.b);
    // De focus gaat naar het volgende kaartje zoals het er ligt.
    expect(document.activeElement).toBe(screen.getByRole('button', { name: `${shown[1]}. Kies een bak.` }));

    for (const text of shown.slice(1)) {
      const item = sort.items.find((candidate) => candidate.t === text)!;
      await user.click(screen.getByRole('button', { name: `${text}. Kies een bak.` }));
      await user.click(screen.getByRole('button', { name: new RegExp(`^Leg in bak: ?${sort.buckets[item.b]}`) }));
    }
    expect(state.response.assign).toEqual(sort.items.map((item) => item.b));
    await user.click(screen.getByTestId('player-submit'));
    expect(state.correct).toBe(true);
  });
});

describe('FixStep', () => {
  it('laat de woorden in leesvolgorde staan, wat de sleutel ook is', () => {
    const step: StepOf<'fix'> = {
      kind: 'fix',
      prompt: 'Welk woord is fout?',
      sentence: 'Hij word morgen tien jaar.',
      wrong: 1,
      answer: 'wordt',
      why: 'Hij + stam + t.',
    };
    for (const seed of ['ronde-0', 'ronde-1']) {
      renderStep(FixStep, step, undefined, seed);
      expect(screen.getAllByRole('radio').map((radio) => radio.textContent)).toEqual(['Hij', 'word', 'morgen', 'tien', 'jaar.']);
      cleanup();
    }
  });
});
