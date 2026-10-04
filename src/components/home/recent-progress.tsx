'use client';

import { ArrowRight, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { getLessonEntry } from '@/content/catalog';
import { DomainGlyph } from '@/components/brand/glyphs';
import { formatDay, minutes } from '@/lib/dates';
import type { ProgressData } from '@/state/progress';
import { REVIEW_BATCH, reviewList } from '@/state/selectors';

function ReviewStack({ count }: { count: number }) {
  if (count === 0) {
    return (
      <div className="flex flex-col justify-center rounded-card border-2 border-dashed border-line-strong px-6 py-6">
        <p className="font-display text-title-sm font-bold text-ink">Geen oefenpunten</p>
        <p className="mt-1 text-small text-ink-muted">Opdrachten die je de eerste keer mist, komen hier vanzelf terug.</p>
      </div>
    );
  }
  const shown = Math.min(count, REVIEW_BATCH);
  return (
    <Link
      href="/herhalen"
      data-accent="orange"
      className="group slab pressable flex items-center gap-5 rounded-card border-2 border-line bg-surface px-6 py-5 hover:border-line-strong"
    >
      <span aria-hidden className="relative h-16 w-14 shrink-0">
        {[2, 1, 0].map((k) => (
          <span
            key={k}
            className="absolute inset-0 rounded-tile border-2 border-line bg-surface transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:rotate-0"
            style={{ transform: `rotate(${(k - 1) * 8}deg) translateY(${k * -2}px)`, zIndex: 3 - k }}
          />
        ))}
        <span className="absolute inset-0 z-10 grid place-items-center font-display text-title font-extrabold text-accent-ink tabular-nums">{shown}</span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-title-sm font-bold text-ink">Herhaalstapel</span>
        <span className="block text-small text-ink-muted">
          {count === 1 ? 'Eén opdracht om nog eens te proberen' : `${count} opdrachten om nog eens te proberen`}
        </span>
      </span>
      <ArrowRight aria-hidden className="size-5 text-ink-muted transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
    </Link>
  );
}

/** Wat de leerling recent deed. Alleen echte sessies; zonder geschiedenis een eerlijke lege toestand. */
export function RecentProgress({ progress }: { progress: ProgressData }) {
  const recent = progress.history.slice(0, 4);
  const reviewCount = reviewList(progress).length;
  return (
    <section aria-labelledby="recent-titel">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 id="recent-titel" className="font-display text-title font-extrabold">
          Recente voortgang
        </h2>
        {recent.length > 0 && (
          <Link href="/voortgang" className="rounded-chip font-bold text-ink-muted underline-offset-4 hover:text-ink hover:underline">
            Alle voortgang
          </Link>
        )}
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        {recent.length > 0 ? (
          <ol className="divide-y-2 divide-line overflow-hidden rounded-card border-2 border-line bg-surface shadow-slab">
            {recent.map((item) => {
              const entry = item.mode === 'lesson' ? getLessonEntry(item.id) : undefined;
              return (
                <li key={`${item.id}-${item.at}`} data-accent={entry?.domain.accent ?? 'orange'} className="flex items-center gap-4 px-5 py-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-control bg-accent-soft text-accent-ink">
                    {entry ? <DomainGlyph id={entry.domain.id} /> : <RotateCcw aria-hidden className="size-5" strokeWidth={2.5} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-ink">{entry?.lesson.title ?? 'Herhaling'}</p>
                    <p className="text-caption text-ink-muted">
                      {formatDay(item.at)} · {Math.max(1, minutes(item.activeMs))} min
                    </p>
                  </div>
                  <p className="text-right">
                    <span className="block font-display text-title-sm font-extrabold text-ink tabular-nums">{item.accuracy}%</span>
                    <span className="block text-caption text-ink-muted">in één keer goed</span>
                  </p>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="rounded-card border-2 border-dashed border-line-strong px-6 py-6">
            <p className="font-display text-title-sm font-bold text-ink">Nog niets afgerond</p>
            <p className="mt-1 text-small text-ink-muted">Na je eerste les zie je hier wat je deed en hoe het ging.</p>
          </div>
        )}
        <ReviewStack count={reviewCount} />
      </div>
    </section>
  );
}
