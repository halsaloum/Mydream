import { z } from 'zod';
import { course } from '../catalog';
import { StepSchema, type Domain, type Step } from '../schema';
import { DEMO_ITEMS, type DemoItem } from './oefenvormen';

export type DemoEntry = Omit<DemoItem, 'step' | 'domain'> & { step: Step; domain: Domain };

/** De demoset, gevalideerd met hetzelfde contract als echte lessen. */
export const demoEntries: readonly DemoEntry[] = DEMO_ITEMS.map((item) => {
  const result = StepSchema.safeParse(item.step);
  if (!result.success) throw new Error(`Demo "${item.slug}" voldoet niet aan het contract:\n${z.prettifyError(result.error)}`);
  const domain = course.domains.find((d) => d.id === item.domain);
  if (!domain) throw new Error(`Demo "${item.slug}": onbekend vakgebied ${item.domain}`);
  return { ...item, step: result.data, domain };
});

export function getDemo(slug: string): DemoEntry | undefined {
  return demoEntries.find((entry) => entry.slug === slug);
}

/** Les-id waaronder een demo in de engine draait (los van de cursus). */
export const demoLessonId = (slug: string) => `demo-${slug}`;
