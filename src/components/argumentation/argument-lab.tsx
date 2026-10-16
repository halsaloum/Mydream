'use client';

import dynamic from 'next/dynamic';
import { Beaker, GitBranch, Lightbulb, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { Component, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import type { ArgumentLab } from '@/content/argumentation/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { useCalmMotion } from '@/lib/motion';
import { calculateBayes, calculateCausality, describeStructure, type StructureState } from '@/lib/argumentation/labs';

const LabCanvas = dynamic(() => import('./lab-canvas').then((module) => module.LabCanvas), {
  ssr: false,
  loading: () => <div className="h-72 rounded-card bg-sunken" />,
});

const number = new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 3 });
const percentage = new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 1 });
const percent = (value: number) => value > 0 && value < 0.001 ? '<0,1%' : `${percentage.format(value * 100)}%`;

class DiagramBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override render() {
    return this.state.failed
      ? <p className="rounded-card border border-line bg-sunken p-5 text-small text-ink-muted">Lees het schema in de tekst en tabel hieronder; alle instellingen blijven beschikbaar.</p>
      : this.props.children;
  }
}

function LabFrame({ title, description, children, onReset }: { title: string; description: string; children: ReactNode; onReset: () => void }) {
  const calm = useCalmMotion();
  return (
    <motion.section
      initial={calm ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: calm ? 0 : 0.22 }}
      className="overflow-hidden rounded-sheet border border-line bg-surface shadow-sheet"
      aria-label={title}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line bg-[linear-gradient(135deg,var(--color-blue-soft),var(--color-sunken)_60%)] p-5 sm:p-7">
        <div className="min-w-0 flex-1">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-line bg-white/80 px-3 py-1.5 text-caption font-bold text-blue-ink"><Beaker size={15} aria-hidden="true" /> Denkexperiment</div>
          <h3 className="font-display text-title font-bold">{title}</h3>
          <p className="mt-2 max-w-2xl text-small text-ink-muted">{description}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} aria-label="Herstel begininstellingen"><RotateCcw size={16} aria-hidden="true" /><span className="max-sm:sr-only">Opnieuw</span></Button>
      </div>
      <div className="space-y-6 p-5 sm:p-7">{children}</div>
      <div className="flex items-start gap-2 border-t border-line bg-sunken px-5 py-4 text-caption text-ink-muted sm:px-7"><SlidersHorizontal size={15} className="mt-0.5 shrink-0" aria-hidden="true" /> Vrij oefenen: verander één instelling, voorspel het effect en vergelijk. Dit laboratorium geeft geen cijfer.</div>
    </motion.section>
  );
}

function Switch({ checked, onChange, label, detail, tone = 'blue' }: { checked: boolean; onChange: (value: boolean) => void; label: string; detail: string; tone?: 'blue' | 'purple' | 'orange' }) {
  const id = useId();
  return (
    <label htmlFor={id} className={cn('flex min-h-16 items-start gap-3 rounded-tile border p-3 transition-colors', checked ? tone === 'orange' ? 'border-orange-line bg-orange-soft' : tone === 'purple' ? 'border-purple-line bg-purple-soft' : 'border-blue-line bg-blue-soft' : 'border-line bg-sunken')}>
      <input id={id} type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-navy)]" />
      <span><span className="block text-small font-bold text-ink">{label}</span><span className="mt-1 block text-caption text-ink-muted">{detail}</span></span>
    </label>
  );
}

function Range({ label, description, value, min, max, step = 1, onChange, disabled = false, tone = 'blue' }: { label: string; description: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void; disabled?: boolean; tone?: 'blue' | 'orange' | 'purple' }) {
  const id = useId();
  return (
    <div className={cn('rounded-tile border border-line bg-sunken p-4', disabled && 'opacity-60')}>
      <div className="flex items-center justify-between gap-4"><label htmlFor={id} className="text-small font-bold text-ink">{label}</label><output htmlFor={id} className={cn('rounded-chip px-2 py-1 font-display text-small font-bold tabular-nums', tone === 'blue' ? 'bg-blue-soft text-blue-ink' : tone === 'orange' ? 'bg-orange-soft text-orange-ink' : 'bg-purple-soft text-purple-ink')}>{number.format(value)}%</output></div>
      <p id={`${id}-description`} className="mt-1 text-caption text-ink-muted">{description}</p>
      <input id={id} type="range" min={min} max={max} step={step} value={value} disabled={disabled} onChange={(event) => onChange(Number(event.target.value))} aria-describedby={`${id}-description`} aria-valuetext={`${number.format(value)} procent`} className="mt-3 block h-8 w-full accent-[var(--color-navy)] disabled:cursor-not-allowed" />
      <div aria-hidden="true" className="flex justify-between text-caption tabular-nums text-ink-muted"><span>{min}%</span><span>{max}%</span></div>
    </div>
  );
}

function Insight({ title, children }: { title: string; children: ReactNode }) {
  return <div className="flex items-start gap-3 rounded-card border border-purple-line bg-purple-soft p-4 sm:p-5"><Lightbulb className="mt-1 shrink-0 text-purple-ink" size={21} aria-hidden="true" /><div><h4 className="font-display text-title-sm font-bold text-purple-ink">{title}</h4><div className="mt-2 text-small text-ink-soft">{children}</div></div></div>;
}

type PredictionOption = { id: string; label: string; feedback: string };

