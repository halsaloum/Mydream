import type { StepInput } from '../../schema';

/** Onderzoek bij w18: een derde uitlegronde op onderzoeksniveau, daarna zwaardere oefeningen. */
export const ONDERZOEK_W18: StepInput[] = [
  {
    kind: 'explain',
    id: 'onderzoek',
    title: 'Meten, brokken, kleur en een woordgroep als lang woord',
    panels: [
      {
        text: 'PMI heeft een zwak punt. De verwachte frequentie van een paar is f(a) × f(b) ÷ N, en bij twee zeldzame woorden is dat bijna nul. Staan ze dan één keer toevallig samen, dan krijgt het paar een torenhoge score, hoger dan *sterke koffie*. Ted Dunning (1993) stelde daarom de *log-likelihood* voor, die meeweegt hoeveel bewijs er is, en Pavel Rychlý (2008) *logDice*, de maat van de Sketch Engine die niet van de corpusgrootte afhangt. Lexicografen kijken daarom naar meer dan één maat. Reken zelf na.',
        rule: 'verwacht = f(a) × f(b) ÷ N. PMI deelt waargenomen door verwacht en overschat daardoor zeldzame paren.',
        paradigm: {
          q: 'Vul in, bij een corpus van N = 1.000.000 woorden',
          cols: ['verwacht samen', 'waargenomen ÷ verwacht'],
          rows: [
            {
              label: 'sterke (2.000) + koffie (500), samen gezien: 80',
              cells: [
                { fill: '1', hint: '2.000 × 500 = 1.000.000, gedeeld door N = 1.' },
                { fill: '80', hint: '80 gedeeld door 1: tachtig keer vaker dan toeval.' },
              ],
            },
            {
              label: 'grote (10.000) + koffie (500), samen gezien: 5',
              cells: [
                { fill: '5', hint: '10.000 × 500 = 5.000.000, gedeeld door 1.000.000 = 5.' },
                { fill: '1', hint: '5 gedeeld door 5: precies wat toeval voorspelt. Geen collocatie.' },
              ],
            },
            {
              label: 'twee hapaxen (1 en 1), samen gezien: 1',
              cells: [
                { fill: '0,000001', hint: '1 × 1 gedeeld door 1.000.000.' },
                { fill: '1.000.000', hint: '1 gedeeld door 0,000001. Eén toevallige ontmoeting, en PMI roept: sterkste collocatie van het corpus.' },
              ],
            },
          ],
          extra: ['0,5', '400'],
          note: 'Sterke koffie: tachtig keer vaker dan toeval. Grote koffie: toeval. En twee hapaxen die één keer naast elkaar staan, winnen van allebei. Daarom corrigeren log-likelihood en logDice voor de hoeveelheid bewijs.',
        },
      },
      {
        text: 'John Sinclair (1991) zette twee principes tegenover elkaar. Volgens het *open-keuzeprincipe* kies je bij elk woord opnieuw uit alles wat de grammatica toelaat. Volgens het *idioomprincipe* grijp je naar voorgevormde brokken: *om een lang verhaal kort te maken*, *rekening houden met*, *in de loop van*. Britt Erman en Beatrice Warren (2000) telden na en vonden dat ruim de helft van gewone tekst uit zulke brokken bestaat. Alison Wray (2002) noemde dit *formulaic language*, en Kathy Conklin en Norbert Schmitt (2008) lieten zien dat lezers zulke brokken sneller verwerken, moedertaalsprekers én tweedetaalleerders. Wie vloeiend wil schrijven, leert dus geen losse woorden maar brokken.',
        rule: 'Idioomprincipe: veel tekst is voorgevormd. Brokken lees en schrijf je sneller dan losse woorden.',
        mark: {
          q: 'Tik elk woord dat bij een vaste brok hoort',
          sentence: 'Om een lang verhaal kort te maken: we hebben met alles rekening gehouden.',
          targets: [0, 1, 2, 3, 4, 5, 6, 9, 11, 12],
          note: 'Twee brokken. Om een lang verhaal kort te maken is één blok, er valt niets te kiezen. Rekening houden met is een brok met een open plek, waar alles in valt. Alleen we, hebben en alles koos de schrijver vrij.',
        },
        deep: {
          q: 'Is dat niet gewoon luiheid?',
          a: 'Nee, het is efficiëntie. Een brok die als geheel klaarligt, kost minder werkgeheugen dan dezelfde woorden stuk voor stuk bouwen. Daarom klinkt een tekst met goede brokken natuurlijk, en een tekst met alleen vrije keuzes vreemd, ook als elke zin grammaticaal klopt. Het verschil tussen *een besluit nemen* en *een besluit maken* is precies zo’n brok.',
        },
      },
      {
        text: 'Sommige woorden hebben een kleur die je pas in het corpus ziet. Het Engelse *set in* komt bijna alleen voor met narigheid: *rot set in*, *decay set in*. Bill Louw (1993) noemde dat *semantische prosodie*: een woord neemt de gevoelswaarde over van zijn vaste buren. Michael Stubbs (1995) liet hetzelfde zien voor *cause*, dat bijna altijd ellende veroorzaakt. Het Nederlands heeft zulke woorden ook. *Aanrichten* kan alleen schade, ravage en een bloedbad; *veroorzaken* neigt sterk naar problemen; *bevorderen* en *stimuleren* kleuren positief. Een tweedetaalleerder kent de betekenis maar niet de kleur, en schrijft dan *veel verbeteringen aangericht*.',
        rule: 'Semantische prosodie: de gevoelswaarde van een woord zit in zijn vaste buren. Aanrichten is altijd narigheid.',
        lab: {
          label: 'Tik een werkwoord en zie zijn buren',
          chips: [
            { k: 'aanrichten', out: 'schade · ravage · een bloedbad · verwoestingen', note: 'Alleen narigheid. Een feest aanrichten bestaat niet.' },
            {
              k: 'veroorzaken',
              out: 'problemen · vertraging · schade · een file',
              note: 'Overwegend negatief. Vreugde veroorzaken klinkt vreemd, al is het niet fout.',
            },
            { k: 'teweegbrengen', out: 'een verandering · een schok · een omslag', note: 'Neutraal: groot en ingrijpend, goed of slecht.' },
            {
              k: 'bevorderen',
              out: 'de gezondheid · de samenwerking · de doorstroming',
              note: 'Positief: je bevordert wat je wilt. Fraude bevorderen klinkt als een grap.',
            },
          ],
        },
        deep: {
          q: 'Is prosodie echt betekenis, of alleen statistiek?',
          a: 'Daar wordt over gestreden. Critici zoals Sam Whitsitt betwijfelen of een telling van buren een eigenschap van het woord zelf is; misschien beschrijft ze alleen waar mensen over praten. Voor een schrijver maakt dat weinig uit: *verbeteringen aanrichten* botst, wat de verklaring ook is. Een collocatiewoordenboek of een corpuszoekmachine laat de kleur in één oogopslag zien.',
        },
      },
      {
        text: 'Hoe zit een idioom in je hoofd? David Swinney en Anne Cutler (1979) vonden dat mensen een idioom sneller begrijpen dan dezelfde woorden in letterlijke zin: het ligt klaar als één lang woord, naast de gewone zinsbouw. Cristina Cacciari en Patrizia Tabossi (1988) verfijnden dat: het idioom springt pas tevoorschijn bij de *sleutel*, het woord waarna geen andere afloop meer waarschijnlijk is. Tot die sleutel bouw je gewoon zinsbouw. Beide waarheden zie je in de boom van *de pijp uitgaan*: de delen zijn gewone woordgroepen, het geheel is één opgeslagen eenheid met een eigen betekenis.',
        rule: 'Een idioom is syntactisch gebouwd maar lexicaal opgeslagen: een woordgroep die als één woord in je geheugen ligt.',
        bracket: {
          q: 'Bouw de pijp uitgaan van binnen naar buiten',
          tree: '[[de pijp] [uit gaan]]',
          words: true,
          nodes: [
            {
              w: 'de pijp',
              cat: 'naamwoordgroep',
              note: 'Lidwoord plus naamwoord: gewone zinsbouw. Letterlijk een pijp, maar in het idioom staat de pijp nergens voor.',
            },
            { w: 'uit gaan', form: 'uitgaan', cat: 'scheidbaar werkwoord', note: 'Partikel plus werkwoord: hij gaat uit, uitgaan. Ook dit is gewone bouw.' },
            {
              w: 'de pijp uit gaan',
              form: 'de pijp uitgaan',
              cat: 'idioom (één lexicale eenheid)',
              note: 'Pas hier ontstaat de betekenis doodgaan. Volgens Swinney en Cutler ligt dit geheel als één lang woord in je geheugen.',
            },
          ],
          traps: [{ w: 'pijp uit', note: 'Uit hoort bij gaan, niet bij pijp: uitgaan is een scheidbaar werkwoord.' }],
          note: 'Twee gewone groepen, één opgeslagen geheel. Omdat pijp nergens voor staat, kun je het idioom niet ombouwen: de pijp werd uitgegaan bestaat niet (zie de eerste uitleg).',
        },
      },
    ],
  },
  {
    kind: 'bet',
    id: 'hapax',
    prompt: 'Twee woorden komen elk één keer voor in een corpus van een miljoen woorden, toevallig naast elkaar. Wat zegt PMI?',
    options: ['Een sterkere collocatie dan sterke koffie', 'Ongeveer toeval', 'Een negatieve score'],
    answer: 'Een sterkere collocatie dan sterke koffie',
    why: 'Verwacht is 0,000001 en waargenomen 1: een miljoen keer vaker dan toeval. Dat is de zwakte van PMI: bij weinig bewijs schiet de score omhoog. Daarom wegen log-likelihood en logDice het bewijs mee.',
  },
  {
    kind: 'sort',
    id: 'prosodie',
    prompt: 'Welke kleur hebben de vaste buren van dit werkwoord?',
    buckets: ['overwegend negatief', 'neutraal of positief'],
    items: [
      { t: 'aanrichten', b: 0 },
      { t: 'veroorzaken', b: 0 },
      { t: 'in de hand werken', b: 0 },
      { t: 'oplopen (een boete, vertraging)', b: 0 },
      { t: 'uitlokken', b: 0 },
      { t: 'bevorderen', b: 1 },
      { t: 'stimuleren', b: 1 },
      { t: 'teweegbrengen', b: 1 },
      { t: 'bewerkstelligen', b: 1 },
      { t: 'leiden tot', b: 1 },
    ],
    why: 'Aanrichten, veroorzaken, in de hand werken, oplopen en uitlokken trekken narigheid aan: schade, fraude, een boete, kritiek. Bevorderen en stimuleren kleuren positief. Teweegbrengen, bewerkstelligen en leiden tot zijn neutraal en nemen de kleur van hun voorwerp over. Het is een neiging in het corpus, geen wet.',
  },
  {
    kind: 'choice',
    id: 'aangericht',
    prompt: 'Kies het werkwoord dat bij de kleur van de zin past.',
    before: 'De nieuwe regeling heeft veel verbeteringen',
    after: '.',
    options: ['opgeleverd', 'aangericht', 'veroorzaakt'],
    answer: 'opgeleverd',
    why: 'Aanrichten kan alleen narigheid en veroorzaken neigt daar sterk naar. Opleveren is neutraal en past bij verbeteringen. Elk woord apart is goed Nederlands; de combinatie beslist.',
  },
  {
    kind: 'highlight',
    id: 'brokken',
    prompt: 'Vaste brok of vrije keuze?',
    intro: 'Kleur elk woord: hoort het bij een voorgevormde brok, of koos de schrijver het vrij? Zo zie je het idioomprincipe in één zin.',
    pens: [
      { id: 'brok', label: 'vaste brok', tag: 'voorgevormd', ask: 'Hoort dit woord bij een vaste uitdrukking of collocatie?', accent: 'purple' },
      { id: 'vrij', label: 'vrije keuze', tag: 'open keuze', ask: 'Koos de schrijver dit woord vrij, uit alles wat de grammatica toelaat?', accent: 'slate' },
    ],
    words: [
      { t: 'Om', role: 'brok' },
      { t: 'een', role: 'brok' },
      { t: 'lang', role: 'brok' },
      { t: 'verhaal', role: 'brok' },
      { t: 'kort', role: 'brok' },
      { t: 'te', role: 'brok' },
      { t: 'maken:', role: 'brok' },
      { t: 'de', role: 'vrij' },
      { t: 'directie', role: 'vrij' },
      { t: 'hakte', role: 'brok' },
      { t: 'de', role: 'brok' },
      { t: 'knoop', role: 'brok' },
      { t: 'door', role: 'brok' },
      { t: 'en', role: 'vrij' },
      { t: 'nam', role: 'brok' },
      { t: 'afscheid', role: 'brok' },
      { t: 'van', role: 'brok' },
      { t: 'de', role: 'vrij' },
      { t: 'oude', role: 'vrij' },
      { t: 'software.', role: 'vrij' },
    ],
    done: {
      title: 'Veertien van de twintig woorden voorgevormd',
      text: 'Een uitdrukking (om een lang verhaal kort te maken), een idioom (de knoop doorhakken) en een collocatie (afscheid nemen van). Vrij gekozen waren alleen de directie, en, en de oude software. Zo ziet ruim de helft eruit.',
    },
  },
  {
    kind: 'swipe',
    id: 'vaste-buren',
    prompt: 'Klopt deze zin?',
    cards: [
      {
        t: 'PMI overschat paren van zeldzame woorden.',
        ok: true,
        why: 'Bij een verwachte frequentie van bijna nul schiet de score omhoog na één toevallige ontmoeting.',
      },
      {
        t: 'LogDice is de maat van de Sketch Engine en hangt niet af van de corpusgrootte.',
        ok: true,
        why: 'Rychlý (2008) ontwierp hem zo dat scores uit verschillende corpora vergelijkbaar blijven.',
      },
      {
        t: 'Volgens Erman en Warren bestaat maar een klein deel van gewone tekst uit vaste brokken.',
        ok: false,
        fix: 'Ruim de helft',
        why: 'Het idioomprincipe van Sinclair verklaart het grootste deel van een gewone tekst.',
      },
      {
        t: 'Conklin en Schmitt vonden dat alleen moedertaalsprekers vaste brokken sneller lezen.',
        ok: false,
        fix: 'Ook tweedetaalleerders lezen ze sneller',
        why: 'Het voordeel gold voor beide groepen. Brokken leren loont dus ook voor wie Nederlands leert.',
      },
      { t: 'Aanrichten combineer je alleen met narigheid.', ok: true, why: 'Schade, ravage, een bloedbad: dat is zijn semantische prosodie.' },
      {
        t: 'Swinney en Cutler vonden dat idiomen langzamer verwerkt worden dan letterlijke zinnen.',
        ok: false,
        fix: 'Sneller',
        why: 'Een idioom ligt klaar als één lang woord en hoeft niet opgebouwd te worden.',
      },
      {
        t: 'Volgens Cacciari en Tabossi herken je een idioom pas bij zijn sleutelwoord.',
        ok: true,
        why: 'Tot de sleutel bouw je gewone zinsbouw; daarna springt het idioom tevoorschijn.',
      },
    ],
  },
];
