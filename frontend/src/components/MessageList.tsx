import { Sparkles, BookOpen, Loader2 } from "lucide-react";
import { Message } from "../types/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  hasSession: boolean;
  onSuggestionClick: (text: string) => void;
  QuizComponent: any;
}

export const MessageList = ({ messages, loading, hasSession, onSuggestionClick, QuizComponent }: MessageListProps) => (
  <div className="max-w-4xl mx-auto space-y-6">
    {messages.length === 0 && (
      <div className="text-center py-20">
        <div className="inline-block bg-blue-500/10 p-6 rounded-2xl mb-4">
          <Sparkles className="w-16 h-16 text-blue-400 mx-auto" />
        </div>
        <h1 className ="text-2xl font-bold text-white mb-2">
            QuizCraft
        </h1>
        <p className="text-blue-300 mb-4">
          Ask me to explain any concept, or request a quiz to test your knowledge!
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {["Explain photosynthesis", "Quiz me about the water cycle", "What is quantum computing?", "Test me on DNA replication"].map((s, i) => (
            <button
              key={i}
              onClick={() => onSuggestionClick(s)}
              className="p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-blue-500/20 rounded-xl text-left text-sm text-blue-200 transition-all hover:border-blue-500/40"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    )}

    {messages.map((msg, idx) => (
      <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
        <div className={`max-w-3xl w-full ${msg.role === "user" ? "flex justify-end" : ""}`}>
          {msg.role === "user" ? (
            <div className="bg-blue-600 text-white rounded-2xl p-4 max-w-2xl">{msg.content}</div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-800/80 text-blue-50 border border-blue-500/20 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 p-1.5 rounded-lg mt-0.5 flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 prose prose-invert prose-blue max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
              {msg.quiz && (
              <QuizComponent 
                quizData={msg.quiz}
                sessionId={msg.quiz.sessionId}  // Now it will have sessionId
                onComplete={(score:number, total:number) => {
                  console.log(`Quiz completed: ${score}/${total}`);
                }}
              />
            )}
            </div>
          )}
        </div>
      </div>
    ))}

    {loading && (
      <div className="flex justify-start">
        <div className="bg-slate-800/80 border border-blue-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-1.5 rounded-lg">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
            <span className="text-blue-300">Thinking...</span>
          </div>
        </div>
      </div>
    )}
  </div>
);