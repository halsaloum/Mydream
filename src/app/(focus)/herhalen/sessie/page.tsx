import type { Metadata } from 'next';
import { ReviewRoute } from '@/components/player/routes';

export const metadata: Metadata = { title: 'Herhaalronde' };

export default function ReviewSessionPage() {
  return <ReviewRoute />;
}
