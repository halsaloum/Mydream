'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';
import { ArrowRight, Check, Clock, Search, X } from 'lucide-react';
import { ontleedLessons, PARTS, COURSE_LEVELS } from '@/content/ontleed';
import { getLessonVideos } from '@/content/ontleed/media';
import { useOntleed } from '@/state/ontleed';
import { useOntleedReady } from './use-ready';
import { LearningIllustration } from './learning-illustration';
import './learning-support.css';

const SEARCH_CHANGED = 'ontleed:library-search';

function subscribeSearch(listener: () => void) {
  window.addEventListener(SEARCH_CHANGED, listener);
  window.addEventListener('popstate', listener);
  window.addEventListener('pageshow', listener);
  return () => {
    window.removeEventListener(SEARCH_CHANGED, listener);
    window.removeEventListener('popstate', listener);
    window.removeEventListener('pageshow', listener);
  };
}

function getSearchSnapshot() { return window.location.search; }

function replaceFilters(params: URLSearchParams) {
  // These filters only select already-loaded lessons. Native history keeps
  // Next's URL in sync without starting competing server navigations.
  window.history.replaceState(null, '', `/lessen${params.size ? '?' + params.toString() : ''}`);
  window.dispatchEvent(new Event(SEARCH_CHANGED));
}

