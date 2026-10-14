'use client';

import { ArrowLeft, ArrowRight, BookOpen, Check, Lightbulb, RotateCcw } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import type { SentenceTeaching } from '@/content/sentences/teaching-types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

type ApplicationProps = { teaching: SentenceTeaching; text: string; onChange: (text: string) => void; label?: string };

/** This is a writing prompt, not a grammar checker or a source of earned completion. */
export function SentenceApplication({ teaching, text, onChange, label = 'Schrijf je eigen zin en verklaring' }: ApplicationProps) {
  const id = useId();
  const [comparedText, setComparedText] = useState<string | null>(null);
  const [checks, setChecks] = useState<number[]>([]);
  const modelHeading = useRef<HTMLHeadingElement>(null);
  const ready = (text.match(/[\p{L}\p{N}]+/gu)?.length ?? 0) >= 2 && /[.!?][”"')\]]?\s*$/u.test(text);
  const compared = comparedText !== null;
  const changed = compared && text !== comparedText;
  const application = teaching.application;
  useEffect(() => { if (compared) modelHeading.current?.focus(); }, [compared]);

  return <section aria-labelledby={`${id}-title`} className="rounded-card border-2 border-purple-line bg-purple-soft/40 p-4 sm:p-6">
    <h3 id={`${id}-title`} className="font-display text-title-sm font-extrabold text-purple-ink">Schrijf zelf een hele zin</h3>
    <p className="mt-3 text-body leading-relaxed text-ink-soft">{application.prompt}</p>
    <p id={`${id}-starter`} className="mt-3 rounded-control border border-purple-line bg-surface p-3 text-small leading-relaxed text-ink-soft"><strong>Een begin om je op weg te helpen:</strong> {application.starter}</p>
    <label htmlFor={`${id}-text`} className="mt-4 block font-display font-bold text-ink">{label}</label>
    <textarea id={`${id}-text`} aria-describedby={`${id}-starter ${id}-help`} value={text} maxLength={3000} rows={5}
      onChange={(event) => { onChange(event.target.value); setChecks([]); }}
      className="mt-2 w-full rounded-control border-2 border-line bg-white p-3 text-body leading-relaxed focus:border-purple-ink" />
    <p id={`${id}-help`} className="mt-2 text-small leading-relaxed text-ink-muted">Schrijf eerst je eigen zin en sluit af met een punt, vraagteken of uitroepteken. Je tekst wordt op dit apparaat bewaard. Je vergelijkt de inhoud zelf; deze schrijfopdracht krijgt geen cijfer.</p>
    {!compared && <Button className="mt-4" variant="secondary" disabled={!ready} onClick={() => setComparedText(text)}>Vergelijk met een voorbeeld</Button>}
    {compared && <div className="mt-5 border-t border-purple-line pt-5">
      <h4 ref={modelHeading} tabIndex={-1} className="font-display text-lead font-bold text-purple-ink">Een mogelijke uitwerking</h4>
      <p className="mt-3 rounded-control bg-white p-4 font-serif text-lead leading-relaxed text-ink">{application.model}</p>
      <p className="mt-3 text-body leading-relaxed text-ink-soft">{application.reasoning}</p>
      <p className="mt-3 text-small leading-relaxed text-ink-muted">Jouw zin hoeft niet hetzelfde te zijn. Kijk of je dezelfde aanpak kunt uitleggen.</p>
      {changed && <p role="status" className="mt-3 text-small font-semibold text-purple-ink">Je hebt je tekst aangepast. Controleer de punten opnieuw bij je nieuwe versie.</p>}
      <fieldset className="mt-4">
        <legend className="font-display font-bold text-ink">Controleer zelf je tekst</legend>
        {application.checklist.map((item, index) => <label key={item} className="mt-2 flex min-h-12 cursor-pointer items-start gap-3 rounded-control border border-purple-line bg-surface p-3 text-small leading-relaxed text-ink-soft">
          <input type="checkbox" checked={checks.includes(index)} onChange={() => setChecks((current) => current.includes(index) ? current.filter((value) => value !== index) : [...current, index])} className="mt-0.5 size-5 shrink-0 accent-purple-ink" />
          <span>{item}</span>
        </label>)}
      </fieldset>
      <p className="mt-3 text-caption leading-relaxed text-ink-muted">De vinkjes zijn jouw eigen controle voor dit moment. Je geschreven tekst blijft bewaard; bij terugkomen controleer je haar opnieuw.</p>
    </div>}
  </section>;
}

function HighlightedSentence({ sentence, focus }: { sentence: string; focus: string[] }) {
  const phrases = [...new Set(focus.filter((phrase) => phrase.trim()))].sort((a, b) => b.length - a.length);
  if (phrases.length === 0) return <>{sentence}</>;
  const escaped = phrases.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(${escaped.join('|')})(?![\\p{L}\\p{N}])`, 'giu');
  return <>{sentence.split(pattern).map((part, index) => index % 2 === 1
    ? <mark key={index} className="rounded bg-blue-soft px-0.5 font-bold text-blue-ink underline decoration-2 underline-offset-4">{part}</mark>
    : <span key={index}>{part}</span>)}</>;
}

function WorkedExample({ teaching }: { teaching: SentenceTeaching }) {
  const id = useId();
  const [stepIndex, setStepIndex] = useState(0);
  const walkthrough = teaching.walkthrough;
  const current = walkthrough.steps[stepIndex]!;
  const selectStep = (index: number) => setStepIndex(index);

  return <section aria-labelledby={`${id}-title`} className="space-y-5">
    <div><h3 id={`${id}-title`} className="font-display text-title-sm font-extrabold">{walkthrough.title}</h3><p className="mt-3 text-body leading-relaxed text-ink-soft">{walkthrough.situation}</p></div>
    <div className="rounded-control border border-line bg-sunken p-4"><p className="text-caption font-bold text-ink-muted">We beginnen met deze zin</p><p className="mt-2 font-serif text-lead leading-relaxed">{walkthrough.startSentence}</p></div>
    <nav aria-label="Stappen van het uitgewerkte voorbeeld" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {walkthrough.steps.map((step, index) => <Button key={step.title} size="sm" variant={index === stepIndex ? 'accent' : 'secondary'} aria-current={index === stepIndex ? 'step' : undefined} aria-label={`Stap ${index + 1}: ${step.title}`} onClick={() => selectStep(index)} className="min-w-0 flex-col items-start gap-1 px-3 py-3 text-left"><span className="text-caption">Stap {index + 1}</span><span className="max-w-full break-words">{step.title}</span></Button>)}
    </nav>
    <div className="rounded-card border-2 border-blue-line bg-blue-soft/30 p-4 sm:p-6" aria-live="polite" aria-atomic="true">
      <p className="text-caption font-bold text-blue-ink">Stap {stepIndex + 1} van {walkthrough.steps.length}</p>
      <h4 className="mt-2 font-display text-title-sm font-bold">{current.title}</h4>
      <figure className="mt-4">
        <p className="rounded-control border border-blue-line bg-white p-4 font-serif text-[clamp(1.25rem,1rem+1vw,1.6rem)] leading-relaxed" lang="nl"><HighlightedSentence sentence={current.sentence} focus={current.focus} /></p>
        <figcaption className="mt-3 text-small leading-relaxed text-ink-muted">{current.focus.length ? <>Let op: <strong>{current.focus.join(' · ')}</strong>. Deze woorden zijn in de zin onderstreept.</> : 'Lees de hele zin en volg de uitleg hieronder.'}</figcaption>
      </figure>
      <p className="mt-4 text-body leading-relaxed text-ink-soft">{current.explanation}</p>
    </div>
    <div className="flex flex-wrap justify-between gap-3">
      <Button size="sm" variant="secondary" disabled={stepIndex === 0} onClick={() => selectStep(stepIndex - 1)}><ArrowLeft aria-hidden className="size-4" />Vorige stap</Button>
      <Button size="sm" variant="secondary" disabled={stepIndex === walkthrough.steps.length - 1} onClick={() => selectStep(stepIndex + 1)}>Volgende stap<ArrowRight aria-hidden className="size-4" /></Button>
    </div>
    {stepIndex === walkthrough.steps.length - 1 && <p className="rounded-control border border-green-line bg-green-soft p-4 text-body leading-relaxed text-green-ink"><strong>Wat je nu hebt gezien:</strong> {walkthrough.result}</p>}
    <details className="rounded-card border border-line bg-sunken p-4 sm:p-5">
      <summary className="min-h-11 cursor-pointer font-display font-bold text-blue-ink">Bekijk dit voorbeeld als uitlegvideo</summary>
      <p id={`${id}-video-help`} className="mt-3 text-small leading-relaxed text-ink-soft">Een stille uitlegvideo met tekst en gemarkeerde zinnen. Er is geen gesproken uitleg. Je kunt pauzeren, terugspoelen en de Nederlandse ondertiteling aanzetten. De volledige uitleg staat ook hieronder als tekst.</p>
      <video controls preload="none" playsInline width="1280" height="720" poster={`/videos/zinnen/${teaching.lessonId}.jpg`} aria-label={`Uitlegvideo: ${walkthrough.title}`} aria-describedby={`${id}-video-help`} className="mt-4 aspect-video w-full rounded-control border border-line bg-white">
        <source src={`/videos/zinnen/${teaching.lessonId}.mp4`} type="video/mp4" />
        <track src={`/videos/zinnen/${teaching.lessonId}.vtt`} kind="subtitles" srcLang="nl" label="Nederlands" default />
        Je browser kan deze video niet afspelen. Lees de volledige uitleg hieronder.
      </video>
      <details className="mt-4 rounded-control border border-line bg-white p-4">
        <summary className="min-h-11 cursor-pointer font-display font-bold">Lees de volledige videotekst</summary>
        <p className="mt-3 text-body leading-relaxed">{walkthrough.situation}</p>
        <p className="mt-3 font-serif text-lead leading-relaxed">{walkthrough.startSentence}</p>
        <ol className="mt-4 space-y-5">{walkthrough.steps.map((step, index) => <li key={step.title}><h4 className="font-display font-bold">{index + 1}. {step.title}</h4><p className="mt-2 font-serif text-lead leading-relaxed">{step.sentence}</p><p className="mt-2 text-body leading-relaxed text-ink-soft">{step.explanation}</p>{step.focus.length > 0 && <p className="mt-2 text-small text-ink-muted">Let op: {step.focus.join(' · ')}.</p>}</li>)}</ol>
        <p className="mt-4 text-body leading-relaxed">{walkthrough.result}</p>
      </details>
    </details>
  </section>;
}

function QuickCheck({ teaching }: { teaching: SentenceTeaching }) {
  const id = useId();
  const [selected, setSelected] = useState('');
  const [committed, setCommitted] = useState(false);
  const question = teaching.quickCheck;
  const chosen = question.options.find((option) => option.id === selected);
  const correct = selected === question.answer;
  return <section aria-labelledby={`${id}-title`} className="rounded-card border-2 border-blue-line bg-blue-soft/30 p-4 sm:p-6">
    <h3 id={`${id}-title`} className="font-display text-title-sm font-extrabold">Kijk of je het begrijpt</h3>
    <p className="mt-2 text-small leading-relaxed text-ink-muted">Een korte vraag om van te leren. Je keuze telt niet mee voor je voortgang of een cijfer.</p>
    <fieldset className="mt-4"><legend className="font-display font-bold text-ink">{question.question}</legend><div className="mt-3 space-y-3">{question.options.map((option) => <label key={option.id} className={cn('flex min-h-14 cursor-pointer items-start gap-3 rounded-control border-2 bg-white p-4 text-body leading-relaxed', option.id === selected ? 'border-blue-ink' : 'border-line')}><input type="radio" name={`${id}-answer`} value={option.id} checked={selected === option.id} disabled={committed} onChange={() => setSelected(option.id)} className="mt-1 size-5 shrink-0 accent-blue-ink" /><span>{option.text}</span></label>)}</div></fieldset>
    {!committed ? <Button className="mt-4" disabled={!chosen} onClick={() => setCommitted(true)}>Bekijk de uitleg bij mijn antwoord</Button> : <div className="mt-4">
      <div role="status" className={cn('rounded-control border p-4 text-body leading-relaxed', correct ? 'border-green-line bg-green-soft text-green-ink' : 'border-orange-line bg-orange-soft text-orange-ink')}><p className="flex items-center gap-2 font-display font-bold">{correct ? <Check aria-hidden className="size-5" /> : <Lightbulb aria-hidden className="size-5" />}{correct ? 'Deze keuze past bij de uitleg.' : 'Bekijk dit nog eens.'}</p><p className="mt-2">{chosen?.feedback}</p></div>
      <Button className="mt-3" variant="secondary" onClick={() => { setSelected(''); setCommitted(false); }}><RotateCcw aria-hidden className="size-4" />Probeer de vraag opnieuw</Button>
    </div>}
  </section>;
}

const PARTS = ['Zo werkt het', 'Samen bekijken', 'Zelf proberen'] as const;

export function TeachingView({ teaching, text, onChange }: ApplicationProps) {
  const id = useId();
  const [part, setPart] = useState(0);
  const partHeading = useRef<HTMLHeadingElement>(null);
  const previousPart = useRef(part);
  const goTo = (next: number) => { setPart(next); };
  useEffect(() => {
    if (previousPart.current !== part && document.activeElement?.getAttribute('role') !== 'tab') partHeading.current?.focus();
    previousPart.current = part;
  }, [part]);

  return <div className="space-y-6">
    <div><p className="flex items-center gap-2 text-caption font-bold text-blue-ink"><BookOpen aria-hidden className="size-4" />Uitleg in kleine stappen</p><h2 className="mt-2 font-display text-title font-extrabold">Begrijp eerst wat er gebeurt.</h2><p className="mt-3 text-body leading-relaxed text-ink-soft">Lees de uitleg, bekijk samen een voorbeeld en probeer het daarna zelf. Je kiest je eigen tempo en kunt altijd terug.</p></div>
    <div role="tablist" aria-label="Onderdelen van de uitleg" className="grid grid-cols-3 gap-2">{PARTS.map((title, index) => <button key={title} type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={index === part} tabIndex={index === part ? 0 : -1} onClick={() => goTo(index)} onKeyDown={(event) => {
      const next = event.key === 'ArrowRight' ? (index + 1) % PARTS.length : event.key === 'ArrowLeft' ? (index + PARTS.length - 1) % PARTS.length : event.key === 'Home' ? 0 : event.key === 'End' ? PARTS.length - 1 : null;
      if (next !== null) { event.preventDefault(); goTo(next); document.getElementById(`${id}-tab-${next}`)?.focus(); }
    }} className={cn('min-h-16 min-w-0 rounded-control border-2 p-2 text-small font-bold sm:p-3', index === part ? 'border-blue-line bg-blue-soft text-blue-ink' : 'border-line bg-white text-ink-soft')}><span aria-hidden className="mb-1 block text-caption">{index + 1}</span>{title}</button>)}</div>
    <section role="tabpanel" id={`${id}-panel-${part}`} aria-labelledby={`${id}-tab-${part}`} tabIndex={0} className="space-y-6">
      <h3 ref={partHeading} tabIndex={-1} className="sr-only">{PARTS[part]}</h3>
      {part === 0 && <>
        <div className="space-y-4">{teaching.introduction.map((paragraph) => <p key={paragraph} className="text-body leading-relaxed text-ink-soft">{paragraph}</p>)}</div>
        <section aria-label="Woorden die je in deze les tegenkomt"><h3 className="font-display text-title-sm font-bold">De begrippen, rustig uitgelegd</h3><p className="mt-2 text-small text-ink-muted">Open een begrip voor een uitleg en een voorbeeld.</p><div className="mt-4 space-y-3">{teaching.concepts.map((concept) => <details key={concept.term} className="rounded-control border border-blue-line bg-blue-soft/30 p-4"><summary className="min-h-11 cursor-pointer font-display font-bold text-blue-ink">{concept.term}</summary><p className="mt-3 text-body leading-relaxed text-ink-soft">{concept.meaning}</p><p className="mt-3 rounded-control bg-white p-3 text-body leading-relaxed"><strong>Voorbeeld:</strong> {concept.example}</p></details>)}</div></section>
        <details className="rounded-control border border-orange-line bg-orange-soft/30 p-4"><summary className="min-h-11 cursor-pointer font-display font-bold text-orange-ink">Wat vaak verwarrend is</summary><ul className="mt-4 space-y-4">{teaching.pitfalls.map((pitfall) => <li key={pitfall.mistake}><p className="font-semibold text-ink">{pitfall.mistake}</p><p className="mt-2 text-body leading-relaxed text-ink-soft">{pitfall.correction}</p></li>)}</ul></details>
      </>}
      {part === 1 && <WorkedExample teaching={teaching} />}
      {part === 2 && <><QuickCheck teaching={teaching} /><SentenceApplication teaching={teaching} text={text} onChange={onChange} /></>}
    </section>
    <div className="flex flex-wrap justify-between gap-3 border-t border-line pt-5">
      {part > 0 ? <Button variant="secondary" onClick={() => goTo(part - 1)}><ArrowLeft aria-hidden className="size-4" />{PARTS[part - 1]}</Button> : <span />}
      {part < PARTS.length - 1 && <Button onClick={() => goTo(part + 1)}>{PARTS[part + 1]}<ArrowRight aria-hidden className="size-4" /></Button>}
    </div>
  </div>;
}
