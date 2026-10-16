import type { SectionTeaching } from './types';

type ThreeSteps = [[string, string], [string, string], [string, string]];
const explain = (core: string, steps: ThreeSteps, terms: [string, string][], memory: string, section: string): SectionTeaching => ({
  core,
  steps: steps.map(([title, text]) => ({ title, text })),
  terms: terms.map(([term, meaning]) => ({ term, meaning })),
  memory,
  sources: [{ bookId: 'kroeger', section }],
});

/** Original Dutch explanations after direct reading of the supplied Kroeger PDF; see the dated review ledger. */
export const SEMANTICS_TEACHING: Record<string, SectionTeaching[]> = {
  'betekenis-woord-zin-context': [
    explain('Een woord geeft je een gedeeld begrip. De situatie helpt bepalen welk concreet ding iemand bedoelt.', [
      ['Begin bij het woord', 'Fiets noemt een soort voertuig. De betekenis vertelt nog niet welke fiets buiten staat.'],
      ['Vul de situatie in', 'Bij de fiets gebruik je de tekst of omgeving om de bedoelde fiets te vinden.'],
      ['Houd kennis apart', 'Dat de fiets blauw is of van je buurman is, kan wereldkennis zijn. Het hoort niet automatisch bij de betekenis van fiets.'],
    ], [['Woordbetekenis', 'De gedeelde betekenis die je kent als je een woord begrijpt.'], ['Referent', 'Het concrete ding of de concrete persoon die iemand met een uitdrukking bedoelt.']], 'Een woord begrijpen is iets anders dan weten welk ding ermee bedoeld is.', 'H1 §§1.1–1.3, pp.3–7; H2 §§2.3–2.4, pp.17–22'),
    explain('Woorden krijgen samen een betekenis doordat de zin ze met elkaar verbindt. Wie wie helpt, hangt af van die verbinding.', [
      ['Zoek de deelnemers', 'In de leerling helpt de docent zijn een leerling en een docent betrokken.'],
      ['Lees de richting', 'De leerling is hier de helper; de docent krijgt hulp. Wissel de groepen om en de richting verandert.'],
      ['Stel je de situatie voor', 'Je begrijpt wanneer de beschrijving zou kloppen. Je hoeft nog niet te weten of dat werkelijk gebeurd is.'],
    ], [['Zinsbetekenis', 'Wat de woorden en hun onderlinge verbinding samen beschrijven.'], ['Waarheidsvoorwaarde', 'Wat er in een situatie moet gelden om een mededeling waar te maken.']], 'Lees de relaties tussen woorden mee; dezelfde woorden kunnen een andere gebeurtenis beschrijven.', 'H1 §1.3, pp.6–7; H3 §3.1, pp.35–36; H12 §12.2, pp.218–219'),
    explain('Dezelfde zin kan in een andere situatie iets anders doen. Een vraag naar kunnen kan ook een verzoek zijn.', [
      ['Lees wat er staat', 'Kun je het licht aandoen? heeft de vorm van een vraag naar vermogen.'],
      ['Bekijk het gesprek', 'In een donkere kamer ligt een verzoek voor de hand. Tijdens een kracht- of bewegingstest kan echt naar vermogen worden gevraagd.'],
      ['Controleer de bedoeling', 'Vraag zo nodig: bedoel je dat ik het licht aandoe? Zo maak je jouw afleiding bespreekbaar.'],
    ], [['Uiting', 'Eén concreet gebruik van taal, door iemand in een bepaalde situatie.'], ['Pragmatiek', 'Onderzoek naar betekenis die samenhangt met hoe taal wordt gebruikt.']], 'Scheid wat de zin beschrijft van wat iemand ermee wil bereiken.', 'H1 §§1.2 en 1.5, pp.5–6 en 9–10; H10 §10.3, pp.185–190'),
  ],
  'betekenis-verwijzing': [
    explain('Twee beschrijvingen kunnen naar dezelfde persoon wijzen en toch iets anders betekenen.', [
      ['Lees de beschrijving', 'De nieuwe rector beschrijft een schoolfunctie. Mijn tante beschrijft een familierelatie.'],
      ['Wijs de persoon aan', 'In deze situatie kunnen beide beschrijvingen dezelfde persoon aanwijzen. Dat maakt de beschrijvingen nog geen synoniemen.'],
      ['Verander de situatie', 'Na een nieuwe benoeming kan de rector iemand anders zijn, terwijl mijn tante dezelfde persoon blijft.'],
    ], [['Betekenis', 'De beschrijving of het begrip dat een uitdrukking meebrengt.'], ['Denotatie', 'Wat onder een uitdrukking valt in de beschouwde situatie.'], ['Referent', 'Wie of wat met deze concrete toepassing bedoeld is.']], 'Vraag apart: wat zegt de beschrijving, en wie of wat wijst zij hier aan?', 'H2 §2.4, pp.21–22'),
    explain('Een verwijzing kan steunen op de situatie of op eerdere tekst. Het dichtstbijzijnde woord is niet altijd het juiste anker.', [
      ['Zoek het anker', 'Bij ik, hier en morgen kijk je naar spreker, plaats en moment. Bij een citaat kan dat het oorspronkelijke bericht zijn.'],
      ['Vergelijk kandidaten', 'In Noor stuurde Eva haar verslag kan haar bij Noor of Eva passen. Alleen de nabijheid van Eva beslist dit niet.'],
      ['Maak je keuze zichtbaar', 'Schrijf bij twijfel Noors verslag of Eva’s verslag. Dan hoeft de lezer de eigenaar niet te raden.'],
    ], [['Deixis', 'Verwijzen met de situatie als anker, zoals bij ik, hier en nu.'], ['Anaphora', 'Verwijzen via een uitdrukking die in de tekst beschikbaar is.'], ['Antecedent', 'De uitdrukking waarop een verwijzing teruggrijpt.']], 'Zoek het juiste anker en controleer alle passende kandidaten.', 'H2 §2.3, pp.18–20; H21 §21.4.2, pp.416–420'),
    explain('Een monteur kan één bepaalde persoon zijn of iedere geschikte persoon. Het lidwoord een kiest dat niet voor je.', [
      ['Vraag wat herkenbaar is', 'De monteur presenteert een relevante monteur als herkenbaar voor de lezer. Dat kan door eerdere tekst of de situatie.'],
      ['Vraag wie je bedoelt', 'Een monteur die gisteren hier was kan één persoon op het oog hebben. Een monteur die dit kan repareren kan de identiteit openlaten.'],
      ['Herken hoeveelheden', 'Iedere monteur wijst niet één monteur aan. Het verdeelt een beschrijving over de relevante monteurs.'],
    ], [['Bepaaldheid', 'Hoe een uitdrukking een referent als herkenbaar presenteert.'], ['Specificiteit', 'Of in deze lezing een bepaald individu bedoeld is.'], ['Kwantificatie', 'Een hoeveelheid of verhouding verbinden met een beschrijving.']], 'Herkenbaar voor de lezer en specifiek bedoeld door de spreker zijn verschillende vragen.', 'H2 §2.3, pp.17–20; H12 §12.5, pp.225–226'),
  ],
  'betekenis-relaties': [
    explain('Woorden kunnen bijna hetzelfde feit beschrijven en toch verschillen in toon, gebruik of een andere betekenis.', [
      ['Houd de lezing gelijk', 'Vergelijk fiets en rijwiel als voertuigwoorden. Een andere betekenis van een woord hoort bij een andere vergelijking.'],
      ['Vervang in de hele zin', 'De fietsenstalling is vol en de rijwielstalling is vol kunnen dezelfde toestand beschrijven.'],
      ['Controleer de toon', 'Rijwiel klinkt vaak formeler. Betekenisbehoud van het feit garandeert niet dezelfde stijl of gevoelswaarde.'],
    ], [['Synoniem', 'Een woord met dezelfde of bijna dezelfde betekenis in de onderzochte lezing.'], ['Register', 'Taalkeuzes die passen bij een activiteit, relatie en medium.']], 'Test de inhoud in een zin en beoordeel de toon daarnaast.', 'H6 §§6.1–6.2.1, pp.107–108; H2 §2.6, pp.25–29'),
    explain('Een merel is een soort vogel. Een vleugel is een deel van een vogel. Dat zijn twee verschillende relaties.', [
      ['Probeer soort van', 'Een merel is een soort vogel. Van een merel op het hek mag je dus naar een vogel op het hek gaan.'],
      ['Probeer deel van', 'Een vleugel kan deel van een vogel zijn. De vleugel is daarmee zelf nog geen vogel.'],
      ['Lees ontkenning mee', 'Geen vogel op het hek sluit een merel uit. Geen merel laat andere vogels juist toe.'],
    ], [['Hyponymie', 'Een relatie tussen een specifiekere soort en een ruimere categorie.'], ['Hyperoniem', 'Het ruimere categoriewoord, zoals vogel tegenover merel.'], ['Meronymie', 'Een relatie tussen een benoemd onderdeel en een geheel.']], 'Onderscheid soort en deel; controleer daarna de vervangingsrichting.', 'H6 §§6.2.3–6.2.4, pp.113–115'),
    explain('Niet heet kan lauw zijn. Niet even is bij gehele getallen wel oneven. Tegenstellingen werken niet allemaal hetzelfde.', [
      ['Zoek een midden', 'Bij heet en koud kan lauw ertussen liggen. De ontkenning van het ene geeft niet automatisch het andere.'],
      ['Controleer het domein', 'Binnen de gehele getallen vormen even en oneven een tweedeling. Houd dat domein en die betekenis vast.'],
      ['Bekijk de rollen', 'Kopen en verkopen kunnen dezelfde transactie van twee kanten beschrijven. Dan wisselen de deelnemers van rol.'],
    ], [['Schaaltegenstelling', 'Tegenpolen met mogelijke tussengevallen, zoals heet en koud.'], ['Complementair paar', 'Twee mogelijkheden die binnen het gekozen domein samen de opties uitputten.'], ['Conversen', 'Woorden voor dezelfde relatie vanuit omgekeerde deelnemersrollen.']], 'Vraag welk type tegenstelling je ziet voordat je er iets uit afleidt.', 'H6 §6.2.2, pp.109–112'),
  ],
  'betekenis-ambiguiteit-vaagheid': [
    explain('Een dubbelzinnige zin heeft verschillende lezingen. Laat met twee situaties zien waarin die lezingen niet hetzelfde zeggen.', [
      ['Lokaliseer de keuze', 'Bij bank kan het woord twee betekenissen hebben. Bij met de verrekijker kan juist de aansluiting van de groep verschillen.'],
      ['Schrijf twee lezingen', 'Ik gebruikte een verrekijker verschilt van de wandelaar droeg een verrekijker. Benoem beide mogelijkheden volledig.'],
      ['Maak de situatie beslissend', 'Stel je voor dat alleen de kijker een verrekijker heeft. Dan kan de ene lezing kloppen en de andere niet.'],
    ], [['Ambiguïteit', 'Meer dan één onderscheiden betekenis of lezing van dezelfde vorm.'], ['Structurele ambiguïteit', 'Verschillende lezingen doordat woorden anders worden gegroepeerd.']], 'Twee lezingen worden duidelijk door twee parafrases en een beslissende situatie.', 'H2 §2.5, pp.23–24; H5 §5.3.2, pp.84–89'),
    explain('Bij zwaar kan de grens onduidelijk zijn. Bij een familielid ontbreken details. Die twee problemen vragen andere verduidelijkingen.', [
      ['Zoek een grensgeval', 'Een pakket van twaalf kilo kan zwaar zijn voor een kind en licht voor een hijskraan. De norm doet ertoe.'],
      ['Zoek een open detail', 'Een familielid kan duidelijk iemand uit de familie noemen zonder te zeggen of het een tante of neef is.'],
      ['Kies passend herstel', 'Geef voor een vage grens een relevante maat of norm. Vul een open detail alleen aan als de lezer het nodig heeft.'],
    ], [['Vaagheid', 'Een betekenis met grensgevallen waarvoor de toepassing niet scherp vastligt.'], ['Onderspecificatie', 'Een uitdrukking laat bepaalde details open.']], 'Een onduidelijke grens vraagt een norm; een open detail vraagt extra informatie.', 'H5 §§5.3.1–5.3.2, pp.80–89'),
    explain('Woordbetekenissen kunnen verwant zijn of door de context verschuiven. Niet elk gebruik is daarom meteen een apart woordenboekwoord.', [
      ['Vergelijk de toepassingen', 'Een boek kan een fysiek voorwerp en een inhoudelijk werk zijn. Zwaar en helder geschreven kunnen beide aspecten oproepen.'],
      ['Beschrijf de verbinding', 'De klas lacht gebruikt de klas voor de leerlingen. Leg uit welke herkenbare relatie die verschuiving mogelijk maakt.'],
      ['Gebruik meerdere aanwijzingen', 'Vergelijk echte contexten en combinaties. Alleen de herkomst van een woord of één ongemakkelijke zin beslist de analyse niet.'],
    ], [['Polysemie', 'Meerdere verwante betekenissen van een woord.'], ['Homonymie', 'Dezelfde vorm bij betekenissen die als niet verwant worden behandeld.'], ['Contextaanpassing', 'Een context roept een betekenisverschuiving op die past bij de combinatie.']], 'Leg het verband tussen toepassingen uit en laat ruimte voor een onzekere grens.', 'H5 §§5.3.3–5.5, pp.89–102'),
  ],
  'betekenis-implicatie': [
    explain('Een betekenisgevolg is verzekerd: als de eerste beschrijving waar is, kan de tweede bij dezelfde lezing niet onwaar zijn.', [
      ['Neem de eerste als waar', 'Stel dat er een rode map in deze kast ligt. Houd de kast, het moment en de betekenis gelijk.'],
      ['Zoek een tegenvoorbeeld', 'Kan er dan geen map in die kast liggen? Bij dezelfde gewone lezing lukt dat niet.'],
      ['Test ook andersom', 'Een blauwe map maakt er ligt een map waar zonder een rode map. De omgekeerde richting is dus niet verzekerd.'],
    ], [['Semantische implicatie', 'Een gevolgrelatie die uit de inhoud volgt: eerste waar betekent tweede noodzakelijk waar.'], ['Tegenvoorbeeld', 'Een situatie die een beweerde algemene relatie weerlegt.']], 'Zoek eerste waar en tweede onwaar, met dezelfde lezing en context.', 'H3 §3.3, pp.37–39; H7 §7.2, pp.120–121'),
    explain('Twee beschrijvingen kunnen hetzelfde zeggen, elkaar volledig tegenspreken of alleen niet samen waar zijn.', [
      ['Test beide richtingen', 'Noor is ouder dan Ilias en Ilias is jonger dan Noor geven bij dezelfde leeftijdslezing dezelfde verhouding.'],
      ['Test samen waar', 'Volledig open en volledig dicht kunnen bij dezelfde deur op hetzelfde moment niet beide gelden.'],
      ['Test samen onwaar', 'Bij een halfopen deur zijn beide onwaar. Het paar vormt dus geen volledige tweedeling.'],
    ], [['Parafrase', 'Een andere formulering met in het onderzochte opzicht dezelfde inhoud.'], ['Contradictorisch', 'De twee beschrijvingen hebben altijd tegengestelde waarheidswaarden.'], ['Contrair', 'De twee beschrijvingen kunnen niet samen waar, maar wel samen onwaar zijn.']], 'Controleer beide gevolgtrekkingen én of de beschrijvingen samen onwaar kunnen zijn.', 'H3 §3.3, pp.38–39'),
    explain('Een aannemelijk gevolg hoeft niet in de zin te staan. Een poging verzekert bijvoorbeeld nog geen geslaagde uitkomst.', [
      ['Zoek het gecodeerde resultaat', 'De vaas breken beschrijft een breuk. Tegen de vaas slaan kan gebeuren terwijl zij heel blijft.'],
      ['Lees de inbedding', 'Probeerde de knoop los te maken zegt dat er een poging was. Het zegt nog niet dat de knoop losging.'],
      ['Verzin een passende uitzondering', 'Iemand kan binnen een jas aantrekken om hem te passen. Naar buiten gaan is dus geen noodzakelijk gevolg.'],
    ], [['Wereldkennis', 'Kennis over hoe dingen gewoonlijk verlopen, naast de taalbetekenis.'], ['Lexicaal gevolg', 'Een inhoudelijk gevolg dat door de betekenis van een woord ontstaat.']], 'Scheid vaste resultaten, mogelijke uitkomsten en verwachtingen over de wereld.', 'H7 §§7.2 en 7.5, pp.120–121 en 126–131; H8 §8.6, p.151'),
  ],
  'betekenis-presuppositie': [
    explain('Een zin kan informatie als achtergrond presenteren. Die informatie hoeft de luisteraar nog niet te kennen of te aanvaarden.', [
      ['Zoek de hoofdmededeling', 'In Noor is weer te laat gaat de hoofdmededeling over deze te-laatkomst.'],
      ['Zoek het achtergrondsignaal', 'Weer roept een eerdere relevante keer op. Die eerdere keer wordt als achtergrond aangeboden.'],
      ['Controleer je instemming', 'Je kunt de huidige gebeurtenis bespreken en toch de eerdere keer betwisten. Als gegeven gepresenteerd betekent niet bewezen.'],
    ], [['Presuppositie', 'Informatie die een uiting als gegeven achtergrond presenteert.'], ['Trigger', 'Een woord of constructie die zo’n achtergrond oproept.']], 'Schrijf hoofdmededeling en aangeboden achtergrond apart op.', 'H3 §§3.4–3.4.3, pp.40–47'),
    explain('Achtergrond blijft vaak staan in een vraag of ontkenning. Gebruik meerdere tests, want de context kan de achtergrond veranderen.', [
      ['Maak een gewone ontkenning', 'Jo is niet weer verhuisd ontkent de huidige verhuizing. Een eerdere verhuizing klinkt vaak nog mee.'],
      ['Maak er een vraag van', 'Is Jo weer verhuisd? vraagt naar nu en roept doorgaans dezelfde eerdere verhuizing op. Vergelijk beide uitkomsten.'],
      ['Lees de omgeving mee', 'Een voorwaarde kan de benodigde achtergrond lokaal leveren. Een nadrukkelijke correctie kan haar juist afwijzen.'],
    ], [['Projectie', 'Achtergrondinformatie blijft beschikbaar onder bijvoorbeeld ontkenning of een vraag.'], ['Bereik', 'Het deel van de interpretatie waarop een uitdrukking werkt.']], 'Een ontkenningstest is een aanwijzing; controleer ook de vraag en de ruimere context.', 'H3 §3.4.1, pp.41–43; H8 §8.6, pp.151–156'),
    explain('Je kunt nieuwe achtergrond stilzwijgend accepteren, ernaar vragen of haar corrigeren. Dat zijn bewuste keuzes.', [
      ['Haal de aanname naar voren', 'Mijn zus komt later presenteert het bestaan van een zus als achtergrond, ook als jij die zus nog niet kende.'],
      ['Beslis of je haar accepteert', 'Je kunt die nieuwe informatie zonder bezwaar aan het gesprek toevoegen. Dat heet accommodatie.'],
      ['Vraag of herstel gericht', 'Bij twijfel kun je zeggen: ik wist niet dat je een zus hebt. Bij een onjuiste aanname corrigeer je precies dat onderdeel.'],
    ], [['Accommodatie', 'Nieuwe achtergrond aannemen zodat een uiting past bij het gesprek.'], ['Gedeelde achtergrond', 'Wat gesprekspartners behandelen als beschikbaar voor hun gesprek.']], 'Accommoderen is mogelijk, maar een aangeboden aanname mag ook worden bevraagd of afgewezen.', 'H3 §3.4.2, pp.44–45; H8 §8.6, p.154'),
  ],
  'betekenis-implicatuur': [
    explain('Een indirect antwoord krijgt betekenis doordat je het met de vraag verbindt. Mijn knie doet pijn kan zo een afwijzing worden.', [
      ['Bewaar de letterlijke inhoud', 'Ik werk zaterdag tot laat zegt iets over werktijd. Er staat nog niet letterlijk dat helpen onmogelijk is.'],
      ['Verbind met het doel', 'Na een verhuisvraag is die werktijd relevant als mogelijk bezwaar. Zo ontstaat de afleiding dat iemand niet kan helpen.'],
      ['Verander de vraag', 'Na hoe ziet je zaterdag eruit? geeft dezelfde zin gewone informatie. De afwijzing hoeft dan niet te ontstaan.'],
    ], [['Conversationele implicatuur', 'Een bedoelde extra bijdrage die uit het gebruik in het gesprek wordt afgeleid.'], ['Relevantie', 'Het verband tussen een bijdrage en het doel van het gesprek.']], 'Verklaar een extra bedoeling via de vraag, gedeelde kennis en het gespreksdoel.', 'H8 §§8.1–8.3, pp.139–145'),
    explain('Sommige kan niet allemaal suggereren. Die afleiding wordt zwakker als de spreker de rest niet heeft kunnen controleren.', [
      ['Vergelijk de alternatieven', 'Alle lampen werken geeft meer informatie dan sommige lampen werken als de vraag over alle lampen gaat.'],
      ['Controleer wat bekend is', 'Wie alleen de gang bekeek, kan over de andere lampen niets zeker zeggen. De keuze voor sommige verklaart dan vooral die beperking.'],
      ['Maak de grens expliciet', 'Gebruik bij een belangrijke instructie minstens twee, hoogstens twee of precies twee. Laat de taakgrens niet afhangen van een vermoeden.'],
    ], [['Scalaire implicatuur', 'Een extra afleiding doordat een zwakkere relevante formulering wordt gekozen.'], ['Informatiepositie', 'Wat de spreker kan weten of verantwoord kan vaststellen.']], 'Een zwakkere uitspraak sluit een sterkere situatie niet vanzelf uit.', 'H8 §8.4.1, pp.146–147; H9 §§9.2.2 en 9.4.1, pp.165–166 en 172–175'),
    explain('Een implicatuur kun je vaak intrekken zonder de letterlijke inhoud tegen te spreken. Combineer deze test met andere aanwijzingen.', [
      ['Voeg een vervolg toe', 'Sommige gasten zijn binnen, misschien allemaal laat de sterkere mogelijkheid open. Dat kan zonder letterlijke tegenspraak.'],
      ['Vergelijk een vast gevolg', 'Een rode bal ligt hier, maar er ligt geen bal botst wel bij dezelfde gewone lezing. Bal ligt in rode bal besloten.'],
      ['Controleer de gesprekspartner', 'Vraag bedoel je dat je niet kunt? als de bedoeling niet zeker is. Presenteer jouw afleiding niet als letterlijk uitgesproken feit.'],
    ], [['Annuleerbaarheid', 'Een afleiding kan worden ingetrokken zonder de hoofdinhoud tegen te spreken.'], ['Betekenisstatus', 'Of informatie hoofdinhoud, achtergrond of een contextuele afleiding is.']], 'Test een afleiding, maar laat één test nooit zonder context over alles beslissen.', 'H8 §§8.5–8.6, pp.149–156'),
  ],
  'betekenis-compositie': [
    explain('De structuur is het bouwplan voor de betekenis. Een beschrijving hoort bij een bepaald onderdeel, niet zomaar bij het dichtstbijzijnde woord.', [
      ['Zoek de kleine groepen', 'In een foto van de buurman met de blauwe jas herken je beschrijvingen van een foto en een buurman.'],
      ['Kies de aansluiting', 'Als met de blauwe jas de buurman beschrijft, combineer je die informatie eerst met buurman.'],
      ['Bouw de grotere betekenis', 'Daarna lees je de foto van die beschreven buurman. Een andere aansluiting vraagt een andere interpretatie en passende context.'],
    ], [['Compositionaliteit', 'De betekenis van een geheel volgt uit de onderdelen en hoe die worden gecombineerd.'], ['Constituent', 'Een woord of woordgroep die binnen een grotere structuur als eenheid werkt.']], 'Bouw de betekenis langs de groepsgrenzen, van klein naar groot.', 'H12 §§12.1–12.2, pp.217–219; H13 §13.5, pp.242–246'),
    explain('Rood voegt een eigenschap toe. Voormalig verschuift een rol naar vroeger. Niet elk bijvoeglijk woord werkt dus op dezelfde manier.', [
      ['Test beide eigenschappen', 'Een rode fiets is een fiets én rood. Deze combinatie werkt als een overlap van eigenschappen.'],
      ['Zoek de relevante norm', 'Een bekwame arts is bekwaam als arts. Je mag daaruit niet afleiden dat die persoon ook goed schaakt.'],
      ['Lees tijd en toeschrijving', 'Een voormalig ziekenhuis heeft die functie niet meer. Een vermeende winnaar hoeft bij nader onderzoek geen winnaar te zijn.'],
    ], [['Intersectief', 'De combinatie behoudt de zelfstandige eigenschappen van beide woorden, zoals rood en fiets.'], ['Modificator', 'Een bepaling die de interpretatie van een andere uitdrukking bewerkt.']], 'Vraag wat de bepaling doet: eigenschap toevoegen, norm kiezen, tijd verschuiven of iets toeschrijven.', 'H15 §15.3, pp.275–281'),
    explain('In een gedachte, wens of zoekopdracht telt ook onder welke beschrijving iemand iets kent of zoekt.', [
      ['Herken het perspectief', 'Tess weet dat haar buurman verhuist beschrijft wat Tess weet. Het geeft niet automatisch al haar kennis van die persoon weer.'],
      ['Test een vervanging', 'Als de buurman ook rector is, hoeft Tess die identiteit nog niet te kennen. Rector invullen kan haar kennis daarom verkeerd weergeven.'],
      ['Maak de zoekbehoefte concreet', 'Onderscheid ik zoek die vertaler die belde van ik zoek iemand die dit kan vertalen. De identiteit staat alleen in de eerste omschrijving vast.'],
    ], [['Perspectiefcontext', 'Een omgeving waarin de beschrijving onder iemands kennis, overtuiging of wens valt.'], ['De re / de dicto', 'Hier: één bepaald individu tegenover iemand of iets dat aan een beschrijving voldoet.']], 'Bewaar iemands perspectief en de bedoelde specificiteit bij vervangen.', 'H12 §§12.4–12.5, pp.223–226; H15 §§15.2 en 15.4, pp.274–275 en 281–285'),
  ],
  'betekenis-kwantoren': [
    explain('Om iedere leerling leest te beoordelen, kies je eerst welke leerlingen meetellen. Daarna controleer je de eigenschap lezen.', [
      ['Baken de groep af', 'Bedoel je deze klas, alle ingeschreven deelnemers of de nu aanwezige leerlingen? Leg dat vast voordat je telt.'],
      ['Zoek de beperking', 'In iedere ingeschreven deelnemer heeft betaald beperkt ingeschreven deelnemer wie binnen de telling valt.'],
      ['Toets de eigenschap', 'Controleer heeft betaald voor die deelnemers. Iemand buiten de gekozen groep is geen tegenvoorbeeld voor deze uitspraak.'],
    ], [['Domein', 'De personen of dingen die voor de beoordeling meetellen.'], ['Beperking', 'De beschrijving die de te beoordelen groep afbakent.'], ['Kwantor', 'Een uitdrukking voor een hoeveelheid of verhouding, zoals iedere, geen of de meeste.']], 'Kies wie meetelt en toets pas daarna de hoeveelheid.', 'H4 §4.4.1, pp.68–71; H14 §§14.2–14.3, pp.254–260'),
    explain('Iedere vraagt dat niemand uitvalt; geen dat niemand voldoet; de meeste dat meer dan de helft voldoet.', [
      ['Zoek voorbeelden of uitzonderingen', 'Eén leerling die niet leest weerlegt iedere leerling leest. Bij sommige zoek je passende gevallen; de meervoudsvorm blijft daarbij meetellen.'],
      ['Bereken de verhouding', 'Drie van vier is meer dan de helft. Drie van twintig is dat niet, ook al is het absolute aantal gelijk.'],
      ['Controleer norm en leegte', 'Veel hangt af van verwachtingen. Als niemand meetelt, vermeld dat expliciet: een formele test zonder tegenvoorbeeld kan anders misleiden.'],
    ], [['Universeel', 'Een uitspraak over ieder lid van de relevante groep.'], ['Existentieel', 'Een uitspraak die passende gevallen vereist.'], ['Proportioneel', 'Een hoeveelheid beoordeeld als deel van de relevante groep.']], 'Aantal en verhouding zijn verschillende vragen; veel vraagt bovendien een contextuele norm.', 'H14 §§14.2–14.4, pp.254–263; H8 §8.4.1, pp.146–147'),
    explain('Iedere leerling leest een boek hoeft niet te betekenen dat iedereen hetzelfde boek leest. De keuzes kunnen per leerling verschillen.', [
      ['Begin per deelnemer', 'Teken iedere leerling en verbind die met een boek. Voor deze lezing mogen de pijlen naar verschillende boeken gaan.'],
      ['Test één gedeeld object', 'Teken daarna alle pijlen naar hetzelfde boek. Dat is een sterkere invulling die niet door iedere lezing wordt afgedwongen.'],
      ['Herschrijf het bedoelde patroon', 'Iedereen leest een zelfgekozen boek laat individuele keuzes toe. Iedereen leest hetzelfde boek legt juist een gedeeld boek vast.'],
    ], [['Bereik', 'Welke andere bijdrage onder een uitdrukking wordt geïnterpreteerd.'], ['Afhankelijkheid', 'Of de keuze voor het ene individu mee kan wisselen met een ander.']], 'Maak zichtbaar of een keuze per persoon mag wisselen of voor iedereen gelijk moet zijn.', 'H14 §14.5, pp.264–267'),
  ],
  'betekenis-ontkenning-bereik': [
    explain('Niet ontkent een bepaald stuk inhoud. Zoek eerst precies welk stuk dat is.', [
      ['Maak het doelwit positief', 'Bij ik heb niet gezegd dat de sleutel kwijt is is het doelwit: ik heb gezegd dat de sleutel kwijt is.'],
      ['Bewaar de lagen', 'Een uitspraak ontkennen is iets anders dan bewijzen dat de sleutel niet kwijt is. De ingebedde inhoud blijft een aparte laag.'],
      ['Maak een correctie concreet', 'Niet de rode map, maar de blauwe wijst een kleurkeuze af. Het vervolg helpt laten zien wat de spreker bedoelt.'],
    ], [['Ontkenning', 'Een bewerking die de waarheid van de beschrijving waarop zij werkt afwijst.'], ['Bereik', 'Het gedeelte van de interpretatie waarop een bewerking wordt toegepast.']], 'Benoem het positieve doelwit voordat je niet uitlegt.', 'H4 §§4.3.1 en 4.4.2, pp.58–61 en 72; H8 §8.6, pp.155–156'),
    explain('Niet alle laat minstens één uitzondering toe. Geen sluit ieder passend geval uit. Die twee uitspraken zeggen dus iets anders.', [
      ['Teken een kleine groep', 'Neem vier bekers: drie schoon en één vuil. Niet alle bekers zijn schoon klopt; geen beker is schoon klopt niet.'],
      ['Maak ze allemaal vuil', 'Dan zijn beide uitspraken waar. Niet alle verzekert dus niet dat er ook schone bekers zijn.'],
      ['Kies een precieze formulering', 'Schrijf minstens één beker is niet schoon voor een uitzondering. Schrijf geen beker is schoon als alle bekers vuil zijn.'],
    ], [['Niet alle', 'De algemene uitspraak heeft een uitzondering binnen het relevante domein.'], ['Geen', 'Er is geen passend geval in het relevante domein.']], 'Niet alle betekent niet vanzelf: sommige wel en sommige niet.', 'H4 §4.4.2, p.72; H14 §14.5, pp.264–265; H9 §9.4, pp.171–172'),
    explain('Niet verplicht is iets anders dan verboden. Ook aangeboden achtergrond verdwijnt niet automatisch door niet.', [
      ['Zoek de noodzaak', 'Je hoeft niet te komen zegt dat komen niet verplicht is. Komen kan nog steeds toegestaan zijn.'],
      ['Vergelijk het verbod', 'Je mag niet komen presenteert komen juist als niet toegestaan volgens de relevante regel.'],
      ['Controleer de achtergrond', 'Bij niet weer te laat kan een eerdere te-laatkomst blijven meeklinken. Een expliciete correctie kan die aanname apart afwijzen.'],
    ], [['Modale kracht', 'Of iets mogelijk of noodzakelijk wordt voorgesteld.'], ['Achtergrond', 'Informatie die als gegeven wordt gepresenteerd naast de hoofdmededeling.']], 'Zoek wat precies wordt ontkend: noodzaak, mogelijkheid, gebeurtenis of een eerdere aanname.', 'H16 §16.5, pp.309–312; H8 §8.6, pp.155–156'),
  ],
  'betekenis-modaliteit': [
    explain('Vraag bij kan, mag en moet twee dingen: hoe sterk is de uitspraak, en op welke kennis, regels of mogelijkheden berust zij?', [
      ['Bepaal de kracht', 'Kan laat een mogelijkheid open. Moet geeft in een passende lezing noodzaak aan.'],
      ['Zoek de bron', 'Het kan gaan om aanwijzingen, een regel, lichamelijk vermogen of een doel. Die bronnen zijn niet onderling hetzelfde.'],
      ['Vergelijk twee lezingen', 'De brug kan open kan technische mogelijkheid noemen. De brug mag open kan toestemming noemen, ook als de techniek al werkt.'],
    ], [['Epistemisch', 'Beoordeeld op basis van beschikbare kennis of aanwijzingen.'], ['Deontisch', 'Beoordeeld op basis van regels, toestemming of verplichting.'], ['Modale kracht', 'De mate van mogelijkheid of noodzaak die wordt uitgedrukt.']], 'Benoem zowel de kracht als het criterium van de modale uitspraak.', 'H16 §§16.1–16.2, pp.293–298'),
    explain('Een regel zegt hoe de situatie hoort te zijn. Zij garandeert niet dat de werkelijkheid eraan voldoet.', [
      ['Lees de huidige feiten', 'Er staat een kast voor de deur beschrijft de feitelijke situatie in het voorbeeld.'],
      ['Lees de norm apart', 'De deur moet vrij blijven beschrijft wat volgens het noodplan vereist is. De kast kan dus een overtreding zijn.'],
      ['Controleer de voorwaarden', 'Als de brug open is beoordeelt een scenario met een open brug. Het bevestigt niet dat de brug nu werkelijk open is.'],
    ], [['Scenario', 'Een mogelijke situatie die je voor de beoordeling overweegt.'], ['Norm', 'Een relevante standaard, regel of doel waaraan situaties worden getoetst.']], 'Houd feiten, normen en voorwaardelijke scenario’s uit elkaar.', 'H16 §16.3, pp.298–304; H19 §§19.1–19.2, pp.347–351'),
    explain('Waar informatie vandaan komt, bepaalt niet automatisch hoe zeker zij is. Ook niet mogelijk en niet noodzakelijk verschillen.', [
      ['Vergelijk de ontkenning', 'Het kan niet kloppen sluit de mogelijkheid uit. Het hoeft niet te kloppen laat ruimte voor kloppen én niet kloppen.'],
      ['Noem de informatiebron', 'Ik zie mogelijk een vos noemt een waarneming. Volgens de boswachter noemt een gerapporteerde bron.'],
      ['Beoordeel zekerheid apart', 'Slecht camerabeeld kan onzeker zijn; een betrouwbaar verslag kan sterk bewijs geven. De bron levert dus geen vast zekerheidspercentage.'],
    ], [['Bronmarkering', 'Aangeven of informatie bijvoorbeeld gezien, gehoord of afgeleid is.'], ['Evidentialiteit', 'In de technische zin: grammaticale markering met informatiebron als centrale functie.'], ['Zekerheid', 'Hoe sterk iemand zich vastlegt op de juistheid van de inhoud.']], 'Scheid modaliteitskracht, informatiebron en zekerheid.', 'H16 §16.5, pp.307–313; H17 §§17.1–17.5, pp.317–326'),
  ],
  'betekenis-tijd-aspect': [
    explain('Een werkwoordsvorm geeft niet in zijn eentje een datum. Lees ook het besproken moment en het tijdsperspectief.', [
      ['Zoek het tijdanker', 'Gisteren, volgende week of een eerder genoemde gebeurtenis helpt bepalen over welk moment de zin gaat.'],
      ['Lees de vorm samen met het anker', 'Volgende week werk ik thuis gebruikt een tegenwoordige vorm voor een toekomstige situatie. Vorm en kalender vallen niet samen.'],
      ['Teken de volgorde', 'Toen ik aankwam, was de trein al vertrokken zet vertrek vóór aankomst. Een verleden toestand zegt op zichzelf niet dat zij nu voorbij is.'],
    ], [['Grammaticale tijd', 'Een grammaticale relatie tussen het besproken moment en een spreek- of perspectiefmoment.'], ['Tijdanker', 'Het moment waarmee je een tijdsaanduiding verbindt.']], 'Combineer vorm, tijdsbepaling en perspectief; vul geen einddatum in die de tekst niet geeft.', 'H20 §20.3, pp.386–388; H21 §§21.2–21.4, pp.406–420'),
    explain('Wandelen kan doorgaan zonder ingebouwd doel. Naar het station wandelen heeft een natuurlijk eindpunt in de beschrijving.', [
      ['Zoek verandering en duur', 'De deur is dicht beschrijft een toestand. Zwemmen beschrijft een activiteit die enige tijd kan doorgaan.'],
      ['Zoek een eindpunt', 'Naar de overkant zwemmen bevat een doelpad. Een glas leegdrinken bevat een afgemeten hoeveelheid en resultaat.'],
      ['Lees de hele beschrijving', 'Hetzelfde werkwoord kan met een ander object of pad anders uitpakken. Een natuurlijk eindpunt in de beschrijving is nog geen bewijs dat het bereikt is.'],
    ], [['Situatietype', 'Hoe een beschrijving een toestand of gebeurtenis indeelt naar duur, verandering en eindpunt.'], ['Teliciteit', 'Een beschrijving bevat een natuurlijk eindpunt of een te bereiken resultaat.']], 'Bepaal het situatietype uit de hele beschrijving, inclusief object en pad.', 'H20 §§20.2 en 20.5, pp.380–385 en 394–397'),
    explain('Een activiteit als bezig voorstellen verzekert geen afloop. Een eerdere voltooide handeling verzekert evenmin dat haar resultaat nu nog bestaat.', [
      ['Kijk van binnenuit', 'Ze was de brug aan het schilderen laat zien wat gaande was. Misschien werd het schilderen later onderbroken.'],
      ['Onderscheid de vaktermen', 'Perfectief presenteert een situatie als geheel. Perfect verbindt een eerdere situatie met een relevant later moment.'],
      ['Controleer wat overblijft', 'Na ik heb de kamer schoongemaakt kan opnieuw verf gemorst zijn. En ik heb gisteren gewerkt is gewoon Nederlands: kopieer de Engelse beperking hier niet.'],
    ], [['Aspect', 'Hoe een beschrijving de tijdsstructuur van een situatie presenteert.'], ['Perfectief', 'Een situatie als geheel binnen het besproken tijdvak presenteren.'], ['Perfect', 'Een eerdere situatie verbinden met een relevant later tijdstip.']], 'Scheid de gebeurtenis, haar presentatie en de toestand op een later moment.', 'H20 §§20.3–20.5, pp.386–397; H22 §§22.1–22.4, pp.427–436'),
  ],
  'betekenis-taalhandelingen': [
    explain('Met een zin kun je informeren, waarschuwen of verzoeken. Dat is iets anders dan wat de ontvanger daarna werkelijk doet.', [
      ['Benoem de vorm', 'Er komt een fietser van rechts! heeft een mededelende vorm. De zin beschrijft een naderende fietser.'],
      ['Benoem de handeling', 'In het verkeer kan iemand daarmee waarschuwen. Gebruik de situatie om die functie te onderbouwen.'],
      ['Beschrijf het effect apart', 'De ontvanger kan stoppen, schrikken of niet reageren. Het effect bepaalt niet op zichzelf of de waarschuwing herkenbaar was.'],
    ], [['Taalhandeling', 'Wat iemand met een uiting doet, zoals vragen, beloven of waarschuwen.'], ['Effect', 'Wat de uiting daadwerkelijk bij een ontvanger teweegbrengt.']], 'Houd zinsvorm, taalhandeling en werkelijk effect uit elkaar.', 'H10 §§10.1–10.2, pp.179–184'),
    explain('Kun je deze kist tillen? kan vermogen toetsen of een verzoek zijn. Het gespreksdoel helpt de bedoelde handeling herkennen.', [
      ['Lees de gewone vraag', 'De vraagvorm maakt een lezing over kunnen beschikbaar. Tijdens een krachtmeting kan precies dat bedoeld zijn.'],
      ['Bekijk de aanleiding', 'Tijdens opruimen kan iemand willen dat de kist wordt verplaatst. De vraag werkt dan als indirect verzoek.'],
      ['Controleer of verduidelijking nodig is', 'Een gebruikelijk verzoek wordt vaak direct herkend. Bij een andere relatie of taalachtergrond kan een expliciete opdracht duidelijker zijn.'],
    ], [['Indirecte taalhandeling', 'Een handeling die via een vorm voor een andere handeling wordt verricht.'], ['Gebruiksconventie', 'Een gebruikelijke manier waarop een vorm in een situatie wordt ingezet.']], 'Verklaar de handeling met vorm, aanleiding en gedeeld gespreksdoel.', 'H10 §§10.3–10.4, pp.185–192'),
    explain('Een belofte vraagt passende omstandigheden en inzet. Een plechtige formulering maakt een handeling niet vanzelf geldig of oprecht.', [
      ['Zoek de uitvoerder en tijd', 'Een gewone belofte gaat over wat de spreker later zal doen. Gisteren regen uitvoeren past daar niet bij.'],
      ['Controleer de voorwaarden', 'Een afspraak vaststellen kan een erkende rol vereisen. Een toeschouwer en een scheidsrechter hebben niet altijd dezelfde bevoegdheid.'],
      ['Herstel de bedoeling', 'Dat was een voorstel, nog geen afspraak maakt de status duidelijk. Een onoprechte belofte kan nog steeds een belofte zijn.'],
    ], [['Passendheidsvoorwaarden', 'Omstandigheden waaronder een taalhandeling kan slagen of passend is.'], ['Oprechtheid', 'De spreker heeft de inzet of houding die bij de handeling hoort.']], 'Controleer rol, tijd, uitvoerbaarheid en inzet; houd geldigheid en oprechtheid apart.', 'H10 §§10.2–10.3, pp.181–187'),
  ],
  'betekenis-register': [
    explain('Een andere toon kan dezelfde taak anders laten overkomen. De passende stijl hangt af van relatie, activiteit en medium.', [
      ['Bepaal de taak', 'Beide fietszinnen kunnen vragen de fiets op een bepaalde plaats neer te zetten. Houd die hoofdtaak zichtbaar.'],
      ['Vergelijk de taalkeuzes', 'U en je, stallen en neerzetten roepen verschillende sociale stijlen op. De feitelijke handeling hoeft daarbij niet te veranderen.'],
      ['Bekijk de ontvanger', 'Gebruik relatie, situatie en uitgesproken voorkeuren. Formeel is niet automatisch beleefder of duidelijker.'],
    ], [['Register', 'Taalkeuzes die passen bij een activiteit, relatie en medium.'], ['Aanspreekvorm', 'Hoe je iemand in taal aanspreekt, bijvoorbeeld met u of je.']], 'Kies stijl op basis van de concrete situatie en ontvanger.', 'H2 §2.6, pp.25–29; H11 §§11.3–11.5, pp.204–209'),
    explain('Helaas voegt een oordeel toe naast het nieuws. Vraag daarom apart wat wordt meegedeeld en wiens houding wordt weergegeven.', [
      ['Isoleer de hoofdclaim', 'Helaas is de zaal gesloten deelt de sluiting mee. Die sluiting kun je als afzonderlijke inhoud controleren.'],
      ['Zoek de beoordeling', 'Helaas presenteert de sluiting als betreurenswaardig. De luisteraar hoeft dat oordeel niet te delen.'],
      ['Maak het perspectief expliciet', 'Mira vindt het jammer verschilt van dat vind ik jammer. Een korte herschrijving kan de bron van de houding verduidelijken.'],
    ], [['Hoofdinhoud', 'De informatie die centraal wordt meegedeeld of bevraagd.'], ['Expressieve bijdrage', 'Taal die een houding of gevoel uitdrukt naast een beschrijving.']], 'Scheid hoofdclaim, beoordeling en de persoon aan wie die beoordeling wordt toegeschreven.', 'H2 §2.6, pp.25–29; H11 §§11.1–11.2, pp.197–204'),
    explain('Kleine woorden zoals toch en even sturen verwachtingen en toon. Hun bijdrage hangt af van de zin en het gesprek.', [
      ['Vergelijk met en zonder', 'Je hebt het formulier toch ingevuld? laat vaak een verwachting meeklinken die in heb je het formulier ingevuld? minder nadruk krijgt.'],
      ['Lees de situatie mee', 'Kom even kijken kan een verzoek lichter voorstellen. Even hoeft dan geen exacte duur te noemen.'],
      ['Beoordeel het effect', 'Behoud een partikel als het de gewenste toon geeft. Schrijf bij een precieze taak ook wat iemand waar moet doen.'],
    ], [['Partikel', 'Een klein woord dat in deze toepassing bijvoorbeeld houding of gespreksverwachtingen helpt uitdrukken.'], ['Gebruiksbetekenis', 'Een bijdrage aan hoe de uiting in het gesprek past.']], 'Vergelijk varianten in dezelfde situatie en houd taak en toon allebei zichtbaar.', 'H11 §§11.5–11.7, pp.208–212'),
  ],
};
