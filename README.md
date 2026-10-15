# Ontleed — van woord tot volle zin

Een Nederlandse leerapp voor woordbouw, zinsanalyse en betekenis, gebouwd met Next.js en React. De nieuwe leerroute bevat **58 oorspronkelijke lessen**, geschreven nadat de zeven aangeleverde brondocumenten volledig als tekst waren gelezen. De afzonderlijke cursus argumentatie en drogredenen blijft behouden.

| Deel | Lessen | Onderwerp |
| --- | ---: | --- |
| Het woord begrijpen | 4 | Woord, lexeem, woordsoort, vorm en functie |
| Woorden van binnen | 12 | Morfemen, afleiding, samenstellingen, paradigma’s en onderzoek |
| Wat hoort bij elkaar? | 12 | Constituenten, kernen, functies, argumenten en predicatie |
| De zin in elkaar | 12 | Nederlandse woordvolgorde, bijzinnen, verwijzing en informatieverdeling |
| Meer dan woorden | 14 | Betekenis, context, bereik, modaliteit, tijd en taalhandelingen |
| De volle zin | 4 | Combineren, leesbaarheid, revisie en zelfstandige toepassing |

Elke les begint met een ontdekking en bevat drie uitgebreide theorieonderdelen met uitgewerkte voorbeelden, een onderzoekslab, vijf zelfstandige oefeningen, eigen schrijfwerk met beoordelingscriteria en bronverwijzingen. Twee andere opdrachten per les worden gebruikt voor later ophalen. De route telt 174 theorieonderdelen, 290 oefenvragen en 116 ophaalvragen.

De lesplayer bewaart de leespositie, eerste antwoorden, schrijftekst en zelfbeoordeling. Feedback verschijnt na een poging. Keuzevragen, korte antwoorden, volgorde en markering hebben een expliciete beoordelaar; eigen schrijfwerk beoordeelt de lerende met criteria en een mogelijke uitwerking. Afronden vereist de oefeningen en een eigen toepassing met alle criteria, maar betekent geen bewezen blijvende beheersing. Herhalen gebruikt nieuwe scenario’s in bewaarde rondes van maximaal acht lessen. De intervallen van 1, 3, 7 en 21 dagen zijn productkeuzes.

## Lokaal draaien en controleren

Node.js 20.9 of hoger en npm zijn vereist. Installeer de vastgelegde afhankelijkheden uit package-lock.json:

```bash
npm ci
npm run dev
```

De ontwikkelserver draait op http://localhost:3000. Voor productie:

```bash
npm run build -- --webpack
npm run start
```

| Opdracht | Controle |
| --- | --- |
| `npm run check` | Typecheck, ESLint en alle unit-/componenttests |
| `npm run typecheck` | Next-routetypen en TypeScript |
| `npm run lint` | ESLint |
| `npm run test` | Vitest, inclusief curriculum, voortgang en behoud |
| `npm run content:check` | Inhoudscontracten van het nieuwe leerpad en het bewaarde archief |
| `npm run test:e2e` | Playwright op een productiebuild, desktop en mobiel |

Gerichte controles voor de reconstructie:

```bash
npx vitest run src/content/ontleed src/state/ontleed.test.ts
npx playwright install chromium
npm run test:e2e -- e2e/ontleed.spec.ts
```

Playwright bouwt en start standaard op poort 3123. Gebruik een bestaande server met `E2E_BASE_URL=http://localhost:3000 npm run test:e2e`. De afzonderlijke argumentatie- en drogredentests blijven in e2e/ staan. Gebruik bij gelijktijdige browserruns een eigen `--output`-map, zodat het opruimen van traces geen andere run verstoort. De productiebuild is in deze omgeving met webpack geverifieerd.

## Schermen en opslag

