/** Original Dutch curriculum, authored after the supplied source reading. */
export type PartId = 'basis' | 'woordbouw' | 'zinsdelen' | 'zinsbouw' | 'betekenis' | 'volle-zin';
export type BookId = 'lieber' | 'haspelmath' | 'natural-syntax' | 'tallerman' | 'kroeger' | 'ontleed' | 'leerlijn' | 'ans';
export type QuestionBase = { id: string; prompt: string; concept: string; hint: string; explanation: string };
export type ChoiceQuestion = QuestionBase & { kind: 'choice'; sentence?: string; options: string[]; answer: number; feedback: string[] };
export type TypeQuestion = QuestionBase & { kind: 'type'; sentence?: string; accept: string[] };
export type OrderQuestion = QuestionBase & { kind: 'order'; tokens: string[]; accept: string[] };
export type MarkQuestion = QuestionBase & { kind: 'mark'; tokens: string[]; targets: number[] };
export type Question = ChoiceQuestion | TypeQuestion | OrderQuestion | MarkQuestion;
export type Discovery = { prompt: string; sentence?: string; options: string[]; answer: number; feedback: string[] };
export type LessonSection = { title: string; paragraphs: string[]; examples: { sentence: string; analysis: string }[]; pitfall: string; takeaway: string };
export type CompareLab = { kind: 'compare'; prompt: string; variants: { label: string; text: string; analysis: string }[]; takeaway: string };
export type ClassifyLab = { kind: 'classify'; prompt: string; categories: string[]; items: { text: string; category: number; why: string }[]; takeaway: string };
export type LessonLab = CompareLab | ClassifyLab | (MarkQuestion & { takeaway: string }) | (OrderQuestion & { takeaway: string });
export type OntleedLesson = {
  id: string; title: string; subtitle: string; part: PartId; minutes: number;
  level: 'fundament' | 'verdieping' | 'meesterschap'; prerequisites: string[]; goal: string; intro: string;
  discovery: Discovery; sections: LessonSection[]; lab: LessonLab;
  practice: Question[]; retrieval: Question[];
  transfer: { prompt: string; checklist: string[]; model: string };
  recap: string[]; sources: { bookId: BookId; section: string; note: string }[];
};
export type CoursePart = { id: PartId; number: string; title: string; description: string; color: string; question: string };
