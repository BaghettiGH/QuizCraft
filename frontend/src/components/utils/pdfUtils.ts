import jsPDF from "jspdf";
import { cleanText } from "./textUtils";

export const exportToPDF = (quizData:any, userAnswers: string[], score: number): void => {
  const doc = new jsPDF();
  const lineHeight = 8;
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const marginLeft = 14;
  const maxWidth = pageWidth - marginLeft * 2;
  let y = 20;

  // typed helper: takes string, x/y numbers, returns new y (number)
  const addWrappedText = (
    text: string,
    x: number,
    startY: number,
    fontSize = 10
  ): number => {
    const cleaned = cleanText(text);
    doc.setFontSize(fontSize);
    // splitTextToSize returns string[]
    const lines = doc.splitTextToSize(cleaned, maxWidth);
    let cursorY = startY;
    for (const line of lines) {
      if (cursorY > pageHeight - 20) {
        doc.addPage();
        cursorY = 20;
      }
      doc.text(line, x, cursorY);
      cursorY += lineHeight;
    }
    return cursorY;
  };

  // --- Header ---
  doc.setFontSize(16);
  doc.text("QUIZ RESULTS", pageWidth / 2, y, { align: "center" });
  y += 10;

  doc.setFontSize(11);
  y = addWrappedText(`Topic: ${quizData.topic}`, marginLeft, y, 11);
  y = addWrappedText(
    `Score: ${score}/${quizData.questions.length} (${Math.round(
      (score / quizData.questions.length) * 100
    )}%)`,
    marginLeft,
    y,
    11
  );
  y = addWrappedText(`Date: ${new Date().toLocaleDateString()}`, marginLeft, y, 11);
  y += lineHeight;

  // --- Questions ---
  quizData.questions.forEach((q: any, idx: number) => {
    if (y > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    y = addWrappedText(`Q${idx + 1}: ${q.question}`, marginLeft, y, 12);

    q.options.forEach((opt:string, optIdx: number) => {
      const letter = String.fromCharCode(65 + optIdx);
      const userAnswer = userAnswers[idx];
      const isCorrect = opt === q.answer;
      const isUser = opt === userAnswer;

      let line = `${letter}. ${opt}`;
      if (isCorrect && isUser) line += " (Correct - Your Answer)";
      else if (isCorrect) line += " (Correct Answer)";
      else if (isUser) line += " (Your Answer - Incorrect)";

      y = addWrappedText(line, marginLeft + 6, y, 10);
    });

    const status = userAnswers[idx] === q.answer ? "CORRECT" : "INCORRECT";
    y = addWrappedText(`Status: ${status}`, marginLeft, y, 11);
    y += 2;
  });

  // Save file
  const filename = `quiz-${quizData.topic.replace(/\s+/g, "-")}-${new Date()
    .toISOString()
    .split("T")[0]}.pdf`;
  doc.save(filename);
};