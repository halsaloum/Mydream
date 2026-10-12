'use client';

import { BookOpen, Check, Flag, Lightbulb, LockKeyhole, Target } from 'lucide-react';
import type { ArgumentLesson } from '@/content/argumentation/types';
import { theoryPages } from '@/lib/argumentation/theory-pages';
import { useArgumentation, type ArgumentSession } from '@/state/argumentation';
import styles from './argumentation.module.css';

export function LessonJourney({ lesson, session, readingIndex, canResume }: { lesson: ArgumentLesson; session: ArgumentSession; readingIndex: number; canResume: boolean }) {
  const pages = theoryPages(lesson);
  return <aside className={styles.journey} aria-label="Jouw lesroute">
    <div className={styles.journeyHeading}><span className={styles.journeyIcon}><Target aria-hidden size={23} /></span><div><p>STAP VOOR STAP</p><h2>Jouw denkroute</h2></div></div>
    <p className={styles.journeyIntro}>Kleine inzichten. Sterke argumenten.</p>
    <nav aria-label="Leespagina’s"><ol className={styles.journeySteps}>{pages.map((page, index) => {
      const current = session.cursor === 0 && index === readingIndex;
      const done = session.finished || session.cursor > 0 || index < readingIndex;
      const locked = !canResume && index > readingIndex;
      return <li key={page.id}><button type="button" disabled={locked} aria-current={current ? 'step' : undefined} data-done={done} onClick={() => { useArgumentation.getState().setTheoryPage(lesson.id, index); useArgumentation.getState().openTheory(lesson.id); }}><span className={styles.stepNumber}>{done ? <Check aria-hidden size={15} /> : locked ? <LockKeyhole aria-hidden size={13} /> : index + 1}</span><span>{page.title}</span></button></li>;
    })}</ol></nav>
    <div className={styles.journeyGoal}><Flag aria-hidden size={18} /><span>{lesson.exercises.length} opdrachten om het zelf toe te passen</span></div>
    <div className={styles.coach}><Lightbulb aria-hidden size={22} /><h3>Twijfelen is denkwerk.</h3><p>Een fout antwoord is geen eindpunt. Gebruik de feedback en probeer een andere redenering.</p><span><BookOpen aria-hidden size={14} />Leer op jouw tempo</span></div>
  </aside>;
}
