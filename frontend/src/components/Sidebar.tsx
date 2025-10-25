import { Plus, MessageSquare, Trash2, Loader2 } from "lucide-react";
import { SidebarProps} from "../types/types";

export const Sidebar = ({
  sessions,
  currentSessionId,
  loading,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
}: SidebarProps) => (
  <div className="flex flex-col h-full">
    <div className="p-4 border-b border-blue-500/20">
      <button
        onClick={onCreateSession}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
      >
        <Plus className="w-5 h-5" />
        <span>New Chat</span>
      </button>
    </div>

    <div className="flex-1 overflow-y-auto p-3 space-y-2">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-8 text-blue-300/50 text-sm">
          No chat sessions yet
        </div>
      ) : (
        sessions.map((session) => (
          <div
            key={session.session_id}
            onClick={() => onSelectSession(session.session_id)}
            className={`group p-3 rounded-xl cursor-pointer transition-all ${
              currentSessionId === session.session_id
                ? 'bg-blue-600/20 border-blue-500/40 border'
                : 'bg-slate-800/50 border border-transparent hover:bg-slate-800 hover:border-blue-500/20'
            }`}
          >
            <div className="flex items-start gap-3">
              <MessageSquare className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-blue-100 truncate">
                  {session.title || "New Chat"}
                </p>
                <p className="text-xs text-blue-400/60 mt-1">
                  {new Date(session.last_active_at || session.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => onDeleteSession(session.session_id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);