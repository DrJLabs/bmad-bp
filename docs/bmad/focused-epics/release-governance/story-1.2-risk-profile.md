# Risk Profile: Story 1.2 (Finalize Release Evidence & Artifact Governance)

Date: 2025-09-25
Reviewer: Quinn (Test Architect)

## Executive Summary

- Total Risks Identified: 3
- Critical Risks: 0
- High Risks: 2
- Risk Score: 70/100

## Risk Matrix

| Risk ID     | Category      | Description                                                                                             | Probability | Impact     | Score | Priority |
| ----------- | ------------- | ------------------------------------------------------------------------------------------------------- | ----------- | ---------- | ----- | -------- |
| REL-1.2-001 | Governance    | Release evidence remains incomplete (missing run ID, release URL, logs) delaying audits and QA sign-off | Medium (2)  | High (3)   | 6     | High     |
| REL-1.2-002 | Documentation | Versioning guidance lacks actionable mapping, causing incorrect semantic-release expectations           | Medium (2)  | Medium (2) | 4     | Medium   |
| REL-1.2-003 | Operational   | Artifact attachment policy unclear, leading to broken downstream processes or unnecessary storage       | Medium (2)  | High (3)   | 6     | High     |

## Mitigations

- **REL-1.2-001:** Update Story 1 change log with Release run ID, release URL, dry-run output, and permissions-failure log; ensure evidence stored in `docs/bmad/focused-epics/release-governance/evidence/`.
- **REL-1.2-002:** Insert the Conventional Commit → version bump table and validation checklist into `docs/release-automation.md`, referencing `docs/versioning-and-releases.md` for supporting detail.
- **REL-1.2-003:** Execute the artifact decision (keep or remove tarballs) and document verification steps or rollback procedure so future releases follow a single path.

## Residual Risks

- Audit timelines can still slip if Actions retention policies delete evidence before documentation is updated; coordinate with ops to download artifacts when needed.
- Architecture shards referenced in `.bmad-core/core-config.yaml` remain missing; record the gap so downstream agents do not spend time searching for nonexistent guidance.

## Recommendations

- Prioritize completing evidence capture immediately after the next successful `Release` workflow run to avoid losing logs.
- Pair documentation updates with a peer review to confirm links resolve and instructions match the workflow behaviour.
- Schedule a follow-up check once the artifact policy decision is documented to verify teams downstream are informed.

## Follow-Up Tasks

- [ ] Attach release evidence (run ID, release URL, dry-run log, permissions failure log) to Story 1 change log and evidence directory.
- [ ] Publish version bump matrix + checklist in `docs/release-automation.md`; cross-reference in `docs/versioning-and-releases.md`.
- [ ] Document final artifact policy, including verification steps and rollback guidance, in the release runbook.
