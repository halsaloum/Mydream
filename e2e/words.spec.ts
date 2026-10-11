import { expect, seedOnboarded, test } from './fixtures';

test.beforeEach(async ({ page }) => seedOnboarded(page));

test('woorden: de ronde van vandaag begint met raden, en hervat na verversen', async ({ page }) => {
  await page.goto('/woorden');
  await expect(page.getByRole('heading', { level: 1, name: 'Woorden' })).toBeVisible();
  const today = page.getByRole('region', { name: 'Woorden van vandaag' });
  await expect(today.getByText(/nieuwe woorden/).first()).toBeVisible();
  await today.getByRole('button', { name: 'Begin' }).click();

  await expect(page).toHaveURL(/\/woorden\/vandaag$/);
  await expect(page.getByText('Nieuw woord', { exact: true })).toBeVisible();
  const options = page.getByRole('radio');
  await expect(options).toHaveCount(4);
  await options.first().click();
  const primary = page.getByRole('contentinfo').getByRole('button', { name: /Doorgaan/ });
  await expect(primary).toBeEnabled();
  await primary.click();

  // De woordkaart: het woord en hardop zeggen.
  await expect(page.getByRole('contentinfo').getByRole('button', { name: /Begrepen/ })).toBeEnabled();
  await page.reload();
  await expect(page.getByRole('contentinfo').getByRole('button', { name: /Begrepen/ })).toBeEnabled();

  await page.goto('/woorden');
  await expect(page.getByRole('region', { name: 'Woorden van vandaag' }).getByText(/Opdracht 2 van \d+/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ga verder' })).toBeVisible();
});

test('woorden: een woord openen in de lijst toont de kaart', async ({ page }) => {
  await page.goto('/woorden');
  await page.getByRole('button', { name: /^Leidinggeven/ }).click();
  await page.getByRole('button', { name: /^delegeren: / }).click();
  const sheet = page.getByRole('dialog');
  await expect(sheet.getByRole('heading', { level: 3, name: 'delegeren' })).toBeVisible();
  await expect(sheet.getByText(/Nog niet geleerd/)).toBeVisible();
});
