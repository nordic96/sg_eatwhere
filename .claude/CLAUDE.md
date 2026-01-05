# The Foodie's Trail - SG | Agent Context

This document provides shared context for all Claude Code agents working on this project.

---

## Project Summary

**The Foodie's Trail - SG** is an interactive 3D food discovery platform for Singapore, featuring an immersive map interface built with Three.js. Users explore hidden local restaurants, dessert shops, and hawker stalls through visual navigation.

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.0.7 (App Router) |
| UI Library | React 19.2.0 |
| Language | TypeScript 5.x (strict) |
| 3D Engine | Three.js 0.181.2 + React Three Fiber 9.4.0 |
| State | Zustand 5.0.8 |
| Styling | Tailwind CSS 4 + Material-UI 7.3.5 |
| i18n | next-intl 4.5.7 |
| Testing | Jest 30.2.0 |

---

## Directory Map

```
app/
├── [locale]/              # Locale-based routing (en, ko, ja, nl)
│   ├── mapview/           # Main 3D map interface
│   ├── about/             # About page
│   └── admin/editor/      # Admin panel
├── api/                   # API routes
├── components/            # 31 UI components
├── mapmodels/             # 3D scene components
├── hooks/                 # 7 custom hooks
├── stores/                # 4 Zustand stores
├── types/                 # TypeScript definitions
├── utils/                 # Utility functions
├── constants/             # Theme & canvas constants
└── config/                # CDN configuration

i18n/                      # Internationalization setup
messages/                  # Translation files (en, ko, ja, nl)
__tests__/                 # Test files
```

---

## Core Domain Models

### FoodHeritage
Primary data model for food locations:
```typescript
interface FoodHeritage {
  id: string;
  name: string;
  recommendations: string[];
  category: 'restaurant' | 'dessert' | 'hawker';
  imgSource: string[];
  location: {
    address: string;
    gmapUrl: string;
    mrt: string[];
    region: 'central' | 'east' | 'west' | 'north';
    geoLocation: { latitude: number; longitude: number };
  };
  website?: string;
}
```

### Category Theme Colors
| Category | Color | Usage |
|----------|-------|-------|
| Hawker | `#FF6B6B` | Primary red for hawker centers |
| Dessert | `#4CAF50` | Green for dessert shops |
| Restaurant | `#FF9800` | Orange for restaurants |

---

## State Management (Zustand)

| Store | Location | Purpose |
|-------|----------|---------|
| `useHeritageStore` | `app/stores/useHeritageStore.ts` | Food data, filtering, selection |
| `useAppStore` | `app/stores/useAppStore.ts` | UI state (sidebar, menus) |
| `useTrailStore` | `app/stores/useTrailStore.ts` | Trail mode navigation |
| `useEnvironmentStore` | `app/stores/useEnvironmentStore.ts` | Day/night mode |

---

## Key Components Reference

### 3D Components (`app/mapmodels/`)
| Component | Purpose |
|-----------|---------|
| `MapEnvironment.tsx` | Scene lighting & setup |
| `InstancedBuildings.tsx` | 3D restaurant markers |
| `LocationPin.tsx` | Selected location highlight |
| `TrailPath.tsx` | Curved path between locations |
| `TextureMap.tsx` | Singapore map texture |

### UI Components (`app/components/`)
| Component | Purpose |
|-----------|---------|
| `SearchBar/` | Autocomplete search |
| `Sidebar/` | Location details panel |
| `FilterBar/` | Category filters |
| `MapController/` | Camera controls |
| `TrailMode/` | Trail navigation |
| `Header.tsx` | Navigation header |
| `LocaleSwitcher/` | Language switcher |

---

## Custom Hooks (`app/hooks/`)

| Hook | Purpose |
|------|---------|
| `useBreakpoints` | Responsive breakpoints (mobile/tablet/desktop) |
| `useCameraControls` | 3D camera manipulation |
| `useClickOutside` | Click outside detection |
| `useDebounce` | Input debouncing (200ms default) |
| `useHover` | Hover state tracking |
| `useInstancingModel` | 3D model instancing |

