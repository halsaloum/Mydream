'use client';

import type { Route } from 'next';
import { useCallback, useMemo } from 'react';
import { getLessonEntry, lessonOverview, nextLessonEntry } from '@/content/catalog';
import { lessonIcon } from '@/content/lesson-icons';
import { demoEntries, demoLessonId, getDemo } from '@/content/demo';
import { buildPlan } from '@/engine/plan';
import { lookupStep, planFor } from '@/lib/plans';
import { EmptyState } from '@/components/ui/empty-state';
import { ButtonLink } from '@/components/ui/button';
import { useHydrated } from '@/state/hydration';
import { useProgress, type ProgressData } from '@/state/progress';
import { REVIEW_BATCH, reviewList } from '@/state/selectors';
import { REVIEW_SESSION_ID } from '@/state/sessions';
import { LessonPlayer, type PlayerMeta } from './lesson-player';
import { useLocalSession, usePersistentSession } from './use-session';

/** Een les uit de cursus. Wordt bewaard en is na verversen te hervatten. */
export function LessonRoute({ lessonId }: { lessonId: string }) {
  const entry = getLessonEntry(lessonId);
  const makePlan = useCallback(() => planFor(lessonId) ?? [], [lessonId]);
  const controller = usePersistentSession(lessonId, 'lesson', makePlan);
  if (!entry) return null;

  const next = nextLessonEntry(lessonId);
  const meta: PlayerMeta = {
    mode: 'lesson',
    title: entry.lesson.title,
    context: entry.domain.name,
    accent: entry.domain.accent,
    exit: { href: '/', label: 'Les sluiten (je voortgang is bewaard)' },
    tag: { layer: entry.layer, layerIndex: entry.layerIndex, domain: entry.domain, stage: entry.lesson.stage, icon: lessonIcon(lessonId) },
    finish: {
      title: entry.lesson.title,
      context: `${entry.domain.name} · Niveau ${entry.layerIndex + 1}: ${entry.layer.name}`,
      learned: lessonOverview(entry.lesson).explainTitles,
      primary: next ? { label: 'Volgende les', href: `/les/${next.lesson.id}` as Route } : { label: 'Naar Leren', href: '/' },
      secondary: next ? { label: 'Naar Leren', href: '/' } : { label: 'Alle lessen', href: '/lessen' },
    },
  };
  return <LessonPlayer controller={controller} meta={meta} />;
}

/** De opgeslagen oefenpunten, maximaal één ronde tegelijk. */
export function reviewPlan(progress: ProgressData) {
  return reviewList(progress)
    .slice(0, REVIEW_BATCH)
    .flatMap((item) => {
      const step = lookupStep(item.key);
      return step ? [step] : [];
    });
}

export function ReviewRoute() {
  const hydrated = useHydrated();
  const count = useProgress((state) => Object.keys(state.review).length);
  const makePlan = useCallback(() => reviewPlan(useProgress.getState()), []);
  const controller = usePersistentSession(REVIEW_SESSION_ID, 'review', makePlan);

  if (hydrated && controller.session === null && count === 0) {
    return (
      <main id="inhoud" className="mx-auto grid min-h-dvh w-full max-w-xl place-items-center px-gutter">
        <EmptyState
          title="Niets om te herhalen"
          mood="happy"
          action={
            <ButtonLink href="/" size="lg">
              Naar Leren
            </ButtonLink>
          }
        >
          Opdrachten die je de eerste keer mist, komen vanzelf op je herhaalstapel. Op dit moment staat er niets klaar.
        </EmptyState>
      </main>
    );
  }

  const meta: PlayerMeta = {
    mode: 'review',
    title: 'Herhaling',
    context: 'Oefenpunten',
    accent: 'orange',
    exit: { href: '/herhalen', label: 'Herhaling sluiten (je voortgang is bewaard)' },
    finish: {
      title: 'Herhaling klaar',
      learned: [],
      primary: { label: 'Naar herhalen', href: '/herhalen' },
      secondary: { label: 'Naar Leren', href: '/' },
    },
  };
  return <LessonPlayer controller={controller} meta={meta} />;
}

/** Eén voorbeeld uit de galerij "Oefenvormen". Niet bewaard en telt niet mee. */
export function DemoRoute({ slug }: { slug: string }) {
  const demo = getDemo(slug);
  const plan = useMemo(
    () =>
      demo
        ? buildPlan({ id: demoLessonId(demo.slug), title: demo.title, skill: 'Woorden', icon: '·', domain: demo.domain.id, steps: [demo.step] })
        : [],
    [demo],
  );
  const controller = useLocalSession(demoLessonId(slug), plan);
  if (!demo) return null;

  const index = demoEntries.indexOf(demo);
  const next = demoEntries[index + 1];
  const meta: PlayerMeta = {
    mode: 'demo',
    title: demo.title,
    context: demo.group,
    accent: demo.domain.accent,
    exit: { href: '/oefenvormen', label: 'Voorbeeld sluiten en naar Oefenvormen' },
    finish: {
      title: demo.title,
      context: `Voorbeeld · ${demo.group}`,
      learned: [],
      primary: next ? { label: 'Volgende oefenvorm', href: `/oefenvormen/${next.slug}` as Route } : { label: 'Alle oefenvormen', href: '/oefenvormen' },
      secondary: next ? { label: 'Alle oefenvormen', href: '/oefenvormen' } : undefined,
    },
  };
  return <LessonPlayer key={slug} controller={controller} meta={meta} />;
}
