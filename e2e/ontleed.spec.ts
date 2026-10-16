import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import { ontleedLessons, PARTS } from '../src/content/ontleed';
import { BOOKS } from '../src/content/ontleed/sources';
import type { LessonLab, Question } from '../src/content/ontleed/types';
import { normalize } from '../src/lib/ontleed/grade';
import { getLessonEntry } from '../src/content/catalog';
import { planFor } from '../src/lib/plans';
import { isScored } from '../src/engine/kinds';
import { seedOnboarded } from './fixtures';
import { completeTheory } from './theory-fixtures';

const STORE = 'pennig:ontleed-v1';
const firstLesson = ontleedLessons[0]!;
type Persisted = {
  sessions: Record<string, { step: number; answers: Record<string, { answer: unknown; correct: boolean }>; draft: string; checks: number[] }>;
  completed: Record<string, { accuracy: number; firstAccuracy: number; count: number }>;
  retrieval: Record<string, { due: number; interval: number; attempts: number; correct: number; last: number; successfulDays?: string[] }>;
  mistakes: Record<string, { attempts: number; correct: number; resolved: boolean }>;
  reviewRound: { items: { lessonId: string; questionId: string }[]; position: number; responses: Record<string, { correct: boolean }> } | null;
};

test.beforeEach(async ({ page }) => {
  // Enables only the existing protected player onboarding; no learning records are invented.
  await seedOnboarded(page);
});

async function stored(page: Page): Promise<Persisted> {
  return page.evaluate(key => {
    const raw = localStorage.getItem(key);
    if (!raw) throw new Error('Ontleed has not persisted its state.');
    return (JSON.parse(raw) as { state: Persisted }).state;
  }, STORE);
}

async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
}

async function next(page: Page) {
  await page.getByRole('contentinfo').getByRole('button', { name: 'Verder', exact: true }).click();
}

/** Recover a valid token permutation from the actual accepted sentence, including duplicate chunks. */
function correctOrder(question: Extract<Question, { kind: 'order' }>): number[] {
  const accepted = normalize(question.accept[0]!);
  function find(prefix: number[], remaining: number[]): number[] | undefined {
    const text = normalize(prefix.map(index => question.tokens[index]!).join(' '));
    if (remaining.length === 0) return text === accepted ? prefix : undefined;
    for (const index of remaining) {
      const trial = [...prefix, index];
      const trialText = normalize(trial.map(i => question.tokens[i]!).join(' '));
      if (accepted !== trialText && !accepted.startsWith(`${trialText} `)) continue;
      const answer = find(trial, remaining.filter(i => i !== index));
      if (answer) return answer;
    }
    return undefined;
  }
  const answer = find([], question.tokens.map((_, index) => index));
  if (!answer) throw new Error(`No accepted chunk order for ${question.id}`);
  return answer;
}

async function submitQuestion(page: Page, question: Question, wrong = false, retry = false) {
  await expect(page.getByRole('heading', { name: question.prompt, exact: true })).toBeVisible();
  const widget = page.locator('.o-question');
  switch (question.kind) {
    case 'choice': {
      const index = wrong ? (question.answer + 1) % question.options.length : question.answer;
      await widget.getByRole('radio').nth(index).click();
      break;
    }
    case 'type':
      await widget.getByRole('textbox', { name: 'Jouw antwoord' }).fill(wrong ? 'een onjuist antwoord' : question.accept[0]!);
      break;
    case 'mark': {
      const indices = wrong ? [question.tokens.findIndex((_, i) => !question.targets.includes(i))] : question.targets;
      if (indices.some(index => index < 0)) throw new Error(`No wrong marker available for ${question.id}`);
      for (const index of indices) await widget.locator('.o-token-bank').getByRole('button').nth(index).click();
      break;
    }
    case 'order': {
      const indices = correctOrder(question);
      if (wrong && indices.length > 1) [indices[0], indices[1]] = [indices[1]!, indices[0]!];
      const bank = widget.getByLabel('Beschikbare bouwstenen');
      for (const index of indices) await bank.getByRole('button').nth(index).click();
      break;
    }
  }
  await widget.getByRole('button', { name: retry ? 'Controleer nieuwe poging' : 'Controleer antwoord' }).click();
  await expect(widget.getByRole('status')).toContainText(wrong ? 'Nog niet. Probeer de proef.' : retry ? 'Je nieuwe poging klopt.' : 'Je eerste antwoord klopt.');
}

