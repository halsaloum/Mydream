'use client';

import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronDown, GraduationCap, Lightbulb, RotateCcw, X } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useEffect, useRef, type Ref } from 'react';
import { argumentLessons, argumentModuleById } from '@/content/argumentation';
import type { ArgumentLesson } from '@/content/argumentation/types';
import { Button, ButtonLink } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress';
import { LessonReader } from '@/components/reading/lesson-reader';
import { cn } from '@/lib/cn';
import { answerReady, emptyArgumentAnswer, gradeArgument, lessonPassed, lessonScore } from '@/lib/argumentation/learning';
import { useCalmMotion } from '@/lib/motion';
import { argumentLessonHref } from '@/lib/argumentation/routes';
import { useArgumentation, type ArgumentSession } from '@/state/argumentation';
import { useHydrated } from '@/state/hydration';
import { ArgumentExerciseView } from './exercise-view';
import { argumentInquiries } from '@/content/argumentation/inquiries';
import { lessonAvailable, nextPathLesson } from '@/lib/argumentation/path';
import { lessonScaffolds } from '@/content/argumentation/scaffolds';
import { lessonCoreChecks } from '@/content/argumentation/core-checks';
import { argumentSourceGuide } from '@/content/argumentation/source-guide';
import { theoryPages } from '@/lib/argumentation/theory-pages';
import { TheoryReader } from './theory-reader';
import { argumentLessonMinutes } from '@/lib/argumentation/duration';
import styles from './argumentation.module.css';
import { ArgumentCheckpointFeedback, ArgumentCheckpointReview, checkpointReviewReady } from './checkpoint-review';

function BookFoundation({ lesson }: { lesson: ArgumentLesson }) {
  const entries = argumentSourceGuide[lesson.id];
  if (!entries?.length) return null;
  return <details className="mt-8 rounded-card border border-line bg-sunken p-5"><summary className="cursor-pointer font-display text-small font-bold text-ink">Uit jouw boeken · waarop deze les is gebouwd</summary><p className="mt-3 text-small leading-relaxed text-ink-muted">De begrippen en beoordelingsregels komen uit de hieronder genoemde passages van jouw aangeleverde edities. De Nederlandse uitleg en werksituaties passen die ideeën toe op je eigen leren.</p><div className="mt-5 space-y-5">{entries.map((entry, index) => <article key={`${entry.sourceId}-${index}`} className="border-t border-line pt-4"><h3 className="font-display text-small font-bold">{entry.title}</h3><p className="mt-1 text-caption text-ink-muted">{entry.authors}</p><p className="mt-2 text-small font-semibold text-blue-ink">{entry.chapter}</p><p className="mt-1 text-caption text-ink-muted">{entry.pages}</p><ul className="mt-3 space-y-1">{entry.concepts.map((concept) => <li key={concept} className="text-small leading-relaxed text-ink-soft">• {concept}</li>)}</ul>{entry.note && <p className="mt-3 rounded-control border border-blue-line bg-blue-soft p-3 text-small leading-relaxed text-ink-soft">{entry.note}</p>}</article>)}</div></details>;
}

