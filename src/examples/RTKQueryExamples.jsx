/**
 * RTK Query Hooks - Ejemplos de Uso
 * 
 * Este archivo contiene ejemplos prácticos de cómo usar los hooks
 * de RTK Query en diferentes escenarios.
 */

// ============================================================================
// EJEMPLO 1: Obtener Catálogo de Productos
// ============================================================================

import { useGetCatalogProductsQuery } from '../store/services/airisApi';

function ProductCatalog() {
  const { data: products, isLoading, error, refetch } = useGetCatalogProductsQuery();

  if (isLoading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={refetch}>Actualizar</button>
      {products?.map(product => (
        <div key={product.product_id}>
          <h3>{product.product_name}</h3>
          <p>{product.product_price} €</p>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EJEMPLO 2: Búsqueda con IA
// ============================================================================

import { useState } from 'react';
import { useGetSuggestedProductsQuery } from '../store/services/airisApi';

function AISearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Skip query if search is empty
  const { data, isLoading, isFetching } = useGetSuggestedProductsQuery(debouncedQuery, {
    skip: !debouncedQuery || debouncedQuery.length < 3,
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar con IA..."
      />
      {isFetching && <div>Buscando...</div>}
      {data?.map(product => (
        <div key={product.product_id}>{product.product_name}</div>
      ))}
    </div>
  );
}

// ============================================================================
// EJEMPLO 3: Login con Autenticación
// ============================================================================

import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../store/services/airisApi';
import { setCredentials } from '../store/slices/authSlice';

function LoginForm() {
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials({
        user: result.user || { email },
        token: result.access_token || result.token,
      }));
      alert('Login exitoso!');
    } catch (err) {
      console.error('Login failed:', err);
      alert('Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Iniciando...' : 'Login'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
}

// ============================================================================
// EJEMPLO 4: Personalizar Producto con IA
// ============================================================================

import { useCustomizeProductByUserMutation } from '../store/services/airisApi';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';

function ProductCustomization({ productId }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [customizeProduct, { isLoading, data, error }] = useCustomizeProductByUserMutation();

  const handleCustomize = async () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión');
      return;
    }

    try {
      const customized = await customizeProduct(productId).unwrap();
      console.log('Producto personalizado:', customized);
      alert('¡Producto personalizado con éxito!');
    } catch (err) {
      console.error('Error:', err);
      alert('Error al personalizar');
    }
  };

  return (
    <div>
      <button onClick={handleCustomize} disabled={isLoading || !isAuthenticated}>
        {isLoading ? 'Personalizando...' : '✨ Personalizar con IA'}
      </button>
      {error && <div>Error: {error.message}</div>}
      {data && <div>Producto personalizado: {data.product_name}</div>}
    </div>
  );
}

// ============================================================================
// EJEMPLO 5: Mood del Usuario y Recomendaciones
// ============================================================================

import { useGetLatestUserMoodQuery, useGetSuggestedProductsQuery } from '../store/services/airisApi';

function MoodBasedRecommendations() {
  const { data: mood, isLoading: moodLoading } = useGetLatestUserMoodQuery();
  
  const { data: products, isLoading: productsLoading } = useGetSuggestedProductsQuery(
    mood?.related_products_query || '',
    {
      skip: !mood?.related_products_query,
    }
  );

  if (moodLoading) return <div>Analizando tu mood...</div>;

  return (
    <div>
      <h2>Tu Mood: {mood?.mood_phrase}</h2>
      <h3>Productos Recomendados:</h3>
      {productsLoading ? (
        <div>Cargando recomendaciones...</div>
      ) : (
        products?.map(product => (
          <div key={product.product_id}>{product.product_name}</div>
        ))
      )}
    </div>
  );
}

// ============================================================================
// EJEMPLO 6: Upload de Imágenes de Usuario
// ============================================================================

import { useUploadUserImagesMutation } from '../store/services/airisLoaderApi';

function UserImageUpload({ userId }) {
  const [uploadImages, { isLoading, error }] = useUploadUserImagesMutation();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Selecciona al menos una imagen');
      return;
    }

    try {
      await uploadImages({
        userId,
        imagesKind: 'profile',
        images: selectedFiles,
      }).unwrap();
      alert('Imágenes subidas con éxito!');
      setSelectedFiles([]);
    } catch (err) {
      console.error('Error:', err);
      alert('Error al subir imágenes');
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />
      <button onClick={handleUpload} disabled={isLoading}>
        {isLoading ? 'Subiendo...' : 'Subir Imágenes'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}

// ============================================================================
// EJEMPLO 7: Crear Producto con Imágenes
// ============================================================================

import { useCreateProductWithImagesMutation } from '../store/services/airisLoaderApi';

function CreateProductForm() {
  const [createProduct, { isLoading, error }] = useCreateProductWithImagesMutation();
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    productGender: 'unisex',
    productPrice: 0,
    productRank: 0,
    productCharacteristics: [],
    images: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createProduct({
        ...formData,
        imagesKind: 'product',
      }).unwrap();
      alert('Producto creado con éxito!');
    } catch (err) {
      console.error('Error:', err);
      alert('Error al crear producto');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre del producto"
        value={formData.productName}
        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
      />
      <input
        type="number"
        placeholder="Precio"
        value={formData.productPrice}
        onChange={(e) => setFormData({ ...formData, productPrice: parseFloat(e.target.value) })}
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setFormData({ ...formData, images: Array.from(e.target.files) })}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creando...' : 'Crear Producto'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
}

// ============================================================================
// EJEMPLO 8: Gestión del Carrito con Redux
// ============================================================================

import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemsCount,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../store/slices/cartSlice';

function ShoppingCart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const itemsCount = useSelector(selectCartItemsCount);

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      product,
      quantity: 1,
      size: 'M',
      color: 'Negro',
    }));
  };

  const handleRemove = (productId, size, color) => {
    dispatch(removeFromCart({ productId, size, color }));
  };

  const handleUpdateQuantity = (productId, quantity, size, color) => {
    dispatch(updateQuantity({ productId, quantity, size, color }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div>
      <h2>Carrito ({itemsCount})</h2>
      {items.map((item) => (
        <div key={`${item.product.product_id}-${item.size}-${item.color}`}>
          <h3>{item.product.product_name}</h3>
          <p>Talla: {item.size} | Color: {item.color}</p>
          <p>Cantidad: {item.quantity}</p>
          <button onClick={() => handleUpdateQuantity(
            item.product.product_id,
            item.quantity + 1,
            item.size,
            item.color
          )}>+</button>
          <button onClick={() => handleRemove(
            item.product.product_id,
            item.size,
            item.color
          )}>Eliminar</button>
        </div>
      ))}
      <h3>Total: {total.toFixed(2)} €</h3>
      <button onClick={handleClearCart}>Vaciar Carrito</button>
    </div>
  );
}

// ============================================================================
// EJEMPLO 9: Polling (Actualización Automática)
// ============================================================================

function LiveProductUpdates() {
  const { data: products } = useGetCatalogProductsQuery(undefined, {
    pollingInterval: 30000, // Actualizar cada 30 segundos
  });

  return (
    <div>
      <h2>Productos (actualización automática)</h2>
      {products?.map(product => (
        <div key={product.product_id}>{product.product_name}</div>
      ))}
    </div>
  );
}

// ============================================================================
// EJEMPLO 10: Conditional Fetching
// ============================================================================

function ConditionalProductFetch({ shouldFetch, category }) {
  const { data, isLoading } = useGetCatalogProductsQuery(undefined, {
    skip: !shouldFetch, // No hacer fetch si shouldFetch es false
  });

  if (!shouldFetch) return <div>Fetch deshabilitado</div>;
  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      {data?.map(product => (
        <div key={product.product_id}>{product.product_name}</div>
      ))}
    </div>
  );
}

