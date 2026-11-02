import React, { useEffect, useRef } from "react";
import { Player, type CallbackListener, type PlayerRef } from "@remotion/player";
import type { ScenePlan } from "@sfe/contracts";
import { VideoComposition } from "../../renderer/src/VideoComposition";
import type { RenderInputProps } from "../../renderer/src/types";

export function PlanPreview({ plan, assets, frame, onFrameChange, playerRef, onPlaybackStateChange }: {
  plan: ScenePlan;
  assets: Record<string, string>;
  frame: number;
  onFrameChange: (frame: number) => void;
  playerRef: React.RefObject<PlayerRef | null>;
  onPlaybackStateChange: (playing: boolean) => void;
}) {
  const currentFrameRef = useRef(frame);
  const inputProps: RenderInputProps = { plan, assets };

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const onPlay: CallbackListener<"play"> = () => onPlaybackStateChange(true);
    const onPause: CallbackListener<"pause"> = () => onPlaybackStateChange(false);
    const onEnded: CallbackListener<"ended"> = () => onPlaybackStateChange(false);
    const onUpdate: CallbackListener<"frameupdate"> = (e) => {
      currentFrameRef.current = e.detail.frame;
      onFrameChange(e.detail.frame);
    };

    player.addEventListener("frameupdate", onUpdate);
    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);
    player.addEventListener("ended", onEnded);
    return () => {
      player.removeEventListener("frameupdate", onUpdate);
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
      player.removeEventListener("ended", onEnded);
    };
  }, [onFrameChange, onPlaybackStateChange]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || currentFrameRef.current === frame) return;

    player.seekTo(frame);
    currentFrameRef.current = frame;
  }, [frame]);

  return <Player
    ref={playerRef}
    component={VideoComposition}
    inputProps={inputProps}
    durationInFrames={plan.project.durationFrames}
    compositionWidth={plan.project.width}
    compositionHeight={plan.project.height}
    fps={plan.project.fps}
    initialFrame={frame}
    moveToBeginningWhenEnded
    clickToPlay
    style={{ width: "100%", height: "100%" }}
    acknowledgeRemotionLicense
  />;
}
