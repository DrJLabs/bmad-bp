# BMAD Expansion Framework Architecture Document

## Introduction

This document outlines the initial architecture for extending the BMAD Method so teams can author, validate, and package new expansion packs from within this repository. The intent is to provide a baseline for the architect and developer agents to iterate upon as concrete packs are designed.

### Starter Template or Existing Project

N/A – Greenfield architecture increment building on the existing BMAD core.

### Change Log

| Date       | Version | Description                               | Author                 |
| ---------- | ------- | ----------------------------------------- | ---------------------- |
| 2025-09-18 | 0.1     | Seed architecture skeleton for expansions | Codex (Architect flow) |

## High Level Architecture

### Technical Summary

The expansion framework relies on the existing BMAD core (agents, tasks, templates) and augments it with an opinionated authoring pipeline. Authors place new domain assets under `expansion-packs/<pack-name>/`, register them with the BMAD CLI, and regenerate distributable bundles for IDE and web agents. Documentation, validation, and packaging remain markdown- and Node-based to align with BMAD principles.

### Platform and Infrastructure Choice

- **Platform:** Local-first Git workflow with optional Node-based CI.
- **Key Services:** Node.js toolchain, npm scripts (`build`, `validate`, custom generators).
- **Deployment Host and Regions:** GitHub repository; developers clone locally. No cloud regions required.

### Repository Structure

- `bmad-core/` remains the authoritative core. No direct modifications required for new packs.
- `expansion-packs/<pack>/agents|tasks|templates|docs` holds pack-specific assets.
- `docs/expansion-packs.md` references available packs and authoring guidance.
- `dist/` receives regenerated bundles per pack/team for distribution.

```text
expansion-packs/
  awesome-pack/
    config.yaml
    agents/
      strategist.md
    tasks/
      capture-market-scan.md
    templates/
      narrative-outline-tmpl.md
    docs/
      README.md
```

Use this skeleton as a starting point when scaffolding a new focused epic or researcher-driven pack.

### Data Flow

1. Author drafts requirements in `docs/prd.md` and architectural updates here (see also `bmad-core/workflows/focused-epic.yaml` for the end-to-end workflow the new bundles plug into).
2. PO/Architect define pack assets under `expansion-packs/`.
3. CLI (`npm run build`) resolves dependencies and emits bundles into `dist/`.
4. Codex/AGENTS tooling ingests updated bundles for IDE/web agents.
5. Validation scripts confirm structure before merge or release.

### Core Components & Responsibilities

- **Expansion Pack Assets:** Agents, tasks, templates, checklists scoped to a domain.
- **BMAD CLI Tooling:** Reads pack manifest folders, builds distributable text bundles, updates `AGENTS.md` entries.
- **Documentation Layer:** Guides contributors through authoring, validation, and publishing steps.
- **Validation Suite:** Reuses `npm run validate` and future pack-specific lint rules to ensure quality.

## Tech Stack

| Category        | Technology          | Version | Purpose                                    | Rationale                    |
| --------------- | ------------------- | ------- | ------------------------------------------ | ---------------------------- |
| Runtime         | Node.js             | 20.x    | Execute BMAD CLI and build scripts         | Matches repo engines field   |
| Package Manager | npm                 | 10.x    | Manage dependencies and scripts            | Standard with Node 20        |
| Lint/Format     | ESLint, Prettier    | Latest  | Keep YAML/MD/JS assets consistent          | Already configured in repo   |
| Bundling        | Custom BMAD builder | n/a     | Concatenate agent bundles for distribution | Purpose-built, no extra deps |
| CI (optional)   | GitHub Actions      | n/a     | Run build/validate on PRs                  | Aligns with upstream project |

## Component Design

- **Pack Definition Modules:** Directory-per-pack convention ensures isolation, simplifies dependency resolution, and mirrors current sample packs.
- **Agent Registration Hooks:** CLI reads pack descriptors and merges commands into AGENTS output; new packs should provide short metadata files for discovery.
- **Validation Layer:** Extend `tools/cli.js validate` to check pack manifest completeness (agents, tasks, docs) and bundle size thresholds.

## Operational Considerations

- Authors run `npm install` once, then rely on `npm run build` / `npm run validate` per PRD requirements.
- For larger packs, consider optional `npm run build -- --pack <name>` to limit bundle scope.
- Document manual smoke tests (load bundle into IDE, invoke new agent) before marking stories done.

## Risks & Mitigations

- **Bundle Bloat:** Encourage modular dependencies, enforce size checks in validation.
- **Agent Drift:** Require packs to pin versions of tasks/templates they depend on; surface diff alerts in validation output.
- **Documentation Lag:** Track pack metadata in a central index to keep `docs/expansion-packs.md` current.

## Next Steps

1. Flesh out pack manifest schema (metadata file per pack).
2. Extend `npm run list:agents` to surface expansion agents separately.
3. Capture validation checklist for inclusion in story workflow.
