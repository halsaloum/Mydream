'use client';
import Link from 'next/link';
import { ArrowLeft,ArrowRight,BookOpen,Check,ChevronRight,RotateCcw,X } from 'lucide-react';
import { useEffect,useRef,useState } from 'react';
import { getOntleedLesson,getPart,nextOntleedLesson } from '@/content/ontleed';
import { BOOKS } from '@/content/ontleed/sources';
import { getLessonVideos } from '@/content/ontleed/media';
import { newSession,useOntleed,transferWordCount,hasTransferCriteria } from '@/state/ontleed';
import { retrievalEvidenceCount } from '@/lib/ontleed/learning';
import { QuestionView } from './question';
import { LabView } from './lab';
import { LessonVideos } from './lesson-media';
import { useOntleedReady } from './use-ready';
import type { ChoiceQuestion } from '@/content/ontleed/types';
import { getSectionCoach } from '@/lib/ontleed/lesson-coach';
import { Theory } from './lesson-explainer';
export { Theory } from './lesson-explainer';
import './focused-lesson.css';
export function OntleedPlayer({lessonId,initialReading=false}:{lessonId:string;initialReading?:boolean}) {
  const ready=useOntleedReady();
  const lesson=getOntleedLesson(lessonId)!;
  const videos=getLessonVideos(lessonId);
  const stored=useOntleed(s=>s.sessions[lessonId]);
  const session=stored??newSession(0);
  const completed=useOntleed(s=>s.completed[lessonId]);
  const retrieval=useOntleed(s=>s.retrieval[lessonId]);
  const [reading,setReading]=useState(initialReading);
  const mainRef=useRef<HTMLElement>(null);
  const patch=useOntleed(s=>s.patch),answer=useOntleed(s=>s.answer),start=useOntleed(s=>s.start);
  const [modelOpen,setModelOpen]=useState(false);
  const [sourceOpen,setSourceOpen]=useState(false);
  const [repairFocus,setRepairFocus]=useState<string|null>(null);
  const part=getPart(lesson.part)!;
  const sectionEnd=lesson.sections.length;
  const labIndex=sectionEnd+1, practiceStart=labIndex+1,transferIndex=practiceStart+lesson.practice.length,recapIndex=transferIndex+1;
  const current=Math.min(session.step,recapIndex);
  const isQuestion=current===0||(current>=practiceStart&&current<transferIndex);
  const question:ChoiceQuestion|typeof lesson.practice[number]|undefined=current===0?{...lesson.discovery,kind:'choice',id:'discovery',concept:lesson.title,hint:'Beschrijf eerst wat er verandert en wat gelijk blijft.',explanation:lesson.discovery.feedback[lesson.discovery.answer]!}:lesson.practice[current-practiceStart];
  const questionKey=current===0?'discovery':question?.id;
  const saved=questionKey?session.answers[questionKey]:undefined;
  const transferReady=transferWordCount(session.draft)>=12&&hasTransferCriteria(session.checks,lesson.transfer.checklist.length);
  const pendingRepair=lesson.practice.find(item=>session.answers[item.id]?.correct===false&&!session.repairs[item.id]?.correct);
  const activeRepair=repairFocus?lesson.practice.find(item=>item.id===repairFocus):pendingRepair;
  const theoryIndex=current-1;
  const coach=current>0&&current<=sectionEnd?getSectionCoach(lesson,theoryIndex):undefined;
  const theoryProgress=session.theoryProgress[String(theoryIndex)];
  const theoryComplete=Boolean(coach&&theoryProgress?.answer===coach.check.answer&&lesson.sections[theoryIndex]!.examples.every((_,index)=>(theoryProgress?.viewed??[0]).includes(index)));
  const canContinue=isQuestion?Boolean(saved?.correct||(questionKey&&session.corrections[questionKey]?.correct)):current>0&&current<=sectionEnd?Boolean(theoryComplete||session.predictions[String(current-1)]?.revealed):current===labIndex?Boolean(session.answers.lab):current===transferIndex?transferReady&&!activeRepair:true;
  const finished=Boolean(completed&&completed.at>=session.startedAt&&session.startedAt>0);
  const label=current===0?'Ontdekken':current<=sectionEnd?'Begrijpen':current===labIndex?'Experiment':current<transferIndex?'Zelf oefenen':current===transferIndex?'Toepassen':'Terugblik';
  const progress=(current/recapIndex)*100;
  const phases=['Ontdekken','Begrijpen','Experiment','Zelf oefenen','Toepassen','Terugblik'];
  const phaseIndex=phases.indexOf(label);
  const actionGuidance=canContinue?'Klaar voor de volgende stap':isQuestion?'Kies je antwoord en controleer het':current>0&&current<=sectionEnd?'Bekijk de voorbeelden en doe de korte check':current===labIndex?'Onderzoek alle mogelijkheden':current===transferIndex?'Schrijf je voorbeeld en loop de criteria na':'Neem de kern nog eens door';
  useEffect(()=>{if(ready)mainRef.current?.focus({preventScroll:true});},[current,reading,ready]);
  useEffect(()=>{if(ready&&!reading)start(lessonId);},[ready,reading,lessonId,start]);
  function advance(){if(!stored)start(lessonId);patch(lessonId,{step:current+1});window.scrollTo({top:0,behavior:'instant'});}
  function saveAnswer(value:Parameters<typeof answer>[2],correct:boolean){if(!question||!questionKey)return;if(!stored)start(lessonId);answer(lessonId,questionKey,value,correct,question.concept);}
  if(!ready)return <div className="ontleed o-focus o-focused-lesson"><div className="o-loading" role="status">Je les wordt klaargezet…</div></div>;
  return <div className="ontleed o-focus o-focused-lesson">
    <header className="o-player-header">
      <Link href="/lessen" aria-label="Les verlaten"><X size={21}/></Link>
      <div className="o-player-progress">
        <div className="o-player-progress-caption"><span>{lesson.title}</span><span>{current+1} / {recapIndex+1}</span></div>
        <div className="o-progress-track" role="progressbar" aria-label="Voortgang in de les" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><span style={{width:`${progress}%`}}/></div>
      </div>
      <button type="button" onClick={()=>setSourceOpen(!sourceOpen)} aria-expanded={sourceOpen} aria-label="Bronnen bij deze les"><BookOpen size={21}/></button>
    </header>
    <main className="o-player-main" ref={mainRef} tabIndex={-1} aria-label={reading?`Uitleg: ${lesson.title}`:`${label}: ${lesson.title}`}>
      <div className="o-lesson-wayfinding">
        <Link href={`/lessen?deel=${lesson.part}`}>{part.title}</Link>
        <span>{lesson.minutes} min</span>
      </div>
      {!reading&&<ol className="o-lesson-phases" aria-label="Stappen in deze les">{phases.map((phase,index)=><li key={phase} className={index<phaseIndex?'is-past':index===phaseIndex?'is-current':''} aria-current={index===phaseIndex?'step':undefined}><span className="o-phase-mark" aria-hidden="true">{index<phaseIndex?<Check size={11}/>:index+1}</span><span>{phase}</span></li>)}</ol>}
      <div className="o-stage-label">{reading?'Uitleg opnieuw lezen':label}{current>=practiceStart&&current<transferIndex&&<span> · Vraag {current-practiceStart+1} van {lesson.practice.length}</span>}</div>
      {sourceOpen&&<aside className="o-source-panel"><h2>Waar deze les op bouwt</h2>{lesson.sources.map((source,index)=><div key={index}><strong>{BOOKS[source.bookId].title}</strong><p>{source.section} · {source.note}</p></div>)}<Link href="/bronnen">Alle bronnen en leesverantwoording <ArrowRight size={14}/></Link></aside>}
      {reading?<section className="o-reading"><h1>{lesson.title}</h1><p>{lesson.intro}</p><div className="o-button-row"><button type="button" className="o-text-button" onClick={()=>setReading(false)}><ArrowLeft size={16}/> Terug naar de les</button></div>{lesson.sections.map((section,index)=><Theory key={index} section={section} coach={getSectionCoach(lesson,index)} readOnly/>)}<LessonVideos key={`videos:${lessonId}:reading`} videos={videos}/><div className="o-recap"><h2>Wat je kunt uitleggen</h2><ul>{lesson.recap.map((text,index)=><li key={index}><Check size={20}/><span>{text}</span></li>)}</ul></div><button type="button" className="o-button o-secondary" onClick={()=>{setReading(false);window.scrollTo({top:0,behavior:'instant'});}}>Terug naar de les</button></section>:finished&&current===recapIndex?<div className="o-complete"><span className="o-complete-icon"><Check size={36}/></span><p className="o-eyebrow">LES AFGEROND</p><h1>Je hebt {lesson.title.toLocaleLowerCase('nl')} onderzocht.</h1><p>Je eerste antwoorden in deze ronde: <b>{completed?.accuracy}%</b> goed. {retrieval?`Je volgende kennischeck staat gepland op ${new Date(retrieval.due).toLocaleDateString('nl-NL',{day:'numeric',month:'long'})}.`:'Na deze les staat je eerste kennischeck klaar.'}</p><div className="o-evidence-note"><strong>Les afgerond · productie op {retrievalEvidenceCount(retrieval)} van 2 dagen</strong><p>Oefenen met hulp, afronden en later zelfstandig produceren zijn verschillende stappen. Twee juiste productiechecks op verschillende dagen geven extra bewijs; ze zijn geen beoordeling van al je schrijfvaardigheid.</p></div><div className="o-button-row">{nextOntleedLesson(lessonId)&&<Link className="o-button" href={`/les/${nextOntleedLesson(lessonId)!.id}`}>De volgende les <ArrowRight size={18}/></Link>}<Link className="o-button o-secondary" href="/herhalen">Fouten en kennischecks</Link><Link className="o-button o-secondary" href="/">Terug naar je leerpad</Link><button type="button" className="o-text-button" onClick={()=>setReading(true)}><BookOpen size={16}/> Lees uitleg opnieuw</button><button type="button" className="o-text-button" onClick={()=>{setModelOpen(false);useOntleed.getState().restart(lessonId);}}><RotateCcw size={16}/> Les opnieuw doen</button></div></div>:<>
        {current===0&&<div className="o-lesson-intro"><h1>{lesson.title}</h1><p className="o-muted">{lesson.subtitle}</p></div>}
        {isQuestion&&question&&<QuestionView key={`${lessonId}:${session.startedAt}:${questionKey}`} question={question} saved={saved} correction={questionKey?session.corrections[questionKey]:undefined} onAnswer={saveAnswer} onRetry={value=>questionKey&&useOntleed.getState().retry(lessonId,questionKey,value)} sources={lesson.sources}/>}
        {current===0&&<details className="o-lesson-context"><summary>Leerdoel en voorkennis</summary><p>{lesson.intro}</p><div className="o-goal"><span>NA DEZE LES</span><p>{lesson.goal}</p></div>{lesson.prerequisites.length>0&&<><h2>Wat je hiervoor al gebruikt</h2><ul>{lesson.prerequisites.map(id=><li key={id}><Link href={`/les/${id}`}>{getOntleedLesson(id)?.title??id}</Link></li>)}</ul></>}</details>}
        {current>0&&current<=sectionEnd&&<Theory key={`${lessonId}:${session.startedAt}:${current}`} section={lesson.sections[current-1]!} coach={coach} progress={theoryProgress} onProgress={progress=>patch(lessonId,{theoryProgress:{...session.theoryProgress,[String(theoryIndex)]:progress}})} prediction={session.predictions[String(current-1)]} onPrediction={prediction=>patch(lessonId,{predictions:{...session.predictions,[String(current-1)]:prediction}})}/>}
        {current===1&&(theoryComplete||session.predictions['0']?.revealed)&&<LessonVideos key={`videos:${lessonId}:${session.startedAt}`} videos={videos}/>}
        {current===labIndex&&<LabView key={`${lessonId}:${session.startedAt}:lab`} lab={lesson.lab} state={session.labDraft} onChange={labDraft=>patch(lessonId,{labDraft})} onDone={()=>answer(lessonId,'lab','onderzocht',true,lesson.title)} sources={lesson.sources}/>}
        {current>=practiceStart&&current<transferIndex&&<p className="o-practice-counter">Oefening {current-practiceStart+1} van {lesson.practice.length} · zonder uitgewerkt voorbeeld</p>}
        {current===transferIndex&&activeRepair&&<section className="o-repair"><span className="o-eyebrow">NOG EENS, ZONDER HET VOORBEELD</span><h1>Haal je eerdere twijfel terug.</h1><p>Deze vraag ging bij je eerste poging mis. Probeer hem opnieuw voordat je zelf gaat schrijven.</p><QuestionView key={`repair:${activeRepair.id}`} question={activeRepair} saved={session.repairs[activeRepair.id]} onAnswer={value=>{setRepairFocus(activeRepair.id);useOntleed.getState().repair(lessonId,activeRepair.id,value);}} onRetry={value=>useOntleed.getState().repair(lessonId,activeRepair.id,value)} sources={lesson.sources}/>{session.repairs[activeRepair.id]?.correct&&<button type="button" className="o-button" onClick={()=>setRepairFocus(null)}>{pendingRepair?'Volgende herstelvraag':'Verder met toepassing'}<ArrowRight size={17}/></button>}</section>}
        {current===transferIndex&&!activeRepair&&<section className="o-transfer"><h1>Maak het van jezelf.</h1><p className="o-transfer-prompt">{lesson.transfer.prompt}</p><label className="o-input-label">Jouw zin en uitleg<textarea rows={7} value={session.draft} onChange={e=>patch(lessonId,{draft:e.target.value})} placeholder="Schrijf je voorbeeld en leg je keuze uit…"/></label><p className="o-muted" aria-live="polite">{transferWordCount(session.draft)} woorden · schrijf minstens 12 woorden en controleer alle criteria om verder te gaan. Je tekst wordt lokaal bewaard; je beoordeelt de inhoud zelf.</p><fieldset className="o-checklist"><legend>Controleer je eigen werk</legend>{lesson.transfer.checklist.map((criterion,index)=><label key={index}><input type="checkbox" checked={session.checks.includes(index)} onChange={()=>patch(lessonId,{checks:session.checks.includes(index)?session.checks.filter(i=>i!==index):[...session.checks,index]})}/><span>{criterion}</span></label>)}</fieldset><button type="button" className="o-text-button" disabled={transferWordCount(session.draft)<12} onClick={()=>setModelOpen(!modelOpen)} aria-expanded={modelOpen}>Vergelijk na je eigen poging met een mogelijke uitwerking <ChevronRight size={16}/></button>{modelOpen&&<div className="o-model"><strong>Eén mogelijke uitwerking</strong><p>{lesson.transfer.model}</p><p className="o-muted">Andere uitwerkingen kunnen ook goed zijn. Gebruik de criteria om je eigen versie te beoordelen.</p></div>}</section>}
        {current===recapIndex&&<section className="o-recap"><h1>Wat je nu kunt uitleggen.</h1><ul>{lesson.recap.map((text,index)=><li key={index}><Check size={20}/><span>{text}</span></li>)}</ul><p>Probeer de kern morgen opnieuw uit je hoofd op te halen, met een andere zin. De herhaling gebruikt nieuwe opdrachten.</p><div className="o-source-panel"><h2>Verder lezen</h2>{lesson.sources.map((source,index)=><p key={index}><strong>{BOOKS[source.bookId].title}</strong><br/>{source.section} · {source.note}</p>)}</div></section>}
      </>}
    </main>
    {!finished&&!reading&&<footer className="o-player-footer"><div><button type="button" className="o-text-button" disabled={current===0} onClick={()=>patch(lessonId,{step:Math.max(0,current-1)})}><ArrowLeft size={17}/> Vorige</button><span className="o-footer-guidance"><span>{label}</span><strong>{actionGuidance}</strong></span>{current===recapIndex?<button type="button" className="o-button" onClick={()=>useOntleed.getState().complete(lessonId,lesson.practice.map(q=>q.id),lesson.transfer.checklist.length)}>Les afronden <Check size={18}/></button>:<button type="button" className="o-button" disabled={!canContinue} onClick={advance}>Verder <ArrowRight size={18}/></button>}</div></footer>}
  </div>;
}
