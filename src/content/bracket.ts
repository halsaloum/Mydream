/**
 * Woordbomen als haakjesschrift: "[on [eet baar]]" is een binaire boom met de woorddelen als
 * bladeren. Puur, zodat het contract een boom kan controleren en de woordboom hetzelfde rekent.
 */

/** Een stuk van het woord: de bladeren `from` tot (niet tot en met) `to`. */
export type Span = { from: number; to: number };

export type BracketTree = {
  /** De woorddelen, van links naar rechts. */
  leaves: string[];
  /** Alle samengestelde knopen, van binnen naar buiten (de wortel als laatste). */
  nodes: (Span & { split: number })[];
};

/**
 * Leest "[on [eet baar]]". Elk paar haakjes bevat precies twee stukken; bladeren staan tussen
 * spaties of haakjes. Geeft `null` bij een ongeldige boom.
 */
export function parseBracket(source: string): BracketTree | null {
  const tokens = source.match(/\[|\]|[^\s[\]]+/g) ?? [];
  const leaves: string[] = [];
  const nodes: BracketTree['nodes'] = [];
  let at = 0;

  const read = (): Span | null => {
    const token = tokens[at++];
    if (token === undefined || token === ']') return null;
    if (token !== '[') {
      leaves.push(token);
      return { from: leaves.length - 1, to: leaves.length };
    }
    const left = read();
    const right = left && read();
    if (!left || !right || tokens[at++] !== ']') return null;
    nodes.push({ from: left.from, to: right.to, split: left.to });
    return { from: left.from, to: right.to };
  };

  const root = read();
  if (!root || at !== tokens.length || nodes.length === 0) return null;
  return { leaves, nodes };
}

/** De letters van een stuk, aan elkaar; bij een boom van hele woorden met spaties ertussen. */
export function spanText(tree: BracketTree, span: Span, words = false): string {
  return tree.leaves.slice(span.from, span.to).join(words ? ' ' : '');
}

/** Is dit stuk een knoop van de boom? */
export function isNode(tree: BracketTree, span: Span): boolean {
  return tree.nodes.some((node) => node.from === span.from && node.to === span.to);
}
