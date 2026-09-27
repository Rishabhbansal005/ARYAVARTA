"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Landmark,
  MapPin,
  Clock,
  Volume2,
  VolumeX,
  Sliders,
  Shield,
  Compass,
  ArrowRight,
  Award,
  Sparkles,
  BookOpen,
  Search,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Play,
  Pause,
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  Wrench,
  Globe,
  Radio
} from "lucide-react";
import historyData from "@/data/history_self_describing.json";
import { HistoricalEventEntity, HistoryEra } from "@/types";
import { audioManager } from "@/lib/audioManager";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/context/LanguageContext";
import { HistoryMapInset } from "./HistoryMapInset";

interface HistoryAtlasProps {
  onNavigateTab?: (tabId: string) => void;
}

const ERA_CONFIGS: {
  id: HistoryEra | "all";
  label: string;
  sub: string;
  range: [number, number];
  defaultAnchor: number;
}[] = [
  {
    id: "all",
    label: "Pan-Bharat",
    sub: "5,000 Years of Living Civilization",
    range: [-2500, 2026],
    defaultAnchor: -257
  },
  {
    id: "ancient",
    label: "Ancient India",
    sub: "2500 BCE – 550 CE (Harappa, Maurya & Gupta)",
    range: [-2500, 550],
    defaultAnchor: -257
  },
  {
    id: "medieval-imperial",
    label: "Medieval & Imperial",
    sub: "600 CE – 1750 CE (Chola, Hampi, Maratha)",
    range: [600, 1750],
    defaultAnchor: 1010
  },
  {
    id: "freedom-struggle",
    label: "Freedom Struggle",
    sub: "1757 – 1947 CE (1857, Dandi & Swarajya)",
    range: [1757, 1947],
    defaultAnchor: 1857
  },
  {
    id: "modern-republic",
    label: "Modern Republic",
    sub: "1947 – Present (Constitution & ISRO)",
    range: [1947, 2026],
    defaultAnchor: 1950
  }
];

function formatYear(yr: number): string {
  if (yr < 0) return `${Math.abs(yr)} BCE`;
  return `${yr} CE`;
}

function getEraForYear(year: number): HistoryEra {
  if (year <= 550) return "ancient";
  if (year <= 1750) return "medieval-imperial";
  if (year <= 1947) return "freedom-struggle";
  return "modern-republic";
}

