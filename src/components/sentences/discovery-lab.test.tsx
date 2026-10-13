import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCallback, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { foundationLessons } from '@/content/sentences/foundation';
import { sentenceLessons } from '@/content/sentences';
import type { SentenceLesson } from '@/content/sentences/types';
import { DiscoveryLab } from './discovery-lab';
import { SentenceScene } from './sentence-scene';

const motionPreference = vi.hoisted(() => ({ calm: true }));
vi.mock('@/lib/motion', () => ({ useCalmMotion: () => motionPreference.calm, spring: { layout: { duration: 0 } } }));

function Lab({ lesson, onVisit = () => {} }: { lesson: SentenceLesson; onVisit?: (id: string) => void }) {
  const [visited, setVisited] = useState<string[]>([]);
  const visit = useCallback((id: string) => {
    onVisit(id);
    setVisited((old) => old.includes(id) ? old : [...old, id]);
  }, [onVisit]);
  return <DiscoveryLab lesson={lesson} visited={visited} onVisit={visit} />;
}

describe('het zinnen-ontdek-lab', () => {
  beforeEach(() => { motionPreference.calm = true; });
  afterEach(() => { vi.useRealTimers(); });

  it('verplaatst hele woordgroepen met het toetsenbord en bewaart welke voorbeelden zijn bekeken', async () => {
    const user = userEvent.setup();
    const lesson = foundationLessons[0]!;
    const visit = vi.fn();
    render(<Lab lesson={lesson} onVisit={visit} />);
    expect(visit).toHaveBeenCalledWith('onderwerp-eerst');
    expect(screen.getByText('1 van 2 voorbeelden bekeken')).toBeVisible();
    const other = screen.getByRole('button', { name: /Begin met het hele boekblok/ });
    other.focus();
    await user.keyboard('{Enter}');
    expect(other).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Een dik boek over taal leest de nieuwsgierige leerling.');
    const blocks = within(screen.getByRole('list', { name: 'Zinblokken in leesvolgorde' })).getAllByRole('listitem');
    expect(blocks[0]).toHaveTextContent('Een dik boek over taal');
    expect(blocks[1]).toHaveTextContent('persoonsvorm');
    expect(blocks[2]).toHaveTextContent('de nieuwsgierige leerling');
    expect(screen.getByText('2 van 2 voorbeelden bekeken')).toBeVisible();
    expect(visit).toHaveBeenCalledWith('boek-eerst');
    expect(screen.getByRole('button', { name: 'Afspelen' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Vanaf het begin' }));
    expect(screen.getByRole('status')).toHaveTextContent(lesson.discovery.variants[0]!.sentence);
    expect(screen.getByText('2 van 2 voorbeelden bekeken')).toBeVisible();
  });

  it('verandert in beeld de kern die de congruentie bestuurt', () => {
    render(<Lab lesson={foundationLessons[1]!} />);
    expect(screen.getByText('Eén doos staat')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: /Twee dozen/ }));
    expect(screen.getByText('Twee dozen staan')).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('Twee dozen met twintig boeken staan op tafel.');
    expect(screen.getByRole('img', { name: /Situatie-illustratie/ })).toHaveAccessibleName(expect.stringContaining('De kern verandert van doos naar dozen'));
  });

  it('maakt ieder geschreven contrast in alle twaalf lessen bereikbaar en bewaart de betekenis in de toegankelijke illustratie', () => {
    for (const lesson of sentenceLessons) {
      const visit = vi.fn();
      const view = render(<DiscoveryLab lesson={lesson} visited={[]} onVisit={visit} />);
      const choices = within(screen.getByRole('group', { name: 'Contrasterende voorbeelden' }));
      for (const variant of lesson.discovery.variants) {
        fireEvent.click(choices.getByRole('button', { name: variant.label }));
        expect(screen.getByRole('status')).toHaveTextContent(variant.sentence);
        expect(screen.getByRole('img', { name: /Situatie-illustratie/ })).toHaveAccessibleName(expect.stringContaining(variant.note));
        expect(visit).toHaveBeenCalledWith(variant.id);
      }
      view.unmount();
    }
  });

  it('speelt uitsluitend op verzoek af en stopt bij pauzeren of verlaten', () => {
    vi.useFakeTimers();
    motionPreference.calm = false;
    const visit = vi.fn();
    const view = render(<Lab lesson={foundationLessons[0]!} onVisit={visit} />);
    act(() => { vi.advanceTimersByTime(6400); });
    expect(screen.getByRole('status')).toHaveTextContent(foundationLessons[0]!.discovery.variants[0]!.sentence);
    fireEvent.click(screen.getByRole('button', { name: 'Afspelen' }));
    act(() => { vi.advanceTimersByTime(3200); });
    expect(screen.getByRole('status')).toHaveTextContent(foundationLessons[0]!.discovery.variants[1]!.sentence);
    fireEvent.click(screen.getByRole('button', { name: 'Pauzeren' }));
    act(() => { vi.advanceTimersByTime(6400); });
    expect(screen.getByRole('status')).toHaveTextContent(foundationLessons[0]!.discovery.variants[1]!.sentence);
    fireEvent.click(screen.getByRole('button', { name: 'Afspelen' }));
    const calls = visit.mock.calls.length;
    view.unmount();
    act(() => { vi.advanceTimersByTime(6400); });
    expect(visit).toHaveBeenCalledTimes(calls);
  });

  it('stopt de bewegende reeks zodra rustige weergave wordt ingeschakeld', () => {
    vi.useFakeTimers();
    motionPreference.calm = false;
    const view = render(<Lab lesson={foundationLessons[0]!} />);
    fireEvent.click(screen.getByRole('button', { name: 'Afspelen' }));
    motionPreference.calm = true;
    view.rerender(<Lab lesson={foundationLessons[0]!} />);
    act(() => { vi.advanceTimersByTime(6400); });
    expect(screen.getByRole('status')).toHaveTextContent(foundationLessons[0]!.discovery.variants[0]!.sentence);
    expect(screen.getByRole('button', { name: 'Afspelen' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Volgend voorbeeld' }));
    expect(screen.getByRole('status')).toHaveTextContent(foundationLessons[0]!.discovery.variants[1]!.sentence);
    motionPreference.calm = false;
    view.rerender(<Lab lesson={foundationLessons[0]!} />);
    act(() => { vi.advanceTimersByTime(6400); });
    expect(screen.getByRole('button', { name: 'Afspelen' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('status')).toHaveTextContent(foundationLessons[0]!.discovery.variants[1]!.sentence);
  });
});

describe('betekenis in de situatie-illustraties', () => {
  it('onderscheidt een subgroep van alle studenten en maakt de illustratie toegankelijk', () => {
    const view = render(<SentenceScene scene="students" variantId="beperkend" caption="Alleen de studenten die te laat waren blijven buiten." />);
    expect(screen.getByText('3 van de 10 kwamen later; alleen zij krijgen een bericht')).toBeVisible();
    expect(screen.getByRole('img', { name: /Alleen de studenten/ })).toBeVisible();
    view.rerender(<SentenceScene scene="students" variantId="uitbreidend" caption="De hele groep is te laat." />);
    expect(screen.getByText('Alle 10 leerlingen kwamen later en krijgen een bericht')).toBeVisible();
    expect(screen.queryByText(/3 van de 10/)).not.toBeInTheDocument();
    expect(screen.getByText('Schematische situatie')).toBeVisible();
    view.rerender(<SentenceScene scene="students" variantId="verklaring" caption="De dubbele punt kondigt een verklaring aan." />);
    expect(screen.getByText('Iedere leerling krijgt een bericht met een verklaring')).toBeVisible();
    expect(screen.queryByText(/kwamen later/)).not.toBeInTheDocument();
  });

  it('laat letterlijk boven op de bus een andere situatie zijn dan wachten op de bus', () => {
    const view = render(<SentenceScene scene="bus" variantId="verwachten" />);
    expect(screen.getByText('Bij de halte: wachten op de bus')).toBeVisible();
    view.rerender(<SentenceScene scene="bus" variantId="locatie" />);
    expect(screen.getByText('Letterlijke plaats: op de bus')).toBeVisible();
    expect(screen.queryByText('Bij de halte: wachten op de bus')).not.toBeInTheDocument();
  });

  it('maakt bij een zwevende bijzin de onmogelijke uitvoerder zichtbaar en herstelt die daarna', () => {
    const view = render(<SentenceScene scene="bicycle" variantId="faulty" />);
    expect(screen.getByText('De ketting als fietser?')).toBeVisible();
    view.rerender(<SentenceScene scene="bicycle" variantId="repaired" />);
    expect(screen.queryByText('De ketting als fietser?')).not.toBeInTheDocument();
    expect(screen.getByText('De persoon fietst')).toBeVisible();
  });

  it('laat bij actief en passief dezelfde reparatie zien en maakt bij kwantitatief er de drie bedoelde fietsen zichtbaar', () => {
    const view = render(<SentenceScene scene="workshop" variantId="actief" />);
    expect(screen.getByText('De monteur')).toBeVisible();
    expect(screen.getByText('De fiets')).toBeVisible();
    expect(screen.getByText('Dezelfde reparatie')).toBeVisible();
    view.rerender(<SentenceScene scene="workshop" variantId="passief" />);
    expect(screen.getByText('Dezelfde reparatie')).toBeVisible();
    view.rerender(<SentenceScene scene="workshop" variantId="er-kwantitatief" />);
    expect(screen.getByText('Drie gerepareerde fietsen: er + drie')).toBeVisible();
  });

  it('geeft alle acht scènefamilies een leesbare betekenis en zichtbare toelichting', () => {
    for (const scene of ['classroom', 'office', 'bus', 'bicycle', 'students', 'library', 'station', 'workshop'] as const) {
      const view = render(<SentenceScene scene={scene} caption={`Dit is het betekenisvoorbeeld voor ${scene}.`} />);
      expect(screen.getByRole('img', { name: new RegExp(`betekenisvoorbeeld voor ${scene}`) })).toBeVisible();
      expect(screen.getByText(`Dit is het betekenisvoorbeeld voor ${scene}.`)).toBeVisible();
      view.unmount();
    }
  });
});