---

## Coding Standards

### Imports
- Use `@/` path alias for all imports
- Barrel exports via `index.ts` files

### Components
- Functional components with TypeScript
- Props interfaces defined inline or in `types/`
- Server Components for data fetching
- Client Components for interactivity

### Styling
- Tailwind CSS for utility classes
- `clsx` + `tailwind-merge` via `cn()` utility
- Material-UI for complex components
- Theme colors from `constants/theme.ts`

### State
- Zustand stores with typed selectors
- No prop drilling - use stores directly
- Computed values via store getters

### Testing
- Tests in `__tests__/` mirroring `app/` structure
- Jest with jsdom environment
- MUI mocks in `__mocks__/@mui/`

---

## Responsive Breakpoints

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| Mobile | 0px | Touch-first, simplified UI |
| Tablet | 768px | Adapted layouts |
| Desktop | 1024px | Full 3D experience |

Use `useBreakpoints()` hook for responsive logic.

---

## Internationalization

**Supported Locales:** `en`, `ko`, `ja`, `nl`

- Route pattern: `/{locale}/{page}`
- Translations: `messages/{locale}.json`
- Hook: `useTranslations('namespace')`
- Server: `getTranslations('namespace')`

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/gist` | GET | Fetch food data |
| `/api/admin/gist` | PUT | Update food data (admin) |

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CDN_BASE` | CDN URL for assets |
| `DATA_URL` | Food data source |
| `GIST_ID` | GitHub Gist ID |
| `GITHUB_GIST_TOKEN` | Gist API token |
| `ADMIN_PASSWORD` | Admin authentication |

---

## Development Commands

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run test       # Run Jest tests
npm run lint       # ESLint check
npm run lint:fix   # ESLint auto-fix
```

---

## Git Workflow

| Branch | Purpose |
|--------|---------|
| `master` | Production (main) |
| `dev_claude` | Development |

---

## Agent Collaboration

### @frontend-dev
- Implements features and fixes bugs
- Maintains code quality and tests
- Focus: TypeScript, React, Three.js, Zustand

### @ui-ux-designer
- Analyzes UI/UX issues
- Provides design recommendations
- Focus: Visual consistency, user flows, accessibility

Both agents should:
1. Read existing code before making changes
2. Follow established patterns
3. Use MCP servers for browser automation (see below)
4. Update tests for new functionality

---

## MCP Server Usage

**IMPORTANT:** This project has MCP (Model Context Protocol) servers configured in `.claude/mcp.json`.

### Available MCP Servers

| Server | Purpose |
|--------|---------|
| `playwright` | Browser automation for screenshots & visual testing |
| `sequential-thinking` | Enhanced reasoning for complex problems |

### How to Use MCP Servers

MCP servers are accessed through Claude's built-in MCP tool interface. **DO NOT install packages directly.**

```
WRONG: npm install playwright          # DO NOT DO THIS
WRONG: npm install --save-dev playwright   # DO NOT DO THIS

RIGHT: Use the MCP tools provided by Claude Code
```

### Using Playwright MCP for Screenshots

The Playwright MCP server provides tools for browser automation. Use these MCP-provided tools:

1. **`mcp__playwright__browser_navigate`** - Navigate to a URL
2. **`mcp__playwright__browser_screenshot`** - Capture screenshot
3. **`mcp__playwright__browser_click`** - Click elements
4. **`mcp__playwright__browser_snapshot`** - Get accessibility snapshot

Example workflow for capturing screenshots:
```
1. Use mcp__playwright__browser_navigate to go to http://localhost:3000/en/about
2. Use mcp__playwright__browser_screenshot to capture the page
```

### Using Sequential Thinking MCP

For complex problem-solving, use the sequential thinking MCP tools to break down problems step by step.

### Why Not Install Playwright Directly?

- MCP servers run in isolated environments
- No need to modify `package.json`
- Consistent tooling across all agents
- Automatically managed by Claude Code