export const HistoryAtlas: React.FC<HistoryAtlasProps> = ({ onNavigateTab }) => {
  const { t, language } = useLanguage();
  const currentLangMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || { name: "English", code: "en" };

  const allEvents = useMemo(() => {
    return (historyData.events as HistoricalEventEntity[]).sort((a, b) => a.year - b.year);
  }, []);

  // 1. SINGLE SOURCE OF TRUTH: selectedTimeAnchor (Year value, negative for BCE)
  const [selectedTimeAnchor, setSelectedTimeAnchor] = useState<number>(-257);
  const [selectedEra, setSelectedEra] = useState<HistoryEra | "all">("ancient");
  const [activeEventId, setActiveEventId] = useState<string>("ashokan-edicts-257-bce");
  const [proximityWindow, setProximityWindow] = useState<number>(200); // +/- years
  const [search, setSearch] = useState("");
  const [showDebug, setShowDebug] = useState(false);

  // Audio Narration & Guided Walk States
  const [isNarrating, setIsNarrating] = useState(false);
  const [translatedSubtitle, setTranslatedSubtitle] = useState<string | null>(null);
  const [isWalkThroughMode, setIsWalkThroughMode] = useState(false);
  const isWalkThroughRef = useRef(false);
  isWalkThroughRef.current = isWalkThroughMode;

  // Sync selectedEra with slider movement if in era-specific mode
  useEffect(() => {
    const computedEra = getEraForYear(selectedTimeAnchor);
    if (selectedEra !== "all" && selectedEra !== computedEra) {
      setSelectedEra(computedEra);
    }
  }, [selectedTimeAnchor, selectedEra]);

  // 2. FILTER & SORT CARDS BY PROXIMITY TO selectedTimeAnchor
  const filteredEvents = useMemo(() => {
    let list = allEvents;

    // Filter by search query if user typed
    if (search.trim()) {
      const q = search.toLowerCase();
      return list.filter(
        (ev) =>
          ev.title.en.toLowerCase().includes(q) ||
          ev.title.native.toLowerCase().includes(q) ||
          ev.summary.toLowerCase().includes(q) ||
          ev.location.modernName.toLowerCase().includes(q) ||
          ev.dynasty.some((d) => d.toLowerCase().includes(q))
      );
    }

    // Filter by Era if selectedEra is not "all"
    if (selectedEra !== "all") {
      list = list.filter((ev) => ev.era === selectedEra);
    }

    // Proximity Filter: within [selectedTimeAnchor - proximityWindow, selectedTimeAnchor + proximityWindow]
    let proximityList = list.filter(
      (ev) => Math.abs(ev.year - selectedTimeAnchor) <= proximityWindow
    );

    // If window is tight and yields < 2 events, expand gracefully to nearest 3 events
    if (proximityList.length < 2 && list.length >= 2) {
      const sortedByDistance = [...list].sort(
        (a, b) => Math.abs(a.year - selectedTimeAnchor) - Math.abs(b.year - selectedTimeAnchor)
      );
      proximityList = sortedByDistance.slice(0, 4);
    }

    // Always sort chronologically
    return proximityList.sort((a, b) => a.year - b.year);
  }, [allEvents, selectedTimeAnchor, selectedEra, proximityWindow, search]);

  // Determine currently displayed event in detail view
  const activeEvent = useMemo(() => {
    const found = allEvents.find((e) => e.id === activeEventId);
    if (found) return found;
    return filteredEvents[0] || allEvents[0];
  }, [allEvents, activeEventId, filteredEvents]);

  // Handle Era Tab Click -> Jumps Time Anchor & Slider Handle
  const handleEraSelect = (eraId: HistoryEra | "all") => {
    setSelectedEra(eraId);
    if (isNarrating) {
      audioManager.stopNarration();
      setIsNarrating(false);
      setTranslatedSubtitle(null);
    }
    setIsWalkThroughMode(false);

    const eraCfg = ERA_CONFIGS.find((e) => e.id === eraId);
    if (eraCfg) {
      const newAnchor = eraCfg.defaultAnchor;
      setSelectedTimeAnchor(newAnchor);

      // Find closest event in this era to make active
      const eraEvents = eraId === "all" ? allEvents : allEvents.filter((ev) => ev.era === eraId);
      const closest = eraEvents.reduce((prev, curr) =>
        Math.abs(curr.year - newAnchor) < Math.abs(prev.year - newAnchor) ? curr : prev
      );
      if (closest) setActiveEventId(closest.id);
    }
  };

  // Handle Slider Drag
  const handleSliderChange = (newYear: number) => {
    setSelectedTimeAnchor(newYear);
    setIsWalkThroughMode(false);

    // Find nearest event to automatically highlight
    const closest = allEvents.reduce((prev, curr) =>
      Math.abs(curr.year - newYear) < Math.abs(prev.year - newYear) ? curr : prev
    );
    if (closest) {
      setActiveEventId(closest.id);
    }
  };

  // Stop narration helper
  const stopNarration = () => {
    audioManager.stopNarration();
    setIsNarrating(false);
    setTranslatedSubtitle(null);
    setIsWalkThroughMode(false);
  };

  // Toggle Single Event Narration
  const handleToggleNarration = async (eventToNarrate = activeEvent) => {
    if (isNarrating) {
      stopNarration();
      return;
    }
    if (!eventToNarrate) return;

    setIsNarrating(true);
    setTranslatedSubtitle(null);

    const speechText = `${eventToNarrate.title.en}, ${eventToNarrate.yearLabel}. Ruling Dynasty: ${eventToNarrate.dynasty.join(", ")}. ${eventToNarrate.summary} ${eventToNarrate.detail || ""}`.trim();

    await audioManager.speakNarration(
      speechText,
      language,
      () => {
        setIsNarrating(false);
        setTranslatedSubtitle(null);
        // If in walk-through mode, trigger next chronological step
        if (isWalkThroughRef.current) {
          advanceWalkThrough();
        }
      },
      (translated) => {
        setTranslatedSubtitle(translated);
      }
    );
  };

  // Walk Through Time Mode: Sequentially Advance Through History
  const advanceWalkThrough = () => {
    const currentIndex = allEvents.findIndex((e) => e.id === activeEventId);
    if (currentIndex >= 0 && currentIndex < allEvents.length - 1) {
      const nextEvent = allEvents[currentIndex + 1];
      setActiveEventId(nextEvent.id);
      setSelectedTimeAnchor(nextEvent.year);
      // Small pause before narrating next event
      setTimeout(() => {
        if (isWalkThroughRef.current) {
          handleToggleNarration(nextEvent);
        }
      }, 1200);
    } else {
      setIsWalkThroughMode(false);
      setIsNarrating(false);
    }
  };

  const startWalkThrough = () => {
    if (isWalkThroughMode) {
      stopNarration();
      return;
    }
    setIsWalkThroughMode(true);
    handleToggleNarration(activeEvent);
  };

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#F5E0A0] text-xs tracking-[0.2em]">
          <Landmark className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>ITIHAASA • 5,000 YEARS OF BHARAT’S LIVING CIVILIZATION</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-gold-gradient tracking-wide">
          Interactive History Atlas of Bharat
        </h1>
        <p className="max-w-3xl mx-auto text-xs sm:text-sm text-[#E8DFD1]/70 leading-relaxed">
          Traverse 5,000 years through a synchronized epoch timeline, primary archaeological citations, exact ruling dynasties, and an integrated geographic map.
        </p>

        {/* Action Controls Bar */}
        <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
          {/* Guided Walk Through Time Button */}
          <button
            onClick={startWalkThrough}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              isWalkThroughMode
                ? "bg-[#D4AF37] text-[#07080B] shadow-lg shadow-[#D4AF37]/40 animate-pulse"
                : "bg-black/60 border border-[#D4AF37]/40 text-[#F5E0A0] hover:bg-[#D4AF37]/20"
            }`}
          >
            {isWalkThroughMode ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#D4AF37]" />}
            <span>{isWalkThroughMode ? "Pause Walk Through Time" : "Walk Through Time (Guided Audio Tour)"}</span>
          </button>

          {/* Test/Debug Toggle */}
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-[#E8DFD1]/70 hover:text-white hover:border-[#D4AF37]/40 flex items-center gap-1.5 transition-all"
            title="Inspect state verification & synchronization"
          >
            <Wrench className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{showDebug ? "Hide Verification Panel" : "Verify State Sync"}</span>
          </button>
        </div>
      </div>

      {/* Visible Debug / State Synchronization Verification Mode */}
      {showDebug && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-xs space-y-2 text-amber-200 font-mono shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-1.5">
            <span className="font-bold flex items-center gap-1.5 text-amber-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              SYNCHRONIZED STATE VERIFICATION DASHBOARD
            </span>
            <span className="text-[10px] text-amber-300/80">Single Source of Truth Active</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
            <div>
              <span className="text-amber-400 block">selectedTimeAnchor:</span>
              <span className="font-bold text-white">{selectedTimeAnchor} ({formatYear(selectedTimeAnchor)})</span>
            </div>
            <div>
              <span className="text-amber-400 block">selectedEra:</span>
              <span className="font-bold text-white capitalize">{selectedEra}</span>
            </div>
            <div>
              <span className="text-amber-400 block">Filtered Proximity Cards:</span>
              <span className="font-bold text-white">{filteredEvents.length} events (Window: ±{proximityWindow} yrs)</span>
            </div>
            <div>
              <span className="text-amber-400 block">Active Event:</span>
              <span className="font-bold text-white truncate block">{activeEvent?.id}</span>
            </div>
          </div>
        </div>
      )}

      {/* Era Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ERA_CONFIGS.map((era) => {
          const isSelected = selectedEra === era.id;
          return (
            <button
              key={era.id}
              onClick={() => handleEraSelect(era.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-b from-[#D4AF37]/20 to-black/80 border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-xl shadow-[#D4AF37]/20 scale-[1.02]"
                  : "glass-panel border-white/10 hover:border-[#D4AF37]/40 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-[#F5E0A0] bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
                  {era.id === "all" ? "PAN-BHARAT" : `${formatYear(era.range[0])}`}
                </span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />}
              </div>
              <span className={`block font-cinzel text-xs font-bold ${isSelected ? "text-[#F5E0A0]" : "text-white"}`}>
                {era.label}
              </span>
              <span className="block text-[10px] text-[#E8DFD1]/60 truncate mt-0.5">
                {era.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* SYNCHRONIZED EPOCH TIME SLIDER */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-[#D4AF37]/30 space-y-4 shadow-2xl bg-gradient-to-r from-[#131622] via-[#0A0C12] to-[#131622]">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#F5E0A0]">
              Epoch Chronology Scrubbing Slider
            </h3>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Proximity Window Adjuster */}
            <div className="flex items-center gap-1 bg-black/50 border border-white/10 rounded-full px-2.5 py-1 text-[11px] text-[#E8DFD1]/70">
              <span className="text-[10px] font-mono text-[#D4AF37]">Window:</span>
              {[100, 250, 500].map((w) => (
                <button
                  key={w}
                  onClick={() => setProximityWindow(w)}
                  className={`px-1.5 py-0.5 rounded-md font-mono text-[10px] cursor-pointer transition-all ${
                    proximityWindow === w ? "bg-[#D4AF37] text-black font-bold" : "hover:text-white"
                  }`}
                >
                  ±{w}y
                </button>
              ))}
            </div>

            {/* TIME ANCHOR LABEL (Always matches selectedTimeAnchor) */}
            <span className="text-xs font-mono font-bold px-3.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F5E0A0] shadow-md flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              Time Anchor: {formatYear(selectedTimeAnchor)}
            </span>
          </div>
        </div>

        {/* High-Accuracy Slider Input */}
        <input
          type="range"
          min="-2500"
          max="2024"
          step="25"
          value={selectedTimeAnchor}
          onChange={(e) => handleSliderChange(parseInt(e.target.value, 10))}
          className="w-full accent-[#D4AF37] cursor-pointer h-2.5 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
        />

        {/* Milestone Tick Labels */}
        <div className="flex justify-between text-[10px] font-mono text-[#E8DFD1]/60 pt-1 overflow-x-auto gap-2">
          <span onClick={() => handleSliderChange(-2500)} className="hover:text-[#D4AF37] cursor-pointer">
            2500 BCE (Harappa)
          </span>
          <span onClick={() => handleSliderChange(-322)} className="hover:text-[#D4AF37] cursor-pointer">
            322 BCE (Maurya)
          </span>
          <span onClick={() => handleSliderChange(380)} className="hover:text-[#D4AF37] cursor-pointer">
            380 CE (Guptas)
          </span>
          <span onClick={() => handleSliderChange(1010)} className="hover:text-[#D4AF37] cursor-pointer">
            1010 CE (Cholas)
          </span>
          <span onClick={() => handleSliderChange(1674)} className="hover:text-[#D4AF37] cursor-pointer">
            1674 CE (Swarajya)
          </span>
          <span onClick={() => handleSliderChange(1857)} className="hover:text-[#D4AF37] cursor-pointer">
            1857 CE (Revolution)
          </span>
          <span onClick={() => handleSliderChange(1950)} className="hover:text-[#D4AF37] cursor-pointer">
            1950 CE (Republic)
          </span>
        </div>
      </div>

      {/* Main Grid: Events List & Inset Map (Left 5 Cols) + High-Fidelity Dossier (Right 7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Map Inset + Proximity-Filtered Event Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Map + Timeline Dual View Inset */}
          <HistoryMapInset
            events={filteredEvents}
            activeEvent={activeEvent}
            onSelectEvent={(ev) => {
              setActiveEventId(ev.id);
              setSelectedTimeAnchor(ev.year);
            }}
          />

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search emperor, battle, dynasty, or location..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-[#E8DFD1] placeholder-[#E8DFD1]/40 focus:outline-none focus:border-[#D4AF37]/60"
            />
          </div>

          {/* Cards Header Info */}
          <div className="flex items-center justify-between text-[11px] text-[#E8DFD1]/70 px-1">
            <span>
              Showing {filteredEvents.length} landmark events near <strong className="text-[#F5E0A0]">{formatYear(selectedTimeAnchor)}</strong>
            </span>
            <span className="font-mono text-[10px] text-[#D4AF37]">Sorted Chronologically</span>
          </div>

          {/* Proximity Filtered Event Cards List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredEvents.map((ev) => {
              const isSelected = activeEvent?.id === ev.id;
              const yearDiff = Math.abs(ev.year - selectedTimeAnchor);
              return (
                <div
                  key={ev.id}
                  onClick={() => {
                    setActiveEventId(ev.id);
                    setSelectedTimeAnchor(ev.year);
                    if (isNarrating) {
                      audioManager.stopNarration();
                      setIsNarrating(false);
                      setTranslatedSubtitle(null);
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer space-y-2 relative overflow-hidden ${
                    isSelected
                      ? "bg-gradient-to-r from-[#D4AF37]/25 to-black/90 border-[#D4AF37] shadow-xl shadow-[#D4AF37]/20 scale-[1.01]"
                      : "glass-panel border-white/5 hover:border-[#D4AF37]/40 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F5E0A0]">
                      {ev.yearLabel}
                    </span>

                    {/* ONLY Dynasties Ruling at this Exact Year */}
                    <div className="flex items-center gap-1 overflow-hidden">
                      {ev.dynasty.slice(0, 1).map((d, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono text-[#D4AF37]/90 truncate max-w-[160px] bg-white/5 px-2 py-0.5 rounded border border-white/10"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h4 className="font-cinzel text-sm font-bold text-white leading-snug">
                    {ev.title.en}
                  </h4>

                  <p className="text-xs text-[#E8DFD1]/70 line-clamp-2 leading-relaxed font-sans">
                    {ev.summary}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                    <div className="flex items-center gap-1 text-[#D4AF37]/80 truncate">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{ev.location.modernName}</span>
                    </div>

                    <span className="font-mono text-[#E8DFD1]/50 text-[9px]">
                      {yearDiff === 0 ? "Anchor Point" : `Δ ${yearDiff} yrs`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: High-Fidelity Historical Dossier with Verified Photo, Citations & Cross-Links */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel-gold rounded-3xl border border-[#D4AF37]/40 shadow-2xl overflow-hidden bg-gradient-to-b from-[#131622] via-[#0A0C12] to-[#131622]">
            {/* Hero Image Depicting Specific Site/Artifact */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-black">
              <img
                src={activeEvent.image.url}
                alt={activeEvent.image.altText}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C12] via-[#0A0C12]/50 to-transparent" />

              {/* Floating Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#D4AF37] font-mono font-bold uppercase bg-black/75 px-3 py-1 rounded-full border border-[#D4AF37]/40 backdrop-blur-md flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {activeEvent.yearLabel}
                  </span>

                  {/* Verification Status Badge */}
                  {activeEvent.image.verified ? (
                    <span className="text-[10px] text-emerald-400 bg-black/75 px-2.5 py-1 rounded-full border border-emerald-500/40 backdrop-blur-md flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Verified Site/Artifact
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 bg-black/75 px-2.5 py-1 rounded-full border border-amber-500/40 backdrop-blur-md flex items-center gap-1 font-mono">
                      <HelpCircle className="w-3 h-3 text-amber-400" />
                      Pending Verification
                    </span>
                  )}
                </div>

                {/* Multilingual Voice Narration Button */}
                <button
                  onClick={() => handleToggleNarration(activeEvent)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer ${
                    isNarrating
                      ? "bg-[#D4AF37] text-[#07080B] shadow-lg animate-pulse"
                      : "bg-black/75 border border-[#D4AF37]/40 text-[#F5E0A0] hover:bg-black/90"
                  }`}
                >
                  {isNarrating ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  <span>{isNarrating ? "Stop Audio" : `Listen Chronicle • ${currentLangMeta.name}`}</span>
                </button>
              </div>

              {/* Title & Native Script Overlay */}
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-xs text-[#D4AF37] font-mono uppercase tracking-wider font-bold">
                    Ruling Dynasty: {activeEvent.dynasty.join(", ")}
                  </span>
                </div>

                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  {activeEvent.title.en}
                </h2>
                <p className="text-xs sm:text-sm text-[#F5E0A0]/90 font-serif mt-0.5">
                  {activeEvent.title.native}
                </p>

                {/* Synchronized Bilingual Subtitles */}
                {isNarrating && translatedSubtitle && (
                  <div className="mt-3 p-3 rounded-xl bg-black/85 border border-[#D4AF37]/50 text-[#F5E0A0] text-xs font-serif leading-relaxed animate-fade-in flex items-start gap-2 shadow-2xl backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5 animate-spin" />
                    <span>{translatedSubtitle}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dossier Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Certainty Status Indicator */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                  {activeEvent.certainty === "debated" ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <span className="font-mono text-[11px] text-[#E8DFD1]/80">
                    Scholarly Certainty:{" "}
                    <strong
                      className={
                        activeEvent.certainty === "debated"
                          ? "text-amber-400 capitalize"
                          : "text-emerald-400 capitalize"
                      }
                    >
                      {activeEvent.certainty}
                    </strong>
                  </span>
                </div>
                {activeEvent.certaintyNote && (
                  <span className="text-[11px] text-amber-300/90 font-serif italic max-w-md">
                    Note: {activeEvent.certaintyNote}
                  </span>
                )}
              </div>

              {/* Chronicle Narrative */}
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-[#E8DFD1]/90 leading-relaxed font-sans">
                  {activeEvent.summary}
                </p>

                {activeEvent.detail && (
                  <div className="p-4 rounded-2xl bg-black/40 border border-[#D4AF37]/20 space-y-2">
                    <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-wider flex items-center gap-1.5 font-mono">
                      <BookOpen className="w-3.5 h-3.5" />
                      Detailed Chronicle & Historical Context
                    </span>
                    <p className="text-xs text-[#E8DFD1]/80 leading-relaxed whitespace-pre-line font-sans">
                      {activeEvent.detail}
                    </p>
                  </div>
                )}
              </div>

              {/* "What was happening elsewhere in Bharat at the same time" Secondary Strip */}
              {activeEvent.elsewhereInBharat && activeEvent.elsewhereInBharat.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-wider flex items-center gap-1.5 font-mono">
                    <Globe className="w-3.5 h-3.5" />
                    Synchronous Subcontinental Context (Elsewhere in Bharat at this time)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeEvent.elsewhereInBharat.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#F5E0A0]">{item.region}</span>
                          <span className="font-mono text-[10px] text-[#D4AF37]/80">{item.rulingDynasty}</span>
                        </div>
                        <p className="text-[#E8DFD1]/70 text-[11px] leading-relaxed">
                          {item.happening}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary-Source Citation Display */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-wider flex items-center gap-1.5 font-mono">
                  <Award className="w-3.5 h-3.5" />
                  Primary Epigraphic & Archival Sources
                </span>
                <div className="flex flex-col gap-1.5">
                  {activeEvent.sources.map((src, i) => (
                    <div
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono text-[#E8DFD1]/80 flex items-start gap-2"
                    >
                      <span className="text-[#D4AF37] mt-0.5">•</span>
                      <span>{src}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cross-Module Deep-Links: Explore More */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-wider flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  Explore Cross-Module Connections
                </span>

                <div className="flex flex-wrap gap-2">
                  {activeEvent.linkedEntities.monuments.map((m) => (
                    <button
                      key={m}
                      onClick={() => onNavigateTab && onNavigateTab("monuments")}
                      className="px-3 py-1.5 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-xs text-[#F5E0A0] flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Landmark className="w-3 h-3 text-[#D4AF37]" />
                      <span>Monuments 3D</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  ))}

                  {activeEvent.linkedEntities.festivals.map((f) => (
                    <button
                      key={f}
                      onClick={() => onNavigateTab && onNavigateTab("festivals")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>Festivals</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  ))}

                  {activeEvent.linkedEntities.ragas.map((r) => (
                    <button
                      key={r}
                      onClick={() => onNavigateTab && onNavigateTab("sangeet")}
                      className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-xs text-purple-300 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Radio className="w-3 h-3 text-purple-400" />
                      <span>Sangeet Studio</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  ))}

                  {activeEvent.linkedEntities.danceForms.map((d) => (
                    <button
                      key={d}
                      onClick={() => onNavigateTab && onNavigateTab("nritya")}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Nritya Studio</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  ))}

                  {activeEvent.linkedEntities.crafts.map((c) => (
                    <button
                      key={c}
                      onClick={() => onNavigateTab && onNavigateTab("bazaar")}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Bazaar</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
