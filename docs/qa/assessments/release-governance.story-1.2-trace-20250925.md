# Requirements Traceability Matrix

## Story: 1.2 – Finalize Release Evidence & Artifact Governance

### Coverage Summary

- Total Requirements: 4
- Fully Covered: 4 (100%)
- Partially Covered: 0 (0%)
- Not Covered: 0 (0%)

### Requirement Mappings

#### AC1: Update release documentation with Conventional Commit → semantic-release mapping and validation checklist

- **Coverage:** FULL
- **Mappings:**
  - **Doc Review:** `docs/release-automation.md` version mapping table & checklist (REL1.2-T1)
    - Given: Updated runbook with table/checklist.
    - When: Reviewer compares semantic-release dry-run output to table.
    - Then: Validation checklist confirms expected bump and notes outcome in change log.

#### AC2: Decide and document GitHub release artifact strategy with verification steps and retrieval instructions

- **Coverage:** FULL
- **Mappings:**
  - **Doc Review:** `docs/release-automation.md` “Release artifact policy” section (REL1.2-T3)
    - Given: Runbook describing tarball verification procedure and recent workflow evidence.
    - When: QA inspects Release workflow run `18019240174` (2025-09-25 workflow_dispatch on `main`) and GitHub release `v1.0.0` asset list.
    - Then: Story 1 change log updated with run ID, runtime, and asset confirmation; policy section now references the observed tarball `bmad-drj-1.0.0.tgz`.

#### AC3: Record outstanding audit evidence in Story 1 change log with run ID / release URL / logs

- **Coverage:** FULL
- **Mappings:**
  - **Doc Review:** `docs/bmad/focused-epics/release-governance/story-1.md` change log entry (REL1.2-T2)
    - Given: Manual Release run ID 17598712992, release URL v4.43.1, refreshed dry-run log.
    - When: QA verifies links resolve and evidence files exist in `docs/bmad/focused-epics/release-governance/evidence/`.
    - Then: Acceptance criterion satisfied; follow-up to capture next mainline run is documented.

#### AC4: Extend release runbook with retention guidance and evidence capture checklist

- **Coverage:** FULL
- **Mappings:**
  - **Doc Review:** `docs/release-automation.md` “Evidence capture checklist (Story 1 & 1.2)” section (REL1.2-T4)
    - Given: Checklist includes retention window and archive steps.
    - When: QA validates instructions against GitHub Action settings.
    - Then: Guidance enables future teams to preserve evidence proactively.

### Critical Gaps

- None – all acceptance criteria now have documented evidence.

### Test Design Recommendations

1. Maintain a snapshot of Actions artifact retention settings for auditors.

### Risk Assessment

- **High Risk:** None
- **Medium Risk:** None
- **Low Risk:** AC1–AC4 – documentation backed by evidence

Trace matrix: docs/qa/assessments/release-governance.story-1.2-trace-20250925.md
