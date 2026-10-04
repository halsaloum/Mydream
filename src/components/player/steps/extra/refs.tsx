'use client';

/* eslint-disable react-hooks/refs */

import { Link2 } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { tokenize } from '@/content/text';
import { cn } from '@/lib/cn';
import { play } from '@/lib/sound';
import { InlineFeedback, Stage, StepIntro, type StepProps } from '../shared';

type Path = { key: string; d: string; color: string };
const COLORS = [
  { accent: 'blue', stroke: 'var(--color-blue)' },
  { accent: 'orange', stroke: 'var(--color-orange)' },
  { accent: 'purple', stroke: 'var(--color-purple-deep)' },
];

export function RefsStep({ step, response, onChange, locked }: StepProps<'refs'>) {
  const tokens = tokenize(step.text);
  const [selected, setSelected] = useState<number | null>(null);
  const [bad, setBad] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const box = useRef<HTMLDivElement | null>(null);
  const nodes = useRef(new Map<string, HTMLElement>());
  const [paths, setPaths] = useState<Path[]>([]);

  const register = (id: string) => (node: HTMLElement | null) => {
    if (node) nodes.current.set(id, node);
    else nodes.current.delete(id);
  };

  const measure = useCallback(() => {
    const root = box.current;
    if (!root) return;
    const rootRect = root.getBoundingClientRect();
    if (!rootRect.width && !rootRect.height) {
      setPaths([]);
      return;
    }
    const next: Path[] = [];
    for (let i = 0; i < response.linked && i < step.refs.length; i++) {
      const ref = step.refs[i];
      if (!ref) continue;
      const from = nodes.current.get(`ref-${i}`)?.getBoundingClientRect();
      const to = nodes.current.get(`cand-${ref.to}`)?.getBoundingClientRect();
      if (!from || !to || (!from.width && !from.height) || (!to.width && !to.height)) continue;
      const x1 = from.left + from.width / 2 - rootRect.left;
      const y1 = from.top + from.height / 2 - rootRect.top;
      const x2 = to.left + to.width / 2 - rootRect.left;
      const y2 = to.top + to.height / 2 - rootRect.top;
      const midY = Math.min(y1, y2) - 22 - i * 10;
      next.push({ key: `${i}:${ref.to}`, color: COLORS[i % COLORS.length]?.stroke ?? 'var(--color-purple)', d: `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}` });
    }
    setPaths(next);
  }, [response.linked, step.refs]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const pickRef = (index: number) => {
    if (locked || index !== response.linked) return;
    play('select');
    setSelected(index);
    setMessage('');
    setBad(null);
  };

  const pickCandidate = (id: string) => {
    if (locked || response.linked >= step.refs.length) return;
    const index = selected === response.linked ? selected : response.linked;
    const ref = step.refs[index];
    if (!ref) return;
    setBad(null);
    setMessage('');
    if (id !== ref.to) {
      play('wrong');
      setBad(id);
      setMessage(`Dat klopt niet. ${ref.ask}`);
      window.setTimeout(() => setBad((current) => (current === id ? null : current)), 450);
      onChange({ ...response, mistakes: response.mistakes + 1 });
      return;
    }
    play('right');
    setSelected(null);
    onChange({ ...response, linked: response.linked + 1 });
  };

  const activeRefIndex = selected === response.linked ? selected : response.linked < step.refs.length ? response.linked : null;
  const current = step.refs[Math.min(response.linked, step.refs.length - 1)];
  const candidateStarts = new Map(step.candidates.map((candidate) => [candidate.from, candidate]));
  const refByAt = new Map(step.refs.map((ref, index) => [ref.at, { ...ref, index }]));
  const completedCandidate = (id: string) => step.refs.slice(0, response.linked).some((ref) => ref.to === id);

  const pieces = [];
  for (let i = 0; i < tokens.length; i++) {
    const candidate = candidateStarts.get(i);
    const ref = refByAt.get(i);
    if (candidate) {
      const text = tokens.slice(candidate.from, candidate.to + 1).join(' ');
      pieces.push(
        <button
          key={`cand-${candidate.id}`}
          ref={register(`cand-${candidate.id}`)}
          type="button"
          disabled={locked || response.linked >= step.refs.length}
          onClick={() => pickCandidate(candidate.id)}
          className={cn('mx-0.5 rounded-chip border-b-[3px] px-1 py-0.5 outline-none hover:bg-line focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus', completedCandidate(candidate.id) ? 'border-green bg-green-soft text-green-ink' : 'border-dashed border-line-strong', bad === candidate.id && 'animate-shake border-red bg-red-soft text-red-ink')}
        >
          {text}
        </button>,
      );
      i = candidate.to;
    } else if (ref) {
      const done = ref.index < response.linked;
      const active = ref.index === activeRefIndex && !locked;
      const color = COLORS[ref.index % COLORS.length];
      pieces.push(
        <button
          key={`ref-${ref.index}`}
          ref={register(`ref-${ref.index}`)}
          type="button"
          disabled={locked || ref.index !== response.linked}
          onClick={() => pickRef(ref.index)}
          data-accent={color?.accent ?? 'purple'}
          className={cn('relative mx-0.5 rounded-chip border-2 px-2 py-0.5 font-semibold outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus', done ? 'border-accent bg-accent-soft text-accent-ink' : active ? 'border-accent bg-surface text-accent-ink shadow-[0_0_0_5px_var(--accent-soft)]' : 'border-dashed border-line-strong text-ink')}
        >
          {tokens[i]}
          {done && <span className="ml-1 inline-grid size-5 place-items-center rounded-full bg-accent text-[0.7rem] font-extrabold text-accent-on">{ref.index + 1}</span>}
        </button>,
      );
    } else {
      pieces.push(<span key={`tok-${i}`}>{tokens[i]}</span>);
    }
    if (i < tokens.length - 1) pieces.push(<span key={`space-${i}`}> </span>);
  }

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />
      <Stage className="mt-6">
        <div ref={box} className="relative overflow-hidden rounded-card border-2 border-line bg-surface p-5 font-serif text-[1.35rem] leading-[1.8] text-ink sm:p-6 sm:text-[1.5rem]">
          <svg aria-hidden className="pointer-events-none absolute inset-0 size-full">
            {paths.map((path) => (
              <path key={path.key} d={path.d} fill="none" stroke={path.color} strokeWidth="3" strokeLinecap="round" opacity="0.85" />
            ))}
          </svg>
          <div className="relative z-1">{pieces}</div>
        </div>
      </Stage>
      <InlineFeedback tone={message ? 'wrong' : response.linked >= step.refs.length ? 'right' : 'info'} id={message || response.linked} className="mt-4">
        {message || (response.linked >= step.refs.length ? step.done?.note : <span className="flex items-center gap-2"><Link2 aria-hidden className="size-4" /> {current?.ask}</span>)}
      </InlineFeedback>
    </div>
  );
}
