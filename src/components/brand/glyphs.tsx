import { Layers, Shapes } from 'lucide-react';
import type { ReactNode } from 'react';

/** Tekeningen per bouwlaag en per domein, overgenomen uit de oorspronkelijke app. Onbekende id's krijgen een neutraal icoon. */
const LAYER_PATHS: Record<string, ReactNode> = {
  letter: <path d="M7 19 12 5l5 14M9 14h6" />,
  klank: <path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2" />,
  greep: (
    <>
      <rect x="3" y="8" width="8" height="8" rx="2" />
      <rect x="13" y="8" width="8" height="8" rx="2" />
      <path d="M12 5v14" strokeDasharray="2 2" />
    </>
  ),
  deel: <path d="M5 8h4a2 2 0 1 1 4 0h4v4a2 2 0 1 0 0 4v3H5z" />,
  woord: (
    <>
      <rect x="3" y="7" width="18" height="9" rx="2.5" />
      <path d="M7 19h10" />
    </>
  ),
  groep: (
    <>
      <path d="M6 5H4v14h2M18 5h2v14h-2" />
      <rect x="7.5" y="9" width="4" height="6" rx="1" />
      <rect x="12.5" y="9" width="4" height="6" rx="1" />
    </>
  ),
  zin: (
    <>
      <path d="M3 12h13" />
      <circle cx="20" cy="12" r="1.6" fill="currentColor" />
    </>
  ),
  samen: (
    <>
      <path d="M3 8h8M13 16h8" />
      <path d="M11 8c3 0 2 8 2 8" />
      <circle cx="11" cy="8" r="1.5" fill="currentColor" />
      <circle cx="13" cy="16" r="1.5" fill="currentColor" />
    </>
  ),
  alinea: <path d="M4 6h16M4 10h16M4 14h16M4 18h9" />,
};

const DOMAIN_PATHS: Record<string, ReactNode> = {
  orth: (
    <>
      <path d="M4 17 8.5 5 13 17M5.8 13h5.4" />
      <path d="m14.5 15 2.5 2.5L21.5 12" />
    </>
  ),
  fon: (
    <>
      <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
      <path d="M15.5 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" />
    </>
  ),
  tekst: (
    <>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4M10 12h5M10 16h5" />
    </>
  ),
  morf: (
    <>
      <rect x="3" y="8" width="8" height="8" rx="2" />
      <rect x="13" y="8" width="8" height="8" rx="2" />
      <path d="M11 12h2" />
    </>
  ),
  syn: (
    <>
      <rect x="3" y="5" width="18" height="4" rx="1.5" />
      <rect x="3" y="15" width="11" height="4" rx="1.5" />
      <path d="M17 17h4M19 15v4" />
    </>
  ),
  sem: (
    <>
      <circle cx="12" cy="11" r="7" />
      <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.5M12 16v.01" />
    </>
  ),
  prag: (
    <>
      <path d="M4 5h16v10H9l-5 4z" />
      <path d="M8 10h.01M12 10h.01M16 10h.01" />
    </>
  ),
};

type GlyphProps = { id: string; className?: string };

function Glyph({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {children}
    </svg>
  );
}

export function LayerGlyph({ id, className = 'size-5' }: GlyphProps) {
  const paths = LAYER_PATHS[id];
  return paths ? <Glyph className={className}>{paths}</Glyph> : <Layers aria-hidden className={className} />;
}

export function DomainGlyph({ id, className = 'size-5' }: GlyphProps) {
  const paths = DOMAIN_PATHS[id];
  return paths ? <Glyph className={className}>{paths}</Glyph> : <Shapes aria-hidden className={className} />;
}
