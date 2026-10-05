import type { LessonInput } from '../schema';

/** Extra bachelorles voor "De lettergreep": de lettergreep in rijm en metrum. Komt na `greep.ts`. */
export const GREEP_EXTRA_LESSONS: LessonInput[] = [
  {
    id: 'g18',
    stage: 'bachelor',
    domain: 'fon',
    also: ['tekst'],
    title: 'Rijm en metrum',
    skill: 'Spelling',
    icon: '◡–',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Dichters tellen lettergrepen',
        panels: [
          {
            text: 'Elk Sinterklaasgedicht is een stukje fonologie. *Maan* rijmt op *staan* omdat ze alles delen vanaf de klinker: *-aan*. Dat stuk, kern plus coda, is precies de *rijm* van de lettergreep uit de les over onset, kern en coda. Het begin, de onset, mag verschillen. Dichters gebruiken dus al eeuwen de structuur die taalkundigen pas later een naam gaven.',
            rule: 'Rijm = gelijk vanaf de laatste beklemtoonde klinker. De onset mag verschillen.',
            tree: {
              q: 'Hang de klanken van maan in de boom. Welk deel rijmt op staan?',
              segs: [
                { t: 'm', role: 'onset' },
                { t: 'aː', role: 'kern' },
                { t: 'n', role: 'coda' },
              ],
              note: 'aa + n: kern en coda samen vormen de rijm. Die delen maan en staan.',
            },
          },
          {
            text: 'Valt de klemtoon op de laatste lettergreep, dan heet het rijm *mannelijk*: *maan / staan*. Valt hij op de voorlaatste, dan moeten twee lettergrepen meedoen: *lopen / kopen*. Dat heet *vrouwelijk* rijm. Rijm je *lopen* op *open*? Ook goed: de onset mag ontbreken.',
            lab: {
              label: 'Tik een paar',
              chips: [
                {
                  k: 'maan / staan',
                  out: 'mannelijk rijm',
                  note: 'Klemtoon op de laatste lettergreep: alleen -aan hoeft gelijk.',
                },
                {
                  k: 'lopen / kopen',
                  out: 'vrouwelijk rijm',
                  note: 'Klemtoon op de voorlaatste: -open moet gelijk zijn.',
                },
                {
                  k: 'lopen / maan',
                  out: 'geen rijm',
                  note: 'De beklemtoonde klinkers verschillen.',
                },
              ],
            },
          },
          {
            text: 'Er zijn meer klankspelletjes. Bij *alliteratie* (stafrijm) begint de beklemtoonde lettergreep met dezelfde klank: *met man en macht*, *huis en haard*, *kind noch kraai*. Bij *assonantie* (klinkerrijm) delen woorden alleen de klinker: *maan* en *kaal*. Oudgermaanse dichters werkten vooral met alliteratie, middeleeuwse en latere vooral met eindrijm.',
            quiz: {
              q: 'Wat is ‘met man en macht’?',
              options: ['alliteratie', 'eindrijm', 'assonantie'],
              answer: 'alliteratie',
              why: 'man en macht beginnen met dezelfde onset: m. De rijm verschilt.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'rijmsoorten',
        prompt: 'Wat voor klankspel is het?',
        buckets: ['eindrijm', 'alliteratie', 'assonantie'],
        items: [
          { t: 'boom / droom', b: 0 },
          { t: 'kind noch kraai', b: 1 },
          { t: 'maan / kaal', b: 2 },
          { t: 'huis en haard', b: 1 },
          { t: 'vlinder / kinder', b: 0 },
          { t: 'dik / kip', b: 2 },
          { t: 'wind en weer', b: 1 },
          { t: 'paard / baard', b: 0 },
        ],
        why: 'Eindrijm: gelijk vanaf de klinker (boom/droom, vlinder/kinder, paard/baard). Alliteratie: zelfde begin (kind/kraai, huis/haard, wind/weer). Assonantie: alleen de klinker (maan/kaal, dik/kip).',
      },
      {
        kind: 'type',
        id: 'sinterklaas',
        prompt: 'Maak het rijm af.',
        before: 'Sinterklaas kwam langs op zijn witte paard, en streek eens tevreden door zijn lange',
        after: '.',
        hint: 'rijmt op paard',
        answer: 'baard',
        why: 'paard / baard: mannelijk rijm, gelijk vanaf de klinker -aard.',
      },
      {
        kind: 'choice',
        id: 'vrouwelijk',
        prompt: 'Welk woord geeft vrouwelijk rijm met ‘zingen’?',
        before: '',
        after: '',
        options: ['springen', 'zing', 'zingend', 'dingen in'],
        answer: 'springen',
        why: 'zin-gen en sprin-gen: klemtoon op de voorlaatste en alles gelijk vanaf die klinker.',
      },
      {
        kind: 'explain',
        id: 'verdieping',
        title: 'Metrum: de maat van een vers',
        panels: [
          {
            text: 'Behalve rijm heeft een gedicht vaak een *metrum*: een vast patroon van beklemtoonde (–) en onbeklemtoonde (◡) lettergrepen. Een groepje heet een *versvoet*. De *jambe* is ◡ –, zoals in *ge-ZANG*. De *trochee* is – ◡, zoals in *LO-pen*. De *dactylus* is – ◡ ◡, zoals in *VRIEN-de-lijk*. De *anapest* is ◡ ◡ –, zoals in *ko-nin-GIN*.',
            rule: 'jambe ◡– · trochee –◡ · dactylus –◡◡ · anapest ◡◡–',
            lab: {
              label: 'Tik een woord',
              chips: [
                {
                  k: 'gezang',
                  out: '◡ – (jambe)',
                  note: 'ge is zwak, zang sterk.',
                },
                {
                  k: 'lopen',
                  out: '– ◡ (trochee)',
                  note: 'lo sterk, pen zwak.',
                },
                {
                  k: 'vriendelijk',
                  out: '– ◡ ◡ (dactylus)',
                  note: 'Eén sterke, twee zwakke.',
                },
                {
                  k: 'koningin',
                  out: '◡ ◡ – (anapest)',
                  note: 'Let op: de klemtoon valt op gin.',
                },
              ],
            },
          },
          {
            text: 'Veel kinderliedjes zijn trocheïsch. Zing maar: *AL-tijd IS kort-JA-kje ZIEK*. Vier keer – ◡, en aan het eind valt de laatste zwakke lettergreep weg. Nederlandse woorden beginnen vaak met een klemtoon (*LO-pen*, *TA-fel*), en dat past goed bij de trochee.',
            quiz: {
              q: 'Welk metrum heeft ‘Altijd is Kortjakje ziek’?',
              options: ['trochee', 'jambe', 'dactylus'],
              answer: 'trochee',
              why: 'AL-tijd IS kort-JA-kje ZIEK: steeds sterk-zwak.',
            },
          },
          {
            text: 'In de Nederlandse dichtkunst was de *alexandrijn* lang het grote metrum: twaalf of dertien lettergrepen in zes jamben, met een rustpunt (*cesuur*) in het midden. Joost van den Vondel schreef zijn toneelstukken zo, zoals *Gijsbrecht van Aemstel* (1637). De jambische vijfvoeter, bekend van Shakespeare, kwam later in zwang.',
            split: {
              q: 'Knip de naam uit Vondels titel in lettergrepen',
              word: 'Gijsbrecht',
              answer: 'Gijs-brecht',
              note: 'Twee lettergrepen, met de klemtoon op Gijs. Dichters tellen zo elke lettergreep van de regel.',
            },
            deep: {
              q: 'Waarom is metrum fonologie?',
              a: 'Omdat een metrum alleen werkt als dichter en lezer het eens zijn over waar de klemtonen vallen en hoeveel lettergrepen een woord heeft. Een dichter die *ko-nin-gin* als trochee gebruikt, hoor je struikelen. Metriek is daarom een rijke bron voor taalkundigen: oude gedichten laten zien waar de klemtoon vroeger lag en hoeveel lettergrepen woorden toen hadden.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'versvoeten',
        prompt: 'Welke versvoet past bij het woord?',
        buckets: ['jambe ◡–', 'trochee –◡', 'dactylus –◡◡', 'anapest ◡◡–'],
        items: [
          { t: 'gezang', b: 0 },
          { t: 'tafel', b: 1 },
          { t: 'appeltje', b: 2 },
          { t: 'koningin', b: 3 },
          { t: 'verhaal', b: 0 },
          { t: 'zingen', b: 1 },
          { t: 'vriendelijk', b: 2 },
          { t: 'kapitein', b: 3 },
        ],
        why: 'ge-ZANG en ver-HAAL: jambe. TA-fel en ZIN-gen: trochee. AP-pel-tje en VRIEN-de-lijk: dactylus. ko-nin-GIN en ka-pi-TEIN: anapest.',
      },
      {
        kind: 'choice',
        id: 'alexandrijn',
        prompt: 'Hoeveel jamben heeft een alexandrijn?',
        before: '',
        after: '',
        options: ['zes', 'vijf', 'vier', 'twaalf'],
        answer: 'zes',
        why: 'Zes jamben: twaalf lettergrepen, of dertien bij een vrouwelijk slot.',
      },
      {
        kind: 'bet',
        id: 'vondel',
        prompt: 'In welk metrum schreef Vondel de Gijsbrecht van Aemstel?',
        options: ['alexandrijnen', 'trocheeën van vier voeten', 'vrij vers'],
        answer: 'alexandrijnen',
        why: 'Zes jamben per regel, met een cesuur in het midden.',
      },
      {
        kind: 'swipe',
        id: 'metrum-waar',
        prompt: 'Klopt het?',
        intro: 'Veeg naar rechts als de zin klopt, naar links als hij niet klopt.',
        cards: [
          {
            t: 'Bij eindrijm moeten de onsets gelijk zijn.',
            ok: false,
            fix: 'de onsets mogen verschillen',
            why: 'maan / staan: m en st verschillen.',
          },
          {
            t: 'lopen / kopen is vrouwelijk rijm.',
            ok: true,
            why: 'Klemtoon op de voorlaatste: twee lettergrepen doen mee.',
          },
          {
            t: 'koningin is een trochee.',
            ok: false,
            fix: 'een anapest: ko-nin-GIN',
            why: 'De klemtoon valt op de laatste lettergreep.',
          },
          {
            t: 'Alliteratie gaat over het begin van de beklemtoonde lettergreep.',
            ok: true,
            why: 'met Man en Macht.',
          },
          {
            t: 'Oude gedichten kunnen laten zien waar de klemtoon vroeger lag.',
            ok: true,
            why: 'Het metrum werkt alleen als de klemtonen kloppen.',
          },
          {
            t: 'De rijm van een lettergreep is de onset plus de kern.',
            ok: false,
            fix: 'de kern plus de coda',
            why: 'Daarom rijmen maan en staan.',
          },
        ],
      },
    ],
  },
];
