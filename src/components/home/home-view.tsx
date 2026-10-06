'use client';

import { ArrowRight } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { course } from '@/content/catalog';
import { PageSkeleton } from '@/components/ui/empty-state';
import { useProgressData, useSessionsById } from '@/state/hooks';
import { useHydrated } from '@/state/hydration';
import { continueTarget } from '@/state/selectors';
import { useSettings } from '@/state/settings';
import { ContinueCard } from './continue-card';

export function HomeView() {
  const router = useRouter();
  const hydrated = useHydrated();
  const profile = useSettings((state) => state.profile);
  const progress = useProgressData();
  const sessions = useSessionsById();

  useEffect(() => {
    if (hydrated && !profile.completedAt) router.replace('/welkom');
  }, [hydrated, profile.completedAt, router]);

  const target = useMemo(() => continueTarget(progress, sessions, profile), [progress, sessions, profile]);

  if (!hydrated || !profile.completedAt) {
    return <PageSkeleton blocks={['h-14 w-3/4 max-w-md', 'h-56', 'h-[28rem]']} />;
  }

  const firstTime = Object.keys(progress.lessons).length === 0 && Object.keys(sessions).length === 0;

  return (
    <div className="mx-auto max-w-3xl pb-8">
      <header className="pt-6 pb-10 sm:pt-12 sm:pb-14">
        <p className="mb-5 text-label font-semibold tracking-[0.16em] text-green-ink uppercase">Jouw schrijfplek</p>
        <h1 className="max-w-2xl font-serif text-[clamp(2.75rem,2rem+3vw,4.75rem)] leading-[1.08] font-medium tracking-[-0.035em] text-ink">
          Van letter<br className="hidden sm:block" /> <em className="text-green-ink">tot alinea.</em>
        </h1>
        <p className="mt-6 max-w-lg text-lead text-ink-muted">
          Leer schrijven in kleine stappen. Begin bij letters, bouw woorden en zinnen, en maak er een samenhangende alinea van.
        </p>
      </header>

      <ContinueCard target={target} firstTime={firstTime} />

      <section aria-labelledby="schrijfroute-titel" className="mt-14 sm:mt-20">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-5">
          <h2 id="schrijfroute-titel" className="font-serif text-title font-medium">Stap voor stap leren schrijven</h2>
          <Link href="/lessen" className="inline-flex min-h-11 items-center gap-2 text-small font-semibold text-ink-muted underline-offset-4 hover:text-ink hover:underline">
            Alle lessen <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
        <ol className="divide-y divide-line">
          {course.layers.map((layer, index) => {
            const current = target.kind !== 'complete' && target.entry.layer.id === layer.id;
            return (
              <li key={layer.id} data-accent={layer.accent}>
                <Link href={`/lessen?niveau=${encodeURIComponent(layer.id)}` as Route} className="group flex min-h-28 items-center gap-5 rounded-control px-2 py-6 transition-colors hover:bg-surface sm:px-4">
                  <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-tile border border-accent-line bg-accent-soft font-serif text-2xl text-accent-ink transition-transform group-hover:-rotate-6">{index + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-serif text-title font-medium text-ink group-hover:text-green-ink">{layer.name}</span>
                      {current && <span className="text-caption font-semibold text-green-ink">Hier ben je nu</span>}
                    </span>
                    <span className="mt-2 block text-small text-ink-muted">{layer.made}</span>
                    {layer.growth && (
                      <span className="mt-4 flex flex-wrap items-baseline gap-x-1.5 gap-y-2 font-serif text-xl sm:text-2xl" aria-label="Schrijfvoorbeeld">
                        {layer.growth.segments.map((segment, segmentIndex) => (
                          <span key={segmentIndex} className={segment.hi ? 'rounded-md bg-accent-soft px-1.5 text-accent-ink' : 'text-ink-soft'}>{segment.t}</span>
                        ))}
                      </span>
                    )}
                  </span>
                  <ArrowRight aria-hidden className="size-5 shrink-0 text-ink-muted transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <aside className="mt-10 flex flex-col gap-4 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-small leading-relaxed text-ink-muted">Fouten horen bij leren schrijven. Oefen lastige onderdelen gerust nog een keer.</p>
        <Link href="/herhalen" className="inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-green-ink underline-offset-4 hover:underline">Even herhalen <ArrowRight aria-hidden className="size-4" /></Link>
      </aside>
    </div>
  );
}
