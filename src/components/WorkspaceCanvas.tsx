import { useRef, type CSSProperties, type RefObject } from "react";
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchContentRef,
} from "react-zoom-pan-pinch";
import { useWebKitGestureZoom } from "../hooks/useWebKitGestureZoom";
import {
  CANVAS_INITIAL_SCALE,
  CANVAS_TOUCH_PINCH_STEP,
  CANVAS_SCALE_LIMITS,
  CANVAS_SIZE,
  CANVAS_VELOCITY_ANIMATION,
  CANVAS_WHEEL_ZOOM_STEP,
  CANVAS_ZOOM_ANIMATION_CONFIG,
} from "../lib/canvasControls";
import { CanvasGrid } from "./CanvasGrid";
import { CanvasPreview } from "./CanvasPreview";

const CANVAS_CONTENT_STYLE = {
  height: CANVAS_SIZE.height,
  width: CANVAS_SIZE.width,
} satisfies CSSProperties;

const CANVAS_WRAPPER_STYLE = {
  height: "100%",
  width: "100%",
} satisfies CSSProperties;

type WorkspaceCanvasProps = {
  controlsRef: RefObject<ReactZoomPanPinchContentRef | null>;
};

export function WorkspaceCanvas({ controlsRef }: WorkspaceCanvasProps) {
  const viewportRef = useRef<HTMLElement | null>(null);

  useWebKitGestureZoom(viewportRef, controlsRef);

  return (
    <section
      className="relative min-w-0 flex-1 overflow-hidden overscroll-none bg-background"
      ref={viewportRef}
    >
      <TransformWrapper
        centerOnInit
        doubleClick={{ disabled: true }}
        initialScale={CANVAS_INITIAL_SCALE}
        limitToBounds={false}
        maxScale={CANVAS_SCALE_LIMITS.max}
        minScale={CANVAS_SCALE_LIMITS.min}
        panning={{
          allowMiddleClickPan: true,
          allowRightClickPan: false,
          velocityDisabled: false,
        }}
        ref={controlsRef}
        smooth
        pinch={{
          allowPanning: true,
          step: CANVAS_TOUCH_PINCH_STEP,
        }}
        trackPadPanning={{
          disabled: false,
          velocityDisabled: true,
        }}
        velocityAnimation={CANVAS_VELOCITY_ANIMATION}
        wheel={{
          step: CANVAS_WHEEL_ZOOM_STEP,
          wheelDisabled: true,
        }}
        zoomAnimation={CANVAS_ZOOM_ANIMATION_CONFIG}
      >
        <CanvasGrid />

        <TransformComponent
          contentClass="will-change-transform"
          contentStyle={CANVAS_CONTENT_STYLE}
          wrapperClass="cursor-grab touch-none active:cursor-grabbing"
          wrapperStyle={CANVAS_WRAPPER_STYLE}
        >
          <div className="relative h-full w-full">
            <CanvasPreview />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </section>
  );
}
