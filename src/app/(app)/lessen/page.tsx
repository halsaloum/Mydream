import type { Metadata } from 'next';
import { OntleedLibrary } from '@/components/ontleed/library';
import { Suspense } from 'react';
export default function Page() { return <Suspense fallback={<p>Lessen worden geladen…</p>}><OntleedLibrary /></Suspense>; }

export const metadata: Metadata = { title: { absolute: 'Lessen · Ontleed' } };
