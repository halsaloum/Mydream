import type { StepInput } from '../schema';

/**
 * Demoset "Oefenvormen": de voorbeeldinhoud uit "Interactieve lessen – ideeën",
 * letterlijk overgenomen (teksten, items, uitleg), omgezet naar het inhoudscontract.
 *
 * Dit is GEEN cursusinhoud: deze stappen staan los van de niveaus, tellen niet mee in de
 * voortgang en verschijnen alleen op de pagina "Oefenvormen". Ze dienen als werkend
 * voorbeeld en testmateriaal voor elke oefenvorm, tot lessen uit de PDF's worden aangesloten.
 */
/** Groepen in de galerij, in deze volgorde. */
export const DEMO_GROUPS = [
  'Morfologie',
  'Syntaxis',
  'Semantiek',
  'Pragmatiek',
  'Overtuigen in één alinea',
  'Drogredenen herkennen',
  'Voor elk deel',
] as const;
export type DemoGroup = (typeof DEMO_GROUPS)[number];

export type DemoItem = {
  slug: string;
  title: string;
  /** Vakgebied voor de kleur en groepering in de galerij. */
  domain: string;
  group: DemoGroup;
  step: StepInput;
};

const open = 'Let op de spelling: open lettergreep, dus één e, en de s wordt een z.';
const stem = 'ik = alleen de stam';
const future = 'zullen + heel werkwoord';
const back = 'Het hele werkwoord schuift naar achteren.';
const comp = 'Een samenstelling schrijf je aan elkaar.';
const seg = (t: string, hi?: 0 | 1) => (hi ? { t, hi: true } : { t });

