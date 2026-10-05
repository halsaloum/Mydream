import type { LessonInput } from '../schema';

/**
 * Masterlessen voor het niveau "De lettergreep": moras en het minimale woord, typologie en
 * verwerving, ONSET en NOCODA in Optimaliteitstheorie, het prosodische woord, ritmeklassen
 * en de lettergreep in spraakproductie. Ze bouwen voort op `greep.ts`.
 *
 * Eisnamen in OT-tableaus volgen de literatuur (Engels). Het sterretje van een verbod is het
 * teken ∗ (U+2217), omdat * in lesteksten een taalvoorbeeld markeert.
 */
export const GREEP_MASTER_LESSONS: LessonInput[] = [
  {
    id: 'g12',
    stage: 'master',
    domain: 'fon',
    title: 'Hoe zwaar is een lettergreep?',
    skill: 'Spelling',
    icon: 'μμ',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Moras en het minimale woord',
        panels: [
          {
            text: 'Welkom in de master, waar we lettergrepen gaan wegen. De eenheid heet *mora* (μ). Een korte klinker: één mora. Een lange klinker: twee. Een medeklinker in de coda telt in veel talen ook als mora. Een *lichte* lettergreep weegt één mora, een *zware* twee.',
            lab: {
              label: 'Tik een lettergreep',
              chips: [
                { k: 'zee', out: 'ee = μμ', note: 'Lange klinker: twee moras, zwaar.' },
                { k: 'pak', out: 'a + k = μμ', note: 'Korte klinker plus coda: ook zwaar.' },
                { k: 'de', out: 'ə = μ', note: 'Een schwa zonder coda: één mora, licht.' },
              ],
            },
            deep: {
              q: 'En de onset dan?',
              a: 'De onset telt in bijna geen enkele taal mee voor gewicht: *pa* en *spra* wegen hetzelfde. Dat is een sterk argument voor de rijm als eenheid, en voor het *moramodel* (Hyman 1985, Hayes 1989), dat de onset direct aan de lettergreep hangt en alleen de rijm in moras verdeelt.',
            },
          },
          {
            text: 'Het Japans telt geen lettergrepen, maar moras. Een Japanse haiku is vijf-zeven-vijf *moras*. *Tōkyō* heeft twee lettergrepen maar vier moras: to-o-kyo-o. *Nippon*: ni-p-po-n, ook vier. Een slot-n en de eerste helft van een dubbele medeklinker krijgen een eigen kana: にっぽん.',
            lab: {
              label: 'Tik een woord',
              chips: [
                { k: 'sushi', out: 'su · shi = 2 moras', note: 'Twee lichte lettergrepen.' },
                { k: 'Tōkyō', out: 'to · o · kyo · o = 4 moras', note: 'Twee lettergrepen, maar allebei lang.' },
                { k: 'kitte', out: 'ki · t · te = 3 moras', note: 'Kitte is een postzegel. De dubbele t telt als eigen mora.' },
              ],
            },
            quiz: {
              q: 'Hoeveel moras heeft ‘Ōsaka’?',
              options: ['4', '3', '2'],
              answer: '4',
              why: 'o-o-sa-ka: de lange ō telt dubbel.',
            },
          },
          {
            text: 'Terug naar het Nederlands. Een inhoudswoord eindigt nooit op een korte klinker. *Ja* en *zo* hebben lange klinkers, en [bɑ] bestaat niet als woord. Fonologen zeggen: een woord weegt minstens twee moras, het *minimale woord*. Een korte klinker weegt maar één mora, dus hij heeft een coda nodig: *bak*, *bal*, *bad*. Dat is de diepere reden achter de dubbele medeklinker in *bom-men*.',
            rule: 'Een Nederlands inhoudswoord weegt minstens twee moras: een lange klinker, of een korte klinker met coda.',
            quiz: {
              q: 'Welk verzonnen woord kan geen Nederlands inhoudswoord zijn?',
              options: ['[bɪ]', '[biː]', '[bɪk]'],
              answer: '[bɪ]',
              why: '[ɪ] is kort: één mora. Een inhoudswoord heeft er minstens twee nodig.',
            },
            deep: {
              q: 'En de, je en te?',
              a: 'Dat zijn *functiewoorden*. Ze dragen nooit zelf de klemtoon en leunen op een buurwoord. De eis van twee moras geldt voor inhoudswoorden: zelfstandige naamwoorden, werkwoorden en bijvoeglijke naamwoorden. Een paar tussenwerpsels zoals *hè* glippen erdoorheen; tussenwerpsels zijn in veel talen de vrijbuiters van de fonologie.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'gewicht',
        prompt: 'Licht of zwaar?',
        buckets: ['licht (μ)', 'zwaar (μμ)'],
        items: [
          { t: 'de', b: 0 },
          { t: 'je', b: 0 },
          { t: 'te', b: 0 },
          { t: 'zee', b: 1 },
          { t: 'kat', b: 1 },
          { t: 'ui', b: 1 },
        ],
        why: 'de, je en te: een schwa zonder coda. zee en ui: lange klank. kat: korte klinker plus coda.',
      },
      {
        kind: 'type',
        id: 'nippon',
        prompt: 'Hoeveel moras heeft ‘Nippon’?',
        before: 'Nippon heeft',
        after: 'moras.',
        hint: 'getal',
        answer: '4',
        why: 'ni-p-po-n: de eerste p en de slot-n tellen als eigen mora.',
      },
      {
        kind: 'swipe',
        id: 'moras',
        prompt: 'Klopt deze zin?',
        cards: [
          { t: 'De onset telt mee voor het gewicht van een lettergreep.', ok: false, fix: 'De onset telt (bijna) nooit mee', why: 'pa en spra wegen hetzelfde. Alleen de rijm telt.' },
          { t: 'Tōkyō heeft twee lettergrepen en vier moras.', ok: true, why: 'to-o-kyo-o.' },
          { t: 'Een Nederlands inhoudswoord kan eindigen op een korte klinker, zoals [bɑ].', ok: false, fix: 'Het eindigt op een lange klinker of een medeklinker', why: 'Een korte klinker weegt één mora; het minimale woord weegt er twee.' },
        ],
      },
      {
        kind: 'bet',
        id: 'bommen',
        prompt: 'Welke eis zit achter de dubbele m van ‘bommen’?',
        options: ['Een korte klinker weegt één mora en heeft een coda nodig', 'De o in bommen is lang', 'De m is twee klanken'],
        answer: 'Een korte klinker weegt één mora en heeft een coda nodig',
        why: 'Daarom moet de m ook bij de eerste lettergreep horen. De spelling tekent dat met mm.',
      },
    ],
  },
  {
    id: 'g13',
    stage: 'master',
    domain: 'fon',
    title: 'Lettergrepen van de wereld',
    skill: 'Spelling',
    icon: 'CV',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Typologie en verwerving',
        panels: [
          {
            text: 'Er is één lettergreep die in *elke* bekende taal voorkomt: *CV*, een medeklinker plus een klinker. Daarboven lopen talen uiteen. Het Hawaïaans kent geen codas en geen medeklinkergroepen. Daarom werd *Merry Christmas* daar *Mele Kalikimaka*.',
            lab: {
              label: 'Tik een taal',
              chips: [
                { k: 'Hawaïaans', out: 'Mele Kalikimaka', note: 'Geen codas, geen clusters, en geen r of s: elke klank wordt in CV geperst.' },
                { k: 'Japans', out: 'kurisumasu', note: 'Codas en clusters worden opgelost met extra klinkers: ku-ri-su-ma-su.' },
                { k: 'Spaans', out: 'escuela', note: 'Een woord mag niet met s + medeklinker beginnen: Latijn scola werd escuela.' },
              ],
            },
          },
          {
            text: 'Aan het andere uiterste staat het Georgisch: *gvprtskvni*, ‘je pelt ons’, begint met acht medeklinkers op rij. En het Tashlhiyt-Berbers in Marokko heeft hele woorden zonder klinker: *tftktstt*, ‘je hebt het verstuikt’. Daar wordt een *f* of *t* de kern van een lettergreep.',
            quiz: {
              q: 'Welk sjabloon komt in elke bekende taal voor?',
              options: ['CV', 'CVC', 'V', 'CCVCC'],
              answer: 'CV',
              why: 'Roman Jakobson zag het al: elke taal heeft CV. Talen verschillen in wat ze daarbovenop toelaten.',
            },
            deep: {
              q: 'Hoe weet je dat tftktstt lettergrepen heeft?',
              a: 'Dell en Elmedlaoui (1985) lieten zien dat de grenzen de sonoriteit volgen: de meest sonore klank in de buurt wordt de kern, ook als het een medeklinker is. Ridouane (2008) bevestigde met akoestisch en fysiologisch onderzoek dat er geen verborgen klinkers in zulke woorden zitten.',
            },
          },
          {
            text: 'Kinderen lopen die wereldkaart na. Nederlandse kinderen beginnen met CV, dan CVC, dan V en VC. Daarna splitst de route: de ene groep leert eerst complexe codas (CVCC), de andere eerst complexe onsets (CCV). CCVCC, zoals *sterk*, komt bij iedereen als laatste (Levelt, Schiller en Levelt 2000).',
            swap: {
              goal: 'Zet in de volgorde waarin Nederlandse kinderen ze leren',
              blocks: ['VC', 'CV', 'V', 'CVC'],
              accept: ['CV CVC V VC'],
              note: 'CV eerst, dan CVC, V en VC. Daarna nemen kinderen verschillende routes naar CCVCC.',
            },
            rule: 'Elke taal heeft CV. Complexere lettergrepen veronderstellen de eenvoudigere, in talen én bij kinderen.',
          },
        ],
      },
      {
        kind: 'choice',
        id: 'strike',
        prompt: 'Het honkbalwoord ‘strike’ is geleend door het Japans. Hoe klinkt het daar?',
        before: '',
        after: '',
        options: ['sutoraiku', 'sraik', 'tsraiku'],
        answer: 'sutoraiku',
        why: 'Elke medeklinker krijgt een eigen klinker: su-to-ra-i-ku. Geen clusters, geen coda.',
      },
      {
        kind: 'sort',
        id: 'hawaiaans',
        prompt: 'Zou het Hawaïaans dit woord toestaan?',
        buckets: ['ja', 'nee'],
        items: [
          { t: 'mama', b: 0 },
          { t: 'aloha', b: 0 },
          { t: 'kala', b: 0 },
          { t: 'pak', b: 1 },
          { t: 'strand', b: 1 },
          { t: 'herfst', b: 1 },
        ],
        why: 'Het Hawaïaans staat CV en V toe (a-lo-ha), maar geen coda (pak) en geen clusters (strand, herfst).',
      },
      {
        kind: 'bet',
        id: 'implicatie',
        prompt: 'Een taal heeft lettergrepen als CCVC. Wat heeft die taal dan zeker ook?',
        options: ['CV-lettergrepen', 'geen CV-lettergrepen', 'alleen V-lettergrepen'],
        answer: 'CV-lettergrepen',
        why: 'Complexere sjablonen veronderstellen de eenvoudigere. Een taal met CCVC heeft, voor zover bekend, altijd CV.',
      },
    ],
  },
  {
    id: 'g14',
    stage: 'master',
    domain: 'fon',
    title: 'ONSET tegen NOCODA',
    skill: 'Spelling',
    icon: '☞σ',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Lettergrepen in Optimaliteitstheorie',
        panels: [
          {
            text: 'Prince en Smolensky gebruikten in 1993 juist de lettergreep als eerste testcase voor Optimaliteitstheorie. Twee *markeringseisen* sturen alles: *ONSET* (een lettergreep heeft een begin) en *NOCODA* (een lettergreep heeft geen eind). Daartegenover staan *trouweisen*: *MAX* (laat niets weg) en *DEP* (voeg niets toe). Begin bij *zeeën*.',
            tableau: {
              input: '/zeː+ən/',
              constraints: [
                { name: 'DEP', note: 'Voeg geen klank toe.' },
                { name: 'MAX', note: 'Laat geen klank weg.' },
                { name: 'ONSET', note: 'Een lettergreep begint met een medeklinker.' },
              ],
              candidates: [
                { form: '[zeː.ən]', marks: [0, 0, 1] },
                { form: '[zeː.jən]', marks: [1, 0, 0] },
                { form: '[zeːn]', marks: [0, 1, 0] },
              ],
              winner: 1,
              goal: 'Laat [zeː.jən] winnen',
              note: 'ONSET en MAX staan boven DEP: liever een j erbij dan een lettergreep zonder begin, of een klank kwijt.',
            },
          },
          {
            text: 'Nu het Japans, met het Engelse *Christmas* als input. Het Japans verbiedt clusters en codas zo streng dat het liever drie klinkers toevoegt. Zoek de rangorde waarbij *kurisumasu* wint.',
            tableau: {
              input: '/krɪsməs/',
              constraints: [
                { name: 'DEP', note: 'Voeg geen klank toe.' },
                { name: 'MAX', note: 'Laat geen klank weg.' },
                { name: '∗COMPLEX', note: 'Geen medeklinkergroep in onset of coda.' },
                { name: 'NOCODA', note: 'Een lettergreep eindigt op een klinker.' },
              ],
              candidates: [
                { form: '[kris.mas]', marks: [0, 0, 1, 2] },
                { form: '[ku.ri.su.ma.su]', marks: [3, 0, 0, 0] },
                { form: '[ri.ma]', marks: [0, 3, 0, 0] },
              ],
              winner: 1,
              goal: 'Laat de Japanse vorm winnen',
              note: 'MAX en de markeringseisen staan boven DEP: liever klinkers erbij dan klanken kwijt of een cluster.',
            },
            deep: {
              q: 'Waarom is dit zo krachtig?',
              a: 'Met dezelfde eisen en een *andere rangorde* krijg je een andere taal. Dat heet *factoriële typologie*: elke rangorde is een mogelijke taal. Een taal die geen enkele rangorde voorspelt, zou niet mogen bestaan. Daardoor is de theorie toetsbaar.',
            },
          },
          {
            text: 'Speel taalontwerper. Zet ONSET en NOCODA hoog (boven de trouweisen) of laag. Vier rangordes, vier soorten talen. Precies het rijtje dat Jakobson al in de talen van de wereld zag.',
            lab: {
              label: 'Tik een rangorde',
              chips: [
                { k: 'allebei hoog', out: 'alleen CV', note: 'Elke lettergreep een begin en geen eind: het strengste sjabloon.' },
                { k: 'ONSET hoog', out: 'CV en CVC', note: 'Begin verplicht, eind mag. Zo werkt bijvoorbeeld het klassiek Arabisch.' },
                { k: 'NOCODA hoog', out: 'CV en V', note: 'Begin mag ontbreken, eind niet. Het Hawaïaans komt in de buurt.' },
                { k: 'allebei laag', out: 'CV, V, CVC en VC', note: 'Alles mag, zoals in het Nederlands: pa, ei, pak, ook.' },
              ],
            },
            rule: 'Geen enkele rangorde straft CV: het overtreedt ONSET noch NOCODA. Daarom heeft elke taal CV.',
          },
        ],
      },
      {
        kind: 'sort',
        id: 'overtreding',
        prompt: 'Welke eis overtreedt deze lettergreep?',
        buckets: ['ONSET', 'NOCODA', 'allebei', 'geen van beide'],
        items: [
          { t: 'ei', b: 0 },
          { t: 'pak', b: 1 },
          { t: 'ook', b: 2 },
          { t: 'uit', b: 2 },
          { t: 'pa', b: 3 },
          { t: 'zee', b: 3 },
        ],
        why: 'ei: geen begin. pak: wel een eind. ook en uit: allebei. pa en zee: de perfecte CV.',
      },
      {
        kind: 'choice',
        id: 'welke-eis',
        prompt: 'Een taal laat V en CV toe, maar nooit CVC. Welke eis staat hoog?',
        before: '',
        after: '',
        options: ['NOCODA', 'ONSET', 'DEP'],
        answer: 'NOCODA',
        why: 'Een begin mag ontbreken (V), een eind nooit. Dus NOCODA staat boven de trouweisen, ONSET eronder.',
      },
      {
        kind: 'bet',
        id: 'zonder-cv',
        prompt: 'Kan er een taal bestaan met alleen V en VC, en zonder CV?',
        intro: 'Denk na met de eisen, niet met je geheugen.',
        options: ['Nee, geen enkele rangorde levert dat op', 'Ja, als ONSET hoog staat', 'Ja, als NOCODA hoog staat'],
        answer: 'Nee, geen enkele rangorde levert dat op',
        why: 'CV overtreedt ONSET noch NOCODA. Er is dus geen eis die CV kan laten verliezen van V. Zo voorspelt OT de universele CV.',
      },
    ],
  },
  {
    id: 'g15',
    stage: 'master',
    domain: 'fon',
    also: ['morf'],
    title: 'Het prosodische woord',
    skill: 'Spelling',
    icon: 'ω',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'De toren boven de lettergreep',
        panels: [
          {
            text: 'De lettergreep is niet de top van de toren. Fonologen stapelen verder: lettergrepen vormen *voeten*, voeten vormen een *prosodisch woord* (ω), en daarboven komen de *fonologische frase* en de *intonatiefrase* (Nespor en Vogel 1986). Elke laag is het domein van eigen regels.',
            swap: {
              goal: 'Stapel van klein naar groot',
              blocks: ['voet', 'intonatiefrase', 'lettergreep', 'prosodisch woord', 'fonologische frase'],
              accept: ['lettergreep voet prosodisch woord fonologische frase intonatiefrase'],
              note: 'σ < voet < ω < fonologische frase < intonatiefrase: de prosodische hiërarchie.',
            },
          },
          {
            text: 'Nu het slimme stuk. Zeg *honden*: [hɔn.dən]. De d schuift naar de onset en blijft een d. Zeg nu *hondachtig*: [hɔnt.ɑx.təx]. De d wordt een t! Waarom springt hij niet door, zoals in *heb ik*? Omdat *-achtig* een eigen prosodisch woord vormt. Over de grens tussen twee ω’s springt geen medeklinker.',
            lab: {
              label: 'Tik een woord',
              chips: [
                { k: 'honden', out: '[hɔn.dən]', note: '-en hoort bij hetzelfde prosodische woord: de d schuift door en blijft stemhebbend.' },
                { k: 'hondachtig', out: '[hɔnt.ɑx.təx]', note: '-achtig is een eigen ω: de d blijft in de coda en wordt t.' },
                { k: 'rode', out: '[roː.də]', note: 'De d van rood schuift door.' },
                { k: 'roodachtig', out: '[roːt.ɑx.təx]', note: 'Hier niet: je hoort een t.' },
              ],
            },
            rule: 'Een samenhangend achtervoegsel (-en, -e, -ig) smelt samen met de stam. Een niet-samenhangend achtervoegsel (-achtig) en elk deel van een samenstelling vormt een eigen prosodisch woord.',
            quiz: {
              q: 'Hoe zeg je ‘eindexamen’ in zorgvuldige spraak?',
              options: ['[ɛint.ɛk.saː.mən]', '[ɛin.dɛk.saː.mən]'],
              answer: '[ɛint.ɛk.saː.mən]',
              why: 'eind en examen zijn twee prosodische woorden. De d blijft in de coda en wordt t.',
            },
          },
          {
            text: 'Hetzelfde zie je aan het begin van woorddelen. *Be-amen* krijgt een glottisslag: [bə.ʔaː.mən]. Ook *geërfd* klinkt als [ɣə.ʔɛrft]. De lettergreep zonder onset krijgt geen medeklinker van links, maar een eigen ʔ. Zo blijft de bouw van een woord hoorbaar, dankzij de prosodische grenzen.',
            deep: {
              q: 'Wie werkte dit uit?',
              a: 'Het onderscheid tussen samenhangende (*cohering*) en niet-samenhangende (*non-cohering*) affixen is voor het Nederlands vooral uitgewerkt door Geert Booij, onder meer in *The Phonology of Dutch* (1995). In heel snelle spraak kan de grens toch vervagen; de analyse gaat over de structuur, niet over elk spraakmoment.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'doorschuiven',
        prompt: 'Schuift de laatste medeklinker van de stam door naar de volgende lettergreep?',
        buckets: ['ja: hij blijft stemhebbend', 'nee: hij wordt stemloos'],
        items: [
          { t: 'honden', b: 0 },
          { t: 'rode', b: 0 },
          { t: 'handig', b: 0 },
          { t: 'hondachtig', b: 1 },
          { t: 'roodachtig', b: 1 },
          { t: 'eindexamen', b: 1 },
        ],
        why: '-en, -e en -ig smelten samen met de stam: [hɔn.dən], [roː.də], [hɑn.dəx]. -achtig en een samenstelling vormen een eigen ω: de d blijft eindklank en wordt t.',
      },
      {
        kind: 'choice',
        id: 'waarom-t',
        prompt: 'Waarom wordt de d in ‘hondachtig’ een t?',
        before: '',
        after: '',
        options: [
          '-achtig is een eigen prosodisch woord, dus de d blijft aan het eind van een lettergreep',
          '-achtig begint met een medeklinker',
          'De klemtoon valt op -achtig',
        ],
        answer: '-achtig is een eigen prosodisch woord, dus de d blijft aan het eind van een lettergreep',
        why: 'Eindklankverscherping geldt aan het eind van een lettergreep. De ω-grens houdt de d daar vast.',
      },
      {
        kind: 'bet',
        id: 'webachtig',
        prompt: 'Hoe klinkt ‘webachtig’?',
        options: ['[wɛp.ɑx.təx]', '[wɛ.bɑx.təx]'],
        answer: '[wɛp.ɑx.təx]',
        why: 'Net als hondachtig: -achtig is een eigen ω, dus de b blijft in de coda en wordt p.',
      },
    ],
  },
  {
    id: 'g16',
    stage: 'master',
    domain: 'fon',
    title: 'Ritme: het Nederlands telt klemtonen',
    skill: 'Spelling',
    icon: '♪',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Ritmeklassen',
        panels: [
          {
            text: 'Zeg *banaan* eens snel: [bəˈnaːn]. De a van de eerste lettergreep verdwijnt in een schwa. Het Nederlands knijpt onbeklemtoonde lettergrepen samen. Het Spaans en Italiaans doen dat veel minder: *banana* houdt drie volle a’s.',
            lab: {
              label: 'Tik een woord',
              chips: [
                { k: 'banaan', out: '[bəˈnaːn]', note: 'Onbeklemtoonde a wordt schwa.' },
                { k: 'politie', out: '[pəˈli(t)si]', note: 'Zeker in snelle spraak: de o wordt schwa.' },
                { k: 'banana (Spaans)', out: '[baˈnana]', note: 'Drie volle klinkers, ook zonder klemtoon.' },
              ],
            },
          },
          {
            text: 'Taalkundigen deelden talen ooit in drie ritmeklassen: *klemtoontellend* (Engels, Nederlands), *lettergreeptellend* (Spaans, Frans, Italiaans) en *moratellend* (Japans) (Pike 1945, Abercrombie 1967). Dat klemtonen op precies gelijke afstand vallen, bleek bij metingen niet te kloppen. Ramus, Nespor en Mehler (1999) vonden een betere maat: welk deel van de tijd klinkers innemen, *%V*. Talen met veel clusters en gereduceerde klinkers, zoals het Nederlands, scoren laag.',
            quiz: {
              q: 'Welke taal heeft waarschijnlijk de hoogste %V?',
              options: ['Japans', 'Nederlands', 'Engels'],
              answer: 'Japans',
              why: 'Bijna alleen CV-lettergrepen: veel klinker, weinig clusters.',
            },
          },
          {
            text: 'Het verrassende: baby’s horen dit al. Nazzi, Bertoncini en Mehler (1998) lieten Franse pasgeborenen talen horen. Engels en Japans hielden ze uit elkaar, Engels en Nederlands niet: die klinken in hetzelfde ritme. Je oor kende het ritme van je moedertaal dus al voordat je één woord begreep.',
            rule: 'Het Nederlands is klemtoontellend: sterke lettergrepen met daartussen gereduceerde, zwakke.',
            deep: {
              q: 'Is dat nog de stand van de wetenschap?',
              a: 'De klassen zijn eerder een glijdende schaal dan drie bakjes. Het Pools heeft bijvoorbeeld veel clusters maar weinig klinkerreductie. En nieuwer onderzoek vraagt zich af of pasgeborenen echt ritme horen, of andere eigenschappen van het geluid. Het debat loopt nog: precies het soort vraag waar een masterscriptie over gaat.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'reductie',
        prompt: 'Volle klinker of schwa, in gewone spraak?',
        buckets: ['volle klinker', 'schwa'],
        items: [
          { t: 'de naan in banaan', b: 0 },
          { t: 'de zond in gezond', b: 0 },
          { t: 'de ta in tafel', b: 0 },
          { t: 'de ba in banaan', b: 1 },
          { t: 'de ge in gezond', b: 1 },
          { t: 'de fel in tafel', b: 1 },
        ],
        why: 'De beklemtoonde lettergreep houdt zijn volle klinker. De andere worden schwa: bə-naan, gə-zond, ta-fəl.',
      },
      {
        kind: 'choice',
        id: 'nazzi',
        prompt: 'Welk paar hielden pasgeborenen in het onderzoek van Nazzi en collega’s níet uit elkaar?',
        before: '',
        after: '',
        options: ['Engels en Nederlands', 'Engels en Japans'],
        answer: 'Engels en Nederlands',
        why: 'Allebei klemtoontellend. Japans heeft een heel ander ritme.',
      },
      {
        kind: 'bet',
        id: 'klasse',
        prompt: 'Welke ritmeklasse past bij het Japans?',
        options: ['moratellend', 'klemtoontellend', 'lettergreeptellend'],
        answer: 'moratellend',
        why: 'Het Japans telt moras, zoals in de haiku: to-o-kyo-o.',
      },
    ],
  },
  {
    id: 'g17',
    stage: 'master',
    domain: 'fon',
    also: ['orth'],
    title: 'De lettergreep in je hoofd',
    skill: 'Spelling',
    icon: 'σ→',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Spreken, leren en spellen',
        panels: [
          {
            text: 'Hoe spreek je zo snel? Volgens Willem Levelt heb je een *mentaal syllabarium*: een voorraad kant-en-klare mondbewegingen voor de lettergrepen die je het vaakst gebruikt. Levelt en Wheeldon (1994) toonden het aan in het Nederlands: woorden die eindigen op een veelvoorkomende lettergreep, zeg je zo’n 15 milliseconden sneller, los van hoe vaak het woord zelf voorkomt.',
            quiz: {
              q: 'Welk woord zeg je volgens deze theorie iets sneller?',
              options: ['Een woord dat eindigt op een veelvoorkomende lettergreep', 'Een woord dat eindigt op een zeldzame lettergreep'],
              answer: 'Een woord dat eindigt op een veelvoorkomende lettergreep',
              why: 'Die lettergreep ligt kant-en-klaar in je syllabarium en hoeft niet opnieuw te worden samengesteld.',
            },
            deep: {
              q: 'Hoe groot is dat syllabarium?',
              a: 'Een paar honderd lettergrepen in het Chinees of Japans, enkele duizenden in het Nederlands of Engels. De veelgebruikte lettergrepen liggen klaar; een zeldzame lettergreep bouw je klank voor klank op. Daarom zeg je een nieuw woord als *kadral* net iets trager dan *kader*.',
            },
          },
          {
            text: 'Kinderen knippen ook op lettergrepen, en ze bewaren vooral het sterke stuk. *Banaan* wordt *naan*, *giraf* wordt *raf*, *tomaat* wordt *maat*. De beklemtoonde lettergreep blijft, het zwakke begin valt weg. Paula Fikkert (1994) liet zien dat Nederlandse peuters woorden eerst in één voet persen: sterk, eventueel gevolgd door zwak.',
            quiz: {
              q: 'Wat zegt een peuter waarschijnlijk voor ‘konijn’?',
              options: ['nijn', 'ko', 'konij'],
              answer: 'nijn',
              why: 'De beklemtoonde lettergreep blijft: ko-NIJN wordt nijn.',
            },
          },
          {
            text: 'En op school? Bij spelling heet de lettergreep vaak een *klankgroep*. Kinderen leren hakken en plakken: *bo-men* is een open klankgroep, dus één o; *bom-men* is gesloten, dus een korte o. Dat is de fonologie van dit hele niveau, verpakt als spellingstrategie. Zo kom je terug bij waar De lettergreep begon: open en dicht.',
            tree: {
              q: 'Een laatste boom: hang ‘sterk’ op',
              segs: [
                { t: 's', role: 'onset' },
                { t: 't', role: 'onset' },
                { t: 'e', role: 'kern' },
                { t: 'r', role: 'coda' },
                { t: 'k', role: 'coda' },
              ],
              note: 'CCVCC: het type dat Nederlandse kinderen als laatste leren. En met r + k kun je er nog een schwa in horen: [stɛrək].',
            },
            rule: 'Je brein plant in lettergrepen, kinderen leren in lettergrepen, en de spelling rekent met lettergrepen.',
          },
        ],
      },
      {
        kind: 'swipe',
        id: 'hoofd',
        prompt: 'Klopt deze zin?',
        cards: [
          { t: 'Levelt en Wheeldon vonden effecten van lettergreepfrequentie in het Nederlands.', ok: true, why: 'Woorden met een veelvoorkomende laatste lettergreep werden sneller uitgesproken.' },
          { t: 'Peuters laten meestal de beklemtoonde lettergreep weg.', ok: false, fix: 'Ze laten de onbeklemtoonde lettergreep weg', why: 'banaan wordt naan: het sterke stuk blijft.' },
          { t: 'Het mentale syllabarium bevat een aparte beweging voor elk woord.', ok: false, fix: 'Het bevat bewegingen per lettergreep', why: 'Daarom heet het een syllabarium: een voorraad lettergrepen.' },
          { t: 'Een klankgroep op school is in de fonologie een lettergreep.', ok: true, why: 'Andere naam, zelfde eenheid.' },
        ],
      },
      {
        kind: 'bet',
        id: 'tomaat',
        prompt: 'Wat zegt een peuter waarschijnlijk voor ‘tomaat’?',
        options: ['maat', 'to', 'toma'],
        answer: 'maat',
        why: 'to-MAAT: de beklemtoonde lettergreep blijft.',
      },
      {
        kind: 'highlight',
        id: 'herfst',
        prompt: 'Eindbaas: kleur de klanken van ‘herfst’',
        intro: 'Alles uit dit niveau in één woord: onset, kern, coda en appendix.',
        pens: [
          { id: 'onset', label: 'onset', tag: 'begin', ask: 'Komt deze klank vóór de kern?', accent: 'blue' },
          { id: 'kern', label: 'kern', tag: 'klinker', ask: 'Is dit het hart van de lettergreep?', accent: 'purple' },
          { id: 'coda', label: 'coda', tag: 'in de rijm', ask: 'Past deze klank nog binnen de drie plekken van de rijm?', accent: 'orange' },
          { id: 'appendix', label: 'appendix', tag: 'aan de rand', ask: 'Valt deze tongpuntklank buiten de rijm?', accent: 'teal' },
        ],
        words: [
          { t: 'h', role: 'onset' },
          { t: 'e', role: 'kern' },
          { t: 'r', role: 'coda' },
          { t: 'f', role: 'coda' },
          { t: 's', role: 'appendix' },
          { t: 't', role: 'appendix' },
        ],
        done: { title: 'Niveau uitgespeeld', text: 'h | e r f | s t: een volle rijm van drie plekken en een appendix. Je kunt nu een lettergreep tekenen, wegen en verklaren.' },
      },
    ],
  },
];
