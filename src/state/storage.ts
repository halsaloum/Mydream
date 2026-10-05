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

/** `damaged`: opgeslagen gegevens waren onleesbaar en zijn teruggezet. `blocked`: de browser bewaart niets. */
type Notice = { key: string; at: number; kind: 'damaged' | 'blocked' };
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

let blockedReported = false;

/** Meld één keer per bezoek dat opslaan mislukt, zodat voortgang niet stilletjes verloren gaat. */
function reportBlocked(key: string) {
  if (blockedReported) return;
  blockedReported = true;
  storageNotices.emit({ key, at: Date.now(), kind: 'blocked' });
}

/** Werkt opslaan echt? Een privévenster of geblokkeerde site-gegevens laten setItem mislukken. */
export function checkStorage(): boolean {
  const probe = `${STORAGE_PREFIX}test`;
  const ok = safeSet(probe, '1') && safeGet(probe) === '1';
  safeRemove(probe);
  if (!ok) reportBlocked(probe);
  return ok;
}

/** Vraag de browser de opgeslagen gegevens niet zelf op te ruimen (bijv. bij weinig ruimte). */
export function requestPersistentStorage() {
  try {
    void navigator.storage?.persist?.().catch(() => undefined);
  } catch {
    // Niet ondersteund: localStorage werkt dan gewoon zoals altijd.
  }
}

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
      storageNotices.emit({ key: name, at: Date.now(), kind: 'damaged' });
      return null;
    },
    setItem(name, value) {
      if (!safeSet(name, JSON.stringify(value))) reportBlocked(name);
    },
    removeItem(name) {
      safeRemove(name);
    },
  };
}
