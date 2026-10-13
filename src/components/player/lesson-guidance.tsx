'use client';

import { ListChecks, Target } from 'lucide-react';
import { useId, useState, type RefObject } from 'react';
import type { Accent } from '@/content/accent';
import type { LessonGuidance } from '@/content/schema';
import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/ui/dialog';
import { Disclosure } from '@/components/ui/disclosure';

/** Een leesbaar vertrekpunt, zonder een extra stap vóór de eerste oefening. */
export function LessonIntroduction({ guidance }: { guidance: LessonGuidance }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="mb-5 rounded-card border-2 border-accent-line bg-accent-soft px-5 py-4 sm:px-6">
      <h2 id={id} className="flex items-center gap-2 font-display text-title-sm font-bold text-accent-ink">
        <Target aria-hidden className="size-5 shrink-0" />
        Dit ga je leren
      </h2>
      <p className="mt-2 font-semibold leading-relaxed text-ink">{guidance.goal}</p>
      <p className="mt-2 text-small leading-relaxed text-ink-soft">
        <strong>Je startpunt: </strong>
        {guidance.startingPoint}
      </p>
      <p className="mt-3 text-small text-ink-muted">Loop je vast? De knop Aanpak bovenaan helpt je stap voor stap.</p>
    </section>
  );
}

function Strategy({ steps }: { steps: string[] }) {
  return (
    <ol className="list-decimal space-y-3 pl-5 marker:font-bold marker:text-accent-ink">
      {steps.map((step) => (
        <li key={step} className="pl-1 leading-relaxed text-ink-soft">{step}</li>
      ))}
    </ol>
  );
}

/** De aanpak blijft in elke oefening bereikbaar, met focusherstel naar de opener. */
export function LessonApproachSheet({
  guidance,
  title,
  accent,
  open,
  onOpenChange,
  finalFocus,
}: {
  guidance: LessonGuidance;
  title: string;
  accent: Accent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  finalFocus: RefObject<HTMLElement | null>;
}) {
  return (
    <Sheet
      title="Aanpak voor deze les"
      description={title}
      accent={accent}
      open={open}
      onOpenChange={(next) => onOpenChange(next)}
      finalFocus={finalFocus}
      footer={<Button block variant="accent" onClick={() => onOpenChange(false)}>Terug naar de oefening</Button>}
    >
      <p className="font-semibold leading-relaxed text-ink">{guidance.goal}</p>
      <p className="mt-2 text-small leading-relaxed text-ink-muted">{guidance.startingPoint}</p>
      <h3 className="mt-5 mb-3 font-display text-title-sm font-bold">Stap voor stap</h3>
      <Strategy steps={guidance.strategy} />
      <p className="mt-5 text-small leading-relaxed text-ink-muted">Probeer daarna een opdracht zonder de aanpak erbij. Leg ook uit waarom je antwoord klopt.</p>
    </Sheet>
  );
}

/** Vrijwillige zelfcontrole: een reflectie op zelfstandig kunnen, geen automatisch oordeel. */
export function LessonReflection({ guidance }: { guidance: LessonGuidance }) {
  const id = useId();
  const [checked, setChecked] = useState<string[]>([]);
  const allChecked = guidance.selfCheck.length > 0 && guidance.selfCheck.every((item) => checked.includes(item));

  return (
    <section aria-labelledby={id} className="mt-6 rounded-card border-2 border-line bg-surface p-5 text-left shadow-slab">
      <h2 id={id} className="font-display text-title-sm font-bold text-ink">Kun je het ook zonder hulp?</h2>
      <p className="mt-2 text-small leading-relaxed text-ink-soft">
        Leg elk punt hardop uit of laat het zien met een nieuw voorbeeld. Vink alleen aan wat zonder hints lukt. Twijfel is een nuttig oefenpunt.
      </p>
      <fieldset className="mt-4">
        <legend className="sr-only">Mijn zelfcontrole</legend>
        <div className="space-y-2">
          {guidance.selfCheck.map((item) => (
            <label key={item} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-control border border-line p-3 hover:bg-sunken">
              <input
                type="checkbox"
                checked={checked.includes(item)}
                onChange={(event) => setChecked((current) => event.target.checked ? [...current, item] : current.filter((value) => value !== item))}
                className="mt-0.5 size-5 shrink-0 accent-[var(--accent)]"
              />
              <span className="text-small font-semibold leading-relaxed text-ink">{item}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <p role="status" aria-live="polite" className="mt-4 text-small leading-relaxed text-ink-soft">
        {allChecked
          ? 'Je hebt jezelf gecontroleerd. Probeer het over een paar dagen opnieuw met andere voorbeelden: zo merk je wat blijft hangen.'
          : 'Nog een open punt? Kies er één, bekijk de aanpak en doe de les later opnieuw. Je kunt ook alvast verder naar de volgende les.'}
      </p>
      <p className="mt-2 text-caption text-ink-muted">Dit is je eigen inschatting, geen toetsresultaat. De vinkjes worden niet bewaard.</p>
      <Disclosure className="mt-4" summary="Pak de aanpak er nog eens bij" icon={<ListChecks aria-hidden className="size-5" />}>
        <Strategy steps={guidance.strategy} />
      </Disclosure>
    </section>
  );
}
