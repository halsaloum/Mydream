import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Pim, type PimMood } from '../brand/pim';

type EmptyStateProps = {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  mood?: PimMood;
  className?: string;
};

/** Lege toestand: Pim, een heldere zin over wat hier komt, en wat je nu kunt doen. */
export function EmptyState({ title, children, action, mood = 'idle', className }: EmptyStateProps) {
  return (
    <div className={cn('stagger flex flex-col items-center px-6 py-12 text-center', className)}>
      <span>
        <span className="block animate-float">
          <Pim mood={mood} size="lg" />
        </span>
      </span>
      <h2 className="mt-5 font-display text-title font-extrabold">{title}</h2>
      <div className="mt-2 max-w-md text-body text-ink-muted">{children}</div>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/** Laadtoestand die de vorm van de pagina al aanhoudt, zodat er niets verspringt. */
export function PageSkeleton({ blocks = ['h-12 w-2/3', 'h-48', 'h-72'] }: { blocks?: string[] }) {
  return (
    <div aria-busy="true" aria-live="polite" className="flex flex-col gap-5">
      <span className="sr-only">Je gegevens worden geladen…</span>
      {blocks.map((block, i) => (
        <div key={i} className={cn('skeleton', block)} />
      ))}
    </div>
  );
}
