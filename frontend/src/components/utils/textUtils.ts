export const cleanText = (text: string): string => {
  return text
    .replace(/&/g, "and")
    .replace(/[“”‘’]/g, '"')
    .replace(/\s+/g, " ")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();
};