'use client';

import { GitBranch, Link2, Network, RotateCcw } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { useArgumentation } from '@/state/argumentation';
import { useHydrated } from '@/state/hydration';
import { ARGUMENT_MAP_PRESETS, MAP_KIND_LABELS, analyzeArgumentMap, argumentMapRanks, deactivateArgumentNode, validateArgumentMap, type ArgumentAttack, type ArgumentInference, type ArgumentMap, type ArgumentNode, type ArgumentNodeKind } from '@/lib/argumentation/maps';

export type { ArgumentNode, ArgumentInference, ArgumentAttack, ArgumentMap } from '@/lib/argumentation/maps';
export type ArgumentDiagramProps = ArgumentMap & { title?: string };
type Bounds = { x: number; y: number; width: number; height: number };
type Geometry = { width: number; height: number; boxes: Record<string, Bounds> };

const NODE_TONES: Record<ArgumentNode['kind'], string> = {
  claim: 'border-green-line bg-green-soft', premise: 'border-blue-line bg-blue-soft', assumption: 'border-purple-line bg-purple-soft border-dashed', objection: 'border-orange-line bg-orange-soft', intermediate: 'border-teal-line bg-teal-soft', warrant: 'border-purple-line bg-purple-soft', backing: 'border-slate-line bg-slate-soft', qualifier: 'border-green-line bg-white border-dashed',
};

function connectingPath(from: Bounds, to: Bounds, lane = 14, side: 'left' | 'right' = 'left') {
  // Long edges go around intervening cards, especially when mobile stacks a rank.
  // Passing behind cards would misleadingly look like support for each intervening node.
  if (to.y - (from.y + from.height) > 120) {
    const startX = side === 'left' ? from.x : from.x + from.width;
    const endX = side === 'left' ? to.x : to.x + to.width;
    const startY = from.y + from.height / 2;
    const endY = to.y + to.height / 2;
    return `M${startX},${startY} C${lane},${startY} ${lane},${endY} ${endX},${endY}`;
  }
  const x1 = from.x + from.width / 2;
  const y1 = from.y + from.height;
  const x2 = to.x + to.width / 2;
  const y2 = to.y;
  const bend = (y1 + y2) / 2;
  return `M${x1},${y1} C${x1},${bend} ${x2},${bend} ${x2},${y2}`;
}

