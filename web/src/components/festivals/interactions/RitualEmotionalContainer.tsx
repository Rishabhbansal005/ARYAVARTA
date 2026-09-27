"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  ShoppingBag,
  Heart,
  ChevronRight,
  Check
} from "lucide-react";
import { RitualEmotionalLayer } from "@/types";

interface RitualEmotionalContainerProps {
  festivalId: string;
  emotionalLayer: RitualEmotionalLayer;
  onNavigateTab?: (tab: string) => void;
  children: (props: {
    personalReflection: string;
    isSoundPlaying: boolean;
    toggleSound: () => void;
  }) => React.ReactNode;
}

export const RitualEmotionalContainer: React.FC<RitualEmotionalContainerProps> = ({
  festivalId,
  emotionalLayer,
  onNavigateTab,
  children
}) => {
  const [personalReflection, setPersonalReflection] = useState<string>("");
  const [isSkipped, setIsSkipped] = useState<boolean>(false);
  const [isCustomEditing, setIsCustomEditing] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>("");
  const [isSoundPlaying, setIsSoundPlaying] = useState<boolean>(false);

  // Audio Context Ref for procedural ambient sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<AudioNode[]>([]);
  const ambientIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Stop ambient sound synthesis
  const stopAmbientSound = () => {
    if (ambientIntervalRef.current) {
      clearInterval(ambientIntervalRef.current);
      ambientIntervalRef.current = null;
    }
    audioNodesRef.current.forEach((node) => {
      try {
        if ("stop" in node && typeof (node as any).stop === "function") {
          (node as any).stop();
        }
        node.disconnect();
      } catch (e) {
        // node already disconnected
      }
    });
    audioNodesRef.current = [];
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      try {
        audioCtxRef.current.close().catch(() => {});
      } catch (e) {}
      audioCtxRef.current = null;
    }
    setIsSoundPlaying(false);
  };

  // Start gentle, subtle procedural ambient sound loop
  const startAmbientSound = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      audioNodesRef.current = [];

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.045, ctx.currentTime); // Gentle and subtle, non-intrusive
      masterGain.connect(ctx.destination);
      audioNodesRef.current.push(masterGain);

      const soundType = emotionalLayer.ambientSound?.type || "temple-bell";

      if (soundType === "fire") {
        // Fire crackle: subtle filtered noise rumble + randomized popping clicks
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99 * b0 + white * 0.05;
          b1 = 0.96 * b1 + white * 0.11;
          b2 = 0.86 * b2 + white * 0.32;
          output[i] = (b0 + b1 + b2) * 0.2;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();
        audioNodesRef.current.push(whiteNoise, filter);

        // Random micro-pops to simulate crackling wood
        ambientIntervalRef.current = setInterval(() => {
          if (!audioCtxRef.current) return;
          try {
            const popOsc = ctx.createOscillator();
            const popGain = ctx.createGain();
            popOsc.type = "triangle";
            popOsc.frequency.setValueAtTime(140 + Math.random() * 220, ctx.currentTime);
            popGain.gain.setValueAtTime(0.04 + Math.random() * 0.03, ctx.currentTime);
            popGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            popOsc.connect(popGain);
            popGain.connect(masterGain);
            popOsc.start();
            popOsc.stop(ctx.currentTime + 0.09);
          } catch (e) {}
        }, 320);

      } else if (soundType === "night-wind") {
        // Twilight wind: gentle swept sine swell + soft 528Hz Vedic harmony
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const windGain = ctx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(110, ctx.currentTime);
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(528, ctx.currentTime); // Solfeggio sacred frequency

        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.setValueAtTime(0.18, ctx.currentTime); // Gentle breathing cycle
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(25, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc1.frequency);

        windGain.gain.setValueAtTime(0.035, ctx.currentTime);
        osc1.connect(windGain);
        osc2.connect(windGain);
        windGain.connect(masterGain);

        osc1.start();
        osc2.start();
        lfo.start();
        audioNodesRef.current.push(osc1, osc2, lfo, windGain, lfoGain);

      } else if (soundType === "ceremonial") {
        // Dignified ceremonial fanfare & conch swell (440Hz / 660Hz harmonic)
        const osc = ctx.createOscillator();
        const sub = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        sub.type = "sine";
        sub.frequency.setValueAtTime(440, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        osc.connect(filter);
        sub.connect(filter);
        filter.connect(masterGain);

        osc.start();
        sub.start();
        audioNodesRef.current.push(osc, sub, filter);

      } else {
        // Temple bell / chimes & hearth ambience
        const baseFreq = soundType === "hearth" ? 180 : 540;
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

        const bellGain = ctx.createGain();
        bellGain.gain.setValueAtTime(0.03, ctx.currentTime);
        osc.connect(bellGain);
        bellGain.connect(masterGain);
        osc.start();
        audioNodesRef.current.push(osc, bellGain);
      }

      setIsSoundPlaying(true);
    } catch (e) {
      console.warn("Ambient sound error:", e);
      setIsSoundPlaying(false);
    }
  };

  const toggleSound = () => {
    if (isSoundPlaying) {
      stopAmbientSound();
    } else {
      startAmbientSound();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  const handleSelectOption = (opt: string) => {
    setPersonalReflection(opt);
    setCustomText("");
    setIsCustomEditing(false);
    setIsSkipped(false);
  };

  const handleCustomTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomText(val);
    setPersonalReflection(val);
    setIsCustomEditing(true);
    setIsSkipped(false);
  };

  const soundLabel = emotionalLayer.ambientSound?.label || "Ritual Ambient Sound";

  return (
    <div className="space-y-4">
      {/* 1. PERSONAL PROMPT BEFORE THE RITUAL ACTION */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#181B26] to-amber-500/10 border border-[#D4AF37]/35 shadow-lg space-y-3.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F5E0A0] text-[11px] font-mono tracking-wider font-semibold">
            <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
            <span>PERSONAL REFLECTION • BEFORE THE RITUAL</span>
          </div>

          {/* Ambient Sound Mute/Unmute Controller */}
          {emotionalLayer.ambientSound && (
            <button
              onClick={toggleSound}
              className={`px-3 py-1 rounded-xl text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                isSoundPlaying
                  ? "bg-amber-500/25 border border-amber-500/50 text-amber-200 shadow-md shadow-amber-500/20"
                  : "bg-white/5 border border-white/10 text-[#E8DFD1]/60 hover:text-white hover:border-[#D4AF37]/40"
              }`}
              title={isSoundPlaying ? "Mute ambient ritual soundscape" : "Play subtle ambient soundscape"}
            >
              {isSoundPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>🔊 {soundLabel}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>🔇 Ambience: {soundLabel}</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Thoughtful, Festival-Specific Question */}
        <div className="space-y-1">
          <h4 className="font-serif font-bold text-sm sm:text-base text-[#F5E0A0] leading-snug">
            {emotionalLayer.personalPrompt.question}
          </h4>
          <p className="text-[11px] text-[#E8DFD1]/60">
            Select an intention below or write your own to weave your spirit into the ritual.
          </p>
        </div>

        {/* Gentle 3-4 Selectable Option Chips */}
        <div className="flex flex-wrap gap-2">
          {emotionalLayer.personalPrompt.options.map((opt) => {
            const isSelected = personalReflection === opt && !isCustomEditing;
            return (
              <button
                key={opt}
                onClick={() => handleSelectOption(opt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#D4AF37] text-[#07080B] font-bold shadow-md shadow-[#D4AF37]/30 scale-102"
                    : "bg-black/40 text-[#E8DFD1]/85 border border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/5"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-[#07080B]" />}
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Text Field & Skip Prompt Control */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <div className="flex-1 min-w-[240px]">
            <input
              type="text"
              value={customText}
              onChange={handleCustomTextChange}
              placeholder={emotionalLayer.personalPrompt.placeholder || "Or write your own thought or prayer..."}
              className="w-full px-3.5 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-[#E8DFD1] placeholder-[#E8DFD1]/40 focus:outline-none focus:border-[#D4AF37]/60"
            />
          </div>

          {personalReflection && !isSkipped ? (
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Intention set
            </span>
          ) : (
            <button
              onClick={() => {
                setIsSkipped(true);
                setPersonalReflection("");
                setCustomText("");
              }}
              className="text-[11px] font-mono text-[#E8DFD1]/40 hover:text-[#E8DFD1]/80 transition-colors cursor-pointer"
            >
              Skip reflection →
            </button>
          )}
        </div>
      </div>

      {/* 2. THE INTERACTIVE RITUAL WIDGET */}
      {children({
        personalReflection,
        isSoundPlaying,
        toggleSound
      })}

      {/* 3. THE "WHY" — REAL CULTURAL MEANING (NOT DECORATIVE FLAVOR TEXT) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/45 border border-[#D4AF37]/30 space-y-2 relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-bold">
          <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>The Sacred Tradition: Why This Ritual Is Performed</span>
        </div>
        <p className="text-xs sm:text-sm text-[#E8DFD1]/90 leading-relaxed font-sans">
          {emotionalLayer.culturalMeaning}
        </p>
      </div>

      {/* 4. OPTIONAL OUTWARD CONNECTION TO BAZAAR & ARTISANS LAYER (WHERE GENUINE) */}
      {emotionalLayer.outwardConnection && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#181B26] via-[#121520] to-[#181B26] border border-white/10 flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-0.5 max-w-xl">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
              Connected Living Heritage: {emotionalLayer.outwardConnection.craftName}
            </span>
            <p className="text-xs text-[#E8DFD1]/70 leading-relaxed">
              {emotionalLayer.outwardConnection.artisanNote}
            </p>
          </div>

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab("bazaar")}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/40 text-xs font-semibold text-[#F5E0A0] transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Explore in Craft Bazaar</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
