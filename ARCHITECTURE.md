# 🏗️ Arquitectura RTK Query - Diagrama

```
┌─────────────────────────────────────────────────────────────────────┐
│                           REACT APP                                  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    Redux Provider                           │    │
│  │                                                             │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │                  Redux Store                          │  │    │
│  │  │                                                       │  │    │
│  │  │  ┌─────────────────┐  ┌──────────────────────────┐  │  │    │
│  │  │  │   RTK Query     │  │      Slices              │  │  │    │
│  │  │  │   Middleware    │  │                          │  │  │    │
│  │  │  └─────────────────┘  │  • authSlice             │  │  │    │
│  │  │                       │  • cartSlice             │  │  │    │
│  │  │  ┌─────────────────┐  └──────────────────────────┘  │  │    │
│  │  │  │  API Services   │                                │  │    │
│  │  │  │                 │                                │  │    │
│  │  │  │  • airisApi     │                                │  │    │
│  │  │  │  • loaderApi    │                                │  │    │
│  │  │  └─────────────────┘                                │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  │                                                             │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │              React Components                         │  │    │
│  │  │                                                       │  │    │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │  │    │
│  │  │  │  Header  │  │   Cart   │  │  ProductDetail   │   │  │    │
│  │  │  │          │  │          │  │                  │   │  │    │
│  │  │  │ useLogin │  │ useCart  │  │ useCustomize     │   │  │    │
│  │  │  │ Mutation │  │ Selector │  │ Mutation         │   │  │    │
│  │  │  └──────────┘  └──────────┘  └──────────────────┘   │  │    │
│  │  │                                                       │  │    │
│  │  │  ┌──────────┐  ┌──────────────┐  ┌──────────────┐   │  │    │
│  │  │  │   Home   │  │ MoodRecommend│  │  AIGallery   │   │  │    │
│  │  │  │          │  │              │  │              │   │  │    │
│  │  │  │ useGet   │  │ useGetMood   │  │ useUpload    │   │  │    │
│  │  │  │ Catalog  │  │ Query        │  │ Mutation     │   │  │    │
│  │  │  └──────────┘  └──────────────┘  └──────────────┘   │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTP Requests
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL APIs                                │
│                                                                      │
│  ┌──────────────────────────────────┐  ┌─────────────────────────┐ │
│  │        AIRIS API                 │  │   AIRIS Loader API      │ │
│  │                                  │  │                         │ │
│  │  • POST /auth/token              │  │  • POST /users/         │ │
│  │  • GET /suggested-products       │  │    user-images          │ │
│  │  • GET /catalog-products         │  │  • POST /products/      │ │
│  │  • GET /latest-user-mood         │  │    products-with-images │ │
│  │  • POST /customize-product       │  │  • POST /products/      │ │
│  │  • GET /image/{path}             │  │    add-product-images   │ │
│  └──────────────────────────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## 📊 Flujo de Datos

### 1. Query Flow (Lectura)
```
Component
   │
   │ useGetCatalogProductsQuery()
   │
   ▼
RTK Query
   │
   │ Check Cache
   │
   ├─ Cache Hit ──────► Return Cached Data
   │
   └─ Cache Miss
      │
      │ HTTP GET
      │
      ▼
   AIRIS API
      │
      │ Response
      │
      ▼
   RTK Query
      │
      │ Update Cache
      │ Update Store
      │
      ▼
   Component Re-renders
```

### 2. Mutation Flow (Escritura)
```
Component
   │
   │ login({ email, password })
   │
   ▼
RTK Query
   │
   │ HTTP POST
   │
   ▼
AIRIS API
   │
   │ Response (token, user)
   │
   ▼
RTK Query
   │
   │ Invalidate Tags
   │
   ▼
Component
   │
   │ .unwrap()
   │
   ▼
Dispatch Action
   │
   │ setCredentials({ user, token })
   │
   ▼
Auth Slice
   │
   │ Update State
   │ Save to sessionStorage
   │
   ▼
Component Re-renders
```

### 3. Cart Flow
```
Component
   │
   │ Add to Cart Button Click
   │
   ▼
Dispatch
   │
   │ addToCart({ product, quantity, size, color })
   │
   ▼
Cart Slice
   │
   │ Update items array
   │
   ▼
Selectors
   │
   ├─ selectCartItems ──────► Cart Component
   ├─ selectCartTotal ──────► Total Display
   └─ selectCartItemsCount ─► Badge Counter
