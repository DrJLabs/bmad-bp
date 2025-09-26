# Risk Profile: Story 1.4 (Automate Release Evidence Capture & Post-Change Validation)

Date: 2025-09-26
Reviewer: Quinn (Test Architect)

## Executive Summary

- Total Risks Identified: 5
- Critical Risks: 0
- High Risks: 2
- Risk Score: 62/100 (High)

Story 1.4 introduces scripted evidence capture plus a mandatory semantic-release run producing a new version. Automation failure or skipped releases would leave the release governance epic without audit evidence. A successful implementation must harden CLI error handling, protect credentials, and ensure repositories stay lean when archiving artifacts.

## Risk Matrix

| Risk ID      | Category    | Description                                                                                                           | Probability | Impact     | Score | Priority |
| ------------ | ----------- | --------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- | ----- | -------- |
| OPS-1.4-001  | Operational | GitHub CLI automation misses run logs/artifacts (retention expiry, wrong run ID) leading to incomplete evidence trail | Medium (2)  | High (3)   | 6     | High     |
| SEC-1.4-002  | Security    | Script exposes `GITHUB_TOKEN` via verbose logging or writes credentials to disk                                       | Low (1)     | High (3)   | 3     | Medium   |
| TECH-1.4-003 | Technical   | Release-worthy change fails to trigger semantic-release (commit scope mismatch) causing follow-ups to remain open     | Medium (2)  | Medium (2) | 4     | Medium   |
| OPS-1.4-004  | Operational | Evidence automation stores large artifacts without pruning, bloating repo and slowing clones                          | Medium (2)  | Medium (2) | 4     | Medium   |
| DATA-1.4-005 | Data        | Timestamped evidence overwrites prior run output due to naming collision, losing audit history                        | Low (1)     | Medium (2) | 2     | Low      |

## Mitigations

- **OPS-1.4-001:** Require explicit run ID input, default to latest but confirm via `gh run view --json status,workflowName`. Add retries and surface actionable errors when artifacts are missing; document manual fallback to download logs via the Actions UI.[^1][^2]
- **SEC-1.4-002:** Pipe GitHub CLI output through redaction safeguards, avoid `--verbose`, and ensure the script never writes environment variables to disk. Recommend running automation inside CI with masked logs.[^3]
- **TECH-1.4-003:** Prepare a small `fix:` change aligned with semantic-release mapping guidance and verify dry-run output before merging to guarantee a non-skipped release. Keep a fallback plan to commit a dummy `fix:` if automation run skips.[^4]
- **OPS-1.4-004:** Compress archived logs, prune artifacts older than 6 months, and document evidence retention strategy alongside the automation command.[^2]
- **DATA-1.4-005:** Incorporate ISO-8601 timestamps in filenames (`YYYYMMDDTHHMMSSZ`) and add safeguards to check for existing files before writing.[^5]

## Residual Risks

- GitHub CLI dependency assumes local environment has `gh` authenticated with correct scopes; automation should detect missing auth and prompt operator.
- Manual release fallback still relies on human discipline; consider future story to run automation as part of Release workflow job.

## Recommendations

- Treat evidence automation command as required gate step; fail story sign-off if logs are absent.
- Capture CLI stdout/stderr in Story 1 change log to demonstrate success and aid debugging.
- Consider implementing artifact pruning script as part of release automation to avoid repo bloat.

## Follow-Up Tasks

- [ ] Add pre-flight check verifying `gh auth status` before evidence collection (owner: Dev Agent).
- [ ] Define artifact retention policy (owner: Release Maintainer) and note it in runbook.

Risk profile stored at `docs/qa/assessments/release-governance.story-1.4-risk-20250926.md`.

## References

[^1]: GitHub CLI Manual – `gh run view`. https://cli.github.com/manual/gh_run_view

[^2]: GitHub Docs – Downloading workflow artifacts. https://docs.github.com/en/actions/managing-workflow-runs/downloading-workflow-artifacts

[^3]: GitHub Docs – Security hardening for GitHub Actions. https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions

[^4]: semantic-release Documentation – Dry run configuration. https://semantic-release.gitbook.io/semantic-release/usage/configuration#dryrun

[^5]: ISO 8601 Date and Time Format Overview. https://www.iso.org/iso-8601-date-and-time-format.html
