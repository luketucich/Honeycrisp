# Honeycrisp Architecture

Planning date: Wednesday, April 29, 2026

Honeycrisp is a planned Mac desktop app for generating polished native SwiftUI interfaces from plain-language prompts. The first focus is iOS mobile app screens. Later, the same architecture can expand to multi-screen flows, macOS apps, menu bar utilities, and broader native Apple platform work.

The main idea is simple:

> Reuse the design-generation loop from Open Design. Translate the output layer from HTML/browser artifacts into SwiftUI/Xcode artifacts.

## Product Shape

Honeycrisp is not meant to be a general export tool. It should do one thing very well: help an app developer quickly generate native SwiftUI UI that looks polished, compiles locally, and can be copied into a real Apple-platform project.

The first version should support:

- Prompt-driven iOS screen generation
- A structured discovery flow before generation
- A visual direction picker so the model does not freestyle every design
- SwiftUI source output
- Local Xcode validation
- Simulator screenshot preview
- A simple project workspace for generated files and iteration history

The product can be monetized later as a polished signed Mac app, open-core product, or local-first developer tool with optional paid features. That does not need to be solved before the architecture is sound.

## Stack

The planned stack keeps the app practical while still making the project resume-worthy.

| Layer             | Technology                           | Purpose                                                                                  |
| ----------------- | ------------------------------------ | ---------------------------------------------------------------------------------------- |
| Mac app container | Tauri                                | Packages the app as a lightweight native Mac desktop app                                 |
| User interface    | React + TypeScript                   | Builds the prompt UI, project browser, previews, forms, and settings                     |
| Local backend     | Node.js + TypeScript                 | Runs the agent loop, manages files, talks to AI providers, and launches Xcode validation |
| Native output     | Swift + SwiftUI                      | The generated code users actually want                                                   |
| Validation        | Xcode command line tools + Simulator | Builds generated SwiftUI and captures verified previews                                  |

Rust stays mostly inside Tauri unless the app later needs deeper native integrations. The main product logic should live in TypeScript so the system is easier to iterate on.

## High-Level System

```mermaid
flowchart TD
  A["User prompt"] --> B["React/TypeScript app UI"]
  B --> C["Structured discovery form"]
  C --> D["Visual direction picker"]
  D --> E["Node/TypeScript local backend"]
  E --> F["Prompt composer"]
  F --> G["Local code agent"]
  G --> H["SwiftUI skill + templates"]
  H --> I["Generated SwiftUI files"]
  I --> J["Xcode build validation"]
  J --> K["Simulator screenshot"]
  K --> L["Preview + native Swift export"]
```

The important boundary is that Honeycrisp is not just asking a model to return Swift in a chat message. The app should guide the model through a repeatable workflow, write real project files, validate those files, then show the user a preview that came from compiled native code.

## Open Design Reuse Strategy

