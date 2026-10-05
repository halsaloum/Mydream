'use client';

import { NavigationMenu } from '@base-ui/react/navigation-menu';
import { BookOpenText, ChartColumnIncreasing, House, Repeat2, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Wordmark } from '@/components/brand/wordmark';
import { cn } from '@/lib/cn';
import { spring, transition, useCalmMotion } from '@/lib/motion';
import { useHydrated } from '@/state/hydration';
import { useProgress } from '@/state/progress';

const NAV: { href: Route; label: string; icon: typeof House }[] = [
  { href: '/', label: 'Leren', icon: House },
  { href: '/lessen', label: 'Lessen', icon: BookOpenText },
  { href: '/herhalen', label: 'Herhalen', icon: Repeat2 },
  { href: '/voortgang', label: 'Voortgang', icon: ChartColumnIncreasing },
];

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

function useReviewCount() {
  const hydrated = useHydrated();
  const count = useProgress((state) => Object.keys(state.review).length);
  return hydrated ? count : 0;
}

function Badge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="ml-1 inline-grid h-5 min-w-5 animate-bounce-in place-items-center rounded-full bg-orange bg-linear-to-b from-white/25 to-transparent px-1.5 text-[0.7rem] leading-none font-extrabold text-orange-on tabular-nums shadow-[0_3px_8px_-3px_var(--color-orange-deep)]">
      <span className="sr-only">, </span>
      {count > 99 ? '99+' : count}
      <span className="sr-only"> om te herhalen</span>
    </span>
  );
}

/** Elke pagina komt zacht omhoog binnen; bij rustige beweging alleen een korte fade. */
function PageTransition({ children }: { children: ReactNode }) {
  const calm = useCalmMotion();
  return (
    <motion.div initial={calm ? { opacity: 0 } : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={calm ? { duration: 0.12 } : transition.slow}>
      {children}
    </motion.div>
  );
}

/** De vaste schil: bovenbalk met navigatie (desktop) en tabbalk onderaan (mobiel), beide op Base UI NavigationMenu. */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reviewCount = useReviewCount();

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#inhoud"
        className="sr-only-focusable fixed top-3 left-3 z-[90] rounded-control bg-ink px-4 py-3 font-bold text-white"
      >
        Naar de inhoud
      </a>
      <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/85 shadow-[0_8px_24px_-20px_rgb(60_40_10/0.35)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-canvas/70">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-gutter">
          <Wordmark />
          <NavigationMenu.Root aria-label="Hoofdnavigatie" className="ml-auto hidden md:block">
            <NavigationMenu.List className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <NavigationMenu.Item key={item.href}>
                    <NavigationMenu.Link
                      active={active}
                      render={<Link href={item.href} />}
                      className={cn(
                        'group relative flex min-h-11 items-center gap-2 rounded-control px-3.5 font-display text-body font-bold transition-colors',
                        active ? 'text-ink' : 'text-ink-muted hover:bg-ink/[0.05] hover:text-ink',
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          transition={spring.layout}
                          className="absolute inset-0 -z-10 rounded-control border-2 border-line bg-surface shadow-slab-sm"
                        />
                      )}
                      <item.icon
                        aria-hidden
                        className={cn(
                          'size-[1.15rem] transition-transform duration-300 ease-[var(--ease-spring)] group-hover:-translate-y-px group-hover:scale-110',
                          active && 'text-green-ink',
                        )}
                        strokeWidth={2.4}
                      />
                      {item.label}
                      {item.href === '/herhalen' && <Badge count={reviewCount} />}
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                );
              })}
            </NavigationMenu.List>
          </NavigationMenu.Root>
          <Link
            href="/instellingen"
            aria-current={isActive(pathname, '/instellingen') ? 'page' : undefined}
            className={cn(
              'group ml-auto grid size-11 place-items-center rounded-control transition-colors md:ml-0',
              isActive(pathname, '/instellingen') ? 'border-2 border-line bg-surface text-ink shadow-slab-sm' : 'text-ink-muted hover:bg-ink/[0.06] hover:text-ink',
            )}
          >
            <Settings
              aria-hidden
              className="size-5 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:rotate-90"
              strokeWidth={2.4}
            />
            <span className="sr-only">Instellingen</span>
          </Link>
        </div>
      </header>

      <main id="inhoud" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-gutter pt-8 pb-32 outline-none md:pt-10 md:pb-20">
        <PageTransition key={pathname}>{children}</PageTransition>
      </main>

      <NavigationMenu.Root
        aria-label="Hoofdnavigatie (mobiel)"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/85 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_-18px_rgb(60_40_10/0.3)] backdrop-blur-xl backdrop-saturate-150 md:hidden"
      >
        <NavigationMenu.List className="mx-auto grid max-w-md grid-cols-4">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <NavigationMenu.Item key={item.href}>
                <NavigationMenu.Link
                  active={active}
                  render={<Link href={item.href} />}
                  className={cn(
                    'relative flex min-h-16 flex-col items-center justify-center gap-1 text-caption font-bold transition-colors',
                    active ? 'text-green-ink' : 'text-ink-muted',
                  )}
                >
                  <span className="relative grid h-8 w-14 place-items-center rounded-full">
                    {active && (
                      <motion.span
                        layoutId="tab-active"
                        transition={spring.layout}
                        className="absolute inset-0 rounded-full border border-green-line bg-green-soft shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_4px_10px_-6px_var(--color-green-deep)]"
                      />
                    )}
                    <item.icon
                      aria-hidden
                      className={cn('relative size-5 transition-transform duration-300 ease-[var(--ease-spring)]', active && '-translate-y-px scale-110')}
                      strokeWidth={2.5}
                    />
                    {item.href === '/herhalen' && reviewCount > 0 && (
                      <span className="absolute -top-1 right-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-orange px-1 text-[0.625rem] font-extrabold text-orange-on">
                        {reviewCount > 9 ? '9+' : reviewCount}
                      </span>
                    )}
                  </span>
                  {item.label}
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            );
          })}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  );
}

type PageHeaderProps = { title: ReactNode; description?: ReactNode; action?: ReactNode; className?: string };

/** Paginakop: één heldere titel, korte toelichting en de hoofdactie van de pagina. */
export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0">
        <h1 className="bg-linear-to-br from-ink to-ink-soft bg-clip-text font-display text-headline font-extrabold tracking-[-0.03em] text-transparent">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-lead text-ink-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
