# Story 1.2: Implement Reviewer Persona Pipeline

## Status

- Draft

## Story

**As the** BMAD reviewer agent orchestrator,
**I want** an LLM persona that merges scan data with diff context,
**so that** teams receive prioritized findings without waiting for PR bots.

## Acceptance Criteria

1. Create `.bmad-core/agents/reviewer.md` with persona guidance, scoring rubric, severity thresholds, and explicit handling for Semgrep, Jscpd, churn, and metrics evidence.
2. Build `tools/reviewer/run.js` that merges scan JSON, churn data, metrics, and git diff into a single prompt payload while sanitizing secrets/paths before serialization, respecting `BMAD_REVIEWER_MODEL` overrides.
3. Emit artifacts per run: Markdown summary (`report.md`), SARIF findings (`report.sarif`), and machine-readable `report.json` capturing severity, confidence, scores, recommended owners, remediation ETA, and evidence references.
4. Include reproducibility metadata block (tool versions, commit SHA, diff stats, prompt hash) within each artifact header.
5. Wire agent config into `bmad-core/core-config.yaml` so orchestrator can invoke the reviewer role; ensure downstream agents discover persona metadata.
6. Provide CLI alias (`bmad reviewer run`) executing the pipeline end-to-end, returning non-zero exit on high-risk findings when `--strict` flag used and surfacing remediation steps.
7. Support skip flags (`BMAD_REVIEWER_SKIP=1`) and dry-run mode (`--dry-run`) for previews; dry-run outputs Markdown preview without persisting artifacts.
8. Store artifacts under `artifacts/reviewer/<timestamp>/` using hashed diff identifier to avoid collisions and link from QA gates.
9. Ensure sanitized prompt excludes secrets/paths, logging redaction metrics; block execution when sanitization fails.
10. Validate `report.json` and SARIF outputs against shared schemas in CI; expose telemetry event (`reviewer.run`) with counts, severity distribution, exit code, and runtime.

## Tasks / Subtasks

- [ ] Author `.bmad-core/agents/reviewer.md` capturing persona mode guidance, evidence weighting rubric, severity thresholds, confidence scoring, and escalation instructions. (AC 1)
- [ ] Implement `tools/reviewer/run.js` orchestrating data ingestion, sanitization, prompt assembly, and artifact emission with reproducibility metadata. (AC 2,3,4,9)
- [ ] Build `report.json` schema and integrate AJV-based validation within the pipeline and CI hooks. **Owner:** Dev — **Due:** 2025-09-28 (AC 3,10)
- [ ] Register reviewer role in `bmad-core/core-config.yaml` and ensure orchestrator loads persona metadata. (AC 5)
- [ ] Add CLI alias `bmad reviewer run` (via package.json or CLI wrapper) supporting `--strict`, `--dry-run`, and telemetry output to stdout/metrics. (AC 6,7,10)
- [ ] Implement sanitization module with regex allowlist (API keys, tokens, paths) returning redaction report; abort pipeline on sanitization failure. **Owner:** QA — **Due:** 2025-09-29 (AC 2,9)
- [ ] Persist artifacts to `artifacts/reviewer/<timestamp>/` with hashed diff identifier and update QA documentation to consume outputs. (AC 3,8)
- [ ] Emit telemetry event (`reviewer.run`) logging runtime, severity summary, strict-mode flag, exit code, and artifact paths; append metrics to rollout tracker pipeline. (AC 10)

## Dev Notes

- **File locations:**
  - Agent persona: `.bmad-core/agents/reviewer.md`
  - Pipeline entry: `tools/reviewer/run.js`
  - Schema definitions: `tools/reviewer/schemas/report.schema.json`, reuse SARIF v2 spec for validation.
- **Sanitization & security:**
  - Use regex patterns for API keys (`[A-Za-z0-9_-]{20,}`), JWTs, AWS creds, file paths outside repo root.
  - Record redaction stats (counts per type) and fail pipeline if secrets remain.
- **Prompt construction:**
  - Compose structured JSON payload with sections: metadata, findings evidence (Semgrep, Jscpd, churn, metrics), diff summary.
  - Limit diff excerpt per finding to ≤50 lines.
  - Enforce token limit <6k by summarizing large diffs (use heuristics).
- **Artifacts & telemetry:**
  - `report.md` summarises findings grouped by category (Security, Stability, Maintainability, Tests) with severity/confidence.
  - `report.json` feeds QA gating and telemetry aggregator; include run ID, git SHA, strict flag, sanitized prompt hash.
  - Telemetry event appended to `docs/bmad/issues/reviewer-rollout.md` metrics table.
- **CLI alias:**
  - Add npm script `npm run reviewer:run -- --strict` for local usage; alias to `node tools/reviewer/run.js`.
- **Fallback:**
  - When sanitization fails, output remediation guidance and exit non-zero even without `--strict`.

### Testing Standards

- Follow `docs/bmad/focused-epics/reviewer-agent/story-2-test-design.md` covering sanitization tests, schema validation, telemetry assertions, dry-run behavior, and strict-mode gating.

## Testing

