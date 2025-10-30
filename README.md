# POC Tienda Online

Proof of Concept de una tienda online inspirada en PULL&BEAR, desarrollada con React y Tailwind CSS.

## Características

- Grid de productos con filtros y búsqueda
- Detalle de producto con selector de talla y color
- Carrito de compras con gestión de cantidades
- Proceso de checkout completo
- Login simple sin validación (POC)
- Galería de imágenes IA (simuladas)
- Diseño responsive inspirado en PULL&BEAR
- Servicios REST mock con JSON local

## Stack Tecnológico

- **React 18.3** - Framework principal
- **Vite 6.0** - Build tool y dev server
- **Tailwind CSS 3.4** - Framework de estilos
- **React Router DOM 6.28** - Manejo de rutas
- **Context API** - Gestión de estado global

## Instalación

1. Instalar dependencias:
```bash
npm install --cache .npm-cache
```

2. Ejecutar en modo desarrollo:
```bash
npm run dev
```

3. Abrir en el navegador:
```
http://localhost:5173
```

## Estructura del Proyecto

```
src/
├── components/        # Componentes reutilizables
│   ├── Header.jsx     # Barra superior con logo, búsqueda, iconos
│   ├── Sidebar.jsx    # Menú lateral deslizable
│   ├── ProductCard.jsx # Tarjeta de producto individual
│   ├── ProductGrid.jsx # Grid de productos
│   └── Cart.jsx       # Carrito de compras (drawer lateral)
├── pages/            # Páginas principales
│   ├── Home.jsx      # Página de inicio con productos
│   ├── ProductDetail.jsx # Detalle de producto
│   ├── Checkout.jsx  # Proceso de compra
│   └── AIGallery.jsx # Galería de imágenes IA
├── context/          # Gestión de estado global
│   ├── UserContext.jsx # Estado de sesión/usuario
│   └── CartContext.jsx # Estado del carrito
├── services/         # Lógica de servicios
│   └── api.js        # Mock de servicios REST
├── data/             # Datos mock en JSON
│   ├── products.json # Catálogo de productos
│   └── aiImages.json # Imágenes generadas con IA
└── App.jsx           # Componente raíz con routing
```

## Flujo de la Aplicación

1. **Página de inicio** → Grid de productos con filtros
2. **Login simple** → Modal que establece sesión (cualquier nombre)
3. **Explorar productos** → Click en producto → Detalle completo
4. **Añadir al carrito** → Desde grid o página de detalle
5. **Ver galería IA** → Imágenes del usuario con productos (requiere login)
6. **Ver carrito** → Drawer lateral con productos y total
7. **Checkout** → Formulario de envío y resumen
8. **Compra finalizada** → Confirmación y reinicio del carrito

## Servicios Mock Disponibles

Todos los servicios están en `src/services/api.js`:

- `loginUser(username)` - Login simple sin validación
- `logoutUser()` - Cerrar sesión
- `checkAuth()` - Verificar sesión activa
- `getProducts(filters)` - Obtener productos con filtros
- `getProductById(id)` - Obtener detalle de producto
- `getAIImages(userId)` - Obtener imágenes IA del usuario
- `getCategories()` - Obtener categorías disponibles
- `searchProducts(query)` - Buscar productos

## Context API

### UserContext
Gestiona la sesión del usuario:
- `user` - Datos del usuario actual
- `isAuthenticated` - Estado de autenticación
- `login(username)` - Iniciar sesión
- `logout()` - Cerrar sesión

### CartContext
Gestiona el carrito de compras:
- `items` - Array de productos en el carrito
- `addToCart(product, quantity, size, color)` - Añadir producto
- `removeFromCart(productId, size, color)` - Eliminar producto
- `updateQuantity(productId, quantity, size, color)` - Actualizar cantidad
- `clearCart()` - Vaciar carrito
- `getTotal()` - Calcular total
- `getTotalItems()` - Obtener cantidad total de items

## Rutas

- `/` - Home (grid de productos)
- `/product/:id` - Detalle de producto
- `/checkout` - Proceso de compra
- `/ai-gallery` - Galería de imágenes IA (requiere login)

## Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## Características Destacadas

### Responsive Design
- Mobile-first approach
- Grid adaptativo de productos (2-4 columnas)
- Menú lateral deslizable en móvil
- Header optimizado para diferentes tamaños

### Gestión de Estado
- Context API para usuario y carrito
- Persistencia de sesión en sessionStorage
- Estado del carrito en memoria (no persiste entre sesiones)

### Experiencia de Usuario
- Animaciones suaves y transiciones
- Feedback visual al añadir al carrito
- Carga con spinners
- Mensajes de error informativos
- Confirmación de compra

### Servicios Mock
- Simulación de delay de red (300-600ms)
- Datos realistas con imágenes de Unsplash
- Filtros y búsqueda funcionales

## Limitaciones (POC)

- No hay backend real
- Login sin validación ni seguridad
- No hay persistencia de datos
- Carrito no persiste entre sesiones
- No hay pasarela de pago real
- Imágenes IA son estáticas
- No hay sistema de favoritos persistente

## Próximos Pasos

Ver archivo `PLAN.md` para el plan completo de desarrollo por iteraciones.

## Notas de Desarrollo

- Las imágenes de productos usan Unsplash (pueden tardar en cargar)
- El login acepta cualquier nombre de usuario
- La galería IA solo es accesible después del login
- El carrito se vacía al completar una compra
- No hay validaciones complejas (es un POC)

## Autor

Proyecto desarrollado como Proof of Concept de una tienda online moderna.
