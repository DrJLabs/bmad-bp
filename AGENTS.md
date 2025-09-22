# BMAD Agents (DrJLabs Edition)

<!-- BEGIN: BMAD-AGENTS -->

## Core Agent Roster

| Agent             | Purpose                                                                    | Dist File                                                              |
| ----------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Analyst           | Facilitates discovery, gathers requirements, and builds the initial brief. | [dist/agents/analyst.txt](dist/agents/analyst.txt)                     |
| Architect         | Produces architecture docs and validates technical direction.              | [dist/agents/architect.txt](dist/agents/architect.txt)                 |
| Product Owner     | Maintains backlog context and business priorities.                         | [dist/agents/po.txt](dist/agents/po.txt)                               |
| Scrum Master      | Runs sprint rituals, coordinates hand-offs, and keeps agents aligned.      | [dist/agents/sm.txt](dist/agents/sm.txt)                               |
| Dev               | Implements the current story based on the orchestrated plan.               | [dist/agents/dev.txt](dist/agents/dev.txt)                             |
| QA                | Designs and executes validation plans before sign-off.                     | [dist/agents/qa.txt](dist/agents/qa.txt)                               |
| BMAD Orchestrator | Top-level conductor that routes tasks to the right specialists.            | [dist/agents/bmad-orchestrator.txt](dist/agents/bmad-orchestrator.txt) |

### Using These Agents

- **IDE / Codex:** Run `npm exec --package bmad-drj -- bmad-method install` to sync `.bmad-core/` and this `AGENTS.md`. Codex will load this file automatically.
- **Web flows:** Upload the matching `dist/teams/team-fullstack.txt` bundle to your conversational interface for the same roster.

<!-- END: BMAD-AGENTS -->

## DrJLabs-Specific Notes

- Releases are automated via `.github/workflows/release.yaml` and use `semantic-release`. Conventional commits (`feat:`, `fix:`, etc.) keep versioning predictable.
- Set up the commit template once: `git config commit.template .github/commit-template.txt`.
- Publish artifacts come from the `bmad-drj` package; use `npm view bmad-drj version` to confirm deployments.
- Keep `.env`, `.env.*`, and AI scratch directories out of commits and packages—`.gitignore`/`.npmignore` already handle this, but double-check when adding new assets.
