# Claude Code Configuration

This directory contains the Claude Code configuration for **The Foodie's Trail - SG** project.

## Structure

```
.claude/
├── README.md              # This file
├── CLAUDE.md              # Main project context (shared across all agents)
├── SKILLS.md              # Global lessons learned & best practices
├── mcp.json               # MCP server configuration
├── settings.local.json    # Local permissions (gitignored)
├── agents/                # Agent definitions
│   ├── frontend-dev/
│   │   ├── frontend-dev.md   # Agent definition
│   │   └── SKILLS.md         # Agent-specific learnings
│   └── ui-ux-designer/
│       ├── ui-ux-designer.md # Agent definition
│       └── SKILLS.md         # Agent-specific learnings
└── screenshots/           # UI screenshots for reference
```

## Agents

### @frontend-dev

Frontend developer agent for feature implementation.

**Files:**
- Definition: `agents/frontend-dev/frontend-dev.md`
- Skills: `agents/frontend-dev/SKILLS.md`

**Specializes in:**
- Next.js 16 / React 19 development
- Three.js / React Three Fiber 3D features
- Zustand state management
- TypeScript with strict typing
- Performance optimization

### @ui-ux-designer

UI/UX designer agent for interface analysis.

**Files:**
- Definition: `agents/ui-ux-designer/ui-ux-designer.md`
- Skills: `agents/ui-ux-designer/SKILLS.md`

**Specializes in:**
- Visual consistency audits
- Design system maintenance
- Responsive design review
- Accessibility assessment
- Component patterns

## MCP Servers

Configured in `mcp.json`:

| Server | Purpose |
|--------|---------|
| `playwright` | Browser automation for screenshots & visual testing |
| `sequential-thinking` | Enhanced reasoning for complex problems |

**Important:** Use MCP tools directly, do not install packages like Playwright via npm.

## Skills & Learning

The `/wrap-session` command updates documentation based on session context:

| Context | Target File |
|---------|-------------|
| General learnings | `.claude/SKILLS.md` |
| Frontend-specific | `agents/frontend-dev/SKILLS.md` |
| UI/UX-specific | `agents/ui-ux-designer/SKILLS.md` |
| Project-wide changes | `.claude/CLAUDE.md` |

## Key Documents

| Document | Purpose |
|----------|---------|
| `CLAUDE.md` | Project context, tech stack, coding standards |
| `SKILLS.md` | Shared lessons, mistakes to avoid |
| Agent `SKILLS.md` | Specialized knowledge per agent |
