// app/page.tsx
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <section className="text-center space-y-8">
      <h1 className="text-5xl font-extrabold text-indigo-600">
        Welcome to QuizCraft
      </h1>
      <p className="text-lg text-gray-700 max-w-2xl mx-auto">
        QuizCraft helps you transform your notes into interactive quizzes powered
        by AI. Learn smarter, not harder — and make studying fun again.
      </p>

      <div className="flex justify-center space-x-4">
        <Link
          href="/create"
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Create a Quiz
        </Link>
        <Link
          href="/dashboard"
          className="bg-white border border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition"
        >
          View Dashboard
        </Link>
      </div>

      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          title="AI-Generated Questions"
          description="Upload your notes and let QuizCraft generate practice questions instantly."
        />
        <FeatureCard
          title="Smart Progress Tracking"
          description="Monitor your improvement across topics and difficulty levels."
        />
        <FeatureCard
          title="Collaborative Learning"
          description="Share quizzes with friends or classmates and challenge each other."
        />
      </div>
    </section>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-indigo-600 mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}
