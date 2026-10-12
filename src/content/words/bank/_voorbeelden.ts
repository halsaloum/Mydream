import type { WordEntry } from '../schema';

/**
 * Vier uitgewerkte woorden als maatstaf voor de rest van de bank: zo precies, zo concreet en zo
 * dicht bij de werkvloer moet elk woord zijn. Ze staan ook gewoon in hun eigen thema.
 */
export const DRAAGVLAK: WordEntry = {
  id: 'draagvlak',
  word: 'draagvlak',
  article: 'het',
  pos: 'zn',
  level: 'C1',
  forms: ['draagvlak'],
  grammar: 'het draagvlak, meestal zonder meervoud',
  meaning: 'Steun van de mensen die met een plan of besluit moeten werken, zodat ze het accepteren en uitvoeren.',
  examples: ['Zonder *draagvlak* in het team heeft de nieuwe werkwijze geen kans.', 'De directeur zocht eerst *draagvlak* bij de afdelingshoofden.'],
  collocations: ['draagvlak creëren', 'draagvlak zoeken voor iets', 'breed draagvlak', 'het draagvlak verliezen', 'er is geen draagvlak voor'],
  family: ['dragen', 'een gedragen besluit'],
  synonyms: ['steun', 'instemming'],
  contrast: { word: 'draagkracht', note: 'Draagkracht is hoeveel iemand aankan (geld, werk, zorgen). Draagvlak is steun voor een plan.' },
  tip: 'Een besluit met veel draagvlak heet ook een gedragen besluit.',
  think: 'Voor welk plan in jouw werk zou je eerst draagvlak moeten zoeken?',
  guess: {
    sentence: 'Het plan is goed, maar er is geen *draagvlak*: bijna niemand in het team wil eraan meewerken.',
    wrong: [
      'Het geld en de middelen die nodig zijn om een plan of besluit echt uit te kunnen voeren.',
      'De ruimte in een gebouw waar een team samen kan werken en kan overleggen over plannen.',
      'Een stevige basis van regels en afspraken op papier, zodat iedereen weet wat er moet.',
    ],
  },
  gaps: [
    'Voordat we stemmen, wil ik weten of er genoeg {draagvlak} is voor dit voorstel.',
    'Door iedereen vroeg te betrekken, kreeg het plan een breed {draagvlak}.',
    'De reorganisatie mislukte omdat het {draagvlak} onder de medewerkers ontbrak.',
  ],
  colloc: {
    text: 'Je moet eerst draagvlak {creëren~zoeken~verwerven} voordat je het plan invoert.',
    why: 'Je zegt draagvlak creëren, zoeken of verwerven. Draagvlak doen of stellen bestaat niet.',
  },
  chat: {
    name: 'Sanne',
    role: 'teamlid',
    say: 'Ik vind het nieuwe rooster prima, maar de helft van het team is er fel op tegen.',
    reply: 'Dan is er nog te weinig draagvlak. Laten we eerst met iedereen praten.',
    wrong: ['Dan is er nog te weinig draagkracht. Laten we eerst met iedereen praten.', 'Mooi, dan is er genoeg draagvlak en kunnen we morgen beginnen.'],
    fix: 'te weinig draagvlak: de helft is tegen',
    why: 'Als de helft van het team tegen is, ontbreekt de steun: er is te weinig draagvlak. Draagkracht gaat over wat iemand aankan.',
  },
  name: {
    situation: 'De medewerkers die met het nieuwe systeem moeten werken, staan erachter en willen het graag laten slagen. Er is dus veel …',
    others: ['draagkracht', 'mandaat', 'invloed'],
    why: 'Steun bij de mensen die met een plan moeten werken, heet draagvlak. Draagkracht is wat iemand aankan, een mandaat is de bevoegdheid om te beslissen.',
  },
  use: [
    {
      situation: 'Je wilt vaste thuiswerkdagen invoeren. Wat zeg je in het overleg met je team?',
      model: 'Voordat ik het voorstel indien, wil ik weten of er in het team draagvlak voor is.',
    },
    {
      situation: 'Je directeur vraagt waarom je plan nog niet is gestart.',
      model: 'Ik wil eerst draagvlak creëren bij de mensen die ermee moeten werken.',
    },
  ],
};

