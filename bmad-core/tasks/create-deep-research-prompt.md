<!-- Powered by BMAD™ Core -->

# Create Deep Research Prompt Task

This task helps create comprehensive research prompts for various types of deep analysis. It can process inputs from brainstorming sessions, project briefs, market research, or specific research questions to generate targeted prompts for deeper investigation.

## Purpose

Generate well-structured research prompts that:

- Define clear research objectives and scope
- Specify appropriate research methodologies
- Outline expected deliverables and formats
- Guide systematic investigation of complex topics
- Ensure actionable insights are captured

## Mode Awareness

Always tailor the prompt to the researcher’s active mode:

- **Solo (default):** Emphasize low-overhead research with fast, high-impact wins. Highlight FOSS-first tools, automation scripts, and deprioritize bureaucracy.
- **Small-team:** Balance depth with knowledge sharing. Capture owner/reviewer assignments, CI/CD touchpoints, and lightweight governance artifacts.
- **Enterprise:** Require exhaustive coverage, compliance control mapping, and audit-ready documentation. Call out data classification, sign-off checkpoints, and vendor due diligence.

## Research Type Selection

CRITICAL: First, help the user select the most appropriate research focus based on their needs and any input documents they've provided.

### 1. Research Focus Options

Present these numbered options to the user:

1. **Product Validation Research**
   - Validate product hypotheses and market fit
   - Test assumptions about user needs and solutions
   - Assess technical and business feasibility
   - Identify risks and mitigation strategies

2. **Market Opportunity Research**
   - Analyze market size and growth potential
   - Identify market segments and dynamics
   - Assess market entry strategies
   - Evaluate timing and market readiness

3. **User & Customer Research**
   - Deep dive into user personas and behaviors
   - Understand jobs-to-be-done and pain points
   - Map customer journeys and touchpoints
   - Analyze willingness to pay and value perception

4. **Competitive Intelligence Research**
   - Detailed competitor analysis and positioning
   - Feature and capability comparisons
   - Business model and strategy analysis
   - Identify competitive advantages and gaps

5. **Technology & Innovation Research**
   - Assess technology trends and possibilities
   - Evaluate technical approaches and architectures
   - Identify emerging technologies and disruptions
   - Analyze build vs. buy vs. partner options

6. **Industry & Ecosystem Research**
   - Map industry value chains and dynamics
   - Identify key players and relationships
   - Analyze regulatory and compliance factors
   - Understand partnership opportunities

7. **Strategic Options Research**
   - Evaluate different strategic directions
   - Assess business model alternatives
   - Analyze go-to-market strategies
   - Consider expansion and scaling paths

8. **Risk & Feasibility Research**
   - Identify and assess various risk factors
   - Evaluate implementation challenges
   - Analyze resource requirements
   - Consider regulatory and legal implications

9. **Custom Research Focus**
   - User-defined research objectives
   - Specialized domain investigation
   - Cross-functional research needs

### 2. Input Processing

**If Project Brief provided:**

- Extract key product concepts and goals
- Identify target users and use cases
- Note technical constraints and preferences
- Highlight uncertainties and assumptions

**If Brainstorming Results provided:**

- Synthesize main ideas and themes
- Identify areas needing validation
- Extract hypotheses to test
- Note creative directions to explore

**If Market Research provided:**

- Build on identified opportunities
- Deepen specific market insights
- Validate initial findings
- Explore adjacent possibilities

**If Starting Fresh:**

- Gather essential context through questions
- Define the problem space
- Clarify research objectives
- Establish success criteria

## Process

### 3. Research Prompt Structure

CRITICAL: collaboratively develop a comprehensive research prompt with these components.

#### A. Research Objectives

CRITICAL: collaborate with the user to articulate clear, specific objectives for the research.

- Primary research goal and purpose
- Key decisions the research will inform
- Success criteria for the research
- Constraints and boundaries
- **Mode considerations:**
  - Solo → Focus on immediate implementation guidance and risk triage.
  - Small-team → Capture collaboration touchpoints, ownership, and shared artifacts.
  - Enterprise → Include compliance, governance, and audit evidence requirements.

#### B. Research Questions

CRITICAL: collaborate with the user to develop specific, actionable research questions organized by theme.

**Core Questions:**

- Central questions that must be answered
- Priority ranking of questions
- Dependencies between questions
- **Mode considerations:**
  - Solo → Prioritize questions that unblock development quickly.
  - Small-team → Add questions about process integration, release readiness, and shared tooling.
  - Enterprise → Expand to regulatory obligations, threat modeling, and long-term scalability.

**Supporting Questions:**

