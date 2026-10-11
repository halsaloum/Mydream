import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SessionSchema } from '@/engine/session';
import { dayKey } from '@/lib/dates';
import { CardSchema, DayLogSchema, DEFAULT_PER_DAY, dueIds, EMPTY_WORDS, FOCUS, type Focus, type WordsData } from '@/lib/words/memory';
import { validatedStorage } from './storage';

/**
 * De tab "Woorden": wat je per woord weet (FSRS), wat je per dag deed, en de ronde waar je mee
 * bezig bent. Alles staat lokaal in de browser, zoals de rest van pennig.
 *
 * Deze module kent de woordenbank zelf niet (die laadt alleen op de woordpagina's); het maken,
 * spelen en verwerken van rondes staat in `lib/words/round.ts`.
 */

/** Een record waarvan ongeldige entries worden overgeslagen in plaats van alles te verwerpen. */
function lenient<T>(schema: z.ZodType<T>, keep: (key: string) => boolean = () => true) {
  return z.record(z.string(), z.unknown()).transform((record) => {
    const out: Record<string, T> = {};
    for (const [key, raw] of Object.entries(record)) {
      const parsed = schema.safeParse(raw);
      if (parsed.success && keep(key)) out[key] = parsed.data;
    }
    return out;
  });
}

export const WordsDataSchema = z.object({
  perDay: z.int().min(1).max(20).catch(DEFAULT_PER_DAY),
  focus: z.enum(FOCUS).catch('mix'),
  next: z.string().nullable().catch(null),
  cards: lenient(CardSchema),
  days: lenient(DayLogSchema, (key) => /^\d{4}-\d{2}-\d{2}$/.test(key)),
});

type WordsActions = {
  setPerDay: (perDay: number) => void;
  setFocus: (focus: Focus) => void;
  setNext: (themeId: string | null) => void;
  replace: (data: WordsData) => void;
  reset: () => void;
};

export const WORDS_KEY = 'pennig:woorden';
export const WORD_ROUND_KEY = 'pennig:woorden-ronde';

export const useWords = create<WordsData & WordsActions>()(
  persist(
    (set) => ({
      ...EMPTY_WORDS,
      setPerDay: (perDay) => set({ perDay }),
      setFocus: (focus) => set({ focus }),
      setNext: (next) => set({ next }),
      replace: (data) => set(data),
      reset: () => set(EMPTY_WORDS),
    }),
    {
      name: WORDS_KEY,
      version: 1,
      storage: validatedStorage(WordsDataSchema),
      partialize: ({ perDay, focus, next, cards, days }) => ({ perDay, focus, next, cards, days }),
      skipHydration: true,
    },
  ),
);

export function pickWordsData(state: WordsData): WordsData {
  return { perDay: state.perDay, focus: state.focus, next: state.next, cards: state.cards, days: state.days };
}

/* ------------------------------------------------------------------ de lopende ronde */

export const StoredRoundSchema = z.object({
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** 0 = de ronde van de dag; 1, 2, … = extra rondes met nieuwe woorden. */
  round: z.int().nonnegative(),
  newIds: z.array(z.string()),
  reviewIds: z.array(z.string()),
  themes: z.array(z.string()),
  session: SessionSchema,
  /** Verwerkt in de woordgegevens (af, of afgebroken en verwerkt voor zover je kwam). */
  committed: z.boolean(),
});

export type StoredRound = z.infer<typeof StoredRoundSchema>;

const RoundDataSchema = z.object({
  current: z.unknown().transform((raw) => {
    const parsed = StoredRoundSchema.safeParse(raw);
    return parsed.success ? parsed.data : null;
  }),
});

type RoundState = {
  current: StoredRound | null;
  /** De dag waarop de dagronde al is opgezocht of gestart (niet bewaard). */
  checked: string | null;
  reset: () => void;
};

export const useWordRound = create<RoundState>()(
  persist(
    (set) => ({
      current: null,
      checked: null,
      reset: () => set({ current: null, checked: null }),
    }),
    {
      name: WORD_ROUND_KEY,
      version: 1,
      storage: validatedStorage(RoundDataSchema),
      partialize: ({ current }) => ({ current }),
      skipHydration: true,
    },
  ),
);

/** Aantal woorden dat vandaag terug moet komen (voor het getal in de navigatie). */
export function dueCount(cards: WordsData['cards'], today = dayKey()): number {
  return dueIds(cards, today).length;
}
