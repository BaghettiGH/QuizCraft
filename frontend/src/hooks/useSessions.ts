import { ChatSession } from "../types/types";
import { sessionApi } from "../services/api";

import { useState, useEffect } from "react";

export const useSessions = (userId: string) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, [userId]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionApi.list(userId);
      setSessions(data.sessions || []);
      if (data.sessions?.length > 0 && !currentSessionId) {
        setCurrentSessionId(data.sessions[0].session_id);
      }
    } catch (err) {
      console.error("Error loading sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (mode: string = "chat") => {
    const data = await sessionApi.create(userId, mode);
    const newSession = data.session;
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.session_id);
    return newSession;
  };

  const deleteSession = async (sessionId: string) => {
    await sessionApi.delete(sessionId);
    setSessions(sessions.filter(s => s.session_id !== sessionId));
    if (currentSessionId === sessionId) {
      const remaining = sessions.filter(s => s.session_id !== sessionId);
      setCurrentSessionId(remaining[0]?.session_id || null);
    }
  };

  const updateTitle = async (sessionId: string, title: string) => {
    await sessionApi.update(sessionId, title);
    setSessions(sessions.map(s => 
      s.session_id === sessionId ? { ...s, title } : s
    ));
  };

  return {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    loading,
    createSession,
    deleteSession,
    updateTitle,
  };
};