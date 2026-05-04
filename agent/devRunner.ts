import { getClaudeVersion } from "./engines/claudeCodeCli.js";
import { runAgent } from "./runAgent.js";

async function main() {
  const claudeVersion = getClaudeVersion();

  if (!claudeVersion) {
    console.error("Claude Code CLI is required to run the agent.");
    process.exit(1);
  }

  console.error(`Claude Code CLI detected: ${claudeVersion}`);

  const prompt = process.argv.slice(2).join(" ").trim();

  if (!prompt) {
    console.error("Please pass a prompt.");
    process.exit(1);
  }

  for await (const event of runAgent(prompt)) {
    console.log(JSON.stringify(event));
  }
}

await main();
