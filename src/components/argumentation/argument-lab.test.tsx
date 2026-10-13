import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ArgumentLabView } from './argument-lab';

vi.mock('next/dynamic', () => ({ default: () => () => <div data-testid="canvas-enhancement" /> }));
vi.mock('@/lib/motion', () => ({ useCalmMotion: () => true }));

function commitBayesPrediction(option = 'Minder dan 25%') {
  const challenge = within(screen.getByRole('region', { name: 'Schat de kans vóór je de uitkomst ziet' }));
  fireEvent.click(challenge.getByRole('radio', { name: option }));
  fireEvent.click(challenge.getByRole('button', { name: 'Leg mijn voorspelling vast' }));
}

describe('accessible argument laboratories without a canvas', () => {
  it('keeps the structure experiment fully usable with native DOM controls', () => {
    render(<ArgumentLabView kind="structure" />);
    fireEvent.click(screen.getByRole('checkbox', { name: /^Reden 2/ }));
    expect(screen.getByText('De gezamenlijke route is onderbroken')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Zelfstandige redenen' }));
    expect(screen.getByText('1 zelfstandige ondersteuningsroute')).toBeVisible();
    fireEvent.click(screen.getByRole('checkbox', { name: /^Een bezwaar toevoegen/ }));
    expect(screen.getByText('Ondersteund, maar aanvechtbaar')).toBeVisible();
    expect(screen.getByText('Deze video moet ondertiteling krijgen.')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Herstel begininstellingen' }));
    expect(screen.getByText('Eén gezamenlijke ondersteuningsroute')).toBeVisible();
  });

  it('shows frequencies and conditional rates even when the graph is unavailable', () => {
    render(<ArgumentLabView kind="causality" />);
    expect(screen.getByText('36%')).toBeVisible();
    expect(screen.getByText('74%')).toBeVisible();
    expect(screen.getAllByText('+10 pp')).toHaveLength(2);
    const slider = screen.getByRole('slider', { name: 'Veel ervaring in de trainingsgroep' });
    fireEvent.click(screen.getByRole('checkbox', { name: /^Vergelijk gelijke groepsverdelingen/ }));
    expect(slider).toBeDisabled();
    expect(screen.getByText('60%')).toBeVisible();
    expect(screen.getAllByText('50%').every((element) => element.textContent === '50%')).toBe(true);
    expect(screen.getByRole('table', { name: 'Dezelfde data, uitgesplitst naar ervaring' })).toBeVisible();
  });

  it('updates the posterior through labelled sliders and restores the starting values', () => {
    render(<ArgumentLabView kind="bayes" />);
    expect(screen.queryByText('15,4%')).not.toBeInTheDocument();
    commitBayesPrediction();
    expect(screen.getByText('15,4%')).toBeVisible();
    fireEvent.change(screen.getByRole('slider', { name: 'Basisfrequentie: spam' }), { target: { value: '20' } });
    expect(screen.queryByText('81,8%')).not.toBeInTheDocument();
    commitBayesPrediction('Van 75% tot en met 100%');
    expect(screen.getByText('81,8%')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: '1.000' }));
    commitBayesPrediction('Van 75% tot en met 100%');
    expect(screen.getByText('81,8%')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Herstel begininstellingen' }));
    expect(screen.queryByText('15,4%')).not.toBeInTheDocument();
    commitBayesPrediction();
    expect(screen.getByText('15,4%')).toBeVisible();
  });

  it('does not present rare expected positives as impossible events', () => {
    render(<ArgumentLabView kind="bayes" />);
    fireEvent.click(screen.getByRole('button', { name: '1.000' }));
    fireEvent.change(screen.getByRole('slider', { name: 'Basisfrequentie: spam' }), { target: { value: '0.1' } });
    fireEvent.change(screen.getByRole('slider', { name: 'Sensitiviteit' }), { target: { value: '1' } });
    commitBayesPrediction();
    expect(screen.getByText('0,01')).toBeVisible();
    expect(screen.getByText('<0,1%')).toBeVisible();
  });

  it('requires a committed prediction before showing feedback and clears it on retry', () => {
    render(<ArgumentLabView kind="structure" />);
    const challenge = within(screen.getByRole('region', { name: 'Wat volgt als één dragende reden wegvalt?' }));
    const commit = challenge.getByRole('button', { name: 'Leg mijn voorspelling vast' });
    expect(commit).toBeDisabled();
    expect(challenge.queryByText('De onderliggende redenering:')).not.toBeInTheDocument();
    fireEvent.click(challenge.getByRole('radio', { name: /^De conclusie is daarmee weerlegd/ }));
    fireEvent.change(challenge.getByRole('textbox', { name: /Mijn redenering/ }), { target: { value: 'Ik denk dat een ontbrekende reden een verkeerde conclusie oplevert.' } });
    expect(challenge.queryByText('De onderliggende redenering:')).not.toBeInTheDocument();
    fireEvent.click(commit);
    expect(challenge.getByText(/Je verwart kritiek op een argument/)).toBeVisible();
    expect(challenge.getByText('De onderliggende redenering:')).toBeVisible();
    expect(challenge.getByRole('status')).toHaveFocus();
    expect(challenge.getByRole('radio', { name: /^De conclusie is daarmee weerlegd/ })).toBeDisabled();
    fireEvent.click(challenge.getByRole('button', { name: 'Voorspel opnieuw' }));
    expect(challenge.queryByText('De onderliggende redenering:')).not.toBeInTheDocument();
    expect(challenge.getByRole('textbox', { name: /Mijn redenering/ })).toHaveValue('');
    expect(challenge.getByRole('button', { name: 'Leg mijn voorspelling vast' })).toBeDisabled();
    expect(challenge.getAllByRole('radio').every((radio) => !(radio as HTMLInputElement).checked)).toBe(true);
    expect(challenge.getAllByRole('radio')[0]).toHaveFocus();
  });

  it('relocks the Bayes result on retry while preserving a separate investigation note', () => {
    render(<ArgumentLabView kind="bayes" />);
    const note = screen.getByRole('textbox', { name: 'Wat veranderde ik en wat verklaart mijn waarneming?' });
    fireEvent.change(note, { target: { value: 'Ik wil de fout-positieve groep verkleinen.' } });
    commitBayesPrediction();
    expect(screen.getByText('15,4%')).toBeVisible();
    const challenge = within(screen.getByRole('region', { name: 'Schat de kans vóór je de uitkomst ziet' }));
    fireEvent.click(challenge.getByRole('button', { name: 'Voorspel opnieuw' }));
    expect(screen.queryByText('15,4%')).not.toBeInTheDocument();
    expect(note).toHaveValue('Ik wil de fout-positieve groep verkleinen.');
    expect(screen.queryByTestId('canvas-enhancement')).not.toBeInTheDocument();
  });

  it('runs the proposed balanced comparison only after commitment', () => {
    render(<ArgumentLabView kind="causality" />);
    const challenge = within(screen.getByRole('region', { name: 'Voorspel een gelijke vergelijking' }));
    expect(screen.getByRole('checkbox', { name: /^Vergelijk gelijke groepsverdelingen/ })).not.toBeChecked();
    fireEvent.click(challenge.getByRole('radio', { name: /^50% tegenover 50%/ }));
    expect(screen.getByRole('checkbox', { name: /^Vergelijk gelijke groepsverdelingen/ })).not.toBeChecked();
    fireEvent.click(challenge.getByRole('button', { name: 'Leg mijn voorspelling vast' }));
    expect(screen.getByRole('checkbox', { name: /^Vergelijk gelijke groepsverdelingen/ })).toBeChecked();
    expect(challenge.getByText(/Gelijke samenstelling verwijdert het compositieverschil/)).toBeVisible();
    expect(screen.getByText('60%')).toBeVisible();
  });
});
