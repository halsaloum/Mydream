import type { StepInput } from '../../schema';

/** Onderzoek bij d6: een derde uitlegronde op onderzoeksniveau, daarna zwaardere oefeningen. */
export const ONDERZOEK_D6: StepInput[] = [
  {
    kind: 'explain',
    id: 'onderzoek',
    title: 'De randen van de buiging',
    panels: [
      {
        text: 'Waarom staat afleiding binnen en buiging buiten? Joan Bybee (1985) vergeleek vijftig talen en vond een schaal van *relevantie*. Hoe meer een categorie de handeling zelf verandert, hoe dichter ze bij de stam staat: aspect en tijd dichtbij, persoon en getal het verst weg. Afleiding verandert het meest aan de betekenis en zit daarom het diepst. Het Nederlands volgt de schaal: in *werkten* plakt de tijd (*-te*) direct aan de stam, het getal (*-n*) pas daarna. Bybee zag nog iets: zeer relevante categorieën versmelten vaak met de stam. De tijd kan in de klinker kruipen (*zong*); persoon en getal blijven meestal een los stukje.',
        rule: 'Hoe meer een stukje de handeling zelf verandert, hoe dichter het bij de stam staat: eerst tijd, dan getal.',
        bracket: {
          q: 'Bouw werkten van binnen naar buiten',
          tree: '[[werk te] n]',
          nodes: [
            {
              w: 'werkte',
              cat: 'ww, verleden tijd',
              note: 'Eerst de tijd: -te plakt direct aan de stam. Tijd zegt iets over het werken zelf, namelijk wanneer.',
            },
            {
              w: 'werkten',
              cat: 'ww, verleden tijd, meervoud',
              note: 'Dan pas het getal: -n hoort bij het onderwerp wij, niet bij het werken. Minder relevant, dus verder naar buiten.',
            },
          ],
          traps: [{ w: 'ten', note: '-te en -n vormen geen eenheid. Eerst werk + te, dan werkte + n: tijd binnen, getal buiten.' }],
          note: 'Tijd binnen, getal buiten: precies de volgorde die Bybee in tientallen talen vond.',
        },
        deep: {
          q: 'Kruipt het getal nooit in de stam?',
          a: 'Soms, maar alleen in oude vormen. In *was* en *waren* wisselen de *s* en de *r* met het getal, en in *gaf*, *gaven* en *sprak*, *spraken* is de klinker in het meervoud lang. Dat zijn resten van oude klankwetten, geen levend patroon. Nieuwe werkwoorden krijgen altijd een los stukje: *wij appten*. Zo voorspelt de schaal van Bybee ook wat een taal het eerst opruimt.',
        },
      },
      {
        text: 'Een van de drie toetsen uit de uitleg rammelt. Martin Haspelmath (1996) wees op *woordsoortveranderende buiging*: deelwoorden en infinitieven zijn regelmatig, gelden voor elk werkwoord en maken geen nieuw woord, dus buiging. Toch gedragen ze zich als een andere woordsoort: *een lachend kind* staat op de plek van een bijvoeglijk naamwoord, *het lezen* op die van een zelfstandig naamwoord. De grens is een glijbaan. Een deelwoord dat vaak als bijvoeglijk naamwoord staat, wordt er langzaam een: dan kan het *heel* ervoor krijgen, een vergrotende trap en *-heid*.',
        rule: 'Buiging kan de woordsoort wél veranderen: een deelwoord staat als bijvoeglijk naamwoord, een infinitief als zelfstandig naamwoord.',
        lab: {
          label: 'Tik een deelwoord',
          chips: [
            {
              k: 'lachend',
              out: 'nog deelwoord',
              note: 'Een lachend kind kan, maar heel lachend en lachender klinken vreemd. Het blijft een vorm van lachen.',
            },
            { k: 'gelezen', out: 'nog deelwoord', note: 'Een gelezen boek, maar niet heel gelezen of gelezener.' },
            {
              k: 'geschikt',
              out: 'al bijvoeglijk naamwoord',
              note: 'In de betekenis ‘passend’: heel geschikt, geschikter, geschiktheid. Alle toetsen slagen, en van schikken is weinig meer te voelen.',
            },
            {
              k: 'gesloten',
              out: 'allebei',
              note: 'De deur is gesloten: deelwoord. Een heel gesloten type, geslotenheid: bijvoeglijk naamwoord. Zelfde vorm, twee woorden.',
            },
          ],
        },
        deep: {
          q: 'Waarom is dat een probleem voor de theorie?',
          a: 'Omdat de netste toets voor afleiding (nieuwe woordsoort) hier faalt. Haspelmath ziet buiging en afleiding daarom eerder als twee uiteinden van een schaal dan als twee hokjes. Een deelwoord als *geschikt* is langs die schaal opgeschoven: van vorm van een werkwoord naar een eigen woord in het woordenboek.',
        },
      },
      {
        text: 'Het Nederlands verloor zijn naamvallen, maar in vaste uitdrukkingen leeft de buiging door. *Te allen tijde* heeft een oude derde naamval, *in groten getale* en *van ganser harte* ook, en *’s morgens* komt van *des morgens*, een tweede naamval. Die vormen maak je niet meer met een regel; je slaat ze als geheel op. Zo wordt contextuele buiging alsnog lexicon, het omgekeerde van wat Anderson beschreef. Wie de oude regel niet kent, schrijft *ten alle tijden*, en dat is fout.',
        rule: 'Oude buiging overleeft in vaste uitdrukkingen: *te allen tijde*, *in groten getale*, *van ganser harte*.',
        mark: {
          q: 'Tik de woorden met een oude naamvalsuitgang',
          sentence: 'Zij kwamen in groten getale en bedankten ons van ganser harte.',
          targets: [3, 4, 9, 10],
          note: 'groten, getale, ganser, harte: vier uitgangen van een naamval die de zin allang niet meer eist. Ze zitten vast in de uitdrukking, als een fossiel in steen.',
        },
        deep: {
          q: 'Wat zijn ter en ten?',
          a: '*Te* plus een oud lidwoord in de derde naamval: *ter* is *te der*, bij vrouwelijke woorden (*ter plaatse*, *ter wereld*), *ten* is *te den*, bij mannelijke en onzijdige (*ten einde*, *ten slotte*). De uitdrukking bewaart dus zelfs het oude geslacht van het woord, iets wat *de* allang niet meer laat zien.',
        },
      },
      {
        text: 'Is de *-s* in *Jans fiets* nog buiging? Het Engelse *’s* hangt aan een hele groep: *the king of England’s hat*. Het Nederlandse *-s* kan dat niet: *de koning van Engelands hoed* is onmogelijk. Het hangt vooral aan eigennamen, aan woorden die als naam werken, zoals *moeder* en *opa*, en aan een paar voornaamwoorden: *moeders fiets*, *iemands jas*, *elkaars hulp*. Zo kieskeurig gedraagt zich eerder een affix dan een klitiek (vergelijk de toetsen van Zwicky en Pullum in de master van Het woord). Historisch is de bezits-s een van de laatste levende resten van de tweede naamval. Wil je meer, dan gebruik je een groep: *de fiets van de buurman*, of informeel *de buurman z’n fiets*.',
        rule: 'De bezits-s is kieskeurig: vooral bij namen, woorden die als naam werken en *iemand*. Aan een willekeurige woordgroep kan hij niet.',
        quiz: {
          q: 'Welke vorm kan in verzorgd Nederlands?',
          options: ['Jans fiets', 'de leraars fiets', 'de koning van Engelands hoed'],
          answer: 'Jans fiets',
          why: 'Vooral een eigennaam, een woord dat als naam werkt of iemand krijgt de -s. Bij de leraar en bij een hele groep moet je omschrijven: de fiets van de leraar, de hoed van de koning van Engeland.',
        },
        deep: {
          q: 'En de apostrof?',
          a: 'Die is spelling, geen buiging: *Jans* zonder, *Anna’s* en *Hans’* met, omdat de uitspraak anders misloopt (zie De letter). Het morfeem is in alle drie dezelfde *-s*.',
        },
      },
    ],
  },
  {
    kind: 'order',
    id: 'fins',
    prompt: 'Fins: talo = huis, i = meervoud, ssa = in, ni = mijn. Anders dan het Turks zet het Fins het bezit ná de naamval. Bouw ‘in mijn huizen’.',
    tiles: ['ssa', 'talo', 'ni', 'i'],
    answer: 'talo i ssa ni',
    why: 'talo-i-ssa-ni: het meervoud zit het dichtst bij de stam, want het zegt iets over de huizen zelf. Dan de naamval, dan het bezit. Het Turks (ev-ler-im-de) zet het bezit vóór de naamval: welke categorie na het meervoud komt, verschilt per taal, maar het meervoud staat bijna altijd dichter bij de stam dan de naamval.',
  },
  {
    kind: 'chat',
    id: 'studiegenoot',
    prompt: 'App met je studiegenoot',
    intro: 'Kies telkens het antwoord met de goede vorm.',
    contact: { name: 'Sam', role: 'je studiegenoot', initials: 'S' },
    rounds: [
      {
        say: 'Hoe was de lezing gisteren?',
        options: ['Vol! De studenten kwamen in grote getale.', 'Vol! De studenten kwamen in groten getale.'],
        right: 1,
        fix: 'grote getale → groten getale',
        why: 'Een versteende naamvalsvorm: je slaat hem als geheel op, met de oude -n.',
      },
      {
        say: 'Wiens aantekeningen heb je gebruikt?',
        options: ['Jans aantekeningen, hij schrijft alles op.', 'Jan’s aantekeningen, hij schrijft alles op.'],
        right: 0,
        fix: 'Jan’s → Jans',
        why: 'De bezits-s plakt gewoon aan de naam. Een apostrof komt alleen na een lange klinker die je met één letter schrijft (Anna’s) of na een s-klank (Hans’).',
      },
      {
        say: 'Was de zaal nog open na afloop?',
        options: ['Nee, de deur was al gesloten.', 'Nee, de deur was heel gesloten.'],
        right: 0,
        fix: 'heel gesloten → al gesloten',
        why: 'Over een deur is gesloten een deelwoord: dicht. Heel gesloten kan alleen in de bijvoeglijke betekenis: een heel gesloten type.',
      },
      {
        say: 'Kan ik je morgen bellen?',
        options: ['Ten alle tijden!', 'Te allen tijde!'],
        right: 1,
        fix: 'ten alle tijden → te allen tijde',
        why: 'Een oude derde naamval, enkelvoud: te allen tijde. Zonder de regel moet je de vorm uit je hoofd kennen.',
      },
    ],
    bye: 'Top, tot morgen dan!',
  },
  {
    kind: 'rewrite',
    id: 'allen-tijde',
    prompt: 'Verbeter de versteende uitdrukking.',
    source: 'Je kunt ons ten alle tijden bellen.',
    accept: ['Je kunt ons te allen tijde bellen.', 'Te allen tijde kun je ons bellen.'],
    why: 'te allen tijde: een oude derde naamval in het enkelvoud. Ten is te den, maar vóór allen staat geen lidwoord. De vorm ten alle tijden is dus fout.',
  },
  {
    kind: 'sort',
    id: 'vier-soorten',
    prompt: 'Inherente buiging, contextuele buiging, afleiding of versteende buiging?',
    buckets: ['inherente buiging', 'contextuele buiging', 'afleiding', 'versteende buiging'],
    items: [
      { t: 'boeken', b: 0 },
      { t: 'werkte', b: 0 },
      { t: 'boeiender', b: 0 },
      { t: 'hij werkt', b: 1 },
      { t: 'de grote man', b: 1 },
      { t: 'lezer', b: 2 },
      { t: 'geschiktheid', b: 2 },
      { t: 'te allen tijde', b: 3 },
      { t: 'van ganser harte', b: 3 },
      { t: '’s morgens', b: 3 },
    ],
    why: 'Meervoud, verleden tijd en vergrotende trap kies je om de betekenis: inherent. De -t en de -e eist de zin: contextueel. Lezer en geschiktheid zijn nieuwe woorden, en in geschiktheid is het deelwoord geschikt al bijvoeglijk naamwoord geworden. Te allen tijde, van ganser harte en ’s morgens zijn naamvalsvormen die alleen nog in de uitdrukking leven.',
  },
  {
    kind: 'swipe',
    id: 'randen',
    prompt: 'Klopt deze zin?',
    cards: [
      {
        t: 'Volgens Bybee staat een categorie dichter bij de stam naarmate ze meer over de handeling zelf zegt.',
        ok: true,
        why: 'De schaal van relevantie: tijd dichtbij, persoon en getal ver weg.',
      },
      {
        t: 'In werkten staat het getal dichter bij de stam dan de tijd.',
        ok: false,
        fix: 'werk-te-n: eerst de tijd, dan het getal',
        why: 'Precies de volgorde die Bybee voorspelt.',
      },
      {
        t: 'Haspelmath liet zien dat buiging nooit de woordsoort verandert.',
        ok: false,
        fix: 'Juist wel: deelwoorden en infinitieven zijn buiging én staan als een andere woordsoort',
        why: 'Daarom is de woordsoorttoets voor afleiding niet waterdicht.',
      },
      {
        t: 'In een geschikte kandidaat is het deelwoord geschikt helemaal bijvoeglijk naamwoord geworden.',
        ok: true,
        why: 'Heel geschikt, geschikter, geschiktheid: alle toetsen slagen.',
      },
      {
        t: 'Te allen tijde maak je met een levende regel van het Nederlands.',
        ok: false,
        fix: 'Het is een versteende naamvalsvorm die je als geheel opslaat',
        why: 'De derde naamval bestaat niet meer; de uitdrukking wel.',
      },
      {
        t: 'De Nederlandse bezits-s kan aan een hele woordgroep hangen, net als het Engelse ’s.',
        ok: false,
        fix: 'Vooral aan namen, woorden die als naam werken en iemand',
        why: 'Dat kieskeurige gedrag past eerder bij een affix dan bij een klitiek.',
      },
      { t: 'In het Fins staat het meervoud dichter bij de stam dan het bezit.', ok: true, why: 'talo-i-ssa-ni: meervoud, naamval, bezit.' },
    ],
  },
];
