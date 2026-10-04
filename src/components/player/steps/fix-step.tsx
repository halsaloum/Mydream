'use client';

import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { AnimatePresence, motion } from 'motion/react';
import { useId } from 'react';
import { tokenize } from '@/content/text';
import { TextField } from '@/components/ui/field';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { Hint, Kbd, Stage, StepHeading, type StepProps } from './shared';

const bare = (token: string) => token.replace(/[.,!?;:]+$/, '');

/** Fout aanwijzen en verbeteren. De woorden vormen één keuzegroep (pijltjes), daarna een invulveld. */
export function FixStep({ step, response, onChange, locked, correct, onSubmit }: StepProps<'fix'>) {
  const calm = useCalmMotion();
  const headingId = useId();
  const tokens = tokenize(step.sentence);
  const picked = response.index;

  return (
    <div>
      <StepHeading>
        <span id={headingId}>{step.prompt}</span>
      </StepHeading>
      <Stage className="mt-6">
        <RadioGroup
          aria-labelledby={headingId}
          value={picked === null ? '' : String(picked)}
          onValueChange={(value) => {
            play('select');
            onChange({ kind: 'fix', index: Number(value), value: '' });
          }}
          readOnly={locked}
          className="flex flex-wrap gap-x-1 gap-y-2 font-serif text-example leading-snug text-ink"
          lang="nl"
        >
          {tokens.map((token, i) => {
            const isPicked = picked === i;
            const reveal = locked && i === step.wrong && !correct;
            return (
              <Radio.Root
                key={i}
                value={String(i)}
                className={cn(
                  'rounded-control border-2 border-transparent px-1.5 transition-colors duration-150',
                  !locked && 'hover:border-line hover:bg-surface',
                  isPicked && !locked && 'border-red-line bg-red-soft text-red-ink line-through decoration-[3px]',
                  isPicked && locked && correct && 'border-green-line bg-green-soft text-green-ink line-through decoration-[3px]',
                  isPicked && locked && !correct && 'border-red-line bg-red-soft text-red-ink line-through decoration-[3px]',
                  reveal && 'border-yellow-line bg-yellow-soft text-yellow-ink',
                  locked && 'pointer-events-none',
                )}
              >
                {token}
                {reveal && <span className="sr-only"> (dit woord was fout)</span>}
              </Radio.Root>
            );
          })}
        </RadioGroup>
      </Stage>

      <div className="mt-6 min-h-[6.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          {picked === null ? (
            <motion.div key="hint" initial={calm ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition.fast}>
              <Hint>Tik op het woord dat fout is. Met de pijltjes kies je ook een woord.</Hint>
            </motion.div>
          ) : (
            <motion.div
              key={`fix-${picked}`}
              initial={calm ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={transition.base}
              className="max-w-md"
            >
              <TextField
                label={`Verbetering van "${bare(tokens[picked] ?? '')}"`}
                value={response.value}
                onChange={(value) => onChange({ kind: 'fix', index: picked, value })}
                placeholder={bare(tokens[picked] ?? '')}
                disabled={locked}
                autoFocus
                inputClassName="font-serif text-[1.5rem] text-green-ink"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    onSubmit();
                  }
                }}
                description={
                  !locked ? (
                    <span className="inline-flex items-center gap-1.5">
                      Typ het goede woord en druk op <Kbd>Enter</Kbd>.
                    </span>
                  ) : undefined
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
