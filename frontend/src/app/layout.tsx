// app/layout.tsx
import "../styles/globals.css";
import Link from "next/link";

export const metadata = {
  title: "QuizCraft",
  description: "Generate and play interactive quizzes from your notes",
};

import Sidebar from "../components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        <Sidebar />
        <main className="flex-grow container mx-auto px-6 py-10">
          {children}
        </main>


      </body>
    </html>
  );
}
