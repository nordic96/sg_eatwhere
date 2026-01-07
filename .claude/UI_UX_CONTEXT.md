# UI/UX Context Document | The Foodie's Trail SG

> **Generated:** January 2026
> **Purpose:** Comprehensive visual and design reference for UI/UX analysis and development

---

## Table of Contents
1. [Visual Design System](#visual-design-system)
2. [Page Analysis](#page-analysis)
3. [Responsive Behavior](#responsive-behavior)
4. [Component Inventory](#component-inventory)
5. [Design Patterns](#design-patterns)
6. [Accessibility Considerations](#accessibility-considerations)
7. [Improvement Opportunities](#improvement-opportunities)

---

## Visual Design System

### Brand Identity
- **Primary Logo:** "The Foodie's Trail SG" with stylized wave/trail underline
- **Tagline:** Positioned as a personal food discovery platform by a Korean expat
- **Voice:** Warm, personal, authentic ("A Korean who eats like a local")

### Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary Brand | Maroon/Dark Red | `#8B1538` | Header, primary buttons, accents |
| Hawker Category | Red | `#FF6B6B` | Hawker filter pill, markers |
| Restaurant Category | Orange | `#FF9800` | Restaurant filter pill, markers |
| Dessert Category | Green | `#4CAF50` | Dessert filter pill, markers |
| Trail Mode | Purple | `#9C27B0` | Trail navigation elements |
| Background | Light Gray | `#F5F5F5` | Page backgrounds |
| Card Background | White | `#FFFFFF` | Content cards |
| Text Primary | Dark Gray | `#333333` | Body text |
| Text Secondary | Medium Gray | `#666666` | Captions, metadata |

### Typography
- **Headings:** Bold, large scale, high contrast
- **Body:** Clean sans-serif, good readability
- **Accent Text:** Red/maroon for emphasis ("Singapore's real Must Try Food")
- **Statistics:** Large bold numbers ("10+ Years. 100+ Visits.")

### Iconography
- Social icons: GitHub, LinkedIn, Home
- Map controls: Camera, zoom, pan icons
- Navigation: Hamburger menu (mobile), search icon
- Category: Custom colored pills with text labels

---

## Page Analysis

### 1. Landing Page (`/{locale}`)

**Screenshots:** `screenshots/landing-{mobile,tablet,desktop}.png`

#### Hero Section
- **Layout:** Split layout with text left, illustration right (desktop)
- **Illustration:** Colorful Singapore-style ice kachang/shaved ice dessert bowl
- **Key Stats:** "10+ Years. 100+ Visits." - establishes credibility
- **Headline:** "A Korean who eats like a local" - personal connection
- **CTAs:** Two buttons - "Explore Foodie's Trail" (primary) and secondary action

#### Features Section
- **Your Complete Singapore Food Guide Card:**
  - Dark red/maroon background
  - White text with feature list (checkmarks)
  - Lists: 100+ authentic food locations, Sort by food distance, Live track & explore cafe, Hidden gems via interactive map

- **Google Maps Collection Card:**
  - White card with Google Maps icon
  - "Open Collection" CTA button
  - Links to external Google Maps list

#### Food Film Strip
- **Design:** Vintage film strip aesthetic with sprocket holes
- **Content:** Horizontal carousel of food photos
- **Label:** "This is not just a Food List" - emotional positioning
- **Interaction:** Scrollable/swipeable carousel

#### Footer
- **Sections:** Website links, Change Language dropdown, App Version
- **Branding:** Logo repeated with social icons
- **Copyright:** Developer attribution

---

### 2. MapView Page (`/{locale}/mapview`)

**Screenshots:** `screenshots/mapview-{mobile,tablet,desktop}.png`

#### Header Bar
- **Logo:** Left-aligned "The Foodie's Trail SG"
- **Navigation:** MapView, About links
- **Search Bar:** Center (desktop), full-width input with placeholder
- **Language/Login:** Right-aligned controls

#### Notice Banner
- Yellow/cream background alert explaining personal curation
- Dismissible with X button

#### Filter Bar
- **Trail Mode Toggle:** Purple "Trail Mode" pill (leftmost)
- **Category Filters:**
  - Hawker (red background)
  - Restaurants (orange background)
  - Dessert (green background)
- **Additional Controls:** "Starter Stats" toggle, navigation arrows

#### 3D Map Canvas (Main Feature)
- **Visual Style:** Singapore MRT-inspired map with colored transit lines
- **Lines:** Multiple colored routes (red, green, purple, yellow, blue, brown)
- **Markers:** Food location pins scattered across the map
- **Station Names:** Real Singapore locations (Caldecott, Toa Payoh, Novena, etc.)
- **Interactivity:** Pan, zoom, rotate controls
- **Attribution:** OpenStreetMap credit at bottom

#### Map Controls (Desktop)
- Right-side floating panel with:
  - Camera/view controls
  - Zoom in/out
  - Reset view
  - Day/night toggle (environment)

#### Featured Food Spots
- **Layout:** Horizontal scrollable carousel
- **Cards:** Image thumbnails with location name overlay
- **Examples:** "Dona Manis Cake Shop", "Yah Kun Dessert", "99 Old Trees Durian"

#### Explore Collection CTA
- Full-width red banner
- Encourages viewing full list on Google Maps
- "View Full List" button

#### Food List By Region
- **Tabs:** Central Region, East Region, West Region, North Region
- **List Items:** Categorized with colored dots (category indicator)
- **Information:** Restaurant name with category color coding

---

### 3. About Page (`/{locale}/about`)

**Screenshots:** `screenshots/about-{mobile,tablet,desktop}.png`

#### Hero Illustration
- **Style:** Hand-drawn/artistic illustration
- **Subject:** Person (creator) painting a sign that reads "GIHUN KO STEPHEN"
- **Details:** "SOFTWARE ENGINEER FRONTEND", "Web Developer" labels
- **Aesthetic:** Personal, creative, approachable

#### Profile Section
- **Name:** "Gihun Ko Stephen"
- **Title:** "Frontend Software Engineer | Web Developer"
- **Social Links:** GitHub, LinkedIn, Home icons (NameCard component with labels)
- **Layout:** Centered on mobile/tablet, right-aligned on desktop

#### StatsBar Component
- **Stats:** 10+ Years, 100+ Spots, 4 Languages, 1 Dream Project
- **Desktop:** Horizontal row layout
- **Mobile:** 2x2 grid layout
- **Styling:** Gradient text values, subtle hover effects, rounded cards

#### Content Sections (Section Component)

**Section Component Features:**
- Wrapper with background variants: `white`, `gray` (bg-gray-50), `accent` (bg-red-50)
- Title styling: Bold text with 3px primary (red) underline
- Responsive padding: py-8 mobile, py-12 desktop
- Accessible: aria-labelledby support

**Food & Code Section**
- **Background:** White
- **Title:** Red underlined h3
- Personal narrative about returning to Korea for national service
- Discovery of passion for food documentation
- Connection between coding and food exploration
- Key phrase highlighted: "food in Singapore"
- Origin story of "Foodie's Trail" concept

**About this Project Section**
- **Background:** Gray (bg-gray-50) with rounded corners
- **Title:** Red underlined h3
- Project description as personal passion
- 10 years of food discoveries
- Archive of meals, memories, moments
- Hope for helping visitors discover food culture
- Emotional appeal: "feel the warmth I experienced"

#### Footer
- Consistent with other pages
- Website links, language selector, version info

---

## Responsive Behavior

### Breakpoint Strategy

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 768px | Single column, stacked elements, hamburger nav |
| Tablet | 768px - 1023px | Hybrid layouts, some side-by-side |
| Desktop | >= 1024px | Full multi-column, all controls visible |

### Key Responsive Adaptations

#### Header
- **Mobile:** Compact logo, hamburger menu, minimal controls
- **Tablet:** Logo + main nav visible, search collapsed
- **Desktop:** Full search bar, all navigation, language selector

#### Landing Hero
- **Mobile:** Stacked - illustration above or within text flow
- **Tablet:** Slightly compressed side-by-side
- **Desktop:** Full split layout with generous whitespace

#### Map View
- **Mobile:** Full-width map, scrollable filter pills, vertical food list
- **Tablet:** Map with visible controls, grid food spots
- **Desktop:** Map with floating control panel, horizontal carousels

#### About Page
- **Mobile:** Single column, illustration full-width above text
- **Tablet:** Centered content with padding
- **Desktop:** Two-column with illustration left, content right

---

## Component Inventory

### Navigation Components
| Component | Location | States |
|-----------|----------|--------|
| Header | All pages | Default, scrolled, mobile-collapsed |
| Footer | All pages | Standard only |
| Language Switcher | Header/Footer | Dropdown with 4 locales |
| Mobile Menu | Header (mobile) | Closed, open |

### Interactive Components
| Component | Location | Behavior |
|-----------|----------|----------|
| Search Bar | MapView header | Autocomplete, keyboard navigation |
| Filter Pills | MapView | Toggle on/off, multi-select |
| Trail Mode Toggle | MapView | Binary on/off state |
| Map Controls | MapView | Click to adjust camera |
| Food Carousel | Landing, MapView | Horizontal scroll/swipe |

### Content Components
| Component | Usage |
|-----------|-------|
| Feature Card | Landing page highlights |
| Food Spot Card | Thumbnail + name overlay |
| Region Tab Panel | Categorized food lists |
| CTA Banner | Full-width promotional sections |

### About Page Components
| Component | Usage |
|-----------|-------|
| NameCard | Social links with labels (LinkedIn, GitHub, Portfolio) |
| StatsBar | Statistics display (Years, Spots, Languages, Project) |
| Section | Content wrapper with title styling & background variants |

### 3D Components
| Component | Purpose |
|-----------|---------|
| MRT Map Texture | Base Singapore map |
| Location Markers | Food spot indicators |
| Trail Path | Connecting curved lines |
| Environment Lighting | Day/night atmosphere |

---

## Design Patterns

### Visual Hierarchy
1. **Primary Actions:** Red/maroon buttons with high contrast
2. **Secondary Info:** Gray text, smaller scale
3. **Category Coding:** Consistent color per food type
4. **Emphasis:** Bold statistics, colored text highlights

### Card Design
- White backgrounds with subtle shadows
- Rounded corners (approximately 8-12px radius)
- Clear visual separation between cards
- Image-heavy with text overlays

### Navigation Patterns
- **Primary:** Header with logo + main links
- **Secondary:** In-page tabs (region selection)
- **Tertiary:** Footer links for secondary pages

### Empty States & Loading
- Map renders with MRT lines as visual placeholder
- Content sections show skeleton states (implied)

### Feedback Patterns
- Filter pills show active state with filled background
- Interactive elements have hover states
- Map markers respond to hover/click

---

## Accessibility Considerations

### Current Strengths
- High contrast header (white on maroon)
- Clear visual category coding
- Readable font sizes on all breakpoints
- Touch-friendly tap targets on mobile

### Areas for Review
- Color-only category differentiation (add icons/patterns)
- Map interaction for keyboard users
- Screen reader support for 3D canvas
- Alt text for food images
- Focus indicators on interactive elements

---

## Improvement Opportunities

### UX Enhancements
1. **Search Enhancement:** Add recent searches, popular suggestions
2. **Onboarding:** First-time user tour of map features
3. **Favorites:** Allow users to save favorite spots
4. **Sharing:** Social sharing for individual food spots

### Visual Refinements
1. **Loading States:** Skeleton screens for content areas
2. **Micro-interactions:** Subtle animations on filter toggles
3. **Empty States:** Illustrated states when no results
4. **Error States:** Friendly error messages with retry actions

### Mobile Optimization
1. **Bottom Navigation:** Consider bottom nav bar for key actions
2. **Gesture Support:** Swipe to dismiss sidebar
3. **Pull to Refresh:** For food list updates

### Performance
1. **Image Optimization:** Lazy loading for carousel images
2. **3D Performance:** LOD (Level of Detail) for map on mobile
3. **Caching:** Service worker for offline basic functionality

---

## Screenshot Reference

All screenshots are stored in `.claude/screenshots/`:

```
screenshots/
├── landing-mobile.png    (375px viewport)
├── landing-tablet.png    (768px viewport)
├── landing-desktop.png   (1440px viewport)
├── mapview-mobile.png    (375px viewport)
├── mapview-tablet.png    (768px viewport)
├── mapview-desktop.png   (1440px viewport)
├── about-mobile.png      (375px viewport)
├── about-tablet.png      (768px viewport)
└── about-desktop.png     (1440px viewport)
```

---

## Usage Notes for Agents

### For @ui-ux-designer
- Reference this document for visual consistency checks
- Use screenshots as baseline for design recommendations
- Color codes and component inventory are authoritative

### For @frontend-dev
- Follow established responsive patterns
- Use documented component patterns for new features
- Maintain color consistency per category system

---

*This document should be updated when significant UI changes are implemented.*
