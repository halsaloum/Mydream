import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { getDemo } from '@/content/demo';
import { ConjunctionStep } from './conjunction';
import { ClampStep } from './clamp';
import { HighlightStep } from './highlight';
import { LadderStep } from './ladder';
import { RefsStep } from './refs';
import { renderStep } from '../test-utils';

const demo = <K extends string>(slug: K) => getDemo(slug)!.step;

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
});
