'use client';

import { Progress } from '@base-ui/react/progress';
import { motion, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';

type ProgressBarProps = {
  value: number;
  max?: number;
  label: string;
  valueText?: string;
  size?: 'sm' | 'md';
  /** Kleur van de vulling; standaard het actieve accent. */
  fill?: string;
  className?: string;
};

/** Voortgangsbalk op Base UI Progress; de vulling beweegt rustig mee met Motion. */
export function ProgressBar({ value, max = 100, label, valueText, size = 'md', fill, className }: ProgressBarProps) {
  const calm = useCalmMotion();
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <Progress.Root value={value} max={max} aria-label={label} aria-valuetext={valueText} className={cn('w-full', className)}>
      <Progress.Track
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-line shadow-[inset_0_2px_0_rgb(16_24_40/0.06)]',
          size === 'sm' ? 'h-2' : 'h-3.5',
        )}
      >
        <Progress.Indicator
          render={(props) => (
            <motion.div
              {...(props as HTMLMotionProps<'div'>)}
              style={{ ...(props.style as HTMLMotionProps<'div'>['style']), width: undefined, background: fill }}
              initial={false}
              animate={{ width: `${pct > 0 ? Math.max(pct, size === 'sm' ? 3 : 4) : 0}%` }}
              transition={calm ? { duration: 0 } : transition.progress}
            />
          )}
          className={cn(
            'relative h-full overflow-hidden rounded-full bg-accent bg-linear-to-b from-white/20 to-transparent shadow-[inset_0_-3px_0_rgb(0_0_0/0.14)]',
            size === 'md' &&
              'before:absolute before:inset-x-2 before:top-[3px] before:h-[3px] before:rounded-full before:bg-white/45 after:absolute after:inset-y-0 after:left-0 after:w-1/3 after:animate-sheen after:bg-linear-to-r after:from-transparent after:via-white/45 after:to-transparent',
          )}
        />
      </Progress.Track>
    </Progress.Root>
  );
}
