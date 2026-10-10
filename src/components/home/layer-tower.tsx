'use client';

import { motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import type { Layer } from '@/content/schema';
import { LayerGlyph } from '@/components/brand/glyphs';
import { cn } from '@/lib/cn';
import { spring, useCalmMotion } from '@/lib/motion';
import { useOrbit } from '@/lib/orbit';
import type { ProgressData } from '@/state/progress';
import { layerCompletion } from '@/state/selectors';

/**
 * De niveaus als toren in 3D: letter onderaan, alinea bovenaan. Elk niveau rust op het niveau
 * eronder. Het gekozen niveau schuift naar voren; wat je al bereikt hebt, kleurt mee. Je kunt
 * de toren ronddraaien en een blok aantikken. Voor toetsenbord en schermlezer doen de
 * tabbladen eronder hetzelfde, daarom is de toren zelf een plaatje.
 */
const W = 168;
const D = 104;
const H = 22;
const GAP = 7;

type Face = 'front' | 'back' | 'left' | 'right' | 'top';

const FACE_TRANSFORM: Record<Face, string> = {
  front: `translateZ(${D / 2}px)`,
  back: `translateZ(${-D / 2}px) rotateY(180deg)`,
  left: `translateX(${-W / 2}px) rotateY(-90deg)`,
  right: `translateX(${W / 2}px) rotateY(90deg)`,
  top: `translateY(${-H / 2}px) rotateX(90deg)`,
};

const FACE_SIZE: Record<Face, { width: number; height: number }> = {
  front: { width: W, height: H },
  back: { width: W, height: H },
  left: { width: D, height: H },
  right: { width: D, height: H },
  top: { width: W, height: D },
};

function SlabFace({ face, className, style, children }: { face: Face; className?: string; style?: CSSProperties; children?: ReactNode }) {
  return (
    <div
      style={{ ...FACE_SIZE[face], transform: `${FACE_TRANSFORM[face]} translate(-50%, -50%)`, ...style }}
      className={cn('absolute top-0 left-0 origin-top-left [backface-visibility:hidden]', className)}
    >
      {children}
    </div>
  );
}

function Slab({ layer, index, total, selected, progress, onSelect }: { layer: Layer; index: number; total: number; selected: number; progress: ProgressData; onSelect: (index: number) => void }) {
  const calm = useCalmMotion();
  const active = index === selected;
  const reached = index <= selected;
  const done = layerCompletion(layer, progress);
  const y = ((total - 1) / 2 - index) * (H + GAP) - (active ? 6 : 0);
  return (
    <motion.div
      data-accent={layer.accent}
      initial={false}
      animate={{ y, z: active ? 34 : 0, scale: active ? 1.04 : 1 }}
      transition={calm ? { duration: 0 } : spring.card}
      onClick={() => onSelect(index)}
      className="absolute top-0 left-0 cursor-pointer [transform-style:preserve-3d]"
    >
      <SlabFace
        face="top"
        className={cn('rounded-[5px]', reached ? 'bg-[color-mix(in_oklab,var(--accent)_62%,white)]' : 'bg-surface')}
        style={{ boxShadow: reached ? 'inset 0 0 0 1.5px color-mix(in oklab, var(--accent-deep) 40%, transparent)' : 'inset 0 0 0 1.5px var(--color-line-strong)' }}
      />
      <SlabFace face="back" className={reached ? 'bg-accent-deep' : 'bg-line-strong'} />
      <SlabFace face="left" className={reached ? 'bg-accent-deep' : 'bg-line-strong'} />
      <SlabFace face="right" className={reached ? 'bg-[color-mix(in_oklab,var(--accent-deep)_82%,black)]' : 'bg-[color-mix(in_oklab,var(--color-line-strong)_85%,black)]'} />
      <SlabFace
        face="front"
        className={cn(
          'flex items-center gap-1.5 overflow-hidden px-2 text-[0.6875rem] leading-none font-extrabold whitespace-nowrap',
          reached ? 'bg-accent bg-linear-to-b from-white/25 to-transparent text-accent-on' : 'border border-line-strong bg-surface text-ink-muted',
          active && 'shadow-[0_0_22px_2px_var(--accent)]',
        )}
      >
        <LayerGlyph id={layer.id} className="size-3.5 shrink-0" />
        <span className="truncate">{layer.name}</span>
        {done.done > 0 && (
          <span className={cn('ml-auto h-1 w-7 shrink-0 overflow-hidden rounded-full', reached ? 'bg-black/20' : 'bg-line')}>
            <span className={cn('block h-full rounded-full', reached ? 'bg-white' : 'bg-accent')} style={{ width: `${done.ratio * 100}%` }} />
          </span>
        )}
      </SlabFace>
    </motion.div>
  );
}

export function LayerTower({
  layers,
  selected,
  progress,
  onSelect,
  className,
}: {
  layers: readonly Layer[];
  selected: number;
  progress: ProgressData;
  onSelect: (index: number) => void;
  className?: string;
}) {
  const orbit = useOrbit({ initial: { x: -22, y: -32 }, limitX: [-50, 10], idleSway: 16 });
  const height = layers.length * (H + GAP);
  return (
    <div
      aria-hidden
      data-testid="niveautoren"
      {...orbit.bind}
      onKeyDown={undefined}
      className={cn('relative cursor-grab touch-pan-y select-none [perspective:900px] active:cursor-grabbing', className)}
      style={{ height: height + 90 }}
    >
      <motion.div style={{ rotateX: orbit.rotateX, rotateY: orbit.rotateY }} className="absolute top-1/2 left-1/2 size-0 [transform-style:preserve-3d]">
        {/* Schaduw op de vloer, onder het onderste blok. */}
        <div
          style={{ width: W * 1.7, height: D * 1.9, transform: `translateY(${height / 2 + 4}px) rotateX(90deg) translate(-50%, -50%)` }}
          className="absolute top-0 left-0 origin-top-left rounded-full bg-[radial-gradient(closest-side,rgb(60_40_10/0.28),transparent)]"
        />
        {layers.map((layer, index) => (
          <Slab key={layer.id} layer={layer} index={index} total={layers.length} selected={selected} progress={progress} onSelect={onSelect} />
        ))}
      </motion.div>
    </div>
  );
}
