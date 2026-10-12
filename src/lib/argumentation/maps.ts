export type ArgumentNodeKind = 'claim' | 'premise' | 'assumption' | 'objection' | 'intermediate' | 'warrant' | 'backing' | 'qualifier';
export type ArgumentNode = { id: string; text: string; kind: ArgumentNodeKind; active?: boolean; qualifies?: string };
export type ArgumentInference = { id: string; from: string[]; to: string; warrant?: string; label?: string };
export type ArgumentAttack = { id: string; from: string; to: string; kind: 'rebuttal' | 'undercut' | 'premise'; rationale?: string };
export type ArgumentMap = { nodes: ArgumentNode[]; inferences: ArgumentInference[]; attacks: ArgumentAttack[] };
export type MapNode = ArgumentNode;
export type MapInference = ArgumentInference;
export type MapAttack = ArgumentAttack;

export const MAP_KIND_LABELS: Record<ArgumentNodeKind, string> = {
  claim: 'Standpunt', premise: 'Premisse / data', assumption: 'Gereconstrueerde aanname', objection: 'Tegenwerping', intermediate: 'Tussenconclusie', warrant: 'Verbindingsregel', backing: 'Ruggensteun', qualifier: 'Kwalificatie',
};

/** Validate this teaching workbench's acyclic support grammar, not the whole AIF ontology. */
export function validateArgumentMap(map: ArgumentMap): string[] {
  const errors: string[] = [];
  const nodes = new Map(map.nodes.map((node) => [node.id, node]));
  const inferenceIds = new Set(map.inferences.map((inference) => inference.id));
  const ids = [...map.nodes, ...map.inferences, ...map.attacks].map((entry) => entry.id);
  if (new Set(ids).size !== ids.length) errors.push('Elke uitspraak, afleiding en aanval moet een eigen identificatie hebben.');
  for (const inference of map.inferences) {
    if (!inference.from.length) errors.push(`${inference.id}: kies minstens één dragende uitspraak.`);
    if (new Set(inference.from).size !== inference.from.length) errors.push(`${inference.id}: dezelfde uitspraak mag niet dubbel meetellen.`);
    if (!nodes.has(inference.to) || inference.from.some((id) => !nodes.has(id))) errors.push(`${inference.id}: een verbonden uitspraak ontbreekt.`);
    if (inference.from.includes(inference.to)) errors.push(`${inference.id}: een uitspraak kan hier niet haar eigen rechtvaardiging zijn.`);
    if (inference.warrant && !nodes.has(inference.warrant)) errors.push(`${inference.id}: de verbindingsregel ontbreekt.`);
    if (inference.warrant && inference.from.includes(inference.warrant)) errors.push(`${inference.id}: gebruik een verbindingsregel als autorisatie van de stap, niet tegelijk als gewone data.`);
  }
  const signatures = map.inferences.map((inference) => JSON.stringify([inference.to, [...inference.from].sort(), inference.warrant ?? '']));
  if (new Set(signatures).size !== signatures.length) errors.push('Dezelfde afleiding staat al op de kaart. Haar herhalen voegt geen afzonderlijke grond toe.');
  for (const attack of map.attacks) {
    if (!nodes.has(attack.from)) errors.push(`${attack.id}: de uitspraak met de tegenwerping ontbreekt.`);
    if (attack.kind === 'undercut' ? !inferenceIds.has(attack.to) : !nodes.has(attack.to)) errors.push(`${attack.id}: een undercut richt zich op een afleiding; de andere aanvallen richten zich op een uitspraak.`);
  }
  for (const node of map.nodes) {
    if (node.qualifies && !nodes.has(node.qualifies)) errors.push(`${node.id}: het gekwalificeerde standpunt ontbreekt.`);
  }
  const dependencies = new Map<string, string[]>();
  for (const inference of map.inferences) dependencies.set(inference.to, [...(dependencies.get(inference.to) ?? []), ...inference.from, ...(inference.warrant ? [inference.warrant] : [])]);
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const cyclic = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    if ((dependencies.get(id) ?? []).some(cyclic)) return true;
    visiting.delete(id);
    visited.add(id);
    return false;
  };
  if (map.nodes.some((node) => cyclic(node.id))) errors.push('Deze werkbank houdt ondersteuningsroutes acyclisch. Een cirkel levert hier geen onafhankelijke rechtvaardiging.');
  return [...new Set(errors)];
}

