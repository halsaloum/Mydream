'use client';

import { Flame } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { course } from '@/content/catalog';
import { sentenceLessons } from '@/content/sentences';
import { canonicalLayerId } from '@/content/sentence-layer';
import { PageSkeleton } from '@/components/ui/empty-state';
import { ProgressBar } from '@/components/ui/progress';
import { dayKey, minutes } from '@/lib/dates';
import { useProgressData, useSessionsById } from '@/state/hooks';
import { useHydrated } from '@/state/hydration';
import { continueTarget, recommendedLesson, streakDays } from '@/state/selectors';
import { useSettings } from '@/state/settings';
import { useSentences } from '@/state/sentences';
import { lessonProgress } from '@/lib/sentences/learning';
import { ContinueCard } from './continue-card';
import { HeroScene } from './hero-scene';
import { LayerMachine } from './layer-machine';
import { RecentProgress } from './recent-progress';
import { WordsCard } from './words-card';
import { LearningRoute } from './learning-route';
import { ArgumentationCard } from './argumentation-card';
import { SpacedPracticeReminder } from '@/components/review/spaced-practice';

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
  return <Suspense fallback={<PageSkeleton blocks={['h-14 w-3/4 max-w-md', 'h-56', 'h-[28rem]']} />}><HomeContent /></Suspense>;
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedLayer = canonicalLayerId(searchParams.get('niveau') ?? '');
  const hydrated = useHydrated();
  const profile = useSettings((state) => state.profile);
  const progress = useProgressData();
  const sessions = useSessionsById();
  const sentenceRecords = useSentences((state) => state.records);
  const sentenceSessions = useSentences((state) => state.sessions);
  const [selection, setSelection] = useState<{ request: string; index: number } | null>(null);

  useEffect(() => {
    if (hydrated && !profile.completedAt) router.replace('/welkom');
  }, [hydrated, profile.completedAt, router]);

  useEffect(() => {
    if (!hydrated || !profile.completedAt || window.location.hash !== '#niveaus-titel') return;
    const frame = requestAnimationFrame(() => document.getElementById('niveaus-titel')?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, [hydrated, profile.completedAt, requestedLayer]);

  const target = useMemo(() => continueTarget(progress, sessions, profile), [progress, sessions, profile]);
  const next = useMemo(() => recommendedLesson(progress, profile), [progress, profile]);

  if (!hydrated || !profile.completedAt) {
    return <PageSkeleton blocks={['h-14 w-3/4 max-w-md', 'h-56', 'h-[28rem]']} />;
  }

  const firstTime = Object.keys(progress.lessons).length === 0 && Object.keys(sessions).length === 0;
  const sentenceNext = sentenceLessons.find((lesson) => !sentenceRecords[lesson.id]);
  const defaultLayer = target.kind === 'complete' ? sentenceNext ? course.layers.findIndex((layer) => layer.id === 'zinnen') : course.layers.length - 1 : target.entry.layerIndex;
  const requestedIndex = course.layers.findIndex((layer) => layer.id === requestedLayer);
  const selectedLayer = selection?.request === requestedLayer ? selection.index : requestedIndex >= 0 ? requestedIndex : defaultLayer;
  const coreLesson = sentenceNext ?? sentenceLessons[0]!;
  const coreSession = sentenceSessions[coreLesson.id];
  const sentenceTarget = course.layers[selectedLayer]?.id === 'zinnen' ? { lesson: coreLesson, solved: lessonProgress(coreLesson, coreSession?.answers ?? {}).solved, started: Boolean(coreSession), completed: Boolean(sentenceRecords[coreLesson.id]) } : undefined;
  const today = progress.activity[dayKey()];

  return (
    <div className="stagger flex flex-col gap-section">
      <SpacedPracticeReminder />
      <div className="grid items-start gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:grid-rows-[auto_auto] lg:gap-x-8 lg:gap-y-6">
        <div>
          <p className="mb-3 text-caption font-bold tracking-[0.12em] text-green-ink uppercase">Kleine stappen. Steeds beter schrijven.</p>
          <h1 className="font-serif text-[clamp(2.5rem,1.7rem+2.6vw,3.75rem)] leading-[1.08] font-medium tracking-[-0.025em] text-ink">
            Van eerste zin <em className="text-ink-muted">tot sterk betoog</em>
          </h1>
          <p className="mt-4 max-w-lg text-body leading-relaxed text-ink-soft">
            Leer vanaf de basis helder schrijven, argumenten onderbouwen en drogredenen doorzien. Stap voor stap, met uitleg, oefening en je eigen teksten.
          </p>
          {profile.goalMinutes && <TodayGoal goal={profile.goalMinutes} activeMs={today?.activeMs ?? 0} streak={streakDays(progress.activity)} />}
        </div>
        <HeroScene className="order-last h-60 sm:h-72 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-full lg:min-h-[26rem] lg:max-h-[36rem]" />
        <div className="lg:self-start">
          <ContinueCard target={target} firstTime={firstTime} sentence={sentenceTarget} />
          <WordsCard />
          <ArgumentationCard />
        </div>
      </div>

      <LearningRoute progress={progress} />

      <LayerMachine
        selected={selectedLayer}
        onSelect={(index) => {
          setSelection({ request: requestedLayer, index });
          const params = new URLSearchParams(searchParams.toString());
          params.set('niveau', course.layers[index]!.id);
          router.replace(`/?${params.toString()}#niveaus-titel`, { scroll: false });
        }}
        progress={progress}
        sessions={sessions}
        nextId={next?.lesson.id}
      />

      <RecentProgress progress={progress} />
    </div>
  );
}
