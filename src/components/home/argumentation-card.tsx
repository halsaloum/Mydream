'use client';

import { ArrowRight, Network } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';

export function ArgumentationCard() {
  return <section data-accent="blue" className="mt-4 rounded-card border-2 border-blue-line bg-blue-soft p-5 shadow-slab-sm" aria-labelledby="argumentatie-titel">
    <h2 id="argumentatie-titel" className="flex items-center gap-2 font-display text-body font-extrabold"><Network aria-hidden className="size-5 text-blue-ink" />Argumentatie & drogredenen</h2>
    <p className="mt-2 text-small leading-relaxed text-ink-soft">Leid met sterke taal en heldere argumenten. Herken drogredenen, onderbouw je besluiten en reageer zorgvuldig op kritiek. Met uitgebreide werksituaties en interactieve kaarten.</p>
    <ButtonLink href="/argumentatie" variant="accent" className="mt-4 max-sm:w-full">Verken het leerpad<ArrowRight aria-hidden className="size-4" /></ButtonLink>
  </section>;
}
