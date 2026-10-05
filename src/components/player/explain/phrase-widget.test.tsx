import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { PhraseWidget } from './phrase-widget';
import type { WidgetProps } from './widgets';

// jsdom heeft geen canvas; de confetti doet hier niet ter zake.
vi.mock('@/lib/confetti', () => ({ celebrate: vi.fn(), originOf: () => undefined }));

const BUURMAN: WidgetProps<'phrase'>['data'] = {
  q: 'Vind de twee naamwoordgroepen',
  sentence: 'De oude buurman zwaait naar de bakker.',
  groups: [
    { span: [0, 2], cat: 'naamwoordgroep', head: 2, note: 'Kern buurman.' },
    { span: [5, 6], cat: 'naamwoordgroep', head: 6, note: 'Hoort bij naar.' },
  ],
  traps: [{ span: [1, 3], note: 'oude buurman zwaait loopt over de grens van de groep.' }],
  note: 'Klaar.',
};

function Harness({ onSolved }: { onSolved: () => void }) {
  const [solved, setSolved] = useState(false);
  return (
    <PhraseWidget
      data={BUURMAN}
      solved={solved}
      onSolved={() => {
        onSolved();
        setSolved(true);
      }}
    />
  );
}

describe('groepenjager', () => {
  it('een val legt uit; twee tikken per groep vinden alle groepen', async () => {
    const user = userEvent.setup();
    const onSolved = vi.fn();
    render(<Harness onSolved={onSolved} />);

    await user.click(screen.getByRole('button', { name: 'oude' }));
    expect(screen.getByRole('button', { name: 'oude' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'zwaait' }));
    expect(screen.getByRole('status')).toHaveTextContent('loopt over de grens van de groep');
    expect(screen.queryByRole('list', { name: 'Gevonden groepen' })).not.toBeInTheDocument();

    // Van achter naar voor tikken mag ook.
    await user.click(screen.getByRole('button', { name: 'buurman' }));
    await user.click(screen.getByRole('button', { name: 'De' }));
    expect(screen.getByRole('status')).toHaveTextContent('[De oude buurman] · naamwoordgroep · kern: buurman. Kern buurman.');
    expect(onSolved).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'de' }));
    await user.click(screen.getByRole('button', { name: 'bakker.' }));
    expect(onSolved).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('Klaar.');
    expect(screen.getByRole('list', { name: 'Gevonden groepen' })).toHaveTextContent('[de bakker]');
  });
});
