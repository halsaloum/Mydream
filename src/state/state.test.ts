import { beforeEach, describe, expect, it } from 'vitest';
import { lessonEntries } from '@/content/catalog';
import { planFor } from '@/lib/plans';
import { addDays, dayKey } from '@/lib/dates';
import { EMPTY_PROGRESS, PROGRESS_KEY, useProgress } from './progress';
import { continueTarget, recommendedLesson, streakDays } from './selectors';
import { carryOver, SESSIONS_KEY, useSessions } from './sessions';
import { DEFAULT_SETTINGS, SETTINGS_KEY, useSettings } from './settings';
import { checkStorage, storageNotices } from './storage';
import { applyImport, exportData, parseImport } from './transfer';

beforeEach(() => {
  useSettings.setState(DEFAULT_SETTINGS);
  useProgress.setState(EMPTY_PROGRESS);
  useSessions.setState({ byId: {} });
});

describe('opslag', () => {
  it('herstelt beschadigde gegevens met een reservekopie en een melding', async () => {
    const notices: string[] = [];
    const stop = storageNotices.subscribe((notice) => notices.push(notice.key));
    window.localStorage.setItem(SETTINGS_KEY, '{"state":{"profile":"kapot"}}');
    await useSettings.persist.rehydrate();
    stop();
    expect(useSettings.getState().profile).toEqual(DEFAULT_SETTINGS.profile);
    expect(window.localStorage.getItem(`${SETTINGS_KEY}:reserve`)).toContain('kapot');
    expect(notices).toContain(SETTINGS_KEY);
  });

  it('meldt het als de browser niets wil opslaan', () => {
    const kinds: string[] = [];
    const stop = storageNotices.subscribe((notice) => kinds.push(notice.kind));
    expect(checkStorage()).toBe(true);
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new Error('QuotaExceededError');
    };
    try {
      expect(checkStorage()).toBe(false);
    } finally {
      Storage.prototype.setItem = original;
      stop();
    }
    expect(kinds).toEqual(['blocked']);
  });

  it('laat oefenpunten van niet-bestaande stappen weg, maar behoudt de rest', async () => {
    const key = planFor('k1')![3]!.key;
    const item = { key, lessonId: 'k1', addedAt: 'x', lastMissedAt: 'x', misses: 1 };
    window.localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({
        state: { lessons: {}, review: { [key]: item, 'oud:s9#abc': { ...item, key: 'oud:s9#abc' } }, activity: {}, history: [] },
        version: 1,
      }),
    );
    await useProgress.persist.rehydrate();
    expect(Object.keys(useProgress.getState().review)).toEqual([key]);
  });
});

describe('sessies en voortgang', () => {
  it('schrijft een afgeronde les één keer weg, met fouten als oefenpunt', () => {
    const plan = planFor('l4')!;
    expect(plan.map((item) => item.step.kind)).toEqual(['explain', 'choice']);
    const { start, dispatch } = useSessions.getState();
    start('l4', 'lesson', plan);
    let now = Date.now();
    dispatch('l4', { type: 'respond', response: { kind: 'explain', panel: 0, reached: 0, labs: { '0': 1 }, solved: [] }, now: (now += 5_000) });
    dispatch('l4', { type: 'advance', now: (now += 1_000) });
    dispatch('l4', { type: 'respond', response: { kind: 'choice', value: 'BEDANKT VOOR UW BERICHT' }, now: (now += 1_000) });
    dispatch('l4', { type: 'check', now: (now += 1_000) });
    dispatch('l4', { type: 'advance', now: (now += 1_000) });
    dispatch('l4', { type: 'respond', response: { kind: 'choice', value: 'Bedankt voor uw bericht.' }, now: (now += 1_000) });
    dispatch('l4', { type: 'check', now: (now += 1_000) });
    dispatch('l4', { type: 'advance', now: (now += 1_000) });

    const session = useSessions.getState().byId.l4!;
    expect(session.phase).toBe('done');
    expect(session.committed).toBe(true);
    const progress = useProgress.getState();
    expect(progress.lessons.l4).toMatchObject({ attempts: 1, bestAccuracy: 0, lastAccuracy: 0 });
    expect(Object.keys(progress.review)).toEqual([plan[1]!.key]);
    expect(progress.history).toHaveLength(1);
    expect(progress.activity[dayKey()]?.activeMs).toBeGreaterThan(0);

    // Opnieuw dispatchen na afronden verandert niets.
    dispatch('l4', { type: 'advance', now: now + 1_000 });
    expect(useProgress.getState().lessons.l4?.attempts).toBe(1);
  });
});

