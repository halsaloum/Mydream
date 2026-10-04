import type { Domain, Lesson } from './course'

/** Taal van klein naar groot: elke laag is gebouwd uit de laag eronder. */
export type Layer = { id: string; name: string; icon: string; made: string; color: string; shade: string; learn: string; fields: Domain[]; example: string; lessons: Lesson[] }

const any = (...w: string[]) => new RegExp(`\\b(${w.join('|')})\\b`, 'i')

export const LAYERS: Layer[] = [
  { id: 'letter', name: 'De letter', icon: 'a', made: 'het kleinste teken', color: 'bg-mint', shade: '#58a700', learn: 'Lettervormen, het alfabet, hoofdletters en kleine letters.', fields: ['orth'], example: '*b* en *B*: één letter, twee vormen.', lessons: [
    { id: 'l1', domain: 'orth', title: 'Klinkers en medeklinkers', skill: 'Spelling', icon: 'a', steps: [
      { kind: 'explain', title: 'Twee soorten letters', panels: [
        { text: 'Het Nederlands heeft 26 letters. Die vallen in twee groepen. *Klinkers* maak je met een open mond: de lucht stroomt vrij. *Medeklinkers* maak je door de lucht ergens te blokkeren, met je lippen, tong of keel. Zeg maar eens *aaa* en dan *p*: voel je het verschil?', rule: 'Er zijn vijf klinkers: *a e i o u*. Alle andere letters zijn medeklinkers.', alpha: { q: 'Tik de vijf klinkers aan', targets: ['a', 'e', 'i', 'o', 'u'], note: 'a, e, i, o, u. De andere 21 zijn medeklinkers.' } },
        { text: 'Elk Nederlands woord heeft minstens één klinker. Die vormt het hart, de medeklinkers zitten eromheen als een rand. Daarom verandert een woord helemaal als je alleen de klinker wisselt.', deep: { q: 'En de y dan?', a: 'De *y* is een buitenbeentje. In leenwoorden als *baby* of *hobby* klinkt hij als een klinker (*ie*). Aan het begin van *yoghurt* klinkt hij als de medeklinker *j*. Hij hoort dus bij geen van beide groepen.' }, wheel: { start: 'b', end: 'k', need: 4, note: 'Eén klinker, vier woorden. Klinkers zijn het hart van een woord.', options: [{ v: 'a', mean: 'bak: een bak met water' }, { v: 'e', mean: 'bek: de mond van een dier' }, { v: 'i' }, { v: 'o', mean: 'bok: een mannetjesgeit' }, { v: 'u', mean: 'buk: buig voorover!' }] } },
        { text: 'Waarom is dit handig? Of een woord met een klinker begint, bepaalt soms de spelling eromheen. Je zegt *een appel*, maar in een samenstelling zie je dat ook terug: *zee-egel*, met een streepje tussen twee klinkers die anders samensmelten.', deep: { q: 'Waarom dat streepje in zee-egel?', a: 'Zonder streepje lees je *zeeegel* als *zeeë-gel* of *zeeeg-el*. Het streepje laat zien waar het ene woord stopt en het andere begint. Dat zie je bij botsende klinkers: *auto-ongeluk*, *zee-eend*.' }, mark: { q: 'Tik de woorden die met een klinker beginnen', sentence: 'appel peer ui druif oliebol', targets: [0, 2, 4], note: 'a, u en o: klinkers.' } },
      ] },
    ] },
    { id: 'l2', domain: 'orth', title: 'Hoofdletters en tekens', skill: 'Spelling', icon: 'A', steps: [
      { kind: 'explain', title: 'Grote letters, kleine tekens', panels: [
        { text: 'Een hoofdletter krijgt: het begin van een zin, een naam, een plaats, een land. Dagen en maanden niet.', mark: { q: 'Tik wat een hoofdletter moet krijgen', sentence: 'op maandag reist eva naar parijs.', targets: [0, 3, 5], note: 'Op, Eva en Parijs. Maandag blijft klein.' } },
        { text: 'Een trema (¨) laat zien dat een nieuwe lettergreep begint: ruïne, zeeën. Zonder trema lees je het als één klank.', lab: { label: 'Tik een woord', chips: [
          { k: 'zeeën', out: 'zee · en', note: 'Zonder trema: zeeen → onleesbaar.' },
          { k: 'ruïne', out: 'ru · i · ne', note: 'Zonder trema lees je ui.' },
          { k: 'België', out: 'Bel · gi · e', note: 'Anders lees je ie.' },
        ] } },
      ] },
      { kind: 'rewrite', prompt: 'Zet de hoofdletters goed.', source: 'in juli gaan sanne en ik naar spanje.', accept: ['In juli gaan Sanne en ik naar Spanje.'], why: 'Zinsbegin, naam en land. Juli blijft klein.' },
      { kind: 'choice', prompt: 'Kies de juiste spelling.', before: 'Wat een mooie', after: '!', options: ['ideeen', 'ideeën', 'idee\'en'], answer: 'ideeën', why: 'Het trema laat zien: idee · en.' },
    ] },
    { id: 'l4', domain: 'orth', also: ['prag'], title: 'HOOFDLETTERS!!! en toon', skill: 'Spelling', icon: '!!', steps: [
      { kind: 'explain', title: 'Tekens geven toon', panels: [
        { text: 'Dezelfde letters kunnen anders overkomen. Alles in hoofdletters leest als schreeuwen; drie uitroeptekens als opgewonden of boos. In een mail aan je baas werkt dat anders dan in een appje.', lab: { label: 'Tik een versie', chips: [
          { k: 'rustig', out: 'Kun je even bellen?', note: 'Neutraal, vriendelijk.' }, { k: 'HOOFD', out: 'KUN JE EVEN BELLEN', note: 'Leest als boos of dringend.' }, { k: '!!!', out: 'Kun je even bellen!!!', note: 'Paniek, of ergernis.' },
        ] } },
      ] },
      { kind: 'choice', prompt: 'Welke past in een mail aan een klant?', before: '', after: '', options: ['Bedankt voor uw bericht.', 'BEDANKT VOOR UW BERICHT', 'Bedankt voor uw bericht!!!'], answer: 'Bedankt voor uw bericht.', why: 'Rustig en zakelijk.' },
    ] },
  ] },

  { id: 'klank', name: 'Klank en letter', icon: 'oe', made: 'tekens die een klank vormen', color: 'bg-[#00c2a8]', shade: '#00a08b', learn: 'Hoe Nederlandse klanken samenhangen met de tekens die je schrijft.', fields: ['fon', 'orth'], example: '*oe* bestaat uit twee letters en geeft één klinkerklank weer.', lessons: [
    { id: 'k1', domain: 'fon', also: ['orth'], title: 'Twee letters, één klank', skill: 'Spelling', icon: 'oe', steps: [
      { kind: 'explain', title: 'Twee letters, één klank', panels: [
        { text: 'Er zijn meer klanken dan klinkers. Daarom schrijven we sommige klanken met twee letters. Je hoort één klank, je ziet twee letters. Die combinaties heten *tweeklanken* en *klinkercombinaties*.', rule: 'Twee letters, één klank: *ij ei ui ou au eu oe*.', blend: { letters: ['i', 'j', 'e', 'u', 'o'], pairs: [{ s: 'ij', ex: 'wijn, tijd' }, { s: 'ei', ex: 'klein, trein' }, { s: 'ui', ex: 'huis, uit' }, { s: 'ou', ex: 'koud, oud' }, { s: 'eu', ex: 'deur, neus' }, { s: 'oe', ex: 'boek, goed' }], note: 'Zes klanken, telkens twee letters.' } },
        { text: 'Hier zit de valkuil. *ij* en *ei* klinken precies hetzelfde, net als *ou* en *au*. Er is geen klankregel die je helpt: je moet het woordbeeld onthouden. Gelukkig helpt lezen enorm, want je ogen zien een fout eerder dan je oren.', deep: { q: 'Is er echt geen trucje?', a: 'Een paar houvasten: aan het eind van een woord staat vaak *-ij* (*bakkerij*, *partij*), en de uitgang *-lijk* is altijd met *ij* (*moeilijk*, *eerlijk*). Ook *-heid* is altijd met *ei* (*vrijheid*). Verder: woordbeeld.' }, lab: { label: 'Tik een paar', chips: [
          { k: 'ij / ei', out: 'wijn · klein', note: 'Zelfde klank. Onthoud het woordbeeld.' },
          { k: 'ou / au', out: 'koud · blauw', note: 'Ook hier: onthouden.' },
          { k: 'ui', out: 'huis · uit', note: 'Altijd ui, geen twijfel.' },
        ] }, quiz: { q: 'Welke is goed gespeld?', options: ['kleijn', 'klein', 'klijn'], answer: 'klein', why: 'Klein met ei. Ij of ei leer je per woord.' } },
      ] },
      { kind: 'sort', prompt: 'ij of ei?', buckets: ['ij', 'ei'], items: [{ t: 'w_n', b: 0 }, { t: 'tr_n', b: 1 }, { t: 't_d', b: 0 }, { t: 'pl_n', b: 1 }, { t: 'r_st', b: 0 }, { t: 'h_de', b: 1 }], why: 'wijn, trein, tijd, plein, rijst, heide. Ij of ei leer je per woord.' },
      { kind: 'choice', prompt: 'Kies de juiste spelling.', before: 'Het is', after: 'buiten.', options: ['kout', 'koud', 'kaud'], answer: 'koud', why: 'Koud met ou en d (kouder).' },
      { kind: 'type', prompt: 'Typ de ontbrekende klank.', before: 'Ik woon in een groot h', after: 's.', hint: 'twee letters', answer: 'ui', why: 'Huis met ui.' },
      { kind: 'fix', prompt: 'Tik het fout gespelde woord en verbeter het.', sentence: 'De treijn was te laat.', wrong: 1, answer: 'trein', why: 'Trein met ei, zonder j.' },
    ] },
    { id: 'l3', domain: 'fon', also: ['sem'], title: 'Eén letter, andere betekenis', skill: 'Spelling', icon: 'a/aa', steps: [
      { kind: 'explain', title: 'Een letter verschuift de betekenis', panels: [
        { text: 'Een letter heeft zelf geen betekenis, maar wisselt er één, dan krijg je een heel ander woord. Bed, bad, bod: drie dingen, één letter verschil.', lab: { label: 'Tik een klinker', chips: [
          { k: 'e', out: 'bed', note: 'Waar je in slaapt.' }, { k: 'a', out: 'bad', note: 'Waar je in ligt te weken.' }, { k: 'o', out: 'bod', note: 'Wat je op een huis doet.' },
        ] }, quiz: { q: 'Hij woont op de … (bovenste verdieping).', options: ['zolder', 'zoldr', 'zulder'], answer: 'zolder', why: 'Elke letter telt.' } },
      ] },
      { kind: 'choice', prompt: 'Welk woord past?', before: 'Ik heb mijn', after: 'gebroken bij het voetballen.', options: ['been', 'bien', 'bon'], answer: 'been', why: 'ee: been. Een bon krijg je in de winkel.' },
      { kind: 'choice', prompt: 'Welk woord past?', before: 'De', after: 'scheen fel boven de zee.', options: ['maan', 'man', 'mien'], answer: 'maan', why: 'aa: maan. Man is een persoon.' },
    ] },
  ] },

  { id: 'greep', name: 'De lettergreep', icon: 'ba', made: 'letters rond één klinker', color: 'bg-[#ff9600]', shade: '#cd7900', learn: 'Klankgroepen binnen woorden en hoe die samenhangen met spelling en afbreken.', fields: ['fon', 'orth'], example: '*boe-ken*', lessons: [
    { id: 'g1', domain: 'fon', also: ['orth'], title: 'Open en dicht', skill: 'Spelling', icon: 'bo', steps: [
      { kind: 'explain', title: 'Waarom bomen één o heeft', panels: [
        { text: 'Een lettergreep is een klinker met de medeklinkers eromheen. Knip een woord in stukjes zoals je het uitspreekt.', split: { word: 'bomen', answer: 'bo-men', note: 'bo eindigt op een klinker: open.' } },
        { text: 'Een open lettergreep eindigt op een klinker. Dan klinkt één letter al lang. Een dichte eindigt op een medeklinker.', split: { word: 'manen', answer: 'ma-nen', note: 'ma is open: één a is lang genoeg.' }, quiz: { q: 'Meervoud van raam?', options: ['raamen', 'ramen', 'rammen'], answer: 'ramen', why: 'ra-men: open, dus één a.' } },
      ] },
      { kind: 'type', prompt: 'Typ het meervoud.', before: 'Eén laan, twee', after: '.', hint: 'laan', answer: 'lanen', why: 'la-nen: open lettergreep, één a.' },
      { kind: 'type', prompt: 'Typ het meervoud.', before: 'Eén muur, twee', after: '.', hint: 'muur', answer: 'muren', why: 'mu-ren.' },
    ] },
    { id: 'g2', domain: 'orth', also: ['fon'], title: 'Verdubbelen', skill: 'Spelling', icon: 'mm', steps: [
      { kind: 'explain', title: 'Korte klank? Hek erachter', panels: [
        { text: 'Wil je een korte klank houden, dan moet de lettergreep dicht blijven. Daarom verdubbel je de medeklinker.', split: { word: 'bommen', answer: 'bom-men', note: 'bom is dicht: korte o.' } },
        { text: 'Vergelijk: één letter verschil, een heel ander woord.', lab: { label: 'Tik een paar', chips: [
          { k: 'bomen / bommen', out: 'bo-men · bom-men', note: 'Lange o vs. korte o.' },
          { k: 'manen / mannen', out: 'ma-nen · man-nen', note: 'Lange a vs. korte a.' },
          { k: 'kopen / koppen', out: 'ko-pen · kop-pen', note: 'Lange o vs. korte o.' },
        ] } },
      ] },
      { kind: 'sort', prompt: 'Eén of twee medeklinkers?', buckets: ['één', 'twee'], items: [{ t: 'ka_er (kamer)', b: 0 }, { t: 'ka_en (kammen)', b: 1 }, { t: 'zo_er (zomer)', b: 0 }, { t: 'zo_en (zonnen)', b: 1 }, { t: 'ste_en (stelen)', b: 0 }, { t: 'ste_en (stellen)', b: 1 }], why: 'Lange klank: open, één letter. Korte klank: verdubbelen.' },
      { kind: 'fix', prompt: 'Tik het foute woord aan en verbeter het.', sentence: 'We gaan morgen naar de bakker om brood te koppen.', wrong: 9, answer: 'kopen', why: 'Lange o: ko-pen.' },
    ] },
    { id: 'g3', domain: 'fon', also: ['sem'], title: 'Klemtoon kiest de betekenis', skill: 'Spelling', icon: 'vóór', steps: [
      { kind: 'explain', title: 'Welke lettergreep krijgt de klemtoon?', panels: [
        { text: 'Sommige woorden schrijf je hetzelfde, maar de klemtoon op een andere lettergreep geeft een andere betekenis. Op papier kun je dat laten zien met accenten.', lab: { label: 'Tik een klemtoon', chips: [
          { k: 'vóór-ko-men', out: 'Dat woord komt vaak vóór.', note: 'gebeuren, aanwezig zijn' }, { k: 'voor-kó-men', out: 'We willen een ongeluk voorkómen.', note: 'tegenhouden' },
        ] }, quiz: { q: 'De brandweer wil schade …', options: ['vóórkomen', 'voorkómen'], answer: 'voorkómen', why: 'Tegenhouden: klemtoon op kó.' } },
      ] },
      { kind: 'choice', prompt: 'Welke betekenis?', before: 'Ik ga het boek', after: '(= vertalen).', options: ['óverzetten', 'overzétten'], answer: 'overzétten', why: 'Óverzetten = met een pontje.' },
    ] },
  ] },

  { id: 'deel', name: 'Het betekenisvolle woorddeel', icon: '-je', made: 'stukjes met betekenis', color: 'bg-[#ffc800]', shade: '#e0a800', learn: 'Stammen, voorvoegsels, achtervoegsels en uitgangen.', fields: ['morf'], example: '*boek* + *en*', lessons: [
    { id: 'd0', domain: 'morf', also: ['fon'], title: 'Lettergreep of woorddeel?', skill: 'Woorden', icon: '÷', steps: [
      { kind: 'explain', title: 'Twee manieren om één woord te knippen', panels: [
        { text: 'Je kunt een woord op twee manieren in stukjes delen. Op *klank*: dan krijg je lettergrepen. Of op *betekenis*: dan krijg je woorddelen. Die vallen lang niet altijd samen.', split: { word: 'boeken', answer: 'boe-ken', note: 'Op klank: boe-ken.' } },
        { text: 'Knip je *boeken* op betekenis, dan zie je de stam *boek* en de uitgang *-en* (meervoud). Dezelfde letters, een andere grens.', rule: 'Lettergreep = klank (*boe-ken*). Woorddeel = betekenis (*boek + en*).', build: { stem: 'boek', endings: ['', 'en', 'je', 's'], answer: 'en', note: 'boek + en = meer dan één boek.' }, deep: { q: 'Waarom is dat belangrijk?', a: 'Lettergrepen helpen je bij spelling en afbreken: *bo-men* heeft één o omdat de lettergreep open is. Woorddelen helpen je bij betekenis en vorm: *boek-en*, *boek-je*, *boek-winkel*. Daarom zijn het geen opeenvolgende stappen, maar twee brillen op hetzelfde woord.' } },
      ] },
      { kind: 'sort', prompt: 'Is dit geknipt op klank of op betekenis?', buckets: ['lettergreep', 'woorddeel'], items: [{ t: 'boe-ken', b: 0 }, { t: 'boek + en', b: 1 }, { t: 'lo-pen', b: 0 }, { t: 'loop + t', b: 1 }, { t: 'hui-zen', b: 0 }, { t: 'huis + je', b: 1 }], why: 'Klank: lettergrepen. Betekenis: stam + uitgang.' },
    ] },
    { id: 'd1', domain: 'morf', title: 'Stam en uitgang', skill: 'Woorden', icon: '+', steps: [
      { kind: 'explain', title: 'Woorden zijn gebouwd', panels: [
        { text: 'Woorden bestaan uit stukjes met een eigen betekenis: morfemen. De stam is de kern; daar plak je uitgangen aan.', lab: { label: 'Tik een woord', chips: [
          { k: 'lopen', out: 'loop + en', note: 'Stam loop, uitgang -en (hele werkwoord).' },
          { k: 'boompje', out: 'boom + pje', note: 'Uitgang -pje maakt het klein.' },
          { k: 'onaardig', out: 'on + aardig', note: 'Voorvoegsel on- draait de betekenis om.' },
        ] } },
        { text: 'Het verkleinwoord heeft vijf uitgangen. De klank aan het eind van de stam kiest.', build: { before: 'Een kleine boom is een…', stem: 'boom', endings: ['je', 'tje', 'pje', 'etje'], answer: 'pje', note: 'Na m: -pje.' } },
        { text: 'Korte klank + medeklinker: -etje.', build: { before: 'Een kleine bal is een…', stem: 'ball', endings: ['je', 'tje', 'etje'], answer: 'etje', note: 'balletje.' } },
      ] },
      { kind: 'sort', prompt: 'Meervoud op -en of op -s?', buckets: ['-en', '-s'], items: [{ t: 'boek', b: 0 }, { t: 'tafel', b: 1 }, { t: 'stoel', b: 0 }, { t: 'auto', b: 1 }, { t: 'kat', b: 0 }, { t: 'meisje', b: 1 }], why: 'Op -el, -er, -je en klinker: vaak -s.' },
    ] },
    { id: 'd2', domain: 'morf', also: ['sem'], title: 'Woorden aan elkaar', skill: 'Woorden', icon: '⚭', steps: [
      { kind: 'explain', title: 'Samenstellingen schrijf je aan elkaar', panels: [
        { text: 'Plak je twee woorden tot één nieuw woord, dan schrijf je ze aan elkaar. Het laatste deel is de kern: een voetbal is een bal.', lab: { label: 'Tik een samenstelling', chips: [
          { k: 'voet + bal', out: 'voetbal', note: 'Een soort bal.' },
          { k: 'kinder + boek', out: 'kinderboek', note: 'Een soort boek.' },
          { k: 'boek + kinder', out: '—', note: 'Bestaat niet: de kern staat achteraan.' },
        ] }, quiz: { q: 'Welke is goed?', options: ['ziekenhuis bed', 'ziekenhuisbed', 'ziekenhuis-bed'], answer: 'ziekenhuisbed', why: 'Samenstelling = aan elkaar.' } },
        { text: 'Soms hoort er een tussen-s of -en- tussen. Hoor je een s? Schrijf hem. Pannenkoek krijgt -en-.', build: { before: 'Een koek uit de pan is een…', stem: 'pann', endings: ['ekoek', 'enkoek', 'skoek'], answer: 'enkoek', note: 'pannenkoek.' } },
      ] },
      { kind: 'fix', prompt: 'Tik het foute woord aan en verbeter het.', sentence: 'We hebben een nieuwe tuin stoel gekocht.', wrong: 4, answer: 'tuinstoel', why: 'Samenstelling aan elkaar. (Tik het eerste deel.)' },
    ] },
    { id: 'd3', domain: 'morf', also: ['sem'], title: 'Voorvoegsels sturen betekenis', skill: 'Woorden', icon: 'on-', steps: [
      { kind: 'explain', title: 'Eén stukje ervoor, nieuwe betekenis', panels: [
        { text: 'Een voorvoegsel verandert wat een woord betekent. on- draait om, ver- verandert, her- doet opnieuw.', lab: { label: 'Tik een voorvoegsel', chips: [
          { k: 'on-', out: 'ongeduldig', note: 'het tegendeel' }, { k: 'her-', out: 'herschrijven', note: 'opnieuw' }, { k: 'ver-', out: 'verbouwen', note: 'anders maken' },
        ] } },
      ] },
      { kind: 'choice', prompt: 'Welk woord betekent "niet eerlijk"?', before: 'Dat was', after: 'van hem.', options: ['oneerlijk', 'vereerlijk', 'hereerlijk'], answer: 'oneerlijk', why: 'on- = het tegendeel.' },
      { kind: 'choice', prompt: 'Welk woord betekent "opnieuw openen"?', before: 'De winkel gaat morgen', after: '.', options: ['heropenen', 'veropenen', 'onopenen'], answer: 'heropenen', why: 'her- = opnieuw.' },
    ] },
    { id: 'd4', domain: 'prag', also: ['morf'], title: 'Het verkleinwoord als toon', skill: 'Woorden', icon: '-tje', steps: [
      { kind: 'explain', title: 'Klein is niet altijd klein', panels: [
        { text: 'Met -je maak je iets niet alleen kleiner. Het maakt ook zachter, gezelliger of juist kleinerend. "Een momentje" is beleefd, "een mannetje" kan spottend zijn.', lab: { label: 'Tik een zin', chips: [
          { k: 'beleefd', out: 'Heeft u een momentje?', note: 'Verzacht het verzoek.' }, { k: 'gezellig', out: 'Zullen we een biertje doen?', note: 'Ontspannen, uitnodigend.' }, { k: 'spottend', out: 'Wat een baantje heeft hij.', note: 'Maakt het minder waard.' },
        ] } },
      ] },
      { kind: 'choice', prompt: 'Welke klinkt het vriendelijkst?', before: '', after: '', options: ['Wacht even.', 'Een momentje alstublieft.', 'Wacht.'], answer: 'Een momentje alstublieft.', why: 'Het verkleinwoord verzacht.' },
    ] },
  ] },

  { id: 'woord', name: 'Het woord', icon: 'Aa', made: 'een vorm met een rol', color: 'bg-sky', shade: '#1899d6', learn: 'Woordbetekenis, woordsoort, woordvorming, verbuiging en vervoeging.', fields: ['sem', 'morf', 'syn'], example: '*boek*: een zelfstandig naamwoord met een betekenis.', lessons: [
    { id: 'w1', domain: 'morf', also: ['orth'], title: 'Werkwoorden: d of t', skill: 'Spelling', icon: 'dt', steps: [
      { kind: 'explain', title: 'Je hoort het niet, je schrijft het wel', panels: [
        { text: 'Wordt en word klinken hetzelfde. Vervang het werkwoord door lopen. Hoor je loopt? Schrijf een t.', build: { before: 'Hij (vinden)…', stem: 'vind', endings: ['', 't', 'd'], answer: 't', note: 'Hij loopt → vindt.' } },
        { text: 'Staat jij achter het werkwoord, dan valt de t weg.', build: { before: '(worden) … jij ook moe?', stem: 'Word', endings: ['', 't', 'dt'], answer: '', note: 'Loop jij? → Word jij?' } },
        { text: "Verleden tijd: stam + te of de. 't kofschip beslist: staat de laatste letter van de stam in t-k-f-s-ch-p? Dan -te.", lab: { label: 'Tik een werkwoord', chips: [
          { k: 'werken', out: 'werkte', note: 'k → -te' }, { k: 'spelen', out: 'speelde', note: 'l → -de' }, { k: 'leven', out: 'leefde', note: 'v (niet f) → -de' },
        ] } },
      ] },
      { kind: 'sort', prompt: '-te of -de?', buckets: ['-te', '-de'], items: [{ t: 'missen', b: 0 }, { t: 'horen', b: 1 }, { t: 'stoppen', b: 0 }, { t: 'reizen', b: 1 }, { t: 'lachen', b: 0 }, { t: 'leven', b: 1 }], why: 's, p, ch → kofschip. r, z, v → niet.' },
      { kind: 'fix', prompt: 'Tik het foute woord aan en verbeter het.', sentence: 'Mijn zus houd van lange wandelingen.', wrong: 2, answer: 'houdt', why: 'Zij loopt → houdt.' },
    ] },
    { id: 'w2', domain: 'morf', also: ['syn'], title: 'de, het en de -e', skill: 'Woorden', icon: 'de', steps: [
      { kind: 'explain', title: 'Woorden passen zich aan', panels: [
        { text: 'Een zelfstandig naamwoord is een de-woord of een het-woord. Verkleinwoorden zijn altijd het, meervoud altijd de.', lab: { label: 'Tik een woord', chips: [
          { k: 'huis', out: 'het huis → de huizen', note: 'Meervoud: de.' }, { k: 'boompje', out: 'het boompje', note: 'Verkleinwoord: het.' }, { k: 'tafel', out: 'de tafel', note: 'de-woord.' },
        ] } },
        { text: 'Een bijvoeglijk naamwoord krijgt bijna altijd een -e. Behalve: een + het-woord.', lab: { label: 'Tik een combinatie', chips: [
          { k: 'de man', out: 'de grote man', note: '-e' }, { k: 'het huis', out: 'het grote huis', note: '-e' }, { k: 'een huis', out: 'een groot huis', note: 'géén -e' },
        ] }, quiz: { q: 'Ze woont in een … dorp.', options: ['klein', 'kleine'], answer: 'klein', why: 'een + het dorp → geen -e.' } },
      ] },
      { kind: 'choice', prompt: 'Kies de juiste vorm.', before: 'Het', after: 'meisje lacht.', options: ['vrolijk', 'vrolijke'], answer: 'vrolijke', why: 'het + … → -e.' },
    ] },
    { id: 'w3', domain: 'syn', also: ['sem'], title: 'Woordsoorten', skill: 'Woorden', icon: '◆', steps: [
      { kind: 'explain', title: 'Elk woord heeft een rol', panels: [
        { text: 'Woorden hebben een soort. Een zelfstandig naamwoord noemt iets, een werkwoord zegt wat er gebeurt, een bijvoeglijk naamwoord kleurt het naamwoord.', lab: { label: 'Tik een soort', chips: [
          { k: 'naamwoord', out: 'fiets · liefde · Anna', note: 'Je kunt er de, het of een voor zetten.' },
          { k: 'werkwoord', out: 'fietsen · denken · zijn', note: 'Je kunt het vervoegen: ik fiets, ik fietste.' },
          { k: 'bijvoeglijk', out: 'snel · rood · moe', note: 'Past tussen de en een naamwoord: de rode fiets.' },
        ] } },
        { text: 'Hetzelfde woord kan van soort wisselen. Dat zie je aan zijn plek.', mark: { q: 'Tik de werkwoorden', sentence: 'Wij fietsen naar de winkel en kopen twee fietsen.', targets: [1, 6], note: 'Het tweede fietsen is een naamwoord: twee fietsen.' } },
      ] },
      { kind: 'sort', prompt: 'Naamwoord of werkwoord?', buckets: ['naamwoord', 'werkwoord'], items: [{ t: 'het eten', b: 0 }, { t: 'wij eten', b: 1 }, { t: 'de wandeling', b: 0 }, { t: 'ze wandelt', b: 1 }, { t: 'een droom', b: 0 }, { t: 'ik droom', b: 1 }], why: 'Lidwoord ervoor → naamwoord. Persoon ervoor → werkwoord.' },
    ] },
    { id: 'w4', domain: 'sem', title: 'Synoniemen zijn nooit gelijk', skill: 'Woorden', icon: '≈', steps: [
      { kind: 'explain', title: 'Zelfde ding, ander gevoel', panels: [
        { text: 'Huis, woning, optrekje, krot: allemaal een plek om te wonen. Toch roept elk woord iets anders op. Woordkeuze is betekenis kiezen.', lab: { label: 'Tik een woord', chips: [
          { k: 'woning', out: 'Te koop: ruime woning.', note: 'Zakelijk, neutraal.' }, { k: 'optrekje', out: 'Een knus optrekje aan zee.', note: 'Klein en gezellig.' }, { k: 'krot', out: 'Ze woonden in een krot.', note: 'Vervallen, negatief.' },
        ] } },
      ] },
      { kind: 'choice', prompt: 'Welk woord is positief?', before: 'Hij is erg', after: '.', options: ['zuinig', 'gierig', 'krenterig'], answer: 'zuinig', why: 'Gierig en krenterig zijn verwijten.' },
      { kind: 'choice', prompt: 'Welk woord is negatief?', before: 'Ze is heel', after: '.', options: ['vastberaden', 'koppig', 'standvastig'], answer: 'koppig', why: 'Zelfde eigenschap, negatieve lading.' },
    ] },
    { id: 'w5', domain: 'prag', also: ['sem'], title: 'U of jij', skill: 'Woorden', icon: 'u', steps: [
      { kind: 'explain', title: 'Het voornaamwoord zet de afstand', panels: [
        { text: 'Met u houd je afstand en toon je respect; met jij ben je dichtbij. Welk woord je kiest, hangt af van wie je aanspreekt en waar.', lab: { label: 'Tik een situatie', chips: [
          { k: 'sollicitatie', out: 'Graag hoor ik van u.', note: 'Formeel: u.' }, { k: 'collega', out: 'Heb jij die mail gezien?', note: 'Informeel: jij.' }, { k: 'klantenservice', out: 'Kunt u uw nummer geven?', note: 'Vaak u, soms bewust jij.' },
        ] } },
      ] },
      { kind: 'choice', prompt: 'Brief aan de gemeente:', before: 'Ik verzoek', after: 'mijn aanvraag te bekijken.', options: ['u', 'jou', 'je'], answer: 'u', why: 'Formele brief: u.' },
      { kind: 'fix', prompt: 'Tik het woord dat niet past bij de toon.', sentence: 'Geachte heer Jansen, kun jij mij laten weten wanneer u tijd heeft?', wrong: 4, answer: 'u', why: 'Geachte → u, en consequent blijven.' },
    ] },
    { id: 'w6', domain: 'prag', also: ['sem'], title: 'Wie is ik?', skill: 'Woorden', icon: 'ik', steps: [
      { kind: 'explain', title: 'Woorden die naar de situatie wijzen', panels: [
        { text: 'Wat *ik* betekent, hangt af van wie het zegt. Als Sanne schrijft *ik kom morgen*, dan is ik Sanne. Hetzelfde geldt voor *jij*, *hier* en *morgen*: je hebt de situatie nodig om ze te begrijpen.', lab: { label: 'Tik wie het schrijft', chips: [
          { k: 'Sanne', out: 'ik = Sanne', note: 'Sanne schrijft: "Ik kom morgen."' }, { k: 'de bakker', out: 'ik = de bakker', note: 'Dezelfde zin op een briefje in de winkel.' }, { k: 'jij', out: 'ik = jij', note: 'Schrijf je het zelf, dan ben jij het.' },
        ] }, rule: 'Woorden als *ik*, *hier* en *morgen* krijgen hun betekenis pas in de situatie.' },
        { text: 'Daarom moet een schrijver opletten. Een briefje *Ik ben er morgen niet* zonder naam of datum is voor de lezer een raadsel.', deep: { q: 'Hoe heet dit in de taalkunde?', a: 'Dit heet *deixis*: woorden die naar de spreker, de plaats of de tijd wijzen. Het is een kernonderwerp van de pragmatiek.' } },
      ] },
      { kind: 'choice', prompt: 'Op de deur hangt: "Ik ben zo terug." Wat weet de lezer niet?', before: '', after: '', options: ['wie ik is en wanneer zo is', 'wat terug betekent', 'niets, het is duidelijk'], answer: 'wie ik is en wanneer zo is', why: 'Ik en zo hangen af van de situatie.' },
    ] },
  ] },

  { id: 'groep', name: 'De woordgroep', icon: '[ ]', made: 'woorden als één blok', color: 'bg-lilac', shade: '#a568cc', learn: 'Hoe woorden samen een groep vormen en samen betekenis krijgen.', fields: ['syn', 'sem'], example: '*het rode boek*', lessons: [
    { id: 'p1', domain: 'syn', title: 'Blokken in de zin', skill: 'Zinsbouw', icon: '▭', steps: [
      { kind: 'explain', title: 'Woorden klonteren samen', panels: [
        { text: 'Woorden vormen groepjes rond één kern: de oude buurman, op het station, heel erg snel. Zo’n groep beweegt als één blok door de zin.', swap: { goal: 'Zet het blok "op het station" vooraan.', blocks: ['Ik', 'wachtte', 'op het station'], accept: ['op het station wachtte Ik'], note: 'Op het station wachtte ik. Het blok blijft heel.' } },
        { text: 'Het onderwerp is het blok dat de handeling doet. Vraag: wie of wat + persoonsvorm?', mark: { q: 'Tik het hele onderwerp', sentence: 'De oude buurman van hiernaast zwaait.', targets: [0, 1, 2, 3, 4], note: 'Wie zwaait? De oude buurman van hiernaast.' } },
      ] },
      { kind: 'order', prompt: 'Maak een goede zin van de blokken.', tiles: ['de rode fiets', 'Mijn broer', 'heeft', 'gekocht'], answer: 'Mijn broer heeft de rode fiets gekocht', why: 'Onderwerp, persoonsvorm, lijdend voorwerp, rest.' },
    ] },
    { id: 'p2', domain: 'sem', also: ['syn'], title: 'Precieze woordgroepen', skill: 'Woorden', icon: '🎯', steps: [
      { kind: 'explain', title: 'Een blok kan scherper', panels: [
        { text: 'Een woordgroep groeit door woorden toe te voegen rond de kern. Maar langer is niet altijd beter: één precies woord wint van drie vage.', lab: { label: 'Tik een versie', chips: [
          { k: 'vaag', out: 'een heel erg grote hond', note: 'Twee versterkers, weinig beeld.' },
          { k: 'precies', out: 'een enorme herdershond', note: 'Je ziet hem meteen.' },
          { k: 'te veel', out: 'een grote, enorme, gigantische hond', note: 'Stapelen verzwakt.' },
        ] }, quiz: { q: 'Welke woordgroep laat het meeste zien?', options: ['een mooi oud huis', 'een vervallen grachtenpand', 'een heel oud huis'], answer: 'een vervallen grachtenpand', why: 'Concrete woorden geven een beeld.' } },
      ] },
      { kind: 'rewrite', prompt: 'Vervang "heel erg mooi" door één sterk woord.', source: 'Het uitzicht was heel erg mooi.', accept: ['Het uitzicht was prachtig.', 'Het uitzicht was schitterend.', 'Het uitzicht was adembenemend.', 'Het uitzicht was magnifiek.', 'Het uitzicht was betoverend.', 'Het uitzicht was oogverblindend.'], why: 'Eén precies woord.' },
      { kind: 'choice', prompt: 'Welk werkwoord laat zien dat hij moe is?', before: 'Na de marathon', after: 'hij naar huis.', options: ['ging', 'sjokte', 'deed'], answer: 'sjokte', why: 'Sjokken: langzaam en zwaar.' },
    ] },
  ] },

  { id: 'zin', name: 'De enkelvoudige zin', icon: '—.', made: 'blokken rond een persoonsvorm', color: 'bg-[#2b70c9]', shade: '#1f5aa5', learn: 'Zinsdelen, woordvolgorde, overeenstemming en de betekenis van de hele zin.', fields: ['syn', 'sem', 'prag'], example: '*Ik lees het boek.*', lessons: [
    { id: 'z1', domain: 'syn', title: 'De motor op plek 2', skill: 'Zinsbouw', icon: '2', steps: [
      { kind: 'explain', title: 'De persoonsvorm is de motor', panels: [
        { text: 'Elke zin heeft een persoonsvorm: het werkwoord dat meeverandert met tijd. In een hoofdzin staat die altijd op plek 2.', mark: { q: 'Tik de persoonsvorm', sentence: 'Morgen fiets ik naar mijn werk.', targets: [1], note: 'fiets → fietste.' } },
        { text: 'Zet je iets anders vooraan, dan schuift het onderwerp achter de persoonsvorm. Dat heet inversie.', swap: { goal: 'Persoonsvorm op plek 2.', blocks: ['Gisteren', 'ik', 'zag', 'haar'], accept: ['Gisteren zag ik haar'], note: 'Gisteren (1) zag (2) ik.' } },
        { text: 'Onderwerp en persoonsvorm horen bij elkaar: meervoud bij meervoud.', quiz: { q: 'De kinderen … buiten.', options: ['speelt', 'spelen'], answer: 'spelen', why: 'De kinderen = meervoud.' } },
      ] },
      { kind: 'rewrite', prompt: 'Begin met "Elke zaterdag".', source: 'Wij zwemmen elke zaterdag in het meer.', accept: ['Elke zaterdag zwemmen wij in het meer.', 'Elke zaterdag zwemmen we in het meer.'], why: 'zwemmen blijft op plek 2.' },
      { kind: 'fix', prompt: 'Tik het foute woord aan en verbeter het.', sentence: 'De leerlingen van deze klas werkt hard.', wrong: 5, answer: 'werken', why: 'Onderwerp: de leerlingen (meervoud).' },
    ] },
    { id: 'z2', domain: 'prag', also: ['syn'], title: 'Volgorde is nadruk', skill: 'Zinsbouw', icon: '!', steps: [
      { kind: 'explain', title: 'Wat vooraan staat, valt op', panels: [
        { text: 'Met dezelfde blokken kun je verschillende zinnen bouwen. Wat op plek 1 staat, krijgt de nadruk.', lab: { label: 'Tik wat vooraan staat', chips: [
          { k: 'ik', out: 'Ik heb dat boek nooit gelezen.', note: 'Neutraal.' }, { k: 'dat boek', out: 'Dat boek heb ik nooit gelezen.', note: 'Nadruk op het boek.' }, { k: 'nooit', out: 'Nooit heb ik dat boek gelezen.', note: 'Dramatisch.' },
        ] } },
      ] },
      { kind: 'write', prompt: 'Schrijf drie zinnen over je ochtend. Begin geen enkele zin met "ik".', minWords: 18, must: [{ label: 'geen zin begint met "ik"', test: /^(?!\s*ik\b)(?![\s\S]*[.!?]\s+ik\b)/i }], why: 'Een ander zinsbegin geeft je tekst ritme.' },
    ] },
    { id: 'z3', domain: 'syn', also: ['orth'], title: 'Leestekens', skill: 'Zinsbouw', icon: '?!', steps: [
      { kind: 'explain', title: 'Het einde zegt wat voor zin het is', panels: [
        { text: 'Het teken aan het eind bepaalt hoe je de zin leest.', lab: { label: 'Tik een teken', chips: [
          { k: '.', out: 'Je komt morgen.', note: 'Mededeling.' }, { k: '?', out: 'Je komt morgen?', note: 'Verbaasde vraag.' }, { k: '!', out: 'Je komt morgen!', note: 'Bevel of blijdschap.' },
        ] } },
        { text: 'Een opsomming krijgt komma’s, maar vóór het laatste "en" niet.', quiz: { q: 'Welke is goed?', options: ['Ik koop brood, kaas, en melk.', 'Ik koop brood, kaas en melk.', 'Ik koop brood kaas en melk.'], answer: 'Ik koop brood, kaas en melk.', why: 'Geen komma vóór en.' } },
      ] },
      { kind: 'rewrite', prompt: 'Zet de leestekens en hoofdletter goed.', source: 'ga je mee naar utrecht', accept: ['Ga je mee naar Utrecht?'], why: 'Hoofdletters + vraagteken.' },
    ] },
  ] },

  { id: 'samen', name: 'De samengestelde zin', icon: '—,—', made: 'zinnen verbonden tot één', color: 'bg-[#ff86d0]', shade: '#cc6ba6', learn: 'Hoofd- en bijzinnen, verbindingswoorden en relaties zoals oorzaak of tegenstelling.', fields: ['syn', 'sem', 'prag'], example: '*Ik lees het boek omdat ik wil leren.*', lessons: [
    { id: 's1', domain: 'sem', also: ['syn'], title: 'Verbindingswoorden', skill: 'Complex', icon: '&', steps: [
      { kind: 'explain', title: 'Twee zinnen, één gedachte', panels: [
        { text: 'Met een voegwoord maak je van twee zinnen één. En, maar, want, of, dus laten de zin met rust. Andere voegwoorden duwen de persoonsvorm naar achteren: dat is een bijzin.', lab: { label: 'Tik een voegwoord', chips: [
          { k: 'want', out: 'Ik bleef thuis, want het regende hard.', note: 'Volgorde blijft.' }, { k: 'omdat', out: 'Ik bleef thuis, omdat het hard regende.', note: 'regende → achteraan.' },
        ] } },
        { text: 'Elk voegwoord is een relatie tussen gedachten.', lab: { label: 'Tik een relatie', chips: [
          { k: 'want', out: 'reden', note: 'Ik eet, want ik heb honger.' }, { k: 'maar', out: 'tegenstelling', note: 'Ik eet, maar heb geen honger.' }, { k: 'dus', out: 'gevolg', note: 'Ik heb honger, dus ik eet.' }, { k: 'hoewel', out: 'toegeving', note: 'Hoewel ik vol zit, eet ik.' },
        ] } },
      ] },
      { kind: 'sort', prompt: 'Met rust of naar achteren?', buckets: ['met rust', 'duwt'], items: [{ t: 'want', b: 0 }, { t: 'omdat', b: 1 }, { t: 'maar', b: 0 }, { t: 'hoewel', b: 1 }, { t: 'dus', b: 0 }, { t: 'terwijl', b: 1 }], why: 'en, maar, want, of, dus: met rust.' },
      { kind: 'rewrite', prompt: 'Verbind met "omdat".', source: 'Ik bleef thuis. Ik was ziek.', accept: ['Ik bleef thuis, omdat ik ziek was.', 'Ik bleef thuis omdat ik ziek was.'], why: 'was schuift naar het eind.' },
    ] },
    { id: 's2', domain: 'syn', also: ['orth'], title: 'De komma', skill: 'Complex', icon: ',', steps: [
      { kind: 'explain', title: 'Waar twee motoren botsen', panels: [
        { text: 'Begint de zin met een bijzin, dan staan er twee persoonsvormen naast elkaar. Daartussen zet je een komma.', quiz: { q: 'Waar hoort de komma?', options: ['Hoewel het regende, ging ik.', 'Hoewel, het regende ging ik.', 'Hoewel het, regende ging ik.'], answer: 'Hoewel het regende, ging ik.', why: 'regende | ging → komma.' } },
      ] },
      { kind: 'rewrite', prompt: 'Zet de komma goed.', source: 'Toen ik thuiskwam lag de kat op de bank.', accept: ['Toen ik thuiskwam, lag de kat op de bank.'], why: 'thuiskwam | lag.' },
      { kind: 'write', prompt: 'Schrijf over iets wat je toch deed, hoewel je geen zin had.', minWords: 20, must: [{ label: 'hoewel', test: any('hoewel') }, { label: 'een komma', test: /,/ }], why: 'Bijzin vooraan → komma.' },
    ] },
    { id: 's3', domain: 'prag', also: ['syn'], title: 'Beleefd vragen', skill: 'Complex', icon: '🙏', steps: [
      { kind: 'explain', title: 'Dezelfde vraag, andere toon', panels: [
        { text: 'Wat je bedoelt is vaak hetzelfde, maar hoe je het bouwt bepaalt hoe het aankomt. Een vraag met zou of kunnen klinkt zachter dan een bevel.', lab: { label: 'Tik een versie', chips: [
          { k: 'bevel', out: 'Stuur het rapport.', note: 'Direct, kan bot overkomen.' }, { k: 'vraag', out: 'Kun je het rapport sturen?', note: 'Vriendelijk.' }, { k: 'zacht', out: 'Zou je het rapport willen sturen, als je tijd hebt?', note: 'Heel beleefd.' },
        ] } },
      ] },
      { kind: 'rewrite', prompt: 'Maak het beleefder met "Zou je".', source: 'Doe de deur dicht.', accept: ['Zou je de deur dicht willen doen?', 'Zou je de deur dicht kunnen doen?', 'Zou je de deur willen dichtdoen?', 'Zou je de deur kunnen dichtdoen?'], why: 'Zou + willen/kunnen verzacht.' },
    ] },
  ] },

  { id: 'alinea', name: 'De alinea', icon: '¶', made: 'zinnen rond één gedachte', color: 'bg-tomato', shade: '#ea2b2b', learn: 'Een hoofdgedachte uitwerken, zinnen verbinden, duidelijk verwijzen en de lezer passende informatie geven.', fields: ['tekst', 'sem', 'prag'], example: 'Enkele samenhangende zinnen over één onderwerp.', lessons: [
    { id: 'a1', domain: 'tekst', also: ['prag'], title: 'Kernzin en opbouw', skill: 'Alinea', icon: '¶', steps: [
      { kind: 'explain', title: 'Eén alinea, één gedachte', panels: [
        { text: 'Een alinea draait om één gedachte. De kernzin zegt welke; de rest legt uit, geeft een voorbeeld en rondt af.', quiz: { q: 'Welke is de beste kernzin?', options: ['Thuiswerken bespaart veel reistijd.', 'Ik werk soms thuis.', 'Er is veel over thuiswerken te zeggen.'], answer: 'Thuiswerken bespaart veel reistijd.', why: 'Eén concrete bewering.' } },
      ] },
      { kind: 'paragraph', prompt: 'Zet de zinnen in de beste volgorde.', parts: [
        { role: 'Kernzin', text: 'Thuiswerken bespaart veel reistijd.' },
        { role: 'Uitleg', text: 'Wie niet hoeft te forenzen, wint al snel een uur per dag.' },
        { role: 'Voorbeeld', text: 'Een Utrechter die in Amsterdam werkt, zit bijvoorbeeld twee uur in de trein.' },
        { role: 'Afronding', text: 'Die tijd kun je beter aan werk of rust besteden.' },
      ], why: 'Kernzin → uitleg → voorbeeld → afronding.' },
    ] },
    { id: 'a2', domain: 'tekst', also: ['sem'], title: 'Draadjes tussen zinnen', skill: 'Alinea', icon: '↩', steps: [
      { kind: 'explain', title: 'Verwijzen maakt samenhang', panels: [
        { text: 'Zinnen in een alinea houden elkaar vast met verwijswoorden: dit, deze, die, zij, daardoor.', mark: { q: 'Tik de verwijswoorden', sentence: 'De minister nam een besluit. Dit besluit was omstreden, maar zij hield eraan vast.', targets: [5, 10, 12], note: 'Dit, zij, eraan.' } },
        { text: 'Let op: het-woord → dit/dat, de-woord → deze/die.', quiz: { q: 'De regering nam een besluit. … besluit was omstreden.', options: ['Dit', 'Deze'], answer: 'Dit', why: 'het besluit → dit.' } },
      ] },
      { kind: 'write', prompt: 'Schrijf een alinea: moet iedereen leren koken? Begin met een kernzin. Hier komt alles samen: letters, woorden, zinnen.', minWords: 50, must: [
        { label: 'een voorbeeld', test: any('bijvoorbeeld', 'zoals') }, { label: 'een voegwoord', test: any('omdat', 'want', 'maar', 'dus', 'hoewel') }, { label: 'een verwijswoord', test: any('dit', 'deze', 'dat', 'die', 'daardoor', 'daarom') },
      ], why: 'Van letter tot alinea.' },
    ] },
  ] },
]

