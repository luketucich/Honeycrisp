import { Minus, PanelLeft, Plus, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";

type AppTitleBarProps = {
  isSidebarVisible: boolean;
  onResetCanvas: () => void;
  onToggleSidebar: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export function AppTitleBar({
  isSidebarVisible,
  onResetCanvas,
  onToggleSidebar,
  onZoomIn,
  onZoomOut,
}: AppTitleBarProps) {
  return (
    <header className="flex h-12 shrink-0 items-center border-b bg-background">
      <div className="flex items-center pl-[92px] pr-2">
        <TitleBarButton
          label={isSidebarVisible ? "Hide sidebar" : "Show sidebar"}
          onClick={onToggleSidebar}
        >
          <PanelLeft data-icon="inline-start" />
        </TitleBarButton>
      </div>

      <div className="min-w-0 flex-1 self-stretch" data-tauri-drag-region />

      <div className="flex items-center gap-1 pr-3">
        <TitleBarButton label="Zoom out" onClick={onZoomOut}>
          <Minus data-icon="inline-start" />
        </TitleBarButton>
        <TitleBarButton label="Reset canvas" onClick={onResetCanvas}>
          <RotateCcw data-icon="inline-start" />
        </TitleBarButton>
        <TitleBarButton label="Zoom in" onClick={onZoomIn}>
          <Plus data-icon="inline-start" />
        </TitleBarButton>
      </div>
    </header>
  );
}

type TitleBarButtonProps = {
  children: ReactNode;
  label: string;
  onClick: () => void;
};

function TitleBarButton({ children, label, onClick }: TitleBarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={label}
          onClick={onClick}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
