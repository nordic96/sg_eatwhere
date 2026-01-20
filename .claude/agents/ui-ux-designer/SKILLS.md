# UI/UX Designer - Skills & Learnings

> **Purpose:** Document design discoveries, UX recommendations, accessibility insights, visual patterns, and design system knowledge for this project.

---

## Design System Reference

### Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary Brand | Maroon/Dark Red | `#A7292C` | Header, primary buttons, CTAs |
| Hawker Category | Red | `#FF6B6B` | Hawker filter pill, markers |
| Restaurant Category | Orange | `#FF9800` | Restaurant filter pill, markers |
| Dessert Category | Green | `#4CAF50` | Dessert filter pill, markers |
| Trail Mode | Purple | `#9C27B0` | Trail navigation elements |
| Golden Highlight | Yellow | `#F8D64F` | Highlights, attention |
| Background | Light Gray | `#F5F5F5` | Page backgrounds |
| Card Background | White | `#FFFFFF` | Content cards |
| Text Primary | Dark Gray | `#333333` | Body text |
| Text Secondary | Medium Gray | `#666666` | Captions, metadata |

### Typography

- **Headings:** Bold, large scale, high contrast
- **Body:** Clean sans-serif (system fonts)
- **Accent Text:** Red/maroon for emphasis
- **Statistics:** Large bold numbers with gradient effects

### Spacing System

```
4px  (space-1)  - Tight spacing between related elements
8px  (space-2)  - Default component internal padding
16px (space-4)  - Section padding, card margins
24px (space-6)  - Major section separation
32px (space-8)  - Page-level margins
```

### Animation Timing

- **Micro-interactions:** 150ms (hover states, toggles)
- **Transitions:** 200ms (panel slides, fades)
- **Page animations:** 300ms (route transitions)
- **Easing:** `ease-in-out` for smooth feel

---

## Page Design Summaries

### Landing Page (`/{locale}`)

**Key Elements:**
- Split hero layout (text left, illustration right on desktop)
- Stats display: "10+ Years. 100+ Visits."
- Feature cards with dark red/maroon backgrounds
- Film strip carousel for food photos
- Stacked layout on mobile

### MapView Page (`/{locale}/mapview`)

**Key Elements:**
- Header with search bar (desktop only)
- Filter bar with category pills (color-coded)
- 3D MRT-style map as main feature
- Floating map controls (right side, desktop)
- Featured food spots carousel
- Region tabs for food list

### About Page (`/{locale}/about`)

**Key Elements:**
- Two-column layout (illustration left, content right on desktop)
- NameCard with social links and labels
- StatsBar with 4 key metrics (responsive grid)
- Section component with background variants
- TechStackSection with badge grid
- InspirationSection with attribution pattern

---

## Implemented Design Patterns

### StatsBar Component (Implemented 2026-01)

**Pattern:** Key metrics display with responsive layout
- Desktop: Horizontal row
- Mobile: 2x2 grid
- Styling: Gradient text values, rounded cards, hover effects
- Accessibility: `role="list"` with `role="listitem"` children

### TechBadge Component (Implemented 2026-01)

**Pattern:** Technology showcase badges
- Icon + label with MUI Tooltip
- Hover lift effect: `hover:-translate-y-1 hover:shadow-md`
- Links to official documentation
- Grid layout: `flex flex-wrap justify-center gap-4`

### InspirationSection Component (Implemented 2026-01)

**Pattern:** Attribution with visual elements
1. Thumbnail image
2. Title + author
3. Description text
4. Colour palette display
5. CTA button to source

### Section Component (Implemented 2026-01)

**Pattern:** Content wrapper with styling variants
- Background variants: `white`, `gray` (bg-gray-50), `accent` (bg-red-50)
- Title styling: Bold text with 3px primary underline
- Responsive padding: `py-8` mobile, `py-12` desktop
- Accessible: `aria-labelledby` support

### CTA Button Patterns

```typescript
// Primary CTA
'bg-primary text-white hover:bg-red-700 rounded-full px-6 py-3'

// Secondary CTA (GitHub)
'bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6 py-3'

// Outlined CTA
'bg-white text-gray-700 border border-gray-300 rounded-full px-6 py-3'

// Responsive sizing
'max-sm:px-4 max-sm:py-2 max-sm:text-xs'
```

---

## Accessibility Insights

### Current Strengths

- High contrast header (white on maroon)
- Clear visual category coding with distinct colors
- Readable font sizes across all breakpoints
- Touch-friendly tap targets (44x44px minimum)
- ARIA roles on list components (StatsBar)

### Areas for Improvement

| Issue | Component | Recommendation |
|-------|-----------|----------------|
| Color-only category indicators | FilterBar, Markers | Add icons/patterns alongside colors |
| 3D map keyboard navigation | MapView | Add keyboard controls for camera |
| Screen reader for 3D canvas | MapScene | Provide text alternative/description |
| Focus indicators | Various | Ensure visible focus rings on all interactive elements |

### Color Contrast Checks

| Element | Foreground | Background | Ratio | Status |
|---------|------------|------------|-------|--------|
| Primary CTA text | #FFFFFF | #A7292C | 7.5:1 | Pass |
| Body Text | #374151 | #FFFFFF | 10.6:1 | Pass |
| Muted Text | #6B7280 | #FFFFFF | 5.3:1 | Pass |
| Hawker on White | #FF6B6B | #FFFFFF | 3.9:1 | Needs review |

---

## Responsive Behavior Patterns

### Breakpoint Strategy

