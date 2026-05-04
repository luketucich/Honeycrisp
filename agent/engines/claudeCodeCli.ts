import { execFileSync } from "node:child_process";

export function getClaudeVersion(): string | null {
  try {
    return execFileSync("claude", ["--version"], {
      encoding: "utf8",
    }).trim();
  } catch {
    return null;
  }
}