/** Structural completeness is deliberately independent of whether an attack succeeds. */
export function analyzeArgumentMap(map: ArgumentMap) {
  const nodes = new Map(map.nodes.map((node) => [node.id, node]));
  const memo = new Map<string, boolean>();
  const available = (id: string, trail = new Set<string>()): boolean => {
    if (memo.has(id)) return memo.get(id)!;
    const node = nodes.get(id);
    if (!node || node.active === false || !node.text.trim() || trail.has(id)) return false;
    const incoming = map.inferences.filter((inference) => inference.to === id);
    if (!incoming.length) return node.kind !== 'intermediate';
    const next = new Set(trail).add(id);
    const result = incoming.some((inference) => inference.from.every((source) => available(source, next)) && (!inference.warrant || available(inference.warrant, next)));
    memo.set(id, result);
    return result;
  };
  const inferences = map.inferences.map((inference) => {
    const required = [...inference.from, ...(inference.warrant ? [inference.warrant] : [])];
    const missing = required.filter((source) => !available(source));
    const destination = nodes.get(inference.to);
    if (!destination || destination.active === false || !destination.text.trim()) missing.push(inference.to);
    const attacks = map.attacks.filter((attack) => { const source = nodes.get(attack.from); return source && source.active !== false && source.text.trim() && (attack.to === inference.id || attack.to === inference.to || required.includes(attack.to)); });
    return { id: inference.id, complete: missing.length === 0, missing, attacks };
  });
  const completeRoutes = (claim: string) => {
    const target = nodes.get(claim);
    return !target || target.active === false || !target.text.trim() ? 0 : inferences.filter((state) => state.complete && map.inferences.find((inference) => inference.id === state.id)?.to === claim).length;
  };
  return { inferences, completeRoutes };
}

export function deactivateArgumentNode(map: ArgumentMap, id: string): ArgumentMap {
  return { ...map, nodes: map.nodes.map((node) => node.id === id ? { ...node, active: false } : { ...node }) };
}

/** Content → inference connector → content, with explicit warrant/qualifier attachments. */
export function argumentMapRanks(map: ArgumentMap): { id: string; type: 'node' | 'inference'; rank: number }[] {
  const items = [...map.nodes.map((node) => ({ id: node.id, type: 'node' as const })), ...map.inferences.map((inference) => ({ id: inference.id, type: 'inference' as const }))];
  const ranks = new Map(items.map((item) => [item.id, 0]));
  const edges: [string, string][] = [];
  for (const inference of map.inferences) {
    for (const from of inference.from) edges.push([from, inference.id]);
    if (inference.warrant) edges.push([inference.warrant, inference.id]);
    edges.push([inference.id, inference.to]);
  }
  for (const node of map.nodes) if (node.qualifies) edges.push([node.id, node.qualifies]);
  // A defensive bound also makes an externally supplied cyclic diagram renderable.
  for (let pass = 0; pass < items.length; pass++) {
    let changed = false;
    for (const [from, to] of edges) {
      const next = Math.min(items.length, (ranks.get(from) ?? 0) + 1);
      if (next > (ranks.get(to) ?? 0)) { ranks.set(to, next); changed = true; }
    }
    if (!changed) break;
  }
  const lastRank = Math.max(0, ...ranks.values());
  for (const node of map.nodes) if (node.kind === 'objection') ranks.set(node.id, lastRank + 1);
  return items.map((item) => ({ ...item, rank: ranks.get(item.id) ?? 0 }));
}

