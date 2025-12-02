# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**POC Tienda Online** (AIRIS) - A PULL&BEAR-inspired e-commerce platform with AI-powered personalization and product customization. Built with React, Vite, and Tailwind CSS, integrating a real backend API for authentication, product recommendations, and AI-driven features.

**Stack**: React 18.3 + Vite 6.0 + Tailwind CSS 3.4 + React Router DOM 6.28 + Redux Toolkit 2.10 + RTK Query + JWT Authentication

## Development Commands

```bash
# Install dependencies (use custom cache to avoid permission issues)
npm install --cache .npm-cache

# Run development server
npm run dev
# Server will start on http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### State Management Pattern (Hybrid Approach)

The project uses a **hybrid state management strategy**:

**Redux Toolkit** (Primary - `src/store/`):
- **authSlice.js**: JWT-based authentication with sessionStorage persistence
  - State: `{ user, token, isAuthenticated, loading, error }`
  - Actions: `login`, `logout`, `refreshToken`
  - Persists token to sessionStorage for reload recovery
- **cartSlice.js**: Shopping cart with variant tracking (size/color combinations)
  - State: `{ items: [{ id, size, color, quantity }], ... }`
  - Actions: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`
  - In-memory only (cleared on page refresh)

**RTK Query** (`src/store/services/`):
- **airisApi.js**: Main AIRIS backend integration
  - Endpoints: `login`, `getCatalogProducts`, `getLatestUserMood`, `getSuggestedProducts`, `customizeProductByUser`, `getImage`
  - Automatic request/response transformation
  - Cache invalidation on mutations
- **airisLoaderApi.js**: Image service (user photos, product images)
  - Endpoints: `uploadUserImages`, `createProductWithImages`, `addProductImages`
  - Proxy: `/api/loader` in dev → direct HTTPS in production

**React Context API** (Secondary):
- **AIContext.jsx**: AI workflow orchestration (photo upload → mood detection → product recommendations)
  - State: `{ uploadedPhotos, userMood, suggestedProducts, isProcessing }`
  - Manages multi-step AI pipeline and UI notifications
- **CartContext.jsx** (Legacy): Maintained for backward compatibility
- **UserContext.jsx** (Legacy): Maintained for backward compatibility

### API Integration

All external API calls go through RTK Query with JWT authentication:
- **Base URL**: `https://airis-api-...` (backend service)
- **Authentication**: Bearer token in Authorization header (auto-injected)
- **Error Handling**: RTK Query `isLoading`, `isError`, `error` states
- **Caching**: Automatic cache management with tag-based invalidation

**Dev Environment**: Vite proxy at `/api/loader` to handle CORS for image uploads

### Routing Structure

- `/` - Home with product grid (search/filter, AI upload CTA when authenticated)
- `/product/:id` - Product detail (add to cart, view related items)
- `/checkout` - Order summary and form
- `/ai-gallery` - User AI-generated images gallery (auth required)
- `/armario-con-ia` - Wardrobe with customized products (auth required)
- `/recomendaciones` - Mood-based product recommendations (auth required)

**Protected Routes**: `/armario-con-ia` and `/recomendaciones` require authentication; visibility controlled by component logic (no explicit route guard).

### Component Architecture

**Layout Components**:
- `Header` - Sticky header with hamburger menu, search, user/cart icons, notification badge
- `Sidebar` - Overlay sidebar (always hidden, opens via hamburger button)
- `Cart` - Right-side drawer overlay for shopping cart
- `AINotification` - Multi-state notification for AI workflow (upload → processing → results)
- `AIUploadModal` - Photo upload interface with drag-and-drop and mood detection

