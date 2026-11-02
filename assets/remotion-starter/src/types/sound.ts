export type SoundFamily =
  | "WHOOSHES"
  | "TEXTURES"
  | "RISERS"
  | "HITS"
  | "MUSIC";

export interface SoundCue {
  id: string;
  family: SoundFamily;
  /** Relative filename inside sound-effects folder, e.g. "whooshes/ES_Classic, Hollow, Low, Long - Epidemic Sound.mp3" */
  filename: string;
  /** Frame at which the sound starts or aligns */
  frame: number;
  /** Target volume level in dB (defaults to family standard if omitted) */
  targetDb?: number;
  /** Lead-in frames if cue aligns peak to event */
  leadFrames?: number;
  /** Optional description/notes */
  notes?: string;
  /** Phase 3: purpose linked to the visual event, shown in the plan. */
  purpose?: string;
  /** Phase 3: alternative filenames that fit the same event, for plan selection. */
  alternatives?: string[];
  /** Phase 3: true if the user explicitly selected this cue in the plan editor. */
  userSelected?: boolean;
}

export interface SoundTrackProps {
  cues: SoundCue[];
}

/** Standard sound level definitions in decibels per Sound-Design-Training.md */
export const SOUND_LEVELS_DB = {
  WHOOSH_DEFAULT: -12,
  WHOOSH_HEAVY: -10,
  TEXTURE_STANDARD: -7,
  TEXTURE_HOT: -6,
  RISER: -5,
  HIT: -5,
  MUSIC: -19,
  VOICE_ORIGINAL_MUTED: -100, // Linear volume 0
} as const;

/** Convert decibels to linear volume gain (0.0 to 1.0) */
export const dbToLinearVolume = (db: number): number => {
  if (db <= -60) return 0;
  return Math.pow(10, db / 20);
};
