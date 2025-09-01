# BMAD Method — Obsidian Vault Edition

This repository contains an Obsidian‑ready variant of BMAD Method that produces code as Markdown files with a single fenced code block per file. This keeps everything readable and editable inside Obsidian and Copilot+, while preserving the BMAD workflows and agents you’re used to.

## What This Edition Does

- Enforces fenced‑Markdown code outputs instead of real source files.
  - Intended path `src/app.ts` becomes `src/app.ts.md` containing exactly one fenced block.
  - On updates, the entire fenced block is replaced (full file, not a diff).
- Converts agent invocation examples to `--agent` form for Obsidian chat UIs.
  - Use `--dev`, `--qa`, `--pm`, `--po`, `--sm`, `--architect`, `--analyst`, `--ux-expert`, `--bmad-master`, `--bmad-orchestrator`.
  - Legacy `@dev`, `@qa` etc. may still be accepted by your prompt, but `--agent` is the canonical form here.
- Leaves all BMAD star‑commands intact (e.g., `*help`, `*develop-story`, `*review`, `*gate`, `*trace`).

## Prerequisites

- Node.js ≥ 20.10.0
- Git
- An existing Obsidian vault directory (or a folder you want to use as one). You can install BMAD first and then open the folder in Obsidian.

## Install: Obsidian Vault Mode

Run the installer to your vault directory with the Obsidian vault flag:

```bash
# From repo root (or via npx if packaged):
node tools/installer/bin/bmad.js install -f \
  -d /absolute/path/to/your/vault \
  --obsidian-vault
```

Optional: set a dedicated root for generated code Markdown files (instead of writing alongside intended paths):

```bash
node tools/installer/bin/bmad.js install -f \
  -d /absolute/path/to/your/vault \
  --obsidian-vault \
  --obsidian-output-root code
```

What the installer does in vault mode:

- Writes `.bmad-core/` to your vault.
- Sets `.bmad-core/core-config.yaml`:
  - `markdownExploder: false`
  - `codeOutputMode: markdown-fenced`
  - `fsWriteDisabled: true`
  - `obsidian: true`
  - `codeMdOutputRoot: <optional>` (only if you pass `--obsidian-output-root`)
- Patches ALL agents with an “Obsidian Vault Output Policy” reminding them to write `.md` code outputs with a single fenced block.
- Normalizes BMAD docs/workflows in the vault to use `--agent` invocations.

## How To Use Inside Obsidian

- Invoke agents using `--agent` and BMAD star‑commands:
  - Examples:
    - `--dev *help`
    - `--qa *review {story}`
    - `--sm *create`
- When you (or the agent) intend to create/modify a file, always output a Markdown file:
  - `path/to/File.ext.md` with exactly one fenced block (e.g., `ts … `).
  - Replace the entire fenced block on edits—always output the full file content.
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
  - Re‑emit `src/server.ts.md` with a single fenced block containing the complete updated file.

## Upgrading BMAD in a Vault

Run the installer again with `-f` to refresh:

```bash
node tools/installer/bin/bmad.js install -f -d /absolute/path/to/your/vault --obsidian-vault
```

This will re‑apply agent policies and keep the config flags in sync.

## Troubleshooting

- Agent isn’t writing `.md` code files
  - Check `.bmad-core/core-config.yaml` has the flags listed above.
  - Open `.bmad-core/agents/<agent>.md` and verify it contains “## Obsidian Vault Output Policy”.
  - Ensure your system prompt (above) is present in Copilot settings.
- Vault files get staged in Git
  - Ensure `.gitignore` excludes `.obsidian/`, `.copilot/`, `copilot-*/`, `copilot-conversations/`, `copilot-custom-prompts/`.
- Lint/format hooks try to process vault files
  - We ship `.eslintignore` and lint-staged ignores to exclude Obsidian/Copilot folders. If you keep a different setup, mirror those ignore patterns.

## Notes

- This edition aims to be dependency‑light for vault use; the agents’ policies are embedded, and outputs are plain Markdown files.
- You can still read any files in the vault and use network features per your Copilot+ plugin’s settings.
