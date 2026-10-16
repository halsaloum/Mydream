import type { DemoItem } from './oefenvormen';

/**
 * Demoset uit "Interactieve lessen – j": argumenteren en drogredenen herkennen. Teksten, items
 * en uitleg zijn letterlijk overgenomen en omgezet naar het inhoudscontract.
 *
 * De ontwerpen beginnen soms halverwege om de oefening te laten zien; hier begint elke
 * oefening bij het begin. Net als de andere demo's: geen cursusinhoud, telt niet mee.
 */
export const ARGUMENT_DEMOS: DemoItem[] = [
  {
    slug: 'want-of-dus',
    title: 'Want of dus',
    domain: 'prag',
    group: 'Overtuigen in één alinea',
    step: {
      kind: 'reason',
      prompt: 'Want of dus?',
      intro: 'Twee zinnen horen bij elkaar. Wissel de zinnen of het signaalwoord tot het klopt. Elk paar kan op twee manieren.',
      pairs: [
        {
          claim: { lead: 'De vergadering kan beter op dinsdag', mid: 'de vergadering kan beter op dinsdag' },
          reason: { lead: 'Op maandag is de helft van het team vrij', mid: 'op maandag is de helft van het team vrij' },
          bad: 'Zo lijkt het alsof het team vrij is doordat de vergadering verhuist. Het is andersom.',
          start: { top: 'claim', word: 'want' },
        },
        {
          claim: { lead: 'De bushalte moet een afdak krijgen', mid: 'de bushalte moet een afdak krijgen' },
          reason: { lead: 'Reizigers staan nu in de regen te wachten', mid: 'reizigers staan nu in de regen te wachten' },
          bad: 'Zo lijkt het alsof reizigers in de regen staan doordat er een afdak komt. Het is andersom.',
          start: { top: 'reason', word: 'want' },
        },
      ],
      done: {
        title: 'Je ziet wat er beweerd wordt',
        text: 'Na want staat het argument, na dus het standpunt. Zo vind je in elke alinea wat de schrijver eigenlijk wil zeggen.',
      },
    },
  },
  {
    slug: 'onderbouwen',
    title: 'Onderbouwen',
    domain: 'prag',
    group: 'Overtuigen in één alinea',
    step: {
      kind: 'support',
      prompt: 'Vraag door: waarom?',
      intro: 'Een standpunt zonder onderbouwing zweeft. Kies steeds het antwoord dat echt een reden geeft, tot je op vaste grond staat.',
      claim: 'Het fietspad langs de Parklaan moet verlichting krijgen.',
      levels: [
        {
          ask: 'Waarom moet dat?',
          options: [
            { t: 'Omdat er nu eenmaal verlichting hoort te zijn.', trap: 'cirkelredenering', why: 'Dat is een cirkel: je herhaalt je standpunt in andere woorden.' },
            {
              t: 'Omdat het er ’s avonds onveilig is.',
              ok: true,
              role: 'argument',
              text: 'Het is er ’s avonds onveilig.',
              why: 'Dat is een reden. Maar de lezer kan nog doorvragen.',
            },
            {
              t: 'Omdat de hele buurt dat vindt.',
              trap: 'beroep op de massa',
              why: 'Dat veel mensen iets vinden, is nog geen reden. De lezer wil weten waarom ze dat vinden.',
            },
          ],
        },
        {
          ask: 'Waarom is het daar onveilig?',
          options: [
            { t: 'Omdat het er gevaarlijk is.', trap: 'cirkelredenering', why: 'Onveilig en gevaarlijk betekenen hetzelfde. Zo draai je in een cirkel.' },
            { t: 'Dat snapt toch iedereen?', trap: 'bewijslast verschuiven', why: 'Zo schuif je de vraag terug naar de lezer. Wie iets beweert, legt het zelf uit.' },
            {
              t: 'Omdat je in het donker de kuilen en de tegenliggers niet ziet.',
              ok: true,
              role: 'uitleg',
              text: 'In het donker zie je de kuilen en de tegenliggers niet.',
              why: 'Nu ziet de lezer het voor zich. Nog één vraag.',
            },
          ],
        },
        {
          ask: 'Hoe weet je dat het echt misgaat?',
          options: [
            { t: 'Mijn buurman vindt het er ook te donker.', trap: 'mening, geen feit', why: 'Dat is nog een mening. De lezer zoekt iets wat hij kan nagaan.' },
            {
              t: 'Afgelopen winter zijn er drie fietsers gevallen. Dat staat in het verslag van de wijkraad.',
              ok: true,
              role: 'feit',
              text: 'Afgelopen winter zijn er drie fietsers gevallen. Dat staat in het verslag van de wijkraad.',
              why: 'Een feit met een bron. Verder vragen hoeft niet meer.',
            },
            { t: 'Dat hoor je van iedereen die er fietst.', trap: 'van horen zeggen', why: 'Van horen zeggen is geen bewijs. Wie zei het, en waar staat het?' },
          ],
        },
      ],
      paragraph:
        'Het fietspad langs de Parklaan moet verlichting krijgen. Het is er ’s avonds namelijk onveilig: in het donker zie je de kuilen en de tegenliggers niet. Afgelopen winter zijn er drie fietsers gevallen. Dat staat in het verslag van de wijkraad.',
      done: {
        title: 'Je standpunt staat',
        text: 'Standpunt, argument, uitleg en een feit dat de lezer kan nagaan. Wie nu doorvraagt, komt op vaste grond.',
      },
    },
  },
  {
    slug: 'weegschaal',
    title: 'Weegschaal',
    domain: 'prag',
    group: 'Overtuigen in één alinea',
    step: {
      kind: 'scale',
      prompt: 'Wat weegt het zwaarst?',
      intro: 'Je schrijft de gemeente: de bibliotheek moet op zondag open. Leg twee argumenten op de schaal en haal de lezer over.',
      args: [
        { id: 'mening', t: 'Ik vind een dichte bibliotheek gewoon zonde.', type: 'mening', w: 1, why: 'Dat is jouw mening. De lezer hoeft die niet te delen.' },
        {
          id: 'feit',
          t: 'Doordeweeks sluit de bibliotheek om vijf uur, als de meeste mensen nog werken.',
          type: 'feit',
          w: 3,
          why: 'Een feit dat de lezer kan nagaan. Dat weegt het zwaarst.',
        },
        { id: 'drog', t: 'Iedereen wil dit, dat weet u zelf ook wel.', type: 'drogreden', w: 0, why: 'Een drogreden. Dat iedereen iets zou willen, bewijst niets.' },
        {
          id: 'voorbeeld',
          t: 'In mijn vorige woonplaats zat de leeszaal op zondag vol.',
          type: 'voorbeeld',
          w: 2,
          why: 'Een voorbeeld uit de praktijk. Het maakt je punt zichtbaar, maar bewijst minder dan een feit.',
        },
      ],
      max: 2,
      doubt: 4,
      done: {
        title: 'De lezer is om',
        text: 'Een feit dat de lezer kan nagaan, plus een voorbeeld dat het laat zien. Samen wegen ze zwaarder dan de twijfel.',
      },
    },
  },
  {
    slug: 'bewijsbalk',
    title: 'Bewijsbalk',
    domain: 'prag',
    group: 'Overtuigen in één alinea',
    step: {
      kind: 'evidence',
      prompt: 'Belooft je zin te veel?',
      intro: 'Je vraagt de gemeente om een deelauto in je straat. Tik een gekleurd woord aan en kies hoe ver je zin mag gaan.',
      rows: [
        {
          before: '',
          after: ' buren in onze straat zijn voor een deelauto.',
          evidence: 'Je hebt alle 40 huishoudens gevraagd. 31 zijn voor.',
          total: 40,
          known: 31,
          max: 'alle 40 huishoudens',
          options: [
            { w: 'Sommige', need: 3, says: 'een paar', why: 'Je weet het van 31 huishoudens. ‘Sommige’ klinkt als een handvol.' },
            { w: 'De meeste', need: 21, says: 'meer dan de helft', why: 'Meer dan de helft is voor, en dat kun je laten zien.' },
            { w: 'Alle', need: 40, says: 'alle 40', why: 'Negen huishoudens zijn niet voor. Eén tegenstem en je zin klopt niet meer.' },
          ],
          best: 1,
          start: 1,
        },
        {
          before: 'In de Lindenstraat was de deelauto vorige maand ',
          after: ' verhuurd.',
          evidence: 'De deelauto in de Lindenstraat was vorige maand 30 van de 30 dagen verhuurd.',
          total: 30,
          known: 30,
          max: 'alle 30 dagen',
          options: [
            { w: 'soms', need: 3, says: 'een paar dagen', why: 'De auto was elke dag weg. Dat mag je ook zeggen.' },
            { w: 'meestal', need: 16, says: 'meer dan de helft', why: 'Er was geen dag dat de auto stilstond. Je bewijs kan meer aan.' },
            { w: 'elke dag', need: 30, says: 'alle 30 dagen', why: 'Dertig van de dertig dagen. Sterker kan niet, en het klopt.' },
          ],
          best: 2,
          start: 0,
        },
        {
          before: '',
          after: ' deed daar zelfs de eigen auto weg.',
          evidence: 'In de Lindenstraat deden 2 van de 40 huishoudens hun auto weg.',
          total: 40,
          known: 2,
          max: 'alle 40 huishoudens',
          options: [
            { w: 'Een enkeling', need: 1, says: 'een of twee', why: 'Twee huishoudens: weinig, maar wel waar.' },
            { w: 'De helft', need: 20, says: '20 van de 40', why: 'Dat zouden er twintig moeten zijn. Je weet het van twee.' },
            { w: 'Iedereen', need: 40, says: 'alle 40', why: 'Van twee naar iedereen: dat is een overhaaste generalisatie.' },
          ],
          best: 0,
          start: 2,
        },
      ],
      closing: 'Daarom vraag ik u ook in onze straat een deelauto te plaatsen.',
      done: {
        title: 'Je alinea belooft wat je weet',
        text: 'Elke zin gaat precies zo ver als je bewijs. Zo kan niemand je alinea onderuithalen met één tegenvoorbeeld.',
      },
    },
  },
  {
    slug: 'ja-maar',
    title: 'Ja, maar…',
    domain: 'prag',
    group: 'Overtuigen in één alinea',
    step: {
      kind: 'rebut',
      prompt: 'De lezer zegt: ja, maar…',
      intro: 'Je stelt je teamleider een vaste thuiswerkdag voor. Zij heeft bezwaren. Kies de zin die het bezwaar serieus neemt en het toch weerlegt.',
      base: 'Ik stel voor dat ons team een vaste thuiswerkdag krijgt. Op zo’n dag kun je ongestoord doorwerken aan een lastige klus.',
      speaker: { name: 'Ingrid', role: 'je teamleider', initials: 'IS' },
      rounds: [
        {
          objection: 'Ja, maar dan zien we elkaar minder.',
          options: [
            { t: 'Dat valt heus wel mee.', trap: 'wegwuiven', why: 'Je wuift het bezwaar weg zonder reden. De lezer voelt zich niet gehoord.' },
            {
              t: 'Weliswaar zien we elkaar dan een dag minder, maar op de andere vier dagen is iedereen op kantoor.',
              ok: true,
              concede: 'Weliswaar zien we elkaar dan een dag minder,',
              rebut: 'maar op de andere vier dagen is iedereen op kantoor.',
              why: 'Eerst geef je toe wat klopt. Dan laat je zien waarom je voorstel toch staat.',
            },
            { t: 'Jij werkt zelf toch ook weleens thuis?', trap: 'jij-bak', why: 'Je speelt het terug naar de persoon. Het bezwaar zelf blijft staan.' },
          ],
        },
        {
          objection: 'Ja, maar thuis word je sneller afgeleid.',
          options: [
            { t: 'Andere bedrijven doen dit allang.', trap: 'beroep op de massa', why: 'Dat anderen het doen, zegt niets over afleiding thuis. Het bezwaar blijft staan.' },
            { t: 'Daar gaat het nu niet om.', trap: 'ontwijken', why: 'Je ontwijkt het bezwaar. De lezer blijft ermee zitten.' },
            {
              t: 'Het klopt dat niet iedereen thuis een rustige plek heeft, maar wie dat wil, kan die dag gewoon naar kantoor komen.',
              ok: true,
              concede: 'Het klopt dat niet iedereen thuis een rustige plek heeft,',
              rebut: 'maar wie dat wil, kan die dag gewoon naar kantoor komen.',
              why: 'Weer eerst toegeven, dan weerleggen. Het bezwaar is van tafel.',
            },
          ],
        },
      ],
      reply: 'Daar kan ik mee leven. Laten we het een maand proberen.',
      done: {
        title: 'Bezwaren weerlegd',
        text: 'Eerst toegeven wat klopt, dan laten zien waarom je voorstel toch staat. Zo voelt de lezer zich gehoord.',
      },
    },
  },
  {
    slug: 'stroman',
    title: 'Stroman',
    domain: 'prag',
    group: 'Drogredenen herkennen',
    step: {
      kind: 'strawman',
      prompt: 'Wat schreef ze echt?',
      intro:
        'Ruben reageert op een voorstel van collega Mila. Reageert hij op wat zij schreef, of op een stroman: een verdraaide versie die makkelijker aan te vallen is?',
      original: {
        author: 'Mila',
        segs: [{ t: 'Ik vind dat ons weekoverleg ' }, { t: 'korter', id: 'korter' }, { t: ' kan. ' }, { t: 'Een half uur', id: 'half-uur' }, { t: ' is genoeg.' }],
      },
      response: {
        author: 'Ruben',
        chunks: [
          { t: 'Mila vindt ons weekoverleg dus', why: 'Dit klopt nog: het gaat over Mila en over het weekoverleg.' },
          { t: 'zonde van de tijd.', twist: 'korter', was: 'Mila schreef: korter', why: 'Mila schreef korter. Ruben maakt er zonde van de tijd van.' },
          { t: 'Als het aan haar ligt,', why: 'Dit is alleen een aanloop. Kijk wat erna komt.' },
          {
            t: 'spreken we elkaar helemaal niet meer.',
            twist: 'half-uur',
            was: 'Mila schreef: een half uur',
            why: 'Mila schreef een half uur. Ruben maakt er helemaal niet meer van.',
          },
          { t: 'En dat terwijl we elkaar juist nodig hebben.', why: 'Dit is Rubens eigen mening. Maar hij reageert ermee op iets wat Mila niet schreef.' },
        ],
      },
      options: [
        {
          t: 'Mila heeft gewoon een hekel aan vergaderen. Daarom wil ze ervan af.',
          trap: 'aanval op de persoon',
          why: 'Nu gaat het over Mila zelf, niet over haar voorstel. En ‘ervan af’ heeft ze niet geschreven.',
        },
        {
          t: 'Mila wil het weekoverleg inkorten tot een half uur. Dat lijkt mij te krap, want we bespreken elke week vijf projecten.',
          ok: true,
          restate: 'Mila wil het weekoverleg inkorten tot een half uur.',
          reply: 'Dat lijkt mij te krap, want we bespreken elke week vijf projecten.',
          why: 'Eerst geeft Ruben haar standpunt eerlijk weer. Dan pas komt zijn eigen argument.',
        },
        {
          t: 'Mila wil minder overleggen. Zo weet straks niemand meer wat de ander doet.',
          trap: 'weer een stroman',
          why: 'Korter is niet minder vaak. Ruben reageert weer op iets wat Mila niet schreef.',
        },
      ],
      done: {
        title: 'Geen stroman meer',
        text: 'Geef eerst eerlijk weer wat de ander vindt. Pas dan kun je er echt op reageren, en dat overtuigt meer dan een karikatuur.',
      },
    },
  },
  {
    slug: 'hellend-vlak',
    title: 'Hellend vlak',
    domain: 'prag',
    group: 'Drogredenen herkennen',
    step: {
      kind: 'slope',
      prompt: 'Rolt de bal echt door?',
      intro: 'Een collega is tegen de vleesloze maandag in de kantine. Volgt elke stap in zijn redenering echt vanzelf uit de vorige?',
      steps: ['Op maandag serveert de kantine geen vlees.', 'Dan is straks elke dag vleesloos.', 'Dan gaat iedereen buiten de deur lunchen.', 'Dan moet de kantine sluiten.'],
      links: [
        {
          holds: false,
          why: 'Eén dag is één dag. Voor meer dagen is een nieuw besluit nodig.',
          hint: 'Volgt dat echt vanzelf? Over de andere dagen is niets besloten.',
        },
        {
          holds: false,
          why: 'Een paar collega’s misschien. Maar ‘iedereen’ is een grote sprong.',
          hint: 'Echt iedereen? Kijk naar het woord dat de stap zo groot maakt.',
        },
        {
          holds: true,
          why: 'Zonder gasten verdient een kantine niets. Deze stap klopt.',
          hint: 'Kijk nog eens. Als er echt niemand meer komt, wat verdient de kantine dan?',
        },
      ],
      summary: 'Twee van de drie stappen volgen niet vanzelf. De bal komt alleen beneden als je twee keer ‘stel dat’ zegt.',
      options: [
        {
          t: 'De vleesloze maandag is het begin van het einde van onze kantine.',
          trap: 'hellend vlak',
          why: 'Korter, maar hetzelfde: je springt in één keer naar het einde.',
        },
        {
          t: 'Door de vleesloze maandag gaan misschien een paar collega’s die dag buiten de deur lunchen. Dat kunnen we na een maand tellen.',
          ok: true,
          segs: [
            { t: 'Door de vleesloze maandag gaan ' },
            { t: 'misschien', hi: true },
            { t: ' ' },
            { t: 'een paar', hi: true },
            { t: ' collega’s ' },
            { t: 'die dag', hi: true },
            { t: ' buiten de deur lunchen. Dat kunnen we ' },
            { t: 'na een maand tellen', hi: true },
            { t: '.' },
          ],
          why: 'Afgezwakt en na te tellen. Dit kan de lezer serieus nemen.',
        },
        {
          t: 'Wie de vleesloze maandag bedenkt, wil ons gewoon de les lezen.',
          trap: 'aanval op de persoon',
          why: 'Nu gaat het over de bedenker, niet over de gevolgen van het plan.',
        },
      ],
      done: {
        title: 'De bal blijft liggen',
        text: 'Een hellend vlak doet alsof één kleine stap vanzelf op een ramp uitloopt. Bekijk elke stap apart en schrijf alleen op wat je kunt waarmaken.',
      },
    },
  },
  {
    slug: 'vals-dilemma',
    title: 'Vals dilemma',
    domain: 'prag',
    group: 'Drogredenen herkennen',
    step: {
      kind: 'dilemma',
      prompt: 'Zijn er echt maar twee wegen?',
      intro: 'In een ingezonden brief doet de schrijver alsof je maar uit twee dingen kunt kiezen. Zet de wegen erbij die hij verzwijgt.',
      source: {
        label: 'Uit de brief',
        segs: [{ t: 'Het centrum loopt leeg. ' }, { t: 'Of we bouwen een parkeergarage, of de winkels gaan failliet.', hi: true }, { t: ' Een andere keuze is er niet.' }],
      },
      horns: ['parkeergarage bouwen', 'winkels failliet'],
      candidates: [
        {
          t: 'Een pendelbus vanaf de rand van de stad.',
          ok: true,
          sign: 'pendelbus',
          why: 'Een derde weg: klanten komen ook zonder garage in het centrum.',
        },
        {
          t: 'Een nog grotere parkeergarage.',
          trap: 'dezelfde weg',
          why: 'Dat is dezelfde weg, alleen breder. De keuze blijft garage of failliet.',
        },
        {
          t: 'Meer fietsenstallingen bij de winkels.',
          ok: true,
          sign: 'fietsenstallingen',
          why: 'Nog een weg: wie fietst, heeft geen parkeerplaats nodig.',
        },
        { t: 'De winkels gaan toch wel failliet.', trap: 'geen nieuwe weg', why: 'Dat is geen nieuwe weg, maar de tweede helft van het dilemma.' },
      ],
      options: [
        {
          t: 'Zonder parkeergarage is het centrum over een jaar leeg.',
          trap: 'nog steeds twee wegen',
          why: 'Andere woorden, zelfde keuze: een garage of een leeg centrum.',
        },
        {
          t: 'Een parkeergarage is één manier om klanten naar het centrum te halen. Een pendelbus of meer fietsenstallingen kunnen dat ook. Laten we de drie plannen naast elkaar leggen.',
          ok: true,
          why: 'Nu staan alle wegen er. De lezer kan echt kiezen.',
        },
        {
          t: 'Wie tegen de garage is, wil kennelijk dat de winkels verdwijnen.',
          trap: 'dilemma, nu op de persoon',
          why: 'Zo zet je de ander klem: wie niet voor de garage is, zou tegen de winkels zijn.',
        },
      ],
      done: {
        title: 'Meer dan twee wegen',
        text: 'Een vals dilemma doet alsof je maar uit twee dingen kunt kiezen. Noem de andere mogelijkheden, dan kan de lezer echt kiezen.',
      },
    },
  },
  {
    slug: 'keuring',
    title: 'Keuring',
    domain: 'prag',
    group: 'Drogredenen herkennen',
    step: {
      kind: 'inspect',
      prompt: 'Keur de alinea',
      intro: 'Je buurvrouw wil zonnepanelen op de flat. Lees haar bericht na: twee zinnen overtuigen niet eerlijk.',
      heading: 'Haar alinea',
      fine: 'houdt stand',
      fallacies: ['aanval op de persoon', 'beroep op de massa', 'hellend vlak'],
      rows: [
        {
          t: 'Ik stel voor dat er zonnepanelen op het dak van onze flat komen.',
          role: 'standpunt',
          why: 'Dit is het standpunt: duidelijk en zonder omweg.',
          hint: 'Deze zin zegt alleen wat de schrijver wil. Daar is niets mis mee.',
        },
        {
          t: 'Volgens de offerte verdienen we de kosten in acht jaar terug.',
          role: 'feit',
          why: 'Een feit uit de offerte. De lezer kan het nagaan.',
          hint: 'Hier staat een getal met een bron. Dat kan de lezer nagaan.',
        },
        {
          t: 'Meneer Bakker is tegen, maar die klaagt overal over.',
          fallacy: 'aanval op de persoon',
          why: 'De zin gaat over meneer Bakker zelf, niet over zijn bezwaar. Zo win je de lezer niet.',
          hint: 'Gaat deze zin over het plan, of over meneer Bakker?',
          fixes: [
            { t: 'Meneer Bakker is tegen, maar hij woont hier pas een jaar.', why: 'Dit gaat nog steeds over de persoon. Wat is zijn bezwaar?' },
            {
              t: 'Meneer Bakker is bang voor lekkage, maar op het dakwerk zit tien jaar garantie.',
              ok: true,
              why: 'Nu ga je in op zijn bezwaar. Dat overtuigt ook de andere bewoners.',
            },
          ],
        },
        {
          t: 'Bovendien heeft tegenwoordig iedereen zonnepanelen.',
          fallacy: 'beroep op de massa',
          why: 'Dat veel mensen iets hebben, bewijst niet dat het voor deze flat een goed plan is.',
          hint: 'Kijk naar het woord iedereen. Wat bewijst dat voor deze flat?',
          fixes: [
            { t: 'Bovendien gaat de stroomrekening voor de lift en de hal omlaag.', ok: true, why: 'Een voordeel voor alle bewoners. Dat is een echt argument.' },
            { t: 'Bovendien is wie tegen is gewoon ouderwets.', why: 'Dat is weer een aanval op de persoon. Zoek een voordeel van het plan.' },
          ],
        },
        {
          t: 'Daarom vraag ik u het voorstel op de volgende vergadering te bespreken.',
          role: 'verzoek',
          why: 'Een duidelijk verzoek. Daar kan de lezer iets mee.',
          hint: 'Deze zin vraagt alleen iets. Daar is niets mis mee.',
        },
      ],
      done: {
        title: 'Alinea goedgekeurd',
        text: 'De persoon en de massa zijn eruit. Wat overblijft, zijn redenen die de lezer kan nagaan.',
      },
    },
  },
  {
    slug: 'schrijf-zelf',
    title: 'Schrijf zelf',
    domain: 'prag',
    group: 'Drogredenen herkennen',
    step: {
      kind: 'write',
      prompt: 'Nu jij: één alinea die staat',
      intro: 'Je vindt dat er een zebrapad bij de supermarkt moet komen. Schrijf de gemeente één alinea. De lijst loopt met je mee.',
      start: 'Ik vind dat er een zebrapad bij de supermarkt moet komen, want iedereen steekt daar over.',
      minWords: 35,
      must: [
        {
          label: 'Standpunt in de eerste zin',
          hint: 'ik vind, moet, zou',
          test: { pattern: '^[^.!?]*?\\b(vind|vinden|moet|moeten|zou|stel voor|wil)\\b', flags: 'i' },
        },
        { label: 'Argument', hint: 'want, omdat', test: { pattern: '\\b(want|omdat|namelijk|aangezien)\\b', flags: 'i' } },
        {
          label: 'Bezwaar weerlegd',
          hint: 'weliswaar … maar',
          test: { pattern: '\\b(weliswaar|hoewel|het klopt dat|natuurlijk)\\b[^.!?]*\\b(maar|toch)\\b', flags: 'i' },
        },
        { label: 'Slot', hint: 'daarom, dus, kortom', test: { pattern: '\\b(daarom|dus|kortom)\\b', flags: 'i' } },
      ],
      avoid: [
        {
          test: { pattern: '\\b(iedereen|niemand|altijd|nooit|allemaal|alles|niets)\\b', flags: 'i' },
          tip: 'Kun je dat waarmaken? Probeer veel, vaak of de meeste.',
        },
        {
          test: { pattern: '\\b(belachelijk|dom|domme|idioot|onzin|schandalig|waardeloos)\\b', flags: 'i' },
          tip: 'Dat zegt iets over de toon, niet over het plan. Geef een reden.',
        },
        { test: { pattern: '\\b(of)\\b[^.!?]*\\bof\\b', flags: 'i' }, show: 'of … of', tip: 'Zijn er echt maar twee mogelijkheden?' },
      ],
      starters: ['Weliswaar', 'Het klopt dat', 'Bovendien', 'Daarom'],
      why: 'Standpunt, argument, een weerlegd bezwaar en een slot. Lees hem nog één keer hardop voordat je hem verstuurt.',
      done: {
        title: 'Je alinea staat',
        text: 'Standpunt, argument, een weerlegd bezwaar en een slot. Lees hem nog één keer hardop voordat je hem verstuurt.',
      },
    },
  },
];
