import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ArgumentLesson } from '@/content/argumentation/types';
import { fingerprint } from '@/engine/hash';
import { addDays, dayKey } from '@/lib/dates';
import { emptyArgumentAnswer, lessonPassed, lessonScore, nextReviewDays, type ArgumentAnswer } from '@/lib/argumentation/learning';
import { theoryPages } from '@/lib/argumentation/theory-pages';
import { validatedStorage } from './storage';
import { validateArgumentMap, type ArgumentMap } from '@/lib/argumentation/maps';

const WorkshopSchema = z.object({
  nodes: z.array(z.object({ id: z.string(), text: z.string(), kind: z.enum(['claim', 'premise', 'assumption', 'objection', 'intermediate', 'warrant', 'backing', 'qualifier']), active: z.boolean().optional(), qualifies: z.string().optional() })),
  inferences: z.array(z.object({ id: z.string(), from: z.array(z.string()), to: z.string(), warrant: z.string().optional(), label: z.string().optional() })),
  attacks: z.array(z.object({ id: z.string(), from: z.string(), to: z.string(), kind: z.enum(['rebuttal', 'undercut', 'premise']), rationale: z.string().optional() })),
}).refine((map) => validateArgumentMap(map).length === 0, { message: 'De argumentkaart bevat ongeldige verbindingen.' });

const AnswerSchema = z.object({
  value: z.string(), placements: z.record(z.string(), z.string()), rubric: z.record(z.string(), z.boolean()),
  checked: z.boolean(), score: z.number().min(0).max(1).nullable(),
  confidence: z.int().min(0).max(3).nullable().default(null), reasoning: z.string().default(''),
});
const SessionSchema = z.object({
  signature: z.string(), cursor: z.int().nonnegative(), startedAt: z.string(),
  resumeCursor: z.int().positive().default(1),
  theoryPage: z.int().nonnegative().default(0),
  readingSignature: z.string().optional(),
  answers: z.record(z.string(), AnswerSchema), firstTry: z.record(z.string(), z.number().min(0).max(1)),
  finished: z.boolean(),
  firstConfidence: z.record(z.string(), z.int().min(0).max(3)).default({}),
});
const RecordSchema = z.object({
  attempts: z.int().positive(), bestScore: z.int().min(0).max(100), lastScore: z.int().min(0).max(100),
  completedAt: z.string().nullable(), lastPracticedAt: z.string(), reviewOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  history: z.array(z.object({ at: z.string(), score: z.int().min(0).max(100), writings: z.record(z.string(), z.string()), firstTry: z.record(z.string(), z.number().min(0).max(1)).default({}), confidence: z.record(z.string(), z.int().min(0).max(3)).default({}) })).max(10).default([]),
});
export const ArgumentDataSchema = z.object({ records: z.record(z.string(), RecordSchema), sessions: z.record(z.string(), SessionSchema), workshops: z.record(z.string(), WorkshopSchema).default({}), workshopNotes: z.record(z.string(), z.string()).default({}) });
export type ArgumentData = z.infer<typeof ArgumentDataSchema>;
export type ArgumentSession = z.infer<typeof SessionSchema>;
export const EMPTY_ARGUMENTS: ArgumentData = { records: {}, sessions: {}, workshops: {}, workshopNotes: {} };
export const ARGUMENTS_KEY = 'pennig:argumentatie';

type Actions = {
  start: (lesson: ArgumentLesson, restart?: boolean) => void;
  answer: (lessonId: string, exerciseId: string, patch: Partial<ArgumentAnswer>) => void;
  check: (lessonId: string, exerciseId: string, score: number | null) => void;
  move: (lessonId: string, cursor: number) => void;
  setTheoryPage: (lessonId: string, page: number) => void;
  openTheory: (lessonId: string) => void;
  resume: (lessonId: string) => void;
  finish: (lesson: ArgumentLesson) => void;
  replace: (data: ArgumentData) => void;
  reset: () => void;
  saveWorkshop: (preset: string, map: ArgumentMap) => void;
  saveWorkshopNote: (preset: string, note: string) => void;
};

