# Issue: Triage markdown duplicates flagged by reviewer

## Summary

- Reviewer JSCPD scan on 2025-09-26 reported **323** duplicate markdown blocks across release governance QA artifacts.
- Duplicates primarily appear in historic QA assessments (e.g., `docs/bmad/qa/assessments/story-1.2-qa-gate-20250924.md`).
- No action taken yet; tracked for dedicated cleanup to keep reviewer noise manageable.

## Action Items

1. Audit duplicate segments reported in `artifacts/reviewer/20250926T040820Z/jscpd/jscpd-report.json` and group by source file.
2. Decide whether to refactor common guidance into shared includes or suppress duplicates via reviewer configuration.
3. Update reviewer baseline to acknowledge resolved duplicates and re-run `npm run reviewer:scan` to confirm counts drop below threshold.

## Sources

- Reviewer metrics: `artifacts/reviewer/20250926T040820Z/metrics.json`
- JSCPD report: `artifacts/reviewer/20250926T040820Z/jscpd/jscpd-report.json`
