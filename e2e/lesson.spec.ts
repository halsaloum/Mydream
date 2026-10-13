import { expect, openStages, seedOnboarded, test, type Locator } from './fixtures';
import type { Page } from '@playwright/test';

test.beforeEach(async ({ page }) => seedOnboarded(page));

/** Het cijfer waarmee je een keuze kiest; de keuzes staan elke ronde in een andere volgorde. */
async function digitOf(option: Locator) {
  return (await option.innerText()).trim().charAt(0);
}

/** Doorloop ook de nieuwe toepassing; alleen de oude korte les afronden is onvoldoende. */
async function finishTonePractice(page: Page) {
  const primary = page.getByRole('contentinfo').getByRole('button').last();
  await expect(page.getByRole('heading', { name: 'Een duidelijke deadline hoeft niet te schreeuwen' })).toBeVisible();
  await page.getByRole('radio', { name: 'verzoek', exact: true }).click();
  await primary.click();
  await primary.click();
  await page.getByRole('radio', { name: /In de levering ontbreekt één map/ }).click();
  await primary.click();
  await primary.click();
  await page.getByRole('button', { name: 'passend', exact: true }).click();
  await page.getByRole('button', { name: 'Verstuur', exact: true }).click();
  await primary.click();
  await page.getByRole('radio', { name: /Wilt u de uitslag vandaag vóór 14.00 uur mailen/ }).click();
  await primary.click();
  await primary.click();
  await page.getByRole('textbox', { name: 'Jouw versie' }).fill('Kunt u de bevestiging vandaag sturen?');
  await primary.click();
  await primary.click();
  await page.getByRole('textbox', { name: 'Jouw tekst' }).fill('Beste collega, in je bericht ontbreekt de bijlage met de planning. Wil je die vandaag vóór 16.00 uur sturen? Dan kan ik de definitieve afspraken nog op tijd bevestigen en iedereen informeren over de tijden.');
  const compare = page.getByRole('button', { name: 'Vergelijk met een voorbeeld' });
  if (await compare.isVisible()) {
    await compare.click();
    for (const checkbox of await page.getByRole('region', { name: 'Inhoudelijke zelfcontrole' }).getByRole('checkbox').all()) await checkbox.check();
  }
  await primary.click();
  await primary.click();
}

test('les direct openen, met het toetsenbord doen en na verversen hervatten', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/les/l4');
  await expect(page.getByRole('heading', { name: 'Tekens geven toon' })).toBeVisible();

  const primary = page.getByRole('contentinfo').getByRole('button').last();
  await expect(primary).toHaveText(/Doe eerst de opdracht/);
  await expect(primary).toBeDisabled();

  await page.getByRole('radio', { name: 'rustig' }).click();
  await expect(page.getByText('Kun je even bellen?')).toBeVisible();
  await page.keyboard.press('Enter');

  await expect(page.getByRole('heading', { name: 'Welke past in een mail aan een klant?' })).toBeVisible();
  const goed = page.getByRole('radio', { name: /Bedankt voor uw bericht\.$/ });
  const digit = await digitOf(goed);
  await page.keyboard.press(digit);
  await expect(goed).toBeChecked();

  // Na verversen staan de keuzes in dezelfde volgorde en is dezelfde keuze nog gekozen.
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Welke past in een mail aan een klant?' })).toBeVisible();
  await expect(goed).toBeChecked();
  expect(await digitOf(goed)).toBe(digit);

  await page.keyboard.press('Enter');
  await expect(page.getByRole('status').filter({ hasText: 'Rustig en zakelijk.' })).toBeVisible();
  await page.keyboard.press('Enter');

  await finishTonePractice(page);
  await expect(page.getByRole('heading', { name: 'Hiermee heb je geoefend' })).toBeVisible();
  await page.getByRole('link', { name: 'Naar Leren' }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto('/voortgang');
  await expect(page.getByText('Lessen af')).toBeVisible();
});

test('regelvenster: focus, Escape en terug naar de knop', async ({ page }) => {
  await page.goto('/les/l4');
  await page.getByRole('radio', { name: 'rustig' }).click();
  await page.getByRole('contentinfo').getByRole('button', { name: /Ik snap het/ }).click();

  const opener = page.getByRole('button', { name: 'De regel' });
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'De regel' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: 'Tekens geven toon' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('onbekende les toont een verzorgde melding', async ({ page }) => {
  const response = await page.goto('/les/bestaat-niet');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Deze les bestaat niet' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Naar alle lessen' })).toBeVisible();
});

test('de letter: de praktijklessen staan per stap, eerst de regels en dan de toets', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: /^Niveau 1: De letter/ }).click();
  await openStages(page, ['Regels', 'Toets']);
  await expect(page.getByRole('link', { name: /Hoofdletters: de zin en namen/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Toets: De letter/ })).toBeVisible();
});

test('klank en letter: de praktijklessen staan per stap, eerst de regels en dan de toets', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: /^Niveau 2: Klank en letter/ }).click();
  await openStages(page, ['Regels', 'Toets']);
  await expect(page.getByRole('link', { name: /ei of ij\?/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Toets: klank en letter/ })).toBeVisible();
});

test('de lettergreep: de praktijklessen staan per stap, eerst de regels en dan de toets', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: /^Niveau 3: De lettergreep/ }).click();
  await openStages(page, ['Regels', 'Toets']);
  await expect(page.getByRole('link', { name: /Medeklinker verdubbelen/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Toets: De lettergreep/ })).toBeVisible();
});

