import type { StepInput } from '../../schema';

/** Onderzoek bij w7: een derde uitlegronde op onderzoeksniveau, daarna zwaardere oefeningen. */
export const ONDERZOEK_W7: StepInput[] = [
  {
    kind: 'explain',
    id: 'onderzoek',
    title: 'Woorden zonder spaties, eilanden met lekken',
    panels: [
      {
        text: 'Gesproken taal heeft geen spaties. Jenny Saffran, Richard Aslin en Elissa Newport (1996) lieten baby’s van acht maanden twee minuten luisteren naar een vlakke stroom verzonnen lettergrepen, zoals *bidakupadotigolabu…*, zonder pauzes of klemtoon. Binnen een woord volgde op *bi* altijd *da*; over een woordgrens heen was de volgende lettergreep een gok. Daarna luisterden de baby’s langer naar een stuk over een grens heen (*kupado*) dan naar een woord (*bidaku*): het woord kenden ze al. Ze hadden de woorden gevonden door alleen bij te houden wat op wat volgt.',
        rule: 'Binnen een woord is de volgende lettergreep voorspelbaar, op een woordgrens niet.',
        split: {
          q: 'Welk stuk van drie lettergrepen komt terug? Knip de stroom in woorden',
          word: 'golabupadotigolabu',
          answer: 'golabu-padoti-golabu',
          note: 'golabu komt twee keer als vast blok terug. Na go komt steeds la, na bu kan alles komen. Zo knipt een baby, zonder spaties en zonder woordenboek.',
        },
      },
      {
        text: 'Een woord is ook een eiland voor verwijzing. Paul Postal (1969) zag dat een voornaamwoord moeilijk naar een stuk binnen een woord wijst: in *Hij is theedrinker, maar hij vindt hem vaak te heet* is *hem* als thee vreemd. Hij noemde woorden daarom *anaforische eilanden*. Gregory Ward, Richard Sproat en Gail McKoon (1991) verzamelden echter echte zinnen waarin het wel gebeurt. Volgens hen is het geen verbod van de grammatica, maar een kwestie van hoe zichtbaar het stuk voor de lezer nog is.',
        quiz: {
          q: 'Ik ben al jaren Ajaxfan, maar dit seizoen spelen ze slecht. Naar wie verwijst ze?',
          options: ['Ajax, een stuk van het woord Ajaxfan', 'de fans', 'niemand: de zin is fout'],
          answer: 'Ajax, een stuk van het woord Ajaxfan',
          why: 'Een naam in een samenstelling blijft goed zichtbaar. Zo’n verwijzing in een eiland is precies wat Ward en collega’s in echte teksten vonden.',
        },
        deep: {
          q: 'Wat maakt een stuk zichtbaar?',
          a: 'Bijvoorbeeld een naam, zoals *Ajax* in *Ajaxfan*, of een context waarin het stuk al onderwerp van gesprek is. In een ondoorzichtig woord als *hoogleraar* is *hoog* niet meer als hoogte te herkennen: daar valt niets meer uit op te pakken. Het eiland heeft dus lekken, maar niet overal even grote.',
        },
      },
      {
        text: 'De eilandtoets zegt: de zinsbouw kan niet in een woord. Toch is het eerste deel van *blijf-van-mijn-lijfhuis* een hele zin, een gebiedende wijs. Ook *kant-en-klaarmaaltijd* en *hogedrukgebied* hebben een woordgroep als eerste deel. Rochelle Lieber (1992) zag zulke *woordgroepsamenstellingen* als bewijs dat woordbouw en zinsbouw niet strikt na elkaar komen. Wel blijft het eiland dicht zodra het woord af is: je kunt niet vragen *Van wiens lijf is dit een blijf-van-…huis?*',
        rule: 'Een woordgroep kan het eerste deel van een samenstelling zijn; daarna kan de zinsbouw er niet meer bij.',
        bracket: {
          q: 'Bouw het woord van binnen naar buiten',
          tree: '[[blijf [van [mijn lijf]]] huis]',
          words: true,
          nodes: [
            { w: 'mijn lijf', cat: 'naamwoordgroep', note: 'Bezittelijk voornaamwoord plus naamwoord: een gewone groep uit de zinsbouw.' },
            { w: 'van mijn lijf', cat: 'voorzetselgroep', note: 'Het voorzetsel van neemt de naamwoordgroep als aanvulling.' },
            { w: 'blijf van mijn lijf', cat: 'zin (gebiedende wijs)', note: 'Een complete zin: een bevel aan wie te dichtbij komt.' },
            {
              w: 'blijf van mijn lijf huis',
              form: 'blijf-van-mijn-lijfhuis',
              cat: 'zn (samenstelling)',
              note: 'Nu slikt een woord de hele zin in. Huis is het hoofd: het is een huis, en de zin zegt wat voor huis.',
            },
          ],
          traps: [{ w: 'lijf huis', note: 'Een lijfhuis bestaat niet. Huis plakt aan de hele zin blijf van mijn lijf, niet aan lijf alleen.' }],
          note: 'Drie stappen uit de zinsbouw, de laatste uit de woordbouw. Pas in die laatste stap wordt het één woord, met streepjes als lijm.',
        },
      },
    ],
  },
  {
    kind: 'bet',
    id: 'kupado',
    prompt: 'Na twee minuten bidakupadotigolabu… hoort een baby twee losse stukken. Naar welk stuk luistert hij langer?',
    options: ['tigola', 'padoti', 'allebei even lang'],
    answer: 'tigola',
    why: 'Padoti kent hij al: een woord uit de stroom. Tigola loopt over een woordgrens (ti + gola) en is daardoor nieuw. Baby’s luisteren langer naar wat nieuw is; zo zag Saffran dat ze de woorden gevonden hadden.',
  },
  {
    kind: 'type',
    id: 'stroom',
    prompt: 'Elk woord van deze kunsttaal heeft drie lettergrepen. Hoeveel verschillende woorden (types) hoor je?',
    before: 'golabupadotigolabubidaku: types',
    after: '',
    hint: 'getal',
    answer: '3',
    why: 'golabu, padoti, golabu, bidaku: vier tokens, drie types. Wat steeds als vast blok terugkomt, is een goede kandidaat voor een woord.',
  },
  {
    kind: 'speed',
    id: 'groepwoord',
    prompt: 'Eén woord of twee?',
    intro: 'Soms zit een hele woordgroep in één woord. Soms is een vast begrip gewoon een woordgroep.',
    seconds: 40,
    items: [
      { a: 'blijf-van-mijn-lijf', b: 'huis', joined: true, tip: 'blijf-van-mijn-lijfhuis: een hele zin als eerste deel.' },
      { a: 'hoge', b: 'hoed', joined: false, tip: 'een hoge hoed: een vast begrip, maar een woordgroep.' },
      { a: 'kant-en-klaar', b: 'maaltijd', joined: true, tip: 'kant-en-klaarmaaltijd: de streepjes blijven, maaltijd plakt eraan.' },
      { a: 'hoge', b: 'druk', joined: false, tip: 'hoge druk: een gewone woordgroep.' },
      { a: 'hogedruk', b: 'gebied', joined: true, tip: 'hogedrukgebied: de groep hoge druk, in een samenstelling aaneen.' },
      { a: 'snelle', b: 'trein', joined: false, tip: 'een snelle trein: elke trein die hard rijdt.' },
      { a: 'snel', b: 'trein', joined: true, tip: 'sneltrein: een soort trein, met de klemtoon op snel.' },
      { a: 'doe-het-zelf', b: 'zaak', joined: true, tip: 'doe-het-zelfzaak: weer een woordgroep in een woord.' },
    ],
  },
  {
    kind: 'choice',
    id: 'hogedruk',
    prompt: 'Kies de goede spelling.',
    before: 'Het weerbericht meldt een',
    after: 'boven de Noordzee.',
    options: ['hogedrukgebied', 'hoge-drukgebied', 'hoge drukgebied'],
    answer: 'hogedrukgebied',
    why: 'Hoge druk is een woordgroep. Wordt die het eerste deel van een samenstelling, dan schrijf je alles aaneen: hogedrukgebied. Met een spatie zou het een gebied zijn dat zelf hoog is.',
  },
  {
    kind: 'swipe',
    id: 'eilanden',
    prompt: 'Klopt deze zin?',
    cards: [
      {
        t: 'In gewone spraak zit tussen elke twee woorden een pauze.',
        ok: false,
        fix: 'Meestal loopt de stroom gewoon door',
        why: 'Daarom moet een luisteraar zelf knippen, net als de baby’s van Saffran.',
      },
      {
        t: 'Baby’s van acht maanden kunnen woorden vinden door bij te houden welke lettergrepen samen voorkomen.',
        ok: true,
        why: 'Na twee minuten luisteren herkenden ze de woorden van de kunsttaal.',
      },
      {
        t: 'Volgens Postal wijst een voornaamwoord makkelijk naar een stuk binnen een woord.',
        ok: false,
        fix: 'Volgens Postal juist niet: woorden zijn anaforische eilanden',
        why: 'Hij is theedrinker, maar hij vindt hem te heet: hem als thee klinkt vreemd.',
      },
      {
        t: 'Ward, Sproat en McKoon vonden echte zinnen die toch naar een stuk in een woord verwijzen.',
        ok: true,
        why: 'Daarom zagen zij het als een kwestie van zichtbaarheid, niet als een harde regel.',
      },
      { t: 'In blijf-van-mijn-lijfhuis is het eerste deel een hele zin.', ok: true, why: 'Een gebiedende wijs met een voorzetselgroep.' },
      {
        t: 'Lieber zag woordgroepsamenstellingen als bewijs dat woordbouw en zinsbouw strikt gescheiden zijn.',
        ok: false,
        fix: 'Juist als bewijs dat ze niet strikt gescheiden zijn',
        why: 'De zinsbouw levert hier een stuk aan de woordbouw.',
      },
      {
        t: 'Een snelle trein is altijd een sneltrein.',
        ok: false,
        fix: 'Een snelle trein is elke trein die hard rijdt',
        why: 'Sneltrein is een soort trein, met de klemtoon op snel.',
      },
    ],
  },
];
