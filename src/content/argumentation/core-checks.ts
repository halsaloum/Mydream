export type CoreCheck = {
  sectionTitle: string;
  scenario: string;
  prompt: string;
  options: { id: string; text: string; feedback: string }[];
  answer: string;
};

/** New transfer cases for the second explanation; these are practice, not scored test items. */
export const lessonCoreChecks: Record<string, CoreCheck> = {
  'basis-standpunt-en-reden': {
    sectionTitle: 'Een reden kan vóór of na het standpunt staan',
    scenario: '“De vloer bij de ingang is nat. Zet daar een waarschuwingsbord.” Er staat geen “want” of “dus” tussen de twee zinnen.',
    prompt: 'Welke zin wordt als reden voor het voorstel gegeven?',
    answer: 'wet',
    options: [
      { id: 'board', text: 'Zet daar een waarschuwingsbord.', feedback: 'Dit is wat de spreker wil laten doen: het standpunt. De andere zin vertelt waarom.' },
      { id: 'wet', text: 'De vloer bij de ingang is nat.', feedback: 'Deze zin geeft de reden voor het bord. Een reden kan voor het standpunt staan, ook zonder een verbindingswoord.' },
      { id: 'none', text: 'Er is geen reden, want het woord “want” ontbreekt.', feedback: 'Een verbindingswoord kan helpen, maar is niet verplicht. Vraag welke zin uitlegt waarom het bord daar moet komen.' },
    ],
  },
  'basis-redenen-beoordelen': {
    sectionTitle: 'Is de reden sterk genoeg voor deze conclusie?',
    scenario: 'Eén bezorger vertelt dat de nieuwe laadplek voor hem sneller werkt. Het team heeft andere bezorgers nog niet bevraagd.',
    prompt: 'Welke conclusie blijft binnen deze informatie?',
    answer: 'one',
    options: [
      { id: 'one', text: 'Deze bezorger meldt een voordeel; voor de anderen weten we het nog niet.', feedback: 'Je behoudt de nuttige ervaring én haar grens. Eén ervaring geeft nog geen volledig beeld van alle bezorgers.' },
      { id: 'all', text: 'De nieuwe laadplek werkt sneller voor alle bezorgers.', feedback: 'De conclusie wordt groter dan de reden. Je hebt één gemelde ervaring, geen informatie over iedereen.' },
      { id: 'useless', text: 'De ervaring zegt helemaal niets over de nieuwe laadplek.', feedback: 'De reden is beperkt, maar niet waardeloos. Zij vertelt wat deze bezorger ervaart; vraag daarna naar andere situaties.' },
    ],
  },
  'basis-verzwegen-stap': {
    sectionTitle: 'Aanvullen is nog niet hetzelfde als goedkeuren',
    scenario: '“Deze klantvraag is ingewikkeld, dus Lotte moet haar beantwoorden.” Je weet nog niet welke ervaring Lotte heeft.',
    prompt: 'Welke reactie maakt de ontbrekende stap bespreekbaar?',
    answer: 'ask',
    options: [
      { id: 'invent', text: 'Lotte zal wel de beste specialist zijn; daarmee is het voorstel bewezen.', feedback: 'Je vult onbekende informatie in alsof zij vaststaat. Een passende mogelijke aanname is nog geen gecontroleerd feit.' },
      { id: 'reject', text: 'Lotte kan deze vraag zeker niet beantwoorden.', feedback: 'Onbekende geschiktheid bewijst geen ongeschiktheid. Vraag eerst welke grond de spreker voor deze keuze heeft.' },
      { id: 'ask', text: 'Welke kennis van Lotte maakt haar geschikt voor juist deze vraag?', feedback: 'Deze vraag legt de brug tussen een moeilijke vraag en deze persoon bloot, zonder haar geschiktheid alvast goed of af te keuren.' },
    ],
  },
  'basis-argument-of-uitleg': {
    sectionTitle: 'Reconstructie is een toetsbare interpretatie',
    scenario: '“Het planningsbestand mist de late diensten; daardoor is dit overzicht voorlopig onvolledig. We moeten die diensten toevoegen voordat we het rooster vaststellen.”',
    prompt: 'Welke rol heeft “dit overzicht is voorlopig onvolledig”?',
    answer: 'both',
    options: [
      { id: 'background', text: 'Alleen achtergrondinformatie; die zin kan uit de reconstructie verdwijnen.', feedback: 'De zin doet hier twee ondersteunende taken. Zij volgt uit ontbrekende diensten en draagt daarna het voorstel om die toe te voegen.' },
      { id: 'both', text: 'Een beperkte tussenconclusie die vervolgens een reden voor toevoegen wordt.', feedback: 'Een uitspraak kan eerst conclusie en daarna premisse zijn. Je behoudt bovendien “dit overzicht” en “voorlopig”, in plaats van elk rooster onbruikbaar te verklaren.' },
      { id: 'absolute', text: 'Het bewijs dat de hele planning voor altijd onbruikbaar is.', feedback: 'Dat verandert de reikwijdte. De spreker gaat over dit voorlopige overzicht, niet over alle planning of een permanente fout.' },
    ],
  },
  'basis-verborgen-premissen': {
    sectionTitle: 'Welke sterkte mag de conclusie hebben?',
    scenario: 'Een werkplaats test een ander etiket bij twaalf leveringen. Alle twaalf komen zonder leesfout aan. De leider verwacht weinig leesfouten bij komende vergelijkbare leveringen.',
    prompt: 'Hoe beoordeel je de stap van deze waarnemingen naar de verwachting?',
    answer: 'limited',
    options: [
      { id: 'limited', text: 'Voorlopige steun; vergelijkbaarheid en selectie bepalen hoe ver de verwachting reikt.', feedback: 'Dit is een generalisatie naar nieuwe gevallen. De goede testresultaten kunnen steun geven, terwijl representativiteit en omstandigheden nog moeten worden beoordeeld.' },
      { id: 'necessary', text: 'Deductieve zekerheid: geen enkele toekomstige levering kan nog een leesfout hebben.', feedback: 'Twaalf foutloze gevallen sluiten een nieuwe fout logisch niet uit. Meer waarnemingen veranderen een inductie niet vanzelf in een noodzakelijke conclusie.' },
      { id: 'discard', text: 'Een denkbare toekomstige fout maakt alle testresultaten waardeloos.', feedback: 'Een mogelijkheid weerlegt hier geen claim van deductieve zekerheid: die hoeft niet te worden gemaakt. Beoordeel hoeveel voorlopige steun de waarnemingen werkelijk geven.' },
    ],
  },
  'basis-argumentstructuur': {
    sectionTitle: 'Bewijs kan verborgen afhankelijkheid hebben',
    scenario: 'Twee dashboards melden dezelfde voorraad. Het eerste leest het magazijnbestand; het tweede neemt uitsluitend de uitvoer van het eerste over.',
    prompt: 'Wat betekent dit voor de steun aan de voorraadclaim?',
    answer: 'shared',
    options: [
      { id: 'two', text: 'Twee schermen leveren twee onafhankelijke bevestigingen.', feedback: 'De zichtbare scheiding zegt niets over onafhankelijkheid. Het tweede scherm heeft geen aparte controle van de voorraad uitgevoerd.' },
      { id: 'false', text: 'De voorraadclaim moet onwaar zijn, omdat de bron gedeeld wordt.', feedback: 'Gedeelde afhankelijkheid beperkt de extra bevestiging, maar bewijst geen fout in het oorspronkelijke bestand.' },
      { id: 'shared', text: 'Beide meldingen delen één bewijsbasis; controleer die basis en eventuele andere routes.', feedback: 'Je telt de kopie niet als nieuwe onafhankelijke informatie. De oorspronkelijke voorraadmeting kan nog bruikbaar zijn, mits haar kwaliteit wordt gecontroleerd.' },
    ],
  },
  'basis-kritiek-en-herstel': {
    sectionTitle: 'Reparatie, conclusie en gesprek onderscheiden',
    scenario: 'Een manager verdedigt nieuwe lampen met: “Wie dit weigert, geeft niets om het team.” Een collega laat zien dat deze persoonlijke verwijtende stap de aankoop niet onderbouwt.',
    prompt: 'Welke vervolgstap herstelt de discussie?',
    answer: 'repair',
    options: [
      { id: 'bad', text: 'Vaststellen dat de nieuwe lampen dus een slechte aankoop zijn.', feedback: 'Een zwakke verdediging bewijst geen verkeerde aankoop. De werking, prijs en alternatieven zijn daarmee nog niet beoordeeld.' },
      { id: 'repair', text: 'Het verwijt weglaten en verlichting, kosten en alternatieven vergelijken.', feedback: 'Je vervangt de problematische stap door relevante redenen. Zo blijft de aankoopvraag open voor een inhoudelijke beoordeling.' },
      { id: 'winner', text: 'De collega heeft nu bewezen dat haar eigen lampenvoorstel het beste is.', feedback: 'Kritiek op dit argument rechtvaardigt niet automatisch een ander voorstel. Dat vraagt eigen ondersteuning.' },
    ],
  },
  'basis-voorwaarden-en-gevolgen': {
    sectionTitle: 'Twee geldige stappen en twee verleidelijke fouten',
    scenario: 'Neem beide uitspraken als waar: elk verzonden pakket heeft een verzendregistratie. Pakket K heeft geen verzendregistratie.',
    prompt: 'Welke conclusie volgt uit precies deze premissen?',
    answer: 'not-sent',
    options: [
      { id: 'not-sent', text: 'Pakket K is niet verzonden.', feedback: 'Dit is modus tollens: verzonden → registratie; geen registratie → niet verzonden. De geldigheid geldt onder de gegeven ware regel en aanvullende premisse.' },
      { id: 'sent', text: 'Pakket K is wel verzonden.', feedback: 'Dat zou juist een geval met verzending zonder registratie zijn en de gegeven algemene regel tegenspreken.' },
      { id: 'all-not', text: 'Er is vandaag geen enkel pakket verzonden.', feedback: 'De aanvullende premisse gaat alleen over K. Zij rechtvaardigt geen uitspraak over alle andere pakketten.' },
    ],
  },
  'basis-checkpoint': {
    sectionTitle: 'Gebruik fouten als aanwijzing',
    scenario: 'Je dacht bij een oefenzin dat de reden het standpunt was. De feedback wijst aan welke zin de gewenste keuze noemt en welke zin haar ondersteunt.',
    prompt: 'Welke kleine herhaalstap helpt bij een nieuw voorbeeld?',
    answer: 'distinguish',
    options: [
      { id: 'memorize', text: 'Alleen de plaats van het juiste antwoord onthouden.', feedback: 'Een antwoordpositie helpt niet wanneer de volgende zin of de volgorde verandert. Herhaal het onderscheid dat je miste.' },
      { id: 'mastery', text: 'Aannemen dat je na één goede herhaling ieder debat beheerst.', feedback: 'Deze oefening controleert een beperkte vaardigheid. Een goed antwoord geeft geen algemene garantie over nieuwe, moeilijkere gesprekken.' },
      { id: 'distinguish', text: 'Opnieuw vragen: wat wordt voorgesteld, en waarom?', feedback: 'Je richt de herhaling op het gemiste onderscheid. Die twee vragen kun je op een andere zin toepassen, zonder alleen het oude antwoord te kopiëren.' },
    ],
  },
  'bachelor-persoon-en-expertise': {
    sectionTitle: 'Deskundigheid geeft herzienbare steun',
    scenario: 'Een procestechnoloog vergelijkt gegevens van deze productielijn en zegt: “Deze instelling kan de stilstand onder gelijke belasting verminderen.” De directeur wil dit samenvatten als een zekere verbetering bij iedere belasting.',
    prompt: 'Welke samenvatting bewaart de draagkracht van het deskundigenoordeel?',
    answer: 'qualified',
    options: [
      { id: 'guarantee', text: 'Een deskundige heeft gegarandeerd dat elke belasting verbetert.', feedback: 'Expertise verandert “kan” en “onder gelijke belasting” niet in een garantie voor alle omstandigheden. De samenvatting gaat verder dan het werkelijk ingenomen oordeel.' },
      { id: 'qualified', text: 'Een relevante expert geeft voorlopige steun onder de genoemde belastingvoorwaarde.', feedback: 'Je behoudt vakgebied, beschikbare vergelijking en modaliteit. De gegevens en toepassingsvoorwaarden kunnen nog worden getoetst; het advies is niet daarom automatisch een drogreden.' },
      { id: 'ignore', text: 'Een oordeel is nooit bruikbaar zolang je de vergelijking niet volledig zelf herhaalt.', feedback: 'Deskundigheid kan herzienbare steun geven. Je hoeft niet ieder specialistisch resultaat zelf te reproduceren om domein, bewijs en voorbehouden kritisch te beoordelen.' },
    ],
  },
  'bachelor-stropop-analogie': {
    sectionTitle: 'Analogie: overeenkomsten moeten argumentatief relevant zijn',
    scenario: 'Afdeling A verkort gewone telefonische wachttijd met een terugbelknop. Afdeling B wil dezelfde aanpak voor urgente storingsmeldingen die direct iemand moeten bereiken. Beide gebruiken hetzelfde logo en telefoonsysteem.',
    prompt: 'Welk verschil raakt de overdracht van het verwachte voordeel het meest?',
    answer: 'urgency',
    options: [
      { id: 'logo', text: 'Het logo lijkt genoeg op elkaar; daarmee is hetzelfde voordeel aangetoond.', feedback: 'Het logo verklaart niet waarom later terugbellen voor een melding passend is. Een oppervlakkige overeenkomst draagt de relevante brug niet.' },
      { id: 'names', text: 'De afdelingen hebben verschillende namen, dus geen enkele vergelijking is mogelijk.', feedback: 'Een naamverschil hoeft het werkingsmechanisme niet te raken. Een gerichte kritiek zoekt het verschil dat voor de voorspelde uitkomst telt.' },
      { id: 'urgency', text: 'Uitgestelde reactie kan bij urgente storingen het doel van direct contact missen.', feedback: 'Dat verschil raakt precies de voorwaarde waaronder terugbellen nuttig kan zijn. Een aparte urgente route kan de analogie beperken of het ontwerp herstellen; zij verbiedt niet iedere vergelijking.' },
    ],
  },
  'bachelor-dilemma-helling-cirkel': {
    sectionTitle: 'Wanneer ondersteunt een reden zichzelf?',
    scenario: '“Dit bestelproces is betrouwbaar omdat het goed werkt. Dat het goed werkt, weten we omdat het betrouwbaar is.” De betrouwbaarheid staat juist ter discussie.',
    prompt: 'Welke aanvulling kan de afhankelijkheid van het betwiste oordeel doorbreken?',
    answer: 'outside',
    options: [
      { id: 'outside', text: 'Een afzonderlijke controle van tijdige en juiste leveringen, met een passende vergelijkingsmaatstaf.', feedback: 'Die controle biedt een bewijsroute die niet eerst de betrouwbaarheid hoeft aan te nemen. De kwaliteit, omvang en vergelijkbaarheid van de controle blijven zelf te beoordelen.' },
      { id: 'repeat', text: 'Dezelfde claim krachtiger herhalen: het proces is echt heel betrouwbaar.', feedback: 'Nadruk levert geen zelfstandig steunpunt. De rechtvaardiging blijft afhankelijk van het oordeel dat de ander betwijfelt.' },
      { id: 'label', text: '“Goed werkt” vervangen door “effectief is” en verder niets toevoegen.', feedback: 'Een andere term kan dezelfde cirkel verbergen. Vraag welke reden zonder aanname van de conclusie kan worden aanvaard.' },
    ],
  },
  'bachelor-causaliteit-statistiek': {
    sectionTitle: 'Voor wie en voor welke uitkomst geldt het voordeel?',
    scenario: 'Een afspraakportal krijgt hoge tevredenheidsscores van klanten die hun boeking afmaakten. Mensen die vastliepen en stopten zijn niet bevraagd. Er komen nog duizend reacties van succesvolle boekers bij.',
    prompt: 'Wat moet je controleren vóór je voordeel voor alle klanten claimt?',
    answer: 'missing',
    options: [
      { id: 'enough', text: 'Niets meer: duizend extra reacties verwijderen de selectiviteit.', feedback: 'Meer antwoorden uit dezelfde geselecteerde groep vullen de ontbrekende groep niet vanzelf aan. De aantallen kunnen groot zijn terwijl uitvallers onzichtbaar blijven.' },
      { id: 'missing', text: 'Ook ervaringen en uitkomsten van vastgelopen klanten; tevredenheid van boekers dekt niet iedereen.', feedback: 'Je bewaart de nuttige resultaten én benoemt welke klanten en uitkomsten ontbreken. Beoordeel die selectie voordat je de aanbeveling veralgemeniseert.' },
      { id: 'no-value', text: 'Alle scores weggooien; tevreden boekers leveren geen bruikbare informatie.', feedback: 'De antwoorden kunnen iets over deze boekers vertellen. De beperking zit in de stap naar alle klanten, niet in het automatisch onbruikbaar worden van elk antwoord.' },
    ],
  },
  'bachelor-geldigheid-en-tegenvoorbeelden': {
    sectionTitle: 'Hoeveel gevallen beweert de zin?',
    scenario: 'In een formele beschrijving staat: “Sommige contracten krijgen een tweede controle.” Over het aantal overige contracten wordt niets gezegd.',
    prompt: 'Wat betekent “sommige” hier logisch?',
    answer: 'at-least',
    options: [
      { id: 'not-all', text: 'Minstens één krijgt controle en minstens één krijgt die niet.', feedback: 'Dat voegt “niet alle” toe. In gewone taal kan die suggestie bestaan, maar logisch betekent “sommige” alleen minstens één.' },
      { id: 'one', text: 'Precies één contract krijgt die controle.', feedback: '“Sommige” geeft geen exact aantal. Er kunnen meerdere contracten zijn, of zelfs alle contracten kunnen de eigenschap hebben.' },
      { id: 'at-least', text: 'Minstens één krijgt die controle; het kunnen ook alle contracten zijn.', feedback: 'Je bewaart de bestaansclaim zonder een niet-gegeven bovengrens. “Sommige” sluit “alle” in deze logische betekenis niet uit.' },
    ],
  },
  'bachelor-checkpoint': {
    sectionTitle: 'Van feedback naar herziening',
    scenario: 'Je koos een leveranciersadvies uitsluitend omdat de spreker een indrukwekkende titel heeft. De feedback zegt dat zijn vakgebied en de gegevens over dit systeem niet waren gecontroleerd.',
    prompt: 'Welke herziening benoemt de gemiste denkstap het beste?',
    answer: 'criterion',
    options: [
      { id: 'criterion', text: 'Ik moet nagaan of deze deskundigheid en onderbouwing juist dit systeem dekken.', feedback: 'Je noemt het criterium dat ontbrak. Daarmee kun je een nieuw advies beoordelen, ook wanneer naam, titel en onderwerp veranderen.' },
      { id: 'opposite', text: 'Ik moet voortaan ieder advies van iemand met een titel afwijzen.', feedback: 'Dat vervangt een automatische aanvaarding door een automatische afwijzing. De feedback vraagt om gerichte toetsing, niet om een oordeel over alle deskundigen.' },
      { id: 'position', text: 'Ik onthoud dat in deze vraag het tweede vakje juist was.', feedback: 'De positie helpt niet bij een nieuw argument. Leg de ontbrekende voorwaarde in je eigen woorden uit voordat je opnieuw kiest.' },
    ],
  },
  'master-toulmin-bewijslast': {
    sectionTitle: 'Het gespreksdoel bepaalt welke verplichtingen spelen',
    scenario: 'De voorsteller zegt dat een gedeeld factuursysteem administratie bespaart. Een collega vraagt of overstaptijd is meegeteld. Zij beweert niet dat het systeem verlies veroorzaakt.',
    prompt: 'Welke reactie verdeelt de bewijslast gericht?',
    answer: 'defend',
    options: [
      { id: 'reverse', text: 'De collega moet eerst bewijzen dat het systeem verlies veroorzaakt.', feedback: 'Een vraag over de steun is geen ingenomen verliesclaim. Deze reactie ontwijkt de eigen positieve besparingsclaim.' },
      { id: 'defend', text: 'De voorsteller moet de besparing mét overstaptijd onderbouwen; een zelfstandige verliesclaim zou eigen redenen vragen.', feedback: 'Je onderscheidt twijfel aan deze ondersteuning van een tegenovergestelde claim. De concrete kostenvraag maakt duidelijk welk deel van het voorstel nog rechtvaardiging vraagt.' },
      { id: 'absolute', text: 'De voorsteller moet bewijzen dat geen enkel mogelijk risico ooit kan optreden.', feedback: 'Een absolute risicoloosheidseis volgt niet uit deze gerichte vraag. Spreek een passend beoordelingscriterium af en onderbouw de relevante marge en kosten.' },
    ],
  },
  'master-weerlegbare-argumenten': {
    sectionTitle: 'Meer informatie kan minder rechtvaardiging opleveren',
    scenario: 'De actuele planning gaf steun voor beschikbaarheid van vergaderruimte C. Een bevestigd onderhoudsbericht sluit alleen C volgende dinsdag. Het bericht zegt niets over andere ruimten of dagen.',
    prompt: 'Welke herziening past bij deze nieuwe informatie?',
    answer: 'scope',
    options: [
      { id: 'all', text: 'Voortaan de gehele planning en alle ruimten als onbruikbaar beschouwen.', feedback: 'Je breidt een specifieke uitzondering te ver uit. Het bericht raakt C op dinsdag, niet automatisch iedere andere beschikbaarheidsclaim.' },
      { id: 'keep', text: 'C toch beschikbaar noemen, omdat extra informatie een conclusie nooit kan veranderen.', feedback: 'Beschikbaarheid uit een planning is een praktische, herzienbare verwachting. Nieuwe toepasselijke informatie kan die route juist intrekken.' },
      { id: 'scope', text: 'Beschikbaarheid van C op dinsdag intrekken en overige claims behouden waar hun voorwaarden nog passen.', feedback: 'Je herziening volgt de bevestigde uitzondering en haar bereik. De eerdere verwachting kon redelijk zijn zonder na dit bericht overeind te blijven.' },
    ],
  },
  'master-belangen-en-besluiten': {
    sectionTitle: 'Overtuigend besluiten met ruimte voor de beste tegenwerping',
    scenario: 'Een leider wil alle dienstaanvragen digitaal laten doen. De sterkste zorg is dat collega’s zonder vaste computertoegang dan moeilijker kunnen aanvragen. Snellere verwerking blijft een relevant doel.',
    prompt: 'Welke reactie verwerkt de werkelijke zorg in het voorstel?',
    answer: 'safeguard',
    options: [
      { id: 'safeguard', text: 'Een toegankelijke alternatieve aanvraagroute bieden en herzien als aanvragen door gebrek aan toegang uitblijven.', feedback: 'Je behoudt het doel, voegt een gerichte waarborg toe en noemt een relevant herzieningssignaal. Je maakt niet iedereen tegelijk tevreden, maar behandelt wel de sterkste concrete zorg.' },
      { id: 'story', text: 'Alleen een enthousiast verhaal vertellen over hoe modern het nieuwe systeem is.', feedback: 'Dat verhaal beantwoordt de toegangsvoorwaarde niet. Een aantrekkelijk voorbeeld kan de ontbrekende waarborg niet vervangen.' },
      { id: 'caricature', text: 'Uitleggen waarom collega’s die nooit iets willen veranderen ongelijk hebben.', feedback: 'De zorg is gebrek aan toegang, niet een algemene weigering van verandering. Bespreek het werkelijke voorstel en de werkelijke tegenwerping.' },
    ],
  },
  'master-bayes-basisfrequentie': {
    sectionTitle: 'Van odds naar bewijs en vervolgens naar een besluit',
    scenario: 'Voor een defect zijn de prior odds 1 : 9. Een markering heeft een positieve likelihood ratio van 3. De posterior odds worden dus 1 : 3. Een extra controle is beschikbaar, maar kost tijd.',
    prompt: 'Welke stap combineert een juiste kans met een verdedigbare besluitvraag?',
    answer: 'separate',
    options: [
      { id: 'discard', text: 'De kans is 25%; dus moet ieder gemarkeerd product zonder verdere afweging worden weggegooid.', feedback: '1 : 3 betekent inderdaad 1 / (1 + 3) = 25%. Maar die kans schrijft de actie niet zelf voor: onterechte afkeuring, gemiste defecten en vervolgcontrole vragen een afzonderlijke afweging.' },
      { id: 'separate', text: 'De kans is 25%; vergelijk daarna gevolgen van een gemist defect, onterechte afkeuring en extra controle.', feedback: 'Je zet odds correct om naar kans en houdt de normatieve stap apart. De passende actie hangt naast de kans ook af van kosten, gevolgen en beoordelingscriteria.' },
      { id: 'reverse', text: 'De kans op defect is 75%; de grootste groep bepaalt automatisch het besluit.', feedback: 'Bij odds 1 : 3 staat één deel voor defect en drie voor niet-defect: de defectkans is 25%. Bovendien bepaalt een meerderheid van kansen zonder gevolgenafweging niet vanzelf de beste actie.' },
    ],
  },
  'master-sterke-redeneringen': {
    sectionTitle: 'De beste beleidsinferentie heeft feiten én waarden',
    scenario: 'Een nieuw invoerformulier bespaart gemiddeld twee minuten per aanvraag. Het vraagt wel meer verplichte persoonlijke gegevens. De leider zegt: “Het is sneller, dus we moeten het kiezen.”',
    prompt: 'Welke aanvulling behandelt de ontbrekende beleidsbrug het meest gericht?',
    answer: 'values',
    options: [
      { id: 'effect', text: 'Het tijdvoordeel nogmaals meten en privacy daarna buiten de afweging houden.', feedback: 'Een extra effectmeting kan nuttig zijn, maar rechtvaardigt niet op zichzelf dat het voordeel de extra gegevensverwerking waard is. De normatieve brug blijft open.' },
      { id: 'reject', text: 'Elke verandering met een privacyvraag onmiddellijk afwijzen, ongeacht ontwerp of waarborg.', feedback: 'De zorg vraagt een inhoudelijke afweging en mogelijk een ander ontwerp. Automatische afwijzing behandelt evenmin welke grens en rechtvaardiging passend zijn.' },
      { id: 'values', text: 'Uitleggen waarom deze tijdwinst de lasten onder een verdedigbare privacygrens rechtvaardigt, of het ontwerp beperken.', feedback: 'Je maakt de waarden en voorwaarden van de keuze expliciet. Het tijdvoordeel kan echt zijn terwijl het oorspronkelijke besluit nog onvoldoende is gerechtvaardigd.' },
    ],
  },
  'master-checkpoint': {
    sectionTitle: 'Gebruik tegenspraak om het voorstel beter te maken',
    scenario: 'Een leider wil een klantportaal voor iedereen invoeren op grond van een proef met vaste desktopgebruikers. Een collega vraagt of mobiele gebruikers er ook mee kunnen werken. De proef bevat daar geen gegevens over.',
    prompt: 'Welke zin maakt het besluitargument na deze kritiek beter?',
    answer: 'limit',
    options: [
      { id: 'false', text: 'De ontbrekende mobiele gegevens bewijzen dat het portaal voor niemand werkt.', feedback: 'De kritiek beperkt de algemene bewijsroute. Zij ontkent niet automatisch de bruikbare resultaten voor de groep die wel is bekeken.' },
      { id: 'limit', text: 'De proef ondersteunt deze desktopgroep; toets mobiele toegang voordat we invoering voor iedereen verdedigen.', feedback: 'Je zegt precies wat het bezwaar wel en niet aantoont en koppelt het aan een gerichte vervolgstap. De conclusie blijft binnen het bekende bewijs.' },
      { id: 'confidence', text: 'We vertellen de algemene conclusie met meer overtuiging, zodat de zorg verdwijnt.', feedback: 'Meer stelligheid vult de ontbrekende gebruiksvoorwaarde niet aan. Een betere gesprekszin benoemt de beperking en de passende controle.' },
    ],
  },
};
