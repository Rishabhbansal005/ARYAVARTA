"use client";

import React, { useState } from "react";
import { Award, Sparkles, BookOpen } from "lucide-react";
import confetti from "canvas-confetti";
import { audioManager } from "@/lib/audioManager";

interface FlagHoistingWidgetProps {
  data?: {
    saffronMeaning?: string;
    whiteMeaning?: string;
    greenMeaning?: string;
  };
  personalReflection?: string;
}

export const FlagHoistingWidget: React.FC<FlagHoistingWidgetProps> = ({
  data,
  personalReflection
}) => {
  const [isUnfurled, setIsUnfurled] = useState(false);

  const handleUnfurl = () => {
    setIsUnfurled(true);
    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.55 },
      colors: ["#FF9933", "#FFFFFF", "#128807", "#000080"]
    });
    audioManager.playSwaraFrequency(440, 1.5, 0.7);
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-b from-[#181B26] to-[#0D0F16] border border-orange-500/35 shadow-xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-300">
            <Award className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-orange-100">
              Rashtriya Dhwaj • Ceremonial Tricolor Unfurling
            </h4>
            <span className="text-[11px] text-[#E8DFD1]/60">
              Salute the National Flag and celebrate sovereign constitutional values
            </span>
          </div>
        </div>

        <button
          onClick={handleUnfurl}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            isUnfurled
              ? "bg-emerald-500 text-black shadow-lg"
              : "bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:brightness-110 shadow-md"
          }`}
        >
          {isUnfurled ? "Tricolor Unfurled 🇮🇳" : "Unfurl Flag"}
        </button>
      </div>

      {/* Visual Flagstaff Stage */}
      <div className="relative py-8 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-sky-950/40 via-black/60 to-black/80 border border-white/10 overflow-hidden">
        {/* Flagstaff & Fluttering Tiranga */}
        <div className="relative flex items-start">
          {/* Silver/Gold Flagstaff pole */}
          <div className="w-2.5 h-44 bg-gradient-to-r from-stone-400 via-stone-200 to-stone-500 rounded-t-full shadow-2xl relative">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-400 border border-amber-200 shadow-md" />
          </div>

          {/* The Flag */}
          <div
            className={`w-48 sm:w-56 h-32 rounded-r-lg shadow-2xl flex flex-col overflow-hidden transition-all duration-1000 origin-left ${
              isUnfurled
                ? "scale-x-100 opacity-100 rotate-0 animate-pulse"
                : "scale-x-25 opacity-70 -rotate-3"
            }`}
          >
            {/* Saffron Band */}
            <div className="flex-1 bg-[#FF9933] flex items-center justify-end pr-3">
              <span className="text-[9px] font-mono font-bold text-orange-950/60 uppercase">Valour</span>
            </div>
            {/* White Band with 24-Spoked Ashoka Chakra */}
            <div className="flex-1 bg-white flex items-center justify-center relative">
              <div className="w-8 h-8 rounded-full border-2 border-[#000080] flex items-center justify-center animate-[spin_30s_linear_infinite]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#000080]" />
                <div className="absolute inset-0 border border-dashed border-[#000080]/60 rounded-full" />
              </div>
            </div>
            {/* Green Band */}
            <div className="flex-1 bg-[#128807] flex items-center justify-end pr-3">
              <span className="text-[9px] font-mono font-bold text-green-950/60 uppercase">Prosperity</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preamble & Constitutional Commitment */}
      <div className="p-4 rounded-xl bg-black/40 border border-orange-500/20 space-y-2">
        <span className="text-xs text-orange-300 uppercase font-bold tracking-wider flex items-center gap-1.5 font-mono">
          <BookOpen className="w-3.5 h-3.5" />
          Preamble to the Constitution of India
        </span>
        <p className="text-xs text-[#E8DFD1]/80 leading-relaxed italic font-serif">
          "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens: JUSTICE, LIBERTY, EQUALITY and FRATERNITY..."
        </p>
      </div>

      {/* 3. Meaningful Completion Reflection */}
      {isUnfurled && (
        <div className="p-4 rounded-xl bg-orange-950/50 border border-orange-500/40 space-y-1.5 animate-fadeIn shadow-lg shadow-orange-950/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-orange-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              Rashtriya Sankalpa • Sovereign Pledge
            </span>
            <span className="text-[10px] font-mono text-orange-300/60">
              26th January 1950 Living Legacy
            </span>
          </div>
          <p className="text-xs sm:text-sm text-orange-100 font-serif leading-relaxed italic">
            "{personalReflection
              ? `As the Tiranga unfurls against the sky, your commitment to "${personalReflection}" joins the sovereign chorus of 'We, the People of India'.`
              : `The Tricolor flutters with dignity in the morning breeze — an enduring symbol of liberty, equality, and the sovereign spirit of our republic.`}"
          </p>
        </div>
      )}
    </div>
  );
};
