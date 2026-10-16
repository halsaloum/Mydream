import type { Metadata } from 'next';
import { OntleedTools } from '@/components/ontleed/tools';
export default function Page() { return <OntleedTools />; }

export const metadata: Metadata = { title: { absolute: 'Gereedschap · Ontleed' } };
