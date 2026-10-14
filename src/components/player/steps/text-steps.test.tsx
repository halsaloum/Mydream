import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { StepOf } from '@/content/schema';
import { renderStep } from './test-utils';
import { RewriteStep, TypeStep } from './text-steps';

const typed: StepOf<'type'> = { kind: 'type', prompt: 'Typ het meervoud.', before: 'Eén laan, twee', after: '.', hint: 'Verdeel het woord eerst in lettergrepen.', answer: 'lanen', why: 'Een open lettergreep houdt één a.' };

describe('zelf ophalen vóór ondersteuning', () => {
  it('toont de aanwijzing pas na een bewuste keuze en laat het antwoord nog zelf typen', async () => {
    const user = userEvent.setup();
    const view = renderStep(TypeStep, typed);
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', '…');
    expect(screen.queryByText(typed.hint)).not.toBeInTheDocument();
    const help = screen.getByRole('button', { name: 'Bekijk een aanwijzing' });
    help.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByText(typed.hint)).toBeVisible();
    expect(screen.getByRole('button', { name: 'Verberg aanwijzing' })).toHaveAttribute('aria-expanded', 'true');
    expect(view.state.response.value).toBe('');
    await user.click(screen.getByRole('textbox'));
    await user.keyboard('lanen{Enter}');
    expect(view.state.correct).toBe(true);
  });

  it('begint een herhaalvraag zonder de oude aanwijzing, ook na verversen', () => {
    renderStep(TypeStep, typed, undefined, 'herhalen', 'retrieval');
    expect(screen.queryByRole('button', { name: /aanwijzing/ })).not.toBeInTheDocument();
    expect(screen.queryByText(typed.hint)).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', '…');
  });

  it('geeft een authored hint die letterlijk het antwoord is niet weg', () => {
    renderStep(TypeStep, { ...typed, hint: 'LANEN' });
    expect(screen.queryByRole('button', { name: /aanwijzing/ })).not.toBeInTheDocument();
    expect(screen.queryByText('LANEN')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', '…');
  });

  it('maakt een strikte gemengde spelling- en hoofdletteropdracht vooraf duidelijk', () => {
    const step: StepOf<'rewrite'> = { kind: 'rewrite', prompt: 'Verbeter de spelling en hoofdletters.', source: 'noor fietsd.', accept: ['Noor fietst.'], why: 'Eigennaam en persoonsvorm.', strict: true };
    renderStep(RewriteStep, step);
    expect(screen.getByText('Let op: hoofdletters en leestekens tellen bij deze opdracht mee.')).toBeVisible();
  });
});
