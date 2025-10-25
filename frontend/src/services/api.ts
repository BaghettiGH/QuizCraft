import { Message } from "../types/types";

const API_BASE = "http://localhost:8000";

export const sessionApi = {
  list: async (userId: string) => {
    const res = await fetch(`${API_BASE}/api/sessions?user_id=${userId}`);
    if (!res.ok) throw new Error("Failed to load sessions");
    return res.json();
  },

  create: async (userId: string, mode: string = "chat") => {
    const res = await fetch(`${API_BASE}/api/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, title: "New Chat", mode }),
    });
    if (!res.ok) throw new Error("Failed to create session");
    return res.json();
  },

  update: async (sessionId: string, title: string) => {
    const res = await fetch(`${API_BASE}/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error("Failed to update session");
    return res.json();
  },

  delete: async (sessionId: string) => {
    const res = await fetch(`${API_BASE}/api/sessions/${sessionId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete session");
  },
};

export const messageApi = {
  list: async (sessionId: string) => {
    const res = await fetch(`${API_BASE}/api/messages?session_id=${sessionId}`);
    if (!res.ok) throw new Error("Failed to load messages");
    return res.json();
  },

  create: async (sessionId: string, sender: string, content: string, quizData?: any) => {
    const res = await fetch(`${API_BASE}/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        sender,
        content,
        quiz_data: quizData ? JSON.stringify(quizData) : null,
      }),
    });
    if (!res.ok) throw new Error("Failed to save message");
    return res.json();
  },
};

export const aiApi = {
  explain: async (messages: Message[]) => {
    const res = await fetch(`${API_BASE}/ai/explain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) throw new Error("Failed to get AI response");
    return res.json();
  },
};