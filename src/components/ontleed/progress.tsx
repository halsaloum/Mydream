'use client';

import Link from 'next/link';
import { ArrowRight, Check, Repeat2 } from 'lucide-react';
import { COURSE_LEVELS, PARTS, ontleedLessons } from '@/content/ontleed';
import { retrievalEvidenceCount } from '@/lib/ontleed/learning';
import { useOntleed } from '@/state/ontleed';
import { useOntleedReady } from './use-ready';
import './learning-support.css';

export function OntleedProgress() {
  const ready = useOntleedReady();
  const completed = useOntleed(s => s.completed);
  const sessions = useOntleed(s => s.sessions);
  const reviews = useOntleed(s => s.reviewAnswers);
  const retrieval = useOntleed(s => s.retrieval);
  const mistakes = useOntleed(s => s.mistakes);
  const done = ready ? ontleedLessons.filter(lesson => completed[lesson.id]) : [];
  const relevant = new Set(ontleedLessons.map(lesson => lesson.id));
  const evidence = ready ? ontleedLessons.filter(lesson => retrievalEvidenceCount(retrieval[lesson.id]) >= 2).length : 0;
  const unresolved = ready ? Object.values(mistakes).filter(item => relevant.has(item.lessonId) && !item.resolved).length : 0;
  const attempts = ready ? [...Object.entries(sessions).filter(([id]) => relevant.has(id)).flatMap(([, session]) => Object.entries(session.answers).filter(([key]) => key !== 'lab').map(([, answer]) => answer)), ...Object.entries(reviews).filter(([key]) => relevant.has(key.split(':')[0]!)).map(([, answer]) => answer)] : [];
  const concepts = new Map<string, { correct: number; total: number }>();
  for (const answer of attempts) { const item = concepts.get(answer.concept) ?? { correct: 0, total: 0 }; item.total++; item.correct += Number(answer.correct); concepts.set(answer.concept, item); }
  const ranked = [...concepts].sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total);

  return <div className="o-support o-journal-screen">
    <header className="o-support-heading"><span className="o-eyebrow">JOUW LEERJOURNAAL</span><h1>Dit heb je al ontdekt.</h1><p>{done.length ? `Je hebt ${done.length} van de ${ontleedLessons.length} lessen afgerond. Bij ${evidence} lessen haalde je een antwoord op twee verschillende dagen zelfstandig uit je geheugen.` : 'Elke les begint met een vraag. Hier zie je welke stappen je zet en welke ideeën nog een keer aandacht verdienen.'}</p></header>
    <section className="o-journal-next"><Repeat2 size={24}/><div><h2>{unresolved ? 'Een volgende poging brengt je verder.' : 'Geef je kennis tijd om te blijven.'}</h2><p>{unresolved ? `${unresolved} ${unresolved === 1 ? 'oefening wacht' : 'oefeningen wachten'} op een nieuwe poging. Een eerder antwoord verbeteren hoort bij het leren.` : 'Haal een antwoord op een andere dag opnieuw uit je geheugen. Zo onderzoek je wat je zelfstandig kunt.'}</p><Link href="/herhalen">Oefen opnieuw <ArrowRight size={16}/></Link></div></section>
    <section className="o-journal-path" aria-label="Voortgang per taalniveau">{COURSE_LEVELS.map(level => {
      const lessons = ontleedLessons.filter(lesson => level.parts.includes(lesson.part));
      const count = lessons.filter(lesson => ready && completed[lesson.id]).length;
      const retained = lessons.filter(lesson => ready && retrievalEvidenceCount(retrieval[lesson.id]) >= 2).length;
      return <article key={level.id}><span className={`o-journal-marker ${count === lessons.length ? 'is-done' : ''}`}>{count === lessons.length ? <Check size={20}/> : level.number}</span><div><div className="o-journal-level-heading"><Link href={`/lessen?niveau=${level.id}`}><h2>{level.title}</h2><ArrowRight size={19}/></Link><p>{count} van {lessons.length} lessen afgerond{retained > 0 && ` · ${retained} opnieuw opgehaald op 2 dagen`}</p></div><ul>{PARTS.filter(part => level.parts.includes(part.id)).map(part => { const partLessons = lessons.filter(lesson => lesson.part === part.id); const partDone = partLessons.filter(lesson => ready && completed[lesson.id]).length; return <li key={part.id}><Link href={`/lessen?deel=${part.id}`}><span>{part.title}</span><span>{partDone}/{partLessons.length}<ArrowRight size={15}/></span></Link></li>; })}</ul></div></article>;
    })}</section>
    <div className="o-section-heading"><div><span className="o-eyebrow">WAAR KUN JE NOG GROEIEN?</span><h2>Je eerste antwoorden</h2></div><span className="o-muted">{attempts.length} antwoorden bewaard</span></div>
    {ranked.length ? <><p className="o-concept-explanation">Begrippen met de meeste onjuiste eerste pogingen staan bovenaan. Een verbeterde poging wist je eerste antwoord niet.</p><div className="o-journal-concepts">{ranked.map(([concept, item]) => <div key={concept}><strong>{concept}</strong><span>{item.correct} van {item.total} eerste antwoorden juist</span></div>)}</div><Link className="o-text-button" href="/herhalen">Opnieuw onderzoeken <ArrowRight size={16}/></Link></> : <div className="o-empty"><h2>Begin met iets kleins.</h2><p>Onderzoek één woord. Je antwoorden geven dit leerjournaal daarna vanzelf inhoud.</p><Link className="o-button" href={`/les/${ontleedLessons[0]!.id}`}>Begin bij het eerste woord <ArrowRight size={17}/></Link></div>}
    {done.length > 0 && <section className="o-recent"><h2>Laatst afgerond</h2>{[...done].sort((a, b) => completed[b.id]!.at - completed[a.id]!.at).slice(0, 5).map(lesson => <Link href={`/les/${lesson.id}`} key={lesson.id}><Check size={17}/><span>{lesson.title}</span><time dateTime={new Date(completed[lesson.id]!.at).toISOString()}>{new Date(completed[lesson.id]!.at).toLocaleDateString('nl-NL', { timeZone: 'Europe/Amsterdam' })}</time></Link>)}</section>}
    <p className="o-journal-caveat">Zelfstandig ophalen op twee dagen is bewijs bij die vragen. Het beoordeelt niet automatisch de kwaliteit van je eigen tekst.</p>
  </div>;
}
