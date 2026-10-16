'use client';

import { ArrowLeft, ArrowRight, Check, HelpCircle, Layers, MousePointer2, Scale, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { conditionalHolds, lessonIllustrations, quantifierTruth, type ChecksIllustration, type ComparisonIllustration, type ConditionIllustration, type ConditionalFrequencyIllustration, type DecisionIllustration, type FlowIllustration, type IllustrationData, type IllustrationTone, type QuantifierIllustration, type RateIllustration } from '@/content/argumentation/illustrations';
import { calculateBayes } from '@/lib/argumentation/labs';
import { cn } from '@/lib/cn';
import { useCalmMotion } from '@/lib/motion';

const tones: Record<IllustrationTone, string> = {
  blue: 'border-blue-line bg-blue-soft', green: 'border-green-line bg-green-soft', orange: 'border-orange-line bg-orange-soft', purple: 'border-purple-line bg-purple-soft', slate: 'border-line bg-sunken',
};
const fmt = (value: number) => new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 1 }).format(value);
const pct = (value: number) => `${fmt(value * 100)}%`;
type Box = { x: number; y: number; width: number; height: number };
type Geometry = { width: number; height: number; boxes: Record<string, Box> };

/** Keep propositions in HTML: SVG only draws relations between their measured bounds. */
function FlowPicture({ data }: { data: FlowIllustration }) {
  const id = useId().replace(/:/g, '');
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const orderedNodes = data.rows.flatMap((row) => row).map((key) => data.nodes.find((node) => node.id === key)).filter((node) => node !== undefined);
  const focused = focusIndex === null ? undefined : orderedNodes[focusIndex];
  const container = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<Geometry>({ width: 0, height: 0, boxes: {} });
  const signature = JSON.stringify(data);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const measure = () => {
      const outer = element.getBoundingClientRect();
      const boxes: Record<string, Box> = {};
      element.querySelectorAll<HTMLElement>('[data-illustration-node]').forEach((item) => {
        const box = item.getBoundingClientRect();
        const key = item.dataset.illustrationNode;
        if (key) boxes[key] = { x: box.left - outer.left, y: box.top - outer.top, width: box.width, height: box.height };
      });
      const next = { width: outer.width, height: outer.height, boxes };
      setGeometry((old) => JSON.stringify(old) === JSON.stringify(next) ? old : next);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element.querySelectorAll<HTMLElement>('[data-illustration-node]').forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [signature]);
  const name = (key: string) => data.nodes.find((node) => node.id === key)?.text ?? key;
  return <div className="rounded-tile border border-line bg-sunken">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5"><p className="flex items-center gap-2 text-caption font-semibold text-blue-ink"><MousePointer2 aria-hidden="true" size={15} />Kies een onderdeel om de verbindingen te volgen.</p><Button size="sm" variant="ghost" onClick={() => setFocusIndex(focusIndex === null ? 0 : null)}>{focusIndex === null ? 'Ontleed de kaart' : 'Toon het geheel'}</Button></div>
    <div ref={container} className="relative space-y-12 px-7 py-5 sm:px-9">
      {geometry.width > 0 && <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${geometry.width} ${geometry.height}`}>
        <defs>{['blue', 'orange', 'purple', 'green'].map((tone) => <marker key={tone} id={`${id}-${tone}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1 L9 5 L1 9" fill="none" stroke={tone === 'orange' ? '#b45309' : tone === 'purple' ? '#7139a0' : tone === 'green' ? '#35691d' : '#12668b'} strokeWidth="1.8" /></marker>)}</defs>
        {data.edges.map((edge, index) => {
          const from = geometry.boxes[edge.from];
          const to = geometry.boxes[edge.to];
          if (!from || !to) return null;
          const gap = to.y - from.y - from.height;
          const adjacent = gap >= 12 && gap <= 100;
          const side = edge.kind === 'challenge' || edge.kind === 'qualify' || edge.kind === 'authorize' || to.y <= from.y ? 'right' : 'left';
          const lane = side === 'right' ? geometry.width - 7 - (index % 3) * 5 : 7 + (index % 3) * 5;
          const x1 = adjacent ? from.x + from.width / 2 : side === 'right' ? from.x + from.width : from.x;
          const x2 = adjacent ? to.x + to.width / 2 : side === 'right' ? to.x + to.width : to.x;
          const y1 = adjacent ? from.y + from.height : from.y + from.height / 2;
          const y2 = adjacent ? to.y : to.y + to.height / 2;
          const middle = (y1 + y2) / 2;
          const path = adjacent ? `M${x1},${y1} C${x1},${middle} ${x2},${middle} ${x2},${y2}` : `M${x1},${y1} C${lane},${y1} ${lane},${y2} ${x2},${y2}`;
          const tone = edge.kind === 'challenge' ? 'orange' : edge.kind === 'authorize' ? 'purple' : edge.kind === 'qualify' ? 'green' : 'blue';
          const highlighted = !focused || edge.from === focused.id || edge.to === focused.id;
          return <path key={`${edge.from}-${edge.to}-${index}`} d={path} fill="none" stroke={tone === 'orange' ? '#b45309' : tone === 'purple' ? '#7139a0' : tone === 'green' ? '#35691d' : '#12668b'} strokeWidth={focused && highlighted ? 3 : 2} opacity={highlighted ? 1 : 0.2} strokeDasharray={edge.kind === 'association' ? '3 5' : edge.kind === 'challenge' || edge.kind === 'authorize' || edge.kind === 'qualify' ? '6 4' : undefined} markerEnd={edge.kind === 'association' ? undefined : `url(#${id}-${tone})`} />;
        })}
      </svg>}
      {data.rows.map((row, index) => <div key={index} className="relative flex flex-wrap items-start justify-center gap-3 sm:gap-5">{row.map((key) => {
        const node = data.nodes.find((entry) => entry.id === key);
        if (!node) return null;
        return <article key={node.id} data-illustration-node={node.id} className={cn('relative z-10 min-w-0 flex-1 basis-[10rem] rounded-tile border-2 shadow-ambient transition-shadow calm:transition-none', node.connector ? 'max-w-[22rem] border-dashed text-center' : 'max-w-[23rem]', tones[node.tone], focused?.id === node.id && 'ring-2 ring-blue-ink ring-offset-4 ring-offset-sunken')}><button type="button" aria-label={`Licht uit: ${node.label}. ${node.text}`} aria-pressed={focused?.id === node.id} onClick={() => setFocusIndex(orderedNodes.findIndex((item) => item.id === node.id))} className={cn('w-full rounded-tile px-4 py-3 text-left', node.connector && 'text-center')}><span className="block text-caption font-bold text-ink-muted">{node.label}</span><span className="mt-1 block whitespace-pre-wrap text-small leading-relaxed break-words text-ink">{node.text}</span></button></article>;
      })}</div>)}
    </div>
    {focused && <div className="space-y-4 border-t border-blue-line bg-blue-soft px-4 py-5 sm:px-5"><div className="flex items-center justify-between gap-3"><h4 className="font-display text-small font-bold text-blue-ink">Onderdeel {(focusIndex ?? 0) + 1} van {orderedNodes.length} · {focused.label}</h4><div className="flex shrink-0 gap-1"><Button size="sm" variant="ghost" aria-label="Vorig kaartonderdeel" disabled={focusIndex === 0} onClick={() => setFocusIndex((focusIndex ?? 0) - 1)}><ArrowLeft aria-hidden="true" size={16} /></Button><Button size="sm" variant="ghost" aria-label="Volgend kaartonderdeel" disabled={focusIndex === orderedNodes.length - 1} onClick={() => setFocusIndex((focusIndex ?? 0) + 1)}><ArrowRight aria-hidden="true" size={16} /></Button></div></div><div role="status" className="space-y-3 text-small leading-relaxed text-ink-soft">{data.edges.filter((edge) => edge.from === focused.id || edge.to === focused.id).map((edge, index) => <p key={index}><span className="font-semibold">{name(edge.from)}</span><span className="mx-2 font-bold text-blue-ink">{edge.label} →</span>{name(edge.to)}</p>)}{!data.edges.some((edge) => edge.from === focused.id || edge.to === focused.id) && <p>Dit onderdeel heeft in deze versie geen aangegeven verbinding. Welke reden zou je nog moeten vragen?</p>}</div></div>}
    <div className="space-y-3 border-t border-line bg-white px-4 py-4 sm:px-5"><p className="text-caption text-ink-muted">{data.legend}</p><details><summary className="min-h-8 cursor-pointer text-small font-bold text-ink">Relaties in woorden</summary><ol className="mt-3 space-y-2 text-small leading-relaxed text-ink-soft">{data.edges.map((edge, index) => <li key={index}><span className="font-semibold">{name(edge.from)}</span><span className={cn('mx-2 inline-flex items-center gap-1 text-caption font-bold', edge.kind === 'challenge' ? 'text-orange-ink' : edge.kind === 'authorize' ? 'text-purple-ink' : edge.kind === 'qualify' ? 'text-green-ink' : 'text-blue-ink')}>{edge.label}<ArrowRight aria-hidden="true" size={12} /></span>{name(edge.to)}</li>)}</ol></details></div>
  </div>;
}

