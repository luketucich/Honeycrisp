import { useEffect, type RefObject } from "react";
import type { ReactZoomPanPinchContentRef } from "react-zoom-pan-pinch";
import {
  CANVAS_SCALE_LIMITS,
  CANVAS_ZOOM_ANIMATION,
  WEBKIT_GESTURE_SENSITIVITY,
} from "../lib/canvasControls";
import { clamp } from "../lib/number";

type WebKitGestureEvent = Event & {
  clientX?: number;
  clientY?: number;
  scale?: number;
};

type GestureStart = {
  contentX: number;
  contentY: number;
  scale: number;
};

type PendingTransform = {
  positionX: number;
  positionY: number;
  scale: number;
};

export function useWebKitGestureZoom(
  viewportRef: RefObject<HTMLElement | null>,
  controlsRef: RefObject<ReactZoomPanPinchContentRef | null>,
) {
  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    let start: GestureStart | null = null;
    let frame = 0;
    let pending: PendingTransform | null = null;

    // Tauri's macOS webview emits native pinch gestures; the canvas library
    // handles the transform once we translate those gestures into scale changes.
    function flushTransform() {
      frame = 0;

      if (!pending) {
        return;
      }

      const { positionX, positionY, scale } = pending;
      pending = null;
      controlsRef.current?.setTransform(
        positionX,
        positionY,
        scale,
        0,
        CANVAS_ZOOM_ANIMATION,
      );
    }

    function queueTransform(transform: PendingTransform) {
      pending = transform;

      if (!frame) {
        frame = requestAnimationFrame(flushTransform);
      }
    }

    function handleGestureStart(event: Event) {
      const gestureEvent = event as WebKitGestureEvent;
      const controls = controlsRef.current;
      const wrapper = controls?.instance.wrapperComponent;

      if (!controls || !wrapper) {
        return;
      }

      event.preventDefault();

      const point = getEventPoint(gestureEvent, wrapper);
      const { positionX, positionY, scale } = controls.state;

      start = {
        contentX: (point.x - positionX) / scale,
        contentY: (point.y - positionY) / scale,
        scale,
      };
    }

    function handleGestureChange(event: Event) {
      const gestureEvent = event as WebKitGestureEvent;
      const wrapper = controlsRef.current?.instance.wrapperComponent;

      if (!start || !wrapper || typeof gestureEvent.scale !== "number") {
        return;
      }

      event.preventDefault();

      const point = getEventPoint(gestureEvent, wrapper);
      const nextScale = clamp(
        start.scale * Math.pow(gestureEvent.scale, WEBKIT_GESTURE_SENSITIVITY),
        CANVAS_SCALE_LIMITS.min,
        CANVAS_SCALE_LIMITS.max,
      );

      queueTransform({
        positionX: point.x - start.contentX * nextScale,
        positionY: point.y - start.contentY * nextScale,
        scale: nextScale,
      });
    }

    function handleGestureEnd(event: Event) {
      event.preventDefault();
      start = null;
    }

    viewport.addEventListener("gesturestart", handleGestureStart, {
      passive: false,
    });
    viewport.addEventListener("gesturechange", handleGestureChange, {
      passive: false,
    });
    viewport.addEventListener("gestureend", handleGestureEnd, {
      passive: false,
    });

    return () => {
      viewport.removeEventListener("gesturestart", handleGestureStart);
      viewport.removeEventListener("gesturechange", handleGestureChange);
      viewport.removeEventListener("gestureend", handleGestureEnd);

      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, [controlsRef, viewportRef]);
}

function getEventPoint(
  event: WebKitGestureEvent,
  wrapper: HTMLElement,
): { x: number; y: number } {
  const wrapperRect = wrapper.getBoundingClientRect();
  const clientX =
    typeof event.clientX === "number"
      ? event.clientX
      : wrapperRect.left + wrapperRect.width / 2;
  const clientY =
    typeof event.clientY === "number"
      ? event.clientY
      : wrapperRect.top + wrapperRect.height / 2;

  return {
    x: clientX - wrapperRect.left,
    y: clientY - wrapperRect.top,
  };
}
