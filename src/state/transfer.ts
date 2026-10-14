import { z } from 'zod';
import { pickProgressData, ProgressDataSchema, useProgress, type ProgressData } from './progress';
import { useSessions } from './sessions';
import { pickSettingsData, SettingsDataSchema, useSettings, type SettingsData } from './settings';
import { pickWordsData, useWordRound, useWords, WordsDataSchema } from './words';
import { EMPTY_WORDS, type WordsData } from '@/lib/words/memory';
import { ArgumentDataSchema, EMPTY_ARGUMENTS, pickArgumentData, useArgumentation, type ArgumentData } from './argumentation';
import { SentenceDataSchema, EMPTY_SENTENCES, pickSentenceData, useSentences, type SentenceData } from './sentences';
import { PracticeDataSchema, EMPTY_PRACTICE, pickPracticeData, usePractice, type PracticeData } from './practice';

/** Exporteren, importeren en wissen van lokale gegevens. Import wordt volledig gevalideerd. */
const ExportSchema = z.object({
  app: z.literal('pennig'),
  format: z.literal(1),
  exportedAt: z.string(),
  settings: SettingsDataSchema,
  progress: ProgressDataSchema,
  /** Sinds de tab "Woorden"; oudere bestanden hebben dit niet. */
  words: WordsDataSchema.optional(),
  arguments: ArgumentDataSchema.optional(),
  sentences: SentenceDataSchema.optional(),
  practice: PracticeDataSchema.optional(),
});

export type ImportData = { exportedAt: string; settings: SettingsData; progress: ProgressData; words: WordsData | null; arguments?: ArgumentData | null; sentences?: SentenceData | null; practice?: PracticeData | null };

export function exportData(now = new Date()): string {
  return JSON.stringify(
    {
      app: 'pennig',
      format: 1,
      exportedAt: now.toISOString(),
      settings: pickSettingsData(useSettings.getState()),
      progress: pickProgressData(useProgress.getState()),
      words: pickWordsData(useWords.getState()),
      arguments: pickArgumentData(useArgumentation.getState()),
      sentences: pickSentenceData(useSentences.getState()),
      practice: pickPracticeData(usePractice.getState()),
    },
    null,
    2,
  );
}

export function parseImport(text: string): { ok: true; data: ImportData } | { ok: false; error: string } {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, error: 'Dit bestand is geen geldige JSON.' };
  }
  const result = ExportSchema.safeParse(json);
  if (!result.success) return { ok: false, error: 'Dit is geen geldig pennig-bestand, of het is beschadigd.' };
  const { exportedAt, settings, progress, words, arguments: argumentData, sentences, practice } = result.data;
  return { ok: true, data: { exportedAt, settings, progress, words: words ?? null, arguments: argumentData ?? null, sentences: sentences ?? null, practice: practice ?? null } };
}

export function applyImport(data: ImportData) {
  useSettings.getState().replace(data.settings);
  useProgress.getState().replace(data.progress);
  useSessions.getState().reset();
  useWords.getState().replace(data.words ?? EMPTY_WORDS);
  useWordRound.getState().reset();
  useArgumentation.getState().replace(data.arguments ?? EMPTY_ARGUMENTS);
  useSentences.getState().replace(data.sentences ?? EMPTY_SENTENCES);
  usePractice.getState().replace(data.practice ?? EMPTY_PRACTICE);
}

export function resetProgress() {
  useProgress.getState().reset();
  useSessions.getState().reset();
  useWords.getState().reset();
  useWordRound.getState().reset();
  useArgumentation.getState().reset();
  useSentences.getState().reset();
  usePractice.getState().reset();
}

export function resetEverything() {
  resetProgress();
  useSettings.getState().reset();
}
