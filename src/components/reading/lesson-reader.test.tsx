import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useRef, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReadingPart } from '@/lib/reading/types';
import { speak, stopSpeaking } from '@/lib/speech';
import { DEFAULT_SETTINGS, useSettings } from '@/state/settings';
import { LessonReader, ReadingControls } from './lesson-reader';

const voice = (name: string, lang: string) => ({ name, lang, voiceURI: name, localService: true, default: false }) as SpeechSynthesisVoice;
const FENNA = voice('Microsoft Fenna Online (Natural) - Dutch (Netherlands)', 'nl-NL');
const ELLEN = voice('Ellen', 'nl-BE');
const ENGLISH = voice('Google US English', 'en-US');

class FakeUtterance {
  lang = '';
  rate = 1;
  voice: SpeechSynthesisVoice | null = null;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onpause: (() => void) | null = null;
  onresume: (() => void) | null = null;
  onboundary: ((event: { charIndex: number; charLength?: number; name: string }) => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
  constructor(public text: string) {}
}

function stubSpeech(voices: SpeechSynthesisVoice[] = [ENGLISH, ELLEN, FENNA]) {
  const spoken: FakeUtterance[] = [];
  const engine = {
    paused: false, speaking: false,
    getVoices: () => voices, addEventListener: vi.fn(),
    speak: vi.fn((utterance: FakeUtterance) => { spoken.push(utterance); engine.speaking = true; }),
    cancel: vi.fn(() => { engine.speaking = false; engine.paused = false; }),
    pause: vi.fn(() => { engine.paused = true; }), resume: vi.fn(() => { engine.paused = false; }),
  };
  vi.stubGlobal('speechSynthesis', engine);
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
  return { engine, spoken };
}

const parts: ReadingPart[] = [
  { id: 'first', text: 'Een zin met een woord.', element: null },
  { id: 'second', text: 'De volgende zin is helder.', element: null },
];
function openReading() { fireEvent.click(screen.getByText('Leesmodus · grotere tekst en meelezen', { selector: 'summary' })); }
function openSettings() { fireEvent.click(screen.getByText(/^Stem en tempo ·/, { selector: 'summary' })); }

beforeEach(() => { useSettings.setState(DEFAULT_SETTINGS); });
afterEach(() => { cleanup(); stopSpeaking(); vi.unstubAllGlobals(); vi.useRealTimers(); });

describe('Nederlandse leesmodus met echte woordgrenzen', () => {
  it('opent zonder geluid, biedt alle tekst groter aan en kiest een beschikbare Nederlandse stem', () => {
    const { spoken } = stubSpeech();
    render(<ReadingControls parts={parts} contentKey="lesson" title="Uitleg over zinnen" />);
    expect(spoken).toHaveLength(0);
    expect(screen.getByText('Leesmodus · grotere tekst en meelezen', { selector: 'summary' }).parentElement).not.toHaveAttribute('open');
    expect(screen.queryByLabelText('Tekst om mee te lezen')).not.toBeInTheDocument();
    parts.forEach((part) => expect(screen.queryByText(part.text)).not.toBeInTheDocument());
    openReading();
    expect(spoken).toHaveLength(0);
    const text = screen.getByLabelText('Tekst om mee te lezen');
    parts.forEach((part) => expect(within(text).getByText(part.text)).toBeVisible());
    expect(text.querySelector('p')).toHaveClass('leading-[1.8]');
    expect(screen.getByRole('heading', { name: 'Uitleg over zinnen' })).toBeVisible();
    openSettings();
    expect(screen.getByRole('slider', { name: 'Spreektempo' })).toHaveAttribute('max', '2');
    expect(screen.getByRole('combobox', { name: 'Nederlandse stem' })).toHaveValue('automatic');
    expect(screen.getByRole('option', { name: 'Automatisch (Fenna)' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: ENGLISH.name })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Luisteren' }));
    expect(spoken[0]).toMatchObject({ text: parts[0]!.text, voice: FENNA, lang: 'nl-NL', rate: 1 });
  });

  it('markeert alleen het daadwerkelijk gemelde woord, ook als dat woord vaker voorkomt', () => {
    const { spoken } = stubSpeech();
    const original = document.createElement('p');
    original.innerHTML = 'Een zin met een <strong>woord</strong>.';
    const markup = original.innerHTML;
    const view = render(<ReadingControls parts={[{ ...parts[0]!, element: original }, parts[1]!]} contentKey="lesson" />);
    openReading();
    fireEvent.click(screen.getByRole('button', { name: 'Luisteren' }));
    expect(view.container.querySelector('mark')).toBeNull();
    expect(original).not.toHaveAttribute('data-reading-active');
    act(() => spoken[0]!.onstart?.());
    expect(original).toHaveAttribute('data-reading-active', 'true');
    expect(view.container.querySelector('mark')).toBeNull();
    act(() => spoken[0]!.onboundary?.({ charIndex: 12, charLength: 3, name: 'word' }));
    const mark = view.container.querySelector('mark')!;
    expect(mark).toHaveTextContent(/^een$/);
    expect(mark.previousSibling).toHaveTextContent('Een zin met');
    expect(view.container.querySelectorAll('mark')).toHaveLength(1);
    expect(original.innerHTML).toBe(markup);
    act(() => spoken[0]!.onboundary?.({ charIndex: 0, charLength: 3, name: 'word' }));
    expect(view.container.querySelector('mark')).toHaveTextContent(/^Een$/);
    act(() => { spoken[0]!.onend?.(); spoken[1]!.onstart?.(); });
    expect(original).not.toHaveAttribute('data-reading-active');
    expect(view.container.querySelector('mark')).toBeNull();
    act(() => spoken[0]!.onboundary?.({ charIndex: 12, charLength: 3, name: 'word' }));
    expect(view.container.querySelector('mark')).toBeNull();
    act(() => spoken[1]!.onboundary?.({ charIndex: 3, name: 'word' }));
    expect(view.container.querySelector('mark')).toHaveTextContent('volgende');
    fireEvent.click(screen.getByRole('button', { name: 'Stoppen' }));
    expect(view.container.querySelector('mark')).toBeNull();
  });

  it('verzint geen woordtijden en gebruikt een fragment wanneer de stem geen woordgrenzen geeft', () => {
    vi.useFakeTimers();
    const { spoken } = stubSpeech();
    const view = render(<ReadingControls parts={parts} contentKey="fallback" />);
    openReading();
    fireEvent.click(screen.getByRole('button', { name: 'Luisteren' }));
    act(() => spoken[0]!.onstart?.());
    act(() => vi.advanceTimersByTime(10_000));
    expect(view.container.querySelector('mark')).toBeNull();
    expect(screen.getByText(/Het huidige fragment is gemarkeerd/)).toBeVisible();
    expect(screen.getByLabelText('Tekst om mee te lezen').querySelector('[aria-current="true"]')).toHaveTextContent(parts[0]!.text);
    act(() => spoken[0]!.onboundary?.({ charIndex: 0, charLength: parts[0]!.text.length, name: 'sentence' }));
    expect(view.container.querySelector('mark')).toBeNull();
  });

  it('volgt een echt gestart fragment alleen binnen het tekstvak en laat volgen uitzetten', () => {
    const { spoken } = stubSpeech();
    const longParts = [...parts, { id: 'third', text: 'Deze derde zin volgt daarna.', element: null }];
    render(<ReadingControls parts={longParts} contentKey="follow" />);
    openReading();
    const pane = screen.getByLabelText('Tekst om mee te lezen');
    const paragraphs = pane.querySelectorAll('p');
    Object.defineProperty(pane, 'clientHeight', { value: 200 });
    vi.spyOn(pane, 'getBoundingClientRect').mockReturnValue({ top: 100, bottom: 300 } as DOMRect);
    paragraphs.forEach((paragraph, index) => vi.spyOn(paragraph, 'getBoundingClientRect').mockReturnValue({ top: 110 + index * 300, bottom: 160 + index * 300 } as DOMRect));
    const scroll = vi.fn();
    Object.defineProperty(pane, 'scrollTo', { value: scroll });
    const pageScroll = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView');
    expect(screen.getByRole('checkbox', { name: 'Volg de gelezen zin' })).toBeChecked();
    fireEvent.click(screen.getByRole('button', { name: 'Luisteren' }));
    expect(scroll).not.toHaveBeenCalled();
    act(() => spoken[0]!.onstart?.());
    expect(scroll).not.toHaveBeenCalled();
    act(() => { spoken[0]!.onend?.(); spoken[1]!.onstart?.(); });
    expect(scroll).toHaveBeenCalledExactlyOnceWith({ top: 294, behavior: 'smooth' });
    act(() => spoken[1]!.onboundary?.({ charIndex: 3, charLength: 8, name: 'word' }));
    expect(scroll).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Volg de gelezen zin' }));
    act(() => { spoken[1]!.onend?.(); spoken[2]!.onstart?.(); });
    expect(scroll).toHaveBeenCalledTimes(1);
    expect(pageScroll).not.toHaveBeenCalled();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('volgt zonder scrollanimatie in rustige weergave en houdt woordmarkering bij gesloten leesmodus bij', () => {
    const { spoken } = stubSpeech();
    useSettings.getState().setMotion('calm');
    const view = render(<ReadingControls parts={parts} contentKey="calm-follow" />);
    fireEvent.click(screen.getByRole('button', { name: 'Luisteren' }));
    act(() => { spoken[0]!.onstart?.(); spoken[0]!.onboundary?.({ charIndex: 12, charLength: 3, name: 'word' }); });
    expect(view.container.querySelector('mark')).toBeNull();
    openReading();
    expect(view.container.querySelector('mark')).toHaveTextContent(/^een$/);
    const pane = screen.getByLabelText('Tekst om mee te lezen');
    Object.defineProperty(pane, 'clientHeight', { value: 200 });
    vi.spyOn(pane, 'getBoundingClientRect').mockReturnValue({ top: 100, bottom: 300 } as DOMRect);
    vi.spyOn(pane.querySelectorAll('p')[1]!, 'getBoundingClientRect').mockReturnValue({ top: 410, bottom: 460 } as DOMRect);
    const scroll = vi.fn();
    Object.defineProperty(pane, 'scrollTo', { value: scroll });
    act(() => { spoken[0]!.onend?.(); spoken[1]!.onstart?.(); });
    expect(scroll).toHaveBeenCalledExactlyOnceWith({ top: 294, behavior: 'instant' });
    openReading();
    expect(screen.queryByLabelText('Tekst om mee te lezen')).not.toBeInTheDocument();
  });

  it('wijzigt tempo tot 2× en stem vanaf het huidige fragment, met behoud van pauze', () => {
    const { engine, spoken } = stubSpeech();
    render(<ReadingControls parts={parts} contentKey="rate" />);
    fireEvent.click(screen.getByRole('button', { name: 'Luisteren' }));
    act(() => { spoken[0]!.onstart?.(); spoken[0]!.onend?.(); spoken[1]!.onstart?.(); });
    fireEvent.click(screen.getByRole('button', { name: 'Pauzeren' }));
    openSettings();
    fireEvent.click(screen.getByRole('button', { name: '2,0×' }));
    expect(spoken.at(-1)).toMatchObject({ text: parts[1]!.text, rate: 2 });
    expect(engine.paused).toBe(true);
    expect(screen.getByRole('button', { name: 'Hervatten' })).toBeVisible();
    fireEvent.change(screen.getByRole('combobox', { name: 'Nederlandse stem' }), { target: { value: ELLEN.voiceURI } });
    expect(spoken.at(-1)).toMatchObject({ text: parts[1]!.text, voice: ELLEN, rate: 2 });
    expect(engine.paused).toBe(true);
    expect(useSettings.getState().speech).toMatchObject({ readerRate: 2, voice: ELLEN.voiceURI, rate: DEFAULT_SETTINGS.speech.rate });
    fireEvent.click(screen.getByRole('button', { name: 'Hervatten' }));
    expect(engine.paused).toBe(false);
  });

  it('laat een fragment vooraf kiezen en navigeert tijdens luisteren zonder andere fragmenten te verwisselen', () => {
    const { spoken } = stubSpeech();
    render(<ReadingControls parts={parts} contentKey="navigate" />);
    openReading();
    expect(screen.getByRole('button', { name: 'Vorig fragment' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Volgend fragment' }));
    expect(spoken).toHaveLength(0);
    expect(screen.getByRole('button', { name: 'Volgend fragment' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Luisteren' }));
    expect(spoken[0]!.text).toBe(parts[1]!.text);
    act(() => spoken[0]!.onstart?.());
    expect(screen.getByRole('status')).toHaveTextContent('fragment 2 van 2');
    fireEvent.click(screen.getByRole('button', { name: 'Vorig fragment' }));
    expect(spoken.at(-1)!.text).toBe(parts[0]!.text);
    act(() => spoken.at(-1)!.onstart?.());
    expect(screen.getByRole('status')).toHaveTextContent('fragment 1 van 2');
  });

  it('laat proefluisteren expliciet starten en ruimt ook die eigen spraak op', () => {
    const { engine, spoken } = stubSpeech();
    const view = render(<ReadingControls parts={parts} contentKey="sample" />);
    openSettings();
    fireEvent.change(screen.getByRole('combobox', { name: 'Nederlandse stem' }), { target: { value: ELLEN.voiceURI } });
    expect(spoken).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: 'Proefluisteren' }));
    expect(spoken[0]).toMatchObject({ voice: ELLEN, text: 'Zo klinkt deze Nederlandse stem.' });
    const before = engine.cancel.mock.calls.length;
    view.unmount();
    expect(engine.cancel).toHaveBeenCalledTimes(before + 1);
  });

  it('stopt bij nieuwe tekst of context, maar niet door nieuwe referenties met dezelfde tekst', () => {
    const { engine, spoken } = stubSpeech();
    const view = render(<ReadingControls parts={parts} contentKey="first" />);
    fireEvent.click(screen.getByRole('button', { name: 'Luisteren' }));
    const before = engine.cancel.mock.calls.length;
    view.rerender(<ReadingControls parts={parts.map((part) => ({ ...part }))} contentKey="first" />);
    expect(engine.cancel).toHaveBeenCalledTimes(before);
    view.rerender(<ReadingControls parts={parts} contentKey="second" />);
    expect(engine.cancel).toHaveBeenCalledTimes(before + 1);
    expect(spoken).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Luisteren' }));
    const next = engine.cancel.mock.calls.length;
    view.rerender(<ReadingControls parts={[...parts, { id: 'feedback', text: 'Nieuwe zichtbare feedback.', element: null }]} contentKey="second" />);
    expect(engine.cancel).toHaveBeenCalledTimes(next + 1);
    expect(spoken).toHaveLength(2);
  });

  it('laat een andere voorleesknop eigenaar worden en annuleert die niet bij opruimen', () => {
    const { engine } = stubSpeech();
    const view = render(<ReadingControls parts={parts} contentKey="ownership" />);
    fireEvent.click(screen.getByRole('button', { name: 'Luisteren' }));
    act(() => { speak('Een ander voorbeeld.'); });
    expect(screen.getByRole('button', { name: 'Luisteren' })).toBeVisible();
    const before = engine.cancel.mock.calls.length;
    view.unmount();
    expect(engine.cancel).toHaveBeenCalledTimes(before);
  });

  it('blijft leesbaar zonder Nederlandse stem en herstelt na een spraakfout', () => {
    stubSpeech([ENGLISH]);
    const missing = render(<ReadingControls parts={parts} contentKey="missing" />);
    expect(screen.getByRole('button', { name: 'Luisteren' })).toBeDisabled();
    openReading();
    expect(within(screen.getByLabelText('Tekst om mee te lezen')).getByText(parts[0]!.text)).toBeVisible();
    missing.unmount();
    const { spoken } = stubSpeech();
    render(<ReadingControls parts={parts} contentKey="error" />);
    fireEvent.click(screen.getByRole('button', { name: 'Luisteren' }));
    act(() => spoken[0]!.onerror?.({ error: 'synthesis-failed' }));
    expect(screen.getByRole('status')).toHaveTextContent('Voorlezen is gestopt');
    expect(screen.getByRole('button', { name: 'Luisteren' })).toBeEnabled();
  });
});

function LiveLesson({ contentKey = 'live' }: { contentKey?: string }) {
  const scopeRef = useRef<HTMLElement>(null);
  const [feedback, setFeedback] = useState(false);
  return <main ref={scopeRef}>
    <LessonReader scopeRef={scopeRef} contentKey={contentKey} title="Mijn les" />
    <p>Deze zin staat in de les.</p>
    <details><summary>Meer uitleg</summary><p>Deze uitleg verschijnt pas na openen.</p></details>
    <div data-readaloud-ignore><button onClick={() => setFeedback(true)}>Controleer de oefening</button></div>
    {feedback && <p data-testid="feedback">Je antwoord is bekeken.</p>}
  </main>;
}

function ReplacedScope({ version }: { version: number }) {
  const scopeRef = useRef<HTMLElement>(null);
  return <><LessonReader scopeRef={scopeRef} contentKey="same-page" /><article key={version} ref={scopeRef} data-testid="scope"><p>Dezelfde tekst in een nieuw lespaneel.</p></article></>;
}

function DialogCoveredLesson() {
  const scopeRef = useRef<HTMLElement>(null);
  return <><LessonReader scopeRef={scopeRef} contentKey="dialog-background" /><div data-testid="dialog-background"><div><article ref={scopeRef}><p>Deze les is beschikbaar na het sluiten van de uitleg.</p></article></div></div></>;
}

function AnimatedEntryLesson({ animations }: { animations: () => Animation[] }) {
  const scopeRef = useRef<HTMLElement>(null);
  return <main ref={(element) => { scopeRef.current = element; if (element) element.getAnimations = animations; }}>
    <LessonReader scopeRef={scopeRef} contentKey="animated-entry" />
    <p>Deze inleiding is direct zichtbaar.</p>
    <p data-testid="entry-rule">Deze regel verschijnt na de animatie.</p>
    <span data-testid="infinite-pulse" />
    <section hidden><p>Dit model is nog verborgen.</p></section>
  </main>;
}

function pendingAnimation(target: () => Element | null, endTime = 300) {
  let state: AnimationPlayState = 'running';
  let resolve: (animation: Animation) => void = () => {};
  let reject: () => void = () => {};
  const animation = {
    get playState() { return state; },
    effect: { get target() { return target(); }, getComputedTiming: () => ({ endTime }) },
    finished: new Promise<Animation>((done, failed) => { resolve = done; reject = () => failed(new Error('Animation cancelled')); }),
  } as unknown as Animation;
  return {
    animation,
    finish: () => { state = 'finished'; resolve(animation); },
    cancel: () => { state = 'idle'; reject(); },
  };
}

describe('zichtbare lestekst verzamelen en bijwerken', () => {
  it('wacht op eindige intreeanimaties, behoudt geopende instellingen en start daarna met alle zichtbare tekst', async () => {
    const { engine, spoken } = stubSpeech();
    let ruleVisible = false;
    const computedStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudo) => {
      const style = computedStyle(element, pseudo);
      if (element.getAttribute('data-testid') === 'entry-rule') Object.defineProperty(style, 'opacity', { value: ruleVisible ? '1' : '0', configurable: true });
      return style;
    });
    const entry = pendingAnimation(() => document.querySelector('[data-testid="entry-rule"]'));
    const pulse = pendingAnimation(() => document.querySelector('[data-testid="infinite-pulse"]'), Infinity);
    const readerEffect = pendingAnimation(() => document.querySelector('[data-readaloud-ignore]'));
    render(<AnimatedEntryLesson animations={() => [entry.animation, pulse.animation, readerEffect.animation]} />);
    expect(screen.getByRole('button', { name: 'Luisteren' })).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent('De uitleg wordt klaargezet. Je kunt zo luisteren.');
    openReading();
    openSettings();
    fireEvent.click(screen.getByRole('button', { name: '2,0×' }));
    expect(screen.getByLabelText('Tekst om mee te lezen')).not.toHaveTextContent('Deze regel verschijnt na de animatie.');
    fireEvent.click(screen.getByRole('button', { name: 'Luisteren' }));
    expect(spoken).toHaveLength(0);
    await act(async () => { ruleVisible = true; entry.finish(); });
    expect(screen.getByRole('button', { name: 'Luisteren' })).toBeEnabled();
    expect(screen.getByRole('slider', { name: 'Spreektempo' })).toBeVisible();
    expect(screen.getByRole('slider', { name: 'Spreektempo' })).toHaveValue('2');
    expect(screen.getByLabelText('Tekst om mee te lezen')).toHaveTextContent('Deze regel verschijnt na de animatie.');
    expect(screen.getByLabelText('Tekst om mee te lezen')).not.toHaveTextContent('Dit model is nog verborgen.');
    fireEvent.click(screen.getByRole('button', { name: 'Luisteren' }));
    act(() => spoken[0]!.onstart?.());
    const before = engine.cancel.mock.calls.length;
    fireEvent.animationEnd(screen.getByTestId('entry-rule'));
    expect(engine.cancel).toHaveBeenCalledTimes(before);
    act(() => { spoken[0]!.onend?.(); spoken[1]!.onstart?.(); });
    expect(spoken.map((utterance) => utterance.text)).toEqual(['Deze inleiding is direct zichtbaar.', 'Deze regel verschijnt na de animatie.']);
    expect(screen.getByRole('button', { name: 'Pauzeren' })).toBeVisible();
  });

  it('blijft niet wachten wanneer de browser een eindige animatie afbreekt', async () => {
    stubSpeech();
    const entry = pendingAnimation(() => document.querySelector('[data-testid="entry-rule"]'));
    render(<AnimatedEntryLesson animations={() => [entry.animation]} />);
    expect(screen.getByRole('button', { name: 'Luisteren' })).toBeDisabled();
    await act(async () => { entry.cancel(); });
    expect(screen.getByRole('button', { name: 'Luisteren' })).toBeEnabled();
    expect(screen.getByRole('status')).not.toHaveTextContent('De uitleg wordt klaargezet.');
  });

  it.each(['animationEnd', 'transitionEnd'] as const)('neemt feedback na %s mee zonder wijziging van DOM-attributen', async (event) => {
    const { engine, spoken } = stubSpeech();
    let feedbackVisible = false;
    const computedStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudo) => {
      const style = computedStyle(element, pseudo);
      if (element.getAttribute('data-testid') === 'feedback') Object.defineProperty(style, 'opacity', { value: feedbackVisible ? '1' : '0', configurable: true });
      return style;
    });
    render(<LiveLesson />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Luisteren' })).toBeEnabled());
    openReading();
    fireEvent.click(screen.getByRole('button', { name: 'Luisteren' }));
    act(() => spoken[0]!.onstart?.());
    const before = engine.cancel.mock.calls.length;
    fireEvent.click(screen.getByRole('button', { name: 'Controleer de oefening' }));
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByLabelText('Tekst om mee te lezen')).not.toHaveTextContent('Je antwoord is bekeken.');
    expect(engine.cancel).toHaveBeenCalledTimes(before);
    const feedback = screen.getByTestId('feedback');
    const attributes = feedback.outerHTML;
    feedbackVisible = true;
    fireEvent[event](screen.getByLabelText('Tekst om mee te lezen'));
    expect(screen.getByLabelText('Tekst om mee te lezen')).not.toHaveTextContent('Je antwoord is bekeken.');
    expect(engine.cancel).toHaveBeenCalledTimes(before);
    fireEvent[event](feedback);
    await waitFor(() => expect(screen.getByLabelText('Tekst om mee te lezen')).toHaveTextContent('Je antwoord is bekeken.'));
    expect(feedback.outerHTML).toBe(attributes);
    expect(engine.cancel).toHaveBeenCalledTimes(before + 1);
    expect(spoken).toHaveLength(1);
    expect(screen.getByLabelText('Tekst om mee te lezen')).not.toHaveTextContent('Deze uitleg verschijnt pas na openen.');
  });

  it.each(['aria-hidden', 'inert', 'hidden'])('stopt bij %s buiten de scope en herstelt de tekst wanneer de dialoog sluit', async (attribute) => {
    const { engine, spoken } = stubSpeech();
    render(<DialogCoveredLesson />);
    const background = screen.getByTestId('dialog-background');
    const text = 'Deze les is beschikbaar na het sluiten van de uitleg.';
    await waitFor(() => expect(screen.getByRole('button', { name: 'Luisteren' })).toBeEnabled());
    openReading();
    expect(screen.getByLabelText('Tekst om mee te lezen')).toHaveTextContent(text);
    fireEvent.click(screen.getByRole('button', { name: 'Luisteren' }));
    act(() => spoken[0]!.onstart?.());
    const before = engine.cancel.mock.calls.length;
    await act(async () => { background.setAttribute(attribute, 'true'); });
    await waitFor(() => expect(engine.cancel).toHaveBeenCalledTimes(before + 1));
    expect(screen.getByRole('button', { name: 'Luisteren' })).toBeDisabled();
    expect(screen.getByLabelText('Tekst om mee te lezen')).not.toHaveTextContent(text);
    expect(background.querySelector('[data-reading-active]')).toBeNull();
    await act(async () => { background.removeAttribute(attribute); });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Luisteren' })).toBeEnabled());
    expect(screen.getByLabelText('Tekst om mee te lezen')).toHaveTextContent(text);
    expect(engine.cancel).toHaveBeenCalledTimes(before + 1);
    expect(spoken).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Luisteren' }));
    expect(spoken.at(-1)!.text).toBe(text);
  });

  it('ruimt de oude scope en spraak op wanneer dezelfde ref naar een nieuw paneel wijst', async () => {
    const { engine, spoken } = stubSpeech();
    const view = render(<ReplacedScope version={1} />);
    const originalScope = screen.getByTestId('scope');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Luisteren' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Luisteren' }));
    act(() => spoken[0]!.onstart?.());
    const before = engine.cancel.mock.calls.length;
    view.rerender(<ReplacedScope version={2} />);
    await waitFor(() => expect(engine.cancel).toHaveBeenCalledTimes(before + 1));
    expect(spoken).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Luisteren' }));
    const restarted = engine.cancel.mock.calls.length;
    await act(async () => { originalScope.append(document.createTextNode('Deze verwijderde tekst hoort er niet meer bij.')); });
    expect(engine.cancel).toHaveBeenCalledTimes(restarted);
    openReading();
    expect(screen.getByLabelText('Tekst om mee te lezen')).not.toHaveTextContent('Deze verwijderde tekst');
  });

  it('negeert eigen leesmodus en markeringen, en stopt bij werkelijk nieuw zichtbare uitleg', async () => {
    const { engine, spoken } = stubSpeech();
    render(<LiveLesson />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Luisteren' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Luisteren' }));
    expect(spoken[0]!.text).toBe('Deze zin staat in de les.');
    act(() => spoken[0]!.onstart?.());
    const before = engine.cancel.mock.calls.length;
    openReading();
    act(() => spoken[0]!.onboundary?.({ charIndex: 5, charLength: 3, name: 'word' }));
    await act(async () => { await Promise.resolve(); });
    expect(engine.cancel).toHaveBeenCalledTimes(before);
    expect(spoken).toHaveLength(1);
    const copied = screen.getByLabelText('Tekst om mee te lezen');
    expect(copied).not.toHaveTextContent('Deze uitleg verschijnt pas na openen.');
    expect(copied).not.toHaveTextContent('Stem en tempo');
    fireEvent.click(screen.getByText('Meer uitleg', { selector: 'summary' }));
    await waitFor(() => expect(engine.cancel).toHaveBeenCalledTimes(before + 1));
    expect(spoken).toHaveLength(1);
    expect(within(screen.getByLabelText('Tekst om mee te lezen')).getByText('Deze uitleg verschijnt pas na openen.')).toBeVisible();
    expect(screen.getByText('Leesmodus · grotere tekst en meelezen', { selector: 'summary' }).parentElement).toHaveAttribute('open');
  });

  it('neemt nieuwe feedback mee en stopt de eigen spraak bij een nieuwe pagina', async () => {
    const { engine, spoken } = stubSpeech();
    const view = render(<LiveLesson />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Luisteren' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Luisteren' }));
    const before = engine.cancel.mock.calls.length;
    fireEvent.click(screen.getByRole('button', { name: 'Controleer de oefening' }));
    await waitFor(() => expect(engine.cancel).toHaveBeenCalledTimes(before + 1));
    openReading();
    expect(within(screen.getByLabelText('Tekst om mee te lezen')).getByText('Je antwoord is bekeken.')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Luisteren' }));
    const next = engine.cancel.mock.calls.length;
    view.rerender(<LiveLesson contentKey="next" />);
    expect(engine.cancel).toHaveBeenCalledTimes(next + 1);
    expect(spoken).toHaveLength(2);
  });
});
