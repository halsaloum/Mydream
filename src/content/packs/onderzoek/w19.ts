import type { StepInput } from '../../schema';

/** Onderzoek bij w19: een derde uitlegronde op onderzoeksniveau, daarna zwaardere oefeningen. */
export const ONDERZOEK_W19: StepInput[] = [
  {
    kind: 'explain',
    id: 'onderzoek',
    title: 'Een rechte lijn, klonterende woorden en een staart zonder eind',
    panels: [
      {
        text: 'Zet de rang en de frequentie allebei op een *logaritmische* schaal (1, 10, 100, 1000), en de wet van Zipf wordt een *rechte lijn* die naar beneden loopt. De helling heet *α* (alfa). Bij α = 1 zakt de frequentie één stap van tien bij elke stap van tien in rang. In echte corpora wijkt de top af: de allerfrequentste woorden komen minder vaak voor dan de rechte lijn voorspelt. Benoît Mandelbrot (1953) loste dat op met een extra getal in de formule, dat de kop van de lijn afvlakt.',
        rule: 'Zipf op een dubbel-logaritmische schaal: een rechte lijn met helling −α.',
        paradigm: {
          q: 'Vul de rechte lijn in (α = 1)',
          cols: ['frequentie', 'log₁₀ van de frequentie'],
          rows: [
            { label: 'rang 1', cells: ['100.000', '5'] },
            { label: 'rang 10', cells: [{ fill: '10.000', hint: 'Tien keer zo ver in rang: 100.000 gedeeld door 10.' }, { fill: '4', hint: 'Tien tot de vierde is 10.000.' }] },
            { label: 'rang 100', cells: [{ fill: '1.000', hint: '100.000 gedeeld door 100.' }, { fill: '3', hint: 'Tien tot de derde is 1.000.' }] },
            { label: 'rang 1000', cells: [{ fill: '100', hint: '100.000 gedeeld door 1000.' }, { fill: '2', hint: 'Tien tot de tweede is 100.' }] },
          ],
          extra: ['50.000', '1'],
          note: 'De log zakt steeds precies één stap: 5, 4, 3, 2. Op papier met logaritmische assen wordt dat een rechte lijn met helling −1. 50.000 hoort bij rang 2, niet bij rang 10.',
        },
      },
      {
        text: 'Twee woorden kunnen even vaak voorkomen en toch heel anders verdeeld zijn. Stel: *hypotheek* staat dertig keer in één folder van de bank en verder bijna nergens, en *eerlijk* staat in dertig verschillende teksten één keer. Woorden *klonteren*: valt een zeldzaam woord één keer, dan komt het vaak snel terug. James Adelman, Gordon Brown en José Quesada (2006) lieten zien dat de *contextuele diversiteit*, het aantal teksten waarin een woord voorkomt, de herkenningssnelheid beter voorspelt dan de ruwe frequentie.',
        rule: 'Niet alleen hoe vaak, maar in hoeveel teksten: spreiding voorspelt herkenning beter dan frequentie.',
        quiz: {
          q: 'Twee woorden komen allebei 40 keer per miljoen woorden voor. A staat in 3000 films, B in 30. Welk woord herken je volgens Adelman en collega’s sneller?',
          options: ['A, het woord met de grootste spreiding', 'B, omdat het zo sterk klontert', 'Even snel, want de frequentie is gelijk'],
          answer: 'A, het woord met de grootste spreiding',
          why: 'Gelijke frequentie, ongelijke spreiding. Het woord dat in veel verschillende situaties opduikt, wint.',
        },
        deep: {
          q: 'Waarom zou spreiding meer zeggen dan frequentie?',
          a: 'Een woord dat je in veel verschillende situaties tegenkomt, heb je in een nieuwe situatie waarschijnlijk weer nodig. Je geheugen lijkt precies op die kans te gokken. Dertig keer *hypotheek* in één folder is eigenlijk één ontmoeting die dertig keer duurt. Daarom geven tellingen als SUBTLEX naast de frequentie ook het aantal films waarin een woord voorkomt.',
        },
      },
      {
        text: 'Wat frequent is, hangt af van de soort tekst. Douglas Biber (1988) telde tientallen kenmerken in Engelse gesprekken, brieven, nieuwsberichten en vakteksten. Zijn belangrijkste dimensie loopt van *betrokken* naar *informatief*. Gesprekken zitten vol *ik* en *jij*, werkwoorden als *denken* en *vinden*, vragen en samentrekkingen. Vakteksten zitten vol zelfstandige naamwoorden, lange woorden, voorzetsels en bijvoeglijke naamwoorden, met een hoge type-tokenverhouding. Een frequentielijst van gesprekken is dus een andere lijst dan een van vakteksten.',
        rule: 'Frequentie hangt aan het register: een gesprek en een vaktekst hebben elk hun eigen Zipf-lijst.',
        lab: {
          label: 'Tik een kenmerk',
          chips: [
            { k: 'ik en jij', out: 'betrokken', note: 'Spreker en luisteraar staan zelf in de tekst.' },
            { k: 'denken, vinden', out: 'betrokken', note: 'Biber noemde ze private werkwoorden: wat er in je hoofd gebeurt.' },
            { k: 'veel zelfstandige naamwoorden', out: 'informatief', note: 'Informatie wordt in naamwoordgroepen verpakt: de verwerking van de aanvragen.' },
            { k: 'lange woorden', out: 'informatief', note: 'Lange woorden zijn zeldzamer en preciezer. Zipf weer: wat vaak nodig is, is kort.' },
          ],
        },
      },
      {
        text: 'Hoe groeit de woordenschat van een tekst? De wet van Heaps uit de verdieping heeft een formule: *types = K × tokens^β*. Voor gewone tekst ligt β meestal tussen 0,4 en 0,6. Neem 0,5: dan geeft vier keer zoveel tekst maar twee keer zoveel types. Maar de groei stopt nooit. Hoe groot je corpus ook is, er komen nieuwe namen, samenstellingen en nieuwvormingen bij. Een Nederlandse telling groeit nog sneller, omdat elke aaneengeschreven samenstelling een nieuw type is (zie w7). Harald Baayen schreef over zulke verdelingen een heel boek: *Word Frequency Distributions* (2001).',
        rule: 'Heaps: de woordenschat groeit met tokens^β. Trager en trager, maar nooit tot stilstand.',
        quiz: {
          q: 'β = 0,5. Een tekst van 10.000 tokens heeft 2.000 types. Hoeveel types verwacht je bij 40.000 tokens?',
          options: ['ongeveer 4.000', 'ongeveer 8.000', 'ongeveer 2.000'],
          answer: 'ongeveer 4.000',
          why: '40.000 is vier keer zoveel tekst. Tot de macht 0,5 is de wortel: de wortel uit 4 is 2. Dus twee keer zoveel types.',
        },
      },
    ],
  },
  {
    kind: 'type',
    id: 'rang1000',
    prompt: 'Zipf met α = 1: het woord op rang 10 komt 5.000 keer voor. Hoe vaak verwacht je het woord op rang 1000?',
    before: 'Ongeveer',
    after: 'keer.',
    hint: 'getal',
    answer: '50',
    why: 'Rang 1000 ligt honderd keer zo ver als rang 10. Dan is het woord honderd keer zo zeldzaam: 5.000 gedeeld door 100 is 50. Op de rechte lijn: twee stappen van tien naar rechts, twee stappen naar beneden.',
  },
  {
    kind: 'highlight',
    id: 'heaps-live',
    prompt: 'Nieuw type of herhaling?',
    intro: 'Lees van links naar rechts. Is het woord nieuw in deze zin, of zag je het al eerder? Hoofdletters tellen niet mee.',
    pens: [
      { id: 'nieuw', label: 'nieuw type', tag: 'nieuw', ask: 'Komt dit woord hier voor het eerst?', accent: 'green' },
      { id: 'herhaling', label: 'herhaling', tag: 'al gezien', ask: 'Stond dit woord al eerder in de zin?', accent: 'slate' },
    ],
    words: [
      { t: 'De', role: 'nieuw' },
      { t: 'kat', role: 'nieuw' },
      { t: 'zag', role: 'nieuw' },
      { t: 'de', role: 'herhaling' },
      { t: 'hond', role: 'nieuw' },
      { t: 'en', role: 'nieuw' },
      { t: 'de', role: 'herhaling' },
      { t: 'hond', role: 'herhaling' },
      { t: 'zag', role: 'herhaling' },
      { t: 'de', role: 'herhaling' },
      { t: 'kat.', role: 'herhaling' },
    ],
    done: {
      title: 'Vijf types, elf tokens',
      text: 'Type-tokenverhouding: 5 gedeeld door 11, ongeveer 45 procent. Na het zesde woord kwam er niets nieuws meer bij. Zo ziet de wet van Heaps eruit in het klein: hoe langer je leest, hoe minder nieuwe types.',
    },
  },
  {
    kind: 'sort',
    id: 'register',
    prompt: 'Betrokken of informatief, volgens Biber?',
    buckets: ['betrokken (gesprek)', 'informatief (vaktekst)'],
    items: [
      { t: 'ik en jij', b: 0 },
      { t: 'denken, vinden, voelen', b: 0 },
      { t: 'vragen aan de lezer', b: 0 },
      { t: 'samentrekkingen als z’n en ’t', b: 0 },
      { t: 'eigenlijk, gewoon, best wel', b: 0 },
      { t: 'veel zelfstandige naamwoorden', b: 1 },
      { t: 'lange woorden', b: 1 },
      { t: 'veel voorzetsels', b: 1 },
      { t: 'bijvoeglijke naamwoorden vóór het zelfstandig naamwoord', b: 1 },
      { t: 'een hoge type-tokenverhouding', b: 1 },
    ],
    why: 'Betrokken taal draait om spreker, luisteraar en wat er in hun hoofd gebeurt. Informatieve taal pakt veel inhoud in naamwoordgroepen in, met veel verschillende woorden. Wil je een vaktekst leesbaarder maken, dan schuif je iets naar de betrokken kant.',
  },
  {
    kind: 'bet',
    id: 'spreiding',
    prompt: 'Een leerder leest één dik boek over zeilen en ziet het woord fok veertig keer. Een ander woord ziet hij ook veertig keer, maar verspreid over veertig teksten. Welk woord herkent hij later sneller, als Adelman en collega’s gelijk hebben?',
    options: ['het woord uit veertig teksten', 'fok, uit het zeilboek', 'allebei even snel'],
    answer: 'het woord uit veertig teksten',
    why: 'Gelijke frequentie, maar het tweede woord heeft veertig contexten en fok maar één. Contextuele diversiteit voorspelt herkenning beter dan ruwe frequentie. Gevarieerd lezen helpt dus meer dan één boek herlezen.',
  },
  {
    kind: 'swipe',
    id: 'zipf-onderzoek',
    prompt: 'Klopt deze zin?',
    cards: [
      { t: 'Op een dubbel-logaritmische schaal is de wet van Zipf een rechte lijn.', ok: true, why: 'Met helling −α, bij gewone tekst ongeveer −1.' },
      { t: 'Mandelbrot paste de formule aan, omdat de allerfrequentste woorden niet precies op de lijn liggen.', ok: true, why: 'Zijn extra getal laat de kop van de lijn afvlakken.' },
      {
        t: 'Twee woorden met dezelfde frequentie worden altijd even snel herkend.',
        ok: false,
        fix: 'Het aantal teksten waarin een woord voorkomt maakt verschil',
        why: 'Adelman, Brown en Quesada (2006): spreiding wint van ruwe frequentie.',
      },
      {
        t: 'Een gesprek heeft meestal een hogere lexicale dichtheid dan een vaktekst.',
        ok: false,
        fix: 'Een vaktekst heeft de hogere dichtheid',
        why: 'Bij Biber ligt de vaktekst aan de informatieve kant: veel zelfstandige naamwoorden en lange woorden.',
      },
      {
        t: 'Met β = 0,5 geeft twee keer zoveel tekst ook twee keer zoveel types.',
        ok: false,
        fix: 'Vier keer zoveel tekst geeft twee keer zoveel types',
        why: 'Tot de macht 0,5 is de wortel. Twee keer zoveel tekst geeft maar ongeveer 1,4 keer zoveel types.',
      },
      { t: 'Hoe groot een corpus ook is, er blijven nieuwe woorden bijkomen.', ok: true, why: 'De staart van Zipf heeft geen eind: namen, samenstellingen en nieuwvormingen.' },
    ],
  },
];
