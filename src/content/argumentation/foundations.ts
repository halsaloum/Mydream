import type { FlowIllustration, IllustrationNode } from './illustrations';

export type FoundationConcept = {
  id: string;
  term: string;
  title: string;
  teaser: string;
  body: string;
  example: string;
  scenario: string;
  question: string;
  prompt: string;
  options: { id: string; text: string; feedback: string }[];
  answer: string;
  sourceIds: string[];
  diagram: FlowIllustration;
};
export type ArgumentFoundation = FoundationConcept;

const node = (id: string, label: string, text: string, tone: IllustrationNode['tone'] = 'blue', connector = false): IllustrationNode => ({ id, label, text, tone, ...(connector ? { connector } : {}) });
const edge = (from: string, to: string, label: string, kind: FlowIllustration['edges'][number]['kind'] = 'support') => ({ from, to, label, kind });
const picture = (rows: string[][], nodes: IllustrationNode[], edges: FlowIllustration['edges'], legend: string): FlowIllustration => ({ family: 'flow', rows, nodes, edges, legend });
const concept = (data: Omit<FoundationConcept, 'title' | 'prompt'>): FoundationConcept => ({ ...data, title: data.term, prompt: data.question });

// Original Dutch explanations and transfer cases, grounded in the supplied editions.
// The diagrams describe roles; a supporting arrow does not establish truth or strength.
export const argumentFoundations: FoundationConcept[] = [
  concept({
    id: 'argument', term: 'Argument',
    teaser: 'Iemand stelt iets voor en vertelt waarom.',
    body: 'Een argument is een reden, of een aantal redenen, voor iets dat je iemand wilt laten aannemen of doen. Je gebruikt argumenten in gewone gesprekken. “Neem een paraplu mee, want het gaat straks regenen” bevat een advies en een reden daarvoor.\n\nBegin met twee vragen: wat wordt voorgesteld of beweerd, en waarom? Bij de paraplu is meenemen het advies; de verwachte regen is de reden. Het woord “want” helpt, maar is niet verplicht. “Het gaat regenen. Neem een paraplu mee” kan dezelfde verbinding laten zien.\n\nEen argument hoeft niet goed te zijn om een argument te heten. Misschien klopt de weersverwachting niet, of ga je niet naar buiten. Eerst herken je de reden voor het advies. Daarna controleer je of zij klopt en bij de situatie past.\n\nOp het werk zegt iemand: “Leg reservehandschoenen klaar. Vanmorgen waren drie paar kapot.” Je herkent de gewenste keuze en de gegeven reden. Nu kun je gericht vragen hoeveel voorraad er nog is. Je hoeft niet meteen in te stemmen.',
    example: '“Loop via de zijdeur, want de hoofdingang is afgesloten.” De spreker geeft een reden voor een routekeuze.',
    scenario: 'Een collega zegt: “Zet de zware dozen op de onderste plank; daar kunnen we ze makkelijker pakken.”',
    question: 'Welke beschrijving laat zien wat dit argument doet?',
    options: [
      { id: 'reason', text: 'Het geeft een reden voor de keuze van een plank.', feedback: 'Ja: makkelijker pakken wordt als reden voor de onderste plank aangevoerd. Daarna kun je beoordelen of die reden en de keuze passen.' },
      { id: 'agreement', text: 'Het bewijst dat iedereen de keuze al goed vindt.', feedback: 'De collega geeft een reden, maar vertelt niet wat iedereen vindt. Een argument geven is niet hetzelfde als overeenstemming hebben.' },
      { id: 'command', text: 'Het noemt alleen een opdracht en vertelt niet waarom.', feedback: 'De eerste helft geeft de gewenste keuze; de tweede vertelt waarom de collega die voorstelt.' },
    ], answer: 'reason', sourceIds: ['govier', 'groarke'],
    diagram: picture([['r'], ['v']], [node('r', 'Waarom?', 'De hoofdingang is afgesloten.'), node('v', 'Wat wordt voorgesteld?', 'Loop via de zijdeur.', 'green')], [edge('r', 'v', 'is de genoemde reden voor')], 'Begin met het voorstel en de reden. Of de reden klopt en genoeg is, onderzoek je daarna.'),
  }),
  concept({
    id: 'conclusie', term: 'Conclusie',
    teaser: 'Wat wil de spreker dat je aanneemt of doet?',
    body: 'Een conclusie is de uitspraak die iemand met redenen wil ondersteunen. Zij geeft het standpunt weer dat je na de redenering zou moeten aanvaarden. Dat kan over een feit gaan, zoals “de voorraad is te klein”, of over een keuze, zoals “we zouden meer onderdelen moeten bestellen”. Zoek eerst wat de spreker wil bereiken, voordat je onderzoekt of de verdediging goed is.\n\nEen conclusie herken je aan haar rol, niet aan haar plaats. Zij kan vooraan, middenin of achteraan staan. Woorden als “dus” helpen, maar zijn niet verplicht. Ook een voorstel in de vorm “laten we” kan het standpunt uitdrukken. Vraag: welke uitspraak krijgt hier steun van de andere uitspraken?\n\nHet woord conclusie betekent nog niet dat iets bewezen is. Een slecht argument heeft ook een conclusie. Een uitspraak kan bovendien in één stap conclusie zijn en daarna een reden voor een volgende stap. Benoem steeds de rol binnen de redenering die je op dat moment bekijkt.\n\nEen collega zegt: “Laten we het archief naar een grotere kast verplaatsen. De huidige kast kan niet meer veilig dicht.” Het verplaatsen is het voorstel; de volle kast wordt ter ondersteuning genoemd. Je hebt daarmee het standpunt gevonden. Of een grotere kast de beste oplossing is, vraagt een volgende beoordeling.',
    example: '“De laatste dienst mist vaak de overdracht. Plan daarom een extra overdrachtsmoment.” De conclusie is het voorgestelde extra moment.',
    scenario: '“Gebruik voor de afspraak ruimte D. Daar kunnen ook collega’s met een rolstoel binnen.”',
    question: 'Welke uitspraak is hier het standpunt dat steun krijgt?',
    options: [
      { id: 'access', text: 'Collega’s met een rolstoel kunnen daar binnen.', feedback: 'Dit wordt aangevoerd als reden voor de keuze. De spreker gebruikt toegankelijkheid om het voorstel te ondersteunen.' },
      { id: 'room', text: 'Gebruik voor de afspraak ruimte D.', feedback: 'Dit is de gewenste keuze. De andere zin geeft een reden om die keuze te aanvaarden.' },
      { id: 'both', text: 'Beide zinnen hebben hier dezelfde rol.', feedback: 'De zinnen hangen samen, maar doen iets verschillends: één stelt een keuze voor, de andere ondersteunt haar.' },
    ], answer: 'room', sourceIds: ['govier', 'groarke'],
    diagram: picture([['r'], ['c']], [node('r', 'Genoemde reden', 'De huidige archiefkast kan niet veilig dicht.'), node('c', 'Conclusie', 'Verplaats het archief naar een grotere kast.', 'green')], [edge('r', 'c', 'wordt aangevoerd als reden voor')], 'De pijl toont welke uitspraak wordt ondersteund. Zij bewijst niet dat de voorgestelde keuze juist is.'),
  }),
  concept({
    id: 'premisse', term: 'Premisse',
    teaser: 'Welke uitspraak wordt als reden gebruikt?',
    body: 'Een premisse is een uitspraak die in een argument als reden wordt gebruikt. De spreker voert haar aan om een andere uitspraak, de conclusie, aannemelijk te maken. In “Het vertrek is te koud, dus we moeten de verwarming controleren” wordt de temperatuur als reden aangevoerd. Het woord premisse benoemt die ondersteunende rol.\n\nDat een uitspraak een premisse is, maakt haar niet automatisch waar. Zij kan gecontroleerd, onzeker of onjuist zijn. Je kunt dus eerst herkennen welke reden iemand geeft en daarna vragen hoe die persoon dat weet. Zo voorkom je dat je een argument verkeerd weergeeft omdat je het al afwijst.\n\nEen argument kan meerdere premissen hebben. Soms dragen zij samen één stap: je hebt zowel een algemene regel als het concrete geval nodig. Soms biedt elke reden afzonderlijk enige steun. Houd de redenen daarom herkenbaar uit elkaar. Een aansprekend detail hoort alleen bij de premissen wanneer het werkelijk een ondersteunende functie krijgt.\n\nEen team wil reservekabels bestellen. De spreker noemt dat twee kabels beschadigd zijn en dat volgende week extra werkplekken nodig zijn. Beide uitspraken kunnen het voorstel ondersteunen. Je vraagt vervolgens of de schade is vastgesteld, of de planning klopt en hoeveel kabels er al beschikbaar zijn. Herkennen en beoordelen blijven twee verschillende stappen.',
    example: '“De deur blijft soms openstaan, dus laat het sluitmechanisme controleren.” Het gemelde openstaan wordt als premisse gebruikt.',
    scenario: '“De koeling valt telkens uit. We zouden het onderhoud moeten vervroegen.”',
    question: 'Wat is de premisse, en wat moet je daarna nog controleren?',
    options: [
      { id: 'proposal', text: 'Het vervroegen is de premisse; een voorstel hoeft niet te worden onderbouwd.', feedback: 'Het vervroegen is hier de conclusie. De spreker voert de uitval aan als reden om dat voorstel te aanvaarden.' },
      { id: 'certain', text: 'De uitval is de premisse; daarom staat die uitval al vast.', feedback: 'Je vindt de juiste rol, maar aanvoer als premisse bewijst geen waarheid. Vraag naar meldingen, metingen of andere passende steun.' },
      { id: 'check', text: 'De gemelde uitval is de premisse; controleer of en hoe vaak die optreedt.', feedback: 'Je onderscheidt de rol van de reden van haar betrouwbaarheid. Een uitvalregistratie kan helpen de premisse te beoordelen.' },
    ], answer: 'check', sourceIds: ['govier', 'groarke'],
    diagram: picture([['p'], ['c']], [node('p', 'Premisse', 'Twee werkplekkabels zijn beschadigd.'), node('c', 'Conclusie', 'Bestel vervangende kabels.', 'green')], [edge('p', 'c', 'wordt gebruikt ter ondersteuning van')], 'Premisse is een rol. De schade en de passende bestelling moeten nog worden beoordeeld.'),
  }),
  concept({
    id: 'gevolgtrekking', term: 'Gevolgtrekking',
    teaser: 'Hoe gaat de spreker van redenen naar een conclusie?',
    body: 'Een gevolgtrekking is de denkstap waarmee iemand vanuit premissen een conclusie trekt. De premissen leveren het uitgangspunt; de conclusie is wat je op grond daarvan zou mogen aanvaarden. De gevolgtrekking is de verbinding ertussen. Vraag daarom naast “wat wordt gezegd?” ook “waarom zou dit uit die redenen volgen?”.\n\nDie vraag voorkomt dat een rij ware uitspraken vanzelf als een sterke redenering wordt behandeld. “De agenda is geel” kan kloppen, maar verklaart zonder extra verband niet waarom een vergadering korter moet duren. Een reden moet de betreffende conclusie ondersteunen. Een ontbrekende verbinding verdient uitleg, geen automatische instemming.\n\nNiet iedere gevolgtrekking geeft dezelfde zekerheid. Een regel met een passend geval kan een conclusie noodzakelijk laten volgen. Een ervaring kan een verwachting alleen voorlopig ondersteunen. En een voorstel vraagt vaak een afweging van doelen en nadelen. Houd de sterkte van de conclusie in verhouding tot wat de stap werkelijk draagt.\n\nDe teamregel zegt dat een document voor publicatie door een tweede medewerker moet worden gelezen. Een nieuw bericht staat klaar voor publicatie. Je past de regel op dit bericht toe en concludeert dat een tweede lezer nodig is. De regel en het geval zijn de premissen; toepassen is de denkstap; de vereiste controle is de conclusie.',
    example: 'Een gewijzigde dienst vraagt volgens de afspraak een nieuwe bevestiging. Deze dienst is gewijzigd. De stap is het toepassen van de afspraak op dit geval.',
    scenario: '“Alle dossiers voor externe verzending krijgen een adrescontrole. Dit dossier gaat extern. Daarom krijgt dit dossier een adrescontrole.”',
    question: 'Welke beschrijving benoemt de gevolgtrekking?',
    options: [
      { id: 'rule', text: 'Alle dossiers voor externe verzending krijgen een adrescontrole.', feedback: 'Dit is één van de premissen: de algemene regel. De gevolgtrekking gebruikt die regel samen met het concrete geval.' },
      { id: 'step', text: 'De algemene regel op dit concrete dossier toepassen.', feedback: 'Dit beschrijft de denkstap. Zij verbindt de twee gegeven uitgangspunten met de conclusie over dit dossier.' },
      { id: 'ending', text: 'Alleen de conclusie over de adrescontrole herhalen.', feedback: 'Dat herhaalt het resultaat, maar benoemt niet hoe het uit de premissen wordt afgeleid.' },
    ], answer: 'step', sourceIds: ['govier', 'groarke'],
    diagram: picture([['p'], ['i'], ['c']], [node('p', 'Twee premissen', 'Teamregel: voor publicatie is een tweede lezer nodig.\nDit bericht is voor publicatie.'), node('i', 'Denkstap', 'Pas de gegeven regel op dit bericht toe.', 'purple', true), node('c', 'Conclusie', 'Dit bericht vraagt een tweede lezer.', 'green')], [edge('p', 'i', 'worden samen gebruikt in'), edge('i', 'c', 'levert binnen de regel op')], 'Het middelste vak benoemt de denkstap; het is geen extra feitenpremisse.'),
  }),
  concept({
    id: 'geldigheid', term: 'Geldigheid',
    teaser: 'Kunnen de redenen waar zijn terwijl de conclusie onwaar is?',
    body: 'Geldigheid gaat over de verbinding tussen premissen en conclusie. Een deductief argument is geldig wanneer de premissen niet allemaal waar kunnen zijn terwijl de conclusie onwaar is. Je vraagt dus: als deze uitgangspunten kloppen, moet dit resultaat dan volgen? Dat is een controle van de stap, nog geen controle van de echte feiten.\n\nDit onderscheid helpt bij een redenering die overtuigend klinkt. “Alle rode mappen bevatten een contract. Deze map is rood. Dus deze map bevat een contract” heeft een geldige vorm. De conclusie volgt wanneer beide premissen waar zijn. Of alle rode mappen werkelijk contracten bevatten, moet je afzonderlijk nagaan.\n\nEen geldige redenering kan daarom een onware premisse hebben. Haar vorm wordt niet ongeldig doordat een uitgangspunt niet klopt. Andersom maken ware premissen en een toevallig ware conclusie een ongeldige stap niet geldig. Een deugdelijk deductief argument heeft beide: een geldige gevolgtrekking en ware premissen.\n\nStel dat alle kantoorstoelen rood zijn en stoel A een kantoorstoel is. Dan volgt dat A rood is. Als A werkelijk een kantoorstoel is en blauw blijkt, klopt het eerste uitgangspunt niet; de gevolgtrekking blijft van de geldige vorm. Leer daarom twee vragen naast elkaar stellen: volgt de conclusie uit deze premissen, en welke steun hebben de premissen zelf?',
    example: '“Alle verzonden rapporten zijn geregistreerd. Rapport T is verzonden. Dus T is geregistreerd.” De vorm is geldig; de twee uitgangspunten verdienen eigen controle.',
    scenario: '“Alle afgeronde bestellingen hebben een bevestigingsnummer. Bestelling M is afgerond. Dus M heeft een bevestigingsnummer.” Je hebt de administratie nog niet bekeken.',
    question: 'Wat kun je over deze redenering zeggen?',
    options: [
      { id: 'unknown', text: 'De vorm is ongeldig zolang ik de administratie niet persoonlijk heb bekeken.', feedback: 'Onzekerheid over feiten maakt de vorm niet ongeldig. De vraag naar waarheid van de premissen is een aparte controle.' },
      { id: 'form', text: 'De vorm is geldig; of de uitgangspunten werkelijk kloppen vraagt een aparte controle.', feedback: 'Wanneer beide premissen waar zijn, kan deze conclusie niet onwaar zijn. Daarmee heb je nog niet vastgesteld dat de premissen in de administratie kloppen.' },
      { id: 'proof', text: 'De geldige vorm bewijst al dat alle genoemde administratieve feiten waar zijn.', feedback: 'Geldigheid garandeert waarheid van de conclusie bij ware premissen. Zij bewijst de waarheid van die premissen niet.' },
    ], answer: 'form', sourceIds: ['govier', 'groarke', 'bowell'],
    diagram: picture([['p'], ['c']], [node('p', 'Beide premissen', 'Alle afgeronde bestellingen hebben een nummer.\nM is een afgeronde bestelling.'), node('c', 'Conclusie', 'M heeft een nummer.', 'green')], [edge('p', 'c', 'kan niet onwaar zijn als beide premissen waar zijn')], 'Deze vorm is geldig. Controleer los daarvan of de twee administratieve uitgangspunten kloppen.'),
  }),
  concept({
    id: 'verzwegen-premisse', term: 'Verzwegen premisse',
    teaser: 'Welke niet genoemde aanname gebruikt de spreker?',
    body: 'Een verzwegen premisse is een aanname die het argument gebruikt zonder haar uit te spreken. De spreker verwacht bijvoorbeeld dat je een regel, doel of achtergrondfeit al kent. Wanneer de uitgesproken reden de conclusie niet volledig verklaart, zoek je wat er stilzwijgend wordt meegenomen. Dat maakt de redenering beter bespreekbaar.\n\nZoeken betekent niet zomaar een mooie reden toevoegen. Een reconstructie probeert te begrijpen wat de spreker werkelijk bedoelt. De aanvulling moet passen bij de woorden en de situatie. Zijn er meerdere mogelijke aannames, benoem dan je onzekerheid en vraag welke de spreker gebruikt. Jouw verbeterde voorstel is iets anders dan diens oorspronkelijke argument.\n\nEen verzwegen premisse kan een regel zijn, maar ook een concreet feit. “Bel Omar, want hij heeft dienst” kan veronderstellen dat Omar deze storing mag behandelen. Het expliciet maken van die aanname bewijst niet dat zij klopt. Je kunt daarna juist ontdekken dat zijn bevoegdheid beperkt is.\n\nEen collega zegt: “Gebruik herbruikbare mokken, want wegwerpbekers geven veel afval.” Mogelijk telt hier de aanname dat vermijdbaar afval beperken een relevant doel is. Dat verduidelijkt de stap naar het voorstel. Je hebt nog niet bewezen dat deze mokken, met de beschikbare schoonmaak en kosten, de beste keuze zijn. Vraag naar de bedoelde aanname en toets vervolgens haar toepassing.',
    example: '“Zet Noor bij de nieuwe balie; zij spreekt Frans.” Een mogelijke verzwegen aanname is dat deze balie regelmatig Franstalige bezoekers ontvangt.',
    scenario: '“Stuur deze foto’s naar Esra, want zij kan goed tekenen.” Het team zoekt iemand die beschadigingen op productfoto’s kan beoordelen.',
    question: 'Welke reactie onderzoekt de verzwegen aanname zonder een feit te verzinnen?',
    options: [
      { id: 'talent', text: 'Aannemen dat goede tekenaars automatisch deskundig zijn in alle productbeschadigingen.', feedback: 'Dat maakt een ruime regel zonder steun. Tekenvaardigheid en kennis van deze producten hoeven niet hetzelfde te zijn.' },
      { id: 'false', text: 'Concluderen dat Esra beslist geen beschadigingen kan beoordelen.', feedback: 'Een niet onderbouwde geschiktheid bewijst geen ongeschiktheid. Het ontbrekende verband vraagt controle.' },
      { id: 'ask', text: 'Vragen welke kennis van deze producten haar tekenvaardigheid relevant maakt.', feedback: 'Je vraagt naar de veronderstelde verbinding met deze taak. Daarmee blijft open of de spreker passende kennis kan noemen.' },
    ], answer: 'ask', sourceIds: ['govier', 'groarke'],
    diagram: picture([['p'], ['c']], [node('p', 'Genoemde reden', 'Noor spreekt Frans.'), node('c', 'Voorstel', 'Zet Noor bij de nieuwe balie.', 'green')], [edge('p', 'c', 'vraagt welke niet genoemde aanname deze keuze draagt')], 'Een mogelijke ontbrekende aanname: hier komen Franstalige bezoekers. Maak de aanname zichtbaar en controleer haar; bedenk niet alvast bewijs.'),
  }),
  concept({
    id: 'verbindingsregel', term: 'Verbindingsregel',
    teaser: 'Welke regel maakt het gegeven relevant voor de conclusie?',
    body: 'Een verbindingsregel legt uit waarom een gegeven als steun voor een conclusie mag dienen. De reden vertelt wat er in dit geval speelt; de regel zegt waarom dat voor de volgende stap telt. “Dit doosje is kwetsbaar” ondersteunt extra verpakking wanneer je daarbij de regel gebruikt dat kwetsbare goederen passende bescherming nodig hebben.\n\nDoor die regel zichtbaar te maken kun je preciezer bespreken waar de twijfel zit. Misschien klopt het gegeven, maar is de regel te ruim. Misschien is de regel redelijk, maar geldt zij hier niet. Een mooi geformuleerd gegeven rechtvaardigt de verbinding niet vanzelf. Vraag welke regel wordt toegepast en wat die toepassing draagt.\n\nNiet iedere verzwegen premisse is een verbindingsregel. Een ontbrekend feit, zoals de aanwezigheid van een klant, zegt iets over dit concrete geval. Een verbindingsregel benoemt juist de relatie tussen reden en conclusie. Zij kan een normale verwachting of een waarde bevatten en hoeft geen regel zonder uitzonderingen te zijn. Later krijgt deze rol in Toulmin de naam warrant.\n\nEen collega ziet een onduidelijk adres op een retour en adviseert een adrescontrole. De verbindingsregel kan zijn dat een onduidelijk adres vóór verdere verzending controle verdient. Het adres bewijst die regel niet: je gebruikt de twee samen. De regel zelf kun je verdedigen met bijvoorbeeld de gevolgen van verkeerde bezorging.',
    example: '“De route is slecht verlicht, dus laten we een ander pad kiezen” gebruikt een regel over het belang van zichtbaarheid voor deze routekeuze.',
    scenario: '“Deze kantoorprinter verspilt papier door terugkerende foutafdrukken. Daarom wil ik een beperkte proef met een andere instelling.”',
    question: 'Welke verbindingsregel maakt deze stap begrijpelijk zonder een succesgarantie toe te voegen?',
    options: [
      { id: 'trial', text: 'Een terugkerend probleem kan een gerichte, uitvoerbare proef met een mogelijke oplossing rechtvaardigen.', feedback: 'Deze regel verbindt het gegeven probleem met het beperkte voorstel. Werking en uitvoerbaarheid moeten worden beoordeeld; het proefresultaat staat niet al vast.' },
      { id: 'guarantee', text: 'Iedere andere printerinstelling zal het probleem voor altijd oplossen.', feedback: 'Dit voegt een succesgarantie toe die niet uit de gemelde foutafdrukken volgt. De spreker stelt een proef voor, geen bewezen oplossing.' },
      { id: 'location', text: 'De printer staat naast de ingang van het kantoor.', feedback: 'Dit kan een concreet achtergrondfeit zijn. Zonder extra uitleg verbindt het de foutafdrukken niet met de voorgestelde proef.' },
    ], answer: 'trial', sourceIds: ['govier', 'groarke', 'schemes', 'pragma'],
    diagram: picture([['p', 'w'], ['c']], [node('p', 'Gegeven', 'Het retouradres is onduidelijk.'), node('w', 'Verbindingsregel', 'Een onduidelijk adres verdient controle vóór verzending.', 'purple'), node('c', 'Conclusie', 'Controleer dit adres vóór verzending.', 'green')], [edge('p', 'c', 'draagt het advies samen met de regel'), edge('w', 'c', 'verbindt het gegeven met dit advies', 'authorize')], 'De paarse regel rechtvaardigt de verbinding. Het gegeven bewijst de regel niet; beide worden samen gebruikt. Het formele Toulminmodel volgt later.'),
  }),
  concept({
    id: 'bewijslast', term: 'Bewijslast',
    teaser: 'Wie moet voor deze bewering redenen geven?',
    body: 'Bewijslast is de verplichting om een standpunt met passende redenen te ondersteunen wanneer dat standpunt wordt betwijfeld. Als je zegt dat een nieuwe werkwijze tijd bespaart, moet je kunnen uitleggen waarop die verwachting rust. De functie van een kritische vraag is dan om de rechtvaardiging zichtbaar te maken, niet om automatisch het tegenovergestelde te bewijzen.\n\nPassende steun hangt af van de bewering en het gesprek. Een waarneming, een vergelijking of een verantwoorde afweging kan nodig zijn. Een ruimer standpunt vraagt andere steun dan een beperkte verwachting. Maak daarom duidelijk wat je verdedigt en welke controle relevant is. Een functie of overtuigende toon vervangt die ondersteuning niet.\n\nWie alleen vraagt “zijn de overstapkosten meegeteld?” beweert nog niet dat een verandering verlies oplevert. Je kunt zo’n vraag niet afdoen met “bewijs eerst dat het mislukt”. Zodra de criticus zelf zegt dat de verandering verlies veroorzaakt, ontstaat voor die eigen claim wel een verplichting om redenen te geven. Beide rollen kunnen dus naast elkaar bestaan.\n\nEen teamleider verwacht dat automatisch dubbelzijdig afdrukken papier bespaart. Een collega vraagt of mislukte afdrukken zijn meegenomen. De teamleider moet de vergelijking toelichten of haar claim beperken. De vraag bewijst geen extra verspilling, maar kan laten zien welke controle nog ontbreekt. Tot die controle is gegeven, mag je de aanvaarding van de claim uitstellen.',
    example: '“Dit rooster bespaart ieder team tijd” vraagt steun. “Hoe is reistijd meegerekend?” vraagt om die steun en is nog geen tegengestelde tijdclaim.',
    scenario: 'Een manager zegt dat een gezamenlijke besteldag transportkilometers bespaart. Een medewerker vraagt of spoedritten zijn meegeteld; hij beweert niet dat kilometers toenemen.',
    question: 'Welke reactie behandelt de bewijslast eerlijk?',
    options: [
      { id: 'reverse', text: 'De medewerker moet eerst bewijzen dat gezamenlijke bestellingen meer kilometers kosten.', feedback: 'De medewerker heeft die claim niet gedaan. De vraag gaat over de ondersteuning van de besparing die de manager zelf verdedigt.' },
      { id: 'support', text: 'De manager licht de besparing inclusief relevante spoedritten toe of beperkt haar claim.', feedback: 'De voorsteller behandelt de gerichte vraag naar haar eigen standpunt. Een zelfstandige claim van meer kilometers zou vervolgens eigen redenen vragen.' },
      { id: 'accept', text: 'De manager heeft gelijk zolang de medewerker geen tegengestelde berekening heeft.', feedback: 'Geen tegengestelde berekening hebben bewijst de besparing niet. De oorspronkelijke claim blijft passende ondersteuning vragen.' },
    ], answer: 'support', sourceIds: ['walton', 'pragma'],
    diagram: picture([['c'], ['q']], [node('c', 'Verdedigd standpunt', 'Deze afspraak vermindert papierverbruik.', 'green'), node('q', 'Gerichte vraag', 'Hoe zijn foutafdrukken meegerekend?', 'orange')], [edge('q', 'c', 'vraagt om ondersteuning van')], 'Dit is een gesprekskaart. De vraag neemt nog geen tegengesteld standpunt in; de voorsteller moet haar claim rechtvaardigen.'),
  }),
  concept({
    id: 'drogreden', term: 'Drogreden',
    teaser: 'Waar schiet deze verdediging tekort?',
    body: 'Een drogreden is een fout in een redenering of reactie waardoor een standpunt onvoldoende wordt ondersteund of een redelijk gesprek wordt gehinderd. Een reden lijkt bijvoorbeeld overtuigend, terwijl zij de betreffende conclusie niet behoorlijk ondersteunt. Of een reactie ontwijkt de besproken vraag. Je moet het concrete probleem uitleggen; alleen een naam noemen is onvoldoende.\n\nBegin met de werkelijke redenering. Wat is het standpunt, welke reden wordt gegeven en wat moet die reden doen? Onderzoek vervolgens waarom de steun tekortschiet of de reactie het gesprek blokkeert. De context telt mee. Een persoonlijke eigenschap kan relevant zijn voor de betrouwbaarheid van een getuigenis, maar is geen automatische weerlegging van iedere inhoudelijke reden.\n\nEen drogreden aantonen bewijst niet dat de conclusie onwaar is. Een bruikbaar voorstel kan slecht worden verdedigd. Het bewijst ook geen kwade bedoeling: iemand kan zich vergissen of onzorgvuldig formuleren. Richt je kritiek daarom op de ontbrekende rechtvaardiging en geef aan welke informatie of aanpassing het argument zou verbeteren.\n\nEen medewerker vraagt extra stoelen omdat er meer deelnemers dan zitplaatsen zijn. De reactie luidt: “Hij beantwoordt zijn mails langzaam, dus zijn voorstel is slecht.” Dat beantwoordt het genoemde tekort niet. Controleer het aantal deelnemers, de aanwezige stoelen en mogelijke alternatieven. Zo beoordeel je de aankoop op relevante gronden, zonder de persoon tot het hele onderwerp te maken.',
    example: '“Dit plan is goed, want het is de juiste keuze” herhaalt het oordeel zonder een afzonderlijke reden te geven.',
    scenario: 'Een collega vraagt een reserveaccu vanwege twee gemelde stroomonderbrekingen. De reactie is: “Zij is altijd zo voorzichtig; daarom hoeven we haar voorstel niet te beoordelen.”',
    question: 'Welke reactie benoemt het argumentatieve probleem het best?',
    options: [
      { id: 'repair', text: 'De typering vervangt een beoordeling van onderbrekingen, gevolgen en de reserveaccu.', feedback: 'Je lokaliseert de ontbrekende inhoudelijke beoordeling. Voorzichtigheid kan een indruk verklaren, maar beslist deze aankoopvraag niet.' },
      { id: 'untrue', text: 'Door deze slechte reactie staat vast dat een reserveaccu onnodig is.', feedback: 'Een gebrekkige reactie bewijst niet dat het voorstel onjuist is. De gemelde onderbrekingen en de mogelijke oplossingen blijven te beoordelen.' },
      { id: 'intent', text: 'De spreker moet bewust liegen; anders kan er geen redeneerfout zijn.', feedback: 'Een fout hoeft geen bewuste misleiding te zijn. Leg uit wat de reactie overslaat, zonder intentie te verzinnen.' },
    ], answer: 'repair', sourceIds: ['tindale', 'govier', 'walton'],
    diagram: picture([['p'], ['c']], [node('p', 'Aangevoerde typering', 'De medewerker beantwoordt mails langzaam.', 'orange'), node('c', 'Onvoldoende verdedigde conclusie', 'Zijn stoelenvoorstel is slecht.', 'orange')], [edge('p', 'c', 'beantwoordt het genoemde stoelentekort niet')], 'De kaart toont een zwakke verdediging. Zij bewijst niet dat de stoelen nodig of onnodig zijn.'),
  }),
  concept({
    id: 'tegenvoorbeeld', term: 'Tegenvoorbeeld',
    teaser: 'Welk geval laat zien dat een claim of stap te ruim is?',
    body: 'Een tegenvoorbeeld is een geval dat laat zien waar een algemene uitspraak of een gevolgtrekking faalt. Bij de claim “alle medewerkers hebben toegang” kan één medewerker zonder toegang genoeg zijn. Het geval moet wel binnen de genoemde groep vallen. Een buitenstaander zonder toegang zegt niets tegen deze uitspraak over medewerkers.\n\nBij deductieve geldigheid zoek je iets anders: een mogelijke situatie waarin alle premissen waar zijn en de conclusie onwaar is. Zo’n tegenmodel toont dat de conclusie niet noodzakelijk uit die premissen volgt. Je hoeft daarvoor niet te bewijzen dat die situatie in het werkelijke dossier is opgetreden.\n\nHoud die twee controles uit elkaar. Een werkelijk tegengeval kan een feitelijke algemene premisse weerleggen. Een denkbaar tegenmodel weerlegt de geldigheid van een gevolgtrekking. Het maakt de conclusie zelf niet automatisch onwaar. En een voorspelling die alleen voorlopige steun claimt, wordt niet volledig weerlegd door iedere denkbare uitzondering.\n\nNeem “Alle spoedzendingen krijgen een volgnummer. Zending L heeft een volgnummer. Dus L is een spoedzending.” Een gewone zending kan ook een volgnummer hebben. Stel dat L zo’n gewone zending is en alle spoedzendingen netjes een nummer hebben. Dan blijven beide premissen waar, terwijl de conclusie over L onwaar is. Je hebt de ongeoorloofde omkering zichtbaar gemaakt.',
    example: 'Eén echt vertraagde levering weerlegt “alle leveringen waren op tijd”, maar bewijst niet dat iedere levering vertraagd was.',
    scenario: '“Alle contracten met korting staan in map R. Contract G staat in map R. Dus G heeft korting.”',
    question: 'Welke mogelijke situatie weerlegt deze gevolgtrekking terwijl beide premissen waar blijven?',
    options: [
      { id: 'break-rule', text: 'Een contract met korting ligt buiten map R.', feedback: 'Dit maakt juist de eerste premisse onwaar. Een tegenmodel tegen de gevolgtrekking moet alle gegeven premissen waar laten.' },
      { id: 'confirm', text: 'Contract G heeft korting en staat in map R.', feedback: 'Dit past bij de premissen en de conclusie. Eén passend geval toont niet dat de conclusie noodzakelijk volgt.' },
      { id: 'counter', text: 'Alle kortingscontracten staan in R; ook G staat daar, maar G heeft geen korting.', feedback: 'Beide premissen blijven waar en de conclusie is onwaar. De map kan meer bevatten dan alleen kortingscontracten.' },
    ], answer: 'counter', sourceIds: ['govier', 'groarke', 'bowell'],
    diagram: picture([['p'], ['c']], [node('p', 'Mogelijk geval met ware premissen', 'Alle spoedzendingen hebben een volgnummer.\nL heeft ook een nummer, als gewone zending.'), node('c', 'Geclaimde conclusie', 'L is een spoedzending.\nIn dit geval: onwaar.', 'orange')], [edge('p', 'c', 'garandeert deze conclusie niet')], 'Het mogelijke geval houdt de twee premissen waar en maakt de conclusie onwaar. Dat weerlegt de gevolgtrekking, niet automatisch de conclusie in het echte dossier.'),
  }),
];

const foundationLessonOrder: Record<string, string[]> = {
  'basis-standpunt-en-reden': ['argument', 'conclusie', 'premisse', 'gevolgtrekking'],
  'basis-verzwegen-stap': ['verzwegen-premisse', 'verbindingsregel'],
  'basis-argument-of-uitleg': ['bewijslast'],
  'basis-verborgen-premissen': ['geldigheid'],
  'basis-kritiek-en-herstel': ['drogreden'],
  'basis-voorwaarden-en-gevolgen': ['tegenvoorbeeld'],
  'master-toulmin-bewijslast': ['bewijslast', 'verbindingsregel'],
};

export function foundationForLesson(lessonId: string): FoundationConcept[] {
  return (foundationLessonOrder[lessonId] ?? []).flatMap((id) => {
    const item = argumentFoundations.find((foundation) => foundation.id === id);
    return item ? [item] : [];
  });
}
