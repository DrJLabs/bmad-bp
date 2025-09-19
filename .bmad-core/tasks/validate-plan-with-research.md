# Validate Plan with Research Task (Autonomous)

## Purpose

To automatically review a project artifact, conduct targeted research on its core concepts, apply updates to align the plan with modern best practices, and then report a summary of all changes made to the primary artifact and its companions.

## Inputs

- `artifact_path`: The file path to the primary project artifact to be validated (e.g., `docs/stories/1.1.setup-initial-project.md`).

## Process (Must be followed sequentially)

### 1. Acknowledge and Load Artifact

- Announce the task start and the specific artifact being reviewed.
- Load the content of the file specified in `artifact_path`.

### 2. Contextual Analysis of Artifact

- Determine the type of artifact being reviewed (e.g., Story, Test Design).
- Tailor the research focus based on the artifact type:
  - **For a Story:** Focus on implementation details, technologies, security, and performance patterns.
  - **For a Test Design:** Focus on testing methodologies, frameworks, and coverage strategies.

### 3. Identify Key Concepts for Research

- Parse the artifact to identify key technical concepts, patterns, or strategies that require validation.

### 4. Generate & Execute Research

- For each concept, use the `create-deep-research-prompt.md` task to formulate a precise research question.
- Execute the research and synthesize the findings into a concise summary of current best practices, including alternatives and common pitfalls.

### 5. Formulate Changes and Update Artifacts

- Compare the research findings with the plan outlined in the primary artifact.
- Formulate a specific list of changes (modifications, additions, removals) needed to align the plan with best practices.
- **Automatically apply these changes directly to the primary artifact file.**
- **Identify and load any accompanying documents** (e.g., risk profiles, test designs with a matching story ID) and apply any relevant cascading changes.
- For each modified artifact, add or append to a changelog section (e.g., `## 🔬 Research & Validation Log`) detailing the exact changes made, the rationale, and the date.

### 6. Generate Final Summary Report

- After all files have been modified and saved, output a final, standalone summary report in the following format:

---

**Research & Validation Summary**

- **Primary Artifact Validated:** `{{artifact_path}}`
- **Status:** Complete. Artifacts have been updated automatically.

**Modified Files:**

- `{{list_of_all_modified_files}}`

**Summary of Changes:**

- **Modernization:** Updated the authentication strategy in the story to use passwordless WebAuthn, which is the current industry standard for security and user experience.
- **Security Enhancement:** Added a task to the story to implement Content Security Policy (CSP) headers, based on research showing their effectiveness against XSS attacks.
- **Test Plan Improvement:** Modified the `test-design.md` to include visual regression testing, as research indicated this is a best practice for component libraries of this type.

_For a detailed breakdown of every change, please see the "Research & Validation Log" section in the primary artifact._

---
