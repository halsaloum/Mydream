import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sentenceLessons } from '@/content/sentences';
import { sentenceTeachingById } from '@/content/sentences/teaching';
import type { SentenceTeaching } from '@/content/sentences/teaching-types';
import type { SentenceExercise } from '@/content/sentences/types';
import { fingerprint } from '@/engine/hash';
import { EMPTY_SENTENCES, SENTENCES_KEY, useSentences } from '@/state/sentences';
import { SentenceLessonPlayer } from './lesson-player';

vi.mock('@/state/hydration', () => ({ useHydrated: () => true }));
vi.mock('@/content/sentences/teaching', () => ({ sentenceTeachingById: new Map() }));

const lesson = sentenceLessons[0]!;
const teaching: SentenceTeaching = {
  lessonId: lesson.id,
  introduction: ['Woorden die samen iemand noemen, vormen vaak één groep.'], concepts: [], pitfalls: [],
  walkthrough: { title: 'Samen lezen', situation: 'Een leerling leest.', startSentence: 'De leerling leest.', steps: [{ title: 'Bekijk de lezer', explanation: 'De leerling is één groep.', sentence: 'De leerling leest.', focus: ['De leerling'] }], result: 'Houd de groep bij elkaar.' },
  quickCheck: { question: 'Welke groep noemt een persoon?', options: [{ id: 'reader', text: 'De leerling', feedback: 'Deze woorden noemen samen de lezer.' }, { id: 'verb', text: 'leest', feedback: 'Leest is hier een werkwoord.' }], answer: 'reader' },
  application: { prompt: 'Schrijf over een lezer.', starter: 'Mijn zus…', model: 'Mijn zus leest een krant.', reasoning: 'Mijn zus noemt de lezer.', checklist: ['Ik kan de groep noemen.'] },
};

beforeEach(() => {
  useSentences.getState().reset();
  sentenceTeachingById.set(lesson.id, teaching);
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

function solve(task: SentenceExercise) {
  const store = useSentences.getState();
  if (task.support === 'half' && task.segmentation) {
    store.answer(lesson.id, task.id, { boundaries: task.segmentation.boundaries });
    expect(store.segment(lesson, task)).toBe(true);
  }
  if (task.kind === 'gate' || task.kind === 'debug') {
    store.answer(lesson.id, task.id, { selected: task.kind === 'gate' ? task.diagnosis.targets : task.targets });
    expect(store.diagnose(lesson, task)).toBe(true);
  }
  if (task.kind === 'slots') store.answer(lesson.id, task.id, { placements: task.accept[0] });
  else if (task.kind === 'gate') store.answer(lesson.id, task.id, { choice: task.answer });
  else if (task.kind === 'tether') store.answer(lesson.id, task.id, { links: task.links });
  else if (task.kind === 'mutate') store.answer(lesson.id, task.id, { variant: task.target, order: task.variants.find((variant) => variant.id === task.target)!.order });
  else store.answer(lesson.id, task.id, { text: task.repairs[0] });
  expect(store.check(lesson, task)).toBe(true);
}

describe('zinslessen met uitleg en vrij leesbare samenvatting', () => {
  it('toont de samenvatting vóór afronding zonder een afronding toe te kennen', () => {
    useSentences.getState().start(lesson);
    useSentences.getState().setTab(lesson.id, 'codex');
    render(<SentenceLessonPlayer lesson={lesson} />);
    expect(screen.getByRole('tab', { name: 'Samenvatting' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { name: lesson.summary.title })).toBeVisible();
    lesson.summary.points.forEach((point) => expect(screen.getByText(point)).toBeVisible());
    expect(screen.getByRole('textbox', { name: 'Pas dit toe in je eigen tekst' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Module afronden en samenvatting bewaren' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Verder met mijn open opdracht' })).toBeEnabled();
    expect(useSentences.getState().sessions[lesson.id]).toMatchObject({ finished: false, answers: {}, firstTry: {}, signature: fingerprint(lesson) });
    expect(useSentences.getState().records[lesson.id]).toBeUndefined();
    screen.getAllByRole('link', { name: 'Bewaren en terug naar alle zinslessen' }).forEach((link) => expect(link).toHaveAttribute('href', '/?niveau=zinnen#niveaus-titel'));
    expect(screen.queryByText(/Codex-wetten|Bouw-arena|Röntgen-debugger/)).not.toBeInTheDocument();
  });

  it('bewaart dezelfde eigen tekst in uitleg en samenvatting en hervat die uit opslag', async () => {
    const user = userEvent.setup();
    useSentences.getState().start(lesson);
    useSentences.getState().setTab(lesson.id, 'wetten');
    const view = render(<SentenceLessonPlayer lesson={lesson} />);
    expect(screen.getByRole('tab', { name: 'Uitleg' })).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('tab', { name: 'Zelf proberen' }));
    await user.click(screen.getByRole('radio', { name: 'De leerling' }));
    await user.click(screen.getByRole('button', { name: 'Bekijk de uitleg bij mijn antwoord' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Schrijf je eigen zin en verklaring' }), { target: { value: 'Mijn kleine zus leest een strip.' } });
    await user.click(screen.getByRole('button', { name: 'Vergelijk met een voorbeeld' }));
    await user.click(screen.getByRole('checkbox', { name: 'Ik kan de groep noemen.' }));
    expect(useSentences.getState().sessions[lesson.id]).toMatchObject({ transferText: 'Mijn kleine zus leest een strip.', finished: false, answers: {}, firstTry: {} });
    await user.click(screen.getByRole('tab', { name: 'Samenvatting' }));
    expect(screen.getByRole('textbox', { name: 'Pas dit toe in je eigen tekst' })).toHaveValue('Mijn kleine zus leest een strip.');
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    const saved = window.localStorage.getItem(SENTENCES_KEY)!;
    view.unmount();

    useSentences.setState(EMPTY_SENTENCES);
    window.localStorage.setItem(SENTENCES_KEY, saved);
    await useSentences.persist.rehydrate();
    render(<SentenceLessonPlayer lesson={lesson} />);
    expect(screen.getByRole('tab', { name: 'Samenvatting' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('textbox', { name: 'Pas dit toe in je eigen tekst' })).toHaveValue('Mijn kleine zus leest een strip.');
    expect(useSentences.getState().sessions[lesson.id]?.signature).toBe(fingerprint(lesson));
    expect(useSentences.getState().records[lesson.id]).toBeUndefined();
  });

  it('biedt afronden pas na tien echte oplossingen aan en bewaart de samenvatting apart', async () => {
    const user = userEvent.setup();
    useSentences.getState().start(lesson);
    const exercises = [...lesson.arena, ...lesson.debugger];
    exercises.slice(0, 9).forEach(solve);
    useSentences.getState().setTab(lesson.id, 'codex');
    render(<SentenceLessonPlayer lesson={lesson} />);
    const progress = screen.getByRole('region', { name: 'Voortgang en afronding' });
    expect(progress).toHaveTextContent('9 van 10 opdrachten opgelost');
    expect(screen.queryByRole('button', { name: 'Module afronden en samenvatting bewaren' })).not.toBeInTheDocument();
    act(() => solve(exercises[9]!));
    await user.click(screen.getByRole('button', { name: 'Module afronden en samenvatting bewaren' }));
    expect(within(progress).getByText('Module afgerond · samenvatting bewaard')).toBeVisible();
    expect(screen.getByRole('heading', { name: lesson.summary.title })).toBeVisible();
    expect(useSentences.getState().records[lesson.id]?.attempts).toBe(1);
    expect(useSentences.getState().sessions[lesson.id]?.finished).toBe(true);
  });
});
