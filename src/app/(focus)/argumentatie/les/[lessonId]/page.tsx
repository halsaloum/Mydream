import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { argumentLessonById, argumentLessons } from '@/content/argumentation';
import { ArgumentLessonPlayer } from '@/components/argumentation/lesson-player';

export function generateStaticParams() { return argumentLessons.map((lesson) => ({ lessonId: lesson.id })); }
export async function generateMetadata({ params }: PageProps<'/argumentatie/les/[lessonId]'>): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = argumentLessonById.get(lessonId);
  return { title: lesson?.title ?? 'Les niet gevonden', description: lesson?.teaser };
}
export default async function ArgumentLessonPage({ params }: PageProps<'/argumentatie/les/[lessonId]'>) {
  const { lessonId } = await params;
  const lesson = argumentLessonById.get(lessonId);
  if (!lesson) notFound();
  return <ArgumentLessonPlayer key={lesson.id} lesson={lesson} />;
}
