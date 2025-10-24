export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface QuizData {
  questions: QuizQuestion[];
  topic: string;
}