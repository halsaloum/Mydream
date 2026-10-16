'use client';

import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useId, type ReactNode } from 'react';
import { morphKey, morphWord } from '@/engine/kinds';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { InlineFeedback, StepIntro, type StepProps } from '../shared';

const SLOT_TONE = [
  { tile: 'border-purple-line bg-purple-soft text-purple-ink', active: 'border-purple bg-purple-soft text-purple-ink [--slab:var(--color-purple)]' },
  { tile: 'border-green-line bg-green-soft text-green-ink', active: 'border-green bg-green-soft text-green-ink [--slab:var(--color-green)]' },
  { tile: 'border-blue-line bg-blue-soft text-blue-ink', active: 'border-blue bg-blue-soft text-blue-ink [--slab:var(--color-blue)]' },
] as const;

export function MorphStep({ step, response, onChange, locked }: StepProps<'morph'>) {
  const calm = useCalmMotion();
  const statusId = useId();
  const combo = step.slots.map((_, i) => response.combo[i] ?? '');
  const key = morphKey(combo);
  const hit = morphWord(step, combo);
  const found = new Set(response.found);
  const word = hit?.w ?? invalidWord(step, combo);
  const note = hit?.mean ?? invalidNote(step, combo);
  const visibleParts = [
    ...step.slots.flatMap((slot, i) => (slot.side === 'before' && combo[i] ? [{ part: combo[i] ?? '', slot: i }] : [])),
    { part: step.stem, slot: -1 },
    ...step.slots.flatMap((slot, i) => (slot.side === 'after' && combo[i] ? [{ part: combo[i] ?? '', slot: i }] : [])),
  ];

  const choose = (slotIndex: number, part: string) => {
    if (locked) return;
    const nextCombo = combo.map((value, i) => (i === slotIndex ? (value === part ? '' : part) : value));
    const nextKey = morphKey(nextCombo);
    const nextFound = new Set(response.found);
    const nextHit = morphWord(step, nextCombo);
    if (nextHit) nextFound.add(nextKey);
    play(nextHit ? 'right' : 'select');
    onChange({ kind: 'morph', combo: nextCombo, found: [...nextFound] });
  };

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <section aria-describedby={statusId} className={cn('mt-6 rounded-card border-2 bg-sunken px-4 py-5 text-center sm:px-6', hit ? 'border-line' : 'border-red-line')}>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleParts.map((item) => (
              <motion.span
                layout
                key={`${item.slot}:${item.part}`}
                initial={calm ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96, transition: transition.fast }}
                transition={transition.base}
                className={cn(
                  'grid min-h-12 place-items-center rounded-control border-2 px-4 font-display text-lead font-extrabold shadow-[0_3px_0_currentColor]/15',
                  item.slot < 0 ? 'border-line-strong bg-surface text-ink' : SLOT_TONE[item.slot % SLOT_TONE.length]?.tile,
                )}
              >
                {displayPart(item.part, item.slot, step.slots[item.slot]?.side)}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
        <motion.p
          key={key}
          initial={calm ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={transition.base}
          className={cn('mt-4 overflow-wrap-anywhere font-serif text-[clamp(2.25rem,9vw,3.5rem)] leading-none', hit ? 'text-ink' : 'text-red-ink')}
          lang="nl"
        >
          {word}
        </motion.p>
        <div className="mt-4 flex min-h-9 flex-wrap justify-center gap-2">
          {['ww', 'bn', 'zn'].map((cls) => {
            const on = hit?.cls === cls;
            return (
              <span key={cls} className={cn('rounded-chip border-2 px-3 py-1 text-caption font-extrabold', on ? 'border-green-line bg-green-soft text-green-ink' : 'border-line bg-transparent text-ink-muted')}>
                {clsLabel(cls)}
              </span>
            );
          })}
        </div>
        <p id={statusId} role="status" className={cn('mx-auto mt-3 min-h-12 max-w-[48ch] text-small font-semibold leading-relaxed', hit ? 'text-ink-soft' : 'text-red-ink')}>
          {note}
        </p>
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {step.slots.map((slot, i) => (
          <fieldset key={slot.id} className="rounded-card border-2 border-line bg-surface p-3">
            <legend className="px-1 font-display text-small font-extrabold text-ink-soft">{slot.label}</legend>
            <RadioGroup value={combo[i] ?? ''} aria-label={slot.label} readOnly={locked} onValueChange={(value) => choose(i, String(value))} className="mt-2 flex flex-wrap gap-2">
              <PartRadio slotIndex={i} value="" selected={(combo[i] ?? '') === ''} locked={locked} onPick={() => choose(i, '')}>
                geen
              </PartRadio>
              {slot.parts.map((part) => (
                <PartRadio key={part} slotIndex={i} value={part} selected={combo[i] === part} locked={locked} onPick={() => choose(i, part)}>
                  {displayPart(part, i, slot.side)}
                </PartRadio>
              ))}
            </RadioGroup>
          </fieldset>
        ))}
      </div>

      <InlineFeedback tone={hit ? 'right' : 'wrong'} id={key} className="mt-4">
        {hit ? `${hit.w}: ${hit.mean}` : note}
      </InlineFeedback>

      <div className="mt-5">
        <p className="font-display text-caption font-extrabold tracking-[0.08em] text-ink-muted uppercase">Gevonden: {found.size} van {step.words.length}</p>
        <div className="mt-2 flex min-h-20 flex-wrap content-start gap-2">
          {step.words.map((entry) => {
            const entryKey = morphKey(entry.combo);
            const ok = found.has(entryKey);
            const current = entryKey === key;
            return (
              <span key={entryKey} className={cn('rounded-control border-2 px-3 py-1.5 font-serif text-[1.0625rem]', ok ? 'border-line bg-surface text-ink' : 'border-dashed border-line text-ink-muted', current && 'border-green-line bg-green-soft text-green-ink')}>
                {ok ? entry.w : '· · ·'}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PartRadio({ slotIndex, value, selected, locked, onPick, children }: { slotIndex: number; value: string; selected: boolean; locked: boolean; onPick: () => void; children: ReactNode }) {
  return (
    <Radio.Root
      value={value}
      disabled={locked}
      onClick={(event) => {
        event.preventDefault();
        onPick();
      }}
      className={cn(
        'slab pressable min-h-11 rounded-control border-2 px-3 font-display text-small font-extrabold [--lift:3px]',
        selected ? SLOT_TONE[slotIndex % SLOT_TONE.length]?.active : 'border-line bg-surface text-ink [--slab:var(--color-line-strong)] hover:border-line-strong',
        locked && 'pointer-events-none opacity-80',
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        {selected && <Check aria-hidden className="size-3.5" strokeWidth={3.5} />}
        {children}
      </span>
    </Radio.Root>
  );
}

function displayPart(part: string, slot: number, side?: 'before' | 'after') {
  if (!part) return 'geen';
  if (slot < 0) return part;
  return side === 'before' ? `${part}-` : `-${part}`;
}

function clsLabel(cls: string) {
  if (cls === 'ww') return 'werkwoord';
  if (cls === 'bn') return 'bijvoeglijk naamwoord';
  if (cls === 'zn') return 'zelfstandig naamwoord';
  return cls;
}

function invalidWord(step: StepProps<'morph'>['step'], combo: string[]) {
  const before = step.slots.map((slot, i) => (slot.side === 'before' ? combo[i] ?? '' : '')).join('');
  const after = step.slots.map((slot, i) => (slot.side === 'after' ? combo[i] ?? '' : '')).filter(Boolean);
  const firstAfter = after[0] ?? '';
  const base = step.forms?.[firstAfter] ?? `${step.stem}${firstAfter}`;
  return `*${before}${base}${after.slice(1).join('')}`;
}

function invalidNote(step: StepProps<'morph'>['step'], combo: string[]) {
  const specific = step.hints?.find((hint) => combo.includes(hint.part));
  return specific?.note ?? 'Dit woord bestaat niet. Probeer een andere combinatie.';
}
