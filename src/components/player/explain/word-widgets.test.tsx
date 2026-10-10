import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { WidgetProps } from './widgets';
import { BracketWidget } from './word-widgets';

// jsdom heeft geen canvas; de confetti doet hier niet ter zake.
vi.mock('@/lib/confetti', () => ({ celebrate: vi.fn(), originOf: () => undefined }));

const ONLEESBAAR: WidgetProps<'bracket'>['data'] = {
  tree: '[on [lees baar]]',
  nodes: [
    { w: 'leesbaar', cat: 'bn', note: 'wat je kunt lezen.' },
    { w: 'onleesbaar', cat: 'bn', note: 'niet te lezen.' },
  ],
  traps: [{ w: 'onlees', note: 'on- plakt niet aan een werkwoord.' }],
  note: 'Klaar.',
};

function Harness({ onSolved }: { onSolved: () => void }) {
  const [solved, setSolved] = useState(false);
  return (
    <BracketWidget
      data={ONLEESBAAR}
      solved={solved}
      onSolved={() => {
        onSolved();
        setSolved(true);
      }}
    />
  );
}

describe('woordboom', () => {
  it('een verkeerde stap legt uit en plakt niet; de goede volgorde lost op', async () => {
    const user = userEvent.setup();
    const onSolved = vi.fn();
    render(<Harness onSolved={onSolved} />);

    await user.click(screen.getByRole('button', { name: 'Plak on en lees' }));
    expect(screen.getByRole('status')).toHaveTextContent('on- plakt niet aan een werkwoord.');
    expect(screen.getByRole('button', { name: 'Plak on en lees' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Plak lees en baar' }));
    expect(screen.getByRole('status')).toHaveTextContent('leesbaar: wat je kunt lezen.');
    expect(onSolved).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Plak on en leesbaar' }));
    expect(onSolved).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('Klaar.');
    expect(screen.queryByRole('button', { name: /^Plak/ })).not.toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Plakstappen' })).toHaveTextContent('lees + baar → leesbaar (bn)');
  });
});
