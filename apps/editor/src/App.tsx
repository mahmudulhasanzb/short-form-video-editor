import { useEffect, useRef, useState } from "react";
import { FileJson, FolderOpen, Layers3, Upload } from "lucide-react";
import { scenePlanSchema, type ScenePlan } from "@sfe/contracts";
import { StoryboardBoard } from "./StoryboardBoard";

type Notice = { kind: "success" | "error"; message: string };

export default function App() {
  const [plan, setPlan] = useState<ScenePlan | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [assetUrls, setAssetUrls] = useState<Record<string, string>>({});
  const planInput = useRef<HTMLInputElement>(null);
  const createdUrls = useRef<string[]>([]);

  useEffect(() => () => {
    createdUrls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  async function loadPlan(file?: File) {
    if (!file) return;
    try {
      const raw = JSON.parse(await file.text()) as unknown;
      const parsed = scenePlanSchema.parse(raw);
      setPlan(parsed);
      setNotice({ kind: "success", message: "Storyboard plan loaded and validated." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown validation error";
      setNotice({ kind: "error", message: "Could not open this scene plan: " + message });
    }
    if (planInput.current) planInput.current.value = "";
  }

  function attachAsset(assetId: string, file: File) {
    const url = URL.createObjectURL(file);
    createdUrls.current.push(url);
    setAssetUrls((current) => {
      const previous = current[assetId];
      if (previous) URL.revokeObjectURL(previous);
      return { ...current, [assetId]: url };
    });
    setNotice({ kind: "success", message: file.name + " attached for this storyboard session." });
  }

  function exportPlan() {
    if (!plan) return;
    const result = scenePlanSchema.safeParse(plan);
    if (!result.success) {
      setNotice({ kind: "error", message: "The plan has validation issues. Correct them before exporting." });
      return;
    }
    const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "scene-plan.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice({ kind: "success", message: "Validated scene-plan.json exported." });
  }

  if (!plan) {
    return <main className="sb-empty-app">
      <input ref={planInput} type="file" accept="application/json,.json" hidden onChange={(event) => void loadPlan(event.target.files?.[0])} />
      <div className="sb-empty-brand"><span><Layers3 size={19} /></span><div><strong>FRAME / STORYBOARD</strong><small>EDIT PLAN · SOURCE-GROUNDED</small></div></div>
      <section className="sb-empty-content">
        <div className="sb-empty-icon"><FileJson size={25} /></div>
        <p className="sb-empty-kicker">SCENE PLAN WORKSPACE</p>
        <h1>Open your storyboard</h1>
        <p>Load a validated scene-plan.json to review every shot as an editable storyboard card. Your source footage and assets stay on your device.</p>
        <button className="sb-button primary large" onClick={() => planInput.current?.click()}><FolderOpen size={16} /> Open scene plan</button>
        {notice && <div className={"sb-notice " + notice.kind}><span>{notice.message}</span></div>}
        <small>Nothing is rendered or uploaded when you open a plan.</small>
      </section>
    </main>;
  }

  return <StoryboardBoard
    plan={plan}
    assetUrls={assetUrls}
    onPlanChange={setPlan}
    onAttachAsset={attachAsset}
    onExportPlan={exportPlan}
    onOpenPlan={() => planInput.current?.click()}
    notice={notice}
    onDismissNotice={() => setNotice(null)}
    key={plan.project.id}
  />;
}
