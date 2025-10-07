// app/components/Navbar.tsx
"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-indigo-600">
        QuizCraft
      </Link>

      <div className="space-x-6">
        <Link href="/dashboard" className="hover:text-indigo-500">
          Dashboard
        </Link>
        <Link href="/create" className="hover:text-indigo-500">
          Create Quiz
        </Link>
        <Link href="/about" className="hover:text-indigo-500">
          About
        </Link>
      </div>
    </nav>
  );
}
