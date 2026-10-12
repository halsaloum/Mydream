export type IllustrationTone = 'blue' | 'green' | 'orange' | 'purple' | 'slate';
export type IllustrationNode = { id: string; label: string; text: string; tone: IllustrationTone; connector?: boolean };
export type IllustrationEdge = { from: string; to: string; label: string; kind: 'support' | 'challenge' | 'cause' | 'association' | 'authorize' | 'qualify' };
export type FlowIllustration = { family: 'flow'; rows: string[][]; nodes: IllustrationNode[]; edges: IllustrationEdge[]; legend: string };
export type ChecksIllustration = { family: 'checks'; claim: string; checks: { title: string; question: string; observation: string; state: 'supported' | 'question' | 'problem' }[] };
export type ConditionIllustration = { family: 'condition'; rule: string; p: string; q: string; direction: 'if' | 'only-if'; application: string };
export type QuantifierIllustration = { family: 'quantifiers'; group: string; property: string; people: { id: string; name: string; member: boolean; property: boolean }[]; claim: string };
export type ConditionalFrequencyIllustration = { family: 'frequency'; mode: 'conditional'; population: number; prevalence: number; sensitivity: number; specificity: number; signal: string; condition: string };
export type RateIllustration = { family: 'frequency'; mode: 'rate'; unit: string; groups: { name: string; count: number; exposure: number }[] };
export type DecisionIllustration = { family: 'decision'; question: string; criterion: string; options: { id: string; title: string; benefit: string; cost: string; condition: string }[] };
export type ComparisonIllustration = { family: 'comparison'; left: string; right: string; rows: { feature: string; left: string; right: string; relevance: string }[]; conclusion: string };
export type IllustrationData = FlowIllustration | ChecksIllustration | ConditionIllustration | QuantifierIllustration | ConditionalFrequencyIllustration | RateIllustration | DecisionIllustration | ComparisonIllustration;
export type IllustrationVariant = { id: string; label: string; caption: string; data: IllustrationData };
export type LessonIllustrationEntry = { title: string; invitation: string; sourceId?: string; variants: IllustrationVariant[] };

const n = (id: string, label: string, text: string, tone: IllustrationTone = 'blue', connector = false): IllustrationNode => ({ id, label, text, tone, ...(connector ? { connector } : {}) });
const e = (from: string, to: string, label: string, kind: IllustrationEdge['kind'] = 'support'): IllustrationEdge => ({ from, to, label, kind });
const f = (rows: string[][], nodes: IllustrationNode[], edges: IllustrationEdge[], legend = 'Een pijl benoemt welke uitspraak een volgende stap draagt. De kaart beoordeelt de waarheid niet.'): FlowIllustration => ({ family: 'flow', rows, nodes, edges, legend });
const v = (id: string, label: string, caption: string, data: IllustrationData): IllustrationVariant => ({ id, label, caption, data });
const checks = (claim: string, rows: ChecksIllustration['checks']): ChecksIllustration => ({ family: 'checks', claim, checks: rows });

