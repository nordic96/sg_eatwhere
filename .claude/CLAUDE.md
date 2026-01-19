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

### Brand Colour Palette (Singapore-Inspired)
| Name | Hex | Usage |
|------|-----|-------|
| Primary Red | `#A7292C` | CTA buttons, primary actions |
| Outram Orange | `#E15F2B` | Restaurant accents |
| Golden Mile Yellow | `#F8D64F` | Highlights, attention |
| Garden Green | `#406E3B` | Dessert accents |

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
| `SearchBar/` | Autocomplete search with AI semantic search (lazy-loaded, mapview only) |
| `Sidebar/` | Location details panel |
| `FilterBar/` | Category filters |
| `MapController/` | Camera controls |
| `TrailMode/` | Trail navigation |
| `Header.tsx` | Navigation header |
| `LocaleSwitcher/` | Language switcher |

### About Page Components (`app/components/`)
| Component | Purpose |
|-----------|---------|
| `InspirationSection/` | Attribution section with colour palette & CTA |
| `TechStack/TechStackSection` | Tech badges grid with GitHub CTAs |
| `TechStack/TechBadge` | Individual tech badge with tooltip |

### SearchBar Sub-Components (`app/components/SearchBar/`)
| Component | Purpose |
|-----------|---------|
| `AISparkle` | Sparkle icon indicating AI semantic search |
| `LoadingProgress` | Initialization loading indicator |
| `SearchProgress` | Active search loading indicator |
| `SearchSkeleton` | Skeleton loading for search results |
| `RichItem` | Rich search result item display |

### About Page Layout (`app/[locale]/about/page.tsx`)
Two-column responsive grid (single column on mobile):

**Left Column:**
- Hero image with attribution
- Name + intro text
- NameCard (contact links)
- StatsBar (key metrics)
- "About this Project" section

**Right Column:**
- "Food & Code" section
- InspirationSection (attribution + colour palette)
- TechStackSection (tech badges + GitHub CTAs)

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

### Design Patterns
- **Centered CTAs**: Use `flex justify-center` for CTA button groups
- **Attribution Sections**: Image, title, author, description, colour palette, CTA
- **Tech Badges**: Icon + label with tooltip, hover lift effect (`hover:-translate-y-1`)
- **Loading States**: Skeleton components for content, CircularProgress for actions
- **AI Indicators**: Sparkle icon (AutoAwesome) for AI-powered features

### State
- Zustand stores with typed selectors
- No prop drilling - use stores directly
- Computed values via store getters

### Testing
- Tests in `__tests__/` mirroring `app/` structure
- Jest with jsdom environment
- MUI mocks in `__mocks__/@mui/`

---

## Performance Patterns

### WebWorker & Heavy Resource Initialization
**Pattern:** Lazy initialization in singleton factory with deferred constructor.

**Problem:** The SemanticSearchClient (HuggingFace embedding model) was loading on all pages, causing performance degradation on pages that never use search functionality.

**Solution:** Use deferred initialization pattern:
```typescript
// Don't auto-initialize in constructor - wait for first use
export class SemanticSearchClient {
  constructor() {
    // Constructor is empty - no expensive operations
  }

  private initWorker(): Promise<void> {
    // Heavy initialization happens only when needed
  }

  async generateEmbeddings(foodData): Promise<void> {
    await this.ensureWorker();  // Lazy init on first call
    // ...
  }
}

// Singleton factory with lazy init
export function getSemanticSearchClient(): SemanticSearchClient {
  if (!searchClient) {
    searchClient = new SemanticSearchClient();
    // Note: Worker not created until first method call
  }
  return searchClient;
}
```

**Implementation:** `lib/semanticSearch.ts` - `SemanticSearchClient` class with `initWorker()` private method.

### React 19 Activity vs Conditional Rendering
**Critical Issue:** React 19's `<Activity>` (Suspense-like) component mounts children but hides them - it does NOT prevent component initialization.

**Problem:** Wrapping expensive components in Activity doesn't prevent their constructor from running:
```typescript
// WRONG - Component still mounts and initializes
<Activity fallback={<Loading />}>
  <SearchBar />  {/* Constructor runs, model loads */}
</Activity>
```

**Solution:** Use explicit conditional rendering for heavy components:
```typescript
// RIGHT - Component only mounts when condition is true
{pathname === '/mapview' && breakpoint === 'desktop' && (
  <SearchBar />  {/* Constructor deferred until this condition is true */}
)}
```

**Implementation:** `app/components/Header.tsx` (line 31-39) - SearchBar only renders on mapview + desktop.

**Lesson:** For expensive components (especially those with WebWorkers or heavy resource loading), always use `{condition && <Component />}` rather than Activity/Suspense boundaries.

