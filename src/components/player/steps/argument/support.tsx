'use client';

import { Check, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { supportBlocks, supportPick, type Note } from '@/engine/argument';
import { permutation } from '@/engine/hash';
import { cn } from '@/lib/cn';
import { play } from '@/lib/sound';
import { InlineFeedback, StepIntro, type StepProps } from '../shared';

/** Vraag voor vraag onderbouwen; een onjuist antwoord wordt niet aan de redenering toegevoegd. */
export function SupportStep({ step, response, onChange, locked, seed }: StepProps<'support'>) {
  const [note, setNote] = useState<Note | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousLevel = useRef(response.level);
  const orders = useMemo(() => step.levels.map((level, i) => permutation(`${seed}:support:${i}`, level.options.length)), [seed, step.levels]);
  const blocks = supportBlocks(step, response.level);
  const level = step.levels[response.level];
  const done = response.level >= step.levels.length;
  const lastTried = level?.options[response.tried.at(-1) ?? -1];
  const feedback = note ?? (lastTried && lastTried.ok !== true ? { tone: 'wrong' as const, text: lastTried.why } : null);

  useEffect(() => {
    if (previousLevel.current !== response.level) heading.current?.focus();
    previousLevel.current = response.level;
  }, [response.level]);

  const pick = (index: number) => {
    if (locked || done || response.tried.includes(index)) return;
    const move = supportPick(step, response, index);
    setNote(move.note);
    if (move.note) play(move.note.tone === 'wrong' ? 'wrong' : 'right');
    onChange(move.response);
  };

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <ol aria-label="Opgebouwde redenering" className="mt-6 space-y-3">
        {blocks.map((block, i) => (
          <li key={i} className={cn('rounded-card border-2 p-4', i === 0 ? 'border-accent-line bg-accent-soft' : 'border-line bg-sunken')}>
            <p className="flex items-center gap-2 text-caption font-bold text-accent-ink">
              {i > 0 && <Check aria-hidden className="size-4" />}
              {block.role}
            </p>
            <p className="mt-1 font-serif text-lead leading-relaxed text-ink">{block.t}</p>
          </li>
        ))}
      </ol>

      <InlineFeedback className="mt-4" tone={feedback?.tone ?? 'info'} id={`${response.level}:${response.mistakes}`}>
        {feedback?.text ?? (done ? 'Je hebt elke vraag beantwoord en de onderbouwing opgebouwd.' : 'Kies het antwoord dat deze vraag echt beantwoordt. Lees bij een misser waarom het antwoord niet past en probeer opnieuw.')}
      </InlineFeedback>

      {level && !done && (
        <section className="mt-5" aria-label={`Onderbouwing vraag ${response.level + 1}`}>
          <p className="text-caption font-bold text-accent-ink">Vraag {response.level + 1} van {step.levels.length}</p>
          <h2 ref={heading} tabIndex={-1} className="mt-1 font-display text-title-sm font-bold outline-none">{level.ask}</h2>
          <div className="mt-3 grid gap-3">
            {orders[response.level]?.map((index) => {
              const option = level.options[index]!;
              const tried = response.tried.includes(index);
              return (
                <button
                  key={`${response.level}:${index}`}
                  type="button"
                  disabled={locked || tried}
                  onClick={() => pick(index)}
                  className={cn('min-h-14 rounded-tile border-2 px-4 py-3 text-left outline-none transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus', tried ? 'border-red-line bg-red-soft text-red-ink' : 'border-line bg-surface text-ink shadow-slab-sm enabled:hover:border-accent-line', locked && 'opacity-75')}
                >
                  <span className="block font-serif text-lead leading-snug">{option.t}</span>
                  {tried && option.ok !== true && <span className="mt-2 flex items-center gap-2 text-small font-semibold"><X aria-hidden className="size-4" />{option.trap} — probeer een ander antwoord</span>}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {done && (
        <section className="mt-5 rounded-card border-2 border-green-line bg-green-soft p-4" aria-label="Afgeronde onderbouwing">
          <h2 ref={heading} tabIndex={-1} className="font-display text-title-sm font-bold text-green-ink outline-none">Je onderbouwing is opgebouwd</h2>
          <p className="mt-2 font-serif text-lead leading-relaxed text-ink">{step.paragraph ?? blocks.map((block) => block.t).join(' ')}</p>
          <p className="mt-3 text-small text-ink-soft">Je ziet nu hoe het standpunt, de redenen en hun onderbouwing met elkaar samenhangen.</p>
        </section>
      )}
    </div>
  );
}
