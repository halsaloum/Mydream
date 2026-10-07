import type { StepInput } from '../../schema';

/** Onderzoek bij d16: een derde uitlegronde op onderzoeksniveau, daarna zwaardere oefeningen. */
export const ONDERZOEK_D16: StepInput[] = [
  {
    kind: 'explain',
    id: 'onderzoek',
    title: 'De maat op de proef',
    panels: [
      {
        text: 'De trochee verklaart *tafels* en *boeken*, maar hoe ver reikt hij? Drie randgevallen. Eén: *professor* eindigt beklemtoond (*pro-FES-sor*), dus je verwacht *-en*. Dat klopt, maar de klemtoon verhuist mee: *pro-fes-SO-ren*. Zo eindigt het woord tóch op een trochee. Een inheems woord kan dat niet: *ta-FE-len* zegt niemand, dus daar wint *-s*. Twee: woorden op een beklemtoonde *-ie* kiezen *-en*, met een trema (*industrieën*, *knieën*), maar woorden op *-é*, *-eau* of *-u* kiezen *-s* (*cafés*, *bureaus*, *menu’s*). Drie: bij *aardappels* en *aardappelen* bestaan beide vormen naast elkaar. De maat is een sterke voorkeur, geen wet.',
        rule: 'Na een zwakke lettergreep *-s*, na een sterke *-en*; de geleerde woorden op *-or* lossen het op door de klemtoon te verschuiven.',
        lab: {
          label: 'Tik een woord en zie het meervoud',
          chips: [
            {
              k: 'professor',
              out: 'professoren: pro-fes-SO-ren',
              note: 'De klemtoon schuift een plek op, zodat het woord weer op een trochee eindigt. Professors mag ook.',
            },
            { k: 'motor', out: 'motoren: mo-TO-ren', note: 'Zelfde recept. Ook motors bestaat: twee vormen voor één cel.' },
            { k: 'tafel', out: 'tafels: TA-fels', note: 'Hier kan de klemtoon niet schuiven: ta-FE-len is geen Nederlands. Dus -s.' },
            { k: 'industrie', out: 'industrieën', note: 'Beklemtoonde ie: -en, met een trema omdat ie en e botsen.' },
            { k: 'café', out: 'cafés', note: 'Beklemtoond, en toch -s: na een é, eau of u kiest het Nederlands geen -en.' },
            {
              k: 'aardappel',
              out: 'aardappels én aardappelen',
              note: 'Overvloed, zoals bij joeg en jaagde: twee vormen voor één cel. De maat voorspelt -s, de traditie bewaart -en.',
            },
          ],
        },
        deep: {
          q: 'Waarom schuift de klemtoon bij professoren?',
          a: 'Omdat het woord die beweging meebracht uit het Latijn: *professor*, meervoud *professōres*, met een lange, beklemtoonde *o*. Taalkundigen beschrijven dat als twee opgeslagen stamvormen, *proFESsor* en *profesSOR-*, net als de geleerde stam *nervos-* in *nervositeit* uit Inheems, geleerd en een paradox. Geen regel die ter plekke rekent, maar een allomorf die met het woord is meegeleend. Daarom kan *tafel* het trucje niet nadoen.',
        },
      },
      {
        text: 'Verdubbelen kan het Nederlands ook, maar anders dan het Ilokano. *Tiktak*, *zigzag*, *wirwar*, *mikmak*, *kriskras*: twee keer dezelfde medeklinkers, met een vaste klinkerwissel. En de volgorde ligt vast: eerst de *i*, dan de *a*. *Taktik* en *zagzig* klinken fout, zonder dat iemand je die regel ooit leerde. Het Engels (*tick-tock*, *chit-chat*) en het Duits (*Zickzack*, *Wirrwarr*) kennen precies hetzelfde patroon. Er is geen basiswoord (*zig* of *zag* bestaat niet los), dus het is geen afleiding. Het is een mal: een geraamte van medeklinkers met een vaste klinkermelodie, zoals *k-t-b* in het Arabisch.',
        rule: 'Klinkerwisselverdubbeling: zelfde medeklinkers, eerst *i*, dan *a* (*tiktak*, *zigzag*, *wirwar*).',
        mark: {
          q: 'Tik de vormen die Nederlandse oren accepteren',
          sentence: 'tiktak taktik zagzig zigzag wirwar warwir mikmak makmik',
          targets: [0, 3, 4, 6],
          note: 'tiktak, zigzag, wirwar, mikmak: steeds de i vóór de a. De omgekeerde vormen bestaan nergens, en ze voelen meteen verkeerd.',
        },
        deep: {
          q: 'Waarom i vóór a?',
          a: 'Een veelgenoemde verklaring: de klinker die vooraan in de mond zit (*i*) komt eerst, de klinker die lager of achterin zit (*a*, *o*) daarna, zoals in het Engelse *tic-tac-toe*. Het patroon maakt niet elke dag nieuwe woorden, maar het leeft: wie een nieuw klanknabootsend woord verzint, volgt het vanzelf. Daarom rekenen morfologen het tot de rand van de grammatica, naast de afkappingen en mengwoorden uit Bieb, NAVO en brunch.',
        },
      },
      {
        text: 'Er is nog een verdubbeling, en die is springlevend: *Is het een date-date, of gewoon koffie?* *Ik bedoel koffie-koffie, geen cappuccino.* *Ben je ziek-ziek of alleen moe?* Je herhaalt een heel woord, en de betekenis wordt smaller: het echte, typische geval. Jila Ghomeshi, Ray Jackendoff en collega’s beschreven dit in 2004 voor het Engels als *contrastive focus reduplication*, met *salad-salad* als beroemdste voorbeeld. Het Nederlands doet het net zo, met nadruk op het eerste deel. Een woordenboek heeft er geen ingang voor: de betekenis komt uit de constructie, niet uit het woord.',
        rule: 'Nadrukverdubbeling (*een date-date*) betekent: het echte, prototypische geval.',
        quiz: {
          q: 'Wat bedoelt iemand met: ‘Ik wil een boek-boek, geen e-book’?',
          options: ['Een echt, papieren boek: het prototype', 'Twee boeken', 'Een boek over boeken'],
          answer: 'Een echt, papieren boek: het prototype',
          why: 'De verdubbeling knipt de randgevallen weg. Dat sluit aan bij de prototypen uit Het woord: het midden van de categorie blijft over.',
        },
        deep: {
          q: 'Is dit morfologie of zinsbouw?',
          a: 'Daarover gaat het debat. Je kunt een woord verdubbelen (*Ik vind hem leuk, maar niet leuk-leuk*), maar in het Engels ook een groepje: *Do you like-him like him?* Dat kan een gewoon achtervoegsel niet. Ghomeshi en collega’s zien het daarom als een constructie op de grens van woord en zin: een verdubbelingsmal met een vaste betekenis. Precies het soort geval waarvoor Geert Booij zijn *Construction Morphology* (2010) bedacht.',
        },
      },
      {
        text: 'Iemand uit Groningen is een *Groninger*, niet een *Groningener*. Iemand uit Vlissingen een *Vlissinger*. Botsen twee gelijke lettergrepen, dan slikt het Nederlands er één in. Dat heet *haplologie*. Zo werd het Latijnse *tragicocomoedia* al bij de Romeinen *tragicomoedia*, ons *tragikomedie*, en *mineraal* plus *-logie* werd *mineralogie*. Taalkundigen doen het zelf ook: het vak dat morfologie en fonologie verbindt heet *morfonologie*, met één *fo* te weinig. Het is een prosodische eis, net als ∗LAPSE: niet twee keer hetzelfde stuk achter elkaar.',
        rule: 'Haplologie: van twee gelijke lettergrepen op een rij blijft er één over (*Groning-en-er* wordt *Groninger*).',
        build: {
          before: 'Iemand uit Scheveningen is een…',
          stem: 'Schevening',
          endings: ['er', 'ener', 'enaar'],
          answer: 'er',
          note: 'Scheveninger: -ingen plus -er zou twee keer bijna dezelfde lettergreep geven. Eén keer is genoeg.',
        },
        deep: {
          q: 'Werkt haplologie ook in de spelling?',
          a: 'Niet altijd. In de uitspraak laten veel mensen een lettergreep vallen (*eigenlijk* klinkt vaak als *eik*), maar de spelling houdt het hele woord. Alleen waar de korte vorm hét woord werd, zoals *Groninger* en *tragikomisch*, zie je de haplologie ook op papier. Bij *antwoordde* en *verbreedde* schrijf je juist twee keer *d*: daar botsen geen lettergrepen, maar de stam en de uitgang, en die moet je allebei kunnen zien.',
        },
      },
    ],
  },
  {
    kind: 'sort',
    id: 'patronen',
    prompt: 'Welk prosodisch patroon zit erin?',
    buckets: ['klinkerwissel', 'rijm', 'nadruk', 'haplologie'],
    items: [
      { t: 'tiktak', b: 0 },
      { t: 'wirwar', b: 0 },
      { t: 'kriskras', b: 0 },
      { t: 'holderdebolder', b: 1 },
      { t: 'roezemoezen', b: 1 },
      { t: 'harrewarren', b: 1 },
      { t: 'een date-date', b: 2 },
      { t: 'koffie-koffie', b: 2 },
      { t: 'Groninger', b: 3 },
      { t: 'morfonologie', b: 3 },
    ],
    why: 'Klinkerwissel: zelfde medeklinkers, eerst i, dan a. Rijm: andere beginklank, zelfde rest (holder-bolder, roeze-moeze, harre-warre). Nadruk: een heel woord herhaald voor het typische geval. Haplologie: een dubbele lettergreep weggeslikt.',
  },
  {
    kind: 'type',
    id: 'wageninger',
    prompt: 'Typ de inwonernaam.',
    before: 'Iemand uit Wageningen is een',
    after: '.',
    hint: 'let op de dubbele lettergreep',
    answer: 'Wageninger',
    why: 'Wageningen plus -er zou Wageningener geven: twee keer bijna dezelfde lettergreep. Haplologie laat er één vallen: Wageninger.',
  },
  {
    kind: 'ambiguity',
    id: 'huis-huis',
    prompt: 'Eén zin, twee soorten huis',
    intro: 'Kies een betekenis en zoek de zin die alleen dát kan betekenen. Let op wat verdubbeling doet.',
    sentence: 'Ze hebben eindelijk een huis gekocht.',
    meanings: [
      {
        id: 'proto',
        label: 'Een echt huis: vrijstaand, met een dak en een tuin',
        highlight: ['een huis'],
        right: 'Klopt. De verdubbeling huis-huis snijdt de randgevallen weg: alleen het prototype blijft over.',
      },
      {
        id: 'ruim',
        label: 'Een woning, wat voor soort ook',
        highlight: ['een huis'],
        right: 'Klopt. Zonder verdubbeling is huis ruim: ook een flat telt mee.',
      },
    ],
    options: [
      { t: 'Ze hebben eindelijk een huis-huis gekocht, met een tuin en een zolder.', fits: 'proto' },
      { t: 'Ze hebben eindelijk een huis gekocht: een appartement op de derde verdieping.', fits: 'ruim' },
      { t: 'Ze hebben eindelijk een huis gekocht in Utrecht.', fits: null, note: 'Nog steeds allebei mogelijk: er kwam alleen een plaats bij.' },
    ],
    done: {
      title: 'Verdubbelen is versmallen',
      text: 'Huis-huis betekent niet twee huizen, maar het typische huis. Nadrukverdubbeling werkt als een vergrootglas op het midden van de categorie.',
    },
  },
  {
    kind: 'bet',
    id: 'plantastrie',
    prompt: 'Een verzonnen vak: de ‘plantastrie’, met de klemtoon op -trie. Wat is het meervoud?',
    options: ['plantastrieën', 'plantastries', 'plantastrieen'],
    answer: 'plantastrieën',
    why: 'Beklemtoonde ie: -en, net als industrieën en melodieën. En omdat ie en e botsen, komt er een trema op de e.',
  },
  {
    kind: 'swipe',
    id: 'maat-waar',
    prompt: 'Klopt deze zin?',
    cards: [
      {
        t: 'Professoren heeft de klemtoon op dezelfde lettergreep als professor.',
        ok: false,
        fix: 'De klemtoon schuift naar so: pro-fes-SO-ren',
        why: 'Zo eindigt het meervoud weer op een trochee.',
      },
      { t: 'Cafés eindigt beklemtoond en kiest toch -s.', ok: true, why: 'Na é, eau en u kiest het Nederlands geen -en.' },
      {
        t: 'Zagzig is een even goed Nederlands woord als zigzag.',
        ok: false,
        fix: 'Alleen zigzag bestaat',
        why: 'Bij klinkerwisselverdubbeling komt de i vóór de a.',
      },
      {
        t: 'Zig is het basiswoord van zigzag.',
        ok: false,
        fix: 'Er is geen basiswoord',
        why: 'De mal bestaat uit medeklinkers plus een vaste klinkermelodie, zonder los stuk.',
      },
      { t: 'Een koffie-koffie is het typische geval van koffie.', ok: true, why: 'Nadrukverdubbeling versmalt de betekenis tot het prototype.' },
      { t: 'Groninger is ontstaan door haplologie.', ok: true, why: 'Groningen plus -er, met één lettergreep ingeslikt.' },
      {
        t: 'Aardappels is fout, het moet aardappelen zijn.',
        ok: false,
        fix: 'Allebei goed',
        why: 'Twee vormen voor één cel: overvloed. De maat voorspelt -s, de traditie houdt -en.',
      },
    ],
  },
];
