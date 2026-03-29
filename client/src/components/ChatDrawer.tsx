import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Minus, History, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "react-markdown";
import { useAuth } from "../context/AuthContext";
import { sendMessage, getConversations, getConversation, deleteConversation } from "../services/chat.service";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface ConversationSummary {
  id: string;
  title: string;
  messageCount: number;
  updated_at: string;
}

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

const quickQuestions = [
  "What courses do you offer?",
  "Tell me about placements",
  "What is the fee structure?",
  "How to apply for admissions?",
];

function getWelcomeMessage(name?: string): Message {
  return {
    id: 1,
    text: `Hi ${name?.split(" ")[0] || "there"}! I'm EduReach Bot. Ask me anything about courses, fees, admissions, or campus life.`,
    sender: "bot",
  };
}

export default function ChatDrawer({ open, onClose }: ChatDrawerProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([getWelcomeMessage(user?.name)]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    if (!user) return;
    setLoadingHistory(true);
    try {
      const data = await getConversations();
      setConversations(data);
    } catch {
      // silently fail
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleToggleHistory = () => {
    if (!showHistory) loadConversations();
    setShowHistory(!showHistory);
  };

  const handleLoadConversation = async (id: string) => {
    try {
      const data = await getConversation(id);
      const loadedMessages: Message[] = data.messages.map((m: any, i: number) => ({
        id: i + 1,
        text: m.content,
        sender: m.role === "user" ? "user" : "bot",
      }));
      setMessages(loadedMessages);
      setConversationId(id);
      setShowHistory(false);
    } catch {
      // silently fail
    }
  };

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (conversationId === id) handleNewChat();
    } catch {
      // silently fail
    }
  };

  const handleNewChat = () => {
    setMessages([getWelcomeMessage(user?.name)]);
    setConversationId(null);
    setShowHistory(false);
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || sending) return;

    const userMsg: Message = { id: Date.now(), text: messageText, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const data = await sendMessage(messageText, conversationId || undefined);
      const botMsg: Message = { id: Date.now() + 1, text: data.message, sender: "bot" };
      setMessages((prev) => [...prev, botMsg]);
      if (data.conversationId) setConversationId(data.conversationId);
    } catch {
      const errorMsg: Message = { id: Date.now() + 1, text: "Sorry, something went wrong. Please try again.", sender: "bot" };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          role="log"
          aria-label="Chat with EduReach Bot"
        >
          {/* Header */}
          <div className="bg-maroon px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">EduReach Bot</h3>
                <p className="text-white/70 text-xs">Ask me anything</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {user && (
                <>
                  <button onClick={handleNewChat} className="text-white/70 hover:text-white p-1 transition-colors duration-200" aria-label="New chat" title="New chat">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button onClick={handleToggleHistory} className="text-white/70 hover:text-white p-1 transition-colors duration-200" aria-label="Chat history" title="Chat history">
                    <History className="w-4 h-4" />
                  </button>
                </>
              )}
              <button onClick={onClose} className="text-white/70 hover:text-white p-1 transition-colors duration-200" aria-label="Minimize chat">
                <Minus className="w-4 h-4" />
              </button>
              <button onClick={onClose} className="text-white/70 hover:text-white p-1 transition-colors duration-200" aria-label="Close chat">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* History Panel */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                className="absolute top-[52px] left-0 right-0 bottom-0 bg-white dark:bg-gray-900 z-10 flex flex-col"
                initial={{ x: -380 }}
                animate={{ x: 0 }}
                exit={{ x: -380 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">Chat History</h4>
                  <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" aria-label="Close history">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {loadingHistory ? (
                    <div className="flex items-center justify-center py-10">
                      <div className="w-5 h-5 border-2 border-maroon border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : conversations.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-10">No conversations yet</p>
                  ) : (
                    conversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => handleLoadConversation(conv.id)}
                        className={`w-full text-left px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 group ${
                          conversationId === conv.id ? "bg-maroon/5" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{conv.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{conv.messageCount} messages</p>
                          </div>
                          <button
                            onClick={(e) => handleDeleteConversation(conv.id, e)}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 transition-all duration-150"
                            aria-label="Delete conversation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800" aria-live="polite">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                {msg.sender === "bot" && (
                  <div className="w-6 h-6 bg-maroon rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-maroon text-white rounded-br-sm"
                      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {msg.sender === "bot" ? (
                    <Markdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>,
                        li: ({ children }) => <li>{children}</li>,
                        h1: ({ children }) => <h4 className="font-bold text-sm mb-1">{children}</h4>,
                        h2: ({ children }) => <h4 className="font-bold text-sm mb-1">{children}</h4>,
                        h3: ({ children }) => <h4 className="font-bold text-sm mb-1">{children}</h4>,
                      }}
                    >
                      {msg.text}
                    </Markdown>
                  ) : (
                    msg.text
                  )}
                </div>
                {msg.sender === "user" && (
                  <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </div>
            ))}

            {sending && (
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 bg-maroon rounded-full flex items-center justify-center">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-3 py-2 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          {messages.length === 1 && (
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="text-xs px-2.5 py-1 bg-white dark:bg-gray-700 border border-maroon/20 dark:border-maroon/40 text-maroon dark:text-maroon-light rounded-full hover:bg-maroon hover:text-white transition-colors duration-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                disabled={sending}
                aria-label="Type your message"
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-maroon text-sm disabled:opacity-50 transition-colors duration-200 bg-white dark:bg-gray-800 dark:text-gray-100"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || sending}
                aria-label="Send message"
                className="w-9 h-9 bg-maroon text-white rounded-lg flex items-center justify-center hover:bg-maroon-dark disabled:opacity-50 transition-colors duration-200"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
