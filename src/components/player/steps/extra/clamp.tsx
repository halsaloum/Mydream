'use client';

import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { MoveHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { clampCount } from '@/engine/kinds';
import { cn } from '@/lib/cn';
import { spring } from '@/lib/motion';
import { play } from '@/lib/sound';
import { InlineFeedback, Stage, StepIntro, type StepProps } from '../shared';

type Pos = 'front' | 'mid' | 'after';
const OPTIONS: { value: Pos; label: string }[] = [
  { value: 'front', label: 'vooraan' },
  { value: 'mid', label: 'in de tang' },
  { value: 'after', label: 'achteraan' },
];

const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export function ClampStep({ step, response, onChange, locked }: StepProps<'clamp'>) {
  const initial = `Tussen ${step.finite} en ${step.participle} staan nu ${clampCount(step, response.pos)} woorden.`;
  const [message, setMessage] = useState(initial);
  const count = clampCount(step, response.pos);
  const goal = step.goal >= 3 ? step.goal : 8;
  const over = Math.max(0, count - goal);
  const level = count <= goal ? 'ok' : count <= goal + 3 ? 'mid' : 'bad';
  const meter = {
    ok: { text: 'prettig te lezen', accent: 'green' },
    mid: { text: 'het kan nog korter', accent: 'orange' },
    bad: { text: 'te lang', accent: 'red' },
  }[level];

  const move = (id: string, where: Pos) => {
    if (locked || response.pos[id] === where) return;
    const part = step.parts.find((p) => p.id === id);
    if (!part) return;
    const pos = { ...response.pos };
    let msg = '';
    if (where === 'front') {
      const other = step.parts.find((p) => pos[p.id] === 'front' && p.id !== id);
      if (other) {
        pos[other.id] = 'mid';
        msg = `Vooraan past maar één zinsdeel, dus ‘${other.t}’ gaat terug de tang in. `;
      }
      msg += `Het onderwerp springt nu achter ${step.finite} en telt mee in de tang.`;
    } else if (where === 'after') {
      msg = part.note ?? 'Een voorzetselgroep mag achter het laatste werkwoord staan. De tang wordt korter.';
    } else {
      msg = response.pos[id] === 'front' ? 'Terug in de tang. Het onderwerp staat weer vooraan.' : 'Terug in de tang.';
    }
    pos[id] = where;
    play(where === 'mid' ? 'remove' : 'place');
    setMessage(msg);
    onChange({ kind: 'clamp', pos });
  };

  const front = step.parts.find((part) => response.pos[part.id] === 'front');
  const chips: { id: string; text: string; kind: 'out' | 'jaw' | 'mid' }[] = [];
  chips.push({ id: 'front-subject', text: front ? cap(front.t) : cap(step.subject), kind: 'out' });
  chips.push({ id: 'finite', text: step.finite, kind: 'jaw' });
  if (front) chips.push({ id: 'subject-in-clamp', text: step.subject, kind: 'mid' });
  for (const item of step.middle) {
    if ('text' in item) chips.push({ id: `text-${item.text}`, text: item.text, kind: 'mid' });
    else if ((response.pos[item.part] ?? 'mid') === 'mid') chips.push({ id: `part-${item.part}`, text: step.parts.find((part) => part.id === item.part)?.t ?? '', kind: 'mid' });
  }
  chips.push({ id: 'participle', text: step.participle, kind: 'jaw' });
  for (const part of step.parts) if (response.pos[part.id] === 'after') chips.push({ id: `after-${part.id}`, text: part.t, kind: 'out' });

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <Stage className="mt-6">
        <motion.div layout className="flex flex-wrap items-center gap-2" transition={spring.layout}>
          {chips.map((chip, index) => (
            <motion.span
              layout
              key={chip.id}
              transition={spring.layout}
              className={cn(
                'rounded-chip border-2 px-3 py-1.5 font-serif text-[1.3125rem] leading-snug',
                chip.kind === 'jaw' && 'border-blue-deep bg-blue-ink font-semibold text-white shadow-[0_3px_0_var(--color-blue-deep)]',
                chip.kind === 'mid' && 'border-blue-line bg-blue-soft text-ink',
                chip.kind === 'out' && 'border-line bg-surface text-ink',
              )}
            >
              {chip.text}
              {index === chips.length - 1 ? '.' : ''}
            </motion.span>
          ))}
        </motion.div>
      </Stage>

      <section aria-label="Tangmeter" data-accent={meter.accent} className="mt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-display text-title-sm font-extrabold text-accent-ink">{count} woorden in de tang</p>
          <p className="text-small font-extrabold text-accent-ink">{meter.text}</p>
        </div>
        <div className="relative mt-2 h-4 rounded-chip bg-line shadow-[inset_0_2px_0_rgb(0_0_0/0.06)]">
          <motion.div className="h-full rounded-chip bg-accent shadow-[inset_0_-3px_0_rgb(0_0_0/0.16)]" animate={{ width: `${Math.min(100, (count / 14) * 100)}%` }} transition={{ duration: 0.28 }} />
          <span aria-hidden className="absolute top-[-0.25rem] bottom-[-0.25rem] w-1 rounded bg-ink" style={{ left: `${Math.min(100, (goal / 14) * 100)}%` }} />
        </div>
        <p className="mt-1 text-caption font-extrabold text-ink-muted">doel: {goal} woorden{over > 0 ? '' : ' · gehaald'}</p>
      </section>

      <div className="mt-5 space-y-3">
        {step.parts.map((part) => {
          const value = response.pos[part.id] ?? 'mid';
          return (
            <section key={part.id} className="grid gap-2 rounded-card border-2 border-line bg-surface p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <h2 className="font-serif text-[1.1875rem] leading-snug text-ink">{part.t}</h2>
              <RadioGroup aria-label={`Plaats van ${part.t}`} value={value} onValueChange={(next) => move(part.id, next as Pos)} readOnly={locked} className="flex rounded-control bg-sunken p-1">
                {OPTIONS.map((option) => {
                  const allowed = option.value === 'mid' || (option.value === 'front' ? part.front : part.after);
                  return (
                    <Radio.Root
                      key={option.value}
                      value={option.value}
                      disabled={locked || !allowed}
                      className={cn('grid min-h-11 min-w-24 place-items-center rounded-[0.65rem] px-2 text-center text-caption font-extrabold outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus data-[checked]:bg-surface data-[checked]:text-blue-ink data-[checked]:shadow-slab-sm data-[disabled]:text-ink-disabled', !allowed && 'opacity-45')}
                    >
                      {option.label}
                    </Radio.Root>
                  );
                })}
              </RadioGroup>
            </section>
          );
        })}
      </div>

      <InlineFeedback tone="info" id={message} className="mt-4">
        <span className="flex items-center gap-2"><MoveHorizontal aria-hidden className="size-4" /> {message}</span>
      </InlineFeedback>
    </div>
  );
}
