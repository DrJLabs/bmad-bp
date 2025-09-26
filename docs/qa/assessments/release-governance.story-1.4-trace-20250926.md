# Requirements Traceability Matrix: Story 1.4 (Automate Release Evidence Capture & Post-Change Validation)

## Coverage Summary

- Total Requirements: 3
- Fully Covered: 0
- Partially Covered: 2
- Not Covered: 1

## Requirement Mappings

### AC1 – Automation command captures release evidence with run ID support

- Coverage: **Partial** (unit helpers verified; full CLI path not exercised against live gh)
- Test Mappings:
  - Test File: `tools/release/__tests__/capture-release-evidence.test.js`
    - Test Case: `buildEvidencePaths returns expected filenames`
    - Given: Timestamp + run ID inputs for helper functions
    - When: Generating evidence paths for release artifacts
    - Then: CLI helpers emit timestamped directories aligned with governance evidence structure
    - Coverage: unit
  - Manual Check: `npm run release:evidence --skip-dry-run` (developer run)
    - Given: Local environment with GitHub CLI auth configured
    - When: Invoking automation without specifying run ID
    - Then: Command resolves latest run and writes evidence directory (needs captured log in Story 1 change log)
    - Coverage: manual (pending full evidence capture)

### AC2 – Documentation instructs maintainers to run automation

- Coverage: **Partial** (docs updated; no automated validation of anchors)
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

- Coverage: **None** (story task still unchecked)
- Planned Test:
  - Scenario: After merging `fix:` change, run `.github/workflows/release.yaml`, execute `npm run release:evidence -- --run-id <run>` and update Story 1 change log
    - Given: new release-worthy commit on `main`
    - When: Workflow completes and automation command runs with explicit run ID
    - Then: Story 1 change log lists run ID, release URL, tarball status, and evidence directory
    - Coverage: integration (future)

## Coverage Gaps

1. Requirement: AC1 – Automation command end-to-end validation
   - Gap: No integration test or recorded evidence run
   - Severity: Medium
   - Suggested Test: Integration script that stubs `gh` responses or executes against sandbox repo capturing artifacts

2. Requirement: AC2 – Documentation anchor validation
   - Gap: Anchors manually verified; no automated doc test
   - Severity: Low
   - Suggested Test: Link checker or markdown lint ensuring cross-doc anchors remain valid

3. Requirement: AC3 – Post-merge release evidence capture
   - Gap: Release workflow still needs real run output + Story 1 change log entry
   - Severity: High
   - Suggested Test: Manual execution plus log capture, followed by scripted regression to ensure automation handles real artifacts

## Gate Snippet

```yaml
trace:
  totals:
    requirements: 3
    full: 0
    partial: 2
    none: 1
  planning_ref: qa/assessments/release-governance.story-1.4-test-design-20250926.md
  uncovered:
    - ac: 'AC3'
      reason: 'Awaiting live release run evidence after automation command executes on main'
  notes: qa/assessments/release-governance.story-1.4-trace-20250926.md
```

## Notes

- Prioritize closing AC3 via release-worthy commit and automation run before marking story complete.
- Consider adding mocked GH CLI integration tests to raise coverage for AC1.
