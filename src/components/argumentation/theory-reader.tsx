'use client';

import { Check, GraduationCap, Lightbulb } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { lessonCoreChecks } from '@/content/argumentation/core-checks';
import { argumentInquiries } from '@/content/argumentation/inquiries';
import { lessonScaffolds } from '@/content/argumentation/scaffolds';
import type { ArgumentLesson } from '@/content/argumentation/types';
import { readingText } from '@/lib/argumentation/reading-text';
import { theoryPages, type TheoryPage } from '@/lib/argumentation/theory-pages';
import type { ArgumentSession } from '@/state/argumentation';
import { CasePreparation } from './case-preparation';
import { CoreCheckView } from './core-check';
import { FoundationView } from './foundation-view';
import { LessonWarmup } from './lesson-warmup';
import { PageAudio } from './page-audio';

const Lab = dynamic(() => import('./argument-lab').then((module) => module.ArgumentLabView), { loading: () => <p role="status" className="p-6 text-ink-muted">Het experiment wordt geladen…</p> });
const MediaCard = dynamic(() => import('./media-view').then((module) => module.MediaCard), { loading: () => <p role="status" className="p-5 text-ink-muted">De extra uitleg wordt geladen…</p> });
const LessonIllustration = dynamic(() => import('./lesson-illustration').then((module) => module.LessonIllustration), { loading: () => <p role="status" className="rounded-card bg-surface p-5 text-ink-muted">De beeldkaart wordt geladen…</p> });
const Workshop = dynamic(() => import('./map-workshop').then((module) => module.ArgumentMapWorkshop), { loading: () => <p role="status" className="rounded-card bg-surface p-5 text-ink-muted">Je werkkaart wordt geladen…</p> });

export type TheoryReaderProps = { lesson: ArgumentLesson; session: ArgumentSession; pageIndex: number; onPageChange: (index: number) => void };

