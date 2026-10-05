import type { LessonInput } from '../schema';

/**
 * Bachelorlessen voor het niveau "Het betekenisvolle woorddeel": het morfeem en de allomorf,
 * buiging tegenover afleiding, het hoofd van het woord, woordbomen, samenstellingen,
 * tussenklanken, afleiden met eisen en blokkering, en stamwisseling. Op verzoek beginnen ze
 * meteen op bachelorniveau; de bestaande lessen d0 tot d4 zijn de basis.
 *
 * Woordbomen staan in haakjesschrift (zie `content/bracket.ts`). Het verkleinwoord en de keuze
 * tussen -en en -s staan al bij De lettergreep (g10); hier wordt daarnaar verwezen.
 */
export const DEEL_LESSONS: LessonInput[] = [
  {
    id: 'd5',
    stage: 'bachelor',
    domain: 'morf',
    title: 'Wat is een morfeem eigenlijk?',
    skill: 'Woorden',
    icon: 'm',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Het kleinste stukje met betekenis',
        panels: [
          {
            text: 'Woorden zijn Lego, alleen trap je er ’s nachts niet op. Het kleinste blokje dat een betekenis of functie draagt, heet een *morfeem*. *Onleesbaarheid* bestaat uit vier blokjes: *on* (niet), *lees* (de stam), *baar* (kan) en *heid* (maakt er een ding van).',
            split: { q: 'Knip het woord in morfemen', word: 'onleesbaarheid', answer: 'on-lees-baar-heid', note: 'on + lees + baar + heid: vier morfemen. Hier vallen ze toevallig samen met de lettergrepen; bij boe-ken niet.' },
            rule: 'Een morfeem is de kleinste vorm met een eigen betekenis of grammaticale functie.',
          },
          {
            text: 'Sommige morfemen kunnen alleen staan: *boek*, *lees*, *rood*. Dat zijn *vrije* morfemen. Andere bestaan alleen als aanhangsel: *-heid*, *ver-*, *-en*. Dat zijn *gebonden* morfemen, of *affixen*. Een stam is meestal vrij, een affix altijd gebonden.',
            lab: {
              label: 'Tik een morfeem',
              chips: [
                { k: 'boek', out: 'vrij', note: 'Kan zelfstandig een woord zijn.' },
                { k: '-heid', out: 'gebonden (achtervoegsel)', note: 'Bestaat alleen achter een stam: vrijheid, schoonheid.' },
                { k: 'ver-', out: 'gebonden (voorvoegsel)', note: 'Bestaat alleen vóór een stam: verbouwen, verliezen.' },
                { k: 'aal-', out: 'gebonden, zonder eigen betekenis', note: 'In aalbes. Het heeft niets met een aal te maken en komt nergens anders voor.' },
              ],
            },
            deep: {
              q: 'Een morfeem zonder betekenis?',
              a: 'Dat is het probleem van de *cranberry-morfemen*, genoemd naar Engels *cranberry*: *cran* komt alleen daar voor. Nederlands heeft er ook: *aal* in *aalbes*, *fram* in *framboos*. Nog lastiger: *be-gin-nen* en *ver-geten*. Je voelt *be-* en *ver-*, maar *ginnen* en *geten* betekenen niets. Mark Aronoff (1976) concludeerde daarom dat een morfeem soms alleen een *vorm* is, geen teken met betekenis.',
            },
          },
          {
            text: 'Eén morfeem kan meerdere vormen hebben. Het meervoud klinkt als *-en* in *boeken*, als *-s* in *tafels*, als *-a* in *musea* en als *-i* in *musici*. Elke vorm heet een *allomorf*: andere letters, dezelfde betekenis.',
            show: [
              { right: 'boek + en' },
              { right: 'tafel + s' },
              { right: 'muse + a' },
            ],
            rule: 'Morfeem = de abstracte eenheid. Morf = de vorm die je ziet. Allomorfen = de vormen van één morfeem.',
            quiz: {
              q: 'Zijn -en en -s in boeken en tafels twee morfemen of twee allomorfen?',
              options: ['Twee allomorfen van één morfeem', 'Twee verschillende morfemen'],
              answer: 'Twee allomorfen van één morfeem',
              why: 'Allebei betekenen ze meervoud. Welke vorm komt, hangt af van het woord (zie De lettergreep, les g10).',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'vrij',
        prompt: 'Vrij of gebonden?',
        buckets: ['vrij', 'gebonden'],
        items: [
          { t: 'huis', b: 0 },
          { t: 'groen', b: 0 },
          { t: 'loop', b: 0 },
          { t: 'on-', b: 1 },
          { t: '-baar', b: 1 },
          { t: '-tje', b: 1 },
          { t: 'fram- (in framboos)', b: 1 },
        ],
        why: 'huis, groen en loop kunnen alleen staan. on-, -baar en -tje niet. fram- komt alleen in framboos voor.',
      },
      {
        kind: 'type',
        id: 'tellen',
        prompt: 'Hoeveel morfemen heeft dit woord?',
        before: 'onvriendelijkheid heeft',
        after: 'morfemen.',
        hint: 'getal',
        answer: '4',
        why: 'on + vriend + elijk + heid. Let op: -elijk is één achtervoegsel.',
      },
      {
        kind: 'swipe',
        id: 'morfeem',
        prompt: 'Klopt deze zin?',
        cards: [
          { t: 'Een morfeem valt altijd samen met een lettergreep.', ok: false, fix: 'Morfeem en lettergreep vallen vaak niet samen', why: 'boe-ken heeft twee lettergrepen, maar de morfemen zijn boek + en.' },
          { t: 'Het meervoud heeft meerdere allomorfen.', ok: true, why: '-en, -s, -a, -i: dezelfde betekenis, andere vorm.' },
          { t: 'Een gebonden morfeem kan zelfstandig een woord zijn.', ok: false, fix: 'Een gebonden morfeem staat nooit alleen', why: 'Daarom heet het gebonden: -heid of ver- heb je nooit los.' },
          { t: 'Een woord kan uit één morfeem bestaan.', ok: true, why: 'huis, rood en loop zijn zulke woorden.' },
        ],
      },
      {
        kind: 'bet',
        id: 'aalbes',
        prompt: 'Wat betekent ‘aal’ in ‘aalbes’?',
        options: ['Niets: het komt alleen in aalbes voor', 'Een vis', 'Rood'],
        answer: 'Niets: het komt alleen in aalbes voor',
        why: 'Een cranberry-morfeem: je knipt het eraf omdat bes een morfeem is, maar wat overblijft betekent op zichzelf niets.',
      },
    ],
  },
  {
    id: 'd6',
    stage: 'bachelor',
    domain: 'morf',
    also: ['syn'],
    title: 'Buigen of afleiden?',
    skill: 'Woorden',
    icon: '±',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Twee soorten woordbouw',
        panels: [
          {
            text: 'Een woord kun je op twee manieren verbouwen. *Buigen* (flexie) maakt een andere vorm van hetzelfde woord: *boek*, *boeken*. *Afleiden* (derivatie) maakt een nieuw woord, met een eigen plek in het woordenboek: *lezen*, *lezer*.',
            lab: {
              label: 'Tik een paar',
              chips: [
                { k: 'boek → boeken', out: 'buiging', note: 'Zelfde woord, nu meervoud. Het woordenboek heeft er geen apart lemma voor.' },
                { k: 'lees → lezer', out: 'afleiding', note: 'Nieuw woord: van werkwoord naar zelfstandig naamwoord.' },
                { k: 'loop → loopt', out: 'buiging', note: 'De zin vraagt erom: hij loopt.' },
                { k: 'schoon → schoonheid', out: 'afleiding', note: 'Nieuw woord, nieuwe woordsoort.' },
              ],
            },
          },
          {
            text: 'Drie toetsen. *Woordsoort*: afleiding kan die veranderen (*lees* → *lezer*), buiging nooit. *Zin*: buiging is wat de zinsbouw eist (*hij loop-t*, *een mooi-e fiets*); afleiding kiest de spreker. *Plek*: buiging staat buitenaan. *Lezer-s* kan, *lezen-er* niet.',
            rule: 'Buiging: zelfde woord, de zin vraagt erom, staat buitenaan. Afleiding: nieuw woord, vaak nieuwe woordsoort, staat binnenin.',
            quiz: {
              q: 'Welke vorm is onmogelijk?',
              options: ['lezers', 'lezener'],
              answer: 'lezener',
              why: 'Buiging (-en, -s) staat buitenaan. Eerst afleiden (lees + er), dan buigen (lezer + s).',
            },
          },
          {
            text: 'Geert Booij maakt nog een onderscheid binnen de buiging. *Inherente* buiging kies je om de betekenis: meervoud, verleden tijd. *Contextuele* buiging dwingt de zin af: de *-t* bij *hij*, de *-e* in *de mooie fiets*. Inherente buiging lijkt daarom een beetje op afleiding; contextuele buiging nooit.',
            deep: {
              q: 'En het verkleinwoord?',
              a: 'Het verkleinwoord is de grensganger. Het verandert het lidwoord (*de man*, *het mannetje*), en dat doet buiging nooit. Maar het past op bijna elk zelfstandig naamwoord, en dat is typisch voor buiging. Sergio Scalise stelde daarom een derde soort voor: *evaluatieve morfologie*, voor verkleinen, vergroten en kleuren. Taalkundigen zijn het er nog steeds niet over eens.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'soort',
        prompt: 'Buiging of afleiding?',
        buckets: ['buiging', 'afleiding'],
        items: [
          { t: 'boeken', b: 0 },
          { t: 'liep', b: 0 },
          { t: 'mooie', b: 0 },
          { t: 'grootste', b: 0 },
          { t: 'lezer', b: 1 },
          { t: 'schoonheid', b: 1 },
          { t: 'onaardig', b: 1 },
        ],
        why: 'Buiging: meervoud, verleden tijd, de -e en de overtreffende trap. Afleiding: lezer, schoonheid en onaardig zijn nieuwe woorden.',
      },
      {
        kind: 'highlight',
        id: 'lagen',
        prompt: 'Kleur de stukken van ‘onleesbaarheden’',
        intro: 'De stam in het midden, de afleiding eromheen, de buiging helemaal buiten.',
        pens: [
          { id: 'stam', label: 'stam', tag: 'kern', ask: 'Is dit de kern van het woord?', accent: 'blue' },
          { id: 'afl', label: 'afleiding', tag: 'nieuw woord', ask: 'Maakt dit stuk een nieuw woord?', accent: 'purple' },
          { id: 'buig', label: 'buiging', tag: 'vorm', ask: 'Maakt dit stuk alleen een andere vorm?', accent: 'orange' },
        ],
        words: [
          { t: 'on', role: 'afl' },
          { t: 'lees', role: 'stam' },
          { t: 'baar', role: 'afl' },
          { t: 'hed', role: 'afl' },
          { t: 'en', role: 'buig' },
        ],
        done: { title: 'Ui-model', text: 'Stam, dan afleiding, dan buiging: een ui met lagen. En hed is een allomorf van heid.' },
      },
      {
        kind: 'bet',
        id: 'verkleinwoord',
        prompt: 'Welk argument zegt dat het verkleinwoord op afleiding lijkt?',
        options: ['Het verandert de man in het mannetje', 'Het past op bijna elk zelfstandig naamwoord', 'Het staat achteraan'],
        answer: 'Het verandert de man in het mannetje',
        why: 'Een ander lidwoord betekent een ander woord met eigen eigenschappen. Buiging verandert het lidwoord nooit.',
      },
    ],
  },
  {
    id: 'd7',
    stage: 'bachelor',
    domain: 'morf',
    also: ['syn'],
    title: 'Wie is de baas in het woord?',
    skill: 'Woorden',
    icon: '→|',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Het hoofd staat rechts',
        panels: [
          {
            text: 'Goed nieuws voor iedereen die worstelt met *de* en *het*: in een samengesteld woord beslist het laatste deel. *Het mes*, dus *het zakmes*. *De zak*, maar dat telt niet. Dat laatste deel heet het *hoofd*. Het bepaalt de woordsoort, het lidwoord en de betekenis: een zakmes is een mes.',
            lab: {
              label: 'Tik een woord',
              chips: [
                { k: 'zakmes', out: 'het zakmes', note: 'Hoofd: het mes.' },
                { k: 'meskast', out: 'de meskast', note: 'Hoofd: de kast. Zelfde delen, ander hoofd.' },
                { k: 'telefoonnummer', out: 'het telefoonnummer', note: 'Hoofd: het nummer.' },
                { k: 'nummerbord', out: 'het nummerbord', note: 'Hoofd: het bord.' },
              ],
            },
            rule: 'De rechterhoofdregel: in een Nederlands woord is het meest rechtse deel het hoofd.',
          },
          {
            text: 'Ook achtervoegsels zijn hoofden. *-heid* maakt altijd een *de*-woord, *-je* altijd een *het*-woord, *-baar* altijd een bijvoeglijk naamwoord. Daarom is het *de man* maar *het mannetje*, en *het geluk* maar *de gelukzaligheid*.',
            quiz: {
              q: 'De of het: ... meisje?',
              options: ['het', 'de'],
              answer: 'het',
              why: 'meid + je: het achtervoegsel -je is het hoofd, en -je maakt het-woorden.',
            },
            deep: {
              q: 'Waar komt die regel vandaan?',
              a: 'Edwin Williams formuleerde in 1981 de *Righthand Head Rule* voor het Engels. Het Nederlands volgt hem nog strenger: ook het lidwoord gaat mee. Talen als het Frans hebben het hoofd vaak links: *pomme de terre* is een soort *pomme*.',
            },
          },
          {
            text: 'Maar kijk naar *wapen* → *bewapenen*, *film* → *verfilmen*, *bos* → *ontbossen*. Een voorvoegsel links maakt hier een werkwoord van een zelfstandig naamwoord. Dan zou het hoofd links staan. Sommige taalkundigen zien hier een uitzondering, anderen een verborgen werkwoordsuitgang rechts: *be-wapen-en*, waarbij *-en* de woordsoort levert.',
            quiz: {
              q: 'Welk woord is lastig voor de rechterhoofdregel?',
              options: ['verfilmen', 'zakmes', 'schoonheid'],
              answer: 'verfilmen',
              why: 'film is een zelfstandig naamwoord; ver- lijkt er een werkwoord van te maken, van links.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'dehet',
        prompt: 'De of het? Kijk naar het hoofd.',
        buckets: ['de', 'het'],
        items: [
          { t: 'kerkklok', b: 0 },
          { t: 'deurbel', b: 0 },
          { t: 'gezichtskleur', b: 0 },
          { t: 'kindergezicht', b: 1 },
          { t: 'voetbalveld', b: 1 },
          { t: 'boompje', b: 1 },
          { t: 'mogelijkheid', b: 0 },
        ],
        why: 'de klok, de bel, de kleur; het gezicht, het veld, het -je; de -heid.',
      },
      {
        kind: 'fix',
        id: 'zakmes',
        prompt: 'Tik het foute woord aan en verbeter het.',
        sentence: 'Hij gaf me de rode zakmes van zijn opa.',
        wrong: 3,
        answer: 'het',
        why: 'Het hoofd is mes, en het is het mes. Dus het rode zakmes.',
      },
      {
        kind: 'bet',
        id: 'nonsens',
        prompt: 'Een ‘plofding’ is een verzonnen woord. De of het?',
        options: ['het', 'de'],
        answer: 'het',
        why: 'Het hoofd is ding, en het is het ding. Ook bij woorden die niemand kent, werkt de regel.',
      },
    ],
  },
  {
    id: 'd8',
    stage: 'bachelor',
    domain: 'morf',
    also: ['sem'],
    title: 'Woordbomen',
    skill: 'Woorden',
    icon: '[ ]',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'De volgorde van plakken',
        panels: [
          {
            text: 'Een woord is geen ketting maar een boom. Je plakt steeds twee stukken aan elkaar, en elke tussenstap moet zelf een mogelijk woord zijn. Welke twee stukken van *onleesbaarheid* horen als eerste bij elkaar? Probeer het: een verkeerde stap legt uit waarom hij niet kan.',
            bracket: {
              tree: '[[on [lees baar]] heid]',
              nodes: [
                { w: 'leesbaar', cat: 'bn', note: 'Werkwoord + -baar: wat je kunt lezen.' },
                { w: 'onleesbaar', cat: 'bn', note: 'on- plakt aan een bijvoeglijk naamwoord en draait het om.' },
                { w: 'onleesbaarheid', cat: 'zn', note: '-heid maakt van het bijvoeglijk naamwoord een ding.' },
              ],
              traps: [
                { w: 'onlees', note: 'on- plakt niet aan een werkwoord: onlezen bestaat niet. Begin bij de stam.' },
                { w: 'baarheid', note: '-baar en -heid zijn allebei gebonden. Zonder stam ertussen geen woord.' },
              ],
              note: '[[on [lees baar]] heid]: drie stappen, en het hoofd van elke stap staat rechts.',
            },
          },
          {
            text: 'Soms passen twee bomen, en dan heeft het woord twee betekenissen. Bouw eerst *iemand die kinderboeken schrijft*.',
            bracket: {
              q: 'Bouw: iemand die kinderboeken schrijft',
              tree: '[[kinder boeken] [schrijf er]]',
              nodes: [
                { w: 'kinderboeken', cat: 'zn', note: 'Boeken voor kinderen.' },
                { w: 'schrijfer', form: 'schrijver', cat: 'zn', note: 'Iemand die schrijft. De f wordt v tussen klinkers.' },
                { w: 'kinderboekenschrijfer', form: 'kinderboekenschrijver', cat: 'zn', note: 'Een schrijver van kinderboeken.' },
              ],
              traps: [{ w: 'boekenschrijf', note: 'Eerst moet schrijf + er een zelfstandig naamwoord worden.' }],
              note: '[[kinder boeken] schrijver]: het boek is voor kinderen.',
            },
          },
          {
            text: 'Nu de andere lezing: *een kind dat boeken schrijft*. Zelfde letters, andere boom, andere betekenis.',
            bracket: {
              q: 'Bouw: een kind dat boeken schrijft',
              tree: '[kinder [boeken [schrijf er]]]',
              nodes: [
                { w: 'schrijfer', form: 'schrijver', cat: 'zn', note: 'Iemand die schrijft.' },
                { w: 'boekenschrijfer', form: 'boekenschrijver', cat: 'zn', note: 'Iemand die boeken schrijft.' },
                { w: 'kinderboekenschrijfer', form: 'kinderboekenschrijver', cat: 'zn', note: 'Een boekenschrijver die een kind is.' },
              ],
              traps: [{ w: 'kinderboeken', note: 'Dat is de eerste lezing. Hier hoort kinder bij de hele boekenschrijver.' }],
              note: '[kinder [boekenschrijver]]: de schrijver is een kind.',
            },
            rule: 'De boom van een woord bepaalt zijn betekenis. Twee bomen voor dezelfde letters = een dubbelzinnig woord.',
          },
        ],
      },
      {
        kind: 'choice',
        id: 'eerste',
        prompt: 'Welk stuk plak je als eerste aan de stam?',
        before: 'In ‘onverkoopbaar’ plak je eerst',
        after: 'aan verkoop.',
        options: ['-baar', 'on-'],
        answer: '-baar',
        why: 'onverkoop bestaat niet. verkoop + baar = verkoopbaar (bn), daarna on + verkoopbaar.',
      },
      {
        kind: 'swipe',
        id: 'bomen',
        prompt: 'Klopt deze zin?',
        cards: [
          { t: 'Elke tussenstap in een woordboom is zelf een mogelijk woord.', ok: true, why: 'leesbaar en onleesbaar bestaan, onlees niet.' },
          { t: 'Kinderboekenschrijver kan maar één ding betekenen.', ok: false, fix: 'Het heeft twee bomen en dus twee betekenissen', why: 'Een schrijver van kinderboeken, of een kind dat boeken schrijft.' },
          { t: 'In onleesbaarheid plak je on- als laatste.', ok: false, fix: 'heid komt als laatste', why: 'on- plakt aan leesbaar; pas daarna maakt -heid er een zelfstandig naamwoord van.' },
        ],
      },
      {
        kind: 'bet',
        id: 'ont',
        prompt: 'Welke boom past bij ‘ontvriendbaar’ (iemand die je kunt ontvrienden)?',
        options: ['[[ont vriend] baar]', '[ont [vriend baar]]'],
        answer: '[[ont vriend] baar]',
        why: 'Eerst ont + vriend (een werkwoord: ontvrienden), dan + baar. vriendbaar bestaat niet: -baar wil een werkwoord.',
      },
    ],
  },
  {
    id: 'd9',
    stage: 'bachelor',
    domain: 'morf',
    also: ['orth'],
    title: 'Samenstellingen zonder einde',
    skill: 'Spelling',
    icon: '⚭',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Van voetbal tot toeslagenaffaire',
        panels: [
          {
            text: 'Nederlands plakt woorden aan elkaar alsof het niets kost. En het kan eindeloos: *kinderopvangtoeslagaffaire* is een echt woord uit het nieuws. Elke laag is weer een samenstelling met het hoofd rechts.',
            bracket: {
              tree: '[[[kinder opvang] toeslag] affaire]',
              nodes: [
                { w: 'kinderopvang', cat: 'zn', note: 'Opvang voor kinderen.' },
                { w: 'kinderopvangtoeslag', cat: 'zn', note: 'Een toeslag voor kinderopvang.' },
                { w: 'kinderopvangtoeslagaffaire', cat: 'zn', note: 'Een affaire rond die toeslag.' },
              ],
              traps: [
                { w: 'opvangtoeslag', note: 'Dan wordt het een opvangtoeslag die bij kinderen hoort. Het is een toeslag voor kinderopvang: bouw die eerst.' },
                { w: 'toeslagaffaire', note: 'Kan als woord, maar hier hangt kinderopvang aan toeslag, niet aan affaire.' },
              ],
              note: 'Drie stappen, elke keer met het hoofd rechts. Er is geen grens: dat heet recursie.',
            },
          },
          {
            text: 'Is een samenstelling één woord of een woordgroep? Luister naar de klemtoon. In een samenstelling ligt die meestal op het eerste deel: *ROODkapje*, *HOOGleraar*. In een woordgroep op het laatste: *een rood KAPje*, *een hoge LEraar*. Daarom schrijf je de samenstelling aan elkaar.',
            lab: {
              label: 'Tik een paar',
              chips: [
                { k: 'ROODkapje', out: 'samenstelling', note: 'Het meisje uit het sprookje.' },
                { k: 'rood KAPje', out: 'woordgroep', note: 'Een kapje dat rood is.' },
                { k: 'HOOGleraar', out: 'samenstelling', note: 'Een professor, ook als hij klein is.' },
              ],
            },
            rule: 'Samenstelling: aan elkaar, klemtoon meestal vooraan, het hoofd rechts.',
          },
          {
            text: 'Niet elke samenstelling heeft haar hoofd binnenin. Een *dikkop* is geen kop maar een kikkervisje; een *roodborstje* is een vogel. Dat heet *exocentrisch*: het hoofd zit buiten het woord. En in *zoetzuur* of *zangeres-actrice* zijn beide delen even belangrijk: *coördinatief*.',
            quiz: {
              q: 'Wat voor samenstelling is ‘bleekgezicht’?',
              options: ['exocentrisch', 'gewoon, met het hoofd rechts', 'coördinatief'],
              answer: 'exocentrisch',
              why: 'Een bleekgezicht is geen gezicht maar iemand mét een bleek gezicht.',
            },
            deep: {
              q: 'Waarom het streepje in zee-egel?',
              a: 'Als twee klinkers botsen en je het woord anders verkeerd zou lezen, zet je een koppelteken: *zee-egel*, *auto-ongeluk*, *thee-ei*. Ook tussen gelijkwaardige delen: *zangeres-actrice*. Maar niet bij gewone samenstellingen: *voetbalveld*, nooit *voetbal-veld*.',
            },
          },
        ],
      },
      {
        kind: 'speed',
        id: 'aaneen',
        prompt: 'Aan elkaar of los?',
        intro: 'Eén samenstelling, of twee woorden in een woordgroep?',
        seconds: 30,
        items: [
          { a: 'tuin', b: 'stoel', joined: true, tip: 'tuinstoel: een soort stoel.' },
          { a: 'mooi', b: 'weer', joined: false, tip: 'Woordgroep: het weer is mooi.' },
          { a: 'kinder', b: 'boek', joined: true, tip: 'kinderboek.' },
          { a: 'heel', b: 'groot', joined: false, tip: 'heel versterkt groot: los.' },
          { a: 'ziekenhuis', b: 'bed', joined: true, tip: 'ziekenhuisbed.' },
          { a: 'nieuwe', b: 'fiets', joined: false, tip: 'Bijvoeglijk naamwoord + zelfstandig naamwoord: los.' },
          { a: 'fietsen', b: 'stalling', joined: true, tip: 'fietsenstalling.' },
        ],
      },
      {
        kind: 'fix',
        id: 'los',
        prompt: 'Tik het foute woord aan en verbeter het.',
        sentence: 'De belasting dienst stuurde een brief.',
        wrong: 1,
        answer: 'belastingdienst',
        why: 'Een samenstelling schrijf je aan elkaar: belastingdienst. (Tik het eerste deel.)',
      },
      {
        kind: 'sort',
        id: 'soorten',
        prompt: 'Welk soort samenstelling?',
        buckets: ['hoofd rechts', 'exocentrisch', 'coördinatief'],
        items: [
          { t: 'voetbal', b: 0 },
          { t: 'kerkklok', b: 0 },
          { t: 'dikkop', b: 1 },
          { t: 'roodborstje', b: 1 },
          { t: 'zoetzuur', b: 2 },
          { t: 'zangeres-actrice', b: 2 },
        ],
        why: 'Een voetbal is een bal. Een dikkop is geen kop. Zoetzuur is zoet én zuur.',
      },
    ],
  },
  {
    id: 'd10',
    stage: 'bachelor',
    domain: 'morf',
    also: ['orth'],
    title: 'Pannenkoek of pannekoek?',
    skill: 'Spelling',
    icon: '-s-',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Tussenklanken',
        panels: [
          {
            text: 'Hoeveel pannen heb je nodig voor een pannenkoek? Eén. Toch schrijf je *pannenkoek*. En een *ruggengraat* zit in één rug. Het stukje tussen de twee delen heet een *tussenklank* of *bindmorfeem*. Het ziet eruit als een meervoud, maar het betekent niets.',
            build: { before: 'Een kast voor boeken is een…', stem: 'boek', endings: ['kast', 'ekast', 'enkast', 'skast'], answer: 'enkast', note: 'boekenkast: boek heeft alleen een meervoud op -en.' },
            rule: 'Schrijf -en- als het eerste deel een zelfstandig naamwoord is met alleen een meervoud op -en: pannenkoek, boekenkast, ruggengraat.',
          },
          {
            text: 'De uitzonderingen: schrijf *-e-* zonder n als het eerste deel uniek is (*zonnebloem*, *koninginnedag*) of geen meervoud heeft (*rijstebrij*). En de tussen-s? Die is eenvoudiger: hoor je hem, schrijf je hem. *Dorpsplein*, *schaapskooi*, maar *stadhuis*.',
            lab: {
              label: 'Tik een woord',
              chips: [
                { k: 'zonnebloem', out: 'zon + e + bloem', note: 'Er is maar één zon: geen n.' },
                { k: 'rijstebrij', out: 'rijst + e + brij', note: 'Rijst heeft geen meervoud: geen n.' },
                { k: 'dorpsplein', out: 'dorp + s + plein', note: 'Je hoort een s, dus je schrijft hem.' },
                { k: 'stadhuis', out: 'stad + huis', note: 'Geen s te horen: geen s.' },
              ],
            },
          },
          {
            text: 'Waar komt de tussenklank vandaan? Uit oude naamvallen. In het Middelnederlands eindigden veel zelfstandige naamwoorden in de tweede naamval (de genitief) op *-en*, ook in het enkelvoud. Een pannenkoek was dus een koek van de pan. De naamval verdween, het stukje bleef. Daarom heeft het geen meervoudsbetekenis meer.',
            deep: {
              q: 'Hoe kiezen sprekers bij een nieuw woord?',
              a: 'Andrea Krott, Harald Baayen en Robert Schreuder (2001) lieten zien dat sprekers kijken naar de *familie* van het eerste deel. *Dorp* krijgt bijna altijd een s (*dorpsplein*, *dorpshuis*, *dorpsstraat*), dus een nieuw woord met *dorp* ook. De keuze is dus geen regel in je hoofd, maar *analogie* met woorden die je al kent.',
            },
            quiz: {
              q: 'Waarom schrijf je ‘zonnebloem’ zonder n?',
              options: ['Er is maar één zon', 'Je hoort geen n', 'Zon heeft een meervoud op -s'],
              answer: 'Er is maar één zon',
              why: 'Een uniek eerste deel krijgt -e-: zonnebloem, koninginnedag.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'tussen',
        prompt: 'Welke tussenklank?',
        buckets: ['-en-', '-e-', '-s-', 'geen'],
        items: [
          { t: 'pannenkoek', b: 0 },
          { t: 'ruggengraat', b: 0 },
          { t: 'zonnebloem', b: 1 },
          { t: 'rijstebrij', b: 1 },
          { t: 'dorpsplein', b: 2 },
          { t: 'schaapskooi', b: 2 },
          { t: 'stadhuis', b: 3 },
          { t: 'voetbal', b: 3 },
        ],
        why: '-en- bij een meervoud op -en, -e- bij uniek of zonder meervoud, -s- als je hem hoort.',
      },
      {
        kind: 'type',
        id: 'graat',
        prompt: 'Typ het woord.',
        before: 'Je wervelkolom heet ook je',
        after: '.',
        hint: 'rug + graat',
        answer: 'ruggengraat',
        why: 'rug heeft alleen het meervoud ruggen, dus -en-. Ook al heb je maar één rug.',
      },
      {
        kind: 'bet',
        id: 'dorp',
        prompt: 'Een nieuwe app voor je dorp heet…',
        options: ['dorpsapp', 'dorpapp', 'dorpenapp'],
        answer: 'dorpsapp',
        why: 'De familie van dorp kiest bijna altijd -s-: dorpsplein, dorpshuis. Analogie wint.',
      },
    ],
  },
  {
    id: 'd11',
    stage: 'bachelor',
    domain: 'morf',
    also: ['sem'],
    title: 'Elk achtervoegsel stelt eisen',
    skill: 'Woorden',
    icon: '-baar',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Afleiden met regels',
        panels: [
          {
            text: 'Een achtervoegsel is kieskeurig. *-baar* wil een werkwoord met een lijdend voorwerp: je eet *iets*, dus *eetbaar*. Je slaapt niet *iets*, dus *slaapbaar* bestaat niet. Daarom klinkt *appbaar* (je appt iemand) prima en *lachbaar* raar.',
            lab: {
              label: 'Tik een werkwoord',
              chips: [
                { k: 'eten', out: 'eetbaar', note: 'Iets eten: overgankelijk.' },
                { k: 'wassen', out: 'wasbaar', note: 'Iets wassen: overgankelijk.' },
                { k: 'slapen', out: '∅', note: 'Je slaapt niet iets: geen -baar.' },
                { k: 'appen', out: 'appbaar', note: 'Een nieuw woord, maar het past: je appt iemand.' },
              ],
            },
            rule: '-baar: overgankelijk werkwoord → bijvoeglijk naamwoord, betekenis ‘kan ge-…-d worden’.',
          },
          {
            text: 'Soms bestaat een woord niet omdat er al een ander woord op die plek staat. Dat heet *blokkering*. Iemand die kookt is een *kok*, dus *koker* betekent iets anders (een buis). Iemand die steelt is een *dief*, dus niemand zegt *steler*.',
            quiz: {
              q: 'Waarom zeg je geen ‘steler’?',
              options: ['Dief bestaat al', '-er past niet op werkwoorden', 'Stelen is onovergankelijk'],
              answer: 'Dief bestaat al',
              why: 'Blokkering: het bestaande woord dief bezet de plek. -er past verder prima: lezer, bakker.',
            },
            deep: {
              q: 'Wie bedacht blokkering?',
              a: 'Mark Aronoff (1976). Zijn voorbeeld: Engels *glory* blokkeert *gloriosity*. Blokkering werkt het sterkst met vaak gebruikte woorden. Een zeldzaam woord blokkeert zwak, en dan ontstaan er toch dubbelvormen.',
            },
          },
          {
            text: 'Productief of dood? *-heid* plakt aan bijna elk bijvoeglijk naamwoord, ook aan nieuwe: *duurzaamheid*, *bereikbaarheid*. *-te* doet dat niet meer: *warmte*, *lengte* en *diepte* zijn oude woorden, en niemand zegt *blauwte*. Een achtervoegsel kan dus uitsterven terwijl de woorden blijven.',
            quiz: {
              q: 'Welk achtervoegsel is nog productief?',
              options: ['-heid', '-te'],
              answer: '-heid',
              why: 'Met -heid maak je nog steeds nieuwe woorden. -te zit alleen in oude woorden.',
            },
          },
        ],
      },
      {
        kind: 'morph',
        id: 'drink',
        prompt: 'Bouw woorden met drink',
        intro: 'Elk stukje stelt een eis. Niet alles past.',
        stem: 'drink',
        slots: [
          { id: 'pre', label: 'Ervoor', side: 'before', parts: ['on'] },
          { id: 's1', label: 'Erachter', side: 'after', parts: ['baar', 'er'] },
          { id: 's2', label: 'Daarna', side: 'after', parts: ['heid'] },
        ],
        words: [
          { combo: ['', '', ''], w: 'drink', cls: 'ww', mean: 'De stam van drinken: ik drink.' },
          { combo: ['', 'baar', ''], w: 'drinkbaar', cls: 'bn', mean: 'Wat je kunt drinken.' },
          { combo: ['on', 'baar', ''], w: 'ondrinkbaar', cls: 'bn', mean: 'Niet te drinken. on- wil een bijvoeglijk naamwoord.' },
          { combo: ['', 'baar', 'heid'], w: 'drinkbaarheid', cls: 'zn', mean: 'Hoe goed iets te drinken is.' },
          { combo: ['on', 'baar', 'heid'], w: 'ondrinkbaarheid', cls: 'zn', mean: 'Het niet te drinken zijn.' },
          { combo: ['', 'er', ''], w: 'drinker', cls: 'zn', mean: 'Iemand die drinkt.' },
        ],
        forms: { '': 'drink', baar: 'drinkbaar', er: 'drinker' },
        hints: [
          { part: 'on', note: 'Bestaat niet. on- plakt aan een bijvoeglijk naamwoord, zoals drinkbaar.' },
          { part: 'heid', note: 'Bestaat niet. -heid plakt aan een bijvoeglijk naamwoord, zoals drinkbaar.' },
        ],
        goal: 5,
        done: { title: 'Kieskeurige stukjes', text: 'Elk affix vraagt een woordsoort en levert er een. Zo voorspel je welke woorden kunnen bestaan.' },
      },
      {
        kind: 'sort',
        id: 'baar',
        prompt: 'Kan er -baar achter?',
        buckets: ['kan', 'kan niet'],
        items: [
          { t: 'lezen', b: 0 },
          { t: 'betalen', b: 0 },
          { t: 'googelen', b: 0 },
          { t: 'slapen', b: 1 },
          { t: 'lachen', b: 1 },
          { t: 'vallen', b: 1 },
        ],
        why: 'Je leest, betaalt of googelt iets. Je slaapt, lacht of valt niet iets.',
      },
      {
        kind: 'bet',
        id: 'kok',
        prompt: 'Waarom betekent ‘koker’ niet ‘iemand die kookt’?',
        options: ['Kok blokkeert die betekenis', 'Koken is onovergankelijk', '-er past niet achter een k'],
        answer: 'Kok blokkeert die betekenis',
        why: 'Blokkering: de plek ‘iemand die kookt’ is al bezet door kok.',
      },
    ],
  },
  {
    id: 'd12',
    stage: 'bachelor',
    domain: 'morf',
    also: ['fon'],
    title: 'Glas, glazen, beter, best',
    skill: 'Spelling',
    icon: '≋',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Als de stam van vorm wisselt',
        panels: [
          {
            text: 'Niet alleen uitgangen hebben allomorfen; stammen ook. *Glas* wordt *glazen*, *huis* wordt *huizen*: de s wordt z zodra er een klinker achter komt. In *glas* hoor je geen z omdat een Nederlandse slotmedeklinker altijd stemloos is (de verscherping uit Klank en letter).',
            lab: {
              label: 'Tik een woord',
              chips: [
                { k: 'glas', out: 'glazen', note: 's ~ z: de stam eindigt eigenlijk op z.' },
                { k: 'schip', out: 'schepen', note: 'i ~ ee: de klinker wisselt.' },
                { k: 'stad', out: 'steden', note: 'a ~ ee: ook hier wisselt de klinker.' },
                { k: 'kind', out: 'kinderen', note: 'Een oud meervoud -er, met -en erachter.' },
              ],
            },
          },
          {
            text: 'Hoe extreem kan het worden? Bij *goed*, *beter*, *best* lijkt de stam helemaal niet meer op elkaar. Dat heet *suppletie*: een ander woord vult het gat in het rijtje. Ook *zijn*, *ben*, *is*, *was* en *veel*, *meer*, *meest*.',
            quiz: {
              q: 'Welk paar is suppletie?',
              options: ['goed / beter', 'groot / groter', 'glas / glazen'],
              answer: 'goed / beter',
              why: 'Bij beter is goed helemaal verdwenen. Groter en glazen houden de stam herkenbaar.',
            },
          },
          {
            text: 'Leenwoorden nemen hun eigen allomorfen mee. *Museum* wordt *musea*, *historicus* wordt *historici*, *stabiel* wordt *stabil-* in *stabiliteit*. Wat de allomorf kiest, kan klank zijn (*-pje* na m), het woord zelf (*kinderen*) of de herkomst (*musea*).',
            rule: 'Allomorfie kan bepaald worden door klank (fonologisch), door het woord (lexicaal) of door de herkomst van het woord.',
            deep: {
              q: 'Waarom dan hond met een d, maar huis zonder z?',
              a: 'De spelling kiest per klankpaar. Bij d/t en b/p wint de *gelijkvormigheid*: je schrijft de stam zoals in het meervoud, dus *hond* (*honden*) en *web* (*webben*). Bij s/z en f/v wint de klank: *huis* (*huizen*), *brief* (*brieven*). Zo schrijft het Nederlands twee principes door elkaar, en dat moet je gewoon weten.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'wat-kiest',
        prompt: 'Wat bepaalt de vorm?',
        buckets: ['klank', 'het woord zelf', 'herkomst'],
        items: [
          { t: 'boom → boompje', b: 0 },
          { t: 'glas → glazen', b: 0 },
          { t: 'kind → kinderen', b: 1 },
          { t: 'goed → beter', b: 1 },
          { t: 'museum → musea', b: 2 },
          { t: 'historicus → historici', b: 2 },
        ],
        why: '-pje en z volgen uit de klank. Kinderen en beter moet je per woord leren. Musea en historici komen uit het Latijn.',
      },
      {
        kind: 'type',
        id: 'steden',
        prompt: 'Typ het meervoud.',
        before: 'Amsterdam en Utrecht zijn twee grote',
        after: '.',
        hint: 'stad',
        answer: 'steden',
        why: 'stad ~ sted-: de klinker wisselt, en d blijft d.',
      },
      {
        kind: 'swipe',
        id: 'allomorf',
        prompt: 'Klopt deze zin?',
        cards: [
          { t: 'Goed en beter zijn een geval van suppletie.', ok: true, why: 'Een andere stam vult de vergrotende trap.' },
          { t: 'In glas hoor je een s omdat de stam op s eindigt.', ok: false, fix: 'De stam eindigt op z; aan het eind wordt die stemloos', why: 'glazen laat de echte z zien.' },
          { t: 'Kinderen heeft twee meervoudsuitgangen achter elkaar.', ok: true, why: 'Het oude -er plus -en.' },
        ],
      },
      {
        kind: 'bet',
        id: 'lid',
        prompt: 'Wat is het meervoud van ‘lid’ (van een club)?',
        options: ['leden', 'lidden', 'lids'],
        answer: 'leden',
        why: 'Net als schip ~ schepen en stad ~ steden: de korte klinker wordt een lange ee.',
      },
    ],
  },
];
