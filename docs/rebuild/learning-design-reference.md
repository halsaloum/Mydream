# Ontleed — van dashboard naar leren

Ontwerpherziening van 15 oktober 2026. De gebruiker vroeg expliciet om de dashboardvorm te vervangen en Mobbin en Figma te gebruiken, met Uber Base, Brilliant en Duolingo als referenties. De nieuwe schermen zijn gemaakt als oorspronkelijke Ontleed-ontwerpen. Argumentatie en drogredenen vallen buiten deze herziening.

## Bekeken referenties

- [Uber Base — publieke startpagina](https://base.uber.com/6d2425e9f/p/294ab4-base-design-system) en [Design language](https://base.uber.com/6d2425e9f/p/76be65-design-language): visueel geïnspecteerd in de browser. Overgenomen ontwerpprincipes: sterke zwart-withiërarchie, helder ritme, sober gebruik van kleur en een samenhangend systeem van herbruikbare onderdelen. De verdiepende pagina Color 2.0 vraagt SSO; die inhoud is niet gelezen. De Ontleed-kleuren hieronder zijn eigen keuzes, geen gereconstrueerde officiële Uber-tokens.
- [Brilliant — Completing a lesson, Mobbin](https://mobbin.com/flows/369d4cef-f048-4f5e-a0b2-7fd5f343f3fc): daadwerkelijk geretourneerde voorbeeldschermen bekeken, waaronder de gecentreerde vraag, interactieve illustratie, gesegmenteerde voortgang en uitleg na een keuze. Het bruikbare patroon is eerst onderzoeken, dan antwoorden en feedback begrijpen.
- [Brilliant — Completing a prompted practice, Mobbin](https://mobbin.com/flows/46d332b0-92f6-4779-832a-03232e0bbb0a): bekeken vraag- en uitlegtoestanden; zwarte hoofdactie en uitleg op aanvraag.
- [Duolingo — Learn, Mobbin](https://mobbin.com/flows/ac9818fd-73fc-4efb-8b9b-6c4e506613a4): de drie geretourneerde schermen bekeken. De lesroute toont duidelijk welke stap aan de beurt is. Ontleed gebruikt dat principe zonder extra statistiekpanelen, advertenties of competitiewidgets.
- [Duolingo — Completing a lesson, Mobbin](https://mobbin.com/flows/d27dcac0-e266-49cc-8133-abbf05fb5b74): bekeken route- en afrondingsschermen als context voor de terugkeer naar het leerpad.

Na de aanmelding door de gebruiker zijn de Brilliant-lesflow en het Duolingo-leerpad ook in de ingelogde Mobbin-browser geopend en visueel bekeken. De Mobbin-beelden zijn alleen als referentie bekeken. De Figma-schermen bevatten geen gekopieerde screenshots, mascottes of beeldmerken. Figtree is de bestaande appfont; Uber Move is niet gekopieerd of verondersteld beschikbaar.

## Interactie en indeling

Het leerpad heeft een smalle bovennavigatie met Leren, Oefenen, Bibliotheek en Meer. In een gecentreerde kolom van maximaal 720 px kies je Woord, Zin of Alinea en het relevante onderdeel. De huidige les ontvouwt met de inhoudelijke belofte en één zwarte hoofdactie. Eerdere en volgende lessen blijven als rustige, aanklikbare stappen zichtbaar. Volgende lessen worden niet kunstmatig vergrendeld.

Een les krijgt een eigen sessieweergave: sluiten, zes voortgangssegmenten en de huidige fase bovenaan; één leerhandeling centraal; de hoofdactie onderaan. De bestaande fasen blijven Ontdekken, Begrijpen, Experiment, Zelf oefenen, Toepassen en Terugblik. Een gekozen antwoord krijgt een zwarte rand. Groen geeft voortgang of bevestigde feedback aan. Een fout antwoord houdt ruimte voor uitleg en een nieuwe poging.

De Figma-les gebruikt bestaande inhoud uit De naamwoordgroep: “Welke werkwoordsvorm past bij het volledige onderwerp?” met “De doos met de nieuwe labels … klaar.” en de keuzes staat/staan. De zichtbare selectie in de ontwerpspecificatie is een voorbeeldtoestand, geen gewijzigde beoordelingsregel.

## Ontwerptokens

| Rol | Waarde |
| --- | --- |
| Canvas | #FFFFFF |
| Primaire tekst en actie | #161616 |
| Secundaire tekst | #666666 |
| Zacht vlak | #F5F5F4 |
| Rand | #E5E5E3 |
| Leeraccent | #25B55B |
| Feedbackvlak | #ECF8EF |
| Leesbare groene tekst | #176B36 |
| Lettertype | Figtree |
| Typegroottes | 13, 16, 18, 22, 28, 32, 40 px |
| Afstandsritme | 8 px, met 16, 24 en 32 px stappen |
| Hoekradius | 12 px voor keuzes; pilvorm voor hoofdacties |

Gebruik donkere tekst op het heldergroene huidige lesknooppunt. Wit op het heldere groen heeft onvoldoende contrast voor gewone tekst. Witte knoptekst staat op de zwarte hoofdactie.

## Bewerkbare Figma-oplevering

Bestaand bestand: [Ontleed](https://www.figma.com/design/KqCG5Jvjc7mmjvbnfdHpRC?node-id=11-81). De eerdere Page 1 is behouden. De nieuwe pagina heet **Leren — Base × Brilliant**.

| Onderdeel | Figma-node |
| --- | --- |
| [Leerpad desktop](https://www.figma.com/design/KqCG5Jvjc7mmjvbnfdHpRC?node-id=11-112) | 11:112 — 1280 × 1100 |
| [Naamwoordgroep desktop](https://www.figma.com/design/KqCG5Jvjc7mmjvbnfdHpRC?node-id=11-113) | 11:113 — 1280 × 900 |
| [Naamwoordgroep mobiel](https://www.figma.com/design/KqCG5Jvjc7mmjvbnfdHpRC?node-id=11-114) | 11:114 — 390 × 844 |
| [Componenten en tokens](https://www.figma.com/design/KqCG5Jvjc7mmjvbnfdHpRC?node-id=11-115) | 11:115 |

De pagina bevat 22 variabelen: acht primitieve kleuren, acht semantische kleuraliasen en zes geometriewaarden. Alle variabelen hebben expliciete scopes en CSS-codeverwijzingen. Zeven Figtree-tekststijlen dragen de vaste hiërarchie. Vier componentfamilies bevatten twaalf toestanden: Button, Choice, Path node en Progress segment. Componenten zijn buiten de schermen geplaatst; schermen gebruiken gekoppelde instanties.

De huidige lesactie op het leerpad is gekoppeld aan de desktoples; sluiten gaat terug. Dit is een beperkte navigatieproef in Figma. De werkelijke beoordeling, opslag en leslogica blijven onderdeel van de app.

Exacte IDs, variabelen, stijlen en validatiegegevens: [learning-figma-state.json](learning-figma-state.json).

## Verificatie

Alle drie schermen zijn in Figma gerenderd en visueel gecontroleerd. Bij de eerste controle bleken enkele meerregelige tekstvakken een te kleine hoogte te hebben. Die zijn gericht hersteld en opnieuw gecontroleerd. Het actieve lesnummer is voor contrast aangepast naar donkere tekst; de betrokken schermen zijn daarna opnieuw bekeken.

De drie schermen bevatten uitsluitend bewerkbare tekst, frames, vectoren en componentinstanties, zonder IMAGE-vullingen. Alle tekst gebruikt Figtree. De mobiele les past met volledige vraag, zin, twee antwoordkeuzes en de hoofdactie binnen 390 × 844 px. De componentencontrole laat de twaalf toestanden samen zien.

Lokale visuele referenties: [leerpad](../../output/rebuild/figma-learning-path.png), [desktoples](../../output/rebuild/figma-learning-lesson.png), [mobiele les](../../output/rebuild/figma-learning-mobile.png) en [componenten](../../output/rebuild/figma-learning-components.png).


## Lokale implementatie

De app gebruikt dezelfde semantische kleurtokens als de Figma-specificatie, onder de afgeschermde `.ontleed`-root. De nieuwe bestanden `learning-shell.css`, `learning-support.css` en `focused-lesson.css` gebruiken deze variabelen. De globale vormgeving van argumentatie is niet aangepast.

Het daadwerkelijke leerpad kiest de laatst begonnen, nog niet afgeronde les, of de eerste onvoltooide les. De gebruiker kan het niveau en onderdeel wijzigen. Alle 68 lessen blijven via de bibliotheek bereikbaar. Het extra menu ondersteunt toetsenbordbediening, sluiten met Escape en sluiten na navigatie.

De les behoudt het aantal echte stappen (bij deze les twaalf), met de zes fasen daarnaast zichtbaar. Dit verfijnt de vereenvoudigde fasevoortgang uit het Figma-concept. Korte invulkeuzes worden direct op de open plek in de zin gezet; pas Controleer beoordeelt de keuze. De onderste actieplek wordt achtereenvolgens door Controleer en Verder gebruikt. De prototypes bevatten uitsluitend voorbeeldselecties, terwijl de app echte antwoorden, herkansingen en opgeslagen sessies gebruikt.
