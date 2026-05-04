import type { ReactZoomPanPinchContentRef } from "react-zoom-pan-pinch";
import { clamp } from "./number";

export const CANVAS_SCALE_LIMITS = {
  min: 0.25,
  max: 3,
} as const;

export const CANVAS_SIZE = {
  width: 2200,
  height: 1400,
} as const;

export const CANVAS_PREVIEW_SIZE = {
  width: 320,
  height: 560,
} as const;

export const CANVAS_GRID_SIZE = 24;
export const CANVAS_INITIAL_SCALE = 0.82;
export const CANVAS_ZOOM_ANIMATION = "easeOutCubic";
export const CANVAS_ZOOM_ANIMATION_MS = 280;
export const CANVAS_ZOOM_FACTOR = 1.2;
export const CANVAS_TOUCH_PINCH_STEP = 6;
export const CANVAS_WHEEL_ZOOM_STEP = (CANVAS_ZOOM_FACTOR - 1) / 14;
export const WEBKIT_GESTURE_SENSITIVITY = 1.12;

export const CANVAS_VELOCITY_ANIMATION = {
  animationTime: 420,
  animationType: CANVAS_ZOOM_ANIMATION,
  inertia: 0.68,
  maxAnimationTime: 860,
  maxStrengthMouse: 22,
  maxStrengthTouch: 32,
  sensitivityMouse: 0.82,
  sensitivityTouch: 1.08,
} as const;

export const CANVAS_ZOOM_ANIMATION_CONFIG = {
  animationTime: CANVAS_ZOOM_ANIMATION_MS,
  animationType: CANVAS_ZOOM_ANIMATION,
  size: 0.08,
} as const;

export function resetCanvas(controls: ReactZoomPanPinchContentRef | null) {
  controls?.resetTransform(CANVAS_ZOOM_ANIMATION_MS, CANVAS_ZOOM_ANIMATION);
}

export function zoomCanvas(
  controls: ReactZoomPanPinchContentRef | null,
  direction: "in" | "out",
) {
  const wrapper = controls?.instance.wrapperComponent;

  if (!controls || !wrapper) {
    return;
  }

  const { positionX, positionY, scale } = controls.state;
  const scaleFactor =
    direction === "in" ? CANVAS_ZOOM_FACTOR : 1 / CANVAS_ZOOM_FACTOR;
  const nextScale = clamp(
    scale * scaleFactor,
    CANVAS_SCALE_LIMITS.min,
    CANVAS_SCALE_LIMITS.max,
  );
  const centerX = wrapper.offsetWidth / 2;
  const centerY = wrapper.offsetHeight / 2;
  const contentCenterX = (centerX - positionX) / scale;
  const contentCenterY = (centerY - positionY) / scale;

  controls.setTransform(
    centerX - contentCenterX * nextScale,
    centerY - contentCenterY * nextScale,
    nextScale,
    CANVAS_ZOOM_ANIMATION_MS,
    CANVAS_ZOOM_ANIMATION,
  );
}
