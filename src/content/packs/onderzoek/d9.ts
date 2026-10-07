import type { StepInput } from '../../schema';

/** Onderzoek bij d9: een derde uitlegronde op onderzoeksniveau, daarna zwaardere oefeningen. */
export const ONDERZOEK_D9: StepInput[] = [
  {
    kind: 'explain',
    id: 'onderzoek',
    title: 'Het eerste deel aan het stuur',
    panels: [
      {
        text: 'Hoe kies je zo snel de relatie tussen de delen? Christina Gagné en Edward Shoben (1997) lieten zien dat het eerste deel die keuze stuurt. Elk eerste deel heeft een geschiedenis. *Berg* staat bijna altijd voor ‘in de bergen’ (*berghut*, *bergdorp*, *bergpad*), *kinder* bijna altijd voor ‘voor kinderen’. Een nieuw woord dat die gewone relatie volgt, begrijp je meteen; een woord met een zeldzame relatie kost een moment extra. De relaties van het hoofd hielpen nauwelijks. Je leest een samenstelling dus met de familie van het eerste deel in je achterhoofd.',
        rule: 'Het eerste deel brengt zijn gewone relatie mee: *berg-* is bijna altijd ‘in de bergen’.',
        lab: {
          label: 'Tik een eerste deel',
          chips: [
            {
              k: 'berg-',
              out: 'berghut, bergdorp, bergpad, bergmeer: in de bergen',
              note: 'Een nieuw woord als bergfeest lees je meteen als een feest in de bergen.',
            },
            {
              k: 'kinder-',
              out: 'kinderstoel, kinderboek, kinderarts: voor kinderen',
              note: 'Zo vast dat kinderboekenschrijver bijna altijd als schrijver van kinderboeken wordt gelezen.',
            },
            { k: 'zomer-', out: 'zomerjas, zomeravond, zomervakantie: in de zomer', note: 'Tijd is de vaste relatie van zomer-.' },
            {
              k: 'melk-',
              out: 'melkfles (voor), melkchocolade (met), melkkoe (die geeft), melkboer (die verkoopt)',
              note: 'Een verdeelde familie. Een nieuw melk-woord vraagt een moment: welke relatie?',
            },
          ],
        },
        deep: {
          q: 'Waarom het eerste deel en niet het hoofd?',
          a: 'Gagné en Shoben vonden dat de relaties van het hoofd nauwelijks meetelden. Een verklaring: het eerste deel komt het eerst binnen en zet de lezer al op een spoor voordat het hoofd er is. Downing en Levi (zie de verdieping) beschreven welke relaties er zijn; Gagné en Shoben lieten zien hoe snel je ze kiest.',
        },
      },
      {
        text: 'Samenstellingen laten ook sporen na in het geheugen van losse woorden. Robert Schreuder en Harald Baayen (1997) keken naar de *familie* van een woord: alle samenstellingen en afleidingen waarin het voorkomt. *Huis* heeft een enorme familie (*huisarts*, *huiskamer*, *huiswerk*, *boerenhuis*, *huiselijk*), *pinguïn* een kleine. Een woord met een grote familie herken je sneller, ook als het zelf niet vaker voorkomt. Hoe vaak de familieleden samen voorkomen, deed er niet toe; alleen hun aantal. Een simpel woord is dus nooit alleen: elke samenstelling die je kent, maakt de delen sterker.',
        rule: 'Familiegrootte: hoe meer samenstellingen en afleidingen een woord heeft, hoe sneller je het herkent.',
        quiz: {
          q: 'Twee even vaak gebruikte woorden; het ene komt in tientallen samenstellingen voor, het andere in twee. Wat voorspellen Schreuder en Baayen?',
          options: [
            'Het woord met de grote familie wordt sneller herkend',
            'Het woord met de kleine familie wordt sneller herkend',
            'Geen verschil: alleen de frequentie van het woord zelf telt',
          ],
          answer: 'Het woord met de grote familie wordt sneller herkend',
          why: 'Het aantal familieleden telt, los van de frequentie van het woord zelf.',
        },
        deep: {
          q: 'Wat zegt dit over de woordboom?',
          a: 'Dat een boom niet alleen van boven naar beneden werkt. *Huisarts* is gebouwd uit *huis*, maar *huis* wordt op zijn beurt sterker door *huisarts*. Woorden en hun delen vormen een netwerk waarin activatie beide kanten op loopt. Daar past een lexicon als netwerk beter bij dan een lexicon als lijst.',
        },
      },
      {
        text: 'Terug naar de synthetische samenstelling. Een *glasblazer* blaast glas, een *eierkoker* kookt eieren: het eerste deel is het lijdend voorwerp van het verstopte werkwoord. Thomas Roeper en Muffy Siegel (1978) merkten op wat er nooit vooraan staat: het *onderwerp*. Een *kindlacher* voor ‘een kind dat lacht’ bestaat niet, en kan niet bestaan. Vooraan staat wat direct naast het werkwoord hoort: het lijdend voorwerp, of een bepaling van plaats of tijd (*thuiswerker*, *nachtwerker*). Zet het verstopte werkwoord op het toneel en tik aan wat het bewerkt.',
        rule: 'Vooraan in een synthetische samenstelling staat het lijdend voorwerp of een bepaling, nooit het onderwerp.',
        cast: {
          q: 'Tik het lijdend voorwerp van het verstopte werkwoord',
          rounds: [
            {
              text: 'glasblazer',
              ask: 'Tik wat er geblazen wordt',
              cast: ['glas', 'mes', 'pan', 'visser'],
              answer: ['glas'],
              then: { q: 'Wat is glas bij blazen?', options: ['lijdend voorwerp', 'onderwerp', 'plaats'], answer: 'lijdend voorwerp' },
              note: 'Iemand blaast glas. Het lijdend voorwerp mag vooraan: glas + blazer.',
            },
            {
              text: 'eierkoker',
              ask: 'Tik wat er gekookt wordt',
              cast: ['ei', 'kip', 'pan', 'glas'],
              answer: ['ei'],
              then: {
                q: 'En de pan? Die doet mee, maar…',
                options: ['is geen lijdend voorwerp: je kookt het ei, niet de pan', 'is ook een lijdend voorwerp'],
                answer: 'is geen lijdend voorwerp: je kookt het ei, niet de pan',
              },
              note: 'Je kookt eieren, in een pan. Alleen het ei kan vooraan: eierkoker.',
            },
            {
              text: 'muizenvanger',
              ask: 'Tik wat er gevangen wordt',
              cast: ['muis', 'computermuis', 'kip', 'huis'],
              answer: ['muis'],
              then: {
                q: 'Een kat die muizen vangt is een muizenvanger. Een muis die kaas eet is een…',
                options: ['kaaseter', 'muizeneter'],
                answer: 'kaaseter',
              },
              note: 'Het onderwerp (de muis) komt nooit vooraan; het lijdend voorwerp (de kaas) wel.',
            },
            {
              text: 'kasteelheer',
              ask: 'Tik het lijdend voorwerp, als er een werkwoord verstopt zit',
              cast: ['kasteel', 'huis', 'munten', 'boot'],
              answer: [],
              note: 'Heer is geen werkwoord met -er. Een kasteelheer heert geen kasteel: een gewone samenstelling, geen synthetische.',
            },
          ],
          note: 'Drie keer stond het lijdend voorwerp vooraan, en één keer zat er geen werkwoord in. Het onderwerp kwam nergens vooraan: dat is de regel van Roeper en Siegel.',
        },
        deep: {
          q: 'Geldt dat ook voor samenstellingen met een deelwoord?',
          a: 'Ja. *Handgemaakt* (gemaakt met de hand), *zongedroogd* (gedroogd door de zon), *huisgemaakt*. Hier kan het eerste deel wel de doener zijn: *zongedroogd*. Dat komt doordat het deelwoord lijdend is: de zon is daar een bepaling (*door de zon*), geen onderwerp van een zin. Het patroon blijft dus overeind: wat naast het werkwoord staat, mag vooraan.',
        },
      },
      {
        text: 'Wat betekent dit voor je eigen tekst? Een samenstelling zegt niet welke relatie je bedoelt, en de lezer vult de gewoonste in. Soms is dat niet wat je wilt. Een *vrouwenarts* is een gynaecoloog, geen arts die een vrouw is; *huisarts* noemt een plaats, *oogarts* een lichaamsdeel, *kinderarts* de patiënt. Wil je een andere relatie dan de gewone, kies dan de woordgroep: *een vrouwelijke arts*, *een arts voor volwassenen*. Tik de woorden waarin het eerste deel de patiënt noemt.',
        rule: 'Volgt de bedoelde relatie niet vanzelf uit het eerste deel, schrijf dan een woordgroep.',
        mark: {
          q: 'Tik de artsen waarbij het eerste deel de patiënt noemt',
          sentence: 'kinderarts tandarts vrouwenarts huisarts dierenarts oogarts',
          targets: [0, 2, 4],
          note: 'kinderarts, vrouwenarts en dierenarts: de patiënt. tandarts en oogarts: een lichaamsdeel. huisarts: het huis, geen patiënt.',
        },
      },
    ],
  },
  {
    kind: 'sort',
    id: 'eerste-deel',
    prompt: 'Welke rol speelt het eerste deel?',
    buckets: ['lijdend voorwerp', 'plaats of tijd', 'geen werkwoord erin'],
    items: [
      { t: 'aardappelschiller', b: 0 },
      { t: 'boekbinder', b: 0 },
      { t: 'glasblazer', b: 0 },
      { t: 'muizenvanger', b: 0 },
      { t: 'thuiswerker', b: 1 },
      { t: 'nachtwerker', b: 1 },
      { t: 'zondagsrijder', b: 1 },
      { t: 'buitenspeler', b: 1 },
      { t: 'kasteelheer', b: 2 },
      { t: 'tandarts', b: 2 },
    ],
    why: 'Een verstopt werkwoord met zijn lijdend voorwerp (aardappels schillen, glas blazen), een verstopt werkwoord met een plaats of tijd (thuis werken, zondags rijden), of helemaal geen werkwoord (heer, arts).',
  },
  {
    kind: 'chat',
    id: 'arts-chat',
    prompt: 'App met je huisgenoot',
    intro: 'Kies telkens het antwoord dat klopt met hoe een samenstelling werkt.',
    contact: { name: 'Noor', role: 'je huisgenoot', initials: 'N' },
    rounds: [
      {
        say: 'Mijn moeder is net klaar met geneeskunde. Hoe noem ik haar nu in één woord?',
        options: ['Een vrouwenarts.', 'Dat lukt niet in één woord: een vrouwelijke arts.'],
        right: 1,
        fix: 'vrouwenarts → vrouwelijke arts',
        why: 'Vrouwenarts noemt de patiënt: een gynaecoloog. Voor de arts zelf kies je de woordgroep.',
      },
      {
        say: 'Ze opent een praktijk hoog in de Alpen. Wat is dat dan?',
        options: ['Een bergpraktijk: een praktijk in de bergen.', 'Een praktijkberg.'],
        right: 0,
        fix: 'praktijkberg → bergpraktijk',
        why: 'berg- brengt zijn vaste relatie mee (in de bergen), en het hoofd staat rechts.',
      },
      {
        say: 'Mijn broertje lacht de hele dag. Is hij dan een kindlacher?',
        options: ['Nee, dat woord kan niet: het onderwerp staat nooit vooraan.', 'Ja, kindlacher: een kind dat lacht.'],
        right: 0,
        fix: 'kindlacher → een lachend kind',
        why: 'Het eerste deel van een synthetische samenstelling is nooit het onderwerp. Een lachebek is iets anders: lach + e + bek, zonder -er.',
      },
      {
        say: 'Laatste vraag: is een melkboer een boer?',
        options: ['Nee, hij verkoopt melk. Welke relatie melk- heeft, weet je per woord.', 'Ja, elke boer is een boer.'],
        right: 0,
        fix: 'ja → nee, hij verkoopt melk',
        why: 'melk- heeft een verdeelde familie: een melkkoe geeft melk, een melkboer verkoopt hem. De relatie komt uit je kennis van de wereld.',
      },
    ],
    bye: 'Dank je, nu snap ik mijn eigen familie beter.',
  },
  {
    kind: 'bet',
    id: 'kindlacher',
    prompt: 'Waarom kan ‘kindlacher’ niet ‘een kind dat lacht’ betekenen?',
    options: ['Het eerste deel is dan het onderwerp, en dat staat nooit vooraan', 'Lachen is een sterk werkwoord', 'Kind heeft het meervoud kinderen'],
    answer: 'Het eerste deel is dan het onderwerp, en dat staat nooit vooraan',
    why: 'Roeper en Siegel: vooraan staat wat naast het werkwoord hoort, het lijdend voorwerp of een bepaling. Het onderwerp niet.',
  },
  {
    kind: 'type',
    id: 'glasblazer',
    prompt: 'Typ de synthetische samenstelling.',
    before: 'Iemand die glas blaast, is een',
    after: '.',
    hint: 'glas + blazen + er',
    answer: 'glasblazer',
    why: 'Het lijdend voorwerp glas komt vooraan, dan de stam blaas en -er. Tussen klinkers wordt de s een z: blazer.',
  },
  {
    kind: 'swipe',
    id: 'relatie-waar',
    prompt: 'Klopt deze zin?',
    cards: [
      {
        t: 'Volgens Gagné en Shoben stuurt het eerste deel de keuze van de relatie.',
        ok: true,
        why: 'De gewone relatie van het eerste deel wint; het hoofd helpt nauwelijks.',
      },
      {
        t: 'Een woord met een grote familie wordt trager herkend, want er is meer concurrentie.',
        ok: false,
        fix: 'sneller herkend',
        why: 'Schreuder en Baayen: hoe meer familieleden, hoe sneller.',
      },
      {
        t: 'Bij familiegrootte telt hoe vaak de familieleden samen voorkomen.',
        ok: false,
        fix: 'alleen hun aantal telt',
        why: 'De opgetelde frequentie van de familie deed er niet toe.',
      },
      { t: 'In glasblazer is glas het lijdend voorwerp van blazen.', ok: true, why: 'Een synthetische samenstelling met het lijdend voorwerp vooraan.' },
      {
        t: 'Het onderwerp van het werkwoord kan vooraan staan in een synthetische samenstelling.',
        ok: false,
        fix: 'nooit het onderwerp',
        why: 'Kindlacher bestaat niet: dat is de regel van Roeper en Siegel.',
      },
      { t: 'Een vrouwenarts is een arts die een vrouw is.', ok: false, fix: 'een gynaecoloog', why: 'Het eerste deel noemt de patiënt.' },
      {
        t: 'Wil je een ongewone relatie uitdrukken, dan is een woordgroep duidelijker dan een samenstelling.',
        ok: true,
        why: 'Een arts voor volwassenen, een vrouwelijke arts: de woordgroep zegt de relatie hardop.',
      },
    ],
  },
];
