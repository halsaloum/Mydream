import type { SectionTeaching } from './types';

type Step = SectionTeaching['steps'][number];
type Term = NonNullable<SectionTeaching['terms']>[number];

function guide(
  core: string,
  steps: [Step, Step, Step],
  terms: Term[],
  memory: string,
  section: string,
  lieberSection?: string,
): SectionTeaching {
  return {
    core, steps, terms, memory,
    sources: [
      { bookId: 'haspelmath', section, note: 'Opnieuw gelezen in het aangeleverde boek; uitleg en Nederlandse toepassing zijn in eigen woorden geschreven.' },
      ...(lieberSection ? [{ bookId: 'lieber' as const, section: lieberSection, note: 'Hoofdstuktekst en bijbehorende beeldvoorbeelden opnieuw gelezen in de aangeleverde EPUB.' }] : []),
    ],
  };
}

/** Individuele uitleg bij alle 48 onderdelen; geen instructiesjabloon voor de interface. */
export const MORPHOLOGY_TEACHING: Record<string, SectionTeaching[]> = {
  'basis-woord': [
    guide('Plantjes is één geschreven woord, maar je herkent er plant, verkleining en meervoud in.', [
      { title: 'Begin bij plant', text: 'Plant benoemt wat het is. Er is nog geen verkleining of meervoud toegevoegd.' },
      { title: 'Maak het kleiner', text: 'Plantje voegt een verkleinende betekenis toe. Vergelijk kast en kastje: dezelfde relatie komt terug.' },
      { title: 'Maak er meerdere van', text: 'Plantjes betekent meerdere plantjes. De spaties tellen geschreven woorden; ze laten deze binnenbouw niet zien.' },
    ], [{ term: 'Woordbouw', meaning: 'De relaties tussen betekenisvolle onderdelen en vormen van woorden.' }], 'Eén woord op papier kan meer dan één betekenisbijdrage bevatten.', '§1.1, p. 1–3; §9, p. 189 (PDF 18–20, 206)', "§1.1–1.2; §3.2"),
    guide('Een herkenbaar stukje telt pas als bouwsteen wanneer ook zijn betekenis of functie terugkomt.', [
      { title: 'Leg twee paren naast elkaar', text: 'Huis wordt huisje; kast wordt kastje. In beide paren herken je de basis en een verkleinende bijdrage.' },
      { title: 'Controleer de betekenis', text: 'Een gelijke letterreeks is nog geen gelijke bouwsteen. Ta-fel verdeelt de uitspraak, maar levert geen twee betekenissen op.' },
      { title: 'Houd een lastig geval open', text: 'Bij meisje is meis geen gewoon vrij basiswoord. Dat vraagt extra onderzoek: sommige bases kunnen alleen binnen een groter woord voorkomen.' },
    ], [{ term: 'Basis', meaning: 'Het woord of woorddeel waarop een bepaalde bewerking werkt.' }], 'Vergelijk steeds vorm én betekenis.', '§1.1, p. 2–3; §2.2, p. 20–22 (PDF 19–20, 37–39)', "§3.2; §3.3.4–3.3.5"),
    guide('Een goede ontleding zegt wat je ziet, wat je daaruit afleidt en wat je nog moet onderzoeken.', [
      { title: 'Noteer de waarneming', text: 'Raamplantjeswinkel eindigt op winkel. Dat kun je rechtstreeks aan de vorm aanwijzen.' },
      { title: 'Doe een kleine voorspelling', text: 'Het geheel is waarschijnlijk een soort winkel. Winkel geeft daar een concrete aanwijzing voor.' },
      { title: 'Controleer met de situatie', text: 'Wat verkoopt die winkel precies? De woordbouw geeft een verwachting; de situatie moet de precieze relatie invullen.' },
    ], [{ term: 'Hypothese', meaning: 'Een onderbouwd voorstel dat je aan nieuwe gegevens kunt toetsen.' }], 'Waarneming → voorstel → controle.', '§1.1, p. 2–3; §3, p. 57–59; §7.1, p. 139–140 (PDF 19–20, 74–76, 156–157)'),
  ],
  'basis-lexeem': [
    guide('In plant planten plant tel je drie voorkomens, maar slechts twee verschillende geschreven vormen.', [
      { title: 'Tel elke plek', text: 'Plant staat op plek 1 en plek 3; planten staat op plek 2. Samen zijn dat drie tokens.' },
      { title: 'Haal herhaling weg', text: 'De lijst met verschillende vormen is plant, planten. Dat zijn twee vormtypes.' },
      { title: 'Zeg wat je telt', text: 'Voor een telling van lexemen vraag je ook of planten hier het meervoud van plant is. Een telling van letters of vormen beantwoordt die vraag nog niet.' },
    ], [{ term: 'Token', meaning: 'Eén voorkomen op één plek.' }, { term: 'Vormtype', meaning: 'Eén verschillende geschreven vorm in onze telling.' }], 'Voorkomens en verschillende vormen zijn twee tellingen.', '§2.1, p. 15–17 (PDF 32–34)', "§1.3"),
    guide('Loop, loopt en liep horen bij hetzelfde werkwoord LOPEN. Dat overkoepelende woord noemen we een lexeem.', [
      { title: 'Vergelijk vandaag en gisteren', text: 'Vandaag loop ik; gisteren liep ik. De tijd verandert, maar het blijft het werkwoord lopen.' },
      { title: 'Verzamel de vormen', text: 'Loop, loopt, lopen, liep en gelopen zijn grammaticale vormen van LOPEN. De hoofdletters noemen hier het lexeem.' },
      { title: 'Vertrouw niet alleen op letters', text: 'Ben en is horen allebei bij ZIJN. Sterk verschillende vormen kunnen dus toch één lexeem vormen.' },
    ], [{ term: 'Lexeem', meaning: 'De woordidentiteit die grammaticale vormen zoals loop en liep samen verbindt.' }], 'Andere grammaticale vorm, hetzelfde lexeem.', '§2.1, p. 15–18; §2.3, p. 24–25 (PDF 32–35, 41–42)', "§1.3; §6.4.2"),
    guide('Werkt en werkte zijn vormen van WERKEN. Werker is een ander woord in dezelfde ruimere familie.', [
      { title: 'Zoek de grammaticale reeks', text: 'Ik werk, zij werkt en gisteren werkte ik laten vormen van één werkwoord zien. Die vormen horen bij één paradigma.' },
      { title: 'Zoek het nieuwe woord', text: 'Werker benoemt iemand. Het is een zelfstandig naamwoord met eigen vormen, zoals werkers.' },
      { title: 'Verbind de familie', text: 'Werken, werker, werkloos en werkplek zijn verwant. Hun familie is groter dan de grammaticale reeks van één lexeem.' },
    ], [{ term: 'Paradigma', meaning: 'De grammaticale vormen van één lexeem, geordend naar hun functie.' }, { term: 'Woordfamilie', meaning: 'Meerdere woorden die via vorm en betekenis verwant zijn.' }], 'Een paradigma hoort bij één lexeem; een familie verbindt er meerdere.', '§2.1, p. 16–18 (PDF 33–35)', "§1.3; §6.7"),
  ],
  'basis-woordsoorten': [
    guide('Een woordsoort herken je aan wat een woord in de grammatica kan, ook als de betekenis geen duidelijk ding of actie noemt.', [
      { title: 'Probeer het betekenishulpje', text: 'Stoel lijkt een duidelijk ding; lopen een activiteit. Dat helpt bij de eerste herkenning.' },
      { title: 'Bekijk een tegenvoorbeeld', text: 'Stilte is geen tastbaar voorwerp, maar de stilte is een gewone naamwoordgroep. Weten noemt geen zichtbare actie, maar weet en wist zijn werkwoordvormen.' },
      { title: 'Zoek grammaticaal bewijs', text: 'Controleer de omgeving en mogelijke vormen. Een betekenishulpje is sterker wanneer het zinsgedrag erbij past.' },
    ], [{ term: 'Woordsoort', meaning: 'Een grammaticale categorie, zoals zelfstandig naamwoord of werkwoord.' }], 'Kijk naar betekenis én grammaticaal gedrag.', '§2.1, p. 15–18; §5.1, p. 81–86 (PDF 32–35, 98–103)', "§3.3.1; §6.7"),
    guide('De zin helpt bepalen welke woordsoort een vorm hier heeft: een groen hek gedraagt zich anders dan het groen.', [
      { title: 'Kijk naar de buren', text: 'In een groen hek hoort groen bij hek. In het groen staat groen zelf als kern van de groep.' },
      { title: 'Vergelijk de vormen', text: 'Rustig kan rustiger worden; een werkwoord heeft vormen zoals werkt en werkte. Zulke mogelijkheden geven extra aanwijzingen.' },
      { title: 'Benoem het gebruik in deze zin', text: 'Leg uit welk gedrag jouw label ondersteunt. Dezelfde geschreven vorm hoeft niet overal dezelfde categorie te hebben.' },
    ], [{ term: 'Distributie', meaning: 'De plaatsen en omgevingen waarin een vorm kan voorkomen.' }], 'Lees eerst de zin, kies daarna de categorie.', '§3.1.4, p. 39–40; §5.2, p. 86–89; §11.3, p. 253–257 (PDF 56–57, 103–106, 270–274)', "§3.5"),
    guide('Woordsoort zegt wat voor woord iets is; zinsfunctie zegt hoe de hele groep in deze zin wordt gebruikt.', [
      { title: 'Houd de groep vast', text: 'De leerling is een naamwoordgroep. Leerling blijft daarin een zelfstandig naamwoord.' },
      { title: 'Vergelijk twee zinnen', text: 'De leerling groet de docent: de leerling is onderwerp. De docent groet de leerling: dezelfde groep is nu lijdend voorwerp.' },
      { title: 'Geef twee afzonderlijke labels', text: 'Noem eerst de bouw, daarna de functie in de zin. Een naamwoordgroep kan dus verschillende zinsfuncties vervullen.' },
    ], [{ term: 'Naamwoordgroep', meaning: 'Een groep met een naamwoord als kern, zoals de nieuwe leerling.' }, { term: 'Zinsfunctie', meaning: 'Het verband van een groep met de rest van de zin, zoals onderwerp of lijdend voorwerp.' }], 'De bouw kan gelijk blijven terwijl de zinsfunctie verandert.', '§11.1.1, p. 234–236 (PDF 251–253)'),
  ],
  'basis-vorm-functie': [
    guide('Je bekijkt dezelfde woorden met drie vragen: hoe zijn ze gebouwd, welke taak hebben ze in de zin en wat stellen ze voor in de gebeurtenis?', [
      { title: 'Hoe is de groep gebouwd?', text: 'In de lange brief is brief de kern. De hele combinatie is daarom een naamwoordgroep.' },
      { title: 'Wat is haar functie in deze zin?', text: 'In Noor schrijft de lange brief is de groep het lijdend voorwerp. Dat label gaat over de relatie met schrijft.' },
      { title: 'Welke deelnemer stelt zij voor?', text: 'De brief is de zaak die geschreven wordt. Bij Noor vreest de storm is Noor juist de ervaarder: onderwerp betekent dus niet altijd doener.' },
    ], [{ term: 'Vorm', meaning: 'De interne bouw van de groep.' }, { term: 'Functie', meaning: 'De relatie van de groep met de rest van deze zin.' }, { term: 'Betekenisrol', meaning: 'Hoe de deelnemer bij de beschreven situatie betrokken is.' }], 'Bouw → zinsverband → deelnemer. Drie vragen over dezelfde groep.', '§11.1.1, p. 234–236 (PDF 251–253)', "§8.2; §10.7"),
    guide('Bij een passieve zin blijven de deelnemers herkenbaar, maar krijgen ze een andere grammaticale plaats.', [
      { title: 'Volg de schrijver', text: 'Noor schrijft de brief: Noor is onderwerp én schrijver. De brief wordt door Noor geschreven: Noor blijft schrijver, maar staat in de door-groep.' },
      { title: 'Volg de brief', text: 'De brief blijft de geschreven zaak. In de passieve zin is die groep onderwerp geworden.' },
      { title: 'Laat de schrijver weg', text: 'De brief wordt geschreven noemt geen schrijver. Zo’n schrijfhandeling heeft wel een schrijver, ook als die onbekend is.' },
    ], [{ term: 'Passief', meaning: 'Een zinsbouw waarin de handelende deelnemer geen gewoon onderwerp is; vaak staat de beïnvloede zaak als onderwerp.' }], 'Andere zinsfunctie betekent niet automatisch een andere deelnemer.', '§11.1.2, p. 237–239 (PDF 254–256)', "§8.2.1"),
    guide('Zoek het onderwerp met zinsgedrag: bij de brief wordt → de brieven worden verandert de persoonsvorm mee.', [
      { title: 'Kijk verder dan het begin', text: 'In Morgen schrijft Noor de brief staat morgen voorop. Noor blijft het onderwerp.' },
      { title: 'Verander het getal', text: 'De lange brief wordt geschreven wordt de lange brieven worden geschreven. Wordt verandert mee naar worden.' },
      { title: 'Neem de hele groep', text: 'Het onderwerp is de lange brief, met de woorden die bij brief horen. Alleen brief aanwijzen geeft de kern, nog niet de volledige onderwerpsgroep.' },
    ], [{ term: 'Congruentie', meaning: 'Vormen die grammaticaal op elkaar aansluiten, zoals de brieven en worden.' }], 'Beginpositie, kern en onderwerp zijn drie verschillende aanwijzingen.', '§5.3.1, p. 90–92; §11.1.1–2, p. 234–238 (PDF 107–109, 251–255)', "§6.6"),
  ],
  'woordbouw-morfemen': [
    guide('Her- draagt in herdruk en herbouw iets bij: opnieuw. Zo zoek je de kleinste betekenisvolle eenheden.', [
      { title: 'Vergelijk de basis met het resultaat', text: 'Druk en herdruk zijn verwant. Herdruk voegt een opnieuw-bijdrage toe.' },
      { title: 'Zoek hetzelfde verschil elders', text: 'Bouw en herbouw laten die bijdrage opnieuw zien. Het terugkerende contrast steunt her- als morfeem.' },
      { title: 'Herken de grens van het knippen', text: 'Loop en liep verschillen in tijd, zonder los verleden-tijdstukje. Een grammaticale bijdrage hoeft dus niet altijd een eigen afknipbaar stukje te hebben.' },
    ], [{ term: 'Morfeem', meaning: 'De kleinste eenheid met een herkenbare betekenis of grammaticale functie in deze analyse.' }], 'Knip waar vorm en functie samen terugkeren; vergelijk anders hele vormen.', '§1.1, p. 2–3; §2, p. 14–15; §3.1, p. 34–38 (PDF 19–20, 31–32, 51–55)', "§3.2; §5.4; §10.2"),
    guide('Huis kan als woord voorkomen. Her- met de betekenis opnieuw heeft een basis nodig. Dat is het verschil tussen vrij en gebonden.', [
      { title: 'Probeer gewoon taalgebruik', text: 'In het huis staat huis als zelfstandig woord. Je hoeft er geen ander woorddeel aan vast te maken.' },
      { title: 'Houd dezelfde bijdrage vast', text: 'Her- kan niet los dezelfde opnieuw-functie vervullen. Dat je de letters in een uitleg kunt noemen, verandert zijn gewone gebruik niet.' },
      { title: 'Scheid gebondenheid van plaats', text: 'Een gebonden deel kan voor of achter de basis staan. Ook een lexicale kern kan gebonden zijn: gebonden betekent niet automatisch achtervoegsel.' },
    ], [{ term: 'Vrij', meaning: 'Kan in het bedoelde gebruik als zelfstandig woord voorkomen.' }, { term: 'Gebonden', meaning: 'Heeft in dit gebruik ander woordmateriaal nodig.' }], 'Kan het in dezelfde functie zelfstandig voorkomen?', '§2.2, p. 19–22 (PDF 36–39)', "§3.2"),
    guide('Ontleden is vergelijken: onveilig hoort bij veilig én bij andere negatieve vormen zoals onduidelijk.', [
      { title: 'Maak woordparen', text: 'Zet veilig naast onveilig en duidelijk naast onduidelijk. Houd basis en betekenisverschil bij ieder paar apart.' },
      { title: 'Benoem wat terugkomt', text: 'On- voegt in beide paren een negatieve bijdrage toe. Dat is sterker bewijs dan alleen dezelfde beginletters.' },
      { title: 'Controleer iedere grens', text: 'Raam en ramen veranderen van spelling; daarvoor is geen extra betekenisstuk nodig. Zet bij winkel ook geen grens voor -el zonder een passend vorm-betekenispatroon.' },
    ], [{ term: 'Segmenteren', meaning: 'Een vorm opdelen in voorgestelde onderdelen en de grenzen onderbouwen.' }], 'Geen streepje zonder een verklaring.', '§1.1, p. 2–3; §2, p. 14–15; §10.1, p. 211–217 (PDF 19–20, 31–32, 228–234)', "§3.3.4–3.3.5; §5.2"),
  ],
  'woordbouw-bases-affixen': [
    guide('De basis hangt af van de stap: -baar werkt op lees; -heid werkt op leesbaar als geheel.', [
      { title: 'Kies de bewerking', text: 'Onderzoek eerst lees → leesbaar. Voor de toevoeging van -baar is lees de basis.' },
      { title: 'Verschuif naar de volgende stap', text: 'Onderzoek daarna leesbaar → leesbaarheid. Nu is leesbaar de hele basis voor -heid.' },
      { title: 'Geef de kern en de buigingsbasis aan', text: 'Lees is de wortel in deze familie. Bij werker → werkers heet werker de stam voor dit meervoud; zo’n stam kan zelf al opgebouwd zijn.' },
    ], [{ term: 'Basis', meaning: 'De input van de onderzochte bewerking.' }, { term: 'Wortel', meaning: 'De lexicale kern die je in deze analyse niet verder opdeelt.' }, { term: 'Stam', meaning: 'Een basis waarop een buigingspatroon werkt.' }], 'Noem de stap; dan weet je welke basis je zoekt.', '§2.2, p. 20–22; §3.1.2, p. 35–36 (PDF 37–39, 52–53)', "§3.2; §3.3.2"),
    guide('Een affixregel zegt waar het deel staat, welke basis past en wat de combinatie oplevert.', [
      { title: 'Zoek de plaats', text: 'On- staat vóór duidelijk; -heid staat achter duidelijk. Voor heet prefix, achter heet suffix.' },
      { title: 'Benoem de geschikte input', text: 'Bij helderheid is helder een bijvoeglijk naamwoord. Dat is de basis waarop deze -heid-regel werkt.' },
      { title: 'Controleer het resultaat', text: 'Helderheid is een zelfstandig naamwoord voor de eigenschap. De regel beschrijft dus bouw én betekenis; niet elk willekeurig woord is passende input.' },
    ], [{ term: 'Affix', meaning: 'Een gebonden deel dat met een basis combineert.' }, { term: 'Selectie', meaning: 'De voorwaarden waaraan een basis voor dit patroon moet voldoen.' }], 'Plaats + input + resultaat + betekenis.', '§2.2, p. 19–21; §3.1.1, p. 34–35 (PDF 36–38, 51–52)', "§3.3.1"),
    guide('De tussenstap verklaart de bouw: leesbaar bestaat als eigenschap voordat je met -heid die eigenschap benoemt.', [
      { title: 'Lees de eerste relatie', text: 'Een leesbare tekst kan gelezen worden. -Baar maakt hier een bijvoeglijk resultaat bij een werkwoordbasis.' },
      { title: 'Lees de tweede relatie', text: 'Leesbaarheid benoemt de eigenschap leesbaar. -Heid hoort daarom bij leesbaar als geheel.' },
      { title: 'Controleer gelijk gespelde delen', text: 'In fietser benoemt -er een persoon; in groter drukt -er vergelijking uit. Dezelfde letters kunnen bij verschillende bouwregels horen.' },
    ], [{ term: 'Tussenbasis', meaning: 'Een kleiner opgebouwd geheel waarop de volgende bewerking werkt.' }], 'Controleer bij iedere stap de hele basis en de nieuwe bijdrage.', '§2.2, p. 21; §5.2–3, p. 86–89; §7.3, p. 145–146 (PDF 38, 103–106, 162–163)', "§3.3.2–3.3.3; §10.7"),
  ],
  'woordbouw-buiging-afleiding': [
    guide('Boek en boeken zijn grammaticale vormen van hetzelfde lexeem. Dat noemen we buiging.', [
      { title: 'Zoek het grammaticale verschil', text: 'Boek tegenover boeken drukt enkelvoud tegenover meervoud uit. Werk tegenover werkte drukt een tijdsverschil uit.' },
      { title: 'Bekijk de omgeving', text: 'De leerling werkt wordt de leerlingen werken. Het werkwoord sluit hier aan bij het getal van het onderwerp.' },
      { title: 'Laat het patroon de vorm bepalen', text: 'Bij schrijf → schreef verandert de stam. Het blijft buiging, ook zonder los aangeplakt tijdsachtervoegsel.' },
    ], [{ term: 'Buiging', meaning: 'Grammaticale vormverschillen binnen hetzelfde lexeem; ook inflectie genoemd.' }], 'Buiging is een grammaticale relatie, geen verplichte plakmethode.', '§2.1, p. 17–18; §5.1, p. 81–86; §5.4.1, p. 100–102 (PDF 34–35, 98–103, 117–119)', "§6.2–6.3"),
    guide('Fietser is een nieuw lexeem bij fietsen. Afleiding hoeft de woordsoort niet te veranderen: veilig en onveilig zijn allebei bijvoeglijk.', [
      { title: 'Zoek de nieuwe woordbetekenis', text: 'Fietsen noemt de activiteit; fietser benoemt een deelnemer. Fietser heeft vervolgens een eigen meervoud: fietsers.' },
      { title: 'Controleer de woordsoort', text: 'Soms verandert die, zoals helder → helderheid. Soms blijft die gelijk, zoals veilig → onveilig en kind → kindje.' },
      { title: 'Vergelijk met buiging', text: 'Kind → kinderen gaat om aantal binnen één grammaticale reeks. Kind → kindje voegt verkleining toe; dezelfde woordsoort maakt die relatie nog geen meervoudsbuiging.' },
    ], [{ term: 'Afleiding', meaning: 'Een systematische relatie die een nieuw lexeem vormt bij een bestaand lexeem.' }], 'Categorieverandering kan bij afleiding, maar is niet verplicht.', '§5.2, p. 86–89; §5.3.4–9, p. 93–98 (PDF 103–106, 110–115)', "§6.7"),
    guide('Beslis met meerdere aanwijzingen: betekenis, grammaticale reeks en woordsoort moeten samen je analyse dragen.', [
      { title: 'Omschrijf het verschil', text: 'Stoelen voegt aantal toe; stoeltje voegt verkleining toe. Begin met dat gewone betekenisverschil.' },
      { title: 'Leg de vormen in hun reeks', text: 'Vriendelijker hoort bij de vergelijking van vriendelijk. Vriendelijkheid is een naamwoord met eigen gebruik en vormen.' },
      { title: 'Verklaar de bouw', text: 'Werkers is het meervoud van werker als geheel. Bij een lastiger geval, zoals bijvoeglijk gebruikte deelwoorden, onderzoek je ook de concrete zin.' },
    ], [{ term: 'Prototype', meaning: 'Een duidelijk voorbeeld dat helpt vergelijken, zonder alle grensgevallen te beslissen.' }], 'Combineer aanwijzingen; één letter of label is niet genoeg.', '§5.3–5, p. 89–107 (PDF 106–124)', "§6.7"),
  ],
  'woordbouw-samenstellingen': [
    guide('Een fietsbel is een soort bel. Bel noemt de algemene soort en is hier het hoofd van de samenstelling.', [
      { title: 'Vul de soortvraag in', text: 'Een fietsbel is een soort … bel. Fiets vertelt bij welke toepassing die bel hoort.' },
      { title: 'Controleer de grammatica', text: 'Het boek geeft het schoolboek; boeken geeft schoolboeken. De eigenschappen van het hoofd zijn in het geheel herkenbaar.' },
      { title: 'Let op de grenzen van de regel', text: 'Het hoofd staat vaak rechts in Nederlandse naamwoordsamenstellingen. Roodborst benoemt echter een vogel, geen soort borst: dat vraagt een andere betekenisbeschrijving.' },
    ], [{ term: 'Hoofd', meaning: 'Het deel dat hier de algemene soort en belangrijke grammaticale eigenschappen bepaalt.' }, { term: 'Exocentrisch', meaning: 'De betekenis van het geheel is geen subtype van een genoemd deel, zoals de vogel roodborst.' }], 'Vraag: het geheel is een soort wat?', '§7.1–2, p. 137–144 (PDF 154–161)', "§3.4.3.3"),
    guide('Het hoofd zegt welke soort iets is; de relatie met het andere deel moet je daarnaast uitleggen.', [
      { title: 'Zoek wat gelijk blijft', text: 'Fietsbel, deurbel en schoolbel zijn alle drie bellen. Dat is de gedeelde hoofdsoort.' },
      { title: 'Leg de relatie in gewone taal uit', text: 'Een fietsbel zit bij een fiets; een schoolbel wordt in een school gebruikt. Eén vaste uitleg met van past niet overal.' },
      { title: 'Controleer gebruik en aantal', text: 'Bij paardenbloem moet je de gangbare betekenis kennen. Eén boekenplank blijft één plank: het verbindingsstuk -en bepaalt niet het aantal van het hele woord.' },
    ], [{ term: 'Conventionele betekenis', meaning: 'Een betekenis die je uit gangbaar gebruik moet kennen.' }, { term: 'Tussenklank', meaning: 'Verbindingsmateriaal tussen delen van een samenstelling.' }], 'Hoofd, deelrelatie en gangbaar gebruik leveren samen de uitleg.', '§7.1, p. 138–141; §9.1, p. 190–195 (PDF 155–158, 207–212)', "§3.4.3.2"),
    guide('Een woordgroep laat andere interne uitbreidingen toe dan een samenstelling. Vergelijk brede plank met boekenplank.', [
      { title: 'Zoek de interne combinatie', text: 'Boekenplank verbindt twee bases binnen één naamwoord. Brede plank combineert een losse eigenschapsbeschrijving met plank.' },
      { title: 'Voeg een beschrijving toe', text: 'Een grote boekenkast beschrijft de hele kast. Je kunt grote niet zomaar binnen boeken-kast zetten met behoud van dezelfde samenstelling.' },
      { title: 'Combineer je aanwijzingen', text: 'Gebruik ook spelling, klemtoon en ander zinsgedrag. Een vaste of onverwachte betekenis bewijst op zichzelf nog niet dat iets één woord is.' },
    ], [{ term: 'Samenstelling', meaning: 'Een woordeenheid die twee of meer lexicale bases combineert.' }], 'Onderzoek de interne bouw; spelling helpt als extra aanwijzing.', '§9.1, p. 190–195 (PDF 207–212)', "§3.4.1; §10.3"),
  ],
  'woordbouw-hierarchie': [
    guide('Onleesbaarheid bevat lagen: leesbaar → onleesbaar → onleesbaarheid. Elke stap werkt op een heel tussenresultaat.', [
      { title: 'Begin met de leesmogelijkheid', text: 'Lees en -baar vormen leesbaar: iets kan gelezen worden. Dat hele resultaat is een bijvoeglijk naamwoord.' },
      { title: 'Ontken die eigenschap', text: 'On- werkt op leesbaar als geheel. Onleesbaar betekent dat de eigenschap leesbaar niet van toepassing is.' },
      { title: 'Benoem de eigenschap', text: '-Heid neemt onleesbaar als basis. De haakjes [[on [lees baar]] heid] laten die relaties zien, ook als je het bekende woord direct begrijpt.' },
    ], [{ term: 'Hiërarchie', meaning: 'De lagen waarin kleinere eenheden samen een grotere basis vormen.' }], 'Een lijst noemt de delen; haakjes tonen welke delen samen horen.', '§3.2.1, p. 44–45; §7.3, p. 144–146 (PDF 61–62, 161–163)', "§3.3.2"),
    guide('De gekozen groepering bepaalt waarop een betekenisbijdrage werkt. Context helpt kiezen tussen mogelijke structuren.', [
      { title: 'Vraag wat on- ontkent', text: 'In onleesbaar ontkent on- de hele eigenschap leesbaar. Het bereik is dus groter dan alleen de wortel lees.' },
      { title: 'Vergelijk twee situaties', text: 'Een schoolboekenkast voor schoolboeken past bij [[school boeken] kast]. Een boekenkast als schoolmeubilair kan [school [boeken kast]] ondersteunen.' },
      { title: 'Verantwoord de tussenbasis', text: 'Leg bij elke lezing uit welke eenheid je samenneemt en wat het geheel dan betekent. Een willekeurige plaats voor haakjes is geen onderbouwde structuur.' },
    ], [{ term: 'Bereik', meaning: 'Het hele onderdeel waarvan een bewerking de betekenis beïnvloedt.' }], 'Groepeer alleen wat je als betekenisrelatie kunt uitleggen.', '§7.2–3, p. 142–146 (PDF 159–163)', "§3.4.2"),
    guide('Een uitleg in gewone taal controleert je haakjes: een tuinmeubelhoes is een hoes voor een tuinmeubel.', [
      { title: 'Begin bij het hele woord', text: 'Wat voor ding is een tuinmeubelhoes? Een hoes. Dat is het hoofd van het volledige woord.' },
      { title: 'Zoek de kleinere eenheid', text: 'Waarvoor dient de hoes? Voor tuinmeubels. Tuin en meubel vormen daarom de kleinere combinatie.' },
      { title: 'Controleer iedere laag', text: 'Tuinmeubel is een soort meubel; tuinmeubelhoes is een soort hoes. Het hoofd kan dus per laag verschillen.' },
    ], [{ term: 'Parafrase', meaning: 'Een omschrijving van dezelfde betekenis in gewone woorden.' }], 'Omschrijf de betekenis en controleer het hoofd op iedere laag.', '§7.2, p. 142–144 (PDF 159–161)', "§3.4.2–3.4.3.3"),
  ],
  'woordbouw-allomorfen': [
    guide('Huisje en boompje drukken allebei verkleining uit. -Je en -pje zijn hier verschillende vormen van hetzelfde patroon.', [
      { title: 'Zoek de gedeelde bijdrage', text: 'Huis → huisje en boom → boompje zijn allebei verkleinende relaties. Dat verbindt de twee uitkomsten.' },
      { title: 'Benoem de vormverschillen', text: 'Je ziet -je, -pje en in tafeltje weer -tje. Zulke varianten noemen we allomorfen.' },
      { title: 'Onderzoek de voorwaarden', text: 'Luister naar de eindklank, klinkerlengte en klemtoon van de basis. Een compleet patroon kan meer voorwaarden hebben dan één laatste letter.' },
    ], [{ term: 'Allomorf', meaning: 'Een concrete vormvariant van dezelfde morfologische eenheid of hetzelfde patroon.' }], 'Eerst dezelfde functie herkennen, dan de verschillende vormen verklaren.', '§2.3, p. 22–26; §10.1, p. 211–217 (PDF 39–43, 228–234)', "§9.2; hoofdstuk 9, oefening 3"),
    guide('Letters, klanken en grammaticale verschillen vallen niet altijd samen. Raam → ramen en zing → zong veranderen om verschillende redenen.', [
      { title: 'Luister naar hond en honden', text: 'Aan het eind van hond hoor je meestal een t-achtige klank. In honden staat dezelfde basis vóór een klinker en hoor je d.' },
      { title: 'Vergelijk de geschreven klinkers', text: 'Raam heeft aa, ramen heeft a. Dit schrijfverschil geeft hier geen aparte betekenisbijdrage.' },
      { title: 'Zoek het grammaticale contrast', text: 'Bij zing → zong hangt de stamwisseling samen met de tijd. Dat vraagt een andere verklaring dan het algemene uitspraakpatroon bij hond.' },
    ], [{ term: 'Eindverscherping', meaning: 'Een uitspraakpatroon waarbij een eindmedeklinker zoals d stemloos klinkt.' }, { term: 'Stamwisseling', meaning: 'Een verschil in de vorm van de stam, bijvoorbeeld zing tegenover zong.' }], 'Vraag steeds: beschrijf ik letters, klanken of grammatica?', '§2.3, p. 23–26; §10.1, p. 211–217 (PDF 40–43, 228–234)', "§5.4; §9.2"),
    guide('Boompje, raampje en riempje steunen een eerste idee over -pje. Bommetje laat zien dat eindklank m alleen niet genoeg is.', [
      { title: 'Zoek een overeenkomst', text: 'Boom, raam en riem eindigen op m en krijgen hier -pje. Schrijf die beperkte waarneming op.' },
      { title: 'Test een vergelijkbaar geval', text: 'Bom eindigt ook op m, maar krijgt bommetje. Je eerste regel voorspelt dat nog niet goed.' },
      { title: 'Verfijn met meer bewijs', text: 'Vergelijk nu ook klinkerlengte en klemtoon in meer paren. Behoud het tegenvoorbeeld: daardoor wordt de voorwaarde preciezer.' },
    ], [{ term: 'Tegenvoorbeeld', meaning: 'Een geval dat niet volgt wat jouw voorlopige regel voorspelt.' }], 'Een tegenvoorbeeld helpt je de regel verbeteren.', '§3, p. 57–59; §10.2, p. 217–220 (PDF 74–76, 234–237)', "§9.4; hoofdstuk 9, oefening 3"),
  ],
  'woordbouw-paradigma': [
    guide('Een paradigmavak noemt grammaticale kenmerken én een vorm: wij werken en zij werken hebben verschillende persoonswaarden.', [
      { title: 'Kies de kenmerken', text: 'Bij wij kies je eerste persoon en meervoud. Bij zij met meerdere personen kies je derde persoon en meervoud.' },
      { title: 'Vul de vorm in', text: 'Beide vakken krijgen werken. Twee grammaticale mogelijkheden kunnen dus dezelfde zichtbare vorm hebben.' },
      { title: 'Vermeld de zinscontext', text: 'Jij werkt en werk jij? laten een contextverschil zien. Schrijf bij je kaart voor welk soort zinnen de vormen gelden.' },
    ], [{ term: 'Cel', meaning: 'Een vak voor een bepaalde combinatie van grammaticale kenmerken.' }, { term: 'Paradigma', meaning: 'De geordende grammaticale vormen van één lexeem.' }], 'Tel de grammaticale vakken apart van de verschillende spellingsvormen.', '§2.1, p. 16–17; §5, p. 107–109 (PDF 33–34, 124–126)', "§6.4"),
    guide('Een paradigma kan dezelfde vorm voor meerdere vakken gebruiken én sterk verschillende stammen binnen één werkwoord bevatten.', [
      { title: 'Vind de gedeelde vorm', text: 'Wij werken en zij werken gebruiken dezelfde vorm voor verschillende personen. Wanneer zo’n gelijkheid systematisch is, heet dat syncretisme.' },
      { title: 'Vind de verschillende stammen', text: 'Ik ben, Noor is en wij zijn horen bij ZIJN. De klankverschillen maken ze geen losse, ongerelateerde werkwoorden.' },
      { title: 'Lees terug naar de zin', text: 'In ik werkte en Noor werkte vertelt het onderwerp welke persoonswaarde bedoeld is. De vorm werkte alleen maakt dat onderscheid niet zichtbaar.' },
    ], [{ term: 'Syncretisme', meaning: 'Systematisch dezelfde vorm in meerdere grammaticale cellen.' }, { term: 'Suppletie', meaning: 'Sterk verschillende stammen binnen één lexeem, zoals ben en was.' }], 'De cel en haar zichtbare vorm hoeven niet één op één overeen te komen.', '§2.3, p. 24–25; §8.5–6, p. 172–180 (PDF 41–42, 189–197)', "§6.4.2"),
    guide('Een leeg oefenvak vraagt je om een vorm te vinden. Dat bewijst niet dat de taal die vorm mist.', [
      { title: 'Gebruik een bekende rij', text: 'Ik maak, Noor maakt, wij maken helpt een vergelijkbaar vak invullen. Je gebruikt de samenhang binnen het systeem.' },
      { title: 'Vergelijk een buigingsgroep', text: 'Zingen en springen delen zong/gezongen en sprong/gesprongen. Zo’n patroon helpt, maar geldt niet vanzelf voor ieder nieuw rijmend werkwoord.' },
      { title: 'Markeer wat je nog niet weet', text: 'Een vraagteken betekent hier nog onbekend. Een werkelijk ontbrekende taalvorm heet defectief en vereist afzonderlijk bewijs uit taalgebruik.' },
    ], [{ term: 'Buigingsklasse', meaning: 'Lexemen die een samenhangend patroon van grammaticale vormen delen.' }, { term: 'Defectief', meaning: 'Een lexeem dat een verwachte grammaticale vorm werkelijk mist.' }], 'Onbekend in je oefening is iets anders dan ontbrekend in de taal.', '§8.2–3, p. 158–167; §8.7.1, p. 180–182 (PDF 175–184, 197–199)', "§6.4.1–6.4.2"),
  ],
  'woordbouw-werkwoordvormen': [
    guide('In Noor heeft geschreven verandert heeft naar hebben bij de leerlingen. Daarom is heeft hier de persoonsvorm.', [
      { title: 'Bekijk alle werkwoorden', text: 'Heeft en geschreven horen allebei bij de werkwoordgroep. Eén daarvan draagt hier de persoons- en getalsvorm.' },
      { title: 'Verander het onderwerp', text: 'Noor heeft geschreven wordt de leerlingen hebben geschreven. Heeft verandert; geschreven blijft gelijk.' },
      { title: 'Controleer de zinsoort', text: 'In Na de pauze heeft Noor geschreven volgt heeft op de eerste hele zinsgroep. Bijzinnen en vragen hebben andere plaatsingsmogelijkheden.' },
    ], [{ term: 'Persoonsvorm', meaning: 'De finiete werkwoordvorm die in deze deelzin tijd, persoon of getal kan uitdrukken.' }, { term: 'Finiet', meaning: 'De grammaticale vorm van de persoonsvorm, tegenover bijvoorbeeld een infinitief.' }], 'Test de vorm die verandert; tel niet simpelweg het tweede woord.', '§5.1, p. 81–86; §5.3.1, p. 90–92 (PDF 98–103, 107–109)', "§6.3.1; §8.3.2"),
    guide('In wil schrijven is schrijven een infinitief; in heeft geschreven is geschreven een voltooid deelwoord.', [
      { title: 'Herken de infinitief in zijn groep', text: 'Noor wil schrijven gebruikt de gewone niet-finiete vorm schrijven. Wil draagt hier de persoonsvorm.' },
      { title: 'Herken het deelwoord in zijn groep', text: 'Noor heeft geschreven gebruikt geschreven bij heeft. De voltooide groep helpt de vorm herkennen.' },
      { title: 'Controleer zonder vaste lettertruc', text: 'Gewerkt, betaald en besproken zijn alle drie deelwoorden. Een deelwoord hoeft dus niet altijd met ge- te beginnen of op -t te eindigen.' },
    ], [{ term: 'Infinitief', meaning: 'Een niet-finiete werkwoordvorm, zoals schrijven in wil schrijven.' }, { term: 'Voltooid deelwoord', meaning: 'Een werkwoordvorm zoals geschreven of betaald, onder meer gebruikt met heeft of is.' }], 'Het verband met andere werkwoorden helpt meer dan één begin- of eindletter.', '§4.2, p. 69; §5.1, p. 86; §8.8, p. 183–184; §11.4, p. 257–262 (PDF 86, 103, 200–201, 274–279)', "§6.3.1"),
    guide('Morgen reist Noor heeft een tegenwoordige werkwoordvorm én een toekomstige betekenis door morgen.', [
      { title: 'Benoem eerst de vorm', text: 'Reist is tegenwoordige tijd; reisde is verleden tijd. Dat is een beschrijving van de grammaticale vorm.' },
      { title: 'Lees de tijdscontext', text: 'Morgen plaatst de reis in de toekomst. De gebeurtenistijd volgt dus uit meer dan de werkwoordvorm alleen.' },
      { title: 'Bekijk de hele constructie', text: 'Is aan het lezen presenteert een voortgaande activiteit. De hele groep draagt dat perspectief; je hoeft er geen los aspectsuffix in lezen voor te vinden.' },
    ], [{ term: 'Tijd', meaning: 'De plaatsing van een situatie ten opzichte van een tijdpunt.' }, { term: 'Aspect', meaning: 'De manier waarop het verloop van een situatie wordt gepresenteerd.' }], 'Vorm + constructie + context bepalen samen de tijdsuitleg.', '§5.1, p. 84–85; §8.8, p. 183–184 (PDF 101–102, 200–201)', "§6.2.5; §8.4"),
  ],
  'woordbouw-productiviteit': [
    guide('Productief betekent dat je een patroon kunt uitbreiden met nieuwe passende woorden, niet alleen bestaande voorbeelden herkent.', [
      { title: 'Bedenk een bruikbare situatie', text: 'Je wilt een lamp om op het balkon te lezen benoemen. Balkonleeslamp combineert bekende bases met een begrijpelijke relatie.' },
      { title: 'Controleer de basisvoorwaarden', text: 'Vouwbaar past bij iets dat gevouwen kan worden. Een ongeschikte basis zegt weinig over uitbreiding op bases die wél passen.' },
      { title: 'Vraag hoe anderen het gebruiken', text: 'Een vorm kunnen begrijpen is nog geen bewijs van gangbaar gebruik. Leg de context voor en kijk of andere sprekers het patroon ook uitbreiden.' },
    ], [{ term: 'Productiviteit', meaning: 'De mate waarin een patroon nieuwe passende vormen of woorden kan opleveren.' }, { term: 'Domein', meaning: 'De groep bases waarop een patroon kan worden toegepast.' }], 'Test nieuwe toepassingen binnen de voorwaarden van het patroon.', '§6.1–3, p. 114–122 (PDF 131–139)', "§4.1–4.3"),
    guide('Tokens tellen voorkomens, types tellen verschillende vormen en hapaxes komen één keer voor in jouw verzameling.', [
      { title: 'Tel de voorkomens', text: 'Lichtbak, lichtbak, lichtbak, daklamp bevat vier tokens. Iedere plek telt.' },
      { title: 'Tel de verschillende vormen', text: 'Er zijn twee geschreven types: lichtbak en daklamp. Alleen daklamp is hier een hapax, want het komt eenmaal voor.' },
      { title: 'Beperk je conclusie', text: 'Daklamp kan een ouder woord zijn. Een hapax is een eigenschap van deze verzameling; voor productiviteitsvergelijking heb je vergelijkbare, gecontroleerde gegevens nodig.' },
    ], [{ term: 'Corpus', meaning: 'De afgebakende verzameling teksten die je onderzoekt.' }, { term: 'Hapax', meaning: 'Een vorm die precies eenmaal voorkomt in dat corpus.' }], 'Eenmaal in dit corpus betekent niet nieuw in de taal.', '§6.5, p. 129–131; onderzoeksopdracht p. 134–136 (PDF 146–148, 151–153)', "§4.4"),
    guide('Een nieuwe vorm concurreert met bekende woorden. Gewoonte, betekenis en context beïnvloeden welke vorm een spreker kiest.', [
      { title: 'Bekijk de beschikbare woorden', text: 'Een ingeburgerd woord kan een nieuwe vorm met dezelfde betekenis minder aantrekkelijk maken. Dat heet vaak blocking.' },
      { title: 'Houd ruimte voor verschillen', text: 'Twee vormen kunnen naast elkaar bestaan als ze in stijl, betekenis of toepassing verschillen. Blocking is geen algemeen verbod op synoniemen.' },
      { title: 'Verzamel daadwerkelijke keuzes', text: 'Vraag meerdere sprekers naar dezelfde nieuwe situatie en noteer ook alternatieven. Beschrijf de uitkomst van die taak, zonder er meteen een regel voor alle Nederlanders van te maken.' },
    ], [{ term: 'Blocking', meaning: 'Concurrentie waarbij een bestaande vorm de keuze voor een nieuwe vergelijkbare vorm kan tegenhouden.' }], 'Onderzoek wat mensen kiezen en waarom de situatie die keuze ondersteunt.', '§6.4.2, p. 125–127; onderzoeksopdracht p. 134–136; §12.3, p. 274–276 (PDF 142–144, 151–153, 291–293)', "§4.3; §10.4"),
  ],
  'woordbouw-conversie': [
    guide('Een fiets en ik fiets zijn verwant, maar hebben ander grammaticaal gebruik. Voor die overgang is geen apart afleidingsstuk hoorbaar.', [
      { title: 'Zoek het naamwoordgebruik', text: 'In een fiets staat fiets als zelfstandig naamwoord. Het benoemt hier het vervoermiddel.' },
      { title: 'Zoek het werkwoordgebruik', text: 'In Noor fietst en Noor fietste krijgt de verwante basis werkwoordvormen. Het werkwoord benoemt een activiteit.' },
      { title: 'Scheid overgang en buiging', text: 'Fietsen heeft de gewone infinitiefvorm. -En is daarom niet vanzelf een apart achtervoegsel dat het naamwoord in een werkwoord verandert.' },
    ], [{ term: 'Conversie', meaning: 'Een categorieovergang zonder afzonderlijk uitgesproken afleidingsaffix.' }], 'Eerst de nieuwe categorie, daarna haar gewone grammaticale vormen.', '§3.1.4, p. 39–40; §3.2.2, p. 48 (PDF 56–57, 65)', "§3.5"),
    guide('Een andere betekenis is niet automatisch een andere woordsoort. Muis blijft een naamwoord bij een dier én bij een computerapparaat.', [
      { title: 'Vergelijk betekenis én categorie', text: 'Een dierlijke muis en een computermuis hebben andere toepassingen. Beide kunnen een zelfstandig naamwoord in een naamwoordgroep zijn.' },
      { title: 'Zoek zichtbaar ander gebruik', text: 'Een groen hek gebruikt groen als beschrijving. In het groen staat de vorm zelf als kern van een naamwoordgroep.' },
      { title: 'Onderzoek de hele constructie', text: 'Het lezen kan als naam voor een activiteit gebruikt worden. Dat naamwoordelijke gebruik vraagt analyse van de groep; het werkt niet noodzakelijk in elk opzicht als een gewoon los naamwoord.' },
    ], [{ term: 'Substantivering', meaning: 'Naamwoordelijk gebruik van bijvoorbeeld een eigenschap of werkwoordsvorm.' }], 'Betekenis veranderen en van categorie veranderen zijn verschillende vragen.', '§3.1.4, p. 39–40; §5.4.1, p. 100–102; §11.4, p. 257–262 (PDF 56–57, 117–119, 274–279)', "§3.5; §8.3.3"),
    guide('Een verwant naamwoord en werkwoord bewijzen nog niet welke vorm historisch eerst bestond of welke theorie de relatie het beste beschrijft.', [
      { title: 'Beschrijf wat je kunt waarnemen', text: 'Een mail en ik mail tonen twee categorieën met een betekenisrelatie. Dat volgt uit hun gebruik in de zinnen.' },
      { title: 'Zoek extra bewijs voor de richting', text: 'Welke toepassing eerst bestond, vraagt bijvoorbeeld gedateerde gebruiksgegevens. Een moderne zin dateert het ontstaan niet.' },
      { title: 'Houd de notatie apart', text: 'Een nulaffix is een theoretische manier om de overgang te beschrijven. Het is geen hoorbaar stukje dat je bij het ontleden gemist hebt.' },
    ], [{ term: 'Nulaffix', meaning: 'Een niet-uitgesproken element dat sommige theorieën aannemen om een grammaticale relatie te beschrijven.' }], 'Waarneming, ontstaansrichting en theoretische notatie vragen elk hun eigen bewijs.', '§3.2.1–2, p. 45–49; §4.1, p. 64–65 (PDF 62–66, 81–82)', "§3.5; §10.2; §11.2–11.3"),
  ],
  'woordbouw-partikels': [
    guide('Ophalen blijft als werkwoord herkenbaar in ophalen, haalt op en opgehaald. De zin bepaalt hoe de delen verschijnen.', [
      { title: 'Vergelijk de werkwoordgroepen', text: 'Noor haalt de tas op heeft haalt als persoonsvorm. In Noor wil de tas ophalen is wil de persoonsvorm en blijft ophalen bijeen.' },
      { title: 'Volg dezelfde betekenisrelatie', text: 'Op blijft bij ophalen horen wanneer het apart staat. De spatie verwijdert die relatie niet.' },
      { title: 'Controleer nog een context', text: 'Noor heeft de tas opgehaald bevat op-ge-haald. Omdat Noor de tas ophaalt laat de bijeenstaande bijzinvorm zien.' },
    ], [{ term: 'Partikel', meaning: 'Een klein onderdeel van een werkwoordpatroon, zoals op bij ophalen.' }, { term: 'Scheidbaar werkwoord', meaning: 'Een werkwoord waarvan een onderdeel in bepaalde zinnen apart verschijnt.' }], 'Vergelijk meerdere zinsvormen van hetzelfde werkwoord.', '§9, p. 189; §9.4, p. 203–206 (PDF 206, 220–223; Nederlandse toepassing)', "§8.3.2"),
    guide('Op in opruimen hoort bij het werkwoord. Op in op de tafel introduceert een eigen groep. Gelijke letters maken de functie niet gelijk.', [
      { title: 'Zoek het werkwoordverband', text: 'Noor ruimt de tafel op hoort bij opruimen en opgeruimd. Volg op door die vormen heen.' },
      { title: 'Zoek de voorzetselgroep', text: 'Noor zet de beker op de tafel bevat de groep op de tafel. Op verbindt hier een plaats of bestemming met de tafel.' },
      { title: 'Controleer een ander begin', text: 'Betalen en begrijpen sturen geen los be- of ge- naar het einde. Behandel niet ieder herkenbaar begin als hetzelfde soort partikel.' },
    ], [{ term: 'Voorzetselgroep', meaning: 'Een groep zoals op de tafel, waarin een voorzetsel een relatie met de volgende groep uitdrukt.' }], 'Controleer bij welke grotere eenheid het kleine onderdeel hoort.', '§4.2, p. 69; §9.1–4, p. 190–206 (PDF 86, 207–223; Nederlandse toepassing)', "§3.2; §8.3.2"),
    guide('Een korte vorm zoals ’t kan in de uitspraak op een buurwoord leunen en toch een andere grammaticale taak hebben dan een affix.', [
      { title: 'Vergelijk de volledige en korte vorm', text: 'Het huis en ’t huis houden dezelfde bepalerrelatie met huis. De korte vorm is minder zelfstandig in de uitspraak.' },
      { title: 'Vergelijk met een achtervoegsel', text: '-Heid vormt in helderheid een naamwoord bij helder. Het heeft andere basisvoorwaarden dan de gereduceerde bepaler ’t.' },
      { title: 'Stel de vragen apart', text: 'Onderzoek uitspraak, spelling en zinsgedrag ieder afzonderlijk. Gebondenheid in de uitspraak maakt een vorm nog niet tot een afleidingsaffix.' },
    ], [{ term: 'Clitisch', meaning: 'In de uitspraak afhankelijk van naburig materiaal, terwijl het zinsgedrag woordachtig kan blijven.' }, { term: 'Prosodie', meaning: 'Eigenschappen van de uitspraak zoals klemtoon en ritmische groepering.' }], 'Uitspraakafhankelijkheid en woordbouw zijn verschillende dimensies.', '§9.2–3, p. 196–203 (PDF 213–220)', "§8.3.1"),
  ],
  'woordbouw-onderzoek': [
    guide('Maak een regel toetsbaar door waarneming, verklaring en nieuwe voorspelling apart op te schrijven.', [
      { title: 'Kies een kleine vraag', text: 'Onderzoek bijvoorbeeld verkleinwoorden bij bases die eindigen op m. Noteer of je klanken, letters of woordbetekenissen vergelijkt.' },
      { title: 'Noteer het gegeven paar', text: 'Boom wordt boompje is een waarneming. Alle passende m-bases krijgen -pje is een voorlopige regel, die verder gaat dan dat ene paar.' },
      { title: 'Voorspel een nieuw geval', text: 'Schrijf vooraf op wat je voor een nog niet bekeken basis verwacht. Pas daarna controleer je de werkelijke vorm.' },
    ], [{ term: 'Hypothese', meaning: 'De voorlopige verklaring die je onderzoekt.' }, { term: 'Voorspelling', meaning: 'De uitkomst die je op grond van de hypothese bij nieuw materiaal verwacht.' }], 'Gegeven voorbeeld → voorstel → nieuwe test.', 'Onderzoeksopdracht hoofdstuk 3, p. 57–59; hoofdstuk 4, p. 77–80 (PDF 74–76, 94–97)', "§5.2; §9.4"),
    guide('Bewaar voorbeelden die niet passen en noteer twijfel. Alleen bevestigende gevallen verzamelen maakt je onderzoek zwakker.', [
      { title: 'Vergelijk een bewust contrast', text: 'Boom → boompje en bom → bommetje hebben allebei een m-eindklank. De verschillende uitkomsten zetten een simpele m-regel onder druk.' },
      { title: 'Noteer het volledige antwoord', text: 'Schrijf ook een alternatieve vorm, twijfel of een andere interpretatie op. Geef deelnemers dezelfde context zodat antwoorden vergelijkbaar zijn.' },
      { title: 'Benoem wat je bron laat zien', text: 'Geen treffer in een klein corpus betekent alleen dat je de vorm daar niet vond. Het bewijst niet dat niemand de vorm kan gebruiken.' },
    ], [{ term: 'Gegevens', meaning: 'De vastgelegde vormen, contexten en oordelen waarop je conclusie berust.' }], 'Tegenvoorbeelden en twijfel horen bij je resultaten.', '§6.5, p. 129–131; onderzoeksopdracht p. 134–136; hoofdstuk 3, p. 57–59 (PDF 146–148, 151–153, 74–76)', "§3.8; hoofdstuk 9, oefening 3"),
    guide('Een sterke conclusie zegt precies welke gegevens je regel steunen en met welk nieuw voorbeeld je haar opnieuw kunt testen.', [
      { title: 'Rapporteer de beperkte uitkomst', text: 'Zeg bijvoorbeeld: in deze reeks kregen de onderzochte lange-klinker-m-bases -pje. Zo is zichtbaar waarop de conclusie berust.' },
      { title: 'Scheid beschrijving van verwerking', text: 'Een haakjesanalyse kan woordrelaties goed weergeven. Ze bewijst niet dat een spreker die haakjes bij elke uitspraak stap voor stap doorloopt.' },
      { title: 'Kies een mogelijke weerlegging', text: 'Welke nieuwe basis of andere klemtoon zou je voorspelling laten mislukken? Een duidelijke vervolgtest maakt de regel controleerbaar.' },
    ], [{ term: 'Reikwijdte', meaning: 'De gevallen waarvoor de gegevens jouw conclusie werkelijk ondersteunen.' }], 'Noem het resultaat, de grens en de volgende test.', '§1.3, p. 6–9; onderzoeksopdracht hoofdstuk 3, p. 58–59; hoofdstuk 4, p. 79–80 (PDF 23–26, 75–76, 96–97)', "§2.3.4; §10.1; §11.8"),
  ],
};
