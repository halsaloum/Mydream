import { course, lessonEntries, type LessonEntry } from '@/content/catalog';
import type { Domain, Layer } from '@/content/schema';
import type { SessionState } from '@/engine/session';
import { addDays, dayKey } from '@/lib/dates';
import type { ProgressData, ReviewItem } from './progress';
import { latestOpenLessonSession } from './sessions';
import { BASIS_START_LAYER, type Profile } from './settings';

/** Afgeleide gegevens voor de schermen. Alles hier komt uit echte voortgang; niets wordt verzonnen. */

export type LessonStatus = 'done' | 'busy' | 'new';

export function lessonStatus(id: string, progress: ProgressData, sessions: Record<string, SessionState>): LessonStatus {
  const session = sessions[id];
  if (session && session.phase !== 'done') return 'busy';
  return progress.lessons[id] ? 'done' : 'new';
}

/** De aanbevolen volgende les: de eerste niet-afgeronde les vanaf het gekozen startpunt. */
export function recommendedLesson(progress: ProgressData, profile: Profile): LessonEntry | undefined {
  const startLayer = profile.start === 'basis' ? BASIS_START_LAYER : 0;
  const open = (entry: LessonEntry) => !progress.lessons[entry.lesson.id];
  return lessonEntries.find((entry) => entry.layerIndex >= startLayer && open(entry)) ?? lessonEntries.find(open);
}

export type ContinueTarget =
  | { kind: 'resume'; entry: LessonEntry; session: SessionState }
  | { kind: 'next'; entry: LessonEntry }
  | { kind: 'complete' };

/** "Verder met jouw les": eerst een lopende les, anders de aanbevolen volgende. */
export function continueTarget(progress: ProgressData, sessions: Record<string, SessionState>, profile: Profile): ContinueTarget {
  const open = latestOpenLessonSession(sessions);
  const openEntry = open && lessonEntries.find((entry) => entry.lesson.id === open.id);
  if (open && openEntry) return { kind: 'resume', entry: openEntry, session: open };
  const next = recommendedLesson(progress, profile);
  return next ? { kind: 'next', entry: next } : { kind: 'complete' };
}

export type Completion = { done: number; total: number; ratio: number };

function completion(entries: readonly LessonEntry[], progress: ProgressData): Completion {
  const done = entries.filter((entry) => progress.lessons[entry.lesson.id]).length;
  return { done, total: entries.length, ratio: entries.length ? done / entries.length : 0 };
}

export function layerCompletion(layer: Layer, progress: ProgressData, domainId?: string): Completion {
  return completion(
    lessonEntries.filter((entry) => entry.layer.id === layer.id && (!domainId || entry.domain.id === domainId)),
    progress,
  );
}

export function domainCompletion(domain: Domain, progress: ProgressData): Completion {
  return completion(
    lessonEntries.filter((entry) => entry.domain.id === domain.id),
    progress,
  );
}

export function courseCompletion(progress: ProgressData): Completion {
  return completion(lessonEntries, progress);
}

/** Gemiddelde "in één keer goed" over afgeronde lessen (beste poging), of null zonder data. */
export function averageAccuracy(progress: ProgressData, entries: readonly LessonEntry[] = lessonEntries): number | null {
  const scores = entries.flatMap((entry) => {
    const record = progress.lessons[entry.lesson.id];
    return record ? [record.bestAccuracy] : [];
  });
  return scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null;
}

/** Aaneengesloten oefendagen tot en met vandaag (of gisteren, als er vandaag nog niet geoefend is). */
export function streakDays(activity: ProgressData['activity'], today = dayKey()): number {
  const practiced = (key: string) => (activity[key]?.activeMs ?? 0) > 0 || (activity[key]?.sessions ?? 0) > 0;
  let cursor = practiced(today) ? today : addDays(today, -1);
  let count = 0;
  while (practiced(cursor)) {
    count += 1;
    cursor = addDays(cursor, -1);
  }
  return count;
}

export function recentDays(activity: ProgressData['activity'], days: number, today = dayKey()) {
  return Array.from({ length: days }, (_, i) => {
    const key = addDays(today, i - days + 1);
    return { key, activeMs: activity[key]?.activeMs ?? 0, sessions: activity[key]?.sessions ?? 0 };
  });
}

export function reviewList(progress: ProgressData): ReviewItem[] {
  return Object.values(progress.review).sort((a, b) => Date.parse(b.lastMissedAt) - Date.parse(a.lastMissedAt));
}

export const REVIEW_BATCH = 8;

export function lessonCount() {
  return { lessons: lessonEntries.length, layers: course.layers.length };
}
