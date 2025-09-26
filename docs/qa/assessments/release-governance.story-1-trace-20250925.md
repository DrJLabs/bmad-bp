# Requirements Traceability Matrix

## Story: release-governance.story-1 - Align Release Workflow with BMAD GitHub-Only Pattern

### Coverage Summary

- Total Requirements: 7
- Fully Covered: 5 (71%)
- Partially Covered: 2 (29%)
- Not Covered: 0 (0%)

### Requirement Mappings

#### AC1: Add GitHub Actions release workflow that runs semantic-release with GitHub plugins only (no npm publish) and succeeds on `main`.

- **Coverage: FULL**
  - Test File: docs/bmad/focused-epics/release-governance/evidence/semantic-release-dry-run.log
    - Test Case: semantic-release dry run (REL-T1)
    - Given: Repository on feature branch with updated workflow
    - When: Running `npx semantic-release --dry-run --no-ci`
    - Then: Workflow executes with GitHub-only plugins and no npm publish step
  - Test File: GitHub Actions `release` workflow (REL-T2, to be captured on `main`)
    - Test Case: release workflow run on `main`
    - Given: Workflow triggered by push to `main`
    - When: CI job executes semantic-release with GitHub plugins
    - Then: Workflow completes successfully and publishes GitHub release artifacts

#### AC2: Configure semantic-release to skip npm publishing, pin the GitHub-only plugin set, and emit changelog + GitHub release artifacts.

- **Coverage: FULL**
  - Test File: docs/bmad/focused-epics/release-governance/evidence/semantic-release-dry-run.log
    - Test Case: semantic-release dry run (REL-T1)
    - Given: `.releaserc.json` updated with GitHub-only configuration
    - When: Dry run executes
    - Then: Log shows changelog generation and GitHub assets preparation without npm publish

#### AC3: Update `.bmad-core/install-manifest.yaml` to include new reviewer tooling and bump BMAD version reference.

- **Coverage: FULL**
  - Test File: docs/bmad/focused-epics/release-governance/evidence/bmad-validate.log
    - Test Case: `npm run bmad:validate` (REL-T4)
    - Given: Manifest updated to 4.43.2 with new files listed
    - When: Validator runs
    - Then: Manifest integrity confirmed with no errors

#### AC4: Document the release process (runbook entry under `docs/`) including triggers, release artifacts, and evidence capture.

- **Coverage: PARTIAL**
  - Test File: docs/release-automation.md (peer review) (REL-T5)
    - Test Case: Documentation review
    - Given: Updated runbook describing GitHub-only flow and evidence checklist
    - When: QA reviews documentation content
    - Then: Documentation reflects new process but pending reviewer sign-off is noted for REL-T5 completion

#### AC5: Configure the release workflow with explicit `permissions` (minimum `contents: write`) and document `GITHUB_TOKEN` verification steps.

- **Coverage: FULL**
  - Test File: .github/workflows/release.yaml
    - Test Case: Workflow inspection / REL-T3 negative test
    - Given: Workflow sets `permissions: contents: write`
    - When: QA executes restricted-permission run (REL-T3)
    - Then: Failure log captured in `semantic-release-permissions-failure.log`, confirming permission requirement documentation

#### AC6: Demonstrate a successful dry-run and passing CI run on PR branch with artifacts recorded in the story change log.

- **Coverage: PARTIAL**
  - Test File: docs/bmad/focused-epics/release-governance/evidence/semantic-release-dry-run.log
    - Test Case: Dry run log attached (REL-T1)
    - Gap: Actions run ID and release URL to be recorded post-merge

#### AC7: Provide rollback guidance for mis-tagged releases in the runbook so maintainers can recover from workflow failures.

- **Coverage: FULL**
  - Test File: docs/release-automation.md
    - Test Case: Documentation review
    - Given: Runbook includes rollback procedure (gh release delete / git push --delete)
    - When: QA inspects documentation changes
    - Then: Rollback guidance present and actionable

### Critical Gaps

1. **REL-T2 Evidence on `main`**
   - Gap: Workflow run ID and release URL pending until post-merge execution
   - Severity: medium
   - Action: Capture run ID + release URL after merge and link in change log

2. **REL-T6 Skip Behavior Proof**
   - Gap: Need skip log for non-releasing commit once available
   - Severity: medium
   - Action: Attach semantic-release skip output to evidence directory after running REL-T6

### Test Design Recommendations

1. Automate collection of run IDs and release URLs in CI to reduce manual evidence gathering.
2. Add scripted helper to generate skip-behavior log for REL-T6 as part of pre-merge checks.
3. Extend documentation review checklist to include retention settings verification (aligns with REL-T5 observability recommendation).

### Risk Assessment

- High Risk: None identified (all critical acceptance criteria have coverage or planned follow-up).
- Medium Risk: Pending evidence for REL-T2/REL-T6 until mainline run occurs.
- Low Risk: Documentation accuracy already addressed.

### Trace Log

- Trace matrix stored at `docs/qa/assessments/release-governance.story-1-trace-20250925.md`

- Planning reference: `docs/qa/assessments/release-governance.story-1-test-design-20250925.md`
