import type { LessonInput } from '../schema';

/**
 * Extra bachelorles voor "Het betekenisvolle woorddeel": woordvorming die niet met morfemen werkt,
 * zoals afkappen, letterwoorden en mengwoorden. Komt na `deel.ts`.
 */
export const DEEL_EXTRA_LESSONS: LessonInput[] = [
  {
    id: 'd19',
    stage: 'bachelor',
    domain: 'morf',
    also: ['orth'],
    title: 'Bieb, NAVO en brunch',
    skill: 'Woorden',
    icon: 'tv',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Woorden maken zonder morfemen',
        panels: [
          {
            text: 'Tot nu toe bouwde je woorden uit betekenisvolle stukken: *on-eet-baar*. Maar er bestaat ook woordvorming die zich niets van morfemen aantrekt. *Bieb* komt van *bibliotheek*, maar *bieb* is geen morfeem van dat woord: je hakt gewoon een stuk klank af. Dat heet *afkapping*.',
            rule: 'Afkapping: een stuk van een woord wordt een nieuw woord, zonder te letten op morfeemgrenzen.',
            lab: {
              label: 'Tik een afgekapt woord',
              chips: [
                { k: 'bieb', out: 'bibliotheek', note: 'Het begin blijft over, met een aangepaste spelling.' },
                { k: 'info', out: 'informatie', note: 'Het begin blijft over.' },
                { k: 'aso', out: 'asociaal', note: 'Het begin, eindigend op een klinker.' },
                { k: 'bus', out: 'omnibus', note: 'Hier bleef juist het eind over.' },
              ],
            },
            deep: {
              q: 'Waarom eindigen zoveel afkappingen op een klinker?',
              a: 'Kijk maar: *info*, *demo*, *aso*, *prof*... de meeste zijn een of twee lettergrepen lang, en vaak open. Morfologen zien daarin een *prosodische* mal: het nieuwe woord moet een bepaalde klankvorm hebben, niet een bepaalde betekenis. Dat sluit aan bij de les over prosodische morfologie.',
            },
          },
          {
            text: 'Bij een *letterwoord* neem je de beginletters. Spreek je ze letter voor letter uit, dan heet het een *initiaalwoord*: *pc*, *tv*, *btw*. Spreek je ze uit als een gewoon woord, dan een *acroniem*: *NAVO*, *havo*, *aids*. Neem je de eerste lettergrepen, dan krijg je een *lettergreepwoord*: *Benelux* uit *België*, *Nederland* en *Luxemburg*.',
            lab: {
              label: 'Tik een woord',
              chips: [
                { k: 'btw', out: 'bee-tee-wee', note: 'Initiaalwoord: letter voor letter.' },
                { k: 'NAVO', out: 'navo', note: 'Acroniem: je zegt het als een woord.' },
                { k: 'Benelux', out: 'Be + Ne + Lux', note: 'Lettergreepwoord: van elk woord de eerste lettergreep.' },
              ],
            },
          },
          {
            text: 'Voor de spelling van letterwoorden geldt een vaste regel. Is het een naam, dan hoofdletters: *NAVO*, *KLM*, *NS*. Is het een gewone soortnaam, dan kleine letters: *pc*, *tv*, *btw*, *havo*, *aids*. En het meervoud of verkleinwoord van een initiaalwoord krijgt een apostrof: *tv’s*, *pc’tje*.',
            rule: 'Letterwoord dat een naam is: hoofdletters (*NAVO*). Soortnaam: klein (*havo*, *pc*).',
            quiz: {
              q: 'Welke schrijfwijze volgt de regels?',
              options: ['Na de havo werkte ze bij de NAVO.', 'Na de HAVO werkte ze bij de Navo.', 'Na de Havo werkte ze bij de navo.'],
              answer: 'Na de havo werkte ze bij de NAVO.',
              why: 'havo is een soort opleiding: klein. NAVO is de naam van één organisatie: hoofdletters.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'soorten',
        prompt: 'Wat voor woordvorming is het?',
        buckets: ['afkapping', 'initiaalwoord', 'acroniem', 'lettergreepwoord'],
        items: [
          { t: 'prof', b: 0 },
          { t: 'pc', b: 1 },
          { t: 'NAVO', b: 2 },
          { t: 'Benelux', b: 3 },
          { t: 'demo', b: 0 },
          { t: 'btw', b: 1 },
          { t: 'havo', b: 2 },
          { t: 'bus (uit omnibus)', b: 0 },
        ],
        why: 'Afkapping: een stuk klank (prof, demo, bus). Initiaalwoord: letters uitgesproken (pc, btw). Acroniem: als woord uitgesproken (NAVO, havo). Lettergreepwoord: eerste lettergrepen (Benelux).',
      },
      {
        kind: 'type',
        id: 'volledig',
        prompt: 'Typ het volledige woord.',
        before: 'bieb is afgekapt uit',
        after: '.',
        hint: 'het volledige woord',
        answer: 'bibliotheek',
        why: 'bieb houdt het begin van bibliotheek, met ie voor de lange klank.',
      },
      {
        kind: 'rewrite',
        id: 'spelling',
        prompt: 'Zet de hoofdletters van de letterwoorden goed.',
        source: 'Na het VWO kocht ze een PC en vloog met de klm naar de vn in New York.',
        accept: ['Na het vwo kocht ze een pc en vloog met de KLM naar de VN in New York.'],
        why: 'vwo en pc zijn soortnamen: klein. KLM en VN zijn namen: hoofdletters.',
      },
      {
        kind: 'explain',
        id: 'verdieping',
        title: 'Mengwoorden en wat ze bewijzen',
        panels: [
          {
            text: 'Een *mengwoord* (Engels: *blend*) plakt het begin van het ene woord aan het eind van het andere. *Brunch* is *breakfast* + *lunch*, *motel* is *motor* + *hotel*, *smog* is *smoke* + *fog*, *vlog* is *video* + *blog*. Het Nederlands leende veel van zulke woorden, maar maakt ze ook zelf, vooral in reclame en op internet.',
            lab: {
              label: 'Tik een mengwoord',
              chips: [
                { k: 'brunch', out: 'br(eakfast) + (l)unch', note: 'Begin van het eerste, eind van het tweede.' },
                { k: 'motel', out: 'mo(tor) + (h)otel', note: 'Een hotel voor automobilisten.' },
                { k: 'vlog', out: 'v(ideo) + (b)log', note: 'Eén letter van het eerste woord is genoeg.' },
                { k: 'brexit', out: 'Br(itain) + exit', note: 'Werd zo productief dat later ook andere ‘-exits’ volgden.' },
              ],
            },
          },
          {
            text: 'Waar knip je bij een mengwoord? Onderzoek naar Engelse mengwoorden laat zien dat de knip vaak binnen een lettergreep valt, tussen de onset en de rijm: *br-* van *breakfast* met *-unch* van *lunch*. Ook hier is de lettergreepstructuur dus belangrijker dan de morfemen. En het mengwoord neemt vaak de klemtoon en lengte van het tweede woord over.',
            rule: 'Mengwoorden knippen vaak tussen onset en rijm, niet op een morfeemgrens.',
            quiz: {
              q: 'Waar valt de knip in brunch?',
              options: ['tussen de onset br- en de rijm -unch', 'op een morfeemgrens', 'midden in de klinker'],
              answer: 'tussen de onset br- en de rijm -unch',
              why: 'br is de onset van breakfast, unch de rijm van lunch.',
            },
          },
          {
            text: 'Waarom zijn deze processen interessant voor de theorie? In het klassieke beeld van de morfologie bestaat een woord uit morfemen, en woordvorming plakt morfemen aan elkaar. Afkapping en mengwoorden passen daar niet in: ze werken met klank, lettergrepen en letters. Daarom spreken sommige taalkundigen van *extragrammaticale morfologie*: woordvorming aan de rand van de grammatica, minder voorspelbaar, maar wel met eigen patronen.',
            quiz: {
              q: 'Waarom past afkapping niet in het klassieke beeld van de morfologie?',
              options: ['Het knipt in klank, niet op morfeemgrenzen', 'Het maakt geen nieuwe woorden', 'Het komt alleen in het Engels voor'],
              answer: 'Het knipt in klank, niet op morfeemgrenzen',
              why: 'bieb is geen morfeem van bibliotheek: het is een afgehakt stuk klank.',
            },
            deep: {
              q: 'Hoe voorspelbaar zijn die patronen?',
              a: 'Redelijk. Afkappingen zijn meestal een of twee lettergrepen lang. Mengwoorden worden zelden langer dan het langste brondeel. Initiaalwoorden krijgen het geslacht en de buiging van hun hoofdwoord: *de btw* omdat het *de belasting* is, *het vwo* omdat het *het onderwijs* is. Ook buiten de morfemen is taal dus niet chaotisch.',
            },
          },
        ],
      },
      {
        kind: 'choice',
        id: 'geslacht',
        prompt: 'Waarom zeg je ‘het vwo’ en niet ‘de vwo’?',
        before: '',
        after: '',
        options: ['Het hoofdwoord is het onderwijs', 'Alle letterwoorden zijn het-woorden', 'Omdat het op een o eindigt'],
        answer: 'Het hoofdwoord is het onderwijs',
        why: 'voorbereidend wetenschappelijk onderwijs: het laatste woord, onderwijs, is een het-woord. Zo is het ook de btw (de belasting).',
      },
      {
        kind: 'sort',
        id: 'meng-of-samenstelling',
        prompt: 'Mengwoord of samenstelling?',
        buckets: ['mengwoord', 'gewone samenstelling'],
        items: [
          { t: 'brunch', b: 0 },
          { t: 'fietspad', b: 1 },
          { t: 'smog', b: 0 },
          { t: 'vlog', b: 0 },
          { t: 'koffiekop', b: 1 },
          { t: 'motel', b: 0 },
          { t: 'zonnebril', b: 1 },
        ],
        why: 'Een samenstelling plakt hele woorden aan elkaar (fiets + pad). Een mengwoord neemt maar stukken klank van elk woord.',
      },
      {
        kind: 'choice',
        id: 'knip',
        prompt: 'Een nieuw mengwoord van ‘spoon’ en ‘fork’. Welke vorm volgt het patroon onset + rijm?',
        before: '',
        after: '',
        options: ['spork', 'spofork', 'foon', 'spoonfork'],
        answer: 'spork',
        why: 'De onset sp- van spoon met de rijm -ork van fork. Dit mengwoord bestaat echt.',
      },
      {
        kind: 'swipe',
        id: 'rand-waar',
        prompt: 'Klopt het?',
        intro: 'Veeg naar rechts als de zin klopt, naar links als hij niet klopt.',
        cards: [
          { t: 'bieb is een morfeem van bibliotheek.', ok: false, fix: 'het is een afgehakt stuk klank', why: 'Afkapping let niet op morfeemgrenzen.' },
          { t: 'NAVO is een acroniem omdat je het als een woord uitspreekt.', ok: true, why: 'Een initiaalwoord spreek je letter voor letter uit.' },
          { t: 'Het meervoud van tv is tvs.', ok: false, fix: 'tv’s', why: 'Initiaalwoorden krijgen een apostrof voor de uitgang.' },
          { t: 'Mengwoorden knippen vaak tussen onset en rijm.', ok: true, why: 'br-eakfast + l-unch.' },
          { t: 'Een soortnaam als havo schrijf je met hoofdletters.', ok: false, fix: 'met kleine letters', why: 'Alleen namen als NAVO krijgen hoofdletters.' },
          { t: 'Een initiaalwoord krijgt vaak het geslacht van zijn hoofdwoord.', ok: true, why: 'de btw (de belasting), het vwo (het onderwijs).' },
        ],
      },
    ],
  },
];
