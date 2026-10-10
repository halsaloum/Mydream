'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { motion } from 'motion/react';
import type { ReactNode, Ref } from 'react';
import { cn } from '@/lib/cn';
import { spring } from '@/lib/motion';

export type TileState = 'idle' | 'held' | 'correct' | 'wrong' | 'ghost' | 'dragging' | 'target' | 'muted';

const FACE: Record<TileState, string> = {
  idle: 'border-line bg-surface text-ink [--slab:var(--color-line-strong)] group-hover:border-accent-line',
  held: 'border-accent bg-accent-soft text-ink [--slab:var(--accent)] [--glow:color-mix(in_oklab,var(--accent-deep)_50%,transparent)] -translate-y-1',
  correct: 'animate-pulse-pop border-green bg-green-soft text-green-ink [--slab:var(--color-green)] [--glow:color-mix(in_oklab,var(--color-green)_50%,transparent)]',
  wrong: 'border-red bg-red-soft text-red-ink [--slab:var(--color-red)] [--glow:color-mix(in_oklab,var(--color-red)_45%,transparent)]',
  ghost: 'border-dashed border-line-strong bg-transparent text-transparent shadow-none',
  dragging: 'border-dashed border-line-strong bg-sunken text-ink-muted shadow-none',
  target: 'border-accent bg-accent-soft text-ink [--slab:var(--accent)]',
  muted: 'border-line bg-sunken text-ink-muted shadow-none',
};

const PRESS =
  'group-hover:-translate-y-px group-active:translate-y-[var(--lift)] group-active:shadow-none group-data-[disabled]:translate-y-0';

type TileProps = Omit<BaseButton.Props, 'className' | 'children' | 'render'> & {
  children: ReactNode;
  state?: TileState;
  /** Gedeelde id: het kaartje beweegt zichtbaar naar zijn nieuwe plek. */
  layoutId?: string;
  /** Animeer herschikken binnen dezelfde lijst. */
  layout?: boolean;
  size?: 'md' | 'lg' | 'block';
  className?: string;
  faceClassName?: string;
  ref?: Ref<HTMLButtonElement>;
};

/**
 * Een oefenkaartje. De buitenste knop (Base UI Button als motion.button) is van Motion;
 * het zichtbare "vlak" erin draagt de tastbare schaduw en de druk-animatie in CSS.
 * Zo beheren Motion, CSS en dnd-kit nooit dezelfde transform.
 */
export function Tile({ children, state = 'idle', layoutId, layout, size = 'md', className, faceClassName, ref, ...props }: TileProps) {
  const interactive = state === 'idle' || state === 'held' || state === 'target';
  return (
    <BaseButton
      ref={ref}
      {...props}
      render={<motion.button layout={layout || layoutId ? 'position' : undefined} layoutId={layoutId} transition={spring.tile} />}
      className={cn(
        'group relative touch-manipulation rounded-tile text-left outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
        size === 'block' && 'w-full',
        className,
      )}
    >
      <span
        className={cn(
          'slab flex items-center gap-3 rounded-tile border-2 transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-[var(--ease-spring)] [--lift:3px]',
          size === 'md' && 'min-h-12 px-4 py-2 font-serif text-[1.375rem] leading-tight',
          size === 'lg' && 'min-h-14 px-5 py-2.5 font-serif text-[1.625rem] leading-tight',
          size === 'block' && 'min-h-14 w-full px-4 py-3 font-serif text-[1.1875rem] leading-snug',
          FACE[state],
          interactive && PRESS,
          faceClassName,
        )}
      >
        {children}
      </span>
    </BaseButton>
  );
}
