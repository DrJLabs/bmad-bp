graph TD
A["Start: Project Idea"] --> B{"Optional: Analyst Research"}
B -->|Yes| C["Analyst: Brainstorming (Optional)<br/>Cursor: @analyst brainstorm and outline → write docs/briefs/brief.md<br/>Claude: /analyst Brainstorm and outline → write docs/briefs/brief.md"]
B -->|No| G{"Project Brief Available?"}
C --> C2["Analyst: Market Research (Optional)<br/>Cursor: @analyst market research for scope → append to docs/briefs/brief.md<br/>Claude: /analyst Produce market‑research summary → append docs/briefs/brief.md"]
C2 --> C3["Analyst: Competitor Analysis (Optional)<br/>Cursor: @analyst competitor table → write docs/research/competitors.md and summarize in docs/briefs/brief.md<br/>Claude: /analyst Competitor analysis → write docs/research/competitors.md; update brief"]
C3 --> D["Analyst: Create Project Brief<br/>Cursor: @analyst consolidate findings → write docs/briefs/brief.md<br/>Claude: /analyst Create project brief → write docs/briefs/brief.md"]
D --> G
G -->|Yes| E["PM: Create PRD from Brief (Fast Track)<br/>Cursor: @pm create PRD from docs/briefs/brief.md → write docs/prd.md<br/>Claude: /pm Create PRD from docs/briefs/brief.md → write docs/prd.md"]
G -->|No| E2["PM: Interactive PRD Creation (More Questions)<br/>Cursor: @pm interview then draft PRD → write docs/prd.md<br/>Claude: /pm Interactive PRD session → write docs/prd.md"]
E --> F["PRD Created with FRs, NFRs, Epics & Stories"]
E2 --> F
F --> F2{"UX Required?"}
F2 -->|Yes| F3["UX Expert: Create Front End Spec<br/>Cursor: @bmad-master act as UX expert → write docs/ux/front-end-spec.md from docs/prd.md<br/>Claude: /bmad-master Act as UX expert → write docs/ux/front-end-spec.md"]
F2 -->|No| H["Architect: Create Architecture from PRD<br/>Cursor: @architect design from docs/prd.md → write docs/architecture.md<br/>Claude: /architect Create architecture from docs/prd.md → write docs/architecture.md"]
F3 --> F4["UX Expert: Generate UI Prompt for Lovable/V0 (Optional)<br/>Cursor: @bmad-master produce UI prompt for prototyper → write docs/ux/ui-prompt.md<br/>Claude: /bmad-master Generate UI prompt → write docs/ux/ui-prompt.md"]
F4 --> H2["Architect: Create Architecture from PRD + UX Spec<br/>Cursor: @architect design from docs/prd.md + docs/ux/front-end-spec.md → write docs/architecture.md<br/>Claude: /architect Use PRD + UX spec → write docs/architecture.md"]
H --> Q{"Early Test Strategy? (Optional)"}
H2 --> Q
Q -->|Yes| R["QA: Early Test Architecture Input on High‑Risk Areas<br/>Cursor: @qa *risk {epic.story-draft} then *design {epic.story-draft}<br/>Claude: /qa *risk {epic.story-draft} and *design {epic.story-draft}"]
Q -->|No| I
R --> I["PO: Run Master Checklist<br/>Cursor: @po master checklist across docs/prd.md + docs/architecture.md → list gaps; plan fixes<br/>Claude: /po Run master checklist → output docs/reviews/po-master-checklist.md"]
I --> J{"Documents Aligned?"}
J -->|Yes| K["Planning Complete"]
J -->|No| L["PO: Update Epics & Stories<br/>Cursor: @po update epics/stories in docs/prd.md; sync docs/epics/ and docs/stories/<br/>Claude: /po Update epics and stories to align with PRD"]
L --> M["Update PRD/Architecture as needed<br/>Cursor: @pm revise docs/prd.md; @architect revise docs/architecture.md<br/>Claude: /pm Revise PRD; /architect Revise architecture"]
M --> I
K --> N["📁 Switch to IDE (If in a Web Agent Platform)<br/>Action: open repo in Cursor or Claude Code; ensure docs/* present"]
N --> O["PO: Shard Documents<br/>Cursor: @po shard PRD into epics/stories → write docs/epics/ and docs/stories/<br/>Claude: /po Shard PRD → docs/epics/ and docs/stories/"]
O --> P["Ready for SM/Dev Cycle"]

    style A fill:#f5f5f5,color:#000
    style B fill:#e3f2fd,color:#000
    style C fill:#e8f5e9,color:#000
    style C2 fill:#e8f5e9,color:#000
    style C3 fill:#e8f5e9,color:#000
    style D fill:#e8f5e9,color:#000
    style E fill:#fff3e0,color:#000
    style E2 fill:#fff3e0,color:#000
    style F fill:#fff3e0,color:#000
    style F2 fill:#e3f2fd,color:#000
    style F3 fill:#e1f5fe,color:#000
    style F4 fill:#e1f5fe,color:#000
    style G fill:#e3f2fd,color:#000
    style H fill:#f3e5f5,color:#000
    style H2 fill:#f3e5f5,color:#000
    style Q fill:#e3f2fd,color:#000
    style R fill:#ffd54f,color:#000
    style I fill:#f9ab00,color:#fff
    style J fill:#e3f2fd,color:#000
    style K fill:#34a853,color:#fff
    style L fill:#f9ab00,color:#fff
    style M fill:#fff3e0,color:#000
    style N fill:#1a73e8,color:#fff
    style O fill:#f9ab00,color:#fff
    style P fill:#34a853,color:#fff
