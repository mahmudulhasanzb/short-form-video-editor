import React from "react";
import { useCurrentFrame } from "remotion";
import { ScenePlanItem, validateScenePlanItem } from "../types/scene-plan";
import { FullSpeaker } from "../layouts/FullSpeaker";
import { SplitLayout } from "../layouts/SplitLayout";
import { FullCanvas } from "../layouts/FullCanvas";
import { ModeATalkingCaption } from "../captions/ModeATalkingCaption";
import { ModeBStatementLockup } from "../captions/ModeBStatementLockup";
import { UICardLifespan } from "../motion/UICardLifespan";
import { GenericComposition } from "./GenericComposition";

// UI Card Components
import { DarkGlassNumberedPill } from "../cards/DarkGlassNumberedPill";
import { BeginnerProSlider } from "../cards/BeginnerProSlider";
import { TiltedMockupCard } from "../cards/TiltedMockupCard";
import { BrowserWindowMockup } from "../cards/BrowserWindowMockup";
import { TimelineCard } from "../cards/TimelineCard";
import { SoundWaveCard } from "../cards/SoundWaveCard";
import { ProductLogoCard } from "../cards/ProductLogoCard";
import { LoadingSegmentsCard } from "../cards/LoadingSegmentsCard";
import { ColorSwatchesCard } from "../cards/ColorSwatchesCard";
import { DashedBadgeCard } from "../cards/DashedBadgeCard";
import { GlossyPlayCard } from "../cards/GlossyPlayCard";
import { SoundPadMatrixCard } from "../cards/SoundPadMatrixCard";

export interface SceneRendererProps {
  scene: ScenePlanItem;
}

/**
 * Renders any generic scene based on a validated ScenePlanItem.
 * Automatically selects layout, caption mode, motion entrance, and UI card component.
 */
