export type ArgumentLevel = 'basis' | 'bachelor' | 'master';
export type ArgumentLab = 'structure' | 'causality' | 'bayes';

export type ArgumentSource = {
  id: string;
  title: string;
  authors: string;
  year: string;
  url: string;
  note: string;
};

export type ArgumentModule = {
  id: ArgumentLevel;
  title: string;
  subtitle: string;
  description: string;
  accent: 'blue' | 'orange' | 'purple' | 'green';
};

type ExerciseBase = { id: string; prompt: string; scenario?: string; explanation: string };
export type ChoiceExercise = ExerciseBase & {
  kind: 'choice';
  options: { id: string; text: string; feedback: string }[];
  answer: string;
};
export type SortExercise = ExerciseBase & {
  kind: 'sort' | 'map';
  claim?: string;
  categories: { id: string; label: string }[];
  cards: { id: string; text: string; category: string }[];
};
export type ReflectionExercise = ExerciseBase & {
  kind: 'reflection';
  model: string;
  rubric: string[];
  minWords: number;
};
export type ArgumentExercise = ChoiceExercise | SortExercise | ReflectionExercise;

export type ArgumentLesson = {
  id: string;
  moduleId: ArgumentLevel;
  title: string;
  teaser: string;
  minutes: number;
  objectives: string[];
  sections: { title: string; body: string; example: string; takeaway: string }[];
  deepDive: { title: string; body: string };
  exercises: ArgumentExercise[];
  sourceIds: string[];
  lab?: ArgumentLab;
  checkpoint?: boolean;
  introductory?: boolean;
  fallacy?: { slug: string; name: string; aliases: string[]; family: string; criticalQuestion: string };
};
