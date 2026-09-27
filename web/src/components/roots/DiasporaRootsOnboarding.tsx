"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  MapPin,
  Sparkles,
  ChevronDown,
  X,
  Search,
  Check,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Volume2,
  AlertCircle,
  HelpCircle,
  Flower2
} from "lucide-react";
import { useLanguage, SUPPORTED_LANGUAGES, LanguageMeta } from "@/context/LanguageContext";
import { ALL_INDIAN_REGIONS, RegionCulturalData } from "@/data/regionsData";
import { matchRegionFromText, MatchResult } from "@/lib/regionMatcher";

interface DiasporaRootsOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onBeginJourney?: (region: RegionCulturalData, language: LanguageMeta) => void;
}

export const DiasporaRootsOnboarding: React.FC<DiasporaRootsOnboardingProps> = ({
  isOpen,
  onClose,
  onBeginJourney
}) => {
  const { language: activeAppLang } = useLanguage();

  // State management
  const [userInput, setUserInput] = useState("");
  const [matchResult, setMatchResult] = useState<MatchResult>({ status: "none", confidence: 0 });
  const [selectedRegion, setSelectedRegion] = useState<RegionCulturalData | null>(null);
  const [selectedLang, setSelectedLang] = useState<LanguageMeta>(
    SUPPORTED_LANGUAGES.find((l) => l.code === activeAppLang) || SUPPORTED_LANGUAGES[0]
  );
  const [isManualSelectorOpen, setIsManualSelectorOpen] = useState(false);
  const [manualSearchQuery, setManualSearchQuery] = useState("");
  const [isAssembling, setIsAssembling] = useState(false);
  const [assemblyProgress, setAssemblyProgress] = useState(0);

  // Prevent background scroll and pause Lenis when modal is active
  useEffect(() => {
    if (isOpen) {
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.stop();
      }
      document.body.style.overflow = "hidden";
    } else {
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.start();
      }
      document.body.style.overflow = "";
    }
    return () => {
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.start();
      }
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Real-time matching logic on user input change
  useEffect(() => {
    if (!userInput.trim()) {
      setMatchResult({ status: "none", confidence: 0 });
      setSelectedRegion(null);
      return;
    }

    const result = matchRegionFromText(userInput);
    setMatchResult(result);

    if (result.status === "exact" || result.status === "fuzzy") {
      if (result.matchedRegion) {
        setSelectedRegion(result.matchedRegion);
      }
    } else if (result.status === "ambiguous") {
      // Keep selectedRegion null until user clarifies
      setSelectedRegion(null);
    } else {
      setSelectedRegion(null);
    }
  }, [userInput]);

  // Assembly step simulation when user confirms
  useEffect(() => {
    if (!isAssembling) {
      setAssemblyProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setAssemblyProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 12;
      });
    }, 280);

    return () => clearInterval(interval);
  }, [isAssembling]);

  if (!isOpen) return null;

  const handleSelectClarification = (region: RegionCulturalData) => {
    setSelectedRegion(region);
    setMatchResult({
      status: "exact",
      matchedRegion: region,
      confidence: 1.0,
      matchedKeyword: region.name
    });
  };

  const handleSelectManualRegion = (region: RegionCulturalData) => {
    setSelectedRegion(region);
    setUserInput(region.name);
    setIsManualSelectorOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRegion) return;

    // Store in session (do not persist permanently yet as requested)
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          "aryavarta_diaspora_roots",
          JSON.stringify({
            regionId: selectedRegion.id,
            regionName: selectedRegion.name,
            languageCode: selectedLang.code,
            rawQuery: userInput,
            timestamp: Date.now()
          })
        );
      } catch (err) {
        console.warn("Could not save diaspora roots to sessionStorage", err);
      }
    }

    // Transition to warm assembly placeholder screen
    setIsAssembling(true);
    if (onBeginJourney) {
      onBeginJourney(selectedRegion, selectedLang);
    }
  };

  const handleReset = () => {
    setIsAssembling(false);
    setUserInput("");
    setSelectedRegion(null);
    setMatchResult({ status: "none", confidence: 0 });
    setIsManualSelectorOpen(false);
  };

  const filteredManualRegions = ALL_INDIAN_REGIONS.filter(
    (r) =>
      r.name.toLowerCase().includes(manualSearchQuery.toLowerCase()) ||
      r.nativeName.toLowerCase().includes(manualSearchQuery.toLowerCase()) ||
      r.aliases.some((a) => a.toLowerCase().includes(manualSearchQuery.toLowerCase()))
  );

  const samplePrompts = [
    { label: "Odisha", query: "Odisha" },
    { label: "Grandmother from Odisha", query: "my grandmother was from Odisha" },
    { label: "Orissa (Historic)", query: "Orissa" },
    { label: "Bengal", query: "Bengal side" },
    { label: "Tamil Nadu", query: "Tamil Nadu side" },
    { label: "Near Bombay", query: "My ancestors were from near Bombay" },
    { label: "Punjab or Haryana", query: "Punjab or Haryana" }
  ];

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isAssembling) onClose();
      }}
    >
      <div
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        style={{ overscrollBehavior: "contain" }}
        className="bg-gradient-to-b from-[#13110E] via-[#0A0C11] to-[#06070A] border border-[#D4AF37]/50 rounded-3xl max-w-2xl w-full p-6 sm:p-9 shadow-2xl relative max-h-[92vh] overflow-y-auto custom-scrollbar my-auto space-y-7"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-[#E8DFD1] hover:text-white flex items-center justify-center cursor-pointer border border-[#D4AF37]/30 transition-all"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ─── STAGE 1: ONBOARDING SCREEN ─── */}
        {!isAssembling ? (
          <>
            {/* Header / Emotional Framing */}
            <div className="space-y-3 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#F5E0A0] text-[11px] font-mono tracking-wider">
                <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>DIASPORA ROOTS MODE • भारतवंशीय मूल अन्वेषणम्</span>
              </div>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-gold-gradient">
                Where Did Your Family Journey Begin?
              </h2>
              <p className="text-xs sm:text-sm text-[#E8DFD1]/75 leading-relaxed font-sans">
                Every river remembers its source. Whether your family emigrated three generations ago or
                you carry memories of a grandparent's hometown, tell us in your own words. We will
                reassemble the sacred architecture, evening ragas, classical dance postures, and living
                crafts of your ancestral homeland.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Conversational Text Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider font-mono">
                  Your Ancestral Homeland or Family Memory
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Where is your family from? (e.g. 'Odisha', 'my grandmother was from Bengal', 'Tamil Nadu side')"
                    className="w-full bg-[#181A22] border-2 border-[#D4AF37]/40 focus:border-[#D4AF37] rounded-2xl px-4 py-3.5 pl-11 text-xs sm:text-sm text-[#E8DFD1] placeholder:text-[#E8DFD1]/40 focus:outline-none transition-all shadow-inner"
                    autoFocus
                  />
                  <MapPin className="w-4 h-4 text-[#D4AF37] absolute left-4 top-1/2 -translate-y-1/2" />
                  {userInput && (
                    <button
                      type="button"
                      onClick={() => setUserInput("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#E8DFD1]/50 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Example Quick-Chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] text-[#E8DFD1]/50 mr-1">Quick test:</span>
                  {samplePrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setUserInput(p.query)}
                      className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 text-[#E8DFD1]/70 hover:text-[#D4AF37] transition-colors cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Match Status Feedback Display ── */}

              {/* A. Confident / Fuzzy Match Found */}
              {selectedRegion && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#D4AF37]/15 via-black/40 to-[#D4AF37]/10 border border-[#D4AF37]/50 space-y-3 animate-in fade-in">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">
                          Identified Ancestral Homeland
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                        <span>{selectedRegion.name}</span>
                        <span className="text-base text-[#D4AF37] font-normal">
                          ({selectedRegion.nativeName})
                        </span>
                      </h3>
                      <p className="text-xs text-[#E8DFD1]/60">
                        {selectedRegion.zone} India • Capital: {selectedRegion.capital}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-full shrink-0 border ${
                        selectedRegion.coverage === "rich"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      }`}
                    >
                      {selectedRegion.coverage === "rich" ? "✨ Deep Archives Ready" : "🌱 Active Research"}
                    </span>
                  </div>

                  {/* Traditions highlight */}
                  {selectedRegion.signatureTraditions && (
                    <div className="text-xs text-[#E8DFD1]/80 space-y-1 pt-1 border-t border-white/10">
                      <span className="text-[10px] font-mono text-[#D4AF37] uppercase block">
                        Preserved Traditions In Our Archives:
                      </span>
                      <p className="leading-relaxed">
                        {selectedRegion.signatureTraditions.join(" • ")}
                      </p>
                    </div>
                  )}

                  {/* In-development graceful handling note */}
                  {selectedRegion.coverage === "in_development" && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200/90 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        We are actively collaborating with cultural scholars to expand full 3D scans
                        and music recordings for {selectedRegion.name}. A foundational ancestral
                        dossier is currently available.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* B. Ambiguous Match (Multiple Regions Detected) */}
              {matchResult.status === "ambiguous" && matchResult.candidates && (
                <div className="p-4 rounded-2xl bg-amber-900/20 border border-amber-500/40 space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
                    <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Multiple ancestral regions detected in your memory</span>
                  </div>
                  <p className="text-xs text-[#E8DFD1]/80 leading-relaxed">
                    We noticed more than one homeland in your description. Which ancestral lineage
                    would you like to explore first?
                  </p>
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {matchResult.candidates.map((cand) => (
                      <button
                        key={cand.id}
                        type="button"
                        onClick={() => handleSelectClarification(cand)}
                        className="px-4 py-2 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 border border-[#D4AF37]/50 text-white font-serif text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>
                          {cand.name} ({cand.nativeName})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* C. Graceful Fallback (No Match Found) */}
              {userInput.trim().length > 3 && matchResult.status === "none" && !selectedRegion && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center gap-2 text-[#E8DFD1]/80 text-xs">
                    <AlertCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>We couldn't pinpoint an exact state from your phrasing.</span>
                  </div>
                  <p className="text-xs text-[#E8DFD1]/60">
                    No problem at all — choose your ancestral state directly from the list below:
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsManualSelectorOpen(!isManualSelectorOpen)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#181A22] border border-[#D4AF37]/30 text-xs text-[#F5E0A0] flex items-center justify-between hover:border-[#D4AF37] transition-all cursor-pointer"
                  >
                    <span>Browse All Available Indian Regions</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Or Click to Browse All Regions Manually */}
              {!selectedRegion && matchResult.status !== "none" && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setIsManualSelectorOpen(!isManualSelectorOpen)}
                    className="text-[11px] font-mono text-[#D4AF37]/80 hover:text-[#D4AF37] hover:underline cursor-pointer"
                  >
                    {isManualSelectorOpen ? "Hide manual region list" : "Or select from all 28+ states manually"}
                  </button>
                </div>
              )}

              {/* Manual Selection Dropdown Panel */}
              {isManualSelectorOpen && (
                <div className="p-3.5 rounded-2xl bg-[#0E1015] border border-[#D4AF37]/30 space-y-2 max-h-56 overflow-y-auto custom-scrollbar animate-in fade-in">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Filter state or territory..."
                      value={manualSearchQuery}
                      onChange={(e) => setManualSearchQuery(e.target.value)}
                      className="w-full bg-[#181A22] border border-white/10 rounded-lg px-3 py-1.5 pl-8 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]"
                    />
                    <Search className="w-3.5 h-3.5 text-[#D4AF37] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {filteredManualRegions.map((reg) => (
                      <button
                        key={reg.id}
                        type="button"
                        onClick={() => handleSelectManualRegion(reg)}
                        className={`p-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between ${
                          selectedRegion?.id === reg.id
                            ? "bg-[#D4AF37]/30 text-white font-semibold border border-[#D4AF37]"
                            : "hover:bg-white/5 text-[#E8DFD1]/80"
                        }`}
                      >
                        <div className="truncate">
                          <span className="text-white block font-serif">{reg.name}</span>
                          <span className="text-[10px] text-[#D4AF37] font-mono block">
                            {reg.nativeName} • {reg.zone}
                          </span>
                        </div>
                        {selectedRegion?.id === reg.id && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Language Selection Dropdown / Selector */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-[#D4AF37] uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Preferred Narration Language</span>
                  </label>
                  <span className="text-[11px] text-[#E8DFD1]/50 font-mono">वर्णन भाषा</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = selectedLang.code === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setSelectedLang(lang)}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-[#D4AF37]/25 border-[#D4AF37] text-white shadow-md shadow-[#D4AF37]/15"
                            : "bg-white/5 border-white/10 hover:border-[#D4AF37]/40 text-[#E8DFD1]/70"
                        }`}
                      >
                        <span className="font-serif font-bold text-xs">{lang.name}</span>
                        <span className="text-[10px] text-[#D4AF37] font-mono">{lang.englishName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={!selectedRegion}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#B38F24] text-[#07080B] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-[#D4AF37]/25 hover:brightness-110 active:scale-98 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Flower2 className="w-4 h-4 text-[#07080B]" />
                  <span>
                    {selectedRegion
                      ? `Reconnect With ${selectedRegion.name} • यात्रा आरम्भ करें`
                      : "Type Your Ancestral Origin Above"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          /* ─── STAGE 2: WARM ASSEMBLY & LOADING PLACEHOLDER SCREEN ─── */
          <div className="py-8 px-2 text-center space-y-6 animate-in zoom-in-95 duration-500">
            {/* Sacred Lotus Pulsing Beacon */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-[#D4AF37]/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D4AF37]/20 via-black to-[#07080B] border-2 border-[#D4AF37] flex items-center justify-center shadow-2xl shadow-[#D4AF37]/30">
                <Compass className="w-10 h-10 text-[#D4AF37] animate-[spin_20s_linear_infinite]" />
              </div>
            </div>

            {/* Personal Warm Loading Message */}
            <div className="space-y-2 max-w-lg mx-auto">
              <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest block">
                Ancestral Assembly in Progress
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-gold-gradient">
                Gathering the Heritage of {selectedRegion?.name} For You...
              </h2>
              {selectedRegion?.nativeName && (
                <p className="font-serif text-lg text-[#F5E0A0]">{selectedRegion.nativeName}</p>
              )}
              <p className="text-xs sm:text-sm text-[#E8DFD1]/75 leading-relaxed pt-1">
                Synthesizing sacred architecture, ancient dynasties, classical dance postures, evening
                ragas, and generational crafts from your ancestral soil in{" "}
                <strong className="text-[#D4AF37]">{selectedLang.name}</strong>.
              </p>
            </div>

            {/* Simulated Assembly Steps */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-[#E8DFD1]/80">
                <span>1. Mapping ancestral coordinates & rivers</span>
                <span className="text-emerald-400">✓ Verified</span>
              </div>
              <div className="flex items-center justify-between text-[#E8DFD1]/80">
                <span>2. Indexing regional dance & sangeet lore</span>
                <span className="text-emerald-400">✓ Indexed</span>
              </div>
              <div className="flex items-center justify-between text-[#E8DFD1]/80">
                <span>3. Connecting fair-trade master artisans</span>
                <span className="text-emerald-400">✓ Linked</span>
              </div>
              <div className="flex items-center justify-between text-[#E8DFD1]/80">
                <span>4. Preparing narration in {selectedLang.englishName}</span>
                <span className="text-[#D4AF37]">Assembly Ready</span>
              </div>
            </div>

            {/* In-development Scholarly Notice if applicable */}
            {selectedRegion?.coverage === "in_development" && (
              <div className="max-w-md mx-auto p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left text-xs text-amber-200/90 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Scholarly Note:</strong> Our comprehensive 3D photogrammetry splats and
                  audio records for {selectedRegion.name} are currently in field research. We will
                  present all foundational living traditions currently preserved in our archives.
                </span>
              </div>
            )}

            {/* Actions for Onboarding Completion / Reset */}
            <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-[#E8DFD1] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Another Region</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onBeginJourney && selectedRegion) {
                    onBeginJourney(selectedRegion, selectedLang);
                  }
                  onClose();
                }}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:brightness-110 text-[#07080B] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/25 flex items-center gap-2"
              >
                <span>Begin Your Ancestral Journey</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
