import { z } from 'zod';
import { firstReview, nextInterval, retrievability, review, type Grade } from '@/engine/fsrs';
import { addDays, dayKey } from '@/lib/dates';

/**
 * Wat pennig per woord onthoudt (lokaal in de browser): het geheugen van FSRS (stabiliteit en
 * moeilijkheid), wanneer het woord terugkomt, en per dag wat je deed. Puur en serialiseerbaar; de
 * store in `state/words.ts` bewaart het.
 */

const Day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const CardSchema = z.object({
  /** Stabiliteit in dagen (FSRS). */
  s: z.number().positive(),
  /** Moeilijkheid 1–10 (FSRS). */
  d: z.number().min(1).max(10),
  /** Herhalingen na de eerste dag. */
  reps: z.int().nonnegative(),
  /** Keren dat je het woord bij een herhaling niet meer wist. */
  lapses: z.int().nonnegative(),
  added: Day,
  last: Day,
  due: Day,
  /** De laatste beoordelingen (1 opnieuw, 2 moeilijk, 3 goed, 4 makkelijk), nieuwste laatst. */
  log: z.array(z.int().min(1).max(4)).max(12),
});

export const DayLogSchema = z.object({
  added: z.array(z.string()),
  reviewed: z.array(z.string()),
  /** Herhaalde woorden die je nog wist (voor hoeveel je onthoudt na een dag of langer). */
  kept: z.array(z.string()).default([]),
  /** Thema's waaruit die dag nieuwe woorden kwamen, in volgorde. */
  themes: z.array(z.string()),
  /** De ronde van de dag is helemaal af. */
  done: z.boolean(),
  ms: z.number().nonnegative(),
});

export const FOCUS = ['mix', 'vak', 'algemeen'] as const;
export type Focus = (typeof FOCUS)[number];
export const PER_DAY = [3, 5, 8, 10, 12] as const;
export const DEFAULT_PER_DAY = 5;

export type Card = z.infer<typeof CardSchema>;
export type DayLog = z.output<typeof DayLogSchema>;

export type WordsData = {
  perDay: number;
  focus: Focus;
  /** Thema dat de volgende keer eerst nieuwe woorden levert (gekozen in de woordenlijst). */
  next: string | null;
  cards: Record<string, Card>;
  days: Record<string, DayLog>;
};

export const EMPTY_WORDS: WordsData = { perDay: DEFAULT_PER_DAY, focus: 'mix', next: null, cards: {}, days: {} };

/** Dagen tussen twee datums (YYYY-MM-DD), in lokale kalenderdagen. */
export function daysBetween(from: string, to: string): number {
  const [y1, m1, d1] = from.split('-').map(Number);
  const [y2, m2, d2] = to.split('-').map(Number);
  const a = Date.UTC(y1 ?? 1970, (m1 ?? 1) - 1, d1 ?? 1);
  const b = Date.UTC(y2 ?? 1970, (m2 ?? 1) - 1, d2 ?? 1);
  return Math.round((b - a) / 86_400_000);
}

/* ------------------------------------------------------------------ geheugen */

/**
 * Na de eerste dag: het geheugen begint, en morgen komt het woord voor het eerst terug (wat je de
 * dag na het leren ophaalt, onthoud je het best). `first` is de eerste keer ophalen, `again` hoe het
 * aan het eind van de ronde ging.
 */
export function learnCard(first: Grade, today: string, again?: Grade): Card {
  const { s, d } = firstReview(first, again);
  return { s, d, reps: 0, lapses: 0, added: today, last: today, due: addDays(today, 1), log: again === undefined ? [first] : [first, again] };
}

/** Een herhaling verwerken. Fout = morgen opnieuw; goed = op het moment dat FSRS uitrekent. */
export function reviewCard(card: Card, g: Grade, today: string): Card {
  const elapsed = Math.max(0, daysBetween(card.last, today));
  const next = review(card, elapsed, g);
  const interval = g === 1 ? 1 : nextInterval(next.s);
  return {
    s: next.s,
    d: next.d,
    reps: card.reps + (g === 1 ? 0 : 1),
    lapses: card.lapses + (g === 1 ? 1 : 0),
    added: card.added,
    last: today,
    due: addDays(today, interval),
    log: [...card.log, g].slice(-12),
  };
}

/** Kans dat je het woord vandaag nog weet. */
export function recallChance(card: Card, today = dayKey()): number {
  return retrievability(Math.max(0, daysBetween(card.last, today)), card.s);
}

export type Strength = 'nieuw' | 'lerend' | 'bekend' | 'vast';

/** Hoe stevig een woord zit, naar de stabiliteit: tot een week, tot een maand, langer. */
export function strength(card: Card | undefined): Strength {
  if (!card) return 'nieuw';
  if (card.s < 7) return 'lerend';
  if (card.s < 30) return 'bekend';
  return 'vast';
}

export const STRENGTH_LABELS: Record<Strength, string> = {
  nieuw: 'Nog niet geleerd',
  lerend: 'Aan het leren',
  bekend: 'Bekend',
  vast: 'Zit vast',
};

export function isDue(card: Card, today: string): boolean {
  return card.due <= today;
}

/** Woorden die vandaag (of eerder) terug moeten komen, het langst gewacht en zwakst eerst. */
export function dueIds(cards: Record<string, Card>, today: string): string[] {
  return Object.entries(cards)
    .filter(([, card]) => isDue(card, today))
    .sort(([, a], [, b]) => (a.due === b.due ? recallChance(a, today) - recallChance(b, today) : a.due < b.due ? -1 : 1))
    .map(([id]) => id);
}

/**
 * Hoeveel herhalingen je nog wist, over de laatste `days` dagen: de maat die telt (niet hoe goed
 * het binnen één ronde ging).
 */
export function retention(days: Record<string, DayLog>, today = dayKey(), span = 30): { reviewed: number; kept: number } {
  let reviewed = 0;
  let kept = 0;
  for (let i = 0; i < span; i++) {
    const log = days[addDays(today, -i)];
    if (!log) continue;
    reviewed += log.reviewed.length;
    kept += log.kept.length;
  }
  return { reviewed, kept };
}

/* ------------------------------------------------------------------ reeks */

/** Dagen op rij met de ronde van de dag af. Telt vandaag mee als die al af is, anders vanaf gisteren. */
export function wordStreak(days: Record<string, DayLog>, today = dayKey()): number {
  let day = days[today]?.done ? today : addDays(today, -1);
  let count = 0;
  while (days[day]?.done) {
    count++;
    day = addDays(day, -1);
  }
  return count;
}

export function longestStreak(days: Record<string, DayLog>): number {
  const done = Object.keys(days)
    .filter((day) => days[day]?.done)
    .sort();
  let best = 0;
  let run = 0;
  let previous: string | null = null;
  for (const day of done) {
    run = previous !== null && daysBetween(previous, day) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    previous = day;
  }
  return best;
}
