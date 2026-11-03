import type { CameraTransform } from "./cameraMotion";

export type SpeakerCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function getSpeakerFraming(
  crop: SpeakerCrop | undefined,
  camera: CameraTransform,
) {
  const cropScale = crop
    ? Math.max(100 / crop.width, 100 / crop.height)
    : 1;
  const objectPosition = crop
    ? `${crop.x + crop.width / 2}% ${crop.y + crop.height / 2}%`
    : "50% 50%";

  return {
    objectPosition,
    transform: `scale(${cropScale * camera.scale}) translateX(${camera.translateX}%)`,
    transformOrigin: "center center",
  };
}