export const SceneRenderer: React.FC<SceneRendererProps> = ({ scene }) => {
  // Validate scene plan first
  const validation = validateScenePlanItem(scene);
  if (!validation.isValid) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#7F1D1D",
          color: "#FFFFFF",
          padding: 60,
          boxSizing: "border-box",
          fontFamily: "monospace",
          fontSize: 24,
        }}
      >
        <h2>Scene Plan Validation Errors (Scene #{scene.sceneNumber})</h2>
        <ul>
          {validation.errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      </div>
    );
  }

  // Phase 3: render a generic composition if compositionElements are present.
  // This does NOT delete old cards. If elements are present, they win over a forced card.
  // If elements are absent, the old card switch below is the fallback.
  const renderGenericComposition = () => {
    if (!scene.compositionElements || scene.compositionElements.length === 0) return null;
    return (
      <GenericComposition
        elements={scene.compositionElements}
        sceneStartFrame={scene.startFrame}
        sansFontFamily={scene.sansFontFamily}
        scriptFontFamily={scene.scriptFontFamily}
      />
    );
  };

  const hasVisualArtifact = () => {
    const hasCard = scene.uiCardNeed !== undefined && scene.uiCardNeed !== null && scene.uiCardNeed !== "none";
    const hasElements = Array.isArray(scene.compositionElements) && scene.compositionElements.length > 0;
    const hasSource = Boolean(scene.sourceReference?.fileName);
    const hasComposition = scene.compositionType !== undefined && scene.compositionType !== null && scene.compositionType !== "none";
    return hasCard || hasElements || hasSource || hasComposition;
  };

  // Render UI Card component if requested
  const renderUICard = () => {
    const props = (scene.uiCardProps || {}) as Record<string, unknown>;

    let cardElement: React.ReactNode = null;

    switch (scene.uiCardNeed) {
      case "DarkGlassNumberedPill":
        cardElement = (
          <DarkGlassNumberedPill
            steps={(props.steps as (number | string)[]) || []}
            sceneStartFrame={scene.startFrame}
            {...props}
          />
        );
        break;
      case "BeginnerProSlider":
        cardElement = <BeginnerProSlider {...props} />;
        break;
      case "TiltedMockupCard":
        cardElement = <TiltedMockupCard {...props} />;
        break;
      case "BrowserWindowMockup":
        cardElement = <BrowserWindowMockup title="" {...props} />;
        break;
      case "TimelineCard":
        cardElement = <TimelineCard {...props} />;
        break;
      case "SoundWaveCard":
        cardElement = <SoundWaveCard {...props} />;
        break;
      case "ProductLogoCard":
        cardElement = <ProductLogoCard title="" {...props} />;
        break;
      case "LoadingSegmentsCard":
        cardElement = <LoadingSegmentsCard {...props} />;
        break;
      case "ColorSwatchesCard":
        cardElement = <ColorSwatchesCard swatches={[]} {...props} />;
        break;
      case "DashedBadgeCard":
        cardElement = (
          <DashedBadgeCard
            sceneStartFrame={scene.startFrame}
            {...props}
          />
        );
        break;
      case "GlossyPlayCard":
        cardElement = <GlossyPlayCard {...props} />;
        break;
      case "SoundPadMatrixCard":
        cardElement = <SoundPadMatrixCard {...props} />;
        break;
      case "none":
      default:
        return null;
    }

    if (!cardElement) return null;

    // Calculate relative startFrame and endFrame for UI card
    let relCardStart = 2;
    let relCardEnd: number | undefined = undefined;

    if (scene.uiCardStartFrame !== undefined && scene.uiCardStartFrame !== null) {
      relCardStart =
        scene.uiCardStartFrame >= scene.startFrame
          ? scene.uiCardStartFrame - scene.startFrame
          : scene.uiCardStartFrame;
    }

    if (scene.uiCardEndFrame !== undefined && scene.uiCardEndFrame !== null) {
      relCardEnd =
        scene.uiCardEndFrame >= scene.startFrame
          ? scene.uiCardEndFrame - scene.startFrame
          : scene.uiCardEndFrame;
    }

    // Wrap with UICardLifespan (Apple-style entrance, topic lifespan, smooth exit)
    return (
      <UICardLifespan startFrame={relCardStart} endFrame={relCardEnd}>
        {cardElement}
      </UICardLifespan>
    );
  };

  // Render Caption based on captionMode and background contrast variant
  const renderCaption = (
    variant: "dark-bg" | "light-bg" = "dark-bg",
    customFontSize?: number,
    customHighlightFontSize?: number
  ) => {
    if (scene.captionMode === "Mode A") {
      return (
        <ModeATalkingCaption
          chunks={scene.captionChunks}
          tokens={scene.captionTokens}
          sceneStartFrame={scene.startFrame}
          variant={variant}
          fontSize={customFontSize || scene.fontSize}
          highlightFontSize={customHighlightFontSize || scene.highlightFontSize}
          sansFontFamily={scene.sansFontFamily}
          scriptFontFamily={scene.scriptFontFamily}
        />
      );
    }

    if (scene.captionMode === "Mode B") {
      const title = scene.captionTokens || scene.captionText || scene.mainFocus;
      return (
        <ModeBStatementLockup
          title={title}
          fontSize={customFontSize || scene.fontSize}
          highlightFontSize={customHighlightFontSize || scene.highlightFontSize}
          sansFontFamily={scene.sansFontFamily}
          scriptFontFamily={scene.scriptFontFamily}
        />
      );
    }

    return null;
  };

  // Resolve effective speaker source from scene props
  const effectiveSpeakerSrc = scene.speakerSrc || "";

  // 1. Layout: Full Speaker (Dark background, white text)
  if (scene.layoutType === "Full Speaker") {
    return (
      <FullSpeaker
        speakerSrc={effectiveSpeakerSrc}
        startFrom={scene.startFrame}
        muted={true}
        lowerThird={
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            {renderCaption("dark-bg")}
            {renderUICard()}
          </div>
        }
      />
    );
  }

  /**
   * GLOBAL RULE: Never leave a 50/50 Split screen blank.
   * Layout is per beat, not fixed per scene. Use 50/50 Split only for a beat that has a relevant
   * UI card, a sourceReference file, or other relevant visual in the top canvas. Captions alone do not justify a split.
   * If a beat has no relevant card or source, return to Full Speaker for that beat.
   * When returning to Full Speaker, use Full Speaker styling: captions white (#FFFFFF) on the dark background,
   * normal 52px, highlighted 84px, weight 600, full face and shoulders visible.
   * Switch only at a chunk boundary, never mid-word, with no blank frame in between. Use the existing card exit (0.30s) before the switch.
   * Full Canvas scenes are not affected, because the Mode B headline is the visual there.
   */
  if (scene.layoutType === "50/50 Split") {
    const frame = useCurrentFrame();
    const hasSource = Boolean(scene.sourceReference?.fileName);
    let relCardEnd: number | undefined = undefined;

    if (scene.uiCardEndFrame !== undefined && scene.uiCardEndFrame !== null) {
      relCardEnd =
        scene.uiCardEndFrame >= scene.startFrame
          ? scene.uiCardEndFrame - scene.startFrame
          : scene.uiCardEndFrame;
    }

    // Phase 3 blank-split fix: if composition elements exist, use their latest end frame as the visual end.
    if (scene.compositionElements && scene.compositionElements.length > 0) {
      const ends = scene.compositionElements
        .map((el) => (el.endFrame !== undefined && el.endFrame !== null ? (el.endFrame >= scene.startFrame ? el.endFrame - scene.startFrame : el.endFrame) : undefined))
        .filter((v): v is number => v !== undefined);
      if (ends.length > 0) {
        relCardEnd = Math.max(...ends);
      }
    }

    // Phase 3 blank-split fix, part 1: no visual artifact at all, never enter Split.
    // This also covers the old bug where a Split with no card end frame and no source could enter Split with an empty top.
    if (!hasVisualArtifact()) {
      return (
        <FullSpeaker
          speakerSrc={effectiveSpeakerSrc}
          startFrom={scene.startFrame}
          muted={true}
          lowerThird={
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              {renderCaption("dark-bg", 52, 84)}
            </div>
          }
        />
      );
    }

    // Dynamic runtime guard: if the card has finished its topic and exited, and no sourceReference
    // is present, dynamically return to Full Speaker with white text so the canvas is NEVER left blank!
    if (!hasSource && relCardEnd !== undefined && frame >= relCardEnd) {
      return (
        <FullSpeaker
          speakerSrc={effectiveSpeakerSrc}
          startFrom={scene.startFrame}
          muted={true}
          lowerThird={
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              {renderCaption("dark-bg", 52, 84)}
            </div>
          }
        />
      );
    }

    return (
      <SplitLayout
        speakerSrc={effectiveSpeakerSrc}
        startFrom={scene.startFrame}
        muted={true}
        cropMeasurements={scene.splitPersonCrop}
        canvasVariant={scene.canvasVariant || "warm-grid"}
        topGraphicContent={
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 24,
            }}
          >
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
              {renderGenericComposition() || renderUICard()}
            </div>
            {renderCaption("light-bg")}
          </div>
        }
      />
    );
  }

  // 3. Layout: 100% Full Canvas (Light warm-grid canvas -> Dark Navy text)
  return (
    <FullCanvas
      variant={scene.canvasVariant || "warm-grid"}
      statementLockup={scene.captionMode === "Mode B" ? renderCaption("light-bg") : undefined}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, width: "100%" }}>
        {renderGenericComposition() || renderUICard()}
        {scene.captionMode === "Mode A" && renderCaption("light-bg")}
      </div>
    </FullCanvas>
  );
};
