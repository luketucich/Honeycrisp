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
- The UI has been rebuilt with Tailwind, shadcn/ui, Motion, Lucide, and a canvas workspace
- Chat rail supports user, agent, status, and tool-style messages
- The sidebar is resizable and the workspace uses zoom/pan canvas controls
- React can call Tauri
- Tauri can forward a prompt to a Node/TypeScript runner
- Node can detect and run Claude Code CLI
- Claude `stream-json` output is parsed into Honeycrisp events
- The current limitation is that the UI still receives events after Claude finishes
- The next milestone is live streaming from Claude back into React

## Docs

- [Architecture](docs/architecture.md)
- [Roadmap](docs/roadmap.md)

## Development

```bash
npm install
npm run tauri:dev
```
