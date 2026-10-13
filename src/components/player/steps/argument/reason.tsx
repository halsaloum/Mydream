'use client';

import { ArrowDownUp, ArrowRight, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { reasonCheck, reasonLines, reasonNextPair, reasonPairDone, reasonWay, REASON_IDLE, type Note, type ReasonWord } from '@/engine/argument';
import { Button } from '@/components/ui/button';
import { OptionGroup } from '@/components/ui/option-group';
import { cn } from '@/lib/cn';
import { play } from '@/lib/sound';
import { InlineFeedback, Stage, StepIntro, type StepProps } from '../shared';

/** Bouw per paar beide richtingen; alleen gecontroleerde combinaties tellen mee. */
export function ReasonStep({ step, response, onChange, locked }: StepProps<'reason'>) {
  const [note, setNote] = useState<Note | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousPair = useRef(response.pair);
  const pairDone = reasonPairDone(response);
  const lines = reasonLines(step, response);
  const disabled = locked || pairDone;

  useEffect(() => {
    if (previousPair.current !== response.pair) heading.current?.focus();
    previousPair.current = response.pair;
  }, [response.pair]);

  const chooseWord = (word: ReasonWord) => {
    if (disabled) return;
    setNote(null);
    onChange({ ...response, word });
  };

  const swap = () => {
    if (disabled) return;
    play('tap');
    setNote(null);
    onChange({ ...response, top: response.top === 'claim' ? 'reason' : 'claim' });
  };

  const check = () => {
    if (disabled) return;
    const move = reasonCheck(step, response);
    setNote(move.note);
    if (move.note) play(move.note.tone === 'wrong' ? 'wrong' : move.note.tone === 'right' ? 'right' : 'tap');
    onChange(move.response);
  };

  const next = () => {
    if (locked || !pairDone) return;
    setNote(null);
    onChange(reasonNextPair(step, response));
  };

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />
      <p className="mt-3 text-small text-ink-muted">Maak met ieder zinnenpaar een kloppende versie met want én een kloppende versie met dus.</p>

      <section className="mt-6" aria-label={`Zinnenpaar ${response.pair + 1}`}>
        <h2 ref={heading} tabIndex={-1} className="mb-3 font-display text-title-sm font-bold outline-none">
          Paar {response.pair + 1} van {step.pairs.length}
        </h2>
        <Stage>
          <p className="font-serif text-example leading-relaxed text-ink">{lines.top.text}</p>
          <p className="mt-2 font-serif text-example leading-relaxed text-ink"><strong className="text-accent-ink">{response.word}</strong> {lines.bottom.text}</p>
        </Stage>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button variant="secondary" onClick={swap} disabled={disabled}>
            <ArrowDownUp aria-hidden className="size-5" />
            Wissel de zinnen
          </Button>
          <OptionGroup<ReasonWord>
            aria-label="Signaalwoord"
            value={response.word}
            onChange={chooseWord}
            options={[{ value: 'want', label: 'want', disabled }, { value: 'dus', label: 'dus', disabled }]}
            className="grid grid-cols-2 gap-3"
          />
        </div>

        <ul aria-label="Gevonden manieren" className="mt-4 flex flex-wrap gap-3 text-small font-semibold">
          {(['want', 'dus'] as const).map((word) => (
            <li key={word} className={cn('flex min-h-11 items-center gap-2 rounded-control border-2 px-3', response.found.includes(word) ? 'border-green-line bg-green-soft text-green-ink' : 'border-line text-ink-muted')}>
              {response.found.includes(word) && <Check aria-hidden className="size-4" />}
              Met {word}: {response.found.includes(word) ? 'gevonden' : 'nog te maken'}
            </li>
          ))}
        </ul>

        <InlineFeedback className="mt-4" tone={note?.tone ?? 'info'} id={`${response.pair}:${response.mistakes}:${response.found.length}`}>
          {note?.text ?? (pairDone ? 'Beide manieren gevonden. Hetzelfde argument ondersteunt in beide zinnen hetzelfde standpunt.' : REASON_IDLE)}
        </InlineFeedback>

        {!pairDone && <Button className="mt-3" variant="accent" onClick={check} disabled={locked}>Controleer de verbinding</Button>}
        {pairDone && (
          <section aria-label="De twee kloppende versies" className="mt-4 rounded-card border-2 border-green-line bg-green-soft p-4">
            <h3 className="font-display font-bold text-green-ink">Dezelfde redenering, twee manieren</h3>
            <p className="mt-1 text-small text-ink-muted">Het standpunt is onderstreept.</p>
            {(['want', 'dus'] as const).map((word) => (
              <p key={word} className="mt-3 font-serif text-lead leading-relaxed text-ink">
                {reasonWay(step, response.pair, word).map((part, i) => <span key={i} className={cn(part.claim && 'underline decoration-2 underline-offset-4', part.signal && 'font-bold text-accent-ink')}>{part.t}</span>)}
              </p>
            ))}
          </section>
        )}
        {pairDone && response.pair < step.pairs.length - 1 && (
          <Button className="mt-4" variant="accent" onClick={next} disabled={locked}>Volgend zinnenpaar <ArrowRight aria-hidden className="size-5" /></Button>
        )}
      </section>
    </div>
  );
}
