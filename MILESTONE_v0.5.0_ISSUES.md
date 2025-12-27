# Milestone v0.5.0 - Proposed Issues

**Milestone Description:** Enhancements for UI/UX, new features, and performance optimization for The Foodie's Trail SG

---

## Issue 1: Enhanced Mobile Experience - Touch Gestures & Responsive Map Controls

**Type:** UI/UX Improvement
**Priority:** High
**Estimated Complexity:** Medium

### Description
Optimize the 3D map experience for mobile devices with improved touch gestures, responsive map controls, and better mobile layout. Currently, the MapController UI and 3D canvas interactions could be challenging on smaller screens.

### Current State
- MapController panel uses desktop-oriented button controls (zoom ±, pan 4-directions, rotate)
- Canvas is 1440x800px with viewport initialScale=0.7
- Touch interactions rely on default MapControls behavior
- FilterBar and TrailMode toggle may be cramped on mobile

### Proposed Improvements

**1. Touch Gesture Enhancements**
- Implement pinch-to-zoom gesture mapping to camera zoom
- Two-finger pan for camera rotation (separate from one-finger pan)
- Add haptic feedback on location selection (if supported)
- Improve touch target sizes for 3D building instances (currently may be hard to tap)

**2. Mobile-Optimized Map Controller**
- Create collapsible floating action button (FAB) for map controls
- Replace directional buttons with joystick-style touch control
- Add preset camera views: "Top View", "Reset", "Follow Trail"
- Hide controller by default on mobile, show on tap
- Reduce button sizes and use icon-only mode for mobile

**3. Responsive Layout Adjustments**
- Make HeritageListView horizontal scrollable carousel on mobile instead of 4-column grid
- Stack FilterBar items vertically on very small screens
- Adjust PlaceContent card to take 90% width on mobile (currently may overflow)
- Optimize Sidebar to slide from bottom on mobile instead of right

**4. Performance Considerations**
- Disable stars/clouds on mobile for better frame rate
- Reduce instanced building poly count on mobile devices
- Add loading skeleton for mobile to indicate 3D scene is loading

### Success Criteria
- Smooth 60fps on mid-range mobile devices (tested on iPhone SE, Pixel 5)
- All interactive elements meet minimum touch target size (44x44px)
- No horizontal scroll on any mobile viewport
- Improved task completion time for "find and view location details" on mobile

### Free Tier Compatibility
✅ All changes are frontend-only, no backend/API costs

### Files to Modify
- `app/components/MapController/MapController.tsx`
- `app/components/FilterBar/FilterBar.tsx`
- `app/components/PlaceContent/PlaceContent.tsx`
- `app/components/Sidebar/Sidebar.tsx`
- `app/components/HeritageListView/HeritageListView.tsx`
- `app/mapmodels/MapEnvironment.tsx` (conditional rendering)
- `app/hooks/useCameraControls.ts` (add touch gesture support)

---

## Issue 2: User Favorites & Bookmarks System (localStorage-based)

**Type:** New Feature
**Priority:** Medium
**Estimated Complexity:** Low-Medium

### Description
Allow users to bookmark their favorite food spots for quick access. Use browser localStorage to persist favorites across sessions without requiring a backend or authentication.

### Current State
- No way to save preferred locations
- Users must remember or write down favorite spots manually
- No personalization features

### Proposed Implementation

**1. Favorites Store (Zustand)**
Create new `useFavoritesStore.ts`:
```typescript
interface FavoritesStore {
  favoriteIds: string[];  // FoodHeritage IDs
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearAllFavorites: () => void;
  // Persist to localStorage
  hydrate: () => void;  // Load from localStorage on mount
}
```

**2. UI Components**
- Add heart icon button to PlaceContent card (filled if favorited)
- Add heart icon button to Sidebar detail view
- Create new "Favorites" filter option in FilterBar (shows only favorited locations)
- Add favorites count badge in Header navigation
- Show favorites in HeritageListView as separate category

**3. Favorites Page (Optional)**
- Create `/[locale]/favorites` route
- List all favorited locations in grid/list view
- Quick "View on Map" CTA for each favorite
- Empty state with suggestion to explore map

**4. Persistence Strategy**
```typescript
// utils/favoritesStorage.ts
export const STORAGE_KEY = 'foodie_trail_favorites_v1';

export const loadFavorites = (): string[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveFavorites = (ids: string[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
};
```

