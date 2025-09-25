# Test Design: Story 1 (Release Workflow Alignment)

Date: 2025-09-25
Author: Quinn (Test Architect)

## Objectives

Validate that the updated release pipeline executes successfully with GitHub-only semantic-release configuration and that documentation communicates the new process.

## Test Strategy Overview

- Total scenarios: 6
- Level mix: Integration 2, E2E 2, Process 1, Manual Validation 1
- Priority mix: P0 = 3, P1 = 2, P2 = 1
- Dependencies: GitHub Actions workflows, `semantic-release` CLI, `.bmad-core/install-manifest.yaml`, contributor docs

## Test Scenarios

| ID     | Priority | Level       | Scenario                                                                                                       | Method                                                                                               | Mitigates        |
| ------ | -------- | ----------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------- |
| REL-T1 | P0       | Integration | Verify release workflow on PR branch (dry-run) completes without npm errors                                    | Run `semantic-release --dry-run` locally and capture output                                          | REL-001          |
| REL-T2 | P0       | E2E         | Ensure release workflow on `main` succeeds, creates GitHub release/tag, and persists changelog updates         | Observe Actions run after merge and inspect release + changelog diff                                 | REL-001, REL-003 |
| REL-T3 | P0       | E2E         | Validate workflow fails gracefully with insufficient `GITHUB_TOKEN` permissions and surfaces actionable errors | Run workflow on a branch with scoped token (or use `permissions: read`) and capture failure evidence | REL-003          |
| REL-T4 | P1       | Integration | Confirm `.bmad-core/install-manifest.yaml` updated and `bmad-method validate` passes                           | Execute `npm run bmad:validate`                                                                      | REL-001          |
| REL-T5 | P1       | Process     | Check documentation lists GitHub-only release steps, artifact locations, and rollback guidance                 | Peer review `docs/release-automation.md`                                                             | REL-002          |
| REL-T6 | P2       | Manual      | Ensure conventional commit edge cases (e.g., `chore:`) skip releases without errors                            | Push/sample commit without release-triggering type and review semantic-release output                | REL-001          |

## Test Data

- Conventional commits on feature branch (`feat:` / `fix:`) to drive semantic-release versioning.
- Non releasing commit sample (`chore:`) to validate skip behavior.

## Tooling

- GitHub Actions (with adjustable `permissions`)
- `semantic-release`
- `bmad-method validate`

## Exit Criteria

- REL-T1 through REL-T4 must pass with logs, Action run IDs, changelog diffs, and release URLs attached to the story change log.
- REL-T5 peer review approved by PM/QA with rollback steps verified.
- REL-T6 documented with semantic-release output confirming skip behavior.

## Risk Coverage

- REL-001 (workflow still calling npm): REL-T1, REL-T2, REL-T4, REL-T6
- REL-002 (documentation drift): REL-T5
- REL-003 (`GITHUB_TOKEN` scope/permissions): REL-T2, REL-T3

## Recommended Execution Order

1. REL-T1 — fast integration validation of dry-run log
2. REL-T3 — negative token scenario before opening PR (prevents broken pipeline)
3. REL-T2 — CI verification after merge with artifact capture
4. REL-T4 — manifest validation during PR review window
5. REL-T6 — optional regression when commits are unusual
6. REL-T5 — documentation review after workflow verified

## 🔬 Research & Validation Log (2025-09-25)

- **Researcher:** Dr. Evelyn Reed
- **Active Mode:** solo
- **Primary Artifact:** docs/bmad/focused-epics/release-governance/story-1-test-design.md
- **Summary:** Validated Story 1 test design in solo mode, ensuring REL-T1–REL-T6 cover dry-run, negative token, documentation, and skip-behavior scenarios with evidence the maintainer can collect independently.

### Findings & Actions

| Priority | Area          | Recommended Change                                                                                                                          | Owner / Reviewer  | Confidence | Mode | Controls   | Evidence Location                                                                            | Sources                                                                                                                                                                                                                                                                                   |
| -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ---------- | ---- | ---------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| High     | Evidence      | Encode explicit log capture steps for REL-T1 dry-run and REL-T3 permission failure, linking outputs into the story change log.              | Maintainer (self) | High       | solo | SOC2 CC8.1 | docs/bmad/focused-epics/release-governance/evidence/semantic-release-dry-run.log             | [semantic-release dry-run mode](https://semantic-release.gitbook.io/semantic-release/usage/configuration#dryrun), [Controlling permissions for GITHUB_TOKEN](https://docs.github.com/actions/writing-workflows/choosing-what-your-workflow-does/controlling-permissions-for-github_token) |
| Medium   | Observability | Clarify in REL-T2 and REL-T5 steps where to persist Actions run IDs and retention window in the release runbook.                            | Maintainer (self) | Medium     | solo | SOC2 CC8.2 | docs/release-automation.md                                                                   | [GitHub Actions artifact & log retention](https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository)                                                                   |
| Medium   | Test Data     | Add explicit verification for REL-T6 that the non-release `chore:` commit logs the "This release was skipped" message to guard regressions. | Maintainer (self) | Medium     | solo | BMAD QA    | docs/bmad/focused-epics/release-governance/evidence/semantic-release-permissions-failure.log | [semantic-release plugins](https://semantic-release.gitbook.io/semantic-release/usage/plugins)                                                                                                                                                                                            |

### Tooling Guidance

- **FOSS-first Recommendation:** Use upstream `semantic-release` CLI with the GitHub plugin trio and local `--dry-run` before PR updates.
- **Paid Option (if required):** None — GitHub-hosted runners and OSS tooling cover the required scenarios.
- **Automation / Scripts:** `npx semantic-release --dry-run --ci false`; GitHub workflow dispatch variant with `permissions: contents: read` for REL-T3 validation.

### Risk & Compliance Notes

- **Residual Risks:** Organization-level token policies may still downgrade permissions causing false negatives; document override/escalation path.
- **Compliance / Control Mapping:** Supports SOC2 CC8 change-management evidence by linking release logs, run IDs, and rollback steps.
- **Monitoring / Observability:** Track Actions job alerts for release workflow and ensure artifacts retained per runbook guidance.
- **Rollback / Contingency:** Use `gh release delete <tag>` plus `git push --delete origin <tag>` and revert `.releaserc`/workflow changes when regressions detected.

### Follow-Up Tasks

- [ ] Attach REL-T1 dry-run and REL-T3 failure logs to story change log — Owner: Maintainer (self), Due: 2025-09-29
- [ ] Update `docs/release-automation.md` with retention + Actions run ID guidance — Owner: Maintainer (self), Due: 2025-09-30

### Source Appendix

1. semantic-release configuration (dry-run) — semantic-release docs (Accessed 2025-09-25)
2. Controlling permissions for GITHUB_TOKEN — GitHub Docs (Accessed 2025-09-25)
3. Managing GitHub Actions settings for a repository — GitHub Docs (Accessed 2025-09-25)
4. semantic-release plugins — semantic-release docs (Accessed 2025-09-25)
