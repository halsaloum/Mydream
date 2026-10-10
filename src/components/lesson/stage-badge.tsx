import type { Accent, Stage } from '@/content/schema';
import { cn } from '@/lib/cn';

export const STAGE_LABELS: Record<Stage, string> = { regels: 'Regels', toets: 'Toets', bachelor: 'Bachelor', master: 'Master' };

export const STAGE_ACCENTS: Record<Stage, Accent> = { regels: 'teal', toets: 'orange', bachelor: 'blue', master: 'purple' };

/** In welke stap een les hoort: regels, toets, bachelor of master. */
export function StageBadge({ stage, className }: { stage: Stage; className?: string }) {
  return (
    <span
      data-accent={STAGE_ACCENTS[stage]}
      className={cn(
        'inline-flex items-center rounded-full border border-accent-line bg-accent-soft px-2 py-px text-[0.75rem] leading-[1.15rem] font-bold text-accent-ink',
        className,
      )}
    >
      <span className="sr-only">Stap: </span>
      {STAGE_LABELS[stage]}
    </span>
  );
}
