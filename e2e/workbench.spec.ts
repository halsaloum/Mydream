import { test, expect } from '@playwright/test';
import { PARADIGM } from '../src/lib/ontleed/workbench';
import { seedOnboarded } from './fixtures';
test.beforeEach(async ({ page }) => { await seedOnboarded(page); });

test('the workbench builds a sentence, fills a paradigm and separates at-least-one from not-all', async ({ page }) => {
  await page.goto('/oefenvormen');
  await expect(page.getByRole('heading', { name: 'Maak taal zichtbaar.' })).toBeVisible();
  const chunks = [
    ['gisteren', 'Voorveld'], ['heeft', 'Eerste pool'], ['de onderzoeker', 'Middenveld'],
    ['het verslag', 'Middenveld'], ['zorgvuldig', 'Middenveld'], ['gelezen', 'Tweede pool'],
  ];
  for (const [chunk, field] of chunks) {
    await page.getByLabel('Losse zinsdelen').getByRole('button', { name: chunk!, exact: true }).click();
    await page.getByRole('button', { name: `Plaats in ${field}`, exact: true }).click();
  }
  await page.getByRole('button', { name: 'Controleer het schema' }).click();
  await expect(page.getByRole('status')).toContainText('Je schema klopt.');
  await page.getByRole('button', { name: 'Opnieuw bouwen' }).click();
  await expect(page.getByLabel('Losse zinsdelen').getByRole('button')).toHaveCount(6);

  await page.getByRole('button', { name: '02 Paradigma' }).click();
  for (const row of PARADIGM) {
    await page.getByRole('textbox', { name: `${row.label}, tegenwoordige tijd`, exact: true }).fill(row.present);
    await page.getByRole('textbox', { name: `${row.label}, verleden tijd`, exact: true }).fill(row.past);
  }
  await page.getByRole('button', { name: 'Controleer de vormen' }).click();
  await expect(page.getByRole('status')).toContainText('12 van 12 vormen kloppen.');
  await page.getByRole('button', { name: '03 Betekenis' }).click();
  for (const i of [4, 5, 6]) await page.getByRole('button', { name: `Dossier ${i}`, exact: true }).click();
  await page.getByRole('button', { name: 'De bewering is waar', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Je beoordeling klopt.');
  await page.getByRole('button', { name: 'Niet alle', exact: true }).click();
  await page.getByRole('button', { name: 'De bewering is onwaar', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Je beoordeling klopt.');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test('own writing persists across pages and is included in the validated backup', async ({ page }) => {
  await page.goto('/oefenvormen');
  await page.getByRole('button', { name: '05 Schrijfatelier' }).click();
  const text = 'Noor heeft het nieuwe verslag gelezen. Zij bespreekt de uitkomsten morgen. Daarom wacht Fatima nog even.';
  await page.getByRole('textbox', { name: 'Jouw tekst', exact: true }).fill(text);
  await page.locator('.o-marked-text').getByRole('button', { name: 'Zij', exact: true }).click();
  await expect(page.getByText('Onderzoek ‘Zij’', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'heeft, woord 2', exact: true }).click();
  await page.getByRole('button', { name: 'gelezen, woord 6', exact: true }).click();
  await expect(page.locator('.o-tang-result strong')).toHaveText('3');
  await page.reload();
  await page.getByRole('button', { name: '05 Schrijfatelier' }).click();
  await expect(page.getByRole('textbox', { name: 'Jouw tekst', exact: true })).toHaveValue(text);
  await page.goto('/instellingen');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Reservekopie maken' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  if (stream) for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const backup = JSON.parse(Buffer.concat(chunks).toString());
  expect(backup.ontleed.writingDraft).toBe(text);
  expect(backup.ontleed.mistakes).toEqual({});
  expect(backup.arguments).toBeDefined();
});

test('Alinea has its own real curriculum and URL filter', async ({ page }) => {
  await page.goto('/lessen?niveau=alinea');
  await expect(page.getByRole('status')).toHaveText('10 lessen gevonden');
  await expect(page.locator('a.o-lesson-row')).toHaveCount(10);
  await page.getByRole('textbox', { name: 'Zoek lessen' }).fill('kernzin');
  await expect(page).toHaveURL(/q=kernzin/);
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Zoek lessen' })).toHaveValue('kernzin');
  expect(await page.locator('a.o-lesson-row').count()).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test('library keeps every typed character while URL navigation is pending and restores the search', async ({ page }) => {
  await page.goto('/lessen?deel=zinsbouw');
  // Model a slower route response; fill() would miss the controlled-input bug.
  await page.route('**/lessen?**', async route => {
    await new Promise(resolve => setTimeout(resolve, 120));
    await route.continue();
  });
  const search = page.getByRole('textbox', { name: 'Zoek lessen' });
  await search.pressSequentially('persoonsvorm', { delay: 15 });
  await expect(search).toHaveValue('persoonsvorm');
  await expect(page).toHaveURL(/deel=zinsbouw&q=persoonsvorm/);
  expect(await page.locator('a.o-lesson-row').count()).toBeGreaterThan(0);
  await page.reload();
  await expect(search).toHaveValue('persoonsvorm');
  await expect(page.getByRole('button', { name: '04 · De zin in elkaar', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Zoekopdracht wissen', exact: true }).click();
  await expect(search).toHaveValue('');
  await expect(page).toHaveURL(/\/lessen\?deel=zinsbouw$/);
  await search.pressSequentially('woord', { delay: 10 });
  await expect(page).toHaveURL(/q=woord/);
  await page.getByRole('button', { name: 'Filters wissen', exact: true }).click();
  await expect(search).toHaveValue('');
  await expect(page).toHaveURL(/\/lessen$/);

  // Native filter updates must also stay in sync with real route changes.
  await search.fill('persoonsvorm');
  await expect(page).toHaveURL(/q=persoonsvorm/);
  const filteredUrl = page.url();
  const lessonLink = page.locator('a.o-lesson-row').first();
  const lessonUrl = new URL((await lessonLink.getAttribute('href'))!, filteredUrl).toString();
  await lessonLink.click();
  await expect(page).toHaveURL(lessonUrl);
  await page.goBack();
  await expect(page).toHaveURL(filteredUrl);
  await expect(search).toHaveValue('persoonsvorm');
  await page.goForward();
  await expect(page).toHaveURL(lessonUrl);
  await page.goBack();
  await expect(search).toHaveValue('persoonsvorm');

  // A normal Next Link changes history during commit; the input must follow it.
  await page.getByRole('link', { name: 'Bibliotheek', exact: true }).click();
  await expect(page).toHaveURL(/\/lessen$/);
  await expect(search).toHaveValue('');
  await page.goBack();
  await expect(page).toHaveURL(filteredUrl);
  await expect(search).toHaveValue('persoonsvorm');
});


test('the existential model uses a singular at-least-one statement for a single selected dossier', async ({ page }) => {
  await page.goto('/oefenvormen');
  await page.getByRole('button', { name: '03 Betekenis' }).click();
  await expect(page.getByRole('button', { name: 'Minstens één', exact: true })).toHaveAttribute('aria-pressed', 'true');
  for (const i of [2, 3]) await page.getByRole('button', { name: `Dossier ${i}`, exact: true }).click();
  await expect(page.getByText('Minstens één dossier is gecontroleerd.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'De bewering is waar', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Je beoordeling klopt.');
  await page.getByRole('button', { name: 'Dossier 1', exact: true }).click();
  await page.getByRole('button', { name: 'De bewering is onwaar', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Je beoordeling klopt.');
});
