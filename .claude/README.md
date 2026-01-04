# Claude Code Configuration

This directory contains the Claude Code configuration for **The Foodie's Trail - SG** project.

## Structure

```
.claude/
├── README.md           # This file
├── settings.json       # MCP server configuration
└── skills/
    ├── frontend-dev.md    # @frontend-dev subagent
    └── ui-ux-designer.md  # @ui-ux-designer subagent
```

## Subagents

### @frontend-dev
Frontend developer agent for feature implementation. Specializes in:
- Next.js 16 / React 19 development
- Three.js / React Three Fiber 3D features
- Zustand state management
- TypeScript with strict typing
- Tailwind CSS styling

**Usage:** `@frontend-dev implement the new filter component`

### @ui-ux-designer
UI/UX designer agent for interface analysis. Specializes in:
- Visual consistency audits
- User flow analysis
- Responsive design review
- Accessibility assessment
- Design recommendations

**Usage:** `@ui-ux-designer analyze the mobile search experience`

## MCP Servers

### Playwright
Browser automation for visual testing and UI verification.
- Screenshot capture at different viewports
- User flow navigation
- Interaction testing

### Sequential Thinking
Enhanced reasoning for complex problem-solving.
- Multi-step analysis
- Design trade-off evaluation
- Architecture decisions

## Project Context

See `/CLAUDE.md` at the project root for:
- Full technology stack
- Project structure
- Coding conventions
- Development commands
