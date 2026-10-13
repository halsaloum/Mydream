import type { LessonGuidance } from '../../curriculum/types';
import type { LessonInput, Panel, Stage, StepInput } from '../../schema';

export type GuidedArgumentLesson = LessonInput & { guidance: LessonGuidance };

export function lesson(id: string, title: string, stage: Stage, guidance: LessonGuidance, steps: StepInput[]): GuidedArgumentLesson {
  return { id, title, stage, skill: 'Alinea', icon: '∴', domain: 'tekst', also: ['prag', 'sem'], guidance, steps };
}

export function explain(id: string, title: string, panels: Panel[]): StepInput {
  return { kind: 'explain', id, title, panels };
}

export function choice(id: string, prompt: string, options: string[], answer: string, why: string): StepInput {
  return { kind: 'choice', id, prompt, before: '', after: '', options, answer, why };
}

export function recall(id: string, prompt: string, answer: string, why: string): StepInput {
  return { kind: 'type', id, prompt, before: '', after: '', hint: 'Typ het gevraagde begrip', answer, why };
}

/** Open werk wordt ondersteund door een model en een rubric, nooit als inhoudelijk automatisch beoordeeld gepresenteerd. */
export function practice(id: string, prompt: string, minWords: number, model: string, rubric: string[]): StepInput {
  return {
    kind: 'write', id, prompt, minWords, must: [], rubric: { criteria: rubric, example: model },
    intro: 'Schrijf eerst zelf. De app controleert hier alleen de minimale lengte; zij beoordeelt niet of je argumentatie klopt. Open daarna het voorbeeld en vergelijk je tekst met elk criterium. Er zijn meerdere goede antwoorden.',
    why: 'Je hebt je eigen tekst met de criteria vergeleken. Deze zelfbeoordeling is geen automatisch inhoudelijk oordeel. Herzie onduidelijke onderdelen en vraag een lezer welke stap nog uitleg nodig heeft.',
    done: { title: 'Vergelijk en verbeter je eigen antwoord', text: 'Lees het model en beoordeel je eigen inhoud met de criteria. Laat een lezer aanwijzen welke stap hij nog niet kan volgen.' },
  };
}

export function right(t: string, why: string) { return { t, ok: true as const, why }; }
export function trap(t: string, name: string, why: string) { return { t, trap: name, why }; }

export const FICTION = 'Alle personen, aantallen en dossiers in deze cursus zijn fictief oefenmateriaal. Ze zijn geen onderzoeksresultaten over de echte wereld.';
