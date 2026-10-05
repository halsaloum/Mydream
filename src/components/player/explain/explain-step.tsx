'use client';

import { ArrowLeft, Lightbulb } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import type { Panel } from '@/content/schema';
import { panelWidgets, type PanelWidget } from '@/engine/plan';
import type { ExplainResponse } from '@/engine/responses';
import { cn } from '@/lib/cn';
import { scrollToTop, transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { Button } from '@/components/ui/button';
import { Disclosure } from '@/components/ui/disclosure';
import { RichText } from '@/components/ui/rich-text';
import { Examples, RuleCard, StepHeading, type StepProps } from '../steps/shared';
import { GridWidget, TableauWidget, VowelsWidget } from './sound-widgets';
import { FlipWidget, VowelSpaceWidget } from './space-widgets';
import { SonorityWidget, TreeWidget } from './syllable-widgets';
import { ParadigmWidget } from './paradigm-widget';
import { PhraseWidget } from './phrase-widget';
import { BracketWidget } from './word-widgets';
import { AlphaWidget, BlendWidget, BuildWidget, LabWidget, MarkWidget, SplitWidget, SwapWidget, WheelWidget } from './widgets';

/** Naar een ander uitlegdeel (de voettekst gebruikt dit ook voor "Volgende deel"). */
export function gotoPanel(response: ExplainResponse, panel: number): ExplainResponse {
  return { ...response, panel, reached: Math.max(response.reached, panel) };
}

/**
 * Uitleg in delen. Elk deel: tekst, eventueel de regel, een verdieping, voorbeelden en
 * experimenten. De hoofdknop in de voettekst gaat naar het volgende deel zodra de opdracht
 * van dit deel gedaan is; terug kan altijd.
 */
export function ExplainStep({ step, response, onChange }: StepProps<'explain'>) {
  const calm = useCalmMotion();
  const current = Math.min(response.panel, step.panels.length - 1);
  const panel = step.panels[current]!;
  const total = step.panels.length;

  // Richting van de overgang: afgeleid van de vorige stand (vooruit schuift van rechts).
  const [view, setView] = useState({ panel: current, direction: 1 });
  if (view.panel !== current) setView({ panel: current, direction: current > view.panel ? 1 : -1 });
  const direction = view.direction;

  const goto = (k: number) => {
    if (k === current || k < 0 || k > response.reached) return;
    play('tap');
    onChange(gotoPanel(response, k));
    scrollToTop();
  };

  const solve = (widget: PanelWidget) => {
    const id = `${current}:${widget}`;
    if (response.solved.includes(id)) return;
    onChange({ ...response, solved: [...response.solved, id] });
  };

  return (
    <div>
      <StepHeading className="text-headline">{step.title}</StepHeading>

      {total > 1 && (
        <nav aria-label="Delen van de uitleg" className="mt-4 flex items-center gap-3">
          <ol className="flex items-center gap-1.5">
            {step.panels.map((_, k) => {
              const reachable = k <= response.reached;
              const active = k === current;
              return (
                <li key={k}>
                  <button
                    type="button"
                    disabled={!reachable}
                    aria-current={active ? 'step' : undefined}
                    aria-label={`Deel ${k + 1}${reachable ? '' : ' (nog niet bereikt)'}`}
                    onClick={() => goto(k)}
                    className="group grid h-11 place-items-center px-0.5 outline-none disabled:cursor-default"
                  >
                    <span
                      className={cn(
                        'block h-2.5 rounded-full transition-[width,background-color,opacity] duration-300 ease-[var(--ease-out-expo)] group-focus-visible:outline-3 group-focus-visible:outline-offset-2 group-focus-visible:outline-focus',
                        active ? 'w-8 bg-accent' : reachable ? 'w-2.5 bg-accent opacity-40 group-hover:opacity-70' : 'w-2.5 bg-line',
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ol>
          <span className="text-small font-bold text-ink-muted tabular-nums">
            Deel {current + 1} van {total}
          </span>
        </nav>
      )}

      <div className="relative mt-7">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.section
            key={current}
            aria-label={`Deel ${current + 1}`}
            initial={calm ? { opacity: 0 } : { opacity: 0, x: 26 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={calm ? { opacity: 0 } : { opacity: 0, x: -18 * direction, transition: transition.fast }}
            transition={transition.slow}
          >
            <PanelBody
              panel={panel}
              index={current}
              response={response}
              onLab={(chip) => onChange({ ...response, labs: { ...response.labs, [String(current)]: chip } })}
              onSolved={solve}
            />
          </motion.section>
        </AnimatePresence>
      </div>

      {current > 0 && (
        <Button variant="ghost" size="sm" className="mt-8 -ml-3" onClick={() => goto(current - 1)}>
          <ArrowLeft aria-hidden className="size-4" strokeWidth={2.75} />
          Vorige deel
        </Button>
      )}
    </div>
  );
}

function PanelBody({
  panel,
  index,
  response,
  onLab,
  onSolved,
}: {
  panel: Panel;
  index: number;
  response: ExplainResponse;
  onLab: (chip: number) => void;
  onSolved: (widget: PanelWidget) => void;
}) {
  const solved = (widget: PanelWidget) => response.solved.includes(`${index}:${widget}`);
  const widgets = panelWidgets(panel);
  return (
    <div className="space-y-5">
      <p className="max-w-[62ch] text-[1.3rem] leading-[1.65] text-ink">
        <RichText text={panel.text} listen />
      </p>
      {panel.rule && <RuleCard text={panel.rule} />}
      {panel.deep && (
        <Disclosure summary={panel.deep.q} icon={<Lightbulb aria-hidden className="size-5" strokeWidth={2.4} />}>
          <RichText text={panel.deep.a} listen />
        </Disclosure>
      )}
      {panel.show && panel.show.length > 0 && <Examples examples={panel.show} />}
      {panel.lab && <LabWidget data={panel.lab} chosen={response.labs[String(index)]} onChoose={onLab} />}
      {widgets.map((widget) => {
        const props = { solved: solved(widget), onSolved: () => onSolved(widget) };
        switch (widget) {
          case 'split':
            return panel.split && <SplitWidget key={widget} data={panel.split} {...props} />;
          case 'mark':
            return panel.mark && <MarkWidget key={widget} data={panel.mark} {...props} />;
          case 'build':
            return panel.build && <BuildWidget key={widget} data={panel.build} {...props} />;
          case 'swap':
            return panel.swap && <SwapWidget key={widget} data={panel.swap} {...props} />;
          case 'alpha':
            return panel.alpha && <AlphaWidget key={widget} data={panel.alpha} {...props} />;
          case 'wheel':
            return panel.wheel && <WheelWidget key={widget} data={panel.wheel} {...props} />;
          case 'blend':
            return panel.blend && <BlendWidget key={widget} data={panel.blend} {...props} />;
          case 'vowels':
            return panel.vowels && <VowelsWidget key={widget} data={panel.vowels} {...props} />;
          case 'space':
            return panel.space && <VowelSpaceWidget key={widget} data={panel.space} {...props} />;
          case 'flip':
            return panel.flip && <FlipWidget key={widget} data={panel.flip} {...props} />;
          case 'grid':
            return panel.grid && <GridWidget key={widget} data={panel.grid} {...props} />;
          case 'tableau':
            return panel.tableau && <TableauWidget key={widget} data={panel.tableau} {...props} />;
          case 'sonority':
            return panel.sonority && <SonorityWidget key={widget} data={panel.sonority} {...props} />;
          case 'tree':
            return panel.tree && <TreeWidget key={widget} data={panel.tree} {...props} />;
          case 'bracket':
            return panel.bracket && <BracketWidget key={widget} data={panel.bracket} {...props} />;
          case 'paradigm':
            return panel.paradigm && <ParadigmWidget key={widget} data={panel.paradigm} {...props} />;
          case 'phrase':
            return panel.phrase && <PhraseWidget key={widget} data={panel.phrase} {...props} />;
        }
      })}
    </div>
  );
}
