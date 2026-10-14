import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { StepOf } from '@/content/schema';
import { RecallStep } from './recall';

const props = {
  response: { kind: 'recall' as const, value: '' },
  onChange: vi.fn(), locked: false, correct: false, stepKey: 'words:audit', seed: 'audit', onSubmit: vi.fn(),
};

describe('blinde ruimte om een woord op te halen', () => {
  it('verraadt de lengte van het antwoord niet via de breedte van een leeg veld', () => {
    const step: StepOf<'recall'> = { kind: 'recall', prompt: 'Haal het geleerde woord op.', clue: 'Een omschrijving', before: 'Het woord is', after: '.', word: 'doelwoord', answers: ['kort'], why: 'Uitleg na het antwoord.' };
    const view = render(<RecallStep {...props} step={step} />);
    const width = screen.getByRole('textbox').style.width;
    view.rerender(<RecallStep {...props} step={{ ...step, answers: ['een uitzonderlijk lange uitdrukking'] }} />);
    expect(screen.getByRole('textbox').style.width).toBe(width);
    expect(screen.queryByText('een uitzonderlijk lange uitdrukking')).not.toBeInTheDocument();
  });

  it('toont na een nagekeken fout de correctie en maakt het veld alleen-lezen', () => {
    const step: StepOf<'recall'> = { kind: 'recall', prompt: 'Haal het geleerde woord op.', clue: 'Een omschrijving', before: 'Het woord is', after: '.', word: 'doelwoord', answers: ['draagvlak'], why: 'Uitleg na het antwoord.' };
    render(<RecallStep {...props} step={step} response={{ kind: 'recall', value: 'onjuist' }} locked />);
    expect(screen.getByText('draagvlak')).toBeVisible();
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
  });
});
