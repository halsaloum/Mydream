import { PageSkeleton } from '@/components/ui/empty-state';

export default function Loading() {
  return <PageSkeleton blocks={['h-14 w-1/2 max-w-sm', 'h-56', 'h-72']} />;
}
