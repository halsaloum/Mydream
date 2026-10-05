import type { LessonInput } from '../schema';

/**
 * Extra lessen voor "Het woord": leenwoorden en woordgeschiedenis (bachelor, komt na `woord.ts`)
 * en het mentale lexicon (master, komt na `woord-master.ts`).
 */
export const WOORD_EXTRA_LESSONS: LessonInput[] = [
  {
    id: 'w21',
    stage: 'bachelor',
    domain: 'sem',
    also: ['morf', 'orth'],
    title: 'Woorden op reis',
    skill: 'Woorden',
    icon: 'leen',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Lagen in de woordenschat',
        panels: [
          {
            text: 'De Nederlandse woordenschat is een opgraving met lagen. Onderin ligt de Germaanse kern: *hand*, *huis*, *water*, *eten*, *moeder*. Die woorden delen we met het Engels en Duits. Daarboven liggen leenwoorden uit allerlei tijden, en elke laag vertelt over contact met andere volken.',
            rule: 'Een woordenschat is een archief: elke laag leenwoorden is een spoor van contact.',
            mark: {
              q: 'Tik de drie zelfstandige naamwoorden uit de Germaanse kern',
              sentence: 'moeder zet water en een computer op tafel in het huis',
              targets: [0, 2, 10],
              note: 'moeder, water en huis delen we met Engels (mother, water, house) en Duits. computer is Engels, tafel komt uit het Latijn.',
            },
          },
          {
            text: 'De oudste leenlaag komt van de Romeinen. Germanen leerden van hen stenen bouwen, wijn drinken en kaas maken, en namen de woorden mee: *straat* (*strata*), *muur* (*murus*), *venster* (*fenestra*), *wijn* (*vinum*), *kaas* (*caseus*). Die woorden zijn zo oud dat ze volledig Nederlands aanvoelen.',
            lab: {
              label: 'Tik een woord',
              chips: [
                { k: 'straat', out: 'Latijn (via) strata, verharde weg', note: 'De Romeinen bouwden verharde wegen.' },
                { k: 'muur', out: 'Latijn murus', note: 'Stenen bouwen leerden de Germanen van de Romeinen.' },
                { k: 'kaas', out: 'Latijn caseus', note: 'Ook Engels cheese en Duits Käse komen hiervan.' },
              ],
            },
          },
          {
            text: 'Vanaf de middeleeuwen stroomde het Frans binnen, eerst via het hof en de handel, later via mode en bestuur: *fruit*, *plezier*, *cadeau*, *bureau*, *trottoir*. Sinds de twintigste eeuw komt de grootste stroom uit het Engels: *computer*, *weekend*, *deadline*, *e-mail*. En via handel en koloniale geschiedenis kwamen woorden uit het Maleis (*piekeren*, *amok*, *senang*) en uit het Jiddisch en Hebreeuws via het Amsterdamse Bargoens (*mazzel*, *gajes*, *tof*, *Mokum*).',
            quiz: {
              q: 'Uit welke taal komt ‘piekeren’?',
              options: ['Maleis', 'Frans', 'Jiddisch'],
              answer: 'Maleis',
              why: 'Van Maleis pikir, denken. Het kwam mee via het contact met Indonesië.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'herkomst',
        prompt: 'Uit welke taal komt het woord?',
        buckets: ['Latijn (Romeinse tijd)', 'Frans', 'Engels', 'Jiddisch of Hebreeuws'],
        items: [
          { t: 'straat', b: 0 },
          { t: 'plezier', b: 1 },
          { t: 'weekend', b: 2 },
          { t: 'mazzel', b: 3 },
          { t: 'venster', b: 0 },
          { t: 'trottoir', b: 1 },
          { t: 'deadline', b: 2 },
          { t: 'gajes', b: 3 },
          { t: 'kaas', b: 0 },
        ],
        why: 'straat, venster en kaas: Romeinse tijd. plezier en trottoir: Frans. weekend en deadline: Engels. mazzel en gajes: Jiddisch, via het Bargoens.',
      },
      {
        kind: 'order',
        id: 'lagen',
        prompt: 'Zet de leenlagen in de tijd, van oud naar nieuw.',
        tiles: ['Engels: computer', 'Latijn: muur', 'Frans: bureau'],
        answer: 'Latijn: muur Frans: bureau Engels: computer',
        why: 'De Romeinse tijd, dan vooral vanaf de middeleeuwen het Frans, en sinds de twintigste eeuw het Engels.',
      },
      {
        kind: 'explain',
        id: 'verdieping',
        title: 'Uitvoer, aanpassing en volksetymologie',
        panels: [
          {
            text: 'Het Nederlands leende niet alleen, het leende ook uit. In de zeventiende eeuw was de Republiek een wereldmacht van handel en scheepvaart. Engels kreeg *yacht* (*jacht*), *skipper* (*schipper*), *boss* (*baas*), *cookie* (*koekje*) en *Santa Claus* (*Sinterklaas*). Het Russisch kreeg via tsaar Peter de Grote zeemanswoorden als *matros*. Het Indonesisch heeft *kantor* (*kantoor*) en *handuk* (*handdoek*), en het Japans *bīru* (*bier*) en *kōhī* (*koffie*).',
            lab: {
              label: 'Tik een taal',
              chips: [
                { k: 'Engels', out: 'yacht, boss, cookie, skipper', note: 'Uit jacht, baas, koekje, schipper.' },
                { k: 'Indonesisch', out: 'kantor, handuk', note: 'Uit kantoor en handdoek.' },
                { k: 'Japans', out: 'bīru, kōhī', note: 'Uit bier en koffie, via de handelspost Deshima.' },
              ],
            },
          },
          {
            text: 'Een leenwoord wordt aangepast aan zijn nieuwe taal. De *spelling* schuift (*cadeau*, ook wel *kado*), het krijgt een *lidwoord* (*de computer*, *het weekend*) en het gaat *buigen* zoals een Nederlands woord: *ik heb het gedownload*, *het is geüpdatet*. Hoe verder die aanpassing, hoe minder je het woord nog als leenwoord voelt.',
            rule: 'Inburgering: spelling, lidwoord en buiging schuiven op naar het Nederlands.',
            quiz: {
              q: 'Hoe schrijf je het voltooid deelwoord van ‘updaten’?',
              options: ['geüpdatet', 'geupdate', 'geüpdated'],
              answer: 'geüpdatet',
              why: 'De stam is updat (je hoort een t aan het eind), dus ge- + updat + -et. Het trema scheidt ge en u.',
            },
          },
          {
            text: 'Soms maken sprekers van een vreemd woord iets dat Nederlands klinkt en lijkt te kloppen. Dat heet *volksetymologie*. *Hangmat* komt van het Spaanse *hamaca*, uit een Caribische taal; het heeft met *hangen* en *mat* niets te maken, maar zo klinkt het logisch. En een *rendier* rent wel, maar heet zo naar het Noorse *rein*.',
            quiz: {
              q: 'Waar komt hangmat werkelijk vandaan?',
              options: ['van Spaans hamaca', 'van hangen en mat', 'van Engels hammock'],
              answer: 'van Spaans hamaca',
              why: 'Sprekers maakten er hang + mat van: volksetymologie. Het Engelse hammock komt ook van hamaca.',
            },
            deep: {
              q: 'Waarom doen mensen dat?',
              a: 'Ons mentale lexicon zoekt verbanden. Een ondoorzichtig woord wordt makkelijker te onthouden als het uit bekende delen lijkt te bestaan. Volksetymologie is dus geen fout maar een vorm van *heranalyse*: sprekers geven een woord een nieuwe interne structuur. Hetzelfde mechanisme zag je in de les over woordvorming in beweging.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'uitvoer',
        prompt: 'Uit welk Nederlands woord komt het?',
        buckets: ['baas', 'koekje', 'kantoor', 'jacht'],
        items: [
          { t: 'Engels boss', b: 0 },
          { t: 'Engels cookie', b: 1 },
          { t: 'Indonesisch kantor', b: 2 },
          { t: 'Engels yacht', b: 3 },
        ],
        why: 'boss uit baas, cookie uit koekje, kantor uit kantoor, yacht uit jacht: allemaal uit de tijd van de Nederlandse handel en scheepvaart.',
      },
      {
        kind: 'choice',
        id: 'volksetymologie',
        prompt: 'Welk woord is een voorbeeld van volksetymologie?',
        before: '',
        after: '',
        options: ['hangmat', 'fietspad', 'computer', 'straat'],
        answer: 'hangmat',
        why: 'Uit Spaans hamaca. Sprekers maakten er hang + mat van, omdat dat logisch klinkt.',
      },
      {
        kind: 'choice',
        id: 'gedownload',
        prompt: 'Kies de goede vorm.',
        before: 'Ik heb de app gisteren',
        after: '.',
        options: ['gedownload', 'gedownloadt', 'gedownloaded', 'downgeload'],
        answer: 'gedownload',
        why: 'De stam is download (eindigt op een d-klank, geen ’t kofschip-letter), dus ge- + download, zonder extra d of t.',
      },
      {
        kind: 'swipe',
        id: 'reis-waar',
        prompt: 'Klopt het?',
        intro: 'Veeg naar rechts als de zin klopt, naar links als hij niet klopt.',
        cards: [
          { t: 'kaas is een leenwoord uit de Romeinse tijd.', ok: true, why: 'Van Latijn caseus.' },
          { t: 'Het Engelse cookie komt uit het Frans.', ok: false, fix: 'uit het Nederlandse koekje', why: 'Meegenomen naar Nieuw-Amsterdam, het latere New York.' },
          { t: 'Bij volksetymologie geven sprekers een woord een nieuwe, logisch lijkende opbouw.', ok: true, why: 'hamaca werd hangmat.' },
          { t: 'Een rendier heet zo omdat het hard rent.', ok: false, fix: 'naar het Noorse rein', why: 'Het verband met rennen is volksetymologie.' },
          { t: 'Leenwoorden passen zich aan in spelling, lidwoord en buiging.', ok: true, why: 'gedownload, de computer.' },
          { t: 'mazzel komt via het Bargoens uit het Jiddisch.', ok: true, why: 'Net als gajes en tof.' },
        ],
      },
    ],
  },
];

export const WOORD_EXTRA_MASTER_LESSONS: LessonInput[] = [
  {
    id: 'w22',
    stage: 'master',
    domain: 'sem',
    also: ['fon'],
    title: 'Woorden vinden in je hoofd',
    skill: 'Woorden',
    icon: 'lex',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Het mentale woordenboek doorzoeken',
        panels: [
          {
            text: 'Hoeveel woorden ken jij? Brysbaert en collega’s schatten in 2016 dat een twintigjarige Amerikaan ongeveer 42.000 basiswoorden kent. Voor het Nederlands testte het *Groot Nationaal Onderzoek Taal* (Keuleers en collega’s, 2015) honderdduizenden mensen. En toch vind je het juiste woord meestal binnen een halve seconde. Hoe werkt dat zoeken?',
            quiz: {
              q: 'Hoeveel basiswoorden kent een twintigjarige Amerikaan ongeveer, volgens Brysbaert en collega’s?',
              options: ['ongeveer 42.000', 'ongeveer 4.000', 'ongeveer 420.000'],
              answer: 'ongeveer 42.000',
              why: 'Basiswoorden zonder buigingen of afleidingen. Met alle vormen erbij zijn het er veel meer.',
            },
          },
          {
            text: 'Onderzoekers meten dat met een *lexicale-decisietaak*: je ziet een rij letters en drukt zo snel mogelijk op ja (een woord) of nee (geen woord). Het robuustste resultaat is het *frequentie-effect*: vaak gebruikte woorden herken je sneller dan zeldzame. *Huis* gaat sneller dan *hut*, en *hut* sneller dan *hinde*.',
            rule: 'Frequentie-effect: hoe vaker je een woord tegenkomt, hoe sneller je het herkent.',
            lab: {
              label: 'Tik een letterreeks',
              chips: [
                { k: 'huis', out: 'ja · heel snel', note: 'Een heel frequent woord.' },
                { k: 'hinde', out: 'ja · trager', note: 'Bestaat, maar is zeldzaam.' },
                { k: 'plint', out: 'ja', note: 'Een bestaand maar niet zo frequent woord.' },
                { k: 'plirt', out: 'nee · traag', note: 'Een uitspreekbaar nepwoord: je moet goed zoeken voor je nee zegt.' },
                { k: 'plrnt', out: 'nee · snel', note: 'Kan geen Nederlands woord zijn: meteen nee.' },
              ],
            },
          },
          {
            text: 'Woorden liggen niet los in je hoofd, maar in een netwerk. Zie je eerst *boter*, dan herken je *brood* daarna sneller dan na *stoel*. Dat heet *semantische priming* (Meyer en Schvaneveldt, 1971). Het eerste woord activeert zijn buren in het netwerk alvast een beetje.',
            quiz: {
              q: 'Na welk woord herken je ‘dokter’ waarschijnlijk het snelst?',
              options: ['verpleegster', 'fiets', 'wolk'],
              answer: 'verpleegster',
              why: 'Woorden met een verwante betekenis activeren elkaar: semantische priming.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'snelheid',
        prompt: 'Wat gaat sneller in een lexicale-decisietaak?',
        buckets: ['sneller', 'trager'],
        items: [
          { t: 'ja zeggen op huis', b: 0 },
          { t: 'ja zeggen op hinde', b: 1 },
          { t: 'nee zeggen op plrnt', b: 0 },
          { t: 'nee zeggen op plirt', b: 1 },
          { t: 'brood herkennen na boter', b: 0 },
          { t: 'brood herkennen na stoel', b: 1 },
        ],
        why: 'Frequente woorden, onmogelijke letterreeksen en geprimede woorden gaan sneller. Zeldzame woorden, woordachtige nepwoorden en woorden zonder verwante voorganger gaan trager.',
      },
      {
        kind: 'choice',
        id: 'nepwoord',
        prompt: 'Waarom duurt nee zeggen op ‘plirt’ langer dan op ‘plrnt’?',
        before: '',
        after: '',
        options: [
          'plirt zou een Nederlands woord kunnen zijn, dus je moet echt zoeken',
          'plirt is langer',
          'plrnt bestaat in een andere taal',
        ],
        answer: 'plirt zou een Nederlands woord kunnen zijn, dus je moet echt zoeken',
        why: 'plrnt botst met de klankregels (geen klinker), dus dat wijs je meteen af. plirt volgt de regels.',
      },
      {
        kind: 'explain',
        id: 'verdieping',
        title: 'Van betekenis naar klank',
        panels: [
          {
            text: 'Spreken is de omgekeerde weg. Volgens het model van Willem Levelt (*Speaking*, 1989, en later uitgewerkt met Ardi Roelofs en Antje Meyer) gaat het in stappen. Eerst kies je wat je wilt zeggen: het *concept*. Dan zoek je het *lemma*: het woord met zijn betekenis en grammatica, zoals woordsoort en geslacht. Pas daarna haal je de *vorm* op: de klanken en lettergrepen.',
            quiz: {
              q: 'Wat bevat het lemma in het model van Levelt?',
              options: ['betekenis en grammatica, zoals het geslacht', 'alleen de klanken', 'alleen het concept'],
              answer: 'betekenis en grammatica, zoals het geslacht',
              why: 'De klanken komen pas in de volgende stap: de vorm.',
            },
            rule: 'Levelt: concept → lemma (betekenis en grammatica) → vorm (klanken).',
            deep: {
              q: 'Waar is dat onderzoek gedaan?',
              a: 'Grotendeels in Nijmegen, aan het Max Planck Instituut voor Psycholinguïstiek dat Levelt in 1980 mee oprichtte. Het is een van de belangrijkste plekken ter wereld voor onderzoek naar taal en brein. In de les over de lettergreep in spraakproductie zag je de laatste stap van het model: lettergrepen ophalen.',
            },
          },
          {
            text: 'Het mooiste bewijs voor die tussenstap is het *puntje-van-de-tong*-gevoel. Je weet precies wat je bedoelt, maar het woord komt niet. Brown en McNeill lieten in 1966 zien dat mensen in die toestand vaak wel de eerste letter weten, het aantal lettergrepen of waar de klemtoon valt. Italiaanse proefpersonen wisten zelfs vaak het geslacht van het woord (Vigliocco en collega’s, 1997). Het lemma is gevonden, de vorm nog niet.',
            quiz: {
              q: 'Wat laat het puntje-van-de-tonggevoel zien?',
              options: [
                'Je kunt het lemma hebben zonder de vorm',
                'Je kunt de vorm hebben zonder de betekenis',
                'Woorden worden letter voor letter opgehaald',
              ],
              answer: 'Je kunt het lemma hebben zonder de vorm',
              why: 'Betekenis en geslacht zijn er al, de klanken nog niet: twee aparte stappen.',
            },
          },
          {
            text: 'Ook versprekingen verraden het systeem. Bij een klankwissel ruilen klanken bijna altijd met klanken op dezelfde plek in de lettergreep: onset met onset, klinker met klinker. *Koude kaas* kan *kaude koos* worden, maar zelden iets waarbij een onset op de plek van een coda belandt. Bij een woordwissel ruilen woorden van dezelfde woordsoort: zelfstandig naamwoord met zelfstandig naamwoord.',
            rule: 'Versprekingen respecteren de structuur: klanken ruilen binnen lettergreepposities, woorden binnen woordsoorten.',
            quiz: {
              q: 'Welke verspreking past bij de regel dat klanken binnen hun positie ruilen?',
              options: ['bal en pop wordt pal en bop', 'koud wordt douk', 'bal wordt lab'],
              answer: 'bal en pop wordt pal en bop',
              why: 'Twee onsets ruilen van plaats. Bij douk en lab belandt een onset in de coda.',
            },
          },
        ],
      },
      {
        kind: 'order',
        id: 'levelt',
        prompt: 'Zet de stappen van spreken in de volgorde van Levelt.',
        tiles: ['klanken en lettergrepen ophalen', 'concept kiezen', 'lemma kiezen'],
        answer: 'concept kiezen lemma kiezen klanken en lettergrepen ophalen',
        why: 'Eerst wat je wilt zeggen, dan het woord met zijn grammatica, dan de klankvorm.',
      },
      {
        kind: 'choice',
        id: 'tot',
        prompt: 'Je zoekt een woord en weet: het begint met een s, heeft drie lettergrepen en het is een de-woord. Welke stap lukt nog niet?',
        before: '',
        after: '',
        options: ['de volledige klankvorm ophalen', 'het lemma kiezen', 'het concept kiezen'],
        answer: 'de volledige klankvorm ophalen',
        why: 'Je hebt het lemma (met geslacht) en stukjes van de vorm, maar nog niet de hele vorm.',
      },
      {
        kind: 'sort',
        id: 'versprekingen',
        prompt: 'Welke verspreking is waarschijnlijk, welke onwaarschijnlijk?',
        buckets: ['waarschijnlijk', 'onwaarschijnlijk'],
        items: [
          { t: 'koude kaas → kaude koos (klinkers geruild)', b: 0 },
          { t: 'bal en pop → pal en bop (onsets geruild)', b: 0 },
          { t: 'koud → douk (onset en coda geruild)', b: 1 },
          { t: 'de hond bijt de man → de man bijt de hond', b: 0 },
          { t: 'de hond bijt de man → de bijt hond de man', b: 1 },
        ],
        why: 'Klanken ruilen met klanken op dezelfde plek in de lettergreep, woorden met woorden van dezelfde soort. Een onset die coda wordt, of een werkwoord dat met een zelfstandig naamwoord ruilt, komt zelden voor.',
      },
      {
        kind: 'swipe',
        id: 'lexicon-waar',
        prompt: 'Klopt het?',
        intro: 'Veeg naar rechts als de zin klopt, naar links als hij niet klopt.',
        cards: [
          { t: 'Frequente woorden herken je sneller dan zeldzame.', ok: true, why: 'Het frequentie-effect.' },
          { t: 'In het model van Levelt haal je eerst de klanken op en dan de betekenis.', ok: false, fix: 'eerst lemma, dan vorm', why: 'Concept, lemma, vorm.' },
          { t: 'Na boter herken je brood sneller.', ok: true, why: 'Semantische priming.' },
          { t: 'In een puntje-van-de-tongtoestand weet je nooit iets van het woord.', ok: false, fix: 'je weet vaak de eerste letter of het aantal lettergrepen', why: 'Brown en McNeill, 1966.' },
          { t: 'Bij een klankwissel ruilt een onset meestal met een andere onset.', ok: true, why: 'Versprekingen respecteren de lettergreep.' },
          { t: 'Een uitspreekbaar nepwoord wijs je sneller af dan een onuitspreekbaar.', ok: false, fix: 'trager', why: 'Een woordachtige reeks moet je echt opzoeken.' },
        ],
      },
    ],
  },
];
