/**
 * Design Principles: 60-30-10 Locked Palette
 * Source: visual-direction-draft.md Section 5
 * Note: Hex codes for Primary, Secondary, and Accent were marked "HEX TO CONFIRM FROM STORYBOARD FRAMES"
 * in the visual direction MD. Calibrated defaults are provided below, with full prop override capability.
 */
export const LOCKED_PALETTE = {
  /** Primary (60%): Dark navy studio background and card bases */
  primaryNavy: "#0B1528", // [UNCONFIRMED HEX: calibrated from dark studio frames]
  /** Secondary (30%): Light blue accents, borders, and sub-labels */
  secondaryLightBlue: "#60A5FA", // [UNCONFIRMED HEX: calibrated from frame captions]
  /** Accent (10%): Bright blue for script highlights, play buttons, and active indicators */
  accentBrightBlue: "#2563EB", // [UNCONFIRMED HEX: calibrated from frame key words]

  /** Neutral off-white for regular sans captions and cards */
  neutralOffWhite: "#F3F3F3",
  /** Dark text on light canvas */
  darkText: "#0F172A",
  /** Warm off-white canvas background for 100% Full Canvas */
  canvasWarmOffWhite: "#F8F7F4",
  /** Thin grid line stroke */
  gridStrokeColor: "rgba(0, 0, 0, 0.05)",
  /** Dark glass container background */
  darkGlassBg: "rgba(15, 23, 42, 0.78)",
  /** White glossy container background */
  whiteGlossyBg: "rgba(255, 255, 255, 0.96)",
} as const;

/**
 * Creates a premium same-family gradient for highlighted script words.
 * Rule: Gradient within the same colour family only, light to deep, top to bottom.
 * Never a flat solid, never a multi-colour rainbow gradient.
 */
export function getSameFamilyBlueGradient(): {
  background: string;
  WebkitBackgroundClip: string;
  WebkitTextFillColor: string;
  filter: string;
} {
  return {
    background: "linear-gradient(180deg, #93C5FD 0%, #3B82F6 45%, #1D4ED8 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    filter: "drop-shadow(0px 2px 8px rgba(59, 130, 246, 0.35))",
  };
}

/**
 * Generates custom single-family gradient styling for prop overrides.
 */
export function createSameColorGradient(
  lightTone: string,
  deepTone: string,
  glowTone: string
): {
  background: string;
  WebkitBackgroundClip: string;
  WebkitTextFillColor: string;
  filter: string;
} {
  return {
    background: `linear-gradient(180deg, ${lightTone} 0%, ${deepTone} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    filter: `drop-shadow(0px 2px 8px ${glowTone})`,
  };
}
