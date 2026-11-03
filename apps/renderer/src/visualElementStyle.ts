type VisualElementGeometry = {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  opacity: number;
  rotation: number;
  style: Record<string, unknown>;
};

const geometryOwnedProperties = new Set([
  "position",
  "left",
  "right",
  "top",
  "bottom",
  "inset",
  "width",
  "height",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
  "zIndex",
  "opacity",
  "transform",
  "transformOrigin",
  "boxSizing",
  "overflow",
]);

/**
 * Scene-plan geometry is the source of truth for an element's placement.
 * Appearance styles may decorate an element but cannot silently move,
 * resize, hide, or reorder it by overriding its structured geometry.
 */
export function getVisualElementStyle(element: VisualElementGeometry) {
  const appearance = Object.fromEntries(
    Object.entries(element.style ?? {}).filter(
      ([property, value]) =>
        !geometryOwnedProperties.has(property) && value !== undefined,
    ),
  );

  return {
    ...appearance,
    position: "absolute" as const,
    left: `${element.x}%`,
    top: `${element.y}%`,
    width: `${element.width}%`,
    height: `${element.height}%`,
    zIndex: element.zIndex,
    opacity: element.opacity,
    transform: `rotate(${element.rotation}deg)`,
    boxSizing: "border-box" as const,
    overflow: "hidden" as const,
  };
}
