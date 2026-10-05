'use client';

import { ArrowRight, CalendarDays, Clock3, Flame, Target } from 'lucide-react';
import { motion } from 'motion/react';
import type { Route } from 'next';
import type { ReactNode } from 'react';
import { course, getLessonEntry, totalLessons } from '@/content/catalog';
import { DomainGlyph, LayerGlyph } from '@/components/brand/glyphs';
import { PageHeader } from '@/components/shell/app-shell';
import { ButtonLink } from '@/components/ui/button';
import { EmptyState, PageSkeleton } from '@/components/ui/empty-state';
import { ProgressBar } from '@/components/ui/progress';
import { formatDay, minutes, weekdayShort } from '@/lib/dates';
import { transition, useCalmMotion } from '@/lib/motion';
import { useProgressData, useSessionsById } from '@/state/hooks';
import { useHydrated } from '@/state/hydration';
import { averageAccuracy, continueTarget, courseCompletion, domainCompletion, layerCompletion, recentDays, streakDays } from '@/state/selectors';
import { useSettings } from '@/state/settings';

export function ProgressView() {
  const hydrated = useHydrated();
  const progress = useProgressData();
  const sessions = useSessionsById();
  const profile = useSettings((state) => state.profile);

  if (!hydrated) return <PageSkeleton blocks={['h-14 w-1/2 max-w-sm', 'h-28', 'h-80', 'h-56']} />;

  const target = continueTarget(progress, sessions, profile);
  const action =
    target.kind === 'complete' ? null : (
      <ButtonLink href={`/les/${target.entry.lesson.id}` as Route} variant="accent" size="lg" data-accent={target.entry.domain.accent}>
        {target.kind === 'resume' ? 'Verder met jouw les' : 'Start de volgende les'}
        <ArrowRight aria-hidden className="size-5" strokeWidth={2.75} />
      </ButtonLink>
    );

  const total = courseCompletion(progress);
  const totalMs = Object.values(progress.activity).reduce((sum, day) => sum + day.activeMs, 0);
  const hasData = total.done > 0 || totalMs > 0 || progress.history.length > 0;

  if (!hasData) {
    return (
      <div>
        <PageHeader title="Voortgang" description="Hier zie je straks per niveau en vakgebied hoe ver je bent. Alles komt uit je eigen oefenen in deze browser." />
        <EmptyState title="Nog geen voortgang" mood="idle" action={action}>
          Rond je eerste les af; daarna verschijnen hier je lessen, je oefentijd en hoe vaak je iets in één keer goed had.
        </EmptyState>
      </div>
    );
  }

  const accuracy = averageAccuracy(progress);
  const streak = streakDays(progress.activity);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Voortgang" description="Alles hier komt uit je eigen oefenen in deze browser." action={action} className="mb-0" />

      <dl className="stagger grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={<CalendarDays aria-hidden className="size-4" strokeWidth={2.5} />} label="Lessen af">
          {total.done}
          <span className="text-body font-bold text-ink-muted"> / {totalLessons}</span>
        </Stat>
        <Stat icon={<Target aria-hidden className="size-4" strokeWidth={2.5} />} label="Gemiddeld in één keer goed">
          {accuracy === null ? '–' : `${accuracy}%`}
        </Stat>
        <Stat icon={<Flame aria-hidden className="size-4" strokeWidth={2.5} />} label="Dagen op rij">
          {streak}
        </Stat>
        <Stat icon={<Clock3 aria-hidden className="size-4" strokeWidth={2.5} />} label="Actieve oefentijd">
          {minutes(totalMs)}
          <span className="text-body font-bold text-ink-muted"> min</span>
        </Stat>
      </dl>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Per niveau">
          <ul className="flex flex-col gap-4">
            {course.layers.map((layer, index) => {
              const done = layerCompletion(layer, progress);
              return (
                <li key={layer.id} data-accent={layer.accent} className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-control bg-accent-soft text-accent-ink">
                    <LayerGlyph id={layer.id} className="size-[1.1rem]" />
                  </span>
                  <div className="min-w-0">
                    <div className="mb-1.5 flex items-baseline justify-between gap-3 text-small">
                      <span className="truncate font-bold text-ink">
                        {index + 1}. {layer.name}
                      </span>
                      <span className="shrink-0 font-semibold text-ink-muted tabular-nums">
                        {done.done}/{done.total}
                      </span>
                    </div>
                    <ProgressBar value={done.done} max={done.total} size="sm" label={`Niveau ${index + 1}: ${layer.name}`} valueText={`${done.done} van ${done.total} lessen af`} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card title="Per vakgebied">
          <ul className="flex flex-col gap-4">
            {course.domains.map((domain) => {
              const done = domainCompletion(domain, progress);
              if (done.total === 0) return null;
              return (
                <li key={domain.id} data-accent={domain.accent} className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-control bg-accent icon-tile">
                    <DomainGlyph id={domain.id} className="size-[1.1rem]" />
                  </span>
                  <div className="min-w-0">
                    <div className="mb-1.5 flex items-baseline justify-between gap-3 text-small">
                      <span className="truncate font-bold text-ink">{domain.name}</span>
                      <span className="shrink-0 font-semibold text-ink-muted tabular-nums">
                        {done.done}/{done.total}
                      </span>
                    </div>
                    <ProgressBar value={done.done} max={done.total} size="sm" label={domain.name} valueText={`${done.done} van ${done.total} lessen af`} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card title="Oefentijd, laatste twee weken">
          <ActivityChart activity={progress.activity} goal={profile.goalMinutes} />
        </Card>
        <Card title="Laatst geoefend">
          {progress.history.length === 0 ? (
            <p className="text-small text-ink-muted">Nog geen afgeronde lessen of herhaalrondes.</p>
          ) : (
            <ul className="flex flex-col divide-y-2 divide-line">
              {progress.history.slice(0, 8).map((entry, i) => {
                const lesson = entry.mode === 'lesson' ? getLessonEntry(entry.id) : undefined;
                return (
                  <li key={`${entry.at}-${i}`} data-accent={lesson?.domain.accent ?? 'orange'} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold text-ink">{lesson ? lesson.lesson.title : 'Herhaalronde'}</span>
                      <span className="block text-caption font-semibold text-ink-muted">
                        {formatDay(entry.at)} · {Math.max(1, minutes(entry.activeMs))} min
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-0.5 text-small font-extrabold text-accent-ink tabular-nums">
                      {entry.graded ? `${entry.accuracy}%` : 'uitleg'}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function Stat({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="rounded-card border-2 border-line bg-surface px-5 py-4 shadow-slab-sm">
      <dt className="flex items-center gap-1.5 text-small font-bold text-ink-muted">
        <span className="text-green-ink">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1.5 font-display text-headline leading-none font-extrabold text-ink tabular-nums">{children}</dd>
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-card border-2 border-line bg-surface p-5 shadow-slab sm:p-6">
      <h2 className="mb-5 font-display text-title-sm font-extrabold">{title}</h2>
      {children}
    </section>
  );
}

function ActivityChart({ activity, goal }: { activity: Parameters<typeof recentDays>[0]; goal: number | null }) {
  const calm = useCalmMotion();
  const days = recentDays(activity, 14);
  const peak = Math.max(goal ?? 0, ...days.map((day) => minutes(day.activeMs)), 1);
  return (
    <figure>
      <div aria-hidden className="relative flex h-40 items-end gap-1.5">
        {goal && (
          <div className="absolute inset-x-0 border-t-2 border-dashed border-green-line" style={{ bottom: `${(goal / peak) * 100}%` }}>
            <span className="absolute -top-5 right-0 text-caption font-bold text-green-ink">doel {goal} min</span>
          </div>
        )}
        {days.map((day, i) => {
          const value = minutes(day.activeMs);
          const height = value > 0 ? Math.max(6, (value / peak) * 100) : 3;
          return (
            <motion.div
              key={day.key}
              className={value > 0 ? 'flex-1 origin-bottom rounded-t-md bg-green shadow-[inset_0_-3px_0_var(--color-green-deep)]' : 'flex-1 origin-bottom rounded-t-md bg-line'}
              style={{ height: `${height}%` }}
              initial={calm ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ ...transition.slow, delay: calm ? 0 : i * 0.025 }}
            />
          );
        })}
      </div>
      <div aria-hidden className="mt-2 flex gap-1.5 text-center text-[0.6875rem] font-bold text-ink-muted">
        {days.map((day, i) => (
          <span key={day.key} className="flex-1">
            {i % 2 === 1 || i === days.length - 1 ? weekdayShort(day.key) : ''}
          </span>
        ))}
      </div>
      <figcaption className="sr-only">
        <table>
          <caption>Oefentijd per dag, laatste twee weken</caption>
          <tbody>
            {days.map((day) => (
              <tr key={day.key}>
                <th scope="row">{day.key}</th>
                <td>{minutes(day.activeMs)} minuten</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
}
