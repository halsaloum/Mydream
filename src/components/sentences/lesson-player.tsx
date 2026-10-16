'use client';

import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, Lightbulb, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { sentenceLessons } from '@/content/sentences';
import { sentenceTeachingById } from '@/content/sentences/teaching';
import type { SentenceLesson } from '@/content/sentences/types';
import { Button, ButtonLink } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress';
import { PageSkeleton } from '@/components/ui/empty-state';
import { LessonReader } from '@/components/reading/lesson-reader';
import { cn } from '@/lib/cn';
import { answerReady, emptySentenceAnswer, lessonAccuracy, lessonProgress, lessonSolved } from '@/lib/sentences/learning';
import { sentenceLessonHref } from '@/lib/sentences/routes';
import { useHydrated } from '@/state/hydration';
import { useSentences, type SentenceTab } from '@/state/sentences';
import { DiscoveryLab } from './discovery-lab';
import { SentenceExerciseView } from './exercise-view';
import { RulesView, SentenceRuleCard } from './rules-view';
import { SentenceApplication, TeachingView } from './teaching-view';

const TABS: { id: SentenceTab; title: string }[] = [
  { id: 'ontdek', title: 'Ontdekken' },
  { id: 'wetten', title: 'Uitleg' },
  { id: 'arena', title: 'Oefenen' },
  { id: 'debugger', title: 'Herstellen' },
  { id: 'codex', title: 'Samenvatting' },
];

function LessonNavigation({ lesson }: { lesson: SentenceLesson }) {
  const records = useSentences((state) => state.records);
  const sessions = useSentences((state) => state.sessions);
  return <nav data-readaloud-ignore aria-label="Lessen over zinnen" className="hidden max-h-[calc(100dvh-7rem)] self-start overflow-y-auto rounded-card border border-line bg-white p-4 xl:sticky xl:top-24 xl:block">
    <p className="mb-3 font-display font-bold text-blue-ink">De zin, van begin tot eind</p>
    <ol className="space-y-1">{sentenceLessons.map((item) => {
      const solved = records[item.id] ? 10 : lessonProgress(item, sessions[item.id]?.answers ?? {}).solved;
      return <li key={item.id}><Link href={sentenceLessonHref(item.id)} aria-current={item.id === lesson.id ? 'page' : undefined} className={cn('flex min-h-11 items-start gap-2 rounded-control px-2 py-2 text-small leading-snug', item.id === lesson.id ? 'bg-blue-soft font-bold text-blue-ink' : 'text-ink-soft hover:bg-sunken')}><span className="grid size-6 shrink-0 place-items-center rounded-md bg-sunken text-caption font-bold">{records[item.id] ? <Check aria-label="Afgerond" className="size-4 text-green-ink" /> : item.number}</span><span className="min-w-0 flex-1"><span className="block">{item.title}</span><span aria-hidden className="mt-2 block h-1.5 overflow-hidden rounded-full bg-line"><span className="block h-full rounded-full bg-blue-ink" style={{ width: `${solved * 10}%` }} /></span><span className="sr-only">{solved} van 10 opdrachten opgelost</span></span></Link></li>;
    })}</ol>
    <ButtonLink href="/zinnen/codex" variant="secondary" size="sm" className="mt-4 w-full"><BookOpen aria-hidden className="size-4" />Mijn samenvattingen</ButtonLink>
  </nav>;
}

