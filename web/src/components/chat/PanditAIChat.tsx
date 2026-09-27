"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Bot, User, Volume2, X, Send, Compass } from "lucide-react";
import { audioManager } from "@/lib/audioManager";
import { useLanguage } from "@/context/LanguageContext";
import { StructuredHeritageMessage } from "./StructuredHeritageMessage";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface CulturalGuideChatProps {
  initialPrompt?: string | null;
  onClearInitialPrompt?: () => void;
}

export const PanditAIChat: React.FC<CulturalGuideChatProps> = ({
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "नमस्ते! Welcome to Āryāvarta. I am your Cultural Guide (संस्कृति मार्गदर्शक). Inquire with me about ancient temple architecture, classical ragas, Natya Shastra dance mudras, or 5,000 years of Bhartiya civilizational heritage.",
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle external trigger prompts
  useEffect(() => {
    if (initialPrompt) {
      setIsOpen(true);
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const handleSendMessage = async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const historyPayload = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyPayload }),
      });

      const data = await res.json();
      const replyContent = data.reply || "Unable to retrieve knowledge at this moment. Please ask again.";

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "A temporary connection issue occurred. Please check your connection and ask again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    // Strip markdown tags before speaking
    const cleanText = text.replace(/[#*`_]/g, "").slice(0, 500);
    audioManager.speakNarration(cleanText, language);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#B38F24] text-[#07080B] font-semibold shadow-2xl shadow-[#D4AF37]/30 hover:scale-105 active:scale-95 transition-all duration-300 group border border-[#FFF8E7]/40 cursor-pointer"
          aria-label="Open Cultural Guide"
        >
          <div className="relative">
            <Compass className="w-5 h-5 text-[#07080B] animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
          </div>
          <div className="flex flex-col text-left">
            <span className="tracking-wide text-xs font-bold leading-tight">
              Cultural Guide AI
            </span>
            <span className="text-[10px] text-[#07080B]/80 font-medium">
              संस्कृति मार्गदर्शक
            </span>
          </div>
        </button>
      )}

      {/* Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[480px] h-[620px] max-h-[85vh] bg-[#0E1015]/95 backdrop-blur-xl border border-[#D4AF37]/35 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#171922] via-[#1A1C26] to-[#171922] border-b border-[#D4AF37]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] p-0.5 flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                <div className="w-full h-full rounded-[14px] bg-[#0E1015] flex items-center justify-center">
                  <Compass className="w-5 h-5 text-[#D4AF37]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-sm text-[#E8DFD1]">
                    Cultural Guide AI
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#D4AF37]/20 text-[#D4AF37] font-mono border border-[#D4AF37]/30">
                    Dual AI Engine
                  </span>
                </div>
                <p className="text-[11px] text-[#E8DFD1]/60">
                  संस्कृति मार्गदर्शक • Civilizational Lore & Arts Guide
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#E8DFD1]/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                )}

                <div
                  className={`rounded-2xl leading-relaxed ${
                    m.role === "user"
                      ? "max-w-[85%] p-4 bg-[#D4AF37] text-[#07080B] font-semibold shadow-md shadow-[#D4AF37]/10"
                      : "max-w-[92%] p-4 bg-[#14161F] text-[#E8DFD1] border border-white/10 shadow-xl space-y-3"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <StructuredHeritageMessage
                      content={m.content}
                      onSelectPrompt={(prompt) => handleSendMessage(prompt)}
                      onSpeak={(text) => handleSpeak(text)}
                    />
                  ) : (
                    <>
                      <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                        {m.content}
                      </div>
                      <div className="mt-1 flex items-center justify-end text-[10px] text-[#07080B]/60">
                        <span>{m.timestamp}</span>
                      </div>
                    </>
                  )}
                </div>

                {m.role === "user" && (
                  <div className="w-7 h-7 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-3.5 h-3.5 text-[#E8DFD1]" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-7 h-7 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" />
                </div>
                <div className="bg-[#181B24] border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-[#E8DFD1]/60 font-mono ml-1">
                    Consulting cultural archives...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Preset Suggested Questions */}
          <div className="px-4 py-2 bg-[#12141A] border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
            {[
              "Why are there 24 wheels at Konark?",
              "What is Tribhanga posture in Odissi?",
              "Explain Raag Yaman Prahar time",
              "Who built Brihadisvara Vimana?",
            ].map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-white/5 hover:bg-[#D4AF37]/20 text-[#E8DFD1]/70 hover:text-[#D4AF37] text-[11px] border border-white/10 transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="p-3 bg-[#0E1015] border-t border-[#D4AF37]/20 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Indian heritage, architecture, ragas..."
              className="flex-1 bg-[#181B24] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#E8DFD1] placeholder:text-[#E8DFD1]/40 focus:outline-none focus:border-[#D4AF37]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#07080B] flex items-center justify-center disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
