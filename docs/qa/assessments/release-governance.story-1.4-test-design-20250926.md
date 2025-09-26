# Test Design: Story 1.4 (Automate Release Evidence Capture & Post-Change Validation)

Date: 2025-09-26
Author: Quinn (Test Architect)

## Objectives

Validate that the new evidence automation script reliably captures GitHub Actions release artifacts, preserves audit history, and that a non-skipped semantic-release run exercises the workflow end-to-end while protecting credentials and repository health.

## Test Strategy Overview

- Total scenarios: 7
- Level mix: Process 2, Integration 3, Negative 1, Security 1
- Priority mix: P0 = 4, P1 = 3, P2 = 0
- Dependencies: Story 1 change log template, `docs/release-automation.md`, `docs/versioning-and-releases.md`, `.github/workflows/release.yaml`, GitHub CLI (`gh`) configured, semantic-release configuration, evidence directory.

## Test Scenarios

| ID        | Priority | Level       | Scenario                                                                                                                                                                   | Method                                                                                                                                                                | Mitigates                 |
| --------- | -------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| REL1.4-T1 | P0       | Integration | Run `npm run release:evidence -- --run-id <id>` against a fresh release run; confirm timestamped logs/artifacts saved                                                      | Execute `gh auth status` to verify authentication, run script with explicit run ID, inspect evidence directory for ISO-8601 filenames and collision handling          | OPS-1.4-001, DATA-1.4-005 |
| REL1.4-T2 | P0       | Integration | After merging a `fix:` commit, trigger release workflow, ensure semantic-release produces a non-skipped release, then rerun automation with default (latest) run selection | Merge change, run `.github/workflows/release.yaml`, execute automation without `--run-id`, verify Story 1 change log updated with run ID, release URL, tarball status | TECH-1.4-003              |
| REL1.4-T3 | P0       | Negative    | Invoke automation with invalid or expired run ID; script must fail fast with actionable error and fallback guidance                                                        | Call script with stale ID, observe error message, ensure manual instructions logged                                                                                   | OPS-1.4-001               |
| REL1.4-T4 | P0       | Security    | Review command output/logs to confirm `GITHUB_TOKEN` is redacted and no secrets written to disk                                                                            | Enable CLI debug logging safeguards, capture stdout/stderr, run secret scan                                                                                           | SEC-1.4-002               |
| REL1.4-T5 | P1       | Process     | Verify documentation updates direct maintainers to run automation, capture outputs, and prune old artifacts                                                                | Check anchors in docs, confirm retention guidance and manual fallback documented                                                                                      | OPS-1.4-004               |
| REL1.4-T6 | P1       | Integration | Execute automation twice in same minute; ensure timestamp collision handling prevents overwrites                                                                           | Rapidly run command twice, confirm second run appends suffix or rejects with guidance                                                                                 | DATA-1.4-005              |
| REL1.4-T7 | P1       | Process     | Validate repo/org Actions retention settings and artifact pruning job align with documented policy                                                                         | Inspect Actions settings for retention days, confirm automation deletes/archives files beyond policy window                                                           | OPS-1.4-004               |

## Test Data

- Release workflow run ID that produced a non-skipped semantic-release release.
- Sample `fix:` commit touching docs or code to trigger a patch version bump.
- Invalid run ID (e.g., old ID outside retention window) for negative testing.

## Tooling

- `npm run release:evidence -- --run-id <run-id>`
- `gh run view <run-id> --log --json status,workflowName`[^cli-run-view]
- `gh run download <run-id> --name release --dir <target>`[^cli-run-download]
- `npx semantic-release --dry-run --ci false`[^semrel-dryrun]
- Secret scan (e.g., `npm run lint:secrets` if available) or manual grep for `GITHUB_TOKEN`

## Exit Criteria

- REL1.4-T1–T4 must pass before QA can recommend story approval.
- REL1.4-T2 must demonstrate a non-skipped release run with change log update; otherwise story remains in CONCERNS.
- Document outcomes in Story 1 change log and attach evidence paths for each scenario.

## Additional Notes

- Consider wrapping automation command in CI job for reproducibility in future stories.
- Retention policy should include pruning schedule (e.g., delete evidence older than 180 days) to maintain repo health.
- Capture CLI version (`gh --version`) in evidence to ensure future reproducibility.
- Record that `gh auth status` completed successfully (without storing raw output) to demonstrate an authenticated context before artifact pulls.[^gh-auth-status]
- Confirm retention settings respect GitHub’s 90-day default or customized values to avoid evidence loss.[^actions-retention]

## Follow-Up Tasks

- [ ] Explore automating evidence command as part of Release workflow to reduce manual steps (future story).
- [ ] Evaluate adding integration tests that mock GitHub CLI responses for faster feedback.

