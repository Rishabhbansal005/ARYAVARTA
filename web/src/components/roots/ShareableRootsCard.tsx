"use client";

import React, { useRef, useState } from "react";
import {
  Compass,
  Landmark,
  Flower2,
  Music,
  ShoppingBag,
  Download,
  Share2,
  Check,
  Sparkles,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { toPng, toBlob } from "html-to-image";
import confetti from "canvas-confetti";
import { AssembledRootsJourney } from "@/lib/rootsAssembler";

interface ShareableRootsCardProps {
  journeyData: AssembledRootsJourney;
  narrations?: {
    intro?: string;
    siteNarration?: string;
    danceNarration?: string;
    musicNarration?: string;
    craftNarration?: string;
    closing?: string;
  } | null;
}

export const ShareableRootsCard: React.FC<ShareableRootsCardProps> = ({
  journeyData,
  narrations,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const { region, site, dance, music, craft } = journeyData;

  // Single short tagline derived strictly from existing RAG narration
  const tagline =
    narrations?.closing ||
    narrations?.intro ||
    `May the living architecture, sacred movements, and ancestral artistry of ${region.name} remain a lifelong compass to your roots.`;

  // Categories present in this journey (only non-omitted)
  const populatedCount = [site, dance, music, craft].filter(Boolean).length;
  const hasPopulatedEntities = populatedCount > 0;

  // Handle client-side PNG generation & download
  const handleDownloadImage = async () => {
    if (!cardRef.current || isExporting) return;
    setIsExporting(true);

    try {
      // Generate razor-sharp high-DPI image
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.98,
        pixelRatio: 2.5,
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `aryavarta-roots-${region.name.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);

      // Joyful celebratory golden confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#D4AF37", "#F5E0A0", "#AA820A", "#FFFFFF"],
        });
      } catch {
        // ignore confetti errors
      }
    } catch (err) {
      console.error("Error generating roots card image:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Web Share API with image blob fallback
  const handleShare = async () => {
    if (!cardRef.current || isExporting) return;
    setIsExporting(true);

    try {
      const shareTitle = `My Ancestral Roots: ${region.name} • Āryāvarta`;
      const shareText = `Reconnecting with the living heritage of my family's ancestral land of ${region.name} on Āryāvarta.`;

      // 1. Try sharing as a real image file via Web Share API
      if (typeof navigator !== "undefined" && navigator.canShare) {
        try {
          const blob = await toBlob(cardRef.current, {
            quality: 0.95,
            pixelRatio: 2,
            cacheBust: true,
          });

          if (blob) {
            const file = new File(
              [blob],
              `roots-${region.name.toLowerCase()}.png`,
              { type: "image/png" }
            );

            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: shareTitle,
                text: shareText,
                files: [file],
              });
              setIsExporting(false);
              return;
            }
          }
        } catch (fileShareErr) {
          console.warn("File share not accepted, attempting text share:", fileShareErr);
        }

        // 2. Fallback to native text share if file sharing isn't permitted
        if (navigator.share) {
          await navigator.share({
            title: shareTitle,
            text: `${shareText}\n\n"${tagline}"`,
            url: window.location.href,
          });
          setIsExporting(false);
          return;
        }
      }

      // 3. Fallback: Download the card directly & copy message to clipboard
      await handleDownloadImage();
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareTitle}\n"${tagline}"\n${window.location.href}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      }
    } catch (e) {
      console.warn("Share fallback initiated:", e);
      await handleDownloadImage();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section id="chapter-keepsake" className="space-y-8 pt-6 pb-12">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#F5E0A0] text-xs font-mono tracking-wider shadow-lg shadow-[#D4AF37]/10">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>CHAPTER V • YOUR ANCESTRAL KEEPSAKE • पैतृक स्मृति पत्र</span>
        </div>
        <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-gold-gradient">
          Your Personal Roots Card
        </h2>
        <p className="text-xs sm:text-sm text-[#E8DFD1]/70 max-w-lg mx-auto">
          A timeless keepsake of your ancestral homeland to share with family or keep on your journey.
        </p>
      </div>

      {/* ── CARD WRAPPER / CONTAINER (Formatted for 4:5 Portrait Sharing) ── */}
      <div className="flex justify-center px-2">
        <div
          ref={cardRef}
          className="relative w-full max-w-[460px] rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#181510] via-[#0E1017] to-[#07080B] text-[#E8DFD1] border-2 border-[#D4AF37]/50 shadow-2xl shadow-black/90 overflow-hidden flex flex-col justify-between"
          style={{ minHeight: "560px" }}
        >
          {/* Subtle Sacred Chakra Background Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-[#D4AF37]/10 pointer-events-none -z-0">
            <div className="w-full h-full rounded-full border-2 border-dashed border-[#D4AF37]/15 animate-[spin_60s_linear_infinite]" />
          </div>

          {/* Inner Golden Inset Border with Corner Accents */}
          <div className="absolute inset-3 rounded-2xl border border-[#D4AF37]/25 pointer-events-none -z-0" />
          <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none" />
          <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none" />

          {/* ── Top Header & Branding ── */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#D4AF37]/15">
                  <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                </div>
                <span className="font-cinzel text-xs font-bold tracking-[0.2em] text-[#D4AF37]">
                  ĀRYĀVARTA
                </span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-[#E8DFD1]/50 uppercase">
                Ancestral Roots Card
              </span>
            </div>

            {/* Region Title (Latin + Native Script header pattern) */}
            <div className="text-center space-y-1 pt-1">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] uppercase block">
                Ancestral Homeland
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-extrabold text-[#F5E0A0] tracking-wide flex items-center justify-center gap-2 flex-wrap">
                <span>{region.name}</span>
                {region.nativeName && (
                  <>
                    <span className="text-[#D4AF37]/60">•</span>
                    <span className="font-serif text-[#FDF0CD]">{region.nativeName}</span>
                  </>
                )}
              </h3>
            </div>

            {/* Tagline from existing narration */}
            <div className="p-3 rounded-xl bg-black/40 border border-[#D4AF37]/20 text-center">
              <p className="text-[11px] sm:text-xs text-[#E8DFD1]/90 italic font-sans leading-relaxed line-clamp-3">
                &ldquo;{tagline}&rdquo;
              </p>
            </div>
          </div>

          {/* ── Middle: Cultural Entities Badges (Non-omitted categories only) ── */}
          <div className="relative z-10 py-4 my-auto">
            {hasPopulatedEntities ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Monument */}
                {site && (
                  <div className={`p-2.5 rounded-xl bg-white/[0.04] border border-[#D4AF37]/25 space-y-1 ${populatedCount === 1 ? "sm:col-span-2 text-center" : ""}`}>
                    <div className={`flex items-center gap-1.5 text-[9px] font-mono text-[#D4AF37] uppercase ${populatedCount === 1 ? "justify-center" : ""}`}>
                      <Landmark className="w-3 h-3 text-[#D4AF37] shrink-0" />
                      <span>Monument</span>
                    </div>
                    <div className="font-serif text-xs font-bold text-white truncate">
                      {site.name}
                    </div>
                    {site.dynasty && (
                      <div className="text-[10px] text-[#E8DFD1]/60 truncate">
                        {site.dynasty}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Classical Dance */}
                {dance && (
                  <div className={`p-2.5 rounded-xl bg-white/[0.04] border border-[#D4AF37]/25 space-y-1 ${populatedCount === 1 ? "sm:col-span-2 text-center" : ""}`}>
                    <div className={`flex items-center gap-1.5 text-[9px] font-mono text-[#D4AF37] uppercase ${populatedCount === 1 ? "justify-center" : ""}`}>
                      <Flower2 className="w-3 h-3 text-[#D4AF37] shrink-0" />
                      <span>Classical Dance</span>
                    </div>
                    <div className="font-serif text-xs font-bold text-white truncate">
                      {dance.name}
                    </div>
                    {dance.keyPose && (
                      <div className="text-[10px] text-[#E8DFD1]/60 truncate">
                        {dance.keyPose.split("(")[0]}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Sacred Raga */}
                {music && (
                  <div className={`p-2.5 rounded-xl bg-white/[0.04] border border-[#D4AF37]/25 space-y-1 ${populatedCount === 1 ? "sm:col-span-2 text-center" : ""}`}>
                    <div className={`flex items-center gap-1.5 text-[9px] font-mono text-[#D4AF37] uppercase ${populatedCount === 1 ? "justify-center" : ""}`}>
                      <Music className="w-3 h-3 text-[#D4AF37] shrink-0" />
                      <span>Sacred Raga</span>
                    </div>
                    <div className="font-serif text-xs font-bold text-white truncate">
                      {music.raga}
                    </div>
                    <div className="text-[10px] text-[#E8DFD1]/60 truncate">
                      Evening Temple Resonance
                    </div>
                  </div>
                )}

                {/* 4. Living Craft */}
                {craft && (
                  <div className={`p-2.5 rounded-xl bg-white/[0.04] border border-[#D4AF37]/25 space-y-1 ${populatedCount === 1 ? "sm:col-span-2 text-center" : ""}`}>
                    <div className={`flex items-center gap-1.5 text-[9px] font-mono text-[#D4AF37] uppercase ${populatedCount === 1 ? "justify-center" : ""}`}>
                      <ShoppingBag className="w-3 h-3 text-[#D4AF37] shrink-0" />
                      <span>Master Craft</span>
                    </div>
                    <div className="font-serif text-xs font-bold text-white truncate">
                      {craft.craftName.split("(")[0]}
                    </div>
                    <div className="text-[10px] text-[#E8DFD1]/60 truncate">
                      by {craft.artisanName}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Graceful minimal layout for thin-coverage regions (e.g. Punjab) */
              <div className="py-6 px-4 text-center space-y-2 rounded-2xl bg-white/[0.03] border border-white/10">
                <Compass className="w-8 h-8 text-[#D4AF37] mx-auto opacity-70 animate-pulse" />
                <h4 className="font-serif text-sm font-semibold text-[#F5E0A0]">
                  Unbroken Land of Your Ancestors
                </h4>
                <p className="text-[11px] text-[#E8DFD1]/70 leading-relaxed max-w-xs mx-auto">
                  The soil, sacred rivers, and generational courage of {region.name} walk with you wherever your journey leads.
                </p>
              </div>
            )}
          </div>

          {/* ── Card Footer ── */}
          <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-[#E8DFD1]/50">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
              <span>Grounded Cultural Heritage</span>
            </span>
            <span>aryavarta.heritage</span>
          </div>
        </div>
      </div>

      {/* ── Action Buttons Below Card ── */}
      <div className="flex items-center justify-center gap-3.5 flex-wrap pt-2">
        <button
          onClick={handleDownloadImage}
          disabled={isExporting}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#B38F24] text-[#07080B] text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#D4AF37]/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#07080B]" />
              <span>Generating PNG...</span>
            </>
          ) : exportSuccess ? (
            <>
              <Check className="w-4 h-4 text-[#07080B]" />
              <span>Downloaded Card!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-[#07080B]" />
              <span>Download Roots Card (PNG)</span>
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          disabled={isExporting}
          className="px-6 py-3 rounded-full border border-[#D4AF37]/50 bg-[#16140E]/80 hover:bg-[#D4AF37]/20 text-[#F5E0A0] text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#D4AF37]/10 cursor-pointer disabled:opacity-50 flex items-center gap-2"
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Share Journey</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
