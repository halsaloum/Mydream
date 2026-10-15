import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ARGUMENT_DEMOS } from '@/content/demo/argumenten';
import { demoEntries, getDemo } from '@/content/demo';
import { DemoRoute } from '@/components/player/routes';

export function generateStaticParams() {
  return demoEntries.filter(entry=>ARGUMENT_DEMOS.some(item=>item.slug===entry.slug)).map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps<'/oefenvormen/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const demo = getDemo(slug);
  return { title: demo ? `${demo.title} · Oefenvormen` : 'Oefenvorm niet gevonden' };
}

export default async function DemoPage({ params }: PageProps<'/oefenvormen/[slug]'>) {
  const { slug } = await params;
  if (!getDemo(slug)||!ARGUMENT_DEMOS.some(item=>item.slug===slug)) notFound();
  return <DemoRoute key={slug} slug={slug} />;
}
