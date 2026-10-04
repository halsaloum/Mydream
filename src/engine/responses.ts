import { z } from 'zod';
import type { Step, StepKind } from '@/content/schema';
import { tokenize } from '@/content/text';
import { EXTRA_RESPONSE_SCHEMAS, extraFits, extraInitialResponse, isExtraKind } from './kinds';

/**
 * De antwoordtoestand van één stap. Volledig serialiseerbaar: zo kan een les na verversen
 * exact worden hervat, inclusief half ingevulde antwoorden en geplaatste kaartjes.
 */
const index = z.int().nonnegative();

export const ExplainResponseSchema = z.object({
  kind: z.literal('explain'),
  /** Huidig uitlegdeel. */
  panel: index,
  /** Verst bereikte deel. */
  reached: index,
  /** Gekozen knop per labdeel, op paneelindex. */
  labs: z.record(z.string(), index),
  /** Afgeronde opdrachten als "paneel:onderdeel", bv. "0:alpha". */
  solved: z.array(z.string()),
});

export const ResponseSchema = z.discriminatedUnion('kind', [
  ExplainResponseSchema,
  z.object({ kind: z.literal('learn') }),
  z.object({ kind: z.literal('choice'), value: z.string().nullable() }),
  z.object({ kind: z.literal('combine'), value: z.string().nullable() }),
  z.object({ kind: z.literal('type'), value: z.string() }),
  z.object({ kind: z.literal('order'), placed: z.array(index) }),
  z.object({ kind: z.literal('paragraph'), placed: z.array(index) }),
  z.object({ kind: z.literal('sort'), assign: z.array(index.nullable()) }),
  z.object({ kind: z.literal('fix'), index: index.nullable(), value: z.string() }),
  z.object({ kind: z.literal('rewrite'), value: z.string() }),
  z.object({ kind: z.literal('write'), value: z.string() }),
  ...EXTRA_RESPONSE_SCHEMAS,
]);

export type Response = z.infer<typeof ResponseSchema>;
export type ExplainResponse = z.infer<typeof ExplainResponseSchema>;
export type ResponseOf<K extends StepKind> = Extract<Response, { kind: K }>;

export function initialResponse(step: Step): Response {
  switch (step.kind) {
    case 'explain':
      return { kind: 'explain', panel: 0, reached: 0, labs: {}, solved: [] };
    case 'learn':
      return { kind: 'learn' };
    case 'choice':
    case 'combine':
      return { kind: step.kind, value: null };
    case 'type':
    case 'rewrite':
    case 'write':
      return { kind: step.kind, value: '' };
    case 'order':
    case 'paragraph':
      return { kind: step.kind, placed: [] };
    case 'sort':
      return { kind: 'sort', assign: step.items.map(() => null) };
    case 'fix':
      return { kind: 'fix', index: null, value: '' };
    default: {
      const extra = extraInitialResponse(step);
      if (!extra) throw new Error(`Geen beginantwoord voor ${step.kind}`);
      return extra;
    }
  }
}

/** Past een opgeslagen antwoord nog bij deze stap? Zo niet, dan begint de stap opnieuw. */
export function responseFits(step: Step, response: Response): boolean {
  if (step.kind !== response.kind) return false;
  if (isExtraKind(response.kind)) return extraFits(step, response as Parameters<typeof extraFits>[1]);
  switch (response.kind) {
    case 'explain':
      return step.kind === 'explain' && response.panel < step.panels.length && response.reached < step.panels.length;
    case 'order':
      return step.kind === 'order' && response.placed.every((i) => i < step.tiles.length) && new Set(response.placed).size === response.placed.length;
    case 'paragraph':
      return step.kind === 'paragraph' && response.placed.every((i) => i < step.parts.length) && new Set(response.placed).size === response.placed.length;
    case 'sort':
      return step.kind === 'sort' && response.assign.length === step.items.length && response.assign.every((b) => b === null || b < step.buckets.length);
    case 'fix':
      return step.kind === 'fix' && (response.index === null || response.index < tokenize(step.sentence).length);
    case 'choice':
    case 'combine':
      return (step.kind === 'choice' || step.kind === 'combine') && (response.value === null || step.options.includes(response.value));
    default:
      return true;
  }
}
