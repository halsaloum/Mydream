import { sentenceLessons } from '../src/content/sentences';
import { sentenceTeaching } from '../src/content/sentences/teaching';
import { test, expect, seedOnboarded } from './fixtures';

test.beforeEach(async ({ page }) => { await seedOnboarded(page); });

test('niveau 6 bevat de hele zinsleerroute zonder apart hoofdmenu-item', async ({ page }) => {
  await page.goto('/?niveau=zinnen#niveaus-titel');
  await expect(page.getByRole('tab', { name: /^Niveau 6: Zinnen/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('nav a[href="/zinnen"]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /^Open de module\s*:/ })).toHaveCount(12);
  for (const lesson of sentenceLessons) await expect(page.getByRole('heading', { name: lesson.title, exact: true })).toBeVisible();
  await expect(page.getByText(/Codex|Bouw-arena|Röntgen-debugger/)).toHaveCount(0);
  await page.getByRole('link', { name: `Open de module : ${sentenceLessons[0]!.title}`, exact: true }).click();
  await expect(page.getByRole('heading', { name: sentenceLessons[0]!.title, exact: true })).toBeVisible();
  await page.locator('header').getByRole('link', { name: 'Bewaren en terug naar alle zinslessen', exact: true }).click();
  await expect(page.getByRole('tab', { name: /^Niveau 6: Zinnen/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('link', { name: /^Open de module\s*:/ })).toHaveCount(11);
  await expect(page.getByRole('link', { name: `Verder oefenen : ${sentenceLessons[0]!.title}`, exact: true })).toBeVisible();
});

test('alle twaalf lessen hebben uitlegbare voorbeelden en afspeelbare video met Nederlandse ondertiteling', async ({ page }) => {
  test.setTimeout(180_000);
  for (const teaching of sentenceTeaching) {
    await page.goto(`/zinnen/les/${teaching.lessonId}`);
    await page.getByRole('tab', { name: 'Uitleg', exact: true }).click();
    await expect(page.getByText(teaching.introduction[0]!, { exact: true })).toBeVisible();
    await page.getByText(teaching.concepts[0]!.term, { exact: true }).click();
    await expect(page.getByText(teaching.concepts[0]!.meaning, { exact: true })).toBeVisible();
    await page.getByRole('tab', { name: 'Samen bekijken', exact: true }).click();
    for (const [index, step] of teaching.walkthrough.steps.entries()) {
      await page.getByRole('navigation', { name: 'Stappen van het uitgewerkte voorbeeld', exact: true }).getByRole('button').nth(index).click();
      await expect(page.getByRole('heading', { name: step.title, exact: true })).toBeVisible();
      await expect(page.getByText(step.explanation, { exact: true }).first()).toBeVisible();
    }
    await page.getByText('Bekijk dit voorbeeld als uitlegvideo', { exact: true }).click();
    const video = page.getByLabel(`Uitlegvideo: ${teaching.walkthrough.title}`, { exact: true });
    await expect(video).toBeVisible();
    await expect(video).toHaveAttribute('preload', 'none');
    await expect(video).not.toHaveAttribute('autoplay', '');
    await expect(video.locator('track')).toHaveAttribute('src', `/videos/zinnen/${teaching.lessonId}.vtt`);
    await video.evaluate(async (element: HTMLVideoElement) => { element.load(); await element.play(); });
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.textTracks[0]?.cues?.length ?? 0)).toBeGreaterThan(4);
    await video.evaluate((element: HTMLVideoElement) => element.pause());
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.duration)).toBeGreaterThan(40);
    await page.getByText('Lees de volledige videotekst', { exact: true }).click();
    await expect(page.getByText(teaching.walkthrough.result, { exact: true }).last()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  }
});

test('eigen verklaring komt voor het model en blijft bewaard zonder onterecht een les af te ronden', async ({ page }) => {
  const teaching = sentenceTeaching[0]!;
  await page.goto(`/zinnen/les/${teaching.lessonId}`);
  await page.getByRole('tab', { name: 'Uitleg', exact: true }).click();
  await page.getByRole('tab', { name: 'Zelf proberen', exact: true }).click();
  const compare = page.getByRole('button', { name: 'Vergelijk met een voorbeeld', exact: true });
  await expect(compare).toBeDisabled();
  await expect(page.getByText(teaching.application.model, { exact: true })).toHaveCount(0);
  const wrong = teaching.quickCheck.options.find((option) => option.id !== teaching.quickCheck.answer)!;
  await page.getByRole('radio', { name: wrong.text, exact: true }).check();
  await expect(page.getByText(wrong.feedback, { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Bekijk de uitleg bij mijn antwoord', exact: true }).click();
  await expect(page.getByText(wrong.feedback, { exact: true })).toBeVisible();
  const draft = 'De vriendelijke docent bij het raam leest een boek. De docent is de kern; vriendelijk en bij het raam beschrijven deze docent.';
  await page.getByRole('textbox', { name: 'Schrijf je eigen zin en verklaring', exact: true }).fill(draft);
  await compare.click();
  await expect(page.getByText(teaching.application.model, { exact: true })).toBeVisible();
  await page.getByRole('checkbox').first().check();
  await page.reload();
  await page.getByRole('tab', { name: 'Zelf proberen', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Schrijf je eigen zin en verklaring', exact: true })).toHaveValue(draft);
  await expect(page.getByText(teaching.application.model, { exact: true })).toHaveCount(0);
  await page.getByRole('tab', { name: 'Samenvatting', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Pas dit toe in je eigen tekst', exact: true })).toHaveValue(draft);
  await expect(page.getByRole('button', { name: 'Module afronden en samenvatting bewaren', exact: true })).toHaveCount(0);
  const persisted = await page.evaluate(() => JSON.parse(localStorage.getItem('pennig:zinnen') ?? '{}'));
  expect(persisted.state.sessions[teaching.lessonId].finished).toBe(false);
  expect(persisted.state.records[teaching.lessonId]).toBeUndefined();
});

test('extra zinoefeningen verwijzen naar de uitleg die bij hun onderwerp hoort', async ({ page }) => {
  for (const [id, mainId] of [['p1', 'zinnen-01'], ['z22', 'zinnen-11'], ['s22', 'zinnen-10']] as const) {
    await page.goto(`/les/${id}`);
    const reference = page.getByRole('region', { name: 'Uitleg bij deze zinoefening', exact: true }).getByRole('link');
    await expect(reference).toHaveAttribute('href', `/zinnen/les/${mainId}`);
    await reference.click();
    await expect(page.getByRole('heading', { name: sentenceLessons.find((lesson) => lesson.id === mainId)!.title, exact: true })).toBeVisible();
  }
});
