import type { SentenceTeaching } from './teaching-types';

export const structureTeaching: SentenceTeaching[] = [
  {
    lessonId: 'zinnen-05',
    introduction: [
      'Met dezelfde gebeurtenis kun je verschillende personen of dingen centraal zetten. In “De monteur controleert de fietsen” begint het bericht bij de monteur. In “De fietsen worden door de monteur gecontroleerd” begint het bij de fietsen. De handeling en de uitvoerder blijven dezelfde; de grammaticale rollen veranderen.',
      'De tweede zin is passief. Wat eerst lijdend voorwerp was, wordt in deze gewone omzetting onderwerp. Daarom schrijf je “De fietsen worden”, ook al is er maar één monteur. Het onderwerp bepaalt de persoonsvorm. Onderwerp betekent dus niet automatisch degene die iets doet: de fietsen voeren de controle niet uit.',
      'Met “worden gecontroleerd” stel je de controle onvoltooid voor. Met “zijn gecontroleerd” presenteer je haar als voltooid. In de gewone voltooide passieve zin hoef je geen “geworden” toe te voegen. Vermeld de uitvoerder wanneer die informatie belangrijk is. Laat hem weg wanneer hij onbekend is of de lezer vooral het resultaat moet weten; verberg geen relevante verantwoordelijkheid.',
      'Bij “Er wordt gelachen” is er geen grammaticaal onderwerp: je noemt een handeling zonder iemand als onderwerp aan te wijzen. Dat kan ook in “In de werkplaats wordt gelachen”. Niet elke handeling leent zich hiervoor. Bovendien betekent er niet altijd hetzelfde. Zoek in de context wat het woord vervangt of welke informatie het introduceert.',
    ],
    concepts: [
      { term: 'Onderwerp', meaning: 'Het zinsdeel waarmee de persoonsvorm in getal overeenkomt. Ook iets dat een handeling ondergaat kan onderwerp zijn.', example: 'De fiets wordt gecontroleerd. De fietsen worden gecontroleerd.' },
      { term: 'Actief en passief', meaning: 'In de actieve zin staat de uitvoerder hier als onderwerp. De passieve zin zet het ondergane voorwerp in de onderwerpsrol; de uitvoerder kan met door genoemd worden.', example: 'Noor verft de deur. De deur wordt door Noor geverfd.' },
      { term: 'Voltooid deelwoord', meaning: 'Een werkwoordvorm zoals gecontroleerd of geschreven. Met worden bouwt hij hier een onvoltooide passieve zin; met zijn een voltooide passieve zin.', example: 'Het verslag wordt geschreven. Het verslag is door de docent geschreven.' },
      { term: 'De functies van er', meaning: 'Er kan een plaats vervangen, een nieuw onbepaald onderwerp introduceren, samenwerken met een voorzetsel of naar weggelaten getelde dingen verwijzen. Soms combineert het functies.', example: 'Ik werk er: daar. Er staat een klant: introductie. Ik reken erop: op dat resultaat. Van die fietsen heb ik er drie gecontroleerd: drie fietsen.' },
    ],
    walkthrough: {
      title: 'Een klant vertellen hoe het met de fietsen staat',
      situation: 'De klant wil vooral weten wat er met zijn fietsen gebeurt. Je verandert eerst het perspectief van het bericht. Later, wanneer de controle klaar is, geef je een nieuwe melding over het resultaat.',
      startSentence: 'De monteur controleert de fietsen.',
      steps: [
        { title: 'Vind de rollen vóór je iets verplaatst', explanation: 'Vraag wat er gebeurt en welke deelnemers erbij horen. De monteur voert de controle uit en is hier onderwerp. De fietsen zijn wat hij controleert: het lijdend voorwerp. Verplaats de hele groep de fietsen, niet alleen fietsen.', sentence: 'De monteur controleert de fietsen.', focus: ['De monteur', 'controleert', 'de fietsen'] },
        { title: 'Maak de fietsen tot onderwerp', explanation: 'Begin het bericht bij de fietsen en kies de passieve bouw. Omdat het nieuwe onderwerp meervoud is, gebruik je worden. Gecontroleerd is het deelwoord. De uitvoerder is nu niet genoemd; dat betekent niet dat de fietsen zichzelf controleren.', sentence: 'De fietsen worden gecontroleerd.', focus: ['De fietsen', 'worden', 'gecontroleerd'] },
        { title: 'Behoud relevante informatie over de uitvoerder', explanation: 'Voeg door de monteur toe wanneer de klant moet weten wie de controle uitvoert. De monteur blijft de handelende persoon, maar is geen onderwerp meer. Daarom blijft de persoonsvorm worden bij de fietsen horen, niet bij de enkelvoudige monteur.', sentence: 'De fietsen worden door de monteur gecontroleerd.', focus: ['De fietsen', 'worden', 'door de monteur'] },
        { title: 'Meld daarna dat de controle voltooid is', explanation: 'Nu is de controle klaar: je vertelt iets nieuws over het tijdsverloop. Kies zijn plus gecontroleerd. De fietsen vragen de meervoudsvorm zijn. Dit verandert meer dan de woordvolgorde: je stelt de handeling nu als voltooid voor.', sentence: 'De fietsen zijn door de monteur gecontroleerd.', focus: ['zijn', 'gecontroleerd'] },
      ],
      result: 'Het perspectief bepaalt welk zinsdeel onderwerp wordt. De tijd bepaalt vervolgens of je worden of zijn gebruikt. Wie de handeling uitvoert, kun je met een door-bepaling blijven noemen.',
    },
    pitfalls: [
      { mistake: 'De uitvoerder gebruiken om de persoonsvorm te kiezen: “De fietsen wordt door de monteur gecontroleerd.”', correction: 'Zoek het grammaticale onderwerp. De fietsen is meervoud, dus worden. De door-bepaling bepaalt het getal niet.' },
      { mistake: 'Ieder er aanwijzen als onderwerp of telkens hetzelfde vertalen.', correction: 'In “Er staat een klant” is een klant onderwerp. In “Ik heb er drie” helpt er bij drie weggelaten dingen. Onderzoek de hele zin en de eerdere context.' },
    ],
    quickCheck: {
      question: 'Je schrijft: “De deuren worden door een schilder geverfd.” Welk zinsdeel bepaalt dat de persoonsvorm worden in het meervoud staat?',
      options: [
        { id: 'deuren', text: 'De deuren, omdat dat het grammaticale onderwerp is.', feedback: 'Juist. Eén deur wordt geverfd; meerdere deuren worden geverfd. De onderwerpsrol en de uitvoerdersrol zijn hier verschillend.' },
        { id: 'schilder', text: 'Een schilder, omdat die persoon de handeling uitvoert.', feedback: 'De schilder is wel de uitvoerder, maar staat in een door-bepaling. De persoonsvorm past zich aan het onderwerp de deuren aan.' },
        { id: 'deelwoord', text: 'Geverfd, omdat dat het belangrijkste werkwoord van de handeling is.', feedback: 'Geverfd noemt de handeling, maar het deelwoord heeft hier geen enkelvouds- en meervoudsvorm. Het onderwerp stuurt worden aan.' },
      ],
      answer: 'deuren',
    },
    application: {
      prompt: 'Je schrijft een aankondiging voor het buurthuis: op zaterdag schilderen vrijwilligers de deuren. Schrijf één passieve zin waarin de deuren centraal staan. Behoud de vrijwilligers en de dag; presenteer het werk nog niet als afgerond.',
      starter: 'De deuren',
      model: 'De deuren worden op zaterdag door vrijwilligers geschilderd.',
      reasoning: 'De deuren krijgt de onderwerpsrol en vraagt worden. Door vrijwilligers bewaart de uitvoerder. Op zaterdag bewaart de planning. Zijn geschilderd zou het werk als voltooid presenteren en past daardoor niet bij deze aankondiging.',
      checklist: ['Staan de deuren als onderwerp in mijn zin?', 'Past worden bij het meervoudige onderwerp?', 'Heb ik de uitvoerder en de dag behouden?', 'Heb ik geen voltooiing toegevoegd die niet in de aankondiging stond?'],
    },
  },
  {
    lessonId: 'zinnen-06',
    introduction: [
      'Een Nederlandse zin is geen rij losse woorden die je willekeurig verschuift. Woorden vormen groepen, zoals de nieuwe docent of na de pauze. Een veldenschema helpt je zien waar die groepen staan. De namen van de velden beschrijven hun plaats, niet hun betekenis: hetzelfde onderwerp kan op verschillende plaatsen voorkomen.',
      'In een gewone mededelende hoofdzin staat de persoonsvorm na het eerste zinsdeel. Dat eerste zinsdeel kan meerdere woorden bevatten: “De nieuwe docent heeft gelezen”. Heeft is hier het vierde woord, maar volgt op één volledige groep. Zet je gisteren vooraan, dan krijg je “Gisteren heeft de nieuwe docent gelezen”. Het onderwerp komt achter de persoonsvorm.',
      'De twee werkwoordposities vormen een soort raamwerk: “Noor heeft het verslag gelezen”. Heeft staat in de eerste pool; gelezen in de tweede. Daartussen staat het middenveld. Niet ieder vakje hoeft gevuld te zijn. In “Noor leest” zijn er geen andere werkwoorden om een tweede pool mee te vullen. Voeg dus niets toe alleen omdat het schema een plaats laat zien.',
      'Het zinstype maakt verschil. Een ja/nee-vraag kan met de persoonsvorm beginnen: “Heeft Noor gelezen?” In een gewone dat-bijzin staat dat bij het begin en komt heeft bij de werkwoorden achteraan: “Ik weet dat Noor heeft gelezen”. Ook kan een passende groep na die werkwoorden staan. De invulling hangt mede af van context en nadruk; er bestaat geen vaste tijd-wijze-plaatsvolgorde voor iedere zin.',
    ],
    concepts: [
      { term: 'Voorveld', meaning: 'De plaats vóór de eerste pool. In een gewone mededelende hoofdzin staat hier één zinsdeel, soms een hele groep van meerdere woorden.', example: 'Na de pauze begint de les. Na de pauze vult als geheel het voorveld.' },
      { term: 'Eerste en tweede pool', meaning: 'De vaste posities die het zinsschema dragen. In de hoofdzin staat de persoonsvorm in de eerste pool. In een gewone voegwoordbijzin staat het voegwoord daar; de werkwoorden staan achteraan.', example: 'Noor heeft het verslag gelezen. Ik weet dat Noor het verslag heeft gelezen.' },
      { term: 'Middenveld en naveld', meaning: 'Het middenveld ligt tussen de polen. Het naveld ligt na de tweede pool; geschikte groepen kunnen daar staan. Dat is geen vrije parkeerplaats voor ieder woord.', example: 'Noor heeft gisteren gesproken met haar mentor. Gisteren staat tussen heeft en gesproken; met haar mentor staat erachter.' },
      { term: 'Inversie', meaning: 'Het onderwerp staat na de persoonsvorm wanneer een ander zinsdeel het voorveld vult. Het blijft onderwerp, ook als er soms een kort voornaamwoord tussen staat.', example: 'Noor heeft gelezen. Gisteren heeft Noor gelezen.' },
    ],
    walkthrough: {
      title: 'Dezelfde mededeling op drie manieren gebruiken',
      situation: 'Je vertelt wat de docent gisteren deed. Daarna leg je de nadruk op de dag, stel je een vraag en neem je de mededeling op in een zin met ik weet.',
      startSentence: 'De nieuwe docent heeft het verslag gisteren besproken.',
      steps: [
        { title: 'Tel groepen, niet losse woorden', explanation: 'De nieuwe docent vormt één groep en vult het voorveld. Heeft is de persoonsvorm in de eerste pool. Het verslag en gisteren staan in het middenveld; besproken vormt de tweede pool. De persoonsvorm staat dus niet noodzakelijk als tweede woord.', sentence: 'De nieuwe docent heeft het verslag gisteren besproken.', focus: ['De nieuwe docent', 'heeft', 'besproken'] },
        { title: 'Maak de dag het vertrekpunt', explanation: 'Zet gisteren als geheel vooraan. Het neemt de plaats van het onderwerp in het voorveld over. Heeft blijft na het eerste zinsdeel staan. De nieuwe docent schuift naar het middenveld, achter de persoonsvorm; de boodschap over de bespreking blijft behouden.', sentence: 'Gisteren heeft de nieuwe docent het verslag besproken.', focus: ['Gisteren', 'heeft', 'de nieuwe docent'] },
        { title: 'Verander de mededeling in een ja/nee-vraag', explanation: 'Nu vraag je of de bespreking plaatsvond. Begin met heeft en laat het voorveld leeg. Het onderwerp volgt hier op de persoonsvorm. Besproken blijft achteraan. De plaatsing hoort bij de vraagbouw: je hoeft geen eerste zinsdeel vóór heeft te verzinnen.', sentence: 'Heeft de nieuwe docent het verslag gisteren besproken?', focus: ['Heeft', 'de nieuwe docent', 'besproken'] },
        { title: 'Neem de informatie op in een bijzin', explanation: 'Ik weet is de nieuwe hoofdmededeling. Dat leidt de bijzin in en staat daar in de eerste pool. Binnen die bijzin staat heeft niet meer vooraan: heeft besproken vormt samen de eindgroep. Analyseer elke zin met haar eigen raamwerk.', sentence: 'Ik weet dat de nieuwe docent het verslag gisteren heeft besproken.', focus: ['Ik weet', 'dat', 'heeft besproken'] },
      ],
      result: 'Hetzelfde onderwerp houdt zijn functie terwijl zijn plaats verandert. Mededeling, vraag en bijzin hebben verschillende patronen. Het schema maakt die patronen zichtbaar zonder woorden en zinsdelen met elkaar te verwarren.',
    },
    pitfalls: [
      { mistake: 'Na een vooropgeplaatste tijdsgroep het onderwerp vóór de persoonsvorm laten staan: “Gisteren Noor heeft gelezen.”', correction: 'In deze gewone mededeling vult gisteren het voorveld. Schrijf daarna heeft en vervolgens Noor: “Gisteren heeft Noor gelezen.”' },
      { mistake: 'Alle woorden na de persoonsvorm als één zinsdeel behandelen, of denken dat het onderwerp altijd direct erop volgt.', correction: 'Onderzoek de afzonderlijke groepen en hun functies. Een kort voornaamwoord kan ertussen staan; zijn positie maakt het nog geen onderwerp.' },
    ],
    quickCheck: {
      question: 'Je wilt een gewone mededeling met “Na de pauze” beginnen. Welke zin behoudt de juiste hoofdzinbouw?',
      options: [
        { id: 'v2', text: 'Na de pauze vertelt Mila het nieuws.', feedback: 'Juist. De drie woorden na de pauze zijn samen één zinsdeel. Daarna komt de persoonsvorm vertelt; Mila staat erachter als onderwerp.' },
        { id: 'dubbel-voorveld', text: 'Na de pauze Mila vertelt het nieuws.', feedback: 'Hier staan de tijdsgroep en het onderwerp allebei vóór vertelt. Laat in deze gewone hoofdzin de persoonsvorm op het eerste zinsdeel volgen.' },
        { id: 'eindgroep', text: 'Na de pauze Mila het nieuws vertelt.', feedback: 'Vertelt staat hier achteraan, terwijl je een zelfstandige mededeling bouwt. Een bijzin heeft een andere bouw en een passende inleiding nodig.' },
      ],
      answer: 'v2',
    },
    application: {
      prompt: 'Maak een helder bericht over een groepsafspraak: jij en je groep bespreken morgen om negen uur het project in lokaal 4. Schrijf één gewone mededelende zin die met Morgenochtend begint. Behoud alle afspraakgegevens.',
      starter: 'Morgenochtend',
      model: 'Morgenochtend bespreken we om negen uur het project in lokaal 4.',
      reasoning: 'Morgenochtend vult het voorveld. Bespreken volgt als persoonsvorm en past bij we. De tijd, het project en de plaats blijven herkenbare groepen. Deze zin heeft geen extra werkwoord nodig om een tweede pool te vullen.',
      checklist: ['Begint mijn zin met de bedoelde tijdsgroep?', 'Volgt de persoonsvorm op dat ene zinsdeel?', 'Is duidelijk wie het project bespreekt?', 'Kan de lezer de dag, het tijdstip en het lokaal terugvinden?'],
    },
  },
  {
    lessonId: 'zinnen-07',
    introduction: [
      'Een handeling kan met meer werkwoorden worden beschreven. In “Noor schrijft” is schrijft genoeg. In “Noor heeft geschreven” voegt heeft de voltooide tijd toe. In “Noor wil schrijven” geeft wil een wens aan. De woorden werken samen: je moet dus eerst begrijpen wat ieder werkwoord bijdraagt voordat je hun volgorde kiest.',
      'In een hoofdzin staat de persoonsvorm vooraan in het werkwoordelijke raamwerk: “Noor heeft het verslag geschreven”. In een gewone dat-bijzin staat ook die persoonsvorm bij de werkwoorden achteraan. Bij twee werkwoorden van het type hulpwerkwoord plus deelwoord zijn beide volgordes goed: “dat Noor heeft geschreven” en “dat Noor geschreven heeft”. De gebeurtenis verandert niet; ritme, register en persoonlijke voorkeur kunnen verschillen.',
      'Met een extra werkwoord verandert soms ook de vorm. Zonder aanvulling kun je zeggen “Noor heeft dat gewild”. Maar met schrijven in dezelfde werkwoordgroep wordt het “Noor heeft willen schrijven”. Willen staat hier als infinitief, het hele werkwoord, op de plaats waar je anders een deelwoord verwacht. Dit patroon geldt voor bepaalde werkwoorden en constructies, niet voor iedere opeenvolging: “Noor heeft geprobeerd om te schrijven” is ook correct.',
      'Sommige werkwoorden hebben een scheidbaar deel, zoals op in opbellen. In “Mila belt haar mentor op” staan de delen uiteen, maar ze horen bij dezelfde handeling. In een eenvoudige bijzin wordt het opbelt; met te wordt het op te bellen. Bij grotere groepen zijn de mogelijkheden specifieker. Dat twee volgordes ergens goed zijn, geeft dus geen toestemming om alle werkwoorden overal om te keren.',
    ],
    concepts: [
      { term: 'Werkwoordelijke eindgroep', meaning: 'De werkwoorden die samen bij de achterste werkwoordpositie staan. In een gewone bijzin hoort ook de persoonsvorm daarbij; in een hoofdzin staat die afzonderlijk vooraan.', example: 'Noor heeft willen schrijven. Ik hoor dat Noor heeft willen schrijven.' },
      { term: 'Voltooid deelwoord', meaning: 'Een vorm zoals gelezen, geschreven of opgebeld. Bij hebben, zijn of worden kan dit deelwoord in een groep met twee werkwoorden vóór of na het hulpwerkwoord staan.', example: 'Dat Mila heeft opgebeld. Dat Mila opgebeld heeft.' },
      { term: 'Vervangende infinitief', meaning: 'Een infinitief, het hele werkwoord, die in een bepaalde voltooide werkwoordgroep een verwacht deelwoord vervangt. De aanvulling en het groepsvormende werkwoord bepalen of dit patroon geldt.', example: 'Ze heeft willen lezen; niet: ze heeft gewild lezen. Zonder lezen kan wel: ze heeft dat gewild.' },
      { term: 'Scheidbaar werkwoord', meaning: 'Een werkwoord waarvan een deel in bepaalde zinnen los staat. Dat deel blijft bij de werkwoordbetekenis horen. De plaats van ge- of te volgt de bouw.', example: 'Opbellen: zij belt op, zij heeft opgebeld, om op te bellen.' },
    ],
    walkthrough: {
      title: 'Een telefoontje beschrijven en daarna rapporteren',
      situation: 'Mila belt haar mentor. Je kijkt eerst naar de losse werkwoorddelen. Als het gesprek voorbij is, vertel je wat zij heeft gedaan en neem je dat bericht op in een bijzin.',
      startSentence: 'Mila belt haar mentor op.',
      steps: [
        { title: 'Herken één werkwoord over twee plaatsen', explanation: 'Belt is de persoonsvorm. Op staat achteraan, maar hoort bij belt: samen vormen ze opbellen. Haar mentor is het voorwerp tussen de twee delen. Zoek dus de samenhang van de handeling, in plaats van ieder los geschreven woord apart te behandelen.', sentence: 'Mila belt haar mentor op.', focus: ['belt', 'op'] },
        { title: 'Vertel dat het bellen voltooid is', explanation: 'Het telefoontje is nu voorbij. Heeft maakt de zin voltooid; opbellen krijgt het deelwoord opgebeld. Ge- staat tussen op en de werkwoordstam. Opgebeld schrijf je hier als één woord. Je gebruikt niet automatisch ge- vóór het hele scheidbare werkwoord.', sentence: 'Mila heeft haar mentor opgebeld.', focus: ['heeft', 'opgebeld'] },
        { title: 'Rapporteer het bericht met dat', explanation: 'Voeg ik hoor toe als hoofdmededeling. Dat opent de bijzin; heeft en opgebeld komen daar samen achteraan. In deze volgorde staat het hulpwerkwoord vóór het deelwoord. Deze bouw is correct, maar is niet de enige mogelijkheid voor deze tweeledige groep.', sentence: 'Ik hoor dat Mila haar mentor heeft opgebeld.', focus: ['dat', 'heeft opgebeld'] },
        { title: 'Vergelijk een eveneens correcte volgorde', explanation: 'Wissel alleen de volgorde van de twee werkwoorden in de bijzin. Opgebeld heeft is hier ook correct en beschrijft hetzelfde telefoontje. Deze vergelijking geldt voor de groep hulpwerkwoord plus deelwoord; ze bewijst niet dat een langere infinitiefgroep elke volgorde toestaat.', sentence: 'Ik hoor dat Mila haar mentor opgebeld heeft.', focus: ['opgebeld heeft'] },
      ],
      result: 'De samenhang van opbellen blijft herkenbaar in losse en aaneengeschreven vormen. Bij heeft opgebeld en opgebeld heeft verandert de volgorde, maar niet de beschreven gebeurtenis. Andere soorten werkwoordgroepen vragen hun eigen controle.',
    },
    pitfalls: [
      { mistake: 'Na heeft altijd een deelwoord verwachten: “Lina heeft gewild lezen.”', correction: 'Willen vormt hier met lezen een werkwoordgroep. Gebruik de vervangende infinitief: “Lina heeft willen lezen”. Dat zegt nog niet dat zij ook werkelijk heeft gelezen.' },
      { mistake: 'Uit twee correcte deelwoordvolgordes afleiden dat iedere langere groep omkeerbaar is.', correction: 'Controleer het type groep. Heeft geschreven en geschreven heeft kunnen beide; heeft willen lezen volgt een ander patroon. Raadpleeg bij twijfel voorbeelden van diezelfde constructie.' },
    ],
    quickCheck: {
      question: 'Lina wilde een boek lezen. Je vertelt over die wens met heeft en behoudt lezen in dezelfde werkwoordgroep. Welke volledige zin past?',
      options: [
        { id: 'ipp', text: 'Lina heeft een boek willen lezen.', feedback: 'Juist. Willen is hier de vervangende infinitief bij lezen. Je rapporteert de wens; je bevestigt daarmee niet dat het lezen is gebeurd.' },
        { id: 'deelwoord', text: 'Lina heeft een boek gewild lezen.', feedback: 'Gewild kan in Lina heeft dat gewild, maar past niet in deze groep met lezen als werkwoordelijke aanvulling. Daar gebruik je willen.' },
        { id: 'verleden', text: 'Lina heeft een boek wilde lezen.', feedback: 'Wilde is een verleden persoonsvorm. Na heeft gebruik je hier geen tweede persoonsvorm, maar de infinitief willen in de groep willen lezen.' },
      ],
      answer: 'ipp',
    },
    application: {
      prompt: 'Je schrijft een bericht over een collega: gisteren wilde Amir een klant opbellen. Formuleer één volledige zin met heeft, willen en het werkwoord opbellen. Behoud gisteren en de klant; voeg niet toe dat het telefoontje werkelijk plaatsvond.',
      starter: 'Amir heeft',
      model: 'Amir heeft gisteren een klant willen opbellen.',
      reasoning: 'Heeft willen rapporteert de wens in de voltooide tijd. Opbellen blijft hier een infinitief na willen. De zin zegt wat Amir wilde doen, niet of de klant uiteindelijk een telefoontje kreeg.',
      checklist: ['Heb ik heeft als persoonsvorm gebruikt?', 'Staat willen als infinitief bij opbellen?', 'Zijn gisteren en de klant behouden?', 'Maak ik onderscheid tussen een wens en een werkelijk uitgevoerd telefoontje?'],
    },
  },
  {
    lessonId: 'zinnen-08',
    introduction: [
      'Twee juiste zinnen vormen nog niet vanzelf een heldere redenering. Vergelijk “De trein rijdt niet. Noor neemt de bus.” Wil je vertellen waarom Noor dat besluit neemt, maak dan het verband zichtbaar. Het verbindingswoord vertelt de lezer hoe de mededelingen samenhangen: een reden, een gevolg of bijvoorbeeld een voorwaarde.',
      'Want verbindt hier twee hoofdzinnen: “Noor neemt de bus, want de trein rijdt niet”. Na want blijft de hoofdzinvolgorde staan. Omdat maakt van dezelfde reden een bijzin: “Noor neemt de bus, omdat de trein niet rijdt”. De persoonsvorm rijdt staat nu bij het einde. Het verband blijft herkenbaar, maar de grammaticale bouw verandert.',
      'Met daarom zet je meestal eerst de reden neer en vervolgens het besluit: “De trein rijdt niet; daarom neemt Noor de bus”. Daarom hoort bij de tweede hoofdzin en vult daar het voorveld. Daarom komt neemt vóór Noor. Want staat juist tussen de zinnen en bezet dat voorveld niet. Dus kan beide patronen toelaten: “dus Noor neemt de bus” en “dus neemt Noor de bus”.',
      'Kies ook op betekenis. Omdat kan een bewust motief én een fysieke oorzaak noemen. Doordat past bij een oorzaak, maar niet bij een duidelijk bedoeld eigen motief zoals willen uitrusten. Mits stelt een voorwaarde: “Ik ga mee, mits je op mij wacht”. Tenzij noemt een uitzondering: “Ik ga mee, tenzij ik ziek word”. Die woorden omwisselen verandert de afspraak, niet alleen de toon.',
    ],
    concepts: [
      { term: 'Hoofdzin', meaning: 'Een zin met hier de gewone mededelende bouw: één zinsdeel vóór de persoonsvorm. Want kan twee zulke zinnen verbinden zonder hun eigen bouw te veranderen.', example: 'Noor neemt de bus, want de trein rijdt niet.' },
      { term: 'Bijzin', meaning: 'Een zin die onderdeel is van een groter geheel. In een gewone voegwoordbijzin staan de werkwoorden bij het einde. De hele bijzin kan vooraan in de hoofdmededeling staan.', example: 'Omdat de trein niet rijdt, neemt Noor de bus.' },
      { term: 'Gevolgverbinding', meaning: 'Een woord zoals daarom koppelt een volgende mededeling aan een eerdere reden. Staat daarom vooraan in de hoofdzin, dan is het zelf het eerste zinsdeel.', example: 'Het lokaal is bezet; daarom wachten we buiten.' },
      { term: 'Voorwaarde en uitzondering', meaning: 'Mits betekent op voorwaarde dat. Tenzij betekent behalve als. Beide laten de lezer weten waarvan het plan afhangt; ze zeggen niet dat die situatie al werkelijkheid is.', example: 'Je kunt beginnen, mits je klaar bent. Je kunt beginnen, tenzij de docent nog uitleg geeft.' },
    ],
    walkthrough: {
      title: 'Een reisbesluit begrijpelijk onderbouwen',
      situation: 'De trein rijdt niet. Noor besluit daarom de bus te nemen. Je formuleert hetzelfde verband met verschillende verbindingen en controleert telkens welke bouw de reden krijgt.',
      startSentence: 'De trein rijdt niet. Noor neemt de bus.',
      steps: [
        { title: 'Bepaal welke mededeling de andere verklaart', explanation: 'Noem eerst de relatie in gewone taal: het uitvallen van de trein is de reden voor Noors keuze. Een punt tussen twee zinnen vertelt die relatie nog niet expliciet. Een verbinding kan haar zichtbaar maken zonder nieuwe feiten of een ander besluit toe te voegen.', sentence: 'De trein rijdt niet. Noor neemt de bus.', focus: ['De trein rijdt niet', 'Noor neemt de bus'] },
        { title: 'Verbind twee hoofdzinnen met want', explanation: 'Zet het besluit eerst en voeg de reden met want toe. Want staat tussen de zinnen. De trein blijft het eerste zinsdeel van de tweede hoofdzin; rijdt volgt erop. Je gebruikt dus niet automatisch de eindvolgorde van een bijzin na ieder verbindingswoord.', sentence: 'Noor neemt de bus, want de trein rijdt niet.', focus: ['want', 'de trein', 'rijdt'] },
        { title: 'Maak de reden tot een omdat-bijzin', explanation: 'Vervang want door omdat en pas de redenzin aan. Omdat opent een bijzin: rijdt komt na niet bij het einde. De inhoud van de reden verandert niet. Alleen het verbindingswoord vervangen en de oude volgorde laten staan zou de twee bouwpatronen verwarren.', sentence: 'Noor neemt de bus, omdat de trein niet rijdt.', focus: ['omdat', 'de trein niet rijdt'] },
        { title: 'Laat het besluit volgen met daarom', explanation: 'Zet nu de reden eerst. Daarom vult het voorveld van de volgende hoofdzin; daarna staat neemt en vervolgens het onderwerp Noor. De buskeuze wordt als gevolg van de genoemde reden gepresenteerd. De puntkomma maakt de grens tussen de twee hoofdzinnen duidelijk.', sentence: 'De trein rijdt niet; daarom neemt Noor de bus.', focus: ['daarom', 'neemt', 'Noor'] },
      ],
      result: 'Want, omdat en daarom kunnen ditzelfde gegeven reisbesluit verbinden, maar vragen verschillende zinsbouw. Controleer daarom zowel de betekenis van het verband als de plaats van onderwerp en persoonsvorm.',
    },
    pitfalls: [
      { mistake: 'Hoofdzinvolgorde na omdat houden: “Omdat de trein rijdt niet”.', correction: 'Omdat leidt hier een bijzin in: “Omdat de trein niet rijdt”. Met want blijft de reden een hoofdzin: “want de trein rijdt niet”.' },
      { mistake: 'Mits en tenzij gebruiken alsof het onderling verwisselbare nette woorden zijn.', correction: 'Omschrijf de afspraak eerst: op voorwaarde dat of behalve als. “Je kunt meedoen, mits je een laptop meeneemt” vraagt een laptop; tenzij zou juist een uitzondering maken van het meenemen.' },
    ],
    quickCheck: {
      question: 'Je bedoelt: het werk wordt morgen uitgevoerd, behalve als het regent. Welke zin geeft die afspraak weer?',
      options: [
        { id: 'tenzij', text: 'Het werk wordt morgen uitgevoerd, tenzij het regent.', feedback: 'Juist. Tenzij noemt regen als uitzondering op het plan. De zin zegt niet dat regen al voorspeld of vastgesteld is.' },
        { id: 'mits', text: 'Het werk wordt morgen uitgevoerd, mits het regent.', feedback: 'Mits maakt regen juist tot een voorwaarde voor het uitvoeren. Dat keert de bedoelde afspraak om.' },
        { id: 'omdat', text: 'Het werk wordt morgen uitgevoerd, omdat het regent.', feedback: 'Omdat zou regen als reden of oorzaak presenteren. Je wilde een uitzondering aangeven, niet verklaren waarom het werk wordt gedaan.' },
      ],
      answer: 'tenzij',
    },
    application: {
      prompt: 'Schrijf twee zinnen voor deelnemers aan een workshop. Jullie gebruiken lokaal 4 omdat lokaal 2 al bezet is. Meedoen kan op voorwaarde dat iemand een laptop meeneemt. Maak het eerste verband met omdat en de voorwaarde met mits duidelijk.',
      starter: 'We gebruiken lokaal 4',
      model: 'We gebruiken lokaal 4, omdat lokaal 2 al bezet is. Je kunt meedoen, mits je een laptop meeneemt.',
      reasoning: 'Omdat geeft de reden voor de lokaalkeuze; is staat achteraan in die bijzin. Mits maakt het meenemen van een laptop tot voorwaarde. Het bericht beweert niet dat iedereen de laptop al heeft meegenomen.',
      checklist: ['Is duidelijk waarom de groep lokaal 4 gebruikt?', 'Heeft de omdat-bijzin de passende werkwoordplaats?', 'Stelt mits de bedoelde positieve voorwaarde?', 'Heb ik geen extra oorzaak, belofte of vaststaand feit toegevoegd?'],
    },
  },
];