- Unit tests ensuring prompt sanitization catches secrets/unsafe paths and logs redaction metrics.
- Integration tests feeding sample scan payload verifying Markdown/SARIF/JSON outputs and schema validation.
- Dry-run test verifying no artifacts persisted while Markdown preview surfaces.
- Strict-mode E2E test verifying high-severity findings trigger non-zero exit and actionable remediation guidance.
- Telemetry test confirming `reviewer.run` event published with counts, exit code, runtime.

## Change Log

| Date       | Version | Description                                                                                                  | Author |
| ---------- | ------- | ------------------------------------------------------------------------------------------------------------ | ------ |
| 2025-09-24 | v0.1.0  | Focused-epic story draft for reviewer persona pipeline with sanitization, telemetry, and schema requirements | Codex  |

## Dev Agent Record

### Agent Model Used

- _To be completed by Dev agent._

### Debug Log References

- _To be completed by Dev agent._

### Completion Notes List

- _To be completed by Dev agent._

### File List

- _To be completed by Dev agent._

## QA Results

- _To be completed by QA agent after implementation._

## 🔬 Research & Validation Log (2025-09-24)

- **Researcher:** Dr. Evelyn Reed
- **Active Mode:** small-team
- **Primary Artifact:** docs/bmad/focused-epics/reviewer-agent/story-2.md
- **Summary:** Updated reviewer pipeline story to enforce evidence sanitization, structured scoring outputs, and telemetry hooks aligned with current OSS scanning guidance for collaborative teams.

### Findings & Actions

| Priority | Area          | Recommended Change                                                               | Owner / Reviewer | Confidence | Mode       | Controls              | Evidence Location                    | Sources                                                                                                                 |
| -------- | ------------- | -------------------------------------------------------------------------------- | ---------------- | ---------- | ---------- | --------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Critical | Security      | Require prompt sanitization + secret masking before invoking reviewer model.     | Dev / QA         | High       | small-team | ASVS V14.2            | tools/reviewer/run.js                | [OWASP LLM Guidance](https://owasp.org/www-project-top-10-for-large-language-model-applications/)                       |
| High     | Observability | Add telemetry + `report.json` schema for severity weighting and rollout metrics. | Dev / PM         | High       | small-team | ISO 25010 Reliability | docs/bmad/issues/reviewer-rollout.md | [GitHub Code Scanning SARIF Spec](https://docs.github.com/code-security/code-scanning/automatically-scanning-your-code) |
| Medium   | Operability   | Support dry-run mode + artifact hashing to aid PR previews and concurrent runs.  | DevOps / QA      | Medium     | small-team | NIST SSDF PW.4        | artifacts/reviewer/<ts>/report.json  | [Semgrep Supply-Chain Hardening](https://semgrep.dev/blog/semgrep-supply-chain/)                                        |

### Tooling Guidance

- **FOSS-first Recommendation:** Use local `ollama`/`llama.cpp` friendly models (`gpt4all`, `mistral`) for offline reviewer persona; document temperature and token ceilings.
- **Paid Option (if required):** OpenAI `gpt-4o` fallback with strict rate limiting and secret redaction; require security review before enabling.
- **Automation / Scripts:** Provide `npm run reviewer:validate` to lint artifacts, run SARIF schema validation, and check sanitization report.

### Risk & Compliance Notes

- **Residual Risks:** False positives while strict mode calibrates (Medium); mitigate via reviewer confidence thresholds.
- **Compliance / Control Mapping:** Aligns with OWASP ASVS, NIST SSDF, and internal secure AI usage guidelines.
- **Monitoring / Observability:** Forward telemetry events to rollout tracker plus optional OpenTelemetry collector.
- **Rollback / Contingency:** Disable reviewer agent mapping in config and fallback to Semgrep/Jscpd raw outputs if persona misbehaves.

### Follow-Up Tasks

- [ ] Draft JSON schema for `report.json` + integrate ajv validation — Owner: Dev, Due: 2025-09-28
- [ ] Document sanitization patterns and secret regex set — Owner: QA, Due: 2025-09-29

### Source Appendix

1. OWASP Top 10 for LLM Apps — OWASP (Accessed 2025-09-24)
2. GitHub Code Scanning SARIF Spec — GitHub (Accessed 2025-09-24)
3. Semgrep Supply-Chain Hardening — r2c (Accessed 2025-09-24)

## 📝 Product Owner Validation (2025-09-24)

### Template Compliance Issues

- Story now follows BMAD template with sections for status, tasks, Dev Notes, testing, change log, and agent placeholders.

### Critical Issues (Must Fix – Story Blocked)

- Pending completion of follow-up tasks (schema validation, sanitization doc) before marking Ready for Dev.

### Should-Fix Issues

- Schema validation and sanitization documentation are captured in the task list with owners/dates—verify completion before promotion to Ready for Dev.
- Add example sanitized prompt excerpt and telemetry payload once development completes.

### Nice-to-Have Improvements

- Provide sample Markdown/SARIF snippets for documentation after initial implementation.

### Anti-Hallucination Findings

- All requirements derived from research/test design artifacts; no unsupported assumptions detected.

### Final Assessment

- **Decision:** READY FOR DEV (after assigned tasks complete by due dates)
- **Implementation Readiness Score:** 8/10
- **Confidence Level:** High — story now actionable with clear implementation roadmap
