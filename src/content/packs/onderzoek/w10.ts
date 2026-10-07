import type { StepInput } from '../../schema';

/** Onderzoek bij w10: een derde uitlegronde op onderzoeksniveau, daarna zwaardere oefeningen. */
export const ONDERZOEK_W10: StepInput[] = [
  {
    kind: 'explain',
    id: 'onderzoek',
    title: 'Analogie, schema’s en een verleden tijd die heden werd',
    panels: [
      {
        text: 'In de eerste uitleg leek elke reeks één patroon te hebben. Kijk naar de oude derde reeks: korte klinker plus twee medeklinkers. *Binden, bond* en *zwemmen, zwom* kregen een *o*. Maar *helpen*, *werpen* en *sterven* uit dezelfde reeks hebben *hielp*, *wierp*, *stierf*. In het Middelnederlands was het nog *halp*, *warp*, *starf*. De *ie* is geleend van de zevende reeks: *liep*, *viel*, *hield*. En *gelden* en *smelten*, met dezelfde *e* plus *l*, gingen de andere kant op: *gold*, *smolt*, met de *o* van het oude meervoud *golden*. Analogie koos dus per werkwoord. Het deelwoord bleef overal bij de *o*: *geholpen*, *gegolden*.',
        rule: 'Analogie kiest per werkwoord: *hielp* naar *liep*, *gold* naar *golden*. Eén oude reeks, twee nieuwe patronen.',
        paradigm: {
          q: 'Vul de sterke vormen in',
          cols: ['verleden tijd', 'voltooid deelwoord'],
          rows: [
            { label: 'helpen', cells: [{ fill: 'hielp', hint: 'Niet halp of holp: de ie kwam van liep en viel.' }, 'geholpen'] },
            {
              label: 'werpen',
              cells: [
                { fill: 'wierp', hint: 'Zoals hielp: ie uit de zevende reeks.' },
                { fill: 'geworpen', hint: 'Het deelwoord houdt de o.' },
              ],
            },
            { label: 'sterven', cells: [{ fill: 'stierf', hint: 'Middelnederlands starf, nu stierf naar liep en viel.' }, 'gestorven'] },
            { label: 'gelden', cells: [{ fill: 'gold', hint: 'Hier won de o van het oude meervoud golden.' }, { fill: 'gegolden' }] },
            { label: 'smelten', cells: [{ fill: 'smolt', hint: 'Zoals gold: de o uit het meervoud.' }, { fill: 'gesmolten' }] },
            { label: 'schelden', cells: ['schold', { fill: 'gescholden' }] },
          ],
          extra: ['halp', 'holp', 'smielt', 'gesmelt'],
          note: 'Zes werkwoorden, één oude reeks, twee uitkomsten in de verleden tijd. Het deelwoord heeft overal een o.',
        },
        deep: {
          q: 'Waarom juist de ie?',
          a: 'De zevende reeks was groot en gewoon: *lopen*, *vallen*, *houden*, *slapen*, *laten*, *roepen*, allemaal met *ie* in de verleden tijd. Zo’n grote, vaste groep werkt als een magneet. Welk werkwoord erin getrokken werd en welk niet, is niet te voorspellen. Dat is het verschil tussen een klankwet (zonder uitzondering) en analogie (per woord).',
        },
      },
      {
        text: 'Analogie kan zelfs een leenwoord sterk maken. *Prijzen* (loven) komt uit het Oudfrans *preisier*. In het Middelnederlands kreeg het *prees*, *geprezen*, naar het voorbeeld van *wijzen* en *rijzen*. *Schrijven*, uit het Latijn *scribere*, werd al in het Oergermaans sterk. Joan Bybee en Carol Moder (1983) legden uit hoe dat kan: een reeks is een *schema*, een klankpatroon dat nieuwe leden aantrekt als ze erop lijken. In het Engels maakt de groep *string, strung* nog steeds nieuwe leden (*bring, brung* in de spreektaal). Remco Knooihuizen en Oscar Strik (2014) testten het met verzonnen Nederlandse werkwoorden: zwak wint bijna altijd, maar bij *ij* kiest een flink deel van de sprekers toch *ee*.',
        rule: 'Een reeks is een schema: hoe meer een nieuw werkwoord erop lijkt en hoe groter de reeks, hoe eerder het sterk wordt.',
        lab: {
          label: 'Tik een verzonnen werkwoord',
          chips: [
            {
              k: 'zwijpen',
              out: 'zweep, gezwepen · of zwijpte, gezwijpt',
              note: 'ij, ee, ee is de eerste reeks: blijven, bleef, gebleven. Dit schema is nog het levendigste; een flink deel van de sprekers kiest hier zweep.',
            },
            {
              k: 'knimmen',
              out: 'knom, geknommen · of knimde, geknimd',
              note: 'i vóór m of n: zwemmen, zwom, gezwommen. De derde reeks trekt nog een beetje, minder dan de ij-reeks.',
            },
            {
              k: 'ploeten',
              out: 'ploette, geploet',
              note: 'Geen enkele reeks heeft oe als grondklinker. Er is geen schema om op te lijken, dus iedereen maakt het zwak.',
            },
            {
              k: 'vlaken',
              out: 'vlaakte, gevlaakt',
              note: 'aa naar oe, zoals dragen, droeg, zou kunnen, maar die reeks is klein. Een klein schema trekt nauwelijks.',
            },
          ],
        },
        deep: {
          q: 'En kinderen?',
          a: 'Die doen eerst het omgekeerde. Een kind zegt eerst *liep* (uit het hoofd), dan opeens *loopte* zodra het de regel ontdekt, en daarna weer *liep*. Gary Marcus en collega’s (1992) beschreven die U-vormige curve voor het Engels. Het laat zien dat zwak de regel is en sterk de opgeslagen uitzondering, precies de tweedeling uit Opslaan of opbouwen? (d17).',
        },
      },
      {
        text: 'Nog een proef met verzonnen werkwoorden, nu voor de spelling. Mirjam Ernestus en Harald Baayen (2003) lieten Nederlanders een stam horen, zoals *ik gloof*, en vroegen de verleden tijd. Aan het eind van een woord klinkt een *v* als *f* en een *z* als *s*, dus de stam verraadt niets. Toch kozen de sprekers niet willekeurig: ze volgden de buren. Na een lange klinker is een *f* in het Nederlands bijna altijd een *v* (*leven*, *geloven*, *schrijven*), dus *gloofde*. Na een korte klinker is een *s* bijna altijd een *s* (*kussen*, *missen*), dus *kniste*. Je spelt met je hele woordenschat mee, ook bij een woord dat niet bestaat.',
        rule: '’t Kofschip werkt alleen als je de stam kent. Bij een onbekende stam kiezen sprekers naar de buren: *gloofde*, *kniste*.',
        build: {
          before: 'Een verzonnen werkwoord: ik gloof. Wat kiezen de meeste sprekers? Gisteren…',
          stem: 'gloof',
          endings: ['de', 'te'],
          answer: 'de',
          note: 'Lange oo plus f: denk aan geloofde, roofde, stoofde. De meeste sprekers kiezen -de. Bij ik knis zouden ze -te kiezen, zoals kuste en miste.',
        },
        deep: {
          q: 'Wat zegt dit over ’t kofschip?',
          a: 'Dat de regel niet naar de letter kijkt maar naar de klank van het hele werkwoord, en dat sprekers die klank bij twijfel reconstrueren uit vergelijkbare woorden. Daarom gaat het mis bij echte woorden met weinig buren: *verhuisde* (van *verhuizen*) naast *kruiste* (van *kruisen*), na dezelfde *ui*.',
        },
      },
      {
        text: 'Waarom zeg je *hij kan* en niet *hij kant*? Omdat *kan* ooit een sterke verleden tijd was. *Ik kan* betekende ‘ik heb geleerd’, en dus ‘ik weet hoe het moet’. *Ik weet* betekende ‘ik heb gezien’: het is familie van het Latijnse *vidēre*. Zulke werkwoorden heten *preterito-presentia*: een oude verleden tijd die als tegenwoordige tijd dienstdoet. Daarom missen ze de *-t* van de derde persoon, net zoals *liep* en *zong* die missen. Voor de nieuwe verleden tijd maakten ze een zwakke vorm: *konde*, nu *kon*, maar in *wij konden* zie je de *d* nog. *Willen* hoorde er niet bij, maar sloot zich aan: *hij wil*. *Hij wilt* is daarom fout.',
        rule: 'Oude verleden tijden als tegenwoordige tijd: *hij kan*, *mag*, *zal* zonder *-t*. *Willen* deed mee: *hij wil*, nooit *hij wilt*.',
        paradigm: {
          q: 'Vul de vormen in',
          cols: ['hij … (nu)', 'verleden tijd'],
          rows: [
            {
              label: 'kunnen',
              cells: [
                { fill: 'kan', hint: 'Geen t: kan is zelf een oude verleden tijd.' },
                { fill: 'kon', hint: 'Uit konde: in wij konden zie je de d nog.' },
              ],
            },
            { label: 'mogen', cells: [{ fill: 'mag' }, { fill: 'mocht', hint: 'Zwak, met een t en een andere klinker, zoals dacht.' }] },
            { label: 'zullen', cells: ['zal', { fill: 'zou', hint: 'Uit zoude: in wij zouden zie je de d nog.' }] },
            { label: 'weten', cells: [{ fill: 'weet' }, { fill: 'wist' }] },
            { label: 'willen', cells: [{ fill: 'wil', hint: 'Zonder t: willen sloot zich bij het rijtje aan. Alleen u wilt mag.' }, 'wilde'] },
          ],
          extra: ['kant', 'wilt', 'magt', 'weette'],
          note: 'Kan, mag, zal en wil zonder -t; weet heeft zijn t al in de stam. De verleden tijd is zwak, met een t of d, soms met een andere klinker, zoals bij dacht en bracht.',
        },
        deep: {
          q: 'En durven?',
          a: 'Ook *durven* hoorde erbij: de oude verleden tijd *dorst* bestaat nog naast *durfde*. Maar *hij durft* heeft wél een *-t*: in de tegenwoordige tijd is het werkwoord gewoon geworden. Een rijtje kan dus woord voor woord leeglopen, net als de sterke werkwoorden.',
        },
      },
    ],
  },
  {
    kind: 'ladder',
    id: 'stadia',
    prompt: 'Van helemaal zwak naar helemaal sterk',
    intro: 'Tel per werkwoord hoeveel van de twee vormen (verleden tijd en deelwoord) nog sterk zijn. Een cel met twee vormen telt voor de helft.',
    sentence: { before: 'Op deze sport staat', after: '.' },
    steps: [{ t: 'werken' }, { t: 'jagen' }, { t: 'bakken' }, { t: 'raden' }, { t: 'rijden' }],
    low: 'helemaal zwak',
    high: 'helemaal sterk',
    startHint: 'Begin bij het werkwoord dat allebei de vormen zwak heeft.',
    done: {
      title: 'Vijf stadia',
      text: 'werken: werkte, gewerkt. jagen: joeg of jaagde, gejaagd. bakken: bakte, gebakken. raden: ried of raadde, geraden. rijden: reed, gereden. De overgang van sterk naar zwak gaat cel voor cel.',
    },
  },
  {
    kind: 'sort',
    id: 'herkomst',
    prompt: 'Hoe kwam deze vorm tot stand?',
    buckets: ['oude ablaut', 'sterke vorm door analogie', 'zwak geworden', 'preterito-presens'],
    items: [
      { t: 'binden – bond', b: 0 },
      { t: 'geven – gaf', b: 0 },
      { t: 'prijzen (loven) – prees', b: 1 },
      { t: 'vragen – vroeg', b: 1 },
      { t: 'helpen – hielp', b: 1 },
      { t: 'jagen – joeg', b: 1 },
      { t: 'bakken – bakte', b: 2 },
      { t: 'lachen – lachte', b: 2 },
      { t: 'kunnen – kan', b: 3 },
      { t: 'weten – weet', b: 3 },
    ],
    why: 'Bond en gaf: ablaut uit het Germaans. Prees (een Frans leenwoord), vroeg, hielp en joeg: sterke vormen die pas later naar een voorbeeld ontstonden. Bakte en lachte: zwak geworden, al bleef het deelwoord sterk. Kan en weet: oude verleden tijden die nu heden zijn.',
  },
  {
    kind: 'type',
    id: 'zwijpen',
    prompt: 'Een verzonnen werkwoord: zwijpen. Maak de sterke verleden tijd naar het schema van blijven, bleef.',
    before: 'Gisteren',
    after: 'hij de hele dag.',
    hint: 'zw…',
    answer: 'zweep',
    why: 'ij wordt ee: de eerste reeks. Veel Nederlanders kiezen dit vanzelf voor een ij-werkwoord dat ze nooit gehoord hebben. Dat is het schema van Bybee en Moder aan het werk.',
  },
  {
    kind: 'fix',
    id: 'wilt',
    prompt: 'Tik het foute woord aan en verbeter het.',
    sentence: 'Mijn broer wilt volgend jaar taalkunde studeren.',
    wrong: 2,
    answer: 'wil',
    why: 'Willen heeft zich bij kan, mag en zal aangesloten: geen -t bij hij. Alleen bij u mag het allebei: u wilt of u wil.',
  },
  {
    kind: 'swipe',
    id: 'analogie-waar',
    prompt: 'Klopt deze zin?',
    cards: [
      {
        t: 'Prijzen in de betekenis loven is een Germaans erfwoord met oude ablaut.',
        ok: false,
        fix: 'Het is een Frans leenwoord dat sterk werd naar het voorbeeld van wijzen',
        why: 'Analogie kan zelfs een leenwoord in een reeks trekken.',
      },
      { t: 'Hielp heeft zijn ie van de reeks van lopen, liep.', ok: true, why: 'Middelnederlands halp werd hielp naar liep en viel.' },
      {
        t: 'Volgens Bybee en Moder trekt een sterk patroon nieuwe werkwoorden aan als ze er qua klank op lijken.',
        ok: true,
        why: 'Een reeks werkt als schema: string, strung en in de spreektaal bring, brung.',
      },
      {
        t: 'Bij een verzonnen werkwoord kiezen Nederlanders altijd de zwakke vorm.',
        ok: false,
        fix: 'Meestal, maar bij een ij-werkwoord kiest een flink deel een sterke vorm',
        why: 'De eerste reeks is nog het levendigste schema.',
      },
      { t: 'Ik kan was ooit een verleden tijd.', ok: true, why: 'Ik heb geleerd, dus ik weet hoe het moet: een preterito-presens.' },
      { t: 'Hij wilt is standaardtaal, net als hij werkt.', ok: false, fix: 'Hij wil, zonder t', why: 'Willen volgt het rijtje kan, mag, zal.' },
      { t: 'In wij konden zie je nog de oude zwakke uitgang met d.', ok: true, why: 'Konde werd kon, maar het meervoud hield de d.' },
    ],
  },
];
