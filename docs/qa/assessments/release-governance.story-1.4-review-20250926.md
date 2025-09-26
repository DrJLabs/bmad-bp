# QA Review: Story 1.4 (Automate Release Evidence Capture & Post-Change Validation)

Date: 2025-09-26
Reviewer: Quinn (Test Architect)
Gate Decision: PASS

## Scope

- Code: `tools/release/capture-release-evidence.js`, `tools/release/__tests__/capture-release-evidence.test.js`, `package.json`
- Docs: `docs/release-automation.md`, `docs/versioning-and-releases.md`, Story 1 change log updates
- Automation artifacts: `artifacts/reviewer/20250926T040820Z`

## Key Observations

- Automation CLI validates gh auth status, resolves run IDs, and shapes timestamped evidence directories.
- Live release run 18024216996 on `main` captured via `npm run release:evidence -- --run-id 18024216996 --skip-dry-run`; release `v1.1.0` includes tarball `bmad-drj-1.1.0.tgz`.
- Documentation directs maintainers to use the new automation command pre- and post-merge, including retention checks.
- Reviewer scan clean (Semgrep 0). JSCPD duplicates originate from historical QA docs; follow-up logged at `docs/bmad/issues/release-governance-duplicate-content.md`.

## Risks & Follow-Ups

None — story now meets all acceptance criteria. Track future doc/link automation as part of tech debt issue.

## Testing Performed

- `npm run release:evidence:test`
- `npm run release:evidence -- --run-id 18024216996 --skip-dry-run`
- `npm run reviewer:preflight`
- `npm run reviewer:scan`
- `npm run format:check`

## References

- Trace matrix: `docs/qa/assessments/release-governance.story-1.4-trace-20250926.md`
- NFR assessment: `docs/qa/assessments/release-governance.story-1.4-nfr-20250926.md`
- Gate file: `docs/qa/gates/release-governance.story-1.4-automate-release-evidence-capture-post-change-validation.yml`
