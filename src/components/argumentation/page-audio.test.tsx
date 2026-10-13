import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { chunks, speak, stopSpeaking } from '@/lib/speech';
import { DEFAULT_SETTINGS, useSettings } from '@/state/settings';
import { PageAudio } from './page-audio';

const voice = (name: string, lang: string) => ({ name, lang, voiceURI: name, localService: true, default: false }) as SpeechSynthesisVoice;
const FENNA = voice('Microsoft Fenna Online (Natural) - Dutch (Netherlands)', 'nl-NL');
const ELLEN = voice('Ellen', 'nl-BE');
const ENGLISH = voice('Google US English', 'en-US');
const text = 'Een conclusie benoemt wat je wilt verdedigen. Een premisse geeft daarvoor een reden die zelf nog beoordeling vraagt. De gevolgtrekking verbindt de reden met de conclusie, zonder automatisch de waarheid te bewijzen.';

class FakeUtterance {
  lang = '';
  rate = 1;
  voice: SpeechSynthesisVoice | null = null;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onpause: (() => void) | null = null;
  onresume: (() => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
  constructor(public text: string) {}
}

function stubSpeech(voices: SpeechSynthesisVoice[] = [ENGLISH, ELLEN, FENNA]) {
  const spoken: FakeUtterance[] = [];
  const engine = {
    paused: false,
    speaking: false,
    getVoices: () => voices,
    addEventListener: vi.fn(),
    speak: vi.fn((utterance: FakeUtterance) => { spoken.push(utterance); engine.speaking = true; }),
    cancel: vi.fn(() => { engine.speaking = false; engine.paused = false; }),
    pause: vi.fn(() => { engine.paused = true; }),
    resume: vi.fn(() => { engine.paused = false; }),
  };
  vi.stubGlobal('speechSynthesis', engine);
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
  return { engine, spoken };
}
function openSettings() { fireEvent.click(screen.getByText(/^Stem en tempo ·/)); }

beforeEach(() => { useSettings.setState(DEFAULT_SETTINGS); });
afterEach(() => { cleanup(); stopSpeaking(); vi.unstubAllGlobals(); });

describe('current-page Dutch reading controls', () => {
  it('never autoplays and keeps settings folded until the learner opens them', () => {
    const { spoken } = stubSpeech();
    const { container } = render(<PageAudio pageId="concept-argument" text={text} />);
    expect(spoken).toHaveLength(0);
    expect(container.querySelector('details')).not.toHaveAttribute('open');
    expect(screen.getByRole('button', { name: 'Voorlezen' })).toBeEnabled();
    expect(screen.getByRole('slider', { name: 'Spreektempo' })).not.toBeVisible();
    openSettings();
    expect(screen.getByRole('slider', { name: 'Spreektempo' })).toBeVisible();
    expect(screen.queryByRole('option', { name: ENGLISH.name })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '0,8×' }));
    expect(useSettings.getState().speech.readerRate).toBe(0.8);
    expect(spoken).toHaveLength(0);
  });

