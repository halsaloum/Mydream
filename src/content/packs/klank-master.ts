import type { LessonInput } from '../schema';
import { CONSONANT_TABLE } from './tables';

/**
 * Masterlessen voor het niveau "Klank en letter": distinctieve kenmerken, lettergreepbouw,
 * ambisyllabiciteit, metrische klemtoon, regelordening, Optimaliteitstheorie, spraakwaarneming
 * en klankverandering. Ze bouwen voort op de basis- en bachelorlessen in `klank.ts`.
 *
 * Eisnamen in OT-tableaus volgen de literatuur (Engels). Het sterretje van een verbod is het
 * teken ∗ (U+2217), omdat * in lesteksten een taalvoorbeeld markeert.
 */
export const KLANK_MASTER_LESSONS: LessonInput[] = [
  {
    id: 'k17',
    stage: 'master',
    domain: 'fon',
    title: 'Klanken zijn bundels kenmerken',
    skill: 'Spelling',
    icon: '±',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Distinctieve kenmerken',
        panels: [
          {
            text: 'Welkom bij de master. Vanaf nu is een klank geen atoom meer, maar een bundel schakelaars. Taalkundigen noemen ze *distinctieve kenmerken*, met een plus of een min: [±stem] (trillen de stembanden?), [±continuant] (stroomt de lucht door de mond?), [±sonorant] (is het een open, zingbare klank?). Daarbij komt een plaats: [labiaal], [coronaal] of [dorsaal].',
            lab: {
              label: 'Tik een klank',
              chips: [
                { k: '/b/', out: '[−son, −cont, +stem, labiaal]', note: 'Een stemhebbende plofklank met de lippen.' },
                { k: '/s/', out: '[−son, +cont, −stem, coronaal]', note: 'Een stemloze wrijfklank met de tongpunt.' },
                { k: '/m/', out: '[+son, −cont, +stem, labiaal]', note: 'Een neusklank: sonorant en stemhebbend, maar de mond is dicht.' },
              ],
            },
          },
          {
            text: 'Een *natuurlijke klasse* is een groep klanken die je met minder kenmerken beschrijft dan elke klank apart. [−son, +cont, −stem] zijn precies de stemloze wrijfklanken. Fonologische regels werken bijna altijd op zulke klassen, bijna nooit op een willekeurig rijtje.',
            grid: {
              ...CONSONANT_TABLE,
              q: 'Tik de klasse [−son, +cont, −stem]',
              targets: ['f', 's', 'x'],
              note: 'f, s en x: de stemloze wrijfklanken. Hun partners v, z en ɣ vallen af door [−stem].',
            },
          },
          {
            text: 'Nu kun je een regel als formule schrijven. Eindklankverscherping: [−son] → [−stem] / __ ]σ. Lees: een obstruent, een klank met [−son], wordt stemloos aan het eind van een lettergreep (σ). Eén regel verklaart *hond*, *web*, *graf* en *huis*.',
            quiz: {
              q: 'Wat doet de regel [−son] → [−stem] / __ ]σ met de /l/ in ‘bal’?',
              options: ['Niets: /l/ is [+son]', '/l/ wordt stemloos', '/l/ valt weg'],
              answer: 'Niets: /l/ is [+son]',
              why: 'De regel geldt alleen voor obstruenten. Sonoranten blijven stemhebbend.',
            },
            deep: {
              q: 'Lettergreep of woord?',
              a: 'Het is de lettergreep, niet het woord. In *hondje* staat de *d* midden in het woord, maar wel aan het eind van de lettergreep *hond*: [hɔntjə]. Deze notatie komt uit *The Sound Pattern of English* van Chomsky en Halle (1968), het boek waarmee de generatieve fonologie begon.',
            },
          },
        ],
      },
      {
        kind: 'highlight',
        id: 'klassen',
        prompt: 'Kleur de klanken van ‘schrijven’',
        intro: 'Kies een stift en tik de klanken aan: obstruent, sonorant of klinker.',
        pens: [
          { id: 'obs', label: 'obstruent', tag: '−son', ask: 'Wordt de lucht echt gehinderd: een plof of geruis?', accent: 'orange' },
          { id: 'son', label: 'sonorant', tag: '+son', ask: 'Een medeklinker die je kunt zingen?', accent: 'teal' },
          { id: 'kl', label: 'klinker', tag: 'kern', ask: 'De kern van een lettergreep?', accent: 'purple' },
        ],
        words: [
          { t: 's', role: 'obs' },
          { t: 'x', role: 'obs' },
          { t: 'r', role: 'son' },
          { t: 'ɛi', role: 'kl' },
          { t: 'v', role: 'obs' },
          { t: 'ə', role: 'kl' },
          { t: 'n', role: 'son' },
        ],
        done: { title: 'Alles gekleurd', text: '[sxrɛivən]: drie obstruenten, twee sonoranten en twee klinkers.' },
      },
      {
        kind: 'choice',
        id: 'kofschip-klasse',
        prompt: 'Wat delen /p t k f s x/?',
        before: '',
        after: '',
        options: ['[−stem]', '[+son]', '[−cont]', '[labiaal]'],
        answer: '[−stem]',
        why: 'Ze zijn allemaal stemloos. Dat is precies de klasse van ’t kofschip.',
      },
      {
        kind: 'sort',
        id: 'natuurlijk',
        prompt: 'Natuurlijke klasse of willekeurig rijtje?',
        buckets: ['natuurlijke klasse', 'willekeurig rijtje'],
        items: [
          { t: '/p t k/', b: 0 },
          { t: '/p z ŋ/', b: 1 },
          { t: '/m n ŋ/', b: 0 },
          { t: '/v z ɣ/', b: 0 },
          { t: '/b s r/', b: 1 },
          { t: '/l r/', b: 0 },
        ],
        why: '/p t k/: stemloze plofklanken. /m n ŋ/: neusklanken. /v z ɣ/: stemhebbende wrijfklanken. /l r/: liquidae. De andere rijtjes delen geen kenmerken die de rest uitsluiten.',
      },
    ],
  },
  {
    id: 'k18',
    stage: 'master',
    domain: 'fon',
    title: 'De berg in elke lettergreep',
    skill: 'Spelling',
    icon: 'σ',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Sonoriteit en fonotaxis',
        panels: [
          {
            text: 'Waarom kan *strand* wel en *rtsand* niet? Je tong beklimt een berg. Een lettergreep heeft een *onset* (begin), een *nucleus* (kern) en een *coda* (eind). Klanken verschillen in *sonoriteit*: hoe open en luid ze zijn.',
            swap: {
              goal: 'Zet van laag naar hoog in sonoriteit',
              blocks: ['klinker', 'plofklank', 'l of r', 'neusklank', 'wrijfklank'],
              accept: ['plofklank wrijfklank neusklank l of r klinker'],
              note: 'p < f < m < l < a: de sonoriteitsschaal. Glijklanken als j staan net onder de klinkers.',
            },
          },
          {
            text: 'Het *sonoriteitsprincipe*: naar de kern toe stijgt de sonoriteit, daarna daalt hij. Elke lettergreep is een bergje. *blik*: b < l < i > k. *melk*: m < e > l > k. Klopt het niet, dan is het geen Nederlands woord: *lbik* gaat eerst omlaag.',
            quiz: {
              q: 'Welk verzonnen woord kan Nederlands zijn?',
              options: ['trelk', 'trekl', 'rtelk'],
              answer: 'trelk',
              why: 'Onset t < r, coda l > k: een nette berg. In trekl stijgt de coda weer; in rtelk daalt de onset.',
            },
          },
          {
            text: 'De /s/ is de rebel. In *straat* en *sprong* daalt de sonoriteit eerst: s > t. Veel fonologen zien die /s/ daarom als *extrasyllabisch*: hij hangt buiten de echte onset. En talen kiezen verschillend: /kn/ in *knie* mag bij ons, maar in het Engels is die *k* stil geworden: *knee* [niː].',
            rule: 'Onset: sonoriteit omhoog. Coda: omlaag. Een /s/ aan de rand mag de regel breken.',
            deep: {
              q: 'Hoe verdeel je april?',
              a: 'Het *Maximale-Onsetprincipe* zegt: geef zoveel mogelijk medeklinkers aan de volgende lettergreep, zolang die onset in de taal mag. /pr/ mag aan het begin (*prijs*), dus *a-pril*. /tl/ mag in het Nederlands niet aan het begin, hoewel de sonoriteit stijgt. Dus *At-las*. Het sonoriteitsprincipe is nodig, maar niet genoeg.',
            },
          },
        ],
      },
      {
        kind: 'swipe',
        id: 'kan-dit',
        prompt: 'Kan dit een Nederlands woord zijn?',
        intro: 'Veeg naar rechts als de zin klopt. Denk aan de berg.',
        cards: [
          { t: 'blom kan een Nederlands woord zijn.', ok: true, why: 'b < l < o: netjes omhoog.' },
          { t: 'lbom kan een Nederlands woord zijn.', ok: false, fix: 'lbom kan het niet zijn', why: 'l > b: de onset daalt naar de kern toe.' },
          { t: 'spleur kan een Nederlands woord zijn.', ok: true, why: 's + p: de toegestane rebel, net als in spleet.' },
          { t: 'rkaap kan een Nederlands woord zijn.', ok: false, fix: 'rkaap kan het niet zijn', why: 'r > k aan het begin: de berg begint met een afdaling.' },
          { t: 'tlok kan een Nederlands woord zijn.', ok: false, fix: 'tlok kan het niet zijn', why: 'De sonoriteit stijgt wel, maar het Nederlands verbiedt tl aan het begin.' },
        ],
      },
      {
        kind: 'order',
        id: 'schaal',
        prompt: 'Zet de klanken van lage naar hoge sonoriteit.',
        tiles: ['a', 'p', 'l', 'm', 'f', 'j'],
        answer: 'p f m l j a',
        why: 'plofklank < wrijfklank < neusklank < l < glijklank < klinker.',
      },
      {
        kind: 'choice',
        id: 'atlas',
        prompt: 'Hoe deel je ‘Atlas’ in lettergrepen?',
        before: '',
        after: '',
        options: ['At-las', 'A-tlas'],
        answer: 'At-las',
        why: '/tl/ mag in het Nederlands geen onset zijn. Dus gaat de t naar de eerste lettergreep.',
      },
      {
        kind: 'choice',
        id: 'april',
        prompt: 'En ‘april’?',
        before: '',
        after: '',
        options: ['a-pril', 'ap-ril'],
        answer: 'a-pril',
        why: '/pr/ mag wel als onset, zoals in prijs. Maximale onset: a-pril.',
      },
    ],
  },
  {
    id: 'k19',
    stage: 'master',
    domain: 'fon',
    also: ['orth'],
    title: 'Waarom bommen twee m’s heeft',
    skill: 'Spelling',
    icon: 'm.m',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Ambisyllabiciteit',
        panels: [
          {
            text: 'De schoolregel ken je: korte klank, dubbele medeklinker. Maar waarom? Fonologen zeggen: een ongespannen klinker moet in een gesloten lettergreep staan. In *bommen* moet de *m* dus bij *bom* horen. Maar de tweede lettergreep wil ook een begin. De oplossing: de *m* hoort bij allebei.',
            split: {
              q: 'Knip zoals de spelling',
              word: 'bommen',
              answer: 'bom-men',
              note: 'De spelling geeft elke lettergreep een eigen m. In de uitspraak is het er één, die bij beide hoort.',
            },
          },
          {
            text: 'Zo’n klank heet *ambisyllabisch*: hij staat in twee lettergrepen tegelijk. De dubbele letter is dus geen dubbele klank, maar een tekening van de lettergreepbouw: één *m*, twee lettergrepen.',
            rule: 'Dubbele medeklinker in de spelling = één ambisyllabische klank na een ongespannen klinker.',
            quiz: {
              q: 'Hoeveel m-klanken hoor je in ‘bommen’?',
              options: ['één, die bij twee lettergrepen hoort', 'twee, één per lettergreep', 'geen'],
              answer: 'één, die bij twee lettergrepen hoort',
              why: 'De m is ambisyllabisch. De spelling tekent dat met twee letters.',
            },
          },
          {
            text: 'Het bewijs zit in het verschil met *bomen*. Na een gespannen klinker mag de lettergreep open eindigen: *bo-men*. De *m* hoort dan alleen bij de tweede lettergreep. Eén eis, ongespannen klinkers in gesloten lettergrepen, verklaart zo twee spellingregels: verdubbelen én enkel schrijven.',
            lab: {
              label: 'Tik een woord',
              chips: [
                { k: 'bomen', out: 'bo · men', note: 'Gespannen o: de lettergreep mag open.' },
                { k: 'bommen', out: 'bom · men, één m', note: 'Ongespannen o: de m hoort bij beide.' },
                { k: 'lachen', out: 'lach · chen, één ch', note: 'Ook ambisyllabisch, maar ch verdubbel je nooit.' },
              ],
            },
            deep: {
              q: 'En bij ch en ng?',
              a: 'Die verdubbel je nooit: *lachen*, *zingen*. Toch zijn het korte klinkers met een ambisyllabische medeklinker. De spelling heeft voor *ch* en *ng* gewoon geen dubbele vorm; *lachchen* zou onleesbaar zijn. Over ambisyllabiciteit in het Nederlands schreven onder anderen Van der Hulst (1985) en Booij (1995).',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'ambi',
        prompt: 'Hoort de medeklinker bij twee lettergrepen of alleen bij de tweede?',
        buckets: ['bij allebei: ambisyllabisch', 'alleen bij de tweede'],
        items: [
          { t: 'de m in bommen', b: 0 },
          { t: 'de m in bomen', b: 1 },
          { t: 'de t in katten', b: 0 },
          { t: 'de t in water', b: 1 },
          { t: 'de ch in lachen', b: 0 },
          { t: 'de n in manen', b: 1 },
        ],
        why: 'Na een ongespannen klinker (bommen, katten, lachen) hoort de medeklinker bij beide lettergrepen. Na een gespannen klinker (bomen, water, manen) alleen bij de tweede.',
      },
      {
        kind: 'choice',
        id: 'lachen',
        prompt: 'Waarom schrijf je ‘lachen’ en niet ‘lachchen’?',
        before: '',
        after: '',
        options: ['ch verdubbel je nooit, ook al is de klank ambisyllabisch', 'de a in lachen is gespannen', 'ch is twee klanken'],
        answer: 'ch verdubbel je nooit, ook al is de klank ambisyllabisch',
        why: 'De korte a vraagt om een gesloten lettergreep, maar ch heeft geen dubbele vorm.',
      },
      {
        kind: 'bet',
        id: 'eis',
        prompt: 'Welke eis verklaart de dubbele medeklinkers in de spelling?',
        options: [
          'Een ongespannen klinker staat in een gesloten lettergreep',
          'Elke lettergreep heeft twee medeklinkers',
          'Een klinker vóór een dubbele medeklinker is lang',
        ],
        answer: 'Een ongespannen klinker staat in een gesloten lettergreep',
        why: 'Daarom moet de medeklinker na een korte klinker ook bij de eerste lettergreep horen.',
      },
    ],
  },
  {
    id: 'k20',
    stage: 'master',
    domain: 'fon',
    title: 'De rekensom achter klemtoon',
    skill: 'Spelling',
    icon: 'ˈσ',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Gewicht en klemtoon',
        panels: [
          {
            text: 'Waarom zeg je *A-na-nas* maar *ka-ra-VAAN*? Je brein rekent stiekem. In Nederlandse woorden die geen samenstelling zijn, valt de klemtoon op een van de laatste drie lettergrepen: het *driesyllabenvenster*. Daarbinnen telt het *gewicht* van de laatste lettergreep.',
            lab: {
              label: 'Tik een laatste lettergreep',
              chips: [
                { k: 'ma in pyjama', out: 'licht', note: 'Eindigt op een gespannen klinker.' },
                { k: 'nas in ananas', out: 'zwaar', note: 'Ongespannen klinker + één medeklinker.' },
                { k: 'vaan in karavaan', out: 'superzwaar', note: 'Gespannen klinker + medeklinker.' },
              ],
            },
          },
          {
            text: 'Nu de vuistregels. Is de laatste lettergreep superzwaar, dan krijgt hij zelf de klemtoon: *ka-ra-VAAN*. Is hij zwaar, dan valt de klemtoon twee lettergrepen terug: *A-na-nas*. Is hij licht, dan valt hij op de voorlaatste: *py-JA-ma*.',
            rule: 'Superzwaar: de laatste. Zwaar: twee terug. Licht: de voorlaatste.',
            quiz: {
              q: 'Waar valt de klemtoon in ‘almanak’?',
              options: ['AL-ma-nak', 'al-MA-nak', 'al-ma-NAK'],
              answer: 'AL-ma-nak',
              why: 'nak is zwaar: ongespannen klinker + één medeklinker. Dus twee terug.',
            },
          },
          {
            text: 'Het blijven tendensen. *Canada* zou volgens de regel ca-NA-da moeten zijn, maar je zegt CA-na-da. Fonologen zien zulke uitzonderingen niet als ruis, maar als bewijs: wat moet in je geheugen staan, en wat rekent de grammatica zelf uit?',
            quiz: {
              q: 'Welk woord volgt de regel niet?',
              options: ['Canada', 'pyjama', 'agenda'],
              answer: 'Canada',
              why: 'De laatste lettergreep is licht, dus je verwacht ca-NA-da. Toch zeg je CA-na-da.',
            },
            deep: {
              q: 'Hoe werkt de analyse precies?',
              a: 'De klassieke analyses zijn van Trommelen en Zonneveld (1989) en Kager (1989). Ze gebruiken *metrische voeten*: groepjes van een sterke en een zwakke lettergreep, zoals in poëzie. Het gewicht van een lettergreep bepaalt hoe de voeten vallen, en de sterkste voet krijgt de hoofdklemtoon.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'regel',
        prompt: 'Waar valt de klemtoon volgens de regel?',
        buckets: ['op de laatste', 'op de voorlaatste', 'twee terug'],
        items: [
          { t: 'karavaan', b: 0 },
          { t: 'agenda', b: 1 },
          { t: 'ananas', b: 2 },
          { t: 'kameraad', b: 0 },
          { t: 'pyjama', b: 1 },
          { t: 'almanak', b: 2 },
        ],
        why: 'vaan en raad: superzwaar, dus de laatste. da en ma: licht, dus de voorlaatste. nas en nak: zwaar, dus twee terug.',
      },
      {
        kind: 'choice',
        id: 'gewicht',
        prompt: 'Hoe zwaar is de laatste lettergreep van ‘kameraad’?',
        before: '',
        after: '',
        options: ['superzwaar', 'zwaar', 'licht'],
        answer: 'superzwaar',
        why: 'raad: gespannen klinker + medeklinker.',
      },
      {
        kind: 'bet',
        id: 'verzonnen',
        prompt: 'Een verzonnen woord: ‘pinoraak’. Waar valt de klemtoon?',
        intro: 'Zo testen fonologen of een regel echt in je hoofd zit: met woorden die je nog nooit hoorde.',
        options: ['PI-no-raak', 'pi-NO-raak', 'pi-no-RAAK'],
        answer: 'pi-no-RAAK',
        why: 'raak is superzwaar: gespannen klinker + medeklinker. Dus de laatste.',
      },
    ],
  },
  {
    id: 'k21',
    stage: 'master',
    domain: 'fon',
    title: 'Fonologie als recept',
    skill: 'Spelling',
    icon: '→',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Regels in volgorde',
        panels: [
          {
            text: 'Volgorde doet ertoe, bij pannenkoeken én bij klanken. In de generatieve fonologie begin je bij een *onderliggende vorm* /…/ en pas je regels toe, stap voor stap, tot de *oppervlaktevorm* […]. Drie regels: A. eindklankverscherping. B. vóór /b d/ wordt een obstruent stemhebbend. C. na een stemloze obstruent worden /v z ɣ/ stemloos.',
            swap: {
              goal: 'Zet de afleiding van hoofdzaak in de goede volgorde',
              blocks: ['[ɦoːftsaːk]', '/ɦoːfd+zaːk/', 'ɦoːft.zaːk'],
              accept: ['/ɦoːfd+zaːk/ ɦoːft.zaːk [ɦoːftsaːk]'],
              note: 'Eerst de onderliggende vorm. Regel A maakt van de d een t. Daarna maakt regel C van de z een s.',
            },
          },
          {
            text: 'Maakt de ene regel werk voor de andere, dan heet dat *feeding*: A voedt C, want zonder A staat er geen stemloze klank vóór de /z/. Neemt een regel werk weg van een andere, dan heet dat *bleeding*. Bekend voorbeeld uit het Engels: in *buses* komt eerst een klinker tussen /s/ en /z/, en daardoor kan de /z/ niet meer stemloos worden.',
            rule: 'Feeding: regel 1 maakt werk voor regel 2. Bleeding: regel 1 neemt werk weg van regel 2.',
            quiz: {
              q: 'In hoofdzaak maakt regel A werk voor regel C. Hoe heet dat?',
              options: ['feeding', 'bleeding'],
              answer: 'feeding',
              why: 'A voedt C: pas na A staat er een [t] vóór de z.',
            },
            deep: {
              q: 'Heen en terug',
              a: 'Bij *rondbrengen* maakt regel A van /d/ een [t], en regel B maakt er weer een [d] van: /rɔnd+brɛŋən/ → rɔnt.brɛŋən → [rɔndbrɛŋə]. Zo’n afleiding heet een *Duke of York-afleiding* (Pullum, 1976), naar een Engels kinderliedje over een hertog die zijn leger een heuvel op en weer af laat marcheren.',
            },
          },
          {
            text: 'Soms zie je aan de oppervlakte niet meer waarom een regel werkte. Dat heet *opaciteit*. In *ik verhuis* hoor je een [s], toch is de verleden tijd *verhuisde*. De keuze tussen -te en -de moet dus gemaakt zijn vóór de eindklankverscherping, op de onderliggende /z/. In de omgekeerde volgorde kreeg je *verhuiste*.',
            quiz: {
              q: 'Waarom is het ‘verhuisde’ en niet ‘verhuiste’?',
              options: [
                'De uitgang kiest op de onderliggende /z/, vóór de eindklankverscherping',
                'De s in verhuis klinkt stemhebbend',
                'Verhuizen is een sterk werkwoord',
              ],
              answer: 'De uitgang kiest op de onderliggende /z/, vóór de eindklankverscherping',
              why: 'De keuze tussen -te en -de gebeurt vóór eindklankverscherping. Aan de oppervlakte zie je de reden niet meer.',
            },
          },
        ],
      },
      {
        kind: 'choice',
        id: 'zakdoek',
        prompt: 'Pas de regels toe op /zɑk+duk/. Wat komt eruit?',
        before: '',
        after: '',
        options: ['[zɑgduk]', '[zɑkduk]', '[zɑktuk]'],
        answer: '[zɑgduk]',
        why: 'A verandert niets: de k is al stemloos. B: de k vóór de d wordt [g].',
      },
      {
        kind: 'choice',
        id: 'handdoek',
        prompt: 'En /ɦɑnd+duk/?',
        before: '',
        after: '',
        options: ['[ɦɑnduk]', '[ɦɑntduk]', '[ɦɑnttuk]'],
        answer: '[ɦɑnduk]',
        why: 'A: de d wordt t. B: weer d vóór de d. Twee gelijke klanken smelten samen: degeminatie.',
      },
      {
        kind: 'choice',
        id: 'opzij',
        prompt: '/ɔp+zɛi/ wordt…',
        before: '',
        after: '',
        options: ['[ɔpsɛi]', '[ɔbzɛi]', '[ɔpzɛi]'],
        answer: '[ɔpsɛi]',
        why: 'Regel C: de z na de p wordt [s]. Regel B werkt niet: de z is geen b of d.',
      },
      {
        kind: 'sort',
        id: 'feed-bleed',
        prompt: 'Feeding of bleeding?',
        buckets: ['feeding', 'bleeding'],
        items: [
          { t: 'Regel 1 maakt de context voor regel 2', b: 0 },
          { t: 'Regel 1 haalt de context van regel 2 weg', b: 1 },
          { t: 'hoofdzaak: d wordt t, daarna wordt z een s', b: 0 },
          { t: 'buses: eerst een klinker erbij, daarna kan de z niet meer stemloos worden', b: 1 },
        ],
        why: 'Feeding voedt de volgende regel, bleeding bloedt hem leeg.',
      },
    ],
  },
  {
    id: 'k22',
    stage: 'master',
    domain: 'fon',
    title: 'Taal als wedstrijd',
    skill: 'Spelling',
    icon: 'OT',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Optimaliteitstheorie',
        panels: [
          {
            text: 'Wat als taal geen recept is, maar een wedstrijd? In de *Optimaliteitstheorie* (Prince en Smolensky, 1993) heeft elke taal dezelfde eisen, maar een andere *rangorde*. Een generator maakt kandidaten, en de eisen kiezen de winnaar. De hoogste eis beslist; lagere eisen tellen pas bij een gelijkspel.',
            lab: {
              label: 'Tik een teken uit een tableau',
              chips: [
                { k: '*', out: 'een overtreding', note: 'Elke ster is één keer tegen de eis in.' },
                { k: '*!', out: 'een fatale overtreding', note: 'Hier valt de kandidaat af.' },
                { k: '☞', out: 'de winnaar', note: 'De optimale kandidaat.' },
              ],
            },
          },
          {
            text: 'Twee eisen botsen bij /hɔnd/. ∗VOICED-CODA: geen stemhebbende obstruent aan het eind van een lettergreep. IDENT(voice): verander de stem van een klank niet. Je kunt ze niet allebei tevreden houden. Tik twee eisen om ze van plek te wisselen; links staat de hoogste.',
            tableau: {
              input: '/hɔnd/',
              constraints: [
                { name: 'IDENT(voice)', note: 'Verander de stem van een klank niet.' },
                { name: '∗VOICED-CODA', note: 'Geen stemhebbende obstruent aan het eind van een lettergreep.' },
              ],
              candidates: [
                { form: '[hɔnd]', marks: [0, 1] },
                { form: '[hɔnt]', marks: [1, 0] },
              ],
              winner: 1,
              goal: 'Laat [hɔnt] winnen',
              note: '∗VOICED-CODA ≫ IDENT(voice): de rangorde van het Nederlands en het Duits.',
            },
          },
          {
            text: 'Dit verklaart *typologie*. Nederlands en Duits: ∗VOICED-CODA ≫ IDENT(voice), dus [hɔnt] en *Hund* [hʊnt]. Engels: IDENT(voice) ≫ ∗VOICED-CODA, dus *dog* houdt zijn [g]. Elke rangorde voorspelt een mogelijke taal. Met n eisen zijn er n! rangordes: de *factoriële typologie*.',
            quiz: {
              q: 'Hoeveel rangordes zijn er met drie eisen?',
              options: ['3', '6', '9'],
              answer: '6',
              why: '3! = 3 × 2 × 1 = 6. Elke rangorde is een mogelijke taal.',
            },
            deep: {
              q: 'Waar komen de kandidaten vandaan?',
              a: 'Van GEN, de generator. GEN maakt in principe oneindig veel kandidaten: [hɔnt], [hɔnd], [hɔn], [hɔndə] enzovoort. EVAL kiest met de rangorde de beste. In een tableau toon je alleen de kandidaten die het verhaal vertellen.',
            },
          },
        ],
      },
      {
        kind: 'choice',
        id: 'nederlands',
        prompt: 'De rangorde van het Nederlands is…',
        before: '',
        after: '',
        options: ['∗VOICED-CODA ≫ IDENT(voice)', 'IDENT(voice) ≫ ∗VOICED-CODA'],
        answer: '∗VOICED-CODA ≫ IDENT(voice)',
        why: 'De codaregel wint: [hɔnt].',
      },
      {
        kind: 'choice',
        id: 'engels',
        prompt: 'Het Engelse ‘dog’ [dɒg] laat zien dat…',
        before: '',
        after: '',
        options: ['IDENT(voice) ≫ ∗VOICED-CODA', '∗VOICED-CODA ≫ IDENT(voice)'],
        answer: 'IDENT(voice) ≫ ∗VOICED-CODA',
        why: 'Trouw aan de input wint: de [g] blijft.',
      },
      {
        kind: 'swipe',
        id: 'wedstrijd',
        prompt: 'Klopt het?',
        intro: 'Veeg naar rechts als de zin klopt, naar links als hij niet klopt.',
        cards: [
          { t: 'In OT hebben alle talen dezelfde eisen.', ok: true, why: 'Alleen de rangorde verschilt.' },
          {
            t: 'De kandidaat met de minste sterren in totaal wint altijd.',
            ok: false,
            fix: 'de hoogste eis beslist eerst',
            why: 'Eén ster bij een hoge eis weegt zwaarder dan tien bij een lage eis.',
          },
          { t: 'Met vier eisen zijn er 24 rangordes.', ok: true, why: '4! = 4 × 3 × 2 × 1 = 24.' },
          { t: 'In het Duits staat ∗VOICED-CODA boven IDENT(voice).', ok: true, why: 'Hund klinkt als [hʊnt].' },
        ],
      },
    ],
  },
  {
    id: 'k23',
    stage: 'master',
    domain: 'fon',
    title: 'Rangordes bewijzen',
    skill: 'Spelling',
    icon: '≫',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'De fonoloog als detective',
        panels: [
          {
            text: 'Een fonoloog zoekt de rangorde zoals een detective. Elke winnaar is bewijs. Overtreedt de winnaar een eis die een verliezer niet overtreedt? Dan moet een hogere eis die verliezer uitschakelen. Neem *zakdoek*: /zɑk+duk/ wordt [zɑgduk].',
            tableau: {
              input: '/zɑk+duk/',
              constraints: [
                { name: 'IDENT(voice)', note: 'Verander de stem van een klank niet.' },
                { name: 'AGREE(voice)', note: 'Twee obstruenten naast elkaar hebben dezelfde stem.' },
                { name: 'IDENT-ONS(voice)', note: 'Verander de stem niet aan het begin van een lettergreep.' },
              ],
              candidates: [
                { form: '[zɑkduk]', marks: [0, 1, 0] },
                { form: '[zɑgduk]', marks: [1, 0, 0] },
                { form: '[zɑktuk]', marks: [1, 0, 1] },
              ],
              winner: 1,
              goal: 'Laat [zɑgduk] winnen',
              note: 'AGREE ≫ IDENT: de klanken moeten gelijk worden. En [zɑktuk] wint nooit: hij doet alles minstens zo slecht als [zɑgduk].',
            },
          },
          {
            text: 'Kijk naar [zɑktuk]. Die verliest bij elke rangorde: hij heeft alle sterren van [zɑgduk] en nog één extra. Zo’n kandidaat heet *harmonisch begrensd*. Daarom wordt in *zakdoek* de *k* stemhebbend, en niet de *d* stemloos: de eis IDENT-ONS beschermt het begin van een lettergreep (Lombardi, 1999).',
            quiz: {
              q: 'Waarom kan [zɑktuk] nooit winnen?',
              options: ['Hij heeft alle sterren van [zɑgduk] plus één extra', 'Omdat het geen Nederlands woord is', 'Omdat AGREE hem verbiedt'],
              answer: 'Hij heeft alle sterren van [zɑgduk] plus één extra',
              why: 'Harmonisch begrensd: bij elke rangorde doet [zɑgduk] het minstens zo goed.',
            },
            deep: {
              q: 'En opzij dan?',
              a: 'In *opzij* [ɔpsɛi] verandert juist het begin van de lettergreep: de *z* wordt [s]. Met alleen deze drie eisen kan dat niet winnen. Fonologen voegen daarom een eis toe die specifiek stemhebbende wrijfklanken afstraft. Zo groeit een analyse: elke nieuwe vorm test de rangorde.',
            },
          },
          {
            text: 'Nog een wedstrijd: *bioscoop*. Twee klinkers naast elkaar (*bi-os*) geven een lettergreep zonder begin. ONSET eist dat elke lettergreep een begin heeft. DEP verbiedt klanken toevoegen, MAX verbiedt klanken weglaten. Het Nederlands voegt een [j] toe.',
            tableau: {
              input: '/biɔskoːp/',
              constraints: [
                { name: 'DEP', note: 'Voeg geen klank toe.' },
                { name: 'ONSET', note: 'Elke lettergreep heeft een begin.' },
                { name: 'MAX', note: 'Laat geen klank weg.' },
              ],
              candidates: [
                { form: '[bi.ɔs.koːp]', marks: [0, 1, 0] },
                { form: '[bi.jɔs.koːp]', marks: [1, 0, 0] },
                { form: '[bɔs.koːp]', marks: [0, 0, 1] },
              ],
              winner: 1,
              goal: 'Laat [bi.jɔs.koːp] winnen',
              note: 'ONSET ≫ DEP en MAX ≫ DEP: liever een klank erbij dan een lettergreep zonder begin of een klank minder.',
            },
            deep: {
              q: 'Een rangordeargument',
              a: 'De winnaar [bi.jɔs.koːp] overtreedt DEP, de verliezer [bi.ɔs.koːp] niet. Dus moet er een eis zijn die de verliezer wel overtreedt en hoger staat: ONSET. Zo bewijs je ONSET ≫ DEP. Met dezelfde redenering tegen [bɔs.koːp] bewijs je MAX ≫ DEP.',
            },
          },
        ],
      },
      {
        kind: 'choice',
        id: 'argument',
        prompt: 'De winnaar [zɑgduk] overtreedt IDENT(voice), de verliezer [zɑkduk] niet. Wat volgt daaruit?',
        before: '',
        after: '',
        options: ['AGREE(voice) ≫ IDENT(voice)', 'IDENT(voice) ≫ AGREE(voice)', 'Niets'],
        answer: 'AGREE(voice) ≫ IDENT(voice)',
        why: 'De verliezer moet sneuvelen op een eis die hoger staat: AGREE.',
      },
      {
        kind: 'choice',
        id: 'begrensd',
        prompt: 'Kandidaat A overtreedt eis X en eis Y. Kandidaat B overtreedt alleen X. Welke kandidaat kan nooit winnen?',
        before: '',
        after: '',
        options: ['A', 'B', 'Geen van beide'],
        answer: 'A',
        why: 'A heeft alles wat B heeft, plus één extra ster. A is harmonisch begrensd.',
      },
      {
        kind: 'swipe',
        id: 'bewijs',
        prompt: 'Klopt het?',
        intro: 'Veeg naar rechts als de zin klopt, naar links als hij niet klopt.',
        cards: [
          { t: 'In bioscoop staat ONSET boven DEP.', ok: true, why: 'Daarom komt er een [j] bij.' },
          {
            t: 'Een harmonisch begrensde kandidaat wint als je de rangorde maar goed kiest.',
            ok: false,
            fix: 'hij wint bij geen enkele rangorde',
            why: 'Een andere kandidaat doet het altijd minstens zo goed.',
          },
          { t: 'IDENT-ONS beschermt het begin van een lettergreep.', ok: true, why: 'Het begin van een lettergreep is belangrijk voor de luisteraar.' },
        ],
      },
    ],
  },
  {
    id: 'k24',
    stage: 'master',
    domain: 'fon',
    title: 'Het brein hoort categorieën',
    skill: 'Spelling',
    icon: 'VOT',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Spraakwaarneming',
        panels: [
          {
            text: 'Je oren meten geen klanken, je brein sorteert ze. Bij een plofklank telt de *voice onset time* (VOT): de tijd tussen het loslaten van de afsluiting en het begin van het trillen van je stembanden. Een Nederlandse /b/ trilt al vóór het loslaten: een negatieve VOT. Een Nederlandse /p/ trilt vrijwel direct erna.',
            lab: {
              label: 'Tik een klank',
              chips: [
                { k: 'Nederlandse /b/', out: 'VOT ≈ −85 ms', note: 'De stembanden trillen al vóór het loslaten.' },
                { k: 'Nederlandse /p/', out: 'VOT ≈ +10 ms', note: 'Het trillen begint vrijwel meteen.' },
                { k: 'Engelse /p/', out: 'VOT ≈ +60 ms', note: 'Eerst een zuchtje lucht: aspiratie, [pʰ].' },
              ],
            },
          },
          {
            text: 'Het Engels verdeelt de schaal anders. Een Engelse /p/ heeft een pauze met een zuchtje lucht: [pʰ]. Een Engelse /b/ lijkt meer op een Nederlandse /p/. Daarom hoort een Engelsman in het Nederlandse *paal* soms *baal*.',
            quiz: {
              q: 'Wat meet de voice onset time?',
              options: ['De tijd tussen het loslaten en het trillen van de stembanden', 'Hoe hard een klank is', 'Hoe lang een klinker duurt'],
              answer: 'De tijd tussen het loslaten en het trillen van de stembanden',
              why: 'VOT: van de plof tot het begin van de stem. De metingen van Lisker en Abramson (1964) maakten dit begrip beroemd.',
            },
          },
          {
            text: 'Laat een computer de VOT in kleine stapjes verschuiven, van /b/ naar /p/. Je hoort geen glijdende overgang. Je hoort lang /b/, en dan opeens /p/. Dat heet *categoriale perceptie*. Baby’s horen bijna alle klankverschillen van alle talen, maar rond hun eerste verjaardag vooral nog de verschillen van hun eigen taal.',
            quiz: {
              q: 'Wat hoor je als de VOT in kleine stapjes verschuift?',
              options: ['Eerst /b/ en dan opeens /p/', 'Een langzame overgang', 'Niets'],
              answer: 'Eerst /b/ en dan opeens /p/',
              why: 'Je brein deelt de schaal op in categorieën: categoriale perceptie.',
            },
            deep: {
              q: 'Zien is ook horen',
              a: 'Laat iemand op video *ga* zeggen, met het geluid *ba* eronder. De meeste mensen horen dan *da*. Dit *McGurk-effect* (McGurk en MacDonald, 1976) laat zien dat je brein lippen en geluid samen verwerkt. Doe je je ogen dicht, dan hoor je weer gewoon *ba*.',
            },
          },
        ],
      },
      {
        kind: 'choice',
        id: 'baby',
        prompt: 'Rond welke leeftijd horen baby’s vooral nog de klankverschillen van hun eigen taal?',
        before: '',
        after: '',
        options: ['rond 1 jaar', 'rond 5 jaar', 'al bij de geboorte'],
        answer: 'rond 1 jaar',
        why: 'Werker en Tees (1984): tussen 6 en 12 maanden verdwijnt de gevoeligheid voor verschillen die de eigen taal niet gebruikt.',
      },
      {
        kind: 'swipe',
        id: 'waarneming',
        prompt: 'Klopt het?',
        intro: 'Veeg naar rechts als de zin klopt, naar links als hij niet klopt.',
        cards: [
          { t: 'Een Nederlandse /b/ trilt al vóór het loslaten van de lippen.', ok: true, why: 'Een negatieve VOT.' },
          {
            t: 'Een Nederlandse /p/ heeft een zuchtje lucht, net als in het Engels.',
            ok: false,
            fix: 'een Nederlandse /p/ heeft geen aspiratie',
            why: 'Alleen de Engelse /p/ heeft dat zuchtje: [pʰ].',
          },
          { t: 'Bij het McGurk-effect hoor je met je ogen.', ok: true, why: 'Beeld ga plus geluid ba geeft vaak da.' },
          {
            t: 'Bij categoriale perceptie hoor je kleine verschillen binnen een categorie juist heel goed.',
            ok: false,
            fix: 'verschillen binnen een categorie hoor je juist slecht',
            why: 'Je brein let vooral op de grens tussen categorieën.',
          },
        ],
      },
      {
        kind: 'bet',
        id: 'paal',
        prompt: 'Een Engelsman hoort een Nederlander ‘paal’ zeggen. Wat hoort hij soms?',
        options: ['baal', 'pool', 'kaal'],
        answer: 'baal',
        why: 'De Nederlandse /p/ heeft geen zuchtje lucht. Voor een Engels oor lijkt hij daardoor op een /b/.',
      },
    ],
  },
  {
    id: 'k25',
    stage: 'master',
    domain: 'fon',
    title: 'Klankverandering, live',
    skill: 'Spelling',
    icon: 'aːi',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Variatie en verandering',
        panels: [
          {
            text: 'Het Standaardnederlands bestaat vooral in woordenboeken. Op straat beweegt alles. Neem het *Poldernederlands*, beschreven door Jan Stroop (1998): de *ei* begint lager en wijder, dus *tijd* klinkt als [taːit] en *klein* als [klaːin]. Ook *ui* en *ou* gaan wijder open.',
            vowels: {
              q: 'Tik de tweeklank die in het Poldernederlands het meest verschuift',
              targets: ['ɛi'],
              glides: true,
              note: 'De ei begint lager: [aːi]. Zo klinkt tijd als taait.',
            },
          },
          {
            text: 'Er gebeurt meer. De *Gooise r*: aan het eind van een lettergreep klinkt de *r* bij veel sprekers als een Engelse [ɹ]: *boer* [buɹ]. In het westen verliezen *v* en *z* hun stem: *zee* klinkt als [seː]. En de *g* is hard in het noorden [χ] en zacht in het zuiden en in Vlaanderen [ɣ].',
            lab: {
              label: 'Tik een woord',
              chips: [
                { k: 'tijd', out: '[taːit]', note: 'Poldernederlands: een wijde ei.' },
                { k: 'boer', out: '[buɹ]', note: 'Gooise r: als in het Engels.' },
                { k: 'zee', out: '[seː]', note: 'Een stemloze z in het westen.' },
                { k: 'goed', out: '[ɣut] of [χut]', note: 'Zachte g in het zuiden, harde in het noorden.' },
              ],
            },
          },
          {
            text: 'Wie verandert de taal? Volgens Stroop liepen jonge, hoogopgeleide vrouwen voorop bij het Poldernederlands. Dat past in een bekend patroon uit de sociolinguïstiek: vrouwen nemen nieuwe vormen vaak eerder over (Labov). Een verandering verspreidt zich eerst langzaam, dan snel, dan weer langzaam: een *S-curve*.',
            quiz: {
              q: 'Wie liepen volgens Stroop voorop bij het Poldernederlands?',
              options: ['jonge, hoogopgeleide vrouwen', 'oudere mannen op het platteland', 'tieners in Vlaanderen'],
              answer: 'jonge, hoogopgeleide vrouwen',
              why: 'Een klassiek patroon: vrouwen leiden veel taalveranderingen.',
            },
            deep: {
              q: 'Is dit nieuw?',
              a: 'Nee. Zo ging ook de lange *ii* van *wijn* glijden, vijf eeuwen geleden. Een nieuwe uitspraak bij een groep met aanzien verspreidt zich en wordt na een paar generaties gewoon. Misschien is [taːit] over honderd jaar de standaard. Je kijkt naar klankverandering terwijl die gebeurt.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'variatie',
        prompt: 'Welk verschijnsel hoor je?',
        buckets: ['Poldernederlands', 'Gooise r', 'stemloze v en z'],
        items: [
          { t: '[taːit] voor tijd', b: 0 },
          { t: '[buɹ] voor boer', b: 1 },
          { t: '[seː] voor zee', b: 2 },
          { t: '[klaːin] voor klein', b: 0 },
          { t: '[ʋaːɹ] voor waar', b: 1 },
          { t: '[fɪs] voor vis', b: 2 },
        ],
        why: 'Een wijde ei: Poldernederlands. Een Engelse r aan het eind: Gooise r. Een z of v zonder stem: verstemlozing in het westen.',
      },
      {
        kind: 'choice',
        id: 'geen-eindklank',
        prompt: '[seː] voor ‘zee’: is dat eindklankverscherping?',
        before: '',
        after: '',
        options: ['Nee, de z staat aan het begin', 'Ja, de z wordt stemloos', 'Ja, want de ee is lang'],
        answer: 'Nee, de z staat aan het begin',
        why: 'Eindklankverscherping werkt aan het eind van een lettergreep. Dit is een aparte verandering: verstemlozing van wrijfklanken.',
      },
      {
        kind: 'bet',
        id: 'zachte-g',
        prompt: 'Waar hoor je vooral de zachte g?',
        options: ['in Limburg, Brabant en Vlaanderen', 'in Amsterdam en Den Haag', 'in Groningen'],
        answer: 'in Limburg, Brabant en Vlaanderen',
        why: 'In het zuiden. Het noorden heeft een harde, schrapende g.',
      },
    ],
  },
];
