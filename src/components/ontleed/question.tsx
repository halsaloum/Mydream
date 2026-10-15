'use client';
import { useId,useState } from 'react';
import { Check,Lightbulb,RotateCcw } from 'lucide-react';
import type { Question } from '@/content/ontleed/types';
import { correctAnswer,gradeQuestion,type Answer } from '@/lib/ontleed/grade';
export function QuestionView({question,saved,onAnswer}:{question:Question;saved?:{answer:Answer;correct:boolean};onAnswer:(answer:Answer,correct:boolean)=>void}) {
  const [draft,setAnswer]=useState<Answer>(question.kind==='choice'?-1:question.kind==='type'?'':[]);
  const answer=saved?.answer??draft;
  const groupId=useId();
  const [hint,setHint]=useState(false);
  const selected=Array.isArray(answer)?answer:[];
  const submitted=Boolean(saved);
  const valid=question.kind==='choice'?typeof answer==='number'&&answer>=0:question.kind==='type'?typeof answer==='string'&&answer.trim().length>0:question.kind==='order'?selected.length===question.tokens.length:selected.length>0;
  function toggle(index:number) {if(submitted)return;setAnswer(selected.includes(index)?selected.filter(i=>i!==index):[...selected,index]);}
  return <div className="o-question">
    <h2>{question.prompt}</h2>
    {'sentence' in question&&question.sentence&&<p className="o-sentence">{question.sentence}</p>}
    {question.kind==='choice'&&<div className="o-options" role="radiogroup" aria-label="Antwoorden">{question.options.map((option,index)=><label key={index} className={`o-option ${answer===index?'is-selected':''} ${submitted&&index===question.answer?'is-correct':''}`}><input type="radio" name={groupId} checked={answer===index} disabled={submitted} onChange={()=>setAnswer(index)}/><span className="o-option-letter">{String.fromCharCode(65+index)}</span><span>{option}</span>{submitted&&index===question.answer&&<Check size={20}/>}</label>)}</div>}
    {question.kind==='type'&&<label className="o-input-label">Jouw antwoord<input autoComplete="off" value={typeof answer==='string'?answer:''} disabled={submitted} onChange={e=>setAnswer(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&valid&&!submitted)onAnswer(answer,gradeQuestion(question,answer));}} placeholder="Typ je antwoord…"/></label>}
    {question.kind==='mark'&&<div className="o-token-bank" aria-label="Woorden markeren">{question.tokens.map((token,index)=><button type="button" key={index} aria-pressed={selected.includes(index)} disabled={submitted} className={`o-token ${selected.includes(index)?'is-selected':''} ${submitted&&question.targets.includes(index)?'is-correct':''}`} onClick={()=>toggle(index)}>{token}</button>)}</div>}
    {question.kind==='order'&&<><div className="o-order-slot" aria-label="Jouw volgorde">{selected.length===0?<span>Kies de bouwstenen in de juiste volgorde.</span>:selected.map((index,pos)=><button type="button" className="o-token is-selected" key={index} disabled={submitted} aria-label={`${question.tokens[index]}, verwijder positie ${pos+1}`} onClick={()=>toggle(index)}>{question.tokens[index]}</button>)}</div><div className="o-token-bank" aria-label="Beschikbare bouwstenen">{question.tokens.map((token,index)=><button type="button" className="o-token" key={index} disabled={submitted||selected.includes(index)} onClick={()=>toggle(index)}>{token}</button>)}</div>{!submitted&&selected.length>0&&<button type="button" className="o-text-button" onClick={()=>setAnswer([])}><RotateCcw size={15}/> Opnieuw ordenen</button>}</>}
    {!submitted?<div className="o-question-actions"><button type="button" className="o-button" disabled={!valid} onClick={()=>onAnswer(answer,gradeQuestion(question,answer))}>Controleer antwoord <Check size={17}/></button><button type="button" className="o-text-button" onClick={()=>setHint(!hint)} aria-expanded={hint}><Lightbulb size={17}/> Een aanwijzing</button>{hint&&<p className="o-hint">{question.hint}</p>}</div>:<div role="status" className={`o-feedback ${saved?.correct?'is-positive':''}`}><strong>{saved?.correct?'Je eerste antwoord klopt.':'Laten we dit onderzoeken.'}</strong>{!saved?.correct&&question.kind==='choice'&&typeof saved?.answer==='number'&&<p>{question.feedback[saved.answer]}</p>}{!saved?.correct&&<p><b>Een juist antwoord:</b> {correctAnswer(question)}</p>}<p>{question.explanation}</p><small>Je eerste poging blijft bewaard. Gebruik de uitleg om je redenering aan te scherpen.</small></div>}
  </div>;
}
