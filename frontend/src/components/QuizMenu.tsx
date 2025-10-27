import React from "react";
import { Download, Eye, MoreVertical } from "lucide-react";

interface QuizMenuProps {
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onReview: () => void;
  onExport: () => void;
  isActive?: boolean;
}

export const QuizMenu: React.FC<QuizMenuProps> = ({
  showMenu,
  setShowMenu,
  menuRef,
  onReview,
  onExport,
  isActive = false,
}) => (
  <div className="absolute top-4 right-4" ref={menuRef}>
    <button
      onClick={() => setShowMenu(!showMenu)}
      className="p-2 hover:bg-slate-700/50 rounded-lg transition-all"
    >
      <MoreVertical className="w-5 h-5 text-blue-300" />
    </button>

    {showMenu && (
      <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-blue-500/30 rounded-lg shadow-xl z-10">
        {isActive ? (
          <>
            <div className="px-4 py-3 text-sm text-blue-300 border-b border-blue-500/20">
              Quiz in progress...
            </div>
            <div className="px-4 py-3 text-xs text-blue-400">
              Complete the quiz to review and export
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                onReview();
                setShowMenu(false);
              }}
              className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 transition-all flex items-center gap-3 rounded-t-lg"
            >
              <Eye className="w-4 h-4" />
              Review Answers
            </button>
            <button
              onClick={() => {
                onExport();
                setShowMenu(false);
              }}
              className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 transition-all flex items-center gap-3 rounded-b-lg"
            >
              <Download className="w-4 h-4" />
              Export to File
            </button>
          </>
        )}
      </div>
    )}
  </div>
);