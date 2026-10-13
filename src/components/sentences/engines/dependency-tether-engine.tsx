'use client';

import { ArrowRight, Link2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { TetherExercise } from '@/content/sentences/types';
import { cn } from '@/lib/cn';
import type { SentenceEngineProps } from './shared';

type Point = { x: number; y: number };

export function DependencyTetherEngine({ exercise, answer, onChange, disabled = false }: SentenceEngineProps & { exercise: TetherExercise }) {
  const [source, setSource] = useState('');
  const [notice, setNotice] = useState('');
  const [geometry, setGeometry] = useState<{ width: number; height: number; points: Record<string, Point> }>({ width: 1, height: 1, points: {} });
  const stage = useRef<HTMLDivElement>(null);
  const nodes = useRef(new Map<string, HTMLButtonElement>());
  const dragFrom = useRef('');
  const suppressClick = useRef(false);
  const tokenText = (id: string) => exercise.tokens.find((token) => token.id === id)?.text ?? id;

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const measure = () => {
      const bounds = element.getBoundingClientRect();
      const points = Object.fromEntries([...nodes.current].map(([id, node]) => {
        const box = node.getBoundingClientRect();
        return [id, { x: box.left - bounds.left + box.width / 2, y: box.top - bounds.top }];
      }));
      setGeometry({ width: Math.max(bounds.width, 1), height: Math.max(bounds.height, 1), points });
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(element);
    window.addEventListener('resize', measure);
    return () => { observer?.disconnect(); window.removeEventListener('resize', measure); };
  }, [exercise.id, exercise.tokens]);

  const connect = (from: string, to: string) => {
    if (disabled || !from || from === to) return;
    if (answer.links.some((link) => link.from === from && link.to === to)) {
      setNotice('Deze verbinding bestaat al. Je kunt haar hieronder verwijderen.'); return;
    }
    onChange({ links: [...answer.links, { from, to }] });
    setSource('');
    setNotice(`Verbinding gemaakt: ${tokenText(from)} naar ${tokenText(to)}. Controleer later of die afhankelijkheid klopt.`);
  };
  const choose = (id: string) => {
    if (disabled) return;
    if (suppressClick.current) { suppressClick.current = false; return; }
    if (!source) { setSource(id); setNotice(`Van ${tokenText(id)}: kies nu het woord waarnaar de verbinding gaat.`); }
    else if (source === id) { setSource(''); setNotice('Selectie opgeheven.'); }
    else connect(source, id);
  };

  return <div className="space-y-4">
    <p className="text-small leading-relaxed text-ink-muted">Kies het beginwoord en daarna het doelwoord. Je kunt ook van het ene woord naar het andere slepen. De pijlen tonen jouw analyse.</p>
    <div ref={stage} role="group" aria-label="Verbind afhankelijke woorden" className="relative overflow-hidden rounded-card border border-line bg-surface px-4 pt-16 pb-5"
      onPointerUp={(event) => {
        const hit = typeof document.elementFromPoint === 'function' ? document.elementFromPoint(event.clientX, event.clientY) : event.target as Element;
        const to = hit?.closest('[data-tether-token]')?.getAttribute('data-tether-token') ?? '';
        if (dragFrom.current && to && dragFrom.current !== to) { connect(dragFrom.current, to); suppressClick.current = true; }
        dragFrom.current = '';
      }} onPointerCancel={() => { dragFrom.current = ''; }}>
      <svg aria-hidden focusable="false" className="pointer-events-none absolute inset-0 size-full" viewBox={`0 0 ${geometry.width} ${geometry.height}`} preserveAspectRatio="none">
        <defs><marker id={`arrow-${exercise.id}`} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z" fill="currentColor" className="text-blue-ink" /></marker></defs>
        {answer.links.map((link, index) => {
          const a = geometry.points[link.from], b = geometry.points[link.to];
          if (!a || !b) return null;
          const crest = Math.max(8, Math.min(a.y, b.y) - 20 - index * 5);
          const matches = exercise.links.some((expected) => expected.from === link.from && expected.to === link.to);
          return <path key={`${link.from}:${link.to}`} d={`M ${a.x} ${a.y} C ${a.x} ${crest}, ${b.x} ${crest}, ${b.x} ${b.y}`}
            className={cn('fill-none stroke-2 text-blue-ink', answer.checked && !matches && 'text-red-ink')} stroke="currentColor" markerEnd={`url(#arrow-${exercise.id})`} />;
        })}
      </svg>
      <div className="relative flex flex-wrap gap-3">
        {exercise.tokens.map((token, index) => <button key={token.id} ref={(node) => { if (node) nodes.current.set(token.id, node); else nodes.current.delete(token.id); }}
          data-tether-token={token.id} type="button" disabled={disabled} aria-pressed={source === token.id} aria-label={`Verbind vanaf of naar ${token.text}${exercise.tokens.filter((item) => item.text === token.text).length > 1 ? ` (woord ${index + 1})` : ''}`}
          onPointerDown={() => { if (!disabled) { suppressClick.current = false; dragFrom.current = token.id; } }}
          onClick={(event) => { if (event.detail === 0) suppressClick.current = false; choose(token.id); }}
          className={cn('min-h-12 touch-none rounded-control border-2 bg-surface px-3 py-2 font-serif text-lead disabled:cursor-default', source === token.id ? 'border-blue-ink bg-blue-soft text-blue-ink' : 'border-line text-ink hover:border-blue-line')}>
          {token.text}
        </button>)}
      </div>
    </div>
    <p role="status" className="min-h-6 text-small leading-relaxed text-ink-muted">{notice || 'Nog geen beginwoord gekozen.'}</p>
    <section aria-label="Jouw verbindingen"><h3 className="mb-2 flex items-center gap-2 font-display text-small font-bold"><Link2 aria-hidden className="size-4" />Jouw verbindingen</h3>
      {answer.links.length === 0 ? <p className="text-small text-ink-muted">Maak zelf de verbindingen die je nodig vindt.</p> : <ul className="space-y-2">
        {answer.links.map((link) => {
          const correct = exercise.links.some((expected) => expected.from === link.from && expected.to === link.to);
          const feedback = exercise.distractorFeedback?.[`${link.from}:${link.to}`] ?? exercise.distractorFeedback?.[`${link.from}->${link.to}`]
            ?? exercise.distractorFeedback?.[link.from] ?? exercise.distractorFeedback?.[link.to]
            ?? 'Deze koppeling verwart een afhankelijk woord met een ander zinsdeel. Zoek het woord waarvan het beginwoord echt afhankelijk is.';
          return <li key={`${link.from}:${link.to}`} className={cn('rounded-control border p-3', answer.checked && !correct ? 'border-red-line bg-red-soft' : 'border-line bg-sunken')}>
            <div className="flex items-center gap-2 text-small"><span>{tokenText(link.from)}</span><ArrowRight aria-hidden className="size-4" /><span>{tokenText(link.to)}</span>
              <button type="button" disabled={disabled} aria-label={`Verwijder verbinding ${tokenText(link.from)} naar ${tokenText(link.to)}`} className="ml-auto grid min-h-11 min-w-11 place-items-center rounded-control hover:bg-surface disabled:opacity-30" onClick={() => { onChange({ links: answer.links.filter((item) => item.from !== link.from || item.to !== link.to) }); setNotice('Verbinding verwijderd. Je kunt een andere verbinding maken.'); }}><X aria-hidden className="size-4" /></button>
            </div>
            {answer.checked && !correct && <p className="mt-2 text-small leading-relaxed text-red-ink">{feedback}</p>}
          </li>;
        })}
      </ul>}
      {answer.checked && !answer.correct && answer.links.every((link) => exercise.links.some((expected) => expected.from === link.from && expected.to === link.to)) && <p className="mt-3 text-small leading-relaxed text-ink-muted">De gemaakte koppelingen zijn passend, maar je analyse bevat nog niet alle benodigde verbindingen.</p>}
    </section>
  </div>;
}
