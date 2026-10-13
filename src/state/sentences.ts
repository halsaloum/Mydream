import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SentenceAnswer, SentenceExercise, SentenceLesson } from '@/content/sentences/types';
import { fingerprint } from '@/engine/hash';
import { answerReady, diagnosisCorrect, emptySentenceAnswer, gradeSentence, lessonAccuracy, lessonExercises, lessonSolved, sanitizeSentenceAnswer, segmentationCorrect } from '@/lib/sentences/learning';
import { validatedStorage } from './storage';

export const SentenceTabSchema = z.enum(['ontdek', 'wetten', 'arena', 'debugger', 'codex']);
export type SentenceTab = z.infer<typeof SentenceTabSchema>;
const AnswerSchema = z.object({
  selected: z.array(z.string()), diagnosisPassed: z.boolean(), boundaries: z.array(z.int().positive()), segmentationPassed: z.boolean(),
  choice: z.string(), placements: z.record(z.string(), z.array(z.string())), links: z.array(z.object({ from: z.string(), to: z.string() })),
  variant: z.string(), order: z.array(z.string()), text: z.string(), checked: z.boolean(), correct: z.boolean(),
});
const SessionSchema = z.object({
  signature: z.string(), startedAt: z.string(), tab: SentenceTabSchema,
  arenaIndex: z.int().min(0).max(5), debuggerIndex: z.int().min(0).max(3),
  answers: z.record(z.string(), AnswerSchema), firstTry: z.record(z.string(), z.union([z.literal(0), z.literal(1)])),
  finished: z.boolean(), visitedVariants: z.array(z.string()), transferText: z.string().max(3000).default(''),
});
const RecordSchema = z.object({
  attempts: z.int().positive(), completedAt: z.string(), lastPracticedAt: z.string(),
  lastAccuracy: z.int().min(0).max(100), bestAccuracy: z.int().min(0).max(100),
  history: z.array(z.object({ at: z.string(), accuracy: z.int().min(0).max(100), firstTry: z.record(z.string(), z.union([z.literal(0), z.literal(1)])) })).max(10),
});
export const SentenceDataSchema = z.object({ records: z.record(z.string(), RecordSchema), sessions: z.record(z.string(), SessionSchema) });
export type SentenceData = z.infer<typeof SentenceDataSchema>;
export type SentenceSession = z.infer<typeof SessionSchema>;
export const EMPTY_SENTENCES: SentenceData = { records: {}, sessions: {} };
export const SENTENCES_KEY = 'pennig:zinnen';

type Actions = {
  start: (lesson: SentenceLesson) => void;
  setTab: (lessonId: string, tab: SentenceTab) => void;
  answer: (lessonId: string, exerciseId: string, patch: Partial<SentenceAnswer>) => void;
  diagnose: (lesson: SentenceLesson, exercise: SentenceExercise) => boolean;
  segment: (lesson: SentenceLesson, exercise: SentenceExercise) => boolean;
  check: (lesson: SentenceLesson, exercise: SentenceExercise) => boolean;
  complete: (lesson: SentenceLesson) => boolean;
  restart: (lesson: SentenceLesson) => void;
  setExerciseIndex: (lessonId: string, phase: 'arena' | 'debugger', index: number) => void;
  visitVariant: (lessonId: string, variantId: string) => void;
  setTransfer: (lessonId: string, text: string) => void;
  replace: (data: SentenceData) => void;
  reset: () => void;
};

// Register the lesson passed to start; importing a content catalog here would create a state/content cycle.
const activeLessons = new Map<string, SentenceLesson>();

function freshSession(lesson: SentenceLesson): SentenceSession {
  return {
    signature: fingerprint(lesson), startedAt: new Date().toISOString(), tab: 'ontdek', arenaIndex: 0, debuggerIndex: 0,
    answers: {}, firstTry: {}, finished: false, visitedVariants: [], transferText: '',
  };
}

function activeExercise(lesson: SentenceLesson, exercise: SentenceExercise, session: SentenceSession | undefined): SentenceExercise | undefined {
  if (!session || session.finished || session.signature !== fingerprint(lesson)) return undefined;
  const registered = activeLessons.get(lesson.id);
  if (!registered || fingerprint(registered) !== session.signature) return undefined;
  return lessonExercises(registered).find((item) => item.id === exercise.id && fingerprint(item) === fingerprint(exercise));
}

