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
| Styling | Tailwind CSS 4 |
| Icons | react-icons 5.5.0 |
| i18n | next-intl 4.5.7 |
| Testing | Jest 30.2.0 |

**Note:** Material-UI and @emotion/* have been removed. Icons now use react-icons (see #136).

---

## Directory Map

```
src/
├── app/                   # Next.js App Router (routes only)
│   ├── [locale]/          # Locale-based routing (en, ko, ja, nl)
│   │   ├── mapview/       # Main 3D map interface
│   │   ├── about/         # About page
│   │   └── admin/editor/  # Admin panel
│   └── api/               # API routes
├── components/            # 31 UI components
├── mapmodels/             # 3D scene components
├── hooks/                 # 9 custom hooks
├── stores/                # 4 Zustand stores
├── types/                 # TypeScript definitions
├── utils/                 # Utility functions
├── constants/             # Theme & canvas constants
├── config/                # CDN configuration
├── lib/                   # Semantic search module
├── workers/               # Web workers
└── functions/             # Server functions

i18n/                      # Internationalization setup
messages/                  # Translation files (en, ko, ja, nl)
__tests__/                 # Test files
public/                    # Static assets
resources/                 # Development data
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
| `useHeritageStore` | `src/stores/useHeritageStore.ts` | Food data, filtering, selection |
| `useAppStore` | `src/stores/useAppStore.ts` | UI state (sidebar, menus) |
| `useTrailStore` | `src/stores/useTrailStore.ts` | Trail mode navigation |
| `useEnvironmentStore` | `src/stores/useEnvironmentStore.ts` | Day/night mode |

---

## Key Components Reference

### 3D Components (`src/mapmodels/`)
| Component | Purpose |
|-----------|---------|
| `MapEnvironment.tsx` | Scene lighting & setup |
| `InstancedBuildings.tsx` | 3D restaurant markers |
| `LocationPin.tsx` | Selected location highlight |
| `TrailPath.tsx` | Curved path between locations |
| `TextureMap.tsx` | Singapore map texture |

### UI Components (`src/components/`)
| Component | Purpose |
|-----------|---------|
| `SearchBar/` | Autocomplete search with AI semantic search (lazy-loaded, mapview only) |
| `Sidebar/` | Location details panel |
| `FilterBar/` | Category filters |
| `MapController/` | Camera controls |
| `TrailMode/` | Trail navigation |
| `Header.tsx` | Navigation header |
| `LocaleSwitcher/` | Language switcher |

### About Page Components (`src/components/`)
| Component | Purpose |
|-----------|---------|
| `FadeIn/` | Animated fade-in with scroll reveal, directional transitions, and timing controls |
| `InspirationSection/` | Attribution section with colour palette & CTA |
| `StatsBar/` | Statistics display with optional counter animations and staggered reveal |
| `TechStack/TechStackSection` | Tech badges grid with GitHub CTAs |
| `TechStack/TechBadge` | Individual tech badge with tooltip |

### SearchBar Sub-Components (`src/components/SearchBar/`)
| Component | Purpose |
|-----------|---------|
| `AISparkle` | Sparkle icon indicating AI semantic search |
| `LoadingProgress` | Initialization loading indicator |
| `SearchProgress` | Active search loading indicator |
| `SearchSkeleton` | Skeleton loading for search results |
| `RichItem` | Rich search result item display |

### About Page Layout (`src/app/[locale]/about/page.tsx`)
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

## Custom Hooks (`src/hooks/`)

| Hook | Purpose |
|------|---------|
| `useBreakpoints` | Responsive breakpoints (mobile/tablet/desktop) |
| `useCameraControls` | 3D camera manipulation |
| `useClickOutside` | Click outside detection |
| `useCountUp` | Counter animation hook with easing functions and formatting |
| `useDebounce` | Input debouncing (200ms default) |
| `useHover` | Hover state tracking |
| `useInstancingModel` | 3D model instancing |
| `useScrollReveal` | Intersection Observer-based scroll reveal with a11y support |

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
- react-icons for icons (multiple icon sets: fa, hi, md, si, tb, fi)
- Theme colors from `constants/theme.ts`

### Design Patterns
- **Centered CTAs**: Use `flex justify-center` for CTA button groups
- **Attribution Sections**: Image, title, author, description, colour palette, CTA
- **Tech Badges**: Icon + label with tooltip, hover lift effect (`hover:-translate-y-1`)
- **Loading States**: Skeleton components for content, spinner animations for actions
- **AI Indicators**: Sparkle icon (`HiSparkles` from `react-icons/hi`) for AI-powered features
- **Icon Usage**: Import from `react-icons/*` (e.g., `import { FaMap } from 'react-icons/fa'`, `import { HiSparkles } from 'react-icons/hi'`)

### State
- Zustand stores with typed selectors
- No prop drilling - use stores directly
- Computed values via store getters

### Testing
- Tests in `__tests__/` mirroring `app/` structure
- Jest with jsdom environment
- react-icons load correctly in tests (no special mocking required)

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

**Implementation:** `src/lib/semanticSearch.ts` - `SemanticSearchClient` class with `initWorker()` private method.

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

**Implementation:** `src/components/Header.tsx` (line 31-39) - SearchBar only renders on mapview + desktop.

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

**Files:** `src/lib/semanticSearch.ts`

### Scroll-Based Animation Patterns
**Pattern:** Combine scroll reveal hooks with animated components for progressive disclosure.

**Implementation:**
- `useScrollReveal`: Detects when elements enter viewport via Intersection Observer
- `useCountUp`: Animates numeric values with easing (ease-out-cubic default)
- `FadeIn` component: Wraps scroll reveal with directional fade transitions
- `StatsBar` component: Applies staggered animations across stats items

**Benefits:**
- Smooth progressive disclosure as user scrolls
- Reduced initial render load (animations trigger on-demand)
- Accessibility-friendly (respects `prefers-reduced-motion`)
- Customizable timing: direction, duration, delay, stagger

**Example usage:**
```typescript
// Basic fade-in with scroll trigger
<FadeIn>
  <div>Content appears with fade</div>
</FadeIn>

// With animation customization
<FadeIn direction="up" duration={0.8} delay={0.2}>
  <Stat value={42} />
</FadeIn>

// Stats with counter animation and stagger
<StatsBar
  stats={data}
  animateOnScroll
  animationDuration={2}
  staggerDelay={0.1}
/>
```

**Files:** `src/hooks/useScrollReveal.ts`, `src/hooks/useCountUp.ts`, `src/components/FadeIn/`, `src/components/StatsBar/`

### Testing Environment Setup
**Pattern:** Proper mocking of browser APIs for jest tests.

**Setup:** `jest.setup.ts` includes mock for `window.matchMedia` to support responsive component testing.

```typescript
// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

**Benefits:**
- Responsive components (using `useBreakpoints`) work in test environment
- Intersection Observer-based hooks can be tested
- No console warnings about unimplemented browser APIs

**Files:** `jest.setup.ts`

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

### i18n CDN Fallback Chain

When loading translations from CDN (e.g., for search results or dynamic content), implement a nested fallback strategy:

```typescript
async function fetchTranslations(locale: string) {
  try {
    // Try locale-specific CDN file first
    return await fetch(`${CDN_BASE}/messages/${locale}.json`);
  } catch (error) {
    try {
      // Fallback to English if locale file fails
      return await fetch(`${CDN_BASE}/messages/en.json`);
    } catch (fallbackError) {
      // Last resort: empty object or cached default
      return {};
    }
  }
}
```

**Benefits:**
- Graceful degradation on network failures
- Users see English content rather than broken text
- Works across all locales without duplication
- Handles partial network failures (e.g., CDN timeout for specific locale)

**Implementation:** `app/api/` routes handling dynamic translation fetching

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

### Directory Structure

```
.claude/                        # Project-specific configuration
├── agents/
│   ├── frontend-dev/
│   │   ├── frontend-dev.md     # Agent definition & capabilities
│   │   └── SKILLS.md           # Session learnings & patterns
│   └── ui-ux-designer/
│       ├── ui-ux-designer.md   # Agent definition & capabilities
│       └── SKILLS.md           # Design insights & UX patterns
├── CLAUDE.md                   # Project context (this file)
└── mcp.json                    # MCP server configuration

~/.claude/commands/             # Global workflow commands (shared across projects)
├── issue-dev.md                # Feature implementation workflow
├── run-pr-checks.md            # Pre-push validation & PR creation
├── fetch-pr-review.md          # PR review feedback application
└── wrap-session.md             # Session wrap-up workflow
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

### Task Delegation Workflow

**When to use `@frontend-dev` agent:**

| Task Type | Approach |
|-----------|----------|
| Predefined GitHub issue (e.g., "work on issue #121") | Use `@frontend-dev` agent |
| Impromptu/ad-hoc tasks or quick questions | Work directly (main conversation) |

**Rationale:** When a specific GitHub issue is mentioned, the requirements are already defined in the issue, so the `@frontend-dev` agent can:
1. Fetch the issue details from GitHub
2. Understand the full scope and acceptance criteria
3. Work autonomously with its specialized project context
4. Return completed work for review

**Example:**
```
User: "Work on issue #121"
→ Invoke @frontend-dev agent with the issue context

User: "Can you quickly fix this typo?"
→ Work directly in the main conversation
```

### Workflow Commands (Global)

Reusable slash commands available across all projects. Definitions in `~/.claude/commands/`.

| Command | Usage | Purpose |
|---------|-------|---------|
| `/issue-dev {n}` | `/issue-dev 121` | Fetch issue, checkout branch, implement (auto-selects agent) |
| `/run-pr-checks {branch}` | `/run-pr-checks issue_121` | Run lint/test/build, create PR if all pass |
| `/fetch-pr-review {n}` | `/fetch-pr-review 139` | Fetch PR comments, apply critical/high fixes |
| `/wrap-session` | `/wrap-session` | Extract learnings, update docs, suggest followups |

**Agent Auto-Selection:** `/issue-dev` automatically detects available agents in the project's `.claude/agents/` directory and selects the most appropriate one based on issue labels. Falls back to working directly if no agents are defined.

**Workflow Chain Example:**
```
1. /issue-dev 134            → Implement feature (uses @frontend-dev if available)
2. /run-pr-checks issue_134  → Validate and create PR
3. (wait for review)
4. /fetch-pr-review 140      → Apply review feedback
5. /wrap-session             → Document learnings
```

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

#### 2. React Import Errors - Loading Components

**Problem:** Importing non-existent components from React or using improper loading patterns.

**Solution:** Use conditional rendering or proper loading indicators.

```typescript
// CORRECT - Use conditional rendering for loading states
{isLoading && <div className="spinner">Loading...</div>}

// Or use a react-icons spinner icon
import { TbLoader2 } from 'react-icons/tb';
<Loader2 className="animate-spin" />
```

**Note:** For performance-critical components with heavy initialization, see [Performance Patterns - React 19 Activity vs Conditional Rendering](#react-19-activity-vs-conditional-rendering).

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

#### 7. useEffect State Reset Race Conditions with Cached Resources

**Problem:** Using `useEffect` to reset state when props change causes race conditions with cached images or other onLoad events. When a component is unmounted and remounted rapidly (e.g., reopening PlaceContent), the state reset and onLoad events may execute out of order, leaving the component in a loading state.

```typescript
// WRONG - State reset may happen after onLoad events fire
useEffect(() => {
  setCurrImg(0);  // Reset happens asynchronously
  setDisplayImages(img);
}, [img]);

// Later, when images load:
const handleImageLoad = () => {
  setLoadedImages(prev => new Set([...prev, src])); // May fire before state reset
};
```

**Solution:** Use key-based remounting to force React to create a new component instance, automatically resetting all internal state.

```typescript
// CORRECT - Component remounts, all state reset automatically
<ImageCarousel key={data.id} img={data.images} />

// This triggers a fresh component with:
// - Fresh state (currImg = 0, loadedImages = new Set())
// - Fresh event listeners
// - No state/onLoad timing conflicts
```

**Benefits:**
- Eliminates race conditions between state resets and event handlers
- Cleaner code (no manual state reset logic needed)
- React handles unmount/mount lifecycle properly
- Works reliably with cached resources (images, videos, etc.)

**When to use:**
- Component needs full reset when parent data changes
- Component has async resource loading (images, fonts, etc.)
- Prop changes should trigger fresh component initialization

**Files:** `src/components/PlaceContent/ImageCarousel.tsx`

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
// src/components/StatsBar/index.ts
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
| Styling | `cn()` utility exists | Import from `@/utils` |
| Icons | Use react-icons | Import from `react-icons/*` (fa, hi, md, si, tb, fi) |
| i18n | 4 locales required | en, ko, ja, nl |
| Git | Pre-commit hooks run tests | Ensure tests pass before commit |

---

## Recent Feature Development

### Completed Work

**Issue #136: MUI → react-icons Migration (2026-01-19)**
- Replaced Material-UI icons with react-icons library
- Removed: @mui/material, @mui/icons-material, @emotion/*, simple-icons, lucide-react
- Icon sets used: fa (Font Awesome), hi (Heroicons), md (Material Design), si (Simple Icons), tb (Tabler), fi (Feather)
- Example: `import { FaMap } from 'react-icons/fa'`, `import { HiSparkles } from 'react-icons/hi'`

**Animation Enhancements (2026-01-20)**
- Created `useScrollReveal` hook: Intersection Observer-based scroll reveal with accessibility support
- Created `useCountUp` hook: Counter animation with easing functions and value formatting
- Enhanced `FadeIn` component: Added scrollTrigger, direction, duration, delay props
- Enhanced `StatsBar` component: Added animateOnScroll, animationDuration, staggerDelay props
- Added `window.matchMedia` mock to jest.setup.ts for responsive component testing
- Pattern: Scroll-based animations for progressive disclosure on about page

**Issue #142: ImageCarousel Persistent Loading Bug (2026-01-26)**
- Fixed: Loading spinner persisting when reopening PlaceContent
- Root cause: useEffect state reset race condition with cached image onLoad events
- Solution: Implemented key-based remounting (`key={data.id}`) instead of manual state reset
- Added pattern documentation: useEffect State Reset Race Conditions with Cached Resources

**Issue #141: i18n CDN Fallback (2026-01-26)**
- Fixed: Network failures skipping locale-specific fallback in CDN translation loading
- Root cause: Single try-catch didn't attempt English fallback on network error
- Solution: Nested try-catch blocks (locale → English → default)
- Added pattern documentation: i18n CDN Fallback Chain

### Pending Work

**Issue #134: Must Try Property**
- Feature: Add "Must Try" flag to food heritage items
- Scope: Database model update, filter UI, visual indicator

**Issue #135: Keyboard Accessibility for Heritage Card**
- Feature: Enable keyboard navigation and interaction for Heritage Cards
- Focus: Tab navigation, Enter/Space activation, ARIA attributes
- Scope: CardContainer component and related interactive elements

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
