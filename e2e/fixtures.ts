import { test as base, expect, type Page } from '@playwright/test';

/** Een leerling die de kennismaking al heeft afgerond (zonder verzonnen voortgang). */
export const ONBOARDED = {
  state: {
    profile: { focus: 'zinnen', goalMinutes: 10, start: 'begin', completedAt: '2026-01-01T10:00:00.000Z' },
    sound: { enabled: false, volume: 0.6 },
    effects: { confetti: true },
    motion: 'system',
  },
  version: 1,
};

export async function seedOnboarded(page: Page) {
  await page.addInitScript((settings) => {
    if (!window.localStorage.getItem('pennig:instellingen')) window.localStorage.setItem('pennig:instellingen', JSON.stringify(settings));
  }, ONBOARDED);
}

export const test = base;
export { expect };