**5. Analytics Integration**
- Track "favorite_added" event in Vercel Analytics
- Track "favorite_removed" event
- Track "view_favorites_page" event

### Success Criteria
- Users can add/remove favorites with single click
- Favorites persist across browser sessions
- Favorites filter shows only bookmarked locations on map
- Works offline (since using localStorage)
- Export/import favorites as JSON (bonus feature for backup)

### Free Tier Compatibility
✅ Uses browser localStorage, no backend required
✅ Vercel Analytics free tier supports custom events

### Files to Create
- `app/stores/useFavoritesStore.ts`
- `app/utils/favoritesStorage.ts`
- `app/[locale]/favorites/page.tsx` (optional)
- `app/components/FavoriteButton/FavoriteButton.tsx`

### Files to Modify
- `app/components/PlaceContent/PlaceContent.tsx` (add heart button)
- `app/components/Sidebar/Sidebar.tsx` (add heart button)
- `app/components/FilterBar/FilterBar.tsx` (add favorites filter)
- `app/components/Header/Header.tsx` (add favorites link + count badge)
- `messages/en.json`, `ja.json`, `ko.json`, `nl.json` (i18n strings)

---

## Issue 3: Advanced Search & Filtering System

**Type:** New Feature
**Priority:** Medium
**Estimated Complexity:** Medium

### Description
Implement comprehensive search and filtering to help users discover food spots by name, MRT station, region, or recommendations. Currently, filtering is limited to category (hawker/restaurant/dessert).

### Current State
- FilterBar only supports category filtering
- No way to search by location name
- No MRT station filtering (despite all locations having MRT data)
- No region-based quick filtering
- Recommendations are visible but not searchable

### Proposed Features

**1. Search Bar**
- Full-text search across:
  - Location name (e.g., "Maxwell Chicken Rice")
  - Recommendations (e.g., "Laksa", "Chicken")
  - MRT station names (e.g., "Chinatown")
  - Address keywords
- Debounced input (300ms) for performance
- Clear button to reset search
- Search suggestions dropdown (show top 5 matches as you type)

**2. Enhanced Filters**

**MRT Station Filter:**
- Dropdown with all unique MRT stations (autocomplete)
- Shows locations near selected MRT
- Display MRT station count in dropdown (e.g., "Chinatown (12)")

**Region Filter:**
- Quick toggle buttons for Central/East/West/North
- Multi-select support (e.g., show Central + East)
- Use region colors from theme for visual clarity

**Recommendation Filter:**
- Tag-based filtering (extract all recommendations into tags)
- Show popular tags: "Chicken Rice", "Laksa", "Satay", "Dessert"
- Multi-select tag chips

**3. Search UI Component**
```
┌────────────────────────────────────────┐
│ 🔍 Search locations, dishes, MRT...   │
│    [Suggestions dropdown if results]   │
└────────────────────────────────────────┘
┌────────────────────────────────────────┐
│ Filters:                               │
│ [Hawker] [Restaurant] [Dessert]        │
│ [Central] [East] [West] [North]        │
│ MRT: [Dropdown ▼]                      │
│ Tags: [Laksa ×] [Chicken Rice ×]       │
│ [Clear All Filters]                    │
└────────────────────────────────────────┘
```

**4. Zustand Store Enhancement**
Update `useHeritageStore`:
```typescript
interface HeritageStore {
  // ... existing
  searchQuery: string;
  selectedMRT: string[];
  selectedRegions: Region[];
  selectedTags: string[];

  setSearchQuery: (query: string) => void;
  addMRTFilter: (mrt: string) => void;
  removeMRTFilter: (mrt: string) => void;
  // ... similar for regions/tags

  getFilteredFood: () => FoodHeritage[];  // Update to include all filters
  clearAllFilters: () => void;
}
```

**5. Search Algorithm**
```typescript
// utils/searchUtils.ts
export const fuzzyMatch = (query: string, text: string): number => {
  // Return relevance score 0-1
  // Case-insensitive, partial match
};

export const searchFoodHeritage = (
  data: FoodHeritage[],
  query: string
): FoodHeritage[] => {
  // Score each location, sort by relevance
  // Boost exact matches in name
};
```

