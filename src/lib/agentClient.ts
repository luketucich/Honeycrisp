import { invoke } from "@tauri-apps/api/core";
import type { AgentEvent } from "../../types/agent";

export type { AgentEvent };

export async function runAgent(prompt: string): Promise<AgentEvent[]> {
  return invoke<AgentEvent[]>("run_agent", { prompt });
}
