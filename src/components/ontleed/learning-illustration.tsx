import Image from 'next/image';

/** Decorative, locally served artwork. Sources are credited on /bronnen. */
export function LearningIllustration({ level, priority = false }: { level: string; priority?: boolean }) {
  const name = level === 'woord' || level === 'zin' ? level : 'alinea';
  return <Image
    className="o-learning-illustration"
    src={`/illustrations/ontleed/${name}.svg`}
    alt=""
    width={240}
    height={180}
    priority={priority}
    unoptimized
  />;
}
