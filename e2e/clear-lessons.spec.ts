import { mkdir } from 'node:fs/promises';
import type { Page } from '@playwright/test';
import { test, expect, seedOnboarded } from './fixtures';
import { ontleedLessons, PARTS, getOntleedLesson } from '../src/content/ontleed';
import type { OntleedLesson } from '../src/content/ontleed/types';
import { getSectionCoach } from '../src/lib/ontleed/lesson-coach';
import { completeTheory } from './theory-fixtures';

test.beforeEach(async ({ page }) => { await seedOnboarded(page); });

async function openExplanation(page: Page, lesson: OntleedLesson) {
  await page.goto(`/les/${lesson.id}`);
  await page.getByRole('radio').nth(lesson.discovery.answer).check();
  await page.getByRole('button', { name: 'Controleer antwoord', exact: true }).click();
  await page.getByRole('contentinfo').getByRole('button', { name: 'Verder', exact: true }).click();
}

async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
}

test('form, function and meaning are explained before writing, with a persistent interactive check', async ({ page }, testInfo) => {
  const lesson = getOntleedLesson('basis-vorm-functie')!;
  const section = lesson.sections[0]!;
  const coach = getSectionCoach(lesson, 0);
  await openExplanation(page, lesson);
  await expect(page.getByRole('heading', { name: section.title, exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'In gewone taal', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Vergelijk mijn voorspelling', exact: true })).toHaveCount(0);
  await expect(page.getByRole('textbox')).toHaveCount(0);
  const forward = page.getByRole('contentinfo').getByRole('button', { name: 'Verder', exact: true });
  await expect(forward).toBeDisabled();
  await noOverflow(page);
  if (testInfo.project.name === 'desktop') {
    const footer = (await page.getByRole('contentinfo').boundingBox())!;
    for (const step of section.teaching!.steps) {
      const button = (await page.getByRole('list', { name: 'Uitlegstappen' }).getByRole('button', { name: step.title, exact: true }).boundingBox())!;
      expect(button.y + button.height).toBeLessThanOrEqual(footer.y);
    }
  }
  await mkdir('output/clarity', { recursive: true });
  await page.screenshot({ path: `output/clarity/${testInfo.project.name}-clear-lesson-initial.png`, fullPage: true });
  await page.screenshot({ path: `output/clarity/${testInfo.project.name}-clear-lesson-viewport.png`, style: 'nextjs-portal { visibility: hidden !important; }' });
  // The raw screenshot above retains the sticky controls; this companion shows all lesson content.
  await page.screenshot({ path: `output/clarity/${testInfo.project.name}-clear-lesson-content.png`, fullPage: true, style: '.o-player-footer, nextjs-portal { visibility: hidden !important; }' });

  for (const label of ['Vorm', 'Functie', 'Betekenis']) {
    const lens = page.getByRole('button', { name: label, exact: true });
    await lens.focus();
    await page.keyboard.press('Enter');
    await expect(lens).toHaveAttribute('aria-pressed', 'true');
  }

  const check = page.getByRole('radiogroup', { name: 'Snelle check', exact: true });
  await check.getByRole('radio').nth((coach.check.answer + 1) % coach.check.options.length).check();
  await expect(page.getByRole('status')).toContainText('Kijk nog eens.');
  await expect(forward).toBeDisabled();
  await check.getByRole('radio').nth(coach.check.answer).check();
  await expect(page.getByRole('status')).toContainText('Goed gezien!');
  // A correct click alone is insufficient: the second concrete example still needs a visit.
  await expect(forward).toBeDisabled();
  await page.reload();
  await expect(check.getByRole('radio').nth(coach.check.answer)).toBeChecked();
  await expect(forward).toBeDisabled();
  const secondExample = page.getByRole('button', { name: 'Voorbeeld 2', exact: true });
  await secondExample.focus();
  await page.keyboard.press('Enter');
  await expect(secondExample).toHaveAttribute('aria-pressed', 'true');
  await expect(forward).toBeEnabled();

  await page.locator('summary').filter({ hasText: 'Eigen notitie (optioneel)' }).click();
  const note = page.getByRole('textbox', { name: 'Wat wil je onthouden?', exact: true });
  await note.fill('Bouw');
  await expect(forward).toBeEnabled();
  await page.reload();
  await expect(forward).toBeEnabled();
  await page.locator('summary').filter({ hasText: 'Eigen notitie (optioneel)' }).click();
  await expect(note).toHaveValue('Bouw');
  await page.locator('summary').filter({ hasText: 'Meer uitleg' }).click();
  for (const paragraph of section.paragraphs) await expect(page.getByText(paragraph, { exact: true })).toBeVisible();

  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('pennig:ontleed-v1')!).state);
  expect(Object.keys(stored.sessions[lesson.id].answers)).toEqual(['discovery']);
  expect(stored.mistakes).toEqual({});
  await noOverflow(page);
  await page.screenshot({ path: `output/clarity/${testInfo.project.name}-clear-lesson.png`, fullPage: true });
  await forward.click();
  await expect(page.getByRole('heading', { name: lesson.sections[1]!.title, exact: true })).toBeVisible();
  await expect(forward).toBeDisabled();
});

test('an existing revealed explanation remains accessible when its optional note is edited', async ({ page }) => {
  const lesson = getOntleedLesson('basis-vorm-functie')!;
  await page.addInitScript(lessonId => {
    localStorage.setItem('pennig:ontleed-v1', JSON.stringify({
      state: {
        sessions: { [lessonId]: { step: 1, answers: {}, corrections: {}, repairs: {}, predictions: { '0': { draft: 'Mijn eerdere voorspelling.', revealed: true } }, draft: '', checks: [], startedAt: Date.now() } },
        completed: {}, retrieval: {}, reviewAnswers: {}, mistakes: {}, writingDraft: '', reviewRound: null, lastLesson: lessonId,
      }, version: 1,
    }));
  }, lesson.id);
  await page.goto(`/les/${lesson.id}`);
  await expect(page.getByRole('heading', { name: 'In gewone taal', exact: true })).toBeVisible();
  const forward = page.getByRole('contentinfo').getByRole('button', { name: 'Verder', exact: true });
  await expect(forward).toBeEnabled();
  await page.locator('summary').filter({ hasText: 'Eigen notitie (optioneel)' }).click();
  const note = page.getByRole('textbox', { name: 'Wat wil je onthouden?', exact: true });
  await expect(note).toHaveValue('Mijn eerdere voorspelling.');
  await note.fill('Kort');
  await expect(forward).toBeEnabled();
  await page.reload();
  await expect(forward).toBeEnabled();
});

for (const part of PARTS) {
  test(`${part.title}: every section has an explanation and an interactive route without required writing`, async ({ page }) => {
    const lesson = ontleedLessons.find(item => item.part === part.id)!;
    await openExplanation(page, lesson);
    for (const [sectionIndex, section] of lesson.sections.entries()) {
      await expect(page.getByRole('heading', { name: section.title, exact: true })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'In gewone taal', exact: true })).toBeVisible();
      await expect(page.getByRole('radiogroup', { name: 'Snelle check', exact: true })).toBeVisible();
      await expect(page.getByRole('textbox')).toHaveCount(0);
      await completeTheory(page, lesson, sectionIndex);
      await noOverflow(page);
      await page.getByRole('contentinfo').getByRole('button', { name: 'Verder', exact: true }).click();
    }
    await expect(page.getByRole('heading', { name: lesson.lab.prompt, exact: true })).toBeVisible();
  });
}
