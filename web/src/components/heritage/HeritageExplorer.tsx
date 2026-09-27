"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Compass,
  Sparkles,
  MapPin,
  Volume2,
  VolumeX,
  Maximize2,
  Music,
  Palette,
  Users,
  CalendarDays,
  ChevronRight,
  X,
  Award,
  Info,
  ArrowUpRight,
  Layers,
  AlertTriangle,
  ExternalLink,
  Camera,
  Loader2,
  WifiOff,
  Scan,
} from "lucide-react";
import showcaseData from "@/data/heritage_showcase.json";
import { HeritageSite, Hotspot } from "@/types";
import { audioManager } from "@/lib/audioManager";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/context/LanguageContext";
import { LocalGLBViewer } from "./LocalGLBViewer";


// ─────────────────────────────────────────────────────────────────────────────
// TYPE DECLARATIONS for Sketchfab Viewer API (window.Sketchfab)
// ─────────────────────────────────────────────────────────────────────────────
declare global {
  interface Window {
    Sketchfab?: new (iframe: HTMLIFrameElement) => SketchfabClient;
  }
}

interface SketchfabClient {
  init: (modelId: string, options: SketchfabInitOptions) => void;
}

interface SketchfabAPI {
  start: () => void;
  addEventListener: (event: string, callback: () => void) => void;
  setCameraLookAt: (
    eye: [number, number, number],
    target: [number, number, number],
    duration: number,
    callback?: () => void
  ) => void;
  getCameraLookAt: (callback: (err: unknown, camera: { position: number[]; target: number[] }) => void) => void;
  recenterCamera: (callback?: () => void) => void;
  setExposure: (exposure: number, callback?: () => void) => void;
  getAnnotationList: (callback: (err: unknown, annotations: unknown[]) => void) => void;
}

