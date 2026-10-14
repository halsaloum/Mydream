import { expect, seedOnboarded, test } from './fixtures';
import { practiceTopic } from '../src/lib/practice/catalog';

test.beforeEach(async ({ page }) => seedOnboarded(page));

test('kennischecks beginnen bij echte afgeronde lessen en tonen de onderzoeksbronnen', async ({ page }) => {
  await page.goto('/herhalen');
  await expect(page.getByRole('heading', { name: 'Wat weet je nog zonder uitleg?' })).toBeVisible();
  await expect(page.getByText('Rond eerst een les af. Daarna verschijnt hier je eerste kennischeck.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start mijn kennischeck' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Onderzoek achter deze aanpak' }).click();
  await expect(page.getByRole('link', { name: /Dunlosky/ })).toHaveAttribute('href', 'https://doi.org/10.1177/1529100612453266');
  await page.goto('/herhalen/kennis');
  await expect(page.getByRole('heading', { name: 'Je hoeft nu niets op te halen' })).toBeVisible();
});

test('zelfstandig ophalen bewaart een fout eerste antwoord, hervat en plant sneller zonder lesresultaten te overschrijven', async ({ page }) => {
  const topic = practiceTopic('schrijven:l1')!;
  const question = topic.questions.at(-1)!;
  if (question.step.kind !== 'type') throw new Error('Deze fixture controleert de zelfstandige getypte eindtaak van l1.');
  await page.addInitScript(() => {
    if (localStorage.getItem('pennig:voortgang')) return;
    const at = new Date(Date.now() - 2 * 86400000).toISOString();
    localStorage.setItem('pennig:voortgang', JSON.stringify({ version: 1, state: {
      lessons: { l1: { attempts: 1, bestAccuracy: 100, lastAccuracy: 100, firstCompletedAt: at, lastCompletedAt: at } },
      review: {}, activity: {}, history: [],
    } }));
  });
  await page.goto('/herhalen');
  await page.getByRole('link', { name: 'Start mijn kennischeck' }).click();
  await expect(page.getByRole('heading', { name: question.step.prompt, exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'De regel', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Toon een aanwijzing', exact: true })).toHaveCount(0);
  await page.getByRole('textbox').fill('onjuistantwoord');
  await page.getByRole('contentinfo').getByRole('button', { name: 'Controleer', exact: true }).click();
  await expect(page.getByRole('button', { name: 'De regel', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('textbox')).toHaveValue('onjuistantwoord');
  await expect(page.getByRole('textbox')).toHaveAttribute('readonly', '');
  await page.getByRole('contentinfo').getByRole('button', { name: /Doorgaan/ }).click();
  await expect(page.getByRole('textbox')).toHaveCount(1);
  await page.getByRole('textbox').fill(question.step.answer);
  await page.getByRole('contentinfo').getByRole('button', { name: 'Controleer', exact: true }).click();
  await page.getByRole('contentinfo').getByRole('button', { name: /Doorgaan/ }).click();
  await expect(page.getByRole('heading', { name: 'Kennischeck afgerond' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Kennischeck afgerond' })).toBeVisible();
  const saved = await page.evaluate(() => ({
    practice: JSON.parse(localStorage.getItem('pennig:gespreid-ophalen')!).state,
    progress: JSON.parse(localStorage.getItem('pennig:voortgang')!).state,
  }));
  expect(saved.practice.records['schrijven:l1'].lastScore).toBe(0);
  expect(saved.practice.records['schrijven:l1'].reviews).toBe(1);
  expect(saved.practice.session.committed).toBe(true);
  expect(saved.progress.lessons.l1.attempts).toBe(1);
  expect(saved.progress.history[0].accuracy).toBe(0);
});
