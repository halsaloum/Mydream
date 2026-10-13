import type { Metadata } from 'next';
import { PersonalCodex } from '@/components/sentences/personal-codex';

export const metadata: Metadata = { title: 'Mijn Zins-Codex', description: 'Je verzamelde zinsbouwregels, voorbeelden en eigen toepassingen.' };
export default function SentenceCodexPage() { return <PersonalCodex />; }
