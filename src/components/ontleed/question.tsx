'use client';
import { useId, useState } from 'react';
import Link from 'next/link';
import { Check, ChevronDown, Lightbulb, RotateCcw } from 'lucide-react';
import type { OntleedLesson, Question } from '@/content/ontleed/types';
import { BOOKS } from '@/content/ontleed/sources';
import { correctAnswer, gradeQuestion, type Answer } from '@/lib/ontleed/grade';
import './focused-lesson.css';

type Attempt = { answer: Answer; correct: boolean };
type QuestionViewProps = {
  question: Question; saved?: Attempt; correction?: Attempt;
  onAnswer: (answer: Answer, correct: boolean) => void;
  onRetry?: (answer: Answer) => void;
  onAssistance?: () => void;
  sources?: OntleedLesson['sources'];
};

export function QuestionView({ question, saved, correction, onAnswer, onRetry, onAssistance, sources }: QuestionViewProps) {
  const empty: Answer = question.kind === 'choice' ? -1 : question.kind === 'type' ? '' : [];
  const [draft, setAnswer] = useState<Answer>(empty);
  const [retrying, setRetrying] = useState(false);
  const [hint, setHint] = useState(false);
  const [why, setWhy] = useState(false);
  const groupId = useId();
  const latest = correction ?? saved;
  const submitted = Boolean(saved) && !retrying;
  const resolved = Boolean(saved?.correct || correction?.correct);
  const answer = submitted ? latest!.answer : draft;
  const selected = Array.isArray(answer) ? answer : [];
  const valid = question.kind === 'choice' ? typeof answer === 'number' && answer >= 0
    : question.kind === 'type' ? typeof answer === 'string' && answer.trim().length > 0
      : question.kind === 'order' ? selected.length === question.tokens.length : selected.length > 0;
  const inputInstruction = question.kind === 'choice' ? 'Kies één antwoord' : question.kind === 'mark' ? 'Tik alle woorden aan die erbij horen' : question.kind === 'order' ? 'Bouw de zin, woord voor woord' : 'Formuleer zelf je antwoord';
  const sentence = 'sentence' in question ? question.sentence : undefined;
  const previewChoice = question.kind === 'choice' && sentence?.includes('…') && question.options.every(option => option.length <= 26);
  function toggle(index: number) {
    if (!submitted) setAnswer(selected.includes(index) ? selected.filter(i => i !== index) : [...selected, index]);
  }
  function submit() {
    if (!valid || submitted) return;
    if (saved && onRetry) onRetry(answer);
    else onAnswer(answer, gradeQuestion(question, answer));
    setRetrying(false);
    setWhy(false);
  }
  function retry() { setAnswer(empty); setRetrying(true); setWhy(false); setHint(true); }
  return <div className={`o-question o-question-${question.kind} ${submitted ? 'is-answered' : ''}`}>
    <h2>{question.prompt}</h2>
    {sentence && <div className={`o-question-scene ${previewChoice ? 'has-live-blank' : ''}`}><span className="o-scene-label">{previewChoice?'De zin':'Bekijk de zin'}</span><p className="o-sentence">{previewChoice&&question.kind==='choice'?sentence.split('…').map((fragment,index)=><span key={index}>{index>0&&<span className={`o-sentence-blank ${typeof answer==='number'&&answer>=0?'has-answer':''}`} aria-label={typeof answer==='number'&&answer>=0?`Gekozen vorm: ${question.options[answer]}`:'Kies de ontbrekende vorm'}>{typeof answer==='number'&&answer>=0?question.options[answer]:'…'}</span>}{fragment}</span>):sentence}</p></div>}
    <div className="o-question-instruction"><span>{inputInstruction}</span>{question.kind==='mark'&&<span>{selected.length} geselecteerd</span>}{question.kind==='order'&&<span>{selected.length} / {question.tokens.length}</span>}</div>
    {question.kind === 'choice' && <div className="o-options" role="radiogroup" aria-label="Antwoorden">{question.options.map((option, index) => <label key={index} className={`o-option ${answer === index ? 'is-selected' : ''} ${submitted && resolved && index === question.answer ? 'is-correct' : ''}`}><input type="radio" name={groupId} checked={answer === index} disabled={submitted} onChange={() => setAnswer(index)}/><span className="o-option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{submitted && resolved && index === question.answer && <Check size={20}/>}</label>)}</div>}
    {question.kind === 'type' && <label className="o-input-label">Jouw antwoord<input autoComplete="off" value={typeof answer === 'string' ? answer : ''} disabled={submitted} onChange={e => setAnswer(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') submit(); }} placeholder="Typ je antwoord…"/></label>}
    {question.kind === 'mark' && <div className="o-token-bank" aria-label="Woorden markeren">{question.tokens.map((token, index) => <button type="button" key={index} aria-pressed={selected.includes(index)} disabled={submitted} className={`o-token ${selected.includes(index) ? 'is-selected' : ''} ${submitted && resolved && question.targets.includes(index) ? 'is-correct' : ''}`} onClick={() => toggle(index)}>{token}</button>)}</div>}
    {question.kind === 'order' && <><div className="o-order-slot" aria-label="Jouw volgorde">{selected.length === 0 ? <span>Kies de bouwstenen in de juiste volgorde.</span> : selected.map((index, position) => <button type="button" className="o-token is-selected" key={index} disabled={submitted} aria-label={`${question.tokens[index]}, verwijder positie ${position + 1}`} onClick={() => toggle(index)}>{question.tokens[index]}</button>)}</div><div className="o-token-bank" aria-label="Beschikbare bouwstenen">{question.tokens.map((token, index) => <button type="button" className="o-token" key={index} disabled={submitted || selected.includes(index)} onClick={() => toggle(index)}>{token}</button>)}</div>{!submitted && selected.length > 0 && <button type="button" className="o-text-button" onClick={() => setAnswer([])}><RotateCcw size={15}/> Opnieuw ordenen</button>}</>}
    {!submitted ? <div className="o-question-actions"><button type="button" className="o-button" disabled={!valid} onClick={submit}>{retrying ? 'Controleer nieuwe poging' : 'Controleer antwoord'} <Check size={17}/></button><button type="button" className="o-text-button" onClick={() => { if (!hint) onAssistance?.(); setHint(!hint); }} aria-expanded={hint}><Lightbulb size={17}/> Een aanwijzing</button>{hint && <p className="o-hint">{question.hint}</p>}</div>
      : <div className={`o-feedback ${resolved ? 'is-positive' : ''}`}>
        <div className="o-feedback-message" role="status"><span className="o-feedback-icon" aria-hidden="true">{resolved?<Check size={20}/>:<RotateCcw size={19}/>}</span><div><strong>{saved?.correct ? 'Je eerste antwoord klopt.' : resolved ? 'Je nieuwe poging klopt.' : 'Nog niet. Probeer de proef.'}</strong>{!resolved && <p>{question.hint}</p>}<p className="o-muted">{saved?.correct ? 'Je eerste poging is bewaard.' : 'Je eerste poging blijft bewaard. Deze vraag komt later terug om opnieuw op te halen.'}</p></div></div>
        {!resolved && onRetry && <button type="button" className="o-button o-secondary" onClick={retry}><RotateCcw size={16}/> Probeer opnieuw</button>}
        <button type="button" className="o-text-button" onClick={() => setWhy(!why)} aria-expanded={why}>Waarom? <ChevronDown size={16}/></button>
        {why && <div className="o-why-panel">
          {resolved || correction || !onRetry ? <><p>{question.explanation}</p>{!resolved && <p><b>Een mogelijke oplossing:</b> {correctAnswer(question)}</p>}{question.kind === 'choice' && !saved?.correct && typeof saved?.answer === 'number' && <p>{question.feedback[saved.answer]}</p>}</> : <p>Voer eerst de proef uit: {question.hint} Probeer daarna opnieuw. Je kunt de uitwerking na die poging bekijken.</p>}
          {sources && sources.length > 0 && <div className="o-question-sources"><strong>Bron bij deze proef</strong>{sources.map((source, index) => <p key={index}>{BOOKS[source.bookId].url ? <a href={BOOKS[source.bookId].url} target="_blank" rel="noreferrer">{BOOKS[source.bookId].title}</a> : BOOKS[source.bookId].title} · {source.section}<br/><small>{source.note}</small></p>)}<Link href="/bronnen">Alle bronnen en verantwoording</Link></div>}
        </div>}
      </div>}
  </div>;
}
