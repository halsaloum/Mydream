import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { lessonEntries } from '@/content/catalog';
import { demoEntries } from '@/content/demo';
import { ARGUMENT_DEMOS } from '@/content/demo/argumenten';
import { isProtectedArgumentLesson } from '@/content/ontleed';
import type { PlanStep } from '@/engine/plan';
import { isScored } from '@/engine/kinds';
import { planFor } from '@/lib/plans';
import { EMPTY_PROGRESS, useProgress, type ProgressData } from '@/state/progress';
import type { PlayerMeta } from './lesson-player';

const { persistent, local } = vi.hoisted(() => ({ persistent: vi.fn(), local: vi.fn() }));
vi.mock('./use-session', () => ({ usePersistentSession: persistent, useLocalSession: local }));
vi.mock('@/state/hydration', () => ({ useHydrated: () => true }));
vi.mock('./lesson-player', () => ({ LessonPlayer: ({ meta }: { meta: PlayerMeta }) => <div>
  <a data-testid="exit" href={String(meta.exit.href)}>{meta.exit.label}</a>
  <a data-testid="primary" href={String(meta.finish.primary.href)}>{meta.finish.primary.label}</a>
  {meta.finish.secondary && <a data-testid="secondary" href={String(meta.finish.secondary.href)}>{meta.finish.secondary.label}</a>}
</div> }));
import { ARGUMENT_REVIEW_SESSION_ID, DemoRoute, LessonRoute, ReviewRoute, nextArgumentDemo, nextLegacyArgumentLesson, reviewPlan } from './routes';

const now = Date.parse('2026-10-15T10:00:00Z');
function progressWithRetiredAndProtected() {
  const retired = lessonEntries.filter(entry => !isProtectedArgumentLesson(entry.lesson.id)).flatMap(entry => planFor(entry.lesson.id) ?? []).filter(item => isScored(item.step)).slice(0, 10);
  const protectedSteps = ['a20', 'a21'].map(id => planFor(id)!.find(item => isScored(item.step))!);
  const review = Object.fromEntries([...retired, ...protectedSteps].map((item, index) => [item.key, { key: item.key, lessonId: item.lessonId, addedAt: new Date(now - index * 1000).toISOString(), lastMissedAt: new Date(now - index * 1000).toISOString(), misses: 1 }]));
  return { progress: { ...EMPTY_PROGRESS, review } as ProgressData, protectedSteps, retired };
}
beforeEach(() => {
  persistent.mockReset(); local.mockReset();
  const controller = { session: {}, dispatch: vi.fn(), lookup: vi.fn(), restart: vi.fn(), discard: vi.fn(), counts: true };
  persistent.mockReturnValue(controller); local.mockReturnValue(controller);
  useProgress.getState().replace(EMPTY_PROGRESS);
});

describe('beschermde navigatie zonder verwijderde lessen', () => {
  it('blijft binnen a20–a35 en eindigt na a35 bij Argumentatie', () => {
    expect(nextLegacyArgumentLesson('a20')!.lesson.id).toBe('a21');
    expect(nextLegacyArgumentLesson('a34')!.lesson.id).toBe('a35');
    expect(nextLegacyArgumentLesson('a35')).toBeUndefined();
    render(<LessonRoute lessonId="a35"/>);
    expect(screen.getByTestId('primary')).toHaveAttribute('href', '/argumentatie');
    expect(screen.queryByRole('link', { name: 'Volgende les' })).not.toBeInTheDocument();
  });

  it('houdt de oorspronkelijke argumentdemovolgorde en verwijst terug naar Argumentatie', () => {
    const slugs = new Set(ARGUMENT_DEMOS.map(demo => demo.slug));
    const protectedDemos = demoEntries.filter(demo => slugs.has(demo.slug));
    protectedDemos.forEach((demo, index) => expect(nextArgumentDemo(demo.slug)?.slug).toBe(protectedDemos[index + 1]?.slug));
    render(<DemoRoute slug={protectedDemos.at(-1)!.slug}/>);
    expect(screen.getByTestId('primary')).toHaveAttribute('href', '/argumentatie');
    expect(screen.getByTestId('exit')).toHaveAttribute('href', '/argumentatie');
  });

  it('filtert vóór de batch zodat recentere verdwenen lessen de argumentatievragen niet verdringen', () => {
    const { progress, protectedSteps, retired } = progressWithRetiredAndProtected();
    expect(retired).toHaveLength(10);
    const original = JSON.stringify(progress);
    expect(reviewPlan(progress).map(item => item.key)).toEqual(retired.slice(0, 8).map(item => item.key));
    expect(reviewPlan(progress, true).map(item => item.key)).toEqual(protectedSteps.map(item => item.key));
    expect(JSON.stringify(progress)).toBe(original);
  });

  it('start de publieke oude sessieroute uitsluitend met beschermde vragen en een aparte sessie-id', () => {
    const { progress, protectedSteps } = progressWithRetiredAndProtected();
    useProgress.getState().replace(progress);
    render(<ReviewRoute/>);
    const call = persistent.mock.calls.at(-1)!;
    expect(call[0]).toBe(ARGUMENT_REVIEW_SESSION_ID);
    expect((call[2] as () => PlanStep[])().map(item => item.key)).toEqual(protectedSteps.map(item => item.key));
    expect(screen.getByTestId('exit')).toHaveAttribute('href', '/herhalen/argumentatie');
    expect(screen.getByTestId('primary')).toHaveAttribute('href', '/herhalen/argumentatie');
  });
});
