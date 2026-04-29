# Honeycrisp

Honeycrisp is a planned Mac desktop app for generating polished native SwiftUI interfaces from prompts.

The first focus is narrow on purpose: help iOS developers quickly turn an idea into a native SwiftUI screen that compiles locally, renders in the Simulator, and can be exported as real Swift code.

This repository is currently in the architecture planning stage. The initial work on Wednesday, April 29, 2026 was focused on analyzing the reference project, deciding the product direction, and writing down a simple architecture that can be implemented step by step.

## Vision

Honeycrisp should feel like a focused design/code assistant for native Apple apps:

- Describe an iOS screen
- Answer a short design brief
- Pick or generate a visual direction
- Let the agent produce SwiftUI source files
- Validate the result with Xcode
- Preview the rendered screen from the Simulator
- Export native Swift code into a real project

The long-term idea is an open-core, developer-friendly product that earns trust by being useful locally first. Monetization can come later through a polished signed Mac app, advanced workflows, hosted sync, team features, or paid convenience features.

## Architecture Summary

Honeycrisp uses [Open Design](https://github.com/nexu-io/open-design) as the main architectural reference.

The core rule is:

> Reuse the loop. Translate the artifacts.

Open Design already has a strong design-generation workflow: discovery forms, visual direction selection, skill loading, prompt composition, project workspaces, agent streaming, and checklist-based self-review.

Honeycrisp keeps that workflow, but changes the output target:

- Open Design generates HTML/browser artifacts
- Honeycrisp generates SwiftUI/Xcode artifacts

Planned stack:

- **Tauri** for the Mac app container
- **React + TypeScript** for the interface
- **Node.js + TypeScript** for the local AI, file, and Xcode backend
- **Swift + SwiftUI** for generated output
- **Xcode + Simulator** for local validation and screenshots

Read the full plan in [docs/architecture.md](docs/architecture.md).

## Roadmap

Current planning roadmap:

1. Write the architecture and product direction
2. Scaffold the Tauri + React + TypeScript desktop app
3. Build the local Node/TypeScript backend
4. Port the Open Design-style discovery loop
5. Create the first SwiftUI-native skill for one polished iOS screen
6. Generate SwiftUI files into a local workspace
7. Validate generated code with Xcode
8. Capture a Simulator screenshot preview
9. Add native Swift export
10. Expand into more SwiftUI skills and multi-screen flows

## Reference

Honeycrisp is inspired by the architecture and agent workflow of [nexu-io/open-design](https://github.com/nexu-io/open-design).

The goal is not to blindly copy every file. The goal is to learn from its design-generation loop, then phase-port HTML-specific pieces into a native SwiftUI workflow over time.

## Status

This project is not implemented yet. The current repository contains the first documentation pass, including:

- Initial architecture plan
- Roadmap placeholder
- Project README
- Basic `.gitignore`

The next milestone is to scaffold the desktop app foundation.
