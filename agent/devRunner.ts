import { runAgent } from "./runAgent.js";

// This file is a tiny command-line wrapper around the agent loop.
// Later, Tauri can run a file like this through Node.

const prompt = process.argv.slice(2).join(" ");

if (!prompt) {
  console.error("Please pass a prompt.");
  process.exit(1);
}

for await (const event of runAgent(prompt)) {
  console.log(JSON.stringify(event));
}
