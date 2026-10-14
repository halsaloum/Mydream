import { Tooltip } from '@base-ui/react/tooltip';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sentenceLessons } from '@/content/sentences';
import { AppShell } from '@/components/shell/app-shell';
import { SentencesView } from '@/components/sentences/sentences-view';
import { PersonalCodex } from '@/components/sentences/personal-codex';
import { useProgress } from '@/state/progress';
import { useSessions } from '@/state/sessions';
import { useSettings } from '@/state/settings';
import { useSentences } from '@/state/sentences';
import { HomeView } from './home-view';

const navigation = vi.hoisted(() => ({ query: 'niveau=zinnen', pathname: '/', replace: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: navigation.replace }), useSearchParams: () => new URLSearchParams(navigation.query), usePathname: () => navigation.pathname }));
vi.mock('@/state/hydration', () => ({ useHydrated: () => true }));
vi.mock('@/state/practice', () => ({ usePracticeDueCount: () => 0 }));
vi.mock('@/lib/sound', () => ({ play: () => {} }));
vi.mock('@/lib/motion', () => ({ useCalmMotion: () => true, spring: { layout: { duration: 0 } }, transition: { slow: { duration: 0 }, base: { duration: 0 }, progress: { duration: 0 } } }));
vi.mock('@/lib/toy3d/toy-canvas', () => ({ ToyCanvas: ({ props }: { props: { ratios: number[] } }) => <div data-testid="tower-ratios">{JSON.stringify(props.ratios)}</div> }));
vi.mock('./hero-scene', () => ({ HeroScene: () => null }));
vi.mock('./words-card', () => ({ WordsCard: () => null }));
vi.mock('./argumentation-card', () => ({ ArgumentationCard: () => null }));
vi.mock('./recent-progress', () => ({ RecentProgress: () => null }));
vi.mock('@/components/review/spaced-practice', () => ({ SpacedPracticeReminder: () => null }));

beforeEach(() => {
  navigation.query = 'niveau=zinnen';
  navigation.pathname = '/';
  useProgress.getState().reset();
  useSessions.getState().reset();
  useSentences.getState().reset();
  useSettings.setState({ profile: { focus: 'zinnen', start: 'begin', goalMinutes: null, completedAt: '2026-10-14T09:00:00Z' } });
});

const home = () => <Tooltip.Provider><HomeView /></Tooltip.Provider>;

