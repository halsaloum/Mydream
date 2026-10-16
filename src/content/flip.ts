/**
 * De draailetters b, d, p en q: vier grafemen die als voorwerp één vorm zijn. Spiegelen om de
 * staande as wisselt links en rechts (b ↔ d), kantelen om de liggende as wisselt boven en onder
 * (b ↔ p), en een halve slag in het vlak doet allebei (b ↔ q).
 */
export const FLIP_LETTERS = ['b', 'd', 'p', 'q'] as const;

export type FlipLetter = (typeof FLIP_LETTERS)[number];

/** Een stand van de tegel: gespiegeld (links-rechts) en/of gekanteld (boven-onder). */
export type FlipPose = { mirrored: boolean; tilted: boolean };

const POSE: Record<FlipLetter, FlipPose> = {
  b: { mirrored: false, tilted: false },
  d: { mirrored: true, tilted: false },
  p: { mirrored: false, tilted: true },
  q: { mirrored: true, tilted: true },
};

/** Welke letter je ziet als je de beginletter zo neerlegt. */
export function flipLetter(start: FlipLetter, pose: FlipPose): FlipLetter {
  const base = POSE[start];
  const mirrored = base.mirrored !== pose.mirrored;
  const tilted = base.tilted !== pose.tilted;
  return FLIP_LETTERS.find((letter) => POSE[letter].mirrored === mirrored && POSE[letter].tilted === tilted)!;
}

/**
 * De stand na een aantal halve slagen om elke as. Een halve slag om de staande as spiegelt,
 * om de liggende as kantelt, en in het vlak doet hij allebei.
 */
export function poseOf(turnsX: number, turnsY: number, turnsZ: number): FlipPose {
  const odd = (n: number) => Math.abs(Math.round(n)) % 2 === 1;
  return { mirrored: odd(turnsY) !== odd(turnsZ), tilted: odd(turnsX) !== odd(turnsZ) };
}