| Route | Gedrag |
| --- | --- |
| `/` | Persoonlijk vervolg en de zes delen van het leerpad |
| `/lessen` | De 58 lessen; zoeken en filters via q, deel en status in de URL |
| `/les/[lessonId]` | Nieuwe lesplayer; a20–a35 openen de bewaarde argumentatielessen |
| `/herhalen` | Ophaalronde uit afgeronde nieuwe lessen, met hervatten |
| `/herhalen/argumentatie` | Bestaande kennischecks en oefenpunten voor argumentatie en drogredenen |
| `/voortgang` | Eigen eerste antwoorden, afgeronde lessen en begrippen om te herhalen |
| `/bronnen` | Boeken en hun bijdrage aan de lessen |
| `/oefenvormen` | Gereedschap en vergelijkbare notaties voor taalanalyse |
| `/instellingen` | Dagdoel, rustige beweging, export/import en het nieuwe leerpad wissen |
| `/argumentatie` | De bestaande cursus met 69 lessen argumentatie en drogredenen |
| `/argumentatie/les/[lessonId]` | De bestaande argumentatieplayer |

Oude woord- en zinnenroutes verwijzen naar het passende deel van de nieuwe bibliotheek. Vervangen schrijfles-id’s bieden hun oude les niet meer aan. Bestaande argumentatieroutes, argumentatiedemo’s en de oudere lessen a20–a35 blijven bruikbaar. De oude introductie verwijst naar het nieuwe leerpad; vervangen taaldemo’s worden niet meer aangeboden.

De nieuwe gegevens staan lokaal onder `pennig:ontleed-v1`. Export via Instellingen bevat zowel Ontleed als bestaande gegevens, waaronder argumentatie. Import valideert eerst; een oudere export zonder Ontleed-veld laat de nieuwe leerpadgegevens behouden. Het wissen in de nieuwe instellingen betreft alleen Ontleed. De oorspronkelijke opslag- en overdrachtscode blijft beschikbaar voor bestaande gegevens.

## Inhoud en bewaard archief

- src/content/ontleed/ bevat de nieuwe lessen, typen, broncatalogus en curriculum-/behoudtests.
- src/components/ontleed/ bevat de nieuwe schermen, SVG-illustraties en afgeschermde stijlen; src/lib/ontleed/ beoordeelt antwoorden en src/state/ontleed.ts bewaart sessies en herhaling.
- src/content/argumentation/, de bijbehorende componenten, beoordeling, voortgang en routes vormen de beschermde cursus.
- De oorspronkelijke catalogus, adapters, pakketten, lesengine en opslag blijven intern aanwezig voor historische vingerafdrukken, export/import, oude gegevens en de beschermde argumentatielessen. Hun aanwezigheid maakt vervangen lesmateriaal niet opnieuw onderdeel van de nieuwe publieke leerroute.

De behoudtest vergelijkt 107 beschermde bestanden byte voor byte via SHA-256 en controleert de volledige opgeloste inhoud van 69 hedendaagse en 16 oudere argumentatielessen tegen vooraf opgeslagen momentopnamen. Zie de [behoudgrens](docs/rebuild/preservation-boundaries.md).

## Ontwerp en bronverantwoording

Het [bewerkbare Figma-bestand](https://www.figma.com/design/KqCG5Jvjc7mmjvbnfdHpRC) bevat het lesoverzicht en een geconcentreerd lesscherm, met variabelen en herbruikbare componenten. De vormgeving gebruikt een wit vlak, Figtree, ruime zinvoorbeelden en eigen SVG-illustraties. De [Brilliant-cursusflow op Mobbin](https://mobbin.com/flows/acfd786d-367b-43d6-9058-14dff69bc8b2) en [quizflow](https://mobbin.com/flows/471e25d8-9d8d-481a-9337-0e284f2f9d13) zijn als interactie- en stijlinspiratie onderzocht.

De [eindcontrole](docs/rebuild/validation.md) registreert de geslaagde build, 1.212 unit-/componenttests, browserflows en visuele controle. De [reconstructieverantwoording](docs/rebuild/README.md) bundelt de dekking van alle zeven documenten, OCR- en beeldbeperkingen, ontwerpkeuzes en verificatiemethoden. De [ontwerpnotities](docs/rebuild/design-research.md) en de leesnotities voor [morfologie](docs/rebuild/morphology-reading.md), [syntaxis](docs/rebuild/syntax-reading.md), [betekenis](docs/rebuild/semantics-reading.md) en de [Nederlandse leerlijn](docs/rebuild/dutch-curriculum-reading.md) leggen de inhoudelijke keuzes vast. Aangeleverde boekbestanden en ruwe tekst-/OCR-extracten worden niet als app-inhoud meegeleverd.
