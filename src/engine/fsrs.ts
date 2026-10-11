/**
 * FSRS (Free Spaced Repetition Scheduler), versie 5, met de standaardgewichten.
 *
 * FSRS schat per woord twee dingen: de stabiliteit S (na hoeveel dagen je het woord nog met 90%
 * kans weet) en de moeilijkheid D (1–10). Na elke herhaling worden ze bijgewerkt op basis van je
 * antwoord en van hoe lang het geleden was. Het volgende moment van herhalen is het moment waarop
 * de kans dat je het nog weet tot de gewenste 90% is gezakt: net op tijd, niet te vroeg.
 *
 * Bron: open-spaced-repetition, FSRS-5 zoals in ts-fsrs v4.7.1 en fsrs-rs v2.0.3 (de nieuwste
 * versies zijn FSRS-6, met andere gewichten). De tests in `fsrs.test.ts` volgen de tests van
 * ts-fsrs. In de benchmark van dat project (Anki-gegevens, honderden miljoenen herhalingen)
 * voorspelt FSRS-5 bij zo'n 99% van de verzamelingen beter wanneer je iets vergeet dan SM-2, het
 * schema van Anki en SuperMemo 2. Dat gaat over voorspellen, niet over hoeveel je leert.
 *
 * Alles is in hele dagen: pennig herhaalt een woord hoogstens één keer per dag.
 */

export type Grade = 1 | 2 | 3 | 4;
export const GRADE_LABELS: Record<Grade, string> = { 1: 'Opnieuw', 2: 'Moeilijk', 3: 'Goed', 4: 'Makkelijk' };

/** Standaardgewichten van FSRS-5. */
export const W = [
  0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655,
  0.6621,
] as const;

export const DECAY = -0.5;
/** Zo gekozen dat R(S, S) = 0,9. */
export const FACTOR = 19 / 81;
export const RETENTION = 0.9;
export const MAX_INTERVAL = 365;
const S_MIN = 0.01;
const S_MAX = 36500;

const w = (i: number) => W[i] ?? 0;
const clampD = (d: number) => Math.min(10, Math.max(1, d));
const clampS = (s: number) => Math.min(S_MAX, Math.max(S_MIN, s));

/** Kans (0–1) dat je het woord na `days` dagen nog weet, bij stabiliteit `s`. */
export function retrievability(days: number, s: number): number {
  return Math.pow(1 + (FACTOR * Math.max(0, days)) / s, DECAY);
}

export function initStability(g: Grade): number {
  return Math.max(w(g - 1), 0.1);
}

export function initDifficulty(g: Grade): number {
  return clampD(w(4) - Math.exp(w(5) * (g - 1)) + 1);
}

/** Nieuwe moeilijkheid: lager bij goed, hoger bij fout, met demping bij 10 en een trek naar het midden. */
export function nextDifficulty(d: number, g: Grade): number {
  const delta = -w(6) * (g - 3);
  const damped = d + (delta * (10 - d)) / 9;
  const reverted = w(7) * initDifficulty(4) + (1 - w(7)) * damped;
  return clampD(reverted);
}

/** Stabiliteit na een goede herhaling (Moeilijk, Goed of Makkelijk). */
export function recallStability(d: number, s: number, r: number, g: Grade): number {
  const hard = g === 2 ? w(15) : 1;
  const easy = g === 4 ? w(16) : 1;
  return clampS(s * (1 + Math.exp(w(8)) * (11 - d) * Math.pow(s, -w(9)) * (Math.exp((1 - r) * w(10)) - 1) * hard * easy));
}

/** Stabiliteit na een fout (vergeten). Nooit hoger dan de stabiliteit ervoor. */
export function forgetStability(d: number, s: number, r: number): number {
  const next = w(11) * Math.pow(d, -w(12)) * (Math.pow(s + 1, w(13)) - 1) * Math.exp((1 - r) * w(14));
  const ceiling = s / Math.exp(w(17) * w(18));
  return clampS(Math.min(next, ceiling));
}

/** Stabiliteit na nog een keer oefenen op dezelfde dag (nieuw in FSRS-5). */
export function shortTermStability(s: number, g: Grade): number {
  return clampS(s * Math.exp(w(17) * (g - 3 + w(18))));
}

/** Over hoeveel dagen de kans tot `retention` is gezakt. */
export function nextInterval(s: number, retention = RETENTION): number {
  const days = (s / FACTOR) * (Math.pow(retention, 1 / DECAY) - 1);
  return Math.min(MAX_INTERVAL, Math.max(1, Math.round(days)));
}

export type MemoryState = { s: number; d: number };

/**
 * De eerste dag: de eerste keer dat je het woord ophaalt (`first`) zet het geheugen in gang; wat je
 * aan het eind van dezelfde ronde nog weet (`again`) werkt het bij met de formule voor dezelfde dag.
 */
export function firstReview(first: Grade, again?: Grade): MemoryState {
  const start = { s: initStability(first), d: initDifficulty(first) };
  if (again === undefined) return start;
  return { s: shortTermStability(start.s, again), d: nextDifficulty(start.d, again) };
}

/** Een herhaling na `days` dagen, met beoordeling `g`. Op dezelfde dag geldt de korte formule. */
export function review(state: MemoryState, days: number, g: Grade): MemoryState & { r: number } {
  if (days <= 0) return { s: shortTermStability(state.s, g), d: nextDifficulty(state.d, g), r: 1 };
  const r = retrievability(days, state.s);
  const d = nextDifficulty(state.d, g);
  const s = g === 1 ? forgetStability(state.d, state.s, r) : recallStability(state.d, state.s, r, g);
  return { s, d, r };
}
