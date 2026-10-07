import type { StepInput } from '../../schema';

/** Onderzoek bij w17: een derde uitlegronde op onderzoeksniveau, daarna zwaardere oefeningen. */
export const ONDERZOEK_W17: StepInput[] = [
  {
    kind: 'explain',
    id: 'onderzoek',
    title: 'Namen per taal, begrippen combineren en vage grenzen',
    panels: [
      {
        text: 'Hoe universeel is een categorie? Barbara Malt en collega’s (1999) lieten sprekers van het Engels, Chinees en Spaans tientallen flessen, potten en bakjes benoemen en op gelijkenis sorteren. De gelijkenis zagen ze vrijwel hetzelfde; de namen verschilden sterk. Wat in de ene taal één woord krijgt, valt in de andere in drie categorieën uiteen. Eef Ameel, Gert Storms, Malt en Steven Sloman (2005) herhaalden dat in België met Nederlands- en Franstaligen: ook daar lagen de grenzen van *fles* en *pot* anders dan die van de Franse woorden. Tweetaligen bleken in beide talen één tussenliggend patroon te gebruiken. Hetzelfde ding, dezelfde ogen, een andere naam.',
        rule: 'Gelijkenis is gedeeld; waar de naam ophoudt, is per taal een afspraak.',
        lab: {
          label: 'Tik een verpakking',
          chips: [
            {
              k: 'wijn, glas, smalle hals',
              out: 'fles',
              note: 'Smalle hals en een glazen lijf: fles. Engels bottle, Frans bouteille: hier lopen de talen gelijk.',
            },
            {
              k: 'jam, glas, wijde opening, deksel',
              out: 'pot',
              note: 'Wijd en met deksel: pot. Het Engels heeft daar een eigen woord voor, jar, dat het Nederlands niet apart kent.',
            },
            { k: 'cola, aluminium, 33 cl', out: 'blik', note: 'Metaal: blik. Engels can, Frans canette.' },
            {
              k: 'schoenen, karton',
              out: 'doos',
              note: 'Karton: doos. Het Frans zegt boîte, en dat gebruikt het ook voor een blik erwten: boîte de conserve. Onze grens tussen doos en blik bestaat daar niet.',
            },
          ],
        },
        deep: {
          q: 'Geldt dat ook voor kleuren?',
          a: 'Deels. Brent Berlin en Paul Kay (1969) vergeleken kleurwoorden in tientallen talen. Talen hebben hoogstens elf *basiskleurtermen*, en die komen in een vaste volgorde: eerst zwart en wit, dan rood, dan groen en geel, dan blauw, dan bruin, en pas daarna paars, roze, oranje en grijs. Het Nederlands heeft alle elf. De grenzen tussen de kleuren verschillen per taal, maar de beste voorbeelden, de *focale kleuren*, bleken over talen heen bijna gelijk. Prototypen reizen dus makkelijker dan grenzen.',
        },
      },
      {
        text: 'Hoe combineer je prototypen? Het typische huisdier is een hond, de typische vis zwemt in zee of rivier. Maar de typische *huisdiervis* is een goudvis: een slecht voorbeeld van een huisdier én een slecht voorbeeld van een vis. Daniel Osherson en Edward Smith (1981) gebruikten precies dit Engelse voorbeeld, *pet fish*, om te laten zien dat je het prototype van een samengesteld begrip niet uit de prototypen van de delen kunt berekenen. James Hampton mat later hoe kenmerken van de delen soms wél overerven, en soms niet. Voor het Nederlands, met zijn eindeloze samenstellingen, is dat een dagelijkse kwestie: wat een *zomerjas* of een *nachttrein* precies is, leer je niet door *zomer* en *jas* op te tellen.',
        rule: 'Het prototype van een combinatie bereken je niet uit de prototypen van de delen; je leert het uit de wereld.',
        quiz: {
          q: 'Wat laat de goudvis zien?',
          options: [
            'Het prototype van een samenstelling volgt niet uit de prototypen van de delen',
            'Een goudvis is het prototype van vis',
            'Huisdier heeft geen prototype',
          ],
          answer: 'Het prototype van een samenstelling volgt niet uit de prototypen van de delen',
          why: 'Hond en zeevis zeggen niets over wat de beste huisdiervis is. De combinatie heeft een eigen prototype, dat je uit ervaring leert.',
        },
        deep: {
          q: 'Waarom was dit zo’n belangrijk argument?',
          a: 'Jerry Fodor en Ernie Lepore (1996) maakten er een principiële aanval van. Betekenis moet *compositioneel* zijn: de betekenis van het geheel volgt uit de delen, anders kon je nooit een zin begrijpen die je nog nooit hoorde. Als betekenissen prototypen waren, zou dat mislukken. Verdedigers van de prototypetheorie antwoorden dat het prototype niet de hele betekenis is, maar wat je gebruikt bij het herkennen en benoemen. Het debat over wat een begrip precies is, loopt nog.',
        },
      },
      {
        text: '*Een grote muis is kleiner dan een kleine olifant.* Gradeerbare bijvoeglijke naamwoorden als *groot*, *lang* en *duur* hebben geen vaste maat. Ze meten tegen een *vergelijkingsklasse*, meestal de soort van het naamwoord: groot voor een muis. Hans Kamp (1975) werkte dat formeel uit. Zulke woorden zijn ook *vaag*: er is geen scherpe grens tussen groot en niet groot. De oude paradox van de *sorites* (Eubulides, vierde eeuw voor Christus) speelt daarmee: één korrel is geen hoop; voeg je één korrel toe aan wat geen hoop is, dan is het nog geen hoop; dus bestaat er nooit een hoop. Vaagheid is iets anders dan typicaliteit: *oneven* heeft typische voorbeelden maar geen vage grens; *kaal* heeft allebei.',
        rule: 'Een gradeerbaar bijvoeglijk naamwoord meet tegen de soort van zijn naamwoord. Doet de maat ertoe, schrijf dan een getal.',
        mark: {
          q: 'Tik de woorden die hun maat van een vergelijkingsklasse krijgen',
          sentence: 'De grote muis zat naast de kleine olifant op een hoge stoel bij een dure lamp.',
          targets: [1, 6, 10, 14],
          note: 'groot, klein, hoog en duur: elk meet tegen zijn eigen soort. Een hoge stoel is lager dan een lage kast, en een dure lamp goedkoper dan een goedkope auto. Daarom zet een schrijver er een maat bij als die telt: een muis van twaalf centimeter.',
        },
      },
      {
        text: 'Waarom hangen vrouwen, vuur en gevaarlijke dingen samen, en waarom hoort een pinguïn er toch bij? Niet door gelijkenis, maar door wat je over de wereld denkt. Gregory Murphy en Douglas Medin (1985) stelden dat een categorie samenhangt door een achtergrondtheorie, niet door een optelsom van kenmerken. Frank Keil (1989) toetste dat bij kinderen: een wasbeer die geverfd en geopereerd is tot hij op een stinkdier lijkt, blijft voor kinderen vanaf een jaar of zeven een wasbeer. Maar een koffiepot die is omgebouwd tot vogelvoederbak, is een vogelvoederbak. Bij dieren beslist het binnenste, bij gemaakte dingen beslist het doel; Paul Bloom (1996) legde dat laatste bij de bedoeling van de maker. Sorteer de dingen.',
        rule: 'Natuurlijke soort: het binnenste beslist. Gemaakt ding: het doel beslist. Gelijkenis maakt nog geen lid.',
        bins: {
          q: 'Wat beslist waar dit ding bij hoort?',
          bins: ['het binnenste (natuurlijke soort)', 'het doel (gemaakt ding)'],
          items: [
            { thing: 'muis', bin: 0, note: 'Verf een muis als een mus, en het blijft een muis. Haar afkomst en binnenste beslissen, zoals bij Keils wasbeer.' },
            {
              thing: 'computermuis',
              bin: 1,
              note: 'Lijkt op een muis en heet ernaar, maar hij is gemaakt om een pijltje te sturen. Het doel beslist waar hij thuishoort: bij de apparaten.',
              hint: 'Waarvoor is dit gemaakt?',
            },
            { thing: 'vis', bin: 0, note: 'Een vis zonder staart is nog een vis. Wat hij is, zit vanbinnen.' },
            {
              thing: 'glas',
              bin: 1,
              note: 'Zet je er bloemen in, dan gebruik je een glas als vaas, maar het blijft een glas: het is gemaakt om uit te drinken. Was het gemaakt als vaas, dan was het een vaas.',
            },
            { thing: 'mes', bin: 1, note: 'Een bot mes blijft een mes. Het is gemaakt om te snijden, ook als het dat slecht doet.' },
            {
              thing: 'pinguin',
              bin: 0,
              note: 'Een pinguïn vliegt niet en zwemt wel, en is toch een vogel: zijn binnenste en afstamming maken hem lid. Zo verklaart de theorie waarom de rand toch binnen de categorie valt.',
              hint: 'Vliegt hij? Nee. Is hij een vogel? Ja. Wat beslist dat dan?',
            },
            { thing: 'boot', bin: 1, note: 'Een boot die nooit vaart is een boot, zolang hij gemaakt is om te varen.' },
            {
              thing: 'vleermuis',
              bin: 0,
              note: 'Vliegt als een vogel, is een zoogdier. Niet de vorm maar de afstamming en het binnenste beslissen.',
              hint: 'Kijk niet naar de vleugels.',
            },
          ],
          note: 'Vier dieren, vier gemaakte dingen. Bij de dieren beslist het binnenste, bij de dingen het doel. Daarom is een pinguïn een slechte maar echte vogel, en is een computermuis geen muis in de dierentuin maar wel een muis op je bureau.',
        },
      },
    ],
  },
  {
    kind: 'sort',
    id: 'bakjes',
    prompt: 'Fles, pot, blik of doos? Kies het Nederlandse woord.',
    buckets: ['fles', 'pot', 'blik', 'doos'],
    items: [
      { t: 'wijn (glas, smalle hals)', b: 0 },
      { t: 'shampoo (plastic, smalle hals)', b: 0 },
      { t: 'ketchup (plastic, knijpbaar, met dop)', b: 0 },
      { t: 'jam (glas, wijde opening, deksel)', b: 1 },
      { t: 'pindakaas (glas, wijd)', b: 1 },
      { t: 'honing (glas, wijd, deksel)', b: 1 },
      { t: 'cola (aluminium, 33 cl)', b: 2 },
      { t: 'erwten (metaal, opener nodig)', b: 2 },
      { t: 'schoenen (karton)', b: 3 },
      { t: 'lucifers (klein, karton)', b: 3 },
    ],
    why: 'Smalle hals: fles. Wijde opening met deksel: pot. Metaal: blik. Karton: doos. Het Engels zegt jar voor pot en can voor blik; het Frans zegt boîte voor doos én blik. Welke grens een taal trekt, is een afspraak, zoals Malt en Ameel lieten zien.',
  },
  {
    kind: 'ladder',
    id: 'maat',
    prompt: 'Hoe lang is lang?',
    intro: 'Zet de dieren op de ladder: bij welk dier betekent lang het minst, bij welk het meest?',
    sentence: { before: 'Een lange', after: 'is langer dan de meeste van zijn soort.' },
    steps: [{ t: 'muis' }, { t: 'kat' }, { t: 'mens' }, { t: 'giraf' }],
    low: 'kleinste maat',
    high: 'grootste maat',
    startHint: 'Begin bij het dier waarvoor lang nog geen vijftien centimeter is.',
    done: {
      title: 'Vier maten voor één woord',
      text: 'Lang verandert van maat met de soort: de vergelijkingsklasse. Een lange muis past in je hand, een lange giraf niet in je huis.',
    },
  },
  {
    kind: 'bet',
    id: 'goudvis',
    prompt: 'De typische huisdiervis is een goudvis, geen hond en geen haring. Wat bewijst dat volgens Osherson en Smith?',
    options: [
      'Dat het prototype van een combinatie niet uit de prototypen van de delen volgt',
      'Dat een goudvis het prototype van alle vissen is',
      'Dat huisdier geen echte categorie is',
    ],
    answer: 'Dat het prototype van een combinatie niet uit de prototypen van de delen volgt',
    why: 'Pet fish was hun voorbeeld uit 1981. De combinatie heeft een eigen beste voorbeeld, dat je uit de wereld leert en niet uit de delen berekent.',
  },
  {
    kind: 'chat',
    id: 'redacteur',
    prompt: 'App met de eindredacteur',
    intro: 'Kies telkens de zin die precies zegt wat je bedoelt.',
    contact: { name: 'Daan', role: 'eindredacteur', initials: 'D' },
    rounds: [
      {
        say: 'Je schrijft: een grote hond. Hoe groot is dat eigenlijk?',
        options: ['Laat ik de maat geven: een hond van veertig kilo.', 'Groot is groot, dat snapt iedereen.'],
        right: 0,
        fix: 'een grote hond → een hond van veertig kilo',
        why: 'Groot meet tegen de soort: groot voor een hond. Doet de maat ertoe, dan geef je een getal.',
      },
      {
        say: 'En in het stuk over Parijs: de jam zat in een … wat precies?',
        options: ['In een pot: glas, wijde opening, deksel.', 'In een fles: het is van glas, dus fles.'],
        right: 0,
        fix: 'fles → pot',
        why: 'Het Nederlands trekt de grens bij de hals: wijd met deksel is een pot. Dat een Franse lezer misschien een ander woord kiest, verandert onze afspraak niet.',
      },
      {
        say: 'Mag ik schrijven dat een pinguïn eigenlijk geen vogel is, omdat hij niet vliegt?',
        options: ['Nee. Schrijf: een pinguïn is een vogel, al vliegt hij niet.', 'Ja, dat zegt de prototypetheorie toch?'],
        right: 0,
        fix: 'eigenlijk geen vogel → een vogel, al vliegt hij niet',
        why: 'Een slecht voorbeeld is nog steeds lid. Wat hem lid maakt, zit vanbinnen; vliegen is een typisch kenmerk, geen voorwaarde.',
      },
      {
        say: 'Laatste: de kop zegt dat een goudvis een typisch huisdier is. Klopt dat?',
        options: ['Een typische huisdiervis wel, een typisch huisdier niet. Dat is een hond.', 'Ja, een goudvis is een echt huisdier.'],
        right: 0,
        fix: 'typisch huisdier → typische huisdiervis',
        why: 'De combinatie heeft een eigen prototype. Als lid van huisdier staat de goudvis aan de rand.',
      },
    ],
    bye: 'Dank je, nu klopt elke categorie. Deadline gehaald!',
  },
  {
    kind: 'swipe',
    id: 'grenzen',
    prompt: 'Klopt deze zin?',
    cards: [
      {
        t: 'Volgens Malt en collega’s zien sprekers van verschillende talen de gelijkenis tussen flessen en potten heel anders.',
        ok: false,
        fix: 'De gelijkenis zien ze vrijwel hetzelfde; alleen de namen verschillen',
        why: 'Dat was juist de vondst: gedeelde waarneming, andere grenzen.',
      },
      {
        t: 'Nederlands-Franse tweetaligen in België gebruikten in beide talen één tussenliggend naamgevingspatroon.',
        ok: true,
        why: 'Ameel, Storms, Malt en Sloman (2005).',
      },
      {
        t: 'Berlin en Kay vonden dat talen hoogstens elf basiskleurtermen hebben.',
        ok: true,
        why: 'En ze komen in een vaste volgorde, van zwart en wit tot grijs.',
      },
      {
        t: 'Het prototype van huisdiervis kun je berekenen uit het prototype van huisdier en dat van vis.',
        ok: false,
        fix: 'Dat kan niet: de goudvis is bij geen van beide typisch',
        why: 'Osherson en Smith (1981).',
      },
      {
        t: 'Een lange muis is langer dan een korte giraf.',
        ok: false,
        fix: 'Een lange muis is veel korter dan een korte giraf',
        why: 'Lang meet tegen de vergelijkingsklasse: de soort.',
      },
      { t: 'Oneven getallen hebben typische voorbeelden, maar geen vage grens.', ok: true, why: 'Typicaliteit en vaagheid zijn twee verschillende dingen.' },
      {
        t: 'Volgens Keil blijft een wasbeer die op een stinkdier is gaan lijken voor oudere kinderen een wasbeer.',
        ok: true,
        why: 'Bij dieren beslist het binnenste; bij gemaakte dingen het doel.',
      },
    ],
  },
];
