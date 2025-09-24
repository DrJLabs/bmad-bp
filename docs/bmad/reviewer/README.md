# BMAD Reviewer Persona Overview

This focused epic introduces a no-cost reviewer pipeline that fuses free static analysis (Semgrep), duplication detection (Jscpd), and churn metrics with an LLM reviewer persona. The reviewer executes inside BMAD workflows—specifically the focused-epic workflow—immediately after the development step.

## Goals

- Catch security, stability, maintainability, and testing gaps earlier than PR bots.
- Provide reproducible evidence (scan outputs, churn data, diff context) to the reviewer agent.
- Keep runtime under five minutes for typical repositories using cache + diff modes.
- Ensure all dependencies are free/open-source and installable via npm or npx.

## Components

1. **Preflight & Scans** (`tools/reviewer/preflight.sh`, `tools/reviewer/collect-scans.js`)
   - Runs Semgrep (`--config auto`) plus repo-specific overrides.
   - Executes Jscpd at 60% similarity threshold across supported languages.
   - Generates churn metadata from `git log --since="30 days ago"`.
   - Stores cached outputs under `.bmad-cache/reviewer/` and timestamps copies into `artifacts/reviewer/<ts>/`.
2. **Reviewer Persona** (`.bmad-core/agents/reviewer.md`)
   - Combines scan data, churn metadata, and diff context into a structured prompt package.
   - Outputs Markdown summaries and SARIF exports once the persona is executed in a workflow step.
   - Strict-mode escalation and workflow integration ship in Story 1.2 alongside persona runner wiring.
3. **Workflow Integration** (`.bmad-core/workflows/focused-epic.yaml`)
   - Adds reviewer step after development with skip flag for trivial diffs.
   - Publishes artifacts to downstream QA gates and documentation.
4. **Documentation & Tracking** (`docs/bmad/issues/reviewer-rollout.md`)
   - Tracks pilot repositories, owners, runtime metrics, and feedback loops.

## Prerequisites

- Node.js ≥ 18 (already required by BMAD).
- `npx` or local installations for:
  - [Semgrep](https://semgrep.dev/docs/getting-started/faq/#how-to-install-semgrep) (`pip`, `brew`, or Docker image `returntocorp/semgrep`).
  - [Jscpd](https://github.com/kucherenko/jscpd) (`npx jscpd`).
- POSIX shell environment (bash) for preflight script.

## Usage

1. Run `npm run reviewer:preflight` to verify CLI dependencies (Semgrep ≥1.86.0, Jscpd ≥3.5.4) and prepare cache directories.
2. Execute `npm run reviewer:scan` to generate Semgrep/Jscpd reports, churn metadata, and telemetry metrics. Artifacts land in `.bmad-cache/reviewer/<git_sha>/<timestamp>/` and mirror to `artifacts/reviewer/<timestamp>/`, emitting telemetry alerts when runtime or cache thresholds are exceeded.
3. Validate telemetry using `npm run reviewer:validate` (optionally pass `-- --file <path>`). The command enforces schema requirements, total runtime ≤300 s, and cache size ≤250 MB.
4. Optional: prune historic cache entries using `npm run reviewer:prune` (retains cache footprint ≤250 MB and removes runs older than seven days).
5. When the focused-epic workflow runs, the reviewer stage calls these commands automatically after development and before QA gates—ensure reviewer toggles are enabled in `bmad-core/core-config.yaml`.

### Generated Artifacts

- `semgrep.json` and `semgrep.sarif` — Semgrep findings (JSON + SARIF for IDE/Code Scanning ingestion).
- `jscpd/jscpd-report.json` — duplication metrics grouped by language.
- `churn.json` — 30-day churn metadata keyed by file path.
- `metrics.json` — runtime, tool versions, diff coverage, cache footprint, and finding counts; consumed by `npm run reviewer:validate`.
- `log.jsonl` — structured command log (timestamp, command, duration, exit code, stdout/stderr sample).

### Post-Run Telemetry

- Append metrics to `docs/bmad/issues/reviewer-rollout.md` using the telemetry sync utility (Story 1.3 deliverable).
- Monitor runtime warnings (>3 minutes) and cache footprint (>250 MB) surfaced in `metrics.json` and enforced by `npm run reviewer:validate`.
- Track false-positive rate and strict-mode readiness in the rollout tracker before enabling gating.

## Runtime Targets & Monitoring

- Median runtime: ≤ 3 minutes on repos <50k LoC.
- P95 runtime: ≤ 8 minutes on repos up to 150k LoC.
- Cache hit rate ≥ 80% when repeat runs occur within 24h.
- False-positive rate tracked via rollout issue (target <10% of findings).

## Cache Pruning Procedure

1. Run `npm run reviewer:prune` locally or in CI on a daily schedule. Override retention via `BMAD_REVIEWER_CACHE_MAX_AGE_DAYS` and size cap via `BMAD_REVIEWER_CACHE_MAX_MB`.
2. Inspect the command output to confirm remaining directories, sizes, and last-modified timestamps.
3. Execute `npm run reviewer:prune:test` to generate synthetic aged/oversized fixtures and verify pruning behavior before shipping changes.
4. If caching is disabled for a specific job, delete `.bmad-cache/reviewer/` before execution to avoid stale findings.

## Maintenance Notes

- Update ignore patterns in `tools/reviewer/semgrep.yaml` and `tools/reviewer/jscpd.json` as the repository evolves.
- Keep Semgrep/Jscpd CLIs at or above the minimum versions enforced by `npm run reviewer:preflight`.
- Schedule cache pruning (e.g., nightly CI job) to avoid stale reviewer data accumulating locally; follow the procedure above for manual clean-up.
- Re-run `npm run reviewer:validate` whenever metrics are regenerated to ensure telemetry stays within agreed thresholds.

Refer to `docs/bmad/focused-epics/reviewer-agent/epic.md` for scope and story breakdown.
