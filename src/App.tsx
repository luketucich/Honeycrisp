import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import type { ReactZoomPanPinchContentRef } from "react-zoom-pan-pinch";
import { AppTitleBar } from "./components/AppTitleBar";
import { ChatRail } from "./components/ChatRail";
import { SidebarResizeHandle } from "./components/SidebarResizeHandle";
import { WorkspaceCanvas } from "./components/WorkspaceCanvas";
import { TooltipProvider } from "./components/ui/tooltip";
import { useResizableSidebar } from "./hooks/useResizableSidebar";
import { runAgent } from "./lib/agentClient";
import { resetCanvas, zoomCanvas } from "./lib/canvasControls";
import { createMessage } from "./lib/messages";
import type { ChatMessage } from "../types/chat";

const AGENT_BRIDGE_ERROR_MESSAGE = "I could not reach the Tauri agent bridge.";
const SIDEBAR_MOTION = {
  damping: 36,
  mass: 0.85,
  stiffness: 420,
  type: "spring",
} as const;

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const sidebar = useResizableSidebar();
  const canvasControlsRef = useRef<ReactZoomPanPinchContentRef | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const sidebarTransition =
    shouldReduceMotion || sidebar.isResizing ? { duration: 0 } : SIDEBAR_MOTION;

  function sendPrompt(formData: FormData) {
    const content = String(formData.get("prompt") ?? "").trim();

    if (!content || isThinking) {
      return;
    }

    setPrompt("");
    setMessages((messages) => [...messages, createMessage("user", content)]);
    setIsThinking(true);

    void loadAgentResponse(content);
  }

  async function loadAgentResponse(content: string) {
    try {
      const agentEvents = await runAgent(content);
      const agentMessages = agentEvents.map((event) =>
        createMessage(event.kind, event.content),
      );

      setMessages((messages) => [...messages, ...agentMessages]);
    } catch {
      setMessages((messages) => [
        ...messages,
        createMessage("agent", AGENT_BRIDGE_ERROR_MESSAGE),
      ]);
    } finally {
      setIsThinking(false);
    }
  }

  return (
    <TooltipProvider>
      <main className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
        <AppTitleBar
          isSidebarVisible={isSidebarVisible}
          onResetCanvas={() => resetCanvas(canvasControlsRef.current)}
          onToggleSidebar={() => setIsSidebarVisible((isVisible) => !isVisible)}
          onZoomIn={() => zoomCanvas(canvasControlsRef.current, "in")}
          onZoomOut={() => zoomCanvas(canvasControlsRef.current, "out")}
        />

        <div className="flex min-h-0 flex-1">
          <AnimatePresence initial={false}>
            {isSidebarVisible ? (
              <motion.div
                animate={{ opacity: 1, width: sidebar.width }}
                className="flex min-h-0 shrink-0 overflow-hidden"
                exit={{ opacity: 0, width: 0 }}
                initial={{ opacity: 0, width: 0 }}
                transition={sidebarTransition}
              >
                <ChatRail
                  messages={messages}
                  prompt={prompt}
                  isThinking={isThinking}
                  onPromptChange={setPrompt}
                  onSubmitPrompt={sendPrompt}
                />

                <SidebarResizeHandle
                  onPointerDown={sidebar.startResize}
                  onResizeBy={sidebar.resizeBy}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>

          <WorkspaceCanvas controlsRef={canvasControlsRef} />
        </div>
      </main>
    </TooltipProvider>
  );
}

export default App;
