'use client';

import { ArrowLeft } from 'lucide-react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { PimSays } from '@/components/brand/pim';
import { Button } from '@/components/ui/button';
import { PageSkeleton } from '@/components/ui/empty-state';
import { OptionGroup } from '@/components/ui/option-group';
import { ProgressBar } from '@/components/ui/progress';
import { transition } from '@/lib/motion';
import { play } from '@/lib/sound';
import { useHydrated } from '@/state/hydration';
import { FOCUS_OPTIONS, GOAL_OPTIONS, START_OPTIONS, useSettings, type Profile } from '@/state/settings';
import { ONBOARDING_STEPS, type OnboardingSlug } from './steps';


type StepDef = {
  say: string;
  options: { value: string; label: string; hint: string }[];
  read: (profile: Profile) => string | null;
  write: (value: string) => Partial<Profile>;
};

const STEPS: Record<OnboardingSlug, StepDef> = {
  focus: {
    say: 'Hoi! Ik ben Pim. Wat wil je het liefst beheersen?',
    options: FOCUS_OPTIONS.map((option) => ({ value: option.id, label: option.label, hint: option.hint })),
    read: (profile) => profile.focus,
    write: (value) => ({ focus: value as Profile['focus'] }),
  },
  tempo: {
    say: 'Wat is je dagelijkse schrijfdoel?',
    options: GOAL_OPTIONS.map((option) => ({ value: String(option.minutes), label: option.label, hint: option.hint })),
    read: (profile) => (profile.goalMinutes ? String(profile.goalMinutes) : null),
    write: (value) => ({ goalMinutes: Number(value) as Profile['goalMinutes'] }),
  },
  start: {
    say: 'Ik loop met je mee. Waar zullen we beginnen?',
    options: START_OPTIONS.map((option) => ({ value: option.id, label: option.label, hint: option.hint })),
    read: (profile) => profile.start,
    write: (value) => ({ start: value as Profile['start'] }),
  },
};

/** Hoeveel stappen er binnen de app vooruit zijn gezet; dan is "terug" een echte stap terug in de geschiedenis. */
let forwardDepth = 0;
let lastIndex = 0;

export function OnboardingStep({ slug }: { slug: OnboardingSlug }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const profile = useSettings((state) => state.profile);
  const setProfile = useSettings((state) => state.setProfile);
  const completeOnboarding = useSettings((state) => state.completeOnboarding);
  const index = ONBOARDING_STEPS.indexOf(slug);
  const step = STEPS[slug];
  const value = step.read(profile);
  const [nav, setNav] = useState(() => ({ index, direction: index >= lastIndex ? 1 : -1 }));
  if (nav.index !== index) setNav({ index, direction: index > nav.index ? 1 : -1 });
  const direction = nav.direction;
  const headingId = `welkom-${slug}`;

  useEffect(() => {
    lastIndex = index;
  }, [index]);

  const goBack = () => {
    play('tap');
    if (index === 0) {
      router.push('/');
      return;
    }
    if (forwardDepth > 0) {
      forwardDepth -= 1;
      router.back();
    } else {
      router.replace(`/welkom/${ONBOARDING_STEPS[index - 1]}` as Route);
    }
  };

  const goNext = () => {
    if (!value) return;
    play('select');
    const missing = ONBOARDING_STEPS.find((s) => !STEPS[s].read(profile));
    if (index === ONBOARDING_STEPS.length - 1) {
      if (missing) {
        router.push(`/welkom/${missing}` as Route);
        return;
      }
      completeOnboarding();
      forwardDepth = 0;
      router.replace('/');
      return;
    }
    forwardDepth += 1;
    router.push(`/welkom/${ONBOARDING_STEPS[index + 1]}` as Route);
  };

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-2xl px-gutter py-16">
        <PageSkeleton blocks={['h-4', 'h-24 w-3/4', 'h-16', 'h-16', 'h-16']} />
      </div>
    );
  }

  const last = index === ONBOARDING_STEPS.length - 1;
  const canGoBack = index > 0 || Boolean(profile.completedAt);

  return (
    <div className="flex min-h-dvh flex-col" data-accent="blue">
      <header className="mx-auto flex w-full max-w-2xl items-center gap-3 px-gutter pt-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          aria-label={index === 0 ? 'Terug naar de startpagina' : 'Vorige vraag'}
          className={canGoBack ? 'w-11 px-0' : 'invisible w-11 px-0'}
          disabled={!canGoBack}
        >
          <ArrowLeft aria-hidden className="size-5" strokeWidth={2.75} />
        </Button>
        <div className="flex-1" data-accent="green">
          <ProgressBar value={index + (value ? 1 : 0.5)} max={ONBOARDING_STEPS.length} label="Kennismaking" valueText={`Vraag ${index + 1} van ${ONBOARDING_STEPS.length}`} />
        </div>
        <span className="w-11 text-right text-small font-bold text-ink-muted tabular-nums">
          {index + 1}/{ONBOARDING_STEPS.length}
        </span>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 overflow-x-clip px-gutter pt-10 pb-12">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={slug}
            custom={direction}
            initial={{ opacity: 0, x: 28 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 * direction, transition: transition.fast }}
            transition={transition.slow}
          >
            <PimSays mood={value ? 'happy' : 'idle'} reactKey={slug}>
              <h1 id={headingId} className="font-display text-title-sm font-bold text-ink">
                {step.say}
              </h1>
            </PimSays>
            <OptionGroup
              aria-labelledby={headingId}
              value={value}
              onChange={(next) => {
                play('tap');
                setProfile(step.write(next));
              }}
              options={step.options}
              className="mt-10"
            />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="sticky bottom-0 border-t-2 border-line bg-surface pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-gutter py-4">
          <p className="hidden text-small text-ink-muted sm:block">Je kunt dit later aanpassen bij Instellingen.</p>
          <Button size="lg" variant="primary" disabled={!value} onClick={goNext} className="min-w-[12rem] max-sm:w-full">
            {last ? 'Klaar, laten we beginnen' : 'Doorgaan'}
          </Button>
        </div>
      </footer>
    </div>
  );
}
