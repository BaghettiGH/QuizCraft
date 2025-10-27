import { Message } from "../types/types";
import { QuizQuestion } from "../types/types";

const API_BASE = "http://localhost:8000";

export const sessionApi = {
  list: async (userAuthId: string) => {
    const res = await fetch(`${API_BASE}/api/sessions?user_id=${userAuthId}`);
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to load sessions ${errText}`);
      }
    return res.json();
  },

  create: async (userAuthId: string, mode: string = "chat") => {
    const res = await fetch(`${API_BASE}/api/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userAuthId, title: "New Chat", mode }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to create session: ${errText}`);
    }
    return res.json();
  },

  update: async (sessionId: string, title: string) => {
    const res = await fetch(`${API_BASE}/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error("Failed to update session");
    return res.json();
  },

  delete: async (sessionId: string) => {
    const res = await fetch(`${API_BASE}/api/sessions/${sessionId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete session");
  },
};

export const messageApi = {
  list: async (sessionId: string) => {
    const res = await fetch(`${API_BASE}/api/messages?session_id=${sessionId}`);
    if (!res.ok) throw new Error("Failed to load messages");
    return res.json();
  },

  create: async (sessionId: string, sender: string, content: string, quizData?: any) => {
    const res = await fetch(`${API_BASE}/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        sender,
        content,
        quiz_data: quizData ? JSON.stringify(quizData) : null,
      }),
    });
    const errorData = await res.text();
    if (!res.ok) throw new Error("Failed to save message", { cause: errorData });
    return res.json();
  },
};

export const aiApi = {
  explain: async (messages: Message[]) => {
    const res = await fetch(`${API_BASE}/ai/explain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) throw new Error("Failed to get AI response");
    return res.json();
  },
};

export const quizApi = {
  // Create quiz when AI generates questions
  createQuiz: async (sessionId: string, numberOfQuestions: number) => {
    const res = await fetch(`${API_BASE}/api/quizzes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        no_of_questions: numberOfQuestions,
      }),
    });
    const errorData = await res.text();
    if (!res.ok) throw new Error("Failed to create quiz", { cause: errorData});
    return res.json();
  },

  // Store quiz questions in batch
  storeQuestions: async (quizId: string, questions: QuizQuestion[]) => {
    const questionsData = questions.map(q => ({
      quiz_id: quizId,
      quiz_question: q.question,
      correct_answer: q.correct_answer,
    }));

    const res = await fetch(`${API_BASE}/api/questions/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questionsData),
    });
    if (!res.ok) throw new Error("Failed to store questions");
    return res.json();
  },

  // Save user answer
  saveAnswer: async (questionId: string, answer: string, isCorrect: boolean) => {
    const res = await fetch(`${API_BASE}/api/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: questionId,
        answer,
        is_correct: isCorrect,
      }),
    });
    if (!res.ok) throw new Error("Failed to save answer");
    return res.json();
  },

  // Complete quiz (update score and finish status)
  completeQuiz: async (quizId: string, score: number) => {
    const res = await fetch(`${API_BASE}/api/quizzes/${quizId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score,
        is_finished: true,
      }),
    });
    if (!res.ok) throw new Error("Failed to complete quiz");
    return res.json();
  },

  // Get quiz with questions
  getQuizWithQuestions: async (quizId: string) => {
    const [quizRes, questionsRes] = await Promise.all([
      fetch(`${API_BASE}/api/quizzes/${quizId}`),
      fetch(`${API_BASE}/api/questions?quiz_id=${quizId}`),
    ]);

    if (!quizRes.ok || !questionsRes.ok) {
      throw new Error("Failed to load quiz data");
    }

    const quiz = await quizRes.json();
    const questions = await questionsRes.json();

    return { quiz: quiz.quiz, questions: questions.questions };
  },
};