export const DEMO_ITEMS: DemoItem[] = [
  {
    slug: 'swipe-kaarten',
    title: 'Swipe-kaarten',
    domain: 'morf',
    group: 'Morfologie',
    step: {
      kind: 'swipe',
      prompt: 'Goed of fout geschreven?',
      intro: 'Veeg naar rechts als de zin klopt, naar links als er een fout in zit.',
      cards: [
        { t: 'Hij wordt morgen dertig.', ok: true, why: 'Hij loopt, dus stam + t.' },
        { t: 'Word jij ook moe van dit weer?', ok: true, why: 'Jij staat achter het werkwoord: de t valt weg.' },
        { t: 'Mijn broer houd niet van spruitjes.', ok: false, fix: 'houd → houdt', why: 'Mijn broer is hij. Hij loopt, dus stam + t.' },
        { t: 'Zij vindt het boek saai.', ok: true, why: 'Zij loopt, dus vind + t.' },
        { t: 'Wanneer vindt jij tijd om te sporten?', ok: false, fix: 'vindt → vind', why: 'Jij staat achter het werkwoord: geen t.' },
        { t: 'Ik word daar zo moe van.', ok: true, why: 'Ik krijgt alleen de stam: word.' },
      ],
    },
  },
  {
    slug: 'woordbouwer',
    title: 'Woordbouwer',
    domain: 'morf',
    group: 'Morfologie',
    step: {
      kind: 'morph',
      prompt: 'Bouw woorden met lees',
      intro: 'Plak een stukje ervoor of erachter. Niet alles past: elk stukje stelt een eis.',
      stem: 'lees',
      slots: [
        { id: 'pre', label: 'Ervoor', side: 'before', parts: ['on'] },
        { id: 's1', label: 'Erachter', side: 'after', parts: ['baar', 'er', 'ing'] },
        { id: 's2', label: 'Daarna', side: 'after', parts: ['heid'] },
      ],
      words: [
        { combo: ['', '', ''], w: 'lees', cls: 'ww', mean: 'De stam van lezen: ik lees.' },
        { combo: ['', 'baar', ''], w: 'leesbaar', cls: 'bn', mean: 'Goed te lezen. -baar maakt van een werkwoord een bijvoeglijk naamwoord.' },
        { combo: ['', 'baar', 'heid'], w: 'leesbaarheid', cls: 'zn', mean: 'Hoe goed iets te lezen is. -heid maakt er een zelfstandig naamwoord van.' },
        { combo: ['on', 'baar', ''], w: 'onleesbaar', cls: 'bn', mean: 'Niet te lezen. On- draait de betekenis om.' },
        { combo: ['on', 'baar', 'heid'], w: 'onleesbaarheid', cls: 'zn', mean: 'Het niet te lezen zijn. Vier stukjes, één woord.' },
        { combo: ['', 'er', ''], w: 'lezer', cls: 'zn', mean: `Iemand die leest. ${open}` },
        { combo: ['', 'ing', ''], w: 'lezing', cls: 'zn', mean: `Een voordracht voor publiek. ${open}` },
      ],
      forms: { '': 'lees', baar: 'leesbaar', er: 'lezer', ing: 'lezing' },
      hints: [
        { part: 'on', note: 'Dit woord bestaat niet. On- plakt aan een bijvoeglijk naamwoord, zoals leesbaar.' },
        { part: 'heid', note: 'Dit woord bestaat niet. -heid plakt aan een bijvoeglijk naamwoord, zoals leesbaar.' },
      ],
      goal: 5,
      done: { title: 'Vijf woorden uit één stam', text: 'Een achtervoegsel verandert de woordsoort. Daarom past niet elk stukje op elk woord.' },
    },
  },
  {
    slug: 'tijdschuif',
    title: 'Tijdschuif',
    domain: 'morf',
    group: 'Morfologie',
    step: {
      kind: 'timeline',
      prompt: 'Sleep door de tijd',
      intro: 'Schuif langs de tijdlijn en kijk hoe het werkwoord verandert.',
      stops: [
        { label: 'gisteren', sub: 'verleden', tense: 'Verleden tijd' },
        { label: 'net klaar', sub: 'voltooid', tense: 'Voltooide tijd' },
        { label: 'nu', sub: 'tegenwoordig', tense: 'Tegenwoordige tijd' },
        { label: 'morgen', sub: 'toekomst', tense: 'Toekomende tijd' },
      ],
      verbs: [
        {
          t: 'werken',
          cells: [
            { segs: [seg('Gisteren '), seg('werkte', 1), seg(' ik thuis.')], rule: 'stam + te', note: 'Werk eindigt op k. Die zit in ’t kofschip.' },
            { segs: [seg('Ik '), seg('heb', 1), seg(' thuis '), seg('gewerkt', 1), seg('.')], rule: 'hebben + ge + stam + t', note: 'De k zit in ’t kofschip, dus een t.' },
            { segs: [seg('Nu '), seg('werk', 1), seg(' ik thuis.')], rule: stem, note: 'Er komt geen uitgang bij.' },
            { segs: [seg('Morgen '), seg('zal', 1), seg(' ik thuis '), seg('werken', 1), seg('.')], rule: future, note: back },
          ],
        },
        {
          t: 'bellen',
          cells: [
            { segs: [seg('Gisteren '), seg('belde', 1), seg(' ik de huisarts.')], rule: 'stam + de', note: 'Bel eindigt op l. Die zit niet in ’t kofschip.' },
            { segs: [seg('Ik '), seg('heb', 1), seg(' de huisarts '), seg('gebeld', 1), seg('.')], rule: 'hebben + ge + stam + d', note: 'De l zit niet in ’t kofschip, dus een d.' },
            { segs: [seg('Nu '), seg('bel', 1), seg(' ik de huisarts.')], rule: stem, note: 'Er komt geen uitgang bij.' },
            { segs: [seg('Morgen '), seg('zal', 1), seg(' ik de huisarts '), seg('bellen', 1), seg('.')], rule: future, note: back },
          ],
        },
        {
          t: 'reizen',
          cells: [
            { segs: [seg('Gisteren '), seg('reisde', 1), seg(' ik naar Gent.')], rule: 'stam + de', note: 'Kijk naar de z van reizen: niet in ’t kofschip. Je schrijft wel een s.' },
            { segs: [seg('Ik '), seg('ben', 1), seg(' naar Gent '), seg('gereisd', 1), seg('.')], rule: 'zijn + ge + stam + d', note: 'De z van reizen zit niet in ’t kofschip, dus een d.' },
            { segs: [seg('Nu '), seg('reis', 1), seg(' ik naar Gent.')], rule: stem, note: 'Aan het eind van een woord wordt de z een s.' },
            { segs: [seg('Morgen '), seg('zal', 1), seg(' ik naar Gent '), seg('reizen', 1), seg('.')], rule: future, note: back },
          ],
        },
      ],
      done: { title: 'Vier tijden gezien!', text: 'De stam blijft staan. De uitgang en het hulpwerkwoord vertellen de tijd.' },
    },
  },
  {
    slug: 'snelrondje',
    title: 'Snelrondje',
    domain: 'morf',
    group: 'Morfologie',
    step: {
      kind: 'speed',
      prompt: 'Aan elkaar of los?',
      intro: 'Zoveel mogelijk goed in 20 seconden. De derde op rij telt dubbel, en elke volgende ook.',
      seconds: 20,
      items: [
        { a: 'bij', b: 'voorbeeld', joined: true },
        { a: 'per', b: 'ongeluk', joined: false },
        { a: 'hoofd', b: 'ingang', joined: true, tip: comp },
        { a: 'op', b: 'tijd', joined: false },
        { a: 'tweede', b: 'hands', joined: true },
        { a: 'zo', b: 'dat', joined: true, tip: 'Als voegwoord is het één woord.' },
        { a: 'ter', b: 'plekke', joined: false },
        { a: 'keuken', b: 'tafel', joined: true, tip: comp },
        { a: 'als', b: 'of', joined: true },
        { a: 'met', b: 'name', joined: false },
        { a: 'achter', b: 'af', joined: true },
        { a: 'tot', b: 'ziens', joined: false },
        { a: 'boven', b: 'dien', joined: true },
        { a: 'in ieder', b: 'geval', joined: false },
        { a: 'na', b: 'dat', joined: true, tip: 'Als voegwoord is het één woord.' },
        { a: 'zwem', b: 'bad', joined: true, tip: comp },
      ],
    },
  },
  {
    slug: 'zinstrein',
    title: 'Zinstrein',
    domain: 'syn',
    group: 'Syntaxis',
    step: {
      kind: 'train',
      prompt: 'Welk blok mag vooraan?',
      intro: 'Kies wat de zin opent en kijk wat de persoonsvorm doet.',
      blocks: [
        { id: 'S', t: 'ik', role: 'onderwerp' },
        { id: 'V', t: 'fiets', role: 'persoonsvorm' },
        { id: 'T', t: 'morgen', role: 'tijd' },
        { id: 'P', t: 'naar kantoor', role: 'plaats' },
      ],
      verb: 'V',
      fronts: [
        { block: 'S', order: ['S', 'V', 'T', 'P'], sentence: 'Ik fiets morgen naar kantoor.' },
        { block: 'T', order: ['T', 'V', 'S', 'P'], sentence: 'Morgen fiets ik naar kantoor.' },
        { block: 'P', order: ['P', 'V', 'S', 'T'], sentence: 'Naar kantoor fiets ik morgen.' },
      ],
      done: {
        title: 'Regel ontdekt!',
        text: 'De persoonsvorm blijft op plek 2. Staat er iets anders vooraan, dan springt het onderwerp erachter.',
      },
    },
  },
  {
    slug: 'markeerstiften',
    title: 'Markeerstiften',
    domain: 'syn',
    group: 'Syntaxis',
    step: {
      kind: 'highlight',
      prompt: 'Kleur de zinsdelen',
      intro: 'Kies een stift en tik de woorden aan die erbij horen.',
      pens: [
        { id: 'ond', label: 'onderwerp', tag: 'ond.', ask: 'Wie of wat doet het?', accent: 'blue' },
        { id: 'pv', label: 'persoonsvorm', tag: 'pv', ask: 'Welk werkwoord verandert mee met de tijd?', accent: 'red' },
        { id: 'tijd', label: 'tijd', tag: 'tijd', ask: 'Wanneer gebeurt het?', accent: 'yellow' },
        { id: 'plaats', label: 'plaats', tag: 'plaats', ask: 'Waar of waarheen?', accent: 'purple' },
      ],
      words: [
        { t: 'Vorige', role: 'tijd' },
        { t: 'week', role: 'tijd' },
        { t: 'reed', role: 'pv' },
        { t: 'mijn', role: 'ond' },
        { t: 'zus', role: 'ond' },
        { t: 'naar', role: 'plaats' },
        { t: 'Maastricht.', role: 'plaats' },
      ],
      done: {
        title: 'Alles gekleurd!',
        text: 'De tijd staat vooraan. Daarom komt het onderwerp pas na de persoonsvorm.',
        note: 'Vier kleuren, vier zinsdelen.',
      },
    },
  },
  {
    slug: 'voegwoord-duw',
    title: 'Voegwoord-duw',
    domain: 'syn',
    group: 'Syntaxis',
    step: {
      kind: 'conjunction',
      prompt: 'Waar landt de persoonsvorm?',
      intro: 'Kies een voegwoord en tik de plek aan waar regent hoort.',
      clause: { subject: 'het', verb: 'regent', rest: 'hard' },
      items: [
        { conj: 'want', type: 'neven', main: 'Ik blijf binnen,', why: 'Want verbindt twee hoofdzinnen. De persoonsvorm blijft op plek 2.' },
        { conj: 'omdat', type: 'onder', main: 'Ik blijf binnen,', why: 'Omdat maakt een bijzin. De persoonsvorm gaat naar het eind.' },
        { conj: 'maar', type: 'neven', main: 'Ik ga naar buiten,', why: 'Maar verbindt twee hoofdzinnen. De persoonsvorm blijft op plek 2.' },
        { conj: 'hoewel', type: 'onder', main: 'Ik ga naar buiten,', why: 'Hoewel maakt een bijzin. De persoonsvorm gaat naar het eind.' },
      ],
      done: {
        title: 'Twee soorten voegwoorden',
        text: 'Want en maar laten de zin met rust. Omdat en hoewel duwen de persoonsvorm naar het eind.',
      },
    },
  },
  {
    slug: 'zinstang',
    title: 'Zinstang',
    domain: 'syn',
    group: 'Syntaxis',
    step: {
      kind: 'clamp',
      prompt: 'Maak de tang korter',
      intro: 'De lezer moet te lang wachten op het tweede werkwoord. Verplaats zinsdelen tot de tang kort genoeg is. Laat niets weg.',
      subject: 'de gemeente',
      finite: 'heeft',
      participle: 'afgewezen',
      middle: [{ part: 'a' }, { part: 'b' }, { text: 'het plan' }, { part: 'c' }, { part: 'd' }],
      parts: [
        { id: 'a', t: 'gisteren', front: true, after: false },
        { id: 'b', t: 'na lang overleg', front: true, after: true, note: 'Een voorzetselgroep mag achter het laatste werkwoord staan. De tang wordt korter.' },
        { id: 'c', t: 'voor een nieuw fietspad', front: false, after: true, note: 'Een voorzetselgroep mag achter het laatste werkwoord staan. De tang wordt korter.' },
        { id: 'd', t: 'met een kleine meerderheid', front: true, after: true, note: 'Een voorzetselgroep mag achter het laatste werkwoord staan. De tang wordt korter.' },
      ],
      goal: 8,
      done: {
        title: 'Tang kort genoeg',
        text: 'De werkwoorden staan weer dicht bij elkaar. Dezelfde zin, maar de lezer hoeft niets te onthouden.',
      },
    },
  },
  {
    slug: 'verwijsdraad',
    title: 'Verwijsdraad',
    domain: 'sem',
    group: 'Semantiek',
    step: {
      kind: 'refs',
      prompt: 'Waar wijst het woord naar?',
      intro: 'Tik aan waar het gemarkeerde woord naar verwijst. Elke goede keuze spant een draad tussen twee zinnen.',
      text: 'Sanne kocht gisteren een nieuwe fiets. Die stond al weken in de etalage. Ze betaalde hem met haar spaargeld.',
      candidates: [
        { id: 'sanne', from: 0, to: 0 },
        { id: 'fiets', from: 3, to: 5 },
        { id: 'etalage', from: 11, to: 12 },
      ],
      refs: [
        { at: 6, to: 'fiets', ask: 'Wat stond al weken in de etalage?' },
        { at: 13, to: 'sanne', ask: 'Wie betaalde?' },
        { at: 15, to: 'fiets', ask: 'Wat betaalde ze met haar spaargeld?' },
      ],
      done: {
        title: 'Drie draden gespannen',
        text: 'Verwijswoorden haken zinnen aan elkaar. Zonder die haakjes moest je Sanne en de fiets steeds herhalen.',
        note: 'Die en hem wijzen naar de fiets, ze naar Sanne. Fiets is een de-woord: daarom die en hem.',
      },
    },
  },
  {
    slug: 'betekenisladder',
    title: 'Betekenisladder',
    domain: 'sem',
    group: 'Semantiek',
    step: {
      kind: 'ladder',
      prompt: 'Van nooit tot altijd',
      intro: 'Zet de woorden op de ladder, van zwak naar sterk. Begin onderaan.',
      sentence: { before: 'Ik kom', after: 'te laat op mijn werk.' },
      steps: [
        { t: 'nooit', days: 0 },
        { t: 'zelden', days: 1 },
        { t: 'soms', days: 3 },
        { t: 'vaak', days: 5 },
        { t: 'altijd', days: 7 },
      ],
      tray: ['vaak', 'nooit', 'altijd', 'soms', 'zelden'],
      low: 'zwakst',
      high: 'sterkst',
      startHint: 'Begin bij het zwakste woord. Welk woord betekent: geen enkele keer?',
      done: {
        title: 'Ladder compleet',
        text: 'Vijf woorden, vijf sterktes. Precies schrijven is de sport kiezen die klopt.',
        note: 'Soms en vaak lijken op elkaar, maar je baas hoort een groot verschil.',
      },
    },
  },
  {
    slug: 'twee-betekenissen',
    title: 'Twee betekenissen',
    domain: 'sem',
    group: 'Semantiek',
    step: {
      kind: 'ambiguity',
      prompt: 'Eén zin, twee plaatjes',
      intro: 'Wie heeft de verrekijker? Kies een plaatje en zoek de zin die alleen dát kan betekenen.',
      sentence: 'Ik zag de man met de verrekijker.',
      meanings: [
        {
          id: 'A',
          label: 'Ik heb de verrekijker',
          highlight: ['zag', 'met de verrekijker'],
          right: 'Klopt. De verrekijker staat nu vooraan, los van de man: alleen ik kan hem vasthouden.',
          image: { src: '/demo/verrekijker-ik.svg', alt: 'Ik kijk door de verrekijker naar de man' },
        },
        {
          id: 'B',
          label: 'De man heeft de verrekijker',
          highlight: ['de man met de verrekijker'],
          right: 'Klopt. Die een verrekijker bij zich had zit vast aan de man.',
          image: { src: '/demo/verrekijker-man.svg', alt: 'Ik kijk naar de man die een verrekijker vasthoudt' },
        },
      ],
      options: [
        { t: 'Gisteren zag ik de man met de verrekijker.', fits: null, note: 'Die zin kan nog steeds twee dingen betekenen. Er is alleen een woord bij gekomen.' },
        { t: 'Met de verrekijker zag ik de man.', fits: 'A' },
        { t: 'Ik zag de man die een verrekijker bij zich had.', fits: 'B' },
      ],
      done: {
        title: 'Twee zinnen, geen twijfel',
        text: 'Een zin wordt eenduidig als je laat zien welke woorden bij elkaar horen: door ze te verplaatsen of vast te maken.',
      },
    },
  },
  {
    slug: 'chat-scenario',
    title: 'Chat-scenario',
    domain: 'sem',
    group: 'Semantiek',
    step: {
      kind: 'chat',
      prompt: 'App je teamleider terug',
      intro: 'De twee antwoorden verschillen één woord. Kies het antwoord zonder fout.',
      contact: { name: 'Anouk', initials: 'A' },
      rounds: [
        {
          say: 'Hoi! Kun je morgen een uur eerder beginnen?',
          options: ['Ja, dat kan ik wel regelen.', 'Ja, dat ken ik wel regelen.'],
          right: 0,
          fix: 'ken → kan',
          why: 'Kunnen is: in staat zijn. Kennen is: weten wie of wat iets is.',
        },
        {
          say: 'Fijn! Neem je je laptop mee?',
          options: ['Zeker. Ligt jou oplader nog op kantoor?', 'Zeker. Ligt jouw oplader nog op kantoor?'],
          right: 1,
          fix: 'jou → jouw',
          why: 'Jouw is van jou: jouw oplader. Jou gebruik je na een voorzetsel: van jou, met jou.',
        },
        {
          say: 'Die ligt op mijn bureau. Kom je met de trein?',
          options: ['Ja, die is sneller dan de bus.', 'Ja, die is sneller als de bus.'],
          right: 0,
          fix: 'als → dan',
          why: 'Na sneller (vergrotende trap) komt dan. Als gebruik je bij even: even snel als.',
        },
      ],
      bye: 'Top. Tot morgen!',
    },
  },
  {
    slug: 'toonregelaar',
    title: 'Toonregelaar',
    domain: 'prag',
    group: 'Pragmatiek',
    step: {
      kind: 'tone',
      prompt: 'Draai aan de toon',
      intro: 'Je schrijft je huisbaas, meneer De Vries, over een lekkende kraan. Jullie kennen elkaar nauwelijks. Hoe formeel moet het zijn?',
      contact: { name: 'Meneer De Vries', initials: 'DV' },
      levels: [
        {
          name: 'straattaal',
          segs: [seg('Yo!', 1), seg(' Kraan lekt weer. '), seg('Fix je dat ff?', 1)],
          reply: 'Wie is dit? En wat betekent ff?',
          verdict: 'Te los. Zo app je een vriend, niet je huisbaas.',
          ok: false,
        },
        {
          name: 'los',
          segs: [seg('Hoi!', 1), seg(' De kraan in de keuken lekt weer. '), seg('Kun je', 1), seg(' even langskomen?')],
          reply: 'Eh… prima. Maar kennen wij elkaar zo goed?',
          verdict: 'Nog te los. Hoi en je passen bij mensen die je goed kent.',
          ok: false,
        },
        {
          name: 'netjes',
          segs: [seg('Beste meneer De Vries,', 1), seg(' de kraan in de keuken lekt weer. '), seg('Kunt u', 1), seg(' deze week langskomen?')],
          reply: 'Dag! Dank voor uw bericht. Donderdag kom ik langs.',
          verdict: 'Raak: beleefd en duidelijk.',
          ok: true,
        },
        {
          name: 'formeel',
          segs: [seg('Geachte heer De Vries,', 1), seg(' de keukenkraan lekt opnieuw. '), seg('Zou u', 1), seg(' deze week iemand '), seg('kunnen sturen?', 1)],
          reply: 'Dank voor uw melding. Donderdag stuur ik een loodgieter.',
          verdict: 'Raak: formeel en toch kort.',
          ok: true,
        },
        {
          name: 'plechtig',
          segs: [
            seg('Hooggeachte heer De Vries,', 1),
            seg(' '),
            seg('hierbij verzoek ik u', 1),
            seg(' vriendelijk doch dringend om '),
            seg('onverwijld zorg te dragen', 1),
            seg(' voor het herstel van de keukenkraan.'),
          ],
          reply: 'Zo plechtig hoeft het niet, hoor. Ik kom donderdag.',
          verdict: 'Te stijf. Zo schrijft bijna niemand meer.',
          ok: false,
        },
      ],
      start: 1,
      done: { title: 'Die toon past', text: 'Iemand die je nauwelijks kent spreek je aan met u en een nette aanhef. Plechtiger hoeft niet.' },
    },
  },
  {
    slug: 'zegt-en-bedoelt',
    title: 'Zegt en bedoelt',
    domain: 'prag',
    group: 'Pragmatiek',
    step: {
      kind: 'intent',
      prompt: 'Wat wil ze eigenlijk?',
      intro: 'Je collega Noor zegt iets. Kies het antwoord dat past bij wat ze bedoelt.',
      speaker: { name: 'Noor' },
      rounds: [
        {
          says: 'Heb jij een pen?',
          means: 'Mag ik je pen even lenen?',
          replies: ['Ja.', 'Ja, hier. Alsjeblieft.'],
          right: 1,
          literal: 'Je beantwoordt de vraag, maar ze vroeg niet of je een pen bezit.',
          why: 'De vorm is een vraag, de bedoeling een verzoek. Een goed antwoord doet wat er gevraagd wordt.',
        },
        {
          says: 'Het is hier wel koud, hè?',
          means: 'Kan het raam dicht?',
          replies: ['Ja, best koud.', 'Zal ik het raam dichtdoen?'],
          right: 1,
          literal: 'Je bent het met haar eens, maar het raam staat nog open.',
          why: 'Ze geeft geen weerbericht. Ze hoopt dat jij er iets aan doet.',
        },
        {
          says: 'Weet jij hoe laat de vergadering begint?',
          means: 'Zeg me hoe laat de vergadering begint.',
          replies: ['Om twee uur.', 'Ja, dat weet ik.'],
          right: 0,
          literal: 'Fijn dat je het weet. Maar nu weet zij het nog steeds niet.',
          why: 'Weet jij …? vraagt niet óf je het weet, maar wát je weet.',
        },
      ],
    },
  },
  {
    slug: 'alinea-stapel',
    title: 'Alinea-stapel',
    domain: 'prag',
    group: 'Pragmatiek',
    step: {
      kind: 'stack',
      prompt: 'Bouw je alinea',
      intro: 'Elke zin heeft een taak. Tik de zinnen aan in de volgorde waarin de lezer ze nodig heeft.',
      layers: [
        {
          role: 'Kernzin',
          ask: 'wat vind je?',
          question: 'Welke zin is de kernzin?',
          hint: 'Een kernzin zegt in één keer waar de alinea over gaat.',
          text: 'Fietsen naar je werk is de slimste keuze.',
        },
        {
          role: 'Uitleg',
          ask: 'waarom?',
          question: 'Welke zin is de uitleg?',
          hint: 'De uitleg geeft de reden. Welke zin zegt waarom?',
          text: 'Je beweegt elke dag, zonder er extra tijd voor vrij te maken.',
        },
        {
          role: 'Voorbeeld',
          ask: 'laat het zien',
          question: 'Welke zin is het voorbeeld?',
          hint: 'Zoek het signaalwoord voor een voorbeeld: zo, bijvoorbeeld, zoals.',
          text: 'Zo ben ik in twintig minuten op kantoor, terwijl de bus er veertig over doet.',
        },
        {
          role: 'Slotzin',
          ask: 'dus?',
          question: 'Welke zin is de slotzin?',
          hint: 'Een slotzin trekt de conclusie: daarom, dus, kortom.',
          text: 'Daarom laat ik de auto steeds vaker staan.',
        },
      ],
      done: { title: 'Alinea staat!', text: 'Kernzin, uitleg, voorbeeld, slotzin: zo weet de lezer steeds waar hij is.' },
    },
  },
  {
    slug: 'eindredactie',
    title: 'Eindredactie',
    domain: 'orth',
    group: 'Voor elk deel',
    step: {
      kind: 'proofread',
      prompt: 'Lees de mail na voordat hij weggaat',
      intro: 'Er zitten vijf fouten in. Tik een woord aan als het niet klopt.',
      header: { to: 'Karin de Wit', subject: 'Rapport voor de klant' },
      tokens: [
        { t: 'Gisteren' },
        { t: 'heb' },
        { t: 'ik' },
        { t: 'het' },
        { t: 'rapport' },
        { t: 'naar' },
        { t: 'de' },
        { t: 'klant' },
        { t: 'gestuurt.', fix: 'gestuurd.', why: 'Sturen: de r zit niet in ’t kofschip, dus een d.' },
        { t: 'Hij' },
        { t: 'reageerde' },
        { t: 'sneller' },
        { t: 'als', fix: 'dan', why: 'Na een vergrotende trap (sneller) komt dan.' },
        { t: 'ik' },
        { t: 'had' },
        { t: 'verwacht.' },
        { t: 'Hij' },
        { t: 'wilt', fix: 'wil', why: 'Hij wil. Het werkwoord willen krijgt bij hij geen t.' },
        { t: 'donderdag' },
        { t: 'een' },
        { t: 'afspraak,' },
        { t: 'bij' },
        { t: 'voorkeur' },
        { t: 'in' },
        { t: 'utrecht.', fix: 'Utrecht.', why: 'Een plaatsnaam krijgt een hoofdletter.' },
        { t: 'Kun' },
        { t: 'jij' },
        { t: 'dat' },
        { t: 'aan' },
        { t: 'Tim' },
        { t: 'door geven?', fix: 'doorgeven?', why: 'Doorgeven is één werkwoord. In de hele vorm schrijf je het aan elkaar.' },
      ],
    },
  },
  {
    slug: 'durf-je',
    title: 'Durf je?',
    domain: 'syn',
    group: 'Voor elk deel',
    step: {
      kind: 'bet',
      prompt: 'Welke zin klopt?',
      options: ['Ik blijf thuis, omdat ik ben ziek.', 'Ik blijf thuis, omdat ik ziek ben.'],
      answer: 'Ik blijf thuis, omdat ik ziek ben.',
      why: 'Omdat maakt een bijzin: de persoonsvorm ben gaat naar het eind.',
    },
  },
  {
    slug: 'dictee',
    title: 'Dictee',
    domain: 'orth',
    group: 'Voor elk deel',
    step: {
      kind: 'dictation',
      prompt: 'Luister en typ',
      intro: 'Je hoort één zin. Typ precies wat je hoort. Luisteren mag zo vaak als je wilt.',
      sentence: 'Mijn vrouw draagt een blauwe jas.',
      right: 'Mijn met een lange ij, vrouw met ou, blauwe met au. Je hoort het verschil niet; je moet het zien.',
      wrong: 'De rode woorden schreef je anders. Kijk naar ij, ou en au, en vergeet de hoofdletter en de punt niet.',
    },
  },
];
