'use client';

import { ArrowDown, Check, Link2, Unlink } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { slopeJudge, slopePick, type Note } from '@/engine/argument';
import { permutation } from '@/engine/hash';
import { cn } from '@/lib/cn';
import { play } from '@/lib/sound';
import { Tile } from '../../tile';
import { InlineFeedback, Stage, StepIntro, type StepProps } from '../shared';

/** Elke overgang wordt afzonderlijk onderzocht; pas daarna volgt de eerlijke herformulering. */
export function SlopeStep({ step, response, onChange, locked, seed }: StepProps<'slope'>) {
  const [note, setNote] = useState<Note | null>(null);
  const order = useMemo(() => permutation(`${seed}:slope`, step.options.length), [seed, step.options.length]);
  const link = step.links[response.judged];
  const allJudged = response.judged >= step.links.length;

  const judge = (holds: boolean) => {
    if (locked || response.honest || !link) return;
    const move = slopeJudge(step, response, holds);
    onChange(move.response);
    setNote(move.note);
    if (move.note) play(move.note.tone === 'wrong' ? 'wrong' : 'right');
  };

  const repair = (index: number) => {
    if (locked || response.honest || !allJudged || response.tried.includes(index)) return;
    const move = slopePick(step, response, index);
    onChange(move.response);
    setNote(move.note);
    if (move.note) play(move.note.tone === 'wrong' ? 'wrong' : 'right');
  };

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />
      <section aria-label="De redenering stap voor stap" className="mt-6">
        <h2 className="font-display text-title-sm font-extrabold text-ink">Onderzoek elke schakel</h2>
        <p className="mt-2 text-small text-ink-soft">Een aannemelijk begin bewijst nog niet dat alle volgende gevolgen zullen optreden.</p>
        <ol className="mt-4 space-y-3">
          {step.steps.map((text, index) => {
            const prior = index > 0 ? step.links[index - 1] : undefined;
            const judged = index > 0 && index <= response.judged;
            return (
              <li key={index}>
                {prior && (
                  <div className="mb-2 ml-4 flex items-start gap-2 text-small">
                    <ArrowDown aria-hidden className="mt-0.5 size-5 shrink-0 text-ink-muted" />
                    {judged ? (
                      <div className={prior.holds ? 'text-green-ink' : 'text-orange-ink'}>
                        <p className="font-bold">{prior.holds ? 'Deze stap volgt.' : 'Deze stap volgt niet vanzelf.'}</p>
                        <p className="mt-1 text-ink-soft">{prior.why}</p>
                      </div>
                    ) : <span className="text-ink-muted">Nog te beoordelen</span>}
                  </div>
                )}
                <div className={cn('flex gap-3 rounded-control border-2 p-4', index === response.judged && !allJudged ? 'border-accent bg-accent-soft' : 'border-line bg-surface')}>
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sunken font-display text-small font-bold text-ink-soft">{index + 1}</span>
                  <p className="font-serif text-example text-ink">{text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {!allJudged && link && (
        <section className="mt-6" aria-label="Schakel beoordelen">
          <h2 className="font-display text-title-sm font-extrabold text-ink">Schakel {response.judged + 1} van {step.links.length}</h2>
          {response.judged > 0 && step.links.slice(0, response.judged).some((item) => !item.holds) && (
            <p className="mt-2 text-small text-ink-soft">Stel voor deze vraag dat de vorige stap toch gebeurt. Volgt de volgende stap daar dan uit?</p>
          )}
          <Stage className="mt-3">
            <p className="font-serif text-example text-ink">{step.steps[response.judged]}</p>
            <ArrowDown aria-hidden className="my-3 size-6 text-ink-muted" />
            <p className="font-serif text-example text-ink">{step.steps[response.judged + 1]}</p>
          </Stage>
          <p className="mt-3 text-body font-semibold text-ink">Volgt de tweede stap uit de eerste, op basis van de gegeven informatie?</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Button variant="secondary" size="lg" disabled={locked} onClick={() => judge(true)}>
              <Link2 aria-hidden className="size-5" /> Volgt wel
            </Button>
            <Button variant="secondary" size="lg" disabled={locked} onClick={() => judge(false)}>
              <Unlink aria-hidden className="size-5" /> Volgt niet vanzelf
            </Button>
          </div>
        </section>
      )}

      {allJudged && (
        <section className="mt-6" aria-label="De redenering herstellen">
          <h2 className="font-display text-title-sm font-extrabold text-ink">Kies een eerlijke herformulering</h2>
          <p className="mt-2 text-body text-ink-soft">{step.summary}</p>
          <div className="mt-4 grid gap-3">
            {order.map((index) => {
              const option = step.options[index]!;
              const wrong = response.tried.includes(index);
              const correct = response.honest && option.ok === true;
              return (
                <div key={index}>
                  <Tile size="block" disabled={locked || response.honest || wrong} state={correct ? 'correct' : wrong ? 'wrong' : 'idle'} onClick={() => repair(index)}>
                    {correct && <Check aria-hidden className="size-5 shrink-0" />}
                    <span>{correct && option.ok === true ? option.segs.map((segment, i) => <span key={i} className={segment.hi ? 'rounded-chip bg-green-soft font-bold' : undefined}>{segment.t}</span>) : option.t}</span>
                  </Tile>
                  {(wrong || correct) && <p className="mt-2 px-2 text-small text-ink-soft">{wrong && 'trap' in option && <strong>{option.trap}: </strong>}{option.why}</p>}
                </div>
              );
            })}
          </div>
        </section>
      )}
      <InlineFeedback className="mt-4" tone={note?.tone ?? 'info'} id={`${response.judged}:${response.mistakes}:${response.honest}`}>
        {note?.text}
      </InlineFeedback>
      {response.honest && <p role="status" className="mt-3 font-display font-bold text-green-ink">Alle schakels onderzocht en de redenering hersteld.</p>}
    </div>
  );
}