/** Feedback is rendered only after an explicit commitment, never beside the options. */
function PredictionChallenge({ title, question, options, answer, explanation, onCommit, onRetry }: { title: string; question: string; options: PredictionOption[]; answer: string; explanation: string; onCommit?: () => void; onRetry?: () => void }) {
  const id = useId();
  const [selected, setSelected] = useState<string | null>(null);
  const [committed, setCommitted] = useState(false);
  const [reasoning, setReasoning] = useState('');
  const feedbackRef = useRef<HTMLDivElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const submittedRef = useRef(false);
  const choice = options.find((option) => option.id === selected);
  useEffect(() => {
    if (committed) feedbackRef.current?.focus({ preventScroll: true });
    else if (submittedRef.current) firstOptionRef.current?.focus({ preventScroll: true });
  }, [committed]);
  return <section aria-label={title} className="rounded-card border border-blue-line bg-[linear-gradient(135deg,var(--color-blue-soft),white_60%)] p-4 sm:p-5">
    <p className="mb-2 text-caption font-bold text-blue-ink">Voorspel → beargumenteer → toets</p>
    <h4 className="font-display text-title-sm font-bold">{title}</h4>
    <p id={`${id}-question`} className="mt-2 text-small text-ink-soft">{question}</p>
    <fieldset className="mt-4 space-y-2" disabled={committed} aria-describedby={`${id}-question`}>
      <legend className="sr-only">Kies je voorspelling voor {title}</legend>
      {options.map((option, index) => <label key={option.id} className={cn('flex min-h-12 items-start gap-3 rounded-control border p-3 text-small', selected === option.id ? 'border-blue-line bg-blue-soft text-ink' : 'border-line bg-white text-ink-soft')}>
        <input ref={index === 0 ? firstOptionRef : undefined} type="radio" name={id} value={option.id} checked={selected === option.id} onChange={() => setSelected(option.id)} className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-navy)]" />
        <span>{option.label}</span>
      </label>)}
    </fieldset>
    <label htmlFor={`${id}-reasoning`} className="mt-4 block text-small font-bold text-ink">Mijn redenering <span className="font-normal text-ink-muted">(optioneel)</span></label>
    <textarea id={`${id}-reasoning`} rows={2} value={reasoning} onChange={(event) => setReasoning(event.target.value)} readOnly={committed} placeholder="Welke aanname of vergelijking draagt mijn voorspelling?" className="mt-2 w-full resize-y rounded-control border border-line bg-white p-3 text-small text-ink" />
    {!committed ? <Button variant="accent" data-accent="blue" size="sm" disabled={!selected} className="mt-3" onClick={() => { submittedRef.current = true; setCommitted(true); onCommit?.(); }}>Leg mijn voorspelling vast</Button> : <>
      <div ref={feedbackRef} tabIndex={-1} role="status" aria-live="polite" aria-atomic="true" className="mt-4 rounded-tile border border-purple-line bg-purple-soft p-4">
        <p className="font-display font-bold text-purple-ink">{selected === answer ? 'Je voorspelling past bij deze redenering' : 'Beoordeel waar je voorspelling afwijkt'}</p>
        <p className="mt-2 text-small text-ink-soft">{choice?.feedback}</p>
        <p className="mt-3 text-small text-ink-soft"><strong className="text-ink">De onderliggende redenering:</strong> {explanation}</p>
      </div>
      <Button variant="secondary" size="sm" className="mt-3" onClick={() => { setSelected(null); setCommitted(false); setReasoning(''); onRetry?.(); }}>Voorspel opnieuw</Button>
    </>}
  </section>;
}

function AppliedInvestigation({ title, prompt, signature, evaluate }: { title: string; prompt: string; signature: string; evaluate: () => string }) {
  const id = useId();
  const [note, setNote] = useState('');
  const [review, setReview] = useState<{ signature: string; text: string } | null>(null);
  return <section aria-label={title} className="rounded-card border border-orange-line bg-orange-soft p-4 sm:p-5">
    <h4 className="font-display text-title-sm font-bold text-orange-ink">{title}</h4>
    <p className="mt-2 text-small text-ink-soft">{prompt}</p>
    <label htmlFor={id} className="mt-4 block text-small font-bold text-ink">Wat veranderde ik en wat verklaart mijn waarneming?</label>
    <textarea id={id} rows={3} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Noteer je ingreep, het verschil dat je ziet en een mogelijke alternatieve verklaring." className="mt-2 w-full resize-y rounded-control border border-orange-line bg-white p-3 text-small text-ink" />
    <Button variant="secondary" size="sm" className="mt-3" onClick={() => setReview({ signature, text: evaluate() })}>Toets mijn huidige instellingen</Button>
    {review?.signature === signature && <p role="status" aria-live="polite" className="mt-4 rounded-tile border border-orange-line bg-white p-4 text-small text-ink-soft">{review.text}</p>}
    {review && review.signature !== signature && <p className="mt-3 text-caption text-orange-ink">Je instellingen zijn veranderd. Toets ze opnieuw en vergelijk met je notitie.</p>}
    <p className="mt-3 text-caption text-ink-muted">De terugkoppeling bespreekt het modelpatroon. Je geschreven redenering blijft jouw aantekening en wordt niet automatisch beoordeeld.</p>
  </section>;
}

const initialStructure: StructureState = { mode: 'linked', firstReason: true, secondReason: true, warrant: true, objection: false };

