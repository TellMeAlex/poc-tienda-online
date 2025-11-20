# 🚀 Integración RTK Query - AIRIS APIs

Este documento describe la integración de las APIs reales de AIRIS usando **Redux Toolkit Query**.

## 📦 Dependencias Instaladas

```bash
npm install @reduxjs/toolkit react-redux
```

## 🏗️ Arquitectura

### Store Redux (`src/store/`)

```
src/store/
├── store.js                    # Configuración del store
├── services/
│   ├── airisApi.js            # API principal de AIRIS
│   └── airisLoaderApi.js      # API de carga de imágenes
└── slices/
    ├── authSlice.js           # Estado de autenticación
    └── cartSlice.js           # Estado del carrito
```

## 🔌 APIs Integradas

### 1. AIRIS API (`airisApi.js`)

**Base URL:** `https://airis-api-711296505139.europe-southwest1.run.app`

#### Endpoints disponibles:

##### Autenticación
```javascript
const [login, { isLoading }] = useLoginMutation();

await login({ 
  email: 'user@example.com', 
  password: 'password' 
});
```

##### Productos Sugeridos (Vector Search)
```javascript
const { data, isLoading, error } = useGetSuggestedProductsQuery('vestido rojo');
```

##### Catálogo de Productos
```javascript
const { data, isLoading, error } = useGetCatalogProductsQuery();
```

##### Mood del Usuario
```javascript
const { data, isLoading, error } = useGetLatestUserMoodQuery();
```

##### Personalizar Producto
```javascript
const [customizeProduct] = useCustomizeProductByUserMutation();

await customizeProduct(productId);
```

##### Obtener Imagen
```javascript
const { data, isLoading } = useGetImageQuery('path/to/image.jpg');
```

---

### 2. AIRIS Loader API (`airisLoaderApi.js`)

**Base URL:** `https://airis-loader-711296505139.europe-southwest1.run.app`

#### Endpoints disponibles:

##### Subir Imágenes de Usuario
```javascript
const [uploadUserImages] = useUploadUserImagesMutation();

await uploadUserImages({
  userId: 123,
  imagesKind: 'profile',
  images: [file1, file2, file3]
});
```

##### Crear Producto con Imágenes
```javascript
const [createProduct] = useCreateProductWithImagesMutation();

await createProduct({
  productName: 'Vestido Verano',
  productDescription: 'Vestido ligero para verano',
  productGender: 'mujer',
  productPrice: 29.99,
  productRank: 5,
  productCharacteristics: ['algodón', 'verano', 'casual'],
  images: [file1, file2],
  imagesKind: 'product'
});
```

##### Añadir Imágenes a Producto Existente
```javascript
const [addImages] = useAddProductImagesMutation();

await addImages({
  productId: 456,
  images: [file1, file2],
  imagesKind: 'product'
});
```

---

## 🎯 Uso en Componentes

### Ejemplo: Componente con Productos

```javascript
import { useGetCatalogProductsQuery } from '../store/services/airisApi';

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

### Ejemplo: Login con Autenticación

```javascript
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../store/services/airisApi';
import { setCredentials } from '../store/slices/authSlice';

function LoginForm() {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials({ 
        user: result.user, 
        token: result.access_token 
      }));
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={isLoading}>
        {isLoading ? 'Iniciando...' : 'Entrar'}
      </button>
    </form>
  );
}
```

### Ejemplo: Carrito con Redux

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, selectCartItems, selectCartTotal } from '../store/slices/cartSlice';

function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      product,
      quantity: 1,
      size: 'M',
      color: 'Rojo'
    }));
  };

  return (
    <div>
      <h2>Carrito ({items.length})</h2>
      <p>Total: {total.toFixed(2)} €</p>
    </div>
  );
}
```

---

## 📊 Modelo de Datos

### ProductResponse
```typescript
{
  product_id: number;
  product_name: string;
  product_price: number;
  product_rank: number;
  product_description: string | null;
  product_images_urls: string[];
  product_gender: string | null;
  product_characteristics: string[];
}
```

### UserMoodResponse
```typescript
{
  mood_phrase: string;
  related_products_query: string;
}
```

---

## 🔐 Autenticación

El token de autenticación se almacena en el estado de Redux y se incluye automáticamente en todas las peticiones:

```javascript
// En airisApi.js
prepareHeaders: (headers, { getState }) => {
  const token = getState().auth.token;
  if (token) {
    headers.set('authorization', `Bearer ${token}`);
  }
  return headers;
}
```

---

## 💾 Persistencia

- **Auth**: Se persiste en `sessionStorage` (se pierde al cerrar el navegador)
- **Cart**: Solo en memoria (se pierde al recargar la página)

Para persistir el carrito, puedes usar `redux-persist`:

```bash
npm install redux-persist
```

---

## 🎨 Características RTK Query

### Caché Automático
RTK Query cachea automáticamente las respuestas y las reutiliza.

### Invalidación de Caché
```javascript
// Cuando se hace login, se invalidan los tags 'Auth'
invalidatesTags: ['Auth']

// Cuando se personaliza un producto, se invalidan 'Products'
invalidatesTags: ['Products']
```

### Polling (Actualización Automática)
```javascript
const { data } = useGetCatalogProductsQuery(undefined, {
  pollingInterval: 30000, // Actualizar cada 30 segundos
});
```

### Refetch Manual
```javascript
const { data, refetch } = useGetCatalogProductsQuery();

// Refetch cuando sea necesario
<button onClick={refetch}>Actualizar</button>
```

---

## 🚀 Próximos Pasos

1. ✅ Integración básica con RTK Query
2. ⏳ Implementar búsqueda con sugerencias IA
3. ⏳ Personalización de productos por usuario
4. ⏳ Sistema de mood-based recommendations
5. ⏳ Upload de imágenes de usuario
6. ⏳ Persistencia del carrito con redux-persist

---

## 📝 Notas Importantes

- Las APIs requieren autenticación para ciertos endpoints
- Los endpoints de imágenes usan `multipart/form-data`
- La búsqueda de productos usa embeddings vectoriales para mejores resultados
- El mood del usuario se puede usar para recomendaciones personalizadas

---

## 🐛 Debugging

Para ver las peticiones RTK Query en Redux DevTools:

1. Instala Redux DevTools Extension
2. Abre las DevTools del navegador
3. Ve a la pestaña "Redux"
4. Observa las acciones `airisApi/executeQuery` y `airisApi/executeMutation`

---

## 📚 Recursos

- [RTK Query Docs](https://redux-toolkit.js.org/rtk-query/overview)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [AIRIS Loader API Docs](https://airis-loader-711296505139.europe-southwest1.run.app/docs)
- [AIRIS API Docs](https://airis-api-711296505139.europe-southwest1.run.app/docs)
