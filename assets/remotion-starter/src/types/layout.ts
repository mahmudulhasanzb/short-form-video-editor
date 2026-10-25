import { ReactNode } from "react";

export type LayoutType = "Full Speaker" | "50/50 Split" | "100% Full Canvas";

export type CanvasBackgroundVariant =
  | "warm-grid" // Warm off-white + thin grey grid + cast shadow (default)
  | "plain-white" // Plain white solid for simple statements
  | "white-shadow-grid"; // White + gradient cast shadow + thin light grid

export interface FullSpeakerProps {
  /** Speaker video or image element */
  children?: ReactNode;
  /** Video/image source if rendered directly */
  speakerSrc?: string;
  /** Start frame in source video for frame-accurate sync */
  startFrom?: number;
  /** Whether video audio is muted */
  muted?: boolean;
  /** Whether to apply slow push-in zoom */
  pushIn?: boolean;
  /** Max scale for push-in (default: 1.06) */
  pushInScale?: number;
  /** Lower third UI content (caption, card) */
  lowerThird?: ReactNode;
  /** Darken/blur lower third behind UI (default: true) */
  darkenLowerThird?: boolean;
}

export interface PersonCropMeasurements {
  /** Head top position in source frame (percentage 0-100, e.g. 17) */
  headTopPercent: number;
  /** Eye line position in source frame (percentage 0-100, e.g. 26) */
  eyeLinePercent: number;
  /** Chin position in source frame (percentage 0-100, e.g. 39) */
  chinPercent: number;
  /** Shoulders position in source frame (percentage 0-100, optional) */
  shouldersPercent?: number;
}

export interface SplitLayoutProps {
  /** Top graphic layer content (0% to 50% of frame height) */
  topGraphicContent: ReactNode;
  /** Bottom person layer source (50% to 100% of frame height) */
  speakerSrc?: string;
  /** Start frame in source video for frame-accurate sync */
  startFrom?: number;
  /** Whether video audio is muted */
  muted?: boolean;
  /** Custom person layer element */
  bottomPersonContent?: ReactNode;
  /** Crop measurements to ensure eyes land at 62-65% in final frame */
  cropMeasurements?: PersonCropMeasurements;
  /** Background variant for top graphic canvas */
  canvasVariant?: CanvasBackgroundVariant;
}

export interface FullCanvasProps {
  /** Center graphic or main focus object */
  children: ReactNode;
  /** Top or center headline statement lockup */
  statementLockup?: ReactNode;
  /** Background style variant */
  variant?: CanvasBackgroundVariant;
  /** Generous margin around focal point (default: true) */
  generousSpacing?: boolean;
}