### Singleton Factory Pattern with State Management
**Pattern:** Use factory function with deferred initialization state.

```typescript
// Track initialization state to prevent re-initialization
export class SemanticSearchClient {
  private isReady = false;           // Model loaded and cached
  private isDestroyed = false;       // Cleanup called
  private initPromise: Promise<void> | null = null;  // Prevent race conditions

  private async ensureWorker(): Promise<void> {
    // Re-init if destroyed, return existing promise if already initializing
    if (this.isDestroyed || !this.worker) {
      await this.initWorker();
    }
  }
}
```

**Benefits:**
- Workers persist across component remounts
- Model cached in worker memory after first load
- Graceful re-initialization after cleanup
- Request ID correlation prevents promise race conditions

**Files:** `lib/semanticSearch.ts`

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

### Agent Directory Structure

```
.claude/agents/
├── frontend-dev/
│   ├── frontend-dev.md     # Agent definition & capabilities
│   └── SKILLS.md           # Session learnings & patterns
└── ui-ux-designer/
    ├── ui-ux-designer.md   # Agent definition & capabilities
    └── SKILLS.md           # Design insights & UX patterns
```

### @frontend-dev
- **Definition:** `.claude/agents/frontend-dev/frontend-dev.md`
- **Skills:** `.claude/agents/frontend-dev/SKILLS.md`
- Implements features and fixes bugs
- Maintains code quality and tests
- Focus: TypeScript, React, Three.js, Zustand

### @ui-ux-designer
- **Definition:** `.claude/agents/ui-ux-designer/ui-ux-designer.md`
- **Skills:** `.claude/agents/ui-ux-designer/SKILLS.md`
- Analyzes UI/UX issues
- Provides design recommendations
- Focus: Visual consistency, user flows, accessibility

### Agent Guidelines

All agents should:
1. Read existing code before making changes
2. Follow established patterns
3. Use MCP servers for browser automation (see below)
4. Update tests for new functionality
5. Update their SKILLS.md with session learnings via `/wrap-session`

---

## Common Pitfalls & Lessons Learned

### Agent-Specific Skills

Each agent maintains its own SKILLS.md file for specialized learnings:

| Agent | Skills Location | Focus Area |
|-------|-----------------|------------|
| frontend-dev | `.claude/agents/frontend-dev/SKILLS.md` | Performance, debugging, React patterns |
| ui-ux-designer | `.claude/agents/ui-ux-designer/SKILLS.md` | Design patterns, accessibility, UX insights |

### wrap-session Skill Integration

When running `/wrap-session`, the skill should update the appropriate files based on the session context:

1. **General learnings** (shared across agents) -> Update this section in `.claude/CLAUDE.md`
2. **Frontend-specific learnings** (React, TypeScript, performance) -> Update `.claude/agents/frontend-dev/SKILLS.md`
3. **UI/UX-specific learnings** (design, accessibility, visual patterns) -> Update `.claude/agents/ui-ux-designer/SKILLS.md`
4. **Project-wide context changes** -> Update `.claude/CLAUDE.md`

### Session Wrap-Up Checklist

When wrapping a session, consider:
- Extract new learnings and patterns discovered
- Document any mistakes made and their fixes
- Identify automation opportunities
- Update relevant agent SKILLS.md if specialized knowledge
- Add to CLAUDE.md if affects entire project

### Critical Lessons

#### 1. MCP Servers vs Direct Package Installation

**Problem:** Installing Playwright or other MCP-provided tools directly via npm, or writing standalone scripts.

```bash
# WRONG - Pollutes package.json and doesn't use MCP properly
npm install playwright
npm install --save-dev playwright

# WRONG - Standalone scripts bypass MCP isolation
node screenshot-script.js
npx playwright screenshot ...
```

**Solution:** Use MCP tools provided by Claude Code. MCP servers are configured in `.claude/mcp.json`.

```
# CORRECT - Use MCP-provided tools
mcp__playwright__browser_navigate  - Navigate to URL
mcp__playwright__browser_screenshot - Capture screenshot
mcp__playwright__browser_resize    - Change viewport size
mcp__playwright__browser_click     - Click elements
mcp__playwright__browser_snapshot  - Get accessibility snapshot
```

**Viewport sizes for responsive testing:**
- Mobile: 375 x 812
- Tablet: 768 x 1024
- Desktop: 1440 x 900

**Why this matters:**
- MCP servers run in isolated environments
- No modification to project's `package.json`
- Consistent tooling across all agents
- Automatically managed by Claude Code
- No standalone scripts to maintain

#### 2. React Import Errors - Activity Component

**Problem:** Importing non-existent components from React.

```typescript
// WRONG - Activity does not exist in React
import { Activity } from 'react';
```

