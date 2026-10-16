import { expect, openStages, seedOnboarded, test } from './fixtures';

test.beforeEach(async ({ page }) => seedOnboarded(page));

test('argumenteren vanaf nul: van aanpak en interactieve uitleg tot een eigen onderbouwd voorstel', async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto('/les/a20');
  await expect(page.getByRole('heading', { name: 'Dit ga je leren' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Wat probeer je aannemelijk te maken?' })).toBeVisible();
  const approach = page.getByRole('button', { name: 'Aanpak voor deze les' });
  await approach.click();
  const dialog = page.getByRole('dialog', { name: 'Aanpak voor deze les' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('Onderstreep het standpunt: wat moet de lezer geloven of doen?')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(approach).toBeFocused();

  const primary = page.getByRole('contentinfo').getByRole('button').last();
  await expect(primary).toBeDisabled();
  await page.getByRole('radio', { name: 'Waarom?', exact: true }).click();
  await expect(page.getByText('Veel studenten werken overdag.', { exact: true })).toBeVisible();
  await expect(page.getByText(/hoeveel studenten het betreft vraagt nog bewijs/)).toBeVisible();
  await primary.click();
  await expect(page.getByRole('region', { name: 'Deel 2', exact: true })).toBeVisible();
  await primary.click();
  await expect(page.getByRole('region', { name: 'Deel 3', exact: true })).toContainText('fictief oefenmateriaal');
  await primary.click();
  await expect(page.getByRole('heading', { name: 'Welke uitspraak drukt vooral een waarde uit?' })).toBeVisible();
  await page.getByRole('radio', { name: /Gelijke toegang is belangrijk/ }).click();
  await primary.click();
  await expect(page.getByRole('status').filter({ hasText: 'Belangrijk noemt een maatstaf' })).toBeVisible();
  await primary.click();
  await expect(page.getByRole('heading', { name: /Wat wordt verdedigd/ })).toBeVisible();
  await page.getByRole('radio', { name: /Maak de fietsenstalling groter/ }).click();
  await primary.click();
  await primary.click();

  await expect(page.getByRole('heading', { name: 'Sorteer op soort uitspraak, nog niet op waarheid.' })).toBeVisible();
  for (const [name, bucket] of [
    [/^De bus rijdt drie keer per uur/, '1'],
    [/^Een betrouwbare bus is belangrijker/, '2'],
    [/^Twaalf reizigers misten gisteren/, '1'],
    [/^Ook kleine dorpen verdienen/, '2'],
  ] as const) {
    await page.getByRole('button', { name }).press(bucket);
  }
  await primary.click();
  await primary.click();

  await expect(page.getByRole('heading', { name: 'Laat want of dus de juiste richting aangeven.' })).toBeVisible();
  const checkReason = page.getByRole('button', { name: 'Controleer de verbinding', exact: true });
  const swap = page.getByRole('button', { name: 'Wissel de zinnen', exact: true });
  await page.getByRole('radio', { name: 'want', exact: true }).click();
  await checkReason.click();
  await swap.click();
  await page.getByRole('radio', { name: 'dus', exact: true }).click();
  await checkReason.click();
  await page.getByRole('button', { name: 'Volgend zinnenpaar', exact: true }).click();
  await page.getByRole('radio', { name: 'dus', exact: true }).click();
  await checkReason.click();
  await swap.click();
  await page.getByRole('radio', { name: 'want', exact: true }).click();
  await checkReason.click();
  await expect(primary).toBeEnabled();
  await primary.click();

  await expect(page.getByRole('heading', { name: 'Raakt de reden het voorstel?' })).toBeVisible();
  await page.getByRole('radio', { name: 'Vrij looppad', exact: true }).click();
  await primary.click();
  await page.getByRole('radio', { name: /Een afweging van werking, kosten en alternatieven/ }).click();
  await primary.click();
  await primary.click();
  await page.getByRole('textbox', { name: /^Invulveld/ }).fill('argument');
  await primary.click();
  await primary.click();

  await page.getByRole('textbox', { name: 'Jouw tekst' }).fill('Ik stel voor om op dinsdag een extra studieruimte te testen, omdat er zes mensen moesten wachten bij twintig plekken. Toegang tot een studieplek vind ik belangrijk. Ik wil eerst onderzoeken of de drukte vaker voorkomt, of een andere ruimte beschikbaar is en hoeveel die kost.');
  await expect(primary).toBeDisabled();
  await page.getByRole('button', { name: 'Vergelijk met een voorbeeld', exact: true }).click();
  const review = page.getByRole('region', { name: 'Inhoudelijke zelfcontrole' });
  await expect(review).toContainText('Is het voorstel concreet?');
  await expect(review.getByRole('checkbox')).toHaveCount(3);
  for (const checkbox of await review.getByRole('checkbox').all()) await checkbox.check();
  await primary.click();
  await primary.click();
  await expect(page.getByRole('heading', { name: 'Hiermee heb je geoefend' })).toBeVisible();
});

test('de volledige argumentatielijn en eindcasus zijn vindbaar vanuit leren en de bibliotheek', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: /^Niveau 7: De alinea/ }).click();
  await openStages(page, ['Regels', 'Bachelor', 'Master']);
  await expect(page.getByRole('link', { name: /Van mening naar argument/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Oorzaak of alleen samenhang/ })).toBeVisible();
  const finalLesson = page.getByRole('link', { name: /Eindcasus: verdedig, toets en herzie/ });
  await expect(finalLesson).toHaveAttribute('href', '/les/a35');
  await finalLesson.click();
  await expect(page.getByRole('heading', { name: 'Parkplein: vier zaterdagen anders inrichten' })).toBeVisible();
  await expect(page.getByText(/volledig fictief oefendossier/)).toBeVisible();

  await page.goto('/lessen?niveau=alinea');
  await expect(page.getByRole('link', { name: /Eindcasus: verdedig, toets en herzie/ })).toHaveAttribute('href', '/les/a35');
  await expect(page.getByRole('link', { name: /Schrijf een overtuigend en eerlijk betoog/ })).toBeVisible();
});
