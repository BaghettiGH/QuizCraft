"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sparkles, MessageSquare, Brain, Trophy, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/chat");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0E0E21]">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
    );
  }
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0E0E21]">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E21] text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Icon */}
          <div className="inline-block bg-blue-500/10 p-6 rounded-3xl mb-8">
            <Sparkles className="w-20 h-20 text-blue-400" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Master Any Topic with AI-Powered Quizzes
          </h1>
          
          <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
            Transform your learning with intelligent conversations and personalized quizzes. 
            QuizCraft makes studying engaging and effective.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/register"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 group"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-blue-500/30 rounded-xl font-semibold text-lg transition-all"
            >
              Log In
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-8">
              <div className="bg-blue-500/10 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <MessageSquare className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Chat Assistant</h3>
              <p className="text-blue-200/70">
                Ask questions and get clear, detailed explanations on any topic you're studying.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-8">
              <div className="bg-purple-500/10 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Brain className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Quizzes</h3>
              <p className="text-blue-200/70">
                Generate custom quizzes instantly to test your knowledge and track progress.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-8">
              <div className="bg-green-500/10 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Trophy className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
              <p className="text-blue-200/70">
                Monitor your learning journey with detailed analytics and performance insights.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-blue-500/20 py-8 mt-20">
        <div className="container mx-auto px-6 text-center text-blue-400/60 text-sm">
          <p>&copy; 2025 QuizCraft. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}