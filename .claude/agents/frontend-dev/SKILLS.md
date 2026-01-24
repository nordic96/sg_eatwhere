# Frontend Developer - Skills & Learnings (SG EatWhere)

> **Purpose:** Project-specific patterns, session learnings, and automation opportunities for the SG EatWhere codebase.
>
> **Global Skills:** Universal patterns have been extracted to `~/.claude/skills/frontend-dev/SKILL.md`. See that file for:
> - React 19 Activity vs Conditional Rendering
> - Lazy Initialization for Heavy Resources
> - Singleton Factory with Lazy Init
> - Timer Cleanup with useRef
> - Scroll Reveal Hook Pattern
> - Animated Counter with Easing
> - Jest Browser API Mocks
> - Tailwind JIT Dynamic Class Anti-Pattern
> - react-icons as MUI Alternative

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
> - Scroll-Based Animation Patterns (useScrollReveal, useCountUp, FadeIn)

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
   - Consolidated into [CLAUDE.md](../../CLAUDE.md#performance-patterns)
   - Content covers: conditional rendering vs Activity components, lazy init patterns, dynamic imports
   - See section: "Performance Patterns"

2. **Debugging Guide**
   - Proposed future document: `/.claude/DEBUG_GUIDE.md`
   - Would cover: Network tab analysis, console logging strategies, DevTools Performance tab
   - Related: See [CLAUDE.md](../../CLAUDE.md#common-pitfalls--lessons-learned) for debugging patterns discovered

3. **Add to Code Review Checklist**
   - Check for eager initialization in constructors
   - Verify conditional rendering used correctly
   - Look for module-level resource loads
   - Monitor bundle size changes
   - Reference: [CLAUDE.md](../../CLAUDE.md#common-gotchas-in-this-codebase)

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

---

## Session Learnings - 2026-01-19

### Project Organization Patterns

- **Pattern:** Agent Directory Restructuring
  - **Context:** Moved agents from flat files to hierarchical subdirectories (`.claude/agents/{agent-name}/`)
  - **Structure:** Each agent now has:
    - `agent-name.md` (definition, capabilities, instructions)
    - `SKILLS.md` (learnings, patterns, debugging insights)
  - **Benefits:**
    - Clearer separation of concerns (definition vs. learnings)
    - Easier to scale with multiple agents
    - Reduces cognitive load in CLAUDE.md (main project context)
    - Allows agents to specialize knowledge independently

### Documentation Consolidation Insights

- **Pattern:** Merging Scattered Documentation into Central Context
  - **What was consolidated into CLAUDE.md:**
    - Global SKILLS.md (general learnings)
    - UI_UX_CONTEXT.md (design system reference)
    - ABOUT_PAGE_UX_PROPOSAL.md (design recommendations)
    - README.md (project overview)
  - **Result:** Single source of truth for project-wide context
  - **Key files now reference:** CLAUDE.md as primary context, agent-specific SKILLS.md for specialized knowledge
  - **Prevention:** Avoid scattered documentation by consolidating early
  - **Lesson:** Use CLAUDE.md for context that affects all agents, SKILLS.md for agent-specific learnings

### GitHub Issue Management Best Practices

- **Pattern:** Epic-Based Feature Tracking
  - **Used:** Issue #31 converted to epic for "New" property feature
  - **Child issues created:**
    - #134: "Must Try" boolean property implementation
    - #135: Keyboard accessibility (arrow keys, Escape to close)
    - #136: Icon library migration (MUI → lighter alternative)
  - **Benefit:** Clear feature breakdown prevents scope creep, tracks dependencies

### Cleanup & Configuration Management

- **Action:** Removed obsolete screenshot-script.js
  - **Reason:** MCP servers (Playwright) provide browser automation
  - **Lesson:** Don't maintain standalone scripts when MCP tools are available
  - **Context:** See CLAUDE.md section on MCP Server Usage

- **Action:** Updated settings.local.json
  - **Removed:** Obsolete script execution permissions
  - **Pattern:** Keep config minimal, remove unused settings to reduce confusion

---

---

## Automation Opportunities - 2026-01-19

### Session Work Analysis

This session covered three distinct high-volume workflows that revealed significant automation opportunities:

1. **GitHub Issue Management** - Created/edited multiple related issues with consistent structure
2. **Dependency Migration** - Audited and migrated 24+ files from MUI Icons to react-icons
3. **Documentation Consolidation** - Merged multiple documents into single sources

### Potential Slash Commands

#### `/migrate-library {oldLib} {newLib} {fileType?}`
- **Purpose:** Bulk library replacement across codebase with pattern mapping
- **Trigger:** When replacing a dependency library with another (e.g., MUI icons → react-icons)
- **Complexity:** High
- **Steps:**
  1. Create import mapping table (old imports → new imports)
  2. Find all files using old library (`grep` for import statements)
  3. Generate migration diffs with before/after
  4. Apply replacements with option to review each file
  5. Update tests if affected
  6. Suggest package.json changes (remove/add)
- **Example:** Icon library migration migrated 24 files with consistent search-replace patterns
- **Benefit:** What took 2+ hours manual work could be done in 10 minutes with verification

#### `/create-epic-with-children {epic-name} {childTasks: string[]}`
- **Purpose:** Create parent issue and child issues with consistent formatting
- **Trigger:** When breaking down a feature into multiple independent tasks
- **Complexity:** Low
- **Preconditions:**
  - Epic title and description
  - List of child task names
  - Optional: acceptance criteria template
- **Steps:**
  1. Create parent issue with epic label
  2. Generate child issues with links to parent
  3. Apply consistent labels and formatting
  4. Return issue URLs for reference
- **Example:** Feature #31 split into #134, #135, #136 with clear relationships
- **Benefits:**
  - Consistent formatting across all issues
  - Prevents forgotten subtasks
  - Parent-child relationships established automatically

#### `/consolidate-docs {sourceFiles: string[]} {outputFile: string}`
- **Purpose:** Merge multiple documentation files into single source with TOC and cross-references
- **Trigger:** When documentation becomes scattered (e.g., multiple context files, design docs)
- **Complexity:** Medium
- **Steps:**
  1. Read all source files
  2. Identify common sections and deduplication opportunities
  3. Create unified structure with table of contents
  4. Generate cross-references and index
  5. Output merged document
  6. Suggest deletion of now-obsolete files
- **Example:** Consolidated SKILLS.md + UI_UX_CONTEXT.md + ABOUT_PAGE_UX_PROPOSAL.md into CLAUDE.md
- **Benefit:** Reduces cognitive load, single source of truth, easier maintenance

#### `/audit-imports {oldPattern} {showOccurrences?}`
- **Purpose:** Find all uses of a library/import pattern before migration
- **Trigger:** Before starting any library replacement or cleanup
- **Complexity:** Low
- **Output:** Grouped results by file with line numbers and context
- **Example:** Audited all `@mui/icons-material` imports to understand migration scope (24 files affected)
- **Benefit:** Catches all occurrences, prevents partial migrations

### Workflow Improvements

#### Icon/Dependency Migration Workflow
- **Current:**
  1. Manually search for old import statements
  2. Create mapping table by hand
  3. Replace each file individually
  4. Update test mocks
  5. Update package.json
  6. Manual verification of build
  - **Time:** 2+ hours per migration

- **Proposed:**
  1. Run `/audit-imports @mui/icons-material` → Get scope
  2. Run `/migrate-library @mui/icons-material react-icons --mapping-table`
  3. Review generated migration diff
  4. Apply with optional file-by-file verification
  5. Automatic test/package.json update suggestion
  - **Time:** ~15 minutes total

- **Benefit:**
  - Reduces manual work by 87%
  - Eliminates missed occurrences
  - Consistent replacement patterns
  - Automated testing integration

#### GitHub Issue Planning Workflow
- **Current:**
  1. Create initial issue (#31)
  2. Manually create 3-5 child issues with consistent structure
  3. Update labels and descriptions individually
  4. Link issues manually
  - **Time:** 15-20 minutes

- **Proposed:**
  1. Run `/create-epic-with-children "New Property Feature" ["Must Try boolean", "Keyboard nav", "Icon migration"]`
  2. Command generates all issues with proper structure
  3. Cross-links established automatically
  - **Time:** 2-3 minutes

- **Benefit:**
  - Consistent formatting across all issues
  - No forgotten subtasks
  - Parent-child relationships correct from start

#### Documentation Maintenance Workflow
- **Current:**
  1. Scatter learnings across multiple .md files
  2. Update references manually when consolidating
  3. Find obsolete files to delete
  4. Update links in codebase
  - **Time:** 30-45 minutes for consolidation

- **Proposed:**
  1. Maintain living SKILLS.md and CLAUDE.md
  2. Run `/consolidate-docs` when documentation gets scattered
  3. Automatic cross-reference generation
  4. Automatic obsolete file detection
  - **Time:** 5-10 minutes

- **Benefit:**
  - Single source of truth maintained
  - Automatic duplicate detection
  - Prevents stale documentation

### Agent Ideas

#### Dependency Audit Agent
- **Specialization:** Library migrations, dependency cleanup, version upgrades
- **Key Capabilities:**
  - Scan codebase for library usage patterns
  - Create import mapping tables
  - Execute bulk replacements with verification
  - Detect breaking changes
  - Update package.json automatically
  - Run tests post-migration
- **Tools Needed:**
  - Grep/glob for pattern discovery
  - AST parsing for accurate import detection
  - Git diff generation for review
  - Test execution capability
- **Trigger:** When planning library upgrade or replacement
- **Example Workflow:**
  ```
  1. Initialize with old library & new library
  2. Agent scans codebase for all usages
  3. Creates comprehensive migration guide
  4. Applies replacements with confidence levels
  5. Runs tests to verify
  6. Suggests cleanup (remove old packages, add new)
  ```

#### Issue Management Agent
- **Specialization:** GitHub issue creation, epic management, feature planning
- **Key Capabilities:**
  - Create parent issues with epic label
  - Generate consistent child issues
  - Apply labels automatically
  - Link issues hierarchically
  - Generate release notes from issues
  - Detect duplicate/overlapping issues
- **Tools Needed:**
  - GitHub API integration
  - Template system for consistent formatting
  - Cross-linking engine
- **Trigger:** When creating features or planning sprints
- **Example:** `/create-epic-with-children` command

#### Documentation Consolidation Agent
- **Specialization:** Finding scattered docs, consolidating, detecting obsolete content
- **Key Capabilities:**
  - Find related documentation files
  - Detect duplicate content across files
  - Merge with intelligent deduplication
  - Generate table of contents
  - Create cross-reference indexes
  - Detect orphaned sections
  - Suggest files for deletion
- **Tools Needed:**
  - File content similarity detection
  - Cross-reference generation
  - Markdown AST manipulation
- **Trigger:** When documentation becomes scattered or after consolidation work
- **Example:** Consolidate 4 related docs into single CLAUDE.md section

### Patterns for Implementation

#### Import Mapping Pattern
```typescript
// Pattern used in icon migration (MUI → react-icons)
const importMappings = {
  '@mui/icons-material/AutoAwesome': 'react-icons/hi:HiSparkles',
  '@mui/icons-material/Close': 'react-icons/fa6:FaX',
  '@mui/icons-material/Check': 'react-icons/fa:FaCheck',
  '@mui/icons-material/GitHub': 'react-icons/fa:FaGithub',
  '@mui/icons-material/Map': 'react-icons/fa:FaMap',
  // Icon sets: fa (FontAwesome), hi (Heroicons), md (Material), si (Simple), tb (Tabler), fi (Feather)
};

// Could be generated by `/migrate-library` command
// and verified before application
```

#### Epic Issue Template
```markdown
# [Feature Name] - Epic

## Description
[Feature overview]

## Subtasks
- [ ] Task 1 (#child-issue-num)
- [ ] Task 2 (#child-issue-num)
- [ ] Task 3 (#child-issue-num)

## Acceptance Criteria
- [ ] All subtasks completed
- [ ] Tests passing
- [ ] Documentation updated
```

#### Migration Verification Checklist
```markdown
## Pre-Migration
- [ ] Audit all usages with `/audit-imports`
- [ ] Create import mapping table
- [ ] Backup current state (git commit)

## Migration
- [ ] Apply replacements
- [ ] Update test mocks
- [ ] Update package.json
- [ ] Run full test suite

## Verification
- [ ] Build succeeds
- [ ] All tests passing
- [ ] Runtime verification on affected pages
- [ ] Code review for any edge cases
```

### High-Value, Low-Effort Quick Wins

1. **Create `/audit-imports` command**
   - Effort: 1-2 hours
   - Value: Catches all occurrences, prevents partial migrations
   - Reusable: For any future library replacements

2. **Create `/create-epic-with-children` command**
   - Effort: 2-3 hours
   - Value: Consistent issue formatting, prevents forgotten tasks
   - Reusable: Every feature planning session

3. **Create import mapping template**
   - Effort: 30 minutes
   - Value: Standardizes migration planning
   - Reusable: Reference for all library migrations

4. **Add migration verification script**
   - Effort: 1 hour
   - Value: Prevents missed files, ensures completeness
   - Reusable: All future migrations

### Testing Opportunities for Migrated Code

Since the icon migration affected 24 files, ensure tests cover:

1. **Import path correctness**
   - Verify old imports completely removed
   - Verify new imports used consistently

2. **Visual regression testing**
   - Icons render in all components
   - Styling/sizing preserved

3. **Component functionality**
   - Affected components still work
   - Props still accepted

4. **Bundle impact**
   - Bundle size reduction verified
   - No new dependencies introduced

### Lessons for Future Sessions

1. **Before large migrations:** Create a command template to automate 80% of work
2. **When creating multiple related issues:** Use a batch creation tool
3. **When consolidating docs:** Use a consolidation command to prevent missed references
4. **Pattern library:** Build reusable patterns as generic commands

---

---

## Session Learnings - 2026-01-20

### Mistakes & Fixes

- **Issue:** Jest tests failed with "window.matchMedia is not a function"
  - **Root Cause:** The `useScrollReveal` hook uses Intersection Observer API which depends on `window.matchMedia` being available, but Jest/jsdom doesn't provide this mock by default
  - **Fix:** Added `window.matchMedia` mock to `jest.setup.ts`:
    ```typescript
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
  - **Prevention:** When adding new hooks that depend on browser APIs (IntersectionObserver, ResizeObserver, matchMedia), immediately add Jest mocks to `jest.setup.ts`

- **Issue:** Memory leak in `useScrollReveal` hook - timeout wasn't cleaned up
  - **Root Cause:** Used `setTimeout` for initialization delay but didn't store the timeout ID to clean it up in useEffect cleanup function
  - **Fix:** Added `useRef` to store timeout ID and clear it in cleanup:
    ```typescript
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      timeoutRef.current = setTimeout(() => {
        // initialization code
      }, 100);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);
    ```
  - **Prevention:** Any async operations in hooks must be cleaned up - use useRef for timers, AbortController for fetch calls, store subscription cleanup functions

- **Issue:** Tailwind JIT compiler couldn't detect dynamic class names like `duration-${duration}`
  - **Root Cause:** Attempted to use dynamic Tailwind classes with template literals in component props, but Tailwind's JIT compiler scans static strings at build time and can't detect dynamic class combinations
  - **Fix:** Removed dynamic duration class, used hardcoded Tailwind class instead or used inline styles for the duration value
  - **Prevention:** Never use template literals to generate Tailwind class names. For dynamic values, either:
    1. Use a fixed set of predefined classes and select from them: `classMap[duration]`
    2. Use inline styles for dynamic values: `<div style={{ transitionDuration: `${duration}ms` }}>`
    3. Use CSS variables with Tailwind: `<div className="duration-500" style={{ '--duration': duration + 'ms' }}>`

### Patterns Discovered

- **Pattern:** Intersection Observer-based Scroll Reveal Hook
  - **Context:** Animate elements when they scroll into view on About page
  - **Implementation:** `useScrollReveal` hook that:
    1. Takes a ref and optional config (threshold, rootMargin, delay)
    2. Creates IntersectionObserver on mount
    3. Sets visible state when element enters viewport
    4. Cleans up observer on unmount
  - **Usage:**
    ```typescript
    const ref = useRef(null);
    const isVisible = useScrollReveal(ref, { delay: 200 });
    return <div ref={ref} className={isVisible ? 'animate-in' : 'opacity-0'} />;
    ```
  - **Key detail:** IntersectionObserver is more efficient than scroll event listeners - it's hardware-accelerated and doesn't block main thread

- **Pattern:** Animated Number Counter Hook
  - **Context:** Count up stats numbers on About page when visible
  - **Implementation:** `useCountUp` hook that:
    1. Takes start, end, duration, and easing function
    2. Uses `requestAnimationFrame` for smooth 60fps animation
    3. Applies easing functions (easeOutQuad, easeInOutCubic, etc.)
    4. Triggers based on external `isVisible` signal
    5. Returns animated value for rendering
  - **Usage:**
    ```typescript
    const count = useCountUp(0, 2024, 2000, easeOutQuad, isVisible);
    return <span>{Math.floor(count)}</span>;
    ```
  - **Easing functions:** Created reusable easing helpers:
    ```typescript
    const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    ```

- **Pattern:** Enhanced FadeIn Component with Scroll Triggers
  - **Context:** Reusable animation wrapper component for scroll-based reveals
  - **Implementation:** Extended existing `FadeIn` component with props:
    - `scrollTrigger?: boolean` - Enable scroll reveal animation
    - `direction?: 'up' | 'down' | 'left' | 'right'` - Slide direction before fade in
    - `delay?: number` - Delay in milliseconds
  - **Usage:**
    ```typescript
    <FadeIn scrollTrigger direction="up" delay={200}>
      <div>Content animates up then fades in on scroll</div>
    </FadeIn>
    ```
  - **Benefits:** Declarative API, reusable across pages, cleaner than hook-based approach for complex animations

### Debugging Wins

- **Problem:** Jest tests failing after adding scroll reveal hooks to About page
  - **Approach:**
    1. Ran jest to see error: "window.matchMedia is not a function"
    2. Searched for where useScrollReveal was used (About page components)
    3. Traced execution backward to find that IntersectionObserver depends on matchMedia
    4. Added mock to jest.setup.ts
  - **Tool/Technique:** Error stack trace pointed directly to the missing mock - just needed to add it

- **Problem:** Memory leak warnings in tests due to cleanup not happening
  - **Approach:**
    1. Noticed "act" warnings when unmounting components in tests
    2. Checked useScrollReveal implementation and found missing cleanup
    3. Added timeoutRef to track and clear timeout on unmount
    4. Verified warnings disappeared after running tests again
  - **Tool/Technique:** React's console warnings about incomplete state updates guide toward cleanup issues

### Performance Notes

- **Scroll Animation Efficiency:** Intersection Observer is far more efficient than scroll event listeners
  - No main thread blocking from repeated calculations
  - Browser can optimize reflows/repaints
  - Multiple observers share same internal detection mechanism

- **RequestAnimationFrame for Animations:** Counter animations use rAF for smooth 60fps updates
  - Syncs with browser's repaint cycle
  - Automatically paused when tab is not visible
  - Prevents jank from JavaScript execution on main thread

- **Easing Functions:** Pre-calculated easing values (not animated) provide smooth curves
  - Math-based easing (quadratic, cubic) cheaper than CSS animations
  - Can be reused across multiple animations
  - Easy to test vs visual animations

---

---

## Automation Opportunities - 2026-01-20

### Session Overview

This session involved high-volume GitHub workflows including:
1. Issue checkout and branch management
2. PR review comment fetching and issue resolution
3. Common Jest mock patterns discovered
4. Documentation updates

### Potential Slash Commands

#### `/fetch-pr-comments {prNumber}`
- **Purpose:** Fetch all comments from a GitHub PR and summarize feedback
- **Trigger:** When starting work on PR review fixes
- **Complexity:** Low
- **Steps:**
  1. Query GitHub API for PR comments
  2. Extract "must fix" items vs optional suggestions
  3. Group by component/file affected
  4. Return prioritized list of issues
- **Benefit:** Saves 5-10 minutes of manual GitHub UI navigation, creates structured list for implementation
- **Example Workflow:**
  ```
  User: "Work on PR #127"
  /fetch-pr-comments 127
  → Returns: [{ component: "SearchBar", issue: "memory leak in useEffect", priority: "must fix" }, ...]
  ```

#### `/add-jest-mock {apiName} {mockType?}`
- **Purpose:** Quickly add common browser API mocks to jest.setup.ts
- **Trigger:** When tests fail with "X is not a function" for browser APIs
- **Complexity:** Low
- **Pre-built mocks:**
  - `window.matchMedia` (for media queries, IntersectionObserver)
  - `window.ResizeObserver` (for element resize detection)
  - `window.IntersectionObserver` (for scroll reveal, lazy loading)
  - `localStorage` / `sessionStorage` (for session state)
  - `fetch` (with configurable response)
- **Example:**
  ```
  /add-jest-mock matchMedia
  → Adds complete mock to jest.setup.ts with all required properties
  ```
- **Benefit:** Eliminates manual mock copying, standardizes mock implementations

#### `/run-pr-checks {branch}`
- **Purpose:** Execute full check suite before pushing (lint, test, build)
- **Trigger:** Before committing to avoid pushing broken code
- **Complexity:** Low
- **Steps:**
  1. Run `npm run lint:fix` with auto-fix enabled
  2. Run `npm run test` for all affected files
  3. Run `npm run build` with production flags
  4. Report pass/fail with specific errors
- **Benefit:** Prevents pushing broken code, reduces CI/CD failure cycles
- **Time saved:** ~3 minutes per push (avoid failed PR checks)

#### `/cleanup-branch {branch}`
- **Purpose:** Clean up local branch after PR merge
- **Trigger:** After PR is merged to main
- **Complexity:** Low
- **Steps:**
  1. Delete local branch
  2. Delete remote branch
  3. Switch back to main
  4. Fetch latest from remote
- **Benefit:** Prevents accumulating dead branches

### Workflow Improvements

#### GitHub Issue → Implementation → PR Workflow
- **Current:**
  1. Read GitHub issue manually
  2. Manually checkout branch (`git checkout -b feature-name`)
  3. Implement changes
  4. Manually test changes
  5. Commit with custom message
  6. Push to remote
  7. Create PR manually (with copy-pasted description)
  - **Time:** 20-30 minutes (including manual UI navigation)
  - **Friction:** Copy-pasting issue details, branch naming decisions

- **Proposed:**
  1. `/start-issue {issueNumber}` → Auto-creates branch, fetches requirements
  2. Implement changes
  3. `/pr-ready {issueNumber}` → Runs checks, commits, pushes, creates PR
  4. Agent fetches PR comments on request
  5. `/apply-pr-fixes` → Applies fixes, runs tests, pushes updates
  - **Time:** ~10-15 minutes
  - **Benefit:** Automation handles repetitive parts, fewer manual decisions

#### Jest Mock Discovery & Application
- **Current:**
  1. Test fails with "window.X is not a function"
  2. Manually search for example mocks in codebase
  3. Copy mock implementation
  4. Add to jest.setup.ts
  5. Run tests again
  - **Time:** 5-10 minutes per missing mock
  - **Issue:** Mocks might be incomplete or use outdated patterns

- **Proposed:**
  1. Test fails
  2. Run `/add-jest-mock {apiName}` → Auto-adds to jest.setup.ts
  3. Run tests immediately
  - **Time:** 1-2 minutes
  - **Benefit:** Standardized, complete mocks; no searching required

#### PR Review Fix Application
- **Current:**
  1. Open GitHub PR page
  2. Manually read through comments
  3. Extract issues into mental list
  4. Navigate to files to fix
  5. Apply fixes without clear priority
  6. Commit and push
  - **Time:** 15-20 minutes
  - **Error risk:** Might miss issues, apply fixes in inefficient order

- **Proposed:**
  1. `/fetch-pr-comments {prNumber}` → Get prioritized list
  2. `/pr-review-fix` → Agent auto-implements common fixes (memory leaks, missing deps, etc.)
  3. Manual review of complex issues
  4. Run `/run-pr-checks` before push
  - **Time:** 5-10 minutes
  - **Benefit:** Structured approach, catches common patterns

### Agent Ideas

#### GitHub Workflow Agent
- **Specialization:** Streamline GitHub issue → implementation → PR workflow
- **Key Capabilities:**
  - Fetch and parse GitHub issue requirements
  - Create feature branches with consistent naming
  - Fetch PR comments and summarize feedback
  - Auto-commit with semantic messages
  - Create PRs with auto-populated descriptions
  - Detect and apply common PR fixes (memory leaks, missing dependencies)
- **Tools Needed:**
  - GitHub API integration
  - Git command execution
  - PR comment parsing/analysis
  - Semantic commit message templates
- **Trigger:** When working on GitHub issues or reviewing PRs
- **Workflow Example:**
  ```
  1. /start-issue #121 → Creates branch feat/121-must-try-property
  2. [User implements changes]
  3. /pr-ready → Runs checks, commits, pushes, creates PR
  4. /fetch-pr-comments 127 → Returns prioritized list of feedback
  5. /apply-pr-fixes → Auto-fixes common patterns
  ```

#### Jest Mock Manager Agent
- **Specialization:** Manage and apply browser API mocks automatically
- **Key Capabilities:**
  - Detect missing browser API mocks from test failures
  - Apply standardized mock implementations
  - Suggest additional mocks for new features
  - Test mock completeness
  - Version track mock implementations
- **Tools Needed:**
  - Jest error parsing
  - Mock template library
  - Test execution and result analysis
- **Trigger:** When adding new hooks or features that use browser APIs
- **Example Mocks Library:**
  ```typescript
  - matchMedia (media queries)
  - IntersectionObserver (scroll reveal)
  - ResizeObserver (element resize)
  - localStorage/sessionStorage (storage)
  - fetch (network requests)
  - requestAnimationFrame (animations)
  - AudioContext (audio)
  - WebGL context (3D rendering)
  ```

### Code Patterns for Automation Rules

#### Jest Mock Template Pattern
```typescript
// Standard mock structure to detect and apply
Object.defineProperty(window, 'apiName', {
  writable: true,
  value: jest.fn().mockImplementation(args => ({
    // Required methods/properties
    method1: jest.fn(),
    method2: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
});
```

#### Memory Leak Pattern in Hooks
```typescript
// ANTI-PATTERN - No cleanup for async operations
useEffect(() => {
  setTimeout(() => {
    setState(value); // Memory leak if component unmounts
  }, delay);
}, []);

// CORRECT - Cleanup with ref storage
const timeoutRef = useRef<NodeJS.Timeout | null>(null);
useEffect(() => {
  timeoutRef.current = setTimeout(() => {
    setState(value);
  }, delay);
  return () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
}, []);
```

**Automation Rule:** Flag `setTimeout`/`setInterval` in useEffect without cleanup ref

#### Dynamic Tailwind Classes Anti-Pattern
```typescript
// ANTI-PATTERN - JIT compiler can't detect dynamic classes
<div className={`duration-${duration}`} />

// CORRECT - Use fixed predefined classes or inline styles
<div style={{ transitionDuration: `${duration}ms` }} />

// Or use classMap pattern
const durationMap = { fast: 'duration-200', slow: 'duration-500' };
<div className={durationMap[speed]} />
```

**Automation Rule:** Flag template literal class names, suggest alternatives

### High-Value, Low-Effort Quick Wins

1. **Create `/add-jest-mock` command**
   - Effort: 1-2 hours
   - Value: Saves 5-10 minutes per test failure with browser API
   - Reusable: Every time new hooks are added
   - Maintenance: Update templates as new patterns emerge

2. **Create `/run-pr-checks` command**
   - Effort: 1 hour
   - Value: Prevents broken pushes, catches lint/test errors early
   - Reusable: Before every commit
   - Maintenance: Minimal

3. **Create `/fetch-pr-comments` command**
   - Effort: 1-2 hours
   - Value: Structured PR review feedback, saves navigation time
   - Reusable: Every PR review cycle
   - Maintenance: None (uses GitHub API)

4. **Establish Jest Mock Standard Library**
   - Effort: 30 minutes
   - Value: Reusable templates for 10+ common APIs
   - Maintenance: Update as new browser APIs needed
   - Reference:** Create `.claude/jest-mocks-template.ts` with standard implementations

### Testing Opportunities for New Hooks

When adding hooks that use browser APIs:

1. **Add test for hook initialization**
   - Verify no errors on mount
   - Check required mocks are in place

2. **Add test for hook cleanup**
   - Verify timers are cleared
   - Check event listeners are removed
   - Verify no memory leaks on unmount

3. **Add test for hook with Activity/Suspense boundary**
   - Hook behavior inside boundary
   - Check proper unmounting

### Lessons for Future Sessions

1. **Before writing hook tests:** Check jest.setup.ts for required mocks
2. **When test fails with "X is not a function":** Use browser API mock library, don't create custom mocks
3. **With PR review feedback:** Fetch all comments first to understand full scope
4. **Before pushing:** Always run `/run-pr-checks` to catch issues early
5. **Repetitive tasks:** Consider adding to slash command library

### Common Jest Mock Scenarios

| API | Mock Added | When Used | Example |
|-----|-----------|-----------|---------|
| `matchMedia` | Session 2026-01-20 | useScrollReveal, media queries | Intersection Observer dependencies |
| `IntersectionObserver` | Needed | Scroll reveal effects | About page animations |
| `ResizeObserver` | Needed | Element resize detection | Responsive hooks |
| `localStorage` | Not yet | Session state persistence | User preferences |
| `fetch` | Not yet | Network requests | Search, data loading |

---

*Last updated: 2026-01-20*
