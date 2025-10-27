import React from "react";
import { Loader2 } from "lucide-react";

export const QuizLoading: React.FC = () => (
  <div className="p-6 bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-2xl">
    <div className="flex items-center justify-center gap-3">
      <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
      <p className="text-purple-300">Loading quiz...</p>
    </div>
  </div>
);