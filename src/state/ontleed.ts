import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getOntleedLesson } from '@/content/ontleed';
import type { OntleedLesson, Question } from '@/content/ontleed/types';
import { gradeQuestion, type Answer } from '@/lib/ontleed/grade';
import { validatedStorage } from './storage';

const TimestampSchema = z.number().finite().nonnegative();
const AnswerSchema = z.union([z.string(), z.number().int().nonnegative(), z.array(z.number().int().nonnegative())]);
const AttemptSchema = z.object({ answer: AnswerSchema, correct: z.boolean(), at: TimestampSchema, concept: z.string() });
export const LabDraftSchema = z.object({
  variant: z.number().int().nonnegative().optional(), visited: z.array(z.number().int().nonnegative()).optional(),
  placements: z.record(z.string(), z.number().int().nonnegative()).optional(), checked: z.boolean().optional(),
  answer: AnswerSchema.optional(), correct: z.boolean().optional(),
});
export type LabDraft = z.infer<typeof LabDraftSchema>;
const SessionSchema = z.object({
  step: z.number().int().nonnegative(), answers: z.record(z.string(), AttemptSchema),
  draft: z.string(), checks: z.array(z.number().int().nonnegative()), startedAt: TimestampSchema, labDraft: LabDraftSchema.optional(),
});
const RetrievalSchema = z.object({
  due: TimestampSchema, interval: z.number().int().min(0).max(3),
  attempts: z.number().int().nonnegative(), correct: z.number().int().nonnegative(), last: TimestampSchema,
}).refine(record => record.correct <= record.attempts, { message: 'Correcte antwoorden kunnen niet meer zijn dan pogingen.' });
const ReviewRoundSchema = z.object({
  items: z.array(z.object({ lessonId: z.string().min(1), questionId: z.string().min(1) })).min(1).max(8),
  position: z.number().int().nonnegative(), responses: z.record(z.string(), AttemptSchema),
  startedAt: TimestampSchema.default(0),
}).superRefine((round, ctx) => {
  if (round.position > round.items.length) ctx.addIssue({ code: 'custom', message: 'De positie ligt buiten de ronde.' });
  if (new Set(round.items.map(item => item.lessonId)).size !== round.items.length) {
    ctx.addIssue({ code: 'custom', message: 'Een les komt maximaal eenmaal per ronde terug.' });
  }
  for (let index = 0; index < round.position; index++) {
    if (!round.responses[String(index)]) ctx.addIssue({ code: 'custom', message: 'Een eerdere vraag is nog onbeantwoord.' });
  }
  for (const key of Object.keys(round.responses)) {
    const index = Number(key);
    if (!Number.isInteger(index) || String(index) !== key || index < 0 || index >= round.items.length || index > round.position) {
      ctx.addIssue({ code: 'custom', message: 'Een antwoord hoort niet bij de huidige of een eerdere vraag.' });
    }
  }
});

