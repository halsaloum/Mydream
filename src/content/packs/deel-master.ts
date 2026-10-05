import type { LessonInput } from '../schema';

/**
 * Masterlessen voor het niveau "Het betekenisvolle woorddeel": drie modellen van morfologie,
 * inheemse en geleerde lagen met het haakjesparadox, productiviteit meten, prosodische
 * morfologie met een OT-tableau, het mentale lexicon (met de d/t-fout als bewijs) en
 * woordvorming in beweging. Ze bouwen voort op `deel.ts`.
 *
 * Eisnamen in OT-tableaus volgen de literatuur (Engels). Het sterretje van een verbod is het
 * teken ∗ (U+2217), omdat * in lesteksten een taalvoorbeeld markeert.
 */
export const DEEL_MASTER_LESSONS: LessonInput[] = [
  {
    id: 'd13',
    stage: 'master',
    domain: 'morf',
    also: ['syn'],
    title: 'Morfeem, proces of paradigma?',
    skill: 'Woorden',
    icon: 'IA',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Drie modellen van morfologie',
        panels: [
          {
            text: 'Welkom in de master, waar het morfeem verhoord wordt. Charles Hockett (1954) beschreef twee modellen en noemde een derde, veel ouder model. *Item-and-Arrangement*: een woord is een rijtje morfemen, *boek + en*. *Item-and-Process*: een woord ontstaat door een bewerking op een stam, zoals *loop* → *liep* (de klinker verandert). *Word-and-Paradigm*: het woord als geheel vult een cel in een tabel.',
            lab: {
              label: 'Tik een vorm',
              chips: [
                { k: 'boeken', out: 'Item-and-Arrangement', note: 'Netjes te knippen: boek + en.' },
                { k: 'liep', out: 'Item-and-Process', note: 'Niets te knippen: de klinker verandert. Waar is het morfeem ‘verleden tijd’?' },
                { k: 'loopt', out: 'Word-and-Paradigm', note: 'Eén -t voor jij én hij: de vorm hoort bij cellen, niet bij één betekenis.' },
              ],
            },
          },
          {
            text: 'Kijk naar het paradigma van *lopen*. Twee cellen delen dezelfde vorm: *jij loopt* en *hij loopt*. Dat heet *syncretisme*. En *ik loop* heeft geen uitgang: moet je daar een *nulmorfeem* aannemen? In een paradigma-model hoeft dat niet. De vorm *loop* vult gewoon die cel.',
            grid: {
              q: 'Tik de cellen met dezelfde werkwoordsvorm als ‘hij loopt’',
              cols: ['enkelvoud', 'meervoud'],
              rows: ['1e persoon', '2e persoon', '3e persoon'],
              cells: [
                { t: 'ik loop', row: 0, col: 0 },
                { t: 'jij loopt', row: 1, col: 0 },
                { t: 'hij loopt', row: 2, col: 0 },
                { t: 'wij lopen', row: 0, col: 1 },
                { t: 'jullie lopen', row: 1, col: 1 },
                { t: 'zij lopen', row: 2, col: 1 },
              ],
              targets: ['jij loopt', 'hij loopt'],
              note: 'Zes cellen, maar drie vormen. Het meervoud heeft er zelfs maar één voor drie personen.',
            },
            rule: 'Syncretisme: verschillende cellen van een paradigma met dezelfde vorm.',
          },
          {
            text: 'Nu het bewijsstuk. In een vraag verdwijnt de -t bij *jij*: *Loop jij?* Maar niet bij *hij*: *Loopt hij?* Als *-t* een morfeem was voor ‘tweede persoon’, zou het niet zomaar mogen verdwijnen. De vorm hangt af van de *cel*: tweede persoon, enkelvoud, mét het onderwerp erachter.',
            quiz: {
              q: 'Welke zin is goed?',
              options: ['Loop jij morgen mee?', 'Loopt jij morgen mee?'],
              answer: 'Loop jij morgen mee?',
              why: 'Staat jij achter de persoonsvorm, dan valt de -t weg. Bij hij blijft hij staan: Loopt hij mee?',
            },
            deep: {
              q: 'Wie verdedigt het paradigma vandaag?',
              a: 'Gregory Stump (*Inflectional Morphology*, 2001) en James Blevins (*Word and Paradigm Morphology*, 2016). Hun argument: talen zitten vol vormen die je niet netjes in morfemen kunt knippen. In het Latijnse *amō* (ik heb lief) betekent de *-ō* tegelijk eerste persoon, enkelvoud, tegenwoordige tijd, bedrijvende vorm. Dat heet *cumulatieve exponentie*: één stukje, vier betekenissen.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'model',
        prompt: 'Welk model beschrijft dit het makkelijkst?',
        buckets: ['Item-and-Arrangement', 'Item-and-Process', 'Word-and-Paradigm'],
        items: [
          { t: 'boek + en', b: 0 },
          { t: 'lees + baar', b: 0 },
          { t: 'loop → liep', b: 1 },
          { t: 'schip → schepen', b: 1 },
          { t: 'loopt (jij én hij)', b: 2 },
          { t: 'Loop jij?', b: 2 },
        ],
        why: 'Knipbaar: IA. Klinkerwissel: IP. Syncretisme en een vorm die van de zin afhangt: WP.',
      },
      {
        kind: 'fix',
        id: 'jij',
        prompt: 'Tik het foute woord aan en verbeter het.',
        sentence: 'Wordt jij ook moe van al die regels?',
        wrong: 0,
        answer: 'word',
        why: 'jij staat achter de persoonsvorm: dan geen -t. Word jij ook moe?',
      },
      {
        kind: 'bet',
        id: 'nul',
        prompt: 'Heeft ‘ik loop’ een nulmorfeem?',
        options: ['Alleen in een morfeemmodel; in een paradigmamodel is dat niet nodig', 'Ja, altijd', 'Nee, ik loop heeft een uitgang -∅ die je kunt horen'],
        answer: 'Alleen in een morfeemmodel; in een paradigmamodel is dat niet nodig',
        why: 'Een nulmorfeem is een hulpmiddel van het IA-model. Het paradigmamodel zegt gewoon: deze cel heeft de vorm loop.',
      },
    ],
  },
  {
    id: 'd14',
    stage: 'master',
    domain: 'morf',
    also: ['fon', 'sem'],
    title: 'Inheems, geleerd en een paradox',
    skill: 'Woorden',
    icon: 'Ⅰ|Ⅱ',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Lagen in het woord',
        panels: [
          {
            text: 'Het Nederlands heeft twee soorten achtervoegsels. *Inheemse*, uit het Germaans: *-heid*, *-baar*, *-ig*. Ze laten de klemtoon met rust: *WAAR* → *WAARheid*. En *geleerde*, uit het Latijn en Frans: *-iteit*, *-isch*, *-atie*. Die trekken de klemtoon naar zich toe: *neuTRAAL* → *neutraliTEIT*. Bouw *productiviteit* op.',
            bracket: {
              tree: '[[product ief] iteit]',
              nodes: [
                { w: 'productief', cat: 'bn', note: 'Geleerd achtervoegsel -ief op een geleerde stam.' },
                { w: 'productiefiteit', form: 'productiviteit', cat: 'zn', note: '-iteit vraagt een geleerde stam en neemt de klemtoon: productiviTEIT. De f wordt v.' },
              ],
              traps: [{ w: 'iefiteit', note: 'Twee achtervoegsels zonder stam vormen geen woord. Begin bij product.' }],
              note: 'product → productief → productiviteit: de klemtoon schuift steeds mee naar rechts.',
            },
          },
          {
            text: 'De lagen hebben een volgorde. Een inheems achtervoegsel mag om een geleerd heen: *absurd-heid*. Andersom niet: *waarheiditeit* is onmogelijk. Ook bij voorvoegsels: geleerd *in-* past alleen op geleerde stammen en past zich aan: *inactief*, *illegaal*, *irreëel*. Inheems *on-* past overal: *onmogelijk*, *onlogisch*.',
            rule: 'Geleerde affixen zitten binnenin en verschuiven de klemtoon; inheemse affixen zitten erbuiten en laten de klemtoon met rust.',
            deep: {
              q: 'Waar komt dat idee vandaan?',
              a: 'Uit de *lexicale fonologie* van Paul Kiparsky (1982): het lexicon heeft niveaus, en klemtoonregels werken alleen op niveau 1, waar de geleerde affixen zitten. Jennifer Hay (2002) gaf een psychologische verklaring: affixen die je makkelijk loshaalt (*-heid*) staan buiten affixen die vergroeid zijn met hun stam (*-iteit*). Dat heet *complexity-based ordering*.',
            },
            quiz: {
              q: 'Welk woord is onmogelijk?',
              options: ['waarheiditeit', 'absurdheid', 'onlogisch'],
              answer: 'waarheiditeit',
              why: 'Een geleerd achtervoegsel (-iteit) kan niet om een inheems achtervoegsel (-heid) heen.',
            },
          },
          {
            text: 'Nu het raadsel. *Blauwogig* betekent ‘met blauwe ogen’. De betekenis zegt: [[blauw oog] ig]. Maar *blauwoog* bestaat niet als woord. En *ogig* ook niet. Dit heet een *haakjesparadox*: de betekenis wil de ene boom, de vorm kan geen van beide maken. Bouw de betekenisboom.',
            bracket: {
              q: 'Bouw de betekenis: met blauwe ogen',
              tree: '[[blauw oog] ig]',
              nodes: [
                { w: 'blauwoog', form: 'blauw oog', cat: 'groep', note: 'Eerst de woordgroep blauw oog: daar gaat het over.' },
                { w: 'blauwoogig', form: 'blauwogig', cat: 'bn', note: '-ig plakt aan de hele groep: met een blauw oog.' },
              ],
              traps: [{ w: 'oogig', note: 'ogig bestaat niet los. Toch plakt -ig in de klank aan oog: dat is precies de paradox.' }],
              note: '[[blauw oog] ig]: de betekenis plakt -ig aan een woordgroep. Ook in langharig en beeldend kunstenaar (iemand van de beeldende kunst).',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'klemtoon',
        prompt: 'Verschuift het achtervoegsel de klemtoon?',
        buckets: ['ja (geleerd)', 'nee (inheems)'],
        items: [
          { t: 'neutraal → neutraliteit', b: 0 },
          { t: 'idee → ideaal', b: 0 },
          { t: 'vriend → vriendelijk', b: 1 },
          { t: 'waar → waarheid', b: 1 },
          { t: 'lees → leesbaar', b: 1 },
          { t: 'stabiel → stabiliteit', b: 0 },
        ],
        why: '-iteit en -aal nemen de klemtoon: neutraliTEIT, ideAAL, stabiliTEIT. -heid, -baar en -elijk laten hem staan.',
      },
      {
        kind: 'choice',
        id: 'in',
        prompt: 'Welk voorvoegsel past?',
        before: 'Een besluit dat niet rationeel is, is',
        after: '.',
        options: ['irrationeel', 'onrationeel', 'inrationeel'],
        answer: 'irrationeel',
        why: 'rationeel is geleerd, dus in-, en dat wordt ir- voor een r.',
      },
      {
        kind: 'bet',
        id: 'paradox',
        prompt: 'Waarom is ‘beeldend kunstenaar’ een haakjesparadox?',
        options: ['Het is iemand van de beeldende kunst, niet een kunstenaar die beeldend is', 'Het heeft twee klemtonen', 'Kunstenaar is geen woord'],
        answer: 'Het is iemand van de beeldende kunst, niet een kunstenaar die beeldend is',
        why: 'De betekenis is [[beeldende kunst] enaar], maar de vorm zet beeldend los voor kunstenaar.',
      },
    ],
  },
  {
    id: 'd15',
    stage: 'master',
    domain: 'morf',
    title: 'Productiviteit meten',
    skill: 'Woorden',
    icon: 'P',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Hoe levend is een achtervoegsel?',
        panels: [
          {
            text: 'Eerst een experiment uit 1958. Jean Berko liet kinderen een verzonnen diertje zien: *Dit is een wug.* Dan twee: *Nu zijn er twee…* Kinderen zeiden zonder aarzelen *wugs*. Ze hadden *wugs* nooit gehoord, dus ze pasten een regel toe. Dat is de kern van productiviteit: nieuwe woorden maken.',
            quiz: {
              q: 'Wat zeg jij? Dit is een wug. Nu zijn er twee…',
              options: ['wuggen', 'wugs', 'wugen'],
              answer: 'wuggen',
              why: 'Eén beklemtoonde lettergreep met een korte klinker: -en, met een dubbele g. Net als bus, bussen.',
            },
          },
          {
            text: 'Harald Baayen bedacht hoe je productiviteit meet in een corpus. Tel alle woorden met het achtervoegsel (N). Tel dan de *hapaxen*: woorden die maar één keer voorkomen (n1). Zeldzame woorden zijn vaak net nieuw gemaakt. De productiviteit is *P = n1 / N*.',
            lab: {
              label: 'Tik een achtervoegsel (een bedacht minicorpus)',
              chips: [
                { k: '-heid', out: 'n1 = 40, N = 1000, P = 0,04', note: 'Veel eenmalige woorden: er worden nog steeds nieuwe gemaakt.' },
                { k: '-te', out: 'n1 = 1, N = 1000, P = 0,001', note: 'Vaak gebruikt (warmte, lengte), maar bijna nooit nieuw.' },
                { k: '-baar', out: 'n1 = 30, N = 600, P = 0,05', note: 'Minder vaak, maar zeer productief.' },
              ],
            },
            rule: 'Productiviteit P = aantal hapaxen / aantal voorkomens van het achtervoegsel.',
            deep: {
              q: 'Waarom juist hapaxen?',
              a: 'Een nieuw gevormd woord is per definitie zeldzaam. Het aandeel woorden dat maar één keer voorkomt, voorspelt hoe groot de kans is dat het volgende woord met dit achtervoegsel nieuw is. Baayen noemt dit de *potentiële productiviteit*. Laurie Bauer (2001) onderscheidt daarnaast *beschikbaarheid* (kan het nog?) en *rendabiliteit* (hoeveel gebeurt het?).',
            },
          },
          {
            text: 'Twee achtervoegsels kunnen even vaak voorkomen en toch heel anders leven. Dat zie je aan de verhouding. Reken zelf: een achtervoegsel komt 400 keer voor, en 20 van die woorden zijn hapaxen.',
            quiz: {
              q: 'Wat is P?',
              options: ['0,05', '0,5', '20'],
              answer: '0,05',
              why: '20 / 400 = 0,05.',
            },
          },
        ],
      },
      {
        kind: 'swipe',
        id: 'productief',
        prompt: 'Klopt deze zin?',
        cards: [
          { t: 'Een achtervoegsel dat vaak voorkomt, is altijd productief.', ok: false, fix: 'Vaak voorkomen is iets anders dan productief zijn', why: '-te zit in veel gewone woorden, maar maakt geen nieuwe meer.' },
          { t: 'Hapaxen zijn woorden die één keer in een corpus voorkomen.', ok: true, why: 'Grieks hapax legomenon: één keer gezegd.' },
          { t: 'De wug-test laat zien dat kinderen regels toepassen.', ok: true, why: 'Ze maakten een meervoud voor een woord dat ze nooit gehoord hadden.' },
        ],
      },
      {
        kind: 'sort',
        id: 'levend',
        prompt: 'Productief of niet meer?',
        buckets: ['productief', 'niet meer'],
        items: [
          { t: '-heid', b: 0 },
          { t: '-baar', b: 0 },
          { t: '-er (lezer)', b: 0 },
          { t: '-te (warmte)', b: 1 },
          { t: '-sel (baksel)', b: 1 },
          { t: '-nis (kennis)', b: 1 },
        ],
        why: 'Met -heid, -baar en -er maak je dagelijks nieuwe woorden. -te, -sel en -nis zitten vooral in oude woorden.',
      },
      {
        kind: 'bet',
        id: 'swipebaar',
        prompt: 'Is ‘swipebaar’ een mogelijk Nederlands woord?',
        options: ['Ja: je swipet iets, en -baar is productief', 'Nee: Engelse stammen kunnen geen -baar krijgen'],
        answer: 'Ja: je swipet iets, en -baar is productief',
        why: 'Overgankelijk werkwoord + productief achtervoegsel: zo komt een nieuw woord de taal in.',
      },
    ],
  },
  {
    id: 'd16',
    stage: 'master',
    domain: 'morf',
    also: ['fon'],
    title: 'Woordbouw met een maatlat',
    skill: 'Woorden',
    icon: 'σσ',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Prosodische morfologie',
        panels: [
          {
            text: 'Waarom heet je professor *prof* en niet *profes*? Afkortingen volgen een maat. *Prof*, *lab*, *info*, *uni*, *aso*: één zware lettergreep, of een sterke plus een zwakke. Dat is het *minimale woord* uit De lettergreep, nu als mal voor morfologie.',
            lab: {
              label: 'Tik een woord',
              chips: [
                { k: 'professor', out: 'prof', note: 'Eén zware lettergreep: korte klinker plus coda.' },
                { k: 'laboratorium', out: 'lab', note: 'Weer één zware lettergreep.' },
                { k: 'informatie', out: 'info', note: 'Sterk-zwak: een trochee.' },
                { k: 'universiteit', out: 'uni', note: 'Ook een trochee.' },
              ],
            },
          },
          {
            text: 'Roepnamen doen hetzelfde, maar ze bewaren de *beklemtoonde* lettergreep. *E-LI-sa-beth* wordt *Lies*. *Mar-ga-RE-tha* wordt *Griet*. *Wil-hel-MI-na* wordt *Mien*. De morfologie knipt hier geen morfeem af, maar een prosodische eenheid.',
            quiz: {
              q: 'Welke roepnaam past bij Jo-HAN-na?',
              options: ['Hanna', 'Jo', 'Johan'],
              answer: 'Hanna',
              why: 'De beklemtoonde lettergreep blijft, aangevuld tot een trochee: HAN-na.',
            },
            rule: 'Prosodische morfologie: de vorm van een woord wordt bepaald door een maat (lettergreep, voet, minimaal woord), niet door een morfeem.',
          },
          {
            text: 'Ook het meervoud luistert naar een maat. Na een onbeklemtoonde lettergreep kiest het Nederlands *-s*: *tafels*, niet *tafelen*. Met *-en* zouden er twee zwakke lettergrepen achter elkaar staan. Zet de eisen in de goede volgorde.',
            tableau: {
              input: '/taːfəl + MV/',
              constraints: [
                { name: 'MV=-EN', note: 'Gebruik -en, de gewone meervoudsvorm.' },
                { name: '∗LAPSE', note: 'Geen twee onbeklemtoonde lettergrepen achter elkaar.' },
              ],
              candidates: [
                { form: '[TAː.fə.lən]', marks: [0, 1] },
                { form: '[TAː.fəls]', marks: [1, 0] },
              ],
              winner: 1,
              goal: 'Laat tafels winnen',
              note: '∗LAPSE boven MV=-EN: het ritme wint van de standaardvorm. Bij boeken is er geen conflict, dus daar wint -en.',
            },
            deep: {
              q: 'Wie werkte dit uit?',
              a: 'Geert Booij (1998) liet zien dat de Nederlandse meervoudskeuze een *prosodische outputeis* is: het woord eindigt het liefst op een trochee. Marc van Oostendorp en anderen werkten dat uit in Optimaliteitstheorie. Bij *leraren* en *vijanden* wint toch *-en*: zulke uitzonderingen sla je per woord op in je lexicon.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'maat',
        prompt: 'Welke maat heeft de afkorting?',
        buckets: ['één zware lettergreep', 'sterk + zwak'],
        items: [
          { t: 'prof', b: 0 },
          { t: 'lab', b: 0 },
          { t: 'Lies', b: 0 },
          { t: 'info', b: 1 },
          { t: 'uni', b: 1 },
          { t: 'Hanna', b: 1 },
        ],
        why: 'Allebei zijn het minimale woorden: minstens twee moras, en nooit langer dan één voet.',
      },
      {
        kind: 'bet',
        id: 'bezem',
        prompt: 'Welk meervoud voorspelt ∗LAPSE voor ‘bezem’?',
        options: ['bezems', 'bezemen'],
        answer: 'bezems',
        why: 'BE-zem eindigt onbeklemtoond. Met -en kreeg je BE-ze-men: twee zwakke lettergrepen.',
      },
      {
        kind: 'type',
        id: 'lies',
        prompt: 'Typ de roepnaam.',
        before: 'Elisabeth wordt vaak',
        after: 'genoemd.',
        hint: 'één lettergreep',
        answer: 'Lies',
        why: 'e-LI-sa-beth: de beklemtoonde lettergreep LI, aangevuld tot een zware lettergreep: Lies.',
      },
    ],
  },
  {
    id: 'd17',
    stage: 'master',
    domain: 'morf',
    also: ['orth'],
    title: 'Opslaan of opbouwen?',
    skill: 'Spelling',
    icon: 'ψ',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Het mentale lexicon',
        panels: [
          {
            text: 'Haal je *boeken* als één geheel uit je geheugen, of bouw je het elke keer op uit *boek + en*? Steven Pinker zei: onregelmatige vormen (*liep*) sla je op, regelmatige (*werkte*) bouw je met een regel. Maar Nederlands onderzoek van Baayen, Dijkstra en Schreuder (1997) liet zien dat je ook regelmatige meervouden sneller herkent als ze vaak voorkomen. Die zijn dus ook opgeslagen.',
            quiz: {
              q: 'Wat bewijst een frequentie-effect bij regelmatige vormen?',
              options: ['Dat ook regelmatige vormen als geheel opgeslagen worden', 'Dat alles met regels gaat', 'Dat frequentie niet uitmaakt'],
              answer: 'Dat ook regelmatige vormen als geheel opgeslagen worden',
              why: 'Een regel heeft geen geheugen. Als vaak gebruikte vormen sneller gaan, liggen ze klaar.',
            },
          },
          {
            text: 'Ook de *familie* van een woord telt. *Werk* heeft een grote familie: *werker*, *werkplaats*, *bewerken*, *werkloos*. Schreuder en Baayen (1997) vonden dat je woorden met een grote familie sneller herkent, ook als het woord zelf zeldzaam is. En je brein knipt al op vorm voordat het de betekenis kent: in het Engels helpt *corner* je om *corn* te herkennen (Rastle en collega’s, 2004), ook al heeft een hoek niets met maïs te maken.',
            rule: 'Je mentale lexicon slaat veel op én knipt: twee routes die tegelijk racen.',
          },
          {
            text: 'Nu het deel dat elke schrijver raakt: de d/t-fout. *Hij vind* in plaats van *hij vindt*. Dominiek Sandra, Steven Frisson en Frans Daems (1999) lieten zien dat zulke fouten vooral gebeuren als de foute vorm *vaker voorkomt* dan de goede, en als er woorden tussen het onderwerp en het werkwoord staan. Je brein grijpt dan de opgeslagen vorm, in plaats van de regel toe te passen.',
            mark: {
              q: 'Tik het werkwoord waar je brein zich makkelijk vergist',
              sentence: 'Mijn broer die in Gent woont vindt het boek mooi.',
              targets: [6],
              note: 'Tussen broer en vindt staan vier woorden. Hoe langer de afstand, hoe groter de kans op hij vind.',
            },
            deep: {
              q: 'Hoe vermijd je de fout dan?',
              a: 'Vertrouw niet op wat er ‘goed uitziet’, want dat is juist de opgeslagen vorm. Zoek het onderwerp, zet het naast het werkwoord en pas de regel bewust toe: *hij* + *vind* + *t*. Vervang bij twijfel door *lopen*: *hij loopt*, dus *hij vindt*. Zo schakel je de tweede route in.',
            },
          },
        ],
      },
      {
        kind: 'fix',
        id: 'vindt',
        prompt: 'Tik het foute woord aan en verbeter het.',
        sentence: 'De man die naast ons woont vind ons te luidruchtig.',
        wrong: 6,
        answer: 'vindt',
        why: 'Onderwerp: de man (hij). Hij loopt, dus hij vindt. De bijzin ertussen lokt de fout uit.',
      },
      {
        kind: 'swipe',
        id: 'dt',
        prompt: 'Goed of fout?',
        cards: [
          { t: 'Het boek dat ik gisteren las word verfilmd.', ok: false, fix: 'word → wordt', why: 'Onderwerp het boek: het wordt.' },
          { t: 'Word jij ook zo moe van dat geluid?', ok: true, why: 'jij achter de persoonsvorm: geen -t.' },
          { t: 'Mijn zus die in Leiden studeert, vindt dat ook.', ok: true, why: 'Onderwerp mijn zus: zij vindt.' },
          { t: 'Hij antwoord niet op mijn berichten.', ok: false, fix: 'antwoord → antwoordt', why: 'Stam antwoord + t.' },
        ],
      },
      {
        kind: 'bet',
        id: 'route',
        prompt: 'Waarom schrijft een goede speller toch soms ‘hij vind’?',
        options: ['De opgeslagen vorm vind is sneller dan de regel', 'Hij kent de regel niet', 'Vind en vindt klinken anders'],
        answer: 'De opgeslagen vorm vind is sneller dan de regel',
        why: 'Twee routes racen. Onder tijdsdruk wint de snelle geheugenroute, en die levert de vaakst geziene vorm.',
      },
    ],
  },
  {
    id: 'd18',
    stage: 'master',
    domain: 'morf',
    also: ['orth', 'prag'],
    title: 'Woorden in beweging',
    skill: 'Spelling',
    icon: '↻',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Hoe affixen ontstaan en leenwoorden landen',
        panels: [
          {
            text: 'Achtervoegsels vallen niet uit de lucht. Het waren ooit gewone woorden. *-lijk* komt van een oud woord voor lichaam of gedaante (vergelijk *lijk* en Engels *like*): *vriendelijk* is ‘met de gedaante van een vriend’. *-heid* was een woord voor ‘wijze, staat’. Een woord dat een achtervoegsel wordt, heet *grammaticalisatie*.',
            lab: {
              label: 'Tik een achtervoegsel',
              chips: [
                { k: '-lijk', out: 'van lic: lichaam, gedaante', note: 'vriendelijk: met de gedaante van een vriend.' },
                { k: '-heid', out: 'van heid: wijze, staat', note: 'vrijheid: de staat van vrij zijn.' },
                { k: '-dom', out: 'van dom: oordeel, toestand', note: 'rijkdom, christendom. Engels kingdom.' },
              ],
            },
          },
          {
            text: 'Het gebeurt nog steeds. *Reuze-*, *kei-*, *mega-* en *top-* zijn woorden die als voorvoegsel gaan werken: *reuzeleuk*, *keigoed*, *topprestatie*. Geert Booij noemt ze *affixoïden*: half woord, half affix. En soms gaat woordvorming achteruit: van *stofzuiger* maakten mensen het werkwoord *stofzuigen*. Dat heet *terugvorming*.',
            quiz: {
              q: 'Wat kwam eerst?',
              options: ['beeldhouwer', 'beeldhouwen'],
              answer: 'beeldhouwer',
              why: 'Terugvorming: uit beeldhouwer ontstond het werkwoord beeldhouwen.',
            },
          },
          {
            text: 'Leenwoorden moeten door de Nederlandse morfologie, en dan geldt ’t kofschip gewoon. *Downloaden*: de stam is *download*, eindigt op d, dus *gedownload* (geen extra d). *Updaten*: stam *update*, je hoort een t, dus *geüpdatet*. *Liken*: stam *like*, je hoort een k, dus *geliket*.',
            rule: 'Bij een Engels werkwoord kijk je naar de klank van de stam: stemloos (’t kofschip) → -t, anders -d.',
            deep: {
              q: 'Waarom niet gewoon de Engelse vorm?',
              a: 'Omdat de Nederlandse buiging contextueel is: de zin eist een voltooid deelwoord met *ge-* en een *-d* of *-t*. Een leenwoord kan zijn eigen spelling houden (*like*), maar moet de Nederlandse buiging accepteren (*geliket*). Zo zie je het verschil tussen het lexicon (dat leent) en de grammatica (die beslist).',
            },
          },
        ],
      },
      {
        kind: 'choice',
        id: 'update',
        prompt: 'Kies de goede vorm.',
        before: 'Ik heb de app gisteren',
        after: '.',
        options: ['geüpdatet', 'geüpdated', 'geupdate'],
        answer: 'geüpdatet',
        why: 'Stam update, je hoort een t. ge + update + t, met een trema omdat e en u botsen.',
      },
      {
        kind: 'type',
        id: 'download',
        prompt: 'Typ het voltooid deelwoord van downloaden.',
        before: 'Heb je het bestand al',
        after: '?',
        hint: 'ge…',
        answer: 'gedownload',
        why: 'Stam download eindigt op d: ge + download. Geen extra d, net als gebrand of geland.',
      },
      {
        kind: 'sort',
        id: 'proces',
        prompt: 'Welk proces?',
        buckets: ['grammaticalisatie', 'affixoïde', 'terugvorming'],
        items: [
          { t: 'lijk → -lijk', b: 0 },
          { t: 'heid → -heid', b: 0 },
          { t: 'reuzeleuk', b: 1 },
          { t: 'keigoed', b: 1 },
          { t: 'stofzuiger → stofzuigen', b: 2 },
          { t: 'beeldhouwer → beeldhouwen', b: 2 },
        ],
        why: 'Woorden worden affixen, woorden gaan op affixen lijken, en afleidingen worden teruggerekend.',
      },
      {
        kind: 'highlight',
        id: 'eindbaas',
        prompt: 'Eindbaas: kleur de stukken van ‘onvriendelijkheden’',
        intro: 'Alles uit dit niveau in één woord: stam, afleiding, buiging en een allomorf.',
        pens: [
          { id: 'stam', label: 'stam', tag: 'kern', ask: 'Is dit de kern van het woord?', accent: 'blue' },
          { id: 'afl', label: 'afleiding', tag: 'nieuw woord', ask: 'Maakt dit stuk een nieuw woord?', accent: 'purple' },
          { id: 'buig', label: 'buiging', tag: 'vorm', ask: 'Maakt dit stuk alleen een andere vorm?', accent: 'orange' },
        ],
        words: [
          { t: 'on', role: 'afl' },
          { t: 'vriend', role: 'stam' },
          { t: 'elijk', role: 'afl' },
          { t: 'hed', role: 'afl' },
          { t: 'en', role: 'buig' },
        ],
        done: { title: 'Niveau uitgespeeld', text: 'on | vriend | elijk | hed | en: een stam, drie afleidingen (waarvan hed een allomorf van heid is, en -lijk ooit een woord was) en buiging buitenaan.' },
      },
    ],
  },
];
