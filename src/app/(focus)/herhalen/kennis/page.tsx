import type { Metadata } from 'next';
import { SpacedPracticeRoute } from '@/components/review/spaced-practice';
export const metadata: Metadata = { title: 'Zelfstandig ophalen' };
export default function PracticePage() { return <SpacedPracticeRoute />; }
