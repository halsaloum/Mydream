import { mkdir } from 'node:fs/promises';
import { test, expect, seedOnboarded } from './fixtures';
import { ontleedLessons } from '../src/content/ontleed';
import { getLessonVideos } from '../src/content/ontleed/media';
import { completeTheory } from './theory-fixtures';

test.beforeEach(async ({ page }) => { await seedOnboarded(page); });

test('each learning level displays its local illustration without breaking the path', async ({ page }, testInfo) => {
  await mkdir('output/media', { recursive: true });
  await page.goto('/');
  for (const [index, level] of ['Woord', 'Zin', 'Alinea'].entries()) {
    await page.getByRole('button', { name: `${index + 1} ${level}`, exact: true }).click();
    const art = page.locator('.o-journey-illustrated img');
    await expect(art).toHaveCount(1);
    await expect(art).toHaveAttribute('src', `/illustrations/ontleed/${level.toLowerCase()}.svg`);
    await expect.poll(() => art.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    await expect(page.locator('.o-journey-step.is-current')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.screenshot({ path: `output/media/${testInfo.project.name}-path-${level.toLowerCase()}.png`, fullPage: true });
  }
  await page.goto('/lessen?niveau=alinea');
  await expect(page.locator('.o-curriculum-level-heading img')).toHaveAttribute('src', '/illustrations/ontleed/alinea.svg');
  await expect(page.getByText('met videouitleg', { exact: false }).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test('video is optional after exploring the explanation and its player loads only on request', async ({ page }, testInfo) => {
  const lesson = ontleedLessons.find(item => getLessonVideos(item.id).length > 0)!;
  const video = getLessonVideos(lesson.id)[0]!;
  // Test our embed lifecycle without depending on a third-party player response.
  await page.route('https://www.youtube-nocookie.com/embed/**', route => route.fulfill({
    contentType: 'text/html', body: '<!doctype html><html lang="nl"><body>Externe videospeler</body></html>',
  }));
  await page.goto(`/les/${lesson.id}`);
  const media = page.locator('.o-lesson-videos');
  await expect(media).toHaveCount(0);
  await page.getByRole('radio').nth(lesson.discovery.answer).click();
  await page.getByRole('button', { name: 'Controleer antwoord', exact: true }).click();
  const forward = page.getByRole('contentinfo').getByRole('button', { name: 'Verder', exact: true });
  await forward.click();
  await expect(media).toHaveCount(0);
  await expect(forward).toBeDisabled();
  await completeTheory(page, lesson, 0);
  await expect(media).toHaveCount(1);
  await expect(media.getByRole('heading', { name: 'Even meekijken' })).toBeVisible();
  await expect(media.locator('iframe')).toHaveCount(0);
  await expect(forward).toBeEnabled();
  await mkdir('output/media', { recursive: true });
  await media.scrollIntoViewIfNeeded();
  await expect.poll(() => media.locator('img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete))).toBe(true);
  await media.screenshot({ path: `output/media/${testInfo.project.name}-video-preview.png` });
  await media.getByRole('button', { name: `Bekijk ${video.title}`, exact: true }).click();
  await expect(media.locator('iframe')).toHaveAttribute('src', `https://www.youtube-nocookie.com/embed/${video.id}?rel=0`);
  await expect(media.locator('iframe')).toHaveAttribute('title', video.title);
  await expect(media.getByRole('link', { name: 'Open op YouTube', exact: true }).first()).toHaveAttribute('href', video.watchUrl);
  await media.getByRole('button', { name: 'Video sluiten', exact: true }).click();
  await expect(media.locator('iframe')).toHaveCount(0);
  await expect(media.getByRole('button', { name: `Bekijk ${video.title}`, exact: true })).toBeFocused();
  await forward.click();
  await expect(media).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});