function restoreSession(lesson: SentenceLesson, session: SentenceSession): SentenceSession {
  const exercises = lessonExercises(lesson);
  const answers = Object.fromEntries(exercises.flatMap((exercise) => {
    const answer = session.answers[exercise.id];
    return answer ? [[exercise.id, sanitizeSentenceAnswer(exercise, answer)]] : [];
  }));
  const firstTry = Object.fromEntries(exercises.flatMap((exercise) => exercise.id in session.firstTry ? [[exercise.id, session.firstTry[exercise.id]!]] : []));
  const visitedVariants = [...new Set(session.visitedVariants.filter((id) => lesson.discovery.variants.some((variant) => variant.id === id)))];
  return { ...session, answers, firstTry, visitedVariants, finished: session.finished && lessonSolved(lesson, answers) };
}

export const useSentences = create<SentenceData & Actions>()(persist((set, get) => ({
  ...EMPTY_SENTENCES,
  start: (lesson) => {
    activeLessons.set(lesson.id, lesson);
    set((state) => {
      const old = state.sessions[lesson.id];
      const session = old?.signature === fingerprint(lesson) ? restoreSession(lesson, old) : freshSession(lesson);
      return old && JSON.stringify(session) === JSON.stringify(old) ? state : { sessions: { ...state.sessions, [lesson.id]: session } };
    });
  },
  setTab: (lessonId, tab) => set((state) => {
    const session = state.sessions[lessonId];
    if (!session || !SentenceTabSchema.safeParse(tab).success || session.tab === tab) return state;
    return { sessions: { ...state.sessions, [lessonId]: { ...session, tab } } };
  }),
  answer: (lessonId, exerciseId, patch) => set((state) => {
    const session = state.sessions[lessonId];
    const lesson = activeLessons.get(lessonId);
    const exercise = lesson?.id === lessonId && lessonExercises(lesson).find((item) => item.id === exerciseId);
    if (!session || session.finished || !lesson || !exercise || session.signature !== fingerprint(lesson)) return state;
    const parsed = AnswerSchema.partial().safeParse(patch);
    if (!parsed.success) return state;
    const old = session.answers[exerciseId] ?? emptySentenceAnswer();
    const editable = { ...parsed.data };
    delete editable.diagnosisPassed;
    delete editable.segmentationPassed;
    delete editable.checked;
    delete editable.correct;
    if ((exercise.kind === 'gate' || exercise.kind === 'debug') && (!old.diagnosisPassed || !diagnosisCorrect(exercise, old))) {
      delete editable.choice;
      delete editable.text;
    }
    const updated = { ...old, ...editable };
    if (JSON.stringify(updated) === JSON.stringify(old)) return state;
    if (JSON.stringify(updated.selected) !== JSON.stringify(old.selected)) updated.diagnosisPassed = false;
    if (JSON.stringify(updated.boundaries) !== JSON.stringify(old.boundaries)) updated.segmentationPassed = false;
    updated.checked = false;
    updated.correct = false;
    return { sessions: { ...state.sessions, [lessonId]: { ...session, answers: { ...session.answers, [exerciseId]: updated } } } };
  }),
  diagnose: (lesson, exercise) => {
    let passed = false;
    set((state) => {
      const session = state.sessions[lesson.id];
      const task = activeExercise(lesson, exercise, session);
      if (!session || !task || (task.kind !== 'gate' && task.kind !== 'debug')) return state;
      const answer = session.answers[exercise.id] ?? emptySentenceAnswer();
      passed = diagnosisCorrect(task, answer);
      return { sessions: { ...state.sessions, [lesson.id]: { ...session, answers: { ...session.answers, [exercise.id]: { ...answer, diagnosisPassed: passed, checked: false, correct: false } } } } };
    });
    return passed;
  },
  segment: (lesson, exercise) => {
    let passed = false;
    set((state) => {
      const session = state.sessions[lesson.id];
      const task = activeExercise(lesson, exercise, session);
      if (!session || !task || task.support !== 'half' || !task.segmentation) return state;
      const answer = session.answers[exercise.id] ?? emptySentenceAnswer();
      passed = segmentationCorrect(task, answer);
      return { sessions: { ...state.sessions, [lesson.id]: { ...session, answers: { ...session.answers, [exercise.id]: { ...answer, segmentationPassed: passed, checked: false, correct: false } } } } };
    });
    return passed;
  },
  check: (lesson, exercise) => {
    let correct = false;
    set((state) => {
      const session = state.sessions[lesson.id];
      const task = activeExercise(lesson, exercise, session);
      if (!session || !task) return state;
      const answer = session.answers[exercise.id] ?? emptySentenceAnswer();
      if (!answerReady(task, answer)) return state;
      correct = gradeSentence(task, answer);
      if (answer.checked) return state;
      return { sessions: { ...state.sessions, [lesson.id]: {
        ...session,
        answers: { ...session.answers, [exercise.id]: { ...answer, checked: true, correct } },
        firstTry: exercise.id in session.firstTry ? session.firstTry : { ...session.firstTry, [exercise.id]: correct ? 1 : 0 },
      } } };
    });
    return correct;
  },
  complete: (lesson) => {
    const session = get().sessions[lesson.id];
    const registered = activeLessons.get(lesson.id);
    if (!session || !registered || session.signature !== fingerprint(lesson) || fingerprint(registered) !== session.signature || !lessonSolved(lesson, session.answers)) return false;
    if (session.finished) return true;
    const old = get().records[lesson.id];
    const now = new Date().toISOString();
    const accuracy = lessonAccuracy(lesson, session.firstTry);
    set((state) => ({
      sessions: { ...state.sessions, [lesson.id]: { ...session, finished: true, tab: 'codex' } },
      records: { ...state.records, [lesson.id]: {
        attempts: (old?.attempts ?? 0) + 1, completedAt: old?.completedAt ?? now, lastPracticedAt: now,
        lastAccuracy: accuracy, bestAccuracy: Math.max(old?.bestAccuracy ?? 0, accuracy),
        history: [...(old?.history ?? []), { at: now, accuracy, firstTry: { ...session.firstTry } }].slice(-10),
      } },
    }));
    return true;
  },
  restart: (lesson) => {
    activeLessons.set(lesson.id, lesson);
    set((state) => ({ sessions: { ...state.sessions, [lesson.id]: freshSession(lesson) } }));
  },
  setExerciseIndex: (lessonId, phase, index) => set((state) => {
    const session = state.sessions[lessonId];
    if (!session || !Number.isInteger(index) || index < 0 || (phase !== 'arena' && phase !== 'debugger')) return state;
    const lesson = activeLessons.get(lessonId);
    const count = lesson?.[phase].length ?? (phase === 'arena' ? 6 : 4);
    if (index >= count) return state;
    return { sessions: { ...state.sessions, [lessonId]: { ...session, [phase === 'arena' ? 'arenaIndex' : 'debuggerIndex']: index } } };
  }),
  visitVariant: (lessonId, variantId) => set((state) => {
    const session = state.sessions[lessonId];
    const lesson = activeLessons.get(lessonId);
    if (!session || !lesson?.discovery.variants.some((variant) => variant.id === variantId) || session.visitedVariants.includes(variantId)) return state;
    return { sessions: { ...state.sessions, [lessonId]: { ...session, visitedVariants: [...session.visitedVariants, variantId] } } };
  }),
  setTransfer: (lessonId, text) => set((state) => {
    const session = state.sessions[lessonId];
    if (!session || typeof text !== 'string' || text.length > 3000 || session.transferText === text) return state;
    return { sessions: { ...state.sessions, [lessonId]: { ...session, transferText: text } } };
  }),
  replace: (data) => {
    const parsed = SentenceDataSchema.safeParse(data);
    if (parsed.success) set(parsed.data);
  },
  reset: () => { activeLessons.clear(); set(EMPTY_SENTENCES); },
}), {
  name: SENTENCES_KEY, version: 1, storage: validatedStorage(SentenceDataSchema), skipHydration: true,
  partialize: ({ records, sessions }) => ({ records, sessions }),
}));

export function pickSentenceData({ records, sessions }: SentenceData): SentenceData { return { records, sessions }; }