function StructureLab() {
  const [state, setState] = useState<StructureState>(initialStructure);
  const [resetVersion, setResetVersion] = useState(0);
  const update = (patch: Partial<StructureState>) => setState((previous) => ({ ...previous, ...patch }));
  const result = describeStructure(state);
  const linked = state.mode === 'linked';
  const first = linked ? 'Onze organisatie belooft toegankelijke instructies.' : 'Ondertiteling helpt slechthorende medewerkers.';
  const second = linked ? 'Deze video heeft geen ondertiteling of tekstalternatief.' : 'Ondertiteling maakt leren in stille ruimtes mogelijk.';
  const warrant = linked ? 'Een toegankelijkheidsbelofte geeft reden om ontoegankelijk materiaal aan te passen.' : 'Een uitvoerbare aanpassing die toegang tot leren verbetert, verdient overweging.';
  const objection = linked ? 'Er is inmiddels een volledig tekstalternatief beschikbaar.' : 'Deze automatische ondertiteling bevat veel fouten en moet worden verbeterd.';
  return (
    <LabFrame title="Het argument als bouwwerk" description="Verwijder een reden of voeg een bezwaar toe. Ontdek welke verbinding een argument draagt en welke aanname om uitleg vraagt." onReset={() => { setState(initialStructure); setResetVersion((version) => version + 1); }}>
      <PredictionChallenge key={`linked-${resetVersion}`} title="Wat volgt als één dragende reden wegvalt?" question="Je reconstrueert een gezamenlijke route: de organisatie belooft toegang én deze video heeft geen toegankelijk alternatief. Stel dat de tweede reden onbewezen blijkt. Wat mag je dan concluderen?" answer="route" options={[
        { id: 'false', label: 'De conclusie is daarmee weerlegd: de video mag geen ondertiteling krijgen.', feedback: 'Een ontbrekende rechtvaardiging is geen bewijs voor de tegengestelde conclusie. Je verwart kritiek op een argument met weerlegging van de claim.' },
        { id: 'route', label: 'Deze gezamenlijke route is incompleet; andere routes kunnen de conclusie nog ondersteunen.', feedback: 'Je beperkt de gevolgtrekking tot de onderzochte route. Dat is gerechtvaardigd: de belofte alleen verbindt dit specifieke materiaal nog niet met de verplichting.' },
        { id: 'promise', label: 'De belofte wordt automatisch een zelfstandige reden die even sterk blijft.', feedback: 'Een reden krijgt geen nieuwe inferentiële functie doordat een andere wegvalt. Daarvoor moet je een nieuwe verbindingsregel verdedigen.' },
        { id: 'count', label: 'De onderbouwing verliest precies de helft van haar overtuigingskracht.', feedback: 'Het aantal redenen bepaalt geen meetbare bewijskracht. Bij gekoppelde redenen kan de enige volledige route wegvallen; bij zelfstandige redenen blijft een route over.' },
      ]} explanation="Een schema representeert ondersteuningsrelaties. Zonder de tweede reden ontbreekt één noodzakelijke schakel in deze gekoppelde reconstructie. De waarheid of wenselijkheid van de conclusie blijft een afzonderlijke kwestie." />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Soort ondersteuningsstructuur">
        <Button variant={linked ? 'accent' : 'secondary'} size="sm" data-accent="blue" aria-pressed={linked} onClick={() => update({ mode: 'linked' })}><GitBranch size={17} aria-hidden="true" /> Samenwerkende redenen</Button>
        <Button variant={!linked ? 'accent' : 'secondary'} size="sm" data-accent="purple" aria-pressed={!linked} onClick={() => update({ mode: 'independent' })}>Zelfstandige redenen</Button>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_19rem]">
        <div className="min-w-0 rounded-card border border-line bg-sunken p-2 sm:p-3">
          <DiagramBoundary><LabCanvas kind="structure" structure={state} /></DiagramBoundary>
          <p className="px-3 pb-2 text-caption text-ink-muted">{linked ? 'R1 + R2 vormen samen één route naar de conclusie.' : 'R1 en R2 vormen elk een eigen route naar de conclusie.'} Stippellijnen tonen een onderdeel dat niet is opgenomen in de reconstructie.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <Switch checked={state.firstReason} onChange={(value) => update({ firstReason: value })} label="Reden 1" detail={first} />
          <Switch checked={state.secondReason} onChange={(value) => update({ secondReason: value })} label="Reden 2" detail={second} />
          <Switch checked={state.warrant} onChange={(value) => update({ warrant: value })} label="Verbindingsregel opnemen" detail={warrant} tone="purple" />
          <Switch checked={state.objection} onChange={(value) => update({ objection: value })} label="Een bezwaar toevoegen" detail={objection} tone="orange" />
        </div>
      </div>
      <div className="rounded-card border border-blue-line bg-blue-soft px-5 py-4"><span className="text-caption font-bold text-blue-ink">De conclusie blijft</span><p className="mt-1 font-serif text-lead text-ink">Deze video moet ondertiteling krijgen.</p></div>
      <div role="status" aria-live="polite" aria-atomic="true"><Insight title={result.status}><p>{result.explanation}</p></Insight></div>
      <AppliedInvestigation key={`structure-investigation-${resetVersion}`} title="Maak een tegenproef" prompt="Laat precies één reden actief. Vergelijk daarna de gekoppelde en de zelfstandige structuur. Houd de verbindingsregel actief en zet het bezwaar uit. Welke conclusie over de route blijft in beide gevallen houdbaar?" signature={JSON.stringify(state)} evaluate={() => {
        const oneReason = Number(state.firstReason) + Number(state.secondReason) === 1;
        if (!oneReason || !state.warrant || state.objection) return 'Deze instellingen isoleren nog niet het verschil tussen gekoppelde en zelfstandige ondersteuning. Laat één reden en de verbindingsregel actief, zet het bezwaar uit en verander daarna alleen de structuur. Zo voorkom je dat meerdere ingrepen tegelijk je verklaring onduidelijk maken.';
        return linked ? 'Nu ontbreekt een volledige gekoppelde route. Schakel alleen naar zelfstandige redenen: blijft de actieve reden dan een eigen route dragen? Let op dat ook de inhoudelijke verbindingsregel verandert; het diagram demonstreert een structuurverschil, geen gecontroleerde meting van overtuigingskracht.' : 'Nu blijft één zelfstandige route bestaan. Schakel alleen naar gekoppelde redenen en vergelijk. Noteer waarom een overblijvende route nog steeds niet de waarheid van de conclusie garandeert.';
      }} />
      <PredictionChallenge key={`defeater-${resetVersion}`} title="Welk antwoord raakt het werkelijke bezwaar?" question="Een criticus accepteert dat ondertiteling toegang kan verbeteren, maar zegt: ‘Deze automatische versie bevat zoveel fouten dat zij medewerkers juist misleidt.’ Welke reactie herstelt de onderbouwing het meest direct?" answer="repair" options={[
        { id: 'repeat', label: 'Herhaal dat toegankelijke lessen belangrijk zijn.', feedback: 'De criticus ontkent de waarde van toegankelijkheid niet. Je herhaalt een aanvaarde norm, terwijl het bezwaar de geschiktheid van deze uitvoering raakt.' },
        { id: 'repair', label: 'Controleer de foutlast en laat zien hoe correctie deze ondertiteling bruikbaar maakt.', feedback: 'Je reageert op de toepassing van de norm. Betrouwbare correctie kan de brug tussen ondertiteling en betere toegang herstellen; alleen beloven dat je corrigeert is nog geen bewijs.' },
        { id: 'attack', label: 'Bewijs dat de criticus zelf ook taalfouten maakt.', feedback: 'Dat verandert niets aan de kwaliteit van deze ondertiteling. De persoonskritiek ontwijkt het bezwaar tegen de inferentiestap.' },
        { id: 'abandon', label: 'Accepteer dat ondertiteling in elke situatie ongewenst is.', feedback: 'Het bezwaar betreft deze foutieve uitvoering. Een algemene conclusie over alle ondertiteling gaat verder dan de aangevoerde reden rechtvaardigt.' },
      ]} explanation="Dit bezwaar ondergraaft de toepassing van de verbindingsregel: deze uitvoering levert mogelijk geen betere toegang. Een antwoord moet die toepassing toetsen. Het is geen zelfstandig bewijs dat elke vorm van ondertiteling moet verdwijnen." />
      <details className="rounded-tile border border-line bg-sunken p-4"><summary className="cursor-pointer text-small font-bold text-ink">Verdieping: structuur, geldigheid en aanvechtbaarheid</summary><div className="mt-3 space-y-3 text-small text-ink-muted"><p><strong className="text-ink">Gekoppeld:</strong> de route vereist R1 én R2. <strong className="text-ink">Convergent:</strong> elke reden vormt een afzonderlijke route. Dit zegt iets over de reconstructie van het argument, niet over de waarheid van de redenen of de grootte van het bewijseffect.</p><p>Een verbindingsregel (<em>warrant</em>) rechtvaardigt de stap van reden naar conclusie. Hier is die regel normatief en weerlegbaar: betere toegang moet bijvoorbeeld worden afgewogen tegen uitvoerbaarheid. Een compleet schema is daardoor geen deductief bewijs.</p><p>Een <em>rebutter</em> ondersteunt een tegengestelde conclusie. Een <em>undercutter</em> betwist juist een inferentiestap. Het tekstalternatief in dit voorbeeld betwist de feitelijke reden dat er geen toegankelijk alternatief is; fouten in ondertiteling betwisten de toepassing van de toegankelijkheidsregel. Formuleer ook een bezwaar dat rechtstreeks de conclusie tegenspreekt.</p></div></details>
      <p className="text-small text-ink-muted"><strong className="text-ink">Denkvraag:</strong> welk onderdeel zou je controleren met bronnen? En welk onderdeel is een normatieve keuze waarover je redelijk van mening kunt verschillen?</p>
    </LabFrame>
  );
}

