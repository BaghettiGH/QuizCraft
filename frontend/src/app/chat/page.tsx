"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, BookOpen, Sparkles, Trophy, MoreVertical, Download, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import jsPDF from "jspdf";

interface Message {
  role: "user" | "assistant";
  content: string;
  quiz?: QuizData;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface QuizData {
  questions: QuizQuestion[];
  topic: string;
}

interface QuizComponentProps {
  quizData: QuizData;
  onComplete: (score: number, total: number) => void;
}

function QuizComponent({ quizData, onComplete }: QuizComponentProps) {
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

const cleanText = (text: string): string => {
  return text
    .replace(/&/g, "and")
    .replace(/[“”‘’]/g, '"')
    .replace(/\s+/g, " ")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();
};

const exportToPDF = (): void => {
  const doc = new jsPDF();
  const lineHeight = 8;
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const marginLeft = 14;
  const maxWidth = pageWidth - marginLeft * 2;
  let y = 20;

  // typed helper: takes string, x/y numbers, returns new y (number)
  const addWrappedText = (
    text: string,
    x: number,
    startY: number,
    fontSize = 10
  ): number => {
    const cleaned = cleanText(text);
    doc.setFontSize(fontSize);
    // splitTextToSize returns string[]
    const lines = doc.splitTextToSize(cleaned, maxWidth);
    let cursorY = startY;
    for (const line of lines) {
      if (cursorY > pageHeight - 20) {
        doc.addPage();
        cursorY = 20;
      }
      doc.text(line, x, cursorY);
      cursorY += lineHeight;
    }
    return cursorY;
  };

  // --- Header ---
  doc.setFontSize(16);
  doc.text("QUIZ RESULTS", pageWidth / 2, y, { align: "center" });
  y += 10;

  doc.setFontSize(11);
  y = addWrappedText(`Topic: ${quizData.topic}`, marginLeft, y, 11);
  y = addWrappedText(
    `Score: ${score}/${quizData.questions.length} (${Math.round(
      (score / quizData.questions.length) * 100
    )}%)`,
    marginLeft,
    y,
    11
  );
  y = addWrappedText(`Date: ${new Date().toLocaleDateString()}`, marginLeft, y, 11);
  y += lineHeight;

  // --- Questions ---
  quizData.questions.forEach((q, idx) => {
    if (y > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    y = addWrappedText(`Q${idx + 1}: ${q.question}`, marginLeft, y, 12);

    q.options.forEach((opt, optIdx) => {
      const letter = String.fromCharCode(65 + optIdx);
      const userAnswer = userAnswers[idx];
      const isCorrect = opt === q.answer;
      const isUser = opt === userAnswer;

      let line = `${letter}. ${opt}`;
      if (isCorrect && isUser) line += " (Correct - Your Answer)";
      else if (isCorrect) line += " (Correct Answer)";
      else if (isUser) line += " (Your Answer - Incorrect)";

      y = addWrappedText(line, marginLeft + 6, y, 10);
    });

    const status = userAnswers[idx] === q.answer ? "CORRECT" : "INCORRECT";
    y = addWrappedText(`Status: ${status}`, marginLeft, y, 11);
    y += 2;
  });

  // Save file
  const filename = `quiz-${quizData.topic.replace(/\s+/g, "-")}-${new Date()
    .toISOString()
    .split("T")[0]}.pdf`;
  doc.save(filename);
  setShowMenu(false);
};

  if (showReview) {
    return (
      <div className="p-6 bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Quiz Review</h3>
          <div className="flex gap-2">
            <button
              onClick={exportToPDF}
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
      <div className="p-6 bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-2xl relative">
        {/* Three-dot menu */}
        <div className="absolute top-4 right-4" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-all"
          >
            <MoreVertical className="w-5 h-5 text-purple-300" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-purple-500/30 rounded-lg shadow-xl z-10">
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
                onClick={exportToPDF}
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
          <p className="text-purple-300 mb-4">Great job on completing the quiz!</p>
          <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
            <p className="text-4xl font-bold text-white mb-2">
              {score} / {quizData.questions.length}
            </p>
            <p className="text-purple-300">{percentage}% correct</p>
          </div>
          <p className="text-sm text-purple-400 mb-6">
            {percentage >= 80 ? "Excellent work! 🎉" : 
             percentage >= 60 ? "Good job! Keep practicing! 👍" : 
             "Keep studying, you'll get there! 💪"}
          </p>
          <p className="text-xs text-purple-400">
            Click the ⋮ menu above to review answers or export
          </p>
        </div>
      </div>
    );
  }

  const question = quizData.questions[current];

  return (
    <div className="p-6 bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-2xl relative">
      {/* Three-dot menu for active quiz */}
      <div className="absolute top-4 right-4" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-all"
        >
          <MoreVertical className="w-5 h-5 text-purple-300" />
        </button>
        
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-purple-500/30 rounded-lg shadow-xl z-10">
            <div className="px-4 py-3 text-sm text-purple-300 border-b border-purple-500/20">
              Quiz in progress...
            </div>
            <div className="px-4 py-3 text-xs text-purple-400">
              Complete the quiz to review and export
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-purple-500 p-2 rounded-lg">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <span className="text-purple-300 font-medium">
            Question {current + 1} of {quizData.questions.length}
          </span>
        </div>
        <div className="text-purple-300 text-sm">
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
                    : "bg-slate-800/50 border-slate-700 text-purple-200"
                  : "bg-slate-800/50 border-purple-500/30 text-purple-100 hover:bg-slate-700/50 hover:border-purple-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  showFeedback && isCorrect
                    ? "bg-green-500 text-white"
                    : showFeedback && isSelected
                    ? "bg-red-500 text-white"
                    : "bg-purple-600 text-white"
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-purple-500/20 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="bg-purple-500 p-2 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Explain Mode</h1>
            <p className="text-sm text-purple-300">
              Ask me anything and I'll explain it clearly
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-block bg-purple-500/10 p-6 rounded-2xl mb-4">
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Ready to Learn?
              </h2>
              <p className="text-purple-300 mb-4">
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
                    className="p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-purple-500/20 rounded-xl text-left text-sm text-purple-200 transition-all hover:border-purple-500/40"
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
                  <div className="bg-purple-600 text-white rounded-2xl p-4 max-w-2xl">
                    {msg.content}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-slate-800/80 text-purple-50 border border-purple-500/20 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-500 p-1.5 rounded-lg mt-0.5 flex-shrink-0">
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 prose prose-invert prose-purple max-w-none">
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
              <div className="bg-slate-800/80 border border-purple-500/20 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500 p-1.5 rounded-lg">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                  <span className="text-purple-300">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border-t border-purple-500/20 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 bg-slate-900/50 border border-purple-500/30 rounded-2xl focus-within:border-purple-500 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me to explain something or say 'quiz me about...' 🎯"
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
              className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white p-4 rounded-2xl transition-all flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-purple-400 mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}