import React from "react";
import { Trophy } from "lucide-react";
import { QuizQuestion as QuizQuestionType } from "../types/types";

interface QuizQuestionProps {
  question: QuizQuestionType;
  current: number;
  total: number;
  score: number;
  selected: string | null;
  onAnswer: (answer: string) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  current,
  total,
  score,
  selected,
  onAnswer,
}) => {
  const correctAnswer = question.correct_answer || question.answer;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <span className="text-blue-300 font-medium">
            Question {current + 1} of {total}
          </span>
        </div>
        <div className="text-blue-300 text-sm">
          Score: {score}/{current}
        </div>
      </div>

      <h3 className="text-xl font-semibold text-white mb-6">{question.question}</h3>

      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option, index) => {
          const isSelected = selected === option;
          const isCorrect = option === correctAnswer;
          const showFeedback = selected !== null;

          return (
            <button
              key={index}
              onClick={() => onAnswer(option)}
              disabled={selected !== null}
              className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                showFeedback
                  ? isSelected
                    ? isCorrect
                      ? "bg-green-500/20 border-green-400 text-white"
                      : "bg-red-500/20 border-red-400 text-white"
                    : isCorrect
                    ? "bg-green-500/20 border-green-400 text-white"
                    : "bg-slate-800/50 border-slate-700 text-blue-200"
                  : "bg-slate-800/50 border-blue-500/30 text-blue-100 hover:bg-slate-700/50 hover:border-blue-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    showFeedback && isCorrect
                      ? "bg-green-500 text-white"
                      : showFeedback && isSelected
                      ? "bg-red-500 text-white"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="flex-1">{option}</span>
                {showFeedback && isCorrect && <span className="text-green-400">✓</span>}
                {showFeedback && isSelected && !isCorrect && <span className="text-red-400">✗</span>}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
};