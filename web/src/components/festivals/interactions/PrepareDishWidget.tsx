"use client";

import React, { useState } from "react";
import { Utensils, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { audioManager } from "@/lib/audioManager";

interface PrepareDishWidgetProps {
  data?: {
    dishName: string;
    origin: string;
    ingredients: string[];
    instructions: string[];
    culturalNote?: string;
  };
  personalReflection?: string;
}

export const PrepareDishWidget: React.FC<PrepareDishWidgetProps> = ({
  data,
  personalReflection
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [activeStep, setActiveStep] = useState<number>(0);

  if (!data) return null;

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => {
      const next = { ...prev, [idx]: !prev[idx] };
      audioManager.playSwaraFrequency(580, 1.0, 0.2);
      return next;
    });
  };

  const allIngredientsChecked = data.ingredients.every((_, idx) => checkedIngredients[idx]);
  const isFinalStep = activeStep === data.instructions.length - 1;

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-b from-[#181B26] to-[#0D0F16] border border-[#D4AF37]/35 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F5E0A0]">
            <Utensils className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-[#F5E0A0]">
              {data.dishName}
            </h4>
            <span className="text-[11px] text-[#E8DFD1]/60">
              {data.origin} • Sacred Festival Gastronomy
            </span>
          </div>
        </div>

        <span className={`text-xs font-mono px-3 py-1 rounded-full border transition-all ${
          isFinalStep || allIngredientsChecked
            ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#F5E0A0] font-bold"
            : "bg-[#D4AF37]/15 border-[#D4AF37]/30 text-[#D4AF37]"
        }`}>
          {isFinalStep
            ? "✨ Dish Prepared & Offered"
            : `Step ${activeStep + 1} of ${data.instructions.length}`}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Ingredients Checklist */}
        <div className="md:col-span-5 p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider font-bold">
              Ingredients
            </span>
            <span className="text-[10px] text-[#E8DFD1]/50">
              Tap to assemble
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
            {data.ingredients.map((ing, idx) => {
              const isChecked = !!checkedIngredients[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleIngredient(idx)}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-between gap-2 cursor-pointer transition-all ${
                    isChecked
                      ? "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#F5E0A0]"
                      : "bg-white/5 border-white/5 text-[#E8DFD1]/70 hover:bg-white/10"
                  }`}
                >
                  <span className={`leading-relaxed ${isChecked ? "line-through opacity-80" : ""}`}>
                    {ing}
                  </span>
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isChecked ? "text-[#D4AF37]" : "text-white/20"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Step-by-Step Cooking Stage */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-black/60 border border-[#D4AF37]/25 space-y-3 min-h-[140px] flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">
                Preparation Stage • Step {activeStep + 1}
              </span>
              <p className="text-xs sm:text-sm text-[#E8DFD1] leading-relaxed font-sans">
                {data.instructions[activeStep]}
              </p>
            </div>

            {/* Step Selector Navigation */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep((p) => Math.max(0, p - 1))}
                className="px-3 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-[#E8DFD1] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous Step
              </button>

              <div className="flex items-center gap-1.5">
                {data.instructions.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                      activeStep === i
                        ? "w-5 bg-[#D4AF37]"
                        : "bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>

              <button
                disabled={activeStep === data.instructions.length - 1}
                onClick={() => {
                  setActiveStep((p) => Math.min(data.instructions.length - 1, p + 1));
                  audioManager.playSwaraFrequency(440, 1.12, 0.3);
                }}
                className="px-3 py-1 rounded-lg text-xs bg-[#D4AF37] text-[#07080B] font-bold hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                Next Step
              </button>
            </div>
          </div>

          {/* Cultural Gastronomy Note */}
          {data.culturalNote && (
            <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-start gap-2 text-xs text-[#F5E0A0]/90">
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>{data.culturalNote}</span>
            </div>
          )}

          {/* 3. Meaningful Completion Reflection */}
          {(isFinalStep || allIngredientsChecked) && (
            <div className="p-4 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 space-y-1.5 animate-fadeIn shadow-lg shadow-[#D4AF37]/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Pakashastra • Sacred Culinary Offering
                </span>
                <span className="text-[10px] font-mono text-[#D4AF37]/70">
                  Annadanam Param Dhanam
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#F5E0A0] font-serif leading-relaxed italic">
                "{personalReflection
                  ? `Your festive memory of "${personalReflection}" infuses this preparation of ${data.dishName} — continuing the sacred tradition where food prepared with love becomes prasad for the community.`
                  : `The preparation of ${data.dishName} is complete — carrying forward the sacred hospitality and seasonal nourishment that has sustained festive gatherings for centuries.`}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
