import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  AlertCircle, Check, ChevronDown, Download, Film, FileJson, ImagePlus,
  Layers3, Plus, Scissors, Trash2, Upload, Volume2, WandSparkles, X
} from "lucide-react";
import { scenePlanSchema, type ScenePlan } from "@sfe/contracts";

type Scene = ScenePlan["scenes"][number];
type Alternative = Scene["visual"]["alternatives"][number];
type Element = Alternative["elements"][number];
type CaptionChunk = Scene["captions"]["chunks"][number];
type SoundCue = Scene["soundEffects"][number];
type Notice = { kind: "success" | "error"; message: string };

type Props = {
  plan: ScenePlan;
  assetUrls: Record<string, string>;
  onPlanChange: (plan: ScenePlan) => void;
  onAttachAsset: (assetId: string, file: File) => void;
  onExportPlan: () => void;
  onOpenPlan: () => void;
  notice: Notice | null;
  onDismissNotice: () => void;
};

function timecode(frame: number, fps: number) {
  const seconds = frame / fps;
  const minutes = Math.floor(seconds / 60);
  return String(minutes).padStart(2, "0") + ":" + (seconds % 60).toFixed(2).padStart(5, "0");
}

function makeId(prefix: string) {
  return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
}

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return <label className="sb-field"><span>{label}</span>{children}{hint ? <small>{hint}</small> : null}</label>;
}

function NumberInput({ value, min, max, step = 1, onChange }: {
  value: number; min?: number; max?: number; step?: number; onChange: (value: number) => void;
}) {
  return <input type="number" value={value} min={min} max={max} step={step}
    onChange={(event) => { if (event.target.value !== "") onChange(Number(event.target.value)); }} />;
}

function SourceFrame({ url, scene, fps }: { url?: string; scene: Scene; fps: number }) {
  const [still, setStill] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setStill(null);
    setFailed(false);
    if (!url) return;
    let disposed = false;
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    const onMetadata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      const middle = (scene.startFrame + (scene.endFrame - scene.startFrame) * 0.45) / fps;
      video.currentTime = Math.max(0, Math.min(Math.max(0, duration - 0.08), middle));
    };
    const onSeeked = () => {
      if (disposed || !video.videoWidth || !video.videoHeight) return;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (!context) { setFailed(true); return; }
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      try { setStill(canvas.toDataURL("image/jpeg", 0.84)); }
      catch { setFailed(true); }
    };
    const onError = () => { if (!disposed) setFailed(true); };
    video.addEventListener("loadedmetadata", onMetadata);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
    video.src = url;
    video.load();
    return () => {
      disposed = true;
      video.pause();
      video.removeEventListener("loadedmetadata", onMetadata);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      video.removeAttribute("src");
      video.load();
    };
  }, [url, scene.id, scene.startFrame, scene.endFrame, fps]);

  const selected = scene.visual.selectedAlternativeId
    ? scene.visual.alternatives.find((item) => item.id === scene.visual.selectedAlternativeId)
    : undefined;
  const midpoint = Math.round((scene.startFrame + scene.endFrame) / 2);
  const chunk = scene.captions.chunks.find((item) => midpoint >= item.startFrame && midpoint < item.endFrame)
    ?? scene.captions.chunks[0];
  const style = scene.captions.style;

  return <div className="sb-frame" aria-label={"Storyboard frame for " + scene.name}>
    {still ? <img className="sb-source-still" src={still} alt="Source video frame at the middle of this scene" />
      : <div className="sb-frame-empty"><Film size={24} /><span>{url ? (failed ? "Frame could not be decoded" : "Reading source frame…") : "Attach source video to create real scene thumbnails"}</span></div>}
    {selected?.elements.filter((item) => item.kind === "text" && item.text).map((item) => {
      const visualStyle = item.style as Record<string, unknown>;
      return <div key={item.id} className="sb-frame-element" style={{
        left: item.x + "%", top: item.y + "%", width: item.width + "%", height: item.height + "%",
        zIndex: item.zIndex, opacity: item.opacity,
        transform: "rotate(" + (item.rotation ?? 0) + "deg)",
        color: String(visualStyle.color ?? "#ffffff"),
        background: String(visualStyle.background ?? "transparent"),
        fontSize: "clamp(7px, 1.2vw, 14px)",
        fontWeight: Number(visualStyle.fontWeight ?? 800),
        textAlign: String(visualStyle.textAlign ?? "center") as "left" | "center" | "right",
      }}>{item.text}</div>;
    })}
    {scene.captions.enabled && chunk && <div className={"sb-frame-caption position-" + style.position} style={{ color: style.textColor, fontSize: "clamp(8px, 1.15vw, 13px)" }}>
      {chunk.words.map((word) => <span key={word.id} style={word.highlighted ? { color: style.highlightColor } : undefined}>{word.text} </span>)}
    </div>}
    <span className="sb-frame-stamp">{timecode(scene.startFrame, fps)} — {timecode(scene.endFrame, fps)}</span>
  </div>;
}

