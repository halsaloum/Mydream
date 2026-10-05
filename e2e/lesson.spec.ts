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

test('klank en letter: de lessen staan per stap, van basis tot master', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: /^Niveau 2: Klank en letter/ }).click();
  for (const stage of ['Basis', 'Bachelor', 'Master']) {
    await expect(page.getByRole('heading', { name: new RegExp(`${stage}$`) }).first()).toBeVisible();
  }
  await expect(page.getByRole('link', { name: /Taal als wedstrijd/ })).toBeVisible();
});

test('OT-tableau: met het toetsenbord twee eisen wisselen tot de goede kandidaat wint', async ({ page }) => {
  await page.goto('/les/k23');
  await expect(page.getByRole('heading', { name: 'De fonoloog als detective' })).toBeVisible();
  const primary = page.getByRole('contentinfo').getByRole('button').last();
  await expect(primary).toBeDisabled();
  await expect(page.getByRole('rowheader', { name: /^\[zɑkduk\] ?, wint$/ })).toBeVisible();

  await page.getByRole('button', { name: 'AGREE(voice), plek 2 in de rangorde' }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'IDENT(voice), plek 1 in de rangorde' }).focus();
  await page.keyboard.press('Enter');

  await expect(page.getByRole('rowheader', { name: /^\[zɑgduk\] ?, wint$/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'AGREE(voice), plek 1 in de rangorde' })).toBeVisible();
  await expect(primary).toHaveText(/Volgende deel/);
  await expect(primary).toBeEnabled();
});
