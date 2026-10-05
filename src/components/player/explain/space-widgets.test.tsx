import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FlipWidget, VowelSpaceWidget } from './space-widgets';
import type { WidgetProps } from './widgets';

// jsdom heeft geen canvas; de confetti doet hier niet ter zake.
vi.mock('@/lib/confetti', () => ({ celebrate: vi.fn(), originOf: () => undefined }));

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

const VERSTOPT: WidgetProps<'space'>['data'] = {
  q: 'Welke ronde klinkers verstoppen zich achter een platte?',
  targets: ['y', 'øː'],
  note: 'uu achter ie, eu achter ee.',
};

const DRAAI: WidgetProps<'flip'>['data'] = {
  q: 'Maak van de b de drie andere letters',
  start: 'b',
  targets: ['d', 'p', 'q'],
  note: 'Spiegelen, kantelen, draaien.',
};

describe('klinkerruimte', () => {
  it('telt alleen de gevraagde klinkers en meldt opgelost', async () => {
    const user = userEvent.setup();
    const onSolved = show((solved, done) => <VowelSpaceWidget data={VERSTOPT} solved={solved} onSolved={done} />);
    await user.click(screen.getByRole('button', { name: /^\/i\/ zoals in piet/ }));
    expect(screen.getByText(/\/i\/ hoort er niet bij/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^\/y\/ zoals in fuut, ronde lippen/ }));
    expect(onSolved).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: /^\/øː\/ zoals in neus/ }));
    expect(onSolved).toHaveBeenCalledOnce();
    expect(screen.getByText(VERSTOPT.note)).toBeInTheDocument();
  });

  it('kiest een vaste stand en is met pijltjestoetsen te draaien', async () => {
    const user = userEvent.setup();
    show((solved, done) => <VowelSpaceWidget data={VERSTOPT} solved={solved} onSolved={done} />);
    const view = screen.getByRole('button', { name: 'Van opzij' });
    await user.click(view);
    expect(view).toHaveAttribute('aria-pressed', 'true');
    screen.getByRole('group', { name: /Klinkerruimte/ }).focus();
    await user.keyboard('{ArrowLeft}');
    expect(view).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('draaitegel', () => {
  it('spiegelen, kantelen en draaien geven de juiste letter', async () => {
    const user = userEvent.setup();
    const onSolved = show((solved, done) => <FlipWidget data={DRAAI} solved={solved} onSolved={done} />);
    await user.click(screen.getByRole('button', { name: /Spiegel/ }));
    expect(screen.getByText('Na spiegelen lees je nu').nextSibling).toHaveTextContent('d');
    await user.click(screen.getByRole('button', { name: /Kantel/ }));
    expect(screen.getByText('Na kantelen lees je nu').nextSibling).toHaveTextContent('q');
    expect(onSolved).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: /Spiegel/ }));
    expect(screen.getByText('Na spiegelen lees je nu').nextSibling).toHaveTextContent('p');
    expect(onSolved).toHaveBeenCalledOnce();
    expect(screen.getByText(DRAAI.note)).toBeInTheDocument();
  });
});
