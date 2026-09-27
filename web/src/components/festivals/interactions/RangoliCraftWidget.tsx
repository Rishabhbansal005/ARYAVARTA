"use client";

import React, { useState } from "react";
import { Sparkles, RefreshCw, Palette } from "lucide-react";
import { audioManager } from "@/lib/audioManager";

interface RangoliCraftWidgetProps {
  data?: {
    pattern?: string;
    colors?: string[];
  };
  personalReflection?: string;
}

const DEFAULT_POWDER_COLORS = [
  { name: "Rice White", hex: "#FFFFFF" },
  { name: "Kumkum Crimson", hex: "#DC2626" },
  { name: "Turmeric Gold", hex: "#F59E0B" },
  { name: "Lotus Pink", hex: "#EC4899" },
  { name: "Peacock Teal", hex: "#0D9488" }
];

export const RangoliCraftWidget: React.FC<RangoliCraftWidgetProps> = ({
  data,
  personalReflection
}) => {
  const [selectedColor, setSelectedColor] = useState(DEFAULT_POWDER_COLORS[0].hex);
  // 6x6 symmetrical grid for sacred Kolam geometry
  const [grid, setGrid] = useState<Record<string, string>>({
    "2-2": "#FFFFFF", "2-3": "#FFFFFF", "3-2": "#FFFFFF", "3-3": "#FFFFFF"
  });

  const filledCount = Object.keys(grid).length;

  const handleCellClick = (r: number, c: number) => {
    // 4-fold sacred symmetry
    const sym1 = `${r}-${c}`;
    const sym2 = `${5 - r}-${c}`;
    const sym3 = `${r}-${5 - c}`;
    const sym4 = `${5 - r}-${5 - c}`;

    setGrid((prev) => ({
      ...prev,
      [sym1]: selectedColor,
      [sym2]: selectedColor,
      [sym3]: selectedColor,
      [sym4]: selectedColor
    }));

    audioManager.playSwaraFrequency(500, 1.25, 0.2);
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-b from-[#181B26] to-[#0D0F16] border border-[#D4AF37]/35 shadow-xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F5E0A0]">
            <Palette className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-[#F5E0A0]">
              Sacred Kolam & Rangoli Geometry
            </h4>
            <span className="text-[11px] text-[#E8DFD1]/60">
              Draw 4-fold symmetrical mandalas with rice powder and flower pigments
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono px-3 py-1 rounded-full border transition-all ${
            filledCount > 0
              ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#F5E0A0] font-bold"
              : "bg-white/5 border-white/10 text-white/50"
          }`}>
            {filledCount > 0 ? `✨ Sacred Mandala Active` : "Empty Dot Grid"}
          </span>

          <button
            onClick={() => setGrid({})}
            className="text-xs text-[#E8DFD1]/60 hover:text-white flex items-center gap-1 cursor-pointer px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Color Powder Palette */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-mono text-[#D4AF37] uppercase mr-1">Powder:</span>
        {DEFAULT_POWDER_COLORS.map((c) => (
          <button
            key={c.name}
            onClick={() => setSelectedColor(c.hex)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border transition-all cursor-pointer ${
              selectedColor === c.hex
                ? "border-white ring-2 ring-white/50 bg-white/10"
                : "border-white/10 bg-white/5"
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: c.hex }} />
            <span className="text-[#E8DFD1] text-[11px]">{c.name}</span>
          </button>
        ))}
      </div>

      {/* Interactive 6x6 Symmetrical Dot Grid */}
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-black/60 border border-white/10">
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, r) =>
            Array.from({ length: 6 }).map((_, c) => {
              const cellColor = grid[`${r}-${c}`];
              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/15 flex items-center justify-center cursor-pointer hover:border-[#D4AF37] transition-all hover:scale-110 active:scale-95 shadow-sm"
                  style={{ backgroundColor: cellColor || "rgba(255,255,255,0.03)" }}
                >
                  {!cellColor && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                  )}
                </div>
              );
            })
          )}
        </div>
        <span className="mt-3 text-[11px] font-mono text-[#D4AF37]/80">
          Tap any dot — 4-fold sacred symmetry mirrors automatically!
        </span>
      </div>

      {/* 3. Meaningful Completion Reflection */}
      {filledCount >= 4 && (
        <div className="p-4 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 space-y-1.5 animate-fadeIn shadow-lg shadow-[#D4AF37]/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Sacred Threshold Mandala
            </span>
            <span className="text-[10px] font-mono text-[#D4AF37]/70">
              4-Fold Sacred Symmetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#F5E0A0] font-serif leading-relaxed italic">
            "{personalReflection
              ? `Your welcoming intention for "${personalReflection}" is woven into this symmetrical Kolam — greeting every threshold visitor with divine harmony, just as rice flour patterns feed the earth and bless the home.`
              : `The sacred 4-fold mandala graces the threshold — harmonizing cosmic geometry with household hospitality to welcome auspicious energy.`}"
          </p>
        </div>
      )}
    </div>
  );
};
