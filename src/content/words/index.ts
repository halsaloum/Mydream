import { BANK } from './bank';
import type { WordEntry } from './schema';
import { getTheme, THEMES, type Theme } from './themes';

export { THEMES, THEME_GROUP_LABELS, getTheme, type Theme, type ThemeGroup } from './themes';
export { POS_LABELS, containsWord, formPattern, gapSolution, headword, splitGap, wholeWord, type WordEntry } from './schema';

/**
 * De woordenbank: alle thema's met hun woorden. Een woord staat in precies één thema. De app
 * gebruikt alleen deze module; `words.test.ts` controleert elk woord tegen het contract
 * (`schema.ts`), zodat de app het bij het laden niet opnieuw hoeft te doen.
 */
export type BankWord = WordEntry & { theme: string };

function load(): { words: BankWord[]; byTheme: Map<string, BankWord[]> } {
  const words: BankWord[] = [];
  const byTheme = new Map<string, BankWord[]>();
  for (const theme of THEMES) {
    const list = (BANK[theme.id] ?? []).map((entry) => ({ ...entry, theme: theme.id }));
    byTheme.set(theme.id, list);
    words.push(...list);
  }
  for (const id of Object.keys(BANK)) if (!getTheme(id)) throw new Error(`Onbekend thema in de woordenbank: ${id}`);
  return { words, byTheme };
}

const loaded = load();
const byId = new Map(loaded.words.map((word) => [word.id, word]));

export const WORDS: readonly BankWord[] = loaded.words;

export function getWord(id: string): BankWord | undefined {
  return byId.get(id);
}

export function themeWords(themeId: string): readonly BankWord[] {
  return loaded.byTheme.get(themeId) ?? [];
}

export function wordTheme(word: BankWord): Theme {
  return getTheme(word.theme)!;
}
