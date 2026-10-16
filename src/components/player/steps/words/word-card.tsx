'use client';

import { ArrowLeftRight, Check, Lightbulb, MessageCircleQuestion, Mic, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import { createContext, use, type ReactNode } from 'react';
import type { StepOf } from '@/content/schema';
import { RichText } from '@/components/ui/rich-text';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { speak, speakableExample, useCanSpeak } from '@/lib/speech';
import { plainText } from '@/content/text';
import { StepHeading, type StepProps } from '../shared';

type Card = StepOf<'word'>;

const headword = (card: Pick<Card, 'word' | 'article'>) => (card.article ? `${card.article} ${card.word}` : card.word);

function Listen({ text, label, className }: { text: string; label: string; className?: string }) {
  const canSpeak = useCanSpeak();
  const spoken = speakableExample(text, { sentence: true });
  if (!canSpeak || spoken === null) return null;
  return (
    <button
      type="button"
      onClick={() => speak(spoken)}
      aria-label={label}
      className={cn(
        'grid size-9 shrink-0 place-items-center rounded-full text-ink-muted transition-colors duration-150 outline-none hover:bg-sunken hover:text-accent-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
        className,
      )}
    >
      <Volume2 aria-hidden className="size-[1.1rem]" strokeWidth={2.5} />
    </button>
  );
}

/** Kopniveau van de onderdelen: onder de stapkop (h1) een h2, onder het woord in een venster (h3) een h4. */
const SectionLevel = createContext<'h2' | 'h4'>('h2');

function Section({ title, icon, children, className }: { title: string; icon?: ReactNode; children: ReactNode; className?: string }) {
  const level = use(SectionLevel);
  const heading = (
    <>
      {icon}
      {title}
    </>
  );
  const headingClass = 'flex items-center gap-1.5 text-caption font-extrabold tracking-[0.08em] text-ink-muted uppercase';
  return (
    <section className={className}>
      {level === 'h4' ? <h4 className={headingClass}>{heading}</h4> : <h2 className={headingClass}>{heading}</h2>}
      <div className="mt-2">{children}</div>
    </section>
  );
}

function Chips({ items, tone = 'plain' }: { items: readonly string[]; tone?: 'plain' | 'accent' }) {
  const canSpeak = useCanSpeak();
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => {
        const spoken = canSpeak ? speakableExample(item.replace(/…/g, '').trim(), { sentence: true }) : null;
        const chip = cn(
          'inline-flex min-h-9 items-center gap-1.5 rounded-full border-2 px-3 font-serif text-[1.0625rem] leading-tight',
          tone === 'accent' ? 'border-accent-line bg-accent-soft text-accent-ink' : 'border-line bg-surface text-ink',
        );
        return (
          <li key={item}>
            {spoken ? (
              <button type="button" onClick={() => speak(spoken)} className={cn(chip, 'transition-colors hover:border-accent')} aria-label={`${item}, tik om te horen`}>
                {item}
                <Volume2 aria-hidden className="size-3.5 opacity-60" strokeWidth={2.75} />
              </button>
            ) : (
              <span className={chip}>{item}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

const TITLE = 'font-serif text-example-lg leading-[1.1] font-semibold tracking-[-0.02em] text-ink';

/** In de les de kop van de stap (krijgt focus), elders een gewone kop. */
function CardTitle({ step, children }: { step: boolean; children: ReactNode }) {
  if (step) return <StepHeading className={TITLE}>{children}</StepHeading>;
  return <h3 className={TITLE}>{children}</h3>;
}

/**
 * De woordkaart: alles wat je over één woord moet weten om het te kunnen gebruiken. Ook los te
 * gebruiken (in de woordenlijst, onder de titel van het venster), dan met `heading="plain"`.
 */
export function WordCardView({
  card,
  heading = 'step',
  said = false,
  onSay,
}: {
  card: Card;
  heading?: 'step' | 'plain';
  said?: boolean;
  onSay?: () => void;
}) {
  const calm = useCalmMotion();
  const canSpeak = useCanSpeak();
  const word = headword(card);

  return (
    <SectionLevel value={heading === 'step' ? 'h2' : 'h4'}>
      <div lang="nl">
        <div className="flex flex-wrap items-center gap-2 text-caption font-bold">
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent-ink">{card.theme}</span>
          <span className="rounded-full border-2 border-line px-2.5 py-0.5 text-ink-muted">{card.level}</span>
          {card.register && <span className="rounded-full border-2 border-line px-2.5 py-0.5 text-ink-muted">{card.register}</span>}
        </div>

        <div className="mt-4 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle step={heading === 'step'}>
              {card.article && <span className="font-medium text-ink-muted">{card.article} </span>}
              {card.word}
            </CardTitle>
            <p className="mt-2 text-small font-semibold text-ink-muted">
              {card.pos}
              {card.grammar && <span className="text-ink-soft"> · {card.grammar}</span>}
            </p>
          </div>
          <Listen text={word} label={`Luister naar ${word}`} className="mt-2 size-11 border-2 border-line bg-surface shadow-slab-sm" />
        </div>

        <div className="mt-6 rounded-card border-2 border-accent-line bg-linear-to-br from-accent-soft to-surface p-4 shadow-[0_4px_0_var(--accent-line)] sm:p-5">
          <p className="text-caption font-extrabold tracking-[0.08em] text-accent-ink uppercase">Betekenis</p>
          <p className="mt-1 font-display text-lead leading-snug font-bold text-ink">{card.meaning}</p>
        </div>

        <Section title="Zo gebruik je het" className="mt-7">
          <ul className="space-y-2">
            {card.examples.map((example) => (
              <li key={example} className="flex items-center gap-2 rounded-tile border-2 border-line bg-surface py-2 pr-2 pl-4">
                <p className="min-w-0 flex-1 font-serif text-[1.1875rem] leading-snug text-ink">
                  <RichText text={example} />
                </p>
                <Listen text={plainText(example)} label="Luister naar de zin" />
              </li>
            ))}
          </ul>
        </Section>

        {card.collocations.length > 0 && (
          <Section title="Vaste combinaties" className="mt-6">
            <Chips items={card.collocations} tone="accent" />
          </Section>
        )}

        {Boolean(card.family?.length || card.synonyms?.length || card.opposites?.length) && (
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {card.family?.length ? (
              <Section title="Familie">
                <Chips items={card.family} />
              </Section>
            ) : null}
            {card.synonyms?.length ? (
              <Section title="Lijkt op">
                <Chips items={card.synonyms} />
              </Section>
            ) : null}
            {card.opposites?.length ? (
              <Section title="Tegenover">
                <Chips items={card.opposites} />
              </Section>
            ) : null}
          </div>
        )}

        {card.contrast && (
          <div className="mt-6 flex gap-3 rounded-card border-2 border-orange-line bg-orange-soft p-4">
            <ArrowLeftRight aria-hidden className="mt-0.5 size-5 shrink-0 text-orange-ink" strokeWidth={2.5} />
            <p className="text-small leading-relaxed text-ink">
              <strong className="font-display font-extrabold text-orange-ink">Niet verwarren met {card.contrast.word}. </strong>
              {card.contrast.note}
            </p>
          </div>
        )}

        {card.tip && (
          <div className="mt-3 flex gap-3 rounded-card border-2 border-yellow-line bg-yellow-soft p-4">
            <Lightbulb aria-hidden className="mt-0.5 size-5 shrink-0 text-yellow-ink" strokeWidth={2.5} />
            <p className="text-small leading-relaxed text-ink">{card.tip}</p>
          </div>
        )}

        {card.think && (
          <div className="mt-3 flex gap-3 rounded-card border-2 border-dashed border-line-strong bg-sunken p-4">
            <MessageCircleQuestion aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-ink" strokeWidth={2.5} />
            <p className="text-small leading-relaxed text-ink">
              <strong className="font-display font-extrabold">Denk even na. </strong>
              {card.think}
            </p>
          </div>
        )}

        {onSay && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                play('tap');
                if (canSpeak) speak(word);
                onSay();
              }}
              className={cn(
                'slab pressable inline-flex min-h-12 items-center gap-2 rounded-control border-2 px-4 font-display text-body font-bold',
                said ? 'border-green bg-green-soft text-green-ink [--slab:var(--color-green)]' : 'border-line bg-surface text-ink',
              )}
              aria-pressed={said}
            >
              {said ? <Check aria-hidden className="size-5" strokeWidth={3} /> : <Mic aria-hidden className="size-5" strokeWidth={2.5} />}
              {said ? 'Hardop oefenen bevestigd' : 'Ik heb het hardop geoefend'}
            </button>
            <motion.p
              key={String(said)}
              initial={calm ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition.base}
              className="max-w-[40ch] text-caption font-semibold text-ink-muted"
            >
              {said ? 'Je hebt het hardop geoefend. Probeer het later ook zonder de kaart op te halen.' : `Zeg ‘${word}’ en een van de zinnen hardop. Dit kan helpen bij het onthouden; gebruik de voorbeelden ook om uitspraak en betekenis te oefenen.`}
            </motion.p>
          </div>
        )}
      </div>
    </SectionLevel>
  );
}

export function WordStep({ step, response, onChange, locked }: StepProps<'word'>) {
  return <WordCardView card={step} said={response.said} onSay={locked ? undefined : () => onChange({ kind: 'word', said: true })} />;
}
