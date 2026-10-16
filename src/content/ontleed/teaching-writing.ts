import { ALINEA_LESSONS } from './alinea';
import { CAPSTONE_LESSONS } from './capstone';
import type { BookId, SectionTeaching } from './types';

type Draft = Omit<SectionTeaching, 'sources'>;
const guide = (core: string, steps: [string, string][], memory: string, terms: [string, string][] = []): Draft => ({
  core, steps: steps.map(([title, text]) => ({ title, text })), memory,
  ...(terms.length ? { terms: terms.map(([term, meaning]) => ({ term, meaning })) } : {}),
});

/** Original writing applications; paragraph-specific sources remain distinct from the five linguistics books. */
const GUIDES: Record<string, Draft[]> = {
  'volle-zin-combineren': [
    guide('Begin met wat je zeker weet. Kies daarna pas hoe je de mededelingen verbindt.', [
      ['Haal de feiten uit elkaar', 'Noor controleerde het raam. Het raam zat vast. Dat zijn twee mededelingen; de reden voor de controle is daarmee nog niet gegeven.'],
      ['Kies een bewezen verband', 'Omdat voegt een reden toe. Gebruik dat woord alleen als je weet dat het vastzitten de reden voor het controleren was.'],
      ['Bouw de zin opnieuw', 'Zet je de omdat-bijzin voorop, dan volgt de persoonsvorm van de hoofdzin direct daarna: Omdat het raam vastzat, controleerde Noor het raam.'],
    ], 'Een mooier verband mag geen nieuw feit worden.', [['nevenschikking', 'Je verbindt delen op dezelfde grammaticale rang, bijvoorbeeld met en.'], ['onderschikking', 'Een deelzin wordt opgenomen als onderdeel van een grotere zin.']]),
    guide('Een bijzin kan aanwijzen welke brieven je bedoelt, of extra informatie geven over brieven die al bekend zijn.', [
      ['Vraag: welke brieven?', 'In de brieven die gisteren aankwamen helpt de bijzin de bedoelde groep kiezen. Andere brieven hoeven niet bedoeld te zijn.'],
      ['Vergelijk de komma’s', 'De brieven, die gisteren aankwamen, verwijst naar een al herkenbare groep en geeft daar een extra mededeling over. Twee komma’s kunnen dus een andere lezing aangeven.'],
      ['Controleer de hele groep', 'De hele woordgroep, inclusief de bijzin, is onderwerp bij liggen. Binnen de bijzin heeft die een eigen functie bij aankwamen.'],
    ], 'Bepaal eerst de bedoelde groep. Kies daarna de bijzin en interpunctie.', [['antecedent', 'De eerdere uitdrukking waar een verwijswoord of betrekkelijke vorm op aansluit.'], ['betrekkelijke bijzin', 'Een bijzin die een persoon of zaak nader bepaalt, zoals die gisteren aankwamen.']]),
    guide('Controleer een gecombineerde zin drie keer: klopt de bouw, blijft de inhoud gelijk en kan de lezer hem volgen?', [
      ['Bekijk elke deelzin', 'In het voorbeeld hebben was, belde en afsloot elk een eigen onderwerp. Ontleed die relaties afzonderlijk.'],
      ['Vertaal terug naar losse feiten', 'De brief was onduidelijk. Noor belde de afzender. Daarna sloot iemand het dossier. Controleer of reden en volgorde werkelijk in je gegevens staan.'],
      ['Lees als buitenstaander', 'Weet de lezer wie zij is? Verhelder de naam als er meer kandidaten zijn. Kies twee zinnen wanneer dat de inhoud beter laat volgen.'],
    ], 'Grammatica, inhoud en leesbaarheid vragen elk een eigen controle.'),
  ],
  'volle-zin-leesbaarheid': [
    guide('Een zin wordt lastig wanneer je lang moet wachten op belangrijke informatie. Zoek waar dat gebeurt.', [
      ['Zoek het hoofdwoord', 'In de door de commissie op maandag opnieuw gecontroleerde lijst komt lijst pas laat. Tot dat woord weet je nog niet precies wat beschreven wordt.'],
      ['Noem de zaak eerder', 'De lijst die de commissie maandag opnieuw controleerde noemt lijst meteen. De toelichting kan daarna volgen.'],
      ['Controleer het effect', 'De nieuwe versie heeft nog steeds een lange onderwerpgroep. Beoordeel of de lezer de toelichting hier nodig heeft; alleen woorden tellen geeft geen antwoord.'],
    ], 'Benoem het concrete leesprobleem voordat je gaat inkorten.', [['kern', 'Het hoofdwoord dat bepaalt wat voor groep je hebt.'], ['afhankelijkheid', 'Een grammaticale relatie tussen delen die soms ver uit elkaar staan.']]),
    guide('Een bijzin verplaatsen kan één probleem oplossen en tegelijk een nieuwe dubbelzinnigheid maken.', [
      ['Probeer beide aansluitingen', 'In de lijst van de docent bewaard die gisteren binnenkwam kan de lezer twijfelen: kwam de lijst binnen of de docent?'],
      ['Schrijf de bedoeling uit', 'Bedoel je de lijst, schrijf dan bijvoorbeeld: Gisteren kwam de lijst binnen. Noor heeft die lijst van de docent bewaard.'],
      ['Vergelijk de feiten', 'Je hebt de aansluiting duidelijker gemaakt. Controleer nu of je nog dezelfde lijst en dezelfde gebeurtenissen beschrijft.'],
    ], 'Controleer na verplaatsen altijd waar de bepaling nu op aansluit.', [['aanhechting', 'De plaats in de structuur waar een bepaling bij hoort.']]),
    guide('Een naamwoord voor een handeling en een passieve zin kunnen nuttig zijn. Kies vanuit wat je wilt vertellen.', [
      ['Vind de handeling', 'Controle van de lijst benoemt een handeling als een geheel. Daardoor kun je zeggen hoe lang die controle duurde.'],
      ['Vraag wie relevant is', 'De lijst werd gecontroleerd laat de uitvoerder weg. Dat kan passen als die onbekend of onbelangrijk is.'],
      ['Vergelijk een actieve versie', 'Noor controleerde de lijst noemt de uitvoerder wel. Kies die versie als het juist belangrijk is wie verantwoordelijk was.'],
    ], 'Maak relevante deelnemers zichtbaar; verbied geen constructie op zichzelf.', [['nominalisatie', 'Een handeling of toestand benoemen met een naamwoord, zoals controleren → controle.'], ['passief', 'Een zinsbouw zoals de lijst wordt gecontroleerd, waarbij de uitvoerder kan wegblijven.']]),
  ],
  'volle-zin-herzien': [
    guide('Herstel eerst de structuur van de zin. Dan wordt duidelijk welke werkwoordvorm bij welk onderwerp hoort.', [
      ['Zoek de hoofdmededeling', 'De verzameling ligt op tafel is de hoofdmededeling. Verzameling is enkelvoud, dus ligt past daarbij.'],
      ['Bekijk de bijzin apart', 'Die gisteren aankwamen vertelt iets over de brieven. Brieven is meervoud; daarom kan daar aankwamen staan.'],
      ['Test één verandering', 'Verander verzameling in verzamelingen. In de hoofdzin wordt ligt dan liggen; de bijzin over de brieven hoeft niet mee te veranderen.'],
    ], 'Elke deelzin heeft haar eigen relaties tussen onderwerp en werkwoord.', [['congruentie', 'Vormen passen grammaticaal bij elkaar, bijvoorbeeld een meervoudig onderwerp en een meervoudige persoonsvorm.']]),
    guide('Probeer bij twijfel een tweede lezing. Zo ontdek je wat je zin wél en niet vastlegt.', [
      ['Teken twee mogelijke situaties', 'Niet alle studenten leverden in kan passen bij enkele inleveraars, maar ook bij niemand die inleverde. Er moet minstens één niet-inleveraar zijn.'],
      ['Vergelijk met geen', 'Geen student leverde in sluit iedere inleveraar uit. Die herschrijving zegt dus meer dan niet alle.'],
      ['Controleer de achtergrond', 'Weer te laat presenteert een eerdere soortgelijke gebeurtenis als achtergrond. Is die gebeurtenis nog niet bekend, introduceer haar dan of kies een neutralere formulering.'],
    ], 'Maak precies zichtbaar welke situaties jouw formulering toelaat.', [['bereik', 'Het deel van de betekenis waarop een woord als niet of alle werkt.'], ['vooronderstelling', 'Informatie die de formulering als achtergrond presenteert.']]),
    guide('Een revisie is pas een verbetering als je kunt uitleggen welk probleem zij oplost en wat zij behoudt.', [
      ['Benoem je ingreep', 'Je kunt een naam herhalen om haar te verduidelijken, of een aankomst in een aparte zin zetten. Zeg welk probleem je daarmee aanpakt.'],
      ['Zoek de nieuwe informatie', 'Daarna voegt een tijdsvolgorde toe. Het woord is alleen passend wanneer je die volgorde werkelijk weet.'],
      ['Doe de controle opnieuw', 'Lees de nieuwe versie op onderwerp, verwijzing en betekenis. Een oplossing voor één probleem kan een nieuwe keuze noodzakelijk maken.'],
    ], 'Leg zowel de winst als de inhoudelijke gevolgen van je herschrijving uit.'),
  ],
  'volle-zin-meesterproef': [
    guide('Maak vóór het schrijven een lijst: welke feiten, relaties en onzekerheden moet je behouden?', [
      ['Noteer wat gegeven is', 'De vergadering is uitgesteld. Twee leden zijn afwezig. De opdracht zegt ook dat hun afwezigheid de reden is.'],
      ['Scheid feit en verband', 'Omdat mag hier, omdat de reden expliciet gegeven is. Zonder dat gegeven zou je het verband zelf toevoegen.'],
      ['Kies wat de lezer eerst nodig heeft', 'Een deelnemer wil waarschijnlijk eerst weten dat de vergadering niet doorgaat op het geplande moment. Laat die informatie vroeg zien.'],
    ], 'Een goede formulering begint met een betrouwbare inhoudslijst.'),
    guide('Bouw een zin vanuit de losse mededelingen en onderbouw elke verbinding.', [
      ['Maak de hoofdzin', 'De vergadering is uitgesteld. Vergadering is het enkelvoudige onderwerp bij is.'],
      ['Voeg de reden toe', 'Omdat twee leden afwezig zijn heeft een eigen meervoudig onderwerp bij zijn. De hele redenbijzin kan vooropstaan.'],
      ['Voeg de identificatie toe', 'Die voor vanmiddag gepland stond vertelt welke vergadering je bedoelt. Stond hoort binnen die bijzin bij die.'],
    ], 'Een samengestelde zin bestaat uit kleinere verbanden die je afzonderlijk kunt controleren.', [['deelzin', 'Een eenheid met een eigen werkwoordelijke structuur, zelfstandig of ingebed in een grotere zin.']]),
    guide('Vergelijk twee goede versies en kies welke jouw lezer het makkelijkst door de feiten leidt.', [
      ['Probeer een eenvoudiger groep', 'De vergadering van vanmiddag is korter dan de vergadering die voor vanmiddag gepland stond.'],
      ['Controleer de verwijzing', 'Gaat het nog om precies dezelfde vergadering? Een kortere groep is alleen geschikt als de identificatie behouden blijft.'],
      ['Oefen later opnieuw', 'Kies één lastig punt, zoals het onderwerp van een bijzin. Leg dat later met een nieuwe zin uit zonder naar dit voorbeeld te kijken.'],
    ], 'Kies op grond van inhoud en lezer; gebruik een nieuwe zin om jezelf later te testen.'),
  ],
  'alinea-kernzin': [
    guide('Een onderwerp noemt waarover je schrijft. Een kernzin vertelt wat je daarover wilt zeggen.', [
      ['Stel één leesvraag', 'Waar kan ik mijn reservering ophalen? Dat is een gerichte vraag; de bibliotheek is alleen een breed onderwerp.'],
      ['Geef het hoofdantwoord', 'Je kunt je reservering op twee locaties ophalen geeft het overzicht dat de lezer nodig heeft.'],
      ['Werk dat antwoord uit', 'De centrale bibliotheek en de wijkvestiging maken die twee locaties concreet. Beide horen bij dezelfde hoofdgedachte.'],
    ], 'Eén duidelijke mededeling geeft de overige zinnen een taak.', [['kernzin', 'De zin die de hoofdgedachte van een alinea uitdrukt.']]),
    guide('Een kernzin hoeft niet altijd vooraan te staan. Kies de plek die de lezer bij deze uitleg helpt.', [
      ['Bekijk eerst de gegevens', 'De balie is maandag en donderdag tot acht uur open. Dat zijn de twee concrete openingstijden in het voorbeeld.'],
      ['Zoek de bundelende zin', 'Op beide avonden kun je dus tot acht uur langskomen vat precies die twee gegevens samen.'],
      ['Bewaak de grens', 'De samenvatting zegt niets over dinsdag of andere avonden. Voeg die informatie niet ongemerkt toe.'],
    ], 'Een kernzin kan ook na de concrete gegevens komen.'),
    guide('Een zin hoort in de alinea als zij de hoofdgedachte helpt uitleggen. Alleen hetzelfde onderwerpwoord is niet genoeg.', [
      ['Geef iedere zin een taak', 'De pas en het scannen vertellen hoe de zelfservicebalie werkt. Ze beantwoorden samen één vraag.'],
      ['Zoek de onderwerpwissel', 'Inschrijven voor kinderactiviteiten gaat over een andere procedure. Die zin helpt de zelfservice-uitleg niet verder.'],
      ['Schrap of verplaats bewust', 'Heeft de lezer die informatie nodig, geef haar dan een eigen plek met een passende hoofdgedachte.'],
    ], 'Bepaal de inhoudelijke eenheid voordat je alinea’s op lengte verdeelt.'),
  ],
  'alinea-verwijzing': [
    guide('Een verwijswoord is duidelijk als de lezer kan bepalen welke persoon of zaak bedoeld is.', [
      ['Vul het verwijswoord in', 'Bij de fiets naast de brommer kan die naar beide voertuigen wijzen. Probeer beide namen in de zin.'],
      ['Vergelijk de lezingen', 'De fiets is op slot en de brommer is op slot zeggen verschillende dingen. De nabijste naam beslist de keuze niet automatisch.'],
      ['Noem de bedoelde zaak', 'De fiets herhalen maakt de bedoelde lezing duidelijk. Die herhaling heeft een nuttige functie.'],
    ], 'Test alle passende kandidaten voordat je een verwijzing duidelijk noemt.', [['antecedent', 'De eerdere uitdrukking waarnaar een verwijswoord terugwijst.']]),
    guide('Dat kan een hele mededeling oppakken. Benoem de gebeurtenis als de verwijzing anders te ruim blijft.', [
      ['Bekijk de eerdere gebeurtenissen', 'De vrachtwagen keert terug en de levering wordt uitgesteld. Dat zijn twee verschillende gebeurtenissen.'],
      ['Kies wat je wilt oppakken', 'Dat uitstel wijst duidelijk naar het uitstellen van de levering, niet naar het terugkeren van de vrachtwagen.'],
      ['Kies een nauwkeurig label', 'Uitstel is niet hetzelfde als afzegging of mislukking. Gebruik alleen een label dat door de feiten wordt gedragen.'],
    ], 'Maak de verwijzing preciezer zonder de gebeurtenis zwaarder te benoemen.'),
    guide('Een vorm als daarin kan tegelijk terugverwijzen én een relatie aangeven.', [
      ['Zoek de eerder genoemde plek', 'De fiches liggen in een lade. Die lade blijft beschikbaar als plek voor de volgende mededeling.'],
      ['Schrijf daarin uit', 'Daarin betekent hier in die lade. Je ziet nu zowel de plaats als de relatie in.'],
      ['Controleer elk gebruik opnieuw', 'Niet elk er heeft zo’n eerdere plek of zaak nodig. In er staat een doos helpt er een nieuwe doos introduceren.'],
    ], 'Vraag steeds: waar verwijst dit naar en welke relatie drukt het uit?'),
  ],
  'alinea-woordketens': [
    guide('Verschillende woorden kunnen dezelfde zaak blijven volgen. Maak die keten herkenbaar.', [
      ['Introduceer de zaak', 'Een merel verschijnt op de schutting. De lezer heeft nu één specifieke vogel in beeld.'],
      ['Neem haar passend terug', 'De vogel kan naar die merel verwijzen, omdat een merel een soort vogel is. Er hoeft geen tweede dier te zijn.'],
      ['Controleer concurrenten', 'Zijn er inmiddels twee vogels genoemd, dan kan de vogel te vaag worden. Herhaal zo nodig merel of een andere duidelijke naam.'],
    ], 'Een woordketen moet dezelfde zaak of een duidelijke categorieverbinding herkenbaar houden.', [['woordketen', 'Woorden die in de tekst via dezelfde zaak of een inhoudelijke relatie met elkaar verbonden zijn.']]),
    guide('Gebruik een vaste naam als afwisseling de lezer zou laten twijfelen.', [
      ['Bepaal wat de lezer zoekt', 'In de instructie moet de lezer dezelfde reservering openen en wijzigen. De naam helpt de handeling herkennen.'],
      ['Test een vervanging', 'Een synoniem kan net iets anders betekenen of niet overeenkomen met de naam van de knop in het systeem.'],
      ['Kies de helderste versie', 'Herhaal reservering wanneer dat de route duidelijk houdt. Gebruik een voornaamwoord alleen als de bedoelde zaak goed herkenbaar blijft.'],
    ], 'Nauwkeurigheid is een goede reden om een woord te herhalen.'),
    guide('Je kunt inhoud weglaten of vervangen als de lezer precies kan terugvinden wat ontbreekt.', [
      ['Zoek de volledige handeling', 'Mila sorteert de kaarten noemt een handeling met haar voorwerp.'],
      ['Vul de vervanging aan', 'Amir doet dat ook betekent hier dat Amir eveneens de kaarten sorteert. De vorige zin levert de inhoud.'],
      ['Controleer de afstand', 'Komt er een andere handeling tussen, dan kan dat een nieuwe kandidaat krijgen. Schrijf de handeling dan opnieuw uit.'],
    ], 'Korter schrijven werkt alleen als de weggelaten inhoud herstelbaar blijft.', [['ellips', 'Weglating van taal die vanuit de context terug te vinden is.'], ['substitutie', 'Een vervangende uitdrukking neemt eerdere inhoud over, zoals doet dat.']]),
  ],
  'alinea-relaties': [
    guide('Bepaal eerst wat twee mededelingen met elkaar te maken hebben. Kies daarna een passend verbindingswoord.', [
      ['Noem de algemene categorie', 'De winkel verkoopt reparatiemateriaal geeft een ruime categorie.'],
      ['Bekijk wat erop volgt', 'Bandenplakkers en fietspompen zijn concrete voorbeelden binnen die categorie.'],
      ['Kies het passende signaal', 'Zo kan hier voorbeelden inleiden. Het beschrijft op deze plek geen tijdsvolgorde.'],
    ], 'Het verband kiest het signaalwoord, niet andersom.'),
    guide('Een voorwaarde zegt wanneer iets geldt. Zij zegt nog niet dat die voorwaarde vervuld is.', [
      ['Zoek de mogelijkheid', 'De zaal gebruiken is wat mogelijk wordt gemaakt.'],
      ['Zoek de voorwaarde', 'Mits je vooraf reserveert betekent: vooraf reserveren is vereist voor die mogelijkheid.'],
      ['Voorkom een extra feit', 'De zin zegt niet dat je al gereserveerd hebt. Een herschrijving moet dat openlaten.'],
    ], 'Behoud het verschil tussen een voorwaarde en een vastgesteld feit.', [['voorwaarde', 'Een omstandigheid waarvan het gelden van een andere mededeling afhankelijk wordt gemaakt.']]),
    guide('Een verband kan al duidelijk zijn door concrete informatie. Dan is een extra signaalwoord soms overbodig.', [
      ['Lees de tijdstippen', 'De uitleg start om negen uur. Het oefenen begint om tien uur.'],
      ['Leg de volgorde vast', 'De twee tijden laten rechtstreeks zien wat eerst en wat later gebeurt.'],
      ['Beoordeel de toevoeging', 'Daarna kan helpen als de lezer de stappen moet volgen. Het is hier niet nodig om de tijdsrelatie te kunnen begrijpen.'],
    ], 'Maak het verband helder met voldoende inhoud, eventueel aangevuld met een signaalwoord.'),
  ],
  'alinea-thema-rhema': [
    guide('Het vertrekpunt van een mededeling is niet automatisch het grammaticale onderwerp.', [
      ['Vraag waarmee de zin begint', 'Die vijver ontwerpt Noor begint met de vijver: daarover wordt iets meegedeeld.'],
      ['Zoek het onderwerp apart', 'Noor ontwerpt; Noor is het onderwerp. Die vijver is hier wat zij ontwerpt.'],
      ['Bekijk wat de volgende zin oppakt', 'Het ontwerp kan daarna als nieuw vertrekpunt dienen. Je volgt de informatie, niet alleen de onderwerpvormen.'],
    ], 'Onderscheid het informatievertrekpunt van de grammaticale functie.', [['thema', 'Het gekozen vertrekpunt van de mededeling in deze tekstanalyse.'], ['rhema', 'Wat de zin over dat vertrekpunt verder meedeelt.']]),
    guide('Nieuwe informatie uit een zin kan de start van de volgende zin worden.', [
      ['Introduceer een nieuw onderdeel', 'De werkplaats krijgt een uitleenkast. Die kast is de nieuwe informatie.'],
      ['Geef die informatie door', 'De kast heeft vakken. De kast wordt het vertrekpunt; de vakken komen erbij.'],
      ['Volg de volgende schakel', 'Die vakken zijn genummerd neemt vervolgens de vakken terug. Elke stap bouwt op iets dat al is ingevoerd.'],
    ], 'Laat de lezer een nieuwe schakel eerst leren kennen voordat je ermee verdergaat.', [['lineaire progressie', 'Een verloop waarbij informatie uit de ene zin het vertrekpunt van een volgende wordt.']]),
    guide('Een alinea kan verschillende onderdelen bespreken die onder één groter onderwerp vallen.', [
      ['Bepaal het grotere geheel', 'Het buurthuis wordt opgeknapt geeft de gezamenlijke hoofdgedachte.'],
      ['Koppel de onderdelen', 'Het dak en de keuken zijn beide delen van dat buurthuis. Daardoor blijft de sprong tussen die onderdelen begrijpelijk.'],
      ['Controleer de bijdrage', 'Isolatie en stopcontacten werken het opknappen uit. Een ander onderdeel hoort erbij als het dezelfde hoofdgedachte helpt uitleggen.'],
    ], 'Een nieuw vertrekpunt hoeft geen nieuw hoofdonderwerp te betekenen.'),
  ],
  'alinea-patronen': [
    guide('Laat de uitleg van overzicht naar concreet voorbeeld gaan.', [
      ['Geef het overzicht', 'De studio heeft plekken voor verschillende taken vertelt wat de alinea zal uitwerken.'],
      ['Maak de indeling duidelijk', 'Overleggen en alleen werken laten zien welke taken je onderscheidt.'],
      ['Laat één onderdeel zien', 'De drie cabines zijn een concreet voorbeeld van de plekken voor individueel werk. Het voorbeeld sluit aan bij de aangekondigde indeling.'],
    ], 'Een goed voorbeeld maakt een eerdere mededeling concreet.'),
    guide('Maak duidelijk wat het probleem is, wat je probeert en hoe je het resultaat gaat controleren.', [
      ['Noem het waargenomen probleem', 'De labels laten los in de regen. Dat is het verschijnsel dat je wilt aanpakken.'],
      ['Beschrijf de proefaanpak', 'Watervaste labels testen is een mogelijke oplossing. De proef is nog geen bewezen succes.'],
      ['Noem de controle', 'Na een week kijk je of de labels vastzitten. Pas dat resultaat geeft informatie over het slagen van de aanpak.'],
    ], 'Een maatregel voorstellen is iets anders dan aantonen dat zij werkt.'),
    guide('Vergelijk twee opties op dezelfde kenmerken. Houd ontbrekende gegevens herkenbaar.', [
      ['Kies één kenmerk', 'Vergelijk eerst het aantal zitplaatsen: zaal A heeft dertig, zaal B twintig.'],
      ['Vergelijk het volgende kenmerk', 'Beide zalen zijn met een lift bereikbaar. Nu is ook de bereikbaarheid voor beide opties bekend.'],
      ['Laat onbekend ook onbekend', 'Over de prijs zegt het voorbeeld niets. Je kunt daaruit dus geen goedkoper of duurder afleiden.'],
    ], 'Gebruik dezelfde meetlat en vul ontbrekende eigenschappen niet zelf in.'),
  ],
  'alinea-impliciet': [
    guide('Een lezer kan een verband soms zelf leggen. Of dat lukt, hangt af van de inhoud en de voorkennis.', [
      ['Zoek de aangekondigde groep', 'Het gebouw heeft twee ingangen kondigt twee onderdelen aan.'],
      ['Koppel de concrete onderdelen', 'De hoofdingang en de zijingang vullen die twee plekken in. De woorden maken de verbinding herkenbaar.'],
      ['Denk aan je lezer', 'Een nieuwe bezoeker moet de benamingen kunnen volgen. Voeg uitleg toe als de benodigde koppeling voor die lezer ontbreekt.'],
    ], 'Een onbenoemd verband is bruikbaar wanneer de lezer het betrouwbaar kan reconstrueren.', [['impliciet', 'Niet rechtstreeks uitgesproken, maar uit de inhoud en context af te leiden.']]),
    guide('Een verbindingswoord kan een bekend verband aanwijzen. Het kan geen ontbrekend feit vervangen.', [
      ['Zoek de ontbrekende schakel', 'Waarom kun je geen sleutel ophalen? In het voorbeeld is de balie op dat uur niet bezet.'],
      ['Noem het concrete gegeven', 'Van twaalf tot één is geen medewerker aanwezig. Die informatie maakt de praktische beperking begrijpelijk.'],
      ['Koppel de juiste onderdelen', 'Tijdens dat uur verbindt de beperking met hetzelfde tijdvak. Zonder het gegeven over de balie zou daarom slechts een onbekend verband verbergen.'],
    ], 'Vul eerst de informatie aan die nodig is om het verband te begrijpen.'),
    guide('Duidelijker schrijven hoeft een vermoeden niet in zekerheid te veranderen.', [
      ['Scheid de waarnemingen', 'De lamp valt uit. Noor vertrekt kort daarna. Beide gebeurtenissen zijn gegeven.'],
      ['Test het oorzakelijke verband', 'Zou Noor ook om een andere reden vertrokken kunnen zijn? Dan bewijst de volgorde geen oorzaak.'],
      ['Schrijf wat je wel weet', 'Kort daarna bewaart de volgorde. Haar reden is niet bekend houdt de oorzaak eerlijk open.'],
    ], 'Maak de bekende inhoud duidelijk en laat onbekende verbanden open.'),
  ],
  'alinea-ritme': [
    guide('Zoek waar de lezer veel moet onthouden. Het aantal woorden is alleen een aanwijzing.', [
      ['Vind de hoofdhandeling', 'De medewerker controleert de passen is de kern van het voorbeeld.'],
      ['Bekijk de onderbreking', 'Informatie over de balie en de sleutels staat tussen medewerker en controleert. De lezer moet op de hoofdhandeling wachten.'],
      ['Verplaats gericht', 'Staat die informatie elders beter, geef haar dan een eigen zin. Behoud haar hier als zij nodig is om de medewerker te herkennen.'],
    ], 'Los een concrete verwerkingslast op, geen willekeurige woordgrens.'),
    guide('Bij het splitsen van een zin moeten voorwaarden en andere verbanden herkenbaar blijven.', [
      ['Zoek de voorwaarde', 'Je mag de kast gebruiken als je een sleutel hebt koppelt toestemming aan het bezit van een sleutel.'],
      ['Bewaar die relatie', 'Zonder sleutel blijft de kast gesloten houdt de beperking zichtbaar in de volgende zin.'],
      ['Vergelijk met een verkeerde splitsing', 'Je mag de kast gebruiken. Je hebt een sleutel beweert dat de sleutel aanwezig is. Dat nieuwe feit stond niet in de oorspronkelijke voorwaarde.'],
    ], 'Een punt maakt een voorwaarde niet vanzelf tot een feit.'),
    guide('Gebruik zinslengte om informatie te groeperen en een belangrijke instructie nadruk te geven.', [
      ['Groepeer het proces', 'De controle van beschikbaarheid en het ontvangen van een bevestiging horen bij de reservering.'],
      ['Laat de instructie opvallen', 'Wacht op die bevestiging staat kort en zelfstandig na de procesbeschrijving. Zo valt de handeling voor de lezer op.'],
      ['Controleer de samenhang', 'Die bevestiging moet duidelijk terugwijzen naar de mail. Variatie in lengte werkt alleen als de inhoudelijke verbinding behouden blijft.'],
    ], 'Kies lengteverschil omdat het de lezer helpt, niet om een vast patroon te volgen.'),
  ],
  'alinea-overgang': [
    guide('Een goede overgang neemt iets bekends mee en laat zien wat de volgende alinea toevoegt.', [
      ['Pak het bekende onderdeel op', 'Deze ruimtes verwijst terug naar de eerder beschreven vergaderruimtes.'],
      ['Open de nieuwe vraag', 'Via één formulier reserveren vertelt wat de lezer nu over die ruimtes gaat leren.'],
      ['Lees de opening los', 'De nieuwe zin moet ook voldoende inhoud bevatten voor iemand die de tekst scant. Alleen daarover nu meer vertelt die inhoud niet.'],
    ], 'Laat de overgang tegelijk aansluiten en richting geven.'),
    guide('Kies een overgang die bij de werkelijke relatie tussen de alinea’s past.', [
      ['Bepaal de verwachting', 'Gratis kan bij een bezoeker de verwachting oproepen dat deelname weinig drempels heeft.'],
      ['Voeg de beperking toe', 'Wel vooraf reserveren laat zien dat er toch een praktische voorwaarde is. Gratis en reserveren kunnen tegelijk gelden.'],
      ['Vermijd een sterker verband', 'De nieuwe alinea is geen logisch gevolg van gratis. Dus zou op die plek een ander verband suggereren.'],
    ], 'Noem een toevoeging, beperking of volgende stap alleen als de inhoud dat verband draagt.'),
    guide('Laat het slot en de volgende opening samenwerken zonder dezelfde aankondiging te herhalen.', [
      ['Lees het slot', 'Na het kiezen van een werkplek regel je de toegang kondigt de volgende handeling aan.'],
      ['Controleer de terugkoppeling', 'Daarvoor verwijst naar toegang regelen. De dagpas maakt concreet hoe je dat doet.'],
      ['Schrap dubbel werk', 'Je hoeft de hele vorige alinea niet nog eens samen te vatten. Houd de korte koppeling die de nieuwe informatie begrijpelijk maakt.'],
    ], 'Een precieze schakel kan voldoende zijn om twee alinea’s te verbinden.'),
  ],
  'alinea-revisie': [
    guide('Zet eerst vast welke informatie klopt. Begin daarna pas aan de mooie formulering.', [
      ['Maak een feitenlijst', 'De leeszaal is maandag gesloten. Er is onderhoud. De studieruimte blijft open.'],
      ['Markeer de onzekerheid', 'De gegevens bevestigen niet dat het onderhoud de sluiting veroorzaakt. Dat verband hoort voorlopig bij wat je nog moet navragen.'],
      ['Bepaal de leesvraag', 'Een bezoeker wil weten welke ruimte beschikbaar is en wanneer. Orden de alinea rond die praktische informatie.'],
    ], 'Bewaar het onderscheid tussen een gegeven feit en een vermoedelijke relatie.'),
    guide('Introduceer een zaak voordat je ernaar verwijst. Zo kan de lezer de route volgen.', [
      ['Noem de wijziging', 'De leeszaal is maandag gesloten geeft de eerste praktische mededeling.'],
      ['Introduceer het alternatief', 'Je kunt die dag in de studieruimte terecht noemt de nieuwe ruimte en koppelt de dag aan maandag.'],
      ['Neem het alternatief terug', 'Daar zijn twintig werkplekken verwijst naar de zojuist genoemde studieruimte. De lezer hoeft de plek niet te raden.'],
    ], 'Een verwijzing wordt duidelijk door de volgorde waarin je de informatie aanbiedt.'),
    guide('Leg de nieuwe versie naast de oorspronkelijke feiten. Controleer wat je verduidelijkt en wat nog onbekend blijft.', [
      ['Zoek de oorspronkelijke twijfel', 'Na de zaal en de balie is die niet duidelijk genoeg: beide zijn mogelijke kandidaten.'],
      ['Noem de bedoelde kandidaat', 'De balie gaat dinsdag weer open maakt de heropening van de balie expliciet.'],
      ['Bewaar de inhoudsgrens', 'Over het heropenen van de zaal staat niets vast. Voeg geen datum toe om het bericht mooier af te ronden.'],
    ], 'Een revisie verduidelijkt bestaande informatie zonder onbekende feiten aan te vullen.'),
  ],
};

