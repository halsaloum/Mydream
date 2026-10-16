# Ontleed — woord, zin, alinea

Een Nederlandse leerapp voor woordbouw, zinsanalyse en betekenis, gebouwd met Next.js en React. De leerroute bevat **68 lessen in drie niveaus**: Woord, Zin en Alinea. De oorspronkelijke 58 lessen zijn uitgebreid met tien alinealessen; alle lessen gebruiken de vernieuwde oefenflow. De afzonderlijke cursus argumentatie en drogredenen blijft behouden.

| Deel | Lessen | Onderwerp |
| --- | ---: | --- |
| Het woord begrijpen | 4 | Woord, lexeem, woordsoort, vorm en functie |
| Woorden van binnen | 12 | Morfemen, afleiding, samenstellingen, paradigma’s en onderzoek |
| Wat hoort bij elkaar? | 12 | Constituenten, kernen, functies, argumenten en predicatie |
| De zin in elkaar | 12 | Nederlandse woordvolgorde, bijzinnen, verwijzing en informatieverdeling |
| Meer dan woorden | 14 | Betekenis, context, bereik, modaliteit, tijd en taalhandelingen |
| De volle zin | 4 | Combineren, leesbaarheid, revisie en zelfstandige toepassing |
| Van zin naar samenhang | 10 | Kernzin, cohesie, coherentie, thema-rhema, patronen, ritme en revisie |

Elke les begint met een ontdekking en bevat drie uitgebreide theorieonderdelen met uitgewerkte voorbeelden, een onderzoekslab, vijf zelfstandige oefeningen, eigen schrijfwerk met beoordelingscriteria en bronverwijzingen. Minstens twee andere opdrachten per les worden gebruikt voor later ophalen. De route telt 204 theorieonderdelen, 340 oefenvragen en 169 herhaalvragen. Iedere les bevat zelfstandige herhaalvragen, waaronder ten minste één typ- of bouwopdracht. Voor 33 oudere lessen is zo’n productieopdracht toegevoegd.

De lesplayer bewaart de leespositie, eerste antwoorden, schrijftekst en zelfbeoordeling. Alle 204 theorieonderdelen beginnen met een korte kern in gewone taal en drie inhoudelijke denkstappen, gevolgd door voorbeelden die je kunt wisselen en een mini-check met directe feedback. Een woordenhulp verklaart gebruikte vaktermen; een zichtbare onthoudregel vat het onderdeel samen. Ieder onderdeel toont gerichte bronverwijzingen achter een uitklapbare knop. De uitgebreide uitleg blijft uitklapbaar. Een eigen notitie is optioneel; bekeken voorbeelden en de mini-check worden apart bewaard en tellen niet mee als zelfstandige oefenscore. Eerder onthulde theorie blijft toegankelijk. Feedback verschijnt na een poging; fouten geven een aanwijzing en een nieuwe poging, terwijl het eerste antwoord behouden blijft. Keuzevragen, korte antwoorden, volgorde en markering hebben een expliciete beoordelaar; eigen schrijfwerk beoordeelt de lerende met criteria en een mogelijke uitwerking. Afronden vereist de oefeningen en een eigen toepassing met alle criteria, maar betekent geen bewezen blijvende beheersing. Gemiste vragen komen binnen de les terug en blijven in een foutenwachtrij staan. Herhalen gebruikt bewaarde rondes van maximaal acht vragen. Correcte productie zonder aanwijzing op verschillende dagen wordt apart bijgehouden; het is beperkt bewijs bij de gebruikte vragen. De intervallen van 1, 3, 7 en 21 dagen zijn productkeuzes.

De [nieuwe boekencontrole en uitlegopbouw](docs/rebuild/book-review-2026-10-16.md) beschrijft de rechtstreekse lezing van de vijf aangeleverde boeken, concrete inhoudelijke correcties en de grenzen van de broncontrole.

De [verantwoording van deze herwerking](docs/rebuild/woord-zin-alinea-revision.md) beschrijft de curriculumkaart, componenten, bronnen en resterende grenzen. Eigen tekst krijgt onderzoekshulp; de app geeft geen automatisch grammaticaoordeel over vrije tekst.

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
| `/` | Persoonlijk vervolg en de drie niveaus van het leerpad |
| `/lessen` | De 68 lessen; zoeken en filters via q, niveau, deel en status in de URL |
| `/les/[lessonId]` | Nieuwe lesplayer; a20–a35 openen de bewaarde argumentatielessen |
| `/herhalen` | Ophaalronde en blijvende foutenwachtrij, ook uit onvoltooide lessen, met hervatten |
| `/herhalen/argumentatie` | Bestaande kennischecks en oefenpunten voor argumentatie en drogredenen |
| `/voortgang` | Eigen eerste antwoorden, afgeronde lessen en begrippen om te herhalen |
| `/bronnen` | Boeken en hun bijdrage aan de lessen |
| `/oefenvormen` | Interactieve taalwerkplaats: zinsschema, paradigma, kwantoren, verwijzingen en eigen schrijftekst |
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

Het [nieuwe bewerkbare Figma-ontwerp](https://www.figma.com/design/KqCG5Jvjc7mmjvbnfdHpRC?node-id=11-112) bevat een begeleid leerpad, de geconcentreerde les op desktop en mobiel, 22 variabelen en vier componentfamilies met twaalf toestanden. De vormgeving gebruikt een witte basis, zwarte hoofdacties en groen voor leerstatus. De vaste zijbalk en dashboardkaarten zijn vervangen door een leerpad met één volgende stap. [Uber Base](https://base.uber.com/), [Brilliant](https://mobbin.com/flows/369d4cef-f048-4f5e-a0b2-7fd5f343f3fc) en [Duolingo](https://mobbin.com/flows/ac9818fd-73fc-4efb-8b9b-6c4e506613a4) zijn daadwerkelijk als referenties onderzocht. De [ontwerpverantwoording](docs/rebuild/learning-design-reference.md) legt de bronlezing, ontwerpkeuzes en Figma-componenten vast.

Het leerpad en de bibliotheek gebruiken drie lokaal opgeslagen unDraw-illustraties voor Woord, Zin en Alinea. Negen Nederlandstalige YouTube-video’s zijn aan veertien passende lessen gekoppeld. De optionele module verschijnt na de eerste onthulde theorie of in de leesweergave; de speler laadt alleen na een klik en heeft altijd een gewone YouTube-link. Kijken beïnvloedt de lesvoortgang niet. De [mediabronnen](docs/rebuild/media-sources.md) en [illustratievermelding](public/illustrations/ontleed/ATTRIBUTION.md) beschrijven herkomst en controle. De bestaande Figma-pagina toont het ontwerp vóór deze media-uitbreiding.

De [eindcontrole](docs/rebuild/validation.md) registreert de actuele verificatie en de afzonderlijk bewaarde resultaten van de eerdere reconstructie. De [reconstructieverantwoording](docs/rebuild/README.md) bundelt de eerdere documentdekking, OCR- en beeldbeperkingen en ontwerpkeuzes. De [ontwerpnotities](docs/rebuild/design-research.md) en de leesnotities voor [morfologie](docs/rebuild/morphology-reading.md), [syntaxis](docs/rebuild/syntax-reading.md), [betekenis](docs/rebuild/semantics-reading.md), de [Nederlandse leerlijn](docs/rebuild/dutch-curriculum-reading.md) en [alinea’s](docs/rebuild/alinea-reading.md) leggen de inhoudelijke keuzes vast. Aangeleverde boekbestanden en ruwe tekst-/OCR-extracten worden niet als app-inhoud meegeleverd.
