import { useState, useEffect } from "react";
import { quizApi } from "@/services/api";
import { QuizQuestion } from "../types/types";

export const useQuizState = (
  quizData: { questions: QuizQuestion[]; topic: string; sessionId?: string },
  sessionId: string,
  onComplete?: (score: number, total: number) => void
) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [questionIds, setQuestionIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState(true);

  useEffect(() => {
    initializeQuiz();
  }, []);

  const initializeQuiz = async () => {
    try {
      if (!sessionId) throw new Error("Session ID is required");

      // Check if quiz already exists for this session
      const existingQuiz = await quizApi.getQuizBySession(sessionId);
      
      if (existingQuiz && existingQuiz.is_finished) {
        setQuizId(existingQuiz.quiz_id);
        setScore(existingQuiz.score || 0);
        
        const questionsResponse = await quizApi.getQuizQuestions(existingQuiz.quiz_id);
        const ids = questionsResponse.questions.map((q: any) => q.question_id);
        setQuestionIds(ids);
        
        const answersResponse = await quizApi.getQuizAnswers(existingQuiz.quiz_id);
        const answers = answersResponse.answers.map((a: any) => a.user_answer);
        setUserAnswers(answers);
        
        setShowResult(true);
        setQuizStarted(true);
        setIsLoadingExisting(false);
        return;
      }

      // Create new quiz if none exists or it's not finished
      const quizResponse = await quizApi.createQuiz(sessionId, quizData.questions.length);
      const createdQuizId = quizResponse.quiz.quiz_id;
      setQuizId(createdQuizId);

      const questionsResponse = await quizApi.storeQuestions(createdQuizId, quizData.questions);
      const ids = questionsResponse.questions.map((q: any) => q.question_id);
      setQuestionIds(ids);

      setQuizStarted(true);
      setIsLoadingExisting(false);
    } catch (error) {
      console.error("Failed to initialize quiz:", error);
      setIsLoadingExisting(false);
    }
  };

  const handleAnswer = async (answer: string) => {
    if (selected !== null) return;

    setSelected(answer);
    const question = quizData.questions[current];
    const correctAnswer = question.correct_answer || question.answer;
    const isCorrect = answer === correctAnswer;

    if (isCorrect) setScore(score + 1);

    try {
      await quizApi.saveAnswer(questionIds[current], answer, isCorrect);
    } catch (error) {
      console.error("Failed to save answer:", error);
    }

    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);

    setTimeout(() => {
      if (current < quizData.questions.length - 1) {
        setCurrent(current + 1);
        setSelected(null);
      } else {
        finishQuiz(newAnswers, isCorrect ? score + 1 : score);
      }
    }, 1500);
  };

  const finishQuiz = async (allAnswers: string[], finalScore: number) => {
    if (!quizId) return;
    setIsSubmitting(true);

    try {
      await quizApi.completeQuiz(quizId, finalScore);
      setShowResult(true);
      if (onComplete) onComplete(finalScore, quizData.questions.length);
    } catch (error) {
      console.error("Failed to complete quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    current,
    selected,
    userAnswers,
    score,
    showResult,
    showReview,
    setShowReview,
    quizStarted,
    handleAnswer,
  };
};