**6. URL State Sync (Optional)**
- Sync filters to URL query params
- Enable shareable filtered views
- Example: `/mapview?search=laksa&region=central&mrt=chinatown`

### Success Criteria
- Search returns relevant results within 100ms for 100+ locations
- Filters can be combined (AND logic)
- Clear visual feedback when filters are active (count of visible locations)
- Mobile-friendly filter UI (collapsible accordion on mobile)
- Empty state when no results found ("Try different filters")

### Free Tier Compatibility
✅ All frontend logic, no backend required
✅ Can use Fuse.js (fuzzy search library, <10KB) for better search quality

### Files to Create
- `app/components/SearchBar/SearchBar.tsx`
- `app/components/FilterPanel/FilterPanel.tsx` (enhanced FilterBar)
- `app/utils/searchUtils.ts`
- `app/hooks/useSearch.ts` (debounce logic)

### Files to Modify
- `app/stores/useHeritageStore.ts`
- `app/[locale]/mapview/ClientHome.tsx` (integrate search)
- `app/components/FilterBar/FilterBar.tsx` (replace or enhance)
- `messages/*.json` (i18n for search/filters)

---

## Issue 4: Progressive Web App (PWA) - Offline Support & Installability

**Type:** Performance & Feature
**Priority:** Medium
**Estimated Complexity:** Medium

### Description
Transform the application into a Progressive Web App (PWA) to enable offline access, installability on mobile devices, and improved performance through service worker caching. This enhances user experience without requiring app store distribution.

### Current State
- No service worker
- No offline capability
- No install prompt on mobile
- No app manifest
- All assets must be fetched on each visit

### Proposed Implementation

**1. Web App Manifest**
Create `public/manifest.json`:
```json
{
  "name": "The Foodie's Trail SG",
  "short_name": "Foodie Trail",
  "description": "Discover hidden local food spots in Singapore",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#EBEBE9",
  "theme_color": "#A7292C",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["food", "travel", "lifestyle"],
  "screenshots": [
    {
      "src": "/screenshots/map-view.png",
      "sizes": "1280x720",
      "type": "image/png"
    }
  ]
}
```

**2. Service Worker Strategy**
Use Next.js + Workbox for service worker:

**Install `next-pwa`** (zero-config PWA plugin):
```bash
npm install next-pwa
```

**Configure in `next.config.ts`:**
```typescript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
        }
      }
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-images',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        }
      }
    },
    {
      urlPattern: /\.(?:glb|gltf)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: '3d-models',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 24 * 60 * 60 // 60 days
        }
      }
    },
    {
      urlPattern: /^https:\/\/.*\.(?:json)$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-data',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 16,
          maxAgeSeconds: 24 * 60 * 60 // 1 day
        }
      }
    }
  ]
});

module.exports = withPWA({
  // ... existing Next.js config
});
```

**3. Offline Fallback Page**
Create `app/offline/page.tsx`:
```tsx
export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>You're Offline</h1>
      <p>Connect to the internet to explore food locations</p>
      <p>Previously viewed locations are cached and available</p>
    </div>
  );
}
```

**4. Install Prompt Component**
Create `app/components/InstallPrompt/InstallPrompt.tsx`:
```tsx
// Show banner prompting user to install app
// Dismiss and store in localStorage to not show again
// Only show on mobile devices
```

**5. Meta Tags in Layout**
Update `app/[locale]/layout.tsx`:
```tsx
<head>
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#A7292C" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="Foodie Trail" />
  <link rel="apple-touch-icon" href="/icons/icon-192.png" />
</head>
```

**6. Caching Strategy Summary**
- **3D Models (.glb)**: CacheFirst (rarely change, largest files)
- **Images**: StaleWhileRevalidate (show cached, update in background)
- **Fonts**: CacheFirst (never change)
- **Food Data JSON**: NetworkFirst with 10s timeout (prefer fresh data, fallback to cache)
- **Pages**: NetworkFirst (Next.js default)

**7. Update Detection**
- Show toast notification when new version is available
- "Update Available - Reload to get latest" with action button
- Use service worker `updatefound` event

### Success Criteria
- App installable on iOS Safari and Android Chrome
- Offline mode shows previously viewed locations and 3D models
- Lighthouse PWA score > 90
- Service worker successfully caches 3D models (verify in DevTools)
- Install prompt shows for eligible users (after 2+ visits)
- App loads in <3s on 3G connection (with cache)

