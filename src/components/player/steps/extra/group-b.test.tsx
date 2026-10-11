import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { lessonEntries } from '@/content/catalog';
import { getDemo } from '@/content/demo';
import type { StepOf } from '@/content/schema';
import { ConjunctionStep } from './conjunction';
import { ClampStep } from './clamp';
import { HighlightStep, isWordList } from './highlight';
import { LadderStep } from './ladder';
import { RefsStep } from './refs';
import { renderStep } from '../test-utils';

const demo = <K extends string>(slug: K) => getDemo(slug)!.step;
const SEEDS = Array.from({ length: 12 }, (_, i) => `les:${i}`);

/** Teksten van de knoppen in schermvolgorde die bij `words` horen (zonder de lege tag eronder). */
const shownWords = (words: readonly string[]) =>
  screen
    .getAllByRole('button')
    .map((button) => button.textContent?.replace(/\u00a0$/, '') ?? '')
    .filter((text) => words.includes(text));

/** Rendert de stap met elke sleutel en geeft per sleutel wat `read` op het scherm leest. */
function perSeed<K extends 'ladder' | 'conjunction' | 'highlight', T>(Component: Parameters<typeof renderStep<K>>[0], step: StepOf<K>, read: () => T): T[] {
  return SEEDS.map((seed) => {
    const view = renderStep(Component, step, undefined, seed);
    const value = read();
    view.unmount();
    return value;
  });
}

const highlightSteps = lessonEntries.flatMap(({ lesson }) => lesson.steps.flatMap((step) => (step.kind === 'highlight' ? [{ lesson: lesson.id, step }] : [])));

