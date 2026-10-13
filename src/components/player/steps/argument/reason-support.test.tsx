import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { StepOf } from '@/content/schema';
import { evaluate, isComplete } from '@/engine/grade';
import { ResponseSchema, responseFits } from '@/engine/responses';
import { renderStep } from '../test-utils';
import { ReasonStep } from './reason';
import { SupportStep } from './support';

const reason: StepOf<'reason'> = {
  kind: 'reason', prompt: 'Verbind standpunt en argument.',
  pairs: [
    {
      claim: { lead: 'We moeten de route aanpassen', mid: 'we moeten de route aanpassen' },
      reason: { lead: 'De brug is afgesloten', mid: 'de brug is afgesloten' },
      bad: 'De afgesloten brug is de reden om de route aan te passen, niet het gevolg daarvan.',
      start: { top: 'claim', word: 'dus' },
    },
    {
      claim: { lead: 'Neem een jas mee', mid: 'neem een jas mee' },
      reason: { lead: 'Het wordt koud', mid: 'het wordt koud' },
      bad: 'Het weer is een reden om een jas mee te nemen; jouw jas bepaalt het weer niet.',
      start: { top: 'reason', word: 'want' },
    },
  ],
};

const support: StepOf<'support'> = {
  kind: 'support', prompt: 'Bouw een onderbouwing op.', claim: 'Houd de bibliotheek langer open.',
  levels: [
    {
      ask: 'Waarom zou langer openen helpen?',
      options: [
        { t: 'Werkenden kunnen dan na hun werk boeken lenen.', ok: true, role: 'argument', text: 'Werkenden krijgen na hun werk toegang.', why: 'Deze reden legt uit voor wie de extra openingstijd nuttig is.' },
        { t: 'De bibliotheek moet langer open omdat zij eerder sluit.', trap: 'cirkelredenering', why: 'Dit herhaalt alleen dat de bibliotheek nu eerder sluit; je noemt nog geen voordeel.' },
        { t: 'Iedereen die dat niet wil, is lui.', trap: 'persoonlijke aanval', why: 'Een belediging toont niet aan waarom extra openingstijd helpt.' },
      ],
    },
    {
      ask: 'Welk gegeven ondersteunt die behoefte?',
      options: [
        { t: 'Bij een proef kwamen 24 werkenden na 18 uur.', ok: true, role: 'feit', text: 'Tijdens de proef kwamen 24 werkenden na 18 uur.', why: 'Dit gegeven laat zien dat werkenden van die mogelijkheid gebruikmaakten.' },
        { t: 'Mijn buurman leest nooit.', trap: 'niet relevant', why: 'Dat één buurman niet leest, vertelt niets over de behoefte van andere werkenden.' },
      ],
    },
  ],
  paragraph: 'Houd de bibliotheek langer open. Werkenden krijgen na hun werk toegang. Tijdens de proef kwamen 24 werkenden na 18 uur.',
};

