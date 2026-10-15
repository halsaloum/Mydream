import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLessonEntry, lessonEntries } from '@/content/catalog';
import { LessonRoute } from '@/components/player/routes';
import { OntleedPlayer } from '@/components/ontleed/player';
import { getOntleedLesson, ontleedLessons, isProtectedArgumentLesson } from '@/content/ontleed';
import '@/components/ontleed/ontleed.css';
export function generateStaticParams() {
  return [...ontleedLessons.map(lesson=>({lessonId:lesson.id})), ...lessonEntries.filter(entry=>isProtectedArgumentLesson(entry.lesson.id)).map(entry=>({lessonId:entry.lesson.id}))];
}
export async function generateMetadata({params}:PageProps<'/les/[lessonId]'>):Promise<Metadata> {
  const {lessonId}=await params;
  const lesson=getOntleedLesson(lessonId);
  const old=isProtectedArgumentLesson(lessonId)?getLessonEntry(lessonId):undefined;
  return {title:lesson?{absolute:`${lesson.title} · Ontleed`}:old?`${old.lesson.title} · ${old.domain.name}`:{absolute:'Les vervangen · Ontleed'}};
}
export default async function LessonPage({params,searchParams}:PageProps<'/les/[lessonId]'>) {
  const {lessonId}=await params;
  const query=await searchParams;
  if(getOntleedLesson(lessonId))return <OntleedPlayer key={lessonId} lessonId={lessonId} initialReading={query.lezen==='1'}/>;
  if(isProtectedArgumentLesson(lessonId)&&getLessonEntry(lessonId))return <LessonRoute key={lessonId} lessonId={lessonId}/>;
  notFound();
}
