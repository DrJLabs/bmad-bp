# BMAD Expansion Framework Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- Provide a repeatable workflow for defining and installing new BMAD expansion packs within this repository.
- Ensure core agents stay lean by isolating domain-specific capabilities into optional bundles.
- Document the minimum artifacts required so PO, SM, and Dev agents can activate new expansion abilities without additional guidance.

### Background Context

The BMAD Method currently ships with core software-development agents and several sample expansion packs. We now need an initial PRD that captures requirements for expanding the expansion-pack authoring experience so new domain packs can be created, validated, and distributed from this repo with minimal friction.

### Change Log

| Date       | Version | Description                        | Author          |
| ---------- | ------- | ---------------------------------- | --------------- |
| 2025-09-18 | 0.1     | Initial draft seeded from template | Codex (PO flow) |

## Requirements

### Functional Requirements

- FR1: Provide a documented folder structure and checklist for adding a new expansion pack (agents, tasks, templates, docs).
- FR2: Supply a generator or instructions that bundle expansion assets for both IDE and web delivery after creation.
- FR3: Ensure expansion packs register themselves in AGENTS.md / opencode outputs so Codex and other IDEs can list new agents.
- FR4: Offer validation steps (lint, bundle, smoke check) that authors must run before committing a new pack.

### Non Functional Requirements

- NFR1: Expansion authoring workflow must avoid increasing baseline install time by more than 10% compared to current `npm install` + `npm run build`.
- NFR2: Generated bundles must remain under 5 MB per expansion to keep uploads practical for web LLM tools.
- NFR3: Documentation and scripts should operate offline once dependencies are installed (no external network fetches).

## User Interface Design Goals

_Not applicable. No UI is introduced beyond existing markdown docs and CLI outputs._

## Technical Assumptions

- Primary development environment uses Node.js ≥ 20.10.0 and npm (per package.json).
- Expansion packs live under `expansion-packs/<pack-name>/` mirroring existing examples.
- Build and validation rely on the existing BMAD CLI (`npm run build`, `npm run validate`).
- Core instructions reside in markdown/YAML; no compiled code is introduced in the core package.

## Dependencies, Constraints, Risks

- Existing expansion packs act as references; changes must avoid breaking backwards compatibility with shipped packs.
- Risk: Larger expansion packs may bloat bundle sizes—mitigate by enforcing modular dependencies and optional installs.
- Constraint: Core agents must not load expansion resources unless a given pack is explicitly enabled.

## Success Metrics

- At least one new expansion pack can be authored end-to-end following the documented workflow without maintainer intervention.
- Automated validation scripts catch structural errors (missing agent deps, oversized bundles) before PR merge.
- Documentation readers can complete setup in under 30 minutes on a clean machine.

## Release Strategy

- Iterate PRD to 1.0 once the first expansion pack ships using this process.
- Tag repository release notes highlighting new authoring workflow and sample packs.

## Appendices

- Reference templates: `bmad-core/templates/prd-tmpl.yaml`, `bmad-core/templates/story-tmpl.yaml`.
