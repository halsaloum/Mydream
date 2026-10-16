import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ChoiceQuestion, LessonSection } from '@/content/ontleed/types';
import type { LabDraft } from '@/state/ontleed';
import { QuestionView } from './question';
import { LabView } from './lab';
import { Theory } from './player';
import type { SectionCoach } from '@/lib/ontleed/lesson-coach';
import type { TheoryProgress } from '@/state/ontleed';

const question: ChoiceQuestion = {
  id: 'test-proef', kind: 'choice', concept: 'congruentie',
  prompt: 'Welke vorm past bij de studenten?', sentence: 'De studenten … de tekst.',
  options: ['leest', 'lezen'], answer: 1,
  hint: 'Vervang de studenten door één student en vergelijk de persoonsvorm.',
  explanation: 'Het meervoudige onderwerp vraagt de vorm lezen.',
  feedback: ['Je koos een enkelvoudige vorm.', 'De persoonsvorm volgt het meervoud.'],
};
const section: LessonSection = {
  title: 'Vorm en onderwerp vergelijken', paragraphs: ['De vorm van de persoonsvorm verandert mee met het onderwerp.'],
  examples: [{ sentence: 'De student leest. De studenten lezen.', analysis: 'De wissel naar het meervoud verandert leest in lezen.' }],
  pitfall: 'Kijk naar de kern van het onderwerp.', takeaway: 'Controleer de vorm door het getal te veranderen.',
};

