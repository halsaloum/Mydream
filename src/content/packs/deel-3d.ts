import type { LessonInput } from '../schema';

/**
 * Een les rond een echt 3D-model: de fiets, gemaakt met Meshy. Draai hem rond, tik een onderdeel
 * en schrijf het woord. Daarna bouw je met die onderdelen samenstellingen: het hoofd rechts
 * bepaalt *de* of *het*, en de tussenklank volgt het meervoud of het gehoor (zie d7 en d10).
 *
 * De plekken van de stippen (`AT`) zijn in meters gemeten op `public/models/fiets.glb`. Komt er
 * een nieuw model, meet ze dan opnieuw (zie `scripts/meshy.mjs`).
 */
type Point = [number, number, number];

const AT = {
  stuur: [0, 0, 0],
  bel: [0, 0, 0],
  zadel: [0, 0, 0],
  trapper: [0, 0, 0],
  ketting: [0, 0, 0],
  bagagedrager: [0, 0, 0],
  spatbord: [0, 0, 0],
  lamp: [0, 0, 0],
  band: [0, 0, 0],
  naaf: [0, 0, 0],
  standaard: [0, 0, 0],
} satisfies Record<string, Point>;

export const DEEL_3D_LESSONS: LessonInput[] = [
  {
    id: 'd20',
    stage: 'bachelor',
    domain: 'morf',
    also: ['orth'],
    title: 'De fiets in 3D',
    skill: 'Woorden',
    icon: '3D',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Een fiets vol woorden',
        panels: [
          {
            text: 'Nederland heeft meer fietsen dan mensen, en elke fiets is een woordenboek op wielen. Draai de fiets rond en tik een stip. Schrijf het onderdeel op *met* lidwoord, want *de* of *het* hoort bij het woord zelf: dat leer je niet uit een regel, maar per woord.',
            model: {
              q: 'Tik een stip en schrijf het onderdeel op, met de of het',
              model: 'fiets',
              parts: [
                { id: 'stuur', at: AT.stuur, ask: 'Hiermee stuur je. Hoe heet dit?', answer: 'het stuur', traps: [{ w: 'de stuur', note: 'Het stuur, net als het roer van een boot.' }], note: 'Het stuur. Een het-woord, net als het roer van een boot.' },
                { id: 'bel', at: AT.bel, ask: 'Tring tring! Hoe heet dit?', answer: 'de bel', traps: [{ w: 'het bel', note: 'Het is de bel, net als de deurbel.' }], note: 'De bel. Een fiets zonder bel is in Nederland niet toegestaan.' },
                { id: 'zadel', at: AT.zadel, ask: 'Hier zit je op. Hoe heet dit?', answer: 'het zadel', also: ['de zadel'], note: 'Het zadel (de zadel mag ook, maar het zadel is gewoner).' },
                { id: 'trapper', at: AT.trapper, ask: 'Hier zet je je voet op. Hoe heet dit?', answer: 'de trapper', also: ['het pedaal', 'de pedaal'], note: 'De trapper, of het pedaal. Twee woorden voor één ding.' },
                { id: 'ketting', at: AT.ketting, ask: 'Die brengt je trapkracht naar het achterwiel. Hoe heet dit?', answer: 'de ketting', note: 'De ketting. Bij een omafiets zit hij veilig in een kast.' },
                { id: 'bagagedrager', at: AT.bagagedrager, ask: 'Hier zet je je tas of een vriend op. Hoe heet dit?', answer: 'de bagagedrager', traps: [{ w: 'de bagagerek', note: 'Bijna: op een fiets heet het de bagagedrager.' }], note: 'De bagagedrager: bagage + drager. Iets dat bagage draagt.' },
                { id: 'spatbord', at: AT.spatbord, ask: 'Dit houdt de modder van je broek. Hoe heet dit?', answer: 'het spatbord', traps: [{ w: 'de spatbord', note: 'Het hoofd is bord, en het is het bord. Dus het spatbord.' }], note: 'Het spatbord: spat + bord. Het bord geeft het lidwoord.' },
                { id: 'lamp', at: AT.lamp, ask: 'Die schijnt vooruit in het donker. Hoe heet dit?', answer: 'de koplamp', also: ['de lamp', 'het voorlicht', 'de voorlamp'], note: 'De koplamp, of het voorlicht. Let op: de lamp, maar het licht.' },
              ],
              note: 'Acht onderdelen, acht keer de of het. Bij spatbord zag je al iets: het laatste deel beslist.',
            },
            rule: 'Leer een zelfstandig naamwoord altijd mét lidwoord: het stuur, de bel, het zadel.',
            deep: {
              q: 'Is er dan helemaal geen regel voor de en het?',
              a: 'Een paar vuistregels zijn betrouwbaar. Verkleinwoorden zijn altijd *het*: *het fietsje*, ook al is het *de fiets*. Woorden op het achtervoegsel *-ing* of *-heid* zijn *de*: *de versnelling*, *de snelheid*. Een werkwoord als zelfstandig naamwoord is *het*: *het fietsen*. Voor de rest moet je het onthouden. Zo’n twee derde van de zelfstandige naamwoorden is een *de*-woord.',
            },
          },
          {
            text: 'Nu het echte werk. Plak *fiets* voor een onderdeel en je krijgt een samenstelling. Welk lidwoord krijgt die? Kijk naar het laatste deel: dat is het *hoofd* (je kent het uit "Wie is de baas in het woord?"). *Het zadel* wordt *het fietszadel*, *de bel* wordt *de fietsbel*. Maar draai het om: *de ketting* + *wiel* wordt *het kettingwiel*.',
            model: {
              q: 'Maak de samenstelling, met de of het',
              model: 'fiets',
              parts: [
                { id: 'bel', at: AT.bel, ask: 'fiets + bel =', answer: 'de fietsbel', traps: [{ w: 'het fietsbel', note: 'Het hoofd is bel, en het is de bel.' }], note: 'De fietsbel: bel is het hoofd.' },
                { id: 'zadel', at: AT.zadel, ask: 'fiets + zadel =', answer: 'het fietszadel', also: ['de fietszadel'], traps: [{ w: 'fiets zadel', note: 'Samenstellingen schrijf je aan elkaar.' }], note: 'Het fietszadel: zadel is het hoofd, dus het.' },
                { id: 'ketting', at: AT.ketting, ask: 'Het tandwiel waar de ketting omheen loopt: ketting + wiel =', answer: 'het kettingwiel', traps: [{ w: 'de kettingwiel', note: 'De ketting staat links. Rechts staat het wiel: dat is het hoofd, dus het kettingwiel.' }], note: 'Het kettingwiel. De ketting is een de-woord, maar hij is hier geen baas.' },
                { id: 'zadel-pen', at: AT.zadel, ask: 'De buis onder het zadel: zadel + pen =', answer: 'de zadelpen', traps: [{ w: 'het zadelpen', note: 'Het zadel staat links, maar het hoofd is pen: de pen.' }], note: 'De zadelpen. Het zadel, maar de zadelpen: het hoofd wisselt het lidwoord.' },
                { id: 'lamp', at: AT.lamp, ask: 'fiets + licht =', answer: 'het fietslicht', traps: [{ w: 'de fietslicht', note: 'Het hoofd is licht, en het is het licht.' }], note: 'Het fietslicht. Vergelijk: de fietslamp.' },
              ],
              note: 'Elke keer won het rechterdeel: het bepaalt het lidwoord, de woordsoort en het meervoud (fietsbellen, kettingwielen).',
            },
            rule: 'Een samenstelling krijgt het lidwoord van het laatste deel: het zadel → de zadelpen, de ketting → het kettingwiel.',
            deep: {
              q: 'Waarom juist rechts?',
              a: 'Edwin Williams (1981) noemde het de *Righthand Head Rule*: in het Nederlands, Engels en Duits staat het hoofd van een woord rechts. Ook een achtervoegsel kan het hoofd zijn. Daarom is *het fietsje* een het-woord: *-je* staat rechts en maakt alles *het*. En daarom is *fietser* een persoon (*-er*) en *fietsen* een werkwoord (*-en*). Het rechterstuk geeft het woord zijn kenmerken.',
            },
          },
          {
            text: 'Tussen de twee delen kan iets extra’s staan: een tussenklank. Je kent de regels uit "Pannenkoek of pannekoek?". *-en-* als het eerste deel alleen een meervoud op *-en* heeft. *-s-* als je hem hoort. Probeer het op de fiets: soms lijkt het eerste deel op een regel, maar is het geen echte.',
            model: {
              q: 'Schrijf de samenstelling, zonder lidwoord',
              model: 'fiets',
              parts: [
                { id: 'band', at: AT.band, ask: 'Een pomp voor de banden: band + pomp =', answer: 'bandenpomp', hint: 'Wat is het meervoud van band?', traps: [{ w: 'bandpomp', note: 'Band heeft het meervoud banden, op -en. Dan schrijf je -en- ertussen.' }, { w: 'bandepomp', note: 'Band heeft een meervoud: banden. Dus met n.' }], note: 'Bandenpomp: band → banden, dus -en-. Ook als je één band oppompt.' },
                { id: 'standaard', at: AT.standaard, ask: 'Niet op de standaard, maar in een rek voor veel fietsen: fiets + rek =', answer: 'fietsenrek', traps: [{ w: 'fietserek', note: 'Fiets heeft het meervoud fietsen: dan -en-, met n.' }], hint: 'Wat is het meervoud van fiets?', note: 'Fietsenrek, net als fietsenmaker en fietsenstalling.' },
                { id: 'naaf', at: AT.naaf, ask: 'In de achternaaf zit de versnelling. De kabel daarvoor: versnelling + kabel =', answer: 'versnellingskabel', hint: 'Welk achtervoegsel heeft versnelling? Wat trekt dat aan?', traps: [{ w: 'versnellingkabel', note: 'Versnelling eindigt op het achtervoegsel -ing, en -ing trekt een s: versnellingskabel.' }], note: 'Versnellingskabel: -ing trekt een s, je hoort hem ook.' },
                { id: 'ketting', at: AT.ketting, ask: 'De dichte kast om de ketting: ketting + kast =', answer: 'kettingkast', traps: [{ w: 'kettingskast', note: 'Ketting eindigt wel op -ing, maar dat is geen achtervoegsel: er is geen werkwoord ketten. De familie heeft geen s: kettingslot, kettingreactie.' }], note: 'Kettingkast. De -ing van ketting is geen achtervoegsel, dus geen s.' },
              ],
              note: 'banden + pomp, fietsen + rek, versnelling + s + kabel, ketting + kast. De tussenklank volgt het meervoud, het achtervoegsel of de familie, niet de vorm alleen.',
            },
            rule: 'Bij een tussenklank kijk je naar het eerste deel: zijn meervoud (-en-), zijn achtervoegsel (-ing trekt -s-) en zijn familie.',
            deep: {
              q: 'Waarom krijgt ketting geen s, en koning wel (koningsdag)?',
              a: 'Allebei eindigen ze op *-ing*, en allebei is dat geen achtervoegsel. Toch zeg je *koningsdag* en *kettingkast*. Andrea Krott, Harald Baayen en Robert Schreuder (2001) vonden de verklaring: sprekers kijken naar de *familie* van het eerste deel. *Koning* heeft veel woorden met s (*koningshuis*, *koningskroon*), *ketting* bijna geen (*kettingslot*, *kettingzaag*). Een nieuw woord volgt de familie. De tussen-s is dus geen schrijfregel die je uit de letters afleidt, maar een patroon in je woordenschat.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'lidwoord',
        prompt: 'De of het? Kijk naar het hoofd.',
        buckets: ['de', 'het'],
        items: [
          { t: 'fietsbel', b: 0 },
          { t: 'fietszadel', b: 1 },
          { t: 'kettingwiel', b: 1 },
          { t: 'zadelpen', b: 0 },
          { t: 'spatbord', b: 1 },
          { t: 'fietspad', b: 1 },
          { t: 'fietsenmaker', b: 0 },
          { t: 'fietsje', b: 1 },
          { t: 'stuurpen', b: 0 },
          { t: 'fietsslot', b: 1 },
        ],
        why: 'Het laatste deel beslist: de bel, het zadel, het wiel, de pen, het bord, het pad, de maker, -je (altijd het), de pen, het slot.',
      },
      {
        kind: 'type',
        id: 'maker',
        prompt: 'Typ de samenstelling: fiets + maker.',
        before: 'Mijn band is lek, dus ik ga naar de',
        after: '.',
        hint: 'fiets…',
        answer: 'fietsenmaker',
        why: 'Fiets heeft het meervoud fietsen, dus -en-: fietsenmaker.',
      },
      {
        kind: 'choice',
        id: 'bond',
        prompt: 'Kies de goede spelling.',
        before: 'De vereniging voor fietsers heet de',
        after: '.',
        options: ['Fietsersbond', 'Fietserbond', 'Fietsenbond'],
        answer: 'Fietsersbond',
        why: 'fietser + s + bond: je hoort de s, dus je schrijft hem. Fietser heeft het meervoud fietsers, op -s; dus geen -en-.',
      },
      {
        kind: 'fix',
        id: 'pomp',
        prompt: 'Tik het foute woord aan en verbeter het.',
        sentence: 'Ik pomp mijn achterband op met de bandpomp van de buren.',
        wrong: 7,
        answer: 'bandenpomp',
        why: 'Band heeft het meervoud banden: bandenpomp, met -en-.',
      },
      {
        kind: 'bet',
        id: 'slot',
        prompt: 'Je fiets staat op slot. Welk lidwoord krijgt het fietsslot, en waarom?',
        options: ['het, want het slot is het hoofd', 'de, want het is de fiets', 'het, want samenstellingen zijn altijd het'],
        answer: 'het, want het slot is het hoofd',
        why: 'Het laatste deel beslist: het slot, dus het fietsslot. De fiets staat links en heeft niets te zeggen.',
      },
      {
        kind: 'swipe',
        id: 'fietswaar',
        prompt: 'Klopt deze zin?',
        cards: [
          { t: 'Het is de zadelpen, ook al is het het zadel.', ok: true, why: 'Pen is het hoofd: de pen.' },
          { t: 'Een samenstelling krijgt het lidwoord van het eerste deel.', ok: false, fix: 'van het laatste deel', why: 'Het hoofd staat rechts: de ketting, maar het kettingwiel.' },
          { t: 'Je schrijft bandenpomp, ook als je één band oppompt.', ok: true, why: 'De tussen-n volgt het meervoud banden, niet de betekenis.' },
          { t: 'Achter ketting komt een tussen-s, want het eindigt op -ing.', ok: false, fix: 'De -ing van ketting is geen achtervoegsel', why: 'Kettingkast, kettingslot: de familie van ketting heeft geen s.' },
          { t: 'Het fietsje is een het-woord, al is het de fiets.', ok: true, why: '-je staat rechts en is het hoofd: verkleinwoorden zijn altijd het.' },
          { t: 'Het meervoud van fietsbel is fietsbellen.', ok: true, why: 'Ook het meervoud komt van het hoofd: bel → bellen.' },
        ],
      },
      {
        kind: 'dictation',
        id: 'dictee',
        prompt: 'Luister en typ de zin.',
        sentence: 'De fietsenmaker zette het fietszadel recht en verving de versnellingskabel.',
        right: 'Goed: fiets + en + maker, fiets + zadel, versnelling + s + kabel.',
        wrong: 'Let op de samenstellingen: fietsenmaker (meervoud fietsen), fietszadel (geen tussenklank), versnellingskabel (-ing trekt een s).',
      },
    ],
  },
];
