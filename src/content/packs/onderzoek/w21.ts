import type { StepInput } from '../../schema';

/** Onderzoek bij w21: een derde uitlegronde op onderzoeksniveau, daarna zwaardere oefeningen. */
export const ONDERZOEK_W21: StepInput[] = [
  {
    kind: 'explain',
    id: 'onderzoek',
    title: 'Erfwoord of leenwoord: hoe weet je dat?',
    panels: [
      {
        text: 'Hoe weet een etymoloog dat *vader* een erfwoord is en *pater* een leenwoord, terwijl ze op hetzelfde oude woord teruggaan? Door de klanken. Het Germaans onderging een vaste klankverschuiving: een oude *p* werd *f*, een *t* werd *th*, een *k* werd *h*, een *d* werd *t*. Rasmus Rask zag dat in 1818, Jacob Grimm beschreef het in 1822, en sindsdien heet het de *wet van Grimm*. Erfwoorden hebben die verschuiving ondergaan. Leenwoorden kwamen pas daarna binnen en bleven ongeschonden.',
        rule: 'Klopt de klankverschuiving? Erfwoord. Klopt ze niet, terwijl de betekenis wel past? Waarschijnlijk geleend.',
        lab: {
          label: 'Tik een paar',
          chips: [
            { k: 'pater · vader', out: 'p → f', note: 'Het Engelse father laat de f nog zien. Het Nederlands schrijft hier een v.' },
            { k: 'tres · drie', out: 't → th → d', note: 'Het Engels bewaart de tussenstap: three.' },
            { k: 'cornu · hoorn', out: 'k → h', note: 'Ook centum en honderd: k werd h.' },
            { k: 'decem · tien', out: 'd → t', note: 'Ook duo en twee, dens en tand.' },
          ],
        },
      },
      {
        text: 'Daardoor heeft het Nederlands *doubletten*: hetzelfde oude woord twee keer, één keer geërfd en één keer geleend. *Vader* en *pater*, *hart* en *cordiaal*, *tien* en *decimaal*, *voet* en *pedaal*. Soms maakt een woord zelfs een rondreis. *Bank* (om op te zitten) is Germaans. Het Italiaans leende het als *banca*, de tafel van de geldwisselaar, en via het Frans kwam het als *bank* (voor geld) terug. Leg de voorwerpen in de goede bak.',
        rule: 'Doubletten: één wortel, twee wegen. Het erfwoord ging door de klankverschuiving, het leenwoord niet.',
        bins: {
          q: 'Erfwoord of leenwoord?',
          bins: ['erfwoord', 'leenwoord'],
          items: [
            { thing: 'huis', bin: 0, note: 'Germaans erfgoed: Engels house, Duits Haus.', hint: 'Hebben het Engels en het Duits hetzelfde woord van huis uit?' },
            { thing: 'zitbank', bin: 0, note: 'Deze bank is Germaans. Het Engelse bench is familie.', hint: 'De bank om op te zitten is het oude, Germaanse woord.' },
            { thing: 'mes', bin: 0, note: 'Een erfwoord. Het Duitse Messer is familie.', hint: 'Mes is een oud Germaans woord.' },
            { thing: 'ei', bin: 0, note: 'Germaans: Duits Ei.', hint: 'Ei is een van de oudste woorden die we hebben.' },
            { thing: 'munten', bin: 1, note: 'Munt komt van Latijn moneta, al vroeg geleend. Het Engelse mint komt er ook van.', hint: 'Munten leerden de Germanen van de Romeinen kennen, met het woord erbij.' },
            { thing: 'kasteel', bin: 1, note: 'Uit het Frans castel, van Latijn castellum. Het erfwoord voor zo’n gebouw is slot.', hint: 'Lijkt kasteel op het Latijnse castellum?' },
            { thing: 'geldbank', bin: 1, note: 'Uit het Italiaans banca, via het Frans. Dat Italiaanse woord kwam zelf uit het Germaans: een woord dat thuiskwam.', hint: 'De bank voor geld kwam via Italiaanse geldwisselaars binnen.' },
            { thing: 'pinguin', bin: 1, note: 'Een jong leenwoord uit de tijd van de grote zeereizen. Waar het woord oorspronkelijk vandaan komt, is onzeker.', hint: 'Kenden de Germanen pinguïns?' },
          ],
          note: 'Twee keer bank, twee keer een andere bak. Dezelfde vorm, maar de geldbank maakte een omweg langs Italië.',
        },
      },
      {
        text: 'Wat leent een taal het makkelijkst? Einar Haugen (1950) zag al dat zelfstandige naamwoorden voorop lopen. Het grote vergelijkende project *Loanwords in the World’s Languages* (Martin Haspelmath en Uri Tadmor, 2009), met een hoofdstuk over het Nederlands van Nicoline van der Sijs, bevestigde dat in tientallen talen: naamwoorden het meest, werkwoorden minder, functiewoorden het minst. Ook het Arabisch gaf ons, vaak via andere talen, vooral naamwoorden: *suiker*, *katoen*, *koffie*, *alcohol*, *algebra*, *cijfer*.',
        rule: 'Leenhiërarchie: zelfstandige naamwoorden eerst, functiewoorden het laatst.',
        mark: {
          q: 'Tik de leenwoorden uit het Engels',
          sentence: 'Na de meeting gaan we even chillen in de lounge, oké?',
          targets: [2, 6, 9, 10],
          note: 'meeting, chillen, lounge en oké. Alle lidwoorden, voorzetsels en voornaamwoorden zijn Nederlands gebleven: het geraamte van de zin leen je niet.',
        },
      },
      {
        text: 'Je kunt ook lenen zonder één vreemde klank over te nemen. Een *leenvertaling* vertaalt het bouwplan stuk voor stuk: *wolkenkrabber* uit *skyscraper*, *voetbal* uit *football*. Een *betekenisontlening* geeft een bestaand woord een nieuwe betekenis: *muis* voor het ding naast je toetsenbord, *controleren* in de zin van *beheersen*. En soms wordt een hele uitdrukking vertaald: *Dat maakt geen zin* naar *That makes no sense*. Dat laatste geldt nog als anglicisme; verzorgd is *Dat heeft geen zin* of *Dat is onlogisch*.',
        lab: {
          label: 'Tik een woord',
          chips: [
            { k: 'deadline', out: 'directe lening', note: 'Vorm en betekenis komen allebei uit het Engels.' },
            { k: 'wolkenkrabber', out: 'leenvertaling', note: 'Nederlandse stukken, Engels bouwplan: sky-scraper.' },
            { k: 'muis', out: 'betekenisontlening', note: 'Het woord is Nederlands, de nieuwe betekenis Engels.' },
            { k: 'Dat maakt geen zin', out: 'vertaalde uitdrukking', note: 'Uit That makes no sense. In verzorgd Nederlands: Dat heeft geen zin.' },
          ],
        },
      },
    ],
  },
  {
    kind: 'sort',
    id: 'grimm',
    prompt: 'Erfwoord of leenwoord uit het Latijn of Italiaans?',
    buckets: ['erfwoord (verschoven)', 'leenwoord (niet verschoven)'],
    items: [
      { t: 'tien', b: 0 },
      { t: 'decimaal', b: 1 },
      { t: 'twee', b: 0 },
      { t: 'duo', b: 1 },
      { t: 'drie', b: 0 },
      { t: 'trio', b: 1 },
      { t: 'voet', b: 0 },
      { t: 'pedaal', b: 1 },
      { t: 'hart', b: 0 },
      { t: 'cordiaal', b: 1 },
    ],
    why: 'Steeds een doublet. In de erfwoorden zie je de wet van Grimm: d werd t (tien, twee), t werd th en later d (drie), p werd f (voet), k werd h (hart). In de leenwoorden staan de oude klanken nog: d, t, p, k.',
  },
  {
    kind: 'ambiguity',
    id: 'controleren',
    prompt: 'Eén zin, twee betekenissen van controleren',
    intro: 'Kies een betekenis en zoek de zin die alleen dát kan betekenen.',
    sentence: 'Het team controleerde de wedstrijd.',
    meanings: [
      {
        id: 'nagaan',
        label: 'Nagaan of alles klopt (de oude betekenis)',
        highlight: ['controleerde'],
        right: 'Klopt. Achteraf iets nakijken: zo kwam het woord via het Frans binnen.',
      },
      {
        id: 'beheersen',
        label: 'De baas zijn over de wedstrijd (uit het Engels)',
        highlight: ['controleerde', 'de wedstrijd'],
        right: 'Klopt. Dit is een betekenisontlening van to control. In sporttaal is ze heel gewoon geworden.',
      },
    ],
    options: [
      { t: 'Het team controleerde de hele wedstrijd.', fits: null, note: 'Nog steeds allebei mogelijk: ook nakijken kan de hele wedstrijd duren.' },
      { t: 'De bond controleerde de wedstrijd achteraf op omkoping.', fits: 'nagaan' },
      { t: 'Het thuisteam controleerde de wedstrijd van begin tot eind en won met 4-0.', fits: 'beheersen' },
    ],
    done: {
      title: 'Een woord, twee leningen',
      text: 'Controleren kwam eerst uit het Frans (nakijken) en kreeg later uit het Engels een tweede betekenis (beheersen). Een leenwoord kan dus twee keer geleend worden.',
    },
  },
  {
    kind: 'chat',
    id: 'oom',
    prompt: 'App met je oom over leenwoorden',
    intro: 'Je oom ergert zich aan Engels in het Nederlands. Kies telkens het antwoord dat taalkundig klopt.',
    contact: { name: 'Oom Kees', role: 'je oom', initials: 'K' },
    rounds: [
      {
        say: 'Wolkenkrabber, dat is tenminste echt Nederlands!',
        options: ['Het is een leenvertaling van skyscraper: Nederlandse stukken, Engels bouwplan.', 'Klopt, dat hebben we helemaal zelf bedacht.', 'Nee, het komt uit het Duits.'],
        right: 0,
        fix: 'Een leenvertaling: wolken + krabber naar sky + scraper.',
        why: 'Geen vreemde klank, wel een geleend patroon. Ook dat is lenen.',
      },
      {
        say: 'Vroeger leenden we lang niet zoveel.',
        options: ['We leenden altijd al: straat en kaas uit het Latijn, plezier uit het Frans, suiker uit het Arabisch.', 'Dat klopt, Nederlands was vroeger zuiver.'],
        right: 0,
        fix: 'Lenen is zo oud als het contact tussen volken.',
        why: 'Elke laag van de woordenschat is een spoor van contact: Romeinen, Franse hoven, handel met de Arabische wereld.',
      },
      {
        say: 'En dan al die Engelse werkwoorden en lidwoorden die we overnemen!',
        options: [
          'Werkwoorden soms, lidwoorden bijna nooit: functiewoorden leen je het minst.',
          'Klopt, the en a worden steeds gewoner in het Nederlands.',
          'Werkwoorden lenen we nooit.',
        ],
        right: 0,
        fix: 'Naamwoorden het meest, functiewoorden het minst.',
        why: 'Dat is de leenhiërarchie. Geleende werkwoorden krijgen bovendien een Nederlands jasje: chillen, gechild.',
      },
      {
        say: 'Al dat Engels, dat maakt toch geen zin!',
        options: ['Haha, dat maakt geen zin is zelf een anglicisme. Verzorgd is: dat heeft geen zin.', 'Helemaal mee eens, dat maakt geen zin.'],
        right: 0,
        fix: 'Dat maakt geen zin → Dat heeft geen zin.',
        why: 'Een vertaalde uitdrukking uit That makes no sense. Je oom leent zelf ook.',
      },
    ],
    bye: 'Touché. Ik ga koffie zetten. Is dat soms ook geleend?',
  },
  {
    kind: 'bet',
    id: 'hierarchie',
    prompt: 'Welk soort woord neemt een taal het minst snel over uit een andere taal?',
    options: ['een lidwoord', 'een werkwoord', 'een zelfstandig naamwoord'],
    answer: 'een lidwoord',
    why: 'Functiewoorden zoals lidwoorden zitten diep in de grammatica en worden het minst geleend. Zelfstandige naamwoorden het meest: een nieuw ding vraagt een nieuw woord. En ja, koffie is geleend: via het Turks uit het Arabische qahwa.',
  },
  {
    kind: 'swipe',
    id: 'leen-onderzoek',
    prompt: 'Klopt deze zin?',
    cards: [
      { t: 'Vader en pater gaan terug op hetzelfde oude woord.', ok: true, why: 'Een doublet: vader is geërfd, pater is uit het Latijn geleend.' },
      {
        t: 'In een leenwoord uit het Latijn zie je de wet van Grimm.',
        ok: false,
        fix: 'Juist in erfwoorden zie je de wet van Grimm',
        why: 'Leenwoorden kwamen na de klankverschuiving binnen. Daarom heeft decimaal nog een d en tien een t.',
      },
      { t: 'Wolkenkrabber is een leenvertaling.', ok: true, why: 'Nederlandse stukken, gebouwd naar skyscraper.' },
      { t: 'De bank voor geld is via het Italiaans binnengekomen.', ok: true, why: 'Banca, de tafel van de geldwisselaar. Dat woord was zelf Germaans.' },
      {
        t: 'Functiewoorden worden het makkelijkst geleend.',
        ok: false,
        fix: 'Zelfstandige naamwoorden worden het makkelijkst geleend',
        why: 'Dat bleek uit Loanwords in the World’s Languages (2009).',
      },
      { t: 'Muis voor het computerding is een betekenisontlening.', ok: true, why: 'Het woord bestond al, de betekenis komt uit het Engels.' },
    ],
  },
];