function CausalityLab() {
  const [prepared, setPrepared] = useState(10);
  const [balanced, setBalanced] = useState(false);
  const [grouped, setGrouped] = useState(false);
  const [resetVersion, setResetVersion] = useState(0);
  const result = calculateCausality(prepared, balanced);
  return (
    <LabFrame title="Wanneer gemiddelden misleiden" description="Een teamleider vergelijkt 1.000 medewerkers met een training en 1.000 zonder. Het voorbeeld is fictief. Verander hun ervaring en beoordeel waarom één totaal je op het verkeerde been kan zetten." onReset={() => { setPrepared(10); setBalanced(false); setGrouped(false); setResetVersion((version) => version + 1); }}>
      <PredictionChallenge key={`balance-${resetVersion}`} title="Voorspel een gelijke vergelijking" question="Binnen veel ervaring slaagt 90% met training en 80% zonder; binnen weinig ervaring is dat 30% en 20%. Beide condities krijgen nu precies half veel en half weinig ervaring. Welk totaal verwacht je? Na je keuze voert het model de vergelijking uit." answer="ten" onCommit={() => setBalanced(true)} options={[
        { id: 'zero', label: '50% tegenover 50%: gelijke groepen laten elk verschil verdwijnen.', feedback: 'Gelijke samenstelling verwijdert het compositieverschil, niet het verschil dat binnen beide subgroepen bestaat. Je moet de twee percentages per conditie middelen.' },
        { id: 'ten', label: '60% tegenover 50%: het verschil is 10 procentpunten.', feedback: 'Je gebruikt dezelfde gewichten: (90 + 30)/2 = 60 en (80 + 20)/2 = 50. Het groepsverschil weerspiegelt nu het vaste binnen-groepverschil.' },
        { id: 'twenty', label: '60% tegenover 40%: de twee verschillen tellen op tot 20 procentpunten.', feedback: 'De subgroepen vormen samen de bevolking; ze zijn geen twee effecten die je optelt. Met half gewicht per groep blijft het gewogen verschil 10 procentpunten.' },
        { id: 'reverse', label: '36% tegenover 74%: de eerdere omkering blijft altijd bestaan.', feedback: 'Die percentages ontstonden bij een specifieke ongelijke samenstelling. Als de gewichten veranderen, moet je de totalen opnieuw berekenen.' },
      ]} explanation="Bij gelijke 50/50-gewichten is het totaal met training 0,5 × 90% + 0,5 × 30% = 60%. Zonder training is het 50%. De berekening toont een gestandaardiseerd verschil, zonder daarmee alle causale aannames te bewijzen." />
      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <Range label="Veel ervaring in de trainingsgroep" description={`In de vergelijkingsgroep is dit ${balanced ? 50 : 100 - prepared}%. De rest heeft weinig ervaring.`} value={balanced ? 50 : prepared} min={5} max={95} step={5} onChange={setPrepared} disabled={balanced} />
        <div className="grid gap-3">
          <Switch checked={balanced} onChange={setBalanced} label="Vergelijk gelijke groepsverdelingen" detail="In beide groepen krijgt 50% veel en 50% weinig ervaring." tone="purple" />
          <Switch checked={grouped} onChange={setGrouped} label="Splits de grafiek naar ervaring" detail="Vergelijk medewerkers met een vergelijkbare startpositie." />
        </div>
      </div>
      <div className="rounded-card border border-line bg-sunken p-3"><DiagramBoundary><LabCanvas kind="causality" causality={result} grouped={grouped} /></DiagramBoundary></div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Met training geslaagd" value={percent(result.lessonRate)} detail={`${number.format(result.lessonSuccess)} van 1.000`} tone="blue" />
        <Stat label="Zonder training geslaagd" value={percent(result.controlRate)} detail={`${number.format(result.controlSuccess)} van 1.000`} tone="orange" />
        <Stat label="Verschil in het totaal" value={`${result.difference > 0 ? '+' : ''}${number.format(result.difference * 100)}`} detail="procentpunten · met minus zonder" tone="purple" />
      </div>
      <div className="overflow-x-auto rounded-tile border border-line">
        <table className="w-full min-w-[430px] text-left text-small">
          <caption className="px-4 py-3 text-left font-bold text-ink">Dezelfde data, uitgesplitst naar ervaring</caption>
          <thead className="bg-sunken text-caption text-ink-muted"><tr><th scope="col" className="px-4 py-3">Ervaring</th><th scope="col" className="px-4 py-3">Met training</th><th scope="col" className="px-4 py-3">Zonder training</th><th scope="col" className="px-4 py-3">Verschil</th></tr></thead>
          <tbody>{result.rows.map((row) => <tr key={row.id} className="border-t border-line"><th scope="row" className="px-4 py-3 font-bold text-ink">{row.label}</th><td className="px-4 py-3 tabular-nums">{number.format(row.lessonSuccess)} / {number.format(row.lessonTotal)}<span className="block text-caption font-bold text-blue-ink">{percent(row.lessonRate)}</span></td><td className="px-4 py-3 tabular-nums">{number.format(row.controlSuccess)} / {number.format(row.controlTotal)}<span className="block text-caption font-bold text-orange-ink">{percent(row.controlRate)}</span></td><td className="px-4 py-3 font-bold tabular-nums text-green-ink">+10 pp</td></tr>)}</tbody>
        </table>
      </div>
      <div aria-live="polite" aria-atomic="true"><Insight title={result.reversed ? 'Een omkering: beide subgroepen vertellen iets anders' : balanced ? 'Een eerlijke verdeling maakt het patroon zichtbaar' : 'De samenstelling verandert het totaal'}><p>{result.reversed ? 'In beide ervaringsgroepen is het succespercentage met de training 10 procentpunten hoger. Toch ligt het totale percentage lager: de trainingsgroep bevat veel meer beginners. Het totaal weegt andere aantallen medewerkers mee.' : balanced ? 'Beide groepen hebben dezelfde samenstelling. Het totaal toont nu hetzelfde verschil van 10 procentpunten als elke subgroep. Ervaring verklaart in dit model het eerder vertekende gemiddelde.' : 'De percentages binnen beide ervaringsgroepen blijven gelijk. Alleen de aantallen medewerkers veranderen. Het totale verschil kan daardoor groeien, verdwijnen of zelfs omkeren.'}</p><p className="mt-3">Gebruik zo’n verschil als aanleiding voor een betere vraag. Zijn de groepen ook vergelijkbaar in motivatie, taakzwaarte en begeleiding? Een teamleider die alleen het totaal noemt, kan een verkeerde beslissing overtuigend presenteren.</p></Insight></div>
      <AppliedInvestigation key={`causality-investigation-${resetVersion}`} title="Zoek het omslagpunt" prompt="Zet gelijke groepsverdelingen uit. Zoek twee opeenvolgende standen van de schuif waarbij het totale verschil van teken verandert. Laat de subgroepen zien en verklaar waarom hun verschillen niet mee veranderen." signature={`${prepared}-${balanced}-${grouped}`} evaluate={() => balanced ? 'Met gelijke groepsverdelingen blijft het totaal steeds 60% tegenover 50%. Zet die instelling uit om het omslagpunt van de ongelijke samenstelling te vergelijken.' : prepared === 40 || prepared === 45 ? `Bij ${prepared}% veel ervaring in de trainingsgroep is het totale verschil ${number.format(result.difference * 100)} procentpunten. Vergelijk de aangrenzende stand ${prepared === 40 ? 45 : 40}%. De omkering zit tussen die twee: de gewichten veranderen, terwijl elk subgroepverschil +10 procentpunten blijft.` : `Je huidige verschil is ${number.format(result.difference * 100)} procentpunten. Beweeg richting nul en zoek twee aangrenzende standen met een verschillend teken. Kijk naar de aantallen die elk subgroeppercentage wegen; verander niet de vaste succespercentages.`} />
      <PredictionChallenge key={`causal-claim-${resetVersion}`} title="Is deze conclusie sterk genoeg voor een besluit?" question="Na een vergelijking met gelijke ervaringsgroepen ziet een manager 60% tegenover 50% succes. Zij schrijft: ‘Onze training veroorzaakt dus 10 procentpunten extra succes.’ Welke controle ontbreekt voordat je dat als argument voor uitbreiding gebruikt?" answer="assumptions" options={[
        { id: 'enough', label: 'Niets: een positief verschil binnen beide groepen bewijst de oorzaak.', feedback: 'Het verschil kan ook ontstaan door motivatie, eerdere begeleiding of selectie. Gelijke ervaring sluit andere verklaringen nog niet uit.' },
        { id: 'assumptions', label: 'Controleren of andere relevante verschillen, zoals motivatie en taakzwaarte, het resultaat kunnen verklaren.', feedback: 'Je toetst een alternatieve verklaring. De gelijke ervaringsverdeling helpt, maar bewijst niet dat de training het enige relevante verschil tussen de groepen is.' },
        { id: 'bigger', label: 'Alleen meer medewerkers: met genoeg data verdwijnt een vertekende vergelijking vanzelf.', feedback: 'Meer cijfers kunnen toevalsvariatie verkleinen, maar een systematisch verkeerde vergelijking blijft verkeerd. Een groot dashboard kan een zwakke conclusie heel overtuigend laten lijken.' },
        { id: 'everything', label: 'Alleen medewerkers met de beste beoordeling meenemen: hun resultaat laat de training op haar sterkst zien.', feedback: 'Je selecteert het bewijs op de gewenste uitkomst. Neem ook tegenvallende resultaten en uitvallers mee; anders maak je de conclusie mooier dan de volledige vergelijking rechtvaardigt.' },
      ]} explanation="Een verschil in resultaten is nog geen bewijs van de oorzaak. Verdedig eerst dat je vergelijkbare situaties vergelijkt en dat andere relevante verklaringen voldoende zijn getoetst. Een sterk besluit benoemt ook wat nog onzeker is." />
      <details className="rounded-tile border border-line bg-sunken p-4"><summary className="cursor-pointer text-small font-bold text-ink">Zo toets je een overtuigend totaal</summary><div className="mt-3 space-y-3 text-small text-ink-muted"><p>Het totaal is een gewogen gemiddelde: bij een aandeel <em>w</em> met veel ervaring is het percentage met training <span className="font-mono text-caption">0,90w + 0,30(1 − w)</span>. Zonder training is de weging omgekeerd: <span className="font-mono text-caption">0,80(1 − w) + 0,20w</span>. Het verschil is dus <span className="font-mono text-caption">1,20w − 0,50</span>, en verandert teken bij ongeveer 41,7%.</p><p>Met een gelijke 50/50-verdeling krijg je 60% tegenover 50%. Je maakt de vergelijking daarmee eerlijker op ervaring. Vraag daarna welke andere verschillen voor deze beslissing tellen, in plaats van meteen ‘de training werkt’ te concluderen.</p><p className="font-bold text-ink">Leiderschapsvraag: hoe leg je dit aan je team uit zonder de cijfers te verdraaien of meer zekerheid te claimen dan je hebt?</p></div></details>
      <p className="text-small text-ink-muted"><strong className="text-ink">Denkvraag:</strong> bij welke groepsverdeling verandert het teken van het totale verschil? Waarom is ‘meer geslaagden’ zonder vergelijkbare groepen onvoldoende bewijs?</p>
    </LabFrame>
  );
}

