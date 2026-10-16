# Optionele lesvideo’s

Gecontroleerd op 15 oktober 2026. De catalogus staat in `src/content/ontleed/media.ts` en bevat negen bestaande Nederlandstalige YouTube-video’s. De expliciete koppelingen beperken iedere les tot maximaal twee video’s. Lessen zonder passende selectie krijgen geen videoblok. Argumentatie is niet gekoppeld of gewijzigd.

## Controle en grenzen

- Exacte titel, maker en video-ID zijn gecontroleerd in de openbare YouTube-videopagina. De inhoudelijke selectie berust op de beschrijving van de maker, naast de inhoud van de bestaande Ontleed-les.
- Voor alle negen geselecteerde video’s leverde de YouTube-videopagina `playabilityStatus.status: OK` en `playableInEmbed: true`. Dit is een technische momentopname, geen garantie voor iedere regio, browser of latere wijziging.
- Voor de eerste zeven vond ook een live controle via YouTube oEmbed plaats: `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VIDEO_ID&format=json`. YouTube retourneerde de titel, maker en een iframe met hetzelfde video-ID. De twee later geselecteerde video’s zijn via de videopagina gecontroleerd.
- Er is geen volledige audiovisuele kwaliteitsbeoordeling gedaan en er worden geen bekeken speelduur of verzonnen tijdcodes vermeld. Openbare Nederlandse ondertiteling werd voor drie kandidaten opgevraagd, maar de endpoint gaf een lege respons; er zijn daarom geen inhoudsclaims op basis van die mislukte transcriptcontrole toegevoegd.
- Beschrijvingen en kijkvragen in de app zijn oorspronkelijk geschreven. De kijkvragen laten de leerling de eigen les toepassen; ze zijn geen citaten of beloften dat precies dat voorbeeld in de video voorkomt.
- Een video is verdieping of herhaling. Zij vervangt geen lestekst, oefening, feedback of beheersingscontrole. Het bekijken beïnvloedt de voortgang niet.
- Alleen YouTube-links en de officiële ingesloten speler worden gebruikt. Geen videobestanden, thumbnails of ondertitels zijn als app-assets gedownload.

## Selectie en leskoppelingen

