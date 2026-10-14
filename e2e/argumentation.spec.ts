import { argumentLessons } from '../src/content/argumentation/curriculum';
import { shuffle } from '../src/engine/hash';
import { lessonScaffolds } from '../src/content/argumentation/scaffolds';
import { lessonCoreChecks } from '../src/content/argumentation/core-checks';
import { foundationForLesson } from '../src/content/argumentation/foundations';
import { theoryPages } from '../src/lib/argumentation/theory-pages';
import type { ArgumentLesson } from '../src/content/argumentation/types';
import type { Page } from '@playwright/test';
import { test, expect, seedOnboarded } from './fixtures';

test.beforeEach(async ({ page }) => { await seedOnboarded(page); });

async function learnFoundations(page: Page, lesson: ArgumentLesson) {
  for (const concept of foundationForLesson(lesson.id)) {
    await expect(page.getByRole('heading', { name: concept.title, exact: true, level: 2 })).toBeVisible();
    const practice = page.getByRole('region', { name: `Oefen het begrip ${concept.term}`, exact: true });
    await practice.getByRole('radio', { name: concept.options.find((option) => option.id === concept.answer)!.text, exact: true }).check();
    await page.getByRole('button', { name: 'Volgende pagina', exact: true }).click();
  }
}

async function readToPractice(page: Page, lesson: ArgumentLesson, stopAt?: string) {
  for (let step = 0; step < 20; step++) {
    if (stopAt && await page.getByRole('region', { name: `Leespagina: ${stopAt}`, exact: true }).isVisible()) return;
    const practice = page.getByRole('button', { name: 'Naar de opdrachten', exact: true });
    if (await practice.isVisible()) { await practice.click(); return; }
    const compare = page.getByRole('button', { name: 'Vergelijk mijn redenering', exact: true });
    if (await compare.isVisible()) {
      await page.getByRole('textbox', { name: 'Jouw eerste analyse', exact: true }).fill('Ik toets de reden, de verbinding met het standpunt en de sterkste gerichte tegenwerping.');
      await compare.click();
    }
    const core = page.getByRole('region', { name: 'Probeer deze denkstap', exact: true });
    if (await core.isVisible()) {
      const check = lessonCoreChecks[lesson.id]!;
      await core.getByRole('radio', { name: check.options.find((option) => option.id === check.answer)!.text, exact: true }).check();
    }
    await page.getByRole('button', { name: 'Volgende pagina', exact: true }).click();
  }
  throw new Error('De leespagina’s hebben geen overgang naar de opdrachten.');
}

