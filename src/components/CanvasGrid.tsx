import { useCallback, useRef } from "react";
import {
  useTransformEffect,
  type ReactZoomPanPinchContextState,
} from "react-zoom-pan-pinch";
import { CANVAS_GRID_SIZE } from "../lib/canvasControls";

export function CanvasGrid() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const syncGrid = useCallback(({ state }: ReactZoomPanPinchContextState) => {
    const grid = gridRef.current;

    if (!grid) {
      return;
    }

    const scaledGridSize = CANVAS_GRID_SIZE * state.scale;

    grid.style.backgroundPosition = `${state.positionX}px ${state.positionY}px`;
    grid.style.backgroundSize = `${scaledGridSize}px ${scaledGridSize}px`;
  }, []);

  useTransformEffect(syncGrid);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.105)_1px,transparent_1px)]"
      ref={gridRef}
      style={{
        backgroundSize: `${CANVAS_GRID_SIZE}px ${CANVAS_GRID_SIZE}px`,
      }}
    />
  );
}
