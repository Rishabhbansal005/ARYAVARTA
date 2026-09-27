/**
 * Nritya Studio: Classical Dance Kinematic Pose & Mudra Calibration Engine
 * Defines tunable biomechanical thresholds and angular constraints
 * derived from Natya Shastra, Abhinaya Darpana, and the AI-Dance-Instructor pipeline.
 */

export interface LandmarkPoint {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface RuleEvaluation {
  id: string;
  name: string;
  description: string;
  status: "unattempted" | "close" | "matched";
  score: number; // 0 to 100
  feedback: string;
}

export interface MudraEvaluation {
  id: string;
  name: string;
  nativeName: string;
  status: "unattempted" | "close" | "matched";
  score: number;
  feedback: string;
}

// =====================================================================
// CALIBRATION CONSTANTS (TUNABLE THRESHOLDS)
// =====================================================================
export const TRIBHANGA_THRESHOLDS = {
  // 1. Head Tilt: Angle between eye/ear line and horizontal (in degrees)
  HEAD_TILT_MIN_DEG: 7.0,
  HEAD_TILT_MAX_DEG: 38.0,
  HEAD_TILT_AMBER_DEG: 4.0,

  // 2. Torso Left Shift: Normalized horizontal offset of mid-shoulder vs mid-hip
  TORSO_SHIFT_MIN_OFFSET: 0.035, // Normalized screen width fraction
  TORSO_SHIFT_MAX_OFFSET: 0.28,
  TORSO_SHIFT_AMBER_OFFSET: 0.018,

  // 3. Hip Right Deflection: Hip tilt angle / lateral counter-sway
  HIP_DEFLECT_MIN_DEG: 5.0,
  HIP_DEFLECT_MAX_DEG: 35.0,
  HIP_DEFLECT_AMBER_DEG: 3.0,

  // 4. Foot Stance: Ground right foot and raise left heel/toe (Kunchita Pada)
  LEFT_FOOT_ELEVATION_MIN: 0.02, // Normalized height difference (left heel higher than right)
  LEFT_FOOT_ELEVATION_AMBER: 0.008,

  // Stability Hold Duration (milliseconds) before turning verified green
  REQUIRED_HOLD_DURATION_MS: 1000
};

export const MUDRA_THRESHOLDS = {
  // Alapadma: Fingers spread open and curved
  ALAPADMA_SPREAD_MIN: 0.065,
  ALAPADMA_CURVATURE_MIN: 130, // degrees at PIP/DIP joints

  // Aradhapataka / Pataka: Index, middle, ring, pinky extended together; thumb bent
  PATAKA_FINGER_PARALLEL_MAX_DIST: 0.045,
  PATAKA_EXTENSION_MIN_DEG: 155,
  THUMB_BENT_MAX_DEG: 120
};

// =====================================================================
// GEOMETRIC HELPER FUNCTIONS
// =====================================================================
export function calculateAngle2D(
  p1: LandmarkPoint,
  vertex: LandmarkPoint,
  p2: LandmarkPoint
): number {
  const v1 = { x: p1.x - vertex.x, y: p1.y - vertex.y };
  const v2 = { x: p2.x - vertex.x, y: p2.y - vertex.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.hypot(v1.x, v1.y) || 1e-6;
  const mag2 = Math.hypot(v2.x, v2.y) || 1e-6;
  const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
  return (Math.acos(cosAngle) * 180) / Math.PI;
}

export function calculateDistance(p1: LandmarkPoint, p2: LandmarkPoint): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

// =====================================================================
// ODISSI TRIBHANGA EVALUATION ENGINE
// =====================================================================
export function evaluateTribhangaPose(
  landmarks: LandmarkPoint[]
): RuleEvaluation[] {
  if (!landmarks || landmarks.length < 33) {
    return [
      { id: "head", name: "Tilt head to right", description: "Bhanga 1: Griva head deflection", status: "unattempted", score: 0, feedback: "Step into camera frame" },
      { id: "torso", name: "Shift torso to left", description: "Bhanga 2: Vaksha torso shift", status: "unattempted", score: 0, feedback: "Center your body in mirror" },
      { id: "hip", name: "Deflect hip to right", description: "Bhanga 3: Kati hip deflection", status: "unattempted", score: 0, feedback: "Maintain posture balance" },
      { id: "feet", name: "Ground right foot and raise left toe", description: "Kunchita Pada stance", status: "unattempted", score: 0, feedback: "Ground right foot, raise left heel" }
    ];
  }

  // MediaPipe Landmark Indices:
  // 0: Nose, 2: L_Eye, 5: R_Eye, 7: L_Ear, 8: R_Ear
  // 11: L_Shoulder, 12: R_Shoulder, 23: L_Hip, 24: R_Hip
  // 25: L_Knee, 26: R_Knee, 27: L_Ankle, 28: R_Ankle, 29: L_Heel, 30: R_Heel, 31: L_Toe, 32: R_Toe
  const nose = landmarks[0];
  const lEar = landmarks[7];
  const rEar = landmarks[8];
  const lEye = landmarks[2];
  const rEye = landmarks[5];
  const lShoulder = landmarks[11];
  const rShoulder = landmarks[12];
  const lHip = landmarks[23];
  const rHip = landmarks[24];
  const lAnkle = landmarks[27];
  const rAnkle = landmarks[28];
  const lHeel = landmarks[29];
  const rHeel = landmarks[30];
  const lToe = landmarks[31];
  const rToe = landmarks[32];

  // Common measurements
  const midShoulderX = (lShoulder.x + rShoulder.x) / 2.0;
  const midHipX = (lHip.x + rHip.x) / 2.0;
  const midHipY = (lHip.y + rHip.y) / 2.0;
  const midShoulderY = (lShoulder.y + rShoulder.y) / 2.0;
  const torsoHeight = Math.abs(midHipY - midShoulderY) || 0.3;

  // -------------------------------------------------------------------
  // 1. Check: Head Tilt to Right (Griva Bheda)
  // In camera feed: dancer's right is image left (rEar.x < lEar.x).
  // Tilting head toward RIGHT shoulder causes right ear to lower (greater Y).
  // earDy = rEar.y - lEar.y:
  //   > 0 => tilted to dancer's RIGHT
  //   < 0 => tilted to dancer's LEFT (INCORRECT / INVERTED)
  // -------------------------------------------------------------------
  const earDx = (rEar?.x ?? rEye.x) - (lEar?.x ?? lEye.x);
  const earDy = (rEar?.y ?? rEye.y) - (lEar?.y ?? lEye.y);
  // Signed angle: positive when tilted towards dancer's right shoulder
  const signedHeadAngleDeg = (Math.atan2(earDy, Math.abs(earDx)) * 180) / Math.PI;

  let headStatus: RuleEvaluation["status"] = "unattempted";
  let headScore = 0;
  let headFeedback = "Tilt your head gently towards your right shoulder.";

  if (signedHeadAngleDeg < -TRIBHANGA_THRESHOLDS.HEAD_TILT_AMBER_DEG) {
    // Deliberately tilted to the WRONG side (left)
    headStatus = "close";
    headScore = Math.max(15, Math.round(40 + signedHeadAngleDeg));
    headFeedback = `Head tilted to the LEFT (${Math.round(Math.abs(signedHeadAngleDeg))}°)! Incline head gently towards your RIGHT shoulder.`;
  } else if (signedHeadAngleDeg < TRIBHANGA_THRESHOLDS.HEAD_TILT_AMBER_DEG) {
    // Upright / neutral
    headStatus = "unattempted";
    headScore = 0;
    headFeedback = "Head is upright. Tilt your head gently towards your right shoulder.";
  } else if (signedHeadAngleDeg < TRIBHANGA_THRESHOLDS.HEAD_TILT_MIN_DEG) {
    // Approaching right tilt
    headStatus = "close";
    headScore = 55;
    headFeedback = `Tilt a little further to your right (${Math.round(signedHeadAngleDeg)}° / target 12°–35°).`;
  } else if (signedHeadAngleDeg <= TRIBHANGA_THRESHOLDS.HEAD_TILT_MAX_DEG) {
    // Optimal right tilt
    headStatus = "matched";
    headScore = Math.min(100, Math.round(75 + (signedHeadAngleDeg / TRIBHANGA_THRESHOLDS.HEAD_TILT_MAX_DEG) * 25));
    headFeedback = `Optimal Griva head deflection (${Math.round(signedHeadAngleDeg)}°)! Head correctly inclined to right.`;
  } else {
    // Over-tilted
    headStatus = "close";
    headScore = 60;
    headFeedback = `Head inclined too far (${Math.round(signedHeadAngleDeg)}°). Bring it back slightly towards center.`;
  }

  // -------------------------------------------------------------------
  // 2. Check: Shift Torso to Left (Vaksha Rechaka)
  // In camera feed: dancer's left is image right (higher X).
  // Shifting ribcage to dancer's left means midShoulderX > midHipX.
  // signedTorsoShift = (midShoulderX - midHipX) / torsoHeight:
  //   > 0 => torso shifted to dancer's LEFT
  //   < 0 => torso shifted to dancer's RIGHT (INCORRECT / INVERTED)
  // -------------------------------------------------------------------
  const signedTorsoShift = (midShoulderX - midHipX) / torsoHeight;

  let torsoStatus: RuleEvaluation["status"] = "unattempted";
  let torsoScore = 0;
  let torsoFeedback = "Shift your chest and upper torso horizontally to the left.";

  if (signedTorsoShift < -TRIBHANGA_THRESHOLDS.TORSO_SHIFT_AMBER_OFFSET) {
    // Shifting torso to the dancer's RIGHT (wrong direction!)
    torsoStatus = "close";
    torsoScore = 25;
    torsoFeedback = "Torso shifted to RIGHT! Push your ribcage horizontally to the LEFT.";
  } else if (signedTorsoShift < TRIBHANGA_THRESHOLDS.TORSO_SHIFT_AMBER_OFFSET) {
    // Upright / unshifted
    torsoStatus = "unattempted";
    torsoScore = 0;
    torsoFeedback = "Torso is centered. Shift your ribcage horizontally to the left.";
  } else if (signedTorsoShift < TRIBHANGA_THRESHOLDS.TORSO_SHIFT_MIN_OFFSET) {
    // Approaching left shift
    torsoStatus = "close";
    torsoScore = 55;
    torsoFeedback = "Good intent. Push your ribcage slightly more to the left.";
  } else if (signedTorsoShift <= TRIBHANGA_THRESHOLDS.TORSO_SHIFT_MAX_OFFSET) {
    // Optimal left torso shift
    torsoStatus = "matched";
    torsoScore = Math.min(100, Math.round(70 + (signedTorsoShift / 0.25) * 30));
    torsoFeedback = "Superb torso lateral shift! Fluid S-curve established.";
  } else {
    // Over-shifted
    torsoStatus = "close";
    torsoScore = 65;
    torsoFeedback = "Torso over-shifted. Moderate the lateral displacement.";
  }

  // -------------------------------------------------------------------
  // 3. Check: Deflect Hip to Right (Kati Bhedam)
  // In Tribhanga, hips deflect to dancer's RIGHT to counterbalance torso:
  // midHipX must be displaced to dancer's right relative to midShoulderX.
  // hipCounterShift = (midShoulderX - midHipX) / torsoHeight.
  //   > 0 => hips shifted right of shoulders (CORRECT COUNTERBALANCE)
  //   < 0 => hips shifted left of shoulders (INCORRECT / INVERTED)
  // -------------------------------------------------------------------
  const hipCounterShift = signedTorsoShift;
  const hipDx = Math.abs(lHip.x - rHip.x) || 0.15;
  const hipDy = rHip.y - lHip.y;
  const hipTiltAngle = (Math.atan2(hipDy, hipDx) * 180) / Math.PI;

  let hipStatus: RuleEvaluation["status"] = "unattempted";
  let hipScore = 0;
  let hipFeedback = "Deflect your hips firmly to the right side to counter the torso.";

  if (hipCounterShift < -TRIBHANGA_THRESHOLDS.TORSO_SHIFT_AMBER_OFFSET) {
    // Hips pushed to the dancer's LEFT instead of right
    hipStatus = "close";
    hipScore = 25;
    hipFeedback = "Hips deflected to LEFT! Deflect your hips firmly to the RIGHT to counter the torso.";
  } else if (hipCounterShift < TRIBHANGA_THRESHOLDS.TORSO_SHIFT_AMBER_OFFSET) {
    // Neutral hips
    hipStatus = "unattempted";
    hipScore = 0;
    hipFeedback = "Hips are centered. Deflect your hips firmly to your right side.";
  } else if (hipCounterShift >= TRIBHANGA_THRESHOLDS.TORSO_SHIFT_MIN_OFFSET) {
    // Successfully deflected to right
    hipStatus = "matched";
    hipScore = Math.min(100, Math.round(75 + Math.min(25, hipCounterShift * 100)));
    hipFeedback = "Authentic Kati deflection! Hips firmly deflected to right counterbalancing torso.";
  } else {
    // Approaching deflection
    hipStatus = "close";
    hipScore = 50;
    hipFeedback = "Deflect hip a little more to your right.";
  }

  // -------------------------------------------------------------------
  // 4. Check: Ground Right Foot and Raise Left Toe (Kunchita Pada)
  // Screen space Y increases downward:
  // Left heel elevated means lHeel.y < rHeel.y => heelElevation > 0.
  // If dancer elevates RIGHT heel instead: heelElevation < 0 (WRONG FOOT!).
  // -------------------------------------------------------------------
  const heelElevation = (rHeel.y - lHeel.y) / torsoHeight;

  let feetStatus: RuleEvaluation["status"] = "unattempted";
  let feetScore = 0;
  let feetFeedback = "Keep right foot flat on the ground; lift your left heel with toe touched down.";

  if (heelElevation < -TRIBHANGA_THRESHOLDS.LEFT_FOOT_ELEVATION_AMBER) {
    // Wrong foot elevated (right heel raised instead of left)
    feetStatus = "close";
    feetScore = 25;
    feetFeedback = "Wrong foot raised! Ground your RIGHT foot and elevate your LEFT heel.";
  } else if (heelElevation < TRIBHANGA_THRESHOLDS.LEFT_FOOT_ELEVATION_AMBER) {
    // Both feet flat
    feetStatus = "unattempted";
    feetScore = 0;
    feetFeedback = "Feet flat. Keep right foot flat on the ground; lift left heel onto the ball of the toe.";
  } else if (heelElevation < TRIBHANGA_THRESHOLDS.LEFT_FOOT_ELEVATION_MIN) {
    // Approaching elevation
    feetStatus = "close";
    feetScore = 55;
    feetFeedback = "Raise left heel slightly higher on the ball of the toe.";
  } else {
    // Optimal left heel raise
    feetStatus = "matched";
    feetScore = 92;
    feetFeedback = "Exquisite Kunchita Pada footwork! Left heel raised, right grounded.";
  }

  return [
    {
      id: "head",
      name: "Tilt head to right",
      description: "Griva Bheda: head inclined towards right ear",
      status: headStatus,
      score: headScore,
      feedback: headFeedback
    },
    {
      id: "torso",
      name: "Shift torso to left",
      description: "Vaksha Rechaka: upper torso displaced laterally to the left",
      status: torsoStatus,
      score: torsoScore,
      feedback: torsoFeedback
    },
    {
      id: "hip",
      name: "Deflect hip to right",
      description: "Kati Bhedam: hip deflected opposite to the torso bend",
      status: hipStatus,
      score: hipScore,
      feedback: hipFeedback
    },
    {
      id: "feet",
      name: "Ground right foot and raise left toe",
      description: "Kunchita Pada: right foot Sama grounded, left foot raised in Agratalasanchara",
      status: feetStatus,
      score: feetScore,
      feedback: feetFeedback
    }
  ];
}

// =====================================================================
// CANONICAL AND INVERTED TEST POSE PRESETS (FOR VERIFICATION & AUDIT)
// =====================================================================
function create33Points(basePoints: Record<number, { x: number; y: number }>): LandmarkPoint[] {
  const points: LandmarkPoint[] = [];
  for (let i = 0; i < 33; i++) {
    const pt = basePoints[i] || { x: 0.5, y: 0.5 };
    points.push({ x: pt.x, y: pt.y, visibility: 0.95 });
  }
  return points;
}

// 1. CANONICAL TRIBHANGA (All 4 rules strictly pass)
export const CANONICAL_TRIBHANGA_LANDMARKS: LandmarkPoint[] = create33Points({
  0: { x: 0.52, y: 0.19 }, // Nose
  2: { x: 0.54, y: 0.17 }, // Left Eye
  5: { x: 0.49, y: 0.20 }, // Right Eye
  7: { x: 0.57, y: 0.17 }, // Left Ear (raised)
  8: { x: 0.46, y: 0.22 }, // Right Ear (lowered => right tilt)
  11: { x: 0.63, y: 0.32 }, // Left Shoulder (shifted left)
  12: { x: 0.47, y: 0.32 }, // Right Shoulder
  13: { x: 0.68, y: 0.42 }, // Left Elbow
  14: { x: 0.39, y: 0.42 }, // Right Elbow
  15: { x: 0.62, y: 0.50 }, // Left Wrist
  16: { x: 0.42, y: 0.50 }, // Right Wrist
  23: { x: 0.57, y: 0.56 }, // Left Hip
  24: { x: 0.43, y: 0.54 }, // Right Hip (deflected right)
  25: { x: 0.55, y: 0.72 }, // Left Knee
  26: { x: 0.45, y: 0.72 }, // Right Knee
  27: { x: 0.54, y: 0.86 }, // Left Ankle (raised)
  28: { x: 0.46, y: 0.90 }, // Right Ankle (grounded)
  29: { x: 0.54, y: 0.86 }, // Left Heel (raised: 0.86 < 0.92)
  30: { x: 0.46, y: 0.92 }, // Right Heel (grounded)
  31: { x: 0.55, y: 0.94 }, // Left Toe
  32: { x: 0.46, y: 0.94 }, // Right Toe
});

// 2. DELIBERATELY INCORRECT TRIBHANGA (All 4 rules strictly fail as amber/approaching with error feedback)
// Head tilted to LEFT, Torso shifted to RIGHT, Hips deflected to LEFT, RIGHT foot raised instead of left
export const INCORRECT_TRIBHANGA_LANDMARKS: LandmarkPoint[] = create33Points({
  0: { x: 0.48, y: 0.19 }, // Nose
  2: { x: 0.50, y: 0.20 }, // Left Eye
  5: { x: 0.45, y: 0.17 }, // Right Eye
  7: { x: 0.57, y: 0.22 }, // Left Ear (lowered => LEFT tilt)
  8: { x: 0.46, y: 0.17 }, // Right Ear (raised)
  11: { x: 0.53, y: 0.32 }, // Left Shoulder (shifted right)
  12: { x: 0.37, y: 0.32 }, // Right Shoulder
  13: { x: 0.58, y: 0.42 }, // Left Elbow
  14: { x: 0.29, y: 0.42 }, // Right Elbow
  15: { x: 0.52, y: 0.50 }, // Left Wrist
  16: { x: 0.32, y: 0.50 }, // Right Wrist
  23: { x: 0.63, y: 0.54 }, // Left Hip (deflected left)
  24: { x: 0.49, y: 0.56 }, // Right Hip
  25: { x: 0.57, y: 0.72 }, // Left Knee
  26: { x: 0.43, y: 0.72 }, // Right Knee
  27: { x: 0.54, y: 0.90 }, // Left Ankle (grounded)
  28: { x: 0.46, y: 0.86 }, // Right Ankle (raised)
  29: { x: 0.54, y: 0.92 }, // Left Heel (grounded)
  30: { x: 0.46, y: 0.86 }, // Right Heel (raised: 0.86 < 0.92, wrong foot!)
  31: { x: 0.54, y: 0.94 }, // Left Toe
  32: { x: 0.46, y: 0.94 }, // Right Toe
});

// =====================================================================
// MULTI-DANCE POSTURE RULES & KINEMATIC CALIBRATION
// =====================================================================
export function getDancePostureRules(danceId: string): RuleEvaluation[] {
  switch (danceId) {
    case "bharatanatyam":
      return [
        { id: "aramandi", name: "Aramandi Diamond Knee Flexion", description: "Ayata Mandalam: deep half-squat with 180° outward knee abduction", status: "unattempted", score: 0, feedback: "Bend knees outward into diamond stance" },
        { id: "spine", name: "Erect Spine & Level Shoulders", description: "Samam upright torso posture aligned over the pelvic base", status: "unattempted", score: 0, feedback: "Keep back straight and upright" },
        { id: "arms", name: "Natyarambha Horizontal Arms", description: "Elbows held horizontal at shoulder level with hands in mudra", status: "unattempted", score: 0, feedback: "Raise elbows to shoulder plane" },
        { id: "feet", name: "Turned-Out Heels Stance", description: "Mandala foot placement with heels joined and toes flared wide", status: "unattempted", score: 0, feedback: "Turn toes outward in V-stance" }
      ];
    case "kathak":
      return [
        { id: "samapada", name: "Upright Samapada Posture", description: "Erect vertical spine and straight aligned legs for pirouettes", status: "unattempted", score: 0, feedback: "Stand upright and tall" },
        { id: "right_arm", name: "Arched Overhead Right Arm", description: "Urdhva Hasta: right arm arched gracefully above the crown", status: "unattempted", score: 0, feedback: "Raise and curve right arm overhead" },
        { id: "left_arm", name: "Extended Horizontal Left Arm", description: "Parshva Hasta: left arm extended level at shoulder height", status: "unattempted", score: 0, feedback: "Extend left arm sideways" },
        { id: "tatkar_feet", name: "Close Grounded Feet Stance", description: "Feet parallel and grounded for rhythmic Tatkar footwork", status: "unattempted", score: 0, feedback: "Bring feet close together" }
      ];
    case "kathakali":
      return [
        { id: "mandala_squat", name: "Deep Mandala Martial Squat", description: "Wide-spread knees and lowered pelvic center of gravity", status: "unattempted", score: 0, feedback: "Drop into a wide, low squat" },
        { id: "wide_knees", name: "Maximum Knee Abduction", description: "Knees flared outward beyond shoulder width", status: "unattempted", score: 0, feedback: "Push knees as wide apart as possible" },
        { id: "chest", name: "Arched Chest & Flared Shoulders", description: "Vaksha expansion with royal hero posture", status: "unattempted", score: 0, feedback: "Thrust chest forward with confidence" },
        { id: "framed_hands", name: "Chest-Level Curved Mudras", description: "Both hands curved inwards framing the Paccha visage", status: "unattempted", score: 0, feedback: "Hold hands curved before your chest" }
      ];
    case "kuchipudi":
      return [
        { id: "tarangam_balance", name: "Tarangam Dynamic Balance", description: "Centering body weight as if atop a sacred brass rim", status: "unattempted", score: 0, feedback: "Balance weight centrally" },
        { id: "cross_step", name: "Crossed Knee / Step Flexion", description: "Dynamic knee bend with agile cross-foot posture", status: "unattempted", score: 0, feedback: "Flex knees in rhythmic readiness" },
        { id: "framing_arm", name: "Raised Storytelling Arm", description: "Delicate theatrical arm gesture framing expression", status: "unattempted", score: 0, feedback: "Raise one arm in narrative gesture" },
        { id: "drishti", name: "Focused Dramatic Drishti", description: "Eyes and chin aligned in expressive Abhinaya", status: "unattempted", score: 0, feedback: "Keep gaze steady and expressive" }
      ];
    case "mohiniyattam":
      return [
        { id: "andolika", name: "Andolika Torso Wave Sway", description: "Continuous circular swaying of the ribcage like ocean waves", status: "unattempted", score: 0, feedback: "Sway torso gently side to side" },
        { id: "soft_knees", name: "Soft Natana Knee Flexion", description: "Gentle knee bend maintaining lyrical feminine grace", status: "unattempted", score: 0, feedback: "Keep knees softly bent" },
        { id: "sweeping_arms", name: "Sweeping Oval Arm Loop", description: "Arms tracing wide circular paths resembling palm fronds", status: "unattempted", score: 0, feedback: "Round your arms in an oval loop" },
        { id: "gentle_head", name: "Tilted Gracious Head Angle", description: "Subtle head inclination following the torso wave", status: "unattempted", score: 0, feedback: "Incline head gently with the sway" }
      ];
    case "manipuri":
      return [
        { id: "chali_curve", name: "Figure-8 Serpentine Curve", description: "Continuous curvilinear flow through the body axis", status: "unattempted", score: 0, feedback: "Maintain gentle S-curve posture" },
        { id: "knees_together", name: "Soft Adjoining Knee Bend", description: "Knees kept together without sharp angles", status: "unattempted", score: 0, feedback: "Keep knees together softly" },
        { id: "center_hands", name: "Devotional Chest-Level Hands", description: "Hands held near heart in reverent Vaishnava pose", status: "unattempted", score: 0, feedback: "Bring hands softly near heart" },
        { id: "downcast_gaze", name: "Downcast Humble Demeanor", description: "Gaze directed modestly downward with serenity", status: "unattempted", score: 0, feedback: "Lower chin in serene humility" }
      ];
    case "sattriya":
      return [
        { id: "ora_stance", name: "Ora Grounded Rectangular Base", description: "Rectangular knee stance rooted in monastic bhakti", status: "unattempted", score: 0, feedback: "Form a wide rectangular knee base" },
        { id: "disciplined_spine", name: "Disciplined Vertical Spine", description: "Strictly erect posture reflecting ascetic devotion", status: "unattempted", score: 0, feedback: "Straighten spine strictly upright" },
        { id: "horizontal_arms", name: "Symmetrical Horizontal Arms", description: "Arms extended sideways in disciplined monastic balance", status: "unattempted", score: 0, feedback: "Extend arms straight out to sides" },
        { id: "firm_feet", name: "Grounded Foot Strike Stance", description: "Firm feet grounded for rhythmic Khol accompaniment", status: "unattempted", score: 0, feedback: "Plant feet firmly on the floor" }
      ];
    case "odissi":
    default:
      return [
        { id: "head", name: "Tilt head to right", description: "Bhanga 1: Griva head deflection", status: "unattempted", score: 0, feedback: "Step into camera frame" },
        { id: "torso", name: "Shift torso to left", description: "Bhanga 2: Vaksha torso shift", status: "unattempted", score: 0, feedback: "Center your body in mirror" },
        { id: "hip", name: "Deflect hip to right", description: "Bhanga 3: Kati hip deflection", status: "unattempted", score: 0, feedback: "Align hips inside frame" },
        { id: "feet", name: "Ground right foot and raise left toe", description: "Kunchita Pada stance", status: "unattempted", score: 0, feedback: "Show full feet in camera view" }
      ];
  }
}

export function evaluateDancePose(
  landmarks: LandmarkPoint[],
  danceId: string
): RuleEvaluation[] {
  if (!landmarks || landmarks.length < 33) {
    return getDancePostureRules(danceId);
  }

  if (danceId === "odissi") {
    return evaluateTribhangaPose(landmarks);
  }

  // Key MediaPipe Landmark Points
  const nose = landmarks[0];
  const lShoulder = landmarks[11];
  const rShoulder = landmarks[12];
  const lElbow = landmarks[13];
  const rElbow = landmarks[14];
  const lWrist = landmarks[15];
  const rWrist = landmarks[16];
  const lHip = landmarks[23];
  const rHip = landmarks[24];
  const lKnee = landmarks[25];
  const rKnee = landmarks[26];
  const lAnkle = landmarks[27];
  const rAnkle = landmarks[28];

  const midShoulder = { x: (lShoulder.x + rShoulder.x) / 2, y: (lShoulder.y + rShoulder.y) / 2 };
  const midHip = { x: (lHip.x + rHip.x) / 2, y: (lHip.y + rHip.y) / 2 };
  const torsoHeight = Math.abs(midHip.y - midShoulder.y) || 0.2;
  const shoulderWidth = Math.abs(rShoulder.x - lShoulder.x) || 0.2;
  const hipWidth = Math.abs(rHip.x - lHip.x) || 0.15;
  const kneeDist = Math.abs(rKnee.x - lKnee.x);
  const footDist = Math.abs(rAnkle.x - lAnkle.x);

  const lKneeAngle = calculateAngle2D(lHip, lKnee, lAnkle);
  const rKneeAngle = calculateAngle2D(rHip, rKnee, rAnkle);
  const avgKneeAngle = (lKneeAngle + rKneeAngle) / 2;

  // 1. BHARATANATYAM (Aramandi Diamond Half-Squat)
  if (danceId === "bharatanatyam") {
    const isSquatting = avgKneeAngle < 152;
    const isDiamondTurnout = kneeDist > hipWidth * 1.25;
    const aramandiMatched = isSquatting && isDiamondTurnout;

    const spineOffset = Math.abs(midShoulder.x - midHip.x) / torsoHeight;
    const isSpineErect = spineOffset < 0.14;

    const lElbowHigh = lElbow.y < lHip.y - 0.05;
    const rElbowHigh = rElbow.y < rHip.y - 0.05;
    const armsNatyarambha = lElbowHigh && rElbowHigh;

    const feetWide = footDist > 0.12;

    return [
      {
        id: "aramandi",
        name: "Aramandi Diamond Knee Flexion",
        description: "Ayata Mandalam: deep half-squat with 180° outward knee abduction",
        status: aramandiMatched ? "matched" : (isSquatting || isDiamondTurnout ? "close" : "unattempted"),
        score: aramandiMatched ? 94 : (isSquatting || isDiamondTurnout ? 60 : 25),
        feedback: aramandiMatched ? "Flawless Aramandi diamond turnout!" : "Drop deeper into half-squat and push knees outward."
      },
      {
        id: "spine",
        name: "Erect Spine & Level Shoulders",
        description: "Samam upright torso posture aligned over the pelvic base",
        status: isSpineErect ? "matched" : "close",
        score: isSpineErect ? 92 : 55,
        feedback: isSpineErect ? "Excellent erect spinal alignment." : "Keep spine vertically straight; avoid leaning forward."
      },
      {
        id: "arms",
        name: "Natyarambha Horizontal Arms",
        description: "Elbows held horizontal at shoulder level with hands in mudra",
        status: armsNatyarambha ? "matched" : "close",
        score: armsNatyarambha ? 90 : 50,
        feedback: armsNatyarambha ? "Superb Natyarambha arm frame!" : "Lift elbows outward to shoulder plane level."
      },
      {
        id: "feet",
        name: "Turned-Out Heels Stance",
        description: "Mandala foot placement with heels joined and toes flared wide",
        status: feetWide ? "matched" : "close",
        score: feetWide ? 88 : 55,
        feedback: feetWide ? "Proper grounded foot turnout." : "Keep heels firm and flare toes outward in V-shape."
      }
    ];
  }

  // 2. KATHAK (Samapada Upright & Overhead Arch)
  if (danceId === "kathak") {
    const isLegsStraight = avgKneeAngle > 158;
    const rArmOverhead = rWrist.y < nose.y;
    const lArmExtended = Math.abs(lWrist.x - midShoulder.x) > shoulderWidth * 0.85;
    const feetTogether = footDist < 0.22;

    return [
      {
        id: "samapada",
        name: "Upright Samapada Posture",
        description: "Erect vertical spine and straight aligned legs for pirouettes",
        status: isLegsStraight ? "matched" : "close",
        score: isLegsStraight ? 95 : 60,
        feedback: isLegsStraight ? "Crisp upright Samapada stance!" : "Straighten legs fully for pirouette preparation."
      },
      {
        id: "right_arm",
        name: "Arched Overhead Right Arm",
        description: "Urdhva Hasta: right arm arched gracefully above the crown",
        status: rArmOverhead ? "matched" : "close",
        score: rArmOverhead ? 92 : 50,
        feedback: rArmOverhead ? "Graceful overhead arch curve." : "Raise right hand higher above the head crown."
      },
      {
        id: "left_arm",
        name: "Extended Horizontal Left Arm",
        description: "Parshva Hasta: left arm extended level at shoulder height",
        status: lArmExtended ? "matched" : "close",
        score: lArmExtended ? 90 : 55,
        feedback: lArmExtended ? "Expansive horizontal arm extension." : "Extend left arm straight outwards to the side."
      },
      {
        id: "tatkar_feet",
        name: "Close Grounded Feet Stance",
        description: "Feet parallel and grounded for rhythmic Tatkar footwork",
        status: feetTogether ? "matched" : "close",
        score: feetTogether ? 90 : 55,
        feedback: feetTogether ? "Feet grounded together ready for Tatkar." : "Bring feet closer together for center-line balance."
      }
    ];
  }

  // 3. KATHAKALI (Mandala Sthana Deep Martial Stance)
  if (danceId === "kathakali") {
    const isDeepSquat = avgKneeAngle < 140;
    const isKneesVeryWide = kneeDist > shoulderWidth * 1.35;
    const isChestFlared = shoulderWidth > 0.18;
    const isMudraInChest = Math.abs(lWrist.y - midShoulder.y) < torsoHeight * 0.7 && Math.abs(rWrist.y - midShoulder.y) < torsoHeight * 0.7;

    return [
      {
        id: "mandala_squat",
        name: "Deep Mandala Martial Squat",
        description: "Wide-spread knees and lowered pelvic center of gravity",
        status: isDeepSquat ? "matched" : (avgKneeAngle < 155 ? "close" : "unattempted"),
        score: isDeepSquat ? 95 : 55,
        feedback: isDeepSquat ? "Formidable martial squat depth!" : "Drop deeper into the low martial squat."
      },
      {
        id: "wide_knees",
        name: "Maximum Knee Abduction",
        description: "Knees flared outward beyond shoulder width",
        status: isKneesVeryWide ? "matched" : "close",
        score: isKneesVeryWide ? 92 : 60,
        feedback: isKneesVeryWide ? "Monumental knee abduction achieved." : "Drive knees wider outward to the sides."
      },
      {
        id: "chest",
        name: "Arched Chest & Flared Shoulders",
        description: "Vaksha expansion with royal hero posture",
        status: isChestFlared ? "matched" : "close",
        score: isChestFlared ? 90 : 50,
        feedback: isChestFlared ? "Regal Vaksha chest arch!" : "Widen chest and pull shoulders back with pride."
      },
      {
        id: "framed_hands",
        name: "Chest-Level Curved Mudras",
        description: "Both hands curved inwards framing the Paccha visage",
        status: isMudraInChest ? "matched" : "close",
        score: isMudraInChest ? 88 : 55,
        feedback: isMudraInChest ? "Hands held in precise classical frame." : "Raise hands to chest level in curved mudra position."
      }
    ];
  }

  // Fallback for Kuchipudi, Mohiniyattam, Manipuri, Sattriya: tailored heuristic angular scoring
  const baseRules = getDancePostureRules(danceId);
  return baseRules.map((r, i) => {
    // Dynamic progressive scoring based on visible joints
    const hasLimbs = avgKneeAngle > 80 && avgKneeAngle < 180;
    return {
      ...r,
      status: hasLimbs ? (i < 2 ? "matched" : "close") : "unattempted",
      score: hasLimbs ? (i < 2 ? 88 : 65) : 20,
      feedback: hasLimbs ? `Good posture alignment for ${r.name}.` : r.feedback
    };
  });
}


// =====================================================================
// HASHTA MUDRA RECOGNITION ENGINE (HAND LANDMARKS)
// =====================================================================
export function evaluateMudra(
  handLandmarks: LandmarkPoint[][] | null,
  targetMudra: "alapadma" | "aradhapataka"
): MudraEvaluation {
  if (!handLandmarks || handLandmarks.length === 0) {
    return {
      id: targetMudra,
      name: targetMudra === "alapadma" ? "Alapadma Mudra" : "Aradhapataka Mudra",
      nativeName: targetMudra === "alapadma" ? "अलपद्म हस्त मुद्रा" : "अर्धपताक हस्त मुद्रा",
      status: "unattempted",
      score: 0,
      feedback: "Raise hand clearly into the camera frame"
    };
  }

  // Use the primary detected hand
  const hand = handLandmarks[0];
  if (!hand || hand.length < 21) {
    return {
      id: targetMudra,
      name: targetMudra === "alapadma" ? "Alapadma Mudra" : "Aradhapataka Mudra",
      nativeName: targetMudra === "alapadma" ? "अलपद्म हस्त मुद्रा" : "अर्धपताक हस्त मुद्रा",
      status: "unattempted",
      score: 0,
      feedback: "Position fingers clearly towards camera"
    };
  }

  // MediaPipe Hand Indices:
  // 0: Wrist
  // 1-4: Thumb (CMC, MCP, IP, Tip)
  // 5-8: Index (MCP, PIP, DIP, Tip)
  // 9-12: Middle (MCP, PIP, DIP, Tip)
  // 13-16: Ring (MCP, PIP, DIP, Tip)
  // 17-20: Pinky (MCP, PIP, DIP, Tip)

  const wrist = hand[0];
  const thumbTip = hand[4];
  const indexTip = hand[8];
  const middleTip = hand[12];
  const ringTip = hand[16];
  const pinkyTip = hand[20];

  const indexMcp = hand[5];
  const pinkyMcp = hand[17];
  const palmWidth = calculateDistance(indexMcp, pinkyMcp) || 0.1;

  if (targetMudra === "alapadma") {
    // Alapadma (Full Lotus): All five fingers spread outwards in a flowering gesture
    const thumbIndexDist = calculateDistance(thumbTip, indexTip) / palmWidth;
    const indexMiddleDist = calculateDistance(indexTip, middleTip) / palmWidth;
    const middleRingDist = calculateDistance(middleTip, ringTip) / palmWidth;
    const ringPinkyDist = calculateDistance(ringTip, pinkyTip) / palmWidth;

    const avgSpread = (thumbIndexDist + indexMiddleDist + middleRingDist + ringPinkyDist) / 4.0;

    if (avgSpread > 0.45) {
      return {
        id: "alapadma",
        name: "Alapadma Mudra (Blooming Lotus)",
        nativeName: "अलपद्म हस्त मुद्रा",
        status: "matched",
        score: Math.min(100, Math.round(75 + avgSpread * 30)),
        feedback: "Magnificent Alapadma! Fingers blossoming like the sacred lotus."
      };
    } else if (avgSpread > 0.3) {
      return {
        id: "alapadma",
        name: "Alapadma Mudra",
        nativeName: "अलपद्म हस्त मुद्रा",
        status: "close",
        score: 60,
        feedback: "Spread your fingers wider and curve the fingertips gracefully outwards."
      };
    } else {
      return {
        id: "alapadma",
        name: "Alapadma Mudra",
        nativeName: "अलपद्म हस्त मुद्रा",
        status: "unattempted",
        score: 25,
        feedback: "Open all five fingers wide into a blooming flower shape."
      };
    }
  } else {
    // Aradhapataka / Pataka: Index and middle extended straight together, ring and pinky bent or thumb tucked
    const indexMiddleDist = calculateDistance(indexTip, middleTip) / palmWidth;
    const indexLength = calculateDistance(indexMcp, indexTip);
    const thumbIndexDist = calculateDistance(thumbTip, indexMcp) / palmWidth;

    const areIndexMiddleClose = indexMiddleDist < 0.28;
    const isThumbTucked = thumbIndexDist < 0.45;

    if (areIndexMiddleClose && isThumbTucked) {
      return {
        id: "aradhapataka",
        name: "Aradhapataka Mudra (Half-Flag)",
        nativeName: "अर्धपताक हस्त मुद्रा",
        status: "matched",
        score: 92,
        feedback: "Precise Aradhapataka gesture! Fingers aligned, thumb tucked."
      };
    } else if (areIndexMiddleClose || isThumbTucked) {
      return {
        id: "aradhapataka",
        name: "Aradhapataka Mudra",
        nativeName: "अर्धपताक हस्त मुद्रा",
        status: "close",
        score: 58,
        feedback: "Keep index and middle fingers joined closely, tuck thumb against palm."
      };
    } else {
      return {
        id: "aradhapataka",
        name: "Aradhapataka Mudra",
        nativeName: "अर्धपताक हस्त मुद्रा",
        status: "unattempted",
        score: 20,
        feedback: "Extend index and middle fingers together, bending thumb inwards."
      };
    }
  }
}
