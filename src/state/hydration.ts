'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { useProgress } from './progress';
import { useSessions } from './sessions';
import { useSettings } from './settings';
import { checkStorage, requestPersistentStorage, STORAGE_PREFIX } from './storage';

/**
 * De stores worden pas na het eerste renderen uit localStorage geladen (`skipHydration`).
 * Zo is de servergerenderde HTML gelijk aan de eerste clientrender; tot die tijd tonen
 * schermen een laadtoestand.
 */
const useHydration = create<{ hydrated: boolean }>(() => ({ hydrated: false }));

const stores = [useSettings, useProgress, useSessions] as const;

async function rehydrateAll() {
  if (checkStorage()) requestPersistentStorage();
  // Voortgang eerst: sessies die afronden schrijven naar voortgang.
  await useSettings.persist.rehydrate();
  await useProgress.persist.rehydrate();
  await useSessions.persist.rehydrate();
}

export function useHydrated(): boolean {
  return useHydration((state) => state.hydrated);
}

/** Eenmalig in de root: laad opgeslagen gegevens en houd tabbladen met elkaar in de pas. */
export function useStoreHydration() {
  useEffect(() => {
    let active = true;
    void rehydrateAll().then(() => {
      if (active) useHydration.setState({ hydrated: true });
    });
    const onStorage = (event: StorageEvent) => {
      if (!event.key?.startsWith(STORAGE_PREFIX)) return;
      for (const store of stores) {
        if (store.persist.getOptions().name === event.key) void store.persist.rehydrate();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      active = false;
      window.removeEventListener('storage', onStorage);
    };
  }, []);
}
