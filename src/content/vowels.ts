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
  /**
   * Een minimaal paar om het verschil te horen: een woord met deze klinker en een woord dat
   * alleen in die klinker verschilt, met de klank waarmee hij het vaakst verward wordt.
   */
  pair: SoundPair;
};

/** Twee woorden die maar in één klank verschillen, met hun klanken in IPA. */
export type SoundPair = [{ word: string; sound: string }, { word: string; sound: string }];

export const pair = (word: string, sound: string, other: string, otherSound: string): SoundPair => [
  { word, sound },
  { word: other, sound: otherSound },
];

export const VOWEL_INFO: Record<Vowel, VowelInfo> = {
  i: { word: 'piet', spelling: 'ie', traits: 'hoog · voor · gespannen, maar kort', pair: pair('piet', 'i', 'pit', 'ɪ') },
  y: { word: 'fuut', spelling: 'uu, u', traits: 'hoog · voor · rond · gespannen, maar kort', pair: pair('fuut', 'y', 'fut', 'ʏ') },
  u: { word: 'boek', spelling: 'oe', traits: 'hoog · achter · rond · gespannen, maar kort', pair: pair('voer', 'u', 'vuur', 'y') },
  ɪ: { word: 'pit', spelling: 'i', traits: 'bijna hoog · voor · ongespannen', pair: pair('pit', 'ɪ', 'piet', 'i') },
  ʏ: { word: 'put', spelling: 'u', traits: 'bijna hoog · centraal · rond · ongespannen', pair: pair('put', 'ʏ', 'pit', 'ɪ') },
  eː: { word: 'beet', spelling: 'ee, e', traits: 'halfgesloten · voor · gespannen', pair: pair('beet', 'eː', 'bijt', 'ɛi') },
  øː: { word: 'neus', spelling: 'eu', traits: 'halfgesloten · voor · rond · gespannen', pair: pair('deur', 'øː', 'door', 'oː') },
  oː: { word: 'boot', spelling: 'oo, o', traits: 'halfgesloten · achter · rond · gespannen', pair: pair('boot', 'oː', 'bot', 'ɔ') },
  ə: { word: 'de', spelling: 'e, i, ij', traits: 'midden · centraal · sjwa, nooit beklemtoond', pair: pair('te', 'ə', 'thee', 'eː') },
  ɛ: { word: 'bed', spelling: 'e', traits: 'halfopen · voor · ongespannen', pair: pair('bed', 'ɛ', 'beet', 'eː') },
  ɔ: { word: 'pot', spelling: 'o', traits: 'halfopen · achter · rond · ongespannen', pair: pair('pot', 'ɔ', 'poot', 'oː') },
  aː: { word: 'baan', spelling: 'aa, a', traits: 'open · voor · gespannen', pair: pair('baan', 'aː', 'ban', 'ɑ') },
  ɑ: { word: 'bal', spelling: 'a', traits: 'open · achter · ongespannen', pair: pair('bal', 'ɑ', 'baal', 'aː') },
  ɛi: { word: 'wijn', spelling: 'ij, ei', traits: 'tweeklank · van ɛ naar i', pair: pair('bijt', 'ɛi', 'beet', 'eː') },
  œy: { word: 'huis', spelling: 'ui', traits: 'tweeklank · van œ naar y', pair: pair('buit', 'œy', 'bout', 'ʌu') },
  ʌu: { word: 'koud', spelling: 'ou, au', traits: 'tweeklank · van ʌ naar u', pair: pair('bout', 'ʌu', 'buit', 'œy') },
};
