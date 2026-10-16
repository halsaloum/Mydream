import type { Metadata } from 'next';
import { OntleedProgress } from '@/components/ontleed/progress';
export default function Page() { return <OntleedProgress />; }

export const metadata: Metadata = { title: { absolute: 'Voortgang · Ontleed' } };
