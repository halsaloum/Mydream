'use client';

import { ArrowRight, Check, Signpost } from 'lucide-react';
import { useMemo, useState } from 'react';
import { dilemmaAdd, dilemmaAllAdded, dilemmaNeeded, dilemmaPick, dilemmaSigns, type Move, type Note } from '@/engine/argument';
import { permutation } from '@/engine/hash';
import type { ResponseOf } from '@/engine/responses';
import { cn } from '@/lib/cn';
import { play } from '@/lib/sound';
import { RichText } from '@/components/ui/rich-text';
import { InlineFeedback, Stage, StepIntro, type StepProps } from '../shared';

/** Breid het keuzebeeld uit met echte alternatieven en formuleer daarna een eerlijke afweging. */
export function DilemmaStep({ step, response, onChange, locked, seed }: StepProps<'dilemma'>) {
  const [feedback, setFeedback] = useState<Note | null>(null);
  const candidateOrder = useMemo(() => permutation(`${seed}:dilemma-candidates`, step.candidates.length), [seed, step.candidates.length]);
  const optionOrder = useMemo(() => permutation(`${seed}:dilemma-options`, step.options.length), [seed, step.options.length]);
  const allAdded = dilemmaAllAdded(step, response);
  const honestOption = response.honest ? step.options.find((option) => option.ok === true) : undefined;

  const apply = (move: Move<ResponseOf<'dilemma'>>) => {
    if (locked || !move.note) return;
    onChange(move.response);
    setFeedback(move.note);
    play(move.note.tone === 'wrong' ? 'wrong' : 'right');
  };

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <Stage className="mt-6">
        <h2 className="font-display text-body font-bold text-ink">{step.source.label}</h2>
        <blockquote className="mt-3 font-serif text-example leading-relaxed text-ink">
          {step.source.segs.map((segment, index) => segment.hi ? (
            <mark key={index} className="rounded-chip bg-orange-soft px-1 text-orange-ink"><RichText text={segment.t} /></mark>
          ) : <RichText key={index} text={segment.t} />)}
        </blockquote>
      </Stage>

      <section className="mt-6 rounded-card border-2 border-line bg-sunken p-4" aria-label="De mogelijkheden">
        <h2 className="flex items-center gap-2 font-display text-title-sm font-extrabold text-ink"><Signpost aria-hidden className="size-5 text-accent-ink" /> Er zijn meer wegen</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {dilemmaSigns(step, response).map((sign, index) => (
            <li key={index} className={cn('flex min-h-12 items-center gap-2 rounded-control border-2 px-3 py-2 text-body', sign.added && sign.t ? 'border-green-line bg-green-soft text-green-ink' : 'border-line bg-surface text-ink-soft')}>
              {sign.added && sign.t ? <Check aria-hidden className="size-4 shrink-0" /> : <ArrowRight aria-hidden className="size-4 shrink-0" />}
              <div><span className="block text-caption font-semibold">{sign.added ? 'Aanvullende mogelijkheid' : 'De schrijver noemt'}</span><RichText text={sign.t ?? 'Nog te vinden'} /></div>
            </li>
          ))}
        </ul>
        <p role="status" className="mt-3 text-small font-semibold text-ink-muted">{response.added.length} van {dilemmaNeeded(step)} andere mogelijkheden toegevoegd.</p>
      </section>

      <section className="mt-5" aria-label="Ontbrekende mogelijkheden kiezen">
        <h2 className="font-display text-title-sm font-extrabold text-ink">Welke keuzes ontbreken?</h2>
        <p className="mt-2 text-small text-ink-soft">Kies alle echte alternatieven. Een andere naam voor dezelfde keuze opent geen nieuwe weg.</p>
        <div className="mt-3 grid gap-3">
          {candidateOrder.map((index) => {
            const candidate = step.candidates[index];
            if (!candidate) return null;
            const added = response.added.includes(index);
            const rejected = response.tried.includes(index);
            return (
              <div key={index}>
                <button
                  type="button"
                  aria-pressed={added}
                  disabled={locked || allAdded || added || rejected}
                  onClick={() => apply(dilemmaAdd(step, response, index))}
                  className={cn(
                    'min-h-14 w-full rounded-tile border-2 px-4 py-3 text-left text-body outline-none transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-default',
                    added ? 'border-green-line bg-green-soft text-green-ink' : rejected ? 'border-red-line bg-red-soft text-red-ink' : 'border-line bg-surface text-ink enabled:hover:border-accent-line enabled:hover:bg-accent-soft',
                  )}
                >
                  <RichText text={candidate.t} />
                  {(added || rejected) && <span className="mt-1 block text-small font-semibold">{added ? 'Toegevoegd' : 'Geen nieuwe mogelijkheid'}</span>}
                </button>
                {(added || rejected) && <p className={cn('mt-1 text-small', added ? 'text-green-ink' : 'text-red-ink')}>{rejected && candidate.ok !== true && <strong className="mr-1">{candidate.trap}.</strong>}<RichText text={candidate.why} /></p>}
              </div>
            );
          })}
        </div>
      </section>

      <InlineFeedback className="mt-4" tone={feedback?.tone ?? 'info'} id={`${response.added.length}:${response.mistakes}:${response.honest}`}>
        {feedback?.text}
      </InlineFeedback>

      {allAdded && (
        <section className="mt-5" aria-label="Een eerlijke afweging kiezen">
          <h2 className="font-display text-title-sm font-extrabold text-ink">Laat de lezer werkelijk kiezen</h2>
          <p className="mt-2 text-small text-ink-soft">Welke versie erkent de mogelijkheden zonder de ander in een valse keuze vast te zetten?</p>
          <div className="mt-3 grid gap-3">
            {optionOrder.map((index) => {
              const option = step.options[index];
              if (!option) return null;
              const rejected = response.triedOptions.includes(index);
              const chosen = response.honest && option.ok === true;
              return (
                <div key={index}>
                  <button
                    type="button"
                    aria-pressed={chosen}
                    disabled={locked || response.honest || rejected}
                    onClick={() => apply(dilemmaPick(step, response, index))}
                    className={cn(
                      'min-h-14 w-full rounded-tile border-2 px-4 py-3 text-left text-body outline-none transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-default',
                      chosen ? 'border-green-line bg-green-soft text-green-ink' : rejected ? 'border-red-line bg-red-soft text-red-ink' : 'border-line bg-surface text-ink enabled:hover:border-accent-line enabled:hover:bg-accent-soft',
                    )}
                  >
                    <RichText text={option.t} />
                    {(chosen || rejected) && <span className="mt-1 block text-small font-semibold">{chosen ? 'Alle mogelijkheden erkend' : 'De keuze wordt nog te beperkt voorgesteld'}</span>}
                  </button>
                  {rejected && <p className="mt-1 text-small text-red-ink">{option.ok !== true && <strong className="mr-1">{option.trap}.</strong>}<RichText text={option.why} /></p>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {honestOption && (
        <section className="mt-5 rounded-card border-2 border-green-line bg-green-soft p-4" aria-label="De afweging is hersteld">
          <h2 className="font-display text-title-sm font-extrabold text-green-ink">{step.done?.title ?? 'De alternatieven zijn zichtbaar'}</h2>
          <p className="mt-2 text-body text-green-ink"><RichText text={step.done?.text ?? honestOption.why} /></p>
          {step.done?.note && <p className="mt-2 text-small text-green-ink"><RichText text={step.done.note} /></p>}
        </section>
      )}
    </div>
  );
}
