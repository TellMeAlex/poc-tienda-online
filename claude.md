# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

POC Tienda Online - A PULL&BEAR-inspired e-commerce proof of concept built with React, Vite, and Tailwind CSS. This is a demo project with mock REST services simulating a complete e-commerce experience.

**Stack**: React 18.3 + Vite 6.0 + Tailwind CSS 3.4 + React Router DOM 6.28 + Context API

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

### State Management Pattern

This project uses React Context API for global state. Two main contexts:

**UserContext** (`src/context/UserContext.jsx`):
- Manages authentication state and user session
- Persists session in `sessionStorage` (no real validation - POC only)
- Exposes: `{ user, isAuthenticated, login(username), logout() }`

**CartContext** (`src/context/CartContext.jsx`):
- Manages shopping cart state (in-memory, no persistence between sessions)
- Handles product variants by size/color combination
- Key methods: `addToCart(product, quantity, size, color)`, `removeFromCart(id, size, color)`, `updateQuantity(...)`, `clearCart()`, `getTotal()`, `getTotalItems()`

### Mock Service Layer

All API calls are mocked in `src/services/api.js`:
- Simulates network delays (300-600ms) for realistic UX
- Data stored in JSON files: `src/data/products.json` and `src/data/aiImages.json`
- No backend required - fully functional frontend demo

**Available services**:
- `loginUser(username)` - Simple session creation
- `getProducts(filters)` - Returns product list with optional filtering
- `getProductById(id)` - Returns detailed product info with related products
- `getAIImages(userId)` - Returns AI-generated try-on images (mocked)

### Routing Structure

- `/` - Home page with product grid
- `/product/:id` - Product detail page
- `/checkout` - Checkout flow (simulated)
- `/ai-gallery` - AI image gallery (requires login)

Protected route: `/ai-gallery` redirects to home if user is not authenticated.

### Component Architecture

**Layout Components**:
- `Header` - Sticky header with hamburger menu, search, user/cart icons
- `Sidebar` - Overlay sidebar (always hidden, opens via hamburger button)
- `Cart` - Right-side drawer overlay for shopping cart

**Critical Design Rules**:
- Sidebar is ALWAYS hidden and opened via hamburger button (no permanent sidebar on desktop)
- ProductCards are minimalist: image + name + price + color indicators only
- NO "add to cart" button on ProductCard components in the grid
- Background is white throughout the app (never gray)
- Grid uses compact spacing: `gap-x-3 gap-y-8`
- Mobile-first responsive design (2 cols mobile, 3 tablet, 4 desktop)

**ProductCard Specifics**:
- Displays discount badge only if `product.discount > 0`
- Shows up to 4 color indicators as small circles (3px, rounded-full)
- Favorite button appears only on hover
- No hover effects that add buttons or gradients

### Data Flow

1. User opens app → Home page loads products via `getProducts()`
2. Click product → Navigate to `/product/:id` → Load details via `getProductById(id)`
3. Add to cart → Updates CartContext → Cart icon shows count
4. View cart → Opens right-side drawer with items
5. Checkout → Navigate to `/checkout` → Show form and summary
6. Complete purchase → Clear cart → Show confirmation → Redirect to home

## Design System

**Colors**: White background, black text, gray accents
**Typography**: Clean sans-serif, minimalist approach
**Spacing**: Grid uses `gap-x-3 gap-y-8`, generous but not excessive
**Grid Layout**: 2 columns mobile, 3 tablet, 4 desktop

**Important**: This project mimics PULL&BEAR's visual style - keep designs clean, minimal, and modern.

## POC Limitations

- No backend (all services are mocked)
- No authentication validation (accepts any username)
- No data persistence (cart clears on page refresh)
- No real payment processing
- AI images are static mock data
- Session only persists in sessionStorage (browser session)

## Key Files to Understand

- `src/App.jsx` - Root component with routing and context providers
- `src/services/api.js` - Mock API layer with delay simulation
- `src/context/UserContext.jsx` - Authentication state
- `src/context/CartContext.jsx` - Shopping cart logic with variant support
- `src/data/*.json` - Mock data sources

## Development Notes

- Use Tailwind CSS for all styling (avoid custom CSS)
- Images are from Unsplash (may have loading delays)
- Components should be small and reusable
- The sidebar must NEVER show by default - only via hamburger
- Product cards should remain minimal without extra buttons or hover effects
- SIEMPRE QUE SEA POSIBLE HAZ LOS CAMBIOS EN PARALELO