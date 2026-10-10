import { pair, type SoundPair } from '../vowels';

/**
 * De medeklinkers van het Standaardnederlands als klanktabel, zoals in het IPA-schema:
 * van links naar rechts van de lippen naar de keel, van boven naar onder van gesloten naar open.
 * Lessen gebruiken dezelfde tabel met een eigen opdracht (`q`, `targets`, `note`).
 */
export const CONSONANT_TABLE: {
  cols: string[];
  rows: string[];
  cells: { t: string; row: number; col: number; ex?: string; pair?: SoundPair }[];
} = {
  cols: ['lippen', 'lip-tand', 'tandkas', 'gehemelte', 'zacht gehemelte', 'keel'],
  rows: ['plofklank', 'wrijfklank', 'neusklank', 'liquida', 'glijklank'],
  cells: [
    { t: 'p', row: 0, col: 0, ex: 'pak', pair: pair('pak', 'p', 'bak', 'b') },
    { t: 'b', row: 0, col: 0, ex: 'bak', pair: pair('bak', 'b', 'pak', 'p') },
    { t: 't', row: 0, col: 2, ex: 'tak', pair: pair('tak', 't', 'dak', 'd') },
    { t: 'd', row: 0, col: 2, ex: 'dak', pair: pair('dak', 'd', 'tak', 't') },
    { t: 'k', row: 0, col: 4, ex: 'kat', pair: pair('kat', 'k', 'gat', 'ɣ') },
    { t: 'f', row: 1, col: 1, ex: 'fiets', pair: pair('fel', 'f', 'vel', 'v') },
    { t: 'v', row: 1, col: 1, ex: 'vis', pair: pair('vel', 'v', 'fel', 'f') },
    { t: 's', row: 1, col: 2, ex: 'sok', pair: pair('sus', 's', 'zus', 'z') },
    { t: 'z', row: 1, col: 2, ex: 'zon', pair: pair('zus', 'z', 'sus', 's') },
    { t: 'x', row: 1, col: 4, ex: 'lach', pair: pair('lach', 'x', 'lak', 'k') },
    { t: 'ɣ', row: 1, col: 4, ex: 'gaan', pair: pair('goud', 'ɣ', 'koud', 'k') },
    { t: 'ɦ', row: 1, col: 5, ex: 'huis', pair: pair('hoed', 'ɦ', 'goed', 'ɣ') },
    { t: 'm', row: 2, col: 0, ex: 'mat', pair: pair('mat', 'm', 'nat', 'n') },
    { t: 'n', row: 2, col: 2, ex: 'nat', pair: pair('nat', 'n', 'mat', 'm') },
    { t: 'ŋ', row: 2, col: 4, ex: 'zing', pair: pair('zing', 'ŋ', 'zin', 'n') },
    { t: 'l', row: 3, col: 2, ex: 'lat', pair: pair('lat', 'l', 'rat', 'r') },
    { t: 'r', row: 3, col: 2, ex: 'rat', pair: pair('rat', 'r', 'lat', 'l') },
    { t: 'ʋ', row: 4, col: 1, ex: 'wat', pair: pair('wat', 'ʋ', 'vat', 'v') },
    { t: 'j', row: 4, col: 3, ex: 'jas', pair: pair('jas', 'j', 'was', 'ʋ') },
  ],
};
