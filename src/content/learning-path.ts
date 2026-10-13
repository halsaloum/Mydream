import type { LessonEntry } from './catalog';

export type LearningPhase = {
  id: string;
  title: string;
  description: string;
  optional?: boolean;
  entries: readonly LessonEntry[];
};

/** Schrijven en argumenteren vereisen geen voorafgaande universitaire taalkunde. */
export function createLearningPath(entries: readonly LessonEntry[]): LearningPhase[] {
  const argument = (entry: LessonEntry) => /^a(?:2\d|3[0-5])$/.test(entry.lesson.id);
  const foundation = (entry: LessonEntry) => entry.layerIndex < 3;
  const advanced = (entry: LessonEntry) => entry.lesson.stage === 'bachelor' || entry.lesson.stage === 'master';
  return [
    {
      id: 'taalbasis', title: '1. Een stevige taalbasis',
      description: 'Van letters en klanken naar spelling die je zelf kunt uitleggen en toepassen.',
      entries: entries.filter(foundation),
    },
    {
      id: 'schrijven', title: '2. Van woorden naar een heldere tekst',
      description: 'Bouw zinnen, verbind ideeën en herschrijf alinea’s voor je lezer.',
      entries: entries.filter((entry) => !foundation(entry) && !argument(entry) && !advanced(entry)),
    },
    {
      id: 'argumenteren', title: '3. Sterk argumenteren en kritisch denken',
      description: 'Van standpunt en reden naar bewijs wegen, drogredenen herstellen en een zelfstandig betoog.',
      entries: entries.filter(argument),
    },
    {
      id: 'verdieping', title: 'Verdiep verder in taal', optional: true,
      description: 'Extra verdieping in woordvorming, betekenis en grammaticale analyse. Kies wat je nieuwsgierig maakt.',
      entries: entries.filter((entry) => !foundation(entry) && !argument(entry) && advanced(entry)),
    },
  ];
}
