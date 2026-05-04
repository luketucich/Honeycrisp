export type AgentEventKind = "agent" | "status" | "tool";

export type AgentEvent = {
  kind: AgentEventKind;
  content: string;
};