export function OntleedLibrary() {
  const routeParams = useSearchParams();
  const routeSearch = routeParams.toString();
  // Use the browser's current URL synchronously while typing. Next's search
  // params supply the server snapshot and rerender us after external links.
  const search = useSyncExternalStore(subscribeSearch, getSearchSnapshot, () => routeSearch ? '?' + routeSearch : '');
  useEffect(() => {
    // Next updates history during commit for ordinary Link navigations. Notify
    // after that commit as well, when the new URL can actually be read.
    window.dispatchEvent(new Event(SEARCH_CHANGED));
  }, [routeSearch]);
  const params = new URLSearchParams(search);
  const ready = useOntleedReady();
  const completed = useOntleed(s => s.completed);
  const query = params.get('q') ?? '';
  const part = params.get('deel') ?? 'alles';
  const status = params.get('status') ?? 'alles';
  const level = params.get('niveau') ?? 'alles';
  const activeLevel = COURSE_LEVELS.find(item => item.id === level);
  function filter(key: string, value: string) {
    const next = new URLSearchParams(window.location.search);
    const selectedLevel = COURSE_LEVELS.find(item => item.id === next.get('niveau'));
    if (value === 'alles' || !value) next.delete(key); else next.set(key, value);
    if (key === 'niveau') next.delete('deel');
    if (key === 'deel' && value !== 'alles' && selectedLevel && !selectedLevel.parts.some(id => id === value)) next.delete('niveau');
    replaceFilters(next);
  }
  const list = ontleedLessons.filter(lesson => (!activeLevel || activeLevel.parts.includes(lesson.part)) && (part === 'alles' || lesson.part === part) && (status === 'alles' || (status === 'afgerond' ? Boolean(ready && completed[lesson.id]) : !ready || !completed[lesson.id])) && `${lesson.title} ${lesson.subtitle} ${lesson.goal} ${lesson.sections.map(section => section.title).join(' ')}`.toLocaleLowerCase('nl').includes(query.toLocaleLowerCase('nl')));
  const parts = PARTS.filter(item => !activeLevel || activeLevel.parts.includes(item.id));
  const filtersActive = Boolean(query || part !== 'alles' || status !== 'alles' || level !== 'alles');

  return <div className="o-support o-library-screen">
    <header className="o-support-heading"><span className="o-eyebrow">DE LEERLIJN</span><h1>Wat wil je begrijpen?</h1><p>Van het kleinste woord naar een alinea die klopt. Kies een les en ontdek het door te doen.</p></header>
    <div className="o-level-switch" aria-label="Filter op niveau"><button type="button" aria-pressed={level === 'alles'} onClick={() => filter('niveau', 'alles')}>Alles <span>{ontleedLessons.length}</span></button>{COURSE_LEVELS.map(item => <button type="button" key={item.id} aria-pressed={level === item.id} onClick={() => filter('niveau', item.id)}>{item.title}<span>{ontleedLessons.filter(lesson => item.parts.includes(lesson.part)).length}</span></button>)}</div>
    <div className="o-library-controls"><label className="o-search"><Search size={18}/><input aria-label="Zoek lessen" value={query} onChange={event => filter('q', event.target.value)} placeholder="Zoek een begrip, les of vraag…"/>{query && <button type="button" aria-label="Zoekopdracht wissen" onClick={() => filter('q', '')}><X size={16}/></button>}</label><label className="o-status-filter">Toon<select value={status} onChange={event => filter('status', event.target.value)}><option value="alles">Alle lessen</option><option value="nieuw">Nog te ontdekken</option><option value="afgerond">Afgerond</option></select></label></div>
    <div className="o-tabs o-part-filters" aria-label="Filter op deel"><button type="button" aria-pressed={part === 'alles'} className={part === 'alles' ? 'is-selected' : ''} onClick={() => filter('deel', 'alles')}>Alle onderdelen</button>{parts.map(item => <button type="button" aria-pressed={part === item.id} className={part === item.id ? 'is-selected' : ''} key={item.id} onClick={() => filter('deel', item.id)}>{item.number} · {item.title}</button>)}</div>
    <div className="o-results-line"><p className="o-results" role="status">{list.length} {list.length === 1 ? 'les' : 'lessen'} gevonden</p>{filtersActive && <button type="button" className="o-text-button" onClick={() => replaceFilters(new URLSearchParams())}><X size={13}/>Filters wissen</button>}</div>
    {list.length === 0 ? <div className="o-empty"><h2>Hier staat nog geen les.</h2><p>Probeer een ander begrip of maak je filters leeg.</p><button type="button" className="o-button" onClick={() => replaceFilters(new URLSearchParams())}>Toon alle lessen</button></div> : COURSE_LEVELS.filter(item => list.some(lesson => item.parts.includes(lesson.part))).map(item => <section className={`o-curriculum-level o-curriculum-${item.id}`} key={item.id}><div className="o-curriculum-level-heading"><span>{item.number}</span><div><h2>{item.title}</h2><p>{item.description}</p></div><LearningIllustration level={item.id}/></div>{PARTS.filter(p => item.parts.includes(p.id) && list.some(lesson => lesson.part === p.id)).map(p => <section className="o-library-part" key={p.id}><div className="o-library-part-heading"><div><h3>{p.title}</h3><p>{p.question}</p></div><span className="o-part-lesson-count">{list.filter(lesson => lesson.part === p.id).length} lessen</span></div><div className="o-lesson-list">{list.filter(lesson => lesson.part === p.id).map(lesson => <Link href={`/les/${lesson.id}`} key={lesson.id} className="o-lesson-row"><span className={`o-lesson-number ${ready && completed[lesson.id] ? 'is-done' : ''}`}>{ready && completed[lesson.id] ? <Check size={17}/> : String(ontleedLessons.filter(other => other.part === p.id).indexOf(lesson) + 1).padStart(2, '0')}</span><div><h3>{lesson.title}</h3><p>{lesson.subtitle}</p><span className="o-meta">{lesson.level} · {lesson.practice.length} oefeningen · eigen schrijfwerk{getLessonVideos(lesson.id).length > 0 && <span className="o-video-available"> · met videouitleg</span>}</span></div><span className="o-lesson-duration"><Clock size={13}/>{lesson.minutes} min</span><ArrowRight size={17}/></Link>)}</div></section>)}</section>)}
    <div className="o-library-argument"><Link href="/argumentatie">Argumentatie & drogredenen <ArrowRight size={17}/></Link></div>
  </div>;
}
