# Gedeelde leesmodus voor alle lesteksten

Elke lesplayer gebruikt dezelfde voorleesbediening: de 138 cataloguslessen, woord- en herhaalrondes, twaalf zinslessen en 69 argumentatielessen. De bediening is beschikbaar bij uitleg, opdrachten, zichtbare feedback en afronding. De regel- en aanpakvensters hebben hun eigen reader. Bestaande voortgang en les-ID's blijven behouden.

## Gebruik

Open **Leesmodus · grotere tekst en meelezen** om de actuele lesinhoud groter te bekijken. Dit start geen geluid. **Luisteren** start het voorlezen; pauzeren, hervatten, stoppen en fragmentnavigatie blijven beschikbaar. **Stem en tempo** biedt Nederlandse stemmen, proefluisteren en een apart leestempo van 0,6× tot **2×**. Stem en tempo worden op het apparaat bewaard. Het bestaande rustigere tempo voor klankvoorbeelden blijft apart instelbaar.

Het gesproken fragment krijgt een rand. Wanneer de stem een echte woordgrens meldt, markeert `react-highlight-words` precies dat woord, inclusief de juiste herhaling van een woord binnen dezelfde zin. De optionele volgfunctie schuift uitsluitend het leesvak; de pagina en toetsenbordfocus blijven op hun plaats. Rustige weergave voorkomt geanimeerd volgen.

## Bibliotheekkeuze en Next.js

Geïnstalleerd: **react-highlight-words 1.0.0**, met **highlight-words-core 2.0.0**. De npm-metadata verklaart ondersteuning voor React 19 en levert eigen TypeScript-types. De vastgezette versies en integriteitswaarden staan in het lockbestand. De daadwerkelijke component gebruikt de library met expliciete tekenbereiken; de tekst blijft gewoon React-inhoud en wordt niet via innerHTML herschreven.

De bestaande Nederlandse Web Speech-motor blijft verantwoordelijk voor het geluid, stemkeuze, fragmentering en onderbrekingen. Hij ondersteunt nu `onBoundary`, met oorspronkelijke UTF-16-woordposities, en een werkelijke snelheid tot 2×. Er worden geen woordtijden geschat. Oude callbacks van gestopte, vervangen of afgeronde utterances worden genegeerd. Pauzeren en hervatten kunnen een inmiddels gestopte opdracht niet opnieuw activeren. Stiltes bij contrastparen vallen tussen de oorspronkelijke teksten en niet tussen iedere interne zin.

Next.js levert de clientcomponenten en de app, niet de stemmen. De meegeleverde Next-documentatie over `use client` en browser-API's is geraadpleegd. `react-text-to-speech 5.1.10` is een onderhouden React 19-wrapper voor dezelfde browser-API; hij zou de reeds aanwezige spraakmotor en diens lifecycle dupliceren. `react-speech-kit 3.0.1` declareert alleen React 16 en is sinds 2022 niet gewijzigd. Daarom is alleen de bibliotheek voor tekstmarkering toegevoegd.

Een officiële Speechify-SDK bestaat, maar vereist een accounttoken en genereert aparte audio met woordtimings. Die dienst is niet gekoppeld en er worden geen API-sleutels in de browser gezet. De gebruiker verduidelijkte dat de gewenste functionaliteit leesmodus, woordmarkering, goede stemmen en 2× snelheid betreft.

## Leesdekking zonder vroegtijdige antwoorden

De reader verzamelt actuele zichtbare DOM-inhoud in leesvolgorde. Hij leest geen compleet lesobject: dat zou toekomstige antwoorden en verborgen modellen bevatten. Navigatie en de reader zelf worden uitgesloten. Inhoud in knoppen, tabelrijen, voorbeeldblokken, betekenisvolle beeldbeschrijvingen en vrijgegeven feedback blijft leesbaar. Invulplekken worden neutraal benoemd; eigen tekst in invulvelden wordt niet toegevoegd.

Antwoordlabels krijgen afzonderlijke fragmenten en aaneengesloten letterknoppen krijgen spaties. Zo worden opties en alfabetletters geen aaneengeplakte woorden; leestekens rond voorbeelden in gewone zinnen blijven behouden. Lange woorden kunnen in het leesvak over regels worden verdeeld.

Gesloten native details, bewaard gemonteerde uitklappers, transparante sleepkopieën en verborgen dicteewoorden blijven uitgesloten. Actieve stap- en uitlegdeelmarkeringen voorkomen dat een uitgaande animatie oude opdrachten laat meelezen. Een videotranscript komt pas in de reader na openen. De reader volgt wijzigingen, CSS-animatie-einden en overgangen, zodat vrijgegeven feedback na het zichtbaar worden ook meegenomen wordt. Dialoogverberging op een bovenliggende node stopt de achtergrondreader; sluiten herstelt de inhoud zonder autoplay.

