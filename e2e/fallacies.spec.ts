import type { Page } from '@playwright/test';
import { test, expect, seedOnboarded } from './fixtures';
import { argumentLessons } from '../src/content/argumentation/curriculum';
import { lessonScaffolds } from '../src/content/argumentation/scaffolds';
import { lessonCoreChecks } from '../src/content/argumentation/core-checks';
import { argumentInquiries } from '../src/content/argumentation/inquiries';
import { lessonIllustrations } from '../src/content/argumentation/illustrations';
import { shuffle } from '../src/engine/hash';

async function unlockThrough(page: Page, lessonId: string) {
  const ids = argumentLessons.slice(0, argumentLessons.findIndex((lesson) => lesson.id === lessonId)).map((lesson) => lesson.id);
  await page.addInitScript((unlocked) => {
    if (localStorage.getItem('pennig:argumentatie')) return;
    const records = Object.fromEntries(unlocked.map((id) => [id, { attempts: 1, bestScore: 100, lastScore: 100, completedAt: '2026-10-13T10:00:00Z', lastPracticedAt: '2026-10-13T10:00:00Z', reviewOn: '2099-01-01' }]));
    localStorage.setItem('pennig:argumentatie', JSON.stringify({ state: { records, sessions: {} }, version: 1 }));
  }, ids);
}

test.beforeEach(async ({ page }) => { await seedOnboarded(page); });

