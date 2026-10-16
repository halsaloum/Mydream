import type { SortExercise } from './types';
import type { ArgumentMap, ArgumentNodeKind } from '@/lib/argumentation/maps';

type Template = {
  kinds: Record<string, ArgumentNodeKind>;
  extra?: ArgumentMap['nodes'];
  inferences: ArgumentMap['inferences'];
  attacks?: ArgumentMap['attacks'];
  qualifiers?: Record<string, string>;
  note: string;
};

/** Explicit, authored relations. Category names are never guessed into graph semantics. */
const templates: Record<string, Template> = {
  'ba2-bruggen': {
    kinds: { feit: 'premise', empirisch: 'assumption', norm: 'warrant', advies: 'claim' },
    inferences: [{ id: 'i-policy', from: ['feit', 'empirisch'], to: 'advies', warrant: 'norm', label: 'Effectverwachting → advies' }],
    note: 'De pilotuitkomst en de gereconstrueerde effectverwachting dragen samen de stap. De normatieve verbindingsregel rechtvaardigt de overgang naar beleid; de feitelijke uitkomst alleen doet dat niet.',
  },
  'bh2-analogie-kaart': {
    kinds: { bron: 'premise', doel: 'premise', brug: 'assumption', verschil: 'objection' },
    extra: [{ id: 'c-analogy', kind: 'claim', text: 'Het buurthuis kan verantwoord meetinstrumenten uitlenen.' }],
    inferences: [{ id: 'i-analogy', from: ['bron', 'doel', 'brug'], to: 'c-analogy', label: 'Analogische overdracht' }],
    attacks: [{ id: 'a-disanalogy', from: 'verschil', to: 'i-analogy', kind: 'undercut' }],
    note: 'Het relevante verschil bevraagt de overdracht tussen gevallen. Het ontkent daarmee niet vanzelf het brongeval of de conclusie. Kijk of het verschil precies de veronderstelde overeenkomst raakt.',
  },
  'ma1-toulmin-map': {
    kinds: { data: 'premise', claim: 'claim', warrant: 'warrant', backing: 'backing', qualifier: 'qualifier', rebuttal: 'objection' },
    qualifiers: { qualifier: 'claim' },
    inferences: [
      { id: 'i-toulmin', from: ['data'], to: 'claim', warrant: 'warrant', label: 'Toepassing van de verbindingsregel' },
      { id: 'i-backing', from: ['backing'], to: 'warrant', label: 'Onderbouwing van de regel' },
    ],
    attacks: [{ id: 'a-exception', from: 'rebuttal', to: 'i-toulmin', kind: 'undercut' }],
    note: 'In deze reconstructie begrenst de uitzondering de toepassing van de verbindingsregel. Een andere casus kan een uitzondering als bezwaar tegen de claim weergeven. De kwalificatie hoort bij de claim; backing ondersteunt de warrant.',
  },
  'ma2-aanvallen': {
    kinds: { premisse: 'objection', rebuttal: 'objection', undercut: 'objection' },
    extra: [
      { id: 'p-reading', kind: 'premise', text: 'De sensor zou volgens het aangevoerde log een waarde van 80 aangeven.' },
      { id: 'w-reading', kind: 'warrant', text: 'Als deze sensor en meetschaal hier betrouwbaar zijn, duidt een aflezing van 80 binnen de gebruikte schaal op een hoge temperatuur.' },
      { id: 'c-reading', kind: 'claim', text: 'De temperatuur is hoog.' },
    ],
    inferences: [{ id: 'i-reading', from: ['p-reading'], to: 'c-reading', warrant: 'w-reading', label: 'Aflezing → temperatuur' }],
    attacks: [
      { id: 'a-premise', from: 'premisse', to: 'p-reading', kind: 'premise' },
      { id: 'a-rebuttal', from: 'rebuttal', to: 'c-reading', kind: 'rebuttal' },
      { id: 'a-undercut', from: 'undercut', to: 'i-reading', kind: 'undercut' },
    ],
    note: 'De drie bezwaren hebben verschillende doelen. Een premisseaanval betwist het gegeven, een tegenconclusie valt de claim aan en een undercut bevraagt de gevolgtrekking. De verbindingsregel maakt ook de aanname over de meetschaal zichtbaar; die moet apart worden gerechtvaardigd. Een getekende aanval is nog geen geslaagde weerlegging.',
  },
};

export function exerciseDiagram(exercise: SortExercise, placements: Record<string, string>): { map: ArgumentMap; note: string } | null {
  const template = templates[exercise.id];
  if (!template) return null;
  const nodes = exercise.categories.map((category) => {
    const cards = exercise.cards.filter((card) => placements[card.id] === category.id);
    return {
      id: category.id,
      kind: template.kinds[category.id] ?? 'premise',
      text: cards.length ? cards.map((card) => card.text).join('\n\n') : `${category.label}: plaats hieronder de passende uitspraak.`,
      active: cards.length > 0,
      ...(template.qualifiers?.[category.id] ? { qualifies: template.qualifiers[category.id] } : {}),
    };
  });
  return { map: { nodes: [...nodes, ...(template.extra ?? [])], inferences: template.inferences, attacks: template.attacks ?? [] }, note: template.note };
}
