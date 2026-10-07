import type { StepInput } from '../../schema';

/** Onderzoek bij d13: een derde uitlegronde op onderzoeksniveau, daarna zwaardere oefeningen. */
export const ONDERZOEK_D13: StepInput[] = [
  {
    kind: 'explain',
    id: 'onderzoek',
    title: 'Het ideale paradigma en zijn afwijkingen',
    panels: [
      {
        text: 'Greville Corbett (2007) draaide de vraag om. Beschrijf eerst het *canonieke* paradigma: elke cel heeft precies één vorm, elke cel een andere vorm, en alle vormen delen één stam. Echte talen wijken daarvan af, en die afwijkingen kun je benoemen en vergelijken. Het ideaal is dus geen bewering over een taal, maar een meetlat. Tik een afwijking en zie hem in het Nederlands.',
        lab: {
          label: 'Tik een afwijking',
          chips: [
            { k: 'syncretisme', out: 'jij loopt = hij loopt', note: 'Twee cellen, één vorm. Canoniek heeft elke cel een eigen vorm.' },
            { k: 'suppletie', out: 'ben, is, was', note: 'Geen gedeelde stam meer. Corbett behandelt suppletie als het uiterste van niet-canonieke buiging.' },
            { k: 'lege cel', out: 'zullen: geen voltooid deelwoord', note: 'Ik heb het gezuld bestaat niet. Zo’n gat heet defectief.' },
            { k: 'overvloed', out: 'joeg én jaagde', note: 'Twee vormen voor één cel. Anna Thornton (2011) noemde dat overabundance.' },
          ],
        },
        rule: 'Canoniek: één vorm per cel, een andere vorm voor elke cel, en één gedeelde stam.',
      },
      {
        text: 'Overvloed is in het Nederlands geen rariteit. *Jagen* heeft *jaagde* en *joeg*, *waaien* heeft *waaide* en *woei*. Volgens Onze Taal is *jaagde* de oudste vorm; *joeg* kwam pas in de zestiende eeuw op. Een zwak werkwoord kreeg er dus een sterke vorm bij, tegen de algemene trend in. En de overvloed zit in één cel: het voltooid deelwoord heeft maar één vorm.',
        paradigm: {
          q: 'Vul de vormen in',
          cols: ['verleden tijd zwak', 'verleden tijd sterk', 'voltooid deelwoord'],
          rows: [
            { label: 'jagen', cells: [{ fill: 'jaagde', hint: 'Zwak: stam jaag + de, want g staat niet in ’t kofschip.' }, 'joeg', { fill: 'gejaagd' }] },
            { label: 'waaien', cells: ['waaide', { fill: 'woei' }, { fill: 'gewaaid', hint: 'Hier is geen keuze: alleen de zwakke vorm.' }] },
          ],
          extra: ['gejogen', 'gewoeien', 'jaagte'],
          note: 'Twee vormen in de verleden tijd, één in het deelwoord. Overvloed is een eigenschap van een cel, niet van het hele werkwoord.',
        },
      },
      {
        text: 'Mark Aronoff (1994) zag iets vreemds in het Latijn. Eén stam, de *derde stam*, vormt het voltooid deelwoord, het supinum en het toekomend deelwoord: *amat-us*, *amat-um*, *amat-urus*. Die drie delen geen betekenis, alleen een vorm. Zo’n puur morfologische verdeling noemde hij een *morfoom*. Het Nederlands heeft er ook een: het voltooid deelwoord dient voor de voltooide tijd (*heeft geschreven*) én voor de lijdende vorm (*wordt geschreven*). In *het boek wordt nu geschreven* is niets voltooid.',
        quiz: {
          q: 'Waarom is het voltooid deelwoord een morfoom?',
          options: ['Eén vorm dient voor functies zonder gedeelde betekenis', 'Het drukt altijd de verleden tijd uit', 'Het heeft altijd ge- en -en'],
          answer: 'Eén vorm dient voor functies zonder gedeelde betekenis',
          why: 'Voltooid (heeft geschreven) en lijdend (wordt geschreven) hebben alleen de vorm gemeen. Zo’n verdeling bestaat alleen in de morfologie.',
        },
        deep: {
          q: 'Bestaan morfomen echt in het hoofd van sprekers?',
          a: 'Martin Maiden (2018) volgde zulke patronen door de geschiedenis van de Romaanse talen. Ze blijven eeuwenlang bestaan, ook als de klanken veranderen, en nieuwe onregelmatige vormen volgen het oude patroon. Dat pleit ervoor dat sprekers de verdeling zelf leren, en niet alleen losse vormen.',
        },
      },
      {
        text: 'Een lege cel kan ook gevuld worden door een andere vorm. In de voltooide tijd met een tweede werkwoord gebruikt het Nederlands een infinitief in plaats van het deelwoord: *ik heb het willen zeggen*, niet *gewild*. De ANS noemt dat de *vervangende infinitief* (infinitivus pro participio). Daardoor valt het gat van *zullen* bijna nooit op: *het had zullen gebeuren*. Alleen zonder tweede werkwoord zie je het gat.',
        mark: {
          q: 'Tik de vervangende infinitief',
          sentence: 'Ik had het je willen vertellen, maar ik heb het niet gekund.',
          targets: [4],
          note: 'willen staat waar je een deelwoord verwacht (gewild). Zonder tweede werkwoord krijg je gewoon het deelwoord: gekund.',
        },
        rule: 'Vervangende infinitief: hulpwerkwoord + infinitief + infinitief, in plaats van een voltooid deelwoord.',
      },
    ],
  },
  {
    kind: 'sort',
    id: 'afwijking',
    prompt: 'Welke afwijking van het canonieke paradigma?',
    buckets: ['syncretisme', 'suppletie', 'lege cel', 'overvloed'],
    items: [
      { t: 'ik liep, hij liep', b: 0 },
      { t: 'wij, jullie, zij lopen', b: 0 },
      { t: 'zijn: ben, is', b: 1 },
      { t: 'veel, meer', b: 1 },
      { t: 'zullen: geen voltooid deelwoord', b: 2 },
      { t: 'Engels must: geen infinitief', b: 2 },
      { t: 'Engels must: geen verleden tijd', b: 2 },
      { t: 'jagen: jaagde en joeg', b: 3 },
      { t: 'Engels dreamed en dreamt', b: 3 },
    ],
    why: 'Eén vorm in meer cellen is syncretisme. Een andere stam is suppletie. Een cel zonder vorm is defectief. Twee vormen voor één cel is overvloed.',
  },
  {
    kind: 'fix',
    id: 'gewaaid',
    prompt: 'Tik het foute woord aan en verbeter het.',
    sentence: 'Het heeft vannacht flink gewoeien.',
    wrong: 4,
    answer: 'gewaaid',
    why: 'In de verleden tijd mag woei naast waaide, maar het deelwoord heeft maar één vorm: gewaaid. Overvloed geldt per cel.',
  },
  {
    kind: 'bet',
    id: 'zullen-gat',
    prompt: 'Welke zin is goed Nederlands?',
    options: ['Het had niet zullen gebeuren.', 'Het had niet gezuld gebeuren.', 'Het had niet gezullen gebeuren.'],
    answer: 'Het had niet zullen gebeuren.',
    why: 'Met een tweede werkwoord springt de vervangende infinitief in. Zo merk je niet dat zullen geen voltooid deelwoord heeft.',
  },
  {
    kind: 'rewrite',
    id: 'willen',
    prompt: 'Zet de zin in de voltooide tijd, met heb.',
    source: 'Ik wilde het zeggen.',
    accept: ['Ik heb het willen zeggen.'],
    why: 'Met een tweede werkwoord erbij wordt gewild een infinitief: ik heb het willen zeggen.',
  },
  {
    kind: 'swipe',
    id: 'canoniek',
    prompt: 'Klopt deze zin?',
    cards: [
      { t: 'In een canoniek paradigma heeft elke cel precies één vorm.', ok: true, why: 'Dat is een van de criteria van Corbett.' },
      { t: 'Joeg en jaagde zijn een voorbeeld van syncretisme.', ok: false, fix: 'Het is overvloed: twee vormen voor één cel', why: 'Syncretisme is andersom: één vorm voor twee cellen.' },
      { t: 'Volgens Onze Taal is jaagde ouder dan joeg.', ok: true, why: 'joeg kwam pas in de zestiende eeuw op.' },
      { t: 'Het Latijnse supinum en het voltooid deelwoord delen dezelfde stam.', ok: true, why: 'De derde stam: amatum en amatus.' },
      { t: 'Een morfoom is een stukje met een vaste betekenis.', ok: false, fix: 'Een morfoom is een verdeling van vormen zonder gedeelde betekenis', why: 'Zoals het voltooid deelwoord voor voltooid én lijdend.' },
      { t: 'In ik heb het willen zeggen staat willen op de plek van een deelwoord.', ok: true, why: 'Dat is de vervangende infinitief.' },
      { t: 'Suppletie is volgens Corbett het uiterste van niet-canonieke buiging.', ok: true, why: 'Er is geen gedeelde stam meer: ben, is, was.' },
    ],
  },
];