function Objectives({ lesson }: { lesson: ArgumentLesson }) {
  return <div className="rounded-card border border-blue-line bg-blue-soft p-5 sm:p-6"><h3 className="flex items-center gap-2 font-display font-bold text-blue-ink"><GraduationCap aria-hidden="true" className="size-5" />Na deze les kun je</h3><ul className="mt-3 space-y-2">{lesson.objectives.map((objective) => <li key={objective} className="flex items-start gap-2 text-small leading-relaxed"><Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-blue-ink" />{objective}</li>)}</ul></div>;
}

function WorkedExample({ text }: { text: string }) {
  return <div className="rounded-card border border-line bg-sunken p-5 sm:p-6"><p className="mb-2 text-caption font-bold tracking-wider text-ink-muted uppercase">Uitgewerkt voorbeeld</p><p className="whitespace-pre-line text-body leading-relaxed">{text}</p></div>;
}

function PageContent({ page, lesson, session }: { page: TheoryPage; lesson: ArgumentLesson; session: ArgumentSession }) {
  const inquiry = argumentInquiries[lesson.id];
  switch (page.kind) {
    case 'concept':
      return <FoundationView lessonId={lesson.id} concept={page.foundation} session={session} />;
    case 'start': {
      const scaffold = lessonScaffolds[lesson.id];
      return <>{scaffold && <LessonWarmup lessonId={lesson.id} scaffold={scaffold} session={session} />}<Objectives lesson={lesson} />{lesson.checkpoint && <p className="rounded-control border border-orange-line bg-orange-soft p-4 text-small leading-relaxed text-orange-ink">Deze toets meet je eerste antwoord per opdracht. Vanaf 80% is het checkpoint behaald. Je krijgt na elke vraag uitleg en kunt de volledige toets opnieuw maken.</p>}</>;
    }
    case 'section': {
      const section = lesson.sections[page.sectionIndex];
      if (!section) return null;
      const coreCheck = page.sectionIndex === 1 ? lessonCoreChecks[lesson.id] : undefined;
      const coreCorrect = coreCheck && session.answers[`core-${lesson.id}`]?.value === coreCheck.answer;
      const showExample = (page.sectionIndex > 0 || !inquiry) && (!coreCheck || coreCorrect || session.finished);
      return <><p className="whitespace-pre-line text-body leading-[1.9] text-ink-soft">{section.body}</p>{page.sectionIndex === 0 && <LessonIllustration lessonId={lesson.id} />}{coreCheck && <CoreCheckView lessonId={lesson.id} check={coreCheck} session={session} />}{showExample && <WorkedExample text={section.example} />}<p className="flex items-start gap-3 text-small leading-relaxed text-blue-ink"><Lightbulb aria-hidden="true" className="mt-1 size-5 shrink-0" /><span>{section.takeaway}</span></p></>;
    }
    case 'inquiry':
      return inquiry ? <><CasePreparation lessonId={lesson.id} inquiry={inquiry} session={session} />{(session.answers[`inquiry-${lesson.id}`]?.checked || session.finished) && lesson.sections[0] && <WorkedExample text={lesson.sections[0].example} />}</> : null;
    case 'workshop':
      return <Workshop presetId={page.presetId} embedded />;
    case 'deepDive':
      return <div className="rounded-card border-2 border-purple-line bg-purple-soft p-5 sm:p-6"><p className="whitespace-pre-line text-body leading-[1.9] text-ink-soft">{lesson.deepDive.body}</p></div>;
    case 'lab':
      return lesson.lab ? <><p className="text-small text-ink-muted">Voorspel eerst wat er verandert. Gebruik daarna het lab om je verklaring te toetsen.</p><Lab kind={lesson.lab} /></> : null;
    case 'media':
      return <><p className="text-small leading-relaxed text-ink-muted">Neem de tijd voor een andere uitleg. Pauzeer bij een redenering en vergelijk die met je eigen analyse.</p><MediaCard item={page.item} /></>;
    case 'recap':
      return <><Objectives lesson={lesson} /><div className="rounded-card border border-line bg-sunken p-5 sm:p-6"><h3 className="font-display font-bold text-ink">Kijk nog één keer terug</h3><p className="mt-3 text-small leading-relaxed text-ink-soft">Welke reden draagt het standpunt, welke aanname verbindt beide en waar ligt de grens van de conclusie? Benoem het criterium dat je nu zelf kunt gebruiken.</p><ul className="mt-4 space-y-3">{lesson.sections.map((section, index) => <li key={index} className="flex items-start gap-3 text-small leading-relaxed text-blue-ink"><Lightbulb aria-hidden="true" className="mt-1 size-4 shrink-0" /><span>{section.takeaway}</span></li>)}</ul></div></>;
  }
}

/** Only the current reading page is mounted. Exercise/navigation controls belong to the player. */
export function TheoryReader({ lesson, session, pageIndex, onPageChange }: TheoryReaderProps) {
  const pages = theoryPages(lesson);
  const index = Number.isFinite(pageIndex) ? Math.max(0, Math.min(pages.length - 1, Math.floor(pageIndex))) : 0;
  const page = pages[index]!;
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (index !== pageIndex) onPageChange(index); }, [index, pageIndex, onPageChange]);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [lesson.id, page.id]);
  return <section aria-label={`Leespagina: ${page.title}`} data-theory-page={page.kind} className="space-y-6">
    <div><p className="mb-2 text-caption font-bold tracking-wider text-blue-ink uppercase">{page.label}</p><h2 ref={heading} id={`${lesson.id}-theory-page`} tabIndex={-1} className="font-display text-title leading-snug font-bold outline-none">{page.title}</h2></div>
    <PageAudio pageId={page.id} text={readingText(lesson, page, session)} />
    <div key={page.id} className="space-y-6"><PageContent page={page} lesson={lesson} session={session} /></div>
  </section>;
}
