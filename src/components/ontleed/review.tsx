'use client';
import Link from 'next/link';
import { ArrowRight, Check, Repeat2 } from 'lucide-react';
import { getOntleedLesson, ontleedLessons } from '@/content/ontleed';
import { getLearningQuestion, useOntleed } from '@/state/ontleed';
import { isProductionQuestion, retrievalEvidenceCount } from '@/lib/ontleed/learning';
import { useOntleedClock, useOntleedReady } from './use-ready';
import { QuestionView } from './question';
import './learning-support.css';

export function OntleedReview() {
  const ready = useOntleedReady(), now = useOntleedClock();
  const retrieval = useOntleed(state => state.retrieval), completed = useOntleed(state => state.completed);
  const mistakes = useOntleed(state => state.mistakes);
  const round = useOntleed(state => state.reviewRound), close = useOntleed(state => state.closeReview);
  const eligible = ontleedLessons.filter(lesson => completed[lesson.id]);
  const due = eligible.filter(lesson => retrieval[lesson.id] && retrieval[lesson.id]!.due <= now)
    .sort((a, b) => retrieval[a.id]!.due - retrieval[b.id]!.due);
  const pendingMistakes = Object.values(mistakes).filter(item => !item.resolved && getLearningQuestion(item.lessonId, item.questionId))
    .sort((a, b) => a.due - b.due);
  const dueMistakes = pendingMistakes.filter(item => item.due <= now);
  function begin(lessons = due) {
    useOntleed.getState().beginReview(lessons.slice(0, 8).map(lesson => {
      const production = lesson.retrieval.filter(isProductionQuestion);
      const questions = retrievalEvidenceCount(retrieval[lesson.id]) < 2 && production.length ? production : lesson.retrieval;
      return { lessonId: lesson.id, questionId: questions[(retrieval[lesson.id]?.attempts ?? 0) % questions.length]!.id };
    }));
  }
  function beginMistakes() {
    useOntleed.getState().beginReview(pendingMistakes.slice(0, 8).map(item => ({ lessonId: item.lessonId, questionId: item.questionId, source: 'mistake' })));
  }
  if (!ready) return <div className="o-loading" role="status">Je kennischecks worden geladen…</div>;
  if (round) {
    if (round.position === round.items.length) return <section className="o-support o-review-finish o-empty">
      <span className="o-complete-icon"><Check size={32}/></span><h1>Je hebt opnieuw opgehaald.</h1>
      <p>{Object.values(round.responses).filter(response => response.correct).length} van {round.items.length} eerste antwoorden klopten. Een verbetering met een hint is waardevol, maar telt niet als zelfstandig juist.</p>
      <p>Een fout blijft in je wachtrij tot je hem op twee verschillende dagen zelfstandig hebt opgelost.</p>
      <button type="button" className="o-button" onClick={close}>Terug naar herhalen</button>
    </section>;
    const item = round.items[round.position];
    const lesson = item && getOntleedLesson(item.lessonId);
    const question = item ? getLearningQuestion(item.lessonId, item.questionId) : undefined;
    if (!item || !lesson || !question) return <section className="o-support o-review-finish o-empty">
      <h1>Deze ronde kan niet worden hervat.</h1><p>Een vraag is veranderd. Je eerdere resultaten zijn bewaard; start een nieuwe ronde met de huidige vragen.</p>
      <button type="button" className="o-button" onClick={close}>Terug naar herhalen</button>
    </section>;
    const response = round.responses[String(round.position)], correction = round.corrections[String(round.position)];
    return <div className="o-support o-review-flow o-review-player">
      <span className="o-eyebrow">{item.source === 'mistake' ? 'FOUTENRONDE' : 'KENNISCHECK'} {round.position + 1} VAN {round.items.length}</span>
      <div className="o-progress-track" role="progressbar" aria-label="Voortgang in de herhaling" aria-valuemin={0} aria-valuemax={round.items.length} aria-valuenow={round.position}><span style={{ width: `${round.position / round.items.length * 100}%` }}/></div>
      <p className="o-muted">{lesson.title} · eerst zelf ophalen</p>
      <QuestionView key={`${round.startedAt}:${round.position}:${item.lessonId}:${question.id}`} question={question} saved={response} correction={correction}
        onAnswer={(answer, correct) => useOntleed.getState().review(item.lessonId, question.id, answer, correct, question.concept)}
        onRetry={answer => useOntleed.getState().retryReview(answer)} onAssistance={() => useOntleed.getState().markReviewAssisted()} sources={lesson.sources}/>
      {response && <button type="button" className="o-button" disabled={!response.correct && !correction?.correct} onClick={() => useOntleed.getState().advanceReview()}>Volgende <ArrowRight size={17}/></button>}
      <Link className="o-text-button" href="/">Pauzeren en later hervatten</Link>
      <button type="button" className="o-text-button" onClick={close}>Ronde afsluiten</button>
    </div>;
  }
  const next = eligible.map(lesson => retrieval[lesson.id]?.due).filter((value): value is number => typeof value === 'number').sort((a, b) => a - b)[0];
  return <div className="o-support o-review-screen">
    <header className="o-support-heading"><span className="o-eyebrow">EVEN OPNIEUW PROBEREN</span><h1>Wat is blijven hangen?</h1><p>Nieuwe zinnen, vertrouwde begrippen. Ontdek wat je zonder uitleg al weet, in maximaal acht vragen.</p></header>
    <section className="o-review-ready"><span className="o-review-symbol" aria-hidden><Repeat2 size={34}/></span><div><span className="o-eyebrow">JE VOLGENDE RONDE</span><h2>{due.length ? `${due.length} kennischecks staan klaar` : eligible.length ? 'Je bent bij voor vandaag.' : 'Eerst ontdekken. Dan ophalen.'}</h2><p>{due.length ? 'Neem je tijd. Probeer het antwoord eerst zelf te vinden; je krijgt onderweg hulp als je vastloopt.' : eligible.length ? `Volgende geplande check: ${next ? new Date(next).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', timeZone: 'Europe/Amsterdam' }) : 'na je volgende les'}. Je kunt hieronder ook alvast oefenen.` : 'Rond je eerste les af. De volgende dag komt er een nieuwe vraag over die stof terug.'}</p>{eligible.length > 0 ? <button type="button" className="o-button" disabled={due.length === 0} onClick={() => begin()}>Start de ronde <ArrowRight size={17}/></button> : <Link className="o-button" href={`/les/${ontleedLessons[0]!.id}`}>Begin je eerste les <ArrowRight size={16}/></Link>}</div></section>
    <section className="o-review-mistakes"><div><span className="o-eyebrow">ELKE POGING HELPT</span><h2>{pendingMistakes.length ? `${pendingMistakes.length} ${pendingMistakes.length === 1 ? 'vraag' : 'vragen'} om opnieuw te proberen` : 'Ruimte voor een nieuwe poging.'}</h2><p>{pendingMistakes.length ? `${dueMistakes.length} daarvan staan voor nu gepland. De andere kun je alvast oefenen. Na twee juiste eerste antwoorden op verschillende dagen verdwijnt een vraag uit deze wachtrij.` : 'Een verkeerd eerste antwoord komt hier vanzelf terug, ook als je de les nog niet hebt afgerond.'}</p></div>{pendingMistakes.length > 0 && <button type="button" className="o-button o-secondary" onClick={beginMistakes}>Start een foutenronde <ArrowRight size={17}/></button>}</section>
    {eligible.length > 0 && <><div className="o-section-heading"><h2>Je afgeronde lessen</h2><button type="button" className="o-text-button" onClick={() => begin(eligible)}>Nu alvast oefenen <ArrowRight size={16}/></button></div><div className="o-lesson-list">{eligible.map(lesson => <div className="o-lesson-row" key={lesson.id}><Check size={20}/><div><h3>{lesson.title}</h3><p>{retrieval[lesson.id]?.attempts ?? 0} kennischecks · {retrieval[lesson.id]?.correct ?? 0} juiste eerste antwoorden</p><span className="o-evidence-label">Productie op {retrievalEvidenceCount(retrieval[lesson.id])} van 2 dagen</span></div><Link href={`/les/${lesson.id}?lezen=1`}>Uitleg bekijken <ArrowRight size={16}/></Link></div>)}</div></>}
    <div className="o-library-argument"><Link href="/herhalen/argumentatie">Argumentatie en drogredenen herhalen <ArrowRight size={16}/></Link></div>
    <details className="o-support-details"><summary>Hoe werkt herhalen?</summary><p>Een afgeronde les, een verbeterd antwoord en zelfstandig produceren zijn verschillende dingen. Alleen juiste eerste antwoorden op productievragen tellen voor de twee dagen. Meerkeuze en verbeteringen met hulp tellen daar niet voor mee. Dit is bewijs bij deze vragen, geen garantie van volledige beheersing.</p><p>De geplande afstanden zijn 1, 3, 7 en 21 dagen; een fout brengt een les terug naar één dag. Vrijwillig vooraf oefenen telt ook mee voor de planning.</p></details>
  </div>;
}
