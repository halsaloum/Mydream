import { argumentLessons } from '../src/content/argumentation/curriculum';
import { foundationForLesson } from '../src/content/argumentation/foundations';
import { test, expect, seedOnboarded } from './fixtures';

type SpeechProbe = {
  runs: { text: string; rate: number; voice: string | null }[];
  cancelled: number;
  paused: number;
  resumed: number;
  finish: () => void;
};

test('voorlezen blijft op de huidige kern en bewaart stem en instelbaar tempo', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'mobiel') await page.setViewportSize({ width: 375, height: 812 });
  else await page.setViewportSize({ width: 1280, height: 1500 });
  await seedOnboarded(page);
  // Een stille spraakmotor controleert de browserintegratie zonder audio af te spelen.
  await page.addInitScript(() => {
    class TestUtterance {
      text: string;
      lang = '';
      rate = 1;
      voice: { voiceURI: string } | null = null;
      onstart: (() => void) | null = null;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(text: string) { this.text = text; }
    }
    const voices = [
      { voiceURI: 'xander', name: 'Xander', lang: 'nl-NL', localService: true, default: true },
      { voiceURI: 'ellen', name: 'Ellen', lang: 'nl-BE', localService: true, default: false },
      { voiceURI: 'english', name: 'English', lang: 'en-US', localService: true, default: false },
    ];
    let current: TestUtterance | null = null;
    let paused = false;
    const probe: SpeechProbe = { runs: [], cancelled: 0, paused: 0, resumed: 0, finish: () => current?.onend?.() };
    Object.defineProperty(window, '__speechProbe', { value: probe });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: TestUtterance, configurable: true });
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      getVoices: () => voices,
      get paused() { return paused; },
      addEventListener: () => undefined,
      cancel: () => { probe.cancelled++; current = null; paused = false; },
      pause: () => { probe.paused++; paused = true; },
      resume: () => { probe.resumed++; paused = false; },
      speak: (utterance: TestUtterance) => {
        current = utterance;
        probe.runs.push({ text: utterance.text, rate: utterance.rate, voice: utterance.voice?.voiceURI ?? null });
        utterance.onstart?.();
      },
    } });
  });
  const lesson = argumentLessons[0]!;
  const concepts = foundationForLesson(lesson.id);
  const concept = concepts[0]!;
  await page.goto(`/argumentatie/les/${lesson.id}`);
  const audio = page.getByRole('region', { name: 'Voorlezen', exact: true });
  await audio.locator('summary').click();
  const rate = audio.getByRole('slider', { name: 'Spreektempo', exact: true });
  const voice = audio.getByRole('combobox', { name: 'Nederlandse stem', exact: true });
  await expect(rate).toHaveValue('1');
  await expect(voice.getByRole('option', { name: /English/ })).toHaveCount(0);
  const probe = () => page.evaluate(() => {
    const value = (window as unknown as { __speechProbe: SpeechProbe }).__speechProbe;
    return { runs: value.runs, cancelled: value.cancelled, paused: value.paused, resumed: value.resumed };
  });
  expect((await probe()).runs).toHaveLength(0);
  await audio.getByRole('button', { name: 'Voorlezen', exact: true }).click();
  await expect(audio.getByRole('button', { name: 'Pauzeren', exact: true })).toBeVisible();
  expect((await probe()).runs[0]).toMatchObject({ rate: 1, voice: 'xander' });
  await audio.getByRole('button', { name: 'Pauzeren', exact: true }).click();
  await expect(audio.getByRole('button', { name: 'Hervatten', exact: true })).toBeVisible();
  expect((await probe()).paused).toBe(1);
  await audio.getByRole('button', { name: 'Hervatten', exact: true }).click();
  expect((await probe()).resumed).toBe(1);

  // Na het eerste fragment blijft wijzigen bij het actuele fragment, niet bij het begin.
  await page.evaluate(() => (window as unknown as { __speechProbe: SpeechProbe }).__speechProbe.finish());
  await expect.poll(async () => (await probe()).runs.length).toBe(2);
  const currentText = (await probe()).runs.at(-1)!.text;
  await rate.press('Home');
  for (let step = 0; step < 13; step++) await rate.press('ArrowRight');
  await expect.poll(async () => (await probe()).runs.at(-1)?.rate).toBe(1.25);
  expect((await probe()).runs.at(-1)!.text).toBe(currentText);
  await voice.selectOption('ellen');
  await expect.poll(async () => (await probe()).runs.at(-1)?.voice).toBe('ellen');
  expect((await probe()).runs.at(-1)!.text).toBe(currentText);
  const spoken = (await probe()).runs.map((run) => run.text).join(' ');
  expect(spoken).not.toContain(concepts[1]!.body);
  expect(spoken).not.toContain(lesson.deepDive.body);

  await audio.getByRole('button', { name: 'Stoppen', exact: true }).click();
  await expect(audio.getByRole('button', { name: 'Voorlezen', exact: true })).toBeVisible();
  await page.reload();
  await audio.locator('summary').click();
  await expect(rate).toHaveValue('1.25');
  await expect(voice).toHaveValue('ellen');
  expect((await probe()).runs).toHaveLength(0);
  await page.screenshot({ path: test.info().outputPath('argumentatie-voorlezen.png') });
  const question = page.getByRole('region', { name: `Oefen het begrip ${concept.term}`, exact: true });
  await question.getByRole('radio', { name: concept.options.find((option) => option.id === concept.answer)!.text, exact: true }).check();
  await audio.getByRole('button', { name: 'Voorlezen', exact: true }).click();
  const cancellations = (await probe()).cancelled;
  await page.getByRole('button', { name: 'Volgende pagina', exact: true }).click();
  await expect(page.getByRole('heading', { name: concepts[1]!.title, exact: true, level: 2 })).toBeVisible();
  await expect(audio.getByRole('button', { name: 'Voorlezen', exact: true })).toBeVisible();
  expect((await probe()).cancelled).toBeGreaterThan(cancellations);
  expect((await probe()).runs).toHaveLength(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});
