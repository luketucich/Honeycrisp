import type { CSSProperties } from "react";
import {
  CANVAS_PREVIEW_SIZE,
  CANVAS_SIZE,
} from "../lib/canvasControls";

const PREVIEW_CARD_STYLE = {
  height: CANVAS_PREVIEW_SIZE.height,
  left: (CANVAS_SIZE.width - CANVAS_PREVIEW_SIZE.width) / 2,
  top: (CANVAS_SIZE.height - CANVAS_PREVIEW_SIZE.height) / 2,
  width: CANVAS_PREVIEW_SIZE.width,
} satisfies CSSProperties;

export function CanvasPreview() {
  return (
    <div
      className="absolute flex items-center justify-center rounded-[2rem] border bg-card/80 p-8 text-center shadow-sm"
      style={PREVIEW_CARD_STYLE}
    >
      <p className="text-sm font-medium">No screens yet</p>
    </div>
  );
}
