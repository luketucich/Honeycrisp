# Roadmap

Last updated: Monday, May 4, 2026

## Current Status

Honeycrisp is in the early local-agent phase. The Tauri desktop shell is running, the app has a polished dark Mac-style UI shell, a resizable chat rail, a canvas workspace, and typed agent/status/tool messages.

React can call Tauri, Tauri can forward a prompt to Node/TypeScript, and Node can run Claude Code CLI in `stream-json` mode. The current limitation is that React still receives the agent events after the run completes instead of receiving them live as Claude produces them.

## Phase 0: Planning

- [x] Create repository
- [x] Add initial `.gitignore`
- [x] Analyze Open Design architecture
- [x] Define Honeycrisp architecture
- [x] Write README
- [x] Write architecture document

## Phase 1: App Scaffold

- [x] Scaffold Tauri + React + TypeScript app
- [x] Add basic desktop shell
- [x] Add first prompt composer interaction
- [x] Add chat rail message states
- [x] Add polished desktop app shell with Tailwind, shadcn/ui, Motion, and Lucide
- [x] Add resizable chat rail and canvas workspace
- [ ] Add local app settings
- [ ] Add project layout and navigation

## Phase 2: Local Agent Runtime

- [x] Add Tauri agent bridge
- [x] Add minimal Node/TypeScript agent runner
- [x] Forward Tauri command to Node runner
- [x] Detect local Claude Code CLI
- [x] Add Claude Code CLI engine
- [x] Parse Claude Code `stream-json` events
- [x] Map Claude events into Honeycrisp `agent`, `status`, and `tool` events
- [x] Add first real prompt composer path through Claude Code CLI
- [ ] Stream agent events live to React
- [ ] Keep a persistent agent session instead of starting fresh each prompt
- [ ] Add local project workspace

## Phase 3: SwiftUI Generation

- [ ] Create first SwiftUI skill
- [ ] Compose Honeycrisp system prompt from skill, project context, and user request
- [ ] Generate one native iOS screen
- [ ] Add SwiftUI theme tokens
- [ ] Add generated file manifest

## Phase 4: Validation

- [ ] Add Xcode build validation
- [ ] Add Simulator screenshot capture
- [ ] Show build status and preview in app
