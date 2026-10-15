# Eindcontrole van de reconstructie

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
