import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export interface FontStatus {
  name: string;
  isAvailable: boolean;
  filePath?: string;
  flagMessage?: string;
  family: string;
}

/**
 * Fonts Audit and Availability Registry.
 *
 * Audit against assets/fonts/:
 * - Creato Display: MISSING from assets/fonts/.
 * - Nexa: AVAILABLE in assets/fonts/nexa/. Selected as Primary Sans replacement with weight compromise (ExtraLight for regular 400, Heavy for bold 700).
 * - Instrument Serif: AVAILABLE in assets/fonts/instrument_serif/ (Secondary Script / Highlight role).
 * - Heading Now: Removed from active role (display titling trial font under CC BY-NC).
 * - Playfair Display: Unassigned serif.
 * - Built Titling: Unassigned all-caps titling font.
 * - Bryson: Unassigned personal-use serif.
 */
export const FONTS_AUDIT: Record<string, FontStatus> = {
  CreatoDisplay: {
    name: "Creato Display",
    family: "Creato Display",
    isAvailable: false,
    flagMessage:
      "[MISSING FONT] 'Creato Display' was specified as Primary Sans in visual-direction-draft.md, but is MISSING from assets/fonts/. Replaced by present sans family 'Nexa' (ExtraLight/Heavy compromise).",
  },
  NexaExtraLight: {
    name: "Nexa ExtraLight (used as Regular 400)",
    family: "Nexa",
    isAvailable: true,
    filePath: "fonts/nexa/Nexa-ExtraLight.ttf",
  },
  NexaHeavy: {
    name: "Nexa Heavy (used as Bold 700)",
    family: "Nexa",
    isAvailable: true,
    filePath: "fonts/nexa/Nexa-Heavy.ttf",
  },
  InstrumentSerif: {
    name: "Instrument Serif",
    family: "Instrument Serif",
    isAvailable: true,
    filePath: "fonts/instrument_serif/InstrumentSerif-Regular.ttf",
  },
  InstrumentSerifItalic: {
    name: "Instrument Serif Italic",
    family: "Instrument Serif",
    isAvailable: true,
    filePath: "fonts/instrument_serif/InstrumentSerif-Italic.ttf",
  },
};

let fontsLoadedPromise: Promise<void> | null = null;

/**
 * Loads locked fonts deterministically from local static files using @remotion/fonts.
 * Flags missing fonts explicitly by name without silent substitution.
 */
export function loadProjectFonts(): Promise<void> {
  if (fontsLoadedPromise) {
    return fontsLoadedPromise;
  }

  // Explicitly warn about missing Creato Display
  if (!FONTS_AUDIT.CreatoDisplay.isAvailable) {
    console.warn(FONTS_AUDIT.CreatoDisplay.flagMessage);
  }

  const loadTasks: Promise<unknown>[] = [];

  try {
    // Primary Sans: Nexa (ExtraLight mapped to 400, Heavy mapped to 700)
    loadTasks.push(
      loadFont({
        family: "Nexa",
        url: staticFile("fonts/nexa/Nexa-ExtraLight.ttf"),
        weight: "400",
        style: "normal",
      })
    );
    loadTasks.push(
      loadFont({
        family: "Nexa",
        url: staticFile("fonts/nexa/Nexa-Heavy.ttf"),
        weight: "700",
        style: "normal",
      })
    );

    // Secondary Script / Highlight: Instrument Serif (Regular & Italic)
    loadTasks.push(
      loadFont({
        family: "Instrument Serif",
        url: staticFile("fonts/instrument_serif/InstrumentSerif-Regular.ttf"),
        weight: "400",
        style: "normal",
      })
    );
    loadTasks.push(
      loadFont({
        family: "Instrument Serif",
        url: staticFile("fonts/instrument_serif/InstrumentSerif-Italic.ttf"),
        weight: "400",
        style: "italic",
      })
    );
  } catch (err) {
    console.error("Failed to load local fonts:", err);
  }

  fontsLoadedPromise = Promise.all(loadTasks).then(() => undefined);
  return fontsLoadedPromise;
}

export const FONT_FAMILIES = {
  /** Primary Sans: Nexa (replaces missing Creato Display with ExtraLight/Heavy pair), with standard sans fallbacks */
  sans: '"Nexa", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  /** Secondary Script / Serif: Instrument Serif locked for highlighted words */
  script: '"Instrument Serif", Georgia, serif',
};
