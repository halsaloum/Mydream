# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Volwassen leerlingen die Nederlands op moedertaalniveau lezen en verstaan, maar de **schrijftaal** willen beheersen: foutloos spellen, precieze woorden kiezen, sterke zinnen bouwen en samenhangende alinea's schrijven. De primaire gebruiker is de eigenaar van het product zelf. Ze oefenen in korte, regelmatige sessies (dagdoel 5–20 minuten) op telefoon en laptop.

Omdat lees- en luistervaardigheid al op moedertaalniveau zijn, hoeft de interface niet vereenvoudigd of kinderlijk te zijn: de leerling wil precisie en uitleg van het *waarom*, niet aanmoediging zonder inhoud.

## Product Purpose

pennig leert schrijven "van letter tot alinea": de taal wordt opgebouwd in acht bouwlagen (letter, lettergreep, woorddeel, woord, woordgroep, zin, samengestelde zin, alinea), elk bekeken vanuit vier domeinen (morfologie, syntaxis, semantiek, pragmatiek). Elke les combineert uitleg met klikexperimenten en oefeningen die direct beoordeeld worden; fouten komen later terug als gerichte herhaling.

Succes: de leerling maakt aantoonbaar minder schrijffouten en kan uitleggen waarom iets zo geschreven wordt.

## Positioning

Niet een losse verzameling taalregels, maar één doorlopende constructie: hetzelfde voorbeeld groeit zichtbaar van letter (`b`) tot alinea, en elke les hoort bij precies één laag en één domein. Uitleg is interactief (knippen, markeren, bouwen, wisselen) in plaats van alleen tekst.

## Operating Context

- Lesinhoud wordt apart uitgewerkt vanuit PDF's en later in de app geladen via het inhoudscontract (`src/content/schema.ts`, JSON Schema in `content/schema/`).
- Tot die tijd draait de app op de bestaande 26 lessen uit de oorspronkelijke app (ongewijzigd, als referentie en testmateriaal).
- Alle voortgang staat lokaal in de browser (localStorage); er is geen account of server.

## Capabilities and Constraints

- Schermen: onboarding, home ("Verder met jouw les", bouwlagen, recente voortgang), lesbibliotheek met filters, interactieve lesplayer, gerichte herhaling, voortgangsoverzicht, instellingen (geluid, beweging, lokale gegevens).
- Oefenvormen: uitleg met klikexperimenten, meerkeuze, invullen, woorden en zinnen ordenen, blokken wisselen, sorteren, lettergrepen knippen, letters en woorden markeren, woorden opbouwen, klinkerwiel, letters combineren, fouten verbeteren, herschrijven, alinea's ordenen, vrij schrijven met taakcriteria.
- Elke interactie werkt met aanraken, muis en toetsenbord; slepen heeft altijd een klik- of knopalternatief.
- Een les is rechtstreeks via de URL te openen en hervat na verversen.
- Schrijf geen nieuwe lessen, wijzig geen uitleg en bedenk geen curriculum.
- Stack ligt vast: Next.js App Router, React, TypeScript (strikt), Base UI, Tailwind CSS, Motion, dnd-kit, Zustand, Zod, Lucide, canvas-confetti, Web Audio, Vitest, Testing Library, Playwright.

## Brand Commitments

- Naam **pennig**; mascotte **Pim het potlood** (geel potlood met rode dop).
- Lichte achtergrond met witte kaarten, royale afgeronde hoeken, duidelijke randen en tastbare slagschaduwen.
- Groen, blauw, paars en oranje als samenhangende accenten (de vier domeinen); felle kleuren blijven accenten, tekst krijgt passende donkere kleuren.
- Typografie: Fraunces (taalvoorbeelden), Bricolage Grotesque (koppen), Figtree (interface).
- Toon: volwassen en vriendelijk; grote, goed leesbare taalvoorbeelden met rustige ondersteunende tekst.

## Evidence on Hand

- 26 lessen in 8 bouwlagen en 4 domeinen (`src/content/legacy/build.ts`), plus het groeiende voorbeeld per laag (`src/content/legacy/layer-examples.ts`).
- Er zijn geen gebruikersresultaten, testimonials of statistieken; toon nooit verzonnen voortgang of resultaten.

## Product Principles

1. Precisie boven aanmoediging: feedback legt uit waarom iets goed of fout is en blijft staan tot de leerling verdergaat.
2. Eén doorlopende constructie: elke les en elk voorbeeld laat zien op welke bouwlaag en in welk domein het zit.
3. Doen boven lezen: uitleg wordt pas begrepen door ermee te experimenteren.
4. Fouten zijn materiaal: wat misgaat, komt gericht terug in de herhaling.
5. Inhoud, beoordeling, voortgang en presentatie blijven gescheiden, zodat nieuwe lessen zonder codewijziging kunnen worden aangesloten.

## Accessibility & Inclusion

WCAG 2.2 AA: tekstcontrast minimaal 4,5:1, volledige toetsenbordbediening met zichtbare focus, aanraakdoelen van minimaal 44 px, schermlezer-meldingen bij feedback, en respect voor verminderde beweging (systeemvoorkeur én een bewaarde instelling voor rustige beweging, inclusief confetti, tellers en scrollen).