/** Vakgebieden. De vier perspectieven (persp) gebruik je op elke laag; de andere horen bij een deel van de route. */
export const DOMAINS: { id: Domain; name: string; q: string; color: string; persp?: true }[] = [
  { id: 'orth', name: 'Orthografie', q: 'Hoe schrijf je het?', color: '#0e9f9a' },
  { id: 'fon', name: 'Fonologie', q: 'Hoe klinkt het?', color: '#e8577e' },
  { id: 'morf', name: 'Morfologie', q: 'Hoe is dit woord opgebouwd en waarom krijgt het deze vorm?', color: '#58a700', persp: true },
  { id: 'syn', name: 'Syntaxis', q: 'Hoe zijn de woorden en woordgroepen verbonden?', color: '#1899d6', persp: true },
  { id: 'sem', name: 'Semantiek', q: 'Wat betekent deze formulering?', color: '#a568cc', persp: true },
  { id: 'prag', name: 'Pragmatiek', q: 'Wat bedoelt de schrijver hier, in deze situatie, voor deze lezer?', color: '#ff9600', persp: true },
  { id: 'tekst', name: 'Tekstlinguïstiek', q: 'Hoe hangen de zinnen samen?', color: '#5b6b82' },
]

export const LESSONS = LAYERS.flatMap((l) => l.lessons)
export const layerOf = (id: string) => LAYERS.find((l) => l.lessons.some((x) => x.id === id))
