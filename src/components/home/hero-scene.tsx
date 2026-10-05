'use client';

import { Hand } from 'lucide-react';
import { useRef, useState } from 'react';
import { Pim } from '@/components/brand/pim';
import { ToyCanvas } from '@/lib/toy3d/toy-canvas';
import { play } from '@/lib/sound';
import { speak } from '@/lib/speech';
import { cn } from '@/lib/cn';

const LETTERS = ['b', 'o', 'e', 'k'] as const;
const loadHero = () => import('@/lib/toy3d/scenes/hero').then((module) => module.heroScene);

/**
 * Bovenaan de startpagina: Pim en de letterblokken van "boek" in 3D. Tik de blokken op volgorde
 * en Pim leest het woord voor. Zonder WebGL staat Pim er gewoon als tekening.
 */
export function HeroScene({ className }: { className?: string }) {
  const tapped = useRef<number[]>([]);
  const [hint, setHint] = useState('Tik de blokken op volgorde, of tik Pim');

  const onTap = (id: string) => {
    if (id === 'pim') {
      play('win', 0.4);
      setHint('Hoi! Sleep opzij om alles rond te draaien');
      return;
    }
    const index = Number(id.split(':')[1]);
    play('place');
    const expected = tapped.current.length;
    tapped.current = index === expected ? [...tapped.current, index] : index === 0 ? [0] : [];
    const word = tapped.current.map((i) => LETTERS[i]).join('');
    if (tapped.current.length === LETTERS.length) {
      speak(LETTERS.join(''));
      play('solved');
      setHint('boek: vier letters, één woord. Daar begint het.');
      tapped.current = [];
    } else {
      speak(LETTERS[index]!);
      setHint(word ? `${word}…` : 'Begin bij de b');
    }
  };

  return (
    <div className={cn('relative', className)}>
      <div
        aria-hidden
        className="absolute inset-x-[8%] top-[12%] bottom-[6%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-yellow)_22%,transparent),transparent)] blur-2xl"
      />
      <ToyCanvas
        load={loadHero}
        props={{ letters: LETTERS }}
        onTap={onTap}
        label="Pim het potlood zweeft boven vier letterblokken: b, o, e, k."
        className="size-full"
        fallback={
          <div className="grid size-full place-items-center">
            <Pim mood="happy" size="lg" />
          </div>
        }
      />
      <p
        aria-live="polite"
        className="pointer-events-none absolute inset-x-0 bottom-1 flex items-center justify-center gap-1.5 text-caption font-bold text-ink-muted"
      >
        <Hand aria-hidden className="size-3.5" strokeWidth={2.5} />
        {hint}
      </p>
    </div>
  );
}
