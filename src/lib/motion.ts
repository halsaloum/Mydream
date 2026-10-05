import { useReducedMotion, type Transition } from 'motion/react';
import { useSettings } from '@/state/settings';

/**
 * Bewegingstokens. Overgangen zijn kort (160–280 ms) met exponentiële ease-out;
 * alleen verplaatsbare kaartjes krijgen een subtiele veer.
 */
export const ease = {
  out: [0.16, 1, 0.3, 1],
  outSoft: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const transition = {
  fast: { duration: 0.16, ease: ease.outSoft },
  base: { duration: 0.22, ease: ease.out },
  slow: { duration: 0.28, ease: ease.out },
  /** Voortgangsbalken: rustig, nooit verspringend. */
  progress: { duration: 0.6, ease: ease.out },
} satisfies Record<string, Transition>;

export const spring = {
  /** Kaartjes die naar hun plek bewegen: snel, nauwelijks doorschietend. */
  tile: { type: 'spring', stiffness: 560, damping: 40, mass: 0.8 },
  /** Blokken die herschikken. */
  layout: { type: 'spring', stiffness: 460, damping: 42, mass: 0.9 },
  /** Een nieuwe lesstap die binnenschuift: zacht, met een heel klein beetje veer. */
  card: { type: 'spring', stiffness: 320, damping: 30, mass: 0.9 },
  /** Feedback en beloningen die opspringen. */
  pop: { type: 'spring', stiffness: 520, damping: 26, mass: 0.7 },
} satisfies Record<string, Transition>;

/** Rustige beweging: eigen instelling óf de systeemvoorkeur. Ook voor confetti, tellers en scrollen. */
export function useCalmMotion(): boolean {
  const system = useReducedMotion();
  const setting = useSettings((state) => state.motion);
  return setting === 'calm' || system === true;
}

/** Buiten React (effecten, scrollen): dezelfde beslissing. */
export function isCalmMotion(): boolean {
  if (useSettings.getState().motion === 'calm') return true;
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: isCalmMotion() ? 'auto' : 'smooth' });
}