```

## 🔄 Estado Global

```javascript
{
  // RTK Query APIs
  airisApi: {
    queries: {
      'getCatalogProducts(undefined)': {
        status: 'fulfilled',
        data: [...products],
        endpointName: 'getCatalogProducts',
      },
      'getSuggestedProducts("vestido")': {
        status: 'fulfilled',
        data: [...suggestedProducts],
      },
    },
    mutations: {
      'login({"email":"user@test.com"})': {
        status: 'fulfilled',
        data: { token: '...', user: {...} },
      },
    },
  },
  
  airisLoaderApi: {
    mutations: {},
  },
  
  // Slices
  auth: {
    user: { email: 'user@test.com' },
    token: 'eyJhbGciOiJIUzI1NiIs...',
    isAuthenticated: true,
  },
  
  cart: {
    items: [
      {
        product: { product_id: 1, product_name: '...', ... },
        quantity: 2,
        size: 'M',
        color: 'Negro',
      },
    ],
  },
}
```

## 🎯 Patrones de Uso

### Pattern 1: Protected Query
```javascript
const { data } = useGetLatestUserMoodQuery(undefined, {
  skip: !isAuthenticated, // Solo fetch si está autenticado
});
```

### Pattern 2: Dependent Queries
```javascript
const { data: mood } = useGetLatestUserMoodQuery();
const { data: products } = useGetSuggestedProductsQuery(
  mood?.related_products_query,
  { skip: !mood } // Solo fetch cuando mood esté disponible
);
```

### Pattern 3: Optimistic Updates
```javascript
const [addToCart] = useAddToCartMutation();

// Actualizar UI inmediatamente
dispatch(addToCartLocally(product));

// Sincronizar con servidor
try {
  await addToCart(product).unwrap();
} catch {
  // Revertir si falla
  dispatch(removeFromCartLocally(product));
}
```

### Pattern 4: Cache Invalidation
```javascript
// Cuando se hace login
invalidatesTags: ['Auth', 'Products']

// Cuando se personaliza un producto
invalidatesTags: (result, error, arg) => [
  { type: 'Products', id: arg.productId }
]
```

## 🔐 Autenticación Flow

```
1. User enters credentials
         │
         ▼
2. useLoginMutation()
         │
         ▼
3. POST /auth/token
         │
         ▼
4. Receive { token, user }
         │
         ▼
5. dispatch(setCredentials({ token, user }))
         │
         ▼
6. authSlice updates state
         │
         ▼
7. Save to sessionStorage
         │
         ▼
8. All future requests include:
   Authorization: Bearer {token}
```

## 📱 Component Hierarchy

```
App (Redux Provider)
 │
 ├─ Header
 │   ├─ useLoginMutation
 │   ├─ useSelector(selectIsAuthenticated)
 │   └─ useSelector(selectCartItemsCount)
 │
 ├─ Sidebar
 │
 ├─ Routes
 │   ├─ Home
 │   │   ├─ useGetCatalogProductsQuery
 │   │   └─ useGetSuggestedProductsQuery
 │   │
 │   ├─ ProductDetail
 │   │   ├─ useGetCatalogProductsQuery
 │   │   ├─ useCustomizeProductByUserMutation
 │   │   └─ useDispatch (addToCart)
 │   │
 │   ├─ MoodRecommendations
 │   │   ├─ useGetLatestUserMoodQuery
 │   │   └─ useGetSuggestedProductsQuery
 │   │
 │   └─ Checkout
 │       ├─ useSelector(selectCartItems)
 │       └─ useDispatch(clearCart)
 │
 └─ Cart
     ├─ useSelector(selectCartItems)
     ├─ useSelector(selectCartTotal)
     └─ useDispatch(removeFromCart, updateQuantity)
```

## 🎨 Ventajas de esta Arquitectura

✅ **Separación de Responsabilidades**
- APIs: Comunicación con backend
- Slices: Estado local de la app
- Components: UI y lógica de presentación

✅ **Cache Automático**
- RTK Query cachea todas las respuestas
- Reduce peticiones innecesarias
- Mejora performance

✅ **Type Safety** (con TypeScript)
- Tipos generados automáticamente
- Autocomplete en el IDE
- Menos errores en runtime

✅ **DevTools Integration**
- Redux DevTools para debugging
- Ver estado en tiempo real
- Time-travel debugging

✅ **Optimistic Updates**
- UI responde inmediatamente
- Mejor UX
- Rollback automático en errores

✅ **Normalización de Datos**
- Datos consistentes en toda la app
- Single source of truth
- Fácil de mantener