test('alle patronen hebben hun eigen vindbare les en filters bewaren één leerpad', async ({ page }) => {
  await page.goto('/argumentatie');
  await expect(page.getByRole('heading', { name: '48 drogredenen, elk een eigen les.', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Bekijk de drogredenlessen', exact: true }).click();
  const path = page.getByRole('region', { name: 'Jouw doorlopende leerpad', exact: true });
  await expect(path.locator('a[href^="/argumentatie/les/drogreden-"]')).toHaveCount(48);
  await expect(path.locator('a[href^="/argumentatie/les/basis-"]')).toHaveCount(0);
  const search = page.getByRole('searchbox', { name: 'Zoek in argumentatielessen', exact: true });
  await search.fill('ad populum');
  await expect(path.locator('a[href="/argumentatie/les/drogreden-populariteit"]')).toBeVisible();
  await search.fill('');
  await page.getByRole('button', { name: /^Bewijs en oorzaken/ }).click();
  const expected = argumentLessons.filter((lesson) => lesson.fallacy?.family === 'Bewijs en oorzaken');
  await expect(path.locator('a[href^="/argumentatie/les/drogreden-"]')).toHaveCount(expected.length);
  await page.getByRole('button', { name: 'Toon het hele leerpad', exact: true }).click();
  await expect(path.locator('a[href^="/argumentatie/les/"]')).toHaveCount(69);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

for (const slug of ['stropop', 'populariteit', 'gevolg-bevestigen']) {
  test(`${slug}: uitleg, grensgeval, puzzel en zelfstandige herstelopdracht werken samen`, async ({ page }, testInfo) => {
    if (testInfo.project.name === 'mobiel') await page.setViewportSize({ width: 375, height: 812 });
    else await page.setViewportSize({ width: 1280, height: 1100 });
    const lesson = argumentLessons.find((item) => item.id === `drogreden-${slug}`)!;
    await unlockThrough(page, lesson.id);
    await page.goto(`/argumentatie/les/${lesson.id}`);
    await expect(page.getByRole('heading', { name: lesson.title, exact: true, level: 1 })).toBeVisible();
    const starter = lessonScaffolds[lesson.id]!;
    const warmup = page.getByRole('region', { name: 'Begin met één kleine stap', exact: true });
    await warmup.getByRole('radio', { name: starter.options.find((item) => item.id === starter.answer)!.text, exact: true }).check();
    await page.getByRole('button', { name: 'Volgende pagina', exact: true }).click();
    await expect(page.getByRole('heading', { name: lesson.sections[0]!.title, exact: true })).toBeFocused();
    const image = lessonIllustrations[lesson.id]!;
    const illustration = page.getByRole('region', { name: `Interactieve illustratie: ${image.title}`, exact: true });
    await illustration.getByRole('button', { name: image.variants[1]!.label, exact: true }).click();
    await expect(illustration.getByText(image.variants[1]!.caption, { exact: true })).toBeVisible();
    await expect(page.getByText(lesson.sections[1]!.body, { exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: 'Volgende pagina', exact: true }).click();
    const inquiry = argumentInquiries[lesson.id]!;
    const own = page.getByRole('region', { name: 'Denk eerst zelf', exact: true });
    await expect(own.getByText(inquiry.model, { exact: true })).toHaveCount(0);
    await own.getByRole('textbox', { name: 'Jouw eerste analyse', exact: true }).fill('Ik reconstrueer eerst de echte claim en toets of de aangevoerde reden de conclusie voldoende draagt.');
    await own.getByRole('button', { name: 'Vergelijk mijn redenering', exact: true }).click();
    await expect(own.getByText(inquiry.model, { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Volgende pagina', exact: true }).click();
    const check = lessonCoreChecks[lesson.id]!;
    const core = page.getByRole('region', { name: 'Probeer deze denkstap', exact: true });
    const wrong = check.options.find((item) => item.id !== check.answer)!;
    await core.getByRole('radio', { name: wrong.text, exact: true }).check();
    await expect(core.getByRole('status')).toContainText(wrong.feedback);
    await expect(page.getByRole('button', { name: 'Volgende pagina', exact: true })).toBeDisabled();
    await core.getByRole('radio', { name: check.options.find((item) => item.id === check.answer)!.text, exact: true }).check();
    await page.reload();
    await expect(core.getByRole('radio', { name: check.options.find((item) => item.id === check.answer)!.text, exact: true })).toBeChecked();
    for (let step = 0; step < 10; step++) {
      const assignments = page.getByRole('button', { name: 'Naar de opdrachten', exact: true });
      if (await assignments.isVisible()) { await assignments.click(); break; }
      await page.getByRole('button', { name: 'Volgende pagina', exact: true }).click();
    }
    for (const [index, exercise] of lesson.exercises.entries()) {
      await expect(page.getByRole('heading', { name: exercise.prompt, exact: true })).toBeFocused();
      if (exercise.kind === 'choice') {
        await page.getByRole('radio', { name: exercise.options.find((item) => item.id === exercise.answer)!.text, exact: false }).check();
      } else if (exercise.kind === 'sort') {
        for (const [displayIndex, card] of shuffle(exercise.id, exercise.cards).entries()) await page.getByRole('combobox').nth(displayIndex).selectOption(card.category);
        await page.reload();
        const firstCard = shuffle(exercise.id, exercise.cards)[0]!;
        await expect(page.getByRole('combobox').first()).toHaveValue(firstCard.category);
        await expect(page.getByRole('heading', { name: exercise.prompt, exact: true }).locator('../..')).toHaveCSS('opacity', '1');
        await page.screenshot({ path: test.info().outputPath(`${slug}-puzzel.png`), fullPage: true });
      } else if (exercise.kind === 'reflection') {
        await page.getByRole('textbox', { name: 'Jouw analyse', exact: true }).fill(exercise.model);
      } else throw new Error('Een drogredenles gebruikt keuze, reconstructiepuzzel en schrijfwerk.');
      if (exercise.kind !== 'reflection') await page.getByRole('radio', { name: 'Redelijk zeker', exact: true }).check();
      await page.getByRole('button', { name: exercise.kind === 'reflection' ? 'Vergelijk met het model' : 'Controleer je analyse', exact: true }).click();
      const advance = page.getByRole('button', { name: index === lesson.exercises.length - 1 ? 'Les afronden' : 'Volgende opdracht', exact: true });
      if (exercise.kind === 'reflection') {
        await expect(advance).toBeDisabled();
        for (const criterion of exercise.rubric) await page.getByRole('checkbox', { name: criterion, exact: true }).check();
      }
      await advance.click();
    }
    await expect(page.getByRole('heading', { name: 'Je hebt de les doorgewerkt.', exact: true })).toBeVisible();
    const data = await page.evaluate((id) => JSON.parse(localStorage.getItem('pennig:argumentatie')!).state.sessions[id], lesson.id);
    expect(Object.keys(data.firstTry)).toHaveLength(4);
    const writing = lesson.exercises[4]!;
    expect(data.answers[writing.id].value).toBe(writing.kind === 'reflection' ? writing.model : '');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  });
}
