"use client";

import React, { useState } from "react";
import { Moon, Sparkles, Compass, Eye } from "lucide-react";
import { audioManager } from "@/lib/audioManager";

interface NightSkyCrescentWidgetProps {
  data?: {
    lunarPhase?: string;
    calendar?: string;
    greeting?: string;
  };
  personalReflection?: string;
}

export const NightSkyCrescentWidget: React.FC<NightSkyCrescentWidgetProps> = ({
  data,
  personalReflection
}) => {
  const [elevation, setElevation] = useState<number>(35); // degrees above horizon
  const [sighted, setSighted] = useState<boolean>(false);

  const handleSight = () => {
    setSighted(true);
    audioManager.playSwaraFrequency(528, 1.0, 0.9); // Calm spiritual resonance
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0A1813] to-[#050C0A] border border-emerald-500/35 shadow-xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
            <Moon className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-emerald-200">
              Hilal • Crescent Moon Sighting
            </h4>
            <span className="text-[11px] text-[#E8DFD1]/60">
              {data?.calendar || "Islamic Hijri Lunar Calendar"} • 1st of Shawwal
            </span>
          </div>
        </div>

        <span className={`text-xs font-mono px-3 py-1 rounded-full border transition-all ${
          sighted
            ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold"
            : "bg-white/5 border-white/10 text-white/50"
        }`}>
          {sighted ? "🌙 Hilal Sighted (1st of Shawwal)" : "🔭 Scanning Twilight Horizon"}
        </span>
      </div>

      {/* Visual Twilight Celestial Stage */}
      <div className="relative h-56 sm:h-64 rounded-2xl bg-gradient-to-b from-[#030914] via-[#081520] to-[#122A22] border border-emerald-500/25 overflow-hidden flex flex-col justify-between p-4 select-none">
        {/* Subtle Starry field */}
        <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />

        {/* Dynamic Crescent Moon Positioning */}
        <div
          className="absolute transition-all duration-700 ease-out cursor-pointer flex flex-col items-center"
          style={{
            bottom: `${elevation}%`,
            left: "50%",
            transform: "translateX(-50%)"
          }}
          onClick={handleSight}
        >
          {/* Glowing Crescent Graphic */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            {/* Soft Ambient Moon Halo */}
            <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
              sighted ? "bg-emerald-400/40 blur-xl scale-150 animate-pulse" : "bg-white/10 blur-md"
            }`} />

            {/* Exact Waxing Crescent Silhouette */}
            <svg
              className={`w-12 h-12 transition-all duration-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)] ${
                sighted ? "scale-110 text-emerald-200" : "text-emerald-100 hover:scale-105"
              }`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
            </svg>

            {sighted && (
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-emerald-300 animate-spin" />
            )}
          </div>

          <span className="mt-1 text-[10px] font-mono text-emerald-300/80 bg-black/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
            {elevation}° WSW Horizon
          </span>
        </div>

        {/* Western Horizon Line with Minaret Silhouette Motif */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-emerald-200/50 border-b border-emerald-500/20 pb-1">
          <span className="flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            Western Twilight Sky
          </span>
          <span className="font-mono">Solar Sunset: 18:24 IST</span>
        </div>

        {/* Bottom Status / Blessing Banner */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-xs text-[#E8DFD1]/70">
            {sighted ? "Mubarak! The sacred month of Shawwal is announced." : "Drag elevation slider or click the moon to confirm sighting."}
          </span>
          <button
            onClick={handleSight}
            className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              sighted
                ? "bg-emerald-500 text-[#050C0A] shadow-md shadow-emerald-500/30"
                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{sighted ? "Sighted • مبارك" : "Confirm Sighting"}</span>
          </button>
        </div>
      </div>

      {/* Horizon Elevation Slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-[#E8DFD1]/70">
          <span>Sky Horizon Altitude</span>
          <span className="font-mono text-emerald-300">{elevation}° Above Horizon</span>
        </div>
        <input
          type="range"
          min="15"
          max="65"
          value={elevation}
          onChange={(e) => setElevation(Number(e.target.value))}
          className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-emerald-400 border border-emerald-500/30"
        />
      </div>

      {/* Verified Astronomical Note */}
      {data?.greeting && (
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-center">
          <p className="font-serif text-xs sm:text-sm text-emerald-200 font-medium">
            "{data.greeting}"
          </p>
        </div>
      )}

      {/* 3. Meaningful Completion Reflection */}
      {sighted && (
        <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 space-y-1.5 animate-fadeIn shadow-lg shadow-emerald-950/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Shawwal Crescent Benediction
            </span>
            <span className="text-[10px] font-mono text-emerald-300/60">
              1st of Shawwal Confirmed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100 font-serif leading-relaxed italic">
            "{personalReflection
              ? `As the Shawwal crescent appears in the twilight sky, your gratitude for "${personalReflection}" joins millions of greetings of 'Eid Mubarak' echoing across courtyards.`
              : `The delicate Hilal illuminates the horizon — heralding peace, forgiveness, and the warmth of community after thirty days of devotion.`}"
          </p>
        </div>
      )}
    </div>
  );
};
