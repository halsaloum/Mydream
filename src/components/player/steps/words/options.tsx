'use client';

import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { Check, X } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '@/lib/cn';
import { play } from '@/lib/sound';
import { isTypingTarget, Kbd } from '../shared';

/**
 * Keuzes onder elkaar, voor "Raad eerst" en "Denk na". De volgorde komt van buiten (geschud met
 * `seed`); cijfertoetsen kiezen direct.
 */
export function OptionList({
  labelledBy,
  options,
  value,
  answer,
  locked,
  onSelect,
  serif = true,
}: {
  labelledBy: string;
  options: readonly string[];
  value: string | null;
  answer: string;
  locked: boolean;
  onSelect: (value: string) => void;
  /** Taalvoorbeelden in de schreefletter; uitleg (betekenissen) gewoon. */
  serif?: boolean;
}) {
  const select = (next: string) => {
    if (locked) return;
    play('select');
    onSelect(next);
  };

  useEffect(() => {
    if (locked) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
      if (document.querySelector('[role="dialog"]')) return;
      const n = Number(event.key);
      const option = Number.isInteger(n) && n >= 1 ? options[n - 1] : undefined;
      if (option) select(option);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <>
      <RadioGroup aria-labelledby={labelledBy} value={value ?? ''} onValueChange={(next) => select(String(next))} readOnly={locked} className="stagger mt-7 grid gap-3">
        {options.map((option, i) => {
          const isAnswer = option === answer;
          const chosen = option === value;
          const verdict = locked ? (isAnswer ? 'right' : chosen ? 'wrong' : 'other') : null;
          return (
            <Radio.Root
              key={option}
              value={option}
              className={cn(
                'group slab pressable flex min-h-16 items-center gap-3.5 rounded-tile border-2 px-4 py-3.5 text-left [--lift:4px]',
                !verdict && 'border-line bg-surface hover:border-accent-line data-[checked]:border-accent data-[checked]:bg-accent-soft data-[checked]:[--slab:var(--accent)]',
                verdict === 'right' && 'animate-pulse-pop border-green bg-green-soft [--slab:var(--color-green)]',
                verdict === 'wrong' && 'border-red bg-red-soft [--slab:var(--color-red)]',
                verdict === 'other' && 'border-line bg-surface opacity-60 shadow-none',
                locked && 'pointer-events-none',
              )}
            >
              <span
                className={cn(
                  'grid size-7 shrink-0 place-items-center rounded-chip border-2 text-[0.75rem] font-extrabold transition-[background-color,border-color,color,transform] duration-300 ease-[var(--ease-spring)] group-data-[checked]:scale-110',
                  !verdict && 'border-line-strong text-ink-muted group-data-[checked]:border-accent-ink group-data-[checked]:bg-accent-ink group-data-[checked]:text-white',
                  verdict === 'right' && 'border-green-ink bg-green-ink text-white',
                  verdict === 'wrong' && 'border-red-ink bg-red-ink text-white',
                  verdict === 'other' && 'border-line text-ink-muted',
                )}
              >
                {verdict === 'right' ? <Check aria-hidden className="size-4" strokeWidth={3.5} /> : verdict === 'wrong' ? <X aria-hidden className="size-4" strokeWidth={3.5} /> : i + 1}
              </span>
              <span className={cn('flex-1 text-ink', serif ? 'font-serif text-[1.25rem] leading-snug' : 'text-body leading-snug font-semibold')} lang="nl">
                {option}
              </span>
              {verdict === 'right' && <span className="sr-only">(goede antwoord)</span>}
              {verdict === 'wrong' && <span className="sr-only">(jouw keuze, niet goed)</span>}
            </Radio.Root>
          );
        })}
      </RadioGroup>
      {!locked && (
        <p className="mt-4 hidden items-center gap-1.5 text-caption font-semibold text-ink-muted sm:flex">
          Kies met <Kbd>1</Kbd>–<Kbd>{options.length}</Kbd> of tik op een antwoord.
        </p>
      )}
    </>
  );
}
