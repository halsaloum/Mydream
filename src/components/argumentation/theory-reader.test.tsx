import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { argumentLessons } from '@/content/argumentation';
import { argumentInquiries } from '@/content/argumentation/inquiries';
import { foundationForLesson } from '@/content/argumentation/foundations';
import { lessonCoreChecks } from '@/content/argumentation/core-checks';
import type { ArgumentMedia } from '@/content/argumentation/media';
import { emptyArgumentAnswer } from '@/lib/argumentation/learning';
import { theoryPages } from '@/lib/argumentation/theory-pages';
import type { ArgumentSession } from '@/state/argumentation';
import { TheoryReader } from './theory-reader';

// These existing enhancements have their own tests. Keep this test about which page is mounted.
vi.mock('next/dynamic', () => ({ default: () => function Enhancement(props: { lessonId?: string; kind?: string; item?: ArgumentMedia; presetId?: string; embedded?: boolean }) {
  return props.item ? <article data-testid="media-page"><h3>{props.item.title}</h3><p>{props.item.description}</p><p>{props.item.watchFor}</p></article> : props.presetId ? <div data-testid="workshop-page" data-embedded={props.embedded}>Werkkaart: {props.presetId}</div> : <div data-testid="enhancement">{props.kind ? `Oefenlab: ${props.kind}` : `Beeldkaart: ${props.lessonId}`}</div>;
} }));

const session = (): ArgumentSession => ({ signature: 'reader-test', startedAt: '2026-10-12T20:00:00.000Z', cursor: 0, resumeCursor: 1, theoryPage: 0, finished: false, answers: {}, firstTry: {}, firstConfidence: {} });
const lesson = argumentLessons.find((item) => item.id === 'basis-argument-of-uitleg')!;
const pages = theoryPages(lesson);
const indexOf = (kind: string) => pages.findIndex((page) => page.kind === kind);

beforeEach(() => { vi.spyOn(window, 'scrollTo').mockImplementation(() => {}); });

