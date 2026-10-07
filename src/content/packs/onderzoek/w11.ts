import type { StepInput } from '../../schema';

/** Onderzoek bij w11: een derde uitlegronde op onderzoeksniveau, daarna zwaardere oefeningen. */
export const ONDERZOEK_W11: StepInput[] = [
  {
    kind: 'explain',
    id: 'onderzoek',
    title: 'Geslacht als congruentie, en een brein dat vooruitloopt',
    panels: [
      {
        text: 'Waar zit het geslacht van *huis*? Niet in het woord zelf. Charles Hockett (1958) gaf de definitie die taalkundigen nog steeds gebruiken: geslachten zijn klassen van zelfstandige naamwoorden die je terugziet in het gedrag van de woorden eromheen. Je ziet het geslacht dus alleen via *congruentie*, aan woorden die meebuigen. Greville Corbett schreef er later het standaardwerk over, *Gender* (1991).',
        rule: 'Geslacht is onzichtbaar tot een ander woord meebuigt: het, dat, dit, welk, of de kale vorm in een groot huis.',
        mark: {
          q: 'Tik de drie woorden die verraden dat huis een het-woord is',
          sentence: 'We kochten een groot huis, en het huis dat ernaast staat is ook te koop.',
          targets: [3, 6, 8],
          note: 'groot zonder -e, het en dat. Een verraadt niets: een huis, een stoel. En staat en is buigen niet mee met het geslacht.',
        },
      },
      {
        text: 'Corbett (1979) zette de plekken waar een woord kan meebuigen op een rij: *attributief* (lidwoord, bijvoeglijk naamwoord), dan het *predicaat*, dan het *betrekkelijk voornaamwoord*, dan het *persoonlijk voornaamwoord*. Zijn voorspelling: hoe verder naar rechts, hoe groter de kans op congruentie naar betekenis, en nooit andersom. Het Nederlands heeft geen geslacht in het predicaat (*het meisje is lief*, *de jongen is lief*), maar de rest klopt: altijd *het meisje*, meestal *dat*, vaak *ze*. Hij toetste die rangorde aan een groot aantal talen.',
        rule: 'Lidwoord, betrekkelijk voornaamwoord, persoonlijk voornaamwoord: hoe verder naar rechts, hoe meer de betekenis kiest.',
        swap: {
          goal: 'Zet de plekken in de volgorde van Corbett, van grammatica naar betekenis',
          blocks: ['persoonlijk voornaamwoord', 'lidwoord', 'betrekkelijk voornaamwoord'],
          accept: ['lidwoord betrekkelijk voornaamwoord persoonlijk voornaamwoord'],
          note: 'het meisje: altijd grammatica. dat: meestal grammatica, in spreektaal soms die. ze: vaak betekenis.',
        },
        deep: {
          q: 'Wat voorspelt de hiërarchie over het meisje die?',
          a: 'In spreektaal hoor je soms *het meisje die*: betekenis op de plek van het betrekkelijk voornaamwoord. Dan voorspelt Corbett dat het persoonlijk voornaamwoord verderop ook de betekenis volgt: *ze*, niet *het*. De combinatie *het meisje die … het* zou de hiërarchie breken. In verzorgde taal blijft het overigens *het meisje dat*.',
        },
      },
      {
        text: 'Het Nederlands staat niet alleen. Het Duits houdt drie geslachten: *der Mann*, *die Frau*, *das Haus*. Het Zweeds deed wat het Nederlands deed: mannelijk en vrouwelijk vielen samen tot één *utrum*, tegenover het onzijdige *neutrum*. Het bepaald lidwoord staat er áchter het woord: *-en* of *-n* bij utrum, *-et* of *-t* bij neutrum, dus *mannen* is in het Zweeds gewoon ‘de man’. Het Afrikaans ging nog verder: *die* voor alles.',
        paradigm: {
          q: 'Vul de vormen in: drie, twee of één lidwoord?',
          cols: ['man', 'vrouw', 'huis'],
          rows: [
            { label: 'Duits', cells: ['der Mann', 'die Frau', 'das Haus'] },
            { label: 'Nederlands', cells: ['de man', 'de vrouw', { fill: 'het huis', hint: 'Huis is onzijdig: het.' }] },
            {
              label: 'Zweeds',
              cells: [
                'mannen',
                { fill: 'kvinnan', hint: 'Vrouw is utrum, net als man. Kvinna eindigt op een klinker, dus alleen -n.' },
                { fill: 'huset', hint: 'Huis is onzijdig: neutrum krijgt -et.' },
              ],
            },
            {
              label: 'Afrikaans',
              cells: [
                { fill: 'die man', hint: 'Het Afrikaans heeft één lidwoord voor alles: die.' },
                'die vrou',
                { fill: 'die huis', hint: 'Ook een onzijdig woord krijgt die: het Afrikaans heeft geen geslacht meer bij het lidwoord.' },
              ],
            },
          ],
          extra: ['kvinnat'],
          note: 'Duits drie, Nederlands en Zweeds twee, Afrikaans één. Het Nederlands en het Zweeds kwamen elk langs hun eigen weg bij hetzelfde systeem uit.',
        },
      },
      {
        text: 'Gebruikt je brein het geslacht om vooruit te lopen? Jos van Berkum en collega’s (2005) lieten Nederlandse proefpersonen korte verhalen horen waarin één woord heel voorspelbaar was, zoals *schilderij*. Vlak ervoor klonk een bijvoeglijk naamwoord dat wel of niet bij dat woord paste: *een groot …* of *een grote …*. Bij de vorm die niet paste, reageerde het brein al, nog vóór het zelfstandig naamwoord kwam. Luisteraars voorspellen dus een woord mét zijn geslacht, en de *-e* is het signaal (zie De -e die alles weet).',
        rule: 'Het geslacht is geen versiering: luisteraars gebruiken het om het volgende woord te voorspellen.',
        quiz: {
          q: 'Het verhaal maakt boekenkast heel voorspelbaar. Welke vorm laat het brein even schrikken?',
          options: ['een groot …', 'een grote …'],
          answer: 'een groot …',
          why: 'Een groot past alleen bij een het-woord. Boekenkast is een de-woord, dus het brein verwachtte een grote.',
        },
      },
    ],
  },
  {
    kind: 'sort',
    id: 'verraad',
    prompt: 'Verraadt dit woord of het zelfstandig naamwoord een de- of een het-woord is?',
    buckets: ['verraadt het geslacht', 'verraadt niets'],
    items: [
      { t: 'het in: het huis', b: 0 },
      { t: 'een in: een huis', b: 1 },
      { t: 'groot in: een groot huis', b: 0 },
      { t: 'grote in: een grote tafel', b: 0 },
      { t: 'grote in: het grote huis', b: 1 },
      { t: 'dat in: het huis dat daar staat', b: 0 },
      { t: 'mijn in: mijn huis', b: 1 },
      { t: 'deze in: deze tafel', b: 0 },
      { t: 'geen in: geen huis', b: 1 },
      { t: 'welk in: welk huis', b: 0 },
    ],
    why: 'Het, dat, deze en welk hebben een vorm per geslacht. Na een verraadt ook het bijvoeglijk naamwoord iets: kaal is het, met -e is de. Een, geen, mijn en de -e na het zijn voor beide gelijk.',
  },
  {
    kind: 'bet',
    id: 'hierarchie',
    prompt: 'Welke combinatie sluit de hiërarchie van Corbett uit?',
    options: [
      'Het meisje dat ik zag? Ze lachte.',
      'Het meisje dat ik zag? Het lachte.',
      'Het meisje die ik zag? Ze lachte.',
      'Het meisje die ik zag? Het lachte.',
    ],
    answer: 'Het meisje die ik zag? Het lachte.',
    why: 'Die volgt de betekenis, het daarna weer de grammatica: betekenis links, grammatica rechts. Precies wat de hiërarchie verbiedt. De andere drie passen erin (die alleen in spreektaal).',
  },
  {
    kind: 'type',
    id: 'frimsel',
    prompt: 'Een verzonnen woord. Welk lidwoord hoort erbij?',
    before: 'In een tekst staat: ‘een groot frimsel’. Dus:',
    after: 'frimsel.',
    hint: 'de of het',
    answer: 'het',
    why: 'Een groot, zonder -e: dat kan alleen bij een het-woord in het enkelvoud. Je kent het woord niet, maar de congruentie verraadt het geslacht. Precies wat Hockett bedoelde.',
  },
  {
    kind: 'highlight',
    id: 'twee-meesters',
    prompt: 'Grammatica of betekenis? Kleur de verwijswoorden',
    intro: 'Elk kleurbaar woord verwijst naar het meisje. Volgt het het lidwoord het, of het meisje als persoon?',
    pens: [
      { id: 'gram', label: 'grammatica', tag: 'volgt het', ask: 'Past dit woord bij het lidwoord het?', accent: 'blue' },
      { id: 'bet', label: 'betekenis', tag: 'volgt de persoon', ask: 'Past dit woord bij een meisje als persoon?', accent: 'pink' },
    ],
    words: [
      { t: 'Het', role: 'gram' },
      { t: 'kleine' },
      { t: 'meisje' },
      { t: 'dat', role: 'gram' },
      { t: 'daar' },
      { t: 'staat,' },
      { t: 'zoekt' },
      { t: 'haar', role: 'bet' },
      { t: 'fiets,' },
      { t: 'want' },
      { t: 'ze', role: 'bet' },
      { t: 'moet' },
      { t: 'naar' },
      { t: 'huis.' },
    ],
    done: {
      title: 'Van links naar rechts',
      text: 'Het en dat volgen de grammatica, haar en ze de persoon. Precies de volgorde van Corbett: dichtbij grammatica, verder weg betekenis.',
    },
  },
  {
    kind: 'swipe',
    id: 'congruentie',
    prompt: 'Klopt deze zin?',
    cards: [
      {
        t: 'Volgens Hockett zie je geslacht alleen aan woorden die meebuigen.',
        ok: true,
        why: 'Geslachten zijn klassen die je terugziet in het gedrag van woorden eromheen.',
      },
      {
        t: 'Het lidwoord een verraadt het geslacht.',
        ok: false,
        fix: 'Een past bij de- en het-woorden',
        why: 'een huis, een stoel. Pas het bijvoeglijk naamwoord erna verraadt iets.',
      },
      {
        t: 'Het persoonlijk voornaamwoord volgt eerder de betekenis dan het lidwoord.',
        ok: true,
        why: 'Het lidwoord staat links in de hiërarchie, het persoonlijk voornaamwoord rechts.',
      },
      {
        t: 'Het Zweedse mannen betekent hetzelfde als het Nederlandse mannen.',
        ok: false,
        fix: 'Mannen is in het Zweeds de man',
        why: 'Het bepaald lidwoord -en staat achter het woord.',
      },
      { t: 'Het Zweeds heeft net als het Nederlands twee geslachten.', ok: true, why: 'Utrum en neutrum: -en en -et.' },
      {
        t: 'Van Berkum en collega’s zagen pas een reactie in het brein bij het zelfstandig naamwoord zelf.',
        ok: false,
        fix: 'De reactie kwam al bij het bijvoeglijk naamwoord',
        why: 'Een groot of een grote verraadt het verwachte woord al.',
      },
      { t: 'Het Afrikaans heeft één lidwoord voor alle zelfstandige naamwoorden.', ok: true, why: 'die man, die vrou, die huis.' },
    ],
  },
];
