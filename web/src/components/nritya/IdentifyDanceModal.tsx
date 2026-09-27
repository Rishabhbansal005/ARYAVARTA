"use client";

import React, { useState } from "react";
import {
  X,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Layers,
  HelpCircle,
  Camera
} from "lucide-react";
import { DanceClassificationResult } from "@/app/api/dance/classify/route";

interface IdentifyDanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDanceToPractice: (danceId: string) => void;
}

export const IdentifyDanceModal: React.FC<IdentifyDanceModalProps> = ({
  isOpen,
  onClose,
  onSelectDanceToPractice
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DanceClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleClassify = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("hints", selectedFile.name);

      const res = await fetch("/api/dance/classify", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error("Server error during dance classification");
      }

      const data: DanceClassificationResult = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error("Classification error:", err);
      setError(err.message || "Failed to classify dance image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#131622] via-[#0A0C12] to-[#131622] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 hover:border-[#D4AF37]/60 text-white/70 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F5E0A0] text-[11px] font-mono tracking-wider">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            AI DANCE VISION CLASSIFIER
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
            Identify Indian Dance Form (Classical & Folk)
          </h2>
          <p className="text-xs text-[#E8DFD1]/70 leading-relaxed font-sans">
            Upload any Indian dance photograph or video frame. Our neural vision classifier recognizes postures, costumes, ornaments, and headgear across Classical traditions (Kathak, Odissi, Bharatanatyam, etc.) and celebrated Folk heritages (Bhangra, Garba, Ghoomar, Lavani, Bihu, Chhau, etc.).
          </p>
        </div>

        {/* Upload Zone */}
        {!previewUrl ? (
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center border-2 border-dashed border-[#D4AF37]/40 hover:border-[#D4AF37] rounded-3xl p-8 sm:p-12 bg-black/40 hover:bg-[#D4AF37]/5 transition-all cursor-pointer group text-center space-y-3"
          >
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <span className="font-cinzel text-sm font-bold text-[#F5E0A0] block">
                Drag & Drop or Click to Upload Image / Clip
              </span>
              <span className="text-[11px] text-[#E8DFD1]/50 block mt-0.5">
                Supports JPG, PNG, WEBP, or MP4 dance frames
              </span>
            </div>
          </label>
        ) : (
          <div className="space-y-4">
            {/* Preview Container */}
            <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/30 bg-black max-h-64 flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Dance pose preview"
                className="max-h-64 w-auto object-contain"
              />
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setResult(null);
                }}
                className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/80 border border-white/20 text-white text-[11px] hover:bg-black font-mono transition-all"
              >
                Change Photo
              </button>
            </div>

            {/* Action Button */}
            {!result && (
              <button
                onClick={handleClassify}
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#D4AF37]/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Analyzing Costumes, Posture & Heritage Markers...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>Identify Dance Form with AI Vision</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Classification Result Display */}
        {result && (
          <div className="space-y-5 pt-2 border-t border-white/10 animate-fade-in">
            {/* Uncertainty Warning if Confidence < 60% */}
            {result.isUncertain && (
              <div className="p-3.5 rounded-2xl bg-amber-950/50 border border-amber-500/50 text-amber-200 text-xs flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-amber-300 block">
                    Scholarly Advisory ({result.confidence}% Confidence)
                  </span>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed font-sans">
                    The visual cues exhibit mixed or non-standard posture signatures. Below is the closest match according to historical dance archives.
                  </p>
                </div>
              </div>
            )}

            {/* Folk / Non-Classical Notice Banner */}
            {result.folkNotice && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-emerald-300 block">
                    Folk Heritage Recognition
                  </span>
                  <p className="text-[11px] text-emerald-200/90 leading-relaxed font-sans">
                    {result.folkNotice}
                  </p>
                </div>
              </div>
            )}

            {/* Main Predicted Match */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#D4AF37]/20 via-black/80 to-[#D4AF37]/10 border border-[#D4AF37] space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold">
                      {result.state} •
                    </span>
                    {result.category === "classical" ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#F5E0A0] border border-[#D4AF37]/40 text-[9px] font-mono font-bold">
                        CLASSICAL (Sangeet Natak Akademi)
                      </span>
                    ) : result.category === "semi-classical" ? (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[9px] font-mono font-bold">
                        SEMI-CLASSICAL / MARTIAL THEATRE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold">
                        CELEBRATED FOLK TRADITION
                      </span>
                    )}
                  </div>
                  <h3 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
                    {result.danceName}
                    <span className="text-sm text-[#F5E0A0] font-serif font-normal">
                      ({result.nativeName})
                    </span>
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xl font-mono font-bold text-[#F5E0A0]">
                    {result.confidence}%
                  </span>
                  <span className="text-[10px] text-[#E8DFD1]/60 block font-mono">
                    Model Confidence
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#E8DFD1]/90 leading-relaxed font-sans">
                {result.description}
              </p>

              {result.explanation && (
                <div className="p-3 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-xs text-[#E8DFD1]/90 italic font-serif flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>&ldquo;{result.explanation}&rdquo;</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-[11px] text-[#D4AF37] font-mono">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Cultural Source: {result.treatise}</span>
              </div>

              {/* Key Visual Signatures */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8DFD1]/60">
                  Key Visual Signatures Detected:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.keyVisualSignatures.map((sig, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full bg-black/60 border border-white/10 text-[10px] text-[#F5E0A0] font-sans"
                    >
                      ✓ {sig}
                    </span>
                  ))}
                </div>
              </div>

              {/* Deep Link to Live Practice */}
              {result.category === "classical" ? (
                <button
                  onClick={() => {
                    onSelectDanceToPractice(result.practiceDeepLinkId);
                    onClose();
                  }}
                  className="w-full mt-2 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Practice {result.danceName} Posture in AI Mirror</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    onSelectDanceToPractice(result.practiceDeepLinkId);
                    onClose();
                  }}
                  className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Practice Related Classical Posture in AI Mirror</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Probability Breakdown */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-mono uppercase text-[#E8DFD1]/70 block">
                Classification Confidence & Cultural Proximity:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-mono">
                {Object.entries(result.allProbabilities).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between"
                  >
                    <span className="capitalize text-[#E8DFD1]/80">{key}</span>
                    <span className="font-bold text-[#F5E0A0]">{val}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
