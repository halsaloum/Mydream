import type { Metadata } from 'next';
import { OntleedReview } from '@/components/ontleed/review';
export default function Page() { return <OntleedReview />; }

export const metadata: Metadata = { title: { absolute: 'Herhalen · Ontleed' } };
