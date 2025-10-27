"use client";
import React, { useState, useRef, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { MessageList } from "../components/MessageList";
import { ChatInput } from "../components/ChatInput";
import { useSessions } from "../hooks/useSessions";
import { useMessages } from "../hooks/useMessages";
import { messageApi, aiApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import QuizComponent from "./QuizComponent";

export default function ChatInterface() {
  const { user } = useAuth();
  const userId = user?.id;
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    loading: sessionsLoading,
    createSession,
    deleteSession,
    updateTitle,
  } = useSessions(userId ?? "");

  const { messages, setMessages, addMessage } = useMessages(currentSessionId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    let sessionId = currentSessionId;
    if (!sessionId) {
      const session = await createSession();
      sessionId = session.session_id;
    }

    const userMessage = { role: "user" as const, content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      await messageApi.create(sessionId!, "user", currentInput);

      if (messages.length === 0) {
        const title = currentInput.slice(0, 50) + (currentInput.length > 50 ? "..." : "");
        await updateTitle(sessionId!, title);
      }

      const data = await aiApi.explain(updatedMessages);
      
      const assistantMessage = {
      role: "assistant" as const,
      content: data.answer,
      quiz: data.quiz ? { 
        questions: data.quiz,
        topic: data.quiz_topic || "this topic",
        sessionId: currentSessionId  // ADD THIS LINE
      } : undefined,
  };
    console.log("assistantMessage", assistantMessage);
      await messageApi.create(
        sessionId!,
        "assistant",
        data.answer,
        assistantMessage.quiz
      );

      addMessage(assistantMessage);
    } catch (err) {
      console.error(err);
      addMessage({
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this chat?")) {
      await deleteSession(sessionId);
    }
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#0E0E21' }}>
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-r border-blue-500/20 overflow-hidden`}>
        <Sidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          loading={sessionsLoading}
          onSelectSession={setCurrentSessionId}
          onCreateSession={createSession}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 border-b border-blue-500/20 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg transition-all">
            {sidebarOpen ? <X className="w-5 h-5 text-blue-400" /> : <Menu className="w-5 h-5 text-blue-400" />}
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg font-semibold text-white">QuizCraft</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <MessageList
            messages={messages}
            loading={loading}
            hasSession={!!currentSessionId}
            onSuggestionClick={setInput}
            QuizComponent={QuizComponent}
          />
          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          value={input}
          loading={loading}
          onChange={setInput}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}