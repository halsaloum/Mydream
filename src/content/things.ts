/**
 * De 3D-voorwerpen ("dingen") van pennig, gemaakt met Meshy in de stijl van glanzend speelgoed
 * (zie `scripts/meshy-dingen.mjs`). Elk ding heeft een model (GLB) en een icoon (WebP) in
 * `public/models/dingen/`. Lessen verwijzen naar een ding met zijn naam. `word` is hoe het ding
 * in de les heet: twee dingen kunnen hetzelfde woord hebben (de bank om op te zitten en de bank
 * voor geld), dat is juist de les bij homonymie.
 */
export const THINGS = {
  pim: { word: 'Pim', label: 'Pim het potlood' },
  boek: { word: 'boek', label: 'een blauw boek' },
  kast: { word: 'kast', label: 'een lege houten kast' },
  boekenkast: { word: 'boekenkast', label: 'een boekenkast vol gekleurde boeken' },
  pan: { word: 'pan', label: 'een koekenpan' },
  koek: { word: 'koek', label: 'een ronde koek' },
  pannenkoek: { word: 'pannenkoek', label: 'een stapel pannenkoeken met boter en poedersuiker' },
  zon: { word: 'zon', label: 'een gele zon' },
  bloem: { word: 'bloem', label: 'een roze bloem' },
  zonnebloem: { word: 'zonnebloem', label: 'een zonnebloem' },
  pot: { word: 'pot', label: 'een lege terracotta pot' },
  bloempot: { word: 'bloempot', label: 'een bloempot met een roze bloem' },
  visser: { word: 'visser', label: 'een visser in een gele regenjas' },
  boot: { word: 'boot', label: 'een rode roeiboot' },
  vissersboot: { word: 'vissersboot', label: 'een blauwe vissersboot met een net' },
  ster: { word: 'ster', label: 'een gouden ster' },
  mus: { word: 'mus', label: 'een bruine mus' },
  roodborst: { word: 'roodborst', label: 'een roodborstje met een oranje borst' },
  pinguin: { word: 'pinguïn', label: 'een pinguïn' },
  struisvogel: { word: 'struisvogel', label: 'een struisvogel met lange roze poten' },
  kip: { word: 'kip', label: 'een witte kip' },
  vleermuis: { word: 'vleermuis', label: 'een bruine vleermuis met gespreide vleugels' },
  muis: { word: 'muis', label: 'een grijze muis (het dier)' },
  computermuis: { word: 'computermuis', label: 'een witte computermuis' },
  zitbank: { word: 'bank', label: 'een groene bank om op te zitten' },
  geldbank: { word: 'bank', label: 'een bankgebouw met een kluisdeur en geldmunten' },
  hangslot: { word: 'slot', label: 'een hangslot' },
  kasteel: { word: 'slot', label: 'een sprookjeskasteel met twee torens' },
  glas: { word: 'glas', label: 'een leeg drinkglas' },
  ei: { word: 'ei', label: 'een bruin ei' },
  mes: { word: 'mes', label: 'een keukenmes' },
  huis: { word: 'huis', label: 'een huis met een rood dak' },
  munten: { word: 'munten', label: 'een stapeltje gouden munten' },
  vis: { word: 'vis', label: 'een zilveren vis' },
} as const;

export type ThingId = keyof typeof THINGS;

export const THING_IDS = Object.keys(THINGS) as [ThingId, ...ThingId[]];

export const thingModel = (id: ThingId) => `/models/dingen/${id}.glb`;
export const thingIcon = (id: ThingId) => `/models/dingen/${id}.webp`;
