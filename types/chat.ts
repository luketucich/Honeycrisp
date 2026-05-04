import type { AgentEventKind } from "./agent.js";

export type ChatMessageKind = "user" | AgentEventKind;

export type ChatMessage = {
  id: string;
  kind: ChatMessageKind;
  content: string;
};
