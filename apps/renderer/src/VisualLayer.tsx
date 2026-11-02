import React from "react";
import { AbsoluteFill, Img } from "remotion";
import type { ScenePlan } from "@sfe/contracts";
import { requireAsset } from "./types";

type Alternative = ScenePlan["scenes"][number]["visual"]["alternatives"][number];

export const VisualLayer: React.FC<{
  alternative: Alternative | undefined;
  assets: Record<string, string>;
}> = ({ alternative, assets }) => {
  if (!alternative) return null;

  return (
    <AbsoluteFill>
      {alternative.elements.map((element) => {
        const base: React.CSSProperties = {
          position: "absolute",
          left: `${element.x}%`,
          top: `${element.y}%`,
          width: `${element.width}%`,
          height: `${element.height}%`,
          zIndex: element.zIndex,
          opacity: element.opacity,
          transform: `rotate(${element.rotation}deg)`,
          boxSizing: "border-box",
          overflow: "hidden",
          ...element.style as React.CSSProperties,
        };

        if (element.kind === "image" || element.kind === "icon") {
          return (
            <Img
              key={element.id}
              src={requireAsset(assets, element.assetId!, `visual element "${element.id}"`)}
              style={{ ...base, objectFit: "contain" }}
            />
          );
        }

        if (element.kind === "line") {
          return <div key={element.id} style={{ ...base, height: Math.max(2, element.height), background: "currentColor" }} />;
        }

        if (element.kind === "shape") {
          return <div key={element.id} style={base} />;
        }

        return (
          <div key={element.id} style={{ ...base, display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "pre-wrap" }}>
            {element.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