### Free Tier Compatibility
✅ next-pwa is free and open-source
✅ No backend/server costs (service worker runs in browser)
✅ Vercel supports service workers out of the box
✅ Reduces bandwidth costs by caching assets

### Files to Create
- `public/manifest.json`
- `public/icons/icon-192.png`, `icon-512.png` (generate from logo)
- `app/offline/page.tsx`
- `app/components/InstallPrompt/InstallPrompt.tsx`
- `app/components/UpdateNotification/UpdateNotification.tsx`

### Files to Modify
- `next.config.ts` (add PWA plugin)
- `app/[locale]/layout.tsx` (add meta tags)
- `package.json` (add next-pwa dependency)

### Testing Checklist
- [ ] Install app on iOS device (Add to Home Screen)
- [ ] Install app on Android device (Install prompt)
- [ ] Go offline, verify cached content loads
- [ ] Verify service worker registered in DevTools
- [ ] Check cache storage for 3D models
- [ ] Test update notification flow
- [ ] Lighthouse PWA audit

---

## Issue 5: Enhanced Loading States & Error Boundaries

**Type:** UI/UX Improvement
**Priority:** High
**Estimated Complexity:** Low-Medium

### Description
Improve user experience during loading states and handle errors gracefully throughout the application. Currently, there's minimal feedback during 3D model loading, data fetching, and no fallback UI for errors.

### Current State
- Canvas shows generic "Loading..." text during model load
- No progress indication for 3D model loading
- Data fetch errors not displayed to user
- No error boundary components
- Failed image loads show broken image icon
- No retry mechanism for failed requests

### Proposed Improvements

**1. Loading States**

**A. 3D Scene Loading**
Create `app/components/SceneLoader/SceneLoader.tsx`:
```tsx
// Progressive loading indicator
// Show which models are loading:
// ✓ Base map loaded
// ⏳ Loading buildings... (45%)
// ⏳ Loading environment...
// Use useProgress from @react-three/drei
```

**B. Data Fetching Loading**
Replace current loading with skeleton screens:
- Skeleton cards for HeritageListView
- Skeleton for FilterBar
- Animated shimmer effect

**C. Image Loading**
- Show placeholder while image loads
- Blur-up effect (load tiny image first, then full resolution)
- Use Next.js Image component `placeholder="blur"`

**2. Error Boundaries**

**A. Root Error Boundary**
Create `app/components/ErrorBoundary/ErrorBoundary.tsx`:
```tsx
class ErrorBoundary extends React.Component {
  // Catch React errors
  // Show friendly error message
  // Log to console in dev, Vercel Analytics in prod
  // "Something went wrong" with retry button
}
```

**B. 3D Scene Error Boundary**
Create `app/components/SceneErrorBoundary/SceneErrorBoundary.tsx`:
```tsx
// Specific to Three.js errors
// Fallback: Show 2D map view or list view
// "3D view unavailable - showing list view"
```

**C. Data Fetch Error Handling**
Update `utils/networkUtils.ts`:
```typescript
export const fetchApi = async <T>(
  url: string,
  options?: RequestInit,
  retries = 3
): Promise<DataResponse<T>> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return { data: await response.json() };
    } catch (error) {
      if (i === retries - 1) {
        return { error: 'Failed to load data. Please try again.' };
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

**3. Error UI Components**

**A. ErrorMessage Component**
```tsx
<ErrorMessage
  title="Failed to load food locations"
  message="Check your internet connection and try again"
  onRetry={() => refetch()}
  action={<Button>Go to Home</Button>}
/>
```

**B. EmptyState Component**
```tsx
<EmptyState
  icon={<SearchOffIcon />}
  title="No locations found"
  message="Try adjusting your filters"
  action={<Button onClick={clearFilters}>Clear Filters</Button>}
/>
```

**4. Loading Skeletons**

**HeritageListView Skeleton:**
```tsx
<div className="grid grid-cols-4 gap-4">
  {[1,2,3,4].map(i => (
    <Card key={i} className="animate-pulse">
      <div className="h-32 bg-gray-200" />
      <div className="h-4 bg-gray-200 mt-2 w-3/4" />
    </Card>
  ))}