test('afbreken: een verkeerde knip blijft open, de goede knip opent het volgende deel', async ({ page }) => {
  await page.goto('/les/g27');
  await expect(page.getByRole('heading', { name: 'Waar mag het streepje?' })).toBeVisible();
  const primary = page.getByRole('contentinfo').getByRole('button').last();
  await expect(primary).toBeDisabled();

  await page.getByRole('button', { name: 'Knip tussen m en a' }).click();
  await expect(primary).toBeDisabled();
  await page.getByRole('button', { name: 'Knip tussen m en a' }).click();
  await page.getByRole('button', { name: 'Knip tussen a en k' }).click();

  await expect(page.getByRole('status').filter({ hasText: 'ma-ken' })).toBeVisible();
  await expect(primary).toHaveText(/Volgende deel/);
  await expect(primary).toBeEnabled();
});

test('het betekenisvolle woorddeel: de nieuwe lessen staan per stap, bachelor en master', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: /^Niveau 4: Het betekenisvolle woorddeel/ }).click();
  await openStages(page, ['Bachelor', 'Master']);
  await expect(page.getByRole('link', { name: /Inheems, geleerd en een paradox/ })).toBeVisible();
});

test('woordboom: twee buren plakken in de volgorde van de boom opent het volgende deel', async ({ page }) => {
  await page.goto('/les/d8');
  await expect(page.getByRole('heading', { name: 'De volgorde van plakken' })).toBeVisible();
  const primary = page.getByRole('contentinfo').getByRole('button').last();
  await expect(primary).toBeDisabled();

  await page.getByRole('button', { name: 'Plak on en lees' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'onlezen bestaat niet' })).toBeVisible();
  await page.getByRole('button', { name: 'Plak lees en baar' }).click();
  await page.getByRole('button', { name: 'Plak on en leesbaar' }).click();
  await page.getByRole('button', { name: 'Plak onleesbaar en heid' }).click();

  await expect(page.getByRole('status').filter({ hasText: 'drie stappen' })).toBeVisible();
  await expect(primary).toHaveText(/Volgende deel/);
  await expect(primary).toBeEnabled();
});

test('het woord: de nieuwe lessen staan per stap, bachelor en master', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: /^Niveau 5: Het woord/ }).click();
  await openStages(page, ['Bachelor', 'Master']);
  await expect(page.getByRole('link', { name: /Hebben of zijn\?/ })).toBeVisible();
});

test('paradigma: elk leeg vakje goed invullen opent het volgende deel', async ({ page }) => {
  await page.goto('/les/w10');
  await expect(page.getByRole('heading', { name: 'Klinkerwisseling met een geschiedenis' })).toBeVisible();
  const primary = page.getByRole('contentinfo').getByRole('button').last();
  await page.getByRole('radio', { name: /^rijden/ }).click();
  await primary.click();
  await expect(primary).toBeDisabled();

  await page.getByRole('button', { name: 'geloopt' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Reeks 1' })).toBeVisible();
  for (const form of ['gereden', 'bood', 'bond', 'gebonden', 'nam', 'genomen', 'gaf', 'droeg', 'gedragen', 'liep']) {
    await page.getByRole('button', { name: form, exact: true }).click();
  }

  await expect(page.getByRole('status').filter({ hasText: 'Zeven reeksen' })).toBeVisible();
  await expect(primary).toHaveText(/Volgende deel/);
  await expect(primary).toBeEnabled();
});

test('fiets in 3D: een onderdeel kiezen en het woord met het goede lidwoord typen', async ({ page }) => {
  await page.goto('/les/d20');
  await expect(page.getByRole('heading', { name: 'Een fiets vol woorden' })).toBeVisible();
  await page.getByRole('group', { name: 'Kies een onderdeel' }).getByRole('button', { name: 'Onderdeel 2' }).click();

  const veld = page.getByLabel(/Tring tring/);
  await veld.fill('het bel');
  await veld.press('Enter');
  await expect(page.getByText('Het is de bel, net als de deurbel.')).toBeVisible();
  await veld.fill('de bel');
  await veld.press('Enter');
  await expect(page.getByRole('status').filter({ hasText: '1 van 8 onderdelen goed, nog 7' })).toBeVisible();
});

test('een afgeronde les blijft na verversen afgerond', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/les/l4');
  await page.getByRole('radio', { name: 'rustig' }).click();
  await page.keyboard.press('Enter');
  await page.keyboard.press(await digitOf(page.getByRole('radio', { name: /Bedankt voor uw bericht\.$/ })));
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await finishTonePractice(page);
  await expect(page.getByRole('heading', { name: 'Hiermee heb je geoefend' })).toBeVisible();

  await page.goto('/voortgang');
  await page.reload();
  await expect(page.getByText('HOOFDLETTERS!!! en toon')).toBeVisible();
  await page.goto('/');
  await page.reload();
  await expect(page.getByText(/Afgerond · 100%/)).toBeVisible();
});

test('waarschuwt als de browser niets wil opslaan', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Opslag geblokkeerd', 'SecurityError');
    };
  });
  await page.goto('/voortgang');
  await expect(page.getByText('Je voortgang wordt niet bewaard')).toBeVisible();
});
