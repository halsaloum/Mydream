'use client';

import type { RefObject } from 'react';
import { getLessonEntry } from '@/content/catalog';
import type { Lesson, Step } from '@/content/schema';
import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/ui/dialog';
import { RichText } from '@/components/ui/rich-text';
import { Examples, RuleCard } from './steps/shared';

type Teaching = Extract<Step, { kind: 'explain' | 'learn' }>;

/** De uitleg van een les, om tijdens het oefenen terug te lezen. */
export function lessonRules(lessonId: string): { lesson: Lesson; rules: Teaching[] } | null {
  const entry = getLessonEntry(lessonId);
  if (!entry) return null;
  const rules = entry.lesson.steps.filter((step): step is Teaching => step.kind === 'explain' || step.kind === 'learn');
  return rules.length ? { lesson: entry.lesson, rules } : null;
}

export function RuleSheet({
  lessonId,
  open,
  onOpenChange,
  finalFocus,
}: {
  lessonId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  finalFocus: RefObject<HTMLElement | null>;
}) {
  const content = lessonRules(lessonId);
  const accent = getLessonEntry(lessonId)?.domain.accent;
  return (
    <Sheet
      open={open && content !== null}
      onOpenChange={(next) => onOpenChange(next)}
      finalFocus={finalFocus}
      accent={accent}
      title="De regel"
      description={content ? `Uit de les “${content.lesson.title}”` : undefined}
      footer={
        <Button variant="accent" block onClick={() => onOpenChange(false)}>
          Snap ik, verder
        </Button>
      }
    >
      <div className="space-y-9">
        {content?.rules.map((rule, i) => (
          <section key={i} className="space-y-4">
            <h3 className="font-serif text-[1.75rem] leading-tight text-ink">{rule.title}</h3>
            {rule.kind === 'learn' ? (
              <>
                <p className="text-body leading-relaxed text-ink-soft">
                  <RichText text={rule.body} listen />
                </p>
                {rule.example.length > 0 && <Examples examples={rule.example} />}
              </>
            ) : (
              rule.panels.map((panel, k) => (
                <div key={k} className="space-y-3">
                  <p className="text-body leading-relaxed text-ink-soft">
                    <RichText text={panel.text} listen />
                  </p>
                  {panel.rule && <RuleCard text={panel.rule} />}
                  {panel.show && panel.show.length > 0 && <Examples examples={panel.show} />}
                </div>
              ))
            )}
          </section>
        ))}
      </div>
    </Sheet>
  );
}
