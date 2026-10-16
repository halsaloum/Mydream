'use client';

import { useCallback } from 'react';
import { getWord } from '@/content/words';
import { createSession, sessionReducer, type SessionAction } from '@/engine/session';
import type { PlayerController } from '@/components/player/use-session';
import { dayKey } from '@/lib/dates';
import { useHydrated } from '@/state/hydration';
import { useProgress } from '@/state/progress';
import { pickWordsData, useWordRound, useWords, type StoredRound } from '@/state/words';
import type { WordsData } from './memory';
import { buildRound, commitRound, roundUsable, sessionBets, type WordRound } from './plan';
import { lookupWordStep } from './steps';

/**
 * Rondes maken, spelen en verwerken. Alleen de woordpagina's laden deze module (en daarmee de
 * woordenbank).
 */

function commit(round: StoredRound) {
  const data = pickWordsData(useWords.getState());
  useWords.setState(commitRound(data, round, round.session, sessionBets(round.session)));
  useWordRound.setState({ current: { ...round, committed: true } });
}

/** Woorden die niet meer in de bank staan, gaan uit je gegevens. */
export function pruneWords() {
  const { cards } = useWords.getState();
  const kept = Object.fromEntries(Object.entries(cards).filter(([id]) => getWord(id)));
  if (Object.keys(kept).length !== Object.keys(cards).length) useWords.setState({ cards: kept });
}

/**
 * Ruim de opgeslagen ronde op: een ronde van een eerdere dag die niet af is, wordt verwerkt voor
 * zover je kwam; een ronde waarvan stappen niet meer bestaan (nieuwe inhoud), ook.
 */
export function settleRound(now = Date.now()) {
  const current = useWordRound.getState().current;
  if (!current) return;
  const usable = roundUsable(current.session);
  if (current.committed) {
    if (!usable) useWordRound.setState({ current: null });
    return;
  }
  if (current.day !== dayKey(now) || !usable || current.session.phase === 'done') commit(current);
  if (!usable) useWordRound.setState({ current: null });
}

/** De lopende ronde van vandaag, als die er is en nog niet af is. */
export function openRound(now = Date.now()): StoredRound | null {
  const current = useWordRound.getState().current;
  return current && !current.committed && current.day === dayKey(now) ? current : null;
}

/**
 * Wat een nieuwe ronde zou bevatten, zonder hem te starten. De ronde van de dag vult aan tot je
 * aantal per dag (wat je vandaag al leerde, telt mee); een extra ronde heeft weer een volle portie.
 */
export function planRound(data: WordsData, current: StoredRound | null, kind: 'today' | 'extra', today: string): WordRound {
  const log = data.days[today];
  const main = kind === 'today' && !log?.done;
  const count = main ? Math.max(0, data.perDay - (log?.added.length ?? 0)) : data.perDay;
  const round = main ? 0 : current?.day === today ? current.round + 1 : 1;
  return buildRound({ ...data, perDay: count }, today, round);
}

export function previewRound(kind: 'today' | 'extra', now = Date.now()): WordRound {
  return planRound(pickWordsData(useWords.getState()), useWordRound.getState().current, kind, dayKey(now));
}

/**
 * Start de ronde van vandaag (of ga verder met de lopende), of een extra ronde met nieuwe woorden.
 * Geeft `null` als er niets te doen is.
 */
export function startRound(kind: 'today' | 'extra', now = Date.now()): StoredRound | null {
  settleRound(now);
  const open = openRound(now);
  if (open && kind === 'today') return open;
  if (open) commit(open);
  // Is vandaag al af, dan begint "vandaag" geen extra ronde vanzelf: daar kies je zelf voor.
  if (kind === 'today' && useWords.getState().days[dayKey(now)]?.done) return null;
  const plan = previewRound(kind, now);
  if (plan.plan.length === 0) return null;
  const stored: StoredRound = {
    day: plan.day,
    round: plan.round,
    newIds: plan.newIds,
    reviewIds: plan.reviewIds,
    themes: plan.themes,
    session: createSession(`woorden:${plan.day}:${plan.round}`, 'lesson', plan.plan, now),
    committed: false,
  };
  useWordRound.setState({ current: stored });
  return stored;
}

export function dispatchRound(action: SessionAction) {
  const before = useWordRound.getState().current;
  if (!before || before.committed) return;
  const session = sessionReducer(before.session, action, lookupWordStep);
  if (session === before.session) return;
  useProgress.getState().addActiveTime(session.activeMs - before.session.activeMs);
  const next: StoredRound = { ...before, session };
  if (session.phase === 'done') {
    commit({ ...next, session: sessionReducer(session, { type: 'commit' }, lookupWordStep) });
    return;
  }
  useWordRound.setState({ current: next });
}

/** De lesplayer speelt de ronde zoals elke les; deze controller koppelt hem aan de woordgegevens. */
export function useWordController(): PlayerController {
  const hydrated = useHydrated();
  const current = useWordRound((state) => state.current);
  const dispatch = useCallback((action: SessionAction) => dispatchRound(action), []);
  const restart = useCallback(() => {
    startRound('extra');
  }, []);
  const discard = useCallback(() => {}, []);
  const usable = current !== null && roundUsable(current.session);
  return {
    session: hydrated && current && usable ? current.session : null,
    dispatch,
    lookup: lookupWordStep,
    restart,
    discard,
    counts: true,
  };
}
