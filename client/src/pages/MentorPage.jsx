import { useState, useRef, useEffect, useCallback } from "react";
import { mentorChatRequest } from "../utils/api";
import CareerCard from "../components/CareerCard";
import LoadingDots from "../components/LoadingDots";

const SUGGESTIONS = [
  "I feel confused about my future",
  "I don't know which career to choose",
  "How do I switch careers?",
  "I'm stressed about getting a job",
  "What should I do after graduation?",
];

export default function MentorPage({ authUser }) {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      type: "text",
      content: `Hey${authUser?.name ? " " + authUser.name.split(" ")[0] : ""}! 👋 I'm your AI career mentor. I'm here to help you think through anything — career confusion, next steps, decisions, or just clearing your head. What's on your mind?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedCareers, setSavedCareers] = useState([]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const toggleSave = useCallback((career) => {
    setSavedCareers((prev) => {
      const exists = prev.find((c) => c.title === career.title);
      return exists ? prev.filter((c) => c.title !== career.title) : [...prev, career];
    });
  }, []);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", type: "text", content: msg }]);
    setLoading(true);

    try {
      const history = messages.slice(-8).map((m) => ({
        role: m.role,
        content: typeof m.content === "string" ? m.content : "[career results]",
      }));

      const { data } = await mentorChatRequest({ message: msg, history });

      // Determine type robustly
      let type = "text";
      let content = data.reply;
      if (Array.isArray(data.reply)) {
        type = "careers";
      } else if (typeof data.reply !== "string") {
        content = "I had trouble processing that. Could you try again?";
      }

      setMessages((prev) => [...prev, { role: "ai", type, content }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          type: "text",
          content: "I'm having a moment — could you try sending that again?",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="glass border-b border-white/[0.06] px-5 py-4 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-lg">
          🤖
        </div>
        <div>
          <h1 className="font-display font-bold text-white text-base leading-none">AI Career Mentor</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Conversational · Empathetic · Always here</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Online
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {messages.length === 1 && (
          <div className="mt-4 animate-fade-up">
            <p className="text-xs text-zinc-600 text-center mb-3">Try asking about:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:text-zinc-200 hover:border-violet-500/30 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          if (msg.type === "careers" && Array.isArray(msg.content)) {
            return (
              <div key={i} className="animate-fade-up">
                <p className="text-xs text-zinc-500 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center text-xs">🤖</span>
                  Here are some career paths that might suit you:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {msg.content.map((career, idx) => (
                    <CareerCard
                      key={idx}
                      career={career}
                      isSaved={savedCareers.some((c) => c.title === career.title)}
                      onToggleSave={toggleSave}
                      index={idx}
                    />
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-up`}
            >
              {msg.role === "ai" && (
                <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center text-sm mr-2.5 shrink-0 mt-0.5">
                  🤖
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-br-sm shadow-lg shadow-violet-900/30"
                    : "glass-light text-zinc-200 rounded-bl-sm"
                }`}
              >
                {String(msg.content)}
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-sm ml-2.5 shrink-0 mt-0.5">
                  {authUser?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start animate-fade-up">
            <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center text-sm mr-2.5 shrink-0">
              🤖
            </div>
            <div className="glass-light px-4 py-3 rounded-2xl rounded-bl-sm">
              <LoadingDots />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="glass border-t border-white/[0.06] px-4 py-4 shrink-0">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask anything about your career, future, or next steps..."
            rows={1}
            className="input-field flex-1 resize-none"
            style={{ maxHeight: "120px" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="btn-primary px-4 py-3 rounded-xl shrink-0 disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-zinc-700 text-center mt-2">
          Shift+Enter for new line · Enter to send
        </p>
      </div>
    </div>
  );
}
