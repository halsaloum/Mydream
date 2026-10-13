'use client';

import { ArrowDown, Check, Lightbulb, RotateCcw, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useCalmMotion } from '@/lib/motion';
import { cn } from '@/lib/cn';
import styles from './argumentation.module.css';

const options = [
  { id: 'popular', text: 'Iedereen vindt het een goed idee.', correct: false },
  { id: 'evidence', text: 'Een proef liet zien dat we meer werk afkregen.', correct: true },
];

export function ThinkingPreview() {
  const [selected, setSelected] = useState<string | null>(null);
  const calm = useCalmMotion();
  const correct = selected === 'evidence';
  return <section aria-label="Probeer argumenteren" className={styles.preview}>
    <div className="mb-5 flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase"><Sparkles className="size-4" aria-hidden /> Even je brein aan</span>
      <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-ink-muted">30 sec</span>
    </div>
    <div className={styles.claim}>
      <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-blue-ink">Het standpunt</span>
      <p className="mt-2 font-display text-xl font-bold leading-snug">“Laten we minder<br />vergaderen.”</p>
    </div>
    <div className="my-3 flex items-center justify-center gap-2 text-xs font-semibold text-ink-muted"><ArrowDown aria-hidden className="size-4" /> Welke reden is sterker?</div>
    <div className="space-y-3">
      {options.map((option, index) => <motion.button key={option.id} type="button" aria-pressed={selected === option.id} onClick={() => setSelected(option.id)} whileHover={calm ? undefined : { y: -2 }} whileTap={calm ? undefined : { y: 2 }} className={cn(styles.answer, selected === option.id && (option.correct ? styles.correct : styles.retry))}>
        <span className={styles.answerKey}>{selected === option.id && option.correct ? <Check aria-hidden className="size-4" /> : String.fromCharCode(65 + index)}</span>
        <span>{option.text}</span>
      </motion.button>)}
    </div>
    <div className="mt-4 min-h-24" aria-live="polite" aria-atomic="true">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={selected ?? 'intro'} initial={calm ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: calm ? 0 : 0.16 }}>
          {selected ? <><p className={cn('flex items-center gap-2 text-sm font-bold', correct ? 'text-green-ink' : 'text-orange-ink')}><Lightbulb aria-hidden className="size-4" />{correct ? 'Precies. Bewijs maakt het sterker.' : 'Populair is niet hetzelfde als onderbouwd.'}</p><p className="mt-1 text-xs leading-relaxed text-ink-soft">{correct ? 'Een proef geeft relevante steun. Vraag daarna: was die proef betrouwbaar?' : 'Veel mensen kunnen iets vinden. Welke reden geeft ook bewijs voor het voorstel?'}</p><button type="button" onClick={() => setSelected(null)} className="mt-2 inline-flex min-h-8 items-center gap-1.5 text-xs font-semibold text-ink-muted underline underline-offset-4"><RotateCcw aria-hidden className="size-3" />Opnieuw ontdekken</button></> : <p className="flex items-start gap-2 pt-2 text-xs leading-relaxed text-ink-muted"><Lightbulb aria-hidden className="mt-0.5 size-4 shrink-0" />Niet alleen lezen. Zelf kiezen, uitproberen en ontdekken waarom.</p>}
        </motion.div>
      </AnimatePresence>
    </div>
  </section>;
}
