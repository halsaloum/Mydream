import { expect, seedOnboarded, test } from './fixtures';

test.beforeEach(async ({ page }) => seedOnboarded(page));

test('les direct openen, met het toetsenbord doen en na verversen hervatten', async ({ page }) => {
  await page.goto('/les/l4');
  await expect(page.getByRole('heading', { name: 'Tekens geven toon' })).toBeVisible();

  const primary = page.getByRole('contentinfo').getByRole('button').last();
  await expect(primary).toHaveText(/Doe eerst de opdracht/);
  await expect(primary).toBeDisabled();

  await page.getByRole('radio', { name: 'rustig' }).click();
  await expect(page.getByText('Kun je even bellen?')).toBeVisible();
  await page.keyboard.press('Enter');

  await expect(page.getByRole('heading', { name: 'Welke past in een mail aan een klant?' })).toBeVisible();
  await page.keyboard.press('1');
  await expect(page.getByRole('radio', { name: /Bedankt voor uw bericht\.$/ })).toBeChecked();

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Welke past in een mail aan een klant?' })).toBeVisible();
  await expect(page.getByRole('radio', { name: /Bedankt voor uw bericht\.$/ })).toBeChecked();

  await page.keyboard.press('Enter');
  await expect(page.getByRole('status').filter({ hasText: 'Rustig en zakelijk.' })).toBeVisible();
  await page.keyboard.press('Enter');

  await expect(page.getByRole('heading', { name: 'Wat je nu weet' })).toBeVisible();
  await page.getByRole('link', { name: 'Naar Leren' }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto('/voortgang');
  await expect(page.getByText('Lessen af')).toBeVisible();
});

test('regelvenster: focus, Escape en terug naar de knop', async ({ page }) => {
  await page.goto('/les/l4');
  await page.getByRole('radio', { name: 'rustig' }).click();
  await page.getByRole('contentinfo').getByRole('button', { name: /Ik snap het/ }).click();

  const opener = page.getByRole('button', { name: 'De regel' });
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'De regel' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: 'Tekens geven toon' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('onbekende les toont een verzorgde melding', async ({ page }) => {
  const response = await page.goto('/les/bestaat-niet');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Deze les bestaat niet' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Naar alle lessen' })).toBeVisible();
});
