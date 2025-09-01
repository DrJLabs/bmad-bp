```yaml
# <!-- Powered by BMAD™ Core -->
# BMAD Team Fullstack — Obsidian Vault Variant

bundle:
  name: Team Fullstack (Obsidian Vault)
  icon: '🚀'
  description: Team capable of full stack, front end only, or service development. Obsidian vault variant enforces Markdown-only code outputs.

  # Obsidian-specific output settings (read by agents/tools; safe for downstream)
  obsidian: true
  codeOutputMode: markdown-fenced
  codeOutputPolicy:
    mdOnly: true # write to path/to/File.ext.md
    singleFence: true # exactly one fenced code block per file
    partialUpdatesAllowed: true # allow partial or full updates within the fence
    avoidRawSourceFiles: true # never write real code files
    honorCodeMdOutputRoot: true # if defined in .bmad-core/core-config.yaml

agents:
  - bmad-orchestrator
  - analyst
  - pm
  - ux-expert
  - architect
  - po

workflows:
  - brownfield-fullstack.yaml
  - brownfield-service.yaml
  - brownfield-ui.yaml
  - greenfield-fullstack.yaml
  - greenfield-service.yaml
  - greenfield-ui.yaml
```