  it('starts, pauses, resumes and stops a Dutch run with native controls', () => {
    const { engine, spoken } = stubSpeech();
    render(<PageAudio pageId="concept-argument" text={text} />);
    fireEvent.click(screen.getByRole('button', { name: 'Voorlezen' }));
    expect(spoken[0]).toMatchObject({ text: chunks(text)[0], rate: 1, voice: FENNA, lang: 'nl-NL' });
    act(() => spoken[0]?.onstart?.());
    expect(screen.getByRole('status')).toHaveTextContent('fragment 1 van');
    fireEvent.click(screen.getByRole('button', { name: 'Pauzeren' }));
    expect(engine.pause).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Hervatten' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Hervatten' }));
    expect(engine.resume).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Pauzeren' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Stoppen' }));
    expect(screen.getByRole('button', { name: 'Voorlezen' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Stoppen' })).toBeDisabled();
  });

  it('changes rate and voice from the current fragment, without replaying the whole page', () => {
    const { spoken } = stubSpeech();
    render(<PageAudio pageId="section-first" text={text} />);
    fireEvent.click(screen.getByRole('button', { name: 'Voorlezen' }));
    act(() => { spoken[0]?.onstart?.(); spoken[0]?.onend?.(); });
    act(() => spoken[1]?.onstart?.());
    openSettings();
    fireEvent.change(screen.getByRole('slider', { name: 'Spreektempo' }), { target: { value: '1.25' } });
    expect(spoken.at(-1)).toMatchObject({ text: chunks(text)[1], rate: 1.25 });
    act(() => spoken.at(-1)?.onstart?.());
    fireEvent.change(screen.getByRole('combobox', { name: 'Nederlandse stem' }), { target: { value: ELLEN.voiceURI } });
    expect(spoken.at(-1)).toMatchObject({ text: chunks(text)[1], voice: ELLEN });
    expect(useSettings.getState().speech).toMatchObject({ voice: ELLEN.voiceURI, readerRate: 1.25, rate: DEFAULT_SETTINGS.speech.rate });
  });

  it('keeps a paused run paused after a speed change', () => {
    const { engine, spoken } = stubSpeech();
    render(<PageAudio pageId="section-first" text={text} />);
    fireEvent.click(screen.getByRole('button', { name: 'Voorlezen' }));
    act(() => { spoken[0]?.onstart?.(); spoken[0]?.onend?.(); });
    act(() => spoken[1]?.onstart?.());
    fireEvent.click(screen.getByRole('button', { name: 'Pauzeren' }));
    openSettings();
    fireEvent.click(screen.getByRole('button', { name: '0,8×' }));
    expect(spoken.at(-1)).toMatchObject({ text: chunks(text)[1], rate: 0.8 });
    expect(engine.paused).toBe(true);
    expect(screen.getByRole('button', { name: 'Hervatten' })).toBeVisible();
  });

  it('stops on page or visible-text changes, without starting the next page', () => {
    const { engine, spoken } = stubSpeech();
    const view = render(<PageAudio pageId="first" text={text} />);
    fireEvent.click(screen.getByRole('button', { name: 'Voorlezen' }));
    const before = engine.cancel.mock.calls.length;
    view.rerender(<PageAudio pageId="second" text={text} />);
    expect(engine.cancel).toHaveBeenCalledTimes(before + 1);
    expect(spoken).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Voorlezen' }));
    const beforeTextChange = engine.cancel.mock.calls.length;
    view.rerender(<PageAudio pageId="second" text={`${text} Nieuwe zichtbare feedback.`} />);
    expect(engine.cancel).toHaveBeenCalledTimes(beforeTextChange + 1);
    expect(spoken).toHaveLength(2);
  });

  it('releases ownership when another speech widget takes over and does not cancel that widget on unmount', () => {
    const { engine } = stubSpeech();
    const view = render(<PageAudio pageId="first" text={text} />);
    fireEvent.click(screen.getByRole('button', { name: 'Voorlezen' }));
    act(() => { speak('huis'); });
    expect(screen.getByRole('button', { name: 'Voorlezen' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Stoppen' })).toBeDisabled();
    const before = engine.cancel.mock.calls.length;
    view.unmount();
    expect(engine.cancel).toHaveBeenCalledTimes(before);
  });

  it('disables unavailable Dutch speech and handles native errors without hanging', () => {
    const { unmount } = render(<PageAudio pageId="no-voice" text={text} />);
    expect(screen.getByRole('button', { name: 'Voorlezen' })).toBeDisabled();
    unmount();
    const { spoken } = stubSpeech();
    render(<PageAudio pageId="ready" text={text} />);
    fireEvent.click(screen.getByRole('button', { name: 'Voorlezen' }));
    act(() => spoken[0]?.onerror?.({ error: 'synthesis-failed' }));
    const audio = within(screen.getByRole('region', { name: 'Voorlezen' }));
    expect(audio.getByRole('status')).toHaveTextContent('Voorlezen is gestopt');
    expect(audio.getByRole('button', { name: 'Voorlezen' })).toBeVisible();
  });
});
