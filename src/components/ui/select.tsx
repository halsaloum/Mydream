'use client';

import { Select } from '@base-ui/react/select';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export type SelectOption<T extends string> = { value: T; label: string };

type SelectFieldProps<T extends string> = {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly SelectOption<T>[];
  className?: string;
};

/** Keuzelijst op Base UI Select: toetsenbord, typ-om-te-zoeken en focus komen van Base UI. */
export function SelectField<T extends string>({ label, value, onChange, options, className }: SelectFieldProps<T>) {
  return (
    <Select.Root items={options as SelectOption<T>[]} value={value} onValueChange={(next) => next !== null && onChange(next as T)}>
      <div className={cn('flex flex-col gap-1.5', className)}>
        <Select.Label className="text-small font-bold text-ink">{label}</Select.Label>
        <Select.Trigger className="flex min-h-12 w-full items-center justify-between gap-3 rounded-control border-2 border-line bg-surface px-4 text-left text-body font-semibold text-ink shadow-slab-sm transition-colors outline-none hover:border-line-strong focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus data-[popup-open]:border-line-strong">
          <Select.Value className="truncate" />
          <Select.Icon className="shrink-0 text-ink-muted">
            <ChevronsUpDown aria-hidden className="size-4" strokeWidth={2.5} />
          </Select.Icon>
        </Select.Trigger>
      </div>
      <Select.Portal>
        <Select.Positioner sideOffset={6} className="z-[60] outline-none select-none">
          <Select.Popup className="min-w-[var(--anchor-width)] origin-[var(--transform-origin)] rounded-tile border-2 border-line bg-surface p-1.5 shadow-float outline-none transition-[scale,opacity] duration-150 data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0 data-[side=none]:data-[starting-style]:scale-100 data-[side=none]:data-[starting-style]:opacity-100">
            <Select.List className="max-h-[min(22rem,var(--available-height))] overflow-y-auto scroll-py-2">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="grid min-h-11 cursor-default grid-cols-[1.25rem_1fr] items-center gap-2 rounded-chip px-2.5 py-2 text-body font-semibold text-ink outline-none select-none data-[highlighted]:bg-sunken data-[selected]:text-accent-ink"
                >
                  <Select.ItemIndicator className="col-start-1">
                    <Check aria-hidden className="size-4" strokeWidth={3} />
                  </Select.ItemIndicator>
                  <Select.ItemText className="col-start-2">{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
