import React from "react";
import { useCurrentFrame } from "remotion";

export interface CameraTrackTypingProps {
  /** Text to type out character by character */
  text: string;
  /** Frame at which typing begins */
  startFrame?: number;
  /** Frames per character (default: 2 frames per character at 30fps) */
  framesPerChar?: number;
  /** Command prefix (e.g. "> ") */
  prefix?: string;
  /** Whether to show active blinking/solid block cursor (default: true) */
  showCursor?: boolean;
  style?: React.CSSProperties;
}

/**
 * Camera Tracks Text Writing Component per visual-direction-draft.md Section 4:
 * - Types text out character by character.
 * - Solid white block cursor follows the active writing head.
 * - Frame-based only: Driven by useCurrentFrame().
 */
export const CameraTrackTyping: React.FC<CameraTrackTypingProps> = ({
  text,
  startFrame = 0,
  framesPerChar = 2,
  prefix = "> ",
  showCursor = true,
  style,
}) => {
  const frame = useCurrentFrame();

  const elapsed = Math.max(0, frame - startFrame);
  const charCount = Math.min(text.length, Math.floor(elapsed / framesPerChar));
  const visibleText = text.slice(0, charCount);
  const isTyping = charCount < text.length;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSize: 20,
        color: "#E2E8F0",
        whiteSpace: "pre-wrap",
        ...style,
      }}
    >
      <span>{prefix}</span>
      <span>{visibleText}</span>
      {showCursor && (
        <span
          style={{
            display: "inline-block",
            width: 12,
            height: 22,
            backgroundColor: "#FFFFFF",
            marginLeft: 2,
            verticalAlign: "middle",
            opacity: isTyping || Math.floor(frame / 15) % 2 === 0 ? 1 : 0,
          }}
        />
      )}
    </div>
  );
};