export { FlowPicture as ArgumentFlowPicture };

function ChecksPicture({ data }: { data: ChecksIllustration }) {
  return <div><p className="rounded-tile border border-green-line bg-green-soft px-4 py-4 text-small font-semibold text-ink">{data.claim}</p><div className="mt-4 grid gap-3 md:grid-cols-3">{data.checks.map((check, index) => <article key={index} className={cn('rounded-tile border p-4', check.state === 'supported' ? 'border-green-line bg-white' : check.state === 'problem' ? 'border-orange-line bg-orange-soft' : 'border-blue-line bg-blue-soft')}><div className="flex items-center gap-2"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current text-caption font-bold">{index + 1}</span><h4 className="font-display text-small font-bold text-ink">{check.title}</h4></div><p className="mt-3 text-small font-semibold text-ink">{check.question}</p><p className="mt-2 text-small leading-relaxed text-ink-soft">{check.observation}</p><p className="mt-3 flex items-center gap-1.5 text-caption font-bold text-ink-muted">{check.state === 'supported' ? <Check size={14} aria-hidden="true" /> : <HelpCircle size={14} aria-hidden="true" />}{check.state === 'supported' ? 'Deze grond is gegeven' : check.state === 'problem' ? 'Een tekort in deze onderbouwing' : 'Deze vraag staat open'}</p></article>)}</div></div>;
}

const assignments = [{ id: 'tt', p: true, q: true }, { id: 'tf', p: true, q: false }, { id: 'ft', p: false, q: true }, { id: 'ff', p: false, q: false }];
function ConditionPicture({ data }: { data: ConditionIllustration }) {
  const id = useId();
  const [assignment, setAssignment] = useState('tt');
  const current = assignments.find((item) => item.id === assignment)!;
  const holds = conditionalHolds(current.p, current.q);
  return <div className="space-y-4"><div className="rounded-tile border border-purple-line bg-purple-soft p-4"><p className="text-small font-semibold text-ink">{data.rule}</p><p className="mt-2 font-mono text-lead font-bold text-purple-ink">P → Q</p><p className="mt-2 text-caption text-ink-muted">P: {data.p}<br />Q: {data.q}</p></div><fieldset><legend className="mb-3 text-small font-bold text-ink">Welke feitelijke situatie test je?</legend><div className="grid grid-cols-2 gap-3">{assignments.map((item) => <label key={item.id} className={cn('flex min-h-12 cursor-pointer items-center gap-2 rounded-control border p-3 text-small', assignment === item.id ? 'border-blue-line bg-blue-soft' : 'border-line bg-white')}><input type="radio" name={`${id}-assignment`} value={item.id} checked={assignment === item.id} onChange={() => setAssignment(item.id)} className="h-4 w-4 shrink-0 accent-[var(--color-blue)]" /><span>P {item.p ? 'waar' : 'onwaar'} · Q {item.q ? 'waar' : 'onwaar'}</span></label>)}</div></fieldset><div role="status" className={cn('rounded-tile border p-4', holds ? 'border-green-line bg-green-soft' : 'border-orange-line bg-orange-soft')}><p className="flex items-center gap-2 text-small font-bold text-ink">{holds ? <Check size={17} aria-hidden="true" /> : <X size={17} aria-hidden="true" />}{holds ? 'Deze situatie spreekt P → Q niet tegen.' : 'Dit is een tegenmodel: P is waar, maar Q is onwaar.'}</p><p className="mt-2 text-small leading-relaxed text-ink-soft">{current.p ? current.q ? 'Goedkeuring én registratie passen bij de regel. Eén passend geval bewijst nog niet dat de regel overal geldt.' : 'Het goedgekeurde dossier is niet geregistreerd. Daarmee faalt de algemene feitelijke regel in dit geval.' : current.q ? 'Het dossier is geregistreerd, maar niet goedgekeurd. De regel zegt niet dat registratie voldoende is voor goedkeuring.' : 'Het dossier is niet goedgekeurd. De regel legt dit geval geen registratievoorwaarde op; zij beweert daarmee niet dat er goedgekeurde dossiers bestaan.'}</p></div><p className="text-caption leading-relaxed text-ink-muted">{data.application} Je toetst een feitelijke uitspraak. Een afspraak over wat men hoort te doen garandeert geen naleving.</p></div>;
}

function QuantifierPicture({ data }: { data: QuantifierIllustration }) {
  const [showCounterexample, setShowCounterexample] = useState(false);
  const result = quantifierTruth(data.people);
  return <div className="space-y-4"><p className="text-small font-semibold text-ink">{data.claim}</p><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-tile border-2 border-blue-line bg-blue-soft p-4"><h4 className="text-small font-bold text-blue-ink">Groep: {data.group}</h4><p className="mt-1 text-caption text-ink-muted">{result.members} {result.members === 1 ? 'lid' : 'leden'}</p><div className="mt-3 flex flex-wrap gap-2">{data.people.filter((item) => item.member).map((item) => <div key={item.id} className={cn('rounded-control border bg-white px-3 py-2 text-small', showCounterexample && !item.property ? 'border-2 border-orange-line' : 'border-line')}><strong>{item.name}</strong><span className="mt-1 block text-caption">{item.property ? data.property : `niet ${data.property}`}</span>{showCounterexample && !item.property && <span className="mt-1 block text-caption font-bold text-orange-ink">Tegenvoorbeeld</span>}</div>)}{result.members === 0 && <p className="text-small text-ink-soft">Deze groep is leeg.</p>}</div></div><div className="rounded-tile border border-line bg-sunken p-4"><h4 className="text-small font-bold text-ink">Buiten de genoemde groep</h4><div className="mt-3 flex flex-wrap gap-2">{data.people.filter((item) => !item.member).map((item) => <div key={item.id} className="rounded-control border border-line bg-white px-3 py-2 text-small"><strong>{item.name}</strong><span className="mt-1 block text-caption">{item.property ? data.property : `niet ${data.property}`}</span></div>)}</div></div></div><div role="status" className="grid gap-3 sm:grid-cols-2"><p className={cn('rounded-tile border p-4 text-small', result.all ? 'border-green-line bg-green-soft' : 'border-orange-line bg-orange-soft')}><strong className="block">Alle groepsleden zijn {data.property}.</strong><span className="mt-2 block">In dit voorbeeld: {result.all ? 'waar' : 'onwaar'}.</span></p><p className={cn('rounded-tile border p-4 text-small', result.some ? 'border-green-line bg-green-soft' : 'border-line bg-sunken')}><strong className="block">Er is minstens één groepslid dat {data.property} is.</strong><span className="mt-2 block">In dit voorbeeld: {result.some ? 'waar' : 'onwaar'}.</span></p></div><Button size="sm" variant="secondary" aria-pressed={showCounterexample} onClick={() => setShowCounterexample((old) => !old)}>Markeer tegenvoorbeelden</Button>{showCounterexample && <p role="status" className="text-small text-ink-soft">{result.counterexamples.length ? `${result.counterexamples.length} groepslid mist de genoemde eigenschap. Eén zo'n lid volstaat tegen “alle”.` : 'Er is geen groepslid zonder de eigenschap. Buitenstaanders zijn geen tegenvoorbeeld van deze uitspraak.'}</p>}</div>;
}

function FrequencyPicture({ data }: { data: ConditionalFrequencyIllustration }) {
  const [reference, setReference] = useState<'all' | 'positive'>('all');
  const result = calculateBayes(data.prevalence, data.sensitivity, data.specificity, data.population);
  const positive = reference === 'positive';
  const total = positive ? result.positives : result.population;
  const groups = positive ? [{ label: `${data.condition} én ${data.signal}`, count: result.truePositive, className: 'bg-blue', text: 'text-blue-ink' }, { label: `geen ${data.condition}, wél ${data.signal}`, count: result.falsePositive, className: 'bg-orange', text: 'text-orange-ink' }] : [{ label: data.condition, count: result.signal, className: 'bg-blue', text: 'text-blue-ink' }, { label: `geen ${data.condition}`, count: result.noSignal, className: 'bg-orange', text: 'text-orange-ink' }];
  return <div className="space-y-4"><div className="flex flex-wrap gap-2"><Button size="sm" variant={positive ? 'secondary' : 'accent'} data-accent="blue" aria-pressed={!positive} onClick={() => setReference('all')}>Alle mail</Button><Button size="sm" variant={positive ? 'accent' : 'secondary'} data-accent="blue" aria-pressed={positive} onClick={() => setReference('positive')}>Alleen gemarkeerd</Button></div><div className="rounded-tile border border-line bg-white p-4"><p className="text-caption font-bold text-ink-muted">De noemer verandert</p><h4 className="mt-1 font-display text-title-sm font-bold text-ink">{positive ? 'Binnen de gemarkeerde groep' : 'Binnen alle mail'}: {fmt(total)}</h4><div aria-hidden="true" className="mt-4 flex h-7 overflow-hidden rounded-control bg-sunken">{groups.map((group) => <div key={group.label} className={group.className} style={{ width: `${total ? group.count / total * 100 : 0}%` }} />)}</div><dl className="mt-3 grid gap-3 sm:grid-cols-2">{groups.map((group) => <div key={group.label}><dt className={cn('text-small font-bold', group.text)}>{group.label}</dt><dd className="mt-1 text-small text-ink-soft">{fmt(group.count)} van {fmt(total)} · {pct(total ? group.count / total : 0)}</dd></div>)}</dl><p role="status" className="mt-4 border-t border-line pt-3 text-small leading-relaxed text-ink">{positive ? `De gezochte kans op ${data.condition} na ${data.signal} is ${fmt(result.truePositive)} / ${fmt(result.positives)} = ${result.posterior === null ? 'niet te bepalen' : pct(result.posterior)}.` : `De basisfrequentie is ${fmt(result.signal)} / ${fmt(result.population)} = ${pct(data.prevalence)}. Dit is vóór de markering.`}</p></div><div className="grid gap-3 sm:grid-cols-2"><p className="rounded-tile border border-blue-line bg-blue-soft p-3 text-small leading-relaxed">Van {fmt(result.signal)} echte {data.condition}: {fmt(result.truePositive)} {data.signal} · {pct(data.sensitivity)}.</p><p className="rounded-tile border border-orange-line bg-orange-soft p-3 text-small leading-relaxed">Van {fmt(result.noSignal)} zonder {data.condition}: {fmt(result.falsePositive)} toch {data.signal} · {pct(1 - data.specificity)}.</p></div><p className="text-caption text-ink-muted">Fictieve frequenties voor deze vergelijking. De noemer van sensitiviteit is de groep met {data.condition}; de gezochte kans gebruikt de gemarkeerde groep.</p></div>;
}

function RatePicture({ data }: { data: RateIllustration }) {
  const [normalized, setNormalized] = useState(false);
  const values = data.groups.map((group) => ({ ...group, value: normalized ? group.count / group.exposure * 100 : group.count }));
  const maximum = Math.max(...values.map((group) => group.value));
  return <div className="space-y-4"><div className="flex flex-wrap gap-2"><Button size="sm" variant={normalized ? 'secondary' : 'accent'} data-accent="blue" aria-pressed={!normalized} onClick={() => setNormalized(false)}>Alleen aantallen</Button><Button size="sm" variant={normalized ? 'accent' : 'secondary'} data-accent="blue" aria-pressed={normalized} onClick={() => setNormalized(true)}>Per {data.unit}</Button></div><div className="space-y-5 rounded-tile border border-line bg-white p-4">{values.map((group, index) => <div key={group.name}><div className="flex items-start justify-between gap-3"><p className="text-small font-semibold text-ink">{group.name}</p><p className="text-small font-bold text-blue-ink">{fmt(group.value)}{normalized ? ` per ${data.unit}` : ' meldingen'}</p></div><div className="mt-2 h-5 overflow-hidden rounded-control bg-sunken" aria-hidden="true"><div className={index ? 'h-full bg-purple' : 'h-full bg-blue'} style={{ width: `${maximum ? group.value / maximum * 100 : 0}%` }} /></div><p className="mt-2 text-caption text-ink-muted">{fmt(group.count)} meldingen in {fmt(group.exposure)} werkuren{normalized ? ` → ${fmt(group.count)} / ${fmt(group.exposure)} × 100 = ${fmt(group.value)}` : ''}</p></div>)}</div><p role="status" className="text-small leading-relaxed text-ink-soft">{normalized ? 'De nieuwe werkwijze heeft 6 meldingen per 100 werkuren, tegenover 12 bij de oude. Deze verhouding corrigeert de hoeveelheid werk; zij bewijst nog niet de oorzaak van het verschil.' : '18 is meer dan 12. Maar er werd ook driemaal zoveel gewerkt: alleen de aantallen beantwoorden de vergelijkingsvraag niet.'}</p></div>;
}

function DecisionPicture({ data }: { data: DecisionIllustration }) {
  const [selected, setSelected] = useState(data.options[0]?.id ?? '');
  const option = data.options.find((item) => item.id === selected);
  return <div className="space-y-4"><div className="rounded-tile border border-purple-line bg-purple-soft p-4"><h4 className="flex items-start gap-2 text-small font-bold text-ink"><Scale size={18} className="shrink-0 text-purple-ink" aria-hidden="true" />{data.question}</h4><p className="mt-2 text-small leading-relaxed text-ink-soft">Afweging: {data.criterion}</p></div><div className="grid gap-3 sm:grid-cols-3">{data.options.map((item) => <Button key={item.id} variant={selected === item.id ? 'accent' : 'secondary'} data-accent="purple" size="sm" aria-pressed={selected === item.id} className="min-w-0 shrink px-3 py-3" onClick={() => setSelected(item.id)}>{item.title}</Button>)}</div>{option && <div role="status" className="space-y-3 rounded-tile border border-line bg-white p-4"><h4 className="font-display text-small font-bold text-ink">Wat vraagt deze route?</h4><dl className="space-y-3 text-small leading-relaxed"><div><dt className="font-bold text-green-ink">Mogelijk voordeel</dt><dd className="mt-1 text-ink-soft">{option.benefit}</dd></div><div><dt className="font-bold text-orange-ink">Prijs of risico</dt><dd className="mt-1 text-ink-soft">{option.cost}</dd></div><div><dt className="font-bold text-purple-ink">Te verdedigen voorwaarde</dt><dd className="mt-1 text-ink-soft">{option.condition}</dd></div></dl></div>}<p className="text-caption text-ink-muted">Een zichtbare keuzeroute is nog geen beste keuze. Verdedig welke voorwaarden en belangen hier doorslaggevend zijn.</p></div>;
}

function ComparisonPicture({ data }: { data: ComparisonIllustration }) {
  return <div className="space-y-4"><div className="space-y-3">{data.rows.map((row, index) => <article key={index} className="rounded-tile border border-line bg-white p-4"><h4 className="text-small font-bold text-ink">{row.feature}</h4><div className="mt-3 grid gap-3 sm:grid-cols-2"><p className="rounded-control bg-blue-soft p-3 text-small leading-relaxed"><strong className="mb-1 block text-caption text-blue-ink">{data.left}</strong>{row.left}</p><p className="rounded-control bg-purple-soft p-3 text-small leading-relaxed"><strong className="mb-1 block text-caption text-purple-ink">{data.right}</strong>{row.right}</p></div><p className="mt-3 text-small leading-relaxed text-ink-soft"><strong className="text-ink">Waarom dit verschil telt:</strong> {row.relevance}</p></article>)}</div><p className="rounded-tile border border-green-line bg-green-soft p-4 text-small font-semibold text-ink">{data.conclusion}</p></div>;
}

function IllustrationPicture({ data }: { data: IllustrationData }) {
  switch (data.family) {
    case 'flow': return <FlowPicture data={data} />;
    case 'checks': return <ChecksPicture data={data} />;
    case 'condition': return <ConditionPicture data={data} />;
    case 'quantifiers': return <QuantifierPicture data={data} />;
    case 'frequency': return data.mode === 'rate' ? <RatePicture data={data} /> : <FrequencyPicture data={data} />;
    case 'decision': return <DecisionPicture data={data} />;
    case 'comparison': return <ComparisonPicture data={data} />;
  }
}

export function LessonIllustration({ lessonId }: { lessonId: string }) {
  const calm = useCalmMotion();
  const entry = lessonIllustrations[lessonId];
  const [chosen, setChosen] = useState('');
  const selected = entry?.variants.find((variant) => variant.id === chosen) ?? entry?.variants[0];
  if (!entry || !selected) return null;
  return <section aria-label={`Interactieve illustratie: ${entry.title}`} className="rounded-card border border-blue-line bg-white p-4 shadow-ambient sm:p-6">
    <p className="mb-2 flex items-center gap-2 text-caption font-bold text-blue-ink"><Layers aria-hidden="true" size={16} />Bekijk de redenering</p><h3 className="font-display text-title-sm font-bold text-ink">{entry.title}</h3><p className="mt-2 text-small leading-relaxed text-ink-muted">{entry.invitation}</p><div aria-label="Vergelijk voorbeelden" className="my-5 flex flex-wrap gap-2">{entry.variants.map((variant) => <Button key={variant.id} variant={selected.id === variant.id ? 'accent' : 'secondary'} data-accent="blue" size="sm" aria-pressed={selected.id === variant.id} className="min-w-0 shrink text-left" onClick={() => setChosen(variant.id)}>{variant.label}</Button>)}</div>
    <motion.div key={`${lessonId}-${selected.id}`} initial={calm ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: calm ? 0 : 0.16 }}><IllustrationPicture data={selected.data} /><p className="mt-5 border-l-2 border-blue-line pl-4 text-small leading-relaxed text-ink-soft">{selected.caption}</p></motion.div>
  </section>;
}
