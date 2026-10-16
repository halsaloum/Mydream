# Herwerking: woord, zin, alinea

## Afbakening

De gebruikersvraag is een grondige aanpassing van de bestaande taalapp, met uitzondering van argumentatie. De nieuwe bouwbrief is gebruikt als inhoudelijk en didactisch referentiekader. De opdrachten die in de pdf aan een bouwer gericht zijn, zijn geen afzonderlijke autorisatie voor publicatie, externe accounts of wijzigingen aan de beschermde cursus. Er is lokaal in de bestaande checkout gewerkt.

De 58 bestaande woord- en zinslessen behouden hun stabiele identifiers en opgeslagen voortgang. Ze gebruiken nu dezelfde herziene lesflow. Tien nieuwe alinealessen vullen de leerlijn aan. Argumentatie en drogredenen blijven hun eigen cursus, vormgeving, inhoud, routes en opslag houden.

## Verandering in het leren

- De navigatie groepeert de zeven inhoudelijke onderdelen in Woord, Zin en Alinea. Zoekopdracht, niveau, onderdeel en voltooiingsfilter zijn in de URL te bewaren.
- Bij de theorie schrijft de lerende eerst een observatie of voorspelling bij de voorbeelden. Pas daarna verschijnt de uitleg. Dit is opgeslagen zelfreflectie, geen automatisch beoordeelde taalproef.
- Een fout antwoord geeft eerst de bestaande, vraaggebonden aanwijzing. Opnieuw proberen is mogelijk. De eerste poging en de latere correctie blijven afzonderlijke gegevens. Waarom? bevat uitleg en de bronnen van de les.
- Gemiste oefenvragen komen vóór het eigen schrijfwerk opnieuw terug. Daarnaast bestaat een blijvende foutenwachtrij voor latere rondes, ook bij onvoltooide lessen.
- Afronding en onafhankelijke productie zijn verschillende indicatoren. Alleen een juist eerste antwoord op een typ- of bouwvraag zonder geopende aanwijzing levert een productiedag op. De dagen worden volgens Europe/Amsterdam geteld. Twee antwoorden op dezelfde dag tellen als één dag.
- De oude herhaalvragen blijven beschikbaar. Voor 33 bestaande lessen zonder typ- of bouwvraag is een extra, oorspronkelijk geschreven productieopdracht toegevoegd. Iedere les heeft daardoor ten minste één productieve herhaalvraag.
- Export leest de volledige gevalideerde Ontleed-datastructuur. Daardoor gaan ook nieuwe correcties, voorspellingen, fouten en de schrijfateliertekst mee. Oudere reservekopieën krijgen lege standaardvelden; bestaande argumentatie-export blijft intact.

## Componenten en bewerkbare werkvormen

| Component | Gebruik | Ontwerpkeuze |
| --- | --- | --- |
| Gerichte topnavigatie | Leren, oefenen en bibliotheek; overige bestemmingen onder Meer | Eén volgende les centraal; geen dashboardzijbalk |
| Leerpad en niveaukeuze | Woord, Zin, Alinea | Actuele les met hervatten, rustige volgende stappen en vrij toegankelijke onderdelen |
| Ontdekvraag | Lesstart | Eerst kiezen, daarna een vraaggebonden proef; korte invulkeuzes verschijnen in de zin |
| Voorspelling | Theorievoorbeelden | Eigen observatie vastleggen vóór de uitgewerkte analyse |
| Vraag en feedback | Oefenen en ophalen | Eerste poging, nieuwe poging, aanwijzing en Waarom? apart |
| Foutenronde | Herhalen | Maximaal acht vragen, hervatbaar, op meerdere dagen oefenen |
| Zinsschema | Taalwerkplaats | Woordgroepen met knoppen tussen vijf velden verplaatsen; toetsenbordbediening |
| Paradigma | Taalwerkplaats | Twaalf invulcellen; gelijke juiste vormen krijgen dezelfde kleur |
| Verzameling | Taalwerkplaats | Zes dossiers schakelen; alle/sommige/geen/niet alle zelf beoordelen |
| Verwijzingskaart | Taalwerkplaats | Verwijzing koppelen en dubbelzinnigheid testen |
| Schrijfatelier | Eigen tekst | Woorden markeren als onderzoeksvraag, kernzin kiezen en zelf een tang afbakenen |

Na de inhoudelijke herwerking vroeg de gebruiker expliciet om een begeleide leerervaring via Mobbin en Figma, met Uber Base, Brilliant en Duolingo als referenties. Daarvoor zijn nieuwe referenties onderzocht en een nieuwe Figma-pagina gemaakt. De oude Figma-pagina is bewaard. Zie de [actuele ontwerpverantwoording](learning-design-reference.md). De lokale implementatie heeft een gericht leerpad, topnavigatie en één centrale lesactie.

