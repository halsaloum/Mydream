import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { SessionSummary } from '@/engine/session';
import { FinishScreen } from './finish-screen';

vi.mock('@/lib/toy3d/toy-canvas', () => ({ ToyCanvas: ({ fallback }: { fallback: ReactNode }) => fallback }));

const summary: SessionSummary = {
  graded: 1,
  firstTryCorrect: 1,
  accuracy: 100,
  retries: 0,
  missed: [],
  cleared: [],
  activeMs: 1000,
  bestCombo: 1,
};

function renderFinish(result = summary) {
  return render(
    <FinishScreen
      mode="lesson"
      title="Sterke argumenten"
      summary={result}
      learned={['Een reden is relevant voor het standpunt.']}
      guidance={{ goal: 'Je onderbouwt een standpunt.', startingPoint: 'Een reden geeft antwoord op waarom.', strategy: ['Zoek de reden.'], selfCheck: ['Ik kan een nieuwe reden bedenken.'] }}
      celebrate={false}
      primary={{ label: 'Volgende les', href: '/lessen' }}
    />,
  );
}

describe('afronden is geen bewijs van beheersing', () => {
  it('beschrijft een perfecte kleine ronde eerlijk en houdt verder leren bereikbaar', () => {
    renderFinish();

    expect(screen.getByText('100% in één keer goed in deze ronde')).toBeVisible();
    expect(screen.getByText('1/1')).toBeVisible();
    expect(screen.getByText(/nog geen bewijs van beheersing/)).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Hiermee heb je geoefend' })).toBeVisible();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(screen.getByRole('link', { name: 'Volgende les' })).toHaveAttribute('href', '/lessen');
    expect(screen.queryByText('Dit zit erin.')).not.toBeInTheDocument();
    expect(screen.queryByText('Wat je nu weet')).not.toBeInTheDocument();
  });

  it('verzint geen percentage wanneer er geen beoordeelde opdrachten zijn', () => {
    renderFinish({ ...summary, graded: 0, firstTryCorrect: 0, bestCombo: 0 });

    expect(screen.getByText('Afgerond zonder automatisch beoordeelde opdrachten')).toBeVisible();
    expect(screen.getByText('Je hebt de stappen doorlopen. Controleer zelf wat je zonder hulp kunt toepassen.')).toBeVisible();
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });
});
