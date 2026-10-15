'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight,BookOpen,ChartNoAxesCombined,Repeat2,Settings } from 'lucide-react';
import type { ReactNode } from 'react';
import { useOntleedReady } from './use-ready';
import './ontleed.css';
export function OntleedShell({children}:{children:ReactNode}) {
  const pathname=usePathname();useOntleedReady();
  return <div className="ontleed"><a className="o-skip" href="#o-main">Naar de inhoud</a><header className="o-header"><div><Link className="o-brand" href="/"><span aria-hidden>[o]</span> ontleed<span className="o-brand-dot">.</span></Link><nav aria-label="Hoofdnavigatie"><Link href="/" aria-current={pathname==='/'?'page':undefined}>Leerpad</Link><Link href="/lessen" aria-current={pathname==='/lessen'?'page':undefined}><BookOpen size={17}/> Lessen</Link><Link href="/herhalen" aria-current={pathname==='/herhalen'?'page':undefined}><Repeat2 size={17}/> Herhalen</Link><Link href="/voortgang" aria-current={pathname==='/voortgang'?'page':undefined}><ChartNoAxesCombined size={17}/> Voortgang</Link></nav><Link className="o-header-settings" href="/instellingen" aria-label="Instellingen"><Settings size={20}/></Link></div></header><main id="o-main" tabIndex={-1} className="o-main">{children}</main><footer className="o-footer"><span>Ontleed · van woord tot volle zin</span><div><Link href="/bronnen">Bronnen</Link><Link href="/oefenvormen">Gereedschap</Link><Link href="/argumentatie">Argumentatie & drogredenen <ArrowUpRight size={14}/></Link></div></footer></div>;
}
