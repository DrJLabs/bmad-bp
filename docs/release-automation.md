# Release Automation

The release pipeline now mirrors BMAD’s GitHub-only semantic-release pattern. There is no npm publish step—everything relies on the repository `GITHUB_TOKEN`.

## How it works

- **Workflow trigger** – `.github/workflows/release.yaml` runs on every push to `main` and supports manual dispatch. The job installs dependencies, runs `npm run validate`, `npm run format:check`, and `npm run lint`, then executes `semantic-release`.
- **Version & changelog** – `semantic-release` inspects Conventional Commit history, bumps `package.json`, `package-lock.json`, and `tools/installer/package.json`, and appends to `CHANGELOG.md` with the GitHub-only plugin stack (`@semantic-release/release-notes-generator`, `@semantic-release/changelog`, `@semantic-release/github`).
- **Release assets** – `@semantic-release/npm` prepares tarballs locally with `npmPublish` disabled. The GitHub plugin attaches those tarballs to the GitHub Release alongside the generated notes.
- **Permissions** – The workflow sets `permissions: contents: write` and exports only `GITHUB_TOKEN` to `semantic-release`. Dropping permissions to `contents: read` should trigger the expected failure for the REL-T3 negative-path test.

## Evidence capture checklist (Story 1 AC6)

1. Run `npx semantic-release --dry-run --ci false` on the feature branch and attach the log to the story change log before merging.
2. After merging, record the successful Actions run ID and GitHub Release URL in the story change log.
3. Execute the restricted-permission validation (set job permissions to `contents: read`) and store the resulting failure log next to the dry-run output.
4. Keep all artifacts under `docs/bmad/focused-epics/release-governance/` so future audits have a stable location.

## Required secrets

No npm credentials are needed. The default repository `GITHUB_TOKEN` is sufficient for tagging, changelog commits, and publishing GitHub Releases.

> **Verification tip:** Inspect the "Run semantic-release (GitHub plugins only)" step in the Actions log—the only credential passed through the environment is `GITHUB_TOKEN`.

## Commit conventions

`semantic-release` still expects Conventional Commit prefixes (`feat:`, `fix:`, `chore:`, etc.) to determine version bumps. Configure the provided commit template if you want Git to pre-fill commit messages:

```bash
git config commit.template .github/commit-template.txt
```

## Manual overrides

The "Manual Release" workflow remains available for ad-hoc releases or emergency patches. It reuses the GitHub-only configuration, so no npm tokens are required.
