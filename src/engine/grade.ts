import type { Panel, Step, StepOf, TextTest, WriteCriterion } from '@/content/schema';
import { tokenize } from '@/content/text';
import { extraEvaluate, extraIsComplete, isExtraKind, type ExtraResponse, type Outcome } from './kinds';
import { panelWidgets, type PanelWidget } from './plan';
import type { ExplainResponse, Response, ResponseOf } from './responses';

/**
 * Beoordeling. Volgt de regels van de oorspronkelijke app, met één bewuste verbetering:
 * herschrijfopdrachten die alleen over hoofdletters en leestekens gaan, worden daar ook op
 * beoordeeld (zie `isFormExercise`).
 */

/** Losse vergelijking (oorspronkelijke `norm`): hoofdletters, leestekens en extra spaties tellen niet. */
export function normalizeLoose(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:’'"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Strikte vergelijking: alleen spaties en typografische aanhalingstekens worden gelijkgetrokken. */
export function normalizeStrict(text: string): string {
  return text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+([.,!?;:])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Een getypt woord: hoofdletters en extra spaties tellen niet, een gekrulde apostrof is gewoon een apostrof. */
export function normalizeTyped(text: string): string {
  return text.replace(/[‘’]/g, "'").trim().replace(/\s+/g, ' ').toLowerCase();
}

/**
 * Een herschrijfopdracht is een vormopdracht als de goede antwoorden alleen in hoofdletters of
 * leestekens van de bron verschillen (bv. "Zet de komma goed"). Dan telt de vorm wél mee;
 * anders zou een antwoord zonder komma goed gerekend worden.
 */
export function isFormExercise(step: StepOf<'rewrite'>): boolean {
  const source = normalizeLoose(step.source);
  return step.accept.every((answer) => normalizeLoose(answer) === source);
}

export function wordCount(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** De reguliere expressie achter een tekstcontrole (hele woorden of een eigen patroon). */
export function textTestRegExp(test: TextTest): RegExp {
  if ('anyWord' in test) {
    const words = test.anyWord.map(escapeRegExp).join('|');
    return new RegExp(`(?<![\\p{L}\\p{N}])(?:${words})(?![\\p{L}\\p{N}])`, 'iu');
  }
  return new RegExp(test.pattern, test.flags);
}

export function criterionRegExp(criterion: WriteCriterion): RegExp {
  return textTestRegExp(criterion.test);
}

/** Het gevonden signaalwoord: de vanggroepen van het patroon, anders de hele treffer. */
function foundWords(match: RegExpMatchArray): string {
  const groups = match.slice(1).filter((group): group is string => Boolean(group));
  return (groups.length ? groups : [match[0]]).join(' … ').toLocaleLowerCase('nl');
}

export function criteriaStatus(step: StepOf<'write'>, text: string) {
  const words = wordCount(text);
  return {
    words,
    enoughWords: words >= step.minWords,
    criteria: step.must.map((criterion) => {
      const match = text.match(criterionRegExp(criterion));
      return { label: criterion.label, hint: criterion.hint ?? null, met: match !== null, found: match ? foundWords(match) : null };
    }),
  };
}

/** Signalen bij woorden die op een drogreden kunnen wijzen. Geen fout: een vraag aan de schrijver. */
export function writeAlarms(step: StepOf<'write'>, text: string, limit = 2): { head: string; tip: string }[] {
  return (step.avoid ?? [])
    .flatMap((alarm) => {
      const match = text.match(textTestRegExp(alarm.test));
      if (!match) return [];
      return [{ head: `‘${alarm.show ?? foundWords(match)}’`, tip: alarm.tip }];
    })
    .slice(0, limit);
}

/** Zinsstarter toevoegen aan het eind van de tekst, met precies één spatie ervoor en erna. */
export function appendStarter(text: string, starter: string): string {
  const gap = text && !/\s$/.test(text) ? ' ' : '';
  return `${text}${gap}${starter} `;
}

export function panelTasks(panel: Panel): { lab: boolean; widgets: PanelWidget[] } {
  return { lab: panel.lab !== undefined, widgets: panelWidgets(panel) };
}

export function isPanelReady(panel: Panel, panelIndex: number, response: ExplainResponse): boolean {
  const { lab, widgets } = panelTasks(panel);
  if (lab && response.labs[String(panelIndex)] === undefined) return false;
  return widgets.every((widget) => response.solved.includes(`${panelIndex}:${widget}`));
}

/** Mag de leerling op "Controleer" (of bij uitleg: "Verder") drukken? */
export function isComplete(step: Step, response: Response): boolean {
  if (isExtraKind(step.kind)) return extraIsComplete(step, response as ExtraResponse);
  switch (step.kind) {
    case 'explain': {
      if (response.kind !== 'explain') return false;
      const last = step.panels.length - 1;
      const panel = step.panels[last];
      return response.panel === last && panel !== undefined && isPanelReady(panel, last, response);
    }
    case 'learn':
      return true;
    case 'choice':
    case 'combine':
      return (response.kind === 'choice' || response.kind === 'combine') && response.value !== null;
    case 'type':
    case 'rewrite':
      return (response.kind === 'type' || response.kind === 'rewrite') && response.value.trim().length > 0;
    case 'order':
      return response.kind === 'order' && response.placed.length === step.tiles.length;
    case 'paragraph':
      return response.kind === 'paragraph' && response.placed.length === step.parts.length;
    case 'sort':
      return response.kind === 'sort' && response.assign.every((bucket) => bucket !== null);
    case 'fix':
      return response.kind === 'fix' && response.index !== null && response.value.trim().length > 0;
    case 'write': {
      if (response.kind !== 'write') return false;
      const status = criteriaStatus(step, response.value);
      return status.enoughWords && status.criteria.every((criterion) => criterion.met);
    }
    default:
      return false;
  }
}

export function orderedText(step: StepOf<'order'>, response: ResponseOf<'order'>): string {
  return response.placed.map((i) => step.tiles[i]).join(' ');
}

/** De tegelvolgorde die het goede antwoord vormt (werkt ook bij tegels met spaties of dubbele tegels). */
export function orderSolution(tiles: readonly string[], answer: string): number[] | null {
  const used = new Array<boolean>(tiles.length).fill(false);
  const path: number[] = [];
  const walk = (offset: number): boolean => {
    if (path.length === tiles.length) return offset === answer.length;
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      if (used[i] || tile === undefined || !answer.startsWith(tile, offset)) continue;
      const end = offset + tile.length;
      const last = path.length === tiles.length - 1;
      if (last ? end !== answer.length : answer[end] !== ' ') continue;
      used[i] = true;
      path.push(i);
      if (walk(last ? end : end + 1)) return true;
      path.pop();
      used[i] = false;
    }
    return false;
  };
  return walk(0) ? [...path] : null;
}

export function isCorrect(step: Step, response: Response): boolean {
  if (!isComplete(step, response)) return false;
  if (isExtraKind(step.kind)) return extraEvaluate(step, response as ExtraResponse).correct;
  switch (step.kind) {
    case 'explain':
    case 'learn':
    case 'write':
      return true;
    case 'choice':
    case 'combine':
      return (response.kind === 'choice' || response.kind === 'combine') && response.value === step.answer;
    case 'type':
      return response.kind === 'type' && normalizeTyped(response.value) === normalizeTyped(step.answer);
    case 'order':
      return response.kind === 'order' && orderedText(step, response) === step.answer;
    case 'paragraph':
      return response.kind === 'paragraph' && response.placed.every((part, position) => part === position);
    case 'sort':
      return response.kind === 'sort' && step.items.every((item, i) => response.assign[i] === item.b);
    case 'fix':
      return response.kind === 'fix' && response.index === step.wrong && normalizeLoose(response.value) === normalizeLoose(step.answer);
    case 'rewrite': {
      if (response.kind !== 'rewrite') return false;
      const normalize = isFormExercise(step) ? normalizeStrict : normalizeLoose;
      return step.accept.some((answer) => normalize(answer) === normalize(response.value));
    }
    default:
      return false;
  }
}

/** De uitkomst van een stap: score, opnieuw aanbieden, en wat er met de herhaalstapel gebeurt. */
export function evaluate(step: Step, response: Response): Outcome {
  if (isExtraKind(step.kind)) return extraEvaluate(step, response as ExtraResponse);
  const correct = isCorrect(step, response);
  return { score: correct ? 1 : 0, correct, requeue: !correct, review: correct ? 'clear' : 'miss' };
}

/** Het goede antwoord als korte tekst voor de feedback, of `null` als het in de oefening zelf wordt getoond. */
export function expectedAnswer(step: Step): string | null {
  switch (step.kind) {
    case 'choice':
    case 'combine':
    case 'type':
    case 'order':
      return step.answer;
    case 'rewrite':
      return step.accept[0] ?? null;
    case 'fix': {
      const token = tokenize(step.sentence)[step.wrong] ?? '';
      return `${token.replace(/[.,!?;:]+$/, '')} → ${step.answer}`;
    }
    default:
      return null;
  }
}
