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

/** Op de startpagina staan de stappen van een niveau ingeklapt, behalve die waar je nu bent: klap ze open. */
export async function openStages(page: Page, stages: readonly string[]) {
  for (const stage of stages) {
    const triggers = page.getByRole('button', { name: new RegExp(`^Stap: ${stage}\\b`) });
    await expect(triggers.first()).toBeVisible();
    for (const trigger of await triggers.all()) {
      if ((await trigger.getAttribute('aria-expanded')) !== 'true') await trigger.click();
    }
  }
}

export const test = base;
export { expect };
