# Eindcontrole

## Rechtstreekse boekencontrole en gestructureerde uitleg — 16 oktober 2026

De inhoudelijke hoofdstukken van de vijf aangeleverde boeken zijn gelezen en bij de herziening gebruikt. Het [leesverslag](book-review-2026-10-16.md) onderscheidt daadwerkelijke hoofdstuklezing, visuele controle, OCR-beperkingen en niet-integrale dekking van oefeningen en voor-/nawerk. Alle 68 lessen / 204 uitlegonderdelen hebben een eigen kern, precies drie inhoudelijke denkstappen, woordenhulp waar passend, een onthoudregel en gerichte bronankers. De bestaande uitgebreide uitleg blijft als verdieping beschikbaar.

| Controle | Resultaat |
| --- | --- |
| Volledige codecontrole | `npm run check` geslaagd: routetypen, TypeScript, volledige ESLint en 1.275 tests in 111 bestanden |
| Definitieve browsercontrole | 60/60 geslaagd op desktop en Pixel 7: `book-explanations`, `clear-lessons`, `ontleed`, `learning-media`, `guided-learning`, `workbench` |
| Extra inhoudelijke regressie | 217/217 gerichte controles voor uitlegdata, curriculum, behoud en hoeveelhedenmodel geslaagd |
| Boek- en lesdekking | 204 onderdelen hebben eigen drie denkstappen en oplosbare broncatalogusverwijzingen; alle vijf boeken komen in de specifieke uitlegbronnen terug |
| Brongedreven correcties | Getal versus tijd, plaats van onderwerp t.o.v. werkwoordstang, persoonsbenoemend -er, gebonden basis, komma-afbakening, boekverwijzingen, besproken tijd en bestaanstoets versus meervoud |
| Visuele controle | Actuele woordbouw-, vorm/functie- en betekenisvoorbeelden op desktop en mobiel; geen overlap of horizontale overflow; bestanden onder `output/book-review` |
| Productiebuild | Niet opnieuw uitgevoerd voor deze herziening; browsercontroles gebruikten de bestaande lokale ontwikkelserver op poort 3000 |

Een eerste brede browserronde onderbrak na een gelijktijdig uitvoeringsgat van ongeveer zestien minuten in beide workers. Een gerichte herhaling slaagde 4/4; daarna slaagde de volledige set 60/60 zonder testaanpassingen of retries. De precieze oorzaak van dat uitvoeringsgat is niet vastgesteld; de eerste timeout is geen bewezen productfout. De definitieve resultaten hierboven komen uit de volledige geslaagde herhaling.


## Duidelijkere en interactieve lessen — 16 oktober 2026

Alle 68 lessen / 204 theorieonderdelen hebben een eigen korte uitleg in gewone taal en een inhoudelijke mini-check met directe feedback. Voorbeelden verschijnen één voor één; het screenshotvoorbeeld heeft afzonderlijke knoppen voor vorm, functie en betekenis. De uitgebreide theorie blijft uitklapbaar. Notities zijn optioneel; bekeken voorbeelden en het antwoord op de mini-check worden apart opgeslagen, zonder de zelfstandige oefenscore te veranderen. Oude onthulde theorie blijft toegankelijk.

- `npm run check`: TypeScript, volledige ESLint en alle 1.270 tests in 110 bestanden geslaagd.
- Playwright op de ontwikkelserver: 40 van 40 gevallen geslaagd op desktop en Pixel 7; `clear-lessons`, `ontleed`, `learning-media` en `guided-learning`.
- Controle van alle 204 inhoudelijke koppelingen, met extra inhoudelijke audit van samenvattingen en foutalternatieven tegenover de lesvoorbeelden.
- Browsercontrole omvat korte notities, herladen, migratie van oudere sessies, toetsenbordbediening, alle zeven cursusdelen, volledige les/herhaling en optionele video. Geen horizontale overflow.
- Visuele controles en afbeeldingen staan in `output/clarity`. Er is voor deze wijziging geen nieuwe productiebuild uitgevoerd; de onderstaande bouwresultaten horen bij eerdere opleveringen.


## Illustraties en videouitleg — 15 oktober 2026

Toegevoegd: drie lokale unDraw-illustraties in het leerpad en de bibliotheek, plus negen Nederlandstalige YouTube-video’s bij veertien lessen. De videomodule verschijnt na de eerste onthulde theorie en in de leesweergave. Afspelen is optioneel en verandert geen leerresultaten. Bronnen: [videoselectie](media-sources.md) en [illustraties](../../public/illustrations/ontleed/ATTRIBUTION.md).

