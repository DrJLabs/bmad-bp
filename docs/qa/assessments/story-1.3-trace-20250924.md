# Requirements Traceability Matrix

## Story: 1.3 - Integrate Reviewer Into Focused-Epic Workflow

Date: 2025-09-24
Reviewer: Quinn (Test Architect)

### Coverage Summary

- Total Requirements: 10
- Fully Covered: 5 (50%)
- Partially Covered: 5 (50%)
- Not Covered: 0 (0%)

### Requirement Mappings

#### AC1: Update `.bmad-core/workflows/focused-epic.yaml` inserting reviewer stage

Coverage: FULL

Given-When-Then Mappings:

- Validation: `manual/workflow-review.md::reviewer-stage-sequence`
  - Given: Updated workflow with reviewer block after dev stage
  - When: Analyst inspects YAML ordering and inputs
  - Then: Stage lists preflight, reviewer run, telemetry sync in sequence
  - Coverage: partial (structure verified, no automated workflow execution)

- Command: `npm run reviewer:scan`
  - Given: Local environment with updated reviewer tooling
  - When: Reviewer scan command executes
  - Then: Reviewer artifacts (semgrep, jscpd, metrics) produced under `artifacts/reviewer/<ts>/`
  - Coverage: partial (validates tooling, not full workflow integration)

