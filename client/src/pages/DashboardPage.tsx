import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Phone, BookOpen, User, BarChart3, Clock, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getConversations, getConversationStats, deleteConversation } from "../services/chat.service";

interface ConversationSummary {
  id: string;
  title: string;
  messageCount: number;
  updated_at: string;
}

interface Stats {
  totalConversations: number;
  totalMessages: number;
  firstChat: string | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [stats, setStats] = useState<Stats>({ totalConversations: 0, totalMessages: 0, firstChat: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [convData, statsData] = await Promise.all([getConversations(), getConversationStats()]);
        setConversations(convData);
        setStats(statsData);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      setStats((prev) => ({ ...prev, totalConversations: prev.totalConversations - 1 }));
    } catch {
      // silently fail
    }
  };

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-gray-900">
        <div className="w-8 h-8 border-4 border-maroon border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main id="main-content" className="min-h-screen bg-cream dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here's your EduReach activity overview</p>
        </motion.div>

        {/* Stats + Profile Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-maroon/10 rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-maroon" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Member since {memberSince}
            </div>
          </motion.div>

          {/* Conversations Stat */}
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Conversations</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalConversations}</p>
          </motion.div>

          {/* Messages Stat */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Messages</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalMessages}</p>
          </motion.div>
        </div>

        {/* Recent Conversations */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-heading text-lg font-semibold text-gray-900 dark:text-white">Recent Conversations</h2>
          </div>
          {conversations.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <MessageSquare className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 dark:text-gray-500 text-sm">No conversations yet. Start chatting with EduReach Bot!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {conversations.slice(0, 10).map((conv) => (
                <div key={conv.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 group">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{conv.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {conv.messageCount} messages &middot; {new Date(conv.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(conv.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-2 transition-all duration-150"
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
          <h2 className="font-heading text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => {
                /* Chat opens via FloatingChatButton */
              }}
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-maroon dark:hover:border-maroon transition-colors duration-200 text-left"
            >
              <div className="w-10 h-10 bg-maroon/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-maroon" />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800 dark:text-gray-200">Start New Chat</p>
                <p className="text-xs text-gray-400">Ask EduReach Bot</p>
              </div>
            </button>

            <Link
              to="/#courses"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-maroon dark:hover:border-maroon transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800 dark:text-gray-200">Browse Courses</p>
                <p className="text-xs text-gray-400">Explore programs</p>
              </div>
            </Link>

            <Link
              to="/"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-maroon dark:hover:border-maroon transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800 dark:text-gray-200">Talk to Counselor</p>
                <p className="text-xs text-gray-400">AI voice call</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
