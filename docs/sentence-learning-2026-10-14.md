# Zinnen leren binnen niveau 6

De volledige leerroute staat bij het zesde niveau van **Leren**, naast de bestaande toren van letter tot alinea. De aparte hoofdmenu-knop en startkaart voor Zinnen zijn verwijderd. De twaalf hoofdlessen bepalen de voortgang van dit niveau en de doorgaanknop. De dertig aanvullende zinslessen staan onder een uitklapbaar onderdeel, met verwijzingen naar de passende uitgebreide uitleg.

`/?niveau=zinnen#niveaus-titel` selecteert dit niveau. Lesafsluiting keert hiernaar terug. `/zinnen`, `/zinnen/les/zinnen-01` en de overige bestaande leslinks blijven beschikbaar. De historische samenvattingsroute `/zinnen/codex` blijft werken; de leerling ziet **Mijn samenvattingen**. Lesonderdelen heten **Ontdekken, Uitleg, Oefenen, Herstellen en Samenvatting**.

## Uitleg vanaf nul

Alle twaalf lessen hebben eigen, samenhangende uitleg: begrippen met betekenis en voorbeeld, vier uitgewerkte stappen met een volledige zin, veelvoorkomende misverstanden en een praktische schrijfopdracht met toelichting. De uitleg behandelt:

1. Woordgroepen, kernen, bepalingen en grenzen van zinsdelen.
2. Persoonsvorm, onderwerp, tijdproef en overeenstemming, met hoeveelheidvariatie.
3. Het hele werkwoordelijke of naamwoordelijke gezegde en de bepaling van gesteldheid.
4. Voorwerpen, vaste voorzetsels, bepalingen en de beperkingen van ontleedproeven.
5. Actief en passief, de grammaticale rollen en verschillende functies van *er*.
6. Zinsvelden, volledige zinsdelen, inversie, vraagbouw en bijzinbouw.
7. Werkwoordelijke eindgroepen, toegestane volgordes, scheidbare werkwoorden en vervangende infinitieven.
8. Hoofd- en bijzinnen verbinden, met aandacht voor reden, oorzaak, gevolg en voorwaarde.
9. De hele bijzin als bouwsteen in de grotere zin.
10. Het terugwijspunt van betrekkelijke vormen en de keuze tussen *die, dat, wat* en verwante vormen.
11. Verzwegen uitvoerders en zorgvuldig inkorten van zinnen.
12. Leestekens, grenzen en het betekenisverschil tussen beperkende en uitbreidende informatie.

De nieuwe inhoud is beoordeeld aan de hand van concrete E-ANS-paragrafen en taaladviezen van Onze Taal. Bronverwijzingen bij de bestaande lesregels blijven bereikbaar. De auteurs hebben elkaars uitleg beoordeeld. Daarbij zijn onder meer *terug* als werkwoord en een te algemene uitspraak over de persoonsvorm achteraan gecorrigeerd. Ook een eerdere aanvullende les over komma’s is verduidelijkt: een vooropgeplaatste bijzin eindigt niet noodzakelijk op zijn persoonsvorm.

## Interactie die begrip en toepassing vraagt

De uitleg heeft drie onderdelen: **Zo werkt het, Samen bekijken en Zelf proberen**. De leerling selecteert voorbeeldstappen en volgt gemarkeerde woorden in de hele zin. Een begripsvraag geeft pas na een eigen bevestigde keuze gerichte feedback. Zij telt niet mee als afgeronde les.

Bij de eigen schrijfopdracht komt eerst de eigen zin met verklaring. Daarna verschijnt een mogelijke uitwerking met uitleg en controlepunten. De leerling beoordeelt haar eigen tekst; de app presenteert vrije tekst niet als automatisch grammaticaal correct. Deze tekst blijft op het apparaat bewaard en verschijnt ook in de samenvatting.

De bestaande 120 beoordeelde opdrachten blijven beschikbaar: bouwen, verbanden leggen, transformeren, zelf grenzen bepalen en fouten aanwijzen vóór de reparatie-instructie verschijnt. Alleen tien daadwerkelijk opgeloste opdrachten ronden een hoofdles af. De samenvatting kan vanaf het begin gelezen worden. Bestaande les- en oefening-ID's, eerste pogingen, resultaten en hervatbare sessies blijven behouden. De nieuwe uitleg staat buiten de fingerprints van de beoordeelde lessen.

## Video en illustratie

Iedere les bevat een eigen lokale MP4-video van ongeveer 59 seconden: context, vier denkstappen en resultaat. De video's zijn stil en geven de uitleg met Nederlandse tekst, gemarkeerde voorbeelden en ondertiteling. Alle 48 volledige stapuitleggen staan in de VTT-tracks. Een leesbaar transcript en het interactieve voorbeeld bieden dezelfde inhoud in het eigen tempo van de leerling.

Video start op verzoek en heeft native pauze-, zoek- en volledigschermbediening. De bestaande contextfoto's, SVG-situaties en verplaatsende zinblokken blijven beschikbaar. De video's en overige assets vragen samen circa 7,8 MiB; ze worden niet vooraf volledig gedownload.

`scripts/generate-sentence-videos.mjs` maakt de twaalf clips, posters en ondertitels opnieuw met Chromium en FFmpeg. De generator controleert focusfragmenten, tekstpassing, het codecformaat en volledige decodering. `public/videos/zinnen/manifest.json` bevat de inhoudshash; de geleverde assets komen overeen met de huidige uitleg.

## Controle

TypeScript, ESLint en alle **970 tests in 96 bestanden** slagen. De productiebuild slaagt, inclusief de nieuwere argumentatiewijzigingen die al op de gebruikersbranch stonden. De volledige browsercontrole sluit af met **95 geslaagde tests en één verwachte overslag** voor een muisgebonden sleepcontrole op mobiel. Er zijn geen mislukte browsertests. De visuele controle op 375 en 1280 pixels bevestigt de leerroute, veranderende voorbeeldmarkeringen, videoweergave en eigen schrijfwerk zonder horizontale overflow of JavaScript-fouten.

De gerichte browsercontrole op desktop en mobiel slaagt voor de geïntegreerde leerroute, toetsenbordbediening, tien vereiste oplossingen, eerlijke eerste-pogingsscore, opslag van eigen schrijfwerk en bijpassende uitleg bij aanvullende oefeningen. Alle twaalf video's zijn op beide schermformaten daadwerkelijk afgespeeld met geladen Nederlandse ondertitels; alle videobestanden zijn ook volledig gedecodeerd. Media starten zonder autoplay.

Deze controles tonen inhoudelijke consistentie en werkend gedrag in de cloudomgeving. Zij meten geen leerwinst van de app en stellen geen blijvende beheersing vast. De eerdere door de gebruiker gemelde localhost-404 is niet onafhankelijk onderzocht op diens eigen computer; de corresponderende cloudroutes zijn in echte browsernavigatie gecontroleerd.

De eerdere brede lesaudit staat in `docs/lesson-audit-2026-10-14.md`. Nieuwere drogredenhoofdstukken die de gebruiker inmiddels aan de branch toevoegde zijn behouden; deze zinsaanpassing voert daar geen nieuwe handmatige lesaudit op uit.
