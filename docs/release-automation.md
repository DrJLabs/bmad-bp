# Release Automation

The release pipeline now mirrors BMAD’s GitHub-only semantic-release pattern. There is no npm publish step—everything relies on the repository `GITHUB_TOKEN`.

## How it works

- **Workflow trigger** – `.github/workflows/release.yaml` runs on every push to `main` and supports manual dispatch. The job installs dependencies, runs `npm run validate`, `npm run format:check`, and `npm run lint`, then executes `semantic-release`.
- **Version & changelog** – `semantic-release` inspects Conventional Commit history, bumps `package.json`, `package-lock.json`, and `tools/installer/package.json`, and appends to `CHANGELOG.md` with the GitHub-only plugin stack (`@semantic-release/release-notes-generator`, `@semantic-release/changelog`, `@semantic-release/github`). Success/fail/label comments are disabled in `.releaserc.json`, so the workflow never posts issue cross-links back to PRs.
- **Release assets** – `@semantic-release/npm` prepares tarballs locally with `npmPublish` disabled. The GitHub plugin attaches those tarballs to the GitHub Release alongside the generated notes.
- **Permissions** – The workflow sets `permissions: contents: write` and exports only `GITHUB_TOKEN` to `semantic-release`. Dropping permissions to `contents: read` should trigger the expected failure for the REL-T3 negative-path test.

## Evidence capture checklist (Story 1-1.4)

For the contributor-facing overview, see [Versioning and Releases](versioning-and-releases.md#automated-release-workflow); that section links back to this checklist so maintainers can navigate between the matrix and evidence steps.

1. Before merging, run `npx semantic-release --dry-run --no-ci` (or `npm run release:evidence`) on your feature branch to verify the next version, inspect release notes, and stage a fresh dry-run log for review.
2. After merging, capture the production evidence in one step with `npm run release:evidence -- --run-id <run-id>` (omit `--run-id` to grab the latest `release.yaml` run on `main`). The command verifies `gh auth status`, stores a success note, downloads run metadata/logs/artifacts into a timestamped subdirectory of `docs/bmad/focused-epics/release-governance/evidence/`, and records a new dry-run log for auditability.
3. Execute the restricted-permission regression (duplicate the workflow with `permissions: contents: read`) and store the failure log beside the automation output (`semantic-release-permissions-failure.log`).
4. Review the Story 1 change log Evidence++ table and append the new run ID, release URL, tarball status, and evidence directory that the automation command produced.
5. Ensure the Actions retention policy (default 90 days) still covers your stored artifacts; prune or archive evidence older than the policy window so the repository stays lean while preserving audit history.
6. Capture a skip-behavior log (e.g., empty `chore:` commit) and save it as `docs/bmad/focused-epics/release-governance/evidence/semantic-release-skip.log` to document REL-T6.
7. Confirm the evidence directory now contains: gh auth status verification note, release workflow metadata/logs, downloaded artifacts (if any), the latest dry-run log, permissions failure log, skip log, and any supporting screenshots referenced by Story 1 and follow-up stories.

## Required secrets

No npm credentials are needed. The default repository `GITHUB_TOKEN` is sufficient for tagging, changelog commits, and publishing GitHub Releases.

> **Verification tip:** Inspect the "Run semantic-release (GitHub plugins only)" step in the Actions log—the only credential passed through the environment is `GITHUB_TOKEN`.

## Commit conventions

`semantic-release` still expects Conventional Commit prefixes (`feat:`, `fix:`, `chore:`, etc.) to determine version bumps. Configure the provided commit template if you want Git to pre-fill commit messages:

```bash
git config commit.template .github/commit-template.txt
```

### Version mapping quick reference (Story 1.2 AC1)

| Conventional Commit prefix                                | Typical semantic-release bump   | Notes                                                                                     |
| --------------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------- |
| `feat:`                                                   | Minor                           | Generates release notes entry under “Features”.                                           |
| `fix:`                                                    | Patch                           | Captures bug fixes; includes `perf:` commits.                                             |
| `docs:`, `chore:`, `refactor:` (no `!`)                   | Patch (if releasable) / skipped | When no production code changes are detected, semantic-release may skip the publish step. |
| `build:`, `ci:`                                           | Patch                           | Use for pipeline/config changes impacting deployments.                                    |
| Any prefix with `!` or explicit `BREAKING CHANGE:` footer | Major                           | Requires change log entry describing the breaking impact.                                 |

**Pre-merge validation checklist**

- [ ] Run `npx semantic-release --dry-run --no-ci` and ensure the reported next version matches expectations from the table above.
- [ ] Confirm the change log preview lists the intended commits and contains no unexpected breaking changes.
- [ ] Update Story 1 change log with the dry-run evidence path before merging.
- [ ] If the dry-run reports “This release was skipped”, confirm the commit type should indeed be skipped (e.g., doc-only change) and note that outcome in the change log.

### Release artifact policy (Story 1.2 AC2)

- Tarball attachments created by `@semantic-release/npm` remain enabled. After each release run, verify the GitHub Release shows the tarball assets and note the download URLs in the change log.
- Initial manual release (`run 17598712992`) captured baseline evidence; subsequent Release run on `main` should be used for ongoing verification.
- 2025-09-25 Release workflow run `18019240174` (workflow_dispatch on `main`) completed in 44s end-to-end; treat ≤60 s runtime as the expected health target. The run skipped publishing (no commits) but validated the GitHub release `v1.0.0` continues to expose asset `bmad-drj-1.0.0.tgz`.
- If attachments are intentionally disabled in future, document the rollback decision and consumer expectations here before merging the change.
- Store any downloaded artifacts or screenshots that prove attachment status in `docs/bmad/focused-epics/release-governance/evidence/`.

## Manual overrides

The "Manual Release" workflow remains available for ad-hoc releases or emergency patches. It reuses the GitHub-only configuration, so no npm tokens are required.
