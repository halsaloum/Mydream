import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sentenceLessonById, sentenceLessons } from '@/content/sentences';
import { SentenceLessonPlayer } from '@/components/sentences/lesson-player';

export function generateStaticParams() { return sentenceLessons.map((lesson) => ({ lessonId: lesson.id })); }
export async function generateMetadata({ params }: PageProps<'/zinnen/les/[lessonId]'>): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = sentenceLessonById.get(lessonId);
  return { title: lesson?.title ?? 'Zinles niet gevonden', description: lesson?.teaser };
}
export default async function SentenceLessonPage({ params }: PageProps<'/zinnen/les/[lessonId]'>) {
  const { lessonId } = await params;
  const lesson = sentenceLessonById.get(lessonId);
  if (!lesson) notFound();
  return <SentenceLessonPlayer key={lesson.id} lesson={lesson} />;
}
