import React from "react";
import { Sequence } from "remotion";
import { SoundCue, SoundFamily } from "../types/sound";
import { SoundCuePlayer } from "./SoundCuePlayer";

export interface SoundTracksProps {
  cues: SoundCue[];
}

const FAMILIES: SoundFamily[] = ["WHOOSHES", "TEXTURES", "RISERS", "HITS", "MUSIC"];

/**
 * 5 Dedicated Sound Tracks Component per Sound-Design-Training.md Section B2:
 * - Separate tracks for: WHOOSHES · TEXTURES · RISERS · HITS · MUSIC.
 * - Never chops different sound families onto one layer.
 * - Places cues at precise frames.
 */
export const SoundTracks: React.FC<SoundTracksProps> = ({ cues }) => {
  return (
    <>
      {FAMILIES.map((family) => {
        const familyCues = cues.filter((c) => c.family === family);

        return (
          <div key={family} data-track={family}>
            {familyCues.map((cue) => (
              <Sequence
                key={cue.id}
                from={cue.frame}
                name={`${family}: ${cue.filename}`}
              >
                <SoundCuePlayer cue={cue} />
              </Sequence>
            ))}
          </div>
        );
      })}
    </>
  );
};
