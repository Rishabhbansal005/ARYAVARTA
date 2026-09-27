"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  MapPin,
  ChevronRight,
  Sparkles,
  Landmark,
  Music,
  ShoppingBag,
  Layers,
  ArrowRight
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { DiasporaRootsOnboarding } from "@/components/roots/DiasporaRootsOnboarding";

interface DiscoverCanvasProps {
  onNavigateTab: (tabId: string, contextId?: string) => void;
}

export const DiscoverCanvas: React.FC<DiscoverCanvasProps> = ({ onNavigateTab }) => {
  const { t } = useLanguage();
  const [isRootsOpen, setIsRootsOpen] = useState(false);
  const [savedRootsRegion, setSavedRootsRegion] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("aryavarta_diaspora_roots");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.regionName) {
          setSavedRootsRegion(parsed.regionName);
          return;
        }
      }
      setSavedRootsRegion(null);
    } catch {
      setSavedRootsRegion(null);
    }
  }, [isRootsOpen]);
  const regions = [
    {
      id: "odisha",
      name: "Odisha (Kalinga)",
      native_name: "ଓଡ଼ିଶା",
      monument: "Konark Sun Temple",
      monument_id: "konark-sun-temple",
      dance: "Odissi Dance",
      music: "Raag Kalyan & Odissi Sangeet",
      craft: "Palm Leaf Pattachitra & Stone Carving",
      summary: "Ancient maritime kingdom renowned for monumental Kalinga sandstone architecture, the astronomical chariot of Surya, and devotional Mahari dance traditions.",
      color: "from-amber-500 to-orange-700",
    },
    {
      id: "karnataka",
      name: "Karnataka (Vijayanagara)",
      native_name: "ಕರ್ನಾಟಕ",
      monument: "Hampi & Virupaksha",
      monument_id: "hampi-virupaksha",
      dance: "Yakshagana & Bharatanatyam",
      music: "Carnatic Tradition & Acoustic Pillars",
      craft: "Bidriware Silver Inlay & Kinhal Toys",
      summary: "The boulder-strewn capital of the medieval Vijayanagara Empire, home to acoustic granite musical pillars and world-renowned metallurgy.",
      color: "from-red-500 to-amber-700",
    },
    {
      id: "tamilnadu",
      name: "Tamil Nadu (Chola Mandalam)",
      native_name: "தமிழ்நாடு",
      monument: "Brihadisvara Temple (Thanjavur)",
      monument_id: "brihadisvara-thanjavur",
      dance: "Bharatanatyam",
      music: "Pancharatna Kritis & Nadaswaram",
      craft: "Thanjavur Gold Leaf & Chola Bronzes",
      summary: "Cradle of Dravidian temple architecture, lost-wax bronze casting, and the geometric precision of Bharatanatyam dance.",
      color: "from-emerald-500 to-teal-800",
    },
    {
      id: "maharashtra",
      name: "Maharashtra (Sahyadri)",
      native_name: "महाराष्ट्र",
      monument: "Ajanta & Ellora Kailasa",
      monument_id: "ajanta-ellora-caves",
      dance: "Lavani & Classical Kathak",
      music: "Abhangas & Raag Bhairav",
      craft: "Paithani Silk & Warli Folk Art",
      summary: "Ancient basalt cliff excavations including the monolithic Kailasa temple chiselled top-down from 200,000 tonnes of solid rock.",
      color: "from-purple-500 to-indigo-800",
    },
    {
      id: "rajasthan",
      name: "Rajasthan (Marwar & Mewar)",
      native_name: "राजस्थान",
      monument: "Chittorgarh & Mehrangarh Forts",
      monument_id: "konark-sun-temple",
      dance: "Ghoomar & Jaipur Kathak",
      music: "Maand & Manganiyar Sangeet",
      craft: "Blue Pottery, Phad & Bandhani",
      summary: "Desert kingdoms of heroic epics, monumental hill forts, vibrant mineral dye textiles, and hypnotic folk desert melodies.",
      color: "from-yellow-500 to-amber-800",
    },
    {
      id: "kerala",
      name: "Kerala (Malabar & Travancore)",
      native_name: "കേരളം",
      monument: "Padmanabhaswamy & Bekal Fort",
      monument_id: "brihadisvara-thanjavur",
      dance: "Kathakali & Mohiniyattam",
      music: "Sopana Sangeetham & Chenda Melam",
      craft: "Aranmula Metal Mirror & Kasavu Silk",
      summary: "Tropical coast of martial Kalaripayattu, ritual Theyyam, monumental Kathakali facial makeup, and Vedic chant preservation.",
      color: "from-teal-500 to-emerald-800",
    },
  ];

  const [activeRegion, setActiveRegion] = useState(regions[0]);

  return (
    <div className="space-y-16">
      {/* Grand Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-jaali">
        {/* Radial Ambient Backlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#D4AF37]/15 via-[#C85A32]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6 pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#F5E0A0] text-xs font-semibold tracking-[0.25em] shadow-lg shadow-[#D4AF37]/10">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>HERITAGE • HISTORY • LIVING CULTURE OF BHARAT</span>
          </div>

          <h1 className="font-cinzel-dec text-4xl sm:text-7xl font-extrabold tracking-wider text-gold-gradient leading-tight">
            {t.brandTitle}
          </h1>
          <p className="font-cinzel text-lg sm:text-2xl text-[#E8DFD1] font-light tracking-[0.15em] max-w-2xl mx-auto">
            {t.heroHeadline}
          </p>

          <p className="text-xs sm:text-sm text-[#E8DFD1]/70 max-w-xl mx-auto leading-relaxed">
            {t.heroSubheadline}
          </p>

          {/* Call to Action Grid */}
          <div className="flex items-center justify-center gap-3 pt-4 flex-wrap">
            <button
              onClick={() => onNavigateTab("monuments")}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#F5E0A0] via-[#D4AF37] to-[#AA820A] text-[#07080B] text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/30 cursor-pointer flex items-center gap-2"
            >
              <span>{t.heroCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {savedRootsRegion ? (
              <button
                onClick={() => onNavigateTab("roots")}
                className="px-6 py-3 rounded-full border border-[#D4AF37] bg-gradient-to-r from-[#D4AF37]/30 to-[#B38F24]/30 hover:brightness-110 text-[#F5E0A0] text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-[#D4AF37]/25 cursor-pointer flex items-center gap-2 group"
                title={`Continue your journey to ${savedRootsRegion}`}
              >
                <Compass className="w-4 h-4 text-[#D4AF37] group-hover:rotate-45 transition-transform" />
                <span>Resume {savedRootsRegion} Journey</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>
            ) : (
              <button
                onClick={() => setIsRootsOpen(true)}
                className="px-6 py-3 rounded-full border border-[#D4AF37] bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 text-[#F5E0A0] text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-[#D4AF37]/20 cursor-pointer flex items-center gap-2 group"
              >
                <Compass className="w-4 h-4 text-[#D4AF37] group-hover:rotate-45 transition-transform" />
                <span>Find Your Roots • अपनी जड़ें</span>
              </button>
            )}
            <button
              onClick={() => onNavigateTab("nritya")}
              className="px-6 py-3 rounded-full border border-[#D4AF37]/50 bg-[#0E111A]/80 hover:bg-[#D4AF37]/15 text-[#E8DFD1] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
            >
              Learn Classical Dance
            </button>
            <button
              onClick={() => onNavigateTab("sangeet")}
              className="px-6 py-3 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-[#E8DFD1] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
            >
              Sangeet Studio
            </button>
          </div>
        </div>
      </section>

      {/* ── Diaspora Roots Mode Spotlight Feature Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/45 bg-gradient-to-r from-[#17140E] via-[#0E1118] to-[#17140E] p-6 sm:p-10 shadow-2xl shadow-[#D4AF37]/10 group">
          {/* Ambient glow behind card */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono">
                <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                <span>NEW FEATURE • DIASPORA ROOTS MODE</span>
                <span className="text-[10px] text-[#F5E0A0]/70 font-sans">• अपनी जड़ें खोजें</span>
              </div>

              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-gold-gradient">
                Reconnect With Your Family's Ancestral Soil
              </h3>

              <p className="text-xs sm:text-sm text-[#E8DFD1]/80 max-w-2xl leading-relaxed font-sans">
                Whether your family emigrated generations ago or you wish to trace the traditions of your
                grandparents' village, enter your family memory in natural, conversational words. We gather
                your ancestral evening ragas, classical dance mudras, monumental sacred architecture, and living
                artisan crafts in your preferred language.
              </p>

              <div className="flex items-center gap-4 text-xs font-mono text-[#D4AF37] pt-1 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Conversational Region Extraction
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Historical Name & Alias Support
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  12 Narration Languages
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center lg:items-end justify-center gap-3">
              {savedRootsRegion ? (
                <>
                  <button
                    onClick={() => onNavigateTab("roots")}
                    className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#B38F24] text-[#07080B] text-xs font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#D4AF37]/30 cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    <Compass className="w-4 h-4 text-[#07080B]" />
                    <span>Resume {savedRootsRegion} Journey</span>
                    <ArrowRight className="w-4 h-4 text-[#07080B]" />
                  </button>
                  <button
                    onClick={() => setIsRootsOpen(true)}
                    className="text-[11px] font-mono text-[#D4AF37] hover:underline text-center cursor-pointer"
                  >
                    Start New Ancestral Search
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsRootsOpen(true)}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#B38F24] text-[#07080B] text-xs font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#D4AF37]/30 cursor-pointer flex items-center justify-center gap-2.5"
                >
                  <Compass className="w-4 h-4 text-[#07080B]" />
                  <span>Find Your Roots</span>
                  <ArrowRight className="w-4 h-4 text-[#07080B]" />
                </button>
              )}
              <span className="text-[11px] text-[#E8DFD1]/50 font-mono text-center">
                Free, personal & interactive
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Regional Discovery Map Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs text-[#D4AF37] font-semibold tracking-widest uppercase">
            GEOGRAPHIC CONTINUITY
          </span>
          <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-gold-gradient">
            Explore Bharat By Cultural Region
          </h2>
          <p className="text-xs text-[#E8DFD1]/60 max-w-lg mx-auto">
            Select a region to uncover its monumental architecture, classical dance forms, musical ragas, and living artisan traditions.
          </p>
        </div>

        {/* Region Selector Carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {regions.map((reg) => {
            const isSelected = activeRegion.id === reg.id;
            return (
              <button
                key={reg.id}
                onClick={() => setActiveRegion(reg)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${
                  isSelected
                    ? "bg-gradient-to-b from-[#D4AF37]/25 to-black/60 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 scale-102"
                    : "glass-panel border-white/10 hover:border-[#D4AF37]/40 text-[#E8DFD1]/70"
                }`}
              >
                <span className="text-[10px] text-[#D4AF37] font-semibold uppercase">{reg.native_name}</span>
                <span className="font-cinzel text-xs sm:text-sm font-bold text-white">{reg.name}</span>
                <span className="text-[10px] text-[#E8DFD1]/60 truncate">{reg.monument}</span>
              </button>
            );
          })}
        </div>

        {/* Region Showcase Spotlight Card */}
        <div className="glass-panel-gold p-6 sm:p-10 rounded-3xl border border-[#D4AF37]/40 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-bold tracking-widest uppercase">
              <MapPin className="w-4 h-4" />
              <span>Cultural Geography • {activeRegion.name}</span>
            </div>

            <h3 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
              {activeRegion.monument}
            </h3>
            <p className="text-xs sm:text-sm text-[#E8DFD1]/85 leading-relaxed">
              {activeRegion.summary}
            </p>

            {/* Cultural Trinity Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-black/40 border border-[#D4AF37]/20 space-y-1">
                <span className="text-[10px] text-[#D4AF37] uppercase font-bold block">Classical Dance</span>
                <span className="text-xs font-semibold text-white">{activeRegion.dance}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-[#D4AF37]/20 space-y-1">
                <span className="text-[10px] text-[#D4AF37] uppercase font-bold block">Classical Sangeet</span>
                <span className="text-xs font-semibold text-white">{activeRegion.music}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-[#D4AF37]/20 space-y-1">
                <span className="text-[10px] text-[#D4AF37] uppercase font-bold block">Living Craft</span>
                <span className="text-xs font-semibold text-white truncate block">{activeRegion.craft}</span>
              </div>
            </div>

            <div className="pt-3 flex items-center gap-3">
              <button
                onClick={() => onNavigateTab("monuments", activeRegion.monument_id)}
                className="px-5 py-2.5 rounded-full bg-[#D4AF37] text-[#07080B] text-xs font-bold uppercase tracking-wider hover:bg-[#F5E0A0] transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>Enter Monument Experience</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Highlight Decorative Artwork Plate */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-2 border-[#D4AF37]/30 flex items-center justify-center p-4">
              <div className="w-full h-full rounded-full border border-dashed border-[#D4AF37]/50 animate-[spin_40s_linear_infinite]" />
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[#D4AF37]/20 via-black to-[#07080B] flex flex-col items-center justify-center text-center p-6 border border-[#D4AF37]/40 shadow-2xl">
                <Compass className="w-10 h-10 text-[#D4AF37] mb-2 animate-pulse" />
                <span className="font-cinzel text-lg font-bold text-gold-gradient">
                  {activeRegion.monument}
                </span>
                <span className="text-[10px] text-[#E8DFD1]/60 tracking-wider mt-1">
                  Click to inspect in 3D
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diaspora Roots Mode Onboarding Modal */}
      <DiasporaRootsOnboarding
        isOpen={isRootsOpen}
        onClose={() => setIsRootsOpen(false)}
        onBeginJourney={() => {
          setIsRootsOpen(false);
          onNavigateTab("roots");
        }}
      />
    </div>
  );
};
