import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { StepOf } from '@/content/schema';
import { isComplete } from '@/engine/grade';
import { initialResponse, ResponseSchema } from '@/engine/responses';
import { renderStep } from '../test-utils';
import { InspectStep } from './inspect';
import { SlopeStep } from './slope';

const slope: StepOf<'slope'> = {
  kind: 'slope', prompt: 'Onderzoek het hellend vlak.',
  steps: ['We staan vandaag één extra pauze toe.', 'Vandaag is er één pauze meer.', 'Voortaan werkt niemand meer.'],
  links: [
    { holds: true, why: 'Dit beschrijft hetzelfde concrete besluit.', hint: 'Vandaag één extra pauze betekent vandaag één pauze meer.' },
    { holds: false, why: 'Een extra pauze bewijst niet dat alle arbeid verdwijnt.', hint: 'Welke informatie ontbreekt tussen een pauze en nooit meer werken?' },
  ],
  summary: 'De laatste stap is niet onderbouwd.',
  options: [
    { t: 'Een extra pauze kan gevolgen hebben; laten we die meten.', ok: true, why: 'Een mogelijk gevolg vraagt onderzoek.', segs: [{ t: 'Een extra pauze ' }, { t: 'kan', hi: true }, { t: ' gevolgen hebben; laten we die meten.' }] },
    { t: 'Eén pauze maakt iedereen lui.', trap: 'Overhaaste generalisatie', why: 'Eén maatregel bewijst niet dat iedereen lui wordt.' },
  ],
};

const inspect: StepOf<'inspect'> = {
  kind: 'inspect', prompt: 'Keur de redenering.', heading: 'Het voorstel', fine: 'In orde', fallacies: ['Persoonlijke aanval'],
  rows: [
    { t: 'We willen de proef een maand uitvoeren.', role: 'Standpunt', why: 'Dit is een afgebakend voorstel.', hint: 'Een voorstel zonder aanval is op zichzelf geen persoonlijke aanval.' },
    { t: 'Noor is lui, dus haar voorstel is waardeloos.', fallacy: 'Persoonlijke aanval', why: 'Het oordeel over Noor weerlegt het voorstel niet.', hint: 'Kijk naar het verschil tussen een persoon aanvallen en de inhoud beoordelen.', fixes: [
      { t: 'Het voorstel noemt nog geen meetbaar succescriterium.', ok: true, why: 'Deze kritiek gaat over een concreet gebrek in het voorstel.' },
      { t: 'Noor is altijd lui geweest.', why: 'Je blijft de persoon aanvallen.' },
    ] },
  ],
};