export function SentenceLessonPlayer({ lesson }: { lesson: SentenceLesson }) {
  const hydrated = useHydrated();
  const session = useSentences((state) => state.sessions[lesson.id]);
  const record = useSentences((state) => state.records[lesson.id]);
  const heading = useRef<HTMLHeadingElement>(null);
  const readerScope = useRef<HTMLElement>(null);
  useEffect(() => { if (hydrated) useSentences.getState().start(lesson); }, [hydrated, lesson]);
  const tab = session?.tab ?? 'ontdek';
  const arenaIndex = session?.arenaIndex ?? 0;
  const debuggerIndex = session?.debuggerIndex ?? 0;
  const loaded = Boolean(session);
  useEffect(() => {
    if (!loaded) return;
    if (document.activeElement?.getAttribute('role') === 'tab') return;
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [loaded, tab, arenaIndex, debuggerIndex]);
  if (!hydrated || !session) return <main className="mx-auto max-w-3xl px-gutter py-10"><p role="status" className="mb-5 text-ink-muted">Je zinles wordt geladen…</p><PageSkeleton blocks={['h-14', 'h-24', 'h-64']} /></main>;

  const progress = lessonProgress(lesson, session.answers);
  const phase = tab === 'arena' ? 'arena' : 'debugger';
  const exercises = tab === 'arena' ? lesson.arena : lesson.debugger;
  const index = tab === 'arena' ? session.arenaIndex : session.debuggerIndex;
  const exercise = exercises[index];
  const answer = exercise ? session.answers[exercise.id] ?? emptySentenceAnswer() : emptySentenceAnswer();
  const solved = lessonSolved(lesson, session.answers);
  const switchTab = (next: SentenceTab) => useSentences.getState().setTab(lesson.id, next);
  const nextExercise = () => {
    if (index < exercises.length - 1) useSentences.getState().setExerciseIndex(lesson.id, phase, index + 1);
    else switchTab(tab === 'arena' ? 'debugger' : 'codex');
  };
  const resumeUnsolved = () => {
    const arena = lesson.arena.findIndex((item) => !session.answers[item.id]?.correct);
    const debuggerTask = lesson.debugger.findIndex((item) => !session.answers[item.id]?.correct);
    if (arena >= 0) { useSentences.getState().setExerciseIndex(lesson.id, 'arena', arena); switchTab('arena'); }
    else if (debuggerTask >= 0) { useSentences.getState().setExerciseIndex(lesson.id, 'debugger', debuggerTask); switchTab('debugger'); }
  };
  const nextLesson = sentenceLessons.find((item) => item.number === lesson.number + 1);
  const teaching = sentenceTeachingById.get(lesson.id);
  const readerKey = `sentence:${lesson.id}:${tab}:${tab === 'arena' || tab === 'debugger' ? exercise?.id ?? index : 'reading'}:${session.finished ? 'finished' : answer.checked ? answer.correct ? 'correct' : 'feedback' : 'prompt'}:${answer.diagnosisPassed ? 'diagnosed' : 'diagnose'}:${answer.segmentationPassed ? 'segmented' : 'segment'}`;

  return <div data-accent="navy" className="min-h-dvh bg-canvas">
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur-lg"><div className="mx-auto flex min-h-16 max-w-6xl items-center gap-3 px-gutter py-3"><Link href="/?niveau=zinnen#niveaus-titel" className="grid size-11 shrink-0 place-items-center rounded-control text-ink-soft hover:bg-sunken" aria-label="Bewaren en terug naar alle zinslessen"><ArrowLeft aria-hidden className="size-5" /></Link><div className="min-w-0 flex-1"><p className="truncate text-caption font-bold text-blue-ink">Zinnen · Les {lesson.number} van 12</p><ProgressBar value={progress.solved} max={10} size="sm" label="Opgeloste opdrachten in deze les" /></div><span className="text-caption font-semibold text-ink-muted">{progress.solved}/10</span></div></header>
    <div className="mx-auto grid max-w-6xl gap-7 px-gutter py-7 xl:grid-cols-[17rem_minmax(0,1fr)]">
      <LessonNavigation lesson={lesson} />
      <main ref={readerScope} className="min-w-0">
        <p className="text-caption font-bold tracking-wider text-blue-ink uppercase">Van woordgroep tot samengestelde zin</p>
        <h1 ref={heading} tabIndex={-1} className="mt-3 font-display text-[clamp(1.8rem,1.4rem+1.4vw,2.7rem)] leading-tight font-extrabold outline-none">{lesson.title}</h1>
        <p className="mt-4 text-lead leading-relaxed text-ink-soft">{lesson.teaser}</p>
        <div className="mt-5"><LessonReader scopeRef={readerScope} contentKey={readerKey} /></div>
        <div role="tablist" aria-label="De vijf onderdelen van deze les" className="my-6 flex gap-2 overflow-x-auto pb-2">{TABS.map((item, position) => <button key={item.id} type="button" role="tab" id={`tab-${item.id}`} aria-controls={`paneel-${item.id}`} aria-selected={tab === item.id} tabIndex={tab === item.id ? 0 : -1} onClick={() => switchTab(item.id)} onKeyDown={(event) => {
          const current = TABS.findIndex((item) => item.id === tab);
          const target = event.key === 'ArrowRight' ? (current + 1) % 5 : event.key === 'ArrowLeft' ? (current + 4) % 5 : event.key === 'Home' ? 0 : event.key === 'End' ? 4 : null;
          if (target !== null) { event.preventDefault(); switchTab(TABS[target]!.id); document.getElementById(`tab-${TABS[target]!.id}`)?.focus(); }
        }} className={cn('min-h-16 min-w-[6.5rem] flex-1 rounded-control border-2 px-3 py-2 text-center font-display text-caption leading-snug font-bold', tab === item.id ? 'border-blue-line bg-blue-soft text-blue-ink shadow-slab-sm' : 'border-line bg-white text-ink-muted hover:border-blue-line')}><span aria-hidden className="block text-[.65rem] text-ink-muted">{position + 1}</span>{item.title}</button>)}</div>
        <section role="tabpanel" id={`paneel-${tab}`} aria-labelledby={`tab-${tab}`} tabIndex={0} className="rounded-sheet border-2 border-line bg-white p-4 sm:p-7">
          {tab === 'ontdek' && <><DiscoveryLab lesson={lesson} visited={session.visitedVariants} onVisit={(id) => useSentences.getState().visitVariant(lesson.id, id)} /><section className="mt-7 border-t border-line pt-5"><h2 className="font-display text-title-sm font-bold">Na deze les kun je</h2><ul className="mt-3 space-y-2">{lesson.objectives.map((objective) => <li key={objective} className="flex gap-2 text-body leading-relaxed text-ink-soft"><Check aria-hidden className="mt-1 size-4 shrink-0 text-blue-ink" />{objective}</li>)}</ul><Button onClick={() => switchTab('wetten')} className="mt-5">Lees de uitleg stap voor stap<ArrowRight aria-hidden className="size-4" /></Button></section></>}
          {tab === 'wetten' && <>
            {teaching && <TeachingView key={lesson.id} teaching={teaching} text={session.transferText} onChange={(text) => useSentences.getState().setTransfer(lesson.id, text)} />}
            <details className="mt-7 rounded-card border border-line bg-sunken p-4 sm:p-5"><summary className="min-h-11 cursor-pointer font-display font-bold text-blue-ink">De regels en aanpak bij elkaar</summary><div className="mt-5"><RulesView key={lesson.id} lesson={lesson} /></div></details>
            <Button onClick={() => switchTab('arena')} className="mt-6">Verder met oefenen<ArrowRight aria-hidden className="size-4" /></Button>
          </>}
          {(tab === 'arena' || tab === 'debugger') && exercise && <>
            <div className="mb-5"><h2 className="font-display text-title-sm font-extrabold">{tab === 'arena' ? 'Oefenen met hulp' : 'Zelf zinnen herstellen'}</h2><p className="mt-2 text-small leading-relaxed text-ink-soft">{tab === 'arena' ? index < 3 ? 'Je begint met hulp. Bekijk welke woorden bij elkaar horen en pas de uitleg toe in de zin.' : 'Nu maak je zelf de woordgroepen. Daarna pas je de regel toe.' : 'Zoek eerst wat er misgaat in de zin. Schrijf daarna de verbetering die de opdracht vraagt.'}</p></div>
            <nav data-readaloud-ignore aria-label={tab === 'arena' ? 'Bouwopdrachten' : 'Reparatieopdrachten'} className="mb-6 flex flex-wrap gap-2">{exercises.map((item, itemIndex) => <Button key={item.id} size="sm" variant={itemIndex === index ? 'accent' : 'secondary'} aria-current={itemIndex === index ? 'step' : undefined} aria-label={`Opdracht ${itemIndex + 1}${session.answers[item.id]?.correct ? ', opgelost' : ''}`} onClick={() => useSentences.getState().setExerciseIndex(lesson.id, phase, itemIndex)} className="min-w-11 px-3">{session.answers[item.id]?.correct ? <Check aria-hidden className="size-4" /> : itemIndex + 1}</Button>)}</nav>
            <SentenceExerciseView key={exercise.id} exercise={exercise} answer={answer} disabled={session.finished || (answer.checked && answer.correct)} onChange={(patch) => useSentences.getState().answer(lesson.id, exercise.id, patch)} onDiagnose={() => useSentences.getState().diagnose(lesson, exercise)} onSegment={() => useSentences.getState().segment(lesson, exercise)} />
            {answer.checked && <div role="status" className={cn('mt-6 rounded-card border-2 p-5', answer.correct ? 'border-green-line bg-green-soft' : 'border-orange-line bg-orange-soft')}><h3 className={cn('flex gap-2 font-display font-bold', answer.correct ? 'text-green-ink' : 'text-orange-ink')}>{answer.correct ? <CheckCircle2 aria-hidden className="size-5 shrink-0" /> : <Lightbulb aria-hidden className="size-5 shrink-0" />}{answer.correct ? 'Deze toepassing klopt.' : 'Onderzoek je toepassing opnieuw.'}</h3><p className="mt-3 text-body leading-relaxed text-ink-soft">{exercise.explanation}</p>{!answer.correct && exercise.kind === 'debug' && <details className="mt-4 rounded-control border border-orange-line bg-white p-3"><summary className="min-h-8 cursor-pointer font-semibold text-orange-ink">Vergelijk met een passende reparatie</summary><p className="mt-3 font-serif text-lead leading-relaxed">{exercise.repairs[0]}</p><p className="mt-2 text-small text-ink-muted">Pas de regel toe in je eigen antwoord. Deze oefening controleert de afgebakende reparatie; andere formuleringen oefen je bij de eigen schrijfopdracht in de samenvatting.</p></details>}</div>}
            <div data-readaloud-ignore className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5"><p className="text-caption text-ink-muted">Opdracht {index + 1} van {exercises.length} · voortgang wordt bewaard</p>{answer.checked && answer.correct ? <Button onClick={nextExercise}>{index === exercises.length - 1 ? tab === 'arena' ? 'Naar zelfstandig repareren' : 'Naar de samenvatting' : 'Volgende opdracht'}<ArrowRight aria-hidden className="size-4" /></Button> : <Button disabled={!answerReady(exercise, answer) || answer.checked || session.finished} onClick={() => useSentences.getState().check(lesson, exercise)}>Controleer mijn toepassing<Check aria-hidden className="size-4" /></Button>}</div>
          </>}
          {tab === 'codex' && <section>
            <p className="text-caption font-bold text-blue-ink">Dit wil je onthouden</p>
            <h2 className="mt-3 font-display text-title font-extrabold">{lesson.summary.title}</h2>
            <ul className="mt-4 space-y-3 rounded-card border border-blue-line bg-blue-soft p-5">{lesson.summary.points.map((point) => <li key={point} className="flex gap-2 text-body leading-relaxed text-blue-ink"><span aria-hidden>•</span><span>{point}</span></li>)}</ul>
            <p className="mt-4 text-small leading-relaxed text-ink-muted">Je kunt deze samenvatting altijd lezen. Gebruik haar bij het oefenen en leg daarna in je eigen woorden uit waarom jouw zin klopt.</p>
            <details className="mt-5 rounded-card border border-line bg-sunken p-4"><summary className="min-h-11 cursor-pointer font-display font-bold">Lees de regels en hun uitzonderingen terug</summary><div className="mt-4 space-y-3">{lesson.rules.map((rule) => <SentenceRuleCard key={rule.id} rule={rule} />)}</div></details>
            <div className="mt-6">
              {teaching ? <SentenceApplication key={lesson.id} teaching={teaching} text={session.transferText} onChange={(text) => useSentences.getState().setTransfer(lesson.id, text)} label="Pas dit toe in je eigen tekst" /> : <section className="rounded-card border-2 border-purple-line bg-purple-soft p-5"><label htmlFor="eigen-toepassing" className="font-display text-title-sm font-bold text-purple-ink">Pas dit toe in je eigen tekst</label><p className="mt-3 text-body leading-relaxed text-ink-soft">{lesson.summary.transfer}</p><textarea id="eigen-toepassing" value={session.transferText} onChange={(event) => useSentences.getState().setTransfer(lesson.id, event.target.value)} maxLength={3000} rows={5} className="mt-4 w-full rounded-control border-2 border-line bg-white p-3 text-body leading-relaxed" /><p className="mt-2 text-caption text-ink-muted">Je tekst wordt op dit apparaat bewaard. Controleer zelf je toepassing; je krijgt geen automatisch inhoudelijk cijfer.</p></section>}
            </div>
            <section aria-label="Voortgang en afronding" className={cn('mt-7 rounded-card border-2 p-5', session.finished ? 'border-green-line bg-green-soft' : 'border-line bg-sunken')}>
              {session.finished ? <>
                <p className="flex items-center gap-2 font-display font-bold text-green-ink"><CheckCircle2 aria-hidden className="size-5" />Module afgerond · samenvatting bewaard</p>
                <p className="mt-3 text-small leading-relaxed text-ink-soft">{record?.lastAccuracy ?? lessonAccuracy(lesson, session.firstTry)}% van je eerste gecontroleerde toepassingen klopte. Je hebt alle tien opdrachten daarna opgelost. Dit beschrijft deze oefenronde. Zelfstandig toepassen en later herhalen helpen je verder.</p>
                <div data-readaloud-ignore className="mt-5 flex flex-wrap gap-3">{nextLesson && <ButtonLink href={sentenceLessonHref(nextLesson.id)}>Naar les {nextLesson.number}<ArrowRight aria-hidden className="size-4" /></ButtonLink>}<ButtonLink href="/zinnen/codex" variant="secondary"><BookOpen aria-hidden className="size-4" />Mijn samenvattingen</ButtonLink><Button variant="ghost" onClick={() => useSentences.getState().restart(lesson)}><RotateCcw aria-hidden className="size-4" />Nieuwe oefenronde</Button></div>
              </> : <>
                <h3 className="font-display text-title-sm font-bold">Jouw oefenvoortgang</h3>
                <p className="mt-3 text-body leading-relaxed text-ink-soft">{progress.solved} van 10 opdrachten opgelost. Na zes oefenopdrachten en vier zelfstandige verbeteringen kun je deze module afronden en de samenvatting bewaren bij je afgeronde lessen.</p>
                {solved ? <Button className="mt-5" onClick={() => useSentences.getState().complete(lesson)}>Module afronden en samenvatting bewaren<CheckCircle2 aria-hidden className="size-4" /></Button> : <Button className="mt-5" onClick={resumeUnsolved}>Verder met mijn open opdracht<ArrowRight aria-hidden className="size-4" /></Button>}
              </>}
            </section>
          </section>}
        </section>
        <Link data-readaloud-ignore href="/?niveau=zinnen#niveaus-titel" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-ink-muted"><ArrowLeft aria-hidden className="size-4" />Bewaren en terug naar alle zinslessen</Link>
      </main>
    </div>
  </div>;
}
