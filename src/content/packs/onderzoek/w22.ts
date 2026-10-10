import type { StepInput } from '../../schema';

/** Onderzoek bij w22: een derde uitlegronde op onderzoeksniveau, daarna zwaardere oefeningen. */
export const ONDERZOEK_W22: StepInput[] = [
  {
    kind: 'explain',
    id: 'onderzoek',
    title: 'Buren, cohorten en twee talen in één hoofd',
    panels: [
      {
        text: 'Waarom zeg je zo traag nee tegen *plirt*? Omdat het *buren* heeft: *flirt* en *plint* verschillen er maar één letter van. Max Coltheart en collega’s (1977) telden zulke buren. Dat getal heet sindsdien *Coltheart’s N*. Hun bekendste vondst: een nepwoord met veel buren wijs je trager af. Al die buren worden een beetje actief, en dan duurt het langer voordat je zeker weet dat er niets past. *Bltr* heeft geen enkele buur en is niet eens uit te spreken: meteen weg.',
        rule: 'Buren: woorden die één letter verschillen. Hoe meer buren een nepwoord heeft, hoe trager je nee zegt.',
        lab: {
          label: 'Tik een letterreeks',
          chips: [
            { k: 'hart', out: 'een echt woord met veel buren', note: 'hard, hert, haat, hark, harp, hars, part: steeds één letter anders.' },
            { k: 'plirt', out: 'nepwoord, twee buren', note: 'flirt en plint liggen vlakbij: traag nee.' },
            { k: 'bltr', out: 'nepwoord, geen buren', note: 'Geen enkel woord op één letter afstand, en geen klinker: snel nee.' },
            {
              k: 'blat',
              out: 'nepwoord, met buren én de klank van blad',
              note: 'Door de verscherping klinkt blat precies als blad. Zo’n nepwoord wijs je extra traag af.',
            },
          ],
        },
        deep: {
          q: 'Helpen buren dan ook bij echte woorden?',
          a: 'Dat is ingewikkelder. In Engelse experimenten helpen veel buren meestal juist bij het herkennen. Maar een buur die véél vaker voorkomt, kan remmen: Jonathan Grainger en collega’s (1989) vonden dat in het Frans. Je lexicon is dus geen lijst die je afloopt, maar een *wedstrijd* tussen woorden die op elkaar lijken.',
        },
      },
      {
        text: 'Gesproken woorden komen klank voor klank binnen. William Marslen-Wilson en Alan Welsh (1978) stelden daarom het *cohortmodel* voor. Bij de eerste klanken gaan alle woorden aan die zo beginnen: het *cohort*. Elke nieuwe klank streept er een paar weg. Het punt waarop er nog maar één over is, heet het *uniciteitspunt*. Na *krok* blijven onder meer *krokus*, *kroket*, *krokant* en *krokodil* over. De volgende klank beslist.',
        rule: 'Cohort: alle woorden die passen bij wat je tot nu toe hoorde. Uniciteitspunt: daar blijft er één over.',
        split: {
          q: 'Knip krokodil op het uniciteitspunt',
          word: 'krokodil',
          answer: 'kroko-dil',
          note: 'Na kroko blijft alleen krokodil over (met woorden die ermee beginnen, zoals krokodillentranen). Je herkent het woord dus al voordat het af is.',
        },
        deep: {
          q: 'Doen alleen woorden met hetzelfde begin mee?',
          a: 'Nee. Paul Allopenna, James Magnuson en Michael Tanenhaus (1998) volgden met een eyetracker waar luisteraars naar keken. Bij het woord *beaker* keken ze ook even naar een *beetle* (zelfde begin) en, iets later en minder, naar een *speaker* (rijm). Ook rijmwoorden worden dus een beetje actief. Het strenge cohortmodel, waarin een woord met een ander begin meteen afvalt, is daarmee te streng.',
        },
      },
      {
        text: 'Priming werkt niet alleen tussen directe buren. Allan Collins en Elizabeth Loftus (1975) beschreven het lexicon als een netwerk waarin activatie zich *verspreidt*, als een golf in het water. Hoe verder weg, hoe zwakker. *Leeuw* duwt *tijger* sterk aan, en via *tijger* een klein beetje *strepen*, terwijl leeuwen geen strepen hebben. David Balota en Robert Lorch (1986) vonden zo’n effect via een tussenstap bij hardop lezen, maar niet bij de lexicale-decisietaak. Hoe ver de golf lijkt te reiken, hangt dus ook af van de taak.',
        rule: 'Spreiding van activatie: een woord duwt zijn buren aan, en die duwen weer zachter verder.',
        swap: {
          goal: 'Zet de woorden in de volgorde van de golf, vanaf leeuw',
          blocks: ['strepen', 'tijger', 'leeuw'],
          accept: ['leeuw tijger strepen'],
          note: 'leeuw → tijger → strepen. Strepen krijgt alleen een duwtje via tijger: dat heet bemiddelde priming.',
        },
      },
      {
        text: 'En als je twee talen kent? Volgens het BIA+-model van Ton Dijkstra en Walter van Heuven (2002) staat het Engels niet in een aparte la. Bij elk woord gaan kandidaten uit álle talen tegelijk aan. Een *cognaat* met dezelfde vorm en betekenis, zoals *pan*, herken je als tweetalige sneller. Bij een *valse vriend*, zoals *boot* (Engels: laars), strijden twee betekenissen. Walter van Heuven, Ton Dijkstra en Jonathan Grainger (1998) zagen zelfs dat de buren uit de andere taal meetellen.',
        rule: 'Twee talen, één lexicon: de woorden van beide talen strijden tegelijk mee.',
        bins: {
          q: 'Cognaat of valse vriend in het Engels?',
          bins: ['in het Engels hetzelfde', 'valse vriend'],
          items: [
            {
              thing: 'pan',
              bin: 0,
              note: 'Engels pan: zelfde vorm, zelfde ding. Zo’n cognaat herken je als tweetalige sneller.',
              hint: 'Hoe heet een koekenpan in het Engels?',
            },
            { thing: 'pot', bin: 0, note: 'Engels pot: ook een pot voor planten.', hint: 'Een flowerpot is in het Engels ook een pot.' },
            { thing: 'geldbank', bin: 0, note: 'Engels bank: precies dezelfde geldinstelling.', hint: 'Waar breng je in Engeland je geld naartoe?' },
            {
              thing: 'zitbank',
              bin: 1,
              note: 'Een Engelse bank is geen zitbank, maar een geldbank of een oever. Om op te zitten zeg je bench.',
              hint: 'Zit je in het Engels op een bank?',
            },
            { thing: 'boot', bin: 1, note: 'Engels boot is een laars. Een boot is a boat.', hint: 'Wat trek je in het Engels aan als je boots draagt?' },
            {
              thing: 'hangslot',
              bin: 1,
              note: 'Engels slot is een gleuf, zoals in een automaat. Een slot op de deur is a lock.',
              hint: 'Wat is een slot machine?',
            },
            { thing: 'kasteel', bin: 1, note: 'Ook dit slot is in het Engels geen slot, maar a castle.', hint: 'Een sprookjesslot heet in het Engels anders.' },
          ],
          note: 'Drie cognaten, vier valse vrienden. Let op de twee banken: dezelfde Nederlandse vorm, en toch in verschillende bakken. Een tweetalige moet bij elke bank kiezen.',
        },
      },
    ],
  },
  {
    kind: 'sort',
    id: 'cohort',
    prompt: 'Je hoort krokodil. Wanneer valt dit woord uit het cohort?',
    buckets: ['bij de klinker (geen lange o)', 'na kro-', 'pas na krok-'],
    items: [
      { t: 'kroeg', b: 0 },
      { t: 'krom', b: 0 },
      { t: 'kraan', b: 0 },
      { t: 'krul', b: 0 },
      { t: 'kroon', b: 1 },
      { t: 'kroos', b: 1 },
      { t: 'kroning', b: 1 },
      { t: 'krokus', b: 2 },
      { t: 'kroket', b: 2 },
      { t: 'krokant', b: 2 },
    ],
    why: 'Het cohort werkt met klanken, niet met letters. Krom begint met de letters kro, maar heeft een korte o: weg bij de klinker. Kroon, kroos en kroning hebben de lange o, maar daarna geen k. Krokus, kroket en krokant blijven het langst: pas de klank na krok beslist.',
  },
  {
    kind: 'chat',
    id: 'emma',
    prompt: 'App met Emma, een Engelse uitwisselingsstudent',
    intro: 'Emma schrijft Nederlands, maar haar Engels loopt mee. Kies telkens het antwoord dat haar echt helpt.',
    contact: { name: 'Emma', role: 'een Engelse uitwisselingsstudent', initials: 'E' },
    rounds: [
      {
        say: 'Ik ben zo glad dat je me helpt met Nederlands!',
        options: ['Graag gedaan! Je bedoelt blij: glad betekent bij ons glibberig.', 'Ja, het is ook glad buiten.'],
        right: 0,
        fix: 'glad → blij',
        why: 'Engels glad betekent blij. Bij een tweetalige gaan allebei de betekenissen aan, en soms wint de verkeerde.',
      },
      {
        say: 'Dat is echt kind van je.',
        options: ['Dank je! Je bedoelt aardig: een kind is bij ons een jong mens.', 'Ik ben geen kind meer!'],
        right: 0,
        fix: 'kind → aardig',
        why: 'Engels kind betekent aardig. Zelfde vorm, andere betekenis: een valse vriend.',
      },
      {
        say: 'Mag ik een beetje room in mijn koffie?',
        options: ['Ja hoor, room is hier gewoon goed Nederlands.', 'Je bedoelt melk: room is een kamer.'],
        right: 0,
        fix: 'Niets te verbeteren: koffie met room.',
        why: 'In het Engels is room een kamer, maar in het Nederlands de vette laag van melk. Emma gebruikt het precies goed. Niet elk woord dat Engels lijkt, is een valse vriend.',
      },
      {
        say: 'Ik ben deze zomer heel slim geworden: tien kilo afgevallen!',
        options: ['Gefeliciteerd! Je bedoelt slank: slim betekent bij ons intelligent.', 'Knap, dan haal je vast hoge cijfers.'],
        right: 0,
        fix: 'slim → slank',
        why: 'Engels slim betekent slank. Het Nederlandse slim betekent intelligent.',
      },
    ],
    bye: 'Thanks! Eh, bedankt! Ik let voortaan op mijn valse vrienden.',
  },
  {
    kind: 'bet',
    id: 'blat',
    prompt: 'Welk nepwoord wijs je in een lexicale-decisietaak waarschijnlijk het traagst af?',
    options: ['blat', 'bltr', 'allebei even snel'],
    answer: 'blat',
    why: 'Blat heeft buren (blad, plat, blaf) en klinkt door de verscherping precies als blad. Zo’n nepwoord met de klank van een echt woord heet een pseudohomofoon. Bltr heeft geen klinker en geen buren: meteen nee.',
  },
  {
    kind: 'ladder',
    id: 'golf',
    prompt: 'Hoe hard duwt leeuw dit woord aan?',
    intro: 'Zet de woorden van zwak naar sterk geactiveerd, vlak nadat je leeuw zag.',
    sentence: { before: 'Na leeuw krijgt', after: 'een duwtje.' },
    steps: [{ t: 'stoel' }, { t: 'strepen' }, { t: 'tijger' }],
    low: 'zwak',
    high: 'sterk',
    startHint: 'Begin met het woord dat niets met leeuw te maken heeft.',
    done: {
      title: 'De golf dooft uit',
      text: 'Tijger is een directe buur, strepen ligt een stap verder, stoel ligt buiten het netwerk van leeuw. Balota en Lorch vonden het zwakke effect via tijger alleen bij hardop lezen.',
    },
  },
  {
    kind: 'swipe',
    id: 'lexicon-onderzoek',
    prompt: 'Klopt deze zin?',
    cards: [
      {
        t: 'Een nepwoord met veel buren wijs je sneller af.',
        ok: false,
        fix: 'Trager: de buren worden mee actief, en dat maakt nee zeggen lastiger',
        why: 'Coltheart en collega’s (1977).',
      },
      {
        t: 'Volgens het cohortmodel herken je een woord soms al voordat het af is.',
        ok: true,
        why: 'Op het uniciteitspunt is er nog maar één kandidaat over.',
      },
      {
        t: 'Bij beaker keken luisteraars ook even naar een speaker.',
        ok: true,
        why: 'Allopenna, Magnuson en Tanenhaus (1998): ook rijmwoorden doen een beetje mee.',
      },
      {
        t: 'Bij een tweetalige staat elke taal in een eigen, afgesloten deel van het lexicon.',
        ok: false,
        fix: 'De kandidaten uit beide talen gaan tegelijk aan',
        why: 'Dat is de kern van het BIA+-model van Dijkstra en Van Heuven (2002).',
      },
      {
        t: 'Een cognaat zoals pan herken je als tweetalige sneller dan een woord dat maar in één taal bestaat.',
        ok: true,
        why: 'Twee talen duwen dezelfde vorm tegelijk aan.',
      },
      {
        t: 'Leeuw helpt via tijger ook strepen, bij elke taak even sterk.',
        ok: false,
        fix: 'Balota en Lorch vonden het bij hardop lezen, niet bij lexicale decisie',
        why: 'Hoe ver de activatie lijkt te reiken, hangt af van de taak.',
      },
    ],
  },
];
