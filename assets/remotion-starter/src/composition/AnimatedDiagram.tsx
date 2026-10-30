import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

/**
 * Phase 3b: AnimatedDiagram and MotionGraph primitives.
 * These are NOT static text boxes. They animate a value, a line, or a node sequence
 * in time with the spoken beat, using frame-based interpolate only.
 */
export interface DiagramNode {
  label: string;
  /** 0 to 1 progress at which this node appears. */
  appearAt?: number;
}

export interface AnimatedDiagramProps {
  nodes: DiagramNode[];
  /** Optional values 0 to 100 for bar growth, in node order. */
  values?: number[];
  kind?: "nodes" | "bars" | "line";
  color?: string;
  sceneStartFrame?: number;
  durationFrames?: number;
}

export const AnimatedDiagram: React.FC<AnimatedDiagramProps> = ({ nodes, values, kind = "nodes", color = "#2563EB", durationFrames = 90 }) => {
  const frame = useCurrentFrame();
  const progress = durationFrames > 0 ? Math.min(1, Math.max(0, frame / durationFrames)) : 1;

  if (kind === "bars" && values) {
    return (
      <div style={{ display: "flex", gap: 16, alignItems: "flex-end", width: "100%", height: "100%" }}>
        {values.map((v, i) => {
          const h = interpolate(progress, [i / values.length, Math.min(1, (i + 1) / values.length)], [0, v], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ width: "100%", height: `${h}%`, maxHeight: "70%", background: color, borderRadius: 12, transition: "none" }} />
              <span style={{ fontSize: 20, color: "#0F172A", textAlign: "center" }}>{nodes[i]?.label || ""}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // nodes: sequential reveal with connecting line drawing
  const lineProgress = interpolate(progress, [0, 1], [0, 100]);
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
      <div style={{ height: 6, background: "rgba(15,23,42,0.12)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${lineProgress}%`, height: "100%", background: color }} />
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        {nodes.map((n, i) => {
          const appear = n.appearAt ?? (nodes.length > 1 ? i / (nodes.length - 1) : 0);
          const visible = progress >= appear;
          const opacity = interpolate(progress, [appear, Math.min(1, appear + 0.15)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const translateY = interpolate(progress, [appear, Math.min(1, appear + 0.15)], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          if (!visible && progress < appear) return null;
          return (
            <div key={i} style={{ opacity, transform: `translateY(${translateY}px)`, padding: "12px 16px", borderRadius: 14, background: "rgba(255,255,255,0.95)", boxShadow: "0 8px 24px rgba(15,23,42,0.12)", fontSize: 22, color: "#0F172A", textAlign: "center" }}>
              {n.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export interface MotionGraphProps {
  title?: string;
  values: number[];
  labels?: string[];
  color?: string;
  durationFrames?: number;
}

export const MotionGraph: React.FC<MotionGraphProps> = ({ title, values, labels, color = "#2563EB", durationFrames = 90 }) => {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 12, padding: 12, boxSizing: "border-box" }}>
      {title ? <div style={{ fontSize: 24, fontWeight: 700, color: "#0F172A", textAlign: "center" }}>{title}</div> : null}
      <AnimatedDiagram nodes={(labels || values.map((_, i) => `Step ${i + 1}`)).map((label) => ({ label }))} values={values} kind="bars" color={color} durationFrames={durationFrames} />
    </div>
  );
};
