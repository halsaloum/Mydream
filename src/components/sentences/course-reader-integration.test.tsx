import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { argumentLessons } from '@/content/argumentation';
import { lessonCoreChecks } from '@/content/argumentation/core-checks';
import type { ArgumentLesson, ChoiceExercise, ReflectionExercise } from '@/content/argumentation/types';
import type { ArgumentMedia } from '@/content/argumentation/media';
import { sentenceLessons } from '@/content/sentences';
import { sentenceTeachingById } from '@/content/sentences/teaching';
import { theoryPages } from '@/lib/argumentation/theory-pages';
import { useArgumentation } from '@/state/argumentation';
import { useSentences } from '@/state/sentences';
import { ArgumentLessonPlayer } from '@/components/argumentation/lesson-player';
import { SentenceLessonPlayer } from './lesson-player';

vi.mock('@/state/hydration', () => ({ useHydrated: () => true }));
vi.mock('@/lib/motion', async (original) => ({ ...await original<typeof import('@/lib/motion')>(), useCalmMotion: () => true }));
// Prerequisite unlocking and the individual media/lab renderers have their own tests.
vi.mock('@/lib/argumentation/path', () => ({ lessonAvailable: () => true, nextPathLesson: () => undefined }));
vi.mock('next/dynamic', () => ({ default: () => function Enhancement(props: { kind?: string; item?: ArgumentMedia; lessonId?: string; presetId?: string }) {
  return props.item ? <article><h3>{props.item.title}</h3><p>{props.item.description}</p><p>{props.item.watchFor}</p></article>
    : <article><h3>{props.kind ? `Oefenlab: ${props.kind}` : props.presetId ? `Werkkaart: ${props.presetId}` : `Beeldkaart: ${props.lessonId}`}</h3><p>Lees de huidige oefening en onderzoek je eigen keuze.</p></article>;
} }));

const sentence = sentenceLessons[0]!;
const teaching = sentenceTeachingById.get(sentence.id)!;
const argument = argumentLessons.find((lesson) => lesson.id === 'basis-argument-of-uitleg')!;
const normalise = (value: string) => value.replace(/\s+/gu, ' ').trim();
const reader = () => screen.getByRole('region', { name: 'Voorlezen' });
const readingText = () => normalise([...within(reader()).getByLabelText('Tekst om mee te lezen').querySelectorAll('p')].map((part) => part.textContent).join(' '));
async function openReading(user: ReturnType<typeof userEvent.setup>) {
  await user.click(within(reader()).getByText('Leesmodus · grotere tekst en meelezen', { selector: 'summary' }));
  await waitFor(() => expect(readingText()).not.toBe(''));
}

