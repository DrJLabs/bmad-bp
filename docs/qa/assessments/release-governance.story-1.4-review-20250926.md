# QA Review: Story 1.4 (Automate Release Evidence Capture & Post-Change Validation)

Date: 2025-09-26
Reviewer: Quinn (Test Architect)
Gate Decision: CONCERNS

## Scope

- Code: `tools/release/capture-release-evidence.js`, `tools/release/__tests__/capture-release-evidence.test.js`, `package.json`
- Docs: `docs/release-automation.md`, `docs/versioning-and-releases.md`, Story 1 change log updates
- Automation artifacts: `artifacts/reviewer/20250926T023210Z`

## Key Observations

- Automation CLI validates gh auth status, resolves run IDs, and shapes timestamped evidence directories.
- Unit helpers ensure deterministic filenames; CLI path still needs end-to-end validation against live release runs (AC3).
- Documentation now directs maintainers to run `npm run release:evidence` pre- and post-merge, including retention checks.
- Reviewer scan clean (Semgrep 0). JSCPD duplicates originate from historical QA docs; follow-up logged at `docs/bmad/issues/release-governance-duplicate-content.md`.

## Risks & Follow-Ups

1. **Release Evidence Gap (High)** — AC3 incomplete; Story 1 change log lacks run ID + release URL from automated capture.
2. **Documentation Drift (Medium)** — Updated anchors verified manually; recommend adding automated link check.

## Testing Performed

- `npm run release:evidence:test`
- `npm run reviewer:preflight`
- `npm run reviewer:scan`
- `npm run format:check`

## References

- Trace matrix: `docs/qa/assessments/release-governance.story-1.4-trace-20250926.md`
- NFR assessment: `docs/qa/assessments/release-governance.story-1.4-nfr-20250926.md`
- Gate file: `docs/qa/gates/release-governance.story-1.4-automate-release-evidence-capture-post-change-validation.yml`
