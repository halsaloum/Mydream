/**
 * De medeklinkers van het Standaardnederlands als klanktabel, zoals in het IPA-schema:
 * van links naar rechts van de lippen naar de keel, van boven naar onder van gesloten naar open.
 * Lessen gebruiken dezelfde tabel met een eigen opdracht (`q`, `targets`, `note`).
 */
export const CONSONANT_TABLE: {
  cols: string[];
  rows: string[];
  cells: { t: string; row: number; col: number; ex?: string }[];
} = {
  cols: ['lippen', 'lip-tand', 'tandkas', 'gehemelte', 'zacht gehemelte', 'keel'],
  rows: ['plofklank', 'wrijfklank', 'neusklank', 'liquida', 'glijklank'],
  cells: [
    { t: 'p', row: 0, col: 0, ex: 'pak' },
    { t: 'b', row: 0, col: 0, ex: 'bak' },
    { t: 't', row: 0, col: 2, ex: 'tak' },
    { t: 'd', row: 0, col: 2, ex: 'dak' },
    { t: 'k', row: 0, col: 4, ex: 'kat' },
    { t: 'f', row: 1, col: 1, ex: 'fiets' },
    { t: 'v', row: 1, col: 1, ex: 'vis' },
    { t: 's', row: 1, col: 2, ex: 'sok' },
    { t: 'z', row: 1, col: 2, ex: 'zon' },
    { t: 'x', row: 1, col: 4, ex: 'lach' },
    { t: 'ɣ', row: 1, col: 4, ex: 'gaan' },
    { t: 'ɦ', row: 1, col: 5, ex: 'huis' },
    { t: 'm', row: 2, col: 0, ex: 'mat' },
    { t: 'n', row: 2, col: 2, ex: 'nat' },
    { t: 'ŋ', row: 2, col: 4, ex: 'zing' },
    { t: 'l', row: 3, col: 2, ex: 'lat' },
    { t: 'r', row: 3, col: 2, ex: 'rat' },
    { t: 'ʋ', row: 4, col: 1, ex: 'wat' },
    { t: 'j', row: 4, col: 3, ex: 'jas' },
  ],
};
