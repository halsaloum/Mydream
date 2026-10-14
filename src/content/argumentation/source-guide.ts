import { fallacySourceGuide } from './fallacies';

export type ArgumentSourceGuideEntry = {
  sourceId: string;
  title: string;
  authors: string;
  chapter: string;
  pages: string;
  concepts: string[];
  fileName?: string;
  note?: string;
};

// Grounded in the actual editions supplied by the learner, not publisher summaries.
// PDF locators count from the first page of each supplied file, including its cover.
// EPUBs have variable pagination: their verified chapter/section headings are used.
// Dutch explanations and workplace cases are original applications of these concepts.
const books = {
  govier: {
    title: 'A Practical Study of Argument · 7e druk (2010)',
    authors: 'Trudy Govier',
    fileName: 'A Practical Study of Argument , Seventh Edition (Trudy Govier) (z-library.sk, 1lib.sk, z-lib.sk).pdf',
  },
  groarke: {
    title: 'Good Reasoning Matters! · 5e druk (2013)',
    authors: 'Leo A. Groarke en Christopher W. Tindale',
    fileName: 'Good reasoning matters a constructive approach to critical thinking (Groarke, Leo, 1953-) (z-library.sk, 1lib.sk, z-lib.sk).pdf',
  },
  tindale: {
    title: 'Fallacies and Argument Appraisal (2007)',
    authors: 'Christopher W. Tindale',
    fileName: 'Fallacies and Argument Appraisal (Critical Reasoning and Argumentation) (Christopher W. Tindale) (z-library.sk, 1lib.sk, z-lib.sk).pdf',
  },
  walton: {
    title: 'Informal Logic: A Pragmatic Approach · 2e druk (2008)',
    authors: 'Douglas Walton',
    fileName: 'Informal Logic A Pragmatic Approach (Douglas Walton) (z-library.sk, 1lib.sk, z-lib.sk).pdf',
  },
  schemes: {
    title: 'Argumentation Schemes (2008)',
    authors: 'Douglas Walton, Chris Reed en Fabrizio Macagno',
    fileName: 'Argumentation Schemes (Douglas Walton, Professor Christopher Reed etc.) (z-library.sk, 1lib.sk, z-lib.sk).pdf',
  },
  pragma: {
    title: 'Argumentation, Communication, and Fallacies (1992)',
    authors: 'Frans H. van Eemeren en Rob Grootendorst',
    fileName: 'Argumentation, Communication, and Fallacies A Pragma-dialectical Perspective (Frans H. van Eemeren, Rob Grootendorst) (z-library.sk, 1lib.sk, z-lib.sk).epub',
  },
  bowell: {
    title: 'Critical Thinking: A Concise Guide · 5e druk (2020)',
    authors: 'Tracy Bowell, Robert Cowan en Gary Kemp',
    fileName: 'Critical Thinking A Concise Guide (Fifth Revised and Updated Edition) (Tracy Bowell, Gary Kemp, Robert Cowan) (z-library.sk, 1lib.sk, z-lib.sk).epub',
  },
} as const;

function book(sourceId: keyof typeof books, chapter: string, pages: string, concepts: string[], note?: string): ArgumentSourceGuideEntry {
  return { sourceId, ...books[sourceId], chapter, pages, concepts, ...(note ? { note } : {}) };
}

