'use client';

import Image from 'next/image';
import { Check, Eye, Link2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { Tile } from '../../tile';
import { InlineFeedback, Stage, StepIntro, type StepProps } from '../shared';

type Feedback = { id: string; tone: 'right' | 'wrong' | 'info'; text: string };

export function AmbiguityStep({ step, response, onChange, locked }: StepProps<'ambiguity'>) {
  const calm = useCalmMotion();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [bad, setBad] = useState<number | null>(null);
  const selected = step.meanings.find((meaning) => meaning.id === response.selected) ?? step.meanings[0];
  const used = new Set(Object.values(response.solved));

  const chooseMeaning = (id: string) => {
    if (locked) return;
    play('select');
    onChange({ ...response, selected: id });
    setFeedback(null);
  };

  const chooseOption = (index: number) => {
    if (locked || !selected || response.solved[selected.id] !== undefined || used.has(index)) return;
    const option = step.options[index];
    if (!option) return;
    const ok = option.fits === selected.id;
    if (ok) {
      const solved = { ...response.solved, [selected.id]: index };
      const nextOpen = step.meanings.find((meaning) => solved[meaning.id] === undefined)?.id ?? selected.id;
      play('right');
      onChange({ ...response, selected: nextOpen, solved });
      setFeedback({
        id: `right-${selected.id}-${Object.keys(solved).length}`,
        tone: 'right',
        text: `${selected.right}${step.meanings.some((meaning) => solved[meaning.id] === undefined) ? ' Kies nu het andere plaatje.' : ''}`,
      });
      return;
    }
    play('wrong');
    setBad(index);
    window.setTimeout(() => setBad((value) => (value === index ? null : value)), 450);
    onChange({ ...response, mistakes: response.mistakes + 1 });
    setFeedback({ id: `wrong-${selected.id}-${index}-${response.mistakes + 1}`, tone: 'wrong', text: option.fits ? 'Die zin past alleen bij het andere plaatje.' : (option.note ?? '') });
  };

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <Stage className="mt-6 overflow-hidden">
        <p className="font-serif text-example text-ink" lang="nl">
          {renderSentence(step.sentence, selected?.highlight ?? [])}
        </p>
      </Stage>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {step.meanings.map((meaning, i) => {
          const solvedIndex = response.solved[meaning.id];
          const isSelected = selected?.id === meaning.id;
          const accent = i === 0 ? 'blue' : 'orange';
          return (
            <button
              key={meaning.id}
              type="button"
              aria-pressed={isSelected}
              disabled={locked}
              onClick={() => chooseMeaning(meaning.id)}
              data-accent={accent}
              className={cn(
                'group touch-manipulation rounded-card border-2 bg-surface p-3 text-left outline-none transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
                isSelected ? 'border-accent bg-accent-soft shadow-slab [--slab:var(--accent-deep)]' : 'border-line hover:border-accent-line',
                solvedIndex !== undefined && 'border-green-line bg-green-soft',
              )}
            >
              <div className="relative overflow-hidden rounded-tile border-2 border-white bg-white shadow-[inset_0_0_0_1px_rgb(16_24_40/0.04)]">
                {meaning.image ? (
                  <Image src={meaning.image.src} alt={meaning.image.alt} width={640} height={360} className="aspect-[16/9] w-full object-cover" />
                ) : (
                  <div className="grid aspect-[16/9] place-items-center text-accent-ink"><Eye aria-hidden className="size-12" /></div>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className={cn('grid size-8 place-items-center rounded-chip font-display font-extrabold', solvedIndex !== undefined ? 'bg-green text-green-on' : 'bg-accent text-accent-on')}>
                  {solvedIndex !== undefined ? <Check aria-hidden className="size-5" strokeWidth={3} /> : meaning.id}
                </span>
                <span className="font-display text-body font-bold text-ink">{meaning.label}</span>
              </div>
              {solvedIndex !== undefined && <p className="mt-2 text-small font-semibold text-green-ink">Zin gevonden: {step.options[solvedIndex]?.t}</p>}
            </button>
          );
        })}
      </div>

      <section className="mt-6" aria-label="Zinsvarianten">
        <h2 className="font-display text-title-sm font-extrabold text-ink">Welke zin kan alleen dit plaatje betekenen?</h2>
        <div className="mt-3 grid gap-3">
          {step.options.map((option, index) => {
            const optionUsed = used.has(index);
            const correctForSelected = selected && response.solved[selected.id] === index;
            return (
              <motion.div key={option.t} animate={bad === index && !calm ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }} transition={transition.fast}>
                <Tile
                  size="block"
                  disabled={locked || optionUsed || !selected || response.solved[selected.id] !== undefined}
                  onClick={() => chooseOption(index)}
                  state={correctForSelected || optionUsed ? 'correct' : bad === index ? 'wrong' : 'idle'}
                >
                  <Link2 aria-hidden className="size-5 shrink-0" strokeWidth={2.75} />
                  <span>{option.t}</span>
                </Tile>
              </motion.div>
            );
          })}
        </div>
      </section>

      <InlineFeedback className="mt-4" tone={feedback?.tone ?? 'info'} id={feedback?.id}>
        {feedback?.text}
      </InlineFeedback>
    </div>
  );
}

function renderSentence(sentence: string, highlights: readonly string[]) {
  const parts: React.ReactNode[] = [sentence];
  highlights.forEach((highlight) => {
    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];
      if (typeof part !== 'string') continue;
      const at = part.indexOf(highlight);
      if (at < 0) continue;
      parts.splice(
        i,
        1,
        part.slice(0, at),
        <AnimatePresence key={`${highlight}-${i}`} initial={false}>
          <motion.mark
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={transition.base}
            className="rounded-chip bg-accent-soft px-1.5 text-accent-ink"
          >
            {highlight}
          </motion.mark>
        </AnimatePresence>,
        part.slice(at + highlight.length),
      );
      break;
    }
  });
  return parts;
}
