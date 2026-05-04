# Honeycrisp

Honeycrisp is an early Mac desktop app experiment for generating native SwiftUI interfaces from prompts.

The app is inspired by [Open Design](https://github.com/nexu-io/open-design), but the target is narrower: instead of exporting HTML, decks, PDFs, ZIPs, or Markdown, Honeycrisp focuses on polished mobile app UI and native Swift output.

## Direction

The current architecture is:

- Tauri for the Mac app shell
- React + TypeScript for the interface
- Node + TypeScript for the local agent runtime
- Claude Code CLI as the first real agent backend
- SwiftUI as the generated output
- Xcode and Simulator validation later

The first goal is not to build a giant design tool. It is to prove one high-quality loop:

```txt
prompt -> Claude Code CLI -> SwiftUI files -> Xcode validation -> screenshot preview
```

## Current Status

As of Monday, May 4, 2026:

- Tauri + React + TypeScript scaffold is running
- Chat rail supports user, agent, status, and tool-style messages
- React can call Tauri
- Tauri can forward a prompt to a small Node/TypeScript runner
- The current agent events are fake placeholders
- The next milestone is replacing the fake runner with Claude Code CLI

## Docs

- [Architecture](docs/architecture.md)
- [Roadmap](docs/roadmap.md)

## Development

```bash
npm install
npm run tauri:dev
```
