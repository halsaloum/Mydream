import { render, screen } from '@testing-library/react';
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
    <ParadigmWidget
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
