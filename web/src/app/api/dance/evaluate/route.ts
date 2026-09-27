import { NextRequest, NextResponse } from "next/server";
import {
  evaluateDancePose,
  CANONICAL_TRIBHANGA_LANDMARKS,
  LandmarkPoint,
  calculateAngle2D
} from "@/components/nritya/poseCalibration";

// Procrustes normalization: center at pelvis and normalize by scale
function procrustesNormalize(landmarks: LandmarkPoint[]) {
  const hipL = landmarks[23] || landmarks[0] || { x: 0.5, y: 0.5 };
  const hipR = landmarks[24] || landmarks[0] || { x: 0.5, y: 0.5 };
  const midHipX = (hipL.x + hipR.x) / 2.0;
  const midHipY = (hipL.y + hipR.y) / 2.0;

  let sumSq = 0;
  const centered = landmarks.map((p) => {
    const pt = p || { x: 0.5, y: 0.5 };
    const cx = pt.x - midHipX;
    const cy = pt.y - midHipY;
    sumSq += cx * cx + cy * cy;
    return { x: cx, y: cy };
  });

  const scale = Math.sqrt(sumSq / (landmarks.length || 1)) || 1.0;
  return centered.map((p) => ({ x: p.x / scale, y: p.y / scale }));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      danceId = "odissi",
      poseName = "Tribhanga",
      keypointSequence = []
    } = body;

    if (!Array.isArray(keypointSequence) || keypointSequence.length === 0) {
      return NextResponse.json(
        { error: "keypointSequence array required for evaluation" },
        { status: 400 }
      );
    }

    // Pick the most recent valid frame from sequence
    let sampleFrame: LandmarkPoint[] | null = null;
    for (let i = keypointSequence.length - 1; i >= 0; i--) {
      if (Array.isArray(keypointSequence[i]) && keypointSequence[i].length >= 33) {
        sampleFrame = keypointSequence[i];
        break;
      }
    }

    if (!sampleFrame || sampleFrame.length < 33) {
      return NextResponse.json(
        { error: "Insufficient landmarks in keypoint frame (expected 33 MediaPipe joints)" },
        { status: 400 }
      );
    }

    // 1. Evaluate Pose Rules using Natya Shastra Biomechanical Engine
    const ruleEvals = evaluateDancePose(sampleFrame, danceId);

    // Calculate Average Rule Score
    const ruleScoreSum = ruleEvals.reduce((acc, r) => acc + (r.score || 0), 0);
    const ruleScoreAvg = Math.round(ruleScoreSum / Math.max(1, ruleEvals.length));

    // 2. Procrustes 3D Shape Alignment against Canonical Reference
    const userNorm = procrustesNormalize(sampleFrame);
    const refNorm = procrustesNormalize(CANONICAL_TRIBHANGA_LANDMARKS);

    let procrustesDisparity = 0;
    const numPoints = Math.min(userNorm.length, refNorm.length);
    for (let i = 0; i < numPoints; i++) {
      const dx = userNorm[i].x - refNorm[i].x;
      const dy = userNorm[i].y - refNorm[i].y;
      procrustesDisparity += Math.sqrt(dx * dx + dy * dy);
    }
    procrustesDisparity /= Math.max(1, numPoints);

    // Disparity to percentage score (0 disparity -> ~98%, 0.3 disparity -> ~40%)
    const procrustesScore = Math.max(
      20,
      Math.min(99, Math.round(100 - procrustesDisparity * 175))
    );

    // 3. Compute Real Kinematic Angles from User Frame
    const nose = sampleFrame[0] || { x: 0.5, y: 0.2 };
    const lEar = sampleFrame[7] || sampleFrame[2] || { x: 0.55, y: 0.2 };
    const rEar = sampleFrame[8] || sampleFrame[5] || { x: 0.45, y: 0.2 };
    const lShoulder = sampleFrame[11] || { x: 0.6, y: 0.3 };
    const rShoulder = sampleFrame[12] || { x: 0.4, y: 0.3 };
    const lElbow = sampleFrame[13] || { x: 0.65, y: 0.4 };
    const rElbow = sampleFrame[14] || { x: 0.35, y: 0.4 };
    const lWrist = sampleFrame[15] || { x: 0.65, y: 0.5 };
    const rWrist = sampleFrame[16] || { x: 0.35, y: 0.5 };
    const lHip = sampleFrame[23] || { x: 0.55, y: 0.55 };
    const rHip = sampleFrame[24] || { x: 0.45, y: 0.55 };
    const lKnee = sampleFrame[25] || { x: 0.55, y: 0.72 };
    const rKnee = sampleFrame[26] || { x: 0.45, y: 0.72 };
    const lAnkle = sampleFrame[27] || { x: 0.55, y: 0.88 };
    const rAnkle = sampleFrame[28] || { x: 0.45, y: 0.88 };

    const leftKneeAngle = Math.round(calculateAngle2D(lHip, lKnee, lAnkle));
    const rightKneeAngle = Math.round(calculateAngle2D(rHip, rKnee, rAnkle));
    const leftElbowAngle = Math.round(calculateAngle2D(lShoulder, lElbow, lWrist));
    const rightElbowAngle = Math.round(calculateAngle2D(rShoulder, rElbow, rWrist));

    // Head tilt angle relative to horizontal
    const earDx = rEar.x - lEar.x;
    const earDy = rEar.y - lEar.y;
    const userHeadTilt = Math.round(Math.abs((Math.atan2(earDy, earDx) * 180) / Math.PI));

    // 4. Map Per-Joint Breakdown from Specific Dance Rules
    let headScore = 80;
    let torsoScore = 80;
    let hipScore = 80;
    let kneeScore = 80;
    let armScore = 80;

    if (danceId === "odissi") {
      headScore = ruleEvals.find((r) => r.id === "head")?.score ?? 80;
      torsoScore = ruleEvals.find((r) => r.id === "torso")?.score ?? 80;
      hipScore = ruleEvals.find((r) => r.id === "hip")?.score ?? 80;
      kneeScore = ruleEvals.find((r) => r.id === "feet")?.score ?? 80;
      armScore = Math.min(98, Math.max(30, Math.round(100 - Math.abs(rightElbowAngle - 125) * 0.8)));
    } else if (danceId === "bharatanatyam") {
      kneeScore = ruleEvals.find((r) => r.id === "aramandi")?.score ?? 80;
      torsoScore = ruleEvals.find((r) => r.id === "spine")?.score ?? 80;
      armScore = ruleEvals.find((r) => r.id === "arms")?.score ?? 80;
      hipScore = ruleEvals.find((r) => r.id === "feet")?.score ?? 80;
      headScore = Math.min(98, Math.max(40, 100 - userHeadTilt * 2));
    } else if (danceId === "kathak") {
      torsoScore = ruleEvals.find((r) => r.id === "samapada")?.score ?? 80;
      const rArmScore = ruleEvals.find((r) => r.id === "right_arm")?.score ?? 80;
      const lArmScore = ruleEvals.find((r) => r.id === "left_arm")?.score ?? 80;
      armScore = Math.round((rArmScore + lArmScore) / 2);
      kneeScore = ruleEvals.find((r) => r.id === "tatkar_feet")?.score ?? 80;
      headScore = 90;
      hipScore = 88;
    } else if (danceId === "kathakali") {
      const squatScore = ruleEvals.find((r) => r.id === "mandala_squat")?.score ?? 80;
      const wideScore = ruleEvals.find((r) => r.id === "wide_knees")?.score ?? 80;
      kneeScore = Math.round((squatScore + wideScore) / 2);
      torsoScore = ruleEvals.find((r) => r.id === "chest")?.score ?? 80;
      armScore = ruleEvals.find((r) => r.id === "framed_hands")?.score ?? 80;
      hipScore = squatScore;
      headScore = 85;
    } else {
      // Heuristic fallback mapping
      headScore = ruleEvals[0]?.score ?? ruleScoreAvg;
      torsoScore = ruleEvals[1]?.score ?? ruleScoreAvg;
      hipScore = ruleEvals[2]?.score ?? ruleScoreAvg;
      kneeScore = ruleEvals[3]?.score ?? ruleScoreAvg;
      armScore = Math.round((leftElbowAngle + rightElbowAngle) / 3);
    }

    // 5. Compute Weighted Overall Score (Deterministic, Rule-Driven)
    const overallScore = Math.round(ruleScoreAvg * 0.7 + procrustesScore * 0.3);

    // 6. Pedagogical Grade Determination
    let grade = "Prathama (Developing / C)";
    if (overallScore >= 90) {
      grade = "Uttama (Mastery / A+)";
    } else if (overallScore >= 78) {
      grade = "Madhyama (Proficient / B)";
    } else if (overallScore >= 55) {
      grade = "Madhyama-Prathama (Developing / B-)";
    }

    // 7. Collect Real Canonical Feedback from Rule Evaluations
    const feedback = ruleEvals.map((r) => r.feedback);

    // Contextual summary feedback
    if (overallScore >= 88) {
      feedback.unshift(`Magnificent execution of ${poseName}! Silhouette matches classical Natya Shastra sculptures.`);
    } else if (overallScore >= 60) {
      feedback.unshift(`Good progress in ${poseName}. Refine angular deflections indicated below for full mastery.`);
    } else {
      feedback.unshift(`Focus on the core kinetic lines for ${poseName}. Review joint corrections below.`);
    }

    const responseData = {
      danceId,
      poseName,
      overallScore,
      grade,
      procrustesScore,
      perJointBreakdown: {
        headAndNeck: headScore,
        torsoLateralShift: torsoScore,
        hipDeflection: hipScore,
        kneeAndFootwork: kneeScore,
        armsAndMudras: armScore
      },
      kinematicAngles: {
        userHeadTilt,
        userLeftKnee: leftKneeAngle,
        userRightKnee: rightKneeAngle,
        userLeftElbow: leftElbowAngle,
        userRightElbow: rightElbowAngle
      },
      feedback,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("Pose evaluation API error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate pose keypoints", details: error.message },
      { status: 500 }
    );
  }
}
