import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Skill } from '@/content/schema';
import { SETTINGS_KEY } from './settings-key';
import { validatedStorage } from './storage';

export { SETTINGS_KEY };

export const FOCUS_OPTIONS = [
  { id: 'spelling', label: 'Foutloze spelling', hint: 'd/t, tussen-n, kofschip', skills: ['Spelling'] },
  { id: 'woorden', label: 'Rijke woordenschat', hint: 'Precieze, formele woorden', skills: ['Woorden'] },
  { id: 'zinnen', label: 'Sterke zinnen', hint: 'Inversie, bijzinnen, variatie', skills: ['Zinsbouw', 'Complex'] },
  { id: 'alineas', label: 'Overtuigende alinea’s', hint: 'Betogen & argumenteren', skills: ['Alinea'] },
] as const satisfies readonly { id: string; label: string; hint: string; skills: readonly Skill[] }[];

export const GOAL_OPTIONS = [
  { minutes: 5, label: '5 min per dag', hint: 'Rustig' },
  { minutes: 10, label: '10 min per dag', hint: 'Normaal' },
  { minutes: 15, label: '15 min per dag', hint: 'Serieus' },
  { minutes: 20, label: '20 min per dag', hint: 'Intens' },
] as const;

export const START_OPTIONS = [
  { id: 'begin', label: 'Rustig vanaf het begin', hint: 'Pim neemt je stap voor stap mee' },
  { id: 'basis', label: 'Ik ken de basis al', hint: 'Sla de allereerste klanklessen over' },
] as const;

/** Bij "Ik ken de basis al" start de aanbeveling op dit niveau (De lettergreep): de letter- en klanklessen worden overgeslagen. Er wordt géén voortgang verzonnen. */
export const BASIS_START_LAYER = 2;

export type FocusId = (typeof FOCUS_OPTIONS)[number]['id'];
export type StartId = (typeof START_OPTIONS)[number]['id'];
export type MotionPreference = 'system' | 'calm';

const ProfileSchema = z.object({
  focus: z.enum(['spelling', 'woorden', 'zinnen', 'alineas']).nullable(),
  goalMinutes: z.union([z.literal(5), z.literal(10), z.literal(15), z.literal(20)]).nullable(),
  start: z.enum(['begin', 'basis']).nullable(),
  completedAt: z.string().nullable(),
});

/** Tempo van de Nederlandse stem; `rustig` is iets langzamer dan gewone spraak, zodat je elke klank hoort. */
export const SPEECH_RATES = [
  { id: 'langzaam', label: 'Langzaam', rate: 0.7 },
  { id: 'rustig', label: 'Rustig', rate: 0.85 },
  { id: 'normaal', label: 'Normaal', rate: 1 },
] as const;

export type SpeechRateId = (typeof SPEECH_RATES)[number]['id'];

const DEFAULT_SPEECH = { voice: null, rate: 'rustig', examples: true } as const;

const SpeechSchema = z.object({
  /** `voiceURI` van de gekozen stem; `null` = pennig kiest zelf de beste Nederlandse stem. */
  voice: z.string().nullable(),
  rate: z.enum(['langzaam', 'rustig', 'normaal']),
  /** Taalvoorbeelden in de uitleg aantikken om ze te horen. */
  examples: z.boolean(),
});

export const SettingsDataSchema = z.object({
  profile: ProfileSchema,
  sound: z.object({ enabled: z.boolean(), volume: z.number().min(0).max(1) }),
  // Ouder opgeslagen instellingen hebben nog geen stem: dan gelden de standaardwaarden.
  speech: SpeechSchema.default({ ...DEFAULT_SPEECH }),
  effects: z.object({ confetti: z.boolean() }),
  motion: z.enum(['system', 'calm']),
});

export type Profile = z.infer<typeof ProfileSchema>;
export type SettingsData = z.infer<typeof SettingsDataSchema>;

export const DEFAULT_SETTINGS: SettingsData = {
  profile: { focus: null, goalMinutes: null, start: null, completedAt: null },
  sound: { enabled: true, volume: 0.6 },
  speech: { ...DEFAULT_SPEECH },
  effects: { confetti: true },
  motion: 'system',
};

type SettingsActions = {
  setProfile: (patch: Partial<Profile>) => void;
  completeOnboarding: () => void;
  setSound: (patch: Partial<SettingsData['sound']>) => void;
  setSpeech: (patch: Partial<SettingsData['speech']>) => void;
  setConfetti: (on: boolean) => void;
  setMotion: (motion: MotionPreference) => void;
  replace: (data: SettingsData) => void;
  reset: () => void;
};


export const useSettings = create<SettingsData & SettingsActions>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      setProfile: (patch) => set((state) => ({ profile: { ...state.profile, ...patch } })),
      completeOnboarding: () => set((state) => ({ profile: { ...state.profile, completedAt: new Date().toISOString() } })),
      setSound: (patch) => set((state) => ({ sound: { ...state.sound, ...patch } })),
      setSpeech: (patch) => set((state) => ({ speech: { ...state.speech, ...patch } })),
      setConfetti: (confetti) => set({ effects: { confetti } }),
      setMotion: (motion) => set({ motion }),
      replace: (data) => set(data),
      reset: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: SETTINGS_KEY,
      version: 1,
      storage: validatedStorage(SettingsDataSchema),
      partialize: ({ profile, sound, speech, effects, motion }) => ({ profile, sound, speech, effects, motion }),
      skipHydration: true,
    },
  ),
);

export function pickSettingsData(state: SettingsData): SettingsData {
  return { profile: state.profile, sound: state.sound, speech: state.speech, effects: state.effects, motion: state.motion };
}

export function focusSkills(focus: FocusId | null): readonly Skill[] {
  return FOCUS_OPTIONS.find((option) => option.id === focus)?.skills ?? [];
}
