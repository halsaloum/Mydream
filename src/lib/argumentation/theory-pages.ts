import { argumentInquiries } from '@/content/argumentation/inquiries';
import { foundationForLesson, type FoundationConcept } from '@/content/argumentation/foundations';
import { mediaForLesson } from '@/content/argumentation/lesson-media';
import type { ArgumentMedia } from '@/content/argumentation/media';
import type { ArgumentLesson } from '@/content/argumentation/types';

type PageMeta = { id: string; title: string; label: string };
export type TheoryPage = PageMeta & (
  | { kind: 'concept'; foundation: FoundationConcept }
  | { kind: 'start' }
  | { kind: 'section'; sectionIndex: number }
  | { kind: 'inquiry' }
  | { kind: 'workshop'; presetId: string }
  | { kind: 'deepDive' }
  | { kind: 'lab' }
  | { kind: 'media'; item: ArgumentMedia }
  | { kind: 'recap' }
);

const lessonWorkshops: Record<string, { presetId: string; title: string }[]> = {
  'basis-argumentstructuur': [{ presetId: 'linked', title: 'Bouw een gezamenlijke steunroute' }, { presetId: 'convergent', title: 'Vergelijk twee afzonderlijke steunroutes' }],
  'basis-verborgen-premissen': [{ presetId: 'serial', title: 'Volg de tussenconclusie naar het besluit' }],
  'master-toulmin-bewijslast': [{ presetId: 'toulmin', title: 'Maak gegevens, brug en voorbehoud zichtbaar' }],
  'master-weerlegbare-argumenten': [{ presetId: 'toulmin', title: 'Kies precies wat de tegenwerping raakt' }],
};

/** A stable reading order, keeping original content in the lesson rather than copying it. */
export function theoryPages(lesson: ArgumentLesson): TheoryPage[] {
  const prefix = `${lesson.id}:`;
  const pages: TheoryPage[] = foundationForLesson(lesson.id).map((foundation) => ({ id: `${prefix}concept-${foundation.id}`, kind: 'concept', foundation, title: foundation.title, label: 'Het fundament' }));
  pages.push({ id: `${prefix}start`, kind: 'start', title: 'Begin met één kleine stap', label: 'Voorbereiding' });
  lesson.sections.forEach((section, sectionIndex) => {
    pages.push({ id: `${prefix}section-${sectionIndex}`, kind: 'section', sectionIndex, title: section.title, label: 'Uitleg en voorbeeld' });
    if (sectionIndex === 0 && argumentInquiries[lesson.id]) pages.push({ id: `${prefix}inquiry`, kind: 'inquiry', title: 'Denk eerst zelf', label: 'Jouw analyse' });
  });
  // Even a lesson without sections retains its independent thinking case.
  if (!lesson.sections.length && argumentInquiries[lesson.id]) pages.push({ id: `${prefix}inquiry`, kind: 'inquiry', title: 'Denk eerst zelf', label: 'Jouw analyse' });
  for (const workshop of lessonWorkshops[lesson.id] ?? []) pages.push({ id: `${prefix}workshop-${workshop.presetId}`, kind: 'workshop', presetId: workshop.presetId, title: workshop.title, label: 'Maak de redenering zichtbaar' });
  pages.push({ id: `${prefix}deepDive`, kind: 'deepDive', title: lesson.deepDive.title, label: 'Extra verdieping' });
  if (lesson.lab) pages.push({ id: `${prefix}lab`, kind: 'lab', title: 'Toets de aannames', label: 'Oefenlab' });
  for (const item of mediaForLesson(lesson.id)) pages.push({ id: `${prefix}media-${item.id}`, kind: 'media', item, title: item.title, label: item.kind === 'video' ? 'Video en toepassing' : 'Visuele uitleg en toepassing' });
  pages.push({ id: `${prefix}recap`, kind: 'recap', title: 'Wat neem je mee?', label: 'Terugblik' });
  return pages;
}
