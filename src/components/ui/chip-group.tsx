'use client';

import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import type { ReactNode } from 'react';
import type { Accent } from '@/content/accent';
import { cn } from '@/lib/cn';
import { play } from '@/lib/sound';

export type Chip<T extends string> = { value: T; label: ReactNode; count?: number; icon?: ReactNode; accent?: Accent; ariaLabel?: string };

type ChipGroupProps<T extends string> = {
  label: string;
  chips: readonly Chip<T>[];
  value: readonly T[];
  onChange: (value: T[]) => void;
  multiple?: boolean;
  /** Bij enkelvoudige keuze: altijd één chip ingedrukt houden. */
  required?: boolean;
  className?: string;
};

/**
 * Filterchips op Base UI ToggleGroup: één tabstop, pijltjestoetsen verplaatsen, spatie of
 * Enter drukt in. Een chip kan een eigen accent hebben (vakgebied, niveau).
 */
export function ChipGroup<T extends string>({ label, chips, value, onChange, multiple = false, required = false, className }: ChipGroupProps<T>) {
  return (
    <ToggleGroup
      aria-label={label}
      multiple={multiple}
      value={value as T[]}
      onValueChange={(next) => {
        if (required && next.length === 0) return;
        play('tap');
        onChange(next as T[]);
      }}
      className={cn('flex flex-wrap gap-2', className)}
    >
      {chips.map((chip) => (
        <Toggle
          key={chip.value}
          value={chip.value}
          aria-label={chip.ariaLabel}
          data-accent={chip.accent}
          className={cn(
            'group inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-3.5 text-small font-bold transition-[background-color,border-color,color,box-shadow] duration-150 outline-none select-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
            'border-line bg-surface text-ink-soft shadow-slab-sm hover:border-line-strong hover:text-ink',
            chip.accent
              ? 'data-[pressed]:border-accent data-[pressed]:bg-accent-soft data-[pressed]:text-accent-ink data-[pressed]:shadow-[0_2px_0_var(--accent-line)]'
              : 'data-[pressed]:border-ink data-[pressed]:bg-ink data-[pressed]:text-white data-[pressed]:shadow-[0_2px_0_rgb(0_0_0/0.25)]',
          )}
        >
          {chip.icon && <span className={cn('shrink-0', chip.accent && 'text-accent-ink')}>{chip.icon}</span>}
          {chip.label}
          {chip.count !== undefined && (
            <span
              className={cn(
                'min-w-5 rounded-full px-1.5 text-center text-[0.75rem] leading-5 tabular-nums',
                'bg-sunken text-ink-muted',
                chip.accent ? 'group-data-[pressed]:bg-surface group-data-[pressed]:text-accent-ink' : 'group-data-[pressed]:bg-white/20 group-data-[pressed]:text-white',
              )}
            >
              {chip.count}
            </span>
          )}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