**Page Components**:
- `Home` - Product grid with search/filter, AI CTA button when authenticated
- `ProductDetail` - Product information with add-to-cart, related products
- `Checkout` - Order form and cart summary
- `AIGallery` - Grid of AI-generated images (user's mood-based photos)
- `ArmarioConIA` - Wardrobe with customized product recommendations
- `MoodRecommendations` - Mood-based product suggestion grid

**Critical Design Rules**:
- Sidebar is ALWAYS hidden and opened via hamburger button (no permanent sidebar on desktop)
- ProductCards are minimalist: image + name + price + color indicators only
- NO "add to cart" button on ProductCard components in the grid
- Background is white throughout the app (never gray)
- Grid uses compact spacing: `gap-x-3 gap-y-8`
- Mobile-first responsive design (2 cols mobile → 3 tablet → 4 desktop)
- ProductCard uses CSS `break-inside-avoid` for masonry compatibility

**ProductCard Specifics**:
- Displays discount badge only if `product.discount > 0`
- Shows up to 4 color indicators as small circles (3px, rounded-full)
- Favorite button appears only on hover
- Images use `loading="lazy"` for performance

### AI Workflow Data Flow

1. User authenticates → Sees "Genera tu armario" button in Home
2. Clicks AI button → Opens `AIUploadModal` with drag-and-drop
3. Uploads photos → `AIContext` manages state via `uploadUserImages` RTK Query
4. Backend detects mood → `AINotification` shows "Analizando..."
5. Gets suggestions → `getSuggestedProducts` populates Redux state
6. User sees "Ir a tu armario" link → Navigates to `/armario-con-ia`
7. Customizes products → `customizeProductByUser` applies changes
8. Views results → ProductCard grid shows customized items

### Standard E-commerce Data Flow

1. App loads → Redux auth state restored from sessionStorage
2. Home page → `getCatalogProducts` fetches via RTK Query cache
3. Click product → Navigate to `/product/:id`
4. ProductDetail → `getImage` loads product photos
5. Add to cart → Updates Redux `cartSlice`
6. View cart → Drawer shows Redux cart items
7. Checkout → `clearCart` after simulated purchase

## Design System

**Colors**: White background, black text, gray accents
**Typography**: Clean sans-serif, minimalist approach
**Spacing**: Grid uses `gap-x-3 gap-y-8`, generous but not excessive
**Grid Layout**: 2 columns mobile, 3 tablet, 4 desktop

**Important**: This project mimics PULL&BEAR's visual style - keep designs clean, minimal, and modern.

## Key Files to Understand

**Core Application**:
- `src/App.jsx` - Root component with Redux provider, Router, AIProvider, layout
- `src/main.jsx` - React DOM entry point

**State Management**:
- `src/store/store.js` - Redux store configuration with RTK Query middleware
- `src/store/slices/authSlice.js` - JWT authentication reducer
- `src/store/slices/cartSlice.js` - Shopping cart reducer
- `src/store/services/airisApi.js` - RTK Query API endpoints
- `src/store/services/airisLoaderApi.js` - RTK Query image upload endpoints

**Contexts**:
- `src/context/AIContext.jsx` - AI workflow orchestration (primary)
- `src/context/CartContext.jsx` - Legacy cart context (for backward compatibility)
- `src/context/UserContext.jsx` - Legacy auth context (for backward compatibility)

**Custom Hooks**:
- `src/hooks/useAI.js` - Convenience hook to access AIContext
- `src/hooks/useTypewriter.js` - Typewriter animation effect for notifications

**Pages**:
- `src/pages/Home.jsx` - Product grid with filters and AI upload CTA
- `src/pages/ProductDetail.jsx` - Product info with add-to-cart, recommendations
- `src/pages/Checkout.jsx` - Order form and cart summary
- `src/pages/AIGallery.jsx` - User AI image gallery
- `src/pages/ArmarioConIA.jsx` - Customized product wardrobe
- `src/pages/MoodRecommendations.jsx` - Mood-based suggestions

**Configuration**:
- `vite.config.js` - Vite config with React plugin, base path `/POC/`, API proxy
- `tailwind.config.js` - Tailwind theming and customization
- `src/index.css` - Tailwind directives only

## Development Notes

**State Management**:
- Always dispatch Redux actions for cart and auth changes (never mutate directly)
- Use RTK Query hooks: `useGetCatalogProductsQuery()`, `useLoginMutation()`, etc.
- Automatically inject auth token into all RTK Query requests via `prepareHeaders`

**Styling**:
- Use Tailwind CSS utilities exclusively (no custom CSS files)
- Reference design system in tailwind.config.js for colors
- ProductGrid: `gap-x-3 gap-y-8` for spacing
- ProductCard images: always use `loading="lazy"`

**Component Development**:
- Keep components small and focused on single responsibility
- Use React Router hooks: `useParams()`, `useNavigate()`, `useLocation()`
- Lazy load images in all grid components with `loading="lazy"`
- The sidebar must NEVER show by default—only via hamburger button click
- Product cards remain minimal (image, name, price, color dots only)

**API Calls**:
- All backend calls via RTK Query (no direct fetch)
- Handle loading/error states with RTK Query's `isLoading`, `isError` properties
- Image uploads go through `airisLoaderApi` with form-data encoding

**Performance**:
- Use RTK Query caching to avoid redundant requests
- Memoize expensive calculations with `useMemo`
- Consider `React.memo` for ProductCard lists
- Masonry layout: ProductCard with `break-inside-avoid`

**AI Features**:
- AIContext manages the complete photo→mood→recommendation workflow
- AINotification component shows real-time progress (uploading → analyzing → ready)
- AIUploadModal handles drag-and-drop file selection
- Backend processes images asynchronously; UI polls or uses WebSocket for updates

**Notes**:
- Cart state is in-memory (clears on page refresh)
- Session persists in sessionStorage (survives reload, cleared on tab close)
- Quick login available in Header for testing: `josedtm@airis.com` / `123456hashed`
- SIEMPRE QUE SEA POSIBLE HAZ LOS CAMBIOS EN PARALELO