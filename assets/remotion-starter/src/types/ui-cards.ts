export interface ActiveStepTimelineEntry {
  step: number;
  startFrame: number;
  endFrame: number;
}

export interface DarkGlassNumberedPillProps {
  /** Array of step numbers or labels */
  steps: (number | string)[];
  /** Currently active step (1-indexed) */
  activeStep?: number;
  /** Timeline-driven active step schedule */
  activeStepTimeline?: ActiveStepTimelineEntry[];
  /** Scene start frame for relative timeline resolution */
  sceneStartFrame?: number;
  /** Whether all steps are completed (recap mode) */
  allCompleted?: boolean;
  /** Custom outline color */
  accentColor?: string;
  /** Container styling overrides */
  style?: React.CSSProperties;
}

export interface BeginnerProSliderProps {
  /** Left label */
  leftLabel?: string;
  /** Right label */
  rightLabel?: string;
  /** Progress percentage 0 to 100 */
  progressPercent?: number;
  /** Whether to display mouse cursor pointer clicking the thumb (default: true) */
  showCursor?: boolean;
  /** Slider fill gradient start (default: #3B82F6) */
  gradientStart?: string;
  /** Slider fill gradient end (default: #1D4ED8) */
  gradientEnd?: string;
  style?: React.CSSProperties;
}

export interface TiltedMockupCardProps {
  /** Card image or video content source */
  contentSrc?: string;
  /** Custom inner component if not static image */
  children?: React.ReactNode;
  /** Rotation angle in degrees (default: 3) */
  rotationDeg?: number;
  /** Border radius in pixels (default: 24) */
  borderRadius?: number;
  /** Nested sub-card thumbnails along bottom */
  subCardThumbnails?: string[];
  /** Sub-card glowing border color (default: #F97316) */
  subCardGlowColor?: string;
  /** Card dimensions */
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export interface BrowserWindowMockupProps {
  /** Window header title (e.g. "tessel-launch · timeline" or "Claude Code") */
  title: string;
  /** Right corner badge pill text (e.g. "added 4 sound effects", "Openverse API") */
  badgeText?: string;
  /** Badge color (default: dark translucent or yellow #FACC15) */
  badgeColor?: string;
  badgeTextColor?: string;
  /** Terminal command prompt text or JSX */
  terminalContent?: React.ReactNode;
  /** Main window display content (video preview, code, etc.) */
  children?: React.ReactNode;
  /** Outer glowing border color (e.g. #3B82F6) */
  glowBorderColor?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export interface TimelineTrackSegment {
  id: string;
  startPercent: number;
  widthPercent: number;
  color?: string;
  label?: string;
}

export interface TimelineCardProps {
  /** Timecode string (e.g. "00:12" or "00:06:07") */
  timecode?: string;
  /** Ruler markers (e.g. ["0s", "2s", "4s", "8s"]) */
  rulerMarks?: string[];
  /** Playhead position percentage 0 to 100 */
  playheadPercent?: number;
  /** Video track segments */
  videoSegments?: TimelineTrackSegment[];
  /** Audio track segments */
  audioSegments?: TimelineTrackSegment[];
  /** Track labels (default: ["V1 · film", "A1 · SFX"]) */
  trackLabels?: string[];
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export interface SoundWaveCardProps {
  /** Title label (default: "SOUND FX") */
  title?: string;
  /** Status dot indicator color (default: #3B82F6) */
  statusDotColor?: string;
  /** Number of waveform bars (default: 24) */
  barCount?: number;
  /** Waveform bar color (default: #3B82F6) */
  barColor?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export interface ProductLogoCardProps {
  /** Product or tool title (e.g. "earshot") */
  title: string;
  /** Version or secondary tag (e.g. "0.3") */
  versionTag?: string;
  /** Icon element or image URL */
  icon?: React.ReactNode;
  /** Subtle border stroke color (default: #60A5FA) */
  borderColor?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export interface LoadingSegmentsCardProps {
  /** Upper left header label (default: "EFFECT USAGE") */
  headerLabel?: string;
  /** Upper right ratio / counter text (default: "1 / 9") */
  counterText?: string;
  /** Total number of segments (default: 9) */
  totalSegments?: number;
  /** Number of active/filled segments (default: 3) */
  filledSegments?: number;
  /** Segment block color (default: #D1D5DB) */
  segmentColor?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export interface ColorSwatchItem {
  name: string;
  hex: string;
  label?: string;
}

export interface ColorSwatchesCardProps {
  /** Three color swatches to compare */
  swatches: ColorSwatchItem[];
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export interface DashedBadgeCardBuildTimeline {
  bestPartsFrame?: number;
  notesFrame?: number;
  handwrittenFrame?: number;
}

export interface DashedBadgeCardProps {
  /** Inner content (e.g. play card or graphic) */
  children?: React.ReactNode;
  /** Badge text */
  badgeText?: string;
  /** Badge background color (default: #3B82F6) */
  badgeColor?: string;
  /** Dashed outline stroke color (default: #93C5FD) */
  dashedColor?: string;
  /** Scale of inner element (default: 0.75 for 75% snap) */
  innerScale?: number;
  /** Card title */
  title?: string;
  /** Metric pill text */
  metric?: string;
  /** Subtitle / quote text */
  subtitle?: string;
  /** Progressive build stages timeline */
  buildTimeline?: DashedBadgeCardBuildTimeline;
  /** Scene start frame for relative timeline resolution */
  sceneStartFrame?: number;
  style?: React.CSSProperties;
}

export interface GlossyPlayCardProps {
  /** Play button color gradient start (default: #3B82F6) */
  buttonGradientStart?: string;
  /** Play button color gradient end (default: #1D4ED8) */
  buttonGradientEnd?: string;
  /** Whether skeleton placeholder lines are visible */
  showSkeletonBars?: boolean;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export interface SoundPadItem {
  id: string;
  label: string;
  iconType?: "bar" | "key" | "land" | "whoosh" | "snap" | "hit" | "tick" | "pop";
  isActive?: boolean;
}

export interface SoundPadMatrixCardProps {
  /** 9 pads data */
  pads?: SoundPadItem[];
  /** Center master button label */
  centerMasterLabel?: string;
  /** Pad border glow color (default: #3B82F6) */
  glowColor?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}
