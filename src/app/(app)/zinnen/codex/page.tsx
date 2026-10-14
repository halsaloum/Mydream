import type { Metadata } from 'next';
import { PersonalCodex } from '@/components/sentences/personal-codex';

export const metadata: Metadata = { title: 'Mijn samenvattingen', description: 'Je bewaarde uitleg over zinsbouw, voorbeelden en eigen toepassingen.' };
export default function SentenceCodexPage() { return <PersonalCodex />; }
