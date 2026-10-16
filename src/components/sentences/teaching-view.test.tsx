import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { SentenceTeaching } from '@/content/sentences/teaching-types';
import { SentenceApplication, TeachingView } from './teaching-view';

const teaching: SentenceTeaching = {
  lessonId: 'zinnen-01',
  introduction: ['Een zinsdeel kan uit meer dan één woord bestaan.', 'Zoek de woorden die samen iets benoemen.'],
  concepts: [{ term: 'Woordgroep', meaning: 'Woorden die bij elkaar horen.', example: 'de jonge leerling' }],
  walkthrough: {
    title: 'Een groep herkennen', situation: 'Je wilt vertellen wie een boek leest.', startSentence: 'De jonge leerling leest een boek.',
    steps: [
      { title: 'Lees de zin', sentence: 'De jonge leerling leest een boek.', focus: ['De jonge leerling'], explanation: 'Deze woorden noemen samen één persoon.' },
      { title: 'Zoek de kern', sentence: 'De jonge leerling leest een boek.', focus: ['leerling'], explanation: 'Leerling is de kern; jonge beschrijft die leerling.' },
      { title: 'Vervang de groep', sentence: 'Zij leest een boek.', focus: ['Zij'], explanation: 'Zij verwijst naar de hele groep.' },
      { title: 'Controleer', sentence: 'De jonge leerling leest een boek.', focus: ['De jonge leerling', 'leest'], explanation: 'Kijk opnieuw of de woorden samen de lezer noemen.' },
    ],
    result: 'Je herkent de groep door betekenis en vervanging samen te gebruiken.',
  },
  pitfalls: [{ mistake: 'Alleen het langste woord kiezen.', correction: 'Onderzoek welke woorden samen iets benoemen.' }],
  quickCheck: {
    question: 'Welke woorden noemen de lezer?', answer: 'group',
    options: [
      { id: 'verb', text: 'leest', feedback: 'Leest vertelt wat er gebeurt; het noemt niet wie leest.' },
      { id: 'group', text: 'De jonge leerling', feedback: 'Deze hele groep noemt de persoon die leest.' },
    ],
  },
  application: {
    prompt: 'Schrijf over iemand die iets leest. Benoem de hele groep.', starter: 'De leerling bij het raam…',
    model: 'De leerling bij het raam leest een krant.', reasoning: 'De leerling bij het raam noemt samen één lezer.',
    checklist: ['Ik kan de hele groep aanwijzen.', 'Mijn zin vertelt wie wat doet.'],
  },
};

function Harness({ initial = '' }: { initial?: string }) {
  const [text, setText] = useState(initial);
  return <TeachingView teaching={teaching} text={text} onChange={setText} />;
}

