export interface Hotspot {
  id: string;
  title: string;
  position: [number, number, number];
  category: string;
  short_desc: string;
  extended_story: string;
  connected_module?: string;
  connected_id?: string;
}

export interface CulturalLinks {
  dance?: {
    name: string;
    id: string;
    description?: string;
  };
  music?: {
    raga: string;
    id: string;
    description?: string;
  };
  craft?: {
    name: string;
    id: string;
    artisan?: string;
    village?: string;
  };
  festival?: {
    name: string;
    date?: string;
  };
}

export interface HeritageSite {
  id: string;
  name: string;
  native_name: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  built_century: string;
  builder: string;
  dynasty: string;
  architectural_style: string;
  unesco_world_heritage: boolean;
  tagline: string;
  summary: string;
  asset_note?: string;
  sketchfab?: {
    model_id: string;
    creator: string;
    creator_profile: string;
    license_label: string;
    license_url?: string;
    license_note: string;
    embed_url: string;
    license_flagged?: boolean;
    is_photogrammetry?: boolean;
  };
  camera_presets?: {
    full:   { eye: [number, number, number]; target: [number, number, number]; label: string };
    close:  { eye: [number, number, number]; target: [number, number, number]; label: string };
    detail: { eye: [number, number, number]; target: [number, number, number]; label: string };
  };
  model_3d?: {
    type: string;
    fallback_glb?: string;
    splat_url?: string;
    camera_position: [number, number, number];
    camera_look_at: [number, number, number];
  };
  hotspots: Hotspot[];
  cultural_links: CulturalLinks;
  audio_narration?: {
    title: string;
    duration: string;
    narrator: string;
    ambient: string;
  };
}


export interface HistoricalEvent {
  id: string;
  year?: number;
  year_start?: number;
  year_end?: number;
  era?: string;
  title: string;
  location?: string | { name?: string; region?: string; country?: string; [key: string]: any };
  latitude?: number;
  longitude?: number;
  summary: string;
  campaign?: string;
  causes?: string[];
  effects?: string[];
  dynasty?: string;
}

export type HistoryEra = "ancient" | "medieval-imperial" | "freedom-struggle" | "modern-republic";

export interface HistoricalEventEntity {
  id: string;
  year: number;              // negative for BCE (e.g. -257), positive for CE
  yearLabel: string;         // e.g. "257 BCE" or "380 CE"
  era: HistoryEra;
  dynasty: string[];         // ONLY dynasty/dynasties actually ruling at this exact year
  title: { en: string; native: string };
  summary: string;
  detail?: string;
  location: { name: string; modernName: string; lat: number; lng: number };
  image: {
    url: string;
    altText: string;
    verified: boolean;
  };
  chronicle: {
    text: { en: string; hi: string; [otherLangs: string]: string };
    audioUrl?: string;
  };
  sources: string[];
  certainty: "established" | "widely-accepted" | "debated";
  certaintyNote?: string;
  elsewhereInBharat?: {
    region: string;
    rulingDynasty: string;
    happening: string;
  }[];
  linkedEntities: {
    monuments: string[];
    festivals: string[];
    ragas: string[];
    danceForms: string[];
    crafts: string[];
  };
}

export interface HistoricalPerson {
  id: string;
  name: string;
  lifespan?: string;
  title?: string;
  summary: string;
  category?: string;
  famous_deeds?: string[];
}

export type TraditionType =
  | "hindu"
  | "islamic"
  | "sikh"
  | "christian"
  | "buddhist"
  | "jain"
  | "tribal-regional"
  | "civic-national"
  | "harvest-seasonal";

export interface RegionalNameVariation {
  region: string;
  localName: string;
  note: string;
  image?: string;
  uniqueCustom?: string;
}

export interface RitualEmotionalLayer {
  personalPrompt: {
    question: string;
    options: string[];
    placeholder?: string;
  };
  culturalMeaning: string; // The "Why": 2-3 historical/cultural sentences
  completionEcho: {
    template: string; // e.g. "Your wish for {input} joins the sacred flames..."
    fallback: string;
  };
  ambientSound?: {
    type: "fire" | "night-wind" | "temple-bell" | "ceremonial" | "water" | "hearth";
    label: string;
  };
  outwardConnection?: {
    craftName: string;
    artisanNote: string;
    targetTab: string;
  };
}

export interface FestivalInteraction {
  type: "ritual" | "food" | "custom" | "craft" | "music" | "dance";
  label: { en: string; native: string };
  icon: string;
  description: string;
  actionComponent: string;
  data?: any;
  emotionalLayer?: RitualEmotionalLayer;
}

export interface FestivalEntity {
  id: string;
  name: { en: string; native: string };
  date: string;
  dateNote: string;
  tradition: TraditionType;
  regions: string[];
  regionalNames?: RegionalNameVariation[];
  image: {
    url: string;
    altText: string;
    verified: boolean;
  };
  summary: string;
  lore: {
    text: { en: string; hi: string; [otherLangs: string]: string };
    audioUrl?: string;
  };
  interactions: FestivalInteraction[];
  linkedEntities: {
    ragas: string[];
    danceForms: string[];
    crafts: string[];
    monuments: string[];
  };
}

export type Festival = FestivalEntity;

export interface Raga {
  id: number | string;
  name: string;
  melakarta_number?: number | null;
  is_melakarta: boolean;
  arohana: string;
  avarohana: string;
  swaras: string[];
  category?: string;
  jati?: string;
  swara_count?: string;
  prahar?: string;
  rasa?: string;
  thaat?: string;
  is_featured?: boolean;
  time_category?: string;
  description?: string;
  western_parallel?: string;
  time_of_day?: string;
  mood?: string;
}

export interface DanceForm {
  id: string;
  name: string;
  native_name: string;
  region: string;
  state: string;
  treatise: string;
  description: string;
  key_pose: string;
  posture_tips: string[];
  signature_mudra: string;
  color: string;
}

export interface Product {
  id: string;
  title: string;
  price_inr: number;
  dimensions: string;
  estimated_craft_hours: number;
  image: string;
  description: string;
}

export interface CraftPassport {
  passport_id: string;
  origin: string;
  materials_used: string[];
  technique: string;
  verifiable_stamp: string;
  artisan_signature_date: string;
}

export interface ArtisanCluster {
  id: string;
  craft_name: string;
  region: string;
  village: string;
  connected_site_id: string;
  artisan: {
    id: string;
    name: string;
    years_of_tradition: string;
    avatar_url: string;
    bio: string;
    video_reel: string;
  };
  craft_passport: CraftPassport;
  products: Product[];
}
