'use client';

import { ArrowDown, ArrowUp, GripVertical, X } from 'lucide-react';
import { LayoutGroup, motion } from 'motion/react';
import { useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { shuffledIndices } from '@/engine/hash';
import { cn } from '@/lib/cn';
import { spring } from '@/lib/motion';
import { play } from '@/lib/sound';
import { PracticeDnd, useClickGuard, useDragTarget, useDropZone } from '../dnd';
import { Tile, type TileState } from '../tile';
import { Hint, Kbd } from './shared';

type Zone = 'pool' | 'line';
const id = (zone: Zone, index: number) => `${zone}-${index}`;
function parseId(value: string): { zone: Zone; index: number } | null {
  const match = /^(pool|line)-(\d+)$/.exec(value);
  return match ? { zone: match[1] as Zone, index: Number(match[2]) } : null;
}

type SequenceBuilderProps = {
  items: readonly string[];
  placed: number[];
  onChange: (placed: number[]) => void;
  locked: boolean;
  /** Per plek in de lijn: goed of fout (alleen tijdens feedback). */
  verdicts: boolean[] | null;
  /** Extra uitleg per kaartje na controleren (bv. de rol van een zin). */
  notes?: (index: number, position: number) => string | null;
  variant: 'inline' | 'block';
  stepKey: string;
  lineLabel: string;
  emptyText: string;
};

/**
 * Kaartjes in de goede volgorde leggen. Tikken legt een kaartje achteraan of terug;
 * Motion laat het zichtbaar naar zijn plek bewegen. Slepen herschikt live; met het
 * toetsenbord: Alt + pijltjes verplaatst, Delete legt terug.
 */
export function SequenceBuilder({ items, placed, onChange, locked, verdicts, notes, variant, stepKey, lineLabel, emptyText }: SequenceBuilderProps) {
  const pool = useMemo(() => shuffledIndices(stepKey, items.length), [stepKey, items.length]);
  const [dropped, setDropped] = useState<number | null>(null);
  const guard = useClickGuard();
  const nodes = useRef(new Map<string, HTMLElement>());
  const pendingFocus = useRef<string | null>(null);
  const block = variant === 'block';

  useLayoutEffect(() => {
    if (!pendingFocus.current) return;
    nodes.current.get(pendingFocus.current)?.focus({ preventScroll: true });
    pendingFocus.current = null;
  });

  const register = (key: string) => (node: HTMLElement | null) => {
    if (node) nodes.current.set(key, node);
    else nodes.current.delete(key);
  };

  const place = (index: number, at: number | undefined, via: 'click' | 'drag') => {
    const next = placed.filter((value) => value !== index);
    next.splice(at ?? next.length, 0, index);
    setDropped(via === 'drag' ? index : null);
    onChange(next);
    play('place');
    if (via === 'click') {
      const rest = pool.filter((value) => !next.includes(value));
      const after = rest.find((value) => pool.indexOf(value) > pool.indexOf(index)) ?? rest[0];
      pendingFocus.current = after !== undefined ? id('pool', after) : id('line', index);
    }
  };

  const remove = (index: number, via: 'click' | 'drag') => {
    setDropped(null);
    onChange(placed.filter((value) => value !== index));
    play('remove');
    if (via === 'click') pendingFocus.current = id('pool', index);
  };

  const shift = (index: number, delta: number) => {
    const from = placed.indexOf(index);
    const to = from + delta;
    if (from < 0 || to < 0 || to >= placed.length) return;
    const next = [...placed];
    next.splice(from, 1);
    next.splice(to, 0, index);
    setDropped(null);
    onChange(next);
    play('tap');
    pendingFocus.current = id('line', index);
  };

  const onLineKey = (index: number) => (event: KeyboardEvent) => {
    if (locked) return;
    const back = block ? 'ArrowUp' : 'ArrowLeft';
    const forward = block ? 'ArrowDown' : 'ArrowRight';
    if (event.altKey && (event.key === back || event.key === forward)) {
      event.preventDefault();
      shift(index, event.key === back ? -1 : 1);
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      remove(index, 'click');
    }
  };

  const lineState = (index: number, position: number, dragging: boolean, over: boolean): TileState => {
    if (verdicts) return verdicts[position] ? 'correct' : 'wrong';
    if (dragging) return 'dragging';
    return over ? 'target' : 'idle';
  };

  return (
    <LayoutGroup id={stepKey}>
      <PracticeDnd
        disabled={locked}
        onMove={(activeId, overId) => {
          const active = parseId(activeId);
          const over = parseId(overId);
          if (active?.zone !== 'line' || over?.zone !== 'line') return;
          const to = placed.indexOf(over.index);
          const from = placed.indexOf(active.index);
          if (to < 0 || from < 0 || to === from) return;
          const next = [...placed];
          next.splice(from, 1);
          next.splice(to, 0, active.index);
          setDropped(null);
          onChange(next);
        }}
        onDrop={(activeId, overId) => {
          guard.afterDrag();
          const active = parseId(activeId);
          if (!active || !overId) return;
          const over = parseId(overId);
          if (active.zone === 'pool') {
            if (overId === 'zone-line') place(active.index, undefined, 'drag');
            else if (over?.zone === 'line') place(active.index, placed.indexOf(over.index), 'drag');
          } else if (overId === 'zone-pool' || over?.zone === 'pool') {
            remove(active.index, 'drag');
          } else {
            play('tap');
          }
        }}
        animateDrop
        renderOverlay={(activeId) => {
          const active = parseId(activeId);
          return active ? <OverlayFace text={items[active.index] ?? ''} block={block} /> : null;
        }}
      >
        <Line block={block} label={lineLabel} disabled={locked} empty={placed.length === 0} emptyText={emptyText}>
          {placed.map((index, position) => (
            <LineItem
              key={index}
              index={index}
              position={position}
              count={placed.length}
              text={items[index] ?? ''}
              block={block}
              locked={locked}
              layoutId={dropped === index ? undefined : `${stepKey}:${index}`}
              note={verdicts && notes ? notes(index, position) : null}
              stateFor={(dragging, over) => lineState(index, position, dragging, over)}
              register={register(id('line', index))}
              onActivate={() => guard.allowed() && remove(index, 'click')}
              onShift={(delta) => shift(index, delta)}
              onKeyDown={onLineKey(index)}
            />
          ))}
        </Line>

        <Pool block={block} disabled={locked}>
          {pool.map((index) =>
            placed.includes(index) ? (
              <GhostFace key={`ghost-${index}`} text={items[index] ?? ''} block={block} />
            ) : (
              <PoolItem
                key={index}
                index={index}
                text={items[index] ?? ''}
                block={block}
                locked={locked}
                layoutId={`${stepKey}:${index}`}
                register={register(id('pool', index))}
                onActivate={() => guard.allowed() && place(index, undefined, 'click')}
              />
            ),
          )}
        </Pool>
      </PracticeDnd>
      {!locked && (
        <Hint className="mt-4 hidden flex-wrap items-center gap-1.5 sm:flex">
          Tik om te leggen of terug te leggen, of sleep. Met het toetsenbord: <Kbd>Alt</Kbd> + <Kbd>{block ? '↑ ↓' : '← →'}</Kbd> verplaatst,{' '}
          <Kbd>Delete</Kbd> legt terug.
        </Hint>
      )}
    </LayoutGroup>
  );
}

function Line({ children, block, label, disabled, empty, emptyText }: { children: React.ReactNode; block: boolean; label: string; disabled: boolean; empty: boolean; emptyText: string }) {
  const zone = useDropZone('zone-line', { label, kind: 'zone', index: -1 }, disabled);
  return (
    <div
      ref={zone.setNodeRef}
      role="list"
      aria-label={label}
      className={cn(
        'relative min-h-[5.75rem] rounded-card border-2 border-dashed p-3 transition-colors duration-200',
        block ? 'flex flex-col gap-2.5' : 'flex flex-wrap content-start items-start gap-2.5',
        zone.isOver ? 'border-accent bg-accent-soft' : 'border-line-strong bg-sunken',
      )}
    >
      {empty && <p className="pointer-events-none absolute inset-0 grid place-items-center px-6 text-center text-small font-semibold text-ink-muted">{emptyText}</p>}
      {children}
    </div>
  );
}

function Pool({ children, block, disabled }: { children: React.ReactNode; block: boolean; disabled: boolean }) {
  const zone = useDropZone('zone-pool', { label: 'de kaartjes', kind: 'zone', index: -1 }, disabled);
  return (
    <div ref={zone.setNodeRef} role="group" aria-label="Kaartjes om te leggen" className={cn('mt-6', block ? 'flex flex-col gap-2.5' : 'flex flex-wrap gap-2.5')}>
      {children}
    </div>
  );
}

type LineItemProps = {
  index: number;
  position: number;
  count: number;
  text: string;
  block: boolean;
  locked: boolean;
  layoutId: string | undefined;
  note: string | null;
  stateFor: (dragging: boolean, over: boolean) => TileState;
  register: (node: HTMLElement | null) => void;
  onActivate: () => void;
  onShift: (delta: number) => void;
  onKeyDown: (event: KeyboardEvent) => void;
};

function LineItem({ index, position, count, text, block, locked, layoutId, note, stateFor, register, onActivate, onShift, onKeyDown }: LineItemProps) {
  const drag = useDragTarget(`line-${index}`, { label: text, kind: 'line', index }, locked);
  const state = stateFor(drag.isDragging, drag.isOver);
  const label = `${text}. Plek ${position + 1} van ${count}. Activeer om terug te leggen.`;

  if (!block) {
    return (
      <div role="listitem">
        <Tile
          ref={(node) => {
            drag.setNodeRef(node);
            register(node);
          }}
          {...drag.listeners}
          aria-describedby={drag.describedBy}
          aria-label={label}
          layoutId={layoutId}
          layout
          state={state}
          disabled={locked}
          onClick={onActivate}
          onKeyDown={onKeyDown}
        >
          {text}
        </Tile>
      </div>
    );
  }

  return (
    <motion.div
      role="listitem"
      ref={drag.setNodeRef}
      {...drag.listeners}
      layout="position"
      layoutId={layoutId}
      transition={spring.layout}
      className="flex items-stretch gap-2"
    >
      <span aria-hidden className="grid w-9 shrink-0 place-items-center font-display text-body font-extrabold text-ink-muted tabular-nums">
        {position + 1}
      </span>
      <Tile
        ref={register}
        aria-describedby={drag.describedBy}
        aria-label={label}
        size="block"
        state={state}
        disabled={locked}
        onClick={onActivate}
        onKeyDown={onKeyDown}
        className="min-w-0 flex-1"
      >
        {!locked && <GripVertical aria-hidden className="size-5 shrink-0 text-ink-muted" />}
        <span className="min-w-0 flex-1">
          {text}
          {note && <span className="mt-1 block font-sans text-caption font-bold">{note}</span>}
        </span>
      </Tile>
      {!locked && (
        <div className="flex shrink-0 flex-col gap-1">
          <MoveButton label={`${text}: omhoog`} disabled={position === 0} onClick={() => onShift(-1)}>
            <ArrowUp aria-hidden className="size-4" strokeWidth={2.75} />
          </MoveButton>
          <MoveButton label={`${text}: omlaag`} disabled={position === count - 1} onClick={() => onShift(1)}>
            <ArrowDown aria-hidden className="size-4" strokeWidth={2.75} />
          </MoveButton>
        </div>
      )}
    </motion.div>
  );
}

function MoveButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-[1.6rem] flex-1 place-items-center rounded-chip border-2 border-line bg-surface text-ink-soft transition-colors hover:border-line-strong hover:text-ink disabled:opacity-35 sm:size-7"
    >
      {children}
    </button>
  );
}

