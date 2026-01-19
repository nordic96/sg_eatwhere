# Frontend Developer - Skills & Learnings

> **Purpose:** Document key lessons, mistakes, debugging patterns, and automation opportunities learned while working on this codebase.

---

## Session Learnings - 2026-01-18

### Mistakes & Fixes

- **Issue:** Landing page loading extremely slow (~50MB HuggingFace semantic model loading on all pages)
  - **Root Cause:** Two compounding issues:
    1. React 19's `<Activity mode={condition}>` component wraps children but **still mounts them** - visibility hiding does not equal conditional rendering
    2. `SemanticSearchClient` constructor called `initWorker()` automatically on instantiation, triggering model download on any page where SearchBar component existed
    3. SearchBar was used in Header.tsx which appears on every page, so model loaded everywhere even when not needed
  - **Fix:**
    1. Replaced `<Activity mode={condition}><SearchBar /></Activity>` with true conditional rendering: `{condition && <SearchBar />}`
    2. Deferred worker initialization in SemanticSearchClient - removed auto-call from constructor, kept lazy initialization via `ensureWorker()` method called only by `generateEmbeddings()`
    3. Result: Model now loads only when SearchBar actually mounts on /mapview with desktop breakpoint
  - **Prevention:**
    - Use true conditional rendering `{condition && <Component />}` instead of visibility-hiding wrappers
    - Never auto-initialize heavy resources in constructors - defer to lazy init patterns
    - Test app with Network throttling to catch unexpected resource loads on unrelated pages
    - Check git diff on bundle/asset changes to verify assets aren't loading unexpectedly

- **Misconception:** Adding `loading.tsx` would prevent component mounting and solve the issue
  - **Why Incorrect:** `loading.tsx` provides Suspense UI fallback but doesn't prevent child components from mounting - it only controls what's shown while async operations complete
  - **Correct Understanding:** Must use conditional rendering in component tree itself to prevent mount, not just suspend rendering

### Patterns Discovered

