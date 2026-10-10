import type { Metadata } from 'next';
import { GalleryView } from '@/components/demo/gallery-view';

export const metadata: Metadata = { title: 'Oefenvormen' };

export default function GalleryPage() {
  return <GalleryView />;
}
