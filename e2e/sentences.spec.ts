import type { Page } from '@playwright/test';
import { sentenceLessons } from '../src/content/sentences';
import type { SentenceExercise, SentenceToken, SlotExercise } from '../src/content/sentences/types';
import { test, expect, seedOnboarded } from './fixtures';

test.beforeEach(async ({ page }) => { await seedOnboarded(page); });

const firstLesson = sentenceLessons.find((lesson) => lesson.id === 'zinnen-01')!;
const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function tokenName(tokens: SentenceToken[], id: string, prefix: 'diagnosis' | 'tether'): string {
  const index = tokens.findIndex((token) => token.id === id);
  const token = tokens[index]!;
  const duplicate = tokens.filter((item) => item.text === token.text).length > 1;
  const suffix = duplicate ? ` (woord ${index + 1})` : '';
  return prefix === 'diagnosis' ? `${token.text} kiezen${suffix}` : `Verbind vanaf of naar ${token.text}${suffix}`;
}

async function toggleBoundary(page: Page, exercise: SentenceExercise, boundary: number) {
  const token = exercise.segmentation!.tokens[boundary - 1]!;
  await page.getByRole('button', { name: `Grens na ${token.text} (woord ${boundary})`, exact: true }).click();
}

async function buildSlots(page: Page, exercise: SlotExercise) {
  const accepted = exercise.accept[0]!;
  for (const slot of exercise.slots) {
    for (const blockId of accepted[slot.id] ?? []) {
      const block = exercise.blocks.find((item) => item.id === blockId)!;
      await page.getByRole('combobox', { name: `Plaats ${block.text} in`, exact: true }).selectOption(slot.id);
    }
  }
  // Reordering must happen through the learner's controls, including a multi-block middle field.
  for (const [slotIndex, slot] of exercise.slots.entries()) {
    const region = page.getByRole('region', { name: `Zinsplek ${slotIndex + 1}`, exact: true });
    for (const [target, blockId] of (accepted[slot.id] ?? []).entries()) {
      const block = exercise.blocks.find((item) => item.id === blockId)!;
      const names = await region.getByRole('button', { name: /^Kies blok / }).evaluateAll((buttons) => buttons.map((button) => button.getAttribute('aria-label')));
      let current = names.indexOf(`Kies blok ${block.text}`);
      expect(current).toBeGreaterThanOrEqual(0);
      while (current > target) {
        await region.getByRole('button', { name: `${block.text} eerder in ${slot.label}`, exact: true }).click();
        current--;
      }
    }
  }
}

