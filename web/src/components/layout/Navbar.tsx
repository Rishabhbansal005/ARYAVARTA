"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Globe } from "lucide-react";
import { audioManager } from "@/lib/audioManager";
import { useLanguage, LanguageCode } from "@/context/LanguageContext";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { language, setLanguage, t, languages } = useLanguage();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSound = async () => {
    const playing = await audioManager.toggleAmbientSound("temple_bells");
    setIsAudioPlaying(playing);
  };

  const navItems = [
    { id: "discover", label: t.navDiscover, sanskrit: "अन्वेषणम्" },
    { id: "map", label: t.navMap, sanskrit: "राज्य दर्शनम्" },
    { id: "monuments", label: t.navMonuments, sanskrit: "स्थापत्यम्" },
    { id: "history", label: t.navHistory, sanskrit: "इतिहासः" },
    { id: "festivals", label: t.navFestivals, sanskrit: "उत्सवाः" },
    { id: "sangeet", label: t.navSangeet, sanskrit: "सङ्गीतम्" },
    { id: "nritya", label: t.navNritya, sanskrit: "नृत्यम्" },
    { id: "bazaar", label: t.navBazaar, sanskrit: "आपणः" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#07080B]/95 backdrop-blur-md border-b border-[#D4AF37]/20 py-2.5 shadow-2xl"
          : "bg-gradient-to-b from-[#07080B]/90 via-[#07080B]/60 to-transparent py-3 sm:py-4"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Identity */}
        <div
          onClick={() => setActiveTab("discover")}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0 select-none"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-[#D4AF37]/50 bg-gradient-to-br from-[#D4AF37]/20 to-transparent group-hover:border-[#D4AF37] transition-all shrink-0">
            {/* Ashoka/Sun Chariot Chakra Motif */}
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-dashed border-[#D4AF37] animate-[spin_20s_linear_infinite]" />
            <div className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#D4AF37]" />
          </div>
          <div className="flex flex-col">
            <span className="font-cinzel-dec font-bold text-base sm:text-lg tracking-[0.2em] text-[#D4AF37] leading-tight">
              {t.brandTitle}
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-[#E8DFD1]/60 font-medium">
              {t.brandTagline}
            </span>
          </div>
        </div>

        {/* Center Navigation Tabs (Pill) */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-[#0E111A]/90 backdrop-blur-md px-2 py-1.5 rounded-full border border-[#D4AF37]/25 shadow-xl">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-2.5 py-1.5 xl:px-3.5 xl:py-1.5 rounded-full text-xs transition-all duration-300 flex flex-col items-center justify-center whitespace-nowrap ${
                  isActive
                    ? "text-[#07080B] font-bold shadow-md shadow-[#D4AF37]/25"
                    : "text-[#E8DFD1]/70 hover:text-[#E8DFD1] hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F5E0A0] via-[#D4AF37] to-[#B38F24] -z-10" />
                )}
                <span className="leading-tight font-medium tracking-wide text-[11px] xl:text-xs">
                  {item.label}
                </span>
                <span
                  className={`text-[8px] xl:text-[9px] leading-tight transition-colors ${
                    isActive ? "text-[#07080B]/80 font-semibold" : "text-[#D4AF37]/70"
                  }`}
                >
                  {item.sanskrit}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Ambient Audio & Language */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Ambient Soundscape Toggle */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs tracking-wider transition-all whitespace-nowrap ${
              isAudioPlaying
                ? "border-[#D4AF37] bg-[#D4AF37]/20 text-[#F5E0A0] shadow-md shadow-[#D4AF37]/30 ring-1 ring-[#D4AF37]/50"
                : "border-[#D4AF37]/30 bg-[#0E111A]/80 text-[#E8DFD1]/70 hover:text-[#E8DFD1] hover:border-[#D4AF37]/60"
            }`}
            title={isAudioPlaying ? "Mute Tanpura Drone" : "Start Meditative Tanpura Drone"}
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                <span className="hidden sm:inline font-mono font-medium">{t.tanpuraOn}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#E8DFD1]/60" />
                <span className="hidden sm:inline font-mono">{t.tanpuraOff}</span>
              </>
            )}
          </button>

          {/* Multilingual Selector */}
          <div className="relative flex items-center bg-[#0E111A]/80 border border-[#D4AF37]/30 rounded-full px-2.5 py-1 hover:border-[#D4AF37]/60 transition-colors">
            <Globe className="w-3.5 h-3.5 text-[#D4AF37] mr-1.5 shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-[#E8DFD1] text-xs focus:outline-none cursor-pointer pr-1"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-[#0E111A] text-[#E8DFD1]">
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Horizontal Scroll Navigation */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-[#D4AF37]/15 bg-[#07080B]/95 gap-2 scrollbar-none mt-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1.5 ${
              activeTab === item.id
                ? "bg-[#D4AF37] text-[#07080B] font-semibold"
                : "text-[#E8DFD1]/70 bg-white/5"
            }`}
          >
            <span>{item.label}</span>
            <span className="text-[9px] opacity-70">({item.sanskrit})</span>
          </button>
        ))}
      </div>
    </header>
  );
};
