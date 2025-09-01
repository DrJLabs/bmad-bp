# BMAD Method — Obsidian Vault Edition

This repository contains an Obsidian‑ready variant of BMAD Method that produces code as Markdown files with a single fenced code block per file. This keeps everything readable and editable inside Obsidian and Copilot+, while preserving the BMAD workflows and agents you’re used to.

## What This Edition Does

- Enforces fenced‑Markdown code outputs instead of real source files.
  - Intended path `src/app.ts` becomes `src/app.ts.md` containing exactly one fenced block.
  - Updates can be partial or full within the fenced block (no enforced full‑block rewrite).
- Converts agent invocation examples to `--agent` form for Obsidian chat UIs.
  - Use `--dev`, `--qa`, `--pm`, `--po`, `--sm`, `--architect`, `--analyst`, `--ux-expert`, `--bmad-master`, `--bmad-orchestrator`.
  - Legacy `@dev`, `@qa` etc. may still be accepted by your prompt, but `--agent` is the canonical form here.
- Leaves all BMAD star‑commands intact (e.g., `*help`, `*develop-story`, `*review`, `*gate`, `*trace`).

## Prerequisites

- Node.js ≥ 20.10.0
- Git
- An existing Obsidian vault directory (or a folder you want to use as one). You can install BMAD first and then open the folder in Obsidian.

## Quick Start

Get up and running in your current directory with a single command.

```bash
# Anywhere: installs into the current directory as a writable Obsidian vault
npx bmad-method obsidian-vault
```

Common variations:

```bash
# Choose a vault folder explicitly
npx bmad-method obsidian-vault -d /absolute/path/to/your/vault

# Place generated code Markdown under a dedicated root (e.g., "code/")
npx bmad-method obsidian-vault -d /absolute/path/to/your/vault --obsidian-output-root code

# Update an existing vault to latest (reapply config/policies)
npx bmad-method install -f --obsidian-vault-writable -d /absolute/path/to/your/vault
```

Then:

1. Open the folder in Obsidian.
2. Paste the “Recommended Copilot System Prompt” below into your Copilot settings for this vault.
3. In chat, try: `--dev *help` or `--qa *review {story}`.
4. When producing code, write to `path/to/File.ext.md` with exactly one fenced block. Partial or full updates are OK.

Verify install (optional):

```bash
# Check core-config flags
rg -n "^(markdownExploder|codeOutputMode|obsidian|codeMdOutputRoot):" .bmad-core/core-config.yaml

# Confirm agent policy is present
rg -n "^## Obsidian Vault Output Policy" .bmad-core/agents/dev.md
```

## Install: Obsidian Vault Modes

BMAD’s Obsidian edition supports two vault modes and one export‑only mode. Pick the one that fits your workflow.

### 1) Writable Obsidian Vault (recommended)

Agents freely create/modify code as Markdown (`.md`) files with a single fenced block. Real source writes are avoided by policy, not by hard blocking.

Quick install into the current directory (run from your vault root):

```bash
# Repo local:
node tools/installer/bin/bmad.js obsidian-vault

# npx (published):
npx bmad-method obsidian-vault
```

Install to a specific directory and/or choose a root for code Markdown files:

```bash
node tools/installer/bin/bmad.js obsidian-vault \
  -d /absolute/path/to/your/vault \
  --obsidian-output-root code
```

Equivalent using the install command and explicit flag:

```bash
node tools/installer/bin/bmad.js install -f \
  -d /absolute/path/to/your/vault \
  --obsidian-vault-writable \
  --obsidian-output-root code

# npx (published):
npx bmad-method install -f --obsidian-vault-writable -d . --obsidian-output-root code
```

What this sets in `.bmad-core/core-config.yaml`:

- `markdownExploder: false`
- `codeOutputMode: markdown-fenced`
- `obsidian: true`
- `codeMdOutputRoot: <if provided>`

Not set in this mode: `fsWriteDisabled` (so tools/agents can write `.md` files).

### 2) Strict Obsidian Vault (no real writes)

Use when you want tooling that honors BMAD core config to refuse writing real source files. Agents still produce code in Markdown.

```bash
node tools/installer/bin/bmad.js install -f \
  -d /absolute/path/to/your/vault \
  --obsidian-vault \
  --obsidian-output-root code
```

Adds one more flag in `.bmad-core/core-config.yaml`:

- `fsWriteDisabled: true`

### 3) Export‑Only for Obsidian browsing

Copies core/docs into a separate folder as Markdown‑fenced files for reading/reference (does not configure a vault):