describe('het zinnenleerpad binnen niveau 6', () => {
  it('opent niveau 6 vanuit de teruglink en toont het volledige leerpad precies eenmaal', async () => {
    render(home());
    expect(screen.getByRole('tab', { name: /^Niveau 6: Zinnen/ })).toHaveAttribute('aria-selected', 'true');
    const path = screen.getByRole('region', { name: 'Leerpad voor Zinnen' });
    expect(screen.getAllByRole('region', { name: 'Leerpad voor Zinnen' })).toHaveLength(1);
    expect(within(path).getAllByRole('link', { name: /^Open de module\s*:/ })).toHaveLength(12);
    await waitFor(() => sentenceLessons.forEach((lesson) => expect(within(path).getByRole('heading', { name: lesson.title })).toBeVisible()));
    expect(screen.getByRole('link', { name: 'Begin met deze les' })).toHaveAttribute('href', '/zinnen/les/zinnen-01');
    expect(screen.queryByRole('link', { name: 'Ontdek de afdeling Zinnen' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Naar de interactieve lessen' })).not.toBeInTheDocument();
  });

  it('gebruikt de 12 kernlessen voor niveauvoortgang en houdt de 30 oude lessen aanvullend beschikbaar', () => {
    const first = sentenceLessons[0]!;
    useSentences.setState({ records: { [first.id]: { attempts: 1, completedAt: '2026-10-14T09:00:00Z', lastPracticedAt: '2026-10-14T09:00:00Z', lastAccuracy: 100, bestAccuracy: 100, history: [] } } });
    const { container } = render(home());
    expect(screen.getByRole('tab', { name: /^Niveau 6: Zinnen, 1 van 12 lessen af/ })).toHaveAttribute('aria-selected', 'true');
    const ratios = JSON.parse(screen.getByTestId('tower-ratios').textContent!) as number[];
    expect(ratios[5]).toBeCloseTo(1 / 12);
    expect(screen.getByRole('link', { name: 'Begin met deze les' })).toHaveAttribute('href', '/zinnen/les/zinnen-02');
    const summary = screen.getByText('Extra oefenen en verdiepen · 30 lessen', { selector: 'summary' });
    const extras = summary.closest('details')!;
    expect(extras.open).toBe(false);
    expect(extras.querySelectorAll('a[href^="/les/"]')).toHaveLength(30);
    fireEvent.click(summary);
    expect(extras.open).toBe(true);
    expect(extras.querySelector('a[href="/les/p1"]')).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/Zins-Codex|persoonlijke Codex/);
  });

  it('laat andere niveaus kiezen en verwerkt daarna een andere niveauquery zonder oude selectie te behouden', () => {
    const view = render(home());
    fireEvent.click(screen.getByRole('tab', { name: /^Niveau 7:/ }));
    expect(screen.getByRole('tab', { name: /^Niveau 7:/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.queryByRole('region', { name: 'Leerpad voor Zinnen' })).not.toBeInTheDocument();
    navigation.query = 'niveau=letter';
    view.rerender(home());
    expect(screen.getByRole('tab', { name: /^Niveau 1:/ })).toHaveAttribute('aria-selected', 'true');
  });

  it.each(['groep', 'zin', 'samen'])('opent de samengevoegde zinnenlessen via de oude niveauquery %s', (id) => {
    navigation.query = `niveau=${id}`;
    render(home());
    expect(screen.getByRole('tab', { name: /^Niveau 6: Zinnen/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('region', { name: 'Leerpad voor Zinnen' })).toBeInTheDocument();
  });

  it('houdt de oude directe overzichtsroute bruikbaar met een teruglink naar het echte niveau', () => {
    const { container } = render(<SentencesView />);
    expect(screen.getByRole('link', { name: 'Terug naar niveau 6' })).toHaveAttribute('href', '/?niveau=zinnen#niveaus-titel');
    expect(within(screen.getByRole('region', { name: 'Leerpad voor Zinnen' })).getAllByRole('link', { name: /^Open de module\s*:/ })).toHaveLength(12);
    expect(screen.getByRole('link', { name: 'Mijn samenvattingen' })).toHaveAttribute('href', '/zinnen/codex');
    expect(container.textContent).not.toContain('Codex');
  });

  it('toont zes hoofdonderdelen en behandelt de compatibele zinnenroute als Leren', () => {
    navigation.pathname = '/zinnen';
    render(<AppShell><p>Lesoverzicht</p></AppShell>);
    for (const name of ['Hoofdnavigatie', 'Hoofdnavigatie (mobiel)']) {
      const nav = within(screen.getByRole('navigation', { name }));
      expect(nav.getAllByRole('link')).toHaveLength(6);
      expect(nav.queryByRole('link', { name: 'Zinnen' })).not.toBeInTheDocument();
      expect(nav.getByRole('link', { name: 'Leren' })).toHaveAttribute('aria-current', 'page');
    }
  });

  it('vindt een bewaarde eigen toepassing in de samenvattingen en houdt de teruglink binnen niveau 6', () => {
    const first = sentenceLessons[0]!;
    useSentences.getState().start(first);
    useSentences.getState().setTransfer(first.id, 'De zorgvuldig opgebouwde muziektheatervoorstelling begint morgen.');
    useSentences.setState({ records: { [first.id]: { attempts: 1, completedAt: '2026-10-14T09:00:00Z', lastPracticedAt: '2026-10-14T09:00:00Z', lastAccuracy: 100, bestAccuracy: 100, history: [] } } });
    render(<PersonalCodex />);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Zoek in je verzamelde regels' }), { target: { value: 'muziektheatervoorstelling' } });
    expect(screen.getByRole('status')).toHaveTextContent('1 samenvattingen zichtbaar');
    expect(screen.getByText('De zorgvuldig opgebouwde muziektheatervoorstelling begint morgen.')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Terug naar niveau 6' })).toHaveAttribute('href', '/?niveau=zinnen#niveaus-titel');
  });
});
