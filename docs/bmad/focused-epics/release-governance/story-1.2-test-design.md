# Test Design: Story 1.2 (Finalize Release Evidence & Artifact Governance)

Date: 2025-09-25
Author: Quinn (Test Architect)

## Objectives

Confirm that release documentation, evidence capture, and artifact policies fully support governance requirements introduced in Story 1 and new ACs for Story 1.2.

## Test Strategy Overview

- Total scenarios: 5
- Level mix: Process 2, Integration 2, Manual Validation 1
- Priority mix: P0 = 3, P1 = 2, P2 = 0
- Dependencies: GitHub Actions `Release` workflow, `semantic-release` CLI, release evidence directory, `docs/release-automation.md`, `docs/versioning-and-releases.md`, Story 1 change log

## Test Scenarios

| ID        | Priority | Level       | Scenario                                                                                                      | Method                                                                                                | Mitigates     |
| --------- | -------- | ----------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------- |
| REL1.2-T1 | P0       | Process     | Validate version bump matrix + checklist map correctly to semantic-release behaviour                          | Review updated docs; cross-check against `semantic-release --dry-run` output                          | REL-1.2-002   |
| REL1.2-T2 | P0       | Integration | Ensure Story 1 change log now lists release Actions run ID, release URL, dry-run log, and permissions failure | Inspect Story 1 change log and evidence directory after updates                                       | REL-1.2-001   |
| REL1.2-T3 | P0       | Integration | Confirm release runbook documents artifact policy decision with verification or rollback steps                | Execute or review the latest `Release` run, then compare attachments vs. documented policy            | REL-1.2-003   |
| REL1.2-T4 | P1       | Process     | Verify evidence retention guidance instructs teams to capture logs before GitHub purges them                  | Review documentation updates for retention expectations and actionable guidance                       | REL-1.2-001   |
| REL1.2-T5 | P1       | Manual      | Note architecture shard gap so dev/QA agents know no additional architecture references exist                 | Confirm dev notes mention missing `docs/architecture/` shards and that QA guidance references the gap | Residual risk |

## Test Data

- Latest `Release` workflow run (or newly triggered run) to populate evidence.
- `semantic-release --dry-run --no-ci` output for mapping validation.

## Tooling

- `npx semantic-release --dry-run --no-ci`
- GitHub Actions run logs (`Release` workflow)
- File diff tools to confirm documentation updates

## Exit Criteria

- REL1.2-T1 through REL1.2-T3 must pass with updated documentation and evidence links checked into the repository.
- REL1.2-T4 documentation review confirms retention guidance is clear and actionable.
- REL1.2-T5 documents the architecture gap prominently for downstream agents.

## Recommended Execution Order

1. REL1.2-T1 — Update docs and validate against dry-run output before capturing evidence.
2. REL1.2-T2 — After documentation PR, populate Story 1 change log and verify evidence directory contents.
3. REL1.2-T3 — Run/inspect latest release job to confirm artifact policy decision matches documentation.
4. REL1.2-T4 — Ensure retention guidance is explicit before sign-off.
5. REL1.2-T5 — QA to confirm architectural gap notes exist to avoid rework.

## 🔬 QA Research Notes (2025-09-25)

- Story 1 risk and test artifacts already highlight missing evidence; Story 1.2 must close those gaps for governance sign-off.
- Release documentation should stay synchronized across `docs/release-automation.md` and `docs/versioning-and-releases.md` to avoid conflicting guidance.
- Capture evidence immediately after the next successful release run to avoid GitHub log expiration.

## Follow-Up Tasks

- [ ] Attach dry-run and permissions-failure logs to the evidence directory and link them from Story 1 change log.
- [ ] Add cross-links between updated release docs to maintain consistency.
- [ ] Re-run the Release workflow in strict mode once documentation is merged to confirm no regressions.

## 🔬 Research & Validation Log (2025-09-25)

- **Researcher:** Dr. Evelyn Reed (solo mode)
- **Scope:** Validate that REL1.2 test scenarios cover evidence capture, documentation updates, and artifact governance introduced by Story 1.2.
- **Primary Inputs:** `docs/release-automation.md`, `docs/versioning-and-releases.md`, `docs/bmad/focused-epics/release-governance/story-1.md`, `docs/bmad/focused-epics/release-governance/evidence/`, `.github/workflows/release.yaml`.

### Findings & Actions

| Priority | Area                  | Recommended Update                                                                                                           | Owner | Confidence | Evidence                                                         |
| -------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----- | ---------- | ---------------------------------------------------------------- |
| High     | Scenario Coverage     | Ensure REL1.2-T1 explicitly references the new version mapping table and dry-run checklist in `docs/release-automation.md`.  | QA    | High       | docs/release-automation.md                                       |
| High     | Evidence Traceability | Update REL1.2-T2 acceptance notes to verify Story 1 change log now includes the new “Evidence” row with run ID placeholders. | QA    | Medium     | docs/bmad/focused-epics/release-governance/story-1.md#Change-Log |
| Medium   | Artifact Policy       | Confirm REL1.2-T3 mentions the tarball verification steps documented under “Release artifact policy”.                        | QA    | Medium     | docs/release-automation.md                                       |
| Medium   | Retention Guidance    | Link REL1.2-T4 expectations to the retention instructions (Action settings, 90-day default) to drive timely downloads.       | QA    | Medium     | docs/release-automation.md                                       |

### Summary

- Test scenarios adequately cover Story 1.2 acceptance criteria after cross-linking to the updated runbook sections.
- Evidence traceability depends on populating Story 1 change log after the next release; QA should schedule a follow-up review when data is available.
- No additional tooling is required; all validations rely on existing CLI commands and GitHub UI checks noted above.
