'use client';

import { LayoutGroup } from 'motion/react';
import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { Accent } from '@/content/schema';
import { cn } from '@/lib/cn';
import { play } from '@/lib/sound';
import { PracticeDnd, useClickGuard, useDragTarget, useDropZone } from '../dnd';
import { Tile, type TileState } from '../tile';
import { Hint, Kbd, StepHeading, type StepProps } from './shared';

const BUCKET_ACCENTS: Accent[] = ['blue', 'purple', 'orange', 'pink'];

/**
 * Sorteren in categorieën. Kies een kaartje en daarna een bak, sleep het erheen,
 * of druk op 1–4 terwijl het kaartje focus heeft.
 */
export function SortStep({ step, response, onChange, locked, stepKey }: StepProps<'sort'>) {
  const [held, setHeld] = useState<number | null>(null);
  const [dropped, setDropped] = useState<number | null>(null);
  const guard = useClickGuard();
  const nodes = useRef(new Map<string, HTMLElement>());
  const pendingFocus = useRef<string | null>(null);
  const assign = response.assign;

  useLayoutEffect(() => {
    if (!pendingFocus.current) return;
    nodes.current.get(pendingFocus.current)?.focus({ preventScroll: true });
    pendingFocus.current = null;
  });

  const register = (key: string) => (node: HTMLElement | null) => {
    if (node) nodes.current.set(key, node);
    else nodes.current.delete(key);
  };

  const put = (item: number, bucket: number | null, via: 'click' | 'drag') => {
    const next = [...assign];
    next[item] = bucket;
    setDropped(via === 'drag' ? item : null);
    setHeld(null);
    onChange({ kind: 'sort', assign: next });
    play(bucket === null ? 'remove' : 'place');
    if (via === 'click') {
      const nextOpen = next.findIndex((value, i) => value === null && i !== item);
      pendingFocus.current = bucket === null ? `item-${item}` : nextOpen >= 0 ? `item-${nextOpen}` : `bucket-${bucket}`;
    }
  };

  const onItemKey = (item: number) => (event: KeyboardEvent) => {
    if (locked) return;
    const n = Number(event.key);
    if (Number.isInteger(n) && n >= 1 && n <= step.buckets.length) {
      event.preventDefault();
      put(item, n - 1, 'click');
    } else if (event.key === 'Escape') {
      setHeld(null);
    }
  };

  const itemState = (item: number, dragging: boolean): TileState => {
    if (locked) {
      const bucket = assign[item];
      return bucket === null || bucket === undefined ? 'muted' : bucket === step.items[item]?.b ? 'correct' : 'wrong';
    }
    if (dragging) return 'dragging';
    return held === item ? 'held' : 'idle';
  };

  const open = step.items.map((_, i) => i).filter((i) => assign[i] === null);

  return (
    <div>
      <StepHeading>{step.prompt}</StepHeading>
      <LayoutGroup id={stepKey}>
        <PracticeDnd
          disabled={locked}
          animateDrop={false}
          onDrop={(activeId, overId) => {
            guard.afterDrag();
            const item = Number(activeId.replace('item-', ''));
            if (!overId || Number.isNaN(item)) return;
            if (overId === 'pool') put(item, null, 'drag');
            else if (overId.startsWith('bucket-')) put(item, Number(overId.replace('bucket-', '')), 'drag');
          }}
          renderOverlay={(activeId) => {
            const item = step.items[Number(activeId.replace('item-', ''))];
            return (
              <span className="flex min-h-12 items-center rounded-tile border-2 border-accent bg-surface px-4 py-2 font-serif text-[1.375rem] text-ink shadow-[0_4px_0_var(--accent)]">
                {item?.t}
              </span>
            );
          }}
        >
          <PoolZone disabled={locked} empty={open.length === 0}>
            {open.map((item) => (
              <SortItem
                key={item}
                item={item}
                text={step.items[item]?.t ?? ''}
                layoutId={dropped === item ? undefined : `${stepKey}:${item}`}
                state={(dragging) => itemState(item, dragging)}
                locked={locked}
                register={register(`item-${item}`)}
                pressed={held === item}
                onActivate={() => {
                  if (!guard.allowed()) return;
                  play('select');
                  setHeld(held === item ? null : item);
                }}
                onKeyDown={onItemKey(item)}
                buckets={step.buckets}
              />
            ))}
          </PoolZone>

          <div className={cn('mt-6 grid gap-4', step.buckets.length === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2')}>
            {step.buckets.map((name, bucket) => (
              <Bucket
                key={name}
                bucket={bucket}
                name={name}
                accent={BUCKET_ACCENTS[bucket % BUCKET_ACCENTS.length] ?? 'blue'}
                locked={locked}
                canReceive={held !== null}
                register={register(`bucket-${bucket}`)}
                onReceive={() => held !== null && put(held, bucket, 'click')}
              >
                {step.items.map((item, i) =>
                  assign[i] === bucket ? (
                    <SortItem
                      key={i}
                      item={i}
                      text={item.t}
                      layoutId={dropped === i ? undefined : `${stepKey}:${i}`}
                      state={(dragging) => itemState(i, dragging)}
                      locked={locked}
                      register={register(`item-${i}`)}
                      pressed={false}
                      onActivate={() => guard.allowed() && put(i, null, 'click')}
                      onKeyDown={onItemKey(i)}
                      buckets={step.buckets}
                      hint={locked && assign[i] !== item.b ? `hoort bij ${step.buckets[item.b]}` : null}
                      placedIn={name}
                    />
                  ) : null,
                )}
              </Bucket>
            ))}
          </div>
        </PracticeDnd>
      </LayoutGroup>
      {!locked && (
        <Hint className="mt-4 hidden flex-wrap items-center gap-1.5 sm:flex">
          Kies een kaartje en dan een bak, of sleep. Sneller: focus op een kaartje en druk <Kbd>1</Kbd>
          {step.buckets.length > 1 && (
            <>
              –<Kbd>{step.buckets.length}</Kbd>
            </>
          )}
          .
        </Hint>
      )}
    </div>
  );
}

function PoolZone({ children, disabled, empty }: { children: React.ReactNode; disabled: boolean; empty: boolean }) {
  const { setNodeRef: zoneRef, isOver: zoneOver } = useDropZone('pool', { label: 'de stapel', kind: 'zone', index: -1 }, disabled);
  return (
    <div
      ref={zoneRef}
      role="group"
      aria-label="Nog te sorteren"
      className={cn(
        'mt-6 flex min-h-[4.25rem] flex-wrap items-start gap-2.5 rounded-card p-1 transition-colors',
        zoneOver && 'bg-sunken',
      )}
    >
      {empty && <p className="self-center px-2 text-small font-semibold text-ink-muted">Alles ligt in een bak. Tik een kaartje om het terug te leggen.</p>}
      {children}
    </div>
  );
}

type BucketProps = {
  bucket: number;
  name: string;
  accent: Accent;
  locked: boolean;
  canReceive: boolean;
  register: (node: HTMLElement | null) => void;
  onReceive: () => void;
  children: React.ReactNode;
};

function Bucket({ bucket, name, accent, locked, canReceive, register, onReceive, children }: BucketProps) {
  const { setNodeRef: zoneRef, isOver: zoneOver } = useDropZone(`bucket-${bucket}`, { label: `bak ${name}`, kind: 'bucket', index: bucket }, locked);
  return (
    <section
      ref={zoneRef}
      data-accent={accent}
      aria-label={`Bak ${bucket + 1}: ${name}`}
      className={cn(
        'flex min-h-44 flex-col rounded-card border-2 p-3 transition-colors duration-200 sm:p-4',
        zoneOver ? 'border-accent bg-accent-soft' : 'border-dashed border-accent-line bg-accent-soft/40',
      )}
    >
      <button
        ref={register}
        type="button"
        disabled={locked || !canReceive}
        onClick={onReceive}
        className={cn(
          'flex min-h-12 items-center justify-center gap-2 rounded-control px-2 text-center font-serif text-[1.75rem] leading-none text-accent-ink transition-colors',
          canReceive && !locked ? 'bg-surface shadow-[0_3px_0_var(--accent-line)] hover:bg-accent-soft' : 'cursor-default',
        )}
      >
        <span className="sr-only">{canReceive ? 'Leg in bak: ' : 'Bak: '}</span>
        {name}
        <span aria-hidden className="font-sans text-caption font-extrabold text-ink-muted">
          {bucket + 1}
        </span>
      </button>
      <div className="mt-3 flex flex-1 flex-wrap content-start gap-2">{children}</div>
    </section>
  );
}

type SortItemProps = {
  item: number;
  text: string;
  layoutId: string | undefined;
  state: (dragging: boolean) => TileState;
  locked: boolean;
  register: (node: HTMLElement | null) => void;
  pressed: boolean;
  onActivate: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
  buckets: readonly string[];
  hint?: string | null;
  placedIn?: string;
};

function SortItem({ item, text, layoutId, state, locked, register, pressed, onActivate, onKeyDown, hint, placedIn }: SortItemProps) {
  const { setNodeRef: dragRef, listeners: dragListeners, describedBy: dragDescribedBy, isDragging } = useDragTarget(`item-${item}`, { label: text, kind: 'item', index: item }, locked);
  return (
    <Tile
      ref={(node) => {
        dragRef(node);
        register(node);
      }}
      {...dragListeners}
      aria-describedby={dragDescribedBy}
      aria-pressed={placedIn ? undefined : pressed}
      aria-label={placedIn ? `${text}, in bak ${placedIn}. Activeer om terug te leggen.` : `${text}. Kies een bak.`}
      layoutId={layoutId}
      state={state(isDragging)}
      disabled={locked}
      onClick={onActivate}
      onKeyDown={onKeyDown}
    >
      <span>
        {text}
        {hint && <span className="mt-0.5 block font-sans text-caption font-bold">{hint}</span>}
      </span>
    </Tile>
  );
}