interface SketchfabInitOptions {
  success: (api: SketchfabAPI) => void;
  error: () => void;
  ui_controls?: number;
  ui_infos?: number;
  ui_inspector?: number;
  ui_watermark_link?: number;
  ui_ar?: number;
  ui_help?: number;
  ui_fullscreen?: number;
  ui_settings?: number;
  ui_vr?: number;
  ui_annotations?: number;
  autostart?: number;
  preload?: number;
  transparent?: number;
  camera?: number;
  scrollwheel?: number;
  double_click?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SKETCHFAB VIEWER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface SketchfabViewerProps {
  modelId: string;
  embedUrl?: string;
  onReady: (api?: SketchfabAPI) => void;
  onError: () => void;
}

const SKETCHFAB_VIEWER_SCRIPT = "/sketchfab-viewer-1.12.1.js";
const SKETCHFAB_VIEWER_CDN = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";

function SketchfabViewer({ modelId, embedUrl, onReady, onError }: SketchfabViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const clientRef = useRef<SketchfabClient | null>(null);
  const initialized = useRef(false);
  const [directEmbed, setDirectEmbed] = useState(false);

  useEffect(() => {
    initialized.current = false;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
    let isMounted = true;

    const fallbackToDirect = () => {
      if (!isMounted) return;
      setDirectEmbed(true);
      if (iframeRef.current && embedUrl) {
        iframeRef.current.src = `${embedUrl}?autostart=1&internal=1&ui_infos=0&ui_watermark_link=0&ui_controls=1`;
      }
      onReady();
    };

    // Watchdog: If API doesn't report ready within 5 seconds, reveal directly so user is never stuck
    fallbackTimer = setTimeout(() => {
      if (isMounted) {
        fallbackToDirect();
      }
    }, 5000);

    const initViewer = () => {
      if (!iframeRef.current || initialized.current || !isMounted) return;
      initialized.current = true;

      try {
        if (!window.Sketchfab) {
          fallbackToDirect();
          return;
        }

        const client = new window.Sketchfab(iframeRef.current);
        clientRef.current = client;

        client.init(modelId, {
          success: (api: SketchfabAPI) => {
            if (!isMounted) return;
            if (fallbackTimer) clearTimeout(fallbackTimer);
            api.start();
            api.addEventListener("viewerready", () => {
              if (!isMounted) return;
              try {
                api.setExposure(1.0);
              } catch (_) {}
              onReady(api);
            });
          },
          error: () => {
            if (!isMounted) return;
            if (fallbackTimer) clearTimeout(fallbackTimer);
            fallbackToDirect();
          },
          ui_controls: 1,        // Allow user rotation/pan
          ui_infos: 0,           // Hide model info bar
          ui_inspector: 0,       // Hide inspector
          ui_watermark_link: 0,  // Hide watermark link
          ui_ar: 0,              // Hide AR button
          ui_help: 0,            // Hide help
          ui_fullscreen: 0,      // Hide fullscreen (handled by our UI)
          ui_settings: 0,        // Hide settings gear
          ui_vr: 0,              // Hide VR button
          ui_annotations: 1,     // Keep annotations
          autostart: 1,          // Auto-start
          preload: 1,            // Preload textures
          transparent: 1,        // Transparent background
          scrollwheel: 1,        // Enable zoom
          camera: 0,
        });
      } catch (err) {
        console.warn("Sketchfab initialization error, falling back to direct embed:", err);
        fallbackToDirect();
      }
    };

    if (window.Sketchfab) {
      initViewer();
    } else {
      const existingScript = document.getElementById("sketchfab-viewer-api") as HTMLScriptElement | null;
      if (existingScript) {
        if (window.Sketchfab) {
          initViewer();
        } else {
          existingScript.addEventListener("load", initViewer);
          existingScript.addEventListener("error", fallbackToDirect);
        }
      } else {
        const script = document.createElement("script");
        script.id = "sketchfab-viewer-api";
        script.src = SKETCHFAB_VIEWER_SCRIPT;
        script.async = true;
        script.onload = () => {
          if (window.Sketchfab) {
            initViewer();
          } else {
            fallbackToDirect();
          }
        };
        script.onerror = () => {
          const cdnScript = document.createElement("script");
          cdnScript.src = SKETCHFAB_VIEWER_CDN;
          cdnScript.async = true;
          cdnScript.onload = () => {
            if (window.Sketchfab) initViewer();
            else fallbackToDirect();
          };
          cdnScript.onerror = fallbackToDirect;
          document.head.appendChild(cdnScript);
        };
        document.head.appendChild(script);
      }
    }

    return () => {
      isMounted = false;
      initialized.current = false;
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [modelId, embedUrl, onReady, onError]);

  return (
    <iframe
      ref={iframeRef}
      id={`sketchfab-viewer-${modelId}`}
      title={`3D model viewer — ${modelId}`}
      allow="autoplay; fullscreen; xr-spatial-tracking"
      className="w-full h-full border-0 bg-transparent"
      style={{ background: "transparent" }}
      onLoad={() => {
        if (directEmbed) {
          onReady();
        }
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HERITAGE EXPLORER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface HeritageExplorerProps {
  onNavigateTab: (tabId: string, contextId?: string) => void;
  selectedLanguage: string;
  initialSiteId?: string;
}

type ViewerState = "loading" | "ready" | "error";
type CameraView = "full" | "close" | "detail";

export const HeritageExplorer: React.FC<HeritageExplorerProps> = ({
  onNavigateTab,
  initialSiteId,
}) => {
  const { t, language } = useLanguage();
  const currentLangMeta = SUPPORTED_LANGUAGES.find((l) => l.code === language) || { name: "English", code: "en" };
  const monuments: HeritageSite[] = showcaseData as unknown as HeritageSite[];

  const [selectedSite, setSelectedSite] = useState<HeritageSite>(() => {
    if (initialSiteId) {
      const match = monuments.find((m) => m.id === initialSiteId);
      if (match) return match;
    }
    return monuments[0];
  });
  const [isNarrating, setIsNarrating] = useState(false);
  const [translatedSubtitle, setTranslatedSubtitle] = useState<string | null>(null);
  const [viewerState, setViewerState] = useState<ViewerState>("loading");
  const [activeCameraView, setActiveCameraView] = useState<CameraView>("full");
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const apiRef = useRef<SketchfabAPI | null>(null);
  const viewerContainerRef = useRef<HTMLDivElement>(null);

  // Sync site if initialSiteId changes
  useEffect(() => {
    if (initialSiteId) {
      const match = monuments.find((m) => m.id === initialSiteId);
      if (match && match.id !== selectedSite.id) {
        handleSelectSite(match);
      }
    }
  }, [initialSiteId]);

  // Reset state when monument changes
  const handleSelectSite = (site: HeritageSite) => {
    if (isNarrating) {
      audioManager.stopSpeech();
      setIsNarrating(false);
    }
    setSelectedSite(site);
    setViewerState("loading");
    setActiveCameraView("full");
    setActiveHotspot(null);
    apiRef.current = null;
  };

  const handleViewerReady = useCallback((api?: SketchfabAPI) => {
    if (api) {
      apiRef.current = api;
      const presets = selectedSite.camera_presets;
      if (presets) {
        try {
          api.setCameraLookAt(presets.full.eye, presets.full.target, 2.0);
        } catch (_) {}
      } else {
        try {
          api.recenterCamera();
        } catch (_) {}
      }
    }
    setViewerState("ready");
  }, [selectedSite]);

  const handleViewerError = useCallback(() => {
    setViewerState("error");
  }, []);

  // Camera view button handler
  const handleCameraView = (view: CameraView) => {
    setActiveCameraView(view);
    setActiveHotspot(null);
    const presets = selectedSite.camera_presets;
    if (!apiRef.current || !presets) return;
    const preset = presets[view];
    apiRef.current.setCameraLookAt(preset.eye, preset.target, 1.5);
  };

  // Toggle fullscreen on the viewer container
  const handleFullscreen = () => {
    if (!viewerContainerRef.current) return;
    if (!document.fullscreenElement) {
      viewerContainerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Narration handler
  const handleToggleNarration = () => {
    if (isNarrating) {
      audioManager.stopSpeech();
      setIsNarrating(false);
      setTranslatedSubtitle(null);
    } else {
      setIsNarrating(true);
      setTranslatedSubtitle(null);
      const text = `${selectedSite.name}, ${selectedSite.state}. ${selectedSite.summary} Built during the ${selectedSite.dynasty} period by ${selectedSite.builder}. Architectural style: ${selectedSite.architectural_style}.`;
      audioManager.speakNarration(
        text,
        language,
        () => { setIsNarrating(false); setTranslatedSubtitle(null); },
        (translated) => setTranslatedSubtitle(translated)
      );
    }
  };

  const sf = selectedSite.sketchfab;
  const localModel = (selectedSite as unknown as { local_model?: string }).local_model;
  const presets = selectedSite.camera_presets;
  const cl = selectedSite.cultural_links;


  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

      {/* ── Title ── */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#F5E0A0] text-xs tracking-[0.2em]">
          <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>STHAPATYAM • REAL 3D MONUMENT SCANS</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-gold-gradient tracking-wide">
          Interactive Monument Showcase
        </h1>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[#E8DFD1]/70">
          Real photogrammetry scans and detailed 3D models, powered by Sketchfab. Orbit 360°, zoom into carvings, and listen to Sarvam AI narration.
        </p>
      </div>

      {/* ── Monument Selection Tabs ── */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {monuments.map((m) => {
          const isSelected = selectedSite.id === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleSelectSite(m)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#D4AF37] text-[#07080B] font-bold shadow-lg shadow-[#D4AF37]/30 scale-105"
                  : "bg-white/5 text-[#E8DFD1]/70 hover:text-[#D4AF37] border border-white/5 hover:border-[#D4AF37]/30"
              }`}
            >
              <span>{m.name}</span>
              <span className="text-[10px] opacity-70 ml-1.5 font-normal">({m.state})</span>
            </button>
          );
        })}
      </div>

      {/* ── Main Grid: Viewer + Side Panel ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 items-start">

        {/* ── 3D Viewport ── */}
        <div
          ref={viewerContainerRef}
          className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/35 shadow-2xl bg-[#07080B]"
          style={{ minHeight: 540 }}
        >
          {/* Sketchfab iFrame — lazy loaded per monument */}
          {sf && (
            <div className={`w-full transition-opacity duration-500 ${viewerState === "ready" ? "opacity-100" : "opacity-0"}`}
              style={{ height: 540 }}>
              <SketchfabViewer
                key={selectedSite.id}   /* re-mount entirely when monument changes */
                modelId={sf.model_id}
                embedUrl={sf.embed_url}
                onReady={handleViewerReady}
                onError={handleViewerError}
              />
            </div>
          )}

          {/* Local GLB viewer — shown when no Sketchfab or as primary for local models */}
          {!sf && localModel && (
            <div className="w-full" style={{ height: 540 }}>
              <LocalGLBViewer
                key={selectedSite.id}
                modelPath={localModel}
                modelName={selectedSite.name}
                onReady={() => setViewerState("ready")}
                onError={() => setViewerState("error")}
              />
            </div>
          )}

          {/* Toggle button: switch between Sketchfab and local GLB if both exist */}
          {sf && localModel && viewerState === "ready" && (
            <div className="absolute top-4 right-4 z-30">
              <span className="text-[10px] font-mono text-[#D4AF37] px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-[#D4AF37]/30">
                ● Offline model also available
              </span>
            </div>
          )}

          {/* ── Loading Overlay ── */}
          {viewerState === "loading" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[#07080B] z-20">
              {/* Radial temple aura */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-80 h-80 rounded-full bg-[#D4AF37]/10 blur-3xl animate-pulse" />
              </div>

              {/* Starfield dots */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 45 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-[#D4AF37] opacity-25 animate-pulse"
                    style={{
                      width: Math.random() * 2 + 1,
                      height: Math.random() * 2 + 1,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 3}s`,
                    }}
                  />
                ))}
              </div>

              {/* Central Sacred Mandala Miniature */}
              <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  {/* Outer Kalachakra wheel rotating */}
                  <svg
                    className="absolute inset-0 w-full h-full animate-[spin_12s_linear_infinite]"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth="1.2"
                      strokeOpacity="0.6"
                      strokeDasharray="4 6"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#F5E0A0"
                      strokeWidth="0.8"
                      strokeOpacity="0.4"
                    />
                    {Array.from({ length: 12 }).map((_, idx) => {
                      const ang = (idx * 360) / 12;
                      return (
                        <line
                          key={idx}
                          x1="50"
                          y1="12"
                          x2="50"
                          y2="4"
                          transform={`rotate(${ang} 50 50)`}
                          stroke="#D4AF37"
                          strokeWidth="1.2"
                        />
                      );
                    })}
                  </svg>

                  {/* Inner counter-rotating lotus */}
                  <svg
                    className="absolute w-12 h-12 animate-[spin_8s_linear_infinite_reverse]"
                    viewBox="0 0 60 60"
                  >
                    <rect
                      x="15"
                      y="15"
                      width="30"
                      height="30"
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth="1"
                      strokeOpacity="0.7"
                      transform="rotate(45 30 30)"
                    />
                  </svg>

                  {/* Center glowing golden bindu */}
                  <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFF3D6] shadow-[0_0_12px_#D4AF37] animate-ping opacity-75" />
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#D4AF37]" />
                </div>

                <div className="text-center space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F5E0A0] text-[10px] uppercase font-mono tracking-widest">
                    <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                    <span>STHAPATYAM 3D</span>
                  </div>
                  <h3 className="text-sm font-semibold font-cinzel text-gold-gradient">
                    Rendering Sacred Architecture…
                  </h3>
                  <p className="text-[#E8DFD1]/60 text-xs">
                    {selectedSite.name} • {selectedSite.dynasty}
                  </p>
                  {sf?.is_photogrammetry && (
                    <p className="text-[#34D399]/70 text-[10px] flex items-center gap-1 justify-center pt-0.5">
                      <Scan className="w-3 h-3 text-[#34D399]" />
                      High-density photogrammetry mesh
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setViewerState("ready")}
                  className="mt-1 px-3 py-1 rounded-full text-[11px] text-[#D4AF37]/90 hover:text-white bg-white/5 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 transition-all cursor-pointer shadow-sm"
                >
                  Direct 3D View →
                </button>
              </div>
            </div>
          )}

          {/* ── Error Overlay ── */}
          {viewerState === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#07080B] z-20">
              <WifiOff className="w-12 h-12 text-[#E8DFD1]/30" />
              <div className="text-center space-y-1">
                <p className="text-[#E8DFD1]/70 font-semibold text-sm">Model temporarily unavailable</p>
                <p className="text-[#E8DFD1]/40 text-xs max-w-xs text-center">
                  Could not load the 3D scan from Sketchfab. Check your internet connection or try again.
                </p>
              </div>
              <a
                href={sf?.embed_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View on Sketchfab directly
              </a>
            </div>
          )}

          {/* ── Top-Left: Monument Identity Badge ── */}
          <div className="absolute top-5 left-5 z-20 space-y-1.5 pointer-events-none">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-[#D4AF37] px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37]/30 inline-block">
                {selectedSite.dynasty} • {selectedSite.state}
              </span>
              {selectedSite.unesco_world_heritage && (
                <span className="text-[10px] font-bold text-white px-2.5 py-1 rounded-full bg-[#1a6b3a]/80 backdrop-blur-md border border-[#34D399]/40 inline-flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#34D399]" />
                  UNESCO WHS
                </span>
              )}
              {sf?.is_photogrammetry && (
                <span className="text-[10px] font-bold text-white px-2.5 py-1 rounded-full bg-[#1e3a5f]/80 backdrop-blur-md border border-[#60A5FA]/40 inline-flex items-center gap-1">
                  <Scan className="w-3 h-3 text-[#60A5FA]" />
                  Photogrammetry
                </span>
              )}
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white drop-shadow-md">
              {selectedSite.name}
            </h2>
            <p className="text-[11px] text-[#D4AF37]/80 italic">&ldquo;{selectedSite.tagline}&rdquo;</p>
          </div>

          {/* ── Hotspot overlay pins ── */}
          {viewerState === "ready" && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              {selectedSite.hotspots.slice(0, 3).map((hs, idx) => {
                const positions2d = [
                  { top: "42%", left: "58%" },
                  { top: "65%", left: "30%" },
                  { top: "32%", left: "45%" },
                ];
                const p = positions2d[idx % positions2d.length];
                return (
                  <div
                    key={hs.id}
                    className="absolute pointer-events-auto"
                    style={{ top: p.top, left: p.left, transform: "translate(-50%,-50%)" }}
                  >
                    <button
                      onClick={() => setActiveHotspot(activeHotspot?.id === hs.id ? null : hs)}
                      className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border transition-all cursor-pointer shadow-lg ${
                        activeHotspot?.id === hs.id
                          ? "bg-[#D4AF37] text-[#07080B] border-[#D4AF37]"
                          : "bg-black/70 text-[#D4AF37] border-[#D4AF37]/50 hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]"
                      }`}
                    >
                      <MapPin className="w-3 h-3" />
                      <span className="hidden sm:inline">{hs.category}</span>
                      {activeHotspot?.id !== hs.id && (
                        <span className="absolute -inset-1 rounded-full border border-[#D4AF37]/40 animate-ping opacity-60" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Hotspot detail card ── */}
          {activeHotspot && viewerState === "ready" && (
            <div className="absolute bottom-20 left-4 right-4 sm:left-auto sm:right-5 sm:w-80 z-30">
              <div className="p-4 rounded-2xl bg-[#07080B]/95 backdrop-blur-xl border border-[#D4AF37]/40 shadow-2xl shadow-black/60">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">{activeHotspot.category}</span>
                    <h3 className="text-sm font-bold text-white leading-tight mt-0.5">{activeHotspot.title}</h3>
                  </div>
                  <button
                    onClick={() => setActiveHotspot(null)}
                    className="shrink-0 p-1 rounded-full hover:bg-white/10 text-[#E8DFD1]/60 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-[#E8DFD1]/70 leading-relaxed mb-3">{activeHotspot.extended_story}</p>
                {activeHotspot.connected_module && (
                  <button
                    onClick={() => {
                      onNavigateTab(activeHotspot.connected_module!, activeHotspot.connected_id);
                      setActiveHotspot(null);
                    }}
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] hover:text-white transition-all cursor-pointer group"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    Explore in {activeHotspot.connected_module}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── Bottom control bar ── */}
          <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-black/75 backdrop-blur-md border border-[#D4AF37]/25">
            {/* Narration */}
            <button
              onClick={handleToggleNarration}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
                isNarrating
                  ? "bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse"
                  : "bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#07080B] hover:brightness-110 shadow-md shadow-[#D4AF37]/20"
              }`}
            >
              {isNarrating ? (
                <><VolumeX className="w-4 h-4" /><span>{t.pauseNarration}</span></>
              ) : (
                <><Volume2 className="w-4 h-4" /><span className="hidden sm:inline">{t.listenNarration} • {currentLangMeta.name}</span><span className="sm:hidden">Listen</span></>
              )}
            </button>

            {/* Camera preset buttons */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#D4AF37] hidden sm:inline uppercase">Camera:</span>
              {(["full", "close", "detail"] as CameraView[]).map((view) => {
                const label = presets?.[view]?.label ?? { full: "Full View", close: "Sanctum", detail: "Details" }[view];
                return (
                  <button
                    key={view}
                    onClick={() => handleCameraView(view)}
                    disabled={viewerState !== "ready"}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      activeCameraView === view
                        ? "bg-[#D4AF37] text-[#07080B] font-bold"
                        : "bg-white/10 text-[#E8DFD1]/70 hover:text-white hover:bg-white/15"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
              {/* Fullscreen button */}
              <button
                onClick={handleFullscreen}
                className="p-1.5 rounded-lg text-xs border border-white/10 text-[#E8DFD1]/50 hover:text-white hover:border-[#D4AF37]/40 transition-all cursor-pointer"
                title="Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── Sketchfab Attribution Credit (MANDATORY) ── */}
          {sf && (
            <div className={`absolute bottom-[72px] left-5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border transition-all ${
              sf.license_flagged
                ? "border-amber-500/40"
                : "border-white/10"
            }`}>
              {sf.license_flagged && <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />}
              <span className="text-[10px] text-[#E8DFD1]/60">
                3D:{" "}
                <a
                  href={sf.creator_profile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#60A5FA] hover:underline font-medium"
                >
                  {sf.creator}
                </a>
                {" "}via Sketchfab
              </span>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
                sf.license_flagged
                  ? "bg-amber-500/20 text-amber-400"
                  : sf.license_label.startsWith("CC")
                  ? "bg-[#34D399]/15 text-[#34D399]"
                  : "bg-white/10 text-[#E8DFD1]/50"
              }`}>
                {sf.license_label}
              </span>
              <a
                href={sf.embed_url.replace("/embed", "")}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-0.5 text-[#E8DFD1]/30 hover:text-[#60A5FA] transition-colors"
                title="View on Sketchfab"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Subtitles */}
          {isNarrating && translatedSubtitle && (
            <div className="absolute bottom-24 left-6 right-6 z-30 pointer-events-none flex justify-center">
              <div className="max-w-2xl px-4 py-2.5 rounded-2xl bg-black/85 backdrop-blur-lg border border-[#D4AF37]/50 shadow-2xl text-[#F5E0A0] text-xs sm:text-sm font-medium text-center leading-relaxed flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 animate-pulse" />
                <span>{translatedSubtitle}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Cultural Side Panel ── */}
        <div className="space-y-4 xl:max-h-[540px] xl:overflow-y-auto xl:pr-1">

          {/* ── Asset Disclaimer (if detail piece) ── */}
          {selectedSite.asset_note && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-300/80 leading-relaxed">{selectedSite.asset_note}</p>
            </div>
          )}

          {/* ── Monument Quick Facts ── */}
          <div className="rounded-2xl border border-[#D4AF37]/20 bg-white/[0.03] p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Info className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Monument Facts</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="space-y-0.5">
                <span className="text-[#E8DFD1]/50 text-[10px] uppercase tracking-wider">Built</span>
                <p className="text-[#E8DFD1] font-medium">{selectedSite.built_century}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[#E8DFD1]/50 text-[10px] uppercase tracking-wider">Builder</span>
                <p className="text-[#E8DFD1] font-medium">{selectedSite.builder}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[#E8DFD1]/50 text-[10px] uppercase tracking-wider">Style</span>
                <p className="text-[#E8DFD1] font-medium">{selectedSite.architectural_style}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[#E8DFD1]/50 text-[10px] uppercase tracking-wider">Location</span>
                <p className="text-[#E8DFD1] font-medium">{selectedSite.district}, {selectedSite.state}</p>
              </div>
            </div>
            <p className="text-[11px] text-[#E8DFD1]/65 leading-relaxed border-t border-white/5 pt-3">
              {selectedSite.summary}
            </p>
          </div>

          {/* ── License Info (shown when flagged) ── */}
          {sf?.license_flagged && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">License Notice</span>
              </div>
              <p className="text-[10px] text-amber-300/70 leading-relaxed">{sf.license_note}</p>
            </div>
          )}

          {/* ── CC Attribution (for CC models) ── */}
          {sf && !sf.license_flagged && sf.license_label.startsWith("CC") && (
            <div className="rounded-xl border border-[#34D399]/20 bg-[#34D399]/5 p-3 space-y-1">
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#34D399]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#34D399]">Open License</span>
              </div>
              <p className="text-[10px] text-[#34D399]/70">{sf.license_note}</p>
              {sf.license_url && (
                <a href={sf.license_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-[#34D399] hover:underline">
                  <ExternalLink className="w-2.5 h-2.5" />{sf.license_label}
                </a>
              )}
            </div>
          )}

          {/* ── Cultural Living Traditions ── */}
          <div className="rounded-2xl border border-[#D4AF37]/20 bg-white/[0.03] p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Cultural Living Traditions</span>
            </div>
            <div className="space-y-2.5">
              {cl.dance && (
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 hover:bg-[#D4AF37]/10 border border-transparent hover:border-[#D4AF37]/30 transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center shrink-0">
                      <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#E8DFD1]/50 uppercase tracking-wider">Classical Dance</p>
                      <p className="text-xs font-bold text-[#E8DFD1]">{cl.dance.name}</p>
                      {cl.dance.description && (
                        <p className="text-[10px] text-[#E8DFD1]/55 mt-0.5 max-w-[180px] leading-snug">{cl.dance.description}</p>
                      )}
                    </div>
                  </div>
                  <button onClick={() => onNavigateTab("nritya", cl.dance?.id)}
                    className="shrink-0 p-1.5 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37] hover:text-[#07080B] text-[#D4AF37] transition-all cursor-pointer">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {cl.music && (
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 hover:bg-[#C084FC]/10 border border-transparent hover:border-[#C084FC]/30 transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#C084FC]/15 flex items-center justify-center shrink-0">
                      <Music className="w-3.5 h-3.5 text-[#C084FC]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#E8DFD1]/50 uppercase tracking-wider">Sacred Raga</p>
                      <p className="text-xs font-bold text-[#E8DFD1]">{cl.music.raga}</p>
                      {cl.music.description && (
                        <p className="text-[10px] text-[#E8DFD1]/55 mt-0.5 max-w-[180px] leading-snug">{cl.music.description}</p>
                      )}
                    </div>
                  </div>
                  <button onClick={() => onNavigateTab("sangeet", cl.music?.id)}
                    className="shrink-0 p-1.5 rounded-lg bg-[#C084FC]/10 hover:bg-[#C084FC] hover:text-white text-[#C084FC] transition-all cursor-pointer">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {cl.craft && (
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 hover:bg-[#34D399]/10 border border-transparent hover:border-[#34D399]/30 transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#34D399]/15 flex items-center justify-center shrink-0">
                      <Layers className="w-3.5 h-3.5 text-[#34D399]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#E8DFD1]/50 uppercase tracking-wider">Living Craft</p>
                      <p className="text-xs font-bold text-[#E8DFD1]">{cl.craft.name}</p>
                      {cl.craft.artisan && <p className="text-[10px] text-[#E8DFD1]/55 mt-0.5">by {cl.craft.artisan}</p>}
                      {cl.craft.village && <p className="text-[10px] text-[#34D399]/70 mt-0.5">{cl.craft.village}</p>}
                    </div>
                  </div>
                  <button onClick={() => onNavigateTab("bazaar", cl.craft?.id)}
                    className="shrink-0 p-1.5 rounded-lg bg-[#34D399]/10 hover:bg-[#34D399] hover:text-[#07080B] text-[#34D399] transition-all cursor-pointer">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {cl.festival && (
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 hover:bg-[#F97316]/10 border border-transparent hover:border-[#F97316]/30 transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#F97316]/15 flex items-center justify-center shrink-0">
                      <CalendarDays className="w-3.5 h-3.5 text-[#F97316]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#E8DFD1]/50 uppercase tracking-wider">Festival</p>
                      <p className="text-xs font-bold text-[#E8DFD1]">{cl.festival.name}</p>
                      {cl.festival.date && <p className="text-[10px] text-[#F97316]/70 mt-0.5">{cl.festival.date}</p>}
                    </div>
                  </div>
                  <button onClick={() => onNavigateTab("festivals")}
                    className="shrink-0 p-1.5 rounded-lg bg-[#F97316]/10 hover:bg-[#F97316] hover:text-white text-[#F97316] transition-all cursor-pointer">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Hotspot List ── */}
          {selectedSite.hotspots.length > 0 && (
            <div className="rounded-2xl border border-[#D4AF37]/20 bg-white/[0.03] p-5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Discover Hotspots</span>
              </div>
              <div className="space-y-2">
                {selectedSite.hotspots.map((hs) => (
                  <button
                    key={hs.id}
                    onClick={() => setActiveHotspot(activeHotspot?.id === hs.id ? null : hs)}
                    className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      activeHotspot?.id === hs.id
                        ? "bg-[#D4AF37]/15 border-[#D4AF37]/50"
                        : "bg-white/5 border-transparent hover:border-[#D4AF37]/20"
                    }`}
                  >
                    <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${activeHotspot?.id === hs.id ? "bg-[#D4AF37]" : "bg-[#D4AF37]/40"}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#E8DFD1] truncate">{hs.title}</p>
                      <p className="text-[10px] text-[#E8DFD1]/55 leading-snug mt-0.5">{hs.short_desc}</p>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 mt-0.5 text-[#D4AF37]/60 transition-transform ${activeHotspot?.id === hs.id ? "rotate-90" : ""}`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Camera Quick Reference ── */}
          {presets && (
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Camera className="w-4 h-4 text-[#E8DFD1]/50" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8DFD1]/50">Camera Presets</span>
              </div>
              {(["full", "close", "detail"] as CameraView[]).map((view) => (
                <button
                  key={view}
                  onClick={() => handleCameraView(view)}
                  disabled={viewerState !== "ready"}
                  className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all disabled:opacity-40 cursor-pointer ${
                    activeCameraView === view
                      ? "bg-[#D4AF37]/15 text-[#D4AF37] font-bold border border-[#D4AF37]/30"
                      : "bg-white/5 text-[#E8DFD1]/60 hover:text-white border border-transparent hover:border-white/10"
                  }`}
                >
                  <Camera className="w-3 h-3 shrink-0" />
                  {presets[view].label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
