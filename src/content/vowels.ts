/**
 * De klinkers van het Standaardnederlands zoals de klinkerkaart ze toont, in IPA.
 * Lesinhoud verwijst naar deze tekens (`vowels.targets`); de kaart weet zelf waar ze staan.
 */
export const VOWELS = ['i', 'y', 'u', 'ɪ', 'ʏ', 'eː', 'øː', 'oː', 'ə', 'ɛ', 'ɔ', 'aː', 'ɑ', 'ɛi', 'œy', 'ʌu'] as const;

export type Vowel = (typeof VOWELS)[number];

/** Tweeklanken: ze staan niet op één plek, maar glijden van de ene naar de andere. */
export const DIPHTHONGS: readonly Vowel[] = ['ɛi', 'œy', 'ʌu'];

export type VowelInfo = {
  /** Voorbeeldwoord met deze klinker. */
  word: string;
  /** Hoe je de klinker meestal schrijft. */
  spelling: string;
  /** Hoe je hem maakt: hoogte, plaats, ronding, spanning. */
  traits: string;
};

export const VOWEL_INFO: Record<Vowel, VowelInfo> = {
  i: { word: 'piet', spelling: 'ie', traits: 'hoog · voor · gespannen, maar kort' },
  y: { word: 'fuut', spelling: 'uu, u', traits: 'hoog · voor · rond · gespannen, maar kort' },
  u: { word: 'boek', spelling: 'oe', traits: 'hoog · achter · rond · gespannen, maar kort' },
  ɪ: { word: 'pit', spelling: 'i', traits: 'bijna hoog · voor · ongespannen' },
  ʏ: { word: 'put', spelling: 'u', traits: 'bijna hoog · centraal · rond · ongespannen' },
  eː: { word: 'beet', spelling: 'ee, e', traits: 'halfgesloten · voor · gespannen' },
  øː: { word: 'neus', spelling: 'eu', traits: 'halfgesloten · voor · rond · gespannen' },
  oː: { word: 'boot', spelling: 'oo, o', traits: 'halfgesloten · achter · rond · gespannen' },
  ə: { word: 'de', spelling: 'e, i, ij', traits: 'midden · centraal · sjwa, nooit beklemtoond' },
  ɛ: { word: 'bed', spelling: 'e', traits: 'halfopen · voor · ongespannen' },
  ɔ: { word: 'pot', spelling: 'o', traits: 'halfopen · achter · rond · ongespannen' },
  aː: { word: 'baan', spelling: 'aa, a', traits: 'open · voor · gespannen' },
  ɑ: { word: 'bal', spelling: 'a', traits: 'open · achter · ongespannen' },
  ɛi: { word: 'wijn', spelling: 'ij, ei', traits: 'tweeklank · van ɛ naar i' },
  œy: { word: 'huis', spelling: 'ui', traits: 'tweeklank · van œ naar y' },
  ʌu: { word: 'koud', spelling: 'ou, au', traits: 'tweeklank · van ʌ naar u' },
};
