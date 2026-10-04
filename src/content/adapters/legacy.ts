import type { Lesson as LegacyLesson, Step as LegacyStep } from '../legacy/course';
import { DOMAINS, LAYERS } from '../legacy/build';
import { BUILD } from '../legacy/layer-examples';
import type { Accent, CoursePackInput } from '../schema';

/**
 * Zet de oorspronkelijke lesdata (`legacy/build.ts`, ongewijzigd) om naar het inhoudscontract.
 *
 * Alleen de vorm verandert, nooit de inhoud:
 * - Tailwind-klassen en hexkleuren worden semantische accentnamen (presentatie hoort niet in inhoud).
 * - `write.must[].test` (een RegExp) wordt `{ pattern, flags }`, zodat het formaat JSON-serialiseerbaar is.
 * - Het groeivoorbeeld uit de oude `Home.tsx` wordt `layer.growth`.
 */

const LAYER_ACCENTS: Record<string, Accent> = {
  'bg-mint': 'green',
  'bg-[#00c2a8]': 'teal',
  'bg-[#ff9600]': 'orange',
  'bg-[#ffc800]': 'yellow',
  'bg-sky': 'blue',
  'bg-lilac': 'purple',
  'bg-[#2b70c9]': 'navy',
  'bg-[#ff86d0]': 'pink',
  'bg-tomato': 'red',
};

const DOMAIN_ACCENTS: Record<string, Accent> = {
  '#0e9f9a': 'teal',
  '#e8577e': 'rose',
  '#58a700': 'green',
  '#1899d6': 'blue',
  '#a568cc': 'purple',
  '#ff9600': 'orange',
  '#5b6b82': 'slate',
};

function accentFor(table: Record<string, Accent>, key: string, where: string): Accent {
  const accent = table[key];
  if (!accent) throw new Error(`Geen accent bekend voor ${where} (${key})`);
  return accent;
}

function adaptStep(step: LegacyStep) {
  if (step.kind !== 'write') return step;
  return {
    ...step,
    must: step.must.map((criterion) => ({
      label: criterion.label,
      test: { pattern: criterion.test.source, flags: criterion.test.flags },
    })),
  };
}

function adaptLesson(lesson: LegacyLesson) {
  return {
    id: lesson.id,
    title: lesson.title,
    skill: lesson.skill,
    icon: lesson.icon,
    domain: lesson.domain ?? '',
    ...(lesson.also ? { also: lesson.also } : {}),
    steps: lesson.steps.map(adaptStep),
  };
}

export function adaptLegacyCourse(): CoursePackInput {
  return {
    schemaVersion: 1,
    id: 'van-letter-tot-alinea',
    title: 'Van letter tot alinea',
    version: '2.0.0',
    domains: DOMAINS.map((domain) => ({
      id: domain.id,
      name: domain.name,
      q: domain.q,
      accent: accentFor(DOMAIN_ACCENTS, domain.color, `vakgebied ${domain.id}`),
      ...(domain.persp ? { persp: true } : {}),
    })),
    layers: LAYERS.map((layer, index) => {
      const growth = BUILD[index];
      return {
        id: layer.id,
        name: layer.name,
        icon: layer.icon,
        made: layer.made,
        learn: layer.learn,
        fields: layer.fields,
        example: layer.example,
        accent: accentFor(LAYER_ACCENTS, layer.color, `niveau ${layer.id}`),
        ...(growth ? { growth: { segments: growth.segs, tip: growth.tip } } : {}),
        lessons: layer.lessons.map(adaptLesson),
      };
    }),
  };
}
