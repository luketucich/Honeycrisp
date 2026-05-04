import type { ChatMessage, ChatMessageKind } from "../../types/chat";

export function createMessage(
  kind: ChatMessageKind,
  content: string,
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    kind,
    content,
  };
}
