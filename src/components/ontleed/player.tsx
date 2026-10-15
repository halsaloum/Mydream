'use client';
import Link from 'next/link';
import { ArrowLeft,ArrowRight,BookOpen,Check,ChevronRight,RotateCcw,X } from 'lucide-react';
import { useEffect,useRef,useState } from 'react';
import { getOntleedLesson,getPart,nextOntleedLesson } from '@/content/ontleed';
import { BOOKS } from '@/content/ontleed/sources';
import { newSession,useOntleed,transferWordCount,hasTransferCriteria } from '@/state/ontleed';
import { QuestionView } from './question';
import { LabView } from './lab';
import { useOntleedReady } from './use-ready';
import type { ChoiceQuestion,LessonSection } from '@/content/ontleed/types';
export function OntleedPlayer({lessonId,initialReading=false}:{lessonId:string;initialReading?:boolean}) {
  const ready=useOntleedReady();
  const lesson=getOntleedLesson(lessonId)!;
  const stored=useOntleed(s=>s.sessions[lessonId]);
  const session=stored??newSession(0);
  const completed=useOntleed(s=>s.completed[lessonId]);
  const retrieval=useOntleed(s=>s.retrieval[lessonId]);
  const [reading,setReading]=useState(initialReading);
  const mainRef=useRef<HTMLElement>(null);
  const patch=useOntleed(s=>s.patch),answer=useOntleed(s=>s.answer),start=useOntleed(s=>s.start);
  const [modelOpen,setModelOpen]=useState(false);
  const [sourceOpen,setSourceOpen]=useState(false);
  const part=getPart(lesson.part)!;
  const sectionEnd=lesson.sections.length;
  const labIndex=sectionEnd+1, practiceStart=labIndex+1,transferIndex=practiceStart+lesson.practice.length,recapIndex=transferIndex+1;
  const current=Math.min(session.step,recapIndex);
  const isQuestion=current===0||(current>=practiceStart&&current<transferIndex);
  const question:ChoiceQuestion|typeof lesson.practice[number]|undefined=current===0?{...lesson.discovery,kind:'choice',id:'discovery',concept:lesson.title,hint:'Beschrijf eerst wat er verandert en wat gelijk blijft.',explanation:lesson.discovery.feedback[lesson.discovery.answer]!}:lesson.practice[current-practiceStart];
  const questionKey=current===0?'discovery':question?.id;
  const saved=questionKey?session.answers[questionKey]:undefined;
  const transferReady=transferWordCount(session.draft)>=12&&hasTransferCriteria(session.checks,lesson.transfer.checklist.length);
  const canContinue=isQuestion?Boolean(saved):current===labIndex?Boolean(session.answers.lab):current===transferIndex?transferReady:true;
  const finished=Boolean(completed&&completed.at>=session.startedAt&&session.startedAt>0);
  const label=current===0?'Ontdekken':current<=sectionEnd?'Begrijpen':current===labIndex?'Experiment':current<transferIndex?'Zelf oefenen':current===transferIndex?'Toepassen':'Terugblik';
  const progress=(current/recapIndex)*100;
  useEffect(()=>{if(ready)mainRef.current?.focus({preventScroll:true});},[current,reading,ready]);
  function advance(){if(!stored)start(lessonId);patch(lessonId,{step:current+1});window.scrollTo({top:0,behavior:'instant'});}
  function saveAnswer(value:Parameters<typeof answer>[2],correct:boolean){if(!question||!questionKey)return;if(!stored)start(lessonId);answer(lessonId,questionKey,value,correct,question.concept);}
  if(!ready)return <div className="ontleed o-focus"><div className="o-loading" role="status">Je les wordt klaargezet…</div></div>;
  return <div className="ontleed o-focus">
    <header className="o-player-header"><Link href="/lessen" aria-label="Les verlaten"><X size={22}/></Link><div className="o-player-progress"><div className="o-progress-track" role="progressbar" aria-label="Voortgang in de les" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><span style={{width:`${progress}%`}}/></div><span>{current+1} / {recapIndex+1}</span></div><button type="button" onClick={()=>setSourceOpen(!sourceOpen)} aria-expanded={sourceOpen} aria-label="Bronnen bij deze les"><BookOpen size={21}/></button></header>
    <main className="o-player-main" ref={mainRef} tabIndex={-1} aria-label={reading?`Uitleg: ${lesson.title}`:`${label}: ${lesson.title}`}>
      <div className="o-player-breadcrumb"><Link href={`/lessen?deel=${lesson.part}`}>{part.title}</Link><ChevronRight size={14}/><span>{lesson.title}</span></div>
      <div className="o-stage-label">{reading?'Uitleg opnieuw lezen':label} <span>· {lesson.minutes} min voor de hele les</span></div>
      {sourceOpen&&<aside className="o-source-panel"><h2>Waar deze les op bouwt</h2>{lesson.sources.map((source,index)=><div key={index}><strong>{BOOKS[source.bookId].title}</strong><p>{source.section} · {source.note}</p></div>)}<Link href="/bronnen">Alle bronnen en leesverantwoording <ArrowRight size={14}/></Link></aside>}
      {reading?<section className="o-reading"><h1>{lesson.title}</h1><p>{lesson.intro}</p><div className="o-button-row"><button type="button" className="o-text-button" onClick={()=>setReading(false)}><ArrowLeft size={16}/> Terug naar de les</button></div>{lesson.sections.map((section,index)=><Theory key={index} section={section}/>)}<div className="o-recap"><h2>Wat je kunt uitleggen</h2><ul>{lesson.recap.map((text,index)=><li key={index}><Check size={20}/><span>{text}</span></li>)}</ul></div><button type="button" className="o-button o-secondary" onClick={()=>{setReading(false);window.scrollTo({top:0,behavior:'instant'});}}>Terug naar de les</button></section>:finished&&current===recapIndex?<div className="o-complete"><span className="o-complete-icon"><Check size={36}/></span><p className="o-eyebrow">LES AFGEROND</p><h1>Je hebt {lesson.title.toLocaleLowerCase('nl')} onderzocht.</h1><p>Je eerste antwoorden in deze ronde: <b>{completed?.accuracy}%</b> goed. {retrieval?`Je volgende kennischeck staat gepland op ${new Date(retrieval.due).toLocaleDateString('nl-NL',{day:'numeric',month:'long'})}.`:'Na deze les staat je eerste kennischeck klaar.'} Een afgeronde les is een begin; later opnieuw ophalen laat zien wat blijft.</p><div className="o-button-row">{nextOntleedLesson(lessonId)&&<Link className="o-button" href={`/les/${nextOntleedLesson(lessonId)!.id}`}>De volgende les <ArrowRight size={18}/></Link>}<Link className="o-button o-secondary" href="/">Terug naar je leerpad</Link><button type="button" className="o-text-button" onClick={()=>setReading(true)}><BookOpen size={16}/> Lees uitleg opnieuw</button><button type="button" className="o-text-button" onClick={()=>{setModelOpen(false);useOntleed.getState().restart(lessonId);}}><RotateCcw size={16}/> Les opnieuw doen</button></div></div>:<>
        {current===0&&<div className="o-lesson-intro"><h1>{lesson.title}</h1><p>{lesson.intro}</p><div className="o-goal"><span>NA DEZE LES</span><p>{lesson.goal}</p></div>{lesson.prerequisites.length>0&&<details><summary>Wat je hiervoor al gebruikt</summary><ul>{lesson.prerequisites.map(id=><li key={id}><Link href={`/les/${id}`}>{getOntleedLesson(id)?.title??id}</Link></li>)}</ul></details>}</div>}
        {isQuestion&&question&&<QuestionView key={`${lessonId}:${session.startedAt}:${questionKey}`} question={question} saved={saved} onAnswer={saveAnswer}/>}
        {current>0&&current<=sectionEnd&&<Theory section={lesson.sections[current-1]!}/>}
        {current===labIndex&&<LabView key={`${lessonId}:${session.startedAt}:lab`} lab={lesson.lab} state={session.labDraft} onChange={labDraft=>patch(lessonId,{labDraft})} onDone={()=>answer(lessonId,'lab','onderzocht',true,lesson.title)}/>}
        {current>=practiceStart&&current<transferIndex&&<p className="o-practice-counter">Oefening {current-practiceStart+1} van {lesson.practice.length} · zonder uitgewerkt voorbeeld</p>}
        {current===transferIndex&&<section><h1>Maak het van jezelf.</h1><p className="o-transfer-prompt">{lesson.transfer.prompt}</p><label className="o-input-label">Jouw zin en uitleg<textarea rows={7} value={session.draft} onChange={e=>patch(lessonId,{draft:e.target.value})} placeholder="Schrijf je voorbeeld en leg je keuze uit…"/></label><p className="o-muted" aria-live="polite">{transferWordCount(session.draft)} woorden · schrijf minstens 12 woorden en controleer alle criteria om verder te gaan. Je tekst wordt lokaal bewaard; je beoordeelt de inhoud zelf.</p><fieldset className="o-checklist"><legend>Controleer je eigen werk</legend>{lesson.transfer.checklist.map((criterion,index)=><label key={index}><input type="checkbox" checked={session.checks.includes(index)} onChange={()=>patch(lessonId,{checks:session.checks.includes(index)?session.checks.filter(i=>i!==index):[...session.checks,index]})}/><span>{criterion}</span></label>)}</fieldset><button type="button" className="o-text-button" disabled={transferWordCount(session.draft)<12} onClick={()=>setModelOpen(!modelOpen)} aria-expanded={modelOpen}>Vergelijk na je eigen poging met een mogelijke uitwerking <ChevronRight size={16}/></button>{modelOpen&&<div className="o-model"><strong>Eén mogelijke uitwerking</strong><p>{lesson.transfer.model}</p><p className="o-muted">Andere uitwerkingen kunnen ook goed zijn. Gebruik de criteria om je eigen versie te beoordelen.</p></div>}</section>}
        {current===recapIndex&&<section className="o-recap"><h1>Wat je nu kunt uitleggen.</h1><ul>{lesson.recap.map((text,index)=><li key={index}><Check size={20}/><span>{text}</span></li>)}</ul><p>Probeer de kern morgen opnieuw uit je hoofd op te halen, met een andere zin. De herhaling gebruikt nieuwe opdrachten.</p><div className="o-source-panel"><h2>Verder lezen</h2>{lesson.sources.map((source,index)=><p key={index}><strong>{BOOKS[source.bookId].title}</strong><br/>{source.section} · {source.note}</p>)}</div></section>}
      </>}
    </main>
    {!finished&&!reading&&<footer className="o-player-footer"><div><button type="button" className="o-text-button" disabled={current===0} onClick={()=>patch(lessonId,{step:Math.max(0,current-1)})}><ArrowLeft size={17}/> Vorige</button><span className="o-muted">{label}</span>{current===recapIndex?<button type="button" className="o-button" onClick={()=>useOntleed.getState().complete(lessonId,lesson.practice.map(q=>q.id),lesson.transfer.checklist.length)}>Les afronden <Check size={18}/></button>:<button type="button" className="o-button" disabled={!canContinue} onClick={advance}>Verder <ArrowRight size={18}/></button>}</div></footer>}
  </div>;
}

function Theory({section}:{section:LessonSection}) {
  return <article className="o-theory"><h1>{section.title}</h1>{section.paragraphs.map((text,index)=><p key={index}>{text}</p>)}<div className="o-worked-examples">{section.examples.map((example,index)=><figure key={index}><span className="o-eyebrow">VOORBEELD {index+1}</span><blockquote>{example.sentence}</blockquote><figcaption>{example.analysis}</figcaption></figure>)}</div><aside className="o-pitfall"><strong>Hier kun je je vergissen</strong><p>{section.pitfall}</p></aside><div className="o-takeaway"><strong>Neem mee</strong><p>{section.takeaway}</p></div></article>;
}
