'use client';

import { useShallow } from 'zustand/react/shallow';
import { pickProgressData, useProgress, type ProgressData } from './progress';
import { useSessions } from './sessions';

/** Voortgang als één stabiel object (alleen opnieuw bij echte wijzigingen). */
export function useProgressData(): ProgressData {
  return useProgress(useShallow(pickProgressData));
}

export function useSessionsById() {
  return useSessions((state) => state.byId);
}