async function completeLab(page: Page, lab: LessonLab) {
  await expect(page.getByRole('heading', { name: lab.prompt, exact: true })).toBeVisible();
  if (lab.kind === 'compare') {
    for (const variant of lab.variants) await page.getByRole('button', { name: variant.label, exact: true }).click();
    if (lab.variants.length === 1) await page.getByRole('button', { name: 'Experiment afronden' }).click();
  } else if (lab.kind === 'classify') {
    const items = page.locator('.o-classify-item');
    for (const [index, item] of lab.items.entries()) {
      await items.nth(index).getByRole('button', { name: lab.categories[item.category]!, exact: true }).click();
      if (index === 0) {
        await expect(page.getByRole('button', { name: 'Controleer de indeling' })).toBeDisabled();
        await page.reload();
        await expect(items.nth(index).getByRole('button', { name: lab.categories[item.category]!, exact: true })).toHaveAttribute('aria-pressed', 'true');
      }
    }
    await page.getByRole('button', { name: 'Controleer de indeling' }).click();
    await expect(page.getByRole('status')).toContainText('Je indeling klopt.');
    await page.reload();
    await expect(page.getByRole('status')).toContainText('Je indeling klopt.');
    for (const [index, item] of lab.items.entries()) {
      await expect(items.nth(index).getByRole('button', { name: lab.categories[item.category]!, exact: true })).toHaveAttribute('aria-pressed', 'true');
    }
  } else {
    await submitQuestion(page, lab);
  }
  await expect(page.getByRole('contentinfo').getByRole('button', { name: 'Verder', exact: true })).toBeEnabled();
}

