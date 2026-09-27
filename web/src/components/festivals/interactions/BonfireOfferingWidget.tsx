"use client";

import React, { useState } from "react";
import { Flame, Sparkles } from "lucide-react";
import { audioManager } from "@/lib/audioManager";

interface BonfireOfferingWidgetProps {
  data?: {
    chant?: string;
    significance?: string;
  };
  personalReflection?: string;
}

export const BonfireOfferingWidget: React.FC<BonfireOfferingWidgetProps> = ({
  data,
  personalReflection
}) => {
  const [offeringsCount, setOfferingsCount] = useState<number>(0);
  const [flameIntensity, setFlameIntensity] = useState<number>(1);

  const handleOffer = (item: string) => {
    setOfferingsCount((c) => c + 1);
    setFlameIntensity((prev) => Math.min(prev + 0.15, 1.8));
    audioManager.playSwaraFrequency(240, 1.5, 0.4);
    setTimeout(() => {
      setFlameIntensity(1);
    }, 2000);
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-b from-[#1E1510] to-[#0D0B08] border border-amber-600/35 shadow-xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-amber-200">
              Lohri & Harvest Bonfire • Agni Parikrama
            </h4>
            <span className="text-[11px] text-[#E8DFD1]/60">
              Toss sesame rewri, puffed corn, and winter jaggery into the crackling flames
            </span>
          </div>
        </div>

        <span className={`text-xs font-mono px-3 py-1 rounded-full border transition-all ${
          offeringsCount > 0
            ? "bg-amber-500/20 border-amber-400 text-amber-200 font-bold"
            : "bg-white/5 border-white/10 text-white/50"
        }`}>
          {offeringsCount > 0 ? `🔥 ${offeringsCount} Offerings Consumed` : "Awaiting Sacred Offering"}
        </span>
      </div>

      {/* Visual Crackling Bonfire Stage */}
      <div className="relative py-8 flex flex-col items-center justify-center rounded-2xl bg-black/60 border border-white/10 overflow-hidden">
        {/* Animated Fire Hearth */}
        <div className="relative flex flex-col items-center">
          {/* Flame Core with dynamic scale */}
          <div
            className="w-16 h-24 bg-gradient-to-t from-red-600 via-amber-500 to-yellow-200 rounded-full blur-[2px] transition-transform duration-300 animate-pulse"
            style={{
              transform: `scale(${flameIntensity})`,
              boxShadow: "0 0 45px rgba(245, 158, 11, 0.6)"
            }}
          />

          {/* Wooden Logs criss-crossed */}
          <div className="w-36 h-6 -mt-3 flex items-center justify-center relative">
            <div className="w-32 h-3.5 bg-[#4A2610] rounded-full rotate-6 shadow-md border-t border-amber-900" />
            <div className="absolute w-32 h-3.5 bg-[#361B0B] rounded-full -rotate-6 shadow-md" />
          </div>
        </div>
      </div>

      {/* Offerings Buttons */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-amber-300 uppercase">Toss into Sacred Flames:</span>
        <div className="grid grid-cols-3 gap-2">
          {["Sesame Rewri", "Popped Corn (Kheel)", "Winter Peanuts"].map((item) => (
            <button
              key={item}
              onClick={() => handleOffer(item)}
              className="px-3 py-2 rounded-xl text-xs bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              + Toss {item}
            </button>
          ))}
        </div>
      </div>

      {/* Oral Folklore Chant */}
      {data?.chant && (
        <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 text-center">
          <p className="font-serif text-xs sm:text-sm text-amber-200 italic font-bold">
            "{data.chant}"
          </p>
        </div>
      )}

      {/* 3. Meaningful Completion Reflection */}
      {offeringsCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/50 border border-amber-500/40 space-y-1.5 animate-fadeIn shadow-lg shadow-amber-900/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Harvest Flame Blessing
            </span>
            <span className="text-[10px] font-mono text-amber-300/60">
              {offeringsCount} {offeringsCount === 1 ? "Offering" : "Offerings"} Consumed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-amber-100 font-serif leading-relaxed italic">
            "{personalReflection
              ? `Your hope for "${personalReflection}" joins the rising flames — carrying your family's prayers into the winter night just as generations have done around the Lohri fire.`
              : `Your offering joins the sacred flames in reverence for nature's bounty and the winter harvest.`}"
          </p>
        </div>
      )}
    </div>
  );
};
