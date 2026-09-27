"use client";

import React, { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";
import { audioManager } from "@/lib/audioManager";

interface ColorSplashWidgetProps {
  data?: {
    colors?: { name: string; hex: string; source: string }[];
  };
  personalReflection?: string;
}

const DEFAULT_HERBAL_COLORS = [
  { name: "Palash Kesari", hex: "#FF5722", source: "Flame of the forest blossom" },
  { name: "Gulal Magenta", hex: "#E91E63", source: "Beetroot and red sandalwood" },
  { name: "Haldi Peela", hex: "#FFC107", source: "Pure wild turmeric powder" },
  { name: "Neem Hara", hex: "#4CAF50", source: "Dried neem and henna leaves" }
];

export const ColorSplashWidget: React.FC<ColorSplashWidgetProps> = ({
  data,
  personalReflection
}) => {
  const colors = data?.colors || DEFAULT_HERBAL_COLORS;
  const [activeColor, setActiveColor] = useState(colors[0]);
  const [splashes, setSplashes] = useState<{ id: number; x: number; y: number; color: string; size: number }[]>([]);

  const triggerSplash = (clientX?: number, clientY?: number) => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: [activeColor.hex, "#FFD700", "#FF1493"]
    });
    audioManager.playSwaraFrequency(320, 1.33, 0.4);

    const newSplash = {
      id: Date.now() + Math.random(),
      x: clientX ? Math.max(10, Math.min(90, clientX)) : Math.random() * 80 + 10,
      y: clientY ? Math.max(10, Math.min(90, clientY)) : Math.random() * 80 + 10,
      color: activeColor.hex,
      size: Math.random() * 40 + 35
    };
    setSplashes((prev) => [...prev.slice(-12), newSplash]);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    triggerSplash(x, y);
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-b from-[#181B26] to-[#0D0F16] border border-pink-500/35 shadow-xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-300">
            <Sparkles className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-pink-200">
              Organic Gulal Utsav • Play of Colors
            </h4>
            <span className="text-[11px] text-[#E8DFD1]/60">
              Traditional herbal pigments derived from forest flora
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono px-3 py-1 rounded-full border transition-all ${
            splashes.length > 0
              ? "bg-pink-500/20 border-pink-400 text-pink-200 font-bold"
              : "bg-white/5 border-white/10 text-white/50"
          }`}>
            {splashes.length > 0 ? `🌸 ${splashes.length} Gulal Splatters` : "Awaiting Play of Colors"}
          </span>

          <button
            onClick={() => setSplashes([])}
            className="text-xs text-[#E8DFD1]/60 hover:text-white flex items-center gap-1 cursor-pointer px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10"
            title="Clear canvas"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Herbal Pigment Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {colors.map((c) => (
          <button
            key={c.name}
            onClick={() => {
              setActiveColor(c);
              triggerSplash();
            }}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              activeColor.name === c.name
                ? "border-white ring-2 ring-white/50 scale-[1.03] shadow-lg"
                : "border-white/10 hover:border-white/30 bg-white/5"
            }`}
            style={{ backgroundColor: `${c.hex}22` }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-4 h-4 rounded-full shadow-md" style={{ backgroundColor: c.hex }} />
              <span className="text-xs font-bold text-white truncate">{c.name}</span>
            </div>
            <span className="text-[10px] text-[#E8DFD1]/70 block truncate leading-tight">
              {c.source}
            </span>
          </button>
        ))}
      </div>

      {/* Interactive Splatter Canvas */}
      <div
        onClick={handleCanvasClick}
        className="relative h-48 sm:h-56 rounded-2xl bg-black/60 border border-white/10 cursor-pointer overflow-hidden flex items-center justify-center select-none"
      >
        <span className="text-xs font-mono text-[#E8DFD1]/40 uppercase tracking-widest pointer-events-none">
          Click anywhere to throw {activeColor.name} Gulal!
        </span>

        {/* Dynamic Pigment Splatters */}
        {splashes.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full pointer-events-none animate-ping-once transition-all duration-300"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              backgroundColor: s.color,
              opacity: 0.75,
              filter: "blur(4px)",
              transform: "translate(-50%, -50%)"
            }}
          />
        ))}
      </div>

      {/* 3. Meaningful Completion Reflection */}
      {splashes.length > 0 && (
        <div className="p-4 rounded-xl bg-pink-950/40 border border-pink-500/40 space-y-1.5 animate-fadeIn shadow-lg shadow-pink-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-pink-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Vasant Rang Communion
            </span>
            <span className="text-[10px] font-mono text-pink-300/70">
              Spring Renewal & Unity
            </span>
          </div>
          <p className="text-xs sm:text-sm text-pink-100 font-serif leading-relaxed italic">
            "{personalReflection
              ? `As the forest gulal colors intermingle, your wish for "${personalReflection}" bursts into vibrant life — washing away social divides in the joyous warmth of Phalguna Purnima.`
              : `The sacred organic colors blend across the canvas — celebrating renewal, dissolving barriers, and welcoming the egalitarian warmth of spring.`}"
          </p>
        </div>
      )}
    </div>
  );
};
