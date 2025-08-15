import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Mic, Settings, Sun, Moon, Sparkles } from "lucide-react";

export default function App() {
  const [persona, setPersona] = useState("hitesh");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]); // <-- TypeScript types हटा दिए
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(
    () =>
      (typeof window !== "undefined" && localStorage.getItem("theme")) ||
      "light"
  );

  const scrollRef = useRef(null); // <-- HTMLDivElement type हटा दिया

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chat, loading]);

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    const newUserMsg = {
      id: crypto.randomUUID(),
      sender: "user",
      text: trimmed,
    }; // <-- 'as const' हटाया
    setChat((prev) => [...prev, newUserMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/chat", {
        userMessage: trimmed,
        persona,
      });

      const botText = res?.data?.reply ?? "(No reply)";
      setChat((prev) => [
        ...prev,
        { id: crypto.randomUUID(), sender: "bot", text: botText },
      ]);
    } catch (err) {
      console.error(err);
      setChat((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "bot",
          text: "⚠️ Error fetching reply",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // 👇 यहां आपका UI रहेगा (पुराना JSX safe है)
  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0e0f1a] via-[#121528] to-[#0a0b13] dark:from-[#0a0a0a] dark:via-[#0b0d14] dark:to-[#0a0a0a] text-slate-100 selection:bg-indigo-500/30 selection:text-white">
      {/* Glow orbs / gradient accents */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 blur-3xl opacity-30" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-600 blur-3xl opacity-20" />
      </div>

      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 dark:bg-black/10 border-b border-white/10 dark:border-white/5">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 p-[1px]">
                <div className="h-full w-full rounded-full bg-[#1a1f2e] flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    {/* Head */}
                    <rect
                      x="5"
                      y="8"
                      width="14"
                      height="9"
                      rx="4.5"
                      stroke="url(#grad1)"
                      strokeWidth="1.6"
                      fill="none"
                    />
                    {/* Antenna */}
                    <circle cx="12" cy="5.2" r="1.2" fill="url(#grad1)" />
                    <line
                      x1="12"
                      y1="6.4"
                      x2="12"
                      y2="8"
                      stroke="url(#grad1)"
                      strokeWidth="1.6"
                    />
                    {/* Eyes */}
                    <circle cx="9.2" cy="12.5" r="1.2" fill="white" />
                    <circle cx="14.8" cy="12.5" r="1.2" fill="white" />
                    {/* Smile */}
                    <path
                      d="M9 15.2c.9.9 2.1 1.3 3 1.3s2.1-.4 3-1.3"
                      stroke="white"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ff7ce5" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <span className="text-lg font-semibold tracking-tight text-white">
                  NovaChat
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Persona selector */}
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/10 dark:bg-white/5 px-3 py-1.5 border border-white/10">
                <span className="text-xs text-slate-300">Persona</span>
                <select
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  className="bg-transparent text-sm outline-none text-slate-100"
                >
                  <option className="text-black" value="hitesh">
                    Hitesh Sir
                  </option>
                  <option className="text-black" value="piyush">
                    Piyush Sir
                  </option>
                  <option className="text-black" value="default">
                    Default
                  </option>
                </select>
              </div>

              {/* Theme toggle */}

              <button className="grid h-10 w-10 place-content-center rounded-xl border border-white/10 bg-white/10 hover:bg-white/15">
                <Settings className="h-5 w-5 text-slate-200" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative mx-auto flex max-w-3xl flex-col px-3 sm:px-4">
        {/* Frosted chat container */}
        <div className="relative mt-6 flex-1">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 dark:from-white/5 dark:to-white/0 backdrop-blur-xl border border-white/10 shadow-[0_8px_60px_-12px_rgba(0,0,0,0.45)]" />

          {/* Chat Stream */}
          <div
            ref={scrollRef}
            className="h-[calc(100vh-16rem)] sm:h-[calc(100vh-14rem)] overflow-y-auto px-3 sm:px-6 py-6 space-y-4 scroll-smooth"
          >
            <AnimatePresence initial={false}>
              {chat.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 28,
                    mass: 0.6,
                  }}
                  className={`flex w-full ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%]`}>
                    <div
                      className={`relative rounded-2xl px-4 py-3 shadow-lg backdrop-blur-md border
                        ${
                          msg.sender === "user"
                            ? "bg-gradient-to-br from-indigo-600/80 to-fuchsia-600/80 border-white/10 text-white"
                            : "bg-white/60 dark:bg-white/10 text-slate-900 dark:text-slate-100 border-white/10"
                        }`}
                    >
                      {msg.sender === "bot" && (
                        <div className="mb-1.5 flex items-center gap-2 opacity-80">
                          <Bot className="h-4 w-4" />
                          <span className="text-xs">Nova</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap break-words leading-relaxed text-[15px]">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/60 dark:bg-white/10 px-4 py-3 text-slate-800 dark:text-slate-100 backdrop-blur-md">
                    <Bot className="h-4 w-4" />
                    <span className="sr-only">Bot is typing</span>
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-current" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:0.2s]" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Floating Input Bar */}
        <div className="sticky bottom-4 z-40 mx-auto w-full max-w-3xl">
          <div className="mx-2 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_12px_60px_-15px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-2 p-2 sm:p-2.5">
              <button
                className="hidden sm:grid h-11 w-11 place-content-center rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 active:scale-95 transition"
                title="Voice input (coming soon)"
              >
                <Mic className="h-5 w-5 text-slate-100" />
              </button>

              <input
                type="text"
                placeholder="Message Nova…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="flex-1 bg-transparent placeholder:text-slate-300/70 text-[15px] text-slate-100 outline-none px-2 sm:px-3 py-3"
              />

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={sendMessage}
                disabled={loading}
                className="relative inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
              >
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600" />
                <span
                  className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-indigo-500/50 to-fuchsia-500/50 blur-md"
                  aria-hidden
                />
                <span className="relative flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Send
                </span>
              </motion.button>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-slate-300/70">
            AI may display inaccuracies. Verify important info.
          </p>
        </div>
      </main>
    </div>
  );
}
