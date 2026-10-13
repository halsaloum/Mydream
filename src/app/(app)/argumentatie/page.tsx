import type { Metadata } from 'next';
import { ArgumentationView } from '@/components/argumentation/argumentation-view';

export const metadata: Metadata = { title: 'Argumentatie & drogredenen', description: 'Sterke taal, argumenten en drogredenen voor leiders. Met uitgebreide werksituaties, interactieve argumentkaarten en oefeningen.' };
export default function ArgumentationPage() { return <ArgumentationView />; }
