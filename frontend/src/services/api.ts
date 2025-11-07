import { Message } from "../types/types";
import { QuizQuestion } from "../types/types";

const API_BASE = "https://quiz-craft-api.vercel.app";

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
    if (!res.ok) throw new Error("Failed to save message");
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
    if (!res.ok) throw new Error("Failed to create quiz");
    return res.json();
  },

  // Store quiz questions in batch
  storeQuestions: async (quizId: string, questions: QuizQuestion[]) => {
    const questionsData = questions.map(q => ({
      quiz_id: quizId,
      quiz_question: q.question,
      correct_answer: q.correct_answer || q.answer,  // Handle both field names
    }));

    console.log("Storing questions:", questionsData);  // Debug log

    const res = await fetch(`${API_BASE}/api/questions/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questionsData),
    });
    if (!res.ok) throw new Error("Failed to store questions");
    return res.json();
  },

  // Save user answer
  saveAnswer: async (questionId: number, answer: string, isCorrect: boolean) => {
    console.log("questionId:", questionId);
    console.log("answer:", answer);
    console.log("isCorrect:", isCorrect);
    const res = await fetch(`${API_BASE}/api/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: questionId,
        answer: String(answer),
        is_correct: isCorrect,
      }),
    });
    if (!res.ok) {
    const text = await res.text();
    console.error("Backend rejected payload:", text);
    throw new Error("Failed to save answer");
  }
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
  async getQuizBySession(sessionId: string) {
    try {
      const response = await fetch(`${API_BASE}/api/quizzes/session/${sessionId}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null; // No quiz found for this session
        }
        throw new Error('Failed to fetch quiz');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching quiz by session:', error);
      throw error;
    }
  },
  async getQuizQuestions(quizId: string) {
    try {
      const response = await fetch(`${API_BASE}/api/quizzes/${quizId}/questions`);
      if (!response.ok) {
        throw new Error('Failed to fetch quiz questions');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      throw error;
    }
  },

  async getQuizAnswers(quizId: string) {
    try {
      const response = await fetch(`${API_BASE}/api/quizzes/${quizId}/answers`);
      if (!response.ok) {
        throw new Error('Failed to fetch quiz answers');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching quiz answers:', error);
      throw error;
    }
  },


};
