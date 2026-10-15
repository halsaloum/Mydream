import type { Metadata } from 'next';
import { OntleedSources } from '@/components/ontleed/sources-view';
export default function Page() { return <OntleedSources />; }

export const metadata: Metadata = { title: { absolute: 'Bronnen · Ontleed' } };