test('home starts at zero, exposes all 68 real lessons, and has usable search and part filters', async ({ page }, testInfo) => {
  expect(ontleedLessons).toHaveLength(68);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Het woord begrijpen', exact: true })).toBeVisible();
  await expect(page.locator('.o-journey-step.is-complete')).toHaveCount(0);
  await expect(page.getByRole('link', { name: `Bekijk alle ${ontleedLessons.length} lessen`, exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Begin de les', exact: false })).toHaveAttribute('href', `/les/${firstLesson.id}`);
  await noOverflow(page);
  await mkdir(path.resolve('output/rebuild'), { recursive: true });
  await page.screenshot({ path: path.resolve(`output/rebuild/${testInfo.project.name}-home.png`), fullPage: true });

  await page.goto('/lessen');
  await expect(page.getByRole('status')).toHaveText(`${ontleedLessons.length} lessen gevonden`);
  await expect(page.locator('a.o-lesson-row')).toHaveCount(ontleedLessons.length);
  for (const lesson of ontleedLessons) await expect(page.locator(`a[href="/les/${lesson.id}"]`)).toHaveCount(1);

  const part = PARTS.find(item => item.id === 'zinsbouw')!;
  const partCount = ontleedLessons.filter(lesson => lesson.part === part.id).length;
  await page.getByRole('button', { name: `${part.number} · ${part.title}`, exact: true }).click();
  await expect(page.getByRole('status')).toHaveText(`${partCount} lessen gevonden`);
  await expect(page).toHaveURL(/deel=zinsbouw/);
  const query = 'persoonsvorm';
  const matches = ontleedLessons.filter(lesson => lesson.part === part.id && `${lesson.title} ${lesson.subtitle} ${lesson.goal} ${lesson.sections.map(section => section.title).join(' ')}`.toLocaleLowerCase('nl').includes(query));
  await page.getByRole('textbox', { name: 'Zoek lessen' }).fill(query);
  await expect(page.locator('a.o-lesson-row')).toHaveCount(matches.length);
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Zoek lessen' })).toHaveValue(query);
  await expect(page.locator('a.o-lesson-row')).toHaveCount(matches.length);
  await page.getByRole('combobox', { name: 'Toon', exact: true }).selectOption('afgerond');
  await expect(page.getByRole('status')).toHaveText('0 lessen gevonden');
  await expect(page.getByRole('heading', { name: 'Hier staat nog geen les.' })).toBeVisible();
  await page.getByRole('button', { name: 'Toon alle lessen' }).click();
  await expect(page.locator('a.o-lesson-row')).toHaveCount(68);
  await noOverflow(page);
});

test('a retired language route is replaced while the original a20 player remains accessible', async ({ page }) => {
  const retired = await page.goto('/les/l1');
  expect(retired?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Deze les heeft een nieuwe plek gekregen.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Bekijk de nieuwe lessen' })).toHaveAttribute('href', '/lessen');
  const argument = getLessonEntry('a20')!.lesson;
  const preserved = await page.goto('/les/a20');
  expect(preserved?.status()).toBe(200);
  await expect(page.getByText(argument.title, { exact: false }).first()).toBeVisible();
  await expect(page.getByRole('progressbar', { name: 'Voortgang in deze les', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Deze les heeft een nieuwe plek gekregen.' })).toHaveCount(0);
});

test('a complete first lesson and review keep first attempts, rubric gates and schedules across reloads', async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  const lesson = firstLesson;
  await page.goto(`/les/${lesson.id}`);
  await expect(page.getByRole('heading', { name: lesson.title, exact: true })).toBeVisible();
  await expect(page.getByRole('contentinfo').getByRole('button', { name: 'Verder', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Bronnen bij deze les' }).click();
  await expect(page.getByRole('heading', { name: 'Waar deze les op bouwt' })).toBeVisible();
  for (const source of lesson.sources) await expect(page.locator('.o-source-panel').getByText(BOOKS[source.bookId].title, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Bronnen bij deze les' }).click();
  await noOverflow(page);
  const optionBadge = page.locator('.o-option-letter').first();
  await expect(optionBadge).toBeVisible();
  expect((await optionBadge.boundingBox())!.width).toBeLessThanOrEqual(32);
  await mkdir(path.resolve('output/rebuild'), { recursive: true });
  await page.screenshot({ path: path.resolve(`output/rebuild/${testInfo.project.name}-lesson.png`), fullPage: true });

  await submitQuestion(page, { ...lesson.discovery, kind: 'choice', id: 'discovery', concept: lesson.title, hint: '', explanation: '' });
  await next(page);
  for (const [sectionIndex, section] of lesson.sections.entries()) {
    await expect(page.getByRole('heading', { name: section.title, exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'In gewone taal', exact: true })).toBeVisible();
    await completeTheory(page, lesson, sectionIndex);
    await page.locator('summary').filter({ hasText: 'Meer uitleg' }).click();
    for (const paragraph of section.paragraphs) await expect(page.getByText(paragraph, { exact: true })).toBeVisible();
    await expect(page.getByText(section.pitfall, { exact: true })).toBeVisible();
    await noOverflow(page);
    await next(page);
  }
  await completeLab(page, lesson.lab);
  await next(page);
  const wrongQuestion = lesson.practice[0]!;
  for (const [index, question] of lesson.practice.entries()) {
    await expect(page.getByText(`Oefening ${index + 1} van ${lesson.practice.length} · zonder uitgewerkt voorbeeld`, { exact: true })).toBeVisible();
    await submitQuestion(page, question, index === 0);
    if (index === 0) {
      const saved = (await stored(page)).sessions[lesson.id]!.answers[question.id]!;
      expect(saved.correct).toBe(false);
      await page.reload();
      await expect(page.getByRole('status')).toContainText('Nog niet. Probeer de proef.');
      expect((await stored(page)).sessions[lesson.id]!.answers[question.id]).toEqual(saved);
      await expect(page.getByRole('button', { name: 'Controleer antwoord' })).toHaveCount(0);
      if (question.kind === 'choice') for (const radio of await page.getByRole('radio').all()) await expect(radio).toBeDisabled();
      await expect(page.getByRole('contentinfo').getByRole('button', { name: 'Verder', exact: true })).toBeDisabled();
      await page.getByRole('button', { name: 'Probeer opnieuw', exact: true }).click();
      await submitQuestion(page, question, false, true);
      expect((await stored(page)).sessions[lesson.id]!.answers[question.id]).toEqual(saved);
    }
    await next(page);
  }
  await expect(page.getByRole('heading', { name: 'Haal je eerdere twijfel terug.' })).toBeVisible();
  await submitQuestion(page, wrongQuestion);
  await page.getByRole('button', { name: 'Verder met toepassing', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Maak het van jezelf.' })).toBeVisible();
  const forward = page.getByRole('contentinfo').getByRole('button', { name: 'Verder', exact: true });
  const draft = page.getByRole('textbox', { name: 'Jouw zin en uitleg' });
  await draft.fill('Een korte zin.');
  for (const criterion of lesson.transfer.checklist) await page.getByRole('checkbox', { name: criterion, exact: true }).check();
  await expect(forward).toBeDisabled();
  await draft.fill(lesson.transfer.model);
  await page.getByRole('checkbox', { name: lesson.transfer.checklist[0]!, exact: true }).uncheck();
  await expect(forward).toBeDisabled();
  await page.reload();
  await expect(draft).toHaveValue(lesson.transfer.model);
  await expect(page.getByRole('checkbox', { name: lesson.transfer.checklist[0]!, exact: true })).not.toBeChecked();
  await page.getByRole('checkbox', { name: lesson.transfer.checklist[0]!, exact: true }).check();
  await expect(forward).toBeEnabled();
  await page.getByRole('button', { name: 'Vergelijk na je eigen poging met een mogelijke uitwerking', exact: false }).click();
  await expect(page.getByText('Eén mogelijke uitwerking', { exact: true })).toBeVisible();
  await next(page);
  await expect(page.getByRole('heading', { name: 'Wat je nu kunt uitleggen.' })).toBeVisible();
  await page.getByRole('button', { name: 'Les afronden' }).click();
  await expect(page.getByRole('heading', { name: /^Je hebt .* onderzocht\.$/ })).toBeVisible();
  const completion = (await stored(page)).completed[lesson.id]!;
  expect(completion.accuracy).toBe(Math.round(100 * (lesson.practice.length - 1) / lesson.practice.length));
  expect(completion.count).toBe(1);
  await page.reload();
  expect((await stored(page)).completed[lesson.id]).toEqual(completion);
  expect((await stored(page)).sessions[lesson.id]!.answers[wrongQuestion.id]!.correct).toBe(false);
  await noOverflow(page);

  const beforeReading = await stored(page);
  await page.getByRole('button', { name: 'Lees uitleg opnieuw', exact: true }).click();
  for (const section of lesson.sections) await expect(page.getByRole('heading', { name: section.title, exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Wat je kunt uitleggen', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Controleer antwoord' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Les afronden' })).toHaveCount(0);
  expect((await stored(page)).sessions[lesson.id]).toEqual(beforeReading.sessions[lesson.id]);
  expect((await stored(page)).completed[lesson.id]).toEqual(beforeReading.completed[lesson.id]);
  expect((await stored(page)).retrieval[lesson.id]).toEqual(beforeReading.retrieval[lesson.id]);
  await page.getByRole('button', { name: 'Terug naar de les', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: /^Je hebt .* onderzocht\.$/ })).toBeVisible();
  await page.goto(`/les/${lesson.id}?lezen=1`);
  await page.reload();
  for (const section of lesson.sections) await expect(page.getByRole('heading', { name: section.title, exact: true })).toBeVisible();
  expect((await stored(page)).sessions[lesson.id]).toEqual(beforeReading.sessions[lesson.id]);
  expect((await stored(page)).completed[lesson.id]).toEqual(completion);
  await noOverflow(page);

  await page.goto('/herhalen');
  await expect(page.getByRole('button', { name: 'Start een foutenronde', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Uitleg bekijken', exact: false }).click();
  await expect(page).toHaveURL(new RegExp(`/les/${lesson.id}\\?lezen=1$`));
  for (const section of lesson.sections) await expect(page.getByRole('heading', { name: section.title, exact: true })).toBeVisible();
  await page.goto('/herhalen');
  await expect(page.getByRole('button', { name: 'Start de ronde', exact: false })).toBeDisabled();
  await page.getByRole('button', { name: 'Nu alvast oefenen' }).click();
  const roundBefore = (await stored(page)).reviewRound!;
  expect(roundBefore.items).toHaveLength(1);
  const retrieval = lesson.retrieval.find(question => question.id === roundBefore.items[0]!.questionId)!;
  await page.reload();
  await expect(page.getByRole('heading', { name: retrieval.prompt, exact: true })).toBeVisible();
  expect((await stored(page)).reviewRound).toEqual(roundBefore);
  await submitQuestion(page, retrieval);
  const schedule = (await stored(page)).retrieval[lesson.id]!;
  expect(schedule.attempts).toBe(1);
  expect(schedule.correct).toBe(1);
  expect(schedule.interval).toBe(1);
  expect(schedule.due).toBe(schedule.last + 3 * 86_400_000);
  await page.reload();
  await expect(page.getByRole('status')).toContainText('Je eerste antwoord klopt.');
  expect((await stored(page)).retrieval[lesson.id]).toEqual(schedule);
  await expect(page.getByRole('button', { name: 'Controleer antwoord' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Volgende', exact: false }).click();
  await expect(page.getByRole('heading', { name: 'Je hebt opnieuw opgehaald.' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Je hebt opnieuw opgehaald.' })).toBeVisible();
  expect((await stored(page)).retrieval[lesson.id]).toEqual(schedule);
  await noOverflow(page);

  await page.getByRole('button', { name: 'Terug naar herhalen', exact: true }).click();
  await page.getByRole('button', { name: 'Start een foutenronde', exact: true }).click();
  await expect(page.getByRole('heading', { name: wrongQuestion.prompt, exact: true })).toBeVisible();
  await page.reload();
  await submitQuestion(page, wrongQuestion);
  const mistake = (await stored(page)).mistakes[`${lesson.id}:${wrongQuestion.id}`]!;
  expect(mistake).toMatchObject({ attempts: 1, correct: 1, resolved: false });
  await page.reload();
  await expect(page.getByRole('status')).toContainText('Je eerste antwoord klopt.');
  expect((await stored(page)).mistakes[`${lesson.id}:${wrongQuestion.id}`]).toEqual(mistake);
  expect((await stored(page)).sessions[lesson.id]!.answers[wrongQuestion.id]!.correct).toBe(false);
  await page.getByRole('button', { name: 'Volgende', exact: false }).click();
  await expect(page.getByRole('heading', { name: 'Je hebt opnieuw opgehaald.' })).toBeVisible();
});

test('sources identify the five books, acknowledge OCR limitations and expose the design references', async ({ page }) => {
  await page.goto('/bronnen');
  await expect(page.getByRole('heading', { name: 'De boeken achter de lessen.' })).toBeVisible();
  for (const book of Object.values(BOOKS)) await expect(page.getByRole('heading', { name: book.title, exact: true })).toBeVisible();
  await expect(page.getByText(/Niet elke figuur of klein OCR-teken is afzonderlijk geverifieerd/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'bewerkbare ontwerp in Figma', exact: true })).toHaveAttribute('href', /figma\.com\/design\/.*node-id=11-81/);
  await expect(page.getByRole('link', { name: 'Brilliant-lesschermen', exact: true })).toHaveAttribute('href', /mobbin\.com\/flows\//);
  await expect(page.getByRole('link', { name: 'Duolingo’s leerpad in Mobbin', exact: true })).toHaveAttribute('href', /mobbin\.com\/flows\//);
  await expect(page.getByRole('link', { name: 'Uber Base', exact: true })).toHaveAttribute('href', 'https://base.uber.com/');
  await noOverflow(page);
});

test('a compare experiment preserves the selected variant and visited-variant gate after reload', async ({ page }) => {
  const lesson = ontleedLessons.find(item => item.lab.kind === 'compare' && item.lab.variants.length >= 3)!;
  const lab = lesson.lab;
  if (lab.kind !== 'compare') throw new Error('Expected the real three-variant compare lesson.');
  await page.goto(`/les/${lesson.id}`);
  await submitQuestion(page, { ...lesson.discovery, kind: 'choice', id: 'discovery', concept: lesson.title, hint: '', explanation: '' });
  await next(page);
  for (const [sectionIndex, section] of lesson.sections.entries()) {
    await expect(page.getByRole('heading', { name: section.title, exact: true })).toBeVisible();
    await completeTheory(page, lesson, sectionIndex);
    await next(page);
  }
  await expect(page.getByRole('heading', { name: lab.prompt, exact: true })).toBeVisible();
  await page.getByRole('button', { name: lab.variants[1]!.label, exact: true }).click();
  await expect(page.getByRole('contentinfo').getByRole('button', { name: 'Verder', exact: true })).toBeDisabled();
  await page.reload();
  await expect(page.getByRole('button', { name: lab.variants[1]!.label, exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('contentinfo').getByRole('button', { name: 'Verder', exact: true })).toBeDisabled();
  for (const variant of lab.variants.slice(2)) await page.getByRole('button', { name: variant.label, exact: true }).click();
  await expect(page.getByRole('contentinfo').getByRole('button', { name: 'Verder', exact: true })).toBeEnabled();
  await page.reload();
  await expect(page.getByRole('button', { name: lab.variants.at(-1)!.label, exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('contentinfo').getByRole('button', { name: 'Verder', exact: true })).toBeEnabled();
  await noOverflow(page);
});

test('protected review screens exclude historical-only retired language progress', async ({ page }) => {
  const retired = getLessonEntry('l1')!.lesson;
  const historicalStep = planFor(retired.id)!.find(item => isScored(item.step))!;
  await page.addInitScript(({ lessonId, key }) => {
    const earlier = new Date(Date.now() - 3 * 86_400_000).toISOString();
    localStorage.setItem('pennig:voortgang', JSON.stringify({
      state: {
        lessons: { [lessonId]: { attempts: 1, bestAccuracy: 80, lastAccuracy: 80, firstCompletedAt: earlier, lastCompletedAt: earlier } },
        review: { [key]: { key, lessonId, addedAt: earlier, lastMissedAt: earlier, misses: 1 } },
        activity: {}, history: [],
      },
      version: 1,
    }));
  }, { lessonId: retired.id, key: historicalStep.key });
  await page.goto('/herhalen/argumentatie');
  await expect(page.getByRole('heading', { name: 'Argumentatie herhalen', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Geen foutgerichte oefenpunten', exact: true })).toBeVisible();
  await expect(page.getByText(retired.title, { exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Start mijn kennischeck', exact: true })).toHaveCount(0);
  await page.goto('/herhalen/kennis');
  await expect(page.getByRole('heading', { name: 'Je hoeft nu niets op te halen', exact: true })).toBeVisible();
  await expect(page.getByText(retired.title, { exact: true })).toHaveCount(0);
  await expect(page.getByRole('radiogroup')).toHaveCount(0);
  await page.goto('/herhalen/sessie');
  await expect(page.getByRole('heading', { name: 'Niets om te herhalen', exact: true })).toBeVisible();
  await expect(page.getByText(retired.title, { exact: true })).toHaveCount(0);
  await noOverflow(page);
});
