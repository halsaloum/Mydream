import type { StepInput } from '../schema';
import type { LessonUpgrade } from './types';

const choice = (id: string, prompt: string, options: string[], answer: string, why: string): StepInput => ({
  kind: 'choice', id, prompt, before: '', after: '', options, answer, why,
});
const type = (id: string, prompt: string, answer: string, why: string): StepInput => ({
  kind: 'type', id, prompt, before: '', after: '', hint: 'Schrijf je antwoord', answer, why,
});

/** Per les: een aanpak, gerichte oefening en toepassing buiten de oorspronkelijke voorbeelden. */
export const MORPHOLOGY_UPGRADES: Record<string, LessonUpgrade> = {
  d0: {
    guidance: {
      goal: 'Je kunt hetzelfde woord op klank én op betekenis verdelen en uitleggen waarom de grenzen verschillen.',
      startingPoint: 'Je hoeft het woord morfeem nog niet te kennen. Begin met een woord dat je hardop kunt zeggen.',
      strategy: ['Zeg het woord langzaam: de stukjes die je hoort zijn lettergrepen.', 'Vraag daarna wat elk stukje bijdraagt: een ding, een handeling, klein of meer dan één.', 'Controleer de betekenisgrens met een verwant woord: deur, deuren, deurbel.'],
      selfCheck: ['Heb ik aangegeven of ik op klank of op betekenis knip?', 'Kan ik vertellen wat elk betekenisdeel doet, zonder te doen alsof elk klankstukje een betekenis heeft?'],
    },
    steps: [
      {
        kind: 'explain', id: 'toepassen-twee-brillen', title: 'Een grens kiezen met een reden',
        panels: [{
          text: 'Neem *deuren*. Hardop hoor je *deu-ren*. Het stukje *deu* betekent hier niets op zichzelf. Kijk je naar betekenis, dan herken je *deur*: iets dat open en dicht kan. *-en* maakt daarvan meer dan één. Je knipt dan *deur-en*. De opdracht bepaalt welke bril je opzet.',
          split: { q: 'Knip deuren nu op betekenis, dus tussen de deur en de meervoudsuitgang.', word: 'deuren', answer: 'deur-en', note: 'Deur is de herkenbare basis; -en betekent hier meervoud. De lettergreepgrens zou na deu liggen.' },
          rule: 'Een betekenisgrens kun je verdedigen met een verwant woord en de functie van de uitgang.',
        }],
      },
      choice('toepassen-klankgrens', 'Je klapt het woord stoelen in twee lettergrepen. Welke verdeling noteer je?', ['stoe-len', 'stoel-en', 's-toelen'], 'stoe-len', 'Je hoort stoe en len. Stoel + en is ook een nuttige analyse, maar die beschrijft betekenisvolle bouwstenen en beantwoordt dus een andere vraag.'),
      {
        kind: 'sort', id: 'toepassen-doel-van-knippen', prompt: 'Welke vraag probeert deze analyse te beantwoorden?',
        buckets: ['Hoe spreek ik de stukjes uit?', 'Hoe is de betekenis opgebouwd?'],
        items: [{ t: 'ramen → ra-men', b: 0 }, { t: 'raampje → raam + pje', b: 1 }, { t: 'stoelen → stoel + en', b: 1 }, { t: 'water → wa-ter', b: 0 }],
        why: 'Ra-men en wa-ter zijn klankverdelingen. Raam + pje laat verkleining zien; stoel + en laat meervoud zien. Je hoeft water niet in twee betekenisvolle delen te kunnen ontleden omdat het twee lettergrepen heeft.',
      },
      type('transfer-zelf-ontleden', 'Nieuwe context: één vogel, twee vogels. Schrijf de twee betekenisvolle delen van vogels met een koppelteken ertussen.', 'vogel-s', 'Vogel noemt het dier; -s geeft meer dan één aan. Vo-gels zou een klankverdeling zijn. Je gebruikt nu de betekenisproef bij een andere meervoudsuitgang dan -en.'),
      choice('transfer-onbekend-woord', 'Iemand zegt: “Water heeft twee lettergrepen, dus wa en ter betekenen elk iets.” Welke reactie is het sterkst?', ['Twee lettergrepen bewijzen nog geen twee betekenisdelen.', 'Dat klopt: elk uitgesproken stukje is een woorddeel met betekenis.', 'Dat kan niet, want een woord heeft altijd maar één betekenisdeel.'], 'Twee lettergrepen bewijzen nog geen twee betekenisdelen.', 'Klank en betekenis zijn verschillende manieren van analyseren. Je moet betekenis of een grammaticale functie aantonen; alleen een hoorbare grens is daarvoor onvoldoende.'),
    ],
  },
  d1: {
    guidance: {
      goal: 'Je herkent een basis en een uitgang, bouwt eenvoudige woordvormen en controleert de spelling van het geheel.',
      startingPoint: 'Een uitgang is een stukje achter de basis. Hij kan bijvoorbeeld meervoud of verkleining aangeven.',
      strategy: ['Benoem eerst wat moet veranderen: aantal, grootte of de werkwoordsvorm.', 'Kies de uitgang en spreek het nieuwe woord uit.', 'Controleer de geschreven vorm: een extra letter kan nodig zijn, zoals in kammetje.'],
      selfCheck: ['Heeft mijn uitgang de gevraagde functie?', 'Heb ik naar het hele woord geluisterd, in plaats van alleen naar de laatste letter gekeken?'],
    },
    steps: [
      {
        kind: 'explain', id: 'toepassen-vorm-en-functie', title: 'Dezelfde basis, een andere opdracht',
        panels: [{
          text: 'Bij *raam*, *ramen* en *raampje* herken je hetzelfde ding. De vorm verandert voor de opdracht: meer dan één of klein. Voor verkleinwoorden telt de omgeving mee: *raam* wordt *raampje*, maar *kam* wordt *kammetje*. Alleen “het eindigt op m” is dus niet genoeg.',
          build: { before: 'Maak één klein raam:', stem: 'raam', endings: ['pje', 'en', 's'], answer: 'pje', note: 'Raampje is klein. Ramen zou meervoud zijn en heeft bovendien een aangepaste spelling.' },
          lab: { label: 'Vergelijk de verkleinwoorden', chips: [{ k: 'kat', out: 'katje', note: 'Een korte klinker geeft niet automatisch -etje.' }, { k: 'kam', out: 'kammetje', note: 'Hier hoor je een extra onbeklemtoonde e en schrijf je mm.' }, { k: 'raam', out: 'raampje', note: 'Hier komt -pje na de lange klinker en m.' }] },
        }],
      },
      {
        kind: 'sort', id: 'toepassen-functie-uitgang', prompt: 'Wat doet de uitgang in deze vorm?',
        buckets: ['Meer dan één', 'Kleiner maken'],
        items: [{ t: 'tuinen', b: 0 }, { t: 'hutje', b: 1 }, { t: 'bekers', b: 0 }, { t: 'raampje', b: 1 }],
        why: 'Tuinen en bekers geven meervoud aan; hutje en raampje zijn verkleinwoorden. Verschillende uitgangen kunnen dezelfde functie hebben.',
      },
      type('toepassen-verkleinwoord', 'Nieuwe context: in een kleine vaas staat één tulp. Schrijf het gewone verkleinwoord van tulp.', 'tulpje', 'Tulpje krijgt -je na de p. De korte u is op zichzelf geen reden voor -etje. Vergelijk kammetje: de eindklanken en hun omgeving bepalen samen de vorm.'),
      {
        kind: 'highlight', id: 'toepassen-basis-uitgangen', prompt: 'Markeer de basis en de twee uitgangen in hondjes.',
        pens: [{ id: 'basis', label: 'Basis', tag: 'waarover?', ask: 'Welk stukje noemt het dier?', accent: 'blue' }, { id: 'uitgang', label: 'Uitgang', tag: 'wat verandert?', ask: 'Welk stukje geeft klein of meervoud aan?', accent: 'orange' }],
        words: [{ t: 'hond', role: 'basis' }, { t: 'je', role: 'uitgang' }, { t: 's', role: 'uitgang' }],
        done: { title: 'Twee veranderingen', text: 'Hond + je + s: eerst een verkleinwoord, daarna meer dan één. De uitgangen doen elk een andere taak.' },
      },
      choice('transfer-controleer-regel', 'Welke uitleg van pet → petje is betrouwbaar?', ['Hier past -je; de korte e betekent niet dat ieder verkleinwoord -etje krijgt.', 'Na elke korte klinker moet -etje komen: petetje.', 'Een verkleinwoord heeft altijd precies één extra letter.'], 'Hier past -je; de korte e betekent niet dat ieder verkleinwoord -etje krijgt.', 'Petje is de gewone vorm. Vergelijk kammetje: beide hebben een korte klinker, maar hun eindklanken verschillen. Gebruik voorbeeldfamilies en controleer een onbekende vorm.'),
    ],
  },
  d2: {
    guidance: {
      goal: 'Je maakt een samenstelling, vindt de kern en kiest een spelling die past bij de bedoelde betekenis.',
      startingPoint: 'Een samenstelling combineert bouwstenen tot één woord, bijvoorbeeld regen + jas.',
      strategy: ['Omschrijf wat je bedoelt: een jas tegen de regen.', 'Zoek het hoofd: het nieuwe woord noemt een soort jas.', 'Schrijf de delen aaneen en controleer of een tussenletter of koppelteken nodig is.'],
      selfCheck: ['Klopt mijn omschrijving met het laatste deel?', 'Heb ik een echte samenstelling gemaakt en niet willekeurig woorden aan elkaar geschreven?'],
    },
    steps: [
      {
        kind: 'explain', id: 'toepassen-kern-proef', title: 'Eerst de betekenis, dan de spelling',
        panels: [{
          text: 'Een *regenjas* is een jas tegen regen. Een *regenbui* is een bui met regen. De delen staan niet toevallig naast elkaar: het laatste deel noemt bij zulke gewone samenstellingen de soort. *Rode jas* schrijf je los: *rode* beschrijft die jas, zonder dat je een nieuwe samenstelling maakt.',
          lab: { label: 'Onderzoek de kern', chips: [{ k: 'regenjas', out: 'Een soort jas', note: 'Regen zegt waarvoor de jas dient.' }, { k: 'regenbui', out: 'Een soort bui', note: 'Het laatste deel is nu bui.' }, { k: 'rode jas', out: 'Een jas die rood is', note: 'Dit is een woordgroep: het bijvoeglijk naamwoord blijft los.' }] },
        }],
      },
      choice('toepassen-betekenis-kern', 'Wat kun je afleiden uit het gewone woord keukendeur?', ['Het is een deur die bij een keuken hoort.', 'Het is een keuken in de vorm van een deur.', 'Het noemt twee losse voorwerpen zonder verband.'], 'Het is een deur die bij een keuken hoort.', 'Deur is het hoofd. Keuken maakt duidelijk welke deur bedoeld wordt. Dit soort omschrijving helpt je de volgorde van de delen te controleren.'),
      type('toepassen-zelf-samenstellen', 'Een tas voor sport heet een … Schrijf één woord.', 'sporttas', 'Sport + tas wordt sporttas. De tas is het hoofd; sport geeft het gebruik aan. De twee t’s blijven staan omdat beide delen herkenbaar blijven.'),
      {
        kind: 'rewrite', id: 'toepassen-spatie-herstellen', prompt: 'Verbeter alleen de onjuiste spatie in de samenstelling.', source: 'De regen jas hangt naast de rode jas.', accept: ['De regenjas hangt naast de rode jas.'],
        why: 'Regenjas is één samengesteld woord. Rode jas blijft een woordgroep: rood beschrijft hier de jas. Je schrijft dus niet automatisch alle woorden voor jas aaneen.',
      },
      choice('transfer-geen-extra-tussenletter', 'Je kent fiets en het meervoud fietsen. Welke conclusie over fiets + tas klopt?', ['De gewone vorm is fietstas; het meervoud verplicht niet tot fietsen- in elke samenstelling.', 'Het moet altijd fietsentas zijn, want het meervoud is fietsen.', 'Het moet los: fietsen tas.'], 'De gewone vorm is fietstas; het meervoud verplicht niet tot fietsen- in elke samenstelling.', 'Een samenstelling kan zonder tussenklank bestaan. De spellingregels voor -e- of -en- helpen wanneer zo’n tussenklank er is; ze voegen hem niet automatisch aan elke samenstelling toe.'),
    ],
  },
  d3: {
    guidance: {
      goal: 'Je leidt de waarschijnlijke betekenis van een voorvoegsel af en controleert die met de context.',
      startingPoint: 'Een voorvoegsel staat vóór een basis: on- in onveilig of her- in herlezen.',
      strategy: ['Zoek een herkenbare basis die in dit woord betekenis heeft.', 'Probeer een omschrijving: niet, opnieuw of een verandering.', 'Lees de hele zin; dezelfde beginletters zijn niet altijd hetzelfde voorvoegsel.'],
      selfCheck: ['Bestaat mijn basis in deze betekenis?', 'Heb ik een mogelijke betekenis als vaste regel voorgesteld, of de context echt gecontroleerd?'],
    },
    steps: [
      {
        kind: 'explain', id: 'toepassen-voorvoegsel-test', title: 'Herkennen is meer dan letters afknippen',
        panels: [{
          text: '*Onveilig* kun je uitleggen vanuit *veilig*: on- ontkent hier die eigenschap. Bij *onder* kun je niet op dezelfde manier on- weghalen en *der* als de basis gebruiken. Een voorvoegsel herken je aan vorm én functie, niet aan de eerste letters alleen.',
          lab: { label: 'Probeer de betekenisproef', chips: [{ k: 'onveilig', out: 'niet veilig', note: 'On- is hier een herkenbaar voorvoegsel.' }, { k: 'herlezen', out: 'opnieuw lezen', note: 'Her- geeft herhaling aan.' }, { k: 'onder', out: 'Geen analyse on- + der', note: 'Die knip verklaart de betekenis niet.' }] },
        }],
      },
      {
        kind: 'sort', id: 'toepassen-prefix-functie', prompt: 'Welke bijdrage heeft het voorvoegsel in dit woord?',
        buckets: ['Niet de eigenschap', 'Opnieuw uitvoeren', 'Anders maken'],
        items: [{ t: 'onzeker', b: 0 }, { t: 'herdrukken', b: 1 }, { t: 'onzichtbaar', b: 0 }, { t: 'herberekenen', b: 1 }, { t: 'verkleinen', b: 2 }],
        why: 'Onzeker en onzichtbaar ontkennen een eigenschap, herdrukken en herberekenen herhalen een handeling, en verkleinen betekent kleiner maken. Dit zijn analyses van deze woorden, geen onbeperkte plakregels.',
      },
      type('toepassen-nieuwe-context', 'Een technicus moet een computer opnieuw starten. Vorm een werkwoord met her- uit starten.', 'herstarten', 'Her- + starten wordt herstarten: de handeling wordt opnieuw uitgevoerd. Je past het herhalingspatroon toe buiten het voorbeeld herlezen.'),
      choice('toepassen-geen-schijnprefix', 'Bij welk woord verklaart de analyse on- + basis de gewone betekenis?', ['ondiep', 'onder', 'onze'], 'ondiep', 'Ondiep betekent niet diep. Bij onder en onze leveren de letters na on geen passende zelfstandige basis op. Beginletters zijn dus geen voldoende bewijs.'),
      choice('transfer-regel-nuanceren', 'Je leest: “De beveiliger verjaagt een vogel.” Wat doet ver- hier?', ['Het woord betekent wegjagen; ver- betekent niet in elk woord “anders maken”.', 'Het betekent de vogel opnieuw jagen, zoals her-.', 'Het betekent dat de vogel groter wordt.'], 'Het woord betekent wegjagen; ver- betekent niet in elk woord “anders maken”.', 'Verjagen moet je uitleggen in zijn context: iemand of iets doen weggaan. Een voorvoegsel kan meerdere verwante functies hebben. Eén voorbeeld is geen regel voor elk woord.'),
    ],
  },
  d4: {
    guidance: {
      goal: 'Je kiest een verkleinwoord bewust en kunt uitleggen wanneer het warm, verzachtend of kleinerend overkomt.',
      startingPoint: 'Een verkleinwoord zegt soms iets over grootte en soms vooral over de houding van de spreker.',
      strategy: ['Bepaal de situatie: wie spreekt tegen wie en waarover?', 'Vergelijk de zin met en zonder verkleinwoord.', 'Kies de vorm die past bij je bedoeling en controleer hoe de ander hem kan opvatten.'],
      selfCheck: ['Neem ik het werk of probleem van de ander serieus?', 'Baseer ik mijn tooninterpretatie op de context en niet alleen op -je?'],
    },
    steps: [
      {
        kind: 'explain', id: 'toepassen-toon-context', title: 'Dezelfde uitgang, een andere uitwerking',
        panels: [{
          text: 'Een collega werkte drie maanden aan een onderzoek. “Leuk *rapportje*” kan dan kleinerend overkomen, ook al bedoel je het vriendelijk. Aan de koffietafel kan “nog een *kopje*?” juist heel gewoon klinken. De uitgang bepaalt de toon niet in zijn eentje: situatie, relatie en intonatie tellen mee.',
          lab: { label: 'Vergelijk de formuleringen', chips: [{ k: 'waardering', out: 'Je rapport is helder en grondig.', note: 'Je benoemt concreet wat goed is.' }, { k: 'risico', out: 'Best aardig, dat rapportje.', note: 'Best aardig en rapportje kunnen samen de prestatie kleiner maken.' }, { k: 'gastvrij', out: 'Wil je nog een kopje thee?', note: 'Een gewone uitnodiging, zonder oordeel over iemands prestatie.' }] },
        }],
      },
      choice('toepassen-ontvanger', 'Een klant meldt ernstige schade. Welke reactie neemt de melding het duidelijkst serieus?', ['Ik onderzoek de schade en laat u morgen weten wat de volgende stap is.', 'Dat probleempje kijken we later wel na.', 'Ach, een schadetje kan gebeuren.'], 'Ik onderzoek de schade en laat u morgen weten wat de volgende stap is.', 'De eerste zin erkent het probleem en noemt een concrete vervolgstap. Probleempje en schadetje kunnen hier bagatelliseren: de spreker maakt de ernst kleiner dan de klant ervaart.'),
      {
        kind: 'rewrite', id: 'toepassen-neutraal-herschrijven', prompt: 'Vervang uitsluitend de verkleinwoorden door de gewone zelfstandige naamwoorden.', source: 'Dank voor je ideetje in dat verslagje.', accept: ['Dank voor je idee in dat verslag.'],
        why: 'Idee en verslag nemen mogelijke verkleining weg. De rest van de zin blijft gelijk, zodat je gericht kunt vergelijken wat de uitgang met de toon deed.',
      },
      {
        kind: 'swipe', id: 'toepassen-context-beoordelen', prompt: 'Is de conclusie over de toon zorgvuldig?',
        cards: [{ t: '“Slim kereltje” kan waarderend of neerbuigend klinken; de context helpt kiezen.', ok: true, why: 'Dezelfde formulering kan een kind prijzen of een volwassene kleiner maken.' }, { t: 'Elk verkleinwoord maakt een boodschap beleefd.', ok: false, fix: 'Een verkleinwoord kan ook kleinerend of bagatelliserend werken.', why: 'Uit de uitgang alleen volgt geen vaste beleefdheid.' }, { t: 'Bij “een klein ringetje” kan de letterlijke grootte belangrijk zijn.', ok: true, why: 'Niet elk verkleinwoord moet vooral als toon worden uitgelegd.' }],
      },
      {
        kind: 'write', id: 'transfer-waardering-met-reden',
        rubric: {"criteria": ["Ik benoem een concrete kwaliteit van het verslag.", "Ik leg uit waarom die kwaliteit nuttig is voor de lezer.", "Mijn formulering erkent de prestatie en maakt die niet onbedoeld kleiner."], "example": "Je rapport presenteert de onderzoeksresultaten duidelijk. Vooral de vergelijking tussen de twee groepen is nuttig, omdat ik daardoor meteen zie waar het verschil zit. Ook de uitleg van de beperkingen helpt mij de conclusies zorgvuldig te gebruiken."},
        prompt: 'Een collega maakte een uitgebreid onderzoeksverslag. Schrijf een korte reactie die duidelijk waardering uitspreekt.',
        intro: 'Schrijf twee of drie zinnen. Benoem het verslag, noem een concrete kwaliteit en leg uit waarom die kwaliteit nuttig is. De checklist controleert zichtbare onderdelen; beoordeel de toon zelf met de controlevragen.',
        minWords: 25,
        must: [{ label: 'Benoem het verslag.', test: { anyWord: ['verslag', 'onderzoek', 'rapport'] } }, { label: 'Leg uit waarom je het waardeert.', hint: 'omdat, want, daardoor', test: { anyWord: ['omdat', 'want', 'daardoor'] } }],
        avoid: [{ test: { anyWord: ['verslagje', 'rapportje', 'ideetje'] }, tip: 'Kan dit verkleinwoord de prestatie kleiner laten lijken dan je bedoelt?' }],
        why: 'Vergelijk met: “Je rapport maakt de resultaten overzichtelijk. Vooral de vergelijking tussen de groepen helpt, omdat ik daardoor het verschil meteen zie.” Concrete waardering vertelt meer dan alleen “leuk”. Lees je reactie vanuit de collega: voelt het werk erkend?',
      },
    ],
  },
  d5: {
    guidance: {
      goal: 'Je onderscheidt morfeem, zichtbare vorm en vormvariant en onderbouwt een morfologische analyse met vergelijkingsmateriaal.',
      startingPoint: 'Je kunt een basis en een uitgang herkennen. Nu vraag je waarom twee verschillende vormen toch bij dezelfde functie horen.',
      strategy: ['Vergelijk meerdere woorden waarin hetzelfde stukje terugkomt.', 'Benoem de bijdrage: inhoudelijke betekenis of grammaticale functie.', 'Houd de abstracte eenheid (morfeem) apart van de concrete vorm (morf); varianten heten allomorfen.'],
      selfCheck: ['Heb ik bewijs voor de grens uit een woordfamilie?', 'Verwar ik verschil in spelling niet met verschil in functie?'],
    },
    steps: [
      {
        kind: 'sort', id: 'toepassen-vrij-of-gebonden', prompt: 'Kan deze bouwsteen in zijn hier bedoelde functie zelfstandig voorkomen?',
        buckets: ['Vrij morfeem', 'Gebonden morfeem'],
        items: [{ t: 'tuin in tuindeur', b: 0 }, { t: '-heid in eerlijkheid', b: 1 }, { t: 'deur in tuindeur', b: 0 }, { t: 'on- in onecht', b: 1 }],
        why: 'Tuin en deur zijn ook losse woorden. -heid en on- functioneren hier alleen aan een basis vast. Dat je het losse woord on elders zou kunnen aantreffen, zou deze specifieke functie nog niet vrij maken.',
      },
      choice('toepassen-vormvariant', 'Vergelijk bekers en tuinen. Beide uitgangen geven meervoud aan. Welke analyse past?', ['-s en -en zijn hier verschillende vormen van de meervoudsfunctie.', 'Bekers heeft geen meervoud, want het eindigt niet op -en.', 'De uitgang -en is altijd hetzelfde morfeem, ook in werken.'], '-s en -en zijn hier verschillende vormen van de meervoudsfunctie.', 'Dezelfde grammaticale functie kan meer dan één vorm hebben: allomorfie. Omgekeerd bewijst eenzelfde reeks letters niet automatisch dezelfde functie; -en in tuinen en een werkwoordsvorm moet je in zijn eigen context analyseren.'),
      choice('transfer-bewijs-voor-knip', 'Een leerling splitst tafel in ta + fel omdat dat twee lettergrepen zijn. Welk aanvullend bewijs zou voor een morfeemgrens nodig zijn?', ['Een terugkerende betekenis of grammaticale functie van de veronderstelde delen.', 'Een nog langzamere uitspraak van tafel.', 'Het feit dat fel als los woord bestaat, ongeacht de betekenis van tafel.'], 'Een terugkerende betekenis of grammaticale functie van de veronderstelde delen.', 'Een morfologische grens vraagt een functioneel verband. Dat fel toevallig ook een bestaand woord is, maakt tafel nog geen combinatie met de betekenis van fel. Zo voorkom je toevallige letterovereenkomsten als verklaring.'),
      type('transfer-zelf-morfemen', 'Een planning kan niet worden uitgevoerd: zij is onwerkbaar. Knip onwerkbaar in drie betekenisvolle bouwstenen met koppeltekens.', 'on-werk-baar', 'Werk is de werkwoordelijke basis. -baar geeft de mogelijkheid aan; on- ontkent werkbaar als geheel. Je haalt de delen zelf op en koppelt elke grens aan een functie.'),
    ],
  },
  d6: {
    guidance: {
      goal: 'Je onderscheidt woordvorming van grammaticale vormverandering en analyseert de volgorde van beide.',
      startingPoint: 'Afleiding maakt een nieuw woord; buiging levert vormen van hetzelfde woord. Niet elk grensgeval is met één truc te beslissen.',
      strategy: ['Vraag eerst of een nieuw begrip of een nieuw woordenboekwoord ontstaat.', 'Kijk daarna welke vorm de zin verlangt, bijvoorbeeld enkelvoud of meervoud.', 'Analyseer van binnen naar buiten en gebruik meerdere kenmerken bij twijfel.'],
      selfCheck: ['Heb ik woordsoortverandering als aanwijzing gebruikt en niet als verplichte eigenschap van afleiding?', 'Kan ik per stap uitleggen wat verandert: het woord of zijn grammaticale vorm?'],
    },
    steps: [
      {
        kind: 'sort', id: 'toepassen-nieuw-woord-of-vorm', prompt: 'Welke bewerking zie je tussen de twee gegeven vormen?',
        buckets: ['Afleiding: nieuw woord', 'Buiging: grammaticale vorm'],
        items: [{ t: 'eerlijk → oneerlijk', b: 0 }, { t: 'eerlijk → eerlijkheid', b: 0 }, { t: 'fietser → fietsers', b: 1 }, { t: 'werk → werkte', b: 1 }],
        why: 'Oneerlijk blijft een bijvoeglijk naamwoord, maar is wel een nieuw woord: afleiding hoeft de woordsoort niet te veranderen. Meervoud en verleden tijd veranderen de grammaticale vorm.',
      },
      {
        kind: 'highlight', id: 'toepassen-opbouw-fietsers', prompt: 'Analyseer fietsers: welke stap maakt een persoon en welke maakt meervoud?',
        pens: [{ id: 'basis', label: 'Basis', tag: 'handeling', ask: 'Waar begint de afleiding?', accent: 'blue' }, { id: 'afleiding', label: 'Afleiding', tag: 'persoon', ask: 'Welk stukje maakt fietser?', accent: 'purple' }, { id: 'buiging', label: 'Buiging', tag: 'meervoud', ask: 'Welk stukje maakt meer dan één?', accent: 'orange' }],
        words: [{ t: 'fiets', role: 'basis' }, { t: 'er', role: 'afleiding' }, { t: 's', role: 'buiging' }],
        done: { title: 'Van handeling naar groep', text: 'Eerst fiets + er: een persoon die fietst. Daarna fietser + s: meer personen. De buitenste bewerking verbuigt het al afgeleide woord.' },
      },
      choice('transfer-diagnose-woordsoort', 'Iemand noemt onrust geen afleiding: “Rust en onrust zijn allebei zelfstandige naamwoorden.” Waar gaat die redenering mis?', ['Een afleiding kan de woordsoort behouden en toch een nieuw woord maken.', 'Elk zelfstandig naamwoord is eigenlijk buiging.', 'On- is een meervoudsuitgang.'], 'Een afleiding kan de woordsoort behouden en toch een nieuw woord maken.', 'Woordsoortverandering is een sterk signaal wanneer zij optreedt, maar geen noodzakelijke voorwaarde. Rust en onrust verschillen in lexicale betekenis; de zin vraagt niet om onrust als grammaticale vorm van rust.'),
      type('transfer-afleiding-daarna-buiging', 'Nieuwe sport: vorm de persoonsnaam met -er bij roeien en maak die daarna meervoud. De club zoekt drie … Typ het hele woord.', 'roeiers', 'Roei + er maakt roeier: een persoon, dus afleiding. De buitenste -s maakt daarvan meer personen: buiging. Je bouwt de vorm bij een andere basis dan fiets.'),
    ],
  },
  d7: {
    guidance: {
      goal: 'Je vindt het hoofd van een woord, gebruikt het voor woordsoort en lidwoord en herkent de grenzen van die vuistregel.',
      startingPoint: 'Het hoofd levert belangrijke eigenschappen aan het geheel. Bij gewone Nederlandse samenstellingen staat het vaak rechts.',
      strategy: ['Parafraseer het woord met “een soort …”.', 'Vergelijk het rechterdeel op betekenis, lidwoord en meervoud.', 'Controleer bekende uitzonderingen en leenconstructies; rechts is een patroon, geen bewijs zonder meer.'],
      selfCheck: ['Heb ik meer gecontroleerd dan alleen de positie?', 'Kan ik een uitzondering als uitzondering uitleggen zonder alle gewone gevallen te verwerpen?'],
    },
    steps: [
      choice('toepassen-hoofd-eigenschappen', 'Speelgoedwinkel: welk hoofd voorspelt het lidwoord en het gewone meervoud?', ['winkel: de speelgoedwinkel, speelgoedwinkels', 'speelgoed: het speelgoedwinkel, speelgoedwinkelen', 'speel: de speelgoedwinkel, speelgoedwinkel'], 'winkel: de speelgoedwinkel, speelgoedwinkels', 'Een speelgoedwinkel is een winkel. Het rechterdeel geeft hier zowel het lidwoord de als de meervoudsvorm winkels door. Speelgoed vertelt wat de winkel verkoopt.'),
      {
        kind: 'sort', id: 'toepassen-lidwoord-doorgeven', prompt: 'Kies het lidwoord op grond van het hoofd. De basiswoorden staan erbij.',
        buckets: ['de', 'het'],
        items: [{ t: 'sporttas — de tas', b: 0 }, { t: 'tuinhuis — het huis', b: 1 }, { t: 'broodmes — het mes', b: 1 }, { t: 'zomerjas — de jas', b: 0 }],
        why: 'Het hoofd staat in deze vier samenstellingen rechts. Het eerste deel beperkt de betekenis, maar bepaalt hier niet het lidwoord.',
      },
      choice('transfer-uitzondering-benutten', 'Je vindt het woord het ogenblik, terwijl het losse blik in de betekenis “kijk” de heeft. Wat doe je met die waarneming?', ['Ik onthoud het lidwoord van het geheel en beperk de vuistregel: overerving is niet uitzonderingsloos.', 'Ik verander ogenblik in de ogenblik, want de regel gaat boven het gebruik.', 'Ik concludeer dat geen enkele samenstelling een hoofd heeft.'], 'Ik onthoud het lidwoord van het geheel en beperk de vuistregel: overerving is niet uitzonderingsloos.', 'Een uitzondering weerlegt een absolute formulering, maar maakt het gewone patroon niet waardeloos. Woordsoort, meervoud en lidwoord hoeven bovendien niet in elk woord precies hetzelfde overervingspatroon te volgen.'),
      type('transfer-hoofd-in-bericht', 'Je kent het rek en de krant. Maak krant + rek met de gangbare tussenklank tot één woord. Voeg het juiste enkelvoudige lidwoord toe: …', 'het krantenrek', 'Een krantenrek is een rek. Daarom geeft rek het lidwoord het door; het lidwoord van krant beslist niet. De gevestigde verbindingsvorm is kranten-.'),
    ],
  },
  d8: {
    guidance: {
      goal: 'Je bouwt een woordboom van binnen naar buiten en koppelt een verschil in structuur aan een verschil in betekenis.',
      startingPoint: 'Een boom geeft aan welke delen eerst samengaan. Een rijtje losse stukjes laat die volgorde nog niet zien.',
      strategy: ['Schrijf eerst in gewone taal wat het woord in deze context betekent.', 'Zoek de kleinste combinatie die die betekenis ondersteunt.', 'Bouw naar buiten en controleer bij elke knoop wat de nieuwe eenheid betekent.'],
      selfCheck: ['Ondersteunt elke tussenstap mijn bedoelde lezing?', 'Heb ik twee verschillende lezingen uitgelegd voordat ik twee bomen claim?'],
    },
    steps: [
      {
        kind: 'explain', id: 'toepassen-boom-tuindeur', title: 'Bouwen vanuit een omschrijving',
        panels: [{ text: 'Een *tuindeursleutel* is in deze context een sleutel van een tuindeur. Daarom vormen *tuin* en *deur* eerst samen één bouwsteen. Dat is een inhoudelijke keuze: je begint niet automatisch bij de twee delen die toevallig bekend lijken.',
          bracket: { q: 'Bouw een sleutel van de tuindeur.', tree: '[[tuin deur] sleutel]', nodes: [{ w: 'tuindeur', cat: 'zelfstandig naamwoord', note: 'Eerst de deur die bij de tuin hoort.' }, { w: 'tuindeursleutel', cat: 'zelfstandig naamwoord', note: 'Daarna de sleutel van die tuindeur.' }], traps: [{ w: 'deursleutel', note: 'Dat is een bestaand woord, maar de gegeven omschrijving groepeert tuindeur eerst.' }], note: 'De boom legt hier de bedoelde relatie vast: [[tuin deur] sleutel].' },
        }],
      },
      choice('toepassen-bereik-on', 'Welke opbouw geeft “niet oplosbaar” weer in onoplosbaar?', ['on- wordt toegevoegd aan oplosbaar.', '-baar wordt toegevoegd aan onoplos, alsof dat een werkwoord is.', 'on- en op- betekenen precies hetzelfde.'], 'on- wordt toegevoegd aan oplosbaar.', 'De ontkenning heeft bereik over het geheel oplosbaar. De opbouw is oplossen → oplosbaar → onoplosbaar. Het stukje onoplos is hier geen bestaande werkwoordbasis. Niet alleen de stukjes maar ook hun hiërarchie bepalen de lezing.'),
      choice('transfer-twee-lezingen', 'Een advertentie gebruikt een woord met twee mogelijke structuren. Wat helpt de lezer het meest?', ['Een omschrijving die aangeeft welke delen bij elkaar horen.', 'Alleen zeggen hoeveel letters het woord heeft.', 'Beweren dat de kortste boom altijd de juiste is.'], 'Een omschrijving die aangeeft welke delen bij elkaar horen.', 'Structuur is een hypothese over betekenis. Met een parafrase, bijvoorbeeld “een sleutel van de tuindeur”, maak je de bedoelde relatie controleerbaar. Het aantal letters beslist de groepering niet.'),
      type('transfer-bereik-zelf-preciseren', 'Gebruik de bouwstenen zomer, regen en jas voor “een jas tegen de zomerregen”. Noteer de bedoelde boom in haakjesschrift: één spatie tussen bouwstenen, geen koppelteken.', '[[zomer regen] jas]', 'Zomer en regen vormen eerst zomerregen: dat is waartegen de jas beschermt. Daarna komt jas als hoofd. [zomer [regen jas]] zou eerst regenjas groeperen en de jas bijvoorbeeld aan het seizoen verbinden. De gegeven omschrijving bepaalt hier je keuze.'),
    ],
  },
  d9: {
    guidance: {
      goal: 'Je ontleedt langere samenstellingen en maakt de relatie tussen de delen expliciet, zonder meer af te leiden dan het woord zegt.',
      startingPoint: 'Je kent het hoofd en kunt twee delen combineren. Nu onderzoek je welke relatie tussen die delen bedoeld is.',
      strategy: ['Zoek het hoofd en beschrijf welk soort ding of persoon genoemd wordt.', 'Werk de relatie uit: gemaakt van, bedoeld voor, afkomstig van of iets anders.', 'Gebruik context bij meerdere mogelijke lezingen en schrijf zo nodig een omschrijving.'],
      selfCheck: ['Heb ik de relatie uitgelegd in plaats van de delen alleen herhaald?', 'Kan een andere context dezelfde samenstelling een andere lezing geven?'],
    },
    steps: [
      {
        kind: 'sort', id: 'toepassen-relaties-tussen-delen', prompt: 'Welke relatie is in deze gewone lezing bedoeld?',
        buckets: ['Gemaakt van', 'Bedoeld voor', 'Afkomstig uit'],
        items: [{ t: 'glasplaat: een plaat van glas', b: 0 }, { t: 'slaapkamer: een kamer om te slapen', b: 1 }, { t: 'bergwater: water uit de bergen', b: 2 }, { t: 'ijsbeeld: een beeld van ijs', b: 0 }],
        why: 'Dezelfde bouwvorm, zelfstandig naamwoord plus zelfstandig naamwoord, kan verschillende relaties uitdrukken. Woordbouw alleen vult die relatie niet steeds volledig in; kennis en context helpen.',
      },
      choice('toepassen-context-bepaalt', 'In een handleiding staat printertafel. Wat volgt uit dat woord op zichzelf het duidelijkst?', ['Het is een tafel met een relatie tot een printer; de precieze inrichting vraagt context.', 'De tafel moet van hetzelfde materiaal als de printer zijn.', 'Er staat noodzakelijk precies één printer op.'], 'Het is een tafel met een relatie tot een printer; de precieze inrichting vraagt context.', 'Tafel is het hoofd. De meest gewone lezing is een tafel voor een printer, maar aantallen en materiaal liggen niet vast. Een plausibele verwachting is niet hetzelfde als een betekenisgarantie.'),
      {
        kind: 'write', id: 'transfer-eigen-samenstelling',
        rubric: {"criteria": ["Ik leg uit dat een opvangbak een soort bak is.", "Ik beschrijf regenwater als het water dat wordt opgevangen.", "Ik presenteer extra eigenschappen hoogstens als voorbeeld, niet als noodzakelijke betekenis."], "example": "Een regenwateropvangbak is een bak waarin je water van de regen verzamelt. Het woord noemt dus zowel het ding als wat ermee wordt opgevangen. De bak kan bijvoorbeeld onder een afvoer staan, maar zijn kleur en inhoudsmaat kun je niet uit de naam afleiden."},
        prompt: 'Je schrijft voor iemand die het woord regenwateropvangbak niet kent. Leg het woord in drie korte zinnen uit.',
        intro: 'Noem de kern, leg uit welk water wordt opgevangen en beschrijf het doel. Schrijf geen eigenschappen erbij die het woord niet garandeert, zoals een vaste kleur of inhoudsmaat.', minWords: 30,
        must: [{ label: 'Benoem de kern: bak.', test: { anyWord: ['bak'] } }, { label: 'Leg regenwater uit.', test: { anyWord: ['regen', 'regenwater'] } }, { label: 'Benoem het doel of de handeling.', test: { anyWord: ['opvangen', 'opvangt', 'verzamelen', 'verzamelt'] } }],
        why: 'Een mogelijke uitleg: “Het is een bak waarin je water opvangt. Dat water is afkomstig van regen. De bak kan bijvoorbeeld onder een afvoer staan, maar de naam vertelt niet welk materiaal of welke kleur de bak heeft.” Bak is de kern; regenwater is wat wordt opgevangen. De checklist signaleert onderdelen, maar bewijst niet dat je uitleg inhoudelijk klopt.',
      },
    ],
  },
  d10: {
    guidance: {
      goal: 'Je kiest tussen -e-, -en-, -s- en geen tussenletter en kunt uitleggen waarom een meervoud geen automatische plakopdracht is.',
      startingPoint: 'Een tussenklank verbindt delen in sommige samenstellingen. Niet elke samenstelling heeft er één.',
      strategy: ['Bepaal de gebruikelijke samenstelling: hoor of ken je een tussenklank?', 'Bij een onbeklemtoonde e controleer je de meervoudsregel en de uitzonderingen voor de tussen-n.', 'Bij een tussen-s gebruik je uitspraak, woordfamilie en bij twijfel een gezaghebbend woordenboek.'],
      selfCheck: ['Heb ik een tussenklank verzonnen uitsluitend omdat het eerste woord een meervoud op -en heeft?', 'Kan ik regel, uitzondering en opgeslagen woordgebruik uit elkaar houden?'],
    },
    steps: [
      choice('toepassen-niet-automatisch-en', 'Je kent hond → honden. Welke redenering over hondenhok en hondsdol klopt?', ['Het meervoud helpt bij de tussen-n, maar bepaalt niet voor elke samenstelling dezelfde verbindingsvorm.', 'Elk woord met hond moet beginnen met honden-.', 'Hondenhok is fout omdat het hok ook van één hond kan zijn.'], 'Het meervoud helpt bij de tussen-n, maar bepaalt niet voor elke samenstelling dezelfde verbindingsvorm.', 'De vorm van een bestaande combinatie telt mee. De tussen-n in hondenhok drukt niet noodzakelijk meerdere honden uit. Hondsdol laat zien dat je uit honden geen algemene verplichting tot honden- kunt afleiden.'),
      {
        kind: 'proofread', id: 'toepassen-redactie-tussenletters', prompt: 'Verbeter de twee verkeerd gespelde samenstellingen.', intro: 'Eén woord met een tussenklank is al goed. Laat dat staan.',
        tokens: [{ t: 'Een' }, { t: 'paardebloem', fix: 'paardenbloem', why: 'Paard heeft het gewone meervoud paarden; in paardenbloem schrijf je de tussen-n.' }, { t: 'ligt' }, { t: 'naast' }, { t: 'de' }, { t: 'dorpsstraat.' }, { t: 'De' }, { t: 'kattebak', fix: 'kattenbak', why: 'Kat heeft het meervoud katten: de gewone samenstelling is kattenbak.' }, { t: 'is' }, { t: 'schoon.' }],
        done: { title: 'Vorm en betekenis gescheiden', text: 'Paardenbloem en kattenbak krijgen een n. Dorpsstraat was goed: dorp + s + straat heeft twee s’en. Het aantal paarden, katten of dorpen in de situatie beslist deze spelling niet.' },
      },
      choice('transfer-onbekende-samenstelling', 'Je twijfelt over de tussen-s in een nieuwe vakterm. Welke aanpak is het zorgvuldigst?', ['Zoek vergelijkbare samenstellingen met hetzelfde eerste deel en controleer het gevestigde gebruik.', 'Zet na elk woord op de letters ing altijd een s.', 'Laat alle tussenletters weg, want alleen de basiswoorden hebben betekenis.'], 'Zoek vergelijkbare samenstellingen met hetzelfde eerste deel en controleer het gevestigde gebruik.', 'Familiepatronen geven aanwijzingen, maar zijn geen foutloze berekening. De letters ing bewijzen bovendien niet dat -ing een achtervoegsel is. Bij vaktermen kan het gebruik binnen het vak doorslaggevend zijn.'),
      type('transfer-tussenletter-zelf', 'Nieuwe context: de gemeente zet een bank aan het plein van het dorp. Schrijf de gewone samenstelling van dorp + plein.', 'dorpsplein', 'De gevestigde vorm is dorpsplein, met tussen-s. Dorp heeft meervoud dorpen, maar dat maakt dorpenplein niet automatisch de juiste vorm. De keuze van de verbindingsvorm en de spelling van een aanwezige tussen-e zijn verschillende vragen.'),
    ],
  },
  d11: {
    guidance: {
      goal: 'Je voorspelt met welke basis een achtervoegsel kan combineren en onderscheidt een begrijpelijke nieuwvorming van een gevestigd woord.',
      startingPoint: 'Een affix is een voor- of achtervoegsel. Selectie betekent dat zo’n stukje niet zomaar aan elke basis past.',
      strategy: ['Bepaal de woordsoort en betekenis van de basis.', 'Controleer welke soort basis het affix in dit patroon vraagt.', 'Vergelijk bestaande woorden en houd rekening met uitzonderingen, concurrenten en conventies.'],
      selfCheck: ['Heb ik uitgelegd wat mijn afleiding betekent?', 'Verwar ik “begrijpelijk gevormd” niet met “de gebruikelijke vorm”?'],
    },
    steps: [
      choice('toepassen-baar-betekenis', 'Welke omschrijving maakt duidelijk waarom opvouwbaar bij deze stoel past?', ['De stoel kan worden opgevouwen.', 'De stoel vouwt andere dingen op.', 'De stoel is al opgevouwen en kan nooit meer open.'], 'De stoel kan worden opgevouwen.', 'In dit productieve -baar-patroon is de basis een handeling die op de stoel kan worden uitgevoerd. Mogelijkheid is niet hetzelfde als een al afgeronde gebeurtenis.'),
      type('toepassen-zelf-afleiden', 'Een verpakking kan worden gerecycled. Gebruik de basis recycle en voeg -baar toe. Typ het hele bijvoeglijke naamwoord.', 'recyclebaar', 'Recyclebaar betekent dat de verpakking kan worden gerecycled. Bij het ook gebruikte werkwoord recycleren hoort recycleerbaar. Deze opdracht noemt recycle als basis, zodat één passende vorm wordt gevraagd. -baar drukt mogelijkheid uit, geen bewijs dat de recycling plaatsvindt.'),
      {
        kind: 'swipe', id: 'transfer-selectie-geen-automaat', prompt: 'Beoordeel de redenering over een nieuw woord.',
        cards: [{ t: 'Als een nieuw woord een bekend patroon volgt, is het daardoor meteen de gebruikelijkste benaming.', ok: false, fix: 'Een passend patroon maakt een woord mogelijk of begrijpelijk; gebruik en concurrentie bepalen of het ingeburgerd raakt.', why: 'Een bestaand woord kan een nieuwvorming verdringen. Vormbaarheid en gangbaarheid zijn verschillende vragen.' }, { t: 'Bij drinkbaar past de omschrijving “kan gedronken worden”.', ok: true, why: 'Dit laat zowel de betekenis als de relatie met het werkwoord zien.' }, { t: 'Als één -baar-woord niet bij de productieve hoofdregel past, bestaan er geen patronen.', ok: false, fix: 'Een patroon kan productief zijn en toch oudere of afzonderlijk opgeslagen uitzonderingen hebben.', why: 'Een uitzondering vraagt een beperktere regel, niet het opgeven van elke regelmaat.' }],
      },
    ],
  },
  d12: {
    guidance: {
      goal: 'Je herkent stamvarianten, onderscheidt spelling van klankverandering en controleert onvoorspelbare vormen per woord.',
      startingPoint: 'Allomorfen zijn verschillende vormen van één morfeem. De keuze kan door klankomgeving, grammatica of het specifieke woord komen.',
      strategy: ['Leg verwante vormen naast elkaar en benoem precies wat verandert.', 'Controleer of dezelfde verandering bij vergelijkbare woorden optreedt.', 'Bewaar een vorm als woordkennis als de context hem niet betrouwbaar voorspelt.'],
      selfCheck: ['Beschrijf ik een verschil in letters, in klanken of allebei?', 'Heb ik één woordfamilie ten onrechte tot regel voor de hele taal gemaakt?'],
    },
    steps: [
      {
        kind: 'sort', id: 'toepassen-aard-van-verschil', prompt: 'Wat verandert vooral tussen deze geschreven vormen?',
        buckets: ['Alleen de spelling van dezelfde lange klinker', 'Ook de klinkerkwaliteit of -lengte', 'Een sterk afwijkende stam'],
        items: [{ t: 'raam → ramen', b: 0 }, { t: 'schip → schepen', b: 1 }, { t: 'goed → beter', b: 2 }, { t: 'boom → bomen', b: 0 }],
        why: 'In raam/ramen en boom/bomen blijft de lange klinker in de standaarduitspraak behouden; de open lettergreep verandert de spelling. Schip/schepen heeft ook een klinkerwissel. Goed/beter laat suppletie zien: sterk verschillende stammen in één paradigma.',
      },
      type('toepassen-stem-klank', 'Vul de verleden tijd in: Gisteren … de schilder de hele muur. Gebruik verven.', 'verfde', 'Je schrijft de stam verf met f, maar in verven hoor je de stemhebbende v. Daarom krijgt de zwakke verleden tijd -de: verfde. Alleen naar de laatste geschreven stamletter kijken geeft hier de verkeerde voorspelling.'),
      choice('transfer-voorspelling-toetsen', 'Je kent schip → schepen en tip → tips. Wat kun je daarmee verantwoord voorspellen voor een nieuw woord op ip?', ['De letters ip alleen bepalen de meervoudsvorm niet; ik heb meer informatie of gebruiksgegevens nodig.', 'Elk woord op ip krijgt een meervoud op epen.', 'Schip moet eigenlijk schippen zijn omdat tip geen klinkerwissel heeft.'], 'De letters ip alleen bepalen de meervoudsvorm niet; ik heb meer informatie of gebruiksgegevens nodig.', 'Stamwissels kunnen lexicaal vastliggen: ze horen bij een specifiek woord. Een klankpatroon is pas een betrouwbare productieve regel als vergelijkingsmateriaal dat ondersteunt.'),
    ],
  },
  d13: {
    guidance: {
      goal: 'Je vergelijkt drie manieren om woordvormen te beschrijven en kiest per probleem welke informatie elk model zichtbaar maakt.',
      startingPoint: 'Een paradigma is een tabel met de grammaticale vormen van één woord. Een model beschrijft patronen; het is niet het patroon zelf.',
      strategy: ['Beschrijf de waarneming eerst zonder theorie: welke vorm staat in welke context?', 'Vraag of losse delen, een bewerking of een tabel met cellen het relevante verband het duidelijkst maakt.', 'Scheid een nuttige beschrijving van bewijs dat slechts één theorie mogelijk is.'],
      selfCheck: ['Heb ik zowel vorm als grammaticale context genoemd?', 'Maak ik van een passend voorbeeld geen onterecht bewijs tegen elk ander model?'],
    },
    steps: [
      {
        kind: 'sort', id: 'toepassen-model-en-vraag', prompt: 'Welke beschrijvingswijze staat centraal in deze analyse?',
        buckets: ['Delen naast elkaar', 'Bewerking van een basis', 'Vorm in een paradigma'],
        items: [{ t: 'We ontleden speelsters als speel + ster + s.', b: 0 }, { t: 'We beschrijven zing → zong als klinkervervanging.', b: 1 }, { t: 'We noteren dat wij, jullie en zij in de tegenwoordige tijd werken krijgen.', b: 2 }, { t: 'We tonen per persoon welke vorm van zijn hoort: ben, bent of is.', b: 2 }],
        why: 'De eerste analyse ordent bouwstenen; de tweede beschrijft een proces; de laatste twee organiseren hele vormen in grammaticale cellen. Andere modellen kunnen dezelfde gegevens ook analyseren, maar leggen andere accenten.',
      },
      choice('toepassen-syncretisme', 'In de verleden tijd zeg je ik werkte, jij werkte en zij werkte. Wat toont dit?', ['Verschillende persoonscellen kunnen dezelfde vorm delen: syncretisme.', 'De drie onderwerpen betekenen hetzelfde.', 'Werkte heeft drie verschillende uitgangen omdat er drie onderwerpen zijn.'], 'Verschillende persoonscellen kunnen dezelfde vorm delen: syncretisme.', 'De grammaticale kenmerken verschillen, terwijl de uitgesproken en geschreven werkwoordsvorm gelijk blijft. Syncretisme gaat over die samenval van vormen, niet over identieke betekenissen van onderwerpen.'),
      choice('transfer-model-evalueren', 'Een onderzoeker beschrijft nam als een bewerking van neem. Is daarmee bewezen dat sprekers die vorm nooit opslaan?', ['Nee: een taalkundige beschrijving bewijst niet vanzelf hoe verwerking in het geheugen verloopt.', 'Ja: als je een bewerking kunt opschrijven, kan er geen geheugenrepresentatie zijn.', 'Ja: korte woorden worden nooit onthouden.'], 'Nee: een taalkundige beschrijving bewijst niet vanzelf hoe verwerking in het geheugen verloopt.', 'Modelleerbaarheid en mentale verwerking zijn verschillende onderzoeksvragen. Voor verwerking heb je bijvoorbeeld zorgvuldig gecontroleerde reactietijden, foutenpatronen of andere experimentele gegevens nodig.'),
      type('transfer-paradigma-zelf-aanvullen', 'Vul de ontbrekende vorm van zijn in zonder de tabel te bekijken: ik ben, jij bent, zij … Eén persoon, tegenwoordige tijd.', 'is', 'Zij is vult de derde persoon enkelvoud van het paradigma. De functie is voorspelbaar, maar de vorm is niet eenvoudig ben met een uitgang. Een tabel van hele vormen maakt dat zichtbaar.'),
    ],
  },
  d14: {
    guidance: {
      goal: 'Je gebruikt verschillen in klemtoon en woordbouw om lagen te onderzoeken en herkent wanneer vorm en betekenis niet eenvoudig op dezelfde boom passen.',
      startingPoint: 'Geleerde affixen komen vaak uit het Latijn of Frans. Hun gedrag vertoont patronen, maar niet ieder affix gedraagt zich hetzelfde.',
      strategy: ['Vergelijk een basis met een afleiding en markeer de klemtoon.', 'Controleer meerdere voorbeelden voordat je een grens tussen lagen vastlegt.', 'Maak bij een haakjesparadox apart zichtbaar hoe de vorm en hoe de betekenis opgebouwd zijn.'],
      selfCheck: ['Heb ik een tendens niet veranderd in een uitzonderingsloos verbod?', 'Kunnen mijn vormanalyse en betekenisomschrijving elk afzonderlijk worden gecontroleerd?'],
    },
    steps: [
      {
        kind: 'sort', id: 'toepassen-klemtoon-waarnemen', prompt: 'Wat gebeurt in deze weergegeven uitspraak? Hoofdletters markeren de beklemtoonde lettergreep.',
        buckets: ['Klemtoon blijft bij de basis', 'Klemtoon verschuift'],
        items: [{ t: 'ZE-ker → ZE-ker-heid', b: 0 }, { t: 'ac-TIEF → ac-ti-vi-TEIT', b: 1 }, { t: 'VRIEN-de-lijk → VRIEN-de-lijk-heid', b: 0 }, { t: 'mu-ZIEK → mu-zi-KAAL', b: 1 }],
        why: 'Je classificeert eerst de waarneembare klemtoon. -heid laat hem in deze voorbeelden staan; -iteit en -aal gaan hier samen met verschuiving. Dat is materiaal voor een analyse, geen bewijs dat alle affixen uit dezelfde herkomst identiek werken.',
      },
      choice('toepassen-betekenisstructuur', 'Een langharige hond is een hond met lange haren. Welke analyse verklaart waarom alleen “lang + harig” onvoldoende is als betekenisomschrijving?', ['Lang slaat in de bedoelde lezing op de haren, niet op de lengte van de hond.', 'Lang slaat noodzakelijk op de leeftijd van de hond.', 'Harig betekent dat de hond lang is.'], 'Lang slaat in de bedoelde lezing op de haren, niet op de lengte van de hond.', 'De betekenisrelatie is “lange haren hebben”. Zulke vormen laten zien waarom je naast een formele ontleding ook het bereik van woorden moet beschrijven. Een opgesplitste letterreeks is nog geen volledige semantische analyse.'),
      choice('transfer-tegenvoorbeeld', 'Een theorie verbiedt een geleerd achtervoegsel bij elke inheemse basis. Je vindt een betrouwbaar ingeburgerd tegenvoorbeeld. Wat is de beste volgende stap?', ['Controleer de analyse van het voorbeeld en beperk of herzie daarna het absolute verbod.', 'Verklaar het woord fout omdat de theorie het verbiedt.', 'Concludeer zonder verder onderzoek dat herkomst nergens invloed op heeft.'], 'Controleer de analyse van het voorbeeld en beperk of herzie daarna het absolute verbod.', 'Een werkelijk tegenvoorbeeld is relevant voor een absolute claim. Het weerlegt niet automatisch iedere beperktere generalisatie over herkomst, register of productiviteit. Controleer eerst of de vermeende basis en het affix correct zijn geanalyseerd.'),
      { kind: 'rewrite', id: 'transfer-betekenisbereik-herschrijven', prompt: 'Maak expliciet dat lang over de haren gaat. Begin met “Een hond”, vervang “langharige” door “met lange haren” en behoud “loopt langs”.', source: 'Een langharige hond loopt langs.', accept: ['Een hond met lange haren loopt langs.'], why: 'Lange haren geeft de bedoelde betekenisstructuur weer. Dat hoeft geen letterlijke afleidingsvolgorde te bewijzen: vormbouw en betekenisbereik zijn afzonderlijke vragen.' },
    ],
  },
  d15: {
    guidance: {
      goal: 'Je berekent een productiviteitsmaat en beoordeelt of de gegevens een vergelijking of conclusie werkelijk dragen.',
      startingPoint: 'Een corpus is een verzameling teksten. Een hapax is daarin een woordtype dat precies één keer voorkomt; N telt de voorkomens binnen het onderzochte patroon.',
      strategy: ['Leg eerst vast welke woorden bij het patroon horen en welke teksten je telt.', 'Bereken P als het aantal hapaxen gedeeld door alle voorkomens van dat patroon.', 'Controleer omvang, genre, dubbeltellingen en meetonzekerheid voordat je patronen vergelijkt.'],
      selfCheck: ['Heb ik woorden als verschillende typen niet verward met alle voorkomens?', 'Zegt mijn conclusie alleen iets over deze data, of claim ik ongemerkt een tijdloze wet?'],
    },
    steps: [
      type('toepassen-productiviteit-rekenen', 'Een affix heeft 750 voorkomens, waarvan 30 woordtypen precies eenmaal voorkomen. Bereken P en schrijf een decimaal met een komma.', '0,04', 'P = 30 / 750 = 0,04. De teller bevat de hapaxen binnen het patroon; de noemer bevat alle voorkomens van dat patroon, dus niet alleen het aantal verschillende woorden.'),
      choice('toepassen-eerlijke-vergelijking', 'Affix A is gemeten in 50 romans, affix B in 50 technische handleidingen. Hun P verschilt. Welke conclusie is verantwoord?', ['Genre kan het verschil mede verklaren; vergelijk ook binnen hetzelfde soort materiaal.', 'Het aantal boeken is gelijk, dus elk verschil bewijst een eigenschap van het affix.', 'Technische teksten mogen nooit voor taalonderzoek worden gebruikt.'], 'Genre kan het verschil mede verklaren; vergelijk ook binnen hetzelfde soort materiaal.', 'Een gelijk aantal documenten garandeert geen gelijke aantallen woorden of gelijke vormingsbehoeften. Een gecontroleerde vergelijking houdt rekening met corpusomvang en genre en rapporteert de beperkingen.'),
      {
        kind: 'write', id: 'transfer-onderzoek-concluderen',
        rubric: {"criteria": ["Ik bereken P van A als 25/500 = 0,05 en P van B als 10/500 = 0,02.", "Ik beperk de vergelijking tot deze steekproef en deze productiviteitsmaat.", "Ik noem een relevante reden om de conclusie met meer gegevens te toetsen."], "example": "In dit corpus heeft A een P van 0,05 en B een P van 0,02. Bij dezelfde N en hetzelfde soort tekst heeft A dus het grotere aandeel hapaxen. Dat ondersteunt in deze steekproef de verwachting van grotere potentiële productiviteit. Toch is meer onderzoek nodig: een ander genre of een andere periode kan andere verhoudingen laten zien. Ook wil ik controleren of de selectie van de woorden en de telling van hapaxen betrouwbaar zijn."},
        prompt: 'Schrijf een onderzoeksconclusie bij deze verzonnen gegevens: in hetzelfde soort tekst en bij N = 500 heeft affix A 25 hapaxen en affix B 10.',
        intro: 'Noem beide P-waarden, formuleer een beperkte conclusie voor deze steekproef en noem één reden om meer gegevens te verzamelen.', minWords: 40,
        must: [{ label: 'Noem P van A: 0,05.', test: { pattern: '0[,.]05' } }, { label: 'Noem P van B: 0,02.', test: { pattern: '0[,.]02' } }, { label: 'Beperk de conclusie tot de gegevens.', test: { anyWord: ['steekproef', 'corpus', 'gegevens', 'materiaal'] } }, { label: 'Benoem een beperking of vervolgstap.', test: { anyWord: ['maar', 'toch', 'onzeker', 'vervolgonderzoek', 'meer'] } }],
        why: 'A heeft P = 0,05 en B P = 0,02. In deze gecontroleerde steekproef heeft A een groter aandeel hapaxen. Dat is aanwijzing voor grotere potentiële productiviteit, geen bewijs dat A in elk genre of elke periode productiever is. De checklist controleert zichtbare elementen; controleer zelf of de getallen en conclusie logisch verbonden zijn.',
      },
    ],
  },
  d16: {
    guidance: {
      goal: 'Je herkent hoe klemtoon en lettergreepstructuur woordvorming sturen en maakt onderscheid tussen een voorkeur en een harde eis.',
      startingPoint: 'Prosodie gaat over onder meer klemtoon en ritme. Een trochee is een sterke lettergreep gevolgd door een zwakke.',
      strategy: ['Spreek de vorm uit en markeer de sterke en zwakke lettergrepen.', 'Vergelijk de lengte en het ritme van bestaande afkappingen of uitgangen.', 'Gebruik het patroon als voorspelling en controleer uitzonderingen en naamconventies.'],
      selfCheck: ['Baseer ik mijn analyse op klank en klemtoon, niet uitsluitend op letters?', 'Heb ik ruimte gelaten voor variatie, zoals verschillende bestaande roepnamen?'],
    },
    steps: [
      {
        kind: 'sort', id: 'toepassen-prosodische-mal', prompt: 'Welke vorm hebben deze afkappingen in de gewone uitspraak? Hoofdletters markeren klemtoon.',
        buckets: ['Eén lettergreep', 'Sterk-zwak: een trochee'],
        items: [{ t: 'lab', b: 0 }, { t: 'DE-mo', b: 1 }, { t: 'prof', b: 0 }, { t: 'IN-fo', b: 1 }],
        why: 'Lab en prof vormen één lettergreep. Demo en info hebben een sterke eerste en zwakke tweede lettergreep. Je beschrijft hier een klankmal; je hoeft demo niet als twee betekenisvolle morfemen te analyseren.',
      },
      choice('toepassen-patroon-en-naam', 'Je kent bij een lange voornaam twee verschillende ingeburgerde roepnamen. Wat betekent dat voor een prosodisch patroon?', ['Het patroon kan veel vormen verklaren zonder elke individuele naam af te dwingen.', 'Een van de roepnamen moet fout zijn omdat een patroon maar één uitkomst toestaat.', 'Klank en ritme spelen daarom in geen enkele afkapping een rol.'], 'Het patroon kan veel vormen verklaren zonder elke individuele naam af te dwingen.', 'Roepnamen zijn ook door traditie en persoonlijk gebruik bepaald. Een klankvoorkeur beschrijft een tendens, geen verplicht algoritme voor iemands naam.'),
      choice('transfer-verklaring-toetsen', 'Een onderzoeker zegt dat -s na een zwakke slotlettergreep aantrekkelijk is omdat het geen extra zwakke lettergreep toevoegt. Welke vergelijking toetst dat argument direct?', ['Vergelijk het ritme van tafels met de denkbare vorm tafelen als meervoud.', 'Tel uitsluitend hoeveel letters tafel heeft.', 'Vergelijk de kleur van de voorwerpen die de woorden noemen.'], 'Vergelijk het ritme van tafels met de denkbare vorm tafelen als meervoud.', 'De hypothese gaat over ritme van de uitvoervorm. TA-fels heeft twee lettergrepen; TA-fe-len voegt een zwakke lettergreep toe. Zo’n contrast ondersteunt een prosodische voorkeur, maar bewijst nog niet dat alle meervouden uitsluitend door ritme worden gekozen.'),
    ],
  },
  d17: {
    guidance: {
      goal: 'Je onderscheidt hypothesen over opslaan en opbouwen en beoordeelt welk experiment ze werkelijk uit elkaar kan houden.',
      startingPoint: 'Het mentale lexicon is je kennis van woorden. Een snelle herkenning kan meerdere oorzaken hebben; één reactie onthult niet rechtstreeks een route.',
      strategy: ['Maak expliciet wat elk model voorspelt voor bekende en nieuwe vormen.', 'Controleer verstorende verschillen zoals frequentie, woordlengte en betekenisdoorzichtigheid.', 'Formuleer een conclusie als steun voor een voorspelling, met alternatieve verklaringen erbij.'],
      selfCheck: ['Heb ik waargenomen gedrag gescheiden van de verklaring ervoor?', 'Kan ik uitleggen welk resultaat mijn voorkeursverklaring juist zou verzwakken?'],
    },
    steps: [
      choice('toepassen-reactietijd', 'Een veelgebruikt lang woord wordt sneller herkend dan een zeldzaam kort woord. Wat volgt hieruit?', ['Frequentie kan een rol spelen; het experiment isoleert woordlengte niet.', 'Lange woorden zijn per definitie makkelijker dan korte woorden.', 'Het brein ontleedt nooit woorden.'], 'Frequentie kan een rol spelen; het experiment isoleert woordlengte niet.', 'De woorden verschillen op meer dan één variabele. Een verschil in herkenningstijd laat daarom niet zien welke factor het veroorzaakt. Match frequentie om een conclusie over lengte of ontleding te onderzoeken.'),
      {
        kind: 'swipe', id: 'toepassen-modellen-bewijs', prompt: 'Is deze interpretatie van een experiment gerechtvaardigd?',
        cards: [{ t: 'Correcte toepassing op een onbekend woord toont dat de spreker meer kan dan alleen dat hele woord uit het geheugen ophalen.', ok: true, why: 'Het specifieke woord was niet geleerd. De prestatie past bij generalisatie via een regel, schema of analogie.' }, { t: 'Eén correct nieuw woord bewijst dat een symbolische regel het enige mogelijke model is.', ok: false, fix: 'Ook andere modellen kunnen generalisatie voorspellen; vergelijk hun specifieke voorspellingen.', why: 'Een uitkomst die meerdere modellen voorspellen, beslist de strijd niet.' }, { t: 'Een frequente woordvorm kan opgeslagen zijn en tegelijk herkenbare onderdelen hebben.', ok: true, why: 'Opslag en structuur zijn geen logische tegenpolen. Verschillende modellen laten combinaties toe.' }],
      },
      {
        kind: 'write', id: 'transfer-ontwerp-experiment',
        rubric: {"criteria": ["Ik vergelijk twee groepen waarmee de voorspelling kan worden onderzocht.", "Ik houd minstens één relevante verstorende factor gelijk.", "Ik meet herkenning op een concrete manier en noem een uitkomst die mijn verwachting verzwakt.", "Ik presenteer het plan als voorstel, zonder verzonnen resultaten als bewijs."], "example": "Ik vergelijk twee groepen nieuwe samenstellingen: woorden met zeer bekende delen en woorden met minder bekende delen. Ik houd de woordlengte en de plausibiliteit van de betekenis zo gelijk mogelijk. Eerst controleer ik welke delen de deelnemers kennen. Daarna meet ik reactietijd en fouten bij een taak waarin zij de bedoelde betekenis kiezen. Mijn verwachting is dat bekende delen helpen. Als die groep niet sneller of nauwkeuriger reageert, verzwakt dat de voorspelling. Ik controleer ook of een verschil in taakmoeilijkheid de uitkomst kan verklaren."},
        prompt: 'Ontwerp een kleine proef om te onderzoeken of bekende woorddelen helpen bij het herkennen van nieuwe samenstellingen.',
        intro: 'Noem twee te vergelijken groepen woorden, één factor die je gelijk houdt, wat je meet en een resultaat dat je verwachting zou verzwakken. Stel het voor als onderzoek, zonder verzonnen uitkomsten als feiten te presenteren.', minWords: 55,
        must: [{ label: 'Beschrijf een vergelijking.', test: { anyWord: ['vergelijk', 'vergelijken', 'groep', 'groepen'] } }, { label: 'Benoem wat gelijk blijft.', test: { anyWord: ['lengte', 'frequentie', 'gelijk', 'bekendheid'] } }, { label: 'Benoem een meetuitkomst.', test: { anyWord: ['reactietijd', 'reactietijden', 'tijd', 'fouten', 'juistheid'] } }, { label: 'Noem een mogelijke tegenuitkomst.', test: { anyWord: ['geen', 'niet', 'tegengesteld', 'langzamer'] } }],
        why: 'Een bruikbaar ontwerp vergelijkt bijvoorbeeld nieuwe samenstellingen met bekende versus minder bekende delen, bij vergelijkbare lengte. Meet snelheid én fouten. Geen voordeel voor bekende delen zou de voorspelling verzwakken, maar controleer ook of deelnemers die delen echt kenden. De checklist herkent woorden, geen volledige experimentele geldigheid.',
      },
    ],
  },
  d18: {
    guidance: {
      goal: 'Je beschrijft hoe woorddelen nieuwe functies krijgen en vervoegt ingeburgerde leenwerkwoorden met Nederlandse patronen.',
      startingPoint: 'Taalverandering is een verandering in gebruik door de tijd. De huidige vorm van één woord vertelt nog niet vanzelf zijn geschiedenis.',
      strategy: ['Scheid de huidige betekenis van de vermoedelijke historische oorsprong.', 'Benoem de richting van verandering alleen met passende voorbeelden of bronnen.', 'Pas bij een leenwerkwoord de Nederlandse vervoeging toe en controleer de uitgesproken stam.'],
      selfCheck: ['Noem ik een historische verklaring die ik echt kan onderbouwen?', 'Heb ik de Engelse spelling niet automatisch als Engelse vervoeging overgenomen?'],
    },
    steps: [
      {
        kind: 'sort', id: 'toepassen-verandering-beschrijven', prompt: 'Welke soort verandering is in de beschrijving aan de orde?',
        buckets: ['Gebonden stuk wordt zelfstandig gebruikt', 'Zelfstandig woord krijgt een gebonden functie', 'Nieuwe analyse van de woordgrens'],
        items: [{ t: 'Een spreker gebruikt tig los, zoals in “tig vragen”, los van twintig of dertig.', b: 0 }, { t: 'In een beschreven historische ontwikkeling wordt een zelfstandig woord een achtervoegsel.', b: 1 }, { t: 'Een spreker herkent burger in hamburger als herbruikbaar deel en maakt daarmee een nieuwe combinatie.', b: 2 }],
        why: 'Je sorteert op de gegeven verandering: losmaken, binden of anders analyseren. Dat is nauwkeuriger dan ieder nieuw woord grammaticalisatie noemen. Een concrete historische claim vraagt daarnaast bewijs uit oudere taalstadia.',
      },
      {
        kind: 'proofread', id: 'toepassen-leenwerkwoorden-redigeren', prompt: 'Verbeter de twee werkwoordsvormen in het verslag.',
        tokens: [{ t: 'De' }, { t: 'presentator' }, { t: 'streamde' }, { t: 'de' }, { t: 'lezing' }, { t: 'en' }, { t: 'checkde', fix: 'checkte', why: 'De stam check eindigt in uitspraak op een stemloze k. De zwakke verleden tijd krijgt -te.' }, { t: 'de' }, { t: 'microfoon.' }, { t: 'Daarna' }, { t: 'heeft' }, { t: 'hij' }, { t: 'iedereen' }, { t: 'gemailt.', fix: 'gemaild.', why: 'Mail eindigt in uitspraak op een l. Het voltooid deelwoord krijgt daarom -d: gemaild.' }],
        done: { title: 'Engelse basis, Nederlandse vormen', text: 'Streamde was goed: m geeft -de. Checkte krijgt -te en gemaild krijgt -d. De uitgesproken stam helpt bij de keuze; de Engelse verleden tijd is hier geen maatstaf.' },
      },
      choice('transfer-herkomst-is-geen-bewijs', 'Je hoort een nieuw woord dat eindigt op -gate. Wat kun je zonder historisch onderzoek wél verantwoord doen?', ['Uitleggen welke betekenis -gate in deze context toevoegt en vergelijking met andere woorden zoeken.', 'Beweren dat de maker bewust de hele geschiedenis van Watergate bedoelt.', 'Concluderen dat het woord grammaticaal fout is omdat -gate ooit bij een naam hoorde.'], 'Uitleggen welke betekenis -gate in deze context toevoegt en vergelijking met andere woorden zoeken.', 'Huidig gebruik kan als woordvormingspatroon worden onderzocht zonder de bedoeling van de maker te verzinnen. Oorsprong en huidige functie zijn verbonden, maar vallen niet noodzakelijk samen.'),
    ],
  },
  d19: {
    guidance: {
      goal: 'Je onderscheidt afkapping, initiaalwoord, acroniem en mengwoord op basis van hun vorming en uitspraak.',
      startingPoint: 'Bij deze vormen hoef je niet altijd hele betekenisvolle woorddelen terug te vinden. Klankstukken en beginletters kunnen ook bouwmateriaal zijn.',
      strategy: ['Zoek eerst de volledige bronwoorden.', 'Bepaal wat behouden blijft: een stukje woord, beginletters of stukken van meerdere woorden.', 'Gebruik de uitspraak om een initiaalwoord van een acroniem te onderscheiden; controleer spelling apart.'],
      selfCheck: ['Baseer ik mijn categorie op het vormingsproces en de uitspraak?', 'Heb ik hoofdletters niet als enige bewijs voor een categorie gebruikt?'],
    },
    steps: [
      {
        kind: 'sort', id: 'toepassen-bron-en-uitspraak', prompt: 'Gebruik de gegeven herkomst én uitspraak om te sorteren.',
        buckets: ['Afkapping', 'Initiaalwoord', 'Acroniem', 'Mengwoord'],
        items: [{ t: 'demo uit demonstratie', b: 0 }, { t: 'EU uit Europese Unie, uitgesproken als de letters E en U', b: 1 }, { t: 'laser uit light amplification by stimulated emission of radiation, uitgesproken als één woord', b: 2 }, { t: 'infotainment uit information en entertainment', b: 3 }],
        why: 'Demo bewaart een deel van één bronwoord. EU noemt de letters apart. Laser wordt als woord uitgesproken. Infotainment mengt stukken uit twee woorden. De brongegevens zijn hier gegeven, zodat je niet op een toevallige indruk hoeft te gokken.',
      },
      type('toepassen-apostrof-initiaalwoord', 'Maak het gewone meervoud van sms via de verkleinvorm. Gebruik een rechte apostrof.', "sms'jes", 'Het gewone meervoud is sms’jes, geschreven met een apostrof na het initiaalwoord. Hier is de gevestigde vorm belangrijk: niet elke afkorting krijgt mechanisch dezelfde meervoudsuitgang.'),
      choice('transfer-categorie-controle', 'Een klasgenoot zegt: “EU is een acroniem, want het staat in hoofdletters.” Welke informatie ontbreekt?', ['Hoe je het uitspreekt: als losse letters of als één woord.', 'Hoeveel landen erbij horen.', 'Of de letters met blauwe inkt zijn geschreven.'], 'Hoe je het uitspreekt: als losse letters of als één woord.', 'Hoofdletters kunnen zowel bij initiaalwoorden als bij acroniemen staan. Het onderscheid in deze les is de uitspraak: E-U als losse letters tegenover bijvoorbeeld laser als gewoon woord.'),
    ],
  },
  d20: {
    guidance: {
      goal: 'Je gebruikt de fiets als concrete context om samenstellingen, lidwoorden en nauwkeurige woordkeuze toe te passen.',
      startingPoint: 'Je hebt onderdelen bekeken en benoemd. Nu gebruik je hun namen in instructies die iemand anders moet kunnen uitvoeren.',
      strategy: ['Benoem eerst het bedoelde onderdeel met zijn lidwoord.', 'Bepaal bij een samenstelling het hoofd: welk onderdeel wordt werkelijk bedoeld?', 'Lees je instructie alsof de lezer nog niet weet waar je naar wijst.'],
      selfCheck: ['Verwijs ik naar precies één duidelijk onderdeel?', 'Klopt het lidwoord met het hoofd, ook als het eerste deel een ander lidwoord heeft?'],
    },
    steps: [
      {
        kind: 'sort', id: 'toepassen-fiets-in-woorden', prompt: 'Wat is het hoofd van deze naam? Kies het ding dat het hele woord benoemt.',
        buckets: ['Een lamp', 'Een kap', 'Een kabel', 'Een band'],
        items: [{ t: 'achterlamp', b: 0 }, { t: 'kettingkap', b: 1 }, { t: 'remkabel', b: 2 }, { t: 'voorband', b: 3 }],
        why: 'De samenstelling noemt telkens een soort van het rechterdeel: lamp, kap, kabel of band. Het linkerdeel vertelt onder meer waar het zit, wat het bedekt of waar het bij hoort.',
      },
      choice('toepassen-andere-kern', 'Je kent het wiel en de band. Welke combinatie klopt?', ['het voorwiel en de voorband', 'de voorwiel en het voorband', 'het voorwiel en het voorband'], 'het voorwiel en de voorband', 'Voor- beschrijft de positie. Het hoofd levert hier het lidwoord: het wiel, dus het voorwiel; de band, dus de voorband. De gedeelde positie maakt het woordgeslacht niet gelijk.'),
      {
        kind: 'rewrite', id: 'transfer-duidelijke-instructie', prompt: 'Maak de instructie specifiek. Vervang het eerste “ding” door “achterlamp” en het tweede door “voorlamp”; pas de lidwoorden aan en laat de losse plaatswoorden weg.',
        source: 'Controleer het ding achter en het ding voor.', accept: ['Controleer de achterlamp en de voorlamp.'],
        why: 'Met de namen achterlamp en voorlamp weet de lezer welke onderdelen worden bedoeld. Beide hebben lamp als hoofd en krijgen de. De losse plaatswoorden zijn al in de samenstellingen opgenomen.',
      },
    ],
  },
  d21: {
    guidance: {
      goal: 'Je koppelt vaste en scheidbare werkwoorddelen aan betekenis, zinsplaats en de vorm van het voltooid deelwoord.',
      startingPoint: 'Be-, ver- en ont- zijn bij de behandelde afleidingen vast. Andere beginstukken kunnen afhankelijk van betekenis en klemtoon anders functioneren.',
      strategy: ['Lees eerst de betekenis van het hele werkwoord in de zin.', 'Controleer of het begindeel in de hoofdzin los kan komen.', 'Vorm daarna pas het deelwoord; plaats ge- niet blind voor elk werkwoord.'],
      selfCheck: ['Passen betekenis, scheidbaarheid en deelwoord bij elkaar?', 'Heb ik de letters vooraan niet los van de klemtoon en context geanalyseerd?'],
    },
    steps: [
      {
        kind: 'sort', id: 'toepassen-los-of-vast', prompt: 'Kijk naar de gegeven hoofdzin: komt het eerste deel los?',
        buckets: ['Scheidbaar in deze betekenis', 'Onscheidbaar in deze betekenis'],
        items: [{ t: 'omgooien: zij gooit de vaas om', b: 0 }, { t: 'ontwapenen: zij ontwapent de verdachte', b: 1 }, { t: 'aankleden: hij kleedt het kind aan', b: 0 }, { t: 'verbreden: de gemeente verbreedt het pad', b: 1 }],
        why: 'Om en aan komen in deze hoofdzinnen los. Ont- en ver- blijven vast. De zinsvorm levert een controle op; je hoeft niet uitsluitend op de eerste letters te gokken.',
      },
      type('toepassen-deelwoord-zonder-ge', 'Schrijf het voltooid deelwoord: De gemeente heeft het fietspad … (verbreden).', 'verbreed', 'Ver- is hier een onscheidbaar voorvoegsel, dus geen extra ge-. De stam verbreed eindigt al op d; het deelwoord krijgt geen tweede d.'),
      choice('transfer-vorm-bij-betekenis', 'De zon was verborgen achter wolken en is nu tevoorschijn gekomen. Welke zin past bij de scheidbare lezing van doorbreken?', ['De zon is doorgebroken.', 'De zon is doorbroken.', 'De zon is gedoorbroken.'], 'De zon is doorgebroken.', 'Bij de scheidbare lezing staat na het deeltje door het deelwoord gebroken, met ge-. Bij de onscheidbare lezing, zoals “zij heeft de stilte doorbroken”, ontbreekt ge-. De betekenis en constructie sturen de keuze; de letterreeks door alleen is onvoldoende.'),
    ],
  },
  d22: {
    guidance: {
      goal: 'Je vormt persoonsnamen, onderscheidt wie handelt van wie iets ondergaat en kiest een passende benaming voor je lezer.',
      startingPoint: 'Een doenernaam kan een persoon of werktuig noemen. De rol in de beschreven gebeurtenis is belangrijker dan de losse uitgang.',
      strategy: ['Schrijf de handeling als een eenvoudige zin: wie doet wat met wie?', 'Bepaal welke rol de persoonsnaam benoemt en controleer de gebruikelijke woordvorm.', 'Kies in communicatie een passende functiebenaming en volg waar relevant iemands voorkeur.'],
      selfCheck: ['Heb ik actieve en passieve rollen uit elkaar gehouden?', 'Heb ik een functiebenaming niet automatisch als informatie over iemands gender behandeld?'],
    },
    steps: [
      {
        kind: 'sort', id: 'toepassen-rollen-persoonsnaam', prompt: 'De onderzoeker ondervraagt de getuige. Welke rol benoemt de vorm?',
        buckets: ['Wie ondervraagt', 'Wie ondervraagd wordt'],
        items: [{ t: 'de ondervrager', b: 0 }, { t: 'de ondervraagde', b: 1 }, { t: 'de persoon die de vragen stelt', b: 0 }, { t: 'de persoon aan wie de vragen worden gesteld', b: 1 }],
        why: 'Ondervrager noemt de uitvoerder. Ondervraagde is gebaseerd op het voltooid deelwoord en noemt hier wie de handeling ondergaat. De rol blijft hetzelfde wanneer je de zin passief maakt.',
      },
      type('toepassen-persoonsvorm-afleiden', 'Hoe heet iemand die bemiddelt? Maak de persoonsnaam bij bemiddelen.', 'bemiddelaar', 'De stam bemiddel eindigt op een onbeklemtoonde lettergreep op l. De gebruikelijke persoonsnaam is bemiddelaar. Je gebruikt het patroon nu bij een andere handeling dan de voorbeelden uit de uitleg.'),
      choice('transfer-naam-en-persoon', 'Je schrijft over Sam, die zelf de functiebenaming onderzoeker gebruikt. Welke formulering is zorgvuldig?', ['Sam is onderzoeker en leidt het project.', 'Sam moet een man zijn, want onderzoeker eindigt op -er.', 'Onderzoeker is fout zodra je het gender van Sam niet kent.'], 'Sam is onderzoeker en leidt het project.', 'Een gebruikelijke functiebenaming kan generiek gebruikt worden; de uitgang alleen bepaalt iemands gender niet. Neem de relevante functie en een bekende persoonlijke voorkeur als uitgangspunt, zonder extra persoonsinformatie te verzinnen.'),
    ],
  },
  d23: {
    guidance: {
      goal: 'Je kiest aaneenschrijven, los schrijven of een koppelteken op grond van woordstructuur en een concrete spellingregel.',
      startingPoint: 'De vraag “één woord of een woordgroep?” komt vóór de vraag of er een streepje nodig is.',
      strategy: ['Bepaal eerst of het één samenstelling is of een losse beschrijving.', 'Controleer daarna specifieke gevallen zoals klinkerbotsing, cijfers of initiaalwoorden.', 'Gebruik bij twijfel een woordenboek; “het ziet er lang uit” is geen reden voor een willekeurige spatie.'],
      selfCheck: ['Kan ik mijn spatie of koppelteken met structuur of een spellingregel verklaren?', 'Heb ik facultatieve leesbaarheid niet verward met een verplichte schrijfwijze?'],
    },
    steps: [
      {
        kind: 'sort', id: 'toepassen-schrijfwijze-verklaren', prompt: 'Welke regel verklaart de gegeven correcte vorm?',
        buckets: ['Gewone samenstelling aaneen', 'Koppelteken bij initiaalwoord of cijfer', 'Losse woordgroep'],
        items: [{ t: 'keukenkast', b: 0 }, { t: 'usb-kabel', b: 1 }, { t: '4-sterrenhotel', b: 1 }, { t: 'blauwe kast', b: 2 }],
        why: 'Keukenkast is één samenstelling. usb en 4 krijgen in deze combinaties een koppelteken. Blauwe kast is een bijvoeglijk naamwoord met een zelfstandig naamwoord en blijft los.',
      },
      {
        kind: 'proofread', id: 'toepassen-koppelteken-redactie', prompt: 'Verbeter de twee fout gespelde woorden.',
        tokens: [{ t: 'De' }, { t: 'usbkabel', fix: 'usb-kabel', why: 'Een initiaalwoord als usb krijgt in een samenstelling een koppelteken.' }, { t: 'ligt' }, { t: 'in' }, { t: 'de' }, { t: 'keukenkast.' }, { t: 'De' }, { t: 'radioopname', fix: 'radio-opname', why: 'Op de grens van radio en opname botsen o en o. Het koppelteken markeert de woordgrens.' }, { t: 'staat' }, { t: 'op' }, { t: 'een' }, { t: 'oude' }, { t: 'computer.' }],
        done: { title: 'Twee verschillende regels', text: 'usb-kabel krijgt een streepje vanwege het initiaalwoord; radio-opname vanwege klinkerbotsing. Keukenkast blijft aaneen en oude computer blijft een woordgroep.' },
      },
      choice('transfer-betekenis-en-spatie', 'Je bedoelt een loper die op de lange afstand uitkomt. Welke formulering maakt die bedoeling duidelijk?', ['een langeafstandsloper', 'een lange afstandsloper, waarbij lange noodzakelijk de afstand bepaalt', 'een langeafstands loper'], 'een langeafstandsloper', 'Lange afstand vormt samen het eerste deel van langeafstandsloper. In de losse groep lange afstandsloper kan lange de persoon beschrijven: een afstandsloper die lang is. De spatie is dus niet alleen een visuele keuze.'),
    ],
  },
  d24: {
    guidance: {
      goal: 'Je analyseert samengestelde handelingsnamen en nominalisaties en gebruikt zinnen om hun rollen en betekenis te toetsen.',
      startingPoint: 'Een nominalisatie maakt van een handeling een naamwoord. Een argument is een deelnemer die bij de betekenis van die handeling hoort, zoals wat er vertaald wordt.',
      strategy: ['Herschrijf de naamwoordelijke constructie als een zin met een werkwoord.', 'Benoem de uitvoerder, wat de handeling ondergaat en eventuele overige bepalingen.', 'Gebruik context om gebeurtenis en resultaat te onderscheiden; behandel aanwijzingen zoals meervoud niet als een onfeilbare test.'],
      selfCheck: ['Is de betekenis van het eerste deel uit de handeling af te leiden of vul ik wereldkennis aan?', 'Kan ik mijn analyse uitleggen met een heldere zin en een mogelijke tegenlezing?'],
    },
    steps: [
      {
        kind: 'sort', id: 'toepassen-rol-eerste-deel', prompt: 'Welke rol heeft het eerste deel in de gegeven omschrijving?',
        buckets: ['Wat de handeling ondergaat', 'Waar de handeling plaatsvindt'],
        items: [{ t: 'ramenwasser: iemand die ramen wast', b: 0 }, { t: 'thuiswerker: iemand die thuis werkt', b: 1 }, { t: 'briefschrijver: iemand die een brief schrijft', b: 0 }, { t: 'straatzanger: iemand die op straat zingt', b: 1 }],
        why: 'Ramen en brief vullen in deze omschrijvingen de objectrol. Thuis en straat beschrijven de plaats. Een hoofd dat bij een werkwoord hoort, garandeert dus niet dat elk eerste deel automatisch een lijdend voorwerp is.',
      },
      choice('toepassen-gebeurtenis-meervoud', '“De drie vertalingen van de tekst namen elk een week in beslag.” Welke analyse past bij deze context?', ['Vertalingen kan hier drie vertaalactiviteiten noemen; meervoud sluit een gebeurtenislezing niet altijd uit.', 'Meervoud bewijst dat er uitsluitend drie papieren documenten bedoeld zijn.', 'De zin is onmogelijk omdat gebeurtenissen nooit in het meervoud staan.'], 'Vertalingen kan hier drie vertaalactiviteiten noemen; meervoud sluit een gebeurtenislezing niet altijd uit.', 'Namen een week in beslag stuurt naar processen of activiteiten. Telbaarheid is een bruikbare aanwijzing, maar gebeurtenissen kunnen ook als afzonderlijke voorvallen worden geteld. Je moet meerdere contextsignalen combineren.'),
      {
        kind: 'rewrite', id: 'toepassen-argumenten-zichtbaar', prompt: 'Maak een actieve zin in de tegenwoordige tijd: begin met “Het team” en behoud wie wat doet.',
        source: 'De controle van de aanvragen door het team vindt vandaag plaats.', accept: ['Het team controleert vandaag de aanvragen.', 'Het team controleert de aanvragen vandaag.'],
        why: 'Het team is de uitvoerder en wordt het onderwerp. De aanvragen ondergaan de controle en worden het lijdend voorwerp. Vandaag blijft de tijdsbepaling. De werkwoordelijke zin maakt de rollen direct zichtbaar.',
      },
      {
        kind: 'write', id: 'transfer-morfologische-analyse',
        rubric: {"criteria": ["Ik verbind verwerker met het werkwoord verwerken en de uitgang -er.", "Ik benoem afval als datgene wat wordt verwerkt.", "Ik geef een actieve voorbeeldzin met dezelfde rollen.", "Ik leg uit welke informatie alleen de context kan invullen, zoals persoon, machine of bedrijf."], "example": "Een afvalverwerker is iemand of iets dat afval verwerkt. Je begint bij het werkwoord verwerken en vormt daarmee verwerker: de naam van degene of datgene dat verwerkt. Het eerste deel afval vertelt wat die handeling ondergaat. Een passende voorbeeldzin is bijvoorbeeld: het bedrijf verwerkt afval. Het woord zegt nog niet zeker of het over een bedrijf, een persoon of een machine gaat. Daarvoor lees je de omgeving waarin het wordt gebruikt. De vorm geeft dus wel de relatie met verwerken, maar vult niet ieder detail van de situatie in."},
        prompt: 'Eindopdracht: leg aan een beginner uit wat het woord afvalverwerker betekent en hoe het is opgebouwd.',
        intro: 'Schrijf vier tot zes zinnen. Benoem afval, verwerken en -er. Geef een eenvoudige zin met dezelfde rollen. Leg ook uit waarom het woord alleen nog niet vertelt of het een persoon, machine of organisatie is. Gebruik de context om dat te bepalen.', minWords: 60,
        must: [{ label: 'Benoem het eerste deel.', test: { anyWord: ['afval'] } }, { label: 'Noem het onderliggende werkwoord.', test: { anyWord: ['verwerken', 'verwerkt'] } }, { label: 'Geef een eenvoudige voorbeeldzin.', test: { anyWord: ['bijvoorbeeld', 'zoals'] } }, { label: 'Benoem een rol die context helpt vaststellen.', test: { anyWord: ['persoon', 'machine', 'organisatie', 'bedrijf'] } }],
        why: 'Een mogelijke analyse: verwerken levert verwerker op; afval noemt wat wordt verwerkt. “Het bedrijf verwerkt afval” maakt de rollen zichtbaar. Verwerker kan in context een bedrijf, machine of persoon aanduiden. Een goede uitleg benoemt dus vorm, rollen en de grens van wat de vorm voorspelt. De checklist controleert aanwezigheid van onderdelen, niet automatisch de juistheid van de redenering.',
      },
    ],
  },
};
