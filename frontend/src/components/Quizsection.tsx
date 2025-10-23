"use client";
import React, { useState } from "react";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface QuizProps {
  quizData: QuizQuestion[];
}

export default function Quiz({ quizData }: QuizProps) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (option: string) => {
    setSelected(option);
    if (option === quizData[current].answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (current + 1 < quizData.length) {
        setCurrent(current + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 800);
  };

  if (showResult) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-lg mb-2">You scored:</p>
        <p className="text-3xl font-bold text-green-400">
          {score} / {quizData.length}
        </p>
      </div>
    );
  }

  const question = quizData[current];

  return (
    <div className="p-6 bg-gray-800 rounded-2xl shadow-lg text-white">
      <h2 className="text-xl font-semibold mb-4">
        Question {current + 1} of {quizData.length}
      </h2>
      <p className="text-lg mb-6">{question.question}</p>

      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            disabled={selected !== null}
            className={`p-3 rounded-xl border transition-all duration-200 ${
              selected === option
                ? option === question.answer
                  ? "bg-green-500 border-green-400"
                  : "bg-red-500 border-red-400"
                : "bg-gray-700 hover:bg-gray-600 border-gray-600"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
