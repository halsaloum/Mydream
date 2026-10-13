'use client';

import { useEffect, useRef, useState } from 'react';
import { Arrow, Circle, Group, Layer, Line, Rect, Stage, Text } from 'react-konva';
import { describeStructure, type BayesResult, type CausalityRow, type StructureState } from '@/lib/argumentation/labs';

const colors = {
  ink: '#23262d', muted: '#5f6570', line: '#d7d1c4', paper: '#faf8f4',
  blue: '#0a6694', blueFill: '#e3f4fd', blueLine: '#a9dcf7',
  purple: '#6f35a0', purpleFill: '#f6ebff', purpleLine: '#e2c4fb',
  orange: '#8f4a00', orangeFill: '#fff3e0', orangeLine: '#ffd59c',
  green: '#2f6b00', greenFill: '#ecf9df', greenLine: '#bfe89a',
};
const format = new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 3 });
const percentage = new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 1 });
const pct = (value: number) => `${percentage.format(value * 100)}%`;

type CausalityData = {
  rows: CausalityRow[];
  lessonRate: number;
  controlRate: number;
  lessonSuccess: number;
  controlSuccess: number;
  conditionSize: number;
};
type CanvasProps =
  | { kind: 'structure'; structure: StructureState }
  | { kind: 'causality'; causality: CausalityData; grouped: boolean }
  | { kind: 'bayes'; bayes: BayesResult };

function Card({ x, y, width, height, title, body, tone = 'blue', active = true }: { x: number; y: number; width: number; height: number; title: string; body: string; tone?: 'blue' | 'purple' | 'orange' | 'green'; active?: boolean }) {
  return <Group x={x} y={y} opacity={active ? 1 : 0.4}>
    <Rect width={width} height={height} cornerRadius={16} fill={active ? colors[`${tone}Fill`] : '#ffffff'} stroke={active ? colors[`${tone}Line`] : colors.line} strokeWidth={1.5} dash={active ? [] : [5, 4]} />
    <Text x={14} y={13} width={width - 28} text={title} fontFamily="sans-serif" fontSize={12} fontStyle="bold" fill={colors[tone]} />
    <Text x={14} y={33} width={width - 28} height={height - 39} text={body} fontFamily="sans-serif" fontSize={14} fontStyle="bold" lineHeight={1.22} fill={colors.ink} />
  </Group>;
}

function Edge({ points, active = true, tone = 'blue' }: { points: number[]; active?: boolean; tone?: 'blue' | 'purple' | 'orange' }) {
  return <Arrow points={points} stroke={active ? colors[tone] : colors.line} fill={active ? colors[tone] : colors.line} strokeWidth={2} pointerLength={6} pointerWidth={6} dash={active ? [] : [5, 5]} opacity={active ? 1 : 0.55} />;
}