type PoolItemProps = {
  index: number;
  text: string;
  block: boolean;
  locked: boolean;
  layoutId: string;
  register: (node: HTMLElement | null) => void;
  onActivate: () => void;
};

function PoolItem({ index, text, block, locked, layoutId, register, onActivate }: PoolItemProps) {
  const drag = useDragTarget(`pool-${index}`, { label: text, kind: 'pool', index }, locked);
  return (
    <Tile
      ref={(node) => {
        drag.setNodeRef(node);
        register(node);
      }}
      {...drag.listeners}
      aria-describedby={drag.describedBy}
      aria-label={`${text}. Activeer om te leggen.`}
      layoutId={layoutId}
      size={block ? 'block' : 'md'}
      state={drag.isDragging ? 'dragging' : locked ? 'muted' : 'idle'}
      disabled={locked}
      onClick={onActivate}
    >
      {text}
    </Tile>
  );
}

function GhostFace({ text, block }: { text: string; block: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex items-center rounded-tile border-2 border-dashed border-line-strong text-transparent select-none',
        block ? 'min-h-14 w-full px-4 py-3 font-serif text-[1.1875rem] leading-snug' : 'min-h-12 px-4 py-2 font-serif text-[1.375rem] leading-tight',
      )}
    >
      {text}
    </span>
  );
}

function OverlayFace({ text, block }: { text: string; block: boolean }) {
  return (
    <span
      className={cn(
        'flex items-center gap-3 rounded-tile border-2 border-accent bg-surface text-ink shadow-[0_4px_0_var(--accent)]',
        block ? 'min-h-14 max-w-[min(40rem,90vw)] px-4 py-3 font-serif text-[1.1875rem] leading-snug' : 'min-h-12 px-4 py-2 font-serif text-[1.375rem] leading-tight',
      )}
    >
      {text}
    </span>
  );
}
