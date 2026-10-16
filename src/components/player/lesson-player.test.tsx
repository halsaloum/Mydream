import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { Lesson } from '@/content/schema';
import { buildPlan } from '@/engine/plan';
import { createSession, sessionReducer, type SessionState } from '@/engine/session';
import { LessonPlayer, type PlayerMeta } from './lesson-player';

vi.mock('@/lib/toy3d/toy-canvas', () => ({ ToyCanvas: ({ fallback }: { fallback: ReactNode }) => fallback }));
vi.mock('@/lib/confetti', () => ({ celebrate: vi.fn() }));

const lesson: Lesson = {
  id: 'begeleiding-test',
  title: 'Standpunt en reden',
  skill: 'Alinea',
  icon: '!',
  domain: 'pragmatiek',
  guidance: {
    goal: 'Je onderscheidt een standpunt van een reden.',
    startingPoint: 'Een standpunt zegt wat iemand vindt.',
    strategy: ['Zoek het standpunt.', 'Vraag waarom de schrijver dat vindt.'],
    selfCheck: ['Ik herken een standpunt in een nieuwe tekst.'],
  },
  steps: [
    { kind: 'learn', title: 'Wat is een standpunt?', body: 'Een standpunt is wat je vindt.', example: [] },
    { kind: 'choice', prompt: 'Welke zin is een standpunt?', before: '', after: '', options: ['Ik vind het nuttig.', 'Het is woensdag.'], answer: 'Ik vind het nuttig.', why: 'Dit is een oordeel.' },
  ],
};
const plan = buildPlan(lesson);
const lookup = (key: string) => plan.find((step) => step.key === key);
const meta: PlayerMeta = {
  mode: 'lesson',
  title: lesson.title,
  accent: 'green',
  guidance: lesson.guidance,
  exit: { href: '/', label: 'Les sluiten' },
  finish: { title: lesson.title, learned: [], primary: { href: '/', label: 'Verder leren' } },
};

describe('begeleiding in de lesplayer', () => {
  it('laat direct oefenen en bewaart de huidige stap bij gebruik van de aanpak', async () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const user = userEvent.setup();
    function Harness() {
      const [session, setSession] = useState(() => createSession(lesson.id, 'lesson', plan, 1));
      return <LessonPlayer meta={meta} controller={{
        session,
        lookup,
        dispatch: (action) => setSession((current) => sessionReducer(current, action, lookup)),
        restart: () => {},
        discard: () => {},
        counts: false,
      }} />;
    }
    render(<Harness />);

    expect(screen.getByRole('region', { name: 'Dit ga je leren' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Wat is een standpunt?' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Begrepen' }));
    expect(screen.queryByRole('region', { name: 'Dit ga je leren' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Controleer' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Aanpak voor deze les' }));
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Aanpak voor deze les' })).toBeVisible());
    await user.click(screen.getByRole('button', { name: 'Terug naar de oefening' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('heading', { name: 'Welke zin is een standpunt?' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Controleer' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Aanpak voor deze les' })).toHaveFocus();

    await user.click(screen.getByRole('radio', { name: /Ik vind het nuttig/ }));
    await user.click(screen.getByRole('button', { name: 'Controleer' }));
    expect(screen.getByRole('button', { name: 'Doorgaan' })).toBeEnabled();
  });

  it('rondt een zelfgecontroleerde schrijfopdracht af zonder een inhoudelijk oordeel of score', async () => {
    const user = userEvent.setup();
    const writeLesson: Lesson = {
      ...lesson,
      steps: [{ kind: 'write', prompt: 'Onderbouw je standpunt.', minWords: 4, must: [], why: 'Een eigen controle helpt je de tekst gericht te verbeteren.', rubric: { criteria: ['Mijn reden is relevant.', 'Ik onderbouw mijn reden.'], example: 'Een voorbeeldtekst met een reden.' } }],
    };
    const writePlan = buildPlan(writeLesson);
    const writeLookup = (key: string) => writePlan.find((step) => step.key === key);
    function Harness() {
      const [session, setSession] = useState<SessionState>(() => ({
        ...createSession(writeLesson.id, 'lesson', writePlan, 1),
        responses: { '0': { kind: 'write', value: 'Dit is mijn gecontroleerde tekst.', reviewed: true, selfChecks: [true, true] } },
      }));
      return <LessonPlayer meta={meta} controller={{ session, lookup: writeLookup, dispatch: (action) => setSession((current) => sessionReducer(current, action, writeLookup)), restart: () => {}, discard: () => {}, counts: false }} />;
    }
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Rond schrijfopdracht af' }));
    const feedback = within(screen.getByRole('contentinfo')).getByRole('status');
    expect(feedback).toHaveTextContent('Schrijfopdracht afgerond');
    expect(feedback).not.toHaveTextContent('Goed.');
    await user.click(screen.getByRole('button', { name: 'Doorgaan' }));
    expect(screen.getByText('Afgerond zonder automatisch beoordeelde opdrachten')).toBeVisible();
    expect(screen.queryByText(/100%/)).not.toBeInTheDocument();
  });
});
