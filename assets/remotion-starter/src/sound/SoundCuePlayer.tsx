import React from "react";
import { Audio } from "@remotion/media";
import { SoundCue, dbToLinearVolume } from "../types/sound";
import { resolveSoundAsset } from "./sfx-manifest";

export interface SoundCuePlayerProps {
  cue: SoundCue;
}

/**
 * Sound Cue Player:
 * - Plays audio cue via @remotion/media <Audio>.
 * - Maps decibels to linear volume accurately.
 * - Flags missing files by name without silent substitution.
 */
export const SoundCuePlayer: React.FC<SoundCuePlayerProps> = ({ cue }) => {
  const resolution = resolveSoundAsset(cue.family, cue.filename);

  if (!resolution.isAvailable || !resolution.url) {
    return null;
  }

  const volumeDb = cue.targetDb !== undefined ? cue.targetDb : resolution.defaultDb;
  const linearVolume = dbToLinearVolume(volumeDb);

  return (
    <Audio
      src={resolution.url}
      volume={linearVolume}
    />
  );
};