| Controle | Resultaat |
| --- | --- |
| Productiebuild en TypeScript | `npm run build -- --webpack` geslaagd; 181 statische pagina’s |
| ESLint | Volledige repository geslaagd |
| Gerichte unit-/behoudcontrole | 10 tests geslaagd: videolifecycle, bestaande leerinteracties en argumentatiebehoud |
| Definitieve browsercontrole | 30 van 30 geslaagd op poort 3141; vier suites op desktop en Pixel 7 |
| Media-interactie | Geen iframe vóór klikken, één speler tegelijk, sluiten verwijdert de speler, externe link blijft beschikbaar, thumbnail- en laadfout hebben een bruikbare terugval |
| Leergedrag | Video ontbreekt tijdens ontdekken en vóór de eigen voorspelling; verdergaan is niet afhankelijk van kijken |
| Visuele controle | Drie cursusillustraties, bibliotheek en videomodule op desktop/mobiel; geen horizontale overflow |
| Externe speler | Werkelijke naamwoordgroep-video via de browser geladen: YouTube toonde de juiste maker, titel en afspeelknop; daarna gesloten. De geautomatiseerde lifecycle-test gebruikt bewust een lokale iframe-respons en bewijst geen volledige videoweergave. |
| SVG-assets | Drie bestanden, circa 47 KB totaal; geen scripts, eventhandlers, externe verwijzingen of ingebedde rasterafbeeldingen |

De volledige unit-suite is voor deze beperkte media-uitbreiding niet opnieuw uitgevoerd. De gerichte tests controleren de gewijzigde componenten en behoudcontracten; de browsercontrole bevat ook de bestaande volledige les-, herhaal-, schrijf- en zoekflows. Voorbeelden van de definitieve productieversie staan in `output/media/leerpad-preview.png` en `output/media/naamwoordgroep-video.png`. De eerdere Figma-pagina is niet bijgewerkt met deze aanvullende media.

## Begeleide leerervaring — 15 oktober 2026

