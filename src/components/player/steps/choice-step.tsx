'use client';

import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { Check, Plus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useId } from 'react';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { isTypingTarget, Kbd, Stage, StepHeading, type StepProps } from './shared';

type ChoiceProps = StepProps<'choice'> | StepProps<'combine'>;

/** Meerkeuze en zinnen combineren, op Base UI RadioGroup. Cijfertoetsen kiezen direct. */
export function ChoiceStep(props: ChoiceProps) {
  const { step, response, locked, correct } = props;
  const calm = useCalmMotion();
  const headingId = useId();
  const value = response.value;
  const select = (next: string) => {
    if (locked) return;
    play('select');
    if (props.step.kind === 'choice') (props as StepProps<'choice'>).onChange({ kind: 'choice', value: next });
    else (props as StepProps<'combine'>).onChange({ kind: 'combine', value: next });
  };

  useEffect(() => {
    if (locked) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
      if (document.querySelector('[role="dialog"]')) return;
      const n = Number(event.key);
      const option = Number.isInteger(n) && n >= 1 ? step.options[n - 1] : undefined;
      if (option) select(option);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const long = step.options.some((option) => option.length > 22);
  const columns = long ? '' : step.options.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3';
  const blankState = locked ? (correct ? 'correct' : 'wrong') : value ? 'filled' : 'empty';

  return (
    <div>
      <StepHeading>
        <span id={headingId}>{step.prompt}</span>
      </StepHeading>

      {step.kind === 'choice' && (step.before || step.after) && (
        <Stage className="mt-6">
          <p className="font-serif text-example text-ink" lang="nl">
            {step.before}{' '}
            <span
              className={cn(
                'relative inline-grid min-w-[5.5ch] place-items-center rounded-control border-2 px-2 align-baseline transition-colors duration-200',
                blankState === 'empty' && 'border-dashed border-line-strong bg-surface',
                blankState === 'filled' && 'border-accent bg-accent-soft text-accent-ink',
                blankState === 'correct' && 'border-green bg-green-soft text-green-ink',
                blankState === 'wrong' && 'border-red bg-red-soft text-red-ink',
              )}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={value ?? '∅'}
                  initial={calm ? false : { y: -14, opacity: 0, scale: 0.92 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 10, opacity: 0, transition: transition.fast }}
                  transition={transition.base}
                >
                  {value ?? <span aria-hidden>&nbsp;</span>}
                </motion.span>
              </AnimatePresence>
              <span className="sr-only">{value ? `(gekozen: ${value})` : '(nog leeg)'}</span>
            </span>{' '}
            {step.after}
          </p>
        </Stage>
      )}

      {step.kind === 'combine' && (
        <div className="mt-6 flex flex-wrap items-center gap-3 font-serif text-[1.375rem] text-ink">
          <span className="rounded-tile border-2 border-yellow-line bg-yellow-soft px-3.5 py-1.5">{step.a}</span>
          <Plus aria-label="plus" className="size-5 text-ink-muted" strokeWidth={3} />
          <span className="rounded-tile border-2 border-blue-line bg-blue-soft px-3.5 py-1.5">{step.b}</span>
        </div>
      )}

      <RadioGroup
        aria-labelledby={headingId}
        value={value ?? ''}
        onValueChange={(next) => select(String(next))}
        readOnly={locked}
        className={cn('stagger mt-8 grid gap-3', columns)}
      >
        {step.options.map((option, i) => {
          const isAnswer = option === step.answer;
          const chosen = option === value;
          const feedback = locked ? (isAnswer ? 'right' : chosen ? 'wrong' : 'other') : null;
          return (
            <Radio.Root
              key={option}
              value={option}
              className={cn(
                'group slab pressable flex min-h-16 items-center gap-3.5 rounded-tile border-2 px-4 py-3.5 text-left [--lift:4px]',
                !feedback && 'border-line bg-surface hover:border-accent-line data-[checked]:border-accent data-[checked]:bg-accent-soft data-[checked]:[--slab:var(--accent)]',
                feedback === 'right' && 'animate-pulse-pop border-green bg-green-soft [--slab:var(--color-green)] [--glow:color-mix(in_oklab,var(--color-green)_55%,transparent)]',
                feedback === 'wrong' && 'border-red bg-red-soft [--slab:var(--color-red)]',
                feedback === 'other' && 'border-line bg-surface opacity-60 shadow-none',
                locked && 'pointer-events-none',
              )}
            >
              <span
                className={cn(
                  'grid size-7 shrink-0 place-items-center rounded-chip border-2 text-[0.75rem] font-extrabold transition-[background-color,border-color,color,transform] duration-300 ease-[var(--ease-spring)] group-data-[checked]:scale-110',
                  !feedback && 'border-line-strong text-ink-muted group-data-[checked]:border-accent-ink group-data-[checked]:bg-accent-ink group-data-[checked]:text-white',
                  feedback === 'right' && 'border-green-ink bg-green-ink text-white',
                  feedback === 'wrong' && 'border-red-ink bg-red-ink text-white',
                  feedback === 'other' && 'border-line text-ink-muted',
                )}
              >
                {feedback === 'right' ? <Check aria-hidden className="size-4" strokeWidth={3.5} /> : feedback === 'wrong' ? <X aria-hidden className="size-4" strokeWidth={3.5} /> : i + 1}
              </span>
              <span className={cn('flex-1 font-serif text-ink', long ? 'text-[1.1875rem] leading-snug' : 'text-[1.375rem] leading-tight')}>{option}</span>
              {feedback === 'right' && <span className="sr-only">(goede antwoord)</span>}
              {feedback === 'wrong' && <span className="sr-only">(jouw keuze, niet goed)</span>}
            </Radio.Root>
          );
        })}
      </RadioGroup>
      {!locked && (
        <p className="mt-4 hidden items-center gap-1.5 text-caption font-semibold text-ink-muted sm:flex">
          Kies met <Kbd>1</Kbd>–<Kbd>{step.options.length}</Kbd> of met de pijltjes, en controleer met <Kbd>Enter</Kbd>.
        </p>
      )}
    </div>
  );
}
