import React from "react";
import { SoundPadMatrixCardProps, SoundPadItem } from "../types/ui-cards";
import { FONT_FAMILIES } from "../theme/fonts";

const DEFAULT_PADS: SoundPadItem[] = [
  { id: "1", label: "text", iconType: "bar" },
  { id: "2", label: "key", iconType: "key" },
  { id: "3", label: "land", iconType: "land" },
  { id: "4", label: "whoosh", iconType: "whoosh" },
  { id: "5", label: "", iconType: "snap", isActive: true }, // Master pad in center
  { id: "6", label: "snap", iconType: "snap" },
  { id: "7", label: "hit", iconType: "hit" },
  { id: "8", label: "tick", iconType: "tick" },
  { id: "9", label: "pop", iconType: "pop" },
];

/**
 * 3x3 Sound Pad Matrix Card per Video 2 Frame 09:
 * - 9 glowing sound category trigger pads.
 * - Center master pad in solid bright blue.
 * - Icon and waveform snippet in each pad.
 */
export const SoundPadMatrixCard: React.FC<SoundPadMatrixCardProps> = ({
  pads = DEFAULT_PADS,
  centerMasterLabel = "",
  glowColor = "#3B82F6",
  width = 540,
  height = 540,
  style,
}) => {
  return (
    <div
      style={{
        width,
        height,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {pads.map((pad, idx) => {
        const isCenter = idx === 4 || pad.isActive;

        return (
          <div
            key={pad.id}
            style={{
              backgroundColor: isCenter ? "#2563EB" : "#0F172A",
              borderRadius: 20,
              border: isCenter
                ? "2px solid #60A5FA"
                : `1.5px solid ${glowColor}60`,
              boxShadow: isCenter
                ? `0 0 24px ${glowColor}80`
                : `0 8px 20px rgba(0,0,0,0.4)`,
              padding: 14,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              boxSizing: "border-box",
            }}
          >
            {/* Pad Label */}
            <div
              style={{
                fontFamily: FONT_FAMILIES.sans,
                fontSize: 14,
                fontWeight: 600,
                color: "#FFFFFF",
                alignSelf: isCenter ? "center" : "flex-start",
              }}
            >
              {isCenter ? centerMasterLabel : pad.label}
            </div>

            {/* Icon Graphic */}
            <div
              style={{
                width: 32,
                height: 14,
                borderRadius: 4,
                backgroundColor: isCenter ? "rgba(255,255,255,0.4)" : "#FFFFFF",
              }}
            />

            {/* Mini Waveform Graphic at Bottom */}
            <div
              style={{
                width: "80%",
                height: 6,
                borderRadius: 3,
                backgroundColor: isCenter ? "#FFFFFF" : glowColor,
                opacity: 0.8,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
