'use client';

import { Check, MessageSquareQuote } from 'lucide-react';
import { useMemo, useState } from 'react';
import { strawmanAllFound, strawmanPick, strawmanTap, strawmanTwists, type Move, type Note } from '@/engine/argument';
import { permutation } from '@/engine/hash';
import type { ResponseOf } from '@/engine/responses';
import { cn } from '@/lib/cn';
import { play } from '@/lib/sound';
import { RichText } from '@/components/ui/rich-text';
import { InlineFeedback, Stage, StepIntro, type StepProps } from '../shared';

/** Vergelijk de echte uitspraak met de reactie; herstel daarna de weergave van het standpunt. */
export function StrawmanStep({ step, response, onChange, locked, seed }: StepProps<'strawman'>) {
  const [feedback, setFeedback] = useState<Note | null>(null);
  const order = useMemo(() => permutation(`${seed}:strawman-options`, step.options.length), [seed, step.options.length]);
  const allFound = strawmanAllFound(step, response);
  const fairOption = response.fair ? step.options.find((option) => option.ok === true) : undefined;

  const apply = (move: Move<ResponseOf<'strawman'>>) => {
    if (locked || !move.note) return;
    onChange(move.response);
    setFeedback(move.note);
    play(move.note.tone === 'wrong' ? 'wrong' : 'right');
  };

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <Stage className="mt-6">
        <h2 className="flex items-center gap-2 font-display text-body font-bold text-ink">
          <MessageSquareQuote aria-hidden className="size-5 text-accent-ink" />
          Wat {step.original.author} schreef
        </h2>
        <blockquote className="mt-3 font-serif text-example leading-relaxed text-ink">
          {step.original.segs.map((segment, index) => segment.id && response.found.includes(segment.id) ? (
            <mark key={index} className="rounded-chip bg-green-soft px-1 text-green-ink">
              <RichText text={segment.t} />
            </mark>
          ) : <RichText key={index} text={segment.t} />)}
        </blockquote>
      </Stage>

      <section className="mt-6" aria-label={`Reactie van ${step.response.author}`}>
        <h2 className="font-display text-title-sm font-extrabold text-ink">Wat {step.response.author} ervan maakt</h2>
        <p className="mt-2 text-small text-ink-soft">Kies de stukken die het oorspronkelijke standpunt veranderen. Vergelijk ze met de tekst hierboven.</p>
        <div className="mt-3 flex flex-wrap items-start gap-2">
          {step.response.chunks.map((chunk, index) => {
            const found = !!chunk.twist && response.found.includes(chunk.twist);
            return (
              <div key={index} className="min-w-0 max-w-full">
                <button
                  type="button"
                  aria-pressed={found}
                  disabled={locked || allFound || found}
                  onClick={() => apply(strawmanTap(step, response, index))}
                  className={cn(
                    'min-h-12 max-w-full rounded-tile border-2 px-3.5 py-3 text-left font-serif text-body outline-none transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-default',
                    found ? 'border-green-line bg-green-soft text-green-ink' : 'border-line bg-surface text-ink enabled:hover:border-accent-line enabled:hover:bg-accent-soft',
                  )}
                >
                  {found && <Check aria-hidden className="mr-1 inline size-4" />}
                  <RichText text={chunk.t} />
                </button>
                {found && <p className="mt-1 max-w-[35ch] text-small font-semibold text-green-ink"><RichText text={chunk.was ?? ''} /></p>}
              </div>
            );
          })}
        </div>
        <p role="status" className="mt-3 text-small font-semibold text-ink-muted">
          {response.found.length} van {strawmanTwists(step).length} verdraaiingen gevonden.
        </p>
      </section>

      <InlineFeedback className="mt-4" tone={feedback?.tone ?? 'info'} id={`${response.found.length}:${response.mistakes}:${response.fair}`}>
        {feedback?.text}
      </InlineFeedback>

      {allFound && (
        <section className="mt-5" aria-label="Een eerlijke reactie kiezen">
          <h2 className="font-display text-title-sm font-extrabold text-ink">Geef het voorstel eerlijk weer en reageer dan</h2>
          <p className="mt-2 text-small text-ink-soft">Je mag het oneens zijn. Kies de reactie die eerst het werkelijke standpunt weergeeft.</p>
          <div className="mt-3 grid gap-3">
            {order.map((index) => {
              const option = step.options[index];
              if (!option) return null;
              const rejected = response.tried.includes(index);
              const chosen = response.fair && option.ok === true;
              return (
                <div key={index}>
                  <button
                    type="button"
                    disabled={locked || response.fair || rejected}
                    aria-pressed={chosen}
                    onClick={() => apply(strawmanPick(step, response, index))}
                    className={cn(
                      'min-h-14 w-full rounded-tile border-2 px-4 py-3 text-left text-body outline-none transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-default',
                      chosen ? 'border-green-line bg-green-soft text-green-ink' : rejected ? 'border-red-line bg-red-soft text-red-ink' : 'border-line bg-surface text-ink enabled:hover:border-accent-line enabled:hover:bg-accent-soft',
                    )}
                  >
                    <RichText text={option.t} />
                    {(chosen || rejected) && <span className="mt-1 block text-small font-semibold">{chosen ? 'Eerlijk weergegeven' : 'Deze reactie verandert het voorstel nog'}</span>}
                  </button>
                  {rejected && <p className="mt-1 text-small text-red-ink">{option.ok !== true && <strong className="mr-1">{option.trap}.</strong>}<RichText text={option.why} /></p>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {fairOption?.ok === true && (
        <section className="mt-5 rounded-card border-2 border-green-line bg-green-soft p-4" aria-label="Eerlijk hersteld">
          <h2 className="font-display text-title-sm font-extrabold text-green-ink">{step.done?.title ?? 'Het werkelijke standpunt staat weer centraal'}</h2>
          <dl className="mt-3 space-y-3 text-body text-ink">
            <div><dt className="text-small font-bold">Het standpunt</dt><dd><RichText text={fairOption.restate} /></dd></div>
            <div><dt className="text-small font-bold">De eigen reactie</dt><dd><RichText text={fairOption.reply} /></dd></div>
          </dl>
          <p className="mt-3 text-small text-green-ink"><RichText text={step.done?.text ?? fairOption.why} /></p>
          {step.done?.note && <p className="mt-2 text-small text-green-ink"><RichText text={step.done.note} /></p>}
        </section>
      )}
    </div>
  );
}
