export type SupportLevel = 'volledig' | 'half' | 'zelfstandig';
export type SentenceToken = { id: string; text: string };
export type SentenceSource = { id: string; title: string; url: string; section: string };
export type SentenceRule = { id: string; when: string; then: string; nuance: string; sourceIds: string[] };
export type Diagnosis = { prompt: string; tokens: SentenceToken[]; targets: string[]; feedback: string };
export type Segmentation = { prompt: string; tokens: SentenceToken[]; boundaries: number[]; feedback: string };
export type SentenceBlock = { id: string; text: string; role?: string };
type ExerciseBase = {
  id: string;
  prompt: string;
  support: SupportLevel;
  ruleId: string;
  explanation: string;
  hint: string;
  segmentation?: Segmentation;
};
export type SlotExercise = ExerciseBase & {
  kind: 'slots';
  blocks: SentenceBlock[];
  slots: { id: string; label: string; capacity?: number }[];
  initial: Record<string, string[]>;
  accept: Record<string, string[]>[];
  collision?: { front: string; middle: string; subject: string };
};
export type GateExercise = ExerciseBase & {
  kind: 'gate';
  diagnosis: Diagnosis;
  options: { id: string; text: string; feedback: string }[];
  answer: string;
};
export type TetherExercise = ExerciseBase & {
  kind: 'tether';
  tokens: SentenceToken[];
  links: { from: string; to: string }[];
  distractorFeedback?: Record<string, string>;
};
export type MutatorVariant = { id: string; label: string; blocks: SentenceBlock[]; order: string[]; note: string };
export type MutatorExercise = ExerciseBase & {
  kind: 'mutate';
  original: string;
  variants: MutatorVariant[];
  target: string;
};
export type DebugExercise = ExerciseBase & {
  kind: 'debug';
  tokens: SentenceToken[];
  targets: string[];
  instruction: string;
  repairs: string[];
};
export type SentenceExercise = SlotExercise | GateExercise | TetherExercise | MutatorExercise | DebugExercise;
export type DiscoveryVariant = {
  id: string; label: string; sentence: string; note: string;
  blocks: { text: string; role: string; accent?: 'blue' | 'green' | 'orange' | 'purple' }[];
  scene: 'classroom' | 'office' | 'bus' | 'bicycle' | 'students' | 'library' | 'station' | 'workshop';
};
export type SentenceLesson = {
  id: string;
  number: number;
  title: string;
  teaser: string;
  minutes: number;
  objectives: string[];
  discovery: { question: string; variants: DiscoveryVariant[]; takeaway: string };
  rules: SentenceRule[];
  decision: { question: string; yes: string; no: string }[];
  arena: SentenceExercise[];
  debugger: DebugExercise[];
  summary: { title: string; points: string[]; transfer: string };
  legacyLessonIds: string[];
};
export type SentenceAnswer = {
  selected: string[];
  diagnosisPassed: boolean;
  boundaries: number[];
  segmentationPassed: boolean;
  choice: string;
  placements: Record<string, string[]>;
  links: { from: string; to: string }[];
  variant: string;
  order: string[];
  text: string;
  checked: boolean;
  correct: boolean;
};
