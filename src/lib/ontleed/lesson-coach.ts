import type { ChoiceQuestion, OntleedLesson } from '@/content/ontleed/types';

export type SectionCoach = {
  summary: string;
  steps: string[];
  focusPrompt: string;
  check: ChoiceQuestion;
  lenses?: { label: string; highlight: string; explanation: string }[];
};

type SectionSupport = readonly [summary: string, misconception: string];
type LessonSupport = readonly [SectionSupport, SectionSupport, SectionSupport];

/**
 * Plain explanations and deliberately false, example-specific alternatives.
 * Correct answers and their feedback always come from the authored section,
 * keeping these supported checks separate from later independent practice.
 */
const SUPPORT: Record<string, LessonSupport> = {
  'basis-woord': [
    ['Een woord tussen twee spaties kan uit kleinere betekenisstukjes bestaan.', 'Plantjes heeft maar één betekenisstukje, omdat het zonder spatie wordt geschreven.'],
    ['Vergelijk meerdere woorden: hetzelfde stukje moet ook een vergelijkbare betekenis toevoegen.', 'Dezelfde letters bewijzen een patroon, ook als ze telkens iets heel anders betekenen.'],
    ['Zeg eerst wat je ziet. Leg daarna je vermoeden uit en benoem wat je nog niet weet.', 'Uit raamplantjeswinkel weet je precies welke producten de winkel verkoopt.'],
  ],
  'basis-lexeem': [
    ['Tel je iedere plek waar een woord staat, of alleen de verschillende geschreven vormen? Dat geeft andere aantallen.', 'Plant planten plant bevat twee voorkomens, omdat plant maar één keer meetelt.'],
    ['Loop en liep zijn verschillende vormen van hetzelfde werkwoord: lopen.', 'Loop en liep zijn twee aparte werkwoorden, omdat de spelling verschilt.'],
    ['Werkte is een vorm van werken. Werker is een ander woord dat er wel familie van is.', 'Werker en werkplek zijn persoonsvormen van het werkwoord werken.'],
  ],
  'basis-woordsoorten': [
    ['Kijk hoe een woord in de zin wordt gebruikt. Alleen de betekenis vertelt niet welke woordsoort het is.', 'Stilte kan geen zelfstandig naamwoord zijn, omdat je stilte niet kunt vastpakken.'],
    ['Hetzelfde geschreven woord kan in een andere omgeving een andere woordsoort hebben.', 'Groen heeft in beide voorbeelden dezelfde taak, alleen omdat de letters gelijk zijn.'],
    ['Woordsoort zegt wat voor woord het is. Zinsfunctie zegt wat de hele groep in deze zin doet.', 'Leerling wordt een werkwoord zodra de groep als lijdend voorwerp wordt gebruikt.'],
  ],
  'basis-vorm-functie': [
    ['Je kunt dezelfde woorden op drie manieren bekijken: hun bouw, hun taak in de zin en hun rol in de gebeurtenis.', 'De lange brief is de schrijver, omdat die woorden een naamwoordgroep vormen.'],
    ['In een passieve zin kan hetzelfde ding onderwerp worden. De doener hoeft dan niet genoemd te worden.', 'De deur wordt gerepareerd betekent dat niemand de reparatie uitvoert.'],
    ['Zoek het onderwerp door de zin te testen. Het eerste woord is niet automatisch het onderwerp.', 'Morgen is het onderwerp, omdat het als eerste in de zin staat.'],
  ],
  'woordbouw-morfemen': [
    ['Een betekenisvol woordstuk herken je door vorm én betekenis met andere woorden te vergelijken.', 'Her- heeft in herdruk en herbouw geen terugkerende betekenis.'],
    ['Sommige woordstukken kunnen los staan. Andere hebben een ander stukje nodig om samen een woord te vormen.', 'Her- kan met de betekenis opnieuw als los werkwoord in een zin staan.'],
    ['Knip een woord alleen waar je ook een betekenisverschil kunt uitleggen.', 'In onveilig kun je on- geen betekenis geven door het met andere woorden te vergelijken.'],
  ],
  'woordbouw-bases-affixen': [
    ['Bij elke bouwstap kijk je naar het hele woord waaraan je iets toevoegt. Dat is voor die stap de basis.', 'Bij leesbaarheid wordt -heid rechtstreeks aan lees toegevoegd en sla je leesbaar over.'],
    ['Een voor- of achtervoegsel past bij bepaalde woorden en voegt een eigen betekenis of functie toe.', 'Helder en helderheid zijn allebei bijvoeglijke naamwoorden met dezelfde betekenis.'],
    ['Bouw een lang woord stap voor stap. Controleer telkens of het tussenwoord en de betekenis kloppen.', 'In leesbaarheid is -baarheid één verplichte eerste stap voordat lees erbij komt.'],
  ],
  'woordbouw-buiging-afleiding': [
    ['Bij buiging verandert de grammaticale vorm, zoals werkt naar werken. Het blijft hetzelfde werkwoord.', 'Werkt en werken zijn verschillende werkwoorden zonder grammaticale samenhang.'],
    ['Een nieuw woord maken en dat woord in het meervoud zetten zijn twee verschillende bouwstappen.', 'Fietser en fietsers zijn allebei werkwoordvormen van fietsen.'],
    ['Vergelijk de betekenis, woordsoort en andere vormen samen om de bouwstap te verklaren.', 'Vriendelijkheid is alleen de vergrotende trap van vriendelijk, net als vriendelijker.'],
  ],
  'woordbouw-samenstellingen': [
    ['Vraag: dit is een soort wat? Dat helpt je het belangrijkste deel van een samenstelling te vinden.', 'Een schoolboek is een soort school; boek geeft alleen extra informatie.'],
    ['De delen zeggen nog niet precies hoe ze bij elkaar horen. Gebruik ook de gewone betekenis en de context.', 'Een leren jas is op dezelfde manier één samengesteld woord als regenjas.'],
    ['Kijk of je woorden binnen de groep kunt uitbreiden, of dat je een compleet samengesteld woord beschrijft.', 'Grote is een intern woorddeel van boekenkast, omdat het direct ervoor staat.'],
  ],
  'woordbouw-hierarchie': [
    ['Laat met haakjes zien welke delen eerst samen een woord vormen en wat je daarna toevoegt.', 'Een platte lijst met lees, baar, on en heid vertelt al welke delen eerst samengaan.'],
    ['Andere haakjes geven soms een andere betekenis. Kies de groepering die bij de bedoelde situatie past.', 'In de gegeven betekenis van schoolboekenkast hoort school alleen bij kast en niet bij boeken.'],
    ['Leg iedere bouwlaag in gewone woorden uit en zoek bij elke laag het belangrijkste deel.', 'Het hele woord tuinmeubelhoes is een soort meubel; hoes is alleen een beschrijving.'],
  ],
  'woordbouw-allomorfen': [
    ['Hetzelfde betekenisverschil kan verschillende vormen krijgen: huisje, boompje en tafeltje zijn allemaal verkleiningen.', 'Omdat je, pje en tje anders klinken, kunnen ze nooit dezelfde verkleinende functie hebben.'],
    ['Letters en klanken zijn niet hetzelfde. Onderzoek spelling en uitspraak afzonderlijk.', 'De d-spelling van hond bewijst dat je aan het eind precies dezelfde klank hoort als in honden.'],
    ['Een goede regel verklaart ook voorbeelden die anders uitpakken. Verander je regel als een contrast daarom vraagt.', 'Alle woorden die op m eindigen krijgen hetzelfde verkleinstukje; bommetje bevestigt dat.'],
  ],
  'woordbouw-paradigma': [
    ['Zet de vormen in een schema met persoon en getal. Dezelfde vorm kan op verschillende plekken passen.', 'Wij werken en zij werken hebben dezelfde grammaticale persoon omdat werken gelijk geschreven is.'],
    ['Eén vorm kan bij meerdere personen horen. Omgekeerd kan één werkwoord sterk verschillende vormen hebben.', 'Ik werkte en Noor werkte vullen dezelfde persoonscel omdat werkte hetzelfde is.'],
    ['Gebruik het hele vormenschema om een ontbrekende oefenvorm te vinden. Een leeg vakje bewijst nog geen ontbrekend taalwoord.', 'De lege plek in een oefenschema bewijst dat die vorm in het Nederlands onmogelijk is.'],
  ],
  'woordbouw-werkwoordvormen': [
    ['De persoonsvorm verandert mee met tijd of onderwerp. Tel daarvoor woordgroepen, geen losse woorden.', 'Heeft is geen persoonsvorm omdat het niet het tweede losse woord is.'],
    ['Een infinitief, deelwoord en persoonsvorm hebben verschillende taken binnen de werkwoordgroep.', 'Schrijven en geschreven zijn hier de persoonsvormen; wil en heeft zijn infinitieven.'],
    ['Een tegenwoordige werkwoordvorm kan over morgen gaan. Lees ook de tijdsaanduidingen in de zin.', 'Reist is in dit voorbeeld een verleden tijd omdat de reis later plaatsvindt.'],
  ],
  'woordbouw-productiviteit': [
    ['Een begrijpelijk nieuw woord laat zien dat je een patroon kunt gebruiken. Of het gangbaar is, vraagt meer voorbeelden.', 'Balkonleeslamp moet al een gangbaar productwoord zijn zodra één lezer het begrijpt.'],
    ['Het aantal voorkomens, verschillende vormen en eenmalige vormen zijn drie verschillende tellingen.', 'Lichtbak, lichtbak, lichtbak, daklamp bevat vier verschillende geschreven woordvormen.'],
    ['Test een nieuwe vorm bij meer mensen en in verschillende situaties voordat je een algemene regel maakt.', 'Als jij balkonleeslamp begrijpt, is bewezen dat iedere Nederlandstalige die vorm spontaan gebruikt.'],
  ],
  'woordbouw-conversie': [
    ['Een woord kan in een nieuwe woordsoort worden gebruikt zonder een apart nieuw afleidingsstukje.', 'Fietste heeft hier alleen naamwoordgebruik, omdat het verwant is aan een fiets.'],
    ['Een andere betekenis is niet automatisch een andere woordsoort.', 'De computermuis is een werkwoord geworden omdat muis eerst een dier aanduidde.'],
    ['Met zinnen kun je woordgebruik onderzoeken. Voor de vraag wat historisch eerst kwam heb je gedateerde bronnen nodig.', 'Uit alleen het huidige gebruik van mail kun je bewijzen welke toepassing historisch het eerst bestond.'],
  ],
  'woordbouw-partikels': [
    ['Volg een werkwoord in verschillende zinnen. Delen die bij elkaar horen kunnen soms uit elkaar staan.', 'Op hoort niet bij ophalen zodra het in Noor haalt de tas op los wordt geschreven.'],
    ['Hetzelfde kleine woord kan bij een werkwoord horen of een eigen voorzetselgroep beginnen.', 'Op heeft in opruimen en op de tafel altijd precies dezelfde grammaticale taak.'],
    ['Een kortere uitspraak verandert niet vanzelf de grammaticale relatie van een woord.', 'In ’t huis is ’t een nieuw afleidingsachtervoegsel dat achter huis wordt geplakt.'],
  ],
  'woordbouw-onderzoek': [
    ['Maak het verschil zichtbaar tussen een waargenomen voorbeeld en een regel die je nog moet testen.', 'De hypothese over -pje is al bewezen door het ene vormpaar boom/boompje.'],
    ['Bewaar ook voorbeelden die niet bij je eerste regel passen. Juist die helpen de regel te verbeteren.', 'Je mag bom/bommetje verwijderen zodra het niet bij je eerste m-regel past.'],
    ['Vertel wat je gegevens wel steunen, waarover je twijfelt en hoe je verder zou testen.', 'De conclusie over deze dataset verklaart zonder verdere tests alle Nederlandse verkleinwoorden.'],
  ],
  'zinsdelen-persoonsvorm': [
    ['Zet dezelfde zin in een andere tijd of verander het onderwerp. Kijk welk werkwoord meeverandert.', 'Vandaag is de persoonsvorm omdat het door gisteren wordt vervangen.'],
    ['In een werkwoordgroep is niet ieder werkwoord een persoonsvorm. Test elk werkwoord op zijn eigen taak.', 'Heeft, willen en fietsen zijn in deze zin allemaal persoonsvormen.'],
    ['Zoek per deelzin opnieuw een persoonsvorm. Een bijzin kan zijn eigen persoonsvorm hebben.', 'Alleen heeft is persoonsvorm; oefent kan dat in een bijzin niet zijn.'],
  ],
  'zinsdelen-proeven': [
    ['Een hele woordgroep kan één plek in de zin bezetten, ook als daarin weer kleinere groepen zitten.', 'De leerling met de blauwe jas kan geen groep zijn omdat er meerdere woorden in staan.'],
    ['Vervang de hele kandidaatgroep door één passend woord en kijk welke betekenis behouden blijft.', 'Zij vervangt in het voorbeeld alleen de blauwe jas; de leerling blijft apart staan.'],
    ['Gebruik meer dan één proef en zeg welke betekenis je onderzoekt. Eén proef beslist niet altijd alles.', 'De vervanging door hem bewijst in dit voorbeeld dat Noor de verrekijker gebruikt.'],
  ],
  'zinsdelen-kern': [
    ['Zoek het woord dat bepaalt wat voor groep het geheel is. Dat is de kern van die groep.', 'Rivier is de kern van de hele groep de nieuwe route langs de rivier.'],
    ['Onderdelen rond een kern kunnen een relatie invullen of die relatie verder beschrijven.', 'Vlak en naast hebben in het voorbeeld dezelfde taak: beide noemen het station.'],
    ['De vorm van de groep kan gelijk blijven terwijl haar taak in de zin verandert.', 'De nieuwe route verandert van woordsoort zodra Noor deze route kiest.'],
  ],
  'zinsdelen-naamwoordgroep': [
    ['Een naamwoordgroep kan iets nieuws introduceren of naar iets bekends verwijzen.', 'Een leerling en de leerling moeten in deze tekst altijd twee verschillende personen zijn.'],
    ['Een naamwoordgroep kan kleinere groepen bevatten. Zoek eerst de kern van de grootste groep.', 'Amir is de buitenste kern van de hele groep de oude fiets van de broer van Amir.'],
    ['Laat de persoonsvorm aansluiten bij de kern van het hele onderwerp, niet bij het dichtstbijzijnde naamwoord.', 'Boeken bepaalt hier het getal van de persoonsvorm, dus het moet liggen zijn.'],
  ],
  'zinsdelen-voorzetselgroep': [
    ['Een voorzetsel legt een relatie met de groep die erbij hoort: achter + het nieuwe museum.', 'Vlak is de voorzetselkern; achter het nieuwe museum is alleen een losse tijdsbepaling.'],
    ['Vraag waar de voorzetselgroep bij hoort: bij een naamwoord of bij de hele gebeurtenis?', 'Bij het station beschrijft in deze haakjes de kleur rood en hoort niet bij fiets.'],
    ['Dezelfde soort groep kan een andere relatie hebben. Vergelijk waarop iemand wacht met waar dat gebeurt.', 'Op een antwoord en in het park noemen hier allebei de plaats waar Noor wacht.'],
  ],
  'zinsdelen-valentie': [
    ['Kijk welke deelnemers een werkwoord bij elkaar brengt. Tel hele groepen, geen losse naamwoorden.', 'Klas is hier naast de leerlingen een tweede zelfstandige slaperdeelnemer.'],
    ['Bij leggen hoort een bestemming; bij slapen kun je vrijer een plaats toevoegen. Weglaten alleen bewijst dat verschil niet.', 'In de trein heeft bij slapen en leggen noodzakelijk dezelfde relatie met het werkwoord.'],
    ['Een ander zinsverband kan een veroorzaker toevoegen of deelnemers een andere grammaticale taak geven.', 'De vaas brak en Noor brak de vaas noemen allebei Noor als veroorzaker.'],
  ],
  'zinsdelen-onderwerp': [
    ['Maak de kandidaatgroep enkelvoudig of meervoudig. Verandert de persoonsvorm mee? Houd de hele groep bij elkaar.', 'Drie schriftjes bepaalt hier het meervoud van de persoonsvorm omdat het er het dichtst bij staat.'],
    ['Het onderwerp hoeft niets te doen. Het kan ook iets ondergaan of ervaren.', 'Noor is hier het onderwerp omdat Noor de deur opent; de deur kan geen onderwerp zijn.'],
    ['Het onderwerp kan achter de persoonsvorm staan, bijvoorbeeld in een vraag of na morgen.', 'Noor houdt op onderwerp te zijn zodra vertrekt ervoor staat.'],
  ],
  'zinsdelen-gezegde': [
    ['Zoek alle werkwoorden die samen de gebeurtenis uitdrukken, ook als andere woorden ertussen staan.', 'De uitleg hoort bij het werkwoordelijke gezegde omdat het tussen heeft en gelezen staat.'],
    ['Soms koppelt een werkwoord een eigenschap of identiteit aan het onderwerp.', 'Bijzonder helder is hier het lijdend voorwerp dat een handeling ondergaat.'],
    ['Dezelfde werkwoordvorm kan verschillende taken hebben. Bekijk daarom de hele zin eromheen.', 'Wordt heeft bij arts worden en gebeld worden altijd dezelfde koppelende taak.'],
  ],
  'zinsdelen-voorwerpen': [
    ['Een voorwerp kan vooraan staan. Zoek de relatie met het werkwoord en controleer daarnaast het onderwerp.', 'Die brief wordt onderwerp zodra de groep vooraan in de tweede zin staat.'],
    ['Bij geven kun je apart vragen wie ontvangt en wat wordt gegeven.', 'Amir is de gegeven zaak en een kaart is de ontvanger.'],
    ['Sommige werkwoorden kiezen een vaste voorzetselrelatie. Onderscheid die van een losse tijd- of plaatsgroep.', 'Tijdens de bijeenkomst noemt hier waarop Amir vertrouwt; op steun noemt alleen een plaats.'],
  ],
  'zinsdelen-bepalingen': [
    ['Kijk welk onderdeel extra informatie krijgt: een naamwoord of de gebeurtenis als geheel.', 'Bij het raam staat in deze haakjes buiten de onderwerpsgroep en bepaalt alleen is bezet.'],
    ['Een tijdsbepaling kan verschillende vormen hebben: één bijwoord, een voorzetselgroep of een naamwoordgroep.', 'Alle drie de tijdsbepalingen zijn voorzetselgroepen omdat ze een tijd aangeven.'],
    ['Vraag waarop een bepaling invloed heeft: de hele mededeling of bijvoorbeeld alleen de manier van werken.', 'Misschien en zorgvuldig zeggen hier allebei hoe netjes Noor werkt.'],
  ],
  'zinsdelen-bomen': [
    ['Zoek eerst welke woorden bij elkaar horen. Teken daarna pas de groepen binnen de grotere groep.', 'Met de tas staat buiten de hele groep de leerling met de tas.'],
    ['In een boom hangt iedere kleinere groep onder het onderdeel waar zij bij hoort.', 'Met de tas hangt hier rechtstreeks onder lacht en beschrijft de lachhandeling.'],
    ['Een functie zoals onderwerp hoort bij de hele tak. Binnen die tak kunnen kleinere zinnen zitten.', 'Alleen leerling is onderwerp van lacht; de rest van de naamwoordgroep hoort er nooit bij.'],
  ],
  'zinsdelen-ambiguiteit': [
    ['Een zin kan dubbelzinnig zijn door een woordbetekenis of door twee mogelijke groeperingen.', 'De twee betekenissen van bank bewijzen op zichzelf dat de zin twee verschillende groepsstructuren heeft.'],
    ['Andere haakjes laten zien waar een bepaling bij hoort. Controleer die lezing met een passende vervanging.', 'Bij de getoonde vervanging is de verrekijker van Noor en staat hij buiten de objectgroep.'],
    ['Schrijf de bedoelde relatie uit als je maar één lezing wilt toelaten.', 'De herschreven zin zegt dat de fietser een verrekijker gebruikt om Noor te bekijken.'],
  ],
  'zinsbouw-v2': [
    ['In een gewone mededelende hoofdzin staat de persoonsvorm op de tweede plek als je woordgroepen telt.', 'Fietst staat op de tweede plek omdat de regel altijd het tweede losse woord telt.'],
    ['Voor de persoonsvorm kan ook een andere groep dan het onderwerp staan.', 'Die brief is onderwerp omdat het in dit voorbeeld de eerste groep is.'],
    ['Een vraag en een bijzin hebben andere volgordepatronen dan een gewone mededelende hoofdzin.', 'Een ja/nee-vraag moet altijd beginnen met een onderwerp en daarna de persoonsvorm.'],
  ],
  'zinsbouw-inversie': [
    ['Zet je morgen vooraan, dan blijft de persoonsvorm op plek twee en komt het onderwerp erachter.', 'Na het vooropzetten van morgen wordt morgen het onderwerp en verliest Noor die functie.'],
    ['Een ja/nee-vraag kan met de persoonsvorm beginnen. Een vraaggroep kan als geheel vooraan staan.', 'Welke route is in de tweede vraag geen groep omdat er twee woorden in staan.'],
    ['Een rechtstreekse vraag heeft een andere volgorde dan dezelfde vraag binnen een grotere zin.', 'Wanneer vertrekt Noor en wanneer Noor vertrekt hebben precies dezelfde werkwoordvolgorde.'],
  ],
  'zinsbouw-velden': [
    ['Verdeel de zin in vakken rond de werkwoorden. Een vak vertelt waar iets staat, niet welke functie het heeft.', 'Morgen is het onderwerp omdat het het voorveld vult.'],
    ['Werkwoorddelen kunnen over de zin verspreid staan. De woorden ertussen verbreken hun verband niet.', 'Ruimt en op horen niet bij elkaar omdat de objectgroep ertussen staat.'],
    ['Maak voor iedere deelzin een eigen zinsraam. Een bijzin heeft andere grenzen dan een hoofdzin.', 'Heeft moet in deze omdat-bijzin dezelfde tweede positie innemen als in een mededelende hoofdzin.'],
  ],
  'zinsbouw-werkwoordclusters': [
    ['Werkwoorden in één groep verdelen verschillende taken: persoonsvorm, infinitief of deelwoord.', 'Gelezen en lezen zijn allebei persoonsvormen in de twee gegeven zinnen.'],
    ['Voor sommige werkwoordcombinaties zijn meerdere volgordes mogelijk. Controleer de concrete combinatie.', 'Alleen heeft gelezen is in deze eenvoudige bijzin mogelijk; gelezen heeft is altijd fout.'],
    ['Meerdere werkwoorden vormen niet automatisch meerdere deelzinnen. Zoek de eigen persoonsvormen en grenzen.', 'Heeft willen lezen bestaat uit drie finiete deelzinnen omdat het drie werkwoorden bevat.'],
  ],
  'zinsbouw-nevenschikking': [
    ['Kijk wat en met elkaar verbindt: woorden, hele groepen of complete deelzinnen.', 'En verbindt hier alleen Noor met vrienden; van Amir vormt een extra onderwerp buiten die groep.'],
    ['Herhaal een beschrijving als duidelijk moet zijn dat zij voor beide groepen geldt.', 'In dit voorbeeld zijn alleen de leerlingen jong; jonge docenten zegt niets over hun leeftijd.'],
    ['Laat woorden alleen weg als de lezer ze uit het verband kan terugvinden.', 'Na het weglaten van de tweede Noor moet de lezer een andere persoon als bekijker begrijpen.'],
  ],
  'zinsbouw-bijzinnen': [
    ['Een zin kan een andere zin bevatten, die zelf weer een zin bevat. Zoek per laag de persoonsvorm.', 'Zegt, denkt en vertrekt horen alle drie bij één deelzin zonder verdere lagen.'],
    ['Een bijzin kan inhoud geven, een omstandigheid noemen of een naamwoord beschrijven.', 'Dat Amir vertrekt noemt hier de plaats waar Noor iets weet.'],
    ['Een hele bijzin kan één plek in de hoofdzin vullen. Onderzoek daarna de volgorde binnen elke laag.', 'Omdat en de trein vullen samen al twee losse hoofdzinposities vóór vertrekt.'],
  ],
  'zinsbouw-betrekkelijke-bijzinnen': [
    ['Een betrekkelijke bijzin beschrijft een naamwoord en heeft tegelijk een eigen zinsverband.', 'Dat verwijst hier naar Noor; het bericht staat buiten de onderwerpsgroep.'],
    ['Houd de buitenste en binnenste zin apart. Dezelfde verwijzing kan in beide een andere functie hebben.', 'Die is onderwerp van schrijft omdat de brieven onderwerp van liggen zijn.'],
    ['Een bijzin kan selecteren welke personen bedoeld zijn, of extra informatie over de hele groep geven.', 'De beperkende lezing zegt dat alle leerlingen al klaar zijn en dus allemaal mogen vertrekken.'],
  ],
  'zinsbouw-beknopte-bijzinnen': [
    ['Een korte bijzin kan een gebeurtenis uitdrukken zonder eigen persoonsvorm. Bepaal wie erbij wordt begrepen.', 'Oefenen is in deze doelbijzin een persoonsvorm omdat er een activiteit wordt genoemd.'],
    ['Zoek welke persoon bij het verzwegen onderwerp van de infinitief hoort.', 'Noor probeert te slapen zegt dat een andere, niet genoemde persoon probeert te slapen.'],
    ['Controleer of een verkorte bijzin bij de bedoelde persoon aansluit. Schrijf die persoon zo nodig uit.', 'De sleutel is in de gewone lezing degene die eerst de deur heeft gesloten.'],
  ],
  'zinsbouw-verwijzen': [
    ['Gebruik onder meer enkelvoud en meervoud om te onderzoeken naar wie een voornaamwoord verwijst.', 'Zij verwijst hier naar alleen Noor, omdat Noor de dichtstbijzijnde naam is.'],
    ['Zichzelf en haar leggen in deze zinnen verschillende verwijzingen vast.', 'Mila ziet haar moet in de gewone lezing altijd betekenen dat Mila zichzelf ziet.'],
    ['Schrijf de naam opnieuw als twee personen bij hetzelfde voornaamwoord kunnen passen.', 'Door Noor te herhalen wordt de vertrekkende persoon in dit voorbeeld juist Sara.'],
  ],
  'zinsbouw-er': [
    ['Er kan terugwijzen naar een plaats of samenhangen met een hoeveelheid. Gebruik de zin om dat te onderscheiden.', 'Er geeft hier aan hoeveel personen er wonen en verwijst niet naar Delft.'],
    ['Er kan naar iets terugwijzen terwijl een voorzetsel de relatie met het werkwoord bewaart.', 'In eraan verwijst er niet naar het resultaat en hoort aan niet bij denken.'],
    ['Er kan een nieuwe deelnemer introduceren. Die deelnemer bepaalt hier of het werkwoord enkelvoud of meervoud is.', 'Er bepaalt altijd enkelvoud, dus er staan twee fietsen is ongrammaticaal.'],
  ],
  'zinsbouw-informatiestructuur': [
    ['Kijk welke vraag de zin beantwoordt. Dat helpt je bekende informatie van de nieuwe bijdrage te onderscheiden.', 'De fiets is het nieuwe antwoord op wie repareert de fiets.'],
    ['Een object vooraan kan nadruk of aansluiting geven. Zijn relatie met het werkwoord blijft daarbij gelijk.', 'Die kaart wordt onderwerp zodra je deze groep vooraan zet.'],
    ['Een passieve zin kan een andere deelnemer als uitgangspunt nemen terwijl dezelfde gebeurtenis wordt beschreven.', 'In de passieve zin is de fiets de reparateur geworden en Noor de gerepareerde zaak.'],
  ],
  'zinsbouw-interpunctie': [
    ['Breng eerst de groepen en deelzinnen in kaart. Bepaal waar iedere bijzin bij hoort voordat je komma’s kiest.', 'De dat-bijzin beschrijft Noor; die de route heeft verkend geeft de inhoud van vertelt.'],
    ['Komma’s kunnen meebepalen of je een groep selecteert of informatie over de hele groep toevoegt.', 'Zonder verdere context beweert deze beperkende zin dat iedere leerling een rode tas heeft.'],
    ['Maak een drukke zin leesbaarder en controleer daarna of dezelfde informatie en relaties behouden zijn.', 'Door de aanvullende bijzin los te schrijven wordt de brug in de revisie weer open verklaard.'],
  ],
  'betekenis-woord-zin-context': [
    ['Een woord geeft een algemene betekenis. De situatie helpt bepalen over welk concreet ding je spreekt.', 'Het woord fiets vertelt zonder context precies welke fiets en welke buitenruimte bedoeld zijn.'],
    ['De volgorde en groepering bepalen mee wie wat doet. Dezelfde woorden kunnen samen iets anders zeggen.', 'De twee zinnen beschrijven noodzakelijk dezelfde helpers en geholpene omdat hun woorden gelijk zijn.'],
    ['Dezelfde zin kan in een andere situatie een andere bedoeling hebben, zoals een vraag of een verzoek.', 'Kun je het licht aandoen kan alleen een letterlijk onderzoek naar iemands vermogen zijn.'],
  ],
  'betekenis-verwijzing': [
    ['Twee beschrijvingen kunnen dezelfde persoon aanwijzen en toch iets anders over die persoon zeggen.', 'De nieuwe rector en mijn tante kunnen nooit dezelfde persoon aanwijzen omdat de beschrijvingen verschillen.'],
    ['Een voornaamwoord kan meerdere kandidaten hebben. Alleen de dichtstbijzijnde naam kiezen is geen betrouwbare regel.', 'Haar moet hier naar Eva verwijzen; Noor is door de woordvolgorde uitgesloten.'],
    ['Een boek kan één specifiek boek zijn, maar ook zomaar een passend boek. De context beslist mee.', 'Een boek betekent dat de spreker onmogelijk een bepaald boek in gedachten kan hebben.'],
  ],
  'betekenis-relaties': [
    ['Woorden kunnen in dezelfde situatie passen en toch een andere toon of gevoelswaarde hebben.', 'Fietsenstalling en rijwielstalling hebben in iedere situatie ook precies dezelfde stijl.'],
    ['Een appel is een soort fruit. Een appelpit is een deel van een appel. Dat zijn verschillende relaties.', 'Geen fruit sluit appels niet uit, maar geen appels sluit wel ieder ander fruit uit.'],
    ['Niet het ene betekent niet altijd het uiterste andere. Tussen heet en koud past ook lauw.', 'De thee is niet heet betekent noodzakelijk dat de thee koud is.'],
  ],
  'betekenis-ambiguiteit-vaagheid': [
    ['Laat twee lezingen zien door uit te leggen welke twee situaties bij de zin passen.', 'Met het rode schrift kan alleen de leerling beschrijven, ongeacht de situatie.'],
    ['Een vaag woord heeft een onduidelijke grens. Een meetwaarde is preciezer, maar ook daarbij kan meetnauwkeurigheid tellen.', 'Zwaar heeft in iedere situatie één vaste grens van precies twaalf kilo.'],
    ['Een woord kan via verwante betekenissen naar een voorwerp of naar een organisatie verwijzen.', 'Krant kan hier alleen een papieren exemplaar aanduiden; een organisatielezing is onmogelijk.'],
  ],
  'betekenis-implicatie': [
    ['Test of de eerste zin waar kan zijn terwijl de tweede onwaar is. Eén passend tegenvoorbeeld weerlegt het gevolg.', 'Een dier beweegt bewijst omgekeerd dat er een hond rent.'],
    ['Twee beschrijvingen kunnen niet tegelijk waar zijn, terwijl ze bij een tussenstand allebei onwaar zijn.', 'Als een deur niet volledig open is, moet hij volledig dicht zijn.'],
    ['Wat je verwacht is niet altijd wat de zin verzekert. Een poging hoeft niet geslaagd te zijn.', 'Probeerde de knoop los te maken verzekert dat de knoop daarna los was.'],
  ],
  'betekenis-presuppositie': [
    ['Een zin kan iets meedelen en tegelijk andere informatie als al bekend behandelen.', 'Ook maakt het onmogelijk dat er behalve de directeur nog iemand komt.'],
    ['Onderzoek hoe een aanname zich gedraagt bij ontkenning, vragen en voorwaarden. De context kan de aanname ook lokaal leveren.', 'De als-zin bewijst onvoorwaardelijk dat de bibliotheek één directeur heeft.'],
    ['Je mag een aanname navragen of corrigeren in plaats van haar stilzwijgend over te nemen.', 'De vraag met opnieuw laat volledig open of er ooit eerder een sleutel verloren is.'],
  ],
  'betekenis-implicatuur': [
    ['Een antwoord kan meer suggereren dan het letterlijk zegt. Leg uit hoe de gespreksvraag die lezing ondersteunt.', 'Ik werk zaterdag tot laat zegt letterlijk dat later helpen onder alle omstandigheden onmogelijk is.'],
    ['Een zwakke uitspraak kan door beperkte kennis komen. Sommige betekent daarom niet automatisch niet alle.', 'Sommige lampen werken bewijst hier dat minstens één lamp kapot is.'],
    ['Onderzoek toon en situatie voordat je een extra bedoeling zoals ironie aan een zin toeschrijft.', 'Het woord nette bewijst op zichzelf dat de spreker ironisch is, ook zonder de rommelige situatie.'],
  ],
  'betekenis-compositie': [
    ['De groepering vertelt hoe je de betekenissen combineert. Een bepaling kan op een andere laag aansluiten.', 'Met de blauwe jas kan in geen enkele passende lezing de buurman identificeren.'],
    ['Een beschrijvend woord werkt niet altijd als een extra huidige eigenschap. Voormalig wijst naar een vroegere toestand.', 'Een voormalig ziekenhuis moet nu nog steeds als ziekenhuis worden gebruikt.'],
    ['Onder een wens kan een beschrijving één bepaald ding of elk geschikt ding bedoelen.', 'Eva moet door de woorden een boek al één specifiek bestaand boek gekozen hebben.'],
  ],
  'betekenis-kwantoren': [
    ['Bepaal eerst wie meetelt en welke eigenschap je voor die groep onderzoekt.', 'Iedere ingeschreven deelnemer heeft betaald doet noodzakelijk ook een uitspraak over alle niet-ingeschreven bezoekers.'],
    ['Hetzelfde aantal kan een andere verhouding geven. Drie van vier is een meerderheid; drie van twintig niet.', 'Drie werkende pompen vormt zowel bij vier als bij twintig pompen een meerderheid.'],
    ['Zinnen met iedere en een kunnen verschillende verdelingen toelaten. Maak de bedoelde verdeling expliciet.', 'Iedere vrijwilliger draagt een sleutel verzekert dat iedereen dezelfde ene sleutel draagt.'],
  ],
  'betekenis-ontkenning-bereik': [
    ['Vraag precies welk deel wordt ontkend. Niet gezegd ontkent het zeggen, niet automatisch de inhoud daarbinnen.', 'Ik heb niet gezegd dat de sleutel kwijt is bewijst dat de sleutel niet kwijt is.'],
    ['Niet iedereen betekent dat er minstens één uitzondering is. Het betekent niet vanzelf dat niemand meetelt.', 'Niet iedere deelnemer heeft betaald botst noodzakelijk met niemand heeft betaald.'],
    ['Niet hoeven laat een verplichting weg. Niet mogen geeft een verbod. Dat is een ander bereik van niet.', 'Je hoeft je camera niet mee te nemen en je mag je camera niet meenemen geven hetzelfde verbod.'],
  ],
  'betekenis-modaliteit': [
    ['Maak verschil tussen wat kan, wat mag en wat moet. Vraag ook waarop dat oordeel berust.', 'Kan open en mag open geven allebei uitsluitend toestemming volgens een regel.'],
    ['Een verplichting vertelt wat volgens een norm moet gebeuren. Zij bewijst niet dat iedereen de norm volgt.', 'Als het noodplan zegt dat de deur vrij moet blijven, kan er in werkelijkheid geen kast voor staan.'],
    ['Waar je informatie vandaan komt en hoe zeker je bent, zijn twee aparte vragen.', 'Een directe camerawaarneming geeft hier automatisch meer zekerheid dan het bericht van de boswachter.'],
  ],
  'betekenis-tijd-aspect': [
    ['Lees de werkwoordvorm samen met tijdwoorden zoals gisteren en volgende week.', 'Een tegenwoordige vorm zoals werk kan in deze zin niet over volgende week gaan.'],
    ['Kijk of een activiteit een ingebouwd doel heeft. Een genoemd doel is niet bij iedere presentatie al bereikt.', 'Twintig minuten zwemmen en naar de overkant zwemmen hebben noodzakelijk hetzelfde ingebouwde eindpunt.'],
    ['Een voltooide gebeurtenis garandeert niet dat het resultaat nu nog bestaat.', 'Omdat de kamer is schoongemaakt, kan hij daarna niet opnieuw vies zijn geworden.'],
  ],
  'betekenis-taalhandelingen': [
    ['Wat voor zin je gebruikt, wat je ermee probeert te doen en wat de ander werkelijk doet, zijn drie verschillende dingen.', 'De mededeling over de fietser bewijst dat de ontvanger op tijd is gestopt.'],
    ['Dezelfde vraag kan vermogen testen of om een handeling vragen. De situatie maakt het verschil.', 'Kun je deze kist tillen doet bij een krachtmeting en bij het opruimen noodzakelijk hetzelfde gesprekswerk.'],
    ['Voorstellen, beloven en bevestigen vragen passende omstandigheden. Alleen de woorden uitspreken is niet altijd genoeg.', 'Ik stel voor en ik bevestig doen hetzelfde omdat beide zinnen negen uur noemen.'],
  ],
  'betekenis-register': [
    ['Kies je aanspreekvorm en woordkeuze op basis van de ontvanger en de situatie.', 'De versie met u is in iedere situatie automatisch de enige passende formulering.'],
    ['Een zin kan een feit en een houding combineren. Maak duidelijk van wie die houding is.', 'Helaas moet in deze zin altijd de teleurstelling van Mira weergeven; de spreker is uitgesloten.'],
    ['Een klein woord zoals toch kan een verwachting laten meeklinken zonder die als feit te bewijzen.', 'De vraag met toch bewijst dat het formulier al is ingevuld.'],
  ],
  'volle-zin-combineren': [
    ['Noteer eerst de feiten en hun bekende verband. Een woord als omdat voegt een reden toe.', 'Dat het raam vastzat bewijst zonder verdere informatie waarom Noor het controleerde.'],
    ['Een bijzin kan bepalen over welke dingen je spreekt. Controleer of die selectie bij je bedoeling past.', 'Die gisteren aankwamen beweert hier dat alle denkbare brieven gisteren zijn aangekomen.'],
    ['Controleer apart de grammatica, de bedoelde inhoud en hoe gemakkelijk de lezer de zin kan volgen.', 'Omdat en voordat voegen nooit informatie toe; je mag ze zonder controle tussen feiten zetten.'],
  ],
  'volle-zin-leesbaarheid': [
    ['Zoek wat de lezer lang moet onthouden voordat de kern of de hoofdhandeling verschijnt.', 'In deze zin staat de kern lijst voor alle beschrijvende informatie en hoeft de lezer nergens op te wachten.'],
    ['Controleer na een verplaatsing opnieuw waar iedere beschrijving bij hoort.', 'Die gisteren binnenkwam kan na deze verplaatsing uitsluitend naar de lijst wijzen.'],
    ['Een handeling als naamwoord of een passieve zin kan nuttig zijn. Beoordeel wat de lezer op dat moment moet volgen.', 'Controle is hier een persoonsvorm, dus de zin kan geen handeling als naamwoord gebruiken.'],
  ],
  'volle-zin-herzien': [
    ['Zoek per laag het onderwerp en de persoonsvorm voordat je losse werkwoordvormen corrigeert.', 'Brieven moet de hoofdzin meervoudig maken: de verzameling brieven liggen op tafel.'],
    ['Probeer of je zin nog een andere lezing toelaat dan de bedoeling die je in gedachten had.', 'Niet alle studenten leverden in verzekert dat geen enkele student inleverde.'],
    ['Een revisie kan ongemerkt informatie toevoegen. Vergelijk de nieuwe versie met de gegeven feiten.', 'Daarna voegt geen tijdsvolgorde toe en kan dus altijd tussen twee zinnen staan.'],
  ],
  'volle-zin-meesterproef': [
    ['Leg vooraf vast welke feiten, verbanden en onzekerheden je tekst moet bewaren.', 'Omdat verzint in deze opdracht een reden, ook al is de afwezigheid uitdrukkelijk als reden gegeven.'],
    ['Bouw je zin en laat per deelzin zien welke groepen en werkwoorden bij elkaar horen.', 'Zijn, is en stond hebben in dit voorbeeld allemaal twee leden als onderwerp.'],
    ['Vergelijk versies vanuit de lezer en controleer of je dezelfde personen, dingen en relaties blijft aanwijzen.', 'Van vanmiddag bewaart in iedere mogelijke opdracht automatisch exact dezelfde identificatie als de eerdere bijzin.'],
  ],
  'alinea-kernzin': [
    ['Een kernzin zegt iets concreets over je onderwerp. De andere zinnen werken die mededeling uit.', 'De tweede zin begint een ongerelateerd onderwerp omdat hij twee ophaallocaties noemt.'],
    ['De hoofdgedachte kan vooraan of achteraan staan. Kies de plaats die de lezer helpt bij deze uitleg.', 'De slotzin bewijst dat de balie op alle dagen tot acht uur open is.'],
    ['Kijk of iedere zin dezelfde hoofdgedachte helpt uitleggen. Splits informatie die een andere vraag beantwoordt.', 'De zin over kinderactiviteiten legt uit hoe je boeken scant en moet daarom in dezelfde uitleg blijven.'],
  ],
  'alinea-verwijzing': [
    ['Vul mogelijke verwijzingen in. Herhaal de naam als anders onduidelijk blijft wie of wat bedoeld is.', 'Door de fiets te herhalen ontstaat noodzakelijk een tweede fiets.'],
    ['Een verwijzing kan een ding of een hele gebeurtenis oppakken. Benoem die gebeurtenis als dat duidelijker is.', 'Dat uitstel verwijst hier alleen naar de vrachtwagen en niet naar het uitstellen van de levering.'],
    ['Ook plaatswoorden zoals daar en daarin moeten voor de lezer naar een duidelijke plek wijzen.', 'Daarin betekent hier op de fiches; de lade speelt geen rol in de verwijzing.'],
  ],
  'alinea-woordketens': [
    ['Laat de lezer herkennen dat je hetzelfde ding opnieuw noemt, ook wanneer je een andere passende naam kiest.', 'De vogel introduceert hier noodzakelijk een tweede dier naast de merel.'],
    ['Een vaste naam kan duidelijker zijn dan telkens een ander woord, vooral bij knoppen en instructies.', 'Reservering herhalen maakt het noodzakelijk een andere handeling dan de reservering openen.'],
    ['Laat informatie alleen weg of vervang haar door dat als de lezer de bedoelde inhoud kan terugvinden.', 'Doet dat laat hier volledig open wat Amir doet; de vorige zin biedt geen aanknopingspunt.'],
  ],
  'alinea-relaties': [
    ['Zeg eerst welk verband tussen twee zinnen bestaat. Kies daarna pas een passend signaalwoord.', 'Zo geeft in dit voorbeeld aan dat de fietspompen later worden verkocht dan het reparatiemateriaal.'],
    ['Een volgorde, voorwaarde en oorzaak zijn verschillende verbanden. Houd dat verschil zichtbaar.', 'Mits je vooraf reserveert beweert dat je de zaal al hebt gereserveerd.'],
    ['Een verband kan al duidelijk zijn door de inhoud. Voeg alleen een signaalwoord toe als het helpt.', 'Zonder daarna kan de lezer hier onmogelijk weten dat tien uur na negen uur komt.'],
  ],
  'alinea-thema-rhema': [
    ['Kijk met welke informatie de zin begint en wat hij daaraan toevoegt. Dat begin hoeft geen onderwerp te zijn.', 'Die vijver is automatisch het grammaticale onderwerp omdat de zin ermee begint.'],
    ['Je kunt bij hetzelfde vertrekpunt blijven of nieuwe informatie als vertrekpunt van de volgende zin gebruiken.', 'Deze alinea houdt in iedere zin exact hetzelfde vertrekpunt, zonder een informatieketen te maken.'],
    ['Verschillende onderdelen kunnen samen één groter onderwerp uitwerken.', 'Dak en keuken kunnen nooit bij dezelfde hoofdgedachte horen omdat het verschillende onderdelen zijn.'],
  ],
  'alinea-patronen': [
    ['Bouw uitleg van een algemene mededeling naar een concreet voorbeeld dat daar echt bij past.', 'De cabines zijn een ongerelateerd nieuw onderwerp en geen concreet onderdeel van de werkplekken.'],
    ['Laat zien wat het probleem is, wat je probeert en hoe je het resultaat nog gaat controleren.', 'De proef met watervaste labels bewijst al vóór de controle dat het probleem is opgelost.'],
    ['Vergelijk opties op dezelfde kenmerken en vul ontbrekende informatie niet zelf in.', 'De tekst vergelijkt alleen de prijs van zaal A en zaal B en zegt niets over zitplaatsen.'],
  ],
  'alinea-impliciet': [
    ['Een lezer kan soms zelf een helder verband leggen. Hoeveel uitleg nodig is hangt van diens voorkennis af.', 'Zonder extra signaalwoord is niet te begrijpen dat hoofd- en zijingang de twee genoemde ingangen zijn.'],
    ['Een ontbrekend feit los je niet op met alleen dus. Benoem eerst de informatie die de lezer mist.', 'Het tijdstip zonder baliebezetting heeft in het voorbeeld geen verband met het ophalen van een sleutel.'],
    ['Maak je tekst duidelijker zonder een vermoedelijke oorzaak als vaststaand feit te presenteren.', 'Kort daarna bewijst hier dat Noor vertrok doordat de lamp uitviel.'],
  ],
  'alinea-ritme': [
    ['Zoek waarom een zin lastig is: de lezer kan bijvoorbeeld lang op de hoofdhandeling moeten wachten.', 'Controleert staat in dit voorbeeld vóór de informatie over de balie en de sleutels.'],
    ['Splits een zin zo dat voorwaarden en andere verbanden herkenbaar blijven.', 'Je mag de kast gebruiken. Je hebt een sleutel bewaart precies dezelfde voorwaarde zonder nieuwe feiten.'],
    ['Gebruik langere zinnen om informatie te verbinden en korte zinnen om gericht nadruk te leggen.', 'Wacht op die bevestiging voegt vooral een nieuw los proces toe en geeft geen nadruk aan de instructie.'],
  ],
  'alinea-overgang': [
    ['Pak iets uit de vorige alinea op en laat tegelijk zien wat de volgende alinea toevoegt.', 'Deze ruimtes introduceert drie andere ruimtes en sluit niet aan bij de vorige alinea.'],
    ['Kies een overgang die het echte inhoudelijke verband benoemt, zonder er een oorzaak bij te verzinnen.', 'Wel maakt gratis en vooraf reserveren tot twee feiten die onmogelijk samen waar kunnen zijn.'],
    ['Laat het slot en de nieuwe opening samenwerken. Kondig dezelfde stap niet onnodig twee keer aan.', 'Daarvoor verwijst hier naar het kiezen van een werkplek en sluit het regelen van toegang uit.'],
  ],
  'alinea-revisie': [
    ['Maak een lijst van de feiten en van wat je nog niet weet voordat je de alinea herschrijft.', 'De gegeven feiten bewijzen dat het onderhoud de oorzaak van de sluiting is.'],
    ['Introduceer informatie voordat je ernaar terugwijst. Zo kan de lezer de route blijven volgen.', 'Daar verwijst in deze versie naar de gesloten leeszaal, niet naar de studieruimte.'],
    ['Controleer na de revisie of dezelfde feiten blijven staan en of de verwijzingen nu helder zijn.', 'De nieuwe versie vertelt dat zowel de balie als de zaal dinsdag weer opengaat.'],
  ],
};

