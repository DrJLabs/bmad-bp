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

- [ ] Release workflow must run on GitHub-hosted runners without additional secrets beyond `GITHUB_TOKEN`.
- [ ] Installer manifest version must track the BMAD template version used by this repo.
- [ ] Documentation updates land under `docs/` and follow BMAD style guidelines.
- [ ] Existing services/packages remain unaffected by the release workflow changes.

## Risk Mitigation

- **Release Drift:** Without npm publishing, ensure downstream instructions tell consumers to fetch artifacts from GitHub releases.
  - _Mitigation:_ Update contributor docs with explicit steps.
- **Manifest Staleness:** Forgetting to update the install manifest could break future refreshes.
  - _Mitigation:_ Include manifest update as acceptance criteria with validation instructions.

## Definition of Done

- [x] Story 1 accepted with release workflow green on `main`.
- [ ] `.releaserc` (or equivalent) committed with GitHub-only configuration.
- [ ] Installer manifest + docs updated and validated via `bmad-method validate`.
- [ ] Release documentation reviewed by the team.

## Validation Checklist

- [ ] Release workflow passes on a dry-run PR branch and on `main` after merge.
- [ ] Semantic-release logs confirm a GitHub release was created and npm publish skipped.
- [ ] Installer tooling (`npm run bmad:validate`) completes without errors.

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
