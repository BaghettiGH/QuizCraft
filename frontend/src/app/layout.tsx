import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
const metadata = {
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
      <body className="bg-gray-50 text-gray-900">
        <AuthProvider>
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}