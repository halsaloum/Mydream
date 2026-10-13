import type { Metadata } from 'next';
import { SentencesView } from '@/components/sentences/sentences-view';

export const metadata: Metadata = { title: 'Zinnen', description: 'Woordgroepen, enkelvoudige en samengestelde zinnen in één interactieve leerroute. Twaalf modules, bouwen, verbanden leggen en foutreparatie.' };
export default function SentencesPage() { return <SentencesView />; }