describe('groep B extra oefeningen', () => {
  it('kleurt zinsdelen met markeerstiften en telt fouten', async () => {
    const user = userEvent.setup();
    const step = demo('markeerstiften');
    if (step.kind !== 'highlight') throw new Error('wrong demo');
    const view = renderStep(HighlightStep, step);

    await user.click(screen.getByRole('button', { name: /Vorige/i }));
    expect(view.state.response.mistakes).toBe(1);
    await user.keyboard('3');
    await user.click(screen.getByRole('button', { name: /^Vorige/i }));
    await user.click(screen.getByRole('button', { name: /^week/i }));
    await user.click(screen.getByRole('button', { name: /^mijn/i }));
    await user.click(screen.getByRole('button', { name: /^zus/i }));
    await user.click(screen.getByRole('button', { name: /^reed/i }));
    await user.click(screen.getByRole('button', { name: /^naar/i }));
    await user.click(screen.getByRole('button', { name: /^Maastricht/i }));

    expect(view.state.locked).toBe(true);
    expect(view.state.response.painted).toHaveLength(7);
  });

  it('duwt voegwoorden naar de juiste positie', async () => {
    const user = userEvent.setup();
    const step = demo('voegwoord-duw');
    if (step.kind !== 'conjunction') throw new Error('wrong demo');
    const view = renderStep(ConjunctionStep, step);

    await user.click(screen.getByRole('button', { name: /Zet regent achteraan/i }));
    expect(view.state.response.mistakes).toBe(1);
    await user.click(screen.getByRole('button', { name: /Zet regent plek 2/i }));
    await user.click(screen.getByRole('button', { name: /^omdat/i }));
    await user.click(screen.getByRole('button', { name: /Zet regent achteraan/i }));
    await user.click(screen.getByRole('button', { name: /^maar/i }));
    await user.click(screen.getByRole('button', { name: /Zet regent plek 2/i }));
    await user.click(screen.getByRole('button', { name: /^hoewel/i }));
    await user.click(screen.getByRole('button', { name: /Zet regent achteraan/i }));

    expect(view.state.locked).toBe(true);
    expect(view.state.response.placed).toHaveLength(4);
  });

  it('maakt de zinstang kort genoeg', async () => {
    const user = userEvent.setup();
    const step = demo('zinstang');
    if (step.kind !== 'clamp') throw new Error('wrong demo');
    const view = renderStep(ClampStep, step);

    const fietspad = screen.getByRole('radiogroup', { name: /voor een nieuw fietspad/i });
    await user.click(within(fietspad).getByRole('radio', { name: /achteraan/i }));
    const meerderheid = screen.getByRole('radiogroup', { name: /met een kleine meerderheid/i });
    await user.click(within(meerderheid).getByRole('radio', { name: /achteraan/i }));

    expect(view.state.locked).toBe(true);
    expect(view.state.response.pos.c).toBe('after');
    expect(view.state.response.pos.d).toBe('after');
  });

  it('spant verwijsdraden in volgorde', async () => {
    const user = userEvent.setup();
    const step = demo('verwijsdraad');
    if (step.kind !== 'refs') throw new Error('wrong demo');
    const view = renderStep(RefsStep, step);

    await user.click(screen.getByRole('button', { name: /de etalage/i }));
    expect(view.state.response.mistakes).toBe(1);
    await user.click(screen.getByRole('button', { name: /een nieuwe fiets/i }));
    await user.click(screen.getByRole('button', { name: /^Sanne/i }));
    await user.click(screen.getByRole('button', { name: /een nieuwe fiets/i }));

    expect(view.state.locked).toBe(true);
    expect(view.state.response.linked).toBe(3);
  });

  it('plaatst de betekenisladder met klikbare tegels', async () => {
    const user = userEvent.setup();
    const step = demo('betekenisladder');
    if (step.kind !== 'ladder') throw new Error('wrong demo');
    const view = renderStep(LadderStep, step);

    await user.click(screen.getByRole('button', { name: /^vaak/i }));
    expect(view.state.response.mistakes).toBe(1);
    for (const word of ['nooit', 'zelden', 'soms', 'vaak', 'altijd']) {
      await user.click(screen.getByRole('button', { name: new RegExp(`^${word}`, 'i') }));
    }

    expect(view.state.locked).toBe(true);
    expect(view.state.response.placed).toBe(5);
  });

  it('schudt de kaartjes van de betekenisladder, nooit al op volgorde', () => {
    const base = demo('betekenisladder');
    if (base.kind !== 'ladder') throw new Error('wrong demo');
    const { tray: _tray, ...free } = base;
    // Alfabetisch lag deze ladder al goed: stoel, strepen, tijger.
    const abc: StepOf<'ladder'> = { ...free, steps: [{ t: 'stoel' }, { t: 'strepen' }, { t: 'tijger' }] };
    for (const step of [free, abc]) {
      const ladder = step.steps.map((rung) => rung.t);
      const orders = perSeed(LadderStep, step, () => shownWords(ladder));
      for (const order of orders) {
        expect(order.toSorted()).toEqual(ladder.toSorted());
        expect(order).not.toEqual(ladder);
      }
      expect(new Set(orders.map((order) => order.join('|'))).size).toBeGreaterThan(1);
    }
  });

  it('houdt vaste kaartjes uit de inhoud aan, behalve als ze al op volgorde liggen', () => {
    const step = demo('betekenisladder');
    if (step.kind !== 'ladder') throw new Error('wrong demo');
    const ladder = step.steps.map((rung) => rung.t);
    for (const order of perSeed(LadderStep, step, () => shownWords(ladder))) expect(order).toEqual(step.tray);

    const solved = { ...step, tray: ladder };
    for (const order of perSeed(LadderStep, solved, () => shownWords(ladder))) expect(order).not.toEqual(ladder);
  });

  it('schudt de voegwoorden; cijfertoetsen volgen het scherm en de kleur verraadt de soort niet', async () => {
    const user = userEvent.setup();
    const step = demo('voegwoord-duw');
    if (step.kind !== 'conjunction') throw new Error('wrong demo');
    const conjs = step.items.map((item) => item.conj);
    const chips = () => within(screen.getByRole('group', { name: 'Voegwoorden' })).getAllByRole('button');
    const shown = () => chips().map((chip) => chip.textContent?.replace(/\d+$/, '') ?? '');

    const orders = perSeed(ConjunctionStep, step, shown);
    expect(new Set(orders.map((order) => order.join('|'))).size).toBeGreaterThan(2);
    const seed = SEEDS[orders.findIndex((order) => order.join('|') !== conjs.join('|'))]!;

    const view = renderStep(ConjunctionStep, step, undefined, seed);
    const order = shown();
    expect(order).not.toEqual(conjs);
    // Het verborgen cijfer is de plek op het scherm.
    expect(chips().map((chip) => chip.textContent?.match(/\d+$/)?.[0])).toEqual(['1', '2', '3', '4']);
    await user.keyboard('3');
    expect(view.state.response.current).toBe(conjs.indexOf(order[2]!));
    await user.keyboard('1');
    expect(view.state.response.current).toBe(conjs.indexOf(order[0]!));

    // Voor het plaatsen hebben alle knoppen dezelfde kleur; daarna die van hun soort.
    expect(chips().map((chip) => chip.dataset.accent)).toEqual(['slate', 'slate', 'slate', 'slate']);
    const first = step.items[conjs.indexOf(order[0]!)]!;
    await user.click(screen.getByRole('button', { name: first.type === 'neven' ? /Zet regent plek 2/i : /Zet regent achteraan/i }));
    expect(view.state.response.placed).toEqual([conjs.indexOf(order[0]!)]);
    expect(chips()[0]!.dataset.accent).toBe(first.type === 'onder' ? 'purple' : 'yellow');
    expect(chips().slice(1).map((chip) => chip.dataset.accent)).toEqual(['slate', 'slate', 'slate']);
  });

  it('houdt een zin bij markeerstiften in leesvolgorde', () => {
    const step = demo('markeerstiften');
    if (step.kind !== 'highlight') throw new Error('wrong demo');
    const words = step.words.map((word) => word.t);
    expect(isWordList(step)).toBe(false);
    for (const order of perSeed(HighlightStep, step, () => shownWords(words))) expect(order).toEqual(words);
  });

  it('schudt losse woorden bij markeerstiften en kleurt ze op hun plek in de inhoud', async () => {
    const user = userEvent.setup();
    const step = highlightSteps.find(({ lesson, step }) => lesson === 'k30' && step.id === 'kleuren')?.step;
    if (step?.kind !== 'highlight') throw new Error('k30: kleuren ontbreekt');
    const words = step.words.map((word) => word.t);
    expect(isWordList(step)).toBe(true);

    const orders = perSeed(HighlightStep, step, () => shownWords(words));
    for (const order of orders) expect(order.toSorted()).toEqual(words.toSorted());
    expect(new Set(orders.map((order) => order.join('|'))).size).toBeGreaterThan(2);

    const seed = SEEDS[orders.findIndex((order) => order.join('|') !== words.join('|'))]!;
    const view = renderStep(HighlightStep, step, undefined, seed);
    const kort = step.words.flatMap((word, i) => (word.role === 'kort' ? [i] : []));
    for (const i of kort.toReversed()) await user.click(screen.getByRole('button', { name: new RegExp(`^${words[i]}`) }));
    expect(view.state.response.painted).toEqual(kort);
    expect(view.state.response.mistakes).toBe(0);
  });

  it('schudt bij markeerstiften alleen de lijsten met losse woorden uit de lessen', () => {
    // Nieuwe markeerstift-oefening erbij? Dan faalt dit: kijk of hij terecht wel (true) of niet
    // (false) geschud wordt, en zet hem in de lijst.
    const classified = highlightSteps.map(({ lesson, step }) => `${lesson}/${step.id}:${isWordList(step)}`);
    expect(classified.toSorted()).toEqual([
      'd11/er-rollen:false',
      'd18/eindbaas:false',
      'd21/basis:true',
      'd23/drie-stiften:true',
      'd24/nominalisaties:false',
      'd6/lagen:false',
      'd8/binnenin:true',
      'k30/kleuren:true',
      'p4/voor-na:false',
      'w11/twee-meesters:false',
      'w12/vier-regels:false',
      'w13/bomenweb:false',
      'w14/twee-motoren:false',
      'w15/rollen:false',
      'w15/spiegel:false',
      'w18/brokken:false',
      'w19/heaps-live:false',
      'w20/eindbaas:false',
      'w23/kleuren:false',
      'w24/ze-ze-ze:false',
      'w25/vier-kleuren:false',
      'w26/kleur-de-tijden:false',
      'w8/onzin:false',
      'w8/soorten:false',
    ]);
  });
});