const book = (bookId: BookId, section: string) => ({ bookId, section });
const CAPSTONE_SOURCES: Record<string, SectionTeaching['sources'][]> = {
  'volle-zin-combineren': [
    [book('kroeger', 'H18, §§18.2–18.4, pp.330–338: causale betekenis en zinsbouw')],
    [book('natural-syntax', 'H14: relatieve bijzinnen en de functie van de volledige naamwoordgroep'), book('ans', '§14.5.3.8.iii: beperkende en uitbreidende betrekkelijke bijzinnen')],
    [book('kroeger', 'H1, §§1.2–1.5, pp.5–10; H12, pp.217–227: vorm, inhoud en gebruik')],
  ],
  'volle-zin-leesbaarheid': [
    [book('tallerman', 'H5–6: constituenten en afhankelijkheden; leesbaarheid is een eigen Nederlandse toepassing')],
    [book('natural-syntax', 'H3: hiërarchie, constituenten en structurele dubbelzinnigheid')],
    [book('tallerman', 'H3 §3.4.2, PDF120–121: nominalisatie; H6 §6.6, PDF238–252: functies en rollen; H7 §7.1, PDF267–274: passief')],
  ],
  'volle-zin-herzien': [
    [book('natural-syntax', 'H2: syntactische kenmerken en congruentie; H14: relatieve bijzinnen')],
    [book('kroeger', 'H3, §3.4, pp.40–47; H14, §14.5, pp.264–267: vooronderstelling en bereik')],
    [book('kroeger', 'H3, §3.3, pp.37–39; H18, §§18.2–18.3, pp.330–335: behouden inhoud en toegevoegde verbanden')],
  ],
  'volle-zin-meesterproef': [
    [book('kroeger', 'H1, §§1.2–1.5, pp.5–10; H18, §18.2, pp.330–332: inhoud en reden')],
    [book('natural-syntax', 'H2–3 en H14: kenmerken, hiërarchie en relatieve bijzinnen')],
    [book('kroeger', 'H12, §§12.1–12.3, pp.217–222: betekenis van samengestelde uitdrukkingen')],
  ],
};

export const WRITING_TEACHING: Record<string, SectionTeaching[]> = Object.fromEntries(
  [...CAPSTONE_LESSONS, ...ALINEA_LESSONS].map(lesson => [lesson.id, GUIDES[lesson.id]!.map((section, index) => ({
    ...section, sources: CAPSTONE_SOURCES[lesson.id]?.[index] ?? lesson.sources.map(({ bookId, section }) => ({ bookId, section })),
  }))]),
);
