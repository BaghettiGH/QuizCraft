"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import ChatInterface from "@/components/ChatInterface";
import { Loader2 } from "lucide-react";

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  // Redirect to landing if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Show loading while checking auth
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <ChatInterface initialSessionId={sessionId || undefined} />;
}