import type { StepInput } from '../../schema';

/** Onderzoek bij d8: een derde uitlegronde op onderzoeksniveau, daarna zwaardere oefeningen. */
export const ONDERZOEK_D8: StepInput[] = [
  {
    kind: 'explain',
    id: 'onderzoek',
    title: 'Bomen in het geheugen en op papier',
    panels: [
      {
        text: 'Bouwt je brein de boom elke keer opnieuw, of ligt het woord kant-en-klaar in het geheugen? Pienie Zwitserlood (1994) vergeleek doorzichtige en ondoorzichtige Nederlandse samenstellingen. Na een doorzichtig woord als *kerkorgel* herken je woorden die bij *kerk* of *orgel* horen sneller: de delen doen mee met hun betekenis. Voor volledig ondoorzichtige woorden vond ze dat niet. Een *klokhuis* zit in een appel, en *klok* helpt je daar niet bij. Dominiek Sandra (1990) vond hetzelfde: de delen van een ondoorzichtig woord lezen niet mee. De boom bestaat dus wel, maar hoe minder de delen met de betekenis te maken hebben, hoe meer het woord als één blok is opgeslagen.',
        rule: 'Hoe minder de delen over de betekenis zeggen, hoe meer een samenstelling als één blok in het geheugen ligt.',
        bins: {
          q: 'Hoeveel vertellen de delen over het geheel? Zet elk voorwerp in de goede ring',
          bins: ['doorzichtig', 'half doorzichtig', 'ondoorzichtig'],
          rings: true,
          items: [
            { thing: 'pannenkoek', bin: 0, note: 'Een koek uit de pan: beide delen vertellen wat het is.' },
            { thing: 'boekenkast', bin: 0, note: 'Een kast voor boeken. De boom is nog helemaal zichtbaar.' },
            { thing: 'hangslot', bin: 0, note: 'Een slot dat hangt. Doorzichtig, al is het een vaste naam geworden.' },
            {
              thing: 'zonnebloem',
              bin: 1,
              note: 'Wel een bloem, maar de zon zit alleen in de vorm en de naam: een beeld, geen beschrijving.',
              hint: 'De bloem klopt. Wat doet de zon?',
            },
            {
              thing: 'struisvogel',
              bin: 1,
              note: 'Wel een vogel, maar struis betekent voor een Nederlandse spreker niets meer.',
              hint: 'Het tweede deel klopt, het eerste niet.',
            },
            {
              thing: 'computermuis',
              bin: 1,
              note: 'Echt voor de computer, maar een muis alleen bij wijze van beeld.',
              hint: 'Is het een muis?',
            },
            {
              thing: 'roodborst',
              bin: 1,
              note: 'Rood en borst kloppen allebei, maar het woord noemt een vogel, geen borst: de delen beschrijven, ze benoemen niet.',
              hint: 'De delen kloppen. Benoemen ze het ding?',
            },
            {
              thing: 'vleermuis',
              bin: 2,
              note: 'Geen muis, en vleer bestaat niet meer. Dit woord lees je als één blok.',
              hint: 'Helpt een van de delen je nog?',
            },
          ],
          note: 'Van binnen naar buiten wordt de boom steeds minder belangrijk voor de betekenis. Bij vleermuis is hij alleen nog geschiedenis.',
        },
        deep: {
          q: 'Wat betekent dat voor de woordboom?',
          a: 'De boom laat zien hoe een woord gebouwd kán worden, niet hoe elke lezer het elke keer leest. Een vaak gebruikt, ondoorzichtig woord als *vleermuis* staat als geheel in het geheugen. Hoe geheugen en opbouw om de voorrang strijden, zie je in de master (Opslaan of opbouwen?).',
        },
      },
      {
        text: 'Bij drie delen zijn er twee bomen. Welke kiest een lezer? Meestal de boom waarin een stuk al een bekend woord is. *Zeehondencrèche* lees je als [[zee honden] crèche], want *zeehond* is een vast woord; *hondencrèche* bestaat ook, maar de betekenis beslist. Bij *tafeltennistafel* wint *tafeltennis*. En bij *kinderboekenschrijver* trekt het vaste woord *kinderboeken* de boom naar links, ook al kan de andere boom ook. Het geheugen stuurt dus de ontleding: een opgeslagen deelwoord werkt als een magneet.',
        rule: 'Een lezer kiest de boom waarin een deel al een bekend woord is: *zeehond* in *zeehondencrèche*.',
        lab: {
          label: 'Tik een woord',
          chips: [
            { k: 'zeehondencrèche', out: '[[zee honden] crèche]', note: 'Een crèche voor zeehonden. Zeehond is een vast woord en trekt de boom naar links.' },
            { k: 'tafeltennistafel', out: '[[tafel tennis] tafel]', note: 'Een tafel voor tafeltennis. Tennistafel bestaat ook, maar tafeltennis wint.' },
            { k: 'stadsziekenhuis', out: '[stads [zieken huis]]', note: 'Een ziekenhuis van de stad. Hier zit het vaste woord rechts: ziekenhuis.' },
            {
              k: 'kinderboekenschrijver',
              out: '[[kinder boeken] schrijver]',
              note: 'Kinderboeken is zo gewoon dat bijna niemand de andere boom ziet: een kind dat boeken schrijft.',
            },
          ],
        },
        deep: {
          q: 'En als geen enkel deel een bekend woord is?',
          a: 'Dan beslist de betekenis: welke twee delen vormen samen een zinnig begrip? Een *appeltaartwedstrijd* is een wedstrijd in appeltaart bakken, geen taartwedstrijd met appels. Lezers halen dat uit hun kennis van de wereld, net als de relatie tussen de delen (zie Samenstellingen zonder einde).',
        },
      },
      {
        text: 'In de les over buigen en afleiden zag je het voorstel van Anderson: buiging komt pas nadat het woord gebouwd is, dus buiten de boom. Toch zit er vaak een meervoud binnenin een samenstelling. *Stedenbouw* bevat *steden*, niet *stad*; *kinderboek* het oude meervoud *kinder*; *eierdoos* en *bladerdeeg* de oude meervouden *eier* en *blader*. Geert Booij (1996) maakte daarom een onderscheid. *Inherente* buiging, zoals het meervoud, draagt een eigen betekenis en mag de woordbouw voeden. *Contextuele* buiging, zoals de persoonsvorm, legt de zin op en komt nooit binnenin een woord. Zoek de woorden met een echt meervoud binnenin.',
        rule: 'Inherente buiging zoals het meervoud kan in een samenstelling zitten (*stedenbouw*); buiging die de zin oplegt, nooit.',
        mark: {
          q: 'Tik de woorden met een onregelmatig meervoud binnenin',
          sentence: 'stedenbouw stadhuis kinderboek kindvriendelijk eierdoos eidooier bladerdeeg bladzijde',
          targets: [0, 2, 4, 6],
          note: 'steden, kinder, eier en blader: vormen die alleen als meervoud bestaan. In stadhuis, kindvriendelijk, eidooier en bladzijde staat de kale stam.',
        },
        deep: {
          q: 'En het voltooid deelwoord?',
          a: 'Ook dat is inherente buiging. Daarom kan *on-* eraan plakken: *ongekend*, *ongeschreven*, *onverwacht*. Een persoonsvorm als *loopt* kan dat nooit: *onloopt* bestaat niet. Het verschil zit in wie de vorm kiest. Het meervoud en het deelwoord kies je zelf; de persoonsvorm legt de zin op.',
        },
      },
      {
        text: 'Wat heb je als schrijver aan de boom? Een lange samenstelling schrijf je aaneen, maar de spelling staat een *facultatief koppelteken* toe als het woord anders moeilijk leesbaar is. De beste plek is de hoogste knoop: daar maakt de lezer de grootste stap. *Kinderopvangtoeslag-affaire* laat de bouw zien. *Kinder-opvangtoeslagaffaire* zet het streepje op een lage knoop en helpt niemand. Knip het woord één keer, op de hoogste knoop.',
        rule: 'Een facultatief koppelteken hoort op de hoogste knoop van de boom: *kinderopvangtoeslag-affaire*.',
        split: {
          q: 'Knip één keer, op de hoogste knoop',
          word: 'kinderopvangtoeslagaffaire',
          answer: 'kinderopvangtoeslag-affaire',
          note: 'De wortel van de boom is [[[kinder opvang] toeslag] affaire]: eerst de hele toeslag, dan de affaire. Daar hoort het streepje.',
        },
        deep: {
          q: 'Mag je ook meer streepjes zetten?',
          a: 'Het mag, maar het helpt zelden. Een streepje bij elke knoop (*kinder-opvang-toeslag-affaire*) maakt van de boom weer een ketting: alle grenzen lijken dan even belangrijk. Eén streepje op de hoogste knoop zegt het meest. Verplicht is een koppelteken alleen bij klinkerbotsing, hoofdletters, cijfers en zulke gevallen (zie Aaneen, met streepje of los?).',
        },
      },
    ],
  },
  {
    kind: 'sort',
    id: 'doorzicht',
    prompt: 'Hoeveel vertellen de delen over het geheel?',
    buckets: ['doorzichtig', 'half doorzichtig', 'ondoorzichtig'],
    items: [
      { t: 'kerkorgel', b: 0 },
      { t: 'strandstoel', b: 0 },
      { t: 'bakfiets', b: 0 },
      { t: 'spoorweg', b: 0 },
      { t: 'aardappel', b: 1 },
      { t: 'zeepaardje', b: 1 },
      { t: 'drankorgel', b: 1 },
      { t: 'klokhuis', b: 2 },
      { t: 'ezelsbruggetje', b: 2 },
      { t: 'muurbloempje', b: 2 },
    ],
    why: 'Doorzichtig: beide delen zeggen wat het is (een stoel voor het strand). Half: één deel klopt (een zeepaardje leeft in zee, maar is geen paard; een drankorgel drinkt, maar is geen orgel). Ondoorzichtig: geen van de delen helpt nog (een klokhuis is geen huis en heeft geen klok).',
  },
  {
    kind: 'ambiguity',
    id: 'kinderfilm',
    prompt: 'Eén woord, twee bomen',
    intro: 'Kies een lezing en zoek de zin die alleen dát kan betekenen.',
    sentence: 'Noor werkt op een kinderfilmfestival.',
    meanings: [
      {
        id: 'films',
        label: 'Een festival van kinderfilms, ook voor volwassen bezoekers',
        highlight: ['kinderfilmfestival'],
        right: 'Klopt. [[kinder film] festival]: de boom vertakt naar links, en kinderfilm is het vaste deelwoord dat de lezer het eerst ziet.',
      },
      {
        id: 'publiek',
        label: 'Een filmfestival voor kinderen',
        highlight: ['kinderfilmfestival'],
        right: 'Klopt. [kinder [film festival]]: rechtsvertakkend, een filmfestival met kinderen als publiek.',
      },
    ],
    options: [
      { t: 'Noor werkt op een festival van kinderfilms.', fits: 'films' },
      { t: 'Noor werkt op een filmfestival voor kinderen.', fits: 'publiek' },
      { t: 'Noor werkt op een groot kinderfilmfestival.', fits: null, note: 'Groot zegt niets over de boom: nog steeds twee lezingen.' },
    ],
    done: {
      title: 'Twee bomen, één spelling',
      text: 'De spelling laat de boom niet zien. Wil je één lezing, dan schrijf je de woordgroep: festival van kinderfilms, of filmfestival voor kinderen.',
    },
  },
  {
    kind: 'highlight',
    id: 'binnenin',
    prompt: 'Welke buiging zit er in het woord?',
    intro: 'Kleur elk woord: zit er een meervoud in, een voltooid deelwoord, of staat het eerste deel kaal?',
    pens: [
      { id: 'mv', label: 'meervoud', tag: 'mv', ask: 'Zit er een meervoudsvorm in die je in geen enkelvoud vindt?', accent: 'blue' },
      { id: 'vd', label: 'voltooid deelwoord', tag: 'vd', ask: 'Zit er een voltooid deelwoord in?', accent: 'orange' },
      { id: 'kaal', label: 'kale stam', tag: 'kaal', ask: 'Staat het eerste deel kaal, zonder buiging?', accent: 'purple' },
    ],
    words: [
      { t: 'stedenbouw', role: 'mv' },
      { t: 'ongeschreven', role: 'vd' },
      { t: 'stadhuis', role: 'kaal' },
      { t: 'ledenvergadering', role: 'mv' },
      { t: 'onverwacht', role: 'vd' },
      { t: 'bladzijde', role: 'kaal' },
      { t: 'eierdoos', role: 'mv' },
      { t: 'ongekend', role: 'vd' },
      { t: 'kindvriendelijk', role: 'kaal' },
    ],
    done: {
      title: 'Twee soorten buiging binnenin',
      text: 'Meervoud en deelwoord kies je zelf, en ze mogen de woordbouw in. De kale stam is de gewone keuze. Een persoonsvorm kom je binnenin nooit tegen.',
    },
  },
  {
    kind: 'bet',
    id: 'magneet',
    prompt: 'Een nieuw woord: ‘zeehondenkliniek’. Welke boom kiest een lezer het eerst, en waarom?',
    options: [
      '[[zee honden] kliniek]: zeehond is een vast woord',
      '[zee [honden kliniek]]: hondenkliniek is een vast woord',
      'Allebei even vaak: het geheugen doet niet mee',
    ],
    answer: '[[zee honden] kliniek]: zeehond is een vast woord',
    why: 'Een opgeslagen deelwoord trekt de boom naar zich toe. Zeehond is zo vast dat de lezer hondenkliniek niet eens ziet, al bestaat dat woord ook.',
  },
  {
    kind: 'swipe',
    id: 'boom-waar',
    prompt: 'Klopt deze zin?',
    cards: [
      {
        t: 'Volgens Zwitserlood activeert een volledig ondoorzichtige samenstelling de betekenis van zijn delen niet.',
        ok: true,
        why: 'Voor doorzichtige woorden vond ze die activatie wel, voor ondoorzichtige niet.',
      },
      {
        t: 'Bij drie delen kiest een lezer meestal de boom waarin een deel al een bekend woord is.',
        ok: true,
        why: 'Zeehond in zeehondencrèche, tafeltennis in tafeltennistafel.',
      },
      { t: 'Volgens Anderson hoort buiging buiten de woordboom.', ok: true, why: 'Zijn voorstel: buiging komt na de woordbouw, als de zin erom vraagt.' },
      {
        t: 'Stedenbouw laat zien dat een meervoud in een samenstelling kan zitten.',
        ok: true,
        why: 'Steden is een meervoud dat in geen enkelvoud bestaat: inherente buiging die de woordbouw voedt, zoals Booij beschreef.',
      },
      {
        t: 'Een facultatief koppelteken zet je het best op de laagste knoop.',
        ok: false,
        fix: 'op de hoogste knoop',
        why: 'Daar maakt de lezer de grootste stap: kinderopvangtoeslag-affaire.',
      },
      {
        t: 'De spelling van kinderboekenschrijver laat zien welke boom bedoeld is.',
        ok: false,
        fix: 'de spelling is voor beide bomen gelijk',
        why: 'Wil je één lezing, dan schrijf je een woordgroep.',
      },
      {
        t: 'Vleermuis is doorzichtig, want het is een muis.',
        ok: false,
        fix: 'ondoorzichtig: geen muis, en vleer betekent niets meer',
        why: 'Zo’n woord ligt als één blok in het geheugen.',
      },
    ],
  },
];