</div>
```

**PlaceContent Skeleton:**
```tsx
<Card className="animate-pulse">
  <div className="h-48 bg-gray-200" /> {/* Image */}
  <div className="h-6 bg-gray-200 mt-4 w-2/3" /> {/* Title */}
  <div className="h-4 bg-gray-200 mt-2 w-full" /> {/* Description */}
</Card>
```

**5. Progress Indicators**

**Use `@react-three/drei` useProgress:**
```tsx
import { useProgress } from '@react-three/drei';

function SceneLoader() {
  const { progress, active, item, loaded, total } = useProgress();

  return (
    <div className="loader">
      <div className="progress-bar" style={{ width: `${progress}%` }} />
      <p>{progress.toFixed(0)}% loaded</p>
      <p className="text-sm">{item}</p>
    </div>
  );
}
```

**6. Timeout Handling**
- Show timeout message if data fetch takes >10s
- Offer to use cached data if available
- "Taking longer than usual - check your connection"

**7. Image Fallback**
```tsx
<Image
  src={imgSource}
  alt={name}
  onError={(e) => {
    e.currentTarget.src = '/images/placeholder-food.jpg';
  }}
  loading="lazy"
  placeholder="blur"
  blurDataURL="/images/placeholder-tiny.jpg"
/>
```

### Success Criteria
- No "flash of unstyled content" during initial load
- Users know exactly what's loading and progress percentage
- Errors don't crash the app (caught by boundaries)
- Clear action buttons on all error states (Retry, Go Home)
- Failed images show placeholder, not broken icon
- Loading skeletons match final content layout
- Lighthouse "Time to Interactive" score improves

### Free Tier Compatibility
✅ All frontend changes, no backend costs
✅ Error logging to Vercel Analytics (free tier)
✅ Can use free Sentry tier for advanced error tracking (optional)

### Files to Create
- `app/components/ErrorBoundary/ErrorBoundary.tsx`
- `app/components/SceneErrorBoundary/SceneErrorBoundary.tsx`
- `app/components/SceneLoader/SceneLoader.tsx`
- `app/components/ErrorMessage/ErrorMessage.tsx`
- `app/components/EmptyState/EmptyState.tsx`
- `app/components/Skeleton/` (Card, List, Image skeletons)
- `public/images/placeholder-food.jpg`

### Files to Modify
- `app/mapmodels/MapScene.tsx` (integrate SceneLoader & error boundary)
- `app/[locale]/mapview/ClientHome.tsx` (add error boundary)
- `app/[locale]/layout.tsx` (root error boundary)
- `utils/networkUtils.ts` (add retry logic)
- `app/components/PlaceContent/PlaceContent.tsx` (add image fallback)
- `app/components/HeritageListView/HeritageListView.tsx` (add skeleton)

### Testing Checklist
- [ ] Simulate slow 3G connection (Chrome DevTools throttling)
- [ ] Test with network offline
- [ ] Force model load error (invalid URL)
- [ ] Force data fetch error (invalid API endpoint)
- [ ] Test image load failures
- [ ] Verify error boundaries catch errors (throw error in component)
- [ ] Test retry functionality
- [ ] Verify analytics events for errors

---

## Summary

These 5 issues provide a balanced mix of:

**UI/UX (2 issues):**
- Issue #1: Mobile optimization for better touch experience
- Issue #5: Loading states & error handling for professional UX

**Features (2 issues):**
- Issue #2: User favorites system (localStorage-based, no backend)
- Issue #3: Advanced search & filtering for better discoverability

**Performance (1 issue):**
- Issue #4: PWA with offline support and installability

**Free Tier Friendly:**
All issues are designed with free tier constraints in mind:
- No backend/database requirements
- Use localStorage for persistence
- Leverage browser APIs (service workers, cache)
- Open-source dependencies only
- Vercel-friendly optimizations

**Estimated Total Complexity:** Medium
**Estimated Total Effort:** 3-4 weeks part-time development

---

## Next Steps

1. Review these issues and prioritize based on your goals
2. Create GitHub milestone "v0.5.0"
3. Create 5 GitHub issues with the content above
4. Label them appropriately: `enhancement`, `feature`, `performance`, `ui/ux`
5. Assign to milestone
6. Start with highest priority (likely #5 or #1 for immediate UX impact)

Let me know which issues you'd like to proceed with, and I can help implement them!
