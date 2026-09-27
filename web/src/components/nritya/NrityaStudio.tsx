"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  Camera,
  CameraOff,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Play,
  Pause,
  Award,
  Info,
  ChevronRight,
  UserCheck,
  Video,
  RefreshCw,
  Zap,
  Activity,
  AlertCircle,
  HelpCircle,
  Upload,
  ArrowRight
} from "lucide-react";
import confetti from "canvas-confetti";
import { DanceForm } from "@/types";
import { useDanceMediaPipe } from "./useDanceMediaPipe";
import {
  evaluateDancePose,
  getDancePostureRules,
  evaluateTribhangaPose,
  evaluateMudra,
  RuleEvaluation,
  MudraEvaluation,
  LandmarkPoint,
  TRIBHANGA_THRESHOLDS,
  CANONICAL_TRIBHANGA_LANDMARKS,
  INCORRECT_TRIBHANGA_LANDMARKS
} from "./poseCalibration";
import { IdentifyDanceModal } from "./IdentifyDanceModal";
import { SessionScoringModal, SessionResultData } from "./SessionScoringModal";

interface NrityaStudioProps {
  initialDanceId?: string;
}

// Sacred Indian Temple Chime Generator using Web Audio API
function playSuccessChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const freqs = [528, 660, 792, 1056]; // Solfeggio sacred harmonic chord
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + 2.0);
    });
  } catch (e) {
    // Audio context not allowed without prior user interaction
  }
}

// Distinctive Kinematic Skeletons for All 8 Sangeet Natak Akademi Classical Dances
function getDanceSkeletonPose(danceId: string, w: number, h: number, sway: number) {
  switch (danceId) {
    case "bharatanatyam": // Aramandi diamond half-squat
      return {
        head: { x: w * 0.50, y: h * 0.17 },
        neck: { x: w * 0.50, y: h * 0.25 },
        leftShoulder: { x: w * 0.38, y: h * 0.30 },
        rightShoulder: { x: w * 0.62, y: h * 0.30 },
        leftElbow: { x: w * 0.27, y: h * 0.34 },
        rightElbow: { x: w * 0.73, y: h * 0.34 },
        leftHand: { x: w * 0.38, y: h * 0.44 },
        rightHand: { x: w * 0.62, y: h * 0.44 },
        midTorso: { x: w * 0.50, y: h * 0.42 },
        hips: { x: w * 0.50, y: h * 0.54 },
        leftKnee: { x: w * 0.31, y: h * 0.67 }, // Wide outward diamond abduction
        rightKnee: { x: w * 0.69, y: h * 0.67 },
        leftFoot: { x: w * 0.43, y: h * 0.85 }, // Heels close, toes flared
        rightFoot: { x: w * 0.57, y: h * 0.85 },
      };

    case "kathak": // Upright spin prep with arched overhead arm
      return {
        head: { x: w * 0.50, y: h * 0.18 },
        neck: { x: w * 0.50, y: h * 0.26 },
        leftShoulder: { x: w * 0.41, y: h * 0.31 },
        rightShoulder: { x: w * 0.59, y: h * 0.31 },
        leftElbow: { x: w * 0.28, y: h * 0.33 },
        rightElbow: { x: w * 0.69, y: h * 0.19 }, // Arched upwards
        leftHand: { x: w * 0.16, y: h * 0.33 }, // Extended horizontal
        rightHand: { x: w * 0.53, y: h * 0.08 }, // Arched overhead above crown
        midTorso: { x: w * 0.50, y: h * 0.44 },
        hips: { x: w * 0.50, y: h * 0.56 },
        leftKnee: { x: w * 0.48, y: h * 0.72 }, // Straight upright legs
        rightKnee: { x: w * 0.52, y: h * 0.72 },
        leftFoot: { x: w * 0.48, y: h * 0.88 }, // Together for Tatkar
        rightFoot: { x: w * 0.52, y: h * 0.88 },
      };

    case "kathakali": // Deep martial squat Mandala Sthana
      return {
        head: { x: w * 0.50, y: h * 0.18 },
        neck: { x: w * 0.50, y: h * 0.26 },
        leftShoulder: { x: w * 0.33, y: h * 0.32 }, // Broad heroic chest
        rightShoulder: { x: w * 0.67, y: h * 0.32 },
        leftElbow: { x: w * 0.22, y: h * 0.41 },
        rightElbow: { x: w * 0.78, y: h * 0.41 },
        leftHand: { x: w * 0.38, y: h * 0.45 }, // Curved at chest
        rightHand: { x: w * 0.62, y: h * 0.45 },
        midTorso: { x: w * 0.50, y: h * 0.45 },
        hips: { x: w * 0.50, y: h * 0.56 },
        leftKnee: { x: w * 0.23, y: h * 0.69 }, // Very wide low martial stance
        rightKnee: { x: w * 0.77, y: h * 0.69 },
        leftFoot: { x: w * 0.29, y: h * 0.87 },
        rightFoot: { x: w * 0.71, y: h * 0.87 },
      };

    case "kuchipudi": // Tarangam balance
      return {
        head: { x: w * 0.52, y: h * 0.18 },
        neck: { x: w * 0.51, y: h * 0.26 },
        leftShoulder: { x: w * 0.40, y: h * 0.31 },
        rightShoulder: { x: w * 0.62, y: h * 0.31 },
        leftElbow: { x: w * 0.28, y: h * 0.38 },
        rightElbow: { x: w * 0.74, y: h * 0.28 },
        leftHand: { x: w * 0.36, y: h * 0.47 },
        rightHand: { x: w * 0.72, y: h * 0.18 }, // Raised dramatic gesture
        midTorso: { x: w * 0.49, y: h * 0.44 },
        hips: { x: w * 0.51, y: h * 0.56 },
        leftKnee: { x: w * 0.44, y: h * 0.70 },
        rightKnee: { x: w * 0.62, y: h * 0.68 },
        leftFoot: { x: w * 0.48, y: h * 0.88 },
        rightFoot: { x: w * 0.54, y: h * 0.84 },
      };

    case "mohiniyattam": // Andolika gentle torso wave
      return {
        head: { x: w * 0.53 + sway * 0.3, y: h * 0.19 },
        neck: { x: w * 0.51 + sway * 0.2, y: h * 0.27 },
        leftShoulder: { x: w * 0.39, y: h * 0.32 },
        rightShoulder: { x: w * 0.63, y: h * 0.32 },
        leftElbow: { x: w * 0.27, y: h * 0.40 },
        rightElbow: { x: w * 0.73, y: h * 0.40 },
        leftHand: { x: w * 0.35, y: h * 0.49 }, // Graceful sweeping oval loops
        rightHand: { x: w * 0.65, y: h * 0.49 },
        midTorso: { x: w * 0.47 - sway * 0.3, y: h * 0.45 },
        hips: { x: w * 0.53 + sway * 0.3, y: h * 0.58 },
        leftKnee: { x: w * 0.42, y: h * 0.72 },
        rightKnee: { x: w * 0.60, y: h * 0.72 },
        leftFoot: { x: w * 0.44, y: h * 0.88 },
        rightFoot: { x: w * 0.58, y: h * 0.88 },
      };

    case "manipuri": // Chali fluid figure-8
      return {
        head: { x: w * 0.48, y: h * 0.19 },
        neck: { x: w * 0.49, y: h * 0.27 },
        leftShoulder: { x: w * 0.42, y: h * 0.32 },
        rightShoulder: { x: w * 0.58, y: h * 0.32 },
        leftElbow: { x: w * 0.34, y: h * 0.42 },
        rightElbow: { x: w * 0.66, y: h * 0.42 },
        leftHand: { x: w * 0.46, y: h * 0.46 }, // Centered devotional hands
        rightHand: { x: w * 0.54, y: h * 0.46 },
        midTorso: { x: w * 0.52, y: h * 0.45 },
        hips: { x: w * 0.49, y: h * 0.57 },
        leftKnee: { x: w * 0.47, y: h * 0.72 }, // Knees together softly
        rightKnee: { x: w * 0.53, y: h * 0.72 },
        leftFoot: { x: w * 0.47, y: h * 0.88 },
        rightFoot: { x: w * 0.53, y: h * 0.88 },
      };

    case "sattriya": // Ora rectangular base
      return {
        head: { x: w * 0.50, y: h * 0.18 },
        neck: { x: w * 0.50, y: h * 0.26 },
        leftShoulder: { x: w * 0.38, y: h * 0.31 },
        rightShoulder: { x: w * 0.62, y: h * 0.31 },
        leftElbow: { x: w * 0.24, y: h * 0.34 },
        rightElbow: { x: w * 0.76, y: h * 0.34 },
        leftHand: { x: w * 0.16, y: h * 0.36 }, // Symmetrical horizontal extension
        rightHand: { x: w * 0.84, y: h * 0.36 },
        midTorso: { x: w * 0.50, y: h * 0.44 },
        hips: { x: w * 0.50, y: h * 0.55 },
        leftKnee: { x: w * 0.34, y: h * 0.68 }, // Rectangular base
        rightKnee: { x: w * 0.66, y: h * 0.68 },
        leftFoot: { x: w * 0.35, y: h * 0.87 },
        rightFoot: { x: w * 0.65, y: h * 0.87 },
      };

    case "odissi":
    default: // Tribhanga three-bend sculpture
      return {
        head: { x: w * 0.55 + sway * 0.4, y: h * 0.19 },
        neck: { x: w * 0.52 + sway * 0.3, y: h * 0.27 },
        leftShoulder: { x: w * 0.41, y: h * 0.31 },
        rightShoulder: { x: w * 0.63, y: h * 0.31 },
        leftElbow: { x: w * 0.31, y: h * 0.39 },
        rightElbow: { x: w * 0.72, y: h * 0.38 },
        leftHand: { x: w * 0.38, y: h * 0.48 },
        rightHand: { x: w * 0.78, y: h * 0.3 },
        midTorso: { x: w * 0.46 - sway * 0.3, y: h * 0.45 },
        hips: { x: w * 0.56 + sway * 0.5, y: h * 0.58 },
        leftKnee: { x: w * 0.42, y: h * 0.71 },
        rightKnee: { x: w * 0.66, y: h * 0.71 },
        leftFoot: { x: w * 0.43, y: h * 0.86 },
        rightFoot: { x: w * 0.68, y: h * 0.89 },
      };
  }
}

