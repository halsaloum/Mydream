import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { ArgumentLesson } from '@/content/argumentation/types';
import { emptyArgumentAnswer } from '@/lib/argumentation/learning';
import { choice, map, reflection, testArgumentLesson } from '@/lib/argumentation/test-fixtures';
import { ArgumentExerciseView } from './exercise-view';
import { ArgumentCheckpointReview, checkpointReviewReady } from './checkpoint-review';

describe('zelfstandige checkpointantwoorden en modelvergelijking', () => {
  it('verbergt juiste keuzes en plaatsingsfeedback tijdens een toetsronde', () => {
    const onChange = vi.fn();
    const choiceView = render(<ArgumentExerciseView exercise={choice} answer={{ ...emptyArgumentAnswer(), value: 'a', checked: true, score: 0 }} onChange={onChange} showFeedback={false} />);
    expect(screen.queryByLabelText('Juist antwoord')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Onjuist antwoord')).not.toBeInTheDocument();
    expect(screen.getAllByRole('radio').every((input) => input.hasAttribute('disabled'))).toBe(true);
    choiceView.unmount();
    render(<ArgumentExerciseView exercise={map} answer={{ ...emptyArgumentAnswer(), placements: { '1': 'conclusion', '2': 'premise' }, checked: true, score: 0 }} onChange={onChange} showFeedback={false} />);
    expect(screen.queryByText(/Hoort bij:/)).not.toBeInTheDocument();
    expect(screen.queryByText('Goed geplaatst.')).not.toBeInTheDocument();
  });

  it('toont het schrijfmodel en rubric pas in de latere zelfcontrole', async () => {
    const answer = { ...emptyArgumentAnswer(), value: 'Mijn zelfstandige eerste tekst', reasoning: 'Mijn zelfstandige eerste tekst', checked: true, score: null };
    const round = render(<ArgumentExerciseView exercise={reflection} answer={answer} onChange={vi.fn()} showFeedback={false} />);
    expect(screen.queryByText(reflection.model)).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    round.unmount();
    const onChange = vi.fn();
    const lesson: ArgumentLesson = { ...testArgumentLesson, checkpoint: true, exercises: [reflection] };
    render(<ArgumentCheckpointReview lesson={lesson} answers={{ reflection: answer }} onChange={onChange} />);
    expect(screen.getByText(reflection.model)).toBeVisible();
    expect(screen.getByText('Jouw eerste zelfstandige versie')).toBeVisible();
    await userEvent.type(screen.getByRole('textbox'), ' met een verbetering');
    expect(onChange).toHaveBeenCalledWith('reflection', expect.objectContaining({ rubric: {} }));
  });

  it('vereist hernieuwde inhoudelijke zelfcontrole én voldoende tekst na herziening', () => {
    const lesson = { ...testArgumentLesson, checkpoint: true, exercises: [choice, reflection] };
    const answers = {
      choice: { ...emptyArgumentAnswer(), value: choice.answer, checked: true, score: 1 },
      reflection: { ...emptyArgumentAnswer(), value: 'voldoende woorden hier', checked: true, rubric: { '0': true } },
    };
    expect(checkpointReviewReady(lesson, answers)).toBe(true);
    expect(checkpointReviewReady(lesson, { ...answers, reflection: { ...answers.reflection, value: 'kort' } })).toBe(false);
    expect(checkpointReviewReady(lesson, { ...answers, reflection: { ...answers.reflection, rubric: {} } })).toBe(false);
  });
});
