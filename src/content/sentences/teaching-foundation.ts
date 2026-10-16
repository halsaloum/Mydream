import type { SentenceTeaching } from './teaching-types';

export const foundationTeaching: SentenceTeaching[] = [
  {
    lessonId: 'zinnen-01',
    introduction: [
      'Woorden in een zin vormen vaak groepen die samen een taak hebben. In De nieuwe medewerker leest het verslag horen de, nieuwe en medewerker bij elkaar: samen noemen ze één persoon. Het hele blok De nieuwe medewerker is hier het onderwerp en hoort bij leest. Het verslag noemt wat die persoon leest. Je begrijpt en verandert een zin gemakkelijker wanneer je eerst zulke betekenisblokken herkent.',
      'Binnen een woordgroep is één woord de kern: het woord waaromheen de andere woorden zijn gebouwd. Medewerker en verslag zijn zelfstandige naamwoorden: ze noemen hier een persoon en een ding. In het nieuwe verslag over taal is verslag de kern. Het bepaalt mee hoe de groep zich gedraagt. Nieuwe beschrijft het verslag vóór de kern; over taal voegt erna informatie toe over het onderwerp van dat verslag.',
      'Woordgroep en zinsdeel betekenen niet precies hetzelfde. Woordgroep beschrijft hoe woorden samen zijn opgebouwd; zinsdeel beschrijft hun taak in deze zin. Over taal is zelf een voorzetselgroep, maar zit hier binnen het grotere blok het nieuwe verslag over taal. Het is daardoor niet automatisch een afzonderlijk zinsdeel. Morgen kan juist met één woord een zelfstandig tijdsblok vormen.',
      'Onderzoek je grens met meerdere proeven. Kun je het hele blok vervangen door hij, het of daar? Kun je het samen verplaatsen zonder de bedoelde betekenis kwijt te raken? Welke vraag beantwoordt het? Geen proef werkt altijd op zichzelf. Vooral een groep als met de verrekijker kan óf iemand beschrijven óf vertellen hoe het kijken gebeurt. Lees daarom eerst wat de schrijver bedoelt.',
    ],
    concepts: [
      { term: 'Woordgroep', meaning: 'Woorden die samen zijn opgebouwd rond een kern en samen iets aanduiden.', example: 'De jonge docent overlegt: De jonge docent is een woordgroep rond docent.' },
      { term: 'Kern', meaning: 'Het centrale woord dat bepaalt welk soort persoon, ding of eigenschap de groep noemt.', example: 'Het dikke boek over dieren ligt hier: boek is de kern van Het dikke boek over dieren.' },
      { term: 'Bepaling bij een naamwoord', meaning: 'Extra informatie binnen de groep: bijvoorbeeld welke persoon of welk ding bedoeld is.', example: 'De medewerker van de bibliotheek leest: van de bibliotheek hoort hier bij medewerker.' },
      { term: 'Zinsdeel', meaning: 'Een woord of een groter blok met een eigen functie in de volledige zin.', example: 'Morgen leest de docent het verslag: Morgen is één zinsdeel, het verslag een ander.' },
    ],
    walkthrough: {
      title: 'Een bericht over collega Ruben duidelijk ordenen',
      situation: 'Ruben is de nieuwe medewerker van de bibliotheek. Je vertelt een collega dat hij morgen een verslag leest waarvan taal het onderwerp is.',
      startSentence: 'De nieuwe medewerker van de bibliotheek leest morgen het verslag over taal.',
      steps: [
        {
          title: 'Zoek de personen en dingen',
          explanation: 'Vraag eerst wie leest en wat hij leest. De antwoorden zijn volledige groepen: De nieuwe medewerker van de bibliotheek en het verslag over taal. Neem niet alleen medewerker en verslag; hun beschrijvingen horen bij deze personen en dingen.',
          sentence: 'De nieuwe medewerker van de bibliotheek leest morgen het verslag over taal.',
          focus: ['De nieuwe medewerker van de bibliotheek', 'het verslag over taal'],
        },
        {
          title: 'Verbind de beschrijvingen met hun kern',
          explanation: 'Van de bibliotheek vertelt bij welke instelling de medewerker hoort. Over taal vertelt waarover het verslag gaat. Morgen beschrijft geen medewerker of verslag, maar het tijdstip van het lezen. Die aansluitingen bepalen waar je de blokgrenzen legt.',
          sentence: 'De nieuwe medewerker van de bibliotheek leest morgen het verslag over taal.',
          focus: ['medewerker van de bibliotheek', 'morgen', 'verslag over taal'],
        },
        {
          title: 'Controleer door het hele onderwerp te vervangen',
          explanation: 'In het gesprek over Ruben kun je de volledige persoonsgroep vervangen door Hij. De zin blijft dezelfde leeshandeling beschrijven. Zo controleer je dat de beschrijving van de bibliotheek bij die ene persoonsgroep hoorde en niet los achterbleef.',
          sentence: 'Hij leest morgen het verslag over taal.',
          focus: ['Hij', 'het verslag over taal'],
        },
        {
          title: 'Zet het tijdstip vooraan en behoud de andere blokken',
          explanation: 'Maak morgen het vertrekpunt van je bericht. Leest volgt daarna; de volledige medewerker-groep blijft bijeen. Ook het verslag over taal blijft één gelezen ding. Je verandert de volgorde van blokken, zonder hun interne beschrijvingen uit elkaar te trekken.',
          sentence: 'Morgen leest de nieuwe medewerker van de bibliotheek het verslag over taal.',
          focus: ['Morgen', 'de nieuwe medewerker van de bibliotheek', 'het verslag over taal'],
        },
      ],
      result: 'Morgen leest de nieuwe medewerker van de bibliotheek het verslag over taal. De zin begint nu met het tijdstip, terwijl de lezer en het gelezen verslag elk als volledige groep herkenbaar blijven.',
    },
    pitfalls: [
      { mistake: 'Je telt elk woord als een apart zinsdeel en verplaatst alleen de kern.', correction: 'Nieuwe medewerker en verslag over taal zijn geen losse labels naast de zin. Onderzoek de volledige groepen; lidwoorden en bijbehorende beschrijvingen verhuizen doorgaans mee.' },
      { mistake: 'Je behandelt elke groep met een voorzetsel als zelfstandige plaatsinformatie.', correction: 'In het verslag over taal beschrijft over taal het verslag. In Noor leest bij het raam beschrijft bij het raam de leesplaats. De aansluiting en bedoeling tellen, niet alleen het voorzetsel.' },
    ],
    quickCheck: {
      question: 'In De rode fiets van Sam staat buiten benoemt de schrijver één fiets waarvan Sam eigenaar is. Welk blok vervang je volledig door Die?',
      options: [
        { id: 'hele-fiets', text: 'De rode fiets van Sam', feedback: 'Deze volledige groep noemt de bedoelde fiets, inclusief kleur en eigenaar. Die staat buiten verwijst naar dat geheel.' },
        { id: 'fiets-zonder-eigenaar', text: 'De rode fiets', feedback: 'Dan blijft van Sam buiten de vervanging staan, terwijl die woorden in deze bedoeling juist aangeven welke fiets het is. Onderzoek het hele fietsblok.' },
        { id: 'eigenaar', text: 'Sam', feedback: 'Sam noemt de eigenaar, maar de zin vertelt dat de fiets buiten staat. De verwijzing Die moet hier het fietsblok vervangen.' },
      ],
      answer: 'hele-fiets',
    },
    application: {
      prompt: 'Je bevestigt wanneer een collega iets controleert. Begin de volledige zin met het tijdstip, behoud alle informatie en laat de beschrijvingen bij hun personen en dingen.',
      starter: 'De ervaren collega van de receptie controleert morgen de aanvraag voor de cursus.',
      model: 'Morgen controleert de ervaren collega van de receptie de aanvraag voor de cursus.',
      reasoning: 'Morgen is het zelfstandige tijdsblok. Van de receptie blijft bij collega; voor de cursus blijft hier bij aanvraag. Door hele blokken te verplaatsen verander je de nadruk en behoud je wie wat controleert.',
      checklist: ['Ik heb een volledige zin geschreven.', 'De collega-groep en de aanvraag-groep blijven elk bijeen.', 'De zin begint met Morgen en beschrijft nog dezelfde controle.'],
    },
  },
  {
    lessonId: 'zinnen-02',
    introduction: [
      'Een zin heeft niet alleen betekenisblokken: sommige delen moeten ook grammaticaal bij elkaar passen. Vergelijk De leerling werkt en De leerlingen werken. Het werkwoord verandert wanneer je van één leerling naar meerdere leerlingen gaat. Die veranderende werkwoordsvorm heet de persoonsvorm. Zij laat onder meer de tijd zien en sluit aan bij het onderwerp.',
      'Je vindt de persoonsvorm met de tijdproef. Zet Noor heeft het verslag gelezen om naar de verleden tijd: Noor had het verslag gelezen. Heeft verandert in had; gelezen blijft staan. Daarom is heeft de persoonsvorm, hoewel gelezen ook een werkwoordsvorm is. Bij een zin met meerdere deelzinnen onderzoek je iedere deelzin afzonderlijk; er kan dan meer dan één persoonsvorm zijn.',
      'Het onderwerp is de groep waarmee de persoonsvorm verbonden is. Vraag niet uitsluitend wie iets doet. In Een krat staat bij de deur doet het krat niets, maar Een krat is wel onderwerp. Bij een gewone lange naamwoordgroep zoek je de kern: in Een krat met twaalf flessen gaat het om één krat. Flessen zit binnen de groep, maar bestuurt hier de persoonsvorm niet.',
      'Onderwerp en persoonsvorm komen gewoonlijk overeen in persoon en getal: ik werk, zij werkt, zij werken. Die overeenstemming heet congruentie. De plaats van het onderwerp verandert dit niet: Bij de deur staan twee kratten blijft meervoud. Niet iedere bijzondere hoeveelheid volgt één eenvoudig kernregeltje. Een aantal bezoekers wacht en wachten kunnen beide passen; Het aantal bezoekers neemt toe heeft enkelvoud. Leer eerst de gewone verbinding en onderzoek uitzonderingen met hun betekenis.',
    ],
    concepts: [
      { term: 'Persoonsvorm', meaning: 'De werkwoordsvorm die de grammaticale tijd draagt en bij het onderwerp aansluit.', example: 'Noor heeft gebeld → Noor had gebeld: heeft verandert en is de persoonsvorm.' },
      { term: 'Onderwerp', meaning: 'Het volledige zinsdeel waarmee de persoonsvorm grammaticaal verbonden is.', example: 'Een doos met boeken staat klaar: Een doos met boeken is het onderwerp, niet alleen doos.' },
      { term: 'Kern van het onderwerp', meaning: 'Het centrale woord van een gewone onderwerpgroep dat helpt het enkelvoud of meervoud bepalen.', example: 'De doos met boeken staat klaar, maar De dozen met boeken staan klaar.' },
      { term: 'Congruentie', meaning: 'De overeenkomst in persoon en getal tussen onderwerp en persoonsvorm.', example: 'Ik lees, de docent leest, de docenten lezen: de vorm verandert met het onderwerp.' },
    ],
    walkthrough: {
      title: 'Van één krat naar meerdere kratten',
      situation: 'Je maakt een overdracht voor het magazijn. Eerst staat er één krat met flessen; later komen er twee kratten. Je wilt de voorraad precies beschrijven.',
      startSentence: 'Een krat met twaalf flessen staat bij de deur.',
      steps: [
        {
          title: 'Vind de persoonsvorm met de tijdproef',
          explanation: 'Verplaats de gebeurtenis naar gisteren: staat wordt stond. Krat, flessen en deur veranderen niet door deze tijdswisseling. Zo vind je het werkwoord dat hier de tijd draagt, zonder op zijn plaats in de zin te gokken.',
          sentence: 'Een krat met twaalf flessen stond bij de deur.',
          focus: ['stond'],
        },
        {
          title: 'Neem het volledige onderwerp en zoek zijn kern',
          explanation: 'Ga terug naar de tegenwoordige tijd. Een krat met twaalf flessen noemt wat bij de deur staat. Daarbinnen is krat de kern; met twaalf flessen beschrijft de inhoud. Het meervoud flessen maakt dit ene krat niet meervoudig.',
          sentence: 'Een krat met twaalf flessen staat bij de deur.',
          focus: ['Een krat met twaalf flessen', 'staat'],
        },
        {
          title: 'Verander het aantal kratten en laat het werkwoord volgen',
          explanation: 'Nu zijn er twee kratten. De kern verandert van krat naar kratten, dus de persoonsvorm wordt staan. Het flessenblok blijft een beschrijving binnen de onderwerpgroep. Je reageert op het aantal kratten, niet op het dichtstbijzijnde meervoud.',
          sentence: 'Twee kratten met twaalf flessen staan bij de deur.',
          focus: ['Twee kratten', 'staan'],
        },
        {
          title: 'Begin met de plaats en controleer opnieuw',
          explanation: 'Zet bij de deur vooraan om de locatie te benadrukken. Het onderwerp staat nu achter de persoonsvorm, maar noemt nog steeds twee kratten. Daarom blijft staan meervoud. Een andere woordvolgorde verandert de grammaticale verbinding niet.',
          sentence: 'Bij de deur staan twee kratten met twaalf flessen.',
          focus: ['Bij de deur', 'staan', 'twee kratten met twaalf flessen'],
        },
      ],
      result: 'Bij de deur staan twee kratten met twaalf flessen. Het volledige onderwerp staat achter de persoonsvorm; de meervoudige kern kratten verklaart staan. De flessen blijven onderdeel van de beschrijving.',
    },
    pitfalls: [
      { mistake: 'Je laat het dichtstbijzijnde naamwoord de persoonsvorm bepalen: Een krat met flessen staan.', correction: 'Zoek het volledige onderwerp en zijn kern. Het gaat hier om één krat: Een krat met flessen staat. De flessen worden genoemd als inhoud van dat krat.' },
      { mistake: 'Je zoekt het onderwerp altijd vooraan of noemt alleen degene die handelt.', correction: 'Onderwerp is een grammaticale functie. In Bij de deur staat een krat staat het onderwerp achter staat; in De brief wordt gelezen is de brief onderwerp zonder zelf te lezen.' },
      { mistake: 'Je keurt bij een aantal automatisch één van beide werkwoordsvormen af.', correction: 'Een aantal bezoekers wacht of wachten kan, afhankelijk van hoe je de groep presenteert. Het aantal bezoekers neemt toe gaat over het aantal zelf. Verwar die twee constructies niet.' },
    ],
    quickCheck: {
      question: 'Het gaat om de situatie van nu. Welke vorm past in De voorraad met nieuwe schriften … in de kast?',
      options: [
        { id: 'ligt', text: 'ligt', feedback: 'Voorraad is de enkelvoudige kern. De nieuwe schriften zitten binnen een beschrijving van die voorraad: De voorraad met nieuwe schriften ligt in de kast.' },
        { id: 'liggen', text: 'liggen', feedback: 'Liggen zou aansluiten bij schriften als zelfstandig onderwerp. Hier is de kern voorraad, dus volgt enkelvoud ligt.' },
        { id: 'gelegd', text: 'gelegd', feedback: 'Gelegd is een voltooid deelwoord. Het kan in een constructie als heeft gelegd voorkomen, maar vervangt hier niet alleen de benodigde persoonsvorm.' },
      ],
      answer: 'ligt',
    },
    application: {
      prompt: 'Verbeter de persoonsvorm in deze overdracht. Houd de tegenwoordige tijd en behoud alle overige woorden. Leg daarna uit welk onderwerp de vorm bepaalt.',
      starter: 'Morgen brengen de medewerker met twee assistenten de dozen naar het depot.',
      model: 'Morgen brengt de medewerker met twee assistenten de dozen naar het depot.',
      reasoning: 'De volledige onderwerpgroep is de medewerker met twee assistenten. De kern medewerker is enkelvoud; assistenten staat in de nabepaling en dozen noemt wat vervoerd wordt. Daarom krijgt de persoonsvorm de vorm brengt, ook na Morgen.',
      checklist: ['Ik heb de volledige zin behouden.', 'Ik kan het onderwerp én zijn kern aanwijzen.', 'Mijn persoonsvorm sluit aan bij medewerker, niet bij assistenten of dozen.'],
    },
  },
  {
    lessonId: 'zinnen-03',
    introduction: [
      'Het onderwerp is grammaticaal verbonden met de persoonsvorm. Nu onderzoek je wat het gezegde over dat onderwerp zegt: een handeling, gebeurtenis of verbinding met een eigenschap. Dat hoeft niet één werkwoord te zijn. In Noor heeft de docent opgebeld horen heeft en opgebeld bij elkaar. De woorden de docent staan ertussen, maar breken die werkwoordelijke verbinding niet.',
      'Bij een werkwoordelijk gezegde drukken de werkwoorden samen een werking uit; dat kan ook een proces of gebeurtenis zijn. Een hulpwerkwoord voegt bijvoorbeeld tijd of mogelijkheid toe: heeft in heeft gebeld, kan in kan bellen. Gebeld is hier een voltooid deelwoord: een vorm die met heeft een voltooide handeling beschrijft. Een scheidbaar deel hoort er ook bij: Noor belt de docent op bevat belt op van opbellen. Zoek de hele verbinding binnen deze deelzin, niet automatisch alle werkwoorden in een langer bericht.',
      'Bij een naamwoordelijk gezegde wordt het onderwerp gekoppeld aan een eigenschap, toestand of identiteit. In Noor is moe is moe de informatie die aan Noor wordt gekoppeld; is moe vormt samen het gezegde. Is werkt hier als koppelwerkwoord. Dat geldt niet bij elk gebruik van zijn: in Noor is vertrokken helpt is het vertrek uitdrukken. Alleen het herkennen van de werkwoordnaam is dus onvoldoende.',
      'Een eigenschap kan ook naast een gewone handeling staan. Noor fietst moe naar huis betekent dat Noor moe is terwijl ze fietst. Moe beschrijft dan een deelnemer tijdens de handeling: een bepaling van gesteldheid. Bij Noor verft de deur groen beschrijft groen het resultaat voor de deur. Voorzichtig in Noor verft voorzichtig vertelt daarentegen hoe zij verft. Vraag steeds: heeft iemand of iets deze eigenschap, of beschrijf ik de manier van handelen?',
    ],
    concepts: [
      { term: 'Werkwoordelijk gezegde', meaning: 'De bij elkaar horende werkwoordelijke delen die een werking uitdrukken, ook als andere woorden ertussen staan.', example: 'Noor heeft de docent opgebeld: heeft opgebeld is het werkwoordelijk gezegde.' },
      { term: 'Naamwoordelijk gezegde', meaning: 'De werkwoordelijke verbinding plus de eigenschap, toestand of identiteit die zij aan het onderwerp koppelt.', example: 'De leerling blijft rustig: blijft rustig vormt samen het naamwoordelijk gezegde.' },
      { term: 'Koppelwerkwoord', meaning: 'Een werkwoord dat in dit gebruik het onderwerp aan zo’n eigenschap, toestand of identiteit verbindt.', example: 'De deur is groen: is koppelt de deur aan groen. In Noor is vertrokken is het een hulpwerkwoord.' },
      { term: 'Bepaling van gesteldheid', meaning: 'Een beschrijving van een deelnemer tijdens een handeling of als resultaat daarvan; gesteldheid betekent hier toestand.', example: 'Noor loopt moe naar huis: Noor is moe tijdens het lopen. Zij veegt de vloer schoon: de vloer wordt schoon.' },
    ],
    walkthrough: {
      title: 'Een handeling en haar resultaat uit elkaar houden',
      situation: 'Noor vertelt wat zij gisteren aan een deur heeft veranderd. Je wilt onderscheiden wat zij deed en welke eigenschap de deur daardoor kreeg.',
      startSentence: 'Noor heeft de deur gisteren groen geverfd.',
      steps: [
        {
          title: 'Zoek eerst de persoonsvorm',
          explanation: 'Met de tijdproef wordt heeft had. Geverfd blijft gelijk en is hier dus geen persoonsvorm. De zin vertelt nog steeds over verven; het hulpwerkwoord draagt de grammaticale tijd en sluit aan bij het onderwerp Noor.',
          sentence: 'Noor had de deur gisteren groen geverfd.',
          focus: ['had', 'geverfd'],
        },
        {
          title: 'Verbind de hele werkwoordelijke keten',
          explanation: 'Ga terug naar de oorspronkelijke zin. Heeft en geverfd drukken samen de handeling uit. De deur, gisteren en groen staan ertussen, maar zijn geen extra werkwoorden. Het werkwoordelijk gezegde is hier heeft geverfd, niet alleen geverfd.',
          sentence: 'Noor heeft de deur gisteren groen geverfd.',
          focus: ['heeft', 'geverfd'],
        },
        {
          title: 'Onderzoek wie de kleur krijgt',
          explanation: 'Groen zegt wat de deur door het verven wordt, niet hoe Noor haar kwast beweegt. Verbind daarom groen met de deur. Dit is een bepaling van gesteldheid als resultaat van de handeling, naast het werkwoordelijk gezegde heeft geverfd.',
          sentence: 'Noor heeft de deur gisteren groen geverfd.',
          focus: ['de deur', 'groen'],
        },
        {
          title: 'Beschrijf daarna alleen de bereikte toestand',
          explanation: 'Nu vertel je rechtstreeks hoe de deur is: De deur is nu groen. Is koppelt het onderwerp aan groen, dus is groen vormt het naamwoordelijk gezegde. De eigenschap blijft dezelfde, maar haar functie verandert met de nieuwe zinsbouw.',
          sentence: 'De deur is nu groen.',
          focus: ['De deur', 'is', 'groen'],
        },
      ],
      result: 'De deur is nu groen. Hier vormt is groen het naamwoordelijk gezegde. In Noor heeft de deur gisteren groen geverfd was heeft geverfd het werkwoordelijk gezegde en groen een beschrijving van het bereikte resultaat.',
    },
    pitfalls: [
      { mistake: 'Je stopt bij de persoonsvorm en noemt heeft het volledige gezegde.', correction: 'In Noor heeft de docent gebeld hoort gebeld erbij. Zoek ook een heel werkwoord zoals bellen, een deelwoord zoals gebeld en een eventueel afgesplitst deel: Noor belt op bevat belt op.' },
      { mistake: 'Je noemt zijn of worden altijd een koppelwerkwoord.', correction: 'Onderzoek de hele verbinding. Noor is moe koppelt een eigenschap; Noor is vertrokken drukt een vertrek uit; De deur wordt geverfd beschrijft een passieve verfhandeling.' },
      { mistake: 'Je noemt elke eigenschap bij een werkwoord een beschrijving van de manier waarop het gebeurt.', correction: 'Moe in Noor fietst moe beschrijft Noor tijdens het fietsen. Voorzichtig in Noor fietst voorzichtig beschrijft de manier van fietsen. De woordsoort alleen bepaalt de zinsfunctie niet.' },
    ],
    quickCheck: {
      question: 'Wat doet rustig in De leerling leest rustig het hoofdstuk? De schrijver bedoelt dat het lezen zonder haast gebeurt, niet dat hij iets over de toestand van de leerling vertelt.',
      options: [
        { id: 'wijze', text: 'Het beschrijft hoe de leeshandeling gebeurt.', feedback: 'Met deze gegeven bedoeling is rustig een bepaling van wijze. Leest drukt de handeling uit; rustig voegt informatie over de uitvoering toe.' },
        { id: 'naamwoordelijk', text: 'Het vormt met leest een naamwoordelijk gezegde.', feedback: 'Leest koppelt het onderwerp hier niet aan een eigenschap. De zin vertelt een leeshandeling, dus je kunt leest rustig niet als naamwoordelijk gezegde aanwijzen.' },
        { id: 'gesteldheid', text: 'Het beschrijft de toestand van de leerling tijdens het lezen.', feedback: 'Dat zou een andere bedoelde lezing zijn. De opdracht vertelt juist dat rustig hier de manier van lezen aangeeft. Betekenis en context maken de analyse duidelijk.' },
      ],
      answer: 'wijze',
    },
    application: {
      prompt: 'Schrijf twee volledige zinnen over dezelfde leerling. Vertel eerst dat hij moe naar huis loopt. Beschrijf daarna zijn vermoeidheid rechtstreeks, zonder een loophandeling. Leg het verschil tussen de gezegdes uit.',
      starter: 'De leerling … naar huis. De leerling …',
      model: 'De leerling loopt moe naar huis. De leerling is moe.',
      reasoning: 'Loopt drukt in de eerste zin de handeling uit; moe beschrijft de leerling terwijl hij loopt. In de tweede zin koppelt is de leerling rechtstreeks aan moe: is moe vormt het naamwoordelijk gezegde. Andere natuurlijke formuleringen kunnen hetzelfde verschil laten zien.',
      checklist: ['Mijn eerste zin bevat een loophandeling en een gelijktijdige toestand.', 'Mijn tweede zin koppelt de leerling rechtstreeks aan moe.', 'Ik kan uitleggen waarom hetzelfde woord moe een andere functie krijgt.'],
    },
  },
  {
    lessonId: 'zinnen-04',
    introduction: [
      'Als je onderwerp en gezegde hebt gevonden, blijft er vaak informatie over. Geef niet alle overige woorden meteen hetzelfde label. In De docent geeft Noor het boek noemen Noor en het boek deelnemers aan de overdracht. Morgen en in de bibliotheek kunnen vertellen wanneer en waar die overdracht gebeurt. De werkwoordbetekenis helpt die relaties onderscheiden.',
      'Een lijdend voorwerp benoemt bij een geschikt werkwoord waarop de werking rechtstreeks betrekking heeft. Vraag bij De docent geeft Noor het boek wat de docent geeft: het boek. Een natuurlijke passieve omzetting helpt controleren: Het boek wordt aan Noor gegeven. Het boek is daarin onderwerp. Dit is een aanwijzing, geen universele truc: niet ieder werkwoord levert een natuurlijk passief op.',
      'Noor is in de geefzin de ontvanger. Daarom onderzoek je deze groep als meewerkend voorwerp: De docent geeft het boek aan Noor zegt wie het ontvangt. Aan toevoegen is vooral bij zulke overdrachtswerkwoorden bruikbaar. De naam betekent niet dat Noor actief moet meehelpen; ontvanger is hier de relevante rol. Andere werkwoorden kunnen andere soorten deelnemers vragen.',
      'Ook groepen met een voorzetsel verschillen. In Noor wacht op de bus noemt op de bus wat zij verwacht: wachten op is een vast patroon. In Noor wacht bij de halte geeft bij de halte de plaats van het wachten. Zulke tijd-, plaats- of wijze-informatie heet een bijwoordelijke bepaling. Vraag wat de groep in deze betekenis toevoegt, niet alleen hoe zij begint.',
      'Welke aanvullingen bij een werkwoordbetekenis passen, heet de valentie van die betekenis. Weglaten is geen sluitende voorwerpsproef: Noor leest kan zonder genoemd boek, terwijl wonen vaak plaatsinformatie vraagt. Ook bestaan bijzondere aanvullingen: mijn sleutels bij Ik ben mijn sleutels kwijt heet in de huidige E-ANS oorzakelijk voorwerp. Dat is een grammaticale naam, geen bewering dat de sleutels de oorzaak zijn.',
    ],
    concepts: [
      { term: 'Lijdend voorwerp', meaning: 'Het rechtstreeks bij een passende werkwoordelijke werking betrokken zinsdeel; vaak wordt het onderwerp bij een natuurlijke passieve omzetting.', example: 'De docent leest het verslag → Het verslag wordt gelezen: het verslag is in de eerste zin lijdend voorwerp.' },
      { term: 'Meewerkend voorwerp', meaning: 'Een zinsdeel dat bij geschikte gezegdes onder meer de ontvanger van een overgedragen zaak of boodschap noemt.', example: 'Noor geeft Sam het boek → Noor geeft het boek aan Sam: Sam is de ontvanger.' },
      { term: 'Voorzetselvoorwerp', meaning: 'Een aanvulling met een voorzetsel dat bij het vaste patroon van dit gezegde in deze betekenis hoort.', example: 'In Noor twijfelt aan het plan benoemt aan het plan waarop de twijfel gericht is.' },
      { term: 'Bijwoordelijke bepaling', meaning: 'Informatie zoals tijd, plaats, wijze of maat. De functie hangt af van wat die informatie in de zin doet.', example: 'Morgen wacht Noor bij het station: Morgen geeft tijd en bij het station geeft plaats.' },
    ],
    walkthrough: {
      title: 'Een overdracht van boeken volledig uitleggen',
      situation: 'De docent geeft de nieuwe boeken morgen aan Noor. De overdracht zelf vindt in de bibliotheek plaats. Je wilt zaak, ontvanger, tijd en plaats duidelijk uit elkaar houden.',
      startSentence: 'Morgen geeft de docent Noor de nieuwe boeken in de bibliotheek.',
      steps: [
        {
          title: 'Gebruik geven om de deelnemers te vinden',
          explanation: 'De docent is degene die geeft en is hier het onderwerp. Geeft is het gezegde. Het gebruikte geven-patroon noemt daarnaast wat overgedragen wordt en wie het ontvangt. Zoek die twee relaties voordat je de tijd en plaats benoemt.',
          sentence: 'Morgen geeft de docent Noor de nieuwe boeken in de bibliotheek.',
          focus: ['geeft', 'de docent', 'Noor', 'de nieuwe boeken'],
        },
        {
          title: 'Controleer het gegeven voorwerp met een passieve zin',
          explanation: 'De nieuwe boeken worden in deze passieve versie onderwerp: ze worden gegeven. Dat steunt hun analyse als lijdend voorwerp in de oorspronkelijke zin. Noor blijft de ontvanger; door de docent noemt nu wie de overdracht uitvoert.',
          sentence: 'De nieuwe boeken worden morgen in de bibliotheek door de docent aan Noor gegeven.',
          focus: ['De nieuwe boeken', 'worden', 'gegeven'],
        },
        {
          title: 'Maak de ontvanger zichtbaar met aan',
          explanation: 'Ga terug naar de actieve zin en schrijf aan Noor achter de gegeven boeken. Deze geschikte aan-versie verduidelijkt wie iets ontvangt. De nieuwe boeken blijft het lijdend voorwerp; aan Noor is hier het meewerkend voorwerp bij geven.',
          sentence: 'Morgen geeft de docent de nieuwe boeken aan Noor in de bibliotheek.',
          focus: ['de nieuwe boeken', 'aan Noor'],
        },
        {
          title: 'Zet de plaats vooraan zonder haar een ontvanger te maken',
          explanation: 'In de bibliotheek zegt waar de overdracht plaatsvindt. Zet die groep vooraan; morgen blijft het tijdstip noemen. De plaats kan verhuizen, maar ontvangt geen boeken en verandert niet in een voorwerp doordat zij nu de zin begint.',
          sentence: 'In de bibliotheek geeft de docent morgen de nieuwe boeken aan Noor.',
          focus: ['In de bibliotheek', 'morgen', 'de nieuwe boeken', 'aan Noor'],
        },
      ],
      result: 'In de bibliotheek geeft de docent morgen de nieuwe boeken aan Noor. De docent is onderwerp, geeft is gezegde, de nieuwe boeken is lijdend voorwerp en aan Noor meewerkend voorwerp. De plaats en het tijdstip beschrijven de overdracht.',
    },
    pitfalls: [
      { mistake: 'Je noemt iedere groep na een werkwoord een lijdend voorwerp.', correction: 'Onderzoek de relatie. Twintig kilo in De koffer weegt twintig kilo geeft een maat, niet iets dat door de koffer gewogen wordt. Een positie in de zin is geen functie.' },
      { mistake: 'Je noemt iedere voorzetselgroep een voorzetselvoorwerp.', correction: 'Op de trein in Noor wacht op de trein noemt wat zij verwacht. Bij het loket in Noor wacht bij het loket noemt de wachtplaats. Het gezegde in zijn bedoelde betekenis maakt het verschil.' },
      { mistake: 'Je denkt dat voorwerpen verplicht zijn en bepalingen altijd weg kunnen.', correction: 'Noor leest kan zonder genoemd voorwerp; Noor woont vraagt in een gewone mededeling vaak verdere informatie. Gebruik weglaten als hulpmiddel naast betekenis en werkwoordpatroon, nooit als losse beslisregel.' },
    ],
    quickCheck: {
      question: 'De buurman verwacht hulp en zegt: Ik reken op hulp van Sam. Welke functie heeft op hulp van Sam in deze betekenis?',
      options: [
        { id: 'voorzetselvoorwerp', text: 'Voorzetselvoorwerp bij het patroon rekenen op.', feedback: 'Rekenen op betekent hier verwachten of vertrouwen op. Op hulp van Sam vult dat patroon aan en noemt waarop de verwachting gericht is.' },
        { id: 'plaats', text: 'Bijwoordelijke bepaling van de plek waar gerekend wordt.', feedback: 'Op heeft hier geen letterlijke plaatsbetekenis. De buurman bevindt zich niet boven op hulp; hij verwacht hulp. Kijk naar de gegeven betekenis van rekenen op.' },
        { id: 'ontvanger', text: 'Meewerkend voorwerp dat de ontvanger noemt.', feedback: 'Hulp van Sam ontvangt hier geen overgedragen zaak. De groep noemt waarop de buurman rekent; dat is een andere relatie dan Sam in Ik geef Sam een boek.' },
      ],
      answer: 'voorzetselvoorwerp',
    },
    application: {
      prompt: 'Schrijf een volledige overdracht over een rooster. Begin met de plaats en maak de ontvanger zichtbaar met aan. Behoud wie het rooster geeft, wanneer dat gebeurt en welk rooster het is.',
      starter: 'De begeleider geeft de cursisten morgen het nieuwe rooster op kantoor.',
      model: 'Op kantoor geeft de begeleider morgen het nieuwe rooster aan de cursisten.',
      reasoning: 'Op kantoor noemt de plaats en morgen het tijdstip. Het nieuwe rooster is de overgedragen zaak; aan de cursisten noemt de ontvangers. De begeleider blijft het onderwerp. Deze volgorde is een voorbeeld; ook andere natuurlijke volgordes kunnen alle gevraagde informatie behouden.',
      checklist: ['Mijn zin noemt gever, rooster, ontvangers, tijd en plaats.', 'De hele plaatsgroep staat vooraan.', 'Ik kan het rooster van de ontvangers onderscheiden en uitleggen wat aan toevoegt.'],
    },
  },
];
