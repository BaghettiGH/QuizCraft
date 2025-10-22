"use client";
import React, { useState }from "react";
import Quiz from "@/components/Quizsection";

export default function QuizTestPage() {

  const [quizData, setQuizData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState("");

  const handleGenerateQuiz = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify({ text: inputText}),
      });
      const data = await res.json();

      let parsedQuiz;
      try {
        parsedQuiz = JSON.parse(data.quiz.replace(/```json|```/g,"").trim());
      } catch (e) {
        console.error("Parsing failed", e);
        setError("AI returned invalid JSON.");
        setLoading(false);
        return;
      }
      const mcqQuiz = parsedQuiz.map((item: any) => ({
        question: item.question,
        options: [
            item.answer,
            "Incorrect Option 1",
            "Incorrect Option 2",
            "Incorrect Option 3",
        ].sort(( )=> Math.random() - 0.5),
        answer: item.answer,
      }));
      setQuizData(mcqQuiz);
      
    } catch (err) {
      setError("Failed to connect to backend.");
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Live Quiz Generator Test
      </h1>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Paste your notes or lecture text here..."
        className="w-full max-w-2xl h-40 p-4 bg-gray-800 border border-gray-700 rounded-xl mb-4 text-white"
      />

      <button
        onClick={handleGenerateQuiz}
        disabled={loading || !inputText.trim()}
        className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-500 disabled:bg-gray-700 transition-all"
      >
        {loading ? "Generating..." : "Generate Quiz"}
      </button>

      {error && <p className="text-red-400 mt-3">{error}</p>}

      <div className="mt-8 w-full max-w-2xl">
        {quizData.length > 0 && <Quiz quizData={quizData} />}
      </div>
    </div>
  );
}
