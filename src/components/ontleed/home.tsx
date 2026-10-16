'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, Clock, Play } from 'lucide-react';
import { COURSE_LEVELS, PARTS, getOntleedLesson, getPart, ontleedLessons } from '@/content/ontleed';
import { useOntleed } from '@/state/ontleed';
import { useOntleedReady } from './use-ready';
import { LearningIllustration } from './learning-illustration';

export function OntleedHome() {
  const ready = useOntleedReady();
  const completed = useOntleed(s => s.completed);
  const last = useOntleed(s => s.lastLesson);
  const sessions = useOntleed(s => s.sessions);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const pending = ready && last && sessions[last] && (!completed[last] || completed[last].at < sessions[last].startedAt) ? getOntleedLesson(last) : undefined;
  const recommended = pending ?? ontleedLessons.find(lesson => !ready || !completed[lesson.id]) ?? ontleedLessons[0]!;
  const level = COURSE_LEVELS.find(item => item.id === selectedLevel) ?? COURSE_LEVELS.find(item => item.parts.includes(recommended.part))!;
  const parts = PARTS.filter(part => level.parts.includes(part.id));
  const chosen = parts.find(part => part.id === selectedPart);
  const recommendedPart = parts.find(part => part.id === recommended.part);
  const firstUnfinishedPart = parts.find(part => ontleedLessons.some(lesson => lesson.part === part.id && (!ready || !completed[lesson.id])));
  const part = chosen ?? recommendedPart ?? firstUnfinishedPart ?? parts[0]!;
  const lessons = ontleedLessons.filter(lesson => lesson.part === part.id);
  const next = pending?.part === part.id ? pending : lessons.find(lesson => !ready || !completed[lesson.id]) ?? lessons[0]!;
  const unitIndex = PARTS.findIndex(item => item.id === part.id);
  const previousPart = PARTS[unitIndex - 1];
  const followingPart = PARTS[unitIndex + 1];

  function selectPart(id: string) {
    const target = getPart(id);
    if (!target) return;
    setSelectedLevel(COURSE_LEVELS.find(item => item.parts.includes(target.id))!.id);
    setSelectedPart(id);
    window.scrollTo({ top: 0 });
  }

  return <div className="o-journey">
    <div className="o-journey-top"><span>NEDERLANDS</span><Link href="/lessen"><BookOpen size={15}/><span>Alle lessen</span><ArrowRight size={15}/></Link></div>
    <nav className="o-journey-levels" aria-label="Kies je taalniveau">{COURSE_LEVELS.map((item, index) => <button type="button" key={item.id} aria-pressed={level.id === item.id} onClick={() => { setSelectedLevel(item.id); setSelectedPart(null); window.scrollTo({ top: 0 }); }}><span>{index + 1}</span>{item.title}</button>)}</nav>
    <div className="o-journey-unit-picker"><label><span>Onderdeel {part.number}</span><select aria-label="Kies een onderdeel" value={part.id} onChange={event => selectPart(event.target.value)}>{parts.map(item => <option value={item.id} key={item.id}>{item.title}</option>)}</select><ChevronDown size={16}/></label><span>{lessons.length} lessen</span></div>
    <header className="o-journey-heading"><h1>{part.title}</h1><p>{part.description}</p></header>
    <ol className="o-journey-path" aria-label={`Leerpad: ${part.title}`}>{lessons.map((lesson, index) => {
      const done = Boolean(ready && completed[lesson.id]);
      const active = lesson.id === next.id;
      const resumed = Boolean(pending?.id === lesson.id);
      return <li key={lesson.id} className={`o-journey-step ${active ? 'is-current' : ''} ${done ? 'is-complete' : ''}`}>
        <div className="o-journey-marker" aria-hidden="true">{done ? <Check size={20}/> : active ? <Play size={19} fill="currentColor"/> : <span>{String(index + 1).padStart(2, '0')}</span>}</div>
        <div className="o-journey-lesson">
          {active ? <>
            <span className="o-journey-current-label">{resumed ? 'GA VERDER WAAR JE WAS' : done ? 'NOG EENS ONDERZOEKEN' : 'JOUW VOLGENDE STAP'}<span className="o-journey-pulse" aria-hidden/></span>
            <h2>{lesson.title}</h2><p>{lesson.subtitle}</p>
            <div className="o-journey-preview o-journey-illustrated" aria-label="Wat je gaat onderzoeken">
              <div><span className="o-journey-concept" aria-hidden>{level.id === 'woord' ? <>woord<span>→</span>bouwsteen</> : level.id === 'zin' ? <>zinsdeel<span>→</span>zin</> : <>zin<span>→</span>alinea</>}</span><p>{lesson.goal}</p></div>
              <LearningIllustration level={level.id} priority/>
            </div>
            <div className="o-journey-start"><span><Clock size={14}/>{lesson.minutes} min · op jouw tempo</span><Link className="o-button" href={`/les/${lesson.id}`}>{resumed ? 'Ga verder' : done ? 'Bekijk de les' : 'Begin de les'}<ArrowRight size={18}/></Link></div>
          </> : <Link className="o-journey-lesson-link" href={`/les/${lesson.id}`}><div><span>{done ? 'AFGEROND' : `LES ${String(index + 1).padStart(2, '0')}`}</span><h2>{lesson.title}</h2><p>{lesson.subtitle}</p></div><ArrowRight size={18}/></Link>}
        </div>
      </li>;
    })}</ol>
    <div className="o-journey-unit-end"><span className="o-journey-end-symbol" aria-hidden><Check size={20}/></span><p>Onderzoeken. Proberen. Zelf toepassen.</p><span>Je kunt elke les openen en op je eigen tempo verdergaan.</span></div>
    <nav className="o-journey-paging" aria-label="Andere onderdelen">{previousPart ? <button type="button" onClick={() => selectPart(previousPart.id)}><ArrowLeft size={17}/><span>Vorig onderdeel</span></button> : <Link href="/herhalen"><span>Even oefenen</span></Link>}{followingPart ? <button type="button" onClick={() => selectPart(followingPart.id)}><span>Volgend onderdeel</span><ArrowRight size={17}/></button> : <Link href="/oefenvormen">Naar je eigen tekst <ArrowRight size={17}/></Link>}</nav>
    <div className="o-journey-browse"><ArrowDown size={17}/><p>Een bepaald onderwerp zoeken?</p><Link href="/lessen">Bekijk alle {ontleedLessons.length} lessen</Link></div>
  </div>;
}