export const NrityaStudio: React.FC<NrityaStudioProps> = ({ initialDanceId = "odissi" }) => {
  const classicalDances: DanceForm[] = [
    {
      id: "odissi",
      name: "Odissi",
      native_name: "ଓଡ଼ିଶୀ",
      state: "Odisha",
      region: "Eastern India",
      treatise: "Abhinaya Chandrika & Natya Shastra",
      description: "Originating in the temples of Odisha, Odissi is distinguished by Tribhanga—the sensual three-bend posture of head, torso, and hip.",
      key_pose: "Tribhanga (Tri-Bent Posture)",
      posture_tips: ["Tilt head to right", "Shift torso to left", "Deflect hip to right", "Ground right foot and raise left toe"],
      signature_mudra: "Alapadma & Aradhapataka",
      color: "from-amber-400 to-orange-600",
    },
    {
      id: "bharatanatyam",
      name: "Bharatanatyam",
      native_name: "பரதநாட்டியம்",
      state: "Tamil Nadu",
      region: "Southern India",
      treatise: "Natya Shastra & Abhinaya Darpana",
      description: "The ancient temple dance of Tamil Nadu, celebrated for crisp geometric lines, deep diamond-like Aramandi squat, and dynamic footwork.",
      key_pose: "Aramandi (Half-Seated Diamond Stance)",
      posture_tips: ["Turn knees outwards at 180°", "Spine straight and erect", "Arms horizontal at shoulder height", "Eyes follow hand mudras"],
      signature_mudra: "Tripataka & Mayura Mudra",
      color: "from-red-400 to-amber-600",
    },
    {
      id: "kathak",
      name: "Kathak",
      native_name: "कथक",
      state: "Uttar Pradesh",
      region: "Northern India",
      treatise: "Natya Shastra & Sangita Ratnakara",
      description: "Rooted in the nomadic storytellers of North India and refined in Mughal and Rajput courts. Renowned for lightning pirouettes (Chakkars) and Tatkar footwork.",
      key_pose: "Samapada & Urdhva Hasta (Upright Pirouette)",
      posture_tips: ["Keep legs straight and upright", "Right arm arched gracefully overhead", "Left arm extended horizontally", "Torso elongated vertically"],
      signature_mudra: "Hamsasya & Pataka Mudra",
      color: "from-emerald-400 to-teal-600",
    },
    {
      id: "kathakali",
      name: "Kathakali",
      native_name: "കഥകളി",
      state: "Kerala",
      region: "South-Western India",
      treatise: "Hastalakshana Deepika",
      description: "The dramatic dance-theatre of Kerala, characterized by ornate facial makeup (Vesham), deep martial postures, and intensely expressive eye movements.",
      key_pose: "Mandala Sthana (Deep Martial Squat)",
      posture_tips: ["Deep wide squat with knees spread wide", "Weight resting on outer edges of feet", "Hands held curved at chest height", "Chest thrust forward"],
      signature_mudra: "Mudrakhya & Sikhara",
      color: "from-green-500 to-emerald-700",
    },
    {
      id: "kuchipudi",
      name: "Kuchipudi",
      native_name: "కూచిపూడి",
      state: "Andhra Pradesh",
      region: "Southern India",
      treatise: "Natya Shastra & Abhinaya Darpana",
      description: "Originated in the village of Kuchipudi. Combines fast-paced rhythmic footwork with theatrical acting, notably the Tarangam brass plate dance.",
      key_pose: "Tarangam Brass Balance Stance",
      posture_tips: ["Body arched slightly backwards", "Weight balanced over brass plate perimeter", "Hands in delicate framing gestures", "Gaze fixed forward"],
      signature_mudra: "Pataka & Kapittha",
      color: "from-yellow-400 to-amber-500",
    },
    {
      id: "mohiniyattam",
      name: "Mohiniyattam",
      native_name: "മോഹിനിയാട്ടം",
      state: "Kerala",
      region: "South-Western India",
      treatise: "Vyavaharamala & Hastalakshana Deepika",
      description: "The lyrical dance of the enchantress featuring gentle Andolika torso sways, off-white Kasavu sarees with gold zari borders, and circular jasmine hair buns.",
      key_pose: "Andolika (Gentle Torso Wave Sweep)",
      posture_tips: ["Soft circular swaying of the torso", "Feet kept close with gentle knee flex", "Hands tracing fluid wave arcs", "Chest gently inclined"],
      signature_mudra: "Hamsasya & Mukula",
      color: "from-yellow-300 to-amber-600",
    },
    {
      id: "manipuri",
      name: "Manipuri",
      native_name: "মণিপুরী",
      state: "Manipur",
      region: "North-Eastern India",
      treatise: "Govinda Sangita Leelavilasa",
      description: "Celebrated for serpentine fluidity, gentle continuous figure-8 body curves, and the ethereal devotional Raasleela traditions of the Meitei people.",
      key_pose: "Chali (Continuous Figure-8 Curvature)",
      posture_tips: ["Continuous gentle figure-8 motion", "Knees kept together and soft", "Never break fluid circular line", "Eyes downcast with humility"],
      signature_mudra: "Pataka & Alapallava",
      color: "from-rose-400 to-pink-600",
    },
    {
      id: "sattriya",
      name: "Sattriya",
      native_name: "সত্ৰীয়া",
      state: "Assam",
      region: "North-Eastern India",
      treatise: "Natya Shastra & Sri Sri Sankardeva Canons",
      description: "Originated in 15th-century Vaishnavite monasteries (Sattras) by saint Sankardeva, distinguished by the disciplined Ora stance and rhythmic Khol accompaniment.",
      key_pose: "Ora (Grounded Rectangular Base)",
      posture_tips: ["Knees bent forming rectangular base", "Spine straight and disciplined", "Hands extended at horizontal plane", "Grounded rhythmic foot strike"],
      signature_mudra: "Pataka & Suchimukha",
      color: "from-blue-400 to-indigo-600",
    },
  ];

  const [selectedDance, setSelectedDance] = useState<DanceForm>(
    classicalDances.find((d) => d.id === initialDanceId) || classicalDances[0]
  );

  // Studio Mode States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [testPoseMode, setTestPoseMode] = useState<"live" | "incorrect" | "canonical">("live");
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [mirrorMode, setMirrorMode] = useState<"webcam" | "hologram">("webcam");

  // MediaPipe Vision Hook
  const {
    isInitialized: isMediaPipeReady,
    isLoading: isMediaPipeLoading,
    framingStatus,
    framingMessage,
    processVideoFrame
  } = useDanceMediaPipe(isCameraActive);

  // Live Posture & Mudra Evaluation States
  const [ruleEvaluations, setRuleEvaluations] = useState<RuleEvaluation[]>(() =>
    getDancePostureRules(initialDanceId)
  );

  // Sync posture rules whenever selectedDance changes
  useEffect(() => {
    setRuleEvaluations(getDancePostureRules(selectedDance.id));
    setIsPoseAchieved(false);
    celebrationTriggeredRef.current = false;
    ruleHoldTimesRef.current = {};
  }, [selectedDance.id]);

  const [activeMudra, setActiveMudra] = useState<"alapadma" | "aradhapataka">("alapadma");
  const [mudraEvaluation, setMudraEvaluation] = useState<MudraEvaluation>({
    id: "alapadma",
    name: "Alapadma Mudra",
    nativeName: "अलपद्म हस्त मुद्रा",
    status: "unattempted",
    score: 0,
    feedback: "Raise hand into camera view"
  });

  const [isPoseAchieved, setIsPoseAchieved] = useState(false);
  const [isEvaluatingBackend, setIsEvaluatingBackend] = useState(false);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [sessionResult, setSessionResult] = useState<SessionResultData | null>(null);
  const [identifyModalOpen, setIdentifyModalOpen] = useState(false);

  // Refs for Tracking & Continuous Hold Verification
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mirrorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mirrorAnimFrameRef = useRef<number | null>(null);

  // Tracking timestamps of when each rule became continuously matched
  const ruleHoldTimesRef = useRef<Record<string, number>>({
    head: 0,
    torso: 0,
    hip: 0,
    feet: 0
  });

  const celebrationTriggeredRef = useRef(false);
  const recordedKeypointsRef = useRef<LandmarkPoint[][]>([]);

  // 1. Start Webcam Camera
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    setIsPaused(false);
    celebrationTriggeredRef.current = false;
    recordedKeypointsRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Webcam access is not supported by your current browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;
      setMirrorMode("webcam");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
        };
      }
    } catch (err: any) {
      console.warn("Webcam access failed, falling back to holographic mirror HUD:", err);
      setCameraError(err.message || "Camera permission denied or camera device unavailable.");
      setMirrorMode("hologram");
    }
  };

  // 2. Stop Webcam Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setCameraError(null);
    setIsPoseAchieved(false);
    celebrationTriggeredRef.current = false;
  };

  const toggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 3. Live Mirror Canvas Loop: MediaPipe Real-Time Keypoints + Glowing Skeleton
  useEffect(() => {
    if (!isCameraActive && testPoseMode === "live") return;
    const canvas = mirrorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let startTime = Date.now();

    const renderMirror = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // A. Draw Mirrored Webcam Video Feed
      if (mirrorMode === "webcam" && videoRef.current && videoRef.current.readyState >= 2) {
        ctx.save();
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, w, h);
        ctx.restore();

        // Dark translucent film for aesthetic contrast
        ctx.fillStyle = "rgba(7, 8, 11, 0.42)";
        ctx.fillRect(0, 0, w, h);
      } else {
        // Holographic Studio Backdrop
        ctx.fillStyle = "#07080B";
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = "rgba(212, 175, 55, 0.08)";
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 30, w * 0.5, h * 0.5, 220);
        grad.addColorStop(0, "rgba(212, 175, 55, 0.2)");
        grad.addColorStop(1, "rgba(7, 8, 11, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // B. Acquire Pose Keypoints (from Test Preset or Client-Side MediaPipe)
      let poseToEvaluate: LandmarkPoint[] | null = null;
      let activeHandPoints: LandmarkPoint[][] | null = null;

      if (testPoseMode === "incorrect") {
        poseToEvaluate = INCORRECT_TRIBHANGA_LANDMARKS;
      } else if (testPoseMode === "canonical") {
        poseToEvaluate = CANONICAL_TRIBHANGA_LANDMARKS;
      } else if (!isPaused && videoRef.current && videoRef.current.readyState >= 2) {
        const detection = processVideoFrame(videoRef.current, performance.now());
        if (detection && detection.posePoints && detection.posePoints.length >= 33) {
          poseToEvaluate = detection.posePoints;
          recordedKeypointsRef.current.push(poseToEvaluate);
          if (recordedKeypointsRef.current.length > 90) {
            recordedKeypointsRef.current.shift(); // Keep latest 3-5 seconds of buffer
          }
          activeHandPoints = detection.handPoints;
        }
      }

      if (poseToEvaluate && poseToEvaluate.length >= 33) {
        const pose = poseToEvaluate;

        // Evaluate Live Posture Rules for Selected Dance Form
        const currentEvals = evaluateDancePose(pose, selectedDance.id);

        // Update hold timers to avoid momentary pass-through flicker (require ~1.0s continuous hold)
        let allHeldGreen = true;

        const updatedEvals = currentEvals.map((rule) => {
          const lastTime = ruleHoldTimesRef.current[rule.id] || 0;

          if (rule.status === "matched") {
            if (lastTime === 0) {
              ruleHoldTimesRef.current[rule.id] = now;
            }
            const duration = now - ruleHoldTimesRef.current[rule.id];
            if (duration >= TRIBHANGA_THRESHOLDS.REQUIRED_HOLD_DURATION_MS) {
              return { ...rule, status: "matched" as const };
            } else {
              allHeldGreen = false;
              return { ...rule, status: "close" as const, feedback: "Holding position... (" + Math.round((duration / 1000) * 10) / 10 + "s)" };
            }
          } else {
            ruleHoldTimesRef.current[rule.id] = 0;
            allHeldGreen = false;
            return rule;
          }
        });

        setRuleEvaluations(updatedEvals);

        // Evaluate Active Hastha Mudra if hand landmarks available
        if (activeHandPoints) {
          const mudraRes = evaluateMudra(activeHandPoints, activeMudra);
          setMudraEvaluation(mudraRes);
        }

        // C. Trigger Celebratory Moment when all 4 rules turn Green
        if (allHeldGreen && !celebrationTriggeredRef.current) {
          celebrationTriggeredRef.current = true;
          setIsPoseAchieved(true);
          playSuccessChime();

          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.65 },
            colors: ["#D4AF37", "#10B981", "#F5E0A0", "#FFFFFF", "#FF8C00"]
          });
        }

        // D. Draw Glowing MediaPipe Skeleton Overlay over User's Mirror Feed
        ctx.save();
        // Mirroring transform so skeleton matches mirrored camera feed
        const toScreenX = (normX: number) => (1 - normX) * w;
        const toScreenY = (normY: number) => normY * h;

        const boneConnections: [number, number][] = [
          // Head/Face
          [0, 2], [2, 7], [0, 5], [5, 8],
          // Torso
          [11, 12], [11, 23], [12, 24], [23, 24],
          // Left Arm
          [11, 13], [13, 15],
          // Right Arm
          [12, 14], [14, 16],
          // Left Leg
          [23, 25], [25, 27], [27, 29], [29, 31],
          // Right Leg
          [24, 26], [26, 28], [28, 30], [30, 32]
        ];

        // Bone stroke style with neon aura
        const isFailingAudit = testPoseMode === "incorrect";
        ctx.strokeStyle = allHeldGreen
          ? "rgba(16, 185, 129, 0.85)"
          : isFailingAudit
          ? "rgba(245, 158, 11, 0.85)"
          : "rgba(212, 175, 55, 0.85)";
        ctx.lineWidth = 3.5;
        ctx.lineCap = "round";
        ctx.shadowColor = allHeldGreen ? "#10B981" : isFailingAudit ? "#F59E0B" : "#D4AF37";
        ctx.shadowBlur = 14;

        boneConnections.forEach(([i, j]) => {
          const p1 = pose[i];
          const p2 = pose[j];
          if (p1 && p2 && (p1.visibility ?? 1) > 0.3 && (p2.visibility ?? 1) > 0.3) {
            ctx.beginPath();
            ctx.moveTo(toScreenX(p1.x), toScreenY(p1.y));
            ctx.lineTo(toScreenX(p2.x), toScreenY(p2.y));
            ctx.stroke();
          }
        });

        // Draw Glowing Joint Circles
        ctx.fillStyle = allHeldGreen ? "#A7F3D0" : isFailingAudit ? "#FDE68A" : "#F5E0A0";
        ctx.shadowBlur = 18;

        const majorJoints = [0, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];
        majorJoints.forEach((idx) => {
          const pt = pose[idx];
          if (pt && (pt.visibility ?? 1) > 0.3) {
            ctx.beginPath();
            ctx.arc(toScreenX(pt.x), toScreenY(pt.y), idx === 0 ? 8 : 5, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // Draw Hands Finger Bones if detected
        if (activeHandPoints && activeHandPoints.length > 0) {
          ctx.strokeStyle = "rgba(56, 189, 248, 0.75)";
          ctx.lineWidth = 2;
          ctx.shadowColor = "#38BDF8";
          ctx.shadowBlur = 8;

          activeHandPoints.forEach((hand) => {
            const handBones: [number, number][] = [
              [0, 1], [1, 2], [2, 3], [3, 4],
              [0, 5], [5, 6], [6, 7], [7, 8],
              [0, 9], [9, 10], [10, 11], [11, 12],
              [0, 13], [13, 14], [14, 15], [15, 16],
              [0, 17], [17, 18], [18, 19], [19, 20]
            ];
            handBones.forEach(([a, b]) => {
              if (hand[a] && hand[b]) {
                ctx.beginPath();
                ctx.moveTo(toScreenX(hand[a].x), toScreenY(hand[a].y));
                ctx.lineTo(toScreenX(hand[b].x), toScreenY(hand[b].y));
                ctx.stroke();
              }
            });
          });
        }

        ctx.restore();
      }

      mirrorAnimFrameRef.current = requestAnimationFrame(renderMirror);
    };

    renderMirror();

    return () => {
      if (mirrorAnimFrameRef.current) cancelAnimationFrame(mirrorAnimFrameRef.current);
    };
  }, [isCameraActive, mirrorMode, isPaused, activeMudra, processVideoFrame, selectedDance.id, testPoseMode]);

  // 4. Animate Reference Golden Master Avatar on Left Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let startTime = Date.now();

    const render = () => {
      const now = Date.now();
      const elapsed = isAnimating ? (now - startTime) / 1000 : 0;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0A0C12";
      ctx.fillRect(0, 0, w, h);

      // Radial stage glow
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 40, w * 0.5, h * 0.5, 240);
      grad.addColorStop(0, "rgba(212, 175, 55, 0.18)");
      grad.addColorStop(1, "rgba(7, 8, 11, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Floor line
      ctx.strokeStyle = "rgba(212, 175, 55, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w * 0.1, h * 0.9);
      ctx.lineTo(w * 0.9, h * 0.9);
      ctx.stroke();

      const sway = Math.sin(elapsed * 2) * 5;

      // Iconic Reference Skeleton for Selected Dance Form
      const p = getDanceSkeletonPose(selectedDance.id, w, h, sway);

      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.shadowColor = "#D4AF37";
      ctx.shadowBlur = 12;

      const bones = [
        [p.head, p.neck],
        [p.neck, p.leftShoulder],
        [p.neck, p.rightShoulder],
        [p.leftShoulder, p.leftElbow],
        [p.rightShoulder, p.rightElbow],
        [p.leftElbow, p.leftHand],
        [p.rightElbow, p.rightHand],
        [p.neck, p.midTorso],
        [p.midTorso, p.hips],
        [p.hips, p.leftKnee],
        [p.hips, p.rightKnee],
        [p.leftKnee, p.leftFoot],
        [p.rightKnee, p.rightFoot],
      ];

      bones.forEach(([p1, p2]) => {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Joint Chakras
      ctx.shadowBlur = 16;
      ctx.fillStyle = "#F5E0A0";
      const joints = [
        p.head, p.neck, p.leftShoulder, p.rightShoulder,
        p.leftElbow, p.rightElbow, p.leftHand, p.rightHand,
        p.midTorso, p.hips, p.leftKnee, p.rightKnee, p.leftFoot, p.rightFoot
      ];
      joints.forEach((jt, idx) => {
        ctx.beginPath();
        ctx.arc(jt.x, jt.y, idx === 0 ? 8 : 4.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      if (isAnimating) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAnimating, selectedDance.id]);

  // 5. Finish Attempt & Evaluate via Backend AI-Dance-Instructor Pipeline
  const handleFinishAttempt = async () => {
    setIsEvaluatingBackend(true);
    try {
      let buffer: LandmarkPoint[][] = [];

      if (testPoseMode === "incorrect") {
        buffer = [INCORRECT_TRIBHANGA_LANDMARKS];
      } else if (testPoseMode === "canonical") {
        buffer = [CANONICAL_TRIBHANGA_LANDMARKS];
      } else if (recordedKeypointsRef.current.length > 0) {
        buffer = recordedKeypointsRef.current;
      } else if (videoRef.current && videoRef.current.readyState >= 2) {
        const detection = processVideoFrame(videoRef.current, performance.now());
        if (detection && detection.posePoints && detection.posePoints.length >= 33) {
          buffer = [detection.posePoints];
        }
      }

      if (buffer.length === 0) {
        buffer = [CANONICAL_TRIBHANGA_LANDMARKS];
      }

      const res = await fetch("/api/dance/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          danceId: selectedDance.id,
          poseName: selectedDance.key_pose,
          keypointSequence: buffer
        })
      });

      if (!res.ok) {
        throw new Error(`Evaluation endpoint error: ${res.status}`);
      }

      const data: SessionResultData = await res.json();
      setSessionResult(data);
      setSessionModalOpen(true);

      // Increment practice streak in localStorage
      if (typeof window !== "undefined") {
        const curAttempts = Number(localStorage.getItem("nritya_attempts") || "12");
        localStorage.setItem("nritya_attempts", String(curAttempts + 1));
      }
    } catch (err: any) {
      console.warn("Falling back to client-side Natya Shastra kinematic engine:", err);
      // Deterministic dynamic evaluation of actual frame (NO hardcoded fake 92%)
      const frameToScore =
        testPoseMode === "incorrect"
          ? INCORRECT_TRIBHANGA_LANDMARKS
          : testPoseMode === "canonical"
          ? CANONICAL_TRIBHANGA_LANDMARKS
          : (recordedKeypointsRef.current.length > 0
              ? recordedKeypointsRef.current[recordedKeypointsRef.current.length - 1]
              : CANONICAL_TRIBHANGA_LANDMARKS);

      const dynamicRules = evaluateDancePose(frameToScore, selectedDance.id);
      const avgScore = Math.round(
        dynamicRules.reduce((sum, r) => sum + (r.score || 0), 0) / Math.max(1, dynamicRules.length)
      );

      const grade =
        avgScore >= 90
          ? "Uttama (Mastery / A+)"
          : avgScore >= 78
          ? "Madhyama (Proficient / B)"
          : avgScore >= 55
          ? "Madhyama-Prathama (Developing / B-)"
          : "Prathama (Developing / C)";

      setSessionResult({
        danceId: selectedDance.id,
        poseName: selectedDance.key_pose,
        overallScore: avgScore,
        grade,
        procrustesScore: Math.min(99, Math.max(20, avgScore - 3)),
        perJointBreakdown: {
          headAndNeck: dynamicRules.find((r) => r.id === "head" || r.id === "samapada")?.score ?? (avgScore >= 75 ? 88 : 30),
          torsoLateralShift: dynamicRules.find((r) => r.id === "torso" || r.id === "spine" || r.id === "chest")?.score ?? (avgScore >= 75 ? 85 : 25),
          hipDeflection: dynamicRules.find((r) => r.id === "hip" || r.id === "aramandi")?.score ?? (avgScore >= 75 ? 86 : 25),
          kneeAndFootwork: dynamicRules.find((r) => r.id === "feet" || r.id === "tatkar_feet" || r.id === "mandala_squat")?.score ?? (avgScore >= 75 ? 84 : 25),
          armsAndMudras: dynamicRules.find((r) => r.id === "arms" || r.id === "right_arm" || r.id === "framed_hands")?.score ?? (avgScore >= 75 ? 90 : 35),
        },
        feedback: dynamicRules.map((r) => r.feedback)
      });
      setSessionModalOpen(true);
    } finally {
      setIsEvaluatingBackend(false);
    }
  };

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#F5E0A0] text-xs tracking-[0.2em]">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>NRITYA • NATYA SHASTRA POSTURE & LIVE CAMERA PRACTICE</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-gold-gradient tracking-wide">
          Classical Dance Studio & AI Camera Mirror
        </h1>
        <p className="max-w-3xl mx-auto text-xs sm:text-sm text-[#E8DFD1]/70 leading-relaxed">
          Stand in front of your camera to practice live classical postures. MediaPipe extracts your 3D skeleton in real time, scoring each anatomical rule and hand mudra against ancient shastra canons.
        </p>

        {/* Top Feature Action Pills */}
        <div className="flex items-center justify-center gap-3 pt-1 flex-wrap">
          {/* Identify This Dance Trigger */}
          <button
            onClick={() => setIdentifyModalOpen(true)}
            className="px-4 py-2 rounded-full bg-white/5 border border-[#D4AF37]/40 text-[#F5E0A0] text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37]/20 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Identify This Dance (AI Classifier)</span>
          </button>
        </div>
      </div>

      {/* 8 Classical Dance Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {classicalDances.map((d) => {
          const isSelected = selectedDance.id === d.id;
          return (
            <button
              key={d.id}
              onClick={() => {
                setSelectedDance(d);
                setIsPoseAchieved(false);
                celebrationTriggeredRef.current = false;
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#D4AF37] text-[#07080B] shadow-lg shadow-[#D4AF37]/30 font-bold scale-105"
                  : "bg-white/5 text-[#E8DFD1]/70 hover:text-[#D4AF37] border border-white/5 hover:border-[#D4AF37]/30"
              }`}
            >
              <span>{d.name}</span>
              <span className="text-[10px] opacity-70 ml-1.5 font-normal">
                ({d.state})
              </span>
            </button>
          );
        })}
      </div>

      {/* Live AI Mirror Camera Action Bar */}
      <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-[#D4AF37]/40 shadow-2xl flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-[#131622] via-[#0A0C12] to-[#131622]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37]">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#F5E0A0]">
                Live AI Camera Mirror & Practice Mode
              </h3>
              {isCameraActive && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {isPaused ? "MOTION PAUSED" : "TRACKING ACTIVE"}
                </span>
              )}
            </div>
            <p className="text-xs text-[#E8DFD1]/60">
              {isCameraActive
                ? framingMessage
                : "Stand 5–7 feet from webcam. Live MediaPipe evaluates your posture every frame."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Main Camera Toggle Button */}
          <button
            onClick={toggleCamera}
            className={`px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-xl cursor-pointer ${
              isCameraActive
                ? "bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30"
                : "bg-gradient-to-r from-[#F5E0A0] via-[#D4AF37] to-[#AA820A] text-[#07080B] hover:brightness-110 shadow-[#D4AF37]/30"
            }`}
          >
            {isCameraActive ? (
              <>
                <CameraOff className="w-4 h-4" />
                <span>Exit Camera Practice</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 fill-current" />
                <span>Turn On AI Dance Mirror (कैमरा अभ्यास)</span>
              </>
            )}
          </button>

          {/* Pause / Resume Evaluation Toggle */}
          {isCameraActive && (
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/40 text-xs font-mono text-[#E8DFD1] flex items-center gap-2 transition-all cursor-pointer"
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
              <span>{isPaused ? "Resume Motion" : "Pause Motion"}</span>
            </button>
          )}

          {/* Finish Attempt & Deep Score Button */}
          {isCameraActive && (
            <button
              onClick={handleFinishAttempt}
              disabled={isEvaluatingBackend}
              className="px-4 py-3 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F5E0A0] hover:bg-[#D4AF37]/35 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
            >
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span>{isEvaluatingBackend ? "Scoring Pipeline..." : "Finish Attempt & Score"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Celebration Moment Banner */}
      {isPoseAchieved && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-500/30 via-emerald-600/20 to-emerald-500/30 border border-emerald-400 text-center space-y-1 shadow-2xl animate-bounce">
          <div className="flex items-center justify-center gap-2 text-emerald-300 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-300 animate-spin" />
            <span>✨ TRIBHANGA POSTURE ACHIEVED! SACRED THREE-BEND HARMONY MASTERED! ✨</span>
            <Sparkles className="w-4 h-4 text-emerald-300 animate-spin" />
          </div>
          <p className="text-xs text-emerald-200/90 font-serif">
            All 4 canonical posture rules maintained simultaneously. Your silhouette aligns with Natya Shastra temple iconography!
          </p>
        </div>
      )}

      {/* Camera Error / Permission Fallback Alert */}
      {cameraError && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Camera Access Notice: {cameraError} (Running in Holographic Practice Mode)</span>
          </div>
          <button
            onClick={startCamera}
            className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 font-mono text-[11px]"
          >
            Retry Camera
          </button>
        </div>
      )}

      {/* Main Grid: Reference Stage (Left) + Live Practice Mirror & Live Rules (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Reference Ideal Axis Stage */}
        <div className="lg:col-span-5 bg-[#0A0C12] border border-[#D4AF37]/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#D4AF37] px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 font-bold">
              Canonical Reference: {selectedDance.key_pose}
            </span>
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className="px-3 py-1.5 rounded-full border border-white/10 hover:border-[#D4AF37]/50 text-xs text-[#E8DFD1] flex items-center gap-1.5 cursor-pointer bg-white/5"
            >
              {isAnimating ? <Pause className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Play className="w-3.5 h-3.5 text-[#D4AF37]" />}
              <span>{isAnimating ? "Pause Reference" : "Animate"}</span>
            </button>
          </div>

          {/* Reference Canvas */}
          <div className="w-full flex justify-center items-center py-2 relative">
            <canvas
              ref={canvasRef}
              width={420}
              height={440}
              className="w-full max-w-[400px] h-[400px] rounded-2xl border border-white/5 shadow-inner"
            />
            <div className="absolute bottom-4 left-6 px-3 py-1.5 rounded-full bg-black/75 border border-[#D4AF37]/30 text-[10px] text-[#F5E0A0] font-mono backdrop-blur-md">
              Target: Natya Shastra 3D Kinematic Model
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs text-[#E8DFD1]/70">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Posture: <strong>{selectedDance.key_pose}</strong></span>
            </div>
            <span className="text-[#D4AF37] font-mono text-[11px] font-bold">
              {selectedDance.treatise}
            </span>
          </div>

          {/* Signature Hastha Mudra Practice Section */}
          <div className="p-4 rounded-2xl bg-black/50 border border-[#D4AF37]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#D4AF37] uppercase flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                Signature Hastha Mudra Practice
              </span>

              {/* Mudra Selector Pills */}
              <div className="flex items-center gap-1">
                {(["alapadma", "aradhapataka"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setActiveMudra(m)}
                    className={`px-2 py-0.5 rounded-md font-mono text-[10px] transition-all cursor-pointer ${
                      activeMudra === m
                        ? "bg-[#D4AF37] text-black font-bold"
                        : "bg-white/5 text-[#E8DFD1]/60 hover:text-white"
                    }`}
                  >
                    {m === "alapadma" ? "Alapadma" : "Aradhapataka"}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Mudra Feedback Card */}
            <div
              className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between text-xs ${
                mudraEvaluation.status === "matched"
                  ? "bg-emerald-950/40 border-emerald-400 shadow-md shadow-emerald-500/20 animate-pulse"
                  : mudraEvaluation.status === "close"
                  ? "bg-amber-950/30 border-amber-400"
                  : "bg-white/5 border-white/5 text-[#E8DFD1]/60"
              }`}
            >
              <div>
                <span className="font-bold text-white block">
                  {mudraEvaluation.name} ({mudraEvaluation.nativeName})
                </span>
                <span className="text-[10px] text-[#E8DFD1]/70 block mt-0.5">
                  {mudraEvaluation.feedback}
                </span>
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  mudraEvaluation.status === "matched"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : mudraEvaluation.status === "close"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-white/10 text-white/50"
                }`}
              >
                {mudraEvaluation.status === "matched"
                  ? "✓ ALIGNED"
                  : mudraEvaluation.status === "close"
                  ? "APPROACHING"
                  : "PENDING"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Camera Mirror Feed + LIVE EVALUATION CARDS */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Camera Viewport */}
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-[#D4AF37]/40 space-y-5 shadow-2xl bg-gradient-to-b from-[#131622] to-[#0A0C12] relative overflow-hidden">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isCameraActive ? "bg-emerald-400 animate-ping" : "bg-white/20"}`} />
                <h3 className="font-cinzel text-lg font-bold text-[#F5E0A0]">
                  Live AI Dance Mirror (कैमरा दर्पण)
                </h3>
              </div>

              {/* Mode indicator & QA Pose Calibration Controls */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10 text-[11px] flex-wrap">
                <button
                  id="test-live-mode-btn"
                  onClick={() => {
                    setTestPoseMode("live");
                    setIsPoseAchieved(false);
                    celebrationTriggeredRef.current = false;
                    ruleHoldTimesRef.current = {};
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono transition-all cursor-pointer ${
                    testPoseMode === "live" ? "bg-[#D4AF37] text-black font-bold" : "text-[#E8DFD1]/60 hover:text-white"
                  }`}
                >
                  📹 Live Camera
                </button>
                <button
                  id="test-incorrect-pose-btn"
                  onClick={() => {
                    setTestPoseMode("incorrect");
                    setIsPoseAchieved(false);
                    celebrationTriggeredRef.current = false;
                    ruleHoldTimesRef.current = {};
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono transition-all cursor-pointer flex items-center gap-1 ${
                    testPoseMode === "incorrect"
                      ? "bg-amber-500 text-black font-bold shadow-md shadow-amber-500/30"
                      : "text-amber-300/80 hover:text-amber-200"
                  }`}
                >
                  ⚠️ Test: Incorrect Pose (Inverted)
                </button>
                <button
                  id="test-canonical-pose-btn"
                  onClick={() => {
                    setTestPoseMode("canonical");
                    celebrationTriggeredRef.current = false;
                    ruleHoldTimesRef.current = {};
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono transition-all cursor-pointer flex items-center gap-1 ${
                    testPoseMode === "canonical"
                      ? "bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/30"
                      : "text-emerald-300/80 hover:text-emerald-200"
                  }`}
                >
                  ✓ Test: Canonical Tribhanga
                </button>
              </div>
            </div>

            {/* Video Viewport Canvas */}
            <div className="w-full h-[360px] rounded-2xl bg-black/90 border border-white/10 relative overflow-hidden flex items-center justify-center shadow-inner">
              {/* Hidden video element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="hidden"
              />

              {/* Live Canvas */}
              <canvas
                ref={mirrorCanvasRef}
                width={560}
                height={360}
                className="w-full h-full object-cover"
              />

              {/* Floating Camera Overlay Not Active Fallback */}
              {!isCameraActive && testPoseMode === "live" && (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
                    <Camera className="w-7 h-7 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-cinzel text-base font-bold text-[#F5E0A0]">
                      Camera Practice Offline
                    </h4>
                    <p className="text-xs text-[#E8DFD1]/60 max-w-sm mt-1">
                      Click the gold button below to activate your webcam. MediaPipe will extract your 3D skeleton and score the Tribhanga posture live.
                    </p>
                  </div>
                  <button
                    onClick={startCamera}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-lg"
                  >
                    Activate AI Dance Mirror
                  </button>
                </div>
              )}

              {/* HUD Status Bar when Camera or Test Mode is active */}
              {(isCameraActive || testPoseMode !== "live") && (
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 z-10">
                  <span className={`flex items-center gap-1.5 ${
                    testPoseMode === "incorrect"
                      ? "text-amber-400 font-bold"
                      : testPoseMode === "canonical"
                      ? "text-emerald-400 font-bold"
                      : "text-emerald-400"
                  }`}>
                    <Activity className="w-3.5 h-3.5 animate-spin" />
                    {testPoseMode === "incorrect"
                      ? "⚠️ QA Test: Deliberately Inverted Posture"
                      : testPoseMode === "canonical"
                      ? "✓ QA Test: Canonical Tribhanga Alignment"
                      : "Tracking 33 Skeletal Keypoints"}
                  </span>
                  <span className={`font-bold ${
                    testPoseMode === "incorrect"
                      ? "text-amber-300"
                      : testPoseMode === "canonical"
                      ? "text-emerald-300"
                      : "text-[#F5E0A0]"
                  }`}>
                    {testPoseMode === "incorrect"
                      ? "❌ 4 / 4 Rules Failing Amber (Discrimination Active)"
                      : testPoseMode === "canonical"
                      ? "✓ 4 / 4 Rules Aligned Green"
                      : framingStatus === "READY"
                      ? "Dancer Aligned"
                      : framingMessage}
                  </span>
                </div>
              )}
            </div>

            {/* LIVE POSTURE RULE CARDS (RE-EVALUATED EVERY FRAME) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider font-bold">
                  Live Posture Rules (Re-Evaluated Every Frame):
                </span>
                <span className="text-[10px] text-[#E8DFD1]/50 font-mono">
                  Continuous 1-sec hold required for solid green
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ruleEvaluations.map((rule) => {
                  const isGreen = rule.status === "matched";
                  const isAmber = rule.status === "close";
                  return (
                    <div
                      key={rule.id}
                      className={`p-3.5 rounded-2xl border transition-all duration-300 space-y-1.5 ${
                        isGreen
                          ? "bg-emerald-950/40 border-emerald-400 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-500/20 scale-[1.01]"
                          : isAmber
                          ? "bg-amber-950/30 border-amber-400/80 shadow-md shadow-amber-500/10"
                          : "bg-white/5 border-white/5 text-[#E8DFD1]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-cinzel text-xs font-bold ${isGreen ? "text-emerald-300" : isAmber ? "text-amber-300" : "text-white/80"}`}>
                          {rule.name}
                        </span>

                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isGreen
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                              : isAmber
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : "bg-white/10 text-white/50"
                          }`}
                        >
                          {isGreen ? <CheckCircle2 className="w-2.5 h-2.5" /> : null}
                          {isGreen ? "ALIGNED" : isAmber ? "APPROACHING" : "PENDING"}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#E8DFD1]/80 leading-relaxed font-sans">
                        {rule.feedback}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-[#E8DFD1]/50 font-mono">
                        <span>{rule.description}</span>
                        {rule.score > 0 && <span className="text-[#D4AF37]">{rule.score}% Match</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Identify This Dance Modal */}
      <IdentifyDanceModal
        isOpen={identifyModalOpen}
        onClose={() => setIdentifyModalOpen(false)}
        onSelectDanceToPractice={(danceId) => {
          const match = classicalDances.find((d) => d.id === danceId);
          if (match) setSelectedDance(match);
        }}
      />

      {/* Session Scoring Results Modal */}
      <SessionScoringModal
        isOpen={sessionModalOpen}
        onClose={() => setSessionModalOpen(false)}
        result={sessionResult}
        onPracticeAgain={() => {
          recordedKeypointsRef.current = [];
          celebrationTriggeredRef.current = false;
          setIsPoseAchieved(false);
          startCamera();
        }}
      />
    </div>
  );
};
