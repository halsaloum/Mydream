'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, BookOpen, ChevronDown, Milestone, Repeat2, Settings, Wrench } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import './ontleed.css';
import './learning-shell.css';

const navigation = [
  { href: '/', title: 'Leren', icon: Milestone },
  { href: '/herhalen', title: 'Oefenen', icon: Repeat2 },
  { href: '/lessen', title: 'Bibliotheek', icon: BookOpen },
] as const;

export function OntleedShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (menu.current) menu.current.open = false;
    const dismiss = (event: PointerEvent) => {
      if (menu.current?.open && event.target instanceof Node && !menu.current.contains(event.target)) menu.current.open = false;
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [pathname]);
  return <div className="ontleed o-learning-app">
    <a className="o-skip" href="#o-main">Naar de inhoud</a>
    <header className="o-learning-header">
      <div className="o-learning-header-inner">
        <Link className="o-learning-brand" href="/" aria-label="Ontleed, naar het leerpad"><span aria-hidden>o.</span>ontleed</Link>
        <nav className="o-learning-navigation" aria-label="Hoofdnavigatie">
          {navigation.map(({ href, title, icon: Icon }) => <Link href={href} key={href} aria-current={pathname === href ? 'page' : undefined}><Icon size={18}/><span>{title}</span></Link>)}
        </nav>
        <details className="o-learning-menu" ref={menu} onKeyDown={event => { if (event.key === 'Escape' && menu.current) { menu.current.open = false; menu.current.querySelector('summary')?.focus(); } }}>
          <summary>Meer <ChevronDown size={15}/></summary>
          <nav aria-label="Meer ontdekken">
            <Link href="/oefenvormen"><Wrench size={17}/>Taalwerkplaats</Link>
            <Link href="/voortgang"><Milestone size={17}/>Mijn leerproces</Link>
            <Link href="/bronnen"><BookOpen size={17}/>Bronnen</Link>
            <Link href="/instellingen"><Settings size={17}/>Instellingen</Link>
            <Link className="o-learning-argument" href="/argumentatie">Argumentatie & drogredenen <ArrowUpRight size={16}/></Link>
          </nav>
        </details>
      </div>
    </header>
    <div className="o-learning-content">
      <main id="o-main" tabIndex={-1} className="o-main">{children}</main>
      <footer className="o-learning-footer"><span>Van woord naar eigen tekst.</span><div><Link href="/bronnen">Bronnen</Link><Link href="/argumentatie">Argumentatie <ArrowUpRight size={13}/></Link></div></footer>
    </div>
  </div>;
}