## Curriculum en bronnen

De automatisch uit de actuele cursus gegenereerde [curriculumkaart](curriculum-map.json) bevat per geïmplementeerde les het leerdoel, de bronnen, oefenvormen, voorbeeldproeven en eigen schrijfopdracht. Dit is een kaart van de werkelijk aanwezige lessen, geen claim dat elk afzonderlijk doel van de nieuwe bouwbrief al volledig wordt gedekt.

De [alineanotities](alinea-reading.md) verantwoorden de aanvullende bronlezing. De oorspronkelijke boeken en hun eerdere leesdekking staan in [de reconstructieverantwoording](README.md). Voor deze wijziging zijn die boeken niet opnieuw integraal gelezen. De twee aangeleverde ontwerp-pdf’s zijn als tekst bekeken; geselecteerde pagina’s zijn gerenderd, waaronder het schema met de vijf voorgestelde fasen en eindproeven.

Aanvullende bronnen bij de werkplaats, daadwerkelijk geopend op 15 oktober 2026:

- [ANS 21.1.1.2, de overige zinsplaatsen](https://e-ans.ivdnt.org/topics/pid/ans21010102lingtopic): grondslag voor het vijfveldenmodel. De oefening beperkt zich expliciet tot een neutrale mededelende hoofdzin met zes vaste bouwstukken; zij is geen algemene grammaticale parser.
- [ANW, werken](https://anw.ivdnt.org/article/werken): vormen in het paradigma. Het raster oefent de hedendaagse regelmatige vormen, geen uitputtende historische variantenlijst.
- [Onze Taal, voornaamwoord](https://onzetaal.nl/taalloket/voornaamwoord): verwijzing binnen en buiten de tekst.
- [Onze Taal, tangconstructie](https://onzetaal.nl/taalloket/tangconstructie): afstand, leeslast en verschillende revisiemogelijkheden. De drempel van twaalf woorden is een zichtbare oefenrichtlijn, geen norm uit deze bron.
- Kroeger, hoofdstukken 8 en 14: letterlijke kwantificatie en implicatuur; de eerdere bronlezing draagt deze begrippen. De dossiers en opdrachtteksten zijn nieuw geschreven voorbeelden.

## Bewuste grenzen en open punten

1. De bouwbrief stelt vijf harde poorten en aparte eindproeven voor. Deze herwerking biedt een zichtbare opbouw en productiedagen, maar sluit bestaande vrij toegankelijke lessen niet achteraf af. Er zijn geen vijf nieuwe gevalideerde eindtoetsen gebouwd. De zinmeesterproef en nieuwe alinearevisie blijven begeleide toepassingen.
2. Productiedagen tellen juiste eerste typ- en bouwantwoorden zonder aanwijzing. Dit is beperkt bewijs bij de aanwezige vragen: sommige typvragen geven termen waaruit gekozen kan worden, en sommige lessen hebben één productieve herhaalvraag, zodat een latere dag dezelfde opgave kan terugkomen. Dit is geen volledige toetsing van ieder leerdoel, vrije taalproductie of duurzame beheersing.
3. De schrijfwerkplaats markeert woorden uit expliciete zoeklijsten en telt tekstsegmenten. De gebruiker kiest zelf de kernzin en de grenzen van een werkwoordstang. Automatische ontleding, algemene grammaticale correctie en inhoudelijke beoordeling van vrije tekst ontbreken bewust.
4. Vrije schrijftaken en voorspellingen worden door de lerende aan criteria getoetst. Exact beoordeelde korte antwoorden bevatten toegelaten varianten, maar vormen geen algemene taalbeoordelaar. Na een misser kan de oplossing worden onderzocht zonder het eerste antwoord te overschrijven.
5. De interactieve werkplaats bevat vijf concrete modellen. Een algemene boombouwer, tijdlijnbouwer, morfeemsegmentatie en een volledige vijfnotatievergelijker zijn nog geen onderdelen van deze herwerking.
6. Alle nieuwe voorbeelden zijn oorspronkelijk geschreven. Er is geen nieuwe corpuscollectie geïmporteerd, geen effectstudie uitgevoerd en geen claim op volledige dekking van alle universitaire deelonderwerpen toegevoegd.

## Verificatie

De actuele controle-uitkomsten staan in de [eindcontrole](validation.md). De [behoudgrens](preservation-boundaries.md) blijft leidend: 107 beschermde bestanden plus volledige snapshots van 69 hedendaagse en 16 oudere argumentatielessen.
