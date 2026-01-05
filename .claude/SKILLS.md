# Developer Skills & Lessons Learned

> **Purpose:** Document key lessons, mistakes, and best practices learned while working on this codebase to avoid repeating errors in future tasks.

---

## Critical Lessons

### 1. MCP Servers vs Direct Package Installation

**Problem:** Installing Playwright or other MCP-provided tools directly via npm.

```bash
# WRONG - Pollutes package.json and doesn't use MCP properly
npm install playwright
npm install --save-dev playwright
```

**Solution:** Use MCP tools provided by Claude Code. MCP servers are configured in `.claude/mcp.json`.

```
# CORRECT - Use MCP-provided tools
mcp__playwright__browser_navigate  - Navigate to URL
mcp__playwright__browser_screenshot - Capture screenshot
mcp__playwright__browser_resize    - Change viewport size
```

**Why this matters:**
- MCP servers run in isolated environments
- No modification to project's `package.json`
- Consistent tooling across all agents
- Automatically managed by Claude Code

---

### 2. React Import Errors - `Activity` Component

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

---

### 3. useTransition Timing with Index Reset

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

---

### 4. Testing Components with Loading States

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

---

### 5. File Paths with Special Characters in Shell

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

---

### 6. Jest Test Path Pattern Deprecation

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

---

## Best Practices Established

### Component Structure

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

### Styling Patterns

1. **Use `cn()` utility** for conditional class merging
2. **Tailwind responsive classes:** `grid-cols-2 md:flex md:flex-row`
3. **Hover states:** `transition-all duration-200 hover:scale-110`
4. **Focus states:** `focus-visible:ring-2 focus-visible:ring-primary`

### Testing Patterns

1. **Test accessibility:** Check roles, aria-labels
2. **Test styling classes:** Verify Tailwind classes are applied
3. **Test variants:** Cover all prop combinations
4. **Test edge cases:** Empty arrays, single items

### i18n Patterns

1. **Translation keys:** Use descriptive namespaces (`StatsBar.years_label`)
2. **Multiple hooks:** Use separate `useTranslations()` for different namespaces
3. **All locales:** Always update all 4 locale files (en, ko, ja, nl)

---

## Pre-Task Checklist

Before starting any new implementation:

- [ ] Read existing code in the affected files
- [ ] Check for similar components/patterns in the codebase
- [ ] Verify import paths and module existence
- [ ] Plan test cases before implementation
- [ ] Consider responsive design from the start
- [ ] Add i18n support if user-facing text

---

## Common Gotchas in This Codebase

| Area | Gotcha | Solution |
|------|--------|----------|
| Imports | `@/` alias required | Use `@/app/...` not `../` |
| Styling | `cn()` utility exists | Import from `@/app/utils` |
| Tests | MUI icons need mocks | Mocks exist in `__mocks__/@mui/` |
| i18n | 4 locales required | en, ko, ja, nl |
| Git | Pre-commit hooks run tests | Ensure tests pass before commit |

---

*Last updated: January 2026*
