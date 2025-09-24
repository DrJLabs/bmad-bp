# Validate Plan with Research Task (Autonomous)

## Purpose

Automatically review a project artifact, conduct targeted research on its core concepts, apply updates to align the plan with modern best practices, and then report a summary of all changes made to the primary artifact and its companions. The scope and deliverables must respect the researcher's active mode (`solo`, `small-team`, or `enterprise`).

## Inputs

- `artifact_path`: File path to the primary project artifact to be validated (e.g., `docs/stories/1.1.setup-initial-project.md`).
- `active_mode`: Optional override (`solo`|`small-team`|`enterprise`). Default is `solo` when omitted.

## Mode Controls

Before modification, note the current mode and adjust depth accordingly:

- **Solo mode (default):**
  - Prioritize high-impact, low-effort fixes and quick automation wins.
  - Keep documentation lean: update the research log and list the top three follow-up actions.
  - Favor free/open-source tooling; only suggest paid services with rationale and migration notes.
- **Small-team mode:**
  - Capture decisions that teammates need for code review, CI/CD, and ops handoffs.
  - Produce a change summary with owners/reviewers and flag dependencies requiring alignment.
  - Recommend FOSS-first solutions that integrate cleanly with lightweight SaaS if unavoidable.
- **Enterprise mode:**
  - Perform exhaustive validation covering security, compliance, reliability, and governance.
  - Create an audit-ready dossier: include risk register entries, control mappings, and rollback plans.
  - Document data handling, monitoring, and separation-of-duties requirements; note cost/risk trade-offs when paid tooling is involved.

## Prerequisites

- Load the `researcher-checklist.md` and review items relevant to the active mode.
- Ensure the `research-validation-log.md` template is available for updating artifacts.

## Process (Must be followed sequentially)

### 1. Acknowledge and Load Artifact

- Announce task start, active mode, and the artifact being reviewed.
- Load the content of the file specified in `artifact_path`.

### 2. Contextual Analysis of Artifact

- Determine the type of artifact being reviewed (e.g., Story, Test Design, Architecture Doc).
- Tailor emphasis based on artifact type:
  - **Story:** Focus on implementation details, security, performance, and release readiness.
  - **Test Design:** Emphasize testing methodologies, frameworks, resilience, and observability coverage.
  - **Architecture/Plan:** Assess alignment with reference architectures, scalability, and compliance.

### 3. Identify Key Concepts for Research

- Parse the artifact to identify core technical concepts, patterns, dependencies, or strategies that require validation.
- Bucket concepts by risk level (critical, moderate, informational) and note required source depth per mode.

### 4. Generate & Execute Research

- For each concept, use the `create-deep-research-prompt.md` task tailored to the active mode to formulate precise research questions.
- Execute research and synthesize findings into concise best-practice summaries, including alternatives and common pitfalls.
- Cross-check medium/high-risk findings with at least two credible sources; record citations with access dates.
- Prefer open documentation, standards bodies, and widely adopted FOSS tooling when recommending solutions.

### 5. Formulate Changes and Update Artifacts

- Compare research findings with the plan outlined in the primary artifact.
- Formulate a specific list of changes needed to align the plan with best practices and mode requirements.
- Create a new working branch (for example, `chore/validate-{{artifact_id}}-{{date}}`), apply updates there, and raise a PR for review instead of committing directly to the default branch.
- Sanitize and allowlist `artifact_path` inputs to repository-internal documents only (reject absolute paths and `..` segments).
- **Identify any companion documents** (e.g., risk profiles, test designs with matching story ID) and propose cascading changes within the same PR.
- For each modified artifact:
  - Append or update the `## 🔬 Research & Validation Log` section using the `research-validation-log.md` template.
  - Note the active mode, decision rationale, confidence level, and residual risks.
  - Document tooling recommendations with FOSS-first alternatives.

## Security & Safety Guardrails

- Treat `artifact_path` as untrusted input: normalize, resolve, and validate against an allowlist such as `docs/**` and `bmad-core/**` (no absolute paths, URLs, or `..` segments).
- Provide a dry-run mode that emits a patch/diff without writing files when the user requests it.
- Keep edits bounded and idempotent—flag when proposed changes exceed expected size/line thresholds.
- Record all changes in the research validation log while ensuring secrets and PII are never persisted.

### 6. Generate Final Summary Report

- After all files have been modified and saved, output a final, standalone summary report in the following format:

---

**Research & Validation Summary**

- **Primary Artifact Validated:** `{{artifact_path}}`
- **Active Mode:** `{{active_mode}}`
- **Status:** Complete. Artifacts have been updated automatically.

**Modified Files:**

- `{{list_of_all_modified_files}}`

**Summary of Changes:**

- **Modernization:** {{mode-aware modernization summary with citations}}
- **Security & Compliance:** {{security/compliance findings; include control mappings for enterprise mode}}
- **Testing & Quality:** {{test coverage changes, tooling updates}}
- **Operational Follow-ups:** {{owners, next steps, deadlines}}

_For a detailed breakdown of every change, see the "Research & Validation Log" section in each modified artifact. Refer to the researcher checklist to confirm that all items for `{{active_mode}}` are satisfied._

---

## Completion Criteria

- All relevant artifacts updated with mode-appropriate research logs and citations.
- Summary report delivered with clear next steps and ownership.
- Researcher checklist items for the active mode verified and noted in the log.
