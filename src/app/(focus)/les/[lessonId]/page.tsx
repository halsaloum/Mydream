import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLessonEntry, lessonEntries } from '@/content/catalog';
import { LessonRoute } from '@/components/player/routes';

export function generateStaticParams() {
  return lessonEntries.map((entry) => ({ lessonId: entry.lesson.id }));
}

export async function generateMetadata({ params }: PageProps<'/les/[lessonId]'>): Promise<Metadata> {
  const { lessonId } = await params;
  const entry = getLessonEntry(lessonId);
  return { title: entry ? `${entry.lesson.title} · ${entry.domain.name}` : 'Les niet gevonden' };
}

export default async function LessonPage({ params }: PageProps<'/les/[lessonId]'>) {
  const { lessonId } = await params;
  if (!getLessonEntry(lessonId)) notFound();
  return <LessonRoute key={lessonId} lessonId={lessonId} />;
}