function choiceOffset(lessonId: string, sectionIndex: number): number {
  return ([...lessonId].reduce((sum, letter) => sum + letter.charCodeAt(0), 0) + sectionIndex) % 2;
}

/** A guided check of the explanation just explored, never a copy of later practice. */
export function getSectionCoach(lesson: OntleedLesson, sectionIndex: number): SectionCoach {
  const section = lesson.sections[sectionIndex];
  if (!section) throw new RangeError(`Unknown section ${sectionIndex} for ${lesson.id}`);
  const support = SUPPORT[lesson.id]?.[sectionIndex];
  const example = section.examples[0];
  if (!example || !support) throw new Error(`Missing section support for ${lesson.id}:${sectionIndex}`);
  const [summary, misconception] = support;
  const answer = choiceOffset(lesson.id, sectionIndex);
  const options = answer === 0 ? [example.analysis, misconception] : [misconception, example.analysis];
  const feedback = options.map((_, index) => index === answer
    ? `Precies. ${example.analysis}`
    : `Nog niet. ${example.analysis}`);
  const coach: SectionCoach = {
    summary,
    steps: [
      'Lees het voorbeeld rustig door.',
      section.examples.length > 1 ? 'Klik op de voorbeelden en vergelijk de uitleg.' : 'Bekijk hoe de uitleg bij de woorden in de zin past.',
      'Kies bij de snelle check welke uitleg klopt.',
    ],
    focusPrompt: section.examples.length > 1
      ? 'Klik op een voorbeeld. Bekijk daarna het andere: wat blijft gelijk en wat verandert?'
      : 'Lees het voorbeeld en bekijk de uitleg eronder.',
    check: {
      id: `coach:${lesson.id}:${sectionIndex}`,
      kind: 'choice',
      concept: section.title,
      prompt: 'Welke uitleg klopt bij dit voorbeeld?',
      sentence: example.sentence,
      options,
      answer,
      feedback,
      hint: summary,
      explanation: example.analysis,
    },
  };

  if (lesson.id === 'basis-vorm-functie' && sectionIndex === 0) {
    coach.focusPrompt = 'Klik op Vorm, Functie en Betekenis. Je bekijkt steeds dezelfde woorden: de lange brief.';
    coach.lenses = [
      { label: 'Vorm', highlight: 'de lange brief', explanation: 'Hoe is de groep gebouwd? De en lange horen bij het naamwoord brief. Samen vormen ze een naamwoordgroep.' },
      { label: 'Functie', highlight: 'de lange brief', explanation: 'Wat is de taak van de groep in deze zin? De lange brief is wat Noor schrijft: het lijdend voorwerp.' },
      { label: 'Betekenis', highlight: 'de lange brief', explanation: 'Welke rol speelt de brief in de gebeurtenis? De brief is de geschreven zaak. Noor is de schrijver.' },
    ];
    coach.steps = ['Lees: Noor schrijft de lange brief.', 'Klik op de drie knoppen en bekijk dezelfde woorden vanuit iedere vraag.', 'Controleer of je vorm, functie en betekenis uit elkaar houdt.'];
    coach.check = {
      id: `coach:${lesson.id}:${sectionIndex}`,
      kind: 'choice',
      concept: section.title,
      sentence: example.sentence,
      prompt: 'Welke beschrijving geeft de functie van “de lange brief” in deze zin?',
      options: ['Naamwoordgroep: de woorden zijn rond brief gebouwd.', 'Lijdend voorwerp: de groep noemt wat Noor schrijft.', 'Geschreven zaak: de brief krijgt deze rol in de gebeurtenis.'],
      answer: 1,
      feedback: [
        'Dat beschrijft de vorm: hoe de woorden samen zijn gebouwd. De functie hier is lijdend voorwerp: wat Noor schrijft.',
        'Precies. Lijdend voorwerp is de functie in de zin. Naamwoordgroep beschrijft de vorm; geschreven zaak beschrijft de betekenisrol.',
        'Dat beschrijft de betekenisrol. De functie hier is lijdend voorwerp: wat Noor schrijft.',
      ],
      hint: 'Vorm vraagt hoe de groep is gebouwd. Functie vraagt welke taak de groep in deze zin heeft.',
      explanation: example.analysis,
    };
  }
  return coach;
}
