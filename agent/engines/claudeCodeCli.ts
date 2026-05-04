import { execFileSync, spawn } from "node:child_process";

// Claude Code CLI flags:
// https://code.claude.com/docs/en/cli-reference
//
// Open Design uses the same basic approach:
// claude -p --output-format stream-json --verbose
const CLAUDE_STREAM_ARGS = [
  "-p", // Run once instead of opening the interactive terminal UI.
  "--output-format", // Choose the output format for print mode.
  "stream-json", // Emit one JSON event per line.
  "--verbose", // Include richer tool and turn details.
];

// Quick install check used before we try to run the agent.
export function getClaudeVersion(): string | null {
  try {
    return execFileSync("claude", ["--version"], {
      encoding: "utf8",
    }).trim();
  } catch {
    return null;
  }
}

// Starts Claude Code and sends the prompt through stdin.
export function runClaudeCli(prompt: string) {
  const child = spawn("claude", CLAUDE_STREAM_ARGS, {
    // stdin: prompt in, stdout: JSON events out, stderr: debug/errors out.
    stdio: ["pipe", "pipe", "pipe"],
  });

  child.stdin.end(prompt);

  return child;
}
