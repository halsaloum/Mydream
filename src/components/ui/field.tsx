'use client';

import { Field } from '@base-ui/react/field';
import type { ReactNode, Ref } from 'react';
import { cn } from '@/lib/cn';

const control =
  'w-full rounded-control border-2 border-line bg-surface px-4 text-body text-ink shadow-[inset_0_2px_0_rgb(16_24_40/0.04)] transition-colors placeholder:text-ink-muted hover:border-line-strong focus:border-focus focus:outline-none focus-visible:outline-none data-[disabled]:bg-sunken data-[disabled]:text-ink-muted';

type TextFieldProps = {
  label: string;
  hideLabel?: boolean;
  description?: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'search';
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  inputRef?: Ref<HTMLInputElement>;
  autoFocus?: boolean;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};

/** Tekstveld op Base UI Field: label, beschrijving en invoer zijn correct gekoppeld. */
export function TextField({
  label,
  hideLabel,
  description,
  value,
  onChange,
  placeholder,
  type = 'text',
  icon,
  disabled,
  className,
  inputClassName,
  inputRef,
  autoFocus,
  onKeyDown,
}: TextFieldProps) {
  return (
    <Field.Root disabled={disabled} className={cn('flex flex-col gap-1.5', className)}>
      <Field.Label className={cn('text-small font-bold text-ink', hideLabel && 'sr-only')}>{label}</Field.Label>
      <div className="relative">
        {icon && <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-muted">{icon}</span>}
        <Field.Control
          ref={inputRef}
          type={type}
          value={value}
          onValueChange={(next) => onChange(next)}
          placeholder={placeholder}
          autoComplete="off"
          autoFocus={autoFocus}
          onKeyDown={onKeyDown}
          className={cn(control, 'min-h-12', icon ? 'pl-11' : undefined, inputClassName)}
        />
      </div>
      {description && <Field.Description className="text-caption text-ink-muted">{description}</Field.Description>}
    </Field.Root>
  );
}

type TextAreaProps = {
  label: string;
  hideLabel?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
  textareaClassName?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  autoFocus?: boolean;
  description?: ReactNode;
};

export function TextArea({
  label,
  hideLabel,
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled,
  className,
  textareaClassName,
  onKeyDown,
  autoFocus,
  description,
}: TextAreaProps) {
  return (
    <Field.Root disabled={disabled} className={cn('flex flex-col gap-1.5', className)}>
      <Field.Label className={cn('text-small font-bold text-ink', hideLabel && 'sr-only')}>{label}</Field.Label>
      <Field.Control
        render={<textarea rows={rows} onKeyDown={onKeyDown} />}
        value={value}
        onValueChange={(next) => onChange(next)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        spellCheck={false}
        className={cn(control, 'resize-none py-3.5 leading-relaxed', textareaClassName)}
      />
      {description && <Field.Description className="text-caption text-ink-muted">{description}</Field.Description>}
    </Field.Root>
  );
}
