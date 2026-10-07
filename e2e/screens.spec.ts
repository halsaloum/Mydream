import { expect, seedOnboarded, test } from './fixtures';

test.beforeEach(async ({ page }) => seedOnboarded(page));

test('bibliotheek: filter staat in de URL en de resultaten volgen', async ({ page }) => {
  await page.goto('/lessen');
  await expect(page.getByRole('status').filter({ hasText: '133 lessen' })).toBeVisible();
  await page.getByRole('button', { name: /9\. De alinea/ }).click();
  await expect(page).toHaveURL(/niveau=alinea/);
  await expect(page.getByRole('status').filter({ hasText: '2 lessen' })).toBeVisible();
  await page.getByRole('button', { name: 'Filters wissen' }).click();
  await expect(page.getByRole('status').filter({ hasText: '133 lessen' })).toBeVisible();
});

test('oefenvorm: swipe-kaarten met alleen het toetsenbord', async ({ page }) => {
  await page.goto('/oefenvormen/swipe-kaarten');
  await expect(page.getByRole('heading', { name: 'Goed of fout geschreven?' })).toBeVisible();
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press(i % 2 ? 'ArrowLeft' : 'ArrowRight');
    await page.waitForTimeout(450);
  }
  const primary = page.getByRole('contentinfo').getByRole('button', { name: /Doorgaan/ });
  await expect(primary).toBeEnabled();
  await primary.click();
  await expect(page.getByText(/telt niet mee voor je voortgang/)).toBeVisible();
});

test('rustige beweging: instelling wordt bewaard en direct toegepast', async ({ page }) => {
  await page.goto('/instellingen');
  const toggle = page.getByRole('switch', { name: 'Rustige beweging' });
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'calm');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'calm');
  await expect(page.getByRole('switch', { name: 'Rustige beweging' })).toBeChecked();
});

test('systeemvoorkeur voor minder beweging: geen confetti bij een opgeloste opdracht', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await seedOnboarded(page);
  await page.goto('/les/l1');
  for (const letter of ['a', 'e', 'i', 'o', 'u']) await page.getByRole('button', { name: letter, exact: true }).click();
  await expect(page.getByRole('contentinfo').getByRole('button', { name: /Volgende deel/ })).toBeEnabled();
  await expect(page.locator('canvas')).toHaveCount(0);
  await context.close();
});
