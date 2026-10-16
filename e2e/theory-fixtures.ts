import { expect, type Page } from '@playwright/test';
import type { OntleedLesson } from '../src/content/ontleed/types';
import { getSectionCoach } from '../src/lib/ontleed/lesson-coach';

/** Follow the actual example controls and check; an empty note never blocks the lesson. */
export async function completeTheory(page: Page, lesson: OntleedLesson, sectionIndex: number) {
  const section = lesson.sections[sectionIndex]!;
  const coach = getSectionCoach(lesson, sectionIndex);
  await expect(page.getByRole('heading', { name: section.title, exact: true })).toBeVisible();
  if (section.examples.length > 1) {
    for (const [index] of section.examples.entries()) {
      await page.getByRole('button', { name: `Voorbeeld ${index + 1}`, exact: true }).click();
    }
  }
  await page.getByRole('radiogroup', { name: 'Snelle check', exact: true }).getByRole('radio').nth(coach.check.answer).check();
  await expect(page.getByRole('status')).toContainText('Goed gezien!');
  await expect(page.getByRole('contentinfo').getByRole('button', { name: 'Verder', exact: true })).toBeEnabled();
}
