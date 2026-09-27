"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Compass,
  MapPin,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  ArrowRight,
  ExternalLink,
  Loader2,
  Flower2,
  Heart,
  Landmark,
  Music,
  ShoppingBag,
  Eye,
  Check,
  AlertCircle,
  X
} from "lucide-react";
import { AssembledRootsJourney, assembleRootsJourney } from "@/lib/rootsAssembler";
import { ALL_INDIAN_REGIONS, RegionCulturalData } from "@/data/regionsData";
import { SUPPORTED_LANGUAGES, LanguageMeta } from "@/context/LanguageContext";
import { ShareableRootsCard } from "@/components/roots/ShareableRootsCard";

interface DiasporaRootsJourneyProps {
  onNavigateTab: (tabId: string, contextId?: string) => void;
  onReopenOnboarding: () => void;
  onClose?: () => void;
}

interface NarrationsState {
  intro?: string;
  siteNarration?: string;
  danceNarration?: string;
  musicNarration?: string;
  craftNarration?: string;
  closing?: string;
}

export const DiasporaRootsJourney: React.FC<DiasporaRootsJourneyProps> = ({
  onNavigateTab,
  onReopenOnboarding,
  onClose,
}) => {
  const [journeyData, setJourneyData] = useState<AssembledRootsJourney | null>(null);
  const [narrations, setNarrations] = useState<NarrationsState | null>(null);
  const [isLoadingNarrations, setIsLoadingNarrations] = useState(true);
  const [activeAudioSection, setActiveAudioSection] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Read stored region & language from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("aryavarta_diaspora_roots");
      let targetRegion: RegionCulturalData = ALL_INDIAN_REGIONS[0]; // Odisha default
      let targetLang: LanguageMeta = SUPPORTED_LANGUAGES[0]; // English default
      let rawQuery = "";

      if (stored) {
        const parsed = JSON.parse(stored);
        const matched = ALL_INDIAN_REGIONS.find((r) => r.id === parsed.regionId || r.name === parsed.regionName);
        if (matched) targetRegion = matched;

        const langMatched = SUPPORTED_LANGUAGES.find((l) => l.code === parsed.languageCode);
        if (langMatched) targetLang = langMatched;

        rawQuery = parsed.rawQuery || "";
      }

      // 1. Auto-assemble grounded cultural entities
      const assembled = assembleRootsJourney(targetRegion, targetLang, rawQuery);
      setJourneyData(assembled);

      // 2. Fetch personalized RAG narration
      fetchNarrations(assembled);
    } catch (e) {
      console.warn("Could not load stored diaspora roots data:", e);
      const fallbackAssembled = assembleRootsJourney(ALL_INDIAN_REGIONS[0], SUPPORTED_LANGUAGES[0]);
      setJourneyData(fallbackAssembled);
      fetchNarrations(fallbackAssembled);
    }
  }, []);

  const fetchNarrations = async (assembled: AssembledRootsJourney) => {
    setIsLoadingNarrations(true);
    try {
      const res = await fetch("/api/roots/narrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          regionName: assembled.region.name,
          languageName: assembled.language.name,
          languageCode: assembled.language.code,
          rawQuery: assembled.rawQuery,
          entities: {
            site: assembled.site
              ? {
                  name: assembled.site.name,
                  dynasty: assembled.site.dynasty,
                  summary: assembled.site.summary,
                  architecturalStyle: assembled.site.architecturalStyle,
                }
              : undefined,
            dance: assembled.dance
              ? {
                  name: assembled.dance.name,
                  keyPose: assembled.dance.keyPose,
                  treatise: assembled.dance.treatise,
                  description: assembled.dance.description,
                }
              : undefined,
            music: assembled.music
              ? {
                  raga: assembled.music.raga,
                  description: assembled.music.description,
                }
              : undefined,
            craft: assembled.craft
              ? {
                  name: assembled.craft.name,
                  craftName: assembled.craft.craftName,
                  artisanName: assembled.craft.artisanName,
                  description: assembled.craft.description,
                }
              : undefined,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setNarrations(data);
      }
    } catch (err) {
      console.warn("Error fetching roots narration, using fallback:", err);
    } finally {
      setIsLoadingNarrations(false);
    }
  };

  // Play TTS audio for an individual section narration
  const handlePlayAudio = async (sectionKey: string, text?: string) => {
    if (!text || !journeyData) return;

    if (activeAudioSection === sectionKey && isPlayingAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlayingAudio(false);
      setActiveAudioSection(null);
      return;
    }

    try {
      setActiveAudioSection(sectionKey);
      setIsPlayingAudio(true);

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          lang: journeyData.language.code,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          const audio = new Audio(`data:${data.contentType || "audio/wav"};base64,${data.audioBase64}`);
          audioRef.current = audio;
          audio.onended = () => {
            setIsPlayingAudio(false);
            setActiveAudioSection(null);
          };
          audio.play();
          return;
        }
      }

      // Browser Web Speech fallback if TTS backend unavailable
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.92;
        utterance.onend = () => {
          setIsPlayingAudio(false);
          setActiveAudioSection(null);
        };
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn("TTS playback error:", e);
      setIsPlayingAudio(false);
      setActiveAudioSection(null);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!journeyData) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-[#D4AF37]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
          <span className="font-serif text-sm">Synthesizing ancestral lore...</span>
        </div>
      </div>
    );
  }

  const { region, language, site, dance, music, craft, omittedCategories } = journeyData;

  return (
    <div className="space-y-16 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* ── Top Atmospheric Journey Header ── */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5E0A0] text-xs font-mono tracking-wider shadow-lg shadow-[#D4AF37]/10">
          <Compass className="w-4 h-4 text-[#D4AF37] animate-spin-slow" />
          <span>YOUR ANCESTRAL JOURNEY • आपकी पैतृक यात्रा</span>
        </div>

        <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-gold-gradient leading-tight">
          Welcome Home to {region.name}
        </h1>

        {region.nativeName && (
          <p className="font-serif text-xl sm:text-2xl text-[#F5E0A0] font-medium tracking-wide">
            {region.nativeName}
          </p>
        )}

        {/* Intro Narration in Intimate Voice */}
        <div className="max-w-2xl mx-auto p-5 rounded-3xl bg-gradient-to-b from-[#181611]/80 to-[#0C0E14]/80 border border-[#D4AF37]/30 shadow-xl space-y-3">
          <p className="text-xs sm:text-sm text-[#E8DFD1]/90 leading-relaxed font-sans italic">
            {narrations?.intro ||
              `Welcome home to ${region.name}. This is the land your family's story emerged from—where sacred rivers nourished ancient stone temples, evening ragas, and unbroken artisan lineages across thousands of years.`}
          </p>
          <div className="flex items-center justify-between text-[11px] text-[#D4AF37] font-mono pt-2 border-t border-white/10">
            <span>Narration Language: {language.name} ({language.englishName})</span>
            <button
              onClick={() => handlePlayAudio("intro", narrations?.intro)}
              className="hover:underline flex items-center gap-1.5 cursor-pointer font-bold text-white bg-[#D4AF37]/20 px-3 py-1 rounded-full border border-[#D4AF37]/40 hover:bg-[#D4AF37]/35 transition-all"
            >
              {activeAudioSection === "intro" && isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-amber-300" />
                  <span>Pause Voice</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Listen to Welcome</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={onReopenOnboarding}
            className="text-[11px] font-mono text-[#E8DFD1]/60 hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 cursor-pointer px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-[#D4AF37]/40"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Explore Another Ancestral Homeland</span>
          </button>
        </div>

        {/* ── Sequential Story Unfolding Roadmap ── */}
        <div className="pt-4 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-left">
            {/* Chapter 1 Site */}
            <div
              onClick={() => {
                const el = document.getElementById("chapter-site");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`p-2.5 rounded-xl border text-xs transition-all ${
                site
                  ? "bg-[#D4AF37]/10 border-[#D4AF37]/35 cursor-pointer hover:bg-[#D4AF37]/20 text-[#E8DFD1]"
                  : "bg-white/5 border-white/10 opacity-50 cursor-not-allowed text-[#E8DFD1]/50"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-[#D4AF37]">
                <span>I • MONUMENT</span>
                {site && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </div>
              <div className="font-semibold truncate pt-1 text-[11px]">
                {site ? site.name : "Archival Gap"}
              </div>
            </div>

            {/* Chapter 2 Dance */}
            <div
              onClick={() => {
                const el = document.getElementById("chapter-dance");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`p-2.5 rounded-xl border text-xs transition-all ${
                dance
                  ? "bg-[#D4AF37]/10 border-[#D4AF37]/35 cursor-pointer hover:bg-[#D4AF37]/20 text-[#E8DFD1]"
                  : "bg-white/5 border-white/10 opacity-50 cursor-not-allowed text-[#E8DFD1]/50"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-[#D4AF37]">
                <span>II • DANCE</span>
                {dance && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </div>
              <div className="font-semibold truncate pt-1 text-[11px]">
                {dance ? dance.name : "Archival Gap"}
              </div>
            </div>

            {/* Chapter 3 Music */}
            <div
              onClick={() => {
                const el = document.getElementById("chapter-music");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`p-2.5 rounded-xl border text-xs transition-all ${
                music
                  ? "bg-[#D4AF37]/10 border-[#D4AF37]/35 cursor-pointer hover:bg-[#D4AF37]/20 text-[#E8DFD1]"
                  : "bg-white/5 border-white/10 opacity-50 cursor-not-allowed text-[#E8DFD1]/50"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-[#D4AF37]">
                <span>III • RAGA</span>
                {music && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </div>
              <div className="font-semibold truncate pt-1 text-[11px]">
                {music ? music.raga : "Archival Gap"}
              </div>
            </div>

            {/* Chapter 4 Craft */}
            <div
              onClick={() => {
                const el = document.getElementById("chapter-craft");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`p-2.5 rounded-xl border text-xs transition-all ${
                craft
                  ? "bg-[#D4AF37]/10 border-[#D4AF37]/35 cursor-pointer hover:bg-[#D4AF37]/20 text-[#E8DFD1]"
                  : "bg-white/5 border-white/10 opacity-50 cursor-not-allowed text-[#E8DFD1]/50"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-[#D4AF37]">
                <span>IV • CRAFT</span>
                {craft && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </div>
              <div className="font-semibold truncate pt-1 text-[11px]">
                {craft ? craft.craftName.split(" ")[0] : "Archival Gap"}
              </div>
            </div>

            {/* Chapter 5 Keepsake / Roots Card */}
            <div
              onClick={() => {
                const el = document.getElementById("chapter-keepsake");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="p-2.5 rounded-xl border text-xs transition-all bg-[#D4AF37]/15 border-[#D4AF37]/50 cursor-pointer hover:bg-[#D4AF37]/25 text-[#E8DFD1] col-span-2 sm:col-span-1 shadow-md shadow-[#D4AF37]/10"
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-[#D4AF37]">
                <span>V • KEEPSAKE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              </div>
              <div className="font-semibold truncate pt-1 text-[11px] text-[#F5E0A0]">
                Roots Card
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHAPTER 1: SACRED ARCHITECTURE & STONE HERITAGE ── */}
      {site && (
        <section
          id="chapter-site"
          className="glass-panel-gold rounded-3xl border border-[#D4AF37]/45 p-6 sm:p-9 shadow-2xl space-y-6 relative overflow-hidden group transition-all duration-700"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] uppercase tracking-wider">
              <Landmark className="w-4 h-4 text-[#D4AF37]" />
              <span>Chapter I • The Monument of Your Soil</span>
            </div>
            {site.sketchfabEmbedUrl && (
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Interactive 3D Photogrammetry
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual / 3D Asset Column */}
            <div className="lg:col-span-7">
              {site.sketchfabEmbedUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl bg-black aspect-video sm:h-[380px] w-full">
                  <iframe
                    title={site.name}
                    src={`${site.sketchfabEmbedUrl}?autostart=1&ui_controls=1&ui_infos=0&ui_watermark=0`}
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    allowFullScreen
                  />
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-[#E8DFD1]/80 pointer-events-none">
                    Drag to rotate in 3D • Scroll to zoom
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl h-[320px] w-full">
                  <img
                    src={site.imageUrl || "/images/bazaar/pattachitra.jpg"}
                    alt={site.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Narrative Context Column */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <span className="text-xs font-mono text-[#D4AF37]">
                  {site.builtCentury || "Ancient Era"} • {site.dynasty}
                </span>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white pt-1">
                  {site.name}
                </h2>
                {site.nativeName && (
                  <p className="font-serif text-sm text-[#F5E0A0]">{site.nativeName}</p>
                )}
              </div>

              {/* Second-Person Intimate Narration */}
              <div className="p-4 rounded-2xl bg-black/40 border border-[#D4AF37]/25 space-y-2">
                <p className="text-xs sm:text-sm text-[#E8DFD1]/90 leading-relaxed font-sans">
                  {narrations?.siteNarration ||
                    `In the land your family comes from stands ${site.name}—not merely a monument, but a living testament to ancestral mastery. Built under the ${site.dynasty}, its carved stone walls preserve the spiritual cosmology your ancestors held sacred.`}
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => handlePlayAudio("site", narrations?.siteNarration)}
                    className="text-[11px] font-mono font-bold text-[#F5E0A0] hover:text-white flex items-center gap-1.5 cursor-pointer bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 px-3 py-1 rounded-lg border border-[#D4AF37]/30 transition-all"
                  >
                    {activeAudioSection === "site" && isPlayingAudio ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-amber-300" />
                        <span>Pause Audio</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Listen to Temple Lore</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => onNavigateTab("monuments", site.id)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#07080B] text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-md shadow-[#D4AF37]/20 flex items-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Explore Full 3D Monument Experience</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CHAPTER 2: THE DANCE OF YOUR SOIL ── */}
      {dance && (
        <section
          id="chapter-dance"
          className="glass-panel-gold rounded-3xl border border-[#D4AF37]/45 p-6 sm:p-9 shadow-2xl space-y-6 relative overflow-hidden transition-all duration-700"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] uppercase tracking-wider">
              <Flower2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Chapter II • The Dance of Your Soil</span>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
              Classical Dance • {dance.treatise}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <span className="text-xs font-mono text-[#D4AF37]">
                  Sangeet Natak Akademi Classical Heritage
                </span>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white pt-1">
                  {dance.name}
                </h2>
                {dance.nativeName && (
                  <p className="font-serif text-sm text-[#F5E0A0]">{dance.nativeName}</p>
                )}
              </div>

              {/* Second-Person Intimate Narration */}
              <div className="p-4 rounded-2xl bg-black/40 border border-[#D4AF37]/25 space-y-2">
                <p className="text-xs sm:text-sm text-[#E8DFD1]/90 leading-relaxed font-sans">
                  {narrations?.danceNarration ||
                    `The dance still performed today in your ancestral homeland is ${dance.name}. When dancers hold the sacred ${dance.keyPose}, they mirror the exact sculptures carved into the stone sanctums of your family's homeland.`}
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => handlePlayAudio("dance", narrations?.danceNarration)}
                    className="text-[11px] font-mono font-bold text-[#F5E0A0] hover:text-white flex items-center gap-1.5 cursor-pointer bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 px-3 py-1 rounded-lg border border-[#D4AF37]/30 transition-all"
                  >
                    {activeAudioSection === "dance" && isPlayingAudio ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-amber-300" />
                        <span>Pause Audio</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Listen to Dance Narration</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => onNavigateTab("nritya", dance.id)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#07080B] text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-md shadow-[#D4AF37]/20 flex items-center gap-2"
                >
                  <span>Practice {dance.name} in Nritya Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Posture Card Highlight */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-black/50 border border-white/10 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block">
                  Key Sculptural Alignment
                </span>
                <h4 className="font-serif text-lg font-bold text-white">{dance.keyPose}</h4>
                <p className="text-xs text-[#E8DFD1]/70">{dance.description}</p>
              </div>

              {dance.postureTips && (
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase block">
                    Ancestral Posture Principles:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#E8DFD1]/80">
                    {dance.postureTips.map((tip, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span className="text-[11px]">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-between text-xs">
                <span className="text-[#E8DFD1]/70">Signature Mudra:</span>
                <strong className="text-[#F5E0A0] font-mono">{dance.signatureMudra}</strong>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CHAPTER 3: SACRED RAGA OF YOUR ANCESTORS ── */}
      {music && (
        <section
          id="chapter-music"
          className="glass-panel-gold rounded-3xl border border-[#D4AF37]/45 p-6 sm:p-9 shadow-2xl space-y-6 relative overflow-hidden transition-all duration-700"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] uppercase tracking-wider">
              <Music className="w-4 h-4 text-[#D4AF37]" />
              <span>Chapter III • The Melodic Scale of Your Soil</span>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
              Indian Classical Sangeet
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div>
                <span className="text-xs font-mono text-[#D4AF37]">Sacred Evening Resonance</span>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white pt-1">
                  {music.raga}
                </h2>
                <p className="text-xs text-[#E8DFD1]/70 pt-1 leading-relaxed">
                  {music.description}
                </p>
              </div>

              {/* Second-Person Intimate Narration */}
              <div className="p-4 rounded-2xl bg-black/40 border border-[#D4AF37]/25 space-y-2">
                <p className="text-xs sm:text-sm text-[#E8DFD1]/90 leading-relaxed font-sans">
                  {narrations?.musicNarration ||
                    `As dusk settles over the soil of ${region.name}, the melodic scale of ${music.raga} carries centuries of devotional reflection. It is the acoustic heartbeat your ancestors listened to during evening rituals.`}
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => handlePlayAudio("music", narrations?.musicNarration)}
                    className="text-[11px] font-mono font-bold text-[#F5E0A0] hover:text-white flex items-center gap-1.5 cursor-pointer bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 px-3 py-1 rounded-lg border border-[#D4AF37]/30 transition-all"
                  >
                    {activeAudioSection === "music" && isPlayingAudio ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-amber-300" />
                        <span>Pause Audio</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Listen to Raga Reflection</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => onNavigateTab("sangeet")}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#07080B] text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-md shadow-[#D4AF37]/20 flex items-center gap-2"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Listen to Scales in Sangeet Studio</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex items-center justify-center p-6 rounded-2xl bg-black/40 border border-white/10">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center mx-auto shadow-lg shadow-[#D4AF37]/20">
                  <Music className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <h4 className="font-serif text-lg font-bold text-white">{music.raga}</h4>
                <p className="text-xs text-[#E8DFD1]/60 max-w-xs">
                  Acoustic frequency tuned to peaceful emotional equilibrium (Shanta & Bhakti Rasa).
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CHAPTER 4: LIVING CRAFT & MASTER ARTISAN ── */}
      {craft && (
        <section
          id="chapter-craft"
          className="glass-panel-gold rounded-3xl border border-[#D4AF37]/45 p-6 sm:p-9 shadow-2xl space-y-6 relative overflow-hidden transition-all duration-700"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] uppercase tracking-wider">
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span>Chapter IV • The Master Crafts of Your Ancestors</span>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Fair-Trade Master Artisan
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Craft Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl h-64 sm:h-80 w-full group">
                <img
                  src={craft.imageUrl || "/images/bazaar/pattachitra.jpg"}
                  alt={craft.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 right-4 text-xs">
                  <span className="font-serif font-bold text-white block text-sm">
                    {craft.name}
                  </span>
                  <span className="text-[11px] text-[#D4AF37] font-mono block">
                    {craft.craftName}
                  </span>
                </div>
              </div>
            </div>

            {/* Narrative & Artisan Profile */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <span className="text-xs font-mono text-[#D4AF37]">
                  Handcrafted in {craft.state}
                  {craft.village ? ` • ${craft.village}` : ""}
                </span>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white pt-1">
                  {craft.craftName}
                </h2>
                <div className="flex items-center gap-2 pt-1">
                  <p className="text-xs text-[#E8DFD1]/70 leading-relaxed">
                    Preserved by <strong className="text-white">{craft.artisanName}</strong> ({craft.artisanTitle})
                  </p>
                </div>
              </div>

              {/* Second-Person Intimate Narration */}
              <div className="p-4 rounded-2xl bg-black/40 border border-[#D4AF37]/25 space-y-2">
                <p className="text-xs sm:text-sm text-[#E8DFD1]/90 leading-relaxed font-sans">
                  {narrations?.craftNarration ||
                    `A craft your ancestors' region is celebrated for across centuries is ${craft.craftName}. Master craftsmen like ${craft.artisanName} still practice this generational art without industrial shortcuts, directly carrying the heritage of your soil forward.`}
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => handlePlayAudio("craft", narrations?.craftNarration)}
                    className="text-[11px] font-mono font-bold text-[#F5E0A0] hover:text-white flex items-center gap-1.5 cursor-pointer bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 px-3 py-1 rounded-lg border border-[#D4AF37]/30 transition-all"
                  >
                    {activeAudioSection === "craft" && isPlayingAudio ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-amber-300" />
                        <span>Pause Audio</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Listen to Artisan Story</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Materials */}
              {craft.materials && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-[#E8DFD1]/80 space-y-1">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase block">
                    Ancestral Raw Materials:
                  </span>
                  <p className="text-[11px]">{craft.materials.join(" • ")}</p>
                </div>
              )}

              <div className="pt-1">
                <button
                  onClick={() => onNavigateTab("bazaar", craft.id)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#07080B] text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-md shadow-[#D4AF37]/20 flex items-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Inspect Masterpiece in Bazaar</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── HONEST OMISSION SCHOLARLY NOTICE FOR THIN-COVERAGE REGIONS ── */}
      {omittedCategories.length > 0 && (
        <section className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-200/90 space-y-2 text-xs leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-amber-300 font-mono text-sm">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Scholarly Archival Fieldwork Note for {region.name}</span>
          </div>
          <p>
            Āryāvarta upholds strict factual grounding. We have respectfully omitted chapters where
            complete 3D photogrammetry splats, classical dance treatises, or master artisan guilds are
            currently undergoing field verification. Our scholars and local cooperatives are actively
            expanding records for <strong>{region.name}</strong>.
          </p>
        </section>
      )}

      {/* ── CLOSING BLESSING & SANCTUARY NAVIGATION ── */}
      <section className="p-8 rounded-3xl bg-gradient-to-b from-black/80 to-[#12100C] border border-[#D4AF37]/40 text-center space-y-4 shadow-2xl">
        <Heart className="w-8 h-8 text-[#D4AF37] mx-auto animate-pulse" />
        <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-gradient">
          The Soil of Bharat Walks With You
        </h3>
        <p className="text-xs sm:text-sm text-[#E8DFD1]/80 max-w-xl mx-auto italic font-sans leading-relaxed">
          {narrations?.closing ||
            `May the stone architecture, sacred movements, and living artistry of ${region.name} remain a lifelong compass to your roots.`}
        </p>
        <div className="flex items-center justify-center gap-3 pt-3 flex-wrap">
          <button
            onClick={onReopenOnboarding}
            className="px-5 py-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-[#E8DFD1] text-xs font-semibold transition-all cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Explore Another Region</span>
          </button>
          <button
            onClick={() => onNavigateTab("discover")}
            className="px-6 py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#F5E0A0] text-[#07080B] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/25"
          >
            Return to Sanctuary Home
          </button>
        </div>
      </section>

      {/* ── CHAPTER 5: SHAREABLE ROOTS CARD & KEEPSAKE ── */}
      <ShareableRootsCard journeyData={journeyData} narrations={narrations} />
    </div>
  );
};
