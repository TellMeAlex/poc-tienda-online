# 🛍️ POC Tienda Online - AIRIS Integration

Tienda online moderna con **Inteligencia Artificial** integrada, desarrollada con React, Redux Toolkit Query y las APIs de AIRIS.

[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.10-purple)](https://redux-toolkit.js.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4-yellow)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-cyan)](https://tailwindcss.com/)

---

## ✨ Características Principales

### 🤖 Inteligencia Artificial
- **Búsqueda Semántica**: Búsqueda inteligente con vector embeddings
- **Análisis de Mood**: Detección del estado de ánimo del usuario
- **Recomendaciones Personalizadas**: Productos sugeridos basados en IA
- **Personalización de Productos**: Customización con IA por usuario

### 🛒 E-commerce
- Grid de productos con filtros y búsqueda
- Detalle de producto con selector de talla y color
- Carrito de compras con gestión de cantidades
- Proceso de checkout completo
- Diseño responsive inspirado en PULL&BEAR

### 🔐 Autenticación
- Login real con email/password
- JWT token authentication
- Persistencia de sesión
- Protected routes

---

## 🚀 Stack Tecnológico

### Frontend
- **React 18.3** - UI Framework
- **Redux Toolkit 2.10** - State Management
- **RTK Query** - Data Fetching & Caching
- **React Redux 9.2** - React Bindings
- **React Router DOM 6.30** - Routing
- **Vite 6.4** - Build Tool
- **Tailwind CSS 3.4** - Styling

### Backend APIs
- **AIRIS API** - Productos, búsqueda IA, mood, personalización
- **AIRIS Loader API** - Upload y gestión de imágenes

---

## 📦 Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd POC
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en modo desarrollo
```bash
npm run dev
```

### 4. Abrir en el navegador
```
http://localhost:5175/POC/
```

---

## 🏗️ Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── Header.jsx       # Header con login y búsqueda
│   ├── Sidebar.jsx      # Menú lateral
│   ├── ProductCard.jsx  # Tarjeta de producto
│   ├── ProductGrid.jsx  # Grid de productos
│   ├── Cart.jsx         # Carrito de compras
│   └── ...
├── pages/               # Páginas principales
│   ├── Home.jsx         # Catálogo de productos
│   ├── ProductDetail.jsx # Detalle con personalización IA
│   ├── Checkout.jsx     # Proceso de compra
│   ├── AIGallery.jsx    # Galería de imágenes IA
│   ├── ArmarioConIA.jsx # Armario virtual con IA
│   └── MoodRecommendations.jsx # Recomendaciones por mood
├── store/               # Redux Store
│   ├── store.js         # Configuración del store
│   ├── services/        # RTK Query APIs
│   │   ├── airisApi.js  # AIRIS API
│   │   └── airisLoaderApi.js # AIRIS Loader API
│   └── slices/          # Redux Slices
│       ├── authSlice.js # Autenticación
│       └── cartSlice.js # Carrito
├── context/             # Context API (legacy)
├── examples/            # Ejemplos de código
│   └── RTKQueryExamples.jsx
└── App.jsx              # Componente raíz
```

---

## 🎯 Funcionalidades

### 🏠 Home
- Catálogo completo de productos
- Búsqueda inteligente con IA
- Filtros por categoría
- Grid responsive

### 🔍 Búsqueda con IA
```javascript
// Búsqueda semántica
const { data } = useGetSuggestedProductsQuery('vestido rojo verano');
// Retorna productos relevantes usando vector embeddings
```

### 👤 Autenticación
```javascript
// Login con email/password
const [login] = useLoginMutation();
await login({ email, password }).unwrap();
```

### 🎨 Personalización de Productos
```javascript
// Personalizar producto con IA
const [customize] = useCustomizeProductByUserMutation();
const customized = await customize(productId).unwrap();
```

### 😊 Mood Recommendations
```javascript
// Obtener mood del usuario
const { data: mood } = useGetLatestUserMoodQuery();

// Productos basados en mood
const { data } = useGetSuggestedProductsQuery(mood.related_products_query);
```

### 🛒 Carrito de Compras
```javascript
// Gestión con Redux
const dispatch = useDispatch();
dispatch(addToCart({ product, quantity, size, color }));

// Selectores
const items = useSelector(selectCartItems);
const total = useSelector(selectCartTotal);
```

---

## 🔌 APIs Integradas

### AIRIS API
**Base URL:** `https://airis-api-711296505139.europe-southwest1.run.app`

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/auth/token` | POST | Autenticación |
| `/operation/suggested-products` | GET | Búsqueda con IA |
| `/operation/get_catalog_products` | GET | Catálogo completo |
| `/operation/latest-user-mood` | GET | Mood del usuario |
| `/operation/customize_product_by_user` | POST | Personalizar producto |
| `/image/{path}` | GET | Obtener imagen |

### AIRIS Loader API
**Base URL:** `https://airis-loader-711296505139.europe-southwest1.run.app`

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/users/user-images` | POST | Upload imágenes usuario |
| `/products/products-with-images` | POST | Crear producto con imágenes |
| `/products/add-product-images` | POST | Añadir imágenes a producto |

---

## 🎨 Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Home - Catálogo de productos |
| `/product/:id` | Detalle de producto |
| `/checkout` | Proceso de compra |
| `/ai-gallery` | Galería de imágenes IA |
| `/armario-con-ia` | Armario virtual con IA |
| `/mood-recommendations` | Recomendaciones por mood |

---

## 📚 Documentación

- **[RTK_QUERY_INTEGRATION.md](./RTK_QUERY_INTEGRATION.md)** - Guía de integración RTK Query
- **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)** - Resumen de cambios
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Diagramas y arquitectura
- **[INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md)** - Checklist de verificación
- **[EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)** - Resumen ejecutivo
- **[src/examples/RTKQueryExamples.jsx](./src/examples/RTKQueryExamples.jsx)** - 10 ejemplos de código

---

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting (si está configurado)
npm run lint
```

---

## 🔧 Configuración

### Variables de Entorno (Opcional)
Crear archivo `.env` en la raíz:

```env
VITE_AIRIS_API_URL=https://airis-api-711296505139.europe-southwest1.run.app
VITE_AIRIS_LOADER_API_URL=https://airis-loader-711296505139.europe-southwest1.run.app
```

### Redux DevTools
Instalar extensión para debugging:
- [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

---

## 🎓 Ejemplos de Uso

### Obtener Productos
```javascript
import { useGetCatalogProductsQuery } from './store/services/airisApi';

function ProductList() {
  const { data: products, isLoading, error } = useGetCatalogProductsQuery();
  
  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {products?.map(product => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
}
```

### Añadir al Carrito
```javascript
import { useDispatch } from 'react-redux';
import { addToCart } from './store/slices/cartSlice';

function AddToCartButton({ product }) {
  const dispatch = useDispatch();
  
  const handleClick = () => {
    dispatch(addToCart({
      product,
      quantity: 1,
      size: 'M',
      color: 'Negro'
    }));
  };
  
  return <button onClick={handleClick}>Añadir al Carrito</button>;
}
```

Ver más ejemplos en [src/examples/RTKQueryExamples.jsx](./src/examples/RTKQueryExamples.jsx)

---

## 🐛 Troubleshooting

### Productos no cargan
1. Verificar conexión a internet
2. Ver Network tab en DevTools
3. Verificar URLs de APIs
4. Revisar Redux DevTools

### Error de autenticación
1. Verificar credenciales
2. Revisar que el token se guarde
3. Ver Redux DevTools → auth slice
4. Verificar headers en Network tab

### Carrito no actualiza
1. Verificar dispatch de acciones
2. Ver Redux DevTools → cart slice
3. Verificar selectores
4. Revisar modelo de datos

---

## 📈 Próximos Pasos

- [ ] Implementar `redux-persist` para carrito
- [ ] Añadir toast notifications
- [ ] Tests unitarios con Jest
- [ ] Migrar a TypeScript
- [ ] Implementar SSR con Next.js
- [ ] PWA con service workers
- [ ] Analytics y tracking

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crear branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

## 📄 Licencia

Este es un proyecto de Proof of Concept para demostración.

---

## 👨‍💻 Desarrollado por

**Antigravity AI Assistant**  
Powered by Google Deepmind

---

## 📞 Soporte

Para preguntas o issues:
- Ver documentación en la carpeta `/docs`
- Revisar ejemplos en `/src/examples`
- Consultar [INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md)

---

## 🌟 Características Destacadas

### ✅ Completado
- ✅ Integración RTK Query
- ✅ APIs reales de AIRIS
- ✅ Autenticación JWT
- ✅ Búsqueda con IA
- ✅ Mood analysis
- ✅ Personalización de productos
- ✅ Carrito con Redux
- ✅ Cache automático
- ✅ Documentación completa

### 🚧 En Desarrollo
- ⏳ Upload de imágenes
- ⏳ Persistencia del carrito
- ⏳ Tests unitarios
- ⏳ TypeScript migration

---

**¡Gracias por usar POC Tienda Online! 🚀**

Para más información, consulta la [documentación completa](./EXECUTIVE_SUMMARY.md).