describe('single-page theory reader', () => {
  it('shows the start and objectives without mounting section or deep-dive text', () => {
    const { container } = render(<TheoryReader lesson={lesson} session={session()} pageIndex={indexOf('start')} onPageChange={vi.fn()} />);
    expect(screen.getByRole('region', { name: 'Begin met één kleine stap' })).toBeVisible();
    for (const objective of lesson.objectives) expect(container.textContent).toContain(objective);
    expect(container.textContent).not.toContain(lesson.sections[0]!.body);
    expect(container.textContent).not.toContain(lesson.deepDive.body);
    expect(screen.queryByTestId('enhancement')).not.toBeInTheDocument();
    expect(screen.queryByText('Nieuw met argumenten? Begin bij deze begrippen.')).not.toBeInTheDocument();
  });

  it('opens one full foundational concept at a time before the warmup', () => {
    const firstLesson = argumentLessons[0]!;
    const firstPages = theoryPages(firstLesson);
    const concepts = firstPages.filter((page) => page.kind === 'concept');
    expect(concepts).toHaveLength(foundationForLesson(firstLesson.id).length);
    const { container, rerender } = render(<TheoryReader lesson={firstLesson} session={session()} pageIndex={0} onPageChange={vi.fn()} />);
    expect(screen.getByRole('heading', { name: concepts[0]!.title, level: 2 })).toHaveFocus();
    expect(container.querySelector('p.whitespace-pre-line')?.textContent).toBe(concepts[0]!.foundation.body);
    expect(container.textContent).not.toContain(concepts[1]!.foundation.body);
    expect(screen.queryByRole('region', { name: 'Begin met één kleine stap' })).not.toBeInTheDocument();
    rerender(<TheoryReader lesson={firstLesson} session={session()} pageIndex={1} onPageChange={vi.fn()} />);
    expect(container.querySelector('p.whitespace-pre-line')?.textContent).toBe(concepts[1]!.foundation.body);
    expect(container.textContent).not.toContain(concepts[0]!.foundation.body);
  });

  it('mounts exactly one explanation, preserving its full text and keeping the first model separate', () => {
    const { container, rerender } = render(<TheoryReader lesson={lesson} session={session()} pageIndex={indexOf('section')} onPageChange={vi.fn()} />);
    expect(container.querySelector('p.whitespace-pre-line')?.textContent).toBe(lesson.sections[0]!.body);
    expect(container.textContent).toContain(lesson.sections[0]!.takeaway);
    expect(container.textContent).not.toContain(lesson.sections[0]!.example);
    expect(container.textContent).not.toContain(lesson.sections[1]!.body);
    expect(screen.getByTestId('enhancement')).toHaveTextContent(`Beeldkaart: ${lesson.id}`);
    const second = pages.findIndex((page) => page.kind === 'section' && page.sectionIndex === 1);
    rerender(<TheoryReader lesson={lesson} session={session()} pageIndex={second} onPageChange={vi.fn()} />);
    expect(container.querySelector('p.whitespace-pre-line')?.textContent).toBe(lesson.sections[1]!.body);
    expect(container.textContent).not.toContain(lesson.sections[1]!.example);
    expect(screen.getByRole('region', { name: 'Probeer deze denkstap' })).toBeVisible();
    expect(container.textContent).not.toContain(lesson.sections[0]!.body);
    expect(screen.queryByTestId('enhancement')).not.toBeInTheDocument();
  });

  it('reveals the second worked example only after a correct core choice or in completed review', () => {
    const second = pages.findIndex((page) => page.kind === 'section' && page.sectionIndex === 1);
    const check = lessonCoreChecks[lesson.id]!;
    const state = session();
    const wrong = { ...state, answers: { [`core-${lesson.id}`]: { ...emptyArgumentAnswer(), value: check.options.find((option) => option.id !== check.answer)!.id, checked: true, score: 0 } } };
    const { container, rerender } = render(<TheoryReader lesson={lesson} session={wrong} pageIndex={second} onPageChange={vi.fn()} />);
    expect(container.textContent).not.toContain(lesson.sections[1]!.example);
    const right = { ...state, answers: { [`core-${lesson.id}`]: { ...emptyArgumentAnswer(), value: check.answer, checked: true, score: 1 } } };
    rerender(<TheoryReader lesson={lesson} session={right} pageIndex={second} onPageChange={vi.fn()} />);
    expect(container.textContent).toContain(lesson.sections[1]!.example);
    rerender(<TheoryReader lesson={lesson} session={{ ...state, finished: true }} pageIndex={second} onPageChange={vi.fn()} />);
    expect(container.textContent).toContain(lesson.sections[1]!.example);
    expect(container.querySelector('p.whitespace-pre-line')?.textContent).toBe(lesson.sections[1]!.body);
  });

  it('keeps the worked case hidden until comparison, then reveals it on its own page', () => {
    const inquiry = argumentInquiries[lesson.id]!;
    const state = session();
    const { container, rerender } = render(<TheoryReader lesson={lesson} session={state} pageIndex={indexOf('inquiry')} onPageChange={vi.fn()} />);
    expect(container.textContent).toContain(inquiry.scenario);
    expect(container.textContent).not.toContain(inquiry.model);
    expect(container.textContent).not.toContain(lesson.sections[0]!.example);
    const compared = { ...state, answers: { [`inquiry-${lesson.id}`]: { ...emptyArgumentAnswer(), reasoning: 'De gespreksvraag bepaalt welke uitspraak nog ter discussie staat.', checked: true } } };
    rerender(<TheoryReader lesson={lesson} session={compared} pageIndex={indexOf('inquiry')} onPageChange={vi.fn()} />);
    expect(container.textContent).toContain(inquiry.model);
    expect(container.textContent).toContain(lesson.sections[0]!.example);
    expect(container.textContent).not.toContain(lesson.sections[0]!.body);
    expect(container.textContent).not.toContain(lesson.deepDive.body);
  });

  it('keeps the entire extra text open on a dedicated page', () => {
    const { container } = render(<TheoryReader lesson={lesson} session={session()} pageIndex={indexOf('deepDive')} onPageChange={vi.fn()} />);
    expect(screen.getByText('Extra verdieping')).toBeVisible();
    expect(container.querySelector('p.whitespace-pre-line')?.textContent).toBe(lesson.deepDive.body);
    expect(container.querySelector('p.whitespace-pre-line')?.closest('details')).toBeNull();
    expect(container.textContent).not.toContain(lesson.sections[0]!.body);
  });

  it('mounts the optional lab separately from lesson explanations and media', () => {
    const laboratoryLesson = argumentLessons.find((item) => item.lab)!;
    const laboratoryPages = theoryPages(laboratoryLesson);
    const pageIndex = laboratoryPages.findIndex((page) => page.kind === 'lab');
    const { container } = render(<TheoryReader lesson={laboratoryLesson} session={session()} pageIndex={pageIndex} onPageChange={vi.fn()} />);
    expect(screen.getByTestId('enhancement')).toHaveTextContent(`Oefenlab: ${laboratoryLesson.lab}`);
    expect(container.textContent).not.toContain(laboratoryLesson.sections[0]!.body);
    expect(container.textContent).not.toContain(laboratoryLesson.deepDive.body);
    expect(screen.queryByTestId('media-page')).not.toBeInTheDocument();
  });

  it('opens one fixed workshop inside the lesson without mounting other learning content', () => {
    const workshopLesson = argumentLessons.find((item) => item.id === 'basis-argumentstructuur')!;
    const workshopPages = theoryPages(workshopLesson);
    const firstWorkshop = workshopPages.findIndex((page) => page.kind === 'workshop');
    const { container, rerender } = render(<TheoryReader lesson={workshopLesson} session={session()} pageIndex={firstWorkshop} onPageChange={vi.fn()} />);
    expect(screen.getByTestId('workshop-page')).toHaveTextContent('Werkkaart: linked');
    expect(screen.getByTestId('workshop-page')).toHaveAttribute('data-embedded', 'true');
    expect(container.textContent).not.toContain(workshopLesson.sections[0]!.body);
    expect(screen.queryByTestId('media-page')).not.toBeInTheDocument();
    rerender(<TheoryReader lesson={workshopLesson} session={session()} pageIndex={firstWorkshop + 1} onPageChange={vi.fn()} />);
    expect(screen.getAllByTestId('workshop-page')).toHaveLength(1);
    expect(screen.getByTestId('workshop-page')).toHaveTextContent('Werkkaart: convergent');
  });

  it('renders one media item at a time and unmounts it before the recap', () => {
    const media = pages.filter((page) => page.kind === 'media');
    expect(media.length).toBeGreaterThan(1);
    const { container, rerender } = render(<TheoryReader lesson={lesson} session={session()} pageIndex={pages.indexOf(media[0]!)} onPageChange={vi.fn()} />);
    expect(screen.getByTestId('media-page')).toHaveTextContent(media[0]!.item.description);
    expect(container.textContent).not.toContain(media[1]!.item.description);
    rerender(<TheoryReader lesson={lesson} session={session()} pageIndex={pages.indexOf(media[1]!)} onPageChange={vi.fn()} />);
    expect(screen.getAllByTestId('media-page')).toHaveLength(1);
    expect(container.textContent).not.toContain(media[0]!.item.description);
    rerender(<TheoryReader lesson={lesson} session={session()} pageIndex={indexOf('recap')} onPageChange={vi.fn()} />);
    expect(screen.queryByTestId('media-page')).not.toBeInTheDocument();
    for (const section of lesson.sections) expect(container.textContent).toContain(section.takeaway);
  });

  it('focuses and scrolls on page changes without stealing focus on an answer update', () => {
    const state = session();
    const { rerender } = render(<TheoryReader lesson={lesson} session={state} pageIndex={indexOf('section')} onPageChange={vi.fn()} />);
    const heading = screen.getByRole('heading', { name: lesson.sections[0]!.title, level: 2 });
    expect(heading).toHaveFocus();
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    rerender(<TheoryReader lesson={lesson} session={{ ...state, firstTry: { example: 1 } }} pageIndex={indexOf('section')} onPageChange={vi.fn()} />);
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    rerender(<TheoryReader lesson={lesson} session={state} pageIndex={indexOf('deepDive')} onPageChange={vi.fn()} />);
    expect(screen.getByRole('heading', { name: lesson.deepDive.title, level: 2 })).toHaveFocus();
    expect(window.scrollTo).toHaveBeenCalledTimes(2);
  });

  it('repairs an out-of-range page without owning previous/next navigation', () => {
    const onPageChange = vi.fn();
    render(<TheoryReader lesson={lesson} session={session()} pageIndex={999} onPageChange={onPageChange} />);
    expect(onPageChange).toHaveBeenCalledWith(pages.length - 1);
    expect(screen.getByRole('heading', { name: 'Wat neem je mee?', level: 2 })).toBeVisible();
    expect(screen.queryByRole('button', { name: /Vorige|Verder|Naar de opdrachten/ })).not.toBeInTheDocument();
  });
});
