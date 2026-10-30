import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { CompositionElement } from "../types/scene-plan";
import { AnimatedDiagram, MotionGraph } from "./AnimatedDiagram";

/**
 * Phase 3 draft: generic, data-driven composition renderer.
 * Reads compositionElements from a ScenePlanItem and renders them in layer order,
 * with frame-based entrances and exits. No card is forced here.
 * If elements is empty, this renders nothing, and the caller must fall back to Full Speaker.
 * This is a DRAFT. Antigravity must verify it renders in Remotion, and that old card fallback still works.
 * Do not delete old cards because this file exists.
 */
export interface GenericCompositionProps {
  elements: CompositionElement[];
  sceneStartFrame: number;
  sansFontFamily?: string;
  scriptFontFamily?: string;
}

export const GenericComposition: React.FC<GenericCompositionProps> = ({
  elements,
  sceneStartFrame,
  sansFontFamily,
  scriptFontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!elements || elements.length === 0) {
    return null;
  }

  const sorted = [...elements].sort((a, b) => a.layer - b.layer);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {sorted.map((el) => {
        const relStart = el.startFrame !== undefined && el.startFrame >= sceneStartFrame ? el.startFrame - sceneStartFrame : el.startFrame ?? 0;
        const relEnd = el.endFrame !== undefined && el.endFrame >= sceneStartFrame ? el.endFrame - sceneStartFrame : el.endFrame;
        const isVisible = frame >= relStart && (relEnd === undefined || frame < relEnd);
        if (!isVisible) return null;

        const entrance = el.entrance || "fade";
        let opacity = 1;
        let scale = 1;
        let translateY = 0;
        if (entrance === "pop") {
          scale = spring({ frame: frame - relStart, fps, config: { damping: 15, stiffness: 110, mass: 0.7 } });
          opacity = interpolate(frame - relStart, [0, 8], [0, 1], { extrapolateRight: "clamp" });
        } else if (entrance === "fade") {
          opacity = interpolate(frame - relStart, [0, 10], [0, 1], { extrapolateRight: "clamp" });
        } else if (entrance === "slide") {
          translateY = interpolate(frame - relStart, [0, 12], [20, 0], { extrapolateRight: "clamp" });
          opacity = interpolate(frame - relStart, [0, 10], [0, 1], { extrapolateRight: "clamp" });
        } else if (entrance === "zoom") {
          scale = interpolate(frame - relStart, [0, 15], [0.9, 1], { extrapolateRight: "clamp" });
          opacity = interpolate(frame - relStart, [0, 10], [0, 1], { extrapolateRight: "clamp" });
        }

        // Exit fade over the last 9 frames, about 0.30s at 30fps, if an end frame is known.
        if (relEnd !== undefined && frame >= relEnd - 9) {
          opacity = interpolate(frame, [relEnd - 9, relEnd], [opacity, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        }

        const style: React.CSSProperties = {
          position: "absolute",
          left: `${el.xPercent}%`,
          top: `${el.yPercent}%`,
          width: `${el.widthPercent}%`,
          height: `${el.heightPercent}%`,
          zIndex: el.layer,
          opacity,
          transform: `scale(${scale}) translateY(${translateY}px)`,
          color: el.color || "#0F172A",
          background: el.background || "transparent",
          fontFamily: el.kind === "text" ? sansFontFamily || "Nexa, sans-serif" : sansFontFamily || "Nexa, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          boxSizing: "border-box",
          padding: 12,
          borderRadius: 16,
        };

        if (el.kind === "diagram") {
          // Diagram elements use AnimatedDiagram, not a static box. Text is split by | into nodes.
          const nodes = (el.text || "").split("|").map((label) => ({ label: label.trim() })).filter((n) => n.label);
          return (
            <div key={el.id} style={style}>
              <AnimatedDiagram nodes={nodes} durationFrames={relEnd !== undefined ? relEnd - relStart : 90} color={el.color || "#2563EB"} />
            </div>
          );
        }
        if (el.kind === "chart") {
          // Chart elements use MotionGraph with values from text, comma separated numbers.
          const values = (el.text || "").split(",").map((v) => parseFloat(v.trim())).filter((v) => !isNaN(v));
          return (
            <div key={el.id} style={style}>
              <MotionGraph values={values.length > 0 ? values : [30, 60, 90]} color={el.color || "#2563EB"} durationFrames={relEnd !== undefined ? relEnd - relStart : 90} />
            </div>
          );
        }
        if (el.kind === "image" || el.kind === "object") {
          if (!el.src) return null;
          return (
            <div key={el.id} style={style}>
              <img src={el.src} alt={el.text || ""} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 12 }} />
              {el.text ? <span style={{ marginLeft: 8, fontFamily: scriptFontFamily || "Instrument Serif, serif" }}>{el.text}</span> : null}
            </div>
          );
        }

        // text, shape, diagram, timeline, chart, card (as a generic box, not a specific old card)
        return (
          <div key={el.id} style={style}>
            <span style={{ fontSize: 28, lineHeight: 1.3 }}>{el.text || ""}</span>
          </div>
        );
      })}
    </div>
  );
};
