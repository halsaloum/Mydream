'use client';

import { CircleDot, Star } from 'lucide-react';
import { useState } from 'react';
import type { StepOf } from '@/content/schema';
import { getWord, headword, THEME_GROUP_LABELS, THEMES, themeWords, type BankWord } from '@/content/words';
import { WordCardView } from '@/components/player/steps/words/word-card';
import { Button } from '@/components/ui/button';
import { Disclosure } from '@/components/ui/disclosure';
import { Sheet } from '@/components/ui/dialog';
import { ProgressBar } from '@/components/ui/progress';
import { addDays, dayKey } from '@/lib/dates';
import { cn } from '@/lib/cn';
import { play } from '@/lib/sound';
import { recallChance, strength, STRENGTH_LABELS, type Card, type Strength } from '@/lib/words/memory';
import { wordTaskStep } from '@/lib/words/steps';
import { useWords } from '@/state/words';

const STRENGTH_STYLE: Record<Strength, string> = {
  nieuw: 'border-line bg-surface text-ink-muted',
  lerend: 'border-yellow-line bg-yellow-soft text-yellow-ink',
  bekend: 'border-blue-line bg-blue-soft text-blue-ink',
  vast: 'border-green-line bg-green-soft text-green-ink',
};

/** Pas na drie dagen waarop je het woord goed ophaalde, telt het als echt geleerd. */
const RELEARN = 3;

const dueFormat = new Intl.DateTimeFormat('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' });

function formatDue(key: string, today: string): string {
  if (key <= today) return 'vandaag';
  if (key === addDays(today, 1)) return 'morgen';
  const [y, m, d] = key.split('-').map(Number);
  return dueFormat.format(new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1));
}

/** Alle woorden van de bank per thema, met hoe goed je ze kent. Tik op een woord voor de kaart. */
export function ThemeLists({ cards, next }: { cards: Record<string, Card>; next: string | null }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [shown, setShown] = useState<string | null>(null);
  const word = shown ? getWord(shown) : undefined;

  const open = (id: string) => {
    play('tap');
    setSelected(id);
    setShown(id);
  };

  return (
    <section aria-labelledby="alle-woorden" className="flex flex-col gap-8">
      <div>
        <h2 id="alle-woorden" className="font-display text-title font-extrabold">
          Alle woorden
        </h2>
        <p className="mt-1 max-w-2xl text-body text-ink-muted">
          Tik op een woord om de kaart te zien. Wil je een thema eerder leren? Kies het, dan komen je volgende nieuwe woorden daaruit.
        </p>
      </div>
      {(['vak', 'algemeen'] as const).map((group) => (
        <div key={group}>
          <h3 className="font-display text-title-sm font-extrabold text-ink">{THEME_GROUP_LABELS[group].title}</h3>
          <p className="mt-0.5 text-small text-ink-muted">{THEME_GROUP_LABELS[group].text}</p>
          <ul className="mt-4 grid gap-3 lg:grid-cols-2">
            {THEMES.filter((theme) => theme.group === group).map((theme) => {
              const words = themeWords(theme.id);
              if (words.length === 0) return null;
              const learned = words.filter((entry) => cards[entry.id]).length;
              return (
                <li key={theme.id} data-accent={theme.accent}>
                  <Disclosure
                    summary={
                      <span className="block">
                        <span className="flex items-baseline justify-between gap-3">
                          <span>{theme.name}</span>
                          <span className="shrink-0 text-small font-bold text-ink-muted tabular-nums">
                            {learned}/{words.length}
                          </span>
                        </span>
                        <ProgressBar className="mt-2" size="sm" value={learned} max={words.length} label={theme.name} valueText={`${learned} van ${words.length} woorden geleerd`} />
                      </span>
                    }
                  >
                    <p className="text-small text-ink-muted">{theme.text}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {words.map((entry) => (
                        <li key={entry.id}>
                          <WordChip word={entry} card={cards[entry.id]} onOpen={() => open(entry.id)} />
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      {next === theme.id ? (
                        <p className="inline-flex items-center gap-1.5 text-small font-bold text-accent-ink">
                          <Star aria-hidden className="size-4" strokeWidth={2.5} />
                          Je volgende nieuwe woorden komen uit dit thema.
                        </p>
                      ) : learned < words.length ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            play('tap');
                            useWords.getState().setNext(theme.id);
                          }}
                        >
                          <Star aria-hidden className="size-4" strokeWidth={2.5} />
                          Leer dit thema als eerste
                        </Button>
                      ) : null}
                    </div>
                  </Disclosure>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <Sheet
        open={selected !== null}
        onOpenChange={(value) => {
          if (!value) setSelected(null);
        }}
        title="Woordkaart"
        description={word ? <WordStatus card={cards[word.id]} /> : undefined}
        accent="teal"
      >
        {word && <WordCardView card={wordTaskStep(word, 'card') as StepOf<'word'>} heading="plain" />}
      </Sheet>
    </section>
  );
}

function WordChip({ word, card, onOpen }: { word: BankWord; card: Card | undefined; onOpen: () => void }) {
  const level = strength(card);
  const good = card ? Math.min(RELEARN, card.reps) : 0;
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'pressable inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-3.5 font-serif text-[1.0625rem] shadow-slab-sm transition-colors hover:border-accent',
        STRENGTH_STYLE[level],
      )}
      aria-label={`${headword(word)}: ${STRENGTH_LABELS[level]}`}
    >
      {headword(word)}
      {card && level !== 'vast' && (
        <span aria-hidden className="flex gap-0.5">
          {Array.from({ length: RELEARN }, (_, i) => (
            <CircleDot key={i} className={cn('size-3', i < good ? 'opacity-100' : 'opacity-30')} strokeWidth={3} />
          ))}
        </span>
      )}
    </button>
  );
}

function WordStatus({ card }: { card: Card | undefined }) {
  const today = dayKey();
  if (!card) return <>Nog niet geleerd. Het komt in een van je volgende rondes.</>;
  const chance = Math.round(recallChance(card, today) * 100);
  const good = Math.min(RELEARN, card.reps);
  return (
    <>
      {STRENGTH_LABELS[strength(card)]} · komt terug {formatDue(card.due, today)} · kans dat je het nu nog weet: {chance}%
      {good < RELEARN ? ` · ${good} van ${RELEARN} herhaaldagen goed` : ''}
    </>
  );
}