function Stat({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: 'blue' | 'orange' | 'purple' }) {
  return <div className={cn('rounded-tile border p-4', tone === 'blue' ? 'border-blue-line bg-blue-soft' : tone === 'orange' ? 'border-orange-line bg-orange-soft' : 'border-purple-line bg-purple-soft')}><p className="text-caption font-bold text-ink-muted">{label}</p><p className="mt-1 font-display text-3xl font-bold tabular-nums text-ink">{value}</p><p className="mt-1 text-caption text-ink-muted">{detail}</p></div>;
}

function BayesLab() {
  const [prevalence, setPrevalence] = useState(1);
  const [sensitivity, setSensitivity] = useState(90);
  const [specificity, setSpecificity] = useState(95);
  const [population, setPopulation] = useState(10000);
  const [revealed, setRevealed] = useState(false);
  const [resetVersion, setResetVersion] = useState(0);
  const result = calculateBayes(prevalence / 100, sensitivity / 100, specificity / 100, population);
  const jointCase = calculateBayes(0.2, 0.85, 0.96);
  const signature = `${prevalence}-${sensitivity}-${specificity}-${population}`;
  const band = result.posterior !== null ? Math.min(3, Math.floor(result.posterior * 4)) : 0;
  return (
    <LabFrame title="Van een signaal naar een conclusie" description="Een spamfilter markeert een e-mail. Hoe zeker weet je nu dat het spam is? Stel het model in, leg een voorspelling vast en bekijk daarna de exacte aantallen." onReset={() => { setPrevalence(1); setSensitivity(90); setSpecificity(95); setPopulation(10000); setRevealed(false); setResetVersion((version) => version + 1); }}>
      <div className="grid gap-3 lg:grid-cols-3">
        <Range label="Basisfrequentie: spam" description="Hoeveel procent van alle e-mails is vooraf spam?" value={prevalence} min={0.1} max={50} step={0.1} onChange={(value) => { setPrevalence(value); setRevealed(false); }} tone="purple" />
        <Range label="Sensitiviteit" description="Welk percentage echte spam markeert het filter?" value={sensitivity} min={1} max={100} onChange={(value) => { setSensitivity(value); setRevealed(false); }} />
        <Range label="Specificiteit" description="Welk percentage gewone e-mails laat het filter ongemarkeerd?" value={specificity} min={50} max={100} onChange={(value) => { setSpecificity(value); setRevealed(false); }} tone="orange" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-small font-bold text-ink">Denk in aantallen e-mails</p><div role="group" aria-label="Aantal e-mails in het rekenvoorbeeld" className="flex gap-2">{[1000, 10000].map((amount) => <Button key={amount} size="sm" variant={population === amount ? 'accent' : 'secondary'} data-accent="blue" aria-pressed={population === amount} onClick={() => { setPopulation(amount); setRevealed(false); }}>{number.format(amount)}</Button>)}</div></div>
      <PredictionChallenge key={`posterior-${signature}-${resetVersion}`} title="Schat de kans vóór je de uitkomst ziet" question={`Bij ${number.format(prevalence)}% spam, ${number.format(sensitivity)}% sensitiviteit en ${number.format(specificity)}% specificiteit markeert het filter één e-mail. In welke band ligt volgens jou de kans dat die gemarkeerde e-mail spam is? Gebruik alle gemarkeerde e-mails als referentiegroep.`} answer={String(band)} onCommit={() => setRevealed(true)} onRetry={() => setRevealed(false)} options={[
        { id: '0', label: 'Minder dan 25%', feedback: band === 0 ? 'Deze lage band past bij de verhouding. De vele gewone e-mails kunnen samen meer fout-positieven opleveren dan het filter echte spam vindt.' : 'Een lage basisfrequentie kan een lage posterior geven, maar niet bij elke combinatie. Vergelijk ook hoeveel gewone e-mails foutief worden gemarkeerd bij deze specificiteit.' },
        { id: '1', label: 'Van 25% tot minder dan 50%', feedback: band === 1 ? 'Deze midden-lage band past: echte spam vormt een aanzienlijk deel, maar nog niet de meerderheid van alle markeringen.' : 'Deze band verlangt dat fout-positieven nog steeds talrijker zijn dan ware positieven. Vergelijk hun verwachte aantallen; de sensitiviteit alleen beslist dit niet.' },
        { id: '2', label: 'Van 50% tot minder dan 75%', feedback: band === 2 ? 'Deze band past: de meerderheid van de markeringen is echte spam, maar fout-positieven blijven een aanzienlijke minderheid.' : 'Een meerderheid aan echte spam volgt alleen als ware positieven talrijker zijn dan fout-positieven. Bereken beide groepen vanuit hun verschillende uitgangsaantallen.' },
        { id: '3', label: 'Van 75% tot en met 100%', feedback: band === 3 ? 'Deze hoge band past bij de verhouding in dit model. Een sterk signaal gecombineerd met deze basisfrequentie maakt de gewone mail onder de markeringen relatief klein.' : 'De markering hoeft niet even betrouwbaar te zijn als de sensitiviteit. Die laatste gaat over markeringen binnen echte spam, terwijl jouw schatting over spam binnen alle markeringen gaat.' },
      ]} explanation={`${number.format(result.truePositive)} verwachte ware positieven en ${number.format(result.falsePositive)} fout-positieven vormen samen ${number.format(result.positives)} markeringen. De gezochte verhouding is ${number.format(result.truePositive)} / ${number.format(result.positives)} = ${result.posterior === null ? 'niet gedefinieerd' : percent(result.posterior)}. Je hebt de voorwaardelijke kans omgedraaid ten opzichte van sensitiviteit.`} />
      {!revealed && <p className="rounded-tile border border-line bg-sunken p-4 text-small text-ink-muted">De frequentieboom en exacte uitkomst verschijnen nadat je je voorspelling hebt vastgelegd. Een veranderde instelling vraagt om een nieuwe voorspelling.</p>}
      {revealed && <>
      <div className="rounded-card border border-line bg-sunken p-3"><DiagramBoundary><LabCanvas kind="bayes" bayes={result} /></DiagramBoundary></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Spam, terecht gemarkeerd" value={number.format(result.truePositive)} detail="ware positieven" tone="blue" />
        <Stat label="Gewone mail, toch gemarkeerd" value={number.format(result.falsePositive)} detail="fout-positieven" tone="orange" />
        <div className="rounded-tile border border-line bg-sunken p-4"><p className="text-caption font-bold text-ink-muted">Spam, gemist</p><p className="mt-1 font-display text-3xl font-bold tabular-nums text-ink">{number.format(result.falseNegative)}</p><p className="mt-1 text-caption text-ink-muted">fout-negatieven</p></div>
        <div className="rounded-tile border border-green-line bg-green-soft p-4"><p className="text-caption font-bold text-ink-muted">Gewone mail, terecht doorgelaten</p><p className="mt-1 font-display text-3xl font-bold tabular-nums text-ink">{number.format(result.trueNegative)}</p><p className="mt-1 text-caption text-ink-muted">ware negatieven</p></div>
      </div>
      <div className="rounded-card border border-purple-line bg-purple-soft p-5 sm:flex sm:items-center sm:justify-between sm:gap-6" role="status" aria-live="polite" aria-atomic="true"><div><p className="text-small font-bold text-purple-ink">Kans op spam na een markering</p><p className="mt-2 text-small tabular-nums text-ink-soft">{number.format(result.truePositive)} terecht gemarkeerd ÷ ({number.format(result.truePositive)} terecht + {number.format(result.falsePositive)} onterecht)</p><p className="mt-1 text-caption text-ink-muted">We rekenen met de ongeronde aantallen; de weergave is afgerond.</p></div><p className="mt-4 shrink-0 font-display text-5xl font-bold tabular-nums text-purple-ink sm:mt-0">{result.posterior === null ? '—' : percent(result.posterior)}</p></div>
      <Insight title="Een sterk filter is nog geen sterke conclusie"><p>Sensitiviteit gaat over <em>gemarkeerd gegeven spam</em>. Jij zoekt <em>spam gegeven gemarkeerd</em>. Dat zijn verschillende kansen. Wanneer spam zeldzaam is, kunnen de kleine percentages fouten onder de vele gewone e-mails toch een grote groep vormen.</p><p className="mt-3">De basisfrequentie bepaalt hoeveel echte en onechte signalen je verwacht. Een grotere voorbeeldgroep verandert die verhouding niet. Decimalen zijn verwachte aantallen, geen delen van echte e-mails.</p></Insight>
      </>}
      <AppliedInvestigation key={`bayes-investigation-${resetVersion}`} title="Bouw een bruikbaarder filter" prompt="Zoek instellingen waarbij spam hoogstens 2% van alle mail vormt en toch meer dan de helft van de markeringen terecht is. Je mag geen perfecte specificiteit van 100% aannemen. Voorspel na elke ingreep opnieuw en verklaar welke foutgroep je verkleint." signature={`${signature}-${revealed}`} evaluate={() => !revealed ? 'Leg eerst je voorspelling voor deze instellingen vast. Vergelijk daarna de aantallen met je verwachting.' : prevalence > 2 ? 'Je hebt de spamfrequentie verhoogd boven de voorwaarde. Dat kan de posterior verbeteren, maar verandert de populatie. Houd spam op hoogstens 2% en toets de kwaliteit van het filter.' : specificity === 100 ? 'Met 100% specificiteit sluit het model fout-positieven volledig uit. De uitdaging vraagt een oplossing zonder die perfecte aanname: probeer een realistische resterende foutkans te vergelijken met de zeldzame echte spam.' : result.posterior !== null && result.posterior > 0.5 ? `Met deze instellingen vormen ${number.format(result.truePositive)} echte en ${number.format(result.falsePositive)} onterechte markeringen de positieve groep; ${percent(result.posterior)} is terecht. Leg uit waarom minder fouten onder de veel grotere gewone-mailgroep hier belangrijk is, en welke gegevens je nodig hebt om deze specificiteit te vertrouwen.` : `Nog geen meerderheid: ${number.format(result.truePositive)} terecht tegenover ${number.format(result.falsePositive)} onterecht gemarkeerd. Houd de lage basisfrequentie vast en probeer welke wijziging de fout-positieve groep voldoende verkleint. Een hogere sensitiviteit alleen kan een grote fout-positieve groep niet laten verdwijnen.`} />
      <PredictionChallenge key={`dependence-${resetVersion}`} title="Twee signalen, maar hoeveel nieuwe informatie?" question="Spam vormt 20% van de mail. Twee filters hebben elk 90% sensitiviteit en 95% specificiteit, maar gebruiken deels dezelfde kenmerken. Validatiedata tonen: 85% van echte spam krijgt beide markeringen en 4% van gewone mail krijgt beide. Eén markering gaf ongeveer 81,8% kans op spam. Wat mag je na twee markeringen concluderen?" answer="joint" options={[
        { id: 'independent', label: 'Ongeveer 98,8%: behandel de twee filters als volledig onafhankelijke bevestigingen.', feedback: 'Dat gebruikt de onafhankelijkheidsaanname: 90% × 90% echte dubbele markeringen en 5% × 5% onterechte dubbele markeringen. De gegeven gezamenlijke data zijn anders, vooral de fout-positieve overlap.' },
        { id: 'joint', label: 'Ongeveer 84,2%: bereken de verhouding met de gezamenlijke markeringen.', feedback: 'Je gebruikt de waargenomen gezamenlijke verdeling: van 2.000 spam-mails krijgen 1.700 beide markeringen; van 8.000 gewone mails krijgen 320 beide. De tweede markering helpt dus bescheiden, ondanks dezelfde marginale filterkwaliteit.' },
        { id: 'none', label: 'Ongeveer 81,8%: afhankelijke filters leveren nooit nieuwe informatie.', feedback: 'Afhankelijkheid betekent niet dat het tweede signaal niets toevoegt. Hier verdwijnen naar verhouding meer fout-positieven dan ware positieven uit de dubbel gemarkeerde groep. Alleen een exacte kopie zou zeker geen nieuwe informatie geven.' },
        { id: 'accuracy', label: '90%: de dubbele bevestiging maakt de posterior gelijk aan sensitiviteit.', feedback: 'Het aantal filters verwisselt de referentiegroepen niet. Sensitiviteit blijft een kans binnen echte spam en is geen posterior binnen de dubbel gemarkeerde mail.' },
      ]} explanation={`${number.format(jointCase.truePositive)} ware en ${number.format(jointCase.falsePositive)} onterechte dubbele markeringen geven ${number.format(jointCase.truePositive)} / ${number.format(jointCase.positives)} = ${percent(jointCase.posterior ?? 0)}. De tweede bevestiging voegt minder toe dan je zou denken, omdat beide filters deels dezelfde informatie gebruiken. Twee eensgezinde bronnen zijn niet automatisch twee onafhankelijke bewijsstukken.`} />
      <details className="rounded-tile border border-line bg-sunken p-4"><summary className="cursor-pointer text-small font-bold text-ink">Voorkom schijnzekerheid bij een signaal</summary><div className="mt-3 space-y-3 text-small text-ink-muted"><p className="font-mono text-caption text-ink">Kans na een markering = terecht gemarkeerd / (terecht gemarkeerd + onterecht gemarkeerd)</p><p>Vraag bij een overtuigend signaal altijd: hoe vaak komt het probleem vooraf al voor, hoeveel echte gevallen worden gevonden en hoeveel gewone gevallen krijgen ten onrechte hetzelfde signaal? Alleen ‘het systeem vindt 90%’ is onvoldoende om één markering te beoordelen.</p><p>Dit voorbeeld veronderstelt dat de filterkwaliteit in jouw situatie geldt. Als de soort mail verandert, moet je die aanname opnieuw toetsen. Een specificiteit van 100% sluit fouten in het model uit, maar bewijst geen perfect systeem in de praktijk.</p><p>Voorkom ook dubbel tellen: twee dashboards of collega’s die dezelfde bron gebruiken, kunnen hetzelfde bewijs herhalen. Vraag welke nieuwe informatie de tweede bevestiging werkelijk toevoegt.</p></div></details>
      <p className="text-small text-ink-muted"><strong className="text-ink">Denkvraag:</strong> houd sensitiviteit op 90%. Wat verandert sterker bij zeldzame spam: de sensitiviteit verhogen of het aantal fout-positieven verkleinen?</p>
    </LabFrame>
  );
}

export function ArgumentLabView({ kind }: { kind: ArgumentLab }) {
  if (kind === 'structure') return <StructureLab />;
  if (kind === 'causality') return <CausalityLab />;
  return <BayesLab />;
}