function StructureDiagram({ state, compact }: { state: StructureState; compact: boolean }) {
  const linked = state.mode === 'linked';
  const supported = describeStructure(state).hasPath;
  const cx = compact ? 180 : 380;
  const first = compact ? { x: 12, y: 18, w: 157, h: 104 } : { x: 25, y: 20, w: 286, h: 80 };
  const second = compact ? { x: 191, y: 18, w: 157, h: 104 } : { x: 449, y: 20, w: 286, h: 80 };
  const joinY = compact ? 157 : 128;
  const rule = compact ? { x: 64, y: 190, w: 232, h: 84 } : { x: 265, y: 160, w: 230, h: 76 };
  const conclusion = compact ? { x: 64, y: 324, w: 232, h: 78 } : { x: 265, y: 284, w: 230, h: 78 };
  const objection = compact ? { x: 64, y: 453, w: 232, h: 74 } : { x: 25, y: 284, w: 204, h: 78 };
  const firstCenter = first.x + first.w / 2;
  const secondCenter = second.x + second.w / 2;
  return <>
    <Card x={first.x} y={first.y} width={first.w} height={first.h} title="REDEN 1" body={linked ? 'Ons team belooft toegankelijke instructies.' : 'Helpt slechthorende medewerkers.'} active={state.firstReason} />
    <Card x={second.x} y={second.y} width={second.w} height={second.h} title="REDEN 2" body={linked ? 'Deze video mist een toegankelijk alternatief.' : 'Maakt leren in stille ruimtes mogelijk.'} active={state.secondReason} />
    <Line points={[firstCenter, first.y + first.h, firstCenter, joinY, linked ? cx : rule.x + 35, joinY, linked ? cx : rule.x + 35, rule.y]} stroke={state.firstReason ? colors.blue : colors.line} strokeWidth={2} dash={state.firstReason ? [] : [5, 5]} />
    <Line points={[secondCenter, second.y + second.h, secondCenter, joinY, linked ? cx : rule.x + rule.w - 35, joinY, linked ? cx : rule.x + rule.w - 35, rule.y]} stroke={state.secondReason ? colors.blue : colors.line} strokeWidth={2} dash={state.secondReason ? [] : [5, 5]} />
    {linked && <><Circle x={cx} y={joinY} radius={10} fill={supported ? colors.blue : colors.muted} /><Text x={cx - 7} y={joinY - 8} text="+" fontFamily="sans-serif" fontSize={18} fontStyle="bold" fill="#ffffff" /></>}
    <Card x={rule.x} y={rule.y} width={rule.w} height={rule.h} title="VERBINDINGSREGEL" body={state.warrant ? linked ? 'Een belofte geeft reden tot aanpassen.' : 'Betere toegang geeft reden tot aanpassen.' : 'Welke aanname verbindt de stap?'} tone="purple" active={state.warrant} />
    {linked ? <Edge points={[cx, rule.y + rule.h, cx, conclusion.y]} active={supported} tone="purple" /> : <><Edge points={[rule.x + 35, rule.y + rule.h, rule.x + 35, conclusion.y]} active={state.warrant && state.firstReason} tone="purple" /><Edge points={[rule.x + rule.w - 35, rule.y + rule.h, rule.x + rule.w - 35, conclusion.y]} active={state.warrant && state.secondReason} tone="purple" /></>}
    <Card x={conclusion.x} y={conclusion.y} width={conclusion.w} height={conclusion.h} title="CONCLUSIE" body="Deze video moet ondertiteling krijgen." tone="green" />
    {state.objection && <>
      <Card x={objection.x} y={objection.y} width={objection.w} height={objection.h} title="BEZWAAR" body={linked ? 'Er is inmiddels een tekstalternatief.' : 'De ondertiteling bevat veel fouten.'} tone="orange" />
      <Edge points={linked
        ? compact
          ? [objection.x + objection.w, objection.y + 37, 351, objection.y + 37, 351, 174, secondCenter, 174, secondCenter, second.y + second.h]
          : [objection.x + objection.w, objection.y + 38, 247, objection.y + 38, 247, 112, secondCenter, 112, secondCenter, second.y + second.h]
        : compact
          ? [objection.x, objection.y + 37, 36, objection.y + 37, 36, 299, cx, 299]
          : [objection.x + objection.w, objection.y + 38, 247, objection.y + 38, 247, 258, cx, 258]} tone="orange" />
      {!compact && <Text x={260} y={243} text="vraagt een antwoord" fontSize={11} fill={colors.orange} />}
    </>}
    {!state.objection && <Text x={compact ? 32 : 25} y={compact ? 454 : 300} width={compact ? 296 : 210} text="Voeg een bezwaar toe om de ondersteuningsroute te bevragen." fontFamily="sans-serif" lineHeight={1.4} fontSize={13} fill={colors.muted} />}
  </>;
}

