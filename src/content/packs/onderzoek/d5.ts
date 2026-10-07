import type { StepInput } from '../../schema';

/** Onderzoek bij d5: een derde uitlegronde op onderzoeksniveau, daarna zwaardere oefeningen. */
export const ONDERZOEK_D5: StepInput[] = [
  {
    kind: 'explain',
    id: 'onderzoek',
    title: 'Het morfeem voorbij de rij letters',
    panels: [
      {
        text: 'Waarom kun je met een paar dozijn klanken een onbegrensde woordenschat maken? André Martinet (1960) noemde dat de *dubbele geleding* van taal. Op de eerste geleding knip je een zin in *monemen*: zijn woord voor stukken met betekenis, ons morfeem. Op de tweede geleding knip je elk moneem in fonemen, en die betekenen zelf niets. Charles Hockett (1960) zette hetzelfde idee als *duality of patterning* op zijn lijst van kenmerken die mensentaal van dierentaal onderscheiden. Het morfeem is het scharnier tussen de twee lagen: de kleinste eenheid die nog iets betekent.',
        rule: 'Fonemen onderscheiden, morfemen betekenen. Het morfeem is de kleinste eenheid van de bovenste laag.',
        split: {
          q: 'Knip op de eerste geleding: in morfemen',
          word: 'huisdieren',
          answer: 'huis-dier-en',
          note: 'Drie morfemen: huis, dier en het meervoud. Op de tweede geleding zijn het acht fonemen, h-ui-s-d-ie-r-e-n, en geen daarvan betekent iets. Met zo’n veertig fonemen bouwt het Nederlands een onbegrensde voorraad morfemen.',
        },
        deep: {
          q: 'Hebben dieren die twee lagen ook?',
          a: 'Meerkatten hebben aparte alarmroepen voor een luipaard, een adelaar en een slang (Seyfarth, Cheney en Marler, 1980). Elke roep betekent iets, zoals een morfeem. Maar de roepen bestaan niet uit kleinere, betekenisloze stukken die je opnieuw kunt combineren tot een nieuwe roep. Precies die tweede laag maakt mensentaal onbegrensd.',
        },
      },
      {
        text: 'Hoe vind je morfemen zonder woordenboek? Zellig Harris (1955) telde, klank voor klank, hoeveel verschillende vervolgen de taal toelaat. Na *on* kan bijna alles komen; na *onl* nog maar een paar letters. Waar het aantal mogelijkheden ineens piekt, ligt een grens. Tel je ook van achteren, dan vind je *on|lees|baar* zonder één betekenis te kennen. Een verwante gedachte zit in de tokenizers van taalmodellen: die knippen woorden in veelvoorkomende stukken, op grond van frequentie. Die stukken lijken vaak op morfemen, maar vallen er lang niet altijd mee samen.',
        rule: 'Een morfeemgrens is een plek waar de taal ineens veel kanten op kan.',
        lab: {
          label: 'Tik een stuk van onleesbaar',
          chips: [
            { k: 'on·', out: 'veel vervolgen', note: 'onaardig, onbekend, oneerlijk, onleesbaar: na on kan bijna elke letter komen. Een piek, dus een grens.' },
            { k: 'onl·', out: 'weinig vervolgen', note: 'onleesbaar, onlogisch, onlust: na onl komen maar een paar klinkers. Je zit midden in een morfeem.' },
            {
              k: 'onlees·',
              out: 'bijna niets',
              note: 'Na onlees kan alleen nog baar komen: onleesbaar, onleesbaarheid. Van voren tellend vind je de grens tussen lees en baar dus niet.',
            },
            {
              k: '·baar',
              out: 'veel voorgangers',
              note: 'Tel nu van achteren: vóór baar staat van alles, zoals in eetbaar, leesbaar, draagbaar, deelbaar. Weer een piek, dus toch een grens.',
            },
          ],
        },
        deep: {
          q: 'Werkt dat altijd?',
          a: 'Nee. De telling kijkt alleen naar vorm, dus ze knipt ook *kam|er* en *ham|er*, al betekent *kam* niets in *kamer*. Een tokenizer die op frequentie knipt, maakt dezelfde fouten: een zeldzaam woord valt in rare stukken uiteen. Daarom proberen onderzoekers, vooral voor talen met veel woordbouw, tokenizers te maken die wél iets van morfemen weten.',
        },
      },
      {
        text: 'Een morfeem hoeft geen aaneengesloten rij letters te zijn. In het Arabisch bestaat een woord uit een *wortel* van drie medeklinkers en een *patroon* van klinkers dat erdoorheen wordt geweven. De wortel *k-t-b* betekent ‘schrijven’: *kataba* (hij schreef), *kitāb* (boek), *kātib* (schrijver), *maktab* (kantoor), *kutub* (boeken). John McCarthy (1981) analyseerde wortel en patroon als twee morfemen op aparte lagen, die pas in het woord in elkaar schuiven. Het Nederlands heeft daar een mini-versie van: in *zing*, *zong*, *gezongen* zit de tijd in de klinker, niet in een los stukje.',
        rule: 'Wortel en patroon zijn allebei morfemen, en geen van beide is een rijtje letters.',
        paradigm: {
          q: 'Koppel elke vorm van k-t-b aan zijn betekenis',
          cols: ['betekenis'],
          rows: [
            { label: 'kataba', cells: [{ fill: 'hij schreef', hint: 'Het patroon a-a-a met alleen de wortel: een werkwoordsvorm.' }] },
            { label: 'kitāb', cells: [{ fill: 'boek', hint: 'Een boek is iets wat geschreven is.' }] },
            { label: 'kātib', cells: [{ fill: 'schrijver', hint: 'Lange a, dan i: het patroon van de doener, net als ons -er.' }] },
            { label: 'maktab', cells: [{ fill: 'kantoor', hint: 'Met ma- ervoor noemt het patroon een plek: waar geschreven wordt.' }] },
            { label: 'kutub', cells: [{ fill: 'boeken', hint: 'Het meervoud zit in de klinkers, niet aan het eind.' }] },
          ],
          extra: ['hij las', 'school'],
          note: 'Vijf woorden, één wortel k-t-b. De medeklinkers dragen de kernbetekenis, het patroon eromheen de rest: doener, plek, meervoud. Een morfeem als skelet.',
        },
        deep: {
          q: 'Is zing, zong dan ook een patroon?',
          a: 'Het lijkt erop: *drink*, *dronk*, *bind*, *bond* en *spring*, *sprong* volgen allemaal *i* naar *o*. Toch is het Nederlands geen patroontaal. De wissel geldt voor een beperkte groep oude werkwoorden, en nieuwe werkwoorden krijgen gewoon *-te* of *-de*: *appen*, *appte*. In het Arabisch is het patroon de gewone manier om woorden te maken. Hoe je zo’n wissel in een model zet, is de vraag van de master (Morfeem, proces of paradigma?).',
        },
      },
      {
        text: 'Voor het schrijven telt dit: de spelling laat morfeemgrenzen zien die je niet hoort. In *onmiddellijk* hoor je één *l*, maar *middel* en *lijk* houden allebei hun letter. Zo ook *hoofddoek*, *nachttrein* en *stadsschouwburg*: op de grens botsen twee gelijke letters en je schrijft ze allebei. Wie *onmiddelijk* schrijft, heeft de grens niet gezien. Staan er op de grens twee verschillende letters, dan verdubbel je niets: *eigen* + *lijk* wordt *eigenlijk*, *in* + *eens* wordt *ineens*.',
        rule: 'Op een morfeemgrens schrijf je beide letters, ook als je er maar één hoort: *onmiddellijk*, *hoofddoek*.',
        mark: {
          q: 'Tik de woorden waar op de morfeemgrens twee gelijke letters botsen',
          sentence: 'onmiddellijk eigenlijk hoofddoek ineens nachttrein uiteindelijk stadsschouwburg',
          targets: [0, 2, 4, 6],
          note: 'on + middel + lijk, hoofd + doek, nacht + trein, stad + s + schouwburg: twee keer dezelfde letter op de grens. eigenlijk, ineens en uiteindelijk hebben geen botsing: eigen + lijk, in + eens, uit + einde + lijk.',
        },
        deep: {
          q: 'En als twee klinkers botsen?',
          a: 'Dan hangt het af van de soort grens. In een samenstelling komt een koppelteken: *zee-eend*, *auto-ongeluk*, *mee-eten*. In een afleiding of buiging komt een trema: *beïnvloeden*, *geëist*, *knieën*. De spelling kijkt dus niet alleen óf er een morfeemgrens ligt, maar ook wat voor grens het is.',
        },
      },
    ],
  },
  {
    kind: 'sort',
    id: 'skelet',
    prompt: 'Hoe zit het morfeem in de vorm?',
    buckets: ['los stukje, aan elkaar geregen', 'patroon in de stam', 'geen morfeem af te knippen'],
    items: [
      { t: 'boek-en', b: 0 },
      { t: 'on-eerlijk', b: 0 },
      { t: 'lees-baar', b: 0 },
      { t: 'huis-je', b: 0 },
      { t: 'zing → zong', b: 1 },
      { t: 'drink → dronk', b: 1 },
      { t: 'kitāb → kutub', b: 1 },
      { t: 'kataba → kātib', b: 1 },
      { t: 'tafel', b: 2 },
      { t: 'kamer', b: 2 },
    ],
    why: 'boeken, oneerlijk, leesbaar en huisje rijgen stukjes aan elkaar. zong, dronk, kutub en kātib zetten de betekenis in de klinkers van de stam. tafel en kamer zijn één morfeem: dat er een kam in kamer lijkt te zitten, is toeval, net als corner en corn in het Engels.',
  },
  {
    kind: 'type',
    id: 'klond',
    prompt: 'Een verzonnen werkwoord: klinden, met de klinkerwissel van binden, bond, gebonden. Typ de verleden tijd.',
    before: 'Gisteren',
    after: 'hij de hele dag.',
    hint: 'kl…',
    answer: 'klond',
    why: 'Het patroon i naar o van binden, zingen en drinken: de tijd zit in de klinker, niet in een stukje erachter. Wie bij een nieuw woord klond zegt, heeft dat patroon als vorm opgeslagen.',
  },
  {
    kind: 'bet',
    id: 'daris',
    prompt: 'Arabisch: k-t-b is schrijven en kātib is schrijver. De wortel d-r-s betekent leren, studeren. Wat is ‘iemand die studeert’?',
    options: ['dāris', 'durūs', 'madrasa'],
    answer: 'dāris',
    why: 'Het patroon met een lange a en dan een i maakt de doener: kātib, dāris. madrasa noemt met ma- een plek, de school. durūs is een meervoud: lessen. Eén wortel, drie patronen, drie morfemen die geen van alle een rijtje letters zijn.',
  },
  {
    kind: 'proofread',
    id: 'botsing',
    prompt: 'Lees de tekst na',
    intro: 'Er staan vier fouten op morfeemgrenzen. Tik ze aan.',
    tokens: [
      { t: 'Eigenlijk' },
      { t: 'wilde' },
      { t: 'ik' },
      { t: 'onmiddelijk', fix: 'onmiddellijk', why: 'on + middel + lijk: middel en lijk houden allebei hun l.' },
      { t: 'de' },
      { t: 'nachtrein', fix: 'nachttrein', why: 'nacht + trein: twee keer t op de grens.' },
      { t: 'naar' },
      { t: 'de' },
      { t: 'stadschouwburg', fix: 'stadsschouwburg', why: 'stad + s + schouwburg: de tussen-s en de s van schouwburg staan allebei.' },
      { t: 'nemen,' },
      { t: 'met' },
      { t: 'mijn' },
      { t: 'nieuwe' },
      { t: 'hoofdoek', fix: 'hoofddoek', why: 'hoofd + doek: de d van hoofd blijft staan.' },
      { t: 'om.' },
    ],
    done: {
      title: 'Vier grenzen gevonden',
      text: 'Je hoort één letter, je schrijft er twee: de spelling bewaart elk morfeem heel. Eigenlijk was goed: eigen + lijk, zonder botsing.',
    },
  },
  {
    kind: 'swipe',
    id: 'geleding',
    prompt: 'Klopt deze zin?',
    cards: [
      {
        t: 'Volgens Martinet betekent een foneem op zichzelf al iets.',
        ok: false,
        fix: 'Fonemen onderscheiden alleen; betekenis begint bij het moneem',
        why: 'Dat is de tweede geleding: stukken zonder betekenis waarmee je stukken met betekenis bouwt.',
      },
      {
        t: 'Hockett rekende de dubbele geleding tot de kenmerken die mensentaal van dierentaal onderscheiden.',
        ok: true,
        why: 'Een alarmroep betekent iets, maar bestaat niet uit herbruikbare, betekenisloze stukken.',
      },
      {
        t: 'De methode van Harris heeft een woordenboek met betekenissen nodig.',
        ok: false,
        fix: 'Ze telt alleen welke vervolgen mogelijk zijn',
        why: 'Waar het aantal mogelijke vervolgen piekt, ligt een grens. Betekenis komt er niet aan te pas.',
      },
      {
        t: 'Een tokenizer van een taalmodel knipt altijd precies op morfeemgrenzen.',
        ok: false,
        fix: 'Hij knipt op frequentie; de stukken vallen lang niet altijd samen met morfemen',
        why: 'Daarom zoeken onderzoekers naar tokenizers die iets van woordbouw weten.',
      },
      {
        t: 'In het Arabisch zit de kernbetekenis van een woord in de medeklinkers.',
        ok: true,
        why: 'k-t-b is schrijven; de klinkers maken er een boek, een schrijver of een kantoor van.',
      },
      { t: 'kitāb en kutub hebben dezelfde wortel.', ok: true, why: 'Boek en boeken: hetzelfde skelet k-t-b, een ander patroon.' },
      {
        t: 'In onmiddellijk schrijf je twee l’s omdat je ze allebei hoort.',
        ok: false,
        fix: 'Je hoort er één; je schrijft er twee omdat middel en lijk allebei hun l houden',
        why: 'De spelling bewaart de morfeemgrens, ook waar de uitspraak hem wegpoetst.',
      },
    ],
  },
];