export const argumentSourceGuide: Record<string, ArgumentSourceGuideEntry[]> = {
  ...fallacySourceGuide,
  'basis-standpunt-en-reden': [
    book('govier', 'Hoofdstuk 1 · What Is an Argument?; Argument and Opinion; Argument and Indicator Words', 'PDF-pagina 17–20 · boekpagina 2–5', [
      'Een standpunt is wat je wilt laten aanvaarden; een reden wordt aangevoerd ter ondersteuning.',
      'Een mening met een reden vormt een argument, ook wanneer die reden nog zwak is.',
      'Woorden zoals “want” en “dus” helpen de richting herkennen.',
    ]),
    book('groarke', 'Hoofdstuk 1, §2 · Defining Argument', 'PDF-pagina 25–27 · boekpagina 7–9', [
      'Premissen en conclusie onderscheiden in een kort voorbeeld.',
      'Eerst herkennen wat het argument is, daarna beoordelen hoe goed het is.',
    ]),
  ],
  'basis-redenen-beoordelen': [
    book('govier', 'Hoofdstuk 4 · The ARG Conditions; More on the R and G Conditions', 'PDF-pagina 102–105 · boekpagina 87–90', [
      'Zijn de redenen aanvaardbaar, relevant en samen voldoende?',
      'Een relevant voorbeeld kan nog te weinig zijn voor een ruime conclusie.',
      'Een geldige gevolgtrekking vraagt daarnaast controle van de premissen.',
    ]),
    book('groarke', 'Hoofdstuk 8, §1–2 · Acceptable, Unacceptable, or Questionable?; Conditions of Acceptability', 'PDF-pagina 215–216 en 218–219 · boekpagina 197–198 en 200–201', [
      'Onderscheiden tussen onaanvaardbaar bewijs en bewijs waarvoor nog steun ontbreekt.',
      'Bij twijfel benoemen welke informatie je nodig hebt.',
    ]),
  ],
  'basis-verzwegen-stap': [
    book('govier', 'Hoofdstuk 2 · Unstated Premises', 'PDF-pagina 56–59 · boekpagina 41–44', [
      'De ontbrekende stap tussen een uitgesproken reden en het standpunt benoemen.',
      'Een toegevoegde aanname toetsen aan wat de spreker werkelijk zegt en bedoelt.',
    ]),
    book('groarke', 'Hoofdstuk 6, §3 · Hidden Premises', 'PDF-pagina 156–159 · boekpagina 138–141', [
      'Een betwistbare aanname zichtbaar maken zodat zij kan worden besproken.',
      'Een verborgen stap expliciteren maakt haar nog niet juist.',
    ]),
  ],
  'basis-argument-of-uitleg': [
    book('govier', 'Hoofdstuk 1 · Argument and Explanation: What’s the Difference?; hoofdstuk 2 · Standardizing an Argument', 'PDF-pagina 28–31 en 37 · boekpagina 13–16 en 22', [
      'Een conclusie rechtvaardigen onderscheiden van een aangenomen gebeurtenis verklaren.',
      'De functie van “omdat” beoordelen vanuit de context.',
      'Een tekst in herkenbare premissen en conclusie reconstrueren.',
    ]),
    book('groarke', 'Hoofdstuk 4, §4 · Arguments and Explanations; Arguments within Explanations', 'PDF-pagina 111–113 · boekpagina 93–95', [
      'Nagaan welke uitspraak ter discussie staat.',
      'Herkennen dat een verklaring zelf een argument kan bevatten.',
    ]),
  ],
  'basis-verborgen-premissen': [
    book('govier', 'Hoofdstuk 2 · Unstated Premises', 'PDF-pagina 56–59 · boekpagina 41–44', [
      'Een aanvulling verantwoorden met tekst en achtergrondkennis.',
      'De interpretatie van een argument onderscheiden van jouw verbeterde voorstel.',
    ]),
    book('groarke', 'Hoofdstuk 6, §3 · Hidden Premises', 'PDF-pagina 156–159 · boekpagina 138–141', [
      'De voorzichtigste tekstgetrouwe aanvulling zoeken.',
      'Geen sterker standpunt aan de spreker toeschrijven dan nodig is.',
    ]),
    book('walton', 'Hoofdstuk 5, §5.8 · Defeasible Reasoning', 'PDF-pagina 179–181 · boekpagina 159–161', [
      'Een strikte regel onderscheiden van een statistische of voorlopige generalisatie.',
      'De sterkte van de conclusie laten passen bij het soort steun.',
    ]),
  ],
  'basis-argumentstructuur': [
    book('groarke', 'Hoofdstuk 5, §3 · Linked and Convergent Premises', 'PDF-pagina 133–134 · boekpagina 115–116', [
      'Redenen die samen werken onderscheiden van afzonderlijke ondersteuningsroutes.',
      'Een reden wegdenken om haar rol in de reconstructie te onderzoeken.',
    ]),
    book('govier', 'Hoofdstuk 2 · Subarguments', 'PDF-pagina 39–43 · boekpagina 24–28', [
      'Een tussenconclusie herkennen als conclusie én premisse van een volgende stap.',
      'Iedere schakel van een keten afzonderlijk onderzoeken.',
    ]),
    book('schemes', 'Hoofdstuk 5, §9 · Dialectical and Bayesian Models of Causal Argumentation', 'PDF-pagina 198 · boekpagina 188', [
      'Verschillende items van bewijs niet zonder controle als onafhankelijk behandelen.',
    ], 'De kaart toont ondersteuningsrelaties. Het aantal pijlen meet geen bewijskracht en bewijst geen statistische onafhankelijkheid.'),
  ],
  'basis-voorwaarden-en-gevolgen': [
    book('govier', 'Hoofdstuk 8 · Only if; Necessary Condition; Sufficient Condition; Valid Moves in Propositional Logic', 'PDF-pagina 254–256 en 259–260 · boekpagina 239–241 en 244–245', [
      '“Als” onderscheiden van “alleen als”.',
      'Noodzakelijke en voldoende voorwaarden uit elkaar houden.',
      'Modus ponens, modus tollens en contrapositie onderscheiden van twee ongeldige omkeringen.',
    ]),
    book('bowell', 'Hoofdstuk 3 · Conditional propositions; Prescriptive claims vs descriptive claims; The connection to formal logic I', 'EPUB · hoofdstuk 3, genoemde paragrafen; geen vaste PDF-paginering', [
      'De richting van een voorwaardelijke uitspraak expliciteren.',
      'Een voorschrift onderscheiden van een feitelijk gegarandeerde gang van zaken.',
      'De vorm van een gevolgtrekking los van haar concrete onderwerp controleren.',
    ]),
  ],
  'basis-kritiek-en-herstel': [
    book('tindale', 'Hoofdstuk 1, §3–4 · Approaching Fallacies; Why Arguments Go Wrong and How They Fool Us', 'PDF-pagina 32–35 · boekpagina 12–15', [
      'Een drogreden uitleggen met het concrete probleem en de gesprekscontext.',
      'Geen bedoeling tot misleiding afleiden alleen omdat iemand een redeneerfout maakt.',
      'Kritische vragen gebruiken in plaats van alleen een etiket.',
    ]),
    book('govier', 'Hoofdstuk 4 · The ARG Conditions; Cogency, Soundness, and Validity', 'PDF-pagina 102–105 en 123 · boekpagina 87–90 en 108', [
      'Het gebrek lokaliseren in de premisse, relevantie of voldoende steun.',
      'Een mislukte verdediging onderscheiden van een onware conclusie.',
    ]),
  ],
  'basis-checkpoint': [
    book('govier', 'Hoofdstukken 1, 2 en 4 · Argumentherkenning, verborgen premissen en ARG', 'PDF-pagina 17–20, 56–59 en 102–105', ['De eerder geoefende begrippen combineren in nieuwe korte situaties.']),
    book('tindale', 'Hoofdstuk 1, §3 · Approaching Fallacies', 'PDF-pagina 32–34 · boekpagina 12–14', ['Een fout benoemen én uitleggen welke stap herzien moet worden.']),
  ],
  'bachelor-persoon-en-expertise': [
    book('walton', 'Hoofdstuk 6, §6.3 · The Attack on an Arguer’s Impartiality; hoofdstuk 7, §7.3 · Critical Questions for the Appeal to Expert Opinion', 'PDF-pagina 205–206 en 237–239 · boekpagina 185–186 en 217–219', [
      'Een belang kan reden zijn voor controle, zonder het standpunt daardoor te weerleggen.',
      'Expertise, toepasselijk vakgebied, precieze uitspraak, betrouwbaarheid, andere deskundigen en bewijs toetsen.',
    ]),
    book('schemes', 'Hoofdstuk 1, §2–3 · Argument from Position to Know and Expert Opinion; Critical Questions', 'PDF-pagina 23–26 · boekpagina 13–16', [
      'Een beroep op deskundigheid als voorlopige steun behandelen.',
      'Een gerichte vraag stellen zonder alle kennis van deskundigen te verwerpen.',
    ]),
    book('tindale', 'Hoofdstuk 5, §1 · Introduction', 'PDF-pagina 101–103 · boekpagina 81–83', ['Persoonlijke kritiek beoordelen op haar daadwerkelijke betekenis voor het argument.']),
  ],
  'bachelor-stropop-analogie': [
    book('tindale', 'Hoofdstuk 2, §1 · Straw Man; hoofdstuk 10, §1–2 · Principles of Analogy; False Analogy', 'PDF-pagina 39–40 en 214–217 · boekpagina 19–20 en 194–197', [
      'De aangevallen versie vergelijken met het werkelijke standpunt.',
      'Een illustratieve vergelijking onderscheiden van een gevolgtrekking uit analogie.',
      'Oppervlakkige overeenkomsten en relevante verschillen onderzoeken.',
    ]),
    book('schemes', 'Hoofdstuk 2, §4 · The Schemes for Argument from Analogy', 'PDF-pagina 65–67 · boekpagina 55–57', [
      'Brongeval, doelgeval en de overgedragen eigenschap onderscheiden.',
      'Verantwoorden waarom de vergelijking de betreffende conclusie ondersteunt.',
    ]),
  ],
  'bachelor-dilemma-helling-cirkel': [
    book('govier', 'Hoofdstuk 7 · Contrary and Contradictory Predicates and False Dichotomies', 'PDF-pagina 210–211 · boekpagina 195–196', [
      '“Niet voor” onderscheiden van “tegen”: tussenmogelijkheden kunnen bestaan.',
      'Controleren of twee aangeboden opties de werkelijke keuzeruimte uitputten.',
    ]),
    book('tindale', 'Hoofdstuk 4, §8–9 · Begging the Question; hoofdstuk 9, §5–6 · The Fallacy of the Slippery Slope', 'PDF-pagina 92–95 en 205–208 · boekpagina 72–75 en 185–188', [
      'Nagaan of de reden onafhankelijk van de conclusie kan worden aanvaard.',
      'Een keten van gevolgen niet automatisch een drogreden noemen.',
      'Iedere overgang, mogelijke stop en waardering van het eindgevolg onderzoeken.',
    ]),
  ],
  'bachelor-causaliteit-statistiek': [
    book('schemes', 'Hoofdstuk 5, §4 · Argument from Correlation to Cause', 'PDF-pagina 183–185 · boekpagina 173–175', [
      'Een samenhang onderscheiden van een voldoende onderbouwde oorzaakclaim.',
      'Omgekeerde richting, gemeenschappelijke oorzaken, toepassingsgrenzen en veranderde definities toetsen.',
    ]),
    book('walton', 'Hoofdstuk 8, §8.1 · Meaningless and Unknowable Statistics', 'PDF-pagina 267–269 · boekpagina 247–249', [
      'Vragen hoe cijfers zijn verzameld en wat de gebruikte termen precies betekenen.',
      'Schijnprecisie herkennen wanneer de gegevens een exact percentage niet dragen.',
    ], 'De cijfers in onze werkcasus en het lab zijn eigen telvoorbeelden. Zij laten het probleem oefenen; het getoonde verschil bewijst op zichzelf geen oorzaak.'),
  ],
  'bachelor-geldigheid-en-tegenvoorbeelden': [
    book('govier', 'Hoofdstuk 4 · Cogency, Soundness, and Validity; hoofdstuk 7 · Categorical Logic: Some Philosophical Background', 'PDF-pagina 123 en 212–214 · boekpagina 108 en 197–199', [
      'Geldigheid onderscheiden van waarheid van de premissen.',
      'Een algemene uitspraak onderscheiden van een uitspraak die bestaan claimt.',
      'Een bestaansaanname expliciet toevoegen wanneer de context die vereist.',
    ]),
    book('bowell', 'Hoofdstuk 3 · Deductive validity; How to judge validity; The connection to formal logic II: Venn diagrams', 'EPUB · hoofdstuk 3, genoemde paragrafen; geen vaste PDF-paginering', [
      'Een mogelijke situatie zoeken waarin de premissen waar en de conclusie onwaar zijn.',
      '“Alle”, “sommige” en “geen” nauwkeurig onderscheiden.',
      'Een tegenvoorbeeld tegen de gevolgtrekking onderscheiden van kritiek op een feitelijke premisse.',
    ]),
  ],
  'bachelor-checkpoint': [
    book('tindale', 'Hoofdstukken 4, 5, 9 en 10 · Cirkelredenering, persoonlijke kritiek, gevolgen en analogie', 'PDF-pagina 92–95, 101–103, 205–208 en 214–217', ['De kwetsbare stap in een overtuigend voorstel gericht aanwijzen.']),
    book('schemes', 'Hoofdstuk 1, §2–3; hoofdstuk 5, §4 · Deskundigheid en oorzaakclaims', 'PDF-pagina 23–26 en 183–185', ['Passende kritische vragen selecteren en de conclusie binnen haar bewijs houden.']),
  ],
  'master-toulmin-bewijslast': [
    book('schemes', 'Hoofdstuk 1 · Introducing Argumentation Schemes; Enthymemes, Schemes, and Critical Questions; Argument Diagramming Tools', 'PDF-pagina 19, 29 en 33 · boekpagina 9, 19 en 23', [
      'De verbindingsregel tussen gegevens en conclusie expliciteren.',
      'Kwalificaties en kritische vragen koppelen aan een voorlopige gevolgtrekking.',
    ]),
    book('pragma', 'Hoofdstuk 1 · Studies of Argumentation; hoofdstuk 4 · Stages in the Resolution of a Dispute; hoofdstuk 10 · Being Obliged to Defend a Standpoint; Shifting the Burden of Proof', 'EPUB · hoofdstukken 1, 4 en 10, genoemde paragrafen; geen vaste PDF-paginering', [
      'Warrants en backing in context beoordelen; hun labels niet mechanisch aan woorden toewijzen.',
      'Een standpunt verdedigen onderscheiden van alleen twijfel uitspreken.',
      'Bewijslast niet zonder grond op de criticus afschuiven.',
    ], 'De zes vakken van onze Toulmin-oefening zijn een eigen werkvorm. De aangeleverde teksten dragen vooral de verbindingsregel, ruggensteun, kwalificatie en contextgevoelige beoordeling.'),
    book('walton', 'Hoofdstuk 1, §1.1 en §1.3 · Types of Argumentative Dialogue; Persuasion Dialogue', 'PDF-pagina 26–28 en 32–33 · boekpagina 6–8 en 12–13', [
      'Feiten toetsen, overtuigen, onderhandelen en samen kiezen hebben verschillende doelen.',
      'Iemand die een tegengesteld standpunt aanvoert heeft een andere verplichting dan iemand die alleen bevraagt.',
    ]),
  ],
  'master-weerlegbare-argumenten': [
    book('walton', 'Hoofdstuk 5, §5.8 · Defeasible Reasoning', 'PDF-pagina 179–181 · boekpagina 159–161', [
      'Een voorlopige gevolgtrekking herzien wanneer een relevante uitzondering bekend wordt.',
      'Een strikte regel, statistische generalisatie en normale verwachting onderscheiden.',
    ]),
    book('schemes', 'Hoofdstuk 7, §3–4 · Newer Theories of Refutation; Argumentation Schemes and Critical Questions', 'PDF-pagina 251–257 · boekpagina 241–247', [
      'Kritiek op een premisse, tegenbewijs tegen de conclusie en kritiek op de verbinding onderscheiden.',
      'Een undercut tast een rechtvaardiging aan zonder daarmee de tegengestelde conclusie te bewijzen.',
      'Het precieze doelwit verantwoorden: impliciete premissen en verbindingsregels kunnen anders worden gereconstrueerd.',
    ]),
  ],
  'master-belangen-en-besluiten': [
    book('govier', 'Hoofdstuk 12 · The Nature of Conductive Arguments; Counterconsiderations and Conductive Arguments; Evaluating Conductive Arguments', 'PDF-pagina 367–372 en 374 · boekpagina 352–357 en 359', [
      'Afzonderlijke redenen samen met relevante tegenoverwegingen beoordelen.',
      'Een bezwaar erkennen zonder het automatisch als doorslaggevend te behandelen.',
      'De betekenis van redenen wegen in plaats van alleen hun aantal tellen.',
    ]),
    book('schemes', 'Hoofdstuk 3, §2 · Practical Reasoning; hoofdstuk 9, §19 · Argumentation from Values', 'PDF-pagina 104–106 en 331–332 · boekpagina 94–96 en 321–322', [
      'Doelen, alternatieve middelen, uitvoerbaarheid en neveneffecten expliciteren.',
      'Een waardeconflict onderscheiden van een verschil over feiten.',
      'Verantwoorden waarom juist deze afweging het besluit draagt.',
    ]),
  ],
  'master-bayes-basisfrequentie': [
    book('bowell', 'Hoofdstuk 4 · Probability; Conversion of induction to deduction; Conditional probability in the conclusion; The connection to probability theory; hoofdstuk 7 · The base rate fallacy', 'EPUB · hoofdstukken 4 en 7, genoemde paragrafen; geen vaste PDF-paginering', [
      'De kans op een kenmerk binnen een groep onderscheiden van de kans op groepslidmaatschap bij dat kenmerk.',
      'Een basisfrequentie behouden wanneer je met nieuw bewijs redeneert.',
      'Een conclusie controleren door alle relevante gevallen uit dezelfde populatie te tellen.',
      'Een voorwaardelijke kans berekenen binnen de gevallen die aan de gegeven voorwaarde voldoen.',
    ], 'Het boek gebruikt onder meer een populatietelling rond partijlidmaatschap en vegetarisme. Onze signaalcasus en de posterior-odds/LR-berekening zijn eigen toepassingen en uitbreidingen, geen overgenomen boekvoorbeeld of boekformule.'),
    book('schemes', 'Hoofdstuk 5, §9 · Dialectical and Bayesian Models of Causal Argumentation', 'PDF-pagina 196–198 · boekpagina 186–188', [
      'Onzekere bewijsweging niet zonder goede grond in precieze getallen omzetten.',
      'Controleren of verschillende items van bewijs afhankelijk kunnen zijn.',
    ], 'Deze paragraaf bespreekt het nut en de grenzen van Bayesiaanse modellen; zij geeft geen stapsgewijze afleiding van onze rekenformule.'),
  ],
  'master-sterke-redeneringen': [
    book('govier', 'Hoofdstuk 2 · Subarguments; hoofdstuk 8 · Valid Moves in Propositional Logic; hoofdstuk 12 · Counterconsiderations and Conductive Arguments', 'PDF-pagina 39–43, 259–260 en 370–372 · boekpagina 24–28, 244–245 en 355–357', [
      'De hele keten controleren en de zwakke schakel aanwijzen.',
      'Gecombineerde voorwaarden samen behouden.',
      'De sterkste relevante tegenoverweging opnemen in de afweging.',
    ]),
    book('schemes', 'Hoofdstuk 3, §2 · Practical Reasoning; hoofdstuk 9, §19 · Argumentation from Values', 'PDF-pagina 104–106 en 331–332 · boekpagina 94–96 en 321–322', [
      'Een effect verbinden met een doel en een verdedigbare waardeafweging.',
      'Alternatieven, andere doelen, uitvoerbaarheid en schadelijke neveneffecten toetsen.',
      'Het besluit beperken tot wat de redenen en voorwaarden dragen.',
    ]),
  ],
  'master-checkpoint': [
    book('govier', 'Hoofdstuk 12 · Conductive Arguments and Counterconsiderations', 'PDF-pagina 367–372 en 374 · boekpagina 352–357 en 359', ['Een besluit verdedigen met redenen, bezwaren en een expliciete afweging.']),
    book('walton', 'Hoofdstuk 1 · Types of Argumentative Dialogue; hoofdstuk 5, §5.8 · Defeasible Reasoning', 'PDF-pagina 26–28 en 179–181', ['Het gespreksdoel en de voorwaarden voor herziening duidelijk maken.']),
    book('bowell', 'Hoofdstuk 4 · Probability; Conditional probability in the conclusion', 'EPUB · hoofdstuk 4, genoemde paragrafen; geen vaste PDF-paginering', ['Onzekerheid en voorwaardelijk bewijs uitleggen zonder het signaal met de conclusie te verwarren.']),
  ],
};
