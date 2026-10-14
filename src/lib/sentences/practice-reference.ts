import { sentenceLessonById } from '@/content/sentences';

// Links follow the subject of the supplementary lesson; they do not alter saved exercise IDs.
const practiceGroups: Record<string, readonly string[]> = {
  'zinnen-01': ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16', 'p17'],
  'zinnen-02': ['z20'],
  'zinnen-04': ['p8'],
  'zinnen-05': ['z21'],
  'zinnen-06': ['p18', 'z1', 'z2', 's3'],
  'zinnen-08': ['s1', 's20', 's21'],
  'zinnen-10': ['s22'],
  'zinnen-11': ['z22'],
  'zinnen-12': ['z3', 's2'],
};

export function sentenceLessonForPractice(lessonId: string) {
  const id = Object.keys(practiceGroups).find((key) => practiceGroups[key]!.includes(lessonId));
  return id ? sentenceLessonById.get(id) : undefined;
}
