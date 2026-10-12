import type { Metadata } from 'next';
import { WordRoundRoute } from '@/components/words/round-route';

export const metadata: Metadata = { title: 'Woorden van vandaag' };

export default function WordRoundPage() {
  return <WordRoundRoute />;
}
