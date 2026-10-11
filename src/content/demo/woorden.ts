import type { DemoItem } from './oefenvormen';

/**
 * De oefenvormen van de tab "Woorden", met één woord uit de woordenbank (draagvlak). In de tab maakt
 * de app deze stappen zelf uit de bank; hier staan ze los, zodat je ze in de galerij kunt proberen.
 */
export const WORD_DEMOS: DemoItem[] = [
  {
    slug: 'raad-eerst',
    title: 'Raad eerst',
    domain: 'sem',
    group: 'Woorden leren',
    step: {
      kind: 'guess',
      prompt: 'Wat betekent het woord volgens jou?',
      sentence: 'Het plan is goed, maar er is geen *draagvlak*: bijna niemand in het team wil eraan meewerken.',
      word: 'het draagvlak',
      options: [
        'Steun van de mensen die met een plan of besluit moeten werken, zodat ze het accepteren en uitvoeren.',
        'Het geld dat nodig is om een plan uit te voeren.',
        'De ruimte in een gebouw waar een team kan werken.',
        'Een stevige basis van regels en afspraken op papier.',
      ],
      answer: 'Steun van de mensen die met een plan of besluit moeten werken, zodat ze het accepteren en uitvoeren.',
      why: 'De zin zegt het al: bijna niemand wil meewerken, dus de steun ontbreekt.',
    },
  },
  {
    slug: 'woordkaart',
    title: 'Woordkaart',
    domain: 'sem',
    group: 'Woorden leren',
    step: {
      kind: 'word',
      word: 'draagvlak',
      article: 'het',
      pos: 'zelfstandig naamwoord',
      level: 'C1',
      theme: 'Besluiten nemen',
      grammar: 'het draagvlak, meestal zonder meervoud',
      meaning: 'Steun van de mensen die met een plan of besluit moeten werken, zodat ze het accepteren en uitvoeren.',
      examples: ['Zonder *draagvlak* in het team heeft de nieuwe werkwijze geen kans.', 'De directeur zocht eerst *draagvlak* bij de afdelingshoofden.'],
      collocations: ['draagvlak creëren', 'draagvlak zoeken voor iets', 'breed draagvlak', 'het draagvlak verliezen', 'er is geen draagvlak voor'],
      family: ['dragen', 'een gedragen besluit'],
      synonyms: ['steun', 'instemming'],
      contrast: { word: 'draagkracht', note: 'Draagkracht is hoeveel iemand aankan (geld, werk, zorgen). Draagvlak is steun voor een plan.' },
      tip: 'Een besluit met veel draagvlak heet ook een gedragen besluit.',
      think: 'Voor welk plan in jouw werk zou je eerst draagvlak moeten zoeken?',
    },
  },
  {
    slug: 'ophalen',
    title: 'Ophalen',
    domain: 'sem',
    group: 'Woorden leren',
    step: {
      kind: 'recall',
      prompt: 'Welk woord past hier?',
      clue: 'Steun van de mensen die met een plan of besluit moeten werken, zodat ze het accepteren en uitvoeren.',
      cue: 'd…',
      before: 'Door iedereen vroeg te betrekken, kreeg het plan een breed',
      after: '.',
      answers: ['draagvlak'],
      word: 'het draagvlak',
      why: 'Vaak samen met: draagvlak creëren, draagvlak zoeken voor iets, breed draagvlak.',
    },
  },
  {
    slug: 'denk-na',
    title: 'Denk na',
    domain: 'sem',
    group: 'Woorden leren',
    step: {
      kind: 'scene',
      prompt: 'Welk woord past precies?',
      situation: 'De medewerkers die met het nieuwe systeem moeten werken, staan erachter en willen het graag laten slagen. Er is dus veel …',
      options: ['draagvlak', 'draagkracht', 'mandaat', 'invloed'],
      answer: 'draagvlak',
      why: 'Steun bij de mensen die met een plan moeten werken, heet draagvlak. Draagkracht is wat iemand aankan, een mandaat is de bevoegdheid om te beslissen.',
    },
  },
  {
    slug: 'gebruik-het',
    title: 'Gebruik het',
    domain: 'sem',
    group: 'Woorden leren',
    step: {
      kind: 'use',
      prompt: 'Gebruik het in je eigen zin',
      situation: 'Je wilt vaste thuiswerkdagen invoeren. Wat zeg je in het overleg met je team?',
      targets: [{ word: 'draagvlak', forms: ['draagvlak'] }],
      minWords: 7,
      models: ['Voordat ik het voorstel indien, wil ik weten of er in het team *draagvlak* voor is.'],
      checks: [
        'Gaat je zin over steun voor een plan, en niet over wat iemand aankan?',
        'Gebruik je een vaste combinatie, zoals draagvlak zoeken, creëren of er is draagvlak voor?',
        'Past de toon bij een overleg met je team?',
      ],
    },
  },
];
