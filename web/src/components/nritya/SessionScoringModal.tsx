"use client";

import React from "react";
import {
  X,
  Award,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Activity,
  Flame,
  RotateCcw,
  BookOpen
} from "lucide-react";

export interface SessionResultData {
  danceId: string;
  poseName: string;
  overallScore: number;
  grade: string;
  procrustesScore: number;
  perJointBreakdown: {
    headAndNeck: number;
    torsoLateralShift: number;
    hipDeflection: number;
    kneeAndFootwork: number;
    armsAndMudras: number;
  };
  feedback: string[];
}

interface SessionScoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: SessionResultData | null;
  onPracticeAgain: () => void;
}

export const SessionScoringModal: React.FC<SessionScoringModalProps> = ({
  isOpen,
  onClose,
  result,
  onPracticeAgain
}) => {
  if (!isOpen || !result) return null;

  // Retrieve user practice history from localStorage
  const streak = typeof window !== "undefined" ? Number(localStorage.getItem("nritya_streak") || "3") : 3;
  const totalAttempts = typeof window !== "undefined" ? Number(localStorage.getItem("nritya_attempts") || "12") : 12;

  const jointItems = [
    { label: "Head & Griva Alignment", score: result.perJointBreakdown.headAndNeck },
    { label: "Torso Vaksha Shift", score: result.perJointBreakdown.torsoLateralShift },
    { label: "Hip Kati Deflection", score: result.perJointBreakdown.hipDeflection },
    { label: "Knee Turnout & Footwork", score: result.perJointBreakdown.kneeAndFootwork },
    { label: "Arms & Hastha Mudras", score: result.perJointBreakdown.armsAndMudras },
  ];

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
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F5E0A0] text-[11px] font-mono tracking-wider">
            <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
            AI DANCE INSTRUCTOR • SESSION EVALUATION
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white tracking-wide">
            {result.poseName} Evaluation Dossier
          </h2>
          <p className="text-xs text-[#E8DFD1]/70 max-w-md mx-auto">
            Procrustes 3D shape normalization and kinematic joint angle analytics computed against classical reference canons.
          </p>
        </div>

        {/* Main Score & Grade Hero */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Overall Percentage */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#D4AF37]/20 to-black/60 border border-[#D4AF37] text-center space-y-1">
            <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-wider block font-bold">
              Overall Accuracy
            </span>
            <div className="text-4xl font-mono font-bold text-gold-gradient">
              {result.overallScore}%
            </div>
            <span className="text-[10px] text-[#F5E0A0]/80 font-serif block">
              {result.grade}
            </span>
          </div>

          {/* Procrustes Alignment */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
            <span className="text-[11px] font-mono text-[#E8DFD1]/70 uppercase tracking-wider block">
              Procrustes 3D Match
            </span>
            <div className="text-4xl font-mono font-bold text-emerald-400">
              {result.procrustesScore}%
            </div>
            <span className="text-[10px] text-[#E8DFD1]/50 block">
              Scale & Rotation Invariant
            </span>
          </div>

          {/* Practice Streak & Consistency */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
            <span className="text-[11px] font-mono text-[#E8DFD1]/70 uppercase tracking-wider block flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" />
              Riyaz Streak
            </span>
            <div className="text-4xl font-mono font-bold text-orange-400">
              {streak} Days
            </div>
            <span className="text-[10px] text-[#E8DFD1]/50 block">
              {totalAttempts} Total Pose Attempts
            </span>
          </div>
        </div>

        {/* Joint-by-Joint Breakdown */}
        <div className="space-y-3 p-5 rounded-2xl bg-black/40 border border-white/10">
          <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            Biomechanical Joint Accuracy Breakdown
          </span>

          <div className="space-y-2.5">
            {jointItems.map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#E8DFD1]/80">{item.label}</span>
                  <span className="font-mono font-bold text-[#F5E0A0]">{item.score}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-emerald-400 transition-all duration-700"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Guru Pedagogical Feedback */}
        <div className="p-5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 space-y-2.5">
          <span className="text-xs font-mono font-bold text-[#F5E0A0] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Teacher’s Kinematic Guidance (Guru Upadesha)
          </span>

          <div className="space-y-2 text-xs text-[#E8DFD1]/90 leading-relaxed font-sans">
            {result.feedback.map((line, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[#D4AF37] mt-0.5">•</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              onClose();
              onPracticeAgain();
            }}
            className="flex-1 py-3 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#D4AF37]/20"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Practice Another Attempt</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 text-xs text-[#E8DFD1] transition-all cursor-pointer"
          >
            Review Posture
          </button>
        </div>
      </div>
    </div>
  );
};
