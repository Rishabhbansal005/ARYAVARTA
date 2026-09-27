"use client";

import React, { useState } from "react";
import { Flame, Sparkles, Volume2 } from "lucide-react";
import { audioManager } from "@/lib/audioManager";

interface DiyaLightingWidgetProps {
  data?: {
    mantra?: string;
    mantraMeaning?: string;
  };
  personalReflection?: string;
}

export const DiyaLightingWidget: React.FC<DiyaLightingWidgetProps> = ({
  data,
  personalReflection
}) => {
  const [isLit, setIsLit] = useState(false);
  const [diyasLitCount, setDiyasLitCount] = useState(0);

  const handleLightDiya = () => {
    const nextState = !isLit;
    setIsLit(nextState);
    if (nextState) {
      setDiyasLitCount((prev) => prev + 1);
      audioManager.playSwaraFrequency(440, 1.25, 0.7); // Gentle bell resonance
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-b from-[#181B26] to-[#0D0F16] border border-[#D4AF37]/35 shadow-xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F5E0A0]">
            <Flame className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-[#F5E0A0]">
              Deepotsav • Sacred Diya Lighting
            </h4>
            <span className="text-[11px] text-[#E8DFD1]/60">
              Kindle the pure cotton wick with mustard or sesame oil
            </span>
          </div>
        </div>

        <span className={`text-xs font-mono px-3 py-1 rounded-full border transition-all ${
          isLit
            ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#F5E0A0] font-bold shadow-md shadow-[#D4AF37]/20"
            : "bg-white/5 border-white/10 text-white/50"
        }`}>
          {isLit ? `✨ Sacred Jyoti Awakened` : "Awaiting Sacred Flame"}
        </span>
      </div>

      {/* Visual Clay Lamp Stage */}
      <div className="relative py-8 flex flex-col items-center justify-center rounded-2xl bg-black/50 border border-white/5 overflow-hidden">
        {/* Ambient Glow */}
        {isLit && (
          <div className="absolute inset-0 bg-radial from-amber-500/25 via-amber-900/10 to-transparent animate-pulse pointer-events-none" />
        )}

        {/* Diya SVG & Flame */}
        <div
          onClick={handleLightDiya}
          className="relative cursor-pointer group flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
          title={isLit ? "Extinguish Lamp" : "Click to Light Sacred Diya"}
        >
          {/* Flame element */}
          <div
            className={`w-7 h-10 -mb-2 rounded-full transition-all duration-500 ${
              isLit
                ? "bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 shadow-[0_0_35px_#F59E0B] animate-bounce scale-110"
                : "bg-stone-800/80 scale-50 opacity-40"
            }`}
            style={{
              clipPath: "ellipse(50% 50% at 50% 50%)"
            }}
          >
            {isLit && (
              <div className="w-2.5 h-4 bg-white/90 rounded-full mx-auto mt-2 blur-[1px]" />
            )}
          </div>

          {/* Clay Bowl / Diya Vessel */}
          <div className="relative w-36 h-12 rounded-b-[40px] bg-gradient-to-b from-[#8B4513] to-[#5C2E0B] border-t-2 border-[#D4AF37]/50 shadow-2xl flex items-center justify-center">
            {/* Cotton Wick Tip */}
            <div className="absolute -top-1.5 w-1.5 h-3 bg-stone-900 rounded-full" />
            {/* Traditional Terracotta Etchings */}
            <div className="w-28 h-1 border-b border-dashed border-[#F5E0A0]/40" />
          </div>

          <span className="mt-3 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {isLit ? "Diya Illumines The Night (Click to Extinguish)" : "Tap Wick to Kindle Sacred Flame"}
          </span>
        </div>
      </div>

      {/* Sanskrit Shloka & Spiritual Meaning */}
      {data?.mantra && (
        <div className="p-3.5 rounded-xl bg-black/40 border border-[#D4AF37]/20 space-y-1 text-center">
          <p className="font-serif text-xs sm:text-sm text-[#F5E0A0] italic">
            "{data.mantra}"
          </p>
          {data.mantraMeaning && (
            <p className="text-[11px] text-[#E8DFD1]/70">
              {data.mantraMeaning}
            </p>
          )}
        </div>
      )}

      {/* 3. Meaningful Completion Reflection */}
      {isLit && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-[#D4AF37]/40 space-y-1.5 animate-fadeIn shadow-lg shadow-amber-950/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Deepotsav Jyoti Illumination
            </span>
            <span className="text-[10px] font-mono text-[#D4AF37]/70">
              Tamaso Mā Jyotirgamaya
            </span>
          </div>
          <p className="text-xs sm:text-sm text-amber-100 font-serif leading-relaxed italic">
            "{personalReflection
              ? `As the sacred flame kindles in the clay diya, your intention to leave behind "${personalReflection}" is embraced by the light — just as the lamps of Ayodhya banished the darkest night of Kartik Amavasya.`
              : `The sacred flame kindles the darkness — an eternal reminder that light, wisdom, and righteousness triumph over every shadow.`}"
          </p>
        </div>
      )}
    </div>
  );
};