export type ArgumentMapPreset = ArgumentMap & { id: 'linked' | 'convergent' | 'serial' | 'toulmin'; title: string; description: string; investigation: string; claimId: string };
export const ARGUMENT_MAP_PRESETS: ArgumentMapPreset[] = [
  {
    id: 'linked', title: 'Gekoppeld', description: 'Twee uitspraken vormen samen één afleiding. Hun aantal zegt niets over een numerieke bewijskracht.', investigation: 'Schakel de feitelijke premisse uit: kan alleen de algemene norm deze concrete conclusie nog dragen?', claimId: 'c',
    nodes: [
      { id: 'p1', kind: 'premise', text: 'Als teamleden voor hun avonddienst een stille werkplek nodig hebben en geen alternatief hebben, moet de projectruimte dan toegankelijk zijn.' },
      { id: 'p2', kind: 'premise', text: 'Deze teamleden hebben tijdens hun avonddienst een stille werkplek nodig en beschikken niet over een alternatief.' },
      { id: 'c', kind: 'claim', text: 'De projectruimte moet tijdens de avonddienst toegankelijk blijven.' },
      { id: 'o', kind: 'objection', text: 'Het nieuwe kantoor biedt dezelfde teamleden inmiddels wel een stille werkplek tijdens de avonddienst.' },
    ], inferences: [{ id: 'i1', from: ['p1', 'p2'], to: 'c', label: 'I1 · norm + situatie' }], attacks: [],
  },
  {
    id: 'convergent', title: 'Convergent', description: 'Twee afzonderlijke afleidingen ondersteunen hetzelfde standpunt. Een betwiste route verwijdert niet automatisch de andere.', investigation: 'Schakel één premisse uit en zoek de route die nog overblijft. Kan die zelfstandig de conclusie verdedigen?', claimId: 'c',
    nodes: [
      { id: 'p1', kind: 'premise', text: 'Avondtoegang geeft teamleden met late klantafspraken alsnog een stille werkplek.' },
      { id: 'p2', kind: 'premise', text: 'De proefperiode laat zien dat de stille werkplekken ook in de avond intensief gebruikt worden.' },
      { id: 'c', kind: 'claim', text: 'Behoud de avondtoegang tot de projectruimte.' },
      { id: 'o', kind: 'objection', text: 'De proefperiode viel in een uitzonderlijke deadlineweek; dit gebruik voorspelt niet zomaar de behoefte in andere weken.' },
    ], inferences: [{ id: 'i1', from: ['p1'], to: 'c', label: 'I1 · toegang' }, { id: 'i2', from: ['p2'], to: 'c', label: 'I2 · gebruik → behoefte' }], attacks: [],
  },
  {
    id: 'serial', title: 'Serieel', description: 'Een tussenconclusie is eerst het resultaat van een afleiding en daarna zelf een dragende uitspraak.', investigation: 'Onderbreek de eerste afleiding. Welke latere stap raakt daardoor ook onderbouwd materiaal kwijt?', claimId: 'c',
    nodes: [
      { id: 'p1', kind: 'premise', text: 'Deelnemers aan de proefperiode gebruikten de stille werkplekken in de avond veelvuldig.' },
      { id: 'p2', kind: 'assumption', text: 'De deelnemers aan de proefperiode geven een voldoende betrouwbaar beeld van het hele team.' },
      { id: 'm', kind: 'intermediate', text: 'Het team heeft waarschijnlijk structurele behoefte aan stille werkplekken in de avond.' },
      { id: 'p3', kind: 'premise', text: 'Een structurele werkbehoefte hoort, mits uitvoerbaar, met passende voorzieningen te worden ondersteund.' },
      { id: 'c', kind: 'claim', text: 'Maak de avondtoegang tot de projectruimte structureel, mits uitvoerbaar.' },
      { id: 'o', kind: 'objection', text: 'Voor de proefperiode meldden zich vooral teamleden die thuis geen geschikte werkplek hebben.' },
    ], inferences: [{ id: 'i1', from: ['p1', 'p2'], to: 'm', label: 'I1 · generalisatie' }, { id: 'i2', from: ['m', 'p3'], to: 'c', label: 'I2 · behoefte → voorziening' }], attacks: [],
  },
  {
    id: 'toulmin', title: 'Toulmin', description: 'Data dragen een claim via een verbindingsregel. Ruggensteun verdedigt de regel; een kwalificatie begrenst de claim.', investigation: 'Verbind de uitzondering met de toepassing van de regel. Leg uit waarom zij daarmee niet alle data ontkent.', claimId: 'c',
    nodes: [
      { id: 'd', kind: 'premise', text: 'Tijdens de proefperiode zijn de stille werkplekken in de avond vrijwel voortdurend gebruikt.' },
      { id: 'w', kind: 'warrant', text: 'Een structureel gebruikte teamvoorziening hoort beschikbaar te blijven, zolang de uitvoering haalbaar is.' },
      { id: 'b', kind: 'backing', text: 'Onze teamafspraken geven prioriteit aan toegankelijke voorzieningen voor aantoonbare werkbehoeften.' },
      { id: 'q', kind: 'qualifier', text: 'Voorlopig, onder voorwaarde dat gebruik en uitvoerbaarheid voldoende blijven.', qualifies: 'c' },
      { id: 'c', kind: 'claim', text: 'Behoud de avondtoegang tot de projectruimte.' },
      { id: 'o', kind: 'objection', text: 'Het benodigde toezicht kan in de komende periode niet verantwoord worden georganiseerd.' },
    ], inferences: [{ id: 'i1', from: ['d'], to: 'c', warrant: 'w', label: 'I1 · toepassing van de regel' }, { id: 'i2', from: ['b'], to: 'w', label: 'I2 · ruggensteun' }], attacks: [],
  },
];