> **See [CLAUDE.md](../../CLAUDE.md#performance-patterns)** for documented performance patterns including:
> - Lazy WebWorker Initialization
> - React 19 Activity vs Conditional Rendering
> - Singleton Factory with Lazy Initialization

### Debugging Wins

- **Problem:** Landing page taking 5+ seconds to load, Network tab showed 50MB model download despite page not using search
  - **Approach:**
    1. Checked Network tab to identify unexpected large asset
    2. Traced asset URL back to HuggingFace embedding model
    3. Added console logs at component mount to see when SearchBar loads
    4. Found SearchBar mounted on all pages (via Header.tsx)
    5. Traced execution backwards from SearchBar -> useSemanticSearch hook -> getSemanticSearchClient singleton -> constructor auto-init
  - **Tools/Techniques:**
    - Network tab with asset download tracing (crucial for finding unexpected resource loads)
    - Strategic console.log() at component mounts and constructor calls
    - Conditional rendering test: temporarily removed SearchBar to verify impact
    - Git blame to see when `<Activity>` wrapper was added (revealed misunderstanding of component behavior)

- **Problem:** After removing auto-init from constructor, ensuring singleton still worked and model loaded when needed
  - **Approach:**
    1. Verified `getReadyState()` returned false initially
    2. Confirmed `generateEmbeddings()` called `ensureWorker()` before processing
    3. Tested on /mapview that model eventually loaded (not on page load, but on first search attempt)
    4. Confirmed mobile/tablet breakpoints didn't mount SearchBar at all
  - **Tool:** Debug console checking `getReadyState()` during interaction

---

## Automation Opportunities

### Identified Workflows & Patterns

Based on the performance investigation session, several automation opportunities emerged:

### Potential Slash Commands

#### `/diagnose-perf-regression`
- **Purpose:** Automated performance regression detection and root cause analysis
- **Trigger:** After adding new features or dependencies, or when users report slowdowns
- **Complexity:** Medium
- **Steps:**
  1. Run production build and capture bundle size
  2. Use Network tab analysis to identify unexpected large assets
  3. Trace asset URLs back to source code (imports, constructors, module initialization)
  4. Generate report with diffs showing what changed and where resource loads happen
  5. Suggest potential fixes (lazy init, conditional rendering, dynamic imports)
- **Example:** When landing page becomes slow after adding AI search feature, this command would:
  - Identify 50MB HuggingFace model loading
  - Trace to SearchBar component initialization
  - Show it loads on all pages, not just /mapview
  - Suggest fix options

#### `/analyze-eager-init`
- **Purpose:** Scan codebase for eager initialization patterns that could block page load
- **Trigger:** As part of code review for class constructors, module-level code, or singleton factories
- **Complexity:** Low
- **Patterns to detect:**
  - Constructor calls that initialize heavy resources (WebWorkers, model downloads)
  - Module-level singleton instantiation
  - Missing lazy init guards in factory functions
  - Components mounting but hiding with visibility wrappers instead of conditional rendering
- **Output:** List of files with line numbers and suggested fixes

#### `/verify-conditional-rendering`
- **Purpose:** Validate that conditional rendering is used correctly for performance
- **Trigger:** When reviewing component changes that use visibility wrappers or Activity components
- **Complexity:** Low
- **Check for:**
  - `<Activity mode={condition}>` used for performance (incorrect, component still mounts)
  - True conditional rendering `{condition && <Component />}` used correctly
  - Hidden elements that should use conditional rendering instead

### Workflow Improvements

#### Performance Investigation Workflow
- **Current:** Manual process of Network tab inspection -> code tracing -> creating debug logs -> testing fixes
  - User reports slow landing page
  - Developer opens Network tab, finds 50MB download
  - Traces URL back to code
  - Tests multiple hypotheses with code changes
  - Runs build multiple times to verify
- **Proposed:** Semi-automated investigation pipeline
  1. `/diagnose-perf-regression` generates initial report
  2. Developer reviews suggestions from `/analyze-eager-init`
  3. Create fix plan based on command outputs
  4. Ask user which fix option to implement (user still chooses, not automated)
  5. Run single verification build
- **Benefit:**
  - Reduces manual investigation time from 30+ minutes to 5 minutes
  - Catches eager initialization anti-patterns automatically
  - Provides consistent diagnostic approach across team
  - Prevents similar issues in future code reviews

#### Fix Templating for Common Patterns
- **Current:** Custom code changes for each issue (lazy init, conditional rendering, dynamic imports)
- **Proposed:** Command-generated templates for common fixes
  - `/suggest-lazy-init {file} {class-name}` - Generate lazy init pattern template
  - `/fix-conditional-rendering {file} {component-name}` - Convert Activity wrapper to conditional rendering
- **Benefit:** Faster implementation, consistent patterns, reduces copy-paste errors

### Agent Ideas

#### Performance Auditor Agent
- **Specialization:** Proactive performance monitoring and optimization
- **Focus Areas:**
  - Bundle size analysis on each build
  - Automatic network throttle testing to catch hidden resource loads
  - Detection of eager initialization patterns
  - Monitoring of Time to Interactive (TTI) metrics
- **Tools Needed:**
  - Playwright MCP (Network throttling, resource interception)
  - Sequential thinking MCP (for multi-step analysis)
  - Build artifact analysis (bundle size, asset manifest)
- **When to Launch:**
  - Post-build verification
  - Regular performance audits (weekly/on-demand)
  - When feature adds new dependencies or resources

### Code Patterns for Automation Rules

#### Anti-Pattern: Eager Init in Constructor
```typescript
// ANTI-PATTERN - Don't do this
class HeavyService {
  constructor() {
    this.initialize(); // Blocks creation, loads resources immediately
  }
}
```

**Automation Rule:** Scan for `new HeavyService()` at module level or in constructors, flag for review

#### Anti-Pattern: Activity Component for Performance
```typescript
// ANTI-PATTERN - Component still mounts and runs side effects
<Activity mode={isSearchVisible}>
  <SearchBar /> {/* Loads 50MB model even when hidden */}
</Activity>
```

**Automation Rule:** Flag `<Activity mode={...}>` wrapping heavy components, suggest conditional rendering

#### Correct Pattern: Lazy Initialization
```typescript
// CORRECT - Constructor lightweight, init deferred
class HeavyService {
  private resource: Resource | null = null;

  constructor() {
    // Don't initialize here
  }

  private async initialize() {
    if (!this.resource) {
      this.resource = await loadHeavyResource();
    }
  }

  async doWork(data) {
    await this.initialize(); // Lazy trigger
    // Process data...
  }
}
```

**Automation Rule:** Recognize and suggest this pattern when detecting eager init

### Testing Automation Opportunities

#### Network Monitoring Tests
- **Purpose:** Prevent regression of fixed performance issues
- **Example Test:** Verify 50MB model doesn't download on landing page
- **Implementation:**
  ```typescript
  test('landing page does not load HuggingFace model', async () => {
    const page = await browser.newPage();
    const requests: string[] = [];
    page.on('request', r => requests.push(r.url()));

    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    expect(requests).not.toContainEqual(
      expect.stringContaining('huggingface.co')
    );
  });
  ```
- **Value:** Prevents same issue from being reintroduced in future changes

#### Build Size Regression Tests
- **Purpose:** Catch unexpected bundle size increases
- **Threshold:** Alert if bundle grows >5% from baseline
- **Implementation:** Part of CI/CD pre-commit checks

---

## Documentation Improvements Needed

1. **Performance Guidelines Document**
   - When to use conditional rendering vs Activity components
   - Lazy init pattern for heavy resources
   - Dynamic imports for large dependencies
   - Location: `/.claude/PERFORMANCE.md`

2. **Debugging Guide**
   - Using Network tab to trace unexpected resource loads
   - Console logging strategy for tracing mount/init order
   - How to use Chrome DevTools Performance tab
   - Location: `/.claude/DEBUG_GUIDE.md`

3. **Add to Code Review Checklist**
   - Check for eager initialization in constructors
   - Verify conditional rendering used correctly
   - Look for module-level resource loads
   - Monitor bundle size changes

---

## Quick Wins (Low Effort, High Value)

1. **Add Network Throttling Test**
   - Verify landing page loads <5 seconds on 4G
   - Would catch the 50MB model issue immediately
   - Prevents future regressions

2. **Create Performance Regression Alert**
   - Flag bundle size increases >5% in CI
   - Alert when unexpected resources load on wrong pages
   - Catches issues before code review

3. **Document React 19 Activity Component Gotcha**
   - Add explicit note to Component patterns section
   - Show correct vs incorrect usage examples
   - Prevents team members from making same mistake

---

## Related Issues to Investigate

- Check if other heavy resources (3D models, large images) initialize eagerly
- Audit all constructor methods for blocking operations
- Review all singleton factories for lazy init patterns
- Verify all conditional UI uses true conditional rendering, not visibility wrappers

---

## Performance Notes

- **Heavy Model Loading:** ~50MB HuggingFace model download should never block initial page load
  - Use dynamic imports or lazy initialization for AI/ML features
  - Load only on routes/components that actually use them
  - Consider showing `aria-busy="true"` UI state while model loads in background

- **Singleton Anti-Pattern to Avoid:** Creating singleton instance in constructor or module-level code
  - Delays app initialization for all users even if feature isn't used
  - Better: Factory pattern with lazy init on first demand

- **React 19 Activity Component Caveat:** Don't use `<Activity>` as a performance optimization for conditional rendering
  - Component still mounts and consumes resources
  - Only appropriate for UX state (hiding/showing without unmounting)
  - For code-splitting and resource control, use true conditionals or dynamic imports

---

*Last updated: 2026-01-18*