// ============================================================================
// TIPS Y MEJORES PRÁCTICAS
// ============================================================================

/**
 * 1. SIEMPRE usa .unwrap() en mutations para manejar errores:
 *    const result = await mutation(data).unwrap();
 * 
 * 2. Usa 'skip' para queries condicionales:
 *    useQuery(params, { skip: !condition })
 * 
 * 3. Usa 'pollingInterval' para actualizaciones en tiempo real:
 *    useQuery(params, { pollingInterval: 5000 })
 * 
 * 4. Refetch manual cuando sea necesario:
 *    const { refetch } = useQuery();
 *    <button onClick={refetch}>Actualizar</button>
 * 
 * 5. Maneja estados de loading y error:
 *    if (isLoading) return <Spinner />;
 *    if (error) return <Error message={error.message} />;
 * 
 * 6. Usa selectores para derivar datos:
 *    const total = useSelector(selectCartTotal);
 * 
 * 7. Dispatch acciones en lugar de mutar estado directamente:
 *    dispatch(addToCart(product));
 * 
 * 8. Usa Redux DevTools para debugging:
 *    Instala la extensión y observa las acciones
 */

export {
  ProductCatalog,
  AISearch,
  LoginForm,
  ProductCustomization,
  MoodBasedRecommendations,
  UserImageUpload,
  CreateProductForm,
  ShoppingCart,
  LiveProductUpdates,
  ConditionalProductFetch,
};