Een browsertest ontdekte dat een uitlegkaart door haar verschijnanimatie pas na starten aan de tekst werd toegevoegd en daarmee de spraak onderbrak. Luisteren wacht nu op werkelijk afgeronde eindige animaties via de native Animation API; oneindige effecten en animaties van de reader blokkeren dit niet. De open steminstellingen blijven behouden bij tekstwijzigingen. Het voorleesblok staat in de gewone pagina, zodat het geen oefenknoppen bedekt. De bestaande sleeptest begint nu midden in het scherm: de eerdere startpositie vlak bij de onderrand activeerde automatisch scrollen en maakte het vooraf gemeten doel verouderd.

De controle vond daarnaast een bestaande DnD-fout in ontwikkeling: een vergrendelde opdracht veranderde de lengte van de sensorafhankelijkheden en veroorzaakte een React-waarschuwing. De sensoren blijven nu geregistreerd; de afzonderlijke doelen en callbacks respecteren de vergrendeling. Een regressietest controleert oefenen → feedback → nieuwe opdracht.

## Grenzen van de stem

De automatische keuze geeft voorkeur aan Nederlandse stemmen met namen als Natural, Premium of Enhanced. Dit is een metadataheuristiek, geen luisterbenchmark. De gebruiker kan de stemmen op het eigen apparaat uitproberen. Stemkwaliteit en beschikbare Nederlandse stemmen hangen van browser en apparaat af; sommige stemmen werken via een online browserdienst.

Niet iedere stem meldt woordgrenzen. Bij ontbrekende grenzen markeert de reader alleen het werkelijk gestarte fragment. Chrome kent volgens de officiële compatibiliteitsgegevens gedeeltelijke ondersteuning; een animatie op geschatte tijd zou daar geen echte synchronisatie opleveren. Als er geen Nederlandse stem beschikbaar is, blijft de vergrote leesmodus beschikbaar en benoemt de bediening waarom voorlezen niet kan starten. Sommige stemmen begrenzen ook de feitelijke afspeelsnelheid, ondanks de API-instelling 2×.

## Bronnen en verificatie

- npm-metadata en distributiecode van `react-highlight-words`, `react-text-to-speech`, `react-speech-kit` en `@speechify/api`, gelezen op 14 oktober 2026.
- [MDN: beschikbare stemmen](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices).
- [MDN: echte woord- en zinsgrenzen](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/boundary_event).
- [MDN: spreektempo](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/rate).
- Officiële MDN-bronbestanden en compatibiliteitsgegevens zijn via de oorspronkelijke GitHub-repositories gelezen; directe Speechify-documentatieverzoeken waren geblokkeerd, zodat daarvoor de officiële SDK-documentatie en types zijn gebruikt.

De dependency-installatie uit het lockbestand is uitgevoerd; bestaande optionele platformmetadata is daarna behouden en het uiteindelijke lockbestand is met `npm ci --dry-run` gevalideerd. `npm run check` slaagde met TypeScript, ESLint en **1.012 tests in 101 bestanden**. De uiteindelijke productiebuild slaagde. De browsertests gebruiken een controleerbare implementatie van de native spraak-API: zij bewijzen bediening, daadwerkelijke wachtrijtekst en woordmarkering op events, niet de hoorbare kwaliteit van een stem op het apparaat van de gebruiker.

De volledige browserrun telde 102 geslaagde gevallen en één verwachte mobiele skip voor de muis-sleeptest. Eén oudere voorleestest nam aan dat een klik al betekende dat spraak actief was, terwijl nieuw vrijgegeven vraagfeedback nog werd verzameld. Die test controleert nu eerst de actuele leesinhoud, de pauzeknop en één echte native utterance, met behoud van de bestaande onderbrekingsasserties. Zes hercontroles op dezelfde productiebuild slaagden, drie per apparaat. Daarmee zijn alle **103 unieke uitvoerbare browsergevallen** gecontroleerd; ook de acht nieuwe leesmodusgevallen slagen op desktop en mobiel.

Een aanvullende visuele controle op 375 en 1280 pixels bevestigde de geselecteerde Nederlandse stem op 2×, de exact gemelde woorden en grotere tekst van 20/22,4 pixels met ruime regelafstand. De reader blijft in de normale paginastroom en het leesvak heeft geen horizontale overflow, ook met lange woorden en stemnamen. De controle vond een bestaande te brede voorbeeldknop in Zinnen; die tekst loopt nu over meerdere regels. De pagina past daarna op 375 pixels in gesloten, geopende en actieve leesmodus. De uitgeschakelde volgfunctie houdt zowel pagina als leesvak op hun plaats. De drie lesplayers gaven geen JavaScript-fouten.

Na de knopcorrectie slaagden alle 24 gerichte productiegevallen voor leesmodus, voorlezen en de zinslessen. Niveau- en vakgebiedlabels kregen expliciete tekstspaties voor de leesmodus; daarna slaagden de productiebuild en beide native woordmarkeringgevallen opnieuw.