export const OntleedDataSchema = z.object({
  sessions: z.record(z.string(), SessionSchema),
  completed: z.record(z.string(), z.object({
    at: TimestampSchema, accuracy: z.number().min(0).max(100), firstAccuracy: z.number().min(0).max(100), count: z.number().int().positive(),
  })),
  retrieval: z.record(z.string(), RetrievalSchema), reviewAnswers: z.record(z.string(), AttemptSchema),
  reviewRound: ReviewRoundSchema.nullable().default(null), lastLesson: z.string().nullable(),
}).transform(data => {
  // A removed/renamed retrieval question invalidates only the active round, not earlier learning records.
  const validRound = data.reviewRound?.items.every(item => data.completed[item.lessonId]
    && getOntleedLesson(item.lessonId)?.retrieval.some(question => question.id === item.questionId));
  const retrieval = { ...data.retrieval };
  for (const [id, completed] of Object.entries(data.completed)) {
    if (getOntleedLesson(id) && !retrieval[id]) retrieval[id] = { due: completed.at + 86_400_000, interval: 0, attempts: 0, correct: 0, last: 0 };
  }
  return { ...data, retrieval, reviewRound: validRound ? data.reviewRound : null };
});
export type OntleedData = z.infer<typeof OntleedDataSchema>;
export type LessonSession = z.infer<typeof SessionSchema>;
type SessionPatch = Partial<Pick<LessonSession, 'step' | 'draft' | 'checks' | 'labDraft'>>;
type ReviewItem = { lessonId: string; questionId: string };
export const EMPTY_ONTLEED: OntleedData = { sessions: {}, completed: {}, retrieval: {}, reviewAnswers: {}, reviewRound: null, lastLesson: null };
const DAY = 86400000;
export const RETRIEVAL_DAYS = [1, 3, 7, 21] as const;
export const ONTLEED_KEY = 'pennig:ontleed-v1';
export const newSession = (now = Date.now()): LessonSession => ({ step: 0, answers: {}, draft: '', checks: [], startedAt: now });
export const transferWordCount = (draft: string): number => draft.trim().split(/\s+/u).filter(token => /[\p{L}\p{N}]/u.test(token)).length;
export function hasTransferCriteria(checks: number[], count: number): boolean {
  return checks.length === count && new Set(checks).size === count && checks.every(index => Number.isInteger(index) && index >= 0 && index < count);
}
function questionFor(lesson: OntleedLesson, key: string): Question | undefined {
  if (key === 'discovery') return { ...lesson.discovery, id: key, kind: 'choice', concept: lesson.title, hint: '', explanation: '' };
  return lesson.practice.find(question => question.id === key);
}
function copiedAnswer(answer: Answer): Answer { return Array.isArray(answer) ? [...answer] : answer; }
function validAnswer(question: Question, answer: Answer): boolean {
  if (question.kind === 'choice') return typeof answer === 'number' && Number.isInteger(answer) && answer >= 0 && answer < question.options.length;
  if (question.kind === 'type') return typeof answer === 'string' && answer.trim().length > 0;
  return Array.isArray(answer) && new Set(answer).size === answer.length && answer.every(index => Number.isInteger(index) && index >= 0 && index < question.tokens.length)
    && (question.kind === 'order' ? answer.length === question.tokens.length : answer.length > 0);
}

