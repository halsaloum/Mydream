import type { Metadata } from 'next';
import { OntleedHome } from '@/components/ontleed/home';
export default function HomePage() { return <OntleedHome />; }

export const metadata: Metadata = { title: { absolute: 'Ontleed — woord, zin, alinea' }, description: 'Onderzoek Nederlandse woorden, bouw precieze zinnen en schrijf samenhangende alinea’s. Met actieve oefeningen, foutgerichte herhaling en je eigen schrijfatelier.' };
