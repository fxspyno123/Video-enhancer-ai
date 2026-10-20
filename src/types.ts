export type EnhancementMode = 
  | 'general' 
  | 'upscale' 
  | 'anime' 
  | 'restore' 
  | 'color' 
  | 'interpolation';

export type AspectRatioOption = 'original' | '1:1' | '9:16' | '16:9' | '4:5';
export type FitMode = 'fit' | 'fill';

export type ResolutionOption = 'original' | '480p' | '540p' | '720p' | '1080p' | '2k' | '4k';
export type FpsOption = 24 | 30 | 60 | 120;
export type OutputFormat = 'mp4' | 'webm';
export type BitrateOption = 'auto' | '2.5mbps' | '5mbps' | '10mbps' | '20mbps';

export interface VideoMetadata {
  name: string;
  size: number; // bytes
  type: string;
  duration: number; // seconds
  width: number;
  height: number;
  aspectRatio: string;
  fps: number;
  url: string;
  file?: File;
}

export interface ColorSettings {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  temperature: number; // -100 to 100
  tint: number; // -100 to 100
  highlights: number; // -100 to 100
  shadows: number; // -100 to 100
  sharpness: number; // 0 to 100
  fade: number; // 0 to 100
  exposure: number; // -100 to 100
}

export interface UpscaleSettings {
  targetResolution: ResolutionOption;
  detailRecovery: number; // 0 to 100
  edgeEnhancement: number; // 0 to 100
  noiseReduction: number; // 0 to 100
  artifactReduction: number; // 0 to 100
  sharpness: number; // 0 to 100
  model: 'standard-bicubic' | 'adaptive-neural-edge' | 'topaz-fidelity';
}

export interface AnimeSettings {
  preset: 'clean' | 'sharp' | 'cinematic' | 'vibrant' | 'soft' | 'custom';
  lineArtEnhance: number; // 0 to 100
  vibrancy: number; // 0 to 100
  edgeSharpness: number; // 0 to 100
  noiseReduction: number; // 0 to 100
  contrastBoost: number; // 0 to 100
}

export interface RestorationSettings {
  preset: 'lowlight' | 'clean' | 'detail' | 'old' | 'custom';
  denoise: number; // 0 to 100
  artifactClean: number; // 0 to 100
  detailBoost: number; // 0 to 100
  shadowLift: number; // 0 to 100
  highlightRecovery: number; // 0 to 100
  stabilization: boolean;
}

export interface InterpolationSettings {
  targetFps: FpsOption;
  mode: 'motion-adaptive' | 'temporal-frame-blend';
}

export interface ExportSettings {
  resolution: ResolutionOption;
  fps: FpsOption;
  bitrate: BitrateOption;
  format: OutputFormat;
  aspectRatio: AspectRatioOption;
  fitMode: FitMode;
  preserveAudio: boolean;
  filename: string;
}

export interface AIAnalysisResult {
  isAnime: boolean;
  qualityScore: number;
  noiseLevel: string;
  lightingCondition: string;
  compressionArtifacts: string;
  recommendedMode: EnhancementMode;
  recommendedPreset: string;
  suggestedSettings: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    sharpness?: number;
    noiseReduction?: number;
    detailRecovery?: number;
  };
  summary: string;
}

export interface ProjectRecord {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  sourceMetadata: {
    name: string;
    size: number;
    duration: number;
    width: number;
    height: number;
  };
  thumbnailDataUrl?: string;
  activeMode: EnhancementMode;
  colorSettings: ColorSettings;
  upscaleSettings: UpscaleSettings;
  animeSettings: AnimeSettings;
  restorationSettings: RestorationSettings;
  interpolationSettings: InterpolationSettings;
  exportSettings: ExportSettings;
}
