'use client';

import { motion, type TargetAndTransition } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';

export type PimMood = 'idle' | 'happy' | 'cheer' | 'sad' | 'think';

const SIZES = { xs: 'h-10 w-8', sm: 'h-14 w-11', md: 'h-20 w-16', lg: 'h-28 w-[5.6rem]' } as const;

const MOUTHS: Record<PimMood, { d: string; fill: string }> = {
  idle: { d: 'M28 44.5q4 3 8 0', fill: 'none' },
  happy: { d: 'M27 43.5q5 5 10 0', fill: 'none' },
  cheer: { d: 'M26.5 42.5q5.5 7.5 11 0z', fill: 'var(--color-ink)' },
  sad: { d: 'M27.5 46.5q4.5-4 9 0', fill: 'none' },
  think: { d: 'M28.5 45h7', fill: 'none' },
};

const PUPILS: Record<PimMood, [number, number]> = {
  idle: [0.6, 0.6],
  happy: [0.6, 0.4],
  cheer: [0.4, 0],
  sad: [0, 1.6],
  think: [-1.4, -1.6],
};

/** Een korte reactie per stemming: één beweging, daarna stil. */
const REACTIONS: Record<PimMood, TargetAndTransition> = {
  idle: { y: 0, rotate: 0, scaleY: 1 },
  happy: { rotate: [0, -5, 0], transition: { duration: 0.42, ease: 'easeOut' } },
  cheer: { y: [0, -14, 0, -4, 0], scaleY: [1, 1.04, 0.94, 1.02, 1], transition: { duration: 0.6, ease: 'easeOut' } },
  sad: { rotate: -7, y: 3, transition: transition.slow },
  think: { rotate: 6, transition: transition.slow },
};

type PimProps = {
  mood?: PimMood;
  size?: keyof typeof SIZES;
  className?: string;
  /** Verander deze sleutel om dezelfde reactie opnieuw af te spelen. */
  reactKey?: string | number;
};

/** Pim het potlood. Decoratief: de bijbehorende tekst staat altijd ernaast. */
export function Pim({ mood = 'idle', size = 'md', className, reactKey }: PimProps) {
  const calm = useCalmMotion();
  const mouth = MOUTHS[mood];
  const [px, py] = PUPILS[mood];
  return (
    <motion.svg
      key={calm ? undefined : `${mood}-${reactKey ?? ''}`}
      viewBox="0 0 64 80"
      aria-hidden
      className={cn('shrink-0 origin-bottom overflow-visible', SIZES[size], className)}
      initial={false}
      animate={calm ? undefined : REACTIONS[mood]}
    >
      {/* gum en metalen ring */}
      <rect x="20" y="3" width="24" height="10" rx="3" fill="var(--color-red)" stroke="var(--color-ink)" strokeWidth="2.5" />
      <rect x="20" y="13" width="24" height="6.5" fill="#d5dae2" stroke="var(--color-ink)" strokeWidth="2.5" />
      <path d="M24.5 13v6.5M39.5 13v6.5" stroke="var(--color-ink)" strokeWidth="1.5" opacity="0.35" />
      {/* romp met lichtvlak */}
      <path d="M20 19.5h24V58H20z" fill="var(--color-yellow)" />
      <path d="M28 19.5h8V58h-8z" fill="#ffdb57" />
      <path d="M20 19.5h24V58H20z" fill="none" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinejoin="round" />
      {/* hout en punt */}
      <path d="M20 58h24L32 76.5z" fill="#f4dcb4" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M28.6 70.2 32 76.5l3.4-6.3z" fill="var(--color-ink)" />
      {/* wangen */}
      <ellipse cx="23.6" cy="41.5" rx="2.6" ry="1.6" fill="#ff8f8f" opacity="0.5" />
      <ellipse cx="40.4" cy="41.5" rx="2.6" ry="1.6" fill="#ff8f8f" opacity="0.5" />
      {/* ogen */}
      <motion.g
        style={{ originX: '32px', originY: '34px' }}
        animate={calm ? undefined : { scaleY: [1, 1, 0.1, 1] }}
        transition={calm ? undefined : { duration: 0.32, times: [0, 0.4, 0.6, 1], repeat: Infinity, repeatDelay: 4.6, delay: 1.2 }}
      >
        <circle cx="27" cy="34" r="4.2" fill="#fff" stroke="var(--color-ink)" strokeWidth="2" />
        <circle cx="37" cy="34" r="4.2" fill="#fff" stroke="var(--color-ink)" strokeWidth="2" />
        <circle cx={27 + px} cy={34 + py} r="1.9" fill="var(--color-ink)" />
        <circle cx={37 + px} cy={34 + py} r="1.9" fill="var(--color-ink)" />
      </motion.g>
      <path d={mouth.d} fill={mouth.fill} stroke="var(--color-ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

type PimSaysProps = { mood?: PimMood; children: ReactNode; size?: PimProps['size']; className?: string; reactKey?: string | number };

/** Pim met tekstballon; de ballon is de echte inhoud. */
export function PimSays({ mood = 'idle', children, size = 'md', className, reactKey }: PimSaysProps) {
  const calm = useCalmMotion();
  return (
    <div className={cn('flex items-end gap-3', className)}>
      <Pim mood={mood} size={size} reactKey={reactKey} />
      <motion.div
        key={calm ? undefined : String(reactKey ?? '')}
        initial={calm ? false : { opacity: 0, y: 6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={transition.base}
        className="relative mb-3 rounded-tile border-2 border-line bg-surface px-4 py-3 text-body font-semibold text-ink shadow-slab-sm"
      >
        <svg aria-hidden viewBox="0 0 10 16" className="absolute bottom-3 -left-[9px] h-4 w-2.5 overflow-visible">
          <path d="M10 0 1.5 8 10 16" fill="var(--color-surface)" stroke="var(--color-line)" strokeWidth="2" strokeLinejoin="round" />
        </svg>
        {children}
      </motion.div>
    </div>
  );
}
