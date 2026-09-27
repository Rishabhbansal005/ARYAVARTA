"use client";

import React, { useEffect, useState } from "react";
import Lenis from "lenis";
import { ArrowUp } from "lucide-react";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Initialize Lenis for luxurious, soothing inertia momentum scrolling
    const lenis = new Lenis({
      duration: 1.25, // Gentle, soothing duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Luxurious exponential deceleration
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9, // Ultra-smooth, non-jarring wheel response
      touchMultiplier: 1.6,
    });

    window.__lenis = lenis;

    // Listen to scroll to update scroll progress & show/hide scroll-to-top button
    lenis.on("scroll", ({ progress, scroll }: { progress: number; scroll: number }) => {
      setScrollProgress(Math.round(progress * 100));
      setShowScrollTop(scroll > 400);
    });

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {children}

      {/* ── Soothing Floating Scroll-to-Top Button with Circular Progress Ring ── */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-24 right-6 sm:bottom-24 sm:right-7 z-40 p-3 rounded-full bg-[#0E111A]/90 backdrop-blur-md border border-[#D4AF37]/35 text-[#D4AF37] shadow-xl shadow-black/60 transition-all duration-500 cursor-pointer hover:border-[#D4AF37] hover:scale-110 hover:shadow-[#D4AF37]/20 group ${
          showScrollTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        {/* SVG Circular Progress Track */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r="19"
            fill="none"
            stroke="rgba(212, 175, 55, 0.15)"
            strokeWidth="2"
          />
          <circle
            cx="22"
            cy="22"
            r="19"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2"
            strokeDasharray={119.38}
            strokeDashoffset={119.38 - (119.38 * scrollProgress) / 100}
            strokeLinecap="round"
            className="transition-all duration-150 ease-out"
          />
        </svg>

        <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
      </button>
    </>
  );
};
