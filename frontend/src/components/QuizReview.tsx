import React from "react";
import { Download } from "lucide-react";
import { QuizQuestion } from "../types/types";

interface QuizReviewProps {
  questions: QuizQuestion[];
  userAnswers: string[];
  score: number;
  onBack: () => void;
  onExport: () => void;
}

export const QuizReview: React.FC<QuizReviewProps> = ({
  questions,
  userAnswers,
  score,
  onBack,
  onExport,
}) => (
  <div className="p-6 bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-2xl">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-2xl font-bold text-white">Quiz Review</h3>
      <div className="flex gap-2">
        <button
          onClick={onExport}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
        >
          Back to Results
        </button>
      </div>
    </div>

    <div className="space-y-6">
      {questions.map((q, idx) => {
        const userAnswer = userAnswers[idx];
        const isCorrect = userAnswer === q.correct_answer;

        return (
          <div
            key={idx}
            className="p-5 bg-slate-800/50 rounded-xl border-2 border-purple-500/20"
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isCorrect ? "bg-green-500" : "bg-red-500"
                } text-white flex-shrink-0`}
              >
                {isCorrect ? "✓" : "✗"}
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold mb-3">
                  Question {idx + 1}: {q.question}
                </p>

                <div className="space-y-2 mb-3">
                  {q.options.map((opt, optIdx) => {
                    const isUserAnswer = opt === userAnswer;
                    const isCorrectAnswer = opt === q.correct_answer;

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-lg border ${
                          isCorrectAnswer
                            ? "bg-green-500/20 border-green-400"
                            : isUserAnswer
                            ? "bg-red-500/20 border-red-400"
                            : "bg-slate-700/30 border-slate-600"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-purple-300">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span
                            className={`flex-1 ${
                              isCorrectAnswer || isUserAnswer ? "text-white" : "text-purple-200"
                            }`}
                          >
                            {opt}
                          </span>
                          {isCorrectAnswer && (
                            <span className="text-green-400 font-bold">✓ Correct</span>
                          )}
                          {isUserAnswer && !isCorrectAnswer && (
                            <span className="text-red-400 font-bold">Your answer</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!isCorrect && (
                  <div className="text-sm text-purple-300 bg-slate-700/30 p-3 rounded-lg">
                    <strong>Correct answer:</strong> {q.correct_answer}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);