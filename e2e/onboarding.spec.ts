import { expect, test } from './fixtures';

test('kennismaking: keuzes blijven bewaard en terug werkt', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/welkom\/focus$/);

  await page.getByRole('radio', { name: /Sterke zinnen/ }).click();
  await page.getByRole('button', { name: 'Doorgaan' }).click();
  await expect(page).toHaveURL(/\/welkom\/tempo$/);

  await page.goBack();
  await expect(page).toHaveURL(/\/welkom\/focus$/);
  await expect(page.getByRole('radio', { name: /Sterke zinnen/ })).toBeChecked();

  await page.getByRole('button', { name: 'Doorgaan' }).click();
  await page.getByRole('radio', { name: /10 min per dag/ }).click();
  await page.getByRole('button', { name: 'Doorgaan' }).click();
  await expect(page).toHaveURL(/\/welkom\/start$/);
  await page.getByRole('radio', { name: /Rustig vanaf het begin/ }).click();
  await page.getByRole('button', { name: 'Klaar, laten we beginnen' }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('link', { name: /Verder met jouw les/ })).toBeVisible();

  await page.reload();
  await expect(page).toHaveURL(/\/$/);
});
