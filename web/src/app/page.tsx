"use client";

import React, { useState, useEffect } from "react";
import { Compass, ArrowRight, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DiscoverCanvas } from "@/components/discover/DiscoverCanvas";
import { BharatMapExplorer } from "@/components/map/BharatMapExplorer";
import { HeritageExplorer } from "@/components/heritage/HeritageExplorer";
import { HistoryAtlas } from "@/components/history/HistoryAtlas";
import { FestivalsExplorer } from "@/components/festivals/FestivalsExplorer";
import { SangeetStudio } from "@/components/sangeet/SangeetStudio";
import { NrityaStudio } from "@/components/nritya/NrityaStudio";
import { BazaarExplorer } from "@/components/bazaar/BazaarExplorer";
import { PanditAIChat } from "@/components/chat/PanditAIChat";
import { HeritageLoadingScreen } from "@/components/common/HeritageLoadingScreen";
import { DiasporaRootsJourney } from "@/components/roots/DiasporaRootsJourney";
import { DiasporaRootsOnboarding } from "@/components/roots/DiasporaRootsOnboarding";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("discover");
  const [activeContextId, setActiveContextId] = useState<string | undefined>();
  const [aiPrompt, setAiPrompt] = useState<string | null>(null);
  const [isLoadingScreen, setIsLoadingScreen] = useState<boolean>(true);
  const [isRootsModalOpen, setIsRootsModalOpen] = useState<boolean>(false);
  const [rootsSessionKey, setRootsSessionKey] = useState<number>(Date.now());
  const [activeRootsRegion, setActiveRootsRegion] = useState<string | null>(null);
  const [isBreadcrumbDismissed, setIsBreadcrumbDismissed] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("aryavarta_diaspora_roots");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.regionName) {
          setActiveRootsRegion(parsed.regionName);
          return;
        }
      }
      setActiveRootsRegion(null);
    } catch {
      setActiveRootsRegion(null);
    }
  }, [activeTab, rootsSessionKey]);

  const handleNavigateTab = (tabId: string, contextId?: string) => {
    if (tabId === "roots-modal") {
      setIsRootsModalOpen(true);
      return;
    }
    setActiveTab(tabId);
    setActiveContextId(contextId);
    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.0 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAskAI = (prompt: string) => {
    setAiPrompt(prompt);
  };

  return (
    <div className="min-h-screen bg-[#07080B] text-[#E8DFD1] flex flex-col selection:bg-[#D4AF37] selection:text-[#07080B]">
      {/* ── Sacred Heritage Cinematic Loading Screen ── */}
      {isLoadingScreen && (
        <HeritageLoadingScreen
          minDuration={2000}
          onComplete={() => setIsLoadingScreen(false)}
        />
      )}
      {/* Primary Fixed Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1">
        {activeTab === "discover" && (
          <DiscoverCanvas onNavigateTab={handleNavigateTab} />
        )}

        {activeTab === "roots" && (
          <DiasporaRootsJourney
            key={rootsSessionKey}
            onNavigateTab={handleNavigateTab}
            onReopenOnboarding={() => setIsRootsModalOpen(true)}
          />
        )}

        {activeTab === "map" && (
          <BharatMapExplorer
            onNavigateTab={handleNavigateTab}
            onAskAI={handleAskAI}
          />
        )}

        {activeTab === "monuments" && (
          <HeritageExplorer
            onNavigateTab={handleNavigateTab}
            selectedLanguage={language}
            initialSiteId={activeContextId}
          />
        )}

        {activeTab === "history" && (
          <HistoryAtlas onNavigateTab={handleNavigateTab} />
        )}

        {activeTab === "festivals" && (
          <FestivalsExplorer onNavigateTab={handleNavigateTab} />
        )}

        {activeTab === "sangeet" && <SangeetStudio />}

        {activeTab === "nritya" && (
          <NrityaStudio initialDanceId={activeContextId} />
        )}

        {activeTab === "bazaar" && (
          <BazaarExplorer initialCraftId={activeContextId} />
        )}
      </main>

      {/* Diaspora Roots Mode Onboarding Modal */}
      <DiasporaRootsOnboarding
        isOpen={isRootsModalOpen}
        onClose={() => setIsRootsModalOpen(false)}
        onBeginJourney={() => {
          setIsRootsModalOpen(false);
          setRootsSessionKey(Date.now());
          handleNavigateTab("roots");
        }}
      />

      {/* In-Progress Diaspora Roots Floating Breadcrumb Indicator (Only shown when user navigated away to other modules like Nritya/Bazaar/Monuments/etc.) */}
      {activeRootsRegion && activeTab !== "roots" && activeTab !== "discover" && !isBreadcrumbDismissed && (
        <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#100E0A]/95 backdrop-blur-md border border-[#D4AF37]/50 shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={() => handleNavigateTab("roots")}
            className="flex items-center gap-2 text-xs font-medium text-[#F5E0A0] hover:text-white transition-colors cursor-pointer"
            title={`Return to your ${activeRootsRegion} ancestral journey`}
          >
            <Compass className="w-4 h-4 text-[#D4AF37] animate-spin-slow" />
            <span>Return to {activeRootsRegion} Journey</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </button>
          <button
            onClick={() => setIsBreadcrumbDismissed(true)}
            className="text-[#E8DFD1]/50 hover:text-white transition-colors p-0.5 rounded-full cursor-pointer ml-1"
            title="Dismiss breadcrumb"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Cultural Guide AI Floating Assistant */}
      <PanditAIChat
        initialPrompt={aiPrompt}
        onClearInitialPrompt={() => setAiPrompt(null)}
      />

      {/* Luxury Footer */}
      <Footer onNavigateTab={handleNavigateTab} />
    </div>
  );
}
