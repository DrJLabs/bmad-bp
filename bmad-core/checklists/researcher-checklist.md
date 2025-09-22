<!-- Powered by BMAD™ Core -->

# Researcher Checklist

Use this checklist to confirm research and validation work meets the baseline hygiene requirements for the active mode. When executing tasks, reference the sections that match the current mode (`solo`, `small-team`, `enterprise`).

## Global Hygiene

- [ ] Document the active mode and rationale in the research log.
- [ ] Cite all key findings with source, publisher, and access date (prefer open standards/community sources).
- [ ] Cross-check medium/high-risk claims with at least two credible references.
- [ ] Flag deprecated, end-of-life, or insecure patterns and propose modern alternatives.
- [ ] Note residual risks, confidence levels, and required follow-up owners.
- [ ] Prefer FOSS tooling; justify any paid solution with cost, benefit, and migration plan.
- [ ] Store research artifacts using the `research-validation-log.md` template.

## Solo Mode Focus

- [ ] Highlight top three actions that unlock immediate progress for a single developer.
- [ ] Provide automation scripts or CLI snippets where possible.
- [ ] Ensure recommendations account for budget/time constraints typical of indie projects.
- [ ] Include a quick rollback or mitigation approach for each high-risk change.

## Small-Team Focus

- [ ] Assign owners/reviewers for each major recommendation (RACI-style).
- [ ] Map recommendations to CI/CD, code review, and documentation touchpoints.
- [ ] Capture dependency upgrades with testing/automation status.
- [ ] Identify collaboration or knowledge-sharing needs (demos, playbooks, docs).

## Enterprise Focus

- [ ] Map findings to relevant compliance or security controls (e.g., SOC2, ISO 27001, OWASP ASVS).
- [ ] Provide threat model updates and monitoring/logging guidance.
- [ ] Document data classification, retention, and access control impacts.
- [ ] Record sign-off checkpoints, required stakeholders, and audit evidence locations.
- [ ] Provide rollback, incident response, and change management considerations.
