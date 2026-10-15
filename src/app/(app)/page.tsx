import type { Metadata } from 'next';
import { OntleedHome } from '@/components/ontleed/home';
export default function HomePage() { return <OntleedHome />; }

export const metadata: Metadata = { title: { absolute: 'Ontleed — van woord tot volle zin' } };
