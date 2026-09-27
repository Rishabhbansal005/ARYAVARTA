"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Lightbulb,
  Compass,
  Landmark,
  Palette,
  Flame,
  ArrowRight,
  Copy,
  Check,
  Volume2,
  ChevronRight,
  BookOpen
} from "lucide-react";

interface StructuredHeritageMessageProps {
  content: string;
  onSelectPrompt?: (prompt: string) => void;
  onSpeak?: (text: string) => void;
}

interface ParsedHeritageData {
  isStructured: boolean;
  essence: string;
  highlights: { label: string; text: string }[];
  takeaway: string;
  exploreFurther: string[];
  rawParagraphs: string[];
}

function parseHeritageContent(raw: string): ParsedHeritageData {
  const essenceMatch = raw.match(/###\s*(?:🌟\s*)?Essence\s*\n+([\s\S]*?)(?=\n+###|$)/i);
  const highlightsMatch = raw.match(/###\s*(?:🏛️\s*)?Heritage Highlights\s*\n+([\s\S]*?)(?=\n+###|$)/i);
  const takeawayMatch = raw.match(/###\s*(?:💡\s*)?Fascinating Takeaway\s*\n+([\s\S]*?)(?=\n+###|$)/i);
  const exploreMatch = raw.match(/###\s*(?:🔍\s*)?Explore Further\s*\n+([\s\S]*?)(?=\n+###|$)/i);

  const hasAnySection = Boolean(essenceMatch || highlightsMatch || takeawayMatch);

  if (!hasAnySection) {
    return {
      isStructured: false,
      essence: "",
      highlights: [],
      takeaway: "",
      exploreFurther: [],
      rawParagraphs: raw.split("\n\n").filter(Boolean)
    };
  }

  const essence = essenceMatch ? essenceMatch[1].trim() : "";
  const takeaway = takeawayMatch ? takeawayMatch[1].trim() : "";

  const highlights: { label: string; text: string }[] = [];
  if (highlightsMatch) {
    const lines = highlightsMatch[1].split("\n");
    for (const line of lines) {
      const bulletMatch = line.match(/^[\s*-]+\s*\*\*([^*]+)\*\*:\s*(.*)$/);
      if (bulletMatch) {
        highlights.push({
          label: bulletMatch[1].trim(),
          text: bulletMatch[2].trim()
        });
      } else if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const clean = line.trim().replace(/^[-*]\s*/, "");
        highlights.push({
          label: "Heritage Detail",
          text: clean
        });
      }
    }
  }

  const exploreFurther: string[] = [];
  if (exploreMatch) {
    const lines = exploreMatch[1].split("\n");
    for (const line of lines) {
      const clean = line.replace(/^[\s*-]+\s*/, "").replace(/[?.]*$/, "?").trim();
      if (clean && clean.length > 5 && !exploreFurther.includes(clean)) {
        exploreFurther.push(clean);
      }
    }
  }

  return {
    isStructured: true,
    essence,
    highlights,
    takeaway,
    exploreFurther: exploreFurther.slice(0, 3),
    rawParagraphs: []
  };
}

function getHighlightIcon(label: string) {
  const lower = label.toLowerCase();
  if (lower.includes("origin") || lower.includes("context") || lower.includes("dynasty") || lower.includes("history")) {
    return <Landmark className="w-3.5 h-3.5 text-[#D4AF37]" />;
  }
  if (lower.includes("art") || lower.includes("mastery") || lower.includes("technique") || lower.includes("scientific") || lower.includes("architecture")) {
    return <Palette className="w-3.5 h-3.5 text-amber-400" />;
  }
  if (lower.includes("living") || lower.includes("tradition") || lower.includes("culture") || lower.includes("modern")) {
    return <Flame className="w-3.5 h-3.5 text-orange-400" />;
  }
  return <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />;
}

function renderFormattedInline(text: string) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="text-[#F5E0A0] font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </>
  );
}

export const StructuredHeritageMessage: React.FC<StructuredHeritageMessageProps> = ({
  content,
  onSelectPrompt,
  onSpeak
}) => {
  const [copied, setCopied] = useState(false);
  const parsed = parseHeritageContent(content);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Fallback for unformatted general chat messages
  if (!parsed.isStructured) {
    return (
      <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed">
        {parsed.rawParagraphs.map((para, i) => {
          // Render markdown bold and bullets nicely
          const formatted = para.split("\n").map((line, lineIdx) => {
            if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
              const item = line.trim().replace(/^[-*]\s*/, "");
              return (
                <li key={lineIdx} className="ml-3 list-disc text-[#E8DFD1]/90">
                  {renderFormattedInline(item)}
                </li>
              );
            }
            return (
              <p key={lineIdx} className="text-[#E8DFD1]/90">
                {renderFormattedInline(line)}
              </p>
            );
          });
          return <div key={i} className="space-y-1">{formatted}</div>;
        })}

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] text-[#E8DFD1]/50 hover:text-[#D4AF37] transition-colors p-1"
            title="Copy text"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
          {onSpeak && (
            <button
              onClick={() => onSpeak(content)}
              className="flex items-center gap-1 text-[10px] text-[#E8DFD1]/50 hover:text-[#D4AF37] transition-colors p-1"
              title="Listen with Indian Voice"
            >
              <Volume2 className="w-3 h-3" />
              <span>Listen</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. Structured Heritage Layout
  return (
    <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed font-sans">
      {/* A. Essence Header Card */}
      {parsed.essence && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1C1E2A] via-[#161822] to-[#12141D] border border-[#D4AF37]/35 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-2xl group-hover:bg-[#D4AF37]/10 transition-all pointer-events-none" />
          
          <div className="flex items-center justify-between mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F5E0A0] text-[10px] font-mono tracking-wider font-semibold uppercase">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              Core Essence
            </span>
          </div>

          <p className="text-[#F5E8D2] font-serif text-[13px] sm:text-sm leading-relaxed italic">
            &ldquo;{renderFormattedInline(parsed.essence)}&rdquo;
          </p>
        </div>
      )}

      {/* B. Heritage Highlights Grid */}
      {parsed.highlights.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#D4AF37]/90 px-1 font-bold">
            <BookOpen className="w-3 h-3 text-[#D4AF37]" />
            <span>Heritage Pillars & Mastery</span>
          </div>

          <div className="space-y-1.5">
            {parsed.highlights.map((h, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-[#D4AF37]/40 transition-all space-y-1 group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-white/5 border border-white/10 group-hover:border-[#D4AF37]/30">
                    {getHighlightIcon(h.label)}
                  </div>
                  <span className="font-semibold text-xs text-[#F5E0A0] tracking-wide font-sans">
                    {h.label}
                  </span>
                </div>
                <p className="text-[#E8DFD1]/85 text-xs pl-7 leading-relaxed font-sans">
                  {renderFormattedInline(h.text)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* C. Fascinating Takeaway Banner */}
      {parsed.takeaway && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#19150E] to-amber-950/20 border border-[#D4AF37]/40 flex items-start gap-2.5 shadow-md">
          <div className="p-1.5 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4 text-[#F5E0A0]" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#F5E0A0] block">
              Fascinating Takeaway
            </span>
            <p className="text-xs text-[#E8DFD1]/90 leading-relaxed font-sans">
              {renderFormattedInline(parsed.takeaway)}
            </p>
          </div>
        </div>
      )}

      {/* D. Interactive Exploration Chips */}
      {parsed.exploreFurther.length > 0 && onSelectPrompt && (
        <div className="pt-1 space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8DFD1]/50 block px-1">
            Explore deeper with one click:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {parsed.exploreFurther.map((q, i) => (
              <button
                key={i}
                onClick={() => onSelectPrompt(q)}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#D4AF37]/15 border border-white/10 hover:border-[#D4AF37]/50 text-left text-[11px] text-[#E8DFD1]/85 hover:text-[#F5E0A0] transition-all cursor-pointer shadow-sm"
              >
                <span>{q}</span>
                <ChevronRight className="w-3 h-3 text-[#D4AF37] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between border-t border-white/5 text-[10px] text-[#E8DFD1]/50">
        <span className="font-mono text-[9px] text-[#D4AF37]/70">
          Āryāvarta Civilizational Knowledge Engine
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 hover:text-[#D4AF37] transition-colors p-1 cursor-pointer"
            title="Copy summary"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
          {onSpeak && (
            <button
              onClick={() => onSpeak(content)}
              className="flex items-center gap-1 hover:text-[#D4AF37] transition-colors p-1 cursor-pointer"
              title="Listen with Indian Voice"
            >
              <Volume2 className="w-3 h-3" />
              <span>Listen</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
