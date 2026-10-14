/** Explanations are kept outside graded lessons so existing exercise sessions remain valid. */
export type SentenceTeaching = {
  lessonId: string;
  introduction: string[];
  concepts: { term: string; meaning: string; example: string }[];
  walkthrough: {
    title: string;
    situation: string;
    startSentence: string;
    steps: { title: string; explanation: string; sentence: string; focus: string[] }[];
    result: string;
  };
  pitfalls: { mistake: string; correction: string }[];
  quickCheck: {
    question: string;
    options: { id: string; text: string; feedback: string }[];
    answer: string;
  };
  application: {
    prompt: string;
    starter: string;
    model: string;
    reasoning: string;
    checklist: string[];
  };
};
