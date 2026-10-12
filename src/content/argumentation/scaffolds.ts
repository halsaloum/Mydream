export type LessonScaffold = {
  context: string;
  question: string;
  options: { id: string; text: string; feedback: string }[];
  answer: string;
  bridge: string;
};

const starter = (
  id: string,
  context: string,
  question: string,
  options: [string, string][],
  answer: number,
  bridge: string,
): LessonScaffold => ({
  context,
  question,
  options: options.map(([text, feedback], index) => ({ id: `${id}-o${index + 1}`, text, feedback })),
  answer: `${id}-o${answer + 1}`,
  bridge,
});

export const lessonScaffolds: Record<string, LessonScaffold> = {
  'basis-standpunt-en-reden': starter(
    'start-standpunt',
    'Een collega zegt: “Laten we foutmeldingen op één plek verzamelen, want nu raakt informatie verspreid.” Het team moet kiezen hoe het meldingen bijhoudt. Jij wilt eerst begrijpen wat de collega precies voorstelt.',
    'Wat stelt de collega voor?',
    [
      ['Foutmeldingen op één plek verzamelen.', 'Dit is de keuze die de collega wil verdedigen.'],
      ['Informatie raakt nu verspreid.', 'Dit is de reden voor de voorgestelde keuze.'],
      ['Het team moet kiezen.', 'Dit beschrijft de situatie, maar noemt de voorgestelde keuze niet.'],
    ], 0,
    'Hierna wijs je zelf het standpunt en de reden in andere korte uitspraken aan.',
  ),
  'basis-redenen-beoordelen': starter(
    'start-beoordelen',
    'Een teamleider verwacht genoeg voorraad voor morgen. Zij baseert dat op een bericht van vorige maand. Een collega kan de huidige voorraad tellen, maar heeft dat nog niet gedaan; het team moet beslissen of bestellen nodig is.',
    'Welke vraag helpt de reden te controleren?',
    [
      ['Vinden we bestellen leuk?', 'Dat vraagt naar een voorkeur en controleert de voorraad niet.'],
      ['Hoeveel voorraad ligt er nu?', 'Dit controleert of de reden nog klopt voor de huidige beslissing.'],
      ['Waarom is de teamleider zo zeker?', 'Zekerheid kan een gespreksonderwerp zijn, maar vervangt een actuele controle niet.'],
    ], 1,
    'Hierna beoordeel je ook of een betrouwbare reden bij de keuze past en sterk genoeg is.',
  ),
  'basis-verzwegen-stap': starter(
    'start-brug',
    'Een collega zegt: “Doe extra bescherming om deze bestelling, want de onderdelen zijn breekbaar.” Zij noemt geen verdere uitleg. Het team wil weten waarom die eigenschap een reden is om anders te verpakken.',
    'Welke niet uitgesproken stap past hierbij?',
    [
      ['Elke bestelling vraagt altijd dezelfde verpakking.', 'Dat verklaart niet waarom juist breekbaarheid extra bescherming rechtvaardigt.'],
      ['Extra bescherming is altijd gratis.', 'Kosten kunnen meetellen, maar deze uitspraak verbindt breekbaarheid niet met bescherming.'],
      ['Breekbare onderdelen hebben bescherming tegen transportschade nodig.', 'Deze stap verbindt de genoemde eigenschap met de verpakkingskeuze.'],
    ], 2,
    'Hierna vul je zelf een passende verbindingsstap aan en vraag je of zij werkelijk klopt.',
  ),
  'basis-argument-of-uitleg': starter(
    'start-functie',
    'Iedereen weet dat de printer vanochtend niet werkte. Een collega zegt dat een los contact de storing veroorzaakte. De teamleider vraagt nu waarom de storing ontstond; niemand betwijfelt op dit moment dat zij plaatsvond.',
    'Welke vraag beantwoordt de collega vooral?',
    [
      ['Waarom ontstond de bekende storing?', 'Het vastgestelde probleem wordt hier verklaard met een mogelijke oorzaak.'],
      ['Moet iedereen een nieuwe printer kopen?', 'Er wordt nog geen aankoopvoorstel verdedigd.'],
      ['Heeft er wel een storing plaatsgevonden?', 'Dat wordt in deze situatie door iedereen aangenomen.'],
    ], 0,
    'Hierna bepaal je zelf wanneer dezelfde informatie een verklaring of een argument vormt.',
  ),
  'basis-verborgen-premissen': starter(
    'start-waarde',
    'Een team wil gesprekken met klanten afschermen van voorbijgangers. Een collega stelt een besloten hoek voor, omdat klanten daar minder persoonlijke informatie laten horen. Het voorstel noemt het voordeel, maar laat de afweging nog weg.',
    'Welke waarde maakt dit voordeel belangrijk?',
    [
      ['Alle gesprekken moeten zo lang mogelijk duren.', 'Dat volgt niet uit het voordeel van minder hoorbare persoonlijke informatie.'],
      ['Privacy van klanten verdient bescherming.', 'Deze waarde verklaart waarom het genoemde effect voor de keuze meetelt.'],
      ['Een besloten hoek bewijst dat iedere klant tevreden is.', 'Dat is een extra effectclaim, geen waarde die de afweging onderbouwt.'],
    ], 1,
    'Hierna reconstrueer je ook de feitelijke en normatieve bruggen die een groter voorstel nodig heeft.',
  ),
  'basis-argumentstructuur': starter(
    'start-structuur',
    'Een planner zegt dat ieder bevestigd tijdslot in het rooster verschijnt. Tijdslot J is bevestigd. Zij gebruikt beide uitspraken om te concluderen dat J in het rooster staat; het team wil weten hoe die redenen samenwerken.',
    'Wat doet de tweede uitspraak in deze redenering?',
    [
      ['Zij bewijst dat alle roosters altijd foutloos zijn.', 'De uitspraak gaat over één tijdslot en geeft die algemene garantie niet.'],
      ['Zij vervangt de algemene regel volledig.', 'Zonder de regel weet je nog niet wat bevestigd zijn betekent voor het rooster.'],
      ['Zij laat zien dat J onder de genoemde regel valt.', 'De algemene regel en het specifieke geval werken samen naar de conclusie.'],
    ], 2,
    'Hierna teken je zelf welke redenen samen, apart of via een tussenconclusie steun geven.',
  ),
  'basis-kritiek-en-herstel': starter(
    'start-kritiek',
    'Een collega stelt een beter overdrachtsformulier voor en noemt ontbrekende afspraken als reden. Een ander reageert alleen dat deze collega altijd rommelig schrijft. Het team wil de inhoud van het voorstel beoordelen en vraagt een gerichte reactie.',
    'Welke reactie gaat over de opgegeven reden?',
    [
      ['Welke afspraken ontbreken, en helpt dit formulier daarbij?', 'Dit toetst het probleem en de verbinding met het voorstel.'],
      ['Schrijft de collega echt zo rommelig?', 'Dat kan een ander onderwerp zijn, maar beoordeelt de gegeven reden niet.'],
      ['Moeten we elke suggestie van deze collega negeren?', 'Dat veralgemeniseert de persoonlijke kritiek zonder het voorstel inhoudelijk te toetsen.'],
    ], 0,
    'Hierna leg je een fout in de redenering uit en maak je een concrete reparatie.',
  ),
  'basis-voorwaarden-en-gevolgen': starter(
    'start-voorwaarden',
    'De teamafspraak zegt: een bezoeker mag alleen naar de werkvloer als de veiligheidsinstructie voltooid is. Er kunnen daarnaast andere vereisten gelden. Een collega vraagt wat deze ene regel al zegt over iemand die de instructie nog niet heeft voltooid.',
    'Wat vereist deze regel?',
    [
      ['De instructie is nodig voor toegang tot de werkvloer.', '“Alleen als” noemt een noodzakelijke voorwaarde; andere vereisten kunnen blijven gelden.'],
      ['De instructie geeft op zichzelf altijd toegang.', 'De regel noemt een vereiste, maar garandeert geen volledige toestemming.'],
      ['Toegang geeft vrijstelling van de instructie.', 'Dat keert de genoemde vereiste om en past niet bij de regel.'],
    ], 0,
    'Hierna controleer je zelf de richting van voorwaarden en test je verleidelijke omkeringen.',
  ),
  'basis-checkpoint': starter(
    'start-basis-check',
    'Een team kiest een nieuwe plek voor de gezamenlijke planning. Iemand zegt dat die plek beter bereikbaar is. Een collega vindt de kleur mooier. Voor het besluit moet duidelijk worden welk voordeel het gezamenlijke gebruik werkelijk ondersteunt.',
    'Welke reden past het duidelijkst bij gezamenlijk gebruik?',
    [
      ['De plek is voor het team beter bereikbaar.', 'Bereikbaarheid heeft een directe verbinding met het kunnen gebruiken van de planning.'],
      ['Eén collega vindt de kleur mooier.', 'Een voorkeur kan meetellen, maar onderbouwt bereikbaarheid voor het team niet.'],
      ['Het besluit moet snel worden genomen.', 'Tijdsdruk is geen bewijs dat deze plek geschikt is.'],
    ], 0,
    'Hierna pas je zonder stapsgewijze hulp meerdere basisbegrippen op nieuwe situaties toe.',
  ),
  'bachelor-persoon-en-expertise': starter(
    'start-expertise',
    'Een bedrijf vraagt advies over een elektrische installatie. De spreker is een bekende organisatiecoach, maar zijn ervaring met elektrische veiligheid is niet genoemd. Zijn bekendheid wordt als belangrijkste reden gegeven om het technische oordeel te volgen.',
    'Welke vraag is eerst relevant?',
    [
      ['Is hij bekend bij veel mensen?', 'Bekendheid is al gegeven en toont geen kennis van deze technische vraag.'],
      ['Heeft hij passende kennis van elektrische installaties?', 'Het deskundigheidsargument vraagt expertise in het relevante domein.'],
      ['Kunnen bekende mensen nooit gelijk hebben?', 'Dat is een te brede afwijzing; de vraag gaat over deze bewijsroute.'],
    ], 1,
    'Hierna weeg je expertise, exacte uitspraken, belangen en inhoudelijk bewijs afzonderlijk.',
  ),
  'bachelor-stropop-analogie': starter(
    'start-reconstructie',
    'Een collega wil meldingen tijdens één geconcentreerd werkblok dempen. Een reactie noemt dat een plan om alle klantcontact voorgoed te stoppen. Het team wil eerst vaststellen of die reactie werkelijk hetzelfde voorstel bespreekt.',
    'Wat is in de reactie veranderd?',
    [
      ['De collega heeft geen voorkeur meer.', 'De oorspronkelijke positie bevat juist een concreet beperkt voorstel.'],
      ['De reactie heeft dezelfde duur en hetzelfde bereik.', 'Eén werkblok is veranderd in voorgoed en meldingen in alle klantcontact.'],
      ['Een beperkte aanpassing is een algemeen permanent stopplan geworden.', 'De reactie vergroot het voorstel en kan daardoor een andere positie bestrijden.'],
    ], 2,
    'Hierna reconstrueer je de eerlijke positie en toets je welke overeenkomsten een analogie dragen.',
  ),
  'bachelor-dilemma-helling-cirkel': starter(
    'start-keuzes',
    'Een teamleider zegt dat het team óf elke werkdag samenkomt óf nooit meer overlegt. Een collega noemt een wekelijkse bijeenkomst met korte updates tussendoor. Het team moet bepalen of de eerste spreker werkelijk alle mogelijkheden heeft genoemd.',
    'Wat doet de collega met het keuzemenu?',
    [
      ['Zij laat een relevante derde mogelijkheid zien.', 'Het tussenvormvoorstel toont dat de twee genoemde opties niet vanzelf uitputtend zijn.'],
      ['Zij bewijst dat ieder dagelijks overleg verkeerd is.', 'Een derde optie bewijst niet dat een van de oorspronkelijke opties onjuist is.'],
      ['Zij laat zien dat er nooit besloten kan worden.', 'Meer opties vragen vergelijking, niet noodzakelijk permanent uitstel.'],
    ], 0,
    'Hierna toets je zelf keuzeruimte, voorspelde ketens en onafhankelijke rechtvaardiging.',
  ),
  'bachelor-causaliteit-statistiek': starter(
    'start-oorzaak',
    'Een team maakt na een nieuwe planning minder fouten. In dezelfde week kwamen ook minder ingewikkelde opdrachten binnen. De manager noemt alleen de planning als oorzaak; een collega wil weten welke andere verandering de cijfers kan verklaren.',
    'Welke andere verklaring moet worden meegewogen?',
    [
      ['Iedere nieuwe planning veroorzaakt altijd minder fouten.', 'Dat herhaalt een sterke oorzaakclaim en negeert de andere verandering.'],
      ['Eenvoudigere opdrachten kunnen ook minder fouten geven.', 'Dit noemt een relevante alternatieve route naar de uitkomst.'],
      ['Een gunstig resultaat bevat nooit bruikbare informatie.', 'Het resultaat kan een aanwijzing blijven, ook als de oorzaak nog onzeker is.'],
    ], 1,
    'Hierna beoordeel je zelf alternatieve verklaringen, geselecteerde cijfers en de grenzen van invoering.',
  ),
  'bachelor-geldigheid-en-tegenvoorbeelden': starter(
    'start-bereik',
    'Een leidinggevende zegt dat alle teamleden de nieuwe werkwijze begrijpen. Eén teamlid legt uit dat een stap nog onduidelijk is. De leidinggevende wil weten of dat betekent dat niemand de werkwijze begrijpt of dat alleen haar brede claim moet worden aangepast.',
    'Wat toont dit ene geval het meest direct?',
    [
      ['Niemand begrijpt de werkwijze.', 'Eén onduidelijk geval bewijst niets over alle andere teamleden.'],
      ['Iedereen begrijpt de werkwijze toch.', 'Dat houdt geen rekening met het gegeven tegengeval.'],
      ['De claim over alle teamleden is te ruim.', 'Het geval bestrijdt “alle”, maar bewijst niet automatisch “geen”.'],
    ], 2,
    'Hierna formuleer je precieze ontkenningen en bouw je tegenmodellen met ware premissen.',
  ),
  'bachelor-checkpoint': starter(
    'start-bachelor-check',
    'Een leverancier zegt dat een hulpmiddel in een rustige test goed werkte. Een team wil het tijdens drukke diensten gebruiken. De leidinggevende vraagt niet om een algemene aanval op de leverancier, maar om een inhoudelijke vraag over de overdracht.',
    'Welke vraag past bij die overdracht?',
    [
      ['Blijft de werking onder drukke omstandigheden voldoende?', 'Dit toetst een toepassingsvoorwaarde van het genoemde voordeel.'],
      ['Is de leverancier een prettig persoon?', 'Een persoonlijke indruk toetst deze werkingsvoorwaarde niet.'],
      ['Moeten we alle voordelen vooraf als onwaar behandelen?', 'Een gerichte toets begint niet met een onbewezen totale afwijzing.'],
    ], 0,
    'Hierna combineer je bronkritiek, eerlijke reconstructie en precieze logica zelfstandig.',
  ),
  'master-toulmin-bewijslast': starter(
    'start-bewijslast',
    'Een manager beweert dat een extra klantportaal wachttijd verkort. Een collega vraagt welke informatie dat ondersteunt, maar beweert niet dat het portaal wachttijd verlengt. De manager zegt dat de collega dan maar een negatief effect moet bewijzen.',
    'Welke uitspraak heeft de collega daadwerkelijk gedaan?',
    [
      ['Het portaal verlengt zeker de wachttijd.', 'Dat negatieve standpunt is niet door de collega ingenomen.'],
      ['Ik vraag om steun voor de positieve claim.', 'Een vraag naar rechtvaardiging is niet automatisch een tegengestelde effectclaim.'],
      ['Geen besluit mag ooit worden genomen.', 'Dat volgt niet uit de gerichte vraag naar bewijs.'],
    ], 1,
    'Hierna maak je zelf de rechtvaardigingsbrug en bijbehorende verplichtingen zichtbaar.',
  ),
  'master-weerlegbare-argumenten': starter(
    'start-herzien',
    'Het team verwacht dat de woensdaglevering doorgaat, omdat zij in de actuele planning staat. Later komt een bevestigd bericht dat deze levering is geannuleerd. De leidinggevende wil haar verwachting aanpassen zonder andere leveringen automatisch af te schrijven.',
    'Wat vraagt deze nieuwe informatie?',
    [
      ['Alle leveringen zijn voortaan onmogelijk.', 'Het bericht betreft alleen de genoemde woensdaglevering.'],
      ['De oude verwachting mag nooit veranderen.', 'De actuele annulering raakt de steun voor die verwachting.'],
      ['Herzie de verwachting over deze levering.', 'De relevante nieuwe informatie beperkt precies deze gevolgtrekking.'],
    ], 2,
    'Hierna bepaal je zelf of een bezwaar een feit, een conclusie of de verbindingsstap raakt.',
  ),
  'master-belangen-en-besluiten': starter(
    'start-belangen',
    'Twee collega’s accepteren dat een nieuw rooster goedkoper is. De één vindt de besparing het belangrijkst, de ander wil meer vrijheid om diensten te ruilen. Zij gebruiken dezelfde cijfers, maar komen tot een andere voorkeur voor het besluit.',
    'Waar zit hun verschil hier vooral?',
    [
      ['In de weging van kosten en vrijheid.', 'De feiten zijn gedeeld; de collega’s geven waarden verschillend gewicht.'],
      ['In het bestaan van het kostenverschil.', 'Volgens de situatie accepteren beiden die informatie.'],
      ['In de noodzaak om elkaar persoonlijk af te wijzen.', 'Een verschil in waarden maakt persoonlijke afwijzing niet noodzakelijk.'],
    ], 0,
    'Hierna bouw je een voorstel dat de sterkste tegenwerping en de verdeling van lasten verwerkt.',
  ),
  'master-bayes-basisfrequentie': starter(
    'start-kans',
    'Een onderdeel krijgt een waarschuwingssignaal. Het signaal komt soms ook bij goede onderdelen voor. De manager wil niet alleen weten hoe vaak defecten een waarschuwing geven, maar hoeveel van de gewaarschuwde onderdelen werkelijk defect zijn.',
    'Welke groep hoort bij haar vraag?',
    [
      ['Alle onderdelen die vooraf defect zijn.', 'Die groep beantwoordt hoe vaak een defect een waarschuwing geeft.'],
      ['Alle onderdelen met een waarschuwingssignaal.', 'Binnen deze groep wil zij het aandeel werkelijk defecte onderdelen weten.'],
      ['Alle onderdelen zonder waarschuwing.', 'Dat is een andere uitkomstgroep dan de manager vraagt.'],
    ], 1,
    'Hierna reken je zelf met aantallen en leg je kans, bewijs en een handelingsbesluit apart uit.',
  ),
  'master-sterke-redeneringen': starter(
    'start-keten',
    'Een voorstel past binnen het budget. De afspraken vereisen ook veilige uitvoering en passende ondersteuning voor medewerkers. Een collega zegt dat het passende budget al bewijst dat het voorstel volledig goedgekeurd kan worden; het team controleert de overige voorwaarden nog.',
    'Welke stap ontbreekt nog?',
    [
      ['De andere genoemde voorwaarden beoordelen.', 'Eén vervulde vereiste is nog geen complete rechtvaardiging.'],
      ['Hetzelfde budgetbedrag nog eens herhalen.', 'Herhaling levert geen informatie over veiligheid en ondersteuning.'],
      ['Elke andere voorwaarde als onbelangrijk verklaren.', 'Dat wijkt zonder rechtvaardiging af van de gegeven afspraken.'],
    ], 0,
    'Hierna controleer je de hele redeneerketen en verdedig je zelf een begrensde beleidsconclusie.',
  ),
  'master-checkpoint': starter(
    'start-master-check',
    'Een teamleider kiest een omkeerbare verandering met een verwacht voordeel. Er is nog onzekerheid en sommige collega’s verwachten extra belasting. Zij wil het besluit uitleggen en aangeven wanneer aanpassen nodig is, zodat het team relevante signalen kan terugmelden.',
    'Welke toevoeging maakt het besluit controleerbaarder?',
    [
      ['Geen bezwaar meer toelaten na het besluit.', 'Dat sluit relevante nieuwe informatie juist af.'],
      ['Afspreken bij welke gevolgen de keuze wordt herzien.', 'Een concrete herzieningsvoorwaarde verbindt het besluit aan toetsbare gevolgen.'],
      ['Iedere toekomstige verbetering aan de leider toeschrijven.', 'Dat levert geen eerlijke maatstaf voor de keuze op.'],
    ], 1,
    'Hierna verantwoord je zelfstandig claims, voorwaarden, tegenargumenten en besluiten in nieuwe gevallen.',
  ),
};
