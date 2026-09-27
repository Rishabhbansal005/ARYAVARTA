import { TraditionType } from "@/types";

export interface FestivalThemeConfig {
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  cardBorder: string;
  cardGlow: string;
  gradientBg: string;
  motifIcon: string;
  traditionLabel: string;
}

export const FESTIVAL_THEMES: Record<TraditionType, FestivalThemeConfig> = {
  hindu: {
    accentColor: "#D4AF37",
    badgeBg: "bg-amber-500/10",
    badgeBorder: "border-amber-500/30",
    badgeText: "text-amber-300",
    cardBorder: "border-[#D4AF37]/35 hover:border-[#D4AF37]",
    cardGlow: "shadow-[#D4AF37]/15",
    gradientBg: "from-[#D4AF37]/15 via-transparent to-transparent",
    motifIcon: "🪔",
    traditionLabel: "Sanatana Dharma • Hindu Tradition"
  },
  islamic: {
    accentColor: "#10B981",
    badgeBg: "bg-emerald-500/15",
    badgeBorder: "border-emerald-500/40",
    badgeText: "text-emerald-300",
    cardBorder: "border-emerald-500/35 hover:border-emerald-400",
    cardGlow: "shadow-emerald-500/20",
    gradientBg: "from-emerald-950/40 via-[#0A0C12] to-[#0A0C12]",
    motifIcon: "🌙",
    traditionLabel: "Islamic Tradition • Lunar Observance"
  },
  sikh: {
    accentColor: "#F59E0B",
    badgeBg: "bg-blue-600/20",
    badgeBorder: "border-amber-500/40",
    badgeText: "text-amber-300",
    cardBorder: "border-amber-500/35 hover:border-amber-400",
    cardGlow: "shadow-amber-500/20",
    gradientBg: "from-blue-950/40 via-amber-950/20 to-[#0A0C12]",
    motifIcon: "⚔️",
    traditionLabel: "Sikhi • Gurmat Tradition"
  },
  "harvest-seasonal": {
    accentColor: "#EAB308",
    badgeBg: "bg-yellow-500/15",
    badgeBorder: "border-yellow-500/40",
    badgeText: "text-yellow-300",
    cardBorder: "border-yellow-500/35 hover:border-yellow-400",
    cardGlow: "shadow-yellow-500/20",
    gradientBg: "from-amber-950/40 via-emerald-950/20 to-[#0A0C12]",
    motifIcon: "🌾",
    traditionLabel: "Agrarian Solar Harvest • Pan-India"
  },
  "civic-national": {
    accentColor: "#FF9933",
    badgeBg: "bg-orange-500/15",
    badgeBorder: "border-orange-500/40",
    badgeText: "text-orange-200",
    cardBorder: "border-orange-500/35 hover:border-emerald-500/50",
    cardGlow: "shadow-orange-500/20",
    gradientBg: "from-orange-950/30 via-slate-900 to-emerald-950/30",
    motifIcon: "🇮🇳",
    traditionLabel: "Sovereign Republic • National Day"
  },
  christian: {
    accentColor: "#EF4444",
    badgeBg: "bg-red-500/15",
    badgeBorder: "border-red-500/40",
    badgeText: "text-red-300",
    cardBorder: "border-red-500/35 hover:border-red-400",
    cardGlow: "shadow-red-500/20",
    gradientBg: "from-red-950/40 via-amber-950/20 to-[#0A0C12]",
    motifIcon: "⭐",
    traditionLabel: "Christian Tradition • Feast of Faith"
  },
  buddhist: {
    accentColor: "#DC2626",
    badgeBg: "bg-rose-900/20",
    badgeBorder: "border-amber-600/40",
    badgeText: "text-amber-200",
    cardBorder: "border-amber-600/35 hover:border-amber-400",
    cardGlow: "shadow-amber-600/20",
    gradientBg: "from-rose-950/40 via-amber-950/20 to-[#0A0C12]",
    motifIcon: "☸️",
    traditionLabel: "Buddha Sasana • Dharma Tradition"
  },
  jain: {
    accentColor: "#F59E0B",
    badgeBg: "bg-amber-100/10",
    badgeBorder: "border-amber-300/30",
    badgeText: "text-amber-100",
    cardBorder: "border-amber-300/35 hover:border-amber-200",
    cardGlow: "shadow-amber-200/15",
    gradientBg: "from-stone-900 via-amber-950/20 to-[#0A0C12]",
    motifIcon: "✋",
    traditionLabel: "Jain Dharma • Ahimsa Paramodharma"
  },
  "tribal-regional": {
    accentColor: "#EA580C",
    badgeBg: "bg-orange-700/20",
    badgeBorder: "border-indigo-500/40",
    badgeText: "text-orange-300",
    cardBorder: "border-orange-600/35 hover:border-indigo-400",
    cardGlow: "shadow-orange-600/20",
    gradientBg: "from-orange-950/40 via-indigo-950/20 to-[#0A0C12]",
    motifIcon: "🥁",
    traditionLabel: "Indigenous Adivasi & Folk Tradition"
  }
};

export function getThemeForTradition(tradition: TraditionType): FestivalThemeConfig {
  return FESTIVAL_THEMES[tradition] || FESTIVAL_THEMES.hindu;
}
