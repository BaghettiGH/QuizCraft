// app/layout.tsx
import "../styles/globals.css";
import Link from "next/link";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "QuizCraft",
  description: "Generate and play interactive quizzes from your notes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow container mx-auto px-6 py-10">
          {children}
        </main>

        <footer className="bg-gray-100 py-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} QuizCraft — Crafted for Learners
        </footer>
      </body>
    </html>
  );
}