describe('begrijpelijke zinsuitleg', () => {
  it('verdeelt de uitleg in toegankelijke onderdelen en laat begrippen openen', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(screen.getByText(teaching.introduction[0]!)).toBeVisible();
    expect(screen.getByText(teaching.concepts[0]!.meaning)).not.toBeVisible();
    await user.click(screen.getByText('Woordgroep', { selector: 'summary' }));
    expect(screen.getByText(teaching.concepts[0]!.meaning)).toBeVisible();
    expect(screen.getByText('de jonge leerling')).toBeVisible();

    const first = screen.getByRole('tab', { name: 'Zo werkt het' });
    first.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Samen bekijken' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Samen bekijken' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.queryByText(teaching.introduction[0]!)).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Een groep herkennen' })).toBeVisible();
  });

  it('verandert de voorbeeldzin, markering en uitleg met iedere gekozen stap', async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    await user.click(screen.getByRole('tab', { name: 'Samen bekijken' }));
    expect(container.querySelector('mark')).toHaveTextContent('De jonge leerling');
    expect(screen.getByRole('button', { name: 'Vorige stap' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Stap 2: Zoek de kern' }));
    expect(container.querySelector('mark')).toHaveTextContent(/^leerling$/);
    expect(screen.getByText(teaching.walkthrough.steps[1]!.explanation, { selector: 'div > p' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Volgende stap' }));
    expect(container.querySelector('mark')).toHaveTextContent('Zij');
    expect(screen.getByRole('button', { name: 'Stap 3: Vervang de groep' })).toHaveAttribute('aria-current', 'step');
    await user.click(screen.getByRole('button', { name: 'Volgende stap' }));
    expect(screen.getByRole('button', { name: 'Volgende stap' })).toBeDisabled();
    expect(container.querySelectorAll('mark')).toHaveLength(2);
    expect(screen.getByText(teaching.walkthrough.result, { exact: false, selector: 'section > p' })).toBeVisible();
  });

  it('biedt een stille video met bediening, Nederlandse ondertiteling en volledige tekst', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('tab', { name: 'Samen bekijken' }));
    await user.click(screen.getByText('Bekijk dit voorbeeld als uitlegvideo', { selector: 'summary' }));
    const video = screen.getByLabelText('Uitlegvideo: Een groep herkennen');
    expect(video).toHaveAttribute('controls');
    expect(video).toHaveAttribute('preload', 'none');
    expect(video).not.toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('poster', '/videos/zinnen/zinnen-01.jpg');
    expect(video.querySelector('source')).toHaveAttribute('src', '/videos/zinnen/zinnen-01.mp4');
    const track = video.querySelector('track');
    expect(track).toHaveAttribute('src', '/videos/zinnen/zinnen-01.vtt');
    expect(track).toHaveAttribute('kind', 'subtitles');
    expect(track).toHaveAttribute('srclang', 'nl');
    expect(track).toHaveAttribute('default');
    expect(screen.getByText(/Er is geen gesproken uitleg/)).toBeVisible();
    const transcriptToggle = screen.getByText('Lees de volledige videotekst', { selector: 'summary' });
    await user.click(transcriptToggle);
    const transcript = within(transcriptToggle.closest('details')!);
    teaching.walkthrough.steps.forEach((step) => expect(transcript.getByText(step.explanation)).toBeVisible());
    expect(transcript.getByText(teaching.walkthrough.result)).toBeVisible();
  });

  it('geeft pas uitleg na bevestigen en laat een fout zonder score opnieuw proberen', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TeachingView teaching={teaching} text="" onChange={onChange} />);
    await user.click(screen.getByRole('tab', { name: 'Zelf proberen' }));
    const commit = screen.getByRole('button', { name: 'Bekijk de uitleg bij mijn antwoord' });
    expect(commit).toBeDisabled();
    await user.click(screen.getByRole('radio', { name: 'leest' }));
    expect(screen.queryByText(teaching.quickCheck.options[0]!.feedback)).not.toBeInTheDocument();
    await user.click(commit);
    expect(screen.getByRole('status')).toHaveTextContent(teaching.quickCheck.options[0]!.feedback);
    expect(screen.getByRole('radio', { name: 'De jonge leerling' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Probeer de vraag opnieuw' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekijk de uitleg bij mijn antwoord' })).toBeDisabled();
    await user.click(screen.getByRole('radio', { name: 'De jonge leerling' }));
    await user.click(screen.getByRole('button', { name: 'Bekijk de uitleg bij mijn antwoord' }));
    expect(screen.getByRole('status')).toHaveTextContent(teaching.quickCheck.options[1]!.feedback);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByText(/100%|beheerst/i)).not.toBeInTheDocument();
  });

  it('laat eerst zelf schrijven, onthult dan het model en wist zelfvinkjes na aanpassen', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('tab', { name: 'Zelf proberen' }));
    const input = screen.getByRole('textbox', { name: 'Schrijf je eigen zin en verklaring' });
    const reveal = screen.getByRole('button', { name: 'Vergelijk met een voorbeeld' });
    expect(reveal).toBeDisabled();
    expect(screen.queryByText(teaching.application.model)).not.toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'leerling' } });
    expect(reveal).toBeDisabled();
    fireEvent.change(input, { target: { value: 'Mijn zus leest een boek.' } });
    await user.click(reveal);
    expect(screen.getByText(teaching.application.model)).toBeVisible();
    expect(screen.getByText(teaching.application.reasoning)).toBeVisible();
    const check = screen.getByRole('checkbox', { name: teaching.application.checklist[0] });
    await user.click(check);
    expect(check).toBeChecked();
    fireEvent.change(input, { target: { value: 'Mijn oudste zus leest een boek.' } });
    expect(check).not.toBeChecked();
    expect(screen.getByRole('status')).toHaveTextContent('Controleer de punten opnieuw');
  });

  it('gebruikt een opgeslagen tekst zonder een eerdere zelfbeoordeling te verzinnen', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SentenceApplication teaching={teaching} text="Mijn zus leest een boek." onChange={onChange} />);
    expect(screen.getByRole('textbox')).toHaveValue('Mijn zus leest een boek.');
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Vergelijk met een voorbeeld' }));
    screen.getAllByRole('checkbox').forEach((checkbox) => expect(checkbox).not.toBeChecked());
    expect(onChange).not.toHaveBeenCalled();
  });
});
