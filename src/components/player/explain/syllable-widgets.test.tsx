import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SonorityWidget, TreeWidget } from './syllable-widgets';
import type { WidgetProps } from './widgets';

// jsdom heeft geen canvas; de confetti doet hier niet ter zake.
vi.mock('@/lib/confetti', () => ({ celebrate: vi.fn(), originOf: () => undefined }));

/** Rendert een experiment zoals de uitlegstap: "opgelost" blijft staan zodra het experiment het meldt. */
function show(widget: (solved: boolean, onSolved: () => void) => ReactNode) {
  const onSolved = vi.fn();
  function Harness() {
    const [solved, setSolved] = useState(false);
    return widget(solved, () => {
      onSolved();
      setSolved(true);
    });
  }
  render(<Harness />);
  return onSolved;
}

const ZEBRA: WidgetProps<'sonority'>['data'] = {
  segs: [
    { t: 'z', s: 2 },
    { t: 'e', s: 6 },
    { t: 'b', s: 1 },
    { t: 'r', s: 4 },
    { t: 'a', s: 6 },
  ],
  cuts: [2],
  note: 'br klimt naar de a.',
};

const HERFST: WidgetProps<'tree'>['data'] = {
  segs: [
    { t: 'h', role: 'onset' },
    { t: 'e', role: 'kern' },
    { t: 'r', role: 'coda' },
    { t: 's', role: 'appendix' },
  ],
  note: 'Klaar.',
};

describe('lettergreepexperimenten', () => {
  it('sonoriteitsberg: een verkeerde knip lost niet op, de goede knip wel', async () => {
    const user = userEvent.setup();
    const onSolved = show((solved, done) => <SonorityWidget data={ZEBRA} solved={solved} onSolved={done} />);

    expect(screen.getAllByText(', klinker', { exact: false })).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: 'Knip tussen b en r' }));
    expect(screen.getByRole('button', { name: 'Knip tussen b en r' })).toHaveAttribute('aria-pressed', 'true');
    expect(onSolved).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Knip tussen b en r' }));
    await user.click(screen.getByRole('button', { name: 'Knip tussen e en b' }));
    expect(onSolved).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('ze · bra. br klimt naar de a.');
  });

  it('lettergreepboom: een klank aan de verkeerde tak telt niet; alles op zijn plek lost op', async () => {
    const user = userEvent.setup();
    const onSolved = show((solved, done) => <TreeWidget data={HERFST} solved={solved} onSolved={done} />);

    expect(screen.getByRole('button', { name: 'Appendix' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'e' }));
    expect(screen.getByRole('status')).toHaveTextContent('e hangt niet aan de onset.');

    await user.click(screen.getByRole('button', { name: 'h' }));
    expect(screen.getByRole('button', { name: 'h, onset' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'Kern' }));
    await user.click(screen.getByRole('button', { name: 'e' }));
    await user.click(screen.getByRole('button', { name: 'Coda' }));
    await user.click(screen.getByRole('button', { name: 'r' }));
    expect(onSolved).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Appendix' }));
    await user.click(screen.getByRole('button', { name: 's' }));
    expect(onSolved).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('Klaar.');
  });

  it('lettergreepboom: zonder appendix in de opgave ook geen appendixknop', () => {
    show((solved, done) => <TreeWidget data={{ ...HERFST, segs: HERFST.segs.slice(0, 3) }} solved={solved} onSolved={done} />);
    expect(screen.queryByRole('button', { name: 'Appendix' })).not.toBeInTheDocument();
  });
});