Honeycrisp uses [Open Design](https://github.com/nexu-io/open-design) as the main architectural reference. Open Design has already solved many of the hard product problems around AI-assisted design generation:

- How to ask useful questions before generation
- How to bind a visual direction before the model starts designing
- How to load skills from `SKILL.md` files
- How to compose prompts from a base identity, active skill, design system, and user request
- How to stream agent progress back into the UI
- How to keep project files in a local workspace
- How to make the model self-check before showing a final artifact

Honeycrisp should reuse those ideas directly in spirit and structure.

What changes is the artifact target. Open Design primarily generates web artifacts such as HTML prototypes, decks, and browser previews. Honeycrisp should generate SwiftUI source files, validate them with Xcode, and export native Swift code.

```mermaid
flowchart TD
  A["Open Design foundation"] --> B["Reuse directly"]
  A --> C["Phase-port over time"]

  B --> B1["Discovery forms"]
  B --> B2["Direction picker"]
  B --> B3["Prompt composition"]
  B --> B4["Skill registry"]
  B --> B5["Agent loop"]
  B --> B6["Project workspace"]
  B --> B7["Streaming progress"]

  C --> C1["HTML skills"]
  C --> C2["CSS templates"]
  C --> C3["Browser previews"]
  C --> C4["Artifact exports"]
  C --> C5["HTML lint/checklists"]

  C1 --> D["SwiftUI skills"]
  C2 --> E["SwiftUI seeds + theme tokens"]
  C3 --> F["Xcode build + simulator screenshots"]
  C4 --> G["Native Swift export"]
  C5 --> H["SwiftUI/iOS quality checks"]
```

The rule is:

> Reuse the loop. Translate the artifacts.

This avoids copying HTML-specific instructions into a SwiftUI product too early. Open Design's skills are valuable source material, but many of them are written around `index.html`, CSS variables, iframe preview behavior, and HTML exports. Honeycrisp should port those skills in phases by preserving their intent, workflow, archetypes, and quality standards while replacing the output contract.

## Agent Loop

Honeycrisp should keep Open Design's two-stage start because it is part of the quality system.

```mermaid
sequenceDiagram
  participant U as User
  participant UI as Honeycrisp UI
  participant P as Prompt Composer
  participant A as Local Agent
  participant X as Xcode Validator

  U->>UI: Describe desired iOS screen
  UI->>U: Quick brief form
  U->>UI: Screen type, audience, tone, constraints
  UI->>U: Visual direction picker
  U->>UI: Direction choice
  UI->>P: Compose prompt with direction, skill, and design system
  P->>A: Run agent inside project workspace
  A->>A: Read SwiftUI seed, layouts, and checklist
  A->>A: Generate SwiftUI files
  A->>X: Build and screenshot
  X->>UI: Validation result + simulator preview
```

The loop should work like this:

1. The user describes the screen they want.
2. Honeycrisp asks a short structured brief.
3. Honeycrisp asks for or chooses a visual direction.
4. The backend composes the agent prompt from the user request, selected direction, active SwiftUI skill, and active design system.
5. The agent reads the skill seed files before writing code.
6. The agent writes SwiftUI files into a project workspace.
7. Honeycrisp validates the generated code with Xcode.
8. Honeycrisp shows the simulator screenshot and exportable source.

This is the part that prevents generic output. The app should not rely on one giant prompt. It should constrain the model before generation and check the result afterward.

## Skill Translation Layer

Open Design skills should become Honeycrisp SwiftUI skills over time.

| Open Design concept           | Honeycrisp equivalent                         |
| ----------------------------- | --------------------------------------------- |
| `SKILL.md`                    | `SKILL.md` with SwiftUI-specific workflow     |
| `assets/template.html`        | SwiftUI seed files and preview host templates |
| `references/layouts.md`       | SwiftUI screen archetypes                     |
| `references/checklist.md`     | Native iOS quality checklist                  |
| CSS `:root` variables         | Swift theme tokens                            |
| `<artifact type="text/html">` | `GeneratedUIManifest.json` + Swift files      |
| iframe preview                | Xcode build + Simulator screenshot            |

For example, Open Design's mobile app skill should not be copied directly into Honeycrisp. Its workflow is excellent, but its instructions are HTML-specific. The Honeycrisp version should preserve the idea of a high-quality mobile screen skill while replacing the output format:

- Keep: one screen, one job
- Keep: archetypes such as feed, detail, onboarding, profile, checkout, and focus
- Keep: real copy, strong hierarchy, restraint, and quality checklist
- Replace: HTML device frame with a real SwiftUI preview host
- Replace: CSS tokens with Swift design tokens
- Replace: HTML artifact handoff with Swift source files and a manifest

The long-term vision can include many translated skills, but the first implementation should prove the pattern with the closest match: a native SwiftUI iOS screen skill.

## Runtime Components

### Tauri Shell

Tauri packages the app as a Mac desktop application. It owns the window, menu integration, app permissions, and distribution surface.

### React/TypeScript UI

The React app is the interface the user clicks and types into. It should include:

- Prompt composer
- Project list
- Discovery forms
- Direction picker
- Agent progress stream
- File browser
- Build status
- Simulator screenshot preview
- Export controls

### Node/TypeScript Backend

The local backend is the core runtime. It should handle:

- Project workspace creation
- Skill loading
- Prompt composition
- Agent process management
- File read/write APIs
- Xcode build commands
- Simulator screenshot capture
- Export packaging

This is where most of Honeycrisp's app logic should live.

### SwiftUI Output

Generated output should be real SwiftUI, not a screenshot or web approximation. A generated project should include a small manifest and source files that can be opened, validated, and exported.

The first output contract can be simple:

```txt
GeneratedUI/
  GeneratedUIManifest.json
  Sources/
    GeneratedUI/
      GeneratedRootView.swift
      Theme.swift
      Components.swift
```

The manifest should describe the generated screen, target platform, entry point, source files, and validation result. The exact schema can evolve once implementation begins.

### Xcode Validation

Honeycrisp should validate generated SwiftUI locally before presenting it as successful. A generation should only be considered complete when:

- The agent changed generated source files
- The Swift files pass a basic static gate
- `xcodebuild` succeeds against a stable preview host
- The app or preview host launches in the Simulator
- A screenshot is captured and is not blank

This validation loop is a major product differentiator. The app should not just say "here is SwiftUI." It should say "this SwiftUI compiled and rendered."

## Research Provenance

This architecture was planned through an AI-assisted research process using GPT-5.5 extra-high reasoning in Codex, the Superpowers brainstorming workflow, parallel sub-agent repository analysis, and manual source verification.

The Open Design repository was inspected directly to understand its agent loop, prompt composition, skill registry, design-system handling, project workspace model, artifact flow, and quality-check process. The goal was not to blindly fork the repository, but to identify which parts of its design-generation architecture are reusable for Honeycrisp and which parts need to be translated from HTML/browser artifacts into native SwiftUI/Xcode artifacts.

Key Open Design areas reviewed:

- `src/prompts/discovery.ts` for discovery forms, visual direction selection, planning, and quality philosophy
- `src/prompts/system.ts` for prompt composition
- `daemon/skills.js` for skill loading
- `daemon/agents.js` and `daemon/server.js` for local agent execution
- `skills/mobile-app/SKILL.md` for the mobile app skill workflow
- `skills/mobile-app/references/checklist.md` for quality gates
- artifact and export code for understanding what Honeycrisp should replace

The resulting architecture separates reusable workflow concepts from output-specific implementation details:

- Reuse Open Design's loop, skill structure, prompt choreography, and local workspace model
- Phase-port HTML-specific skills into SwiftUI-native skills over time
- Replace browser preview and export behavior with Xcode validation, simulator screenshots, and native Swift source export

## Architecture Defaults

These are the current defaults for the first real build:

- Build a Mac desktop app, not a hosted website first
- Use Tauri for the shell
- Use React and TypeScript for the app UI
- Use Node and TypeScript for the local backend and agent runtime
- Generate SwiftUI for iOS first
- Validate locally with Xcode
- Start with prompt input only
- Start with one polished screen before expanding to multi-screen app flows
- Keep monetization out of the first technical milestone

These defaults can change later, but they are the clearest path to a working foundation.
