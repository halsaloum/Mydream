import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { argumentLessons } from '@/content/argumentation';
import { argumentFoundations, type FoundationConcept } from '@/content/argumentation/foundations';
import { ARGUMENTS_KEY, useArgumentation } from '@/state/argumentation';
import { FoundationView } from './foundation-view';

const lesson = argumentLessons[0]!;
const concept = argumentFoundations[0]!;
const key = `foundation-${concept.id}`;
function StoredFoundation({ active = concept }: { active?: FoundationConcept }) {
  const session = useArgumentation((state) => state.sessions[lesson.id]);
  return session ? <FoundationView lessonId={lesson.id} concept={active} session={session} /> : null;
}

beforeEach(() => {
  useArgumentation.getState().reset();
  useArgumentation.getState().start(lesson);
});

describe('foundational concept pages', () => {
  it('keeps every authored concept fully open and its transfer question operable', () => {
    for (const active of argumentFoundations) {
      const view = render(<StoredFoundation active={active} />);
      expect(view.container.querySelector('p.whitespace-pre-line')?.textContent).toBe(active.body);
      const practice = within(screen.getByRole('region', { name: `Oefen het begrip ${active.term}` }));
      expect(practice.getAllByRole('radio')).toHaveLength(active.options.length);
      const correct = active.options.find((option) => option.id === active.answer)!;
      fireEvent.click(practice.getByRole('radio', { name: correct.text }));
      expect(practice.getByRole('status')).toHaveTextContent(correct.feedback);
      expect(useArgumentation.getState().sessions[lesson.id]?.answers[`foundation-${active.id}`]?.value).toBe(correct.id);
      view.unmount();
    }
    expect(useArgumentation.getState().sessions[lesson.id]?.firstTry).toEqual({});
  });

  it('keeps the full explanation and authored diagram readable in the DOM', () => {
    const view = render(<StoredFoundation />);
    expect(view.container.querySelector('p.whitespace-pre-line')?.textContent).toBe(concept.body);
    expect(view.container.textContent).toContain(concept.example);
    for (const node of concept.diagram.nodes) expect(view.container.textContent).toContain(node.text);
    fireEvent.click(screen.getByRole('button', { name: 'Ontleed de kaart' }));
    expect(screen.getByRole('button', { name: 'Toon het geheel' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Volgend kaartonderdeel' })).toBeVisible();
  });

  it('offers specific feedback and lets the learner change the initial interpretation', () => {
    render(<StoredFoundation />);
    const practice = within(screen.getByRole('region', { name: `Oefen het begrip ${concept.term}` }));
    const wrong = concept.options.find((option) => option.id !== concept.answer)!;
    const correct = concept.options.find((option) => option.id === concept.answer)!;
    expect(practice.queryByRole('status')).not.toBeInTheDocument();
    fireEvent.click(practice.getByRole('radio', { name: wrong.text }));
    expect(practice.getByRole('status')).toHaveTextContent(wrong.feedback);
    fireEvent.click(practice.getByRole('radio', { name: correct.text }));
    expect(practice.getByRole('status')).toHaveTextContent(correct.feedback);
    expect(practice.getByRole('status')).toHaveTextContent('Je past het begrip hier goed toe.');
    expect(practice.queryByText(wrong.feedback)).not.toBeInTheDocument();
  });

  it('persists concept answers without recording a scored first attempt', () => {
    render(<StoredFoundation />);
    const correct = concept.options.find((option) => option.id === concept.answer)!;
    fireEvent.click(screen.getByRole('radio', { name: correct.text }));
    const current = useArgumentation.getState().sessions[lesson.id]!;
    expect(current.answers[key]).toMatchObject({ value: correct.id, checked: true, score: 1 });
    expect(current.firstTry).toEqual({});
    expect(current.firstConfidence).toEqual({});
    expect(JSON.parse(window.localStorage.getItem(ARGUMENTS_KEY)!).state.sessions[lesson.id].answers[key].value).toBe(correct.id);
  });

  it('supports native keyboard selection and completed review is read-only', async () => {
    const user = userEvent.setup();
    const view = render(<StoredFoundation />);
    const practice = within(screen.getByRole('region', { name: `Oefen het begrip ${concept.term}` }));
    practice.getByRole('radio', { name: concept.options[0]!.text }).focus();
    await user.keyboard('{ArrowRight}');
    expect(practice.getByRole('radio', { name: concept.options[1]!.text })).toBeChecked();
    const current = useArgumentation.getState().sessions[lesson.id]!;
    useArgumentation.setState({ sessions: { [lesson.id]: { ...current, finished: true } } });
    view.rerender(<StoredFoundation />);
    expect(practice.getAllByRole('radio').every((control) => control.hasAttribute('disabled'))).toBe(true);
  });
});
