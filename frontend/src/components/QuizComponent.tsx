"use client";
import React, { useState, useRef, useEffect } from "react";
import { Trophy, MoreVertical, Download, Eye } from "lucide-react";
import { exportToPDF } from "../components/utils/pdfUtils";
import "highlight.js/styles/github-dark.css";
import { QuizData } from "../types/types";

interface QuizComponentProps {
  quizData: QuizData;
  onComplete: (score: number, total: number) => void;
}

export default function QuizComponent({ quizData, onComplete }: QuizComponentProps) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAnswer = (option: string) => {
    setSelected(option);
    const newAnswers = [...userAnswers, option];
    setUserAnswers(newAnswers);
    
    if (option === quizData.questions[current].answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (current + 1 < quizData.questions.length) {
        setCurrent(current + 1);
        setSelected(null);
      } else {
        setShowResult(true);
        onComplete(option === quizData.questions[current].answer ? score + 1 : score, quizData.questions.length);
      }
    }, 1000);
  };

  if (showReview) {
    return (
      <div className="p-6 bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Quiz Review</h3>
          <div className="flex gap-2">
            <button
              onClick={() => exportToPDF(quizData, userAnswers, score)}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setShowReview(false)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
            >
              Back to Results
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {quizData.questions.map((q, idx) => {
            const userAnswer = userAnswers[idx];
            const isCorrect = userAnswer === q.answer;

            return (
              <div
                key={idx}
                className="p-5 bg-slate-800/50 rounded-xl border-2 border-purple-500/20"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isCorrect ? "bg-green-500" : "bg-red-500"
                  } text-white flex-shrink-0`}>
                    {isCorrect ? "✓" : "✗"}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold mb-3">
                      Question {idx + 1}: {q.question}
                    </p>

                    <div className="space-y-2 mb-3">
                      {q.options.map((opt, optIdx) => {
                        const isUserAnswer = opt === userAnswer;
                        const isCorrectAnswer = opt === q.answer;

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
                              <span className={`flex-1 ${
                                isCorrectAnswer || isUserAnswer
                                  ? "text-white"
                                  : "text-purple-200"
                              }`}>
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
                        <strong>Correct answer:</strong> {q.answer}
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
  }

  if (showResult) {
    const percentage = Math.round((score / quizData.questions.length) * 100);
    return (
      <div className="p-6 bg-gradient-to-br from-blue-1100/50 to-blue-900/50 border border-blue-500/30 rounded-2xl relative">
        {/* Three-dot menu */}
        <div className="absolute top-4 right-4" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-all"
          >
            <MoreVertical className="w-5 h-5 text-blue-300" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-blue-500/30 rounded-lg shadow-xl z-10">
              <button
                onClick={() => {
                  setShowReview(true);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 transition-all flex items-center gap-3 rounded-t-lg"
              >
                <Eye className="w-4 h-4" />
                Review Answers
              </button>
              <button
                onClick={() => exportToPDF(quizData, userAnswers, score)}
                className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 transition-all flex items-center gap-3 rounded-b-lg"
              >
                <Download className="w-4 h-4" />
                Export to File
              </button>
            </div>
          )}
        </div>

        <div className="text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h3>
          <p className="text-blue-300 mb-4">Great job on completing the quiz!</p>
          <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
            <p className="text-4xl font-bold text-white mb-2">
              {score} / {quizData.questions.length}
            </p>
            <p className="text-blue-300">{percentage}% correct</p>
          </div>
          <p className="text-sm text-blue-400 mb-6">
            {percentage >= 80 ? "Excellent work!" : 
             percentage >= 60 ? "Good job! Keep practicing!" : 
             "Keep studying, you'll get there!"}
          </p>
        </div>
      </div>
    );
  }

  const question = quizData.questions[current];

  return (
    <div className="p-6 bg-gradient-to-br from-blue-900/50 to-blue-900/50 border border-blue-500/30 rounded-2xl relative">
      {/* Three-dot menu for active quiz */}
      <div className="absolute top-4 right-4" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-all"
        >
          <MoreVertical className="w-5 h-5 text-blue-300" />
        </button>
        
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-blue-500/30 rounded-lg shadow-xl z-10">
            <div className="px-4 py-3 text-sm text-blue-300 border-b border-blue-500/20">
              Quiz in progress...
            </div>
            <div className="px-4 py-3 text-xs text-blue-400">
              Complete the quiz to review and export
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <span className="text-blue-300 font-medium">
            Question {current + 1} of {quizData.questions.length}
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
          const isCorrect = option === question.answer;
          const showFeedback = selected !== null;

          return (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  showFeedback && isCorrect
                    ? "bg-green-500 text-white"
                    : showFeedback && isSelected
                    ? "bg-red-500 text-white"
                    : "bg-blue-600 text-white"
                }`}>
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
    </div>
  );
}