import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LibraryView } from '@/components/library/library-view';
import { PageSkeleton } from '@/components/ui/empty-state';

export const metadata: Metadata = { title: 'Lessen' };

export default function LessonsPage() {
  return (
    <Suspense fallback={<PageSkeleton blocks={['h-14 w-1/2 max-w-sm', 'h-64', 'h-20', 'h-20']} />}>
      <LibraryView />
    </Suspense>
  );
}