- Additional context-building questions
- Nice-to-have insights
- Future-looking considerations
- **Mode considerations:**
  - Solo → Capture backlog ideas with clear ROI.
  - Small-team → Identify knowledge gaps between functions (dev, ops, product).
  - Enterprise → Surface cross-org dependencies, change management, and vendor impacts.

#### C. Research Methodology

**Data Collection Methods:**

- Secondary research sources
- Primary research approaches (if applicable)
- Data quality requirements
- Source credibility criteria
- **Mode considerations:**
  - Solo → Emphasize open docs, standards bodies, and community knowledge bases.
  - Small-team → Add lightweight interviews or async surveys with stakeholders.
  - Enterprise → Require authoritative standards, legal guidance, and formal approvals.

**Analysis Frameworks:**

- Specific frameworks to apply
- Comparison criteria
- Evaluation methodologies
- Synthesis approaches
- **Mode considerations:**
  - Solo → Leverage simplified scoring matrices for fast prioritization.
  - Small-team → Incorporate frameworks that aid group decision-making (e.g., RICE, DACI).
  - Enterprise → Use risk matrices, compliance control mapping, and cost-benefit analyses.

#### D. Output Requirements

**Format Specifications:**

- Executive summary requirements
- Detailed findings structure
- Visual/tabular presentations
- Supporting documentation
- **Mode considerations:**
  - Solo → Provide concise action lists and automation scripts/snippets.
  - Small-team → Include handoff packets, change summaries, and owner/reviewer tables.
  - Enterprise → Produce audit trails, risk registers, and linkage to corporate standards.

**Key Deliverables:**

- Must-have sections and insights
- Decision-support elements
- Action-oriented recommendations
- Risk and uncertainty documentation
- **FOSS-first guidance:** Always prefer open-source tooling; document justification when recommending paid services.

### 4. Prompt Generation

**Research Prompt Template:**

```markdown
## Research Objective

[Clear statement of what this research aims to achieve]

## Active Mode

- Operating mode: [solo | small-team | enterprise]
- Resource & time constraints: [hours, budget, access limits]
- Collaboration & approvals: [owners, reviewers, stakeholders]

## Background Context

[Relevant information from project brief, brainstorming, or other inputs]

## Research Questions

### Primary Questions (Must Answer)

1. [Specific, actionable question]
2. [Specific, actionable question]
   ...

### Secondary Questions (Nice to Have)

1. [Supporting question]
2. [Supporting question]
   ...

## Research Methodology

### Information Sources

- [Priority source types: standards bodies, OSS docs, vendor references]

### Analysis Frameworks

- [Frameworks/models tuned to the active mode]

### Data Requirements

- [Quality, recency, credibility needs]

## Tooling & Source Preferences

- Preferred FOSS tools/platforms: [...]
- Paid tooling (if unavoidable) + justification: [...]

## Expected Deliverables

### Executive Summary

- Key findings and insights
- Critical implications
- Recommended actions with owners

### Detailed Analysis

[Specific sections needed based on research type and mode]

### Supporting Materials

- Data tables / comparison matrices
- Source documentation with access dates
- Risk register or checklist excerpts

## Governance & Risk

- Compliance or security considerations
- Monitoring / observability requirements
- Residual risks and open questions

## Success Criteria

[How to evaluate if research achieved its objectives]

## Timeline and Priority

[Time constraints, review cadence, follow-up milestones]
```

### 5. Review and Refinement

1. **Present Complete Prompt**
   - Show the full research prompt
   - Explain key elements and rationale
   - Highlight how the prompt satisfies the active mode requirements

2. **Gather Feedback**
   - Are the objectives clear and correct?
   - Do the questions address all concerns?
   - Is the scope appropriate for the active mode?
   - Are output requirements sufficient?

3. **Refine as Needed**
   - Incorporate user feedback
   - Adjust scope or focus
   - Add missing elements
   - Clarify ambiguities

### 6. Next Steps Guidance

**Execution Options:**

1. **Use with AI Research Assistant**: Provide this prompt to an AI model with research capabilities
2. **Guide Human Research**: Use as a framework for manual research efforts
3. **Hybrid Approach**: Combine AI and human research using this structure

**Integration Points:**

- How findings will feed into next phases
- Which team members should review results
- How to validate findings
- When to revisit or expand research
- Which checklist items (from `researcher-checklist.md`) must be completed for the selected mode

## Important Notes

- The quality of the research prompt directly impacts the quality of insights gathered
- Be specific rather than general in research questions
- Consider both current state and future implications
- Balance comprehensiveness with focus
- Document assumptions, limitations, and confidence levels clearly
- Plan for iterative refinement based on initial findings
- Always log the active mode and cite sources with access dates to maintain traceability
- Favor open-source tooling; when recommending paid solutions, provide cost/risk comparison and migration path
