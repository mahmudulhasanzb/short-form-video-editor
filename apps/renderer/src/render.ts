import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { scenePlanSchema } from "@sfe/contracts";
import type { RenderInputProps } from "./types";
import { validateRenderAssets } from "./types";

const here = dirname(fileURLToPath(import.meta.url));

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(resolve(path), "utf8")) as unknown;
}

async function main() {
  const [planPath, assetManifestPath, outputPath] = process.argv.slice(2);
  if (!planPath || !assetManifestPath || !outputPath) {
    throw new Error(
      "Usage: pnpm --filter @sfe/renderer render -- <scene-plan.json> <asset-manifest.json> <output.mp4>",
    );
  }

  const plan = scenePlanSchema.parse(await readJson(planPath));
  const rawAssets = await readJson(assetManifestPath);
  if (!rawAssets || typeof rawAssets !== "object" || Array.isArray(rawAssets)) {
    throw new Error("Asset manifest must be a JSON object mapping asset IDs to file paths.");
  }

  const assets = Object.fromEntries(
    Object.entries(rawAssets).map(([id, value]) => {
      if (typeof value !== "string" || value.trim() === "") {
        throw new Error(`Asset manifest entry "${id}" must be a non-empty path string.`);
      }
      return [id, resolve(dirname(resolve(assetManifestPath)), value)];
    }),
  );

  const inputProps: RenderInputProps = { plan, assets };
  validateRenderAssets(inputProps);

  const serveUrl = await bundle({
    entryPoint: resolve(here, "index.ts"),
    onProgress: (progress) => {
      if (progress === 100) process.stdout.write("\n");
    },
  });

  const composition = await selectComposition({
    serveUrl,
    id: "ShortFormVideo",
    inputProps,
  });

  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation: resolve(outputPath),
    inputProps,
    onProgress: ({ progress }) => {
      process.stdout.write(`\rRendering: ${Math.round(progress * 100)}%`);
    },
  });

  process.stdout.write(`\nRender complete: ${resolve(outputPath)}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
