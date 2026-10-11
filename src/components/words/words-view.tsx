'use client';

import { ArrowRight, BrainCircuit, CalendarCheck, Check, Flame, Plus, Sparkles, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { getTheme, WORDS } from '@/content/words';
import { PageHeader } from '@/components/shell/app-shell';
import { Button } from '@/components/ui/button';
import { ChipGroup } from '@/components/ui/chip-group';
import { PageSkeleton } from '@/components/ui/empty-state';
import { ProgressBar } from '@/components/ui/progress';
import { addDays, dayKey, minutes, weekdayShort } from '@/lib/dates';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { FOCUS, longestStreak, PER_DAY, retention, wordStreak, type Focus, type WordsData } from '@/lib/words/memory';
import { estimateMinutes } from '@/lib/words/plan';
import { planRound, pruneWords, settleRound, startRound } from '@/lib/words/round';
import { useHydrated } from '@/state/hydration';
import { dueCount, useWordRound, useWords } from '@/state/words';
import { Methods } from './methods';
import { ThemeLists } from './word-list';

const FOCUS_LABELS: Record<Focus, string> = { mix: 'Allebei', vak: 'Alleen leiderschap', algemeen: 'Alleen algemeen' };

/** De tab "Woorden": de ronde van vandaag, je reeks, je instellingen en alle woorden per thema. */
export function WordsView() {
  const hydrated = useHydrated();
  const perDay = useWords((state) => state.perDay);
  const focus = useWords((state) => state.focus);
  const next = useWords((state) => state.next);
  const cards = useWords((state) => state.cards);
  const days = useWords((state) => state.days);
  const current = useWordRound((state) => state.current);

  // Een ronde van gisteren die niet af was, eerst verwerken; woorden die niet meer bestaan opruimen.
  useEffect(() => {
    if (!hydrated) return;
    pruneWords();
    settleRound();
  }, [hydrated]);

  if (!hydrated) return <PageSkeleton blocks={['h-14 w-1/2 max-w-sm', 'h-56', 'h-28', 'h-96']} />;

  const data: WordsData = { perDay, focus, next, cards, days };
  return (
    <div className="flex flex-col gap-section">
      <div>
        <PageHeader
          title="Woorden"
          description="Elke dag nieuwe woorden voor je werk als leider en voor goed Nederlands. Je raadt, haalt ze zelf op en gebruikt ze in je eigen zinnen. Ze komen terug net voordat je ze zou vergeten."
          className="mb-6"
        />
        <TodayCard data={data} current={current} />
      </div>
      <Stats data={data} />
      <Settings perDay={perDay} focus={focus} />
      <ThemeLists cards={cards} next={next} />
      <Methods />
    </div>
  );
}

/* ------------------------------------------------------------------ vandaag */

function TodayCard({ data, current }: { data: WordsData; current: ReturnType<typeof useWordRound.getState>['current'] }) {
  const router = useRouter();
  const today = dayKey();
  const log = data.days[today];
  const open = current && !current.committed && current.day === today ? current : null;
  const done = log?.done ?? false;
  const preview = planRound(data, current, done ? 'extra' : 'today', today);
  const streak = wordStreak(data.days, today);
  const tomorrow = dueCount(data.cards, addDays(today, 1));

  const go = (kind: 'today' | 'extra') => {
    play('tap');
    if (kind === 'extra' || !open) startRound(kind);
    router.push('/woorden/vandaag');
  };

  const themes = preview.themes.map((id) => getTheme(id)?.name).filter((name) => name !== undefined);
  let body: ReactNode;
  let action: ReactNode;
  if (open) {
    const progress = open.session.queue.length ? open.session.pos / open.session.queue.length : 0;
    body = (
      <>
        <h2 className="font-display text-title font-extrabold text-ink">{open.round === 0 ? 'Je bent bezig met vandaag' : 'Je bent bezig met een extra ronde'}</h2>
        <p className="mt-1 text-body text-ink-soft">
          Opdracht {Math.min(open.session.pos + 1, open.session.queue.length)} van {open.session.queue.length}. Je voortgang is bewaard.
        </p>
        <ProgressBar className="mt-4 max-w-md" value={progress * 100} label="Voortgang in de ronde" />
      </>
    );
    action = (
      <Button variant="accent" size="lg" onClick={() => go('today')}>
        Ga verder
        <ArrowRight aria-hidden className="size-5" strokeWidth={2.75} />
      </Button>
    );
  } else if (done) {
    body = (
      <>
        <h2 className="flex items-center gap-2 font-display text-title font-extrabold text-ink">
          <span className="grid size-8 place-items-center rounded-full bg-green text-green-on">
            <Check aria-hidden className="size-5" strokeWidth={3} />
          </span>
          Klaar voor vandaag
        </h2>
        <p className="mt-2 max-w-xl text-body text-ink-soft">
          {log?.added.length ? `Je leerde vandaag ${log.added.length} ${log.added.length === 1 ? 'nieuw woord' : 'nieuwe woorden'}` : 'Je herhaalde je woorden'}
          {log?.reviewed.length ? ` en herhaalde je er ${log.reviewed.length}.` : '.'}{' '}
          {tomorrow > 0 ? `Morgen ${tomorrow === 1 ? 'komt 1 woord' : `komen ${tomorrow} woorden`} terug.` : 'Morgen komen er weer nieuwe woorden.'}
        </p>
      </>
    );
    action =
      preview.newIds.length > 0 ? (
        <Button variant="secondary" size="lg" onClick={() => go('extra')}>
          <Plus aria-hidden className="size-5" strokeWidth={2.75} />
          Nog {preview.newIds.length} nieuwe woorden
        </Button>
      ) : null;
  } else if (preview.plan.length === 0) {
    body = (
      <>
        <h2 className="font-display text-title font-extrabold text-ink">Alle woorden geleerd</h2>
        <p className="mt-1 text-body text-ink-soft">Er staan nu geen herhalingen klaar. Je woorden komen vanzelf terug wanneer het tijd is.</p>
      </>
    );
    action = null;
  } else {
    const fresh = preview.newIds.length;
    const reviews = preview.reviewIds.length;
    body = (
      <>
        <h2 className="font-display text-title font-extrabold text-ink">Vandaag</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {fresh > 0 && <Pill icon={<Sparkles aria-hidden className="size-4" strokeWidth={2.5} />}>{fresh === 1 ? '1 nieuw woord' : `${fresh} nieuwe woorden`}</Pill>}
          {reviews > 0 && <Pill icon={<BrainCircuit aria-hidden className="size-4" strokeWidth={2.5} />}>{reviews === 1 ? '1 herhaling' : `${reviews} herhalingen`}</Pill>}
          <Pill>ongeveer {estimateMinutes(preview.plan)} min</Pill>
        </ul>
        {themes.length > 0 && <p className="mt-3 text-body text-ink-soft">Thema&apos;s van vandaag: {themes.join(' en ')}.</p>}
      </>
    );
    action = (
      <Button variant="accent" size="lg" onClick={() => go('today')}>
        {log?.added.length || log?.reviewed.length ? 'Maak vandaag af' : 'Begin'}
        <ArrowRight aria-hidden className="size-5" strokeWidth={2.75} />
      </Button>
    );
  }

  return (
    <section
      data-accent="teal"
      aria-label="Woorden van vandaag"
      className="grid gap-6 rounded-sheet border-2 border-accent-line bg-linear-to-br from-accent-soft via-surface to-surface p-5 shadow-slab sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
    >
      <div className="min-w-0">
        {body}
        {action && <div className="mt-6">{action}</div>}
      </div>
      <WeekStrip days={data.days} today={today} streak={streak} />
    </section>
  );
}

function Pill({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <li className="inline-flex min-h-9 items-center gap-1.5 rounded-full border-2 border-accent-line bg-surface px-3 text-small font-bold text-accent-ink">
      {icon}
      {children}
    </li>
  );
}

/** De laatste zeven dagen: op welke dagen je de ronde afmaakte. */
function WeekStrip({ days, today, streak }: { days: WordsData['days']; today: string; streak: number }) {
  const calm = useCalmMotion();
  const keys = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  return (
    <div className="rounded-card border-2 border-line bg-surface p-4 shadow-slab-sm">
      <p className={cn('flex items-center gap-1.5 font-display text-title-sm font-extrabold', streak > 0 ? 'text-orange-ink' : 'text-ink-muted')}>
        <Flame aria-hidden className="size-5" strokeWidth={2.5} />
        {streak === 1 ? '1 dag op rij' : `${streak} dagen op rij`}
      </p>
      <ol aria-label="Afgelopen week" className="mt-3 flex gap-1.5">
        {keys.map((key, i) => {
          const done = days[key]?.done ?? false;
          return (
            <li key={key} className="flex flex-col items-center gap-1">
              <motion.span
                initial={calm ? false : { scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...transition.base, delay: calm ? 0 : i * 0.04 }}
                className={cn(
                  'grid size-8 place-items-center rounded-full border-2',
                  done ? 'border-orange bg-orange text-orange-on' : 'border-line bg-sunken text-ink-muted',
                  key === today && !done && 'border-dashed border-orange-line',
                )}
              >
                {done ? <Check aria-hidden className="size-4" strokeWidth={3.25} /> : null}
                <span className="sr-only">{`${key}: ${done ? 'gedaan' : 'niet gedaan'}`}</span>
              </motion.span>
              <span aria-hidden className={cn('text-[0.6875rem] font-bold', key === today ? 'text-ink' : 'text-ink-muted')}>
                {key === today ? 'nu' : weekdayShort(key)}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ cijfers */

function Stats({ data }: { data: WordsData }) {
  const learned = Object.keys(data.cards).length;
  const solid = Object.values(data.cards).filter((card) => card.s >= 7).length;
  const kept = retention(data.days);
  const totalMs = Object.values(data.days).reduce((sum, day) => sum + day.ms, 0);
  return (
    <dl className="stagger grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Stat icon={<Sparkles aria-hidden className="size-4" strokeWidth={2.5} />} label="Woorden geleerd" note={`van de ${WORDS.length}`}>
        {learned}
      </Stat>
      <Stat icon={<CalendarCheck aria-hidden className="size-4" strokeWidth={2.5} />} label="Zitten goed" note="een week of langer">
        {solid}
      </Stat>
      <Stat
        icon={<Target aria-hidden className="size-4" strokeWidth={2.5} />}
        label="Onthouden bij herhaling"
        note={kept.reviewed ? `${kept.kept} van ${kept.reviewed}, laatste 30 dagen` : 'na je eerste herhaling'}
      >
        {kept.reviewed ? `${Math.round((kept.kept / kept.reviewed) * 100)}%` : '–'}
      </Stat>
      <Stat icon={<Flame aria-hidden className="size-4" strokeWidth={2.5} />} label="Langste reeks" note={`${Math.max(0, minutes(totalMs))} min geoefend`}>
        {longestStreak(data.days)}
      </Stat>
    </dl>
  );
}

function Stat({ icon, label, note, children }: { icon: ReactNode; label: string; note: string; children: ReactNode }) {
  return (
    <div className="rounded-card border-2 border-line bg-surface px-5 py-4 shadow-slab-sm" data-accent="teal">
      <dt className="flex items-center gap-1.5 text-small font-bold text-ink-muted">
        <span className="text-accent-ink">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1.5 font-display text-headline leading-none font-extrabold text-ink tabular-nums">{children}</dd>
      <dd className="mt-1.5 text-caption font-semibold text-ink-muted">{note}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------ instellingen */

function Settings({ perDay, focus }: { perDay: number; focus: Focus }) {
  return (
    <section aria-labelledby="woorden-instellingen" className="rounded-card border-2 border-line bg-surface p-5 shadow-slab sm:p-6">
      <h2 id="woorden-instellingen" className="font-display text-title-sm font-extrabold">
        Jouw ronde
      </h2>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-small font-bold text-ink">Nieuwe woorden per dag</p>
          <ChipGroup
            label="Nieuwe woorden per dag"
            required
            value={[String(perDay)]}
            onChange={(value) => {
              const n = Number(value[0]);
              if (Number.isInteger(n)) useWords.getState().setPerDay(n);
            }}
            chips={PER_DAY.map((n) => ({ value: String(n), label: String(n) }))}
          />
          <p className="mt-2 text-caption font-semibold text-ink-muted">
            Elk nieuw woord komt de eerste weken een paar keer terug. Na een paar weken heb je daardoor per dag ongeveer drie keer zoveel herhalingen als nieuwe woorden.
          </p>
        </div>
        <div>
          <p className="mb-2 text-small font-bold text-ink">Welke woorden</p>
          <ChipGroup
            label="Welke woorden"
            required
            value={[focus]}
            onChange={(value) => {
              const next = value[0] as Focus | undefined;
              if (next && (FOCUS as readonly string[]).includes(next)) useWords.getState().setFocus(next);
            }}
            chips={FOCUS.map((value) => ({ value, label: FOCUS_LABELS[value] }))}
          />
          <p className="mt-2 text-caption font-semibold text-ink-muted">Bij allebei is ongeveer 60% van je nieuwe woorden leiderschap en 40% algemeen Nederlands.</p>
        </div>
      </div>
    </section>
  );
}
