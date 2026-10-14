import type { Page } from '@playwright/test';
import { argumentLessons } from '../src/content/argumentation/curriculum';
import { foundationForLesson } from '../src/content/argumentation/foundations';
import { lessonCoreChecks } from '../src/content/argumentation/core-checks';
import { lessonScaffolds } from '../src/content/argumentation/scaffolds';
import { sentenceTeachingById } from '../src/content/sentences/teaching';
import { shuffle } from '../src/engine/hash';
import { expect, seedOnboarded, test } from './fixtures';

type SpeechProbe = {
  runs: { text: string; rate: number; voice: string | null }[];
  cancelled: number;
  pauses: number;
  resumes: number;
  finish: () => void;
  boundary: (charIndex: number, charLength: number, name?: string) => void;
};

/** A silent, controllable native API: verifies integration, never claims audible voice quality. */
async function installSpeechProbe(page: Page) {
  await page.addInitScript(() => {
    class TestUtterance {
      text: string;
      lang = '';
      rate = 1;
      voice: { voiceURI: string } | null = null;
      onstart: (() => void) | null = null;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      onboundary: ((event: { charIndex: number; charLength: number; name: string }) => void) | null = null;
      constructor(text: string) { this.text = text; }
    }
    const voices = [
      { voiceURI: 'fenna', name: 'Microsoft Fenna Online (Natural)', lang: 'nl-NL', localService: false, default: false },
      { voiceURI: 'xander', name: 'Xander', lang: 'nl-NL', localService: true, default: true },
      { voiceURI: 'english', name: 'English', lang: 'en-US', localService: true, default: false },
    ];
    let current: TestUtterance | null = null;
    let paused = false;
    const probe: SpeechProbe = {
      runs: [], cancelled: 0, pauses: 0, resumes: 0,
      finish: () => current?.onend?.(),
      boundary: (charIndex, charLength, name = 'word') => current?.onboundary?.({ charIndex, charLength, name }),
    };
    Object.defineProperty(window, '__readerSpeechProbe', { value: probe });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: TestUtterance, configurable: true });
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      getVoices: () => voices,
      get paused() { return paused; },
      addEventListener: () => undefined,
      cancel: () => { probe.cancelled++; current = null; paused = false; },
      pause: () => { probe.pauses++; paused = true; },
      resume: () => { probe.resumes++; paused = false; },
      speak: (utterance: TestUtterance) => {
        current = utterance;
        probe.runs.push({ text: utterance.text, rate: utterance.rate, voice: utterance.voice?.voiceURI ?? null });
        utterance.onstart?.();
      },
    } });
  });
}

const audio = (page: Page) => page.getByRole('region', { name: 'Voorlezen', exact: true });
const readText = (page: Page) => audio(page).getByLabel('Tekst om mee te lezen', { exact: true });
const probe = (page: Page) => page.evaluate(() => {
  const value = (window as unknown as { __readerSpeechProbe: SpeechProbe }).__readerSpeechProbe;
  return { runs: value.runs, cancelled: value.cancelled, pauses: value.pauses, resumes: value.resumes };
});

async function openReadMode(page: Page) {
  const reader = audio(page);
  await expect(reader).toHaveCount(1);
  const summary = reader.getByText('Leesmodus · grotere tekst en meelezen', { exact: true });
  if (await summary.locator('..').getAttribute('open') === null) await summary.click();
  await expect(readText(page)).toBeVisible();
}

/** Chunk paragraphs have DOM boundaries rather than textContent spaces between sentences. */
async function expectReadText(page: Page, text: string, present = true) {
  const clean = (value: string) => value.replace(/\s+/gu, ' ').trim();
  const contains = async () => clean((await readText(page).locator('p').allTextContents()).join(' ')).includes(clean(text));
  await expect.poll(contains).toBe(present);
}

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name === 'mobiel') await page.setViewportSize({ width: 375, height: 812 });
  else await page.setViewportSize({ width: 1280, height: 1000 });
  await seedOnboarded(page);
  await installSpeechProbe(page);
});

