import type { StepInput } from '../../schema';

/** Onderzoek bij d14: een derde uitlegronde op onderzoeksniveau, daarna zwaardere oefeningen. */
export const ONDERZOEK_D14: StepInput[] = [
  {
    kind: 'explain',
    id: 'onderzoek',
    title: 'De paradox in de vorm, de lagen op de proef',
    panels: [
      {
        text: 'De haakjesparadox laat sporen na in de grammatica. Vergelijk *een technische tekenaar* met *een technisch tekenaar*. Met *-e* kan het over de tekenaar zelf gaan: een tekenaar die technisch is. Zonder *-e* gaat het over het werk: iemand die technisch tekent, zoals bouwtekeningen. De ANS beschrijft dit patroon: het bijvoeglijk naamwoord kan onverbogen blijven als het niet de persoon beschrijft maar de handeling of het werk. Zo ook *beeldend kunstenaar* en *sociaal werker*. De vorm zegt dus zelf dat *technisch* bij *tekenen* hoort, en niet bij *tekenaar*. Bouw de betekenisboom.',
        rule: 'Onverbogen bijvoeglijk naamwoord voor een persoonsnaam: het hoort bij de handeling, niet bij de persoon (*een technisch tekenaar* tekent technisch).',
        bracket: {
          q: 'Bouw de betekenis: iemand die technisch tekent',
          tree: '[[technisch teken] aar]',
          words: true,
          nodes: [
            {
              w: 'technisch teken',
              form: 'technisch tekenen',
              cat: 'werkwoordgroep',
              note: 'Eerst de handeling: technisch tekenen. Daar zegt technisch iets over.',
            },
            {
              w: 'technisch teken aar',
              form: 'technisch tekenaar',
              cat: 'zn (persoon)',
              note: '-aar maakt van de hele groep een persoonsnaam. In de vorm zit -aar aan teken vast, in de betekenis aan technisch tekenen: de paradox.',
            },
          ],
          traps: [
            { w: 'teken aar', note: 'Dat is de vorm, niet de betekenis. Zou technisch bij tekenaar horen, dan moest het technische tekenaar zijn, met -e.' },
          ],
          note: 'De onverbogen vorm is het bewijs: technisch hoort bij het werk. Zo ook een beeldend kunstenaar en een sociaal werker.',
        },
        deep: {
          q: 'Hoe lossen taalkundigen de paradox op?',
          a: 'Twee richtingen. David Pesetsky (1985) laat het affix in de betekenis een trapje omhoog verhuizen, zoals een kwantor in de zinsbouw: de vorm heeft de ene boom, de betekenis de andere. Andrew Spencer (1988) zoekt het in het lexicon: *beeldend kunstenaar* wordt gevormd naar het voorbeeld van *beeldende kunst*, paradigmatisch, en dan is er geen boom die klopt of niet klopt. Welke je kiest, hangt af van hoeveel je de zinsbouw in het woord wilt laten doen.',
        },
      },
      {
        text: 'De lagen zeggen: een geleerd affix wil een geleerde stam. Toch zegt iedereen *stommiteit* en *flauwiteit*: Latijns *-iteit* op de inheemse stammen *stom* en *flauw*. En *lekkage*, *slijtage* en *vrijage*: Frans *-age* op inheemse werkwoordstammen. Ook *-eren* plakt aan inheemse basissen: *waarderen*, *halveren*, *kleineren*. Zulke woorden hebben vaak een knipoog, maar ze bestaan, en ze zijn precies wat de strenge lagentheorie verbiedt. De kritiek van Fabb (zie de tweede uitleg) krijgt hier Nederlandse steun.',
        rule: 'Geleerd op inheems kan: *stommiteit*, *lekkage*, *waarderen*. De lagen zijn een sterke neiging, geen wet.',
        lab: {
          label: 'Tik een woord',
          chips: [
            {
              k: 'stommiteit',
              out: 'stom (inheems) + -iteit (Latijn)',
              note: 'Een domme daad. Met een knipoog, en toch gewoon in het woordenboek. -iteit neemt de klemtoon: stommiTEIT.',
            },
            { k: 'flauwiteit', out: 'flauw (inheems) + -iteit (Latijn)', note: 'Een flauwe opmerking. De stam blijft inheems, het achtervoegsel geleerd.' },
            { k: 'lekkage', out: 'lek (inheems) + -age (Frans)', note: 'Een Frans achtervoegsel op een inheemse werkwoordstam. Zo ook slijtage en vrijage.' },
            {
              k: 'waarderen',
              out: 'waarde (inheems) + -eren (Frans)',
              note: 'Het werkwoordachtervoegsel -eren komt uit het Frans, maar neemt rustig een Nederlands zelfstandig naamwoord. Ook halveren en kleineren.',
            },
            { k: 'absurdheid', out: 'absurd (geleerd) + -heid (inheems)', note: 'De voorspelde richting: inheems om geleerd heen. Die kant gaat altijd goed.' },
          ],
        },
        deep: {
          q: 'Is de knipoog toeval?',
          a: 'Waarschijnlijk niet. Een geleerd achtervoegsel klinkt deftig. Op een alledaagse stam botsen twee registers, en die botsing is precies het grapje in *stommiteit*. Voor de theorie betekent het: sprekers kennen de lagen wel, maar gebruiken de grens ook als stijlmiddel. Een verbod dat je kunt overtreden voor het effect, is geen verbod maar een verwachting.',
        },
      },
      {
        text: 'In de geleerde laag rekent de klemtoon vanaf rechts. *FotoGRAAF* en *fotograFIE* hebben hem op het eind, *fotoGRAfisch* en *fotograFEren* op de voorlaatste lettergreep. Zet je een stuk achter het woord, dan begint de rekensom opnieuw, en de spelling verhuist mee: de *aa* van *fotograaf* wordt een *a* zodra de lettergreep open is. De klemtoonregels gelden zo voor een hele familie. Wie Nederlands leert, moet zo’n familie als paradigma kennen; één woord opslaan is niet genoeg. Vul de families in.',
        rule: 'Een geleerde familie heeft een vast klemtoonpatroon: *-GRAAF*, *-graFIE*, *-GRAfisch*, *-graFEren*.',
        paradigm: {
          q: 'Vul de familie in',
          cols: ['-ie', '-isch', '-eren'],
          rows: [
            {
              label: 'fotograaf',
              cells: [
                'fotografie',
                { fill: 'fotografisch', hint: 'Klemtoon vlak voor -isch: fotoGRAfisch. Eén a: de lettergreep is open.' },
                { fill: 'fotograferen' },
              ],
            },
            {
              label: 'filosoof',
              cells: [{ fill: 'filosofie', hint: 'De klemtoon springt naar -ie, en de oo wordt o.' }, { fill: 'filosofisch' }, 'filosoferen'],
            },
            { label: 'telegraaf', cells: [{ fill: 'telegrafie' }, { fill: 'telegrafisch' }, { fill: 'telegraferen' }] },
          ],
          extra: ['fotograafisch', 'filosoofie', 'telegraafie'],
          note: 'Drie families, hetzelfde patroon: -graaf en -soof met klemtoon op het eind, dan -ie op het eind, dan -isch met de klemtoon ervóór, dan -eren met de klemtoon op de e. De dubbele klinker verdwijnt zodra de lettergreep open is.',
        },
        deep: {
          q: 'Waarom springt de klemtoon mee?',
          a: 'Omdat de Nederlandse klemtoon van rechts rekent: hij ligt op een van de laatste drie lettergrepen, en zware lettergrepen trekken hem aan. Een geleerd achtervoegsel verandert de rechterkant van het woord, dus de rekensom begint opnieuw. Een inheems achtervoegsel als *-heid* telt niet mee in die som: het staat buiten het prosodische woord van de stam. Hoe die som precies gaat, zie je bij Woordbouw met een maatlat.',
        },
      },
      {
        text: 'De lagentheorie doet nog een voorspelling. Bij Kiparsky komt de samenstelling vóór de regelmatige buiging: eerst *rat + vanger*, pas daarna een meervoud. Een regelmatig meervoud kan dus niet ín een samenstelling staan. Engels: *rat-eater* kan, *rats-eater* niet, maar *mice-eater* wel, want het onregelmatige *mice* zit op een vroeger niveau. Peter Gordon (1985) testte het bij kinderen van drie tot vijf: ze zeiden *mice-eater*, maar bijna nooit *rats-eater*. Het Nederlands lijkt de voorspelling te breken: *boekenkast*, *pannenkoek*. Of is die *-en-* geen meervoud? Zie Pannenkoek of pannekoek?',
        quiz: {
          q: 'Wat voorspelt de lagentheorie voor een regelmatig meervoud in een samenstelling?',
          options: [
            'Het kan niet: de samenstelling komt eerder dan de regelmatige buiging',
            'Het kan altijd, net als een onregelmatig meervoud',
            'Het kan alleen in het Engels',
          ],
          answer: 'Het kan niet: de samenstelling komt eerder dan de regelmatige buiging',
          why: 'Daarom rats-eater niet en mice-eater wel. De Nederlandse -en- in boekenkast is daarom een twistpunt: tussenklank of meervoud?',
        },
        deep: {
          q: 'Wat zeggen Nederlandse taalkundigen over die -en-?',
          a: 'Geert Booij ziet de *-en-* als tussenklank: een stukje zonder betekenis dat de twee delen verbindt, net als de *-s-* in *stadsplein*. Dan is *boekenkast* geen meervoud in een samenstelling, en blijft de voorspelling overeind. Toch kozen de spellingmakers in 1995 het meervoud als richtsnoer, en er zijn leesexperimenten die erop wijzen dat lezers de *-en-* vaak wél als meervoud opvatten. De vorm heeft dus geen vaste betekenis, maar lezers geven er een. De vraag staat nog open.',
        },
      },
    ],
  },
  {
    kind: 'sort',
    id: 'lagen-mix',
    prompt: 'Welke lagen zitten in dit woord?',
    buckets: ['inheems affix op geleerde stam', 'geleerd affix op inheemse stam', 'allebei uit dezelfde laag'],
    items: [
      { t: 'absurdheid', b: 0 },
      { t: 'onlogisch', b: 0 },
      { t: 'onrealistisch', b: 0 },
      { t: 'stommiteit', b: 1 },
      { t: 'lekkage', b: 1 },
      { t: 'vrijage', b: 1 },
      { t: 'halveren', b: 1 },
      { t: 'nervositeit', b: 2 },
      { t: 'waarheid', b: 2 },
      { t: 'inactief', b: 2 },
    ],
    why: 'absurdheid, onlogisch en onrealistisch: inheems om geleerd heen, de verwachte richting. stommiteit, lekkage, vrijage en halveren: geleerd op inheems, tegen de voorspelling in. nervositeit en inactief zijn helemaal geleerd, waarheid helemaal inheems.',
  },
  {
    kind: 'fix',
    id: 'fotografisch',
    prompt: 'Tik het foute woord aan en verbeter het.',
    sentence: 'Ze heeft een fotograafisch geheugen voor gezichten.',
    wrong: 3,
    answer: 'fotografisch',
    why: '-isch trekt de klemtoon naar de lettergreep ervoor: fotoGRAfisch. Die lettergreep is open, dus één a. Zo verhuist de spelling mee met de familie.',
  },
  {
    kind: 'bet',
    id: 'rats-eater',
    prompt: 'Gordon (1985) vroeg kinderen hoe je iemand noemt die ratten eet, en iemand die muizen eet. Welke vorm maakten ze bijna nooit?',
    options: ['rats-eater', 'rat-eater', 'mice-eater'],
    answer: 'rats-eater',
    why: 'Een regelmatig meervoud zit niet in een samenstelling: rat-eater. Het onregelmatige mice kwam wel voor: mice-eater. Precies wat de lagentheorie voorspelt.',
  },
  {
    kind: 'dictation',
    id: 'dictee-lagen',
    prompt: 'Luister en typ de zin.',
    sentence: 'De beeldend kunstenaar beging een stommiteit.',
    right: 'Goed: beeldend blijft onverbogen, want het hoort bij de kunst, niet bij de persoon. En stommiteit: Latijns -iteit op een inheemse stam.',
    wrong: 'Let op: beeldend kunstenaar zonder -e (het gaat om de beeldende kunst), en stommiteit met -iteit op de inheemse stam stom.',
  },
  {
    kind: 'swipe',
    id: 'paradox-waar',
    prompt: 'Klopt deze zin?',
    cards: [
      {
        t: 'In een technisch tekenaar hoort technisch bij tekenen, niet bij de persoon.',
        ok: true,
        why: 'Daarom blijft het onverbogen: iemand die technisch tekent.',
      },
      {
        t: 'Volgens de ANS blijft het bijvoeglijk naamwoord onverbogen als het de persoon zelf beschrijft.',
        ok: false,
        fix: 'Onverbogen blijft het juist als het de handeling of het werk beschrijft',
        why: 'Een sociaal werker doet sociaal werk. De buiging verraadt de boom.',
      },
      {
        t: 'Stommiteit bewijst dat -iteit alleen aan geleerde stammen plakt.',
        ok: false,
        fix: 'stommiteit is juist een geleerd achtervoegsel op een inheemse stam',
        why: 'Stom is inheems. De lagen zijn een neiging, geen wet.',
      },
      { t: 'Lekkage heeft een Frans achtervoegsel op een inheemse werkwoordstam.', ok: true, why: 'lek + -age, net als slijtage en vrijage.' },
      {
        t: 'In fotografie ligt de klemtoon op dezelfde lettergreep als in fotograaf.',
        ok: false,
        fix: 'fotograFIE: de klemtoon schuift naar -ie',
        why: 'Een geleerd achtervoegsel laat de klemtoon vanaf rechts opnieuw rekenen.',
      },
      {
        t: 'Volgens Gordon maakten kinderen wel mice-eater, maar bijna nooit rats-eater.',
        ok: true,
        why: 'Een onregelmatig meervoud zit op een vroeger niveau dan de samenstelling.',
      },
      {
        t: 'Pesetsky lost de haakjesparadox op door het affix in de betekenis te laten verhuizen.',
        ok: true,
        why: 'Zoals een kwantor in de zinsbouw: de betekenisboom verschilt van de vormboom.',
      },
    ],
  },
];
