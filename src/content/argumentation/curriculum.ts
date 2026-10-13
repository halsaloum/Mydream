import type { ArgumentModule, ArgumentLesson } from './types';

// Original Dutch cases for practical reasoning and leadership communication.
export const argumentModules: ArgumentModule[] = [
  {
    "id": "basis",
    "title": "Argumenten herkennen en helder verwoorden",
    "subtitle": "Van reden naar standpunt",
    "description": "Leer redenen herkennen, verborgen aannames toetsen en argumenten in een helder schema plaatsen. Diagnoseer een probleem en maak het argument beter.",
    "accent": "blue"
  },
  {
    "id": "bachelor",
    "title": "Drogredenen en overtuigende taal",
    "subtitle": "Kritiek die een gesprek beter maakt",
    "description": "Beoordeel persoonlijke aanvallen, stropoppen en valse dilemma’s in hun context. Toets deskundigheid, analogieën en bewijs voor beslissingen.",
    "accent": "orange"
  },
  {
    "id": "master",
    "title": "Leidinggeven met sterke argumenten",
    "subtitle": "Besluiten, tegenspraak en onzekerheid",
    "description": "Maak voorstellen helder met Toulmin, verdeel de bewijslast eerlijk, weeg tegenargumenten en belangen en leg besluiten onder onzekerheid uit.",
    "accent": "purple"
  }
];