function Finished({ lesson, session, headingRef }: { lesson: ArgumentLesson; session: ArgumentSession; headingRef: Ref<HTMLHeadingElement> }) {
  const score = lessonScore(lesson, session.firstTry);
  const passed = lessonPassed(lesson, score);
  const record = useArgumentation((state) => state.records[lesson.id]);
  const nextIndex = argumentLessons.findIndex((item) => item.id === lesson.id) + 1;
  const next = argumentLessons[nextIndex];
  const missed = lesson.exercises.filter((exercise) => exercise.kind !== 'reflection' && (session.firstTry[exercise.id] ?? 0) < 1);
  const confidentMisses = missed.filter((exercise) => (session.firstConfidence[exercise.id] ?? -1) >= 2).length;
  const confidentAnswers = Object.values(session.firstConfidence).filter((value) => value >= 2).length;
  return <div className="space-y-7 py-6">
    <div className="text-center">
      <span className={cn('mx-auto mb-5 grid size-20 place-items-center rounded-full border-2', passed ? 'border-green-line bg-green-soft text-green-ink' : 'border-orange-line bg-orange-soft text-orange-ink')}><GraduationCap aria-hidden className="size-9" /></span>
      <p className="mb-2 text-caption font-bold tracking-wider text-blue-ink uppercase">{lesson.checkpoint ? 'Checkpoint' : 'Analyse afgerond'}</p>
      <h2 ref={headingRef} tabIndex={-1} className="font-serif text-headline outline-none">{passed ? lesson.checkpoint ? 'Checkpoint behaald.' : 'Je hebt de les doorgewerkt.' : 'Je redenering kan nog scherper.'}</h2>
      <p className="mt-3 text-body text-ink-muted">{lesson.title}</p>
      <p className="mt-5 font-display text-[3.5rem] leading-none font-extrabold text-blue-ink">{score}%</p>
      <p className="mt-2 text-small text-ink-muted">Op je eerste antwoorden bij de objectieve opdrachten.<br />Eigen analyses zijn door jou met de rubric nagekeken en tellen hier niet mee.</p>
    </div>
    {!passed && <p className="rounded-card border border-orange-line bg-orange-soft p-5 text-small text-orange-ink">De grens is 80%. Bestudeer de feedback en maak de toets opnieuw. Deze poging blijft in je voortgang staan.</p>}
    {Object.keys(session.firstConfidence).length > 0 && <div className="rounded-card border border-purple-line bg-purple-soft p-5"><h3 className="font-display font-bold text-purple-ink">Wat je zekerheid je vertelt</h3><p className="mt-2 text-small leading-relaxed text-ink-soft">{confidentMisses > 0 ? `Bij ${confidentMisses} ${confidentMisses === 1 ? 'opdracht was' : 'opdrachten was'} je redelijk of zeer zeker, terwijl je eerste analyse nog correctie nodig had. Kijk juist daar welke aanname vanzelfsprekend leek.` : confidentAnswers > 0 ? 'Je hoge zekerheid ging in deze ronde samen met correcte eerste antwoorden. Bekijk ook waar je twijfelde: welk criterium gaf uiteindelijk de doorslag?' : 'Je formuleerde deze analyses met twijfel of voorlopige zekerheid. Vergelijk je verwachting met de feedback: welke correcte gevolgtrekking kun je nu met een expliciet criterium verdedigen?'} Dit is een terugblik op deze opdrachten, geen algemene meting van je denkvermogen.</p></div>}
    {lesson.checkpoint && <ArgumentCheckpointFeedback lesson={lesson} answers={session.answers} />}
    {missed.length > 0 && <div className="rounded-card border border-line bg-sunken p-5"><h3 className="mb-3 font-display font-bold">Deze vragen verdienen nog aandacht</h3><ul className="space-y-2">{missed.map((exercise) => <li key={exercise.id} className="text-small leading-relaxed">• {exercise.prompt}</li>)}</ul></div>}
    {record && record.history.length > 0 && <details className="rounded-card border border-blue-line bg-surface p-5"><summary className="cursor-pointer font-display font-bold text-blue-ink">Jouw pogingen en geschreven analyses</summary><p className="mt-3 text-caption text-ink-muted">De laatste tien afgeronde pogingen blijven lokaal bewaard, ook wanneer je opnieuw oefent.</p><div className="mt-4 space-y-5">{record.history.map((attempt, index) => <article key={`${attempt.at}-${index}`} className="border-t border-line pt-4"><h3 className="text-small font-bold">{new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(attempt.at))} · {attempt.score}%</h3>{Object.entries(attempt.writings).map(([id, value]) => <div key={id} className="mt-3"><p className="text-caption font-bold text-ink-muted">{lesson.exercises.find((item) => item.id === id)?.prompt ?? 'Eerste analyse en herziening'}</p><p className="mt-2 whitespace-pre-line text-small leading-relaxed text-ink-soft">{value}</p></div>)}</article>)}</div></details>}
    <p className="text-center text-small text-ink-muted">{record?.reviewOn ? `Volgende herhaling: ${new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long' }).format(new Date(`${record.reviewOn}T12:00:00`))}.` : ''} Je voortgang en aantekeningen zijn in deze browser bewaard.</p>
    <div data-readaloud-ignore className="flex flex-wrap justify-center gap-3">
      <Button variant="secondary" onClick={() => useArgumentation.getState().start(lesson, true)}><RotateCcw aria-hidden className="size-4" />{passed ? 'Nogmaals oefenen' : 'Toets opnieuw maken'}</Button>
      {passed && next ? <ButtonLink href={argumentLessonHref(next.id)}>Volgende les<ArrowRight aria-hidden className="size-4" /></ButtonLink> : <ButtonLink href="/argumentatie">Naar het leerpad<ArrowRight aria-hidden className="size-4" /></ButtonLink>}
    </div>
  </div>;
}