describe('hellend vlak en keuring', () => {
  it('laat elke schakel beoordelen, geeft foutherstel en voltooit pas na de eerlijke herformulering', async () => {
    const user = userEvent.setup();
    const view = renderStep(SlopeStep, slope);
    expect(screen.queryByRole('region', { name: 'De redenering herstellen' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Volgt niet vanzelf' }));
    expect(view.state.response).toMatchObject({ judged: 0, mistakes: 1, honest: false });
    await waitFor(() => expect(screen.getByText(slope.links[0]!.hint)).toBeVisible());

    const follows = screen.getByRole('button', { name: 'Volgt wel' });
    follows.focus();
    await user.keyboard('{Enter}');
    expect(view.state.response.judged).toBe(1);
    expect(screen.getByText(slope.links[0]!.why)).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Volgt niet vanzelf' }));
    expect(view.state.response.judged).toBe(2);
    expect(view.state.locked).toBe(false);
    expect(screen.getByText(slope.links[1]!.why)).toBeVisible();

    await user.click(screen.getByRole('button', { name: slope.options[1]!.t }));
    expect(view.state.response).toMatchObject({ tried: [1], mistakes: 2, honest: false });
    expect(screen.getByRole('button', { name: slope.options[1]!.t })).toBeDisabled();
    expect(screen.getByText('Overhaaste generalisatie:')).toBeVisible();
    await user.click(screen.getByRole('button', { name: slope.options[0]!.t }));
    expect(view.state.response.honest).toBe(true);
    expect(isComplete(slope, view.state.response)).toBe(true);
    expect(view.state.locked).toBe(true);
    expect(screen.getByText('Alle schakels onderzocht en de redenering hersteld.')).toBeVisible();
    const saved = JSON.stringify(view.state.response);
    fireEvent.click(screen.getByRole('button', { name: slope.options[1]!.t }));
    expect(JSON.stringify(view.state.response)).toBe(saved);
  });

  it('hervat de keten bij de nog open schakel en bewaart eerder gegeven uitleg', async () => {
    const user = userEvent.setup();
    const first = renderStep(SlopeStep, slope);
    await user.click(screen.getByRole('button', { name: 'Volgt wel' }));
    const saved = ResponseSchema.parse(JSON.parse(JSON.stringify(first.state.response)));
    if (saved.kind !== 'slope') throw new Error('Verkeerd antwoordtype');
    first.unmount();
    const resumed = renderStep(SlopeStep, slope, saved);
    expect(screen.getByRole('heading', { name: 'Schakel 2 van 2' })).toBeVisible();
    expect(screen.getByText(slope.links[0]!.why)).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Volgt niet vanzelf' }));
    await user.click(screen.getByRole('button', { name: slope.options[0]!.t }));
    expect(resumed.state.locked).toBe(true);
  });

  it('laat fouten benoemen en inhoudelijk herstellen, en vereist ook een oordeel over de goede zin', async () => {
    const user = userEvent.setup();
    const first = renderStep(InspectStep, inspect);
    await user.click(screen.getByRole('button', { name: `Zin 2: ${inspect.rows[1]!.t}` }));
    await user.click(screen.getByRole('button', { name: 'In orde' }));
    expect(first.state.response).toMatchObject({ judged: [], mistakes: 1, tried: ['l1-0'] });
    await waitFor(() => expect(screen.getByText(inspect.rows[1]!.hint)).toBeVisible());
    expect(screen.queryByText('Welke versie herstelt de redenering?')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Persoonlijke aanval' }));
    expect(first.state.response.judged).toEqual([1]);
    expect(first.state.locked).toBe(false);
    await user.click(screen.getByRole('button', { name: 'Noor is altijd lui geweest.' }));
    expect(first.state.response.mistakes).toBe(2);
    expect(first.state.response.fixed).toEqual([]);

    const saved = ResponseSchema.parse(JSON.parse(JSON.stringify(first.state.response)));
    if (saved.kind !== 'inspect') throw new Error('Verkeerd antwoordtype');
    first.unmount();
    const resumed = renderStep(InspectStep, inspect, saved);
    expect(screen.getByRole('heading', { name: 'Herstel zin 2' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Noor is altijd lui geweest.' })).toBeDisabled();
    expect(screen.getByText('Je blijft de persoon aanvallen.')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Het voorstel noemt nog geen meetbaar succescriterium.' }));
    expect(resumed.state.response.fixed).toEqual([1]);
    expect(isComplete(inspect, resumed.state.response)).toBe(false);
    expect(resumed.state.locked).toBe(false);
    expect(screen.getByRole('button', { name: 'Zin 2: Het voorstel noemt nog geen meetbaar succescriterium.' })).toBeVisible();

    const firstRow = screen.getByRole('button', { name: `Zin 1: ${inspect.rows[0]!.t}` });
    firstRow.focus();
    await user.keyboard('{Enter}');
    await user.click(screen.getByRole('button', { name: 'In orde' }));
    expect(resumed.state.response.judged).toEqual([1, 0]);
    expect(isComplete(inspect, resumed.state.response)).toBe(true);
    expect(resumed.state.locked).toBe(true);
    expect(screen.getByText('Alle zinnen zijn onderzocht; de drogredenen zijn hersteld.')).toBeVisible();
    for (const button of within(screen.getByRole('region', { name: 'Zinnen onderzoeken' })).getAllByRole('button')) expect(button).toBeDisabled();
  });

  it('schudt herstelkeuzes stabiel op de sessiesleutel en bewaart de juiste inhoudsindex', () => {
    const slopeOrders = new Set<string>();
    const inspectOrders = new Set<string>();
    let firstSlope = '';
    let firstInspect = '';
    for (const index of [0, 1, 2, 3, 4, 5, 6, 7, 0]) {
      const seed = `herstel:${index}`;
      const slopeView = renderStep(SlopeStep, slope, { kind: 'slope', judged: 2, tried: [], honest: false, mistakes: 0 }, seed);
      const slopeOrder = within(screen.getByRole('region', { name: 'De redenering herstellen' })).getAllByRole('button').map((button) => button.textContent).join('|');
      if (index === 0 && firstSlope) expect(slopeOrder).toBe(firstSlope);
      if (!firstSlope) firstSlope = slopeOrder;
      slopeOrders.add(slopeOrder);
      fireEvent.click(screen.getByRole('button', { name: slope.options[0]!.t }));
      expect(slopeView.state.response.honest).toBe(true);
      slopeView.unmount();
      const inspectView = renderStep(InspectStep, inspect, { kind: 'inspect', sel: 1, judged: [1], fixed: [], tried: [], mistakes: 0 }, seed);
      const inspectOrder = within(screen.getByRole('group', { name: 'Welke versie herstelt de redenering?' })).getAllByRole('button').map((button) => button.textContent).join('|');
      if (index === 0 && firstInspect) expect(inspectOrder).toBe(firstInspect);
      if (!firstInspect) firstInspect = inspectOrder;
      inspectOrders.add(inspectOrder);
      fireEvent.click(screen.getByRole('button', { name: 'Het voorstel noemt nog geen meetbaar succescriterium.' }));
      expect(inspectView.state.response.fixed).toEqual([1]);
      inspectView.unmount();
    }
    expect(slopeOrders.size).toBeGreaterThan(1);
    expect(inspectOrders.size).toBeGreaterThan(1);
  });

  it('blokkeert alle mutaties wanneer de player de nog onvoltooide stap vastzet', () => {
    const change = vi.fn();
    const response = initialResponse(slope);
    if (response.kind !== 'slope') throw new Error('Verkeerd antwoordtype');
    const props = { locked: true, correct: null, onChange: change, seed: 'locked', stepKey: 'locked', onSubmit: vi.fn() };
    const view = render(<SlopeStep step={slope} response={response} {...props} />);
    expect(screen.getByRole('button', { name: 'Volgt wel' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Volgt wel' }));
    expect(change).not.toHaveBeenCalled();
    view.unmount();
    const inspection = initialResponse(inspect);
    if (inspection.kind !== 'inspect') throw new Error('Verkeerd antwoordtype');
    render(<InspectStep step={inspect} response={{ ...inspection, sel: 0 }} {...props} />);
    for (const button of screen.getAllByRole('button')) expect(button).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'In orde' }));
    expect(change).not.toHaveBeenCalled();
  });
});
