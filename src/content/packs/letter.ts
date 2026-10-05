import type { LessonInput } from '../schema';

/**
 * Nieuwe lessen voor het niveau "De letter". Ze komen na l1, l2 en l4 en lopen op in diepte:
 * basis (het alfabet, de ij, kleine tekens), bachelor (afbreken, de geschiedenis van het alfabet,
 * spellingdiepte) en master (grafematiek, spellinggeschiedenis).
 */
export const LETTER_LESSONS: LessonInput[] = [
  {
    id: 'l5',
    stage: 'basis',
    domain: 'orth',
    title: 'Het alfabet op volgorde',
    skill: 'Spelling',
    icon: 'abc',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Zesentwintig letters op een rij',
        panels: [
          {
            text: 'Het woord *alfabet* is zelf een mini-alfabet: *alfa* en *bèta* zijn de eerste twee letters van het Griekse alfabet. Ons alfabet heeft 26 letters. Een paar daarvan gebruikt het Nederlands bijna alleen in leenwoorden en namen.',
            alpha: {
              q: 'Tik de drie letters die je bijna alleen in leenwoorden ziet',
              targets: ['q', 'x', 'y'],
              note: 'Denk aan quiz, taxi en baby. Ook de c is zeldzaam, behalve in ch: lachen, school.',
            },
          },
          {
            text: 'In een woordenboek staan de woorden op alfabet. Je vergelijkt ze letter voor letter. Zijn de eerste letters gelijk, dan kijk je naar de tweede, dan naar de derde.',
            rule: 'Vergelijk letter voor letter: het eerste verschil beslist.',
            swap: {
              goal: 'Zet de woorden op alfabet',
              blocks: ['kat', 'kip', 'kaas', 'kast'],
              accept: ['kaas kast kat kip'],
              note: 'kaas vóór kast: de derde letter beslist (a vóór s). kast vóór kat: s vóór t.',
            },
          },
          {
            text: 'Letters hebben ook namen. Hoor je het patroon? Bij sommige letters komt de klinker ervóór: *ef*, *el*, *em*. Bij andere erna: *bee*, *dee*, *tee*. Dat verschil is al tweeduizend jaar oud: de Romeinen deden het ook zo.',
            lab: {
              label: 'Tik een letter',
              chips: [
                { k: 'f', out: 'ef', note: 'Een f kun je aanhouden: ffff. De klinker komt ervoor.' },
                { k: 'm', out: 'em', note: 'Mmmm kun je ook aanhouden: klinker ervoor.' },
                { k: 'b', out: 'bee', note: 'Een b is een kort plofje. Die kun je niet aanhouden: klinker erna.' },
                { k: 't', out: 'tee', note: 'Ook een plofje: klinker erna.' },
              ],
            },
            deep: {
              q: 'Waarom zit de klinker soms ervoor?',
              a: 'Een plofklank als *b* of *t* hoor je nauwelijks zonder klinker erachter. Een klank als *f* of *s* kun je wel aanhouden, dus daar kan de klinker ervoor. Letternamen zijn een stukje fonetiek. Uitzonderingen als *ha*, *gee* en *vee* komen uit een tijd waarin die letters anders klonken.',
            },
          },
        ],
      },
      {
        kind: 'order',
        id: 'sch-woorden',
        prompt: 'Zet de woorden op alfabet.',
        tiles: ['schip', 'school', 'schaap', 'scherp'],
        answer: 'schaap scherp schip school',
        why: 'Alle vier beginnen met sch. De vierde letter beslist: a, e, i, o.',
      },
      {
        kind: 'sort',
        id: 'letternamen',
        prompt: 'Komt de klinker van de letternaam ervoor of erna?',
        buckets: ['ervoor, zoals ef', 'erna, zoals bee'],
        items: [
          { t: 's', b: 0 },
          { t: 'p', b: 1 },
          { t: 'l', b: 0 },
          { t: 'd', b: 1 },
          { t: 'r', b: 0 },
          { t: 'b', b: 1 },
        ],
        why: 'es, el, er: die klanken kun je aanhouden. pee, dee, bee: plofklanken, dus de klinker erna.',
      },
      {
        kind: 'type',
        id: 'naam-s',
        prompt: 'Typ de naam van de letter.',
        before: 'De letter s heet',
        after: '.',
        hint: 'twee letters',
        answer: 'es',
        why: 'Een s kun je aanhouden: ssss. Dus komt de klinker ervoor: es.',
      },
    ],
  },
  {
    id: 'l6',
    stage: 'basis',
    domain: 'orth',
    title: 'De lange ij',
    skill: 'Spelling',
    icon: 'IJ',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Twee letters die samen groot worden',
        panels: [
          {
            text: 'IJsland, IJmuiden, het IJ in Amsterdam: de *ij* is de enige letter die als hoofdletter met twee tekens tegelijk komt. Begint een naam of een zin met *ij*, dan worden de *i* en de *j* allebei groot.',
            rule: 'Hoofdletter op ij? Schrijf *IJ*: *IJsland*, nooit *Ijsland*.',
            mark: {
              q: 'Tik de woorden die een hoofdletter IJ krijgen',
              sentence: 'het ijs bij ijmuiden en het ijzer uit ijsland',
              targets: [3, 8],
              note: 'IJmuiden en IJsland zijn namen. ijs en ijzer blijven klein.',
            },
          },
          {
            text: 'Waarom zit er een *j* in? In de middeleeuwen schreef men een lange *i*-klank als *ii*. Schrijvers gaven de tweede *i* een staart, zodat je hem beter zag: *ij*. Daarom heet hij de *lange ij*. De *ei* heet de *korte ei*: hij heeft geen staart. Met de klank heeft dat niets te maken; die is hetzelfde.',
            quiz: {
              q: 'Waarom heet de ij ‘lang’?',
              options: ['Omdat de j een lange staart heeft', 'Omdat je hem langer uitspreekt dan ei', 'Omdat hij uit twee letters bestaat'],
              answer: 'Omdat de j een lange staart heeft',
              why: 'Lang en kort gaan over de vorm. ij en ei klinken precies hetzelfde.',
            },
            deep: {
              q: 'En de y?',
              a: 'In oude teksten staat soms een *y* waar wij nu *ij* schrijven. Sommige namen houden dat vast: *Van Dyck* naast *Van Dijk*. Verder is de *y* vooral een letter voor leenwoorden: *baby*, *hobby*, *yoga*. Je noemt hem *i-grec* of *Griekse ij*.',
            },
          },
          {
            text: 'In het woordenboek telt de *ij* als twee letters: eerst *i*, dan *j*. Daarom staat *ijs* tussen *iglo* en *ik*. In oude telefoonboeken stond de *ij* vaak bij de *y*, en in een kruiswoordpuzzel krijgt hij vaak één hokje. Eén letter of twee? Dat hangt af van wie je het vraagt.',
            quiz: {
              q: 'Welk woord komt als eerste in het woordenboek?',
              options: ['ijs', 'ik', 'iglo'],
              answer: 'iglo',
              why: 'i-g, dan i-j, dan i-k. De ij telt hier als i + j.',
            },
          },
        ],
      },
      {
        kind: 'rewrite',
        id: 'hoofdletters',
        prompt: 'Zet de hoofdletters goed.',
        source: 'we fietsen langs het ijsselmeer naar ijmuiden.',
        accept: ['We fietsen langs het IJsselmeer naar IJmuiden.'],
        why: 'Zinsbegin: We. Namen met ij krijgen IJ: IJsselmeer, IJmuiden.',
      },
      {
        kind: 'choice',
        id: 'landen',
        prompt: 'Welk land staat als eerste op alfabet?',
        before: '',
        after: '',
        options: ['IJsland', 'Italië', 'Ierland'],
        answer: 'Ierland',
        why: 'Ie, IJ, It: de e komt vóór de j, en de j vóór de t.',
      },
      {
        kind: 'swipe',
        id: 'waar-of-niet',
        prompt: 'Klopt het?',
        intro: 'Veeg naar rechts als de zin klopt, naar links als hij niet klopt.',
        cards: [
          { t: 'IJmuiden schrijf je met een hoofdletter I én een hoofdletter J.', ok: true, why: 'Bij ij worden beide letters groot.' },
          {
            t: 'De lange ij heet zo omdat je hem langer uitspreekt dan de ei.',
            ok: false,
            fix: 'lang gaat over de staart van de j',
            why: 'ij en ei klinken precies hetzelfde.',
          },
          { t: 'In het woordenboek staat ijs vóór ik.', ok: true, why: 'De ij telt als i + j, en de j komt vóór de k.' },
          { t: 'Aan het begin van een zin schrijf je Ijzer.', ok: false, fix: 'IJzer', why: 'Ook aan het begin van een zin worden beide letters groot.' },
          { t: 'In baby klinkt de y als ie.', ok: true, why: 'In leenwoorden klinkt de y vaak als ie.' },
        ],
      },
    ],
  },
  {
    id: 'l7',
    stage: 'basis',
    domain: 'orth',
    also: ['fon'],
    title: 'Accent, apostrof, koppelteken',
    skill: 'Spelling',
    icon: 'é',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Kleine tekens, groot verschil',
        panels: [
          {
            text: 'Eén streepje verandert de zin. *Ik heb een fiets* zegt weinig. *Ik heb één fiets* betekent: niet twee. Accenten gebruik je in het Nederlands vooral voor nadruk.',
            lab: {
              label: 'Tik een versie',
              chips: [
                { k: 'een', out: 'Ik heb een fiets.', note: 'Lidwoord: zomaar een fiets.' },
                { k: 'één', out: 'Ik heb één fiets.', note: 'Het getal: niet twee.' },
                { k: 'dé', out: 'Dit is dé fiets van het jaar.', note: 'Nadruk: de beste, de echte.' },
              ],
            },
            deep: {
              q: 'En het streepje de andere kant op?',
              a: 'Dat is het accent grave. Je ziet het in *hè* en in Franse leenwoorden als *crème*. Soms maakt het een ander woord: een *appel* eet je, bij een *appèl* moet iedereen aanwezig zijn.',
            },
            quiz: {
              q: 'In welke zin moet een accent op een?',
              options: ['Er kan maar een winnaar zijn.', 'Ik zie een vogel.', 'Ze kocht een jas.'],
              answer: 'Er kan maar een winnaar zijn.',
              why: 'Het gaat om het getal: maar één winnaar. In de andere zinnen is een gewoon het lidwoord.',
            },
          },
          {
            text: 'De apostrof houdt een klinker lang. Schrijf je *autos*, dan lees je *au-tos*, met een korte *o*. Met een apostrof blijft de *o* lang: *auto’s*.',
            rule: 'Eindigt een woord op *a, i, o, u* of *y*? Meervoud met een apostrof: *pizza’s*, *ski’s*, *menu’s*, *baby’s*.',
            build: { before: 'Twee', stem: 'pizza', endings: ['s', '’s', 'en'], answer: '’s', note: 'pizza’s. Zonder apostrof lees je pizzas met een korte a.' },
            deep: {
              q: 'En bij namen?',
              a: 'Meestal plak je gewoon een *s* achter een naam: *Peters fiets*, niet *Peter’s fiets*. Een apostrof komt er alleen bij een lange klinker aan het eind (*Anna’s fiets*) of na een s-klank (*Hans’ fiets*).',
            },
          },
          {
            text: 'Botsen twee klinkers, zodat je het woord verkeerd zou lezen? Binnen één woord krijgt de tweede klinker een trema: *ideeën*, *geërfd*. Plak je twee woorden aan elkaar, dan komt er een koppelteken tussen: *zee-egel*, *auto-ongeluk*.',
            rule: 'Twee woorden aan elkaar: koppelteken. Anders: trema.',
            lab: {
              label: 'Tik een combinatie',
              chips: [
                { k: 'zee + egel', out: 'zee-egel', note: 'egel is een woord: koppelteken.' },
                { k: 'zee + en', out: 'zeeën', note: '-en is geen woord, maar een uitgang: trema.' },
                { k: 'auto + ongeluk', out: 'auto-ongeluk', note: 'Twee woorden: koppelteken.' },
              ],
            },
          },
        ],
      },
      {
        kind: 'chat',
        id: 'appje',
        prompt: 'App je vriendin terug',
        intro: 'De twee antwoorden verschillen één teken. Kies het antwoord zonder fout.',
        contact: { name: 'Noor', initials: 'N' },
        rounds: [
          {
            say: 'Zin in eten? Ik heb trek.',
            options: ['Ja! Zullen we pizza’s halen?', 'Ja! Zullen we pizzas halen?'],
            right: 0,
            fix: 'pizzas → pizza’s',
            why: 'Eindigt op een a: meervoud met een apostrof.',
          },
          {
            say: 'Goed plan. Neem jij de fiets van Peter?',
            options: ['Ja, Peter’s fiets staat hier.', 'Ja, Peters fiets staat hier.'],
            right: 1,
            fix: 'Peter’s → Peters',
            why: 'Achter een naam komt gewoon een s, zonder apostrof.',
          },
          {
            say: 'En hoeveel nemen we er?',
            options: ['Eén grote is genoeg.', 'Een grote is genoeg.'],
            right: 0,
            fix: 'Een → Eén',
            why: 'Het gaat om het getal: niet twee, maar één.',
          },
        ],
        bye: 'Top, tot zo!',
      },
      {
        kind: 'sort',
        id: 'trema-koppelteken',
        prompt: 'Trema of koppelteken?',
        buckets: ['trema', 'koppelteken'],
        items: [
          { t: 'idee + en', b: 0 },
          { t: 'zee + egel', b: 1 },
          { t: 'ge + erfd', b: 0 },
          { t: 'auto + ongeluk', b: 1 },
          { t: 'zee + en', b: 0 },
          { t: 'radio + omroep', b: 1 },
        ],
        why: 'Twee echte woorden aan elkaar (zee-egel, auto-ongeluk, radio-omroep): koppelteken. Een uitgang of voorvoegsel (ideeën, geërfd, zeeën): trema.',
      },
      {
        kind: 'bet',
        id: 'appel',
        prompt: 'Welk woord betekent: iedereen moet aanwezig zijn?',
        options: ['appèl', 'appel'],
        answer: 'appèl',
        why: 'Een appel eet je. Bij een appèl wordt iedereen geteld.',
      },
    ],
  },
  {
    id: 'l8',
    stage: 'bachelor',
    domain: 'orth',
    also: ['fon', 'morf'],
    title: 'Afbreken: klank of betekenis?',
    skill: 'Spelling',
    icon: 'ver-',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Waar mag het streepje?',
        panels: [
          {
            text: 'Past een woord niet meer op de regel, dan breek je het af. Meestal volg je de lettergrepen, zoals je het woord langzaam uitspreekt: *bo-men*, *kat-ten*. Een dubbele medeklinker gaat dus uit elkaar.',
            split: { q: 'Breek het woord af', word: 'appels', answer: 'ap-pels', note: 'Twee p’s: één aan elke kant van het streepje.' },
          },
          {
            text: 'Maar niet elke lettergroep mag uit elkaar. De *ch* blijft altijd heel: *la-chen*, nooit *lac-hen*. Gek genoeg gaat de *ng* wél uit elkaar: *zin-gen*, al hoor je maar één klank. De *ij* splits je nooit.',
            lab: {
              label: 'Tik een woord',
              chips: [
                { k: 'lachen', out: 'la-chen', note: 'ch blijft heel.' },
                { k: 'zingen', out: 'zin-gen', note: 'ng gaat uit elkaar.' },
                { k: 'blijven', out: 'blij-ven', note: 'ij blijft heel.' },
              ],
            },
            deep: {
              q: 'Waarom ch wel en ng niet?',
              a: 'Afspraak, geen natuurwet. In de spelling geldt *ch* als één teken: je verdubbelt hem ook nooit (*lachen*, niet *lachchen*). De *ng* zie je als *n* + *g*. Afbreekregels gaan dus over letters, niet over klanken.',
            },
          },
          {
            text: 'Bij voorvoegsels en samenstellingen wint de betekenis. Je zegt *ve-ran-de-ren*, maar je breekt af als *ver-an-de-ren*: het voorvoegsel *ver-* blijft heel.',
            rule: 'Afbreken volgt de lettergrepen, maar woorddelen blijven heel: *ver-an-de-ren*.',
            split: { q: 'Breek af en houd het voorvoegsel heel', word: 'veranderen', answer: 'ver-an-de-ren', note: 'ver- blijft heel, ook al zeg je ve-ran-de-ren.' },
            deep: {
              q: 'Klinkt verassen anders dan verrassen?',
              a: 'Nee. Toch breek je ze anders af: *ver-as-sen* (cremeren, met *as*) en *ver-ras-sen*. De spelling laat zien hoe een woord gebouwd is, ook als je het niet hoort.',
            },
          },
        ],
      },
      {
        kind: 'choice',
        id: 'trema-weg',
        prompt: 'Je breekt ‘ideeën’ af op de plek van het trema. Hoe schrijf je het?',
        before: '',
        after: '',
        options: ['idee-ën', 'idee-en', 'ide-eën'],
        answer: 'idee-en',
        why: 'Breek je af op de plek van het trema, dan valt het trema weg. Het streepje doet nu zijn werk.',
      },
      {
        kind: 'sort',
        id: 'goed-fout',
        prompt: 'Goed of fout afgebroken?',
        buckets: ['goed', 'fout'],
        items: [
          { t: 'la-chen', b: 0 },
          { t: 'lac-hen', b: 1 },
          { t: 'zin-gen', b: 0 },
          { t: 'bli-jven', b: 1 },
          { t: 'ver-an-de-ren', b: 0 },
          { t: 'ka-tten', b: 1 },
        ],
        why: 'ch en ij blijven heel, ng mag uit elkaar, een dubbele medeklinker gaat uit elkaar (kat-ten), en ver- blijft heel.',
      },
      {
        kind: 'choice',
        id: 'verassen',
        prompt: 'Hoe breek je ‘verassen’ (cremeren) af?',
        before: '',
        after: '',
        options: ['ver-as-sen', 'ver-ras-sen', 've-ras-sen'],
        answer: 'ver-as-sen',
        why: 'ver + as + sen. Verrassen breek je af als ver-ras-sen. Je hoort het verschil niet; je ziet het wel.',
      },
    ],
  },
  {
    id: 'l9',
    stage: 'bachelor',
    domain: 'orth',
    title: 'Van ossenkop tot A',
    skill: 'Spelling',
    icon: 'Aα',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Waar onze letters vandaan komen',
        panels: [
          {
            text: 'Draai een *A* op zijn kop: zie je de kop van een os met twee hoorns? De Feniciërs, ruim drieduizend jaar geleden aan de kust van het huidige Libanon, noemden die letter *aleph*: os. Hun *beth* betekende huis. Daar komt onze *B* vandaan.',
            lab: {
              label: 'Tik een letter',
              chips: [
                { k: 'A', out: 'aleph · os', note: 'Op zijn kop zie je de hoorns.' },
                { k: 'B', out: 'beth · huis', note: 'Ooit een tekening van een huis.' },
                { k: 'M', out: 'mem · water', note: 'Golfjes: daarom die zigzag.' },
                { k: 'O', out: 'ayin · oog', note: 'Een rond oog.' },
              ],
            },
          },
          {
            text: 'Het Fenicische schrift had alleen medeklinkers. De lezer vulde de klinkers zelf in. De Grieken namen het over, maar hun taal had klinkers nodig. Ze gebruikten letters voor klanken die het Grieks niet had als klinkers. Zo werd de *aleph*, een medeklinker, de klinker *alfa*.',
            rule: 'Fenicisch → Grieks → Etruskisch → Latijn → ons alfabet.',
            quiz: {
              q: 'Wat voegden de Grieken toe aan het Fenicische schrift?',
              options: ['klinkers', 'hoofdletters', 'leestekens'],
              answer: 'klinkers',
              why: 'Het Fenicisch schreef alleen medeklinkers. De Grieken maakten van een paar letters klinkers.',
            },
            deep: {
              q: 'Hoe kwam het bij de Romeinen?',
              a: 'Via de Etrusken in Italië. Het Etruskisch had geen verschil tussen *k* en *g*, dus het Latijn kreeg een *C* met twee taken. Later maakten de Romeinen er een nieuwe letter bij: de *G*, een *C* met een streepje.',
            },
          },
          {
            text: 'Niet elk schrift is een alfabet. Een *woordschrift* heeft een teken per woord of woorddeel, zoals het Chinees. Een *lettergreepschrift* heeft een teken per lettergreep, zoals Japans kana. Een *medeklinkerschrift* schrijft vooral medeklinkers, zoals het Arabisch en Hebreeuws. Een *alfabet* heeft tekens voor medeklinkers én klinkers.',
            quiz: {
              q: 'In welk soort schrift staan de korte klinkers vaak niet in de tekst?',
              options: ['medeklinkerschrift', 'alfabet', 'lettergreepschrift'],
              answer: 'medeklinkerschrift',
              why: 'In het Arabisch en Hebreeuws staan korte klinkers meestal niet in de tekst. De lezer kent het woord.',
            },
            deep: {
              q: 'Een schrift dat de mond tekent',
              a: 'Het Koreaanse *hangul* uit de vijftiende eeuw is een alfabet, maar de letters staan per lettergreep in blokjes. De vorm van sommige medeklinkers tekent zelfs de stand van tong en lippen. Taalkundigen noemen het daarom een kenmerkenschrift.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'schriften',
        prompt: 'Wat voor schrift is het?',
        buckets: ['woordschrift', 'lettergreepschrift', 'medeklinkerschrift', 'alfabet'],
        items: [
          { t: 'Chinees', b: 0 },
          { t: 'Japans kana', b: 1 },
          { t: 'Arabisch', b: 2 },
          { t: 'Hebreeuws', b: 2 },
          { t: 'Grieks', b: 3 },
          { t: 'Russisch', b: 3 },
          { t: 'Fenicisch', b: 2 },
        ],
        why: 'Chinees: tekens voor woorden. Kana: lettergrepen. Arabisch, Hebreeuws en Fenicisch: vooral medeklinkers. Grieks en Russisch: alfabetten met klinkers.',
      },
      {
        kind: 'order',
        id: 'stamboom',
        prompt: 'Zet de schriften in de volgorde waarin ze werden doorgegeven.',
        tiles: ['Latijn', 'Fenicisch', 'Etruskisch', 'Grieks'],
        answer: 'Fenicisch Grieks Etruskisch Latijn',
        why: 'Fenicisch → Grieks → Etruskisch → Latijn. Ons alfabet is het Latijnse.',
      },
      {
        kind: 'choice',
        id: 'g',
        prompt: 'Welke letter maakten de Romeinen door een streepje aan de C te zetten?',
        before: '',
        after: '',
        options: ['G', 'Q', 'K'],
        answer: 'G',
        why: 'De C stond eerst voor k én g. Met een streepje erbij werd het de G.',
      },
    ],
  },
  {
    id: 'l10',
    stage: 'bachelor',
    domain: 'orth',
    also: ['fon'],
    title: 'Hoe diep is een spelling?',
    skill: 'Spelling',
    icon: 'e?',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Lezen is makkelijker dan spellen',
        panels: [
          {
            text: 'Fins is de droom van elke leerling: één letter, één klank, altijd. Engels is het andere uiterste: *though*, *through*, *tough*. Taalkundigen noemen dat de *diepte* van een spelling. Een ondiepe spelling volgt de klank. Een diepe spelling laat ook geschiedenis en woordbouw zien.',
            swap: {
              goal: 'Zet de talen van ondiep naar diep',
              blocks: ['Engels', 'Fins', 'Nederlands'],
              accept: ['Fins Nederlands Engels'],
              note: 'Fins volgt de klank bijna perfect. Nederlands zit in het midden. Engels is diep.',
            },
          },
          {
            text: 'Het Nederlands zit in het midden. Lezen gaat vrij regelmatig: van letter naar klank. Spellen is lastiger: van klank naar letter heb je vaak twee keuzes. Hoor je de klank van *wijn* en *klein*, dan moet je kiezen tussen *ij* en *ei*. En één letter kan meer klanken hebben.',
            lab: {
              label: 'Tik een woord en kijk wat de e doet',
              chips: [
                { k: 'bed', out: 'e = kort', note: 'Een gesloten lettergreep: korte e.' },
                { k: 'beter', out: 'e = lang', note: 'be- is een open lettergreep: lange e.' },
                { k: 'de', out: 'e = dof', note: 'Een zwakke klank zonder klemtoon: de sjwa.' },
              ],
            },
            quiz: {
              q: 'Wat is voor een Nederlandse schrijver het lastigst?',
              options: ['van klank naar letter: spellen', 'van letter naar klank: lezen'],
              answer: 'van klank naar letter: spellen',
              why: 'Lezen is vrij regelmatig. Bij spellen moet je vaak kiezen: ei of ij, d of t.',
            },
          },
          {
            text: 'Diepte heeft gevolgen. In een groot onderzoek in dertien Europese spellingen lazen de meeste kinderen na één schooljaar bijna alle simpele woorden goed, ook de Nederlandse kinderen. Engelse kinderen lazen er maar ongeveer een derde goed.',
            deep: {
              q: 'Welk onderzoek?',
              a: 'Seymour, Aro en Erskine (2003) vergeleken het eerste leesjaar in dertien Europese spellingen. Het idee erachter heet de *orthografische-diepte-hypothese* (Katz en Frost, 1992): hoe dieper de spelling, hoe langer leren lezen duurt. Voor het Nederlands is spellen het echte werk. Daarom gaat deze app zo vaak over spelling.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'e-klanken',
        prompt: 'Hoe klinkt de e?',
        buckets: ['kort, zoals in bed', 'lang, zoals in beter', 'dof, zoals in de'],
        items: [
          { t: 'pen', b: 0 },
          { t: 'zebra', b: 1 },
          { t: 'je', b: 2 },
          { t: 'nek', b: 0 },
          { t: 'veto', b: 1 },
          { t: 'te', b: 2 },
        ],
        why: 'In een gesloten lettergreep klinkt de e kort: pen, nek. In een open lettergreep lang: ze-bra, ve-to. In kleine woordjes zonder klemtoon dof: je, te.',
      },
      {
        kind: 'bet',
        id: 'diepste',
        prompt: 'Welke taal heeft de diepste spelling?',
        options: ['Engels', 'Fins', 'Italiaans'],
        answer: 'Engels',
        why: 'In het Engels kan één lettergroep veel klanken hebben: though, through, tough.',
      },
      {
        kind: 'choice',
        id: 'twee-keuzes',
        prompt: 'Bij welk woord schrijf je niet wat je hoort?',
        before: '',
        after: '',
        options: ['hond', 'boek', 'kip'],
        answer: 'hond',
        why: 'Je hoort een t aan het eind, maar je schrijft een d. Bij boek en kip schrijf je wat je hoort.',
      },
    ],
  },
  {
    id: 'l11',
    stage: 'master',
    domain: 'orth',
    title: 'Grafeem en allograaf',
    skill: 'Spelling',
    icon: 'aɑ',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Eén letter, veel gezichten',
        panels: [
          {
            text: 'Welkom bij de master. Een *a* in dit lettertype, een ronde *ɑ* in je handschrift, een *A* op een bord: drie vormen, één letter. De *grafematiek*, de taalkunde van het schrift, noemt die vormen *allografen* van één *grafeem*. Net zoals een klank verschillende uitspraken heeft, heeft een grafeem verschillende vormen.',
            lab: {
              label: 'Tik een vorm',
              chips: [
                { k: 'a', out: 'a', note: 'De gedrukte a met een boogje erboven.' },
                { k: 'ɑ', out: 'ɑ', note: 'De ronde a uit veel handschriften. Zelfde grafeem.' },
                { k: 'A', out: 'A', note: 'De hoofdletter: weer een andere vorm.' },
              ],
            },
            deep: {
              q: 'Wanneer is een vorm een eigen grafeem?',
              a: 'Als de vorm een verschil in betekenis kan maken. In het Nederlands maakt *a* tegenover *ɑ* geen verschil: het blijft hetzelfde woord. In het IPA, het alfabet van de fonetiek, wel: [a] en [ɑ] zijn twee verschillende klanken. Wat een allograaf is, hangt dus af van het systeem.',
            },
          },
          {
            text: 'Hoe vind je grafemen? Met een *minimaal paar*: twee woorden die maar in één teken verschillen. *bak*, *dak* en *pak* verschillen alleen in de eerste letter, dus *b*, *d* en *p* zijn verschillende grafemen. Toch zijn het bijna spiegelbeelden. Daarom haalt elk kind ze in het begin door elkaar.',
            mark: {
              q: 'Tik alle woorden die precies één letter verschillen van bak',
              sentence: 'dak bal pak bek baken bakken',
              targets: [0, 1, 2, 3],
              note: 'dak, bal, pak en bek: vier minimale paren met bak. baken en bakken zijn langer.',
            },
            deep: {
              q: 'Waarom spiegelen kinderen letters?',
              a: 'Ons brein herkent een voorwerp van links en van rechts als hetzelfde: een leeuw blijft een leeuw. Bij letters moet je dat afleren, want *b* en *d* zijn echt verschillend. De neurowetenschapper Stanislas Dehaene noemt lezen daarom *recycling*: oude hersengebieden krijgen een nieuwe taak.',
            },
          },
          {
            text: 'Is *ch* één grafeem of twee? Daarover verschillen taalkundigen. De ene school zegt: een grafeem is een letter of lettergroep voor één klank, dus *ch*, *ng* en *oe* zijn grafemen. De andere school kijkt alleen naar het schrift zelf. Dan is een grafeem de kleinste eenheid die betekenis onderscheidt, en dat is de losse letter.',
            split: { q: 'Knip het woord in grafemen, zoals de eerste school', word: 'schoen', answer: 's-ch-oe-n', note: 's, ch, oe en n: vier grafemen voor vier klanken.' },
            quiz: {
              q: 'Hoeveel grafemen heeft ‘boeken’ volgens de eerste school?',
              options: ['4', '5', '6'],
              answer: '5',
              why: 'b, oe, k, e, n: vijf grafemen, en ook vijf klanken.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'allograaf',
        prompt: 'Zelfde grafeem of ander grafeem?',
        buckets: ['zelfde grafeem, andere vorm', 'ander grafeem'],
        items: [
          { t: 'a en A', b: 0 },
          { t: 'b en d', b: 1 },
          { t: 'a en ɑ in een Nederlands boek', b: 0 },
          { t: 'a en ɑ in het IPA', b: 1 },
          { t: 'n en u', b: 1 },
          { t: 'r in drukletters en in schrijfletters', b: 0 },
        ],
        why: 'Vormen van één grafeem veranderen de betekenis nooit. b en d wel: bak, dak. In het IPA zijn a en ɑ twee verschillende klanken.',
      },
      {
        kind: 'choice',
        id: 'bewijs',
        prompt: 'Welk paar bewijst dat k en l verschillende grafemen zijn?',
        before: '',
        after: '',
        options: ['bak en bal', 'bak en bakken', 'bak en BAK'],
        answer: 'bak en bal',
        why: 'Een minimaal paar: één letter verschil, andere betekenis.',
      },
      {
        kind: 'swipe',
        id: 'scholen',
        prompt: 'Klopt het?',
        intro: 'Veeg naar rechts als de zin klopt, naar links als hij niet klopt.',
        cards: [
          { t: 'Volgens de eerste school is ng in zingen één grafeem.', ok: true, why: 'ng staat voor één klank.' },
          {
            t: 'Een allograaf kan de betekenis van een woord veranderen.',
            ok: false,
            fix: 'een allograaf verandert de betekenis nooit',
            why: 'Anders was het een eigen grafeem.',
          },
          { t: 'b, d, p en q zijn bijna spiegelbeelden van elkaar.', ok: true, why: 'Daarom halen beginnende lezers ze door elkaar.' },
          { t: 'In het IPA is het verschil tussen a en ɑ een verschil in klank.', ok: true, why: 'Het IPA moet elke klank een eigen teken geven.' },
        ],
      },
    ],
  },
  {
    id: 'l12',
    stage: 'master',
    domain: 'orth',
    title: 'Spelling met een geschiedenis',
    skill: 'Spelling',
    icon: 'sch',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'De spelling van je overgrootouders',
        panels: [
          {
            text: 'Je overgrootouders schreven *de boomen*, *zoo* en *de mensch*. Spelling is een afspraak, en afspraken veranderen. Rond 1947 verdween in Nederland en België de *sch* aan het eind van *mensch* en *visch*, en de dubbele klinker in *boomen* en *loopen*.',
            lab: {
              label: 'Tik een woord van vroeger',
              chips: [
                { k: 'boomen', out: 'bomen', note: 'Open lettergreep: één o is genoeg.' },
                { k: 'mensch', out: 'mens', note: 'De ch hoorde je al lang niet meer.' },
                { k: 'zoo', out: 'zo', note: 'Aan het eind van een woord is één o al lang.' },
              ],
            },
          },
          {
            text: 'Maar één groep hield zijn *sch*: bijvoeglijke naamwoorden op *-isch*. Daarom schrijf je nog steeds *logisch*, *praktisch* en *Belgisch*, al zeg je gewoon een *s*. Een fossiel uit de oude spelling, midden in je tekst.',
            rule: 'Bijvoeglijk naamwoord dat eindigt op de klank -ies? Schrijf *-isch*: *logisch*.',
            mark: {
              q: 'Tik de woorden met een ch die je niet hoort',
              sentence: 'logisch schip mens praktisch school',
              targets: [0, 3],
              note: 'In logisch en praktisch hoor je geen ch. In schip en school wel.',
            },
          },
          {
            text: 'Wie beslist over spelling? Sinds 1980 de Nederlandse Taalunie, voor Nederland en Vlaanderen, en later ook Suriname. De officiële woordenlijst heet het *Groene Boekje*. In 1995 en 2005 veranderden nog regels, bijvoorbeeld voor de tussen-n: *pannekoek* werd *pannenkoek*.',
            quiz: {
              q: 'Waarom schrijf je ‘logisch’ met sch?',
              options: ['Het is een fossiel uit de oude spelling', 'Je hoort de ch duidelijk', 'Het komt uit het Engels'],
              answer: 'Het is een fossiel uit de oude spelling',
              why: 'Bij -isch bleef de oude spelling staan, ook al hoor je alleen een s.',
            },
            deep: {
              q: 'Bestaat de perfecte spelling?',
              a: 'Nee. Spelling is een afspraak tussen klank, woordbouw en traditie, en elke hervorming kiest anders. In 1947 won de uitspraak (*mens*, *bomen*). Bij *logisch* won de traditie. Het Genootschap Onze Taal heeft zelfs een eigen *Witte Boekje*, met soms andere keuzes.',
            },
          },
        ],
      },
      {
        kind: 'rewrite',
        id: 'modern',
        prompt: 'Zet deze zin uit 1930 in de spelling van nu.',
        source: 'Zoo loopen de menschen onder de boomen.',
        accept: ['Zo lopen de mensen onder de bomen.'],
        why: 'zoo → zo, loopen → lopen, menschen → mensen, boomen → bomen.',
      },
      {
        kind: 'sort',
        id: 'oud-nieuw',
        prompt: 'Spelling van nu of van vroeger?',
        buckets: ['van nu', 'van vroeger'],
        items: [
          { t: 'logisch', b: 0 },
          { t: 'visch', b: 1 },
          { t: 'pannenkoek', b: 0 },
          { t: 'zoo', b: 1 },
          { t: 'praktisch', b: 0 },
          { t: 'loopen', b: 1 },
        ],
        why: 'logisch en praktisch houden hun sch. visch, zoo en loopen zijn spelling van vóór 1947. pannenkoek kreeg zijn n in 1995.',
      },
      {
        kind: 'bet',
        id: 'taalunie',
        prompt: 'Sinds wanneer beslist de Nederlandse Taalunie over de spelling?',
        options: ['1980', '1804', '1947'],
        answer: '1980',
        why: 'Nederland en België richtten de Taalunie in 1980 op. In 1804 kwam de eerste officiële spelling (Siegenbeek), in 1947 de spelling zonder sch en dubbele klinkers.',
      },
    ],
  },
];
