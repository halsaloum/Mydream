import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { StepOf } from '@/content/schema';
import { isComplete } from '@/engine/grade';
import { ResponseSchema, responseFits } from '@/engine/responses';
import { renderStep } from '../test-utils';
import { EvidenceStep } from './evidence';
import { RebutStep } from './rebut';

const evidence: StepOf<'evidence'> = {
  kind: 'evidence', prompt: 'Stem de conclusie op het bewijs af.',
  rows: [
    {
      before: '', after: ' deelnemers zijn voor.', evidence: 'Alle tien deelnemers zijn bevraagd; zeven zijn voor.',
      total: 10, known: 7, max: 'alle tien deelnemers', best: 1, start: 2,
      options: [
        { w: 'Sommige', need: 1, says: 'ten minste één', why: 'Dat is waar, maar de gegevens laten ook een meerderheid zien.' },
        { w: 'De meeste', need: 6, says: 'meer dan de helft', why: 'Zeven van de tien is meer dan de helft.' },
        { w: 'Alle', need: 10, says: 'iedere deelnemer', why: 'Drie deelnemers zijn niet voor.' },
      ],
    },
    {
      before: 'De bus reed ', after: ' op tijd.', evidence: 'Alle vijf onderzochte ritten waren op tijd.',
      total: 5, known: 5, max: 'alle vijf ritten', best: 1, start: 0,
      options: [
        { w: 'soms', need: 1, says: 'ten minste één rit', why: 'De gegevens ondersteunen een uitspraak over alle onderzochte ritten.' },
        { w: 'op alle onderzochte ritten', need: 5, says: 'alle vijf onderzochte ritten', why: 'Alle vijf ritten voldeden; dit zegt niets over niet onderzochte ritten.' },
      ],
    },
  ],
};

const rebut: StepOf<'rebut'> = {
  kind: 'rebut', prompt: 'Beantwoord de bezwaren.',
  base: 'We willen zaterdag een extra taalles aanbieden.', speaker: { name: 'Noor', role: 'je collega' },
  rounds: [
    {
      objection: 'Maar het lokaal is op zaterdag bezet.',
      options: [
        { t: 'Jij klaagt altijd.', trap: 'persoonlijke aanval', why: 'De beschikbaarheid van het lokaal is nog niet opgelost.' },
        { t: 'Dat lokaal is inderdaad bezet. We kunnen het vrije lokaal ernaast gebruiken.', ok: true, concede: 'Dat lokaal is inderdaad bezet.', rebut: 'We kunnen het vrije lokaal ernaast gebruiken.', why: 'Je erkent het ruimteprobleem en biedt een passend alternatief.' },
      ],
    },
    {
      objection: 'Maar niet iedereen kan op zaterdag.',
      options: [
        { t: 'Dat klopt. Daarom behouden we ook de les op maandag.', ok: true, concede: 'Dat klopt.', rebut: 'Daarom behouden we ook de les op maandag.', why: 'Het voorstel houdt rekening met deelnemers die zaterdag niet kunnen.' },
        { t: 'Iedereen vindt zaterdag leuk.', trap: 'ongefundeerde generalisatie', why: 'Je beweert zonder bewijs dat iedereen hetzelfde wil.' },
      ],
    },
  ],
  reply: 'Met beide mogelijkheden kan ik instemmen.',
};

