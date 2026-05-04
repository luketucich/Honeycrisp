import type {
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";

const KEYBOARD_RESIZE_STEP = 16;

type SidebarResizeHandleProps = {
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onResizeBy: (delta: number) => void;
};

export function SidebarResizeHandle({
  onPointerDown,
  onResizeBy,
}: SidebarResizeHandleProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onResizeBy(-KEYBOARD_RESIZE_STEP);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      onResizeBy(KEYBOARD_RESIZE_STEP);
    }
  }

  return (
    <div
      aria-label="Resize sidebar"
      aria-orientation="vertical"
      className="group relative z-20 w-px shrink-0 cursor-col-resize bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      onKeyDown={handleKeyDown}
      onPointerDown={onPointerDown}
      role="separator"
      tabIndex={0}
    >
      <div className="absolute -left-1.5 top-0 h-full w-3 transition-colors group-hover:bg-ring/10" />
    </div>
  );
}
