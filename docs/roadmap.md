# Roadmap

Last updated: Monday, May 4, 2026

## Current Status

Honeycrisp is in the early local-agent phase. The Tauri desktop shell is running, the chat rail has typed agent/status/tool messages, and React can call a small Tauri command that forwards through Node/TypeScript and returns fake agent events.

The next backend target is Claude Code CLI first. Honeycrisp should detect the user's installed `claude` command, run it inside a local project workspace, parse its `stream-json` output, and translate that into Honeycrisp UI events.

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
- [ ] Add project layout and navigation
- [ ] Add local app settings

## Phase 2: Local Agent Runtime

- [x] Add Tauri agent bridge
- [x] Add minimal Node/TypeScript agent runner
- [x] Forward Tauri command to Node runner
- [ ] Detect local Claude Code CLI
- [ ] Add Claude Code CLI engine
- [ ] Parse Claude Code `stream-json` events
- [ ] Stream agent events live to React
- [ ] Add local project workspace
- [ ] Add first real prompt composer

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