describe('interactie, hint en herstel in Ontleed', () => {
  it('laat een gekozen vorm in de zin zien zonder de keuze al te beoordelen', () => {
    const onAnswer = vi.fn();
    render(<QuestionView question={question} onAnswer={onAnswer}/>);
    expect(screen.getByLabelText('Kies de ontbrekende vorm')).toHaveTextContent('…');
    fireEvent.click(screen.getByRole('radio', { name: /leest/ }));
    expect(screen.getByLabelText('Gekozen vorm: leest')).toHaveTextContent('leest');
    expect(onAnswer).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('radio', { name: /lezen/ }));
    expect(screen.getByLabelText('Gekozen vorm: lezen')).toHaveTextContent('lezen');
    fireEvent.click(screen.getByRole('button', { name: 'Controleer antwoord' }));
    expect(onAnswer).toHaveBeenCalledWith(1, true);
  });

  it('toont na een fout een proef en een echte nieuwe poging, zonder het antwoord meteen te verraden', () => {
    const onAnswer = vi.fn(), onRetry = vi.fn();
    const { rerender } = render(<QuestionView question={question} onAnswer={onAnswer} onRetry={onRetry}/>);
    fireEvent.click(screen.getByRole('radio', { name: /leest/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Controleer antwoord' }));
    expect(onAnswer).toHaveBeenCalledWith(0, false);
    const saved = { answer: 0, correct: false };
    rerender(<QuestionView question={question} saved={saved} onAnswer={onAnswer} onRetry={onRetry}/>);
    expect(screen.getByRole('status')).toHaveTextContent(question.hint);
    expect(screen.queryByText(question.explanation)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Waarom?' }));
    expect(screen.queryByText(question.explanation)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Probeer opnieuw' }));
    fireEvent.click(screen.getByRole('radio', { name: /lezen/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Controleer nieuwe poging' }));
    expect(onRetry).toHaveBeenCalledWith(1);
    expect(onAnswer).toHaveBeenCalledTimes(1);
    rerender(<QuestionView question={question} saved={saved} correction={{ answer: 1, correct: true }} onAnswer={onAnswer} onRetry={onRetry} sources={[{ bookId: 'ans', section: 'Congruentie', note: 'De relatie tussen onderwerp en persoonsvorm.' }]}/>);
    expect(screen.getByRole('status')).toHaveTextContent('Je nieuwe poging klopt.');
    fireEvent.click(screen.getByRole('button', { name: 'Waarom?' }));
    expect(screen.getByText(question.explanation)).toBeVisible();
    expect(screen.getByRole('link', { name: 'Algemene Nederlandse Spraakkunst' })).toHaveAttribute('href', expect.stringContaining('e-ans.ivdnt.org'));
  });

  it('meldt de gebruikte aanwijzing zodat deze poging geen zelfstandig bewijs kan opleveren', () => {
    const onAssistance = vi.fn();
    render(<QuestionView question={question} onAnswer={vi.fn()} onAssistance={onAssistance}/>);
    fireEvent.click(screen.getByRole('button', { name: 'Een aanwijzing' }));
    expect(onAssistance).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: 'Een aanwijzing' }));
    expect(onAssistance).toHaveBeenCalledOnce();
  });

  it('geeft eerst uitleg en laat met feedback oefenen zonder een verplichte notitie', () => {
    const coach: SectionCoach = {
      summary: 'Eén student leest. Meer studenten lezen. Het werkwoord verandert mee.',
      focusPrompt: 'Vergelijk leest en lezen.', steps: ['Lees de zin.', 'Vergelijk de vormen.'],
      check: { ...question, prompt: 'Welke vorm past bij meer studenten?' },
    };
    function Explore() {
      const [progress, setProgress] = useState<TheoryProgress>({ viewed: [0] });
      const [prediction, setPrediction] = useState({ draft: '', revealed: false });
      return <Theory section={section} coach={coach} progress={progress} onProgress={setProgress} prediction={prediction} onPrediction={setPrediction}/>;
    }
    render(<Explore/>);
    expect(screen.getByText(coach.summary)).toBeVisible();
    expect(screen.getByText(section.examples[0]!.analysis)).toBeVisible();
    expect(screen.getByRole('textbox', { hidden: true })).not.toBeVisible();
    fireEvent.click(screen.getByRole('radio', { name: /leest/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Kijk nog eens.');
    fireEvent.click(screen.getByRole('radio', { name: /lezen/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Goed gezien!');
    expect(screen.getByText('Deze stap is klaar. Je kunt verder.')).toBeVisible();
    fireEvent.click(screen.getByText('Eigen notitie (optioneel)'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Meervoud' } });
    expect(screen.getByRole('textbox')).toHaveValue('Meervoud');
    fireEvent.click(screen.getByText('Meer uitleg'));
    expect(screen.getByText(section.paragraphs[0]!)).toBeVisible();
  });

  it('bewaart bekeken voorbeelden en een gekozen antwoord bij het wisselen', () => {
    const onProgress = vi.fn();
    render(<Theory section={{ ...section, examples: [...section.examples, { sentence: 'De leerling schrijft.', analysis: 'Eén leerling: schrijft.' }] }} progress={{ viewed: [0], answer: 1 }} onProgress={onProgress}/>);
    fireEvent.click(screen.getByRole('button', { name: 'Voorbeeld 2' }));
    expect(screen.getByText('Eén leerling: schrijft.')).toBeVisible();
    expect(onProgress).toHaveBeenCalledWith({ viewed: [0, 1], answer: 1 });
  });

  it('houdt de bestaande leesweergave toegankelijk zonder de oefensessie te wijzigen', () => {
    render(<Theory section={section} readOnly/>);
    expect(screen.getByText(section.paragraphs[0]!)).toBeVisible();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('toont inhoudelijke uitlegstappen apart en verbindt begrippen aan hun bron', () => {
    const onProgress = vi.fn();
    const teaching: NonNullable<LessonSection['teaching']> = {
      core: 'De vorm van het werkwoord past zich aan het onderwerp aan.',
      steps: [
        { title: 'Verander het onderwerp', text: 'Maak van één student meerdere studenten.' },
        { title: 'Vergelijk het werkwoord', text: 'Bij de student past leest, bij de studenten lezen.' },
      ],
      terms: [{ term: 'Congruentie', meaning: 'Grammaticale vormen die op elkaar afgestemd zijn.' }],
      memory: 'Test het getal van het onderwerp en vergelijk de persoonsvorm.',
      sources: [{ bookId: 'tallerman', section: 'Hoofdstuk 4: grammaticale relaties', note: 'De Nederlandse voorbeelden zijn eigen toepassingen.' }],
    };
    render(<Theory section={{ ...section, teaching }} onProgress={onProgress}/>);
    expect(screen.getByText(teaching.core)).toBeVisible();
    expect(screen.getByText(teaching.steps[0]!.text)).toBeVisible();
    expect(screen.queryByText(teaching.steps[1]!.text)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Vergelijk het werkwoord' }));
    expect(screen.getByRole('button', { name: 'Vergelijk het werkwoord' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(teaching.steps[1]!.text)).toBeVisible();
    expect(screen.queryByText(teaching.steps[0]!.text)).not.toBeInTheDocument();
    expect(onProgress).not.toHaveBeenCalled();
    expect(screen.getByText(teaching.memory)).toBeVisible();
    expect(screen.getByText(teaching.terms![0]!.meaning)).not.toBeVisible();
    fireEvent.click(screen.getByText('Woordenhulp'));
    expect(screen.getByText(teaching.terms![0]!.meaning)).toBeVisible();
    fireEvent.click(screen.getByText('Bronnen bij deze uitleg'));
    expect(screen.getByRole('link', { name: 'Understanding Syntax' })).toHaveAttribute('href', '/bronnen#bron-tallerman');
    expect(screen.getByText(teaching.sources[0]!.section)).toBeVisible();
  });

  it('toont in de leesweergave alle inhoudelijke stappen zonder extra knoppen', () => {
    const teaching: NonNullable<LessonSection['teaching']> = {
      core: 'Het werkwoord verandert mee.',
      steps: [{ title: 'Vergelijk de vormen', text: 'Lees en lezen zijn verschillende vormen.' }, { title: 'Test het getal', text: 'Vergelijk ik lees met wij lezen.' }],
      memory: 'Test de vorm met een ander onderwerp.', sources: [],
    };
    render(<Theory section={{ ...section, teaching }} readOnly/>);
    teaching.steps.forEach(step => expect(screen.getByText(step.text)).toBeVisible());
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('rondt een gemarkeerd experiment pas af na een juiste poging en bewaart de eerste fout', () => {
    const onDone = vi.fn();
    let latest: LabDraft = {};
    function Experiment() {
      const [draft, setDraft] = useState<LabDraft>({});
      return <LabView lab={{ id: 'lab-mark', kind: 'mark', concept: 'persoonsvorm', prompt: 'Markeer de persoonsvorm.', tokens: ['loopt', 'student'], targets: [0], hint: 'Verander de tijd en kijk welk woord verandert.', explanation: 'Loopt wordt liep.', takeaway: 'De persoonsvorm verandert in de tijdproef.' }} state={draft} onChange={value => { latest = value; setDraft(value); }} onDone={onDone}/>;
    }
    render(<Experiment/>);
    fireEvent.click(screen.getByRole('button', { name: 'student' }));
    fireEvent.click(screen.getByRole('button', { name: 'Controleer antwoord' }));
    expect(onDone).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Probeer opnieuw' }));
    fireEvent.click(screen.getByRole('button', { name: 'loopt' }));
    fireEvent.click(screen.getByRole('button', { name: 'Controleer nieuwe poging' }));
    expect(onDone).toHaveBeenCalledOnce();
    expect(latest).toMatchObject({ answer: [1], correct: false, retryAnswer: [0], retryCorrect: true });
  });
});
