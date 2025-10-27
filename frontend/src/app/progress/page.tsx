'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { Menu, X, Sparkles } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { useSessions } from '../../hooks/useSessions';
import { useAuth } from '../../context/AuthContext';

interface ChatSession {
  title: string;
  user_id: string;
}

interface QuizFromDB {
  quiz_id: string;
  session_id: string;
  score: number | null;
  is_finished: boolean;
  timestamp_started: string | null;
  timestamp_finished: string | null;
  no_of_questions: number | null;
  Chat_Session: ChatSession;
}

interface Quiz {
  id: string;
  session_id: string;
  title: string;
  description: string;
  created_at: string;
  status: 'completed' | 'in_progress' | 'not_started';
  score: number | null;
  total_questions: number | null;
}

interface Chat {
  id: string;
  name: string;
  created_at: string;
}

export default function ProgressList() {
  const router = useRouter();
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'calendar'>('list');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    status: 'all', // 'all', 'completed', 'in_progress'
    dateRange: 'all', // 'all', 'today', 'week', 'month'
    startDate: '',
    endDate: ''
  });
  
  const {
    sessions = [],
    currentSessionId,
    loading: sessionsLoading,
    createSession,
    setCurrentSessionId,
    deleteSession,
  } = useSessions(user?.id || '');

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat session?')) {
      await deleteSession(sessionId);
    }
  };


  // Fetch quizzes from Supabase
  useEffect(() => {
    console.log('useEffect triggered');
    
    async function fetchQuizzes(userId: string) {
      console.log('Starting to fetch quizzes for user:', userId);
      setLoading(true);
      
      try {
        // Get all quizzes with their associated chat sessions, but only for the current user
        const { data: quizzes, error: quizzesError } = await supabase
          .from('Quiz')
          .select(`
            quiz_id,
            session_id,
            score,
            is_finished,
            timestamp_started,
            timestamp_finished,
            no_of_questions,
            Chat_Session!inner (
              title,
              user_id
            )
          `)
          .eq('Chat_Session.user_id', userId)
          .order('timestamp_finished', { ascending: false });
          
        if (quizzesError) {
          console.error('Error fetching quizzes:', quizzesError);
          throw quizzesError;
        }
        
        console.log('Fetched quizzes:', quizzes);
        
        // Transform the data to match our Quiz interface
        const formattedQuizzes = (quizzes as unknown as QuizFromDB[] || []).map(quiz => {
          const isCompleted = quiz.is_finished;
          const date = isCompleted 
            ? `Completed on ${new Date(quiz.timestamp_finished || quiz.timestamp_started || new Date()).toLocaleDateString()}`
            : `Started on ${new Date(quiz.timestamp_started || new Date()).toLocaleDateString()}`;
            
          return {
            id: quiz.quiz_id,
            session_id: quiz.session_id, // Add this line
            title: quiz.Chat_Session?.title || 'Untitled Quiz',
            description: date,
            created_at: quiz.timestamp_finished || quiz.timestamp_started || new Date().toISOString(),
            status: isCompleted ? 'completed' : 'in_progress',
            score: isCompleted ? quiz.score : null,
            total_questions: quiz.no_of_questions
          } as Quiz;
        });
          
        console.log('Formatted quizzes:', formattedQuizzes);
        setQuizzes(formattedQuizzes);
      } catch (err) {
        console.error('Error in fetchQuizzes:', err);
        if (err instanceof Error) {
          console.error('Error stack:', err.stack);
        }
      } finally {
        console.log('Finished loading, setting loading to false');
        setLoading(false);
      }
    }

    if (user?.id) {
      fetchQuizzes(user.id);
    } else {
      console.log('No user ID, skipping quiz fetch');
      setQuizzes([]);
      setLoading(false);
    }
    
    // Cleanup function
    return () => {
      console.log('Cleaning up...');
    };
  }, [user?.id ? 'hasUser' : 'noUser']); // Stable dependency array

  // Filter quizzes based on search query and filters
  const filteredQuizzes = quizzes.filter(quiz => {
    // Search query filter
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        quiz.title.toLowerCase().includes(searchLower) ||
        quiz.description.toLowerCase().includes(searchLower) ||
        quiz.status.toLowerCase().includes(searchLower) ||
        (quiz.score !== null && quiz.score.toString().includes(searchLower));
      
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status !== 'all' && quiz.status !== filters.status) {
      return false;
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const quizDate = new Date(quiz.created_at);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      switch (filters.dateRange) {
        case 'today':
          if (quizDate < today) return false;
          break;
        case 'week':
          if (quizDate < startOfWeek) return false;
          break;
        case 'month':
          if (quizDate < startOfMonth) return false;
          break;
      }
    }

    // Custom date range filter
    if (filters.startDate && filters.endDate) {
      const quizDate = new Date(quiz.created_at).setHours(0, 0, 0, 0);
      const start = new Date(filters.startDate).setHours(0, 0, 0, 0);
      const end = new Date(filters.endDate).setHours(23, 59, 59, 999);
      
      if (quizDate < start || quizDate > end) return false;
    }

    return true;
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      dateRange: 'all',
      startDate: '',
      endDate: ''
    });
  };

  // Debug log for state changes
  useEffect(() => {
    console.log('Current state:', {
      loading,
      quizzesCount: quizzes.length,
      filteredQuizzesCount: filteredQuizzes.length,
      searchQuery,
      viewMode,
      hasUser: !!user,
      userId: user?.id,
      user: user,
      quizzesSample: quizzes.slice(0, 2), // Show first 2 quizzes to avoid cluttering the console
      filteredQuizzesSample: filteredQuizzes.slice(0, 2) // Show first 2 filtered quizzes
    });
  }, [loading, quizzes, filteredQuizzes, searchQuery, viewMode, user]);

  return (
    <div className="flex h-screen bg-[#0E0E21] text-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-r border-blue-500/20 overflow-hidden`}>
        <Sidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          loading={sessionsLoading}
          onSelectSession={setCurrentSessionId}
          onCreateSession={createSession}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header with sidebar toggle */}
        <div className="p-4 border-b border-blue-500/20 flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 hover:bg-slate-800 rounded-lg transition-all"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-blue-400" />
            ) : (
              <Menu className="w-5 h-5 text-blue-400" />
            )}
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <button 
              onClick={() => router.push('/chat')}
              className="text-lg font-semibold text-white hover:text-blue-300 transition-colors"
            >
              QuizCraft
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Progress List</h1>
          
          {/* Search and Filter Bar */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search Quiz.."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span>Filter</span>
                  </button>
                  
                  {showFilters && (
                    <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 p-4">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                          <select 
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white text-sm"
                          >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="in_progress">In Progress</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Date Range</label>
                          <select 
                            value={filters.dateRange}
                            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white text-sm mb-2"
                          >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="custom">Custom Range</option>
                          </select>
                          
                          {filters.dateRange === 'custom' && (
                            <div className="space-y-2 mt-2">
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">From</label>
                                <input
                                  type="date"
                                  value={filters.startDate}
                                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">To</label>
                                <input
                                  type="date"
                                  value={filters.endDate}
                                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white text-sm"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between pt-2">
                          <button
                            onClick={resetFilters}
                            className="text-xs text-blue-400 hover:text-blue-300"
                          >
                            Reset Filters
                          </button>
                          <button
                            onClick={() => setShowFilters(false)}
                            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* View Mode Toggles */}
                <div className="hidden sm:flex items-center gap-2 border border-gray-600 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-700' : 'hover:bg-gray-800'} transition-colors`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-700' : 'hover:bg-gray-800'} transition-colors`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`p-2 rounded ${viewMode === 'calendar' ? 'bg-gray-700' : 'hover:bg-gray-800'} transition-colors`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredQuizzes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  {quizzes.length === 0 ? 'No quizzes found' : 'No matching quizzes found'}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {quizzes.length === 0 ? 'Create a new quiz to get started' : 'Try adjusting your search'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuizzes.map((quiz) => (
                  <div 
                    key={quiz.id} 
                    onClick={() => router.push(`/chat?sessionId=${quiz.session_id}`)}
                    className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-colors cursor-pointer hover:bg-gray-700/50 active:bg-gray-700/70"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-white">{quiz.title}</h3>
                        {quiz.description && (
                          <p className="text-gray-400 text-sm mt-1">{quiz.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <div className="bg-blue-900/40 text-blue-300 text-sm font-medium px-3 py-1 rounded-full border border-blue-700/50">
                          {`${quiz.score ?? '0'}/${quiz.total_questions ?? '?'}`}
                        </div>
                        <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
                          quiz.status === 'completed' 
                            ? 'bg-green-900/50 text-green-400' 
                            : 'bg-yellow-900/50 text-yellow-400'
                        }`}>
                          {quiz.status === 'completed' ? 'Completed' : 'In Progress'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}