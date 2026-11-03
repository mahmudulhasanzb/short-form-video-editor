import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Clapperboard,
  Download,
  FileJson,
  Film,
  FolderOpen,
  Layers3,
  Pause,
  Play,
  Plus,
  Settings2,
  Volume2,
  WandSparkles,
} from "lucide-react";
import { scenePlanSchema, type ScenePlan } from "@sfe/contracts";
import type { PlayerRef } from "@remotion/player";
import { PlanPreview } from "./PlanPreview";
import { CaptionInspector } from "./CaptionInspector";
import { SoundInspector } from "./SoundInspector";
import { referencedAssetIds } from "./asset-utils";

type Notice = { kind: "success" | "error"; message: string };

function formatTime(frame: number, fps: number) {
  const seconds = frame / fps;
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toFixed(1).padStart(4, "0")}`;
}

export default function App() {
  const [plan, setPlan] = useState<ScenePlan | null>(null);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<PlayerRef>(null);
  const [assetFiles, setAssetFiles] = useState<Record<string, File>>({});
  const [assetUrls, setAssetUrls] = useState<Record<string, string>>({});
  const [videoMetadata, setVideoMetadata] = useState<Record<string, { duration: number; width: number; height: number }>>({});
  const [pendingAssetId, setPendingAssetId] = useState<string | null>(null);
  const assetInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    const videos = Object.entries(assetUrls).filter(([, url]) => url);
    for (const [assetId, url] of videos) {
      if (videoMetadata[assetId]) continue;
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = url;
      video.onloadedmetadata = () => {
        if (cancelled || !Number.isFinite(video.duration)) return;
        setVideoMetadata((current) => ({
          ...current,
          [assetId]: {
            duration: video.duration,
            width: video.videoWidth,
            height: video.videoHeight,
          },
        }));
      };
      video.onerror = () => {
        if (!cancelled) setNotice({ kind: "error", message: `Could not read video metadata for ${assetId}.` });
      };
    }
    return () => {
      cancelled = true;
    };
  }, [assetUrls, videoMetadata]);

  const selectedScene = useMemo(
    () => plan?.scenes.find((scene) => scene.id === selectedSceneId) ?? null,
    [plan, selectedSceneId],
  );

  const selectedAlternative = useMemo(() => {
    if (!selectedScene?.visual.selectedAlternativeId) return null;
    return selectedScene.visual.alternatives.find(
      (item) => item.id === selectedScene.visual.selectedAlternativeId,
    ) ?? null;
  }, [selectedScene]);

  function updateScene(
    sceneId: string,
    updater: (scene: ScenePlan["scenes"][number]) => ScenePlan["scenes"][number],
  ) {
    setPlan((current) => {
      if (!current) return current;
      return {
        ...current,
        scenes: current.scenes.map((scene) =>
          scene.id === sceneId ? updater(scene) : scene,
        ),
      };
    });
    setNotice(null);
  }

  async function loadPlan(file?: File) {
    if (!file) return;
    try {
      const raw = JSON.parse(await file.text()) as unknown;
      const parsed = scenePlanSchema.parse(raw);
      setPlan(parsed);
      setSelectedSceneId(parsed.scenes[0]?.id ?? null);
      setFrame(parsed.scenes[0]?.startFrame ?? 0);
      setNotice({ kind: "success", message: "Scene plan loaded and validated." });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown validation error";
      setNotice({ kind: "error", message: `Could not load plan: ${message}` });
    }
    if (fileInput.current) fileInput.current.value = "";
  }

  function attachAsset(assetId: string, file: File) {
    setVideoMetadata((current) => {
      const next = { ...current };
      delete next[assetId];
      return next;
    });
    setAssetFiles((current) => ({ ...current, [assetId]: file }));
    setAssetUrls((current) => {
      const oldUrl = current[assetId];
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      return { ...current, [assetId]: URL.createObjectURL(file) };
    });
  }

  function updateVisualElement(
    sceneId: string,
    alternativeId: string,
    elementId: string,
    patch: Partial<ScenePlan["scenes"][number]["visual"]["alternatives"][number]["elements"][number]>,
  ) {
    updateScene(sceneId, (scene) => ({
      ...scene,
      visual: {
        ...scene.visual,
        alternatives: scene.visual.alternatives.map((alternative) =>
          alternative.id !== alternativeId
            ? alternative
            : {
                ...alternative,
                elements: alternative.elements.map((element) =>
                  element.id === elementId ? { ...element, ...patch } : element,
                ),
              },
        ),
      },
    }));
  }

  function updateCaptions(sceneId: string, captions: ScenePlan["scenes"][number]["captions"]) {
    updateScene(sceneId, (scene) => ({ ...scene, captions }));
  }

  function updateSoundEffects(sceneId: string, soundEffects: ScenePlan["scenes"][number]["soundEffects"]) {
    updateScene(sceneId, (scene) => ({ ...scene, soundEffects }));
  }

  function exportPlan() {
    if (!plan) return;
    const result = scenePlanSchema.safeParse(plan);
    if (!result.success) {
      setNotice({ kind: "error", message: "Plan validation failed. Fix errors before export." });
      return;
    }
    const blob = new Blob([JSON.stringify(result.data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "scene-plan.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice({ kind: "success", message: "Validated scene-plan.json exported." });
  }

  const validation = plan ? scenePlanSchema.safeParse(plan) : null;

  function seekTimeline(clientX: number, track: HTMLDivElement) {
    if (!plan) return;
    const bounds = track.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width));
    const nextFrame = Math.min(
      plan.project.durationFrames - 1,
      Math.floor(position * plan.project.durationFrames),
    );
    const scene = plan.scenes.find(
      (item) => nextFrame >= item.startFrame && nextFrame < item.endFrame,
    );
    if (scene) setSelectedSceneId(scene.id);
    setFrame(nextFrame);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Clapperboard size={18} /></div>
          <div><strong>SHORT FORM</strong><span>VIDEO EDITOR</span></div>
        </div>
        <div className="topbar-center"><span className="status-dot" /> EDITING WORKSPACE</div>
        <div className="topbar-actions">
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(event) => void loadPlan(event.target.files?.[0])}
          />
          <button className="button secondary" onClick={() => fileInput.current?.click()}>
            <FolderOpen size={15} /> Open plan
          </button>
          <button className="button primary" disabled={!plan} onClick={exportPlan}>
            <Download size={15} /> Export JSON
          </button>
        </div>
      </header>

      {notice && (
        <div className={`notice ${notice.kind}`}>
          {notice.kind === "success" ? <Check size={15} /> : <AlertCircle size={15} />}
          <span>{notice.message}</span>
          <button onClick={() => setNotice(null)} aria-label="Dismiss">×</button>
        </div>
      )}

      {!plan ? (
        <section className="empty-state">
          <div className="empty-icon"><FileJson size={28} /></div>
          <p className="eyebrow">SCENE PLAN WORKSPACE</p>
          <h1>Start with a scene plan</h1>
          <p className="muted">Open a validated <code>scene-plan.json</code> to edit scenes, visual direction, captions, camera motion, and sound cues.</p>
          <button className="button primary large" onClick={() => fileInput.current?.click()}>
            <FolderOpen size={16} /> Open scene-plan.json
          </button>
          <span className="empty-footnote">No sample or placeholder video data is loaded automatically.</span>
        </section>
      ) : (
        <>
          <section className="project-strip">
            <div><span className="eyebrow">PROJECT</span><strong>{plan.project.name}</strong></div>
            <div className="project-meta">
              <span>{plan.project.width} × {plan.project.height}</span>
              <span>{plan.project.fps} FPS</span>
              <span>{plan.scenes.length} SCENES</span>
            </div>
            <div className={`validation-pill ${validation?.success ? "valid" : "invalid"}`}>
              {validation?.success ? <Check size={13} /> : <AlertCircle size={13} />}
              {validation?.success ? "PLAN VALID" : "VALIDATION ERROR"}
            </div>
          </section>

          <section className="workspace">
            <aside className="scene-sidebar panel">
              <div className="panel-heading"><span>SCENES <small>{plan.scenes.length}</small></span><Layers3 size={16} /></div>
              <div className="scene-list">
                {plan.scenes.map((scene, index) => (
                  <button
                    key={scene.id}
                    className={`scene-row ${scene.id === selectedSceneId ? "active" : ""}`}
                    onClick={() => { setSelectedSceneId(scene.id); setFrame(scene.startFrame); }}
                  >
                    <span className="scene-number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="scene-info"><strong>{scene.name}</strong><small>{formatTime(scene.startFrame, plan.project.fps)} – {formatTime(scene.endFrame, plan.project.fps)}</small></span>
                    <span className="scene-kind">{scene.visual.type === "none" ? "SPEAKER" : scene.visual.type.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </aside>

            <section className="center-column">
              <div className="preview-panel panel">
                <div className="panel-heading"><span>LIVE PREVIEW</span><span className="preview-badge">PLAN PREVIEW</span></div>
                <div className="preview-stage">
                  <div className="preview-frame" style={{ aspectRatio: `${plan.project.width} / ${plan.project.height}` }}>
                    <PlanPreview plan={plan} assets={assetUrls} frame={frame} onFrameChange={setFrame} playerRef={playerRef} onPlaybackStateChange={setIsPlaying} />
                  </div>
                </div>
                <div className="preview-asset-bar">
                  <input ref={assetInput} type="file" accept="image/*,video/*" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file && pendingAssetId) attachAsset(pendingAssetId, file); setPendingAssetId(null); if (event.target) event.target.value = ""; }} />
                  <input ref={videoInput} type="file" accept="video/*" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) attachAsset(plan.source.videoAssetId, file); if (event.target) event.target.value = ""; }} />
                  <button className="small-button" onClick={() => videoInput.current?.click()}>{assetUrls[plan.source.videoAssetId] ? "Replace source video" : "Attach source video"}</button>
                  <span>{assetUrls[plan.source.videoAssetId] ? "Source attached for this tab" : "Attach source to preview footage"}</span>
                  {videoMetadata[plan.source.videoAssetId] && <span>{videoMetadata[plan.source.videoAssetId]?.width}×{videoMetadata[plan.source.videoAssetId]?.height} · {videoMetadata[plan.source.videoAssetId]?.duration.toFixed(1)}s</span>}
                  {referencedAssetIds(plan).filter((assetId) => assetId !== plan.source.videoAssetId).map((assetId) => (
                    <button
                      key={assetId}
                      className="small-button"
                      onClick={() => { setPendingAssetId(assetId); assetInput.current?.click(); }}
                      title={assetFiles[assetId]?.name ?? assetId}
                    >
                      {assetUrls[assetId] ? "Replace" : "Attach"} {assetId}
                    </button>
                  ))}
                </div>
                <div className="preview-controls"><button className="icon-button" onClickCapture={(event) => playerRef.current?.toggle(event)} aria-label={isPlaying ? "Pause preview" : "Play preview"} title={isPlaying ? "Pause" : "Play"}>{isPlaying ? <Pause size={15} /> : <Play size={15} />}</button><span>{formatTime(frame, plan.project.fps)}</span><span className="control-divider" /><span>{selectedScene ? formatTime(selectedScene.endFrame, plan.project.fps) : "—"}</span><span className="control-spacer" /><span>Shared Remotion preview · frame {frame}</span></div>
              </div>

              <div className="timeline-panel panel">
                <div className="panel-heading"><span>TIMELINE</span><span className="muted">{plan.project.durationFrames} FRAMES</span></div>
                <div className="timeline-ruler"><span>00:00</span><span>{formatTime(Math.round(plan.project.durationFrames / 2), plan.project.fps)}</span><span>{formatTime(plan.project.durationFrames, plan.project.fps)}</span></div>
                <div
                  className="timeline-track"
                  onClick={(event) => seekTimeline(event.clientX, event.currentTarget)}
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    seekTimeline(event.clientX, event.currentTarget);
                  }}
                  onPointerMove={(event) => {
                    if (event.buttons === 1) seekTimeline(event.clientX, event.currentTarget);
                  }}
                  onKeyDown={(event) => {
                    const step = event.shiftKey ? 10 : 1;
                    let nextFrame = frame;
                    if (event.key === "ArrowLeft" || event.key === "ArrowDown") nextFrame -= step;
                    else if (event.key === "ArrowRight" || event.key === "ArrowUp") nextFrame += step;
                    else if (event.key === "Home") nextFrame = 0;
                    else if (event.key === "End") nextFrame = plan.project.durationFrames - 1;
                    else return;
                    event.preventDefault();
                    const clampedFrame = Math.max(0, Math.min(plan.project.durationFrames - 1, nextFrame));
                    const scene = plan.scenes.find(
                      (item) => clampedFrame >= item.startFrame && clampedFrame < item.endFrame,
                    );
                    if (scene) setSelectedSceneId(scene.id);
                    setFrame(clampedFrame);
                  }}
                  role="slider"
                  aria-label="Timeline frame"
                  aria-orientation="horizontal"
                  aria-valuemin={0}
                  aria-valuemax={plan.project.durationFrames - 1}
                  aria-valuenow={frame}
                  aria-valuetext={`Frame ${frame}, ${formatTime(frame, plan.project.fps)}`}
                  tabIndex={0}
                >
                  {plan.scenes.map((scene) => (
                    <div
                      key={scene.id}
                      className={`timeline-scene ${scene.id === selectedSceneId ? "selected" : ""}`}
                      style={{ left: `${(scene.startFrame / plan.project.durationFrames) * 100}%`, width: `${((scene.endFrame - scene.startFrame) / plan.project.durationFrames) * 100}%` }}
                      title={scene.name}
                    >{scene.name}</div>
                  ))}
                  <div
                    className="timeline-playhead"
                    style={{ left: `${(frame / Math.max(1, plan.project.durationFrames - 1)) * 100}%` }}
                  />
                </div>
                <div className="timeline-legend"><span><i className="legend-scene" /> Scenes</span><span><i className="legend-caption" /> Captions</span><span><i className="legend-sound" /> Sound cues</span></div>
              </div>
            </section>

            <aside className="inspector panel">
              <div className="panel-heading"><span>PROPERTIES</span><Settings2 size={16} /></div>
              {selectedScene ? (
                <div className="inspector-content">
                  <label className="field-label">SCENE NAME<input value={selectedScene.name} onChange={(event) => updateScene(selectedScene.id, (scene) => ({ ...scene, name: event.target.value }))} /></label>
                  <label className="field-label">LAYOUT<select value={selectedScene.layout} onChange={(event) => updateScene(selectedScene.id, (scene) => ({ ...scene, layout: event.target.value as typeof scene.layout }))}><option value="full-speaker">Full Speaker</option><option value="split-50-50">50/50 Split</option><option value="full-canvas">Full Canvas</option></select></label>
                  <label className="field-label">VISUAL TYPE<select value={selectedScene.visual.type} onChange={(event) => updateScene(selectedScene.id, (scene) => ({ ...scene, visual: { ...scene.visual, type: event.target.value as typeof scene.visual.type, selectedAlternativeId: event.target.value === "none" ? null : scene.visual.selectedAlternativeId } }))}><option value="none">No graphic</option><option value="ui">UI</option><option value="diagram">Diagram</option><option value="object">Object</option><option value="image">Image</option><option value="typography">Typography</option></select></label>

                  <div className="field-label">VISUAL ALTERNATIVE</div>
                  {selectedScene.visual.alternatives.length ? (
                    <div className="alternative-list">
                      {selectedScene.visual.alternatives.map((alternative) => (
                        <button key={alternative.id} className={`alternative-card ${alternative.id === selectedScene.visual.selectedAlternativeId ? "selected" : ""}`} onClick={() => updateScene(selectedScene.id, (scene) => ({ ...scene, visual: { ...scene.visual, selectedAlternativeId: alternative.id } }))}>
                          <strong>{alternative.label}</strong><span>{alternative.compositionType.replaceAll("-", " ")}</span><small>{alternative.rationale}</small>
                        </button>
                      ))}
                    </div>
                  ) : <p className="helper-text">No alternatives are defined for this scene. The planner must create real compositions before they can be selected.</p>}

                  {selectedAlternative?.elements.length ? (
                    <>
                      <div className="section-divider" />
                      <div className="field-label">ELEMENT TRANSFORM</div>
                      {selectedAlternative.elements.map((element) => {
                        const updateNumber = (
                          key: "x" | "y" | "width" | "height" | "rotation" | "opacity",
                          raw: string,
                        ) => {
                          if (raw.trim() === "") return;
                          const value = Number(raw);
                          if (!Number.isFinite(value)) return;
                          const limits = {
                            x: { min: 0, max: 100 - element.width },
                            y: { min: 0, max: 100 - element.height },
                            width: { min: 0.1, max: 100 - element.x },
                            height: { min: 0.1, max: 100 - element.y },
                            rotation: { min: -360, max: 360 },
                            opacity: { min: 0, max: 1 },
                          }[key];
                          const next = Math.max(limits.min, Math.min(limits.max, value));
                          updateVisualElement(selectedScene.id, selectedAlternative.id, element.id, { [key]: next });
                        };
                        const style = (element.style ?? {}) as Record<string, unknown>;
                        return (
                          <div className="alternative-card" key={element.id}>
                            <strong>{element.id} · {element.kind.toUpperCase()}</strong>
                            <div className="field-grid">
                              {(["x", "y", "width", "height"] as const).map((key) => (
                                <label className="field-label" key={key}>{key.toUpperCase()} (%)
                                  <input
                                    type="number"
                                    min={key === "width" || key === "height" ? 0.1 : 0}
                                    max={key === "x" ? 100 - element.width : key === "y" ? 100 - element.height : key === "width" ? 100 - element.x : 100 - element.y}
                                    step={0.5}
                                    value={element[key]}
                                    onChange={(event) => updateNumber(key, event.target.value)}
                                  />
                                </label>
                              ))}
                            </div>
                            <div className="field-grid">
                              <label className="field-label">ROTATION (°)
                                <input type="number" min={-360} max={360} step={1} value={element.rotation ?? 0} onChange={(event) => updateNumber("rotation", event.target.value)} />
                              </label>
                              <label className="field-label">OPACITY
                                <input type="number" min={0} max={1} step={0.05} value={element.opacity ?? 1} onChange={(event) => updateNumber("opacity", event.target.value)} />
                              </label>
                            </div>
                            {element.kind === "shape" && (
                              <label className="field-label">FILL COLOR
                                <input
                                  type="color"
                                  value={/^#[0-9a-fA-F]{6}$/.test(String(style.background ?? "#a58cf0")) ? String(style.background ?? "#a58cf0") : "#a58cf0"}
                                  onChange={(event) => updateVisualElement(selectedScene.id, selectedAlternative.id, element.id, { style: { ...style, background: event.target.value } })}
                                />
                              </label>
                            )}
                            <div className="section-divider" />
                            <div className="field-label">ELEMENT STYLE</div>
                            {(element.kind === "image" || element.kind === "icon" || element.kind === "video") && (
                              <label className="field-label">FIT
                                <select
                                  value={String(style.objectFit ?? (element.kind === "video" ? "cover" : "contain"))}
                                  onChange={(event) => updateVisualElement(selectedScene.id, selectedAlternative.id, element.id, { style: { ...style, objectFit: event.target.value } })}
                                >
                                  <option value="contain">Contain</option>
                                  <option value="cover">Cover</option>
                                  <option value="fill">Stretch</option>
                                  <option value="none">Original size</option>
                                </select>
                              </label>
                            )}
                            <label className="field-label">CORNER RADIUS (PX)
                              <input
                                type="number"
                                min={0}
                                max={500}
                                step={1}
                                value={Number(style.borderRadius ?? 0)}
                                onChange={(event) => {
                                  if (event.target.value.trim() === "") return;
                                  const radius = Math.max(0, Math.min(500, Number(event.target.value)));
                                  if (!Number.isFinite(radius)) return;
                                  updateVisualElement(selectedScene.id, selectedAlternative.id, element.id, { style: { ...style, borderRadius: radius } });
                                }}
                              />
                            </label>
                            <label className="field-label">BORDER (CSS)
                              <input
                                placeholder="2px solid #ffffff"
                                value={String(style.border ?? "")}
                                onChange={(event) => updateVisualElement(selectedScene.id, selectedAlternative.id, element.id, { style: { ...style, border: event.target.value } })}
                              />
                            </label>
                            <label className="field-label">SHADOW (CSS)
                              <input
                                placeholder="0 8px 24px #00000055"
                                value={String(style.boxShadow ?? "")}
                                onChange={(event) => updateVisualElement(selectedScene.id, selectedAlternative.id, element.id, { style: { ...style, boxShadow: event.target.value } })}
                              />
                            </label>
                          </div>
                        );
                      })}
                    </>
                  ) : null}

                  {selectedAlternative?.elements.some((element) => element.kind === "text") && (
                    <>
                      <div className="section-divider" />
                      <div className="field-label">TEXT INSPECTOR</div>
                      {selectedAlternative.elements.filter((element) => element.kind === "text").map((element) => {
                        const style = (element.style ?? {}) as Record<string, unknown>;
                        const numeric = (key: "x" | "y" | "width" | "height", raw: string) => {
                          const value = Number(raw);
                          if (!Number.isFinite(value)) return;
                          const max = key === "x" ? 100 - element.width : key === "y" ? 100 - element.height : 100;
                          const min = key === "width" ? 0.1 : key === "height" ? 0.1 : 0;
                          const next = Math.max(min, Math.min(max, value));
                          updateVisualElement(selectedScene.id, selectedAlternative.id, element.id, { [key]: next });
                        };
                        const updateStyle = (key: string, value: unknown) =>
                          updateVisualElement(selectedScene.id, selectedAlternative.id, element.id, {
                            style: { ...style, [key]: value },
                          });
                        return (
                          <div className="alternative-card" key={element.id}>
                            <strong>{element.id}</strong>
                            <label className="field-label">TEXT
                              <textarea rows={3} value={element.text ?? ""} onChange={(event) => updateVisualElement(selectedScene.id, selectedAlternative.id, element.id, { text: event.target.value })} />
                            </label>
                            <div className="field-grid">
                              {(["x", "y", "width", "height"] as const).map((key) => (
                                <label className="field-label" key={key}>{key.toUpperCase()} (%)
                                  <input type="number" min={key === "width" || key === "height" ? 0.1 : 0} max={100} step={0.5} value={element[key]} onChange={(event) => numeric(key, event.target.value)} />
                                </label>
                              ))}
                            </div>
                            <label className="field-label">FONT SIZE (PX)
                              <input type="number" min={8} max={240} value={Number(style.fontSize ?? 48)} onChange={(event) => updateStyle("fontSize", Math.max(8, Math.min(240, Number(event.target.value) || 8)))} />
                            </label>
                            <label className="field-label">FONT FAMILY
                              <input value={String(style.fontFamily ?? "Arial")} onChange={(event) => updateStyle("fontFamily", event.target.value)} />
                            </label>
                            <label className="field-label">TEXT COLOR
                              <input type="color" value={/^#[0-9a-fA-F]{6}$/.test(String(style.color ?? "#ffffff")) ? String(style.color ?? "#ffffff") : "#ffffff"} onChange={(event) => updateStyle("color", event.target.value)} />
                            </label>
                            <label className="field-label">FONT WEIGHT
                              <select value={String(style.fontWeight ?? 700)} onChange={(event) => updateStyle("fontWeight", Number(event.target.value))}>
                                <option value="400">Regular</option><option value="500">Medium</option><option value="600">Semi-bold</option><option value="700">Bold</option><option value="800">Extra-bold</option>
                              </select>
                            </label>
                            <label className="field-label">ALIGNMENT
                              <select value={String(style.textAlign ?? "center")} onChange={(event) => updateStyle("textAlign", event.target.value)}>
                                <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
                              </select>
                            </label>
                          </div>
                        );
                      })}
                    </>
                  )}

                  {selectedAlternative?.elements.some((element) => element.kind === "video") && (
                    <>
                      <div className="section-divider" />
                      <div className="field-label">VIDEO OVERLAYS</div>
                      {selectedAlternative.elements.filter((element) => element.kind === "video").map((element) => (
                        <div className="alternative-card" key={element.id}>
                          <strong>{element.id}</strong>
                          <small>Source trim is measured in source-video frames, not timeline frames.</small>
                          <label className="field-label">SOURCE IN (FRAME)
                            <input
                              type="number"
                              min={0}
                              step={1}
                              value={element.mediaStartFrame ?? 0}
                              onChange={(event) => {
                                const value = Math.max(0, Math.floor(Number(event.target.value) || 0));
                                const end = element.mediaEndFrame;
                                updateVisualElement(selectedScene.id, selectedAlternative.id, element.id, {
                                  mediaStartFrame: end !== undefined && value >= end ? Math.max(0, end - 1) : value,
                                });
                              }}
                            />
                          </label>
                          <label className="field-label">SOURCE OUT (FRAME)
                            <input
                              type="number"
                              min={(element.mediaStartFrame ?? 0) + 1}
                              step={1}
                              value={element.mediaEndFrame ?? ""}
                              placeholder="End of source video"
                              onChange={(event) => {
                                const raw = event.target.value;
                                const value = raw === "" ? undefined : Math.max((element.mediaStartFrame ?? 0) + 1, Math.floor(Number(raw) || 0));
                                updateVisualElement(selectedScene.id, selectedAlternative.id, element.id, {
                                  mediaEndFrame: value,
                                });
                              }}
                            />
                          </label>
                          <label className="field-label">OVERLAY START (SCENE FRAME)<input type="number" min={0} max={selectedScene.endFrame - selectedScene.startFrame - 1} value={element.timelineStartFrame ?? 0} onChange={(event) => { const max = Math.max(0, selectedScene.endFrame - selectedScene.startFrame - 1); const value = Math.max(0, Math.min(max, Math.floor(Number(event.target.value) || 0))); const end = element.timelineEndFrame; updateVisualElement(selectedScene.id, selectedAlternative.id, element.id, { timelineStartFrame: end !== undefined && value >= end ? Math.max(0, end - 1) : value }); }} /></label>
                          <label className="field-label">OVERLAY END (SCENE FRAME)<input type="number" min={(element.timelineStartFrame ?? 0) + 1} max={selectedScene.endFrame - selectedScene.startFrame} value={element.timelineEndFrame ?? selectedScene.endFrame - selectedScene.startFrame} onChange={(event) => { const max = selectedScene.endFrame - selectedScene.startFrame; const value = Math.max((element.timelineStartFrame ?? 0) + 1, Math.min(max, Math.floor(Number(event.target.value) || 1))); updateVisualElement(selectedScene.id, selectedAlternative.id, element.id, { timelineEndFrame: value }); }} /></label>
                          <small>Overlay timing is scene-relative; source IN/OUT chooses which footage plays.</small>
                        </div>
                      ))}
                    </>
                  )}

                  <div className="section-divider" />
                  <div className="field-label">CAMERA MOTION</div>
                  <label className="toggle-row"><span>Enable motion</span><input type="checkbox" checked={selectedScene.cameraMotion.enabled} onChange={(event) => updateScene(selectedScene.id, (scene) => ({ ...scene, cameraMotion: { ...scene.cameraMotion, enabled: event.target.checked, type: event.target.checked ? scene.cameraMotion.type ?? "zoom-in" : null } }))} /></label>
                  {selectedScene.cameraMotion.enabled && <label className="field-label">MOTION TYPE<select value={selectedScene.cameraMotion.type ?? "zoom-in"} onChange={(event) => updateScene(selectedScene.id, (scene) => ({ ...scene, cameraMotion: { ...scene.cameraMotion, type: event.target.value as NonNullable<typeof scene.cameraMotion.type> } }))}><option value="zoom-in">Zoom In</option><option value="zoom-out">Zoom Out</option><option value="pan-left">Pan Left</option><option value="pan-right">Pan Right</option></select></label>}

                  <div className="section-divider" />
                  <CaptionInspector scene={selectedScene} fps={plan.project.fps} onChange={(captions) => updateCaptions(selectedScene.id, captions)} />
                  <div className="section-divider" />
                  <SoundInspector scene={selectedScene} fps={plan.project.fps} assets={assetUrls} onChange={(effects) => updateSoundEffects(selectedScene.id, effects)} onAssetUpload={attachAsset} />
                </div>
              ) : <p className="helper-text">Select a scene to edit its properties.</p>}
            </aside>
          </section>
        </>
      )}
      <footer className="statusbar"><span><i className="status-dot" /> LOCAL PLAN EDITOR</span><span>{plan ? validation?.success ? "All schema checks passed" : "Plan needs attention" : "No project loaded"}</span><span>FOUNDATION BUILD <ChevronDown size={12} /></span></footer>
    </main>
  );
}
