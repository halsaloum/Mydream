# Leescontrole Kroeger, 16 oktober 2026

Deze controle gebruikt de door de gebruiker aangeleverde PDF van Paul R. Kroeger, *Analyzing Meaning: An Introduction to Semantics and Pragmatics*. De 502 fysieke PDF-pagina's zijn vooraf rechtstreeks uit dat bestand geëxtraheerd met pypdf. Er is vervolgens daadwerkelijk door de hoofdstukteksten gelezen; de tabel hieronder is geen zoekwoordenoverzicht of hergebruik van de eerdere leesnotities.

De inhoudelijke hoofdstukken 1 tot en met 22 zijn in deze controle gelezen. De hoofdagent las eerst hoofdstukken 1 en 3; de semantieklezer heeft die twee hoofdstukken daarna ook zelf doorgenomen, inclusief het slot van hoofdstuk 3 op gedrukte pagina 48. Hoofdstukken 2 en 4 tot en met 22 zijn achtereenvolgens door de semantieklezer gelezen. Bij afgekapt toolresultaat zijn de ontbrekende pagina's apart opnieuw opgevraagd.

Dit betekent **niet** dat alle 502 pagina's even diep zijn gecontroleerd. Oefenreeksen, bibliografie, registers en voorwerk zijn niet integraal gelezen of opgelost. Sommige oefenpagina's waren wel zichtbaar aan het einde van een hoofdstuk. De nieuwe lessen nemen geen antwoorden uit die oefeningen over. Ook zijn niet alle voorbeelden in andere talen of iedere afzonderlijke figuur typografisch gecontroleerd.

## Gelezen bereiken

De gedrukte paginanummers staan in het boek zelf. In deze aangeleverde editie ligt het fysieke PDF-paginanummer 16 hoger.

| Hoofdstuk | Gedrukte pagina's geraadpleegd | Fysieke PDF-pagina's | Inhoudelijke aandacht |
| --- | --- | --- | --- |
| 1 | 3–13 | 19–29 | Semantiek, pragmatiek, drie betekenisniveaus, compositie, taalhandelingen |
| 2 | 15–31 | 31–47 | Verwijzing, denotatie, deixis, ambiguïteit, expressieve betekenis; tabel 2.1 gelezen |
| 3 | 35–48 | 51–64 | Waarheidsvoorwaarden, implicatie, parafrase, incompatibiliteit, presuppositie en accommodatie |
| 4 | 53–72 | 69–88 | Logische operatoren, geldig gevolg, kwantoren en bereik |
| 5 | 79–102 | 95–118 | Ambiguïteit, vaagheid, onderspecificatie, polysemie, contextaanpassing en facetten |
| 6 | 107–118 | 123–134 | Synonymie, typen tegenstellingen, hyponymie en meronymie; p.118 oefeningen incidenteel gelezen |
| 7 | 119–132 | 135–148 | Lexicale gevolgen, selectierestricties, componentanalyse en werkwoordklassen |
| 8 | 139–157 | 155–173 | Grice, implicaturen, annuleerbaarheid en meerdere diagnostische tests |
| 9 | 161–175 | 177–191 | En/of, explicaturen, grens semantiek/pragmatiek en bijzondere getalinterpretaties |
| 10 | 179–193 | 195–209 | Performatieven, passendheidsvoorwaarden, indirecte handelingen en taalvariatie |
| 11 | 197–212 | 213–228 | Hoofdinhoud, gebruiksbetekenis, sprekergerichte bijwoorden, beleefdheid en partikels |
| 12 | 217–227 | 233–243 | Compositie, vervanging, overtuigingen en de re/de dicto |
| 13 | 229–246 | 245–262 | Verzamelingen, modellen, interpretatieregels en stapsgewijze combinatie |
| 14 | 253–267 | 269–283 | Kwantoren als verzamelingsrelaties, beperking, proportie en bereik |
| 15 | 273–290 | 289–306 | Intensionaliteit, adjectiefklassen, perspectief en lambda-abstractie |
| 16 | 293–313 | 309–329 | Modale kracht en soort, scenario's, normen, ontkenning en taalvariatie |
| 17 | 317–327 | 333–343 | Informatiebron tegenover zekerheid; grammaticale en illocutionaire evidentialiteit |
| 18 | 329–343 | 345–359 | Because: oorzaak, grond voor een uitspraak, taalhandeling en structuur |
| 19 | 347–373 | 363–389 | Voorwaarden, hypothetische graad, beperking, contrafeitelijkheid en taalhandelingen |
| 20 | 379–401 | 395–417 | Situatietype, teliciteit, besproken tijd, gezichtspunt en contextaanpassing |
| 21 | 405–423 | 421–439 | Tijdankers, relatieve tijd en taalgebonden indirecte weergave |
| 22 | 427–448 | 443–464 | Perfect tegenover perfectief, verschillende perfectfuncties en taalvariatie; p.448 oefeningen incidenteel gelezen |

