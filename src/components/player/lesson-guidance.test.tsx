import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { LessonGuidance } from '@/content/schema';
import { LessonApproachSheet, LessonIntroduction, LessonReflection } from './lesson-guidance';

const guidance: LessonGuidance = {
  goal: 'Je onderscheidt een standpunt van een reden.',
  startingPoint: 'Een standpunt vertelt wat iemand vindt. Een reden legt uit waarom.',
  strategy: ['Zoek wat de schrijver vindt.', 'Vraag waarom de schrijver dat vindt.'],
  selfCheck: ['Ik herken een standpunt in een nieuwe tekst.', 'Ik kan de reden in mijn eigen woorden uitleggen.'],
};

describe('begeleiding bij een les', () => {
  it('geeft het doel en vertrekpunt zonder extra verplichte startactie', () => {
    render(<LessonIntroduction guidance={guidance} />);

    const introduction = screen.getByRole('region', { name: 'Dit ga je leren' });
    expect(within(introduction).getByText(guidance.goal)).toBeVisible();
    expect(within(introduction).getByText(guidance.startingPoint, { exact: false })).toBeVisible();
    expect(within(introduction).queryByRole('button')).not.toBeInTheDocument();
  });

  it('opent de aanpak via het toetsenbord en brengt focus na Escape terug', async () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const user = userEvent.setup();
    function Harness() {
      const [open, setOpen] = useState(false);
      const opener = useRef<HTMLButtonElement>(null);
      return <>
        <button ref={opener} onClick={() => setOpen(true)}>Aanpak</button>
        <LessonApproachSheet guidance={guidance} title="Standpunt en reden" accent="green" open={open} onOpenChange={setOpen} finalFocus={opener} />
      </>;
    }
    render(<Harness />);

    await user.tab();
    await user.keyboard('{Enter}');
    const dialog = screen.getByRole('dialog', { name: 'Aanpak voor deze les' });
    expect(within(dialog).getAllByRole('listitem').map((item) => item.textContent)).toEqual(guidance.strategy);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('button', { name: 'Aanpak' })).toHaveFocus());
  });

  it('laat de leerling zelf controleren, terugkomen op een inschatting en de aanpak opzoeken', async () => {
    const user = userEvent.setup();
    render(<LessonReflection guidance={guidance} />);

    const checks = screen.getAllByRole('checkbox');
    expect(checks).toHaveLength(2);
    checks.forEach((check) => expect(check).not.toBeChecked());
    expect(screen.getByRole('status')).toHaveTextContent('Nog een open punt?');
    expect(screen.getByText(/eigen inschatting, geen toetsresultaat/)).toBeVisible();

    await user.tab();
    expect(checks[0]).toHaveFocus();
    await user.keyboard(' ');
    expect(checks[0]).toBeChecked();
    await user.click(screen.getByRole('checkbox', { name: guidance.selfCheck[1] }));
    expect(screen.getByRole('status')).toHaveTextContent('Je hebt jezelf gecontroleerd.');
    expect(screen.getByRole('status')).toHaveTextContent('over een paar dagen');

    await user.click(checks[0]!);
    expect(checks[0]).not.toBeChecked();
    expect(screen.getByRole('status')).toHaveTextContent('Nog een open punt?');

    const approach = screen.getByRole('button', { name: 'Pak de aanpak er nog eens bij' });
    await user.click(approach);
    expect(approach).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => expect(screen.getByText(guidance.strategy[0]!)).toBeVisible());
  });
});
