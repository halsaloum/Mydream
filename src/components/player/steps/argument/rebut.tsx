'use client';

import { Check, MessageCircle } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { rebutParagraph, rebutPick } from '@/engine/argument';
import { permutation } from '@/engine/hash';
import { ProgressBar } from '@/components/ui/progress';
import { RichText } from '@/components/ui/rich-text';
import { cn } from '@/lib/cn';
import { play } from '@/lib/sound';
import { Tile } from '../../tile';
import { InlineFeedback, StepIntro, type StepProps } from '../shared';

/** Bezwaren beantwoorden; eerdere toegevingen, weerleggingen en fouten blijven na hervatten zichtbaar. */
export function RebutStep({ step, response, onChange, locked, seed }: StepProps<'rebut'>) {
  const orders = useMemo(() => step.rounds.map((round, index) => permutation(`${seed}:rebut:${index}`, round.options.length)), [seed, step.rounds]);
  const current = step.rounds[response.round];
  const done = response.round >= step.rounds.length;
  const pieces = rebutParagraph(step, response.round);
  const previous = step.rounds[response.round - 1]?.options.find((option) => option.ok === true);
  const heading = useRef<HTMLHeadingElement>(null);
  const lastRound = useRef(response.round);

  useEffect(() => {
    if (lastRound.current === response.round) return;
    lastRound.current = response.round;
    if (!locked) heading.current?.focus({ preventScroll: true });
  }, [response.round, locked]);

  const choose = (index: number) => {
    if (locked || !current) return;
    const move = rebutPick(step, response, index);
    if (move.response === response) return;
    play(move.note?.tone === 'wrong' ? 'wrong' : 'right');
    onChange(move.response);
  };

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <section aria-label="Je opgebouwde argumentatie" className="mt-6 rounded-card border-2 border-line bg-sunken p-4 sm:p-5">
        <h2 className="font-display text-title-sm font-bold">Je voorstel met antwoorden op de bezwaren</h2>
        <ol className="mt-4 space-y-3">
          {pieces.map((piece, index) => (
            <li key={`${piece.part}-${piece.round ?? index}`} className={cn('rounded-tile border-l-4 bg-surface p-3', piece.part === 'base' ? 'border-accent' : piece.part === 'concede' ? 'border-orange' : 'border-green')}>
              <p className="text-caption font-bold text-ink-muted">{piece.part === 'base' ? 'Voorstel' : piece.part === 'concede' ? 'Wat je erkent' : 'Hoe je antwoordt'}</p>
              <p className="mt-1 text-body leading-relaxed"><RichText text={piece.t} /></p>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-5">
        <p className="mb-2 text-small font-semibold text-ink-muted">{Math.min(response.round, step.rounds.length)} van {step.rounds.length} bezwaren beantwoord</p>
        <ProgressBar value={response.round} max={step.rounds.length} label="Bezwaren beantwoord" size="sm" />
      </div>

      {previous?.ok === true && <InlineFeedback className="mt-4" tone="right" id={`answered-${response.round}`}>{previous.why}</InlineFeedback>}

      <section className="mt-5 rounded-card border-2 border-purple-line bg-purple-soft p-4 sm:p-5" aria-label={`Gesprek met ${step.speaker.name}`}>
        <div className="flex items-center gap-3">
          <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-purple font-display font-bold text-purple-on">{step.speaker.initials ?? step.speaker.name.slice(0, 1)}</span>
          <div>
            <p className="font-bold">{step.speaker.name}</p>
            {step.speaker.role && <p className="text-small text-purple-ink">{step.speaker.role}</p>}
          </div>
        </div>
        {current ? (
          <h2 ref={heading} tabIndex={-1} className="mt-4 font-serif text-lead leading-relaxed outline-none"><RichText text={current.objection} /></h2>
        ) : (
          <p className="mt-4 text-body leading-relaxed"><RichText text={step.reply} /></p>
        )}
      </section>

      {current && (
        <fieldset className="mt-6">
          <legend className="font-display text-title-sm font-bold">Welke reactie neemt dit bezwaar serieus?</legend>
          <div className="mt-3 grid gap-3">
            {orders[response.round]?.map((index) => {
              const option = current.options[index];
              if (!option) return null;
              const tried = response.tried.includes(index);
              return (
                <div key={`${response.round}-${index}`}>
                  <Tile size="block" disabled={locked || tried} state={tried ? 'wrong' : 'idle'} onClick={() => choose(index)}>
                    <MessageCircle aria-hidden className="size-5 shrink-0" />
                    <span><RichText text={option.t} /></span>
                  </Tile>
                  {tried && option.ok !== true && <InlineFeedback className="mt-2" tone="wrong" id={`${response.round}-${index}`} reserve={false}><strong>{option.trap}.</strong> {option.why}</InlineFeedback>}
                </div>
              );
            })}
          </div>
        </fieldset>
      )}

      {done && <p role="status" className="mt-5 flex items-center gap-2 font-semibold text-green-ink"><Check aria-hidden className="size-5" />Je hebt op elk bezwaar inhoudelijk gereageerd.</p>}
    </div>
  );
}
