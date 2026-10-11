import type { Metadata } from 'next';
import { WordsView } from '@/components/words/words-view';

export const metadata: Metadata = { title: 'Woorden' };

export default function WordsPage() {
  return <WordsView />;
}
