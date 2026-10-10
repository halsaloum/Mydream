'use client';

import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type Option<T extends string> = { value: T; label: ReactNode; hint?: ReactNode; disabled?: boolean };

type OptionGroupProps<T extends string> = {
  value: T | null;
  onChange: (value: T) => void;
  options: readonly Option<T>[];
  'aria-labelledby'?: string;
  'aria-label'?: string;
  layout?: 'stack' | 'grid';
  className?: string;
};

/**
 * Keuzes als kaarten op Base UI RadioGroup: pijltjestoetsen verplaatsen, spatie kiest,
 * en de groep is één tabstop.
 */
export function OptionGroup<T extends string>({ value, onChange, options, layout = 'stack', className, ...aria }: OptionGroupProps<T>) {
  return (
    <RadioGroup
      value={value ?? ''}
      onValueChange={(next) => onChange(next as T)}
      className={cn(layout === 'grid' ? 'grid gap-3 sm:grid-cols-2' : 'grid gap-3', className)}
      {...aria}
    >
      {options.map((option) => (
        <Radio.Root
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          className={cn(
            'group slab pressable flex min-h-16 w-full items-center gap-4 rounded-tile border-2 border-line bg-surface px-5 py-3.5 text-left',
            'hover:border-line-strong',
            'data-[checked]:border-accent data-[checked]:bg-accent-soft data-[checked]:[--slab:var(--accent)] data-[checked]:[--glow:color-mix(in_oklab,var(--accent-deep)_45%,transparent)]',
          )}
        >
          <span
            aria-hidden
            className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-line-strong bg-surface transition-[background-color,border-color,transform] duration-300 ease-[var(--ease-spring)] group-data-[checked]:scale-110 group-data-[checked]:border-accent-ink group-data-[checked]:bg-accent-ink"
          >
            <Check
              className="size-3.5 scale-50 text-white opacity-0 transition-[opacity,transform] duration-300 ease-[var(--ease-spring)] group-data-[checked]:scale-100 group-data-[checked]:opacity-100"
              strokeWidth={3.5}
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-title-sm font-bold text-ink">{option.label}</span>
            {option.hint && <span className="mt-0.5 block text-small text-ink-muted group-data-[checked]:text-accent-ink">{option.hint}</span>}
          </span>
        </Radio.Root>
      ))}
    </RadioGroup>
  );
}
