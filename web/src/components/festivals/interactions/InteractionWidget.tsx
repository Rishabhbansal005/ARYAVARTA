"use client";

import React from "react";
import { FestivalInteraction } from "@/types";
import { DiyaLightingWidget } from "./DiyaLightingWidget";
import { ColorSplashWidget } from "./ColorSplashWidget";
import { NightSkyCrescentWidget } from "./NightSkyCrescentWidget";
import { PrepareDishWidget } from "./PrepareDishWidget";
import { RangoliCraftWidget } from "./RangoliCraftWidget";
import { FlagHoistingWidget } from "./FlagHoistingWidget";
import { BonfireOfferingWidget } from "./BonfireOfferingWidget";
import { RitualEmotionalContainer } from "./RitualEmotionalContainer";
import { getRitualEmotionalLayer } from "./ritualEmotionalRegistry";

interface InteractionWidgetProps {
  interaction: FestivalInteraction;
  festivalId?: string;
  onNavigateTab?: (tab: string) => void;
  onSelectRegional?: () => void;
  onPlayAudio?: () => void;
}

export const InteractionWidget: React.FC<InteractionWidgetProps> = ({
  interaction,
  festivalId = "",
  onNavigateTab,
  onSelectRegional,
  onPlayAudio
}) => {
  if (interaction.actionComponent === "regional-map-toggle") {
    return (
      <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-4">
        <div>
          <h4 className="font-serif font-bold text-sm text-[#F5E0A0]">
            {interaction.label.en}
          </h4>
          <p className="text-xs text-[#E8DFD1]/70 mt-1">
            {interaction.description}
          </p>
        </div>
        {onSelectRegional && (
          <button
            onClick={onSelectRegional}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#D4AF37] text-[#07080B] hover:brightness-110 shadow-md shrink-0 cursor-pointer"
          >
            View Regions
          </button>
        )}
      </div>
    );
  }

  if (interaction.actionComponent === "recite-lore") {
    return null;
  }

  const emotionalLayer =
    interaction.emotionalLayer ||
    getRitualEmotionalLayer(festivalId, interaction.actionComponent, interaction.data);

  return (
    <RitualEmotionalContainer
      festivalId={festivalId}
      emotionalLayer={emotionalLayer}
      onNavigateTab={onNavigateTab}
    >
      {({ personalReflection }) => {
        switch (interaction.actionComponent) {
          case "light-diya":
            return (
              <DiyaLightingWidget
                data={interaction.data}
                personalReflection={personalReflection}
              />
            );

          case "splash-colors":
            return (
              <ColorSplashWidget
                data={interaction.data}
                personalReflection={personalReflection}
              />
            );

          case "night-sky-crescent":
            return (
              <NightSkyCrescentWidget
                data={interaction.data}
                personalReflection={personalReflection}
              />
            );

          case "prepare-dish":
            return (
              <PrepareDishWidget
                data={interaction.data}
                personalReflection={personalReflection}
              />
            );

          case "craft-a-rangoli":
            return (
              <RangoliCraftWidget
                data={interaction.data}
                personalReflection={personalReflection}
              />
            );

          case "flag-hoisting":
            return (
              <FlagHoistingWidget
                data={interaction.data}
                personalReflection={personalReflection}
              />
            );

          case "bonfire-offering":
            return (
              <BonfireOfferingWidget
                data={interaction.data}
                personalReflection={personalReflection}
              />
            );

          default:
            return null;
        }
      }}
    </RitualEmotionalContainer>
  );
};