test('één doorlopende leerroute integreert de hulpmiddelen en zoeken werkt met toetsenbord', async ({ page }) => {
  await page.goto('/argumentatie');
  await expect(page.getByRole('heading', { name: 'Sterk denken. Zorgvuldig argumenteren.' })).toBeVisible();
  const artwork = page.getByRole('img', { name: 'Twee premissen ondersteunen een standpunt; een tegenwerping bevraagt de verbinding.', exact: true });
  if (await artwork.isVisible()) await expect(artwork.locator('..')).toHaveCSS('opacity', '1');
  await page.screenshot({ path: test.info().outputPath('argumentatie-overzicht.png') });
  await expect(page.getByRole('tab')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Van eerste begrip naar zelfstandig oordeel.', exact: true })).toBeVisible();
  await page.getByRole('searchbox', { name: 'Zoek in argumentatielessen' }).fill('Bayes');
  await expect(page.getByRole('heading', { name: 'Vind je onderwerp.' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Bayes/ }).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});

test('een volledige analyse heeft feedback, reconstructie, schrijfwerk en sessieherstel', async ({ page }) => {
  const lesson = argumentLessons.find((item) => item.moduleId === 'basis' && !item.checkpoint && !item.introductory)!;
  await page.addInitScript((ids) => {
    const records = Object.fromEntries(ids.map((id) => [id, { attempts: 1, bestScore: 100, lastScore: 100, completedAt: '2026-10-12T08:00:00.000Z', lastPracticedAt: '2026-10-12T08:00:00.000Z', reviewOn: '2099-01-01' }]));
    if (!localStorage.getItem('pennig:argumentatie')) localStorage.setItem('pennig:argumentatie', JSON.stringify({ state: { records, sessions: {} }, version: 1 }));
  }, argumentLessons.slice(0, argumentLessons.indexOf(lesson)).map((item) => item.id));
  await page.goto(`/argumentatie/les/${lesson.id}`);
  await expect(page.getByRole('heading', { name: lesson.title, exact: true })).toBeVisible();
  await learnFoundations(page, lesson);
  const starter = lessonScaffolds[lesson.id]!;
  await expect(page.getByRole('button', { name: 'Volgende pagina', exact: true })).toBeDisabled();
  await page.getByRole('region', { name: 'Begin met één kleine stap', exact: true }).getByRole('radio', { name: starter.options.find((option) => option.id === starter.answer)!.text, exact: true }).check();
  await page.getByRole('button', { name: 'Volgende pagina', exact: true }).click();
  await expect(page.getByRole('heading', { name: lesson.sections[0]!.title, exact: true })).toBeFocused();
  await expect(page.getByText(lesson.deepDive.body, { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Volgende pagina', exact: true }).click();
  const preparation = page.getByRole('region', { name: 'Denk eerst zelf' });
  await expect(preparation.getByText('Een beargumenteerde uitwerking')).toHaveCount(0);
  await preparation.getByRole('textbox', { name: 'Jouw eerste analyse', exact: true }).fill('Het voorstel vraagt een duidelijke verbinding tussen het genoemde gegeven en de gewenste beslissing, met aandacht voor alternatieven.');
  await preparation.getByRole('button', { name: 'Vergelijk mijn redenering' }).click();
  await expect(preparation.getByText('Een beargumenteerde uitwerking')).toBeVisible();
  await preparation.getByRole('textbox').nth(1).fill('Ik maak de verborgen veronderstelling zichtbaar en formuleer een gerichte tegenwerping die op de verbinding betrekking heeft.');
  await readToPractice(page, lesson);
  for (const [index, exercise] of lesson.exercises.entries()) {
    await expect(page.getByRole('heading', { name: exercise.prompt, exact: true })).toBeFocused();
    const check = page.getByRole('button', { name: exercise.kind === 'reflection' ? 'Vergelijk met het model' : 'Controleer je analyse' });
    await expect(check).toBeDisabled();
    if (index === 1) {
      await page.getByRole('button', { name: 'Terug naar theorie' }).click();
      await page.reload();
      await page.getByRole('button', { name: `Terug naar opdracht ${index + 1}` }).click();
      await expect(page.getByRole('heading', { name: exercise.prompt, exact: true })).toBeFocused();
    }
    if (exercise.kind === 'choice') {
      const selected = exercise.options.find((option) => option.id === exercise.answer)!;
      if (index === 0) {
        const wrong = exercise.options.find((option) => option.id !== exercise.answer)!;
        await page.getByRole('radio', { name: wrong.text, exact: false }).check();
        await page.getByRole('radio', { name: 'Zeer zeker', exact: true }).check();
        await check.click();
        await expect(page.getByRole('button', { name: 'Volgende opdracht' })).toBeDisabled();
        await page.getByRole('button', { name: 'Probeer opnieuw' }).click();
      }
      await page.getByRole('radio', { name: selected.text, exact: false }).check();
    } else if (exercise.kind === 'reflection') {
      await page.getByRole('textbox', { name: 'Jouw analyse' }).fill(exercise.model + ' ' + 'Onderbouwing '.repeat(exercise.minWords));
    } else {
      for (const [displayIndex, card] of shuffle(exercise.id, exercise.cards).entries()) {
        await page.getByRole('combobox').nth(displayIndex).selectOption(card.category);
      }
    }
    if (exercise.kind !== 'reflection') await page.getByRole('radio', { name: 'Redelijk zeker', exact: true }).check();
    await check.click();
    if (exercise.kind === 'reflection') {
      await expect(page.getByRole('button', { name: 'Les afronden' })).toBeDisabled();
      for (const criterion of exercise.rubric) await page.getByRole('checkbox', { name: criterion, exact: true }).check();
      await page.getByRole('button', { name: 'Herzien' }).click();
      await check.click();
      for (const criterion of exercise.rubric) {
        await expect(page.getByRole('checkbox', { name: criterion, exact: true })).not.toBeChecked();
        await page.getByRole('checkbox', { name: criterion, exact: true }).check();
      }
    }
    await page.getByRole('button', { name: index === lesson.exercises.length - 1 ? 'Les afronden' : 'Volgende opdracht' }).click();
  }
  await expect(page.getByRole('heading', { name: 'Je hebt de les doorgewerkt.' })).toBeFocused();
  const data = await page.evaluate(() => JSON.parse(localStorage.getItem('pennig:argumentatie')!).state);
  expect(data.records[lesson.id].bestScore).toBeLessThan(100);
  expect(data.records[lesson.id].completedAt).toBeTruthy();
  await page.getByText('Lesoverzicht', { exact: true }).click();
  await page.getByRole('button', { name: new RegExp(`Leespagina.*${lesson.deepDive.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`) }).click();
  await expect(page.getByRole('heading', { name: lesson.deepDive.title, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Terug naar je resultaat' }).click();
  await expect(page.getByRole('heading', { name: 'Je hebt de les doorgewerkt.' })).toBeVisible();
});

test('checkpoint onder 80% blijft open, herhaling start een nieuwe poging', async ({ page }) => {
  const lesson = argumentLessons.find((item) => item.moduleId === 'basis' && item.checkpoint)!;
  await page.addInitScript((ids) => {
    const records = Object.fromEntries(ids.map((id) => [id, { attempts: 1, bestScore: 100, lastScore: 100, completedAt: '2026-10-12T08:00:00.000Z', lastPracticedAt: '2026-10-12T08:00:00.000Z', reviewOn: '2099-01-01' }]));
    if (!localStorage.getItem('pennig:argumentatie')) localStorage.setItem('pennig:argumentatie', JSON.stringify({ state: { records, sessions: {} }, version: 1 }));
  }, argumentLessons.slice(0, argumentLessons.indexOf(lesson)).map((item) => item.id));
  await page.goto(`/argumentatie/les/${lesson.id}`);
  await expect(page.getByRole('heading', { name: 'Laat zien wat je zelf kunt toepassen' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Begin met één kleine stap', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Start de toetsronde', exact: true }).click();
  for (const [index, exercise] of lesson.exercises.entries()) {
    if (exercise.kind !== 'choice') throw new Error('This checkpoint test expects a case-question assessment.');
    const option = exercise.options.find((item) => index < 3 ? item.id !== exercise.answer : item.id === exercise.answer)!;
    await page.getByRole('radio', { name: option.text, exact: false }).check();
    await page.getByRole('radio', { name: 'Redelijk zeker', exact: true }).check();
    await page.getByRole('button', { name: 'Leg je antwoord vast' }).click();
    await expect(page.getByLabel('Juist antwoord', { exact: true })).toHaveCount(0);
    await expect(page.getByLabel('Onjuist antwoord', { exact: true })).toHaveCount(0);
    await expect(page.getByText(exercise.explanation, { exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: index === lesson.exercises.length - 1 ? 'Toetsronde afronden' : 'Volgende opdracht' }).click();
  }
  await expect(page.getByRole('heading', { name: 'Je redenering kan nog scherper.' })).toBeVisible();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('pennig:argumentatie')!).state.records);
  expect(stored[lesson.id].completedAt).toBeNull();
  await page.getByRole('link', { name: 'Bewaren en terug naar het leerpad' }).click();
  await page.getByRole('button', { name: /Herhalen.*les/ }).click();
  await page.getByRole('region', { name: 'Jouw doorlopende leerpad', exact: true }).getByRole('link', { name: new RegExp(lesson.title) }).click();
  await expect(page.getByRole('heading', { name: lesson.exercises[0]!.prompt, exact: true })).toBeVisible();
});

test('video’s hebben werksituaties en eigen toepassingen blijven bewaard', async ({ page }) => {
  const lesson = argumentLessons.find((item) => item.id === 'master-toulmin-bewijslast')!;
  await page.addInitScript((ids) => {
    const records = Object.fromEntries(ids.map((id) => [id, { attempts: 1, bestScore: 100, lastScore: 100, completedAt: '2026-10-12T08:00:00.000Z', lastPracticedAt: '2026-10-12T08:00:00.000Z', reviewOn: '2099-01-01' }]));
    if (!localStorage.getItem('pennig:argumentatie')) localStorage.setItem('pennig:argumentatie', JSON.stringify({ state: { records, sessions: {} }, version: 1 }));
  }, argumentLessons.slice(0, argumentLessons.indexOf(lesson)).map((item) => item.id));
  await page.goto(`/argumentatie/les/${lesson.id}`);
  await learnFoundations(page, lesson);
  const scaffold = lessonScaffolds[lesson.id]!;
  await page.getByRole('region', { name: 'Begin met één kleine stap', exact: true }).getByRole('radio', { name: scaffold.options.find((option) => option.id === scaffold.answer)!.text, exact: true }).check();
  await readToPractice(page, lesson, 'Stevig van mening verschillen en toch samen verder');
  const article = page.getByRole('article').filter({ has: page.getByRole('heading', { name: 'Stevig van mening verschillen en toch samen verder' }) });
  await expect(article.getByRole('link', { name: 'Open de originele video' })).toHaveAttribute('href', 'https://www.ted.com/talks/julia_dhar_how_to_disagree_productively_and_find_common_ground');
  await article.getByRole('button', { name: 'Bekijk de video hier' }).click();
  await expect(article.locator('iframe')).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/phgjouv0BUA?rel=0');
  await article.getByText('Pas dit toe in jouw werk', { exact: true }).click();
  await article.getByRole('textbox').fill('Ons gedeelde doel is betrouwbare dienstverlening. Welk risico verwacht je precies, en welke begrenzing zou je bezwaar kunnen wegnemen?');
  await page.reload();
  await article.getByText('Pas dit toe in jouw werk', { exact: true }).click();
  await expect(article.getByRole('textbox')).toHaveValue(/Ons gedeelde doel/);
});

test('eigen argumentkaart en tegenproef blijven bruikbaar na verversen', async ({ page }) => {
  const lesson = argumentLessons.find((item) => item.id === 'basis-argumentstructuur')!;
  await page.addInitScript((ids) => {
    const records = Object.fromEntries(ids.map((id) => [id, { attempts: 1, bestScore: 100, lastScore: 100, completedAt: '2026-10-12T08:00:00.000Z', lastPracticedAt: '2026-10-12T08:00:00.000Z', reviewOn: '2099-01-01' }]));
    if (!localStorage.getItem('pennig:argumentatie')) localStorage.setItem('pennig:argumentatie', JSON.stringify({ state: { records, sessions: {} }, version: 1 }));
  }, argumentLessons.slice(0, argumentLessons.indexOf(lesson)).map((item) => item.id));
  await page.goto(`/argumentatie/les/${lesson.id}`);
  await learnFoundations(page, lesson);
  const scaffold = lessonScaffolds[lesson.id]!;
  await page.getByRole('region', { name: 'Begin met één kleine stap', exact: true }).getByRole('radio', { name: scaffold.options.find((option) => option.id === scaffold.answer)!.text, exact: true }).check();
  const workshop = theoryPages(lesson).find((item) => item.kind === 'workshop' && item.presetId === 'linked')!;
  await readToPractice(page, lesson, workshop.title);
  await expect(page.getByRole('group', { name: 'Kies een argumentstructuur' })).toHaveCount(0);
  await page.getByText('Bewerk uitspraken en voeg je eigen reden toe', { exact: true }).click();
  const authored = 'Een team heeft stille projecttijd nodig om klantvragen zorgvuldig af te handelen en fouten tijdig te herkennen.';
  await page.getByRole('textbox', { name: 'Tekst van p1', exact: true }).fill(authored);
  await page.reload();
  await page.getByText('Bewerk uitspraken en voeg je eigen reden toe', { exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Tekst van p1', exact: true })).toHaveValue(authored);
  const prediction = page.getByRole('region', { name: 'Voorspel de tegenproef' });
  await expect(prediction.getByText('Getoetste tegenproef · na jouw voorspelling')).toHaveCount(0);
  await prediction.getByRole('radio', { name: 'Alle bestaande volledige afleidingen naar deze conclusie verdwijnen.', exact: true }).check();
  await prediction.getByRole('textbox', { name: 'Mijn verklaring vóór de tegenproef', exact: true }).fill('De twee uitspraken dragen samen één afleiding. Zonder deze uitspraak is de gezamenlijke route onvolledig.');
  await prediction.getByRole('button', { name: 'Leg vast en toon de tegenproef' }).click();
  await expect(prediction.getByText('Getoetste tegenproef · na jouw voorspelling')).toBeVisible();
  await expect(prediction.getByText('Van 1 naar 0 volledige afleidingen.', { exact: false })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  await page.screenshot({ path: test.info().outputPath('argumentkaart-tegenproef.png') });
});

test('kaartjes kunnen met de muis naar een inhoudelijk onderdeel worden gesleept', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobiel', 'De mobiele keuzelijsten zijn in de volledige les getest.');
  await page.setViewportSize({ width: 1280, height: 1000 });
  const lesson = argumentLessons[0]!;
  await page.goto(`/argumentatie/les/${lesson.id}`);
  await learnFoundations(page, lesson);
  const scaffold = lessonScaffolds[lesson.id]!;
  await page.getByRole('region', { name: 'Begin met één kleine stap', exact: true }).getByRole('radio', { name: scaffold.options.find((option) => option.id === scaffold.answer)!.text, exact: true }).check();
  await readToPractice(page, lesson);
  for (const exercise of lesson.exercises) {
    if (exercise.kind === 'choice') {
      await page.getByRole('radio', { name: exercise.options.find((option) => option.id === exercise.answer)!.text, exact: false }).check();
      await page.getByRole('radio', { name: 'Redelijk zeker', exact: true }).check();
      await page.getByRole('button', { name: 'Controleer je analyse' }).click();
      await page.getByRole('button', { name: 'Volgende opdracht' }).click();
    } else if (exercise.kind === 'sort' || exercise.kind === 'map') {
      const card = shuffle(exercise.id, exercise.cards)[0]!;
      const handle = page.getByRole('button', { name: 'Sleep kaart 1. Je kunt ook de keuzelijst gebruiken.', exact: true });
      const zone = page.getByTestId(`argument-zone-${card.category}`);
      // Begin away from the auto-scroll edge; keep both endpoints in the viewport.
      await handle.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
      const from = await handle.boundingBox();
      const to = await zone.boundingBox();
      if (!from || !to) throw new Error('De kaart of het doelvak is niet zichtbaar.');
      await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
      await page.mouse.down();
      await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 20 });
      await page.mouse.up();
      await expect(page.getByRole('combobox').first()).toHaveValue(card.category);
      await page.screenshot({ path: test.info().outputPath('argumentatie-slepen.png') });
      return;
    }
  }
  throw new Error('De eerste les heeft geen reconstructieoefening.');
});

test('de eerste les begint klein en laat een illustratie inhoudelijk veranderen', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'mobiel') await page.setViewportSize({ width: 375, height: 812 });
  const lesson = argumentLessons[0]!;
  await page.goto(`/argumentatie/les/${lesson.id}`);
  await learnFoundations(page, lesson);
  const scaffold = lessonScaffolds[lesson.id]!;
  const starter = page.getByRole('region', { name: 'Begin met één kleine stap', exact: true });
  const wrong = scaffold.options.find((option) => option.id !== scaffold.answer)!;
  await starter.getByRole('radio', { name: wrong.text, exact: true }).check();
  await expect(starter.getByRole('status')).toContainText(wrong.feedback);
  await expect(page.getByRole('button', { name: 'Volgende pagina', exact: true })).toBeDisabled();
  await starter.getByRole('radio', { name: scaffold.options.find((option) => option.id === scaffold.answer)!.text, exact: true }).check();
  await page.getByRole('button', { name: 'Volgende pagina', exact: true }).click();
  await expect(page.getByRole('heading', { name: lesson.sections[0]!.title, exact: true })).toBeFocused();
  await expect(page.getByText(lesson.sections[1]!.body, { exact: true })).toHaveCount(0);
  const illustration = page.getByRole('region', { name: 'Interactieve illustratie: Van reden naar standpunt' });
  await illustration.getByRole('button', { name: 'Alleen een voorkeur' }).click();
  await expect(illustration.getByText('Kamer B lijkt mij prettig.', { exact: true })).toBeVisible();
  await illustration.getByRole('button', { name: 'Met een reden' }).click();
  await expect(illustration.getByRole('button', { name: 'Licht uit: Reden. In kamer B is minder lawaai.', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  await illustration.scrollIntoViewIfNeeded();
  await page.screenshot({ path: test.info().outputPath('eerste-les-illustratie.png') });
});

test('lezen toont één kern tegelijk en bewaart de pagina bij teruggaan en verversen', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'mobiel') await page.setViewportSize({ width: 375, height: 812 });
  else await page.setViewportSize({ width: 1280, height: 1400 });
  const lesson = argumentLessons[0]!;
  await page.goto(`/argumentatie/les/${lesson.id}`);
  await learnFoundations(page, lesson);
  const scaffold = lessonScaffolds[lesson.id]!;
  await page.getByRole('region', { name: 'Begin met één kleine stap', exact: true }).getByRole('radio', { name: scaffold.options.find((option) => option.id === scaffold.answer)!.text, exact: true }).check();
  await page.getByRole('button', { name: 'Volgende pagina', exact: true }).click();
  await expect(page.getByText(lesson.sections[0]!.body, { exact: true })).toBeVisible();
  await expect(page.getByText(lesson.sections[1]!.body, { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Volgende pagina', exact: true }).click();
  const comparison = page.getByRole('button', { name: 'Vergelijk mijn redenering', exact: true });
  if (await comparison.isVisible()) {
    await page.getByRole('textbox', { name: 'Jouw eerste analyse', exact: true }).fill('Ik zoek het voorgestelde standpunt en de reden die deze keuze ondersteunt.');
    await comparison.click();
    await page.getByRole('button', { name: 'Volgende pagina', exact: true }).click();
  }
  await expect(page.getByRole('heading', { name: lesson.sections[1]!.title, exact: true })).toBeFocused();
  await expect(page.getByText(lesson.sections[0]!.body, { exact: true })).toHaveCount(0);
  await expect(page.getByText(lesson.deepDive.body, { exact: true })).toHaveCount(0);
  const core = page.getByRole('region', { name: 'Probeer deze denkstap', exact: true });
  const check = lessonCoreChecks[lesson.id]!;
  await expect(page.getByText(lesson.sections[1]!.example, { exact: true })).toHaveCount(0);
  const wrong = check.options.find((option) => option.id !== check.answer)!;
  await core.getByRole('radio', { name: wrong.text, exact: true }).check();
  await expect(core.getByRole('status')).toContainText(wrong.feedback);
  await expect(page.getByRole('button', { name: 'Volgende pagina', exact: true })).toBeDisabled();
  const correct = check.options.find((option) => option.id === check.answer)!;
  await core.getByRole('radio', { name: correct.text, exact: true }).check();
  await expect(page.getByText(lesson.sections[1]!.example, { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Volgende pagina', exact: true })).toBeEnabled();
  await page.reload();
  await expect(page.getByRole('heading', { name: lesson.sections[1]!.title, exact: true })).toBeVisible();
  await expect(core.getByRole('radio', { name: correct.text, exact: true })).toBeChecked();
  const record = await page.evaluate(() => JSON.parse(localStorage.getItem('pennig:argumentatie')!).state);
  expect(record.sessions[lesson.id].firstTry).toEqual({});
  await page.getByRole('button', { name: 'Vorige pagina', exact: true }).click();
  if (await page.getByRole('region', { name: 'Denk eerst zelf', exact: true }).isVisible()) await page.getByRole('button', { name: 'Vorige pagina', exact: true }).click();
  await expect(page.getByText(lesson.sections[0]!.body, { exact: true })).toBeVisible();
  await expect(page.getByText(lesson.sections[1]!.body, { exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  const readingPage = page.getByRole('region', { name: `Leespagina: ${lesson.sections[0]!.title}`, exact: true });
  await expect(readingPage.locator('..')).toHaveCSS('opacity', '1');
  const illustration = page.getByRole('region', { name: 'Interactieve illustratie: Van reden naar standpunt', exact: true });
  await expect(illustration.getByRole('button', { name: 'Ontleed de kaart', exact: true })).toBeVisible();
  await illustration.getByRole('button', { name: 'Ontleed de kaart', exact: true }).click();
  await expect(illustration.getByRole('status')).toContainText('In kamer B is minder lawaai.');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: test.info().outputPath('een-kern-per-pagina.png') });
});

test('zonder voorkennis begint de les bij argumenten en zijn begrippen volledige hoofdstappen', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'mobiel') await page.setViewportSize({ width: 375, height: 812 });
  else await page.setViewportSize({ width: 1280, height: 1500 });
  const lesson = argumentLessons[0]!;
  const concepts = foundationForLesson(lesson.id);
  expect(concepts.map((concept) => concept.term)).toEqual(['Argument', 'Conclusie', 'Premisse', 'Gevolgtrekking']);
  await page.goto(`/argumentatie/les/${lesson.id}`);
  const first = concepts[0]!;
  await expect(page.getByRole('heading', { name: first.title, exact: true, level: 2 })).toBeVisible();
  await expect(page.getByText(first.body, { exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Begin met één kleine stap', exact: true })).toHaveCount(0);
  await expect(page.getByText('Nieuw met argumenten? Begin bij deze begrippen.', { exact: true })).toHaveCount(0);
  const practice = page.getByRole('region', { name: `Oefen het begrip ${first.term}`, exact: true });
  const wrong = first.options.find((option) => option.id !== first.answer)!;
  await practice.getByRole('radio', { name: wrong.text, exact: true }).check();
  await expect(practice.getByRole('status')).toContainText(wrong.feedback);
  await expect(page.getByRole('button', { name: 'Volgende pagina', exact: true })).toBeDisabled();
  const correct = first.options.find((option) => option.id === first.answer)!;
  await practice.getByRole('radio', { name: correct.text, exact: true }).check();
  await page.reload();
  await expect(practice.getByRole('radio', { name: correct.text, exact: true })).toBeChecked();
  const firstPage = page.getByRole('region', { name: `Leespagina: ${first.title}`, exact: true });
  await expect(firstPage.locator('..')).toHaveCSS('opacity', '1');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: test.info().outputPath('argumentatie-fundament.png') });
  await page.getByRole('button', { name: 'Volgende pagina', exact: true }).click();
  await expect(page.getByRole('heading', { name: concepts[1]!.title, exact: true, level: 2 })).toBeFocused();
  await expect(page.getByText(first.body, { exact: true })).toHaveCount(0);
  await expect(page.getByText(concepts[2]!.body, { exact: true })).toHaveCount(0);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('pennig:argumentatie')!).state);
  expect(stored.sessions[lesson.id].firstTry).toEqual({});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});

test('het expertcheckpoint vraagt twee zelfstandige werkstukken en telt alleen de acht kennisvragen', async ({ page }) => {
  const lesson = argumentLessons.find((item) => item.id === 'master-checkpoint')!;
  await page.addInitScript((ids) => {
    const records = Object.fromEntries(ids.map((id) => [id, { attempts: 1, bestScore: 100, lastScore: 100, completedAt: '2026-10-12T08:00:00.000Z', lastPracticedAt: '2026-10-12T08:00:00.000Z', reviewOn: '2099-01-01' }]));
    if (!localStorage.getItem('pennig:argumentatie')) localStorage.setItem('pennig:argumentatie', JSON.stringify({ state: { records, sessions: {} }, version: 1 }));
  }, argumentLessons.slice(0, argumentLessons.indexOf(lesson)).map((item) => item.id));
  await page.goto(`/argumentatie/les/${lesson.id}`);
  await page.getByRole('button', { name: 'Start de toetsronde', exact: true }).click();
  for (const [index, exercise] of lesson.exercises.entries()) {
    if (exercise.kind === 'choice') {
      await page.getByRole('radio', { name: exercise.options.find((option) => option.id === exercise.answer)!.text, exact: false }).check();
      await page.getByRole('radio', { name: 'Redelijk zeker', exact: true }).check();
      await page.getByRole('button', { name: 'Leg je antwoord vast', exact: true }).click();
    } else if (exercise.kind === 'reflection') {
      await page.getByRole('textbox', { name: 'Jouw analyse', exact: true }).fill('Een te korte analyse.');
      await expect(page.getByRole('button', { name: 'Leg je antwoord vast', exact: true })).toBeDisabled();
      await page.getByRole('textbox', { name: 'Jouw analyse', exact: true }).fill(exercise.model);
      await page.getByRole('button', { name: 'Leg je antwoord vast', exact: true }).click();
      await expect(page.getByRole('heading', { name: 'Een mogelijke uitwerking', exact: true })).toHaveCount(0);
      await expect(page.getByRole('checkbox')).toHaveCount(0);
    } else throw new Error('Deze eindtoets heeft alleen kennisvragen en expertwerkstukken.');
    await page.getByRole('button', { name: index === lesson.exercises.length - 1 ? 'Naar zelfcontrole' : 'Volgende opdracht', exact: true }).click();
  }
  await expect(page.getByRole('button', { name: 'Zelfcontrole afronden', exact: true })).toBeDisabled();
  for (const exercise of lesson.exercises) {
    if (exercise.kind === 'reflection') for (const criterion of exercise.rubric) await page.getByRole('checkbox', { name: criterion, exact: true }).check();
  }
  await page.getByRole('button', { name: 'Zelfcontrole afronden', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Checkpoint behaald.', exact: true })).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('pennig:argumentatie')!).state);
  expect(Object.keys(saved.sessions[lesson.id].firstTry)).toHaveLength(8);
  expect(saved.records[lesson.id].lastScore).toBe(100);
  expect(Object.keys(saved.records[lesson.id].history[0].writings)).toEqual(expect.arrayContaining(lesson.exercises.filter((item) => item.kind === 'reflection').map((item) => item.id)));
});


test('expertcheckpoint bewaart beide eigen teksten vóór modellen en herziening', async ({ page }) => {
  test.setTimeout(90_000);
  const lesson = argumentLessons.find((item) => item.id === 'master-checkpoint')!;
  await page.addInitScript((ids) => {
    const records = Object.fromEntries(ids.map((id) => [id, { attempts: 1, bestScore: 100, lastScore: 100, completedAt: '2026-10-12T08:00:00.000Z', lastPracticedAt: '2026-10-12T08:00:00.000Z', reviewOn: '2099-01-01' }]));
    if (!localStorage.getItem('pennig:argumentatie')) localStorage.setItem('pennig:argumentatie', JSON.stringify({ state: { records, sessions: {} }, version: 1 }));
  }, argumentLessons.slice(0, argumentLessons.indexOf(lesson)).map((item) => item.id));
  await page.goto(`/argumentatie/les/${lesson.id}`);
  await page.getByRole('button', { name: 'Start de toetsronde', exact: true }).click();
  const writings: Record<string, string> = {};
  for (const [index, exercise] of lesson.exercises.entries()) {
    if (exercise.kind === 'choice') {
      await page.getByRole('radio', { name: exercise.options.find((option) => option.id === exercise.answer)!.text, exact: false }).check();
      await page.getByRole('radio', { name: 'Redelijk zeker', exact: true }).check();
    } else if (exercise.kind === 'reflection') {
      const draft = `Mijn eerste zelfstandige versie voor ${exercise.id}. ` + 'Ik toets het gegeven en de ontbrekende verbinding. '.repeat(exercise.minWords);
      writings[exercise.id] = draft;
      await page.getByRole('textbox', { name: 'Jouw analyse', exact: true }).fill(draft);
    } else throw new Error('Dit checkpoint gebruikt keuzes en twee eigen analyses.');
    await page.getByRole('button', { name: 'Leg je antwoord vast', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Een mogelijke uitwerking', exact: true })).toHaveCount(0);
    await expect(page.getByRole('checkbox')).toHaveCount(0);
    if (index === lesson.exercises.length - 1) await page.reload();
    await page.getByRole('button', { name: index === lesson.exercises.length - 1 ? 'Naar zelfcontrole' : 'Volgende opdracht', exact: true }).click();
  }
  await expect(page.getByRole('heading', { name: 'Een mogelijke uitwerking', exact: true })).toHaveCount(2);
  const first = lesson.exercises.find((item) => item.kind === 'reflection')!;
  const revision = writings[first.id] + ' Na vergelijking maak ik mijn startvoorwaarden concreter.';
  await page.getByRole('textbox', { name: 'Jouw analyse', exact: true }).first().fill(revision);
  for (const checkbox of await page.getByRole('checkbox').all()) await checkbox.check();
  await page.getByRole('button', { name: 'Zelfcontrole afronden', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Checkpoint behaald.', exact: true })).toBeVisible();
  const saved = await page.evaluate((id) => JSON.parse(localStorage.getItem('pennig:argumentatie')!).state.records[id], lesson.id);
  expect(saved.bestScore).toBe(100);
  expect(saved.history.at(-1).writings[first.id]).toContain(writings[first.id]);
  expect(saved.history.at(-1).writings[first.id]).toContain(revision);
  await page.getByText('Bekijk de feedback op alle toetsvragen', { exact: true }).click();
  await expect(page.getByText(lesson.exercises[0]!.explanation, { exact: true })).toBeVisible();
});