- Automation: GitHub Actions run [17993801430](https://github.com/DrJLabs/bmad-bp/actions/runs/17993801430)
  - Given: PR Validation workflow with reviewer matrix job
  - When: Default and strict reviewer stages execute in CI
  - Then: Preflight, scan, metrics validation, and artifact upload succeed
  - Coverage: full (workflow integration proven in CI)

#### AC2: Document reviewer usage with quick-start checklist and troubleshooting

Coverage: PARTIAL

- Validation: `docs/bmad/reviewer/README.md` manual check
  - Given: Updated README
  - When: QA reviews quick-start section
  - Then: Checklist, telemetry sync steps, rollback instructions present
  - Coverage: partial (no automated doc lint beyond eslint Markdown rules)

- Command: `npm run lint`
  - Given: Repository with documentation changes
  - When: Lint pipeline runs
  - Then: Markdown/YAML lint passes with reviewer guidance included
  - Coverage: partial (ensures formatting, not content accuracy)

#### AC3: Update `docs/bmad/issues/reviewer-rollout.md` tracker

Coverage: PARTIAL

- Validation: `manual/tracker-review.md::telemetry-table`
  - Given: Updated rollout tracker
  - When: QA reviews Telemetry Runs table and strict-mode checklist
  - Then: New columns and governance criteria documented
  - Coverage: partial (content verified manually)

#### AC4: Publish telemetry metrics to rollout tracker automatically after workflow runs

Coverage: PARTIAL

- Command: `npm run reviewer:telemetry-sync -- --metrics artifacts/reviewer --tracker docs/bmad/issues/reviewer-rollout.md`
  - Given: Reviewer metrics generated from local dry-run
  - When: Telemetry sync command executes
  - Then: Row appended to Telemetry Runs table with runtime, findings, false-positive rate
  - Coverage: partial (demonstrated via manual invocation, not automated CI hook)

#### AC5: Invoke preflight + `bmad reviewer run` + artifact piping in workflow

Coverage: FULL

- Command: `bash tools/reviewer/preflight.sh`
  - Given: Updated tooling
  - When: Preflight script runs
  - Then: Dependencies verified, directories prepared
  - Coverage: partial (tooling validated, workflow call not executed in CI)

- Command: `npm run reviewer:scan`
  - Given: Updated workflow assets
  - When: Reviewer scan executed locally
  - Then: Artifacts generated (semgrep, jscpd, metrics) for QA
  - Coverage: partial (full workflow integration not proven)

- Automation: GitHub Actions run [17993801430](https://github.com/DrJLabs/bmad-bp/actions/runs/17993801430)
  - Given: Reviewer dry-run matrix job in CI
  - When: Default and strict matrix entries execute `npm run reviewer:scan`
  - Then: Artifacts archived under `artifacts/reviewer/20250925T010832Z` and `...T010849Z`
  - Coverage: full (automation confirms reviewer stage execution and artifact piping)

#### AC6: Introduce reviewer config toggle with rollback procedure

Coverage: FULL

- Validation: `.bmad-core/core-config.yaml` manual inspection
  - Given: New `reviewer` config block
  - When: QA reviews enabled/strict/skip flags and override key
  - Then: Toggle exists with documented defaults
  - Coverage: partial (no automated test toggling value)

- Documentation: `docs/bmad/reviewer/README.md::Rollback Procedure`
  - Given: Updated documentation
  - When: QA reviews rollback steps
  - Then: Toggle + workflow comment guidance captured
  - Coverage: partial

- Automation: `npm run reviewer:config-test` (GitHub Actions run [17993801430](https://github.com/DrJLabs/bmad-bp/actions/runs/17993801430))
  - Given: CI executes config resolver tests during PR Validation
  - When: Script toggles `reviewer.enabled`/`BMAD_REVIEWER_SKIP`/`BMAD_REVIEWER_STRICT`
  - Then: Effective run/skip/strict states validated with exit code zero
  - Coverage: full (toggle behavior proven in automation)

#### AC7: Ensure QA artifacts reference reviewer outputs

Coverage: PARTIAL

- Validation: `.bmad-core/templates/qa-gate-tmpl.yaml`
  - Given: Template update
  - When: QA checks reviewer artifact hints
  - Then: Paths for report, SARIF, JSON, metrics recorded
  - Coverage: partial (template render not unit-tested)

- Documentation: `docs/bmad/focused-epics/reviewer-agent/story-3-test-design.md`
  - Given: Test design document
  - When: QA reviews artifact hints section
  - Then: Paths documented for downstream tasks
  - Coverage: partial

#### AC8: Add optional dry-run matrix job snippet

Coverage: FULL

- Validation: Reviewer README optional GA snippet
  - Given: Snippet embedded in README
  - When: QA reviews YAML example and telemetry sync integration
  - Then: Matrix job instructions captured
  - Coverage: partial (job not executed in CI)

- Automation: GitHub Actions run [17993801430](https://github.com/DrJLabs/bmad-bp/actions/runs/17993801430)
  - Given: `reviewer-dry-run` matrix job wired into PR Validation workflow
  - When: Default and strict modes execute in CI
  - Then: Reviewer artifacts uploaded and telemetry validated without gating merges
  - Coverage: full (optional matrix job proven operational)

#### AC9: Validate workflow changes via dry-run

Coverage: FULL

- Commands: `bash tools/reviewer/preflight.sh`, `npm run reviewer:scan`, `npm run reviewer:telemetry-sync`
  - Given: Updated workflow artifacts
  - When: Dry-run commands executed locally
  - Then: Reviewer stage validated end-to-end with telemetry recorded
  - Coverage: partial (local dry-run only, not full workflow execution)

- Automation: GitHub Actions run [17993801430](https://github.com/DrJLabs/bmad-bp/actions/runs/17993801430)
  - Given: Reviewer dry-run CI gate in PR Validation
  - When: Matrix jobs execute default/strict reviewer scans prior to merge
  - Then: Workflow regression prevented and evidence archived in CI artifacts
  - Coverage: full (dry-run validation enforced in CI)

#### AC10: Provide rollback instructions and strict-mode governance

Coverage: FULL

- Documentation: `docs/bmad/issues/reviewer-telemetry-thresholds.md`
  - Given: Reviewer runtime and false-positive targets defined with cited benchmarks
  - When: QA reviews strict-mode criteria
  - Then: Governance thresholds exist with measurement windows supporting checklist validation
  - Coverage: full (manual validation)

- Validation: `docs/bmad/issues/reviewer-rollout.md::Strict-Mode Governance Checklist`
  - Given: Updated rollout tracker checklist
  - When: QA reviews gating criteria
  - Then: Checklist includes runtime, false-positive, and triage commitments aligned to telemetry thresholds doc
  - Coverage: full (documentation alignment)

### Critical Gaps

1. **Telemetry sync still dry-run only (AC4)**
   - Risk: Low — rollout tracker relies on manual updates until CI job writes rows without `--dry-run`.
   - Suggested action: Enable telemetry sync write-back for trusted branches or add approval gate before committing updates.

2. **Reviewer artifact references rely on manual doc validation (AC7)**
   - Risk: Low — template references could drift without automated lint.
   - Suggested action: Add doc lint or test to verify artifact paths remain accurate.

### Test Design Recommendations

1. Introduce GitHub Actions reusable workflow test that runs reviewer stage with skip flag permutations (validate telemetry sync).
2. Add integration tests (e.g., `tests/workflows/reviewer-stage.test.ts`) that mock BMAD workflow execution and assert artifacts/telemetry outputs.
3. Document and automate strict-mode thresholds capturing runtime percentiles and false-positive ceilings. ✅ Covered by `docs/bmad/issues/reviewer-telemetry-thresholds.md` (governance criteria documented).

### Gate YAML Block

```yaml
trace:
  totals:
    requirements: 10
    full: 6
    partial: 4
    none: 0
  planning_ref: 'docs/bmad/focused-epics/reviewer-agent/story-3-test-design.md'
  uncovered: []
  notes: 'See docs/qa/assessments/story-1.3-trace-20250924.md'
```

### Assessment Notes

- Workflow execution now automated via PR Validation run 17993801430 (default + strict reviewer dry-runs).
- Telemetry sync still uses `--dry-run`; consider enabling write-back once governance approvals are in place (AC4).
- Reviewer artifact references remain manually validated; add doc lint to assert template paths if needed (AC7).

Traceability report stored at `docs/qa/assessments/story-1.3-trace-20250924.md`.
