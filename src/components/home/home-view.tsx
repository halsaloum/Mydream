'use client';

import { Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { course, totalLessons } from '@/content/catalog';
import { PageSkeleton } from '@/components/ui/empty-state';
import { ProgressBar } from '@/components/ui/progress';
import { dayKey, minutes } from '@/lib/dates';
import { useProgressData, useSessionsById } from '@/state/hooks';
import { useHydrated } from '@/state/hydration';
import { continueTarget, recommendedLesson, streakDays } from '@/state/selectors';
import { useSettings } from '@/state/settings';
import { ContinueCard } from './continue-card';
import { HeroScene } from './hero-scene';
import { LayerMachine } from './layer-machine';
import { RecentProgress } from './recent-progress';

function TodayGoal({ goal, activeMs, streak }: { goal: number; activeMs: number; streak: number }) {
  const done = minutes(activeMs);
  return (
    <div className="mt-6 max-w-sm" data-accent="green">
      <div className="mb-2 flex items-baseline justify-between gap-4 text-small">
        <p className="font-bold text-ink">
          Vandaag {done} van {goal} minuten
        </p>
        {streak > 0 && (
          <p className="inline-flex items-center gap-1 font-semibold text-orange-ink">
            <Flame aria-hidden className="size-4" strokeWidth={2.5} />
            {streak === 1 ? '1 dag' : `${streak} dagen`} op rij
          </p>
        )}
      </div>
      <ProgressBar value={Math.min(done, goal)} max={goal} size="sm" label="Dagdoel" valueText={`${done} van ${goal} minuten geoefend vandaag`} />
    </div>
  );
}

export function HomeView() {
  const router = useRouter();
  const hydrated = useHydrated();
  const profile = useSettings((state) => state.profile);
  const progress = useProgressData();
  const sessions = useSessionsById();
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);

  useEffect(() => {
    if (hydrated && !profile.completedAt) router.replace('/welkom');
  }, [hydrated, profile.completedAt, router]);

  const target = useMemo(() => continueTarget(progress, sessions, profile), [progress, sessions, profile]);
  const next = useMemo(() => recommendedLesson(progress, profile), [progress, profile]);

  if (!hydrated || !profile.completedAt) {
    return <PageSkeleton blocks={['h-14 w-3/4 max-w-md', 'h-56', 'h-[28rem]']} />;
  }

  const firstTime = Object.keys(progress.lessons).length === 0 && Object.keys(sessions).length === 0;
  const defaultLayer = target.kind === 'complete' ? course.layers.length - 1 : target.entry.layerIndex;
  const today = progress.activity[dayKey()];

  return (
    <div className="stagger flex flex-col gap-section">
      <div className="grid gap-6 lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:gap-x-10 lg:gap-y-7">
        <div className="lg:self-end">
          <h1 className="font-serif text-[clamp(2.5rem,1.9rem+2.6vw,4rem)] leading-[1.02] font-medium tracking-[-0.02em] text-ink">
            Van letter <em className="text-ink-muted">tot alinea</em>
          </h1>
          <p className="mt-4 max-w-md text-lead text-ink-soft">
            {totalLessons} lessen in {course.layers.length} niveaus. Elk niveau bouwt voort op het niveau eronder.
          </p>
          {profile.goalMinutes && <TodayGoal goal={profile.goalMinutes} activeMs={today?.activeMs ?? 0} streak={streakDays(progress.activity)} />}
        </div>
        <HeroScene className="order-last -mt-2 h-60 sm:h-80 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:my-0 lg:h-full lg:min-h-[28rem]" />
        <div className="lg:self-start">
          <ContinueCard target={target} firstTime={firstTime} />
        </div>
      </div>

      <LayerMachine
        selected={selectedLayer ?? defaultLayer}
        onSelect={setSelectedLayer}
        progress={progress}
        sessions={sessions}
        nextId={next?.lesson.id}
      />

      <RecentProgress progress={progress} />
    </div>
  );
}
