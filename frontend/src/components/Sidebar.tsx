import { Plus, MessageSquare, Trash2, Loader2, User as UserIcon, LogOut, BarChart3 } from "lucide-react";
import { SidebarProps} from "../types/types";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export const Sidebar = ({
  sessions,
  currentSessionId,
  loading,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
}: SidebarProps) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const handleProgressClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push('/progress');
  };
  
  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await logout();
      // Optionally redirect to login page after logout
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
  <div className="flex flex-col h-full">
    <div className="space-y-2 p-4 border-b border-blue-500/20">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onCreateSession();
        }}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
      >
        <Plus className="w-5 h-5" />
        <span>New Chat</span>
      </button>
      <button
        onClick={handleProgressClick}
        className="w-full text-blue-100 hover:bg-blue-500/20 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-blue-500/30"
      >
        <BarChart3 className="w-5 h-5" />
        <span>My Progress</span>
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
    
    {/* User Info Section */}
    {user && (
      <div className="p-4 border-t border-blue-500/20">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-sm text-blue-200/80 flex-1 min-w-0">
            <UserIcon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {user.first_name} {user.last_name}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-blue-300/70 hover:text-blue-100 hover:bg-blue-600/30 p-1.5 rounded-md transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    )}
    </div>
  );
};