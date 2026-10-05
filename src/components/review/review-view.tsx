'use client';

import { ArrowRight, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Route } from 'next';
import Link from 'next/link';
import { EXERCISE_LABELS, getLessonEntry } from '@/content/catalog';
import type { Step } from '@/content/schema';
import { DomainGlyph } from '@/components/brand/glyphs';
import { PageHeader } from '@/components/shell/app-shell';
import { ButtonLink, IconButton } from '@/components/ui/button';
import { EmptyState, PageSkeleton } from '@/components/ui/empty-state';
import { formatDay } from '@/lib/dates';
import { spring, transition, useCalmMotion } from '@/lib/motion';
import { lookupStep } from '@/lib/plans';
import { notify } from '@/lib/toast';
import { useProgressData } from '@/state/hooks';
import { useHydrated } from '@/state/hydration';
import { useProgress, type ReviewItem } from '@/state/progress';
import { REVIEW_BATCH, reviewList } from '@/state/selectors';
import { REVIEW_SESSION_ID, useSessions } from '@/state/sessions';

/** Korte omschrijving van een opdracht: de opdrachtzin, of de titel bij uitleg. */
function stepSummary(step: Step): { prompt: string; sample: string | null } {
  const prompt = 'prompt' in step && step.prompt ? step.prompt : 'title' in step ? step.title : EXERCISE_LABELS[step.kind];
  const sample =
    (step.kind === 'choice' || step.kind === 'type') && (step.before || step.after) ? `${step.before} … ${step.after}`.trim() : step.kind === 'fix' ? step.sentence : step.kind === 'rewrite' ? step.source : null;
  return { prompt, sample };
}

export function ReviewView() {
  const hydrated = useHydrated();
  const calm = useCalmMotion();
  const progress = useProgressData();
  const running = useSessions((state) => {
    const session = state.byId[REVIEW_SESSION_ID];
    return session && session.phase !== 'done' ? session : null;
  });

  if (!hydrated) return <PageSkeleton blocks={['h-14 w-2/3 max-w-md', 'h-28', 'h-28', 'h-28']} />;

  const items = reviewList(progress).filter((item) => lookupStep(item.key));
  const batch = Math.min(items.length, REVIEW_BATCH);

  const remove = (item: ReviewItem) => {
    useProgress.getState().removeReviewItem(item.key);
    notify('Oefenpunt van je stapel gehaald', undefined, {
      label: 'Ongedaan maken',
      onClick: () => useProgress.setState((state) => ({ review: { ...state.review, [item.key]: item } })),
    });
  };

  return (
    <div>
      <PageHeader
        title="Herhalen"
        description="Opdrachten die je de eerste keer miste, komen hier terug. Een ronde heeft er maximaal acht; wat je dan goed doet, gaat van de stapel."
        action={
          running ? (
            <ButtonLink href="/herhalen/sessie" variant="accent" size="lg" data-accent="orange">
              Verder met je ronde
              <ArrowRight aria-hidden className="size-5" strokeWidth={2.75} />
            </ButtonLink>
          ) : items.length > 0 ? (
            <ButtonLink href="/herhalen/sessie" variant="accent" size="lg" data-accent="orange">
              Start een ronde van {batch}
              <ArrowRight aria-hidden className="size-5" strokeWidth={2.75} />
            </ButtonLink>
          ) : null
        }
      />

      {running && (
        <p className="mb-6 rounded-tile border-2 border-orange-line bg-orange-soft px-4 py-3 text-small font-semibold text-orange-ink">
          Je ronde staat open bij stap {Math.min(running.pos + 1, running.queue.length)} van {running.queue.length}.
        </p>
      )}

      {items.length === 0 ? (
        <EmptyState
          title="Geen oefenpunten"
          mood="happy"
          action={
            <ButtonLink href="/" size="lg">
              Naar Leren
            </ButtonLink>
          }
        >
          Mis je een opdracht de eerste keer, dan komt hij hier vanzelf terug. Op dit moment staat er niets klaar.
        </EmptyState>
      ) : (
        <ol className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {items.map((item, index) => {
              const plan = lookupStep(item.key)!;
              const entry = getLessonEntry(plan.lessonId);
              const { prompt, sample } = stepSummary(plan.step);
              return (
                <motion.li
                  key={item.key}
                  layout={calm ? false : 'position'}
                  initial={calm ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: calm ? 0 : -24, transition: transition.fast }}
                  transition={{ ...spring.layout, opacity: transition.base }}
                  data-accent={entry?.domain.accent}
                >
                  {index === batch && (
                    <p className="mt-5 mb-3 text-small font-bold text-ink-muted">Daarna</p>
                  )}
                  <div className="flex items-start gap-4 rounded-card border-2 border-line bg-surface p-4 shadow-slab-sm sm:p-5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-control bg-accent icon-tile">
                      {entry ? <DomainGlyph id={entry.domain.id} className="size-5" /> : null}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-body font-bold text-ink">{prompt}</p>
                      {sample && (
                        <p className="mt-1 font-serif text-[1.125rem] text-ink-soft" lang="nl">
                          {sample}
                        </p>
                      )}
                      <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-caption font-semibold text-ink-muted">
                        {entry && (
                          <Link href={`/les/${entry.lesson.id}` as Route} className="text-accent-ink underline-offset-4 hover:underline">
                            {entry.lesson.title}
                          </Link>
                        )}
                        <span>{EXERCISE_LABELS[plan.step.kind]}</span>
                        <span>
                          {item.misses === 1 ? '1 keer gemist' : `${item.misses} keer gemist`}, laatst {formatDay(item.lastMissedAt)}
                        </span>
                      </p>
                    </div>
                    <IconButton label="Van de stapel halen" icon={<Trash2 className="size-[1.1rem]" strokeWidth={2.4} />} onClick={() => remove(item)} />
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>
      )}
    </div>
  );
}