```bash
node tools/installer/bin/bmad.js install -f \
  -d /any/parent/dir \
  --obsidian \
  --obsidian-target ./bmad-obsidian
```

What the installer does in vault modes:

- Writes `.bmad-core/` to your vault.
- Sets `.bmad-core/core-config.yaml` according to the chosen mode:
  - Writable: `markdownExploder: false`, `codeOutputMode: markdown-fenced`, `obsidian: true`, optional `codeMdOutputRoot`
  - Strict: same as writable plus `fsWriteDisabled: true`
- Patches ALL agents with an “Obsidian Vault Output Policy” reminding them to write `.md` code outputs with a single fenced block.
- Normalizes BMAD docs/workflows in the vault to use `--agent` invocations.

## How To Use Inside Obsidian

- Invoke agents using `--agent` and BMAD star‑commands:
  - Examples:
    - `--dev *help`
    - `--qa *review {story}`
    - `--sm *create`
- When you (or the agent) intend to create/modify a file, always output a Markdown file:
  - `path/to/File.ext.md` with exactly one fenced block (e.g., `ts …`).
  - You may update the fenced block partially or fully; keep exactly one fence per file.
  - If `codeMdOutputRoot` is set, write under that root with the same relative path structure.
- Story “File List” should reference the `.md` artifacts (e.g., `src/app.ts.md`).
- QA/gate files continue to be YAML/Markdown as BMAD prescribes.

## Recommended Copilot System Prompt (Concise)

Paste the following into Copilot’s System Prompt for this vault. It keeps behavior minimal and lets BMAD files drive the rest:

```
Use the BMAD Method installed in this vault (.bmad-core). Load .bmad-core/core-config.yaml and the agent files in .bmad-core/agents and follow their workflows and tasks as defined. Treat commands prefixed with -- (e.g., --dev, --qa, --pm, --po, --sm, --architect, --analyst, --ux-expert, --bmad-master, --bmad-orchestrator) as agent invocations (accept @… as synonyms). For any intended code file path like path/to/File.ext, write to path/to/File.ext.md with exactly one fenced code block using the correct language. If core-config.yaml defines codeMdOutputRoot, place generated .md files under that root; otherwise write alongside the intended path. Read any files in the vault as needed and use network access when helpful. Use BMAD star-commands (e.g., *help, *develop-story, *review, *gate, *trace) exactly as defined by the agents.
```

That’s it—no extra chat restrictions or confirmations. The BMAD files provide the full operating guidance.

## Examples

- Create a new file:
  - Intended: `src/server.ts`
  - Output: `src/server.ts.md`
  - Content:
    ```ts
    // server.ts
    import http from 'node:http';
    // …
    ```
- Update a file:
  - Update the fenced block in `src/server.ts.md` (partial or full updates are OK). Keep exactly one fence.

## Upgrading BMAD in a Vault

Run the installer again with `-f` to refresh:

```bash
node tools/installer/bin/bmad.js install -f \
  -d /absolute/path/to/your/vault \
  --obsidian-vault-writable
```

This will re‑apply agent policies and keep the config flags in sync.

## Troubleshooting

- Agent isn’t writing `.md` code files
  - Check `.bmad-core/core-config.yaml` has the flags listed above.
  - Open `.bmad-core/agents/<agent>.md` and verify it contains “## Obsidian Vault Output Policy”.
  - Ensure your system prompt (above) is present in Copilot settings.
- Tools refuse to write files (strict mode)
  - If you need to write `.md` files freely, use the writable mode (`obsidian-vault` or `--obsidian-vault-writable`) so `fsWriteDisabled` is not set.
- Vault files get staged in Git
  - Ensure `.gitignore` excludes `.obsidian/`, `.copilot/`, `copilot-*/`, `copilot-conversations/`, `copilot-custom-prompts/`.
- Lint/format hooks try to process vault files
  - We ship `.eslintignore` and lint-staged ignores to exclude Obsidian/Copilot folders. If you keep a different setup, mirror those ignore patterns.

## CLI Reference (Obsidian)

- `obsidian-vault` (alias): Install to current directory by default, writable Markdown mode.
  - Options: `-d, --directory <path>`, `--obsidian-output-root <path>`
- `install --obsidian-vault-writable`: Same as alias, explicit via `install`.
- `install --obsidian-vault`: Strict mode; includes `fsWriteDisabled: true`.
- `install --obsidian --obsidian-target <path>`: Export core/docs as Markdown for browsing.

## Notes

- This edition aims to be dependency‑light for vault use; the agents’ policies are embedded, and outputs are plain Markdown files.
- You can still read any files in the vault and use network features per your Copilot+ plugin’s settings.
