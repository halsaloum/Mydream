import { z } from 'zod';
import { adaptLegacyCourse } from './adapters/legacy';
import { withExtraLessons } from './packs';
import { withCurriculum } from './curriculum';
import { createLearningPath } from './learning-path';
import { canonicalLayerId, withSentenceLayer } from './sentence-layer';
import { CoursePackSchema, type CoursePack, type Domain, type Layer, type Lesson, type StepKind } from './schema';

/**
 * Archived engine catalog: preserves historical fingerprints, export validation and
 * the exact a20–a35 argument lessons. New nonargument lessons live in ontleed/.
 * Only protected argument IDs remain routed through this player catalog.
 */
function loadCourse(): CoursePack {
  const result = CoursePackSchema.safeParse(withSentenceLayer(withCurriculum(withExtraLessons(adaptLegacyCourse()))));
  if (!result.success) {
    throw new Error(`Lesinhoud voldoet niet aan het contract:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export const course: CoursePack = loadCourse();

export type LessonEntry = {
  lesson: Lesson;
  layer: Layer;
  layerIndex: number;
  domain: Domain;
  /** Andere vakgebieden die meespelen. */
  also: Domain[];
  /** Positie in de bibliotheek (per bouwlaag), vanaf 0; de aanbevolen route staat apart. */
  order: number;
};

const domainsById = new Map(course.domains.map((domain) => [domain.id, domain]));

export const lessonEntries: readonly LessonEntry[] = course.layers
  .flatMap((layer, layerIndex) =>
    layer.lessons.map((lesson) => {
      const domain = domainsById.get(lesson.domain);
      if (!domain) throw new Error(`Onbekend domein ${lesson.domain}`);
      const also = (lesson.also ?? []).flatMap((id) => {
        const other = domainsById.get(id);
        return other ? [other] : [];
      });
      return { lesson, layer, layerIndex, domain, also };
    }),
  )
  .map((entry, order) => ({ ...entry, order }));

const entriesById = new Map(lessonEntries.map((entry) => [entry.lesson.id, entry]));

export const learningPhases = createLearningPath(lessonEntries);
export const learningPathEntries = learningPhases.flatMap((phase) => phase.entries);

export const totalLessons = lessonEntries.length;

export function getLessonEntry(id: string): LessonEntry | undefined {
  return entriesById.get(id);
}

export function getDomain(id: string): Domain | undefined {
  return domainsById.get(id);
}

export function getLayer(id: string): Layer | undefined {
  return course.layers.find((layer) => layer.id === canonicalLayerId(id));
}

export function nextLessonEntry(id: string): LessonEntry | undefined {
  const index = learningPathEntries.findIndex((entry) => entry.lesson.id === id);
  return index < 0 ? undefined : learningPathEntries[index + 1];
}

export const EXERCISE_LABELS: Record<StepKind, string> = {
  explain: 'Uitleg met experimenten',
  learn: 'Nieuw begrip',
  choice: 'Meerkeuze',
  combine: 'Zinnen combineren',
  type: 'Invullen',
  order: 'Woorden ordenen',
  paragraph: 'Alinea ordenen',
  sort: 'Sorteren',
  fix: 'Fout verbeteren',
  rewrite: 'Herschrijven',
  write: 'Vrij schrijven',
  swipe: 'Swipe-kaarten',
  morph: 'Woordbouwer',
  timeline: 'Tijdschuif',
  speed: 'Snelrondje',
  train: 'Zinstrein',
  highlight: 'Markeerstiften',
  conjunction: 'Voegwoord-duw',
  clamp: 'Zinstang',
  refs: 'Verwijsdraad',
  ladder: 'Betekenisladder',
  ambiguity: 'Twee betekenissen',
  chat: 'Chat-scenario',
  tone: 'Toonregelaar',
  intent: 'Zegt en bedoelt',
  scale: 'Weegschaal',
  stack: 'Alinea-stapel',
  proofread: 'Eindredactie',
  bet: 'Durf je?',
  dictation: 'Dictee',
  reason: 'Want of dus',
  support: 'Onderbouwen',
  evidence: 'Bewijsbalk',
  rebut: 'Ja, maar…',
  strawman: 'Stroman',
  slope: 'Hellend vlak',
  dilemma: 'Vals dilemma',
  inspect: 'Keuring',
  cloze: 'Invultekst',
  drill: 'Reeks',
  passage: 'Tekstdictee',
  word: 'Woordkaart',
  guess: 'Raad eerst',
  recall: 'Ophalen',
  scene: 'Denk na',
  use: 'Gebruik het',
};

/** Vakgebieden die als perspectief op elk niveau gelden. */
export const perspectives = course.domains.filter((domain) => domain.persp);

export type LessonOverview = {
  explainTitles: string[];
  exerciseKinds: StepKind[];
  /** Oefenopdrachten, inclusief zelfcontrole en snelle checks uit de uitleg. */
  exerciseCount: number;
};

export function lessonOverview(lesson: Lesson): LessonOverview {
  const explainTitles: string[] = [];
  const kinds = new Set<StepKind>();
  let exerciseCount = 0;
  for (const step of lesson.steps) {
    if (step.kind === 'explain' || step.kind === 'learn') {
      explainTitles.push(step.title);
      if (step.kind === 'explain') {
        const quizzes = step.panels.filter((panel) => panel.quiz).length;
        if (quizzes > 0) kinds.add('choice');
        exerciseCount += quizzes;
      }
      continue;
    }
    kinds.add(step.kind);
    exerciseCount += 1;
  }
  return { explainTitles, exerciseKinds: [...kinds], exerciseCount };
}

/** "3 oefeningen", "1 oefening", of "Uitleg en experimenten" zonder afzonderlijke oefenopdrachten. */
export function exerciseCountLabel(lesson: Lesson): string {
  const { exerciseCount } = lessonOverview(lesson);
  if (exerciseCount === 0) return 'Uitleg en experimenten';
  return exerciseCount === 1 ? '1 oefening' : `${exerciseCount} oefeningen`;
}
