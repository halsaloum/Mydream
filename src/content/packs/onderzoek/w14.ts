import type { StepInput } from '../../schema';

/** Onderzoek bij w14: een derde uitlegronde op onderzoeksniveau, daarna zwaardere oefeningen. */
export const ONDERZOEK_W14: StepInput[] = [
  {
    kind: 'explain',
    id: 'onderzoek',
    title: 'Vaag of dubbel, metaforen in groepen en betekenissen tellen',
    panels: [
      {
        text: 'Niet elk woord met meer lezingen is dubbelzinnig. *Tante* kan de zus van je vader of van je moeder zijn, maar dat is één betekenis die gewoon *vaag* is. Arnold Zwicky en Jerrold Sadock (1975) gaven er een toets voor: zet er *en Piet ook* achter. *Ik heb een tante, en Piet ook* mag over twee soorten tantes gaan: vaag. *Ik sta bij de bank, en Piet ook* moet over dezelfde soort bank gaan: ambigu. Dirk Geeraerts (1993) liet zien dat zulke toetsen elkaar soms tegenspreken; de grens is minder scherp dan het woordenboek doet geloven.',
        rule: 'Vaag: één betekenis met open details. Ambigu: twee betekenissen, en ook moet dezelfde kiezen.',
        lab: {
          label: 'Tik een zin met ook',
          chips: [
            { k: 'Ik heb een tante, en Piet ook.', out: 'vaag', note: 'Mijn tante van moederskant, die van Piet van vaderskant: geen probleem.' },
            { k: 'Ik heb een kind, en Piet ook.', out: 'vaag', note: 'Ik een zoon, Piet een dochter: dat kan. Kind is vaag voor jongen of meisje.' },
            { k: 'Ik sta bij de bank, en Piet ook.', out: 'ambigu', note: 'Ik bij het bankkantoor en Piet bij een bankje? Dat klinkt als een grap.' },
            { k: 'Ik pakte een blad, en Piet ook.', out: 'ambigu', note: 'Ik een blad van een boom, Piet een vel papier? Ook moet dezelfde betekenis kiezen.' },
          ],
        },
      },
      {
        text: 'Metaforen komen in groepen. George Lakoff en Mark Johnson (1980) lieten zien dat hele domeinen op elkaar worden gelegd. *TIJD IS GELD*: je *bespaart*, *verspilt* en *investeert* tijd. *RUZIE IS OORLOG*: je *valt* een standpunt *aan* en *wint* een discussie; *MEER IS OMHOOG*: prijzen *stijgen*, de werkloosheid *daalt*. Zo wordt polysemie voorspelbaar: wie één woord uit het domein geld op tijd toepast, kan de rest raden.',
        rule: 'Een conceptuele metafoor legt een heel domein over een ander: dan verschuiven veel woorden tegelijk.',
        mark: {
          q: 'Tik de woorden die tijd als geld behandelen',
          sentence: 'Deze app bespaart me tijd, maar ik verspil die tijd weer aan spelletjes.',
          targets: [2, 7],
          note: 'Besparen en verspillen komen uit het domein geld. Tijd krijgt er de logica van geld bij: schaars, op te maken, waardevol.',
        },
      },
      {
        text: 'Soms valt een omgekeerd paar (zie Woorden in een web) samen in één woord. *Lenen* kan allebei: *Mag ik je fiets lenen?* (te leen krijgen) en *Ik leen je mijn fiets* (te leen geven). Zo ook *leren*: *Ik leer Spaans*, maar *Zij leert mij Spaans*, en dan betekent het onderwijzen. Wie geen twijfel wil, kiest *uitlenen* of *lesgeven*. Het Engels houdt de paren uit elkaar: *borrow* en *lend*, *learn* en *teach*.',
        rule: 'Eén woord voor twee kanten van dezelfde situatie: de zinsbouw beslist welke kant.',
        quiz: {
          q: 'Hij leert zijn zoon fietsen. Wie kan er al fietsen?',
          options: ['de vader', 'de zoon', 'allebei'],
          answer: 'de vader',
          why: 'Met een tweede persoon erbij (zijn zoon) betekent leren: onderwijzen. De vader geeft les.',
        },
      },
      {
        text: 'Hoe tel je betekenissen? Volg *bureau*. In het Frans was *bure* een grove wollen stof, en een tafel die ermee bedekt was, werd een *bureau*. Daarna werd het de kamer met zulke tafels, en ten slotte de instelling die daar werkt: *het reisbureau*. Elke stap is metonymie: het ene hoort bij het andere. Adam Kilgarriff (1997) gaf een artikel de titel *I don’t believe in word senses*: woordenboeken knippen zo’n doorlopende keten in genummerde betekenissen, maar die grenzen leggen ze zelf.',
        rule: 'Betekenissen vormen vaak een keten, geen rijtje losse vakjes.',
        swap: {
          goal: 'Zet de betekenissen van bureau in de volgorde van de geschiedenis',
          blocks: ['kantoor', 'wollen stof', 'instelling', 'schrijftafel'],
          accept: ['wollen stof schrijftafel kantoor instelling'],
          note: 'Stof → tafel met die stof → kamer met zulke tafels → wie daar werkt. Drie stappen metonymie.',
        },
      },
    ],
  },
  {
    kind: 'sort',
    id: 'domein',
    prompt: 'Welke conceptuele metafoor?',
    buckets: ['TIJD IS GELD', 'RUZIE IS OORLOG', 'MEER IS OMHOOG'],
    items: [
      { t: 'tijd besparen', b: 0 },
      { t: 'tijd verspillen', b: 0 },
      { t: 'tijd in iets steken', b: 0 },
      { t: 'een standpunt aanvallen', b: 1 },
      { t: 'een discussie winnen', b: 1 },
      { t: 'een stelling verdedigen', b: 1 },
      { t: 'de prijzen stijgen', b: 2 },
      { t: 'de werkloosheid daalt', b: 2 },
      { t: 'een hoog cijfer', b: 2 },
    ],
    why: 'Steeds een heel domein: geld (besparen, verspillen, steken in), oorlog (aanvallen, winnen, verdedigen), hoogte (stijgen, dalen, hoog).',
  },
  {
    kind: 'ambiguity',
    id: 'put',
    prompt: 'Eén zin, twee putten',
    intro: 'Kies een betekenis en zoek de zin die alleen dát kan betekenen.',
    sentence: 'Hij zat diep in de put.',
    meanings: [
      { id: 'echt', label: 'Letterlijk in een gat in de grond', highlight: ['in de put'], right: 'Klopt. De brandweer haalt je alleen uit een echte put.' },
      {
        id: 'somber',
        label: 'Somber en terneergeslagen',
        highlight: ['diep in de put'],
        right: 'Klopt. Na een ontslag zit je figuurlijk laag: verdrietig is omlaag.',
      },
    ],
    options: [
      { t: 'Hij zat diep in de put tot de brandweer hem eruit trok.', fits: 'echt' },
      { t: 'Hij zat diep in de put sinds zijn ontslag.', fits: 'somber' },
      { t: 'Hij zat gisteren diep in de put.', fits: null, note: 'Nog steeds allebei mogelijk: er kwam alleen een tijd bij.' },
    ],
    done: {
      title: 'Omlaag is somber',
      text: 'De figuurlijke put past in een groot patroon van Lakoff en Johnson: blij is omhoog, somber is omlaag. Daarom zit je in de put en zweef je van geluk.',
    },
  },
  {
    kind: 'bet',
    id: 'tante',
    prompt: 'Ik ga naar mijn tante, en Piet ook. Kan zijn tante van moederskant zijn en de mijne van vaderskant?',
    options: ['Ja: tante is vaag', 'Nee: tante is ambigu'],
    answer: 'Ja: tante is vaag',
    why: 'Ook laat hier twee soorten tantes toe. Dan is het één vage betekenis, geen twee betekenissen.',
  },
  {
    kind: 'highlight',
    id: 'twee-motoren',
    prompt: 'Metafoor of metonymie? Kleur de woorden',
    intro: 'Metafoor: het lijkt op iets uit een ander domein. Metonymie: het staat voor iets wat erbij hoort.',
    pens: [
      { id: 'meta', label: 'metafoor', tag: 'lijkt op', ask: 'Lijkt dit op iets uit een ander domein?', accent: 'purple' },
      { id: 'meto', label: 'metonymie', tag: 'hoort bij', ask: 'Staat dit voor iets wat erbij hoort?', accent: 'orange' },
    ],
    words: [
      { t: 'Het' },
      { t: 'hele' },
      { t: 'kantoor', role: 'meto' },
      { t: 'zuchtte' },
      { t: 'toen' },
      { t: 'Brussel', role: 'meto' },
      { t: 'de' },
      { t: 'belasting' },
      { t: 'opschroefde', role: 'meta' },
      { t: 'en' },
      { t: 'de' },
      { t: 'koersen' },
      { t: 'kelderden.', role: 'meta' },
    ],
    done: {
      title: 'Twee motoren',
      text: 'Kantoor en Brussel staan voor de mensen die er werken: metonymie. Opschroeven en kelderen lenen het beeld van draaien en omlaag gaan: metafoor, met meer is omhoog.',
    },
  },
  {
    kind: 'swipe',
    id: 'ketens',
    prompt: 'Klopt deze zin?',
    cards: [
      { t: 'Tante is vaag, niet ambigu.', ok: true, why: 'Ik heb een tante, en Piet ook: twee soorten tantes mag.' },
      {
        t: 'Volgens Lakoff en Johnson staan metaforen meestal los van elkaar.',
        ok: false,
        fix: 'Ze vormen hele domeinen',
        why: 'Besparen, verspillen en investeren horen samen bij tijd is geld.',
      },
      { t: 'Lenen kan in het Nederlands te leen geven én te leen krijgen betekenen.', ok: true, why: 'Wie elk misverstand wil vermijden, zegt uitlenen.' },
      {
        t: 'Bureau betekende eerst een kantoor.',
        ok: false,
        fix: 'Het was eerst een wollen stof',
        why: 'Stof, tafel, kamer, instelling: een keten van metonymie.',
      },
      { t: 'Toetsen voor ambiguïteit geven altijd hetzelfde antwoord.', ok: false, fix: 'Ze spreken elkaar soms tegen', why: 'Dat liet Geeraerts zien.' },
      { t: 'Kilgarriff twijfelde of woordbetekenissen telbare eenheden zijn.', ok: true, why: 'Woordenboeken knippen een doorlopende keten in stukken.' },
    ],
  },
];
