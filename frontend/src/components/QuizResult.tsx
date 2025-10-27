import React from "react";
import { Trophy } from "lucide-react";

interface QuizResultProps {
  score: number;
  total: number;
}

export const QuizResult: React.FC<QuizResultProps> = ({ score, total }) => {
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="text-center">
      <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h3>
      <p className="text-blue-300 mb-4">Great job on completing the quiz!</p>
      <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
        <p className="text-4xl font-bold text-white mb-2">
          {score} / {total}
        </p>
        <p className="text-blue-300">{percentage}% correct</p>
      </div>
      <p className="text-sm text-blue-400 mb-6">
        {percentage >= 80
          ? "Excellent work!"
          : percentage >= 60
          ? "Good job! Keep practicing!"
          : "Keep studying, you'll get there!"}
      </p>
    </div>
  );
};