export function StoryboardBoard({ plan, assetUrls, onPlanChange, onAttachAsset, onExportPlan, onOpenPlan, notice, onDismissNotice }: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [pendingAssetId, setPendingAssetId] = useState<string | null>(null);
  const validation = useMemo(() => scenePlanSchema.safeParse(plan), [plan]);
  const activeAlternative = (scene: Scene) => scene.visual.selectedAlternativeId
    ? scene.visual.alternatives.find((item) => item.id === scene.visual.selectedAlternativeId) ?? null
    : null;

  function mutateScene(sceneId: string, updater: (scene: Scene) => Scene) {
    onPlanChange({ ...plan, scenes: plan.scenes.map((scene) => scene.id === sceneId ? updater(scene) : scene) });
  }
  function openAssetPicker(assetId: string, accept = "audio/*,image/*,video/*") {
    setPendingAssetId(assetId);
    if (fileInput.current) {
      fileInput.current.accept = accept;
      fileInput.current.click();
    }
  }
  function updateElement(sceneId: string, alternativeId: string, elementId: string, patch: Partial<Element>) {
    mutateScene(sceneId, (scene) => ({ ...scene, visual: { ...scene.visual, alternatives: scene.visual.alternatives.map((alternative) =>
      alternative.id === alternativeId ? { ...alternative, elements: alternative.elements.map((element) =>
        element.id === elementId ? { ...element, ...patch } : element) } : alternative) } }));
  }
  function addAlternative(sceneId: string) {
    const id = makeId("composition");
    mutateScene(sceneId, (scene) => ({ ...scene, visual: {
      type: scene.visual.type === "none" ? "typography" : scene.visual.type,
      alternatives: [...scene.visual.alternatives, { id, label: "New composition", compositionType: "typography", rationale: "Describe the editorial purpose of this composition.", elements: [] }],
      selectedAlternativeId: id,
    } }));
  }
  function addTextElement(sceneId: string, alternativeId: string) {
    const id = makeId("text");
    mutateScene(sceneId, (scene) => ({ ...scene, visual: { ...scene.visual, alternatives: scene.visual.alternatives.map((alternative) =>
      alternative.id === alternativeId ? { ...alternative, elements: [...alternative.elements, {
        id, kind: "text", x: 8, y: 70, width: 84, height: 16, zIndex: 10, rotation: 0, opacity: 1,
        text: "Edit this text", style: { color: "#ffffff", fontSize: 52, fontWeight: 800, textAlign: "center", background: "transparent" },
        motion: { enter: "fade", exit: "none", delayFrames: 0, durationFrames: 12 }
      } as Element] } : alternative) } }));
  }
  function updateChunk(sceneId: string, chunkId: string, patch: Partial<CaptionChunk>) {
    mutateScene(sceneId, (scene) => ({ ...scene, captions: { ...scene.captions, chunks: scene.captions.chunks.map((chunk) => chunk.id === chunkId ? { ...chunk, ...patch } : chunk) } }));
  }
  function updateCue(sceneId: string, cueId: string, patch: Partial<SoundCue>) {
    mutateScene(sceneId, (scene) => ({ ...scene, soundEffects: scene.soundEffects.map((cue) => cue.id === cueId ? { ...cue, ...patch } : cue) }));
  }
  function splitChunk(sceneId: string, chunk: CaptionChunk, wordIndex: number) {
    const currentScene = plan.scenes.find((item) => item.id === sceneId);
    if (!currentScene || wordIndex < 1 || wordIndex >= chunk.words.length) return;
    const boundary = Math.round(chunk.startFrame + (chunk.endFrame - chunk.startFrame) * wordIndex / chunk.words.length);
    if (boundary <= chunk.startFrame || boundary >= chunk.endFrame) return;
    const left: CaptionChunk = { ...chunk, id: makeId("caption"), endFrame: boundary, words: chunk.words.slice(0, wordIndex) };
    const right: CaptionChunk = { ...chunk, id: makeId("caption"), startFrame: boundary, words: chunk.words.slice(wordIndex) };
    mutateScene(sceneId, (scene) => ({ ...scene, captions: { ...scene.captions, chunks: scene.captions.chunks.flatMap((item) => item.id === chunk.id ? [left, right] : [item]) } }));
  }
  function mergeChunk(sceneId: string, chunkId: string) {
    mutateScene(sceneId, (scene) => {
      const index = scene.captions.chunks.findIndex((chunk) => chunk.id === chunkId);
      if (index < 0 || index >= scene.captions.chunks.length - 1) return scene;
      const current = scene.captions.chunks[index];
      const next = scene.captions.chunks[index + 1];
      if (!current || !next) return scene;
      const merged: CaptionChunk = { ...current, endFrame: next.endFrame, words: [...current.words, ...next.words] };
      const chunks = [...scene.captions.chunks];
      chunks.splice(index, 2, merged);
      return { ...scene, captions: { ...scene.captions, chunks } };
    });
  }
  function addCue(sceneId: string) {
    const id = makeId("cue");
    mutateScene(sceneId, (scene) => ({ ...scene, soundEffects: [...scene.soundEffects, {
      id, assetId: "replace-with-audio-asset", startFrame: scene.startFrame, durationFrames: Math.min(18, scene.endFrame - scene.startFrame),
      volumeDb: -18, enabled: false
    }] }));
  }
  const sceneCount = plan.scenes.length;
  const sourceUrl = assetUrls[plan.source.videoAssetId];
  const attachedCount = Object.keys(assetUrls).length;

  return <main className="storyboard-app">
    <input ref={fileInput} type="file" accept="audio/*,image/*,video/*" hidden onChange={(event) => {
      const file = event.target.files?.[0];
      if (file && pendingAssetId) onAttachAsset(pendingAssetId, file);
      setPendingAssetId(null);
      if (event.target) event.target.value = "";
    }} />
    <header className="sb-topbar">
      <a className="sb-brand" href="#" aria-label="Storyboard home">
        <span className="sb-brand-mark"><Layers3 size={18} /></span>
        <span><strong>FRAME / STORYBOARD</strong><small>EDIT PLAN · SOURCE-GROUNDED</small></span>
      </a>
      <div className="sb-top-meta"><span className="sb-live-dot" /> {sceneCount} SCENES <i /> {plan.project.width} × {plan.project.height} <i /> {plan.project.fps} FPS</div>
      <div className="sb-actions">
        <button className="sb-button secondary" onClick={onOpenPlan}><FileJson size={15} /> Open plan</button>
        <button className="sb-button secondary" onClick={() => openAssetPicker(plan.source.videoAssetId, "video/*")}><Upload size={15} /> {sourceUrl ? "Replace footage" : "Attach footage"}</button>
        <button className="sb-button primary" onClick={onExportPlan}><Download size={15} /> Save storyboard plan</button>
      </div>
    </header>

    {notice && <div className={"sb-notice " + notice.kind}>
      {notice.kind === "success" ? <Check size={15} /> : <AlertCircle size={15} />}
      <span>{notice.message}</span><button onClick={onDismissNotice} aria-label="Dismiss notice"><X size={14} /></button>
    </div>}

    <section className="sb-project">
      <div className="sb-project-main">
        <span className="sb-kicker">PROJECT</span>
        <input aria-label="Project name" value={plan.project.name} onChange={(event) => onPlanChange({ ...plan, project: { ...plan.project, name: event.target.value } })} />
        <p>One card per scene. Every decision stays editable and tied to the same validated plan.</p>
      </div>
      <div className="sb-project-settings">
        <Field label="WIDTH"><NumberInput value={plan.project.width} min={1} onChange={(width) => onPlanChange({ ...plan, project: { ...plan.project, width } })} /></Field>
        <Field label="HEIGHT"><NumberInput value={plan.project.height} min={1} onChange={(height) => onPlanChange({ ...plan, project: { ...plan.project, height } })} /></Field>
        <Field label="FPS"><NumberInput value={plan.project.fps} min={1} step={0.1} onChange={(fps) => onPlanChange({ ...plan, project: { ...plan.project, fps } })} /></Field>
        <Field label="WORDS / CHUNK"><NumberInput value={plan.project.defaultCaptionWordsPerChunk} min={1} max={8} onChange={(defaultCaptionWordsPerChunk) => onPlanChange({ ...plan, project: { ...plan.project, defaultCaptionWordsPerChunk } })} /></Field>
      </div>
      <div className={"sb-validity " + (validation.success ? "valid" : "invalid")}>
        {validation.success ? <Check size={15} /> : <AlertCircle size={15} />}
        <span>{validation.success ? "PLAN VALID" : validation.error.issues.length + " PLAN ISSUES"}</span>
      </div>
    </section>

    {!sourceUrl && <div className="sb-source-callout">
      <div><strong>Source footage is not attached in this browser tab.</strong><span>Attach the original video once to generate real thumbnail frames for every scene.</span></div>
      <button className="sb-button secondary" onClick={() => openAssetPicker(plan.source.videoAssetId, "video/*")}><Film size={15} /> Attach source video</button>
    </div>}

    {!validation.success && <div className="sb-validation-list">
      {validation.error.issues.slice(0, 8).map((issue, index) => <p key={index}><AlertCircle size={13} /> {issue.path.join(".")}: {issue.message}</p>)}
    </div>}

    <section className="sb-storyboard-heading">
      <div><h1>Storyboard</h1><p>Review the visual story from first frame to last. Expand a scene to edit the actual plan data.</p></div>
      <span>{sceneCount} SHOTS · {timecode(plan.project.durationFrames, plan.project.fps)} TOTAL</span>
    </section>

    <div className="sb-scene-stack">
      {plan.scenes.map((scene, index) => {
        const alternative = activeAlternative(scene);
        const duration = (scene.endFrame - scene.startFrame) / plan.project.fps;
        return <article className="sb-scene" key={scene.id}>
          <div className="sb-scene-head">
            <div className="sb-shot-index">{String(index + 1).padStart(2, "0")}<small>SHOT</small></div>
            <div className="sb-shot-title">
              <input value={scene.name} aria-label={"Scene " + (index + 1) + " title"} onChange={(event) => mutateScene(scene.id, (current) => ({ ...current, name: event.target.value }))} />
              <div className="sb-shot-meta"><span>{timecode(scene.startFrame, plan.project.fps)} – {timecode(scene.endFrame, plan.project.fps)}</span><i /> <span>{duration.toFixed(2)}s</span><i /> <span>{scene.layout.replaceAll("-", " ").toUpperCase()}</span></div>
            </div>
            <div className="sb-scene-status">{scene.visual.type === "none" ? "SPEAKER-LED" : scene.visual.type.toUpperCase()}</div>
            <button className="sb-icon-button danger" title="Remove scene" disabled={sceneCount <= 1} onClick={() => onPlanChange({ ...plan, scenes: plan.scenes.filter((item) => item.id !== scene.id) })}><Trash2 size={15} /></button>
          </div>

          <div className="sb-scene-body">
            <div className="sb-scene-media">
              <SourceFrame url={sourceUrl} scene={scene} fps={plan.project.fps} />
              <div className="sb-media-caption"><span>FRAME AT {timecode(Math.round((scene.startFrame + scene.endFrame) / 2), plan.project.fps)}</span><span>{alternative ? alternative.compositionType.replaceAll("-", " ").toUpperCase() : "SOURCE FOOTAGE"}</span></div>
            </div>

            <div className="sb-scene-edit">
              <details className="sb-section" open>
                <summary><span><Layers3 size={14} /> Scene & timing</span><ChevronDown size={14} /></summary>
                <div className="sb-section-content">
                  <div className="sb-grid two">
                    <Field label="START FRAME"><NumberInput value={scene.startFrame} min={0} max={plan.project.durationFrames - 1} onChange={(value) => mutateScene(scene.id, (current) => ({ ...current, startFrame: value }))} /></Field>
                    <Field label="END FRAME"><NumberInput value={scene.endFrame} min={scene.startFrame + 1} max={plan.project.durationFrames} onChange={(value) => mutateScene(scene.id, (current) => ({ ...current, endFrame: value }))} /></Field>
                    <Field label="LAYOUT"><select value={scene.layout} onChange={(event) => mutateScene(scene.id, (current) => ({ ...current, layout: event.target.value as Scene["layout"] }))}>
                      <option value="full-speaker">Full speaker</option><option value="split-50-50">50 / 50 split</option><option value="full-canvas">Full canvas</option>
                    </select></Field>
                    <Field label="VISUAL TYPE"><select value={scene.visual.type} onChange={(event) => mutateScene(scene.id, (current) => ({ ...current, visual: { ...current.visual, type: event.target.value as Scene["visual"]["type"], selectedAlternativeId: event.target.value === "none" ? null : current.visual.selectedAlternativeId } }))}>
                      <option value="none">Speaker only</option><option value="typography">Typography</option><option value="diagram">Diagram</option><option value="image">Image</option><option value="object">Object</option><option value="ui">UI</option>
                    </select></Field>
                  </div>
                  <Field label="TRANSCRIPT EVIDENCE"><textarea rows={2} value={scene.transcriptEvidence.text} onChange={(event) => mutateScene(scene.id, (current) => ({ ...current, transcriptEvidence: { ...current.transcriptEvidence, text: event.target.value } }))} /></Field>
                  <div className="sb-grid two">
                    <Field label="SOURCE START (MS)"><NumberInput value={scene.transcriptEvidence.sourceStartMs} min={0} onChange={(value) => mutateScene(scene.id, (current) => ({ ...current, transcriptEvidence: { ...current.transcriptEvidence, sourceStartMs: value } }))} /></Field>
                    <Field label="SOURCE END (MS)"><NumberInput value={scene.transcriptEvidence.sourceEndMs} min={1} onChange={(value) => mutateScene(scene.id, (current) => ({ ...current, transcriptEvidence: { ...current.transcriptEvidence, sourceEndMs: value } }))} /></Field>
                  </div>
                </div>
              </details>

              <details className="sb-section" open>
                <summary><span><WandSparkles size={14} /> Visual direction & elements</span><ChevronDown size={14} /></summary>
                <div className="sb-section-content">
                  {scene.visual.alternatives.map((item) => <div className={"sb-alternative " + (item.id === scene.visual.selectedAlternativeId ? "selected" : "")} key={item.id}>
                    <div className="sb-alternative-head">
                      <button className="sb-choice" onClick={() => mutateScene(scene.id, (current) => ({ ...current, visual: { ...current.visual, selectedAlternativeId: item.id } }))}>
                        <span className="sb-choice-dot">{item.id === scene.visual.selectedAlternativeId ? <Check size={11} /> : null}</span>{item.label}
                      </button>
                      <button className="sb-text-button danger-text" onClick={() => mutateScene(scene.id, (current) => {
                        const alternatives = current.visual.alternatives.filter((alt) => alt.id !== item.id);
                        return { ...current, visual: { ...current.visual, alternatives, selectedAlternativeId: current.visual.selectedAlternativeId === item.id ? alternatives[0]?.id ?? null : current.visual.selectedAlternativeId, type: alternatives.length ? current.visual.type : "none" } };
                      })}>Remove</button>
                    </div>
                    <div className="sb-grid two">
                      <Field label="COMPOSITION NAME"><input value={item.label} onChange={(event) => mutateScene(scene.id, (current) => ({ ...current, visual: { ...current.visual, alternatives: current.visual.alternatives.map((alt) => alt.id === item.id ? { ...alt, label: event.target.value } : alt) } }))} /></Field>
                      <Field label="COMPOSITION"><select value={item.compositionType} onChange={(event) => mutateScene(scene.id, (current) => ({ ...current, visual: { ...current.visual, alternatives: current.visual.alternatives.map((alt) => alt.id === item.id ? { ...alt, compositionType: event.target.value as Alternative["compositionType"] } : alt) } }))}>
                        <option value="typography">Typography</option><option value="diagram">Diagram</option><option value="image-led">Image-led</option><option value="object-led">Object-led</option><option value="ui-card">UI card</option><option value="custom">Custom</option>
                      </select></Field>
                    </div>
                    <Field label="WHY THIS VISUAL"><textarea rows={2} value={item.rationale} onChange={(event) => mutateScene(scene.id, (current) => ({ ...current, visual: { ...current.visual, alternatives: current.visual.alternatives.map((alt) => alt.id === item.id ? { ...alt, rationale: event.target.value } : alt) } }))} /></Field>

                    {item.elements.map((element) => {
                      const style = element.style as Record<string, unknown>;
                      const motion = element.motion ?? { enter: "none" as const, exit: "none" as const, delayFrames: 0, durationFrames: 12 };
                      return <div className="sb-element" key={element.id}>
                        <div className="sb-element-head"><span>{element.kind.toUpperCase()} LAYER</span><button className="sb-text-button danger-text" onClick={() => mutateScene(scene.id, (current) => ({ ...current, visual: { ...current.visual, alternatives: current.visual.alternatives.map((alt) => alt.id === item.id ? { ...alt, elements: alt.elements.filter((layer) => layer.id !== element.id) } : alt) } }))}><Trash2 size={12} /> Delete layer</button></div>
                        {element.kind === "text" && <Field label="ON-SCREEN TEXT"><input value={element.text ?? ""} onChange={(event) => updateElement(scene.id, item.id, element.id, { text: event.target.value })} /></Field>}
                        {(element.kind === "image" || element.kind === "icon" || element.kind === "video") && <div className="sb-asset-row">
                          <Field label="ASSET ID"><input value={element.assetId ?? ""} onChange={(event) => updateElement(scene.id, item.id, element.id, { assetId: event.target.value })} /></Field>
                          <button className="sb-button small secondary" onClick={() => openAssetPicker(element.assetId ?? "", "image/*,video/*")}><ImagePlus size={13} /> Attach</button>
                        </div>}
                        <div className="sb-grid four">
                          <Field label="X %"><NumberInput value={element.x} min={0} max={100 - element.width} step={0.5} onChange={(value) => updateElement(scene.id, item.id, element.id, { x: value })} /></Field>
                          <Field label="Y %"><NumberInput value={element.y} min={0} max={100 - element.height} step={0.5} onChange={(value) => updateElement(scene.id, item.id, element.id, { y: value })} /></Field>
                          <Field label="WIDTH %"><NumberInput value={element.width} min={0.1} max={100 - element.x} step={0.5} onChange={(value) => updateElement(scene.id, item.id, element.id, { width: value })} /></Field>
                          <Field label="HEIGHT %"><NumberInput value={element.height} min={0.1} max={100 - element.y} step={0.5} onChange={(value) => updateElement(scene.id, item.id, element.id, { height: value })} /></Field>
                        </div>
                        <div className="sb-grid four">
                          <Field label="ROTATION"><NumberInput value={element.rotation ?? 0} min={-360} max={360} onChange={(value) => updateElement(scene.id, item.id, element.id, { rotation: value })} /></Field>
                          <Field label="OPACITY"><NumberInput value={element.opacity ?? 1} min={0} max={1} step={0.05} onChange={(value) => updateElement(scene.id, item.id, element.id, { opacity: value })} /></Field>
                          <Field label="TEXT COLOR"><input type="color" value={String(style.color ?? "#ffffff").match(/^#[0-9a-fA-F]{6}$/) ? String(style.color) : "#ffffff"} onChange={(event) => updateElement(scene.id, item.id, element.id, { style: { ...style, color: event.target.value } })} /></Field>
                          <Field label="FILL"><input type="color" value={String(style.background ?? "#202733").match(/^#[0-9a-fA-F]{6}$/) ? String(style.background) : "#202733"} onChange={(event) => updateElement(scene.id, item.id, element.id, { style: { ...style, background: event.target.value } })} /></Field>
                        </div>
                        <div className="sb-grid four">
                          <Field label="ENTER"><select value={motion.enter} onChange={(event) => updateElement(scene.id, item.id, element.id, { motion: { ...motion, enter: event.target.value as typeof motion.enter } })}>
                            <option value="none">None</option><option value="fade">Fade</option><option value="rise">Rise</option><option value="slide-left">Slide left</option><option value="slide-right">Slide right</option><option value="scale">Scale</option><option value="pop">Pop</option>
                          </select></Field>
                          <Field label="EXIT"><select value={motion.exit} onChange={(event) => updateElement(scene.id, item.id, element.id, { motion: { ...motion, exit: event.target.value as typeof motion.exit } })}>
                            <option value="none">None</option><option value="fade">Fade</option><option value="drop">Drop</option>
                          </select></Field>
                          <Field label="DELAY FRAMES"><NumberInput value={motion.delayFrames} min={0} onChange={(value) => updateElement(scene.id, item.id, element.id, { motion: { ...motion, delayFrames: value } })} /></Field>
                          <Field label="DURATION"><NumberInput value={motion.durationFrames} min={1} max={90} onChange={(value) => updateElement(scene.id, item.id, element.id, { motion: { ...motion, durationFrames: value } })} /></Field>
                        </div>
                      </div>;
                    })}
                    <button className="sb-add-link" onClick={() => addTextElement(scene.id, item.id)}><Plus size={13} /> Add text / graphic layer</button>
                  </div>)}
                  <button className="sb-add-link" onClick={() => addAlternative(scene.id)}><Plus size={14} /> Add visual direction alternative</button>
                </div>
              </details>

              <details className="sb-section" open>
                <summary><span><Scissors size={14} /> Captions & typography</span><ChevronDown size={14} /></summary>
                <div className="sb-section-content">
                  <label className="sb-toggle"><input type="checkbox" checked={scene.captions.enabled} onChange={(event) => mutateScene(scene.id, (current) => ({ ...current, captions: { ...current.captions, enabled: event.target.checked } }))} /><span>Show captions in this scene</span></label>
                  <div className="sb-grid four">
                    <Field label="FONT FAMILY"><input value={scene.captions.style.fontFamily} onChange={(event) => mutateScene(scene.id, (current) => ({ ...current, captions: { ...current.captions, style: { ...current.captions.style, fontFamily: event.target.value } } }))} /></Field>
                    <Field label="SIZE"><NumberInput value={scene.captions.style.fontSize} min={1} onChange={(value) => mutateScene(scene.id, (current) => ({ ...current, captions: { ...current.captions, style: { ...current.captions.style, fontSize: value } } }))} /></Field>
                    <Field label="WEIGHT"><NumberInput value={scene.captions.style.fontWeight} min={100} max={900} step={100} onChange={(value) => mutateScene(scene.id, (current) => ({ ...current, captions: { ...current.captions, style: { ...current.captions.style, fontWeight: value } } }))} /></Field>
                    <Field label="ANIMATION"><select value={scene.captions.style.animation} onChange={(event) => mutateScene(scene.id, (current) => ({ ...current, captions: { ...current.captions, style: { ...current.captions.style, animation: event.target.value as Scene["captions"]["style"]["animation"] } } }))}>
                      <option value="word-pop">Word pop</option><option value="fade">Fade</option><option value="slide">Slide</option><option value="none">None</option>
                    </select></Field>
                  </div>
                  <div className="sb-grid three">
                    <Field label="TEXT COLOR"><input type="color" value={scene.captions.style.textColor} onChange={(event) => mutateScene(scene.id, (current) => ({ ...current, captions: { ...current.captions, style: { ...current.captions.style, textColor: event.target.value } } }))} /></Field>
                    <Field label="HIGHLIGHT COLOR"><input type="color" value={scene.captions.style.highlightColor} onChange={(event) => mutateScene(scene.id, (current) => ({ ...current, captions: { ...current.captions, style: { ...current.captions.style, highlightColor: event.target.value } } }))} /></Field>
                    <Field label="POSITION"><select value={scene.captions.style.position} onChange={(event) => mutateScene(scene.id, (current) => ({ ...current, captions: { ...current.captions, style: { ...current.captions.style, position: event.target.value as Scene["captions"]["style"]["position"] } } }))}>
                      <option value="top">Top</option><option value="center">Center</option><option value="bottom">Bottom</option>
                    </select></Field>
                  </div>
                  <div className="sb-caption-list">
                    {scene.captions.chunks.map((chunk, chunkIndex) => <div className="sb-caption-chunk" key={chunk.id}>
                      <div className="sb-chunk-top"><strong>CAPTION {String(chunkIndex + 1).padStart(2, "0")}</strong><span>{timecode(chunk.startFrame, plan.project.fps)} — {timecode(chunk.endFrame, plan.project.fps)}</span></div>
                      <div className="sb-grid two">
                        <Field label="START FRAME"><NumberInput value={chunk.startFrame} min={scene.startFrame} max={chunk.endFrame - 1} onChange={(value) => updateChunk(scene.id, chunk.id, { startFrame: value })} /></Field>
                        <Field label="END FRAME"><NumberInput value={chunk.endFrame} min={chunk.startFrame + 1} max={scene.endFrame} onChange={(value) => updateChunk(scene.id, chunk.id, { endFrame: value })} /></Field>
                      </div>
                      <div className="sb-word-list">{chunk.words.map((word, wordIndex) => <div className="sb-word-row" key={word.id}>
                        <input aria-label="Caption word" value={word.text} onChange={(event) => updateChunk(scene.id, chunk.id, { words: chunk.words.map((item) => item.id === word.id ? { ...item, text: event.target.value } : item) })} />
                        <label className="sb-word-highlight" title="Highlight word"><input type="checkbox" checked={word.highlighted} onChange={(event) => updateChunk(scene.id, chunk.id, { words: chunk.words.map((item) => item.id === word.id ? { ...item, highlighted: event.target.checked } : item) })} /><span>H</span></label>
                        {wordIndex > 0 && <button className="sb-mini" title="Split caption before this word" onClick={() => splitChunk(scene.id, chunk, wordIndex)}><Scissors size={12} /></button>}
                      </div>)}</div>
                      <div className="sb-chunk-actions">
                        <button className="sb-text-button" disabled={chunkIndex === scene.captions.chunks.length - 1} onClick={() => mergeChunk(scene.id, chunk.id)}>Merge with next</button>
                        <button className="sb-text-button danger-text" onClick={() => mutateScene(scene.id, (current) => ({ ...current, captions: { ...current.captions, chunks: current.captions.chunks.filter((item) => item.id !== chunk.id) } }))}>Remove chunk</button>
                      </div>
                    </div>)}
                    <button className="sb-add-link" onClick={() => {
                      const startFrame = scene.captions.chunks[scene.captions.chunks.length - 1]?.endFrame ?? scene.startFrame;
                      if (startFrame >= scene.endFrame) return;
                      const chunk: CaptionChunk = { id: makeId("caption"), startFrame, endFrame: scene.endFrame, words: [{ id: makeId("word"), text: "New", highlighted: false }] };
                      mutateScene(scene.id, (current) => ({ ...current, captions: { ...current.captions, chunks: [...current.captions.chunks, chunk] } }));
                    }}><Plus size={13} /> Add caption chunk</button>
                  </div>
                </div>
              </details>

              <details className="sb-section">
                <summary><span><WandSparkles size={14} /> Camera movement</span><ChevronDown size={14} /></summary>
                <div className="sb-section-content">
                  <label className="sb-toggle"><input type="checkbox" checked={scene.cameraMotion.enabled} onChange={(event) => mutateScene(scene.id, (current) => ({ ...current, cameraMotion: { ...current.cameraMotion, enabled: event.target.checked, type: current.cameraMotion.type ?? "zoom-in" } }))} /><span>Enable camera movement for this scene</span></label>
                  <div className="sb-grid two">
                    <Field label="MOVEMENT"><select value={scene.cameraMotion.type ?? "zoom-in"} disabled={!scene.cameraMotion.enabled} onChange={(event) => mutateScene(scene.id, (current) => ({ ...current, cameraMotion: { ...current.cameraMotion, type: event.target.value as Scene["cameraMotion"]["type"] } }))}>
                      <option value="zoom-in">Zoom in</option><option value="zoom-out">Zoom out</option><option value="pan-left">Pan left</option><option value="pan-right">Pan right</option>
                    </select></Field>
                    <Field label={"INTENSITY · " + Math.round(scene.cameraMotion.intensity * 100) + "%"}><input className="sb-range" type="range" min={0} max={1} step={0.01} value={scene.cameraMotion.intensity} disabled={!scene.cameraMotion.enabled} onChange={(event) => mutateScene(scene.id, (current) => ({ ...current, cameraMotion: { ...current.cameraMotion, intensity: Number(event.target.value) } }))} /></Field>
                  </div>
                </div>
              </details>

              <details className="sb-section">
                <summary><span><Volume2 size={14} /> Sound design</span><ChevronDown size={14} /></summary>
                <div className="sb-section-content">
                  {scene.soundEffects.map((cue, cueIndex) => <div className="sb-cue" key={cue.id}>
                    <div className="sb-element-head"><span>SOUND CUE {cueIndex + 1}</span><button className="sb-text-button danger-text" onClick={() => mutateScene(scene.id, (current) => ({ ...current, soundEffects: current.soundEffects.filter((item) => item.id !== cue.id) }))}><Trash2 size={12} /> Remove</button></div>
                    <label className="sb-toggle"><input type="checkbox" checked={cue.enabled} onChange={(event) => updateCue(scene.id, cue.id, { enabled: event.target.checked })} /><span>Enabled in final render</span></label>
                    <div className="sb-asset-row">
                      <Field label="ASSET ID"><input value={cue.assetId} onChange={(event) => updateCue(scene.id, cue.id, { assetId: event.target.value })} /></Field>
                      <button className="sb-button small secondary" onClick={() => openAssetPicker(cue.assetId, "audio/*")}><Upload size={13} /> Attach audio</button>
                    </div>
                    {assetUrls[cue.assetId] ? <span className="sb-attached"><Check size={12} /> Audio attached in this tab</span> : <span className="sb-missing">Audio file not attached · this cue cannot render yet</span>}
                    <div className="sb-grid three">
                      <Field label="START FRAME"><NumberInput value={cue.startFrame} min={scene.startFrame} max={scene.endFrame - 1} onChange={(value) => updateCue(scene.id, cue.id, { startFrame: value })} /></Field>
                      <Field label="DURATION"><NumberInput value={cue.durationFrames} min={1} max={scene.endFrame - cue.startFrame} onChange={(value) => updateCue(scene.id, cue.id, { durationFrames: value })} /></Field>
                      <Field label={"LEVEL · " + cue.volumeDb + " dB"}><input className="sb-range" type="range" min={-60} max={6} step={1} value={cue.volumeDb} onChange={(event) => updateCue(scene.id, cue.id, { volumeDb: Number(event.target.value) })} /></Field>
                    </div>
                  </div>)}
                  <button className="sb-add-link" onClick={() => addCue(scene.id)}><Plus size={13} /> Add sound cue</button>
                </div>
              </details>
            </div>
          </div>
        </article>;
      })}
    </div>

    <footer className="sb-footer">
      <span><span className="sb-live-dot" /> LOCAL STORYBOARD WORKSPACE</span>
      <span>{attachedCount} MEDIA FILES ATTACHED IN THIS TAB</span>
      <button className="sb-button primary" onClick={onExportPlan}><FileJson size={14} /> Export validated JSON</button>
    </footer>
  </main>;
}
