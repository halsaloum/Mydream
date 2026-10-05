import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ModelWidget } from './model-widget';
import type { WidgetProps } from './widgets';

// jsdom heeft geen WebGL en geen canvas: het 3D-pakket en de confetti doen hier niet ter zake.
vi.mock('@google/model-viewer', () => ({}));
vi.mock('@/lib/confetti', () => ({ celebrate: vi.fn(), originOf: () => undefined }));

const FIETS: WidgetProps<'model'>['data'] = {
  q: 'Schrijf het onderdeel op',
  model: 'fiets',
  parts: [
    { id: 'stuur', at: [0, 1, 0.4], ask: 'Hiermee stuur je.', answer: 'het stuur', note: 'Het stuur.' },
    { id: 'band', at: [0, 0.3, 0.5], ask: 'band + pomp =', answer: 'bandenpomp', traps: [{ w: 'bandpomp', note: 'Meervoud banden.' }], note: 'Bandenpomp.' },
  ],
  note: 'Alles goed.',
};

function show() {
  const onSolved = vi.fn();
  function Harness() {
    const [solved, setSolved] = useState(false);
    return (
      <ModelWidget
        data={FIETS}
        solved={solved}
        onSolved={() => {
          onSolved();
          setSolved(true);
        }}
      />
    );
  }
  render(<Harness />);
  return onSolved;
}

describe('3D-model', () => {
  it('laat per onderdeel het woord typen, met tips, en meldt opgelost', async () => {
    const user = userEvent.setup();
    const onSolved = show();

    // Een stip op het model en een knop eronder doen hetzelfde.
    const knoppen = screen.getAllByRole('button', { name: 'Onderdeel 1' });
    expect(knoppen.length).toBeGreaterThanOrEqual(1);
    await user.click(knoppen.at(-1)!);
    const veld = await screen.findByLabelText(/Hiermee stuur je/);
    await user.type(veld, 'de stuur{Enter}');
    expect(screen.getByText(/lidwoord niet/)).toBeInTheDocument();
    await user.clear(veld);
    await user.type(veld, 'Het stuur{Enter}');
    expect(screen.getByRole('status')).toHaveTextContent('1 van 2 onderdelen goed, nog 1');
    expect(onSolved).not.toHaveBeenCalled();

    await user.click(screen.getAllByRole('button', { name: 'Onderdeel 2' }).at(-1)!);
    const pomp = await screen.findByLabelText(/band \+ pomp/);
    await user.type(pomp, 'bandpomp{Enter}');
    expect(screen.getByText('Meervoud banden.')).toBeInTheDocument();
    await user.clear(pomp);
    await user.type(pomp, 'bandenpomp');
    await user.click(screen.getByRole('button', { name: 'Controleer' }));
    expect(onSolved).toHaveBeenCalledOnce();
    expect(screen.getByRole('status')).toHaveTextContent('Alles goed.');
  });
});
