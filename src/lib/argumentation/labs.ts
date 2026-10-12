export type StructureMode = 'linked' | 'independent';
export type StructureState = {
  mode: StructureMode;
  firstReason: boolean;
  secondReason: boolean;
  warrant: boolean;
  objection: boolean;
};

/** Structural support only: this deliberately does not assign a truth score. */
export function describeStructure(state: StructureState) {
  const remainingReasons = Number(state.firstReason) + Number(state.secondReason);
  const hasPath = state.warrant && (state.mode === 'linked' ? remainingReasons === 2 : remainingReasons > 0);
  if (!state.warrant) {
    return {
      status: 'De brug ontbreekt in het schema',
      explanation: 'De redenen zijn zichtbaar, maar de verbindingsregel is niet opgenomen. Welke impliciete aanname maakt de stap naar de conclusie begrijpelijk? De reconstructie laat die stap nu open; dat maakt de conclusie zelf nog niet onjuist.',
      hasPath,
    };
  }
  if (!hasPath) {
    return {
      status: state.mode === 'linked' ? 'De gezamenlijke route is onderbroken' : 'Er is geen reden meer actief',
      explanation: state.mode === 'linked'
        ? 'Deze twee redenen werken samen. Zonder de belofte óf het probleem met deze video levert deze route geen volledige ondersteuning. De conclusie kan nog steeds kloppen, maar deze onderbouwing is incompleet.'
        : 'Beide zelfstandige redenen zijn uitgeschakeld. De verbindingsregel alleen zegt nog niet waarom deze video ondertiteling moet krijgen.',
      hasPath,
    };
  }
  if (state.objection) {
    return {
      status: 'Ondersteund, maar aanvechtbaar',
      explanation: 'Er is een ondersteuningsroute én een bezwaar tegen de toepassing ervan. Dat vraagt om een antwoord of een voorbehoud. Een bezwaar bewijst niet automatisch dat de conclusie onjuist is.',
      hasPath,
    };
  }
  return {
    status: state.mode === 'linked' ? 'Eén gezamenlijke ondersteuningsroute' : `${remainingReasons} zelfstandige ondersteuningsroute${remainingReasons === 1 ? '' : 's'}`,
    explanation: state.mode === 'linked'
      ? 'De belofte en het concrete toegankelijkheidsprobleem ondersteunen samen de conclusie, via de verbindingsregel. De normatieve regel kan nog worden betwist; een compleet schema garandeert geen ware conclusie.'
      : 'Elke actieve reden kan via de verbindingsregel de conclusie ondersteunen. Zet één reden uit: de andere route blijft bestaan. Of een reden overtuigt, hangt af van haar aanvaardbaarheid en relevantie.',
    hasPath,
  };
}

export type CausalityRow = {
  id: 'prepared' | 'beginner';
  label: string;
  lessonTotal: number;
  lessonSuccess: number;
  controlTotal: number;
  controlSuccess: number;
  lessonRate: number;
  controlRate: number;
};

/** Synthetic data, with a constant 10 percentage-point difference within each group. */
export function calculateCausality(preparedPercent: number, balanced = false) {
  const share = balanced ? 0.5 : Math.min(0.95, Math.max(0.05, preparedPercent / 100));
  const conditionSize = 1000;
  const rows: CausalityRow[] = [
    { id: 'prepared', label: 'Veel ervaring', lessonTotal: conditionSize * share, controlTotal: conditionSize * (1 - share), lessonRate: 0.9, controlRate: 0.8, lessonSuccess: 0, controlSuccess: 0 },
    { id: 'beginner', label: 'Weinig ervaring', lessonTotal: conditionSize * (1 - share), controlTotal: conditionSize * share, lessonRate: 0.3, controlRate: 0.2, lessonSuccess: 0, controlSuccess: 0 },
  ].map((row) => ({ ...row, lessonSuccess: row.lessonTotal * row.lessonRate, controlSuccess: row.controlTotal * row.controlRate } as CausalityRow));
  const lessonSuccess = rows.reduce((sum, row) => sum + row.lessonSuccess, 0);
  const controlSuccess = rows.reduce((sum, row) => sum + row.controlSuccess, 0);
  const lessonRate = lessonSuccess / conditionSize;
  const controlRate = controlSuccess / conditionSize;
  return { rows, conditionSize, lessonSuccess, controlSuccess, lessonRate, controlRate, difference: lessonRate - controlRate, reversed: lessonRate < controlRate, preparedShare: share };
}

export type BayesResult = {
  population: number;
  signal: number;
  noSignal: number;
  truePositive: number;
  falseNegative: number;
  falsePositive: number;
  trueNegative: number;
  positives: number;
  posterior: number | null;
};

/** Expected frequencies; rounding belongs only in the presentation layer. */
export function calculateBayes(prevalence: number, sensitivity: number, specificity: number, population = 10_000): BayesResult {
  const values = [prevalence, sensitivity, specificity];
  if (values.some((value) => !Number.isFinite(value) || value < 0 || value > 1) || !Number.isFinite(population) || population <= 0) {
    throw new RangeError('Probabilities must be between 0 and 1, and population must be positive.');
  }
  const signal = population * prevalence;
  const noSignal = population - signal;
  const truePositive = signal * sensitivity;
  const falseNegative = signal - truePositive;
  const trueNegative = noSignal * specificity;
  const falsePositive = noSignal - trueNegative;
  const positives = truePositive + falsePositive;
  return { population, signal, noSignal, truePositive, falseNegative, falsePositive, trueNegative, positives, posterior: positives > 0 ? truePositive / positives : null };
}