beforeEach(() => {
  useSentences.getState().reset();
  useArgumentation.getState().reset();
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

describe('gedeelde reader in de actieve zins- en argumentles', () => {
  it('leest de actieve uitleg en neemt een schrijfmodel pas op na de eigen poging', async () => {
    const user = userEvent.setup();
    useSentences.getState().start(sentence);
    useSentences.getState().setTab(sentence.id, 'wetten');
    render(<SentenceLessonPlayer lesson={sentence} />);
    expect(screen.getAllByRole('region', { name: 'Voorlezen' })).toHaveLength(1);
    await openReading(user);
    expect(readingText()).toContain(normalise(teaching.introduction[0]!));
    expect(readingText()).not.toContain(sentenceLessons[1]!.title);
    expect(readingText()).not.toContain('Bewaren en terug naar alle zinslessen');
    expect(readingText()).not.toContain(teaching.application.model);

    await user.click(screen.getByRole('tab', { name: 'Zelf proberen' }));
    await waitFor(() => expect(readingText()).toContain(teaching.application.prompt));
    expect(readingText()).not.toContain(normalise(teaching.introduction[0]!));
    expect(readingText()).not.toContain(teaching.application.model);
    fireEvent.change(screen.getByRole('textbox', { name: 'Schrijf je eigen zin en verklaring' }), { target: { value: 'Morgen controleert mijn collega de aanvraag.' } });
    await user.click(screen.getByRole('button', { name: 'Vergelijk met een voorbeeld' }));
    await waitFor(() => expect(readingText()).toContain(teaching.application.model));
    expect(useSentences.getState().sessions[sentence.id]).toMatchObject({ finished: false, answers: {}, firstTry: {} });
    expect(useSentences.getState().records[sentence.id]).toBeUndefined();
  });

  it('respecteert diagnose en gesloten reparatiemodellen, maar leest zichtbaar gemaakte feedback', async () => {
    const user = userEvent.setup();
    const task = sentence.debugger[0]!;
    useSentences.getState().start(sentence);
    useSentences.getState().setTab(sentence.id, 'debugger');
    render(<SentenceLessonPlayer lesson={sentence} />);
    await openReading(user);
    expect(readingText()).toContain(task.prompt);
    expect(readingText()).not.toContain(task.instruction);
    expect(readingText()).not.toContain(task.repairs[0]!);
    act(() => {
      useSentences.getState().answer(sentence.id, task.id, { selected: task.targets });
      expect(useSentences.getState().diagnose(sentence, task)).toBe(true);
    });
    await waitFor(() => expect(readingText()).toContain(task.instruction));
    expect(readingText()).not.toContain(task.repairs[0]!);
    fireEvent.change(screen.getByRole('textbox', { name: task.instruction }), { target: { value: 'Ik lees een over taal boek.' } });
    await user.click(screen.getByRole('button', { name: 'Controleer mijn toepassing' }));
    await waitFor(() => expect(readingText()).toContain(task.explanation));
    expect(readingText()).not.toContain(task.repairs[0]!);
    await user.click(within(screen.getByRole('tabpanel', { name: 'Herstellen' })).getByText('Vergelijk met een passende reparatie', { selector: 'summary' }));
    await waitFor(() => expect(readingText()).toContain(task.repairs[0]!));
    expect(readingText()).not.toContain('Opdracht 1 van 4 · voortgang wordt bewaard');
  });

  it('leest één argumentatiepagina en bewaart de grens tussen een denkpoging en het model', async () => {
    const user = userEvent.setup();
    const pages = theoryPages(argument);
    const sectionIndex = pages.findIndex((page) => page.kind === 'section' && page.sectionIndex === 1);
    const check = lessonCoreChecks[argument.id]!;
    useArgumentation.getState().start(argument);
    useArgumentation.getState().setTheoryPage(argument.id, sectionIndex);
    render(<ArgumentLessonPlayer lesson={argument} />);
    expect(screen.getAllByRole('region', { name: 'Voorlezen' })).toHaveLength(1);
    await openReading(user);
    expect(readingText()).toContain(normalise(argument.sections[1]!.body));
    expect(readingText()).not.toContain(normalise(argument.sections[0]!.body));
    expect(readingText()).not.toContain(normalise(argument.deepDive.body));
    expect(readingText()).not.toContain(normalise(argument.sections[1]!.example));
    act(() => useArgumentation.getState().answer(argument.id, `core-${argument.id}`, { value: check.answer, checked: true, score: 1 }));
    await waitFor(() => expect(readingText()).toContain(normalise(argument.sections[1]!.example)));
    expect(readingText()).not.toContain('Verder lezen');
    expect(readingText()).not.toContain('Bewaren en terug naar het leerpad');
  });

  it('verzamelt ook de huidige media- en labpagina, zonder andere lespagina’s toe te voegen', async () => {
    const user = userEvent.setup();
    const laboratoryLesson = argumentLessons.find((lesson) => lesson.lab)!;
    const pages = theoryPages(laboratoryLesson);
    const mediaPage = pages.find((page) => page.kind === 'media')!;
    const labIndex = pages.findIndex((page) => page.kind === 'lab');
    useArgumentation.getState().start(laboratoryLesson);
    useArgumentation.getState().setTheoryPage(laboratoryLesson.id, pages.indexOf(mediaPage));
    render(<ArgumentLessonPlayer lesson={laboratoryLesson} />);
    await openReading(user);
    expect(readingText()).toContain(mediaPage.item.description);
    expect(readingText()).toContain(mediaPage.item.watchFor);
    expect(readingText()).not.toContain(normalise(laboratoryLesson.sections[0]!.body));
    act(() => useArgumentation.getState().setTheoryPage(laboratoryLesson.id, labIndex));
    await waitFor(() => expect(readingText()).toContain(`Oefenlab: ${laboratoryLesson.lab}`));
    expect(readingText()).not.toContain(mediaPage.item.description);
  });

  it('leest checkpointmodellen pas tijdens zelfcontrole en toetsfeedback pas na het openen', async () => {
    const user = userEvent.setup();
    const source = argumentLessons.find((lesson) => lesson.checkpoint && lesson.exercises.some((exercise) => exercise.kind === 'reflection'))!;
    const choice = source.exercises.find((exercise): exercise is ChoiceExercise => exercise.kind === 'choice')!;
    const writing = source.exercises.find((exercise): exercise is ReflectionExercise => exercise.kind === 'reflection')!;
    const checkpoint: ArgumentLesson = { ...source, id: 'reader-checkpoint-fixture', exercises: [choice, writing] };
    useArgumentation.getState().start(checkpoint);
    useArgumentation.getState().move(checkpoint.id, 1);
    render(<ArgumentLessonPlayer lesson={checkpoint} />);
    await openReading(user);
    expect(readingText()).toContain(choice.prompt);
    expect(readingText()).not.toContain(normalise(choice.explanation));
    act(() => {
      useArgumentation.getState().answer(checkpoint.id, choice.id, { value: choice.answer, confidence: 2 });
      useArgumentation.getState().check(checkpoint.id, choice.id, 1);
      useArgumentation.getState().move(checkpoint.id, 2);
    });
    await waitFor(() => expect(readingText()).toContain(writing.prompt));
    expect(readingText()).not.toContain(normalise(writing.model));
    act(() => {
      useArgumentation.getState().answer(checkpoint.id, writing.id, { value: Array.from({ length: writing.minWords }, () => 'afweging').join(' ') });
      useArgumentation.getState().check(checkpoint.id, writing.id, null);
    });
    expect(readingText()).not.toContain(normalise(writing.model));
    act(() => useArgumentation.getState().move(checkpoint.id, 3));
    await waitFor(() => expect(readingText()).toContain(normalise(writing.model)));
    expect(readingText()).toContain('Deze zelfcontrole bepaalt geen objectieve inhoudelijke score.');
    act(() => {
      useArgumentation.getState().answer(checkpoint.id, writing.id, { rubric: Object.fromEntries(writing.rubric.map((_, index) => [String(index), true])) });
      useArgumentation.getState().finish(checkpoint);
    });
    await waitFor(() => expect(readingText()).toContain('Checkpoint behaald.'));
    expect(readingText()).not.toContain(normalise(choice.explanation));
    await user.click(within(screen.getByRole('main')).getByText('Bekijk de feedback op alle toetsvragen', { selector: 'summary' }));
    await waitFor(() => expect(readingText()).toContain(normalise(choice.explanation)));
    expect(useArgumentation.getState().records[checkpoint.id]?.lastScore).toBe(100);
    expect(readingText()).not.toContain('Nogmaals oefenen');
  });
});
