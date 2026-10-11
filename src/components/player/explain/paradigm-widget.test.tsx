import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ParadigmWidget } from './paradigm-widget';
import type { WidgetProps } from './widgets';

// jsdom heeft geen canvas; de confetti doet hier niet ter zake.
vi.mock('@/lib/confetti', () => ({ celebrate: vi.fn(), originOf: () => undefined }));

const STERK: WidgetProps<'paradigm'>['data'] = {
  cols: ['verleden tijd', 'voltooid deelwoord'],
  rows: [
    { label: 'rijden', cells: ['reed', { fill: 'gereden', hint: 'Reeks 1: ij, ee, ee.' }] },
    { label: 'lopen', cells: [{ fill: 'liep' }, 'gelopen'] },
  ],
  extra: ['geloopt'],
  note: 'Klaar.',
};

function Harness({ onSolved }: { onSolved: () => void }) {
  const [solved, setSolved] = useState(false);
  return (
    <ParadigmWidget seed="test"
      data={STERK}
      solved={solved}
      onSolved={() => {
        onSolved();
        setSolved(true);
      }}
    />
  );
}

describe('paradigma', () => {
  it('een verkeerde vorm geeft de tip; alle vakjes goed lost op', async () => {
    const user = userEvent.setup();
    const onSolved = vi.fn();
    render(<Harness onSolved={onSolved} />);

    expect(screen.getByRole('status')).toHaveTextContent('rijden, voltooid deelwoord');
    await user.click(screen.getByRole('button', { name: 'geloopt' }));
    expect(screen.getByRole('status')).toHaveTextContent('Reeks 1: ij, ee, ee.');

    await user.click(screen.getByRole('button', { name: 'gereden' }));
    expect(screen.getByRole('button', { name: 'rijden, voltooid deelwoord: gereden' })).toBeDisabled();
    expect(onSolved).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'geloopt' }));
    expect(screen.getByRole('status')).toHaveTextContent('geloopt past niet bij lopen, verleden tijd.');

    await user.click(screen.getByRole('button', { name: 'liep' }));
    expect(onSolved).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('Klaar.');
    expect(screen.queryByRole('list', { name: 'Vormen om te kiezen' })).not.toBeInTheDocument();
  });
});

/** Een grotere tabel zoals in de lessen: de antwoorden in tabelvolgorde, de valkuilen achteraan. */
const ZWAK: WidgetProps<'paradigm'>['data'] = {
  cols: ['verleden tijd', 'voltooid deelwoord'],
  rows: [
    { label: 'werken', cells: [{ fill: 'werkte' }, { fill: 'gewerkt' }] },
    { label: 'fietsen', cells: [{ fill: 'fietste' }, { fill: 'gefietst' }] },
    { label: 'reizen', cells: [{ fill: 'reisde' }, { fill: 'gereisd' }] },
  ],
  extra: ['werkde', 'gefietsd', 'reiste'],
  note: 'Klaar.',
};

const bank = (seed: string) => {
  const { unmount } = render(<ParadigmWidget seed={seed} data={ZWAK} solved={false} onSolved={() => {}} />);
  const forms = within(screen.getByRole('list', { name: 'Vormen om te kiezen' }))
    .getAllByRole('button')
    .map((button) => button.textContent);
  unmount();
  return forms;
};

describe('paradigma: volgorde van de keuzes', () => {
  const inhoud = ['werkte', 'gewerkt', 'fietste', 'gefietst', 'reisde', 'gereisd', 'werkde', 'gefietsd', 'reiste'];

  it('schudt de vormen met de schudsleutel: vast per sleutel, anders bij een nieuwe ronde', () => {
    const a = bank('ronde-1');
    expect([...a].sort()).toEqual([...inhoud].sort());
    expect(bank('ronde-1')).toEqual(a);
    expect(bank('ronde-2')).not.toEqual(a);
  });

  it('het antwoord voor het eerste vakje staat niet steeds vooraan', () => {
    const plekken = new Set(Array.from({ length: 12 }, (_, i) => bank(`ronde-${i}`).indexOf('werkte')));
    expect(plekken.size).toBeGreaterThan(3);
    expect(Array.from({ length: 12 }, (_, i) => bank(`ronde-${i}`)).some((forms) => forms.join() === inhoud.join())).toBe(false);
  });
});
