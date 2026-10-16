import { diagnosis, segmentation, tokens } from './helpers';
import { reviewedDebugger } from './debugger-review';
import type { DebugExercise, SentenceLesson, SentenceRule } from './types';

const lessonId = (number: number) => `zinnen-${String(number).padStart(2, '0')}`;
const ruleId = (number: number, rule: number) => `${lessonId(number)}-regel-${rule}`;

function rule(number: number, index: number, when: string, then: string, nuance: string, sourceIds: string[]): SentenceRule {
  return { id: ruleId(number, index), when, then, nuance, sourceIds };
}

function arena(number: number, index: number, rule: number, prompt: string, explanation: string, hint: string, groups?: string[]) {
  return {
    id: `${lessonId(number)}-arena-${index}`,
    support: index <= 3 ? 'volledig' as const : 'half' as const,
    ruleId: ruleId(number, rule),
    prompt,
    explanation,
    hint,
    ...(groups ? { segmentation: segmentation(groups) } : {}),
  };
}

function debug(number: number, index: number, rule: number, sentence: string, targets: number[], instruction: string, repairs: string[], explanation: string, hint: string): DebugExercise {
  return reviewedDebugger({
    id: `${lessonId(number)}-debugger-${index}`,
    kind: 'debug',
    support: 'zelfstandig',
    ruleId: ruleId(number, rule),
    prompt: sentence,
    tokens: tokens(sentence),
    targets: targets.map((target) => `w${target}`),
    instruction,
    repairs,
    explanation,
    hint,
  });
}

