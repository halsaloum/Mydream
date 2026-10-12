import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { lessonIllustrations } from '@/content/argumentation/illustrations';
import { LessonIllustration } from './lesson-illustration';

vi.mock('@/lib/motion', () => ({ useCalmMotion: () => true }));

describe('interactive concept illustrations', () => {
  it('lets the learner follow a real connection and returns to the whole map', async () => {
    const user = userEvent.setup();
    render(<LessonIllustration lessonId="basis-standpunt-en-reden" />);
    await user.click(screen.getByRole('button', { name: 'Ontleed de kaart' }));
    expect(screen.getByRole('heading', { name: /Onderdeel 1 van 2 · Reden/ })).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('In kamer B is minder lawaai.');
    await user.click(screen.getByRole('button', { name: 'Volgend kaartonderdeel' }));
    expect(screen.getByRole('heading', { name: /Onderdeel 2 van 2 · Standpunt/ })).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('Laten we in kamer B overleggen.');
    await user.click(screen.getByRole('button', { name: 'Toon het geheel' }));
    expect(screen.queryByRole('heading', { name: /Onderdeel/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Alleen een voorkeur' }));
    await user.click(screen.getByRole('button', { name: 'Ontleed de kaart' }));
    expect(screen.getByRole('status')).toHaveTextContent('vraagt om een reden');
  });
  it('makes every authored alternative reachable through named native controls', () => {
    for (const [lessonId, entry] of Object.entries(lessonIllustrations)) {
      const view = render(<LessonIllustration lessonId={lessonId} />);
      const region = within(screen.getByRole('region', { name: `Interactieve illustratie: ${entry.title}` }));
      for (const variant of entry.variants) {
        const control = region.getByRole('button', { name: variant.label });
        fireEvent.click(control);
        expect(control).toHaveAttribute('aria-pressed', 'true');
        expect(region.getByText(variant.caption)).toBeVisible();
      }
      view.unmount();
    }
  });

  it('lets the learner test a countermodel with the keyboard and distinguishes the converse', async () => {
    const user = userEvent.setup();
    render(<LessonIllustration lessonId="basis-voorwaarden-en-gevolgen" />);
    const first = screen.getByRole('radio', { name: 'P waar · Q waar' });
    first.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'P waar · Q onwaar' })).toBeChecked();
    expect(screen.getByRole('status')).toHaveTextContent('Dit is een tegenmodel');
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'P onwaar · Q waar' })).toBeChecked();
    expect(screen.getByRole('status')).toHaveTextContent('registratie voldoende');
    fireEvent.click(screen.getByRole('button', { name: 'P alleen als Q' }));
    fireEvent.click(screen.getByRole('radio', { name: 'P waar · Q onwaar' }));
    expect(screen.getByRole('status')).toHaveTextContent('Dit is een tegenmodel');
  });

  it('changes the actual reference group instead of equating sensitivity and posterior', () => {
    render(<LessonIllustration lessonId="master-bayes-basisfrequentie" />);
    expect(screen.getByRole('status')).toHaveTextContent('100 / 10.000 = 1%');
    fireEvent.click(screen.getByRole('button', { name: 'Alleen gemarkeerd' }));
    expect(screen.getByRole('status')).toHaveTextContent('90 / 585 = 15,4%');
    fireEvent.click(screen.getByRole('button', { name: 'Meer spam, hetzelfde filter' }));
    fireEvent.click(screen.getByRole('button', { name: 'Alleen gemarkeerd' }));
    expect(screen.getByRole('status')).toHaveTextContent('1.800 / 2.200 = 81,8%');
    fireEvent.click(screen.getByRole('button', { name: 'Twee gedeeltelijk gedeelde signalen' }));
    fireEvent.click(screen.getByRole('button', { name: 'Alleen gemarkeerd' }));
    expect(screen.getByRole('status')).toHaveTextContent('1.700 / 2.020 = 84,2%');
  });

  it('contrasts raw counts with exposure-normalized rates without asserting a cause', () => {
    render(<LessonIllustration lessonId="bachelor-causaliteit-statistiek" />);
    fireEvent.click(screen.getByRole('button', { name: 'Het aantal of de verhouding?' }));
    expect(screen.getByRole('status')).toHaveTextContent('18 is meer dan 12');
    fireEvent.click(screen.getByRole('button', { name: 'Per 100 werkuren' }));
    expect(screen.getByRole('status')).toHaveTextContent('6 meldingen per 100 werkuren, tegenover 12');
    expect(screen.getByRole('status')).toHaveTextContent('bewijst nog niet de oorzaak');
  });

  it('shows an empty group without implying existence and highlights a real counterexample', () => {
    render(<LessonIllustration lessonId="bachelor-geldigheid-en-tegenvoorbeelden" />);
    fireEvent.click(screen.getByRole('button', { name: 'Een lege groep' }));
    const status = within(screen.getByRole('status'));
    expect(status.getByText('In dit voorbeeld: waar.')).toBeVisible();
    expect(status.getByText('In dit voorbeeld: onwaar.')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Een echt tegenvoorbeeld' }));
    fireEvent.click(screen.getByRole('button', { name: 'Markeer tegenvoorbeelden' }));
    expect(screen.getByText('Tegenvoorbeeld')).toBeVisible();
    expect(screen.getByText(/Eén zo'n lid volstaat/)).toBeVisible();
  });

  it('reveals costs and conditions for a third option without automatically grading it', () => {
    render(<LessonIllustration lessonId="bachelor-dilemma-helling-cirkel" />);
    fireEvent.click(screen.getByRole('button', { name: 'Een beperkte proef' }));
    expect(screen.getByRole('status')).toHaveTextContent('Leer over één vergelijkbaar team.');
    expect(screen.getByRole('status')).toHaveTextContent('stopgrens');
    expect(screen.queryByText(/Correct!|Goed gedaan!/)).not.toBeInTheDocument();
  });
});
