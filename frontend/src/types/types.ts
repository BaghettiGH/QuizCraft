import { FormEvent } from 'react';

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface QuizData {
  questions: QuizQuestion[];
  topic: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  quiz?: QuizData;
}
export interface ChatSession {
    session_id: string;
    user_id: number;
    title: string;
    mode: string;
    created_at: string;
    last_active_at: string;
}

export interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  loading: boolean;
  onSelectSession: (id: string) => void;
  onCreateSession: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: {
    id: string;
    email: string;
  };
}

export interface ErrorResponse {
  detail: string;
}

export interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  error: string | null;
}

export interface User {
  id: number;
  auth_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
}