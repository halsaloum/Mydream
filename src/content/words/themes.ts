import type { Accent } from '../accent';

/**
 * De thema's van de woordenbank. "Vak" is leiderschap op een Nederlandse werkvloer, "algemeen"
 * zijn de woorden die je overal nodig hebt. Elke dag komen er woorden uit één vakthema en één
 * algemeen thema; het thema van de dag levert ook de situatie voor de schrijfopdracht aan het eind.
 */

export const THEME_GROUPS = ['vak', 'algemeen'] as const;
export type ThemeGroup = (typeof THEME_GROUPS)[number];

export const THEME_GROUP_LABELS: Record<ThemeGroup, { title: string; text: string }> = {
  vak: { title: 'Leiderschap', text: 'De woorden van je vak: leidinggeven, besluiten, gesprekken, verandering.' },
  algemeen: { title: 'Algemeen Nederlands', text: 'Woorden die je elke dag nodig hebt, in gesprekken en in teksten.' },
};

export type Theme = {
  id: string;
  group: ThemeGroup;
  name: string;
  /** Eén zin over waar het thema over gaat. */
  text: string;
  accent: Accent;
  /** Situaties voor de schrijfopdracht aan het eind van een dag. */
  situations: string[];
};

export const THEMES: readonly Theme[] = [
  {
    id: 'leidinggeven',
    group: 'vak',
    name: 'Leidinggeven',
    text: 'Je rol als leider: sturen, delegeren, verantwoordelijkheid en gezag.',
    accent: 'green',
    situations: [
      'Je bent net teamleider geworden. Schrijf een kort bericht aan je nieuwe team over hoe jij leiding wilt geven.',
      'Een teamlid vraagt waarom jij een taak niet zelf doet. Leg in een paar zinnen uit hoe jij taken verdeelt.',
      'Je manager vraagt wat je dit jaar als leider wilt verbeteren. Schrijf je antwoord.',
    ],
  },
  {
    id: 'visie',
    group: 'vak',
    name: 'Visie en strategie',
    text: 'Waar je naartoe wilt: doelen, koers, keuzes voor de lange termijn.',
    accent: 'blue',
    situations: [
      'Je presenteert morgen de plannen voor volgend jaar. Schrijf de openingsalinea van je verhaal.',
      'Een nieuwe collega vraagt waar jullie afdeling naartoe wil. Leg het kort uit.',
      'Schrijf een korte mail aan je team over de drie belangrijkste doelen van dit kwartaal.',
    ],
  },
  {
    id: 'besluiten',
    group: 'vak',
    name: 'Besluiten nemen',
    text: 'Afwegen, kiezen en je keuze uitleggen, ook als niet iedereen het eens is.',
    accent: 'orange',
    situations: [
      'Je hebt een lastig besluit genomen over de planning. Schrijf een bericht aan je team waarin je het besluit uitlegt.',
      'Twee teamleden willen elk iets anders. Schrijf hoe je tot een keuze komt.',
      'Je directeur vraagt waarom je voor de duurdere oplossing kiest. Schrijf je onderbouwing.',
    ],
  },
  {
    id: 'vergaderen',
    group: 'vak',
    name: 'Vergaderen',
    text: 'Overleg voorbereiden, leiden en afronden met heldere afspraken.',
    accent: 'teal',
    situations: [
      'Schrijf een uitnodiging voor het teamoverleg van volgende week, met de belangrijkste punten.',
      'Het overleg liep uit en er is niets besloten. Schrijf een bericht met wat er nu moet gebeuren.',
      'Vat in een paar zinnen samen wat er in het overleg van vandaag is afgesproken.',
    ],
  },
  {
    id: 'feedback',
    group: 'vak',
    name: 'Feedback en gesprekken',
    text: 'Complimenten, kritiek en lastige gesprekken: eerlijk en respectvol.',
    accent: 'pink',
    situations: [
      'Een teamlid komt steeds te laat op het overleg. Schrijf wat je in het gesprek zegt.',
      'Een collega heeft een project heel goed afgerond. Schrijf een bericht met concrete feedback.',
      'Bereid het jaargesprek met een teamlid voor: schrijf wat je wilt bespreken.',
    ],
  },
  {
    id: 'motiveren',
    group: 'vak',
    name: 'Motiveren en ontwikkelen',
    text: 'Mensen laten groeien: coachen, waarderen en ruimte geven.',
    accent: 'yellow',
    situations: [
      'Een teamlid heeft weinig zin meer in zijn werk. Schrijf hoe je het gesprek begint.',
      'Een jonge collega wil meer verantwoordelijkheid. Schrijf je reactie.',
      'Schrijf een kort bericht waarin je het team bedankt voor een zware periode.',
    ],
  },
  {
    id: 'plannen',
    group: 'vak',
    name: 'Plannen en organiseren',
    text: 'Planning, deadlines en capaciteit: zorgen dat het werk af komt.',
    accent: 'navy',
    situations: [
      'Het project loopt twee weken achter. Schrijf een bericht aan je manager over de stand van zaken.',
      'Je team heeft te veel werk. Schrijf hoe je de taken anders gaat verdelen.',
      'Schrijf de planning voor de komende maand in een paar zinnen.',
    ],
  },
  {
    id: 'conflict',
    group: 'vak',
    name: 'Conflict en onderhandelen',
    text: 'Spanning, weerstand en tegengestelde belangen: samen tot een oplossing komen.',
    accent: 'red',
    situations: [
      'Twee teamleden hebben ruzie over een taak. Schrijf hoe je het gesprek met hen allebei begint.',
      'Een andere afdeling wil jouw mensen lenen. Schrijf je voorstel voor een afspraak.',
      'Een klant is boos over een vertraging. Schrijf je antwoord.',
    ],
  },
  {
    id: 'verandering',
    group: 'vak',
    name: 'Verandering',
    text: 'Nieuwe werkwijzen invoeren en mensen meenemen in de verandering.',
    accent: 'purple',
    situations: [
      'Jullie gaan met een nieuw systeem werken. Schrijf een bericht aan het team over wat er verandert.',
      'Een paar collega’s zijn tegen de nieuwe werkwijze. Schrijf hoe je met hun bezwaren omgaat.',
      'De verandering is een half jaar oud. Schrijf een korte terugblik.',
    ],
  },
  {
    id: 'overtuigen',
    group: 'vak',
    name: 'Communiceren en overtuigen',
    text: 'Je boodschap helder brengen en anderen meekrijgen.',
    accent: 'blue',
    situations: [
      'Je wilt budget voor een nieuw project. Schrijf je pitch in een paar zinnen.',
      'Je team begrijpt een besluit van de directie niet. Schrijf hoe je het uitlegt.',
      'Schrijf het slot van een presentatie waarmee je het publiek wilt overtuigen.',
    ],
  },
  {
    id: 'team',
    group: 'vak',
    name: 'Team en samenwerking',
    text: 'Een team dat elkaar vertrouwt, aanvult en samen verantwoordelijk is.',
    accent: 'green',
    situations: [
      'Er komt een nieuw teamlid. Schrijf een welkomstbericht aan het team.',
      'De samenwerking tussen twee afdelingen loopt stroef. Schrijf een voorstel om dat te verbeteren.',
      'Schrijf wat jij van je teamleden verwacht als het druk wordt.',
    ],
  },
  {
    id: 'resultaat',
    group: 'vak',
    name: 'Resultaat en kwaliteit',
    text: 'Doelen halen, meten wat werkt en de kwaliteit bewaken.',
    accent: 'orange',
    situations: [
      'Het kwartaal is voorbij. Schrijf een korte terugblik op de resultaten van je team.',
      'De kwaliteit van het werk gaat achteruit. Schrijf wat je eraan gaat doen.',
      'Je team heeft een doel ruim gehaald. Schrijf een bericht aan je directeur.',
    ],
  },
  {
    id: 'geld',
    group: 'vak',
    name: 'Geld en organisatie',
    text: 'Budget, kosten en hoe een organisatie in elkaar zit.',
    accent: 'teal',
    situations: [
      'Je moet tien procent bezuinigen. Schrijf een voorstel aan je directeur.',
      'Leg een nieuwe collega uit hoe de afdelingen samenhangen en wie waarover beslist.',
      'Je wilt een nieuwe investering. Schrijf je onderbouwing in een paar zinnen.',
    ],
  },
  {
    id: 'integriteit',
    group: 'vak',
    name: 'Vertrouwen en integriteit',
    text: 'Eerlijk zijn, je aan afspraken houden en verantwoording afleggen.',
    accent: 'navy',
    situations: [
      'Je hebt een fout gemaakt die het team geld kost. Schrijf een eerlijk bericht aan je manager.',
      'Een leverancier biedt je een duur cadeau aan. Schrijf je antwoord.',
      'Schrijf wat jij belangrijk vindt aan eerlijkheid op het werk.',
    ],
  },
  {
    id: 'personeel',
    group: 'vak',
    name: 'Mensen en personeel',
    text: 'Werven, inwerken, verzuim en goede arbeidsvoorwaarden.',
    accent: 'pink',
    situations: [
      'Je zoekt een nieuwe collega. Schrijf de belangrijkste zinnen van de vacature.',
      'Een teamlid is al lang ziek. Schrijf hoe je contact houdt.',
      'Schrijf hoe een nieuwe collega bij jou de eerste week doorbrengt.',
    ],
  },
  {
    id: 'uitdrukkingen',
    group: 'vak',
    name: 'Uitdrukkingen op het werk',
    text: 'Vaste uitdrukkingen die Nederlanders op het werk echt gebruiken.',
    accent: 'purple',
    situations: [
      'Schrijf een kort bericht aan je team na een moeilijke week waarin het toch gelukt is.',
      'Een collega wil een project stoppen, jij wilt doorzetten. Schrijf je reactie.',
      'Schrijf hoe je het team motiveert voor een drukke periode.',
    ],
  },
  {
    id: 'verbanden',
    group: 'algemeen',
    name: 'Verbindingswoorden',
    text: 'De woorden die zinnen aan elkaar knopen: tegenstelling, reden, gevolg, voorwaarde.',
    accent: 'slate',
    situations: [],
  },
  {
    id: 'denken',
    group: 'algemeen',
    name: 'Denken en redeneren',
    text: 'Werkwoorden en woorden om precies te zeggen wat je denkt.',
    accent: 'blue',
    situations: [],
  },
  {
    id: 'zeggen',
    group: 'algemeen',
    name: 'Zeggen en schrijven',
    text: 'Woorden voor wat je zegt: benadrukken, toegeven, aankaarten, nuanceren.',
    accent: 'teal',
    situations: [],
  },
  {
    id: 'formeel',
    group: 'algemeen',
    name: 'Formeel Nederlands',
    text: 'Zakelijke woorden en vaste combinaties voor mails, brieven en notities.',
    accent: 'navy',
    situations: [],
  },
  {
    id: 'dagelijks',
    group: 'algemeen',
    name: 'Dagelijks leven',
    text: 'Gewone woorden en uitdrukkingen die je elke dag hoort.',
    accent: 'yellow',
    situations: [],
  },
  {
    id: 'gevoel',
    group: 'algemeen',
    name: 'Gevoelens en houding',
    text: 'Zeggen hoe je je voelt en hoe je ergens tegenover staat.',
    accent: 'rose',
    situations: [],
  },
  {
    id: 'tijd',
    group: 'algemeen',
    name: 'Tijd en mate',
    text: 'Wanneer, hoe lang, hoeveel en in welke mate.',
    accent: 'orange',
    situations: [],
  },
  {
    id: 'beschrijven',
    group: 'algemeen',
    name: 'Beschrijven en beoordelen',
    text: 'Sterke bijvoeglijke naamwoorden om precies te beoordelen.',
    accent: 'green',
    situations: [],
  },
];

const byId = new Map(THEMES.map((theme) => [theme.id, theme]));

export function getTheme(id: string): Theme | undefined {
  return byId.get(id);
}

export const THEME_IDS = THEMES.map((theme) => theme.id);
