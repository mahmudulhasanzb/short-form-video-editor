import React from "react";
import { AbsoluteFill, Img, Sequence, Video, useCurrentFrame } from "remotion";
import type { ScenePlan } from "@sfe/contracts";
import { requireAsset } from "./types";
import { getVisualElementStyle } from "./visualElementStyle";
import { getVisualElementMotionStyle } from "./visual-element-motion";

type Alternative = ScenePlan["scenes"][number]["visual"]["alternatives"][number];

export const VisualLayer: React.FC<{
  alternative: Alternative | undefined;
  assets: Record<string, string>;
  sceneDurationFrames: number;
}> = ({ alternative, assets, sceneDurationFrames }) => {
  const frame = useCurrentFrame();
  if (!alternative) return null;

  return (
    <AbsoluteFill>
      {alternative.elements.map((element) => {
        const base = getVisualElementStyle(element);
        const motion = getVisualElementMotionStyle(frame, sceneDurationFrames, element.rotation, element.motion);
        const animatedStyle = { ...base, ...motion };

        if (element.kind === "image" || element.kind === "icon") {
          return (
            <Img
              key={element.id}
              src={requireAsset(assets, element.assetId!, `visual element "${element.id}"`)}
              style={{
                ...animatedStyle,
                objectFit: (element.style?.objectFit as React.CSSProperties["objectFit"]) ?? "contain",
              }}
            />
          );
        }

        if (element.kind === "video") {
          const from = element.timelineStartFrame ?? 0;
          const end = element.timelineEndFrame ?? sceneDurationFrames;
          return (
            <Sequence key={element.id} from={from} durationInFrames={end - from} layout="none">
              <Video
                src={requireAsset(assets, element.assetId!, `video visual element "${element.id}"`)}
                startFrom={element.mediaStartFrame ?? 0}
                endAt={element.mediaEndFrame}
                style={{
                  ...animatedStyle,
                  objectFit: (element.style?.objectFit as React.CSSProperties["objectFit"]) ?? "cover",
                }}
              />
            </Sequence>
          );
        }

        if (element.kind === "line") {
          return (
            <div
              key={element.id}
              style={{
                ...animatedStyle,
                height: Number(element.style?.lineThickness ?? 4),
                background: String(element.style?.background ?? element.style?.color ?? "#ffffff"),
              }}
            />
          );
        }

        if (element.kind === "shape") {
          return <div key={element.id} style={animatedStyle} />;
        }

        return (
          <div
            key={element.id}
            style={{
              ...animatedStyle,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "pre-wrap",
              textAlign: "center",
              overflowWrap: "anywhere",
            }}
          >
            {element.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
