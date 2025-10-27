import React from "react";
import { QuizQuestion as QuizQuestionType } from "../types/types";
import { exportToPDF } from "./utils/pdfUtils";
import { useQuizState } from "../hooks/useQuizState";
import { useMenuToggle } from "../hooks/useMenuToggle";
import { QuizLoading } from "../components/QuizLoading";
import { QuizQuestion } from "../components/QuizQuestion";
import { QuizResult } from "../components/QuizResult";
import { QuizReview } from "../components/QuizReview";
import { QuizMenu } from "../components/QuizMenu";

interface QuizComponentProps {
  quizData: {
    questions: QuizQuestionType[];
    topic: string;
    sessionId?: string;
  };
  sessionId: string;
  onComplete?: (score: number, total: number) => void;
}

export default function QuizComponent({
  quizData,
  sessionId,
  onComplete,
}: QuizComponentProps) {
  const {
    current,
    selected,
    userAnswers,
    score,
    showResult,
    showReview,
    setShowReview,
    quizStarted,
    handleAnswer,
  } = useQuizState(quizData, sessionId, onComplete);

  const { showMenu, setShowMenu, menuRef } = useMenuToggle();

  const handleExport = () => exportToPDF(quizData, userAnswers, score);

  if (!quizStarted) return <QuizLoading />;

  if (showReview) {
    return (
      <QuizReview
        questions={quizData.questions}
        userAnswers={userAnswers}
        score={score}
        onBack={() => setShowReview(false)}
        onExport={handleExport}
      />
    );
  }

  if (showResult) {
    return (
      <div className="p-6 bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-blue-500/30 rounded-2xl relative">
        <QuizMenu
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          menuRef={menuRef}
          onReview={() => setShowReview(true)}
          onExport={handleExport}
        />
        <QuizResult score={score} total={quizData.questions.length} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-blue-500/30 rounded-2xl relative">
      <QuizMenu
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        menuRef={menuRef}
        onReview={() => {}}
        onExport={() => {}}
        isActive={true}
      />
      <QuizQuestion
        question={quizData.questions[current]}
        current={current}
        total={quizData.questions.length}
        score={score}
        selected={selected}
        onAnswer={handleAnswer}
      />
    </div>
  );
}