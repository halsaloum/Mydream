import { z } from 'zod';
import { pickProgressData, ProgressDataSchema, useProgress, type ProgressData } from './progress';
import { useSessions } from './sessions';
import { pickSettingsData, SettingsDataSchema, useSettings, type SettingsData } from './settings';

/** Exporteren, importeren en wissen van lokale gegevens. Import wordt volledig gevalideerd. */
const ExportSchema = z.object({
  app: z.literal('pennig'),
  format: z.literal(1),
  exportedAt: z.string(),
  settings: SettingsDataSchema,
  progress: ProgressDataSchema,
});

export type ImportData = { exportedAt: string; settings: SettingsData; progress: ProgressData };

export function exportData(now = new Date()): string {
  return JSON.stringify(
    {
      app: 'pennig',
      format: 1,
      exportedAt: now.toISOString(),
      settings: pickSettingsData(useSettings.getState()),
      progress: pickProgressData(useProgress.getState()),
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
  const { exportedAt, settings, progress } = result.data;
  return { ok: true, data: { exportedAt, settings, progress } };
}

export function applyImport(data: ImportData) {
  useSettings.getState().replace(data.settings);
  useProgress.getState().replace(data.progress);
  useSessions.getState().reset();
}

export function resetProgress() {
  useProgress.getState().reset();
  useSessions.getState().reset();
}

export function resetEverything() {
  resetProgress();
  useSettings.getState().reset();
}
