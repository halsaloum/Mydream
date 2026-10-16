'use client';

import { ArrowLeft, ArrowRight, AudioLines, Pause, Play, Square, Volume2 } from 'lucide-react';
import { useEffect, useId, useRef, useState, type RefObject } from 'react';
import Highlighter from 'react-highlight-words';
import { Button } from '@/components/ui/button';
import { fingerprint } from '@/engine/hash';
import { cn } from '@/lib/cn';
import { isCalmMotion } from '@/lib/motion';
import { collectReadingParts, readingWord } from '@/lib/reading/content';
import type { ReadingPart, ReadingWord } from '@/lib/reading/types';
import { canSpeak, pauseSpeaking, pickVoice, rankVoices, resumeSpeaking, speakAll, stopSpeaking, useSpeechStatus, useVoices, voiceLabel } from '@/lib/speech';
import { useSettings } from '@/state/settings';

const AUTO = 'automatic';
const SAMPLE = 'Zo klinkt deze Nederlandse stem. Je kunt rustig meelezen en zelf het tempo kiezen.';
const rateLabel = (rate: number) => `${new Intl.NumberFormat('nl-NL', { minimumFractionDigits: 1, maximumFractionDigits: 2 }).format(rate)}×`;
const textSignature = (parts: ReadingPart[]) => fingerprint(parts.map((part) => part.text));

type ControlsProps = { parts: ReadingPart[]; contentKey: string; title?: string; preparing?: boolean };
type RunProps = ControlsProps & { readingOpen: boolean; onReadingOpen: (open: boolean) => void; settingsOpen: boolean; onSettingsOpen: (open: boolean) => void };

