"use client";

import React from "react";
import { HeritageLoadingScreen } from "@/components/common/HeritageLoadingScreen";

export default function Loading() {
  return <HeritageLoadingScreen isOverlay={true} minDuration={1400} />;
}
