'use client';

import { ArrowRight, Check } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { exerciseCountLabel, type LessonEntry } from '@/content/catalog';
import type { SessionState } from '@/engine/session';
import { cn } from '@/lib/cn';
import type { ProgressData } from '@/state/progress';

export function lessonStatusText(entry: LessonEntry, progress: ProgressData, sessions: Record<string, SessionState>, isNext: boolean) {
  const session = sessions[entry.lesson.id];
  if (session && session.phase !== 'done') return `Bezig · stap ${Math.min(session.pos + 1, session.queue.length)} van ${session.queue.length}`;
  const record = progress.lessons[entry.lesson.id];
  if (record) return `Afgerond · ${record.bestAccuracy}% in één keer goed`;
  if (isNext) return 'Volgende les';
  return exerciseCountLabel(entry.lesson);
}

type LessonRowProps = {
  entry: LessonEntry;
  progress: ProgressData;
  sessions: Record<string, SessionState>;
  isNext: boolean;
  /** Toon de andere vakgebieden die meespelen. */
  showAlso?: boolean;
};

/** Een les als regel in een lijst: icoon, titel, status. Leidt direct naar de les. */
export function LessonRow({ entry, progress, sessions, isNext, showAlso = true }: LessonRowProps) {
  const done = Boolean(progress.lessons[entry.lesson.id]);
  return (
    <Link
      href={`/les/${entry.lesson.id}` as Route}
      data-accent={entry.domain.accent}
      className={cn(
        'group slab pressable flex min-h-16 items-center gap-3.5 rounded-tile border-2 px-3.5 py-2.5 [--lift:3px]',
        isNext ? 'border-accent bg-accent-soft [--slab:var(--accent)]' : 'border-line bg-surface hover:border-line-strong',
      )}
    >
      <span
        className={cn(
          'grid size-10 shrink-0 place-items-center rounded-control font-serif text-[0.95rem] font-semibold',
          done || isNext
            ? 'bg-accent text-accent-on shadow-[inset_0_-3px_0_rgb(0_0_0/0.14)]'
            : 'bg-sunken text-ink-muted shadow-[inset_0_-3px_0_var(--color-line)]',
        )}
      >
        {done ? <Check aria-hidden className="size-5" strokeWidth={3} /> : <span aria-hidden>{entry.lesson.icon}</span>}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block leading-snug font-bold text-ink">{entry.lesson.title}</span>
        <span className={cn('block text-caption font-semibold', isNext ? 'text-accent-ink' : 'text-ink-muted')}>
          {lessonStatusText(entry, progress, sessions, isNext)}
        </span>
        {showAlso && entry.also.length > 0 && (
          <span className="mt-1.5 flex flex-wrap gap-1">
            {entry.also.map((domain) => (
              <span
                key={domain.id}
                data-accent={domain.accent}
                className="inline-flex items-center rounded-full border border-accent-line bg-accent-soft px-2 py-px text-[0.75rem] leading-[1.15rem] font-bold text-accent-ink"
              >
                <span aria-hidden>+&nbsp;</span>
                <span className="sr-only">Ook: </span>
                {domain.name}
              </span>
            ))}
          </span>
        )}
      </span>
      <ArrowRight
        aria-hidden
        className="size-5 shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
        strokeWidth={2.5}
      />
    </Link>
  );
}
