import type { StepInput } from '../../schema';

/** Onderzoek bij d11: een derde uitlegronde op onderzoeksniveau, daarna zwaardere oefeningen. */
export const ONDERZOEK_D11: StepInput[] = [
  {
    kind: 'explain',
    id: 'onderzoek',
    title: 'Eisen aan betekenis, rol en familie',
    panels: [
      {
        text: 'Een affix kijkt niet alleen naar de woordsoort, maar ook naar de betekenis. *on-* plakt aan bijvoeglijke naamwoorden, maar liefst aan *positieve*: *ongelukkig*, *onaardig*, *oneerlijk*. Bij een negatieve basis gaat het mis: *onziek*, *onlelijk* en *ondom* zegt niemand. Karl Zimmer (1964) zag hetzelfde patroon in het Engels: *unhappy*, maar geen *unsad*. Toch bestaat *onschuldig*, en *schuldig* is negatief. Het is dus een sterke neiging, geen wet.',
        rule: '*on-* kiest bij voorkeur een positieve basis: *ongelukkig*, geen *onverdrietig*.',
        mark: {
          q: 'Tik de woorden die bestaan',
          sentence: 'onaardig onlelijk ongezond onziek oneerlijk ondom',
          targets: [0, 2, 4],
          note: 'onaardig, ongezond en oneerlijk: on- met een positieve basis. onlelijk, onziek en ondom bestaan niet: de basis is al negatief.',
        },
        deep: {
          q: 'Waarom zou on- zo kieskeurig zijn?',
          a: 'Een gangbare verklaring: ontkennen is pas nuttig als wat je ontkent de gewone, verwachte toestand is. *Ongezond* zegt iets, want gezond is de norm. *Onziek* zou alleen *gezond* betekenen, en dat woord bestaat al. Zo werkt ook de blokkering uit de eerste uitleg mee.',
        },
      },
      {
        text: 'Wat betekent *-er* eigenlijk? Niet altijd ‘iemand die’. Een *wekker* is een ding, een *meevaller* een gebeurtenis. Wat ze delen: een *-er*-woord noemt meestal het *onderwerp* van het werkwoord. Iemand leest: *lezer*. Iets wekt je: *wekker*. Iets valt mee: *meevaller*. Bij *meevallen* is het onderwerp geen doener, en toch werkt *-er*. Een *Amsterdammer* past niet in dit rijtje: daar is de basis een naam, geen werkwoord.',
        rule: 'Een *-er*-woord bij een werkwoord noemt het onderwerp: wie leest, wat wekt, wat meevalt.',
        lab: {
          label: 'Tik een woord',
          chips: [
            { k: 'lezer', out: 'iemand die leest', note: 'Het onderwerp van lezen: een persoon.' },
            { k: 'wekker', out: 'iets wat wekt', note: 'Het onderwerp van wekken: een ding. Zo ook opener en aansteker.' },
            { k: 'meevaller', out: 'iets wat meevalt', note: 'Het onderwerp van meevallen: een gebeurtenis. Zo ook tegenvaller.' },
            {
              k: 'Amsterdammer',
              out: 'iemand uit Amsterdam',
              note: 'Geen werkwoord als basis. Is dit hetzelfde -er, of een ander achtervoegsel met dezelfde vorm?',
            },
          ],
        },
      },
      {
        text: '*Vruchtbaar* en *dankbaar* zijn oude uitzonderingen op de regel voor *-baar*. Maar er zijn ook gewone, levende woorden die niet passen: *brandbaar* en *ontvlambaar*. In die betekenis hebben *branden* en *ontvlammen* geen lijdend voorwerp: hout brandt, gas ontvlamt. Je zou de eis dus ruimer kunnen maken: *-baar* wil een werkwoord met iets wat de handeling ondergaat, als lijdend voorwerp (*eetbaar*) of als onderwerp (*brandbaar*). Maar dan zou *valbaar* ook moeten kunnen, en dat bestaat niet. Een open vraag.',
        quiz: {
          q: 'Waarom is ‘brandbaar’ lastig voor de regel van -baar?',
          options: ['Branden heeft hier geen lijdend voorwerp', 'Branden is een sterk werkwoord', '-baar trekt hier de klemtoon'],
          answer: 'Branden heeft hier geen lijdend voorwerp',
          why: 'Hout brandt: geen lijdend voorwerp. Toch betekent brandbaar ‘kan branden’. De regel is minder strak dan hij lijkt.',
        },
        deep: {
          q: 'Zijn het misschien gewoon losse woorden?',
          a: 'Dat kan. Ook *valbaar*, *groeibaar* en *sterfbaar* bestaan niet, al hebben die werkwoorden een onderwerp dat iets ondergaat. Misschien zijn *brandbaar* en *ontvlambaar* woorden die je als geheel opslaat, en geen bewijs voor een ruimere regel. Hoe je zoiets uitzoekt, met tellen in een corpus, zie je in de master (Productiviteit meten).',
        },
      },
      {
        text: 'Soms bestaat de basis niet eens los. *Populist* komt niet van *populisme*, en *populisme* niet van *populist*: ze delen het stuk *popul-*, dat los niet bestaat, en ruilen hun achtervoegsel. Wie *pacifisme* kent, weet meteen wat een *pacifist* is. De eis gaat dan niet over één basiswoord, maar over een familie: *-ist* past bij veel woorden op *-isme*. Morfologen noemen dat *paradigmatische* woordvorming. Je maakt een woord door een affix te ruilen, niet door er een bij te plakken.',
        rule: 'Paradigmatisch: ruil *-isme* voor *-ist* of *-istisch*. Stapelen (*toerismist*) kan niet.',
        paradigm: {
          q: 'Ruil het achtervoegsel',
          cols: ['-isme', '-ist', '-istisch'],
          rows: [
            { label: 'toer-', cells: ['toerisme', { fill: 'toerist' }, { fill: 'toeristisch' }] },
            { label: 'popul-', cells: ['populisme', { fill: 'populist', hint: 'Ruil -isme voor -ist, plak niets bij.' }, { fill: 'populistisch' }] },
            { label: 'femin-', cells: [{ fill: 'feminisme' }, 'feminist', { fill: 'feministisch' }] },
            { label: 'activ-', cells: [{ fill: 'activisme' }, 'activist', { fill: 'activistisch' }] },
          ],
          extra: ['toerismist', 'populismist'],
          note: 'Drie leden per familie, en geen van de drie is de basis van de andere twee. Je ruilt het laatste stuk.',
        },
      },
    ],
  },
  {
    kind: 'highlight',
    id: 'er-rollen',
    prompt: 'Kleur de -er-woorden naar wat ze noemen',
    intro: 'Een persoon, een ding of een gebeurtenis? De andere woorden blijven wit.',
    pens: [
      { id: 'persoon', label: 'persoon', tag: 'wie', ask: 'Noemt dit woord iemand die iets doet?', accent: 'blue' },
      { id: 'ding', label: 'ding', tag: 'waarmee', ask: 'Noemt dit woord een instrument?', accent: 'orange' },
      { id: 'gebeurtenis', label: 'gebeurtenis', tag: 'wat er gebeurt', ask: 'Noemt dit woord iets wat gebeurt?', accent: 'purple' },
    ],
    words: [
      { t: 'De' },
      { t: 'bakker', role: 'persoon' },
      { t: 'vond' },
      { t: 'de' },
      { t: 'opener:', role: 'ding' },
      { t: 'een' },
      { t: 'meevaller', role: 'gebeurtenis' },
      { t: 'na' },
      { t: 'de' },
      { t: 'tegenvaller', role: 'gebeurtenis' },
      { t: 'met' },
      { t: 'de' },
      { t: 'wekker.', role: 'ding' },
    ],
    done: {
      title: 'Drie keer het onderwerp',
      text: 'bakker, opener, meevaller: telkens het onderwerp van het werkwoord. Wie bakt, wat opent, wat meevalt.',
    },
  },
  {
    kind: 'ambiguity',
    id: 'opener',
    prompt: 'Eén woord, twee soorten -er',
    intro: 'Kies een betekenis en zoek de zin die alleen dát kan betekenen.',
    sentence: 'De opener was een groot succes.',
    meanings: [
      {
        id: 'ding',
        label: 'Een ding om iets mee open te maken',
        highlight: ['De opener'],
        right: 'Klopt. Het ding opent het flesje: het onderwerp van openen is hier een instrument.',
      },
      {
        id: 'begin',
        label: 'Het eerste nummer van een optreden',
        highlight: ['De opener'],
        right: 'Klopt. Het eerste nummer opent de avond: ook dat is het onderwerp van openen.',
      },
    ],
    options: [
      { t: 'De opener was gisteren een groot succes.', fits: null, note: 'Nog steeds allebei mogelijk. Er kwam alleen een tijd bij.' },
      { t: 'De opener uit de la was een groot succes: het flesje ging eindelijk open.', fits: 'ding' },
      { t: 'De opener van het concert was een groot succes: de zaal zong meteen mee.', fits: 'begin' },
    ],
    done: {
      title: 'Twee keer het onderwerp',
      text: 'Een ding dat opent en een nummer dat opent: -er noemt in beide gevallen het onderwerp van openen. De context kiest.',
    },
  },
  {
    kind: 'bet',
    id: 'ontzorging',
    prompt: 'Een nieuw werkwoord: ‘ontzorgen’ (iemand zorgen uit handen nemen). Welk zelfstandig naamwoord past?',
    options: ['ontzorging', 'ontzorgsel', 'ontzorgheid'],
    answer: 'ontzorging',
    why: '-ing wil een werkwoord en past vlot op werkwoorden met een voorvoegsel: bespreking, ontmoeting. -heid wil een bijvoeglijk naamwoord, en -sel noemt een product, zoals mengsel of verzinsel.',
  },
  {
    kind: 'sort',
    id: 'positief',
    prompt: 'Bestaat dit woord met on-?',
    buckets: ['bestaat', 'bestaat niet'],
    items: [
      { t: 'ongelukkig', b: 0 },
      { t: 'onduidelijk', b: 0 },
      { t: 'onvriendelijk', b: 0 },
      { t: 'onveilig', b: 0 },
      { t: 'onschuldig', b: 0 },
      { t: 'onverdrietig', b: 1 },
      { t: 'onslecht', b: 1 },
      { t: 'onboos', b: 1 },
      { t: 'onzwak', b: 1 },
      { t: 'onvies', b: 1 },
    ],
    why: 'on- kiest een positieve basis: gelukkig, duidelijk, vriendelijk, veilig. Verdrietig, slecht, boos, zwak en vies zijn al negatief. onschuldig is het bekende tegenvoorbeeld.',
  },
  {
    kind: 'swipe',
    id: 'kaarten',
    prompt: 'Klopt deze zin?',
    cards: [
      { t: 'on- plakt het liefst aan een positief bijvoeglijk naamwoord.', ok: true, why: 'ongezond en oneerlijk bestaan, onziek en onlelijk niet.' },
      {
        t: 'Onschuldig bewijst dat on- nooit aan een negatieve basis plakt.',
        ok: false,
        fix: 'onschuldig is juist een tegenvoorbeeld',
        why: 'schuldig is negatief, en toch bestaat onschuldig. Een neiging, geen wet.',
      },
      { t: 'In meevaller noemt -er het onderwerp van meevallen.', ok: true, why: 'Het valt mee: het onderwerp is de gebeurtenis zelf.' },
      {
        t: 'De wekker naast je bed is iemand die wekt.',
        ok: false,
        fix: 'die wekker is een ding dat wekt',
        why: '-er kan ook een instrument noemen, zoals opener en aansteker.',
      },
      {
        t: 'Brandbaar past precies in de regel dat -baar een lijdend voorwerp wil.',
        ok: false,
        fix: 'branden heeft hier geen lijdend voorwerp',
        why: 'Hout brandt. Brandbaar is een levend tegenvoorbeeld.',
      },
      { t: 'Een populist maak je door -isme te ruilen voor -ist.', ok: true, why: 'Paradigmatische woordvorming: ruilen in plaats van plakken.' },
    ],
  },
];
