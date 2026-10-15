'use client';
import Link from 'next/link';
import { ArrowRight, Check, Repeat2 } from 'lucide-react';
import { getOntleedLesson, ontleedLessons } from '@/content/ontleed';
import { useOntleed } from '@/state/ontleed';
import { useOntleedClock, useOntleedReady } from './use-ready';
import { QuestionView } from './question';

export function OntleedReview() {
  const ready = useOntleedReady(), now = useOntleedClock();
  const retrieval = useOntleed(state => state.retrieval), completed = useOntleed(state => state.completed);
  const round = useOntleed(state => state.reviewRound), close = useOntleed(state => state.closeReview);
  const eligible = ontleedLessons.filter(lesson => completed[lesson.id]);
  const due = eligible.filter(lesson => retrieval[lesson.id] && retrieval[lesson.id]!.due <= now)
    .sort((a, b) => retrieval[a.id]!.due - retrieval[b.id]!.due);
  function begin(lessons = due) {
    useOntleed.getState().beginReview(lessons.slice(0, 8).map(lesson => ({
      lessonId: lesson.id, questionId: lesson.retrieval[(retrieval[lesson.id]?.attempts ?? 0) % lesson.retrieval.length]!.id,
    })));
  }
  if (!ready) return <div className="o-loading" role="status">Je kennischecks worden geladen…</div>;
  if (round) {
    if (round.position === round.items.length) return <section className="o-empty">
      <span className="o-complete-icon"><Check size={32}/></span><h1>Je hebt opnieuw opgehaald.</h1>
      <p>{Object.values(round.responses).filter(response => response.correct).length} van {round.items.length} eerste antwoorden klopten. Gemiste begrippen komen eerder terug; juiste antwoorden krijgen meer tijd.</p>
      <button type="button" className="o-button" onClick={close}>Terug naar herhalen</button>
    </section>;
    const item = round.items[round.position];
    const lesson = item && getOntleedLesson(item.lessonId);
    const question = item ? lesson?.retrieval.find(candidate => candidate.id === item.questionId) : undefined;
    if (!item || !lesson || !question) return <section className="o-empty">
      <h1>Deze ronde kan niet worden hervat.</h1><p>Een vraag is veranderd. Je eerdere resultaten zijn bewaard; start een nieuwe ronde met de huidige vragen.</p>
      <button type="button" className="o-button" onClick={close}>Terug naar herhalen</button>
    </section>;
    const response = round.responses[String(round.position)];
    return <div className="o-review-player">
      <span className="o-eyebrow">KENNISCHECK {round.position + 1} VAN {round.items.length}</span>
      <p className="o-muted">{lesson.title} · eerst zelf ophalen</p>
      <QuestionView key={`${round.startedAt}:${item.lessonId}:${question.id}:${response?.at ?? 'pending'}`} question={question} saved={response}
        onAnswer={(answer, correct) => useOntleed.getState().review(item.lessonId, question.id, answer, correct, question.concept)}/>
      {response && <button type="button" className="o-button" onClick={() => useOntleed.getState().advanceReview()}>Volgende <ArrowRight size={17}/></button>}
      <button type="button" className="o-text-button" onClick={close}>Ronde verlaten</button>
    </div>;
  }
  const next = eligible.map(lesson => retrieval[lesson.id]?.due).filter((value): value is number => typeof value === 'number').sort((a, b) => a - b)[0];
  return <>
    <div className="o-page-heading"><span className="o-eyebrow">WAT BLIJFT ER HANGEN?</span><h1>Haal het zelf weer op.</h1><p>Nieuwe zinnen, vertrouwde begrippen. Probeer het antwoord zonder de uitleg en ontdek wat je nog kunt onderbouwen.</p></div>
    <section className="o-review-hero"><Repeat2 size={42}/><div><h2>{due.length} kennischecks staan klaar</h2><p>{due.length ? 'Een ronde mengt maximaal acht lessen. Elk antwoord bepaalt wanneer dat begrip terugkomt.' : eligible.length ? `Volgende geplande check: ${next ? new Date(next).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' }) : 'na je volgende les'}.` : 'Rond je eerste les af. De volgende dag komt er een nieuwe vraag over die stof terug.'}</p></div><button type="button" className="o-button" disabled={due.length === 0} onClick={() => begin()}>Start de ronde <ArrowRight size={17}/></button></section>
    {eligible.length > 0 && <><div className="o-section-heading"><h2>Je afgeronde lessen</h2><button type="button" className="o-text-button" onClick={() => begin(eligible)}>Nu alvast oefenen <ArrowRight size={16}/></button></div><div className="o-lesson-list">{eligible.map(lesson => <div className="o-lesson-row" key={lesson.id}><Check size={20}/><div><h3>{lesson.title}</h3><p>{retrieval[lesson.id]?.attempts ?? 0} kennischecks · {retrieval[lesson.id]?.correct ?? 0} juiste eerste antwoorden</p></div><Link href={`/les/${lesson.id}?lezen=1}`}>Uitleg bekijken <ArrowRight size={16}/></Link></div>)}</div></>}
    <div className="o-library-argument"><Link href="/herhalen/argumentatie">Argumentatie en drogredenen herhalen <ArrowRight size={16}/></Link></div>
    <div className="o-note"><strong>Onze herhaalkeuze</strong><p>De geplande afstanden zijn 1, 3, 7 en 21 dagen; een fout brengt een les terug naar één dag. Dit is een praktische planning, geen gemeten garantie van beheersing. Vrijwillig vooraf oefenen telt ook mee voor de planning.</p></div>
  </>;
}
