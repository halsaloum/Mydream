import Link from 'next/link';
import { cn } from '@/lib/cn';

/** Het woordmerk: een klein potlood (Pim, schuin) en "pennig". */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('group inline-flex items-center gap-2 rounded-control py-1 pr-2', className)} aria-label="pennig, naar de startpagina">
      <svg viewBox="0 0 32 32" aria-hidden className="size-8 -rotate-[28deg] transition-transform duration-300 group-hover:-rotate-[18deg]">
        <rect x="11" y="1.5" width="10" height="5" rx="1.6" fill="var(--color-red)" stroke="var(--color-ink)" strokeWidth="1.6" />
        <rect x="11" y="6.5" width="10" height="3" fill="#d5dae2" stroke="var(--color-ink)" strokeWidth="1.6" />
        <path d="M11 9.5h10V23H11z" fill="var(--color-yellow)" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M11 23h10l-5 7.5z" fill="#f4dcb4" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M14.6 28.4 16 30.5l1.4-2.1z" fill="var(--color-ink)" />
      </svg>
      <span className="font-display text-[1.6rem] leading-none font-extrabold tracking-[-0.04em] text-green-ink">pennig</span>
    </Link>
  );
}
