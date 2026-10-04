/** Kleine, deterministische hulpfuncties: vingerafdrukken van inhoud en reproduceerbaar schudden. */

/** FNV-1a (32 bit) als korte base36-string. Niet cryptografisch; alleen om inhoudswijzigingen te herkennen. */
export function fingerprint(value: unknown): string {
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Een vaste, geschudde volgorde van de indexen 0..n-1 voor een gegeven sleutel.
 * Dezelfde sleutel geeft altijd dezelfde volgorde (nodig voor hervatten na verversen)
 * en de volgorde is nooit al de goede volgorde.
 */
export function shuffledIndices(seedKey: string, n: number): number[] {
  const order = Array.from({ length: n }, (_, i) => i);
  if (n < 2) return order;
  const random = mulberry32(parseInt(fingerprint(seedKey), 36));
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  if (order.every((value, i) => value === i)) order.push(order.shift()!);
  return order;
}
