# Release Governance Modernization Focused Epic

## Epic Goal

Re-align the chat-mcp-farm release workflow so it mirrors the upstream BMAD pattern: GitHub-only semantic-release, no npm publishing, automated changelog/tagging, and a maintained installer footprint that matches the shipped tooling.

## Epic Description

**Existing System Context**

- Release automation exists only as a local script; every CI run that invokes `semantic-release` fails because the repo is private and no npm token is configured.
- There is no GitHub Actions job responsible for tagging, changelog updates, or packaging, so maintainers cut releases manually and inconsistently.
- The installer manifest lags behind recent reviewer additions, meaning a fresh install will not ship the new tooling unless files are copied by hand.

**Enhancement Details**

- Adopt the upstream BMAD GitHub-only release workflow, relying solely on the provided `GITHUB_TOKEN` and disabling npm publishing entirely.
- Configure semantic-release to manage versioning, changelog generation, and GitHub releases, attaching optional artifacts if/when we add packaged bundles.
- Refresh `.bmad-core/install-manifest.yaml` so the installer footprint includes reviewer components and stays aligned with BMAD’s template version.
- Update contributor documentation and release runbook entries so the process is reproducible by any maintainer.

## Success Criteria

- CI release job succeeds without requiring npm tokens.
- GitHub Releases and changelog entries are generated automatically from conventional commits.
- `.bmad-core/install-manifest.yaml` reflects the reviewer tooling and installer changes.
- Contributing documentation describes how to run the release pipeline locally and in CI.

## Stories

1. **Story 1 (Completed — 2025-09-25):** Convert release automation to GitHub-only semantic-release and update installer/docs accordingly.

## Compatibility Requirements

- [x] Release workflow must run on GitHub-hosted runners without additional secrets beyond `GITHUB_TOKEN`. (Evidence: docs/bmad/focused-epics/release-governance/evidence/release-run-18019240174.log)
- [x] Installer manifest version must track the BMAD template version used by this repo. (Updated in Story 1; see change log Evidence row)
- [x] Documentation updates land under `docs/` and follow BMAD style guidelines. (Release automation + versioning docs cross-linked 2025-09-25)
- [x] Existing services/packages remain unaffected by the release workflow changes. (No runtime changes detected during release dry-run; monitor via CI)

## Risk Mitigation

- **Release Drift:** Without npm publishing, ensure downstream instructions tell consumers to fetch artifacts from GitHub releases.
  - _Mitigation:_ Update contributor docs with explicit steps.
- **Manifest Staleness:** Forgetting to update the install manifest could break future refreshes.
  - _Mitigation:_ Include manifest update as acceptance criteria with validation instructions.

## Definition of Done

- [x] Story 1 accepted with release workflow green on `main`.
- [x] `.releaserc` (or equivalent) committed with GitHub-only configuration. (Completed in Story 1; see docs/bmad/focused-epics/release-governance/story-1.md#Change-Log)
- [x] Installer manifest + docs updated and validated via `bmad-method validate`. (Evidence: docs/bmad/focused-epics/release-governance/evidence/bmad-validate.log)
- [x] Release documentation reviewed by the team. (PO validation 2025-09-25: docs/bmad/qa/assessments/release-governance.story-1.3-po-validation-20250925.md)

## Validation Checklist

- [x] Release workflow passes on a dry-run PR branch and on `main` after merge. (Evidence: docs/bmad/focused-epics/release-governance/evidence/release-run-18024216996-20250926T040000Z/release-run-18024216996.log)
- [x] Semantic-release logs confirm a GitHub release was created and npm publish skipped. (Evidence: GitHub Release v1.1.0, Story 1 change log entry dated 2025-09-26)
- [x] Installer tooling (`npm run bmad:validate`) completes without errors. (Evidence: docs/bmad/focused-epics/release-governance/evidence/bmad-validate.log)

## 🔬 Research & Validation Log (2025-09-25)

- **Researcher:** Riley Chen
- **Mode:** Focused-epic small team
- **Summary:** Benchmarked BMAD’s GitHub-only release approach and identified the local gaps (missing workflow, stale manifest, npm publish failures).

### Findings & Actions

| Priority | Area             | Recommended Change                                              | Owner / Reviewer | Confidence | Mode       | Controls                        | Evidence Location                  | Sources             |
| -------- | ---------------- | --------------------------------------------------------------- | ---------------- | ---------- | ---------- | ------------------------------- | ---------------------------------- | ------------------- |
| High     | Release Workflow | Adopt BMAD GitHub release job & drop npm publisher plugin       | Dev              | High       | small-team | Change Management (release)     | `.github/workflows/release.yaml`   | BMAD Reference Repo |
| Medium   | Installer Assets | Refresh `.bmad-core/install-manifest.yaml` for reviewer tooling | DevOps           | Medium     | small-team | Installer Validation Checklist  | `.bmad-core/install-manifest.yaml` | BMAD Reference Repo |
| Medium   | Contributor Docs | Document release steps + how to run semantic-release locally    | PM               | Medium     | small-team | Process Documentation Standards | `docs/release-automation.md`       | BMAD Reference Repo |

### Follow-Up Tasks

- [ ] Confirm version bump rules align with conventional commits.
- [ ] Decide whether to attach build artifacts (e.g., tarballs) to releases.
