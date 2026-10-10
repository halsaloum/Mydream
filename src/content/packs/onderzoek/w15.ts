import type { StepInput } from '../../schema';

/** Onderzoek bij w15: lege plekken (Fillmore), de UTAH (Baker), werkwoorden van gevoel (Belletti en Rizzi) en be- als valentieoperatie. */
export const ONDERZOEK_W15: StepInput[] = [
  {
    kind: 'explain',
    id: 'onderzoek',
    title: 'Lege plekken, gespiegelde rollen en be-',
    panels: [
      {
        text: 'Een argument kan onzichtbaar zijn en toch meedoen. Charles Fillmore (1986) onderscheidde twee soorten lege plekken. Bij *Anna at* maakt het niet uit wat ze at: een *onbepaalde* lege plek. Bij *Anna won* moet de luisteraar weten wat ze won, de wedstrijd waar het net over ging: een *bepaalde* lege plek. En sommige werkwoorden laten hun lijdend voorwerp nooit vallen: *Anna verslond* is onaf.',
        rule: 'Wat wegblijft, doet toch mee: onbepaald (eten), bepaald (winnen) of helemaal niet weg te laten (verslinden).',
        lab: {
          label: 'Tik een zin en doe de toets: … maar ik weet niet wat',
          chips: [
            { k: 'Anna at.', out: 'onbepaald', note: 'Anna at, maar ik weet niet wat: geen probleem. Het maakt niet uit wat.' },
            { k: 'Anna won.', out: 'bepaald', note: 'Anna won, maar ik weet niet wat: raar. Wie dit zegt, hoort te weten welke wedstrijd.' },
            { k: 'Anna weigerde.', out: 'bepaald', note: 'Weigerde wat? Het aanbod uit het gesprek. Zonder context hangt de zin in de lucht.' },
            { k: 'Anna verslond.', out: 'mag niet weg', note: 'Verslinden laat zijn lijdend voorwerp nooit vallen: Anna verslond een boek.' },
          ],
        },
        deep: {
          q: 'Is een weggelaten argument dan een bepaling?',
          a: 'Nee. Een bepaling voegt iets toe; een weggelaten argument hoort bij het werkwoord en zit in de betekenis. Wie *Anna at* hoort, weet dat er iets gegeten is. Bij *Anna sliep* mis je niets. Daarom hoort het lijdend voorwerp bij de valentie van *eten*, ook als het vaak wegblijft.',
        },
      },
      {
        text: 'Hoe komen rollen op hun plek? Mark Baker (1988) stelde de *UTAH* voor, de *Uniformity of Theta Assignment Hypothesis*: dezelfde rol staat onderliggend altijd op dezelfde plek. Een thema hoort op de plek van het lijdend voorwerp. Dan moet *het glas* in *Het glas breekt* onderliggend lijdend voorwerp zijn, ook al staat het vooraan als onderwerp. Dat is precies de analyse van onaccusatieve werkwoorden (zie w16).',
        rule: 'UTAH: zelfde rol, zelfde onderliggende plek. Een thema als onderwerp is een verschoven lijdend voorwerp.',
        quiz: {
          q: 'Volgens de UTAH: waar begint ‘het ijs’ in ‘Het ijs smelt’?',
          options: ['Op de plek van het lijdend voorwerp', 'Op de plek van het onderwerp', 'In een bepaling'],
          answer: 'Op de plek van het lijdend voorwerp',
          why: 'Het ijs ondergaat het smelten: thema. In De zon smelt het ijs is het lijdend voorwerp. Zelfde rol, dus zelfde onderliggende plek.',
        },
      },
      {
        text: 'De zwaarste test voor de UTAH: werkwoorden van gevoel. In *Ik vrees onweer* is de ervaarder onderwerp, in *Onweer beangstigt me* lijdend voorwerp. Zelfde rollen, gespiegelde plekken. Adriana Belletti en Luigi Rizzi (1988) onderscheidden voor het Italiaans drie klassen: de ervaarder als onderwerp (*temere*, vrezen), als lijdend voorwerp (*preoccupare*, verontrusten) en als meewerkend voorwerp (*piacere*, bevallen). Hun redding van de UTAH: bij de tweede en derde klasse is het onderwerp een verschoven thema, net als bij een onaccusatief werkwoord.',
        rule: 'Ervaarder als onderwerp, als lijdend voorwerp of als meewerkend voorwerp: drie klassen, en het hulpwerkwoord verraadt de derde.',
        paradigm: {
          q: 'Waar staat de ervaarder, en welk hulpwerkwoord krijgt het werkwoord?',
          cols: ['ervaarder als…', 'hulpwerkwoord'],
          rows: [
            { label: 'vrezen: Ik vrees onweer.', cells: ['onderwerp', 'heeft'] },
            {
              label: 'irriteren: Lawaai irriteert me.',
              cells: [
                { fill: 'lijdend voorwerp', hint: 'Een passief kan: ik word erdoor geïrriteerd. Dat lukt alleen met een lijdend voorwerp.' },
                { fill: 'heeft', hint: 'Het lawaai heeft me geïrriteerd.' },
              ],
            },
            {
              label: 'bevallen: Dat boek bevalt me.',
              cells: [
                { fill: 'meewerkend voorwerp', hint: 'Een passief kan niet. Me is hier meewerkend voorwerp, net als bij piacere.' },
                { fill: 'is', hint: 'Dat boek is me goed bevallen.' },
              ],
            },
            {
              label: 'opvallen: Dat valt me op.',
              cells: [
                { fill: 'meewerkend voorwerp', hint: 'Dezelfde klasse als bevallen.' },
                { fill: 'is', hint: 'Het is me opgevallen.' },
              ],
            },
          ],
          extra: ['agens', 'wordt'],
          note: 'Vrezen en irriteren kiezen hebben. Bevallen en opvallen kiezen zijn, net als het Italiaanse piacere: mi è piaciuto. Het onderwerp gedraagt zich daar als een thema.',
        },
      },
      {
        text: 'Valentie kun je ook met een voorvoegsel verbouwen. *Ik plak posters op de muur* wordt *Ik beplak de muur met posters*. Het voorvoegsel *be-* maakt van de plaats het lijdend voorwerp; het oude lijdend voorwerp schuift naar een *met*-groep. Beth Levin (1993) zette zulke wisselingen voor het Engels op een rij: *load hay onto the truck* naast *load the truck with hay*. Er komt betekenis bij: wie de muur beplakt, plakt hem helemaal vol. Dat heet het *holistische effect*.',
        rule: 'be- maakt de plaats lijdend voorwerp, en dat lijdend voorwerp wordt helemaal geraakt.',
        swap: {
          goal: 'Maak de be-variant: de muur wordt lijdend voorwerp',
          blocks: ['met posters', 'Ik', 'de muur', 'beplak'],
          accept: ['Ik beplak de muur met posters'],
          note: 'De muur is nu lijdend voorwerp. Met posters mag zelfs weg: Ik beplak de muur. Zonder be- kan dat niet: Ik plak de muur is fout.',
        },
      },
    ],
  },
  {
    kind: 'sort',
    id: 'leeg',
    prompt: 'Wat voor lege plek heeft het werkwoord?',
    buckets: ['onbepaald: maakt niet uit wat', 'bepaald: de lezer moet weten wat', 'mag niet leeg blijven'],
    items: [
      { t: 'Anna leest.', b: 0 },
      { t: 'Hij kookt vanavond.', b: 0 },
      { t: 'Mijn oma breit.', b: 0 },
      { t: 'Ze heeft gewonnen.', b: 1 },
      { t: 'Hij weigerde.', b: 1 },
      { t: 'We hebben verloren.', b: 1 },
      { t: 'Hij verslond.', b: 2 },
      { t: 'Ze bereikte.', b: 2 },
      { t: 'Ik zette.', b: 2 },
    ],
    why: 'Lezen, koken, breien: wat precies, maakt niet uit. Winnen, weigeren, verliezen: de context zegt welke wedstrijd of welk aanbod. Verslinden, bereiken en zetten laten hun lijdend voorwerp nooit vallen.',
  },
  {
    kind: 'highlight',
    id: 'spiegel',
    prompt: 'Kleur ervaarder en oorzaak',
    intro: 'Drie zinnen, dezelfde twee rollen. Wie voelt iets, en wat roept het gevoel op? De werkwoorden laat je wit.',
    pens: [
      { id: 'ervaarder', label: 'ervaarder', tag: 'voelt', ask: 'Is dit wie iets voelt?', accent: 'teal' },
      { id: 'oorzaak', label: 'oorzaak', tag: 'roept op', ask: 'Is dit wat het gevoel oproept?', accent: 'orange' },
    ],
    words: [
      { t: 'Mijn', role: 'ervaarder' },
      { t: 'zus', role: 'ervaarder' },
      { t: 'vreest' },
      { t: 'onweer.', role: 'oorzaak' },
      { t: 'Onweer', role: 'oorzaak' },
      { t: 'beangstigt' },
      { t: 'mijn', role: 'ervaarder' },
      { t: 'zus.', role: 'ervaarder' },
      { t: 'Die', role: 'oorzaak' },
      { t: 'stilte', role: 'oorzaak' },
      { t: 'bevalt' },
      { t: 'haar', role: 'ervaarder' },
      { t: 'wel.' },
    ],
    done: {
      title: 'Gespiegeld',
      text: 'Bij vrezen staat de ervaarder vooraan als onderwerp, bij beangstigen en bevallen achteraan als voorwerp. Dezelfde rollen op andere plekken: precies het probleem dat Belletti en Rizzi oplosten.',
    },
  },
  {
    kind: 'fix',
    id: 'bevallen-is',
    prompt: 'Tik het foute woord aan en verbeter het.',
    sentence: 'Die cursus heeft me heel goed bevallen.',
    wrong: 2,
    answer: 'is',
    why: 'Bevallen hoort bij de klasse van piacere: de ervaarder is meewerkend voorwerp en het werkwoord kiest zijn. Die cursus is me heel goed bevallen.',
  },
  {
    kind: 'rewrite',
    id: 'beplanten',
    prompt: 'Maak de be-variant: de plaats wordt lijdend voorwerp.',
    source: 'Ze plant tulpen in de border.',
    accept: ['Ze beplant de border met tulpen.', 'De border beplant ze met tulpen.'],
    why: 'be- maakt van de border het lijdend voorwerp, en tulpen schuift naar een met-groep. Nu staat de hele border vol: het holistische effect.',
  },
  {
    kind: 'swipe',
    id: 'linking',
    prompt: 'Klopt deze zin?',
    cards: [
      {
        t: 'In Anna won maakt het niet uit wat ze won.',
        ok: false,
        fix: 'De luisteraar moet weten welke wedstrijd',
        why: 'Een bepaalde lege plek: de context vult hem in. Dat is het verschil met Anna at.',
      },
      { t: 'Verslinden kan zijn lijdend voorwerp niet missen.', ok: true, why: 'Anna verslond is onaf.' },
      {
        t: 'Volgens de UTAH begint het glas in Het glas breekt op de plek van het lijdend voorwerp.',
        ok: true,
        why: 'Zelfde rol als in Ik breek het glas, dus zelfde onderliggende plek.',
      },
      {
        t: 'Vrezen en beangstigen zetten de ervaarder op dezelfde plek.',
        ok: false,
        fix: 'Ze spiegelen: onderwerp tegenover lijdend voorwerp',
        why: 'Ik vrees onweer, maar onweer beangstigt me.',
      },
      { t: 'Bevallen kiest in de voltooide tijd zijn.', ok: true, why: 'De film is me bevallen, net als het Italiaanse mi è piaciuto.' },
      { t: 'In Ik beplak de muur met posters is de muur lijdend voorwerp.', ok: true, why: 'be- heeft de plaats tot lijdend voorwerp gemaakt.' },
      {
        t: 'Ik beplant de tuin zegt precies hetzelfde als ik plant iets in de tuin.',
        ok: false,
        fix: 'Beplanten zegt dat de hele tuin vol staat',
        why: 'Dat is het holistische effect van be-.',
      },
    ],
  },
];
