'use client';

import { ArrowRight, Beaker, Check, CheckCircle2, Clock3, GraduationCap, LockKeyhole, Network, Repeat2, Search, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';
import { argumentLessons, argumentModules } from '@/content/argumentation';
import type { ArgumentLevel } from '@/content/argumentation/types';
import { Button, ButtonLink } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress';
import { cn } from '@/lib/cn';
import { dayKey } from '@/lib/dates';
import { useCalmMotion } from '@/lib/motion';
import { argumentLessonHref } from '@/lib/argumentation/routes';
import { argumentLessonMinutes } from '@/lib/argumentation/duration';
import { argumentFoundations, foundationForLesson } from '@/content/argumentation/foundations';
import { lessonAvailable, moduleAvailable, nextPathLesson } from '@/lib/argumentation/path';
import { useArgumentation } from '@/state/argumentation';
import { useHydrated } from '@/state/hydration';
import { argumentMedia } from '@/content/argumentation/media';

const LEVEL_NAMES: Record<ArgumentLevel, string> = { basis: 'Vanaf nul', bachelor: 'Sterk redeneren', master: 'Meesterschap' };

function ArgumentArtwork() {
  return <svg viewBox="0 0 420 290" role="img" aria-label="Twee premissen ondersteunen een standpunt; een tegenwerping bevraagt de verbinding." className="mx-auto w-full max-w-md drop-shadow-sm">
    <defs><pattern id="argument-grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#dad9d2" /></pattern><marker id="arg-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L7 4L0 8" fill="none" stroke="#303f72" strokeWidth="1.5" /></marker></defs>
    <rect x="4" y="4" width="410" height="280" rx="22" fill="#fff" stroke="#e7e3da" strokeWidth="2" />
    <rect x="12" y="12" width="394" height="264" rx="16" fill="url(#argument-grid)" />
    <path d="M117 97C117 137 171 120 190 156M303 97C303 137 249 120 230 156" fill="none" stroke="#303f72" strokeWidth="2.5" markerEnd="url(#arg-arrow)" />
    <rect x="32" y="35" width="164" height="63" rx="12" fill="#e8edf9" stroke="#b9c8e8" strokeWidth="2" />
    <rect x="226" y="35" width="164" height="63" rx="12" fill="#e8edf9" stroke="#b9c8e8" strokeWidth="2" />
    <text x="114" y="60" textAnchor="middle" fill="#303f72" fontSize="11" fontWeight="700">PREMISSE 1</text><text x="114" y="82" textAnchor="middle" fill="#23262d" fontSize="14">Wat weten we?</text>
    <text x="308" y="60" textAnchor="middle" fill="#303f72" fontSize="11" fontWeight="700">PREMISSE 2</text><text x="308" y="82" textAnchor="middle" fill="#23262d" fontSize="14">Welke reden volgt?</text>
    <rect x="113" y="165" width="196" height="65" rx="12" fill="#d9f3ca" stroke="#a2ce81" strokeWidth="2" />
    <text x="211" y="190" textAnchor="middle" fill="#285c14" fontSize="11" fontWeight="700">STANDPUNT</text><text x="211" y="213" textAnchor="middle" fill="#23262d" fontSize="15" fontWeight="600">Is de conclusie houdbaar?</text>
    <rect x="255" y="119" width="136" height="30" rx="15" fill="#ffead4" stroke="#e3bd92" /><text x="323" y="139" textAnchor="middle" fill="#795014" fontSize="11" fontWeight="600">Maar geldt dit altijd?</text>
    <path d="M257 133L231 144" stroke="#b56e32" strokeWidth="2" strokeDasharray="4 4" /><circle cx="230" cy="144" r="4" fill="#b56e32" />
    <text x="211" y="257" textAnchor="middle" fill="#5f6570" fontSize="11">Maak de redenering zichtbaar. Beoordeel elke stap.</text>
  </svg>;
}

export function ArgumentationView() {
  const hydrated = useHydrated();
  const records = useArgumentation((state) => state.records);
  const sessions = useArgumentation((state) => state.sessions);
  const calm = useCalmMotion();
  const [query, setQuery] = useState('');
  const [reviewOnly, setReviewOnly] = useState(false);
  const completed = hydrated ? argumentLessons.filter((lesson) => records[lesson.id]?.completedAt).length : 0;
  const active = hydrated ? argumentLessons.find((lesson) => sessions[lesson.id] && !sessions[lesson.id]?.finished && lessonAvailable(lesson.id, argumentLessons, records)) : undefined;
  const next = active ?? nextPathLesson(argumentLessons, records) ?? argumentLessons[0]!;
  const due = hydrated ? argumentLessons.filter((lesson) => records[lesson.id] && records[lesson.id]!.reviewOn <= dayKey()) : [];
  const level = next.moduleId;
  const selectedModule = argumentModules.find((module) => module.id === level)!;
  const shown = argumentLessons.filter((lesson) => {
    const textMatch = !query.trim() || `${lesson.title} ${lesson.teaser} ${lesson.objectives.join(' ')} ${foundationForLesson(lesson.id).map((concept) => concept.term).join(' ')}`.toLocaleLowerCase('nl').includes(query.trim().toLocaleLowerCase('nl'));
    return textMatch && (!reviewOnly || due.includes(lesson));
  });
  const exerciseCount = argumentLessons.reduce((count, lesson) => count + lesson.exercises.length, 0);

  return <div data-accent="blue" className="space-y-8 sm:space-y-10">
    <section className="relative overflow-hidden rounded-sheet border border-line bg-[linear-gradient(120deg,#fff_30%,#eef0f9_100%)] p-6 shadow-sheet sm:p-9">
      <div className="grid items-center gap-7 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="mb-4 flex items-center gap-2 text-caption font-bold tracking-[0.13em] text-blue-ink uppercase"><Network aria-hidden className="size-4" />Eén doorlopende leerlijn</p>
          <h1 className="font-serif text-[clamp(2.25rem,1.5rem+2.5vw,3.75rem)] leading-[1.08] tracking-[-0.025em]">Sterk denken.<br /><em className="text-blue-ink">Zorgvuldig argumenteren.</em></h1>
          <p className="mt-5 max-w-xl text-body leading-relaxed text-ink-soft">Sterke taal en zorgvuldig redeneren voor leiders. Onderbouw je voorstellen, herken drogredenen en reageer helder op de sterkste tegenwerping.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={argumentLessonHref(next.id)} variant="accent">{active ? 'Hervat je analyse' : completed === 0 ? 'Begin het leerpad' : completed === argumentLessons.length ? 'Verdiep je kennis' : 'Verder met het leerpad'}<ArrowRight aria-hidden className="size-4" /></ButtonLink>
          </div>
          <p className="mt-4 text-caption leading-relaxed text-ink-muted">{argumentLessons.length} lessen · {exerciseCount} oefeningen · {21 + argumentFoundations.length} interactieve beeldkaarten · {argumentMedia.filter((item) => item.kind === 'video').length} video’s</p>
        </div>
        <motion.div initial={calm ? false : { opacity: 0, rotate: -2 }} animate={{ opacity: 1, rotate: 0 }} transition={{ duration: calm ? 0 : 0.5 }} className="hidden sm:block"><ArgumentArtwork /></motion.div>
      </div>
    </section>

    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-card border border-line bg-surface p-5"><p className="flex items-center gap-2 text-caption font-bold text-ink-muted"><GraduationCap aria-hidden className="size-4 text-blue-ink" />Jouw leerpad</p><p className="mt-3 font-display text-title font-bold">{completed}<span className="text-body font-medium text-ink-muted"> / {argumentLessons.length} lessen</span></p><ProgressBar value={completed} max={argumentLessons.length} label="Afgeronde argumentatielessen" size="sm" className="mt-3" /></div>
      <button onClick={() => { setReviewOnly(true); setQuery(''); }} className="rounded-card border border-line bg-surface p-5 text-left transition-colors hover:border-blue-line"><p className="flex items-center gap-2 text-caption font-bold text-ink-muted"><Repeat2 aria-hidden className="size-4 text-orange-ink" />Herhalen</p><p className="mt-3 font-display text-title font-bold">{due.length}<span className="text-body font-medium text-ink-muted"> {due.length === 1 ? 'les klaar' : 'lessen klaar'}</span></p><p className="mt-3 text-caption text-ink-muted">Haal je analyse opnieuw uit je geheugen.<ArrowRight aria-hidden className="ml-2 inline size-3" /></p></button>
      <div className="rounded-card border border-blue-line bg-blue-soft p-5"><p className="flex items-center gap-2 text-caption font-bold text-blue-ink"><Sparkles aria-hidden className="size-4" />Jouw volgende stap</p><Link href={argumentLessonHref(next.id)} className="mt-3 block font-display text-title-sm font-bold leading-snug hover:underline">{next.title}</Link><p className="mt-3 flex items-center gap-2 text-caption text-ink-muted"><Clock3 aria-hidden className="size-3.5" />≈ {argumentLessonMinutes(next)} minuten · {LEVEL_NAMES[next.moduleId]}</p></div>
    </div>

    <section aria-label="Jouw doorlopende leerpad" className="space-y-7">
        <div className="grid gap-3 sm:grid-cols-3" aria-label="Groei binnen één leerroute">
          {argumentModules.map((module, index) => {
            const lessons = argumentLessons.filter((lesson) => lesson.moduleId === module.id);
            const done = hydrated ? lessons.filter((lesson) => records[lesson.id]?.completedAt).length : 0;
            const available = moduleAvailable(module.id, argumentLessons, records);
            return <article key={module.id} aria-current={level === module.id ? 'step' : undefined} data-accent={module.accent}
              className={cn('min-h-36 rounded-card border-2 p-4 text-left transition-colors sm:p-5', level === module.id && !reviewOnly && !query ? 'border-accent-ink bg-accent-soft' : 'border-line bg-surface')}>
              <span className="flex items-center justify-between text-caption font-bold text-accent-ink"><span>0{index + 1} · {LEVEL_NAMES[module.id]}</span>{done === lessons.length && done > 0 && <CheckCircle2 aria-label="Niveau afgerond" className="size-4" />}</span>
              <span className="mt-3 block font-display text-title-sm leading-snug font-bold">{module.title}</span>
              <span className="mt-3 block text-caption text-ink-muted">{available ? `${done} / ${lessons.length} afgerond` : 'Na het vorige checkpoint'}</span>
            </article>;
          })}
        </div>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="mb-1 text-caption font-bold tracking-wider text-blue-ink uppercase">{reviewOnly ? 'Actief ophalen' : query ? 'Zoekresultaten' : 'Je groeit stap voor stap'}</p><h2 className="font-serif text-headline">{reviewOnly ? 'Terug naar de kern.' : query ? 'Vind je onderwerp.' : 'Van eerste begrip naar zelfstandig oordeel.'}</h2><p className="mt-2 max-w-xl text-small leading-relaxed text-ink-muted">{reviewOnly ? 'Een nieuwe poging gebruikt dezelfde vragen. Bestudeer de theorie pas nadat je zelf hebt geprobeerd te antwoorden.' : query ? `${shown.length} lessen gevonden in je leerroute.` : `${selectedModule.description} Kaarten, simulaties en video’s verschijnen in de les zodra je ze nodig hebt.`}</p></div>
          <label className="relative block shrink-0"><span className="sr-only">Zoek in argumentatielessen</span><Search aria-hidden className="absolute top-3.5 left-3 size-4 text-ink-muted" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Zoek een begrip of onderwerp" className="min-h-11 w-full rounded-control border-2 border-line bg-surface pr-3 pl-10 text-small sm:w-64" /></label>
        </div>
        {reviewOnly && <Button variant="ghost" onClick={() => setReviewOnly(false)}>Toon het hele leerpad<ArrowRight aria-hidden className="size-4" /></Button>}
        <div className="space-y-3">{shown.map((lesson, index) => {
          const record = hydrated ? records[lesson.id] : undefined;
          const inProgress = hydrated && sessions[lesson.id] && !sessions[lesson.id]?.finished;
          const done = Boolean(record?.completedAt);
          const available = lessonAvailable(lesson.id, argumentLessons, records);
          return <Link key={lesson.id} href={argumentLessonHref(lesson.id)} onClick={() => { if (reviewOnly && !inProgress) { useArgumentation.getState().start(lesson, true); useArgumentation.getState().move(lesson.id, 1); } }} className="group flex items-start gap-4 rounded-card border-2 border-line bg-surface p-5 shadow-slab-sm transition-colors hover:border-blue-line sm:gap-5 sm:p-6">
            <span className={cn('mt-1 grid size-11 shrink-0 place-items-center rounded-control border font-display text-small font-bold', done ? 'border-green-line bg-green-soft text-green-ink' : !available ? 'border-line bg-sunken text-ink-muted' : lesson.checkpoint ? 'border-purple-line bg-purple-soft text-purple-ink' : 'border-blue-line bg-blue-soft text-blue-ink')}>{done ? <Check aria-hidden className="size-5" /> : !available ? <LockKeyhole aria-hidden className="size-4" /> : lesson.checkpoint ? <GraduationCap aria-hidden className="size-5" /> : String(index + 1).padStart(2, '0')}</span>
            <div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap items-center gap-2 text-caption font-semibold text-ink-muted"><span>{LEVEL_NAMES[lesson.moduleId]}</span>{lesson.checkpoint && <span className="rounded-chip bg-purple-soft px-2 py-0.5 text-purple-ink">Checkpoint · 80%</span>}{inProgress && <span className="rounded-chip bg-orange-soft px-2 py-0.5 text-orange-ink">Bezig</span>}{done && <span className="text-green-ink">Afgerond · {record?.bestScore}%</span>}</div><h3 className="font-display text-title-sm leading-snug font-bold group-hover:text-blue-ink">{lesson.title}</h3><p className="mt-2 text-small leading-relaxed text-ink-muted">{lesson.teaser}</p><p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-caption text-ink-muted"><span className="flex items-center gap-1"><Clock3 aria-hidden className="size-3.5" />≈ {argumentLessonMinutes(lesson)} min</span><span>{lesson.exercises.length} opdrachten</span>{lesson.lab && <span className="flex items-center gap-1 text-blue-ink"><Beaker aria-hidden className="size-3.5" />Interactief lab</span>}</p></div>
            <ArrowRight aria-hidden className="mt-3 hidden size-5 shrink-0 text-ink-muted transition-transform group-hover:translate-x-1 sm:block" />
          </Link>;
        })}</div>
        {shown.length === 0 && <div className="rounded-card border border-line bg-surface p-8 text-center"><p className="font-display font-bold">{reviewOnly ? 'Er staat vandaag nog geen herhaling klaar.' : 'Geen lessen gevonden.'}</p><p className="mt-2 text-small text-ink-muted">{reviewOnly ? 'Je kunt altijd een afgeronde les opnieuw oefenen.' : 'Probeer bijvoorbeeld “causaliteit”, “dialoog” of “bewijs”.'}</p></div>}
        <p className="text-caption leading-relaxed text-ink-muted">Je wordt stap voor stap geleid. Rond de voorgaande les af om verder te gaan; een checkpoint is behaald vanaf 80%. Je kunt afgeronde lessen altijd opnieuw oefenen. De hulpmiddelen horen bij de denkstap die je op dat moment leert.</p>
    </section>
  </div>;
}
