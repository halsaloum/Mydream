'use client';

import { Pause, Play, Square, Volume2 } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { chunks, canSpeak, pauseSpeaking, pickVoice, rankVoices, resumeSpeaking, speakAll, stopSpeaking, useSpeechStatus, useVoices, voiceLabel } from '@/lib/speech';
import { useSettings } from '@/state/settings';

const AUTO = 'automatic';
const rateLabel = (rate: number) => `${new Intl.NumberFormat('nl-NL', { minimumFractionDigits: 1, maximumFractionDigits: 2 }).format(rate)}×`;

function PageAudioControls({ text }: { text: string }) {
  const id = useId();
  const voices = useVoices();
  const status = useSpeechStatus();
  const preferredVoice = useSettings((state) => state.speech.voice);
  const rate = useSettings((state) => state.speech.readerRate);
  const parts = chunks(text);
  const ranked = rankVoices(voices);
  const automatic = pickVoice(voices, null);
  const available = ranked.length > 0 && canSpeak(voices);
  const ready = available && parts.length > 0;
  const selectedVoice = preferredVoice && ranked.some((entry) => entry.voice.voiceURI === preferredVoice) ? preferredVoice : AUTO;
  const [owned, setOwned] = useState(false);
  const [current, setCurrent] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ownsRun = useRef(false);
  const localRun = useRef(0);
  const offset = useRef(0);

  useEffect(() => () => {
    const wasOwned = ownsRun.current;
    ownsRun.current = false;
    localRun.current += 1;
    if (wasOwned) stopSpeaking();
  }, []);

  const startAt = (from: number, stayPaused = false) => {
    if (!ready) return;
    const base = Math.max(0, Math.min(parts.length - 1, from));
    const token = ++localRun.current;
    ownsRun.current = true;
    offset.current = base;
    setOwned(true);
    setCurrent(null);
    setFinished(false);
    setError(null);
    const release = () => {
      if (token !== localRun.current || !ownsRun.current) return false;
      ownsRun.current = false;
      setOwned(false);
      return true;
    };
    const started = speakAll(parts.slice(base), {
      rate: useSettings.getState().speech.readerRate,
      onChunk: ({ index }: { index: number; total: number; text: string }) => {
        if (token !== localRun.current || !ownsRun.current) return;
        offset.current = base + index;
        setCurrent(base + index);
      },
      onEnd: () => { if (release()) setFinished(true); },
      onError: () => { if (release()) setError('Voorlezen is gestopt. Probeer opnieuw of kies een andere stem.'); },
      onInterrupt: () => { if (release()) { setCurrent(null); setFinished(false); } },
    });
    if (!started) {
      release();
      setError('Voorlezen kon niet starten. Kies een beschikbare Nederlandse stem of probeer opnieuw.');
    } else if (stayPaused && !pauseSpeaking()) {
      setError('Het nieuwe tempo is ingesteld; deze browser kon het voorlezen niet pauzeren.');
    }
  };

  const stop = () => {
    const wasOwned = ownsRun.current;
    ownsRun.current = false;
    localRun.current += 1;
    offset.current = 0;
    setOwned(false);
    setCurrent(null);
    setFinished(false);
    setError(null);
    if (wasOwned) stopSpeaking();
  };
  const changeRate = (next: number) => {
    if (!Number.isFinite(next)) return;
    useSettings.getState().setSpeech({ readerRate: Math.min(1.5, Math.max(0.6, next)) });
    if (ownsRun.current) startAt(offset.current, status === 'paused');
  };
  const changeVoice = (next: string) => {
    useSettings.getState().setSpeech({ voice: next === AUTO ? null : next });
    if (ownsRun.current) startAt(offset.current, status === 'paused');
  };

  return <section aria-label="Voorlezen" className="sticky top-20 z-20 flex max-h-[calc(100dvh-12rem)] flex-wrap items-start gap-x-4 gap-y-2 overflow-y-auto rounded-2xl border border-line bg-white/95 p-3 shadow-sm backdrop-blur-md">
    <div className="flex flex-wrap items-center gap-2"><div className="flex flex-wrap gap-2">
      {!owned ? <Button variant="accent" data-accent="blue" size="sm" disabled={!ready} onClick={() => startAt(0)}><Volume2 aria-hidden="true" className="size-4" />Luisteren</Button> : status === 'paused' ? <Button variant="accent" data-accent="blue" size="sm" onClick={() => { setError(null); if (!resumeSpeaking()) setError('Hervatten lukte niet. Stop het voorlezen en probeer opnieuw.'); }}><Play aria-hidden="true" className="size-4" />Hervatten</Button> : <Button variant="secondary" size="sm" onClick={() => { setError(null); if (!pauseSpeaking()) setError('Pauzeren lukte niet in deze browser.'); }}><Pause aria-hidden="true" className="size-4" />Pauzeren</Button>}
      {owned && <Button variant="ghost" size="sm" onClick={stop}><Square aria-hidden="true" className="size-3.5" />Stoppen</Button>}
    </div></div>
    <details className="min-w-0 flex-1"><summary className="min-h-10 cursor-pointer rounded-lg px-2 py-2.5 text-caption font-semibold text-ink-muted">Stem en tempo · {rateLabel(rate)}</summary><div className="grid items-start gap-4 pt-3 sm:grid-cols-2"><label htmlFor={`${id}-voice`} className="block text-caption font-bold text-ink-muted">Nederlandse stem<select id={`${id}-voice`} value={selectedVoice} disabled={!available} onChange={(event) => changeVoice(event.target.value)} className="mt-2 min-h-11 w-full rounded-control border border-line bg-sunken px-3 py-2 text-small text-ink"><option value={AUTO}>Automatisch{automatic ? ` (${voiceLabel(automatic)})` : ''}</option>{ranked.map((entry) => <option key={entry.voice.voiceURI} value={entry.voice.voiceURI}>{voiceLabel(entry.voice)}{entry.region ? ` · ${entry.region}` : ''}</option>)}</select></label><div><label htmlFor={`${id}-rate`} className="flex items-center justify-between gap-3 text-caption font-bold text-ink-muted"><span id={`${id}-rate-label`}>Spreektempo</span><span className="font-display text-small text-blue-ink">{rateLabel(rate)}</span></label><input id={`${id}-rate`} type="range" aria-labelledby={`${id}-rate-label`} min="0.6" max="1.5" step="0.05" value={rate} aria-valuetext={`${rateLabel(rate)} van het gewone tempo`} onChange={(event) => changeRate(Number(event.target.value))} className="mt-2 min-h-11 w-full accent-[var(--color-blue)]" /><div className="flex flex-wrap gap-1" aria-label="Snelle tempokeuze">{[0.8, 1, 1.2].map((preset) => <Button key={preset} variant={Math.abs(rate - preset) < 0.001 ? 'secondary' : 'ghost'} size="sm" aria-pressed={Math.abs(rate - preset) < 0.001} className="px-3" onClick={() => changeRate(preset)}>{rateLabel(preset)}</Button>)}</div></div></div></details>
    <p role="status" className={owned || error || !available || finished ? 'w-full text-caption leading-relaxed text-ink-muted' : 'sr-only'}>{!available ? 'Deze browser biedt momenteel geen Nederlandse stem. Je kunt de tekst blijven lezen.' : error ?? (owned ? `${status === 'paused' ? 'Gepauzeerd' : 'Voorlezen'}${current === null ? '' : ` · fragment ${current + 1} van ${parts.length}`}. Tempo of stem wijzigen gaat verder vanaf dit fragment.` : finished ? 'Voorlezen van deze pagina is klaar.' : parts.length ? 'Kies Voorlezen om naar deze pagina te luisteren.' : 'Op deze pagina is nu geen tekst beschikbaar om voor te lezen.')}</p>
  </section>;
}

/** A page or visible-content change tears down its old reader run, without autoplay. */
export function PageAudio({ pageId, text }: { pageId: string; text: string }) {
  return <PageAudioControls key={`${pageId}\u0000${text}`} text={text} />;
}
