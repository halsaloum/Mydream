import { test, expect, seedOnboarded } from './fixtures';
import { getOntleedLesson } from '../src/content/ontleed';

test.beforeEach(async ({ page }) => { await seedOnboarded(page); });

test('the guided path changes levels and units with one next lesson and no dashboard sidebar', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.o-sidebar')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Hoofdnavigatie' }).getByRole('link')).toHaveCount(3);
  await expect(page.locator('.o-journey-step.is-current')).toHaveCount(1);
  await page.getByRole('navigation', { name: 'Kies je taalniveau' }).getByRole('button', { name: '3 Alinea' }).click();
  await expect(page.getByRole('heading', { name: 'Van zin naar samenhang', exact: true })).toBeVisible();
  await expect(page.locator('.o-journey-step')).toHaveCount(10);
  await expect(page.getByRole('link', { name: 'Begin de les' })).toHaveAttribute('href', '/les/alinea-kernzin');
  await page.getByRole('navigation', { name: 'Kies je taalniveau' }).getByRole('button', { name: '2 Zin' }).click();
  await expect(page.getByRole('heading', { name: 'Wat hoort bij elkaar?', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Volgend onderdeel' }).click();
  await expect(page.getByRole('heading', { name: 'De zin in elkaar', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Vorig onderdeel' }).click();
  await expect(page.getByRole('heading', { name: 'Wat hoort bij elkaar?', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test('a started noun phrase lesson becomes the single continue action on the learning path', async ({ page }, testInfo) => {
  const lesson = getOntleedLesson('zinsdelen-naamwoordgroep')!;
  await page.goto(`/les/${lesson.id}`);
  await expect(page.getByRole('heading', { name: lesson.title, exact: true })).toBeVisible();
  await expect(page.locator('.o-learning-navigation')).toHaveCount(0);
  await page.screenshot({ path: `output/rebuild/${testInfo.project.name}-focused-lesson.png`, fullPage: true });
  await page.goto('/');
  await expect(page.getByRole('button', { name: '2 Zin', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.o-journey-step.is-current').getByRole('heading', { name: lesson.title, exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ga verder', exact: false })).toHaveAttribute('href', `/les/${lesson.id}`);
  await page.getByRole('link', { name: 'Ga verder', exact: false }).click();
  await expect(page.getByRole('heading', { name: lesson.title, exact: true })).toBeVisible();
});

test('secondary destinations remain available from a keyboard-operable menu', async ({ page }) => {
  await page.goto('/');
  const trigger = page.locator('.o-learning-menu summary');
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('navigation', { name: 'Meer ontdekken' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Taalwerkplaats', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('navigation', { name: 'Meer ontdekken' })).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole('link', { name: 'Mijn leerproces', exact: true }).click();
  await expect(page).toHaveURL(/\/voortgang$/);
  await expect(page.locator('.o-learning-menu')).not.toHaveAttribute('open');
});
