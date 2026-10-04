'use client';

import { ArrowRight, Check, Info, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import type { Example, StepKind, StepOf } from '@/content/schema';
import type { ResponseOf } from '@/engine/responses';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { RichText } from '@/components/ui/rich-text';

export type StepProps<K extends StepKind> = {
  step: StepOf<K>;
  response: ResponseOf<K>;
  onChange: (response: ResponseOf<K>) => void;
  /** Tijdens feedback staat het antwoord vast. */
  locked: boolean;
  /** Uitkomst tijdens feedback. */
  correct: boolean | null;
  /** Stabiele sleutel van de stap (voor schudden en gedeelde animaties). */
  stepKey: string;
  /** Zelfde als de hoofdknop (bijv. Enter in een invulveld). */
  onSubmit: () => void;
};

/** De opdracht van de stap. Krijgt focus bij een nieuwe stap, zodat schermlezers hem voorlezen. */
export function StepHeading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1 data-step-heading tabIndex={-1} className={cn('font-display text-title font-extrabold outline-none', className)}>
      {children}
    </h1>
  );
}

/** Het "podium" waarop een taalvoorbeeld groot staat. */
export function Stage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-card border-2 border-line bg-sunken px-5 py-6 shadow-[inset_0_2px_0_rgb(16_24_40/0.03)] sm:px-7', className)}>
      {children}
    </div>
  );
}

/** Opdracht plus optionele korte inleiding (nieuwe oefenvormen hebben `prompt` en `intro`). */
export function StepIntro({ prompt, intro, className }: { prompt: string; intro?: string | undefined; className?: string }) {
  return (
    <div className={className}>
      <StepHeading>{prompt}</StepHeading>
      {intro && (
        <p className="mt-2 max-w-[60ch] text-body text-ink-soft">
          <RichText text={intro} />
        </p>
      )}
    </div>
  );
}

export type FeedbackTone = 'right' | 'wrong' | 'info';

const TONE: Record<FeedbackTone, { box: string; icon: ReactNode; label: string }> = {
  right: {
    box: 'border-green-line bg-green-soft text-green-ink',
    icon: <Check aria-hidden className="size-4" strokeWidth={3.25} />,
    label: 'Goed: ',
  },
  wrong: {
    box: 'border-red-line bg-red-soft text-red-ink',
    icon: <X aria-hidden className="size-4" strokeWidth={3.25} />,
    label: 'Nog niet: ',
  },
  info: {
    box: 'border-line bg-sunken text-ink-soft',
    icon: <Info aria-hidden className="size-4" strokeWidth={2.75} />,
    label: '',
  },
};

/**
 * Korte feedback binnen een oefening (per kaartje, per poging). Blijft staan tot de volgende
 * handeling, wordt voorgelezen, en houdt zijn hoogte vast zodat de knoppen eronder niet springen.
 * Geef een veranderende `id` mee om dezelfde tekst opnieuw te laten opkomen.
 */
export function InlineFeedback({
  tone,
  id,
  children,
  reserve = true,
  className,
}: {
  tone: FeedbackTone;
  id?: string | number;
  children: ReactNode;
  /** Reserveer ruimte voor één regel, ook als er (nog) niets staat. */
  reserve?: boolean;
  className?: string;
}) {
  const calm = useCalmMotion();
  const style = TONE[tone];
  const empty = children === null || children === undefined || children === false || children === '';
  return (
    <div aria-live="polite" className={cn(reserve && 'min-h-12', className)}>
      <AnimatePresence mode="wait" initial={false}>
        {!empty && (
          <motion.p
            key={`${tone}:${id ?? ''}`}
            initial={calm ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: transition.fast }}
            transition={transition.base}
            className={cn('flex items-start gap-2.5 rounded-control border-2 px-3.5 py-2.5 text-small font-semibold', style.box)}
          >
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center">{style.icon}</span>
            <span className="min-w-0">
              {style.label && <span className="sr-only">{style.label}</span>}
              {children}
            </span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Hint({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-small font-semibold text-ink-muted', className)}>{children}</p>;
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-grid h-6 min-w-6 place-items-center rounded-[0.4rem] border-2 border-b-[3px] border-line-strong bg-surface px-1 font-sans text-[0.7rem] leading-none font-extrabold text-ink-muted">
      {children}
    </kbd>
  );
}

export function Examples({ examples, className }: { examples: Example[]; className?: string }) {
  return (
    <ul className={cn('space-y-2', className)}>
      {examples.map((example, i) => (
        <li key={i} className="flex flex-wrap items-center gap-2.5 rounded-tile border-2 border-line bg-surface px-3.5 py-2.5">
          {example.wrong && (
            <>
              <span className="rounded-chip bg-red-soft px-2 py-0.5 font-serif text-[1.125rem] text-red-ink line-through decoration-2">
                <span className="sr-only">Fout: </span>
                {example.wrong}
              </span>
              <ArrowRight aria-hidden className="size-4 text-ink-muted" strokeWidth={2.75} />
            </>
          )}
          <span className="rounded-chip bg-green-soft px-2 py-0.5 font-serif text-[1.125rem] text-green-ink">
            {example.wrong && <span className="sr-only">Goed: </span>}
            {example.right}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function RuleCard({ text }: { text: string }) {
  return (
    <div className="flex gap-4 rounded-card border-2 border-accent-line bg-accent-soft p-4 shadow-[0_4px_0_var(--accent-line)]">
      <span className="grid size-10 shrink-0 place-items-center rounded-control bg-accent text-accent-on shadow-[inset_0_-3px_0_rgb(0_0_0/0.14)]">
        <Sparkles aria-hidden className="size-5" strokeWidth={2.5} />
      </span>
      <p className="self-center font-display text-lead leading-snug font-bold text-ink">
        <span className="sr-only">Regel: </span>
        <RichText text={text} />
      </p>
    </div>
  );
}

export function isTypingTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
}

/** Een taak binnen de uitleg (knippen, markeren, …): titel, inhoud, status. */
export function TaskBox({
  icon,
  title,
  solved,
  status,
  children,
}: {
  icon: ReactNode;
  title: ReactNode;
  solved: boolean;
  status: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        'rounded-card border-2 p-4 transition-colors duration-300 sm:p-5',
        solved ? 'border-green-line bg-green-soft' : 'border-line bg-sunken',
      )}
    >
      <h2 className="flex items-center gap-2.5 font-display text-body font-bold text-ink">
        <span className={cn('grid size-8 shrink-0 place-items-center rounded-chip', solved ? 'bg-green text-green-on' : 'bg-surface text-accent-ink shadow-slab-sm')}>
          {icon}
        </span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
      <p role="status" className={cn('mt-4 text-small font-semibold', solved ? 'text-green-ink' : 'text-ink-muted')}>
        {status}
      </p>
    </section>
  );
}
