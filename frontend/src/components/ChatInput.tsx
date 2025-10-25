import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

export const ChatInput = ({ value, loading, onChange, onSend }: ChatInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-4 border-t border-blue-500/20">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-end">
          <div className="flex-1 bg-slate-900/50 border border-blue-500/30 rounded-2xl focus-within:border-blue-500 transition-all">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me to explain something or say 'quiz me about...'"
              className="w-full bg-transparent text-white p-4 resize-none outline-none max-h-32"
              rows={1}
              style={{ height: "auto", minHeight: "56px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
            />
          </div>
          <button
            onClick={onSend}
            disabled={!value.trim() || loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white p-4 rounded-2xl transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-xs text-blue-400 mt-2 text-center">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
};