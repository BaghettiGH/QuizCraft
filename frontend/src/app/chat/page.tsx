"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ChatInterface from "@/components/ChatInterface";
import { Loader2 } from "lucide-react";

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to landing if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0E0E21]">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
    );
  }

  // Don't render chat if not logged in (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <ChatInterface />
    </div>
  );
}