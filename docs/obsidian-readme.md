# BMAD for Obsidian Vaults

This installation of BMAD is configured for Obsidian vault usage. It keeps all code output in Markdown files with fenced code blocks so that Copilot+ and other plugins can read and edit them directly.

Key behavior:

- Code output: For any intended file `path/to/File.ext`, write to `path/to/File.ext.md` containing exactly one fenced block with the correct language.
- Updates: Replace the entire fenced block with the updated full file content.
- Location: If `.bmad-core/core-config.yaml` sets `codeMdOutputRoot`, place `.md` files under that root. Otherwise, write alongside the intended path.
- Agents: Invoke agents with `--dev`, `--qa`, `--pm`, `--po`, `--sm`, `--architect`, `--analyst`, `--ux-expert`, `--bmad-master`, `--bmad-orchestrator`.
- Tasks: Use BMAD star-commands as usual (e.g., `*help`, `*develop-story`, `*review`, `*gate`, `*trace`).

Configuration flags in `.bmad-core/core-config.yaml`:

- `markdownExploder: false`
- `codeOutputMode: markdown-fenced`
- `fsWriteDisabled: true`
- `obsidian: true`
- `codeMdOutputRoot: <optional-root>`

Notes:

- You can read and reference any files in the vault as needed. Network access behavior is controlled by your Copilot+ settings.
- Story “File List” sections should point to the `.md` file paths representing code outputs.

Quick start:

1. Open a chat and invoke an agent, e.g., `--dev *help` or `--qa *review {story}`.
2. When producing code, output `.md` files with a single correctly annotated fenced block.
3. Continue normal BMAD workflows; QA gates and reviews operate over the `.md` artifacts.
