'use client';

import {
  closestCenter,
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type Announcements,
  type CollisionDetection,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
  type DropAnimation,
} from '@dnd-kit/core';
import { motion } from 'motion/react';
import { useCallback, useRef, useState, type ReactNode } from 'react';
import { useCalmMotion } from '@/lib/motion';

/**
 * Slepen voor oefenblokken.
 *
 * Taakverdeling, zodat er nooit twee systemen dezelfde transform beheren:
 * - dnd-kit beweegt alleen de DragOverlay (de kopie onder je vinger of muis);
 * - de kaartjes zelf krijgen geen dnd-transform: Motion animeert hun plaats (layout/layoutId);
 * - het opgepakte kaartje in de lijst blijft staan als lege plek.
 *
 * Slepen is altijd een extra: elke oefening werkt ook met klikken en het toetsenbord.
 */
export type DragData = { label: string; kind: string; index: number; zone?: string };

const collision: CollisionDetection = (args) => {
  const within = pointerWithin(args);
  return within.length > 0 ? within : closestCenter(args);
};

const labelOf = (item: { id: string | number; data: { current?: unknown } } | null) =>
  (item?.data.current as DragData | undefined)?.label ?? String(item?.id ?? '');

const announcements: Announcements = {
  onDragStart: ({ active }) => `${labelOf(active)} opgepakt.`,
  onDragOver: ({ active, over }) => (over ? `${labelOf(active)} boven ${labelOf(over)}.` : `${labelOf(active)} is niet boven een plek.`),
  onDragEnd: ({ active, over }) => (over ? `${labelOf(active)} neergezet bij ${labelOf(over)}.` : `${labelOf(active)} teruggezet.`),
  onDragCancel: ({ active }) => `Slepen gestopt. ${labelOf(active)} staat weer op zijn plek.`,
};

const dropAnimation: DropAnimation = { duration: 200, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' };

type PracticeDndProps = {
  children: ReactNode;
  disabled?: boolean;
  /** Herschikken tijdens het slepen (lijsten); bij bakken/vakken pas bij loslaten. */
  onMove?: (activeId: string, overId: string) => void;
  onDrop: (activeId: string, overId: string | null) => void;
  renderOverlay: (activeId: string) => ReactNode;
  /** Terugveren van de kopie naar de lege plek; uit wanneer het kaartje naar een andere plek verhuist. */
  animateDrop?: boolean;
};

export function PracticeDnd({ children, disabled, onMove, onDrop, renderOverlay, animateDrop = true }: PracticeDndProps) {
  const calm = useCalmMotion();
  const [activeId, setActiveId] = useState<string | null>(null);
  const lastOver = useRef<string | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 160, tolerance: 8 } }),
  );

  const handleStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
    lastOver.current = null;
  };
  const handleMove = (event: DragMoveEvent) => {
    if (!onMove || !event.over) return;
    const over = String(event.over.id);
    const active = String(event.active.id);
    if (over === active || over === lastOver.current) return;
    lastOver.current = over;
    onMove(active, over);
  };
  const handleEnd = (event: DragEndEvent) => {
    onDrop(String(event.active.id), event.over ? String(event.over.id) : null);
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={disabled ? [] : sensors}
      collisionDetection={collision}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      accessibility={{
        announcements,
        screenReaderInstructions: {
          draggable: 'Sleep met muis of vinger. Zonder slepen: activeer het kaartje, of gebruik de verplaatsknoppen.',
        },
      }}
      autoScroll={{ threshold: { x: 0, y: 0.15 } }}
      onDragStart={handleStart}
      onDragMove={handleMove}
      onDragEnd={handleEnd}
      onDragCancel={() => setActiveId(null)}
    >
      {children}
      <DragOverlay dropAnimation={animateDrop && !calm ? dropAnimation : null} zIndex={70}>
        {activeId ? (
          <motion.div
            initial={calm ? false : { scale: 1, rotate: 0 }}
            animate={calm ? undefined : { scale: 1.04, rotate: -1.5 }}
            transition={{ duration: 0.16 }}
            className="cursor-grabbing drop-shadow-[0_14px_18px_rgb(16_24_40/0.18)]"
          >
            {renderOverlay(activeId)}
          </motion.div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

/** Een element dat zowel versleept kan worden als een doel is (lijsten, wisselen, letters plakken). */
export function useDragTarget(id: string, data: DragData, disabled = false) {
  const drag = useDraggable({ id, data, disabled });
  const drop = useDroppable({ id, data, disabled });
  const { setNodeRef: setDragRef } = drag;
  const { setNodeRef: setDropRef } = drop;
  const setNodeRef = useCallback(
    (node: HTMLElement | null) => {
      setDragRef(node);
      setDropRef(node);
    },
    [setDragRef, setDropRef],
  );
  return {
    setNodeRef,
    listeners: disabled ? undefined : drag.listeners,
    describedBy: drag.attributes['aria-describedby'],
    isDragging: drag.isDragging,
    isOver: drop.isOver && !drag.isDragging,
  };
}

export function useDropZone(id: string, data: DragData, disabled = false) {
  const drop = useDroppable({ id, data, disabled });
  return { setNodeRef: drop.setNodeRef, isOver: drop.isOver };
}

/** Voorkomt dat een klik direct na het loslaten van een sleepbeweging ook nog als tik telt. */
export function useClickGuard() {
  const until = useRef(0);
  return {
    afterDrag: () => {
      until.current = performance.now() + 120;
    },
    allowed: () => performance.now() > until.current,
  };
}
