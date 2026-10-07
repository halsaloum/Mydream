import type { StepInput } from '../../schema';

/** Onderzoek bij d15: een derde uitlegronde op onderzoeksniveau, daarna zwaardere oefeningen. */
export const ONDERZOEK_D15: StepInput[] = [
  {
    kind: 'explain',
    id: 'onderzoek',
    title: 'Wat de getallen niet zien',
    panels: [
      {
        text: 'Een dood achtervoegsel laat woorden achter, en die woorden gaan hun eigen weg. *-te* maakt geen nieuwe woorden meer, maar *vlakte*, *groente* en *ziekte* leven volop. Alleen betekenen ze niet meer ‘het vlak zijn’ of ‘het groen zijn’: een *vlakte* is een stuk land, *groente* is iets wat je eet, een *ziekte* kun je tellen. Dat heet *lexicalisatie*: het woord maakt zich los van zijn bouw. Het levende *-heid* houdt de eigenschap vast: *vlakheid* is nog gewoon het vlak zijn. P telt hapaxen; deze verschuiving ziet het niet.',
        rule: 'Woorden van een dood affix blijven bestaan, maar schuiven in betekenis: *vlakte* is land, *vlakheid* een eigenschap.',
        paradigm: {
          q: 'Kies het woord dat bij de omschrijving past',
          cols: ['woord'],
          rows: [
            { label: 'een vlak stuk land', cells: [{ fill: 'vlakte' }] },
            { label: 'de eigenschap vlak te zijn', cells: [{ fill: 'vlakheid', hint: 'Het levende -heid noemt de eigenschap.' }] },
            { label: 'een eetbare plant', cells: [{ fill: 'groente', hint: 'Oud -te, maar de betekenis is een ding geworden.' }] },
            { label: 'een lange periode zonder regen', cells: [{ fill: 'droogte' }] },
            { label: 'een aandoening, je kunt er drie van hebben', cells: [{ fill: 'ziekte' }] },
          ],
          extra: ['vlakkigheid', 'groenheid', 'ziekheid'],
          note: 'De -te-woorden zijn dingen, periodes of telbare gevallen geworden. De -heid-woorden blijven eigenschappen. Zo zie je aan de betekenis welk affix nog leeft.',
        },
        deep: {
          q: 'Waarom schuift de betekenis juist bij een dood affix?',
          a: 'Omdat niemand het woord nog opbouwt. Wie *vlakheid* leest, haalt het uit *vlak* en *-heid*, en de betekenis volgt uit de delen. Wie *vlakte* leest, haalt het als geheel uit zijn geheugen, en dan kan de betekenis vrij bewegen, net als bij een stam zonder delen. Hay (zie de tweede uitleg) ziet hetzelfde mechanisme: hoe minder je een woord uit elkaar haalt, hoe vrijer zijn betekenis.',
        },
      },
      {
        text: 'Productief waar? Ingo Plag, Christiane Dalton-Puffer en Harald Baayen (1999) maten Engelse achtervoegsels apart in gesproken en geschreven taal uit het British National Corpus. Hetzelfde achtervoegsel bleek in de ene tekstsoort veel productiever dan in de andere. Een P-waarde is dus geen eigenschap van de taal, maar van een taal in een bepaald soort tekst. Wie *-iteit* in chatberichten telt en *-heid* in wetenschappelijke artikelen, vergelijkt appels met peren, zelfs bij dezelfde N.',
        rule: 'Productiviteit hangt af van de tekstsoort: meet twee affixen in hetzelfde soort corpus.',
        quiz: {
          q: 'Een student meet P van -heid in chatberichten en P van -iteit in juridische teksten, bij dezelfde N. Wat is het probleem?',
          options: [
            'De tekstsoorten verschillen: productiviteit is per register anders',
            'Niets, want N is gelijk',
            'Juridische teksten bevatten geen hapaxen',
          ],
          answer: 'De tekstsoorten verschillen: productiviteit is per register anders',
          why: 'Dezelfde N lost het probleem van de corpusgrootte op, niet het registerprobleem. Plag en collega’s vonden grote verschillen tussen spreektaal en schrijftaal.',
        },
        deep: {
          q: 'Waarom zou een affix per tekstsoort verschillen?',
          a: 'Omdat de behoefte aan nieuwe woorden verschilt. Een wetenschappelijk artikel noemt eigenschappen die nog geen naam hebben, en grijpt naar *-iteit* en *-heid*. In een gesprek maak je eerder een nieuw werkwoord of een samenstelling. Een corpus is daarom nooit ‘het Nederlands’; het is een steekproef uit een soort taalgebruik, en de P-waarde erft die beperking.',
        },
      },
      {
        text: 'Hapaxen tellen is één manier. Joan Bybee (1995) kijkt naar een ander getal: de *typefrequentie*, het aantal verschillende woorden dat een patroon volgt. Een patroon met veel leden trekt nieuwe leden aan. De *tokenfrequentie*, hoe vaak een woord zelf voorkomt, doet het tegenovergestelde: een heel frequent woord wordt een eiland dat je als geheel opslaat. Zo blijft *was* bestaan naast de regel met *-de*. Probeer het met verzonnen werkwoorden.',
        rule: 'Typefrequentie maakt een patroon productief; tokenfrequentie houdt een onregelmatige vorm in leven.',
        lab: {
          label: 'Tik een werkwoord',
          chips: [
            {
              k: 'strijpen (verzonnen)',
              out: 'streep? strijpte?',
              note: 'Het patroon ij/ee heeft tientallen leden: kijken, rijden, blijven, schrijven. Streep klinkt dan niet gek. De zwakke vorm kan altijd.',
            },
            { k: 'ploezen (verzonnen)', out: 'ploesde', note: 'Geen sterk patroon met veel leden op oe. De zwakke regel wint zonder moeite.' },
            {
              k: 'bluiken (verzonnen)',
              out: 'blook? bluikte?',
              note: 'ui/oo heeft wel leden (buigen, sluiten, kruipen), maar minder dan ij/ee. De aantrekkingskracht is zwakker.',
            },
            {
              k: 'vragen (echt)',
              out: 'vroeg, ooit vraagde',
              note: 'Een zwak werkwoord dat sterk werd, naar het voorbeeld van dragen, droeg. Een patroon met genoeg leden kan ook bestaande woorden overhalen.',
            },
          ],
        },
        deep: {
          q: 'Hoe verhoudt dit zich tot de P van Baayen?',
          a: 'Ze meten iets anders. P kijkt naar het aandeel nieuwe woorden in het gebruik; typefrequentie naar de omvang van het patroon in het lexicon, ongeveer de V uit de tweede uitleg. Bybee voorspelt dat een groot V tot nieuwe woorden leidt. Baayen laat zien dat dat niet altijd zo is: *-te* heeft veel leden en toch geen aanwas. Pas typefrequentie plus een open betekenis maakt een patroon levend.',
        },
      },
      {
        text: 'Een hapax is niet automatisch een nieuw woord. In een echt corpus zitten tussen de eenmalige woorden ook tikfouten, namen, vreemde woorden en oude woorden die toevallig maar één keer voorkomen. Harald Baayen en Rochelle Lieber (1991) berekenden P voor Engelse achtervoegsels in een groot corpus; zulke lijsten moeten eerst worden opgeschoond. Wie dat overslaat, telt *bereikbaarhied* als bewijs voor de productiviteit van *-heid*. Doe de schoonmaak zelf.',
        rule: 'Schoon de hapaxen op: alleen een echte nieuwe afleiding telt als bewijs van productiviteit.',
        mark: {
          q: 'Tik de hapaxen die echt een nieuwe afleiding met -heid zijn',
          sentence: 'appbaarheid bereikbaarhied swipebaarheid waarheid kuisheid',
          targets: [0, 2],
          note: 'appbaarheid en swipebaarheid zijn nieuw en volgen de regel. bereikbaarhied is een tikfout. waarheid en kuisheid zijn oude woorden die in dit stukje corpus toevallig één keer voorkomen.',
        },
        deep: {
          q: 'En een woord dat ooit één keer voorkwam en daarna een hit werd?',
          a: 'Dat is de omgekeerde valkuil. *Ontzorgen* was ooit nieuw en zeldzaam; in een krantencorpus van vandaag komt het vaak voor en telt het niet meer mee als bewijs. P meet de kans op iets nieuws nu, niet de geschiedenis van een affix. Wie wil weten wanneer een patroon leefde, heeft corpora uit verschillende jaren nodig.',
        },
      },
    ],
  },
  {
    kind: 'chat',
    id: 'corpus',
    prompt: 'App met je studiegenoot',
    intro: 'Hij telt achtervoegsels voor een werkstuk. Kies telkens het antwoord dat de maat goed gebruikt.',
    contact: { name: 'Milan', role: 'je studiegenoot', initials: 'M' },
    rounds: [
      {
        say: 'Ik heb P van -heid in 500 chatberichten en P van -baar in tien jaar kranten. -heid wint dik!',
        options: ['Mooi, dan is -heid productiever.', 'Dat kun je zo niet vergelijken: andere N én ander register.'],
        right: 1,
        fix: 'vergelijken bij dezelfde N en hetzelfde soort tekst',
        why: 'P daalt met N, en verschilt per tekstsoort. Neem van beide corpora hetzelfde soort tekst en even veel woorden.',
      },
      {
        say: 'En elke hapax tel ik als nieuw woord, toch?',
        options: ['Ja, een hapax is per definitie nieuw.', 'Nee, eerst tikfouten, namen en oude zeldzame woorden eruit.'],
        right: 1,
        fix: 'hapaxen eerst opschonen',
        why: 'bereikbaarhied en waarheid kunnen allebei één keer voorkomen; alleen de echte nieuwvormingen tellen.',
      },
      {
        say: 'Vlakte en groente staan er ook in. Bewijs dat -te nog leeft?',
        options: ['Nee: oude woorden met een verschoven betekenis.', 'Ja, want ze komen vaak voor.'],
        right: 0,
        fix: 'oude woorden tellen niet als aanwas',
        why: 'Vaak voorkomen zegt niets over aanwas. Vlakte en groente zijn gelexicaliseerd: ze bewijzen dat -te ooit leefde.',
      },
      {
        say: 'Laatste: ij/ee-werkwoorden zijn er veel. Dus dat patroon is productief?',
        options: ['Veel leden helpt: hoge typefrequentie trekt aan, maar kijk of er ook nieuwe bij komen.', 'Nee, sterke werkwoorden zijn nooit productief.'],
        right: 0,
        fix: 'typefrequentie is een aanwijzing, aanwas het bewijs',
        why: 'Bybee: een groot patroon trekt aan. Baayen: tel of het echt gebeurt.',
      },
    ],
    bye: 'Top, ik ga opnieuw tellen. Bedankt!',
  },
  {
    kind: 'sort',
    id: 'hapax-soort',
    prompt: 'Wat is deze hapax uit een corpus?',
    buckets: ['nieuwe afleiding', 'tikfout', 'oud woord, toevallig zeldzaam'],
    items: [
      { t: 'swipebaarheid', b: 0 },
      { t: 'ontzorgbaar', b: 0 },
      { t: 'googelbaarheid', b: 0 },
      { t: 'leesbaarhied', b: 1 },
      { t: 'warmtte', b: 1 },
      { t: 'bereikbaarheidd', b: 1 },
      { t: 'kuisheid', b: 2 },
      { t: 'schaarste', b: 2 },
      { t: 'vlakte', b: 2 },
    ],
    why: 'swipebaarheid, ontzorgbaar en googelbaarheid volgen een levende regel en zijn nieuw. leesbaarhied, warmtte en bereikbaarheidd zijn tikfouten. kuisheid, schaarste en vlakte staan al eeuwen in het woordenboek; dat ze hier één keer voorkomen, is toeval.',
  },
  {
    kind: 'choice',
    id: 'hoogte',
    prompt: 'Kies het woord dat past.',
    before: 'De',
    after: 'van de kast is precies twee meter.',
    options: ['hoogte', 'hoogheid'],
    answer: 'hoogte',
    why: 'Het oude -te-woord is een meetbare afmeting geworden. Hoogheid is een titel: Zijne Hoogheid. Lexicalisatie in twee richtingen.',
  },
  {
    kind: 'bet',
    id: 'schoon-p',
    prompt: 'In 1000 voorkomens van -heid vind je 25 hapaxen. Vijf blijken tikfouten, twee zijn oude woorden. Wat is P na opschoning?',
    options: ['0,018', '0,025', '0,007'],
    answer: '0,018',
    why: '25 min 5 min 2 = 18 echte nieuwvormingen. 18 / 1000 = 0,018. Zonder opschonen had je 0,025 gemeld.',
  },
  {
    kind: 'swipe',
    id: 'getallen-waar',
    prompt: 'Klopt deze zin?',
    cards: [
      {
        t: 'Vlakte betekent nog gewoon ‘het vlak zijn’.',
        ok: false,
        fix: 'een vlakte is een stuk land',
        why: 'Lexicalisatie: het woord van een dood affix schuift in betekenis.',
      },
      {
        t: 'P kan voor hetzelfde achtervoegsel verschillen tussen spreektaal en schrijftaal.',
        ok: true,
        why: 'Plag, Dalton-Puffer en Baayen (1999) vonden precies dat.',
      },
      {
        t: 'Volgens Bybee maakt een hoge tokenfrequentie een patroon productief.',
        ok: false,
        fix: 'typefrequentie maakt productief; tokenfrequentie beschermt juist een onregelmatige vorm',
        why: 'Veel leden trekken aan; één heel frequent woord wordt een eiland.',
      },
      { t: 'De verleden tijd van vragen was ooit zwak: vraagde.', ok: true, why: 'Het sterke patroon van dragen, droeg trok vragen naar zich toe.' },
      {
        t: 'Elke hapax in een corpus is een nieuw woord.',
        ok: false,
        fix: 'tikfouten, namen en zeldzame oude woorden zijn ook hapaxen',
        why: 'Daarom schoon je de lijst eerst op.',
      },
      {
        t: 'Een woord dat ooit een hapax was, kan nu honderden keren voorkomen en telt dan niet meer als bewijs.',
        ok: true,
        why: 'P meet de kans op iets nieuws nu, niet de geschiedenis.',
      },
      {
        t: 'Typefrequentie en P meten hetzelfde.',
        ok: false,
        fix: 'typefrequentie meet de omvang van het patroon, P de kans op iets nieuws',
        why: '-te heeft veel leden en toch geen aanwas: twee verschillende maten.',
      },
    ],
  },
];