**Solution:** Use conditional rendering or proper loading indicators.

```typescript
// CORRECT - Use conditional rendering
{isLoading && <div className="spinner">Loading...</div>}

// Or use a proper library component
import CircularProgress from '@mui/material/CircularProgress';
```

**Files affected in past:** ImageCarousel, SearchBar, ToggleButton, ClientHome, ButtonContainer, MapScene

#### 3. useTransition Timing with Index Reset

**Problem:** Placing state resets inside `startTransition` causes timing issues.

```typescript
// WRONG - Index reset happens asynchronously, causing mismatch
useEffect(() => {
  startTransition(() => {
    setCurrImg(0); // This happens later than expected
    setDisplayImages(img);
  });
}, [img]);
```

**Solution:** Reset indices immediately, outside the transition.

```typescript
// CORRECT - Reset immediately, transition the expensive operation
useEffect(() => {
  setCurrImg(0); // Immediate reset
  startTransition(() => {
    setLoadedImages(new Set());
    setDisplayImages(img);
  });
}, [img]);
```

#### 4. Testing Components with Loading States

**Problem:** Tests fail because elements are hidden during loading state.

```typescript
// WRONG - Images are display:none during loading
const img = screen.getByAltText('test');
fireEvent.click(img); // May fail if image is hidden
```

**Solution:** Simulate image loading in tests.

```typescript
// CORRECT - Simulate image load events
function simulateImageLoads(container: HTMLElement) {
  const images = container.querySelectorAll('img');
  images.forEach((img) => {
    fireEvent.load(img);
  });
}

// Use in test
render(<ImageCarousel img={['test.jpg']} />);
simulateImageLoads(container);
```

#### 5. File Paths with Special Characters in Shell

**Problem:** File paths with brackets `[]` fail in shell commands.

```bash
# WRONG - Shell interprets brackets as glob pattern
git add app/[locale]/about/page.tsx
# Error: no matches found
```

**Solution:** Quote file paths with special characters.

```bash
# CORRECT - Quote the path
git add "app/[locale]/about/page.tsx"
```

#### 6. Jest Test Path Pattern Deprecation

**Problem:** `--testPathPattern` option is deprecated.

```bash
# WRONG - Deprecated option
npm run test -- --testPathPattern="StatsBar"
```

**Solution:** Pass the pattern directly as an argument.

```bash
# CORRECT - Pass pattern directly
npm run test -- StatsBar
```

### Best Practices Established

#### Component Structure

1. **Props Interface:** Always define explicit TypeScript interfaces

```typescript
export interface StatsBarProps {
  stats: StatItem[];
  variant?: 'default' | 'compact';
  className?: string;
}
```

2. **Barrel Exports:** Use `index.ts` for clean imports

```typescript
// app/components/StatsBar/index.ts
export { default } from './StatsBar';
export type { StatItem, StatsBarProps } from './StatsBar';
```

3. **Accessibility:** Always include ARIA attributes

```typescript
<div role="list" aria-label="Statistics">
  {stats.map((stat) => (
    <div role="listitem">{stat.value}</div>
  ))}
</div>
```

#### Styling Patterns

1. **Use `cn()` utility** for conditional class merging
2. **Tailwind responsive classes:** `grid-cols-2 md:flex md:flex-row`
3. **Hover states:** `transition-all duration-200 hover:scale-110`
4. **Focus states:** `focus-visible:ring-2 focus-visible:ring-primary`

#### Testing Patterns

1. **Test accessibility:** Check roles, aria-labels
2. **Test styling classes:** Verify Tailwind classes are applied
3. **Test variants:** Cover all prop combinations
4. **Test edge cases:** Empty arrays, single items

#### i18n Patterns

1. **Translation keys:** Use descriptive namespaces (`StatsBar.years_label`)
2. **Multiple hooks:** Use separate `useTranslations()` for different namespaces
3. **All locales:** Always update all 4 locale files (en, ko, ja, nl)

### Pre-Task Checklist

Before starting any new implementation:

- Read existing code in the affected files
- Check for similar components/patterns in the codebase
- Verify import paths and module existence
- Plan test cases before implementation
- Consider responsive design from the start
- Add i18n support if user-facing text

### Common Gotchas in This Codebase

| Area | Gotcha | Solution |
|------|--------|----------|
| Imports | `@/` alias required | Use `@/app/...` not `../` |
| Styling | `cn()` utility exists | Import from `@/app/utils` |
| Tests | MUI icons need mocks | Mocks exist in `__mocks__/@mui/` |
| i18n | 4 locales required | en, ko, ja, nl |
| Git | Pre-commit hooks run tests | Ensure tests pass before commit |

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