| Video en maker | Bewijs en inhoudelijke aansluiting | Les-ID’s |
| --- | --- | --- |
| [Inleiding in de Morfologie (2/10): Woordvorming](https://www.youtube.com/watch?v=WV7uaqUGuzI) — Marc van Oostendorp | Makerbeschrijving: onderdeel van een inleiding in Nederlandse woordstructuur, met de vraag welke woorden een basis voor nieuwe woorden kunnen vormen. Geselecteerd als verdieping bij basiskeuze en mogelijkheden van woordvorming. | `woordbouw-bases-affixen`, `woordbouw-productiviteit` |
| [Woordsoorten: uitleg van lidwoord, bijvoeglijk naamwoord, zelfstandig naamwoord](https://www.youtube.com/watch?v=b4GZ1yaj5JA) — VantaalnaarNederlands | Makerbeschrijving noemt precies deze drie woordsoorten en de bijbehorende uitlegserie. Gekoppeld aan woordsoorten; de video is geen vervanging voor de structurele analyse van een naamwoordgroep. | `basis-woordsoorten` |
| [onderwerp en persoonsvorm](https://www.youtube.com/watch?v=5A3Efwb9xqE) — de buro-juf | Makerbeschrijving vermeldt uitleg over beide begrippen voor leerlingen. Basale herhaling; de app blijft het verschil tussen betekenisrol en grammaticale functie en het werken per deelzin zelf behandelen. | `zinsdelen-persoonsvorm`, `zinsdelen-onderwerp` |
| [Formuleerfouten: incongruentie (geen congruentie)](https://www.youtube.com/watch?v=1OQwWpUH240) — Arnoud Kuijpers | Makerbeschrijving bevestigt incongruentie als onderwerp. Past bij het specifieke lesdoel van overeenkomst tussen het volledige onderwerp en de persoonsvorm. De app-eigen kijkvraag verbindt dit aan de buitenste kern van ‘de doos met de nieuwe labels’; er wordt niet beweerd dat die voorbeeldzin in de video staat. | `zinsdelen-naamwoordgroep`, `zinsdelen-onderwerp` |
| [Woordvolgorde 1](https://www.youtube.com/watch?v=nKhbGj7u3jk) — Lest Best | Makerbeschrijving noemt de plaats van onderwerp en werkwoorden in eenvoudige zinnen. Geselecteerd als herhaling van de hoofdzin; de app behandelt de V2-regel en groepsgrenzen preciezer. | `zinsbouw-v2`, `zinsbouw-inversie` |
| [Grammatica samengestelde zinnen - hoofdzinnen & bijzinnen](https://www.youtube.com/watch?v=l_InNYyGmwk) — Ruud Hermans | Makerbeschrijving noemt samengestelde zinnen en het onderscheiden van hoofd- en bijzinnen. De kijkvraag richt zich op hun verschillende woordvolgorde. | `zinsbouw-nevenschikking`, `zinsbouw-bijzinnen` |
| [Homoniemen, homofonen, synoniemen](https://www.youtube.com/watch?v=aixN2-VdGXY) — Kenneth Beyers | Makerbeschrijving bevestigt de drie betekenis-/vormrelaties en een doelgroep in de eerste graad van het secundair onderwijs. De opdrachtvermelding naar een lector wordt niet opgevat als een institutioneel keurmerk. | `betekenis-relaties` |
| [Lezen deel 5: Tekstopbouw: Alinea en Tekstverbanden (met signaalwoorden)](https://www.youtube.com/watch?v=4F81-tWCfJw) — Arnoud Kuijpers | Makerbeschrijving bevestigt uitleg over alinea’s en de samenhang van tekstdelen. De kijkvraag vraagt de hoofdgedachte en bijdragen van zinnen te onderzoeken; zij legt geen universele regel op over de plaats van een kernzin. | `alinea-kernzin` |
| [Tekstverbanden & signaalwoorden](https://www.youtube.com/watch?v=i34z5g3DQsE) — Ruud Hermans | Makerbeschrijving noemt het herkennen van tekstverbanden en bevat voorbeelden van verschillende relaties. De app-vraag laat de leerling ook onderzoeken of de betekenis zonder expliciet signaalwoord herkenbaar blijft. | `alinea-relaties`, `alinea-overgang` |

## Aanvullende vindplaatsen

De primaire verificatie is steeds de gekoppelde YouTube-pagina. Twee publieke onderwijsverwijzingen hielpen de exacte video-ID’s vinden:

- [Scholieren.com: samengestelde zinnen](https://video.scholieren.com/video/grammatica-samengestelde-zinnen-hoofdzinnen-bijzinnen) verwijst in het openbare videoblok naar `l_InNYyGmwk`.
- [Scholieren.com: incongruentie](https://video.scholieren.com/serie/formuleerfouten/video/formuleerfouten-incongruentie) verwijst naar `1OQwWpUH240`.

Een andere kandidaat, [Congruentie en Incongruentie — Module Nederlands 2F 3F](https://www.youtube.com/watch?v=Oeo3LGRRsBM), is bewust niet opgenomen: de videopagina meldde `playableInEmbed: false`. Een generieke woordsoortvideo is ook niet als uitleg van de volledige naamwoordgroep gekoppeld.

## Onderhoud

Bij vervangen of toevoegen: controleer de openbare makerbeschrijving, exacte metadata en embedbaarheid opnieuw, voeg een inhoudelijk passende leskoppeling toe en houd het maximum van twee per les aan. Gebruik alleen een echte YouTube-ID van elf tekens. Een onbekende les-ID retourneert een lege lijst. Toon altijd ook de gewone YouTube-link, omdat een externe speler later onbeschikbaar kan raken.
