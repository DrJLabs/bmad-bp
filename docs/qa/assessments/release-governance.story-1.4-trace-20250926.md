# Requirements Traceability Matrix: Story 1.4 (Automate Release Evidence Capture & Post-Change Validation)

## Coverage Summary

- Total Requirements: 3
- Fully Covered: 3
- Partially Covered: 0
- Not Covered: 0

## Requirement Mappings

### AC1 – Automation command captures release evidence with run ID support

- Coverage: **Full**
- Test Mappings:
  - Test File: `tools/release/__tests__/capture-release-evidence.test.js`
    - Test Case: `buildEvidencePaths returns expected filenames`
    - Given: Timestamp + run ID inputs for helper functions
    - When: Generating evidence paths for release artifacts
    - Then: CLI helpers emit timestamped directories aligned with governance evidence structure
    - Coverage: unit
  - Manual Execution: `npm run release:evidence -- --run-id 18024216996 --skip-dry-run`
    - Given: Release workflow run 18024216996 on `main`
    - When: Automation command captures metadata/logs into timestamped evidence directory
    - Then: Evidence stored under `docs/bmad/focused-epics/release-governance/evidence/release-run-18024216996-20250926T040000Z/`
    - Coverage: integration

### AC2 – Documentation instructs maintainers to run automation

- Coverage: **Full**
- Test Mappings:
  - Manual Review: `docs/release-automation.md` evidence checklist updates
    - Given: Maintainer reads updated checklist
    - When: Following steps 1–7
    - Then: Maintainer runs `npm run release:evidence` and records outputs
    - Coverage: manual
  - Manual Review: `docs/versioning-and-releases.md` developer tips section
    - Given: Release maintainer planning post-merge actions
    - When: Reviewing developer tips
    - Then: Maintainer executes automation command with/without run ID
    - Coverage: manual

### AC3 – Execute automation after real release-worthy change and record outputs

- Coverage: **Full**
- Test Mapping:
  - Scenario: Post-merge release workflow run `18024216996` (push from PR #12) followed by `npm run release:evidence -- --run-id 18024216996 --skip-dry-run`
    - Given: Release workflow publishes `v1.1.0` with asset `bmad-drj-1.1.0.tgz`
    - When: Automation command stores metadata/log and Story 1 change log records run ID, release URL, tarball status, and evidence directory
    - Then: Story 1 change log row “Evidence+++” references the archived evidence
    - Coverage: integration

## Coverage Gaps

None — all acceptance criteria now have validating evidence.

## Gate Snippet

```yaml
trace:
  totals:
    requirements: 3
    full: 3
    partial: 0
    none: 0
  planning_ref: qa/assessments/release-governance.story-1.4-test-design-20250926.md
  uncovered: []
  notes: qa/assessments/release-governance.story-1.4-trace-20250926.md
```

## Notes

- Consider adding automated link checks for release documentation anchors in future work.