export function ArgumentLessonPlayer({ lesson }: { lesson: ArgumentLesson }) {
  const hydrated = useHydrated();
  const session = useArgumentation((state) => state.sessions[lesson.id]);
  const records = useArgumentation((state) => state.records);
  const available = lessonAvailable(lesson.id, argumentLessons, records);
  const calm = useCalmMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const exerciseHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const readerScope = useRef<HTMLElement>(null);
  const currentModule = argumentModuleById.get(lesson.moduleId);
  useEffect(() => { if (hydrated && available) useArgumentation.getState().start(lesson); }, [hydrated, available, lesson]);
  const cursor = session?.cursor ?? 0;
  const loaded = Boolean(session);
  const finished = session?.finished;
  useEffect(() => {
    if (!loaded) return;
    const target = finished && cursor !== 0 ? resultHeadingRef : cursor > 0 ? exerciseHeadingRef : headingRef;
    target.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [cursor, finished, loaded]);

  if (!hydrated) return <div className="mx-auto max-w-3xl p-8"><p className="text-ink-muted" role="status">Je les wordt geladen…</p></div>;
  if (!available) {
    const prerequisite = nextPathLesson(argumentLessons, records)!;
    return <main ref={readerScope} data-accent="blue" className="mx-auto max-w-2xl px-gutter py-16"><p className="mb-3 text-caption font-bold text-blue-ink">JOUW VOLGENDE STAP</p><h1 className="font-serif text-headline">Bouw eerst de voorgaande stap op.</h1><p className="mt-4 text-body leading-relaxed text-ink-muted">‘{lesson.title}’ bouwt voort op wat je eerder leert. Begin bij ‘{prerequisite.title}’. Daarna komen de volgende lessen vanzelf beschikbaar.</p><div className="mt-5"><LessonReader scopeRef={readerScope} contentKey={`argument:${lesson.id}:locked`} /></div><div data-readaloud-ignore className="mt-7 flex flex-wrap gap-3"><ButtonLink href={argumentLessonHref(prerequisite.id)}>Naar jouw volgende les<ArrowRight aria-hidden className="size-4" /></ButtonLink><ButtonLink href="/argumentatie" variant="secondary">Bekijk het leerpad</ButtonLink></div></main>;
  }
  if (!session) return <div className="mx-auto max-w-3xl p-8"><p className="text-ink-muted" role="status">Je les wordt geladen…</p></div>;

  const exercise = lesson.exercises[cursor - 1];
  const answer = exercise ? session.answers[exercise.id] ?? emptyArgumentAnswer() : emptyArgumentAnswer();
  const reflectionDone = exercise?.kind === 'reflection' && exercise.rubric.every((_, index) => answer.rubric[String(index)]);
  const mayAdvance = answer.checked && (exercise?.kind === 'reflection' ? lesson.checkpoint || reflectionDone : lesson.checkpoint || answer.score === 1);
  const reviewing = Boolean(lesson.checkpoint && !session.finished && cursor > lesson.exercises.length);
  const hasCheckpointWriting = Boolean(lesson.checkpoint && lesson.exercises.some((item) => item.kind === 'reflection'));
  const checkpointReady = checkpointReviewReady(lesson, session.answers);
  const readingPages = theoryPages(lesson);
  const readingIndex = Math.min(session.theoryPage ?? 0, readingPages.length - 1);
  const readingPage = readingPages[readingIndex]!;
  const total = lesson.exercises.length + (lesson.checkpoint ? 1 : readingPages.length);
  const scaffold = lessonScaffolds[lesson.id];
  const ready = lesson.checkpoint || !scaffold || session.finished || session.answers[`warmup-${lesson.id}`]?.value === scaffold.answer;
  const inquiryDone = !argumentInquiries[lesson.id] || session.finished || session.answers[`inquiry-${lesson.id}`]?.checked;
  const coreCheck = lessonCoreChecks[lesson.id];
  const coreDone = !coreCheck || session.finished || session.answers[`core-${lesson.id}`]?.value === coreCheck.answer;
  const foundationDone = readingPage.kind !== 'concept' || session.finished || session.answers[`foundation-${readingPage.foundation.id}`]?.value === readingPage.foundation.answer;
  const mayReadForward = lesson.checkpoint || (readingPage.kind === 'concept' ? foundationDone : ready && (readingPage.kind !== 'inquiry' || inquiryDone) && (readingPage.kind !== 'section' || readingPage.sectionIndex !== 1 || coreDone));
  const readingDone = (lesson.checkpoint && !session.finished) || readingIndex === readingPages.length - 1;
  const canResume = session.finished || session.resumeCursor > 1 || Object.keys(session.firstTry).length > 0;
  const resumeLabel = session.finished ? 'Terug naar je resultaat' : `Terug naar opdracht ${session.resumeCursor}`;
  const hasWriting = lesson.exercises.some((item) => item.kind === 'reflection');
  const phases = hasWriting ? ['Eén onderdeel herkennen', 'Beoordelen met steun', 'Zelf reconstrueren', 'Zelf onderbouwen'] : ['Eén onderdeel herkennen', 'Redenen beoordelen', 'Zelf onderdelen plaatsen'];
  const phase = cursor === 0 ? 0 : exercise?.kind === 'reflection' ? 3 : exercise?.kind === 'sort' || exercise?.kind === 'map' ? 2 : 1;
  const advance = () => {
    if (cursor === lesson.exercises.length && !hasCheckpointWriting) useArgumentation.getState().finish(lesson);
    else useArgumentation.getState().move(lesson.id, cursor + 1);
  };
  const selectedFeedback = exercise?.kind === 'choice' ? exercise.options.find((option) => option.id === answer.value)?.feedback : null;
  const readingAnswerId = readingPage.kind === 'concept' ? `foundation-${readingPage.foundation.id}` : readingPage.kind === 'start' ? `warmup-${lesson.id}` : readingPage.kind === 'inquiry' ? `inquiry-${lesson.id}` : readingPage.kind === 'section' ? `core-${lesson.id}` : '';
  const readingAnswer = session.answers[readingAnswerId];
  const readerKey = `argument:${lesson.id}:${cursor}:${cursor === 0 ? readingPage.id : exercise?.id ?? 'review'}:${session.finished ? 'finished' : reviewing ? 'review' : answer.checked ? `feedback-${answer.score ?? 'reflection'}` : 'prompt'}:${cursor === 0 && readingAnswer?.checked ? `compared-${readingAnswer.score ?? 'reflection'}` : 'reading'}`;

  return <div data-accent="blue" className={cn(styles.root, styles.player, 'min-h-dvh')}>
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-5xl items-center gap-4 px-gutter py-3">
        <Link href="/argumentatie" className="flex min-h-11 shrink-0 items-center gap-2 rounded-control px-2 text-small font-bold text-ink-muted hover:bg-surface"><ArrowLeft aria-hidden className="size-5" /><span className="max-sm:sr-only">Leerpad</span></Link>
        <div className="min-w-0 flex-1"><p className="mb-1.5 truncate text-caption font-bold text-blue-ink">{cursor === 0 ? lesson.checkpoint ? 'Checkpoint · zelfstandige toetsronde' : `Leespagina ${readingIndex + 1} van ${readingPages.length} · ${readingPage.title}` : session.finished ? 'Afgerond' : reviewing ? 'Zelfcontrole en herziening' : `${currentModule?.subtitle} · Opdracht ${cursor} van ${lesson.exercises.length}`}</p><ProgressBar value={session.finished ? total : cursor === 0 ? lesson.checkpoint ? 0 : readingIndex : lesson.checkpoint ? cursor : readingPages.length + cursor - 1} max={total} label="Voortgang van deze les" size="sm" /></div>
        <span className="shrink-0 text-caption whitespace-nowrap text-ink-muted">≈ {argumentLessonMinutes(lesson)} min</span>
      </div>
    </header>
    <div className={styles.learningLayout}>

    <main ref={readerScope} className={styles.learningMain}>
      <div className="mb-8">
        {(cursor !== 0 || readingIndex === 0) && <p className="mb-3 text-caption font-bold tracking-wider text-blue-ink uppercase">Argumentatie & drogredenen · {currentModule?.title}</p>}
        <h1 ref={headingRef} tabIndex={-1} className={cn('outline-none', cursor === 0 && readingIndex > 0 ? 'font-display text-small font-semibold text-ink-muted' : 'font-display text-[clamp(1.8rem,1.4rem+1.4vw,2.7rem)] font-extrabold leading-tight tracking-tight')}>{lesson.title}</h1>
        {!session.finished && cursor === 0 && readingIndex === 0 && <p className="mt-3 text-lead leading-relaxed text-ink-muted">{lesson.teaser}</p>}
      </div>
      <div className="mb-6"><LessonReader scopeRef={readerScope} contentKey={readerKey} /></div>
      {!lesson.checkpoint && !session.finished && (cursor > 0 || readingIndex === 0) && <ol data-readaloud-ignore aria-label="Steeds meer verantwoordelijkheid in deze les" className="mb-7 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">{phases.map((label, index) => <li key={label} className={cn('flex items-center gap-2 rounded-control border-2 px-3 py-2 text-caption', phase === index ? 'border-blue-line bg-blue-soft font-bold text-blue-ink shadow-slab-sm' : phase > index ? 'border-green-line bg-green-soft text-green-ink' : 'border-line bg-surface text-ink-muted')} aria-current={phase === index ? 'step' : undefined}>{index + 1}. {label}</li>)}</ol>}
      {session.finished && cursor !== 0 ? <Finished lesson={lesson} session={session} headingRef={resultHeadingRef} /> : reviewing ? <><ArgumentCheckpointReview lesson={lesson} answers={session.answers} onChange={(id, patch) => useArgumentation.getState().answer(lesson.id, id, patch)} /><div data-readaloud-ignore className="mt-7"><Button disabled={!checkpointReady} onClick={() => useArgumentation.getState().finish(lesson)}>Zelfcontrole afronden<Check aria-hidden className="size-4" /></Button></div></> : <>
        {cursor === 0 && !lesson.checkpoint && <div className="mb-5 flex items-center justify-between gap-4"><span className="inline-flex items-center gap-2 rounded-chip border border-blue-line bg-blue-soft px-3 py-1.5 text-caption font-bold text-blue-ink"><BookOpen aria-hidden className="size-3.5" />Eén kern tegelijk</span><div aria-hidden="true" className="flex gap-1.5">{readingPages.map((page, index) => <span key={page.id} className={cn('h-1.5 rounded-full transition-all calm:transition-none', index === readingIndex ? 'w-6 bg-blue-ink' : index < readingIndex ? 'w-1.5 bg-blue' : 'w-1.5 bg-line-strong')} />)}</div></div>}
        <motion.div className={styles.learningCard} key={cursor === 0 ? `reading-${readingPage.id}` : cursor} initial={calm ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: calm ? 0 : 0.18 }}>
          {cursor === 0 && lesson.checkpoint && !session.finished ? <section><h2 className="font-display text-title font-bold">Laat zien wat je zelf kunt toepassen</h2><p className="mt-4 text-body leading-relaxed">Maak de nieuwe gevallen zonder tussentijdse oplossingshulp. Elk ingeleverd antwoord blijft vastgelegd; uitleg over de juiste keuzes verschijnt nadat de ronde is afgerond.</p><p className="mt-3 text-small text-ink-muted">{hasCheckpointWriting ? 'Schrijf ook beide eigen analyses voordat de modellen verschijnen. Daarna vergelijk en herzie je je teksten met de rubric.' : 'Na afloop kun je alle feedback teruglezen en gericht opnieuw oefenen.'} Dit is een oefencheck op deze opdrachten, geen bewijs van algemene deskundigheid.</p></section> : cursor === 0 ? <TheoryReader lesson={lesson} session={session} pageIndex={readingIndex} onPageChange={(index) => useArgumentation.getState().setTheoryPage(lesson.id, index)} /> : exercise ? <ArgumentExerciseView headingRef={exerciseHeadingRef} exercise={exercise} answer={answer} onChange={(patch) => useArgumentation.getState().answer(lesson.id, exercise.id, patch)} showFeedback={!lesson.checkpoint} /> : null}
        </motion.div>
        {cursor === 0 && readingDone && !lesson.checkpoint && <BookFoundation lesson={lesson} />}
        {exercise && answer.checked && lesson.checkpoint && <p role="status" className="mt-6 rounded-control border border-blue-line bg-blue-soft p-4 text-small text-blue-ink">Je antwoord is vastgelegd. Ga door; de feedback volgt na de volledige ronde.</p>}
        {exercise && answer.checked && !lesson.checkpoint && exercise.kind !== 'reflection' && <div role="status" className={cn('mt-7 rounded-card border-2 p-5 sm:p-6', answer.score === 1 ? 'border-green-line bg-green-soft' : 'border-orange-line bg-orange-soft')}>
          <h3 className={cn('flex items-center gap-2 font-display font-bold', answer.score === 1 ? 'text-green-ink' : 'text-orange-ink')}>{answer.score === 1 ? <CheckCircle2 aria-hidden className="size-5" /> : <Lightbulb aria-hidden className="size-5" />}{answer.score === 1 ? 'Goed onderbouwd.' : 'Beoordeel deze stap opnieuw.'}</h3>
          {selectedFeedback && <p className="mt-3 text-body leading-relaxed text-ink-soft">{selectedFeedback}</p>}
          <p className="mt-3 whitespace-pre-line text-body leading-relaxed text-ink-soft">{exercise.explanation}</p>
          {answer.score !== 1 && (answer.confidence ?? -1) >= 2 && <p className="mt-4 border-t border-orange-line pt-3 text-small leading-relaxed text-orange-ink">Je verwachtte dat je analyse klopte. Benoem vóór je nieuwe poging welke veronderstelling of verbinding de feedback bevraagt.</p>}
          {answer.score === 1 && (answer.confidence ?? 3) <= 1 && <p className="mt-4 border-t border-green-line pt-3 text-small leading-relaxed text-green-ink">Je analyse klopt, ook al twijfelde je. Benoem het criterium uit de uitleg dat de doorslag geeft en waarom de sterkste andere interpretatie afvalt.</p>}
        </div>}
        <div data-readaloud-ignore className={styles.actionDock} data-ready={cursor === 0 ? (readingDone ? ready : mayReadForward) : mayAdvance}>
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
          <p className={styles.dockHint} data-ready={cursor === 0 ? (readingDone ? ready : mayReadForward) : mayAdvance} aria-live="polite">{(cursor === 0 ? (readingDone ? ready : mayReadForward) : mayAdvance) ? <><CheckCircle2 aria-hidden className="size-4 shrink-0" />Klaar voor de volgende stap</> : <><Lightbulb aria-hidden className="size-4 shrink-0" />{cursor === 0 ? 'Beantwoord de vraag om verder te gaan' : 'Neem je tijd. Elke reden telt.'}</>}</p>
          {cursor > 0 && !lesson.checkpoint ? <Button variant="ghost" onClick={() => useArgumentation.getState().openTheory(lesson.id)}><BookOpen aria-hidden className="size-4" />Terug naar theorie</Button> : !lesson.checkpoint ? <Button aria-label="Vorige pagina" variant="secondary" disabled={readingIndex === 0} onClick={() => useArgumentation.getState().setTheoryPage(lesson.id, readingIndex - 1)}><ArrowLeft aria-hidden className="size-4" />Vorige</Button> : null}
          {cursor === 0 ? <div className="flex flex-wrap items-center gap-3"><span className="text-caption text-ink-muted max-sm:hidden">Pagina {readingIndex + 1} van {readingPages.length}</span>{readingDone ? <Button variant="accent" disabled={!ready} onClick={() => useArgumentation.getState().resume(lesson.id)}>{canResume ? resumeLabel : lesson.checkpoint ? 'Start de toetsronde' : 'Naar de opdrachten'}<ArrowRight aria-hidden className="size-4" /></Button> : <Button variant="accent" disabled={!mayReadForward} onClick={() => useArgumentation.getState().setTheoryPage(lesson.id, readingIndex + 1)}>Volgende pagina<ArrowRight aria-hidden className="size-4" /></Button>}</div> : exercise && !answer.checked ? <Button disabled={!answerReady(exercise, answer) || (exercise.kind !== 'reflection' && answer.confidence === null)} onClick={() => useArgumentation.getState().check(lesson.id, exercise.id, gradeArgument(exercise, answer))}>{lesson.checkpoint ? 'Leg je antwoord vast' : exercise.kind === 'reflection' ? 'Vergelijk met het model' : 'Controleer je analyse'}<Check aria-hidden className="size-4" /></Button> : <div className="flex flex-wrap gap-3">
            {!lesson.checkpoint && (!mayAdvance || exercise?.kind === 'reflection') && <Button variant="secondary" onClick={() => exercise && useArgumentation.getState().answer(lesson.id, exercise.id, { checked: false, score: null, rubric: {} })}>{exercise?.kind === 'reflection' ? 'Herzien' : 'Probeer opnieuw'}<RotateCcw aria-hidden className="size-4" /></Button>}
            <Button disabled={!mayAdvance} onClick={advance}>{cursor === lesson.exercises.length ? lesson.checkpoint ? hasCheckpointWriting ? 'Naar zelfcontrole' : 'Toetsronde afronden' : 'Les afronden' : 'Volgende opdracht'}<ArrowRight aria-hidden className="size-4" /></Button>
          </div>}
        </div>
        </div>
        {cursor === 0 && !readingDone && canResume && <Button data-readaloud-ignore variant="ghost" className="mt-4" onClick={() => useArgumentation.getState().resume(lesson.id)}>{resumeLabel}<ArrowRight aria-hidden className="size-4" /></Button>}
        {cursor === 0 && !mayReadForward && <p className="mt-4 text-small text-ink-muted">{readingPage.kind === 'concept' ? 'Oefen dit begrip met het nieuwe geval. Gebruik de feedback voordat je de volgende stap zet.' : readingPage.kind === 'inquiry' ? 'Leg eerst je eigen analyse vast en vergelijk die met de uitwerking.' : readingPage.kind === 'section' ? 'Gebruik de feedback om deze denkstap te beoordelen voordat je verdergaat.' : 'Beantwoord eerst de startvraag om naar het volgende kernidee te gaan.'}</p>}
        {!lesson.checkpoint && exercise?.kind === 'reflection' && answer.checked && !reflectionDone && <p className="mt-4 text-small text-ink-muted">Herzie je analyse totdat je alle rubriccriteria kunt onderbouwen; vink ze daarna aan om verder te gaan.</p>}
        {exercise && exercise.kind !== 'reflection' && !answer.checked && answerReady(exercise, answer) && answer.confidence === null && <p className="mt-4 text-small text-purple-ink">Leg ook je zekerheid vast voordat je de analyse controleert.</p>}
        {cursor > 0 && !lesson.checkpoint && <BookFoundation lesson={lesson} />}
      </>}
      {(!lesson.checkpoint || session.finished) && <details data-readaloud-ignore className="mt-10 rounded-control border border-line bg-sunken p-4">
        <summary className="flex cursor-pointer items-center gap-2 text-caption font-semibold text-ink-muted"><ChevronDown aria-hidden className="size-3" />Lesoverzicht</summary>
        <ol className="mt-3 space-y-2"><li><button onClick={() => useArgumentation.getState().openTheory(lesson.id)} className="min-h-9 text-left text-small text-blue-ink underline underline-offset-4">Verder lezen waar je was</button></li>{readingPages.map((page, index) => <li key={page.id}><button disabled={!canResume && index > readingIndex} onClick={() => { useArgumentation.getState().setTheoryPage(lesson.id, index); useArgumentation.getState().openTheory(lesson.id); }} className="min-h-9 text-left text-small text-blue-ink underline underline-offset-4 disabled:text-ink-muted disabled:no-underline">Leespagina {index + 1} · {page.title}</button></li>)}{lesson.exercises.map((item, index) => <li key={item.id} className="flex items-start gap-2 text-small text-ink-muted">{session.answers[item.id]?.checked ? <Check aria-hidden className="mt-1 size-4 shrink-0" /> : <span className="mt-1 size-4 shrink-0 text-caption">{index + 1}</span>}{item.prompt}</li>)}</ol>
      </details>}
      <Link data-readaloud-ignore href="/argumentatie" className="mt-8 inline-flex min-h-11 items-center gap-2 text-small font-bold text-ink-muted"><X aria-hidden className="size-4" />Bewaren en terug naar het leerpad</Link>
    </main>
    </div>
  </div>;
}
