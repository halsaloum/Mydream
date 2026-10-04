'use client';

import { Collapsible } from '@base-ui/react/collapsible';
import { ChevronDown } from 'lucide-react';
import { motion, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';

type DisclosureProps = {
  summary: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

/**
 * Uitklapper op Base UI Collapsible; Motion animeert de hoogte zodat de inhoud niet verspringt.
 * De inhoud blijft in de DOM (vindbaar met zoeken in de pagina).
 */
export function Disclosure({ summary, icon, children, defaultOpen, className }: DisclosureProps) {
  const calm = useCalmMotion();
  return (
    <Collapsible.Root defaultOpen={defaultOpen} className={cn('overflow-hidden rounded-tile border-2 border-line bg-sunken', className)}>
      <Collapsible.Trigger
        onClick={() => play('tap')}
        className="group flex min-h-12 w-full items-center gap-3 px-4 py-3 text-left font-display text-body font-bold text-ink transition-colors hover:bg-ink/[0.03]"
      >
        {icon && <span className="shrink-0 text-accent-ink">{icon}</span>}
        <span className="flex-1">{summary}</span>
        <span className="grid size-8 shrink-0 place-items-center rounded-chip bg-surface shadow-slab-sm transition-transform duration-200 group-data-[panel-open]:rotate-180">
          <ChevronDown aria-hidden className="size-4" strokeWidth={2.75} />
        </span>
      </Collapsible.Trigger>
      <Collapsible.Panel
        keepMounted
        render={(props, state) => (
          <motion.div
            {...(props as HTMLMotionProps<'div'>)}
            initial={false}
            animate={{ height: state.open ? 'auto' : 0, opacity: state.open ? 1 : 0 }}
            transition={calm ? { duration: 0 } : transition.base}
          />
        )}
        className="overflow-hidden"
      >
        <div className="px-4 pt-1 pb-4 pl-12 text-body leading-relaxed text-ink-soft">{children}</div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
