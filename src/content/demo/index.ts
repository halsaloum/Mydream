import { z } from 'zod';
import { course } from '../catalog';
import { StepSchema, type Domain, type Step } from '../schema';
import { ARGUMENT_DEMOS } from './argumenten';
import { DEMO_GROUPS, DEMO_ITEMS, type DemoItem } from './oefenvormen';

export { DEMO_GROUPS, type DemoGroup } from './oefenvormen';

export type DemoEntry = Omit<DemoItem, 'step' | 'domain'> & { step: Step; domain: Domain };

/** Alle demo's, in de volgorde van de galerij (ook voor "Volgende oefenvorm"). */
const ordered = [...DEMO_ITEMS, ...ARGUMENT_DEMOS]
  .map((item, i) => ({ item, i }))
  .sort((a, b) => DEMO_GROUPS.indexOf(a.item.group) - DEMO_GROUPS.indexOf(b.item.group) || a.i - b.i)
  .map(({ item }) => item);

/** De demoset, gevalideerd met hetzelfde contract als echte lessen. */
export const demoEntries: readonly DemoEntry[] = ordered.map((item) => {
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
