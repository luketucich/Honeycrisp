import { motion } from "motion/react";
import type { ChatMessage, ChatMessageKind } from "../../types/chat";
import { cn } from "../lib/utils";

const MESSAGE_LABELS: Record<ChatMessageKind, string> = {
  user: "You",
  agent: "Agent",
  status: "Status",
  tool: "Tool",
};

const MESSAGE_STYLES: Record<ChatMessageKind, string> = {
  user: "bg-primary text-primary-foreground",
  agent: "border bg-card text-card-foreground",
  status: "border border-dashed bg-muted/40 text-muted-foreground",
  tool: "border bg-muted/60 font-mono text-xs text-muted-foreground",
};

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex max-w-[15rem] flex-col gap-1",
        message.kind === "user" ? "self-end text-right" : "self-start",
        message.kind === "status" && "max-w-full self-stretch text-center",
      )}
      initial={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
    >
      <span className="text-xs font-medium text-muted-foreground">
        {MESSAGE_LABELS[message.kind]}
      </span>
      <p
        className={cn(
          "whitespace-pre-wrap break-words rounded-xl px-3 py-2 text-sm leading-relaxed shadow-sm",
          MESSAGE_STYLES[message.kind],
        )}
      >
        {message.content}
      </p>
    </motion.div>
  );
}
