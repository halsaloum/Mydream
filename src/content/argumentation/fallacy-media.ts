import type { ArgumentMedia } from './media';

// Primary provider pages and official Wireless Philosophy oEmbed metadata verified 2026-10-13.
// Videos that cannot be verified for embedding retain a working provider-page link.
export const fallacyVideos: ArgumentMedia[] = [
  {
    id: 'wiphi-ad-hominem-intro', title: 'Persoonlijke aanvallen: zes verschillende patronen',
    provider: 'Wireless Philosophy · Julianne Chung', kind: 'video', level: 'bachelor', language: 'Engels',
    url: 'https://www.youtube.com/watch?v=wnbK76m691I', youtubeId: 'wnbK76m691I',
    description: 'Julianne Chung laat zes vormen van persoonlijke kritiek zien, waaronder belediging, belangenkritiek, tu quoque, herkomst en associatie. Vergelijk vooral welke stap de spreker gebruikt om een standpunt af te wijzen.',
    watchFor: 'Pauzeer vóór de diagnose. Wordt de kwaliteit van het argument getoetst, of wordt een persoonskenmerk gebruikt om die toets over te slaan?',
    question: 'Een collega zegt dat een transparante begroting onjuist moet zijn omdat de maker eerder ruzie had met het team. Welke conclusie volgt daar nog niet uit, en welke gerichte controle zou je wél uitvoeren?',
  },
  {
    id: 'wiphi-compositie', title: 'Compositie: dragen eigenschappen van delen over?',
    provider: 'Wireless Philosophy · Paul Henne', kind: 'video', level: 'bachelor', language: 'Engels',
    url: 'https://www.youtube.com/watch?v=JELm6peL_sI', youtubeId: 'JELm6peL_sI',
    description: 'Paul Henne bespreekt de sprong van onderdelen naar het geheel. Dezelfde overdracht kan bij de ene eigenschap werken en bij een andere falen. Zoek de rechtvaardiging voor precies de eigenschap die wordt overgedragen.',
    watchFor: 'Kies één fout voorbeeld en één redelijk voorbeeld. Wat verandert aan de eigenschap, de combinatie van delen of de benodigde verbinding?',
    question: 'Alle modules van een systeem zijn afzonderlijk snel getest. Mag je concluderen dat het gecombineerde systeem onder belasting snel blijft? Benoem welke interactie of gezamenlijke beperking je nog moet controleren.',
  },
  {
    id: 'wiphi-divisie', title: 'Divisie: wat weet je over één onderdeel?',
    provider: 'Wireless Philosophy · Paul Henne', kind: 'video', level: 'bachelor', language: 'Engels',
    url: 'https://www.youtube.com/watch?v=uEhRqiSA4ko', youtubeId: 'uEhRqiSA4ko',
    description: 'Paul Henne onderzoekt de omgekeerde sprong: van een eigenschap van het geheel naar de onderdelen. Let op het verschil tussen een uitspraak over een organisatie en een uitspraak over ieder afzonderlijk lid.',
    watchFor: 'Welke eigenschap wordt verdeeld over de onderdelen? Probeer een tegenvoorbeeld waarin het geheel de eigenschap heeft en één deel haar mist.',
    question: 'Een afdeling haalt haar gezamenlijke doelstelling. Een manager concludeert dat iedere medewerker zijn individuele doel heeft gehaald. Welke verschillende verdelingen blijven mogelijk en welke gegevens ontbreken?',
  },
  {
    id: 'khan-cirkel', title: 'Cirkelredenering: wordt het betwiste al aangenomen?',
    provider: 'Khan Academy · Wireless Philosophy · Matthew C. Harris', kind: 'video', level: 'bachelor', language: 'Engels', minutes: 4,
    url: 'https://www.khanacademy.org/partner-content/wi-phi/wiphi-critical-thinking/wiphi-fallacies/v/begging-the-question',
    description: 'Matthew Harris bespreekt begging the question en cirkelredenering. Vraag of de aangevoerde reden onafhankelijk aanvaardbaar is voor iemand die de conclusie nog betwijfelt.',
    watchFor: 'Volg de rechtvaardiging terug. Krijg je een nieuwe grond, of kom je via andere woorden weer bij hetzelfde betwiste standpunt uit?',
    question: '“Dit beoordelingssysteem is eerlijk, want het geeft ieder de score die hij verdient. Die verdiende score is de score die het systeem geeft.” Welke onafhankelijke maatstaf zou deze kring kunnen doorbreken?',
  },
  {
    id: 'khan-populariteit', title: 'Populariteit: wat ondersteunt de meerderheid precies?',
    provider: 'Khan Academy · Wireless Philosophy · Jordan MacKenzie', kind: 'video', level: 'bachelor', language: 'Engels',
    url: 'https://www.khanacademy.org/partner-content/wi-phi/wiphi-critical-thinking/wiphi-fallacies/v/appeal-to-the-people',
    description: 'Jordan MacKenzie legt het beroep op de meerderheid uit. De video bespreekt ook omstandigheden waarin collectieve opvattingen wél relevant kunnen zijn, bijvoorbeeld bij een gebruiksconventie.',
    watchFor: 'Welke claim wordt verdedigd: een feit, een voorkeur of een conventie? Dat onderscheid bepaalt wat de meerderheid als reden kan bijdragen.',
    question: 'Bijna iedereen in het team verkiest een vergadertijd. Ondersteunt dat dezelfde conclusie als wanneer iedereen een onbewezen veiligheidsclaim gelooft? Formuleer voor beide gevallen wat de meerderheid wel en niet draagt.',
  },
  {
    id: 'khan-post-hoc', title: 'Na elkaar betekent nog niet: door elkaar',
    provider: 'Khan Academy · Wireless Philosophy · Paul Henne', kind: 'video', level: 'bachelor', language: 'Engels',
    url: 'https://www.khanacademy.org/college-careers-more/critical-thinking-metacognition/x93d32ddf51f9fd5b%3Acritical-thinking/x93d32ddf51f9fd5b%3Auntitled-25/v/post-hoc',
    description: 'Paul Henne bespreekt post hoc ergo propter hoc: een volgorde wordt behandeld als voldoende bewijs voor een oorzaak. Een extra causale aanname kan de argumentvorm veranderen, maar moet zelf nog worden verantwoord.',
    watchFor: 'Welke alternatieve verklaring past ook bij de volgorde? Benoem welk extra gegeven één verklaring beter zou ondersteunen dan de andere.',
    question: 'Na een nieuwe planning daalt het aantal te late leveringen; tegelijk dalen het ordervolume en de routeafstand. Welke conclusie kun je nu al trekken, en hoe zou je de bijdrage van de planning gericht toetsen?',
  },
  {
    id: 'khan-gevolg-bevestigen', title: 'Het gevolg bevestigen: zoek een tweede route',
    provider: 'Khan Academy · Wireless Philosophy · Matthew C. Harris', kind: 'video', level: 'master', language: 'Engels',
    url: 'https://www.khanacademy.org/college-careers-more/critical-thinking-metacognition/x93d32ddf51f9fd5b%3Acritical-thinking/x93d32ddf51f9fd5b%3Auntitled-25/v/affirming-the-consequent',
    description: 'Matthew Harris onderzoekt de foutvorm “als P dan Q; Q; dus P”. Een gevolg kan langs meer dan één route ontstaan. Een mogelijke verklaring is daardoor nog geen noodzakelijke conclusie.',
    watchFor: 'Maak zelf een geval waarin de voorwaardelijke regel en het gevolg kloppen, terwijl de voorgestelde oorzaak ontbreekt.',
    question: 'Als een account geblokkeerd is, lukt inloggen niet. Inloggen lukt niet, dus het account is geblokkeerd. Welke tweede verklaring laat zien dat deze gevolgtrekking geen deductieve garantie geeft?',
  },
  {
    id: 'khan-antecedent-ontkennen', title: 'De voorwaarde ontkennen: wat blijft mogelijk?',
    provider: 'Khan Academy · Wireless Philosophy · Matthew C. Harris', kind: 'video', level: 'master', language: 'Engels', minutes: 4,
    url: 'https://www.khanacademy.org/partner-content/wi-phi/wiphi-critical-thinking/wiphi-fallacies/v/denying-the-antecedent',
    description: 'Matthew Harris bespreekt “als P dan Q; niet P; dus niet Q”. Een voldoende voorwaarde is nog geen noodzakelijke voorwaarde. Het gevolg kan via een andere voldoende voorwaarde tot stand komen.',
    watchFor: 'Vergelijk de foutvorm met modus tollens. Welke ontkenning is gegeven, en welke richting rechtvaardigt de oorspronkelijke regel?',
    question: 'Als een pakket verzekerd is, krijgt het een volgcode. Dit pakket is niet verzekerd, dus het heeft geen volgcode. Bedenk een andere verzendwijze die dezelfde volgcode geeft en leg uit wat daarmee wordt weerlegd.',
  },
];

/** Supplemental media follow the exact reasoning pattern, rather than repeating long general lectures. */
export const targetedFallacyMedia: Record<string, string[]> = {
  stropop: ['wiphi-stropop'],
  'ad-hominem-belediging': ['wiphi-ad-hominem-intro'],
  'ad-hominem-belang': ['wiphi-ad-hominem-intro'],
  'tu-quoque': ['wiphi-ad-hominem-intro'],
  'genetische-drogreden': ['wiphi-ad-hominem-intro'],
  'schuld-door-associatie': ['wiphi-ad-hominem-intro'],
  cirkelredenering: ['khan-cirkel'], populariteit: ['khan-populariteit'],
  'post-hoc': ['khan-post-hoc'], 'samenhang-oorzaak': ['wiphi-samenhang-en-oorzaak'],
  compositie: ['wiphi-compositie'], divisie: ['wiphi-divisie'],
  'gevolg-bevestigen': ['khan-gevolg-bevestigen'], 'antecedent-ontkennen': ['khan-antecedent-ontkennen'],
  'basisfrequentie-negeren': ['wiphi-basisfrequentie'],
};
