// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { panelWidgets } from '@/engine/plan';
import { course } from '../../catalog';
import type { Panel } from '../../schema';
import { ONDERZOEK } from '.';

const lessons = course.layers.filter((layer) => layer.id === 'deel' || layer.id === 'woord').flatMap((layer) => layer.lessons);
const NEW = ['d21', 'd22', 'd23', 'd24', 'w23', 'w24', 'w25', 'w26'].filter((id) => lessons.some((lesson) => lesson.id === id));
const WRITTEN = Object.keys(ONDERZOEK).filter((id) => ONDERZOEK[id]!.length > 0);

const interactive = (panel: Panel) => Boolean(panel.quiz || panel.lab) || panelWidgets(panel).length > 0;

describe('onderzoeksronde', () => {
  it('hoort bij een les van Het betekenisvolle woorddeel of Het woord', () => {
    const ids = new Set(lessons.map((lesson) => lesson.id));
    for (const id of Object.keys(ONDERZOEK)) expect(ids.has(id), id).toBe(true);
  });

  it.each(WRITTEN)('%s: een interactieve uitleg en daarna zware oefeningen', (id) => {
    const lesson = lessons.find((item) => item.id === id)!;
    const start = lesson.steps.findIndex((step) => step.id === 'onderzoek');
    const explain = lesson.steps[start];
    expect(explain?.kind).toBe('explain');
    if (explain?.kind !== 'explain') return;
    expect(explain.panels.length).toBeGreaterThanOrEqual(3);
    expect(explain.panels.every(interactive)).toBe(true);
    expect(lesson.steps.length - start - 1).toBeGreaterThanOrEqual(4);
  });
});

describe('nieuwe lessen', () => {
  it.each(NEW)('%s: drie interactieve uitlegrondes en minstens twaalf oefeningen', (id) => {
    const lesson = lessons.find((item) => item.id === id)!;
    const explains = lesson.steps.flatMap((step) => (step.kind === 'explain' ? [step] : []));
    expect(explains.map((step) => step.id)).toEqual(['uitleg', 'verdieping', 'onderzoek']);
    expect(explains.every((step) => step.panels.length >= 3 && step.panels.every(interactive))).toBe(true);
    expect(lesson.steps.length - explains.length).toBeGreaterThanOrEqual(12);
  });
});

it('elke les heeft unieke stap-ids', () => {
  for (const lesson of lessons) {
    const ids = lesson.steps.flatMap((step) => (step.id ? [step.id] : []));
    expect(new Set(ids).size, lesson.id).toBe(ids.length);
  }
});
