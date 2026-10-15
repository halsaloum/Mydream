import type { OntleedLesson } from './types';

/** Original capstones, with option-specific feedback and cross-level revision. */
export const CAPSTONE_LESSONS: OntleedLesson[] = [
  {
    "id": "volle-zin-combineren",
    "title": "Van kernzinnen naar een geheel",
    "subtitle": "Verbind inhoud zonder ongemerkt iets nieuws te beweren.",
    "part": "volle-zin",
    "minutes": 25,
    "level": "meesterschap",
    "prerequisites": [
      "zinsbouw-bijzinnen",
      "betekenis-implicatie"
    ],
    "goal": "Je combineert kernzinnen, benoemt de gekozen relatie en controleert welke informatie behouden blijft.",
    "intro": "Een zin maken is kiezen. Hetzelfde materiaal kan een opsomming, reden, tijdskader of bijvoeglijke bepaling worden. Ontdek eerst wat zo’n keuze met de inhoud doet.",
    "discovery": {
      "prompt": "Je weet: Noor belde de conciërge. Het raam zat vast. Welke combinatie voegt uit zichzelf een reden toe?",
      "options": [
        "Noor belde de conciërge en het raam zat vast.",
        "Noor belde de conciërge omdat het raam vastzat.",
        "Het raam zat vast; Noor belde de conciërge."
      ],
      "answer": 1,
      "feedback": [
        "En verbindt, maar legt op zichzelf geen oorzakelijke relatie vast.",
        "Omdat presenteert het vastzitten als reden voor het bellen. Die relatie moet in je materiaal gerechtvaardigd zijn.",
        "De volgorde kan een verband suggereren; de reden is niet expliciet grammaticaal vastgelegd."
      ]
    },
    "sections": [
      {
        "title": "Begin met de beweringen, niet met het voegwoord",
        "paragraphs": [
          "Neem een zware zin uit een verslag en schrijf eerst de afzonderlijke mededelingen op. Wie deed wat? Welke eigenschap wordt toegekend? Welke tijd of plaats wordt werkelijk genoemd? Een kernzin hoeft niet kort genoeg voor een slogan te zijn: hij moet één zelfstandig te beoordelen mededeling helder uitdrukken. Zo zie je welke inhoud je tijdens het combineren niet mag kwijtraken.",
          "Bepaal vervolgens de relatie. Twee gebeurtenissen kunnen naast elkaar staan zonder dat de ene de andere veroorzaakt. Een reden, voorwaarde of gevolg is extra informatie. Die informatie mag je expliciet maken als je bron of bedoeling haar ondersteunt. Een mooi lopende omdat-zin is geen verbetering wanneer je er een oorzaak mee verzint.",
          "Maak ook een keuze over de hoofdzaak. Bij onderschikking maakt één mededeling deel uit van een andere. Bij nevenschikking blijven de verbonden delen grammaticaal op gelijke rang. Dat is een keuze over de organisatie van de boodschap, zonder dat grammaticale rang automatisch iets zegt over hoe belangrijk elk feit in de werkelijkheid is."
        ],
        "examples": [
          {
            "sentence": "Noor controleerde het raam. Het raam zat vast.",
            "analysis": "Twee feiten. De tweede zin vertelt nog niet waarom Noor controleerde."
          },
          {
            "sentence": "Omdat het raam vastzat, controleerde Noor het mechanisme.",
            "analysis": "De reden staat expliciet voorop. Het controleren is de hoofdbewering; het vooropstaande kader vraagt inversie."
          }
        ],
        "pitfall": "Zonder bewijs “en” vervangen door “dus” of “omdat” kan de feitelijke inhoud veranderen.",
        "takeaway": "Noteer feiten én gerechtvaardigde relaties voordat je één samengestelde zin bouwt."
      },
      {
        "title": "Kies welke informatie je in een naamwoordgroep onderbrengt",
        "paragraphs": [
          "Een betrekkelijke bijzin kan een persoon of zaak nader identificeren. Daarmee maak je van een zelfstandige mededeling informatie binnen een naamwoordgroep. Het hele blok krijgt dan samen zijn functie in de grotere zin. De bijzin heeft intussen eigen functies: de betrekkelijke vorm kan daar onderwerp of voorwerp zijn.",
          "Vergelijk een beperkende en een uitbreidende bijzin. Zonder afbakenende komma’s kan de bijzin helpen bepalen welke brieven je bedoelt. Met komma’s kan hij aanvullende informatie geven over een al geïdentificeerde groep. De keuze werkt dus door in de bewering. Je kunt haar niet uitsluitend op ademhaling baseren.",
          "Een beknopte vorm kan compact zijn, maar laat een participant impliciet. Controleer wie de handeling verricht. Een formulering als “na de brief gelezen te hebben” is helder wanneer de bedoelde lezer past bij de hoofdconstructie. Als het onderwerp van de hoofdzin een kast is, moet je de persoon alsnog duidelijk maken."
        ],
        "examples": [
          {
            "sentence": "De brieven die gisteren aankwamen, liggen op tafel.",
            "analysis": "De bijzin selecteert welke brieven bedoeld zijn. De komma na aankwamen sluit de relatieve bijzin af vóór de hoofdzin verdergaat; zij is geen algemene komma na een lang onderwerp."
          },
          {
            "sentence": "De brieven, die gisteren aankwamen, liggen op tafel.",
            "analysis": "Met twee afbakenende komma’s krijgt de reeds geïdentificeerde groep een extra mededeling."
          }
        ],
        "pitfall": "Een komma toevoegen kan veranderen over welke verzameling je een uitspraak doet.",
        "takeaway": "Kies identificerende of aanvullende informatie bewust en behoud de bedoelde groep."
      },
      {
        "title": "Controleer het resultaat in drie rondes",
        "paragraphs": [
          "Controleer eerst de bouw. Markeer per eindige deelzin de persoonsvorm, wijs de kern van het onderwerp aan en kijk welk volledig zinsdeel het voorveld vult. Controleer dan werkwoordvormen en verwijzingen. Doe dit per deelzin: een samengestelde zin heeft niet één onderwerp dat alle persoonsvormen automatisch bestuurt.",
          "Controleer daarna de inhoud. Schrijf je gecombineerde zin weer uiteen in kernzinnen. Vind je alle oorspronkelijke mededelingen terug? Is een mogelijkheid veranderd in een zekerheid? Is een tijdsvolgorde een reden geworden? Zo’n terugvertaling is een krachtige controle omdat je de gladde formulering tijdelijk onderbreekt.",
          "Controleer ten slotte de lezer. Waar moet die informatie vasthouden? Een lange werkwoordstang of verre verwijzing kan de verwerking zwaarder maken. Verplaatsen kan helpen, maar ook een bijzin verder van zijn kern brengen. Soms zijn twee samenhangende zinnen de beste uitkomst. Het doel van combineren is een beredeneerde formulering, geen wedstrijd om alles onder één punt te krijgen."
        ],
        "examples": [
          {
            "sentence": "Omdat de brief onduidelijk was, belde Noor de afzender voordat zij het dossier afsloot.",
            "analysis": "Een redenkader, een hoofdbewering en een tijdsrelatie. Bepaal expliciet wie “zij” is en of “voordat” door de gegeven feiten wordt gedragen."
          }
        ],
        "pitfall": "Een correct gevormde lange zin kan nog steeds onduidelijk of inhoudelijk onjuist zijn.",
        "takeaway": "Toets grammatica, inhoud en leesbaarheid afzonderlijk."
      }
    ],
    "lab": {
      "kind": "compare",
      "prompt": "Vergelijk drie manieren om dezelfde twee gebeurtenissen te organiseren.",
      "variants": [
        {
          "label": "Gelijke rang",
          "text": "Noor controleerde de map en Mila opende het dossier.",
          "analysis": "Twee verbonden mededelingen. De zin zelf legt geen oorzakelijke relatie vast."
        },
        {
          "label": "Tijdskader",
          "text": "Terwijl Mila het dossier opende, controleerde Noor de map.",
          "analysis": "Gelijktijdigheid is nu expliciet. Deze variant past alleen wanneer de gebeurtenissen werkelijk overlappen."
        },
        {
          "label": "Reden",
          "text": "Noor controleerde de map omdat Mila het dossier had geopend.",
          "analysis": "Nu claim je een reden en een eerdere gebeurtenis. Dat moet je oorspronkelijke materiaal ondersteunen."
        }
      ],
      "takeaway": "Een nieuwe verbinding kan een nieuwe claim toevoegen."
    },
    "practice": [
      {
        "id": "volle-zin-combineren-c1",
        "kind": "choice",
        "prompt": "Welke informatie voegt “omdat” toe?",
        "options": [
          "Alleen een komma",
          "Een meervoudsvorm",
          "Een redenrelatie"
        ],
        "answer": 2,
        "feedback": [
          "Een komma ordent de schrijfvorm; omdat benoemt bovendien een inhoudelijke relatie.",
          "Omdat verandert geen grammaticaal getal.",
          "Omdat maakt een reden of oorzaak expliciet; dat is meer dan verbinden."
        ],
        "explanation": "Omdat maakt een reden of oorzaak expliciet; dat is meer dan verbinden.",
        "concept": "Relaties behouden",
        "hint": "Vergelijk welke relatie het verbindingswoord vastlegt en welke feiten echt gegeven zijn."
      },
      {
        "id": "volle-zin-combineren-c2",
        "kind": "choice",
        "prompt": "Wat doet een beperkende betrekkelijke bijzin?",
        "options": [
          "Hij moet altijd tussen twee komma’s.",
          "Hij selecteert de bedoelde groep.",
          "Hij maakt elke zin passief."
        ],
        "answer": 1,
        "feedback": [
          "Twee afbakenende komma’s passen juist bij een uitbreidende lezing.",
          "Een beperkende bijzin kan identificeren welke leden bedoeld zijn.",
          "Een betrekkelijke bijzin maakt geen passieve werkwoordconstructie."
        ],
        "explanation": "Een beperkende bijzin kan identificeren welke leden bedoeld zijn.",
        "concept": "Identificatie",
        "hint": "Vraag of de bijzin bepaalt welke leden van een groep bedoeld zijn."
      },
      {
        "id": "volle-zin-combineren-c3",
        "kind": "order",
        "prompt": "Bouw de hoofdzin met een redenkader voorop.",
        "tokens": [
          "belde",
          "Omdat de sleutel ontbrak,",
          "Noor",
          "de beheerder."
        ],
        "accept": [
          "Omdat de sleutel ontbrak, belde Noor de beheerder."
        ],
        "explanation": "De hele omdat-bijzin vult het voorveld; belde volgt als persoonsvorm.",
        "concept": "V2",
        "hint": "Kies één volledig zinsdeel voor het voorveld. Zoek daarna de persoonsvorm."
      },
      {
        "id": "volle-zin-combineren-c4",
        "kind": "choice",
        "prompt": "Welke controle vindt een ongemerkt toegevoegde zekerheid?",
        "options": [
          "Alle woorden tellen",
          "De langste naam schrappen",
          "De gecombineerde zin terugschrijven als losse beweringen"
        ],
        "answer": 2,
        "feedback": [
          "Woordtelling laat niet zien of mogelijk in zeker is veranderd.",
          "De lengte van een naam bepaalt de modaliteit van de bewering niet.",
          "Terugvertalen maakt modaliteit en nieuwe relaties zichtbaar."
        ],
        "explanation": "Terugvertalen maakt modaliteit en nieuwe relaties zichtbaar.",
        "concept": "Inhoud behouden",
        "hint": "Schrijf de mededelingen vóór en na de ingreep afzonderlijk op."
      },
      {
        "id": "volle-zin-combineren-c5",
        "kind": "choice",
        "prompt": "Wanneer is splitsen een goede keuze?",
        "options": [
          "Alleen wanneer een woord lang is",
          "Als twee zinnen de relaties en verwijzingen duidelijker maken",
          "Zodra er één bijzin staat"
        ],
        "answer": 1,
        "feedback": [
          "Relaties en verwijzingen kunnen verwerking belasten zonder lange woorden.",
          "Splitsen is een keuze voor begrip; één bijzin of een lang woord bewijst geen probleem.",
          "Een bijzin kan helder en functioneel zijn; aanwezigheid alleen is geen reden om te splitsen."
        ],
        "explanation": "Splitsen is een keuze voor begrip; één bijzin of een lang woord bewijst geen probleem.",
        "concept": "Leesbaarheid",
        "hint": "Vergelijk de relaties die de lezer in de bedoelde context moet begrijpen."
      }
    ],
    "retrieval": [
      {
        "id": "volle-zin-combineren-r1",
        "kind": "choice",
        "prompt": "Je bron noemt twee gebeurtenissen zonder reden. Wat mag je toevoegen?",
        "options": [
          "Een verbinding met en, met controle van de betekenis",
          "Een gegarandeerd gevolg met dus",
          "Een omdat-relatie zonder bewijs"
        ],
        "answer": 0,
        "feedback": [
          "Gelijke rang kan verbinden zonder de ontbrekende causale claim toe te voegen.",
          "Dus kan een gevolg presenteren dat nog niet uit de gegeven feiten volgt.",
          "Omdat legt een reden vast die de bron niet heeft gegeven."
        ],
        "explanation": "Gelijke rang kan verbinden zonder de ontbrekende causale claim toe te voegen.",
        "concept": "Relaties behouden",
        "hint": "Vergelijk welke relatie het verbindingswoord vastlegt en welke feiten echt gegeven zijn."
      },
      {
        "id": "volle-zin-combineren-r2",
        "kind": "order",
        "prompt": "Plaats het tijdskader als één zinsdeel voorop.",
        "tokens": [
          "las",
          "Nadat de deur dichtging,",
          "Mila",
          "de brief."
        ],
        "accept": [
          "Nadat de deur dichtging, las Mila de brief."
        ],
        "explanation": "Het complete tijdskader staat vóór de persoonsvorm las.",
        "concept": "V2",
        "hint": "Kies één volledig zinsdeel voor het voorveld. Zoek daarna de persoonsvorm."
      }
    ],
    "transfer": {
      "prompt": "Schrijf drie losse kernzinnen over een gewone gebeurtenis. Combineer ze op twee manieren. Leg per versie uit welke relatie je toevoegt en welke mededeling de hoofdzaak wordt.",
      "checklist": [
        "Alle oorspronkelijke mededelingen zijn herkenbaar.",
        "Elke reden of tijdsrelatie past bij de beschreven gebeurtenis.",
        "Ik heb persoonsvormen en verwijzingen per deelzin gecontroleerd.",
        "Ik kan uitleggen waarom ik deze versie kies."
      ],
      "model": "Kernzinnen: Mila zocht de sleutel. De deur was dicht. Noor wachtte buiten. Versie: Terwijl Noor buiten wachtte, zocht Mila de sleutel; de deur was dicht. Dit maakt gelijktijdigheid expliciet; die moet bij de beschreven gebeurtenis passen. De oorspronkelijke drie mededelingen blijven herkenbaar, zonder een extra zoeklocatie of reden te verzinnen."
    },
    "recap": [
      "Begin met losse beweringen en hun relaties.",
      "Een voegwoord kan inhoud toevoegen.",
      "Een relatieve bijzin organiseert informatie binnen een naamwoordgroep.",
      "Controleer de bouw, de behouden inhoud en de lezer."
    ],
    "sources": [
      {
        "bookId": "natural-syntax",
        "section": "H3 en H6; H8 en H13",
        "note": "Hiërarchie en constituentie ondersteunen de analyse."
      },
      {
        "bookId": "kroeger",
        "section": "H12 pp.217–227; H18 pp.329–345",
        "note": "Compositionele interpretatie en de betekenis van causale verbindingen."
      },
      {
        "bookId": "leerlijn",
        "section": "§15",
        "note": "Bouwen vanuit kernzinnen; voorgestelde maatgrenzen zijn hier heuristieken."
      },
      {
        "bookId": "ans",
        "section": "§14.5.3.8.iii",
        "note": "Beperkende en uitbreidende relatieve bijzinnen en hun interpunctie; gecontroleerd naast Taaladvies.net over de komma na een relatieve bijzin."
      }
    ]
  },
  {
    "id": "volle-zin-leesbaarheid",
    "title": "Leesbaarheid zonder magische grens",
    "subtitle": "Onderzoek de last voor je lezer en weeg oplossingen af.",
    "part": "volle-zin",
    "minutes": 24,
    "level": "meesterschap",
    "prerequisites": [
      "zinsbouw-velden",
      "zinsbouw-informatiestructuur"
    ],
    "goal": "Je herkent verwerkingslast en kiest een herziening die inhoud en duidelijke aanhechting behoudt.",
    "intro": "Een zin van twintig woorden kan helder zijn; een zin van tien woorden kan twee lezingen hebben. Je gaat de last lokaliseren, niet blind op een teller vertrouwen.",
    "discovery": {
      "prompt": "Wat bewijst een werkwoordstang met dertien woorden ertussen?",
      "options": [
        "De zin is ongrammaticaal.",
        "De zin verdient een controle op verwerkingslast.",
        "De zin heeft precies twee bijzinnen."
      ],
      "answer": 1,
      "feedback": [
        "Een woordenaantal is geen grammaticale verbodsregel.",
        "De afstand kan verwerking bemoeilijken. Onderzoek inhoud, voorspelbaarheid en structuur.",
        "De afstand vertelt niet hoeveel bijzinnen er zijn."
      ]
    },
    "sections": [
      {
        "title": "Zoek wat de lezer moet vasthouden",
        "paragraphs": [
          "In de Nederlandse hoofdzin kunnen de persoonsvorm en andere werkwoordelijke delen ver uit elkaar staan. De lezer bewaart dan een verwachting over het vervolg. Een ingebedde bijzin, een onbekende naam en een abstract begrip kunnen die verwachting zwaarder belasten dan evenveel vertrouwde woorden. Telwoorden zijn daarom hooguit een eerste signaal.",
          "Ook binnen een naamwoordgroep kan de kern lang op zich laten wachten. In een groep met een uitgebreid deelwoord vóór het zelfstandig naamwoord weet de lezer laat waar de beschrijving op slaat. Die kern vroeger noemen kan helpen zonder dat je één woord schrapt. Een betrekkelijke bijzin na de kern is vaak een mogelijke uitweg.",
          "Maak onderscheid tussen grammaticale mogelijkheid en gebruik in deze tekst. Een lange groep kan nodig zijn wanneer de lezer de gegevens al kent en je ze samen moet identificeren. Dezelfde groep kan onhandig zijn bij een eerste kennismaking. Vraag dus niet alleen hoe lang iets is, maar ook wat de lezer op dat moment al kan gebruiken."
        ],
        "examples": [
          {
            "sentence": "De door de commissie op maandag opnieuw gecontroleerde lijst is beschikbaar.",
            "analysis": "De kern lijst verschijnt laat in de onderwerpnaamwoordgroep. De persoonsvorm is staat pas na die volledige groep."
          },
          {
            "sentence": "De lijst die de commissie maandag opnieuw controleerde, is beschikbaar.",
            "analysis": "De kern lijst staat vroeg. De inhoud blijft beschikbaar, maar het onderwerp is nog steeds een uitgebreide naamwoordgroep; controleer de bijzin en haar aanhechting."
          }
        ],
        "pitfall": "Een stijltip als “nooit meer dan twaalf woorden” verwart een aanwijzing met een taalregel.",
        "takeaway": "Lokaliseer de geheugentaak in een concrete groep of afhankelijkheid."
      },
      {
        "title": "Een verplaatsing kan tegelijk winst en verlies opleveren",
        "paragraphs": [
          "Een lange bijzin naar het achterveld verplaatsen kan de afstand tussen werkwoorden verkorten. Tegelijk kan die bijzin verder van zijn antecedent komen. Als er onderweg een tweede geschikte naamwoordgroep staat, kan de lezer de bepaling aan de verkeerde kern hechten. Een kortere stang garandeert dus nog geen betere zin.",
          "Een naamwoordgroep voorop zetten kan het bekende onderwerp van gesprek zichtbaar maken. Je moet dan de persoonsvorm op de juiste plaats houden en beoordelen of het nieuwe voorveld zelf overzichtelijk is. De verwerkingstaak verdwijnt niet noodzakelijk; soms verplaats je haar alleen naar een andere plek.",
          "Een goede afweging benoemt beide effecten. Schrijf bijvoorbeeld: deze versie noemt de lijst eerder en houdt de bijzin ernaast, maar maakt het onderwerp lang. Zo wordt je keuze controleerbaar voor een andere lezer. Je verdedigt geen universeel recept, maar een oplossing voor deze mededeling in deze context."
        ],
        "examples": [
          {
            "sentence": "Noor heeft de lijst van de docent bewaard die gisteren binnenkwam.",
            "analysis": "Wie of wat kwam binnen? Het uitplaatsen kan een tweede aanhechtingskandidaat zichtbaar maken."
          },
          {
            "sentence": "Gisteren kwam de lijst binnen. Noor heeft de lijst van de docent bewaard.",
            "analysis": "Splitsen kan de tijdsmededeling expliciet maken, maar controleer of de herhaalde lijst werkelijk hetzelfde antecedent heeft."
          }
        ],
        "pitfall": "Alleen de kortste werkwoordafstand vergelijken laat mogelijke nieuwe dubbelzinnigheid buiten beeld.",
        "takeaway": "Vergelijk na een ingreep ook verwijzing, aanhechting en informatiedeling."
      },
      {
        "title": "Nominalisatie en passief zijn keuzemogelijkheden",
        "paragraphs": [
          "Een nominalisatie maakt van een handeling een benoembaar geheel. Dat kan handig zijn wanneer die handeling al bekend is en je er verder iets over wilt zeggen. Het wordt zwaarder als een reeks abstracte zelfstandige naamwoorden de handeling en de deelnemers onzichtbaar maakt. Zoek de bedoelde gebeurtenis en de relevante deelnemers voordat je herschrijft.",
          "Een passief kan een bekende patiënt of zaak als onderwerp laten terugkeren. Het kan ook een onbekende of irrelevante handelende persoon onuitgedrukt laten. Dat is niet automatisch vaag of misleidend. Als verantwoordelijkheid juist de kern van de boodschap is, wordt het weglaten van de uitvoerder wel een belangrijke inhoudelijke keuze.",
          "Maak minstens twee alternatieven: een actieve zin en een versie die de bestaande topic behoudt. Vergelijk wat zij vooropzetten en welke informatie zij toevoegen of laten verdwijnen. Soms wint de actieve versie, soms het passief, soms een nominalisatie met een duidelijkere participant. Je doel is een lezer helpen dezelfde situatie juist te reconstrueren."
        ],
        "examples": [
          {
            "sentence": "De controle van de lijst door Noor duurde een uur.",
            "analysis": "Controle is het onderwerp van de mededeling over duur. Dat kan een functionele nominalisatie zijn."
          },
          {
            "sentence": "De lijst werd gecontroleerd.",
            "analysis": "De uitvoerder blijft onuitgedrukt. Beslis vanuit het doel van je tekst of die informatie nodig is."
          }
        ],
        "pitfall": "Elk voorkomen van -ing of worden als fout bestempelen levert slechte revisies op.",
        "takeaway": "Behoud nuttige topicstructuur en maak relevante deelnemers zichtbaar."
      }
    ],
    "lab": {
      "kind": "compare",
      "prompt": "Vergelijk de winst van drie revisies.",
      "variants": [
        {
          "label": "Nominaal",
          "text": "De uitvoering van de controle van de lijst door Noor is voltooid.",
          "analysis": "De handeling is verdeeld over meerdere naamwoordgroepen. De lezer moet relaties reconstrueren."
        },
        {
          "label": "Actief",
          "text": "Noor heeft de lijst gecontroleerd.",
          "analysis": "De uitvoerder en handeling zijn direct zichtbaar. Noor wordt het vertrekpunt."
        },
        {
          "label": "Passief",
          "text": "De lijst is door Noor gecontroleerd.",
          "analysis": "De lijst blijft vertrekpunt; de uitvoerder wordt wel genoemd. Dit kan passen wanneer de vorige zin over die lijst ging."
        }
      ],
      "takeaway": "Kies met de vorige zin en de informatiebehoefte van je lezer erbij."
    },
    "practice": [
      {
        "id": "volle-zin-leesbaarheid-l1",
        "kind": "choice",
        "prompt": "Welke vraag is nuttiger dan alleen woorden tellen?",
        "options": [
          "Is ieder woord korter dan zes letters?",
          "Kan ieder voegwoord weg?",
          "Welke afhankelijkheid moet de lezer vasthouden?"
        ],
        "answer": 2,
        "feedback": [
          "Korte woorden kunnen nog steeds verre of dubbelzinnige afhankelijkheden vormen.",
          "Voegwoorden kunnen noodzakelijke relaties zichtbaar maken; zomaar schrappen kan inhoud verliezen.",
          "Geheugenlast ontstaat bij relaties tussen onderdelen; alleen lengte legt die relaties niet vast."
        ],
        "explanation": "Geheugenlast ontstaat bij relaties tussen onderdelen; alleen lengte legt die relaties niet vast.",
        "concept": "Verwerkingslast",
        "hint": "Zoek welke onderdelen de lezer over een afstand met elkaar moet verbinden."
      },
      {
        "id": "volle-zin-leesbaarheid-l2",
        "kind": "choice",
        "prompt": "Wat controleer je na uitplaatsing van een relatieve bijzin?",
        "options": [
          "Of de bijzin een onderwerp van gesprek is geworden",
          "Of de bedoelde kern duidelijk blijft",
          "Of alle werkwoorden verdwenen zijn"
        ],
        "answer": 1,
        "feedback": [
          "Uitplaatsing maakt de bijzin niet automatisch tot het gesprekstopic.",
          "De grotere afstand kan aanhechting onduidelijk maken.",
          "Een revisie hoeft werkwoorden niet te verwijderen; hun juiste verband moet duidelijk blijven."
        ],
        "explanation": "De grotere afstand kan aanhechting onduidelijk maken.",
        "concept": "Aanhechting",
        "hint": "Noem de bedoelde kern van de verplaatste bijzin."
      },
      {
        "id": "volle-zin-leesbaarheid-l3",
        "kind": "choice",
        "prompt": "Wanneer kan een passief een goede keuze zijn?",
        "options": [
          "Wanneer de bekende zaak het vertrekpunt moet blijven",
          "Nooit",
          "Alleen bij één werkwoord"
        ],
        "answer": 0,
        "feedback": [
          "Het passief organiseert de deelnemers en informatiedeling.",
          "Passief kan juist een bekende zaak als vertrekpunt behouden.",
          "De geschiktheid hangt van informatieverdeling af, niet van precies één werkwoord."
        ],
        "explanation": "Het passief organiseert de deelnemers en informatiedeling.",
        "concept": "Passiefkeuze",
        "hint": "Welk bekend element moet voor deze lezer het vertrekpunt blijven?"
      },
      {
        "id": "volle-zin-leesbaarheid-l4",
        "kind": "choice",
        "prompt": "Wat maakt een nominalisatie nuttig?",
        "options": [
          "Iedere nominalisatie verkort een zin.",
          "Er kan geen uitvoerder meer bij staan.",
          "Je kunt over de handeling als bekend geheel iets zeggen."
        ],
        "answer": 2,
        "feedback": [
          "Nominalisaties kunnen een zin ook langer of abstracter maken.",
          "Een uitvoerder kan bijvoorbeeld met een door-groep worden genoemd.",
          "Een benoemde handeling kan topic of argument worden. Deelnemers kunnen nog worden genoemd."
        ],
        "explanation": "Een benoemde handeling kan topic of argument worden. Deelnemers kunnen nog worden genoemd.",
        "concept": "Nominalisatie",
        "hint": "Vraag of de tekst iets over de handeling als geheel wil zeggen."
      },
      {
        "id": "volle-zin-leesbaarheid-l5",
        "kind": "choice",
        "prompt": "Wat is een goede eindcontrole?",
        "options": [
          "Vervang iedere omdat door en.",
          "Laat een lezer benoemen wie wat doet en waaraan bepalingen hangen.",
          "Schrap alle woorden boven twaalf letters."
        ],
        "answer": 1,
        "feedback": [
          "Omdat en en drukken verschillende relaties uit; vervangen kan inhoud wijzigen.",
          "Een reconstructie toetst begrip en de bedoelde relaties.",
          "Letterlengte toetst niet wie wat doet of waar een bepaling bij hoort."
        ],
        "explanation": "Een reconstructie toetst begrip en de bedoelde relaties.",
        "concept": "Revisiecontrole",
        "hint": "Onderzoek na de ingreep ook de nieuwe structuur en nieuwe interpretaties."
      }
    ],
    "retrieval": [
      {
        "id": "volle-zin-leesbaarheid-r1",
        "kind": "choice",
        "prompt": "Een lange zin is grammaticaal correct. Wat volgt daaruit?",
        "options": [
          "Iedere lezer begrijpt hem direct.",
          "Splitsen is verboden.",
          "De leesbaarheid vraagt een afzonderlijke beoordeling."
        ],
        "answer": 2,
        "feedback": [
          "Correcte grammatica garandeert geen onmiddellijke interpretatie door iedere lezer.",
          "Splitsen kan de verwerking helpen, zolang de bedoelde inhoud behouden blijft.",
          "Correcte structuur en gemakkelijke verwerking zijn verschillende criteria."
        ],
        "explanation": "Correcte structuur en gemakkelijke verwerking zijn verschillende criteria.",
        "concept": "Verwerkingslast",
        "hint": "Zoek welke onderdelen de lezer over een afstand met elkaar moet verbinden."
      },
      {
        "id": "volle-zin-leesbaarheid-r2",
        "kind": "choice",
        "prompt": "Na het verkorten van de stang zijn twee antecedenten mogelijk. Wat nu?",
        "options": [
          "Laat de lezer willekeurig kiezen.",
          "Onderzoek en herstel de bedoelde aanhechting.",
          "De kortere versie is per definitie beter."
        ],
        "answer": 1,
        "feedback": [
          "Willekeurig kiezen kan een andere gebeurtenis opleveren dan jij bedoelt.",
          "Eenduidige inhoud kan belangrijker zijn dan alleen de afstand verkorten.",
          "Een kortere afstand kan nieuwe dubbelzinnigheid opleveren."
        ],
        "explanation": "Eenduidige inhoud kan belangrijker zijn dan alleen de afstand verkorten.",
        "concept": "Aanhechting",
        "hint": "Noem de bedoelde kern van de verplaatste bijzin."
      }
    ],
    "transfer": {
      "prompt": "Kies één zware zin uit je eigen tekst. Benoem twee concrete verwerkingslasten. Maak twee revisies en vergelijk de gewonnen helderheid, de behouden inhoud en een mogelijk nadeel.",
      "checklist": [
        "Mijn diagnose gaat over een concrete relatie, niet alleen een getal.",
        "Beide revisies behouden de bedoelde deelnemers en gebeurtenis.",
        "Ik heb elke verwijzing en aanhechting opnieuw bekeken.",
        "Ik kies een versie vanuit de informatiebehoefte van de lezer."
      ],
      "model": "Origineel: De uitvoering van de bespreking van het voorstel door de groep vond gisteren plaats. Diagnose: het bespreken is verstopt en de groep staat ver van de handeling. Revisie: De groep besprak het voorstel gisteren. Alternatief: Het voorstel is gisteren door de groep besproken. De tweede versie kan beter aansluiten op een voorafgaande zin over het voorstel."
    },
    "recap": [
      "Lengte is een signaal; lokaliseer de echte afhankelijkheid.",
      "Een ingreep kan de last verplaatsen of nieuwe dubbelzinnigheid maken.",
      "Passief en nominalisatie hebben bruikbare functies.",
      "Vergelijk revisies met behoud van inhoud."
    ],
    "sources": [
      {
        "bookId": "leerlijn",
        "section": "§6, §12 en §14–15",
        "note": "Verwerkingslast en bewuste stijlkeuzes; drempels zijn heuristieken."
      },
      {
        "bookId": "tallerman",
        "section": "H5–6; H8; §9.1",
        "note": "Constituenten, afhankelijkheden en hun functie."
      },
      {
        "bookId": "kroeger",
        "section": "H1–2 pp.3–34; H12 pp.217–227",
        "note": "Woord-, zins- en contextbetekenis en compositionele interpretatie; leesbaarheid is hier een Nederlandse toepassing."
      }
    ]
  },
  {
    "id": "volle-zin-herzien",
    "title": "Je eigen zin onder het vergrootglas",
    "subtitle": "Maak van een gevoel van onduidelijkheid een toetsbare diagnose.",
    "part": "volle-zin",
    "minutes": 28,
    "level": "meesterschap",
    "prerequisites": [
      "volle-zin-leesbaarheid",
      "betekenis-ontkenning-bereik"
    ],
    "goal": "Je herziet een eigen zin met bewijs voor vorm, functie, betekenis en lezerskeuze.",
    "intro": "Je weet wat je bedoelde. Je lezer ziet alleen wat je opschreef. Deze les maakt die twee perspectieven apart, zodat je een echte diagnose kunt stellen.",
    "discovery": {
      "prompt": "Je schreef: “Noor besprak de foto van Mila die gisteren was aangekomen.” Wat moet je eerst vaststellen?",
      "options": [
        "Of foto of Mila het bedoelde antecedent van die is",
        "Of Noor een korte naam heeft",
        "Of gisteren altijd voorop moet"
      ],
      "answer": 0,
      "feedback": [
        "Beide kandidaten kunnen grammaticaal passen. Bepaal welke mededeling je bedoelt.",
        "De lengte van een naam lost de aanhechting niet op.",
        "Gisteren kan op verschillende plaatsen staan; dat is hier niet de eerste diagnose."
      ]
    },
    "sections": [
      {
        "title": "Werk van de kern naar de keuzes",
        "paragraphs": [
          "Begin met de bewering die de lezer uit de zin moet halen. Schrijf haar in een eenvoudige versie op, zonder je oorspronkelijke formulering na te bootsen. Zet daar de aanvullende mededelingen naast. Dit geeft je een inhoudelijk anker. Je kunt later controleren of een mooiere versie werkelijk dezelfde informatie geeft.",
          "Zoek daarna de werkwoordelijke kern per deelzin. Gebruik de tijd- of getalproef waar die past en controleer de grenzen van een ingebedde bijzin. Wijs de kern van het onderwerp aan. Kijk pas daarna naar de juiste persoonsvorm en andere vormen. Zo herstel je de oorzaak van een congruentiefout in plaats van alleen een letter te vervangen.",
          "Bepaal groepen met meer dan één diagnose. Een naamwoordgroep kan lang zijn en een bijzin bevatten. Als je alleen het dichtstbijzijnde zelfstandig naamwoord als onderwerp kiest, wordt je vervoeging onbetrouwbaar. Maak de structuur daarom eerst zichtbaar met blokken of haakjes."
        ],
        "examples": [
          {
            "sentence": "De verzameling brieven die gisteren aankwamen, ligt op tafel.",
            "analysis": "Verzameling bestuurt ligt; brieven kan binnen de relatieve bijzin aankwamen besturen. Twee niveaus hebben eigen relaties."
          }
        ],
        "pitfall": "Een correctie op woordniveau kan een verkeerd begrepen zinsstructuur maskeren.",
        "takeaway": "Leg kernbewering en structuur vast vóór je losse vormen herstelt."
      },
      {
        "title": "Probeer een andere lezing tegen je eigen zin",
        "paragraphs": [
          "Schrijf bij een verdachte bepaling twee concrete interpretaties op. Wie kwam aan? Wie gebruikte de verrekijker? Over welke groep geldt de ontkenning? De tweede interpretatie moet echt bij de vorm passen. Een onwaarschijnlijk scenario kan grammaticaal nog steeds mogelijk zijn, maar niet ieder fantasieverhaal is een tweede taalkundige lezing.",
          "Controleer ook de reikwijdte van ontkenning, kwantoren en modaliteit. Niet alle deelnemers vertrokken laat toe dat sommigen bleven; geen deelnemer vertrok sluit vertrek van iedere deelnemer uit. Een kleine vormwijziging kan een grote inhoudswijziging zijn. Zet bij revisie expliciet neer welke situatie je wilt toestaan en uitsluiten.",
          "Loop ten slotte de aannames langs. Een woord als weer kan eerder optreden als bekend presenteren. De zin hoeft dat eerdere optreden niet als hoofdbewering te verdedigen. Vraag of je lezer die achtergrond werkelijk deelt. Wanneer niet, kun je de informatie eerst expliciet introduceren of een minder aannamevolle vorm kiezen."
        ],
        "examples": [
          {
            "sentence": "Niet alle studenten leverden de taak in.",
            "analysis": "Er is minstens één niet-inleveraar; de zin sluit niet uit dat anderen wél inleverden."
          },
          {
            "sentence": "De studenten leverden de taak weer te laat in.",
            "analysis": "Weer nodigt uit om een eerdere soortgelijke gebeurtenis als achtergrond te accepteren. Controleer of die achtergrond gerechtvaardigd is."
          }
        ],
        "pitfall": "Je eigen bedoeling voelt vanzelfsprekend, maar vormt geen bewijs dat een andere lezer dezelfde interpretatie kiest.",
        "takeaway": "Maak concurrerende lezingen en achtergrondinformatie expliciet."
      },
      {
        "title": "Leg de ingreep en de prijs vast",
        "paragraphs": [
          "Een revisie is controleerbaar wanneer je de ingreep kunt benoemen: ik herhaal het antecedent, verkort een afhankelijkheid, maak een participant zichtbaar of plaats de ontkenning dichter bij haar bereik. Noteer daarnaast de prijs. Je kunt een woord herhalen, een andere topic kiezen of een relatie over twee zinnen verdelen.",
          "Voer na elke grote ingreep een nieuwe vormcontrole uit. Een verplaatste bijzin in het voorveld vraagt de juiste plaats van de persoonsvorm in de hoofdzin. Een actieve herschrijving vraagt een passende uitvoerder. Een toegevoegd betrekkelijk voornaamwoord moet bij de bedoelde groep passen. Verbeteringen kunnen dus nieuwe fouten introduceren.",
          "Leg je tekst ten slotte kort weg of laat iemand anders de situatie terugvertellen. Vraag niet alleen of de zin mooi klinkt. Vraag wie wat deed, op welk moment en welke achtergrond als bekend werd aangenomen. Dat levert meer bruikbare informatie op dan een algemeen oordeel."
        ],
        "examples": [
          {
            "sentence": "Mila kwam gisteren aan. Noor besprak daarna haar foto.",
            "analysis": "Deze revisie maakt het aankomen van Mila expliciet, maar daarna voegt een tijdsvolgorde toe. Gebruik dat woord alleen als die volgorde klopt."
          }
        ],
        "pitfall": "Bij het oplossen van dubbelzinnigheid ongemerkt een nieuw tijds- of oorzakelijk verband toevoegen.",
        "takeaway": "Controleer na iedere ingreep opnieuw de vorm én de behouden inhoud."
      }
    ],
    "lab": {
      "kind": "compare",
      "prompt": "Welke diagnose past bij iedere revisie?",
      "variants": [
        {
          "label": "Verwijzing",
          "text": "Noor gaf Mila de map nadat Noor die had gelezen.",
          "analysis": "De herhaalde naam maakt de lezer expliciet. Controleer apart waar die naar verwijst."
        },
        {
          "label": "Ontkenning",
          "text": "Niet alle groepen hebben de taak afgerond.",
          "analysis": "Niet staat direct bij alle. De zin zegt niet dat geen enkele groep klaar is."
        },
        {
          "label": "Achtergrond",
          "text": "De groep kwam te laat.",
          "analysis": "Zonder weer leg je een eerdere herhaling niet op dezelfde manier als achtergrond neer."
        }
      ],
      "takeaway": "Eén vormprobleem vraagt niet altijd dezelfde soort ingreep."
    },
    "practice": [
      {
        "id": "volle-zin-herzien-h1",
        "kind": "choice",
        "prompt": "Wat controleer je voor vervoeging?",
        "options": [
          "Het langste woord in de zin",
          "De structurele kern van het onderwerp",
          "Het laatste woord voor de persoonsvorm"
        ],
        "answer": 1,
        "feedback": [
          "Woordlengte bepaalt geen congruentierelatie.",
          "De structurele kern is relevant voor gewone onderwerp-persoonsvormcongruentie.",
          "Het dichtstbijzijnde naamwoord kan binnen een bepaling of bijzin staan."
        ],
        "explanation": "De structurele kern is relevant voor gewone onderwerp-persoonsvormcongruentie.",
        "concept": "Congruentie",
        "hint": "Bepaal de kern van de volledige onderwerpsgroep."
      },
      {
        "id": "volle-zin-herzien-h2",
        "kind": "choice",
        "prompt": "Wat betekent “niet alle”?",
        "options": [
          "Minstens één uitzondering op alle",
          "Geen enkele",
          "Precies de helft"
        ],
        "answer": 0,
        "feedback": [
          "Niet alle ontkent de universele uitspraak, zonder een exact aantal te geven.",
          "Niet alle laat toe dat sommige deelnemers wel aan de eigenschap voldoen.",
          "De vorm noemt geen exacte verhouding of aantal uitzonderingen."
        ],
        "explanation": "Niet alle ontkent de universele uitspraak, zonder een exact aantal te geven.",
        "concept": "Bereik",
        "hint": "Vergelijk niet alle met geen enkele, zonder een exact aantal te verzinnen."
      },
      {
        "id": "volle-zin-herzien-h3",
        "kind": "choice",
        "prompt": "Welke revisie kan inhoud toevoegen?",
        "options": [
          "Een extra spatie verwijderen",
          "Een typografisch aanhalingsteken veranderen",
          "En vervangen door omdat"
        ],
        "answer": 2,
        "feedback": [
          "Een overbodige spatie verwijderen voegt hier geen redenrelatie toe.",
          "Een typografische tekenvariant verandert hier de bewering niet.",
          "Omdat legt een redenrelatie vast die en niet op dezelfde manier codeert."
        ],
        "explanation": "Omdat legt een redenrelatie vast die en niet op dezelfde manier codeert.",
        "concept": "Inhoud behouden",
        "hint": "Schrijf de mededelingen vóór en na de ingreep afzonderlijk op."
      },
      {
        "id": "volle-zin-herzien-h4",
        "kind": "choice",
        "prompt": "Wat vraag je een proeflezer?",
        "options": [
          "Ziet de pagina er vol uit?",
          "Wie deed wat en op welk moment?",
          "Kun je alle woorden tellen?"
        ],
        "answer": 1,
        "feedback": [
          "Hoe vol de pagina oogt, toetst de reconstructie van deze gebeurtenis niet.",
          "Laat de lezer de situatie reconstrueren om de interpretatie te toetsen.",
          "Woordtelling laat de bedoelde deelnemers en tijdsrelaties buiten beeld."
        ],
        "explanation": "Laat de lezer de situatie reconstrueren om de interpretatie te toetsen.",
        "concept": "Lezerscontrole",
        "hint": "Laat iemand de beschreven gebeurtenis in gewone taal terugvertellen."
      },
      {
        "id": "volle-zin-herzien-h5",
        "kind": "choice",
        "prompt": "Wat doe je na een grote verplaatsing?",
        "options": [
          "Opnieuw vorm, verwijzing en inhoud controleren",
          "Alleen de oorspronkelijke versie controleren",
          "Aannemen dat iedere revisie beter is"
        ],
        "answer": 0,
        "feedback": [
          "De ingreep kan nieuwe fouten of nieuwe lezingen introduceren.",
          "De nieuwe versie kan andere fouten of verwijzingen bevatten dan het origineel.",
          "Een ingreep kan één probleem oplossen en tegelijk een ander veroorzaken."
        ],
        "explanation": "De ingreep kan nieuwe fouten of nieuwe lezingen introduceren.",
        "concept": "Revisiecontrole",
        "hint": "Onderzoek na de ingreep ook de nieuwe structuur en nieuwe interpretaties."
      }
    ],
    "retrieval": [
      {
        "id": "volle-zin-herzien-r1",
        "kind": "choice",
        "prompt": "Een revisie lost verwijzing op maar voegt “daarom” toe. Wat check je?",
        "options": [
          "Of de redenrelatie gerechtvaardigd is",
          "Alleen het aantal letters",
          "Niets, verwijzing is alles"
        ],
        "answer": 0,
        "feedback": [
          "Verduidelijking van één relatie mag geen ongefundeerde andere relatie toevoegen.",
          "Een redenrelatie beoordeel je inhoudelijk, niet met een lettertelling.",
          "Verwijzing is één controle; daarom kan daarnaast een nieuwe reden claimen."
        ],
        "explanation": "Verduidelijking van één relatie mag geen ongefundeerde andere relatie toevoegen.",
        "concept": "Inhoud behouden",
        "hint": "Schrijf de mededelingen vóór en na de ingreep afzonderlijk op."
      },
      {
        "id": "volle-zin-herzien-r2",
        "kind": "choice",
        "prompt": "Waarom een tweede lezing uitschrijven?",
        "options": [
          "Om per definitie de langste zin te kiezen",
          "Om nooit context te gebruiken",
          "Om te zien of dezelfde vorm echt een andere situatie kan beschrijven"
        ],
        "answer": 2,
        "feedback": [
          "De tweede lezing onderzoekt betekenis, niet welke zin het langst is.",
          "Context kan lezingen helpen kiezen; je wilt eerst weten welke de vorm toelaat.",
          "Een expliciete alternatieve interpretatie maakt de ambiguïteitsclaim toetsbaar."
        ],
        "explanation": "Een expliciete alternatieve interpretatie maakt de ambiguïteitsclaim toetsbaar.",
        "concept": "Interpretatie",
        "hint": "Geef twee concrete situaties die de formulering kan toelaten."
      }
    ],
    "transfer": {
      "prompt": "Neem een eigen zin van minstens twee deelzinnen. Noteer je kernbewering, één grammaticale test, één mogelijke verkeerde lezing en één achtergrondaanname. Schrijf een revisie en verklaar de winst en de prijs.",
      "checklist": [
        "Ik kan de kernbewering in gewone taal terugvertellen.",
        "Een grammaticale test ondersteunt mijn analyse.",
        "De revisie sluit de ongewenste interpretatie beter uit.",
        "Ik heb geen nieuwe zekerheid, reden of tijdsvolgorde toegevoegd zonder grond."
      ],
      "model": "Origineel: Noor zag de foto van Mila die gisteren was aangekomen. Bedoeling: Mila kwam aan. Revisie: Mila kwam gisteren aan. Noor zag haar foto. De aankomst is expliciet aan Mila gekoppeld; de relatie tussen de twee zinnen moet uit de context blijken. Ik voeg geen “daarom” toe, want een oorzaak is niet gegeven."
    },
    "recap": [
      "Verbind inhoudsanalyse aan grammaticale proeven.",
      "Test je tekst tegen een andere mogelijke lezing.",
      "Onderzoek wat als bekend wordt gepresenteerd.",
      "Benoem de winst en de prijs van je revisie."
    ],
    "sources": [
      {
        "bookId": "ontleed",
        "section": "Schrijfcheck en zinscombineren",
        "note": "Zelf onderzoeken; een teller vervangt geen analyse."
      },
      {
        "bookId": "leerlijn",
        "section": "§10–16",
        "note": "Verwijzing, betekenis en revisie in eigen tekst."
      },
      {
        "bookId": "kroeger",
        "section": "Hfst. 3, 8 en 14",
        "note": "Gevolgtrekking en reikwijdte."
      }
    ]
  },
  {
    "id": "volle-zin-meesterproef",
    "title": "Bouw en verdedig je volle zin",
    "subtitle": "Alle gereedschappen samen, zonder één verplichte modelzin.",
    "part": "volle-zin",
    "minutes": 35,
    "level": "meesterschap",
    "prerequisites": [
      "volle-zin-combineren",
      "volle-zin-herzien",
      "betekenis-register"
    ],
    "goal": "Je produceert en verantwoordt een complexe Nederlandse zin met passende structuur, precieze inhoud en een duidelijke lezerkeuze.",
    "intro": "Je krijgt inhoud en een lezer. Jij kiest de constructie. De proef is niet of je een model kunt raden, maar of je elke belangrijke keuze kunt onderbouwen.",
    "discovery": {
      "prompt": "Welke eindprestatie laat het meeste zien van je begrip?",
      "options": [
        "Een complexe zin schrijven en de structuur, inhoud en revisiekeuzes verklaren",
        "De langste zin zonder punt maken",
        "Alle termen in alfabetische volgorde opzeggen"
      ],
      "answer": 0,
      "feedback": [
        "Productie plus onderbouwde uitleg gebruikt de verschillende kennislagen samen.",
        "Lengte zegt niet of de structuur of boodschap geslaagd is.",
        "Termen kunnen helpen, maar vervangen de toepassing op je eigen zin niet."
      ]
    },
    "sections": [
      {
        "title": "Een opdracht heeft ook een informatiecontract",
        "paragraphs": [
          "Lees het materiaal als een klein contract. Wat moet de lezer na afloop weten? Welke deelnemers, gebeurtenissen en relaties zijn gegeven? Welke zekerheid heeft elke mededeling? Zet dit op papier vóór je formuleert. Daarmee voorkom je dat je tijdens een ingewikkelde constructie een belangrijk feit laat verdwijnen.",
          "Bepaal de lezer en het vertrekpunt. Een collega die het dossier al kent heeft andere voorkennis dan een bezoeker die voor het eerst van de situatie hoort. Je kunt dezelfde feiten daarom verschillend ordenen zonder onwaar te worden. De relevante vraag is welke informatie je beschikbaar maakt op het moment dat de lezer haar nodig heeft.",
          "Een beperking kan inhoudelijk of stilistisch zijn. Gebruik minstens één bijzin is een vormopdracht. Maak duidelijk waarom het gesprek is uitgesteld is een inhoudsopdracht. Beide kunnen zinvol zijn, maar je moet ze afzonderlijk controleren. Een fraai geplaatste bijzin bewijst nog niet dat de reden voor uitstel is verteld."
        ],
        "examples": [
          {
            "sentence": "Gegeven: de vergadering is uitgesteld; twee leden zijn afwezig; de afwezigheid is de reden.",
            "analysis": "Hier mag je de reden met omdat expliciteren. Zonder de laatste gegeven relatie zou dat extra interpretatie zijn."
          }
        ],
        "pitfall": "Een vormeis afvinken en daardoor een ontbrekende mededeling over het hoofd zien.",
        "takeaway": "Maak een lijst van inhoud, relaties, zekerheid en lezer."
      },
      {
        "title": "Bouw een versie en maak je bewijs zichtbaar",
        "paragraphs": [
          "Bouw eerst een versie die de inhoud duidelijk draagt. Voeg pas daarna complexiteit toe waar die helpt. Een redenkader voorop kan het besluit begrijpelijk maken; een relatieve bijzin kan de bedoelde deelnemers identificeren. Niet ieder feit hoeft in een aparte bijzin en niet ieder feit hoeft in dezelfde zin.",
          "Markeer per eindige deelzin de persoonsvorm en het onderwerp. Groepeer de naamwoordgroepen en benoem ten minste één test die je groepering ondersteunt. Noteer de hoofdzinvelden. Bij een relatieve bijzin beschrijf je daarnaast de interne functie van de betrekkelijke vorm. Zo maak je zichtbaar dat een eenheid op twee verschillende niveaus relaties kan hebben.",
          "Verdedig ook een betekenisbeslissing. Waarom staat niet bij alle? Waarom koos je moeten in plaats van kunnen? Wat presenteert weer als bekend? Je hoeft geen logische formule te tekenen om precies te zijn. Twee concrete situaties kunnen genoeg zijn om te tonen wat de ene versie wel toelaat en de andere niet."
        ],
        "examples": [
          {
            "sentence": "Omdat twee leden afwezig zijn, is de vergadering die voor vanmiddag gepland stond, uitgesteld.",
            "analysis": "Een redenkader vult het voorveld. Zijn hoort bij twee leden; is bij de vergadering; stond bij de relatieve bijzin. De beperkende relatieve bijzin identificeert welke vergadering."
          }
        ],
        "pitfall": "Eén onderwerp of één persoonsvorm voor de hele samengestelde zin aanwijzen.",
        "takeaway": "Onderbouw structuur per deelzin en betekenis met concrete situaties."
      },
      {
        "title": "Herzie voor een echte lezer en plan de volgende poging",
        "paragraphs": [
          "Maak nu een tweede versie voor dezelfde inhoud. Verander één belangrijke keuze: zet een andere topic voorop, maak een passief actief of splits één relatie af. Houd bij wat er met de informatieverdeling gebeurt. De beste versie hoeft niet de eerste en ook niet de kortste te zijn.",
          "Controleer de vergelijking met je informatiecontract. Beide versies moeten de gegeven feiten en zekerheid behouden. Als een versie een actor toevoegt die niet bekend is, is dat geen louter stilistische winst. Als je een reden over twee zinnen verdeelt, moet de relatie nog steeds duidelijk zijn zonder haar sterker te maken dan de gegevens toelaten.",
          "Sluit af met een specifieke volgende oefening. Misschien kost onderwerpcongruentie nog moeite, misschien bereik of aanhechting. Kies één begrip en haal dat later met een nieuwe zin op. Je eindproduct is een momentopname van wat je vandaag kunt; uitleggen, zelfstandig produceren en vertraagd opnieuw toepassen leveren samen een vollediger beeld van je begrip."
        ],
        "examples": [
          {
            "sentence": "De vergadering van vanmiddag is uitgesteld, omdat twee leden afwezig zijn.",
            "analysis": "Deze versie noemt de vergadering eerder en vervangt de relatieve bijzin door een kortere naamwoordgroep. Controleer of van vanmiddag dezelfde identificatie geeft als de oorspronkelijke opdracht."
          }
        ],
        "pitfall": "Een geslaagde eindzin als bewijs beschouwen dat elk onderliggend begrip voor altijd beheerst is.",
        "takeaway": "Vergelijk versies en kies een concreet begrip voor latere zelfstandige toepassing."
      }
    ],
    "lab": {
      "kind": "compare",
      "prompt": "Drie verdedigbare vormen, met verschillende vertrekpunten.",
      "variants": [
        {
          "label": "Reden voorop",
          "text": "Omdat twee leden afwezig zijn, is de vergadering uitgesteld.",
          "analysis": "De reden biedt het kader; de hoofdzin vraagt is vóór de vergadering."
        },
        {
          "label": "Besluit voorop",
          "text": "De vergadering is uitgesteld omdat twee leden afwezig zijn.",
          "analysis": "Het besluit komt eerst. De reden wordt daarna ingebed."
        },
        {
          "label": "Twee mededelingen",
          "text": "Twee leden zijn afwezig. Daarom is de vergadering uitgesteld.",
          "analysis": "De expliciete redenrelatie verhuist naar daarom in de tweede zin. Beide mededelingen blijven zichtbaar."
        }
      ],
      "takeaway": "Kies voor een lezer en controleer welke informatie als kader verschijnt."
    },
    "practice": [
      {
        "id": "volle-zin-meesterproef-m1",
        "kind": "order",
        "prompt": "Bouw de zin met het redenkader voorop.",
        "tokens": [
          "is",
          "de vergadering",
          "Omdat twee leden afwezig zijn,",
          "uitgesteld."
        ],
        "accept": [
          "Omdat twee leden afwezig zijn, is de vergadering uitgesteld."
        ],
        "explanation": "De gehele omdat-bijzin is één voorvelddeel; de persoonsvorm is volgt daarop.",
        "concept": "V2",
        "hint": "Kies één volledig zinsdeel voor het voorveld. Zoek daarna de persoonsvorm."
      },
      {
        "id": "volle-zin-meesterproef-m2",
        "kind": "choice",
        "prompt": "Welke drie persoonsvormen staan in de voorbeeldzin met de vergadering die gepland stond?",
        "options": [
          "gepland, uitgesteld, omdat",
          "zijn, is, stond",
          "leden, vergadering, middag"
        ],
        "answer": 1,
        "feedback": [
          "Gepland en uitgesteld zijn deelwoorden; omdat is een voegwoord.",
          "De drie eindige deelzinnen hebben elk hun eigen persoonsvorm.",
          "Leden, vergadering en middag zijn naamwoorden, geen finiete werkwoordvormen."
        ],
        "explanation": "De drie eindige deelzinnen hebben elk hun eigen persoonsvorm.",
        "concept": "Deelzinnen",
        "hint": "Lees de voorbeeldzin per finiete deelzin en zoek telkens de vervoegde vorm."
      },
      {
        "id": "volle-zin-meesterproef-m3",
        "kind": "choice",
        "prompt": "Wat hoort in je informatiecontract?",
        "options": [
          "De gegeven feiten, relaties, zekerheid en lezer",
          "Alleen het gewenste woordenaantal",
          "Alleen de favoriete woordsoort"
        ],
        "answer": 0,
        "feedback": [
          "Zo kun je vorm en inhoud afzonderlijk controleren.",
          "Een woordenaantal vertelt niet of de noodzakelijke feiten en zekerheid behouden blijven.",
          "Een favoriete woordsoort bepaalt het informatiecontract niet."
        ],
        "explanation": "Zo kun je vorm en inhoud afzonderlijk controleren.",
        "concept": "Inhoud behouden",
        "hint": "Schrijf de mededelingen vóór en na de ingreep afzonderlijk op."
      },
      {
        "id": "volle-zin-meesterproef-m4",
        "kind": "choice",
        "prompt": "Wat vergelijk je bij actief en passief?",
        "options": [
          "Of passief altijd fout is",
          "Of iedere zin precies even lang is",
          "Topic, relevante deelnemers en behouden gebeurtenis"
        ],
        "answer": 2,
        "feedback": [
          "Passief kan een passende topicstructuur geven; een algemeen verbod mist dat doel.",
          "Gelijke lengte garandeert geen gelijke deelnemers of informatieverdeling.",
          "De constructies organiseren deelnemers en informatie anders."
        ],
        "explanation": "De constructies organiseren deelnemers en informatie anders.",
        "concept": "Lezerskeuze",
        "hint": "Vergelijk vertrekpunt, uitvoerder en beschreven gebeurtenis."
      },
      {
        "id": "volle-zin-meesterproef-m5",
        "kind": "choice",
        "prompt": "Wat is een goede vervolgactie na de meesterproef?",
        "options": [
          "Alleen dezelfde modelzin onthouden",
          "Een lastig begrip later met een nieuwe zin opnieuw toepassen",
          "Nooit meer oefenen"
        ],
        "answer": 1,
        "feedback": [
          "Dezelfde modelzin onthouden toont nog geen zelfstandige toepassing in een nieuwe situatie.",
          "Nieuwe toepassing na een afstand laat meer zien dan herhalen van hetzelfde antwoord.",
          "Een eindproduct bewijst geen blijvende beheersing van alle onderliggende begrippen."
        ],
        "explanation": "Nieuwe toepassing na een afstand laat meer zien dan herhalen van hetzelfde antwoord.",
        "concept": "Zelfstandig toepassen",
        "hint": "Kies een nieuwe context waarin je het lastige begrip opnieuw moet gebruiken."
      }
    ],
    "retrieval": [
      {
        "id": "volle-zin-meesterproef-r1",
        "kind": "choice",
        "prompt": "Je tweede versie voegt een onbekende uitvoerder toe. Is dat alleen stijl?",
        "options": [
          "Nee, er wordt informatie toegevoegd.",
          "Ja, actieve zinnen zijn altijd gelijkwaardig.",
          "Ja, als de zin korter is."
        ],
        "answer": 0,
        "feedback": [
          "Een toegevoegde participant kan een nieuwe claim zijn.",
          "Een actieve vorm met een verzonnen actor bevat een extra inhoudelijke claim.",
          "Korter zijn rechtvaardigt geen toegevoegde informatie."
        ],
        "explanation": "Een toegevoegde participant kan een nieuwe claim zijn.",
        "concept": "Inhoud behouden",
        "hint": "Schrijf de mededelingen vóór en na de ingreep afzonderlijk op."
      },
      {
        "id": "volle-zin-meesterproef-r2",
        "kind": "order",
        "prompt": "Maak een nieuwe V2-hoofdzin met een kader.",
        "tokens": [
          "morgen",
          "Daarom",
          "begint",
          "de nieuwe ronde."
        ],
        "accept": [
          "Daarom begint morgen de nieuwe ronde."
        ],
        "explanation": "Daarom vult het voorveld; begint is de persoonsvorm. De natuurlijke versie plaatst morgen bij de verdere mededeling.",
        "concept": "V2",
        "hint": "Kies één volledig zinsdeel voor het voorveld. Zoek daarna de persoonsvorm."
      }
    ],
    "transfer": {
      "prompt": "Voor een collega moet je overbrengen: de vergadering stond voor vanmiddag gepland; twee leden zijn afwezig; hun afwezigheid is de reden voor uitstel; de nieuwe datum is nog onbekend. Schrijf twee versies, waarvan één met een bijzin. Noteer per deelzin de persoonsvorm en het onderwerp. Verklaar één betekenis- en één lezerkeuze. Kies je beste versie.",
      "checklist": [
        "Alle vier gegeven feiten en hun zekerheid zijn behouden.",
        "De werkwoordplaatsing en congruentie zijn per deelzin gecontroleerd.",
        "Bepalingen en verwijswoorden hebben een bedoelde, herkenbare relatie.",
        "Ik heb een inhoudelijke keuze én een informatievolgorde verantwoord.",
        "Ik benoem één begrip dat ik later opnieuw wil toepassen."
      ],
      "model": "Omdat twee leden afwezig zijn, is de vergadering van vanmiddag uitgesteld; de nieuwe datum is nog onbekend. Onderwerpen: twee leden bij zijn, de vergadering bij is, de nieuwe datum bij is. De reden staat als kader voorop. Nog onbekend voorkomt dat de lezer een al vastgelegde datum veronderstelt. Een alternatief kan de vergadering eerst noemen en de reden daarna geven."
    },
    "recap": [
      "Een volle zin is een samenstel van onderbouwde keuzes.",
      "Vorm, functie, rol en betekenis blijven verschillende vragen.",
      "Behoud feiten en zekerheid tijdens iedere revisie.",
      "Gebruik nieuwe situaties om je begrip later opnieuw te toetsen."
    ],
    "sources": [
      {
        "bookId": "natural-syntax",
        "section": "H3–6 en H8–15",
        "note": "Constituenten en clauzehiërarchie."
      },
      {
        "bookId": "tallerman",
        "section": "H3–6 en H7–8",
        "note": "Grammaticale functies en inbedding."
      },
      {
        "bookId": "kroeger",
        "section": "H8; H14; H16 pp.293–316",
        "note": "Implicaturen, kwantorbereik en modaliteit helpen de inhoudelijke keuzes controleren."
      },
      {
        "bookId": "leerlijn",
        "section": "§15–16",
        "note": "Opbouw en controle van eigen volledige zinnen."
      }
    ]
  }
];
