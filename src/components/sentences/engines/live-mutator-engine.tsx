'use client';

import { ArrowDown, ArrowRight, ArrowUp, Shuffle } from 'lucide-react';
import { motion } from 'motion/react';
import type { MutatorExercise, MutatorVariant } from '@/content/sentences/types';
import { Button } from '@/components/ui/button';
import { shuffledIndices } from '@/engine/hash';
import { cn } from '@/lib/cn';
import { spring, useCalmMotion } from '@/lib/motion';
import type { SentenceEngineProps } from './shared';

function scrambled(exerciseId: string, variant: MutatorVariant) {
  return shuffledIndices(`${exerciseId}:${variant.id}:reconstruct`, variant.order.length).map((index) => variant.order[index]!);
}

export function LiveMutatorEngine({ exercise, answer, onChange, disabled = false }: SentenceEngineProps & { exercise: MutatorExercise }) {
  const calm = useCalmMotion();
  const variant = exercise.variants.find((item) => item.id === answer.variant);
  const order = variant ? (answer.order.length ? answer.order : scrambled(exercise.id, variant)) : [];
  const byId = new Map(variant?.blocks.map((block) => [block.id, block]) ?? []);
  const selectVariant = (next: MutatorVariant) => {
    if (disabled || answer.variant === next.id) return;
    onChange({ variant: next.id, order: scrambled(exercise.id, next), text: '' });
  };
  const move = (index: number, offset: number) => {
    if (disabled) return;
    const target = index + offset;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target]!, next[index]!];
    onChange({ order: next });
  };
  return <div className="space-y-5">
    <div className="rounded-card border border-line bg-sunken p-5"><p className="text-caption font-bold text-ink-muted">Vertrekzin</p><p className="mt-2 font-serif text-lead leading-relaxed">{exercise.original}</p></div>
    <fieldset disabled={disabled}><legend className="mb-3 font-display font-bold">Welke bewerking ga je uitvoeren?</legend><div className="flex flex-wrap gap-2">
      {exercise.variants.map((item) => <Button key={item.id} variant={answer.variant === item.id ? 'accent' : 'secondary'} aria-pressed={answer.variant === item.id} disabled={disabled} onClick={() => selectVariant(item)}>{item.label}</Button>)}
    </div></fieldset>
    {variant ? <section aria-label="Bouw je veranderde zin" className="space-y-4">
      <p className="text-small leading-relaxed text-ink-muted">{variant.note} De blokken staan door elkaar. Verschuif ze om zelf de nieuwe zin te maken.</p>
      <ol className="space-y-2">
        {order.map((id, index) => {
          const block = byId.get(id); if (!block) return null;
          return <motion.li key={`${variant.id}:${id}`} layout={!calm} transition={calm ? { duration: 0 } : spring.layout} className="flex flex-wrap items-center gap-2 rounded-control border-2 border-line bg-surface p-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-blue-soft text-caption font-bold text-blue-ink">{index + 1}</span>
            <div className="min-w-0 flex-1"><p className="font-serif text-lead">{block.text}</p>{exercise.support === 'volledig' && block.role && <p className="text-caption text-ink-muted">{block.role}</p>}</div>
            <div className="flex gap-1">
              <button type="button" disabled={disabled || index === 0} aria-label={`${block.text} naar voren`} onClick={() => move(index, -1)} className="grid min-h-11 min-w-11 place-items-center rounded-control border border-line hover:bg-sunken disabled:opacity-30"><ArrowUp aria-hidden className="size-4" /></button>
              <button type="button" disabled={disabled || index === order.length - 1} aria-label={`${block.text} naar achteren`} onClick={() => move(index, 1)} className="grid min-h-11 min-w-11 place-items-center rounded-control border border-line hover:bg-sunken disabled:opacity-30"><ArrowDown aria-hidden className="size-4" /></button>
            </div>
          </motion.li>;
        })}
      </ol>
      <div className="rounded-card border border-blue-line bg-blue-soft p-4" aria-live="polite"><p className="flex items-center gap-2 text-caption font-bold text-blue-ink"><ArrowRight aria-hidden className="size-4" />Jouw zin verandert direct</p>
        <motion.p key={answer.variant} initial={calm ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: calm ? 0 : 0.18 }} className="mt-2 font-serif text-lead leading-relaxed">{order.map((id) => byId.get(id)?.text).join(' ')}</motion.p>
        <p className="mt-2 text-caption text-ink-muted">Dit is je eigen reconstructie; zij is nog niet beoordeeld.</p>
      </div>
      <Button variant="ghost" size="sm" disabled={disabled} onClick={() => onChange({ order: scrambled(exercise.id, variant) })}><Shuffle aria-hidden className="size-4" />Terug naar de startvolgorde</Button>
    </section> : <p className={cn('rounded-control border border-dashed border-line p-5 text-small text-ink-muted')}>Kies eerst een bewerking. Daarna krijg je losse blokken om haar uit te voeren.</p>}
  </div>;
}