describe('standpunt en argument verbinden', () => {
  it('laat fouten herstellen en vereist beide verbindingen van ieder paar', async () => {
    const user = userEvent.setup();
    const { state } = renderStep(ReasonStep, reason);

    await user.click(screen.getByRole('button', { name: 'Controleer de verbinding' }));
    expect(state.response.mistakes).toBe(1);
    expect(state.response.found).toEqual([]);
    await waitFor(() => expect(screen.getByText(reason.pairs[0]!.bad)).toBeVisible());
    expect(screen.queryByRole('button', { name: 'Volgend zinnenpaar' })).not.toBeInTheDocument();
    expect(isComplete(reason, state.response)).toBe(false);

    await user.click(screen.getByRole('radio', { name: 'want' }));
    await user.click(screen.getByRole('button', { name: 'Controleer de verbinding' }));
    expect(state.response.found).toEqual(['want']);
    expect(state.locked).toBe(false);
    expect(screen.queryByRole('button', { name: 'Volgend zinnenpaar' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Controleer de verbinding' }));
    expect(state.response.found).toEqual(['want']);
    expect(state.response.mistakes).toBe(1);
    await waitFor(() => expect(screen.getByText(/Die had je al/)).toBeVisible());

    await user.click(screen.getByRole('radio', { name: 'dus' }));
    const swap = screen.getByRole('button', { name: 'Wissel de zinnen' });
    swap.focus();
    await user.keyboard('{Enter}');
    expect(state.response.top).toBe('reason');
    await user.click(screen.getByRole('button', { name: 'Controleer de verbinding' }));
    expect(state.response.found).toEqual(['want', 'dus']);
    expect(screen.getByRole('region', { name: 'De twee kloppende versies' })).toBeVisible();
    expect(state.locked).toBe(false);
    expect(isComplete(reason, state.response)).toBe(false);

    await user.click(screen.getByRole('button', { name: 'Volgend zinnenpaar' }));
    expect(state.response).toMatchObject({ pair: 1, found: [], mistakes: 1 });
    expect(screen.getByRole('heading', { name: 'Paar 2 van 2' })).toHaveFocus();
    await user.click(screen.getByRole('radio', { name: 'dus' }));
    await user.click(screen.getByRole('button', { name: 'Controleer de verbinding' }));
    expect(state.locked).toBe(false);
    await user.click(screen.getByRole('button', { name: 'Wissel de zinnen' }));
    await user.click(screen.getByRole('radio', { name: 'want' }));
    await user.click(screen.getByRole('button', { name: 'Controleer de verbinding' }));
    expect(isComplete(reason, state.response)).toBe(true);
    expect(state.locked).toBe(true);
    expect(state.correct).toBe(false);
    expect(evaluate(reason, state.response)).toMatchObject({ review: 'miss', score: 0.8 });
    expect(screen.getByRole('button', { name: 'Wissel de zinnen' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: 'dus' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('hervat de gevonden verbinding en bewaart fouten na een JSON-rondreis', async () => {
    const user = userEvent.setup();
    const first = renderStep(ReasonStep, reason);
    await user.click(screen.getByRole('button', { name: 'Controleer de verbinding' }));
    await user.click(screen.getByRole('radio', { name: 'want' }));
    await user.click(screen.getByRole('button', { name: 'Controleer de verbinding' }));
    const saved = ResponseSchema.parse(JSON.parse(JSON.stringify(first.state.response)));
    if (saved.kind !== 'reason') throw new Error('Verkeerd reactietype');
    expect(responseFits(reason, saved)).toBe(true);
    first.unmount();

    const resumed = renderStep(ReasonStep, reason, saved);
    expect(screen.getByText('Met want: gevonden')).toBeVisible();
    expect(screen.getByText('Met dus: nog te maken')).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Volgend zinnenpaar' })).not.toBeInTheDocument();
    expect(resumed.state.response.mistakes).toBe(1);
    await user.click(screen.getByRole('radio', { name: 'dus' }));
    await user.click(screen.getByRole('button', { name: 'Wissel de zinnen' }));
    await user.click(screen.getByRole('button', { name: 'Controleer de verbinding' }));
    expect(screen.getByRole('button', { name: 'Volgend zinnenpaar' })).toBeEnabled();
    expect(resumed.state.response.mistakes).toBe(1);
  });

  it('wijzigt een vergrendeld paar niet', () => {
    const onChange = vi.fn();
    render(<ReasonStep step={reason} response={{ kind: 'reason', pair: 0, top: 'claim', word: 'want', found: [], mistakes: 0 }} locked correct={false} seed="locked" stepKey="reason" onChange={onChange} onSubmit={vi.fn()} />);
    const swap = screen.getByRole('button', { name: 'Wissel de zinnen' });
    const check = screen.getByRole('button', { name: 'Controleer de verbinding' });
    expect(swap).toBeDisabled();
    expect(check).toBeDisabled();
    const radio = screen.getByRole('radio', { name: 'dus' });
    expect(radio).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(swap);
    fireEvent.click(check);
    fireEvent.click(radio);
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('een onderbouwing opbouwen', () => {
  it('voegt alleen passende antwoorden toe en voltooit pas na alle vragen', async () => {
    const user = userEvent.setup();
    const { state } = renderStep(SupportStep, support);
    const built = () => within(screen.getByRole('list', { name: 'Opgebouwde redenering' }));
    expect(built().getAllByRole('listitem')).toHaveLength(1);
    expect(screen.queryByRole('heading', { name: support.levels[1]!.ask })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: support.levels[0]!.options[1]!.t }));
    expect(state.response).toMatchObject({ level: 0, tried: [1], mistakes: 1 });
    await waitFor(() => expect(screen.getByText(support.levels[0]!.options[1]!.why)).toBeVisible());
    expect(built().getAllByRole('listitem')).toHaveLength(1);
    const tried = screen.getByRole('button', { name: /De bibliotheek moet langer open/ });
    expect(tried).toBeDisabled();
    fireEvent.click(tried);
    expect(state.response.mistakes).toBe(1);
    expect(isComplete(support, state.response)).toBe(false);

    await user.click(screen.getByRole('button', { name: support.levels[0]!.options[0]!.t }));
    expect(state.response).toMatchObject({ level: 1, tried: [], mistakes: 1 });
    expect(built().getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('heading', { name: support.levels[1]!.ask })).toHaveFocus();
    expect(state.locked).toBe(false);
    const answer = screen.getByRole('button', { name: support.levels[1]!.options[0]!.t });
    answer.focus();
    await user.keyboard('{Enter}');
    expect(isComplete(support, state.response)).toBe(true);
    expect(state.locked).toBe(true);
    expect(state.correct).toBe(false);
    expect(built().getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByRole('heading', { name: 'Je onderbouwing is opgebouwd' })).toHaveFocus();
    expect(within(screen.getByRole('region', { name: 'Afgeronde onderbouwing' })).getByText(support.paragraph!)).toBeVisible();
    expect(screen.queryByRole('button', { name: support.levels[1]!.options[1]!.t })).not.toBeInTheDocument();
  });

  it('hervat de opgebouwde redenering, onthoudt pogingen en houdt de keuzes op dezelfde plek', async () => {
    const user = userEvent.setup();
    const first = renderStep(SupportStep, support, undefined, 'saved:session');
    await user.click(screen.getByRole('button', { name: support.levels[0]!.options[0]!.t }));
    await user.click(screen.getByRole('button', { name: support.levels[1]!.options[1]!.t }));
    const options = () => within(screen.getByRole('region', { name: 'Onderbouwing vraag 2' })).getAllByRole('button').map((button) => button.textContent);
    const order = options();
    const saved = ResponseSchema.parse(JSON.parse(JSON.stringify(first.state.response)));
    if (saved.kind !== 'support') throw new Error('Verkeerd reactietype');
    expect(responseFits(support, saved)).toBe(true);
    first.unmount();

    const resumed = renderStep(SupportStep, support, saved, 'saved:session');
    expect(options()).toEqual(order);
    expect(screen.getByText('Werkenden krijgen na hun werk toegang.')).toBeVisible();
    expect(screen.getByRole('button', { name: /Mijn buurman leest nooit/ })).toBeDisabled();
    await waitFor(() => expect(screen.getByText(support.levels[1]!.options[1]!.why)).toBeVisible());
    await user.click(screen.getByRole('button', { name: support.levels[1]!.options[0]!.t }));
    expect(resumed.state.response).toMatchObject({ level: 2, mistakes: 1 });
    expect(resumed.state.locked).toBe(true);
  });

  it('varieert de antwoordpositie tussen sessies en verandert niets wanneer vergrendeld', () => {
    const firstAnswers = Array.from({ length: 10 }, (_, i) => {
      const view = renderStep(SupportStep, support, undefined, `session:${i}`);
      const choices = within(screen.getByRole('region', { name: 'Onderbouwing vraag 1' })).getAllByRole('button');
      const first = choices[0]!.textContent;
      view.unmount();
      return first;
    });
    expect(new Set(firstAnswers).size).toBeGreaterThan(1);

    const onChange = vi.fn();
    render(<SupportStep step={support} response={{ kind: 'support', level: 0, tried: [], mistakes: 0 }} locked correct={false} seed="locked" stepKey="support" onChange={onChange} onSubmit={vi.fn()} />);
    const choice = screen.getByRole('button', { name: support.levels[0]!.options[0]!.t });
    expect(choice).toBeDisabled();
    fireEvent.click(choice);
    expect(onChange).not.toHaveBeenCalled();
  });
});