/** The text signature owns the speech lifetime; changing only DOM references keeps the run. */
export function ReadingControls({ parts, contentKey, title, preparing = false }: ControlsProps) {
  const [readingOpen, setReadingOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  return <ReadingRun key={`${contentKey}:${textSignature(parts)}`} parts={parts} contentKey={contentKey} title={title} preparing={preparing} readingOpen={readingOpen} onReadingOpen={setReadingOpen} settingsOpen={settingsOpen} onSettingsOpen={setSettingsOpen} />;
}

function ReadingRun({ parts, title, preparing, readingOpen, onReadingOpen, settingsOpen, onSettingsOpen }: RunProps) {
  const id = useId();
  const voices = useVoices();
  const status = useSpeechStatus();
  const preferredVoice = useSettings((state) => state.speech.voice);
  const rate = useSettings((state) => state.speech.readerRate);
  const ranked = rankVoices(voices);
  const automatic = pickVoice(voices, null);
  const available = ranked.length > 0 && canSpeak(voices);
  const ready = available && parts.length > 0 && !preparing;
  const selectedVoice = preferredVoice && ranked.some((entry) => entry.voice.voiceURI === preferredVoice) ? preferredVoice : AUTO;
  const [owned, setOwned] = useState(false);
  const [current, setCurrent] = useState<number | null>(null);
  const [cursor, setCursor] = useState(0);
  const [word, setWord] = useState<(ReadingWord & { part: number }) | null>(null);
  const [finished, setFinished] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [follow, setFollow] = useState(true);
  const ownsRun = useRef(false);
  const localRun = useRef(0);
  const offset = useRef(0);
  const previewRun = useRef(false);
  const fragmentNodes = useRef(new Map<number, HTMLParagraphElement>());
  const readingPane = useRef<HTMLDivElement>(null);
  const followReading = useRef(true);

  const scrollFragment = (index: number) => {
    const pane = readingPane.current;
    const paragraph = fragmentNodes.current.get(index);
    if (!pane || !paragraph) return;
    const paneTop = pane.getBoundingClientRect().top + pane.clientTop;
    const bounds = paragraph.getBoundingClientRect();
    if (bounds.top >= paneTop && bounds.bottom <= paneTop + pane.clientHeight) return;
    const top = Math.max(0, pane.scrollTop + bounds.top - paneTop - 16);
    // Scroll the reading area itself: scrollIntoView could also move the lesson page.
    if (typeof pane.scrollTo === 'function') pane.scrollTo({ top, behavior: isCalmMotion() ? 'instant' : 'smooth' });
    else pane.scrollTop = top;
  };

  useEffect(() => () => {
    const wasOwned = ownsRun.current;
    ownsRun.current = false;
    localRun.current += 1;
    if (wasOwned) stopSpeaking();
  }, []);

  useEffect(() => {
    const element = owned && current !== null ? parts[current]?.element : null;
    if (!element) return;
    element.setAttribute('data-reading-active', 'true');
    return () => { element.removeAttribute('data-reading-active'); };
  }, [parts, current, owned]);

  const startAt = (from: number, stayPaused = false, preview = false) => {
    if (preview ? !available : !ready) return;
    const base = Math.max(0, Math.min(parts.length - 1, from));
    const token = ++localRun.current;
    ownsRun.current = true;
    previewRun.current = preview;
    if (!preview) { offset.current = base; setCursor(base); }
    setOwned(true);
    setCurrent(null);
    setWord(null);
    setFinished(false);
    setPreviewing(preview);
    setError(null);
    const release = () => {
      if (token !== localRun.current || !ownsRun.current) return false;
      ownsRun.current = false;
      setOwned(false);
      setPreviewing(false);
      setCurrent(null);
      setWord(null);
      return true;
    };
    const started = speakAll(preview ? [SAMPLE] : parts.slice(base).map((part) => part.text), {
      rate: useSettings.getState().speech.readerRate,
      onChunk: ({ index, text }) => {
        if (preview || token !== localRun.current || !ownsRun.current) return;
        const next = base + index;
        // The collector supplies speech chunks; a mismatch must never mark unrelated text.
        if (parts[next]?.text !== text) { setCurrent(null); setWord(null); return; }
        offset.current = next;
        setCursor(next);
        setCurrent(next);
        setWord(null);
        if (followReading.current && !window.speechSynthesis?.paused) scrollFragment(next);
      },
      onBoundary: (boundary) => {
        if (preview || token !== localRun.current || !ownsRun.current || (boundary.name && boundary.name !== 'word')) return;
        const next = base + boundary.index;
        if (parts[next]?.text !== boundary.text) return;
        const range = readingWord(boundary.text, boundary.charIndex, boundary.charLength);
        setWord(range ? { ...range, part: next } : null);
      },
      onEnd: () => { if (release() && !preview) setFinished(true); },
      onError: () => { if (release()) setError('Voorlezen is gestopt. Probeer opnieuw of kies een andere stem.'); },
      onInterrupt: () => { if (release()) setFinished(false); },
    });
    if (!started) {
      release();
      setError('Voorlezen kon niet starten. Kies een beschikbare Nederlandse stem of probeer opnieuw.');
    } else if (stayPaused && !pauseSpeaking()) {
      setError('Je instelling is aangepast; deze browser kon het voorlezen niet pauzeren.');
    }
  };

  const stop = () => {
    const wasOwned = ownsRun.current;
    ownsRun.current = false;
    localRun.current += 1;
    offset.current = 0;
    setOwned(false);
    setCurrent(null);
    setCursor(0);
    setWord(null);
    setFinished(false);
    setPreviewing(false);
    setError(null);
    if (wasOwned) stopSpeaking();
  };
  const changeRate = (next: number) => {
    if (!Number.isFinite(next)) return;
    useSettings.getState().setSpeech({ readerRate: Math.min(2, Math.max(0.6, next)) });
    if (ownsRun.current) startAt(offset.current, status === 'paused', previewRun.current);
  };
  const changeVoice = (next: string) => {
    useSettings.getState().setSpeech({ voice: next === AUTO ? null : next });
    if (ownsRun.current) startAt(offset.current, status === 'paused', previewRun.current);
  };
  const selectFragment = (next: number) => {
    if (next < 0 || next >= parts.length) return;
    if (ownsRun.current) startAt(next, status === 'paused');
    else { offset.current = next; setCursor(next); setFinished(false); }
    scrollFragment(next);
  };
  const progress = current === null ? '' : ` · fragment ${current + 1} van ${parts.length}`;
  const message = !available
    ? 'Deze browser biedt momenteel geen Nederlandse stem. Je kunt de tekst in de leesmodus blijven lezen.'
    : error ?? (owned
      ? `${status === 'paused' ? 'Gepauzeerd' : previewing ? 'Proefluisteren' : 'Voorlezen'}${progress}. ${previewing ? 'Luister of deze stem prettig klinkt.' : 'Tempo of stem wijzigen gaat verder vanaf dit fragment.'}`
      : preparing ? 'De uitleg wordt klaargezet. Je kunt zo luisteren.' : finished ? 'Voorlezen van deze pagina is klaar.' : parts.length ? 'Kies Luisteren om te beginnen. De leesmodus opent zonder geluid.' : 'Op deze pagina is nu geen tekst beschikbaar om voor te lezen.');

  return <section data-readaloud-ignore aria-label="Voorlezen" className="rounded-card border-2 border-blue-line bg-white p-4 shadow-sm sm:p-5">
    <div className="flex flex-wrap items-center gap-2">
      {!owned ? <Button variant="accent" data-accent="blue" size="sm" disabled={!ready} onClick={() => startAt(finished ? 0 : offset.current)}><Volume2 aria-hidden className="size-4" />Luisteren</Button> : status === 'paused' ? <Button variant="accent" data-accent="blue" size="sm" onClick={() => { setError(null); if (!resumeSpeaking()) setError('Hervatten lukte niet. Stop het voorlezen en probeer opnieuw.'); }}><Play aria-hidden className="size-4" />Hervatten</Button> : <Button variant="secondary" size="sm" onClick={() => { setError(null); if (!pauseSpeaking()) setError('Pauzeren lukte niet in deze browser.'); }}><Pause aria-hidden className="size-4" />Pauzeren</Button>}
      {owned && <Button variant="ghost" size="sm" onClick={stop}><Square aria-hidden className="size-4" />Stoppen</Button>}
      <span className="text-small font-semibold text-blue-ink">{rateLabel(rate)}</span>
    </div>
    <p role="status" className="mt-3 text-small leading-relaxed text-ink-muted">{message}</p>

    <details open={settingsOpen} onToggle={(event) => onSettingsOpen(event.currentTarget.open)} className="mt-3 rounded-control border border-line bg-sunken p-3">
      <summary onClick={(event) => { event.preventDefault(); onSettingsOpen(!settingsOpen); }} className="min-h-11 cursor-pointer font-display text-small font-bold text-ink-soft">Stem en tempo · {rateLabel(rate)}</summary>
      <div className="mt-3 grid items-start gap-5 sm:grid-cols-2">
        <div className="min-w-0"><label htmlFor={`${id}-voice`} className="block text-small font-bold text-ink-muted">Nederlandse stem</label><select id={`${id}-voice`} value={selectedVoice} disabled={!available} onChange={(event) => changeVoice(event.target.value)} className="mt-2 min-h-12 w-full min-w-0 rounded-control border border-line bg-white px-3 py-2 text-small text-ink"><option value={AUTO}>Automatisch{automatic ? ` (${voiceLabel(automatic)})` : ''}</option>{ranked.map((entry) => <option key={entry.voice.voiceURI} value={entry.voice.voiceURI}>{voiceLabel(entry.voice)}{entry.region ? ` · ${entry.region}` : ''}{entry.quality === 'top' ? ' · natuurlijke stem' : ''}</option>)}</select><Button className="mt-3" variant="secondary" size="sm" disabled={!available} onClick={() => startAt(offset.current, false, true)}><AudioLines aria-hidden className="size-4" />Proefluisteren</Button><p className="mt-2 text-caption leading-relaxed text-ink-muted">We kiezen automatisch de best beschikbare Nederlandse stem. Beluister zelf welke stem je prettig vindt.</p></div>
        <div><label htmlFor={`${id}-rate`} className="flex items-center justify-between gap-3 text-small font-bold text-ink-muted"><span id={`${id}-rate-label`}>Spreektempo</span><span>{rateLabel(rate)}</span></label><input id={`${id}-rate`} type="range" aria-labelledby={`${id}-rate-label`} min="0.6" max="2" step="0.05" value={rate} aria-valuetext={`${rateLabel(rate)} van het gewone tempo`} onChange={(event) => changeRate(Number(event.target.value))} className="mt-2 min-h-11 w-full accent-[var(--color-blue)]" /><div className="flex flex-wrap gap-1" role="group" aria-label="Snelle tempokeuze">{[0.8, 1, 1.25, 1.5, 2].map((preset) => <Button key={preset} variant={Math.abs(rate - preset) < 0.001 ? 'secondary' : 'ghost'} size="sm" aria-pressed={Math.abs(rate - preset) < 0.001} className="px-3" onClick={() => changeRate(preset)}>{rateLabel(preset)}</Button>)}</div></div>
      </div>
    </details>

    <details open={readingOpen} onToggle={(event) => onReadingOpen(event.currentTarget.open)} className="mt-3 rounded-control border border-blue-line bg-blue-soft/25 p-3 sm:p-4">
      <summary onClick={(event) => { event.preventDefault(); onReadingOpen(!readingOpen); }} className="min-h-11 cursor-pointer font-display font-bold text-blue-ink">Leesmodus · grotere tekst en meelezen</summary>
      {readingOpen && <div className="mt-3">
        <h2 className="font-display text-title-sm font-bold text-ink">{title ?? 'Lees rustig mee'}</h2>
        <p className="mt-2 text-small leading-relaxed text-ink-soft">Lees rustig mee met de tekst hieronder. Tijdens het voorlezen licht het huidige woord op als je stem woordmarkering ondersteunt. Bij andere stemmen blijft het hele fragment gemarkeerd.</p>
        <p className="mt-2 text-caption font-semibold text-blue-ink">{word ? 'Het gemarkeerde woord wordt nu voorgelezen.' : owned && current !== null ? 'Het huidige fragment is gemarkeerd. Woordmarkering verschijnt wanneer die voor deze stem beschikbaar is.' : 'De tekst blijft leesbaar zonder het voorlezen te starten.'}</p>
        <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-3 text-small font-semibold text-ink-soft"><input type="checkbox" checked={follow} onChange={(event) => { followReading.current = event.target.checked; setFollow(event.target.checked); }} className="size-5 accent-blue-ink" />Volg de gelezen zin</label>
        <nav aria-label="Door de leesfragmenten" className="my-4 flex flex-wrap items-center justify-between gap-2"><Button size="sm" variant="secondary" disabled={parts.length === 0 || cursor <= 0} onClick={() => selectFragment(cursor - 1)}><ArrowLeft aria-hidden className="size-4" />Vorig fragment</Button><span className="text-caption text-ink-muted">{parts.length ? `Fragment ${cursor + 1} van ${parts.length}` : 'Geen tekst'}</span><Button size="sm" variant="secondary" disabled={parts.length === 0 || cursor >= parts.length - 1} onClick={() => selectFragment(cursor + 1)}>Volgend fragment<ArrowRight aria-hidden className="size-4" /></Button></nav>
        <div ref={readingPane} aria-label="Tekst om mee te lezen" className="max-h-[65dvh] space-y-4 overflow-y-auto overscroll-contain rounded-control bg-white p-3 sm:p-4" lang="nl">
          {parts.map((part, index) => {
            const active = owned && current === index;
            const range = active && word?.part === index ? word : null;
            return <p key={part.id} ref={(element) => { if (element) fragmentNodes.current.set(index, element); else fragmentNodes.current.delete(index); }} aria-current={active ? 'true' : undefined} className={cn('rounded-control border-2 px-3 py-2 font-serif text-[1.25rem] leading-[1.8] break-words sm:text-[1.4rem]', active ? 'border-blue-ink bg-blue-soft/30' : 'border-transparent text-ink')}>
              <Highlighter searchWords={[]} findChunks={() => range ? [{ start: range.start, end: range.end, searchIndex: 0 }] : []} textToHighlight={part.text} highlightClassName="rounded bg-yellow-soft font-bold text-ink underline decoration-2 underline-offset-4" />
            </p>;
          })}
        </div>
      </div>}
    </details>
  </section>;
}

type ReaderProps = { scopeRef: RefObject<HTMLElement | null>; contentKey: string; title?: string };

function ignoredMutation(record: MutationRecord): boolean {
  const element = record.target instanceof Element ? record.target : record.target.parentElement;
  if (element?.closest('[data-readaloud-ignore]')) return true;
  if (record.type !== 'childList') return false;
  return [...record.addedNodes, ...record.removedNodes].every((node) => node instanceof Element && node.matches('[data-readaloud-ignore]'));
}

function settlingAnimations(scope: HTMLElement): Animation[] {
  if (typeof scope.getAnimations !== 'function') return [];
  return scope.getAnimations({ subtree: true }).filter((animation) => {
    const effect = animation.effect as KeyframeEffect | null;
    const target = effect?.target;
    if (animation.playState !== 'running' || !(target instanceof Element) || target.closest('[data-readaloud-ignore]')) return false;
    const endTime = Number(effect?.getComputedTiming().endTime);
    return Number.isFinite(endTime) && endTime > 0;
  });
}

/** Observe current lesson text; highlights and the reader's duplicate text are never input. */
export function LessonReader({ scopeRef, contentKey, title }: ReaderProps) {
  const [snapshot, setSnapshot] = useState<{ scope: HTMLElement | null; parts: ReadingPart[]; generation: number; preparing: boolean }>({ scope: null, parts: [], generation: 0, preparing: false });
  // Reattach after a parent commit too: a stable ref object can point to a replaced lesson node.
  useEffect(() => {
    const scope = scopeRef.current;
    let active = true;
    const watchedAnimations = new Set<Animation>();
    const update = () => {
      if (!active) return;
      const animations = scope ? settlingAnimations(scope) : [];
      const preparing = animations.length > 0;
      for (const animation of animations) {
        if (watchedAnimations.has(animation)) continue;
        watchedAnimations.add(animation);
        // No guessed delay: collect again when the browser finishes or cancels the effect.
        void animation.finished.then(update, update);
      }
      const parts = scope ? collectReadingParts(scope) : [];
      setSnapshot((previous) => {
        if (previous.scope === scope && previous.preparing === preparing && previous.parts.length === parts.length && previous.parts.every((part, index) => part.id === parts[index]?.id && part.text === parts[index]?.text && part.element === parts[index]?.element)) return previous;
        return { scope, parts, preparing, generation: previous.generation + (previous.scope === scope ? 0 : 1) };
      });
    };
    update();
    if (!scope) return () => { active = false; };
    const observer = new MutationObserver((records) => { if (records.some((record) => !ignoredMutation(record))) update(); });
    observer.observe(scope, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['open', 'hidden', 'inert', 'aria-hidden', 'aria-selected', 'aria-expanded', 'aria-label', 'aria-labelledby', 'class', 'style', 'data-readaloud-hidden', 'data-closed', 'data-panel-closed', 'data-reading-step', 'data-reading-panel'] });
    // A dialog can hide the whole lesson through an ancestor outside the reading scope.
    // Watch only visibility attributes there; unrelated page content is not reading input.
    const ancestors = new MutationObserver(update);
    for (let parent = scope.parentElement; parent; parent = parent.parentElement) {
      ancestors.observe(parent, { attributes: true, attributeFilter: ['open', 'hidden', 'inert', 'aria-hidden', 'class', 'style', 'data-readaloud-hidden', 'data-closed', 'data-panel-closed'] });
    }
    const change = (event: Event) => { if (!(event.target instanceof Element) || !event.target.closest('[data-readaloud-ignore]')) update(); };
    scope.addEventListener('change', change);
    // CSS can reveal new feedback without changing its style attribute.
    scope.addEventListener('animationstart', change);
    scope.addEventListener('animationend', change);
    scope.addEventListener('transitionrun', change);
    scope.addEventListener('transitionend', change);
    return () => {
      active = false;
      observer.disconnect();
      ancestors.disconnect();
      scope.removeEventListener('change', change);
      scope.removeEventListener('animationstart', change);
      scope.removeEventListener('animationend', change);
      scope.removeEventListener('transitionrun', change);
      scope.removeEventListener('transitionend', change);
    };
  });
  return <ReadingControls key={snapshot.generation} parts={snapshot.parts} contentKey={contentKey} title={title} preparing={snapshot.preparing} />;
}
