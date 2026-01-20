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

*Last updated: 2026-01-19*