function CausalityDiagram({ data, grouped, compact }: { data: CausalityData; grouped: boolean; compact: boolean }) {
  const barWidth = compact ? 330 : 580;
  const x = compact ? 15 : 144;
  const left = compact ? 15 : 26;
  const rows = grouped
    ? data.rows.map((row) => ({ label: row.label, lessonRate: row.lessonRate, controlRate: row.controlRate, lessonTotal: row.lessonTotal, controlTotal: row.controlTotal }))
    : [{ label: 'Alle medewerkers', lessonRate: data.lessonRate, controlRate: data.controlRate, lessonTotal: data.conditionSize, controlTotal: data.conditionSize }];
  return <>
    <Text x={left} y={16} width={compact ? 330 : 710} text="Slagingspercentage · de lengte van elke balk loopt van 0 tot 100%" fontFamily="sans-serif" fontSize={12} lineHeight={1.35} fill={colors.muted} />
    {rows.map((row, index) => {
      const y = (compact ? 61 : 60) + index * (compact ? 174 : 136);
      const barY = compact ? y + 46 : y + 18;
      return <Group key={row.label}>
        <Text x={left} y={y} width={compact ? 330 : 114} text={row.label} fontFamily="sans-serif" fontSize={14} fontStyle="bold" lineHeight={1.3} fill={colors.ink} />
        <Text x={x} y={compact ? y + 26 : y - 5} width={barWidth} text={`Met training  ${pct(row.lessonRate)}  ·  n = ${format.format(row.lessonTotal)}`} fontFamily="sans-serif" fontSize={13} fontStyle="bold" fill={colors.blue} />
        <Rect x={x} y={barY} width={barWidth} height={23} fill="#ffffff" stroke={colors.line} cornerRadius={8} />
        <Rect x={x} y={barY} width={barWidth * row.lessonRate} height={23} fill="#1cb0f6" cornerRadius={8} />
        <Text x={x} y={barY + 40} width={barWidth} text={`Zonder training  ${pct(row.controlRate)}  ·  n = ${format.format(row.controlTotal)}`} fontFamily="sans-serif" fontSize={13} fontStyle="bold" fill={colors.orange} />
        <Rect x={x} y={barY + 60} width={barWidth} height={23} fill="#ffffff" stroke={colors.line} cornerRadius={8} />
        <Rect x={x} y={barY + 60} width={barWidth * row.controlRate} height={23} fill="#ff9600" cornerRadius={8} />
      </Group>;
    })}
    <Text x={left} y={grouped ? compact ? 421 : 329 : compact ? 264 : 224} width={compact ? 330 : 710} text={grouped ? 'Binnen beide subgroepen: +10 procentpunten met de training.' : 'De groepssamenstelling bepaalt hoeveel elke subgroep meetelt.'} fontFamily="sans-serif" fontSize={13} lineHeight={1.4} fill={colors.purple} />
  </>;
}

