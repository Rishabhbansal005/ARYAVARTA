"use client";

import React, { useMemo } from "react";
import mapData from "@/data/india_map_path.json";
import { HistoricalEventEntity } from "@/types";
import { MapPin, Compass } from "lucide-react";

interface HistoryMapInsetProps {
  events: HistoricalEventEntity[];
  activeEvent: HistoricalEventEntity | null;
  onSelectEvent: (ev: HistoricalEventEntity) => void;
  className?: string;
}

// Lambert Conformal Conic projection to SVG coordinates
function toSvg(lat: number, lon: number): [number, number] {
  const proj = mapData.projection;
  const R = 6371000;
  const lat1 = (20 * Math.PI) / 180;
  const lat2 = (40 * Math.PI) / 180;
  const lat0 = (30 * Math.PI) / 180;
  const lon0 = (78 * Math.PI) / 180;
  const n =
    Math.log(Math.cos(lat1) / Math.cos(lat2)) /
    Math.log(Math.tan(Math.PI / 4 + lat2 / 2) / Math.tan(Math.PI / 4 + lat1 / 2));
  const F = (Math.cos(lat1) * Math.pow(Math.tan(Math.PI / 4 + lat1 / 2), n)) / n;
  const rho0 = (R * F) / Math.pow(Math.tan(Math.PI / 4 + lat0 / 2), n);

  const phi = (lat * Math.PI) / 180;
  const lam = (lon * Math.PI) / 180;
  const rho = (R * F) / Math.pow(Math.tan(Math.PI / 4 + phi / 2), n);
  const x = rho * Math.sin(n * (lam - lon0));
  const y = rho0 - rho * Math.cos(n * (lam - lon0));
  const sx = (x - proj.minx) * proj.scale;
  const sy = (proj.maxy - y) * proj.scale;
  return [Math.round(sx * 10) / 10, Math.round(sy * 10) / 10];
}

export const HistoryMapInset: React.FC<HistoryMapInsetProps> = ({
  events,
  activeEvent,
  onSelectEvent,
  className = ""
}) => {
  // Compute positions of active window events
  const projectedEvents = useMemo(() => {
    return events
      .filter((ev) => ev.location && typeof ev.location.lat === "number" && typeof ev.location.lng === "number")
      .map((ev) => {
        const [x, y] = toSvg(ev.location.lat, ev.location.lng);
        return { ev, x, y };
      });
  }, [events]);

  const activeCoord = useMemo(() => {
    if (!activeEvent || !activeEvent.location) return null;
    return toSvg(activeEvent.location.lat, activeEvent.location.lng);
  }, [activeEvent]);

  return (
    <div className={`relative rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-b from-[#0F121C] via-[#0A0C12] to-[#0F121C] p-4 overflow-hidden shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#D4AF37] animate-spin-slow" />
          <span className="font-cinzel text-xs font-bold text-[#F5E0A0] tracking-wider">
            BHARAT ITIHAAS GEOGRAPHY • DUAL VIEW
          </span>
        </div>
        {activeEvent && (
          <span className="text-[10px] font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {activeEvent.location.modernName}
          </span>
        )}
      </div>

      {/* SVG Canvas Map */}
      <div className="relative w-full aspect-[4/3] max-h-[300px] flex items-center justify-center bg-black/40 rounded-2xl overflow-hidden border border-white/5">
        <svg
          viewBox="360 240 420 460"
          className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(212,175,55,0.15)]"
        >
          {/* Subtle Grid Lines */}
          <defs>
            <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </radialGradient>
            <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Ambient Glow */}
          <rect x="360" y="240" width="420" height="460" fill="url(#mapGlow)" />

          {/* India Boundary Path */}
          <path
            d={mapData.india_path}
            fill="#141824"
            stroke="#D4AF37"
            strokeWidth="1.2"
            strokeOpacity="0.6"
            className="transition-all duration-500"
          />

          {/* Secondary Pins for other events in active temporal window */}
          {projectedEvents.map(({ ev, x, y }) => {
            const isSelected = activeEvent?.id === ev.id;
            if (isSelected) return null; // rendered separately on top
            return (
              <g
                key={ev.id}
                onClick={() => onSelectEvent(ev)}
                className="cursor-pointer group"
              >
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#D4AF37"
                  fillOpacity="0.4"
                  stroke="#F5E0A0"
                  strokeWidth="1"
                  className="transition-all duration-300 group-hover:r-6 group-hover:fill-amber-400 group-hover:fill-opacity-90"
                />
              </g>
            );
          })}

          {/* Active Event Glowing Animated Target Pin */}
          {activeCoord && activeEvent && (
            <g
              transform={`translate(${activeCoord[0]}, ${activeCoord[1]})`}
              className="pointer-events-none"
            >
              {/* Outer expanding ripple ring */}
              <circle
                r="16"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1.5"
                opacity="0.6"
                className="animate-ping origin-center"
              />
              {/* Middle pulsing ring */}
              <circle
                r="9"
                fill="#D4AF37"
                fillOpacity="0.25"
                stroke="#F5E0A0"
                strokeWidth="1.5"
              />
              {/* Core radiant pin */}
              <circle
                r="4.5"
                fill="#F5E0A0"
                stroke="#07080B"
                strokeWidth="1.5"
                filter="url(#glowFilter)"
              />
            </g>
          )}
        </svg>

        {/* Floating Context Caption */}
        {activeEvent && (
          <div className="absolute bottom-2 left-2 right-2 bg-black/85 backdrop-blur-md border border-[#D4AF37]/40 rounded-xl px-3 py-1.5 flex items-center justify-between text-[11px] shadow-lg">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shrink-0" />
              <span className="text-white font-serif font-bold truncate">
                {activeEvent.title.en}
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#F5E0A0] shrink-0 font-bold ml-2">
              {activeEvent.yearLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
