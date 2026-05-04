export type AgentEvent = {
  kind: "agent" | "status" | "tool";
  content: string;
};

// This is the future Honeycrisp agent loop.
// For now, it only returns fake events so we can test the event streaming and Tauri integration.
export async function* runAgent(prompt: string): AsyncGenerator<AgentEvent> {
  const cleanPrompt = prompt.trim();

  if (!cleanPrompt) {
    return;
  }

  yield {
    kind: "status",
    content: `Received prompt: ${cleanPrompt}`,
  };

  yield {
    kind: "tool",
    content: `Generated SwiftUI file for prompt: ${cleanPrompt}`,
  };
}