export const useArgumentation = create<ArgumentData & Actions>()(persist((set, get) => ({
  ...EMPTY_ARGUMENTS,
  start: (lesson, restart = false) => {
    const signature = fingerprint(lesson);
    const readingSignature = fingerprint(theoryPages(lesson));
    const existing = get().sessions[lesson.id];
    if (!restart && existing?.signature === signature && existing.cursor <= lesson.exercises.length + 1 && existing.resumeCursor <= lesson.exercises.length + 1) {
      if (existing.readingSignature !== readingSignature) set((state) => ({ sessions: { ...state.sessions, [lesson.id]: { ...existing, readingSignature, theoryPage: 0 } } }));
      return;
    }
    set((state) => ({ sessions: { ...state.sessions, [lesson.id]: {
      signature, readingSignature, cursor: 0, resumeCursor: 1, theoryPage: 0, startedAt: new Date().toISOString(), answers: {}, firstTry: {}, firstConfidence: {}, finished: false,
    } } }));
  },
  answer: (lessonId, exerciseId, patch) => set((state) => {
    const session = state.sessions[lessonId];
    if (!session || session.finished) return state;
    const answer = session.answers[exerciseId] ?? emptyArgumentAnswer();
    return { sessions: { ...state.sessions, [lessonId]: { ...session, answers: {
      ...session.answers, [exerciseId]: { ...answer, ...patch },
    } } } };
  }),
  check: (lessonId, exerciseId, score) => set((state) => {
    const session = state.sessions[lessonId];
    const answer = session?.answers[exerciseId];
    if (!session || !answer || answer.checked || session.finished) return state;
    return { sessions: { ...state.sessions, [lessonId]: {
      ...session, answers: { ...session.answers, [exerciseId]: { ...answer, checked: true, score } },
      firstTry: score === null || exerciseId in session.firstTry ? session.firstTry : { ...session.firstTry, [exerciseId]: score },
      firstConfidence: score === null || answer.confidence === null || exerciseId in session.firstTry ? session.firstConfidence : { ...session.firstConfidence, [exerciseId]: answer.confidence },
    } } };
  }),
  move: (lessonId, cursor) => set((state) => {
    const session = state.sessions[lessonId];
    return !session || session.finished ? state : { sessions: { ...state.sessions, [lessonId]: { ...session, cursor } } };
  }),
  setTheoryPage: (lessonId, theoryPage) => set((state) => {
    const session = state.sessions[lessonId];
    if (!session || !Number.isInteger(theoryPage) || theoryPage < 0 || session.theoryPage === theoryPage) return state;
    return { sessions: { ...state.sessions, [lessonId]: { ...session, theoryPage } } };
  }),
  openTheory: (lessonId) => set((state) => {
    const session = state.sessions[lessonId];
    return !session ? state : { sessions: { ...state.sessions, [lessonId]: { ...session, cursor: 0, resumeCursor: session.cursor || session.resumeCursor } } };
  }),
  resume: (lessonId) => set((state) => {
    const session = state.sessions[lessonId];
    return !session ? state : { sessions: { ...state.sessions, [lessonId]: { ...session, cursor: session.resumeCursor } } };
  }),
  finish: (lesson) => set((state) => {
    const session = state.sessions[lesson.id];
    if (!session || session.finished || lesson.exercises.some((exercise) => {
      const answer = session.answers[exercise.id];
      if (!answer?.checked) return true;
      if (exercise.kind === 'reflection') return !exercise.rubric.every((_, index) => answer.rubric[String(index)]);
      return !lesson.checkpoint && answer.score !== 1;
    })) return state;
    const score = lessonScore(lesson, session.firstTry);
    const old = state.records[lesson.id];
    const attempts = (old?.attempts ?? 0) + 1;
    const now = new Date().toISOString();
    return {
      sessions: { ...state.sessions, [lesson.id]: { ...session, finished: true, cursor: lesson.exercises.length + 1 } },
      records: { ...state.records, [lesson.id]: {
        attempts, bestScore: Math.max(old?.bestScore ?? 0, score), lastScore: score,
        completedAt: old?.completedAt ?? (lessonPassed(lesson, score) ? now : null), lastPracticedAt: now,
        reviewOn: lessonPassed(lesson, score) ? addDays(dayKey(), nextReviewDays(score, attempts)) : dayKey(),
        history: [...(old?.history ?? []), {
          at: now, score, firstTry: session.firstTry, confidence: session.firstConfidence,
          writings: Object.fromEntries([...lesson.exercises.flatMap((exercise) => {
            const answer = session.answers[exercise.id];
            const text = exercise.kind === 'reflection' ? answer?.value : answer?.reasoning;
            return text?.trim() ? [[exercise.id, text]] : [];
          }), ...Object.entries(session.answers).filter(([id]) => id.startsWith('inquiry-')).map(([id, answer]) => [id, `Eerste analyse:\n${answer.reasoning}\n\nHerziening:\n${answer.value}`])]),
        }].slice(-10),
      } },
    };
  }),
  replace: (data) => set(data),
  reset: () => set(EMPTY_ARGUMENTS),
  saveWorkshop: (preset, map) => { if (!validateArgumentMap(map).length) set((state) => ({ workshops: { ...state.workshops, [preset]: map } })); },
  saveWorkshopNote: (preset, note) => set((state) => ({ workshopNotes: { ...state.workshopNotes, [preset]: note } })),
}), {
  name: ARGUMENTS_KEY, version: 1, storage: validatedStorage(ArgumentDataSchema), skipHydration: true,
  partialize: ({ records, sessions, workshops, workshopNotes }) => ({ records, sessions, workshops, workshopNotes }),
}));

export function pickArgumentData({ records, sessions, workshops, workshopNotes }: ArgumentData): ArgumentData { return { records, sessions, workshops, workshopNotes }; }
