"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Compass } from "lucide-react";

interface HeritageLoadingScreenProps {
  onComplete?: () => void;
  minDuration?: number;
  customMessage?: string;
  isOverlay?: boolean;
}

const SOOTHING_STAGES = [
  { threshold: 20, text: "Illuminating ancient stonecraft & architectural marvels…" },
  { threshold: 45, text: "Resonating with classical ragas & melodic traditions…" },
  { threshold: 70, text: "Tracing the grace of classical rhythms, mudras & dance…" },
  { threshold: 88, text: "Gathering the living arts, crafts & wisdom of Bharat…" },
  { threshold: 99, text: "Opening the gates to Āryāvarta…" },
  { threshold: 100, text: "Welcome to Āryāvarta" },
];

export const HeritageLoadingScreen: React.FC<HeritageLoadingScreenProps> = ({
  onComplete,
  minDuration = 2200,
  customMessage,
  isOverlay = true,
}) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(100, Math.floor((elapsed / minDuration) * 100));

      setProgress(rawProgress);

      if (rawProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            onComplete?.();
          }, 700);
        }, 300);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [minDuration, onComplete]);

  const currentStage =
    customMessage ||
    SOOTHING_STAGES.find((s) => progress <= s.threshold)?.text ||
    "Preparing your cultural sanctuary…";

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete?.();
    }, 300);
  };

  return (
    <div
      className={`${
        isOverlay ? "fixed inset-0 z-[9999]" : "relative w-full h-full min-h-[520px]"
      } flex flex-col items-center justify-center bg-[#060709] text-[#E8DFD1] overflow-hidden select-none transition-all duration-1000 ${
        isFadingOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* ── Meditative Soft Breathing Aura Background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft, slow breathing radial core (warm amber & celestial gold) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-3xl opacity-20 pointer-events-none transition-opacity duration-1000"
          style={{
            background: "radial-gradient(circle, rgba(212,175,55,0.35) 0%, rgba(200,90,50,0.12) 45%, transparent 70%)",
            animation: "pulse 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full blur-2xl opacity-30 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(245,224,160,0.4) 0%, rgba(212,175,55,0.15) 50%, transparent 80%)",
          }}
        />
      </div>

      {/* ── Subtle Geometric Lattice Background (Jaali) ── */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Peaceful Ambient Firefly Embers ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#D4AF37] opacity-30"
            style={{
              width: (i % 3) + 1.2,
              height: (i % 3) + 1.2,
              top: `${(i * 19) % 100}%`,
              left: `${(i * 29) % 100}%`,
              animation: `pulse ${3 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${(i % 6) * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* ── Delicate Corner Architectural Filigree ── */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-[#D4AF37]/25 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-[#D4AF37]/25 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-[#D4AF37]/25 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-[#D4AF37]/25 rounded-br-lg pointer-events-none" />

      {/* ── Central Hero: Blooming Golden Lotus & Astronomical Wheel (Universal & Secular) ── */}
      <div className="relative z-10 flex flex-col items-center max-w-lg px-6 text-center space-y-7">
        
        {/* Hypnotic Lotus & Celestial Wheel */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
          
          {/* Outer Breathing Soft Glow Ring */}
          <div className="absolute inset-1 rounded-full border border-[#D4AF37]/15 animate-ping opacity-20 pointer-events-none" />

          {/* 1. Outer Astronomical Wheel (24 spokes - Solar Cycle of Seasons & Astronomy) */}
          <svg
            className="absolute inset-0 w-full h-full animate-[spin_36s_linear_infinite]"
            viewBox="0 0 200 200"
          >
            <circle
              cx="100"
              cy="100"
              r="94"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="0.8"
              strokeOpacity="0.3"
            />
            <circle
              cx="100"
              cy="100"
              r="86"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1"
              strokeDasharray="4 6"
              strokeOpacity="0.5"
            />
            {/* 24 Rays representing time, astronomy & architectural precision */}
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 360) / 24;
              return (
                <line
                  key={i}
                  x1="100"
                  y1="14"
                  x2="100"
                  y2="6"
                  transform={`rotate(${angle} 100 100)`}
                  stroke="#D4AF37"
                  strokeWidth={i % 4 === 0 ? "1.6" : "0.8"}
                  strokeOpacity={i % 4 === 0 ? "0.8" : "0.4"}
                />
              );
            })}
          </svg>

          {/* 2. Middle Blooming Lotus (16 Petals - National Flower of Bharat, Pure Cultural Symbol) */}
          <svg
            className="absolute w-3/4 h-3/4 animate-[spin_24s_linear_infinite_reverse]"
            viewBox="0 0 160 160"
          >
            <circle
              cx="80"
              cy="80"
              r="68"
              fill="none"
              stroke="#F5E0A0"
              strokeWidth="0.8"
              strokeDasharray="5 7"
              strokeOpacity="0.4"
            />
            {/* 16 Lotus Petals with soft golden transparency */}
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i * 360) / 16;
              return (
                <g key={i} transform={`rotate(${angle} 80 80)`}>
                  <path
                    d="M 80 18 Q 90 38 80 54 Q 70 38 80 18"
                    fill="rgba(212,175,55,0.08)"
                    stroke="#D4AF37"
                    strokeWidth="0.9"
                    strokeOpacity="0.75"
                  />
                  {/* Delicate petal vein */}
                  <line
                    x1="80"
                    y1="22"
                    x2="80"
                    y2="46"
                    stroke="#F5E0A0"
                    strokeWidth="0.5"
                    strokeOpacity="0.4"
                  />
                </g>
              );
            })}
          </svg>

          {/* 3. Inner 8-Petal Core Lotus Blossom */}
          <svg
            className="absolute w-1/2 h-1/2 animate-[spin_16s_linear_infinite]"
            viewBox="0 0 100 100"
          >
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 360) / 8;
              return (
                <g key={i} transform={`rotate(${angle} 50 50)`}>
                  <path
                    d="M 50 18 Q 58 32 50 42 Q 42 32 50 18"
                    fill="rgba(245,224,160,0.12)"
                    stroke="#F5E0A0"
                    strokeWidth="1.1"
                    strokeOpacity="0.85"
                  />
                </g>
              );
            })}
          </svg>

          {/* 4. Center Luminous Golden Sun / Pearl Core (Universal, Non-Religious) */}
          <div className="relative z-10 flex items-center justify-center">
            {/* Ambient golden corona ring */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFF6D8] opacity-20 blur-[3px] animate-pulse" />
            
            {/* Radiant core jewel */}
            <div
              className="absolute w-5 h-5 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.9)] flex items-center justify-center"
              style={{
                background: "radial-gradient(circle at 35% 35%, #FFFDF5 0%, #F5E0A0 40%, #D4AF37 75%, #996F15 100%)",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
            </div>
          </div>
        </div>

        {/* ── Soothing Title & Cultural Inscription ── */}
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/5 text-[#F5E0A0] text-[10.5px] tracking-[0.25em] font-mono uppercase">
            <Compass className="w-3 h-3 text-[#D4AF37]" />
            <span>Living Heritage of Bharat</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-[0.2em] uppercase font-cinzel select-none"
            style={{
              background: "linear-gradient(135deg, #FFF8E7 0%, #E2BE5A 45%, #D4AF37 70%, #99731C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Āryāvarta
          </h1>

          {/* Soothing Universal Cultural Inscription */}
          <p className="text-xs sm:text-sm text-[#F5E0A0]/85 font-serif tracking-widest pt-0.5">
            कला • स्थापत्यम् • सङ्गीतम् • नृत्यम्
          </p>
          <p className="text-[11px] text-[#E8DFD1]/55 tracking-wider font-light">
            A Journey Through 5,000 Years of Art, Architecture & Living Traditions
          </p>
        </div>

        {/* ── Soothing Minimalist Progress Bar & Live Stage Status ── */}
        <div className="w-full max-w-sm space-y-3 pt-1">
          {/* Hairline Luxury Progress Bar */}
          <div className="relative w-full h-[3px] bg-white/5 rounded-full overflow-hidden border border-[#D4AF37]/20 shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-200 ease-out relative"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #99731C 0%, #D4AF37 50%, #FFF8E7 100%)",
                boxShadow: "0 0 10px rgba(212, 175, 55, 0.6)",
              }}
            >
              {/* Soft glide point */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white blur-[1px] rounded-full" />
            </div>
          </div>

          {/* Percentage & Live Soothing Cultural Status */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#E8DFD1]/70 text-[11px] truncate pr-2 font-light flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#D4AF37] shrink-0 animate-spin" />
              {currentStage}
            </span>
            <span className="font-mono text-[#D4AF37] font-semibold text-xs shrink-0 tracking-wider">
              {progress}%
            </span>
          </div>
        </div>

        {/* ── Soothing Enter Button ── */}
        <div className="pt-0.5">
          <button
            type="button"
            onClick={handleSkip}
            className="text-[11px] text-[#E8DFD1]/45 hover:text-[#D4AF37] tracking-[0.2em] uppercase transition-colors duration-300 cursor-pointer flex items-center gap-1.5 hover:underline underline-offset-4"
          >
            <span>Enter Sanctuary</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