describe('les veranderd tijdens een update', () => {
  it('gaat verder bij de eerste open stap in plaats van opnieuw te beginnen', async () => {
    const plan = planFor('l5')!;
    const keys = plan.map((item) => item.key);
    expect(keys.length).toBeGreaterThan(3);
    const session = useSessions.getState().start('l5', 'lesson', plan);
    // Een oude versie van de les: één stap die nu niet meer bestaat, en drie stappen al gedaan.
    const old = { ...session, plan: [keys[0]!, 'l5:weg#oud', keys[1]!, keys[2]!], queue: [keys[0]!, 'l5:weg#oud', keys[1]!, keys[2]!], pos: 3, firstTry: { [keys[1]!]: 1, 'l5:weg#oud': 0 } };
    useSessions.setState({ byId: {} });
    window.localStorage.setItem(SESSIONS_KEY, JSON.stringify({ state: { byId: { l5: old } }, version: 1 }));
    await useSessions.persist.rehydrate();
    const resumed = useSessions.getState().byId.l5!;
    expect(resumed.plan).toEqual(keys);
    expect(resumed.pos).toBe(2);
    expect(resumed.phase).toBe('answering');
    expect(resumed.firstTry).toEqual({ [keys[1]!]: 1 });
  });

  it('begint opnieuw als er nog niets gedaan was of de les al af was', () => {
    const plan = planFor('w2')!;
    const session = useSessions.getState().start('w2', 'lesson', plan);
    const changed = { ...session, plan: ['l5:weg#oud'], queue: ['l5:weg#oud'] };
    expect(carryOver('w2', changed)).toBeUndefined();
    expect(carryOver('w2', { ...changed, pos: 0, phase: 'done' as const })).toBeUndefined();
  });
});

describe('aanbevelingen', () => {
  it('"Ik ken de basis al" kiest een later startpunt zonder voortgang te verzinnen', () => {
    const profile = { ...DEFAULT_SETTINGS.profile, start: 'basis' as const };
    expect(recommendedLesson(EMPTY_PROGRESS, profile)?.lesson.id).toBe('g1');
    expect(Object.keys(EMPTY_PROGRESS.lessons)).toHaveLength(0);
  });

  it('een lopende les gaat voor op de volgende aanbeveling', () => {
    const session = useSessions.getState().start('w2', 'lesson', planFor('w2')!);
    const target = continueTarget(EMPTY_PROGRESS, { w2: session }, DEFAULT_SETTINGS.profile);
    expect(target.kind === 'resume' && target.entry.lesson.id).toBe('w2');
    expect(continueTarget(EMPTY_PROGRESS, {}, DEFAULT_SETTINGS.profile)).toMatchObject({ kind: 'next' });
    const all = Object.fromEntries(lessonEntries.map((entry) => [entry.lesson.id, { attempts: 1, bestAccuracy: 100, lastAccuracy: 100, firstCompletedAt: 'x', lastCompletedAt: 'x' }]));
    expect(continueTarget({ ...EMPTY_PROGRESS, lessons: all }, {}, DEFAULT_SETTINGS.profile)).toEqual({ kind: 'complete' });
  });

  it('telt aaneengesloten oefendagen', () => {
    const today = dayKey();
    const day = { activeMs: 60_000, sessions: 1, exercises: 3 };
    expect(streakDays({}, today)).toBe(0);
    expect(streakDays({ [addDays(today, -1)]: day, [addDays(today, -2)]: day }, today)).toBe(2);
    expect(streakDays({ [today]: day, [addDays(today, -2)]: day }, today)).toBe(1);
  });
});

describe('exporteren en importeren', () => {
  it('maakt een volledige rondgang en weigert ongeldige bestanden', () => {
    useSettings.getState().setProfile({ focus: 'zinnen', goalMinutes: 15 });
    useProgress.getState().addActiveTime(90_000);
    const text = exportData();
    useSettings.getState().reset();
    useProgress.getState().reset();

    const parsed = parseImport(text);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) applyImport(parsed.data);
    expect(useSettings.getState().profile.focus).toBe('zinnen');
    expect(useProgress.getState().activity[dayKey()]?.activeMs).toBe(90_000);

    expect(parseImport('geen json')).toEqual({ ok: false, error: 'Dit bestand is geen geldige JSON.' });
    expect(parseImport('{"app":"iets anders"}').ok).toBe(false);
  });
});