Test design stored at `docs/qa/assessments/release-governance.story-1.4-test-design-20250926.md`.

## 🔬 Research & Validation Log (2025-09-26)

- **Researcher:** Dr. Evelyn Reed
- **Active Mode:** solo
- **Primary Artifact:** docs/qa/assessments/release-governance.story-1.4-test-design-20250926.md
- **Summary:** Validated coverage for CLI authentication, retention policy alignment, and semantic-release verification. Added scenarios and guidance to ensure automation proof points survive GitHub retention windows without exposing credentials.

### Findings & Actions

| Priority | Area            | Recommended Change                                                                                   | Owner / Reviewer        | Confidence | Mode | Controls   | Evidence Location  | Sources                                                                                                                                                                                                         |
| -------- | --------------- | ---------------------------------------------------------------------------------------------------- | ----------------------- | ---------- | ---- | ---------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| High     | Automation Prep | Require `gh auth status` pre-check and capture output in evidence before running download commands.  | Dev Agent / QA          | High       | solo | SOC2 CC8.1 | Story 1 change log | [GitHub CLI Manual – gh auth status](https://cli.github.com/manual/gh_auth_status)                                                                                                                              |
| High     | Retention       | Verify retention configuration and plan artifact pruning alongside automation deliverables.          | Release Maintainer / QA | High       | solo | SOC2 CC8.1 | Story 1 change log | [GitHub Docs – Actions retention defaults](https://docs.github.com/en/organizations/managing-organization-settings/configuring-the-retention-period-for-github-actions-artifacts-and-logs-in-your-organization) |
| Medium   | Release Signal  | Mandate evidence of non-skipped semantic-release runs post-change, referencing version bump mapping. | Dev Agent / PO          | Medium     | solo | SOC2 CC8.1 | Story 1 change log | [semantic-release Docs – Dry Run](https://semantic-release.gitbook.io/semantic-release/usage/configuration#dryrun)                                                                                              |

### Tooling Guidance

- **FOSS-first Recommendation:** GitHub CLI (`gh auth status`, `gh run view`, `gh run download`) for authenticated evidence capture.[^gh-auth-status][^cli-run-view][^cli-run-download]
- **Paid Option (if required):** None required; GitHub CLI and semantic-release cover needs.
- **Automation / Scripts:** Extend `release:evidence` wrapper to call `gh auth status --active`, log a success marker, then fetch artifacts using `gh run download --dir docs/bmad/focused-epics/release-governance/evidence/<timestamp>`.[^gh-auth-status][^cli-run-download]

### Risk & Compliance Notes

- **Residual Risks:** Missing CLI authentication or expired retention windows will stall evidence capture—treat automation failures as release blockers.[^gh-auth-status][^actions-retention]
- **Compliance / Control Mapping:** Supports SOC2 CC8.1 change-management evidence retention expectations.
- **Monitoring / Observability:** Record `gh --version` and automation exit codes in Story 1 change log; alert on failures.
- **Rollback / Contingency:** Document manual artifact download via the Actions UI as a fallback option.[^actions-download]

### Follow-Up Tasks

- [ ] Script automated pruning (e.g., delete artifacts older than retention) after successful evidence capture — Owner: Dev Agent, Due: 2025-10-05.
- [ ] Evaluate GitHub CLI mock harness for unit tests covering negative scenarios — Owner: QA, Due: 2025-10-05.

### Source Appendix

1. gh auth status — GitHub CLI Manual (Accessed 2025-09-26). https://cli.github.com/manual/gh_auth_status
2. Configuring Actions artifact retention — GitHub Docs (Accessed 2025-09-26). https://docs.github.com/en/organizations/managing-organization-settings/configuring-the-retention-period-for-github-actions-artifacts-and-logs-in-your-organization
3. semantic-release configuration (dry-run) — semantic-release Docs (Accessed 2025-09-26). https://semantic-release.gitbook.io/semantic-release/usage/configuration#dryrun

## References

[^gh-auth-status]: GitHub CLI Manual – `gh auth status`. https://cli.github.com/manual/gh_auth_status

[^cli-run-view]: GitHub CLI Manual – `gh run view`. https://cli.github.com/manual/gh_run_view

[^cli-run-download]: GitHub CLI Manual – `gh run download`. https://cli.github.com/manual/gh_run_download

[^semrel-dryrun]: semantic-release Documentation – Dry run configuration. https://semantic-release.gitbook.io/semantic-release/usage/configuration#dryrun

[^actions-retention]: GitHub Docs – Configuring Actions artifact retention. https://docs.github.com/en/organizations/managing-organization-settings/configuring-the-retention-period-for-github-actions-artifacts-and-logs-in-your-organization

[^actions-download]: GitHub Docs – Downloading workflow artifacts. https://docs.github.com/en/actions/managing-workflow-runs/downloading-workflow-artifacts