test('leesmodus volgt native woordposities en bewaart Nederlandse stem en tweemaal tempo', async ({ page }) => {
  await page.goto('/les/l1');
  await openReadMode(page);
  await expectReadText(page, 'Het Nederlandse alfabet heeft 26 letters.');
  expect((await probe(page)).runs).toHaveLength(0);
  await audio(page).getByText('Stem en tempo · 1,0×', { exact: true }).click();
  const voice = audio(page).getByRole('combobox', { name: 'Nederlandse stem', exact: true });
  const rate = audio(page).getByRole('slider', { name: 'Spreektempo', exact: true });
  await expect(voice.getByRole('option', { name: /English/ })).toHaveCount(0);
  await expect(rate).toHaveAttribute('max', '2');
  await audio(page).getByRole('button', { name: '2,0×', exact: true }).click();
  await audio(page).getByRole('button', { name: 'Luisteren', exact: true }).click();
  await expect.poll(async () => (await probe(page)).runs.at(-1)?.rate).toBe(2);
  expect((await probe(page)).runs.at(-1)?.voice).toBe('fenna');
  await expect(readText(page).locator('[aria-current="true"]')).toHaveCount(1);
  await expect(readText(page).locator('mark')).toHaveCount(0);
  await expect(audio(page).getByText(/Het huidige fragment is gemarkeerd/)).toBeVisible();

  const first = (await probe(page)).runs.at(-1)!.text;
  const match = [...first.matchAll(/[\p{L}\p{N}]+/gu)][1] ?? first.match(/[\p{L}\p{N}]+/u)!;
  const charIndex = match.index!;
  const word = match[0];
  const cancellations = (await probe(page)).cancelled;
  await page.evaluate(({ charIndex, length }) => (window as unknown as { __readerSpeechProbe: SpeechProbe }).__readerSpeechProbe.boundary(charIndex, length), { charIndex, length: word.length });
  await expect(readText(page).locator('mark')).toHaveText(word);
  expect((await probe(page)).cancelled).toBe(cancellations);
  expect((await probe(page)).runs).toHaveLength(1);
  await audio(page).getByRole('button', { name: 'Pauzeren', exact: true }).click();
  await expect(audio(page).getByRole('button', { name: 'Hervatten', exact: true })).toBeVisible();
  await audio(page).getByRole('button', { name: '1,25×', exact: true }).click();
  await expect.poll(async () => (await probe(page)).runs.at(-1)?.rate).toBe(1.25);
  await expect(audio(page).getByRole('button', { name: 'Hervatten', exact: true })).toBeVisible();
  expect((await probe(page)).runs.at(-1)!.text).toBe(first);
  await voice.selectOption('xander');
  await expect.poll(async () => (await probe(page)).runs.at(-1)?.voice).toBe('xander');
  await expect(audio(page).getByRole('button', { name: 'Hervatten', exact: true })).toBeVisible();
  await audio(page).getByRole('button', { name: 'Hervatten', exact: true }).click();
  await audio(page).getByRole('button', { name: 'Proefluisteren', exact: true }).click();
  expect((await probe(page)).runs.at(-1)!).toMatchObject({ rate: 1.25, voice: 'xander' });
  expect((await probe(page)).runs.at(-1)!.text).toBe('Zo klinkt deze Nederlandse stem.');
  await expect(readText(page).locator('mark')).toHaveCount(0);
  await audio(page).getByRole('button', { name: 'Stoppen', exact: true }).click();
  await audio(page).getByRole('button', { name: '2,0×', exact: true }).click();
  await page.reload();
  await openReadMode(page);
  await audio(page).getByText('Stem en tempo · 2,0×', { exact: true }).click();
  await expect(rate).toHaveValue('2');
  await expect(voice).toHaveValue('xander');
  expect((await probe(page)).runs).toHaveLength(0);
  await expect(audio(page).getByRole('button', { name: 'Vorig fragment', exact: true })).toBeDisabled();
  await audio(page).getByRole('button', { name: 'Volgend fragment', exact: true }).click();
  await expect(audio(page).getByRole('button', { name: 'Vorig fragment', exact: true })).toBeEnabled();
  expect((await probe(page)).runs).toHaveLength(0);
  await audio(page).getByRole('button', { name: 'Luisteren', exact: true }).click();
  await expect(readText(page).locator('[aria-current="true"]')).toHaveCount(1);
  await expect(readText(page).locator('mark')).toHaveCount(0);
  // Find a genuine repeated word in this lesson, then report its second native position.
  const candidate = (await readText(page).locator('p').allTextContents()).flatMap((text, index) => {
    const seen = new Set<string>();
    for (const word of text.matchAll(/[\p{L}\p{N}]+/gu)) {
      const key = word[0].toLowerCase();
      if (seen.has(key)) return [{ text, index, word: word[0], start: word.index! }];
      seen.add(key);
    }
    return [];
  }).find((item) => item.index > 1);
  expect(candidate).toBeDefined();
  for (let index = 1; index < candidate!.index; index++) await audio(page).getByRole('button', { name: 'Volgend fragment', exact: true }).click();
  await expect.poll(async () => (await probe(page)).runs.at(-1)!.text).toBe(candidate!.text);
  const beforeBoundary = (await probe(page)).cancelled;
  await page.evaluate(({ start, length }) => (window as unknown as { __readerSpeechProbe: SpeechProbe }).__readerSpeechProbe.boundary(start, length), { start: candidate!.start, length: candidate!.word.length });
  await expect(readText(page).locator('mark')).toHaveText(candidate!.word);
  expect(await readText(page).locator('mark').evaluate((mark) => mark.previousSibling?.textContent)).toBe(candidate!.text.slice(0, candidate!.start));
  expect((await probe(page)).cancelled).toBe(beforeBoundary);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.screenshot({ path: test.info().outputPath('leesmodus-woordmarkering.png') });
});

