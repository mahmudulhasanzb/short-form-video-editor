import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { DarkGlassNumberedPillProps } from "../types/ui-cards";
import { FONT_FAMILIES } from "../theme/fonts";

export interface ExtendedDarkGlassNumberedPillProps extends DarkGlassNumberedPillProps {
  label?: string;
}

/**
 * Dark Glass Numbered Pill per visual-direction-draft.md Section 1, 3, 5:
 * - Rounded pill container with dark translucent glass background and soft shadow.
 * - Connected circular numbered nodes for chapter structure preview and tracking.
 * - Dynamic activeStepTimeline drives active step transitions frame-by-frame.
 * - Spring pop per active step (scale 1.0 -> 1.25 -> 1.0).
 * - Previous steps dimmed (opacity 0.50, muted dark slate background, no glow).
 * - Active step highlighted with pure white fill, dark navy typography, and bright halo glow.
 * - Upcoming steps hollow dashed with accent color.
 */
export const DarkGlassNumberedPill: React.FC<ExtendedDarkGlassNumberedPillProps> = ({
  steps = [],
  activeStep = 1,
  activeStepTimeline,
  sceneStartFrame = 0,
  allCompleted = false,
  accentColor = "#3B82F6",
  label,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Determine current active step from timeline if provided
  let currentActiveStep = activeStep;
  const normalizedTimeline: { step: number; relStart: number; relEnd: number }[] = [];

  if (activeStepTimeline && activeStepTimeline.length > 0) {
    activeStepTimeline.forEach((entry) => {
      const relStart =
        entry.startFrame >= sceneStartFrame
          ? entry.startFrame - sceneStartFrame
          : entry.startFrame;
      const relEnd =
        entry.endFrame >= sceneStartFrame
          ? entry.endFrame - sceneStartFrame
          : entry.endFrame;
      normalizedTimeline.push({ step: entry.step, relStart, relEnd });
    });

    // Sort by relStart
    normalizedTimeline.sort((a, b) => a.relStart - b.relStart);

    // Find current active step based on frame
    if (normalizedTimeline.length > 0) {
      if (frame < normalizedTimeline[0].relStart) {
        currentActiveStep = normalizedTimeline[0].step;
      } else {
        for (let i = 0; i < normalizedTimeline.length; i++) {
          const curr = normalizedTimeline[i];
          const next = normalizedTimeline[i + 1];
          if (next) {
            if (frame >= curr.relStart && frame < next.relStart) {
              currentActiveStep = curr.step;
              break;
            }
          } else {
            if (frame >= curr.relStart) {
              currentActiveStep = curr.step;
              break;
            }
          }
        }
      }
    }
  }

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        ...style,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(15, 23, 42, 0.88)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderRadius: 9999,
          padding: "14px 28px",
          boxShadow: "0 16px 36px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.12)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        {steps.map((step, idx) => {
          const stepNum = typeof step === "number" ? step : idx + 1;
          const isActive = currentActiveStep !== undefined && stepNum === currentActiveStep;
          const isPrevious = currentActiveStep !== undefined && stepNum < currentActiveStep;
          const isFirst = idx === 0;

          // Find relative start frame for this step to drive the spring pop
          const timelineEntry = normalizedTimeline.find((e) => e.step === stepNum);
          const stepStartFrame = timelineEntry ? timelineEntry.relStart : 0;
          const stepAge = frame - stepStartFrame;

          // Spring pop on step activation: scale 1.0 -> 1.25 -> 1.0
          const popSpring = spring({
            frame: Math.max(0, stepAge),
            fps,
            config: {
              damping: 12,
              stiffness: 180,
              mass: 0.6,
            },
          });

          const popScale = isActive
            ? interpolate(popSpring, [0, 0.45, 1], [1.0, 1.24, 1.0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1.0;

          return (
            <React.Fragment key={idx}>
              {/* Connecting baseline divider */}
              {!isFirst && (
                <div
                  style={{
                    width: 36,
                    height: 2,
                    backgroundColor: allCompleted
                      ? "#FFFFFF"
                      : isPrevious
                      ? "rgba(148, 163, 184, 0.35)"
                      : isActive
                      ? accentColor
                      : "rgba(255, 255, 255, 0.18)",
                    borderStyle: allCompleted || isPrevious || isActive ? "solid" : "dashed",
                    margin: "0 4px",
                  }}
                />
              )}

              {/* Circular step node */}
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT_FAMILIES.sans,
                  fontSize: 18,
                  fontWeight: isActive ? 800 : 600,
                  transform: `scale(${popScale})`,
                  // Active: pure bright white with glow
                  // Previous: dimmed dark slate, muted text, no glow
                  // Upcoming: hollow dashed accent border
                  backgroundColor: allCompleted || isActive
                    ? "#FFFFFF"
                    : isPrevious
                    ? "rgba(30, 41, 59, 0.75)"
                    : "transparent",
                  color: allCompleted || isActive
                    ? "#0F172A"
                    : isPrevious
                    ? "rgba(148, 163, 184, 0.60)"
                    : accentColor,
                  border:
                    allCompleted || isActive
                      ? "none"
                      : isPrevious
                      ? "1.5px solid rgba(148, 163, 184, 0.30)"
                      : `2px dashed ${accentColor}80`,
                  boxShadow:
                    allCompleted || isActive
                      ? "0 0 16px rgba(255, 255, 255, 0.70), 0 0 28px rgba(96, 165, 250, 0.40)"
                      : "none",
                  opacity: isPrevious ? 0.50 : 1.0,
                  transition: "none",
                }}
              >
                {step}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Contextual label chip */}
      {label && (
        <div
          style={{
            fontFamily: FONT_FAMILIES.sans,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#94A3B8",
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            padding: "4px 14px",
            borderRadius: 9999,
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
