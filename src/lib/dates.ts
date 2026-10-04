/** Datums als lokale kalenderdag (YYYY-MM-DD). De oude app gebruikte UTC, waardoor dagen rond middernacht verschoven. */
export function dayKey(date: Date | number = Date.now()): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

export function addDays(key: string, days: number): string {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y ?? 1970, (m ?? 1) - 1, (d ?? 1) + days));
}

const dateFormat = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long' });
const weekdayFormat = new Intl.DateTimeFormat('nl-NL', { weekday: 'short' });

export function formatDay(iso: string, today = dayKey()): string {
  const key = dayKey(new Date(iso));
  if (key === today) return 'vandaag';
  if (key === addDays(today, -1)) return 'gisteren';
  return dateFormat.format(new Date(iso));
}

export function weekdayShort(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return weekdayFormat.format(new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1)).replace('.', '');
}

export function minutes(ms: number): number {
  return Math.round(ms / 60_000);
}
