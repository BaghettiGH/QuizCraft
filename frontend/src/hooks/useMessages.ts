import { useState, useEffect } from "react";
import { Message } from "../types/types";
import { messageApi } from "../services/api";


export const useMessages = (sessionId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (sessionId) {
      loadMessages(sessionId);
    } else {
      setMessages([]);
    }
  }, [sessionId]);

  const loadMessages = async (sid: string) => {
    try {
      const data = await messageApi.list(sid);
      const formatted: Message[] = data.messages.map((msg: any) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
        quiz: msg.quiz_data ? JSON.parse(msg.quiz_data) : undefined,
      }));
      setMessages(formatted);
    } catch (err) {
      console.error("Error loading messages:", err);
      setMessages([]);
    }
  };

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  return { messages, setMessages, addMessage };
};