/** Every case and relation is authored for one lesson; no title-to-diagram guessing. */
export const lessonIllustrations: Record<string, LessonIllustrationEntry> = {
  'basis-standpunt-en-reden': {
    title: 'Van reden naar standpunt', invitation: 'Vergelijk een voorstel mét en zonder genoemde reden.', sourceId: 'govier', variants: [
      v('argument', 'Met een reden', 'Het voorstel is het standpunt. Het lawaai wordt aangevoerd als reden om deze plek te kiezen; je hoeft die keuze nog niet te onderschrijven.', f([['r'], ['c']], [n('r', 'Reden', 'In kamer B is minder lawaai.'), n('c', 'Standpunt', 'Laten we in kamer B overleggen.', 'green')], [e('r', 'c', 'wordt aangevoerd als reden voor')], 'De pijl toont hoe de spreker het voorstel ondersteunt. Zij bewijst nog niet dat de keuze juist is.')),
      v('opinion', 'Alleen een voorkeur', 'Deze uitspraak geeft een voorkeur zonder genoemde onderbouwing. In een gedeelde context kan steun impliciet zijn; vraag welke reden de spreker bedoelt.', f([['c'], ['q']], [n('c', 'Standpunt', 'Kamer B lijkt mij prettig.', 'green'), n('q', 'Passende vraag', 'Wat maakt B beter voor dit overleg?', 'orange')], [e('q', 'c', 'vraagt om een reden', 'challenge')])),
    ],
  },
  'basis-redenen-beoordelen': {
    title: 'Drie controles voor een sterke reden', invitation: 'Verander het bewijs en bekijk welke controle nog openstaat.', sourceId: 'govier', variants: [
      v('fresh', 'Actueel en gericht', 'Een actuele telling ondersteunt deze beperkte bestelling. De drie controles stellen verschillende vragen; een betrouwbare reden is niet vanzelf relevant of voldoende.', checks('Bestel 20 extra onderdelen voor morgen.', [
        { title: 'Aanvaardbaar?', question: 'Klopt de telling?', observation: 'Vandaag geteld: 30 aanwezig.', state: 'supported' },
        { title: 'Relevant?', question: 'Raakt dit de bestelling?', observation: 'De planning vraagt morgen 50 onderdelen.', state: 'supported' },
        { title: 'Voldoende?', question: 'Draagt dit de omvang?', observation: 'Het tekort is 20, zonder bekende extra levering.', state: 'supported' },
      ])),
      v('old', 'Een oude telling', 'De telling kan destijds hebben geklopt en toch geen actuele voorraad bewijzen. Vraag om de ontbrekende controle, zonder meteen te zeggen dat de conclusie onwaar is.', checks('Bestel 20 extra onderdelen voor morgen.', [
        { title: 'Aanvaardbaar?', question: 'Geldt dit nog?', observation: 'De telling is van vorige maand.', state: 'question' },
        { title: 'Relevant?', question: 'Raakt dit de keuze?', observation: 'Voorraad is relevant voor bestellen.', state: 'supported' },
        { title: 'Voldoende?', question: 'Weten we het huidige tekort?', observation: 'Verbruik en leveringen sinds de telling ontbreken.', state: 'problem' },
      ])),
      v('broad', 'Te ruime conclusie', 'Goed bewijs voor één team rechtvaardigt niet zonder extra grond een uitspraak over iedereen. Richt je kritiek op de stap die te groot wordt.', checks('Alle teams zullen altijd 20 onderdelen tekortkomen.', [
        { title: 'Aanvaardbaar?', question: 'Klopt deze ene telling?', observation: 'De telling van dit team is gecontroleerd.', state: 'supported' },
        { title: 'Relevant?', question: 'Geeft dit informatie over voorraad?', observation: 'Het voorbeeld gaat over dezelfde soort onderdelen.', state: 'supported' },
        { title: 'Voldoende?', question: 'Draagt één geval “alle” en “altijd”?', observation: 'Andere teams en momenten zijn niet vergeleken.', state: 'problem' },
      ])),
    ],
  },
  'basis-verzwegen-stap': {
    title: 'Maak de verzwegen brug zichtbaar', invitation: 'Toon de brug en beoordeel of zij bij de gegeven reden past.', sourceId: 'groarke', variants: [
      v('implicit', 'De brug is impliciet', 'De spreker noemt de brug niet. Dat maakt het argument niet automatisch ongeldig: vraag eerst welke aanname de sprong begrijpelijk maakt.', f([['r'], ['w'], ['c']], [n('r', 'Genoemde reden', 'Deze onderdelen zijn breekbaar.'), n('w', 'Verzwegen stap', 'Welke aanname verbindt dit met verpakken?', 'purple', true), n('c', 'Standpunt', 'Gebruik extra bescherming.', 'green')], [e('r', 'w', 'vraagt om een verbinding'), e('w', 'c', 'impliciete steun', 'authorize')])),
      v('bridge', 'Een passende aanvulling', 'Deze aanvulling verbindt breekbaarheid met het doel: transportschade voorkomen. De aanname wordt nu bespreekbaar; zij is daarmee nog niet bewezen.', f([['r'], ['w'], ['c']], [n('r', 'Genoemde reden', 'Deze onderdelen zijn breekbaar.'), n('w', 'Aangevulde brug', 'Breekbare onderdelen vragen bescherming tegen schade.', 'purple', true), n('c', 'Standpunt', 'Gebruik extra bescherming.', 'green')], [e('r', 'w', 'valt onder de aanname'), e('w', 'c', 'ondersteunt bescherming')])),
      v('irrelevant', 'Een verkeerde aanvulling', 'Deze zin kan waar zijn, maar verbindt de genoemde eigenschap niet met extra bescherming. Een ontbrekende brug vul je niet met een willekeurig extra feit.', f([['r'], ['w'], ['c']], [n('r', 'Genoemde reden', 'Deze onderdelen zijn breekbaar.'), n('w', 'Voorgestelde brug', 'De bestelling vertrekt op maandag.', 'orange', true), n('c', 'Standpunt', 'Gebruik extra bescherming.', 'green')], [e('r', 'w', 'geen duidelijke verbinding', 'challenge'), e('w', 'c', 'rechtvaardiging ontbreekt', 'challenge')])),
    ],
  },
  'basis-argument-of-uitleg': {
    title: 'Dezelfde gebeurtenis, een andere gespreksvraag', invitation: 'Wissel de context. Welke uitspraak staat werkelijk ter discussie?', sourceId: 'govier', variants: [
      v('explanation', 'De storing staat vast', 'Iedereen accepteert dat de printer uitviel. De losse verbinding wordt aangeboden om de bekende gebeurtenis te verklaren. De pijl stelt hier een voorgestelde oorzaak voor.', f([['p'], ['c']], [n('p', 'Voorgestelde oorzaak', 'Er zat een los contact in de printer.'), n('c', 'Bekende gebeurtenis', 'De printer viel vanochtend uit.', 'green')], [e('p', 'c', 'kan de storing verklaren', 'cause')], 'Hier gaat de pijl over een mogelijke oorzaak, niet over ondersteuning van een betwiste conclusie.')),
      v('argument', 'De storing wordt betwijfeld', 'Nu moet de spreker aannemelijk maken dat er een storing was. Het log en de meldingen fungeren als redenen. Het woord “omdat” alleen bepaalt de functie niet.', f([['p1', 'p2'], ['i'], ['c']], [n('p1', 'Reden', 'Het log registreert uitval om 09.10 uur.'), n('p2', 'Reden', 'Twee teamleden melden dezelfde uitval.'), n('i', 'Afleiding', 'Deze gegevens passen bij een storing.', 'purple', true), n('c', 'Betwiste conclusie', 'De printer viel vanochtend uit.', 'green')], [e('p1', 'i', 'ondersteunt de afleiding'), e('p2', 'i', 'ondersteunt de afleiding'), e('i', 'c', 'maakt uitval aannemelijk')])),
    ],
  },
  'basis-verborgen-premissen': {
    title: 'Een feit wordt pas met een waarde een advies', invitation: 'Vergelijk een verdedigbare brug met een te sterke garantie.', sourceId: 'govier', variants: [
      v('balanced', 'Feit, effect en waarde', 'Een besloten hoek kan hoorbaarheid verminderen. Het advies gebruikt daarnaast de waarde dat klantprivacy bescherming verdient. Kosten en uitvoering kunnen nog meetellen.', f([['d', 'w'], ['i'], ['c']], [n('d', 'Effectverwachting', 'In een besloten hoek horen voorbijgangers minder.'), n('w', 'Normatieve brug', 'Klantprivacy verdient bescherming.', 'purple'), n('i', 'Afweging', 'Dit privacyvoordeel telt voor de keuze.', 'purple', true), n('c', 'Voorwaardelijk advies', 'Kies een besloten hoek als die uitvoerbaar is.', 'green')], [e('d', 'i', 'genoemd voordeel'), e('w', 'i', 'maakt het voordeel belangrijk', 'authorize'), e('i', 'c', 'draagt het beperkte advies')])),
      v('overreach', 'Van minder naar nooit', 'Minder hoorbaarheid ondersteunt geen garantie dat nooit informatie uitlekt. Deze reconstructie maakt de conclusie sterker dan de gegeven reden rechtvaardigt.', f([['d'], ['i'], ['c']], [n('d', 'Genoemd effect', 'Voorbijgangers horen minder van het gesprek.'), n('i', 'Te grote sprong', 'Minder hoorbaar betekent volledig veilig.', 'orange', true), n('c', 'Te sterke claim', 'Er kan nooit klantinformatie uitlekken.', 'orange')], [e('d', 'i', 'de beperking verdwijnt', 'challenge'), e('i', 'c', 'ongegronde garantie', 'challenge')])),
    ],
  },
  'basis-argumentstructuur': {
    title: 'Samen, afzonderlijk of achter elkaar', invitation: 'Vergelijk waar de premissen op uitkomen; tel geen pijlen als overtuigingsscore.', sourceId: 'groarke', variants: [
      v('linked', 'Samenwerkende premissen', 'De regel en het concrete geval dragen samen één afleiding. Zonder één van beide is deze route incompleet, ook als de conclusie op een andere manier verdedigbaar blijft.', f([['p1', 'p2'], ['i'], ['c']], [n('p1', 'Algemene regel', 'Elk bevestigd tijdslot staat in het rooster.'), n('p2', 'Concreet geval', 'Tijdslot J is bevestigd.'), n('i', 'Eén gezamenlijke stap', 'Pas de regel op J toe.', 'purple', true), n('c', 'Conclusie', 'J staat in het rooster.', 'green')], [e('p1', 'i', 'regel'), e('p2', 'i', 'geval'), e('i', 'c', 'leidt samen tot')])),
      v('convergent', 'Afzonderlijke routes', 'Elke reden biedt een eigen route naar het voorstel. Een route kan enige steun geven zonder alleen voldoende te zijn. De twee routes zijn niet automatisch statistisch onafhankelijk.', f([['p1', 'p2'], ['i1', 'i2'], ['c']], [n('p1', 'Reden 1', 'Later overleggen helpt de avonddienst.'), n('p2', 'Reden 2', 'Later overleggen voorkomt een zaalconflict.'), n('i1', 'Route 1', 'Toegankelijkheid', 'purple', true), n('i2', 'Route 2', 'Planning', 'purple', true), n('c', 'Voorstel', 'Plan het overleg een uur later.', 'green')], [e('p1', 'i1', 'eigen grond'), e('p2', 'i2', 'eigen grond'), e('i1', 'c', 'ondersteunt'), e('i2', 'c', 'ondersteunt')])),
      v('serial', 'Een tussenconclusie', 'De tussenconclusie krijgt eerst steun en wordt daarna zelf een reden voor een volgende stap. Kritiek op de eerste stap kan dus ook de latere onderbouwing raken.', f([['p'], ['i1'], ['m'], ['i2'], ['c']], [n('p', 'Gegeven', 'Twee noodzakelijke taken overlappen.'), n('i1', 'Stap 1', 'Vergelijk taken en beschikbare tijd.', 'purple', true), n('m', 'Tussenconclusie', 'De huidige planning is te krap.', 'green'), n('i2', 'Stap 2', 'Een haalbare planning verdient voorrang.', 'purple', true), n('c', 'Voorstel', 'Bespreek een latere deadline.', 'green')], [e('p', 'i1', 'gegeven'), e('i1', 'm', 'tussenresultaat'), e('m', 'i2', 'wordt nu een reden'), e('i2', 'c', 'ondersteunt het voorstel')])),
    ],
  },
  'basis-kritiek-en-herstel': {
    title: 'Richt kritiek op de stap die misgaat', invitation: 'Vergelijk een persoonlijke afwijzing met een inhoudelijke reparatie.', sourceId: 'tindale', variants: [
      v('attack', 'De persoon vervangt de reden', 'Dit bezwaar beoordeelt de voorkeur van de collega, niet de kosten van het voorstel. Leg het ontbrekende verband uit in plaats van alleen een drogredennaam te noemen.', f([['p'], ['i'], ['c']], [n('p', 'Persoonlijke typering', 'Mara houdt niet van verandering.', 'orange'), n('i', 'Onbewezen sprong', 'Dus haar kostenbezwaar telt niet.', 'orange', true), n('c', 'Besluit', 'Voer het voorstel direct in.', 'green')], [e('p', 'i', 'geen antwoord op de kosten', 'challenge'), e('i', 'c', 'laat het bezwaar liggen', 'challenge')])),
      v('repair', 'De kwetsbare stap herstellen', 'Deze reactie controleert het aangevoerde kostenbezwaar. Een kleine proef is een beperkt voorstel met een concrete grens, geen bewijs dat volledige uitrol goed zal uitpakken.', f([['p1', 'p2'], ['i'], ['c']], [n('p1', 'Controle', 'De extra kosten passen binnen het proefbudget.'), n('p2', 'Beperking', 'De proef kan zonder grote vervolgkosten stoppen.'), n('i', 'Afweging', 'Een beperkte test is uitvoerbaar.', 'purple', true), n('c', 'Bescheiden voorstel', 'Probeer het één maand en beoordeel het resultaat.', 'green')], [e('p1', 'i', 'kostengrond'), e('p2', 'i', 'risicogrens'), e('i', 'c', 'draagt een beperkte stap')])),
    ],
  },
  'basis-voorwaarden-en-gevolgen': {
    title: 'De richting van “als” en “alleen als”', invitation: 'Kies een regel en probeer alle vier situaties. Welke combinatie spreekt haar tegen?', sourceId: 'govier', variants: [
      v('if', 'Als P, dan Q', 'Deze feitelijke regel verbindt goedkeuring met registratie. Registratie alleen bewijst geen goedkeuring: ook andere dossiers kunnen geregistreerd zijn.', { family: 'condition', rule: 'Als een dossier is goedgekeurd, is het geregistreerd.', p: 'Het dossier is goedgekeurd.', q: 'Het dossier is geregistreerd.', direction: 'if', application: 'P → Q. De combinatie P waar en Q onwaar is het tegenmodel van deze regel.' }),
      v('only-if', 'P alleen als Q', '“Goedgekeurd alleen als geregistreerd” noemt registratie als noodzakelijke voorwaarde voor goedkeuring. Deze formulering heeft opnieuw de richting P → Q; zij zegt niet Q → P.', { family: 'condition', rule: 'Een dossier is goedgekeurd alleen als het geregistreerd is.', p: 'Het dossier is goedgekeurd.', q: 'Het dossier is geregistreerd.', direction: 'only-if', application: 'P alleen als Q betekent P → Q. Test opnieuw alle vier combinaties.' }),
    ],
  },
  'basis-checkpoint': {
    title: 'Houd de conclusie binnen haar redenen', invitation: 'Vergelijk twee pitches over hetzelfde teamvoorstel.', sourceId: 'govier', variants: [
      v('large', 'Een grote belofte', 'Een positief geval kan een aanleiding zijn, maar is te weinig voor een garantie. De feiten, hun relevantie en de omvang van de conclusie verdienen elk een eigen controle.', checks('Dit overlegformat zal elk team altijd efficiënter maken.', [
        { title: 'Feit', question: 'Wat weten we?', observation: 'Eén team meldde een korter overleg.', state: 'question' },
        { title: 'Verbinding', question: 'Komt het door dit format?', observation: 'Een kortere agenda kan ook bijdragen.', state: 'question' },
        { title: 'Reikwijdte', question: 'Draagt dit “elk” en “altijd”?', observation: 'De claim gaat veel verder dan het geval.', state: 'problem' },
      ])),
      v('bounded', 'Een begrensd voorstel', 'Het voorstel past beter bij het beperkte bewijs. Ook een goede formulering vraagt echte gegevens en een eerlijke evaluatie; voorzichtig taalgebruik alleen maakt de reden niet sterk.', checks('Beproef het format in één vergelijkbaar team en vergelijk vooraf gekozen doelen.', [
        { title: 'Feit', question: 'Wat weten we?', observation: 'Een eerste team rapporteert een mogelijk voordeel.', state: 'question' },
        { title: 'Verbinding', question: 'Wat gaan we toetsen?', observation: 'Agenda, bezetting en overlegdoel worden meegenomen.', state: 'supported' },
        { title: 'Reikwijdte', question: 'Wat wordt beloofd?', observation: 'Een proef met een open uitkomst, geen garantie.', state: 'supported' },
      ])),
    ],
  },
  'bachelor-persoon-en-expertise': {
    title: 'Deskundigheid is gericht vertrouwen', invitation: 'Verander de bron; de conclusie wordt niet automatisch waar of onwaar.', sourceId: 'walton', variants: [
      v('expert', 'Passend vakgebied', 'Relevante ervaring en controleerbare gronden geven voorlopige steun. Vraag ook naar de precieze uitspraak en serieus afwijkende deskundige beoordelingen.', checks('Dit planningssysteem past bij onze werkprocessen.', [
        { title: 'Vakgebied', question: 'Kent de bron dit soort probleem?', observation: 'Een planner heeft vergelijkbare werkprocessen begeleid.', state: 'supported' },
        { title: 'Grond', question: 'Wat is precies vergeleken?', observation: 'Bezetting, taakduur en uitzonderingen worden getoond.', state: 'supported' },
        { title: 'Controle', question: 'Kunnen anderen dit beoordelen?', observation: 'De aannames zijn inzichtelijk; een tweede planner kijkt mee.', state: 'supported' },
      ])),
      v('fame', 'Bekend, maar buiten het vak', 'Bekendheid is geen expertise over elke vraag. Dit verzwakt het aangevoerde beroep op de bron, zonder de conclusie op zichzelf te weerleggen.', checks('Dit planningssysteem past bij onze werkprocessen.', [
        { title: 'Vakgebied', question: 'Kent de bron dit probleem?', observation: 'Een bekende presentator beveelt het merk aan.', state: 'problem' },
        { title: 'Grond', question: 'Is de aanbeveling onderbouwd?', observation: 'De specifieke werkprocessen worden niet vergeleken.', state: 'question' },
        { title: 'Controle', question: 'Kunnen we de claim toetsen?', observation: 'Vraag naar een passende bron en controleerbare gegevens.', state: 'question' },
      ])),
      v('interest', 'Expert met een belang', 'Een verkoopbelang vraagt om extra controle, geen automatische beschuldiging of weerlegging. Bekijk de gegevens en onafhankelijke beoordelingen.', checks('Dit planningssysteem past bij onze werkprocessen.', [
        { title: 'Vakgebied', question: 'Is er relevante kennis?', observation: 'De adviseur kent vergelijkbare systemen.', state: 'supported' },
        { title: 'Belang', question: 'Kan selectie van bewijs meespelen?', observation: 'De adviseur verdient aan de aanschaf.', state: 'question' },
        { title: 'Controle', question: 'Welke tegencontrole is passend?', observation: 'Vraag om mislukkingen, alternatieven en een onafhankelijke vergelijking.', state: 'question' },
      ])),
    ],
  },
  'bachelor-stropop-analogie': {
    title: 'Vergelijk precies wat ertoe doet', invitation: 'Bekijk een verdraaid voorstel en twee analogieën.', sourceId: 'tindale', variants: [
      v('straw', 'Het voorstel wordt groter gemaakt', 'De reactie valt een onbeperkte maatregel aan die niet is voorgesteld. Breng de discussie terug naar de werkelijke duur, omvang en voorwaarden.', { family: 'comparison', left: 'Werkelijk voorstel', right: 'Aangevallen versie', rows: [
        { feature: 'Omvang', left: 'Één team probeert thuiswerken.', right: 'Iedereen werkt altijd thuis.', relevance: 'De groep is zonder grond uitgebreid.' },
        { feature: 'Duur', left: 'Een proef van twee weken.', right: 'Een permanente regeling.', relevance: 'De beperking is verdwenen.' },
        { feature: 'Doel', left: 'Vergelijken wat voor dit team werkt.', right: 'De kantoorfunctie afschaffen.', relevance: 'Een andere bedoeling wordt toegeschreven.' },
      ], conclusion: 'Beoordeel de werkelijke proef, niet de grotere versie.' }),
      v('similar', 'Een relevante analogie', 'De overeenkomst raakt het mechanisme van het verwachte voordeel. Dat geeft voorlopige steun voor een vergelijkbare proef, geen garantie op hetzelfde resultaat.', { family: 'comparison', left: 'Team A', right: 'Team B', rows: [
        { feature: 'Werk', left: 'Individuele dossiercontrole.', right: 'Individuele dossiercontrole.', relevance: 'Vergelijkbare taakafhankelijkheid.' },
        { feature: 'Toegang', left: 'Veilige toegang tot dezelfde documenten.', right: 'Veilige toegang tot dezelfde documenten.', relevance: 'Een voorwaarde voor thuiswerken is vergelijkbaar.' },
        { feature: 'Ervaring', left: 'Dezelfde proef verkortte reistijd.', right: 'Nog geen eigen resultaat bekend.', relevance: 'Overdracht blijft een verwachting.' },
      ], conclusion: 'Een begrensde proef bij B verdient overweging.' }),
      v('difference', 'Een relevant verschil', 'Dit verschil raakt precies waarom de maatregel in het brongeval kon werken. Het bevraagt de overdracht, zonder alle analogieën of de conclusie te verbieden.', { family: 'comparison', left: 'Team A', right: 'Team B', rows: [
        { feature: 'Werk', left: 'Individuele documentcontrole.', right: 'Fysieke ontvangst van bezoekers.', relevance: 'Aanwezigheid speelt een andere rol.' },
        { feature: 'Zelfde logo', left: 'Hetzelfde organisatielogo.', right: 'Hetzelfde organisatielogo.', relevance: 'Deze overeenkomst verklaart het voordeel niet.' },
        { feature: 'Voorwaarde', left: 'Werk kan op afstand.', right: 'Een deel van het werk vereist de locatie.', relevance: 'Beperk of herontwerp het voorstel.' },
      ], conclusion: 'Dezelfde regeling volgt niet uit deze oppervlakkige overeenkomst.' }),
    ],
  },
  'bachelor-dilemma-helling-cirkel': {
    title: 'Maak de keuzeruimte en de steun zichtbaar', invitation: 'Vergelijk een derde route, een gevolgketen en een cirkel.', sourceId: 'tindale', variants: [
      v('dilemma', 'Er bestaat een derde route', '“Alles uitrollen of niets doen” is geen uitputtende keuzeruimte als een afgebakende proef uitvoerbaar is. Een derde optie moet zelf ook worden onderbouwd.', { family: 'decision', question: 'Hoe gaan we met het nieuwe format om?', criterion: 'Leer iets zonder onbeheersbare vervolgkosten.', options: [
        { id: 'all', title: 'Direct overal', benefit: 'Snel een uniforme werkwijze.', cost: 'Mislukking raakt alle teams.', condition: 'Sterk bewijs en een uitvoerbaar terugvalplan nodig.' },
        { id: 'none', title: 'Niets veranderen', benefit: 'Geen overstapkosten.', cost: 'Het huidige probleem blijft bestaan.', condition: 'Verdedig waarom bestaande nadelen acceptabel zijn.' },
        { id: 'trial', title: 'Een beperkte proef', benefit: 'Leer over één vergelijkbaar team.', cost: 'Begeleiding en tijd nodig.', condition: 'Vooraf doel, stopgrens en evaluatiemoment afspreken.' },
      ] }),
      v('slope', 'Iedere overgang heeft een grond nodig', 'Een keten van gevolgen is niet automatisch een drogreden. Hier ontbreken redenen waarom kleine veranderingen onvermijdelijk tot het zware eindgevolg leiden.', f([['a'], ['b'], ['c']], [n('a', 'Eerste stap', 'Eén flexibel overlegmoment.'), n('b', 'Voorspelde stap', 'Niemand houdt zich nog aan afspraken.', 'orange'), n('c', 'Voorspeld eindgevolg', 'Het team valt volledig uiteen.', 'orange')], [e('a', 'b', 'waarom onvermijdelijk?', 'challenge'), e('b', 'c', 'welke stopmogelijkheid ontbreekt?', 'challenge')])),
      v('circle', 'De conclusie keert terug als grond', 'De reden kan hier niet onafhankelijk van het betwiste standpunt worden aanvaard. Je krijgt de claim via andere woorden terug, geen nieuwe ondersteuning.', f([['c'], ['r']], [n('c', 'Betwist standpunt', 'Dit beleid is de juiste keuze.', 'green'), n('r', 'Aangevoerde reden', 'Het is goed beleid om dit te kiezen.', 'orange')], [e('r', 'c', 'herhaalt het oordeel'), e('c', 'r', 'wordt al aangenomen in de reden')])),
    ],
  },
  'bachelor-causaliteit-statistiek': {
    title: 'Een samenhang is nog geen oorzaak', invitation: 'Vergelijk de mogelijke verklaring en de gekozen noemer.', sourceId: 'schemes', variants: [
      v('association', 'Alleen een samenhang', 'Teams met de nieuwe tool registreren meer fouten. Dat patroon bepaalt nog niet welke factor de andere veroorzaakt; ook registratiekwaliteit of werkdruk kan meespelen.', f([['tool', 'errors']], [n('tool', 'Waarneming', 'Meer gebruik van de nieuwe tool.'), n('errors', 'Waarneming', 'Meer geregistreerde fouten.', 'orange')], [e('tool', 'errors', 'komen samen voor', 'association')], 'De stippellijn toont samenhang, geen bewezen causale richting.')),
      v('common', 'Een mogelijke gedeelde factor', 'Werkdruk kan zowel toolgebruik als geregistreerde fouten verhogen. Dit is een mogelijke alternatieve verklaring die je moet toetsen; de tekening bewijst ook deze oorzaak niet.', f([['pressure'], ['tool', 'errors']], [n('pressure', 'Mogelijke factor', 'Hoge werkdruk.'), n('tool', 'Mogelijk gevolg', 'Teams gebruiken de tool vaker.'), n('errors', 'Mogelijk gevolg', 'Meer geregistreerde fouten.', 'orange')], [e('pressure', 'tool', 'kan bijdragen', 'cause'), e('pressure', 'errors', 'kan bijdragen', 'cause')], 'Deze pijlen geven een te toetsen verklaring weer, geen zekerheid.')),
      v('denominator', 'Het aantal of de verhouding?', 'Meer meldingen kunnen samengaan met minder meldingen per werkuur. Kies een relevante, vergelijkbare noemer voordat je de verandering beoordeelt.', { family: 'frequency', mode: 'rate', unit: '100 werkuren', groups: [{ name: 'Oude werkwijze', count: 12, exposure: 100 }, { name: 'Nieuwe werkwijze', count: 18, exposure: 300 }] }),
    ],
  },
  'bachelor-geldigheid-en-tegenvoorbeelden': {
    title: '“Alle” zegt niet dat er iemand bestaat', invitation: 'Verander de verzameling en vergelijk de twee uitspraken.', sourceId: 'bowell', variants: [
      v('nonempty', 'Een groep met leden', 'Hier zijn er wel goedgekeurde dossiers, en elk daarvan is geregistreerd. Beide uitspraken zijn in dit voorbeeld waar; hun logische inhoud blijft verschillend.', { family: 'quantifiers', group: 'goedgekeurde dossiers', property: 'geregistreerd', claim: 'Alle goedgekeurde dossiers zijn geregistreerd.', people: [{ id: 'a', name: 'Dossier A', member: true, property: true }, { id: 'b', name: 'Dossier B', member: true, property: true }, { id: 'c', name: 'Dossier C', member: false, property: false }] }),
      v('empty', 'Een lege groep', 'Er is geen goedgekeurd dossier dat de algemene regel tegenspreekt. Toch volgt er niet dat een goedgekeurd dossier bestaat. Een bestaansaanname moet je apart geven.', { family: 'quantifiers', group: 'goedgekeurde dossiers', property: 'geregistreerd', claim: 'Alle goedgekeurde dossiers zijn geregistreerd.', people: [{ id: 'a', name: 'Dossier A', member: false, property: true }, { id: 'b', name: 'Dossier B', member: false, property: false }] }),
      v('counter', 'Een echt tegenvoorbeeld', 'Dossier B valt in de genoemde groep en mist de eigenschap. Dat weerlegt de algemene uitspraak in dit voorbeeld; een dossier buiten de groep zou dat niet doen.', { family: 'quantifiers', group: 'goedgekeurde dossiers', property: 'geregistreerd', claim: 'Alle goedgekeurde dossiers zijn geregistreerd.', people: [{ id: 'a', name: 'Dossier A', member: true, property: true }, { id: 'b', name: 'Dossier B', member: true, property: false }, { id: 'c', name: 'Dossier C', member: false, property: false }] }),
    ],
  },
  'bachelor-checkpoint': {
    title: 'Herstel het besluitargument op de juiste plek', invitation: 'Vergelijk drie verschillende zwakke plekken in een voorstel.', sourceId: 'tindale', variants: [
      v('source', 'De bron wordt het hele bewijs', 'Een naam of titel vraagt om toetsing aan dit specifieke probleem. Persoonlijke bewondering of irritatie vervangt geen beoordeling van vakgebied en gegevens.', checks('Koop systeem X; de bekende directeur raadt het aan.', [
        { title: 'Bron', question: 'Past haar kennis bij dit systeem?', observation: 'De titel alleen beantwoordt dit niet.', state: 'question' },
        { title: 'Grond', question: 'Wat ondersteunt haar advies?', observation: 'Vergelijkingsgegevens ontbreken.', state: 'problem' },
        { title: 'Reparatie', question: 'Welke aanvulling helpt?', observation: 'Vraag om gegevens over onze taken en alternatieven.', state: 'question' },
      ])),
      v('cause', 'Na deze stap, dus door deze stap?', 'De volgorde helpt een oorzaakclaim beoordelen, maar bewijst haar niet. Bekijk andere gelijktijdige veranderingen voordat je het voorstel daarop baseert.', f([['p1', 'p2'], ['i'], ['c']], [n('p1', 'Volgorde', 'Na de nieuwe tool kwamen minder klachten.'), n('p2', 'Andere verandering', 'Ook de bezetting werd uitgebreid.', 'orange'), n('i', 'Betwiste afleiding', 'De tool verklaart het hele verschil.', 'purple', true), n('c', 'Voorstel', 'Koop dezelfde tool voor elk team.', 'green')], [e('p1', 'i', 'aangevoerde samenhang'), e('p2', 'i', 'alternatieve verklaring', 'challenge'), e('i', 'c', 'nog onvoldoende voor uitrol')])),
      v('scope', 'Een passende beperking', 'Een zorgvuldige pitch benoemt het verwachte voordeel, de voorwaarden en de sterkste tegenwerping. Daarmee maak je de afweging controleerbaar, niet automatisch juist.', f([['d', 'o'], ['i'], ['c']], [n('d', 'Reden', 'Een kleine proef kan relevante ervaring opleveren.'), n('o', 'Tegenoverweging', 'Begeleiding kost tijd.', 'orange'), n('i', 'Afweging', 'Alleen binnen een vooraf afgesproken tijdsbudget.', 'purple', true), n('c', 'Voorstel', 'Start een beperkte proef met een stopgrens.', 'green')], [e('d', 'i', 'voordeel'), e('o', 'i', 'moet worden meegewogen', 'challenge'), e('i', 'c', 'begrenst het voorstel')])),
    ],
  },
  'master-toulmin-bewijslast': {
    title: 'Gegeven, brug en begrensde claim', invitation: 'Bekijk de rechtvaardiging, een uitzondering en wie redenen moet geven.', sourceId: 'schemes', variants: [
      v('toulmin', 'De onderdelen werken samen', 'Ruggensteun verdedigt de verbindingsregel; die autoriseert de stap van gegeven naar claim. Het voorbehoud begrenst de claim en is geen extra bewijs voor het gegeven.', f([['b'], ['d', 'w'], ['i'], ['c', 'q']], [n('b', 'Ruggensteun', 'Ons team geeft bereikbaarheid voorrang.', 'slate'), n('d', 'Gegeven', 'De avondwerkplek wordt vaak gebruikt.'), n('w', 'Verbindingsregel', 'Behoud gebruikte voorzieningen als dat uitvoerbaar is.', 'purple'), n('i', 'Toepassing', 'Gebruik + haalbaarheid → behoud.', 'purple', true), n('c', 'Claim', 'Behoud de avondwerkplek.', 'green'), n('q', 'Voorbehoud', 'Zolang gebruik en uitvoering passen.', 'green')], [e('b', 'w', 'ondersteunt de regel'), e('d', 'i', 'gegevens'), e('w', 'i', 'autoriseert de stap', 'authorize'), e('i', 'c', 'ondersteunt'), e('q', 'c', 'begrenst', 'qualify')])),
      v('exception', 'De regel heeft een uitzondering', 'Hier raakt het tekort aan toezicht de toepassing van de regel. Het ontkent niet het geobserveerde gebruik. Formuleer waarom deze uitzondering het voorbehoud raakt.', f([['d', 'w'], ['i', 'o'], ['c']], [n('d', 'Gegeven', 'De avondwerkplek wordt vaak gebruikt.'), n('w', 'Verbindingsregel', 'Behoud als de uitvoering haalbaar is.', 'purple'), n('i', 'Toepassing', 'Gebruik → behoud, mits haalbaar.', 'purple', true), n('o', 'Uitzondering', 'Het benodigde toezicht is niet beschikbaar.', 'orange'), n('c', 'Begrensde claim', 'Behoud alleen bij verantwoorde uitvoering.', 'green')], [e('d', 'i', 'gegevens'), e('w', 'i', 'autoriseert', 'authorize'), e('o', 'i', 'bevraagt de toepassing', 'challenge'), e('i', 'c', 'onder voorbehoud')])),
      v('burden', 'Twijfel of een tegenclaim?', 'De voorsteller moet de beloofde besparing verdedigen. Een criticus die alleen vraagt naar bewijs hoeft de onwaarheid niet te bewijzen; wie zelf verlies claimt, krijgt een eigen bewijslast.', checks('Deze regeling zal kosten besparen.', [
        { title: 'Voorsteller', question: 'Welke reden draagt de besparing?', observation: 'Geef de kostenvergelijking en de aannames.', state: 'question' },
        { title: 'Twijfel', question: 'Kan ik om die onderbouwing vragen?', observation: 'Ja, zonder eerst verlies te bewijzen.', state: 'supported' },
        { title: 'Tegenclaim', question: 'Ik zeg dat de regeling verlies veroorzaakt.', observation: 'Die eigen claim vraagt eigen redenen.', state: 'question' },
      ])),
    ],
  },
  'master-weerlegbare-argumenten': {
    title: 'Drie bezwaren, drie doelwitten', invitation: 'Wissel het bezwaar en volg waar de aanval eindigt.', sourceId: 'schemes', variants: [
      ...(['premise', 'inference', 'claim'] as const).map((target) => {
        const cases = {
          premise: { label: 'Het gegeven', text: 'Het log vermeldt 8, niet 80.', to: 'p', caption: 'Dit bezwaar betwist het aangevoerde gegeven. Zonder een juiste aflezing verliest deze route haar grond, maar de werkelijke temperatuur staat daarmee niet automatisch vast.' },
          inference: { label: 'De gevolgtrekking', text: 'De sensor is in deze situatie niet goed gekalibreerd.', to: 'i', caption: 'De aflezing kan kloppen terwijl de stap naar temperatuur onbetrouwbaar is. Deze undercut bevraagt de rechtvaardiging en bewijst niet automatisch dat de temperatuur laag is.' },
          claim: { label: 'De conclusie', text: 'Een betrouwbare tweede meting geeft een normale temperatuur.', to: 'c', caption: 'Dit is tegenovergesteld bewijs tegen de conclusie. Je moet de betrouwbaarheid en vergelijkbaarheid van beide metingen afwegen; een getekend bezwaar beslist dat niet voor je.' },
        };
        const item = cases[target];
        return v(target, item.label, item.caption, f([['p'], ['i', 'o'], ['c']], [n('p', 'Gegeven', 'Het aangevoerde log geeft 80 op de bedoelde schaal.'), n('i', 'Gevolgtrekking', 'Een betrouwbare aflezing duidt hier op hoge temperatuur.', 'purple', true), n('c', 'Conclusie', 'De temperatuur is hoog.', 'green'), n('o', 'Bezwaar', item.text, 'orange')], [e('p', 'i', 'aangevoerde aflezing'), e('i', 'c', 'via de meetaanname'), e('o', item.to, 'betwist dit doelwit', 'challenge')]));
      }),
    ],
  },
  'master-belangen-en-besluiten': {
    title: 'Een besluit verdeelt voordelen en nadelen', invitation: 'Kies een route en benoem welk belang de doorslag krijgt.', sourceId: 'govier', variants: [
      v('service', 'Bereikbaarheid voor klanten', 'Een keuze kan klanten helpen en tegelijk druk op het team verhogen. De afweging vraagt een expliciet criterium en een passende grens, geen optelsom van gekleurde vakken.', { family: 'decision', question: 'Moeten we ook in de avond klanten helpen?', criterion: 'Bereikbaarheid telt, binnen een werkbare belasting voor het team.', options: [
        { id: 'all', title: 'Elke avond', benefit: 'Klanten kunnen op veel momenten terecht.', cost: 'Meer inzet en minder herstelruimte.', condition: 'Voldoende bezetting en een aantoonbare avondvraag.' },
        { id: 'limited', title: 'Twee vaste avonden', benefit: 'Meer bereikbaarheid met voorspelbare roosters.', cost: 'Niet elke klant kan op die momenten.', condition: 'Vergelijk vraag, bezetting en teamafspraken.' },
        { id: 'digital', title: 'Terugbelmoment op afspraak', benefit: 'Inzet sluit aan op concrete behoefte.', cost: 'Minder spontane hulp.', condition: 'Een betrouwbaar afsprakensysteem en duidelijke verwachtingen.' },
      ] }),
      v('privacy', 'Snelheid en privacy', 'Dezelfde winst kan anders wegen wanneer een ander belang geraakt wordt. Benoem de beschermende voorwaarden, in plaats van een keuze als vanzelfsprekend voor iedereen te presenteren.', { family: 'comparison', left: 'Snellere dienstverlening', right: 'Bescherming van klantprivacy', rows: [
        { feature: 'Doel', left: 'Kortere wachttijd.', right: 'Persoonlijke gegevens beperkt delen.', relevance: 'Beide doelen kunnen legitiem zijn.' },
        { feature: 'Voorstel', left: 'Eén gedeeld klantoverzicht.', right: 'Alleen relevante rollen krijgen toegang.', relevance: 'Het ontwerp bepaalt of doelen samengaan.' },
        { feature: 'Tegenoverweging', left: 'Minder invoer maakt werk sneller.', right: 'Te brede toegang vergroot risico.', relevance: 'Verdedig waarom de toegang passend begrensd is.' },
      ], conclusion: 'Een beperkt overzicht met gerichte toegang kan beide doelen dienen, mits de grenzen werken.' }),
    ],
  },
  'master-bayes-basisfrequentie': {
    title: 'Verander de groep waarover je telt', invitation: 'Bekijk alle mail of alleen de markeringen. Hetzelfde filter geeft niet altijd dezelfde zekerheid.', sourceId: 'bowell', variants: [
      v('rare', 'Weinig spam', 'Het filter vindt 90% van de echte spam. Maar tussen alle markeringen zitten ook fout-positieven uit de veel grotere gewone-mailgroep. Sensitiviteit is niet de kans op spam na een markering.', { family: 'frequency', mode: 'conditional', population: 10000, prevalence: 0.01, sensitivity: 0.9, specificity: 0.95, condition: 'spam', signal: 'gemarkeerd' }),
      v('frequent', 'Meer spam, hetzelfde filter', 'De filterkwaliteit blijft gelijk terwijl de basisfrequentie verandert. Er komen nu relatief meer ware positieven in de gemarkeerde groep; dat verandert de gezochte verhouding.', { family: 'frequency', mode: 'conditional', population: 10000, prevalence: 0.2, sensitivity: 0.9, specificity: 0.95, condition: 'spam', signal: 'gemarkeerd' }),
      v('joint', 'Twee gedeeltelijk gedeelde signalen', 'Voor twee markeringen gebruiken we hier de gegeven gezamenlijke kansen: 85% bij spam en 4% bij gewone mail. Dat is iets anders dan twee aparte succespercentages vermenigvuldigen.', { family: 'frequency', mode: 'conditional', population: 10000, prevalence: 0.2, sensitivity: 0.85, specificity: 0.96, condition: 'spam', signal: 'door beide filters gemarkeerd' }),
    ],
  },
  'master-sterke-redeneringen': {
    title: 'Bewaar de voorwaarden door de hele keten', invitation: 'Vergelijk een complete beslisregel met een verdwenen voorwaarde.', sourceId: 'govier', variants: [
      v('complete', 'Alle dragende voorwaarden', 'Deze beleidsregel zegt wanneer een voorstel gerechtvaardigd is, niet dat mensen vanzelf handelen. Privacywinst én haalbaarheid dragen samen de beperkte vervolgproef; de overdracht van de eerdere ervaring blijft bespreekbaar.', f([['p', 'q'], ['i1'], ['m'], ['i2'], ['c']], [n('p', 'Eerdere ervaring', 'Een eerdere proef verminderde hoorbare klantgegevens.'), n('q', 'Uitvoering', 'Er is voldoende ruimte en bezetting.'), n('i1', 'Beslisregel', 'Bij dit privacyvoordeel en verantwoorde uitvoering is een beperkte vervolgproef gerechtvaardigd.', 'purple', true), n('m', 'Tussenconclusie', 'Een beperkte vervolgproef is verantwoord.', 'green'), n('i2', 'Volgende stap', 'Start met een duidelijke evaluatiegrens.', 'purple', true), n('c', 'Begrensd besluit', 'Start één maand; herzie bij tegenvallende uitvoering.', 'green')], [e('p', 'i1', 'effectvoorwaarde'), e('q', 'i1', 'uitvoerbaarheidsvoorwaarde'), e('i1', 'm', 'ondersteunt'), e('m', 'i2', 'grond voor een volgende stap'), e('i2', 'c', 'houdt de grens vast')])),
      v('missing', 'Eén voorwaarde verdwijnt', 'Een gewenst effect rechtvaardigt niet vanzelf elk middel. De onbekende capaciteit blijft een open voorwaarde; maak het besluit voorlopig of toets die voorwaarde eerst.', f([['p', 'q'], ['i'], ['c']], [n('p', 'Aangevoerd voordeel', 'De proef kan privacy verbeteren.'), n('q', 'Ontbrekende controle', 'Ruimte en bezetting zijn nog onbekend.', 'orange'), n('i', 'Te snelle stap', 'Een voordeel betekent dat uitrol haalbaar is.', 'orange', true), n('c', 'Te groot besluit', 'Voer het meteen overal in.', 'orange')], [e('p', 'i', 'één voorwaarde'), e('q', 'i', 'andere voorwaarde ontbreekt', 'challenge'), e('i', 'c', 'de beperking raakt kwijt', 'challenge')])),
    ],
  },
  'master-checkpoint': {
    title: 'Een sterke pitch toont ook haar grens', invitation: 'Vergelijk stellige zekerheid met een verdedigbaar besluit.', sourceId: 'govier', variants: [
      v('certainty', 'Een garantie zonder volledige grond', 'De pitch klinkt zeker maar laat uitvoering en bezwaren weg. Een passend voorbehoud is een inhoudelijke begrenzing van wat je verdedigt, geen teken van zwakte.', checks('Deze regeling zal zeker voor iedereen werken.', [
        { title: 'Feiten', question: 'Wat is daadwerkelijk bekend?', observation: 'Een beperkte proef liet een voordeel zien.', state: 'question' },
        { title: 'Afweging', question: 'Wie ondervindt nadelen?', observation: 'Extra werk voor begeleiders blijft onbesproken.', state: 'problem' },
        { title: 'Claim', question: 'Draagt dit zekerheid voor iedereen?', observation: 'De ervaring en voorwaarden zijn beperkter.', state: 'problem' },
      ])),
      v('decision', 'Een controleerbare afweging', 'Het besluit verbindt een gegeven, een waarde en een tegenwerping. De verantwoordelijke moet uitleggen waarom het voordeel onder deze grens zwaarder telt en wanneer herziening nodig is.', f([['d', 'w', 'o'], ['i'], ['c']], [n('d', 'Gegeven', 'De proef verkortte de wachttijd.'), n('w', 'Waarde', 'Bereikbaarheid is een belangrijk teamdoel.', 'purple'), n('o', 'Tegenoverweging', 'Begeleiding vraagt extra tijd.', 'orange'), n('i', 'Afweging', 'Alleen uitbreiden binnen de afgesproken capaciteit.', 'purple', true), n('c', 'Verdedigd besluit', 'Breid beperkt uit en herzie bij overschrijding.', 'green')], [e('d', 'i', 'aangevoerd voordeel'), e('w', 'i', 'maakt het voordeel belangrijk', 'authorize'), e('o', 'i', 'moet worden beantwoord', 'challenge'), e('i', 'c', 'draagt de begrensde keuze')])),
    ],
  },
};

/** Both Dutch forms represented here have the material-conditional direction P → Q. */
export function conditionalHolds(p: boolean, q: boolean): boolean { return !p || q; }

export function quantifierTruth(people: QuantifierIllustration['people']) {
  const members = people.filter((person) => person.member);
  return { all: members.every((person) => person.property), some: members.some((person) => person.property), none: members.every((person) => !person.property), members: members.length, counterexamples: members.filter((person) => !person.property).map((person) => person.id) };
}
