import type { z } from 'zod';
import type { PersistStorage, StorageValue } from 'zustand/middleware';

/**
 * Opslag in localStorage met Zod-validatie.
 *
 * - Niet-beschikbare opslag (privévenster, volle quota) breekt de app niet.
 * - Ongeldige of beschadigde gegevens worden niet geladen; er wordt een reservekopie gemaakt
 *   en de app meldt het herstel (zie `storageNotices`).
 */
export const STORAGE_PREFIX = 'pennig:';

export function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSet(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeRemove(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Opslag niet beschikbaar: niets te verwijderen.
  }
}

type Notice = { key: string; at: number };
const listeners = new Set<(notice: Notice) => void>();
const pending: Notice[] = [];

/** Meldingen over herstelde opslag; ontvangers die later inschrijven krijgen eerdere meldingen alsnog. */
export const storageNotices = {
  subscribe(listener: (notice: Notice) => void) {
    pending.splice(0).forEach(listener);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  emit(notice: Notice) {
    if (listeners.size === 0) pending.push(notice);
    listeners.forEach((listener) => listener(notice));
  },
};

export function validatedStorage<S>(schema: z.ZodType<S, unknown>): PersistStorage<S> {
  return {
    getItem(name) {
      const raw = safeGet(name);
      if (raw === null) return null;
      try {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && 'state' in parsed) {
          const result = schema.safeParse(parsed.state);
          if (result.success) {
            const version = 'version' in parsed && typeof parsed.version === 'number' ? parsed.version : 0;
            return { state: result.data, version } satisfies StorageValue<S>;
          }
        }
      } catch {
        // Valt door naar herstel.
      }
      safeSet(`${name}:reserve`, raw);
      storageNotices.emit({ key: name, at: Date.now() });
      return null;
    },
    setItem(name, value) {
      safeSet(name, JSON.stringify(value));
    },
    removeItem(name) {
      safeRemove(name);
    },
  };
}
