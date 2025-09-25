# Risk Profile: Story 1.3 (Close Release Evidence & Governance Checklist)

Date: 2025-09-25
Reviewer: Quinn (Test Architect)

## Executive Summary

- Total Risks Identified: 4
- Critical Risks: 0
- High Risks: 2
- Risk Score: 68/100 (High)

Story 1.3 is the final governance hardening work for the release-focused epic. It consolidates evidence capture, doc cross-linking, and epic checklist closure. The biggest risks stem from audit evidence expiring (GitHub Actions retention defaults to 90 days) and incomplete sign-off across interdependent docs.

## Risk Matrix

| Risk ID     | Category      | Description                                                                                                   | Probability | Impact     | Score | Priority |
| ----------- | ------------- | ------------------------------------------------------------------------------------------------------------- | ----------- | ---------- | ----- | -------- |
| REL-1.3-001 | Governance    | Actions run ID, release URL, or evidence logs not recorded before retention expires, blocking audit readiness | Medium (2)  | High (3)   | 6     | High     |
| REL-1.3-002 | Documentation | Release/runbook cross-links drift; developers miss checklist steps, causing inconsistent evidence updates     | Medium (2)  | Medium (2) | 4     | Medium   |
| REL-1.3-003 | Operational   | Manual release trigger fires when commits pending, producing unintended tag/version                           | Low (1)     | High (3)   | 3     | Medium   |
| REL-1.3-004 | Residual Gap  | Epic checklist marked complete without referencing proof artifacts, losing traceability                       | Low (1)     | Medium (2) | 2     | Low      |

## Mitigations

- **REL-1.3-001:** Capture fresh dry-run output and Release workflow run logs immediately after execution; archive them under `docs/bmad/focused-epics/release-governance/evidence/` and add links to Story 1 change log. Reference GitHub’s 90-day action log retention in documentation to enforce timely downloads (GitHub Docs, accessed 2025-09-25).
- **REL-1.3-002:** Add bidirectional anchors between `docs/release-automation.md` evidence checklist and `docs/versioning-and-releases.md` automated workflow section so maintainers can navigate the matrix quickly (internal documentation review, 2025-09-25).
- **REL-1.3-003:** Document pre-flight step for manual release triggers (verify no pending commits) and encourage use of `--dry-run` before dispatching `release.yaml` (semantic-release guidance, accessed 2025-09-25).
- **REL-1.3-004:** When ticking epic checklist items, reference the stored evidence (run ID, release URL, log filenames) to preserve traceability.

## Residual Risks

- Evidence freshness still depends on maintainers capturing new logs per release; consider automating attachment downloads in future stories.
- Architecture shards remain absent; Dev Notes already document the gap, but downstream agents may need confirmation when implementing.

## Recommendations

- Treat evidence capture as a blocking step: run Release workflow, download artifacts, update change log, then mark story complete.
- After cross-linking docs, have the PO perform a quick doc check to ensure anchors resolve; flag any broken links before merging.
- Record a short "evidence capture" checklist in Story 1 change log to guide future maintainers.

## Follow-Up Tasks

- [x] Attach new dry-run logs, run ID, release URL, and permissions/skip logs to Story 1 change log before Story 1.3 approval.
- [x] Verify release documentation contains updated anchors and note the verification date in Story 1 change log.
- [ ] Confirm epic checklist items include direct links to evidence artifacts.

## References

1. GitHub Actions artifact & log retention defaults (90 days) — GitHub Docs (accessed 2025-09-25).
2. Semantic-release dry-run verification guidance — semantic-release docs (accessed 2025-09-25).
3. Release governance story change log (Story 1) — repo docs (accessed 2025-09-25).
