import { Composition } from "remotion";
import { TemplateComposition } from "./composition/TemplateComposition";
import { ScenePlanItem } from "./types/scene-plan";

const DEFAULT_DURATION_FRAMES = 300; // 10s @ 30fps generic starter duration

export const Root = () => {
  return (
    <>
      {/* Primary 1080x1920 vertical composition */}
      <Composition
        id="VideoTemplate"
        component={TemplateComposition}
        durationInFrames={DEFAULT_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          scenes: [] as ScenePlanItem[],
          voiceTrackSrc: "",
        }}
      />

      {/* Secondary 720x1280 vertical composition */}
      <Composition
        id="VideoTemplate720p"
        component={TemplateComposition}
        durationInFrames={DEFAULT_DURATION_FRAMES}
        fps={30}
        width={720}
        height={1280}
        defaultProps={{
          scenes: [] as ScenePlanItem[],
          voiceTrackSrc: "",
        }}
      />
    </>
  );
};
