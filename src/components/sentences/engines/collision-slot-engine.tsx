'use client';

import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import type { SlotExercise } from '@/content/sentences/types';
import { Button } from '@/components/ui/button';
import { shuffle } from '@/engine/hash';
import { cn } from '@/lib/cn';
import { spring, useCalmMotion } from '@/lib/motion';
import type { SentenceEngineProps } from './shared';

type Props = SentenceEngineProps & { exercise: SlotExercise };

export function CollisionSlotEngine({ exercise, answer, onChange, disabled = false }: Props) {
  const calm = useCalmMotion();
  const [selected, setSelected] = useState('');
  const [notice, setNotice] = useState('');
  const focusAfterMove = useRef('');
  const placements = Object.keys(answer.placements).length ? answer.placements : exercise.initial;
  const byId = new Map(exercise.blocks.map((block) => [block.id, block]));
  const used = Object.values(placements).flat();
  const loose = shuffle(`${exercise.id}:tray`, exercise.blocks.filter((block) => !used.includes(block.id)));

  useEffect(() => {
    if (!focusAfterMove.current) return;
    document.getElementById(`${exercise.id}-block-${focusAfterMove.current}`)?.focus();
    focusAfterMove.current = '';
  }, [exercise.id, placements]);

  const place = (blockId: string, slotId: string) => {
    if (disabled || !byId.has(blockId)) return;
    const slot = exercise.slots.find((item) => item.id === slotId);
    if (!slot) return;
    const next = Object.fromEntries(exercise.slots.map((item) => [item.id, (placements[item.id] ?? []).filter((id) => id !== blockId)]));
    const displaced = slot.capacity === 1 ? [...(next[slotId] ?? [])] : [];
    if (slot.capacity && slot.capacity !== 1 && (next[slotId]?.length ?? 0) >= slot.capacity) {
      setNotice('Deze plek is vol. Verplaats eerst een blok.'); return;
    }
    if (slot.capacity === 1) next[slotId] = [];
    next[slotId] = [...(next[slotId] ?? []), blockId];
    const collision = exercise.collision;
    if (displaced.length && collision && slotId === collision.front) {
      const middle = [...displaced, ...(next[collision.middle] ?? [])];
      next[collision.middle] = middle;
      if (blockId !== collision.subject && middle.includes(collision.subject)) {
        next[collision.middle] = [collision.subject, ...middle.filter((id) => id !== collision.subject)];
      }
      setNotice(`${byId.get(blockId)?.text} staat nu vooraan. ${displaced.map((id) => byId.get(id)?.text).join(' ')} schuift naar het midden; kijk wat dit met het onderwerp doet.`);
    } else if (displaced.length) {
      setNotice('Het vorige blok ligt weer bij de losse blokken.');
    } else setNotice(`${byId.get(blockId)?.text} is verplaatst.`);
    focusAfterMove.current = blockId;
    setSelected('');
    onChange({ placements: next });
  };

  const moveWithin = (slotId: string, blockId: string, delta: number) => {
    if (disabled) return;
    const items = [...(placements[slotId] ?? [])];
    const index = items.indexOf(blockId), target = index + delta;
    if (index < 0 || target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target]!, items[index]!];
    onChange({ placements: { ...placements, [slotId]: items } });
    setNotice('De volgorde binnen dit zinsdeel is aangepast.');
  };

  const card = (blockId: string, slotId?: string, index = 0) => {
    const block = byId.get(blockId); if (!block) return null;
    const items = slotId ? placements[slotId] ?? [] : [];
    return <motion.div key={blockId} layout={!calm} layoutId={`${exercise.id}:${blockId}`} transition={calm ? { duration: 0 } : spring.layout}
      className={cn('rounded-control border-2 bg-surface p-2', selected === blockId ? 'border-blue-ink' : 'border-line')}>
      <button id={`${exercise.id}-block-${blockId}`} type="button" draggable={!disabled} disabled={disabled} aria-pressed={selected === blockId}
        aria-label={`Kies blok ${block.text}`} onClick={() => setSelected(selected === blockId ? '' : blockId)}
        onDragStart={(event) => { event.dataTransfer.setData('text/plain', blockId); event.dataTransfer.effectAllowed = 'move'; setSelected(blockId); }}
        className="flex min-h-11 w-full items-center gap-2 rounded-control px-2 py-1 text-left font-serif text-lead disabled:cursor-default">
        <GripVertical aria-hidden className="size-4 shrink-0 text-ink-muted" />{block.text}
      </button>
      {exercise.support === 'volledig' && block.role && <p className="px-2 text-caption text-ink-muted">{block.role}</p>}
      <div className="mt-1 flex flex-wrap gap-1">
        <label className="sr-only" htmlFor={`${exercise.id}-place-${blockId}`}>Plaats {block.text} in</label>
        <select id={`${exercise.id}-place-${blockId}`} aria-label={`Plaats ${block.text} in`} disabled={disabled} value={slotId ?? ''}
          onChange={(event) => { if (event.target.value) place(blockId, event.target.value); }}
          className="min-h-11 min-w-0 flex-1 rounded-control border border-line-strong bg-sunken px-2 text-caption text-ink">
          <option value="" disabled>Kies een plek…</option>
          {exercise.slots.map((slot, slotIndex) => <option key={slot.id} value={slot.id}>{exercise.support === 'zelfstandig' ? `Plek ${slotIndex + 1}` : slot.label}</option>)}
        </select>
        {slotId && items.length > 1 && <>
          <button type="button" disabled={disabled || index === 0} aria-label={`${block.text} eerder in ${exercise.slots.find((slot) => slot.id === slotId)?.label}`} onClick={() => moveWithin(slotId, blockId, -1)} className="grid min-h-11 min-w-11 place-items-center rounded-control border border-line disabled:opacity-30"><ArrowUp aria-hidden className="size-4" /></button>
          <button type="button" disabled={disabled || index === items.length - 1} aria-label={`${block.text} later in ${exercise.slots.find((slot) => slot.id === slotId)?.label}`} onClick={() => moveWithin(slotId, blockId, 1)} className="grid min-h-11 min-w-11 place-items-center rounded-control border border-line disabled:opacity-30"><ArrowDown aria-hidden className="size-4" /></button>
        </>}
        {slotId && <button type="button" disabled={disabled} onClick={() => { focusAfterMove.current = blockId; onChange({ placements: { ...placements, [slotId]: items.filter((id) => id !== blockId) } }); setNotice('Het blok ligt weer los.'); }} aria-label={`Haal ${block.text} uit deze plek`} className="min-h-11 rounded-control px-2 text-caption font-bold text-ink-muted hover:bg-sunken">Losmaken</button>}
      </div>
    </motion.div>;
  };

  return <div className="space-y-4">
    <p className="text-small leading-relaxed text-ink-muted">Sleep een blok of kies het met een tik en tik daarna op een plek. Met de keuzelijst en pijlen kan alles ook met het toetsenbord.</p>
    <div className="grid gap-3 sm:grid-cols-2">
      {exercise.slots.map((slot, slotIndex) => <section key={slot.id} aria-label={`Zinsplek ${slotIndex + 1}`} onDragOver={(event) => { if (!disabled) { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; } }}
        onDrop={(event) => { event.preventDefault(); place(event.dataTransfer.getData('text/plain'), slot.id); }}
        className="min-h-28 rounded-card border-2 border-dashed border-blue-line bg-blue-soft/30 p-3">
        <h3 className="mb-2 font-display text-small font-bold text-blue-ink">{exercise.support === 'zelfstandig' ? `Plek ${slotIndex + 1}` : slot.label}{slot.capacity === 1 && <span className="ml-2 text-caption font-normal">één blok</span>}</h3>
        <div className="space-y-2">{(placements[slot.id] ?? []).map((id, index) => card(id, slot.id, index))}</div>
        {selected && <Button className="mt-2" size="sm" variant="secondary" disabled={disabled} onClick={() => place(selected, slot.id)}>Zet gekozen blok hier</Button>}
        {!(placements[slot.id]?.length) && !selected && <p className="py-3 text-caption text-ink-muted">Nog leeg</p>}
      </section>)}
    </div>
    {loose.length > 0 && <section aria-label="Losse blokken"><h3 className="mb-2 font-display text-small font-bold">Losse blokken</h3><div className="grid gap-2 sm:grid-cols-2">{loose.map((block) => card(block.id))}</div></section>}
    <div className="rounded-control border border-line bg-sunken p-4"><p className="text-caption font-bold text-ink-muted">Je huidige zin</p><p className="mt-2 font-serif text-lead leading-relaxed">{exercise.slots.flatMap((slot) => placements[slot.id] ?? []).map((id) => byId.get(id)?.text).join(' ') || 'Plaats de blokken om je zin te bouwen.'}</p></div>
    {notice && <p role="status" className="text-small leading-relaxed text-ink-muted">{notice}</p>}
  </div>;
}