export const useOntleed = create<OntleedData & {
  start: (id: string) => void; patch: (id: string, patch: SessionPatch) => void;
  answer: (id: string, key: string, value: Answer, correct: boolean, concept: string) => void;
  complete: (id: string, questionIds: string[], criteriaCount: number, now?: number) => void;
  beginReview: (items: ReviewItem[]) => void; advanceReview: () => void; closeReview: () => void;
  review: (lessonId: string, questionId: string, value: Answer, correct: boolean, concept: string, now?: number) => void;
  restart: (id: string) => void; replace: (data: OntleedData) => void;
}>()(persist((set) => ({
  ...EMPTY_ONTLEED,
  start: id => set(state => getOntleedLesson(id) ? {
    lastLesson: id, sessions: { ...state.sessions, [id]: state.sessions[id] ?? newSession() },
  } : state),
  patch: (id, patch) => set(state => {
    const lesson = getOntleedLesson(id);
    if (!lesson) return state;
    const session = state.sessions[id] ?? newSession();
    const updates: SessionPatch = {};
    if (patch.labDraft) {
      const lab = LabDraftSchema.safeParse(patch.labDraft);
      if (lab.success) updates.labDraft = lab.data;
    }
    if (typeof patch.draft === 'string') updates.draft = patch.draft;
    if (Array.isArray(patch.checks) && patch.checks.every(index => Number.isInteger(index) && index >= 0 && index < lesson.transfer.checklist.length)) updates.checks = [...new Set(patch.checks)];
    if (typeof patch.step === 'number' && Number.isInteger(patch.step) && patch.step >= 0) updates.step = Math.min(patch.step, lesson.sections.length + lesson.practice.length + 3);
    return { sessions: { ...state.sessions, [id]: { ...session, ...updates } } };
  }),
  answer: (id, key, value, _correct, _concept) => set(state => {
    const lesson = getOntleedLesson(id);
    if (!lesson) return state;
    const session = state.sessions[id] ?? newSession();
    if (session.answers[key]) return state;
    const question = questionFor(lesson, key);
    if (key === 'lab' ? value !== 'onderzocht' : !question || !validAnswer(question, value)) return state;
    const attempt = { answer: copiedAnswer(value), correct: question ? gradeQuestion(question, value) : true, at: Date.now(), concept: question?.concept ?? lesson.title };
    return { sessions: { ...state.sessions, [id]: { ...session, answers: { ...session.answers, [key]: attempt } } } };
  }),
  complete: (id, ids, criteriaCount, now = Date.now()) => set(state => {
    const lesson = getOntleedLesson(id), session = state.sessions[id];
    if (!lesson || !session || !Number.isFinite(now) || now < 0) return state;
    const required = lesson.practice.map(question => question.id);
    if (ids.length !== required.length || new Set(ids).size !== required.length || required.some(key => !ids.includes(key) || !session.answers[key])
      || criteriaCount !== lesson.transfer.checklist.length || !hasTransferCriteria(session.checks, criteriaCount)
      || transferWordCount(session.draft) < 12 || (state.completed[id]?.at ?? -1) >= session.startedAt) return state;
    const accuracy = Math.round(100 * required.filter(key => session.answers[key]!.correct).length / required.length);
    const previous = state.completed[id], at = Math.max(now, session.startedAt);
    return {
      completed: { ...state.completed, [id]: { at, accuracy, firstAccuracy: previous?.firstAccuracy ?? accuracy, count: (previous?.count ?? 0) + 1 } },
      retrieval: { ...state.retrieval, [id]: state.retrieval[id] ?? { due: at + DAY, interval: 0, attempts: 0, correct: 0, last: 0 } },
    };
  }),
  beginReview: items => set(state => {
    if (state.reviewRound) return state;
    const seen = new Set<string>();
    const valid = items.filter(item => {
      if (seen.has(item.lessonId) || !state.completed[item.lessonId] || !getOntleedLesson(item.lessonId)?.retrieval.some(question => question.id === item.questionId)) return false;
      seen.add(item.lessonId);
      return true;
    }).slice(0, 8).map(item => ({ ...item }));
    return valid.length ? { reviewRound: { items: valid, position: 0, responses: {}, startedAt: Date.now() } } : state;
  }),
  advanceReview: () => set(state => {
    const round = state.reviewRound;
    if (!round || round.position >= round.items.length || !round.responses[String(round.position)]) return state;
    return { reviewRound: { ...round, position: round.position + 1 } };
  }),
  closeReview: () => set({ reviewRound: null }),
  review: (lessonId, questionId, value, _correct, _concept, now = Date.now()) => set(state => {
    const round = state.reviewRound, item = round?.items[round.position];
    if (!round || !item || item.lessonId !== lessonId || item.questionId !== questionId || round.responses[String(round.position)] || !state.completed[lessonId] || !Number.isFinite(now) || now < 0) return state;
    const question = getOntleedLesson(lessonId)?.retrieval.find(candidate => candidate.id === questionId);
    if (!question || !validAnswer(question, value)) return state;
    const correct = gradeQuestion(question, value);
    const previous = state.retrieval[lessonId] ?? { due: now, interval: 0, attempts: 0, correct: 0, last: 0 };
    const interval = correct ? Math.min(previous.interval + 1, 3) : 0;
    const attempt = { answer: copiedAnswer(value), correct, concept: question.concept, at: now };
    return {
      reviewRound: { ...round, responses: { ...round.responses, [String(round.position)]: attempt } },
      retrieval: { ...state.retrieval, [lessonId]: { due: now + RETRIEVAL_DAYS[interval]! * DAY, interval, attempts: previous.attempts + 1, correct: previous.correct + Number(correct), last: now } },
      reviewAnswers: { ...state.reviewAnswers, [`${lessonId}:${questionId}`]: attempt },
    };
  }),
  restart: id => set(state => getOntleedLesson(id) ? {
    lastLesson: id,
    // A restart in the same millisecond must still be a fresh unfinished session.
    sessions: { ...state.sessions, [id]: newSession(Math.max(Date.now(), (state.completed[id]?.at ?? -1) + 1, (state.sessions[id]?.startedAt ?? -1) + 1)) },
  } : state),
  replace: data => {
    const parsed = OntleedDataSchema.safeParse(data);
    if (parsed.success) set(parsed.data);
  },
}), {
  name: ONTLEED_KEY, version: 1, storage: validatedStorage(OntleedDataSchema), skipHydration: true,
  partialize: ({ sessions, completed, retrieval, reviewAnswers, reviewRound, lastLesson }) => ({ sessions, completed, retrieval, reviewAnswers, reviewRound, lastLesson }),
}));
