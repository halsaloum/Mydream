import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getOntleedLesson } from '@/content/ontleed';
import type { OntleedLesson, Question } from '@/content/ontleed/types';
import { gradeQuestion, type Answer } from '@/lib/ontleed/grade';
import { getSectionCoach } from '@/lib/ontleed/lesson-coach';
import { isProductionQuestion, learningDay } from '@/lib/ontleed/learning';
import { validatedStorage } from './storage';

const MAX_TIMESTAMP = 253_402_300_799_999; // Last millisecond in the four-digit ISO year range.
const TimestampSchema = z.number().finite().nonnegative().max(MAX_TIMESTAMP);
const LearningDaySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(day => {
  const date = new Date(`${day}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === day;
}, { message: 'De kalenderdag bestaat niet.' });
const AnswerSchema = z.union([z.string(), z.number().int().nonnegative(), z.array(z.number().int().nonnegative())]);
const AttemptSchema = z.object({ answer: AnswerSchema, correct: z.boolean(), at: TimestampSchema, concept: z.string(), assisted: z.boolean().optional() });
export const LabDraftSchema = z.object({
  variant: z.number().int().nonnegative().optional(), visited: z.array(z.number().int().nonnegative()).optional(),
  placements: z.record(z.string(), z.number().int().nonnegative()).optional(), checked: z.boolean().optional(),
  answer: AnswerSchema.optional(), correct: z.boolean().optional(),
  retryAnswer: AnswerSchema.optional(), retryCorrect: z.boolean().optional(),
});
export type LabDraft = z.infer<typeof LabDraftSchema>;
const TheoryProgressSchema = z.object({
  viewed: z.array(z.number().int()), answer: z.number().int().optional(),
});
export type TheoryProgress = z.infer<typeof TheoryProgressSchema>;
const SessionSchema = z.object({
  step: z.number().int().nonnegative(), answers: z.record(z.string(), AttemptSchema),
  corrections: z.record(z.string(), AttemptSchema).default({}),
  repairs: z.record(z.string(), AttemptSchema).default({}),
  predictions: z.record(z.string(), z.object({ draft: z.string(), revealed: z.boolean() })).default({}),
  theoryProgress: z.record(z.string(), TheoryProgressSchema).default({}),
  draft: z.string(), checks: z.array(z.number().int().nonnegative()), startedAt: TimestampSchema, labDraft: LabDraftSchema.optional(),
});
const RetrievalSchema = z.object({
  due: TimestampSchema, interval: z.number().int().min(0).max(3),
  attempts: z.number().int().nonnegative(), correct: z.number().int().nonnegative(), last: TimestampSchema,
  successfulDays: z.array(LearningDaySchema).optional(),
}).refine(record => record.correct <= record.attempts && new Set(record.successfulDays ?? []).size <= record.correct, { message: 'Bewijs en correcte antwoorden moeten bij de opgeslagen pogingen passen.' });
const ReviewRoundSchema = z.object({
  items: z.array(z.object({ lessonId: z.string().min(1), questionId: z.string().min(1), source: z.literal('mistake').optional() })).min(1).max(8),
  position: z.number().int().nonnegative(), responses: z.record(z.string(), AttemptSchema),
  corrections: z.record(z.string(), AttemptSchema).default({}),
  assisted: z.array(z.number().int().nonnegative()).default([]),
  startedAt: TimestampSchema.default(0),
}).superRefine((round, ctx) => {
  if (round.position > round.items.length) ctx.addIssue({ code: 'custom', message: 'De positie ligt buiten de ronde.' });
  if (new Set(round.items.map(item => item.source === 'mistake' ? `mistake:${item.lessonId}:${item.questionId}` : item.lessonId)).size !== round.items.length) {
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
  for (const key of Object.keys(round.corrections)) {
    if (!round.responses[key] || round.responses[key].correct) ctx.addIssue({ code: 'custom', message: 'Een verbetering hoort bij een werkelijk fout eerste antwoord.' });
  }
  if (new Set(round.assisted).size !== round.assisted.length || round.assisted.some(index => index >= round.items.length || index > round.position)) {
    ctx.addIssue({ code: 'custom', message: 'Een aanwijzing hoort bij een huidige of eerdere vraag.' });
  }
});

const MistakeSchema = z.object({
  lessonId: z.string(), questionId: z.string(), due: TimestampSchema,
  addedAt: TimestampSchema, last: TimestampSchema, misses: z.number().int().positive(),
  attempts: z.number().int().nonnegative(), correct: z.number().int().nonnegative(),
  successfulDays: z.array(LearningDaySchema).default([]), resolved: z.boolean().default(false),
}).refine(item => item.correct <= item.attempts && new Set(item.successfulDays).size <= item.correct
  && (!item.resolved || new Set(item.successfulDays).size >= 2), { message: 'Een fout kan pas na twee zelfstandig juiste dagen uit de wachtrij.' });
export type OntleedMistake = z.infer<typeof MistakeSchema>;

export const OntleedDataSchema = z.object({
  sessions: z.record(z.string(), SessionSchema),
  completed: z.record(z.string(), z.object({
    at: TimestampSchema, accuracy: z.number().min(0).max(100), firstAccuracy: z.number().min(0).max(100), count: z.number().int().positive(),
  })),
  retrieval: z.record(z.string(), RetrievalSchema), reviewAnswers: z.record(z.string(), AttemptSchema),
  mistakes: z.record(z.string(), MistakeSchema).default({}), writingDraft: z.string().default(''),
  reviewRound: ReviewRoundSchema.nullable().default(null), lastLesson: z.string().nullable(),
}).superRefine((data, ctx) => {
  for (const [key, item] of Object.entries(data.mistakes)) {
    if (key !== `${item.lessonId}:${item.questionId}`) ctx.addIssue({ code: 'custom', path: ['mistakes', key], message: 'Deze fout hoort niet bij de opgeslagen vraag.' });
  }
}).transform(data => {
  // A removed/renamed retrieval question invalidates only the active round, not earlier learning records.
  const validRound = data.reviewRound?.items.every(item => item.source === 'mistake'
    ? Boolean(data.mistakes[`${item.lessonId}:${item.questionId}`] && getLearningQuestion(item.lessonId, item.questionId))
    : data.completed[item.lessonId] && getOntleedLesson(item.lessonId)?.retrieval.some(question => question.id === item.questionId));
  const retrieval = { ...data.retrieval };
  const sessions: typeof data.sessions = Object.fromEntries(Object.entries(data.sessions).map(([lessonId, session]) => [lessonId, {
    ...session, theoryProgress: normalizeTheoryProgress(getOntleedLesson(lessonId), session.theoryProgress),
  }]));
  let mistakes = { ...data.mistakes };
  for (const [lessonId, session] of Object.entries(data.sessions)) {
    for (const [questionId, attempt] of Object.entries(session.answers)) {
      if (!attempt.correct && getLearningQuestion(lessonId, questionId) && !mistakes[`${lessonId}:${questionId}`]) {
        mistakes = missed(mistakes, lessonId, questionId, attempt.at);
      }
    }
  }
  for (const [key, attempt] of Object.entries(data.reviewAnswers)) {
    const divider = key.indexOf(':'), lessonId = key.slice(0, divider), questionId = key.slice(divider + 1);
    if (divider > 0 && !attempt.correct && getLearningQuestion(lessonId, questionId) && !mistakes[key]) {
      mistakes = missed(mistakes, lessonId, questionId, attempt.at);
    }
  }
  for (const [id, completed] of Object.entries(data.completed)) {
    if (getOntleedLesson(id) && !retrieval[id]) retrieval[id] = { due: Math.min(MAX_TIMESTAMP, completed.at + 86_400_000), interval: 0, attempts: 0, correct: 0, last: 0 };
  }
  return { ...data, sessions, retrieval, mistakes, reviewRound: validRound ? data.reviewRound : null };
});
export type OntleedData = z.infer<typeof OntleedDataSchema>;
export type LessonSession = z.infer<typeof SessionSchema>;
type SessionPatch = Partial<Pick<LessonSession, 'step' | 'draft' | 'checks' | 'labDraft' | 'predictions' | 'theoryProgress'>>;
type ReviewItem = { lessonId: string; questionId: string; source?: 'mistake' };
export const EMPTY_ONTLEED: OntleedData = { sessions: {}, completed: {}, retrieval: {}, reviewAnswers: {}, mistakes: {}, writingDraft: '', reviewRound: null, lastLesson: null };
const DAY = 86400000;
const validNow = (now: number) => Number.isFinite(now) && now >= 0 && now <= MAX_TIMESTAMP - 21 * DAY;
export const RETRIEVAL_DAYS = [1, 3, 7, 21] as const;
export const ONTLEED_KEY = 'pennig:ontleed-v1';
export const newSession = (now = Date.now()): LessonSession => ({ step: 0, answers: {}, corrections: {}, repairs: {}, predictions: {}, theoryProgress: {}, draft: '', checks: [], startedAt: now });
export const transferWordCount = (draft: string): number => draft.trim().split(/\s+/u).filter(token => /[\p{L}\p{N}]/u.test(token)).length;
export function hasTransferCriteria(checks: number[], count: number): boolean {
  return checks.length === count && new Set(checks).size === count && checks.every(index => Number.isInteger(index) && index >= 0 && index < count);
}
function normalizeTheoryProgress(lesson: OntleedLesson | undefined, progress: Record<string, TheoryProgress>): Record<string, TheoryProgress> {
  if (!lesson) return {};
  return Object.fromEntries(Object.entries(progress).flatMap(([key, entry]) => {
    const index = Number(key), section = lesson.sections[index];
    if (String(index) !== key || !Number.isInteger(index) || index < 0 || !section) return [];
    const viewed = [...new Set(entry.viewed.filter(exampleIndex => exampleIndex >= 0 && exampleIndex < section.examples.length))];
    const answer = entry.answer;
    return [[key, {
      viewed,
      ...(answer !== undefined && answer >= 0 && answer < getSectionCoach(lesson, index).check.options.length ? { answer } : {}),
    }]];
  }));
}
function questionFor(lesson: OntleedLesson, key: string): Question | undefined {
  if (key === 'discovery') return { ...lesson.discovery, id: key, kind: 'choice', concept: lesson.title,
    hint: 'Vergelijk wat in de voorbeelden verandert en wat gelijk blijft. Welke optie verklaart dat verschil?',
    explanation: lesson.discovery.feedback[lesson.discovery.answer] ?? '',
  };
  return lesson.practice.find(question => question.id === key);
}
export function getLearningQuestion(lessonId: string, questionId: string): Question | undefined {
  const lesson = getOntleedLesson(lessonId);
  return lesson ? questionFor(lesson, questionId) ?? lesson.retrieval.find(question => question.id === questionId) : undefined;
}
function missed(mistakes: Record<string, OntleedMistake>, lessonId: string, questionId: string, now: number) {
  const key = `${lessonId}:${questionId}`, previous = mistakes[key];
  return { ...mistakes, [key]: {
    lessonId, questionId, due: Math.min(MAX_TIMESTAMP, now + DAY), addedAt: previous?.addedAt ?? now, last: now,
    misses: (previous?.misses ?? 0) + 1, attempts: previous?.attempts ?? 0, correct: previous?.correct ?? 0,
    successfulDays: [], resolved: false,
  } };
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
  retry: (id: string, key: string, value: Answer) => void;
  repair: (id: string, key: string, value: Answer) => void;
  complete: (id: string, questionIds: string[], criteriaCount: number, now?: number) => void;
  beginReview: (items: ReviewItem[]) => void; advanceReview: () => void; closeReview: () => void;
  review: (lessonId: string, questionId: string, value: Answer, correct: boolean, concept: string, now?: number) => void;
  retryReview: (value: Answer) => void;
  markReviewAssisted: () => void;
  setWritingDraft: (text: string) => void;
  restart: (id: string) => void; replace: (data: unknown) => void;
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
    if (patch.predictions) {
      const parsed = SessionSchema.shape.predictions.safeParse(patch.predictions);
      if (parsed.success) updates.predictions = Object.fromEntries(Object.entries(parsed.data).filter(([key]) => String(Number(key)) === key && Number.isInteger(Number(key)) && Number(key) >= 0 && Number(key) < lesson.sections.length));
    }
    if (patch.theoryProgress) {
      const parsed = SessionSchema.shape.theoryProgress.safeParse(patch.theoryProgress);
      if (parsed.success) updates.theoryProgress = normalizeTheoryProgress(lesson, parsed.data);
    }
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
    return {
      lastLesson: id,
      sessions: { ...state.sessions, [id]: { ...session, answers: { ...session.answers, [key]: attempt } } },
      ...(!attempt.correct ? { mistakes: missed(state.mistakes, id, key, attempt.at) } : {}),
    };
  }),
  retry: (id, key, value) => set(state => {
    const session = state.sessions[id], question = getLearningQuestion(id, key);
    if (!session?.answers[key] || session.answers[key].correct || session.corrections[key]?.correct || !question || !validAnswer(question, value)) return state;
    const attempt = { answer: copiedAnswer(value), correct: gradeQuestion(question, value), concept: question.concept, at: Date.now() };
    return { sessions: { ...state.sessions, [id]: { ...session, corrections: { ...session.corrections, [key]: attempt } } } };
  }),
  repair: (id, key, value) => set(state => {
    const session = state.sessions[id], question = getLearningQuestion(id, key);
    if (!session?.answers[key] || session.answers[key].correct || session.repairs[key]?.correct || !question || !validAnswer(question, value)) return state;
    const attempt = { answer: copiedAnswer(value), correct: gradeQuestion(question, value), concept: question.concept, at: Date.now() };
    return { sessions: { ...state.sessions, [id]: { ...session, repairs: { ...session.repairs, [key]: attempt } } } };
  }),
  complete: (id, ids, criteriaCount, now = Date.now()) => set(state => {
    const lesson = getOntleedLesson(id), session = state.sessions[id];
    if (!lesson || !session || !validNow(now) || !validNow(session.startedAt)) return state;
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
      const key = item.source === 'mistake' ? `mistake:${item.lessonId}:${item.questionId}` : item.lessonId;
      const allowed = item.source === 'mistake'
        ? state.mistakes[`${item.lessonId}:${item.questionId}`] && getLearningQuestion(item.lessonId, item.questionId)
        : state.completed[item.lessonId] && getOntleedLesson(item.lessonId)?.retrieval.some(question => question.id === item.questionId);
      if (seen.has(key) || !allowed) return false;
      seen.add(key);
      return true;
    }).slice(0, 8).map(item => ({ ...item }));
    return valid.length ? { reviewRound: { items: valid, position: 0, responses: {}, corrections: {}, assisted: [], startedAt: Date.now() } } : state;
  }),
  advanceReview: () => set(state => {
    const round = state.reviewRound;
    if (!round || round.position >= round.items.length || !round.responses[String(round.position)]) return state;
    return { reviewRound: { ...round, position: round.position + 1 } };
  }),
  closeReview: () => set({ reviewRound: null }),
  review: (lessonId, questionId, value, _correct, _concept, now = Date.now()) => set(state => {
    const round = state.reviewRound, item = round?.items[round.position];
    if (!round || !item || item.lessonId !== lessonId || item.questionId !== questionId || round.responses[String(round.position)] || (item.source !== 'mistake' && !state.completed[lessonId]) || !validNow(now)) return state;
    const question = item.source === 'mistake' ? getLearningQuestion(lessonId, questionId) : getOntleedLesson(lessonId)?.retrieval.find(candidate => candidate.id === questionId);
    if (!question || !validAnswer(question, value)) return state;
    const correct = gradeQuestion(question, value);
    const previous = state.retrieval[lessonId] ?? { due: now, interval: 0, attempts: 0, correct: 0, last: 0 };
    const interval = correct ? Math.min(previous.interval + 1, 3) : 0;
    const assisted = round.assisted.includes(round.position);
    const attempt = { answer: copiedAnswer(value), correct, concept: question.concept, at: now, assisted };
    if (item.source === 'mistake') {
      const key = `${lessonId}:${questionId}`, mistake = state.mistakes[key];
      if (!mistake) return state;
      const days = correct && !assisted ? [...new Set([...mistake.successfulDays, learningDay(now)])] : correct ? mistake.successfulDays : [];
      return {
        reviewRound: { ...round, responses: { ...round.responses, [String(round.position)]: attempt } },
        mistakes: { ...state.mistakes, [key]: { ...mistake, last: now, attempts: mistake.attempts + 1,
          correct: mistake.correct + Number(correct), misses: mistake.misses + Number(!correct),
          successfulDays: days, resolved: days.length >= 2, due: now + (correct ? 3 : 1) * DAY } },
      };
    }
    const successfulDays = correct && !assisted && isProductionQuestion(question)
      ? [...new Set([...(previous.successfulDays ?? []), learningDay(now)])]
      : previous.successfulDays ?? [];
    return {
      reviewRound: { ...round, responses: { ...round.responses, [String(round.position)]: attempt } },
      retrieval: { ...state.retrieval, [lessonId]: { due: now + RETRIEVAL_DAYS[interval]! * DAY, interval, attempts: previous.attempts + 1, correct: previous.correct + Number(correct), last: now, successfulDays } },
      reviewAnswers: { ...state.reviewAnswers, [`${lessonId}:${questionId}`]: attempt },
      ...(!correct ? { mistakes: missed(state.mistakes, lessonId, questionId, now) } : {}),
    };
  }),
  retryReview: value => set(state => {
    const round = state.reviewRound, item = round?.items[round.position], key = String(round?.position);
    const question = item ? getLearningQuestion(item.lessonId, item.questionId) : undefined;
    if (!round || !round.responses[key] || round.responses[key].correct || round.corrections[key]?.correct || !question || !validAnswer(question, value)) return state;
    return { reviewRound: { ...round, corrections: { ...round.corrections, [key]: {
      answer: copiedAnswer(value), correct: gradeQuestion(question, value), concept: question.concept, at: Date.now(),
    } } } };
  }),
  markReviewAssisted: () => set(state => {
    const round = state.reviewRound;
    if (!round || round.position >= round.items.length || round.responses[String(round.position)] || round.assisted.includes(round.position)) return state;
    return { reviewRound: { ...round, assisted: [...round.assisted, round.position] } };
  }),
  setWritingDraft: writingDraft => set({ writingDraft }),
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
  partialize: ({ sessions, completed, retrieval, reviewAnswers, mistakes, writingDraft, reviewRound, lastLesson }) => ({ sessions, completed, retrieval, reviewAnswers, mistakes, writingDraft, reviewRound, lastLesson }),
}));
