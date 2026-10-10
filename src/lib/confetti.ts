import { useSettings } from '@/state/settings';
import { isCalmMotion } from './motion';

/**
 * Confetti als kleine beloning. Staat uit bij rustige beweging (eigen instelling of systeem)
 * en wanneer de leerling effecten heeft uitgezet. canvas-confetti wordt pas geladen bij gebruik.
 */
const COLORS = ['#58cc02', '#1cb0f6', '#ce82ff', '#ff9600', '#ffc800'];

export type Burst = 'spark' | 'answer' | 'lesson';

function allowed(): boolean {
  return typeof window !== 'undefined' && useSettings.getState().effects.confetti && !isCalmMotion();
}

export function originOf(element: Element | null | undefined): { x: number; y: number } | undefined {
  if (!element || typeof window === 'undefined') return undefined;
  const rect = element.getBoundingClientRect();
  return { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight };
}

export async function celebrate(burst: Burst, origin?: { x: number; y: number }) {
  if (!allowed()) return;
  const { default: confetti } = await import('canvas-confetti');
  const base = { colors: COLORS, disableForReducedMotion: true, zIndex: 60, scalar: 0.9 };
  if (burst === 'spark') {
    void confetti({ ...base, particleCount: 18, spread: 50, startVelocity: 22, ticks: 90, origin });
  } else if (burst === 'answer') {
    void confetti({ ...base, particleCount: 36, spread: 70, startVelocity: 32, ticks: 120, origin });
  } else {
    void confetti({ ...base, particleCount: 110, spread: 80, startVelocity: 42, origin: { x: 0.5, y: 0.45 } });
    window.setTimeout(() => void confetti({ ...base, particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.6 } }), 220);
    window.setTimeout(() => void confetti({ ...base, particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.6 } }), 380);
  }
}
