import { runClaudeCli } from "./engines/claudeCodeCli.js";

export type AgentEvent = {
  kind: "agent" | "status" | "tool";
  content: string;
};

// Minimal subset of Claude Code's stream-json shape that Honeycrisp uses today.
type ClaudeContentBlock = {
  type?: string;
  text?: string;
  name?: string;
  is_error?: boolean;
};

type ClaudeRawEvent = {
  type?: string;
  subtype?: string;
  model?: string;
  message?: {
    content?: ClaudeContentBlock[];
  };
  is_error?: boolean;
  duration_ms?: number;
};

// Runs the selected agent backend and translates its output into Honeycrisp events.
export async function* runAgent(prompt: string): AsyncGenerator<AgentEvent> {
  const cleanPrompt = prompt.trim();

  if (!cleanPrompt) {
    return;
  }

  const claudeProcess = runClaudeCli(cleanPrompt);

  claudeProcess.stderr.on("data", (chunk) => {
    console.error(chunk.toString());
  });

  for await (const line of readLines(claudeProcess.stdout)) {
    for (const event of parseClaudeLine(line)) {
      yield event;
    }
  }
}

async function* readLines(
  stream: AsyncIterable<Buffer | string>,
): AsyncGenerator<string> {
  let buffer = "";

  for await (const chunk of stream) {
    buffer += chunk.toString();

    // stdout arrives as arbitrary chunks, so split only on complete lines.
    let newlineIndex = buffer.indexOf("\n");

    while (newlineIndex !== -1) {
      yield buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);
      newlineIndex = buffer.indexOf("\n");
    }
  }

  // Parse any final line that did not end with a newline.
  if (buffer.trim()) {
    yield buffer.trim();
  }
}

function parseClaudeLine(line: string): AgentEvent[] {
  if (!line) {
    return [];
  }

  try {
    return mapClaudeEvent(JSON.parse(line) as ClaudeRawEvent);
  } catch (error) {
    console.error("Error parsing Claude CLI output:", error);
    return [];
  }
}

function mapClaudeEvent(event: ClaudeRawEvent): AgentEvent[] {
  if (event.type === "system" && event.subtype === "init") {
    return [
      {
        kind: "status",
        content: `Claude Code initialized${event.model ? ` with ${event.model}` : ""}.`,
      },
    ];
  }

  if (event.type === "assistant") {
    return (event.message?.content ?? []).flatMap(mapClaudeContentBlock);
  }

  if (event.type === "result") {
    return [
      {
        kind: "status",
        content: event.is_error
          ? "Claude Code finished with an error."
          : formatCompletionStatus(event.duration_ms),
      },
    ];
  }

  return [];
}

function mapClaudeContentBlock(block: ClaudeContentBlock): AgentEvent[] {
  if (block.type === "text" && block.text) {
    return [{ kind: "agent", content: block.text }];
  }

  if (block.type === "tool_use" && block.name) {
    return [
      {
        kind: "tool",
        content: `Used ${block.name}.`,
      },
    ];
  }

  if (block.type === "tool_result") {
    return [
      {
        kind: "tool",
        content: block.is_error
          ? "Tool returned an error."
          : "Tool returned a result.",
      },
    ];
  }

  return [];
}

function formatCompletionStatus(durationMs?: number): string {
  if (typeof durationMs !== "number") {
    return "Claude Code completed.";
  }

  return `Claude Code completed in ${(durationMs / 1000).toFixed(1)}s.`;
}
