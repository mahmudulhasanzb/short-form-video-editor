import { useMemo, useRef, useState } from "react";
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
  Play,
  Plus,
  Settings2,
  Volume2,
  WandSparkles,
} from "lucide-react";
import { scenePlanSchema, type ScenePlan } from "@sfe/contracts";
import { PlanPreview } from "./PlanPreview";
import { CaptionInspector } from "./CaptionInspector";
import { SoundInspector } from "./SoundInspector";

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
  const [assetFiles, setAssetFiles] = useState<Record<string, File>>({});
  const [assetUrls, setAssetUrls] = useState<Record<string, string>>({});
  const videoInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

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
    setAssetFiles((current) => ({ ...current, [assetId]: file }));
    setAssetUrls((current) => {
      const oldUrl = current[assetId];
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      return { ...current, [assetId]: URL.createObjectURL(file) };
    });
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
                    <PlanPreview plan={plan} assets={assetUrls} frame={frame} onFrameChange={setFrame} />
                  </div>
                </div>
                <div className="preview-asset-bar">
                  <input ref={videoInput} type="file" accept="video/*" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) attachAsset(plan.source.videoAssetId, file); if (event.target) event.target.value = ""; }} />
                  <button className="small-button" onClick={() => videoInput.current?.click()}>{assetUrls[plan.source.videoAssetId] ? "Replace source video" : "Attach source video"}</button>
                  <span>{assetUrls[plan.source.videoAssetId] ? "Source attached for this tab" : "Attach source to preview footage"}</span>
                </div>
                <div className="preview-controls"><button className="icon-button" aria-label="Preview"><Play size={15} /></button><span>{formatTime(frame, plan.project.fps)}</span><span className="control-divider" /><span>{selectedScene ? formatTime(selectedScene.endFrame, plan.project.fps) : "—"}</span><span className="control-spacer" /><span>Shared Remotion preview · frame {frame}</span></div>
              </div>

              <div className="timeline-panel panel">
                <div className="panel-heading"><span>TIMELINE</span><span className="muted">{plan.project.durationFrames} FRAMES</span></div>
                <div className="timeline-ruler"><span>00:00</span><span>{formatTime(Math.round(plan.project.durationFrames / 2), plan.project.fps)}</span><span>{formatTime(plan.project.durationFrames, plan.project.fps)}</span></div>
                <div className="timeline-track">
                  {plan.scenes.map((scene) => (
                    <button
                      key={scene.id}
                      className={`timeline-scene ${scene.id === selectedSceneId ? "selected" : ""}`}
                      style={{ left: `${(scene.startFrame / plan.project.durationFrames) * 100}%`, width: `${((scene.endFrame - scene.startFrame) / plan.project.durationFrames) * 100}%` }}
                      onClick={() => { setSelectedSceneId(scene.id); setFrame(scene.startFrame); }}
                      title={scene.name}
                    >{scene.name}</button>
                  ))}
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
