import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, SETTINGS_KEY, SettingsDataSchema, useSettings } from './settings';

beforeEach(() => { useSettings.setState(DEFAULT_SETTINGS); });

describe('leestempo opslaan', () => {
  it('accepteert de volledige schaal van 0,6× tot 2× en weigert waarden erbuiten', () => {
    for (const readerRate of [0.6, 1, 1.5, 2]) expect(SettingsDataSchema.safeParse({ ...DEFAULT_SETTINGS, speech: { ...DEFAULT_SETTINGS.speech, readerRate } }).success).toBe(true);
    for (const readerRate of [0.59, 2.01, Number.NaN, Number.POSITIVE_INFINITY]) expect(SettingsDataSchema.safeParse({ ...DEFAULT_SETTINGS, speech: { ...DEFAULT_SETTINGS.speech, readerRate } }).success).toBe(false);
  });

  it('hervat 2× en de gekozen stem zonder het tempo van korte voorbeelden te veranderen', async () => {
    useSettings.getState().setSpeech({ voice: 'Fenna', readerRate: 2, rate: 'langzaam' });
    const saved = localStorage.getItem(SETTINGS_KEY)!;
    useSettings.setState(DEFAULT_SETTINGS);
    localStorage.setItem(SETTINGS_KEY, saved);
    await useSettings.persist.rehydrate();
    expect(useSettings.getState().speech).toMatchObject({ voice: 'Fenna', readerRate: 2, rate: 'langzaam' });
  });
});