## Visuele controle

De oorspronkelijke PDF is met de gebundelde pypdfium2-runtime naar afbeeldingen gerenderd. Fysieke pagina's 253, 254 en 255 zijn visueel bekeken: figuren 13.1 tot en met 13.4 voor inclusie, doorsnede, vereniging en verschil. Dit voorkomt dat verloren wiskundige tekens in de tekstextractie als correcte notatie worden overgenomen. Fysieke pagina 406 is eveneens visueel bekeken: tijdlijnen bij voorbeeld (16) en het aspectoverzicht (17), gedrukte p.390. De nieuwe Nederlandse uitleg gebruikt de onderscheidingen in woorden; zij kopieert geen onbetrouwbare geëxtraheerde formule.

## Gevolgen voor de uitleg

De 14 betekenislessen zijn alle op hun 42 uitlegsecties beoordeeld. `src/content/ontleed/teaching-semantics.ts` voegt per sectie een eigen korte kern, precies drie inhoudelijke redeneerstappen, één tot drie begripsdefinities, een onthoudzin en een specifieke boekverwijzing toe. De stappen leggen een echt verschil uit, zoals bron versus zekerheid, soort versus deel of niet alle versus geen. Het zijn geen herhalingen van een algemene instructie om een zin te lezen.

De bestaande, uitgebreidere paragrafen blijven beschikbaar als verdieping. Bij de controle zijn de bronverwijzingen op lesniveau gecorrigeerd naar de werkelijk passende hoofdstukken, paragrafen en gedrukte pagina's. Onder meer een verwijzing naar een niet-bestaande §6.5 en de verkeerd gelokaliseerde presuppositie- en registerpassages zijn hersteld.

Twee inhoudelijke preciseringen zijn ook in die bestaande verdieping aangebracht:

- Grammaticale tijd wordt gekoppeld aan het moment waarover een uitspraak wordt gedaan, zodat een verleden toestand niet onterecht als nu beëindigd wordt voorgesteld (Klein-benadering, pp.386–388 en 406–408).
- Een existentiële toets en de meervoudsvorm blijven onderscheiden: `een` kan één geval vragen, terwijl bij `sommige leerlingen` de meervoudsbijdrage ook meetelt (pp.68–69 en 255).

Bij de nieuwe korte uitleg is bovendien expliciet rekening gehouden met:

- Veranderde referentie is geen bewijs voor een andere woordbetekenis. Twee uitdrukkingen met dezelfde referent zijn evenmin automatisch synoniem.
- Een grensgeval, een ontbrekend detail en verschillende lezingen zijn drie verschillende problemen.
- Presupposities worden als achtergrond gepresenteerd, maar hoeven nog niet bekend of aanvaard te zijn. Accommodatie kan nieuwe informatie toevoegen. Projectie- en annuleringstests zijn gezamenlijk bewijs, geen onfeilbare enkele truc.
- Scalariteit vraagt relevante alternatieven en een passende informatiepositie. `Niet alle` verzekert niet dat sommigen wel voldoen. Getalwoorden hebben bijzondere exacte en minimumlezingen.
- Niet elk adjectief geeft een simpele doorsnede: bekwaam, voormalig en vermeend vragen verschillende analyses. Vervanging onder weten of zoeken kan het perspectief veranderen.
- Bron en zekerheid zijn afzonderlijke vragen. In strikte vakterminologie is evidentialiteit een grammaticale categorie; de Nederlandse bronformuleringen zijn niet voorgesteld als verplichte evidentiële suffixen.
- De Engelse beperkingen op simple present en present perfect worden niet als Nederlandse regels aangeleerd. `Ik schrijf nu` en `Ik heb gisteren gewerkt` blijven gewone Nederlandse voorbeelden.
- Perfect en perfectief zijn onderscheiden; een beschreven eindpunt en het daadwerkelijk bereiken daarvan evenzeer. Een huidige resultaattoestand volgt niet uit iedere Nederlandse voltooide vorm.
- Een onoprechte belofte kan nog steeds een belofte zijn. Geldigheid, oprechtheid, bedoeling en effect zijn niet tot één succescriterium samengevoegd.

## Grenzen en bronkritiek

Kroeger noemt meerdere theoretische analyses en controverses. De uitleg presenteert een bruikbaar onderscheid met een passende beperking en claimt geen universele oplossing voor alle talen. De Nederlandse voorbeelden en didactische stappen zijn eigen bewerkingen, geen vertaalde boekpassages.

De bron zelf wisselt op p.393 de labels individual-level/stage-level om ten opzichte van de definitie op p.385. Die tegenstrijdigheid is gesignaleerd; de nieuwe uitleg neemt deze passage niet als definities over. De broncorrecties hierboven betekenen ook niet dat alle ondersteunende Nederlandse taaladviesbronnen of alle oorspronkelijke bronclaims buiten deze betekenislessen opnieuw zijn gelezen.