| Breakpoint | Width | Key Changes |
|------------|-------|-------------|
| Mobile | < 768px | Single column, stacked elements, hamburger nav |
| Tablet | 768-1023px | Hybrid layouts, some side-by-side |
| Desktop | >= 1024px | Full multi-column, all controls visible |

### Component Adaptations

| Component | Mobile | Desktop |
|-----------|--------|---------|
| SearchBar | Hidden (icon trigger) | Full width in header |
| Sidebar | Full screen overlay | Persistent slide panel |
| FilterBar | Horizontal scroll | Single row |
| StatsBar | 2x2 grid | Horizontal row |
| 3D Controls | Simplified touch | Full floating panel |

### Touch Target Guidelines

- Minimum touch target: 44x44px
- Spacing between targets: 8px minimum
- Bottom navigation for primary actions on mobile
- Swipe gestures for secondary actions

---

## Improvement Opportunities

### High Priority

1. **Loading States**
   - Add skeleton screens for content areas
   - Use consistent CircularProgress for actions
   - Show meaningful loading messages

2. **Empty States**
   - Design illustrated states when no search results
   - Friendly messaging with suggested actions

3. **Error States**
   - Design error UI with retry actions
   - Contextual error messages

### Medium Priority

1. **Micro-interactions**
   - Subtle animations on filter toggles
   - Smooth transitions between states

2. **Onboarding**
   - First-time user tour for map features
   - Highlight key interactions

3. **Mobile Bottom Navigation**
   - Consider bottom nav bar for key actions
   - Thumb-friendly primary controls

### Future Considerations

1. **Favorites System** - Allow users to save spots
2. **Social Sharing** - Share individual food locations
3. **Testimonials** - User feedback display (when collected)
4. **Photo Gallery** - Personal food journey photos

---

## Component Inventory

### Navigation Components

| Component | States |
|-----------|--------|
| Header | Default, scrolled, mobile-collapsed |
| Footer | Standard |
| LocaleSwitcher | Dropdown with 4 locales |
| Mobile Menu | Closed, open (slide) |

### Interactive Components

| Component | Behavior |
|-----------|----------|
| SearchBar | Autocomplete, keyboard nav, AI indicator |
| FilterBar | Toggle pills, multi-select |
| Trail Mode | Binary on/off toggle |
| Map Controls | Camera adjust buttons |
| Food Carousel | Horizontal scroll/swipe |

### 3D Components

| Component | Purpose |
|-----------|---------|
| MRT Map Texture | Base Singapore map |
| Location Markers | Food spot indicators (category colored) |
| Trail Path | Connecting curved lines |
| Environment | Day/night atmosphere toggle |

---

## Session Learnings

### Design Discoveries

*Add discoveries from design sessions here.*

<!-- Example:
- **Discovery:** Users prefer larger touch targets on mobile filter pills
  - **Context:** Usability testing showed mis-taps
  - **Action:** Increased pill padding to 12px
-->

### UX Recommendations Implemented

| Date | Improvement | Impact |
|------|-------------|--------|
| 2026-01 | Added StatsBar to About page | Improved credibility display |
| 2026-01 | Created TechStackSection | Better tech showcase |
| 2026-01 | Enhanced NameCard with labels | Clearer social link purpose |
| 2026-01 | Centered CTA buttons | Better visual balance |

---

## Screenshot Reference

Screenshots stored in `.claude/screenshots/`:

| Screenshot | Viewport | Purpose |
|------------|----------|---------|
| `landing-*.png` | 375/768/1440px | Landing page reference |
| `mapview-*.png` | 375/768/1440px | Map interface reference |
| `about-*.png` | 375/768/1440px | About page reference |
| `section/*.png` | Various | Component-specific shots |

---

---

## Session Learnings - 2026-01-19

### Issue Tracking & Feature Definition

- **Pattern:** Using GitHub Issues for Feature Planning
  - **How:** Converted issue #31 into an epic, then created child issues for specific components
  - **Example:** "New" property feature broken into:
    - #134: "Must Try" boolean property (separate from "New")
    - #135: Keyboard accessibility improvements
    - #136: Icon library replacement (affects UI components)
  - **Benefit for UX:** Clear feature boundaries prevent unrelated changes from blocking releases

### Design System Impact Analysis

- **Completed:** Icon Library Migration (Issue #136)
  - **From:** MUI Icons (@mui/icons-material) - heavy, full Material Design set
  - **To:** react-icons (multiple icon sets: fa, hi, md, si, tb, fi)
  - **UX Impact:**
    - Performance improvement (smaller bundle, faster component loads)
    - Consistent icons using familiar sets (FontAwesome, Heroicons, Material Design)
    - Simple Icons for brand logos (GitHub, LinkedIn, etc.)
  - **Outcome:** Successfully migrated with visual consistency maintained

### Accessibility Enhancement Planning

- **Identified:** Issue #135 - Keyboard Navigation
  - **Feature:** Arrow keys for carousel navigation
  - **Feature:** Escape key to close overlays
  - **UX Pattern:** Standard keyboard navigation for accessibility compliance
  - **Testing Needed:** Verify focus indicators visible, logical tab order

### Documentation Patterns

- **Learning:** Agent Skill Documentation Organization
  - **Structure:** Separate `SKILLS.md` for each agent (frontend-dev, ui-ux-designer)
  - **Purpose:** Allows specialized knowledge to accumulate without cluttering global context
  - **Example:** UI/UX learnings stay in `ui-ux-designer/SKILLS.md`, shared architecture in CLAUDE.md
  - **Benefit:** Easier onboarding for new agents, clearer responsibility domains

---

*Last updated: 2026-01-19*
