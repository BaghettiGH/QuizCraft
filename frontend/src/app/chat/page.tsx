"use client";
import React from "react";
import Quiz from "@/components/Quizsection";

export default function QuizTestPage() {
  const sampleQuiz = [
    { question: "What does WLAN stand for?", answer: "Wireless Local Area Network" },
    { question: "Is Wi-Fi a type of WLAN?", answer: "Yes" },
    { question: "What frequency bands do most WLANs use?", answer: "2.4 GHz and 5 GHz" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Quiz Component Test</h1>
        <Quiz quizData={sampleQuiz} />
      </div>
    </div>
  );
}
