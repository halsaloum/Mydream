import type { StepInput } from '../../schema';

/** Onderzoek bij w8: een derde uitlegronde op onderzoeksniveau, daarna zwaardere oefeningen. */
export const ONDERZOEK_W8: StepInput[] = [
  {
    kind: 'explain',
    id: 'onderzoek',
    title: 'Een glijbaan, een frame en een volgorde van klassen',
    panels: [
      {
        text: 'John Robert Ross (1972) zette de woordsoorten op een glijbaan, met het naamwoord als eindstation. Het deelwoord staat ergens halverwege: half werkwoord, half bijvoeglijk naamwoord. Hoe ver het is doorgeschoven, meet je met drie toetsen die alleen een bijvoeglijk naamwoord haalt: kan er *zeer* voor, kan er *-er* achter, kan er *on-* voor? *Bezorgd* over de kinderen haalt ze alle drie: *zeer bezorgd*, *bezorgder*, *onbezorgd*. Het pakje dat *bezorgd* is, haalt er geen. *Gelezen* haalt er één: *ongelezen* bestaat, *zeer gelezen* niet. Eén vorm, drie plekken op de glijbaan.',
        rule: 'Drie toetsen voor bijvoeglijk naamwoord: *zeer*, *-er*, *on-*. Hoe meer een deelwoord er haalt, hoe verder het van het werkwoord af staat.',
        paradigm: {
          q: 'Haalt het deelwoord de toets? Vul ja of nee in',
          cols: ['zeer …', '…-er', 'on-…'],
          rows: [
            {
              label: 'bezorgd (de moeder)',
              cells: ['ja', { fill: 'ja', hint: 'Bezorgder dan ooit: dat kan.' }, { fill: 'ja', hint: 'Onbezorgd bestaat: een onbezorgde jeugd.' }],
            },
            {
              label: 'bezorgd (het pakje)',
              cells: [
                { fill: 'nee', hint: 'Een zeer bezorgd pakje? Nee. Het pakje is bezorgd door de postbode: een werkwoord.' },
                'nee',
                { fill: 'nee', hint: 'Een onbezorgd pakje bestaat niet; het is nog niet bezorgd.' },
              ],
            },
            {
              label: 'gelezen',
              cells: [
                { fill: 'nee', hint: 'Een zeer gelezen boek? Nee, dat is een veelgelezen boek.' },
                'nee',
                { fill: 'ja', hint: 'Ongelezen bestaat: een stapel ongelezen post.' },
              ],
            },
            { label: 'verliefd', cells: [{ fill: 'ja' }, { fill: 'ja', hint: 'Verliefder: dat kan.' }, { fill: 'nee', hint: 'Onverliefd bestaat niet.' }] },
          ],
          note: 'Bezorgd haalt drie toetsen of geen, afhankelijk van de betekenis. Gelezen haalt er één, verliefd twee. De grens tussen deelwoord en bijvoeglijk naamwoord is geen lijn maar een helling.',
        },
        deep: {
          q: 'Wat deed Ross precies?',
          a: 'Hij liet zien dat zinsregels niet ja-of-nee werken: hoe verder een woord richting naamwoord schuift, hoe slechter een regel voor werkwoorden erop past. Zijn titel, *Endstation Hauptwort*, is een knipoog naar *Endstation Sehnsucht*, de Duitse naam van een beroemd toneelstuk. Bas Aarts (2007) werkte het idee uit tot *gradiëntie*: gradaties tussen klassen (*intersectief*) en binnen één klasse (*subsectief*). Een deelwoord als *bezorgd* zit tussen twee klassen in.',
        },
      },
      {
        text: 'Hoe leert een kind woordsoorten, nog vóór het de betekenis kent? Toben Mintz (2003) telde in Engelse ouder-kindtaal *frames*: twee vaste woorden met één open plek ertussen, zoals *you … it*. De woorden die in zo’n frame vallen, zijn bijna allemaal van dezelfde soort: in *you … it* bijna alleen werkwoorden. Een paar tientallen frequente frames sorteren de woordenschat al verrassend netjes. Dat is de plektoets uit de eerste uitleg, maar dan als leermechanisme. Daarom werken onzinzinnen: *de wup is lief* zet *wup* in het frame van een naamwoord.',
        rule: 'Een frame (*de … is*, *ik … het*) sorteert woorden in klassen, nog voor je weet wat ze betekenen.',
        mark: {
          q: 'Tik de woorden die het frame de … is als naamwoord aanwijst',
          sentence: 'de wup is lief, ik tam het even, de flim is weg, ik gorp het nu',
          targets: [1, 9],
          note: 'wup en flim staan tussen de en is: naamwoorden. tam en gorp staan tussen ik en het: werkwoorden. Zonder één betekenis te kennen heb je vier onzinwoorden gesorteerd.',
        },
        deep: {
          q: 'Werkt dat ook in het Nederlands?',
          a: 'Lastiger. In het Nederlands springt de persoonsvorm naar plek 2 in de hoofdzin en naar achteren in de bijzin, en scheidbare werkwoorden vallen uit elkaar. Het frame rond een werkwoord is dus minder vast dan in het Engels. Waarschijnlijk leunt een Nederlands kind daarom sterker op de vorm: *-t*, *-en*, *ge-*. Plek en vorm werken samen, net als in de toetsen van deze les.',
        },
      },
      {
        text: 'De lastigste woordjes zijn de kleinste: *maar*, *eens*, *even*, *toch*, *wel*. In *Ik wil wel, maar ik kan niet* is *maar* een voegwoord. In *Ga maar zitten* is het iets anders: het verzacht het bevel. Zulke woorden heten *modale partikels* (ook wel *schakeringspartikels*). Ze hebben eigen gedrag: geen klemtoon, nooit op plek 1, altijd in het middenveld, en graag in rijtjes (*Kom nou toch eens even hier*). Het Duits heeft ze ook (*mal*, *doch*), het Engels nauwelijks. Daarom zijn ze zo moeilijk te vertalen.',
        rule: 'Modaal partikel: onbeklemtoond, nooit vooraan, alleen in het middenveld. Dezelfde vorm kan elders voegwoord of bijwoord zijn.',
        lab: {
          label: 'Tik een woordje en probeer het vooraan',
          chips: [
            {
              k: 'maar',
              out: 'Maar ik kan niet. (voegwoord) · Ga maar. (partikel)',
              note: 'Het voegwoord verbindt twee zinnen en staat vooraan. Het partikel verzacht het bevel en kan niet naar plek 1 zonder van betekenis te veranderen.',
            },
            {
              k: 'toch',
              out: 'Toch kwam hij. (bijwoord) · Hij kwam toch? (partikel)',
              note: 'Het bijwoord kan vooraan en draagt klemtoon: ondanks alles. Het partikel vraagt om bevestiging en blijft onbeklemtoond in het midden.',
            },
            {
              k: 'eens',
              out: 'Eens was hij jong. (bijwoord: ooit) · Kom eens hier. (partikel)',
              note: 'Als bijwoord betekent eens ooit en kan het vooraan. Als partikel maakt het een verzoek vriendelijker en kan het nergens anders staan dan in het midden.',
            },
            {
              k: 'even',
              out: 'Even getallen. (bijvoeglijk naamwoord) · Doe de deur even dicht. (partikel)',
              note: 'Het bijvoeglijk naamwoord staat voor een naamwoord en betekent deelbaar door twee. Het partikel maakt het verzoek kleiner en klinkt zonder klemtoon.',
            },
          ],
        },
        deep: {
          q: 'Waarom tellen de tien klassen van de ANS ze niet apart?',
          a: 'Omdat ze qua vorm op bijwoorden lijken: ze buigen niet en vullen geen eigen zinsdeel. De ANS bespreekt ze daarom bij de bijwoorden, als een groep apart. Veel taalkundigen zien ze liever als eigen klasse: hun plek en hun gebrek aan klemtoon verschillen systematisch van gewone bijwoorden. Welke woordsoort een woord heeft, hangt dus ook af van welke toets je het zwaarst laat wegen.',
        },
      },
      {
        text: 'Kees Hengeveld (1992) vergeleek de woordsoortsystemen van talen en vond een vaste volgorde: werkwoord > zelfstandig naamwoord > bijvoeglijk naamwoord > bijwoord van wijze. Heeft een taal een aparte klasse voor een stap rechts, dan heeft ze alle stappen links ook. Het Engels gaat helemaal naar rechts: *beautiful* tegenover *beautifully*. Het Nederlands stopt een stap eerder: *mooi* doet allebei. In zijn termen is het Nederlands daar *flexibel*: één klasse voor twee taken. Dat is precies wat de ANS bedoelt met ‘bijvoeglijk naamwoord, bijwoordelijk gebruikt’. En de talen met een handvol bijvoeglijke naamwoorden, die Dixon beschreef, hebben zeker geen aparte bijwoorden van wijze.',
        rule: 'Hengevelds volgorde: werkwoord > naamwoord > bijvoeglijk naamwoord > bijwoord van wijze. Het Nederlands stopt bij het bijvoeglijk naamwoord.',
        quiz: {
          q: 'Een taal heeft een aparte klasse bijwoorden van wijze. Wat volgt daaruit volgens Hengeveld?',
          options: [
            'Ze heeft ook aparte werkwoorden, naamwoorden en bijvoeglijke naamwoorden',
            'Ze heeft geen bijvoeglijke naamwoorden nodig',
            'Ze is een flexibele taal',
          ],
          answer: 'Ze heeft ook aparte werkwoorden, naamwoorden en bijvoeglijke naamwoorden',
          why: 'De volgorde is een implicatie: elke stap rechts veronderstelt alle stappen links. Het Engels, met -ly, heeft dus alle vier.',
        },
        deep: {
          q: 'Wat heb je hieraan bij het schrijven?',
          a: 'Veel fouten zijn een Engels systeem in een Nederlandse zin: een extra uitgang of een *-e* bij bijwoordelijk gebruik, zoals *Hij rijdt snelle*. Wie weet dat het Nederlands hier één klasse heeft, weet ook dat de vorm bij een werkwoord altijd kaal is: *mooi*, *snel*, *zacht*. Alleen vóór een naamwoord buigt het woord.',
        },
      },
    ],
  },
  {
    kind: 'highlight',
    id: 'onzin',
    prompt: 'Kleur de woordsoorten in de onzinzin',
    intro: 'Je kent geen enkel inhoudswoord. Gebruik vorm, plek en de partikeltoets. Lidwoorden en dan blijven wit.',
    pens: [
      { id: 'zn', label: 'zelfst. nw.', tag: 'zn', ask: 'Staat het na de, die of een?', accent: 'blue' },
      { id: 'ww', label: 'werkwoord', tag: 'ww', ask: 'Staat het vooraan als bevel, of op plek 2 met een -t?', accent: 'red' },
      { id: 'bn', label: 'bijv. nw.', tag: 'bn', ask: 'Staat het met een -e tussen lidwoord en naamwoord?', accent: 'green' },
      { id: 'partikel', label: 'partikel', tag: 'prt', ask: 'Onbeklemtoond, in het middenveld, en nooit vooraan?', accent: 'purple' },
    ],
    words: [
      { t: 'Blork', role: 'ww' },
      { t: 'maar', role: 'partikel' },
      { t: 'eens', role: 'partikel' },
      { t: 'die' },
      { t: 'glurpe', role: 'bn' },
      { t: 'snaffels,', role: 'zn' },
      { t: 'dan' },
      { t: 'trimpt', role: 'ww' },
      { t: 'de' },
      { t: 'vroem', role: 'zn' },
      { t: 'wel.', role: 'partikel' },
    ],
    done: {
      title: 'Zonder één betekenis',
      text: 'blork en trimpt: werkwoord (bevel vooraan, -t op plek 2). glurpe: -e tussen die en snaffels. snaffels en vroem: na die en de. maar, eens en wel: partikels in het middenveld.',
    },
  },
  {
    kind: 'sort',
    id: 'glijbaan',
    prompt: 'Hoeveel toetsen voor bijvoeglijk naamwoord haalt dit deelwoord? Denk aan zeer, -er en on-.',
    buckets: ['alle drie', 'één of twee', 'geen: puur deelwoord'],
    items: [
      { t: 'bekend', b: 0 },
      { t: 'geschikt', b: 0 },
      { t: 'bezorgd (de moeder)', b: 0 },
      { t: 'vermoeid', b: 0 },
      { t: 'gelezen', b: 1 },
      { t: 'gekookt', b: 1 },
      { t: 'verliefd', b: 1 },
      { t: 'bezorgd (het pakje)', b: 2 },
      { t: 'verhuisd', b: 2 },
      { t: 'gegeven', b: 2 },
    ],
    why: 'Zeer bekend, bekender, onbekend; zeer geschikt, geschikter, ongeschikt; zeer vermoeid, vermoeider, onvermoeid: helemaal bijvoeglijk. Gelezen en gekookt halen alleen on- (ongelezen, ongekookt), verliefd alleen zeer en -er. Het bezorgde pakje, verhuisd en gegeven halen niets: pure deelwoorden.',
  },
  {
    kind: 'ambiguity',
    id: 'bezorgd',
    prompt: 'Eén zin, twee woordsoorten',
    intro: 'Kies een betekenis en zoek de zin die alleen dát kan betekenen.',
    sentence: 'De post is bezorgd.',
    meanings: [
      {
        id: 'ww',
        label: 'De brieven zijn afgeleverd (deelwoord van bezorgen)',
        highlight: ['is bezorgd'],
        right: 'Klopt. Is bezorgd is hier een voltooide lijdende vorm: iemand heeft de post bezorgd.',
      },
      {
        id: 'bn',
        label: 'Het postbedrijf maakt zich zorgen (bijvoeglijk naamwoord)',
        highlight: ['bezorgd'],
        right: 'Klopt. Hier haalt bezorgd alle drie de toetsen: zeer bezorgd, bezorgder, onbezorgd.',
      },
    ],
    options: [
      { t: 'De post is bezorgd, zei ze.', fits: null, note: 'Nog steeds allebei mogelijk: er kwam alleen een spreker bij.' },
      { t: 'De post is vanochtend om tien uur door de postbode bezorgd.', fits: 'ww' },
      { t: 'De post is zeer bezorgd over de dalende omzet.', fits: 'bn' },
    ],
    done: {
      title: 'Dezelfde vorm, twee plekken op de glijbaan',
      text: 'Door de postbode en om tien uur passen alleen bij het werkwoord; zeer past alleen bij het bijvoeglijk naamwoord. De toetsen beslissen, niet de vorm.',
    },
  },
  {
    kind: 'bet',
    id: 'hengeveld',
    prompt:
      'Een taal heeft werkwoorden en naamwoorden, maar geen aparte klasse bijvoeglijke naamwoorden. Wat voorspelt Hengevelds volgorde over bijwoorden van wijze?',
    options: ['Die heeft ze dan ook niet als aparte klasse', 'Die heeft ze juist wel, om het gat te vullen', 'Daar zegt de volgorde niets over'],
    answer: 'Die heeft ze dan ook niet als aparte klasse',
    why: 'Werkwoord > naamwoord > bijvoeglijk naamwoord > bijwoord van wijze. Ontbreekt een stap, dan ontbreekt alles rechts ervan ook. De eigenschappen zeg je dan met een werkwoord of een naamwoord.',
  },
  {
    kind: 'swipe',
    id: 'klassen-waar',
    prompt: 'Klopt deze zin?',
    cards: [
      {
        t: 'Volgens Ross staat het deelwoord tussen werkwoord en bijvoeglijk naamwoord in.',
        ok: true,
        why: 'Halverwege de glijbaan, met het naamwoord als eindstation.',
      },
      {
        t: 'Bezorgd haalt altijd alle drie de toetsen voor bijvoeglijk naamwoord.',
        ok: false,
        fix: 'Alleen in de betekenis ongerust; het bezorgde pakje haalt er geen',
        why: 'Zeer bezorgd over de kinderen kan, een zeer bezorgd pakje niet.',
      },
      {
        t: 'Mintz vond dat de woorden in een frame zoals you … it bijna allemaal van dezelfde soort zijn.',
        ok: true,
        why: 'In you … it staan bijna alleen werkwoorden. Zo sorteert een kind zonder betekenis.',
      },
      {
        t: 'Een modaal partikel kan met klemtoon vooraan in de zin staan.',
        ok: false,
        fix: 'Nooit vooraan en nooit met klemtoon',
        why: 'Dat is precies de toets die het van een bijwoord of voegwoord onderscheidt.',
      },
      { t: 'In Ga maar zitten is maar een voegwoord.', ok: false, fix: 'Het is een modaal partikel', why: 'Het verbindt geen zinnen; het verzacht het bevel.' },
      {
        t: 'Volgens Hengeveld heeft een taal met aparte bijwoorden van wijze ook aparte bijvoeglijke naamwoorden.',
        ok: true,
        why: 'Elke stap rechts in de volgorde veronderstelt de stappen links.',
      },
      {
        t: 'Het Nederlands heeft volgens Hengeveld een aparte klasse bijwoorden van wijze.',
        ok: false,
        fix: 'Het Nederlands is daar flexibel: mooi doet allebei',
        why: 'Het Engels heeft beautifully, het Nederlands gebruikt het bijvoeglijk naamwoord.',
      },
    ],
  },
];