test('catalogus leest feedback uit de voettekst en de geopende lesaanpak', async ({ page }) => {
  await page.goto('/les/l4');
  await page.getByRole('radio', { name: 'rustig', exact: true }).check();
  await page.getByRole('contentinfo').getByRole('button', { name: 'Ik snap het', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Welke past in een mail aan een klant?', exact: true })).toBeVisible();
  await openReadMode(page);
  await expectReadText(page, 'Rustig en zakelijk.', false);
  await page.getByRole('radio', { name: /Bedankt voor uw bericht\.$/ }).check();
  await page.getByRole('contentinfo').getByRole('button', { name: 'Controleer', exact: true }).click();
  await expectReadText(page, 'Rustig en zakelijk.');
  await audio(page).getByRole('button', { name: 'Luisteren', exact: true }).click();
  const beforeDialog = (await probe(page)).cancelled;
  await page.getByRole('button', { name: 'Aanpak voor deze les', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Aanpak voor deze les', exact: true });
  await expect(dialog).toBeVisible();
  const dialogReader = dialog.getByRole('region', { name: 'Voorlezen', exact: true });
  await expect(dialogReader).toHaveCount(1);
  await dialogReader.getByText('Leesmodus · grotere tekst en meelezen', { exact: true }).click();
  await expect(dialogReader.getByLabel('Tekst om mee te lezen', { exact: true })).toContainText('Stap voor stap');
  await dialogReader.getByRole('button', { name: 'Luisteren', exact: true }).click();
  expect((await probe(page)).cancelled).toBeGreaterThan(beforeDialog);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(audio(page)).toHaveCount(1);
  await expect(audio(page).getByRole('button', { name: 'Luisteren', exact: true })).toBeVisible();
});

test('zinsuitleg leest geopende video en onthult vraagfeedback en schrijfmodel pas op verzoek', async ({ page }) => {
  const teaching = sentenceTeachingById.get('zinnen-01')!;
  await page.goto('/zinnen/les/zinnen-01');
  await page.getByRole('tab', { name: 'Uitleg', exact: true }).click();
  await openReadMode(page);
  await expectReadText(page, teaching.introduction[0]!);
  await expectReadText(page, teaching.concepts[0]!.meaning, false);
  const concepts = page.getByRole('region', { name: 'Woorden die je in deze les tegenkomt', exact: true });
  await concepts.locator('summary').filter({ hasText: /^Woordgroep$/ }).click();
  await expectReadText(page, teaching.concepts[0]!.meaning);
  await page.getByRole('tab', { name: 'Samen bekijken', exact: true }).click();
  await expectReadText(page, teaching.walkthrough.steps[0]!.explanation);
  await expectReadText(page, teaching.walkthrough.steps[3]!.explanation, false);
  await page.locator('summary').filter({ hasText: /^Bekijk dit voorbeeld als uitlegvideo$/ }).click();
  await expectReadText(page, teaching.walkthrough.steps[3]!.explanation, false);
  await page.locator('summary').filter({ hasText: /^Lees de volledige videotekst$/ }).click();
  await expectReadText(page, teaching.walkthrough.steps[3]!.explanation);

  await page.getByRole('tab', { name: 'Zelf proberen', exact: true }).click();
  await expectReadText(page, teaching.quickCheck.options[0]!.feedback, false);
  await expectReadText(page, teaching.application.model, false);
  const wrong = teaching.quickCheck.options.find((option) => option.id !== teaching.quickCheck.answer)!;
  await page.getByRole('radio', { name: wrong.text, exact: true }).check();
  await expectReadText(page, wrong.feedback, false);
  await page.getByRole('button', { name: 'Bekijk de uitleg bij mijn antwoord', exact: true }).click();
  await expectReadText(page, wrong.feedback);
  await expectReadText(page, teaching.quickCheck.options.find((option) => option.id === teaching.quickCheck.answer)!.feedback, false);
  await page.getByRole('textbox', { name: 'Schrijf je eigen zin en verklaring', exact: true }).fill('Morgen controleert mijn collega de aanvraag.');
  await expectReadText(page, teaching.application.model, false);
  await page.getByRole('button', { name: 'Vergelijk met een voorbeeld', exact: true }).click();
  await expectReadText(page, teaching.application.model);
  await expectReadText(page, teaching.application.reasoning);
  await expect(audio(page)).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test('argumentatie heeft één lezer voor theorie, nieuwe opdrachten, feedback en afronding', async ({ page }) => {
  test.setTimeout(90_000);
  const lesson = argumentLessons[0]!;
  await page.goto(`/argumentatie/les/${lesson.id}`);
  await openReadMode(page);
  await expectReadText(page, foundationForLesson(lesson.id)[0]!.body.split('\n\n')[0]!);
  await expectReadText(page, lesson.exercises[0]!.explanation, false);
  await expect(audio(page)).toHaveCount(1);

  for (const concept of foundationForLesson(lesson.id)) {
    const practice = page.getByRole('region', { name: `Oefen het begrip ${concept.term}`, exact: true });
    await practice.getByRole('radio', { name: concept.options.find((option) => option.id === concept.answer)!.text, exact: true }).check();
    await page.getByRole('button', { name: 'Volgende pagina', exact: true }).click();
  }
  const starter = lessonScaffolds[lesson.id];
  if (starter) await page.getByRole('region', { name: 'Begin met één kleine stap', exact: true }).getByRole('radio', { name: starter.options.find((option) => option.id === starter.answer)!.text, exact: true }).check();
  for (let index = 0; index < 20; index++) {
    const practice = page.getByRole('button', { name: 'Naar de opdrachten', exact: true });
    if (await practice.isVisible()) { await practice.click(); break; }
    const compare = page.getByRole('button', { name: 'Vergelijk mijn redenering', exact: true });
    if (await compare.isVisible()) {
      await page.getByRole('textbox', { name: 'Jouw eerste analyse', exact: true }).fill('Ik onderzoek de reden, het standpunt en de verbinding tussen beide onderdelen voordat ik de voorgestelde keuze beoordeel.');
      await compare.click();
    }
    const core = page.getByRole('region', { name: 'Probeer deze denkstap', exact: true });
    if (await core.isVisible()) {
      const check = lessonCoreChecks[lesson.id]!;
      await core.getByRole('radio', { name: check.options.find((option) => option.id === check.answer)!.text, exact: true }).check();
    }
    await page.getByRole('button', { name: 'Volgende pagina', exact: true }).click();
  }

  for (const [index, exercise] of lesson.exercises.entries()) {
    await expect(page.getByRole('heading', { name: exercise.prompt, exact: true })).toBeVisible();
    await openReadMode(page);
    await expectReadText(page, exercise.prompt);
    await expectReadText(page, exercise.explanation, false);
    const check = page.getByRole('button', { name: exercise.kind === 'reflection' ? 'Vergelijk met het model' : 'Controleer je analyse', exact: true });
    if (exercise.kind === 'choice') {
      await page.getByRole('radio', { name: exercise.options.find((option) => option.id === exercise.answer)!.text, exact: false }).check();
    } else if (exercise.kind === 'reflection') {
      await expectReadText(page, exercise.model, false);
      await page.getByRole('textbox', { name: 'Jouw analyse', exact: true }).fill(exercise.model);
    } else {
      for (const [displayIndex, card] of shuffle(exercise.id, exercise.cards).entries()) {
        await page.getByRole('combobox').nth(displayIndex).selectOption(card.category);
      }
    }
    if (exercise.kind !== 'reflection') await page.getByRole('radio', { name: 'Redelijk zeker', exact: true }).check();
    await check.click();
    if (exercise.kind === 'reflection') {
      await expectReadText(page, exercise.model);
      for (const criterion of exercise.rubric) await page.getByRole('checkbox', { name: criterion, exact: true }).check();
    } else await expectReadText(page, exercise.explanation);
    if (index === 0) {
      const beforeSpeech = (await probe(page)).runs.length;
      const fragments = await readText(page).locator('p').count();
      await audio(page).getByRole('button', { name: 'Luisteren', exact: true }).click();
      await page.evaluate((amount) => {
        const value = (window as unknown as { __readerSpeechProbe: SpeechProbe }).__readerSpeechProbe;
        for (let index = 0; index < amount; index++) value.finish();
      }, fragments);
      const spoken = (await probe(page)).runs.slice(beforeSpeech).map((run) => run.text).join(' ');
      expect(spoken).toContain(exercise.prompt);
      expect(spoken).toContain(exercise.explanation);
      await expect(audio(page).getByRole('button', { name: 'Luisteren', exact: true })).toBeVisible();
    }
    await expect(audio(page)).toHaveCount(1);
    await page.getByRole('button', { name: index === lesson.exercises.length - 1 ? 'Les afronden' : 'Volgende opdracht', exact: true }).click();
  }
  await expect(page.getByRole('heading', { name: 'Je hebt de les doorgewerkt.', exact: true })).toBeVisible();
  await openReadMode(page);
  await expectReadText(page, 'Je hebt de les doorgewerkt.');
  await expect(audio(page)).toHaveCount(1);
});
