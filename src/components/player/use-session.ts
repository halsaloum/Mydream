'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { create } from 'zustand';
import type { PlanStep } from '@/engine/plan';
import { createSession, sessionReducer, type Lookup, type SessionAction, type SessionState } from '@/engine/session';
import { isBooted } from '@/lib/boot';
import { lookupStep } from '@/lib/plans';
import { useHydrated } from '@/state/hydration';
import { useSessions } from '@/state/sessions';

/** Wat de player nodig heeft, los van waar de sessie bewaard wordt. */
export type PlayerController = {
  /** `null` zolang de sessie nog geladen of aangemaakt wordt. */
  session: SessionState | null;
  dispatch: (action: SessionAction) => void;
  lookup: Lookup;
  /** Begin opnieuw met een vers plan. */
  restart: () => void;
  /** Ruim de sessie op (na afronden, bij weggaan). */
  discard: () => void;
  /** Telt mee voor voortgang en herhaling. */
  counts: boolean;
};

/**
 * Een les of herhaalronde die bewaard wordt: na verversen gaat hij verder waar je was.
 *
 * Een al afgeronde sessie blijft bij verversen staan (je ziet je resultaat). Open je de les
 * later opnieuw vanuit de app, dan begint een nieuwe ronde.
 */
export function usePersistentSession(id: string, mode: SessionState['mode'], makePlan: () => PlanStep[]): PlayerController {
  const hydrated = useHydrated();
  const stored = useSessions((state) => state.byId[id]);
  const [arrivedInApp] = useState(isBooted);
  const [finishedBefore] = useState(() => useSessions.getState().byId[id]?.finishedAt ?? null);

  const stale = (session: SessionState | undefined) =>
    session !== undefined && arrivedInApp && session.phase === 'done' && session.finishedAt === finishedBefore;

  useEffect(() => {
    if (!hydrated) return;
    const existing = useSessions.getState().byId[id];
    if (existing && !stale(existing)) return;
    const plan = makePlan();
    if (plan.length) useSessions.getState().start(id, mode, plan);
    // Eenmalig na het laden: een sessie die tijdens dit bezoek afloopt, blijft staan.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, id]);

  const dispatch = useCallback((action: SessionAction) => useSessions.getState().dispatch(id, action), [id]);
  const restart = useCallback(() => {
    const plan = makePlan();
    if (plan.length) useSessions.getState().start(id, mode, plan);
  }, [id, mode, makePlan]);
  const discard = useCallback(() => useSessions.getState().discard(id), [id]);

  return {
    session: hydrated && stored && !stale(stored) ? stored : null,
    dispatch,
    lookup: lookupStep,
    restart,
    discard,
    counts: true,
  };
}

/** Losse rondes (voorbeelden): alleen in het geheugen, weg bij verlaten of verversen. */
const useLocalSessions = create<{ byId: Record<string, SessionState> }>(() => ({ byId: {} }));

function setLocal(id: string, session: SessionState | null) {
  useLocalSessions.setState((state) => {
    const byId = { ...state.byId };
    if (session) byId[id] = session;
    else delete byId[id];
    return { byId };
  });
}

/** Een losse ronde die nergens bewaard wordt en niet meetelt (voorbeelden van oefenvormen). */
export function useLocalSession(id: string, plan: readonly PlanStep[]): PlayerController {
  const lookup = useMemo(() => {
    const map = new Map(plan.map((item) => [item.key, item]));
    return (key: string) => map.get(key);
  }, [plan]);
  const session = useLocalSessions((state) => state.byId[id] ?? null);

  const restart = useCallback(() => {
    if (plan.length) setLocal(id, createSession(id, 'lesson', plan, Date.now()));
  }, [id, plan]);

  useEffect(() => {
    restart();
    return () => setLocal(id, null);
  }, [id, restart]);

  const dispatch = useCallback(
    (action: SessionAction) => {
      const current = useLocalSessions.getState().byId[id];
      if (current) setLocal(id, sessionReducer(current, action, lookup));
    },
    [id, lookup],
  );
  const discard = useCallback(() => setLocal(id, null), [id]);

  return { session, dispatch, lookup, restart, discard, counts: false };
}