export const foundationLessons: SentenceLesson[] = [
  {
    id: 'zinnen-01',
    number: 1,
    title: 'Woorden bouwen groepen: waar begint een zinsdeel?',
    teaser: 'Zie de kern, houd de bijbehorende woorden bij elkaar en test hele blokken.',
    minutes: 18,
    objectives: [
      'Een naamwoordgroep met voor- en nabepalingen als één geheel herkennen.',
      'Verplaatsing, vervanging en een vraag gebruiken als samenwerkende zinsdeelproeven.',
      'Een bepaling binnen een woordgroep onderscheiden van informatie over de hele gebeurtenis.',
    ],
    discovery: {
      question: 'Wat verhuist er mee als je vertelt waarover de leerling las?',
      variants: [
        {
          id: 'onderwerp-eerst', label: 'Begin met de leerling',
          sentence: 'De nieuwsgierige leerling leest een dik boek over taal.',
          note: 'Leerling is de kern van het onderwerp. Boek is de kern van het andere naamwoordblok; over taal vertelt welk soort boek het is.',
          blocks: [
            { text: 'De nieuwsgierige leerling', role: 'naamwoordgroep · onderwerp', accent: 'blue' },
            { text: 'leest', role: 'persoonsvorm', accent: 'orange' },
            { text: 'een dik boek over taal', role: 'naamwoordgroep · voorwerp', accent: 'green' },
          ], scene: 'classroom',
        },
        {
          id: 'boek-eerst', label: 'Begin met het hele boekblok',
          sentence: 'Een dik boek over taal leest de nieuwsgierige leerling.',
          note: 'Het hele boekblok schuift naar voren. De persoonsvorm blijft na één zinsdeel staan; de leerling volgt. Deze volgorde benadrukt het boek en vraagt een passende context.',
          blocks: [
            { text: 'Een dik boek over taal', role: 'één zinsdeel in het voorveld', accent: 'green' },
            { text: 'leest', role: 'persoonsvorm', accent: 'orange' },
            { text: 'de nieuwsgierige leerling', role: 'onderwerp na de persoonsvorm', accent: 'blue' },
          ], scene: 'library',
        },
      ],
      takeaway: 'Een zinsdeel kan uit veel woorden bestaan. Binnen zo’n blok kunnen weer kleinere woordgroepen zitten: over taal is hier een voorzetselgroep binnen de naamwoordgroep.',
    },
    rules: [
      rule(1, 1, 'woorden samen iemand, iets, een plaats, tijd of eigenschap aanduiden', 'zoek hun kern en onderzoek het hele blok als kandidaat-zinsdeel.', 'Een zinsdeel kan één woord zijn. Vergelijk naamwoordgroep de drie boeken, bijvoeglijke groep erg rustig, bijwoordelijke groep heel langzaam en voorzetselgroep bij het raam. Een voorzetselgroep kan binnen een naamwoordgroep zitten en is dan niet vanzelf een zelfstandig zinsdeel.', ['eans-groepen', 'eans-zinsdeelproeven']),
      rule(1, 2, 'een blok in een gewone mededelende hoofdzin samen naar voren kan én door één verwijzing kan worden vervangen', 'gebruik die twee resultaten samen als aanwijzing voor één zinsdeel; controleer met een vraag naar het hele blok.', 'De proeven zijn hulpmiddelen, geen waterdichte wetten. Gemarkeerde woordvolgorde, dubbelzinnige groepen en bijzondere constructies vragen context. Nevenschikking met een gelijksoortig blok is een extra controle.', ['eans-zinsdeelproeven', 'eans-volgorde']),
      rule(1, 3, 'een bepaling vertelt welke persoon of welk ding een naamwoord aanduidt', 'verbind haar met dat naamwoord; in een gewone naamwoordgroep staan lidwoord en bijvoeglijk naamwoord vóór de kern en een voorzetselnabepaling meestal erna.', 'Een bepaling die vertelt waar of wanneer de gebeurtenis plaatsvindt, hoort bij de zin. Dezelfde voorzetselgroep kan in een andere context een andere aansluiting hebben.', ['eans-groepen']),
    ],
    decision: [
      { question: 'Welke woorden horen inhoudelijk bij dezelfde kern?', yes: 'Neem die woorden samen als voorlopig blok.', no: 'Zoek eerst het naamwoord of de andere kern; neem niet willekeurig alle woorden tot het volgende werkwoord.' },
      { question: 'Kun je dat blok als geheel vervangen door hij, het, daar, toen of zo?', yes: 'Doe ook de verplaatsingsproef in een gewone mededelende hoofdzin.', no: 'Probeer een andere grens of een verwijzing die bij de betekenis past.' },
      { question: 'Geeft de bepaling informatie over het naamwoord zelf?', yes: 'Laat haar binnen de naamwoordgroep; controleer met de vraag welk ding of welke persoon.', no: 'Onderzoek of zij zelfstandig antwoord geeft op waar, wanneer, hoe of waarom de gebeurtenis plaatsvindt.' },
    ],
    arena: [
      {
        ...arena(1, 1, 1, 'Bouw de zin. Laat de volledige naamwoordgroepen bij elkaar.', 'De drie nieuwe boeken is één voorwerp. Je telt zinsdelen, niet losse woorden: De docent | geeft | de drie nieuwe boeken | aan Noor.', 'Begin met wie iets geeft. Laat lidwoord, telwoord en bijvoeglijk naamwoord aan boeken vastzitten.'),
        kind: 'slots',
        blocks: [{ id: 'docent', text: 'De docent' }, { id: 'geeft', text: 'geeft' }, { id: 'boeken', text: 'de drie nieuwe boeken' }, { id: 'noor', text: 'aan Noor' }],
        slots: [{ id: 'voor', label: 'Voorveld: onderwerp', capacity: 1 }, { id: 'pv', label: 'Persoonsvorm', capacity: 1 }, { id: 'rest', label: 'Overige zinsdelen' }],
        initial: { voor: [], pv: [], rest: [] }, accept: [{ voor: ['docent'], pv: ['geeft'], rest: ['boeken', 'noor'] }],
      },
      {
        ...arena(1, 2, 2, 'Vervang het héle onderwerp door één verwijzing.', 'De twee cursisten bij het raam verwijst naar twee personen: Zij lezen. Bij het raam hoort in deze context bij de cursisten en reist mee in de verwijzing.', 'Klik eerst alle woorden van het onderwerp aan; twee personen vormen samen een meervoud.'),
        kind: 'gate',
        diagnosis: diagnosis('De twee cursisten bij het raam lezen een tekst.', [0, 1, 2, 3, 4, 5], 'Klik het volledige onderwerp aan, inclusief de bepaling die vertelt welke cursisten.', 'De twee cursisten bij het raam is de volledige naamwoordgroep. Alleen raam selecteren vervangt de cursisten niet.'),
        options: [
          { id: 'zij', text: 'Zij lezen een tekst.', feedback: 'Zij vervangt het volledige meervoudige onderwerp.' },
          { id: 'hij', text: 'Hij lezen een tekst.', feedback: 'Hij verwijst naar één persoon en past niet bij lezen.' },
          { id: 'daar', text: 'Daar lezen een tekst.', feedback: 'Daar kan een plaats vervangen, maar vervangt hier de twee personen niet.' },
        ], answer: 'zij',
      },
      {
        ...arena(1, 3, 3, 'Verbind het kernnaamwoord met het naamwoord achter het voorzetsel in zijn nabepaling.', 'Boek is de kern van het gelezen naamwoordblok; taal is het naamwoord binnen de aanvulling bij het voorzetsel over. De hele voorzetselgroep over taal beschrijft hier het boek. Gisteren vertelt wanneer Noor las en hoort bij de gebeurtenis.', 'Vraag: welk boek? Antwoord: het boek over taal. Verbind boek met taal.'),
        kind: 'tether', tokens: tokens('Noor las gisteren het boek over taal.'), links: [{ from: 'w4', to: 'w6' }],
        distractorFeedback: { w2: 'Gisteren vertelt wanneer het lezen plaatsvond. Het beschrijft in deze zin niet welk boek bedoeld is.', w0: 'Noor is de lezer. Zoek de kern van het gelezen ding.' },
      },
      {
        ...arena(1, 4, 2, 'Zet de plaatsbepaling vooraan zonder haar in stukken te knippen.', 'Bij het raam kan samen naar voren: Bij het raam | leest | de cursist | rustig. Dit blok geeft hier de plaats van de leeshandeling aan.', 'Knip eerst in onderwerp, persoonsvorm, wijze en plaats. Verplaats dan het volledige plaatsblok.', ['De cursist', 'leest', 'rustig', 'bij het raam.']),
        kind: 'slots',
        blocks: [{ id: 'cursist', text: 'de cursist' }, { id: 'leest', text: 'leest' }, { id: 'rustig', text: 'rustig' }, { id: 'raam', text: 'Bij het raam' }],
        slots: [{ id: 'voor', label: 'Voorveld: plaats', capacity: 1 }, { id: 'pv', label: 'Persoonsvorm', capacity: 1 }, { id: 'rest', label: 'Rest van de zin' }],
        initial: { voor: ['cursist'], pv: ['leest'], rest: ['rustig', 'raam'] },
        accept: [{ voor: ['raam'], pv: ['leest'], rest: ['cursist', 'rustig'] }],
        collision: { front: 'voor', middle: 'rest', subject: 'cursist' },
      },
      {
        ...arena(1, 5, 1, 'Zoek de kern van de lange naamwoordgroep en kies daarna de passende korte verwijzing.', 'Deze drie bijzonder dikke boeken over taal heeft boeken als kern. De hele groep is meervoud en kan hier vervangen worden door ze.', 'Bepalingen maken de groep langer, maar veranderen boeken niet in één boek.', ['Deze drie bijzonder dikke boeken over taal', 'liggen', 'op mijn tafel.']),
        kind: 'gate',
        diagnosis: diagnosis('Deze drie bijzonder dikke boeken over taal liggen op mijn tafel.', [4], 'Klik alleen de kern van het onderwerp aan.', 'Boeken is de kern. Bijzonder versterkt dikke; over taal is een nabepaling bij boeken.'),
        options: [
          { id: 'ze', text: 'Ze liggen op mijn tafel.', feedback: 'Ze vervangt de volledige meervoudige naamwoordgroep.' },
          { id: 'het', text: 'Het liggen op mijn tafel.', feedback: 'Het past hier niet bij het meervoudige onderwerp boeken.' },
          { id: 'daar', text: 'Daar liggen op mijn tafel.', feedback: 'Daar vervangt een plaats; er ontbreekt dan nog een onderwerp.' },
        ], answer: 'ze',
      },
      {
        ...arena(1, 6, 2, 'Verplaats het hele voorwerp om het besproken boek te benadrukken.', 'Het nieuwe boek over taal reist als één blok naar voren. De woorden over taal blijven in deze context aan boek gekoppeld; de leerling gaat achter leest staan.', 'De vraag is: wat leest de leerling? Verplaats het hele antwoord, niet alleen boek.', ['De leerling', 'leest', 'het nieuwe boek over taal.']),
        kind: 'mutate', original: 'De leerling leest het nieuwe boek over taal.', target: 'boek-voor',
        variants: [
          { id: 'leerling-voor', label: 'De leerling als vertrekpunt', blocks: [{ id: 'leerling', text: 'De leerling' }, { id: 'leest', text: 'leest' }, { id: 'boek', text: 'het nieuwe boek over taal' }], order: ['leerling', 'leest', 'boek'], note: 'De gewone volgorde begint met het onderwerp.' },
          { id: 'boek-voor', label: 'Het hele boekblok als vertrekpunt', blocks: [{ id: 'boek', text: 'Het nieuwe boek over taal' }, { id: 'leest', text: 'leest' }, { id: 'leerling', text: 'de leerling' }], order: ['boek', 'leest', 'leerling'], note: 'In een gesprek over verschillende boeken kun je het volledige voorwerp vooraan zetten.' },
        ],
      },
    ],
    debugger: [
      debug(1, 1, 3, 'Ik lees een over taal boek.', [3, 4], 'De voorzetselbepaling staat verkeerd binnen deze gewone naamwoordgroep. Klik over taal en herschrijf de hele zin. Verplaats uitsluitend over taal naar direct achter boek; behoud Ik lees vooraan.', ['Ik lees een boek over taal.'], 'Over taal is een nabepaling bij boek. In deze neutrale naamwoordgroep volgt zij op de kern.', 'Houd een boek bijeen en plaats de beschrijving van het onderwerp van het boek erachter.'),
      debug(1, 2, 3, 'De leerling leest nieuwe het boek.', [3, 4], 'Klik de twee woorden met de verkeerde onderlinge volgorde. Wissel uitsluitend nieuwe en het om; behoud De leerling leest vooraan en verander niets anders.', ['De leerling leest het nieuwe boek.'], 'De naamwoordgroep luidt het nieuwe boek: lidwoord vóór bijvoeglijk naamwoord vóór kern.', 'Zoek eerst het lidwoord van boek.'),
      debug(1, 3, 3, 'De boeken over liggen taal op tafel.', [2, 3, 4], 'De nabepaling over taal is door het werkwoord gebroken. Klik over liggen taal. Verplaats uitsluitend liggen naar direct achter taal; behoud de volgorde van alle andere woorden.', ['De boeken over taal liggen op tafel.'], 'Over taal hoort hier binnen De boeken over taal. De volledige naamwoordgroep staat vóór liggen.', 'Maak eerst het hele onderwerp af; zet daarna de persoonsvorm.'),
      debug(1, 4, 3, 'Wij lezen dat over grammatica dikke boek.', [3, 4, 5], 'Klik over grammatica dikke: deze woorden staan verkeerd rond de kern. Verplaats uitsluitend over grammatica naar direct achter boek. Behoud Wij lezen vooraan en de volgorde van alle andere woorden.', ['Wij lezen dat dikke boek over grammatica.'], 'Dat dikke boek over grammatica is één naamwoordgroep: dat en dikke staan vóór boek; over grammatica volgt de kern.', 'De kern blijft boek. Zet elke beschrijving aan de passende kant van die kern.'),
    ],
    summary: {
      title: 'Zie blokken, niet alleen woorden',
      points: ['Zoek een kern en de woorden die erbij horen.', 'Gebruik minstens twee proeven: vervangen, samen naar voren zetten, een vraag stellen of een gelijksoortig blok met en verbinden.', 'Een bepaling binnen een naamwoordgroep hoeft geen zelfstandig zinsdeel te zijn.'],
      transfer: 'Neem een zin uit een bericht. Omcirkel de langste naamwoordgroep, vervang haar door één verwijzing en leg uit welke woorden in de groep bij de kern horen.',
    },
    legacyLessonIds: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'],
  },
  {
    id: 'zinnen-02', number: 2,
    title: 'Persoonsvorm en onderwerp: de zin krijgt een ruggengraat',
    teaser: 'Vind de veranderende werkwoordsvorm en bouw de juiste verbinding over alle afleidingen heen.',
    minutes: 20,
    objectives: [
      'Met de tijdproef de persoonsvorm vinden, ook in een bijzin.',
      'De volledige onderwerpgroep en haar kern verbinden met de persoonsvorm.',
      'Gewone congruentie onderscheiden van betekenisafhankelijke hoeveelheden en bijzondere constructies.',
    ],
    discovery: {
      question: 'Welk woord bestuurt staat: doos of boeken?',
      variants: [
        { id: 'een-doos', label: 'Eén doos', sentence: 'Een doos met twintig boeken staat op tafel.', note: 'De volledige onderwerpgroep bevat boeken, maar doos is de enkelvoudige kern. Daarom staat.', blocks: [{ text: 'Een doos met twintig boeken', role: 'onderwerp · kern: doos', accent: 'blue' }, { text: 'staat', role: 'persoonsvorm · enkelvoud', accent: 'orange' }, { text: 'op tafel', role: 'plaats', accent: 'green' }], scene: 'library' },
        { id: 'twee-dozen', label: 'Twee dozen', sentence: 'Twee dozen met twintig boeken staan op tafel.', note: 'De kern verandert van doos naar dozen. De persoonsvorm verandert mee; boeken blijft in de nabepaling staan.', blocks: [{ text: 'Twee dozen met twintig boeken', role: 'onderwerp · kern: dozen', accent: 'blue' }, { text: 'staan', role: 'persoonsvorm · meervoud', accent: 'orange' }, { text: 'op tafel', role: 'plaats', accent: 'green' }], scene: 'library' },
      ],
      takeaway: 'Het onderwerp is niet per definitie degene die iets doet. In De doos staat op tafel doet niemand iets; in De brief wordt gelezen is de brief het onderwerp. De grammaticale verbinding helpt je meer dan alleen de betekenisvraag wie doet het?',
    },
    rules: [
      rule(2, 1, 'je een finiete deelzin van tegenwoordige naar verleden tijd omzet', 'zoek het werkwoord dat van vorm verandert: dat is de persoonsvorm van die deelzin.', 'Elke finiete deelzin heeft haar eigen persoonsvorm. In heeft gelezen verandert heeft in had, niet gelezen. Een ja/nee-vraag is een extra proef voor een hoofdzin, maar behoudt niet simpelweg de bouw van elke bijzin.', ['eans-werkwoorden', 'eans-zinsdelen']),
      rule(2, 2, 'je een gewoon onderwerp met een herkenbare kern hebt', 'laat de persoonsvorm in persoon en getal aansluiten bij dat onderwerp; controleer door het onderwerp bewust te veranderen.', 'Een naamwoord in een voorzetselnabepaling bestuurt meestal niet de congruentie: Een doos met boeken staat. Dat naamwoord kan wel binnen het volledige onderwerp zitten. Onderwerp betekent geen vaste handelende rol.', ['eans-congruentie']),
      rule(2, 3, 'getal of persoonskeuze lastig wordt door hoeveelheden, nevenschikking of een identificerende zin', 'controleer de constructie én de bedoelde betekenis; kies bij onduidelijke persoonscombinaties een heldere herformulering.', 'Een aantal mensen wacht/wachten kan beide: geheel of afzonderlijke mensen. Een voor een binnenkomen vraagt juist meervoud. Het aantal mensen neemt toe heeft enkelvoud. Noor en Sam werken heeft normaal meervoud, maar een vaste combinatie kan één geheel zijn. Dat zijn mijn broers en Twee liter melk is genoeg zijn andere bijzondere patronen; gebruik dus geen universele regel van het dichtstbijzijnde woord.', ['eans-congruentie', 'eans-hoeveelheid', 'eans-nevenschikking']),
    ],
    decision: [
      { question: 'Heb je de tijd van deze deelzin veranderd?', yes: 'Noteer het werkwoord dat mee veranderde als persoonsvorm.', no: 'Probeer nu en gisteren; verander de tijd zonder de rest van de betekenis te vervangen.' },
      { question: 'Kun je het kandidaat-onderwerp veranderen van één naar meerdere?', yes: 'Controleer of de persoonsvorm mee moet veranderen.', no: 'Zoek de volledige naamwoordgroep; let op een passieve zin of een bijzondere constructie.' },
      { question: 'Is de kern een gewone enkelvoudige of meervoudige naamwoordsvorm?', yes: 'Volg voor de gewone congruentie die kern; laat een nabepaling je niet afleiden.', no: 'Onderzoek hoeveelheid, nevenschikking, persoon of een identificerende dat/dit/het-zin; formuleer helder als de keuze onzeker blijft.' },
    ],
    arena: [
      {
        ...arena(2, 1, 2, 'Ontgrendel de werkwoordsvorm door eerst de kern van het onderwerp te vinden.', 'Het onderwerp is Een doos met twintig boeken. De kern doos is enkelvoud; de boeken zitten binnen een nabepaling. Daarom staat.', 'Vraag hoeveel dozen er staan; het aantal boeken is hier geen aantal dozen.'),
        kind: 'gate', diagnosis: diagnosis('Een doos met twintig boeken ___ op tafel.', [1], 'Klik alleen de kern van het onderwerp aan.', 'Doos is de kern. Boeken is wel onderdeel van de onderwerpgroep, maar niet haar kern.'),
        options: [{ id: 'staat', text: 'staat', feedback: 'Eén doos: enkelvoud staat.' }, { id: 'staan', text: 'staan', feedback: 'Boeken trekt je naar meervoud, maar de kern is doos.' }, { id: 'stonden', text: 'stonden', feedback: 'Deze vorm is meervoud én verleden tijd; gevraagd is tegenwoordige tijd bij één doos.' }], answer: 'staat',
      },
      {
        ...arena(2, 2, 1, 'Zet de zin in de verleden tijd en volg de persoonsvorm.', 'In heeft gelezen verandert alleen het finiete hulpwerkwoord naar had. Het voltooid deelwoord gelezen is geen persoonsvorm.', 'Zoek het verschil tussen de varianten; een werkwoordgroep kan meerdere werkwoorden bevatten.'),
        kind: 'mutate', original: 'Noor heeft het verslag gelezen.', target: 'verleden',
        variants: [
          { id: 'heden', label: 'Tegenwoordige tijd', blocks: [{ id: 'noor', text: 'Noor' }, { id: 'pv', text: 'heeft' }, { id: 'verslag', text: 'het verslag' }, { id: 'deelwoord', text: 'gelezen' }], order: ['noor', 'pv', 'verslag', 'deelwoord'], note: 'Heeft draagt hier de tijd en de aansluiting bij Noor.' },
          { id: 'verleden', label: 'Verleden tijd', blocks: [{ id: 'noor', text: 'Noor' }, { id: 'pv', text: 'had' }, { id: 'verslag', text: 'het verslag' }, { id: 'deelwoord', text: 'gelezen' }], order: ['noor', 'pv', 'verslag', 'deelwoord'], note: 'Had is de persoonsvorm; gelezen blijft gelijk.' },
        ],
      },
      {
        ...arena(2, 3, 2, 'Leg een brug van de kern van het onderwerp naar de persoonsvorm.', 'Een team van ervaren monteurs is de onderwerpgroep. Team is enkelvoud en hoort bij werkt. Monteurs specificeert de leden van het team.', 'Sla de nabepaling niet weg uit het onderwerp, maar zoek de kern waar zij bij hoort.'),
        kind: 'tether', tokens: tokens('Een team van ervaren monteurs werkt vandaag.'), links: [{ from: 'w1', to: 'w5' }],
        distractorFeedback: { w4: 'Monteurs staat binnen van ervaren monteurs. De kern van de hele onderwerpgroep is team.', w3: 'Ervaren beschrijft monteurs; het is niet de kern van de onderwerpgroep.' },
      },
      {
        ...arena(2, 4, 1, 'Vind de persoonsvorm in de bijzin voordat je haar verleden tijd kiest.', 'De bijzin luidt omdat Noor een verslag schrijft. Bij de tijdproef verandert schrijft in schreef. De persoonsvorm staat hier achteraan.', 'Knip de volledige omdat-bijzin als één buitenste blok; zoek voor de tijdproef daarbinnen schrijft.', ['Omdat Noor een verslag schrijft,', 'wacht', 'Sam', 'even.']),
        kind: 'gate', diagnosis: diagnosis('Omdat Noor een verslag schrijft, wacht Sam even.', [4], 'Klik de persoonsvorm van de omdat-bijzin aan; selecteer niet de persoonsvorm van de hoofdzin.', 'Schrijft is de persoonsvorm in de omdat-deelzin. Wacht hoort bij de hoofdzin.'),
        options: [{ id: 'schreef', text: 'Omdat Noor een verslag schreef', feedback: 'Schreef is de verleden tijd van schrijft.' }, { id: 'schrijven', text: 'Omdat Noor een verslag schrijven', feedback: 'Schrijven is hier een infinitief en sluit niet als persoonsvorm aan bij Noor.' }, { id: 'geschreven', text: 'Omdat Noor een verslag geschreven', feedback: 'Een voltooid deelwoord kan hier niet alleen de persoonsvorm vervangen.' }], answer: 'schreef',
      },
      {
        ...arena(2, 5, 3, 'Verbind beide delen van het samengestelde onderwerp met de persoonsvorm.', 'Noor en Sam vormen samen een gewoon samengesteld onderwerp. Beide namen verbinden met werken; het geheel is hier meervoud.', 'De nevenschikking en verbindt hier twee verschillende personen, geen vaste eenheid.', ['Noor en Sam', 'werken', 'in de bibliotheek.']),
        kind: 'tether', tokens: tokens('Noor en Sam werken in de bibliotheek.'), links: [{ from: 'w0', to: 'w3' }, { from: 'w2', to: 'w3' }],
        distractorFeedback: { w1: 'En verbindt de twee onderwerpsdelen, maar is zelf geen naam van een deelnemer.', w6: 'Bibliotheek is de plaats waar gewerkt wordt, geen deel van het onderwerp.' },
      },
      {
        ...arena(2, 6, 3, 'Onderzoek de hoeveelheidsconstructie voordat je een goedgekeurde vorm kiest.', 'Bij Een aantal bezoekers kan enkelvoud of meervoud gebruikt worden. Wacht belicht de groep, wachten de bezoekers als individuen. Bij Het aantal bezoekers stijgt gaat het om het aantal zelf en gebruik je enkelvoud.', 'Let op het verschil tussen Een aantal bezoekers en Het aantal bezoekers.', ['Een aantal bezoekers', 'wacht', 'buiten.']),
        kind: 'gate', diagnosis: diagnosis('Een aantal bezoekers wacht buiten.', [0, 1, 2], 'Klik de hele hoeveelheidsuitdrukking aan die hier onderwerp is.', 'Een aantal bezoekers is het volledige onderwerp. De betekenis van deze constructie laat twee congruentiepatronen toe.'),
        options: [{ id: 'alleen-enkelvoud', text: 'Alleen wacht is mogelijk.', feedback: 'Bij een aantal personen is ook betekeniscongruentie in het meervoud gangbaar.' }, { id: 'alleen-meervoud', text: 'Alleen wachten is mogelijk.', feedback: 'De enkelvoudige vorm is ook mogelijk als je de groep als geheel presenteert.' }, { id: 'beide', text: 'Wacht en wachten zijn beide mogelijk, met een verschil in perspectief.', feedback: 'Beide vormen zijn mogelijk bij een aantal bezoekers. Vermijd de onjuiste uitbreiding naar het aantal bezoekers.' }], answer: 'beide',
      },
    ],
    debugger: [
      debug(2, 1, 2, 'Een doos met twintig boeken staan op tafel.', [5], 'Klik de foute persoonsvorm. Herschrijf alleen staan; de rest blijft gelijk.', ['Een doos met twintig boeken staat op tafel.'], 'Doos is de enkelvoudige kern; boeken is onderdeel van de nabepaling.', 'Zoek hoeveel dozen er zijn.'),
      debug(2, 2, 3, 'Het aantal bezoekers nemen toe.', [3], 'Klik de foute persoonsvorm. Herstel de zin zonder Het aantal bezoekers te veranderen.', ['Het aantal bezoekers neemt toe.'], 'Het aantal benoemt het getal zelf. Daarom enkelvoud neemt; dit is niet de vrijere constructie een aantal bezoekers.', 'Het onderwerp gaat om één aantal, niet om losse bezoekers.'),
      debug(2, 3, 3, 'Noor en Sam werkt vandaag samen.', [3], 'Klik de foute persoonsvorm. Verander alleen werkt in de passende tegenwoordige tijd; behoud de volgorde van alle woorden.', ['Noor en Sam werken vandaag samen.'], 'Twee afzonderlijke personen verbonden door en vormen hier een meervoudig onderwerp.', 'Verander Noor en Sam in zij.'),
      debug(2, 4, 3, 'Dat is mijn broers.', [1], 'Klik de fout in deze identificerende zin. Verander alleen het koppelwerkwoord.', ['Dat zijn mijn broers.'], 'Bij Dat zijn mijn broers sluit het koppelwerkwoord aan bij het meervoudige naamwoordelijke deel. De gewone kernregel heeft hier een bijzondere aanvulling.', 'Je wijst naar meerdere broers: vergelijk Dit zijn mijn boeken.'),
    ],
    summary: {
      title: 'Verbind de juiste kern met de persoonsvorm',
      points: ['De tijdproef werkt ook in een bijzin; onderzoek elke finiete deelzin apart.', 'Selecteer het volledige onderwerp, maar zoek daarbinnen de congruentiebepalende kern.', 'Hoeveelheden, samengestelde onderwerpen en Dat zijn… vragen constructie en betekenis; twijfelgevallen herschrijf je helder.'],
      transfer: 'Zoek in een nieuwsbericht een onderwerp met van of met. Onderstreep het volledige onderwerp, omcirkel de kern en zet de zin daarna in een andere tijd én in een ander getal.',
    },
    legacyLessonIds: ['z1', 'p7', 'p8', 'p9'],
  },
  {
    id: 'zinnen-03', number: 3,
    title: 'Het gezegde: doen, zijn en een toestand tijdens het doen',
    teaser: 'Kijk naar de functie van werkwoorden en eigenschappen, niet alleen naar hun naam.',
    minutes: 20,
    objectives: [
      'Een werkwoordelijke keten en een scheidbaar werkwoorddeel herkennen.',
      'Een naamwoordelijk gezegde onderscheiden van een werkwoordelijk gebruik van zijn, worden of blijven.',
      'Een eigenschap die bij het onderwerp of voorwerp hoort tijdens of door een handeling herkennen als bepaling van gesteldheid.',
    ],
    discovery: {
      question: 'Vertelt moe de hele hoofdmededeling, of een toestand bij een handeling?',
      variants: [
        { id: 'toestand', label: 'De toestand is de hoofdmededeling', sentence: 'Noor is moe.', note: 'Is koppelt Noor aan de eigenschap moe. Samen vormen is moe het naamwoordelijk gezegde.', blocks: [{ text: 'Noor', role: 'onderwerp', accent: 'blue' }, { text: 'is', role: 'koppelwerkwoord', accent: 'orange' }, { text: 'moe', role: 'naamwoordelijk deel', accent: 'purple' }], scene: 'classroom' },
        { id: 'handeling', label: 'Een handeling met een gelijktijdige toestand', sentence: 'Noor fietst moe naar huis.', note: 'Fietst vertelt de handeling; moe beschrijft Noor tijdens het fietsen. Het is hier een bepaling van gesteldheid, geen naamwoordelijk deel van fietst.', blocks: [{ text: 'Noor', role: 'onderwerp', accent: 'blue' }, { text: 'fietst', role: 'werkwoordelijk gezegde', accent: 'orange' }, { text: 'moe', role: 'bepaling van gesteldheid bij Noor', accent: 'purple' }, { text: 'naar huis', role: 'richting', accent: 'green' }], scene: 'bicycle' },
      ],
      takeaway: 'Hetzelfde bijvoeglijke woord kan een andere zinsfunctie krijgen. Vraag eerst wat de werkwoordelijke constructie in deze zin doet: een handeling uitdrukken of het onderwerp aan een eigenschap, identiteit of toestand koppelen.',
    },
    rules: [
      rule(3, 1, 'werkwoorden samen een handeling, gebeurtenis of proces uitdrukken', 'zoek de persoonsvorm, de bijbehorende infinitieven en deelwoorden en eventuele scheidbare delen als werkwoordelijk geheel.', 'Onderzoek per deelzin. Een werkwoord uit een andere bijzin hoort niet automatisch in hetzelfde gezegde. Naamwoordelijke gezegdes hebben óók werkwoorden. De E-ANS rekent te, verplicht wederkerende delen zoals zich in zich schamen en vaste uitdrukkingen eveneens tot het werkwoordelijk gezegde. Een losse plaatsbepaling is niet automatisch een werkwoorddeel.', ['eans-wg', 'eans-werkwoorden']),
      rule(3, 2, 'een werkwoord in deze zin het onderwerp koppelt aan een eigenschap, identiteit of toestand', 'analyseer de werkwoordelijke component plus dat naamwoordelijke deel als naamwoordelijk gezegde.', 'Zijn, worden, blijven, blijken, lijken, schijnen, heten, dunken en voorkomen kunnen koppelen, maar doen dat niet in elk gebruik. Hij is vertrokken en De deur wordt geverfd zijn werkwoordelijke constructies. De grens tussen toestand en passief kan context nodig hebben. Sommige andere werkwoorden kunnen in bepaalde uitdrukkingen ook koppelen; de functie telt meer dan een gesloten woordenlijst.', ['eans-ng', 'eans-koppelwerkwoorden']),
      rule(3, 3, 'een eigenschap geldt tijdens een gewone handeling of als resultaat ervan voor onderwerp of voorwerp', 'onderzoek haar als bepaling van gesteldheid en verbind haar met de persoon of zaak die de eigenschap heeft.', 'Noor fietst moe: Noor is moe terwijl zij fietst. Noor verft de deur groen: de deur wordt groen. Dit verschilt van een wijze-bepaling zoals voorzichtig: die beschrijft hoe de handeling gebeurt. Sommige grammaticale beschrijvingen benoemen complementen bij vinden of noemen anders.', ['eans-gesteldheid', 'eans-gesteldheid-resultaat']),
    ],
    decision: [
      { question: 'Koppelt het werkwoord het onderwerp aan wie of hoe het is?', yes: 'Zoek het naamwoordelijke deel en de hele werkwoordelijke component.', no: 'Onderzoek het werkwoordelijke gezegde en zijn bijbehorende delen.' },
      { question: 'Is zijn of worden hier hulpwerkwoord bij een gebeurtenis of passief?', yes: 'Het woord is hier geen koppelwerkwoord; kijk naar de hele werkwoordelijke constructie.', no: 'Controleer de betekenis: identiteit, eigenschap, toestand, plaats of een ander zelfstandig gebruik.' },
      { question: 'Beschrijft een eigenschap een deelnemer tijdens of door een gewone handeling?', yes: 'Verbind haar met die deelnemer als bepaling van gesteldheid.', no: 'Onderzoek een naamwoordelijk deel, een bepaling bij een naamwoord of een wijze-bepaling.' },
    ],
    arena: [
      {
        ...arena(3, 1, 1, 'Bouw de zin met Noor voorop, daarna de persoonsvorm en het overige werkwoordelijke deel achteraan.', 'Heeft en opgebeld vormen samen het werkwoordelijk gezegde. Opgebeld is het deelwoord van het scheidbare werkwoord opbellen.', 'De hulpvorm heeft staat na Noor; opgebeld staat na het voorwerp en de tijdsbepaling.'),
        kind: 'slots', blocks: [{ id: 'noor', text: 'Noor' }, { id: 'heeft', text: 'heeft' }, { id: 'docent', text: 'de docent' }, { id: 'vandaag', text: 'vandaag' }, { id: 'opgebeld', text: 'opgebeld' }],
        slots: [{ id: 'voor', label: 'Onderwerp', capacity: 1 }, { id: 'pv', label: 'Persoonsvorm', capacity: 1 }, { id: 'midden', label: 'Voorwerp en tijd' }, { id: 'eind', label: 'Rest van het gezegde', capacity: 1 }],
        initial: { voor: [], pv: [], midden: [], eind: [] }, accept: [{ voor: ['noor'], pv: ['heeft'], midden: ['docent', 'vandaag'], eind: ['opgebeld'] }, { voor: ['noor'], pv: ['heeft'], midden: ['vandaag', 'docent'], eind: ['opgebeld'] }],
      },
      {
        ...arena(3, 2, 2, 'Onderzoek wat zijn in deze zin doet voordat je het gezegde benoemt.', 'Is vertrokken beschrijft een gebeurtenis in de voltooide tijd. Is is hier een hulpwerkwoord van tijd, geen koppeling aan een eigenschap.', 'Klik eerst de hele werkwoordelijke keten aan; vertrokken benoemt hier het vertrekken van gisteren.'),
        kind: 'gate', diagnosis: diagnosis('Noor is gisteren vertrokken.', [1, 3], 'Klik de twee werkwoorden aan die hier samen de gebeurtenis uitdrukken.', 'Is en vertrokken horen samen. Gisteren bepaalt de tijd van de gebeurtenis.'),
        options: [{ id: 'wg', text: 'Werkwoordelijk gezegde: is vertrokken', feedback: 'Het gaat om een voltooide gebeurtenis.' }, { id: 'ng', text: 'Naamwoordelijk gezegde: is vertrokken', feedback: 'In deze context koppelt is Noor niet aan een losse eigenschap; het vormt de voltooide tijd van vertrekken.' }, { id: 'alleen-is', text: 'Werkwoordelijk gezegde: alleen is', feedback: 'Vertrokken is nodig in de werkwoordelijke keten en hoort erbij.' }], answer: 'wg',
      },
      {
        ...arena(3, 3, 3, 'Verbind de eigenschap met de deelnemer die haar krijgt.', 'Groen beschrijft het resultaat voor de deur, niet de manier waarop Noor verft. De brug loopt van deur naar groen.', 'Wat wordt groen: de schilder of de deur?'),
        kind: 'tether', tokens: tokens('Noor verft de deur groen.'), links: [{ from: 'w3', to: 'w4' }],
        distractorFeedback: { w0: 'Noor voert het schilderwerk uit; de zin zegt dat de deur groen wordt.', w1: 'Groen beschrijft geen manier van verven, maar het resultaat voor de deur.' },
      },
      {
        ...arena(3, 4, 2, 'Verbind het onderwerp met de eigenschap waar het koppelwerkwoord naar verwijst.', 'De docent blijft rustig: rustig is het naamwoordelijk deel dat bij de docent hoort. Blijft is hier het koppelwerkwoord.', 'Vraag wat er van de docent gezegd wordt: hij blijft rustig.', ['De docent', 'blijft', 'rustig.']),
        kind: 'tether', tokens: tokens('De docent blijft rustig.'), links: [{ from: 'w1', to: 'w3' }],
        distractorFeedback: { w0: 'De is een lidwoord. Verbind de kern docent met zijn eigenschap.', w2: 'Blijft legt de koppeling; zoek de deelnemer en het naamwoordelijke deel aan weerszijden.' },
      },
      {
        ...arena(3, 5, 3, 'Ontgrendel de functie van moe door eerst te vinden wie moe is.', 'In Noor fietst moe naar huis beschrijft moe de toestand van Noor tijdens het fietsen. Fietst blijft een gewoon handelingswerkwoord; moe is een bepaling van gesteldheid.', 'De testzin is: Noor is moe terwijl Noor fietst.', ['Noor', 'fietst', 'moe', 'naar huis.']),
        kind: 'gate', diagnosis: diagnosis('Noor fietst moe naar huis.', [0], 'Klik de deelnemer aan op wie moe betrekking heeft.', 'Noor is moe. Naar huis geeft de richting, niet degene die moe is.'),
        options: [{ id: 'gesteldheid', text: 'Bepaling van gesteldheid bij Noor', feedback: 'Moe beschrijft de deelnemer tijdens de handeling.' }, { id: 'naamwoordelijk', text: 'Naamwoordelijk deel bij fietst', feedback: 'Fietst is hier geen koppelwerkwoord.' }, { id: 'plaats', text: 'Bijwoordelijke bepaling van plaats', feedback: 'Moe geeft geen plaats aan; naar huis geeft de richting.' }], answer: 'gesteldheid',
      },
      {
        ...arena(3, 6, 1, 'Maak van bellen op de bijbehorende voltooide werkwoordsvorm.', 'In de hoofdzin Noor belt de docent op staat op los achteraan. In Noor heeft de docent opgebeld worden op en gebeld één deelwoord van opbellen.', 'Het scheidbare deel hoort bij het werkwoord en verdwijnt niet bij het veranderen van de tijd.', ['Noor', 'belt', 'de docent', 'op.']),
        kind: 'mutate', original: 'Noor belt de docent op.', target: 'voltooid',
        variants: [
          { id: 'onvoltooid', label: 'Onvoltooide tegenwoordige tijd', blocks: [{ id: 'noor', text: 'Noor' }, { id: 'pv', text: 'belt' }, { id: 'docent', text: 'de docent' }, { id: 'eind', text: 'op' }], order: ['noor', 'pv', 'docent', 'eind'], note: 'Belt en op vormen samen het scheidbare werkwoord.' },
          { id: 'voltooid', label: 'Voltooide tegenwoordige tijd', blocks: [{ id: 'noor', text: 'Noor' }, { id: 'pv', text: 'heeft' }, { id: 'docent', text: 'de docent' }, { id: 'eind', text: 'opgebeld' }], order: ['noor', 'pv', 'docent', 'eind'], note: 'Heeft is de persoonsvorm; opgebeld is het bijbehorende deelwoord.' },
        ],
      },
    ],
    debugger: [
      debug(3, 1, 1, 'Noor heeft de docent opgebellen.', [4], 'Klik de verkeerde werkwoordsvorm. Maak de voltooide tijd correct; verander alleen het laatste woord.', ['Noor heeft de docent opgebeld.'], 'De gewone voltooide tijd van opbellen gebruikt het deelwoord opgebeld, niet een vorm opgebellen.', 'Combineer heeft met het voltooid deelwoord van opbellen.'),
      debug(3, 2, 2, 'De docent heeft rustig.', [2], 'De zin moet vertellen hoe de docent is. Klik het verkeerde werkwoord. Gebruik de tegenwoordige tijd van zijn en verander verder niets.', ['De docent is rustig.'], 'Rustig beschrijft de docent als eigenschap. Is koppelt de docent aan dat naamwoordelijke deel; heeft vormt die koppeling hier niet.', 'Er wordt niets bezeten en er volgt geen deelwoord. Je benoemt een eigenschap van de docent.'),
      debug(3, 3, 1, 'Noor heeft gisteren een uur fietst.', [5], 'Klik de verkeerde werkwoordsvorm en herstel uitsluitend het laatste woord voor de voltooide tijd.', ['Noor heeft gisteren een uur gefietst.'], 'Heeft gefietst vormt hier de voltooide tijd van de fietsactiviteit. Fietst is een persoonsvorm en kan hier niet als deelwoord naast heeft staan.', 'Zoek het voltooid deelwoord van fietsen.'),
      debug(3, 4, 2, 'De deur wordt door Noor verven.', [5], 'Klik de verkeerde werkwoordsvorm. Herstel alleen het laatste woord zodat de zin een passieve verfhandeling uitdrukt.', ['De deur wordt door Noor geverfd.'], 'Wordt geverfd vormt hier een werkwoordelijk gezegde in de lijdende vorm. Wordt is een hulpwerkwoord bij het deelwoord geverfd en is hier geen koppelwerkwoord.', 'Een gewone passieve constructie combineert worden met een voltooid deelwoord, niet met deze infinitief.'),
    ],
    summary: {
      title: 'Benoem de functie in deze zin',
      points: ['Werkwoordelijk: een handeling, gebeurtenis of proces met zijn bijbehorende werkwoordelijke delen.', 'Naamwoordelijk: het onderwerp wordt gekoppeld aan een eigenschap, identiteit of toestand.', 'Bepaling van gesteldheid: een deelnemer heeft of krijgt een eigenschap tijdens of door een gewone handeling.'],
      transfer: 'Schrijf drie zinnen over dezelfde persoon: die persoon is moe, doet iets terwijl die moe is, en heeft iets gedaan. Leg bij elke zin uit welke functie de werkwoordelijke constructie en moe hebben.',
    },
    legacyLessonIds: ['z2', 'p10', 'p11', 'p12'],
  },
  {
    id: 'zinnen-04', number: 4,
    title: 'Voorwerpen en bepalingen: wat vraagt het werkwoord?',
    teaser: 'Onderzoek een ontvanger, een direct voorwerp, een vast voorzetsel en vrije informatie over de gebeurtenis.',
    minutes: 22,
    objectives: [
      'Lijdend en meewerkend voorwerp herkennen met betekenis, vorm en bruikbare omzettingsproeven.',
      'Een voorzetselvoorwerp onderscheiden van een plaats-, tijd-, wijze- of maatbepaling.',
      'De valentie van de gebruikte werkwoordbetekenis onderzoeken en zeldzamere complementen herkennen.',
    ],
    discovery: {
      question: 'Heeft op dezelfde functie bij wachten en bij zitten?',
      variants: [
        { id: 'verwachten', label: 'De bus verwachten', sentence: 'Noor wacht op de bus.', note: 'Wachten op noemt waarop Noor haar wachten richt. Op is hier onderdeel van het vaste patroon wachten op: op de bus is een voorzetselvoorwerp.', blocks: [{ text: 'Noor', role: 'onderwerp', accent: 'blue' }, { text: 'wacht', role: 'gezegde', accent: 'orange' }, { text: 'op de bus', role: 'voorzetselvoorwerp · verwacht vervoermiddel', accent: 'purple' }], scene: 'bus' },
        { id: 'locatie', label: 'Op het dak zitten', sentence: 'Noor zit boven op de bus.', note: 'Deze ongewone scène beschrijft een letterlijke plaats. Boven op de bus is een bijwoordelijke bepaling van plaats. Een ander voorzetsel geeft een andere plaats.', blocks: [{ text: 'Noor', role: 'onderwerp', accent: 'blue' }, { text: 'zit', role: 'gezegde', accent: 'orange' }, { text: 'boven op de bus', role: 'bijwoordelijke bepaling · locatie', accent: 'green' }], scene: 'bus' },
      ],
      takeaway: 'De vorm op de bus beslist de functie niet alleen. Je onderzoekt het werkwoord in deze betekenis én wat de groep eraan toevoegt. Wachten op de bus en wachten bij de bushalte hebben verschillende aansluitingen.',
    },
    rules: [
      rule(4, 1, 'een werkwoord in deze betekenis rechtstreeks op iemand of iets betrekking heeft', 'onderzoek die naamwoordgroep als lijdend voorwerp; als een gewone passieve omzetting mogelijk is, wordt zij daarin onderwerp.', 'De passiefproef is een sterke aanwijzing, geen onfeilbare beslisser: sommige werkwoorden of betekenissen laten geen natuurlijk passief toe. Niet elke groep na een werkwoord is een voorwerp. Twintig kilo in De koffer weegt twintig kilo is een maatbepaling.', ['eans-lijdendvoorwerp', 'eans-maat']),
      rule(4, 2, 'naast een overgedragen zaak of boodschap ook een ontvanger of belanghebbende wordt genoemd', 'onderzoek het indirecte object: meewerkend bij een ontvanger, belanghebbend bij voor wiens belang de handeling gebeurt; vergelijk bij geschikte werkwoorden een versie met aan of voor.', 'Aan/voor toevoegen of weglaten werkt niet overal op dezelfde manier. Mij in Dat lijkt mij uitstekend is een ondervindend complement; dat is geen gewone ontvanger. Een belanghebbend voorwerp wordt ook wel bepaling van belang genoemd. Onderzoek daarom het werkwoord, niet alleen een vraag met aan wie.', ['eans-meewerkendvoorwerp']),
      rule(4, 3, 'je wilt bepalen welk complement of welke bepaling bij een gezegde hoort', 'onderzoek het patroon in deze betekenis: vast voorzetselvoorwerp, een zeldzamer oorzakelijk voorwerp bij bepaalde naamwoordelijke gezegdes, of bijvoorbeeld tijd, plaats, wijze of maat.', 'Een vast voorzetsel en een letterlijke plaatsbetekenis zijn aanwijzingen, geen losse absolute wetten. Valentie hangt van de betekenis af: lezen kan met of zonder genoemd voorwerp. Bij Ik ben mijn sleutels kwijt is mijn sleutels volgens de huidige E-ANS oorzakelijk voorwerp: een complement bij het naamwoordelijke kwijt zijn, geen letterlijke oorzaak. Een plaatsbepaling kan ook door een werkwoord worden gevraagd, zoals bij wonen.', ['eans-voorzetselvoorwerp', 'eans-oorzakelijkvoorwerp', 'eans-zinsdeelproeven']),
    ],
    decision: [
      { question: 'Kan deze groep in een natuurlijke passieve omzetting onderwerp worden?', yes: 'Dat steunt een analyse als lijdend voorwerp; controleer het werkwoord en de betekenis.', no: 'Sluit niet blind elk voorwerp uit: onderzoek eerst de werkwoordbetekenis en andere complementen.' },
      { question: 'Is er een ontvanger naast een gegeven zaak of boodschap?', yes: 'Onderzoek meewerkend voorwerp; vergelijk bij geven of vertellen de versie met aan.', no: 'Onderzoek een andere deelnemer, een ondervindend complement of vrije informatie.' },
      { question: 'Hoort het voorzetsel bij het vaste patroon in deze betekenis?', yes: 'Onderzoek een voorzetselvoorwerp, zoals wachten op of trots zijn op.', no: 'Vraag of de groep plaats, tijd, wijze, reden of maat aangeeft; controleer de context.' },
      { question: 'Lijkt de groep een voorwerp, maar noemt zij uitsluitend hoeveelheid, duur of gewicht?', yes: 'Onderzoek een maatbepaling; twintig kilo wegen is geen normaal passief met twintig kilo als onderwerp.', no: 'Vergelijk opnieuw het werkwoordpatroon met wat de deelnemer of bepaling toevoegt.' },
    ],
    arena: [
      {
        ...arena(4, 1, 1, 'Ontgrendel het lijdend voorwerp door het passieve onderwerp te vinden.', 'Het verslag wordt nagekeken door de docent is de passieve omzetting. Het verslag wordt onderwerp; in de actieve zin is het lijdend voorwerp.', 'Wie kijkt na is niet hetzelfde als wat nagekeken wordt.'),
        kind: 'gate', diagnosis: diagnosis('De docent kijkt het verslag na.', [3, 4], 'Klik de hele groep aan die in Het verslag wordt nagekeken onderwerp wordt.', 'Het verslag is het directe voorwerp van nakijken. De docent is het onderwerp van de actieve zin.'),
        options: [{ id: 'lv', text: 'Het verslag is lijdend voorwerp.', feedback: 'De gewone passieve proef bevestigt de directe voorwerpsrelatie.' }, { id: 'mv', text: 'Het verslag is meewerkend voorwerp.', feedback: 'Het verslag is hier geen ontvanger; het wordt zelf nagekeken.' }, { id: 'plaats', text: 'Het verslag is een plaatsbepaling.', feedback: 'Het noemt het nagekeken document, niet de plaats van de handeling.' }], answer: 'lv',
      },
      {
        ...arena(4, 2, 2, 'Zet de ontvanger met aan na het gegeven voorwerp.', 'Noor geeft Sam het boek en Noor geeft het boek aan Sam beschrijven dezelfde overdracht. Sam is de ontvanger; het boek is de overgedragen zaak.', 'In de gevraagde versie staan het boek en aan Sam in die volgorde.'),
        kind: 'slots', blocks: [{ id: 'noor', text: 'Noor' }, { id: 'geeft', text: 'geeft' }, { id: 'boek', text: 'het boek' }, { id: 'sam', text: 'aan Sam' }],
        slots: [{ id: 'voor', label: 'Onderwerp', capacity: 1 }, { id: 'pv', label: 'Gezegde', capacity: 1 }, { id: 'zaak', label: 'Lijdend voorwerp', capacity: 1 }, { id: 'ontvanger', label: 'Meewerkend voorwerp met aan', capacity: 1 }],
        initial: { voor: [], pv: [], zaak: [], ontvanger: [] }, accept: [{ voor: ['noor'], pv: ['geeft'], zaak: ['boek'], ontvanger: ['sam'] }],
      },
      {
        ...arena(4, 3, 3, 'Verbind het vaste werkwoord met het voorzetsel dat zijn complement inleidt.', 'Twijfelen aan is het relevante patroon. Aan het voorstel is een voorzetselvoorwerp. Vandaag geeft tijd en hoeft geen door het werkwoord gevraagde deelnemer te zijn.', 'Zoek waarover de twijfel gaat; vandaag benoemt niet de inhoud van de twijfel.'),
        kind: 'tether', tokens: tokens('Noor twijfelt vandaag aan het voorstel.'), links: [{ from: 'w1', to: 'w3' }],
        distractorFeedback: { w2: 'Vandaag geeft het moment van de twijfel en is een tijdsbepaling.', w0: 'Noor is het onderwerp, niet het voorzetsel van het patroon twijfelen aan.' },
      },
      {
        ...arena(4, 4, 3, 'Onderzoek de plaatsgroep voordat je haar functie kiest.', 'Bij de bushalte zegt waar Noor wacht. Het is een plaatsbepaling. Op de bus zou bij wachten juist kunnen zeggen waarop zij wacht; het vaste patroon én de context maken het verschil.', 'Kun je bij de bushalte vervangen door naast het station terwijl je nog steeds over wachten op dezelfde bus praat?', ['Noor', 'wacht', 'bij de bushalte.']),
        kind: 'gate', diagnosis: diagnosis('Noor wacht bij de bushalte.', [2, 3, 4], 'Klik de hele groep aan die antwoord geeft op Waar wacht Noor?', 'Bij de bushalte is het antwoord op de plaatsvraag.'),
        options: [{ id: 'plaats', text: 'Bijwoordelijke bepaling van plaats', feedback: 'De groep lokaliseert het wachten.' }, { id: 'vv', text: 'Voorzetselvoorwerp bij wachten op', feedback: 'Deze groep gebruikt bij en geeft een letterlijke locatie; het benoemt niet waarop Noor wacht.' }, { id: 'mv', text: 'Meewerkend voorwerp: ontvanger', feedback: 'De bushalte ontvangt hier geen overgedragen zaak of boodschap.' }], answer: 'plaats',
      },
      {
        ...arena(4, 5, 1, 'Ontgrendel de functie van de gewichtsgroep door eerst de maat aan te wijzen.', 'Twintig kilo drukt het gewicht van de koffer uit. Twintig kilo wordt gewogen door de koffer is geen omzetting met dezelfde betekenis. De groep is hier een maatbepaling.', 'Een antwoord op hoeveel is niet automatisch een direct voorwerp.', ['De koffer', 'weegt', 'twintig kilo.']),
        kind: 'gate', diagnosis: diagnosis('De koffer weegt twintig kilo.', [3, 4], 'Klik het volledige antwoord op Hoeveel weegt de koffer? aan.', 'Twintig kilo is de maat die het gewicht uitdrukt.'),
        options: [{ id: 'maat', text: 'Bijwoordelijke bepaling van maat', feedback: 'De groep benoemt het gewicht in deze betekenis van wegen.' }, { id: 'lv', text: 'Lijdend voorwerp', feedback: 'Dit is niet iemand die twintig kilo op een weegschaal afweegt; het noemt het gewicht van de koffer.' }, { id: 'mv', text: 'Meewerkend voorwerp', feedback: 'Twintig kilo is geen ontvanger of belanghebbende.' }], answer: 'maat',
      },
      {
        ...arena(4, 6, 3, 'Onderzoek het gezegde voordat je dit minder gewone voorwerp benoemt.', 'Ben kwijt is een naamwoordelijk gezegde. Mijn sleutels vult die verbinding aan en wordt in de huidige E-ANS een oorzakelijk voorwerp genoemd. De naam betekent hier niet dat sleutels de oorzaak van het kwijt zijn zijn.', 'Vergelijk Ik zoek mijn sleutels met Ik ben mijn sleutels kwijt: het gezegde heeft een andere bouw.', ['Ik', 'ben', 'mijn sleutels', 'kwijt.']),
        kind: 'gate', diagnosis: diagnosis('Ik ben mijn sleutels kwijt.', [1, 4], 'Klik de twee delen aan die samen het naamwoordelijke gezegde vormen.', 'Ben en kwijt vormen het naamwoordelijke gezegde. Mijn sleutels is het aanvullende voorwerp bij deze verbinding.'),
        options: [{ id: 'oorzakelijk', text: 'Mijn sleutels: oorzakelijk voorwerp bij kwijt zijn', feedback: 'Dit is het minder gewone voorwerp bij een van deze naamwoordelijke gezegdes.' }, { id: 'lijdend', text: 'Mijn sleutels: lijdend voorwerp bij een werkwoordelijk zoek-gezegde', feedback: 'Dat zou passen bij Ik zoek mijn sleutels, maar deze zin gebruikt ben kwijt.' }, { id: 'plaats', text: 'Mijn sleutels: bijwoordelijke bepaling van plaats', feedback: 'De groep benoemt de kwijtgeraakte zaak; er wordt geen locatie genoemd.' }], answer: 'oorzakelijk',
      },
    ],
    debugger: [
      debug(4, 1, 3, 'Noor twijfelt op het voorstel.', [2], 'Klik het verkeerde voorzetsel. Verander uitsluitend het voorzetsel zodat de zin twijfel over het voorstel uitdrukt.', ['Noor twijfelt aan het voorstel.'], 'De gebruikte werkwoordverbinding is twijfelen aan. Het voorstel is hier geen letterlijke plaats waarop iemand twijfelt.', 'Denk aan de vaste verbinding twijfelen aan iets.'),
      debug(4, 2, 3, 'Noor is trots aan haar werk.', [3], 'Klik het verkeerde voorzetsel. Herstel alleen dat woord.', ['Noor is trots op haar werk.'], 'Trots zijn op neemt in deze betekenis het voorzetselvoorwerp op haar werk.', 'De eigenschap trots heeft in deze verbinding het vaste voorzetsel op.'),
      debug(4, 3, 2, 'Noor geeft aan het boek Sam.', [2], 'Sam moet het boek ontvangen. Klik aan: het staat vóór de verkeerde groep. Verplaats uitsluitend dit voorzetsel naar de ontvanger.', ['Noor geeft het boek aan Sam.'], 'Het boek is de overgedragen zaak. Aan Sam benoemt de ontvanger in de gevraagde volgorde.', 'Houd het boek samen en plaats aan direct vóór Sam.'),
      debug(4, 4, 3, 'Noor rekent aan hulp van Sam.', [2], 'De zin bedoelt dat Noor hulp verwacht. Klik het verkeerde voorzetsel en verander alleen dat woord.', ['Noor rekent op hulp van Sam.'], 'Rekenen op betekent hier verwachten of vertrouwen op. Rekenen aan kan bij berekeningen voorkomen, maar drukt deze bedoelde verwachting niet uit.', 'Kies het werkwoordpatroon dat past bij hulp verwachten.'),
    ],
    summary: {
      title: 'Lees het patroon, test de relatie',
      points: ['Lijdend voorwerp: rechtstreeks bij de werkwoordbetekenis; een natuurlijke passieve omzetting is een bruikbare controle.', 'Meewerkend voorwerp: bij geschikte overdrachtswerkwoorden de ontvanger, vaak vergelijkbaar met een aan-versie. Belanghebbend en ondervindend benoemen andere relaties.', 'Voorzetselvoorwerp: een complement in een vast patroon; bijwoordelijke bepaling: bijvoorbeeld tijd, plaats, wijze of maat. Vorm alleen is niet beslissend.', 'Oorzakelijk voorwerp: een complement bij enkele naamwoordelijke gezegdes, zoals mijn sleutels bij kwijt zijn. Valentie: welk patroon dit werkwoord in deze betekenis oproept.'],
      transfer: 'Schrijf één zin met wachten op de trein en één met wachten bij het station. Voeg aan beide vandaag toe. Leg bij iedere groep uit wat het werkwoordpatroon invult en wat tijd of plaats van de gebeurtenis aangeeft.',
    },
    legacyLessonIds: ['z3', 'p13', 'p14', 'p15', 'p16', 'p17', 'p18'],
  },
];
