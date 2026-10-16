import { test, expect, seedOnboarded } from './fixtures';
import { getOntleedLesson } from '../src/content/ontleed';

const sampleLessons = ['basis-vorm-functie', 'zinsdelen-persoonsvorm', 'betekenis-ontkenning-bereik', 'volle-zin-herzien', 'alinea-woordketens'];

test.beforeEach(async ({ page }) => { await seedOnboarded(page); });

for (const id of sampleLessons) {
  test(`${id}: the explanation has real reasoning steps, vocabulary and source anchors`, async ({ page }) => {
    const lesson = getOntleedLesson(id)!;
    await page.goto(`/les/${id}`);
    await page.getByRole('radio').nth(lesson.discovery.answer).check();
    await page.getByRole('button', { name: 'Controleer antwoord', exact: true }).click();
    await page.getByRole('contentinfo').getByRole('button', { name: 'Verder', exact: true }).click();
    const teaching = lesson.sections[0]!.teaching!;
    await expect(page.getByText(teaching.core, { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Stap voor stap', exact: true })).toBeVisible();
    const switches = page.getByRole('list', { name: 'Uitlegstappen' });
    for (const step of teaching.steps) {
      const button = switches.getByRole('button', { name: step.title, exact: true });
      await button.focus();
      await page.keyboard.press('Enter');
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(page.getByText(step.text, { exact: true })).toBeVisible();
    }
    await expect(page.getByText(teaching.memory, { exact: true })).toBeVisible();
    if (teaching.terms?.length) {
      await page.locator('summary').filter({ hasText: 'Woordenhulp' }).click();
      for (const term of teaching.terms) await expect(page.getByText(term.meaning, { exact: true })).toBeVisible();
    }
    await page.locator('summary').filter({ hasText: 'Bronnen bij deze uitleg' }).click();
    for (const source of teaching.sources) {
      await expect(page.getByText(source.section, { exact: true })).toBeVisible();
      await expect(page.locator(`.o-teaching-sources a[href="/bronnen#bron-${source.bookId}"]`).first()).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    const sourceId = teaching.sources[0]!.bookId;
    await page.locator(`.o-teaching-sources a[href="/bronnen#bron-${sourceId}"]`).first().click();
    await expect(page).toHaveURL(new RegExp(`/bronnen#bron-${sourceId}$`));
    await expect(page.locator(`#bron-${sourceId}`)).toBeVisible();
  });
}