export const DELEGEREN: WordEntry = {
  id: 'delegeren',
  word: 'delegeren',
  pos: 'ww',
  level: 'B2',
  forms: ['delegeren', 'delegeer', 'delegeert', 'delegeerde', 'delegeerden', 'gedelegeerd'],
  grammar: 'delegeerde, heeft gedelegeerd · iets delegeren aan iemand',
  meaning: 'Een taak en de verantwoordelijkheid ervoor bij iemand anders neerleggen.',
  examples: ['Een goede leider *delegeert* taken, zodat ze tijd heeft voor de grote lijn.', 'Ik heb de planning *gedelegeerd* aan Mehmet.'],
  collocations: ['taken delegeren aan iemand', 'verantwoordelijkheid delegeren', 'leren delegeren', 'goed kunnen delegeren'],
  family: ['de delegatie', 'de gedelegeerde'],
  synonyms: ['overdragen'],
  contrast: { word: 'dirigeren', note: 'Dirigeren is precies zeggen wat iemand moet doen. Bij delegeren geef je ook de vrijheid en de verantwoordelijkheid.' },
  tip: 'Je delegeert iets áán iemand: "Ik delegeer het verslag aan Sara."',
  think: 'Welke taak houd jij nu zelf vast die je eigenlijk zou kunnen delegeren?',
  guess: {
    sentence: 'Omdat de manager alles zelf wilde doen, leerde ze pas laat om te *delegeren*.',
    wrong: ['Een lastig besluit uitstellen tot je meer informatie hebt.', 'Een medewerker officieel waarschuwen voor slecht werk.', 'Alle beslissingen samen met het hele team in overleg nemen.'],
  },
  gaps: [
    'Als je alles zelf blijft doen, raak je overwerkt; leer dus te {delegeren}.',
    'Ik {delegeer} het klantcontact deze week aan Joris.',
    'De directeur heeft de beslissing over het budget {gedelegeerd} aan de teamleiders.',
  ],
  colloc: {
    text: 'Ze delegeerde het project {aan} haar collega.',
    why: 'Je delegeert iets aan iemand.',
  },
  chat: {
    name: 'Pieter',
    role: 'je manager',
    say: 'Je zit elke avond tot negen uur te werken. Hoe komt dat?',
    reply: 'Ik doe nog te veel zelf. Ik ga meer taken aan het team delegeren.',
    wrong: ['Ik doe nog te veel zelf. Ik ga meer taken aan het team degraderen.', 'Ik doe nog te veel zelf. Ik ga meer taken van het team overnemen.'],
    fix: 'meer taken aan het team delegeren',
    why: 'Wie te veel zelf doet, moet taken aan anderen geven: delegeren. Degraderen is iemand een lagere functie geven, en taken overnemen maakt het juist erger.',
  },
  name: {
    situation: 'Je geeft een teamlid de verantwoordelijkheid voor het klantproject. Hij mag zelf beslissen hoe hij het aanpakt.',
    others: ['controleren', 'adviseren', 'uitstellen'],
    why: 'Een taak met de verantwoordelijkheid erbij aan iemand anders geven, is delegeren.',
  },
  use: [
    {
      situation: 'Je hebt te veel werk. Wat zeg je tegen je team?',
      model: 'Ik wil het verslag en de planning delegeren, zodat ik me op de klant kan richten.',
    },
    {
      situation: 'Een nieuwe teamleider vraagt je om advies.',
      model: 'Probeer vanaf het begin te delegeren, ook als je denkt dat je het zelf sneller kunt.',
    },
  ],
};

export const BOVENDIEN: WordEntry = {
  id: 'bovendien',
  word: 'bovendien',
  pos: 'bw',
  level: 'B1',
  forms: ['bovendien'],
  grammar: 'aan het begin van de zin: Bovendien + persoonsvorm + onderwerp',
  meaning: 'Je voegt er nog een argument of feit aan toe, in dezelfde richting: en ook nog.',
  examples: ['Het plan is te duur. *Bovendien* hebben we er geen tijd voor.', 'Ze is slim en *bovendien* erg goed met mensen.'],
  collocations: ['en bovendien', 'Bovendien is het zo dat …', 'en het is bovendien …'],
  synonyms: ['daarnaast', 'ook nog', 'tevens'],
  contrast: { word: 'echter', note: 'Bovendien voegt iets toe in dezelfde richting. Echter geeft een tegenstelling.' },
  tip: 'Na bovendien aan het begin van de zin komt eerst de persoonsvorm: "Bovendien is het duur", niet "Bovendien het is duur".',
  guess: {
    sentence: 'Deze kandidaat heeft veel ervaring. *Bovendien* spreekt ze drie talen.',
    wrong: ['Maar toch: er volgt iets dat tegen het vorige ingaat.', 'Daarom: wat nu volgt, is het gevolg van wat er net staat.', 'Alleen als het eerste waar is, geldt ook het tweede.'],
  },
  gaps: [
    'De oplossing is goedkoop. {Bovendien} kunnen we morgen al beginnen.',
    'Ik heb geen tijd, en {bovendien} vind ik het geen goed idee.',
    'Het nieuwe systeem werkt sneller en is {bovendien} veiliger.',
  ],
  colloc: {
    text: 'We hebben te weinig mensen. Bovendien {hebben we} geen budget.',
    why: 'Na bovendien aan het begin van de zin komt eerst de persoonsvorm, dan het onderwerp.',
  },
  chat: {
    name: 'Lotte',
    role: 'collega',
    say: 'Waarom wil je het overleg verplaatsen naar dinsdag?',
    reply: 'Op maandag zijn veel mensen vrij. Bovendien is de vergaderzaal dan bezet.',
    wrong: ['Op maandag zijn veel mensen vrij. Echter is de vergaderzaal dan bezet.', 'Op maandag zijn veel mensen vrij. Bovendien de vergaderzaal is dan bezet.'],
    fix: 'Bovendien is de zaal …: een tweede reden, en de persoonsvorm direct erna',
    why: 'Je geeft twee redenen in dezelfde richting, dus bovendien. Daarna komt meteen de persoonsvorm.',
  },
  name: {
    situation: 'Je hebt in je mail al één reden gegeven en wilt nog een tweede reden in dezelfde richting toevoegen. Met welk woord begin je de nieuwe zin?',
    others: ['echter', 'dus', 'hoewel'],
    why: 'Bovendien voegt een argument toe. Echter geeft een tegenstelling, dus een gevolg, en hoewel begint een toegeving.',
  },
  use: [
    {
      situation: 'Je wilt een nieuwe collega aannemen. Geef je manager twee redenen.',
      model: 'We hebben te veel werk voor het huidige team. Bovendien gaat er volgend jaar iemand met pensioen.',
    },
    {
      situation: 'Een klant vraagt waarom jullie product beter is.',
      model: 'Ons product is sneller en bovendien makkelijker te gebruiken.',
    },
  ],
};

