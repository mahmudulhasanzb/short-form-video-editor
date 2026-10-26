import { staticFile } from "remotion";
import { SoundFamily, SOUND_LEVELS_DB } from "../types/sound";

/**
 * Real SFX Library Folders in assets/sound-effects/
 * Source: Sound-Design-Training.md Section A0
 */
export const SFX_FOLDERS = [
  "ambience",
  "kicks-impacts",
  "misc",
  "risers",
  "whooshes",
] as const;

export type SfxFolder = (typeof SFX_FOLDERS)[number];

export interface SoundResolution {
  url: string;
  isAvailable: boolean;
  defaultDb: number;
  flagMessage?: string;
}

/**
 * Resolves static sound assets deterministically from public/sound-effects/.
 * Strictly flags missing files by name without silent substitution.
 */
export function resolveSoundAsset(
  family: SoundFamily,
  relativeFilePath: string
): SoundResolution {
  // Determine standard dB level per family
  let defaultDb: number = SOUND_LEVELS_DB.WHOOSH_DEFAULT;
  switch (family) {
    case "WHOOSHES":
      defaultDb = SOUND_LEVELS_DB.WHOOSH_DEFAULT; // -12 dB
      break;
    case "TEXTURES":
      defaultDb = SOUND_LEVELS_DB.TEXTURE_STANDARD; // -7 dB
      break;
    case "RISERS":
      defaultDb = SOUND_LEVELS_DB.RISER; // -5 dB
      break;
    case "HITS":
      defaultDb = SOUND_LEVELS_DB.HIT; // -5 dB
      break;
    case "MUSIC":
      defaultDb = SOUND_LEVELS_DB.MUSIC; // -19 dB
      break;
  }

  // Normalize path to point inside public/sound-effects/
  const cleanPath = relativeFilePath.startsWith("sound-effects/")
    ? relativeFilePath
    : `sound-effects/${relativeFilePath.replace(/^(\.\/|\/)/, "")}`;

  try {
    const url = staticFile(cleanPath);
    return {
      url,
      isAvailable: true,
      defaultDb,
    };
  } catch (err) {
    const flagMessage = `[MISSING SOUND FILE] Sound file "${relativeFilePath}" in family "${family}" could not be resolved. Never substitute a different sound silently!`;
    console.error(flagMessage, err);
    return {
      url: "",
      isAvailable: false,
      defaultDb,
      flagMessage,
    };
  }
}