De actuele versie vervangt het dashboard door een leerpad en een gerichte lesweergave. De definitieve productiebuild draait lokaal op poort 3141. Mobbin is via de connector én de ingelogde browser bekeken; de bewerkbare Figma-oplevering staat op de pagina [Leren — Base × Brilliant](https://www.figma.com/design/KqCG5Jvjc7mmjvbnfdHpRC?node-id=11-81).

| Controle | Resultaat |
| --- | --- |
| Unit- en contracttests | Volledige run: 1.260 geslaagd en één verouderde navigatieverwachting. Die verwachting is aangepast aan drie nieuwe navigatielinks; daarna alle 10 tests van dat bestand en de 3 behoudtests geslaagd. Daarmee zijn alle 1.261 tests gedekt door de volledige run en gerichte herhaling. |
| Gerichte lescontroles | 26 unit/state-tests en vier volledige desktop/mobiele les- en vergelijkingsflows geslaagd tijdens de implementatie |
| TypeScript en productiebuild | `npm run build -- --webpack` geslaagd; 181 statische pagina’s |
| ESLint | `npm run lint` geslaagd na de laatste bronwijzigingen |
| Definitieve browsercontrole | 26 van 26 geslaagd op de productiebuild: `ontleed.spec.ts`, `workbench.spec.ts` en `guided-learning.spec.ts`, desktop en Pixel 7 |
| Argumentatie | Vier bestaande overzicht-/analyseflows geslaagd op de productiebuild, desktop en mobiel; de laatste bibliotheek- en les-CSS-correctie raakt deze routes niet |
| Behoud | Alle 107 beschermde bestanden ongewijzigd; 69 hedendaagse en 16 oudere opgeloste lessen blijven gelijk aan de opgeslagen momentopnamen |
| Figma | Drie bewerkbare schermen, 22 variabelen, zeven tekststijlen en vier componentfamilies met twaalf toestanden; visueel gecontroleerd |
| Schermformaten | Leerpad, les en ondersteunende pagina’s op desktop/mobiel gecontroleerd. Extra lescontrole op 1280 × 720, 1280 × 840 en 390 × 844; geen horizontale overflow |

De nieuwe tests controleren niveau- en onderdeelkeuze, één hervatbare lesactie, toetsenbordbediening van Meer, zoeken en wissen, echte navigatie, terug/vooruit en herladen. De overige browserflows blijven volledige lessen, herstelvragen, voorspellingen, labs, herhaling, eigen schrijfwerk en reservekopieën controleren.

De eerste eindcontrole vond een echte zoekrace: een vertraagde router-update kon een gewiste zoekterm terugzetten. Bibliotheekfilters gebruiken nu de actuele browser-URL zonder concurrerende servernavigaties. De regressie is uitgebreid met leslinks en browsergeschiedenis; de volledige set van 26 browsergevallen slaagde daarna op de opnieuw gebouwde productieversie.

Een gewone laptophoogte van 720 px toonde aanvankelijk een kleine overlap tussen de antwoordtegels en de vaste actiebalk. Compactere verticale afstanden op korte desktops lossen dat op; de mobiele en hogere desktopindeling blijft behouden. De definitieve productiescreenshots staan in `output/rebuild`, waaronder `desktop-focused-lesson.png` en `mobiel-focused-lesson.png`.

Zie [de ontwerpverantwoording](learning-design-reference.md) voor bronnen, ontwerpkeuzes en het verschil tussen de Figma-voorbeeldtoestand en echte opgeslagen leersessies. De inhoudelijke beperkingen uit de eerdere herwerking blijven gelden; deze ontwerpherziening bewijst geen leerwinst.

## Herwerking woord, zin, alinea — 15 oktober 2026

De inhoudelijke herwerking is lokaal gecontroleerd op poort 3141 vóór de bovenstaande ontwerpherziening. De eerdere reconstructie staat afzonderlijk hieronder.

| Controle | Resultaat |
| --- | --- |
| Volledige Vitest-suite | 108 bestanden, 1.260 tests geslaagd met `npm run test -- --maxWorkers=2` |
| Laatste redactionele wijzigingen | Alle 209 curriculum- en behoudtests opnieuw geslaagd na het bevriezen van de lesinhoud |
| Curriculum | 68 lessen, 204 theorieonderdelen, 340 oefeningen, 169 herhaalvragen; alle lessen bevatten ten minste één typ- of bouwvraag bij ophalen |
| TypeScript en routes | Geslaagd in de definitieve productiebuild |
| ESLint | Volledige repository geslaagd na de laatste zoekcorrectie |
| Productiebuild | `npm run build -- --webpack` geslaagd; 181 statische pagina’s gegenereerd |
| Nieuwe/herziene browserflows | 20 van 20 geslaagd op de definitieve productiebuild: 10 scenario’s op desktop en Pixel 7 |
| Bestaande argumentatieflows | Overzicht/zoeken en volledige analyse met schrijfwerk/sessieherstel: 4 van 4 geslaagd op de ontwikkelserver, desktop en Pixel 7 |
| Beschermde argumentatie | Alle 107 bestanden ongewijzigd; alle 69 hedendaagse en 16 oudere opgeloste lessen gelijk aan de opgeslagen momentopnamen |
| Visuele controle | Homepage, les, bibliotheek, voortgang en werkplaats op desktop/mobiel; definitieve productiebeelden in output/rebuild |
| Repository | `git diff --check` geslaagd; tijdelijke pdf-extracten en tussentijdse screenshots verwijderd |

De browserflows omvatten volledige les en herhaling, onveranderlijke eerste antwoorden, reparatie vóór transfer, bewaarde voorspellingen en labs, eigen tekst na herladen, volledige reservekopie, de tien alinealessen, niveau-/onderdeel-/zoekfilters, oude beschermde routes en geen horizontale overflow. Een extra regressie typt echte opeenvolgende toetsen tijdens vertraagde URL-navigatie; deze vond en verifieert het herstel van verloren zoekletters.

Tijdens gelijktijdige zware testprocessen overschreden drie bestaande tests hun tijdslimiet. De volledige suite slaagde daarna met twee workers, zonder die tests te wijzigen. De eerste alineafiltertest herlaadde vóór de URL-update; die test wacht nu op de bijgewerkte URL. Vervolgens zijn alle 20 browsergevallen samen op de definitieve productiebuild geslaagd.

De broncontrole en voorbeeldrevisie zijn aanvullend redactioneel werk. De tests controleren uitvoering en contracten; ze bewijzen geen leerwinst of volledige inhoudelijke juistheid. Zie [de herwerkingsverantwoording](woord-zin-alinea-revision.md) voor de grenzen van productiebewijs, vrije-tekstonderzoek en de niet uitgevoerde onderdelen uit de bouwbrief.

## Eerdere reconstructie — 15 oktober 2026

Gecontroleerd op 15 oktober 2026 in deze werkmap, met een lokale productiepreview op poort 3137.

| Controle | Resultaat |
| --- | --- |
| Volledige Vitest-suite | 106 bestanden, 1.212 tests geslaagd |
| Curriculum en broncontracten | 58 lessen, 174 theorieonderdelen, 290 zelfstandige oefeningen en 116 ophaalvragen gecontroleerd; toegelaten antwoorden door de werkelijke beoordelaar verwerkt |
| Beschermde argumentatie | Alle 107 eigen bestanden byte voor byte gelijk; alle 69 hedendaagse en 16 oudere opgeloste lessen gelijk aan de vooraf vastgelegde momentopnamen |
| TypeScript en routes | Geslaagd, ook tijdens de productiebuild |
| ESLint | Geslaagd |
| Productiebuild | `npm run build -- --webpack` geslaagd |
| Nieuwe Playwright-suite | Alle 12 gevallen geslaagd, verdeeld over desktop en Pixel 7 |
| Bestaande beschermde browserflows | 31 verschillende gevallen geslaagd; de bestaande muissleeptest slaat mobiel expliciet over |
| Visuele controle | Werkelijke homepage en les bekeken in Chrome op desktop en 390 × 844; definitieve PNG’s in output/rebuild |
| Figma | Bewerkbare overzichts- en lesframes visueel gecontroleerd; tekst Figtree; herbruikbare componenten en variabelen vastgelegd in figma-state.json |
| Repository | `git diff --check` geslaagd; ruwe boekextracten/OCR en gegenereerde bronbeelden opgeruimd |

De nieuwe browserchecks omvatten zoeken/filteren en URL-herstel, nul verzonnen voortgang, vervangen oude schrijfles-URL’s, de oorspronkelijke a20-player, alle fasen van een volledige les, eerste fout onveranderlijk na herladen, een gedeeltelijk en gecontroleerd classificatie-experiment na herladen, bewaarde vergelijkingsvarianten, schrijftekst en rubric, eenmalig afronden, uitleg herlezen zonder resultaten te wissen, en een ophaalronde zonder dubbel plannen. Een extra geval controleert dat uitsluitend historische niet-argumentatieresultaten geen oude vragen meer aanbieden via beschermde herhaalroutes.

De 32 geselecteerde bestaande argumentatie-/drogredengevallen leverden eerst 27 successen, één expliciete mobiele overslag en vier verstoorde desktop/mobiele runs op. Gelijktijdige browserruns deelden een trace-uitvoermap en veroorzaakten een ontbrekend tracebestand; drie andere gevallen overschreden onder die belasting hun tijdslimiet. De vier betrokken scenario’s zijn daarna op beide schermformaten met één worker en een eigen uitvoermap herhaald: alle acht herhalingen slaagden. Er zijn geen beschermde bestanden aangepast om tests te laten slagen. De oude test die niveautabs op de vervangen homepage verwacht, valt buiten deze selectie; de nieuwe homepage/bibliotheek worden door de nieuwe suite gecontroleerd.

Na de laatste CSS-correctie zijn de volledige eerste les en herhaling op beide schermformaten nogmaals geslaagd, inclusief een maximale breedte van 32 px voor de antwoordletter. Beide lesbeelden zijn daarna vernieuwd.

De browser beperkt zich tot representatieve werkende flows. De 58 lessen zijn niet stuk voor stuk van begin tot einde doorgeklikt; hun volledige gestructureerde inhoud en beoordelingsantwoorden vallen wel onder de inhoudscontroles. Tests bewijzen geen leerwinst of volledige taalkundige juistheid. Zie de bronlezing en redactionele notities voor de inhoudelijke onderbouwing.

In deze beheerde macOS-omgeving had Chromium uitvoering buiten de shell-sandbox nodig. De standaard Turbopack-build kon hier zijn lokale workerpoort niet openen; de uiteindelijke productiebuild is daarom met webpack uitgevoerd. Dit vergde geen wijziging aan de gedeelde fonts of beschermde vormgeving.
