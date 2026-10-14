import type { CoreCheck } from './core-checks';
import type { FallacyQuestionSeed, FallacySeed } from './fallacy-types';
import type { LessonScaffold } from './scaffolds';
import type { ArgumentLesson, ChoiceExercise } from './types';
import { fallacyBookGuides } from './fallacy-book-guides';
import { shuffle } from '@/engine/hash';

function question(seed: FallacyQuestionSeed, id: string) {
  return {
    scenario: seed.scenario, prompt: seed.prompt,
    options: shuffle(`${id}:choices`, seed.options.map((option, index) => ({ id: `${id}-o${index + 1}`, ...option }))),
    answer: `${id}-o${seed.answer + 1}`,
  };
}

/** The shared lesson contract supplies mechanics; every explanation and case is authored. */
export function buildFallacy(seed: FallacySeed) {
  const id = `drogreden-${seed.slug}`;
  const sourceGuide = fallacyBookGuides[seed.sourceTopic].map((entry) => ({
    ...entry, concepts: [...entry.concepts, seed.criticalQuestion],
  }));
  const scaffoldQuestion = question(seed.starter, `${id}-start`);
  const scaffold: LessonScaffold = {
    context: scaffoldQuestion.scenario, question: scaffoldQuestion.prompt,
    options: scaffoldQuestion.options, answer: scaffoldQuestion.answer, bridge: seed.starter.bridge,
  };
  const core: CoreCheck = { sectionTitle: seed.sections[1]!.title, ...question(seed.core, `${id}-kern`) };
  const choices: ChoiceExercise[] = seed.assessment.map((item, index) => ({
    id: `${id}-keuze-${index + 1}`, kind: 'choice', ...question(item, `${id}-keuze-${index + 1}`),
    explanation: item.options[item.answer].feedback,
  }));
  const categories = seed.puzzle.categories.map((label, index) => ({ id: `${id}-rol-${index + 1}`, label }));
  const lesson: ArgumentLesson = {
    id, moduleId: seed.level, title: seed.name, teaser: seed.teaser,
    minutes: seed.level === 'master' ? 40 : 30,
    objectives: [
      `${seed.name} herkennen door de reden en de conclusie te reconstrueren.`,
      `De beslissende controle toepassen: ${seed.criticalQuestion}`,
      'Een fout geval onderscheiden van een redelijke toepassing in een andere context.',
      'Een redenering herstellen en een gerichte, respectvolle reactie formuleren.',
    ],
    sections: seed.sections, deepDive: seed.deepDive,
    exercises: [choices[0]!, choices[1]!, {
      id: `${id}-puzzel`, kind: 'sort', scenario: seed.puzzle.scenario,
      prompt: seed.puzzle.prompt, explanation: seed.puzzle.explanation, categories,
      cards: seed.puzzle.cards.map((card, index) => ({
        id: `${id}-kaart-${index + 1}`, text: card.text, category: categories[card.category]!.id,
      })),
    }, choices[2]!, {
      id: `${id}-schrijfwerk`, kind: 'reflection', scenario: seed.writing.scenario,
      prompt: seed.writing.prompt, minWords: 80, model: seed.writing.model, rubric: seed.writing.rubric,
      explanation: 'Dit is inhoudelijke zelfbeoordeling. Vergelijk je reconstructie, kritiek en herstel met het model en onderbouw ieder rubriccriterium. Je eigen tekst krijgt geen automatische waarheidsscore.',
    }],
    sourceIds: [...new Set(sourceGuide.map((entry) => entry.sourceId))],
    fallacy: { slug: seed.slug, name: seed.name, aliases: seed.aliases, family: seed.family, criticalQuestion: seed.criticalQuestion },
  };
  return { lesson, scaffold, core, inquiry: seed.inquiry, illustration: seed.illustration, sourceGuide, mediaIds: seed.mediaIds ?? [] };
}
