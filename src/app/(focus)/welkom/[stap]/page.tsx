import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { OnboardingStep } from '@/components/onboarding/onboarding-step';
import { isOnboardingStep, ONBOARDING_STEPS } from '@/components/onboarding/steps';

export const metadata: Metadata = { title: 'Welkom' };

export function generateStaticParams() {
  return ONBOARDING_STEPS.map((stap) => ({ stap }));
}

export default async function WelkomStapPage({ params }: PageProps<'/welkom/[stap]'>) {
  const { stap } = await params;
  if (!isOnboardingStep(stap)) notFound();
  return <OnboardingStep slug={stap} />;
}
