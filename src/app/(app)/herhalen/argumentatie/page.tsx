import type { Metadata } from 'next';
import { ReviewView } from '@/components/review/review-view';

export const metadata: Metadata = { title: 'Argumentatie herhalen' };
export default function ArgumentReviewPage() {
  return <ReviewView protectedOnly />;
}
