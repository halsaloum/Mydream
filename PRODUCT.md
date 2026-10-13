# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Volwassen leerlingen die Nederlands op moedertaalniveau lezen en verstaan, maar de **schrijftaal** willen beheersen: foutloos spellen, precieze woorden kiezen, sterke zinnen bouwen en samenhangende alinea's schrijven. De primaire gebruiker is de eigenaar van het product zelf. Ze oefenen in korte, regelmatige sessies (dagdoel 5–20 minuten) op telefoon en laptop.

Omdat lees- en luistervaardigheid al op moedertaalniveau zijn, hoeft de interface niet vereenvoudigd of kinderlijk te zijn: de leerling wil precisie en uitleg van het *waarom*, niet aanmoediging zonder inhoud.

## Product Purpose

pennig leert schrijven van taalbasis tot zelfstandig betoog, in zeven bouwlagen (letter, klank en letter, lettergreep, woorddeel, woord, Zinnen, alinea). Zinnen verenigt woordgroepen, enkelvoudige en samengestelde zinnen in één afdeling. De leerroute bouwt op van uitleg en begeleid oefenen naar toepassing, bewijsbeoordeling, tegenargumenten en drogredenen. Elke les heeft een leerdoel, aanpak en zelfcontrole. Specialistische taalkunde is keuzeverdieping.

Succes: de leerling maakt aantoonbaar minder schrijffouten en kan uitleggen waarom iets zo geschreven wordt.

## Positioning

Niet een losse verzameling taalregels, maar één doorlopende constructie: hetzelfde voorbeeld groeit zichtbaar van letter (`b`) tot alinea, en elke les hoort bij precies één laag en één domein. Uitleg is interactief (knippen, markeren, bouwen, wisselen) in plaats van alleen tekst.

## Operating Context

- De actieve cursus bevat 138 lessen via het inhoudscontract (`src/content/schema.ts`, JSON Schema in `content/schema/`).
- De 113 bestaande lessen zijn uitgebreid; negen schrijfmodules en zestien argumentatielessen vullen de leerroute aan.
- Zinnen voegt twaalf praktische modules met 120 bouw- en reparatieopdrachten toe. Elke module doorloopt ontdekking, regels, begeleid bouwen, zelfstandige foutreparatie en een persoonlijke spiekkaart. De dertig eerdere zinsbouwlessen en hun voortgang blijven beschikbaar als aanvullende oefening.
- Alle voortgang staat lokaal in de browser (localStorage); er is geen account of server.

## Capabilities and Constraints

- Schermen: onboarding, home ("Verder met jouw les", bouwlagen, recente voortgang), lesbibliotheek met filters, interactieve lesplayer, gerichte herhaling, voortgangsoverzicht, instellingen (geluid, beweging, lokale gegevens).
- Oefenvormen: uitleg met klikexperimenten, meerkeuze, invullen, woorden en zinnen ordenen, blokken wisselen, sorteren, lettergrepen knippen, letters en woorden markeren, woorden opbouwen, klinkerwiel, letters combineren, fouten verbeteren, herschrijven, alinea's ordenen, vrij schrijven met taakcriteria.
- Elke interactie werkt met aanraken, muis en toetsenbord; slepen heeft altijd een klik- of knopalternatief.
- Een les is rechtstreeks via de URL te openen en hervat na verversen.
- Verbeter lesinhoud didactisch en inhoudelijk: vertrek bij ontbrekende voorkennis, leg begrippen uit, oefen gevarieerd en laat toepassen op nieuwe situaties.
- Beoordeel vrije teksten eerlijk: automatische vormchecks bewijzen geen inhoudelijke kwaliteit. Gebruik voorbeeldantwoorden en expliciete eigen controle; presenteer afronding niet als bewezen beheersing.
- Stack ligt vast: Next.js App Router, React, TypeScript (strikt), Base UI, Tailwind CSS, Motion, dnd-kit, Zustand, Zod, Lucide, canvas-confetti, three.js (3D), Web Audio, Vitest, Testing Library, Playwright.

## Brand Commitments

- Naam **pennig**; mascotte **Pim het potlood** (geel potlood met rode dop).
- Lichte achtergrond met witte kaarten, royale afgeronde hoeken, duidelijke randen en tastbare slagschaduwen.
- Groen, blauw, paars en oranje als samenhangende accenten (de vier domeinen); felle kleuren blijven accenten, tekst krijgt passende donkere kleuren.
- Typografie: Fraunces (taalvoorbeelden), Bricolage Grotesque (koppen), Figtree (interface).
- Toon: volwassen en vriendelijk; grote, goed leesbare taalvoorbeelden met rustige ondersteunende tekst.

## Evidence on Hand

- 138 lessen in 9 bouwlagen en 7 vakgebieden via `src/content/catalog.ts`, inclusief begeleiding, toepassingsopgaven en argumentatie. Het groeiende voorbeeld per laag staat in `src/content/legacy/layer-examples.ts`.
- Er zijn geen gebruikersresultaten, testimonials of statistieken; toon nooit verzonnen voortgang of resultaten.

## Product Principles

1. Precisie boven aanmoediging: feedback legt uit waarom iets goed of fout is en blijft staan tot de leerling verdergaat.
2. Eén doorlopende constructie: elke les en elk voorbeeld laat zien op welke bouwlaag en in welk domein het zit.
3. Doen boven lezen: uitleg wordt pas begrepen door ermee te experimenteren.
4. Fouten zijn materiaal: wat misgaat, komt gericht terug in de herhaling.
5. Inhoud, beoordeling, voortgang en presentatie blijven gescheiden, zodat nieuwe lessen zonder codewijziging kunnen worden aangesloten.

## Accessibility & Inclusion

WCAG 2.2 AA: tekstcontrast minimaal 4,5:1, volledige toetsenbordbediening met zichtbare focus, aanraakdoelen van minimaal 44 px, schermlezer-meldingen bij feedback, en respect voor verminderde beweging (systeemvoorkeur én een bewaarde instelling voor rustige beweging, inclusief confetti, tellers en scrollen).