async function solveExercise(page: Page, exercise: SentenceExercise) {
  await expect(page.getByRole('heading', { name: exercise.prompt, exact: true })).toBeVisible();
  if (exercise.support === 'half') {
    await expect(page.getByRole('button', { name: 'Controleer mijn toepassing', exact: true })).toBeDisabled();
    for (const boundary of exercise.segmentation!.boundaries) await toggleBoundary(page, exercise, boundary);
    await page.getByRole('button', { name: 'Controleer mijn bouwblokken', exact: true }).click();
    await expect(page.getByText('Je bouwblokken kloppen. Je kunt nu met de hele blokken werken.', { exact: true })).toBeVisible();
  }
  if (exercise.kind === 'slots') {
    await buildSlots(page, exercise);
  } else if (exercise.kind === 'gate' || exercise.kind === 'debug') {
    const tokens = exercise.kind === 'gate' ? exercise.diagnosis.tokens : exercise.tokens;
    const targets = exercise.kind === 'gate' ? exercise.diagnosis.targets : exercise.targets;
    for (const id of targets) await page.getByRole('button', { name: tokenName(tokens, id, 'diagnosis'), exact: true }).click();
    await page.getByRole('button', { name: 'Controleer mijn diagnose', exact: true }).click();
    if (exercise.kind === 'gate') {
      const option = exercise.options.find((item) => item.id === exercise.answer)!;
      await page.getByRole('radio', { name: new RegExp(`${escapeRegExp(option.text)}$`) }).check();
    } else await page.getByRole('textbox', { name: exercise.instruction, exact: true }).fill(exercise.repairs[0]!);
  } else if (exercise.kind === 'tether') {
    for (const link of exercise.links) {
      await page.getByRole('button', { name: tokenName(exercise.tokens, link.from, 'tether'), exact: true }).click();
      await page.getByRole('button', { name: tokenName(exercise.tokens, link.to, 'tether'), exact: true }).click();
    }
  } else {
    const variant = exercise.variants.find((item) => item.id === exercise.target)!;
    await page.getByRole('button', { name: variant.label, exact: true }).click();
    const reconstruction = page.getByRole('region', { name: 'Bouw je veranderde zin', exact: true });
    const before = await reconstruction.getByRole('listitem').locator('p').allTextContents();
    expect(before).not.toEqual(variant.order.map((id) => variant.blocks.find((block) => block.id === id)!.text));
    for (const [target, blockId] of variant.order.entries()) {
      const block = variant.blocks.find((item) => item.id === blockId)!;
      const texts = await reconstruction.getByRole('listitem').locator('p').allTextContents();
      let current = texts.indexOf(block.text);
      expect(current).toBeGreaterThanOrEqual(0);
      while (current > target) {
        await reconstruction.getByRole('button', { name: `${block.text} naar voren`, exact: true }).click();
        current--;
      }
    }
  }
  await page.getByRole('button', { name: 'Controleer mijn toepassing', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Deze toepassing klopt.', exact: true })).toBeVisible();
}

async function selectTab(page: Page, index: number) {
  const tabs = page.getByRole('tablist', { name: 'De vijf onderdelen van deze les', exact: true }).getByRole('tab');
  await tabs.nth(index).click();
  await expect(tabs.nth(index)).toHaveAttribute('aria-selected', 'true');
}

test('de afdeling Zinnen bundelt twaalf interactieve modules en behoudt alle dertig eerdere lessen', async ({ page }) => {
  await page.goto('/zinnen');
  await expect(page.getByRole('heading', { name: 'Zinnen', exact: true, level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /^Open de module\s*:/ })).toHaveCount(12);
  for (const lesson of sentenceLessons) await expect(page.getByRole('heading', { name: lesson.title, exact: true })).toBeVisible();
  await expect(page.getByText('0 van 12 modules afgerond · 120 bouw- en reparatieopdrachten', { exact: true })).toBeVisible();
  const search = page.getByRole('searchbox', { name: 'Zoek op onderwerp', exact: true });
  await search.fill(sentenceLessons[1]!.title);
  await expect(page.getByRole('link', { name: /^Open de module\s*:/ })).toHaveCount(1);
  await expect(page.getByRole('heading', { name: sentenceLessons[1]!.title, exact: true })).toBeVisible();
  await search.fill('');
  await page.getByText('Extra oefenen en verdiepen · 30 lessen', { exact: true }).click();
  await page.getByRole('link', { name: 'Bekijk de 30 aanvullende lessen', exact: true }).click();
  await expect(page).toHaveURL(/\/lessen\?niveau=zinnen$/);
  const combined = page.getByRole('region', { name: /^Niveau 6.*Zinnen$/ });
  await expect(combined.locator('a[href^="/les/"]')).toHaveCount(30);
  await expect(page.getByRole('heading', { name: /De woordgroep|De enkelvoudige zin|De samengestelde zin/ })).toHaveCount(0);
  for (const id of ['p1', 'z1', 's1']) await expect(combined.locator(`a[href="/les/${id}"]`)).toBeVisible();
  await page.goto('/lessen?niveau=zin');
  await expect(page.getByRole('region', { name: /^Niveau 6.*Zinnen$/ }).locator('a[href^="/les/"]')).toHaveCount(30);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});

test('vijf echte lesonderdelen werken met toetsenbord en het lab bewaart het gekozen contrast', async ({ page }) => {
  await page.goto(`/zinnen/les/${firstLesson.id}`);
  const tabs = page.getByRole('tablist', { name: 'De vijf onderdelen van deze les', exact: true }).getByRole('tab');
  await expect(tabs).toHaveCount(5);
  await tabs.nth(0).focus();
  await tabs.nth(0).press('ArrowRight');
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'Begrijp eerst wat er gebeurt.', exact: true })).toBeVisible();
  await tabs.nth(1).press('ArrowRight');
  await expect(tabs.nth(2)).toBeFocused();
  await expect(page.getByRole('heading', { name: firstLesson.arena[0]!.prompt, exact: true })).toBeVisible();
  await tabs.nth(2).press('ArrowRight');
  await expect(tabs.nth(3)).toBeFocused();
  await expect(page.getByRole('heading', { name: firstLesson.debugger[0]!.prompt, exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Jouw reparatie: eerst zelfstandig de fout vinden', exact: true })).toBeDisabled();
  await expect(page.getByText(firstLesson.debugger[0]!.instruction, { exact: true })).toHaveCount(0);
  await tabs.nth(3).press('End');
  await expect(tabs.nth(4)).toBeFocused();
  await expect(page.getByRole('heading', { name: firstLesson.summary.title, exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Module afronden en samenvatting bewaren', exact: true })).toHaveCount(0);
  await tabs.nth(4).press('Home');
  await expect(tabs.nth(0)).toBeFocused();
  const variant = firstLesson.discovery.variants.at(-1)!;
  const button = page.getByRole('group', { name: 'Contrasterende voorbeelden', exact: true }).getByRole('button', { name: new RegExp(`^${escapeRegExp(variant.label)}(?: · bekeken)?$`) });
  await button.click();
  await expect(page.getByRole('region', { name: 'Zinnen ontdekken', exact: true }).getByRole('status')).toHaveText(variant.sentence);
  await page.reload();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('region', { name: 'Zinnen ontdekken', exact: true }).getByRole('status')).toHaveText(variant.sentence);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});

test('een volledige module vereist zes bouwopdrachten en vier eigen reparaties om de samenvatting te bewaren', async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto('/zinnen/codex');
  await expect(page.getByRole('heading', { name: 'Je eerste samenvatting wacht op je.', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Begin met module 1', exact: true }).click();
  await selectTab(page, 2);

  for (const [index, exercise] of firstLesson.arena.entries()) {
    await expect(page.getByRole('heading', { name: exercise.prompt, exact: true })).toBeVisible();
    if (exercise.kind === 'gate' && exercise.support === 'volledig') {
      const radios = page.getByRole('radio');
      await expect(radios).toHaveCount(exercise.options.length);
      expect(exercise.options.length).toBeGreaterThanOrEqual(3);
      for (const radio of await radios.all()) await expect(radio).toBeDisabled();
      const wrongToken = exercise.diagnosis.tokens.find((token) => !exercise.diagnosis.targets.includes(token.id))!;
      const wrong = page.getByRole('button', { name: tokenName(exercise.diagnosis.tokens, wrongToken.id, 'diagnosis'), exact: true });
      await wrong.click();
      await page.getByRole('button', { name: 'Controleer mijn diagnose', exact: true }).click();
      await expect(page.getByText(/Deze selectie verklaart het probleem nog niet volledig/)).toBeVisible();
      for (const radio of await radios.all()) await expect(radio).toBeDisabled();
      await expect(page.getByRole('button', { name: 'Controleer mijn toepassing', exact: true })).toBeDisabled();
      await wrong.click();
    }
    if (exercise.support === 'half' && index === 3) {
      await expect(page.getByRole('combobox')).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Controleer mijn toepassing', exact: true })).toBeDisabled();
      const incorrectBoundary = exercise.segmentation!.tokens.findIndex((_, position) => position < exercise.segmentation!.tokens.length - 1 && !exercise.segmentation!.boundaries.includes(position + 1)) + 1;
      expect(incorrectBoundary).toBeGreaterThan(0);
      await toggleBoundary(page, exercise, incorrectBoundary);
      await page.reload();
      const token = exercise.segmentation!.tokens[incorrectBoundary - 1]!;
      await expect(page.getByRole('button', { name: `Grens na ${token.text} (woord ${incorrectBoundary})`, exact: true })).toHaveAttribute('aria-pressed', 'true');
      await expect(page.getByRole('combobox')).toHaveCount(0);
      await page.getByRole('button', { name: 'Controleer mijn bouwblokken', exact: true }).click();
      await expect(page.getByText(exercise.segmentation!.feedback, { exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Controleer mijn toepassing', exact: true })).toBeDisabled();
      await toggleBoundary(page, exercise, incorrectBoundary);
    }
    if (exercise.kind === 'tether') {
      const expected = exercise.links[0]!;
      const wrongId = Object.keys(exercise.distractorFeedback ?? {}).find((id) => exercise.tokens.some((token) => token.id === id) && id !== expected.from && id !== expected.to)!;
      await page.getByRole('button', { name: tokenName(exercise.tokens, expected.from, 'tether'), exact: true }).click();
      await page.getByRole('button', { name: tokenName(exercise.tokens, wrongId, 'tether'), exact: true }).click();
      await page.getByRole('button', { name: 'Controleer mijn toepassing', exact: true }).click();
      await expect(page.getByRole('heading', { name: 'Onderzoek je toepassing opnieuw.', exact: true })).toBeVisible();
      await expect(page.getByText(exercise.distractorFeedback![wrongId]!, { exact: true })).toBeVisible();
      const from = exercise.tokens.find((token) => token.id === expected.from)!.text;
      const to = exercise.tokens.find((token) => token.id === wrongId)!.text;
      await page.getByRole('button', { name: `Verwijder verbinding ${from} naar ${to}`, exact: true }).click();
    }
    await solveExercise(page, exercise);
    if (index === 2) {
      await page.reload();
      await expect(page.getByRole('heading', { name: exercise.prompt, exact: true })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Deze toepassing klopt.', exact: true })).toBeVisible();
    }
    await page.getByRole('button', { name: index === firstLesson.arena.length - 1 ? 'Naar zelfstandig repareren' : 'Volgende opdracht', exact: true }).click();
  }

  for (const [index, exercise] of firstLesson.debugger.entries()) {
    const repair = page.getByRole('textbox', { name: 'Jouw reparatie: eerst zelfstandig de fout vinden', exact: true });
    await expect(repair).toBeDisabled();
    await expect(page.getByText(exercise.instruction, { exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Controleer mijn toepassing', exact: true })).toBeDisabled();
    await expect(page.getByText(exercise.repairs[0]!, { exact: true })).toHaveCount(0);
    await solveExercise(page, exercise);
    await page.getByRole('button', { name: index === firstLesson.debugger.length - 1 ? 'Naar de samenvatting' : 'Volgende opdracht', exact: true }).click();
  }
  await expect(page.getByText('10/10', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Module afronden en samenvatting bewaren', exact: true }).click();
  await expect(page.getByRole('heading', { name: firstLesson.summary.title, exact: true })).toBeVisible();
  await expect(page.getByText(/90% van je eerste gecontroleerde toepassingen klopte/)).toBeVisible();
  const transfer = 'De vriendelijke docent bij het raam leest een boek over taal. Zij leest het. Bij het raam beschrijft hier welke docent ik bedoel.';
  await page.getByRole('textbox', { name: 'Pas dit toe in je eigen tekst', exact: true }).fill(transfer);
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Pas dit toe in je eigen tekst', exact: true })).toHaveValue(transfer);
  await page.getByRole('region', { name: 'Voortgang en afronding', exact: true }).getByRole('link', { name: 'Mijn samenvattingen', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Mijn samenvattingen', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: `1. ${firstLesson.summary.title}`, exact: true })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('1 samenvattingen zichtbaar · 1 van 12 verzameld');
  await expect(page.getByText(transfer, { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText(transfer, { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});
