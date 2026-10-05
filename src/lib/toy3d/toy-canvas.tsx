'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useCalmMotion } from '@/lib/motion';
import type { Stage, StageOptions } from './stage';
import { webglAvailable } from './support';

type Kit = typeof import('./stage');

/** Wat een 3D-scène teruggeeft na het opbouwen: bijwerken met nieuwe props, eventueel zelf reageren op tikken. */
export type Mounted<P> = { update: (props: P) => void; tap?: (id: string) => void };

/** Een scène: de camera-instellingen en hoe hij zich opbouwt in het theater. */
export type ToyScene<P> = {
  options: (props: P) => Omit<StageOptions, 'calm' | 'onTap'>;
  mount: (stage: Stage, kit: Kit, props: P) => Mounted<P>;
};

type Load = 'loading' | 'ready' | 'failed';

const never = () => () => {};

/**
 * Een canvas met een speelgoedscène. three.js en de scène laden pas als dit onderdeel op de
 * pagina komt. Zonder vlotte WebGL (of als laden mislukt) staat `fallback` er, zodat alles blijft werken.
 */
export function ToyCanvas<P>({
  load,
  props,
  onTap,
  fallback,
  className,
  label,
}: {
  load: () => Promise<ToyScene<P>>;
  props: P;
  onTap?: (id: string) => void;
  fallback?: ReactNode;
  className?: string;
  /** Beschrijving voor schermlezers; het canvas zelf is een plaatje. */
  label: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const calm = useCalmMotion();
  // Meteen bij de eerste weergave beslist: zo springt de pagina niet als het toch 2D wordt.
  const can = useSyncExternalStore(never, webglAvailable, () => true);
  const [state, setState] = useState<Load>('loading');
  const latest = useRef({ props, onTap, calm });
  const mounted = useRef<{ stage: Stage; scene: Mounted<P> } | null>(null);

  useEffect(() => {
    latest.current = { props, onTap, calm };
    mounted.current?.scene.update(props);
    mounted.current?.stage.setCalm(calm);
    mounted.current?.stage.wake();
  });

  useEffect(() => {
    if (!webglAvailable()) return;
    let live = true;
    let stage: Stage | null = null;
    Promise.all([import('./stage'), load(), document.fonts?.ready])
      .then(([kit, scene]) => {
        const node = canvas.current;
        if (!live || !node) return;
        stage = kit.createStage(node, {
          ...scene.options(latest.current.props),
          calm: latest.current.calm,
          onTap: (object) => {
            const id = object?.userData.tap as string | undefined;
            if (id === undefined) return;
            mounted.current?.stage.wake();
            mounted.current?.scene.tap?.(id);
            latest.current.onTap?.(id);
          },
        });
        mounted.current = { stage, scene: scene.mount(stage, kit, latest.current.props) };
        // Pas tonen als het eerste beeldje er staat; tot dan blijft de tekening staan.
        void stage.shown.then(() => live && setState('ready'));
      })
      .catch(() => live && setState('failed'));
    return () => {
      live = false;
      mounted.current = null;
      stage?.dispose();
    };
    // De scène wordt één keer opgebouwd; nieuwe props gaan via `update`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!can || state === 'failed') return <>{fallback}</>;
  return (
    <div className={cn('relative', className)}>
      <canvas
        ref={canvas}
        role="img"
        aria-label={label}
        className={cn('absolute inset-0 size-full transition-opacity duration-500', state === 'ready' ? 'opacity-100' : 'opacity-0')}
      />
      {state === 'loading' && fallback && <div className="absolute inset-0">{fallback}</div>}
    </div>
  );
}
