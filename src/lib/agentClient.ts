import { invoke } from "@tauri-apps/api/core";

export type AgentEvent = {
  kind: "agent" | "status" | "tool";
  content: string;
};

export async function runAgent(prompt: string) {
  return invoke<AgentEvent[]>("run_agent", { prompt });
}
