'use client';

import { Slider } from '@base-ui/react/slider';
import { Switch } from '@base-ui/react/switch';
import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type ToggleRowProps = {
  label: string;
  description?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

/** Instelling met schakelaar op Base UI Switch; de hele regel is het label. */
export function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div className="min-w-0">
        <label htmlFor={id} className="block font-display text-title-sm font-bold text-ink">
          {label}
        </label>
        {description && <p className="mt-0.5 text-small text-ink-muted">{description}</p>}
      </div>
      <Switch.Root
        id={id}
        checked={checked}
        onCheckedChange={(next) => onChange(next)}
        className="relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border-2 border-line-strong bg-line p-0.5 transition-colors duration-200 data-[checked]:border-green-deep data-[checked]:bg-green"
      >
        <Switch.Thumb className="size-6 rounded-full bg-surface shadow-[0_2px_0_rgb(16_24_40/0.18)] transition-transform duration-200 ease-[var(--ease-out-soft)] data-[checked]:translate-x-6" />
      </Switch.Root>
    </div>
  );
}

type RangeProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  onCommit?: (value: number) => void;
  disabled?: boolean;
  format?: (value: number) => string;
  className?: string;
};

/** Schuifregelaar (0–1) op Base UI Slider. */
export function Range({ label, value, onChange, onCommit, disabled, format, className }: RangeProps) {
  const text = format ? format(value) : `${Math.round(value * 100)}%`;
  return (
    <Slider.Root
      value={value}
      min={0}
      max={1}
      step={0.05}
      disabled={disabled}
      onValueChange={(next) => onChange(Array.isArray(next) ? (next[0] ?? 0) : next)}
      onValueCommitted={(next) => onCommit?.(Array.isArray(next) ? (next[0] ?? 0) : next)}
      className={cn('flex flex-col gap-2', className)}
    >
      <div className="flex items-center justify-between">
        <Slider.Label className="text-small font-bold text-ink">{label}</Slider.Label>
        <Slider.Value className="text-small font-semibold text-ink-muted tabular-nums">{() => text}</Slider.Value>
      </div>
      <Slider.Control className="flex h-11 w-full touch-none items-center select-none data-[disabled]:opacity-50">
        <Slider.Track className="relative h-3 w-full rounded-full bg-line shadow-[inset_0_2px_0_rgb(16_24_40/0.06)]">
          <Slider.Indicator className="rounded-full bg-green" />
          <Slider.Thumb
            aria-label={label}
            getAriaValueText={() => text}
            className="size-7 rounded-full border-2 border-green-deep bg-surface shadow-[0_3px_0_var(--color-green-deep)] outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus"
          />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  );
}
