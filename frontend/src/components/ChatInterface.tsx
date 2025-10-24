"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, BookOpen, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { QuizData } from "./types";
import QuizComponent from "./QuizComponent";


interface Message {
  role: "user" | "assistant";
  content: string;
  quiz?: QuizData;
}




export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuizComplete = (score: number, total: number) => {
    console.log(`Quiz completed: ${score}/${total}`);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();
      
      if (data.quiz) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.answer,
          quiz: {
            questions: data.quiz,
            topic: data.quiz_topic || "this topic"
          }
        };
        setMessages([...updatedMessages, assistantMessage]);
      } else {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.answer,
        };
        setMessages([...updatedMessages, assistantMessage]);
      }
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#0E0E21' }}>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-block bg-blue-500/10 p-6 rounded-2xl mb-4">
                <Sparkles className="w-16 h-16 text-blue-400 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                QuizCraft
              </h2>
              <p className="text-blue-300 mb-4">
                Ask me to explain any concept, or request a quiz to test your knowledge!
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {[
                  "Explain photosynthesis",
                  "Quiz me about the water cycle",
                  "What is quantum computing?",
                  "Test me on DNA replication",
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-blue-500/20 rounded-xl text-left text-sm text-blue-200 transition-all hover:border-blue-500/40"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-3xl w-full ${
                  msg.role === "user" ? "flex justify-end" : ""
                }`}
              >
                {msg.role === "user" ? (
                  <div className="bg-blue-600 text-white rounded-2xl p-4 max-w-2xl">
                    {msg.content}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-slate-800/80 text-blue-50 border border-blue-500/20 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-500 p-1.5 rounded-lg mt-0.5 flex-shrink-0">
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 prose prose-invert prose-blue max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                    {msg.quiz && (
                      <QuizComponent 
                        quizData={msg.quiz} 
                        onComplete={handleQuizComplete}
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

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="pb-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 bg-slate-900/50 border border-blue-500/30 rounded-2xl focus-within:border-blue-500 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me to explain something or say 'quiz me about...'"
                className="w-full bg-transparent text-white p-4 resize-none outline-none max-h-32"
                rows={1}
                style={{
                  height: "auto",
                  minHeight: "56px",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = target.scrollHeight + "px";
                }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white p-4 rounded-2xl transition-all flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-blue-400 mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}