describe('bewijs afstemmen', () => {
  it('onderscheidt een te sterke claim, een voorzichtige claim en de sterkste gedekte claim', async () => {
    const user = userEvent.setup();
    const { state } = renderStep(EvidenceStep, evidence);
    expect(screen.getByText('Te stellig voor deze gegevens.')).toBeVisible();
    expect(screen.getByRole('meter', { name: 'Bekend uit de gegevens' })).toHaveAttribute('aria-valuenow', '7');

    await user.click(screen.getByRole('button', { name: 'Sommige' }));
    expect(await screen.findByText('Klopt, maar kan preciezer.')).toBeInTheDocument();
    expect(state.locked).toBe(false);

    await user.click(screen.getByRole('button', { name: 'De meeste' }));
    expect(await screen.findByText('Past bij de gegevens.')).toBeInTheDocument();
    expect(state.response.pick).toEqual([1, 0]);
    expect(state.locked).toBe(false);

    await user.click(screen.getByRole('button', { name: 'Zin 2 bewerken' }));
    const strongest = screen.getByRole('button', { name: 'op alle onderzochte ritten' });
    strongest.focus();
    await user.keyboard('{Enter}');
    expect(state.response.pick).toEqual([1, 1]);
    expect(isComplete(evidence, state.response)).toBe(true);
    expect(state.locked).toBe(true);
    expect(strongest).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Zin 1 bewerken' })).toBeDisabled();
  });

  it('hervat de gekozen zin en woorden uit de bewaarde reactie', () => {
    const response = ResponseSchema.parse({ kind: 'evidence', sel: 1, pick: [1, 0] });
    if (response.kind !== 'evidence') throw new Error('Verkeerd reactietype');
    expect(responseFits(evidence, response)).toBe(true);
    const { state } = renderStep(EvidenceStep, evidence, response);
    expect(screen.getByRole('heading', { name: 'Onderzoek zin 2' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'soms' })).toHaveAttribute('aria-pressed', 'true');
    expect(state.response.pick).toEqual([1, 0]);
  });
});

describe('weerleggen met erkenning', () => {
  it('laat een fout herstellen, hervat het gesprek en rondt alle bezwaren af', async () => {
    const user = userEvent.setup();
    const first = renderStep(RebutStep, rebut);
    await user.click(screen.getByRole('button', { name: 'Jij klaagt altijd.' }));
    expect(screen.getByText('persoonlijke aanval.')).toBeVisible();
    expect(first.state.response.round).toBe(0);
    expect(first.state.response.mistakes).toBe(1);
    expect(screen.getByRole('button', { name: 'Jij klaagt altijd.' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Jij klaagt altijd.' }));
    expect(first.state.response.mistakes).toBe(1);

    await user.click(screen.getByRole('button', { name: 'Dat lokaal is inderdaad bezet. We kunnen het vrije lokaal ernaast gebruiken.' }));
    expect(first.state.response.round).toBe(1);
    expect(first.state.response.tried).toEqual([]);
    expect(screen.getByRole('heading', { name: 'Maar niet iedereen kan op zaterdag.' })).toHaveFocus();
    const saved = ResponseSchema.parse(JSON.parse(JSON.stringify(first.state.response)));
    if (saved.kind !== 'rebut') throw new Error('Verkeerd reactietype');
    expect(responseFits(rebut, saved)).toBe(true);
    first.unmount();

    const second = renderStep(RebutStep, rebut, saved);
    expect(screen.getByText('Dat lokaal is inderdaad bezet.')).toBeVisible();
    expect(screen.getByText('We kunnen het vrije lokaal ernaast gebruiken.')).toBeVisible();
    const answer = screen.getByRole('button', { name: 'Dat klopt. Daarom behouden we ook de les op maandag.' });
    answer.focus();
    await user.keyboard(' ');
    expect(second.state.response.round).toBe(2);
    expect(second.state.response.mistakes).toBe(1);
    expect(isComplete(rebut, second.state.response)).toBe(true);
    expect(second.state.locked).toBe(true);
    expect(screen.getByText('Met beide mogelijkheden kan ik instemmen.')).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Iedereen vindt zaterdag leuk.' })).not.toBeInTheDocument();
  });

  it('bewaart foutenfeedback na hervatten en verandert een vergrendelde reactie niet', () => {
    const onChange = vi.fn();
    render(<RebutStep step={rebut} response={{ kind: 'rebut', round: 0, tried: [0], mistakes: 1 }} locked correct={false} seed="saved" stepKey="rebut" onChange={onChange} onSubmit={vi.fn()} />);
    expect(screen.getByText('persoonlijke aanval.')).toBeVisible();
    const good = screen.getByRole('button', { name: 'Dat lokaal is inderdaad bezet. We kunnen het vrije lokaal ernaast gebruiken.' });
    expect(good).toBeDisabled();
    fireEvent.click(good);
    expect(onChange).not.toHaveBeenCalled();
  });
});
