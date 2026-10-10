'use client';

import { Slider } from '@base-ui/react/slider';
import { Send } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { Button } from '@/components/ui/button';
import { InlineFeedback, StepIntro, type StepProps } from '../shared';

export function ToneStep({ step, response, onChange, locked }: StepProps<'tone'>) {
  const calm = useCalmMotion();
  const level = step.levels[response.level] ?? step.levels[0];
  const sent = response.sent.includes(response.level);
  const lastSent = response.sent.at(-1);
  const judged = lastSent !== undefined ? step.levels[lastSent] : undefined;

  const setLevel = (next: number) => {
    if (locked) return;
    play('select');
    onChange({ ...response, level: next });
  };

  const send = () => {
    if (locked || sent || !level) return;
    play(level.ok ? 'right' : 'wrong');
    onChange({ ...response, sent: [...response.sent, response.level] });
  };

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-card border-2 border-orange-line bg-orange-soft/55 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-title-sm font-extrabold text-ink">Bericht aan {step.contact.name}</h2>
            <span className="rounded-chip bg-orange px-3 py-1 font-display text-small font-extrabold text-orange-on">toon: {level?.name}</span>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={response.level}
              initial={calm ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={transition.base}
              className="mt-4 min-h-36 rounded-card border-2 border-line bg-surface p-5 font-serif text-[1.45rem] leading-relaxed text-ink"
            >
              {level?.segs.map((seg, i) => (
                <span key={`${seg.t}-${i}`} className={seg.hi ? 'rounded-chip bg-orange-soft px-1.5 text-orange-ink' : undefined}>{seg.t}</span>
              ))}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="rounded-card border-2 border-line bg-sunken p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-slate text-white font-display font-extrabold shadow-[0_3px_0_var(--color-slate-deep)]">{step.contact.initials ?? 'DV'}</span>
            <div>
              <h2 className="font-display text-body font-extrabold text-ink">{step.contact.name}</h2>
              <p className="text-caption font-semibold text-ink-muted">reactie</p>
            </div>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {judged ? (
              <motion.div key={lastSent} initial={calm ? { opacity: 0 } : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={transition.base}>
                <p className="mt-4 rounded-[1.35rem] rounded-bl-sm border-2 border-line bg-surface px-4 py-3 font-serif text-[1.25rem] text-ink">{judged.reply}</p>
                <InlineFeedback className="mt-4" tone={judged.ok ? 'right' : 'wrong'} id={lastSent} reserve={false}>{judged.verdict}</InlineFeedback>
              </motion.div>
            ) : (
              <motion.p key="empty" className="mt-4 rounded-control border-2 border-dashed border-line-strong px-4 py-3 text-small font-semibold text-ink-muted">Past deze toon bij je huisbaas?</motion.p>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="mt-6 rounded-card border-2 border-line bg-surface p-4 sm:p-5" aria-label="Toon kiezen">
        <Slider.Root
          value={response.level}
          min={0}
          max={step.levels.length - 1}
          step={1}
          disabled={locked}
          onValueChange={(next) => setLevel(Array.isArray(next) ? (next[0] ?? 0) : next)}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <Slider.Label className="font-display text-body font-bold text-ink">Toon van los naar plechtig</Slider.Label>
            <Slider.Value className="text-small font-bold text-orange-ink">{() => level?.name ?? ''}</Slider.Value>
          </div>
          <Slider.Control className="flex h-12 touch-none items-center select-none data-[disabled]:opacity-60">
            <Slider.Track className="relative h-4 w-full rounded-full bg-line shadow-[inset_0_2px_0_rgb(16_24_40/0.07)]">
              <Slider.Indicator className="rounded-full bg-orange" />
              <Slider.Thumb aria-label="Toon van los naar plechtig" getAriaValueText={() => level?.name ?? ''} className="size-9 rounded-full border-2 border-orange bg-surface shadow-[0_4px_0_var(--color-orange-deep)] outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus" />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {step.levels.map((item, i) => (
            <button key={item.name} type="button" disabled={locked} aria-pressed={response.level === i} onClick={() => setLevel(i)} className={cn('min-h-11 rounded-control border-2 px-3 font-display text-small font-bold outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus', response.level === i ? 'border-orange bg-orange text-orange-on shadow-[0_3px_0_var(--color-orange-deep)]' : 'border-line bg-surface text-ink-soft hover:border-orange-line')}>{item.name}</button>
          ))}
        </div>
        <Button className="mt-5" variant="accent" size="lg" disabled={locked || sent} onClick={send}>
          <Send aria-hidden className="size-5" /> Verstuur
        </Button>
      </section>
    </div>
  );
}