/** Full HTML propositions stay readable; an SVG layer draws their measured relations. */
export function ArgumentDiagram({ nodes, inferences, attacks, title = 'Jouw reconstructie' }: ArgumentDiagramProps) {
  const id = useId().replace(/:/g, '');
  const container = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<Geometry>({ width: 0, height: 0, boxes: {} });
  const map = { nodes, inferences, attacks };
  const analysis = analyzeArgumentMap(map);
  const ranks = argumentMapRanks(map);
  const levels = [...new Set(ranks.map((item) => item.rank))].sort((a, b) => a - b);
  const signature = JSON.stringify(map);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const measure = () => {
      const outer = element.getBoundingClientRect();
      const boxes: Record<string, Bounds> = {};
      element.querySelectorAll<HTMLElement>('[data-map-id]').forEach((item) => {
        const rect = item.getBoundingClientRect();
        const key = item.dataset.mapId;
        if (key) boxes[key] = { x: rect.left - outer.left, y: rect.top - outer.top, width: rect.width, height: rect.height };
      });
      const next = { width: outer.width, height: outer.height, boxes };
      setGeometry((previous) => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element.querySelectorAll<HTMLElement>('[data-map-id]').forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [signature]);
  const box = (key: string) => geometry.boxes[key];
  const nodeName = (key: string) => nodes.find((node) => node.id === key)?.text ?? key;
  const active = (key: string) => { const node = nodes.find((item) => item.id === key); return Boolean(node && node.active !== false && node.text.trim()); };
  return <figure className="overflow-hidden rounded-card border border-line bg-sunken">
    <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-white px-5 py-4"><span className="flex items-center gap-2 font-display font-bold text-ink"><Network size={19} aria-hidden="true" />{title}</span><span className="text-caption text-ink-muted">Uitspraken → afleidingen → uitspraken</span></figcaption>
    <div ref={container} className="relative space-y-14 px-8 py-7 sm:space-y-16 sm:px-10">
      {geometry.width > 0 && <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${geometry.width} ${geometry.height}`} preserveAspectRatio="none">
        <defs>
          {['support', 'warrant', 'qualifier', 'attack'].map((tone) => <marker key={tone} id={`${id}-${tone}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L9 5L1 9" fill={tone === 'support' ? '#0a6694' : 'white'} stroke={tone === 'support' ? '#0a6694' : tone === 'warrant' ? '#6f35a0' : tone === 'qualifier' ? '#2f6b00' : '#b42318'} strokeWidth="1.8" /></marker>)}
        </defs>
        {inferences.flatMap((inference) => {
          const step = box(inference.id);
          const destination = box(inference.to);
          const complete = analysis.inferences.find((state) => state.id === inference.id)?.complete;
          if (!step) return [];
          return [
            ...inference.from.map((source, sourceIndex) => box(source) ? <path key={`${inference.id}-${source}`} d={connectingPath(box(source)!, step, 10 + sourceIndex * 6)} fill="none" stroke="#0a6694" strokeWidth="2.3" strokeDasharray={complete ? undefined : '6 5'} opacity={complete ? 1 : 0.45} markerEnd={`url(#${id}-support)`} /> : null),
            destination ? <path key={`${inference.id}-result`} d={connectingPath(step, destination)} fill="none" stroke="#0a6694" strokeWidth="2.8" strokeDasharray={complete ? undefined : '6 5'} opacity={complete ? 1 : 0.45} markerEnd={`url(#${id}-support)`} /> : null,
            inference.warrant && active(inference.warrant) && box(inference.warrant) ? <path key={`${inference.id}-warrant`} d={connectingPath(box(inference.warrant)!, step, geometry.width - 22, 'right')} fill="none" stroke="#6f35a0" strokeWidth="2.3" strokeDasharray="3 5" markerEnd={`url(#${id}-warrant)`} /> : null,
          ];
        })}
        {nodes.map((node) => node.qualifies && active(node.id) && box(node.id) && box(node.qualifies) ? <path key={`${node.id}-qualifier`} d={connectingPath(box(node.id)!, box(node.qualifies)!, geometry.width - 14, 'right')} fill="none" stroke="#2f6b00" strokeWidth="2" strokeDasharray="2 5" markerEnd={`url(#${id}-qualifier)`} /> : null)}
        {attacks.map((attack, index) => {
          const from = box(attack.from);
          const to = box(attack.to);
          if (!from || !to || !active(attack.from)) return null;
          const gutter = geometry.width - 12 - index * 7;
          const startX = from.x + from.width;
          const startY = from.y + from.height / 2;
          const endX = to.x + to.width;
          const endY = to.y + to.height / 2;
          return <path key={attack.id} d={`M${startX},${startY} C${gutter},${startY} ${gutter},${endY} ${endX},${endY}`} fill="none" stroke="#b42318" strokeWidth="2.4" strokeDasharray={attack.kind === 'undercut' ? '7 4' : undefined} markerEnd={`url(#${id}-attack)`} />;
        })}
      </svg>}
      {levels.map((level) => <div key={level} className="relative flex flex-wrap items-start justify-center gap-5 sm:gap-7">
        {ranks.filter((item) => item.rank === level).map((item) => {
          if (item.type === 'node') {
            const node = nodes.find((entry) => entry.id === item.id)!;
            return <article key={node.id} data-map-id={node.id} aria-label={`${MAP_KIND_LABELS[node.kind]} ${node.id}`} className={cn('relative z-10 w-full max-w-[20rem] rounded-tile border-2 p-4 shadow-ambient', NODE_TONES[node.kind], !active(node.id) && 'opacity-50')}>
              <p className="text-caption font-bold text-ink-muted">{MAP_KIND_LABELS[node.kind]} · {node.id}{node.active === false ? ' · uitgeschakeld' : !node.text.trim() ? ' · nog niet ingevuld' : ''}</p>
              <p className="mt-2 whitespace-pre-wrap text-small leading-relaxed break-words text-ink">{node.text || 'Nog geen uitspraak geformuleerd.'}</p>
              {node.qualifies && active(node.id) && <p className="mt-2 text-caption font-bold text-green-ink">Kwalificeert {node.qualifies}</p>}
            </article>;
          }
          const inference = inferences.find((entry) => entry.id === item.id)!;
          const state = analysis.inferences.find((entry) => entry.id === item.id)!;
          return <div key={inference.id} data-map-id={inference.id} aria-label={`Afleiding ${inference.id}`} className={cn('relative z-10 w-full max-w-[18rem] rounded-control border-2 px-4 py-3 text-center shadow-slab-sm', state.complete ? 'border-blue-line bg-white' : 'border-line-strong bg-white border-dashed')}>
            <p className="flex items-center justify-center gap-2 font-display text-small font-bold text-blue-ink"><GitBranch size={16} aria-hidden="true" />{inference.label ?? inference.id}</p>
            <p className="mt-1 text-caption text-ink-muted">{inference.from.length > 1 ? `${inference.from.length} premissen samen` : 'Eén dragende uitspraak'}</p>
            {inference.warrant && <p className="mt-2 text-caption font-bold text-purple-ink">{active(inference.warrant) ? 'Via verbindingsregel' : 'Verbindingsregel niet opgenomen:'} {inference.warrant}</p>}
            {!state.complete && <p className="mt-2 text-caption font-bold text-ink-muted">Onderbroken: {state.missing.join(', ')}</p>}
            {state.attacks.length > 0 && <p className="mt-2 text-caption font-bold text-red-ink">Betwist · nog geen automatische weerlegging</p>}
          </div>;
        })}
      </div>)}
    </div>
    <div className="border-t border-line bg-white p-4 sm:p-5">
      <p className="text-caption text-ink-muted">Volle pijl: ondersteuning. Paarse stippelpijl: autorisatie via een verbindingsregel. Groene stippelpijl: kwalificatie. Aanval: een expliciet betwist doelwit. Een onderbroken route maakt de conclusie niet automatisch onjuist.</p>
      <details className="mt-3"><summary className="cursor-pointer text-small font-bold text-ink">Lees alle relaties in woorden</summary><ul className="mt-3 space-y-3 text-small text-ink-soft">
        {inferences.map((inference) => <li key={inference.id}><strong>{inference.label ?? inference.id}:</strong> {inference.from.map((source) => `‘${nodeName(source)}’${active(source) ? '' : ' (niet opgenomen)'}`).join(' én ')} {inference.from.length > 1 ? 'zijn de gezamenlijke grond voor' : 'is de grond voor'} deze afleiding naar ‘{nodeName(inference.to)}’.{inference.warrant ? ` De regel ‘${nodeName(inference.warrant)}’ ${active(inference.warrant) ? 'autoriseert de stap' : 'is niet opgenomen; de autorisatie is onvolledig'}.` : ''}</li>)}
        {nodes.filter((node) => node.qualifies && active(node.id)).map((node) => <li key={`${node.id}-relation`}>De kwalificatie ‘{node.text}’ begrenst het standpunt ‘{nodeName(node.qualifies!)}’.</li>)}
        {attacks.filter((attack) => active(attack.from)).map((attack) => <li key={attack.id}><strong>{attack.kind === 'undercut' ? 'Undercut op een afleiding' : attack.kind === 'rebuttal' ? 'Rebuttal tegen een conclusie' : 'Aanval op een premisse'}:</strong> ‘{nodeName(attack.from)}’ betwist {attack.kind === 'undercut' ? `de stap ${inferences.find((inference) => inference.id === attack.to)?.label ?? attack.to}` : `‘${nodeName(attack.to)}’`}.{attack.rationale && <span className="mt-1 block text-caption text-ink-muted">Jouw rechtvaardiging: {attack.rationale}</span>}</li>)}
      </ul></details>
    </div>
  </figure>;
}

const controlClass = 'min-h-11 w-full rounded-control border border-line bg-white px-3 py-2 text-small text-ink';

function nextMapId(prefix: string, map: ArgumentMap) {
  const ids = new Set([...map.nodes, ...map.inferences, ...map.attacks].map((item) => item.id));
  let index = 1;
  while (ids.has(`${prefix}${index}`)) index++;
  return `${prefix}${index}`;
}

function NodeEditor({ nodes, onChange, onAdd, open, onOpenChange }: { nodes: ArgumentNode[]; onChange: (node: ArgumentNode) => void; onAdd: (node: Omit<ArgumentNode, 'id'>) => void; open: boolean; onOpenChange: (open: boolean) => void }) {
  const id = useId();
  const [text, setText] = useState('');
  const [kind, setKind] = useState<ArgumentNodeKind>('premise');
  const [qualifies, setQualifies] = useState(nodes.find((node) => node.kind === 'claim')?.id ?? '');
  return <details open={open} onToggle={(event) => onOpenChange(event.currentTarget.open)} className="rounded-card border border-line bg-white p-4 sm:p-5">
    <summary className="cursor-pointer font-display text-title-sm font-bold text-ink">Bewerk uitspraken en voeg je eigen reden toe</summary>
    <p className="mt-3 text-small text-ink-muted">Je verandert de reconstructie. Een uitspraak uitschakelen betekent dat deze route haar niet meer gebruikt; het verklaart de uitspraak niet onwaar.</p>
    <div className="mt-5 grid gap-4 md:grid-cols-2">{nodes.map((node) => <fieldset key={node.id} className="rounded-tile border border-line bg-sunken p-4">
      <legend className="px-1 text-caption font-bold text-ink-muted">{node.id} · {MAP_KIND_LABELS[node.kind]}</legend>
      <label htmlFor={`${id}-${node.id}`} className="sr-only">Tekst van {node.id}</label>
      <textarea id={`${id}-${node.id}`} rows={3} value={node.text} onChange={(event) => onChange({ ...node, text: event.target.value })} className={`${controlClass} resize-y leading-relaxed`} />
      {!['claim', 'qualifier', 'objection'].includes(node.kind) && <label className="mt-3 flex min-h-11 items-center gap-2 text-small text-ink-soft"><input type="checkbox" checked={node.active !== false} onChange={(event) => onChange({ ...node, active: event.target.checked })} className="h-5 w-5 accent-[var(--color-navy)]" />Uitspraak {node.id} opnemen</label>}
    </fieldset>)}</div>
    <form className="mt-6 space-y-3 border-t border-line pt-5" onSubmit={(event) => { event.preventDefault(); if (text.trim()) { onAdd({ text: text.trim(), kind, ...(kind === 'qualifier' && qualifies ? { qualifies } : {}) }); setText(''); } }}>
      <h4 className="font-display font-bold text-ink">Nieuwe uitspraak</h4>
      <label htmlFor={`${id}-new-text`} className="block text-small font-bold text-ink">Formuleer een volledige uitspraak</label><textarea id={`${id}-new-text`} rows={3} value={text} onChange={(event) => setText(event.target.value)} placeholder="Bijvoorbeeld: avondtoegang geeft teamleden met late klantafspraken toch een stille werkplek." className={`${controlClass} resize-y`} />
      <div className="grid gap-3 sm:grid-cols-2"><label className="block text-small font-bold text-ink">Rol van mijn uitspraak<select value={kind} onChange={(event) => setKind(event.target.value as ArgumentNodeKind)} className={`${controlClass} mt-2`}>{Object.entries(MAP_KIND_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>{kind === 'qualifier' && <label className="block text-small font-bold text-ink">Welke conclusie begrens ik?<select value={qualifies} onChange={(event) => setQualifies(event.target.value)} className={`${controlClass} mt-2`}>{nodes.filter((node) => node.kind === 'claim' || node.kind === 'intermediate').map((node) => <option key={node.id} value={node.id}>{node.id} · {MAP_KIND_LABELS[node.kind]}</option>)}</select></label>}</div>
      <Button type="submit" variant="secondary" size="sm" disabled={!text.trim()}>Voeg mijn uitspraak toe</Button>
    </form>
  </details>;
}

function InferenceBuilder({ map, onAdd, onRemove }: { map: ArgumentMap; onAdd: (inference: Omit<ArgumentInference, 'id'>) => void; onRemove: (id: string) => void }) {
  const id = useId();
  const [sources, setSources] = useState<string[]>([]);
  const [target, setTarget] = useState(map.nodes.find((node) => node.kind === 'claim')?.id ?? '');
  const [warrant, setWarrant] = useState('');
  const [label, setLabel] = useState('');
  const sourceNodes = map.nodes.filter((node) => !['objection', 'qualifier', 'warrant'].includes(node.kind));
  return <section aria-label="Verbind je eigen redenering" className="rounded-card border border-blue-line bg-white p-4 sm:p-5">
    <h3 className="flex items-center gap-2 font-display text-title-sm font-bold"><Link2 size={20} className="text-blue-ink" aria-hidden="true" />Verbind je eigen redenering</h3>
    <p className="mt-2 text-small text-ink-muted">Kies één uitspraak voor een afzonderlijke stap, of meerdere uitspraken die samen één stap dragen. Een extra zelfstandige reden krijgt een eigen afleiding.</p>
    <form className="mt-5 space-y-4" onSubmit={(event) => { event.preventDefault(); if (sources.length && target) { onAdd({ from: sources, to: target, ...(warrant ? { warrant } : {}), ...(label.trim() ? { label: label.trim() } : {}) }); } }}>
      <fieldset className="space-y-2"><legend className="mb-2 text-small font-bold text-ink">Welke uitspraken dragen deze afleiding?</legend>{sourceNodes.map((node) => <label key={node.id} className={cn('flex min-h-12 items-start gap-3 rounded-control border p-3 text-small', sources.includes(node.id) ? 'border-blue-line bg-blue-soft' : 'border-line bg-sunken')}><input type="checkbox" checked={sources.includes(node.id)} onChange={(event) => setSources((previous) => event.target.checked ? [...previous, node.id] : previous.filter((source) => source !== node.id))} className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-navy)]" /><span><strong>{node.id}:</strong> {node.text}</span></label>)}</fieldset>
      <div className="grid gap-4 sm:grid-cols-2"><label className="block text-small font-bold text-ink">Doel van de afleiding<select value={target} onChange={(event) => setTarget(event.target.value)} className={`${controlClass} mt-2`}>{map.nodes.filter((node) => !['objection', 'qualifier'].includes(node.kind)).map((node) => <option key={node.id} value={node.id}>{node.id} · {MAP_KIND_LABELS[node.kind]}</option>)}</select></label><label className="block text-small font-bold text-ink">Welke regel autoriseert de stap?<select value={warrant} onChange={(event) => setWarrant(event.target.value)} className={`${controlClass} mt-2`}><option value="">Geen expliciete verbindingsregel</option>{map.nodes.filter((node) => node.kind === 'warrant' || node.kind === 'assumption').map((node) => <option key={node.id} value={node.id}>{node.id} · {MAP_KIND_LABELS[node.kind]}</option>)}</select></label></div>
      <p className="text-small text-ink-muted"><strong className="text-ink">Gekozen doel:</strong> {map.nodes.find((node) => node.id === target)?.text}</p>
      <label htmlFor={`${id}-label`} className="block text-small font-bold text-ink">Wat rechtvaardigt de stap? <span className="font-normal text-ink-muted">(kort label)</span></label><input id={`${id}-label`} value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Bijvoorbeeld: toepassing van de toegankelijkheidsnorm" className={controlClass} />
      <Button type="submit" variant="accent" data-accent="blue" size="sm" disabled={!sources.length || !target}>{sources.length > 1 ? 'Maak één gezamenlijke afleiding' : 'Maak mijn afleiding'}</Button>
    </form>
    <div className="mt-6 border-t border-line pt-4"><h4 className="text-small font-bold text-ink">Huidige afleidingen</h4><ul className="mt-3 space-y-2">{map.inferences.map((inference) => <li key={inference.id} className="flex flex-wrap items-center justify-between gap-2 rounded-control bg-sunken p-3 text-small"><span><strong>{inference.id}:</strong> {inference.from.join(' + ')} → {inference.to}{inference.warrant ? `, via ${inference.warrant}` : ''}</span><Button variant="ghost" size="sm" aria-label={`Verwijder afleiding ${inference.id}`} onClick={() => onRemove(inference.id)}>Verwijderen</Button></li>)}</ul></div>
  </section>;
}

function AttackBuilder({ map, presetId, onAdd, onRemove }: { map: ArgumentMap; presetId: string; onAdd: (attack: Omit<ArgumentAttack, 'id'>) => void; onRemove: (id: string) => void }) {
  const [source, setSource] = useState(map.nodes.find((node) => node.kind === 'objection')?.id ?? '');
  const [target, setTarget] = useState('');
  const [rationale, setRationale] = useState('');
  const [revealed, setRevealed] = useState<string | null>(null);
  const original = ARGUMENT_MAP_PRESETS.find((preset) => preset.id === presetId)!;
  const feedback = (attack: ArgumentAttack) => {
    const unchanged = original.nodes.every((node) => { const current = map.nodes.find((item) => item.id === node.id); return current?.text === node.text && current.kind === node.kind && current.qualifies === node.qualifies && current.active !== false; }) && original.inferences.every((inference) => { const current = map.inferences.find((item) => item.id === inference.id); return current?.to === inference.to && current.warrant === inference.warrant && JSON.stringify([...current.from].sort()) === JSON.stringify([...inference.from].sort()); });
    if (attack.from !== 'o' || !unchanged) return 'Je hebt een eigen tegenwerping of aangepaste tekst gebruikt. De verbinding is structureel toegestaan, maar dat beoordeelt haar inhoudelijke relevantie niet. Onderbouw welke uitspraak onaanvaardbaar is of waarom juist deze gevolgtrekking niet opgaat; vergelijk daarna alternatieve reconstructies.';
    const guidance = presetId === 'linked' ? 'Deze oorspronkelijke tegenwerping stelt dat er wél een alternatieve stille plek is. Zij betwist vooral de feitelijke premisse p2, terwijl de algemene norm p1 daarmee niet is weerlegd.' : presetId === 'convergent' ? 'Deze tegenwerping ontkent het geobserveerde gebruik in de proefperiode niet. Zij bevraagt de generalisatie van deadlineweek naar gewone weken, dus vooral afleiding i2. De afzonderlijke toegangsroute i1 kan blijven bestaan.' : presetId === 'serial' ? 'De selectie van de deelnemers betwist de representativiteitsaanname p2. Je kunt dit ook reconstrueren als een undercut van generalisatie i1. Zonder verdediging van die stap verliest ook de latere afleiding onderbouwd materiaal.' : 'Hier modelleren we het toezichtprobleem als een uitzondering op toepassing i1: de data over gebruik kunnen kloppen, terwijl deze uitvoering niet haalbaar is. Dat ontkent niet automatisch de algemene voorwaardelijke verbindingsregel. Een uitzondering kan op meerdere manieren worden geduid; verdedig waarom jouw verbinding de concrete tegenwerping raakt.';
    const apt = presetId === 'linked' ? attack.kind === 'premise' && attack.to === 'p2' : presetId === 'convergent' ? attack.kind === 'undercut' && attack.to === 'i2' : presetId === 'serial' ? attack.kind === 'premise' && attack.to === 'p2' || attack.kind === 'undercut' && attack.to === 'i1' : attack.kind === 'undercut' && attack.to === 'i1';
    return `${apt ? 'Je gekozen doelwit past bij deze casusduiding.' : 'Vergelijk je gekozen doelwit met deze inhoudelijke duiding; een toegestane lijn is nog geen passende analyse.'} ${guidance}`;
  };
  return <section aria-label="Beoordeel wat de tegenwerping raakt" className="rounded-card border border-orange-line bg-orange-soft p-4 sm:p-5">
    <h3 className="font-display text-title-sm font-bold text-orange-ink">Beoordeel wat de tegenwerping raakt</h3><p className="mt-2 text-small text-ink-soft">Een rebuttal betwist een conclusie. Een premisseaanval betwist een dragende uitspraak. Een undercut bevraagt de gevolgtrekking en eindigt op de afleidingsconnector.</p>
    <form className="mt-4 space-y-4" onSubmit={(event) => { event.preventDefault(); const colon = target.indexOf(':'); if (source && colon >= 0) { onAdd({ from: source, to: target.slice(colon + 1), kind: target.slice(0, colon) as ArgumentAttack['kind'], ...(rationale.trim() ? { rationale: rationale.trim() } : {}) }); setRationale(''); } }}>
      <label className="block text-small font-bold text-ink">Welke tegenwerping verbind ik?<select value={source} onChange={(event) => setSource(event.target.value)} className={`${controlClass} mt-2`}><option value="">Kies een tegenwerping</option>{map.nodes.filter((node) => node.kind === 'objection').map((node) => <option key={node.id} value={node.id}>{node.id} · Tegenwerping</option>)}</select></label><p className="text-small text-ink-soft">{map.nodes.find((node) => node.id === source)?.text}</p>
      <label className="block text-small font-bold text-ink">Wat betwist deze tegenwerping?<select value={target} onChange={(event) => setTarget(event.target.value)} className={`${controlClass} mt-2`}><option value="">Kies het precieze doelwit</option><optgroup label="Een gevolgtrekking · undercut">{map.inferences.map((inference) => <option key={inference.id} value={`undercut:${inference.id}`}>{inference.label ?? inference.id} · afleiding</option>)}</optgroup><optgroup label="Een conclusie · rebuttal">{map.nodes.filter((node) => node.kind === 'claim' || node.kind === 'intermediate').map((node) => <option key={node.id} value={`rebuttal:${node.id}`}>{node.id} · {MAP_KIND_LABELS[node.kind]}</option>)}</optgroup><optgroup label="Een dragende uitspraak · premisseaanval">{map.nodes.filter((node) => ['premise', 'assumption', 'warrant', 'backing'].includes(node.kind)).map((node) => <option key={node.id} value={`premise:${node.id}`}>{node.id} · {MAP_KIND_LABELS[node.kind]}</option>)}</optgroup></select></label>
      <label className="block text-small font-bold text-ink">Waarom raakt mijn tegenwerping juist dit doelwit?<textarea rows={2} value={rationale} onChange={(event) => setRationale(event.target.value)} className={`${controlClass} mt-2 resize-y`} /></label>
      <Button type="submit" variant="secondary" size="sm" disabled={!source || !target}>Verbind mijn tegenwerping</Button>
    </form>
    <ul className="mt-5 space-y-3">{map.attacks.map((attack) => <li key={attack.id} className="rounded-tile border border-orange-line bg-white p-4"><p className="text-small text-ink"><strong>{attack.id}:</strong> {attack.from} → {attack.kind === 'undercut' ? `afleiding ${attack.to}` : `uitspraak ${attack.to}`} · {attack.kind === 'undercut' ? 'undercut' : attack.kind === 'rebuttal' ? 'rebuttal' : 'premisseaanval'}</p>{attack.rationale && <p className="mt-2 text-small text-ink-muted">{attack.rationale}</p>}<div className="mt-3 flex flex-wrap gap-2"><Button variant="secondary" size="sm" onClick={() => setRevealed(attack.id)}>Vergelijk met casusduiding</Button><Button variant="ghost" size="sm" aria-label={`Verwijder aanval ${attack.id}`} onClick={() => onRemove(attack.id)}>Verwijderen</Button></div>{revealed === attack.id && <p role="status" className="mt-4 border-t border-line pt-3 text-small text-ink-soft">{feedback(attack)}</p>}</li>)}</ul>
    <p className="mt-4 text-caption text-ink-muted">De casusduiding bespreekt de oorspronkelijke voorbeeldtekst. Eigen formuleringen krijgen geen automatische inhoudelijke goedkeuring.</p>
  </section>;
}

function MapPrediction({ map, claimId, presetId }: { map: ArgumentMap; claimId: string; presetId: string }) {
  const id = useId();
  const candidates = map.nodes.filter((node) => ['premise', 'assumption', 'warrant', 'backing', 'intermediate'].includes(node.kind) && node.active !== false);
  const [premise, setPremise] = useState(candidates[0]?.id ?? '');
  const [claim, setClaim] = useState(claimId);
  const [choice, setChoice] = useState('');
  const [reason, setReason] = useState(() => useArgumentation.getState().workshopNotes[presetId] ?? '');
  const [committed, setCommitted] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const submittedRef = useRef(false);
  useEffect(() => {
    if (committed) feedbackRef.current?.focus({ preventScroll: true });
    else if (submittedRef.current) firstOptionRef.current?.focus({ preventScroll: true });
  }, [committed]);
  const before = analyzeArgumentMap(map).completeRoutes(claim);
  const counterfactual = deactivateArgumentNode(map, premise);
  const after = analyzeArgumentMap(counterfactual).completeRoutes(claim);
  const expected = before === after ? 'same' : after === 0 ? 'none' : 'fewer';
  const feedback = choice === 'false' ? 'Je verwart een probleem met de onderbouwing met bewijs tegen de conclusie. Een verdwenen route rechtvaardigt nog geen tegengestelde claim.' : choice === 'none' ? 'Controleer of elke afleiding afhankelijk is van de geschrapte uitspraak, ook via een tussenconclusie. Een afzonderlijke route kan dezelfde conclusie nog dragen.' : choice === 'fewer' ? 'Dit vereist dat er zowel een getroffen afleiding als een andere volledige afleiding overblijft. Twee premissen binnen één connector vormen geen twee afzonderlijke afleidingen.' : 'Dit kan alleen wanneer de actieve volledige afleidingen niet afhankelijk zijn van de weggelaten uitspraak. Controleer ook indirecte afhankelijkheden in een seriële keten.';
  return <section aria-label="Voorspel de tegenproef" className="rounded-card border border-purple-line bg-purple-soft p-4 sm:p-5">
    <h3 className="font-display text-title-sm font-bold text-purple-ink">Voorspel de tegenproef</h3><p className="mt-2 text-small text-ink-soft">Kies een uitspraak die je niet meer wilt gebruiken. Voorspel het gevolg vóór het tegenmodel verschijnt. We tellen volledige afleidingen die direct op de gekozen conclusie eindigen, met hun eerdere stappen intact.</p>
    <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="block text-small font-bold text-ink">Welke uitspraak laat ik weg?<select disabled={committed} value={premise} onChange={(event) => { setPremise(event.target.value); setChoice(''); }} className={`${controlClass} mt-2`}>{candidates.map((node) => <option key={node.id} value={node.id}>{node.id} · {MAP_KIND_LABELS[node.kind]}</option>)}</select></label><label className="block text-small font-bold text-ink">Welke conclusie beoordeel ik?<select disabled={committed} value={claim} onChange={(event) => { setClaim(event.target.value); setChoice(''); }} className={`${controlClass} mt-2`}>{map.nodes.filter((node) => ['claim', 'intermediate', 'warrant'].includes(node.kind)).map((node) => <option key={node.id} value={node.id}>{node.id} · {MAP_KIND_LABELS[node.kind]}</option>)}</select></label></div>
    <p className="mt-3 text-small text-ink-soft"><strong>Weg te laten:</strong> {map.nodes.find((node) => node.id === premise)?.text}</p>
    <fieldset disabled={committed} className="mt-4 space-y-2"><legend className="mb-2 text-small font-bold text-ink">Wat gebeurt er met de volledige afleidingen?</legend>{[
      ['none', 'Alle bestaande volledige afleidingen naar deze conclusie verdwijnen.'], ['fewer', 'Er blijven volledige afleidingen over, maar minder dan daarvoor.'], ['same', 'Het aantal volledige afleidingen blijft gelijk.'], ['false', 'De conclusie is daarmee bewezen onwaar.'],
    ].map(([value, text], index) => <label key={value} className={cn('flex min-h-12 items-start gap-3 rounded-control border p-3 text-small', choice === value ? 'border-purple-line bg-white' : 'border-line bg-white/60')}><input ref={index === 0 ? firstOptionRef : undefined} type="radio" name={id} value={value} checked={choice === value} onChange={() => setChoice(value!)} className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-purple-ink)]" /><span>{text}</span></label>)}</fieldset>
    <label className="mt-4 block text-small font-bold text-ink">Mijn verklaring vóór de tegenproef<textarea readOnly={committed} rows={3} value={reason} onChange={(event) => { setReason(event.target.value); useArgumentation.getState().saveWorkshopNote(presetId, event.target.value); }} placeholder="Volg de pijlen: welke stap verliest materiaal, en welke zelfstandige stap kan overblijven?" className={`${controlClass} mt-2 resize-y`} /></label>
    {!committed ? <Button variant="accent" data-accent="purple" size="sm" disabled={!choice || !premise} className="mt-3" onClick={() => { submittedRef.current = true; setCommitted(true); }}>Leg vast en toon de tegenproef</Button> : <div className="mt-5 space-y-4">
      <div ref={feedbackRef} tabIndex={-1} role="status" className="rounded-tile border border-purple-line bg-white p-4"><h4 className="font-display font-bold text-purple-ink">{choice === expected ? 'Je voorspelling past bij deze reconstructie' : 'Volg het verschil tussen je voorspelling en het model'}</h4><p className="mt-2 text-small text-ink-soft">{feedback}</p><p className="mt-3 text-small text-ink"><strong>Van {before} naar {after} volledige afleiding{after === 1 ? '' : 'en'}.</strong> {before === 0 && after === 0 ? 'Er bestond al geen volledige afleiding; deze ingreep laat dat ongewijzigd. Zoek eerst waarom de oorspronkelijke route onderbroken is.' : after === 0 ? 'Deze reconstructie biedt nu geen volledige route naar de gekozen conclusie. Dat bewijst niet dat zij onwaar is.' : 'De overblijvende afleiding(en) behouden hun structuur. Aanvaardbaarheid, relevantie en bezwaren moeten nog inhoudelijk worden beoordeeld.'}</p></div>
      <ArgumentDiagram {...counterfactual} title="Getoetste tegenproef · na jouw voorspelling" />
      <Button variant="secondary" size="sm" onClick={() => { setCommitted(false); setChoice(''); setReason(''); useArgumentation.getState().saveWorkshopNote(presetId, ''); }}>Voorspel opnieuw</Button>
    </div>}
  </section>;
}

function clonePreset(id: string): ArgumentMap {
  const preset = ARGUMENT_MAP_PRESETS.find((item) => item.id === id)!;
  return { nodes: preset.nodes.map((node) => ({ ...node })), inferences: preset.inferences.map((inference) => ({ ...inference, from: [...inference.from] })), attacks: preset.attacks.map((attack) => ({ ...attack })) };
}

function WorkshopContent({ presetId: providedPresetId, embedded = false }: ArgumentMapWorkshopProps) {
  const sectionId = useId().replace(/:/g, '');
  const initialPresetId = ARGUMENT_MAP_PRESETS.some((item) => item.id === providedPresetId) ? providedPresetId! : 'linked';
  const [presetId, setPresetId] = useState(initialPresetId);
  const [map, setMap] = useState<ArgumentMap>(() => useArgumentation.getState().workshops[initialPresetId] ?? clonePreset(initialPresetId));
  const [resetVersion, setResetVersion] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const preset = ARGUMENT_MAP_PRESETS.find((item) => item.id === presetId)!;
  const Heading = embedded ? 'h3' : 'h2';
  const writeMap = (candidate: ArgumentMap) => { setMap(candidate); useArgumentation.getState().saveWorkshop(presetId, candidate); };
  const replaceMap = (candidate: ArgumentMap, success: string) => {
    const errors = validateArgumentMap(candidate);
    if (errors.length) { setMessage(errors.join(' ')); return; }
    writeMap(candidate); setMessage(success);
  };
  const selectPreset = (id: string, fresh = false) => {
    const candidate = fresh ? clonePreset(id) : useArgumentation.getState().workshops[id] ?? clonePreset(id);
    setPresetId(id); setMap(candidate); setResetVersion((version) => version + 1); setMessage(null);
    if (fresh) { useArgumentation.getState().saveWorkshop(id, candidate); useArgumentation.getState().saveWorkshopNote(id, ''); }
  };
  return <section aria-label="Argumentenwerkbank" className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4"><div className="max-w-2xl">{!embedded && <p className="mb-2 text-caption font-bold text-blue-ink">Visualiseer de gevolgtrekking</p>}<Heading className={embedded ? 'font-display text-title-sm font-bold' : 'font-serif text-headline'}>{embedded ? 'Maak deze kaart je eigen.' : 'Een kaart van je redenering.'}</Heading><p className="mt-3 text-body text-ink-muted">Maak je eigen afleidingen, voeg verzwegen aannames toe en kies welk doelwit een tegenwerping raakt. Leg daarna een voorspelling vast en toets je reconstructie met een tegenproef.</p></div><Button variant="ghost" size="sm" onClick={() => selectPreset(presetId, true)}><RotateCcw size={16} aria-hidden="true" />Herstel de casus</Button></div>
    {providedPresetId === undefined && <div role="group" aria-label="Kies een argumentstructuur" className="flex flex-wrap gap-2">{ARGUMENT_MAP_PRESETS.map((item) => <Button key={item.id} variant={presetId === item.id ? 'accent' : 'secondary'} data-accent="blue" size="sm" aria-pressed={presetId === item.id} onClick={() => selectPreset(item.id)}>{item.title}</Button>)}</div>}
    <p className="rounded-tile border border-blue-line bg-blue-soft p-4 text-small text-ink-soft">{preset.description} <strong>{preset.investigation}</strong></p>
    <nav aria-label="Navigatie in de argumentenwerkbank" className="sticky top-16 z-20 flex flex-wrap gap-1 rounded-control border border-line bg-white/95 p-2 shadow-ambient backdrop-blur">{[['diagram', 'Kaart'], ['nodes', 'Uitspraken'], ['inferences', 'Afleidingen'], ['attacks', 'Tegenwerping'], ['prediction', 'Tegenproef']].map(([target, label]) => <a key={target} href={`#${sectionId}-${target}`} onClick={() => { if (target === 'nodes') setEditorOpen(true); }} className="inline-flex min-h-11 items-center rounded-chip px-3 text-small font-bold text-blue-ink hover:bg-blue-soft">{label}</a>)}</nav>
    <div id={`${sectionId}-diagram`} className="scroll-mt-48 sm:scroll-mt-36"><ArgumentDiagram {...map} /></div>
    {message && <p role="status" className="rounded-control border border-line bg-white p-4 text-small text-ink-soft">{message}</p>}
    <div id={`${sectionId}-nodes`} className="scroll-mt-48 sm:scroll-mt-36"><NodeEditor key={`nodes-${presetId}-${resetVersion}`} nodes={map.nodes} open={editorOpen} onOpenChange={setEditorOpen} onChange={(node) => writeMap({ ...map, nodes: map.nodes.map((entry) => entry.id === node.id ? node : entry) })} onAdd={(node) => replaceMap({ ...map, nodes: [...map.nodes, { ...node, id: nextMapId('n', map) }] }, 'Je uitspraak staat op de kaart. Verbind haar nu met een afleiding of kies het doelwit van een tegenwerping.')} /></div>
    <div id={`${sectionId}-inferences`} className="scroll-mt-48 sm:scroll-mt-36"><InferenceBuilder key={`inferences-${presetId}-${resetVersion}`} map={map} onAdd={(inference) => replaceMap({ ...map, inferences: [...map.inferences, { ...inference, id: nextMapId('i', map) }] }, 'Je afleiding is toegevoegd. De kaart toont haar structuur; de inhoudelijke rechtvaardiging moet je zelf verdedigen.')} onRemove={(id) => replaceMap({ ...map, inferences: map.inferences.filter((inference) => inference.id !== id), attacks: map.attacks.filter((attack) => attack.to !== id) }, 'De afleiding en eventuele aanvallen op deze stap zijn verwijderd. Controleer afhankelijkheden verderop in de kaart.')} /></div>
    <div id={`${sectionId}-attacks`} className="scroll-mt-48 sm:scroll-mt-36"><AttackBuilder key={`attacks-${presetId}-${resetVersion}`} map={map} presetId={presetId} onAdd={(attack) => replaceMap({ ...map, attacks: [...map.attacks, { ...attack, id: nextMapId('a', map) }] }, 'Je aanval is verbonden. Vergelijk het gekozen doelwit met de casusduiding en verdedig de inhoudelijke relevantie.')} onRemove={(id) => writeMap({ ...map, attacks: map.attacks.filter((attack) => attack.id !== id) })} /></div>
    <div id={`${sectionId}-prediction`} className="scroll-mt-48 sm:scroll-mt-36"><MapPrediction key={`prediction-${resetVersion}-${JSON.stringify(map)}`} map={map} claimId={preset.claimId} presetId={presetId} /></div>
    <details className="rounded-card border border-line bg-sunken p-4 sm:p-5"><summary className="cursor-pointer font-display font-bold text-ink">Zo lees je de kaart</summary><div className="mt-3 space-y-3 text-small text-ink-muted"><p>Volg de stap van reden naar standpunt. Meerdere premissen die op één connector uitkomen werken samen. Meerdere connectors naar dezelfde conclusie vormen afzonderlijke afleidingen. Een tussenconclusie draagt daarna een volgende stap.</p><p>Een sterke leider antwoordt op het juiste bezwaar. Betwist je gesprekspartner de feiten, jouw gevolgtrekking of het besluit zelf? Verbind de tegenwerping met dat precieze doelwit en leg uit waarom.</p><p>Maak verzwegen aannames zichtbaar en formuleer een passend voorbehoud. Een mooie kaart vervangt geen aanvaardbare redenen: toets de feiten, de relevantie en de volledigheid van je onderbouwing.</p></div></details>
    <p className="text-caption text-ink-muted">Je werkkaart en aantekening blijven per voorbeeld beschikbaar. ‘Herstel de casus’ maakt dat voorbeeld opnieuw leeg. Deze oefening geeft geen automatische voltooiing of waarheidsscore.</p>
  </section>;
}

export type ArgumentMapWorkshopProps = { presetId?: string; embedded?: boolean };

export function ArgumentMapWorkshop({ presetId, embedded }: ArgumentMapWorkshopProps = {}) {
  const hydrated = useHydrated();
  return hydrated ? <WorkshopContent key={presetId ?? 'free'} presetId={presetId} embedded={embedded} /> : <p role="status" className="rounded-card border border-line bg-surface p-6 text-ink-muted">Je werkkaart wordt geladen…</p>;
}
