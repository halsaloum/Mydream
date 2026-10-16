import type { SentenceTeaching } from './teaching-types';

/** Beginner explanations and practical transfer; existing graded exercises remain unchanged. */
export const compositionTeaching: SentenceTeaching[] = [
  {
    lessonId: 'zinnen-09',
    introduction: [
      'Soms past de informatie die je wilt geven niet in één los woord. Vergelijk: Ik weet het antwoord en Ik weet dat de cursus doorgaat. In de tweede zin vertelt een hele kleine zin wat je weet. Die kleine zin heeft een eigen onderwerp, de cursus, en een eigen persoonsvorm, doorgaat.',
      'Zo’n bijzin krijgt een functie binnen een grotere zin. Vraag daarom eerst wat het hele blok daar doet. Dat de cursus doorgaat, verheugt mij: de inhoud verheugt mij en is dus onderwerp. Ik weet dat de cursus doorgaat: dezelfde inhoud is nu wat ik weet, het lijdend voorwerp. De woorden alleen bepalen de functie niet.',
      'Een bijzin kan ook een voorwaarde geven of een naamwoord beschrijven. Bij de collega die morgen komt hoort die morgen komt binnen de beschrijving van de collega. Je verplaatst dan niet zomaar elk klein stukje apart. Door complete bouwstenen te herkennen, kun je een voorwaarde vooraan zetten en je lezer meteen vertellen wanneer een afspraak geldt.',
    ],
    concepts: [
      { term: 'Bijzin', meaning: 'Een kleine zin die afhankelijk is van een grotere zin of woordgroep. Bij gewone dat- en als-bijzinnen staan de werkwoorden doorgaans achterin. Bij meerdere werkwoorden hoeft de persoonsvorm binnen die eindgroep niet als laatste te staan.', example: 'Ik hoor dat Noor morgen komt. De cursus gaat door als genoeg mensen zich aanmelden.' },
      { term: 'Een hele bijzin als zinsdeel', meaning: 'Een bijzin kan één functie in de grotere zin vervullen. Vervang het hele blok door dit, dat of een passende bepaling en onderzoek de functie van die vervanging.', example: 'Dat Noor komt, verbaast mij → Dat verbaast mij. Ik hoor dat Noor komt → Ik hoor dit.' },
      { term: 'Een bijzin binnen een woordgroep', meaning: 'Soms beschrijft de bijzin een naamwoord. Dan is hij een onderdeel van een groter zinsdeel. Zoek eerst die volledige woordgroep, anders maak je een grens op het verkeerde niveau.', example: 'De collega die morgen komt, kent Noor. De hele onderwerpgroep is de collega die morgen komt.' },
      { term: 'Een voorlopige aankondiging', meaning: 'Een kort woord kan een lange bijzin achteraan aankondigen. De vorm hangt af van de constructie: het, er en ervan zijn geen vrij verwisselbare opvulwoorden. Leer ze met het bijbehorende gezegde.', example: 'Het is duidelijk dat de les doorgaat. Er wordt gezegd dat de les doorgaat. Ik ga ervan uit dat de les doorgaat.' },
    ],
    walkthrough: {
      title: 'Zet de bezorgvoorwaarde vooraan',
      situation: 'Je schrijft aan bezoekers wanneer de bibliotheek hun boeken bezorgt. De bezorgafspraak geldt bij droog weer. Je wilt dat de lezer die voorwaarde meteen ziet, terwijl dezelfde personen dezelfde boeken blijven bezorgen.',
      startSentence: 'Wij bezorgen de boeken als het droog blijft.',
      steps: [
        { title: 'Vind de kleine zin', explanation: 'Zoek niet alleen het woord als. Neem het hele blok als het droog blijft mee. Binnen dat blok is het het onderwerp en blijft de persoonsvorm. Samen vertellen deze woorden onder welke voorwaarde wij bezorgen.', sentence: 'Wij bezorgen de boeken als het droog blijft.', focus: ['als het droog blijft'] },
        { title: 'Onderzoek wat het hele blok doet', explanation: 'Vervang de kleine zin tijdelijk door onder die voorwaarde. De grote zin blijft begrijpelijk en de functie blijft herkenbaar: het gaat om een voorwaarde bij bezorgen. Deze proef helpt je de juiste bouwsteen te kiezen.', sentence: 'Wij bezorgen de boeken onder die voorwaarde.', focus: ['onder die voorwaarde'] },
        { title: 'Verplaats de complete voorwaarde', explanation: 'Zet de oorspronkelijke als-bijzin vooraan. In deze gewone mededelende hoofdzin volgt bezorgen op het eerste volledige zinsdeel. Daarom komt wij nu na bezorgen. Je verandert de aandacht van de lezer, terwijl de bezorgafspraak inhoudelijk gelijk blijft.', sentence: 'Als het droog blijft, bezorgen wij de boeken.', focus: ['Als het droog blijft,', 'bezorgen wij'] },
        { title: 'Controleer beide zinsniveaus', explanation: 'Lees de bijzin en de hoofdzin afzonderlijk terug. Blijft hoort bij het droge weer; bezorgen hoort bij wij. De komma maakt hier de grens leesbaar. Dat de voorwaarde meerdere woorden bevat, schuift bezorgen niet verder naar achteren.', sentence: 'Als het droog blijft, bezorgen wij de boeken.', focus: ['blijft', 'bezorgen', 'wij'] },
      ],
      result: 'Als het droog blijft, bezorgen wij de boeken.',
    },
    pitfalls: [
      { mistake: 'Na de vooropgezette voorwaarde nog steeds Wij bezorgen schrijven.', correction: 'Als het droog blijft, bezorgen wij de boeken. Met dan kan ook: Als het droog blijft, dan bezorgen wij de boeken. Dan neemt dan de eerste plaats van de hoofdzin in.' },
      { mistake: 'Het dichtstbijzijnde meervoud de persoonsvorm van de grote zin laten bepalen.', correction: 'Dat alle deelnemers komen, verbaast mij. De hele bijzin is onderwerp van verbaast; deelnemers is onderwerp binnen de kleinere zin. Het hoofdzinwerkwoord wordt dus niet verbazen.' },
    ],
    quickCheck: {
      question: 'In Dat het team op tijd aankomt, is prettig: welke functie heeft de hele dat-bijzin in de grote zin?',
      options: [
        { id: 'onderwerp', text: 'Onderwerp: het op tijd aankomen is prettig.', feedback: 'Ja. Vervang het hele blok: Dat is prettig. Het team is onderwerp binnen de bijzin, maar de hele inhoud is onderwerp van de grote zin.' },
        { id: 'voorwerp', text: 'Lijdend voorwerp: de bijzin zegt wat iemand prettig doet.', feedback: 'Prettig zijn noemt hier geen handeling met een lijdend voorwerp. Vraag wat prettig is: dat is juist de genoemde inhoud.' },
        { id: 'nabepaling', text: 'Nabepaling: de bijzin beschrijft welk team bedoeld is.', feedback: 'Er staat geen naamwoord buiten de bijzin dat hierdoor wordt beschreven. Het team staat zelf binnen de bijzin; het hele blok vervult hier de onderwerpsfunctie.' },
      ],
      answer: 'onderwerp',
    },
    application: {
      prompt: 'Maak twee volledige zinnen voor deelnemers. Zet de parkeerplaatsvoorwaarde vooraan en maak duidelijk wat je van hun aanmelding verwacht. Behoud de gegeven informatie en gebruik bij de verwachting Ik ga ervan uit dat.',
      starter: 'We gebruiken de parkeerplaats als het hek open is. Ik verwacht dat alle deelnemers zich vooraf aanmelden.',
      model: 'Als het hek open is, gebruiken we de parkeerplaats. Ik ga ervan uit dat alle deelnemers zich vooraf aanmelden.',
      reasoning: 'De hele voorwaarde staat vooraan; gebruiken volgt daarop in de hoofdzin. Ervan hoort bij uitgaan van en kondigt de verwachte inhoud aan. De personen en de aanmeldvoorwaarde blijven herkenbaar.',
      checklist: ['Heb ik de complete als-bijzin verplaatst?', 'Kan ik de persoonsvorm van elke kleine en grote zin aanwijzen?', 'Past de aankondiging bij het gebruikte gezegde?', 'Vertellen mijn nieuwe zinnen dezelfde afspraak?'],
    },
  },
  {
    lessonId: 'zinnen-10',
    introduction: [
      'In een tekst wil je vaak iets toevoegen over iemand of iets dat al genoemd is. Ik kreeg een formulier. Het formulier moet morgen terug. Je kunt de tweede informatie met een betrekkelijke bijzin verbinden: het formulier dat morgen terug moet. Dat wijst terug naar formulier en neemt binnen de kleine zin zijn plaats in.',
      'Dat terugwijspunt heet het antecedent. Zoek het eerst, voordat je die, dat of wat kiest. Bij een gewoon enkelvoudig de-woord gebruik je die; bij een enkelvoudig het-woord dat. In het meervoud is de gewone vorm die. De vorm volgt hier het naamwoord, niet het echte geslacht van een persoon: het meisje dat is correct.',
      'Niet iedere verwijzing gaat naar één naamwoord. In De les liep uit, wat vervelend was wijst wat naar het hele uitlopen. En na iets, niets of alles kunnen wat en dat allebei passen. Een goede schrijver controleert daarom niet alleen de woordvorm, maar ook of de lezer precies dezelfde persoon, zaak of gebeurtenis terugvindt.',
    ],
    concepts: [
      { term: 'Antecedent', meaning: 'Het woord, de woordgroep of de mededeling waarnaar een verwijzing terugwijst. Vraag bij elke betrekkelijke bijzin: over wie of wat voeg ik hier informatie toe? Zoek zo nodig de kern van die groep.', example: 'Het verslag van de commissie dat gisteren verscheen: dat verwijst naar verslag, niet naar commissie.' },
      { term: 'Die en dat bij een naamwoord', meaning: 'De gewone betrekkelijke vorm is die bij een de-woord of meervoud, en dat bij een enkelvoudig het-woord. Een ander lidwoord in de zin verandert de woordsoort niet.', example: 'Een brief die aankomt; een formulier dat ontbreekt; twee formulieren die ontbreken.' },
      { term: 'Wat bij een hele mededeling', meaning: 'Wat kan terugwijzen naar de inhoud van de voorafgaande zin. Noem die inhoud hardop om te controleren wat je bedoelt. Na onbepaalde woorden zoals iets bestaat daarnaast ruimte voor wat én dat.', example: 'De vergadering liep uit, wat Noor vervelend vond. Er is iets wat we moeten bespreken; iets dat we moeten bespreken kan ook.' },
      { term: 'Verwijzen met een voorzetsel', meaning: 'Behoud het inhoudelijke verband: samenwerken met vraagt met, spreken over vraagt over. In verzorgde tekst is bij personen met wie gebruikelijk en bij zaken waarmee. Waarmee bij personen komt informeel ook voor.', example: 'De collega met wie ik samenwerk. Het onderwerp waarover we spreken. De pen waarmee ik schrijf.' },
    ],
    walkthrough: {
      title: 'Maak van twee formulierzinnen één duidelijke mededeling',
      situation: 'Je vertelt een collega welk ontvangen formulier nog aandacht nodig heeft. De informatie is: jij kreeg een formulier en het moet morgen terug. Je wilt herhaling vermijden en de deadline zichtbaar houden.',
      startSentence: 'Ik kreeg een formulier. Het formulier moet morgen terug.',
      steps: [
        { title: 'Vind wat beide zinnen delen', explanation: 'Beide zinnen gaan over hetzelfde formulier. De eerste introduceert het; de tweede vertelt wanneer het terug moet. Die tweede informatie kun je bij formulier onderbrengen, zolang duidelijk blijft dat het om hetzelfde ontvangen document gaat.', sentence: 'Ik kreeg een formulier. Het formulier moet morgen terug.', focus: ['een formulier', 'Het formulier'] },
        { title: 'Kies de vorm bij het naamwoord', explanation: 'Formulier is een enkelvoudig het-woord. Daarom gebruiken we hier dat als betrekkelijke vorm. Dat verwijst naar het ontvangen formulier. Moet is de persoonsvorm van de bijzin; terug geeft aan dat het document moet worden teruggebracht.', sentence: 'Ik kreeg het formulier dat morgen terug moet.', focus: ['het formulier', 'dat morgen terug moet'] },
        { title: 'Zet de deadline in de hoofdzin', explanation: 'Je kunt dezelfde informatie ook anders ordenen: maak de deadline de hoofdmededeling en gebruik dat ik kreeg om het formulier te herkennen. De volledige groep het formulier dat ik kreeg is nu het onderwerp van moet.', sentence: 'Het formulier dat ik kreeg, moet morgen terug.', focus: ['Het formulier dat ik kreeg,', 'moet morgen terug'] },
        { title: 'Trek de verwijzing terug', explanation: 'Lees dat als het formulier en controleer de betekenis: ik kreeg het formulier. Dat verwijst hier naar het document, niet naar het ontvangen als gebeurtenis. De lezer weet nu welk formulier bedoeld is én wat ermee moet gebeuren.', sentence: 'Het formulier dat ik kreeg, moet morgen terug.', focus: ['formulier', 'dat', 'ik kreeg'] },
      ],
      result: 'Het formulier dat ik kreeg, moet morgen terug.',
    },
    pitfalls: [
      { mistake: 'Die kiezen omdat je over een meisje of een ander persoon schrijft.', correction: 'Bij het meisje is dat de gewone vorm: Het meisje dat daar loopt. Na een voorzetsel kijk je opnieuw naar de constructie: het meisje met wie ik sprak.' },
      { mistake: 'Dat zonder verbindingswoord laten terugwijzen naar een hele vorige mededeling.', correction: 'De workshop liep uit, wat vervelend was. Met een nieuwe hoofdzin kan wel: De workshop liep uit, en dat was vervelend. Na iets zijn wat en dat allebei mogelijk.' },
    ],
    quickCheck: {
      question: 'Het team leverde het verslag later in dan afgesproken. Je vindt dat late inleveren vervelend. Welke zin maakt die verwijzing duidelijk?',
      options: [
        { id: 'gebeurtenis', text: 'Het team leverde het verslag te laat in, wat ik vervelend vond.', feedback: 'Ja. Wat verwijst naar het te late inleveren als hele gebeurtenis. Je noemt geen nieuwe eigenschap van alleen het verslag.' },
        { id: 'document', text: 'Het team leverde het verslag in dat ik vervelend vond.', feedback: 'Dat verwijst hier naar het verslag. Je presenteert het document als vervelend en bewaart bovendien niet dat het te laat werd ingeleverd.' },
        { id: 'dat-zin', text: 'Het team leverde het verslag te laat in, dat ik vervelend vond.', feedback: 'Dat kan hier niet als betrekkelijke vorm naar de hele mededeling terugwijzen. Gebruik wat, of begin een nieuwe hoofdzin met en dat.' },
      ],
      answer: 'gebeurtenis',
    },
    application: {
      prompt: 'Maak een korte mail met twee zinnen. Verbind de workshop met het oordeel over het uitlopen en beschrijf daarna welk bestand de nieuwe tijden bevat. Gebruik de gegeven feiten zonder extra oorzaak toe te voegen.',
      starter: 'De workshop liep uit. Dat uitlopen was vervelend. Het bestand bevat de nieuwe tijden. Ik stuurde dat bestand.',
      model: 'De workshop liep uit, wat vervelend was. Het bestand dat ik stuurde, bevat de nieuwe tijden.',
      reasoning: 'Wat vat de hele gebeurtenis samen. Dat verwijst naar bestand, een enkelvoudig het-woord. De bijzin dat ik stuurde hoort binnen de onderwerpgroep het bestand dat ik stuurde; de deadline of oorzaak wordt niet verzonnen.',
      checklist: ['Kan ik bij elke verwijzing het antecedent aanwijzen?', 'Verwijs ik naar een naamwoord of naar de hele gebeurtenis?', 'Past de gekozen vorm bij die verwijzing?', 'Blijft voor de ontvanger duidelijk welk bestand ik bedoel?'],
    },
  },
  {
    lessonId: 'zinnen-11',
    introduction: [
      'Je kunt een zin inkorten wanneer de lezer ontbrekende informatie gemakkelijk kan aanvullen. Vergelijk Toen ik naar huis liep, belde ik Noor met Lopend naar huis belde ik Noor. De tweede versie schrijft ik niet nog eens uit, maar ik blijft duidelijk degene die loopt én belt. Die gedeelde uitvoerder maakt de verkorting begrijpelijk.',
      'Een beknopte bijzin heeft geen eigen persoonsvorm en schrijft zijn onderwerp niet uit. De constructie helpt bepalen wie bedoeld is. Bij De coach vraagt ons om vroeg te komen zijn wij de vroegkomers, niet de coach. De verzwegen persoon is dus niet automatisch altijd het onderwerp van de hoofdzin; ook context en het gebruikte werkwoord doen ertoe.',
      'Ook tussen verbonden hoofdzinnen kun je herhaalde woorden weglaten. Controleer dan wat je zou moeten terugzetten. Ik heb gegeten en ben vertrokken heeft twee verschillende hulpwerkwoorden nodig. Jullie komen vandaag en ik morgen is juist een gewone toegestane verkorting, hoewel de volledig uitgeschreven tweede zin ik kom morgen zou luiden. Korter schrijven vraagt controle van betekenis en constructie.',
    ],
    concepts: [
      { term: 'Beknopte bijzin', meaning: 'Een afhankelijke constructie met een infinitief of deelwoord, zonder eigen persoonsvorm en zonder uitgeschreven onderwerp. De lezer moet kunnen begrijpen wie de handeling uitvoert. Een volledige bijzin kan die persoon wel expliciet noemen.', example: 'Om vroeg te komen. Lachend. Na het verslag gelezen te hebben. Volledig: Nadat ik het verslag had gelezen.' },
      { term: 'Verzwegen uitvoerder', meaning: 'De persoon die je inhoudelijk bij de beknopte handeling begrijpt. Zoek een passend aanknopingspunt in de grotere constructie. Soms is dat het onderwerp, soms een voorwerp; vaste uitdrukkingen kunnen weer anders werken.', example: 'Lachend deelt Mila de folders uit: Mila lacht. De coach vraagt ons om vroeg te komen: wij komen vroeg.' },
      { term: 'Samentrekking', meaning: 'Het weglaten van herhaalde delen in verbonden zinnen. Zet die delen terug en controleer hun functie en betekenis. Een voorwerp mag niet zonder duidelijke verwijzing veranderen in het onderwerp van een tweede mededeling.', example: 'Ik kocht de jas en hing hem op → Ik kocht de jas en ik hing hem op.' },
      { term: 'Een uitzondering bij de persoonsvorm', meaning: 'Sommige verkortingen laten een persoonsvorm weg die bij uitschrijven van persoon of getal verandert. Dat kan gewoon correct zijn. Het bestaan van zo’n mogelijkheid maakt niet iedere andere weglating automatisch goed.', example: 'Jullie komen vandaag en ik morgen → Jullie komen vandaag en ik kom morgen.' },
    ],
    walkthrough: {
      title: 'Maak zichtbaar wie het verslag las',
      situation: 'Jij las een verslag en twijfelde daarna niet meer. Je eerste formulering koppelt de lezer van het verslag onvoldoende duidelijk aan de tweede mededeling. Je wilt je ervaring helder beschrijven.',
      startSentence: 'Na het verslag gelezen te hebben, verdween mijn twijfel.',
      steps: [
        { title: 'Vraag wie de handeling uitvoert', explanation: 'Het lezen heeft een persoon nodig. De beknopte aanloop noemt die persoon niet; de hoofdzin noemt mijn twijfel als onderwerp. Twijfel kan geen verslag lezen. Daardoor moet de lezer het bedoelde ik buiten deze formulering zoeken.', sentence: 'Na het verslag gelezen te hebben, verdween mijn twijfel.', focus: ['gelezen te hebben', 'mijn twijfel'] },
        { title: 'Schrijf de bedoelde lezer uit', explanation: 'Maak van de aanloop een volledige bijzin met ik als onderwerp en had als persoonsvorm. Nu staat expliciet wie las. De hoofdzin kan dezelfde formulering houden, omdat een volledige bijzin zijn eigen onderwerp heeft.', sentence: 'Nadat ik het verslag had gelezen, verdween mijn twijfel.', focus: ['Nadat ik het verslag had gelezen,', 'ik', 'had'] },
        { title: 'Vergelijk een andere passende oplossing', explanation: 'Een beknopte aanloop kan ook werken wanneer de hoofdzin een passend anker heeft. Hier benoemt ik dezelfde persoon die het verslag las. Deze versie vertelt de ervaring compacter, maar formuleert ook de tweede mededeling anders.', sentence: 'Na het verslag gelezen te hebben, twijfelde ik niet meer.', focus: ['gelezen te hebben', 'ik'] },
        { title: 'Kies vanuit wat je wilt zeggen', explanation: 'We kiezen de volledige bijzin, zodat verdween mijn twijfel behouden blijft. Lees beide handelingen terug: ik las, mijn twijfel verdween. De zin zegt nu helder wat eerst gebeurde en wat daarna veranderde, zonder een verkeerde uitvoerder te suggereren.', sentence: 'Nadat ik het verslag had gelezen, verdween mijn twijfel.', focus: ['ik het verslag had gelezen', 'verdween mijn twijfel'] },
      ],
      result: 'Nadat ik het verslag had gelezen, verdween mijn twijfel.',
    },
    pitfalls: [
      { mistake: 'Voor iedere beknopte bijzin eisen dat de uitvoerder het hoofdzinonderwerp is.', correction: 'Bij De docent vraagt de leerlingen om de oefening te maken voeren de leerlingen de oefening uit. Onderzoek de echte constructie. Vaste uitdrukkingen zoals eerlijk gezegd hebben bovendien hun eigen gebruik.' },
      { mistake: 'Elk herhaald werkwoord of onderwerp zonder controle weglaten.', correction: 'Ik heb gewerkt en ben vertrokken bewaart beide juiste hulpwerkwoorden. In De woning heb ik opgeknapt en zij ligt bij het park maakt zij het nieuwe onderwerp zichtbaar; woning was eerst het voorwerp.' },
    ],
    quickCheck: {
      question: 'Je bedoelt: jij kwam op het station aan en zag dat de trein weg was. Welke zin maakt die bedoeling duidelijk?',
      options: [
        { id: 'volledig', text: 'Toen ik op het station aankwam, zag ik dat de trein al weg was.', feedback: 'Ja. Ik is expliciet de aankomende persoon én degene die de afwezigheid van de trein ziet. De kleine zin heeft zijn eigen onderwerp en persoonsvorm.' },
        { id: 'zwevend', text: 'Aangekomen op het station was de trein al weg.', feedback: 'De aanloop noemt geen aankomende persoon, terwijl de hoofdzin de trein als onderwerp heeft. Deze formulering geeft het bedoelde ik geen duidelijk anker.' },
        { id: 'andere-persoon', text: 'Toen de trein op het station aankwam, zag ik dat hij al weg was.', feedback: 'Nu is de trein degene die aankomt. Dat verandert de gegeven gebeurtenis; het schrijft niet duidelijk uit dat jij op het station aankwam.' },
      ],
      answer: 'volledig',
    },
    application: {
      prompt: 'Schrijf twee duidelijke zinnen voor een collega. Maak eerst zichtbaar wie het bericht las. Verbind daarna jouw twee vertrekhandelingen zonder een verkeerd hulpwerkwoord weg te laten. Gebruik dezelfde personen en gebeurtenissen.',
      starter: 'Nadat ik het bericht had gelezen, was de afspraak duidelijk. Ik heb mijn tas gepakt. Ik ben daarna vertrokken.',
      model: 'Nadat ik het bericht had gelezen, was de afspraak duidelijk. Ik heb mijn tas gepakt en ben daarna vertrokken.',
      reasoning: 'De volledige bijzin benoemt ik als lezer; afspraak mag onderwerp van de hoofdzin zijn. In de tweede zin is alleen het herhaalde ik weggelaten. Heb en ben blijven staan, omdat pakken en vertrekken hier verschillende hulpwerkwoorden gebruiken.',
      checklist: ['Wie voert elke handeling uit?', 'Kan ik alle weggelaten woorden terugzetten?', 'Hebben de teruggezette delen de juiste functie en betekenis?', 'Zijn mijn hulpwerkwoorden passend?', 'Vertelt de verkorte versie dezelfde gebeurtenissen?'],
    },
  },
  {
    lessonId: 'zinnen-12',
    introduction: [
      'Leestekens helpen je lezer zien hoe de informatie bij elkaar hoort. Een komma kan een grens of een tussengedachte zichtbaar maken. Zij kan ook invloed hebben op welke personen je bedoelt. Daarom kies je een leesteken vanuit de structuur en de bedoeling van je zin, niet alleen omdat je tijdens het spreken even ademhaalt.',
      'Vergelijk De leerlingen die later aankwamen, kregen een bericht met De leerlingen, die later aankwamen, kregen een bericht. In de eerste versie helpt de bijzin kiezen welke leerlingen je bedoelt. In de tweede geeft hij extra informatie over de al bekende groep. In een passende context kan de tweede versie dus over de hele groep gaan.',
      'Er bestaat daarnaast stijlruimte: twee nauw verbonden mededelingen kun je vaak met een punt of puntkomma scheiden. Een dubbele punt kondigt bijvoorbeeld een uitleg of lijst aan. Gebruik geen puntkomma om een losse omdat-bijzin aan de hoofdzin te hangen. Leesbaarheid is belangrijk, maar niet iedere aanbeveling is een harde spellingregel met slechts één mogelijke oplossing.',
    ],
    concepts: [
      { term: 'Beperkende bijzin', meaning: 'Een beschrijving die helpt bepalen welke personen of zaken je bedoelt. Vóór die beschrijving zet je gewoonlijk geen komma. Een komma aan het einde kan wel de leesgrens met de rest van de zin markeren.', example: 'De bezoekers die een kaartje hebben, mogen naar binnen. Je selecteert de bezoekers met een kaartje.' },
      { term: 'Uitbreidende bijzin', meaning: 'Extra informatie over een al geïdentificeerde persoon of groep. Zet een komma ervoor en ook erna wanneer de oorspronkelijke zin doorgaat. Aan het einde van de zin is geen extra sluitkomma nodig.', example: 'Noor, die de planning bijhoudt, stuurt het bericht. Ik sprak Noor, die de planning bijhoudt.' },
      { term: 'Punt en puntkomma', meaning: 'Een punt sluit een zin af. Een puntkomma kan twee zelfstandige, inhoudelijk nauw verbonden mededelingen verbinden. Controleer of beide delen op zichzelf als zin kunnen staan; een punt is vaak ook een goede keuze.', example: 'De printer was defect; daarom stuurden we de stukken digitaal. Beide mededelingen kunnen zelfstandig staan.' },
      { term: 'Dubbele punt en tussengedachte', meaning: 'Een dubbele punt kan uitleg, een lijst of een citaat aankondigen. Een ingeschoven tussengedachte kun je tussen twee gedachtestreepjes zetten. Sluit de onderbreking voordat je verdergaat met de oorspronkelijke zin.', example: 'Neem drie dingen mee: water, een jas en je kaartje. De vergadering — na een korte pauze — begint om drie uur.' },
    ],
    walkthrough: {
      title: 'Geef alleen de late leerlingen een bericht',
      situation: 'Van tien leerlingen kwamen er drie later aan. Alleen die drie kregen een bericht. Je wilt precies die selectie uitdrukken; de zeven anderen kwamen op tijd en kregen dit bericht niet.',
      startSentence: 'De leerlingen, die later aankwamen, kregen een bericht.',
      steps: [
        { title: 'Controleer welke groep je bedoelt', explanation: 'De twee komma’s presenteren het later aankomen als extra informatie over de bekende leerlingen. Dat past hier niet bij de bedoeling: slechts drie van de tien kwamen later. De zin is niet op zichzelf ongrammaticaal, maar geeft een andere lezing.', sentence: 'De leerlingen, die later aankwamen, kregen een bericht.', focus: ['De leerlingen,', 'die later aankwamen,'] },
        { title: 'Laat de beschrijving selecteren', explanation: 'Haal de komma vóór die weg. Nu helpt die later aankwamen bepalen welke leerlingen je bedoelt. De bijzin is verbonden met de selectie, in plaats van als los extra bericht over de hele bekende groep te worden aangeboden.', sentence: 'De leerlingen die later aankwamen, kregen een bericht.', focus: ['De leerlingen die later aankwamen'] },
        { title: 'Schrijf de bedoelde betekenis uit', explanation: 'Controleer de nieuwe zin met een eenvoudige uitleg van de situatie: drie leerlingen kwamen later en alleen zij kregen dit bericht. Komt jouw bedoelde groep daarmee overeen? Deze betekeniscontrole is sterker dan zomaar ergens een pauzeteken weghalen.', sentence: 'Drie leerlingen kwamen later aan. Alleen zij kregen een bericht.', focus: ['Drie leerlingen', 'Alleen zij'] },
        { title: 'Behoud de leesgrens aan het einde', explanation: 'De komma na aankwamen helpt hier de overgang naar kregen lezen. Zij maakt de bijzin niet alsnog uitbreidend: juist het ontbreken van de eerste komma laat de selectie zien. Lees de volledige zin terug met de drie bedoelde leerlingen.', sentence: 'De leerlingen die later aankwamen, kregen een bericht.', focus: ['aankwamen,', 'kregen een bericht'] },
      ],
      result: 'De leerlingen die later aankwamen, kregen een bericht.',
    },
    pitfalls: [
      { mistake: 'Elke bijzin met die of dat automatisch tussen komma’s zetten.', correction: 'Kies eerst de betekenis: selecteert de bijzin een subgroep of geeft hij extra informatie? Een komma vóór de beschrijving kan die keuze veranderen. Kijk dus niet alleen naar de laatste komma.' },
      { mistake: 'Een puntkomma voor iedere lange toelichting gebruiken.', correction: 'Stuur deze documenten mee: je cv en het formulier kondigt een lijst aan. De printer was defect; daarom mailden we de stukken bevat twee zelfstandige mededelingen. Een punt kan in die tweede situatie ook.' },
    ],
    quickCheck: {
      question: 'Van vijf dozen bevatten er twee glas. Alleen die twee krijgen een sticker. Welke mededeling bewaart die selectie?',
      options: [
        { id: 'selectie', text: 'De dozen die glas bevatten, krijgen een sticker.', feedback: 'Ja. Zonder komma vóór die helpt de bijzin bepalen welke dozen bedoeld zijn: de twee met glas. De komma na bevatten markeert hier de leesgrens met de hoofdzin.' },
        { id: 'extra', text: 'De dozen, die glas bevatten, krijgen een sticker.', feedback: 'Deze versie presenteert glas bevatten als extra informatie over de al bekende dozen. Bij de gegeven groep van vijf bewaart zij niet de bedoelde selectie van twee.' },
        { id: 'hele-groep', text: 'De vijf dozen krijgen een sticker, omdat ze glas bevatten.', feedback: 'Deze zin geeft alle vijf dozen een sticker en noemt glas als reden. De gegevens zeggen juist dat slechts twee dozen glas bevatten en dat alleen die twee een sticker krijgen.' },
      ],
      answer: 'selectie',
    },
    application: {
      prompt: 'Schrijf een korte mededeling voor de projectgroep. Alleen drie van de tien collega’s werken thuis; alleen zij krijgen een code. Verbind daarna de twee nauw samenhangende mededelingen over de printer met een puntkomma.',
      starter: 'Alleen de thuiswerkende collega’s krijgen een code. De printer is defect. Daarom sturen we de stukken digitaal.',
      model: 'De collega’s die thuiswerken, krijgen een code. De printer is defect; daarom sturen we de stukken digitaal.',
      reasoning: 'De bijzin selecteert de thuiswerkende collega’s en heeft daarom geen komma vóór die. De puntkomma verbindt twee zelfstandige mededelingen. In een vrije tekst kan een punt daar ook, maar de opdracht oefent het zichtbaar houden van hun nauwe verband.',
      checklist: ['Bedoel ik dezelfde groep als in de situatie?', 'Geeft de bijzin selectie of extra informatie?', 'Zijn de delen rond de puntkomma zelfstandig?', 'Heb ik een ingeschoven beschrijving of gedachte weer afgesloten?', 'Helpen de leestekens mijn lezer de bedoeling begrijpen?'],
    },
  },
];
