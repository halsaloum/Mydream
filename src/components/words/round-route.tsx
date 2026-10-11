'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { getTheme, getWord, headword } from '@/content/words';
import { LessonPlayer, type PlayerMeta } from '@/components/player/lesson-player';
import { ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { dayKey } from '@/lib/dates';
import { pruneWords, settleRound, startRound, useWordController } from '@/lib/words/round';
import { useHydrated } from '@/state/hydration';
import { useWordRound } from '@/state/words';

/**
 * De ronde van de tab "Woorden" in de lesplayer. Open je deze pagina zonder lopende ronde (een
 * bladwijzer, of de dag erna), dan begint de ronde van vandaag vanzelf.
 */
export function WordRoundRoute() {
  const hydrated = useHydrated();
  const router = useRouter();
  const current = useWordRound((state) => state.current);
  const checked = useWordRound((state) => state.checked);
  const base = useWordController();
  const today = dayKey();

  useEffect(() => {
    if (!hydrated) return;
    pruneWords();
    settleRound();
    const now = useWordRound.getState().current;
    if (!now || now.day !== dayKey()) startRound('today');
    useWordRound.setState({ checked: dayKey() });
  }, [hydrated]);

  const restart = useCallback(() => {
    if (!startRound('extra')) router.push('/woorden');
  }, [router]);

  if (hydrated && checked === today && (!current || current.day !== today)) {
    return (
      <main id="inhoud" className="mx-auto grid min-h-dvh w-full max-w-xl place-items-center px-gutter">
        <EmptyState
          title="Niets meer voor vandaag"
          mood="happy"
          action={
            <ButtonLink href="/woorden" size="lg">
              Naar je woorden
            </ButtonLink>
          }
        >
          Er staan geen herhalingen klaar en er zijn geen nieuwe woorden meer om te leren. Morgen komen je woorden terug.
        </EmptyState>
      </main>
    );
  }

  const fresh = (current?.newIds ?? []).map(getWord).filter((word) => word !== undefined);
  const themes = (current?.themes ?? []).map((id) => getTheme(id)?.name).filter((name) => name !== undefined);
  const extra = (current?.round ?? 0) > 0;
  const reviews = current?.reviewIds.length ?? 0;
  const summary = [fresh.length && `${fresh.length} ${fresh.length === 1 ? 'nieuw woord' : 'nieuwe woorden'}`, reviews && `${reviews} herhaald`].filter(Boolean).join(' · ');

  const meta: PlayerMeta = {
    mode: 'words',
    title: extra ? 'Extra woorden' : 'Woorden van vandaag',
    context: themes.length ? themes.slice(0, 2).join(' en ') : 'Herhalen',
    accent: 'teal',
    exit: { href: '/woorden', label: 'Ronde sluiten (je voortgang is bewaard)' },
    finish: {
      title: extra ? 'Extra ronde klaar' : 'Woorden van vandaag klaar',
      ...(summary ? { context: summary } : {}),
      learned: fresh.map((word) => headword(word)),
      primary: { label: 'Naar je woorden', href: '/woorden' },
      secondary: { label: 'Naar Leren', href: '/' },
    },
  };

  return <LessonPlayer key={current ? `${current.day}:${current.round}` : 'laden'} controller={{ ...base, restart }} meta={meta} />;
}
