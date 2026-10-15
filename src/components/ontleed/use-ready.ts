'use client';
import { useEffect, useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { EMPTY_ONTLEED, ONTLEED_KEY, useOntleed } from '@/state/ontleed';

const useReady = create<{ ready: boolean }>(() => ({ ready: false }));
let hydration: Promise<void> | null = null;
function hydrate(): Promise<void> {
  hydration ??= Promise.resolve().then(() => useOntleed.persist.rehydrate()).catch(() => undefined).then(() => {
    useReady.setState({ ready: true });
  }).finally(() => { hydration = null; });
  return hydration;
}
export function useOntleedReady() {
  const ready = useReady(state => state.ready);
  useEffect(() => {
    void hydrate();
    const sync = (event: StorageEvent) => {
      if (event.key !== ONTLEED_KEY && event.key !== null) return;
      if (event.key === null || event.newValue === null) {
        useOntleed.getState().replace(EMPTY_ONTLEED);
      } else {
        void hydrate();
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  return ready;
}

// A cached external snapshot keeps Date.now out of render and updates an open review page as checks become due.
let clock = 0;
let timer: number | null = null;
const clockListeners = new Set<() => void>();
const updateClock = () => {
  clock = Date.now();
  clockListeners.forEach(listener => listener());
};
function subscribeClock(listener: () => void) {
  clockListeners.add(listener);
  if (clockListeners.size === 1) {
    updateClock();
    timer = window.setInterval(updateClock, 60_000);
    window.addEventListener('focus', updateClock);
    document.addEventListener('visibilitychange', updateClock);
  }
  return () => {
    clockListeners.delete(listener);
    if (clockListeners.size === 0) {
      if (timer !== null) window.clearInterval(timer);
      timer = null;
      window.removeEventListener('focus', updateClock);
      document.removeEventListener('visibilitychange', updateClock);
    }
  };
}
const getClock = () => clock;
const getServerClock = () => 0;
export function useOntleedClock() {
  return useSyncExternalStore(subscribeClock, getClock, getServerClock);
}
