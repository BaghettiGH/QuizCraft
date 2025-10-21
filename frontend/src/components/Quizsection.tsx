// app/components/Quizsection.tsx
"use client";

import Link from "next/link";
import React, { useState } from "react";

interface Question {
    question: string;
    answer: string;
}
interface QuizProps {
    quizData: Question[];
}

export default function Quizsection({ quizData }: QuizProps){
    const [current, setCurrent] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState("");

    const handleSubmit = () => {
        const correct = quizData[current].answer.trim().toLowerCase();
        const user = userAnswer.trim().toLowerCase();

        if (user === correct){
            setScore(score + 1);
            setFeedback("Correct!");

        } else {
            setFeedback(`Incorrect. Correct answer: ${quizData[current].answer}`);

        }
        setTimeout(() => {
            setFeedback("");
            setUserAnswer("");

            if (current + 1 < quizData.length){
                setCurrent(current + 1);
            } else {
                setShowResult(true);
            }
        }, 1500);
    };
    if (showResult) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-lg">
          You scored {score} out of {quizData.length}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white/10 p-6 rounded-2xl shadow-lg text-white">
      <h2 className="text-xl font-semibold mb-4">
        Question {current + 1} of {quizData.length}
      </h2>
      <p className="mb-4">{quizData[current].question}</p>

      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 text-white mb-3"
        placeholder="Type your answer..."
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Submit
      </button>

      {feedback && <p className="mt-3 text-sm">{feedback}</p>}
    </div>
  );

}
