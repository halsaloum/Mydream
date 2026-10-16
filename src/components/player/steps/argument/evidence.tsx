'use client';

import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useId } from 'react';
import { evidenceBar, evidenceChoose, evidenceFitting, evidenceStatus } from '@/engine/argument';
import { RichText } from '@/components/ui/rich-text';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { Tile } from '../../tile';
import { InlineFeedback, StepIntro, type StepProps } from '../shared';

const STATUS = {
  past: { label: 'Past bij de gegevens', tone: 'right' as const },
  stellig: { label: 'Te stellig voor deze gegevens', tone: 'wrong' as const },
  voorzichtig: { label: 'Klopt, maar kan preciezer', tone: 'info' as const },
};

/** Een bewering aanscherpen met bekende aantallen; alle keuzes leven in de opgeslagen reactie. */
export function EvidenceStep({ step, response, onChange, locked }: StepProps<'evidence'>) {
  const id = useId();
  const calm = useCalmMotion();
  const row = step.rows[response.sel];
  if (!row) return null;
  const picked = response.pick[response.sel] ?? row.start;
  const option = row.options[picked];
  if (!option) return null;
  const status = evidenceStatus(row, picked);
  const feedback = STATUS[status];
  const bar = evidenceBar(row, picked);
  const fitting = evidenceFitting(step, response);

  const select = (index: number) => {
    if (locked || index === response.sel) return;
    play('select');
    onChange({ ...response, sel: index });
  };

  const choose = (index: number) => {
    if (locked || !row.options[index]) return;
    play('select');
    onChange(evidenceChoose(response, index));
  };

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <section className="mt-6 rounded-card border-2 border-line bg-sunken p-4 sm:p-5" aria-label="Je alinea">
        <h2 className="font-display text-title-sm font-bold">Scherp elke zin aan</h2>
        <p className="mt-2 text-small text-ink-soft">Kies een zin. Zoek de sterkste formulering die door de gegeven aantallen wordt gedekt.</p>
        <ol className="mt-4 space-y-3">
          {step.rows.map((sentence, index) => {
            const selection = response.pick[index] ?? sentence.start;
            const fits = evidenceStatus(sentence, selection) === 'past';
            return (
              <li key={index}>
                <button
                  type="button"
                  aria-label={`Zin ${index + 1} bewerken`}
                  aria-pressed={response.sel === index}
                  aria-controls={`${id}-editor`}
                  disabled={locked}
                  onClick={() => select(index)}
                  className={cn(
                    'w-full touch-manipulation rounded-tile border-2 p-4 text-left outline-none transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
                    response.sel === index ? 'border-accent bg-accent-soft' : 'border-line bg-surface hover:border-accent-line',
                  )}
                >
                  <span className="mb-2 flex items-center gap-2 text-caption font-bold text-ink-muted">
                    Zin {index + 1}
                    {fits && <span className="inline-flex items-center gap-1 text-green-ink"><Check aria-hidden className="size-4" />Past</span>}
                  </span>
                  <span className="font-serif text-lead leading-relaxed text-ink">
                    <RichText text={sentence.before} />
                    <strong className="rounded-chip bg-accent-soft px-1 text-accent-ink">{sentence.options[selection]?.w}</strong>
                    <RichText text={sentence.after} />
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        {step.closing && <p className="mt-4 font-serif text-lead"><RichText text={step.closing} /></p>}
      </section>

      <section id={`${id}-editor`} aria-labelledby={`${id}-heading`} className="mt-6">
        <h2 id={`${id}-heading`} className="font-display text-title-sm font-bold">Onderzoek zin {response.sel + 1}</h2>
        <div className="mt-3 rounded-card border-2 border-blue-line bg-blue-soft p-4">
          <p className="text-caption font-bold text-blue-ink">Wat je werkelijk weet</p>
          <p className="mt-2 text-body leading-relaxed"><RichText text={row.evidence} /></p>
        </div>

        <div className="mt-5 space-y-4" aria-label="Vergelijk het bewijs met de bewering">
          <div>
            <p className="mb-2 flex justify-between gap-3 text-small font-semibold"><span>Bekend uit de gegevens</span><span>{row.known} van {row.total}</span></p>
            <div role="meter" aria-label="Bekend uit de gegevens" aria-valuemin={0} aria-valuemax={row.total} aria-valuenow={row.known} className="h-4 overflow-hidden rounded-full bg-line">
              <motion.div className="h-full rounded-full bg-blue" initial={false} animate={{ width: `${bar.known}%` }} transition={calm ? { duration: 0 } : transition.progress} />
            </div>
          </div>
          <div>
            <p className="mb-2 flex justify-between gap-3 text-small font-semibold"><span>Voor deze formulering nodig</span><span>minstens {option.need} van {row.total}</span></p>
            <div role="meter" aria-label="Voor deze formulering nodig" aria-valuemin={0} aria-valuemax={row.total} aria-valuenow={option.need} className="h-4 overflow-hidden rounded-full bg-line">
              <motion.div className={cn('h-full rounded-full', status === 'stellig' ? 'bg-red' : 'bg-green')} initial={false} animate={{ width: `${bar.promise}%` }} transition={calm ? { duration: 0 } : transition.progress} />
            </div>
          </div>
          <p className="flex justify-between text-caption text-ink-muted"><span>0</span><span>{row.max}</span></p>
        </div>

        <fieldset className="mt-5">
          <legend className="font-semibold">Hoe ver mag deze zin gaan?</legend>
          <div className="mt-3 flex flex-wrap gap-3">
            {row.options.map((candidate, index) => (
              <Tile key={candidate.w} aria-pressed={picked === index} disabled={locked} state={picked === index ? 'held' : 'idle'} onClick={() => choose(index)}>
                {candidate.w}
              </Tile>
            ))}
          </div>
        </fieldset>
        <InlineFeedback className="mt-4" tone={feedback.tone} id={`${response.sel}-${picked}`}>
          <strong>{feedback.label}.</strong> Deze zin zegt: {option.says}. {option.why}
        </InlineFeedback>
      </section>
      <p role="status" className="mt-3 text-small font-semibold text-ink-muted">{fitting} van {step.rows.length} zinnen hebben de sterkste gedekte formulering.</p>
    </div>
  );
}
