'use client';
import { useId, useState } from 'react';
import { ArrowRight, BookOpen, Check, ChevronDown, Lightbulb, MousePointer2, RotateCcw } from 'lucide-react';
import type { LessonSection } from '@/content/ontleed/types';
import { BOOKS } from '@/content/ontleed/sources';
import type { SectionCoach } from '@/lib/ontleed/lesson-coach';
import type { TheoryProgress } from '@/state/ontleed';
import './lesson-explainer.css';

type Props = {
  section: LessonSection;
  coach?: SectionCoach;
  readOnly?: boolean;
  progress?: TheoryProgress;
  onProgress?: (progress: TheoryProgress) => void;
  prediction?: { draft: string; revealed: boolean };
  onPrediction?: (prediction: { draft: string; revealed: boolean }) => void;
};

export function Theory({ section, coach, readOnly = false, progress, onProgress, prediction, onPrediction }: Props) {
  const [exampleIndex, setExampleIndex] = useState(() => progress?.viewed.at(-1) ?? 0);
  const [lensIndex, setLensIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const id = useId();
  const teaching = section.teaching;
  const teachingStep = teaching?.steps[stepIndex];
  const example = section.examples[exampleIndex]!;
  const viewed = progress?.viewed ?? [0];
  const check = coach?.check;
  const selected = progress?.answer;
  const correct = check && selected === check.answer;
  const allViewed = section.examples.every((_, index) => viewed.includes(index));
  const lenses = exampleIndex === 0 ? coach?.lenses : undefined;
  const lens = lenses?.[lensIndex];
  function viewExample(index: number) {
    setExampleIndex(index);
    setLensIndex(0);
    onProgress?.({ ...progress, viewed: [...new Set([0, ...viewed])].filter(viewedIndex => viewedIndex !== index).concat(index) });
  }
  function choose(answer: number) {
    onProgress?.({ viewed: [...new Set([0, ...viewed])], answer });
  }
  const fullExplanation = <>
    {!teaching && coach && <div className="o-coach-method"><strong>Zo pak je het aan</strong><ol>{coach.steps.map((step, index) => <li key={index}>{step}</li>)}</ol></div>}
    <div className="o-theory-explanation">{section.paragraphs.map((text, index) => <p key={index}>{text}</p>)}</div>
    <aside className="o-pitfall"><strong>Let hierop</strong><p>{section.pitfall}</p></aside>
  </>;
  const memory = <div className="o-takeaway o-explainer-memory"><span className="o-takeaway-check" aria-hidden="true"><Check size={17}/></span><div><strong>Onthoud</strong><p>{teaching?.memory ?? section.takeaway}</p></div></div>;
  const sources = teaching && teaching.sources.length > 0 && <details className="o-explainer-details o-teaching-sources"><summary><BookOpen size={18} aria-hidden="true"/> Bronnen bij deze uitleg <ChevronDown size={17} aria-hidden="true"/></summary><div><ul>{teaching.sources.map((source, index) => <li key={`${source.bookId}-${index}`}><a href={`/bronnen#bron-${source.bookId}`}>{BOOKS[source.bookId].title}<ArrowRight size={13} aria-hidden="true"/></a><span>{source.section}</span>{source.note && <p>{source.note}</p>}</li>)}</ul></div></details>;
  const terms = teaching?.terms && teaching.terms.length > 0 && <details className="o-explainer-details o-words-help"><summary>Woordenhulp <span>{teaching.terms.length} {teaching.terms.length === 1 ? 'begrip' : 'begrippen'}</span><ChevronDown size={17} aria-hidden="true"/></summary><div><dl>{teaching.terms.map(item => <div key={item.term}><dt>{item.term}</dt><dd>{item.meaning}</dd></div>)}</dl></div></details>;
  if (readOnly) return <article className="o-theory is-revealed o-theory-reading">
    <h2>{section.title}</h2>
    {(teaching || coach) && <section className="o-coach-summary"><div><span className="o-explainer-eyebrow">De kern</span><h3>In gewone taal</h3><p>{teaching?.core ?? coach?.summary}</p></div></section>}
    {teaching && <section className="o-teaching-reading-steps"><h3>Stap voor stap</h3><ol>{teaching.steps.map((step, index) => <li key={index}><strong>{step.title}</strong><p>{step.text}</p></li>)}</ol></section>}
    <div className="o-worked-examples">{section.examples.map((item, index) => <figure key={index}><blockquote><SentenceNotation text={item.sentence}/></blockquote><figcaption>{item.analysis}</figcaption></figure>)}</div>
    {fullExplanation}
    {memory}
    {terms}
    {sources}
  </article>;
  return <article className="o-theory o-explainer">
    <h1>{section.title}</h1>
    <p className="o-explainer-intro">Eén idee tegelijk. Volg de uitleg en probeer het daarna zelf.</p>
    <section className="o-coach-summary" aria-labelledby={`${id}-summary`}>
      <span className="o-coach-icon" aria-hidden="true"><Lightbulb size={21}/></span>
      <div><span className="o-explainer-eyebrow">De kern</span><h2 id={`${id}-summary`}>In gewone taal</h2><p>{teaching?.core ?? coach?.summary ?? section.takeaway}</p></div>
    </section>
    {teaching && teachingStep && <section className="o-teaching-steps" aria-labelledby={`${id}-steps`}>
      <div className="o-coach-heading"><h2 id={`${id}-steps`}>Stap voor stap</h2><span>{stepIndex + 1} van {teaching.steps.length}</span></div>
      <p className="o-coach-instruction">Klik op een stap om te zien hoe je het aanpakt.</p>
      <ol className="o-teaching-switcher" aria-label="Uitlegstappen">{teaching.steps.map((step, index) => <li key={index}><button type="button" aria-pressed={stepIndex === index} aria-controls={`${id}-step-explanation`} onClick={() => setStepIndex(index)}><span aria-hidden="true">{index + 1}</span>{step.title}</button></li>)}</ol>
      <div className="o-teaching-step-panel" id={`${id}-step-explanation`} aria-live="polite" aria-atomic="true"><span className="o-teaching-step-number" aria-hidden="true">{String(stepIndex + 1).padStart(2, '0')}</span><div><h3>{teachingStep.title}</h3><p>{teachingStep.text}</p></div></div>
    </section>}
    <section className="o-example-explorer" aria-labelledby={`${id}-example`}>
      <div className="o-coach-heading"><h2 id={`${id}-example`}>Bekijk het voorbeeld</h2><span>{exampleIndex + 1} / {section.examples.length}</span></div>
      <p className="o-coach-instruction">{coach?.lenses && exampleIndex > 0 ? 'Lees ook deze zin. Vergelijk de uitleg met het eerste voorbeeld.' : coach?.focusPrompt ?? 'Lees de zin en bekijk de uitleg eronder.'}</p>
      {section.examples.length > 1 && <div className="o-example-switcher" role="group" aria-label="Kies een voorbeeld">{section.examples.map((_, index) => <button type="button" key={index} aria-pressed={exampleIndex === index} onClick={() => viewExample(index)}>{viewed.includes(index) && <Check size={14} aria-hidden="true"/>}Voorbeeld {index + 1}</button>)}</div>}
      <div className="o-explorer-card">
        <p className="o-explorer-sentence"><SentenceNotation text={example.sentence} highlight={lens?.highlight}/></p>
        {lenses && <><p className="o-lens-instruction"><MousePointer2 size={15} aria-hidden="true"/> Klik op een vraag. Dezelfde woorden, een andere blik.</p><div className="o-lens-switcher" role="group" aria-label="Kijk naar vorm, functie of betekenis">{lenses.map((item, index) => <button key={item.label} type="button" className={`o-lens-${index}`} aria-pressed={lensIndex === index} onClick={() => setLensIndex(index)}>{item.label}</button>)}</div></>}
        <div className="o-example-insight" aria-live="polite"><span aria-hidden="true">↳</span><div><strong>{lens ? lens.label === 'Vorm' ? 'Hoe is het gebouwd?' : lens.label === 'Functie' ? 'Welke taak heeft de groep in de zin?' : 'Wat gebeurt er met deze groep?' : 'Dit zie je in de zin'}</strong><p>{lens?.explanation ?? example.analysis}</p></div></div>
      </div>
      {section.examples.length > 1 && <button type="button" className="o-text-button o-next-example" onClick={() => viewExample((exampleIndex + 1) % section.examples.length)}>{exampleIndex < section.examples.length - 1 ? 'Bekijk het volgende voorbeeld' : 'Terug naar het eerste voorbeeld'}<ArrowRight size={16}/></button>}
    </section>
    {check && <section className="o-quick-check" aria-labelledby={`${id}-check`}>
      <div className="o-coach-heading"><h2 id={`${id}-check`}>Even proberen</h2><span>Je mag terugkijken</span></div>
      <p className="o-check-prompt">{check.prompt}</p>
      {check.sentence && <p className="o-check-sentence"><SentenceNotation text={check.sentence}/></p>}
      <div role="radiogroup" aria-label="Snelle check" className="o-check-options">{check.options.map((option, index) => <label key={index} className={`o-check-option ${selected === index ? correct ? 'is-right' : 'is-try-again' : ''}`}><input type="radio" name={`${id}-answer`} checked={selected === index} disabled={Boolean(correct)} onChange={() => choose(index)}/><span className="o-check-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span><span>{option}</span>{selected === index && correct && <Check size={18} aria-hidden="true"/>}</label>)}</div>
      {selected !== undefined && <div className={`o-check-feedback ${correct ? 'is-right' : ''}`} role="status">{correct ? <Check size={20} aria-hidden="true"/> : <RotateCcw size={20} aria-hidden="true"/>}<div><strong>{correct ? 'Goed gezien!' : 'Kijk nog eens.'}</strong><p>{check.feedback[selected]}</p>{!correct && <p className="o-check-retry">Je mag meteen een ander antwoord kiezen. {check.hint}</p>}{correct && !allViewed && <p>Bekijk ook de andere voorbeelden om verder te gaan.</p>}</div></div>}
      {correct && allViewed && <p className="o-coach-done"><Check size={16} aria-hidden="true"/> Deze stap is klaar. Je kunt verder.</p>}
    </section>}
    {memory}
    {terms}
    <details className="o-explainer-details"><summary><BookOpen size={18} aria-hidden="true"/> Meer uitleg <ChevronDown size={17} aria-hidden="true"/></summary><div>{fullExplanation}</div></details>
    {sources}
    <details className="o-explainer-details o-optional-note"><summary>Eigen notitie (optioneel)<ChevronDown size={17} aria-hidden="true"/></summary><div><label className="o-input-label">Wat wil je onthouden?<textarea rows={2} value={prediction?.draft ?? ''} onChange={event => onPrediction?.({ draft: event.target.value, revealed: prediction?.revealed ?? false })} placeholder="Schrijf hier de uitleg in je eigen woorden…"/></label><p>Alleen voor jezelf. Je notitie wordt bewaard en niet automatisch beoordeeld.</p></div></details>
  </article>;
}

/** Highlight only explicit grouping notation or a span from an authored coaching lens. */
function SentenceNotation({ text, highlight }: { text: string; highlight?: string }) {
  if (highlight && text.includes(highlight)) {
    const start = text.indexOf(highlight);
    return <>{text.slice(0, start)}<mark className="o-coach-highlight">{highlight}</mark>{text.slice(start + highlight.length)}</>;
  }
  return <>{text.split(/(\[[^\[\]]*\])/g).map((part, index) => part.startsWith('[') && part.endsWith(']') ? <span className="o-notated-group" key={index}>{part}</span> : part)}</>;
}
