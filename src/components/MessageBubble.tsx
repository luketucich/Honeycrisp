import type { ChatMessage, ChatMessageKind } from "../../types/chat";

const MESSAGE_LABELS: Record<ChatMessageKind, string> = {
  user: "You",
  agent: "Agent",
  status: "Status",
  tool: "Tool",
};

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={`message ${message.kind}`}>
      <span className="message-label">{MESSAGE_LABELS[message.kind]}</span>
      <p className="message-bubble">{message.content}</p>
    </div>
  );
}
