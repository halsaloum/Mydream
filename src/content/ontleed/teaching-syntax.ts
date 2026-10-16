import type { BookId, SectionTeaching } from './types';

type Step = [title: string, text: string];
const teach = (core: string, steps: [Step, Step, Step], memory: string, section: string, terms: [string, string][] = []): SectionTeaching => ({
  core,
  steps: steps.map(([title, text]) => ({ title, text })),
  terms: terms.map(([term, meaning]) => ({ term, meaning })),
  memory,
  sources: [{ bookId: 'natural-syntax', section, note: 'Opnieuw gecontroleerd in de aangeleverde PDF; de Nederlandse uitleg en voorbeelden zijn eigen formuleringen.' }],
});
const sourced = (bookId: BookId, core: string, steps: [Step, Step, Step], memory: string, section: string, terms: [string, string][] = []): SectionTeaching => ({
  ...teach(core, steps, memory, section, terms),
  sources: [{ bookId, section, note: bookId === 'ans' ? 'Nederlandse constructie opnieuw gecontroleerd in de ANS.' : 'Opnieuw gelezen in de aangeleverde bron; Nederlandse voorbeelden zijn eigen toepassingen.' }],
});

/** Each explanation starts with a concrete comparison, before introducing its terminology. */
export const SYNTAX_TEACHING: Record<string, SectionTeaching[]> = {
  'zinsdelen-persoonsvorm': [
    teach('De persoonsvorm is het werkwoord dat meeverandert als je de tijd of het onderwerp verandert.', [
      ['Verander de tijd', 'Ik werk wordt ik werkte. Werk is dus de vorm die hier het verschil tussen nu en vroeger laat zien.'],
      ['Verander het aantal', 'De leerling leest wordt de leerlingen lezen. De vorm van het werkwoord past zich aan het onderwerp aan.'],
      ['Vergelijk hetzelfde stukje zin', 'Laat andere veranderingen zoveel mogelijk achterwege. Zo weet je dat je echt de werkwoordsvorm test.'],
    ], 'Zoek een vormverandering, niet alleen een woord dat een handeling noemt.', 'H2 §2.9; PDF108–111', [['finiet', 'Een werkwoordsvorm die in deze deelzin als persoonsvorm werkt.']]),
    teach('In heeft geoefend is heeft de persoonsvorm. Geoefend vertelt wat er is gebeurd, maar verandert niet mee met het onderwerp.', [
      ['Haal de werkwoorden uit elkaar', 'Noor heeft geoefend bevat heeft en geoefend. Ze werken samen, maar hebben verschillende taken.'],
      ['Maak het onderwerp meervoudig', 'De kinderen hebben geoefend laat alleen heeft veranderen in hebben. Geoefend blijft hetzelfde.'],
      ['Bekijk de omgeving', 'Wij fietsen heeft fietsen als persoonsvorm. In wij willen fietsen draagt willen die taak en is fietsen een infinitief.'],
    ], 'Dezelfde spelling kan in een andere zin een andere werkwoordstaak hebben.', 'H2 §§2.5,2.9; PDF79–88,108–111', [['infinitief', 'De hele werkwoordsvorm, bijvoorbeeld oefenen of fietsen.'], ['voltooid deelwoord', 'Een vorm zoals geoefend, gebruikt in heeft geoefend.']]),
    teach('Zoek per deelzin. Een werkwoord in een kleinere bijzin hoeft niet de persoonsvorm van de hoofdzin te zijn.', [
      ['Herken het kleine zinnetje', 'In de leerling die oefent heeft tijd staat die oefent als kleiner zinnetje bij leerling. Oefent hoort bij dat stukje.'],
      ['Onderzoek de grotere mededeling', 'Heeft de leerling die oefent tijd? begint met heeft. Dat is de persoonsvorm van de hoofdzin.'],
      ['Houd ook infinitieven apart', 'Om rustig te oefenen heeft wel een werkwoord, maar geen persoonsvorm. Een deelzin hoeft dus niet finiet te zijn.'],
    ], 'Eerst de deelzingrens, dan de persoonsvorm binnen die grens.', 'H1 §1.2.3; H2 §2.9; PDF28–30,108–111', [['deelzin', 'Een zinnetje dat zelfstandig staat of onderdeel van een grotere zin is.']]),
  ],
  'zinsdelen-proeven': [
    teach('Woorden die samen één bouwstuk vormen, kun je vaak samen verplaatsen. Houd de hele groep bij elkaar.', [
      ['Kies een heel blok', 'Neem na de laatste training als kandidaat. Die woorden noemen samen één tijdstip.'],
      ['Zet dat blok vooraan', 'Na de laatste training fietst Noor naar huis blijft een gewone zin. Dat ondersteunt de gekozen groepsgrens.'],
      ['Controleer de achterblijvende woorden', 'Alleen training verplaatsen laat na de laatste achter. Die kapotte rest helpt verklaren waarom de grens verkeerd gekozen is.'],
    ], 'Een lang bouwstuk kan toch maar één plaats in de zin innemen.', 'H3 §§3.1.2,3.2.2; PDF115,120–127', [['constituent', 'Een woord of woordgroep die op dit niveau samen een bouwstuk vormt.']]),
    teach('Vervang een hele groep door een kort alternatief, of stel een vraag waarop die groep het volledige antwoord is.', [
      ['Zoek een passend kort woord', 'De leerling met de blauwe jas wordt zij. Ook de jasbeschrijving verdwijnt, omdat die binnen de vervangen groep zit.'],
      ['Stel de vraag op hetzelfde niveau', 'Wie wacht buiten? vraagt naar de hele leerlinggroep. Met welke jas? onderzoekt een kleiner onderdeel.'],
      ['Vergelijk de grenzen', 'Vervanging en vraag moeten hetzelfde bouwstuk aanwijzen. Dan versterken twee verschillende proeven elkaar.'],
    ], 'Een goede proef bewaart de bedoelde relatie en het gekozen niveau.', 'H3 §§3.1.1,3.1.3; PDF113–116'),
    teach('Een mislukte verplaatsing is een reden om verder te kijken. De proef zelf kan ook een beperking hebben.', [
      ['Controleer de proefzin', 'Een ongewoon begin kan een duidelijke contrastcontext nodig hebben. Zonder die context klinkt een echte groep soms vreemd.'],
      ['Probeer ander bewijs', 'Kijk ook naar vervanging of een passend kort antwoord. Een tweede soort proef kan een groepsgrens wel ondersteunen.'],
      ['Leg de bedoelde scène vast', 'De fietser met de verrekijker kan één groep zijn als de fietser het instrument bij zich heeft. Bij Noor als gebruiker ligt de instrumentgroep juist buiten het object.'],
    ], 'Combineer proeven; verwar een ongeschikte proef niet met een onmogelijke groep.', 'H3 §3.2; H6 §6.1.4; PDF118–128,238–239'),
  ],
  'zinsdelen-kern': [
    teach('De kern is het woord waar de woordgroep omheen is gebouwd. Het staat niet altijd aan het begin.', [
      ['Zoek wat wordt uitgebreid', 'In de nieuwe route langs de rivier gaat de hele groep over een route. Nieuwe en langs de rivier geven daar informatie bij.'],
      ['Vergelijk verschillende groepen', 'Naast het station is opgebouwd rond naast. Erg trots op haar team is opgebouwd rond trots.'],
      ['Houd de niveaus apart', 'Rivier heeft een eigen kleinere groep binnen de routegroep. Dat maakt rivier nog niet de kern van de hele groep.'],
    ], 'Vraag steeds: de kern van welk bouwstuk?', 'H5 §5.1; H6 §§6.1–6.3; PDF192–197,223–244', [['kern', 'Het woord dat de bouw en mogelijkheden van de groep organiseert.']]),
    teach('Sommige woorden vullen een relatie in die bij de kern hoort. Andere woorden voegen een extra beschrijving toe.', [
      ['Bekijk wat de kern vraagt', 'Naast legt een relatie met een referentiepunt, zoals het station. Trots kan zeggen waarop iemand trots is.'],
      ['Zoek de extra precisering', 'Vlak in vlak naast het station maakt de afstand preciezer. Het station is het referentiepunt en heeft dus een andere taak.'],
      ['Gebruik weglaten voorzichtig', 'Noor is trots kan ook zonder op haar team. Toch hoort de op-relatie bij deze betekenis van trots.'],
    ], 'Weglaatbaar betekent niet automatisch: zomaar een losse toevoeging.', 'H5 §5.4; H6 §6.2; PDF210–214,241–242', [['selectie', 'De eisen die een kern stelt aan een passende aanvulling.']]),
    teach('De bouw van een groep en haar taak in de zin zijn twee verschillende dingen.', [
      ['Benoem eerst de bouw', 'De nieuwe route is een naamwoordgroep rond route. Dat label beschrijft hoe de groep in elkaar zit.'],
      ['Zoek daarna de taak', 'De nieuwe route is veilig heeft die groep als onderwerp. Noor kiest de nieuwe route gebruikt dezelfde groep als lijdend voorwerp.'],
      ['Doe dit ook bij beschrijvingen', 'Langs de rivier kan route beschrijven. De groep blijft van vorm een voorzetselgroep.'],
    ], 'Vorm zegt hoe het is gebouwd; functie zegt wat het hier doet.', 'H2 §2.3.3; H4 §4.4; PDF75–76,162–165', [['klasse', 'Het type woord of woordgroep.'], ['functie', 'De taak van dat bouwstuk in een groter geheel.']]),
  ],
  'zinsdelen-naamwoordgroep': [
    teach('Een naamwoordgroep noemt een persoon, ding of begrip als één bouwstuk. Een lidwoord is daarbij niet altijd nodig.', [
      ['Begin bij de genoemde deelnemer', 'Een leerling kan een nieuwe deelnemer introduceren. De leerling kan daarna naar die herkenbare leerling verwijzen.'],
      ['Bekijk de bepalende woorden', 'Mijn in mijn fiets legt een relatie met de spreker. Die informatie bepaalt nog niet of de groep onderwerp of voorwerp is.'],
      ['Controleer korte vormen', 'Noor, water en zij kunnen ook een nominale plaats vullen. Definieer de groep daarom niet als altijd een lidwoord met een naamwoord.'],
    ], 'Nominale bouwstukken zijn ruimer dan lidwoord plus zelfstandig naamwoord.', 'H2 §§2.3.1,2.4; H6 §6.1; PDF67–72,78,223–233', [['bepaler', 'Een woord zoals de, een of mijn dat helpt aangeven wat je bedoelt.']]),
    teach('Een naamwoordgroep kan kleinere groepen en zelfs een bijzin bevatten. Op het grotere niveau blijft het één bouwstuk.', [
      ['Bepaal de buitenste grens', 'De fiets die Noor gebruikt kan in zijn geheel worden vervangen. De bijzin hoort dus binnen de volledige fietsomschrijving.'],
      ['Zoek daarna de kleine groepen', 'In de fiets van de broer van Amir vertelt van Amir iets over broer. De grotere van-groep verbindt die broer met fiets.'],
      ['Laat de lagen zien', 'Schrijf de fiets [van de broer [van Amir]]. De haakjes tonen welk stukje bij welk naamwoord hoort.'],
    ], 'Een uitbreiding binnen het onderwerp is geen extra onderwerp van de hoofdzin.', 'H6 §6.1; H14 §14.1; PDF223–240,519–523'),
    teach('Bij de stapel boeken ligt klaar bepaalt stapel het enkelvoud. Boeken zit binnen de groep en trekt de persoonsvorm niet naar het meervoud.', [
      ['Maak het onderwerp korter', 'De stapel boeken wordt de stapel. De buitenste kern blijft hetzelfde.'],
      ['Verander juist die kern', 'De stapels boeken liggen klaar heeft een meervoudige buitenste kern. Nu verandert de persoonsvorm mee.'],
      ['Vergelijk een andere opbouw', 'De boeken op de stapel liggen klaar heeft boeken als buitenste kern. Hetzelfde materiaal kan dus een andere controller opleveren.'],
    ], 'Overeenkomst volgt de opbouw van de groep, niet het dichtstbijzijnde naamwoord.', 'H4 §4.4.4; H6 §6.1; PDF164–165,223–240', [['overeenkomst', 'Vormen die bij elkaar passen, zoals de stapel ligt en de stapels liggen.']]),
  ],
  'zinsdelen-voorzetselgroep': [
    teach('Achter het museum bevat een relatie én een referentiepunt. Samen vormen ze de hele voorzetselgroep.', [
      ['Zoek het relatiewoord', 'Achter vertelt welke plaatsrelatie je bedoelt. Tijdens kan op dezelfde manier een tijdrelatie leggen.'],
      ['Neem de volledige aanvulling mee', 'Het nieuwe museum is het referentiepunt van achter. Museum alleen laat informatie weg uit die lagere groep.'],
      ['Let op een uitbreiding', 'Vlak achter het nieuwe museum bevat ook vlak. Die precisering hoort binnen de volledige plaatsgroep.'],
    ], 'De voorzetselkern is kleiner dan de volledige voorzetselgroep.', 'H6 §6.3; PDF242–246', [['aanvulling', 'Het bouwstuk waarmee de kern hier zijn relatie vormt.']]),
    teach('Bij het station kan vertellen welke fiets je bedoelt, maar ook waar iemand wacht. De vorm is gelijk; de aanhechting verschilt.', [
      ['Lees de nominale beschrijving', 'De fiets bij het station is rood gebruikt de plaats om de fiets te identificeren. De plaatsgroep zit binnen de fietsomschrijving.'],
      ['Lees de gebeurtenislocatie', 'Noor wacht bij het station vertelt waar het wachten plaatsvindt. De groep hoort nu bij de gebeurtenis.'],
      ['Test wat samen verdwijnt', 'Hij is rood vervangt ook de fietsomschrijving. Zij wacht bij het station houdt de plaats buiten het vervangen onderwerp.'],
    ], 'Vraag wat de groep beschrijft voordat je haar functie benoemt.', 'H6 §6.1.4; PDF238–239', [['aanhechting', 'Het grotere bouwstuk waarbij een groep aansluit.']]),
    teach('Op een antwoord bij wachten noemt waarop wordt gewacht. In het park noemt waar het wachten gebeurt.', [
      ['Volg de relatie van de kern', 'Wachten op vormt hier een herkenbare combinatie. Het voorzetsel maakt deel uit van de verwachte relatie.'],
      ['Vergelijk de plaats erbij', 'In het park kan bij allerlei gebeurtenissen staan. De groep vult geen antwoord op de vraag waarop wordt gewacht.'],
      ['Stel verschillende vragen', 'Op wie? bewaart de geselecteerde relatie. Waar? onderzoekt de omgeving van de gebeurtenis.'],
    ], 'Een voorzetselgroep is niet automatisch een vrije plaatsbepaling.', 'H4 §§4.1–4.2; H5 §5.4; PDF151–158,210–214', [['geselecteerd', 'Verbonden met de mogelijkheden van deze kern in deze betekenis.']]),
  ],
  'zinsdelen-valentie': [
    teach('Een werkwoord organiseert plaatsen voor deelnemers. Bij slapen hoort een slaper; bij geven horen ook iets dat wordt gegeven en een ontvanger.', [
      ['Kies één werkwoordgebruik', 'Noor geeft Amir een kaart beschrijft een overdracht. Geven verbindt hier drie deelnemersrollen.'],
      ['Tel hele groepen', 'De leerlingen uit de eerste klas slapen heeft één volledige slapersgroep. Klas is een onderdeel van die groep, geen extra slaper.'],
      ['Noteer de relaties', 'Schrijf bij geven: gever, ontvanger en gegeven ding. Daarna kun je onderzoeken hoe de zin die rollen grammaticaal uitdrukt.'],
    ], 'Tel geselecteerde bouwstukken, niet het aantal naamwoorden.', 'H4 §4.1; PDF151–156', [['valentie', 'Het patroon van deelnemers en relaties bij een concreet werkwoordgebruik.'], ['argument', 'Een geselecteerd bouwstuk bij een predicaat.']]),
    teach('Kun je iets weglaten? is nuttig, maar niet genoeg. Een deelnemer kan ook uit de context begrepen worden.', [
      ['Vergelijk twee plaatsrelaties', 'Slapen in de trein geeft een vrij gekozen omgeving. De tas in de trein leggen vult de bestemming bij het plaatsingswerkwoord.'],
      ['Bekijk een onuitgesproken deelnemer', 'Noor eet noemt het voedsel niet. Je begrijpt wel dat er iets wordt gegeten.'],
      ['Combineer aanwijzingen', 'Kijk naar betekenis, vaste voorzetsels en andere zinnen met de kern. Alleen een korte vorm laat het volledige argumentpatroon niet zien.'],
    ], 'Niet uitgesproken is iets anders dan niet geselecteerd.', 'H4 §§4.1.3,4.2; H5 §5.4; PDF154–158,210–214', [['impliciet', 'Niet uitgesproken, maar wel uit de situatie begrepen.']]),
    teach('De vaas brak en Noor brak de vaas gebruiken hetzelfde werkwoord in een ander patroon. De vaas blijft wat kapotgaat.', [
      ['Vergelijk de deelnemers', 'De eerste zin noemt alleen de veranderende vaas. De tweede noemt ook Noor als veroorzaker.'],
      ['Vergelijk de functies', 'Vaas is eerst onderwerp en daarna lijdend voorwerp. De betekenisrol blijft bij deze vergelijking wel herkenbaar.'],
      ['Onderscheid de passieve vorm', 'De vaas werd gebroken gebruikt een passief werkwoordelijk verband. Een onderwerp dat iets ondergaat maakt een zin op zichzelf nog niet passief.'],
    ], 'Een verandering van patroon kan functies wijzigen zonder de deelnemer te veranderen.', 'H4 §§4.1.3,4.3–4.4; PDF154–165', [['betekenisrol', 'De rol in de beschreven situatie, zoals veroorzaker of getroffen ding.']]),
  ],
  'zinsdelen-onderwerp': [
    teach('Het onderwerp is de hele groep waarmee de persoonsvorm samenhangt. De leerling schrijft en de leerlingen schrijven laten die relatie zien.', [
      ['Vind eerst de persoonsvorm', 'Schrijft wordt schreef bij een andere tijd. Daarmee heb je het werkwoord gevonden waarvan je de controller zoekt.'],
      ['Verander de kandidaatgroep', 'Maak de leerling meervoudig. Schrijven verandert mee, terwijl de rest van de zin hetzelfde kan blijven.'],
      ['Neem de hele omschrijving', 'In de leerling met drie schriftjes schrijft hoort met drie schriftjes binnen het onderwerp. Schriftjes is geen tweede onderwerp van schrijft.'],
    ], 'De kern draagt het getal; de volledige groep vervult de onderwerpfunctie.', 'H4 §4.4; PDF162–165', [['controller', 'Het bouwstuk waarvan de eigenschappen de vorm van een ander woord sturen.']]),
    teach('Het onderwerp hoeft niets bewust te doen. Het kan iets ervaren, een eigenschap hebben of iets ondergaan.', [
      ['Vergelijk een actieve en een passieve zin', 'Noor opent de deur heeft Noor als onderwerp. De deur wordt geopend maakt de deur tot onderwerp.'],
      ['Bewaar de betekenisrollen', 'De deur blijft wat geopend wordt. Noor blijft bij beide voorstellingen de opener als de actor genoemd is.'],
      ['Controleer ook een toestand', 'Het plan is haalbaar wordt de plannen zijn haalbaar. Er is geen bewuste doener nodig om een onderwerp te vinden.'],
    ], 'Wie handelt? vraagt naar betekenis; onderwerp vraagt naar grammaticale functie.', 'H4 §§4.3–4.4; H10 §§10.2,10.5–10.6; PDF159–165,394–396,404–408', [['ervaarder', 'De deelnemer die iets hoort, voelt, denkt of anderszins ervaart.']]),
    teach('Een onderwerp kan achter de persoonsvorm staan. In een bevel kan de aangesprokene onuitgesproken blijven.', [
      ['Volg dezelfde deelnemer', 'Noor vertrekt wordt morgen vertrekt Noor. De plaats verandert, maar Noor blijft het onderwerp.'],
      ['Controleer een vraag', 'Vertrekt Noor morgen? plaatst de persoonsvorm voorop. Dat maakt Noor nog steeds niet tot voorwerp.'],
      ['Herken een bevel', 'Lees de uitleg spreekt de lezer aan. De uitleg is wat gelezen wordt, ook al is het de eerste uitgesproken naamwoordgroep.'],
    ], 'Zoek de relatie binnen het zinstype; vertrouw niet op het eerste woord.', 'H1 §1.2.3; H4 §4.5.4; PDF28–30,171', [['bevel', 'Een zin die de aangesprokene iets laat doen, bijvoorbeeld lees verder.']]),
  ],
  'zinsdelen-gezegde': [
    teach('Het werkwoordelijke gezegde bevat de werkwoordelijke onderdelen die samenwerken. Ze kunnen door andere woorden van elkaar gescheiden zijn.', [
      ['Bekijk het verband', 'Heeft gelezen drukt samen een voltooide leesgebeurtenis uit. Alleen heeft noemt die gebeurtenis nog niet.'],
      ['Sla de tussenstukken over', 'In heeft de uitleg rustig gelezen zijn de uitleg en rustig andere bouwstukken. Hun plaats tussen de werkwoorden maakt ze geen gezegdeonderdeel.'],
      ['Herken een scheidbaar werkwoord', 'Ruimt de spullen op hoort bij opruimen. Het losse op blijft hier onderdeel van die werkwoordelijke uitdrukking.'],
    ], 'Samenwerken betekent niet noodzakelijk naast elkaar staan.', 'H2 §§2.5,2.9; H1 §1.5; PDF40–43,79–88,108–111', [['hulpwerkwoord', 'Een werkwoord dat bijvoorbeeld tijd, voltooiing of een passieve constructie helpt uitdrukken.']]),
    teach('Een naamwoordelijk gezegde zegt wat het onderwerp is of wordt, of welke eigenschap het heeft.', [
      ['Zoek de toegekende eigenschap', 'Noor is tevreden kent tevredenheid toe aan Noor. Tevreden is geen ding dat Noor koopt of maakt.'],
      ['Neem koppeling én eigenschap', 'Is bijzonder helder bevat de koppeling is en de volledige eigenschap bijzonder helder. Samen vormen ze het naamwoordelijke gezegde.'],
      ['Laat ook een naamwoord toe', 'Noor wordt voorzitter noemt een nieuwe identiteit. Het naamwoordelijke deel kan dus een adjectief of een naamwoordgroep zijn.'],
    ], 'Naamwoordelijk deel benoemt een functie, geen verplichte woordsoort.', 'H2 §2.3.2; H4 §4.1; H6 §6.2; PDF72–74,151–153,241–242', [['koppelwerkwoord', 'De verbinding tussen het onderwerp en zijn eigenschap of identiteit.']]),
    teach('Is en wordt kunnen verschillende taken hebben. Kijk waarmee ze samenwerken in de volledige constructie.', [
      ['Vergelijk twee worden-zinnen', 'Mila wordt arts kent een identiteit toe. Mila wordt gebeld beschrijft een passieve belgebeurtenis.'],
      ['Vergelijk twee zijn-zinnen', 'Noor is tevreden heeft een eigenschap als kern. Noor is vertrokken gebruikt een voltooid werkwoordelijk verband.'],
      ['Beslis vanuit de lezing', 'Sommige deelwoorden kunnen ook een toestand beschrijven. Bekijk dan de context en de eventuele gebeurtenis die de zin bedoelt.'],
    ], 'Een werkwoord op een lijst herkennen is het begin van de analyse.', 'H2 §§2.3.2,2.5.2; H4 §4.1; PDF72–74,83–86,151–153'),
  ],
  'zinsdelen-voorwerpen': [
    teach('Het lijdend voorwerp vult de objectrelatie van het werkwoord. Het blijft dat doen wanneer je het vooraan plaatst.', [
      ['Begin met een duidelijk patroon', 'Noor leest die brief heeft die brief als gelezen object. Noor is het onderwerp.'],
      ['Vergelijk een ander begin', 'Die brief leest Noor houdt dezelfde rollen en functies. De brief wordt niet het onderwerp doordat hij vooraan staat.'],
      ['Vergelijk een passief', 'Die brief wordt gelezen maakt de brief wel tot onderwerp. Dat is een verandering van constructie, niet alleen een andere beginplaats.'],
    ], 'Fronting verandert de plaats; passiveren verandert de functieverdeling.', 'H3 §3.1.2; H4 §4.4; H10 §10.2; PDF115,162–165,394–396', [['fronting', 'Een bouwstuk naar de beginpositie van de zin brengen.']]),
    teach('Bij Noor geeft Amir een kaart is Amir de ontvanger. Een kaart is wat wordt overgedragen.', [
      ['Maak de overdracht zichtbaar', 'Noteer wie geeft, wie ontvangt en wat wordt gegeven. Die drie vragen houden de deelnemers uit elkaar.'],
      ['Verbind rollen en functies', 'In dit patroon is Amir meewerkend voorwerp. Een kaart is lijdend voorwerp en Noor is onderwerp.'],
      ['Controleer voorzetsels in hun context', 'Aan de muur noemt bij hangen een plaats. Aan alleen is dus geen bewijs voor een ontvanger of meewerkend voorwerp.'],
    ], 'Zoek de ontvanger binnen de constructie; een voorzetsel alleen beslist het label niet.', 'H4 §§4.3.3,4.4.2; H13 §13.5; PDF160,163,500–503', [['meewerkend voorwerp', 'De ontvanger in een overdrachtspatroon zoals Noor geeft Amir een kaart.']]),
    teach('Rekenen op steun bevat een voorzetselvoorwerp: op steun vult de vaste vertrouwensrelatie bij rekenen op.', [
      ['Lees het werkwoord met zijn relatie', 'Rekenen op betekent hier vertrouwen op iets. Op steun geeft waarop het vertrouwen gericht is.'],
      ['Vergelijk een vrije omgeving', 'Tijdens de bijeenkomst geeft tijd bij die gebeurtenis. De groep is qua vorm ook een voorzetselgroep, maar heeft een andere functie.'],
      ['Let op plaatsingswerkwoorden', 'Op de tafel bij leggen geeft een geselecteerde bestemming. Dat is niet hetzelfde patroon als de vaste op-relatie van rekenen op.'],
    ], 'Selectie helpt de analyse, maar geeft niet elk geselecteerd plaatsstuk hetzelfde schoollabel.', 'H4 §§4.1–4.2; H5 §5.4; PDF151–158,210–214', [['voorzetselvoorwerp', 'Een groep met een voorzetsel dat bij de betekenis van de kern hoort, zoals rekenen op steun.']]),
  ],
  'zinsdelen-bepalingen': [
    teach('Een bepaling kan een naamwoord beschrijven of iets over de gebeurtenis zeggen. Zoek waaraan de extra informatie vastzit.', [
      ['Bekijk de naamwoordbeschrijving', 'De stoel bij het raam gebruikt de plaats om de stoel aan te wijzen. De groep zit binnen de stoelomschrijving.'],
      ['Bekijk de gebeurtenis', 'Noor leest bij het raam zegt waar het lezen gebeurt. De plaatsgroep zit buiten de naamwoordgroep Noor.'],
      ['Controleer met vervanging', 'Hij is bezet vervangt de stoel met zijn beschrijving. Zij leest bij het raam bewaart de plaats buiten de vervangen groep.'],
    ], 'De functie volgt de aanhechting, niet alleen de woorden in de groep.', 'H2 §2.3.3; H6 §6.1.4; PDF75–76,238–239', [['bijvoeglijke bepaling', 'Extra informatie binnen een naamwoordgroep.'], ['bijwoordelijke bepaling', 'Een groep die de gebeurtenis of mededeling situeert of nuanceert.']]),
    teach('Tijd aangeven is een functie. Een bijwoord, naamwoordgroep, voorzetselgroep of bijzin kan die functie vervullen.', [
      ['Vergelijk de tijdsvormen', 'Morgen, op maandag en deze week kunnen allemaal zeggen wanneer iets gebeurt. Hun interne bouw is verschillend.'],
      ['Benoem de kern', 'Op maandag begint met een voorzetsel. Deze week is opgebouwd rond het naamwoord week.'],
      ['Zoek ook lagere uitbreidingen', 'In heel rustig versterkt heel het woord rustig. Het is geen apart tijd- of plaatsblok van de hoofdzin.'],
    ], 'Wat het betekent, vertelt nog niet automatisch welke woordsoort of groep het is.', 'H2 §§2.3.3–2.3.4; H4 §4.2; PDF75–77,157–158'),
    teach('Zorgvuldig zegt hoe Noor werkt. Misschien zegt hoe zeker de spreker is dat Noor werkt. Die woorden hebben een verschillend bereik.', [
      ['Parafraseer de manier', 'Noor werkt zorgvuldig betekent dat de uitvoering zorgvuldig is. Het gaat om het werken zelf.'],
      ['Parafraseer de inschatting', 'Misschien werkt Noor betekent dat het mogelijk is dat Noor werkt. Het woord zegt niets over een aarzelende werkstijl.'],
      ['Controleer de kern en aanhechting', 'Een plaats kan bij een naamwoord, een gebeurtenis of een geselecteerde relatie horen. Beschrijf de bedoelde lezing voordat je een label kiest.'],
    ], 'Zoek welk deel van de boodschap door een bepaling wordt beïnvloed.', 'H2 §2.3.4; H6 §6.1.4; H12 §12.6; PDF76–77,238–239,461–464', [['bereik', 'Het stuk betekenis waarop een woord of groep invloed heeft.']]),
  ],
  'zinsdelen-bomen': [
    teach('Een boom toont groepsgrenzen die je eerst met taalproeven hebt onderzocht. De lijnen maken zichtbaar wat bij elkaar hoort.', [
      ['Onderbouw het grote blok', 'De leerling met de tas kan worden vervangen door zij. Dat ondersteunt één volledige onderwerpgroep.'],
      ['Onderzoek een kleiner blok', 'Met de tas hoort binnen die leerlingomschrijving. De tas is op zijn beurt de aanvulling van met.'],
      ['Teken alleen wat je kunt verantwoorden', 'Zet passende haakjes om de ondersteunde groepen. Een mooi schema zonder proeven bewijst de groepering niet.'],
    ], 'Eerst bewijs voor de groep; daarna een tekening van de analyse.', 'H3 §§3.1,3.3–3.4; PDF113–117,129–139'),
    teach('Een boom heeft lagen: een groter blok bevat kleinere blokken. Rechtstreeks onderdeel zijn is iets anders dan verder naar beneden liggen.', [
      ['Volg één directe lijn', 'Een kindknooppunt is een direct onderdeel van zijn ouder. Twee directe onderdelen met dezelfde ouder heten zusters.'],
      ['Volg meerdere lijnen', 'Rivier ligt in de route langs de rivier via een kleinere naamwoordgroep en voorzetselgroep onder de buitenste groep. Het ligt dus niet op dezelfde laag als route.'],
      ['Houd de labels consequent', 'Een eenvoudig schema kan naamwoordgroep en voorzetselgroep gebruiken. Extra theoretische lagen moet je apart toelichten als je ze toevoegt.'],
    ], 'Lagen tonen welke onderdelen rechtstreeks samenbouwen.', 'H3 §§3.3–3.4; H6 §6.1.2; PDF129–139,224–233', [['knooppunt', 'Een plek in de boom die een woord of groter bouwstuk voorstelt.']]),
    teach('De hele nominale tak kan onderwerp zijn, terwijl er binnen die tak een voorzetselgroep of bijzin zit.', [
      ['Benoem de volledige tak', 'De leerling die de tas draagt is als geheel onderwerp van lacht. Alleen leerling markeren mist de volledige grens.'],
      ['Benoem daarna de inhoud', 'Die de tas draagt is een kleinere deelzin binnen die groep. Daar heeft draagt een eigen werkwoordelijke taak.'],
      ['Vergelijk twee aanhechtingen', 'Een plaatsgroep binnen de fietsertak beschrijft de fietser. Buiten die tak kan dezelfde groep de zien-gebeurtenis situeren.'],
    ], 'Een tak heeft een interne bouw én een functie in het grotere geheel.', 'H1 §1.3; H3 §3.3; H6 §6.1.4; PDF30–33,129–135,238–239'),
  ],
  'zinsdelen-ambiguiteit': [
    teach('Dubbelzinnigheid kan in een woordbetekenis zitten, maar ook in de manier waarop dezelfde woorden aan elkaar hangen.', [
      ['Vergelijk een dubbel woord', 'Bank kan een meubel of geldinstelling betekenen. Het verschil zit dan in de gekozen woordbetekenis.'],
      ['Vergelijk twee relaties', 'Bij de fietser met de verrekijker kan de fietser het instrument dragen. Dezelfde met-groep kan ook vertellen waarmee Noor kijkt.'],
      ['Beschrijf twee concrete scènes', 'Vertel voor elke lezing wie de verrekijker bij zich heeft of gebruikt. Dat maakt het structurele verschil controleerbaar.'],
    ], 'Twee lezingen begrijpen begint met twee duidelijke situaties beschrijven.', 'H1 §1.3.2; H6 §6.1.4; PDF32–34,238–239', [['lexicaal', 'Wat met de betekenis van een woord te maken heeft.'], ['structureel', 'Wat met de opbouw en relaties tussen bouwstukken te maken heeft.']]),
    teach('Bij de ene lezing vervang je de fietser mét zijn verrekijkerbeschrijving. Bij de andere blijft het kijkinstrument apart staan.', [
      ['Neem de fietserbeschrijving samen', 'Noor zag [de fietser met de verrekijker] kan Noor zag hem worden. De met-groep zit in deze lezing binnen het object.'],
      ['Houd het instrument buiten de groep', 'Noor zag [de fietser] [met de verrekijker] wordt Noor zag hem met de verrekijker. Het instrument hoort bij het zien.'],
      ['Koppel proef en scène', 'Vraag welke fietser? of met welk hulpmiddel? Houd tijdens de vervanging dezelfde lezing vast.'],
    ], 'De gekozen aanhechting voorspelt welke beschrijving met het object mee verdwijnt.', 'H3 §3.1.1; H6 §6.1.4; PDF113–114,238–239'),
    teach('Maak bij herschrijven de bedoelde relatie expliciet. Soms maakt een langere zin het veel gemakkelijker om de juiste scène te zien.', [
      ['Kies eerst één scène', 'Bepaal of Noor de verrekijker gebruikt of de fietser hem bij zich heeft. Zonder die keuze kun je de onduidelijkheid niet gericht oplossen.'],
      ['Schrijf de relatie uit', 'Noor gebruikte een verrekijker om de fietser te zien noemt het instrument duidelijk. Een fietser die een verrekijker draagt maakt juist de andere relatie expliciet.'],
      ['Vergelijk de betekenis opnieuw', 'Controleer wie ziet, wie gezien wordt en wie het instrument heeft. Alleen korter maken of een komma toevoegen garandeert die relaties niet.'],
    ], 'Een goede revisie bewaart de scène en maakt de lastige relatie duidelijk.', 'H1 §1.3.2; H6 §6.1.4; PDF32–34,238–239'),
  ],
  'zinsbouw-v2': [
    sourced('tallerman', 'In een gewone mededelende hoofdzin staat één heel bouwstuk vóór de persoonsvorm. Dat bouwstuk kan uit veel woorden bestaan.', [
      ['Begrens het beginblok', 'Na de lange training noemt samen één tijdstip. Het is één bouwstuk, ook al telt het vier woorden.'],
      ['Zoek de persoonsvorm erna', 'Na de lange training fietst Noor heeft fietst meteen na dat hele blok. Dat is de tweede positie in de reeks bouwstukken.'],
      ['Vergelijk een korter begin', 'Noor fietst morgen begint met één woord. Dezelfde positie kan dus een kort of lang bouwstuk bevatten.'],
    ], 'V2 telt bouwstukken; spaties tellen is geen zinsanalyse.', 'H3 §3.3.4; H6 §6.2; PDF114–118,216–220', [['V2', 'Het patroon met de persoonsvorm op de tweede positie van de gewone mededelende hoofdzin.']]),
    sourced('tallerman', 'Een onderwerp, voorwerp, tijd of plaats kan het eerste bouwstuk zijn. Naar voren komen verandert de functie niet vanzelf.', [
      ['Vergelijk twee beginpunten', 'Noor leest die brief en die brief leest Noor kunnen dezelfde leesgebeurtenis beschrijven. Het tweede begin kan de brief extra nadruk geven.'],
      ['Bewaar de functies', 'Noor blijft in die bedoelde lezing de lezer en het onderwerp. Die brief blijft het gelezen voorwerp.'],
      ['Verplaats een passende groep', 'Bij het nieuwe station is als geheel een plaatsgroep. Alleen willekeurige woorden uit die groep halen test een andere opbouw.'],
    ], 'De eerste plek geeft een beginpunt; de grammaticale functie vraagt eigen bewijs.', 'H6 §6.2; H8 §§8.1,8.3; PDF216–220,306–310,323–325'),
    sourced('tallerman', 'De volgorde hangt van het zinstype af. Een mededeling, ja/nee-vraag en ingeleide bijzin hebben verschillende patronen.', [
      ['Herken de mededeling', 'Noor fietst morgen heeft één beginblok vóór de persoonsvorm. Daar gebruik je het V2-patroon.'],
      ['Vergelijk vraag en bijzin', 'Fietst Noor morgen? begint met de persoonsvorm. Omdat Noor morgen fietst zet de persoonsvorm in het eindgebied.'],
      ['Teken aparte grenzen', 'Noor zegt [dat Amir vertrekt] bevat twee deelzinnen. Zegt en vertrekt volgen ieder het patroon van hun eigen deelzin.'],
    ], 'Eerst het zinstype en de grens, daarna de volgorde.', 'H3 §3.3.4; H6 §6.2; PDF114–118,216–220'),
  ],
  'zinsbouw-inversie': [
    sourced('tallerman', 'Morgen vertrekt Noor heeft de persoonsvorm vóór het onderwerp. Noor blijft wel hetzelfde onderwerp.', [
      ['Begin bij de gewone vergelijking', 'Noor vertrekt morgen begint met het onderwerp. Verplaats de hele tijdsgroep morgen naar het begin.'],
      ['Behoud de tweede positie', 'Morgen vertrekt Noor houdt vertrekt meteen na het beginblok. Daardoor komt Noor achter de persoonsvorm terecht.'],
      ['Controleer de functie', 'Maak Noor meervoudig: morgen vertrekken de vrienden. Het onderwerp blijft de groep waarmee het werkwoord in getal samenhangt.'],
    ], 'Inversie is een volgordeverschil, geen nieuwe onderwerpfunctie.', 'H3 §3.3.4; H6 §§6.1–6.2; PDF114–118,215–220', [['inversie', 'De volgorde waarbij de persoonsvorm vóór het onderwerp staat.']]),
    sourced('tallerman', 'Een ja/nee-vraag begint hier met de persoonsvorm. Een vraag naar een bouwstuk begint met een passende vraaggroep.', [
      ['Bepaal wat je wilt weten', 'Kiest Noor de route? vraagt of de hele mededeling klopt. Welke route kiest Noor? vraagt naar het gekozen object.'],
      ['Houd de vraaggroep volledig', 'Welke route hoort als één bouwstuk bij elkaar. De persoonsvorm kiest volgt er direct op.'],
      ['Controleer een onderwerpsvraag', 'Wie kiest de route? heeft wie zelf als onderwerp. Je hoeft geen tweede onderwerp toe te voegen.'],
    ], 'Een vraaggroep behoudt de relatie waarnaar je vraagt.', 'H8 §8.1; PDF306–314', [['constituentvraag', 'Een vraag naar één bouwstuk, bijvoorbeeld wie, welke route of wanneer.']]),
    sourced('tallerman', 'Wanneer vertrekt Noor? wordt als gewone indirecte vraag: ik vraag wanneer Noor vertrekt.', [
      ['Scheid vraaginhoud en presentatie', 'De directe vraag staat zelfstandig. In ik vraag [wanneer Noor vertrekt] zit dezelfde vraaginhoud binnen een grotere zin.'],
      ['Gebruik het bijzinpatroon binnenin', 'Wanneer Noor vertrekt heeft de persoonsvorm achteraan. De directe vraagvolgorde wordt dus niet eenvoudig gekopieerd.'],
      ['Maak desgewenst de hoofdzin vragend', 'Vraag ik [wanneer Noor vertrekt]? verandert alleen het buitenste domein. De ingebedde vraag houdt haar eigen patroon.'],
    ], 'Een vraagteken maakt niet elke ingebedde deelzin tot een directe vraag.', 'H3 §3.3.4; H8 §8.1.1; PDF114–118,309–310', [['indirecte vraag', 'Vraaginhoud die als bijzin in een grotere zin is opgenomen.']]),
  ],
  'zinsbouw-velden': [
    sourced('ans', 'Een veldschema laat zien waar de bouwstukken staan. Hun functie benoem je daarnaast apart.', [
      ['Zoek de werkwoordelijke randen', 'In morgen heeft Noor de kaart gemaakt staat heeft aan de linkerkant van het raam. Gemaakt staat aan de rechterkant.'],
      ['Benoem de gebieden', 'Morgen staat vóór het raam. Noor en de kaart staan erbinnen als twee verschillende bouwstukken.'],
      ['Houd positie en taak apart', 'Die kaart kan ook vóór heeft staan. De plek verandert, maar de kaart blijft het gemaakte object.'],
    ], 'Een veld is een plaatsgebied; het is geen zinsfunctie.', '21.1.1.1 Het principe van de polen van een zin', [['voorveld', 'Het gebied vóór de linker werkwoordelijke rand.'], ['middenveld', 'Het gebied tussen de twee randen.']]),
    teach('Heeft en gelezen kunnen ver uit elkaar staan en toch samenwerken. De woorden ertussen worden daardoor geen werkwoorden.', [
      ['Volg de twee uiteinden', 'Noor heeft de lange uitleg gelezen bevat het verband heeft gelezen. De uitleg is een apart object tussen beide vormen.'],
      ['Zie waarom lezen zwaar kan worden', 'Een lange beschrijving houdt de verwachting op gelezen langer open. Extra ingebedde stukjes kunnen dat geheugenwerk vergroten.'],
      ['Reviseer de concrete belasting', 'Verkort de tussenliggende beschrijving of verdeel informatie over twee zinnen. Controleer daarna of dezelfde leesgebeurtenis en tijd behouden blijven.'],
    ], 'Een lange afstand kan lastig lezen zonder grammaticaal fout te zijn.', 'H1 §1.5.2; PDF44–45', [['tang', 'Twee samenhangende delen waartussen andere informatie staat.']]),
    sourced('ans', 'Een bijzin heeft een eigen raam. Een bijzin ná de hoofdzin houdt ook zijn eigen interne volgorde.', [
      ['Vergelijk de twee patronen', 'Noor heeft gewacht is een hoofdzin. Omdat Noor heeft gewacht begint met een inleider en plaatst de werkwoorden in het eindgebied.'],
      ['Bekijk een uitbreiding achter het raam', 'Noor heeft gewacht [tot Amir kwam] laat na gewacht nog een tijdsbijzin volgen. Het hoofdzinraam en de tijdsbijzin zijn aparte lagen.'],
      ['Zoek binnen de uitbreiding opnieuw', 'Kwam is de persoonsvorm van de tot-bijzin. Het hoort niet ineens in hetzelfde werkwoordcluster als heeft gewacht.'],
    ], 'Maak per deelzin een eigen kaart van grenzen en werkwoordposities.', '21.1.1.1; 21.7.2.1 Afhankelijke zinnen', [['achterveld', 'Het gebied na het werkwoordelijke eindmateriaal van de deelzin.']]),
  ],
  'zinsbouw-werkwoordclusters': [
    sourced('ans', 'Heeft willen lezen bevat één persoonsvorm en twee infinitieven. Willen staat in dit voltooide patroon waar je misschien gewild verwacht.', [
      ['Benoem de finiete vorm', 'Noor heeft willen lezen wordt Noor had willen lezen. Heeft draagt hier het finiete tijdscontrast.'],
      ['Volg de andere taken', 'Lezen noemt de activiteit. Willen brengt de wens in het werkwoordelijke verband.'],
      ['Herken het vormpatroon', 'Bij heeft willen lezen verschijnt willen als vervangende infinitief. De vorm gewild past hier niet als automatische vervanging.'],
    ], 'Een voltooid verband bevat niet in elke constructie dezelfde soort vormen.', '18.5.2.1.ii Hebben en zijn met een vervangende infinitief', [['vervangende infinitief', 'Een infinitief die in dit werkwoordcluster verschijnt in plaats van een deelwoord.']]),
    sourced('ans', 'Omdat Noor heeft gelezen en omdat Noor gelezen heeft zijn beide mogelijk. Die variatie geldt voor dit eenvoudige hulpwerkwoord-deelwoordpaar.', [
      ['Vergelijk dezelfde inhoud', 'Laat onderwerp, tijd en leesgebeurtenis gelijk. Verander alleen de volgorde van heeft en gelezen.'],
      ['Herken beide patronen', 'Het deelwoord kan hier vóór of achter het hulpwerkwoord staan. Eén modelantwoord hoeft de andere variant dus niet uit te sluiten.'],
      ['Beperk de conclusie', 'Heeft willen lezen is een ander, langer patroon. Twee toegestane ordeningen bewijzen niet dat alle werkwoorden vrij door elkaar kunnen staan.'],
    ], 'Leer de mogelijkheden per constructie, niet als een vrije schudregel.', '18.5.7.3.ii Eindgroepen met twee werkwoorden'),
    sourced('tallerman', 'Het aantal werkwoordsvormen vertelt niet vanzelf hoeveel deelzinnen er zijn. Onderzoek hoe de vormen afhankelijk van elkaar zijn.', [
      ['Vergelijk een nauw verband', 'Heeft willen lezen bevat verschillende grammaticale taken rond het lezen. Alleen de vormen tellen verklaart die opbouw niet.'],
      ['Vergelijk een duidelijk ingebedde zin', 'Noor zegt [dat Amir leest] heeft een hoofdzin en een finiete inhoudsbijzin. Elke laag heeft een eigen persoonsvorm.'],
      ['Controleer de inhoud bij inkorten', 'Wil lezen betekent iets anders dan heeft gelezen. Een hulp- of modale laag verwijderen kan dus ook betekenis verwijderen.'],
    ], 'Tel niet alleen vormen; volg hun taken, grenzen en betekenis.', 'H3 §§3.1–3.4; PDF96–124'),
  ],
  'zinsbouw-nevenschikking': [
    sourced('tallerman', 'En kan woorden, woordgroepen of deelzinnen verbinden. Zoek eerst welke twee bouwstukken er werkelijk verbonden zijn.', [
      ['Baken de twee delen af', 'Noor en de vrienden van Amir verbindt twee nominale bouwstukken. De delen hoeven niet even lang te zijn.'],
      ['Bepaal het niveau', 'Noor leest en Amir tekent verbindt twee deelzinnen. Bij het station en naast het museum verbindt juist plaatsgroepen.'],
      ['Controleer de gezamenlijke taak', 'Noor en de vrienden van Amir komen heeft samen één samengesteld onderwerp. De verbinding creëert niet voor elk woord een nieuwe zinsfunctie.'],
    ], 'Het voegwoord geeft een verbinding; de groepsgrenzen geven het niveau.', 'H3 §3.2; PDF106–107', [['nevenschikking', 'Een verbinding van bouwstukken met gelijkwaardige rang in die structuur.'], ['conjunct', 'Eén van de verbonden bouwstukken.']]),
    teach('Een beschrijving vóór en kan soms op beide groepen slaan. Soms beschrijft ze alleen de eerste groep.', [
      ['Beschrijf de brede lezing', 'Jonge leerlingen en docenten kan worden bedoeld als jonge leerlingen én jonge docenten. De leeftijdsbeschrijving heeft dan een breed bereik.'],
      ['Beschrijf de smalle lezing', 'Het kan ook gaan om jonge leerlingen naast docenten van allerlei leeftijden. Dan hoort jonge alleen bij de eerste groep.'],
      ['Maak de keuze zichtbaar', 'Herhaal jonge bij beide groepen of geef elke groep een eigen beschrijving. Zo hoeft de lezer het bereik niet te raden.'],
    ], 'Een beschrijving vóór een verbinding heeft niet vanzelf bereik over alles erna.', 'H1 §1.3.2, oefening1.8; PDF32–34,54–55', [['bereik', 'Welke delen door de beschrijving worden meegenomen.']]),
    teach('Bij een verkorting moet je kunnen terugvinden wie de tweede handeling doet. De dichtstbijzijnde naam is daarvoor geen vaste regel.', [
      ['Vul de herhaling terug in', 'Noor leest de brief en bekijkt de kaart laat Noor bij beide handelingen begrijpen. De volledige versie maakt die relatie zichtbaar.'],
      ['Controleer de bedoelde actor', 'Noor groet Amir en vertrekt laat in de gewone lezing Noor vertrekken. Amir staat dichter bij vertrekt, maar bepaalt de weglating niet.'],
      ['Schrijf een andere actor uit', 'Als Amir vertrekt, noem Amir in het tweede deel. Een korte naamherhaling kan een verkeerde interpretatie voorkomen.'],
    ], 'Vul ontbrekend materiaal terug in en controleer of de bedoelde relatie klopt.', 'H3 §3.2.3; PDF127–128', [['ellipsis', 'Weglating waarvan de ontbrekende inhoud uit de constructie en context terug te vinden is.']]),
  ],
  'zinsbouw-bijzinnen': [
    sourced('tallerman', 'Een bijzin zit als kleiner zinnetje in een grotere constructie. Zo’n bijzin kan zelf weer een nog kleinere bijzin bevatten.', [
      ['Begin bij de buitenste laag', 'Noor zegt [dat Amir denkt dat de trein vertrekt] heeft zegt als hoofdzinspersoonsvorm. De dat-inhoud is erin opgenomen.'],
      ['Open de volgende laag', 'Dat Amir denkt [dat de trein vertrekt] bevat zelf een kleinere inhoudsbijzin. De middelste zin is dus ingebed én omvattend.'],
      ['Geef elke laag een eigen anker', 'Zegt, denkt en vertrekt horen bij verschillende deelzinnen. Geneste haakjes houden die relaties uit elkaar.'],
    ], 'Matrix is een relatie tussen lagen; het betekent niet altijd hoofdzin.', 'H3 §3.3; PDF107–118', [['matrix', 'Een grotere deelzin die een kleinere deelzin bevat.'], ['ingebed', 'Opgenomen binnen een grotere constructie.']]),
    sourced('tallerman', 'Een bijzin kan inhoud, reden of een naamwoordbeschrijving geven. Hij kan zelfs als geheel onderwerp zijn.', [
      ['Lees de inhoudsrelatie', 'Noor weet [dat Amir vertrekt] vult in wat Noor weet. De hele bijzin hoort bij de kennisinhoud.'],
      ['Vergelijk andere taken', 'Omdat de trein vroeg rijdt kan een vertrekreden geven. De trein [die vroeg rijdt] gebruikt de bijzin als treinbeschrijving.'],
      ['Bekijk de buitenste functie', '[Dat Amir vertrekt] verrast Noor maakt de bijzin tot onderwerp. De vorm bijzin bepaalt dus niet één vaste zinsfunctie.'],
    ], 'Benoem zowel de vorm bijzin als de taak in de grotere constructie.', 'H3 §§3.3.1–3.3.3; PDF107–113'),
    sourced('tallerman', 'Een hele bijzin kan het eerste hoofdzinblok zijn. Binnen die bijzin blijft de eigen woordvolgorde gelden.', [
      ['Neem de vooropstaande bijzin samen', '[Omdat de trein vroeg rijdt] vertrekt Amir op tijd heeft de hele reden vóór vertrekt. Dat is één groot beginbouwstuk.'],
      ['Onderzoek de interne volgorde', 'Rijdt hoort bij de redenbijzin. Vertrekt hoort bij de hoofdzin, dus tel hun posities niet in één platte reeks.'],
      ['Controleer het bereik van een reden', 'Noor zegt dat Amir vertrekt omdat de trein vroeg rijdt kan nadere context vragen. Benoem of de reden bij het zeggen of bij het vertrekken hoort.'],
    ], 'Iedere deelzin heeft een eigen ordening en een relatie met het grotere geheel.', 'H3 §3.3; H6 §6.2; PDF107–118,216–220'),
  ],
  'zinsbouw-betrekkelijke-bijzinnen': [
    sourced('tallerman', 'De brief die Noor schreef bevat een beschrijving van de brief. De hele briefomschrijving kan daarna één bouwstuk in de hoofdzin zijn.', [
      ['Zoek wat beschreven wordt', 'Die Noor schreef vertelt iets over brief. De bijzin staat hier niet los als tweede hoofdmededeling.'],
      ['Neem de beschrijving mee', '[De brief die Noor schreef] ligt hier heeft de volledige groep als onderwerp. De kleinere bijzin hoort binnen die groep.'],
      ['Vergelijk een inhoudsbijzin', 'Noor zegt [dat Amir komt] beschrijft geen naamwoord. Het woord dat herkennen is dus niet genoeg om een betrekkelijke bijzin vast te stellen.'],
    ], 'Zoek de nominale beschrijving en de grens van de volledige groep.', 'H8 §8.2; PDF314–320', [['betrekkelijke bijzin', 'Een bijzin die in deze constructie een naamwoord beschrijft.'], ['antecedent', 'Het naamwoordelijke bouwstuk waarop die beschrijving teruggrijpt.']]),
    sourced('tallerman', 'De hele briefgroep kan buiten de bijzin onderwerp zijn, terwijl die binnen de bijzin een object is.', [
      ['Benoem de buitenste taak', '[De brief die Noor schreef] ligt hier heeft de volledige briefgroep als onderwerp van ligt. Dat is de hoofdzinlaag.'],
      ['Maak de kleine mededeling compleet', 'Noor schreef de brief laat zien welke relatie die vertegenwoordigt. Binnen de bijzin is Noor onderwerp en die het geschreven object.'],
      ['Vergelijk het omgekeerde', 'In Noor leest de brief [die aankwam] is de briefgroep buiten object. Binnen is die juist onderwerp van aankwam.'],
    ], 'Een referent kan in twee deelzinnen verschillende grammaticale relaties hebben.', 'H8 §8.2; PDF315–319'),
    teach('Een beperkende bijzin kiest welke leden je bedoelt. Een aanvullende bijzin vertelt iets extra over de al bedoelde groep.', [
      ['Kies eerst de verzameling', 'De leerlingen die klaar zijn kan alleen de al klaargekomen leerlingen selecteren. Andere leerlingen vallen dan buiten de mededeling.'],
      ['Vergelijk aanvullende informatie', 'De leerlingen, die al klaar zijn, presenteert het klaar-zijn als extra informatie over de bedoelde groep. Je kiest daarmee een andere lezing.'],
      ['Koppel komma en bedoeling', 'Let vooral op de komma vóór de beschrijving. Een komma aan het einde kan ook bij een beperkende bijzin nodig of verhelderend zijn.'],
    ], 'Bepaal eerst wie je bedoelt; kies daarna de passende afbakening.', 'H3 §3.2.1 en noot4; PDF118–119,138', [['beperkend', 'Helpt kiezen welke leden van een grotere groep bedoeld worden.'], ['aanvullend', 'Geeft extra informatie over een al vastgestelde referent of groep.']]),
  ],
  'zinsbouw-beknopte-bijzinnen': [
    sourced('tallerman', 'Om rustig te oefenen vertelt een doel zonder eigen persoonsvorm. Een bijzin zonder persoonsvorm kan dus wel een gebeurtenis beschrijven.', [
      ['Onderzoek de werkwoordsvorm', 'Oefenen is hier een infinitief. Het draagt geen eigen finiet tijds- en persoonscontrast.'],
      ['Lees de relatie', 'Noor blijft binnen [om te oefenen] noemt het doel van binnenblijven. Het ontbreken van een persoonsvorm maakt die doelrelatie niet onvolledig.'],
      ['Vergelijk een uitgewerkte vorm', 'Nadat Noor de deur had gesloten heeft een persoonsvorm en uitgesproken onderwerp. De verkorte na de deur te hebben gesloten gebruikt een andere bouw.'],
    ], 'Geen eigen persoonsvorm betekent niet: geen gebeurtenis of relatie.', 'H3 §§3.1.3,3.3.2; PDF101–105,111–112', [['beknopte bijzin', 'Een niet-finiete bijzin met een begrepen, onuitgesproken onderwerp.']]),
    teach('Bij Noor probeert te slapen begrijp je Noor als degene die probeert én degene die slaapt. De constructie verbindt die rollen.', [
      ['Zoek de begrepen deelnemer', 'Vraag wie probeert en wie zou slapen. In deze zin wijzen beide relaties naar Noor.'],
      ['Volg het gekozen werkwoord', 'Probeert kent Noor een probeerrol toe. Lijkt in Noor lijkt te slapen doet dat niet op dezelfde manier.'],
      ['Vergelijk een weerzin', 'Het lijkt te regenen kan zonder bewuste lijker. Het contrast helpt zien dat niet elke infinitiefconstructie hetzelfde rollenpatroon heeft.'],
    ], 'Verantwoord een begrepen deelnemer via de constructie, niet via nabijheid alleen.', 'H11 §§11.1–11.4; PDF414–429', [['controle', 'Een afhankelijkheid waarbij de constructie vastlegt wie het begrepen onderwerp van de infinitief is.'], ['raising', 'Een ander patroon, zoals lijkt te slapen, waarin de hogere vorm geen aparte deelnemersrol aan het onderwerp toekent.']]),
    teach('Een verkorting moet de juiste deelnemer laten begrijpen. Na de deur te hebben gesloten, viel de sleutel laat anders de sleutel als sluiter lezen.', [
      ['Vraag wie de deur sluit', 'In de gewone verkorte tijdsconstructie zoek je die deelnemer bij het hoofdzinonderwerp. Hier is dat de sleutel.'],
      ['Vergelijk de bedoelde situatie', 'Een sleutel sluit in deze gewone lezing zelf geen deur. Er is dus een verkeerde aansluiting tussen de twee gebeurtenissen.'],
      ['Maak de actor expliciet', 'Nadat Noor de deur had gesloten, viel de sleutel op de grond noemt de juiste sluiter. Controleer ook of de bedoelde tijdsrelatie behouden blijft.'],
    ], 'Schrijf de langere versie als de verkorting de verkeerde actor suggereert.', 'H11 §§11.1–11.2; PDF415–420; eigen Nederlandse schrijf-toepassing'),
  ],
  'zinsbouw-verwijzen': [
    teach('Een voornaamwoord verwijst via tekst of situatie. De vorm helpt kiezen, maar het dichtstbijzijnde naamwoord is niet automatisch de juiste referent.', [
      ['Zoek passende kandidaten', 'Na de leerlingen zien Noor kan zij meerdere interpretaties oproepen. Kijk welke deelnemers beschikbaar zijn.'],
      ['Gebruik het vormverband', 'Zij vertrekken geeft meervoud aan; zij vertrekt enkelvoud. De persoonsvorm helpt de mogelijke verwijzing beperken.'],
      ['Neem de situatie mee', 'Jij kan de aangesprokene aanwijzen zonder een voorafgaande naam. Sommige verwijzingen vind je dus buiten de geschreven zin.'],
    ], 'Combineer vorm, structuur en context om de bedoelde referent te vinden.', 'H15 §§15.1–15.2; PDF557–560', [['referent', 'De persoon, zaak of andere entiteit waarnaar een uitdrukking verwijst.']]),
    teach('Mila ziet zichzelf wijst terug naar Mila. Mila ziet haar vraagt in de gewone lezing een andere passende persoon.', [
      ['Vergelijk de relatie', 'Zichzelf maakt ziener en geziene hier dezelfde persoon. Haar doet dat in dit gewone patroon juist niet.'],
      ['Onderzoek de lokale constructie', 'Het werkwoord en de deelzingrens doen ertoe bij zulke terugverwijzing. Alleen twee bij elkaar passende namen zoeken is niet voldoende.'],
      ['Bewaar taalgebonden verschillen', 'Nederlands heeft zich én zichzelf met eigen gebruikspatronen. Engelse reflexieven leveren vergelijkingsmateriaal, geen mechanische vervanglijst.'],
    ], 'Een gewone verwijzing en een wederkerende relatie hebben verschillende voorwaarden.', 'H15 §§15.2–15.4 en problemen15.1–15.2; PDF559–569,577–578', [['wederkerend', 'Een relatie waarbij de deelnemer in een passend lokaal verband naar zichzelf terugwijst.']]),
    teach('Noor vertelde Sara dat zij zou vertrekken laat zonder extra context meer dan één vertrekker toe. Maak eerst beide lezingen zichtbaar.', [
      ['Werk de eerste lezing uit', 'Vervang zij door Noor. Dan vertelt Noor over haar eigen vertrek.'],
      ['Werk de tweede lezing uit', 'Vervang zij door Sara. Dezelfde oorspronkelijke zin kan zo over Sara haar vertrek gaan.'],
      ['Herschrijf vanuit de gekozen referent', 'Herhaal de bedoelde naam als dat de onzekerheid oplost. Controleer dat je geen nieuwe tijd of andere geciteerde inhoud toevoegt.'],
    ], 'Eerst weten wie bedoeld wordt; daarna kiezen hoe elegant je die persoon noemt.', 'H15 §15.1.2; PDF558–559'),
  ],
  'zinsbouw-er': [
    sourced('ans', 'Er kan een bekende plaats terughalen of bij een hoeveelheid horen. Reconstrueer eerst wat er in deze zin kort wordt gehouden.', [
      ['Herstel een plaats', 'Noor woont in Delft; Amir woont er ook kan Delft opnieuw noemen. Deze lezing heet locatief.'],
      ['Herstel een telbare soort', 'Heb je schriften? Ik heb er vier bedoelt vier schriften. Hier ondersteunt er de hoeveelheid, geen woonplaats.'],
      ['Vergelijk de uitbreiding', 'Schrijf in Delft of vier schriften terug. Je ziet dan welke relatie de korte vorm in de bedoelde context draagt.'],
    ], 'Dezelfde korte vorm vraagt niet altijd dezelfde uitbreidingsproef.', '8.6.1.2 Gebruikswijzen van er; 8.6.5.2.i Algemeen gebruikelijk', [['locatief', 'Verwijzend naar een plaats.'], ['kwantitatief', 'Verbonden met een hoeveelheid van een begrepen soort.']]),
    sourced('ans', 'In er morgen op horen er en op bij elkaar. De afstand tussen de woorden verbreekt de voorzetselrelatie niet.', [
      ['Zoek het tweede deel', 'Noor rekent er morgen op bevat het verband er ... op. Morgen geeft apart de tijd.'],
      ['Herstel de volledige relatie', 'Bij verwijzing naar steun kun je rekenen op steun uitschrijven. Zo blijft zichtbaar waarop het rekenen gericht is.'],
      ['Vergelijk de aaneengesloten vorm', 'Noor rekent erop houdt de delen naast elkaar. De gesplitste vorm vraagt dezelfde relationele analyse.'],
    ], 'Zoek bij prepositioneel er ook het bijbehorende voorzetseldeel.', '8.6.4 Prepositioneel er', [['prepositioneel er', 'Er als deel van een verband zoals erop, eraan of er ... op.']]),
    sourced('ans', 'Er staan twee fietsen introduceert een nieuwe of onbepaalde groep. Twee fietsen levert hier het meervoud van staan.', [
      ['Vergelijk één en twee', 'Er staat één fiets wordt er staan twee fietsen. De nominale groep levert het getal, terwijl er gelijk blijft.'],
      ['Lees de presentatietaak', 'Deze er hoeft geen bekende plaats terug te halen. De zin brengt vooral een deelnemer of situatie in beeld.'],
      ['Herken het onpersoonlijke patroon', 'Er wordt gedanst presenteert een activiteit zonder nieuw fietsachtig onderwerp. Verzin daarbij geen lijdend voorwerp dat onderwerp geworden zou zijn.'],
    ], 'Presentatie, plaatsverwijzing en getalsovereenkomst zijn aparte vragen.', '8.6.3.1 Inleidende opmerkingen', [['presentatief', 'Gebruikt om een deelnemer of situatie in de mededeling te introduceren.']]),
  ],
  'zinsbouw-informatiestructuur': [
    teach('Dezelfde geschreven zin kan op verschillende vragen antwoorden. De context bepaalt welk bouwstuk de nieuwe bijdrage is.', [
      ['Neem een wie-vraag', 'Wie repareert de fiets? maakt de reparateur onbekend. Noor repareert de fiets levert Noor als nieuw antwoord.'],
      ['Neem een wat-vraag', 'Wat repareert Noor? maakt het gerepareerde ding onbekend. Dezelfde antwoordzin levert nu de fiets als nieuwe bijdrage.'],
      ['Houd functie en informatietaak apart', 'Noor blijft in beide zinnen grammaticaal onderwerp. De focus wisselt met de voorafgaande vraag.'],
    ], 'Benoem de vraagcontext voordat je topic of focus aanwijst.', 'H3 §3.1.4 en noot3; H8 §8.4; PDF117,137–138,328–333', [['focus', 'De gevraagde, nieuwe of contrasterende bijdrage in deze context.'], ['topic', 'Waarover de uiting in deze context verder informeert.']]),
    sourced('tallerman', 'Die kaart maakt Noor kan de kaart als aansluiting of contrast vooropzetten. De kaart blijft het object van maken.', [
      ['Vergelijk de neutrale variant', 'Noor maakt die kaart heeft Noor vooraan. De geselecteerde relaties zijn duidelijk: maker en gemaakt ding.'],
      ['Plaats het object voorop', 'Die kaart maakt Noor verandert het beginpunt. De grammaticale relatie van kaart wordt daardoor geen onderwerp.'],
      ['Controleer de context', 'Die kaart maakt Noor, die brief schrijft Amir ondersteunt een contrast. Zonder passende context kan hetzelfde begin nadrukkelijker klinken dan bedoeld.'],
    ], 'Een grammaticale herschikking werkt communicatief pas binnen een passende context.', 'H8 §8.3; PDF323–325'),
    sourced('tallerman', 'De fiets wordt door Noor gerepareerd maakt de fiets tot onderwerp. Noor blijft de reparateur als haar naam in de door-groep staat.', [
      ['Vergelijk de functies', 'Noor repareert de fiets heeft Noor als onderwerp en de fiets als object. De passieve variant verdeelt die functies anders.'],
      ['Bewaar de rollen', 'De fiets blijft wat gerepareerd wordt. De door-groep kan Noor als actor expliciet houden of onuitgesproken laten.'],
      ['Controleer wat de lezer nodig heeft', 'Als verantwoordelijkheid belangrijk is, moet de actor duidelijk blijven. Bewaar ook tijd en woorden zoals moet wanneer de noodzaak deel van de boodschap is.'],
    ], 'Kies perspectief bewust en controleer welke informatie zichtbaar blijft.', 'H7 §7.1; PDF267–274', [['passief', 'Een constructie die de gewone actieve functieverdeling wijzigt en de oorspronkelijke actor op de achtergrond kan zetten.']]),
  ],
  'zinsbouw-interpunctie': [
    sourced('tallerman', 'Maak eerst zichtbaar welke deelzin waar bij hoort. Dat geeft een duidelijkere basis voor leestekens dan alleen werkwoorden tellen.', [
      ['Vind de hoofdmededeling', 'Noor, die de route heeft verkend, vertelt dat de brug gesloten is heeft vertelt op het buitenste niveau. De hoofdmededeling gaat over wat Noor vertelt.'],
      ['Scheid beschrijving en inhoud', 'Die de route heeft verkend beschrijft Noor. Dat de brug gesloten is geeft de vertelde inhoud.'],
      ['Analyseer binnen elke grens', 'Heeft hoort bij de beschrijving en is bij de vertelde inhoud. De drie persoonsvormen liggen in verschillende domeinen.'],
    ], 'Eerst een kaart van de deelzinnen, daarna de leestekens.', 'H3 §3.3; H8 §8.2; PDF107–118,314–320'),
    teach('Komma’s helpen tonen of een bijzin selecteert of extra informatie toevoegt. Bepaal die bedoeling vóór je de zin afbakent.', [
      ['Kies een beperkende lezing', 'De leerlingen die een rode tas hebben kan alleen de groep met rode tassen bedoelen. De beschrijving helpt de juiste leerlingen selecteren.'],
      ['Vergelijk een aanvullende lezing', 'De leerlingen, die allemaal een rode tas hebben, presenteert de tassen als extra informatie. De bedoelde groep is al vastgesteld.'],
      ['Controleer de grenzen apart', 'De komma vóór de beschrijving is cruciaal voor dit contrast. Een komma aan de eindgrens kan daarnaast de hoofdstructuur verduidelijken, ook bij een beperkende bijzin.'],
    ], 'Een hoorbare pauze of vast woordaantal vervangt de betekeniscontrole niet.', 'H3 §3.2.1 en noot4; PDF118–119,138'),
    teach('Een zin kan grammaticaal kloppen en toch veel geheugenwerk vragen. Verbeter de concrete lezerslast en controleer daarna of de boodschap gelijk bleef.', [
      ['Zoek wat lang openblijft', 'Een lange onderwerpomschrijving kan de lezer laten wachten op de hoofdmededeling. Meerdere geneste bijzinnen vergroten soms die belasting.'],
      ['Kies een gerichte revisie', 'Splits informatie, benoem een onduidelijke referent of maak de redenrelatie expliciet. Zo pak je het gevonden probleem aan.'],
      ['Vergelijk de eindbetekenis', 'Controleer deelnemers, tijd, noodzaak en bereik. Een kortere zin is pas beter als hij nog de bedoelde boodschap geeft.'],
    ], 'Leesbaarheid vraagt structuur én betekenisbehoud, geen harde werkwoordlimiet.', 'H1 §1.5.2; H15 §15.1.2; PDF44–46,558–559'),
  ],
};
