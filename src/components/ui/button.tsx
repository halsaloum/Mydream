'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { Tooltip } from '@base-ui/react/tooltip';
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'slab pressable gloss border-green bg-green text-green-on [--slab:var(--color-green-deep)] [--glow:color-mix(in_oklab,var(--color-green-deep)_60%,transparent)] hover:bg-[#61d40c] hover:border-[#61d40c]',
  accent:
    'slab pressable gloss border-accent bg-accent text-accent-on [--slab:var(--accent-deep)] [--glow:color-mix(in_oklab,var(--accent-deep)_60%,transparent)] hover:brightness-[1.05]',
  secondary:
    'slab pressable border-line bg-surface text-ink [--slab:var(--color-line-strong)] hover:border-line-strong hover:bg-white',
  ghost: 'border-transparent bg-transparent text-ink-soft transition-colors hover:bg-ink/[0.06] hover:text-ink active:bg-ink/[0.1]',
  danger:
    'slab pressable gloss border-red bg-red text-red-on [--slab:var(--color-red-deep)] [--glow:color-mix(in_oklab,var(--color-red-deep)_60%,transparent)] hover:brightness-[1.05]',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'min-h-11 gap-1.5 px-4 text-small',
  md: 'min-h-12 gap-2 px-5 text-body',
  lg: 'min-h-14 gap-2.5 px-7 text-lead',
};

const DISABLED =
  'data-[disabled]:border-line data-[disabled]:bg-line data-[disabled]:bg-none data-[disabled]:text-ink-disabled data-[disabled]:[--slab:transparent] data-[disabled]:[--glow:transparent] data-[disabled]:hover:brightness-100';

export function buttonClass({
  variant = 'primary',
  size = 'md',
  block = false,
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; block?: boolean; className?: string | undefined } = {}) {
  return cn(
    'relative inline-flex shrink-0 select-none items-center justify-center rounded-control border-2 font-display font-bold leading-tight tracking-[-0.01em] [&_svg]:shrink-0',
    VARIANTS[variant],
    SIZES[size],
    DISABLED,
    block && 'w-full',
    className,
  );
}

export type ButtonProps = Omit<BaseButton.Props, 'className'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
};

/** Knop op Base UI: houdt focus, toetsenbord en uitgeschakelde toestand correct. */
export function Button({ variant, size, block, className, type = 'button', ...props }: ButtonProps) {
  return <BaseButton type={type} {...props} className={buttonClass({ variant, size, block, className })} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize; block?: boolean };

/** Navigatie die eruitziet als knop (een link blijft een link). */
export function ButtonLink({ variant, size, block, className, ...props }: ButtonLinkProps) {
  return <Link {...props} className={buttonClass({ variant, size, block, className })} />;
}

type IconButtonProps = Omit<ButtonProps, 'children' | 'size'> & {
  label: string;
  icon: ReactNode;
  /** Toon de tekst naast het icoon vanaf deze breedte. */
  showLabelFrom?: 'sm' | 'md';
};

/** Knop met alleen een icoon: altijd een toegankelijke naam en een tooltip. */
export function IconButton({ label, icon, showLabelFrom, variant = 'ghost', className, ...props }: IconButtonProps) {
  const button = (
    <Button
      {...props}
      variant={variant}
      size="sm"
      aria-label={showLabelFrom ? undefined : label}
      className={cn(showLabelFrom ? 'px-3' : 'w-11 px-0', className)}
    >
      {icon}
      {showLabelFrom && <span className={showLabelFrom === 'sm' ? 'max-sm:sr-only' : 'max-md:sr-only'}>{label}</span>}
    </Button>
  );
  if (showLabelFrom) return button;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger render={button} />
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={8} className="z-[70]">
          <Tooltip.Popup className="origin-[var(--transform-origin)] rounded-chip bg-ink px-2.5 py-1.5 text-caption font-semibold text-white shadow-float transition-[opacity,scale] duration-200 ease-[var(--ease-spring)] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            {label}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
