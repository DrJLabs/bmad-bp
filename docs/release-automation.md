# Release Automation

Our `bmad-drj` package now publishes automatically whenever changes land on `main`.

## How it works

- **Workflow trigger** – `.github/workflows/release.yaml` runs on every push to `main` (and can be invoked manually). The job installs dependencies, executes the validation suite, and calls `semantic-release`.
- **Version & changelog** – `semantic-release` uses Conventional Commit messages to decide whether to cut a release, updates `CHANGELOG.md`, bumps `package.json` / `package-lock.json`, syncs `tools/installer/package.json`, and tags the repo.
- **Publish** – `@semantic-release/npm` publishes `bmad-drj` to npm using your automation token. Tarballs are saved as workflow artifacts.

## Required secrets

| Secret      | Purpose                                                 |
| ----------- | ------------------------------------------------------- |
| `NPM_TOKEN` | npm automation token with publish rights on `bmad-drj`. |

The token can be scoped to the package or org. Keep two-factor authentication enabled for the account that created it; automation tokens satisfy npm's requirement without prompting for OTP.

> **Tip:** npm also supports [trusted publishing via GitHub's OIDC tokens](https://docs.npmjs.com/trusted-publishers/?utm_source=openai). When you are ready, connect this repository as a trusted publisher in npm. After that you can remove `NPM_TOKEN` and rely on OIDC with provenance enabled.

## Commit conventions

`semantic-release` expects Conventional Commit prefixes (`feat:`, `fix:`, `chore:`, etc.) to determine version bumps. Make sure PR titles and merge commits follow the convention.

## Manual overrides

The existing `Manual Release` workflow is still available for ad-hoc releases or emergency patches. Running it will publish immediately, independent of `semantic-release`.
