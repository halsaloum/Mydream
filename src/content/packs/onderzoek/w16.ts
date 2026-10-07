import type { StepInput } from '../../schema';

/** Onderzoek bij w16: resultatieven (Levin en Rappaport Hovav), teliciteit tegenover controle (Zaenen), leerders op de schaal van Sorace en het dubbelzinnige is + deelwoord. */
export const ONDERZOEK_W16: StepInput[] = [
  {
    kind: 'explain',
    id: 'onderzoek',
    title: 'Resultaten, eindpunten en een dubbelzinnig is',
    panels: [
      {
        text: 'Een vierde toets komt uit de *resultatieve constructie*. *De vaas viel kapot*: het resultaat slaat direct op het onderwerp. Maar *Ze danste kapot* kan niet. Bij een onergatief werkwoord heb je een extra voorwerp nodig: *Ze danste haar schoenen kapot*, *Hij werkte zich suf*. Beth Levin en Malka Rappaport Hovav (1995) maakten daar een regel van, de *Direct Object Restriction*: een resultaat hoort bij een lijdend voorwerp, en het onderwerp van *vallen* telt mee omdat het onderliggend een lijdend voorwerp is.',
        rule: 'Een resultaat hoort bij een lijdend voorwerp. Onaccusatief: het onderwerp volstaat. Onergatief: zet er zich of een voorwerp bij.',
        lab: {
          label: 'Tik een zin',
          chips: [
            { k: 'De vaas viel kapot.', out: 'goed', note: 'Onaccusatief: het onderwerp is onderliggend lijdend voorwerp, dus het resultaat mag erop slaan.' },
            { k: 'Ze danste kapot.', out: 'fout', note: 'Onergatief: er is geen lijdend voorwerp dat kapot kan gaan.' },
            {
              k: 'Ze danste haar schoenen kapot.',
              out: 'goed',
              note: 'Het extra voorwerp draagt het resultaat. Dansen heeft zelf geen lijdend voorwerp: de constructie levert het (zie w18).',
            },
            { k: 'Hij werkte zich suf.', out: 'goed', note: 'Dit zich heeft geen eigen rol. Het staat er alleen om het resultaat te dragen.' },
            { k: 'De vijver vroor dicht.', out: 'goed', note: 'Onaccusatief, net als vallen. En dichtvriezen kiest zijn: de vijver is dichtgevroren.' },
          ],
        },
      },
      {
        text: 'Meten de toetsen uit de uitleg wel hetzelfde? Annie Zaenen (1993) liet zien dat het hulpwerkwoord in het Nederlands vooral *teliciteit* volgt: heeft de gebeurtenis een eindpunt? Het onpersoonlijk passief vraagt iets anders: een mens die iets doet. Meestal wijzen de twee dezelfde kant op, maar niet altijd. *Bloeien* heeft geen eindpunt (*heeft gebloeid*), maar er doet ook niemand iets, dus *Er werd gebloeid* kan niet.',
        rule: 'Hulpwerkwoord: is er een eindpunt? Onpersoonlijk passief: doet een mens iets? Twee toetsen, twee eigenschappen.',
        paradigm: {
          q: 'Doe beide toetsen',
          cols: ['eindpunt?', 'iemand doet iets?', 'hulpwerkwoord', 'er werd ge…'],
          rows: [
            { label: 'dansen', cells: ['nee', 'ja', 'heeft', 'kan'] },
            {
              label: 'vallen',
              cells: [
                { fill: 'ja', hint: 'Vallen eindigt op de grond.' },
                { fill: 'nee', hint: 'Vallen overkomt je.' },
                { fill: 'is', hint: 'Eindpunt: zijn.' },
                { fill: 'kan niet', hint: 'Er werd gevallen? Niemand doet hier iets.' },
              ],
            },
            {
              label: 'bloeien',
              cells: [
                { fill: 'nee', hint: 'Een bloem bloeit een tijd, zonder vast eindpunt.' },
                { fill: 'nee', hint: 'Een bloem doet niets met opzet.' },
                { fill: 'heeft', hint: 'Geen eindpunt: de roos heeft gebloeid.' },
                { fill: 'kan niet', hint: 'Er werd gebloeid? Er is geen mens die iets doet.' },
              ],
            },
            {
              label: 'stinken',
              cells: [
                { fill: 'nee', hint: 'Stinken duurt, zonder eindpunt.' },
                { fill: 'nee', hint: 'Je stinkt niet met opzet.' },
                { fill: 'heeft', hint: 'Het heeft gestonken.' },
                { fill: 'kan niet', hint: 'Er werd gestonken? Dat klinkt fout.' },
              ],
            },
          ],
          note: 'Bij dansen en vallen spreken de toetsen elkaar niet tegen. Bij bloeien en stinken wel: hebben, want geen eindpunt, en toch geen onpersoonlijk passief, want niemand doet iets.',
        },
      },
      {
        text: 'Wat betekent de schaal van Sorace voor wie Nederlands leert? Onderzoek naar leerders van onder meer het Italiaans liet zien dat ze de uitersten van de schaal het eerst goed hebben: verandering van plaats (*komen*) en gecontroleerde activiteit (*werken*). In het midden (*blijven*, *bestaan*, *trillen*) houden ook gevorderde leerders lang twijfels, en daar wisselen moedertaalsprekers zelf ook. Sorace verklaarde dat zo: kernwerkwoorden houden hun hulpwerkwoord altijd vast, werkwoorden aan de rand laten de rest van de zin meebeslissen.',
        rule: 'Kern van de schaal: vast en vroeg geleerd. Midden van de schaal: gevoelig voor de zin, en lastig voor iedereen.',
        quiz: {
          q: 'Waar maakt een gevorderde leerder volgens dit onderzoek het langst fouten?',
          options: ['bij werkwoorden in het midden van de schaal', 'bij verandering van plaats, zoals komen', 'bij gecontroleerde activiteit, zoals werken'],
          answer: 'bij werkwoorden in het midden van de schaal',
          why: 'De uitersten zijn vast en worden vroeg verworven. In het midden beslist de context mee, en daar blijft het wankel.',
        },
        deep: {
          q: 'Wat doe je ermee als schrijver?',
          a: 'Leer de werkwoorden uit het midden als vaste paren: *is gebleven*, *heeft bestaan*, *heeft getrild*. En kijk bij een bewegingswerkwoord altijd of er een eindpunt bij staat: *heeft gefietst*, maar *is naar huis gefietst*.',
        },
      },
      {
        text: 'Nog een val: *De vaas is gebroken*. Dat kan de voltooide tijd van onaccusatief *breken* zijn: de vaas brak. Het kan ook een voltooid passief zijn: de vaas werd gebroken, door iemand. Het standaardnederlands laat in het voltooid passief *geworden* meestal weg, en zo vallen de twee vormen samen. Een *door*-bepaling kiest het passief, *vanzelf* kiest het onaccusatief.',
        rule: 'is + deelwoord: voltooid van een onaccusatief werkwoord, of voltooid passief. De context kiest.',
        quiz: {
          q: 'Welke toevoeging maakt van ‘De vaas is gebroken’ alleen een passief?',
          options: ['door de kat', 'vanzelf', 'gisteren'],
          answer: 'door de kat',
          why: 'Een door-bepaling noemt de agens, en dat kan alleen in het passief. Vanzelf kiest het onaccusatief, gisteren laat beide lezingen open.',
        },
      },
    ],
  },
  {
    kind: 'sort',
    id: 'resultaat',
    prompt: 'Kan dit resultaat zo?',
    buckets: ['goed', 'fout'],
    items: [
      { t: 'De vaas viel kapot.', b: 0 },
      { t: 'Het meer vroor dicht.', b: 0 },
      { t: 'Ze danste haar schoenen kapot.', b: 0 },
      { t: 'Hij werkte zich suf.', b: 0 },
      { t: 'Ze lachte zich dood.', b: 0 },
      { t: 'Ze danste kapot.', b: 1 },
      { t: 'Hij werkte suf.', b: 1 },
      { t: 'Ze lachte dood.', b: 1 },
      { t: 'De vaas viel zich kapot.', b: 1 },
      { t: 'De bloem verwelkte zich bruin.', b: 1 },
    ],
    why: 'Onaccusatief (vallen, vriezen): het resultaat slaat op het onderwerp. Onergatief (dansen, werken, lachen): je hebt zich of een voorwerp nodig. En een onaccusatief werkwoord wil geen extra zich: zijn onderwerp is zelf al een verkapt lijdend voorwerp.',
  },
  {
    kind: 'ambiguity',
    id: 'trein',
    prompt: 'Eén zin, twee analyses',
    intro: 'Kies een lezing en zoek de zin die alleen dát kan betekenen.',
    sentence: 'De trein is gestopt.',
    meanings: [
      {
        id: 'vanzelf',
        label: 'De trein stopte (voltooid, onaccusatief)',
        highlight: ['is gestopt'],
        right: 'Klopt. Zonder veroorzaker is stoppen onaccusatief en kiest het zijn.',
      },
      {
        id: 'passief',
        label: 'Iemand stopte de trein (voltooid passief)',
        highlight: ['is gestopt'],
        right: 'Klopt. Het voltooid passief zonder geworden: de trein is door iemand gestopt.',
      },
    ],
    options: [
      { t: 'De trein is vanzelf gestopt.', fits: 'vanzelf' },
      { t: 'De trein is door de machinist gestopt.', fits: 'passief' },
      { t: 'De trein is om drie uur gestopt.', fits: null, note: 'Nog steeds allebei mogelijk: een tijd kiest niet.' },
    ],
    done: {
      title: 'Twee keer is',
      text: 'Is + deelwoord kan voltooid onaccusatief zijn of voltooid passief. Vanzelf of een door-bepaling beslist.',
    },
  },
  {
    kind: 'bet',
    id: 'bloeien',
    prompt: 'Een roos heeft gebloeid, maar ‘Er werd gebloeid’ kan niet. Wat laat dat zien?',
    options: [
      'Het hulpwerkwoord en het onpersoonlijk passief meten iets anders',
      'Bloeien is onaccusatief',
      'Een onpersoonlijk passief kan nooit bij één argument',
    ],
    answer: 'Het hulpwerkwoord en het onpersoonlijk passief meten iets anders',
    why: 'Hebben, want bloeien heeft geen eindpunt. Geen passief, want er is geen mens die iets doet. Zaenen (1993) koppelde het hulpwerkwoord aan teliciteit. En er werd gedanst laat zien dat één argument wel kan.',
  },
  {
    kind: 'fix',
    id: 'verhuisd',
    prompt: 'Tik het foute woord aan en verbeter het.',
    sentence: 'Vorig jaar heb ik naar Utrecht verhuisd.',
    wrong: 2,
    answer: 'ben',
    why: 'Naar Utrecht is een eindpunt: verandering van plaats, bovenaan de schaal van Sorace. Dus zijn: ik ben naar Utrecht verhuisd.',
  },
  {
    kind: 'chat',
    id: 'mail',
    prompt: 'Help Yara met haar mail',
    intro: 'Yara leert ook Nederlands. Kies telkens de zin met het goede hulpwerkwoord.',
    contact: { name: 'Yara', role: 'leert ook Nederlands', initials: 'Y' },
    rounds: [
      {
        say: 'Ik schrijf de huisbaas over de verwarming. Die maakte de hele nacht lawaai. Hoe zeg ik dat?',
        options: ['De verwarming heeft de hele nacht gezoemd.', 'De verwarming is de hele nacht gezoemd.'],
        right: 0,
        fix: 'is gezoemd → heeft gezoemd',
        why: 'Zoemen is een ongecontroleerd proces zonder eindpunt, laag op de schaal van Sorace: hebben.',
      },
      {
        say: 'Gelukkig is mijn plan om de buren te vragen geslaagd. Hoe schrijf ik dat met lukken?',
        options: ['Mijn plan heeft gelukt.', 'Mijn plan is gelukt.'],
        right: 1,
        fix: 'heeft gelukt → is gelukt',
        why: 'Lukken hoort bij bevallen en opvallen: het is me gelukt. Die werkwoorden kiezen zijn.',
      },
      {
        say: 'En de vijver bij ons huis is bevroren, in één nacht!',
        options: ['De vijver heeft in één nacht dichtgevroren.', 'De vijver is in één nacht dichtgevroren.'],
        right: 1,
        fix: 'heeft dichtgevroren → is dichtgevroren',
        why: 'Een verandering met een eindpunt: zijn. En dichtgevroren schrijf je aan elkaar.',
      },
    ],
    bye: 'Dank je! Nu klinkt mijn mail echt Nederlands.',
  },
];
