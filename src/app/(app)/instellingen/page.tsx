import type { Metadata } from 'next';
import { OntleedSettings } from '@/components/ontleed/settings';
export default function Page() { return <OntleedSettings />; }

export const metadata: Metadata = { title: { absolute: 'Instellingen · Ontleed' } };