export const argumentLessons: ArgumentLesson[] = [
  {
    "id": "basis-standpunt-en-reden",
    "moduleId": "basis",
    "title": "Eerst: wat is het standpunt en wat is de reden?",
    "teaser": "Begin met twee eenvoudige vragen: wat wil iemand, en waarom?",
    "minutes": 8,
    "objectives": [
      "Een standpunt in een korte zin herkennen.",
      "De reden aanwijzen die het standpunt ondersteunt.",
      "Een losse mening onderscheiden van een mening met een reden."
    ],
    "sections": [
      {
        "title": "Wat wil iemand dat je aanneemt?",
        "body": "Een standpunt is wat iemand wil verdedigen. Bijvoorbeeld: “We moeten de pauze later houden.” De reden vertelt waarom die keuze volgens de spreker goed is: “Dan kan iedereen aansluiten.” Samen vormen ze een argument. Je hoeft het nog niet eens te zijn met de keuze. Zoek eerst rustig de twee onderdelen: wat wordt voorgesteld, en wat wordt als reden gegeven?",
        "example": "“We moeten de pauze later houden, want dan kan iedereen aansluiten.” Standpunt: later pauzeren. Reden: iedereen kan aansluiten.",
        "takeaway": "Vraag eerst: wat wil de spreker dat ik aanneem?"
      },
      {
        "title": "Een reden kan vóór of na het standpunt staan",
        "body": "De volgorde kan veranderen. “Iedereen kan dan aansluiten, dus we moeten de pauze later houden” heeft dezelfde gedachte. Woorden als “want”, “omdat” en “dus” helpen je zoeken. Ze zijn aanwijzingen. Soms ontbreekt zo’n woord: “Houd de pauze later. Dan kan iedereen aansluiten.” En soms krijg je alleen een mening: “Een latere pauze is fijn.” Vraag dan welke reden erbij hoort.",
        "example": "“Deze zaal is rustiger. Laten we hier overleggen.” De eerste zin geeft een reden voor de keuze in de tweede zin.",
        "takeaway": "Een argument geeft een reden voor een standpunt. Alleen een mening is nog geen gegeven argument."
      }
    ],
    "deepDive": {
      "title": "Verdieping: een standpunt krijgt zijn rol in het gesprek",
      "body": "Een standpunt is de uitspraak die iemand op dat moment probeert te verdedigen. Een reden ondersteunt die uitspraak. Die rollen zijn relatief: een uitspraak kan eerst zelf ondersteuning krijgen en vervolgens als reden voor een volgende keuze dienen. “De planning is te krap, omdat twee taken overlappen; daarom moeten we de deadline verschuiven” bevat zo een tussenstap. De krappe planning is eerst een conclusie en daarna een reden voor het deadlinevoorstel.\n\nBepaal daarom niet alleen welke woorden in een zin staan, maar ook welke vraag het gesprek probeert te beantwoorden. Wanneer iedereen weet dat een levering te laat was, kan een adresfout de vertraging verklaren. Wanneer de vertraging wordt betwijfeld, kan dezelfde informatie een reden geven om haar te geloven. Een praktische aanbeveling vraagt daarna weer een eigen verbinding tussen het probleem en de voorgestelde oplossing.\n\nReconstructie betekent dat je deze gedachtegang zo eerlijk mogelijk zichtbaar maakt. Gebruik zelfstandige uitspraken, behoud beperkingen zoals “waarschijnlijk” en “voor deze groep”, en onderscheid genoemde redenen van wat je zelf aanvult. Welwillend luisteren betekent een serieuze, herkenbare versie zoeken. Het betekent niet dat je extra bewijs mag verzinnen of een bescheiden voorstel tot een algemene garantie maakt.\n\nTen slotte blijft herkennen iets anders dan goedkeuren. Een slechte reden kan nog steeds als argument worden aangeboden. Een losse zin kan in een gedeelde context impliciete steun hebben die niet letterlijk is uitgeschreven. Vraag dus eerst wat de spreker bedoelt, daarna wat de redenen dragen. Met die volgorde wordt kritiek nauwkeurig in plaats van alleen stellig."
    },
    "exercises": [
      {
        "id": "intro1-standpunt",
        "kind": "choice",
        "prompt": "Wat is hier het standpunt?",
        "scenario": "“We moeten eerder bestellen, want de levering duurt lang.”",
        "explanation": "Het standpunt is de voorgestelde keuze; de levertijd is de reden.",
        "options": [
          {
            "id": "intro1-standpunt-o1",
            "text": "We moeten eerder bestellen.",
            "feedback": "Juist: dit is wat de spreker voorstelt."
          },
          {
            "id": "intro1-standpunt-o2",
            "text": "De levering duurt lang.",
            "feedback": "Dit is de reden voor eerder bestellen."
          },
          {
            "id": "intro1-standpunt-o3",
            "text": "Bestellen kan op maandag.",
            "feedback": "Deze informatie staat niet in de gegeven zin."
          }
        ],
        "answer": "intro1-standpunt-o1"
      },
      {
        "id": "intro1-reden",
        "kind": "choice",
        "prompt": "Wat is de reden?",
        "scenario": "“Gebruik deze kamer. Hier is minder lawaai.”",
        "explanation": "Minder lawaai ondersteunt de keuze voor deze kamer.",
        "options": [
          {
            "id": "intro1-reden-o1",
            "text": "Gebruik deze kamer.",
            "feedback": "Dit is het voorstel, niet de gegeven reden."
          },
          {
            "id": "intro1-reden-o2",
            "text": "Hier is minder lawaai.",
            "feedback": "Juist: dit geeft aan waarom de kamer geschikt wordt gevonden."
          },
          {
            "id": "intro1-reden-o3",
            "text": "Iedere kamer is hetzelfde.",
            "feedback": "Dat zegt de spreker niet en het ondersteunt deze keuze niet."
          }
        ],
        "answer": "intro1-reden-o2"
      },
      {
        "id": "intro1-mening",
        "kind": "choice",
        "prompt": "Welke zin geeft een mening met een reden?",
        "scenario": "Lees de drie korte uitspraken.",
        "explanation": "Bij een argument staat een reden die het standpunt moet ondersteunen.",
        "options": [
          {
            "id": "intro1-mening-o1",
            "text": "Een vroeg overleg is fijn.",
            "feedback": "Dit is een waardering zonder genoemde reden."
          },
          {
            "id": "intro1-mening-o2",
            "text": "Het overleg begint om negen uur.",
            "feedback": "Dit is een losse beschrijving."
          },
          {
            "id": "intro1-mening-o3",
            "text": "Een vroeg overleg is handig, want daarna hebben we tijd om de afspraken uit te voeren.",
            "feedback": "Juist: de uitvoeringstijd is de reden voor het vroege overleg."
          }
        ],
        "answer": "intro1-mening-o3"
      },
      {
        "id": "intro1-kaartjes",
        "kind": "sort",
        "prompt": "Plaats het standpunt bij de reden.",
        "explanation": "De standpunten zeggen wat iemand wil verdedigen; de redenen geven het waarom.",
        "categories": [
          {
            "id": "standpunt",
            "label": "Standpunt"
          },
          {
            "id": "reden",
            "label": "Reden"
          }
        ],
        "cards": [
          {
            "id": "intro1-kaartjes-c1",
            "text": "We moeten deze ruimte kiezen.",
            "category": "standpunt"
          },
          {
            "id": "intro1-kaartjes-c2",
            "text": "In deze ruimte kunnen alle collega’s zitten.",
            "category": "reden"
          },
          {
            "id": "intro1-kaartjes-c3",
            "text": "Laten we de uitleg korter maken.",
            "category": "standpunt"
          },
          {
            "id": "intro1-kaartjes-c4",
            "text": "Dan blijft er tijd voor vragen.",
            "category": "reden"
          }
        ]
      }
    ],
    "sourceIds": [
      "govier",
      "groarke"
    ],
    "introductory": true
  },
  {
    "id": "basis-redenen-beoordelen",
    "moduleId": "basis",
    "title": "Is die reden eigenlijk goed?",
    "teaser": "Bekijk één reden met drie korte vragen.",
    "minutes": 12,
    "objectives": [
      "Nagaan of een reden te vertrouwen is.",
      "Nagaan of de reden iets zegt over het standpunt.",
      "Een sterke conclusie begrenzen wanneer de steun klein is."
    ],
    "sections": [
      {
        "title": "Kun je de reden vertrouwen, en helpt zij hier?",
        "body": "Je hebt een standpunt en een reden gevonden. Stel nu twee vragen. Eerst: hebben we goede grond om de reden te geloven? Een zichtbaar rooster is bijvoorbeeld beter te controleren dan een onbekend gerucht. Daarna: zegt deze reden iets over de keuze? “De zaal is groot genoeg” helpt bij een keuze voor een groepsbijeenkomst. “De zaal heeft een leuke naam” helpt daarvoor meestal weinig.",
        "example": "“Deze zaal past, want er zijn dertig stoelen.” Controleer het aantal en vraag hoeveel mensen komen.",
        "takeaway": "Een goede reden is geloofwaardig én past bij de vraag."
      },
      {
        "title": "Is de reden sterk genoeg voor deze conclusie?",
        "body": "Een reden kan iets nuttigs zeggen en toch niet genoeg zijn. Eén tevreden klant bewijst niet dat alle klanten tevreden zijn. De reden is niet waardeloos: zij zegt iets over die ene klant. Maak de conclusie daarom kleiner of vraag meer informatie. Let ook op andere belangrijke voorwaarden. Genoeg stoelen maken een zaal geschikt voor de groepsgrootte, maar bereikbaarheid of geluid kunnen ook meetellen.",
        "example": "“Eén collega vindt de nieuwe planning fijn” ondersteunt diens ervaring. Het bewijst niet dat iedereen ermee geholpen is.",
        "takeaway": "Vraag: hoeveel mag ik op basis van deze reden concluderen?"
      }
    ],
    "deepDive": {
      "title": "Verdieping: aanvaardbaarheid, relevantie en voldoende steun",
      "body": "De drie eenvoudige vragen onderscheiden verschillende taken. Aanvaardbaarheid gaat over de redenen zelf: hebben we goede grond om ze in dit gesprek te geloven? Een reden hoeft daarvoor niet absoluut zeker te zijn. Een zorgvuldig bijgehouden rooster kan een voorlopige verwachting rechtvaardigen, terwijl een actueel annuleringbericht die verwachting verandert. Benoem dus ook welke informatie het vertrouwen ondersteunt en welke onzekerheid blijft.\n\nRelevantie gaat over de verbinding met de conclusie. Een uitspraak kan waar zijn en toch niets zeggen over de voorgestelde keuze. Een prettige stem bewijst bijvoorbeeld niet dat een kostenraming klopt. Informatie over passende ervaring kan daarentegen relevant zijn wanneer een conclusie uitsluitend op een deskundigenoordeel steunt. De plaats van die informatie in het argument maakt het verschil.\n\nVoldoende steun vraagt vervolgens of de relevante redenen gezamenlijk genoeg dragen voor de precieze conclusie. Eén gunstige ervaring kan relevant zijn zonder een algemene claim over iedereen te rechtvaardigen. Een groot aantal berichten kan ook dezelfde oorspronkelijke bron herhalen. Tel dan geen onafhankelijke bevestigingen die er niet zijn. Vergelijk bovendien de sterkte van het bewijs met de grootte, gevolgen en herstelbaarheid van de voorgestelde beslissing.\n\nDeze voorwaarden zijn dus geen losse vinkjes. Controleer eerst de inhoud, dan de verbinding en daarna de gezamenlijke kracht. Een gerichte kritiek kan de conclusie beperken in plaats van haar volledig verwerpen. “Dit ondersteunt een kleine proef, maar nog geen algemene verplichting” is vaak preciezer dan alleen “goed” of “fout”. Het toont welke verdere reden of voorwaarde nodig is om verantwoord door te gaan."
    },
    "exercises": [
      {
        "id": "intro2-betrouwbaar",
        "kind": "choice",
        "prompt": "Welke vraag helpt deze reden te controleren?",
        "scenario": "“We moeten verhuizen naar zaal B, want daar passen meer mensen.”",
        "explanation": "De capaciteit is een feitelijke reden die je gericht kunt controleren.",
        "options": [
          {
            "id": "intro2-betrouwbaar-o1",
            "text": "Hoeveel plaatsen zijn er in zaal B en hoeveel mensen verwachten we?",
            "feedback": "Juist: dit controleert het genoemde voordeel."
          },
          {
            "id": "intro2-betrouwbaar-o2",
            "text": "Vind je zaal B een mooiere naam?",
            "feedback": "Dat controleert het aantal plaatsen niet."
          },
          {
            "id": "intro2-betrouwbaar-o3",
            "text": "Waarom ben je zo vervelend?",
            "feedback": "Dat valt de persoon aan en beoordeelt de reden niet."
          }
        ],
        "answer": "intro2-betrouwbaar-o1"
      },
      {
        "id": "intro2-sterkte",
        "kind": "choice",
        "prompt": "Welke conclusie past bij deze informatie?",
        "scenario": "Eén klant vertelt dat de nieuwe uitleg duidelijk was.",
        "explanation": "Eén ervaring rechtvaardigt een beperkte conclusie, geen uitspraak over alle klanten.",
        "options": [
          {
            "id": "intro2-sterkte-o1",
            "text": "Alle klanten begrijpen de uitleg.",
            "feedback": "Dat is meer dan deze ene ervaring laat zien."
          },
          {
            "id": "intro2-sterkte-o2",
            "text": "Deze klant vond de uitleg duidelijk.",
            "feedback": "Juist: dit blijft binnen de gegeven informatie."
          },
          {
            "id": "intro2-sterkte-o3",
            "text": "Geen klant kan de uitleg begrijpen.",
            "feedback": "Dat spreekt juist de gegeven ervaring tegen."
          }
        ],
        "answer": "intro2-sterkte-o2"
      },
      {
        "id": "intro2-vragen",
        "kind": "sort",
        "prompt": "Koppel de reactie aan de juiste vraag.",
        "explanation": "De reacties beoordelen betrouwbaarheid, relevantie of voldoende steun.",
        "categories": [
          {
            "id": "vertrouwen",
            "label": "Kunnen we de reden vertrouwen?"
          },
          {
            "id": "passen",
            "label": "Past de reden bij de keuze?"
          },
          {
            "id": "genoeg",
            "label": "Is de steun groot genoeg?"
          }
        ],
        "cards": [
          {
            "id": "intro2-vragen-c1",
            "text": "Waar staat dat er dertig stoelen zijn?",
            "category": "vertrouwen"
          },
          {
            "id": "intro2-vragen-c2",
            "text": "Een mooie naam zegt weinig over hoeveel mensen erin passen.",
            "category": "passen"
          },
          {
            "id": "intro2-vragen-c3",
            "text": "Dertig stoelen helpen, maar we moeten ook de bereikbaarheid bekijken.",
            "category": "genoeg"
          }
        ]
      },
      {
        "id": "intro2-jouw-vraag",
        "kind": "reflection",
        "prompt": "Schrijf één eerlijke vraag over de reden en leg kort uit waarom je haar stelt.",
        "scenario": "Een collega zegt: “Iedereen wil deze planning, want ik heb twee mensen gesproken.”",
        "explanation": "De vraag moet het verschil tussen twee gesprekken en iedereen zichtbaar maken.",
        "model": "Welke collega’s heb je gesproken, en hebben anderen hun voorkeur ook gegeven? Twee reacties zeggen iets over die mensen, maar nog niet over iedereen. Ik zou de conclusie voorlopig beperken en de andere collega’s ook om hun reactie vragen.",
        "rubric": [
          "Je richt je op de reden, niet op de persoon.",
          "Je legt uit waarom twee reacties niet iedereen vertegenwoordigen."
        ],
        "minWords": 20
      }
    ],
    "sourceIds": [
      "govier",
      "groarke"
    ],
    "introductory": true
  },
  {
    "id": "basis-verzwegen-stap",
    "moduleId": "basis",
    "title": "Welke stap zegt iemand niet hardop?",
    "teaser": "Vul één kleine brug in tussen een reden en een voorstel.",
    "minutes": 15,
    "objectives": [
      "Een niet uitgesproken verbindingsstap herkennen.",
      "Een passende brug formuleren zonder de spreker sterker te maken.",
      "Een vraag stellen over die brug."
    ],
    "sections": [
      {
        "title": "Soms ontbreekt de verbinding",
        "body": "“Bel Noor, want zij heeft vandaag dienst.” De reden is dat Noor dienst heeft. Het voorstel is haar bellen. Daartussen zit een stap die niet hardop wordt gezegd: dit probleem hoort bij de collega die dienst heeft. Die stap maakt begrijpelijk waarom de reden het voorstel ondersteunt. Je kunt haar als vraag formuleren: “Is de dienstdoende collega degene die dit probleem moet behandelen?”",
        "example": "“Zij heeft dienst” ondersteunt bellen alleen als dit probleem binnen haar rol valt.",
        "takeaway": "Vraag welke verbinding nodig is om van de reden naar het voorstel te gaan."
      },
      {
        "title": "Aanvullen is nog niet hetzelfde als goedkeuren",
        "body": "Een ontbrekende stap kan heel redelijk zijn, maar ook twijfelachtig. Vul daarom niet zomaar de beste denkbare regel in. Zoek een stap die bij de woorden en situatie past. “Deze taak is belangrijk, dus Sam moet haar doen” zegt nog niet waarom juist Sam geschikt is. Misschien heeft Sam de benodigde ervaring. Misschien is dat nog onbekend. Maak de aanname zichtbaar en vraag of zij klopt.",
        "example": "Een passende vraag is: “Waarom past deze taak bij Sam?” Je hoeft Sam niet meteen geschikt of ongeschikt te noemen.",
        "takeaway": "Maak de aanname zichtbaar voordat je beslist of je haar aanvaardt."
      }
    ],
    "deepDive": {
      "title": "Verdieping: een verborgen brug reconstrueren zonder haar te verzinnen",
      "body": "Een niet uitgesproken stap is jouw hypothese over hoe een reden met het standpunt verbonden wordt. De woorden, situatie en bekende afspraken moeten die hypothese ondersteunen. Bij “Bel Noor, want zij heeft dienst” kan een gedeelde taakverdeling de brug leveren. Als het probleem buiten die dienst valt, kan de aanvulling onjuist zijn of het argument onvoldoende dragen. Vraag daarom of de spreker de verbinding herkent.\n\nMaak de brug niet groter dan nodig. “Deze ervaring maakt Sam geschikt voor deze taak” verschilt van “ervaren mensen moeten alle moeilijke taken doen”. Een te algemene aanvulling maakt een redelijk beperkt argument onnodig kwetsbaar. Een te gunstige aanvulling kan juist een zwak argument kunstmatig sterk maken. Welwillende interpretatie zoekt een tekstgetrouwe versie; verbetering stelt openlijk nieuwe redenen of voorwaarden voor. Houd die twee activiteiten uit elkaar.\n\nSoms zijn meerdere bruggen plausibel. Een voorstel om een gesprek te verplaatsen kan steunen op noodzakelijke deelname, op beleefdheid of op de verwachting dat later een betere beslissing mogelijk is. Benoem dan welke lezing je kiest en welke vraag de keuze kan verduidelijken. Interpretatieve onzekerheid is geen fout zolang je haar zichtbaar maakt.\n\nOok een expliciete brug is nog niet bewezen. Een praktische aanbeveling kan zowel een feitelijke verwachting als een waardeafweging nodig hebben. Dat een andere locatie rustiger is, betekent niet zonder meer dat verplaatsen alle relevante belangen dient. De volgende stap is dus de verbinding beoordelen: klopt zij hier, zijn er uitzonderingen en rechtvaardigt zij precies deze conclusie? Zo verandert aanvullen van een losse gok in een controleerbare denkstap."
    },
    "exercises": [
      {
        "id": "intro3-brug",
        "kind": "choice",
        "prompt": "Welke stap past tussen reden en voorstel?",
        "scenario": "“Bel Noor over dit probleem, want zij heeft vandaag dienst.”",
        "explanation": "De verbinding moet uitleggen waarom dienst hebben relevant is voor dit probleem.",
        "options": [
          {
            "id": "intro3-brug-o1",
            "text": "Iedereen die dienst heeft kan ieder probleem altijd oplossen.",
            "feedback": "Dat is veel sterker dan nodig."
          },
          {
            "id": "intro3-brug-o2",
            "text": "Dit probleem valt onder de rol van de dienstdoende collega.",
            "feedback": "Juist: dit verbindt de reden met het belvoorstel."
          },
          {
            "id": "intro3-brug-o3",
            "text": "Noor vindt bellen altijd leuk.",
            "feedback": "Dat is niet gegeven en verklaart de rolverdeling niet."
          }
        ],
        "answer": "intro3-brug-o2"
      },
      {
        "id": "intro3-niet-te-groot",
        "kind": "choice",
        "prompt": "Welke aanvulling behoudt de beperkte claim?",
        "scenario": "“Deze kamer is rustig, dus laten we dit concentratiegesprek hier houden.”",
        "explanation": "De passende brug koppelt rust aan dit soort gesprek, zonder alle andere criteria uit te sluiten.",
        "options": [
          {
            "id": "intro3-niet-te-groot-o1",
            "text": "Een rustige kamer helpt bij dit concentratiegesprek.",
            "feedback": "Juist: deze verbinding past bij reden en doel."
          },
          {
            "id": "intro3-niet-te-groot-o2",
            "text": "Elke rustige kamer is altijd de beste keuze voor alles.",
            "feedback": "Dit vergroot de claim tot een onhoudbare algemene regel."
          },
          {
            "id": "intro3-niet-te-groot-o3",
            "text": "Rust bewijst dat de kamer genoeg stoelen heeft.",
            "feedback": "Rust zegt op zichzelf niets over capaciteit."
          }
        ],
        "answer": "intro3-niet-te-groot-o1"
      },
      {
        "id": "intro3-vraag",
        "kind": "choice",
        "prompt": "Welke vraag toetst de verborgen stap?",
        "scenario": "“Sam moet deze taak doen, want Sam heeft ervaring.”",
        "explanation": "Ervaring ondersteunt de taaktoewijzing wanneer zij relevant is voor deze taak.",
        "options": [
          {
            "id": "intro3-vraag-o1",
            "text": "Welke ervaring heeft Sam die bij deze taak past?",
            "feedback": "Juist: dit controleert de verbinding tussen ervaring en geschiktheid."
          },
          {
            "id": "intro3-vraag-o2",
            "text": "Waarom is Sam een betere persoon dan iedereen?",
            "feedback": "Persoonlijke waarde is niet de bedoelde geschiktheidsvraag."
          },
          {
            "id": "intro3-vraag-o3",
            "text": "Kan iedere ervaren collega zonder grenzen alles doen?",
            "feedback": "Deze algemene vraag vergroot het standpunt onnodig."
          }
        ],
        "answer": "intro3-vraag-o1"
      },
      {
        "id": "intro3-schema",
        "kind": "map",
        "prompt": "Bouw het korte argument met de ontbrekende stap.",
        "explanation": "De brug verbindt de gegeven reden aan het voorstel; zij blijft een aanname die je kunt toetsen.",
        "claim": "Bel Noor over dit probleem.",
        "categories": [
          {
            "id": "reden",
            "label": "Gegeven reden"
          },
          {
            "id": "brug",
            "label": "Niet uitgesproken stap"
          },
          {
            "id": "standpunt",
            "label": "Standpunt"
          }
        ],
        "cards": [
          {
            "id": "intro3-schema-c1",
            "text": "Noor heeft vandaag dienst.",
            "category": "reden"
          },
          {
            "id": "intro3-schema-c2",
            "text": "Dit probleem hoort bij de dienstdoende collega.",
            "category": "brug"
          },
          {
            "id": "intro3-schema-c3",
            "text": "Bel Noor over dit probleem.",
            "category": "standpunt"
          }
        ]
      },
      {
        "id": "intro3-jouw-brug",
        "kind": "reflection",
        "prompt": "Schrijf de ontbrekende stap en één vraag die haar controleert.",
        "scenario": "Een teamleider zegt: “We moeten de afspraak verplaatsen, want twee belangrijke deelnemers kunnen niet.”",
        "explanation": "Een goede aanvulling verbindt aanwezigheid van deze deelnemers met het doel van de afspraak.",
        "model": "De ontbrekende stap kan zijn dat deze afspraak de inbreng van die deelnemers nodig heeft. Ik zou vragen welke bijdrage zij moeten leveren en of verplaatsen beter is dan een vervanger of later overleg. Hun afwezigheid is een reden, maar maakt verplaatsen nog niet automatisch de enige oplossing.",
        "rubric": [
          "Je noemt een passende verbindingsstap.",
          "Je maakt haar niet onnodig absoluut.",
          "Je stelt een concrete vraag over die stap."
        ],
        "minWords": 30
      }
    ],
    "sourceIds": [
      "govier",
      "groarke"
    ],
    "introductory": true
  },
  {
    "id": "basis-argument-of-uitleg",
    "moduleId": "basis",
    "title": "Argumentatie als taalhandeling: reconstrueren vóór beoordelen",
    "teaser": "Beoordeel wat een tekst probeert te rechtvaardigen, welke uitspraken dat werk doen en wat je bij reconstructie mag aanvullen.",
    "minutes": 35,
    "objectives": [
      "Een argument onderscheiden van verklaring, verslag en waardering in context.",
      "Premissen, tussenconclusies en hoofdconclusies reconstrueren.",
      "Interpretatie en beoordeling expliciet uit elkaar houden."
    ],
    "sections": [
      {
        "title": "De functie van een uiting hangt af van het geschil",
        "body": "Een argument geeft redenen voor een conclusie die aanvaarding behoeft. Een verklaring maakt een gebeurtenis of toestand begrijpelijk die in de gegeven context al wordt aangenomen. Het woord “omdat” beslist dus niets op zichzelf. Begin met de vraag waarover de gesprekspartners onzeker zijn. Als iedereen de vertraging van de trein kent, kan een kapotte wissel verklaren hoe zij ontstond. Wanneer de vertraging wordt betwijfeld, kan de storingsmelding juist een argument vóór die vertraging vormen. Ook een beschrijving kan materiaal voor een argument leveren zonder zelf als argument te functioneren. De functie is contextueel; de kwaliteit is een volgende vraag. Een onbetrouwbare reden kan nog steeds als reden worden aangevoerd. Het herkennen van argumentatie betekent daarom niet dat je de conclusie aanvaardt of de spreker al weerlegt.",
        "example": "“Het lokaal is ongeschikt, want een nooduitgang ontbreekt” verdedigt een oordeel over geschiktheid. “Het lokaal werd gesloten doordat de uitgang blokkeerde” verklaart in een ander gesprek een aangenomen sluiting.",
        "takeaway": "Bepaal eerst wat aanvaarding behoeft; beoordeel daarna waarmee die aanvaarding wordt ondersteund."
      },
      {
        "title": "Reconstructie is een toetsbare interpretatie",
        "body": "Een reconstructie brengt de relevante uitspraken en hun ondersteuningsrelaties in kaart. Formuleer één inhoudelijk herkenbare uitspraak per onderdeel en behoud beperkingen zoals “waarschijnlijk”, “in deze pilot” en “voor sommige studenten”. Een zin kan als conclusie van een eerste stap tegelijk premisse voor een volgende stap zijn. Dat is een tussenconclusie, geen inconsistent label. Verwijder herhaling en retorische versiering, maar verander een bescheiden conclusie niet in een absolute. Achtergrondinformatie hoort pas bij de argumentatie als zij een ondersteunende functie krijgt. Noteer bij onduidelijke teksten welke interpretatie je kiest en welk tekstgegeven daarvoor spreekt. Welwillend reconstrueren betekent een serieuze lezing zoeken binnen wat tekst en context toelaten. Het geeft geen toestemming om een empirisch resultaat of een waardeoordeel aan de auteur toe te schrijven omdat het argument daarmee beter zou worden.",
        "example": "“De sensor faalt in de controletest; daarom zijn haar metingen onzeker; we moeten deze meetreeks herhalen.” De onzekerheid is tussenconclusie en vervolgens reden voor herhaling.",
        "takeaway": "Een goede kaart behoudt inhoud en reikwijdte en maakt interpretatieve keuzes controleerbaar."
      }
    ],
    "deepDive": {
      "title": "Pragmatische functie, inferentiële structuur en epistemische kwaliteit",
      "body": "In een zorgvuldige analyse kun je drie lagen onderscheiden. De pragmatische laag betreft wat een spreker in een gesprek probeert te doen: verklaren, verdedigen, beschuldigen, adviseren of onderhandelen. De inferentiële laag betreft de verbinding tussen uitspraken: welke premissen ondersteunen welke conclusies, met welke impliciete brug? De epistemische laag betreft de rechtvaardiging: zijn de premissen aanvaardbaar, relevant en gezamenlijk voldoende voor de geclaimde conclusie? Deze lagen hangen samen, maar vallen niet samen. Een overtuigende presentatie kan inferentieel zwak zijn; een geldig schema kan onware premissen hebben; een sterke verklaring kan irrelevant zijn voor de beleidsvraag.\n\nDe reconstructie is daarbij geen neutrale transcriptie. Woorden krijgen betekenis in context en een korte uiting kan meerdere redeneringen samenvatten. Een analist moet daarom kunnen aangeven welke onderdelen expliciet gegeven zijn en welke zij zelf aanvult. Een nuttige controle is om de spreker de reconstructie in gewone taal voor te leggen: zou deze haar herkennen, inclusief de beperkingen? Bij een onbereikbare auteur werk je met tekstuele aanwijzingen en rapporteer je alternatieven.\n\nDit leidt tot een praktische discipline: bespreek eerst de meest verdedigbare tekstgetrouwe versie, benoem daarna de kwetsbare stap en onderscheid de verwerping van die stap van de verwerping van de conclusie. Een slechte verdediging kan immers toevallig een waar standpunt ondersteunen. Argumentanalyse vraagt om verantwoorde interpretatie voordat kritiek betekenis krijgt."
    },
    "exercises": [
      {
        "id": "b1-functie",
        "kind": "choice",
        "prompt": "Welke uiting bevat expliciete argumentatie?",
        "scenario": "Drie studenten bespreken de openingstijden.",
        "explanation": "In de juiste uiting ondersteunt een reden een beleidsconclusie.",
        "options": [
          {
            "id": "b1-functie-o1",
            "text": "“Ik vind de bibliotheek gezellig.”",
            "feedback": "Dit is een waardering zonder gegeven reden. Er kan een argument volgen, maar dat staat er nog niet."
          },
          {
            "id": "b1-functie-o2",
            "text": "“De bibliotheek moet op zondag open, omdat veel werkende studenten dan kunnen studeren.”",
            "feedback": "Juist: de beschikbaarheid van studenten ondersteunt het voorgestelde beleid."
          },
          {
            "id": "b1-functie-o3",
            "text": "“De bibliotheek ging dicht nadat de stroom uitviel.”",
            "feedback": "Deze zin beschrijft een gebeurtenis en haar context; er wordt hier geen betwist standpunt verdedigd."
          }
        ],
        "answer": "b1-functie-o2"
      },
      {
        "id": "b1-uitleg",
        "kind": "choice",
        "prompt": "Wat is hier de voornaamste functie?",
        "scenario": "Iedereen ziet dat het scherm zwart is. Een technicus zegt: “Het scherm is zwart omdat de stekker loszit.”",
        "explanation": "Het zwarte scherm is in deze context al vastgesteld. De technicus geeft een mogelijke oorzaak.",
        "options": [
          {
            "id": "b1-uitleg-o1",
            "text": "Verklaren hoe het vastgestelde probleem ontstond.",
            "feedback": "Juist: de gespreksvraag gaat over de oorzaak van een aangenomen feit."
          },
          {
            "id": "b1-uitleg-o2",
            "text": "Bewijzen dat het scherm zwart is.",
            "feedback": "Dat feit wordt hier niet betwijfeld. Dezelfde zin kan in een andere context wel bewijs leveren."
          },
          {
            "id": "b1-uitleg-o3",
            "text": "Een persoonlijke aanval op de gebruiker uitvoeren.",
            "feedback": "Er wordt geen eigenschap van de gebruiker aangevoerd om diens standpunt af te wijzen."
          }
        ],
        "answer": "b1-uitleg-o1"
      },
      {
        "id": "ba1-interpretatie",
        "kind": "choice",
        "prompt": "Welke analyse behandelt alle drie de lagen correct?",
        "scenario": "Een analist zegt tijdens een vergadering: “De vragenlijst mist een controlevraag. Daarom zijn de scores mogelijk vertekend en moeten we de conclusie voorlopig beperken.”",
        "explanation": "De uiting verdedigt een beperking. De mogelijke vertekening vormt een tussenconclusie; of de ontbrekende vraag werkelijk vertekening veroorzaakt blijft een kwaliteitsvraag.",
        "options": [
          {
            "id": "ba1-interpretatie-o1",
            "text": "De tekst verdedigt een beperking; mogelijke vertekening is tussenconclusie; de empirische brug vraagt controle.",
            "feedback": "Juist: functie, structuur en bewijs worden onderscheiden."
          },
          {
            "id": "ba1-interpretatie-o2",
            "text": "De tekst is alleen een verklaring, want er staat “daarom”.",
            "feedback": "Een signaalwoord bepaalt de functie niet; de uiteindelijke conclusie is hier een te rechtvaardigen beslissing over de werkwijze."
          },
          {
            "id": "ba1-interpretatie-o3",
            "text": "De conclusie is onwaar zolang de brug niet bewezen is.",
            "feedback": "Een onvoldoende verdedigde conclusie is niet daardoor weerlegd."
          },
          {
            "id": "ba1-interpretatie-o4",
            "text": "De ontbrekende controlevraag bewijst dat alle scores fout zijn.",
            "feedback": "Dit versterkt “mogelijk vertekend” tot een universele zekerheid."
          }
        ],
        "answer": "ba1-interpretatie-o1"
      },
      {
        "id": "b2-kaarten",
        "kind": "map",
        "prompt": "Plaats de onderdelen van het sensorargument.",
        "explanation": "De tussenconclusie wordt door een premisse ondersteund en ondersteunt op haar beurt de hoofdconclusie.",
        "claim": "We moeten de meetreeks opnieuw uitvoeren.",
        "categories": [
          {
            "id": "premisse",
            "label": "Premisse"
          },
          {
            "id": "tussen",
            "label": "Tussenconclusie"
          },
          {
            "id": "conclusie",
            "label": "Hoofdconclusie"
          },
          {
            "id": "achtergrond",
            "label": "Achtergrond"
          }
        ],
        "cards": [
          {
            "id": "b2-kaarten-c1",
            "text": "De sensor reageert niet op de controletest.",
            "category": "premisse"
          },
          {
            "id": "b2-kaarten-c2",
            "text": "De sensor werkt niet goed.",
            "category": "tussen"
          },
          {
            "id": "b2-kaarten-c3",
            "text": "We moeten de meetreeks opnieuw uitvoeren.",
            "category": "conclusie"
          },
          {
            "id": "b2-kaarten-c4",
            "text": "De analist heet Noor.",
            "category": "achtergrond"
          }
        ]
      },
      {
        "id": "ba1-dossier",
        "kind": "reflection",
        "prompt": "Reconstrueer twee mogelijke functies, kies de best passende lezing en benoem één resterende kwaliteitsvraag.",
        "scenario": "Een facultaire commissie bespreekt deelname aan werkcolleges. De cijfers tonen dat deelname dit semester daalde. Een docent zegt: “De deelname daalde doordat het rooster overlapt met de stage. We moeten het werkcollege dus verplaatsen.” Een student vraagt of de overlap alle afwezigheid verklaart. Een andere docent stelt dat de roosters vorig jaar ook overlapten. De commissie moet over de verplaatsing beslissen, maar heeft nog geen enquête over afwezigheidsredenen en geen vergelijking met andere groepen.",
        "explanation": "De eerste uitspraak kan de daling verklaren; dezelfde causale hypothese ondersteunt daarnaast het verplaatsingsadvies. De aanbeveling vraagt ook een normatieve brug en een effectverwachting.",
        "model": "Een verklarende lezing neemt de daling als feit en stelt overlap als oorzaak voor. Een argumentatieve lezing gebruikt de oorzaak als reden om het rooster te veranderen. In de vergadering is vooral de tweede functie relevant omdat een besluit nodig is. Een tussenconclusie is dat overlap deelname belemmert. Nog te toetsen is hoeveel afwezigheid werkelijk aan overlap ligt en of verplaatsing de deelname verhoogt zonder andere problemen te veroorzaken. De verwijzing naar vorig jaar is een relevant bezwaar tegen een eenvoudige oorzaakverklaring, maar weerlegt die niet zonder vergelijking van omstandigheden. De commissie kan ook tijdelijke aanpassing toetsen terwijl zij gegevens verzamelt. De sterkte van een handelingsadvies moet bij die onzekerheid passen.",
        "rubric": [
          "Je onderscheidt verklaring en verdediging aan de hand van de context.",
          "Je noemt hoofdconclusie en tussenconclusie met oorspronkelijke voorzichtigheid.",
          "Je formuleert een gerichte empirische of normatieve kwaliteitsvraag."
        ],
        "minWords": 80
      }
    ],
    "sourceIds": [
      "govier",
      "groarke"
    ],
    "lab": "structure"
  },
  {
    "id": "basis-verborgen-premissen",
    "moduleId": "basis",
    "title": "Verborgen premissen en de kracht van gevolgtrekkingen",
    "teaser": "Maak feitelijke en normatieve bruggen zichtbaar en onderscheid noodzakelijke steun van voorlopige rechtvaardiging.",
    "minutes": 38,
    "objectives": [
      "Een impliciete premisse inhoudelijk en tekstgetrouw reconstrueren.",
      "Deductieve geldigheid, deugdelijkheid, inductie en abductie onderscheiden.",
      "Een beleidsconclusie begrenzen op basis van aannames en onzekerheid."
    ],
    "sections": [
      {
        "title": "Een verborgen premisse is een interpretatieve hypothese",
        "body": "Een reden ondersteunt een conclusie vaak via een niet uitgesproken regel, waarde of toepassingsvoorwaarde. “Deze zaal heeft geen nooduitgang; hier kan geen groot evenement plaatsvinden” veronderstelt dat zo’n evenement een geschikte vluchtvoorziening vereist. Maak die brug expliciet, maar presenteer haar als reconstructie en niet als citaat. Een beschrijvende premisse ondersteunt een aanbeveling bovendien alleen in combinatie met een normatieve afweging. “De maatregel bespaart tijd” zegt op zichzelf niet dat invoering verstandig is: kosten, toegankelijkheid en andere waarden kunnen meetellen. Zoek een brug die specifiek genoeg is om het argument te verklaren en beperkt genoeg om bij de spreker te passen. “Alles wat tijd bespaart moet altijd” is meestal een slechte reconstructie. Een bruikbare aanvulling laat zien welke waarde de reden relevant maakt en onder welke omstandigheden zij de conclusie ondersteunt.",
        "example": "“Opnames helpen zieke studenten; colleges moeten daarom opneembaar zijn” veronderstelt een toegankelijkheidsnorm én dat opname een geschikte uitvoerbare voorziening is.",
        "takeaway": "Reconstructie identificeert een aanname; beoordeling vraagt of die aanname verdedigbaar is."
      },
      {
        "title": "Welke sterkte mag de conclusie hebben?",
        "body": "Bij deductieve geldigheid kunnen de premissen niet allemaal waar zijn terwijl de conclusie onwaar is. Een deugdelijk deductief argument heeft daarnaast ware premissen. Inductie gebruikt waarnemingen om een generalisatie of voorspelling waarschijnlijker te maken; abductie vergelijkt verklaringen en selecteert een voorlopig beste verklaring. Deze onderscheidingen bepalen wat een tegenvoorbeeld doet. Een denkbaar geval met ware premissen en een onware conclusie weerlegt deductieve geldigheid. Hetzelfde denkbare geval maakt een abductieve conclusie niet automatisch onredelijk: daarvoor tellen waarschijnlijkheid en verklaringskracht van het alternatief. Ook een zeer groot aantal observaties maakt een inductie niet vanzelf deductief noodzakelijk. De evaluatie vraagt naar steekproefselectie, representativiteit, alternatieven en de gekozen reikwijdte. Je moet de conclusie aanpassen aan de steun die werkelijk beschikbaar is, ook wanneer de gewenste beslissing tijdsdruk heeft.",
        "example": "Een nat raam kan regen suggereren, maar een sproeier is een alternatief. Een gecontroleerde waarneming van regen maakt de ene verklaring sterker; zij verandert de oorspronkelijke vorm niet.",
        "takeaway": "Zekerheid, waarschijnlijkheid en verklaring hebben verschillende beoordelingsnormen."
      }
    ],
    "deepDive": {
      "title": "Formele aanvulling versus informatieve rechtvaardiging",
      "body": "Ieder argument met premisse P en conclusie C kun je formeel geldig maken door “als P, dan C” als extra premisse toe te voegen. Daarmee is nog niet aangetoond waarom P voor C pleit. De aanvulling kan de hele controversiële stap verbergen in plaats van haar te verduidelijken. Een inhoudelijke reconstructie benoemt daarom bijvoorbeeld de beleidsnorm, een classificatieregel of een causale generalisatie die de spreker gebruikt. Vervolgens vraag je of die regel hier geldt en onafhankelijk aanvaardbaar is.\n\nVoor praktische argumentatie is het bovendien vaak verkeerd om een weerlegbare regel als universeel te reconstrueren. “Normaal gesproken levert een betrouwbare deskundige een goede reden om haar oordeel te accepteren” laat ruimte voor een belangenconflict of betere tegeninformatie. “Elke deskundige heeft altijd gelijk” schrijft de spreker een veel sterkere en meestal onhoudbare positie toe. De analyse moet dus niet alleen een verborgen premisse invullen, maar ook de bedoelde gevolgtrekkingskracht bewaren.\n\nBij beleidskeuzes lopen empirische en normatieve onzekerheden door elkaar. Een maatregel kan waarschijnlijk effect hebben, terwijl nog onzeker is of dat effect de kosten rechtvaardigt. Zet beide bruggen apart: de voorspelling over gevolgen en de afweging over waarden. Dat maakt duidelijk waar extra metingen kunnen helpen en waar een debat over prioriteiten nodig blijft. Geen enkele hoeveelheid data kiest op zichzelf alle betrokken waarden of bepaalt zonder normatieve uitgangspunten welke beslissing verplicht is."
    },
    "exercises": [
      {
        "id": "b3-brug",
        "kind": "choice",
        "prompt": "Welke verborgen premisse is het meest tekstgetrouw?",
        "scenario": "“Dit lokaal heeft geen nooduitgang. Daarom mogen we hier geen groot evenement houden.”",
        "explanation": "De relevante brug koppelt de ontbrekende veiligheidsvoorziening aan geschiktheid voor dit evenement.",
        "options": [
          {
            "id": "b3-brug-o1",
            "text": "Alle gebouwen zonder nooduitgang moeten worden gesloopt.",
            "feedback": "Dit is veel sterker dan nodig en voegt een nieuw beleidsstandpunt toe."
          },
          {
            "id": "b3-brug-o2",
            "text": "Een groot evenement vereist hier een geschikte nooduitgang voor veilig gebruik.",
            "feedback": "Juist: dit verbindt de gegeven eigenschap met de conclusie zonder onnodige uitbreiding."
          },
          {
            "id": "b3-brug-o3",
            "text": "Een groot evenement trekt nooit bezoekers.",
            "feedback": "Deze aanname ondersteunt het veiligheidsargument niet en botst met de context."
          }
        ],
        "answer": "b3-brug-o2"
      },
      {
        "id": "b4-geldig",
        "kind": "choice",
        "prompt": "Welke beoordeling klopt?",
        "scenario": "“Alle vogels zijn zoogdieren. Een merel is een vogel. Dus een merel is een zoogdier.”",
        "explanation": "De gevolgtrekking is geldig, maar de eerste premisse is onwaar; het argument is dus niet deugdelijk.",
        "options": [
          {
            "id": "b4-geldig-o1",
            "text": "Geldig, maar niet deugdelijk omdat een premisse onwaar is.",
            "feedback": "Juist: vorm en waarheid zijn verschillende beoordelingsvragen."
          },
          {
            "id": "b4-geldig-o2",
            "text": "Ongeldig, uitsluitend omdat de conclusie onwaar is.",
            "feedback": "Een onware conclusie bewijst geen ongeldige vorm wanneer een premisse ook onwaar is."
          },
          {
            "id": "b4-geldig-o3",
            "text": "Deugdelijk, omdat beide premissen de conclusie ondersteunen.",
            "feedback": "Deugdelijkheid vereist naast geldigheid ook ware premissen."
          }
        ],
        "answer": "b4-geldig-o1"
      },
      {
        "id": "ba2-alternatief",
        "kind": "choice",
        "prompt": "Wat doet dit alternatief met de gevolgtrekking?",
        "scenario": "“Als regen, dan een nat plein. Het plein is nat, dus het regent.” Iemand wijst erop dat een reinigingswagen het plein nat kan maken.",
        "explanation": "Het alternatief toont deductieve ongeldigheid; de feitelijke plausibiliteit van regen vraagt daarna een aparte abductieve beoordeling.",
        "options": [
          {
            "id": "ba2-alternatief-o1",
            "text": "Het bewijst dat het nu zeker niet regent.",
            "feedback": "De reinigingswagen is hier een mogelijke verklaring, geen vastgestelde gebeurtenis."
          },
          {
            "id": "ba2-alternatief-o2",
            "text": "Het weerlegt de deductieve geldigheid, maar beslist niet op zichzelf of regen de beste verklaring is.",
            "feedback": "Juist: een logisch tegenvoorbeeld en een empirische verklaringsvergelijking verschillen."
          },
          {
            "id": "ba2-alternatief-o3",
            "text": "Het is irrelevant omdat regen soms natte pleinen veroorzaakt.",
            "feedback": "De oorspronkelijke regel sluit andere oorzaken niet uit; juist dat veroorzaakt de ongeldigheid."
          },
          {
            "id": "ba2-alternatief-o4",
            "text": "Het maakt iedere inductieve redenering onmogelijk.",
            "feedback": "Herzienbare steun kan bestaan ondanks alternatieven; zij levert alleen geen noodzakelijke conclusie."
          }
        ],
        "answer": "ba2-alternatief-o2"
      },
      {
        "id": "ba2-bruggen",
        "kind": "map",
        "prompt": "Scheid de soorten uitspraken in dit beleidsargument.",
        "explanation": "Een effectverwachting en een normatieve afweging doen verschillend werk; beide kunnen een kritische vraag oproepen.",
        "claim": "Neem colleges op onder passende voorwaarden.",
        "categories": [
          {
            "id": "feit",
            "label": "Gegeven beschrijvende premisse"
          },
          {
            "id": "empirisch",
            "label": "Empirische brug"
          },
          {
            "id": "norm",
            "label": "Normatieve brug"
          },
          {
            "id": "advies",
            "label": "Beleidsconclusie"
          }
        ],
        "cards": [
          {
            "id": "ba2-bruggen-c1",
            "text": "In de pilot misten minder studenten een uitlegblok.",
            "category": "feit"
          },
          {
            "id": "ba2-bruggen-c2",
            "text": "Opname zal ook buiten de pilot gemiste uitleg verminderen.",
            "category": "empirisch"
          },
          {
            "id": "ba2-bruggen-c3",
            "text": "Deze toegankelijkheidswinst rechtvaardigt opname wanneer privacy voldoende beschermd is.",
            "category": "norm"
          },
          {
            "id": "ba2-bruggen-c4",
            "text": "We moeten het college onder die voorwaarden opnemen.",
            "category": "advies"
          }
        ]
      },
      {
        "id": "ba2-dossier",
        "kind": "reflection",
        "prompt": "Maak twee verborgen bruggen expliciet en formuleer een passende, beperkte conclusie.",
        "scenario": "Een opleiding test vier weken een app voor aanwezigheid. In twee vrijwillig deelnemende werkgroepen stijgt aanwezigheid van 65% naar 82%. De projectleider zegt dat alle opleidingen de app moeten verplichten. Tijdens de pilot waren er echter extra herinneringen van docenten en viel de toetsweek anders dan normaal. Studenten met oudere telefoons melden problemen. Er is geen vergelijkbare groep zonder app. De opleidingscommissie wil weten welke conclusie nu verantwoord is en welke extra informatie een definitief besluit zou ondersteunen.",
        "explanation": "De gegevens ondersteunen hooguit een lokale aanwijzing. Generalisatie en de aanbeveling vragen onderscheiden empirische en normatieve bruggen.",
        "model": "De empirische brug zegt dat de stijging door de app komt en zich bij andere groepen herhaalt. De normatieve brug zegt dat aanwezigheid en eventuele leerwinst de kosten en toegankelijkheidsproblemen van verplichting rechtvaardigen. Beide zijn nog onvoldoende onderbouwd. Een passende conclusie is dat de pilot een gerichte vervolgtoets rechtvaardigt, met een vergelijking zonder app, analyse van herinneringen en een toegankelijkheidstoets voordat algemene verplichting wordt overwogen. Vrijwillige deelname kan gemotiveerdere studenten selecteren. Daarom is ook buiten de pilot een zorgvuldig gekozen vergelijking nodig. Het gunstige resultaat mag als aanleiding voor vervolgtoets meetellen, maar is geen onafhankelijke rechtvaardiging van een algemene verplichting wanneer alternatieven en toegankelijkheid nog onzeker zijn.",
        "rubric": [
          "Je maakt een empirische en een normatieve brug apart expliciet.",
          "Je beperkt causaliteit en generalisatie op basis van het vergelijkingswijze.",
          "Je noemt gericht vervolgtoets en een besluitvoorwaarde."
        ],
        "minWords": 80
      }
    ],
    "sourceIds": [
      "govier",
      "groarke",
      "toulmin"
    ]
  },
  {
    "id": "basis-argumentstructuur",
    "moduleId": "basis",
    "title": "Argumentstructuren en de afhankelijkheid van bewijs",
    "teaser": "Bouw een controleerbare kaart en ontdek waarom meer pijlen niet vanzelf meer steun betekenen.",
    "minutes": 35,
    "objectives": [
      "Gekoppelde, convergente en seriële ondersteuning onderscheiden.",
      "Het effect van een verworpen premisse uitleggen.",
      "Een argumentkaart op inhoud beoordelen."
    ],
    "sections": [
      {
        "title": "Gekoppelde, convergente en seriële ondersteuning",
        "body": "Gekoppelde premissen leveren samen de bedoelde steun. Een algemene toelatingsregel en het feit dat een kandidaat aan die regel voldoet vormen één gezamenlijke inferentie. Convergente argumenten leveren elk afzonderlijk enige steun aan dezelfde conclusie. Bereikbaarheid en betaalbaarheid kunnen ieder een reden voor een locatiekeuze zijn, ook als de andere reden wegvalt. In een seriële structuur wordt een conclusie zelf gebruikt als premisse voor een volgende stap. Dezelfde uitspraak kan daardoor twee rollen hebben zonder twee verschillende betekenissen te krijgen. De wegneemtest helpt: wat blijft van deze ondersteuningsroute over als een uitspraak niet aanvaard wordt? Gebruik die test inhoudelijk en met de context in gedachten. Bij geleidelijke, waarschijnlijkheidsgerichte steun zijn de grenzen soms minder scherp dan bij een eenvoudig deductief voorbeeld; een kaart moet die interpretatieve ruimte kunnen laten zien. In een expliciete visualisatie kun je inhoudsuitspraken en inferentiestappen scheiden: gekoppelde premissen voeden één stap; convergente redenen vormen aparte stappen. Markeer ook welke aannames je zelf hebt gereconstrueerd.",
        "example": "Een veiligheidsmeting ondersteunt “dit toestel kan uitvallen”; die tussenconclusie ondersteunt “controleer voor gebruik”. Een onafhankelijke onderhoudsregel kan daarnaast hetzelfde advies steunen.",
        "takeaway": "Een schema beschrijft welke redenen samen of afzonderlijk werken en waar een conclusie opnieuw premisse wordt."
      },
      {
        "title": "Bewijs kan verborgen afhankelijkheid hebben",
        "body": "Twee aparte redenen kunnen dezelfde bron of veronderstelling delen. Drie websites die één persbericht overnemen leveren niet zonder meer drie onafhankelijke bevestigingen. Ook twee meetinstrumenten kunnen dezelfde foutieve kalibratie gebruiken. Plaats daarom niet alleen zichtbare tekstuitspraken in de kaart, maar beoordeel hun herkomst en gedeelde voorwaarden. Een verworpen premisse vernietigt bij convergente argumentatie niet noodzakelijk alle steun, terwijl een cruciale gekoppelde premisse een hele route kan laten wegvallen. Dat vertelt nog niet of de overblijvende route voldoende is. De beoordeling van een kaart vereist aanvaardbaarheid van premissen, relevantie van hun verbinding en voldoende gezamenlijke steun voor de exacte conclusie. Een grafisch verzorgd schema kan deze inhoudelijke vragen niet vervangen. Voeg waar nodig een label toe dat een verbinding voorlopig, normatief of empirisch voorwaardelijk maakt.",
        "example": "Een interview en een krant lijken de wachttijd onafhankelijk te bevestigen, maar de krant kan datzelfde interview als enige bron gebruiken. Hun zichtbare scheiding verbergt één bewijsroute.",
        "takeaway": "Teken de herkomst van steun mee; tel herhaling niet als nieuwe onafhankelijke informatie."
      }
    ],
    "deepDive": {
      "title": "Waarom topologie nog geen bewijskracht is",
      "body": "Een argumentkaart toont een netwerk van ondersteuningsrelaties. Zij is geen volledige maat van argumentkwaliteit. Het aantal knopen of inkomende pijlen zegt zonder verdere aannames niets over hoeveel vertrouwen een conclusie verdient. Eén zorgvuldig gemeten feit kan een conclusie sterker ondersteunen dan tien elkaar overschrijvende berichten. Omgekeerd kunnen verschillende methoden die elk eigen fouten hebben samen veel overtuigender zijn dan één methode, wanneer hun fouten niet dezelfde bron delen.\n\nDe gebruikelijke grens tussen gekoppelde en convergente ondersteuning is bovendien deels afhankelijk van het analysedoel. Neem twee waarnemingen die ieder zwakke steun voor een hypothese leveren en samen een specifieke verklaring overtuigend maken. Je kunt hun afzonderlijke bijdrage laten zien, maar ook een gezamenlijke inferentie reconstrueren. Verantwoord dan wat de kaart representeert: de talige presentatie, de bedoelde redenering of jouw evaluatie van het bewijs. Vermijd het ongemerkt wisselen tussen die doelen.\n\nEen verdere moeilijkheid is dat kaarten vaak ondersteunende argumenten laten zien maar weerleggingen weglaten. Een tegenargument kan de conclusie bestrijden, een premisse aanvallen of juist de verbinding tussen reden en conclusie ondermijnen. Die plaats maakt uit voor wat je moet herzien. Een nuttige zorgvuldige kaart bevat daarom niet alleen een eindstandpunt, maar ook gedeelde aannames, bronnen, onzekerheden en gerichte bezwaren. Pas dan kun je uitleggen waarom een reparatie één route versterkt of waarom een resterend alternatief nog open blijft."
    },
    "exercises": [
      {
        "id": "b5-gekoppeld",
        "kind": "choice",
        "prompt": "Welke structuur past?",
        "scenario": "“Iedere aanvraag met handtekening is ontvankelijk. Deze aanvraag heeft een handtekening. Dus deze aanvraag is ontvankelijk.”",
        "explanation": "Beide premissen zijn samen nodig voor deze deductieve gevolgtrekking.",
        "options": [
          {
            "id": "b5-gekoppeld-o1",
            "text": "Convergent: beide premissen bewijzen apart dat deze aanvraag ontvankelijk is.",
            "feedback": "De algemene regel vertelt zonder de tweede premisse niet of deze aanvraag aan de voorwaarde voldoet."
          },
          {
            "id": "b5-gekoppeld-o2",
            "text": "Gekoppeld: de regel en het geval ondersteunen samen de conclusie.",
            "feedback": "Juist: één inferentie gebruikt twee samenwerkende premissen."
          },
          {
            "id": "b5-gekoppeld-o3",
            "text": "Serieel: de eerste premisse bewijst de tweede.",
            "feedback": "De regel bewijst niet dat deze specifieke aanvraag een handtekening heeft."
          }
        ],
        "answer": "b5-gekoppeld-o2"
      },
      {
        "id": "b5-bronnen",
        "kind": "choice",
        "prompt": "Wat moet je toetsen voordat je beide artikelen als onafhankelijke steun telt?",
        "scenario": "Twee websites melden dezelfde testuitslag in identieke bewoordingen.",
        "explanation": "Afzonderlijke publicaties kunnen dezelfde bewijsbasis delen. Tel bewijs niet dubbel.",
        "options": [
          {
            "id": "b5-bronnen-o1",
            "text": "Of zij verschillende lettertypen gebruiken.",
            "feedback": "Visuele vorm verandert de afhankelijkheid van het bewijs niet."
          },
          {
            "id": "b5-bronnen-o2",
            "text": "Of er minstens twee publicatiedata zijn.",
            "feedback": "Verschillende datums sluiten een gedeelde bron niet uit."
          },
          {
            "id": "b5-bronnen-o3",
            "text": "Of beide berichten dezelfde oorspronkelijke test of hetzelfde persbericht gebruiken.",
            "feedback": "Juist: hiermee beoordeel je de herkomst van de ogenschijnlijk aparte steun."
          }
        ],
        "answer": "b5-bronnen-o3"
      },
      {
        "id": "ba3-wegvallen",
        "kind": "choice",
        "prompt": "Welke conclusie over de kaart is gerechtvaardigd?",
        "scenario": "Een voorstel heeft twee convergente argumenten: A is een gecontroleerde veiligheidsmeting; B is een aantoonbaar onjuiste kostenraming. B wordt verworpen.",
        "explanation": "Convergentie laat steun van A over, maar de toereikendheid van A moet inhoudelijk worden beoordeeld.",
        "options": [
          {
            "id": "ba3-wegvallen-o1",
            "text": "Het hele voorstel is logisch weerlegd.",
            "feedback": "Een onjuiste afzonderlijke reden ontkracht een andere zelfstandige route niet automatisch."
          },
          {
            "id": "ba3-wegvallen-o2",
            "text": "Het voorstel is bewezen omdat A overblijft.",
            "feedback": "Overblijvende steun is niet zonder beoordeling voldoende of zeker."
          },
          {
            "id": "ba3-wegvallen-o3",
            "text": "De route via A blijft bestaan; haar voldoende kracht voor het voorstel is een aparte vraag.",
            "feedback": "Juist: structuur bepaalt wat wegvalt, evaluatie bepaalt wat het resterende bewijs rechtvaardigt."
          },
          {
            "id": "ba3-wegvallen-o4",
            "text": "B wordt geldig als de kaart meer pijlen krijgt.",
            "feedback": "Grafische complexiteit herstelt een onware premisse niet."
          }
        ],
        "answer": "ba3-wegvallen-o3"
      },
      {
        "id": "b5-schema",
        "kind": "map",
        "prompt": "Plaats de uitspraken in de seriële keten.",
        "explanation": "De tussenconclusie over uitval ontvangt steun en levert vervolgens steun aan het advies.",
        "claim": "We moeten het apparaat voor gebruik controleren.",
        "categories": [
          {
            "id": "premisse",
            "label": "Beginpremisse"
          },
          {
            "id": "tussen",
            "label": "Tussenconclusie"
          },
          {
            "id": "conclusie",
            "label": "Hoofdconclusie"
          }
        ],
        "cards": [
          {
            "id": "b5-schema-c1",
            "text": "De batterijen verliezen bij een controletest snel spanning.",
            "category": "premisse"
          },
          {
            "id": "b5-schema-c2",
            "text": "Het apparaat kan tijdens gebruik onverwacht uitvallen.",
            "category": "tussen"
          },
          {
            "id": "b5-schema-c3",
            "text": "We moeten het apparaat voor gebruik controleren.",
            "category": "conclusie"
          }
        ]
      },
      {
        "id": "ba3-dossier",
        "kind": "reflection",
        "prompt": "Beschrijf een argumentkaart met twee steunroutes, één tussenconclusie en één gedeelde kwetsbaarheid.",
        "scenario": "Een ziekenhuis wil een logistiek systeem aanschaffen. De leverancier presenteert een pilot waarin wachttijden dalen en een kostenmodel dat besparingen voorspelt. Een extern adviesbureau noemt hetzelfde systeem efficiënt, maar baseert zijn advies op de cijfers van de leverancier. De pilot vond plaats op een rustige afdeling met extra personeel. Het kostenmodel gebruikt de pilotuitkomst om jaarlijkse besparingen te berekenen. De commissie wil een schema waarin duidelijk wordt wat onafhankelijke informatie is en welke conclusie echt door welk onderdeel wordt ondersteund.",
        "explanation": "De kostenroute is deels serieel afhankelijk van het piloteffect. Het adviesbureau vormt zonder eigen gegevens geen zelfstandige bevestiging.",
        "model": "De pilot ondersteunt eerst dat het systeem onder pilotomstandigheden mogelijk wachttijd vermindert. Die tussenconclusie voedt het kostenmodel en vervolgens het aankoopadvies. Het externe advies deelt dezelfde bron en mag niet als extra onafhankelijke meting worden geteld. Een zelfstandige route kan een apart onderbouwd voordeel zijn, bijvoorbeeld minder fouten, maar dat bewijs ontbreekt hier. De gedeelde kwetsbaarheid is de generalisatie van een rustige afdeling met extra personeel naar normale bedrijfsvoering. Een sterk tegenargument kan erkennen dat het systeem werkelijk nuttig is en toch de betrouwbaarheid van de jaarlijkse besparing betwisten. De commissie moet dat bezwaar op de kostenroute plaatsen. Onafhankelijke gegevens over gewone afdelingen zouden de gedeelde generalisatieaanname beter kunnen toetsen.",
        "rubric": [
          "Je beschrijft gericht welke uitspraak welke ondersteunt.",
          "Je maakt de seriële afhankelijkheid en gedeelde bron zichtbaar.",
          "Je verzint geen onafhankelijk bewijs maar noemt welk bewijs nog nodig is."
        ],
        "minWords": 80
      }
    ],
    "sourceIds": [
      "groarke",
      "govier",
      "araucaria",
      "aif"
    ],
    "lab": "structure"
  },
  {
    "id": "basis-kritiek-en-herstel",
    "moduleId": "basis",
    "title": "Drogredenen als contextgevoelige diagnose en reparatie",
    "teaser": "Analyseer een problematische zet zonder inhoudelijke kritiek te vervangen door een etiket.",
    "minutes": 35,
    "objectives": [
      "Een probleem aanwijzen in de ondersteuningsrelatie.",
      "Persoonlijke aanval, stropop en vals dilemma voorlopig herkennen.",
      "Kritiek omzetten in een concrete verbetering."
    ],
    "sections": [
      {
        "title": "Welk onderdeel van de rechtvaardiging faalt?",
        "body": "Een drogredenlabel vat een diagnose samen, maar levert zelf geen diagnose. Bij een irrelevante persoonlijke aanval wordt een eigenschap van de spreker gebruikt waar een beoordeling van haar redenen nodig is. Bij een stropop bestrijdt men een afwijkende, makkelijker te verwerpen versie van het oorspronkelijke standpunt. Een vals dilemma presenteert mogelijkheden als uitputtend terwijl relevante alternatieven ontbreken. Beschrijf in elk geval de precieze sprong: welk verschil ontstaat tussen reden en conclusie, tussen oorspronkelijke en bestreden positie, of tussen beschikbare en gepresenteerde opties? De context is daarbij onmisbaar. Een gebrek aan deskundigheid kan relevant zijn voor een getuigenis; twee opties kunnen bij een afgebakende vraag werkelijk uitputtend zijn. Dat voorkomt een onderwijsmodel waarin leerlingen alleen woorden herkennen en de argumentatieve functie overslaan.",
        "example": "“Zij stelt één autoluwe straat voor, dus zij wil auto’s overal verbieden” verschuift reikwijdte. “Deze meting is fout door een aantoonbare kalibratiefout” is juist inhoudelijke kritiek.",
        "takeaway": "Verbind een label altijd aan de concrete stap die onvoldoende steun of een vervorming veroorzaakt."
      },
      {
        "title": "Reparatie, conclusie en gesprek onderscheiden",
        "body": "Een goede reparatie behoudt het verdedigbare deel van het argument en herstelt de problematische stap. Vervang een persoonlijke belediging door controle van relevante betrouwbaarheid. Vraag bij een mogelijke stropop of de samenvatting wordt herkend en bespreek de sterkste tekstgetrouwe positie. Vul bij een vals dilemma het keuzemenu aan of verdedig waarom bepaalde alternatieven hier onmogelijk zijn. Het aantonen van een drogreden laat zien dat de gegeven verdediging tekortschiet. Het bewijst niet dat de conclusie onwaar is of dat de tegenpartij gelijk heeft. Daarnaast kan een op zichzelf inhoudelijk relevante kritiek het gesprek onredelijk blokkeren als zij eindeloos nieuwe eisen stelt of een bewijslast ontwijkt. Beoordeel dus zowel de inferentie als haar gebruik in de dialoog, met oog voor het soort vraag dat gezamenlijk moet worden opgelost.",
        "example": "“Of we sluiten de speeltuin, of we laten gevaar bestaan” kan worden hersteld door reparatie, toezicht en gedeeltelijke afsluiting op dezelfde criteria te vergelijken.",
        "takeaway": "Kritiek wordt sterker wanneer zij precies aangeeft welke verbetering de redenering nodig heeft."
      }
    ],
    "deepDive": {
      "title": "De fout in “dat argument is fout, dus de conclusie is fout”",
      "body": "Twee uitspraken moeten gescheiden blijven: “dit argument rechtvaardigt conclusie C niet” en “C is onwaar”. De eerste kan juist zijn zonder dat de tweede volgt. Iemand kan een werkelijk gevaarlijke brug met een irrelevant scheldwoord beschrijven. Het scheldwoord ondersteunt de onveiligheidsclaim niet, maar een inspectie kan dat alsnog doen. Wie na de drogredendiagnose onmiddellijk de brug veilig verklaart, maakt zelf een ongeoorloofde gevolgtrekking.\n\nDie scheiding maakt argumentanalyse minder tribaal. Je kunt een slechte reden van je eigen partij afwijzen zonder automatisch de tegenpartij te steunen. Je kunt ook erkennen dat een tegenstander een relevante zorg noemt, terwijl diens conclusie te breed blijft. Zorgvuldige kritiek richt zich op de rechtvaardiging van een specifieke claim met een specifieke reikwijdte. Daarom is reparatie een krachtiger leerdoel dan het verzamelen van labels: zij vraagt begrip van wat de reden moest doen.\n\nEr bestaan verschillende theoretische benaderingen van drogredenen. Sommige leggen nadruk op logische of epistemische tekortkomingen; andere toetsen geschonden dialoogregels of de verhouding tot een publiek. Zij hoeven niet in ieder geval identieke classificaties te geven. Een zorgvuldig oordeel benoemt daarom de gehanteerde norm en de contextgegevens. Bij twijfel kan “mogelijk problematisch omdat …” nauwkeuriger zijn dan een stellige classificatie. De opdracht blijft om het concrete argument eerlijk te reconstrueren, de kwetsbare stap aan te wijzen en een verdedigbare route naar een beperktere of beter ondersteunde conclusie te zoeken."
    },
    "exercises": [
      {
        "id": "b6-stropop",
        "kind": "choice",
        "prompt": "Waar zit de vervorming?",
        "scenario": "Mila: “Ik wil één parkeerplaats vervangen door een fietsrek.” Joost: “Mila wil automobilisten uit de hele stad weren.”",
        "explanation": "Joost bestrijdt een veel bredere positie dan Mila naar voren bracht.",
        "options": [
          {
            "id": "b6-stropop-o1",
            "text": "De reactie verandert een lokaal fietsrekvoorstel in een totaalverbod.",
            "feedback": "Juist: dat is de concrete vertekening die een stropopdiagnose ondersteunt."
          },
          {
            "id": "b6-stropop-o2",
            "text": "Mila noemt geen bronnen, dus haar voorstel is per definitie onwaar.",
            "feedback": "Een niet onderbouwd voorstel is niet automatisch onwaar; bovendien verklaart dit Joosts vertekening niet."
          },
          {
            "id": "b6-stropop-o3",
            "text": "Elke kritiek op een verkeersvoorstel is een persoonlijke aanval.",
            "feedback": "De kritiek gaat hier over een vervormd standpunt, niet over Mila’s eigenschappen."
          }
        ],
        "answer": "b6-stropop-o1"
      },
      {
        "id": "b6-conclusie",
        "kind": "choice",
        "prompt": "Wat volgt uit het aantonen van een drogreden?",
        "scenario": "Een campagne verdedigt een maatregel met een irrelevant scheldwoord tegen haar tegenstander.",
        "explanation": "De opgegeven reden faalt. De maatregel kan nog door andere redenen ondersteund of bestreden worden.",
        "options": [
          {
            "id": "b6-conclusie-o1",
            "text": "De maatregel is daardoor zeker onjuist.",
            "feedback": "Dit zou opnieuw een ongeldige stap zijn: een fout argument maakt zijn conclusie niet noodzakelijk onwaar."
          },
          {
            "id": "b6-conclusie-o2",
            "text": "Deze verdediging ondersteunt de maatregel niet voldoende.",
            "feedback": "Juist: de diagnose betreft de gegeven argumentatie."
          },
          {
            "id": "b6-conclusie-o3",
            "text": "Het tegenovergestelde beleid is daardoor bewezen.",
            "feedback": "Voor dat beleid moeten eigen redenen worden gegeven."
          }
        ],
        "answer": "b6-conclusie-o2"
      },
      {
        "id": "ba4-legitiem",
        "kind": "choice",
        "prompt": "Welke persoonlijke informatie is hier inhoudelijk relevant?",
        "scenario": "Een commissie beoordeelt de ongecontroleerde getuigenis van iemand die zegt zelf een defect te hebben gezien.",
        "explanation": "Waarnemingsmogelijkheden raken de betrouwbaarheid van deze specifieke getuigenis; smaak of kleding doen dat niet.",
        "options": [
          {
            "id": "ba4-legitiem-o1",
            "text": "De getuige draagt een opvallende jas.",
            "feedback": "Kleding ondersteunt geen oordeel over de waarneming van het defect."
          },
          {
            "id": "ba4-legitiem-o2",
            "text": "De getuige houdt niet van dezelfde muziek.",
            "feedback": "Een smaakverschil is geen reden om deze getuigenis te verwerpen."
          },
          {
            "id": "ba4-legitiem-o3",
            "text": "De getuige stond buiten zichtbereik en kan het beschreven onderdeel niet hebben gezien.",
            "feedback": "Juist: dit betreft een concrete voorwaarde voor de betrouwbaarheid van de getuigenis."
          },
          {
            "id": "ba4-legitiem-o4",
            "text": "De getuige is onaardig, dus het onderdeel werkt zeker goed.",
            "feedback": "Een onaardige persoon kan ware dingen melden; bovendien bewijst een zwakke getuigenis het tegendeel niet."
          }
        ],
        "answer": "ba4-legitiem-o3"
      },
      {
        "id": "b6-herstel",
        "kind": "sort",
        "prompt": "Welke reactie herstelt welk probleem?",
        "explanation": "Herstel richt zich op de argumentatieve stap die faalt.",
        "categories": [
          {
            "id": "persoon",
            "label": "Irrelevante persoonlijke aanval"
          },
          {
            "id": "stropop",
            "label": "Vervormd standpunt"
          },
          {
            "id": "dilemma",
            "label": "Onterecht beperkt keuzemenu"
          }
        ],
        "cards": [
          {
            "id": "b6-herstel-c1",
            "text": "Beoordeel de metingen in het rapport in plaats van de kleding van de analist.",
            "category": "persoon"
          },
          {
            "id": "b6-herstel-c2",
            "text": "Citeer eerst het beperkte voorstel voor één straat en toets dat voorstel.",
            "category": "stropop"
          },
          {
            "id": "b6-herstel-c3",
            "text": "Vergelijk naast volledige sluiting ook reparatie en gedeeltelijke afsluiting.",
            "category": "dilemma"
          }
        ]
      },
      {
        "id": "ba4-dossier",
        "kind": "reflection",
        "prompt": "Geef een diagnose met tekstbewijs, een reparatie en een conclusie die je nog niet mag trekken.",
        "scenario": "Een buurtforum bespreekt de voorgestelde verplaatsing van één bushalte. Voorstander Ana noemt een inspectierapport over onveilige oversteken. Tegenstander Bas zegt: “Ana heeft zelf geen auto, dus ze begrijpt verkeer niet. Ze wil blijkbaar alle automobilisten straffen. Of we houden alles zoals het is, of winkels verliezen al hun klanten.” De voorzitter wil het debat hervatten met de oorspronkelijke vraag: verbetert verplaatsing de veiligheid en bereikbaarheid van deze halte, gegeven kosten en alternatieve ontwerpen?",
        "explanation": "Er zijn drie verschillende problematische zetten; herstel vereist terugkeer naar het beperkte voorstel en relevante criteria.",
        "model": "De verwijzing naar autobezit vervangt beoordeling van het inspectierapport en is hier niet voldoende relevant. “Alle automobilisten straffen” vervormt een beperkt haltevoorstel. De tweedeling sluit tussenontwerpen en effectbeoordeling uit. Reparatie: citeer het werkelijke voorstel, toets het rapport en vergelijk behouden, verplaatsen en aanpassen op veiligheid, bereikbaarheid en kosten. Daarmee is verplaatsen nog niet bewezen: een gebrekkige tegenwerping levert zelf geen bewijs voor Ana’s beleid. Autobezit zou in een ander gesprek eigen gebruikservaring kunnen raken, maar geeft hier geen antwoord op het inspectierapport. Een eerlijke tegenwerping vraagt bijvoorbeeld of het ontwerp een nieuwe onveilige oversteek creëert. Dat bezwaar is toetsbaar en blijft binnen de oorspronkelijke beleidsvraag.",
        "rubric": [
          "Je koppelt minstens twee diagnoses aan concrete formuleringen.",
          "Je geeft een inhoudelijke reparatie met relevante criteria.",
          "Je scheidt falende tegenargumenten van bewijs voor het voorstel."
        ],
        "minWords": 80
      }
    ],
    "sourceIds": [
      "tindale",
      "hamblin",
      "groarke"
    ]
  },
  {
    "id": "basis-voorwaarden-en-gevolgen",
    "moduleId": "basis",
    "title": "Als, alleen als en wat daaruit volgt",
    "teaser": "Leer voorwaarden precies lezen voordat je een conclusie trekt uit een regel.",
    "minutes": 40,
    "objectives": [
      "Noodzakelijke en voldoende voorwaarden onderscheiden.",
      "Modus ponens en modus tollens toepassen.",
      "Bevestiging van het gevolg en ontkenning van de voorwaarde met een tegenvoorbeeld toetsen."
    ],
    "sections": [
      {
        "title": "Wat belooft een als-danregel?",
        "body": "Een voorwaarde is iets waarvan een regel afhangt. Schrijf “als P, dan Q” als een verband tussen twee volledige uitspraken: wanneer P waar is, moet Q binnen deze regel ook waar zijn. P is dan voldoende voor Q: P geeft volgens de regel genoeg om Q te concluderen. Q is noodzakelijk voor P: P kan niet waar zijn als Q onwaar is en de regel klopt. Dat zegt niet dat P de enige route naar Q is of dat P Q veroorzaakt. “Als iemand een toegangsbadge heeft, heeft diegene toegang” sluit toegang met een tijdelijke pas niet uit. “Toegang alleen als de veiligheidscheck klaar is” zegt juist dat toegang die check vereist. Let daarom op het verschil tussen “als” en “alleen als”. Maak de richting expliciet voordat je een persoon, dossier of besluit aan de regel toetst.",
        "example": "Een badge kan voldoende voor toegang zijn zonder noodzakelijk te zijn. Een verplichte veiligheidscheck kan noodzakelijk zijn zonder op zichzelf voldoende te zijn.",
        "takeaway": "Voldoende betekent: deze voorwaarde is genoeg. Noodzakelijk betekent: zonder deze voorwaarde kan het niet."
      },
      {
        "title": "Twee geldige stappen en twee verleidelijke fouten",
        "body": "Modus ponens gebruikt de regel “als P, dan Q” samen met P om Q te concluderen. Modus tollens gebruikt dezelfde regel samen met niet-Q om niet-P te concluderen. Beide zijn deductief geldig wanneer de regel en de aanvullende premisse kloppen. Twee vergelijkbare stappen zijn zonder extra premissen ongeldig. Uit Q volgt niet automatisch P: Q kan een andere route hebben. Uit niet-P volgt niet automatisch niet-Q: ook dan kan een andere route open zijn. Test dit met een mogelijke situatie waarin beide gegeven premissen waar blijven en de conclusie onwaar is. Zo’n tegenvoorbeeld weerlegt de gevolgtrekking, zonder te bewijzen wat in het echte geval gebeurd is. Wanneer je een praktische uitzondering noemt, controleer dan of die de regel beperkt of werkelijk een tegenvoorbeeld tegen de redeneringsvorm vormt.",
        "example": "Regel: als een badge geldig is, gaat het toegangslampje aan. Lampje aan bewijst geen geldige badge wanneer een testknop hetzelfde lampje kan activeren.",
        "takeaway": "Draai een voldoende voorwaarde niet stilzwijgend om in een noodzakelijke voorwaarde."
      }
    ],
    "deepDive": {
      "title": "Een bedrijfsregel is geen automatische beschrijving van de werkelijkheid",
      "body": "In een logisch argument neem je de premissen als uitgangspunt en vraag je of de conclusie daaruit noodzakelijk volgt. In het werk moet je daarnaast toetsen of een regel juist beschreven is en of het geval werkelijk aan haar voorwaarden voldoet. Een norm “goedgekeurde dossiers moeten worden afgehandeld” garandeert niet dat iedere medewerker de norm feitelijk naleeft. Het ontkennen van afhandeling bewijst dan niet zonder meer dat goedkeuring ontbrak. Je kunt daarmee ook een overtreding van de norm hebben ontdekt. Maak duidelijk of je een vast feitelijk verband of een gewenste procedure beschrijft.\n\nOok kunnen regels beperkt zijn tot een plaats, tijd of uitzondering. “Een geldige badge geeft toegang” kan in een instructie betekenen: tijdens openingstijden en wanneer het systeem werkt. Een redelijke reconstructie maakt die voorwaarden zichtbaar. Voor een strikt deductieve controle moet de volledige regel worden gebruikt; voor een praktisch advies kun je aangeven hoe zeker de toepasselijkheid is.\n\nEen noodzakelijke voorwaarde is bovendien geen complete rechtvaardiging. Dat een voorstel binnen het budget past, kan vereist zijn voor invoering, maar maakt kwaliteit en veiligheid niet overbodig. Een leidinggevende die één vereiste afvinkt en daarna volledige goedkeuring claimt, verwart noodzakelijk met voldoende. Vraag daarom steeds: welke route biedt deze regel, welke andere routes zijn mogelijk, en welke aanvullende voorwaarden ontbreken nog? Preciese taal bij voorwaarden voorkomt zowel onterechte afwijzingen als te snelle toezeggingen."
    },
    "exercises": [
      {
        "id": "bcnd1-richting",
        "kind": "choice",
        "prompt": "Welke uitspraak maakt de veiligheidscheck noodzakelijk maar nog niet voldoende?",
        "scenario": "Een team formuleert een toegangsregel.",
        "explanation": "“Alleen als” noemt een vereiste; andere vereisten kunnen blijven bestaan.",
        "options": [
          {
            "id": "bcnd1-richting-o1",
            "text": "Iedereen met een voltooide check krijgt altijd toegang.",
            "feedback": "Dit maakt de check voldoende en sluit zonder verdere voorwaarden geen andere routes uit."
          },
          {
            "id": "bcnd1-richting-o2",
            "text": "Iemand krijgt alleen toegang als de veiligheidscheck voltooid is.",
            "feedback": "Juist: zonder de check mag toegang niet plaatsvinden; een badge kan daarnaast nodig zijn."
          },
          {
            "id": "bcnd1-richting-o3",
            "text": "Iedereen met toegang heeft geen check nodig.",
            "feedback": "Dit spreekt de voorgestelde noodzakelijkheid tegen."
          },
          {
            "id": "bcnd1-richting-o4",
            "text": "Wie geen toegang heeft, heeft noodzakelijk geen check voltooid.",
            "feedback": "Geen toegang kan ook door een ander vereiste komen; de check kan wel voltooid zijn."
          }
        ],
        "answer": "bcnd1-richting-o2"
      },
      {
        "id": "bcnd2-tollens",
        "kind": "choice",
        "prompt": "Welke conclusie volgt geldig uit beide premissen?",
        "scenario": "Neem aan: als een dossier compleet is, verschijnt het op de complete-dossierslijst. Dossier K verschijnt daar niet.",
        "explanation": "Bij een ware regel en niet-Q volgt niet-P: modus tollens.",
        "options": [
          {
            "id": "bcnd2-tollens-o1",
            "text": "Dossier K is niet compleet.",
            "feedback": "Juist: compleet zijn zou volgens de regel verschijning op de lijst vereisen."
          },
          {
            "id": "bcnd2-tollens-o2",
            "text": "Dossier K is compleet omdat de lijst mogelijk kort is.",
            "feedback": "Dit volgt niet uit de gegeven premissen."
          },
          {
            "id": "bcnd2-tollens-o3",
            "text": "Alle dossiers zijn incompleet.",
            "feedback": "De informatie betreft één dossier, geen universele conclusie."
          },
          {
            "id": "bcnd2-tollens-o4",
            "text": "De regel is zeker onwaar.",
            "feedback": "Een incompleet dossier past juist bij beide gegeven premissen."
          }
        ],
        "answer": "bcnd2-tollens-o1"
      },
      {
        "id": "bcnd3-omkering",
        "kind": "choice",
        "prompt": "Welk tegenvoorbeeld toont de ongeldige omkering?",
        "scenario": "Regel: een geldig abonnement geeft toegang. Noor heeft toegang. Conclusie: Noor heeft een geldig abonnement.",
        "explanation": "Een andere toegangsroute kan beide premissen waar laten terwijl de conclusie onwaar is.",
        "options": [
          {
            "id": "bcnd3-omkering-o1",
            "text": "Noor heeft een geldig abonnement en krijgt toegang.",
            "feedback": "Dat is verenigbaar met de conclusie en toont de ongeldigheid niet."
          },
          {
            "id": "bcnd3-omkering-o2",
            "text": "Noor heeft geen toegang en geen abonnement.",
            "feedback": "Dan is de gegeven tweede premisse onwaar; het is geen passend tegenvoorbeeld."
          },
          {
            "id": "bcnd3-omkering-o3",
            "text": "Noor gebruikt een toegestane dagpas, heeft toegang en heeft geen abonnement.",
            "feedback": "Juist: de regel en toegang kunnen waar zijn zonder de geclaimde abonnementsconclusie."
          },
          {
            "id": "bcnd3-omkering-o4",
            "text": "Sommige abonnees krijgen geen toegang ondanks de gestelde regel.",
            "feedback": "Dat betwist de eerste premisse in plaats van een tegenvoorbeeld met ware premissen te geven."
          }
        ],
        "answer": "bcnd3-omkering-o3"
      },
      {
        "id": "bcnd4-stappen",
        "kind": "map",
        "prompt": "Plaats iedere stap bij haar logische functie.",
        "explanation": "De labels beoordelen de vorm bij dezelfde als-danregel, niet of de beschreven feiten echt kloppen.",
        "claim": "Lees de richting van een als-danregel.",
        "categories": [
          {
            "id": "ponens",
            "label": "Geldig: modus ponens"
          },
          {
            "id": "tollens",
            "label": "Geldig: modus tollens"
          },
          {
            "id": "gevolg",
            "label": "Ongeldig: bevestiging van gevolg"
          },
          {
            "id": "voorwaarde",
            "label": "Ongeldig: ontkenning van voorwaarde"
          }
        ],
        "cards": [
          {
            "id": "bcnd4-stappen-c1",
            "text": "Als P dan Q; P; dus Q.",
            "category": "ponens"
          },
          {
            "id": "bcnd4-stappen-c2",
            "text": "Als P dan Q; niet-Q; dus niet-P.",
            "category": "tollens"
          },
          {
            "id": "bcnd4-stappen-c3",
            "text": "Als P dan Q; Q; dus P.",
            "category": "gevolg"
          },
          {
            "id": "bcnd4-stappen-c4",
            "text": "Als P dan Q; niet-P; dus niet-Q.",
            "category": "voorwaarde"
          }
        ]
      },
      {
        "id": "bcnd5-dossier",
        "kind": "reflection",
        "prompt": "Analyseer de regel en geef een tegenvoorbeeld plus een betere reactie.",
        "scenario": "Een manager zegt: “Als een medewerker de extra training voltooit, mag diegene het specialistische systeem gebruiken.” Sam gebruikt het systeem en heeft de extra training niet gevolgd. Een collega concludeert dat Sam dus liegt over toestemming. Het toegangsbeleid kent echter ook een route voor medewerkers met een erkend extern certificaat. Daarnaast is een actuele veiligheidscheck verplicht. Het team wil regels duidelijker formuleren zonder terecht toegelaten collega’s onredelijk te beschuldigen.",
        "explanation": "De gegeven training is een voldoende route in de formulering; zij is niet als de enige noodzakelijke route omschreven.",
        "model": "De uitspraak maakt voltooide training een toegangsroute, maar sluit een extern certificaat niet uit. Sam kan dus toestemming hebben zonder die training; dat vormt een tegenvoorbeeld tegen de omkering. De veiligheidscheck is een aparte noodzakelijke voorwaarde en moet eveneens worden nagegaan. De conclusie dat Sam liegt is daarom te sterk. Een betere reactie is om de erkende routes en vereisten te verduidelijken en Sams toestemming daarop te toetsen. Formuleer bijvoorbeeld: gebruik is toegestaan bij een goedgekeurde training of erkend certificaat, mits de actuele veiligheidscheck is voltooid. Toets ook of deze formulering het volledige beleid weergeeft voordat je haar als strikte regel behandelt.",
        "rubric": [
          "Je onderscheidt voldoende routes van noodzakelijke vereisten.",
          "Je geeft een tegenvoorbeeld met ware premissen en een onware conclusie.",
          "Je formuleert een gerichte controle en een helderder regel."
        ],
        "minWords": 80
      }
    ],
    "sourceIds": [
      "govier",
      "groarke"
    ]
  },
  {
    "id": "basis-checkpoint",
    "moduleId": "basis",
    "title": "Checkpoint: reconstructie, gevolgtrekking en gerichte kritiek",
    "teaser": "Acht nieuwe situaties testen of je functie, structuur en kritiek kunt verbinden.",
    "minutes": 25,
    "checkpoint": true,
    "objectives": [
      "Een conclusie reconstrueren zonder haar te versterken.",
      "De juiste beoordelingsvraag kiezen.",
      "Een fout herstellen zonder de conclusie overhaast te verwerpen."
    ],
    "sections": [
      {
        "title": "Pas de basis samen toe",
        "body": "Lees eerst de context en identificeer het standpunt. Zoek vervolgens de genoemde redenen en hun verbinding met de conclusie. Beoordeel pas daarna de kwaliteit. De acht situaties gebruiken dezelfde begrippen als de lessen, maar andere voorbeelden.",
        "example": "Een argument over een aankoop vraagt om een analyse van het advies, de redenen en mogelijke verborgen voorwaarden.",
        "takeaway": "Herkennen, reconstrueren en beoordelen zijn afzonderlijke stappen."
      },
      {
        "title": "Gebruik fouten als aanwijzing",
        "body": "Maak de vragen eerst vanuit je eigen begrip. Lees na het nakijken ook de feedback bij de andere mogelijkheden: die maakt typische verwarringen zichtbaar. Een voldoende resultaat is een praktisch teken van voortgang op deze oefeningen, geen bewijs dat je elk werkelijk debat al beheerst.",
        "example": "Een verkeerde keuze tussen uitleg en argument kan betekenen dat je de gespreksvraag nog niet expliciet hebt bepaald.",
        "takeaway": "Herhaal gericht het begrip dat de feedback aanwijst."
      }
    ],
    "deepDive": {
      "title": "Van score naar overdraagbare vaardigheid",
      "body": "Een toets telt antwoorden; een redelijke analist kan ook uitleggen waarom de beoordeling past. Controleer na deze vragen of je de conclusie, de ondersteuningsrelatie en een mogelijk bezwaar in je eigen woorden kunt noemen. In werkelijk taalgebruik blijven interpretaties soms onzeker. Benoem die onzekerheid in plaats van ieder geval in een bekend vakje te duwen."
    },
    "exercises": [
      {
        "id": "bc1-functie",
        "kind": "choice",
        "prompt": "Wat doet de laatste zin vooral?",
        "scenario": "Iedereen weet dat de vergadering is afgelast. “De vergadering is afgelast omdat de voorzitter ziek is.”",
        "explanation": "De afgelasting wordt aangenomen en de ziekte verklaart haar.",
        "options": [
          {
            "id": "bc1-functie-o1",
            "text": "Een aangenomen gebeurtenis verklaren.",
            "feedback": "Juist: de vraag is hier waarom de afgelasting plaatsvond."
          },
          {
            "id": "bc1-functie-o2",
            "text": "Bewijzen dat een vergadering bestaat.",
            "feedback": "De zin verdedigt het bestaan van de vergadering niet."
          },
          {
            "id": "bc1-functie-o3",
            "text": "Een normatief beleidsadvies geven.",
            "feedback": "Er wordt geen aanbeveling geformuleerd."
          }
        ],
        "answer": "bc1-functie-o1"
      },
      {
        "id": "bc2-hoofd",
        "kind": "choice",
        "prompt": "Wat is de hoofdconclusie?",
        "scenario": "“Het dak lekt. Daardoor beschadigen boeken. Het dak moet voor de winter worden gerepareerd.”",
        "explanation": "Het reparatieadvies is het eindpunt van de redenering.",
        "options": [
          {
            "id": "bc2-hoofd-o1",
            "text": "Er zijn boeken.",
            "feedback": "Dit is hooguit achtergrond, geen geformuleerde hoofdconclusie."
          },
          {
            "id": "bc2-hoofd-o2",
            "text": "Het dak moet voor de winter worden gerepareerd.",
            "feedback": "Juist: de lek en de schade ondersteunen deze aanbeveling."
          },
          {
            "id": "bc2-hoofd-o3",
            "text": "Het dak lekt.",
            "feedback": "Dit is de beginpremisse."
          }
        ],
        "answer": "bc2-hoofd-o2"
      },
      {
        "id": "bc3-voorwaarden",
        "kind": "choice",
        "prompt": "Welke gevolgtrekking is geldig?",
        "scenario": "Neem aan: als een dossier urgent is, krijgt het vandaag een beoordeling. Dossier M krijgt vandaag geen beoordeling.",
        "explanation": "Modus tollens ontkent de voorwaarde wanneer de noodzakelijke gevolguitspraak ontbreekt.",
        "options": [
          {
            "id": "bc3-voorwaarden-o1",
            "text": "M is niet urgent.",
            "feedback": "Juist: urgentie zou volgens de aangenomen regel beoordeling vandaag vereisen."
          },
          {
            "id": "bc3-voorwaarden-o2",
            "text": "M is urgent omdat de beoordeling ontbreekt.",
            "feedback": "Dit volgt niet uit de regel en de gegeven afwezigheid."
          },
          {
            "id": "bc3-voorwaarden-o3",
            "text": "Geen dossier is urgent.",
            "feedback": "De informatie betreft M, niet alle dossiers."
          }
        ],
        "answer": "bc3-voorwaarden-o1"
      },
      {
        "id": "bc4-brug",
        "kind": "choice",
        "prompt": "Welke brug is nodig?",
        "scenario": "“Deze opdracht bevat privégegevens; we moeten haar in de openbare presentatie anonimiseren.”",
        "explanation": "De brug koppelt het gegeven feit aan een privacyregel voor openbaar gebruik.",
        "options": [
          {
            "id": "bc4-brug-o1",
            "text": "Alle privégegevens zijn altijd onwaar.",
            "feedback": "Dit is irrelevant voor de aanbeveling om te anonimiseren."
          },
          {
            "id": "bc4-brug-o2",
            "text": "Een openbare presentatie heeft altijd vijf dia’s.",
            "feedback": "Dit verbindt privégegevens niet met anonimiseren."
          },
          {
            "id": "bc4-brug-o3",
            "text": "Privégegevens mogen hier niet herkenbaar openbaar worden gemaakt.",
            "feedback": "Juist: dit is de relevante normatieve brug."
          }
        ],
        "answer": "bc4-brug-o3"
      },
      {
        "id": "bc5-reparatie",
        "kind": "choice",
        "prompt": "Welke kritiek met herstel is het sterkst?",
        "scenario": "“Of iedereen komt met de auto, of de bijeenkomst kan niet plaatsvinden.” Er zijn ook trein- en fietsverbindingen.",
        "explanation": "De beschikbaarheid van andere vervoersmiddelen ondermijnt de uitputtendheid van het dilemma.",
        "options": [
          {
            "id": "bc5-reparatie-o1",
            "text": "De spreker is vervelend, dus de bijeenkomst moet vervallen.",
            "feedback": "Deze reactie vervangt argumentbeoordeling door een irrelevante eigenschap."
          },
          {
            "id": "bc5-reparatie-o2",
            "text": "De keuze is te beperkt; vergelijk auto, trein, fiets en eventuele combinaties.",
            "feedback": "Juist: dit benoemt het probleem en geeft een concrete reparatie."
          },
          {
            "id": "bc5-reparatie-o3",
            "text": "Iedere uitspraak met “of” is een drogreden.",
            "feedback": "Sommige alternatieven zijn werkelijk uitputtend; het probleem is hier de uitsluiting van beschikbare opties."
          }
        ],
        "answer": "bc5-reparatie-o2"
      },
      {
        "id": "bac6-convergent",
        "kind": "choice",
        "prompt": "Wat mag je concluderen na het verwerpen van één route?",
        "scenario": "Een campuslocatie heeft volgens het team twee zelfstandige voordelen: korte reistijd en lage huur. De huur blijkt hoger dan begroot.",
        "explanation": "Het reistijdargument blijft bestaan; of dit opweegt tegen de echte huur vergt een nieuwe beoordeling.",
        "options": [
          {
            "id": "bac6-convergent-o1",
            "text": "De locatie is automatisch ongeschikt.",
            "feedback": "Het wegvallen van één convergente reden bewijst niet dat alle steun verdwijnt."
          },
          {
            "id": "bac6-convergent-o2",
            "text": "De reistijd blijft een reden, maar voldoende steun voor de keuze is nog te beoordelen.",
            "feedback": "Juist: je scheidt overblijvende ondersteuning van de definitieve beslissing."
          },
          {
            "id": "bac6-convergent-o3",
            "text": "De lage huur wordt waar doordat de reistijd kort is.",
            "feedback": "De twee voordelen maken elkaars feitelijke inhoud niet waar."
          }
        ],
        "answer": "bac6-convergent-o2"
      },
      {
        "id": "bac7-noodzakelijk",
        "kind": "choice",
        "prompt": "Wat betekent deze regel?",
        "scenario": "“Een proef start alleen als de veiligheidscheck voltooid is.”",
        "explanation": "Een only-if-formulering maakt de check noodzakelijk, niet automatisch voldoende.",
        "options": [
          {
            "id": "bac7-noodzakelijk-o1",
            "text": "Een voltooide check garandeert op zichzelf starttoestemming.",
            "feedback": "Er kunnen nog andere voorwaarden, zoals budget, ontbreken."
          },
          {
            "id": "bac7-noodzakelijk-o2",
            "text": "Start vereist een voltooide check; andere vereisten kunnen daarnaast gelden.",
            "feedback": "Juist: noodzakelijk betekent zonder deze voorwaarde niet."
          },
          {
            "id": "bac7-noodzakelijk-o3",
            "text": "Wie de check niet voltooit, krijgt via deze regel toch toestemming.",
            "feedback": "Dit is in strijd met de genoemde vereiste."
          }
        ],
        "answer": "bac7-noodzakelijk-o2"
      },
      {
        "id": "bac8-aanvulling",
        "kind": "choice",
        "prompt": "Welke kritiek op deze reconstructie is het sterkst?",
        "scenario": "Tekst: “De pilot lijkt sommige studenten te helpen.” Schema van de analist: “De methode helpt altijd iedereen, dus algemene verplichting is bewezen.”",
        "explanation": "De analist vergroot modaliteit en populatie en voegt een normatieve conclusie toe zonder brug.",
        "options": [
          {
            "id": "bac8-aanvulling-o1",
            "text": "Een reconstructie moet altijd sterker zijn dan het origineel.",
            "feedback": "Welwillende interpretatie staat geen willekeurige versterking toe."
          },
          {
            "id": "bac8-aanvulling-o2",
            "text": "Een pilot kan nooit enige informatie opleveren.",
            "feedback": "Een pilot kan lokale aanwijzingen geven, ook als generalisatie beperkt blijft."
          },
          {
            "id": "bac8-aanvulling-o3",
            "text": "Het schema verliest de beperkingen en voegt een niet verdedigde aanbeveling toe.",
            "feedback": "Juist: dit identificeert beide interpretatieve problemen."
          }
        ],
        "answer": "bac8-aanvulling-o3"
      }
    ],
    "sourceIds": [
      "govier",
      "groarke",
      "tindale"
    ]
  },
  {
    "id": "bachelor-persoon-en-expertise",
    "moduleId": "bachelor",
    "title": "Persoonlijke kritiek en het argument uit deskundigheid",
    "minutes": 38,
    "teaser": "Bepaal wanneer informatie over een bron relevant is en hoeveel haar oordeel kan rechtvaardigen.",
    "objectives": [
      "Irrelevante ad hominem onderscheiden van bronkritiek.",
      "Het deskundigheidsschema met kritische vragen beoordelen.",
      "Belangenconflict, domeinkennis en inhoudelijk bewijs apart wegen."
    ],
    "sections": [
      {
        "title": "Een persoon aanvallen of een getuigenis toetsen?",
        "body": "“Zij is onaardig, dus haar berekening is fout” vervangt een inhoudelijke beoordeling door een eigenschap zonder relevante verbinding. Bronkritiek kan daarentegen wel nodig zijn wanneer een conclusie op getuigenis steunt. Heeft de bron toegang tot het feit? Is zij deskundig op dit precieze terrein? Zijn er redenen om haar verslag te wantrouwen? Het aantonen van een belangenconflict bewijst niet automatisch dat het oordeel onwaar is. Het kan betekenen dat aanvullende controle nodig is of dat ongecontroleerde getuigenis minder gewicht krijgt. Ook tu quoque, “jij doet het zelf ook”, weerlegt een norm niet uitsluitend door inconsistent gedrag van haar verdediger. In een gesprek over uitvoerbaarheid of geloofwaardigheid kan dat gedrag wel relevant worden, maar dan moet de spreker de verbinding expliciet onderbouwen. Houd persoon, uitspraak en ondersteuningsroute uit elkaar.",
        "example": "Een analist met aandelen in een leverancier kan nog juiste meetresultaten publiceren. Onafhankelijke replicatie is een gerichte reactie; “dus ieder resultaat is vals” is te sterk.",
        "takeaway": "Relevante bronkritiek raakt een concrete betrouwbaarheidsvoorwaarde, niet de waarde van een persoon."
      },
      {
        "title": "Deskundigheid geeft herzienbare steun",
        "body": "Een argument uit deskundigheid gebruikt het oordeel van een relevante expert als reden voor een bewering binnen diens vakgebied. Het is niet per definitie een drogreden: een samenleving kan niet elk specialistisch resultaat persoonlijk herhalen. De steun blijft wel voorwaardelijk. Beoordeel expertise, passend domein, de werkelijk ingenomen positie, het beschikbare bewijs, betrouwbaarheid en de verhouding tot andere gekwalificeerde oordelen. Een chirurg is niet zonder extra reden deskundige op klimaatmodellen. Een expert die “mogelijk” zegt ondersteunt geen zekerheid. Consensus kan extra relevant zijn, maar populariteit onder willekeurige mensen is geen equivalent van een deskundige beoordeling. Verschillen tussen experts kunnen voortkomen uit waarden, onzekerheid of verschillende datasets. Vraag daarom waarover zij het precies eens of oneens zijn voordat je concludeert dat deskundigheid niets oplevert.",
        "example": "“Een verkeerskundige adviseert deze kruising anders in te richten na analyse van ongevalspatronen” heeft een andere bewijsbasis dan “een bekende acteur vindt deze kruising gevaarlijk”.",
        "takeaway": "Controleer het schema op toepassingsvoorwaarden en behoud de modaliteit van het deskundigenoordeel."
      }
    ],
    "deepDive": {
      "title": "Epistemische afhankelijkheid zonder blind gezag",
      "body": "Deskundigheidsargumenten maken onze afhankelijkheid van anderen zichtbaar. Veel kennis ontstaat door een taakverdeling: experts ontwikkelen methoden, beroepsgroepen bewaken standaarden en gebruikers vertrouwen deels op die instituties. Daaruit volgt geen onbeperkte gehoorzaamheid. Een verantwoord deskundigheidsargument kan juist uitleggen waarom een bepaalde bron in een bepaald domein een geschikte informant is en welke onafhankelijke controles beschikbaar zijn.\n\nEen relevant bezwaar tegen een bron richt zich meestal op de kracht van de gegeven steun, niet onmiddellijk op de waarheid van haar conclusie. Stel dat een leverancier de enige getuige voor de veiligheid van zijn product is. Een commercieel belang kan de ongecontroleerde getuigenis verzwakken. Een openbaar reproduceerbare test met onafhankelijke replicatie vraagt daarnaast een inhoudelijke beoordeling. Hetzelfde belang maakt die tests niet automatisch waardeloos, al kan de selectie van metingen of rapportage beïnvloeden.\n\nHier ligt ook het onderscheid tussen defeasibility en deductieve weerlegging. De aanvankelijke regel “dit deskundige oordeel geeft een goede reden” kan door nieuwe informatie minder toepasselijk worden. Dat betekent niet dat de tegenovergestelde claim volgt. Een goede reparatie zoekt aanvullende bewijsroutes of een beperktere conclusie. Vermijd eveneens het beroep op een los citaat zonder context: de expert kan een technisch conditionele uitspraak hebben gedaan die een campagne als absoluut presenteert. Bij een echte botsing tussen deskundigen is de volgende stap het lokaliseren van het geschil: gegevens, inferentie, definitie, onzekerheidsmarge of beleidswaarde."
    },
    "exercises": [
      {
        "id": "bh1-persoon",
        "kind": "choice",
        "prompt": "Welke tegenwerping is relevante bronkritiek?",
        "scenario": "Een oncontroleerbare getuigenis stelt dat een verboden stof in een afgesloten laboratorium is gebruikt.",
        "explanation": "Toegang tot de waarneming is direct relevant voor deze getuigenis.",
        "options": [
          {
            "id": "bh1-persoon-o1",
            "text": "De getuige stond op de beschreven datum aantoonbaar op een andere locatie en had geen toegang tot het lab.",
            "feedback": "Juist: dit raakt de mogelijkheid om het gemelde feit zelf waar te nemen."
          },
          {
            "id": "bh1-persoon-o2",
            "text": "De getuige is ooit over een ander onderwerp gecorrigeerd, dus dit verslag is noodzakelijk onwaar.",
            "feedback": "Een eerdere fout kan bronkritiek motiveren, maar bewijst niet automatisch dat dit specifieke verslag onwaar is."
          },
          {
            "id": "bh1-persoon-o3",
            "text": "De getuige verdedigt strengere labregels, dus het beschreven feit kan niet hebben plaatsgevonden.",
            "feedback": "Een mogelijk belang vraagt controle van het verslag; het sluit de gebeurtenis niet logisch uit."
          },
          {
            "id": "bh1-persoon-o4",
            "text": "Een deskundige vindt het verslag onwaarschijnlijk, dus de getuige heeft zeker gelogen.",
            "feedback": "Onwaarschijnlijkheid of deskundig meningsverschil bewijst geen opzettelijke onwaarheid."
          }
        ],
        "answer": "bh1-persoon-o1"
      },
      {
        "id": "bh1-expert",
        "kind": "choice",
        "prompt": "Welke stap is onvoldoende ondersteund?",
        "scenario": "Een bekende orthopedisch chirurg noemt in een interview één macro-economisch model “de enige juiste voorspelling”. Een politicus beroept zich op haar medische reputatie.",
        "explanation": "Reputatie in de geneeskunde toont geen relevante deskundigheid over macro-economische voorspellingen.",
        "options": [
          {
            "id": "bh1-expert-o1",
            "text": "De chirurg heeft een beroep.",
            "feedback": "Een beroep sluit relevante kennis niet uit."
          },
          {
            "id": "bh1-expert-o2",
            "text": "Haar medische reputatie wordt zonder domeinbrug als economisch gezag gebruikt.",
            "feedback": "Juist: de expertisevoorwaarde is niet aangetoond voor de geclaimde conclusie."
          },
          {
            "id": "bh1-expert-o3",
            "text": "Experts mogen nooit over een ander onderwerp spreken.",
            "feedback": "Zij mogen spreken; hun specifieke bewijs en expertise moeten alleen apart beoordeeld worden."
          },
          {
            "id": "bh1-expert-o4",
            "text": "De economische voorspelling is daardoor zeker fout.",
            "feedback": "Een zwak beroep op gezag bewijst niet dat de voorspelling onwaar is."
          }
        ],
        "answer": "bh1-expert-o2"
      },
      {
        "id": "bh1-belangen",
        "kind": "choice",
        "prompt": "Welke conclusie is het best begrensd?",
        "scenario": "Een toxicoloog publiceert data over een middel waarvan haar werkgever producent is. De ruwe data en methoden zijn openbaar, maar onafhankelijke replicatie ontbreekt.",
        "explanation": "Het belang rechtvaardigt controle van onafhankelijkheid en bewijs; het bewijst geen vervalsing.",
        "options": [
          {
            "id": "bh1-belangen-o1",
            "text": "De resultaten zijn zeker verzonnen.",
            "feedback": "Een belang is geen bewijs dat de data vervalst zijn."
          },
          {
            "id": "bh1-belangen-o2",
            "text": "Het belang is irrelevant omdat er data zijn.",
            "feedback": "Belangen kunnen keuzes bij metingen en rapportage raken; openheid heft die vragen niet volledig op."
          },
          {
            "id": "bh1-belangen-o3",
            "text": "Er is reden voor gerichte controle en onafhankelijke replicatie vóór een sterke conclusie.",
            "feedback": "Juist: dit geeft het bezwaar een passende reikwijdte."
          },
          {
            "id": "bh1-belangen-o4",
            "text": "De werkgever heeft het middel gemaakt, dus het is bewezen veilig.",
            "feedback": "Dit vervangt beoordeling door een niet gerechtvaardigde zekerheid."
          }
        ],
        "answer": "bh1-belangen-o3"
      },
      {
        "id": "bh1-schema",
        "kind": "sort",
        "prompt": "Koppel elke kritische vraag aan de deskundigheidsvoorwaarde.",
        "explanation": "De vragen helpen de bron en de inhoud afzonderlijk te beoordelen.",
        "categories": [
          {
            "id": "domein",
            "label": "Relevante deskundigheid"
          },
          {
            "id": "positie",
            "label": "Werkelijke uitspraak"
          },
          {
            "id": "bewijs",
            "label": "Onderliggende bewijsbasis"
          },
          {
            "id": "onafhankelijk",
            "label": "Betrouwbaarheid en onafhankelijkheid"
          }
        ],
        "cards": [
          {
            "id": "bh1-schema-c1",
            "text": "Gaat haar vakgebied werkelijk over deze blootstellingsroute?",
            "category": "domein"
          },
          {
            "id": "bh1-schema-c2",
            "text": "Zei zij “veilig bij deze dosis” of “altijd veilig”?",
            "category": "positie"
          },
          {
            "id": "bh1-schema-c3",
            "text": "Welke metingen en methoden ondersteunen het oordeel?",
            "category": "bewijs"
          },
          {
            "id": "bh1-schema-c4",
            "text": "Is selectie van ongunstige resultaten controleerbaar?",
            "category": "onafhankelijk"
          }
        ]
      },
      {
        "id": "bh1-dossier",
        "kind": "reflection",
        "prompt": "Schrijf een beoordeling die bronkritiek, inhoudelijk bewijs en conclusie onderscheidt.",
        "scenario": "Een stad overweegt nieuwe luchtfilters voor scholen. De producent citeert een hoogleraar materiaalkunde die het filtermedium technisch effectief noemt bij een bepaalde luchtstroom. Een oudergroep merkt op dat de hoogleraar advieswerk voor het bedrijf verricht en concludeert dat de filters niet werken. Een onafhankelijke installateur waarschuwt dat klaslokalen soms onvoldoende ventilatiecapaciteit hebben voor die luchtstroom. Er zijn laboratoriumtests, maar nog geen metingen van blootstelling in bezette klaslokalen. De gemeente wil een verantwoord advies over invoering.",
        "explanation": "Zowel de advertentie als de algemene afwijzing kan te sterk zijn. Domein, belangen en toepassingsvoorwaarden moeten apart onderzocht worden.",
        "model": "De materiaalkundige ondersteunt een technische werking onder gespecificeerde omstandigheden, geen bewezen effect in ieder klaslokaal. Haar adviesbelang vraagt controle maar bewijst niet dat het medium niet werkt. De installateur noemt een toepassingsvoorwaarde die het praktijkresultaat kan beperken. Een verantwoord advies is om de laboratoriumgegevens te toetsen, belangen transparant te maken en onafhankelijke praktijkmetingen bij haalbare luchtstromen uit te voeren vóór algemene invoering. Het sterkste argument vóór nader testen is niet alleen wantrouwen tegenover de producent, maar de ontbrekende verbinding tussen een technisch laboratoriumresultaat en de blootstelling van kinderen in echte lokalen. Een beperkte pilot met vooraf gekozen uitkomst kan die verbinding toetsen zonder werkzaamheid al te veronderstellen.",
        "rubric": [
          "Je identificeert de exacte claim en het relevante domein.",
          "Je weegt belangen zonder automatische verwerping.",
          "Je benoemt een concrete toepassingsvoorwaarde en proportionele vervolgstap."
        ],
        "minWords": 80
      }
    ],
    "sourceIds": [
      "walton",
      "schemes",
      "tindale"
    ]
  },
  {
    "id": "bachelor-stropop-analogie",
    "moduleId": "bachelor",
    "title": "Eerlijke reconstructie, stropoppen en analogieën",
    "minutes": 36,
    "teaser": "Vergelijk werkelijk verdedigde standpunten en toets welke overeenkomsten een conclusie kunnen dragen.",
    "objectives": [
      "Een stropop onderbouwen met het verschil tussen twee posities.",
      "Een analogie beoordelen op relevante overeenkomsten en verschillen.",
      "Welwillende interpretatie begrenzen zonder het argument over te nemen."
    ],
    "sections": [
      {
        "title": "Vertekening herkennen zonder intentie te raden",
        "body": "Bij een stropop wordt een standpunt vervangen door een zwakkere of extremere versie die vervolgens wordt bestreden alsof zij het oorspronkelijke standpunt was. De diagnose vereist daarom een vergelijking: wat verdedigde de ander, welke positie wordt aangevallen en waarom verandert dat verschil de beoordeling? Je hoeft daarvoor geen kwade bedoeling te bewijzen. Onzorgvuldig samenvatten kan hetzelfde argumentatieve effect hebben. Let op verschuivingen van “sommige” naar “alle”, van voorwaarde naar onvoorwaardelijkheid of van lokale proef naar algemene verplichting. Een vereenvoudiging is niet automatisch een stropop: zij kan een geaccepteerde samenvatting zijn die relevante voorwaarden behoudt. Een goede herstelzet legt de reconstructie voor, noemt de sterkste tekstgetrouwe lezing en formuleert dan een bezwaar dat die lezing werkelijk raakt. Het debat wordt daarmee preciezer, ook wanneer inhoudelijk onenigheid blijft bestaan.",
        "example": "“Een pilot met optionele opnames” is niet hetzelfde als “alle studenten moeten alleen nog video’s bekijken”. Bestrijd de pilotvoorwaarden, niet een vervangend totaalmodel.",
        "takeaway": "Toon de tekstuele verschuiving aan en herstel de werkelijk verdedigde claim."
      },
      {
        "title": "Analogie: overeenkomsten moeten argumentatief relevant zijn",
        "body": "Een analogie redeneert van een brongeval naar een doelgeval: omdat een eigenschap of beslissing in het ene geval geldt en de gevallen relevant vergelijkbaar zijn, geldt zij vermoedelijk ook in het andere. De steun ligt niet in het aantal oppervlakkige overeenkomsten. Zoek het mechanisme, principe of criterium dat de overdracht moet rechtvaardigen. Een ontbrekend relevant verschil kan de inferentie verzwakken, terwijl een verschil in kleur of naam irrelevant blijft. Analogische argumenten kunnen beschrijvend zijn, bijvoorbeeld over effect, of normatief, bijvoorbeeld over gelijke behandeling. Zij vragen verschillende bruggen. Een succesvolle maatregel bij volwassenen voorspelt niet zonder meer hetzelfde effect bij kinderen; vergelijkbaarheid in leeftijd, vrijwilligheid en leercontext kan beslissend zijn. Een analogie is dus een te toetsen schema en geen automatische drogreden of zelfstandig empirisch bewijs.",
        "example": "“We lenen apparatuur uit in de bibliotheek, dus we kunnen ook meetapparatuur uitlenen” vraagt vergelijking van veiligheidsrisico, training, schade en controle, niet alleen van het woord “apparatuur”.",
        "takeaway": "Koppel de overeenkomst aan de inferentie en beoordeel relevante disanalogieën."
      }
    ],
    "deepDive": {
      "title": "Interpretatieve welwillendheid en de grens van het staalmanargument",
      "body": "Welwillende reconstructie zoekt de redelijkste lezing die tekst en context dragen. Zij mag een vage formulering verduidelijken, maar niet de auteur een compleet nieuw en veel sterker argument toeschrijven. De populaire opdracht om altijd een “steelman” te maken kan daardoor dubbelzinnig zijn. Als je het sterkste denkbare argument voor een positie ontwikkelt, verricht je constructief filosofisch werk. Als je vervolgens beweert dat dit het oorspronkelijke argument was, verlies je tekstgetrouwheid. Benoem dus of je interpreteert of verbeteringen voorstelt.\n\nBij analogieën heeft dezelfde discipline een extra functie. De bron en het doel zijn nooit in alle opzichten identiek. De vraag is of zij overeenkomen op het punt dat de conclusie draagt. Dat punt kan empirisch of normatief zijn. Bij een voorspelling zoek je een gedeeld werkingsmechanisme en vergelijkbare omstandigheden. Bij een rechtvaardigheidsargument vraag je of het verschil tussen gevallen een relevant onderscheid vormt volgens het gekozen principe. Een verschil kan voor het ene doel irrelevant zijn en voor het andere doorslaggevend.\n\nEen goede tegenwerping doet daarom meer dan “de gevallen zijn anders” zeggen. Zij benoemt het verschil, legt uit waarom het de relevante brug aantast en stelt eventueel een beperktere overdracht voor. Ook een geslaagde analogie kan een voorlopige verwachting of principiële consistentievraag opleveren zonder een definitieve conclusie te bewijzen. Het uitproberen van een overeenkomst is vaak vruchtbaar; het overslaan van de brug maakt haar kwetsbaar."
    },
    "exercises": [
      {
        "id": "bh2-stropop",
        "kind": "choice",
        "prompt": "Welke vergelijking onderbouwt een stropopdiagnose?",
        "scenario": "Lina verdedigt twee weken vrijwillige stilteblokken voor studenten die geconcentreerd willen werken. Een reactie noemt haar voorstel een permanent verbod op gesprekken voor iedereen.",
        "explanation": "De reactie verandert duur, vrijwilligheid en doelgroep; die wijzigingen maken een ander voorstel makkelijker aan te vallen.",
        "options": [
          {
            "id": "bh2-stropop-o1",
            "text": "De reactie is boos geschreven.",
            "feedback": "Een boze toon kan onaangenaam zijn, maar bewijst de inhoudelijke vertekening niet."
          },
          {
            "id": "bh2-stropop-o2",
            "text": "De reactie verschuift een tijdelijke vrijwillige voorziening naar een algemeen permanent verbod.",
            "feedback": "Juist: dit benoemt de verschillen die de aangevallen claim veranderen."
          },
          {
            "id": "bh2-stropop-o3",
            "text": "Lina vindt stilte prettig.",
            "feedback": "Deze voorkeur toont geen stropop in de reactie."
          },
          {
            "id": "bh2-stropop-o4",
            "text": "Ieder bezwaar tegen stilte is een stropop.",
            "feedback": "Een bezwaar dat de werkelijk voorgestelde voorziening raakt kan legitiem zijn."
          }
        ],
        "answer": "bh2-stropop-o2"
      },
      {
        "id": "bh2-analogie",
        "kind": "choice",
        "prompt": "Welk verschil is het meest relevant voor deze effectvoorspelling?",
        "scenario": "Een vrijwillige reminder-app helpt volwassenen in een avondcursus. Een school voorspelt hetzelfde effect bij verplicht gebruik door kinderen.",
        "explanation": "Leeftijd en vrijwilligheid kunnen motivatie, toestemming en gebruik veranderen en raken het mogelijke effectmechanisme.",
        "options": [
          {
            "id": "bh2-analogie-o1",
            "text": "Het logo heeft een andere kleur.",
            "feedback": "Zonder extra mechanisme is dit een oppervlakkig verschil."
          },
          {
            "id": "bh2-analogie-o2",
            "text": "De scholen gebruiken andere straatnamen.",
            "feedback": "Straatnamen verbinden zich niet met de voorspelde werking."
          },
          {
            "id": "bh2-analogie-o3",
            "text": "De doelgroepen verschillen in leeftijd en vrijwilligheid van deelname.",
            "feedback": "Juist: deze verschillen kunnen de overdracht van het effect aantasten."
          },
          {
            "id": "bh2-analogie-o4",
            "text": "Beide systemen worden een app genoemd.",
            "feedback": "Een gedeelde naam garandeert geen relevante werking."
          }
        ],
        "answer": "bh2-analogie-o3"
      },
      {
        "id": "bh2-herstel",
        "kind": "choice",
        "prompt": "Welke reactie behoudt tekstgetrouwheid en levert inhoudelijke kritiek?",
        "scenario": "Een voorstel biedt facultatieve opnames wanneer privacyvoorwaarden vervuld zijn.",
        "explanation": "De beste reactie bespreekt de voorwaarden van dit voorstel en vervangt het niet door een verplicht totaalmodel.",
        "options": [
          {
            "id": "bh2-herstel-o1",
            "text": "“Je wilt alle docenten filmen en iedereen thuis houden.”",
            "feedback": "Dit voegt verplichting en een nieuw onderwijsmodel toe."
          },
          {
            "id": "bh2-herstel-o2",
            "text": "“Welke privacyvoorwaarden gelden en helpt facultatieve opname ook bij actieve werkgroepen?”",
            "feedback": "Juist: de vraag raakt de werkelijke voorwaarden en toepassingsgrenzen."
          },
          {
            "id": "bh2-herstel-o3",
            "text": "“Ik verbeter jouw voorstel tot alle lessen verplicht online, en beoordeel dat.”",
            "feedback": "Dat kan een nieuw ontwerp zijn, maar geen beoordeling van het oorspronkelijke voorstel."
          },
          {
            "id": "bh2-herstel-o4",
            "text": "“Iedere opname is precies hetzelfde als ieder ander onderwijs.”",
            "feedback": "Deze gelijkstelling verbergt relevante verschillen."
          }
        ],
        "answer": "bh2-herstel-o2"
      },
      {
        "id": "bh2-analogie-kaart",
        "kind": "map",
        "prompt": "Orden de onderdelen van het analogische argument.",
        "explanation": "Een analogie heeft bron, doel, relevante brug en mogelijke disanalogieën nodig.",
        "claim": "Het buurthuis kan verantwoord meetinstrumenten uitlenen.",
        "categories": [
          {
            "id": "bron",
            "label": "Brongeval"
          },
          {
            "id": "doel",
            "label": "Doelgeval"
          },
          {
            "id": "brug",
            "label": "Veronderstelde relevante overeenkomst"
          },
          {
            "id": "verschil",
            "label": "Potentieel relevant verschil"
          }
        ],
        "cards": [
          {
            "id": "bh2-analogie-kaart-c1",
            "text": "Een bibliotheek leent eenvoudige apparatuur aan getrainde studenten uit.",
            "category": "bron"
          },
          {
            "id": "bh2-analogie-kaart-c2",
            "text": "Een buurthuis wil gevoelige meetinstrumenten aan ongetrainde bezoekers uitlenen.",
            "category": "doel"
          },
          {
            "id": "bh2-analogie-kaart-c3",
            "text": "Beide organisaties kunnen een uitleenregistratie en onderhoudscontrole verzorgen.",
            "category": "brug"
          },
          {
            "id": "bh2-analogie-kaart-c4",
            "text": "De nieuwe apparatuur vraagt veiligheidsinstructie die bezoekers nog niet hebben.",
            "category": "verschil"
          }
        ]
      },
      {
        "id": "bh2-dossier",
        "kind": "reflection",
        "prompt": "Reconstrueer de werkelijke positie en geef een analogiekritiek met een mogelijke reparatie.",
        "scenario": "Een opleiding stelt voor om vrijwillige peerfeedback op conceptverslagen te testen. Zij verwijst naar een andere opleiding waar begeleide peerfeedback de kwaliteit verbeterde. Een criticus reageert: “Dus studenten moeten voortaan alle docenten vervangen. Dat werkte bij economie, dus het moet bij chemische laboratoriumverslagen net zo werken.” In de eerdere opleiding kregen studenten beoordelingsvoorbeelden en docentcontrole. In de nieuwe opleiding zijn sommige veiligheidsberekeningen specialistisch en is nog geen begeleiding gepland. Het projectteam wil een eerlijke vergelijking.",
        "explanation": "Scheid de vervormde positie van de echte analogische vraag. De begeleiding en specialistische veiligheid zijn relevante overdrachtsvoorwaarden.",
        "model": "Het voorstel gaat over een vrijwillige test naast docentbeoordeling, niet over het vervangen van docenten. De broncasus ondersteunt een hypothese dat begeleide feedback kan helpen. De analogie is beperkt doordat specialistische veiligheidsberekeningen en ontbrekende training de kwaliteit kunnen veranderen. Een reparatie is een begeleide pilot met een rubric, voorbeelden en docentcontrole op veiligheidskritische onderdelen. Daarmee blijft effectbeoordeling nodig; de overeenkomst bewijst nog geen even grote leerwinst. De specialistische verschillen maken iedere vorm van peerfeedback niet onmogelijk. Studenten kunnen mogelijk wel op structuur, duidelijkheid en brongebruik reageren terwijl een docent veiligheidsberekeningen controleert. De reparatie moet daarom taken afbakenen in plaats van een onterecht totaalverbod of een volledige docentvervanging voor te stellen.",
        "rubric": [
          "Je corrigeert de vervormde claim zonder een nieuw totaalmodel te maken.",
          "Je benoemt een overeenkomst en een inferentieel relevant verschil.",
          "Je stelt een begrensde pilot of toepassingsvoorwaarde voor."
        ],
        "minWords": 80
      }
    ],
    "sourceIds": [
      "tindale",
      "groarke",
      "schemes"
    ]
  },
  {
    "id": "bachelor-dilemma-helling-cirkel",
    "moduleId": "bachelor",
    "title": "Keuzeruimte, hellende vlakken en cirkelredeneringen",
    "minutes": 40,
    "teaser": "Beoordeel uitputtendheid, causale ketens en onafhankelijke rechtvaardiging in moeilijke gevallen.",
    "objectives": [
      "Een vals dilemma onderscheiden van een echte tweedeling.",
      "Een slippery-slopeargument per schakel en remmechanisme toetsen.",
      "Circulariteit herkennen zonder iedere coherente overtuiging verdacht te maken."
    ],
    "sections": [
      {
        "title": "Twee opties en een lange keten vragen bewijs",
        "body": "Een dilemma is problematisch wanneer het relevante mogelijkheden uitsluit zonder grond. De uitputtendheid hangt af van de afbakening: “een aanvraag is vóór de deadline ingediend of niet” is een echte tweedeling; “we voeren dit plan volledig in of doen niets” kan pilots en alternatieven verbergen. Een hellend-vlakargument voorspelt dat een eerste stap uiteindelijk een onwenselijke uitkomst veroorzaakt. Dat is niet vanzelf een drogreden. Beoordeel elke overgang, de voorwaarden waaronder zij geldt en mogelijke remmen. Een institutioneel precedent kan later druk creëren, maar regels, toezicht en expliciete grenzen kunnen de keten veranderen. Wie alleen de eindramp beschrijft zonder de tussenstappen te onderbouwen, maakt de conclusie angstaanjagend maar niet sterker. Een reparatie specificeert mechanismen en kansen en laat zien wanneer een grens voldoende of juist onvoldoende bescherming biedt.",
        "example": "“Eén proefopname leidt onvermijdelijk tot permanente monitoring” vraagt bewijs over besluitprocedures, opslag en toestemming. Een vastgesteld automatisch uitbreidingsmechanisme zou de zorg sterker maken.",
        "takeaway": "Beoordeel uitputtendheid en iedere voorspelde overgang; vermijd zowel automatische afwijzing als automatische onvermijdelijkheid."
      },
      {
        "title": "Wanneer ondersteunt een reden zichzelf?",
        "body": "Een cirkelredenering rechtvaardigt een conclusie via een premisse die die conclusie al veronderstelt, direct of door een keten. “Deze bron is betrouwbaar omdat zij alleen ware dingen zegt; haar uitspraken zijn waar omdat zij betrouwbaar is” geeft zonder onafhankelijke steun geen reden aan iemand die de betrouwbaarheid betwijfelt. Herhaling in andere woorden kan dezelfde fout verbergen. Niet iedere wederzijdse samenhang tussen overtuigingen is daardoor betekenisloos. Bij een zorgvuldige toets kunnen gegevens en modellen elkaar controleren, wanneer onafhankelijke meetprocedures en voorspellingen extra weerstand bieden. Het probleem is afhankelijkheid van precies datgene wat in het gesprek bewezen moet worden. Vraag daarom welke premisse de criticus al op onafhankelijke gronden kan accepteren. Reparatie bestaat vaak uit extern bewijs, een expliciet voorlopig uitgangspunt of het erkennen dat de conclusie nog niet is gerechtvaardigd.",
        "example": "“De methode werkt omdat zij effectief is” hernoemt het standpunt. Een onafhankelijke vergelijking van leerresultaten kan de cirkel doorbreken.",
        "takeaway": "Zoek een steunpunt dat niet al de betwiste conclusie nodig heeft."
      }
    ],
    "deepDive": {
      "title": "Logische mogelijkheid, institutioneel risico en dialectische afhankelijkheid",
      "body": "Bij het hellend vlak worden verschillende soorten claims vaak vermengd. Een causale versie stelt dat handeling A een proces in gang zet dat via B tot C leidt. Een precedentversie stelt dat aanvaarding van A latere weigering van B moeilijker verdedigbaar maakt. Een begripsversie stelt dat geen niet-willekeurige grens tussen A en B kan worden getrokken. Deze varianten vragen verschillende ondersteuning. Een kans op organisatorische uitbreiding is geen logisch bewijs dat elk moreel onderscheid onmogelijk is. Omgekeerd weerlegt een principiële grens niet automatisch een empirisch risico dat bestuurders die grens negeren.\n\nVoor risicobeoordeling moet je ook de conclusie afstemmen op de onderbouwing. Een kleine kans op een ernstige uitkomst kan een voorzorgsmaatregel ondersteunen, maar rechtvaardigt niet de uitspraak dat de uitkomst onvermijdelijk is. Beoordeel controles, kosten en alternatieve routes in plaats van alleen het dramatische eindpunt.\n\nCirculariteit is eveneens mede dialectisch. Een premisse kan inhoudelijk waar zijn en toch ongeschikt als rechtvaardiging voor een gesprekspartner die haar juist vanwege de betwiste conclusie zou accepteren. Het probleem is niet uitsluitend syntactische herhaling. Verberg je een afhankelijkheid in een definitie, meetinstrument of bronkeuze, dan blijft onafhankelijke steun ontbreken. Geef daarom expliciet aan welke aannames voorlopig gedeeld zijn en welke werkelijk bewijs behoeven. Zo voorkom je dat een analyse of debat overtuigend lijkt doordat het zijn resultaat al in de uitgangspunten heeft gestopt."
    },
    "exercises": [
      {
        "id": "bh3-dilemma",
        "kind": "choice",
        "prompt": "Welke tweedeling is binnen haar afbakening echt uitputtend?",
        "scenario": "Beoordeel de logische afbakening, niet of de opties aantrekkelijk zijn.",
        "explanation": "Een expliciete propositie en haar ontkenning sluiten samen alle gevallen in; beleidsalternatieven hoeven dat niet te doen.",
        "options": [
          {
            "id": "bh3-dilemma-o1",
            "text": "We voeren het pakket volledig in of verbeteren nooit iets.",
            "feedback": "Gedeeltelijke invoering en andere verbeteringen kunnen ontbreken."
          },
          {
            "id": "bh3-dilemma-o2",
            "text": "De ontvangen aanvraag is vóór de vastgestelde deadline ingediend of zij is dat niet.",
            "feedback": "Juist: binnen deze precieze afbakening is dit een propositie met haar ontkenning."
          },
          {
            "id": "bh3-dilemma-o3",
            "text": "Iedereen komt met de auto of de bijeenkomst vervalt.",
            "feedback": "Andere vervoersmiddelen zijn mogelijke alternatieven."
          },
          {
            "id": "bh3-dilemma-o4",
            "text": "Een instelling kiest dit softwaremerk of zij kan geen administratie voeren.",
            "feedback": "Andere merken en systemen zijn niet uitgesloten."
          }
        ],
        "answer": "bh3-dilemma-o2"
      },
      {
        "id": "bh3-helling",
        "kind": "choice",
        "prompt": "Welke informatie versterkt een hellend-vlakargument het meest?",
        "scenario": "Een commissie vreest dat een beperkte gegevenspilot automatisch tot opslag van meer categorieën leidt.",
        "explanation": "Een aantoonbaar uitbreidingsmechanisme onderbouwt de overgang; emotionele taal doet dat niet.",
        "options": [
          {
            "id": "bh3-helling-o1",
            "text": "Een afschrikwekkende afbeelding van een verre einduitkomst.",
            "feedback": "Dat vergroot mogelijk angst, maar onderbouwt geen overgang."
          },
          {
            "id": "bh3-helling-o2",
            "text": "De spreker is zeer zeker van de voorspelling.",
            "feedback": "Zekerheid van de spreker vervangt geen mechanisme."
          },
          {
            "id": "bh3-helling-o3",
            "text": "Het systeem breidt zonder nieuw besluit de bewaarcategorieën uit zodra de pilot wordt geactiveerd.",
            "feedback": "Juist: dit is relevant bewijs voor een concrete schakel, al blijven omvang en remmen te beoordelen."
          },
          {
            "id": "bh3-helling-o4",
            "text": "De woorden “data” en “opslag” staan in hetzelfde document.",
            "feedback": "Een tekstuele nabijheid is geen bewijs voor uitbreiding."
          }
        ],
        "answer": "bh3-helling-o3"
      },
      {
        "id": "bh3-cirkel",
        "kind": "choice",
        "prompt": "Welk argument biedt onafhankelijke steun in plaats van een herhaling?",
        "scenario": "De vraag is of een beoordelingsmethode betrouwbare uitkomsten geeft.",
        "explanation": "Een onafhankelijke vergelijking kan de betrouwbaarheid toetsen; de conclusie hernoemen kan dat niet.",
        "options": [
          {
            "id": "bh3-cirkel-o1",
            "text": "De methode is betrouwbaar omdat we haar betrouwbaarheid erkennen.",
            "feedback": "De te rechtvaardigen conclusie wordt als uitgangspunt gebruikt."
          },
          {
            "id": "bh3-cirkel-o2",
            "text": "Zij geeft betrouwbare uitkomsten omdat haar uitkomsten te vertrouwen zijn.",
            "feedback": "Dit is dezelfde claim in andere woorden."
          },
          {
            "id": "bh3-cirkel-o3",
            "text": "Een vooraf vastgelegde blinde vergelijking met een onafhankelijk criterium vindt stabiele overeenstemming.",
            "feedback": "Juist: dit noemt een externe bewijsroute, hoewel het criterium zelf ook beoordeeld moet worden."
          },
          {
            "id": "bh3-cirkel-o4",
            "text": "Het criterium is goed omdat de methode het goed noemt, en de methode is goed volgens dat criterium.",
            "feedback": "Deze wederzijdse afhankelijkheid geeft zonder verdere steun geen onafhankelijke grond."
          }
        ],
        "answer": "bh3-cirkel-o3"
      },
      {
        "id": "bh3-herstel",
        "kind": "sort",
        "prompt": "Koppel de herstelzet aan het probleem.",
        "explanation": "Een passende reparatie richt zich op uitputtendheid, overgang of afhankelijkheid.",
        "categories": [
          {
            "id": "dilemma",
            "label": "Onvolledig keuzemenu"
          },
          {
            "id": "helling",
            "label": "Onvoldoende onderbouwde keten"
          },
          {
            "id": "cirkel",
            "label": "Afhankelijkheid van conclusie"
          }
        ],
        "cards": [
          {
            "id": "bh3-herstel-c1",
            "text": "Neem een gecontroleerde pilot en alternatieve ontwerpen mee in de vergelijking.",
            "category": "dilemma"
          },
          {
            "id": "bh3-herstel-c2",
            "text": "Beoordeel de kans van elke uitbreiding en leg een toetsbare stopregel vast.",
            "category": "helling"
          },
          {
            "id": "bh3-herstel-c3",
            "text": "Gebruik een onafhankelijk beoordelingscriterium dat de conclusie niet al veronderstelt.",
            "category": "cirkel"
          }
        ]
      },
      {
        "id": "bh3-dossier",
        "kind": "reflection",
        "prompt": "Maak drie verschillende diagnoses en bouw één gerepareerde beleidsredenering.",
        "scenario": "Een faculteit overweegt een vrijwillige pilot met leeranalyses. Een tegenstander zegt: “Of we verbieden alles, of elke student wordt permanent gevolgd. Eén dashboard leidt vanzelf tot gezichtsherkenning, dan tot gedragscontrole. Het is onaanvaardbaar omdat het in strijd is met aanvaardbaar onderwijs, en aanvaardbaar onderwijs is precies onderwijs zonder deze pilot.” Het voorstel bevat nog geen duidelijke opslaggrens. Een privacyadviseur ziet echte risico’s maar wil een argument dat de commissie kan toetsen in plaats van alleen slogans.",
        "explanation": "Er is mogelijk een vals dilemma, een onbewezen keten en een circulaire normdefinitie. Een echte lacune in opslaggrenzen blijft relevant.",
        "model": "Het dilemma vergeet beperkte pilots en andere waarborgen. De keten vraagt mechanismen en besluitregels per stap. De definitie van aanvaardbaar onderwijs veronderstelt de afwijzing. Een sterkere redenering benoemt onafhankelijk de privacywaarden, de ontbrekende opslaggrens en het risico op uitbreidbaar gebruik. Zij concludeert dat de pilot pas verantwoord is met doelbinding, beperkte bewaartermijn, vrijwilligheid en onafhankelijke evaluatie, of dat hij moet worden uitgesteld zolang die voorwaarden ontbreken. Een onafhankelijke norm kan bijvoorbeeld noodzakelijkheid, proportionaliteit en dataminimalisatie eisen. De commissie moet daarbij toetsen of dezelfde onderwijszorg met minder gegevens kan worden bereikt. Het sterkste bezwaar gaat dan over een ontbrekende rechtvaardiging en onvoldoende waarborgen, niet over een onbewezen onvermijdelijke eindramp.",
        "rubric": [
          "Je onderscheidt uitputtendheid, overgang en circulariteit.",
          "Je erkent het reële risico dat in het voorstel aanwezig is.",
          "Je geeft onafhankelijke criteria en een proportionele conclusie."
        ],
        "minWords": 80
      }
    ],
    "sourceIds": [
      "tindale",
      "walton",
      "hamblin"
    ]
  },
  {
    "id": "bachelor-causaliteit-statistiek",
    "moduleId": "bachelor",
    "title": "Oorzaak of samenhang: bewijs in een managementvoorstel",
    "minutes": 40,
    "teaser": "Toets welke verbetering werkelijk door een verandering komt en voor wie de cijfers iets zeggen.",
    "objectives": [
      "Een samenhang onderscheiden van een onderbouwde oorzaakclaim.",
      "Selectieve voorbeelden en alternatieve verklaringen zichtbaar maken.",
      "Een voorstel begrenzen op basis van bereik, gevolgen en onzekerheid."
    ],
    "sections": [
      {
        "title": "Welke andere route kan het verschil verklaren?",
        "body": "Een voorstel wordt vaak verdedigd met een gunstige samenhang: teams met een nieuwe werkwijze presteren beter, dus de werkwijze veroorzaakt betere prestaties. Dat kan kloppen, maar er kunnen andere routes bestaan. Misschien kiezen juist ervaren teams de werkwijze, krijgen zij extra begeleiding of behandelen zij eenvoudigere opdrachten. Ook omgekeerde richting is mogelijk: een team dat al goed presteert krijgt eerder toegang tot nieuwe hulpmiddelen. Maak de redenering zichtbaar door te vragen welke factor wat beïnvloedt. Benoem vervolgens welke vergelijking de voorgestelde verklaring sterker of zwakker zou maken. Veel cijfers lossen een ongeschikte vergelijking niet vanzelf op. Geef de positieve aanwijzing een passende plaats: zij kan een aanleiding zijn om de werkwijze verder te toetsen, terwijl de stellige conclusie over oorzaak nog niet gerechtvaardigd is. Dat is een praktisch verschil voor de snelheid en omvang van invoering.",
        "example": "Een nieuw rooster en een rustiger seizoen beginnen tegelijk. Minder fouten bewijzen dan niet zonder meer dat alleen het rooster hielp.",
        "takeaway": "Vraag welke alternatieve verklaring dezelfde cijfers kan opleveren."
      },
      {
        "title": "Voor wie en voor welke uitkomst geldt het voordeel?",
        "body": "Een gemiddelde verbetering geldt niet automatisch voor ieder teamlid of iedere klant. Een kortere gemiddelde wachttijd kan samengaan met langere wachttijden bij ingewikkelde vragen. Kijk daarom hoe de cijfers zijn geselecteerd, welke uitkomst werkelijk wordt gemeten en welke groepen ontbreken. Wie alleen tevreden gebruikers bevraagt, leert weinig over uitvallers of mensen die de werkwijze niet gebruiken. Een groter aantal antwoorden verwijdert die selectiviteit niet. Maak ook onderscheid tussen snelheid, kwaliteit, tevredenheid en werkdruk: winst op één maat bewijst niet dat het totale voorstel verstandig is. Een goed managementargument beschrijft de relevante groep, de vergelijking en de gekozen uitkomst voordat het een aanbeveling geeft. Het noemt bovendien wie voordeel of nadeel kan ondervinden en welke voorwaarden voor invoering nodig zijn. Zo wordt een cijfer een gerichte reden in plaats van een gezagsargument dat alle verdere vragen afsluit.",
        "example": "Een dashboard toont snellere eenvoudige klantgesprekken, terwijl complexe klachten niet worden meegeteld. Dat is geen volledig beeld van klantcontact.",
        "takeaway": "Beoordeel selectie, uitkomst en verdeling voordat je het voordeel veralgemeniseert."
      }
    ],
    "deepDive": {
      "title": "Van een gunstig getal naar een verantwoord besluit",
      "body": "Een leider moet onder tijdsdruk beslissen zonder iedere onzekerheid te kunnen wegnemen. Dat maakt proportionaliteit belangrijk: hoeveel steun vraagt deze beslissing, gegeven haar kosten, gevolgen en herstelbaarheid? Een kleine omkeerbare proef kan verantwoord zijn met minder zekerheid dan een algemene verplichting die grote lasten veroorzaakt. Leg dan wel vast welke uitkomst de proef moet verbeteren en bij welke signalen je stopt of bijstuurt.\n\nDe centrale vraag bij een oorzaakclaim is wat waarschijnlijk anders zou zijn zonder de voorgestelde verandering. Een voor-en-na-vergelijking kan nuttig zijn, maar verandert ook door seizoen, teamervaring, opdrachtmix en andere gelijktijdige keuzes. Een vergelijkbaar team zonder die verandering kan extra informatie geven, mits de relevante verschillen eerlijk worden benoemd. Geen enkele vergelijking is vanzelf perfect. Een zorgvuldig argument maakt haar beperkingen zichtbaar en gebruikt meerdere relevante aanwijzingen zonder dezelfde bron dubbel te tellen.\n\nDaarnaast is een gevolgclaim geen volledige beleidsrechtvaardiging. Ook als een hulpmiddel echt tijd bespaart, blijven kwaliteit, toegankelijkheid en verdeling van werk van belang. Een gemiddelde kan bovendien een kleine groep met grote nadelen verbergen. Formuleer daarom afzonderlijk wat de cijfers laten zien, welke oorzaakverklaring plausibel is en waarom de voorgestelde actie de beste passende keuze zou zijn. Het sterkste tegenargument kan juist één van die verbindingen raken. Geef dat bezwaar een inhoudelijk antwoord of beperk het voorstel. Deze discipline helpt een team besluiten te begrijpen en later te herzien zonder te doen alsof ieder gunstig getal zekerheid of een onbeperkte verplichting oplevert."
    },
    "exercises": [
      {
        "id": "bh4-confound",
        "kind": "choice",
        "prompt": "Welke factor biedt de duidelijkste alternatieve verklaring?",
        "scenario": "Teams kiezen zelf een hulpmiddel. Ervaren teams gebruiken het vaker en lossen ook zonder hulpmiddel meer opdrachten op.",
        "explanation": "Ervaring kan zowel gebruik als prestatie beïnvloeden en daardoor een alternatieve route voor de samenhang vormen.",
        "options": [
          {
            "id": "bh4-confound-o1",
            "text": "Ervaring, die de keuze én prestaties kan beïnvloeden.",
            "feedback": "Juist: deze gemeenschappelijke factor kan het verschil mede verklaren."
          },
          {
            "id": "bh4-confound-o2",
            "text": "Gebruik zelf, omdat iedere verandering haar eigen alternatieve verklaring is.",
            "feedback": "De voorgestelde factor en een gemeenschappelijke oorzaak hebben verschillende rollen."
          },
          {
            "id": "bh4-confound-o3",
            "text": "De uiteindelijke prestatie, omdat een uitkomst altijd voorafgaat aan gebruik.",
            "feedback": "Die tijdsrichting is hier niet gegeven; de uitkomst is niet vanzelf een voorafgaande oorzaak."
          },
          {
            "id": "bh4-confound-o4",
            "text": "Extra snelheid die uitsluitend door het hulpmiddel ontstaat.",
            "feedback": "Dat kan juist onderdeel van het effect zijn, niet een voorafgaande gemeenschappelijke oorzaak."
          }
        ],
        "answer": "bh4-confound-o1"
      },
      {
        "id": "bh4-selectie",
        "kind": "choice",
        "prompt": "Welke conclusie blijft binnen de informatie?",
        "scenario": "Een bedrijf bevraagt alleen klanten die het nieuwe systeem blijven gebruiken. De meeste respondenten zijn tevreden.",
        "explanation": "De conclusie moet de geselecteerde groep behouden; afhakers en niet-gebruikers zijn niet vertegenwoordigd.",
        "options": [
          {
            "id": "bh4-selectie-o1",
            "text": "Alle klanten zijn aantoonbaar tevreden, want er zijn veel reacties.",
            "feedback": "Veel geselecteerde reacties maken ontbrekende groepen niet zichtbaar."
          },
          {
            "id": "bh4-selectie-o2",
            "text": "Deze respondenten zijn meestal tevreden; het oordeel van afhakers en niet-gebruikers blijft open.",
            "feedback": "Juist: deze conclusie behoudt de reikwijdte van de gegevens."
          },
          {
            "id": "bh4-selectie-o3",
            "text": "Het systeem veroorzaakt noodzakelijk minder klachten.",
            "feedback": "Tevredenheid in deze selectie bewijst die oorzaakclaim niet."
          },
          {
            "id": "bh4-selectie-o4",
            "text": "Omdat de selectie beperkt is, bevat geen antwoord enige bruikbare informatie.",
            "feedback": "De reacties geven wel informatie over de bevraagde groep."
          }
        ],
        "answer": "bh4-selectie-o2"
      },
      {
        "id": "bh4-gemiddelde",
        "kind": "choice",
        "prompt": "Welk bezwaar raakt de stap naar algemene invoering?",
        "scenario": "Een nieuwe procedure verlaagt de gemiddelde doorlooptijd. Complexe dossiers kosten juist meer tijd en raken vooral één kleine klantgroep.",
        "explanation": "Een gemiddelde verbetering sluit belangrijke ongelijke gevolgen niet uit.",
        "options": [
          {
            "id": "bh4-gemiddelde-o1",
            "text": "Een gunstig gemiddelde bewijst dat elk dossier sneller is.",
            "feedback": "Een gemiddelde kan verschillen tussen dossiers verbergen."
          },
          {
            "id": "bh4-gemiddelde-o2",
            "text": "De kleine groep telt niet mee omdat zij geen meerderheid vormt.",
            "feedback": "Een kleine groep kan een relevant zwaar nadeel ondervinden."
          },
          {
            "id": "bh4-gemiddelde-o3",
            "text": "Vergelijk winst, kwaliteit en extra last per dossiergroep en pas het voorstel waar nodig aan.",
            "feedback": "Juist: dit adresseert de verdeling zonder het gemiddelde voordeel te ontkennen."
          },
          {
            "id": "bh4-gemiddelde-o4",
            "text": "De procedure werkt nergens omdat sommige dossiers trager zijn.",
            "feedback": "Dat trekt het bezwaar verder dan de gegeven informatie rechtvaardigt."
          }
        ],
        "answer": "bh4-gemiddelde-o3"
      },
      {
        "id": "bh4-causale-kaart",
        "kind": "map",
        "prompt": "Orden de onderdelen van het voorstel.",
        "claim": "Het hulpmiddel verbetert de afhandeling van klantvragen.",
        "explanation": "Een gekozen hulpmiddel, gemeten uitkomst, alternatieve verklaring en selectiestap doen verschillend werk in de redenering.",
        "categories": [
          {
            "id": "oorzaak",
            "label": "Voorgestelde oorzaak"
          },
          {
            "id": "uitkomst",
            "label": "Gemeten uitkomst"
          },
          {
            "id": "alternatief",
            "label": "Alternatieve verklaring"
          },
          {
            "id": "selectie",
            "label": "Selectie van gegevens"
          }
        ],
        "cards": [
          {
            "id": "bh4-map-c1",
            "text": "Het team gebruikt een nieuw hulpsysteem.",
            "category": "oorzaak"
          },
          {
            "id": "bh4-map-c2",
            "text": "De gemiddelde afhandeltijd daalt.",
            "category": "uitkomst"
          },
          {
            "id": "bh4-map-c3",
            "text": "De opdrachten waren deze maand eenvoudiger dan normaal.",
            "category": "alternatief"
          },
          {
            "id": "bh4-map-c4",
            "text": "Alleen afgeronde eenvoudige dossiers komen op het dashboard.",
            "category": "selectie"
          }
        ]
      },
      {
        "id": "bh4-dossier",
        "kind": "reflection",
        "prompt": "Schrijf een beperkt invoeringsadvies met een alternatieve verklaring, een ontbrekende groep en een beslisvoorwaarde.",
        "scenario": "Een manager wil een nieuw chatsysteem invoeren omdat twee vrijwillig deelnemende teams gemiddeld sneller reageren. Die teams hadden meer ervaring, kregen extra ondersteuning en behandelden vooral eenvoudige vragen. Het dashboard bevat geen afgebroken gesprekken en geen vervolgcontact na een verkeerd antwoord. Medewerkers met complexe taken verwachten extra werk. Het bestuur wil binnenkort beslissen en kan een kleine omkeerbare proef uitbreiden, maar moet eerst duidelijk maken welk voordeel en welke nadelen daarbij worden getoetst.",
        "explanation": "Het gunstige patroon blijft een aanwijzing, terwijl selectie, andere verschillen en de beleidsafweging afzonderlijke vragen vormen.",
        "model": "De teams reageren sneller, maar ervaring, extra ondersteuning en eenvoudiger vragen kunnen het verschil mede verklaren. De cijfers zeggen bovendien weinig over afgebroken gesprekken, vervolgcontact en complexe taken. Ik adviseer een begrensde proef waarin we vergelijkbare opdrachten bekijken, kwaliteit en werkbelasting meenemen en alle relevante gesprekken registreren. Vooraf spreken we af welke verbetering en welke grens voor extra werk invoering rechtvaardigen. Het sterkste bezwaar is dat snelheid ten koste kan gaan van juistheid of één groep medewerkers. Daarvoor is een gerichte waarborg nodig. De huidige gegevens dragen dus een voorzichtige vervolgstap, geen bewijs dat algemene verplichting voor iedereen de beste keuze is.",
        "rubric": [
          "Je houdt samenhang en oorzaakclaim uit elkaar.",
          "Je benoemt een alternatieve verklaring en een ontbrekende groep of uitkomst.",
          "Je geeft een proportionele actie met een inhoudelijke beslisvoorwaarde."
        ],
        "minWords": 80
      }
    ],
    "sourceIds": [
      "schemes",
      "groarke",
      "govier",
      "causality"
    ],
    "lab": "causality"
  },
  {
    "id": "bachelor-geldigheid-en-tegenvoorbeelden",
    "moduleId": "bachelor",
    "title": "Geldigheid, kwantoren en echte tegenvoorbeelden",
    "teaser": "Bouw een mogelijke situatie die de gevolgtrekking test zonder de premissen zomaar af te wijzen.",
    "minutes": 42,
    "objectives": [
      "Geldigheid van waarheid en overtuigingskracht onderscheiden.",
      "Alle, sommige, geen en niet-alle precies lezen.",
      "Een tegenmodel construeren met ware premissen en een onware conclusie."
    ],
    "sections": [
      {
        "title": "Wat een tegenvoorbeeld moet behouden",
        "body": "Een deductief argument is geldig als de premissen niet allemaal waar kunnen zijn terwijl de conclusie onwaar is. Een tegenvoorbeeld toont precies zo’n mogelijke situatie. Je hoeft niet te bewijzen dat die situatie werkelijk voorkomt: je test wat de premissen toelaten. Verander daarom de premissen niet tijdens je kritiek. Bij “alle teamleiders hebben toegang; Noor heeft toegang; dus Noor is teamleider” kan Noor een externe auditor met toegang zijn. Beide premissen kunnen dan waar zijn en de conclusie onwaar. Als je alleen een teamleider zonder toegang noemt, betwist je de eerste premisse in plaats van de redenering bij ware premissen te testen. Waarheid van de premissen blijft een aanvullende kwaliteitsvraag. Een geldige vorm met onware premissen is niet deugdelijk; een ongeldige vorm kan toevallig tot een ware conclusie leiden.",
        "example": "Het feit dat Noor echt teamleider blijkt, herstelt de ongeldige omkering niet. Een conclusie kan waar zijn terwijl de gegeven route onvoldoende is.",
        "takeaway": "Een tegenmodel bewaart alle premissen en maakt alleen de conclusie onwaar."
      },
      {
        "title": "Hoeveel gevallen beweert de zin?",
        "body": "Kwantoren geven het bereik van een uitspraak aan. “Alle” omvat ieder geval in de bedoelde groep. “Sommige” betekent logisch minstens één, ook wanneer dagelijkse taal soms “niet alle” suggereert. “Geen” sluit ieder geval uit. “Niet alle” zegt dat minstens één geval niet aan de eigenschap voldoet; het zegt niet dat geen enkel geval haar heeft. Deze verschillen bepalen ook de ontkenning. De ontkenning van “alle aanvragen zijn volledig” is “minstens één aanvraag is niet volledig”. De ontkenning van “sommige aanvragen zijn volledig” is “geen aanvraag is volledig”. Maak daarbij de groep en de eigenschap expliciet. “Alle urgente dossiers” is een andere groep dan “alle dossiers”. Zonder bestaan aan te nemen levert een algemene regel bovendien niet vanzelf een concreet bestaand geval op.",
        "example": "“Niet alle medewerkers gebruiken het hulpmiddel” kan samengaan met veel gebruikers. “Geen medewerker gebruikt het” is veel sterker.",
        "takeaway": "Behoud de groep en het bereik wanneer je samenvat, ontkent of een conclusie trekt."
      }
    ],
    "deepDive": {
      "title": "Een scherpe tegenwerping is vaak kleiner dan een totaalafwijzing",
      "body": "Kwantoren en ontkenningen maken zichtbaar hoe makkelijk een spreker een conclusie versterkt. Een kritische medewerker hoeft niet te bewijzen dat een procedure nergens werkt om de claim “zij werkt voor ieder dossier” te bestrijden. Eén passend geval waarin de procedure niet werkt is genoeg om die universele claim te weerleggen. Dat kan de conclusie beperken in plaats van volledig vernietigen. De aangepaste claim kan vervolgens nog sterke steun verdienen voor een afgebakende groep.\n\nEen tegenmodel tegen geldigheid doet iets anders dan een werkelijk tegengeval tegen een feitelijke generalisatie. Het tegenmodel vraagt wat logisch met de premissen verenigbaar is. Het werkelijk tegengeval toont dat een premisse over de wereld te ruim is. Beide zijn bruikbare kritieken, maar zij beantwoorden verschillende vragen. Geef aan welke je gebruikt en waarom zij de relevante stap raakt.\n\nLet ook op bestaan. “Alle klachten die binnenkomen worden geregistreerd” kan logisch waar zijn als er geen klachten binnenkomen. Je kunt daaruit niet zonder meer concluderen dat minstens één klacht is geregistreerd. Een bestaande klacht als extra premisse verandert wat je mag afleiden. In gesprekken zijn bestaan en de bedoelde groep vaak stilzwijgend duidelijk; bij een zorgvuldige analyse maak je ze expliciet.\n\nVoor leiderschap is deze precisie praktisch. Zij voorkomt dat één fout een hele werkwijze diskwalificeert, dat een gunstig voorbeeld universele zekerheid wordt of dat onduidelijke taal een medewerker onterecht beschuldigt. Formuleer de kleinste kritiek die het bewijs draagt en de sterkste beperkte conclusie die na die kritiek nog overblijft."
    },
    "exercises": [
      {
        "id": "bval1-ontkenning",
        "kind": "choice",
        "prompt": "Wat is de logische ontkenning van de claim?",
        "scenario": "Claim: alle urgente aanvragen zijn volledig.",
        "explanation": "De ontkenning van een universele claim noemt minstens één tegengeval binnen dezelfde groep.",
        "options": [
          {
            "id": "bval1-ontkenning-o1",
            "text": "Geen enkele aanvraag is volledig.",
            "feedback": "Dit is veel sterker en verandert bovendien de groep van urgente naar alle aanvragen."
          },
          {
            "id": "bval1-ontkenning-o2",
            "text": "Minstens één urgente aanvraag is niet volledig.",
            "feedback": "Juist: één onvolledig urgent geval is genoeg om “alle” te ontkennen."
          },
          {
            "id": "bval1-ontkenning-o3",
            "text": "Sommige niet-urgente aanvragen zijn volledig.",
            "feedback": "Dit kan naast de oorspronkelijke claim waar zijn."
          },
          {
            "id": "bval1-ontkenning-o4",
            "text": "Alle urgente aanvragen zijn misschien volledig.",
            "feedback": "Dit verandert de zekerheid, maar is geen logische ontkenning."
          }
        ],
        "answer": "bval1-ontkenning-o2"
      },
      {
        "id": "bval2-tegenmodel",
        "kind": "choice",
        "prompt": "Welke situatie is een passend tegenmodel?",
        "scenario": "Alle coördinatoren hebben een sleutel. Alex heeft een sleutel. Dus Alex is coördinator.",
        "explanation": "Het tegenmodel moet beide premissen waar houden en Alex geen coördinator laten zijn.",
        "options": [
          {
            "id": "bval2-tegenmodel-o1",
            "text": "Alex is coördinator maar heeft geen sleutel.",
            "feedback": "Dit maakt de eerste premisse onwaar en test de gevolgtrekking niet op de vereiste manier."
          },
          {
            "id": "bval2-tegenmodel-o2",
            "text": "Alex is coördinator en heeft een sleutel.",
            "feedback": "Dan is ook de conclusie waar; dit is geen tegenmodel."
          },
          {
            "id": "bval2-tegenmodel-o3",
            "text": "Alex is een onderhoudsmedewerker met een sleutel; alle coördinatoren hebben eveneens een sleutel.",
            "feedback": "Juist: de twee premissen zijn waar en de conclusie over Alex is onwaar."
          },
          {
            "id": "bval2-tegenmodel-o4",
            "text": "Geen coördinator heeft een sleutel.",
            "feedback": "Dit ontkent expliciet de eerste premisse."
          }
        ],
        "answer": "bval2-tegenmodel-o3"
      },
      {
        "id": "bval3-bestaan",
        "kind": "choice",
        "prompt": "Welke extra premisse is nodig voor deze conclusie?",
        "scenario": "Iedere ontvangen klacht krijgt een dossiernummer. Conclusie: minstens één klacht heeft een dossiernummer.",
        "explanation": "De algemene regel zegt niet dat er daadwerkelijk een klacht ontvangen is.",
        "options": [
          {
            "id": "bval3-bestaan-o1",
            "text": "Er is minstens één klacht ontvangen.",
            "feedback": "Juist: samen met de regel levert dit een bestaand genummerd geval."
          },
          {
            "id": "bval3-bestaan-o2",
            "text": "Dossiernummers worden met cijfers geschreven.",
            "feedback": "Dit voegt geen bestaand klachtgeval toe."
          },
          {
            "id": "bval3-bestaan-o3",
            "text": "Er bestaat een procedure voor nummering.",
            "feedback": "Een procedure kan bestaan zonder binnengekomen klachten."
          },
          {
            "id": "bval3-bestaan-o4",
            "text": "Geen klacht wordt ooit ontvangen.",
            "feedback": "Dat verhindert juist de bedoelde bestaansconclusie."
          }
        ],
        "answer": "bval3-bestaan-o1"
      },
      {
        "id": "bval4-bereik",
        "kind": "map",
        "prompt": "Koppel de uitspraak aan haar precieze betekenis.",
        "explanation": "De categorieën houden bestaan, universaliteit en uitsluiting uit elkaar.",
        "claim": "Lees het bereik van een claim.",
        "categories": [
          {
            "id": "alle",
            "label": "Ieder geval in de groep"
          },
          {
            "id": "sommige",
            "label": "Minstens één geval"
          },
          {
            "id": "geen",
            "label": "Geen enkel geval"
          },
          {
            "id": "niet-alle",
            "label": "Minstens één tegengeval"
          }
        ],
        "cards": [
          {
            "id": "bval4-bereik-c1",
            "text": "Alle teamleden hebben toegang.",
            "category": "alle"
          },
          {
            "id": "bval4-bereik-c2",
            "text": "Sommige teamleden hebben toegang.",
            "category": "sommige"
          },
          {
            "id": "bval4-bereik-c3",
            "text": "Geen teamlid heeft toegang.",
            "category": "geen"
          },
          {
            "id": "bval4-bereik-c4",
            "text": "Niet alle teamleden hebben toegang.",
            "category": "niet-alle"
          }
        ]
      },
      {
        "id": "bval5-dossier",
        "kind": "reflection",
        "prompt": "Scheid twee soorten kritiek en formuleer een beperkte conclusie die overeind kan blijven.",
        "scenario": "Een afdelingshoofd zegt: “Alle complexe dossiers gaan naar een specialist. Dit dossier ligt bij een specialist, dus het is complex. En onze nieuwe werkwijze helpt alle medewerkers.” Een collega weet dat ook eenvoudige dossiers soms naar specialisten gaan. Daarnaast noemt zij één medewerker voor wie de nieuwe werkwijze een toegankelijkheidsprobleem geeft. Het hoofd reageert dat daarmee bewezen is dat de werkwijze niemand helpt. Het team zoekt een precieze beoordeling zonder de nuttige delen weg te gooien.",
        "explanation": "De eerste kritiek test een omgekeerde gevolgtrekking; de tweede beperkt een universele feitelijke claim.",
        "model": "Een eenvoudig dossier bij een specialist is een mogelijk tegenmodel: de algemene regel en deze plaatsing kunnen waar zijn zonder dat het dossier complex is. Dat weerlegt de omgekeerde vorm, niet noodzakelijk de werkelijk vastgestelde complexiteit. De medewerker met een toegankelijkheidsprobleem is daarnaast een relevant werkelijk tegengeval tegen “helpt alle medewerkers”. Dat bewijst niet dat niemand geholpen wordt. Een passende conclusie beperkt de werking tot de groepen waarvoor steun bestaat en vereist een oplossing voor toegankelijkheid. Het hoofd moet dus classificatie en bereik apart toetsen. Beide bezwaren kunnen het voorstel preciezer maken zonder ieder voordeel automatisch te ontkennen.",
        "rubric": [
          "Je behoudt de premissen in het tegenmodel.",
          "Je onderscheidt ongeldigheid van een feitelijk tegengeval.",
          "Je begrenst de conclusie zonder van niet-alle naar geen te springen."
        ],
        "minWords": 80
      }
    ],
    "sourceIds": [
      "govier",
      "groarke"
    ]
  },
  {
    "id": "bachelor-checkpoint",
    "moduleId": "bachelor",
    "title": "Checkpoint: een overtuigend voorstel kritisch beoordelen",
    "minutes": 28,
    "checkpoint": true,
    "teaser": "Beoordeel acht nieuwe situaties waarin betrouwbare bronnen, eerlijke reconstructie en causale claims samenkomen.",
    "objectives": [
      "Bronkritiek proportioneel toepassen.",
      "Drogredenen uitleggen met context en herstel.",
      "Causale en generaliseerbare conclusies begrenzen."
    ],
    "sections": [
      {
        "title": "Gecombineerde beoordeling",
        "body": "De vragen combineren meerdere onderdelen. Zoek steeds het precieze standpunt, de bewijsroute en de relevante beperking. Je hoeft een voorstel niet volledig te accepteren of te verwerpen om een specifieke stap goed te beoordelen.",
        "example": "Een belangenconflict kan beoordeling nodig maken zonder een meetresultaat logisch te weerleggen.",
        "takeaway": "Kies de meest precies onderbouwde beoordeling."
      },
      {
        "title": "Van feedback naar herziening",
        "body": "Bekijk na het nakijken welke norm je gebruikte: betrouwbaarheid, relevante overeenkomst, uitputtendheid, onafhankelijke rechtvaardiging of causaliteit. Leg één gemiste vraag in eigen woorden uit voordat je opnieuw probeert.",
        "example": "Wie toewijzing en selectie verwart, moet de twee toevalsprocessen apart tekenen.",
        "takeaway": "Herhalen helpt vooral als je de fout in de denkstap benoemt."
      }
    ],
    "deepDive": {
      "title": "Proportionele kritiek helpt een besluit verder",
      "body": "Een sterke beoordeling trekt niet meer conclusies dan het bezwaar ondersteunt. Een bron kan een belang hebben en toch correcte informatie geven. Een vergelijking kan een nuttige aanwijzing geven en toch te beperkt zijn voor algemene invoering. Een stropop kan worden verworpen zonder dat het oorspronkelijke voorstel bewezen is. Controleer welke reden overblijft en welke aanpassing of aanvullende toets de beslissing concreet beter maakt."
    },
    "exercises": [
      {
        "id": "bhc1-expert",
        "kind": "choice",
        "prompt": "Welk bezwaar raakt het deskundigheidsschema?",
        "scenario": "Een deskundige in bouwmaterialen wordt geciteerd als autoriteit voor effecten van een onderwijsprogramma.",
        "explanation": "Relevant vakgebied moet passen bij de conclusie.",
        "options": [
          {
            "id": "bhc1-expert-o1",
            "text": "Relevante onderwijskundige expertise is niet aangetoond.",
            "feedback": "Juist: bekendheid in een ander domein is geen voldoende expertbrug."
          },
          {
            "id": "bhc1-expert-o2",
            "text": "Deskundigen zijn altijd onbetrouwbaar.",
            "feedback": "Dat is een onhoudbare universele afwijzing."
          },
          {
            "id": "bhc1-expert-o3",
            "text": "Het programma is daardoor bewezen nutteloos.",
            "feedback": "De zwakke gezagsroute bewijst niet de tegengestelde claim."
          }
        ],
        "answer": "bhc1-expert-o1"
      },
      {
        "id": "bhc2-belang",
        "kind": "choice",
        "prompt": "Welke reactie is proportioneel?",
        "scenario": "Een beoordeling is door een producent betaald en publiceert vooraf vastgelegde methoden en ruwe data.",
        "explanation": "Financiering blijft relevant, maar moet via concrete mogelijke beïnvloeding en controle beoordeeld worden.",
        "options": [
          {
            "id": "bhc2-belang-o1",
            "text": "Alle cijfers zijn daardoor noodzakelijk onwaar.",
            "feedback": "Financiering is geen logisch bewijs van vervalsing."
          },
          {
            "id": "bhc2-belang-o2",
            "text": "Beoordeel protocol, selectie, rapportage en onafhankelijke replicatie.",
            "feedback": "Juist: deze controles raken mogelijke invloed van het belang."
          },
          {
            "id": "bhc2-belang-o3",
            "text": "Open data maakt ieder belangenconflict onmogelijk.",
            "feedback": "Openheid vermindert sommige problemen maar verwijdert niet alle mogelijke invloed."
          }
        ],
        "answer": "bhc2-belang-o2"
      },
      {
        "id": "bhc3-stropop",
        "kind": "choice",
        "prompt": "Wat is de inhoudelijke vertekening?",
        "scenario": "Voorstel: tijdelijke vrijwillige feedbacksessies. Reactie: verplichte beoordeling van iedereen door ongetrainde medestudenten voor altijd.",
        "explanation": "Duur, vrijwilligheid en beoordelingsfunctie zijn veranderd.",
        "options": [
          {
            "id": "bhc3-stropop-o1",
            "text": "De reactie verandert relevante voorwaarden en bestrijdt zo een ander voorstel.",
            "feedback": "Juist: dit onderbouwt de stropop met concrete verschillen."
          },
          {
            "id": "bhc3-stropop-o2",
            "text": "De reactie noemt bezwaren, dus zij is automatisch een stropop.",
            "feedback": "Een bezwaar kan de echte positie terecht treffen; de diagnose vraagt een aantoonbare vertekening."
          },
          {
            "id": "bhc3-stropop-o3",
            "text": "Het oorspronkelijke voorstel is bewezen juist doordat de reactie het vervormt.",
            "feedback": "Een falende tegenwerping bewijst het oorspronkelijke voorstel nog niet."
          }
        ],
        "answer": "bhc3-stropop-o1"
      },
      {
        "id": "bhc4-analogie",
        "kind": "choice",
        "prompt": "Welke vraag toetst de inferentiële brug?",
        "scenario": "Een uitleensysteem voor boeken wordt als model voor gevaarlijke laboratoriuminstrumenten voorgesteld.",
        "explanation": "De veiligheid en vereiste training beïnvloeden of dezelfde uitleenregel verantwoord toepasbaar is.",
        "options": [
          {
            "id": "bhc4-analogie-o1",
            "text": "Gebruiken beide organisaties een registratielijst, zodat veiligheid en training verder niet hoeven te worden onderzocht?",
            "feedback": "Registratie kan vergelijkbaar zijn, maar maakt andere relevante voorwaarden niet overbodig."
          },
          {
            "id": "bhc4-analogie-o2",
            "text": "Zijn risico, training en controle voldoende vergelijkbaar voor dezelfde uitleenregel?",
            "feedback": "Juist: de vraag koppelt verschillen aan de conclusie."
          },
          {
            "id": "bhc4-analogie-o3",
            "text": "Zijn beide voorwerpen eigendom van een instelling, zodat dezelfde verantwoordelijkheid automatisch dezelfde regel vereist?",
            "feedback": "Eigendom kan relevant zijn, maar bepaalt zonder vergelijking van risico en controle niet de juiste uitleenregel."
          }
        ],
        "answer": "bhc4-analogie-o2"
      },
      {
        "id": "bhc5-helling",
        "kind": "choice",
        "prompt": "Welke reparatie is geschikt?",
        "scenario": "“Eén dashboard leidt onvermijdelijk tot totale monitoring” wordt zonder tussenstappen beweerd.",
        "explanation": "Onderbouw overgangen en toets remmen om de risico-uitspraak te begrenzen.",
        "options": [
          {
            "id": "bhc5-helling-o1",
            "text": "Voeg een dramatischer eindpunt toe.",
            "feedback": "Dat vergroot de retoriek, niet de ondersteuning."
          },
          {
            "id": "bhc5-helling-o2",
            "text": "Noem iedere waarschuwing een drogreden.",
            "feedback": "Een goed onderbouwde waarschuwing kan legitiem zijn."
          },
          {
            "id": "bhc5-helling-o3",
            "text": "Beoordeel uitbreidingsmechanismen, kansen en besluitgrenzen per stap.",
            "feedback": "Juist: dit herstelt de ontbrekende causale of institutionele onderbouwing."
          }
        ],
        "answer": "bhc5-helling-o3"
      },
      {
        "id": "bhc6-negatie",
        "kind": "choice",
        "prompt": "Welke zin ontkent de claim precies?",
        "scenario": "Claim: sommige medewerkers hebben toegang tot het nieuwe systeem.",
        "explanation": "De ontkenning van minstens één is geen enkel geval.",
        "options": [
          {
            "id": "bhc6-negatie-o1",
            "text": "Niet alle medewerkers hebben toegang.",
            "feedback": "Dit kan samengaan met sommige gebruikers en ontkent de claim dus niet."
          },
          {
            "id": "bhc6-negatie-o2",
            "text": "Geen medewerker heeft toegang.",
            "feedback": "Juist: dit sluit ieder geval uit en ontkent “minstens één”."
          },
          {
            "id": "bhc6-negatie-o3",
            "text": "Alle medewerkers hebben toegang.",
            "feedback": "Dit impliceert bij bestaande medewerkers juist dat minstens één toegang heeft."
          }
        ],
        "answer": "bhc6-negatie-o2"
      },
      {
        "id": "bhc7-reikwijdte",
        "kind": "choice",
        "prompt": "Welke conclusie past bij de vergelijking?",
        "scenario": "Twee ervaren teams testen vrijwillig een procedure. Hun tijdsbesparing wordt gebruikt als bewijs dat alle teams evenveel voordeel zullen hebben.",
        "explanation": "Ervaring, selectie en context beperken automatische overdracht naar alle teams.",
        "options": [
          {
            "id": "bhc7-reikwijdte-o1",
            "text": "Een lokaal voordeel kan relevant zijn; overdracht naar andere teams vraagt een gerichte vergelijking.",
            "feedback": "Juist: de aanwijzing wordt behouden zonder haar universeel te maken."
          },
          {
            "id": "bhc7-reikwijdte-o2",
            "text": "Vrijwillige deelname maakt ieder voordeel noodzakelijk onmogelijk.",
            "feedback": "Zelfselectie beperkt conclusies maar bewijst geen afwezigheid van effect."
          },
          {
            "id": "bhc7-reikwijdte-o3",
            "text": "Ervaring is irrelevant zodra een dashboard een gemiddelde toont.",
            "feedback": "Een gemiddelde verwijdert relevante teamverschillen niet."
          }
        ],
        "answer": "bhc7-reikwijdte-o1"
      },
      {
        "id": "bhc8-tegenmodel",
        "kind": "choice",
        "prompt": "Welk voorbeeld test de geldigheid van deze vorm?",
        "scenario": "Alle bevoegde medewerkers hebben een sleutel. Ira heeft een sleutel. Dus Ira is bevoegd.",
        "explanation": "Een passend tegenmodel houdt de twee premissen waar en maakt de conclusie onwaar.",
        "options": [
          {
            "id": "bhc8-tegenmodel-o1",
            "text": "Ira is bevoegd maar heeft geen sleutel.",
            "feedback": "Dan is de algemene premisse onwaar; het is geen tegenmodel met ware premissen."
          },
          {
            "id": "bhc8-tegenmodel-o2",
            "text": "Ira heeft als onbevoegde een gevonden sleutel; alle bevoegde medewerkers hebben ook een sleutel.",
            "feedback": "Juist: beide premissen kunnen waar zijn terwijl Ira niet bevoegd is."
          },
          {
            "id": "bhc8-tegenmodel-o3",
            "text": "Ira is bevoegd en heeft een sleutel.",
            "feedback": "Dan is de conclusie waar en wordt de ongeldigheid niet zichtbaar."
          }
        ],
        "answer": "bhc8-tegenmodel-o2"
      }
    ],
    "sourceIds": [
      "tindale",
      "walton",
      "schemes",
      "groarke"
    ]
  },
  {
    "id": "master-toulmin-bewijslast",
    "moduleId": "master",
    "title": "Toulmin, bewijslast en het type dialoog",
    "minutes": 40,
    "teaser": "Maak de rechtvaardigingsbrug expliciet en beoordeel wie welke claim in dit gesprek moet verdedigen.",
    "objectives": [
      "Data, claim, warrant, backing, qualifier en rebuttal onderscheiden.",
      "Een empirische conclusie scheiden van een normatieve rechtvaardiging.",
      "Bewijslast beoordelen zonder kritiek met een tegengestelde claim te verwarren."
    ],
    "sections": [
      {
        "title": "Toulmin maakt verschillende functies zichtbaar",
        "body": "In een Toulminanalyse is de claim de te verdedigen conclusie en zijn de data de aangevoerde gronden. De warrant is de regel of brug die toestaat van die data naar de claim te gaan. Backing ondersteunt die warrant, bijvoorbeeld met een theoretische onderbouwing, procedure of relevante institutionele norm. Een qualifier begrenst de kracht van de claim: vermoedelijk, doorgaans of onder deze voorwaarden. Rebuttal benoemt omstandigheden waaronder de gevolgtrekking niet opgaat; het is niet simpelweg iedere belediging of elk los tegenargument. Rollen zijn afhankelijk van de gekozen claim. Een meetresultaat kan data voor een beleidsadvies zijn, terwijl dezelfde uitkomst in een andere analyse zelf verdedigd moet worden. Het model dwingt je dus om inferentiële functies te verduidelijken. Het bewijst niet automatisch dat de warrant aanvaardbaar is of dat de data voldoende zijn.",
        "example": "Data: een sensor faalt in de test. Claim: herhaal de meting. Warrant: metingen met een onbetrouwbare sensor zijn hier onvoldoende. Rebuttal: tenzij een onafhankelijke kalibratie de relevante meetreeks alsnog valideert.",
        "takeaway": "Een warrant verbindt data en claim; backing ondersteunt die verbinding; uitzonderingen begrenzen haar toepassing."
      },
      {
        "title": "Het gespreksdoel bepaalt welke verplichtingen spelen",
        "body": "Een overtuigingsdialoog probeert een meningsverschil te behandelen; een beoordelingsgesprek zoekt gezamenlijk welke hypothese het bewijs draagt; onderhandelen vergelijkt belangen en mogelijke afspraken. Dezelfde zin kan binnen elk type een andere rol hebben. In een kritisch meningsverschil draagt degene die een standpunt verdedigt in beginsel de last om dat standpunt te ondersteunen wanneer het betwijfeld wordt. Wie alleen een bezwaar tegen de steun noemt, heeft daarmee niet noodzakelijk de tegenovergestelde claim ingenomen. Zodra de criticus wél een zelfstandige tegenclaim doet, vraagt die eigen rechtvaardiging. Verduidelijk uitgangspunten en criteria voordat je eisen stapelt. “Bewijs eerst dat er absoluut geen risico bestaat” kan een onhaalbare eis zijn; “toon een voldoende veilige marge volgens ons overeengekomen criterium” is gerichter. Afwezigheid van bewijs bewijst niet automatisch onwaarheid, maar kan wel een reden zijn om aanvaarding uit te stellen.",
        "example": "“Deze pilot bewijst de leerwinst niet” verschilt van “de app vermindert leerwinst”. Voor de tweede uitspraak zijn eigen redenen nodig.",
        "takeaway": "Bepaal welke claim werkelijk wordt verdedigd en welke ondersteuning het dialoogdoel daarvoor vraagt."
      }
    ],
    "deepDive": {
      "title": "Warrants zijn vakgebonden, maar niet oncontroleerbaar",
      "body": "Het Toulminmodel vestigt aandacht op de brug die in een beknopt argument vaak onzichtbaar blijft. In verschillende vakgebieden worden warrants op verschillende manieren gerechtvaardigd. Een technische classificatieregel, een klinische interpretatie, een juridisch precedent en een normatieve afweging leveren niet hetzelfde soort backing. Dat betekent niet dat ieder vakgebied naar willekeur kan redeneren. Je kunt telkens vragen of de regel expliciet is, of de backing onafhankelijk verdedigbaar is en of de toepassing op dit geval klopt.\n\nBij een beleidsadvies zijn vaak meerdere stappen nodig. Een waarneming ondersteunt een effectverwachting; die effectverwachting vormt samen met waarden en kosten een reden voor beleid. Eén groot schema kan die verschillen verbergen. Een gelaagde analyse maakt eerst de empirische warrant zichtbaar en daarna de normatieve warrant. Een tegenwerping over meetvaliditeit raakt de eerste route; een bezwaar over ongelijke lasten kan de tweede raken zonder de gemeten verbetering te ontkennen.\n\nDe bewijslast vraagt vervolgens aandacht voor het gesprek. Iemand kan haar standpunt voorlopig terugnemen, beperken of onder voorwaarden verdedigen. Dat is geen nederlaag die automatisch het tegendeel bewijst, maar kan een rationele reactie op ontoereikende steun zijn. Ook een criticus kan verduidelijking vragen zonder onbeperkt nieuwe obstakels op te werpen. Zorgvuldige dialoog vraagt expliciete criteria voor wanneer een claim voldoende ondersteund is en ruimte om die criteria gezamenlijk te betwisten. Het model helpt de verplichtingen lokaliseren; het vervangt de discussie over hun redelijkheid niet."
    },
    "exercises": [
      {
        "id": "ma1-warrant",
        "kind": "choice",
        "prompt": "Welke uitspraak functioneert als warrant voor het advies?",
        "scenario": "Data: studenten missen door roosterconflicten dezelfde instructie. Claim: bied een alternatieve instructieroute. De opleiding hanteert een toegankelijkheidsbeleid.",
        "explanation": "De warrant verbindt het concrete tekort met het advies; het beleidsdocument kan die norm ondersteunen als backing.",
        "options": [
          {
            "id": "ma1-warrant-o1",
            "text": "Studenten missen dezelfde instructie.",
            "feedback": "Dit is de gegeven data-uitspraak, nog niet de normatieve verbinding."
          },
          {
            "id": "ma1-warrant-o2",
            "text": "Essentiële instructie moet onder redelijke voorwaarden toegankelijk blijven bij vermijdbare roosterconflicten.",
            "feedback": "Juist: deze norm legt de brug van tekort naar alternatief."
          },
          {
            "id": "ma1-warrant-o3",
            "text": "Het toegankelijkheidsbeleid is vorig jaar vastgesteld.",
            "feedback": "Dit kan de institutionele backing beschrijven, maar is zelf geen volledige brug."
          },
          {
            "id": "ma1-warrant-o4",
            "text": "De alternatieve route moet worden aangeboden.",
            "feedback": "Dit herhaalt de claim."
          }
        ],
        "answer": "ma1-warrant-o2"
      },
      {
        "id": "ma1-rebuttal",
        "kind": "choice",
        "prompt": "Welke toevoeging is een relevante uitzondering op de inferentie?",
        "scenario": "“Deze meting wijkt sterk af van de controletest, dus zij moet vermoedelijk worden herhaald.”",
        "explanation": "Een afwijking kan een andere verklaarde betekenis hebben die herhaling onnodig maakt; dat is een toepassingsuitzondering.",
        "options": [
          {
            "id": "ma1-rebuttal-o1",
            "text": "De afwijking is groter dan in de tabel staat.",
            "feedback": "Dit kan de data veranderen of versterken, maar vormt geen uitzondering op de warrant."
          },
          {
            "id": "ma1-rebuttal-o2",
            "text": "De analist heeft een andere opleiding gevolgd.",
            "feedback": "Zonder verdere verbinding verklaart dit geen uitzondering."
          },
          {
            "id": "ma1-rebuttal-o3",
            "text": "Tenzij een vooraf vastgelegde omrekening het verschil volledig verklaart en de meting valide blijft.",
            "feedback": "Juist: onder deze voorwaarde draagt de afwijking het herhalingsadvies niet meer."
          },
          {
            "id": "ma1-rebuttal-o4",
            "text": "Herhalen is waarschijnlijk nodig.",
            "feedback": "Dit is een qualifier van de claim, geen uitzonderingsvoorwaarde."
          }
        ],
        "answer": "ma1-rebuttal-o3"
      },
      {
        "id": "ma1-last",
        "kind": "choice",
        "prompt": "Welke reactie behandelt de bewijslast correct?",
        "scenario": "A: “Deze app verhoogt leerwinst.” B: “De zelfselectie in je studie maakt dat nog onzeker.” A: “Bewijs dan maar dat de app leerwinst verlaagt.”",
        "explanation": "B heeft een bezwaar tegen A’s steun geformuleerd, geen eigen claim over een negatief effect.",
        "options": [
          {
            "id": "ma1-last-o1",
            "text": "B moet een negatief effect bewijzen omdat iedere kritiek een tegenclaim is.",
            "feedback": "Twijfel of gerichte kritiek is niet automatisch verdediging van de ontkenning."
          },
          {
            "id": "ma1-last-o2",
            "text": "A kan de positieve claim beperken of beter ondersteunen; B hoeft zonder tegenclaim geen negatief effect te bewijzen.",
            "feedback": "Juist: de verplichting blijft gekoppeld aan het werkelijk ingenomen standpunt."
          },
          {
            "id": "ma1-last-o3",
            "text": "A’s claim is nu noodzakelijk onwaar.",
            "feedback": "Een tekort aan causale steun bewijst geen negatief effect."
          },
          {
            "id": "ma1-last-o4",
            "text": "B mag pas over selectie spreken na een volledig nieuwe vergelijking.",
            "feedback": "Een gerichte methodologische kritiek vereist niet automatisch een eigen effectstudie."
          }
        ],
        "answer": "ma1-last-o2"
      },
      {
        "id": "ma1-toulmin-map",
        "kind": "map",
        "prompt": "Plaats de onderdelen van het beleidsschema.",
        "explanation": "De rollen betreffen hier het advies om een alternatief te bieden, niet een schema over het ontstaan van afwezigheid.",
        "claim": "Bied onder passende voorwaarden een alternatieve instructieroute.",
        "categories": [
          {
            "id": "data",
            "label": "Data"
          },
          {
            "id": "claim",
            "label": "Claim"
          },
          {
            "id": "warrant",
            "label": "Warrant"
          },
          {
            "id": "backing",
            "label": "Backing"
          },
          {
            "id": "qualifier",
            "label": "Qualifier"
          },
          {
            "id": "rebuttal",
            "label": "Rebuttal / uitzondering"
          }
        ],
        "cards": [
          {
            "id": "ma1-toulmin-map-c1",
            "text": "Een groep studenten mist essentiële instructie door vermijdbare overlap.",
            "category": "data"
          },
          {
            "id": "ma1-toulmin-map-c2",
            "text": "Bied een alternatieve instructieroute.",
            "category": "claim"
          },
          {
            "id": "ma1-toulmin-map-c3",
            "text": "Essentiële instructie moet redelijk toegankelijk blijven.",
            "category": "warrant"
          },
          {
            "id": "ma1-toulmin-map-c4",
            "text": "Een vastgesteld en beargumenteerd toegankelijkheidsbeleid ondersteunt deze norm.",
            "category": "backing"
          },
          {
            "id": "ma1-toulmin-map-c5",
            "text": "Voor zover de uitvoering haalbaar is.",
            "category": "qualifier"
          },
          {
            "id": "ma1-toulmin-map-c6",
            "text": "Tenzij een bestaande gelijkwaardige route het probleem al oplost.",
            "category": "rebuttal"
          }
        ]
      },
      {
        "id": "ma1-dossier",
        "kind": "reflection",
        "prompt": "Maak een gelaagde Toulminanalyse en formuleer het sterkste bezwaar tegen één warrant.",
        "scenario": "Een faculteit concludeert uit een vrijwillige pilot dat verplichte digitale aanwezigheidssignalering de studievoortgang zal verbeteren. De deelnemers volgden tegelijk extra begeleiding en hadden minder roosterconflicten. De faculteit beroept zich op haar zorgplicht en verwacht minder uitval. Studenten vragen of aanwezigheid een valide maat voor leren is en of registratie onevenredige privacykosten heeft. De commissie heeft nog geen criterium voor een aanvaardbare verhouding tussen leerwinst en privacy vastgesteld. Zij wil een voorlopige, onderbouwde conclusie en duidelijke vervolgstappen.",
        "explanation": "Scheid de empirische warrant over effect van de normatieve warrant over verplichting; beide hebben eigen bezwaren en backing nodig.",
        "model": "De pilotdata ondersteunen hooguit een beperkte aanwijzing. De empirische warrant dat signalering de verbetering veroorzaakt is kwetsbaar door begeleiding en selectie. De beleidswarrant dat verwachte winst verplichting rechtvaardigt vraagt een afweging van privacy, alternatieven en validiteit van aanwezigheid. Het sterkste bezwaar is dat het gemeten voordeel niet aan signalering is toegeschreven en dus de beleidsafweging nog geen stevige effectbasis heeft. Beperk de conclusie tot nadere beoordeling en een gezamenlijk besluitcriterium. De zorgplicht kan een serieuze beleidswaarde zijn zonder ieder technisch middel te verplichten. Ook een aantoonbare gemiddelde leerwinst moet worden vergeleken met minder ingrijpende alternatieven en ongelijke lasten. Een criticus die deze afweging vraagt hoeft niet te bewijzen dat signalering altijd schadelijk is.",
        "rubric": [
          "Je onderscheidt data, claim en beide warrants.",
          "Je geeft backing en een gerichte uitzondering of beperking.",
          "Je formuleert een sterk inhoudelijk bezwaar zonder automatisch de tegengestelde claim te bewijzen."
        ],
        "minWords": 90
      }
    ],
    "sourceIds": [
      "toulmin",
      "pragma",
      "walton"
    ]
  },
  {
    "id": "master-weerlegbare-argumenten",
    "moduleId": "master",
    "title": "Weerlegbare argumenten: premisseaanval, rebuttal en undercutting",
    "minutes": 38,
    "teaser": "Nieuwe informatie kan een conclusie bestrijden of juist de route naar die conclusie blokkeren.",
    "objectives": [
      "Aanvallen op premisse, conclusie en inferentiële verbinding onderscheiden.",
      "Een herzienbare conclusie aanpassen zonder het bewijs te negeren.",
      "Een uitzondering toetsen op relevantie en tegenbewijs."
    ],
    "sections": [
      {
        "title": "Drie plaatsen waar een argument kwetsbaar is",
        "body": "Een premisseaanval betwist een aangevoerd feit of uitgangspunt. Een rebutting tegenargument ondersteunt een onverenigbare conclusie. Een undercutting tegenargument ondermijnt de verbinding van de reden naar de conclusie, zonder noodzakelijk het tegendeel te ondersteunen. “De sensorwaarde is 80” kan worden bestreden doordat het logboek 60 aangeeft: premisseaanval. “Een onafhankelijke meting toont een lage temperatuur” kan de hoge temperatuurconclusie bestrijden. “Deze sensor is in de huidige vochtigheid niet betrouwbaar” raakt de inferentie van aflezing naar temperatuur. Terminologie verschilt soms per formeel systeem; maak daarom altijd expliciet wat het specifieke bezwaar aanvalt. Die plaats bepaalt de reparatie: een feit opnieuw meten, conflicterend bewijs vergelijken of de toepassingsvoorwaarden van de meetregel toetsen. Een bezwaar tegen één route hoeft andere zelfstandige steunroutes niet te raken.",
        "example": "Bij een deskundigheidsargument kan nieuwe domeininformatie undercutting zijn: zij laat zien dat deze bron het specifieke vraagstuk niet deskundig beoordeelt, zonder de inhoudelijke claim te ontkennen.",
        "takeaway": "Vraag of het bezwaar het uitgangspunt, de conclusie of de rechtvaardigingsbrug raakt."
      },
      {
        "title": "Meer informatie kan minder rechtvaardiging opleveren",
        "body": "Deductieve geldigheid is monotoon: een conclusie die uit premissen volgt blijft volgen wanneer je premissen toevoegt. Veel praktische gevolgtrekkingen zijn niet-monotoon. “De cursus staat in het rooster, dus zij gaat normaal door” kan worden ingetrokken wanneer een geldige annulering bekend wordt. De eerdere redenering hoeft daarom niet destijds onredelijk te zijn geweest. Haar rechtvaardiging was voorwaardelijk aan de beschikbare informatie en normale omstandigheden. Beoordeel of een nieuwe uitzondering werkelijk van toepassing is en hoe sterk haar bron is. Een onbevestigd gerucht hoort niet automatisch even zwaar te wegen als een officieel besluit. Noteer ook de reikwijdte van de herziening: een defecte sensor op één dag maakt niet noodzakelijk een jaar metingen waardeloos. Redelijk herzien betekent bewijs behouden waar het nog past en conclusies beperken waar de voorwaarden veranderen.",
        "example": "Een rooster ondersteunt doorgang; een actuele officiële annulering verslaat die route. Een oud gerucht zonder datum doet dat niet zonder verdere controle.",
        "takeaway": "Niet-monotone redenering is gecontroleerde herziening op basis van relevante informatie."
      }
    ],
    "deepDive": {
      "title": "Defeaters veranderen rechtvaardiging, niet automatisch waarheid",
      "body": "Een defeater is informatie die de rechtvaardiging van een gevolgtrekking kan aantasten. Het begrip zegt nog niet of de conclusie feitelijk onwaar is. Een undercutter kan de enige beschikbare route blokkeren en de analist laten eindigen met “onvoldoende grond om te beslissen”. Dat is een andere uitkomst dan het aanvaarden van de ontkenning. Een rebutter biedt wél steun voor een onverenigbare conclusie, maar kan zelf door nieuwe informatie worden verzwakt.\n\nDaarom hebben praktische argumenten een dynamisch karakter. Je beoordeelt niet alleen losse redenen, maar een netwerk van redenen en bezwaren. Een bezwaar kan worden aangevallen; daardoor kan een eerder ondermijnde route opnieuw aanvaardbaar worden. Dat herstel is geen algemene garantie dat de oorspronkelijke conclusie waar is. Het hangt af van de kwaliteit en samenhang van de betrokken routes en van de gekozen normen voor acceptatie.\n\nEen valkuil is uitzonderingen onbeperkt te gebruiken om een claim tegen elk denkbaar bezwaar te beschermen. Wanneer bij ieder ongunstig resultaat achteraf een nieuwe niet toetsbare uitzondering verschijnt, raakt de conclusie los van bewijs. Een goede uitzondering heeft een identificeerbare toepassingsvoorwaarde, een onafhankelijke grond en een voorspelbare invloed op het oordeel. Bij een zorgvuldige toets betekent dat vaak dat je belangrijke voorwaarden vooraf beschrijft en onverwachte gevallen transparant rapporteert. In dialoog betekent het dat je uitleg geeft waarom juist dit bezwaar de inferentie raakt. Het doel is herzienbaarheid met discipline, geen willekeurige wisseling van standpunt."
    },
    "exercises": [
      {
        "id": "ma2-undercut",
        "kind": "choice",
        "prompt": "Welk bezwaar is hier undercutting?",
        "scenario": "Reden: deze meter geeft “hoog” aan. Conclusie: de werkelijke concentratie is waarschijnlijk hoog.",
        "explanation": "Een toepasselijk betrouwbaarheidsprobleem blokkeert de stap van aflezing naar concentratie zonder een lage concentratie te bewijzen.",
        "options": [
          {
            "id": "ma2-undercut-o1",
            "text": "Het logbestand laat zien dat de meter “laag” aangaf.",
            "feedback": "Dit betwist de aangevoerde premisse over de aflezing."
          },
          {
            "id": "ma2-undercut-o2",
            "text": "Een onafhankelijke geldige analyse toont een lage concentratie.",
            "feedback": "Dit ondersteunt een tegengestelde conclusie en is rebutting."
          },
          {
            "id": "ma2-undercut-o3",
            "text": "Bij de huidige luchtvochtigheid geeft dit type meter onvoorspelbare uitslagen.",
            "feedback": "Juist: dit raakt de betrouwbaarheid van de inferentiële verbinding."
          },
          {
            "id": "ma2-undercut-o4",
            "text": "De hoge concentratie is vervelend.",
            "feedback": "Dit beoordeelt gevolgen en tast de meetinferentie niet aan."
          }
        ],
        "answer": "ma2-undercut-o3"
      },
      {
        "id": "ma2-herzien",
        "kind": "choice",
        "prompt": "Welke herziening is proportioneel?",
        "scenario": "Eén sensor is uitsluitend op maandag verkeerd gekalibreerd. Voor andere dagen bestaat onafhankelijke controle.",
        "explanation": "Het gebrek raakt de toepassingsperiode en de betrokken route, niet automatisch alle onafhankelijke data.",
        "options": [
          {
            "id": "ma2-herzien-o1",
            "text": "Alle metingen van alle dagen worden noodzakelijk onwaar.",
            "feedback": "Dat overschrijdt de reikwijdte van het aangetoonde defect."
          },
          {
            "id": "ma2-herzien-o2",
            "text": "Alleen de maandagroute wordt ondermijnd; andere dagen en onafhankelijke routes moeten apart worden beoordeeld.",
            "feedback": "Juist: de herziening volgt de relevante afhankelijkheid."
          },
          {
            "id": "ma2-herzien-o3",
            "text": "De kalibratiefout is irrelevant omdat cijfers objectief lijken.",
            "feedback": "De procedure beïnvloedt juist de betekenis van de cijfers."
          },
          {
            "id": "ma2-herzien-o4",
            "text": "De tegenovergestelde maandagconclusie is zonder nieuwe data bewezen.",
            "feedback": "Een onbetrouwbare route levert niet automatisch het tegendeel."
          }
        ],
        "answer": "ma2-herzien-o2"
      },
      {
        "id": "ma2-monotoon",
        "kind": "choice",
        "prompt": "Welke verandering illustreert niet-monotoneel redeneren?",
        "scenario": "Een analist gebruikt normaal geldende planningsinformatie.",
        "explanation": "Nieuwe relevante informatie kan een voorlopige praktische conclusie intrekken, anders dan het toevoegen van premissen aan een geldige deductie.",
        "options": [
          {
            "id": "ma2-monotoon-o1",
            "text": "Een geldig deductief gevolg blijft geldig na toevoeging van informatie.",
            "feedback": "Dit beschrijft juist monotoniciteit van deductieve gevolgtrekking."
          },
          {
            "id": "ma2-monotoon-o2",
            "text": "Een ingeplande cursus wordt voorlopig verwacht; een actuele annulering doet die verwachting vervallen.",
            "feedback": "Juist: extra informatie verandert de gerechtvaardigde voorlopige conclusie."
          },
          {
            "id": "ma2-monotoon-o3",
            "text": "Een definitie wordt tweemaal opgeschreven.",
            "feedback": "Herhaling is geen voorbeeld van intrekken op basis van een defeater."
          },
          {
            "id": "ma2-monotoon-o4",
            "text": "Een onware premisse wordt stilzwijgend verwijderd zonder toelichting.",
            "feedback": "Dat is een wijziging van het argument, maar niet dit voorbeeld van nieuwe ondermijnende informatie."
          }
        ],
        "answer": "ma2-monotoon-o2"
      },
      {
        "id": "ma2-aanvallen",
        "kind": "map",
        "prompt": "Plaats elk bezwaar bij wat het aanvalt.",
        "explanation": "Dezelfde woorden kunnen in een andere context anders werken; hier is de redenering expliciet afgebakend.",
        "claim": "Deze aflezing ondersteunt een hoge temperatuur.",
        "categories": [
          {
            "id": "premisse",
            "label": "Premisseaanval"
          },
          {
            "id": "rebuttal",
            "label": "Tegenconclusie"
          },
          {
            "id": "undercut",
            "label": "Inferentiële verbinding"
          }
        ],
        "cards": [
          {
            "id": "ma2-aanvallen-c1",
            "text": "“In het oorspronkelijke log staat niet 80 maar 60.”",
            "category": "premisse"
          },
          {
            "id": "ma2-aanvallen-c2",
            "text": "“Een onafhankelijke betrouwbare meting toont dat de temperatuur laag is.”",
            "category": "rebuttal"
          },
          {
            "id": "ma2-aanvallen-c3",
            "text": "“De aflezing voorspelt temperatuur niet betrouwbaar onder deze storingsconditie.”",
            "category": "undercut"
          }
        ]
      },
      {
        "id": "ma2-dossier",
        "kind": "reflection",
        "prompt": "Teken in woorden de steunroutes en drie soorten bezwaren; geef een herzien oordeel.",
        "scenario": "Een opleiding denkt dat een nieuwe begeleiding uitval verlaagt. Een pilotrapport meldt 15% uitval tegenover 25% vorig jaar. Een controle vindt dat de tabel 18% had moeten tonen. Een tweede studie met vergelijkbare groepen vindt juist geen verschil. Een methodoloog stelt dat de eerste pilot andere toelatingseisen en een andere definitie van uitval gebruikte. De projectleider wijst erop dat deelnemers de begeleiding wel waarderen. De commissie moet de claim over lagere uitval en de afzonderlijke claim over waardering beoordelen.",
        "explanation": "De tabelcorrectie, tegenstudie en vergelijkbaarheidskritiek hebben verschillende aanvalspunten; waardering is een aparte uitkomst.",
        "model": "De tabelcorrectie betwist een data-premisse. De tweede studie biedt tegenbewijs over het effect, afhankelijk van haar kwaliteit. Andere toelatingseisen en uitvaldefinities ondermijnen de brug van historische vergelijking naar causaliteit. Waardering kan zelfstandig positief zijn zonder lagere uitval te bewijzen. Het herzien oordeel is dat de effectclaim nog onvoldoende gedragen wordt; een beter vergelijkend ontwerp is nodig. De waarderingsclaim kan binnen haar eigen meetbereik blijven staan. Het uitblijven van een verschil in de tweede studie is vooral sterk tegen een groot effect wanneer de studie voldoende precies is. Een brede onzekerheidsmarge kan kleine effecten openlaten. Geef daarom de effectschatting en onzekerheid weer, in plaats van elke niet-significante vergelijking als bewijs van geen werking te lezen.",
        "rubric": [
          "Je lokaliseert de drie bezwaren op verschillende onderdelen.",
          "Je onderscheidt waardering van uitval.",
          "Je beperkt het oordeel en noemt een gerichte reparatie."
        ],
        "minWords": 90
      }
    ],
    "sourceIds": [
      "walton",
      "schemes",
      "handbook"
    ]
  },
  {
    "id": "master-belangen-en-besluiten",
    "moduleId": "master",
    "title": "Belangen, waarden en een verdedigbaar besluit",
    "teaser": "Maak een sterk voorstel, behandel de beste tegenwerping en leg uit waarom een besluit redelijk is.",
    "minutes": 40,
    "objectives": [
      "Feitelijke meningsverschillen van waardeconflicten onderscheiden.",
      "De sterkste tekstgetrouwe tegenwerping serieus verwerken.",
      "Een besluit rechtvaardigen met expliciete criteria, voorwaarden en een herzieningsmoment."
    ],
    "sections": [
      {
        "title": "Waarover verschillen mensen werkelijk van mening?",
        "body": "Een leidinggevende moet eerst bepalen welk verschil het gesprek blokkeert. Soms zijn mensen het oneens over feiten: hoeveel kost een verandering, hoeveel tijd bespaart zij en voor wie? Soms delen zij de feiten maar wegen zij waarden anders: voorspelbaarheid, autonomie, kwaliteit, eerlijkheid of snelheid. Een derde verschil gaat over toepassing: iedereen vindt eerlijkheid belangrijk, maar wie behoort in dit geval tot de relevante vergelijkingsgroep? Stel gerichte vragen voordat je iemand onredelijkheid verwijt. Vat diens positie samen inclusief voorwaarden en controleer of zij herkenbaar is. Benoem daarna het criterium dat de conclusie moet dragen. Dat maakt zichtbaar wanneer extra informatie helpt en wanneer een echte afweging nodig is. Een meerderheidsvoorkeur kan een besluitprocedure ondersteunen, maar bewijst niet dat iedere zorg van de minderheid inhoudelijk verkeerd is.",
        "example": "Een team deelt dat thuiswerken reistijd bespaart. Het debat kan toch gaan over bereikbaarheid, verdeling van diensten of begeleiding van nieuwe collega’s.",
        "takeaway": "Lokaliseer het verschil in feit, waarde of toepassing voordat je een oplossing verdedigt."
      },
      {
        "title": "Overtuigend besluiten met ruimte voor de beste tegenwerping",
        "body": "Een sterk voorstel noemt het doel, de relevante redenen en de voorwaarden waaronder het verantwoord is. Formuleer vervolgens de beste tegenwerping tegen datzelfde voorstel. Zo voorkom je dat je een makkelijke karikatuur weerlegt terwijl de echte zorg blijft liggen. Reageer op die zorg met een aanpassing, extra waarborg, relevante informatie of een duidelijke uitleg van de afweging. Niet elk belang kan volledig worden bediend; een eerlijk besluit benoemt ook wie nadeel ondervindt en waarom dat nadeel hier aanvaardbaar wordt gevonden. Geef criteria waarmee later kan blijken dat het besluit moet veranderen. Dat vergroot controleerbaarheid en maakt tegenspraak bruikbaar. Retorische helderheid helpt: gebruik concrete voorbeelden, passende taal en een herkenbare kernzin. Een aantrekkelijk verhaal mag de ontbrekende argumentatieve brug niet vervangen. Mensen begrijpen een besluit beter wanneer reden, tegenwerping en voorwaarde samen zichtbaar zijn.",
        "example": "“We proberen het nieuwe rooster zes weken, beschermen de vaste zorgtaken en bekijken de verdeling opnieuw als de belasting ongelijk blijkt.”",
        "takeaway": "Verwerk de sterkste zorg in het voorstel en maak expliciet wanneer herziening nodig is."
      }
    ],
    "deepDive": {
      "title": "Overtuiging, gezag en de autonomie van het team",
      "body": "Leiderschap vraagt meer dan een debat winnen. Een besluit heeft gevolgen voor mensen die niet allemaal dezelfde belangen of dezelfde macht hebben. Een goede rechtvaardiging maakt daarom onderscheid tussen bevoegdheid en argumentatieve kwaliteit. Dat een leidinggevende mag besluiten, betekent niet dat haar redenen automatisch voldoende zijn. Omgekeerd betekent blijvende tegenspraak niet dat elk besluit moet worden uitgesteld totdat iedereen overtuigd is. Leg de gebruikte criteria, het beschikbare bewijs en de resterende onzekerheid uit.\n\nEen waardeconflict kan echt blijven bestaan nadat misverstanden zijn opgelost. Eén medewerker hecht sterker aan vrijheid, een ander aan betrouwbare bereikbaarheid. Vermijd dan de voorstelling dat één van hen noodzakelijk de feiten ontkent. Maak de doelen zichtbaar en vergelijk concrete ontwerpen op beide waarden. Soms is een grensvoorwaarde passend: geen variant is aanvaardbaar wanneer een noodzakelijke dienst onbezet raakt. Soms is een afweging nodig: een kleine beperking kan gerechtvaardigd zijn wanneer zij een belangrijk gedeeld doel ondersteunt. Verantwoord ook waarom een minder ingrijpend alternatief onvoldoende is.\n\nDe sterkste tegenwerping vormt een praktische test van je voorstel. Kun je haar in woorden formuleren die de criticus herkent, en kun je uitleggen wat zij aan je conclusie verandert? Een aangepast voorstel kan overtuigender zijn dan een star verdedigd origineel. Geef het team bovendien een concrete manier om relevante nieuwe informatie terug te melden. Zo worden vertrouwen en overtuigingskracht verbonden met transparantie en herzienbaarheid, zonder dat ieder gesprek eindigt in schijnzekerheid of een onbegrensde discussie."
    },
    "exercises": [
      {
        "id": "ml3-verschil",
        "kind": "choice",
        "prompt": "Wat is het belangrijkste verschil in dit gesprek?",
        "scenario": "Twee collega’s accepteren dezelfde kosten en tijdbesparing van een nieuw rooster. De één vindt autonomie belangrijker; de ander voorspelbare bezetting.",
        "explanation": "Een gedeeld feitenbeeld sluit een waardeconflict niet uit.",
        "options": [
          {
            "id": "ml3-verschil-o1",
            "text": "Zij moeten eerst dezelfde bedragen nogmaals uitrekenen; daarna verdwijnen alle verschillen.",
            "feedback": "Meer rekenen lost de verschillende weging van dezelfde waarden niet vanzelf op."
          },
          {
            "id": "ml3-verschil-o2",
            "text": "Zij delen de feiten maar wegen waarden anders; vergelijk ontwerpen op beide criteria.",
            "feedback": "Juist: het volgende gesprek moet de afweging en mogelijke ontwerpen verduidelijken."
          },
          {
            "id": "ml3-verschil-o3",
            "text": "Eén van hen liegt noodzakelijk over de kosten.",
            "feedback": "De gegeven context zegt juist dat zij dezelfde kosten accepteren."
          },
          {
            "id": "ml3-verschil-o4",
            "text": "De voorkeur van de leidinggevende bewijst welke waarde objectief het enige belang is.",
            "feedback": "Beslisbevoegdheid maakt andere relevante waarden niet inhoudelijk onjuist."
          }
        ],
        "answer": "ml3-verschil-o2"
      },
      {
        "id": "ml3-tegenwerping",
        "kind": "choice",
        "prompt": "Welke reactie verwerkt de sterkste tegenwerping?",
        "scenario": "Voorstel: een beperkte roosterproef. Tegenwerping: onverwachte wijzigingen raken collega’s met zorgtaken onevenredig.",
        "explanation": "Een gerichte reactie houdt het beperkte voorstel vast en adresseert de concrete ongelijke last.",
        "options": [
          {
            "id": "ml3-tegenwerping-o1",
            "text": "De criticus houdt niet van verandering, dus de zorg vervalt.",
            "feedback": "Dit vervangt de inhoudelijke verdelingsvraag door een eigenschap van de criticus."
          },
          {
            "id": "ml3-tegenwerping-o2",
            "text": "We hoeven geen uitleg te geven omdat het slechts een proef is.",
            "feedback": "Een tijdelijke ingreep kan nog steeds echte ongelijke lasten veroorzaken."
          },
          {
            "id": "ml3-tegenwerping-o3",
            "text": "Leg vaste uitzonderingen, aankondigingstermijn en een verdelingstoets vast en beoordeel daarna of de proef verantwoord is.",
            "feedback": "Juist: deze reactie vertaalt de zorg naar voorwaarden die het voorstel verbeteren."
          },
          {
            "id": "ml3-tegenwerping-o4",
            "text": "Iedere zorgplicht maakt elke roosterwijziging voorgoed onmogelijk.",
            "feedback": "Dat is een te brede conclusie; verschillende ontwerpen kunnen verschillende gevolgen hebben."
          }
        ],
        "answer": "ml3-tegenwerping-o3"
      },
      {
        "id": "ml3-herziening",
        "kind": "choice",
        "prompt": "Welke voorwaarde maakt het besluit controleerbaar?",
        "scenario": "Een team voert een nieuw overdrachtsmoment in om fouten te verminderen.",
        "explanation": "Een concrete maat en herzieningsregel laten zien wat het besluit moet opleveren en wanneer aanpassing nodig is.",
        "options": [
          {
            "id": "ml3-herziening-o1",
            "text": "We behouden het besluit zolang de leidinggevende het verstandig noemt.",
            "feedback": "Dit maakt de conclusie afhankelijk van gezag zonder een onafhankelijke toets."
          },
          {
            "id": "ml3-herziening-o2",
            "text": "Na zes weken vergelijken we overdrachtsfouten en werkbelasting met de afgesproken grens; bij overschrijding passen we de regeling aan.",
            "feedback": "Juist: doel en grens krijgen een controleerbare betekenis."
          },
          {
            "id": "ml3-herziening-o3",
            "text": "Alle bezwaren bewijzen voortaan dat collega’s onvoldoende gemotiveerd zijn.",
            "feedback": "Zo wordt relevante tegenspraak vooraf afgewezen."
          },
          {
            "id": "ml3-herziening-o4",
            "text": "We kiezen achteraf uitsluitend de maat waarop het besluit goed uitvalt.",
            "feedback": "Dat beschermt het besluit tegen kritiek in plaats van het eerlijk te beoordelen."
          }
        ],
        "answer": "ml3-herziening-o2"
      },
      {
        "id": "ml3-besluit-map",
        "kind": "map",
        "prompt": "Plaats de onderdelen van de besluitredenering.",
        "claim": "Voer een begrensde roosterproef in met bescherming van zorgtaken.",
        "explanation": "Een besluitreden, een tegenwerping en een waarborg hebben verschillende functies. De waarborg reageert op een zorg zonder die te ontkennen.",
        "categories": [
          {
            "id": "reden",
            "label": "Reden voor de proef"
          },
          {
            "id": "bezwaar",
            "label": "Sterkste tegenwerping"
          },
          {
            "id": "waarborg",
            "label": "Voorwaarde / waarborg"
          },
          {
            "id": "herziening",
            "label": "Aanleiding tot herziening"
          }
        ],
        "cards": [
          {
            "id": "ml3-map-c1",
            "text": "De huidige verdeling laat regelmatig noodzakelijke diensten onbezet.",
            "category": "reden"
          },
          {
            "id": "ml3-map-c2",
            "text": "Onverwachte wijzigingen kunnen collega’s met zorgtaken onevenredig belasten.",
            "category": "bezwaar"
          },
          {
            "id": "ml3-map-c3",
            "text": "Bescherm vaste afspraken en kondig veranderingen tijdig aan.",
            "category": "waarborg"
          },
          {
            "id": "ml3-map-c4",
            "text": "Pas de proef aan als de afgesproken verdelingstoets een ongelijke last laat zien.",
            "category": "herziening"
          }
        ]
      },
      {
        "id": "ml3-dossier",
        "kind": "reflection",
        "prompt": "Schrijf een overtuigend voorstel met de sterkste tegenwerping, een aanpassing en een herzieningscriterium.",
        "scenario": "Een team wil twee verplichte kantoordagen om overdrachten te verbeteren. Nieuwe collega’s missen nu informele uitleg. Ervaren medewerkers wijzen op rustige thuiswerkdagen en zorgtaken. De manager verwacht minder fouten, maar heeft nog geen concrete vergelijking gemaakt. Sommige taken vragen fysieke aanwezigheid, andere nauwelijks. Het team moet een uitvoerbaar besluit nemen zonder iedere voorkeur als onveranderlijke eis te behandelen. Schrijf een voorstel dat mensen met verschillende belangen redelijk kunnen beoordelen.",
        "explanation": "Een sterk voorstel verbindt een gedeeld doel aan specifieke voorwaarden en geeft de belangrijkste zorg een inhoudelijk antwoord.",
        "model": "Ik stel een zesweekse proef voor met één gezamenlijke overdrachtsdag en taakgerichte aanwezigheid op een tweede dag. Het doel is betere overdracht en begeleiding, niet aanwezigheid op zichzelf. De sterkste tegenwerping is ongelijke belasting voor collega’s met zorgtaken en verlies van geconcentreerd werk. Daarom leggen we uitzonderingen, vaste aankondigingstermijnen en rustige werkblokken vast. We beoordelen overdrachtsfouten, toegankelijkheid van begeleiding en verdeling van belasting op vooraf afgesproken criteria. Het voorstel blijft beperkt: als die doelen niet verbeteren of de lasten onevenredig blijken, passen we de regeling aan. De beschikbare argumenten bewijzen nog niet dat twee algemene verplichte dagen de beste oplossing zijn.",
        "rubric": [
          "Je benoemt een gedeeld doel en de reden voor jouw voorstel.",
          "Je formuleert de sterkste tekstgetrouwe tegenwerping en een gerichte aanpassing.",
          "Je maakt de verdeling van lasten en een herzieningscriterium zichtbaar."
        ],
        "minWords": 90
      }
    ],
    "sourceIds": [
      "rhetoric",
      "pragma",
      "toulmin",
      "tindale"
    ]
  },
  {
    "id": "master-bayes-basisfrequentie",
    "moduleId": "master",
    "title": "Bayesiaanse bewijsweging en de basisfrequentie",
    "minutes": 40,
    "teaser": "Een goede testuitslag is geen kans op de hypothese: begin bij de populatie en reken het bewijs door.",
    "objectives": [
      "P(E|H) onderscheiden van P(H|E).",
      "Posterior kansen via natuurlijke frequenties berekenen.",
      "Prior, likelihood en beslissing apart interpreteren."
    ],
    "sections": [
      {
        "title": "De richting van de voorwaardelijke kans",
        "body": "De kans op een positieve uitslag wanneer een onderdeel defect is, is niet dezelfde als de kans op een defect wanneer de uitslag positief is. De eerste is een testkarakteristiek; de tweede hangt ook af van hoeveel defecten vooraf in de onderzochte populatie voorkomen en van positieve uitslagen bij goede onderdelen. Gebruik een hypothetisch dossier: 1% van 10.000 onderdelen is defect. De test markeert 90% van de defecte onderdelen en ten onrechte 5% van de goede. Dan ontstaan 90 terecht positieve en 495 fout-positieve uitslagen. Onder de 585 positieve uitslagen zijn dus 90 defecte onderdelen: ongeveer 15,4%. Het bewijs verhoogt de kans van 1% naar 15,4%, maar ondersteunt geen 90% zekerheid. Dit resultaat beschrijft een aangenomen model, geen eigenschap van een echte industriële test.",
        "example": "1% vooraf, 90% sensitiviteit en 95% specificiteit geven in dit dossier 90 / (90 + 495) ≈ 15,4% kans op defect na positief.",
        "takeaway": "Draai voorwaardelijke kansen niet om; neem de relevante basisfrequentie mee."
      },
      {
        "title": "Van odds naar bewijs en vervolgens naar een besluit",
        "body": "Bayes kan ook met odds worden geschreven: posterior odds = prior odds × likelihood ratio. Voor een positieve uitslag is de likelihood ratio P(E|H) / P(E|niet-H). In het dossier is die 0,90 / 0,05 = 18. Dat is een forse bewijstoename, maar de kleine prior zorgt dat de posterior geen zekerheid wordt. Een likelihood ratio geeft aan hoe het bewijs twee hypothesen onderscheidt; zij is niet zelf de posterior kans. Een besluit vraagt daarna een andere stap: welke kosten en gevolgen hebben een gemist defect, een onterecht afgekeurd onderdeel en een vervolgmeting? Hetzelfde posterior oordeel kan bij verschillende belangen tot een andere rationele handeling leiden. Vermeld daarom de hypothesen, populatie, aannames en besliscriteria afzonderlijk. Zo voorkom je dat een rekenuitkomst ongemerkt een beleidsnorm wordt.",
        "example": "Een goedkope bevestigingstest kan verstandig zijn bij 15,4% risico, ook als directe afkeuring veel kosten heeft. De actie hangt af van gevolgen, niet alleen van het percentage.",
        "takeaway": "Bayes weegt onzekerheid; een beslissing vereist daarnaast expliciete waarden en kosten."
      }
    ],
    "deepDive": {
      "title": "Priorinformatie is relevant en tegelijk betwistbaar",
      "body": "De prior beschrijft onzekerheid vóór het nieuwe bewijs. Zij kan gebaseerd zijn op een relevante populatiefrequentie, eerdere informatie of een expliciet gemodelleerde overtuiging. Een slechte prior kan tot een misleidende posterior leiden; dat is een reden om de prior te toetsen, niet om haar uit de berekening weg te laten. Voor een test in een voorselectie van verdachte onderdelen kan de basisfrequentie veel hoger zijn dan in de gehele fabriek. Het ongemerkt gebruiken van de fabriekspopulatie voor die selectie verandert de vraag.\n\nNatuurlijke frequenties helpen de juiste referentiegroep zichtbaar maken. Na een positieve uitslag selecteer je alle positieve gevallen, waaronder werkelijk defecte en goede onderdelen. De posterior is het aandeel defecten binnen die geselecteerde groep. Deze weergave voorkomt de verwarring tussen een betrouwbaar testmechanisme en de betrouwbaarheid van een specifieke positieve uitkomst.\n\nVerder moet bewijs niet met zekerheid worden verward. Een positieve uitslag kan sterk in het voordeel van H spreken, terwijl H na de update toch minder waarschijnlijk blijft dan niet-H, wanneer H vooraf zeldzaam was. Beide uitspraken kunnen tegelijk waar zijn. “Sterk bewijs” betekent hier een verhouding van likelihoods; “waarschijnlijk waar” betreft de posterior. Beoordeel ook hoe de conclusie verandert bij plausibele andere priors en testkarakteristieken. Een gevoeligheidsanalyse kan aantonen dat een advies robuust is of juist grotendeels op een onzekere aanname steunt. Rapporteer die afhankelijkheid voordat je één schijnbaar exact getal als definitief presenteert."
    },
    "exercises": [
      {
        "id": "ma4-richting",
        "kind": "choice",
        "prompt": "Welke kans beschrijft de posterior?",
        "scenario": "H = onderdeel defect. E = test positief. Een manager wil de kans op defect weten na het zien van de uitslag.",
        "explanation": "De gewenste referentiegroep bestaat uit positieve testuitslagen.",
        "options": [
          {
            "id": "ma4-richting-o1",
            "text": "P(E|H), de kans op positief bij een defect.",
            "feedback": "Dat is de testgevoeligheid, niet de gewenste omgekeerde kans."
          },
          {
            "id": "ma4-richting-o2",
            "text": "P(H|E), de kans op defect bij een positieve test.",
            "feedback": "Juist: dit is de posterior in de beschreven vraag."
          },
          {
            "id": "ma4-richting-o3",
            "text": "P(E|niet-H), de kans op positief bij een goed onderdeel.",
            "feedback": "Dat is de fout-positieve kans."
          },
          {
            "id": "ma4-richting-o4",
            "text": "P(H), de kans vóór de uitslag.",
            "feedback": "Dit is de prior, nog niet het bijgestelde oordeel."
          }
        ],
        "answer": "ma4-richting-o2"
      },
      {
        "id": "ma4-frequenties",
        "kind": "choice",
        "prompt": "Hoeveel positieve uitslagen zijn in dit model defect?",
        "scenario": "Van 10.000 onderdelen zijn 100 defect. Er zijn 90 terecht positieve en 495 fout-positieve uitslagen.",
        "explanation": "De posterior gebruikt alle positieve uitslagen als noemer: 90 + 495.",
        "options": [
          {
            "id": "ma4-frequenties-o1",
            "text": "90 van de 100, dus 90%.",
            "feedback": "De noemer 100 bevat alle defecten, niet alle positieve uitslagen."
          },
          {
            "id": "ma4-frequenties-o2",
            "text": "90 van de 585, dus ongeveer 15,4%.",
            "feedback": "Juist: de referentiegroep is positief geteste onderdelen."
          },
          {
            "id": "ma4-frequenties-o3",
            "text": "495 van de 585, dus ongeveer 84,6%.",
            "feedback": "Dit is hier het aandeel goede onderdelen onder positieve uitslagen."
          },
          {
            "id": "ma4-frequenties-o4",
            "text": "100 van de 10.000, dus 1%.",
            "feedback": "Dat is de prior voor de gehele populatie vóór de test."
          }
        ],
        "answer": "ma4-frequenties-o2"
      },
      {
        "id": "ma4-sterkte",
        "kind": "choice",
        "prompt": "Welke combinatie van uitspraken is correct?",
        "scenario": "De prior is 1%, de positieve likelihood ratio is 18 en de posterior is ongeveer 15,4%.",
        "explanation": "De test is sterk onderscheidend voor deze hypothesen maar maakt een zeldzame hypothese nog niet waarschijnlijker dan haar ontkenning.",
        "options": [
          {
            "id": "ma4-sterkte-o1",
            "text": "De test is bewijs vóór defect, maar defect blijft na positief minder waarschijnlijk dan niet-defect.",
            "feedback": "Juist: bewijsrichting en posterior meerderheid zijn verschillende begrippen."
          },
          {
            "id": "ma4-sterkte-o2",
            "text": "De test is bewijs tegen defect omdat 15,4% onder 50% ligt.",
            "feedback": "De kans stijgt juist van 1% naar 15,4%; onder 50% blijven betekent niet dat het bewijs tegen H spreekt."
          },
          {
            "id": "ma4-sterkte-o3",
            "text": "De posterior moet 18% zijn omdat de likelihood ratio 18 is.",
            "feedback": "Een likelihood ratio is geen percentage."
          },
          {
            "id": "ma4-sterkte-o4",
            "text": "Een prior mag nooit veranderen door nieuwe selectie-informatie.",
            "feedback": "Een andere relevante populatie of selectie kan de uitgangskans veranderen."
          }
        ],
        "answer": "ma4-sterkte-o1"
      },
      {
        "id": "ma4-bayes-rollen",
        "kind": "sort",
        "prompt": "Orden de modelonderdelen naar hun functie.",
        "explanation": "Rekenmodel en beslisregel beantwoorden verschillende vragen.",
        "categories": [
          {
            "id": "prior",
            "label": "Prior"
          },
          {
            "id": "likelihood",
            "label": "Test-likelihood"
          },
          {
            "id": "posterior",
            "label": "Posterior"
          },
          {
            "id": "besluit",
            "label": "Besliscriterium"
          }
        ],
        "cards": [
          {
            "id": "ma4-bayes-rollen-c1",
            "text": "Voor de test is 1% van de relevante populatie defect.",
            "category": "prior"
          },
          {
            "id": "ma4-bayes-rollen-c2",
            "text": "Een defect onderdeel test met kans 90% positief.",
            "category": "likelihood"
          },
          {
            "id": "ma4-bayes-rollen-c3",
            "text": "Na positief is de kans op defect in dit model ongeveer 15,4%.",
            "category": "posterior"
          },
          {
            "id": "ma4-bayes-rollen-c4",
            "text": "Een vervolgtest is gewenst als de verwachte vermindering van beslisverlies door de test de kosten overtreft.",
            "category": "besluit"
          }
        ]
      },
      {
        "id": "ma4-dossier",
        "kind": "reflection",
        "prompt": "Bereken met frequenties en bespreek de populatiekeuze en het besluit apart.",
        "scenario": "Een fabrikant voert dezelfde hypothetische test nu uit bij een voorselectie waarin 10% van de onderdelen defect is. De test markeert nog steeds 90% van de defecten en 5% van de goede onderdelen positief. Een manager blijft het oude posterior getal 15,4% uit de algemene populatie gebruiken en wil alle positieve onderdelen direct vernietigen. Een technicus stelt een goedkope bevestigingstest voor, maar het team heeft de kosten van gemiste defecten nog niet vastgesteld. Reken voor 1.000 geselecteerde onderdelen.",
        "explanation": "Een gewijzigde basisfrequentie verandert de posterior. De handeling vraagt daarna een afzonderlijke kostenafweging.",
        "model": "Van 1.000 geselecteerde onderdelen zijn 100 defect en 900 goed. Er zijn 90 terecht positieve, 10 fout-negatieve, 45 fout-positieve en 855 terecht negatieve uitslagen, dus 90/135 ≈ 66,7% kans op defect bij positief. Het oude getal past niet bij de voorselectie. Direct vernietigen volgt niet uit Bayes alleen: vergelijk kosten van afkeuring, risico van een gemist defect en waarde van bevestiging. Controleer bovendien of de testkarakteristieken in de geselecteerde populatie gelijk blijven. De vier groepen maken zichtbaar waarom de referentiegroep uit alle positieve uitslagen bestaat. De bevestigingstest is vooral waardevol wanneer zij de verwachte beslisfouten genoeg vermindert ten opzichte van haar kosten. Die waarde volgt niet uitsluitend uit het bestaan van een resterend defectrisico.",
        "rubric": [
          "Je rekent de juiste vier groepen en posterior uit.",
          "Je verklaart waarom de basisfrequentie van de selectie relevant is.",
          "Je scheidt posterior, testaannames en besliskosten."
        ],
        "minWords": 90
      }
    ],
    "sourceIds": [
      "bayes"
    ],
    "lab": "bayes"
  },
  {
    "id": "master-sterke-redeneringen",
    "moduleId": "master",
    "title": "Een sterke redenering van begin tot besluit",
    "teaser": "Controleer iedere schakel, maak uitzonderingen zichtbaar en verbind feiten met een verdedigbare norm.",
    "minutes": 45,
    "objectives": [
      "Een keten van voorwaarden controleren zonder een vereiste te verwarren met een volledige rechtvaardiging.",
      "Complexe gevolgtrekkingen reconstrueren met feitelijke en normatieve bruggen.",
      "De sterkste tegenwerping gebruiken om een conclusie gericht te beperken of versterken."
    ],
    "sections": [
      {
        "title": "Elke schakel heeft haar eigen verplichting",
        "body": "Een complex voorstel gebruikt vaak een keten: een hulpmiddel vermindert fouten, minder fouten verbeteren kwaliteit en kwaliteitswinst rechtvaardigt invoering. Elke overgang vraagt eigen steun. Een onzekere eerste stap wordt niet zeker doordat een latere stap helder klinkt. Schrijf bij iedere pijl welke regel nodig is en onder welke voorwaarden zij geldt. Houd ook gecombineerde voorwaarden samen: “als veiligheid én budget passen, mag de proef starten” levert met veiligheid alleen geen toestemming. Wanneer je toestemming ziet, mag je evenmin zonder extra informatie concluderen dat juist deze route gebruikt is. Controleer daarnaast of woorden dezelfde betekenis behouden. “Kwaliteit” kan eerst minder fouten betekenen en later klanttevredenheid; dat is een verschuiving waarvoor een brug nodig is. Een sterke reconstructie maakt dergelijke schakels zichtbaar zodat kritiek precies kan aangeven waar de steun nog onvoldoende is.",
        "example": "Een haalbaar budget is één vereiste voor een proef. Het bewijst niet dat de privacyvoorwaarden of de gewenste werking daarmee ook vervuld zijn.",
        "takeaway": "Controleer iedere brug, iedere gezamenlijke voorwaarde en de betekenis van sleutelwoorden."
      },
      {
        "title": "De beste beleidsinferentie heeft feiten én waarden",
        "body": "Een feitelijke verbetering ondersteunt een besluit alleen met een passende normatieve afweging. “Deze aanpak versnelt werk” vraagt bijvoorbeeld de brug dat die snelheid, gegeven juistheid, kosten en verdeling van lasten, een goede reden is om haar te kiezen. Maak zo’n norm expliciet en geef haar onafhankelijke rechtvaardiging. Formuleer daarna de sterkste tegenwerping tegen de werkelijke versie van het voorstel. Zij kan een feitenpremisse raken, een uitzonderingsvoorwaarde noemen of de waardeafweging bestrijden. Kies een gerichte reactie: extra informatie, een waarborg, een alternatief ontwerp of een beperktere conclusie. Een volledig gereconstrueerde redenering hoeft niet elk mogelijk bezwaar voor altijd uit te sluiten. Zij moet duidelijk maken waarom het besluit nu verantwoord is en welke nieuwe informatie herziening zou rechtvaardigen. Dat maakt een voorstel tegelijk overtuigender en eerlijker voor mensen die de afweging anders beleven.",
        "example": "“We starten beperkt, omdat het verwachte voordeel relevant is en lasten beheersbaar zijn, mits de afgesproken privacygrens geldt en we bij tegenvallende kwaliteit stoppen.”",
        "takeaway": "De normatieve brug hoort bij de rechtvaardiging en verdient dezelfde aandacht als de cijfers."
      }
    ],
    "deepDive": {
      "title": "Sterk reconstrueren zonder nieuwe redenen te verzinnen",
      "body": "Een sterke redenering ontstaat door zwakke schakels te verduidelijken, niet door ongenoemde successen of onbetwiste waarden toe te voegen. Maak onderscheid tussen de best verdedigbare interpretatie van wat iemand werkelijk zegt en jouw verbeterde voorstel. Bij interpretatie moeten tekst en context de aanvulling dragen. Bij verbetering mag je nieuwe voorwaarden voorstellen, zolang je openlijk aangeeft dat dit veranderingen zijn.\n\nVoor een deductieve keten geldt dat geldige stappen met ware premissen een ware conclusie opleveren. In praktische voorstellen zijn veel premissen voorlopig: een effect is waarschijnlijk, een uitzondering kan optreden en een kostenraming is begrensd. Dan kan de conclusie geen onvoorwaardelijke zekerheid krijgen uitsluitend door het aantal stappen. Gebruik passende woorden zoals “onder deze voorwaarden”, “waarschijnlijk” en “een beperkte proef is verantwoord”. Een dergelijke qualifier is geen zwaktebod wanneer zij precies het beschikbare bewijs weerspiegelt.\n\nBedenk ook welk bezwaar het meest leerzaam is. De sterkste tegenwerping accepteert waar mogelijk de gegevens en betwist vervolgens de kwetsbare brug. “Zelfs als tijdwinst klopt, kan de last ongelijk verdeeld zijn” lokaliseert een normatief probleem veel preciezer dan een algemene afwijzing. Geef vervolgens een inhoudelijke reactie en toets of de aanpassing nog bij het oorspronkelijke doel past.\n\nEen goede afsluiting van een leiderschapsgesprek bevat daarom het besluit, de dragende redenen, de belangrijkste beperking en de afspraak voor herziening. Teamleden kunnen dan nagaan welke claims zij delen en waar een echt verschil blijft. Die helderheid is een praktische vorm van logische beheersing: je beheert de hele rechtvaardiging in plaats van alleen een overtuigende laatste zin."
    },
    "exercises": [
      {
        "id": "mst1-conjunctie",
        "kind": "choice",
        "prompt": "Welke conclusie volgt uit de voorwaarden?",
        "scenario": "Regel: als veiligheid én budget voldoen, mag de proef starten. Veiligheid voldoet. Over budget is nog niets bekend.",
        "explanation": "Een gezamenlijke voldoende voorwaarde is niet volledig vervuld door één deel.",
        "options": [
          {
            "id": "mst1-conjunctie-o1",
            "text": "De proef mag zeker starten, want de belangrijkste voorwaarde is vervuld.",
            "feedback": "De regel noemt beide voorwaarden; belangrijkheid van één deel vervangt het andere niet."
          },
          {
            "id": "mst1-conjunctie-o2",
            "text": "Starttoestemming volgt via deze regel pas wanneer ook budget voldoet.",
            "feedback": "Juist: de gegeven route vereist de volledige gezamenlijke voorwaarde."
          },
          {
            "id": "mst1-conjunctie-o3",
            "text": "De proef mag onmogelijk starten via enige andere regel.",
            "feedback": "De tekst sluit andere routes niet uit."
          },
          {
            "id": "mst1-conjunctie-o4",
            "text": "Budget voldoet omdat veiligheid voldoet.",
            "feedback": "Die verbinding is niet gegeven."
          }
        ],
        "answer": "mst1-conjunctie-o2"
      },
      {
        "id": "mst2-betekenis",
        "kind": "choice",
        "prompt": "Welk probleem zit in de keten?",
        "scenario": "“Het systeem verbetert kwaliteit omdat antwoorden sneller komen. Betere kwaliteit betekent minder inhoudelijke fouten, dus fouten dalen.”",
        "explanation": "De betekenis van kwaliteit verschuift zonder onderbouwing van snelheid naar inhoudelijke juistheid.",
        "options": [
          {
            "id": "mst2-betekenis-o1",
            "text": "De twee betekenissen van kwaliteit worden gelijkgesteld zonder brug tussen snelheid en juistheid.",
            "feedback": "Juist: de middelterm draagt ongemerkt een andere inhoud in de tweede stap."
          },
          {
            "id": "mst2-betekenis-o2",
            "text": "Iedere conclusie met twee stappen is noodzakelijk ongeldig.",
            "feedback": "Een keten kan geldig zijn als de verbindingen en betekenissen kloppen."
          },
          {
            "id": "mst2-betekenis-o3",
            "text": "Snellere antwoorden bewijzen altijd minder fouten.",
            "feedback": "Dat is juist de niet onderbouwde verbinding."
          },
          {
            "id": "mst2-betekenis-o4",
            "text": "Geen systeem kan ooit kwaliteit verbeteren.",
            "feedback": "Dit volgt niet uit de fout in deze redenering."
          }
        ],
        "answer": "mst2-betekenis-o1"
      },
      {
        "id": "mst3-sterkste",
        "kind": "choice",
        "prompt": "Welke tegenwerping lokaliseert de beleidsbrug het best?",
        "scenario": "Een werkwijze bespaart aantoonbaar tijd. De manager concludeert dat zij daarom verplicht moet worden.",
        "explanation": "De feiten accepteren en de normatieve stap toetsen is een gerichte kritiek op de aanbeveling.",
        "options": [
          {
            "id": "mst3-sterkste-o1",
            "text": "De manager spreekt overtuigend, dus verplichte invoering is fout.",
            "feedback": "Presentatiekwaliteit bepaalt de rechtvaardiging van verplichting niet."
          },
          {
            "id": "mst3-sterkste-o2",
            "text": "Zelfs bij tijdwinst moeten extra lasten, toegankelijkheid en minder ingrijpende alternatieven worden afgewogen.",
            "feedback": "Juist: dit benoemt wat de normatieve brug nog nodig heeft."
          },
          {
            "id": "mst3-sterkste-o3",
            "text": "Tijdwinst bestaat nooit als er bezwaar is.",
            "feedback": "Een normatief bezwaar ontkent het effect niet automatisch."
          },
          {
            "id": "mst3-sterkste-o4",
            "text": "Verplichting is gerechtvaardigd zodra één voordeel waar is.",
            "feedback": "Eén voordeel maakt andere belangen en voorwaarden niet overbodig."
          }
        ],
        "answer": "mst3-sterkste-o2"
      },
      {
        "id": "mst4-keten",
        "kind": "map",
        "prompt": "Plaats de onderdelen van de volledige beleidsredenering.",
        "explanation": "De kaart onderscheidt een effectaanwijzing, twee bruggen en een voorwaarde voor de toepassing.",
        "claim": "Voer de werkwijze begrensd in onder expliciete voorwaarden.",
        "categories": [
          {
            "id": "feit",
            "label": "Feitelijke aanwijzing"
          },
          {
            "id": "effect",
            "label": "Empirische brug"
          },
          {
            "id": "norm",
            "label": "Normatieve brug"
          },
          {
            "id": "voorwaarde",
            "label": "Toepassingsvoorwaarde"
          }
        ],
        "cards": [
          {
            "id": "mst4-keten-c1",
            "text": "Bij vergelijkbare opdrachten daalt de foutfrequentie tijdens de proef.",
            "category": "feit"
          },
          {
            "id": "mst4-keten-c2",
            "text": "De werkwijze zal bij deze taken waarschijnlijk ook buiten de proef fouten verminderen.",
            "category": "effect"
          },
          {
            "id": "mst4-keten-c3",
            "text": "Die kwaliteitswinst rechtvaardigt invoering als kosten en lasten aanvaardbaar zijn.",
            "category": "norm"
          },
          {
            "id": "mst4-keten-c4",
            "text": "De afgesproken privacygrens en ondersteuning blijven aanwezig.",
            "category": "voorwaarde"
          }
        ]
      },
      {
        "id": "mst5-dossier",
        "kind": "reflection",
        "prompt": "Bouw de sterkste tekstgetrouwe beleidsredenering en verwerk één bezwaar dat zelfs bij een gunstig effect blijft bestaan.",
        "scenario": "Een leidinggevende wil een automatische taakverdeling invoeren. In een beperkte proef waren wachttijden korter. De proef gebruikte eenvoudige opdrachten en kreeg extra menselijke controle. De leidinggevende zegt dat snelheid gelijkstaat aan kwaliteit en dat algemene verplichting daarom bewezen is. Ervaren medewerkers vragen ruimte voor uitzonderlijke situaties. Nieuwe medewerkers willen juist een voorspelbare verdeling. Het budget past, maar de afspraken over controle en afwijkingen zijn nog onduidelijk. Het team moet een verantwoord vervolgbesluit formuleren.",
        "explanation": "Een sterke reconstructie maakt de effectbrug, betekenis van kwaliteit, normatieve afweging en uitzonderingen expliciet.",
        "model": "De proef geeft een aanwijzing voor kortere wachttijden bij eenvoudige taken met extra controle. Zij bewijst nog geen algemene kwaliteitswinst; snelheid en juistheid moeten apart worden getoetst. De empirische brug vraagt dat het voordeel onder de beoogde taken en controlevoorwaarden aanhoudt. De normatieve brug weegt dit voordeel tegen kosten, lasten en benodigde autonomie. Zelfs als tijdwinst klopt, kan een gebrek aan uitzonderingsruimte verkeerde toewijzingen veroorzaken. Een verantwoord voorstel is daarom een begrensde uitbreiding met menselijke controle, een duidelijke afwijkingsroute en vooraf gekozen kwaliteits- en belastinggrenzen. Dat verbetert de rechtvaardiging zonder succes buiten de proef te verzinnen.",
        "rubric": [
          "Je reconstrueert de volledige keten zonder ontbrekende feiten als bewezen te presenteren.",
          "Je scheidt snelheid, kwaliteit en de norm voor verplichting.",
          "Je verwerkt een sterk bezwaar in concrete voorwaarden en een beperkte conclusie."
        ],
        "minWords": 90
      }
    ],
    "sourceIds": [
      "govier",
      "groarke",
      "toulmin",
      "pragma"
    ]
  },
  {
    "id": "master-checkpoint",
    "moduleId": "master",
    "title": "Checkpoint: leidinggeven met eerlijke en sterke argumenten",
    "minutes": 65,
    "checkpoint": true,
    "teaser": "Toets je kennis met acht vragen en werk daarna zelfstandig twee expertcasussen uit: een leiderschapsadvies en een onderbouwde herziening met zelfbeoordeling.",
    "objectives": [
      "Een gericht bezwaar lokaliseren.",
      "Een besluit met waarden en waarborgen rechtvaardigen.",
      "Onzekerheid proportioneel bijstellen.",
      "Zelfstandig een leiderschapsadvies reconstrueren, bekritiseren en verbeteren.",
      "Een eigen advies op nieuwe informatie herzien en de kwaliteit met concrete criteria beoordelen."
    ],
    "sections": [
      {
        "title": "Beoordeel de precieze claim",
        "body": "Een voorstel kan gaan over een verwacht voordeel, een wenselijke norm of een concrete beslissing. Lees welke claim iemand verdedigt voordat je bepaalt welke redenen en bezwaren relevant zijn. De vragen verbinden inhoudelijke kritiek met de manier waarop je een eerlijk gesprek voert.",
        "example": "Een positief testresultaat geeft niet rechtstreeks een verplichting tot afkeuring.",
        "takeaway": "Behoud de voorwaarden van de claim en leg de belangrijkste afweging uit."
      },
      {
        "title": "Gebruik tegenspraak om het voorstel beter te maken",
        "body": "Controleer na het nakijken of je kunt uitleggen wat een bezwaar wel en niet aantoont. Formuleer daarna een betere zin voor het gesprek: een beperkte claim, een relevante vraag of een passende waarborg. Een bruikbaar antwoord helpt het team verder.",
        "example": "Een ondermijnde bewijsroute kan meer onzekerheid geven zonder het tegendeel te bewijzen.",
        "takeaway": "Verbind iedere diagnose met een concrete verbetering."
      }
    ],
    "deepDive": {
      "title": "Een redelijk besluit hoeft geen schijnzekerheid te geven",
      "body": "Heldere argumenten verbinden feiten, waarden en toepassingsvoorwaarden. Eerlijke tegenspraak vraagt dat je de werkelijk verdedigde positie aanvalt en een bezwaar niet verder trekt dan het draagt. Een leidinggevende maakt zichtbaar waarom een besluit nu redelijk is, welke belangen worden afgewogen en wanneer nieuwe informatie aanleiding is om het te herzien."
    },
    "exercises": [
      {
        "id": "mc1-keten",
        "kind": "choice",
        "prompt": "Welke aanvulling is nodig voor dit beleidsargument?",
        "scenario": "“Deze werkwijze bespaart tijd, dus we moeten haar verplichten.”",
        "explanation": "Een feitelijk voordeel vraagt een normatieve afweging om verplichting te rechtvaardigen.",
        "options": [
          {
            "id": "mc1-keten-o1",
            "text": "Een brug die tijdwinst afweegt tegen lasten, toegankelijkheid en alternatieven.",
            "feedback": "Juist: de aanbeveling vraagt deze normatieve verbinding."
          },
          {
            "id": "mc1-keten-o2",
            "text": "Dezelfde tijdwinst nogmaals in andere woorden.",
            "feedback": "Herhaling voegt geen ontbrekende normatieve brug toe."
          },
          {
            "id": "mc1-keten-o3",
            "text": "De leidinggevende kan de conclusie zonder verdere reden waar maken.",
            "feedback": "Bevoegdheid vervangt de rechtvaardiging niet."
          }
        ],
        "answer": "mc1-keten-o1"
      },
      {
        "id": "mc2-gezamenlijk",
        "kind": "choice",
        "prompt": "Wat kun je via deze regel concluderen?",
        "scenario": "Alleen als privacy én budget voldoen, is invoering toegestaan. Budget voldoet; privacy is nog onbekend.",
        "explanation": "De noodzakelijke gezamenlijke voorwaarden moeten beide worden getoetst; één bevestiging garandeert geen toestemming.",
        "options": [
          {
            "id": "mc2-gezamenlijk-o1",
            "text": "Toestemming is al bewezen omdat budget past.",
            "feedback": "De privacyvoorwaarde is nog niet vastgesteld en de noodzakelijke voorwaarden vormen geen volledige voldoende route."
          },
          {
            "id": "mc2-gezamenlijk-o2",
            "text": "Er ontbreekt minstens informatie over privacy; toestemming volgt nog niet.",
            "feedback": "Juist: één vervulde vereiste rechtvaardigt de gehele conclusie niet."
          },
          {
            "id": "mc2-gezamenlijk-o3",
            "text": "Invoering is noodzakelijk voor altijd verboden.",
            "feedback": "Onbekende privacyvoorwaarden bewijzen geen permanente onmogelijkheid."
          }
        ],
        "answer": "mc2-gezamenlijk-o2"
      },
      {
        "id": "mc3-aanval",
        "kind": "choice",
        "prompt": "Wat voor bezwaar is dit?",
        "scenario": "Een sensor leest “hoog”; een bezwaar stelt dat de sensor in deze storingsmodus geen betrouwbare relatie met concentratie heeft.",
        "explanation": "Het bezwaar tast de inferentie aan zonder een lage concentratie te bewijzen.",
        "options": [
          {
            "id": "mc3-aanval-o1",
            "text": "Premisseaanval op het bestaan van de aflezing.",
            "feedback": "Het bezwaar accepteert de aflezing maar betwist haar betekenis."
          },
          {
            "id": "mc3-aanval-o2",
            "text": "Ondermijning van de inferentiële verbinding.",
            "feedback": "Juist: dit is undercutting in deze context."
          },
          {
            "id": "mc3-aanval-o3",
            "text": "Bewijs dat de concentratie laag is.",
            "feedback": "Het bezwaar ondersteunt die tegenconclusie niet."
          }
        ],
        "answer": "mc3-aanval-o2"
      },
      {
        "id": "mc4-belangen",
        "kind": "choice",
        "prompt": "Welke reactie past bij dit waardeconflict?",
        "scenario": "Iedereen accepteert dat een roosterwijziging kosten bespaart. Sommigen vinden flexibiliteit belangrijker; anderen voorspelbaarheid.",
        "explanation": "Het verschil zit in waardering van gedeelde gevolgen en vraagt een expliciete afweging.",
        "options": [
          {
            "id": "mc4-belangen-o1",
            "text": "Herhaal uitsluitend het kostenbedrag totdat iedereen hetzelfde wil.",
            "feedback": "De cijfers zijn gedeeld; herhaling lost verschillende waardegewichten niet op."
          },
          {
            "id": "mc4-belangen-o2",
            "text": "Vergelijk alternatieven op beide waarden en maak de gekozen afweging expliciet.",
            "feedback": "Juist: dit behandelt het werkelijke verschil en houdt het besluit controleerbaar."
          },
          {
            "id": "mc4-belangen-o3",
            "text": "Noem elke afwijkende voorkeur een drogreden.",
            "feedback": "Een waardeconflict is niet op zichzelf een fout in redeneren."
          }
        ],
        "answer": "mc4-belangen-o2"
      },
      {
        "id": "mc5-tegenspraak",
        "kind": "choice",
        "prompt": "Welke zet verwerkt de sterkste tegenwerping?",
        "scenario": "Een plan versnelt klantcontact, maar kan medewerkers met beperkte beschikbaarheid extra belasten.",
        "explanation": "Een relevant verdelingsbezwaar vraagt inhoudelijke reactie en passende voorwaarden.",
        "options": [
          {
            "id": "mc5-tegenspraak-o1",
            "text": "Vat de zorg samen en toets een aanpassing die de ongelijke last beperkt.",
            "feedback": "Juist: deze zet versterkt het voorstel door de echte zorg te behandelen."
          },
          {
            "id": "mc5-tegenspraak-o2",
            "text": "Verander de zorg in “niemand wil klanten helpen” en weerleg dat.",
            "feedback": "Dit vervormt de positie en behandelt het werkelijke bezwaar niet."
          },
          {
            "id": "mc5-tegenspraak-o3",
            "text": "Verklaar het plan bewezen omdat de manager mag besluiten.",
            "feedback": "Bevoegdheid vervangt geen voldoende rechtvaardiging."
          }
        ],
        "answer": "mc5-tegenspraak-o1"
      },
      {
        "id": "mc6-posterior",
        "kind": "choice",
        "prompt": "Wat is P(H|E)?",
        "scenario": "In een geselecteerde populatie zijn 100 defecte en 900 goede onderdelen. Er zijn 90 terecht positieve en 45 fout-positieve uitslagen.",
        "explanation": "De noemer is alle 135 positieve uitslagen.",
        "options": [
          {
            "id": "mc6-posterior-o1",
            "text": "90%",
            "feedback": "Dit is de sensitiviteit onder defecten."
          },
          {
            "id": "mc6-posterior-o2",
            "text": "66,7% bij benadering.",
            "feedback": "Juist: 90/135 is de kans op defect onder positieve uitslagen."
          },
          {
            "id": "mc6-posterior-o3",
            "text": "10%",
            "feedback": "Dit is de prior in de geselecteerde populatie."
          }
        ],
        "answer": "mc6-posterior-o2"
      },
      {
        "id": "mc7-likelihood",
        "kind": "choice",
        "prompt": "Wat is de positieve likelihood ratio?",
        "scenario": "P(E|H)=0,8 en P(E|niet-H)=0,1.",
        "explanation": "De verhouding is 0,8/0,1 = 8; zij is geen posterior percentage.",
        "options": [
          {
            "id": "mc7-likelihood-o1",
            "text": "8, als verhouding van de twee likelihoods.",
            "feedback": "Juist: het bewijs komt acht keer zo vaak voor onder H als onder niet-H."
          },
          {
            "id": "mc7-likelihood-o2",
            "text": "80% als posterior zonder prior.",
            "feedback": "De posterior kan niet uit sensitiviteit alleen worden bepaald."
          },
          {
            "id": "mc7-likelihood-o3",
            "text": "0,9 door beide kansen op te tellen.",
            "feedback": "Optellen is hier niet de likelihood-ratioformule."
          }
        ],
        "answer": "mc7-likelihood-o1"
      },
      {
        "id": "mc8-besluit",
        "kind": "choice",
        "prompt": "Welke extra informatie is nodig voor een handelingsadvies?",
        "scenario": "De posterior kans op een defect is 20%. De vraag is direct afkeuren of eerst opnieuw testen.",
        "explanation": "Een besluit vraagt gevolgen, kosten en waarde van extra informatie.",
        "options": [
          {
            "id": "mc8-besluit-o1",
            "text": "Alleen de sensitiviteit, omdat een gelijke posterior altijd dezelfde optimale handeling geeft.",
            "feedback": "Een beslissing hangt ook af van kosten en gevolgen; dezelfde posterior kan verschillende acties ondersteunen."
          },
          {
            "id": "mc8-besluit-o2",
            "text": "Kosten van fouten en vervolgtest, plus relevante betrouwbaarheid van de vervolgtest.",
            "feedback": "Juist: deze informatie kan de acties bij dezelfde posterior onderscheiden."
          },
          {
            "id": "mc8-besluit-o3",
            "text": "De prior moet zonder reden op 50% worden gezet.",
            "feedback": "Dat verandert het model willekeurig en levert geen besliscriterium."
          }
        ],
        "answer": "mc8-besluit-o2"
      },
      {
        "id": "mc9-expertcasus-leiderschapsadvies",
        "kind": "reflection",
        "prompt": "Expertcasus 1 — formuleer een zelfstandig leiderschapsadvies van minimaal 200 woorden. Reconstrueer eerst de sterkste herkenbare versie van het voorstel met Toulmin: gegevens, conclusie, warrant (de rechtvaardigende brug), backing, kwalificatie en uitzonderingen. Markeer wat expliciet is en wat je aanvult. Scheid feitelijke verwachtingen van normen en waarden. Geef vervolgens drie verschillende, gerichte bezwaren: één tegen een premisse, één rebuttal tegen de conclusie en één undercut tegen de verbinding. Verzin hiervoor geen vaststaande feiten; een mogelijke tegenwerping mag als voorwaardelijke toets worden geformuleerd. Behandel het sterkste bezwaar van de medewerkers eerlijk en verbeter het voorstel met concrete voorwaarden, een alternatief en een herzieningsmoment. Leg uit welke onzekerheid blijft en wie welke claim moet onderbouwen. Zelfbeoordeling: dit werkstuk krijgt geen automatische inhoudelijke score: vergelijk na het schrijven met het model en beoordeel jezelf op alle zes criteria.",
        "scenario": "Een serviceorganisatie met veertig medewerkers wil digitale dossiertriage binnen vier weken voor alle diensten verplichten. In een proef met vierhonderd gewone dossiers daalde de mediane wachttijd van 24 naar 16 minuten. Een extra senior medewerker controleerde elke toewijzing; avondwerk en complexe dossiers deden niet mee. Zes gewone dossiers werden verkeerd ingedeeld. Twee complexe dossiers kregen eveneens een verkeerde categorie, maar staan buiten de gerapporteerde vierhonderd. De directeur zegt dat er in totaal maar zes fouten waren, noemt de tijdwinst bewijs van betere dienstverlening en noemt twijfelende medewerkers behoudzuchtig. Voor een vervolg is maximaal €40.000 beschikbaar; een globale raming noemt €38.000, zonder bevestiging dat alle begeleiding daarin zit. Medewerkers willen betrouwbare hulp, voorspelbare roosters en een menselijke afwijkingsroute. Er is nog geen gedeelde grens voor fouten of extra werk afgesproken. Je moet nu een controleerbaar advies geven.",
        "explanation": "Dit is een zelfstandig werkstuk met zelfbeoordeling, geen automatisch bewijs van expertbeheersing. Meerdere besluiten kunnen redelijk zijn als de reconstructie, kritiek en afweging hun toepassingsvoorwaarden behouden. Een premisseaanval betwist een gegeven; een rebuttal bestrijdt een conclusie; een undercut bestrijdt de stap tussen gegeven en conclusie. Kritiek op verplichte invoering weerlegt niet vanzelf elke begrensde toepassing.",
        "model": "Mijn voorlopige advies is geen verplichte invoering voor alle diensten, maar hooguit een begrensde vervolgproef waarvoor begeleiding, kosten en afwijkingsruimte eerst worden vastgelegd. De gegevens ondersteunen kortere wachttijden bij gewone dossiers onder extra controle. Zij ondersteunen nog geen algemene kwaliteitsverbetering. Ik behoud die beperking in de conclusie.\n\nDe impliciete warrant luidt: een werkwijze die binnen de relevante omstandigheden de dienstverlening voldoende verbetert, zonder onevenredige fouten of lasten, verdient toepassing. Dit bevat zowel een verwachting over gevolgen als een normatieve afweging. Backing kan bestaan uit gedragen servicenormen en afspraken over toegankelijkheid en foutafhandeling; het ambt van directeur levert die steun niet vanzelf. Ik voeg deze normen als te bespreken voorwaarden toe, niet als al bewezen consensus. De kwalificatie is voorlopig en beperkt; complexe dossiers en ontbrekende controle zijn mogelijke uitzonderingen.\n\nEen premisseaanval bestrijdt ‘in totaal zes fouten’: het dossier vermeldt ook twee complexe fouten. Zonder vergelijkbare noemer bewijst dat geen hogere foutkans. Een rebuttal ondersteunt afwijzing van algemene verplichting omdat complexe fouten zonder afgesproken afhandeling kunnen doorwerken. Dat weerlegt geen geschiktheid voor gewone dossiers. Een undercut vraagt of de wachttijdwinst zonder extra senior beschikbaar blijft. Het effect kan van die begeleiding afhangen; het dossier bepaalt dat nog niet.\n\nHet sterkste bezwaar is dat verplichte snelheid zonder uitvoerbare menselijke correctie ongelijke lasten en verkeerde hulp kan veroorzaken. Dat verdient een inhoudelijke reactie, geen motiefetiket. Ik vergelijk daarom een begrensde toepassing met voortzetting van de huidige werkwijze. Een vervolg krijgt een bevestigde begroting, menselijke terugvalroute, afzonderlijke foutregistratie en vooraf afgesproken grenzen voor werkdruk en fouten. Na vier weken volgt herbeoordeling. De indiener moet de overdraagbaarheid en uitvoerbaarheid onderbouwen; medewerkers hoeven geen gegarandeerde mislukking te bewijzen om deze relevante lacunes aan te wijzen.",
        "rubric": [
          "Je reconstrueert gegevens, conclusie, warrant, backing, kwalificatie en uitzonderingen in hun context en markeert aangevulde aannames zonder nieuw bewijs te verzinnen.",
          "Je scheidt waargenomen feiten en verwachtingen van waarden en normen; je legt uit waarom tijdwinst alleen geen verplichte invoering rechtvaardigt.",
          "Je formuleert een premisseaanval, rebuttal en undercut met elk een precies doelwit en beperkt hun gevolgen tot wat zij daadwerkelijk aantasten.",
          "Je behandelt de sterkste medewerkerszorg in een herkenbare vorm, zonder persoonlijke aanval, stropop of onbewezen voorspelling van onvermijdelijke schade.",
          "Je vergelijkt een uitvoerbaar alternatief en verantwoordt de resterende onzekerheid, de grenzen van de proef en de verdeling van de bewijslast.",
          "Je geeft concrete voorwaarden, een toetsbaar herzieningsmoment en een beperkt advies; je gebruikt de zes criteria voor zelfbeoordeling en benoemt één verbetering van je eigen tekst."
        ],
        "minWords": 200
      },
      {
        "id": "mc10-expertcasus-advies-herzien",
        "kind": "reflection",
        "prompt": "Expertcasus 2 — herzie je eerdere advies in minimaal 180 woorden. Citeer één inhoudelijke stap uit je eigen eerste werkstuk en leg uit welke nieuwe premisse, toepassingsvoorwaarde of onzekerheidsinschatting nu verandert. Formaliseer de beslisregel met U voor ‘uitbreiding zoals ontworpen is toegestaan’, B voor passend budget en M voor menselijke beoordeling. Maak zichtbaar waarom de nieuwe gegevens deze uitbreiding kunnen uitsluiten en waarom vervulde noodzakelijke voorwaarden haar nog niet vanzelf toestaan. Scheid geldigheid van de gevolgtrekking van de waarheid of aanvaardbaarheid van haar premissen. Bereken daarnaast uit de audit hoe groot het aandeel werkelijk urgente dossiers onder alle alarmen is; noem teller, noemer en toepassingsbereik. Verbind dit met kosten van gemiste urgentie en onnodige escalatie zonder een risicopercentage tot een automatische beslisnorm te maken. Geef een herzien advies, een serieus bezwaar daartegen en informatie die later opnieuw een herziening kan rechtvaardigen. Zelfbeoordeling: het model is een mogelijke uitwerking, geen automatische inhoudelijke beoordeling.",
        "scenario": "Een audit van de registraties en begroting bevestigt de oorspronkelijke wachttijden, maar laat zien dat ook de begrensde vervolgproef met de benodigde begeleiding €56.000 kost. In avonddiensten is de beloofde menselijke beoordeling niet beschikbaar. De vastgestelde beslisregel luidt: uitbreiding zoals ontworpen is alleen toegestaan als zij binnen €40.000 past én elk urgentiealarm menselijk wordt beoordeeld. De audit controleert bovendien tienduizend vergelijkbare dossiers met een vastgestelde definitieve urgentieclassificatie. Honderd waren werkelijk urgent. Het systeem gaf alarm bij negentig daarvan en bij 495 van de 9.900 niet-urgente dossiers. De directeur zegt: ‘Het herkent negentig procent, dus bij een alarm is de urgentie vrijwel zeker.’ Een medewerker zegt: ‘Veel alarmen zijn fout, dus we kunnen ze allemaal negeren.’ Je moet het eerdere advies herzien en beide te sterke gevolgtrekkingen corrigeren.",
        "explanation": "Nieuwe betrouwbare informatie kan een eerder redelijk, voorwaardelijk advies veranderen. Dat is geen inconsistentie als je precies vermeldt welke premisse of voorwaarde wijzigt. Een geldige gevolgtrekking bewaart waarheid bij ware premissen, maar bewijst die premissen niet. Sensitiviteit en het aandeel werkelijk urgente dossiers onder alarmen gebruiken verschillende noemers. De twee werkstukken krijgen zelfbeoordeling aan de hand van de rubric en tellen niet mee in de objectieve toetspercentages.",
        "model": "In mijn eerste advies was een begrensde vervolgproef mogelijk onder bevestigde budget- en controlevoorwaarden. De audit ondermijnt nu die uitvoerbaarheid: ook die proef kost €56.000 en menselijke beoordeling ontbreekt ’s avonds. Ik trek de toestemming voor uitbreiding zoals ontworpen daarom in. De bevestigde wachttijden hoeven hiervoor niet te worden ontkend.\n\nU betekent ‘uitbreiding zoals ontworpen is toegestaan’. De regel is U → (B ∧ M), niet (B ∧ M) → U. Omdat B onwaar is, volgt ¬U volgens modus tollens; hetzelfde geldt bij ¬M. Dit is een geldige gevolgtrekking binnen de aanvaarde regel. Haar geldigheid bewijst niet dat de begroting klopt of dat de regel normatief juist is. Die premissen hebben eigen onderbouwing nodig. Omgekeerd leveren passend budget en menselijke beoordeling alleen noodzakelijke voorwaarden; zij bewijzen nog geen voldoende kwaliteit.\n\nVan de 585 alarmen zijn er negentig werkelijk urgent: 90/585 ≈ 15,4%. Negentig procent is hier de sensitiviteit, met de honderd urgente dossiers als noemer. Mijn uitkomst geldt voor deze gecontroleerde populatie en deze alarmdefinitie; zij is geen algemene garantie. Veel fout-positieve alarmen maken alle alarmen negeren evenmin redelijk: dan verdwijnen ook negentig terecht gesignaleerde urgenties.\n\nIk adviseer de huidige werkwijze te behouden en een goedkoper ontwerp met aantoonbare beoordelingscapaciteit te vergelijken. Het sterkste bezwaar is verlies van mogelijke tijdwinst. Daartegenover staan nu concrete uitvoerbaarheidsproblemen. Een aangepast budget, beschikbare controle en passende foutafweging kunnen heroverweging rechtvaardigen. Ik verbind het risicocijfer aan gevolgen van missen en onnodig escaleren; het cijfer alleen bepaalt geen handelingsplicht.",
        "rubric": [
          "Je verbindt de herziening met een concrete stap uit je eerdere advies en noemt precies welke nieuwe informatie de premisse, voorwaarde of mate van zekerheid verandert.",
          "Je schrijft U → (B ∧ M), redeneert geldig vanuit een ontbrekende noodzakelijke voorwaarde en legt uit waarom de omkering geen gegarandeerde toestemming geeft.",
          "Je onderscheidt de geldigheid van je gevolgtrekking van de waarheid of aanvaardbaarheid van de begroting, controleclaim en normatieve beslisregel.",
          "Je berekent 90/(90 + 495) met teller, noemer en toepassingsbereik; je onderscheidt deze 15,4% van de sensitiviteit van 90%.",
          "Je weerlegt zowel ‘vrijwel zekere urgentie’ als ‘negeer alle alarmen’ en weegt gemiste urgentie, onnodige escalatie en uitvoerbare menselijke controle.",
          "Je formuleert een proportioneel herzien advies, behandelt het sterkste bezwaar daartegen en noemt concrete nieuwe informatie die nogmaals herziening kan rechtvaardigen; je beoordeelt jezelf zonder een automatisch expertscore te claimen."
        ],
        "minWords": 180
      }
    ],
    "sourceIds": [
      "toulmin",
      "pragma",
      "rhetoric",
      "bayes",
      "govier",
      "groarke",
      "schemes"
    ]
  }
];
