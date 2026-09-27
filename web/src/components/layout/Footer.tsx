"use client";

import React from "react";
import { Sparkles, Heart } from "lucide-react";

interface FooterProps {
  onNavigateTab: (tabId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="border-t border-[#D4AF37]/20 bg-[#050608] py-16 text-[#E8DFD1]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#D4AF37]/10">
                <div className="w-4 h-4 rounded-full border border-dashed border-[#D4AF37]" />
              </div>
              <span className="font-cinzel-dec font-bold text-xl tracking-[0.2em] text-gold-gradient">
                ĀRYĀVARTA
              </span>
            </div>
            <p className="text-xs text-[#E8DFD1]/60 max-w-md leading-relaxed">
              Experience the heritage, history, and living culture of Bharat. A unified interactive cultural
              world transforming passive reading into three-dimensional discovery, classical musicology,
              and direct patron connection.
            </p>
            <p className="text-[11px] text-[#D4AF37] italic font-cinzel">
              &ldquo;न हि ज्ञानेन सदृशं पवित्रमिह विद्यते&rdquo; — Certainly, there is nothing in this world as sanctifying as knowledge.
            </p>
          </div>

          {/* Cultural Modules Navigation */}
          <div className="space-y-3">
            <span className="font-cinzel text-xs font-bold text-[#F5E0A0] tracking-widest uppercase block">
              Exploration
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab("discover")}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Geographic Discoveries
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab("monuments")}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  3D Monument Sanctuary
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab("history")}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  2500-Year Historical Atlas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab("festivals")}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Bharat Utsav 2026 Calendar
                </button>
              </li>
            </ul>
          </div>

          {/* Living Traditions */}
          <div className="space-y-3">
            <span className="font-cinzel text-xs font-bold text-[#F5E0A0] tracking-widest uppercase block">
              Living Arts
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab("sangeet")}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  72 Melakarta & Raga AI
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab("nritya")}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Classical Dance Pose Guidance
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab("bazaar")}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Bazaar & Craft Passports
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex items-center justify-between flex-wrap gap-4 text-[11px] text-[#E8DFD1]/50">
          <div>
            © 2026 <span className="text-[#D4AF37] font-semibold">Āryāvarta</span>. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Preserving Indian Heritage & Living Traditions with Digital Craftsmanship</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
