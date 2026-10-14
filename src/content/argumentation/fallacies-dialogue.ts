import type { FallacySeed } from './fallacy-types';

// Original Dutch transfer cases, grounded in the supplied books.
export const dialogueFallacies: FallacySeed[] = [
  {
    "slug": "stropop",
    "name": "Stropop",
    "aliases": [
      "straw man",
      "strawman",
      "vertekende tegenstander"
    ],
    "family": "Gesprek en persoon",
    "level": "bachelor",
    "sourceTopic": "personal",
    "mediaIds": [
      "wiphi-stropop"
    ],
    "teaser": "Weerleg het werkelijke voorstel, inclusief zijn voorwaarden.",
    "criticalQuestion": "Valt de bekritiseerde uitspraak samen met wat de ander werkelijk verdedigt?",
    "sections": [
      {
        "title": "Eerst het echte standpunt",
        "body": "Een stropop ontstaat wanneer je een vervormde versie van een standpunt bestrijdt en die overwinning als weerlegging van het oorspronkelijke standpunt behandelt. De vervorming kan groot zijn: een beperkte proef wordt volledige invoering. Zij kan ook subtiel zijn: waarschijnlijk wordt zeker, één uitzondering wordt onbeperkte vrijheid. Noteer daarom de oorspronkelijke conclusie, redenen en voorwaarden. Vergelijk die met het doelwit van de reactie. Niet iedere slechte samenvatting is al een drogreden; de fout wordt argumentatief wanneer de vervanging het oordeel over de echte positie moet dragen. Je hoeft geen bewuste misleiding te bewijzen. Ook een haastige, oprechte interpretatie kan het verkeerde argument aanvallen.",
        "example": "“Probeer vrijdag een halfuur later te openen” wordt “jij wilt klanten voortaan buitensluiten”.",
        "takeaway": "Bewaar hoeveel, wanneer en onder welke voorwaarden iets wordt voorgesteld."
      },
      {
        "title": "Wanneer kritiek op gevolgen wél redelijk is",
        "body": "Een tegenstander mag gevolgen bespreken die niet letterlijk in het voorstel staan. Dat is redelijk wanneer een verdedigbare verbinding laat zien waarom die gevolgen bij uitvoering kunnen ontstaan. Het verschil zit in de onderbouwing en de toegeschreven positie. “Deze beperkte proef kan op vrijdag één vroege klant treffen” kan een relevant bezwaar zijn. “Jij vindt alle klanten onbelangrijk” schrijft zonder steun een ander standpunt toe. Ook een reductie tot een onaanvaardbare consequentie kan legitiem zijn: maak de gevolgtrekking zichtbaar en laat de ander haar betwisten. Een schrijver hoeft iedere consequentie niet zelf te willen. De consequentie beoordelen is iets anders dan haar als diens bedoeling presenteren.",
        "example": "Een sluitingsproef wordt bekritiseerd met de daadwerkelijk ontbrekende vroege bezetting, zonder het doel van de voorsteller te verdraaien.",
        "takeaway": "Verdedig de gevolgstap; schrijf de gevolgtrekking niet zomaar als overtuiging van de ander toe."
      },
      {
        "title": "Herstel én de sterkste tegenwerping",
        "body": "Herstel begint met een herkenbare herformulering: “Je wilt één proefdag, mits vroege klanten een alternatief hebben.” Vraag of die formulering klopt. Richt daarna het beste bezwaar op precies die versie, bijvoorbeeld dat het voorgestelde alternatief voor sommige klanten onbereikbaar is. Een serieuze tegenstander kan terecht zeggen dat jouw samenvatting het plan te gunstig maakt. Welwillendheid geeft geen vergunning om ontbrekende financiering of een niet genoemde uitzondering in te bouwen. Markeer aanvullingen als verbeteringen en laat de oorspronkelijke zwakke punten staan. Het einddoel is geen vriendelijke overeenstemming maar een nauwkeurig meningsverschil: welke beperking is voldoende, welke reden ontbreekt en welke wijziging zou het voorstel sterker maken?",
        "example": "“Het budget voor de proef is nog onbevestigd” bestrijdt een echte uitvoeringsvoorwaarde.",
        "takeaway": "Reconstructie en verbetering zijn aparte taken; geef voor beide aan wat je toevoegt."
      }
    ],
    "deepDive": {
      "title": "Een eerlijke reconstructie blijft toetsbaar",
      "body": "Een stropop is een relationele fout: je vergelijkt de reactie met een concrete verdedigde positie. Een losse zin kan daarom niet altijd worden beoordeeld zonder het eerdere gesprek. Houd onderscheid tussen een standpunt, een argument ervoor en een gevolg dat de criticus eruit afleidt. Een zwak argument weerleggen kan terecht zijn, maar bewijst nog niet dat iedere verdediging van hetzelfde standpunt mislukt.\n\nLet vooral op veranderde kwantoren en modaliteit. “Sommige taken mogen op afstand” is niet “alle taken moeten op afstand”. Een praktische conclusie met voorwaarden is evenmin een universele regel. De sterkste interpretatie die de context nog draagt verdient aandacht; een door jou verzonnen ideaalvoorstel niet.\n\nSoms is het eerdere standpunt onduidelijk. Vraag dan twee mogelijke lezingen te bevestigen in plaats van de minst aantrekkelijke te kiezen. Blijkt de ander werkelijk de ruime claim te verdedigen, dan mag je die ruime claim aanvallen. Nauwkeurigheid beschermt kritiek tegen zowel karikatuur als kunstmatige verfraaiing."
    },
    "starter": {
      "scenario": "Een collega wil één middag het spreekuur op afspraak proberen. Een reactie zegt dat zij nooit meer bezoekers wil ontvangen.",
      "prompt": "Wat is in de reactie veranderd?",
      "answer": 0,
      "options": [
        {
          "text": "Een beperkte proef wordt een algemene weigering.",
          "feedback": "Juist: één proefmiddag en nooit meer ontvangen hebben een andere reikwijdte. De reactie raakt daardoor niet vanzelf het echte voorstel."
        },
        {
          "text": "Dezelfde keuze krijgt alleen een kortere beschrijving.",
          "feedback": "De woorden veranderen juist de duur en het bereik. Een samenvatting mag de beperkingen van de oorspronkelijke keuze niet laten verdwijnen."
        },
        {
          "text": "De proef is al weerlegd doordat bezoekers worden genoemd.",
          "feedback": "Bezoekers kunnen relevant zijn, maar noemen alleen bewijst niet dat deze beperkte proef hen uitsluit. Daarvoor is een gerichte gevolgstap nodig."
        }
      ],
      "bridge": "Vergelijk nu de precieze voorwaarden voordat je kritiek op gevolgen beoordeelt."
    },
    "inquiry": {
      "scenario": "Een planner wil de voorraadcontrole op rustige dagen verkorten, mits de afwijkingslijst volledig blijft. In versie A zegt een criticus dat korter controleren fouten kan missen en noemt een concreet zwak controlepunt. In versie B zegt hij dat de planner geen enkel belang aan voorraad hecht.",
      "prompt": "Welke reactie behandelt het echte voorstel? Benoem ook wat versie A nog moet onderbouwen voordat haar bezwaar doorslaggevend is.",
      "model": "Versie A houdt het voorstel herkenbaar en richt zich op een mogelijk gevolg: ontbrekende fouten. Het concrete controlepunt kan daarvoor steun geven, maar de criticus moet laten zien waarom de verkorte controle dat punt onvoldoende dekt. Versie B vervangt het beperkte voorstel door een algemene houding tegenover voorraad. Dat raakt de werkelijk verdedigde beperking niet. Ik zou eerst bevestigen welke controles behouden blijven en vervolgens het kwetsbare onderdeel bespreken. Als dat onderdeel noodzakelijk is, kan de proef worden aangepast of afgewezen. Daarmee blijft ruimte voor serieuze kritiek zonder de planner een vergaande overtuiging toe te schrijven.",
      "followUp": "Herzie je analyse als de planner de afwijkingslijst nu óók wil schrappen. Welk nieuw, sterker bezwaar wordt daarmee relevant?"
    },
    "core": {
      "scenario": "De kantinecommissie wil één vegetarische lunch per maand naast de gewone opties. Een reactie luidt: ‘Een volledig verbod op vlees schaadt de keuzevrijheid, dus dit voorstel moet weg.’",
      "prompt": "Welke stap maakt de reactie onvoldoende?",
      "answer": 1,
      "options": [
        {
          "text": "Er mag nooit over keuzevrijheid worden gesproken.",
          "feedback": "Keuzevrijheid is een relevant doel. Het probleem is dat de reactie een verbod bestrijdt dat dit voorstel niet bevat."
        },
        {
          "text": "Het aangevallen verbod vervangt het aanbod naast bestaande opties.",
          "feedback": "Juist: de tegenwerping kan tegen een verbod gelden en toch dit aanvullende aanbod missen. Vergelijk de werkelijk voorgestelde keuzeruimte."
        },
        {
          "text": "Een voorstel voor één lunch kan geen enkel nadeel hebben.",
          "feedback": "Ook een beperkte lunch kan kosten of praktische bezwaren hebben. Zulke echte nadelen moeten worden beoordeeld zonder een ander plan toe te schrijven."
        }
      ]
    },
    "assessment": [
      {
        "scenario": "Een team vraagt twee extra inwerkdagen voor nieuwe medewerkers. De manager reageert dat maandenlange training te duur is en wijst daarom het verzoek af.",
        "prompt": "Wat moet je eerst corrigeren?",
        "answer": 0,
        "options": [
          {
            "text": "Het verzoek van twee dagen is vervangen door maandenlange training.",
            "feedback": "Juist: het kostenbezwaar kan voor maanden gelden, maar de manager moet de werkelijk gevraagde twee dagen beoordelen."
          },
          {
            "text": "Elk kostenbezwaar is een persoonlijke aanval.",
            "feedback": "Kosten kunnen rechtstreeks relevant zijn voor training. Hier gaat het om de verandering van het voorstel, niet om de persoon."
          },
          {
            "text": "Twee extra dagen zijn door de fout automatisch verplicht.",
            "feedback": "De slechte weerlegging maakt het verzoek niet automatisch goed. De juiste omvang vraagt nog een eigen afweging van kosten en baten."
          }
        ]
      },
      {
        "scenario": "Een team wil een pauzeruimte sluiten tijdens schoonmaak. De criticus toont dat medewerkers zonder bereikbaar alternatief hun afgesproken pauzeplek verliezen.",
        "prompt": "Waarom kan deze kritiek redelijk zijn?",
        "answer": 2,
        "options": [
          {
            "text": "Zij is redelijk omdat ieder sluitingsplan verkeerd is.",
            "feedback": "Dat algemene oordeel volgt niet uit dit geval. De kritiek moet de concrete gevolgen en beschikbare alternatieven verbinden met deze sluiting."
          },
          {
            "text": "Zij is redelijk omdat de voorsteller dat gevolg persoonlijk wil.",
            "feedback": "Een onwenselijk gevolg kan optreden zonder dat de voorsteller het wil. Een bedoeling toeschrijven is hier niet nodig."
          },
          {
            "text": "Zij behandelt een aantoonbaar gevolg van het werkelijke plan.",
            "feedback": "Juist: de criticus behoudt het voorstel en onderbouwt een relevante consequentie. Dat is geen vervanging door een karikatuur."
          }
        ]
      },
      {
        "scenario": "Een collega wil urgente berichten tijdens twee focusuren telefonisch laten melden. Een ander spreekt over ‘alle communicatie verbieden’.",
        "prompt": "Welke herstelzin maakt het meningsverschil het scherpst?",
        "answer": 1,
        "options": [
          {
            "text": "‘Omdat jouw reactie een stropop is, hoeven urgenties niet besproken te worden.’",
            "feedback": "Het foutlabel vervangt de inhoudelijke beoordeling. Juist de bereikbaarheid voor echte urgenties kan een sterk tegenargument zijn."
          },
          {
            "text": "‘Je behoudt telefonisch contact voor urgenties; hoe werkt dat voor iemand zonder telefoon?’",
            "feedback": "Juist: deze zin bewaart de uitzondering en onderzoekt een concreet zwak punt. De voorsteller kan daarop inhoudelijk reageren."
          },
          {
            "text": "‘Ik voeg gratis telefoons voor iedereen toe; nu is jouw bezwaar weerlegd.’",
            "feedback": "Dit verzint een niet genoemde voorziening. Maak zo'n uitbreiding bespreekbaar als verbetering, niet als bewezen deel van het bestaande plan."
          }
        ]
      }
    ],
    "puzzle": {
      "scenario": "Een trainer stelt een korte vaardigheidstoets vóór één module voor. Een collega wijst het plan af als ‘werknemers permanent wantrouwen’.",
      "prompt": "Reconstructeer de casus: scheid reden, conclusie, ongeoorloofde stap en gerichte herstelzin.",
      "categories": [
        "Aangevoerde reden",
        "Conclusie",
        "Ongeoorloofde stap",
        "Gerichte herstelzin"
      ],
      "cards": [
        {
          "text": "De trainer vraagt een korte toets vóór één module.",
          "category": 0
        },
        {
          "text": "Het toetsvoorstel moet worden afgewezen.",
          "category": 1
        },
        {
          "text": "Een beperkte vaardigheidscontrole wordt algemeen wantrouwen.",
          "category": 2
        },
        {
          "text": "Welke vaardigheid controleert de toets en waarom is dat hier nodig?",
          "category": 3
        },
        {
          "text": "Bespreek apart of de toets een onnodige last voor ervaren collega's vormt.",
          "category": 3
        }
      ],
      "explanation": "De afwijzing richt zich op een toegevoegde houding, niet op de beperkte controle. De herstelvragen laten de echte last en relevantie open."
    },
    "writing": {
      "scenario": "Een magazijnteam wil bij één drukke productgroep vaker tellen. De reactie luidt dat iedereen dan voortdurend formulieren moet invullen en dat dit onwerkbaar is.",
      "prompt": "Schrijf minimaal 80 woorden. Herstel de weergave, behoud het sterkste mogelijke lastenbezwaar en formuleer welke gegevens over deze productgroep nodig zijn.",
      "model": "Het voorstel gaat over vaker tellen bij één productgroep, niet over voortdurend registreren door iedereen. Die beperking moet in de reactie terugkomen. Het echte lastenbezwaar kan wel sterk zijn: als de extra telling dezelfde medewerkers op piekmomenten treft, kan zij ander noodzakelijk werk verdringen. Ik vraag daarom hoeveel tellingen worden toegevoegd, wie ze uitvoert en welke bestaande werkzaamheden vervallen. Daarna vergelijk ik de verwachte vermindering van voorraadfouten met die lasten. Een begrensde proef kan een oplossing zijn, maar is niet al bewezen goed. De criticus moet het werkelijke voorstel beoordelen; de voorsteller moet de uitvoerbaarheid onderbouwen.",
      "rubric": [
        "Je behoudt groep, frequentie en omvang van het oorspronkelijke voorstel.",
        "Je laat zien welke vervorming het afwijzende oordeel moet dragen.",
        "Je formuleert het sterkste herkenbare lastenbezwaar zonder nieuwe feiten te verzinnen.",
        "Je noemt concrete gegevens en een beperkte vervolgstap."
      ]
    },
    "illustration": {
      "title": "Een beperking behouden",
      "invitation": "Vergelijk de stap en haar reikwijdte in beide versies.",
      "sourceId": "tindale",
      "variants": [
        {
          "id": "flaw",
          "label": "De stap schiet tekort",
          "caption": "De reactie verwijdert de beperkte duur en bestrijdt daardoor een andere dienstverlening dan werkelijk wordt voorgesteld.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Aangevoerd",
                "text": "Eén uur per dag minder baliebezetting.",
                "tone": "orange"
              },
              {
                "id": "c",
                "label": "Afgeleide claim",
                "text": "Er is straks nooit meer hulp beschikbaar.",
                "tone": "orange"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "rechtvaardigt deze claim niet",
                "kind": "challenge"
              }
            ],
            "legend": "De kaart lokaliseert de betwiste stap. Een zwakke verdediging bewijst niet vanzelf dat de conclusie onwaar is."
          }
        },
        {
          "id": "repair",
          "label": "Gericht herstellen",
          "caption": "Deze herstelversie behoudt de bestaande beperking en maakt het mogelijke toegankelijkheidsbezwaar juist inhoudelijk toetsbaar.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Relevante grond",
                "text": "Tijdens dit uur blijft hulp telefonisch beschikbaar; de bereikbaarheid is nog te toetsen.",
                "tone": "blue"
              },
              {
                "id": "c",
                "label": "Beperkte vervolgstap",
                "text": "Beoordeel of dit alternatief voor de betrokken bezoekers werkt.",
                "tone": "green"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "draagt deze beperkte reactie",
                "kind": "support"
              }
            ],
            "legend": "Deze verbetering behoudt een beperkte conclusie. Controleer de gegevens, de afweging en eventuele tegenargumenten."
          }
        }
      ]
    }
  },
  {
    "slug": "ad-hominem-belediging",
    "name": "Ad hominem: belediging",
    "aliases": [
      "abusive ad hominem",
      "argumentum ad hominem",
      "persoonlijke aanval"
    ],
    "family": "Gesprek en persoon",
    "level": "bachelor",
    "sourceTopic": "personal",
    "mediaIds": [],
    "teaser": "Een onaangename persoon kan een goed argument geven.",
    "criticalQuestion": "Raakt de persoonlijke typering de inhoudelijke claim of alleen de spreker?",
    "sections": [
      {
        "title": "Van een typering naar afwijzing",
        "body": "Bij de beledigende ad hominem wordt een negatieve typering van de spreker gebruikt om diens argument of conclusie af te wijzen. “Hij is arrogant, dus zijn kostenberekening klopt niet” slaat een inhoudelijke controle over. De typering kan waar zijn en toch de berekening niet aantasten. Zoek het beoogde doelwit: waarheid van de cijfers, betrouwbaarheid van een getuigenis of geschiktheid voor een rol. Niet iedere belediging vormt een argument. Een losse scheldnaam kan schadelijk gedrag zijn zonder premisse en conclusie. De argumentatieve fout ontstaat wanneer die naam het inhoudelijke oordeel moet dragen of iemand daarmee als gesprekspartner wordt uitgesloten. Diagnoseer dat verband, niet alleen de onvriendelijke toon.",
        "example": "Een sarcastische presentatie bewijst niet dat de getoonde optelling fout is.",
        "takeaway": "Laat gedrag niet zonder relevante brug de inhoud vervangen."
      },
      {
        "title": "Wanneer persoonsinformatie wél relevant is",
        "body": "Persoonlijke informatie kan redelijk meetellen als de conclusie daadwerkelijk over iemands geschiktheid gaat of als je op diens getuigenis moet vertrouwen. Herhaald, aantoonbaar vervalsen van registraties kan een reden zijn om een ongecontroleerde melding niet zonder tegencontrole te aanvaarden. Dat is smaller dan de conclusie dat alles wat die persoon zegt onwaar is. Een leiderschapsfunctie kan bovendien eisen stellen aan omgang met medewerkers; concreet intimiderend gedrag kan daarvoor relevant zijn. Maak de norm, het bewijs en de verhouding tot de rol zichtbaar. Een bescheiden waarschuwing over vertrouwen is geen vrijbrief voor vernedering. Hetzelfde feit kan voor één vraag relevant zijn en voor een andere irrelevant.",
        "example": "Aantoonbare vervalsing vraagt controle van een nieuw logboek; zij weerlegt geen onafhankelijk nagerekende som.",
        "takeaway": "Controleer waar het argument op de persoon leunt en waar op zelfstandig bewijs."
      },
      {
        "title": "Corrigeer inhoud én omgang",
        "body": "Een goede herstelreactie scheidt twee onderwerpen. Je kunt het onvriendelijke gedrag begrenzen en tegelijk de aangevoerde reden bekijken. “De toon is niet aanvaardbaar; laat ons nu de ontbrekende kostenpost controleren” beschermt het gesprek zonder de inhoud weg te drukken. Het sterkste bezwaar tegen deze scheiding is dat intimidatie een eerlijke beoordeling daadwerkelijk onmogelijk kan maken. Neem dat serieus: spreekbeurten, schriftelijke onderbouwing of een begeleid gesprek kunnen nodig zijn. Dat rechtvaardigt een procedurele maatregel, niet automatisch een oordeel over de waarheid van de claim. Vraag om concrete fouten in de berekening of om bewijs van onbetrouwbaarheid waar getuigenis essentieel is. Houd beide conclusies beperkt en afzonderlijk verantwoord.",
        "example": "Een begeleider stopt onderbrekingen maar laat de begrotingspost alsnog inhoudelijk toetsen.",
        "takeaway": "Een gespreksgrens en een inhoudelijke weerlegging hebben elk hun eigen redenen nodig."
      }
    ],
    "deepDive": {
      "title": "Relevantie verschilt per doelwit",
      "body": "Het woord ad hominem benoemt geen verbod om ooit over mensen te redeneren. Het verwijt betreft de ongepaste overdracht van een persoonskenmerk naar een inhoudelijke claim. Een getuigenis heeft een andere bewijsstructuur dan een controleerbare afleiding: bij de eerste kan eerlijkheid een relevante factor zijn, bij de tweede kunnen de gepresenteerde gegevens onafhankelijk worden nagegaan.\n\nOnderscheid daarom waarheid, aanvaardbaarheid op vertrouwen en deelnamevoorwaarden. Een bron kan onvoldoende betrouwbaar zijn om zonder controle te volgen terwijl haar uitspraak toevallig waar is. Een medewerker kan een goede reden geven en toch een gesprek op een onaanvaardbare manier voeren. Beide beoordelingen kunnen tegelijk kloppen.\n\nEen relevante geloofwaardigheidskritiek vraagt aantoonbaar gedrag, een verband met deze melding en een proportionele conclusie. Een vaag karakteretiket levert die drie niet. Ook de criticus draagt bewijslast voor zijn beschuldiging. Herstel hoeft niemand vrij te pleiten; het maakt zichtbaar welk bewijs welk oordeel daadwerkelijk ondersteunt."
    },
    "starter": {
      "scenario": "Een medewerker toont een ontbrekende post in de begroting. De reactie is: ‘Jij bent altijd zo vervelend.’",
      "prompt": "Wat blijft hiermee onbeantwoord?",
      "answer": 1,
      "options": [
        {
          "text": "Of de medewerker aardig overkomt.",
          "feedback": "De reactie geeft juist een persoonlijke indruk. Die indruk beantwoordt de vraag naar de ontbrekende begrotingspost niet."
        },
        {
          "text": "Of de genoemde begrotingspost werkelijk ontbreekt.",
          "feedback": "Juist: de typering raakt de persoon, terwijl de inhoudelijke melding nog moet worden gecontroleerd."
        },
        {
          "text": "Of iedere begroting onbetrouwbaar is.",
          "feedback": "Dat brede oordeel is niet aangevoerd. Begin met deze concrete post en trek geen conclusie over alle begrotingen."
        }
      ],
      "bridge": "Maak straks apart zichtbaar of je de cijfers, het vertrouwen of het gedrag beoordeelt."
    },
    "inquiry": {
      "scenario": "Een inspecteur meldt dat een nooduitgang geblokkeerd is. Reactie A noemt hem dramatisch. Reactie B toont dat zijn melding de verkeerde locatie noemt en vraagt een nieuwe controle. De inspecteur reageert in beide gesprekken kortaf.",
      "prompt": "Welke reactie kan het bewijs aantasten? Beschrijf daarnaast hoe je het gedrag kunt begrenzen zonder veiligheid automatisch af te wijzen.",
      "model": "Reactie B raakt een gegeven waarvan de melding afhankelijk is: de locatie. Dat kan de conclusie voor deze nooduitgang verzwakken, maar bewijst nog geen veilige situatie. Een juiste nieuwe controle blijft nodig. Reactie A gebruikt een typering zonder te laten zien waarom de doorgang daardoor vrij zou zijn. De kortafheid is een afzonderlijk gesprekspunt. Ik kan vragen om respectvolle communicatie en tegelijk de locatie controleren. Als er gevaar kan zijn, kan een tijdelijke maatregel verstandig blijven. Zo worden toon, bewijskwaliteit en handelingsadvies apart beoordeeld in plaats van elkaar te vervangen.",
      "followUp": "Stel nu dat dezelfde inspecteur eerder aantoonbaar locaties vervalste. Formuleer een beperkte, relevante tegencontrole en vermijd ‘alles is onwaar’."
    },
    "core": {
      "scenario": "Een collega berekent dat een nieuw abonnement €900 meer kost. Een manager zegt dat de collega verwaand is en dat de berekening daarom niet telt.",
      "prompt": "Wat is de beste diagnose?",
      "answer": 2,
      "options": [
        {
          "text": "Een berekening is altijd waar zodra iemand een bedrag noemt.",
          "feedback": "Het noemen van een bedrag bewijst niets. De som en de onderliggende tarieven moeten nog worden gecontroleerd."
        },
        {
          "text": "De typering kan alleen een fout zijn als zij feitelijk onwaar is.",
          "feedback": "Ook een ware typering kan voor de berekening irrelevant zijn. Relevantie vraagt een verband met de inhoudelijke claim."
        },
        {
          "text": "Een persoonskenmerk vervangt een controleerbare kostencontrole.",
          "feedback": "Juist: het argument biedt geen reden waarom de tarieven of optelling onjuist zijn. De onafhankelijke berekening blijft te beoordelen."
        }
      ]
    },
    "assessment": [
      {
        "scenario": "Een teamlid vraagt extra ventilatie en geeft meetgegevens. De reactie luidt: ‘Hij is een zeurpiet, dus zijn conclusie is fout.’",
        "prompt": "Waar schiet de reactie tekort?",
        "answer": 1,
        "options": [
          {
            "text": "Een onvriendelijke uitspraak kan nooit argumentatief worden gebruikt.",
            "feedback": "Zij kan juist als premisse voor een afwijzing worden gebruikt. Dan moet je haar relevantie voor die afwijzing beoordelen."
          },
          {
            "text": "Het karakteretiket weerlegt de aangevoerde metingen niet.",
            "feedback": "Juist: de typering geeft geen inhoudelijke controle van de metingen of de stap naar ventilatie. Een relevante tegenwerping is nog nodig."
          },
          {
            "text": "Door de reactie staat de noodzaak van ventilatie vast.",
            "feedback": "De reactie is zwak, maar daarmee zijn de metingen, normen en maatregelen niet automatisch juist of voldoende."
          }
        ]
      },
      {
        "scenario": "Een kandidaat voor een begeleidende functie heeft aantoonbaar herhaaldelijk teamleden geïntimideerd. De selectiecommissie beoordeelt veilige samenwerking als functie-eis.",
        "prompt": "Waarom kan die informatie meetellen?",
        "answer": 0,
        "options": [
          {
            "text": "Het aangetoonde gedrag raakt een expliciete eis van deze rol.",
            "feedback": "Juist: de conclusie betreft geschiktheid voor een functie waarvoor dit gedrag relevant is. Bewijs en proportionaliteit blijven nodig."
          },
          {
            "text": "Het gedrag bewijst dat iedere technische uitspraak van de kandidaat fout is.",
            "feedback": "Deze overdracht gaat veel te ver. Gedrag kan een functie-eis raken zonder onafhankelijk controleerbare technische informatie te weerleggen."
          },
          {
            "text": "Persoonsinformatie mag alleen worden gebruikt als iedereen de kandidaat onaardig vindt.",
            "feedback": "Populariteit is geen relevante maatstaf voor de functie-eis. De commissie moet concreet gedrag en gevolgen beoordelen."
          }
        ]
      },
      {
        "scenario": "Een boze medewerker wijst een fout in de taakplanning aan en blijft anderen onderbreken.",
        "prompt": "Welke herstelreactie behandelt beide problemen?",
        "answer": 2,
        "options": [
          {
            "text": "‘Je onderbreekt, dus je planningsbezwaar is inhoudelijk weerlegd.’",
            "feedback": "Een gedragsgrens bewijst geen juiste planning. De aangewezen fout vraagt een afzonderlijke inhoudelijke controle."
          },
          {
            "text": "‘Een inhoudelijk bezwaar geeft recht op onbeperkt onderbreken.’",
            "feedback": "Goede redenen heffen eerlijke gespreksvoorwaarden niet op. Anderen moeten hun informatie en bezwaren ook kunnen geven."
          },
          {
            "text": "‘Laat anderen uitspreken; daarna controleren we precies welke taak ontbreekt.’",
            "feedback": "Juist: de reactie begrenst gedrag en bewaart de inhoudelijke toets. Zij behandelt geen van beide als automatisch bewijs voor het andere."
          }
        ]
      }
    ],
    "puzzle": {
      "scenario": "Een inkoper wijst een dubbele factuur aan. Een collega noemt hem moeilijk en wil de melding daarom negeren.",
      "prompt": "Reconstructeer de casus: scheid reden, conclusie, ongeoorloofde stap en gerichte herstelzin.",
      "categories": [
        "Aangevoerde reden",
        "Conclusie",
        "Ongeoorloofde stap",
        "Gerichte herstelzin"
      ],
      "cards": [
        {
          "text": "De inkoper wordt als moeilijk getypeerd.",
          "category": 0
        },
        {
          "text": "De factuurmelding hoeft niet te worden bekeken.",
          "category": 1
        },
        {
          "text": "Een karakteroordeel wordt bewijs tegen een controleerbare registratie.",
          "category": 2
        },
        {
          "text": "Vergelijk factuurnummers, bedragen en de geleverde bestelling.",
          "category": 3
        },
        {
          "text": "Bespreek de omgangsvorm apart van de factuurcontrole.",
          "category": 3
        }
      ],
      "explanation": "De typering kan een gesprekspunt zijn maar vervangt de controle van dubbele betaling niet. De herstelzinnen onderscheiden inhoud en omgang."
    },
    "writing": {
      "scenario": "Een collega pleit voor een andere ploegindeling vanwege overlappende taken. De voorzitter noemt hem luidruchtig en concludeert dat zijn voorstel slecht is.",
      "prompt": "Schrijf minimaal 80 woorden. Scheid gedrag en argument, formuleer één echte inhoudelijke controle en behandel het bezwaar dat zijn gedrag het overleg belemmert.",
      "model": "Luidruchtigheid bewijst niet dat de genoemde taken wel uitvoerbaar overlappen. Eerst wil ik de taakduur, personeelsbezetting en timing controleren. Tegelijk kan luidruchtig onderbreken een eerlijke bespreking belemmeren. Ik stel daarom een vaste beurtverdeling of schriftelijke toelichting voor, zonder het planningsbezwaar alvast af te wijzen. Het sterkste tegenargument tegen de ploegwijziging kan de overdracht tussen groepen zijn; dat raakt de uitvoering en verdient vergelijking. Ook het gedragsoordeel vraagt concrete voorbeelden in plaats van alleen een etiket. Mijn reactie begrenst de omgang en houdt de inhoud open. Pas de feitelijke taakcontrole en afweging kunnen een besluit over de ploegindeling dragen.",
      "rubric": [
        "Je benoemt het persoonlijke kenmerk en de claim die ermee wordt afgewezen.",
        "Je scheidt omgang, betrouwbaarheid en inhoudelijke juistheid.",
        "Je formuleert een echte controle van het planningsargument.",
        "Je begrenst storend gedrag zonder dat als inhoudelijke weerlegging te gebruiken."
      ]
    },
    "illustration": {
      "title": "Gedrag en inhoud scheiden",
      "invitation": "Vergelijk de stap en haar reikwijdte in beide versies.",
      "sourceId": "tindale",
      "variants": [
        {
          "id": "flaw",
          "label": "De stap schiet tekort",
          "caption": "De typering kan een omgangsprobleem aangeven, maar bevat geen controle van tarieven of optelling en weerlegt die berekening niet.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Aangevoerd",
                "text": "De indiener komt arrogant over.",
                "tone": "orange"
              },
              {
                "id": "c",
                "label": "Afgeleide claim",
                "text": "Zijn gecontroleerde kostenberekening is onjuist.",
                "tone": "orange"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "rechtvaardigt deze claim niet",
                "kind": "challenge"
              }
            ],
            "legend": "De kaart lokaliseert de betwiste stap. Een zwakke verdediging bewijst niet vanzelf dat de conclusie onwaar is."
          }
        },
        {
          "id": "repair",
          "label": "Gericht herstellen",
          "caption": "Deze versie wijst een inhoudelijke tekortkoming aan. Het gedrag kan apart worden besproken zonder de rekensom daardoor waar of onwaar te maken.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Relevante grond",
                "text": "De optelling mist aantoonbaar een terugkerende abonnementspost.",
                "tone": "blue"
              },
              {
                "id": "c",
                "label": "Beperkte vervolgstap",
                "text": "Herbereken de kosten voordat je het voorstel beoordeelt.",
                "tone": "green"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "draagt deze beperkte reactie",
                "kind": "support"
              }
            ],
            "legend": "Deze verbetering behoudt een beperkte conclusie. Controleer de gegevens, de afweging en eventuele tegenargumenten."
          }
        }
      ]
    }
  },
  {
    "slug": "ad-hominem-belang",
    "name": "Ad hominem: belang",
    "aliases": [
      "circumstantial ad hominem",
      "argumentum ad hominem circumstantiae",
      "belangenaanval"
    ],
    "family": "Gesprek en persoon",
    "level": "bachelor",
    "sourceTopic": "personal",
    "mediaIds": [],
    "teaser": "Een belang vraagt controle; het bewijst geen onwaarheid.",
    "criticalQuestion": "Welke conclusie over de inhoud wordt werkelijk door het aangetoonde belang gedragen?",
    "sections": [
      {
        "title": "Een motief is geen weerlegging",
        "body": "Een belang kan verklaren waarom iemand een voorstel verdedigt. Het toont niet zonder meer dat de gegeven redenen onjuist zijn. Bij de drogredelijke belangenaanval wordt die stap toch gemaakt: de adviseur verdient aan een aanschaf, dus de aanschaf kan niet voordelig zijn. Dat verwart een mogelijke reden voor selectieve presentatie met bewijs tegen de inhoud. Benoem wat wordt beweerd: een belang, daadwerkelijke vertekening of onwaarheid van de conclusie. Die claims vragen verschillende steun. Een voorstander kan een financieel belang hebben en tegelijk juiste cijfers geven. Een criticus kan zelf een belang hebben en toch een belangrijke fout aanwijzen. Controleer het argument naast de positie van de bron.",
        "example": "Een verkoper ontvangt commissie; daarmee is de levensduur van het apparaat nog niet weerlegd.",
        "takeaway": "Verwar een risico op selectiviteit niet met een aangetoonde inhoudelijke fout."
      },
      {
        "title": "Wanneer een belangencontrole wél redelijk is",
        "body": "Belangen zijn relevant wanneer een conclusie voornamelijk steunt op vertrouwen in de bron, wanneer onafhankelijkheid is geclaimd of wanneer de bron bewijs kon selecteren. Een verborgen commissie kan de geloofwaardigheid van een ongecontroleerde vergelijking verzwakken. Een goede reactie vraagt dan inzage in aannames, ongunstige ervaringen en een onafhankelijke beoordeling. De conclusie blijft voorlopig: vertrouw deze presentatie niet zonder passende controle. Je bewijst daarmee geen bewuste leugen en evenmin het tegendeel van de aanbeveling. Ook normale belangen kunnen legitiem zijn. Een vertegenwoordiger mag voor medewerkers opkomen; die rol maakt diens personeelsgegevens niet automatisch misleidend. Beoordeel het concrete verband tussen belang, toegang tot informatie en claim.",
        "example": "Een adviseur die zich onafhankelijk noemt blijkt door één leverancier betaald; vraag een transparante tegenvergelijking.",
        "takeaway": "Een gerichte controle kan vertrouwen begrenzen zonder de conclusie om te keren."
      },
      {
        "title": "Maak de tegencontrole controleerbaar",
        "body": "Herstel vraagt twee sporen: benoem het belang eerlijk en controleer de relevante gronden. Vraag welke alternatieven zijn meegenomen, welke kosten buiten de berekening vallen en wie het resultaat kan narekenen. Het sterkste bezwaar tegen alleen narekenen is dat de bron zelf de beschikbare gegevens heeft geselecteerd. Een juiste optelling van een eenzijdige selectie kan nog een misleidende vergelijking opleveren. Neem daarom ook de selectieprocedure en ontbrekende gevallen mee. Andersom mag een criticus eindeloos nieuwe eisen niet uitsluitend rechtvaardigen met een vermoeden van belang. Spreek af welke inzage een voorlopig oordeel mogelijk maakt. Kritiek wordt zo een gerichte verbetering van de bewijsroute in plaats van een vermoeden dat nooit kan worden beantwoord.",
        "example": "Vraag naast de som ook waarom juist deze drie offertes en niet het onderhoudscontract zijn vergeleken.",
        "takeaway": "Controleer selectie, berekening en bereik; beschuldigingen krijgen hun eigen bewijslast."
      }
    ],
    "deepDive": {
      "title": "Bronvertrouwen en zelfstandig bewijs",
      "body": "Een belangenargument kan een ondermijning van een bewijsroute zijn: het tast de stap van een bronuitspraak naar voorlopig vertrouwen aan. Het is niet automatisch een weerlegging van de inhoudelijke claim. Als de conclusie daarnaast onafhankelijk wordt gedragen, moet die route apart worden beoordeeld. Een commissie doet een controleerbaar meetresultaat niet verdwijnen.\n\nDe vraag naar vertekening vraagt een mechanisme. Kon de bron gevallen weglaten, uitkomsten definiëren of alternatieven verbergen? Een aantoonbaar belang maakt die controle relevant, maar bewijst nog niet dat een van deze dingen gebeurde. Ook een beschuldiging van misleiding is een eigen standpunt met bewijslast.\n\nEen leider kan rollen zichtbaar maken zonder iedereen verdacht te behandelen. Laat een vertegenwoordiger diens voorkeur uitleggen, vraag om relevante gegevens en leg de uiteindelijke afweging bij een passend besluitproces. Waar iedereen belangen heeft, volgt niet dat alle bewijs gelijkwaardig of waardeloos is. Transparantie helpt controleren; zij vervangt het inhoudelijke werk niet."
    },
    "starter": {
      "scenario": "Een leverancier verdient aan een nieuwe machine. Een collega zegt daarom dat het energieverbruik beslist niet lager kan zijn.",
      "prompt": "Wat volgt uit het verkoopbelang?",
      "answer": 2,
      "options": [
        {
          "text": "Dat ieder getoond energiecijfer onwaar is.",
          "feedback": "Een verkoopbelang kan tot selectieve informatie leiden, maar bewijst geen onwaarheid van ieder cijfer. Controle blijft nodig."
        },
        {
          "text": "Dat we de aanbeveling zonder inzage moeten volgen.",
          "feedback": "Ook dat volgt niet. Juist een belang kan aanleiding geven om de gegevens en de vergelijking onafhankelijk te controleren."
        },
        {
          "text": "Dat passende tegencontrole nodig kan zijn, zonder al het tegendeel te bewijzen.",
          "feedback": "Juist: het belang raakt mogelijk bronvertrouwen. Het energieverbruik zelf vraagt relevante gegevens onder vergelijkbare omstandigheden."
        }
      ],
      "bridge": "Beoordeel nu de concrete route waarlangs een belang de informatie kan vertekenen."
    },
    "inquiry": {
      "scenario": "Een opleider ontvangt betaling per deelnemer en beveelt een langere cursus aan. In versie A presenteert hij alleen een algemene belofte. In versie B levert hij een controleerbare takenlijst waaruit blijkt dat een verplichte vaardigheid in de korte cursus ontbreekt.",
      "prompt": "Welke bewijsroute is in B beschikbaar naast bronvertrouwen? Wat blijft vanwege het belang in beide versies redelijk om te controleren?",
      "model": "In B kan de takenlijst onafhankelijk worden vergeleken met de vereiste vaardigheid. Het belang van de opleider weerlegt die concrete ontbrekende dekking niet. In A rust de aanbeveling sterker op een ongecontroleerde bronbelofte. Beide versies vragen nog controle van selectie en alternatieven: misschien kan de ontbrekende vaardigheid goedkoper apart worden aangeboden. Ik maak daarom het betalingsmodel zichtbaar, controleer de taakdekking en vergelijk uitvoerbare opleidingen. Het belang geeft een reden voor tegencontrole, niet voor de conclusie dat elke langere cursus onnodig is. De uiteindelijke keuze vraagt daarnaast een afweging van kwaliteit, tijd en kosten.",
      "followUp": "Herzie je oordeel als een onafhankelijke docent dezelfde ontbrekende vaardigheid bevestigt. Welke kritiek op de oorspronkelijke aanbeveling blijft nog mogelijk?"
    },
    "core": {
      "scenario": "Een medewerker verdient een bonus als het team meer produceert. Hij toont dat een levering anders te laat wordt. De reactie luidt: ‘Met jouw bonus kan je deadlinebezwaar niet waar zijn.’",
      "prompt": "Welke claim gaat verder dan het belang draagt?",
      "answer": 0,
      "options": [
        {
          "text": "De conclusie dat het getoonde deadlineprobleem daardoor onwaar is.",
          "feedback": "Juist: de bonus kan een reden voor selectiviteit geven, maar de planning en leverdatum moeten inhoudelijk worden gecontroleerd."
        },
        {
          "text": "De vraag of het bonusbelang de presentatie kan beïnvloeden.",
          "feedback": "Dat is een passende beperkte vraag. Zij vraagt een mogelijk mechanisme en bewijst nog geen leugen of verkeerde deadline."
        },
        {
          "text": "De wens om de leverdatum onafhankelijk te controleren.",
          "feedback": "Dat is een gerichte verbetering van de bewijsroute. Het maakt de bron niet bij voorbaat gelijk of ongelijk."
        }
      ]
    },
    "assessment": [
      {
        "scenario": "Een adviseur krijgt betaald bij een softwareaankoop. Een directeur verwerpt daarom ook een onafhankelijk gecontroleerd compatibiliteitsrapport.",
        "prompt": "Wat is de fout in die afwijzing?",
        "answer": 2,
        "options": [
          {
            "text": "Er mag geen vraag over de betaling worden gesteld.",
            "feedback": "De betaling kan relevant zijn voor een aanbeveling en voor transparantie. Zij mag worden besproken met een beperkte conclusie."
          },
          {
            "text": "Betaling maakt elk compatibiliteitsrapport automatisch betrouwbaar.",
            "feedback": "Ook dat gaat te ver. De methode en dekking van het rapport blijven te controleren, los van wie voordeel heeft."
          },
          {
            "text": "Het bronbelang wordt zonder nieuwe grond op onafhankelijk bewijs overgedragen.",
            "feedback": "Juist: de aparte bewijsroute vraagt een eigen beoordeling. Een belang weerlegt een onafhankelijk vastgesteld technisch gegeven niet vanzelf."
          }
        ]
      },
      {
        "scenario": "Een productvergelijker beweert volledig onafhankelijk te zijn maar wordt exclusief door de aanbevolen fabrikant betaald. De ruwe vergelijking is niet beschikbaar.",
        "prompt": "Welke beperkte reactie is redelijk?",
        "answer": 1,
        "options": [
          {
            "text": "Concluderen dat het aanbevolen product zeker het slechtste is.",
            "feedback": "De onjuiste onafhankelijkheidsclaim verzwakt vertrouwen, maar levert geen rangorde van producten. Daarvoor is inhoudelijke vergelijking nodig."
          },
          {
            "text": "De onafhankelijkheidsclaim corrigeren en inzage of onafhankelijke vergelijking vragen.",
            "feedback": "Juist: betaling raakt de geclaimde positie en mogelijk selectie van gegevens. Deze reactie beperkt vertrouwen zonder de productuitkomst te verzinnen."
          },
          {
            "text": "Alle gegevens onbesproken volgen omdat de vergelijker expertise heeft.",
            "feedback": "Expertise heft vragen over onafhankelijkheid en bewijs niet op. De betrouwbaarheid van deze presentatie blijft een eigen controle."
          }
        ]
      },
      {
        "scenario": "Een personeelsvertegenwoordiger waarschuwt voor extra avonddiensten. Hij heeft zelf jonge kinderen en noemt concrete roosteruren.",
        "prompt": "Welke reactie herstelt het gesprek?",
        "answer": 0,
        "options": [
          {
            "text": "‘Je belang is zichtbaar; laten we de genoemde uren en de verdeling over het hele team controleren.’",
            "feedback": "Juist: de reactie erkent de positie en onderzoekt het concrete bewijs en bereik. Zij sluit diens bezwaar niet automatisch uit."
          },
          {
            "text": "‘Wie zelf wordt geraakt mag nooit een bezwaar indienen.’",
            "feedback": "Dat sluit relevante ervaringsinformatie zonder beoordeling uit. Betrokkenheid maakt een roosterbezwaar niet automatisch onjuist."
          },
          {
            "text": "‘Omdat je betrokken bent, moeten jouw belangen altijd voorgaan.’",
            "feedback": "Betrokkenheid bewijst evenmin voorrang. De verdeling vraagt een expliciete afweging van alle relevante lasten en doelen."
          }
        ]
      }
    ],
    "puzzle": {
      "scenario": "Een kok verdient aan catering en toont een lijst met ontbrekende lunchvoorzieningen. De organisator zegt dat dankzij dat belang de lijst waardeloos is.",
      "prompt": "Reconstructeer de casus: scheid reden, conclusie, ongeoorloofde stap en gerichte herstelzin.",
      "categories": [
        "Aangevoerde reden",
        "Conclusie",
        "Ongeoorloofde stap",
        "Gerichte herstelzin"
      ],
      "cards": [
        {
          "text": "De kok ontvangt inkomsten uit catering.",
          "category": 0
        },
        {
          "text": "De lijst met ontbrekende voorzieningen is waardeloos.",
          "category": 1
        },
        {
          "text": "Financieel voordeel wordt bewijs dat concrete voorzieningstekorten niet tellen.",
          "category": 2
        },
        {
          "text": "Controleer de locaties en vergelijk ook oplossingen zonder catering.",
          "category": 3
        }
      ],
      "explanation": "Het belang kan selectie beïnvloeden maar bewijst niet dat vermelde tekorten ontbreken. De herstelzin controleert inhoud en alternatieven."
    },
    "writing": {
      "scenario": "Een verkoper beveelt een duurdere printer aan en toont een besparing op onderhoud. Een inkoper wijst de gehele berekening af omdat de verkoper commissie ontvangt.",
      "prompt": "Schrijf minimaal 80 woorden. Begrens de belangenkritiek, bespreek een mogelijk selectiemechanisme en geef een onafhankelijk controleplan.",
      "model": "De commissie maakt een belangencontrole redelijk, maar bewijst niet dat de onderhoudsbesparing onwaar is. Ik vraag welke storingen, contractjaren en verbruikskosten in de vergelijking zitten. Een mogelijk probleem is dat gunstige jaren wel en extra onderhoud niet worden meegeteld. Dat moet worden aangetoond, niet als leugen verondersteld. Vervolgens laat ik de bedragen narekenen en vergelijk ik een andere leverancier met dezelfde uitgangspunten. Het sterkste bezwaar tegen alleen narekenen is een eenzijdige selectie van kosten; daarom controleer ik ook de ontbrekende posten. Pas daarna weeg ik besparing, aanschafprijs en betrouwbaarheid. Het bronbelang blijft zichtbaar zonder het inhoudelijke oordeel te vervangen.",
      "rubric": [
        "Je scheidt belang, mogelijke vertekening en onwaarheid van de conclusie.",
        "Je noemt een concreet selectiemechanisme zonder misleiding als vaststaand feit te presenteren.",
        "Je geeft een onafhankelijke inhoudelijke controle en een passend alternatief.",
        "Je behoudt een beperkte conclusie en behandelt het sterkste controlebezwaar."
      ]
    },
    "illustration": {
      "title": "Belang en bewijs onderscheiden",
      "invitation": "Vergelijk de stap en haar reikwijdte in beide versies.",
      "sourceId": "tindale",
      "variants": [
        {
          "id": "flaw",
          "label": "De stap schiet tekort",
          "caption": "De bonus kan een controle van selectie en bronvertrouwen rechtvaardigen, maar bewijst niet dat deze kostenpost inhoudelijk fout is.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Aangevoerd",
                "text": "De adviseur krijgt een verkoopbonus.",
                "tone": "orange"
              },
              {
                "id": "c",
                "label": "Afgeleide claim",
                "text": "De genoemde onderhoudskosten zijn onwaar.",
                "tone": "orange"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "rechtvaardigt deze claim niet",
                "kind": "challenge"
              }
            ],
            "legend": "De kaart lokaliseert de betwiste stap. Een zwakke verdediging bewijst niet vanzelf dat de conclusie onwaar is."
          }
        },
        {
          "id": "repair",
          "label": "Gericht herstellen",
          "caption": "Hier draagt een concrete ontbrekende post de gevraagde vergelijking. Het bronbelang kan daarnaast worden vermeld zonder de uitkomst te bepalen.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Relevante grond",
                "text": "Het kostenoverzicht mist aantoonbaar het tweede onderhoudsjaar.",
                "tone": "blue"
              },
              {
                "id": "c",
                "label": "Beperkte vervolgstap",
                "text": "Laat de volledige contractperiode onafhankelijk vergelijken.",
                "tone": "green"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "draagt deze beperkte reactie",
                "kind": "support"
              }
            ],
            "legend": "Deze verbetering behoudt een beperkte conclusie. Controleer de gegevens, de afweging en eventuele tegenargumenten."
          }
        }
      ]
    }
  },
  {
    "slug": "tu-quoque",
    "name": "Tu quoque",
    "aliases": [
      "tu quoque",
      "you too",
      "beroep op hypocrisie",
      "jij ook"
    ],
    "family": "Gesprek en persoon",
    "level": "bachelor",
    "sourceTopic": "personal",
    "mediaIds": [],
    "teaser": "Een inconsequente criticus kan een juiste norm noemen.",
    "criticalQuestion": "Weerlegt de tegenbeschuldiging de norm, of bespreekt zij alleen gelijke toepassing?",
    "sections": [
      {
        "title": "Twee verkeerde handelingen maken geen juiste",
        "body": "Tu quoque betekent “jij ook”. Als iemand kritiek afwijst omdat de criticus vergelijkbaar handelt, moet je vragen welke conclusie daaruit wordt getrokken. “Jij levert ook te laat, dus mijn vertraging is geen probleem” laat het oorspronkelijke gevolg onbesproken. De criticus kan inconsistent zijn terwijl de vertraging werkelijk schade geeft. Ook een juiste regel blijft niet afhankelijk van perfecte naleving door iedere spreker. Reconstructie maakt de verborgen sprong zichtbaar: andermans overtreding wordt toestemming voor mijn overtreding. Dat volgt niet zonder een aanvullende norm over uitzonderingen of behandeling. Houd zowel de oorspronkelijke gedraging als de nieuwe beschuldiging controleerbaar en beoordeel welke vraag het gesprek probeert te beantwoorden.",
        "example": "Een vergeten veiligheidscheck door de leidinggevende maakt een andere vergeten check niet veilig.",
        "takeaway": "Naleving door de criticus en juistheid van de norm zijn aparte vragen."
      },
      {
        "title": "Wanneer een vergelijking wél redelijk is",
        "body": "Een verwijzing naar het gedrag van de criticus kan relevant zijn voor gelijke behandeling, uitvoerbaarheid of diens claim over eigen naleving. Als twee vergelijkbare medewerkers verschillend worden gesanctioneerd, kan een vergelijking een gerichte vraag naar het selectiecriterium stellen. Zij bewijst niet dat de oorspronkelijke gedraging goed was. Ook een eis die de criticus zelf onder dezelfde omstandigheden niet kon uitvoeren kan een uitvoerbaarheidsbezwaar ondersteunen. Controleer daarvoor werkelijk vergelijkbare taken, middelen en bevoegdheden; een oppervlakkige gelijkenis is onvoldoende. Een redelijke reactie benoemt dus haar doel: niet vrijstelling van iedere norm, maar uitleg van toepassing, omstandigheden of dubbele maatstaven. Die eigen claim vraagt ook passende feiten.",
        "example": "Een team vraagt waarom een identieke registratievertraging bij het ene rooster wel en het andere niet wordt bestraft.",
        "takeaway": "Een gelijkheidsvraag kan sterk zijn zonder de oorspronkelijke norm te weerleggen."
      },
      {
        "title": "Herstel zonder vrijbrief",
        "body": "Begin met erkenning of controle van de oorspronkelijke kwestie. “Mijn verslag was te laat; laten we de gevolgen oplossen” houdt de verantwoordelijkheid zichtbaar. Voeg daarna eventueel een apart bezwaar toe: “Wordt dezelfde termijn ook onder vergelijkbare werkdruk toegepast?” Het sterkste bezwaar tegen deze scheiding is dat selectieve handhaving het gesprek zelf oneerlijk maakt. Dan kan het besluit over een sanctie terecht worden uitgesteld tot de vergelijking is bekeken. Dat betekent niet dat de termijn nutteloos is of dat niemand nog hoeft te leveren. Herstel vraagt een gemeenschappelijke norm, relevante uitzonderingen en een passend besluit voor beide gevallen. Vermijd een eindeloze wisseling van beschuldigingen waarin uiteindelijk geen enkele vertraging meer inhoudelijk wordt behandeld.",
        "example": "Bespreek herstel van een te laat dossier én de reden waarom een vergelijkbare collega vrijstelling kreeg.",
        "takeaway": "Toets de norm en haar toepassing; verander inconsistentie niet automatisch in toestemming."
      }
    ],
    "deepDive": {
      "title": "Het doel van de tegenwerping bepaalt haar gewicht",
      "body": "Tu quoque kan verschillende functies hebben. Een norm inhoudelijk afwijzen op grond van het gedrag van de criticus is iets anders dan diens consistentie betwijfelen of ongelijke toepassing aanvechten. Het eerste vraagt een verbinding die vaak ontbreekt; de andere kunnen gericht en relevant zijn.\n\nDe vergelijking moet passen bij de claim. Een leidinggevende met andere bevoegdheden is niet automatisch een identiek geval. Andersom mag een verschil in functie niet zonder uitleg als vrijstelling dienen. Benoem tijd, middelen, risico en afgesproken uitzonderingen voordat je een dubbele maatstaf concludeert.\n\nEen hypocriete spreker kan een ware feitelijke uitspraak geven. Zijn gedrag kan wel diens voorbeeldfunctie of ongestaafde morele superioriteit aantasten. Dat zijn beperktere doelwitten. Een goede reactie onderscheidt daarom de oorspronkelijke verplichting, de mogelijke ongelijke behandeling en de geloofwaardigheid van een specifieke persoonlijke claim. Geen van deze beoordelingen maakt alle andere overbodig. Als er twee echte tekortkomingen zijn, kunnen beide herstel vragen."
    },
    "starter": {
      "scenario": "Een collega wordt gewezen op een ontbrekende controle. Zij reageert dat de leidinggevende vorige week ook een controle vergat.",
      "prompt": "Wat bewijst die reactie nog niet?",
      "answer": 0,
      "options": [
        {
          "text": "Dat haar eigen ontbrekende controle aanvaardbaar of onschadelijk is.",
          "feedback": "Juist: een tweede tekortkoming neemt de gevolgen van de eerste niet weg. Beide gevallen kunnen controle en herstel vragen."
        },
        {
          "text": "Dat de leidinggevende ook een fout kan hebben gemaakt.",
          "feedback": "De reactie stelt juist een tweede fout. Die melding vraagt eigen controle, maar is geen inhoudelijke oplossing van de eerste."
        },
        {
          "text": "Dat gelijke behandeling ooit besproken mag worden.",
          "feedback": "Gelijke behandeling mag juist een relevant onderwerp zijn. De vraag is welke beperkte conclusie de vergelijking werkelijk ondersteunt."
        }
      ],
      "bridge": "Onderzoek straks of de vergelijking een norm weerlegt of een eerlijke toepassingsvraag stelt."
    },
    "inquiry": {
      "scenario": "Een manager eist dagelijkse overdracht. Een medewerker noemt een gemiste overdracht door de manager. In versie A concludeert hij dat dagelijkse overdracht zinloos is. In versie B vraagt hij welke uitzondering geldt en of die onder vergelijkbare omstandigheden ook voor het team beschikbaar is.",
      "prompt": "Welke conclusie blijft dichter bij de genoemde vergelijking? Wat moet je nog weten om ongelijke behandeling vast te stellen?",
      "model": "Versie B gebruikt de vergelijking voor een gerichte toepassingsvraag. Een gemiste overdracht bewijst niet dat overdracht zinloos is, zoals versie A veronderstelt. Voor ongelijke behandeling moet ik weten of de omstandigheden, risico's en afgesproken uitzonderingen overeenkomen. Misschien had de manager een geldige andere route; misschien hanteert zij inderdaad een dubbele maatstaf. Ik beoordeel daarom de gemiste informatie en haar gevolgen, en vraag vervolgens om een controleerbare uitzonderingsregel. De medewerker hoeft de norm niet te verwerpen om een oneerlijke toepassing aan te vechten. Beide overdrachten kunnen inhoudelijke reparatie verdienen.",
      "followUp": "Stel dat de manager publiekelijk beweerde nog nooit een overdracht te missen. Welke afzonderlijke claim wordt nu wel rechtstreeks geraakt?"
    },
    "core": {
      "scenario": "Een voorzitter vraagt correcte reistijdregistratie. Een medewerker toont dat de voorzitter zelf ooit verkeerd registreerde en concludeert dat huidige registratiefouten niet hoeven te worden hersteld.",
      "prompt": "Welke stap is onvoldoende?",
      "answer": 1,
      "options": [
        {
          "text": "Het gesprek bevat informatie over gedrag van de voorzitter.",
          "feedback": "Persoonsinformatie is niet automatisch ongepast. Zij kan de eigen nalevingsclaim of toepassing van regels relevant maken."
        },
        {
          "text": "Een eerdere fout wordt een vrijstelling van herstel voor huidige fouten.",
          "feedback": "Juist: de vergelijking lost de huidige registratie en gevolgen niet op. Een gelijke toepassingsvraag moet afzonderlijk worden geformuleerd."
        },
        {
          "text": "Er kunnen nooit twee registratiefouten tegelijk bestaan.",
          "feedback": "Beide fouten kunnen echt zijn en herstel vragen. De drogreden zit in de conclusie dat de ene fout de andere rechtvaardigt."
        }
      ]
    },
    "assessment": [
      {
        "scenario": "Een docent wordt aangesproken op een onvolledige presentielijst. Hij antwoordt dat de coördinator ook slordig is, dus zijn lijst hoeft niet te worden aangevuld.",
        "prompt": "Welke conclusie gaat te ver?",
        "answer": 2,
        "options": [
          {
            "text": "De coördinator kan ook een onvolledige registratie hebben.",
            "feedback": "Dat is mogelijk en vraagt eigen bewijs. Een tweede probleem is niet op zichzelf een weerlegging van het eerste."
          },
          {
            "text": "Dezelfde volledigheidsnorm kan voor beide rollen gelden.",
            "feedback": "Dat kan redelijk zijn als de gevallen relevant vergelijkbaar zijn. Het vraagt uitleg van verantwoordelijkheden en uitzonderingen."
          },
          {
            "text": "De fout van de ander heft zijn eigen herstelverplichting op.",
            "feedback": "Juist: die vrijstelling is niet onderbouwd. De gevolgen van deze onvolledige lijst moeten alsnog inhoudelijk worden behandeld."
          }
        ]
      },
      {
        "scenario": "Twee teams werken onder aantoonbaar dezelfde deadline en middelen. Alleen één team krijgt een sanctie; het andere niet. De gesanctioneerde groep vraagt naar het onderscheid.",
        "prompt": "Waarom kan de vergelijking redelijk zijn?",
        "answer": 0,
        "options": [
          {
            "text": "Zij vraagt om een relevant criterium voor ongelijke behandeling.",
            "feedback": "Juist: de claim betreft toepassing en de gegeven vergelijkbaarheid is daarvoor relevant. Zij bewijst nog niet dat te laat leveren goed is."
          },
          {
            "text": "Zij bewijst dat geen enkele deadline ooit legitiem kan zijn.",
            "feedback": "Dat algemene oordeel volgt niet. Een nuttige deadline kan ongelijk worden toegepast en toch een inhoudelijke functie hebben."
          },
          {
            "text": "Zij bewijst dat het andere team voortaan alle regels mag negeren.",
            "feedback": "Ook dat volgt niet uit de ongelijkheid. Het doel is een eerlijk criterium en passend herstel, niet uitbreiding van vrijstellingen."
          }
        ]
      },
      {
        "scenario": "Een medewerker zegt bij kritiek op verkeerd sorteren: ‘Jullie doen het ook.’ Er zijn aanwijzingen dat de instructie voor beide groepen onduidelijk is.",
        "prompt": "Welke reactie herstelt het gesprek het best?",
        "answer": 1,
        "options": [
          {
            "text": "‘Omdat jullie fouten maken, is ieder soorteren onnodig.’",
            "feedback": "Deze conclusie verandert een mogelijk instructieprobleem in afwijzing van de hele taak. Dat wordt niet door de gegevens gedragen."
          },
          {
            "text": "‘We corrigeren de huidige fouten en controleren samen of dezelfde onduidelijke instructie beide groepen raakt.’",
            "feedback": "Juist: deze reactie behoudt herstel en benut de vergelijking voor een echt uitvoerbaarheidsprobleem."
          },
          {
            "text": "‘Fouten van leidinggevenden mogen nooit inhoudelijk worden genoemd.’",
            "feedback": "Dat sluit mogelijk relevante informatie uit. Benoem het doel en controleer de vergelijking zonder de oorspronkelijke fout te laten verdwijnen."
          }
        ]
      }
    ],
    "puzzle": {
      "scenario": "Een planner vraagt complete urenregistratie. Een collega zegt dat de planner ook een formulier oversloeg en dat de huidige ontbrekende uren daarom mogen blijven.",
      "prompt": "Reconstructeer de casus: scheid reden, conclusie, ongeoorloofde stap en gerichte herstelzin.",
      "categories": [
        "Aangevoerde reden",
        "Conclusie",
        "Ongeoorloofde stap",
        "Gerichte herstelzin"
      ],
      "cards": [
        {
          "text": "De planner sloeg eerder een formulier over.",
          "category": 0
        },
        {
          "text": "De huidige ontbrekende uren mogen ongecorrigeerd blijven.",
          "category": 1
        },
        {
          "text": "Een tweede overtreding wordt zonder norm een vrijstelling voor de eerste.",
          "category": 2
        },
        {
          "text": "Corrigeer beide registraties en vraag welke uitzonderingsregel geldt.",
          "category": 3
        },
        {
          "text": "Vergelijk bevoegdheden en omstandigheden voordat je dubbele behandeling vaststelt.",
          "category": 3
        }
      ],
      "explanation": "De vergelijking kan verantwoordelijkheid of gelijke toepassing raken. Zij rechtvaardigt de huidige onvolledigheid niet zonder aanvullende gronden."
    },
    "writing": {
      "scenario": "Een manager vraagt een team om gemaakte klantafspraken te bevestigen. Een teamlid antwoordt dat de manager zelf een afspraak vergeten is en wil daarom de eigen vergeten bevestiging niet herstellen.",
      "prompt": "Schrijf minimaal 80 woorden. Behandel beide afspraken, beoordeel een mogelijke dubbele maatstaf en formuleer een reactie zonder vrijbrief.",
      "model": "De vergeten afspraak van de manager maakt de eigen bevestiging niet overbodig. Eerst wil ik de klant alsnog duidelijkheid geven en de gevolgen van beide gemiste afspraken herstellen. Daarna kan de vergelijking een terechte toepassingsvraag opleveren: geldt dezelfde bevestigingsregel bij dezelfde middelen en verantwoordelijkheden? Dat moet worden gecontroleerd voordat ik een dubbele maatstaf vaststel. Het sterkste bezwaar is selectieve handhaving; een eventuele sanctie kan daarom aparte beoordeling vragen. De bevestigingsnorm hoeft daardoor niet onjuist te zijn. Ik vraag een expliciete uitzonderingsregel en dezelfde relevante criteria voor beide gevallen. Zo blijft verantwoordelijkheid bestaan zonder de leidinggevende buiten kritiek te plaatsen.",
      "rubric": [
        "Je onderscheidt norm, naleving en toepassing op vergelijkbare gevallen.",
        "Je legt uit waarom de tweede fout geen automatische vrijstelling oplevert.",
        "Je behandelt selectieve handhaving als mogelijk sterk, apart bezwaar.",
        "Je geeft een concrete herstelreactie voor beide afspraken."
      ]
    },
    "illustration": {
      "title": "Een tweede fout is geen toestemming",
      "invitation": "Vergelijk de stap en haar reikwijdte in beide versies.",
      "sourceId": "tindale",
      "variants": [
        {
          "id": "flaw",
          "label": "De stap schiet tekort",
          "caption": "De vergelijking kan een nalevingsvraag stellen, maar draagt deze vrijstelling niet. De gevolgen van de huidige fout blijven afzonderlijk bestaan.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Aangevoerd",
                "text": "De criticus registreerde vorige week zelf te laat.",
                "tone": "orange"
              },
              {
                "id": "c",
                "label": "Afgeleide claim",
                "text": "Mijn huidige registratie hoeft niet hersteld te worden.",
                "tone": "orange"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "rechtvaardigt deze claim niet",
                "kind": "challenge"
              }
            ],
            "legend": "De kaart lokaliseert de betwiste stap. Een zwakke verdediging bewijst niet vanzelf dat de conclusie onwaar is."
          }
        },
        {
          "id": "repair",
          "label": "Gericht herstellen",
          "caption": "Deze beperkte conclusie behandelt gelijke toepassing op aantoonbaar vergelijkbare gevallen, zonder te beweren dat de registratienorm onjuist is.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Relevante grond",
                "text": "Beide groepen hadden dezelfde taak, deadline en beschikbare middelen.",
                "tone": "blue"
              },
              {
                "id": "c",
                "label": "Beperkte vervolgstap",
                "text": "Vraag naar het criterium voor verschillende sancties.",
                "tone": "green"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "draagt deze beperkte reactie",
                "kind": "support"
              }
            ],
            "legend": "Deze verbetering behoudt een beperkte conclusie. Controleer de gegevens, de afweging en eventuele tegenargumenten."
          }
        }
      ]
    }
  },
  {
    "slug": "genetische-drogreden",
    "name": "Genetische drogreden",
    "aliases": [
      "genetic fallacy",
      "herkomstdrogreden",
      "origin fallacy"
    ],
    "family": "Gesprek en persoon",
    "level": "bachelor",
    "sourceTopic": "personal",
    "mediaIds": [],
    "teaser": "Herkomst verklaart een idee; zij beslist zijn inhoud niet.",
    "criticalQuestion": "Welke relevante verbinding bestaat tussen de oorsprong en de beoordeelde claim?",
    "sections": [
      {
        "title": "Een oordeel op grond van oorsprong",
        "body": "Een genetische drogreden ontstaat wanneer de herkomst van een idee zonder passende inhoudelijke verbinding de waarheid, waarde of geschiktheid ervan moet bepalen. Een voorstel kan uit een oude organisatiecultuur komen en toch nu een nuttige functie hebben. Het kan door een gewaardeerde beweging zijn ontwikkeld en toch slecht passen. De fout werkt dus in beide richtingen: verwerpen vanwege een slechte oorsprong en aanvaarden vanwege een aantrekkelijke oorsprong. Vraag welke claim wordt beoordeeld en wat het herkomstfeit daarvoor doet. “Dit idee ontstond in een crisis” kan verklaren waarom het werd gekozen. Dat bewijst niet dat het onder de huidige omstandigheden goed of verkeerd is.",
        "example": "Een werkinstructie komt van de vorige eigenaar; daarmee staat haar huidige kwaliteit niet vast.",
        "takeaway": "Scheid het ontstaan van een idee van de rechtvaardiging ervan."
      },
      {
        "title": "Wanneer herkomst wél redelijk meetelt",
        "body": "Herkomst kan inhoudelijk relevant zijn wanneer zij de betrouwbaarheid, context of toepassingsvoorwaarden van informatie beïnvloedt. Een meetwaarde uit een verkeerd gekalibreerd apparaat vraagt andere behandeling dan een waarde uit een gecontroleerde meting. Een roosterregel die uitsluitend voor een ander diensttype is ontworpen kan onvoldoende zijn onderbouwd voor deze taak. Benoem dan het mechanisme: foutieve meting, andere omstandigheden of een beperkt oorspronkelijk doel. Het oordeel berust niet alleen op afkomst maar op dat aantoonbare verschil. Historische informatie kan ook precies het onderwerp zijn, bijvoorbeeld wie een afspraak heeft goedgekeurd. Vermijd een te brede conclusie: een ongeschikte oorsprong voor één toepassing maakt alle elementen van het idee niet automatisch waardeloos.",
        "example": "Een oude onderhoudstermijn is voor een ander machinetype vastgesteld; vergelijk belasting en specificaties vóór overdracht.",
        "takeaway": "Geef aan wat de oorsprong concreet aan betrouwbaarheid of toepassing verandert."
      },
      {
        "title": "Herstel het inhoudelijke beoordelingscriterium",
        "body": "Vraag eerst waarom de oorsprong belangrijk zou zijn en breng het gesprek daarna naar de huidige gronden. “Het plan komt uit een andere vestiging; welke taakverschillen maken overdracht riskant?” behandelt het sterkste mogelijke bezwaar zonder een etiket te laten beslissen. De tegenstander kan terecht antwoorden dat de oorspronkelijke doelgroep wezenlijk anders was. Dan moet dat verschil worden verwerkt in een kleinere claim of aangepaste toepassing. Jij hoeft de geschiedenis niet te negeren om haar automatische gewicht af te wijzen. Vergelijk huidige doelen, werking en beperkingen. Laat ook ruimte voor een goed idee uit een slechte context of een slecht idee uit een goede context. Een inhoudelijke beoordeling is geen vrijspraak van die historische context.",
        "example": "Een trainingsmodel uit een andere sector wordt aangepast aan actuele taken in plaats van puur om zijn oorsprong afgewezen.",
        "takeaway": "Een herkomstbezwaar wordt sterk zodra het een relevant verschil onderbouwt."
      }
    ],
    "deepDive": {
      "title": "Verklaring is geen rechtvaardiging",
      "body": "Dezelfde herkomstzin kan in twee gesprekken een andere functie hebben. Als het team vraagt waarom een regel bestaat, kan haar geschiedenis een passende verklaring zijn. Als het vraagt of de regel moet blijven, zijn gevolgen en normen nodig. Een antwoord op de eerste vraag mag niet ongemerkt het tweede oordeel overnemen.\n\nOorsprong kan wel deel uitmaken van een bewijsroute. Een bronverwijzing draagt voorlopig vertrouwen wanneer methode, deskundigheid en omstandigheden daarvoor relevant zijn. Kritiek op die route kan aanvaarding opschorten zonder de uitspraak onwaar te maken. Een onafhankelijke bevestiging moet apart worden bekeken.\n\nWees ook voorzichtig met positieve herkomst. “Ontwikkeld door een innovatieve organisatie” is geen algemene kwaliteitsgarantie. En een voorstel afwijzen als “ouderwets” vraagt uitleg van wat inmiddels veranderde. De naam genetische drogreden betekent hier herkomst, niet erfelijkheid. Diagnoseer de ontbrekende inhoudelijke verbinding en formuleer welke controle de oorsprong wel tot relevant bewijs zou kunnen maken."
    },
    "starter": {
      "scenario": "Een team wil een opslagregel behouden omdat zij ooit door de oprichter bedacht is. Over de huidige ruimte en goederen is niets gezegd.",
      "prompt": "Wat ontbreekt voor behouden?",
      "answer": 1,
      "options": [
        {
          "text": "Bewijs dat de oprichter altijd goede bedoelingen had.",
          "feedback": "Goede bedoelingen kunnen de ontstaansgeschiedenis verklaren, maar bewijzen geen passende opslag onder huidige omstandigheden."
        },
        {
          "text": "Een verband tussen deze regel en de huidige opslagbehoefte.",
          "feedback": "Juist: de oorsprong draagt het praktische oordeel niet vanzelf. De huidige goederen, ruimte en gevolgen moeten worden beoordeeld."
        },
        {
          "text": "De overtuiging dat iedere oude regel slecht is.",
          "feedback": "Dat keert dezelfde fout om. Leeftijd of herkomst maakt een regel niet zonder meer goed of slecht voor deze toepassing."
        }
      ],
      "bridge": "Vergelijk straks oorsprong als verklaring met oorsprong als relevant gegeven in een bewijsroute."
    },
    "inquiry": {
      "scenario": "Een team gebruikt een registratieformulier uit een oude vestiging. In versie A wil iemand het weggooien omdat de voormalige eigenaar een slechte reputatie heeft. In versie B toont iemand dat het formulier geen veld heeft voor een inmiddels verplichte taakcontrole.",
      "prompt": "Welke kritiek raakt de huidige geschiktheid? Leg uit waarom de eerste oorsprongsinformatie niet dezelfde conclusie draagt.",
      "model": "Versie B wijst een concrete ontbrekende functie aan en verbindt die met de huidige taak. Dat kan aanpassing of vervanging rechtvaardigen. De slechte reputatie van de voormalige eigenaar in versie A bewijst niet dat dit formulier de vereiste informatie mist. Ik kan de geschiedenis bespreken zonder haar het inhoudelijke oordeel te laten bepalen. De controle richt zich op actuele doelen, ontbrekende velden en beschikbare alternatieven. Misschien zijn delen van het oude formulier goed bruikbaar. Een beperkte aanpassing kan daarom voldoende zijn. Herkomst wordt relevant wanneer zij een aantoonbaar verschil in ontwerp of betrouwbaarheid uitlegt, niet alleen een indruk van de maker oproept.",
      "followUp": "Wat verandert als het formulier aantoonbaar ontworpen was om fouten te verbergen? Formuleer een concrete controle, geen totale veroordeling op naam."
    },
    "core": {
      "scenario": "Een organisatie wil een eenvoudige overdrachtslijst schrappen: zij is tijdens een vroegere crisis ontstaan. De lijst bevat nog relevante taakmeldingen.",
      "prompt": "Welke vraag herstelt de beoordeling?",
      "answer": 2,
      "options": [
        {
          "text": "‘Hoe maken we duidelijk dat alles uit een crisis slecht is?’",
          "feedback": "De oorsprong bewijst geen slechte huidige functie. Zo'n algemene regel herhaalt juist de ontoereikende overdracht van geschiedenis naar kwaliteit."
        },
        {
          "text": "‘Wie de crisis heeft meegemaakt moet over iedere huidige lijst beslissen.’",
          "feedback": "Ervaring kan helpen de context te begrijpen, maar bepaalt de inhoudelijke geschiktheid niet zonder controle van actuele taken."
        },
        {
          "text": "‘Welke huidige taak ondersteunt de lijst, en welke lasten geeft zij nu?’",
          "feedback": "Juist: deze vraag beoordeelt werking en kosten in de actuele context. De crisisherkomst kan daarbij uitleg geven zonder de uitkomst vooraf te beslissen."
        }
      ]
    },
    "assessment": [
      {
        "scenario": "Een serviceregel is overgenomen van een bedrijf dat later failliet ging. Een team concludeert dat de regel daarom nooit kan werken.",
        "prompt": "Welke stap is onvoldoende?",
        "answer": 0,
        "options": [
          {
            "text": "Het faillissement wordt zonder werkingsverband op deze regel overgedragen.",
            "feedback": "Juist: een bedrijfsuitkomst kan allerlei oorzaken hebben. Deze specifieke regel vraagt een eigen beoordeling van werking en toepassing."
          },
          {
            "text": "De geschiedenis van het bedrijf wordt überhaupt genoemd.",
            "feedback": "Geschiedenis kan relevante omstandigheden bevatten. Het probleem is haar gebruik als automatisch bewijs tegen deze regel."
          },
          {
            "text": "Een regel mag nooit in een andere organisatie worden gebruikt.",
            "feedback": "Overdracht kan passend of ongeschikt zijn. Daarvoor moet je doelen, omstandigheden en relevante verschillen vergelijken."
          }
        ]
      },
      {
        "scenario": "Een temperatuurmeting blijkt afkomstig uit een sensor waarvan juist op dat moment de kalibratie defect was.",
        "prompt": "Waarom is herkomstkritiek hier relevant?",
        "answer": 2,
        "options": [
          {
            "text": "Omdat iedere meting uit een machine onjuist moet zijn.",
            "feedback": "Dat algemene oordeel volgt niet. Het aangetoonde kalibratieprobleem raakt deze meting en vraagt gerichte tegencontrole."
          },
          {
            "text": "Omdat een defect apparaat het tegendeel van zijn aflezing bewijst.",
            "feedback": "Onbetrouwbaarheid maakt de aflezing geen bewijs voor de tegenovergestelde temperatuur. Een nieuwe meting is nodig."
          },
          {
            "text": "Omdat een concreet bronprobleem de betrouwbaarheid van deze meting aantast.",
            "feedback": "Juist: er is een werkingsverband tussen kalibratie en aflezing. Het oordeel berust op dat verband, niet alleen op de naam van de bron."
          }
        ]
      },
      {
        "scenario": "Een veiligheidsinstructie heet ‘ouderwets’. Er zijn inmiddels andere materialen en machines in gebruik.",
        "prompt": "Welke herstelreactie is het sterkst?",
        "answer": 1,
        "options": [
          {
            "text": "‘Een oude instructie kan nooit relevante onderdelen bevatten.’",
            "feedback": "Dat brede oordeel wordt niet gedragen door leeftijd. Vergelijk welke onderdelen door de gewijzigde werkzaamheden worden geraakt."
          },
          {
            "text": "‘Welke gewijzigde materialen maken welke instructiestap ongeschikt?’",
            "feedback": "Juist: deze vraag maakt het historische bezwaar inhoudelijk. Zij laat bruikbare onderdelen behouden en vraagt bewijs voor noodzakelijke aanpassing."
          },
          {
            "text": "‘Omdat de instructie lang meeging, moet zij altijd blijven.’",
            "feedback": "Lang bestaan kan verschillende oorzaken hebben. Het bewijst niet dat de instructie passend blijft bij veranderd materiaal."
          }
        ]
      }
    ],
    "puzzle": {
      "scenario": "Een baliemedewerker stelt een wachtnummer voor. Een collega zegt dat het idee uit een onaardige vorige managementperiode komt en dus klanten niet helpt.",
      "prompt": "Reconstructeer de casus: scheid reden, conclusie, ongeoorloofde stap en gerichte herstelzin.",
      "categories": [
        "Aangevoerde reden",
        "Conclusie",
        "Ongeoorloofde stap",
        "Gerichte herstelzin"
      ],
      "cards": [
        {
          "text": "Het wachtnummer werd in de vorige managementperiode bedacht.",
          "category": 0
        },
        {
          "text": "Het wachtnummer helpt klanten niet.",
          "category": 1
        },
        {
          "text": "Een oordeel over de periode wordt bewijs tegen de huidige werking.",
          "category": 2
        },
        {
          "text": "Vergelijk wachttijd, toegankelijkheid en fouten met en zonder nummers.",
          "category": 3
        }
      ],
      "explanation": "De geschiedenis verklaart mogelijk waarom het idee weerstand oproept, maar beslist niet of het huidige klantcontact verbetert."
    },
    "writing": {
      "scenario": "Een team wil een feedbackmethode niet gebruiken omdat zij afkomstig is uit een commerciële training. De methode bestaat uit concrete observaties, gevolgen en een verzoek.",
      "prompt": "Schrijf minimaal 80 woorden. Beoordeel herkomst en inhoud apart en geef het sterkste mogelijke contextbezwaar een passende toets.",
      "model": "Dat de methode uit een commerciële training komt, bewijst niet dat concrete observaties of verzoeken onbruikbaar zijn. Ik beoordeel of zij in deze werksituatie duidelijkheid geeft en ruimte laat voor tegenspraak. Een sterk contextbezwaar is dat een verkoopgerichte methode druk kan uitoefenen of de rolverdeling negeert. Daarvoor moet worden aangewezen welke stap dat doet en onder welke omstandigheden. Ik zou voorbeelden vergelijken en een vrijwillige oefening gebruiken om die vraag te toetsen. De commerciële oorsprong blijft transparant, maar bepaalt het oordeel niet. Een nuttig onderdeel kan worden behouden terwijl een ongepaste toepassing wordt aangepast. Beoordeling van de methode is geen algemene goedkeuring van de aanbieder.",
      "rubric": [
        "Je onderscheidt verklaring van herkomst en inhoudelijke rechtvaardiging.",
        "Je lokaliseert een relevant contextbezwaar met een concreet mechanisme.",
        "Je beoordeelt onderdelen en toepassing zonder een algemene herkomstgarantie.",
        "Je geeft een controleerbare vervolgstap met open uitkomst."
      ]
    },
    "illustration": {
      "title": "De oorsprong draagt niet ieder oordeel",
      "invitation": "Vergelijk de stap en haar reikwijdte in beide versies.",
      "sourceId": "tindale",
      "variants": [
        {
          "id": "flaw",
          "label": "De stap schiet tekort",
          "caption": "De historische aanleiding verklaart het ontstaan maar bevat geen vergelijking van de huidige taken of effecten en draagt de afwijzing niet.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Aangevoerd",
                "text": "De taaklijst is bedacht tijdens een oude crisis.",
                "tone": "orange"
              },
              {
                "id": "c",
                "label": "Afgeleide claim",
                "text": "De taaklijst kan nu geen nut hebben.",
                "tone": "orange"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "rechtvaardigt deze claim niet",
                "kind": "challenge"
              }
            ],
            "legend": "De kaart lokaliseert de betwiste stap. Een zwakke verdediging bewijst niet vanzelf dat de conclusie onwaar is."
          }
        },
        {
          "id": "repair",
          "label": "Gericht herstellen",
          "caption": "Deze controle raakt de huidige taakdekking rechtstreeks. Zij geeft een beperkte verbetergrond zonder de hele historische oorsprong te veroordelen.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Relevante grond",
                "text": "Een huidige verplichte overdrachtstaak ontbreekt aantoonbaar op de lijst.",
                "tone": "blue"
              },
              {
                "id": "c",
                "label": "Beperkte vervolgstap",
                "text": "Vul deze taak aan en beoordeel de overige onderdelen apart.",
                "tone": "green"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "draagt deze beperkte reactie",
                "kind": "support"
              }
            ],
            "legend": "Deze verbetering behoudt een beperkte conclusie. Controleer de gegevens, de afweging en eventuele tegenargumenten."
          }
        }
      ]
    }
  },
  {
    "slug": "schuld-door-associatie",
    "name": "Schuld door associatie",
    "aliases": [
      "guilt by association",
      "association fallacy",
      "besmetting door verbondenheid"
    ],
    "family": "Gesprek en persoon",
    "level": "bachelor",
    "sourceTopic": "personal",
    "mediaIds": [],
    "teaser": "Een slechte reputatie gaat niet automatisch over op iedereen die ermee verbonden is.",
    "criticalQuestion": "Welke verantwoordelijkheid of bewijsroute verbindt de associatie met deze claim?",
    "sections": [
      {
        "title": "Een verbinding wordt besmetting",
        "body": "Bij schuld door associatie krijgt iemand of diens argument een negatief oordeel omdat er een echte of vermeende band bestaat met een afgekeurde groep. “Deze adviseur bezocht hun bijeenkomst, dus zijn voorstel is ondeugdelijk” laat de inhoudelijke beoordeling weg. Controleer eerst of de associatie klopt en wat zij precies inhoudt. Aanwezigheid, samenwerking, lidmaatschap en beslissingsmacht zijn verschillende relaties. Zelfs een echte band draagt niet automatisch iedere negatieve eigenschap over. Een groep kan slechte praktijken én enkele juiste ideeën hebben; een lid kan bepaalde praktijken afwijzen. De fout ontstaat als de groepsreputatie zonder passend verband het oordeel over deze persoon, verantwoordelijkheid of claim moet beslissen.",
        "example": "Een drukker werkt voor een controversiële klant; daarmee zijn zijn offertebedragen nog niet onjuist.",
        "takeaway": "Specificeer de band en het doelwit vóór je eigenschappen overdraagt."
      },
      {
        "title": "Wanneer een band wél redelijk meetelt",
        "body": "Een associatie kan relevant zijn wanneer zij aantoonbare verantwoordelijkheid, gedeelde processen of belangen blootlegt. Als een bestuurder zelf het besproken beleid goedkeurde, is dat meer dan een toevallige band. Als twee rapporten dezelfde onbetrouwbare bron overnemen, kan hun gedeelde bewijsroute belangrijk zijn. Een leverancier die daadwerkelijk dezelfde gebrekkige productiecontrole gebruikt vraagt gerichte aandacht. Benoem het concrete mechanisme en beperk de conclusie tot wat daardoor geraakt wordt. Een netwerkband kan ook aanleiding voor controle geven zonder al schuld te bewijzen. Een redelijke beoordeling laat uitleg, verschillende rollen en tegenbewijs toe. Zij gebruikt reputatie niet als vervanging van feiten over deelname, besluitmacht of de aangeboden gegevens.",
        "example": "Een medewerker tekende aantoonbaar de onjuiste registratie goed; kritiek richt zich op die eigen handeling.",
        "takeaway": "Verantwoordelijkheid vraagt meer dan nabijheid; een gedeelde foutbron vraagt een aantoonbare route."
      },
      {
        "title": "Herstel met rollen en afzonderlijke gronden",
        "body": "Vraag hoe de beweerde band de inhoudelijke beoordeling verandert. “Welk besluit nam deze persoon zelf, en welk onderdeel van het voorstel is daardoor onbetrouwbaar?” maakt een algemene verdenking toetsbaar. Het sterkste tegenargument is dat netwerkrelaties wel degelijk informatie kunnen geven over controle, afhankelijkheid of prikkels. Dat mag niet worden genegeerd. Onderzoek de specifieke rol en bekijk onafhankelijke bewijsroutes. Als een voorstel zelfstandig goed onderbouwd is, moet dat bewijs apart worden behandeld. Als gezamenlijke controle een concrete fout verspreidt, moet juist die route worden hersteld. Een leider geeft daarom ruimte voor relevante verbanden zonder hele personen of voorstellen op reputatie te classificeren. Ook een positieve groepsnaam garandeert geen goede inhoud.",
        "example": "Vraag naar gedeelde productcontroles in plaats van iedere oud-medewerker bij voorbaat uit te sluiten.",
        "takeaway": "Maak een verband inhoudelijk: rol, handeling, mechanisme en beperkte conclusie."
      }
    ],
    "deepDive": {
      "title": "Associatie, verantwoordelijkheid en bronafhankelijkheid",
      "body": "Deze fout kan samengaan met een ad hominem of herkomstdrogreden, maar het onderscheid helpt: de negatieve eigenschap wordt via een band met een derde partij overgedragen. Noteer daarom drie onderdelen: wie wordt beoordeeld, waarmee is diegene verbonden en waarom zou de band voor de conclusie tellen?\n\nNiet iedere netwerkvraag is onredelijk. Gedeelde zeggenschap kan verantwoordelijkheid verklaren; een gedeelde gegevensbron kan onafhankelijkheid ondermijnen. Beide verschillen van een ongunstige indruk door nabijheid. Het bewijs moet de relevante relatie vaststellen en laten zien hoe zij deze claim raakt.\n\nEen echte samenwerking kan bovendien uiteenlopende bijdragen bevatten. Een conclusie over collectieve verantwoordelijkheid vraagt daarom afspraken, bevoegdheden en eigen handelingen. Vermijd de omgekeerde overdrijving dat verbondenheid nooit iets betekent. Herstel maakt juist de betekenis precies. Dezelfde discipline geldt bij prestige: aansluiting bij een gerenommeerde organisatie is geen garantie dat elke uitspraak klopt. Beoordeel de grond die voor deze conclusie werkelijk beschikbaar is."
    },
    "starter": {
      "scenario": "Een medewerker bezocht een netwerkavond waar ook een beruchte leverancier aanwezig was. Een collega verwerpt daarom haar trainingsvoorstel.",
      "prompt": "Welke verbinding ontbreekt?",
      "answer": 2,
      "options": [
        {
          "text": "De zekerheid dat op netwerkavonden nooit goede ideeën ontstaan.",
          "feedback": "Die zekerheid is niet relevant en ook niet gegeven. Een bijeenkomst kan goede en slechte informatie bevatten."
        },
        {
          "text": "De veronderstelling dat ieder aanwezig persoon hetzelfde beleid verdedigt.",
          "feedback": "Die veronderstelling is juist het probleem: aanwezigheid toont niet automatisch gedeeld beleid of eigen verantwoordelijkheid."
        },
        {
          "text": "Een relevante band tussen de aanwezigheid en een fout in dit voorstel.",
          "feedback": "Juist: een gedeelde bijeenkomst beslist de inhoud niet. Vraag welke handeling, afhankelijkheid of informatiebron dit voorstel werkelijk raakt."
        }
      ],
      "bridge": "Beoordeel nu of een band louter nabijheid toont of een concrete verantwoordelijkheid verklaart."
    },
    "inquiry": {
      "scenario": "Een planner werkte vroeger bij een organisatie met onbetrouwbare rapportages. In versie A wordt zijn huidige schema alleen vanwege die baan afgewezen. In versie B blijkt het schema dezelfde aantoonbaar vervalste gegevens uit die organisatie te gebruiken.",
      "prompt": "Wat maakt de band in versie B relevanter? Beschrijf hoe je voorkomt dat de conclusie alsnog alle uitspraken van de planner besmet.",
      "model": "In B is een concrete bewijsroute vastgesteld: het huidige schema gebruikt gegevens die aantoonbaar zijn vervalst. Dat kan het schema en de daarop gebaseerde aanbeveling ondermijnen. In A is alleen een vroegere baan genoemd; die bewijst niet dat de huidige gegevens dezelfde fout hebben. Ik vraag daarom welke gegevens worden gebruikt, wie ze controleerde en welke conclusies ervan afhankelijk zijn. Een nieuwe, onafhankelijke telling kan een afzonderlijke route geven. Ook bij een echte foutbron blijft de conclusie beperkt tot getroffen onderdelen. De planner kan andere juiste informatie geven; een algemene veroordeling vraagt veel meer dan deze associatie.",
      "followUp": "Herzie je kaart als de planner de oude gegevens juist kritisch corrigeerde. Welke associatie blijft, en welk negatief oordeel volgt niet meer?"
    },
    "core": {
      "scenario": "Een bouwteam verwerpt een materiaalvoorstel omdat de indiener ooit op dezelfde beurs stond als een bedrijf met slechte veiligheidspraktijken.",
      "prompt": "Wat moet de criticus aantonen?",
      "answer": 0,
      "options": [
        {
          "text": "Hoe die specifieke band de materiaalclaim of een eigen verantwoordelijkheid raakt.",
          "feedback": "Juist: nabijheid geeft niet vanzelf dezelfde productfout. Een relevant gedeeld proces, gegeven of besluit zou de band inhoudelijk kunnen maken."
        },
        {
          "text": "Dat iedere beursdeelnemer noodzakelijk dezelfde veiligheidsnorm gebruikt.",
          "feedback": "Dat is een ongefundeerde algemene overdracht. Rollen en processen kunnen verschillen en moeten concreet worden vastgesteld."
        },
        {
          "text": "Dat veiligheid nooit een reden voor afwijzing mag zijn.",
          "feedback": "Veiligheid is juist relevant. De criticus moet het veiligheidsbezwaar verbinden met dit materiaal of de concrete verantwoordelijkheid."
        }
      ]
    },
    "assessment": [
      {
        "scenario": "Een kandidaat gebruikt een methode die ook door een onbetrouwbare concurrent wordt gebruikt. De commissie noemt daarmee al zijn werkwijzen onbetrouwbaar.",
        "prompt": "Welke stap schiet tekort?",
        "answer": 1,
        "options": [
          {
            "text": "Het gebruik van een gedeelde methode kan nooit worden vergeleken.",
            "feedback": "Een gedeelde methode kan relevant zijn als hetzelfde gebrek wordt aangetoond. Vergelijken is niet op zichzelf de fout."
          },
          {
            "text": "De reputatie van de concurrent wordt algemeen overgedragen zonder concrete fout.",
            "feedback": "Juist: gedeeld gebruik bewijst niet dat de methode dezelfde fout heeft of dat alle werkwijzen van de kandidaat onbetrouwbaar zijn."
          },
          {
            "text": "De kandidaat moet daardoor automatisch de beste methode hebben.",
            "feedback": "Een gebrekkige afwijzing bewijst geen goede methode. De inhoud en toepassingsvoorwaarden blijven zelfstandig te toetsen."
          }
        ]
      },
      {
        "scenario": "Een afdelingshoofd ondertekende aantoonbaar de instructie om verplichte controles over te slaan. De bespreking gaat over zijn eigen verantwoordelijkheid voor die instructie.",
        "prompt": "Waarom is dit meer dan schuld door associatie?",
        "answer": 2,
        "options": [
          {
            "text": "Iedere leidinggevende is verantwoordelijk voor alle denkbare fouten.",
            "feedback": "Die ruime conclusie volgt niet. De casus geeft juist een specifieke eigen handeling die aan deze instructie is verbonden."
          },
          {
            "text": "De reputatie van de afdeling maakt verder bewijs overbodig.",
            "feedback": "Reputatie vervangt geen bewijs van handeling en bevoegdheid. De ondertekening en haar betekenis moeten correct worden vastgesteld."
          },
          {
            "text": "De kritiek betreft een aangetoonde eigen bijdrage aan het besproken besluit.",
            "feedback": "Juist: er is een concrete verantwoordelijkheidsroute, geen loutere nabijheid tot anderen. De conclusie moet wel binnen die bijdrage blijven."
          }
        ]
      },
      {
        "scenario": "Een nieuwe coach was ooit lid van een omstreden opleidingsnetwerk. Je wilt de bruikbaarheid van haar oefeningen beoordelen.",
        "prompt": "Welke herstelvraag is het meest gericht?",
        "answer": 0,
        "options": [
          {
            "text": "‘Welke oefenstap is problematisch, en gebruikt zij daarbij dezelfde ongecontroleerde bron?’",
            "feedback": "Juist: de vraag maakt een eventueel gedeeld gebrek toetsbaar en laat onafhankelijke goede onderdelen apart beoordelen."
          },
          {
            "text": "‘Hoe bewijzen we dat elk voormalig lid voor altijd dezelfde overtuiging houdt?’",
            "feedback": "Dat veronderstelt een algemene overdracht zonder bewijs. Een vroegere band en een huidige werkwijze kunnen verschillen."
          },
          {
            "text": "‘Waarom zou een netwerkband iedere huidige controle onmogelijk maken?’",
            "feedback": "Deze reactie behandelt verbondenheid zelf als een totaalbelemmering. Vraag juist naar controleerbare huidige handelingen en gegevens."
          }
        ]
      }
    ],
    "puzzle": {
      "scenario": "Een inkoper wil een offerte afwijzen omdat de aanbieder een magazijn deelt met een bedrijf dat klanten misleidde. Over de offerte zelf is niets gecontroleerd.",
      "prompt": "Reconstructeer de casus: scheid reden, conclusie, ongeoorloofde stap en gerichte herstelzin.",
      "categories": [
        "Aangevoerde reden",
        "Conclusie",
        "Ongeoorloofde stap",
        "Gerichte herstelzin"
      ],
      "cards": [
        {
          "text": "De aanbieder deelt een magazijn met het bekritiseerde bedrijf.",
          "category": 0
        },
        {
          "text": "Deze offerte kan niet kloppen.",
          "category": 1
        },
        {
          "text": "Een gedeelde locatie wordt bewijs van dezelfde misleiding.",
          "category": 2
        },
        {
          "text": "Controleer rechtspersoon, afspraken, prijzen en eventuele gedeelde processen.",
          "category": 3
        }
      ],
      "explanation": "Een gedeelde locatie kan een controlevraag oproepen. Zij bewijst geen overgenomen misleiding zonder een relevante zakelijke of bewijsroute."
    },
    "writing": {
      "scenario": "Een team verwerpt een presentatie over toegankelijkheid omdat de spreker aan een organisatie is verbonden waarvan één ander lid onjuiste informatie verspreidde.",
      "prompt": "Schrijf minimaal 80 woorden. Reconstrueer de associatiestap en formuleer het sterkste legitieme controlebezwaar met een beperkte conclusie.",
      "model": "De onjuiste informatie van een ander lid bewijst niet dat deze spreker dezelfde gegevens gebruikt. Ik vraag eerst welke band bestaat: gezamenlijk materiaal, eigen verantwoordelijkheid of alleen lidmaatschap. Het sterkste controlebezwaar zou een gedeelde foutieve bron zijn. Dan moet worden aangewezen welke toegankelijkheidsclaim daarvan afhankelijk is. Ik controleer juist die gegevens en zoek onafhankelijke bevestiging. Als de bron fout blijkt, wordt de betrokken claim zwakker; dat maakt niet alle oefeningen onbruikbaar. De presentatie verdient beoordeling op huidige inhoud en methode. Een organisatieband kan transparantie vragen, maar mag afzonderlijke uitspraken niet zonder bewijs met andermans fout besmetten.",
      "rubric": [
        "Je specificeert persoon, derde partij en aard van de band.",
        "Je lokaliseert de ongefundeerde overdracht naar deze claim.",
        "Je formuleert een concreet gedeeld mechanisme als toetsbaar bezwaar.",
        "Je behoudt een beperkte conclusie en beoordeelt onafhankelijke gronden apart."
      ]
    },
    "illustration": {
      "title": "Nabijheid of een echte foutbron?",
      "invitation": "Vergelijk de stap en haar reikwijdte in beide versies.",
      "sourceId": "tindale",
      "variants": [
        {
          "id": "flaw",
          "label": "De stap schiet tekort",
          "caption": "De groepsband draagt geen automatische overdracht van andermans fout. De eigen gegevens en verantwoordelijkheid blijven te toetsen.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Aangevoerd",
                "text": "De spreker is lid van een groep met één onbetrouwbaar lid.",
                "tone": "orange"
              },
              {
                "id": "c",
                "label": "Afgeleide claim",
                "text": "Zijn eigen voorstel is daarom onwaar.",
                "tone": "orange"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "rechtvaardigt deze claim niet",
                "kind": "challenge"
              }
            ],
            "legend": "De kaart lokaliseert de betwiste stap. Een zwakke verdediging bewijst niet vanzelf dat de conclusie onwaar is."
          }
        },
        {
          "id": "repair",
          "label": "Gericht herstellen",
          "caption": "Deze versie stelt een gedeelde bewijsroute vast. De kritiek blijft beperkt tot de getroffen gegevens en draagt geen algemene veroordeling van alle groepsleden.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Relevante grond",
                "text": "Dit voorstel gebruikt aantoonbaar dezelfde vervalste registratie.",
                "tone": "blue"
              },
              {
                "id": "c",
                "label": "Beperkte vervolgstap",
                "text": "Controleer welke conclusies van die registratie afhangen.",
                "tone": "green"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "draagt deze beperkte reactie",
                "kind": "support"
              }
            ],
            "legend": "Deze verbetering behoudt een beperkte conclusie. Controleer de gegevens, de afweging en eventuele tegenargumenten."
          }
        }
      ]
    }
  },
  {
    "slug": "putvergiftigen",
    "name": "Putvergiftigen",
    "aliases": [
      "poisoning the well",
      "pre-emptive ad hominem",
      "vooraf diskwalificeren"
    ],
    "family": "Gesprek en persoon",
    "level": "bachelor",
    "sourceTopic": "personal",
    "mediaIds": [],
    "teaser": "Sluit toekomstige argumenten niet op voorhand af met een etiket.",
    "criticalQuestion": "Welke controleerbare reden rechtvaardigt de voorafgaande uitsluiting van deze bijdragen?",
    "sections": [
      {
        "title": "De spreker verliest vóór het argument",
        "body": "Putvergiftigen betekent dat een negatieve typering toekomstige bijdragen al ongeloofwaardig moet maken voordat je hun inhoud ziet. “Wat zij straks ook zegt, zij verdedigt altijd haar afdeling” zet het gesprek dicht. De fout is breder dan een bezwaar tegen één gegeven: mogelijke antwoorden verliezen op voorhand hun waarde. Let op woorden als altijd, alles en hoe dan ook, maar diagnoseer de functie en niet alleen de woorden. Een spreker kan eerdere fouten hebben gemaakt zonder dat iedere volgende uitspraak onwaar is. De andere partij moet de relevantie en reikwijdte van haar wantrouwen onderbouwen. Ook een beleefd geformuleerde voorafgaande diskwalificatie kan kritische beoordeling blokkeren.",
        "example": "Een voorzitter kondigt aan dat elk toekomstig bezwaar van een team slechts weerstand is.",
        "takeaway": "Voorafgaand wantrouwen vraagt een gerichte grond en mag inhoudelijke controle niet onmogelijk maken."
      },
      {
        "title": "Wanneer voorafgaande voorzichtigheid wél redelijk is",
        "body": "Een waarschuwing vooraf kan passend zijn als zij een concrete bewijsroute begrenst. Aantoonbare manipulatie van een registratie kan reden geven om nieuwe meldingen uit dezelfde ongecontroleerde route te verifiëren. Een moderator mag bovendien duidelijke gespreksvoorwaarden handhaven, zoals geen dreigementen of herhaald verstoren. Deze maatregelen verschillen van de claim dat niets van iemand inhoudelijk kan kloppen. Benoem het betrokken gedrag, de getroffen informatie en wat herstel van vertrouwen mogelijk maakt. Een eerlijke regel laat onafhankelijke gegevens en passende antwoorden toe. Zelfs een bekend belang maakt niet iedere bijdrage ongeldig. Een procedurele beperking kan ernstig maar toch proportioneel zijn als zij veilig deelnemen mogelijk maakt en inhoudelijke alternatieven bewaart.",
        "example": "Een bron die gegevens vervalste mag actuele cijfers via een onafhankelijke controle alsnog laten beoordelen.",
        "takeaway": "Voorzichtigheid wordt redelijker als zij specifiek, proportioneel en corrigeerbaar blijft."
      },
      {
        "title": "Open een beantwoorde controle",
        "body": "Herstel vraagt een toetsbare ingang: “Welke claim is twijfelachtig en welke controle zou haar alsnog geloofwaardig maken?” Vraag ook welke gegevens het wantrouwen zelf ondersteunen. Het sterkste bezwaar is dat een aantoonbaar storende spreker tijd of veiligheid kan misbruiken. Een redelijke discussie hoeft dat niet onbeperkt te verdragen. Werk daarom met spreektijd, schriftelijke informatie, onafhankelijke controle of een begeleide route. Zo begrens je het gedrag zonder een onmogelijke inhoudelijke bewijslast op te leggen. Vermijd een gesloten criterium waarin uitleg alweer als bewijs van manipulatie geldt. Als geen enkel antwoord het oordeel kan wijzigen, werkt de beoordeling niet meer als controle maar als vooraf vastgelegde uitsluiting.",
        "example": "Laat een uitgesloten mondelinge spreker diens controleerbare kostenpost schriftelijk aan een onafhankelijke beoordelaar geven.",
        "takeaway": "Een herstelbare procedure beschermt de discussie beter dan een totale voorafgaande veroordeling."
      }
    ],
    "deepDive": {
      "title": "Een zelfafsluitende geloofwaardigheidsaanval",
      "body": "Bij putvergiftigen wordt wantrouwen vaak een algemene regel: elk argument uit deze bron wordt onbetrouwbaar verklaard. Daardoor kan zelfs tegenbewijs in dezelfde verdenking worden opgenomen. “Als zij haar cijfers toont, bewijst dat dat zij berekenend is” maakt controle onmogelijk. Het probleem ligt in de onbegrensde reikwijdte en de afsluiting van antwoorden.\n\nVergelijk dit met een specifieke ondermijning. “Dit cijfer is afkomstig uit een vervalst logboek” raakt één bewijsroute en kan met nieuwe gegevens worden beantwoord. De conclusie luidt niet dat de spreker nooit meer iets waar kan zeggen.\n\nEen leider moet soms betrouwbare deelnamevoorwaarden afdwingen. Beoordeel dan wat de maatregel beoogt: veiligheid, ordelijk spreken of waarheid van een inhoudelijke claim. De argumenten daarvoor verschillen. Een controleerbare gedragsmaatregel kan gerechtvaardigd zijn; een permanente inhoudelijke uitsluiting volgt daar niet automatisch uit. Noem wat nodig is voor herstel en welke onafhankelijke informatie beschikbaar blijft."
    },
    "starter": {
      "scenario": "Vóór een overleg zegt de voorzitter: ‘Negeer alles wat het avondteam vandaag inbrengt; zij klagen altijd.’",
      "prompt": "Wat gebeurt vóór de beoordeling?",
      "answer": 0,
      "options": [
        {
          "text": "Alle komende bijdragen worden met een typering op voorhand uitgesloten.",
          "feedback": "Juist: de voorzitter beoordeelt nog geen concrete claim of gegeven. Een algemene typering sluit de inhoudelijke controle af."
        },
        {
          "text": "Een specifieke roosterfout is met cijfers weerlegd.",
          "feedback": "Er is nog geen concrete roosterclaim getoetst. Een typering van het team vervangt geen berekening of controle."
        },
        {
          "text": "Het avondteam krijgt een beperkte vraag over één onduidelijke melding.",
          "feedback": "De uitspraak gaat juist over alles wat het team kan inbrengen. Die reikwijdte is veel ruimer dan een gerichte controlevraag."
        }
      ],
      "bridge": "Bepaal straks welk antwoord het wantrouwen kan corrigeren en welk gedrag apart mag worden begrensd."
    },
    "inquiry": {
      "scenario": "Een coördinator waarschuwt voor een oud onjuist rapport. In versie A vraagt zij nieuwe cijfers uit dezelfde databron onafhankelijk te controleren. In versie B verklaart zij iedere toekomstige uitspraak van de auteur misleidend, ook als andere bronnen haar bevestigen.",
      "prompt": "Welke versie houdt een open bewijsroute over? Benoem welke aanvullende stap versie B maakt.",
      "model": "Versie A richt zich op een concreet bronprobleem en noemt een passende tegencontrole. Zij laat open dat nieuwe of onafhankelijk bevestigde informatie wel aanvaardbaar wordt. Versie B breidt de fout uit tot alle toekomstige uitspraken van de auteur en verwerpt zelfs bevestiging vooraf. Daarvoor is de genoemde rapportfout onvoldoende. Ik zou het oorspronkelijke gebrek vaststellen, getroffen cijfers markeren en een onafhankelijke vergelijking laten uitvoeren. De persoon kan daarnaast uitleg of een herstelprocedure nodig hebben. Het vertrouwen in een specifieke route blijft beperkt, zonder dat elke denkbare inhoudelijke bijdrage waardeloos wordt verklaard.",
      "followUp": "Formuleer een voorwaarde waaronder de bron weer beperkte informatie kan geven. Welke mogelijke tegenwerping moet die voorwaarde serieus nemen?"
    },
    "core": {
      "scenario": "Een voorzitter zegt vóór de begrotingsbespreking dat ieder bezwaar van nieuwe medewerkers slechts onervarenheid is, ongeacht hun berekeningen.",
      "prompt": "Welke functie maakt dit problematisch?",
      "answer": 1,
      "options": [
        {
          "text": "Ervaring wordt als mogelijk relevante informatie genoemd.",
          "feedback": "Ervaring kan relevant zijn voor bepaalde beoordelingen. De fout zit in de uitsluiting van elk inhoudelijk antwoord, niet in het woord ervaring."
        },
        {
          "text": "Een algemeen etiket sluit toekomstige controleerbare bezwaren af.",
          "feedback": "Juist: de typering beoordeelt geen berekening en laat geen passend tegenbewijs toe. Zij beslist de inhoud voordat die beschikbaar is."
        },
        {
          "text": "Begrotingsbesprekingen mogen nooit deelnamevoorwaarden hebben.",
          "feedback": "Een bespreking mag duidelijke procedures gebruiken. Zulke regels vragen eigen gronden en mogen relevante inhoud niet op een karakteretiket uitsluiten."
        }
      ]
    },
    "assessment": [
      {
        "scenario": "Een manager kondigt aan dat elke vraag over een projectbewijs toont dat de vragensteller tegen verbetering is.",
        "prompt": "Wat is de belangrijkste fout?",
        "answer": 2,
        "options": [
          {
            "text": "De projectclaim kan door dit gesprek onmogelijk waar zijn.",
            "feedback": "De afsluitende reactie bewijst geen onwaar projectresultaat. De claim blijft een eigen bewijsroute vragen."
          },
          {
            "text": "Elke kritische vraag geeft automatisch een volledige weerlegging.",
            "feedback": "Vragen kunnen lacunes zichtbaar maken, maar bewijzen niet steeds het tegendeel. Het gewicht hangt af van de ontbrekende rechtvaardiging."
          },
          {
            "text": "Elke toekomstige vraag wordt tegen de vragensteller gebruikt in plaats van beantwoord.",
            "feedback": "Juist: de regel sluit gerichte controle op voorhand af. Zelfs een relevante vraag kan binnen dit etiket geen geldig antwoord krijgen."
          }
        ]
      },
      {
        "scenario": "Een medewerker vervalste aantoonbaar meetwaarden. Het team vraagt gedurende een periode om onafhankelijke bevestiging van nieuwe waarden uit dezelfde registratie.",
        "prompt": "Waarom kan deze voorzorg redelijk zijn?",
        "answer": 0,
        "options": [
          {
            "text": "Zij begrenst een concrete getroffen bewijsroute en laat tegencontrole toe.",
            "feedback": "Juist: het verzoek richt zich op dezelfde registratie en heeft een herstelbare ingang. Het verklaart niet iedere uitspraak van de medewerker onwaar."
          },
          {
            "text": "Eén vervalsing bewijst dat ieder toekomstig oordeel van deze persoon fout is.",
            "feedback": "Dat is de te ruime overdracht. Een specifieke route kan onbetrouwbaar zijn terwijl andere, onafhankelijk ondersteunde uitspraken kloppen."
          },
          {
            "text": "Een onafhankelijke bevestiging bewijst dat de eerdere vervalsing nooit gebeurde.",
            "feedback": "Nieuwe bevestiging kan huidig vertrouwen verbeteren zonder het eerdere gedrag te ontkennen. Die twee beoordelingen staan apart."
          }
        ]
      },
      {
        "scenario": "Een team mag zijn plan schriftelijk toelichten, maar de leidinggevende zegt dat elke toelichting bewijs van manipulatie is.",
        "prompt": "Welke reparatie opent een echte toets?",
        "answer": 1,
        "options": [
          {
            "text": "‘Maak de toelichting langer totdat de verdenking zonder criterium verdwijnt.’",
            "feedback": "Zonder aanvaardingscriterium kan elk nieuw antwoord opnieuw verdacht worden verklaard. Meer tekst herstelt die gesloten beoordeling niet."
          },
          {
            "text": "‘Noem de betwiste claim en welke onafhankelijke controle jouw oordeel zou kunnen wijzigen.’",
            "feedback": "Juist: dit maakt het wantrouwen toetsbaar en beperkt. Er blijft een echte route voor relevante gegevens en tegenargumenten."
          },
          {
            "text": "‘Alle bezwaren tegen dit team zijn verboden.’",
            "feedback": "Dat sluit de andere kant evenzeer af. De oplossing is gerichte, controleerbare kritiek in plaats van een nieuw totaalverbod."
          }
        ]
      }
    ],
    "puzzle": {
      "scenario": "Een projectleider zegt vóór een demonstratie dat alles wat de beheerder laat zien ‘gewoon verdediging van zijn oude systeem’ zal zijn.",
      "prompt": "Reconstructeer de casus: scheid reden, conclusie, ongeoorloofde stap en gerichte herstelzin.",
      "categories": [
        "Aangevoerde reden",
        "Conclusie",
        "Ongeoorloofde stap",
        "Gerichte herstelzin"
      ],
      "cards": [
        {
          "text": "De beheerder wordt als verdediger van het oude systeem getypeerd.",
          "category": 0
        },
        {
          "text": "Geen informatie uit de demonstratie hoeft serieus te worden bekeken.",
          "category": 1
        },
        {
          "text": "De typering diskwalificeert ieder toekomstig gegeven zonder inhoudelijke toets.",
          "category": 2
        },
        {
          "text": "Welke getoonde functie wordt betwijfeld, en welke aparte controle kan haar bevestigen?",
          "category": 3
        }
      ],
      "explanation": "Het etiket vervangt de beoordeling van toekomstige informatie. De herstelzin maakt een specifiek doelwit en een mogelijke tegencontrole zichtbaar."
    },
    "writing": {
      "scenario": "Een team presenteert een voorstel voor minder avonddiensten. De voorzitter kondigt aan dat alle argumenten van ouders in het team slechts eigenbelang zijn.",
      "prompt": "Schrijf minimaal 80 woorden. Begrens de uitsluiting, erken belangen en formuleer een open controle van het roostervoorstel.",
      "model": "Ouders kunnen een belang hebben, maar dat maakt iedere toekomstige roosterberekening niet onjuist. De uitspraak sluit de beoordeling af voordat concrete gegevens zijn bekeken. Ik vraag welke claim wordt betwijfeld en welke informatie haar kan ondersteunen. Vervolgens vergelijk ik de bezetting, verdeling van lasten en mogelijkheden voor alle betrokken groepen. Het sterkste bezwaar is een eenzijdige selectie van voordelen; daarom moeten ook lasten voor collega's zonder kinderen zichtbaar worden. Een gezamenlijke vergelijking kan dat toetsen. De voorzitter mag de procedure en spreektijd begrenzen, maar niet ieder antwoord opnieuw als eigenbelang wegzetten. Vertrouwen blijft controleerbaar wanneer een passende toelichting het oordeel daadwerkelijk kan wijzigen.",
      "rubric": [
        "Je benoemt de voorafgaande algemene uitsluiting.",
        "Je onderscheidt een zichtbaar belang van bewijs tegen alle bijdragen.",
        "Je formuleert een open criterium en passende onafhankelijke controle.",
        "Je behandelt het sterkste bezwaar van andere betrokkenen zonder nieuwe uitsluiting."
      ]
    },
    "illustration": {
      "title": "Wantrouwen moet beantwoord kunnen worden",
      "invitation": "Vergelijk de stap en haar reikwijdte in beide versies.",
      "sourceId": "tindale",
      "variants": [
        {
          "id": "flaw",
          "label": "De stap schiet tekort",
          "caption": "Deze versie maakt een eerder belang tot uitsluiting van ieder mogelijk antwoord en blokkeert daarmee een daadwerkelijke beoordeling.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Aangevoerd",
                "text": "De spreker verdedigde eerder haar eigen afdeling.",
                "tone": "orange"
              },
              {
                "id": "c",
                "label": "Afgeleide claim",
                "text": "Geen enkele nieuwe claim van haar telt, ook niet met onafhankelijke gegevens.",
                "tone": "orange"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "rechtvaardigt deze claim niet",
                "kind": "challenge"
              }
            ],
            "legend": "De kaart lokaliseert de betwiste stap. Een zwakke verdediging bewijst niet vanzelf dat de conclusie onwaar is."
          }
        },
        {
          "id": "repair",
          "label": "Gericht herstellen",
          "caption": "De herstelversie beperkt de twijfel tot een aantoonbare route en laat bevestiging toe. Andere onafhankelijke argumenten behouden een afzonderlijke beoordeling.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Relevante grond",
                "text": "Deze nieuwe claim gebruikt dezelfde eerder foutieve registratie.",
                "tone": "blue"
              },
              {
                "id": "c",
                "label": "Beperkte vervolgstap",
                "text": "Vraag onafhankelijke controle van juist die registratie.",
                "tone": "green"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "draagt deze beperkte reactie",
                "kind": "support"
              }
            ],
            "legend": "Deze verbetering behoudt een beperkte conclusie. Controleer de gegevens, de afweging en eventuele tegenargumenten."
          }
        }
      ]
    }
  },
  {
    "slug": "rode-haring",
    "name": "Rode haring",
    "aliases": [
      "red herring",
      "irrelevant distraction",
      "afleidingsmanoeuvre"
    ],
    "family": "Gesprek en persoon",
    "level": "bachelor",
    "sourceTopic": "language",
    "mediaIds": [],
    "teaser": "Een belangrijk ander onderwerp beantwoordt de huidige vraag niet vanzelf.",
    "criticalQuestion": "Draagt het nieuwe onderwerp het antwoord op de oorspronkelijke vraag, of vervangt het die vraag?",
    "sections": [
      {
        "title": "Een ander onderwerp neemt het oordeel over",
        "body": "Een rode haring leidt het gesprek naar een ander onderwerp en behandelt dat als antwoord op een nog openstaande vraag. Het tweede onderwerp kan waar, belangrijk en indrukwekkend zijn. Toch kan het de oorspronkelijke claim onvoldoende raken. “Waarom ontbreken de onderhoudsbonnen?” wordt niet beantwoord met een verhaal over hoge klanttevredenheid, tenzij een relevante verbinding wordt uitgelegd. Zoek daarom de oorspronkelijke vraag, de nieuwe kwestie en het oordeel dat daardoor onbesproken blijft. Niet iedere onderwerpwisseling is een drogreden. De fout ontstaat wanneer de wisseling een vereiste antwoord of rechtvaardiging ontwijkt en tegelijk de indruk geeft dat de kwestie daarmee is opgelost. Een vaag gevoel van afleiding moet je met deze vergelijking concreet maken.",
        "example": "Een vraag naar contractkosten verdwijnt achter een presentatie over het enthousiasme van het team.",
        "takeaway": "Belangrijk is niet hetzelfde als relevant voor deze openstaande vraag."
      },
      {
        "title": "Wanneer een onderwerpwisseling wél redelijk is",
        "body": "Een nieuw onderwerp kan noodzakelijk zijn wanneer het een premisse, gevolg of voorwaarde van de oorspronkelijke keuze raakt. Een vraag naar aanschafkosten kan bijvoorbeeld terecht worden aangevuld met onderhoudskosten die het totaal bepalen. Ook acute veiligheid kan reden zijn om de agenda tijdelijk te wijzigen. Maak het doel van de verschuiving dan expliciet en leg uit wanneer de oorspronkelijke vraag terugkomt. Een discussie over prioriteiten mag verschillende problemen vergelijken; een specifieke claim over een fout vraagt eerst passende onderbouwing. Hetzelfde tweede onderwerp kan dus relevant zijn in een verdelingsbesluit en irrelevant als schijnantwoord op een administratieve vraag. Relevantie hangt af van wat het gesprek probeert vast te stellen.",
        "example": "Een onderhoudsprobleem wordt besproken omdat het de totale kosten van dezelfde aankoop verandert.",
        "takeaway": "Noem de verbinding of maak een tijdelijke agendawijziging zichtbaar."
      },
      {
        "title": "Breng de open vraag terug",
        "body": "Een herstelreactie hoeft het tweede onderwerp niet onbelangrijk te noemen. “Die tevredenheid verdient aandacht; welke onderhoudsbon onderbouwt nu deze betaling?” erkent de informatie en keert terug naar het ontbrekende bewijs. Het sterkste bezwaar tegen strikt terugsturen is dat jouw oorspronkelijke vraag te smal kan zijn. Misschien bepalen bredere effecten werkelijk de keuze. Vraag dan om de expliciete verbinding en voeg die toe aan de afweging. Houd onderscheid tussen een antwoord op feiten, een beleidsafweging en een nieuwe agenda. Een leider kan een belangrijk nevenonderwerp parkeren met een concreet vervolg zonder het als weerlegging te gebruiken. Zo blijven meerdere echte problemen zichtbaar en wordt geen enkele kwestie automatisch opgelost door over een andere te praten.",
        "example": "Noteer de kwaliteitservaring als apart punt en toets vervolgens de betwiste factuur.",
        "takeaway": "Erken een andere kwestie, maar laat zien welke oorspronkelijke vraag nog onbeantwoord is."
      }
    ],
    "deepDive": {
      "title": "Relevantie volgt uit het gespreksdoel",
      "body": "Afleiding is moeilijker te herkennen dan een eenvoudige ongeldige vorm. De spreker kan namelijk ware premissen aanvoeren en toch het verkeerde oordeel verdedigen. Reconstructeer daarom het doel van de discussie: een melding controleren, een plan kiezen, verantwoordelijkheid toewijzen of prioriteiten verdelen. Die doelen vragen verschillende verbindingen.\n\nEen verhaal over reputatie kan in een marktstrategie relevant zijn en bij de vraag of een bedrag dubbel betaald is niet. Een ernstig risico kan een tijdelijke verschuiving rechtvaardigen zonder het onjuiste bedrag te corrigeren. Maak beide conclusies afzonderlijk.\n\nEen beschuldiging van rode haring vraagt zelf een toelichting: welke vraag blijft open en waarom raakt het nieuwe materiaal die onvoldoende? Vraag eerst naar een mogelijk verband. Als een reële relatie blijkt, verwerk die in de beoordeling. Als geen relatie wordt gegeven, herstel de oorspronkelijke bewijsverplichting. Deze discipline voorkomt zowel slimme ontwijking als het onterecht afwijzen van relevante bredere context."
    },
    "starter": {
      "scenario": "Je vraagt waarom een bestelling dubbel werd betaald. Het antwoord gaat alleen over de mooie nieuwe winkelinrichting.",
      "prompt": "Wat blijft open?",
      "answer": 1,
      "options": [
        {
          "text": "Of de inrichting aantrekkelijk gevonden mag worden.",
          "feedback": "Dat kan een eigen gespreksonderwerp zijn. Het oordeel over uitstraling beantwoordt de dubbele betaling niet."
        },
        {
          "text": "Waarom de tweede betaling plaatsvond en welke registratie die draagt.",
          "feedback": "Juist: het nieuwe onderwerp geeft nog geen verklaring of onderbouwing van deze betaling. De oorspronkelijke vraag moet terugkomen."
        },
        {
          "text": "Of iedere andere vraag tijdens een overleg verboden is.",
          "feedback": "Een agenda kan veranderen. Het probleem is dat de andere kwestie hier als vervanging van het benodigde antwoord wordt gebruikt."
        }
      ],
      "bridge": "Bepaal straks wanneer bredere context werkelijk een premisse of doel van dezelfde beslissing raakt."
    },
    "inquiry": {
      "scenario": "Een team bespreekt de aanschafprijs van een machine. Reactie A wijst op aantoonbare onderhoudskosten van dezelfde machine. Reactie B vertelt dat de fabrikant een mooi kantoor heeft en gebruikt dat om de prijsvraag af te sluiten.",
      "prompt": "Welk nieuw onderwerp verandert de oorspronkelijke kostenafweging? Leg uit waarom een waar detail nog geen relevant antwoord is.",
      "model": "De onderhoudskosten in A veranderen de totale kosten van dezelfde aankoop en zijn daarom relevante bredere context. Het kantoor in B kan werkelijk mooi zijn, maar zonder verdere verbinding zegt het niet of deze aankoopprijs verantwoord is. Het detail sluit de prijsvraag niet af. Ik zou de totale gebruikskosten vergelijken en expliciet vragen of uitstraling een afzonderlijk doel is. Als de keuze inderdaad mede over presentatie aan klanten gaat, kan passende informatie daarover een andere afwegingsgrond zijn. Zij vervangt dan nog steeds geen kostencontrole. De betekenis van het nieuwe onderwerp hangt af van het concrete besluit en de openstaande vraag.",
      "followUp": "Voeg een acute machinestoring toe die het overleg tijdelijk onderbreekt. Hoe formuleer je een legitieme verschuiving met een terugkeermoment?"
    },
    "core": {
      "scenario": "Een directeur wordt gevraagd hoe de beloofde wachttijd is gemeten. Hij antwoordt dat het bedrijf veel nieuwe medewerkers aantrekt en dat de belofte daarom niet meer hoeft te worden gecontroleerd.",
      "prompt": "Welke verbinding ontbreekt?",
      "answer": 2,
      "options": [
        {
          "text": "Een verband dat nieuwe medewerkers automatisch slechte dienstverlening geeft.",
          "feedback": "Dat is niet de openstaande claim en wordt niet gegeven. Je moet niet een nieuwe, even ongefundeerde tegenconclusie toevoegen."
        },
        {
          "text": "Een regel dat werving nooit met dienstverlening samenhangt.",
          "feedback": "Een samenhang is mogelijk, bijvoorbeeld via bezetting. Maar die moet worden uitgelegd en beantwoordt nog niet hoe de wachttijd gemeten is."
        },
        {
          "text": "Een reden waarom wervingssucces de meting van deze wachttijdbelofte vervangt.",
          "feedback": "Juist: het nieuwe positieve onderwerp lost de meetvraag niet op. Een relevante personeelsfactor kan worden toegevoegd zonder de meting weg te laten."
        }
      ]
    },
    "assessment": [
      {
        "scenario": "Bij een vraag naar een foutief leveradres vertelt een manager hoe populair het assortiment is en noemt daarmee het probleem afgehandeld.",
        "prompt": "Welke diagnose is het meest precies?",
        "answer": 0,
        "options": [
          {
            "text": "Een positieve maar onverbonden kwestie neemt het antwoord op de adresfout over.",
            "feedback": "Juist: populariteit kan een eigen relevant doel zijn, maar onderbouwt niet het juiste adres of herstel van deze levering."
          },
          {
            "text": "Een leveradres kan nooit met assortiment samenhangen.",
            "feedback": "Dat absolute oordeel is niet nodig. In deze reactie is geen verbinding gegeven die de oorspronkelijke fout behandelt."
          },
          {
            "text": "Populariteit bewijst dat de klant geen onjuiste levering kan hebben gekregen.",
            "feedback": "Die gevolgtrekking is niet onderbouwd. Een populair aanbod kan tegelijk verkeerd worden afgeleverd."
          }
        ]
      },
      {
        "scenario": "Een team bespreekt aanschaf. Een collega brengt het contractueel verplichte onderhoud van precies hetzelfde apparaat in de kostenvergelijking.",
        "prompt": "Waarom kan dat redelijk zijn?",
        "answer": 2,
        "options": [
          {
            "text": "Omdat ieder nieuw onderwerp het oude automatisch vervangt.",
            "feedback": "De relevantie volgt uit de concrete verbinding met totale kosten, niet uit het feit dat een nieuw onderwerp wordt genoemd."
          },
          {
            "text": "Omdat onderhoud de aanschafprijs onwaar maakt.",
            "feedback": "Onderhoud kan de totale afweging veranderen zonder dat de genoemde aanschafprijs onwaar is. Houd beide posten apart."
          },
          {
            "text": "Omdat de extra post een relevante voorwaarde van dezelfde keuze raakt.",
            "feedback": "Juist: het contractuele onderhoud maakt onderdeel uit van de gebruikskosten van dit apparaat. Het breidt de afweging gericht uit."
          }
        ]
      },
      {
        "scenario": "Een manager antwoordt op een vraag naar onvolledige roosters met een verhaal over succesvolle opleidingen.",
        "prompt": "Welke herstelzin behoudt beide onderwerpen zonder ontwijken?",
        "answer": 1,
        "options": [
          {
            "text": "‘Opleidingen zijn altijd onbelangrijk; spreek daar nooit meer over.’",
            "feedback": "Dat sluit een mogelijk waardevol onderwerp zonder reden uit. De klacht betreft de ontbrekende relatie met deze roosterinformatie."
          },
          {
            "text": "‘De opleidingen bespreken we apart; welke dienstinformatie ontbreekt en wanneer wordt die aangevuld?’",
            "feedback": "Juist: de zin maakt de oorspronkelijke vraag weer concreet en geeft het andere onderwerp een eigen plaats."
          },
          {
            "text": "‘Omdat opleidingen succesvol zijn, is een compleet rooster niet nodig.’",
            "feedback": "Die vrijstelling vraagt een niet gegeven norm en behandelt het praktische roosterprobleem niet. Succes vervangt geen noodzakelijke informatie."
          }
        ]
      }
    ],
    "puzzle": {
      "scenario": "Een team vraagt waarom twee verplichte kwaliteitsmetingen ontbreken. De reactie verwijst naar een geslaagde open dag en noemt de controle daarmee voldoende.",
      "prompt": "Reconstructeer de casus: scheid reden, conclusie, ongeoorloofde stap en gerichte herstelzin.",
      "categories": [
        "Aangevoerde reden",
        "Conclusie",
        "Ongeoorloofde stap",
        "Gerichte herstelzin"
      ],
      "cards": [
        {
          "text": "De open dag kreeg positieve reacties.",
          "category": 0
        },
        {
          "text": "De kwaliteitscontrole is voldoende afgehandeld.",
          "category": 1
        },
        {
          "text": "Publieke waardering vervangt ontbrekende metingen zonder inhoudelijk verband.",
          "category": 2
        },
        {
          "text": "Welke metingen ontbreken, en wanneer kunnen we die afzonderlijk controleren?",
          "category": 3
        }
      ],
      "explanation": "Een geslaagde open dag kan waardevol zijn, maar bewijst geen uitgevoerde kwaliteitsmeting. De herstelzin richt zich op de oorspronkelijke bewijsroute."
    },
    "writing": {
      "scenario": "Een klantteam vraagt hoe een beloofde terugbeltermijn is nageleefd. De leidinggevende reageert dat de organisatie een prijs voor innovatie won.",
      "prompt": "Schrijf minimaal 80 woorden. Lokaliseer de onbeantwoorde vraag, behandel een mogelijk relevant verband en formuleer een concrete herstelreactie.",
      "model": "De innovatieprijs beantwoordt niet hoe de terugbeltermijn bij deze klanten is nageleefd. Ik vraag om het registratiebereik, de gemeten tijden en eventuele uitzonderingen. Een relevante verbinding zou kunnen zijn dat de bekroonde werkwijze terugbellen ondersteunt, maar dan zijn gegevens over die werking nodig. De prijs alleen vervangt de nalevingscontrole niet. Ik erken de prestatie en geef haar een apart agendapunt. Daarna keren we terug naar de termijn en herstel voor betrokken klanten. Het sterkste bezwaar is een te smalle beoordeling die verbeteringen negeert; daarom kan de bredere werkwijze wel als extra factor worden vergeleken zonder de concrete belofte te laten verdwijnen.",
      "rubric": [
        "Je benoemt de oorspronkelijke vraag en het nieuwe onderwerp.",
        "Je verklaart waarom de prijs het benodigde antwoord niet vervangt.",
        "Je onderzoekt een mogelijk relevant verband zonder het te verzinnen.",
        "Je formuleert een herstelreactie die beide kwesties een eigen beoordeling geeft."
      ]
    },
    "illustration": {
      "title": "Een nevenonderwerp of een antwoord?",
      "invitation": "Vergelijk de stap en haar reikwijdte in beide versies.",
      "sourceId": "tindale",
      "variants": [
        {
          "id": "flaw",
          "label": "De stap schiet tekort",
          "caption": "Klantwaardering kan echt en belangrijk zijn, maar zonder relevante verbinding beantwoordt zij niet waarom dezelfde factuur tweemaal betaald is.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Aangevoerd",
                "text": "De organisatie heeft een hoge klantwaardering.",
                "tone": "orange"
              },
              {
                "id": "c",
                "label": "Afgeleide claim",
                "text": "De betwiste dubbele betaling hoeft niet gecontroleerd te worden.",
                "tone": "orange"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "rechtvaardigt deze claim niet",
                "kind": "challenge"
              }
            ],
            "legend": "De kaart lokaliseert de betwiste stap. Een zwakke verdediging bewijst niet vanzelf dat de conclusie onwaar is."
          }
        },
        {
          "id": "repair",
          "label": "Gericht herstellen",
          "caption": "De herstelversie richt zich op het concrete bewijs voor de openstaande betaalvraag. Een ander waardevol onderwerp kan daarnaast op de agenda blijven.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Relevante grond",
                "text": "Dezelfde factuurnummers staan tweemaal in de betaalregistratie.",
                "tone": "blue"
              },
              {
                "id": "c",
                "label": "Beperkte vervolgstap",
                "text": "Controleer deze posten en bespreek waardering apart.",
                "tone": "green"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "draagt deze beperkte reactie",
                "kind": "support"
              }
            ],
            "legend": "Deze verbetering behoudt een beperkte conclusie. Controleer de gegevens, de afweging en eventuele tegenargumenten."
          }
        }
      ]
    }
  },
  {
    "slug": "whataboutism",
    "name": "Whataboutism",
    "aliases": [
      "whataboutery",
      "en wat dan met",
      "afleiding door tegenbeschuldiging"
    ],
    "family": "Gesprek en persoon",
    "level": "bachelor",
    "sourceTopic": "burden",
    "mediaIds": [],
    "teaser": "Andermans fout lost de huidige fout niet op.",
    "criticalQuestion": "Beantwoordt de vergelijking deze claim, of ontslaat zij iemand ongemerkt van verantwoording?",
    "sections": [
      {
        "title": "Een tegenbeschuldiging verplaatst de vraag",
        "body": "Whataboutism is hier de moderne naam voor een reactie die een kritiek ontwijkt door een andere tekortkoming in beeld te brengen. “En wat dan met de andere vestiging?” kan belangrijk klinken terwijl de besproken fout blijft liggen. Het nieuwe verwijt kan waar zijn. De fout zit in de gevolgtrekking dat de oorspronkelijke claim daarom niet meer hoeft te worden beoordeeld of dat verantwoordelijkheid vervalt. Het is een specifieke toepassing van afleiding en verschoven bewijslast, geen magisch woord voor iedere vergelijking. Noteer wie wat moet onderbouwen en welke vraag onbeantwoord blijft. De nieuwe beschuldiging krijgt bovendien haar eigen controle. Twee echte problemen kunnen tegelijk bestaan en afzonderlijk herstel verdienen.",
        "example": "Een onjuiste levering wordt verdedigd met de klacht dat een andere afdeling nog vaker fouten maakt.",
        "takeaway": "Meer fouten elders geven niet vanzelf vrijstelling van beoordeling hier."
      },
      {
        "title": "Wanneer een vergelijking wél redelijk is",
        "body": "Een vergelijking met anderen kan terecht zijn als het gesprek gaat over gelijke behandeling, verdeling van schaarse middelen of een algemene claim. Bij een besluit waar ondersteuning het meest nodig is, moeten verschillende problemen worden vergeleken. Als iemand beweert dat alleen deze vestiging controles overslaat, kan een tweede geval die beperkte claim rechtstreeks aantasten. Maak dan duidelijk welk doelwit de vergelijking heeft. Zij kan een exclusiviteitsclaim of sanctiebeleid weerleggen zonder de concrete fout in deze vestiging op te lossen. Vergelijk ook gelijke omstandigheden en relevante ernst. “Daar gebeurt meer” is zonder aantallen, risico en context geen betrouwbare prioriteitsregel en geen antwoord op wat hier is gebeurd.",
        "example": "Een tweede gelijksoortige fout weerlegt “alleen team A doet dit”, maar niet de melding dat team A een fout maakte.",
        "takeaway": "Gebruik de vergelijking voor een passend doelwit, niet als algemene ontwijking."
      },
      {
        "title": "Houd beide verantwoordingsvragen open",
        "body": "Een herstelreactie kan zeggen: “We controleren dat tweede geval ook. Wat gebeurde er bij deze levering?” Zo wordt de nieuwe informatie niet weggewuifd en blijft de oorspronkelijke verplichting bestaan. Het sterkste bezwaar is dat geïsoleerde kritiek een dubbele maatstaf kan verbergen. Neem een onderbouwde vergelijking daarom serieus, vooral bij sancties of prioriteiten. Geef beide zaken een heldere eigenaar, hetzelfde relevante criterium en een passende tijdlijn. Dat maakt de behandeling eerlijker zonder de ene fout door de andere te neutraliseren. Vermijd een wedloop waarin elke partij een groter probleem noemt totdat niemand nog zijn eigen claim verdedigt. Een verantwoord besluit kan de urgente zaak voorrang geven en tegelijk vastleggen welke kleinere zaak nog herstel vraagt.",
        "example": "Leg herstel voor de foutieve levering vast en toets daarna waarom vergelijkbare fouten verschillend worden behandeld.",
        "takeaway": "Beoordeel verantwoordelijkheid en prioriteit afzonderlijk; laat geen van beide vanzelf verdwijnen."
      }
    ],
    "deepDive": {
      "title": "Hetzelfde andere geval, een ander doelwit",
      "body": "Whataboutism kan overlappen met tu quoque wanneer de criticus zelf wordt beschuldigd, of met rode haring wanneer een andere kwestie het antwoord vervangt. De labels zijn daarom geen wederzijds uitsluitende dozen. De functie van de zet geeft de beste diagnose: welke oorspronkelijke rechtvaardiging wordt overgeslagen?\n\nEen ander geval kan wel echte tegeninformatie zijn. “Dit probleem bestaat alleen hier” valt door een vergelijkbaar geval elders; “dit probleem bestaat hier” niet. Een algemene norm die uitsluitend tegen één groep wordt gebruikt kan een eerlijkheidsbezwaar krijgen, terwijl de norm inhoudelijk overeind blijft.\n\nOok een vergelijking van ernst vraagt een eigen argument. Grotere schade elders kan middelenprioriteit rechtvaardigen maar niet noodzakelijk zwijgen over deze schade. Een leider onderscheidt feitenvaststelling, gelijke toepassing, herstel en volgorde van aanpak. Laat de spreker precies zeggen welk van deze oordelen het tweede geval moet veranderen. Dan kan de vergelijking worden beoordeeld zonder automatische vrijstelling of automatische afwijzing."
    },
    "starter": {
      "scenario": "Bij kritiek op ontbrekende schoonmaakregistraties zegt iemand: ‘De bezorging loopt ook mis, dus dit hoeven we niet te bespreken.’",
      "prompt": "Wat doet de nieuwe klacht nog niet?",
      "answer": 2,
      "options": [
        {
          "text": "Zij kan laten zien dat bezorging een eigen probleem heeft.",
          "feedback": "Dat kan inderdaad zo zijn, maar vraagt eigen controle. Een tweede probleem laat de schoonmaakvraag niet verdwijnen."
        },
        {
          "text": "Zij kan aanleiding geven om de agenda uit te breiden.",
          "feedback": "Dat kan redelijk zijn als beide zaken een eigen behandeling krijgen. Agenda-uitbreiding is geen antwoord op de eerste melding."
        },
        {
          "text": "Zij toont niet dat de schoonmaakregistraties compleet zijn of herstel overbodig is.",
          "feedback": "Juist: het bezorgprobleem raakt die conclusie niet zonder extra verbinding. De oorspronkelijke verantwoordingsvraag blijft bestaan."
        }
      ],
      "bridge": "Bepaal straks of de vergelijking verantwoordelijkheid, exclusiviteit, gelijkheid of prioriteit moet veranderen."
    },
    "inquiry": {
      "scenario": "Team A mist een overdracht. In versie A verwijst het naar een fout van team B om iedere beoordeling af te wijzen. In versie B gebruikt het diezelfde fout om de uitspraak ‘alleen A mist overdrachten’ te corrigeren en aanvaardt het herstel van de eigen melding.",
      "prompt": "Welke claim wordt in B daadwerkelijk geraakt? Waarom blijft verantwoordelijkheid in A zonder passend antwoord liggen?",
      "model": "Het tweede geval weerlegt in B de exclusiviteitsclaim: het probleem is niet alleen bij A vastgesteld. Team A kan dat terecht corrigeren en toch verantwoordelijkheid voor de eigen fout behouden. In A wordt het andere geval gebruikt om beoordeling van de eigen overdracht te ontwijken. Daarvoor is de vergelijking onvoldoende. Ik controleer beide meldingen, corrigeer de te ruime exclusiviteitsclaim en stel passende herstelacties vast. Als sancties verschillen, vraag ik naar relevante omstandigheden en criteria. Een vergelijking kan de behandeling eerlijker maken, maar doet niet alsof een eigen gemiste overdracht daardoor compleet wordt.",
      "followUp": "Voeg toe dat maar één tijdelijke vervanger beschikbaar is. Welke extra gronden zijn nu nodig voor een eerlijke prioriteitskeuze?"
    },
    "core": {
      "scenario": "Een afdelingshoofd antwoordt op een vraag naar een onjuiste voorraadclaim met een fout uit het klantteam en zegt dat hij daardoor geen voorraadcijfers hoeft te tonen.",
      "prompt": "Welke bewijsverplichting blijft bestaan?",
      "answer": 0,
      "options": [
        {
          "text": "De onderbouwing van zijn eigen voorraadclaim.",
          "feedback": "Juist: het klantteam kan een apart probleem hebben, maar die fout vervangt geen bewijs voor deze voorraaduitspraak."
        },
        {
          "text": "Een bewijs dat nooit iemand anders een fout maakte.",
          "feedback": "Zo'n absolute eis volgt niet uit de oorspronkelijke claim. Kritiek mag bestaan terwijl er ook andere fouten zijn."
        },
        {
          "text": "De plicht van de criticus om alle problemen elders eerst op te lossen.",
          "feedback": "Dat verschuift de discussie zonder de voorraadclaim te dragen. Andere problemen kunnen parallel een eigen behandeling krijgen."
        }
      ]
    },
    "assessment": [
      {
        "scenario": "Een manager krijgt een concrete melding van ongeplande overuren. Zij noemt slechte bezoekersinformatie bij een andere locatie en acht de melding daarmee afgehandeld.",
        "prompt": "Welke stap is fout?",
        "answer": 1,
        "options": [
          {
            "text": "Een tweede locatie wordt in het gesprek genoemd.",
            "feedback": "Vergelijken kan relevant zijn. De fout betreft de conclusie dat het andere probleem deze overurenmelding afhandelt."
          },
          {
            "text": "De nieuwe tekortkoming vervangt beoordeling van de oorspronkelijke overuren.",
            "feedback": "Juist: beide kwesties kunnen echt zijn en herstel vragen. Het nieuwe verwijt geeft geen antwoord op de gemelde uren."
          },
          {
            "text": "De manager moet ieder genoemd probleem altijd even urgent behandelen.",
            "feedback": "Urgentie kan verschillen. Een prioriteitskeuze vraagt eigen gronden en ontslaat niet vanzelf van feitencontrole of later herstel."
          }
        ]
      },
      {
        "scenario": "Een bestuurder zegt dat alleen de avonddienst registratiefouten maakt. Een gecontroleerde dagdienstmelding toont dezelfde soort fout.",
        "prompt": "Waarom is de vergelijking legitiem?",
        "answer": 2,
        "options": [
          {
            "text": "Zij bewijst dat registratiefouten geen gevolgen hebben.",
            "feedback": "Een tweede fout weerlegt geen gevolgen. De kwaliteit en eventuele schade blijven voor beide diensten te beoordelen."
          },
          {
            "text": "Zij heft herstel in de avonddienst volledig op.",
            "feedback": "De avonddienst kan zelf nog steeds fouten hebben gemaakt. De vergelijking raakt exclusiviteit, niet haar eigen herstel."
          },
          {
            "text": "Zij weerlegt de concrete claim dat de fout uitsluitend bij de avonddienst voorkomt.",
            "feedback": "Juist: één aantoonbaar vergelijkbaar ander geval is relevant tegen ‘alleen’. Dat is een ander doelwit dan de oorspronkelijke foutmelding."
          }
        ]
      },
      {
        "scenario": "Een team zegt bij kritiek op foutieve facturen dat een andere groep nog grotere fouten maakte. Beide meldingen zijn serieus.",
        "prompt": "Welke reactie bewaart een eerlijke beoordeling?",
        "answer": 0,
        "options": [
          {
            "text": "‘We controleren beide factuurreeksen en maken apart duidelijk welke schade eerst herstel vraagt.’",
            "feedback": "Juist: deze reactie behoudt feiten en verantwoordelijkheid voor beide kwesties. Prioriteit krijgt een eigen, controleerbare afweging."
          },
          {
            "text": "‘Alleen de grootste fout mag worden genoemd; de andere bestaat argumentatief niet.’",
            "feedback": "Ernst kan prioriteit veranderen, maar doet een kleiner daadwerkelijk probleem niet verdwijnen. De kleinere zaak kan nog herstel vragen."
          },
          {
            "text": "‘Omdat de vergelijking afleidt, behandelen we de andere melding nooit.’",
            "feedback": "Dat verwerpt mogelijke relevante informatie zonder controle. Herstel scheidt de kwesties in plaats van een ervan voor altijd uit te sluiten."
          }
        ]
      }
    ],
    "puzzle": {
      "scenario": "Een team vraagt waarom de sleutelregistratie ontbreekt. Een collega verwijst naar een verdwenen bestelbon bij een andere groep en wil de sleutelvraag niet beantwoorden.",
      "prompt": "Reconstructeer de casus: scheid reden, conclusie, ongeoorloofde stap en gerichte herstelzin.",
      "categories": [
        "Aangevoerde reden",
        "Conclusie",
        "Ongeoorloofde stap",
        "Gerichte herstelzin"
      ],
      "cards": [
        {
          "text": "Bij de andere groep ontbreekt een bestelbon.",
          "category": 0
        },
        {
          "text": "De ontbrekende sleutelregistratie hoeft niet te worden uitgelegd.",
          "category": 1
        },
        {
          "text": "Een tweede tekortkoming wordt vrijstelling van de oorspronkelijke verantwoording.",
          "category": 2
        },
        {
          "text": "Controleer beide registraties en wijs voor elke melding een herstelactie aan.",
          "category": 3
        }
      ],
      "explanation": "De vergelijking kan een breder procesprobleem suggereren, maar draagt geen automatische vrijstelling van de sleutelvraag."
    },
    "writing": {
      "scenario": "Een projectteam wordt aangesproken op niet gemelde kosten. Het reageert dat een andere afdeling meer geld verspilde en wil daarom de eigen posten niet tonen.",
      "prompt": "Schrijf minimaal 80 woorden. Scheid verantwoording en prioriteit, beoordeel een mogelijke dubbele maatstaf en geef een concrete vervolgreactie.",
      "model": "De mogelijke verspilling elders maakt de eigen kostenposten niet transparant. Het projectteam moet daarom de oorspronkelijke bedragen en afspraken tonen. Ik laat de andere melding ook controleren, zonder haar als vrijstelling te behandelen. Het sterkste bezwaar is een dubbele maatstaf bij sancties of ondersteuning. Daarvoor vergelijk ik budgetten, bevoegdheden, gevolgen en dezelfde afgesproken criteria. Grotere schade kan prioriteit rechtvaardigen, maar de kleinere zaak kan nog herstel vragen. Ik stel voor beide meldingen een eigenaar en een terugkeermoment vast. Zo kan de vergelijking een eerlijke behandeling verbeteren terwijl iedere eigen claim haar onderbouwing behoudt.",
      "rubric": [
        "Je benoemt welke oorspronkelijke claim nog bewijs vraagt.",
        "Je scheidt verantwoordelijkheid, gelijke toepassing en prioriteit.",
        "Je behandelt het andere geval als controleerbare informatie zonder vrijstelling.",
        "Je formuleert een concrete reactie waarin beide meldingen herstel kunnen krijgen."
      ]
    },
    "illustration": {
      "title": "Vergelijken zonder vrijstelling",
      "invitation": "Vergelijk de stap en haar reikwijdte in beide versies.",
      "sourceId": "tindale",
      "variants": [
        {
          "id": "flaw",
          "label": "De stap schiet tekort",
          "caption": "Het tweede probleem kan echt zijn, maar toont niet dat de oorspronkelijke kosten juist zijn of dat de verantwoordingsplicht vervalt.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Aangevoerd",
                "text": "Een andere afdeling maakte eveneens een kostenfout.",
                "tone": "orange"
              },
              {
                "id": "c",
                "label": "Afgeleide claim",
                "text": "Onze betwiste kosten hoeven niet verantwoord te worden.",
                "tone": "orange"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "rechtvaardigt deze claim niet",
                "kind": "challenge"
              }
            ],
            "legend": "De kaart lokaliseert de betwiste stap. Een zwakke verdediging bewijst niet vanzelf dat de conclusie onwaar is."
          }
        },
        {
          "id": "repair",
          "label": "Gericht herstellen",
          "caption": "Deze versie gebruikt het andere geval tegen een exclusiviteitsclaim. Zij laat de eigen verantwoordelijkheid en een eerlijke herstelafweging bestaan.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Relevante grond",
                "text": "Ook elders is een vergelijkbare fout gecontroleerd vastgesteld.",
                "tone": "blue"
              },
              {
                "id": "c",
                "label": "Beperkte vervolgstap",
                "text": "Corrigeer ‘alleen hier’ en beoordeel beide fouten afzonderlijk.",
                "tone": "green"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "draagt deze beperkte reactie",
                "kind": "support"
              }
            ],
            "legend": "Deze verbetering behoudt een beperkte conclusie. Controleer de gegevens, de afweging en eventuele tegenargumenten."
          }
        }
      ]
    }
  },
  {
    "slug": "doelpalen-verschuiven",
    "name": "Doelpalen verschuiven",
    "aliases": [
      "moving the goalposts",
      "raising the bar",
      "verschuivende bewijscriteria"
    ],
    "family": "Gesprek en persoon",
    "level": "bachelor",
    "sourceTopic": "burden",
    "mediaIds": [],
    "teaser": "Nieuwe eisen vragen een reden en veranderen het eerdere resultaat niet stilzwijgend.",
    "criticalQuestion": "Waarom verandert het bewijscriterium nadat de afgesproken vraag is beantwoord?",
    "sections": [
      {
        "title": "Een afgeronde controle blijft altijd onvoldoende",
        "body": "Doelpalen verschuiven is de moderne aanduiding voor een gesprek waarin een bewijs- of aanvaardingscriterium ongemerkt verandert zodra de ander eraan voldoet. Eerst is een gecontroleerde telling genoeg; daarna wordt zonder reden een volledig ander soort zekerheid geëist. Het oorspronkelijke bewijs wordt zo nooit erkend. Maak de stand van het gesprek zichtbaar: welke claim stond ter discussie, welk criterium was afgesproken en welke nieuwe eis verschijnt? Niet iedere vervolgvraag is een drogreden. Misschien lost het antwoord maar één onderdeel op of kwam een echte tekortkoming aan het licht. De fout ligt in het onverklaarde veranderen van de lat en het behandelen van het eerdere passende antwoord alsof het nooit betekenis had.",
        "example": "Na de afgesproken kostencontrole wordt zonder nieuwe grond ineens wereldwijde foutloosheid geëist.",
        "takeaway": "Een nieuw criterium vraagt uitleg; erken wat het eerdere bewijs wel heeft opgelost."
      },
      {
        "title": "Wanneer een strengere eis wél redelijk is",
        "body": "Een bewijscriterium mag veranderen wanneer nieuwe informatie de relevante risico's, vraag of toepassingsvoorwaarden wijzigt. Een beperkte proef die geschikt was voor een kleine interne taak kan niet vanzelf een ingrijpende brede invoering rechtvaardigen. Ook een ontdekt meetgebrek kan aanvullende controle nodig maken. Benoem dan expliciet de veranderde claim of nieuwe reden. Erken dat het eerdere criterium misschien voor de eerdere beperkte vraag was gehaald. Een slechte afspraak hoeft niet voor altijd te worden gevolgd, vooral niet als zij relevante schade negeert. Wel moet de herziening inhoudelijk worden verdedigd en mag zij niet alleen verschijnen omdat de uitkomst de criticus niet bevalt. Stel vast welke aanvullende controle een passend voorlopig oordeel mogelijk maakt.",
        "example": "Nieuwe invoering bij nachtdiensten geeft andere uitvoeringsvoorwaarden dan de eerdere dagproef.",
        "takeaway": "Herziening is redelijker bij een veranderde claim of aangetoonde nieuwe lacune."
      },
      {
        "title": "Leg het beoordelingsmoment vast",
        "body": "Herstel begint met een precieze terugblik: “De afgesproken budgetvraag is beantwoord. Welke nieuwe claim vraagt nu extra bewijs?” Splits opgeloste en openstaande onderdelen. Het sterkste bezwaar tegen vaste criteria is dat zij zelf te zwak of onveilig kunnen blijken. Maak ruimte voor een gemotiveerde herziening, maar laat die haar eigen bewijslast dragen. Vraag welke informatie het oordeel nu daadwerkelijk kan wijzigen en spreek af hoe een voorlopig besluit wordt genomen. Dat voorkomt zowel kunstmatige eindeloosheid als voortijdig afsluiten. Een leider erkent wat is aangetoond zonder méér te claimen: passende kosten betekenen nog geen gegarandeerde kwaliteit. Nieuwe vragen mogen die kwaliteit onderzoeken, maar mogen niet achteraf de kostencontrole als onuitgevoerd voorstellen.",
        "example": "Erken de afgeronde kostenvergelijking en start apart een gemotiveerde controle van een nieuw privacyrisico.",
        "takeaway": "Behoud de gespreksgeschiedenis en maak veranderde criteria expliciet."
      }
    ],
    "deepDive": {
      "title": "Erkenning, veranderde scope en bewijssterkte",
      "body": "Deze les past principes van relevantie en bewijslast toe op een moderne gespreksnaam. Een debat heeft een geschiedenis: eerdere claims, antwoorden en afspraken bepalen wat nog openstaat. Onbeperkt blijven eisen kan die geschiedenis uitwissen, maar een afspraak maakt een zwak argument niet automatisch sterk.\n\nOnderscheid daarom drie situaties. Een antwoord voldoet nog niet aan het bestaande criterium. Een antwoord voldoet wel, maar een andere relevante claim blijft open. Of nieuwe informatie rechtvaardigt herziening van het criterium zelf. Alleen die laatste twee vragen een expliciete toevoeging of verandering; geen ervan mag stilzwijgend worden gebruikt om het eerdere resultaat te ontkennen.\n\nVoor brede of risicovolle beslissingen kan meer bewijs redelijk zijn. De mate van zekerheid moet passen bij gevolgen en alternatieven. Toch is absolute foutloosheid vaak geen uitvoerbaar criterium. Vraag een controleerbare, proportionele grens en een herzieningsroute. Een voorlopig oordeel kan verantwoord zijn zonder alle denkbare twijfel voorgoed uit te sluiten."
    },
    "starter": {
      "scenario": "Een manager vraagt een getekende toestemming. Zodra die wordt getoond, eist zij zonder nieuwe uitleg ook toestemming van mensen buiten het afgesproken besluitproces.",
      "prompt": "Wat moet zij toelichten?",
      "answer": 0,
      "options": [
        {
          "text": "Waarom het eerdere criterium wordt uitgebreid en welk nieuw probleem dat oplost.",
          "feedback": "Juist: een nieuwe eis kan relevant zijn, maar heeft een eigen rechtvaardiging nodig. De getoonde afgesproken toestemming blijft een echt resultaat."
        },
        {
          "text": "Waarom de getekende toestemming automatisch nooit heeft bestaan.",
          "feedback": "Een veranderde eis maakt een getoond document niet onbestaand. Betwist zo nodig inhoud of geldigheid met concrete gronden."
        },
        {
          "text": "Waarom elke nieuwe vraag voor altijd verboden is.",
          "feedback": "Vervolgvragen kunnen echte lacunes behandelen. Het probleem is de onverklaarde verandering, niet het stellen van iedere nieuwe vraag."
        }
      ],
      "bridge": "Onderscheid nu een niet beantwoord criterium van een veranderde claim of een gemotiveerde nieuwe eis."
    },
    "inquiry": {
      "scenario": "Een team voldoet aan de afgesproken taaktest. In versie A verlangt de beoordelaar zonder uitleg ineens foutloos werk in elke toekomstige situatie. In versie B verandert het voorstel van een kleine proef naar gebruik in alle diensten, met nieuwe risico's.",
      "prompt": "Waarom kan meer bewijs in B passend zijn? Formuleer welke erkenning in beide versies aan de eerdere test toekomt.",
      "model": "De eerdere test kan aantonen dat het team aan het afgesproken beperkte criterium voldoet. Dat resultaat moet worden erkend. Versie B verandert de reikwijdte naar alle diensten; nieuwe situaties kunnen aanvullende voorwaarden en bewijs vragen. De beoordelaar moet die verschillen benoemen in plaats van de eerste test als waardeloos te presenteren. Versie A voegt zonder relevante reden een onbegrensde eis toe. Ik vraag daarom welke claim nu wordt beoordeeld, welke aanvullende omstandigheden van belang zijn en wat een proportioneel criterium is. Een nieuwe brede aanbeveling volgt niet automatisch uit de kleine test, maar het oude antwoord verdwijnt evenmin.",
      "followUp": "Stel dat de oorspronkelijke test een aantoonbaar meetgebrek had. Welke eerdere conclusie moet dan worden beperkt, en hoe leg je dat eerlijk uit?"
    },
    "core": {
      "scenario": "Voor een leveringsvoorstel zijn vooraf prijs en beschikbare capaciteit als criteria genoemd. Beide zijn gecontroleerd. De criticus noemt nu zonder reden perfect gedrag van alle medewerkers als voorwaarde en blijft zeggen dat de prijs niet is onderbouwd.",
      "prompt": "Welke reactie herstelt het criterium?",
      "answer": 1,
      "options": [
        {
          "text": "Alle zorgen over gedrag zijn voor ieder besluit irrelevant.",
          "feedback": "Gedrag kan bij uitvoering relevant zijn. De criticus moet echter aangeven welk concreet risico wordt toegevoegd en de afgeronde prijscontrole erkennen."
        },
        {
          "text": "Erken de prijscontrole en vraag welke nieuwe uitvoeringsclaim de extra eis rechtvaardigt.",
          "feedback": "Juist: deze reactie bewaart het eerdere resultaat en vraagt een eigen grond voor de uitbreiding van het criterium."
        },
        {
          "text": "Passende prijs en capaciteit bewijzen volledige kwaliteit voor alle gevallen.",
          "feedback": "Dat gaat verder dan de twee criteria. Andere relevante eisen kunnen blijven bestaan, mits duidelijk wordt uitgelegd waarom zij nodig zijn."
        }
      ]
    },
    "assessment": [
      {
        "scenario": "Een beoordelaar vroeg drie aantoonbare foutregistraties. Die worden getoond. Hij verlangt nu zonder toelichting alle fouten uit de hele sector en noemt de drie meldingen ‘geen enkel bewijs’.",
        "prompt": "Welke stap is problematisch?",
        "answer": 2,
        "options": [
          {
            "text": "Drie meldingen moeten iedere universele claim volledig bewijzen.",
            "feedback": "Dat volgt niet. Het bereik van de claim bepaalt wat drie meldingen dragen, en een beperkte vraag moet beperkt worden beoordeeld."
          },
          {
            "text": "Er mogen nooit meer dan drie meldingen worden gevraagd.",
            "feedback": "Meer bewijs kan redelijk zijn bij een andere claim of nieuw risico. De vraag is waarom de eis hier wordt veranderd."
          },
          {
            "text": "Een gehaald criterium wordt ontkend en ongemotiveerd door een andere eis vervangen.",
            "feedback": "Juist: de geschiedenis van de afgesproken vraag verdwijnt. Erken wat is aangetoond en onderbouw een eventuele uitbreiding afzonderlijk."
          }
        ]
      },
      {
        "scenario": "Een eenvoudige interne planningstest is gehaald. Daarna wordt het voorstel uitgebreid naar veiligheidskritische nachtdiensten.",
        "prompt": "Waarom kan een nieuwe test redelijk zijn?",
        "answer": 0,
        "options": [
          {
            "text": "De claim en risico's hebben een nieuwe reikwijdte die aanvullende controle vraagt.",
            "feedback": "Juist: het eerdere resultaat blijft geldig binnen zijn bereik. Nieuwe toepassingsvoorwaarden kunnen apart meer bewijs rechtvaardigen."
          },
          {
            "text": "Een eerdere geslaagde test bewijst dat geen extra risico kan bestaan.",
            "feedback": "Dat generaliseert buiten het beproefde bereik. Andere diensten en gevolgen kunnen nieuwe voorwaarden meebrengen."
          },
          {
            "text": "Iedere nieuwe eis betekent dat de oorspronkelijke test nooit uitgevoerd is.",
            "feedback": "Een uitgevoerde test blijft uitgevoerd. De vraag is welke conclusie zij ondersteunt en waar nieuwe controle begint."
          }
        ]
      },
      {
        "scenario": "Een discussie blijft eisen toevoegen, terwijl onduidelijk is welke beperkte beslissing nu wordt beoordeeld.",
        "prompt": "Welke herstelzin is het meest bruikbaar?",
        "answer": 1,
        "options": [
          {
            "text": "‘Vanaf nu behandelen we geen enkel nieuw bezwaar.’",
            "feedback": "Dat kan relevante nieuwe lacunes uitsluiten. Een eerlijke afsluiting vraagt criteria, bereik en een herzieningsmogelijkheid."
          },
          {
            "text": "‘Welke beslissing nemen we nu, wat is al aangetoond en welk bewijs zou de resterende eis beantwoorden?’",
            "feedback": "Juist: de zin maakt scope, geschiedenis en een eindig criterium zichtbaar. Nieuwe eisen krijgen daarmee een gerichte plaats."
          },
          {
            "text": "‘We stemmen met ieder voorstel in zolang één eerdere test positief was.’",
            "feedback": "Een positieve test kan maar een deel dragen. De overige relevante voorwaarden moeten worden beoordeeld zonder het eerdere resultaat te ontkennen."
          }
        ]
      }
    ],
    "puzzle": {
      "scenario": "Een team wordt gevraagd aan te tonen dat een kleine proef binnen €2.000 past. Na een gecontroleerde begroting van €1.800 vraagt de criticus zonder nieuwe reden gegarandeerde winst voor alle vestigingen.",
      "prompt": "Reconstructeer de casus: scheid reden, conclusie, ongeoorloofde stap en gerichte herstelzin.",
      "categories": [
        "Aangevoerde reden",
        "Conclusie",
        "Ongeoorloofde stap",
        "Gerichte herstelzin"
      ],
      "cards": [
        {
          "text": "De gecontroleerde proefbegroting bedraagt €1.800.",
          "category": 0
        },
        {
          "text": "Het voorstel voldoet aan geen enkele afgesproken eis.",
          "category": 1
        },
        {
          "text": "Een budgetantwoord wordt stilzwijgend vervangen door een veel ruimere winstgarantie.",
          "category": 2
        },
        {
          "text": "Erken het budgetresultaat en vraag welke nieuwe claim de winstgarantie nodig maakt.",
          "category": 3
        }
      ],
      "explanation": "Budgetpassendheid en algemene winst zijn verschillende claims. Een nieuwe relevante vraag mag worden toegevoegd maar wist het eerdere antwoord niet uit."
    },
    "writing": {
      "scenario": "Een team toont de afgesproken toegankelijkheidscontrole van een bijeenkomst. De voorzitter vraagt daarna zonder toelichting bewijs dat elk toekomstig evenement voor iedereen perfect zal verlopen.",
      "prompt": "Schrijf minimaal 80 woorden. Erken het eerdere resultaat, begrens de nieuwe eis en behandel het sterkste bezwaar dat de eerste criteria ontoereikend kunnen zijn.",
      "model": "De getoonde controle moet worden erkend voor deze bijeenkomst en de afgesproken aspecten. Zij bewijst geen perfecte toegankelijkheid van elk toekomstig evenement. De nieuwe eis verandert dus de reikwijdte en vraagt uitleg. Het sterkste bezwaar is dat de eerste controle een belangrijke groep of voorziening kan missen. Als daarvoor concrete aanwijzingen zijn, is aanvullende controle redelijk. Ik vraag welke lacune wordt bedoeld, hoe die dit evenement raakt en welk proportioneel bewijs nodig is. Zonder zo'n grond mag een onbeperkte toekomstgarantie de eerdere controle niet als afwezig voorstellen. Ik splits aangetoonde toegankelijkheid, resterende problemen en een herzieningsroute voor nieuwe situaties.",
      "rubric": [
        "Je benoemt het oorspronkelijke criterium en het behaalde resultaat.",
        "Je maakt de gewijzigde reikwijdte of eis zichtbaar.",
        "Je behandelt een mogelijke echte lacune als gemotiveerd tegenargument.",
        "Je stelt een proportioneel, beantwoordbaar criterium en een herzieningsroute voor."
      ]
    },
    "illustration": {
      "title": "Een criterium veranderen vraagt uitleg",
      "invitation": "Vergelijk de stap en haar reikwijdte in beide versies.",
      "sourceId": "tindale",
      "variants": [
        {
          "id": "flaw",
          "label": "De stap schiet tekort",
          "caption": "De nieuwe eis verwijdert zonder grond het eerdere resultaat en vraagt een onbegrensde garantie voor een andere reikwijdte.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Aangevoerd",
                "text": "De afgesproken budgetcontrole is gehaald.",
                "tone": "orange"
              },
              {
                "id": "c",
                "label": "Afgeleide claim",
                "text": "Toch is er geen bewijs zolang iedere toekomstsituatie niet foutloos is.",
                "tone": "orange"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "rechtvaardigt deze claim niet",
                "kind": "challenge"
              }
            ],
            "legend": "De kaart lokaliseert de betwiste stap. Een zwakke verdediging bewijst niet vanzelf dat de conclusie onwaar is."
          }
        },
        {
          "id": "repair",
          "label": "Gericht herstellen",
          "caption": "Deze verandering is expliciet en inhoudelijk gemotiveerd. Meer bewijs kan redelijk zijn voor de nieuwe claim zonder het oorspronkelijke antwoord uit te wissen.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Relevante grond",
                "text": "Het plan is na de kleine proef uitgebreid naar nieuwe diensten met andere risico's.",
                "tone": "blue"
              },
              {
                "id": "c",
                "label": "Beperkte vervolgstap",
                "text": "Behoud het proefresultaat en toets aanvullende voorwaarden voor die uitbreiding.",
                "tone": "green"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "draagt deze beperkte reactie",
                "kind": "support"
              }
            ],
            "legend": "Deze verbetering behoudt een beperkte conclusie. Controleer de gegevens, de afweging en eventuele tegenargumenten."
          }
        }
      ]
    }
  },
  {
    "slug": "dubbelzinnigheid",
    "name": "Dubbelzinnigheid",
    "aliases": [
      "equivocation",
      "equivocatio",
      "betekenisverschuiving"
    ],
    "family": "Taal en aannames",
    "level": "bachelor",
    "sourceTopic": "language",
    "mediaIds": [],
    "teaser": "Hetzelfde woord moet in de gevolgtrekking dezelfde relevante betekenis houden.",
    "criticalQuestion": "Verandert een belangrijk woord van betekenis tussen reden en conclusie?",
    "sections": [
      {
        "title": "Eén woord doet twee verschillende taken",
        "body": "Een woord kan verschillende betekenissen hebben zonder dat de spreker een drogreden gebruikt. Het argument gaat mis wanneer het ene gebruik als steun voor een conclusie met een ander gebruik wordt behandeld. “Dit abonnement is voordelig, dus het biedt de beste kwaliteit” kan goedkoop verwarren met kwalitatief gunstig. Noteer het sleutelwoord en herschrijf iedere betekenis in duidelijke termen. Kijk daarna of de reden de conclusie nog draagt. Soms verdwijnt de schijnbare verbinding zodra de betekenissen verschillend worden benoemd. Een fout hoeft niet bewust te zijn; gewone woorden als goed, vrij, veilig en efficiënt nodigen gemakkelijk tot verschuiving uit. Diagnoseer de echte betekeniswisseling, niet alleen het bestaan van meerdere woordenboekbetekenissen.",
        "example": "“De zaal is vrij” als onbezet bewijst niet dat toegang voor iedereen gratis is.",
        "takeaway": "Vervang het sleutelwoord door de bedoelde betekenis en controleer de stap opnieuw."
      },
      {
        "title": "Wanneer verschillende betekenissen wél redelijk zijn",
        "body": "Een spreker mag een woord in verschillende betekenissen gebruiken als de overgang expliciet is en geen ongefundeerde gevolgtrekking draagt. Een taalkundige uitleg, grap of vergelijking kan meerdere betekenissen juist zichtbaar maken. Ook een nieuwe definitie kan bruikbaar zijn wanneer zij wordt afgesproken, consequent wordt toegepast en de relevante inhoud behoudt. Definiëren bewijst echter geen betwiste waarde. Als “goed personeel” uitsluitend “personeel dat nooit bezwaar maakt” betekent, is daarmee niet aangetoond dat kritiek de kwaliteit schaadt. Vraag welke definitie de premisse aanvaardbaar maakt en welke betekenis de conclusie nodig heeft. Soms zijn twee betekenissen terecht verbonden, maar dan moet de empirische of normatieve brug afzonderlijk worden verdedigd.",
        "example": "Vrije ruimte kan in één alinea beschikbaarheid betekenen en in een aparte afspraak kosteloos gebruik; vermeld het onderscheid.",
        "takeaway": "Een expliciete betekenisovergang vraagt nog bewijs voor een eventuele inhoudelijke verbinding."
      },
      {
        "title": "Herstel een definitie zonder het bezwaar weg te definiëren",
        "body": "Schrijf beide betekenissen naast elkaar en formuleer de ontbrekende verbinding als een echte vraag. “Lagere kosten noemen we hier voordelig; welke gegevens verbinden die met voldoende kwaliteit?” maakt het probleem bespreekbaar. Het sterkste tegenargument is dat deelnemers werkelijk een andere definitie delen dan jij veronderstelt. Toets daarom context, eerdere afspraken en concrete toepassingen voordat je een betekeniswisseling verwijt. Als de definitie consistent blijft, kan de fout elders zitten: een zwakke premisse of te ruime conclusie. Een leider hoeft geen perfect woordenboek op te leggen. Hij moet wel voorkomen dat een aangename betekenis de andere ongemerkt legitimeert. Maak praktische criteria zichtbaar en geef de ander ruimte om de gebruikte betekenis te bevestigen of te corrigeren.",
        "example": "Gebruik “sneller” en “minder fouten” als afzonderlijke criteria in plaats van beide ongemerkt “efficiënt” te noemen.",
        "takeaway": "Verhelder betekenis en behoud het inhoudelijke meningsverschil."
      }
    ],
    "deepDive": {
      "title": "Betekenis, definitie en bewijslast",
      "body": "Dubbelzinnigheid is een taaleigenschap; equivocatie is het problematische gebruik ervan binnen een redenering. Een woord met twee betekenissen is dus geen voldoende diagnose. Je moet aantonen waar de betekenis verandert en waarom de conclusie daarvan afhankelijk is. Herschrijven helpt de verborgen sprong zichtbaar maken.\n\nEen betwiste definitie kan tegelijk een normatief oordeel bevatten. “Eerlijk betekent iedereen exact hetzelfde geven” is een mogelijke regel, maar beslist niet zonder afweging of verschillende behoeften mogen meetellen. Een partij mag haar definitie voorstellen; zij mag de waarde ervan niet als reeds aanvaard bewijs gebruiken.\n\nSoms wordt een ruime betekenis voor de premisse en een smalle voor de conclusie benut. Soms werkt het andersom. Zoek daarom inhoud en context in plaats van alleen terugkerende woorden. Herstel kan een consistente definitie, twee aparte criteria of een beperkte conclusie opleveren. Die verheldering ondersteunt beoordeling maar maakt de oorspronkelijke feiten nog niet vanzelf waar."
    },
    "starter": {
      "scenario": "Een vergaderruimte is volgens de planning ‘vrij’. Iemand concludeert dat we haar gratis mogen gebruiken.",
      "prompt": "Welke betekenis veranderde?",
      "answer": 1,
      "options": [
        {
          "text": "Beschikbaarheid op dit tijdstip wordt beschikbaarheid op alle dagen.",
          "feedback": "Dat zou een reikwijdteverandering zijn, maar deze conclusie gaat over betaling. De daadwerkelijke overgang is van onbezet naar kosteloos."
        },
        {
          "text": "Onbezet wordt kosteloos.",
          "feedback": "Juist: beschikbaarheid geeft niet vanzelf informatie over betaling. De twee betekenissen vragen een aparte verbinding of afspraak."
        },
        {
          "text": "Een prijsafspraak wordt gebruikt om beschikbaarheid te bewijzen.",
          "feedback": "Dat keert de richting om: de planning geeft beschikbaarheid, terwijl de conclusie een prijsclaim toevoegt. Die verbinding is nog niet vastgesteld."
        }
      ],
      "bridge": "Herschrijf straks de sleutelwoorden en beoordeel welke inhoudelijke verbinding nog ontbreekt."
    },
    "inquiry": {
      "scenario": "Een organisatie noemt een proces efficiënt omdat het minder minuten kost. Daarna wordt gezegd dat efficiënte processen weinig fouten geven, dus dit proces zal weinig fouten geven. Een tweede versie bespreekt tijd en foutpercentage met afzonderlijke gegevens.",
      "prompt": "Welke betekenis draagt de eerste premisse en welke de conclusie? Wat maakt de tweede versie inhoudelijk sterker zonder haar al waar te verklaren?",
      "model": "De eerste versie gebruikt efficiënt eerst voor tijdsbesparing en daarna voor foutarme uitvoering. Tijdwinst bewijst niet zonder extra grond dat ook fouten afnemen. Ik schrijf daarom de twee criteria apart: benodigde minuten en foutpercentage. De tweede versie maakt de overgang niet afhankelijk van één aantrekkelijk woord, maar geeft afzonderlijke gegevens. Ook die gegevens vragen controle op omstandigheden, methode en bereik. Misschien dalen minuten terwijl fouten stijgen. Een verstandig advies weegt beide uitkomsten en relevante kosten. De definitie verduidelijken is een eerste stap; de gewenste kwaliteitsclaim moet daarna daadwerkelijk worden onderbouwd.",
      "followUp": "Kies een eigen woord zoals ‘flexibel’ of ‘veilig’. Geef twee betekenissen en een voorbeeld waarin de overgang apart bewijs vraagt."
    },
    "core": {
      "scenario": "Een manager zegt: “Dit rooster is eerlijk: iedereen krijgt evenveel uren. Een eerlijk rooster geeft iedereen dezelfde belasting, dus de belasting is gelijk.” Taken en omstandigheden zijn niet vergeleken.",
      "prompt": "Welke overgang vraagt eigen steun?",
      "answer": 2,
      "options": [
        {
          "text": "Van een rooster naar het bestaan van medewerkers.",
          "feedback": "Het bestaan van medewerkers is niet het betwiste doelwit. De stap betreft de relatie tussen gelijke uren en gelijke belasting."
        },
        {
          "text": "Van een gelijke verdeling naar de zekerheid dat de uren verkeerd geteld zijn.",
          "feedback": "Een betekenisprobleem bewijst geen verkeerde telling. De uren kunnen gelijk zijn terwijl de belasting verschilt."
        },
        {
          "text": "Van gelijkheid in uren naar gelijkheid in belasting.",
          "feedback": "Juist: twee betekenissen van eerlijke behandeling worden verbonden zonder gegevens over taken en omstandigheden. Die verbinding moet apart worden verdedigd."
        }
      ]
    },
    "assessment": [
      {
        "scenario": "Een product is ‘licht’ omdat het weinig weegt. Een verkoper concludeert daarmee dat het gebruik weinig inspanning vraagt.",
        "prompt": "Welke stap is niet zonder meer gerechtvaardigd?",
        "answer": 0,
        "options": [
          {
            "text": "Laag gewicht wordt zonder gebruiksgegevens gelijkgesteld aan lage bedieningslast.",
            "feedback": "Juist: gewicht en inspanning kunnen samenhangen, maar zijn niet dezelfde eigenschap. Bedieningswijze en taak moeten worden beoordeeld."
          },
          {
            "text": "Een laag gewicht mag ooit een voordeel worden genoemd.",
            "feedback": "Dat kan een relevant voordeel zijn. De fout ontstaat in de niet onderbouwde overgang naar een ander gebruikscriterium."
          },
          {
            "text": "Een woord met meerdere betekenissen maakt ieder product onbruikbaar.",
            "feedback": "De taal maakt het product niet onbruikbaar. Zij kan de verdediging verzwakken, waarna eigenschappen apart kunnen worden gecontroleerd."
          }
        ]
      },
      {
        "scenario": "Een trainer zegt expliciet dat ‘open’ in de ene oefening een onbezet tijdslot en in de andere een gesprek zonder vooraf vastgelegde conclusie betekent.",
        "prompt": "Waarom is dit geen automatische drogreden?",
        "answer": 2,
        "options": [
          {
            "text": "Omdat iedere trainer zelf beslist welke conclusies waar zijn.",
            "feedback": "Een rol geeft geen waarheidsgarantie. De trainer moet betekenis en eventuele gevolgtrekkingen controleerbaar houden."
          },
          {
            "text": "Omdat dezelfde woorden nooit inhoudelijke fouten kunnen geven.",
            "feedback": "Juist betekeniswisselingen kunnen schijnsteun leveren. Je moet controleren of een conclusie op de ongefundeerde overgang leunt."
          },
          {
            "text": "Omdat de betekenissen worden onderscheiden zonder ze als onderling bewijs te gebruiken.",
            "feedback": "Juist: meerdere betekenissen kunnen legitiem worden uitgelegd. De fout vraagt een problematische gevolgstap, niet alleen woordvariatie."
          }
        ]
      },
      {
        "scenario": "Een plan is ‘goed’ omdat het weinig kost. De aanbeveling spreekt daarna van bewezen goede dienstverlening.",
        "prompt": "Welke herstelzin maakt de claim toetsbaar?",
        "answer": 1,
        "options": [
          {
            "text": "‘Goed betekent alles wat ik kies; daardoor is het plan bewezen goed.’",
            "feedback": "Die definitie neemt de betwiste beoordeling al op. Zij levert geen onafhankelijke grond voor de dienstverlening."
          },
          {
            "text": "‘Noem de lage kosten apart en laat zien welke kwaliteitsgegevens de dienstverlening ondersteunen.’",
            "feedback": "Juist: twee criteria krijgen elk hun eigen onderbouwing. De positieve klank van goed vervangt die gegevens niet."
          },
          {
            "text": "‘Zodra een woord dubbelzinnig is, moeten alle gegevens worden weggegooid.’",
            "feedback": "Dat gaat te ver. Herschrijven kan de betekenis corrigeren terwijl juiste kosten- of kwaliteitsgegevens bruikbaar blijven."
          }
        ]
      }
    ],
    "puzzle": {
      "scenario": "Een opleidingsplek heet ‘toegankelijk’ omdat het gebouw bereikbaar is. Een brochure concludeert dat de opleiding daardoor voor iedere deelnemer betaalbaar is.",
      "prompt": "Reconstructeer de casus: scheid reden, conclusie, ongeoorloofde stap en gerichte herstelzin.",
      "categories": [
        "Aangevoerde reden",
        "Conclusie",
        "Ongeoorloofde stap",
        "Gerichte herstelzin"
      ],
      "cards": [
        {
          "text": "Het gebouw is goed bereikbaar.",
          "category": 0
        },
        {
          "text": "De opleiding is voor iedere deelnemer betaalbaar.",
          "category": 1
        },
        {
          "text": "Bereikbaarheid wordt als dezelfde eigenschap behandeld als financiële toegankelijkheid.",
          "category": 2
        },
        {
          "text": "Vergelijk bereikbaarheid en betaalbaarheid met afzonderlijke criteria en gegevens.",
          "category": 3
        }
      ],
      "explanation": "Hetzelfde woord kan relevante verschillende dimensies benoemen. Eén dimensie bewijst de andere niet zonder een aparte verbinding."
    },
    "writing": {
      "scenario": "Een team noemt een digitale werkwijze ‘veilig’ omdat documenten versleuteld worden. De leidinggevende concludeert daarmee dat medewerkers geen fouten kunnen maken bij verzending.",
      "prompt": "Schrijf minimaal 80 woorden. Benoem de twee veiligheidsbetekenissen en formuleer welke onafhankelijke toets de bredere conclusie vraagt.",
      "model": "Veilig betekent hier eerst bescherming van opgeslagen of verzonden gegevens door versleuteling. De conclusie gaat over foutloze keuzes van medewerkers. Die eigenschappen zijn niet gelijk. Versleuteling kan belangrijk zijn terwijl iemand nog een verkeerde ontvanger selecteert. Ik wil daarom de technische bescherming en het verzendproces apart beoordelen. Het sterkste bezwaar is dat een concreet ontwerp beide problemen kan verminderen; dan moet worden getoond welke voorziening verkeerd adresseren tegengaat en hoe zij werkt. Ik beperk de claim tot wat de technische gegevens dragen en vraag passende controles van de menselijke handeling. Het woord veilig geeft zonder die verbinding geen algemene foutloosheidsgarantie.",
      "rubric": [
        "Je herschrijft beide betekenissen zonder ze gelijk te stellen.",
        "Je benoemt welke conclusie de betekenisovergang nodig heeft.",
        "Je onderzoekt een mogelijke echte verbinding met concrete controles.",
        "Je behoudt een beperkte claim en laat technische bescherming intact waar zij is onderbouwd."
      ]
    },
    "illustration": {
      "title": "Hetzelfde woord, een ander criterium",
      "invitation": "Vergelijk de stap en haar reikwijdte in beide versies.",
      "sourceId": "tindale",
      "variants": [
        {
          "id": "flaw",
          "label": "De stap schiet tekort",
          "caption": "Lage kosten en goede dienstverlening zijn verschillende criteria. De positieve betekenis van voordelig levert geen onafhankelijke kwaliteitsgegevens.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Aangevoerd",
                "text": "Het plan is voordelig: de aanschafprijs is laag.",
                "tone": "orange"
              },
              {
                "id": "c",
                "label": "Afgeleide claim",
                "text": "Het plan geeft bewezen de beste dienstverlening.",
                "tone": "orange"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "rechtvaardigt deze claim niet",
                "kind": "challenge"
              }
            ],
            "legend": "De kaart lokaliseert de betwiste stap. Een zwakke verdediging bewijst niet vanzelf dat de conclusie onwaar is."
          }
        },
        {
          "id": "repair",
          "label": "Gericht herstellen",
          "caption": "De herstelversie maakt betekenissen apart en vraagt voor elk passende steun. Geen enkel aantrekkelijk woord beslist de volledige afweging.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Relevante grond",
                "text": "De prijs is gecontroleerd; de kwaliteit wordt afzonderlijk vergeleken.",
                "tone": "blue"
              },
              {
                "id": "c",
                "label": "Beperkte vervolgstap",
                "text": "Weeg beide criteria voor deze concrete toepassing.",
                "tone": "green"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "draagt deze beperkte reactie",
                "kind": "support"
              }
            ],
            "legend": "Deze verbetering behoudt een beperkte conclusie. Controleer de gegevens, de afweging en eventuele tegenargumenten."
          }
        }
      ]
    }
  },
  {
    "slug": "amfibolie",
    "name": "Amfibolie",
    "aliases": [
      "amphiboly",
      "amphibology",
      "syntactische dubbelzinnigheid"
    ],
    "family": "Taal en aannames",
    "level": "bachelor",
    "sourceTopic": "language",
    "mediaIds": [],
    "teaser": "De zinsbouw kan twee lezingen toelaten; kies er geen als bewijs zonder controle.",
    "criticalQuestion": "Welke grammaticale lezing is bedoeld, en hangt de conclusie daarvan af?",
    "sections": [
      {
        "title": "Dezelfde woorden, een andere structuur",
        "body": "Bij amfibolie laat de zinsbouw verschillende lezingen toe. De afzonderlijke woorden hoeven niet van betekenis te veranderen. “De begeleider zag de medewerker met de camera” kan betekenen dat de medewerker een camera had, maar ook dat de begeleider een camera gebruikte om te kijken. Een redenering gaat mis als de ene lezing de premisse plausibel maakt en een andere ongemerkt de conclusie draagt. Een onduidelijke zin is niet automatisch een drogreden: soms is er alleen een communicatieprobleem. Zoek de daarop gebaseerde gevolgtrekking. Vraag wie iets doet, waarop een bepaling betrekking heeft en welke groep door een voorwaarde wordt beperkt. De grammaticale keuze kan een praktische verplichting sterk veranderen.",
        "example": "“Wij vervangen stoelen en tafels met losse poten” kan de beperking op beide groepen of alleen op tafels laten slaan.",
        "takeaway": "Maak de bedoelde structuur zichtbaar voordat je een gevolg afleidt."
      },
      {
        "title": "Wanneer een lezing wél redelijk vaststaat",
        "body": "Een interpretatie kan redelijk zijn wanneer de context de lezing voldoende vastlegt, de spreker haar bevestigt of een duidelijke parallelle formulering wordt gegeven. Als de werkinstructie expliciet zegt dat alleen beschadigde stoelen én alleen beschadigde tafels worden vervangen, is de reikwijdte helder. Je hoeft niet bij ieder denkbaar taalspel een normale lezing te blokkeren. Wel vraagt een zwaar besluit meer zorg wanneer een relevante andere lezing mogelijk blijft. Een grap of voorbeeld van dubbelzinnigheid gebruikt verschillende lezingen bewust zonder een feit te bewijzen. Beoordeel daarom het beoogde gebruik. Een mogelijke interpretatie wordt geen vaststaand gegeven alleen omdat zij handig is voor de gewenste conclusie.",
        "example": "Een aangevuld contract herhaalt de voorwaarde voor beide groepen en maakt de oorspronkelijke beoogde afspraak controleerbaar.",
        "takeaway": "Context kan bepalen; een nuttige lezing is op zichzelf geen bewijs van bedoeling."
      },
      {
        "title": "Herstel met expliciete rollen en bereik",
        "body": "Herstel vraagt een herformulering, niet een oordeel over iemands taalgevoel. Zet de betrokken rollen en voorwaarden apart: wie gebruikt het apparaat, welke groep valt onder de beperking en wat is precies afgesproken? Het sterkste bezwaar tegen eindeloos verduidelijken is dat normale communicatie anders onmogelijk traag wordt. Vraag dus alleen verduidelijking waar de verschillende lezingen een relevant gevolg hebben. Bij een groot aankoopbesluit of verdeling van verantwoordelijkheden kan dat verschil zwaar wegen. De nieuwe formulering moet de bedoelde inhoud bewaren. Voeg niet onder het mom van taalcorrectie een bredere verplichting toe. Als de bedoeling nog onbekend is, presenteer twee mogelijkheden en vraag bevestiging voordat je een besluit op één lezing laat rusten.",
        "example": "Vraag of “met tijdelijke toegang” medewerkers én bezoekers beperkt, en schrijf daarna de gekozen groepen afzonderlijk op.",
        "takeaway": "Verduidelijk relevante verschillen zonder een nieuwe afspraak als oude bedoeling te presenteren."
      }
    ],
    "deepDive": {
      "title": "Grammaticale onzekerheid en inferentiële zekerheid",
      "body": "Amfibolie verschilt van een gewone betekeniswisseling doordat de structuur zelf meerdere relaties toelaat. Een bepaling kan bijvoorbeeld aan een handeling of aan een zelfstandig naamwoord worden gekoppeld. In een opsomming kan zij één onderdeel of de hele groep beperken. De gevolgtrekking hangt dan af van de gekozen structuur.\n\nEen premisse die op lezing A waar is, ondersteunt geen conclusie die alleen uit lezing B volgt. Schrijf beide lezingen volledig uit en toets de conclusie onder elk. Daardoor wordt duidelijk welke interpretatie extra steun nodig heeft. Soms blijkt het argument bij geen van beide lezingen sterk; dan ligt er naast de taal ook een inhoudelijk probleem.\n\nDit is geen verplichting om overal onnatuurlijke alternatieven te verzinnen. Context, afspraken en bevestiging kunnen voldoende houvast geven. Een leider richt taalcontrole op verschillen die gevolgen voor taken, kosten of rechten veranderen. Eerlijke reparatie maakt de bedoeling expliciet en laat open waar zij nog niet vastgesteld is."
    },
    "starter": {
      "scenario": "De notitie zegt: ‘De coördinator fotografeerde de medewerker met de tablet.’ Niemand heeft uitgelegd wie de tablet gebruikte.",
      "prompt": "Welke lezing staat zonder verdere toelichting vast?",
      "answer": 2,
      "options": [
        {
          "text": "De coördinator gebruikte beslist de tablet als instrument.",
          "feedback": "Dat is één mogelijke lezing, maar de zin kan ook de tablet bij de medewerker plaatsen. Voor deze zekerheid ontbreekt toelichting."
        },
        {
          "text": "De medewerker had beslist de tablet bij zich.",
          "feedback": "Ook dat is één mogelijke lezing. De tablet kan in de zinsbouw juist het instrument van de fotograferende coördinator zijn."
        },
        {
          "text": "Geen van beide is vastgesteld; de tablet kan bij de coördinator of de medewerker horen.",
          "feedback": "Juist: dezelfde woorden laten verschillende relaties toe. Een conclusie over bezit of gebruik vraagt bevestiging van de bedoelde lezing."
        }
      ],
      "bridge": "Schrijf straks beide lezingen volledig uit en vergelijk welke conclusie onder elke lezing volgt."
    },
    "inquiry": {
      "scenario": "Een instructie luidt: ‘Wij controleren klanten en leveranciers met tijdelijke toegang.’ Een team leest dit als alle klanten plus leveranciers met tijdelijke toegang. Een ander leest alleen klanten en leveranciers die tijdelijke toegang hebben. Het verschil verandert wie gecontroleerd moet worden.",
      "prompt": "Formuleer beide lezingen zonder dubbelzinnige zinsbouw. Welke extra informatie bepaalt welke controle is afgesproken?",
      "model": "De eerste lezing geeft twee groepen: alle klanten en alleen leveranciers met tijdelijke toegang. De tweede geeft klanten met tijdelijke toegang en leveranciers met tijdelijke toegang. Een conclusie over alle klanten volgt dus niet onder beide lezingen. Ik vraag naar de bedoelde controlegroep, eerdere afspraken en een bevestiging van de verantwoordelijke. Daarna schrijf ik de voorwaarde voor elke groep afzonderlijk op. De tekst alleen mag niet worden gebruikt om de breedste verplichting als vaststaand te presenteren. Evenmin bewijst de dubbelzinnigheid dat geen controle nodig is. Het relevante bereik moet worden verduidelijkt voordat uitvoering wordt toegewezen.",
      "followUp": "Voeg een bevestiging toe: alleen tijdelijke toegang moet gecontroleerd worden. Herschrijf de instructie en noem welk eerder gevolg nu vervalt."
    },
    "core": {
      "scenario": "Een bericht zegt: ‘We vervangen kasten en bureaus met beschadigde poten.’ Een planner behandelt het als bewijs dat elke kast moet worden vervangen.",
      "prompt": "Welke controle ontbreekt?",
      "answer": 0,
      "options": [
        {
          "text": "Of de beschadigingsvoorwaarde ook voor de kasten geldt.",
          "feedback": "Juist: de zinsbouw kan de bepaling aan één groep of beide koppelen. De brede kastconclusie vraagt bevestiging van het bedoelde bereik."
        },
        {
          "text": "Of ieder woord in de zin minstens twee woordenboekbetekenissen heeft.",
          "feedback": "Dat is niet nodig voor structurele dubbelzinnigheid. De woorden kunnen duidelijk zijn terwijl hun onderlinge relatie onzeker blijft."
        },
        {
          "text": "Of geen enkele beschadigde kast bestaat.",
          "feedback": "De tekst bewijst die afwezigheid niet. De relevante vraag is welke groep het vervangingsbesluit omvat."
        }
      ]
    },
    "assessment": [
      {
        "scenario": "Een notitie luidt: ‘De toezichthouder zag de bezoeker met de verrekijker.’ Een verslag stelt op basis daarvan vast dat de bezoeker een verrekijker droeg.",
        "prompt": "Waarom volgt dat niet zonder meer?",
        "answer": 1,
        "options": [
          {
            "text": "Een toezichthouder mag nooit visuele informatie gebruiken.",
            "feedback": "Waarneming kan relevante informatie geven. De fout betreft de onduidelijke grammaticale relatie van het gebruikte hulpmiddel."
          },
          {
            "text": "De tekst kan ook betekenen dat de toezichthouder de verrekijker gebruikte.",
            "feedback": "Juist: de andere lezing laat de waarneming bestaan zonder het genoemde bezit van de bezoeker. Bevestig de relatie vóór de conclusie."
          },
          {
            "text": "Een onduidelijke notitie bewijst dat de bezoeker geen verrekijker had.",
            "feedback": "Onzekerheid over de lezing bewijst niet het tegendeel. De bedoeling of aanvullende waarneming moet worden gecontroleerd."
          }
        ]
      },
      {
        "scenario": "Een instructie zegt expliciet: ‘Controleer medewerkers met tijdelijke toegang en controleer bezoekers met tijdelijke toegang.’",
        "prompt": "Waarom is deze formulering een redelijke verduidelijking?",
        "answer": 2,
        "options": [
          {
            "text": "Zij bewijst dat alle medewerkers altijd tijdelijke toegang hebben.",
            "feedback": "Dat feit wordt niet gegeven. De formulering beperkt juist welke medewerkers en bezoekers onder de controle vallen."
          },
          {
            "text": "Zij maakt iedere controle inhoudelijk terecht zonder verdere norm.",
            "feedback": "Duidelijke taal bepaalt de afspraak maar bewijst haar rechtvaardiging niet. Het doel en de proportionaliteit kunnen nog worden besproken."
          },
          {
            "text": "Zij noemt de beperkende voorwaarde voor beide groepen afzonderlijk.",
            "feedback": "Juist: de grammaticale reikwijdte is nu duidelijk. Dat verheldert de afspraak zonder vanzelf een bredere groep toe te voegen."
          }
        ]
      },
      {
        "scenario": "Een bericht over ‘begeleiders en deelnemers met een certificaat’ leidt tot verschillende taaktoewijzingen.",
        "prompt": "Welke reactie herstelt de relevante onzekerheid?",
        "answer": 0,
        "options": [
          {
            "text": "‘Bedoelen we gecertificeerde begeleiders én gecertificeerde deelnemers, of alle begeleiders? Leg dit afzonderlijk vast.’",
            "feedback": "Juist: de reactie toont het betekenisverschil dat de taken verandert en vraagt bevestiging zonder de breedste lezing op te leggen."
          },
          {
            "text": "‘Kies steeds de grootste groep; dat is automatisch de veiligste betekenis.’",
            "feedback": "Een wenselijke uitkomst bepaalt niet wat was afgesproken. Een bredere taak kan lasten geven en vraagt een afzonderlijke norm."
          },
          {
            "text": "‘Omdat de zin twee lezingen heeft, bestaat geen enkele certificaatafspraak.’",
            "feedback": "Dubbelzinnigheid maakt niet alle afspraken onbestaand. Verduidelijk welke lezing bedoeld is en behoud de bevestigde inhoud."
          }
        ]
      }
    ],
    "puzzle": {
      "scenario": "Een planner leest ‘reinig machines en gereedschap met olieresten’ als opdracht om elke machine te reinigen. Het team heeft de reikwijdte niet bevestigd.",
      "prompt": "Reconstructeer de casus: scheid reden, conclusie, ongeoorloofde stap en gerichte herstelzin.",
      "categories": [
        "Aangevoerde reden",
        "Conclusie",
        "Ongeoorloofde stap",
        "Gerichte herstelzin"
      ],
      "cards": [
        {
          "text": "De instructie noemt machines en gereedschap met olieresten.",
          "category": 0
        },
        {
          "text": "Elke machine moet worden gereinigd.",
          "category": 1
        },
        {
          "text": "De bepaling wordt alleen aan gereedschap gekoppeld zonder bevestiging.",
          "category": 2
        },
        {
          "text": "Vraag of olieresten een voorwaarde zijn voor beide groepen en schrijf ze apart op.",
          "category": 3
        }
      ],
      "explanation": "De conclusie kiest één grammaticale lezing als vaststaand. De herstelzin maakt de taakreikwijdte expliciet in plaats van een nieuwe algemene opdracht te verzinnen."
    },
    "writing": {
      "scenario": "Een toegangsbeleid noemt ‘medewerkers en externe bezoekers met een tijdelijke pas’. Een manager trekt daaruit de conclusie dat alle medewerkers wekelijks opnieuw toestemming moeten aanvragen.",
      "prompt": "Schrijf minimaal 80 woorden. Leg de structurele onzekerheid uit, toets de stap naar wekelijkse toestemming en formuleer een gerichte herformulering.",
      "model": "De bepaling met een tijdelijke pas kan alleen externe bezoekers beperken of ook medewerkers. Ik schrijf die twee groepen daarom afzonderlijk uit en vraag welke reikwijdte bedoeld is. Zelfs onder de brede lezing volgt een wekelijkse aanvraag nog niet: daarvoor is een aanvullende termijnregel nodig. De sterkste zorg is dat onduidelijke toegangstoestemming risico's geeft. Dat maakt verduidelijking urgent, maar bepaalt niet automatisch de ruimste verplichting. Ik vraag naar de bestaande pasduur, verantwoordelijke goedkeuring en de bedoelde groepen. Daarna leg ik voorwaarden per groep expliciet vast. Zo worden grammaticale interpretatie en inhoudelijke norm apart gecontroleerd zonder de onzekerheid als bewijs voor een nieuwe taak te gebruiken.",
      "rubric": [
        "Je schrijft de twee relevante grammaticale lezingen uit.",
        "Je onderscheidt tekstinterpretatie van de aanvullende termijnregel.",
        "Je behandelt een veiligheidsbezwaar zonder de bedoeling te verzinnen.",
        "Je geeft een expliciete herformulering na bevestiging van groep en voorwaarden."
      ]
    },
    "illustration": {
      "title": "Een bepaling kan verschillend worden gekoppeld",
      "invitation": "Vergelijk de stap en haar reikwijdte in beide versies.",
      "sourceId": "tindale",
      "variants": [
        {
          "id": "flaw",
          "label": "De stap schiet tekort",
          "caption": "De conclusie kiest één mogelijke grammaticale koppeling. Zonder bevestiging staat niet vast of de voorwaarde alleen tafels of beide groepen beperkt.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Aangevoerd",
                "text": "‘Vervang stoelen en tafels met losse poten.’",
                "tone": "orange"
              },
              {
                "id": "c",
                "label": "Afgeleide claim",
                "text": "Alle stoelen moeten vervangen worden.",
                "tone": "orange"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "rechtvaardigt deze claim niet",
                "kind": "challenge"
              }
            ],
            "legend": "De kaart lokaliseert de betwiste stap. Een zwakke verdediging bewijst niet vanzelf dat de conclusie onwaar is."
          }
        },
        {
          "id": "repair",
          "label": "Gericht herstellen",
          "caption": "De herstelversie herhaalt de bepaling voor elke groep en maakt het bedoelde bereik expliciet. Zij beslist niet zonder verdere afweging of vervangen beter is dan repareren.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Relevante grond",
                "text": "Bevestigd: vervang stoelen met losse poten én tafels met losse poten.",
                "tone": "blue"
              },
              {
                "id": "c",
                "label": "Beperkte vervolgstap",
                "text": "Beperk de vervangingsopdracht tot de bevestigde beschadigde groepen.",
                "tone": "green"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "draagt deze beperkte reactie",
                "kind": "support"
              }
            ],
            "legend": "Deze verbetering behoudt een beperkte conclusie. Controleer de gegevens, de afweging en eventuele tegenargumenten."
          }
        }
      ]
    }
  },
  {
    "slug": "suggestieve-vraag",
    "name": "Suggestieve vraag",
    "aliases": [
      "loaded question",
      "complex question",
      "plurium interrogationum",
      "vraag met betwiste vooronderstelling"
    ],
    "family": "Taal en aannames",
    "level": "bachelor",
    "sourceTopic": "presumption",
    "mediaIds": [],
    "teaser": "Een vraag kan een nog onbewezen beschuldiging als feit meenemen.",
    "criticalQuestion": "Welke aanname moet de ander slikken om de vraag rechtstreeks te beantwoorden?",
    "sections": [
      {
        "title": "Een vraag neemt het betwiste al mee",
        "body": "Een suggestieve vraag kan een gewenste reactie sturen. Hier onderzoeken we vooral de vraag die een nog betwiste vooronderstelling als gegeven behandelt. “Wanneer herstel je de kosten die je bewust verborg?” vraagt een tijdstip en neemt tegelijk verbergen en bedoeling aan. Een antwoord over morgen of volgende week lijkt die aanname te bevestigen. De beoordelingsvraag is daarom niet alleen welke woorden gebruikt worden, maar wat een rechtstreeks antwoord al moet aanvaarden. Maak de onderliggende beweringen zichtbaar en vraag welke steun ze hebben. Een vraag is geen gewone premisse met waarheidswaarde, maar kan in het gesprek toch een onterechte bewijslast of beschuldiging opleggen.",
        "example": "Een herstelvraag kan eerst een feitencontrole nodig hebben: is er werkelijk een fout vastgesteld?",
        "takeaway": "Splits de verborgen bewering van de gevraagde informatie."
      },
      {
        "title": "Wanneer vooronderstellingen wél redelijk zijn",
        "body": "Vragen hoeven niet zonder iedere aanname te worden gesteld. Als de betrokken fout is vastgesteld of erkend, kan “Wanneer herstellen we die fout?” een nuttige volgende stap zijn. Een intake kan ook op gedeelde gegevens voortbouwen. Het probleem ontstaat wanneer de aanname nog relevant wordt betwist en de vraag haar toch als vaststaand insluit. Een richtinggevende vraag in een oefening hoeft evenmin een onterechte beschuldiging te zijn. Controleer of de respondent de aanname mag ontkennen, nuanceren of uitleggen. Een bevestigd bedrag is geen bevestigde bedoeling; een gemiste afspraak is geen bewijs van bewuste tegenwerking. Houd de vooronderstelling even beperkt als de werkelijk vastgestelde informatie.",
        "example": "Na erkenning van een verkeerd adres is een herstelvraag redelijk; opzet blijft een apart te onderbouwen oordeel.",
        "takeaway": "Gedeelde feiten mogen vragen dragen; ongecontroleerde extra aannames niet."
      },
      {
        "title": "Herstel zonder ontwijking",
        "body": "Een goede reactie kan de vraag zelf corrigeren: “Ik erken de ontbrekende post, maar niet dat ik haar bewust verborg. Welke aanwijzingen dragen die beschuldiging?” Daarna kan de relevante herstelvraag worden beantwoord. Het sterkste bezwaar is dat iemand met deze techniek iedere verantwoordelijkheid probeert te ontlopen. Dat risico verdient aandacht: een ontkende vooronderstelling mag al vastgestelde feiten niet verdwijnen laten. Benoem daarom wat is geaccepteerd, wat betwist wordt en welke vraag je wel kunt beantwoorden. De vraagsteller moet de toegevoegde beschuldiging onderbouwen of neutraler formuleren. Een leider vervangt een beschuldigend pakket door opeenvolgende controles: gebeurtenis, verantwoordelijkheid, bedoeling en passende actie. Zo krijgt het gesprek informatie zonder een gedwongen bekentenis te organiseren.",
        "example": "“Welke posten ontbreken, hoe ontstond dat en wanneer kunnen we de registratie aanvullen?” behandelt de onderdelen afzonderlijk.",
        "takeaway": "Betwist een ongedekte aanname en beantwoord tegelijk wat wel vastgesteld is."
      }
    ],
    "deepDive": {
      "title": "Vooronderstelling en een oneerlijke verschuiving van bewijslast",
      "body": "Niet elke vraag is een argument en niet elke suggestie is een drogreden. Toch kan een vraag een discussie structureren alsof een claim al gewonnen is. De respondent moet dan een beschuldiging weerleggen die de vraagsteller nog niet heeft onderbouwd. De fout betreft die gesprekszet en de aanvaarding die een rechtstreeks antwoord lijkt mee te brengen.\n\nSchrijf daarom de verborgen aannames als afzonderlijke uitspraken uit. Vraag welke al gedeeld zijn en welke nieuw worden toegevoegd. Een vraag over herhaling kan bovendien aannemen dat iets eerder gebeurde; een vraag over stoppen kan een voortgaande praktijk veronderstellen. De relevante context bepaalt of dat redelijk is.\n\nReparatie is geen automatische vrijspraak. Een betwiste bedoeling laat een bewezen fout bestaan. Evenmin verplicht eerlijke samenwerking tot antwoorden binnen een onjuiste formulering. Een passende reactie maakt feiten, interpretaties en normatieve oordelen apart bespreekbaar en geeft voor elk een eigen bewijsroute. Zo kan verantwoording doorgaan zonder schijnbare bekentenis."
    },
    "starter": {
      "scenario": "Een voorzitter vraagt: ‘Wanneer stop je met het achterhouden van roosterwijzigingen?’ Het is nog niet vastgesteld dat iemand wijzigingen achterhield.",
      "prompt": "Welke aanname zit al in de vraag?",
      "answer": 0,
      "options": [
        {
          "text": "Dat de medewerker roosterwijzigingen achterhoudt.",
          "feedback": "Juist: een rechtstreeks tijdantwoord lijkt dit gedrag al te erkennen. De vraagsteller moet eerst passende steun voor de aanname geven."
        },
        {
          "text": "Dat iedere roosterwijziging verboden is.",
          "feedback": "Dat staat niet in de vraag. Het verborgen oordeel betreft het achterhouden, niet een algemene norm tegen wijzigingen."
        },
        {
          "text": "Dat de medewerker altijd op tijd informatie geeft.",
          "feedback": "De vraag veronderstelt juist een tekortkoming. Een ongedekte beschuldiging mag niet als vaststaand uitgangspunt worden behandeld."
        }
      ],
      "bridge": "Maak straks eerst zichtbaar wat al bewezen is en welke extra aanname de vraag toevoegt."
    },
    "inquiry": {
      "scenario": "Bij een ontbrekende taaknotitie vraagt manager A waarom de medewerker opnieuw afspraken negeert. Er is alleen een ontbrekende notitie vastgesteld. Manager B vraagt welke notitie ontbreekt en hoe dat is ontstaan, voordat zij gedrag of herhaling beoordeelt.",
      "prompt": "Welke extra aannames voegt A toe? Geef een antwoord dat de notitiefout serieus neemt zonder de beschuldiging automatisch te accepteren.",
      "model": "A voegt minstens toe dat de ontbrekende notitie het negeren van een afspraak betekent en dat dit herhaald gebeurt. Die claims zijn niet door de enkele ontbrekende notitie bewezen. Ik kan erkennen dat de registratie onvolledig is, aangeven hoe ik haar herstel en vragen welke informatie herhaling of bewust negeren onderbouwt. B houdt de feitenvraag en de interpretatie apart. Dat maakt verantwoordelijkheid niet overbodig; het voorkomt dat een tijdig herstelantwoord als bekentenis van een ruimere gedragsclaim geldt. Na controle kan een patroon blijken, maar die conclusie krijgt dan eigen gegevens en een passende omvang.",
      "followUp": "Stel nu dat twee eerdere erkende fouten wel vaststaan. Welke vraag over herhaling is redelijker en welke opzetclaim blijft apart?"
    },
    "core": {
      "scenario": "Een coördinator vraagt: ‘Hoe lang blijf je collega's met jouw verkeerde planning benadelen?’ Er staat alleen een betwiste planning op de agenda.",
      "prompt": "Welke reactie is het meest precies?",
      "answer": 1,
      "options": [
        {
          "text": "‘Een onhandige vraag bewijst dat mijn planning optimaal is.’",
          "feedback": "De vraag kan onbewezen aannames bevatten, maar maakt de planning niet automatisch goed. De inhoudelijke bezwaren blijven te controleren."
        },
        {
          "text": "‘Welke planningsfout en benadeling zijn vastgesteld? Daarna kunnen we herstel en verantwoordelijkheid bespreken.’",
          "feedback": "Juist: de reactie splitst de aangenomen fout en gevolgclaims zonder alle beoordeling te weigeren."
        },
        {
          "text": "‘Binnen twee dagen’, zodat de bespreking snel klaar is.",
          "feedback": "Een tijdantwoord kan de nog betwiste fout en benadeling als erkend laten lijken. Verduidelijk eerst welke aannames werkelijk gedeeld zijn."
        }
      ]
    },
    "assessment": [
      {
        "scenario": "Een manager vraagt aan een medewerker: ‘Waarom blijf je rapporten vervalsen?’ Er is alleen één onverklaard verschil tussen twee tabellen.",
        "prompt": "Wat gaat de vraag te ver aannemen?",
        "answer": 2,
        "options": [
          {
            "text": "Dat de tabellen ooit met elkaar kunnen worden vergeleken.",
            "feedback": "Vergelijking is juist een passende controle. Het probleem zit in de toegevoegde conclusie over vervalsing en herhaling."
          },
          {
            "text": "Dat ieder tabelverschil noodzakelijk onbelangrijk is.",
            "feedback": "Ook dat volgt niet. Het verschil kan ernstig zijn en vraagt uitleg, zonder dat bewuste herhaalde vervalsing al vaststaat."
          },
          {
            "text": "Dat bewuste vervalsing en voortzetting al vaststaan.",
            "feedback": "Juist: een verschil alleen draagt die ruimere beschuldigingen niet. Behandel verschil, oorzaak en eventuele opzet afzonderlijk."
          }
        ]
      },
      {
        "scenario": "Een team heeft een verkeerd bestelde hoeveelheid erkend en de relevante bon gezamenlijk gecontroleerd. De leider vraagt wanneer de bestelling kan worden gecorrigeerd.",
        "prompt": "Waarom kan deze vraag redelijk zijn?",
        "answer": 0,
        "options": [
          {
            "text": "Zij bouwt beperkt voort op een gedeeld, gecontroleerd feit.",
            "feedback": "Juist: de fout is erkend en de vraag gaat over herstel. Zij hoeft geen nog onbewezen bedoeling of ander patroon toe te voegen."
          },
          {
            "text": "Een leider hoeft nooit onderliggende aannames te controleren.",
            "feedback": "Ook leiders moeten aannames onderbouwen wanneer zij betwist worden. De casus maakt juist duidelijk dat de relevante fout al is vastgesteld."
          },
          {
            "text": "Een erkende fout bewijst dat alle toekomstige bestellingen zullen mislukken.",
            "feedback": "Dat gaat verder dan het gecontroleerde geval. Een herstelvraag mag de beperkte fout niet in een algemene voorspelling veranderen."
          }
        ]
      },
      {
        "scenario": "Een medewerker erkent dat informatie te laat kwam, maar betwist dat dit opzettelijk was. De voorzitter blijft vragen wanneer hij stopt met saboteren.",
        "prompt": "Welke herstelzin houdt verantwoording open?",
        "answer": 1,
        "options": [
          {
            "text": "‘Omdat opzet betwist wordt, is er geen late informatie meer.’",
            "feedback": "Een betwiste bedoeling wist de erkende vertraging niet uit. De gevolgen en het herstel van die vertraging blijven relevant."
          },
          {
            "text": "‘We bespreken herstel van de late informatie; welke eigen aanwijzingen ondersteunen de opzetclaim?’",
            "feedback": "Juist: de zin behandelt het erkende feit en vraagt aparte steun voor de extra beschuldiging."
          },
          {
            "text": "‘Wie niet direct op saboteren antwoordt, geeft automatisch toe.’",
            "feedback": "Dit maakt betwisten onmogelijk en verplaatst de bewijslast onterecht. Een respondent mag de ongedekte formulering corrigeren."
          }
        ]
      }
    ],
    "puzzle": {
      "scenario": "Een voorzitter vraagt wanneer een planner eindelijk ophoudt budgetten te verbergen. Er is alleen een ontbrekende bijlage gemeld.",
      "prompt": "Reconstructeer de casus: scheid reden, conclusie, ongeoorloofde stap en gerichte herstelzin.",
      "categories": [
        "Aangevoerde reden",
        "Conclusie",
        "Ongeoorloofde stap",
        "Gerichte herstelzin"
      ],
      "cards": [
        {
          "text": "Een vraag naar stoppen gebruikt de ontbrekende bijlage als aanleiding.",
          "category": 0
        },
        {
          "text": "De planner verbergt voortdurend budgetinformatie.",
          "category": 1
        },
        {
          "text": "Een onvolledig document wordt zonder steun bewuste, voortdurende verberging.",
          "category": 2
        },
        {
          "text": "Welke bijlage ontbreekt, hoe ontstond dat en welke aanwijzingen dragen de bedoeling?",
          "category": 3
        }
      ],
      "explanation": "De vraag kan informatie vragen en tegelijk ongedekte claims insluiten. Herstel splitst het concrete gebrek en de ruimere beschuldiging."
    },
    "writing": {
      "scenario": "Na één gemiste terugbelafspraak vraagt een manager waarom een medewerker klanten steeds bewust negeert. Over eerdere afspraken en bedoeling is niets vastgesteld.",
      "prompt": "Schrijf minimaal 80 woorden. Maak de vooronderstellingen expliciet en formuleer een antwoord dat de echte afspraak wel behandelt.",
      "model": "De gemiste afspraak is één concrete gebeurtenis. De vraag voegt herhaling en bewust negeren toe, terwijl daarvoor nog geen gegevens zijn genoemd. Ik erken of controleer de afspraak, geef aan hoe de klant alsnog wordt geholpen en vraag apart welke meldingen de herhalingsclaim dragen. Een oorzaak kan worden onderzocht zonder meteen opzet te veronderstellen. Het sterkste bezwaar tegen deze reactie is mogelijk ontwijken; daarom behandel ik de erkende vertraging en gevolgen expliciet. De manager kan daarna een neutralere vraag stellen over wat gebeurde, welke verantwoordelijkheid bestaat en welk herstel nodig is. Zo blijft verantwoording mogelijk zonder een ongedekte algemene bekentenis.",
      "rubric": [
        "Je scheidt gebeurtenis, herhaling en bedoeling.",
        "Je toont welke aanname een rechtstreeks antwoord zou laten erkennen.",
        "Je behandelt de concrete afspraak en een mogelijk ontwijkingsbezwaar.",
        "Je formuleert neutrale opeenvolgende vragen met passende eigen bewijslast."
      ]
    },
    "illustration": {
      "title": "Een vraag draagt verborgen beweringen",
      "invitation": "Vergelijk de stap en haar reikwijdte in beide versies.",
      "sourceId": "tindale",
      "variants": [
        {
          "id": "flaw",
          "label": "De stap schiet tekort",
          "caption": "De vraag sluit een beschuldiging in; een rechtstreeks tijdantwoord mag niet als bewijs dienen wanneer gedrag en bedoeling nog betwist worden.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Aangevoerd",
                "text": "‘Wanneer stop je met bewuste tegenwerking?’",
                "tone": "orange"
              },
              {
                "id": "c",
                "label": "Afgeleide claim",
                "text": "Bewuste tegenwerking is al vastgesteld.",
                "tone": "orange"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "rechtvaardigt deze claim niet",
                "kind": "challenge"
              }
            ],
            "legend": "De kaart lokaliseert de betwiste stap. Een zwakke verdediging bewijst niet vanzelf dat de conclusie onwaar is."
          }
        },
        {
          "id": "repair",
          "label": "Gericht herstellen",
          "caption": "Deze versie behoudt het vastgestelde feit zonder er automatisch opzet of herhaling aan toe te voegen. Verantwoording en eerlijke bewijsvoering blijven beide mogelijk.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Relevante grond",
                "text": "Een ontbrekende taakregistratie is erkend; bedoeling is nog onbekend.",
                "tone": "blue"
              },
              {
                "id": "c",
                "label": "Beperkte vervolgstap",
                "text": "Vraag herstel van de registratie en toets bedoeling afzonderlijk.",
                "tone": "green"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "draagt deze beperkte reactie",
                "kind": "support"
              }
            ],
            "legend": "Deze verbetering behoudt een beperkte conclusie. Controleer de gegevens, de afweging en eventuele tegenargumenten."
          }
        }
      ]
    }
  },
  {
    "slug": "cirkelredenering",
    "name": "Cirkelredenering",
    "aliases": [
      "circular reasoning",
      "begging the question",
      "petitio principii"
    ],
    "family": "Taal en aannames",
    "level": "bachelor",
    "sourceTopic": "presumption",
    "mediaIds": [],
    "teaser": "Een claim bewijst zichzelf niet door haar te herhalen of terug te laten keren.",
    "criticalQuestion": "Kun je de reden aanvaarden zonder de betwiste conclusie al aan te nemen?",
    "sections": [
      {
        "title": "De conclusie zit al in haar eigen steun",
        "body": "Een cirkelredenering verdedigt een conclusie met een reden die dezelfde conclusie al veronderstelt. “Dit plan verdient steun, want het is een plan dat we zouden moeten steunen” geeft geen nieuwe grond. Soms wordt de cirkel met andere woorden verborgen. Soms loopt zij via meer stappen: het document is betrouwbaar omdat de auteur betrouwbaar is, en de auteur is betrouwbaar omdat dit document dat zegt. Vraag welke reden onafhankelijk aanvaardbaar is. De fout maakt de conclusie niet automatisch onwaar. Ook een ware claim kan zonder goede uitleg worden verdedigd. Een cirkel herken je aan de afhankelijkheid van de steun, niet alleen aan letterlijke herhaling van een woord.",
        "example": "“De procedure is juist omdat zij de juiste procedure is” benoemt geen toets van de procedure.",
        "takeaway": "Zoek waar aanvaarding van de reden de conclusie al nodig heeft."
      },
      {
        "title": "Wanneer herhalen of teruggrijpen wél redelijk is",
        "body": "Een herhaling kan als samenvatting, definitie of verduidelijking nuttig zijn zonder bewijs te leveren. Als beide partijen een premisse al onafhankelijk aanvaarden, mag je haar ook gebruiken om een gevolg uit te werken. Een gecontroleerde vergelijking kan bijvoorbeeld aantonen dat een plan aan gedeelde criteria voldoet; een conclusie daarover herhaalt geen onbewezen voorkeur. Verschillende bewijsroutes mogen elkaar bovendien ondersteunen als hun gronden werkelijk afzonderlijk beschikbaar zijn. Noem daarom wat de spreker probeert te doen: uitleg van een betekenis, toepassing van een afspraak of verdediging van een betwiste claim. De fout ontstaat wanneer afhankelijke steun als nieuwe rechtvaardiging wordt gepresenteerd. Een aangekondigde aanname is eerlijker dan een schijnbewijs dat haar eigen waarheid moet produceren.",
        "example": "Een omschrijving van “compleet” kan verduidelijken welke velden nodig zijn; gecontroleerde velden leveren daarna pas het bewijs.",
        "takeaway": "Een definitie verduidelijkt; zij bewijst de toepassing niet vanzelf."
      },
      {
        "title": "Herstel met een onafhankelijke grond",
        "body": "Vraag welke waarneming, regel of afweging beschikbaar is zonder eerst de conclusie te accepteren. Maak de afhankelijkheden zichtbaar en zoek de zwakke terugkeer. Het sterkste bezwaar tegen die eis is dat niet ieder uitgangspunt weer volledig bewezen kan worden. Dat klopt: een gesprek kan werken met gedeelde basisaannames, afgesproken doelen en voorlopig vertrouwen. Benoem die status eerlijk en controleer of het betwiste juist daarin wordt verstopt. “We nemen toegankelijkheid als doel; dit plan verbetert toegang volgens deze gegevens” is opener dan “dit plan is goed omdat het goede toegang geeft” zonder betekenis of gegevens. Herstel kan dus een echte bewijsroute, een kleinere conclusie of een expliciet voorstel voor een uitgangspunt zijn.",
        "example": "Een plan wordt verdedigd met bereikbare tijden, kosten en gedeelde doelen in plaats van de naam “beste oplossing”.",
        "takeaway": "Maak steun onafhankelijk of vermeld eerlijk wat voorlopig wordt aangenomen."
      }
    ],
    "deepDive": {
      "title": "Geldige vorm is nog geen nieuwe rechtvaardiging",
      "body": "De eenvoudige vorm A, dus A is deductief geldig: een ware premisse kan daar geen onware conclusie opleveren. Toch geeft zij iemand die A betwist geen onafhankelijke reden om A te aanvaarden. Geldigheid en bruikbare rechtvaardiging zijn daarom verschillende controles. Het probleem van een cirkel ligt vaak in de aanvaardbaarheid of bewijsafhankelijkheid van de premisse.\n\nEen lange keten kan dezelfde afhankelijkheid verbergen. Noteer waarom iedere bron wordt vertrouwd en waar dat vertrouwen terugkomt bij de te verdedigen claim. Twee rapporten die elkaar als enige grond noemen worden niet onafhankelijk door hun aantal.\n\nNiet iedere samenhang van opvattingen is zo'n fout. Een gedeeld criterium toepassen of een definitie uitwerken kan legitiem zijn als de uitgangspunten apart vaststaan en het doel duidelijk is. De vraag blijft wat deze discussie nog moet aantonen. Eerlijk omgaan met fundamentele aannames maakt een argument beperkt en toetsbaar in plaats van kunstmatig zelfbevestigend."
    },
    "starter": {
      "scenario": "Een voorzitter zegt: ‘We moeten dit voorstel kiezen, want dit is het voorstel dat gekozen moet worden.’",
      "prompt": "Welke nieuwe grond wordt gegeven?",
      "answer": 1,
      "options": [
        {
          "text": "Een gecontroleerde vergelijking van alternatieven.",
          "feedback": "Die vergelijking staat niet in de reden. De uitspraak herhaalt het gewenste oordeel met andere woorden."
        },
        {
          "text": "Geen onafhankelijke grond; het keuzeoordeel wordt opnieuw uitgesproken.",
          "feedback": "Juist: aanvaarden van deze reden vraagt de conclusie al. Een extra criterium of gegeven moet de keuze inhoudelijk ondersteunen."
        },
        {
          "text": "Een bewijs dat het voorstel noodzakelijk verkeerd is.",
          "feedback": "Een slechte verdediging bewijst geen verkeerde keuze. Het voorstel kan met andere, onafhankelijke redenen worden ondersteund."
        }
      ],
      "bridge": "Breng straks de steunafhankelijkheden in kaart en onderscheid definitie, aanname en echt bewijs."
    },
    "inquiry": {
      "scenario": "Een team noemt een checklist compleet omdat zij alle benodigde onderdelen bevat. Op de vraag welke onderdelen nodig zijn verwijst het alleen naar diezelfde checklist. Een andere versie vergelijkt de checklist met een apart overeengekomen takenoverzicht.",
      "prompt": "Waar keert de eerste bewijsroute terug naar haar eigen conclusie? Welke onafhankelijke grond biedt de tweede versie?",
      "model": "De eerste versie bepaalt de benodigde onderdelen uitsluitend met de lijst die juist op volledigheid wordt beoordeeld. Aanvaarden dat de lijst volledig is, vereist daardoor al dat haar eigen selectie als volledig geldt. De tweede versie gebruikt een afzonderlijk overeengekomen takenoverzicht en kan de onderdelen zichtbaar vergelijken. Ook dat overzicht moet passend zijn voor de huidige taak, maar het is niet alleen een herhaling van de te toetsen lijst. Ik vraag welk criterium vooraf is afgesproken, welke onderdelen eronder vallen en waar de checklist daarvan afwijkt. De conclusie kan daarna beperkt luiden dat zij dit overzicht dekt, zonder alle denkbare toekomstige taken te garanderen.",
      "followUp": "Wat verandert als het aparte overzicht volledig uit dezelfde checklist is gekopieerd? Herzie de beweerde onafhankelijkheid."
    },
    "core": {
      "scenario": "Een kwaliteitsplan heet betrouwbaar omdat een rapport dat zegt. Het rapport geldt als betrouwbaar omdat het juist dit kwaliteitsplan aanbeveelt. Er zijn geen andere gronden genoemd.",
      "prompt": "Wat moet worden toegevoegd?",
      "answer": 2,
      "options": [
        {
          "text": "Nogmaals hetzelfde plan in een tweede taal.",
          "feedback": "Een andere formulering verandert de bewijsafhankelijkheid niet. Zonder eigen grond blijft de steun terugkeren naar dezelfde claim."
        },
        {
          "text": "De algemene conclusie dat rapporten nooit bruikbaar zijn.",
          "feedback": "Een rapport kan bruikbare onafhankelijke gegevens bevatten. Het probleem betreft de hier gegeven gesloten vertrouwensroute."
        },
        {
          "text": "Een passende grond voor plan of rapport die niet al op deze aanbeveling berust.",
          "feedback": "Juist: de wederzijdse bevestiging geeft zonder afzonderlijke steun geen nieuwe reden. Zoek methode, gegevens of onafhankelijk geaccepteerde criteria."
        }
      ]
    },
    "assessment": [
      {
        "scenario": "Een organisatie noemt haar service uitstekend omdat zij voortreffelijke service biedt. De termen worden als synoniemen gebruikt en er staan geen gegevens bij.",
        "prompt": "Waar zit de ontoereikende steun?",
        "answer": 0,
        "options": [
          {
            "text": "De reden herformuleert alleen het oordeel dat zij moet ondersteunen.",
            "feedback": "Juist: de synoniemen geven iemand die het oordeel betwist geen onafhankelijke kwaliteitsgrond."
          },
          {
            "text": "Het gebruik van synoniemen maakt elke uitspraak feitelijk onwaar.",
            "feedback": "Synoniemen kunnen duidelijkheid of stijl geven. De fout is hun presentatie als bewijs, niet automatische onwaarheid."
          },
          {
            "text": "Er mogen alleen cijfers als redenen worden gebruikt.",
            "feedback": "Ook andere passende gegevens en afwegingen kunnen steun geven. Ze moeten alleen meer bieden dan de betwiste conclusie zelf."
          }
        ]
      },
      {
        "scenario": "De afspraken noemen drie verplichte controlevelden. Een medewerker toont onafhankelijk dat alle drie velden zijn ingevuld en concludeert dat deze veldcontrole compleet is.",
        "prompt": "Waarom kan dit redelijk zijn?",
        "answer": 2,
        "options": [
          {
            "text": "De conclusie bewijst dat geen enkele andere kwaliteitscontrole nodig kan zijn.",
            "feedback": "Dat gaat buiten het bereik van deze drie velden. Andere doelen of taken kunnen aanvullende controles vragen."
          },
          {
            "text": "Het woord compleet maakt iedere redenering een cirkel.",
            "feedback": "Hetzelfde woord kan een getoetst criterium benoemen. Kijk naar de bewijsroute en niet alleen naar een terugkerende term."
          },
          {
            "text": "Een afzonderlijk criterium en gecontroleerde toepassing dragen de beperkte conclusie.",
            "feedback": "Juist: de conclusie berust op meer dan haar eigen herhaling. De claim blijft beperkt tot de genoemde veldcontrole."
          }
        ]
      },
      {
        "scenario": "Een trainer noemt zijn methode goed omdat zij voldoet aan ‘de beste aanpak’, en definieert die aanpak alleen als zijn methode.",
        "prompt": "Welke herstelvraag zoekt echte steun?",
        "answer": 1,
        "options": [
          {
            "text": "‘Kun je de methode nog vaker als beste omschrijven?’",
            "feedback": "Herhaling verhoogt de bewijskracht niet. De beoordeling keert nog steeds naar de methode zelf terug."
          },
          {
            "text": "‘Welke vooraf verdedigbare doelen en gegevens vergelijken deze methode met alternatieven?’",
            "feedback": "Juist: doelen en vergelijkingen kunnen onafhankelijker worden onderbouwd en laten de uitkomst van de beoordeling open."
          },
          {
            "text": "‘Een cirkel betekent dat iedere methode van deze trainer verkeerd is.’",
            "feedback": "De fout weerlegt deze verdediging, niet automatisch elke methode of toekomstige uitspraak van de trainer."
          }
        ]
      }
    ],
    "puzzle": {
      "scenario": "Een manager noemt een roostersysteem geschikt omdat het het juiste systeem is. Op de vraag wat juist betekent antwoordt hij alleen ‘geschikt voor ons’.",
      "prompt": "Reconstructeer de casus: scheid reden, conclusie, ongeoorloofde stap en gerichte herstelzin.",
      "categories": [
        "Aangevoerde reden",
        "Conclusie",
        "Ongeoorloofde stap",
        "Gerichte herstelzin"
      ],
      "cards": [
        {
          "text": "Het systeem wordt opnieuw als het juiste systeem omschreven.",
          "category": 0
        },
        {
          "text": "Dit roostersysteem is geschikt voor ons.",
          "category": 1
        },
        {
          "text": "De rechtvaardiging herformuleert de betwiste geschiktheid zonder apart criterium.",
          "category": 2
        },
        {
          "text": "Vergelijk dekking, lasten en uitzonderingen met vooraf onderbouwde roosterdoelen.",
          "category": 3
        }
      ],
      "explanation": "De twee woorden dragen dezelfde betwiste beoordeling. Een echte controle gebruikt doelen en gegevens die niet alleen uit de voorkeur voor dit systeem komen."
    },
    "writing": {
      "scenario": "Een team noemt een leverancier betrouwbaar op grond van een aanbeveling. De aanbeveling wordt uitsluitend vertrouwd omdat zij diezelfde leverancier als betrouwbaar aanmerkt. Een coördinator voegt toe: ‘Alle betrouwbare leveranciers krijgen een aanbeveling; deze krijgt er een.’",
      "prompt": "Schrijf minimaal 80 woorden. Reconstrueer de afhankelijkheid, bespreek ook de mogelijke ongeldige omkering en geef een onafhankelijke herstelroute.",
      "model": "De aanbeveling draagt betrouwbaarheid niet als zij alleen op diezelfde aanname berust. Bovendien volgt uit betrouwbare leveranciers worden aanbevolen en deze leverancier wordt aanbevolen niet dat deze betrouwbaar is: ook andere leveranciers kunnen een aanbeveling krijgen. Ik vraag daarom wie aanbeveelt, op welke gegevens en onder welke criteria. Een apart controleerbaar leveringsverleden, foutenafhandeling en contractdekking kunnen meer steun geven. Het sterkste bezwaar is dat volledige zekerheid niet haalbaar is. Dat vraagt een beperkte voorlopige conclusie, geen zelfbevestigend bewijs. Ik onderscheid de mogelijke cirkel van de omgekeerde gevolgtrekking en beoordeel beide routes voordat ik de leverancier aanbeveel.",
      "rubric": [
        "Je maakt de afhankelijke vertrouwensroute zichtbaar.",
        "Je onderscheidt cirkelredenering van een eventuele ongeldige omkering.",
        "Je noemt onafhankelijke criteria en passende gegevens.",
        "Je houdt de conclusie voorlopig zonder onhaalbare zekerheid of zelfbevestiging."
      ]
    },
    "illustration": {
      "title": "Steun die naar zichzelf terugkeert",
      "invitation": "Vergelijk de stap en haar reikwijdte in beide versies.",
      "sourceId": "tindale",
      "variants": [
        {
          "id": "flaw",
          "label": "De stap schiet tekort",
          "caption": "De reden herhaalt het betwiste oordeel zonder een afzonderlijk gegeven of criterium. De conclusie kan waar zijn maar krijgt hiermee geen nieuwe steun.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Aangevoerd",
                "text": "Het plan is verantwoord omdat het verantwoord is.",
                "tone": "orange"
              },
              {
                "id": "c",
                "label": "Afgeleide claim",
                "text": "Dit plan verdient onze aanvaarding.",
                "tone": "orange"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "rechtvaardigt deze claim niet",
                "kind": "challenge"
              }
            ],
            "legend": "De kaart lokaliseert de betwiste stap. Een zwakke verdediging bewijst niet vanzelf dat de conclusie onwaar is."
          }
        },
        {
          "id": "repair",
          "label": "Gericht herstellen",
          "caption": "Deze versie geeft een aparte toetsbare grond en bewaart haar bereik. Voldoen aan één grens betekent geen volledige geschiktheid voor ieder ander doel.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Relevante grond",
                "text": "Een vooraf afgesproken kwaliteitsgrens is met onafhankelijke gegevens gecontroleerd.",
                "tone": "blue"
              },
              {
                "id": "c",
                "label": "Beperkte vervolgstap",
                "text": "Het plan voldoet voorlopig aan die beperkte kwaliteitsgrens.",
                "tone": "green"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "draagt deze beperkte reactie",
                "kind": "support"
              }
            ],
            "legend": "Deze verbetering behoudt een beperkte conclusie. Controleer de gegevens, de afweging en eventuele tegenargumenten."
          }
        }
      ]
    }
  },
  {
    "slug": "vals-dilemma",
    "name": "Vals dilemma",
    "aliases": [
      "false dilemma",
      "false dichotomy",
      "false binary",
      "of-of-drogreden"
    ],
    "family": "Taal en aannames",
    "level": "bachelor",
    "sourceTopic": "presumption",
    "mediaIds": [],
    "teaser": "Twee genoemde mogelijkheden hoeven niet alle relevante mogelijkheden te zijn.",
    "criticalQuestion": "Zijn de aangeboden opties werkelijk volledig en passend voor deze keuze?",
    "sections": [
      {
        "title": "De ontbrekende mogelijkheid",
        "body": "Een vals dilemma presenteert opties als volledig terwijl een relevante derde mogelijkheid, combinatie of tussenvorm ten onrechte verdwijnt. “Je steunt dit hele plan of je bent tegen verbetering” sluit kritiek op één onderdeel uit. De logische vorm kan overtuigend lijken: als er alleen A of B is en A niet gekozen wordt, volgt B. Het probleem zit dan in de ongedekte volledigheidspremisse. Maak de alternatieven expliciet en vraag wat de andere opties uitsluit. Let ook op tegengestelden die geen logische aanvullingen zijn. Niet enthousiast is niet hetzelfde als vijandig; iemand kan afwachten of voorwaarden stellen. Een keuze kan bovendien meerdere dimensies bevatten, zoals tempo, budget en doelgroep.",
        "example": "Een medewerker die niet vóór directe invoering is, hoeft niet tegen elke vorm van invoering te zijn.",
        "takeaway": "Toets de volledigheid van de keuzeruimte, niet alleen de aantrekkelijke tegenstelling."
      },
      {
        "title": "Wanneer twee opties wél redelijk zijn",
        "body": "Een echte binaire vraag kan een volledige verdeling hebben. Een concreet bestand is binnen een afgesproken definitie geregistreerd of niet geregistreerd. Ook praktische beperkingen kunnen aantoonbaar slechts twee uitvoerbare opties overlaten, bijvoorbeeld wanneer andere routes op relevante voorwaarden afvallen. Noem die voorwaarden en laat hun juistheid controleren. Het bestaan van twee opties maakt een argument dus niet automatisch drogredelijk; het bestaan van een denkbare derde optie maakt haar evenmin automatisch uitvoerbaar. Onderscheid logische mogelijkheden, werkelijk beschikbare alternatieven en normatief aanvaardbare keuzes. Een goede beperkte vergelijking kan A en B beoordelen zonder te beweren dat de wereld uitsluitend uit A en B bestaat. Haar conclusie moet dat beperkte bereik behouden.",
        "example": "Na controle blijken twee beschikbare lokalen de vereiste capaciteit te hebben; een kleiner lokaal is geen gelijkwaardig uitvoerbaar alternatief.",
        "takeaway": "Twee keuzes kunnen voldoende zijn als bereik en uitsluitingsgronden werkelijk worden onderbouwd."
      },
      {
        "title": "Herstel de alternatieven zonder besluitloosheid",
        "body": "Herstel begint met één relevante ontbrekende optie en de voorwaarden waaronder zij uitvoerbaar is. “Kunnen we een begrensde proef doen in plaats van alles invoeren of alles afwijzen?” doorbreekt een valse tegenstelling zonder meteen de beste oplossing te bewijzen. Het sterkste bezwaar is dat eindeloos alternatieven toevoegen een noodzakelijk besluit vertraagt. Beperk daarom de zoektocht tot doel, termijn, middelen en gevolgen. Geef redenen waarom een alternatief afvalt en maak onzekerheid zichtbaar. Een leider kan kiezen tussen twee overblijvende routes nadat andere serieus zijn beoordeeld. De fout is niet kiezen, maar de keuze rechtvaardigen met een verzonnen volledige tegenstelling of een ongegronde morele indeling van deelnemers. Behandel gedeeltelijke steun en principiële kritiek als zelfstandige posities.",
        "example": "Vergelijk volledige uitrol, beperkte proef en uitstel op dezelfde concrete eisen en leg vast waarom een optie afvalt.",
        "takeaway": "Maak de keuzeruimte eerlijk en eindig genoeg om een verantwoord besluit mogelijk te houden."
      }
    ],
    "deepDive": {
      "title": "Tegengesteld is niet hetzelfde als aanvullend",
      "body": "Bij een logisch aanvullende verdeling vallen alle gevallen onder P of niet-P. Dat zegt niet dat twee gewone tegengestelden dezelfde volledigheid hebben. Niet onze vriend is niet automatisch onze vijand. Niet volledig succesvol is niet automatisch een totale mislukking. De tussenruimte kan voor een praktisch oordeel essentieel zijn.\n\nEen dilemma kan daarom op twee plaatsen misgaan: in de indeling van personen of eigenschappen, en in de inventarisatie van acties. Een neutrale medewerker en een voorwaardelijk proefvoorstel verdwijnen op verschillende manieren. Benoem welke volledigheidspremisse de conclusie gebruikt.\n\nOok bij meer dan twee opties kan een onvolledige keuzeruimte worden gepresenteerd. Het getal twee is geen noodzakelijke foutindicator. Omgekeerd kan een werkelijk binaire beslissing legitiem zijn. Zoek een relevant tegengeval of haalbaar alternatief en controleer de uitsluitingsgronden. Herstel bepaalt nog niet welke optie moet winnen; het maakt de afweging eerlijker door haar werkelijke mogelijkheden zichtbaar te houden."
    },
    "starter": {
      "scenario": "Een manager zegt: ‘Wie deze hele regeling niet direct steunt, wil geen betere samenwerking.’ Een medewerker wil één onderdeel aanpassen.",
      "prompt": "Welke mogelijkheid verdwijnt?",
      "answer": 1,
      "options": [
        {
          "text": "Dat verbetering zonder enig overleg altijd lukt.",
          "feedback": "Dat is niet de genoemde positie en wordt niet aangetoond. Een herstel moet een werkelijk relevante optie terugbrengen."
        },
        {
          "text": "Voorwaardelijke steun of aanpassing van het plan.",
          "feedback": "Juist: kritiek op een onderdeel is niet hetzelfde als afwijzing van betere samenwerking. De aangeboden tegenstelling is niet volledig."
        },
        {
          "text": "Dat iedere medewerker alle doelen van de organisatie moet afwijzen.",
          "feedback": "Ook dat is geen gegeven alternatief. De concrete medewerker wil een aanpassing; beoordeel die herkenbare positie."
        }
      ],
      "bridge": "Toets straks welke opties logisch aanvullend zijn en welke haalbare routes alleen worden weggelaten."
    },
    "inquiry": {
      "scenario": "Een team moet een nieuwe werkwijze beoordelen. De voorzitter noemt volledige invoering of niets veranderen als enige opties. Er bestaat ook een uitvoerbare proef met één taakgroep. In een tweede situatie zijn na controle alleen twee geschikte vergaderruimtes beschikbaar voor morgen.",
      "prompt": "Waarom verschilt de volledigheid van de keuzeruimte? Welke informatie maakt een derde optie relevant in plaats van alleen denkbaar?",
      "model": "In de eerste situatie is een concrete uitvoerbare proef gegeven. Die derde route kan de tegenstelling tussen alles en niets doorbreken en vraagt vergelijking op dezelfde doelen. Daarmee is nog niet bewezen dat de proef de beste keuze is. In de tweede situatie zijn de geschiktheid en beschikbaarheid voor morgen gecontroleerd; een denkbaar maar onbeschikbaar lokaal is geen gelijkwaardig praktisch alternatief. Ik wil daarom steeds bereik, termijn en voorwaarden vaststellen. De volledige keuzeruimte is geen lijst van alle verbeeldbare mogelijkheden maar van relevante mogelijkheden voor dit besluit. Ook de uitsluitingsgronden moeten zelf aanvaardbaar zijn.",
      "followUp": "Stel dat de proef extra begeleiding nodig heeft die niet beschikbaar is. Hoe verandert haar status zonder de oorspronkelijke tegenstelling meteen waar te verklaren?"
    },
    "core": {
      "scenario": "Een leidinggevende zegt dat een project óf een volledig succes óf waardeloos is. De evaluatie toont bruikbare resultaten naast niet bereikte doelen.",
      "prompt": "Welke indeling is onterecht?",
      "answer": 2,
      "options": [
        {
          "text": "Een evaluatie mag resultaten en doelen nooit apart noemen.",
          "feedback": "Juist die scheiding maakt een genuanceerd oordeel mogelijk. De fout ligt in het uitsluiten van gedeeltelijke opbrengst."
        },
        {
          "text": "Iedere niet behaalde doelstelling bewijst dat alle resultaten goed zijn.",
          "feedback": "Dat is de omgekeerde overdrijving. De niet behaalde doelen blijven echte beperkingen die de beoordeling kunnen beïnvloeden."
        },
        {
          "text": "Niet volledig succesvol wordt gelijkgesteld aan waardeloos.",
          "feedback": "Juist: gedeeltelijke opbrengst past niet in die twee aangeboden labels. Beoordeel de concrete resultaten en resterende tekortkomingen afzonderlijk."
        }
      ]
    },
    "assessment": [
      {
        "scenario": "Een medewerker betwijfelt de invoeringsdatum. De directeur concludeert dat zij tegen de hele dienstverlening is.",
        "prompt": "Welke positie is zonder grond uitgesloten?",
        "answer": 0,
        "options": [
          {
            "text": "Steun voor dienstverlening met bezwaar tegen deze datum.",
            "feedback": "Juist: een timingbezwaar hoeft het doel niet af te wijzen. De conclusie vraagt een volledigheidspremisse die hier niet wordt gegeven."
          },
          {
            "text": "De zekerheid dat elke invoeringsdatum onmogelijk is.",
            "feedback": "Dat stelt de medewerker niet. Een gerichte kritiek op één datum mag niet in een algemene onmogelijkheid worden veranderd."
          },
          {
            "text": "Dat de datum automatisch goed is omdat de directeur haar kiest.",
            "feedback": "Dat is geen rechtvaardiging van de keuzeruimte. Bevoegdheid bewijst geen passende datum of ongeldigheid van gedeeltelijke kritiek."
          }
        ]
      },
      {
        "scenario": "Voor een specifieke audit is een dossier volgens de vooraf vastgelegde definitie wel geregistreerd of niet geregistreerd.",
        "prompt": "Waarom is deze tweedeling niet automatisch vals?",
        "answer": 2,
        "options": [
          {
            "text": "Omdat iedere tweedeling altijd alle praktische omstandigheden dekt.",
            "feedback": "Een volledige logische statusverdeling kan nog andere praktische vragen openlaten. De reikwijdte moet behouden blijven."
          },
          {
            "text": "Omdat registratie meteen alle kwaliteitsproblemen oplost.",
            "feedback": "Registratie is één status. Zij bewijst geen correcte inhoud, privacy of verdere geschiktheid van het dossier."
          },
          {
            "text": "Omdat geregistreerd en niet-geregistreerd binnen dezelfde definitie aanvullende categorieën zijn.",
            "feedback": "Juist: elk relevant dossier valt onder één van beide. Dat verschilt van gewone tegengestelden die een tussenruimte kunnen hebben."
          }
        ]
      },
      {
        "scenario": "Een team ziet alleen sluiten of onbeperkt openblijven als keuze voor een overbelaste balie.",
        "prompt": "Welke herstelzet maakt de afweging sterker?",
        "answer": 1,
        "options": [
          {
            "text": "‘Er moet altijd een perfecte derde optie bestaan.’",
            "feedback": "Een ontbrekende optie moet werkelijk worden onderbouwd. Het foutlabel produceert geen haalbaar alternatief."
          },
          {
            "text": "‘Vergelijk ook een begrensd afspraakvenster en toets capaciteit, toegang en kosten voor alle routes.’",
            "feedback": "Juist: deze zet brengt een concrete derde route in beeld en controleert haar met dezelfde criteria als de bestaande opties."
          },
          {
            "text": "‘Alleen de twee genoemde opties mogen worden getoetst omdat ze als eerste genoemd zijn.’",
            "feedback": "Volgorde maakt de lijst niet volledig. Relevante uitvoerbare routes mogen niet zonder uitsluitingsgrond verdwijnen."
          }
        ]
      }
    ],
    "puzzle": {
      "scenario": "Een opleidingsleider zegt: iedereen volgt de volledige dure cursus of niemand leert de nieuwe taak. Een korte taakgerichte instructie is nog niet beoordeeld.",
      "prompt": "Reconstructeer de casus: scheid reden, conclusie, ongeoorloofde stap en gerichte herstelzin.",
      "categories": [
        "Aangevoerde reden",
        "Conclusie",
        "Ongeoorloofde stap",
        "Gerichte herstelzin"
      ],
      "cards": [
        {
          "text": "De opties worden gepresenteerd als volledige cursus of geen taakleren.",
          "category": 0
        },
        {
          "text": "De volledige cursus moet voor iedereen verplicht worden.",
          "category": 1
        },
        {
          "text": "Een mogelijke gerichte instructie wordt zonder beoordeling uitgesloten.",
          "category": 2
        },
        {
          "text": "Vergelijk welke vereiste vaardigheden elke uitvoerbare leerroute daadwerkelijk dekt.",
          "category": 3
        }
      ],
      "explanation": "De volledigheid van de leeropties is niet onderbouwd. De herstelzin beoordeelt een alternatief zonder het automatisch voldoende te verklaren."
    },
    "writing": {
      "scenario": "Een manager wil een leverancier behouden of direct het hele product stoppen. Het team noemt een mogelijke tweede leverancier, maar capaciteit en kosten daarvan zijn nog onbekend.",
      "prompt": "Schrijf minimaal 80 woorden. Toets de volledigheidspremisse, formuleer een haalbaarheidscontrole en vermijd de claim dat een derde optie automatisch beter is.",
      "model": "De tegenstelling tussen behouden en stoppen is nog niet als volledig onderbouwd. Een tweede leverancier kan een relevante derde route zijn, maar bestaat voorlopig alleen als mogelijkheid. Ik vraag naar capaciteit, levertijd, kwaliteit en totale overstapkosten. Het sterkste bezwaar is dat een besluit snel nodig is; daarom beperk ik de controle tot een concrete termijn en noodzakelijke eisen. Als de tweede route niet aan die eisen voldoet, mag zij afvallen met uitleg. Als zij wel uitvoerbaar blijkt, moet zij met dezelfde criteria worden vergeleken. Het doel is een eerlijke keuzeruimte, niet automatisch voorkeur voor het alternatief dat de valse tegenstelling doorbreekt.",
      "rubric": [
        "Je benoemt de niet onderbouwde volledigheid van de aangeboden opties.",
        "Je onderscheidt een denkbare van een uitvoerbare derde route.",
        "Je behandelt termijn en noodzakelijke voorwaarden als serieuze bezwaren.",
        "Je vergelijkt opties met gelijke criteria zonder een derde-optiegarantie."
      ]
    },
    "illustration": {
      "title": "Een tussenpositie behouden",
      "invitation": "Vergelijk de stap en haar reikwijdte in beide versies.",
      "sourceId": "tindale",
      "variants": [
        {
          "id": "flaw",
          "label": "De stap schiet tekort",
          "caption": "De twee labels zijn geen volledige verdeling. Voorwaardelijke steun, aanpassing of een timingbezwaar kunnen buiten de aangeboden tegenstelling vallen.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Aangevoerd",
                "text": "De medewerker steunt niet iedere stap van dit plan.",
                "tone": "orange"
              },
              {
                "id": "c",
                "label": "Afgeleide claim",
                "text": "De medewerker is tegen elke verbetering.",
                "tone": "orange"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "rechtvaardigt deze claim niet",
                "kind": "challenge"
              }
            ],
            "legend": "De kaart lokaliseert de betwiste stap. Een zwakke verdediging bewijst niet vanzelf dat de conclusie onwaar is."
          }
        },
        {
          "id": "repair",
          "label": "Gericht herstellen",
          "caption": "De herstelversie bewaart de concrete tussenpositie en beoordeelt haar inhoud. Zij maakt het aangepaste voorstel niet automatisch beter, maar voorkomt onterechte uitsluiting.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Relevante grond",
                "text": "De medewerker noemt één aanpassing en bevestigt het gezamenlijke doel.",
                "tone": "blue"
              },
              {
                "id": "c",
                "label": "Beperkte vervolgstap",
                "text": "Beoordeel de aanpassing op uitvoerbaarheid en gevolgen.",
                "tone": "green"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "draagt deze beperkte reactie",
                "kind": "support"
              }
            ],
            "legend": "Deze verbetering behoudt een beperkte conclusie. Controleer de gegevens, de afweging en eventuele tegenargumenten."
          }
        }
      ]
    }
  },
  {
    "slug": "hellend-vlak",
    "name": "Hellend vlak",
    "aliases": [
      "slippery slope",
      "dominoargument",
      "glijdende-schaalargument",
      "precedentketen"
    ],
    "family": "Taal en aannames",
    "level": "bachelor",
    "sourceTopic": "causality",
    "mediaIds": [],
    "teaser": "Een eerste stap maakt een hele ongewenste keten niet vanzelf onvermijdelijk.",
    "criticalQuestion": "Welke verbinding en welke stopmogelijkheid is voor iedere vervolgstap onderbouwd?",
    "sections": [
      {
        "title": "Van een kleine stap naar een grote ondergang",
        "body": "Een hellend-vlakargument waarschuwt dat een eerste stap via vervolgstappen tot een ongewenste uitkomst leidt. Dat kan een serieuze risicoredenering zijn. De drogredelijke variant presenteert de keten zonder passende verbindingen of maakt een mogelijke afloop vanzelf onvermijdelijk. “Eén uitzondering op de taakplanning betekent dat straks niemand nog afspraken volgt” heeft meer nodig dan een verontrustend verhaal. Schrijf de tussenstappen uit en vraag waarom elke stap volgt. Benoem ook waarom stoppen, begrenzen of terugdraaien onmogelijk zou zijn. Soms gaat de keten over oorzaken; soms over steeds ruimere precedenten of vergelijkbaar behandelde gevallen. Die routes vragen verschillende steun en mogen niet ongemerkt worden verwisseld.",
        "example": "Een proefdag zonder uniforme starttijd bewijst niet dat alle deadlines uiteindelijk verdwijnen.",
        "takeaway": "Een mogelijke keten vraagt bewijs voor verbindingen, bereik en ontbrekende remmen."
      },
      {
        "title": "Wanneer een ketenwaarschuwing wél redelijk is",
        "body": "Een waarschuwing kan passend zijn als zij een concreet mechanisme en relevante omstandigheden noemt. Een systeem dat elk verzoek automatisch accepteert zonder capaciteitsgrens kan bij aantoonbaar te veel verzoeken overbelasting veroorzaken. Dan zijn acceptatie, beschikbare capaciteit en gevolgen afzonderlijk controleerbaar. Een beleidsregel kan bovendien een echt precedent vormen wanneer dezelfde relevante criteria consequent moeten worden toegepast. Maar een uitzondering met expliciete voorwaarden hoeft niet ieder oppervlakkig vergelijkbaar geval toe te laten. Een goede waarschuwing bewaart onzekerheid: waarschijnlijk is niet zeker. Zij beoordeelt ook de ernst van de uitkomst en haalbare voorzorg. Het bestaan van stopmaatregelen vermindert mogelijk het risico zonder de oorspronkelijke zorg automatisch irrelevant te maken.",
        "example": "Een controleerbaar automatisch boekingsproces kan een begrensde waarschuwing voor overboeking dragen.",
        "takeaway": "Een onderbouwde risicoverbinding is geen drogreden alleen omdat zij vooruitkijkt."
      },
      {
        "title": "Herstel de zwakste schakel en de rem",
        "body": "Vraag waar de eerste onvoldoende ondersteunde overgang zit. “Waarom zou deze afgebakende uitzondering ook voor spoedgevallen gelden?” is concreter dan “dat is een hellend vlak”. Het sterkste bezwaar tegen jouw reparatie kan zijn dat een voorgestelde rem zelf niet wordt nageleefd of technisch ontbreekt. Toets daarom niet alleen de papieren beperking maar ook toezicht, uitvoerbaarheid en het terugkeermoment. Vergelijk de verwachte schade met mogelijke voordelen en andere opties. Een leider kan besluiten dat een beperkt risico de stap toch rechtvaardigt, of dat de mogelijke schade eerst extra voorzorg vraagt. Beide besluiten hebben argumenten nodig. Vermijd de overcorrectie dat toekomstgevolgen nooit bespreekbaar zijn of dat elke uitzondering automatisch veilig wordt zodra zij een naam krijgt.",
        "example": "Beproef een uitzondering met een echte capaciteitsgrens en controleer of die grens in de uitvoering werkt.",
        "takeaway": "Herstel de keten met concrete mechanismen en daadwerkelijk bruikbare stopvoorwaarden."
      }
    ],
    "deepDive": {
      "title": "Oorzaken, precedenten en opeenvolgende onzekerheid",
      "body": "Een causale keten beweert dat de eerste verandering andere gebeurtenissen waarschijnlijk maakt. Een precedentketen beweert dat relevante gelijkheid of een veranderde norm volgende uitzonderingen moeilijk te weigeren maakt. De tweede bewijst nog geen fysiek gevolg; de eerste geen normatieve verplichting. Maak het type stap steeds zichtbaar.\n\nOok meerdere plausibele stappen maken de einduitkomst niet automatisch zeker. De kans op de volledige keten hangt af van opeenvolgende voorwaarden en mogelijke afhankelijkheid; je mag kansen niet simpelweg optellen of elk vervolg uit het eerste voorbeeld garanderen. Zonder betrouwbare getallen kan een kwalitatieve begrenzing eerlijker zijn dan een exact percentage.\n\nVraag ten slotte waarom de afloop ongewenst is en voor wie. Een negatieve klank is geen gezamenlijke waardeafweging. Ernstige schade kan voorzorg rechtvaardigen ondanks onzekerheid, maar dat besluit vraagt ook alternatieven, kosten en remmogelijkheden. Een goede diagnose herstelt dus bewijs én de afweging, in plaats van iedere waarschuwing voor gevolgen weg te zetten."
    },
    "starter": {
      "scenario": "Een team wil één bijeenkomst online doen. Een collega zegt dat daarna alle contact verdwijnt en het team zeker uiteenvalt, zonder tussenstappen te geven.",
      "prompt": "Wat moet eerst worden onderbouwd?",
      "answer": 2,
      "options": [
        {
          "text": "Dat online contact nooit enig voordeel kan hebben.",
          "feedback": "Dat algemene oordeel wordt niet gegeven en is niet nodig voor een gerichte risicocontrole. Vergelijk werkelijke voor- en nadelen."
        },
        {
          "text": "Dat ieder toekomstgevolg onmogelijk besproken mag worden.",
          "feedback": "Vooruitkijken kan juist redelijk zijn. De fout zit in de niet onderbouwde keten en zekerheid, niet in het bespreken van mogelijke gevolgen."
        },
        {
          "text": "De verbindingen tussen één online bijeenkomst, verdwijnend contact en uiteenvallen.",
          "feedback": "Juist: de grote afloop volgt niet vanzelf uit de eerste stap. Iedere overgang en de mogelijkheid tot begrenzen verdienen controle."
        }
      ],
      "bridge": "Splits straks oorzaak en precedent en toets zowel elke vervolgstap als de voorgestelde rem."
    },
    "inquiry": {
      "scenario": "Een balie wil op rustige dagen één extra afspraak toelaten. Reactie A voorspelt dat daarmee alle grenzen verdwijnen. Reactie B toont dat de gebruikte software elk extra verzoek automatisch overneemt en dat er geen werkende capaciteitslimiet is.",
      "prompt": "Welk concreet mechanisme maakt B relevanter? Welke verdere gegevens en remmen moet je nog beoordelen voordat je de afloop voorspelt?",
      "model": "B benoemt een controleerbare route: automatische acceptatie zonder capaciteitslimiet. Dat kan overboeking ondersteunen wanneer aantallen de beschikbare bezetting overschrijden. Ik vraag daarom naar de werkelijke verzoeken, capaciteit, instellingen en gevolgen van vertraging. A geeft nog geen verbinding tussen de beperkte uitzondering en het verdwijnen van alle grenzen. Een expliciete begrenzing kan de keten stoppen, maar alleen als zij technisch en organisatorisch werkt. Ik zou de softwarelimiet en toezicht toetsen voordat ik een proef aanbeveel. Het risico is een reden voor controle of voorzorg, niet zonder meer voor de zekerheid dat het hele proces instort.",
      "followUp": "Voeg een gecontroleerde harde limiet toe. Welke ketenstap verandert, en welke risico's kunnen ondanks die rem nog overblijven?"
    },
    "core": {
      "scenario": "Een leidinggevende stelt dat één uitstelverzoek toestaan alle deadlines zal vernietigen. De uitzondering is expliciet beperkt tot aantoonbare uitval van een noodzakelijk systeem.",
      "prompt": "Welke verbinding ontbreekt?",
      "answer": 0,
      "options": [
        {
          "text": "Waarom de afgebakende uitzondering ook andere gevallen en alle deadlines moet aantasten.",
          "feedback": "Juist: de genoemde voorwaarde kan een relevante grens vormen. De criticus moet laten zien waarom die grens niet werkt of toch een ruim precedent vormt."
        },
        {
          "text": "Dat systeemuitval nooit gevolgen voor planning kan hebben.",
          "feedback": "Uitval kan juist een goede reden voor een beperkte uitzondering zijn. Beoordeel het concrete effect en de proportionaliteit."
        },
        {
          "text": "Dat een benoemde uitzondering altijd volledig risicoloos is.",
          "feedback": "Ook een beperkte uitzondering kan problemen geven. Een werkende grens en gevolgen moeten worden getoetst zonder totale veiligheid te garanderen."
        }
      ]
    },
    "assessment": [
      {
        "scenario": "Een afdeling wil één proefweek met flexibele pauzes. Een criticus voorspelt zonder mechanisme dat daarna niemand nog aanwezig zal zijn en de dienstverlening zeker stopt.",
        "prompt": "Welke stap is ontoereikend?",
        "answer": 1,
        "options": [
          {
            "text": "De criticus mag de bereikbaarheid tijdens de proef niet beoordelen.",
            "feedback": "Bereikbaarheid is een relevant doel. Een gerichte vergelijking van bezetting zou juist serieuze steun voor kritiek kunnen geven."
          },
          {
            "text": "Een beperkte proef wordt via ongedekte vervolgstappen een zekere totale afloop.",
            "feedback": "Juist: tussenstappen, omstandigheden en mogelijke remmen ontbreken. Het verhaal alleen draagt de zekerheid niet."
          },
          {
            "text": "Een beperkte proef bewijst dat elke kritiek altijd fout is.",
            "feedback": "Ook die zekerheid gaat te ver. Een proef kan echte risico's geven; die moeten alleen passend worden onderbouwd."
          }
        ]
      },
      {
        "scenario": "Een bevestigd boekingssysteem accepteert elk verzoek automatisch. Er zijn voor morgen honderd verzoeken, maar aantoonbaar slechts vijftig uitvoerbare plekken en geen werkende limiet.",
        "prompt": "Waarom kan een waarschuwing voor overboeking redelijk zijn?",
        "answer": 2,
        "options": [
          {
            "text": "Omdat iedere uitzondering vanzelf een algemene ramp veroorzaakt.",
            "feedback": "Dat algemene oordeel wordt niet gedragen. De casus biedt een specifiek acceptatiemechanisme en een concrete capaciteitsgrens."
          },
          {
            "text": "Omdat de naam van de software elke uitkomst bepaalt.",
            "feedback": "De naam is niet de grond. Het aangetoonde gedrag van het systeem en de beschikbare plekken maken de waarschuwing relevant."
          },
          {
            "text": "Omdat mechanisme, vraag en capaciteit afzonderlijk zijn vastgesteld.",
            "feedback": "Juist: deze concrete gegevens ondersteunen een beperkte voorspelling van overboeking. Zij bewijzen geen onbegrensde ondergang van alle dienstverlening."
          }
        ]
      },
      {
        "scenario": "Een team vreest dat een uitzonderingsregel steeds ruimer wordt. De voorgestelde reparatie is een schriftelijke grens, maar niemand controleert de toepassing.",
        "prompt": "Welke herstelvraag is het sterkst?",
        "answer": 0,
        "options": [
          {
            "text": "‘Wie bewaakt de grens, welke gevallen vallen eronder en wat gebeurt er bij overschrijding?’",
            "feedback": "Juist: de vraag toetst de echte uitvoerbaarheid van de rem en het precedent. Een papieren beperking alleen hoeft het risico niet weg te nemen."
          },
          {
            "text": "‘Zodra de grens is opgeschreven, bestaat geen enkel risico meer.’",
            "feedback": "Dat verwart een formulering met werkende uitvoering. Toezicht, bevoegdheden en gevolgen moeten nog worden gecontroleerd."
          },
          {
            "text": "‘Omdat een rem ontbreekt, staat iedere extreme afloop voor altijd vast.’",
            "feedback": "Een ontbrekende rem kan de zorg versterken, maar bewijst niet elke vervolgschakel of zekerheid. Herstel en alternatieven blijven mogelijk."
          }
        ]
      }
    ],
    "puzzle": {
      "scenario": "Een team wil voor één trainingsdag taakruil toestaan. Een criticus zegt dat daarna iedereen altijd taken wisselt en geen verantwoordelijkheid meer heeft.",
      "prompt": "Reconstructeer de casus: scheid reden, conclusie, ongeoorloofde stap en gerichte herstelzin.",
      "categories": [
        "Aangevoerde reden",
        "Conclusie",
        "Ongeoorloofde stap",
        "Gerichte herstelzin"
      ],
      "cards": [
        {
          "text": "Er wordt één afgebakende trainingsdag met taakruil voorgesteld.",
          "category": 0
        },
        {
          "text": "De proef moet weg omdat alle verantwoordelijkheid zeker zal verdwijnen.",
          "category": 1
        },
        {
          "text": "Een beperkte ruil wordt zonder mechanisme onbeperkte ruil en daarna totale verantwoordelijkheidloosheid.",
          "category": 2
        },
        {
          "text": "Toets voorwaarden, overdracht, toezicht en waarom uitbreiding buiten die dag zou volgen.",
          "category": 3
        }
      ],
      "explanation": "De voorspelde keten bevat meerdere niet onderbouwde overgangen. De herstelzin beoordeelt een echte precedent- of uitvoeringsroute en mogelijke remmen."
    },
    "writing": {
      "scenario": "Een team wil tijdens een uitzonderlijk druk weekend één deadline aanpassen. De voorzitter voorspelt dat daarna elke afspraak zinloos wordt. Er is een expliciete noodvoorwaarde, maar nog geen registratie van uitzonderingen.",
      "prompt": "Schrijf minimaal 80 woorden. Reconstrueer de keten, beoordeel de sterkste precedentzorg en formuleer een werkende begrenzing zonder veiligheid te garanderen.",
      "model": "De voorspelling gaat van één deadline onder een noodvoorwaarde naar het verdwijnen van alle afspraken. De voorzitter moet uitleggen waarom de grens niet behouden kan worden en hoe die grote afloop volgt. Een sterkere zorg is dat uitzonderingen zonder registratie ongemerkt ruimer worden. Die mogelijkheid neem ik serieus. Ik vraag wie de noodvoorwaarde bevestigt, welke deadline verandert en hoe eerdere uitzonderingen zichtbaar blijven. Een beperkte registratie, verantwoordelijke goedkeuring en een terugkeermoment kunnen de precedentroute begrenzen. Zij bewijzen geen volledig risicoloze uitvoering. Ik vergelijk de gevolgen van uitstel met die van onhaalbaar doorwerken en behoud een voorwaardelijk advies dat later kan worden herzien.",
      "rubric": [
        "Je noemt de afzonderlijke vervolgstappen en hun ontbrekende verbindingen.",
        "Je onderscheidt een concrete precedentzorg van een onvermijdelijke extreme afloop.",
        "Je toetst uitvoerbare remmen en verantwoordelijkheden.",
        "Je vergelijkt gevolgen en alternatieven met een beperkte, herzienbare conclusie."
      ]
    },
    "illustration": {
      "title": "Een eerste stap en een controleerbare keten",
      "invitation": "Vergelijk de stap en haar reikwijdte in beide versies.",
      "sourceId": "tindale",
      "variants": [
        {
          "id": "flaw",
          "label": "De stap schiet tekort",
          "caption": "De kaart toont de grote sprong; causaliteit, precedentwerking en het ontbreken van remmen zijn nog niet aangetoond door de eerste uitzondering.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Aangevoerd",
                "text": "Eén afgebakende uitzondering wordt voorgesteld.",
                "tone": "orange"
              },
              {
                "id": "c",
                "label": "Afgeleide claim",
                "text": "Alle afspraken zullen zeker verdwijnen.",
                "tone": "orange"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "rechtvaardigt deze claim niet",
                "kind": "challenge"
              }
            ],
            "legend": "De kaart lokaliseert de betwiste stap. Een zwakke verdediging bewijst niet vanzelf dat de conclusie onwaar is."
          }
        },
        {
          "id": "repair",
          "label": "Gericht herstellen",
          "caption": "Deze versie benoemt een concrete risicoroute en een controleerbare rem. Het advies blijft beperkt tot deze instellingen en maakt niet iedere toekomstige afspraak risicoloos.",
          "data": {
            "family": "flow",
            "rows": [
              [
                "r"
              ],
              [
                "c"
              ]
            ],
            "nodes": [
              {
                "id": "r",
                "label": "Relevante grond",
                "text": "Automatische acceptatie zonder limiet overschrijdt een aantoonbare capaciteit.",
                "tone": "blue"
              },
              {
                "id": "c",
                "label": "Beperkte vervolgstap",
                "text": "Installeer en toets een werkende limiet voordat je uitbreidt.",
                "tone": "green"
              }
            ],
            "edges": [
              {
                "from": "r",
                "to": "c",
                "label": "draagt deze beperkte reactie",
                "kind": "support"
              }
            ],
            "legend": "Deze verbetering behoudt een beperkte conclusie. Controleer de gegevens, de afweging en eventuele tegenargumenten."
          }
        }
      ]
    }
  }
];
