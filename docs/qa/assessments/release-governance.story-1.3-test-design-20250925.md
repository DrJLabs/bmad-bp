# Test Design: Story 1.3 (Close Release Evidence & Governance Checklist)

Date: 2025-09-25
Author: Quinn (Test Architect)

## Objectives

Verify that Story 1.3 closes all outstanding release-governance evidence gaps, cross-links documentation, and updates epic checklists without introducing regressions in the semantic-release pipeline.

## Test Strategy Overview

- Total scenarios: 6
- Level mix: Process 3, Integration 2, Manual Validation 1
- Priority mix: P0 = 4, P1 = 2, P2 = 0
- Dependencies: Story 1 change log, evidence directory (`docs/bmad/focused-epics/release-governance/evidence/`), `docs/release-automation.md`, `docs/versioning-and-releases.md`, `.github/workflows/release.yaml`, GitHub Actions run history, release-governance epic checklist.

## Test Scenarios

| ID        | Priority | Level       | Scenario                                                                                                           | Method                                                                                               | Mitigates   |
| --------- | -------- | ----------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | ----------- |
| REL1.3-T1 | P0       | Process     | Confirm Story 1 change log includes latest Release run ID, release URL, dry-run, skip, and permissions failure log | Inspect change log entry after evidence capture; cross-check log filenames exist in evidence folder  | REL-1.3-001 |
| REL1.3-T2 | P0       | Integration | Execute `npx semantic-release --dry-run --ci false` and verify output stored at timestamped evidence path          | Run command locally, diff new log vs prior, ensure stored under evidence/ with new date stamp        | REL-1.3-001 |
| REL1.3-T3 | P0       | Integration | Trigger GitHub `Release` workflow (manual dispatch) and capture run ID, outcome, tarball status                    | Dispatch workflow, download log archive, verify attachments match documented policy                  | REL-1.3-003 |
| REL1.3-T4 | P0       | Process     | Validate cross-links between release docs (matrix ↔ checklist ↔ retention guidance) work bidirectionally         | Click anchors in `release-automation.md` and `versioning-and-releases.md`; ensure anchor IDs resolve | REL-1.3-002 |
| REL1.3-T5 | P1       | Process     | Update epic checklist with evidence links and note any waivers                                                     | Review epic file; confirm each checkbox references stored evidence or recorded waiver                | REL-1.3-004 |
| REL1.3-T6 | P1       | Manual      | Sanity-check manual release instructions include pre-flight reminder (no pending commits, dry-run first)           | Inspect documentation updates and Story 1.3 Tasks section; confirm instructions present              | REL-1.3-003 |

## Test Data

- Fresh semantic-release dry-run output (2025-09-25 or newer)
- GitHub Actions Release run (manual dispatch) logs
- Evidence directory contents (updated log filenames, zipped run artifacts)
- Updated Story 1 change log entry with run metadata

## Tooling

- `npx semantic-release --dry-run --ci false`
- `gh workflow run release.yaml --ref main` (or GitHub UI manual dispatch)
- `gh run view <run-id> --log` to pull log details if needed
- Markdown link checker (optional) to validate cross-links

## Exit Criteria

- REL1.3-T1–T4 must pass before Story 1.3 moves to Dev readiness.
- REL1.3-T5 ensures the epic checklist references current evidence; failing this blocks PO sign-off.
- REL1.3-T6 provides operational guardrails; if missing, Story 1.3 requires revision.

## Recommended Execution Order

1. Execute dry-run (REL1.3-T2) and update evidence directory.
2. Trigger Release workflow (REL1.3-T3) and capture run ID/URL.
3. Update Story 1 change log with evidence (REL1.3-T1).
4. Validate documentation cross-links (REL1.3-T4).
5. Tick epic checklist items with evidence references (REL1.3-T5).
6. Confirm manual release pre-flight guidance (REL1.3-T6).

## Additional Notes

- Use GitHub’s retention setting (90-day default) as a reminder to download logs immediately after each run.citeturn0search0
- Treat evidence capture steps as atomic; if any log is missing, rerun the workflow before considering the story ready for QA gate.
- Consider scripting log downloads in a future story to minimize manual steps.

## Follow-Up Tasks

- [ ] Automate evidence archiving (future enhancement outside Story 1.3 scope).
- [ ] Evaluate reviewer strict-mode readiness once release evidence is stable (ties into future Reviewer epic work).

## 🔬 Research & Validation Log

- 2025-09-25 — Mode: solo. Reviewed scenarios against Story 1.3 acceptance criteria and Story 1 follow-ups; coverage spans evidence capture, documentation cross-links, manual release safeguards, and epic checklist closure. References: docs/stories/1.3.release-evidence-audit-closure.md, docs/bmad/focused-epics/release-governance/story-1.md.
- 2025-09-25 — Verified REL1.3-T2/T3 align with semantic-release guidance to dry-run before dispatching the GitHub workflow and to confirm attachment policy.citeturn0search2
- 2025-09-25 — Confirmed REL1.3-T4 leverages existing anchors; recommended adding a note to record the link-check date in Story 1 change log so auditors can trace verification. Source: docs/release-automation.md, docs/versioning-and-releases.md.
- 2025-09-25 — Residual risk: automation for evidence downloads still manual; noted in Follow-Up Tasks to converge with future automation story.