export const KNOOP_DOORHAKKEN: WordEntry = {
  id: 'de-knoop-doorhakken',
  word: 'de knoop doorhakken',
  pos: 'uitdr',
  level: 'B2',
  forms: [
    'de knoop doorhakken',
    'de knoop doorhakt',
    'de knoop doorhakte',
    'de knoop doorgehakt',
    'de knoop door te hakken',
    'hak … de knoop door',
    'hakt … de knoop door',
    'hakken … de knoop door',
    'hakte … de knoop door',
    'hakten … de knoop door',
  ],
  detect: ['knoop', 'hak'],
  grammar: 'hakte de knoop door, heeft de knoop doorgehakt',
  meaning: 'Na lang twijfelen of praten eindelijk een besluit nemen.',
  examples: ['We praten al weken over de nieuwe leverancier; nu moeten we *de knoop doorhakken*.', 'De directeur *hakte de knoop door*: het project stopt.'],
  collocations: ['eindelijk de knoop doorhakken', 'de knoop moet worden doorgehakt', 'wie hakt de knoop door?'],
  synonyms: ['een besluit nemen', 'beslissen'],
  contrast: { word: 'de kogel is door de kerk', note: 'De kogel is door de kerk zeg je als het besluit al genomen is. De knoop doorhakken is het moment van beslissen zelf.' },
  tip: 'Het beeld: een knoop die niet los wil, hak je in één keer door.',
  guess: {
    sentence: 'Na drie vergaderingen zonder uitkomst *hakte* de manager *de knoop door*: we kiezen voor optie B.',
    wrong: ['Een probleem nog langer laten liggen.', 'Een ruzie tussen collega’s oplossen.', 'Een vergadering plotseling beëindigen.'],
  },
  gaps: [
    'We kunnen niet blijven twijfelen; vandaag moeten we de {knoop} doorhakken.',
    'Wie {hakt} er straks de knoop door?',
    'Na weken overleg heeft de directie de knoop {doorgehakt}.',
  ],
  colloc: {
    text: 'Het is tijd om de knoop {door te hakken}.',
    why: 'De uitdrukking ligt vast: de knoop doorhakken. Met snijden of losmaken klopt ze niet.',
  },
  chat: {
    name: 'Ahmed',
    role: 'projectleider',
    say: 'We hebben nu alle offertes. Twee leveranciers zijn bijna even goed.',
    reply: 'Dan wegen we vandaag alles af en hakken we morgen de knoop door.',
    wrong: ['Dan wegen we vandaag alles af en leggen we morgen de knoop.', 'Dan hakken we vandaag de knoop door en wegen we morgen alles af.'],
    fix: 'eerst afwegen, dan de knoop doorhakken',
    why: 'De knoop doorhakken is de laatste stap: na het afwegen neem je het besluit.',
  },
  name: {
    situation: 'Het team discussieert al een maand over de nieuwe werkwijze. Jij zegt: genoeg gepraat, we doen het zo.',
    others: ['op de rem trappen', 'water bij de wijn doen', 'aan de bel trekken'],
    why: 'Na lang praten eindelijk beslissen, is de knoop doorhakken.',
  },
  use: [
    {
      situation: 'Je team blijft twijfelen tussen twee plannen. Wat schrijf je in de groepsapp?',
      model: 'We hebben genoeg informatie. Morgen hak ik de knoop door.',
    },
    {
      situation: 'Je vertelt thuis over je werkdag.',
      model: 'Na weken twijfelen hebben we vandaag eindelijk de knoop doorgehakt.',
    },
  ],
};