function BayesDiagram({ data, compact }: { data: BayesResult; compact: boolean }) {
  if (compact) {
    const markedWidth = 312;
    const share = data.posterior ?? 0;
    return <>
      <Card x={24} y={16} width={312} height={72} title="ALLE E-MAILS" body={`${format.format(data.population)} e-mails`} tone="purple" />
      <Edge points={[180, 88, 180, 113]} tone="purple" />
      <Card x={24} y={114} width={312} height={75} title="GEMARKEERD DOOR HET FILTER" body={`${format.format(data.positives)} verwachte markeringen`} tone="purple" />
      <Edge points={[180, 189, 180, 217]} tone="purple" />
      <Text x={24} y={222} width={312} text="Van alle gemarkeerde e-mails:" fontFamily="sans-serif" fontSize={13} fontStyle="bold" fill={colors.ink} />
      <Rect x={24} y={249} width={markedWidth} height={35} fill="#ff9600" cornerRadius={10} />
      {share > 0 && <Rect x={24} y={249} width={markedWidth * share} height={35} fill="#1cb0f6" cornerRadius={share === 1 ? 10 : [10, 0, 0, 10]} />}
      <Card x={24} y={306} width={312} height={74} title="BLAUW: ECHTE SPAM" body={`${format.format(data.truePositive)} terecht gemarkeerd`} />
      <Card x={24} y={394} width={312} height={74} title="ORANJE: GEWONE MAIL" body={`${format.format(data.falsePositive)} onterecht gemarkeerd`} tone="orange" />
    </>;
  }
  const root = { x: 268, y: 14, w: 224, h: 66 };
  const spam = { x: 105, y: 124, w: 218, h: 68 };
  const normal = { x: 437, y: 124, w: 218, h: 68 };
  const bottom = 244;
  const width = 172;
  return <>
    <Card x={root.x} y={root.y} width={root.w} height={root.h} title="ALLE E-MAILS" body={`${format.format(data.population)} e-mails`} tone="purple" />
    <Edge points={[380, 80, 380, 99, 214, 99, 214, spam.y]} />
    <Edge points={[380, 80, 380, 99, 546, 99, 546, normal.y]} tone="orange" />
    <Card x={spam.x} y={spam.y} width={spam.w} height={spam.h} title="ECHTE SPAM" body={`${format.format(data.signal)} e-mails`} />
    <Card x={normal.x} y={normal.y} width={normal.w} height={normal.h} title="GEWONE MAIL" body={`${format.format(data.noSignal)} e-mails`} tone="orange" />
    <Edge points={[214, 192, 214, 216, 108, 216, 108, bottom]} />
    <Edge points={[214, 192, 214, 216, 290, 216, 290, bottom]} />
    <Edge points={[546, 192, 546, 216, 472, 216, 472, bottom]} tone="orange" />
    <Edge points={[546, 192, 546, 216, 654, 216, 654, bottom]} tone="orange" />
    <Card x={22} y={bottom} width={width} height={82} title="GEMARKEERD" body={`${format.format(data.truePositive)} echte spam`} />
    <Card x={204} y={bottom} width={width} height={82} title="NIET GEMARKEERD" body={`${format.format(data.falseNegative)} gemiste spam`} tone="purple" />
    <Card x={386} y={bottom} width={width} height={82} title="GEMARKEERD" body={`${format.format(data.falsePositive)} gewone mail`} tone="orange" />
    <Card x={568} y={bottom} width={width} height={82} title="NIET GEMARKEERD" body={`${format.format(data.trueNegative)} gewone mail`} tone="green" />
    <Text x={22} y={346} width={716} text="Voor de conclusie na een markering tel je beide ‘gemarkeerd’-groepen mee." fontFamily="sans-serif" fontSize={13} fill={colors.purple} align="center" />
  </>;
}

/** The diagram is an enhancement; identical information and controls remain in the DOM. */
export function LabCanvas(props: CanvasProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => setWidth(element.getBoundingClientRect().width);
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const compact = width < 600;
  const baseWidth = compact ? 360 : 760;
  const baseHeight = props.kind === 'structure' ? compact ? 543 : 383 : props.kind === 'bayes' ? compact ? 492 : 380 : props.grouped ? compact ? 462 : 367 : compact ? 305 : 267;
  const scale = width / baseWidth;
  return <div ref={ref} aria-hidden="true" className="w-full overflow-hidden" style={{ minHeight: width > 0 ? baseHeight * scale : 260 }}>
    {width > 0 && <Stage width={width} height={baseHeight * scale} scaleX={scale} scaleY={scale} listening={false}>
      <Layer>
        {props.kind === 'structure' && <StructureDiagram state={props.structure} compact={compact} />}
        {props.kind === 'causality' && <CausalityDiagram data={props.causality} grouped={props.grouped} compact={compact} />}
        {props.kind === 'bayes' && <BayesDiagram data={props.bayes} compact={compact} />}
      </Layer>
    </Stage>}
  </div>;
}
