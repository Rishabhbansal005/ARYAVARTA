"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  MapPin,
  Sparkles,
  Volume2,
  VolumeX,
  BookOpen,
  ArrowRight,
  Utensils,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  Compass,
  Music,
  ShoppingBag,
  Landmark,
  Share2,
  Layers,
  ChevronRight,
  Filter
} from "lucide-react";
import festivalsData from "@/data/festivals_self_describing.json";
import { FestivalEntity, TraditionType, RegionalNameVariation } from "@/types";
import { audioManager } from "@/lib/audioManager";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/context/LanguageContext";
import { getThemeForTradition } from "./festivalTheme";
import { InteractionWidget } from "./interactions/InteractionWidget";
import { FamilyCelebrationModal, FamilyContribution } from "./FamilyCelebrationModal";

interface FestivalsExplorerProps {
  onNavigateTab?: (tabId: string, contextId?: string) => void;
}

export const FestivalsExplorer: React.FC<FestivalsExplorerProps> = ({ onNavigateTab }) => {
  const { t, language } = useLanguage();
  const currentLangMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || { name: "English", code: "en" };

  const festivals = festivalsData as unknown as FestivalEntity[];

  // Active filter state
  const [selectedTradition, setSelectedTradition] = useState<string>("all");
  const [activeFestival, setActiveFestival] = useState<FestivalEntity>(festivals[0]);
  const [selectedRegionalIndex, setSelectedRegionalIndex] = useState<number>(0);
  const [isViewingRegional, setIsViewingRegional] = useState<boolean>(false);

  // Audio narration state
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [playingCardId, setPlayingCardId] = useState<string | null>(null);
  const [translatedSubtitle, setTranslatedSubtitle] = useState<string | null>(null);

  // Community contributions state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [familyContributions, setFamilyContributions] = useState<FamilyContribution[]>([]);

  // Filtered festivals
  const filteredFestivals = useMemo(() => {
    if (selectedTradition === "all") return festivals;
    return festivals.filter((f) => f.tradition === selectedTradition);
  }, [festivals, selectedTradition]);

  // Tradition theme config for active festival
  const theme = getThemeForTradition(activeFestival.tradition);

  // Active regional variation (if selected)
  const activeRegionalVariation: RegionalNameVariation | null =
    activeFestival.regionalNames && isViewingRegional && activeFestival.regionalNames[selectedRegionalIndex]
      ? activeFestival.regionalNames[selectedRegionalIndex]
      : null;

  // Next Festival in X Days Live Calculation (based on current 2026 dates)
  const nextFestivalInfo = useMemo(() => {
    const today = new Date();
    // Compare dates in current year
    const upcoming = [...festivals].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const next =
      upcoming.find((f) => new Date(f.date).getTime() >= today.getTime()) || upcoming[0];
    const diffTime = Math.abs(new Date(next.date).getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      festival: next,
      daysRemaining: diffDays,
      formattedDate: new Date(next.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    };
  }, [festivals]);

  // Stop speech if festival changes
  useEffect(() => {
    audioManager.stopNarration();
    setIsNarrating(false);
    setPlayingCardId(null);
    setTranslatedSubtitle(null);
    setIsViewingRegional(false);
    setSelectedRegionalIndex(0);
  }, [activeFestival.id]);

  // Toggle Sarvam AI Narration for the active festival detail
  const handleToggleDetailNarration = async () => {
    if (isNarrating) {
      audioManager.stopNarration();
      setIsNarrating(false);
      setTranslatedSubtitle(null);
      return;
    }

    setIsNarrating(true);
    setTranslatedSubtitle(null);

    const nameToSpeak = activeRegionalVariation
      ? activeRegionalVariation.localName
      : activeFestival.name.en;
    const summaryToSpeak = activeRegionalVariation
      ? activeRegionalVariation.note
      : activeFestival.summary;
    const loreToSpeak = activeFestival.lore.text.en;

    const speechText = `${nameToSpeak}. ${summaryToSpeak} ${loreToSpeak}`.trim();

    await audioManager.speakNarration(
      speechText,
      language,
      () => {
        setIsNarrating(false);
        setTranslatedSubtitle(null);
      },
      (translated) => {
        setTranslatedSubtitle(translated);
      }
    );
  };

  // Quick Inline Audio Preview on any festival card (Audio-first browsing)
  const handleCardQuickListen = async (f: FestivalEntity, e: React.MouseEvent) => {
    e.stopPropagation();

    if (playingCardId === f.id) {
      audioManager.stopNarration();
      setPlayingCardId(null);
      return;
    }

    audioManager.stopNarration();
    setPlayingCardId(f.id);

    const speechText = `${f.name.en}. ${f.summary}`.trim();
    await audioManager.speakNarration(
      speechText,
      language,
      () => {
        setPlayingCardId(null);
      }
    );
  };

  const handleAddContribution = (newContrib: FamilyContribution) => {
    setFamilyContributions((prev) => [newContrib, ...prev]);
  };

  const currentDisplayImage = activeRegionalVariation?.image || activeFestival.image.url;
  const currentDisplayName = activeRegionalVariation?.localName || activeFestival.name.en;
  const currentDisplayNative = activeFestival.name.native;
  const currentDisplaySummary = activeRegionalVariation?.note || activeFestival.summary;

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Dynamic Header & Live Next Festival Countdown */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10 text-[#F5E0A0] text-xs font-mono tracking-widest uppercase">
          <CalendarIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>UTSAV • LIVING CALENDAR OF BHARAT</span>
        </div>

        <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-gold-gradient tracking-wide">
          Sacred Festivals & Seasons
        </h1>

        <p className="text-xs sm:text-sm text-[#E8DFD1]/70 leading-relaxed">
          Experience the sacred astronomical alignments, seasonal harvests, and living multi-faith
          traditions of India through data-driven interactive rituals, authentic gastronomy, and
          regional variations.
        </p>

        {/* Live Next Celebration Countdown Banner */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#181B26] via-[#101420] to-[#181B26] border border-[#D4AF37]/30 shadow-xl flex flex-wrap items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F5E0A0] shrink-0">
              <Clock className="w-5 h-5 text-[#D4AF37] animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block">
                Next In Sacred Calendar
              </span>
              <h4 className="font-serif font-bold text-sm sm:text-base text-white">
                {nextFestivalInfo.festival.name.en}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs sm:text-sm font-bold text-[#F5E0A0] block">
                {nextFestivalInfo.formattedDate}
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                In approximately {nextFestivalInfo.daysRemaining} days
              </span>
            </div>

            <button
              onClick={() => {
                setActiveFestival(nextFestivalInfo.festival);
                window.scrollTo({ top: 380, behavior: "smooth" });
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#D4AF37] text-[#07080B] hover:brightness-110 shadow-md cursor-pointer shrink-0"
            >
              Explore Next
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs by Tradition */}
      <div className="flex items-center justify-center gap-2 flex-wrap pb-2">
        {[
          { id: "all", label: "All Traditions", icon: "✨" },
          { id: "hindu", label: "Sanatana Dharma", icon: "🪔" },
          { id: "islamic", label: "Islamic Lunar", icon: "🌙" },
          { id: "sikh", label: "Sikh Gurmat", icon: "⚔️" },
          { id: "harvest-seasonal", label: "Solar Harvest", icon: "🌾" },
          { id: "civic-national", label: "National Sovereign", icon: "🇮🇳" },
          { id: "christian", label: "Christian Feast", icon: "⭐" },
          { id: "buddhist", label: "Buddha Sasana", icon: "☸️" },
          { id: "tribal-regional", label: "Indigenous Folk", icon: "🥁" }
        ].map((tab) => {
          const isSelected = selectedTradition === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTradition(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all border flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? "bg-[#D4AF37] text-[#07080B] font-bold border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 scale-105"
                  : "bg-white/5 border-white/10 text-[#E8DFD1]/70 hover:text-white hover:border-[#D4AF37]/40"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Festival Cards Scroll with Audio-First Quick Listen */}
        <div className="lg:col-span-5 space-y-3.5 max-h-[750px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex items-center justify-between text-xs text-[#E8DFD1]/60 px-1 pb-1">
            <span>{filteredFestivals.length} Festivals Documented</span>
            <span className="font-mono text-[#D4AF37]">Click to open stage</span>
          </div>

          {filteredFestivals.map((fest) => {
            const isSelected = activeFestival.id === fest.id;
            const festTheme = getThemeForTradition(fest.tradition);
            const isPlayingThis = playingCardId === fest.id;

            return (
              <div
                key={fest.id}
                onClick={() => setActiveFestival(fest)}
                className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center gap-3.5 cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? `${festTheme.cardBorder} bg-[#181B26] shadow-xl ${festTheme.cardGlow} scale-[1.02]`
                    : "border-white/10 hover:border-white/30 bg-[#0E111A]/80 hover:bg-[#141824]"
                }`}
              >
                {/* Visual Thumbnail */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 relative bg-black/60 border border-white/10">
                  <img
                    src={fest.image.url}
                    alt={fest.name.en}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute bottom-1 right-1 text-xs">
                    {festTheme.motifIcon}
                  </span>
                </div>

                {/* Festival Metadata */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md ${festTheme.badgeBg} ${festTheme.badgeText} border ${festTheme.badgeBorder} truncate max-w-[140px]`}>
                      {fest.tradition}
                    </span>
                    <span className="text-[10px] font-mono text-[#E8DFD1]/50 shrink-0">
                      {fest.date}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm sm:text-base text-white truncate">
                    {fest.name.en}
                  </h3>

                  <p className="text-[11px] text-[#E8DFD1]/70 line-clamp-1 leading-snug">
                    {fest.summary}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-[#D4AF37]/80 truncate">
                      {fest.regions.slice(0, 2).join(", ")}
                    </span>

                    {/* Audio-First Quick Listen Button */}
                    <button
                      onClick={(e) => handleCardQuickListen(fest, e)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        isPlayingThis
                          ? "bg-red-500 text-white animate-pulse"
                          : "bg-white/10 hover:bg-white/20 text-[#F5E0A0] border border-white/15"
                      }`}
                      title="Quick audio narration preview"
                    >
                      {isPlayingThis ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-[#D4AF37]" />}
                      <span>{isPlayingThis ? "Stop" : "Listen"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Self-Describing Interactive Experience Stage */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`rounded-3xl border ${theme.cardBorder} shadow-2xl overflow-hidden bg-gradient-to-b ${theme.gradientBg} bg-[#0A0C12]`}>
            {/* Visual Cinematic Banner */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-black">
              <img
                src={currentDisplayImage}
                alt={activeFestival.image.altText}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C12] via-[#0A0C12]/50 to-transparent" />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between flex-wrap gap-2">
                <span className={`text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full border backdrop-blur-md flex items-center gap-1.5 ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`}>
                  <span>{theme.motifIcon}</span>
                  <span>{activeFestival.dateNote}</span>
                </span>

                <div className="flex items-center gap-2">
                  {/* Verified Iconography Badge */}
                  <span
                    className={`text-[10px] font-mono px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1 border ${
                      activeFestival.image.verified
                        ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-300"
                        : "bg-amber-950/70 border-amber-500/40 text-amber-300"
                    }`}
                    title={activeFestival.image.verified ? "Confirmed authentic cultural iconography" : "Pending historical review in TODO_VERIFY.md"}
                  >
                    {activeFestival.image.verified ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Verified</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                        <span>Unverified Asset</span>
                      </>
                    )}
                  </span>

                  {/* Sarvam AI Regional Audio Narration */}
                  <button
                    onClick={handleToggleDetailNarration}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer ${
                      isNarrating
                        ? "bg-[#D4AF37] text-[#07080B] shadow-lg animate-pulse"
                        : "bg-black/70 border border-[#D4AF37]/40 text-[#F5E0A0] hover:bg-black/90"
                    }`}
                  >
                    {isNarrating ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    <span>{isNarrating ? "Stop Audio" : `Listen • ${currentLangMeta.name}`}</span>
                  </button>
                </div>
              </div>

              {/* Title & Native Name Overlay */}
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37]">
                    {theme.traditionLabel}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-xs font-mono text-white/70">
                    {activeFestival.date}
                  </span>
                </div>

                <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white tracking-wide">
                  {currentDisplayName}
                </h2>

                <span className="text-xs sm:text-sm text-[#F5E0A0] font-sans font-medium block mt-0.5">
                  {currentDisplayNative}
                </span>

                {/* Live Regional Language Subtitles */}
                {isNarrating && translatedSubtitle && (
                  <div className="mt-3 p-3 rounded-xl bg-black/85 border border-[#D4AF37]/50 text-[#F5E0A0] text-xs font-serif leading-relaxed animate-fade-in flex items-start gap-2 shadow-2xl">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5 animate-spin" />
                    <span>{translatedSubtitle}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stage Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Regional Variations Strip ("How It's Celebrated Across India") */}
              {activeFestival.regionalNames && activeFestival.regionalNames.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#141824] border border-[#D4AF37]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider font-bold flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      How It's Celebrated Across India ({activeFestival.regionalNames.length} Traditions)
                    </span>
                    <span className="text-[10px] text-[#E8DFD1]/50">
                      Switch region to view local custom
                    </span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {activeFestival.regionalNames.map((rn, idx) => {
                      const isCurrent = isViewingRegional && selectedRegionalIndex === idx;
                      return (
                        <button
                          key={rn.region}
                          onClick={() => {
                            setIsViewingRegional(true);
                            setSelectedRegionalIndex(idx);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${
                            isCurrent
                              ? "bg-[#D4AF37] text-[#07080B] font-bold shadow-md shadow-[#D4AF37]/30"
                              : "bg-white/5 border border-white/5 text-[#E8DFD1]/70 hover:text-white"
                          }`}
                        >
                          <span>{rn.localName}</span>
                          <span className="text-[10px] opacity-70 ml-1">({rn.region.split(" ")[0]})</span>
                        </button>
                      );
                    })}
                  </div>

                  {activeRegionalVariation && (
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-[#E8DFD1]/90 space-y-1">
                      <div className="font-bold text-[#F5E0A0]">
                        {activeRegionalVariation.region} — {activeRegionalVariation.localName}
                      </div>
                      <p className="text-[11px] text-[#E8DFD1]/80 leading-relaxed">
                        {activeRegionalVariation.note}
                      </p>
                      {activeRegionalVariation.uniqueCustom && (
                        <div className="text-[11px] text-amber-300/90 font-mono pt-1">
                          ✨ Unique Custom: {activeRegionalVariation.uniqueCustom}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Cultural Lore Narrative */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                  <BookOpen className="w-3.5 h-3.5" />
                  Sacred Lore & Cultural Significance
                </span>
                <p className="text-xs sm:text-sm text-[#E8DFD1]/90 leading-relaxed font-sans">
                  {activeFestival.lore.text.en}
                </p>
              </div>

              {/* THE KEY FIX: SELF-DESCRIBING UNIQUE INTERACTIONS ONLY */}
              <div className="space-y-4 pt-2">
                <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Sacred Rituals & Authentic Experiences ({activeFestival.interactions.length})
                </span>

                <div className="space-y-4">
                  {activeFestival.interactions.map((interaction, i) => (
                    <InteractionWidget
                      key={`${activeFestival.id}-${interaction.actionComponent}-${i}`}
                      interaction={interaction}
                      festivalId={activeFestival.id}
                      onNavigateTab={onNavigateTab}
                      onSelectRegional={() => setIsViewingRegional(!isViewingRegional)}
                      onPlayAudio={handleToggleDetailNarration}
                    />
                  ))}
                </div>
              </div>

              {/* CONNECT TO OTHER MODULES: Explore More Deep-Link Strip */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3 pt-4">
                <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider font-bold block">
                  Explore Connected Cultural Lineages
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Ragas */}
                  {activeFestival.linkedEntities.ragas.length > 0 && (
                    <div
                      onClick={() => onNavigateTab && onNavigateTab("sangeet")}
                      className="p-3 rounded-xl bg-white/5 hover:bg-[#D4AF37]/15 border border-white/5 hover:border-[#D4AF37]/40 transition-all cursor-pointer group"
                    >
                      <div className="text-[10px] font-mono text-[#D4AF37] flex items-center gap-1 mb-1">
                        <Music className="w-3 h-3" />
                        Classical Raga
                      </div>
                      <div className="text-xs font-bold text-white group-hover:text-[#F5E0A0] truncate">
                        {activeFestival.linkedEntities.ragas[0]}
                      </div>
                    </div>
                  )}

                  {/* Dance Forms */}
                  {activeFestival.linkedEntities.danceForms.length > 0 && (
                    <div
                      onClick={() => onNavigateTab && onNavigateTab("nritya")}
                      className="p-3 rounded-xl bg-white/5 hover:bg-[#D4AF37]/15 border border-white/5 hover:border-[#D4AF37]/40 transition-all cursor-pointer group"
                    >
                      <div className="text-[10px] font-mono text-[#D4AF37] flex items-center gap-1 mb-1">
                        <Compass className="w-3 h-3" />
                        Dance Form
                      </div>
                      <div className="text-xs font-bold text-white group-hover:text-[#F5E0A0] truncate">
                        {activeFestival.linkedEntities.danceForms[0]}
                      </div>
                    </div>
                  )}

                  {/* Crafts */}
                  {activeFestival.linkedEntities.crafts.length > 0 && (
                    <div
                      onClick={() => onNavigateTab && onNavigateTab("bazaar")}
                      className="p-3 rounded-xl bg-white/5 hover:bg-[#D4AF37]/15 border border-white/5 hover:border-[#D4AF37]/40 transition-all cursor-pointer group"
                    >
                      <div className="text-[10px] font-mono text-[#D4AF37] flex items-center gap-1 mb-1">
                        <ShoppingBag className="w-3 h-3" />
                        Artisan Craft
                      </div>
                      <div className="text-xs font-bold text-white group-hover:text-[#F5E0A0] truncate">
                        {activeFestival.linkedEntities.crafts[0]}
                      </div>
                    </div>
                  )}

                  {/* Monuments */}
                  {activeFestival.linkedEntities.monuments.length > 0 && (
                    <div
                      onClick={() => onNavigateTab && onNavigateTab("monuments")}
                      className="p-3 rounded-xl bg-white/5 hover:bg-[#D4AF37]/15 border border-white/5 hover:border-[#D4AF37]/40 transition-all cursor-pointer group"
                    >
                      <div className="text-[10px] font-mono text-[#D4AF37] flex items-center gap-1 mb-1">
                        <Landmark className="w-3 h-3" />
                        Sacred 3D Site
                      </div>
                      <div className="text-xs font-bold text-white group-hover:text-[#F5E0A0] truncate">
                        {activeFestival.linkedEntities.monuments[0]}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Community Memories & "How My Family Celebrates" Flow */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#181B26] via-[#111420] to-[#181B26] border border-[#D4AF37]/25 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-white">
                      Community Lineages & Family Memories
                    </h4>
                    <span className="text-[11px] text-[#E8DFD1]/60">
                      Share how your ancestral village or household celebrates this sacred day
                    </span>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-[#D4AF37]/20 text-[#F5E0A0] border border-[#D4AF37]/35 transition-all cursor-pointer"
                  >
                    + Share Family Tradition
                  </button>
                </div>

                {/* Display submitted memories */}
                {familyContributions.filter((c) => c.festivalId === activeFestival.id).length > 0 ? (
                  <div className="space-y-2 pt-2">
                    {familyContributions
                      .filter((c) => c.festivalId === activeFestival.id)
                      .map((c) => (
                        <div
                          key={c.id}
                          className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#F5E0A0]">{c.contributorName} ({c.city})</span>
                            <span className="text-[10px] font-mono text-amber-300 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                              ⏳ Pending Moderation
                            </span>
                          </div>
                          <p className="text-[11px] text-[#E8DFD1]/80 italic">
                            "{c.familyTraditionNote}"
                          </p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-[#E8DFD1]/50 italic pt-1">
                    No community memories submitted for this festival yet. Be the first from your ancestral region to contribute!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Contribution Modal */}
      <FamilyCelebrationModal
        festivalId={activeFestival.id}
        festivalName={activeFestival.name.en}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddContribution}
      />
    </div>
  );
};
