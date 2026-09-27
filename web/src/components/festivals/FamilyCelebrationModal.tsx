"use client";

import React, { useState } from "react";
import { X, Send, AlertCircle, Sparkles, CheckCircle2, User, MapPin } from "lucide-react";

export interface FamilyContribution {
  id: string;
  festivalId: string;
  festivalName: string;
  contributorName: string;
  city: string;
  familyTraditionNote: string;
  timestamp: string;
  verified: boolean; // Always false until human moderation
}

interface FamilyCelebrationModalProps {
  festivalId: string;
  festivalName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contribution: FamilyContribution) => void;
}

export const FamilyCelebrationModal: React.FC<FamilyCelebrationModalProps> = ({
  festivalId,
  festivalName,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [contributorName, setContributorName] = useState("");
  const [city, setCity] = useState("");
  const [traditionNote, setTraditionNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributorName.trim() || !traditionNote.trim()) return;

    const contribution: FamilyContribution = {
      id: "contrib-" + Date.now(),
      festivalId,
      festivalName,
      contributorName: contributorName.trim(),
      city: city.trim() || "India",
      familyTraditionNote: traditionNote.trim(),
      timestamp: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }),
      verified: false
    };

    onSubmit(contribution);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setContributorName("");
      setCity("");
      setTraditionNote("");
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#0F121C] border border-[#D4AF37]/40 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#E8DFD1]/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F5E0A0] text-[11px] font-mono uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            Living Heritage Contribution
          </div>
          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
            How My Family Celebrates
          </h3>
          <p className="text-xs text-[#E8DFD1]/70">
            Share your unique regional customs, heirloom recipes, or ancestral rituals for <strong className="text-[#D4AF37]">{festivalName}</strong>.
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-white">
              Thank You for Preserving Your Heritage!
            </h4>
            <p className="text-xs text-[#E8DFD1]/70 max-w-sm mx-auto">
              Your memory has been recorded. It is currently saved with <span className="font-mono text-amber-300">[⏳ Pending Moderation]</span> to maintain historical authenticity before public display.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-[#D4AF37] flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  Your Name / Family Lineage
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Sharma"
                  value={contributorName}
                  onChange={(e) => setContributorName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[#D4AF37] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  City / Ancestral Village
                </label>
                <input
                  type="text"
                  placeholder="e.g. Varanasi, UP"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-[#D4AF37]">
                Your Family Tradition / Regional Memory
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe what makes your family's celebration special (e.g. Grandma's special kheer, specific morning song, unique courtyard rangoli)..."
                value={traditionNote}
                onChange={(e) => setTraditionNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] resize-none"
              />
            </div>

            {/* Moderation Policy Notice */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2 text-[11px] text-amber-200/90">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                To protect cultural integrity, community contributions are labeled <strong>[Unverified]</strong> and moderated by cultural historians before public indexing.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-[#E8DFD1]/70 hover:text-white bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#07080B] hover:brightness-110 shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Memory
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
