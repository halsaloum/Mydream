import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { argumentLessons } from '@/content/argumentation';
import { lessonCoreChecks } from '@/content/argumentation/core-checks';
import { ARGUMENTS_KEY, useArgumentation } from '@/state/argumentation';
import { CoreCheckView } from './core-check';

const lesson = argumentLessons[0]!;
const check = lessonCoreChecks[lesson.id]!;
const key = `core-${lesson.id}`;
function StoredCheck() {
  const session = useArgumentation((state) => state.sessions[lesson.id]);
  return session ? <CoreCheckView lessonId={lesson.id} check={check} session={session} /> : null;
}

beforeEach(() => {
  useArgumentation.getState().reset();
  useArgumentation.getState().start(lesson);
});

describe('guided core-check interaction', () => {
  it('shows selected feedback beside the choice and lets the learner revise it', () => {
    render(<StoredCheck />);
    const wrong = check.options.find((option) => option.id !== check.answer)!;
    const correct = check.options.find((option) => option.id === check.answer)!;
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('radio', { name: wrong.text }));
    expect(screen.getByRole('status')).toHaveTextContent(wrong.feedback);
    expect(screen.getByRole('status')).toHaveTextContent('Bekijk de verbinding nog eens.');
    expect(screen.getByRole('radio', { name: wrong.text })).toBeChecked();
    fireEvent.click(screen.getByRole('radio', { name: correct.text }));
    expect(screen.getByRole('status')).toHaveTextContent(correct.feedback);
    expect(screen.getByRole('status')).toHaveTextContent('Deze stap klopt voor dit geval.');
    expect(screen.queryByText(wrong.feedback)).not.toBeInTheDocument();
  });

  it('stores each revision without changing first-try scores or confidence', () => {
    const original = useArgumentation.getState().sessions[lesson.id]!;
    useArgumentation.setState({ sessions: { [lesson.id]: { ...original, firstTry: { earlier: 1 }, firstConfidence: { earlier: 2 } } } });
    render(<StoredCheck />);
    for (const option of check.options) fireEvent.click(screen.getByRole('radio', { name: option.text }));
    const current = useArgumentation.getState().sessions[lesson.id]!;
    expect(current.firstTry).toEqual({ earlier: 1 });
    expect(current.firstConfidence).toEqual({ earlier: 2 });
    const final = check.options.at(-1)!;
    expect(current.answers[key]).toMatchObject({ value: final.id, checked: true, score: final.id === check.answer ? 1 : 0 });
    const stored = JSON.parse(window.localStorage.getItem(ARGUMENTS_KEY)!);
    expect(stored.state.sessions[lesson.id].answers[key].value).toBe(final.id);
  });

  it('supports keyboard changes through the native radio group', async () => {
    const user = userEvent.setup();
    render(<StoredCheck />);
    screen.getByRole('radio', { name: check.options[0]!.text }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: check.options[1]!.text })).toBeChecked();
    expect(useArgumentation.getState().sessions[lesson.id]?.answers[key]?.value).toBe(check.options[1]!.id);
  });

  it('preserves the completed session as read-only', () => {
    const correct = check.options.find((option) => option.id === check.answer)!;
    useArgumentation.getState().answer(lesson.id, key, { value: correct.id, checked: true, score: 1 });
    const current = useArgumentation.getState().sessions[lesson.id]!;
    useArgumentation.setState({ sessions: { [lesson.id]: { ...current, finished: true } } });
    render(<StoredCheck />);
    expect(screen.getByRole('radio', { name: correct.text })).toBeChecked();
    expect(screen.getAllByRole('radio').every((control) => control.hasAttribute('disabled'))).toBe(true);
    fireEvent.click(screen.getByRole('radio', { name: check.options.find((option) => option.id !== check.answer)!.text }));
    expect(useArgumentation.getState().sessions[lesson.id]?.answers[key]?.value).toBe(correct.id);
  });
});
