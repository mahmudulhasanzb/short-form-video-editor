import { CSSProperties } from "react";

export type CaptionMode = "Mode A" | "Mode B" | "None";

export interface CaptionToken {
  /** The text word or phrase */
  text: string;
  /** Whether this word gets highlighted in large script with same-family gradient */
  isHighlighted?: boolean;
  /** Frame at which this specific word appears */
  startFrame?: number;
  /** Custom highlight color override */
  highlightColor?: string;
  /** Custom highlight gradient start/end (within same color family) */
  gradientStart?: string;
  gradientEnd?: string;
}

export interface CaptionChunk {
  /** Global or scene-relative start frame */
  startFrame: number;
  /** Global or scene-relative end frame */
  endFrame: number;
  /** Tokens in this 2-3 word chunk */
  tokens: CaptionToken[];
}

export interface ModeATalkingCaptionProps {
  /** 2-3 word audio-timed chunks (preferred) */
  chunks?: CaptionChunk[];
  /** Fallback sequence of caption tokens */
  tokens?: CaptionToken[];
  /** Scene start frame to offset absolute chunk frame timings */
  sceneStartFrame?: number;
  /** Background theme: dark-bg (white text) or light-bg (dark navy text) */
  variant?: "dark-bg" | "light-bg";
  /** Base sans font size in pixels (default: 44) */
  fontSize?: number;
  /** Highlighted script font size in pixels (default: 72) */
  highlightFontSize?: number;
  /** Primary sans font family (default: Creato Display, sans-serif) */
  sansFontFamily?: string;
  /** Highlight script font family (default: Instrument Serif, serif) */
  scriptFontFamily?: string;
  /** Primary text color override */
  textColor?: string;
  /** Gradient start color for highlighted word */
  gradientStart?: string;
  /** Gradient end color for highlighted word */
  gradientEnd?: string;
  /** Glow color for highlighted word */
  glowColor?: string;
  /** Center align or left align */
  align?: "center" | "left";
  /** Placement container styles */
  style?: CSSProperties;
}

export interface ModeBStatementLockupProps {
  /** Headline text or tokens */
  title: string | CaptionToken[];
  /** Subtitle or second line statement */
  subtitle?: string | CaptionToken[];
  /** Position lockup top or centre */
  position?: "top" | "center";
  /** Base sans font size in pixels (default: 48) */
  fontSize?: number;
  /** Highlighted script font size in pixels (default: 84) */
  highlightFontSize?: number;
  /** Primary text color (default: #0F172A on light canvas, #F3F3F3 on dark) */
  textColor?: string;
  /** Gradient start color for highlighted word */
  gradientStart?: string;
  /** Gradient end color for highlighted word */
  gradientEnd?: string;
  /** Script glow color */
  glowColor?: string;
  /** Primary sans font family */
  sansFontFamily?: string;
  /** Highlight script font family */
  scriptFontFamily?: string;
  style?: CSSProperties;
}
