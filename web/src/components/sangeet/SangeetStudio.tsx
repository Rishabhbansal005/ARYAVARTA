"use client";

import React, { useState, useMemo } from "react";
import {
  Music,
  Play,
  Square,
  Sparkles,
  Volume2,
  Clock,
  CheckCircle,
  Activity,
  Search,
  Filter,
  Layers,
  Heart
} from "lucide-react";
import ragasData from "@/data/ragas_unified.json";
import { Raga } from "@/types";
import { audioManager } from "@/lib/audioManager";
import { useLanguage } from "@/context/LanguageContext";

interface SangeetStudioProps {
  initialRagaId?: string;
}

export const SangeetStudio: React.FC<SangeetStudioProps> = () => {
  const { t } = useLanguage();
  const ragasList: Raga[] = ragasData as unknown as Raga[];
  const [selectedRaga, setSelectedRaga] = useState<Raga>(ragasList[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlayingScale, setIsPlayingScale] = useState(false);
  const [activePhase, setActivePhase] = useState<"arohana" | "avarohana" | null>(null);
  const [activeNoteIdx, setActiveNoteIdx] = useState<number | null>(null);
  const [currentNoteInfo, setCurrentNoteInfo] = useState<{ note: string; freq: number } | null>(null);

  // Microtonal Saptak Swaras with precise frequency ratios (Madhya Saptak: Root 240 Hz)
  const saptakSwaras = [
    { name: "Sa", full: "Shadjam", ratio: 1.0, color: "from-amber-400 to-yellow-600" },
    { name: "Ri", full: "Rishabham", ratio: 9 / 8, color: "from-orange-400 to-amber-600" },
    { name: "Ga", full: "Gandharam", ratio: 5 / 4, color: "from-yellow-400 to-amber-500" },
    { name: "Ma", full: "Madhyamam", ratio: 4 / 3, color: "from-emerald-400 to-teal-600" },
    { name: "Pa", full: "Panchamam", ratio: 3 / 2, color: "from-blue-400 to-indigo-600" },
    { name: "Dha", full: "Dhaivatam", ratio: 5 / 3, color: "from-indigo-400 to-purple-600" },
    { name: "Ni", full: "Nishadham", ratio: 15 / 8, color: "from-purple-400 to-pink-600" },
    { name: "Sa'", full: "Tara Shadjam", ratio: 2.0, color: "from-amber-300 to-yellow-500" },
  ];

  // Map Indian note notations to frequency ratios including octaves and shrutis
  const parseNoteToRatio = (token: string): number => {
    let clean = token.trim();
    let octaveMultiplier = 1.0;

    // Mandra Saptak (lower octave marked by dot: N., D., etc.)
    if (clean.includes(".") || clean.startsWith(".")) {
      octaveMultiplier = 0.5;
      clean = clean.replace(/\./g, "");
    }
    // Tara Saptak (higher octave marked by apostrophe: S', R', etc.)
    if (clean.includes("'") || clean.includes("’") || clean.includes("`")) {
      octaveMultiplier = 2.0;
      clean = clean.replace(/['’`]/g, "");
    }

    clean = clean.toUpperCase();

    let baseRatio = 1.0;
    if (clean === "S" || clean === "SA") baseRatio = 1.0;
    else if (clean === "R1" || clean === "RK" || clean === "RE_KOMAL") baseRatio = 16 / 15; // Komal Re
    else if (clean === "R2" || clean === "R" || clean === "RI" || clean === "RE") baseRatio = 9 / 8; // Shuddha Re
    else if (clean === "R3") baseRatio = 75 / 64; // Shatshruti Re
    else if (clean === "G1" || clean === "G2" || clean === "GK" || clean === "GA_KOMAL") baseRatio = 6 / 5; // Komal Ga
    else if (clean === "G3" || clean === "G" || clean === "GA") baseRatio = 5 / 4; // Shuddha Ga
    else if (clean === "M1" || clean === "M" || clean === "MA") baseRatio = 4 / 3; // Shuddha Ma
    else if (clean === "M2" || clean === "MT" || clean === "MA_TEEVRA") baseRatio = 45 / 32; // Teevra Ma
    else if (clean === "P" || clean === "PA") baseRatio = 3 / 2; // Panchama
    else if (clean === "D1" || clean === "DK" || clean === "DHA_KOMAL") baseRatio = 8 / 5; // Komal Dha
    else if (clean === "D2" || clean === "D" || clean === "DHA") baseRatio = 5 / 3; // Shuddha Dha
    else if (clean === "D3") baseRatio = 125 / 72; // Shatshruti Dha
    else if (clean === "N1" || clean === "N2" || clean === "NK" || clean === "NI_KOMAL") baseRatio = 9 / 5; // Komal Ni
    else if (clean === "N3" || clean === "N" || clean === "NI") baseRatio = 15 / 8; // Shuddha Ni
    else baseRatio = 1.0;

    return baseRatio * octaveMultiplier;
  };

  const handlePlaySwara = (ratio: number, name: string) => {
    setCurrentNoteInfo({ note: name, freq: Math.round(240 * ratio * 10) / 10 });
    audioManager.playSwaraFrequency(240, ratio, 0.9);
    setTimeout(() => setCurrentNoteInfo(null), 700);
  };

  // Play the authentic Arohana and Avarohana sequence with precise note lighting
  const handlePlayRagaScale = () => {
    if (isPlayingScale) return;
    setIsPlayingScale(true);

    const arohanaNotes = selectedRaga.arohana ? selectedRaga.arohana.split(/\s+/).filter(Boolean) : ["S", "R2", "G3", "M1", "P", "D2", "N3", "S'"];
    const avarohanaNotes = selectedRaga.avarohana ? selectedRaga.avarohana.split(/\s+/).filter(Boolean) : ["S'", "N3", "D2", "P", "M1", "G3", "R2", "S"];

    const noteDuration = 450;
    const pauseBetween = 250;

    // Step 1: Play Arohana
    arohanaNotes.forEach((note, idx) => {
      setTimeout(() => {
        setActivePhase("arohana");
        setActiveNoteIdx(idx);
        const ratio = parseNoteToRatio(note);
        setCurrentNoteInfo({ note, freq: Math.round(240 * ratio * 10) / 10 });
        audioManager.playSwaraFrequency(240, ratio, 0.85);
      }, idx * noteDuration);
    });

    const arohanaTotalTime = arohanaNotes.length * noteDuration + pauseBetween;

    // Step 2: Play Avarohana
    avarohanaNotes.forEach((note, idx) => {
      setTimeout(() => {
        setActivePhase("avarohana");
        setActiveNoteIdx(idx);
        const ratio = parseNoteToRatio(note);
        setCurrentNoteInfo({ note, freq: Math.round(240 * ratio * 10) / 10 });
        audioManager.playSwaraFrequency(240, ratio, 0.85);

        if (idx === avarohanaNotes.length - 1) {
          setTimeout(() => {
            setIsPlayingScale(false);
            setActivePhase(null);
            setActiveNoteIdx(null);
            setCurrentNoteInfo(null);
          }, 800);
        }
      }, arohanaTotalTime + idx * noteDuration);
    });
  };

  // Filter ragas based on category tabs and search
  const filteredRagas = useMemo(() => {
    return ragasList.filter((r) => {
      // Category match
      let matchCat = true;
      if (categoryFilter === "featured") {
        matchCat = r.is_featured === true;
      } else if (categoryFilter === "melakarta") {
        matchCat = r.is_featured !== true;
      } else if (categoryFilter === "audav") {
        matchCat = Boolean(
          (r.jati && r.jati.toLowerCase().includes("audav")) ||
          (r.swara_count && r.swara_count.includes("5"))
        );
      }

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = Boolean(
        !query ||
        r.name.toLowerCase().includes(query) ||
        (r.thaat && r.thaat.toLowerCase().includes(query)) ||
        (r.jati && r.jati.toLowerCase().includes(query)) ||
        (r.prahar && r.prahar.toLowerCase().includes(query))
      );

      return matchCat && matchSearch;
    });
  }, [ragasList, categoryFilter, searchQuery]);

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#F5E0A0] text-xs tracking-[0.2em]">
          <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>SANGEET • VEDIC FREQUENCIES, RAGAS & SHASTRA</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-gold-gradient tracking-wide">
          Classical Indian Raga Studio
        </h1>
        <p className="max-w-3xl mx-auto text-xs sm:text-sm text-[#E8DFD1]/70 leading-relaxed">
          Experience the authentic melodic scales of Indian Classical Music. Each raga possesses a distinct emotional mood (Rasa), specific time of day (Prahar), and its own unique ascending (Arohana) and descending (Avarohana) melodic signature.
        </p>
      </div>

      {/* Interactive Saptak Swara Synthesizer */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/30 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-[#F5E0A0] flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#D4AF37]" />
              The Live Microtonal Saptak Keyboard
            </h3>
            <p className="text-xs text-[#E8DFD1]/60">
              Click each swara note to hear its pure Vedic harmonic frequency synthesized in real time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {currentNoteInfo && (
              <span className="text-xs text-[#07080B] font-bold px-3 py-1 rounded-full bg-[#D4AF37] font-mono animate-pulse shadow-md">
                Playing: {currentNoteInfo.note} ({currentNoteInfo.freq} Hz)
              </span>
            )}
            <span className="text-[11px] text-[#D4AF37] px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 font-mono">
              Root Frequency: Madhya Sa (240 Hz)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 pt-2">
          {saptakSwaras.map((swara) => {
            const isNoteActive = currentNoteInfo?.note === swara.name;
            return (
              <button
                key={swara.name}
                onClick={() => handlePlaySwara(swara.ratio, swara.name)}
                className={`group relative p-4 rounded-2xl border text-center transition-all duration-200 cursor-pointer active:scale-95 ${
                  isNoteActive
                    ? "border-[#D4AF37] bg-[#D4AF37] text-[#07080B] shadow-lg shadow-[#D4AF37]/40 scale-105"
                    : "border-white/10 bg-white/5 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/10 text-white"
                }`}
              >
                <span className={`block font-cinzel text-2xl font-bold ${isNoteActive ? "text-[#07080B]" : "text-[#F5E0A0]"}`}>
                  {swara.name}
                </span>
                <span className={`block text-[10px] mt-1 truncate ${isNoteActive ? "text-[#07080B]/80 font-semibold" : "text-[#E8DFD1]/60"}`}>
                  {swara.full}
                </span>
                <span className={`block font-mono text-[9px] mt-0.5 ${isNoteActive ? "text-[#07080B]/60" : "text-[#D4AF37]/70"}`}>
                  {(240 * swara.ratio).toFixed(1)} Hz
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Selected Raga Player (Left) + Ragas Catalog Matrix (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Selected Raga Detailed Player */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/40 space-y-6 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#131622] to-[#0A0C12]">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-mono text-[#D4AF37] px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 font-bold">
                {selectedRaga.is_featured ? "⭐ Master Classical Raga" : `Melakarta #${selectedRaga.id}`}
              </span>
              <span className="text-xs text-[#E8DFD1]/70 flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                {selectedRaga.prahar || "Classical Prahar"}
              </span>
            </div>

            <div>
              <h2 className="font-cinzel text-3xl font-bold text-[#F5E0A0]">
                {selectedRaga.name}
              </h2>
              {selectedRaga.description && (
                <p className="text-xs text-[#E8DFD1]/80 mt-2 leading-relaxed">
                  {selectedRaga.description}
                </p>
              )}
            </div>

            {/* Badges for Jati, Rasa, and Thaat */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase block">Structure / Jati</span>
                <span className="font-semibold text-[#E8DFD1] text-[11px] block truncate">
                  {selectedRaga.jati || "Sampoorna"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase block">Emotional Mood / Rasa</span>
                <span className="font-semibold text-[#E8DFD1] text-[11px] block truncate">
                  {selectedRaga.rasa || "Classical Shastra"}
                </span>
              </div>
            </div>

            {/* Play Raga Melody Scale Button */}
            <button
              onClick={handlePlayRagaScale}
              disabled={isPlayingScale}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-xl cursor-pointer ${
                isPlayingScale
                  ? "bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37]/50 animate-pulse"
                  : "bg-gradient-to-r from-[#F5E0A0] via-[#D4AF37] to-[#AA820A] text-[#07080B] hover:brightness-110 shadow-[#D4AF37]/25"
              }`}
            >
              {isPlayingScale ? (
                <>
                  <Activity className="w-4 h-4 animate-spin text-[#D4AF37]" />
                  <span>
                    Playing {activePhase === "arohana" ? "Arohana (Ascending)" : "Avarohana (Descending)"}...
                  </span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{t.playRaga} ({selectedRaga.name})</span>
                </>
              )}
            </button>

            {/* Arohana & Avarohana Sequence Display with Live Note Highlighting */}
            <div className="grid grid-cols-1 gap-3 text-xs">
              {/* Arohana (Ascent) */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#D4AF37] uppercase">
                  <span>Arohana (Ascending Scale)</span>
                  <span className="text-[10px] text-[#E8DFD1]/50">आरोहण</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRaga.arohana ? (
                    selectedRaga.arohana.split(/\s+/).filter(Boolean).map((n, i) => {
                      const isActive = activePhase === "arohana" && activeNoteIdx === i;
                      return (
                        <span
                          key={i}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all duration-150 ${
                            isActive
                              ? "bg-[#D4AF37] text-[#07080B] scale-110 shadow-lg shadow-[#D4AF37]/50 ring-2 ring-[#F5E0A0]"
                              : "bg-white/5 text-[#E8DFD1] border border-white/10"
                          }`}
                        >
                          {n}
                        </span>
                      );
                    })
                  ) : (
                    <span className="font-mono text-sm text-[#E8DFD1]">S R2 G3 M1 P D2 N3 S'</span>
                  )}
                </div>
              </div>

              {/* Avarohana (Descent) */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#D4AF37] uppercase">
                  <span>Avarohana (Descending Scale)</span>
                  <span className="text-[10px] text-[#E8DFD1]/50">अवरोहण</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRaga.avarohana ? (
                    selectedRaga.avarohana.split(/\s+/).filter(Boolean).map((n, i) => {
                      const isActive = activePhase === "avarohana" && activeNoteIdx === i;
                      return (
                        <span
                          key={i}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all duration-150 ${
                            isActive
                              ? "bg-[#D4AF37] text-[#07080B] scale-110 shadow-lg shadow-[#D4AF37]/50 ring-2 ring-[#F5E0A0]"
                              : "bg-white/5 text-[#E8DFD1] border border-white/10"
                          }`}
                        >
                          {n}
                        </span>
                      );
                    })
                  ) : (
                    <span className="font-mono text-sm text-[#E8DFD1]">S' N3 D2 P M1 G3 R2 S</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ragas Matrix with Category Filters & Search */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/25 space-y-5 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-cinzel text-xl font-bold text-gold-gradient">
                  Classical Musical Scales Matrix
                </h3>
                <p className="text-xs text-[#E8DFD1]/60">
                  Select any scale to load its unique swaras, emotional mood, and acoustic melody.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#D4AF37]">
                {filteredRagas.length} Scales Available
              </span>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => setCategoryFilter("featured")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  categoryFilter === "featured"
                    ? "bg-[#D4AF37] text-[#07080B] shadow-md shadow-[#D4AF37]/30 font-bold"
                    : "bg-white/5 text-[#E8DFD1]/70 hover:text-white border border-white/5"
                }`}
              >
                ⭐ Master Classical Ragas
              </button>
              <button
                onClick={() => setCategoryFilter("audav")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  categoryFilter === "audav"
                    ? "bg-[#D4AF37] text-[#07080B] shadow-md shadow-[#D4AF37]/30 font-bold"
                    : "bg-white/5 text-[#E8DFD1]/70 hover:text-white border border-white/5"
                }`}
              >
                Audav (5 Notes / Pentatonic)
              </button>
              <button
                onClick={() => setCategoryFilter("melakarta")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  categoryFilter === "melakarta"
                    ? "bg-[#D4AF37] text-[#07080B] shadow-md shadow-[#D4AF37]/30 font-bold"
                    : "bg-white/5 text-[#E8DFD1]/70 hover:text-white border border-white/5"
                }`}
              >
                72 Melakarta Scheme
              </button>
              <button
                onClick={() => setCategoryFilter("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  categoryFilter === "all"
                    ? "bg-[#D4AF37] text-[#07080B] shadow-md shadow-[#D4AF37]/30 font-bold"
                    : "bg-white/5 text-[#E8DFD1]/70 hover:text-white border border-white/5"
                }`}
              >
                All Scales ({ragasList.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search raga by name, that, or mood (e.g. Yaman, Bhoopali, Todi)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-[#E8DFD1] placeholder-[#E8DFD1]/40 focus:outline-none focus:border-[#D4AF37]/60"
              />
            </div>

            {/* Scrollable Grid of Ragas */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredRagas.map((r) => {
                const isSelected = selectedRaga.id === r.id;
                return (
                  <button
                    key={String(r.id)}
                    onClick={() => {
                      setSelectedRaga(r);
                    }}
                    className={`p-3 rounded-xl text-left transition-all border cursor-pointer active:scale-95 ${
                      isSelected
                        ? "bg-[#D4AF37] text-[#07080B] font-bold border-[#D4AF37] shadow-md shadow-[#D4AF37]/30 scale-102"
                        : "bg-white/5 text-[#E8DFD1]/80 border-white/5 hover:border-[#D4AF37]/40 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono ${isSelected ? "text-[#07080B]/70" : "text-[#D4AF37]"}`}>
                        {r.is_featured ? "⭐ Master" : `#${r.id}`}
                      </span>
                      {r.swara_count && (
                        <span className={`text-[9px] font-mono ${isSelected ? "text-[#07080B]/60" : "text-[#E8DFD1]/50"}`}>
                          {r.swara_count}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold truncate block mt-1">
                      {r.name}
                    </span>
                    {r.jati && (
                      <span className={`text-[10px] truncate block mt-0.5 ${isSelected ? "text-[#07080B]/80" : "text-[#E8DFD1]/50"}`}>
                        {r.jati}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
