import { useEffect, useRef, useState, useCallback } from "react";
import { FilesetResolver, PoseLandmarker, HandLandmarker } from "@mediapipe/tasks-vision";
import { LandmarkPoint } from "./poseCalibration";

export interface DanceMediaPipeState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  poseLandmarks: LandmarkPoint[] | null;
  handLandmarks: LandmarkPoint[][] | null;
  framingStatus: "READY" | "STEP_BACK" | "CENTER_DANCER" | "NO_PERSON";
  framingMessage: string;
}

export function useDanceMediaPipe(active: boolean = false) {
  const [state, setState] = useState<DanceMediaPipeState>({
    isInitialized: false,
    isLoading: false,
    error: null,
    poseLandmarks: null,
    handLandmarks: null,
    framingStatus: "NO_PERSON",
    framingMessage: "Initializing MediaPipe Vision Tasks..."
  });

  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const isInitializingRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    async function initTasks() {
      if (!active || poseLandmarkerRef.current || isInitializingRef.current) return;
      isInitializingRef.current = true;
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        if (!mounted) return;

        // Initialize Pose Landmarker — try GPU first, fall back to CPU
        let poseLandmarker: PoseLandmarker;
        try {
          poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
              delegate: "GPU"
            },
            runningMode: "VIDEO",
            numPoses: 1
          });
        } catch (gpuErr) {
          console.warn("Pose GPU delegate failed, retrying with CPU:", gpuErr);
          poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
              delegate: "CPU"
            },
            runningMode: "VIDEO",
            numPoses: 1
          });
        }

        if (!mounted) { poseLandmarker.close(); return; }

        // Initialize Hand Landmarker — try GPU first, fall back to CPU (sequential to avoid WASM state conflicts)
        let handLandmarker: HandLandmarker;
        try {
          handLandmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
              delegate: "GPU"
            },
            runningMode: "VIDEO",
            numHands: 2
          });
        } catch (gpuErr) {
          console.warn("Hand GPU delegate failed, retrying with CPU:", gpuErr);
          handLandmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
              delegate: "CPU"
            },
            runningMode: "VIDEO",
            numHands: 2
          });
        }

        if (!mounted) {
          poseLandmarker?.close();
          handLandmarker?.close();
          return;
        }

        poseLandmarkerRef.current = poseLandmarker;
        handLandmarkerRef.current = handLandmarker;

        setState((prev) => ({
          ...prev,
          isInitialized: true,
          isLoading: false,
          framingMessage: "MediaPipe Vision initialized. Stand in camera frame."
        }));
      } catch (err: any) {
        console.error("MediaPipe initialization error:", err);
        if (mounted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: err.message || "Failed to load MediaPipe pose tracking tasks."
          }));
        }
      } finally {
        isInitializingRef.current = false;
      }
    }

    if (active) {
      initTasks();
    }

    return () => {
      mounted = false;
      poseLandmarkerRef.current?.close();
      handLandmarkerRef.current?.close();
      poseLandmarkerRef.current = null;
      handLandmarkerRef.current = null;
    };
  }, [active]);

  const processVideoFrame = useCallback(
    (videoElement: HTMLVideoElement, timestampMs: number) => {
      if (!poseLandmarkerRef.current || videoElement.readyState < 2) {
        return null;
      }

      try {
        const poseResult = poseLandmarkerRef.current.detectForVideo(videoElement, timestampMs);
        const handResult = handLandmarkerRef.current?.detectForVideo(videoElement, timestampMs);

        const hasPose = poseResult.landmarks && poseResult.landmarks.length > 0;
        const posePoints = hasPose ? (poseResult.landmarks[0] as LandmarkPoint[]) : null;
        const handPoints = handResult?.landmarks ? (handResult.landmarks as LandmarkPoint[][]) : null;

        let framingStatus: DanceMediaPipeState["framingStatus"] = "NO_PERSON";
        let framingMessage = "No dancer detected in camera view.";

        if (posePoints && posePoints.length >= 33) {
          const lShoulder = posePoints[11];
          const rShoulder = posePoints[12];
          const lAnkle = posePoints[27];
          const rAnkle = posePoints[28];

          const shouldersVisible = (lShoulder?.visibility ?? 1) > 0.35 && (rShoulder?.visibility ?? 1) > 0.35;
          const anklesVisible = (lAnkle?.visibility ?? 1) > 0.3 && (rAnkle?.visibility ?? 1) > 0.3;

          if (shouldersVisible && anklesVisible) {
            framingStatus = "READY";
            framingMessage = "Full body detected. Hold posture!";
          } else if (shouldersVisible && !anklesVisible) {
            framingStatus = "STEP_BACK";
            framingMessage = "Step back slightly so your feet and ankles are visible.";
          } else {
            framingStatus = "CENTER_DANCER";
            framingMessage = "Center your upper body in the mirror.";
          }
        }

        setState((prev) => ({
          ...prev,
          poseLandmarks: posePoints,
          handLandmarks: handPoints,
          framingStatus,
          framingMessage
        }));

        return {
          posePoints,
          handPoints,
          framingStatus,
          framingMessage
        };
      } catch (e) {
        // Frame dropped or timestamp non-monotonic
        return null;
      }
    },
    []
  );

  return {
    ...state,
    processVideoFrame
  };
}
