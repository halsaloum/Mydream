export const ONBOARDING_STEPS = ['focus', 'tempo', 'start'] as const;
export type OnboardingSlug = (typeof ONBOARDING_STEPS)[number];

export function isOnboardingStep(value: string): value is OnboardingSlug {
  return (ONBOARDING_STEPS as readonly string[]).includes(value);
}
