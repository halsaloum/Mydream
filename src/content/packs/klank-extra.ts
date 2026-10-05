import type { LessonInput } from '../schema';

/**
 * Extra lessen voor "Klank en letter" die onderwerpen toevoegen die nog ontbraken: variatie in de
 * uitspraak (bachelor), akoestische fonetiek en intonatie (master). De bachelorles komt na
 * `klank.ts`, de masterlessen na `klank-master.ts`.
 */
export const KLANK_VARIATIE_LESSONS: LessonInput[] = [
  {
    id: 'k26',
    stage: 'bachelor',
    domain: 'fon',
    also: ['prag'],
    title: 'Eén taal, veel uitspraken',
    skill: 'Spelling',
    icon: 'r/ʀ',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'De r, de g en de w',
        panels: [
          {
            text: 'Vraag tien Nederlanders het woord *raar* te zeggen en je hoort vaak drie of vier soorten r. Een *tong-r* [r], waarbij de tongpunt trilt of één keer tikt. Een *huig-r* [ʀ] of [ʁ], achter in de keel. En aan het eind van een lettergreep, vooral in het westen van Nederland, een r die bijna een klinker is: de *Gooise r* [ɹ], zoals in het Engelse *red*.',
            rule: 'Eén foneem /r/, veel uitspraken: tong-r, huig-r en Gooise r.',
            lab: {
              label: 'Tik een r',
              chips: [
                { k: 'tong-r', out: '[r] of [ɾ]', note: 'De tongpunt trilt of tikt tegen de tandkas. Veel in Vlaanderen en het noorden en oosten.' },
                { k: 'huig-r', out: '[ʀ] of [ʁ]', note: 'De huig trilt of ruist. Veel in steden als Den Haag, Rotterdam, Gent en Brussel.' },
                { k: 'Gooise r', out: '[ɹ]', note: 'Na de klinker, als in Engels red. Breidt zich sinds de twintigste eeuw snel uit in Nederland.' },
              ],
            },
            deep: {
              q: 'Wie heeft dat gemeten?',
              a: 'Koen Sebregts onderzocht voor zijn proefschrift (2015) de uitspraak van de r bij honderden sprekers in tien steden in Nederland en Vlaanderen. Hij vond meer dan twintig varianten. De Gooise r staat bijna alleen in Nederland en bijna alleen na de klinker: in *raar* begint de spreker met een andere r dan waarmee hij eindigt.',
            },
          },
          {
            text: 'De *g* is de bekendste grens in het Nederlandse taalgebied. Boven de rivieren hoor je een *harde g*: een stemloze, krassende klank achter in de mond, [χ] of [x]. In Brabant, Limburg en Vlaanderen een *zachte g*: verder naar voren en stemhebbend, [ɣ] of zelfs [ʝ]. Spreek je *goede morgen* uit, en iedereen weet ongeveer waar je vandaan komt.',
            quiz: {
              q: 'Waar hoor je meestal een zachte g?',
              options: ['in Brabant, Limburg en Vlaanderen', 'in Holland en Groningen', 'overal even vaak'],
              answer: 'in Brabant, Limburg en Vlaanderen',
              why: 'De zachte g hoort bij het zuiden; ten noorden van de grote rivieren is de g hard.',
            },
          },
          {
            text: 'In het noorden is nog iets gebeurd. *Lachen* en *laggen* klinken daar hetzelfde: het verschil tussen *ch* en *g* is weg. Net zo zeggen veel Nederlanders *fier* voor *vier* en *sout* voor *zout*: de stemhebbende wrijfklanken *v*, *z* en *g* worden stemloos. In Vlaanderen blijft het verschil meestal bestaan.',
            rule: 'Noorden: *v*, *z* en *g* worden vaak stemloos. Zuiden: het verschil blijft.',
            lab: {
              label: 'Tik een woord',
              chips: [
                { k: 'vier', out: 'NL vaak [f]ier · VL [v]ier', note: 'De v wordt in Nederland vaak een f.' },
                { k: 'zout', out: 'NL vaak [s]out · VL [z]out', note: 'De z wordt in Nederland vaak een s.' },
                { k: 'goed', out: 'NL [χ]oed · VL [ɣ]oed', note: 'Harde, stemloze g tegenover zachte, stemhebbende g.' },
              ],
            },
            deep: {
              q: 'Hoe snel gaat dat?',
              a: 'Onderzoekers als Hans Van de Velde vergeleken radio-opnamen van de jaren dertig tot de jaren negentig. In Nederland nam het stemloos maken van *v*, *z* en *g* in die tijd duidelijk toe; in Vlaanderen veel minder. Een klankverandering die je over enkele generaties kunt zien gebeuren.',
            },
          },
          {
            text: 'Ook de *w* verschilt. De meeste Nederlanders maken hem met de onderlip tegen de boventanden, zonder veel wrijving: [ʋ]. Veel Vlamingen en Surinamers ronden de lippen, zoals in het Engelse *water*: [w] of [β]. Voor het Nederlands zijn het allofonen van één foneem: *wit* blijft *wit*.',
            quiz: {
              q: 'Hoe maken de meeste Nederlanders de w?',
              options: ['met onderlip en boventanden', 'met twee geronde lippen', 'met de tongpunt'],
              answer: 'met onderlip en boventanden',
              why: 'Een labiodentale w: [ʋ]. In Vlaanderen en Suriname hoor je vaker een bilabiale w.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'noord-zuid',
        prompt: 'Hoor je dit eerder in het noorden van Nederland of in Vlaanderen?',
        buckets: ['noorden van Nederland', 'Vlaanderen'],
        items: [
          { t: 'harde, stemloze g', b: 0 },
          { t: 'zachte g', b: 1 },
          { t: 'fier voor vier', b: 0 },
          { t: 'verschil tussen lachen en laggen', b: 1 },
          { t: 'Gooise r na een klinker', b: 0 },
          { t: 'w met twee geronde lippen', b: 1 },
          { t: 'sout voor zout', b: 0 },
          { t: 'w met onderlip en boventanden', b: 0 },
        ],
        why: 'In het noorden: harde g, stemloze v, z en g, Gooise r en een labiodentale w. In Vlaanderen: zachte g, het verschil tussen stemhebbend en stemloos blijft, vaker een bilabiale w.',
      },
      {
        kind: 'choice',
        id: 'foneem-allofoon',
        prompt: 'Iemand zegt raar met een huig-r, iemand anders met een tong-r. Wat betekent dat voor de taalkundige?',
        before: '',
        after: '',
        options: [
          'Het zijn allofonen van één foneem /r/',
          'Het zijn twee verschillende fonemen',
          'Een van beiden spreekt het fout uit',
        ],
        answer: 'Het zijn allofonen van één foneem /r/',
        why: 'Het woord verandert niet van betekenis. Verschillende uitspraken van één foneem heten allofonen.',
      },
      {
        kind: 'bet',
        id: 'r-varianten',
        prompt: 'Hoeveel varianten van de r vond Sebregts ongeveer in zijn onderzoek naar tien steden?',
        options: ['meer dan twintig', 'drie', 'precies twee'],
        answer: 'meer dan twintig',
        why: 'De r is waarschijnlijk de meest gevarieerde klank van het Nederlands.',
      },
      {
        kind: 'explain',
        id: 'verdieping',
        title: 'Waarom uitspraak verandert',
        panels: [
          {
            text: 'Waarom verandert uitspraak eigenlijk? Een deel is *mechanisch*: een stemhebbende wrijfklank kost moeite, want je moet tegelijk lucht door een smalle opening persen en je stembanden laten trillen. Stemloos is makkelijker. Een ander deel is *sociaal*: mensen nemen de uitspraak over van groepen die ze aantrekkelijk of modern vinden.',
            rule: 'Klankverandering heeft twee motoren: gemak in de mond en prestige in de groep.',
            quiz: {
              q: 'Waarom is een stemhebbende wrijfklank als v moeilijker dan f?',
              options: [
                'Je moet tegelijk lucht door een smalle opening persen en je stembanden laten trillen',
                'Je moet je lippen ronden',
                'Je moet je tong tegen je gehemelte drukken',
              ],
              answer: 'Je moet tegelijk lucht door een smalle opening persen en je stembanden laten trillen',
              why: 'Trillende stembanden remmen de luchtstroom, terwijl de wrijving juist veel lucht vraagt. Stemloos is makkelijker.',
            },
          },
          {
            text: 'De Gooise r is een mooi voorbeeld van een sociale verandering. Hij hoorde eerst bij de jongere, hoger opgeleide middenklasse in de Randstad, en dook vervolgens op bij radio- en tv-presentatoren. Nu hoor je hem in grote delen van Nederland. In Vlaanderen klinkt hij daardoor juist ‘Hollands’, en daar neemt men hem nauwelijks over.',
            quiz: {
              q: 'Waarom nemen Vlamingen de Gooise r nauwelijks over?',
              options: ['Hij klinkt voor hen Hollands', 'Hij is moeilijker uit te spreken', 'Hij bestaat niet in het Nederlands'],
              answer: 'Hij klinkt voor hen Hollands',
              why: 'Uitspraak is ook identiteit. Een variant met prestige in Nederland kan in Vlaanderen juist ‘van de buren’ klinken.',
            },
          },
          {
            text: 'Is er dan één goede uitspraak? De taalkunde zegt: er zijn *normen*, geen natuurwetten. Er is een Nederlandse en een Belgische standaarduitspraak, en binnen elk daarvan ruimte voor variatie. Een zachte g is geen fout, en een Gooise r ook niet. Wel zijn sommige varianten in een bepaalde situatie gewoner of beter geaccepteerd dan andere.',
            rule: 'Variatie is geen fout: het Nederlands heeft een pluricentrische standaard, met een Nederlandse en een Belgische norm.',
            quiz: {
              q: 'Een Vlaamse nieuwslezer spreekt de g zacht uit. Wat zegt de taalkunde?',
              options: ['Dat is een variant binnen de Belgische standaard', 'Dat is een uitspraakfout', 'Dat is dialect, geen standaardtaal'],
              answer: 'Dat is een variant binnen de Belgische standaard',
              why: 'Het Nederlands is pluricentrisch: de zachte g hoort bij de Belgische norm.',
            },
            deep: {
              q: 'Wat betekent pluricentrisch?',
              a: 'Een taal met meer dan één centrum dat de norm zet, zoals het Engels (Brits, Amerikaans) of het Duits (Duitsland, Oostenrijk, Zwitserland). Voor het Nederlands zijn dat Nederland en Vlaanderen, en ook Suriname heeft eigen kenmerken. Woordenboeken markeren daarom woorden als *Belgisch-Nederlands* of *Surinaams-Nederlands*.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'motor',
        prompt: 'Welke motor zit vooral achter de verandering?',
        buckets: ['gemak in de mond', 'prestige in de groep'],
        items: [
          { t: 'v wordt f: stemhebbend wrijven kost moeite', b: 0 },
          { t: 'presentatoren nemen de Gooise r over', b: 1 },
          { t: 'z wordt s aan het begin van een woord', b: 0 },
          { t: 'jongeren in de Randstad volgen een nieuwe uitspraak', b: 1 },
          { t: 'g en ch vallen samen tot één stemloze klank', b: 0 },
        ],
        why: 'Stemloos maken van wrijfklanken is gemakkelijker voor de mond. De verspreiding van de Gooise r gaat via groepen met prestige.',
      },
      {
        kind: 'swipe',
        id: 'variatie-waar',
        prompt: 'Klopt het?',
        intro: 'Veeg naar rechts als de zin klopt, naar links als hij niet klopt.',
        cards: [
          { t: 'Een zachte g is een uitspraakfout.', ok: false, fix: 'het is een regionale variant van de standaardtaal', why: 'Het Nederlands heeft meer dan één norm.' },
          { t: 'De Gooise r komt vooral voor na een klinker.', ok: true, why: 'In raar begint de spreker vaak met een andere r dan waarmee hij eindigt.' },
          { t: 'In Vlaanderen blijft het verschil tussen v en f meestal bestaan.', ok: true, why: 'Het stemloos maken is vooral een Nederlands verschijnsel.' },
          { t: 'Een huig-r en een tong-r zijn twee verschillende fonemen.', ok: false, fix: 'allofonen van één foneem', why: 'Het woord verandert niet van betekenis.' },
          { t: 'In het noorden klinken lachen en laggen vaak hetzelfde.', ok: true, why: 'g en ch zijn daar samengevallen.' },
          { t: 'Klankverandering heeft altijd een sociale oorzaak.', ok: false, fix: 'ook gemak in de mond speelt mee', why: 'Twee motoren: mechanisch en sociaal.' },
        ],
      },
    ],
  },
];

export const KLANK_EXTRA_MASTER_LESSONS: LessonInput[] = [
  {
    id: 'k27',
    stage: 'master',
    domain: 'fon',
    title: 'Klank zichtbaar maken',
    skill: 'Spelling',
    icon: 'Hz',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Bron en filter',
        panels: [
          {
            text: 'Klank is luchtdruk die heel snel op en neer gaat. Trillen je stembanden honderd keer per seconde, dan hoor je een toon van 100 hertz (Hz). Bij volwassen mannen ligt die *grondtoon* (F0) gemiddeld rond de 100 à 120 Hz, bij volwassen vrouwen rond de 200 Hz. Maar de grondtoon zegt niets over welke klinker je zegt. Daarvoor heb je je mond nodig.',
            quiz: {
              q: 'Wat bepaalt de grondtoon (F0)?',
              options: ['hoe snel je stembanden trillen', 'de stand van je tong', 'hoe hard je praat'],
              answer: 'hoe snel je stembanden trillen',
              why: 'F0 is de trillingssnelheid van de stembanden, in trillingen per seconde (Hz).',
            },
          },
          {
            text: 'De *bron-filtertheorie* (Gunnar Fant, 1960) verklaart hoe dat werkt. De stembanden zijn de *bron*: ze maken een zoemtoon vol boventonen. De holte van keel en mond is het *filter*: afhankelijk van de vorm versterkt die sommige frequenties en dempt andere. De versterkte gebieden heten *formanten*: F1, F2, F3. Verplaats je tong, dan verschuiven de formanten, en hoor je een andere klinker.',
            rule: 'Bron (stembanden) + filter (mondholte) = klinker. De formanten zijn de vingerafdruk van het filter.',
            quiz: {
              q: 'Wat verandert er als je van ie naar oe gaat, op dezelfde toonhoogte?',
              options: ['het filter: de vorm van je mondholte', 'de bron: de snelheid van je stembanden', 'allebei evenveel'],
              answer: 'het filter: de vorm van je mondholte',
              why: 'De grondtoon kan gelijk blijven. Je tong en lippen veranderen het filter, en dus de formanten.',
            },
            deep: {
              q: 'Kun je dat zelf horen?',
              a: 'Fluister maar eens *ie*, *aa*, *oe*. Je stembanden trillen niet, dus er is geen grondtoon. Toch herken je de klinkers: het filter werkt nog, met ruis als bron. De klinker zit dus in de formanten, niet in de toonhoogte.',
            },
          },
          {
            text: 'De eerste twee formanten vertellen het meeste. *F1* hangt samen met de hoogte van de tong: hoe opener je mond, hoe hoger F1. *F2* hangt samen met voor en achter: hoe verder naar voren de tong, hoe hoger F2. Zet je F1 en F2 tegen elkaar uit, dan krijg je bijna precies de klinkerkaart.',
            rule: 'Open klinker: hoge F1. Voorklinker: hoge F2.',
            vowels: {
              q: 'Tik de klinkers met de hoogste F1 (de meest open klinkers)',
              targets: ['aː', 'ɑ'],
              note: 'aa en a zijn het meest open: F1 rond 700 à 800 Hz. ie, uu en oe hebben de laagste F1, rond 300 Hz.',
            },
          },
          {
            text: 'Een paar ongeveer-waarden voor een mannenstem: *ie* heeft F1 rond 300 en F2 rond 2200 Hz: hoog en voor. *oe* heeft F1 rond 300 en F2 rond 800: hoog en achter. *aa* heeft F1 rond 750 en F2 rond 1300: open en centraal. Bij vrouwen en kinderen liggen alle formanten hoger, omdat hun mondholte korter is.',
            lab: {
              label: 'Tik een klinker',
              chips: [
                { k: 'ie', out: 'F1 ≈ 300 · F2 ≈ 2200', note: 'Lage F1: gesloten. Hoge F2: voor.' },
                { k: 'oe', out: 'F1 ≈ 300 · F2 ≈ 800', note: 'Lage F1: gesloten. Lage F2: achter.' },
                { k: 'aa', out: 'F1 ≈ 750 · F2 ≈ 1300', note: 'Hoge F1: open.' },
              ],
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'formanten',
        prompt: 'Welke formant is hier vooral hoog?',
        buckets: ['hoge F1 (open)', 'hoge F2 (voor)', 'allebei laag (gesloten en achter)'],
        items: [
          { t: 'aa in baan', b: 0 },
          { t: 'ie in piet', b: 1 },
          { t: 'oe in boek', b: 2 },
          { t: 'a in bal', b: 0 },
          { t: 'ee in beet', b: 1 },
          { t: 'oo in boot', b: 2 },
        ],
        why: 'Open klinkers (aa, a) hebben een hoge F1. Voorklinkers (ie, ee) een hoge F2. Gesloten achterklinkers (oe, oo) hebben beide formanten laag.',
      },
      {
        kind: 'choice',
        id: 'fluisteren',
        prompt: 'Je fluistert ‘aa’. Wat ontbreekt er in vergelijking met gewoon praten?',
        before: '',
        after: '',
        options: ['de grondtoon (F0)', 'de formanten', 'het filter'],
        answer: 'de grondtoon (F0)',
        why: 'Bij fluisteren trillen de stembanden niet. Het filter en dus de formanten blijven, daarom herken je de klinker.',
      },
      {
        kind: 'choice',
        id: 'kind-formanten',
        prompt: 'Waarom liggen de formanten van een kind hoger dan die van een volwassen man?',
        before: '',
        after: '',
        options: ['De mondholte is korter', 'Kinderen praten harder', 'Kinderen gebruiken andere klinkers'],
        answer: 'De mondholte is korter',
        why: 'Een korter buisje resoneert op hogere frequenties, net als een kortere fluit.',
      },
      {
        kind: 'explain',
        id: 'verdieping',
        title: 'Het spectrogram lezen',
        panels: [
          {
            text: 'Een *spectrogram* maakt klank zichtbaar. Van links naar rechts loopt de tijd, van onder naar boven de frequentie, en hoe donkerder, hoe meer energie. Klinkers zie je als donkere horizontale banden: de formanten. Een *s* is een vlek ruis hoog in het spectrum, boven de 4000 Hz. Een plofklank is een stil stukje gevolgd door een korte verticale streep: de *plof* bij het loslaten.',
            lab: {
              label: 'Tik een klank',
              chips: [
                { k: 'klinker', out: 'donkere horizontale banden', note: 'De formanten, die met de tong meebewegen.' },
                { k: 's', out: 'ruis hoog in het spectrum', note: 'Veel energie boven 4000 Hz, geen banden.' },
                { k: 'p, t, k', out: 'stilte en dan een streep', note: 'Eerst alles dicht, dan de plof bij het loslaten.' },
                { k: 'm, n', out: 'zwakke banden, laag en vaag', note: 'De neus dempt veel energie.' },
              ],
            },
            deep: {
              q: 'Waarmee maak je zo’n spectrogram?',
              a: 'Fonetici over de hele wereld gebruiken *Praat*, een gratis programma van Paul Boersma en David Weenink van de Universiteit van Amsterdam. Je neemt jezelf op, en ziet direct de formanten, de toonhoogte en de intensiteit. Een stukje Nederlandse wetenschap dat in bijna elk fonetieklab draait.',
            },
          },
          {
            text: 'Hoe hoor je het verschil tussen *b* en *p*? Belangrijk is de *voice onset time* (VOT, Lisker en Abramson, 1964): het moment waarop de stembanden gaan trillen, gemeten vanaf de plof. Bij een Nederlandse *b* trillen ze al vóór de plof: een negatieve VOT. Bij een Nederlandse *p* beginnen ze vrijwel meteen ná de plof.',
            rule: 'VOT: wanneer begint de stem? Nederlands *b*: vóór de plof. Nederlands *p*: vlak erna.',
            quiz: {
              q: 'Wat betekent een negatieve VOT?',
              options: ['De stembanden trillen al vóór de plof', 'Er is geen plof', 'De stem begint lang na de plof'],
              answer: 'De stembanden trillen al vóór de plof',
              why: 'VOT meet je vanaf de plof: negatief betekent dat de stem al eerder begon, zoals bij een Nederlandse b.',
            },
          },
          {
            text: 'Het Engels verdeelt dezelfde as anders. Een Engelse *p* aan het begin van een woord heeft een lange vertraging met een zuchtje lucht: *aspiratie*, [pʰ]. Een Engelse *b* begint vaak pas vlak na de plof, net als een Nederlandse *p*. Daarom hoort een Nederlander in Engels *bin* soms iets als *pin*, en klinkt een Nederlandse *p* voor een Engelsman als een *b*.',
            quiz: {
              q: 'Een Engelsman zegt ‘big’ met een b die pas vlak na de plof stemhebbend wordt. Wat hoort een Nederlander mogelijk?',
              options: ['iets dat op een p lijkt', 'een heel duidelijke b', 'een k'],
              answer: 'iets dat op een p lijkt',
              why: 'Die VOT valt voor Nederlanders in het gebied van de p. Talen leggen de grens op dezelfde as op een andere plek.',
            },
            deep: {
              q: 'Wat leert dat over fonologie?',
              a: 'Dat categorieën taalafhankelijk zijn. De akoestische as is voor iedereen dezelfde, maar elke taal hakt hem anders in stukken. Thai heeft er zelfs drie: stemhebbend, stemloos en geaspireerd. In de les over categoriale perceptie zie je hoe het brein zulke grenzen scherp hoort.',
            },
          },
        ],
      },
      {
        kind: 'sort',
        id: 'spectrogram',
        prompt: 'Wat zie je in het spectrogram?',
        buckets: ['donkere formantbanden', 'ruis hoog in het spectrum', 'stilte en een plof'],
        items: [
          { t: 'de aa in maan', b: 0 },
          { t: 'de s in zes', b: 1 },
          { t: 'de t in tak', b: 2 },
          { t: 'de ie in piet', b: 0 },
          { t: 'de k in kat', b: 2 },
          { t: 'de sch in schip, het eerste stuk', b: 1 },
        ],
        why: 'Klinkers geven formantbanden. Een s is hoge ruis. Plofklanken zijn een stilte met een plof. De s aan het begin van schip is ook ruis.',
      },
      {
        kind: 'order',
        id: 'vot',
        prompt: 'Zet de klanken op volgorde van VOT: van stem ruim vóór de plof naar stem lang na de plof.',
        tiles: ['Engelse p in pin', 'Nederlandse b in bak', 'Nederlandse p in pak'],
        answer: 'Nederlandse b in bak Nederlandse p in pak Engelse p in pin',
        why: 'Nederlandse b: negatieve VOT (stem vóór de plof). Nederlandse p: stem vlak erna. Engelse p: lange vertraging met aspiratie.',
      },
      {
        kind: 'type',
        id: 'praat',
        prompt: 'Typ de naam van het programma.',
        before: 'Het gratis programma van de Universiteit van Amsterdam waarmee fonetici spectrogrammen maken, heet',
        after: '.',
        hint: 'vijf letters',
        answer: 'Praat',
        why: 'Praat, van Paul Boersma en David Weenink.',
      },
      {
        kind: 'swipe',
        id: 'akoestiek-waar',
        prompt: 'Klopt het?',
        intro: 'Veeg naar rechts als de zin klopt, naar links als hij niet klopt.',
        cards: [
          { t: 'Een open klinker heeft een hoge F1.', ok: true, why: 'Hoe opener de mond, hoe hoger F1.' },
          { t: 'De klinker zit vooral in de grondtoon.', ok: false, fix: 'in de formanten', why: 'Bij fluisteren is er geen grondtoon, toch herken je de klinker.' },
          { t: 'In een spectrogram loopt de tijd van links naar rechts.', ok: true, why: 'En de frequentie van onder naar boven.' },
          { t: 'Een Nederlandse p is geaspireerd, net als een Engelse.', ok: false, fix: 'de Nederlandse p is niet geaspireerd', why: 'Bij een Nederlandse p begint de stem vlak na de plof.' },
          { t: 'Een Nederlandse b heeft een negatieve VOT.', ok: true, why: 'De stembanden trillen al vóór de plof.' },
          { t: 'Een voorklinker als ie heeft een lage F2.', ok: false, fix: 'een hoge F2', why: 'Hoe verder naar voren, hoe hoger F2.' },
        ],
      },
    ],
  },
  {
    id: 'k28',
    stage: 'master',
    domain: 'fon',
    also: ['prag'],
    title: 'De melodie van een zin',
    skill: 'Zinsbouw',
    icon: '↗↘',
    steps: [
      {
        kind: 'explain',
        id: 'uitleg',
        title: 'Waar valt het accent?',
        panels: [
          {
            text: 'Woorden hebben klemtoon, zinnen hebben *accent*. Zeg: *Ik heb een fiets gekocht.* Op welk woord gaat je stem omhoog of omlaag? Waarschijnlijk op *fiets*. Dat zinsaccent is geen versiering: het laat zien wat nieuw of belangrijk is. Taalkundigen noemen dat de *focus* van de zin.',
            rule: 'Het zinsaccent markeert de focus: wat nieuw of belangrijk is.',
            mark: {
              q: 'Tik het woord waar je stem het accent legt',
              sentence: 'Ik heb een fiets gekocht.',
              targets: [3],
              note: 'fiets: het nieuwe en belangrijke stuk van de zin.',
            },
          },
          {
            text: 'Verander de vraag, en het accent verhuist mee. *Wat heb je gekocht?* Een *FIETS*. *Wie heeft een fiets gekocht?* *IK*. *Heb je een fiets gehuurd?* Nee, *geKOCHT*. Het antwoord krijgt het accent op precies het stukje dat de vraag openliet.',
            lab: {
              label: 'Tik een vraag',
              chips: [
                { k: 'Wat heb je gekocht?', out: 'Ik heb een FIETS gekocht.', note: 'De vraag zoekt het ding: accent op fiets.' },
                { k: 'Wie heeft een fiets gekocht?', out: 'IK heb een fiets gekocht.', note: 'De vraag zoekt de persoon: accent op ik.' },
                { k: 'Heb je hem gehuurd?', out: 'Nee, ik heb hem geKOCHT.', note: 'Het contrast zit in het werkwoord.' },
              ],
            },
          },
          {
            text: 'Zonder speciale context, bij een zin die helemaal nieuw is, valt het accent in het Nederlands meestal op het laatste zelfstandige stuk vóór het werkwoord aan het eind: *Ik heb een BOEK gelezen*, niet *Ik heb een boek geLEZEN*. Het werkwoord achteraan krijgt het accent pas als er niets anders vóór staat: *Ik heb geSLApen*.',
            rule: 'Brede focus: accent op het object of de bepaling vóór het slotwerkwoord, niet op het werkwoord.',
            mark: {
              q: 'Tik het woord met het zinsaccent als de hele zin nieuw is',
              sentence: 'Gisteren heeft mijn zus een auto gekocht.',
              targets: [5],
              note: 'auto: het laatste stuk vóór het werkwoord gekocht.',
            },
            deep: {
              q: 'Heeft die regel een naam?',
              a: 'Carlos Gussenhoven formuleerde voor het Nederlands en het Engels de *Sentence Accent Assignment Rule*: binnen een focus krijgt een argument (zoals een lijdend voorwerp) het accent, en het werkwoord ernaast niet. Dat verklaart waarom *een BOEK gelezen* neutraal klinkt en *een boek geLEZEN* contrast suggereert.',
            },
          },
          {
            text: 'Wat al bekend is, verliest zijn accent. *Ik zag een hond. Die hond BLAFTE.* De tweede *hond* is oude informatie en krijgt geen accent meer; het nieuwe, *blafte*, wel. Dat heet *deaccentuering*. Een accent op bekende informatie klinkt alsof je iets wilt tegenspreken.',
            quiz: {
              q: 'Vraag: ‘Wat deed die hond?’ Welk antwoord heeft het accent op de goede plek?',
              options: ['Die hond BLAFTE.', 'Die HOND blafte.', 'DIE hond blafte.'],
              answer: 'Die hond BLAFTE.',
              why: 'hond is al bekend uit de vraag. Het nieuwe is wat hij deed.',
            },
          },
        ],
      },
      {
        kind: 'choice',
        id: 'focus-1',
        prompt: 'Vraag: ‘Wie heeft de taart opgegeten?’ Welk antwoord klinkt natuurlijk?',
        before: '',
        after: '',
        options: ['PIET heeft de taart opgegeten.', 'Piet heeft de TAART opgegeten.', 'Piet heeft de taart OPgegeten.'],
        answer: 'PIET heeft de taart opgegeten.',
        why: 'De vraag zoekt een persoon. De taart is al bekend en krijgt geen accent.',
      },
      {
        kind: 'choice',
        id: 'focus-2',
        prompt: 'Vraag: ‘Wat is er gebeurd?’ Welk antwoord klinkt neutraal?',
        before: '',
        after: '',
        options: ['De buurman heeft zijn AUTO verkocht.', 'De buurman heeft zijn auto verKOCHT.', 'De BUURman heeft zijn auto verkocht.'],
        answer: 'De buurman heeft zijn AUTO verkocht.',
        why: 'Alles is nieuw: brede focus. Het accent valt op het object vóór het slotwerkwoord.',
      },
      {
        kind: 'sort',
        id: 'accent-functie',
        prompt: 'Neutraal of contrast?',
        buckets: ['neutraal (brede focus)', 'contrast of correctie'],
        items: [
          { t: 'Ik heb een BOEK gelezen.', b: 0 },
          { t: 'Ik heb een boek geLEZEN (niet gekocht).', b: 1 },
          { t: 'We gaan naar PArijs.', b: 0 },
          { t: 'WIJ gaan naar Parijs (niet jullie).', b: 1 },
          { t: 'Ze heeft de AFwas gedaan.', b: 0 },
          { t: 'Ze HEEFT de afwas gedaan (echt waar).', b: 1 },
        ],
        why: 'Het neutrale accent valt op het laatste argument vóór het slotwerkwoord. Een accent elders zet iets tegenover een alternatief, of bevestigt nadrukkelijk.',
      },
      {
        kind: 'explain',
        id: 'verdieping',
        title: 'Op en neer: de vorm van de melodie',
        panels: [
          {
            text: 'Hoe klinkt een accent precies? Onderzoekers van het Instituut voor Perceptie Onderzoek (IPO) in Eindhoven, met Johan ’t Hart, René Collier en Antonie Cohen, beschreven de Nederlandse intonatie als een klein aantal toonbewegingen die luisteraars als gelijk horen. Hun bekendste vondst is het *hoedpatroon*: een stijging op het eerste accent, een hoog plateau, en een daling op het laatste accent.',
            rule: 'Hoedpatroon: omhoog bij het eerste accent, hoog blijven, omlaag bij het laatste.',
            mark: {
              q: 'Tik de twee woorden waar het hoedpatroon omhoog en weer omlaag gaat',
              sentence: 'Mijn broer heeft gisteren een nieuwe fiets gekocht.',
              targets: [1, 6],
              note: 'Omhoog op broer, hoog blijven, omlaag op fiets: het eerste en het laatste accent.',
            },
            deep: {
              q: 'Hoe deden ze dat onderzoek?',
              a: 'Ze maakten zinnen na met een synthetische toonhoogte en vereenvoudigden de melodie stap voor stap, tot luisteraars het verschil met het origineel niet meer hoorden. Wat overbleef, waren de bewegingen die er echt toe doen. Hun boek *A perceptual study of intonation* verscheen in 1990.',
            },
          },
          {
            text: 'Een vraag hoeft in het Nederlands niet altijd omhoog te gaan. Bij *Kom je morgen?* zegt de woordvolgorde al dat het een vraag is, dus een dalende toon kan ook. Bij *Je komt morgen?* staat de woordvolgorde van een mededeling. Dan draagt alleen de stijgende toon aan het eind de vraag.',
            quiz: {
              q: 'In welke zin moet de toon omhoog om als vraag te klinken?',
              options: ['Je komt morgen?', 'Kom je morgen?', 'Wanneer kom je?'],
              answer: 'Je komt morgen?',
              why: 'Alleen hier is de woordvolgorde die van een mededeling. Dan maakt de intonatie de vraag.',
            },
          },
          {
            text: 'Intonatie draagt ook houding. Een korte daling (*Ja.*) klinkt afgerond. Een daling gevolgd door een kleine stijging (*Ja-a?*) kan aarzeling of een voorbehoud uitdrukken. Een hoge, uitgerekte toon klinkt verbaasd. Om dat op te schrijven gebruiken taalkundigen een notatie als *ToDI* (Transcription of Dutch Intonation, van Gussenhoven en collega’s): *H* voor hoog, *L* voor laag, en een sterretje voor de toon op de beklemtoonde lettergreep.',
            rule: 'H = hoog, L = laag. H∗L is een daling op de accentlettergreep, L∗H een stijging.',
            lab: {
              label: 'Tik een antwoord op: Kom je ook?',
              chips: [
                { k: 'Ja. (H∗L)', out: 'afgerond, zeker', note: 'Een korte daling: de zaak is beklonken.' },
                { k: 'Ja-a? (H∗L H%)', out: 'aarzelend, met voorbehoud', note: 'Een daling met een stijging erna laat iets open.' },
                { k: 'Ja?! (L∗H)', out: 'verbaasd', note: 'Een stijging op het accent: dat had je niet verwacht.' },
              ],
            },
          },
        ],
      },
      {
        kind: 'choice',
        id: 'vraagtoon',
        prompt: 'Welke zin is zonder stijgende toon aan het eind gewoon een mededeling?',
        before: '',
        after: '',
        options: ['Je hebt de sleutels', 'Heb je de sleutels', 'Waar zijn de sleutels'],
        answer: 'Je hebt de sleutels',
        why: 'Met de woordvolgorde van een mededeling wordt het pas een vraag door de stijgende toon. De andere twee zijn door hun woordvolgorde al vragen.',
      },
      {
        kind: 'sort',
        id: 'todi',
        prompt: 'Welke toon past bij de beschrijving?',
        buckets: ['H∗L (daling op het accent)', 'L∗H (stijging op het accent)'],
        items: [
          { t: 'een afgeronde mededeling: Ja.', b: 0 },
          { t: 'een vraag met de volgorde van een mededeling: Je komt?', b: 1 },
          { t: 'het laatste accent van het hoedpatroon', b: 0 },
          { t: 'een verbaasde echo: Morgen?', b: 1 },
        ],
        why: 'Een daling op het accent klinkt afgerond en sluit het hoedpatroon af. Een stijging laat iets open: een vraag of verbazing.',
      },
      {
        kind: 'order',
        id: 'hoed',
        prompt: 'Zet de delen van het hoedpatroon in de goede volgorde.',
        tiles: ['daling op het laatste accent', 'hoog plateau', 'stijging op het eerste accent'],
        answer: 'stijging op het eerste accent hoog plateau daling op het laatste accent',
        why: 'Omhoog, hoog blijven, omlaag: de rand, de bol en de andere rand van een hoed.',
      },
      {
        kind: 'choice',
        id: 'focus-3',
        prompt: 'Vraag: ‘Heb je de fiets van Anna geleend?’ Antwoord: ‘Nee, van Piet.’ Welke volledige zin past?',
        before: '',
        after: '',
        options: ['Nee, ik heb de fiets van PIET geleend.', 'Nee, ik heb de FIETS van Piet geleend.', 'Nee, ik heb de fiets van Piet geLEEND.'],
        answer: 'Nee, ik heb de fiets van PIET geleend.',
        why: 'Het contrast zit in de eigenaar: Piet tegenover Anna. De fiets en het lenen zijn al bekend.',
      },
      {
        kind: 'swipe',
        id: 'intonatie-waar',
        prompt: 'Klopt het?',
        intro: 'Veeg naar rechts als de zin klopt, naar links als hij niet klopt.',
        cards: [
          { t: 'Het zinsaccent laat zien wat nieuw of belangrijk is.', ok: true, why: 'Het markeert de focus.' },
          { t: 'Een Nederlandse vraag moet altijd stijgend eindigen.', ok: false, fix: 'alleen als de woordvolgorde de vraag niet al aangeeft', why: 'Kom je morgen? kan ook dalend.' },
          { t: 'Bij brede focus valt het accent op het werkwoord aan het eind.', ok: false, fix: 'op het argument vóór het werkwoord', why: 'Ik heb een BOEK gelezen.' },
          { t: 'Bekende informatie verliest vaak haar accent.', ok: true, why: 'Dat heet deaccentuering.' },
          { t: 'Het hoedpatroon werd beschreven door onderzoekers van het IPO in Eindhoven.', ok: true, why: '’t Hart, Collier en Cohen.' },
          { t: 'Een accent op bekende informatie klinkt neutraal.', ok: false, fix: 'het klinkt als contrast of tegenspraak', why: 'Een onverwacht accent roept een alternatief op.' },
        ],
      },
    ],
  },
];
