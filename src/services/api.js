import productsData from '../data/products.json';
import aiImagesData from '../data/aiImages.json';

// Simular delay de red
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Servicio 1: Login simple
 * Establece una sesión sin validación real
 */
export const loginUser = async (username) => {
  await delay(300);

  const user = {
    id: 'user1',
    username: username,
    email: `${username}@example.com`,
    createdAt: new Date().toISOString()
  };

  // Guardar en sessionStorage
  sessionStorage.setItem('user', JSON.stringify(user));
  sessionStorage.setItem('isAuthenticated', 'true');

  return {
    success: true,
    user
  };
};

/**
 * Cerrar sesión
 */
export const logoutUser = () => {
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('isAuthenticated');
  return { success: true };
};

/**
 * Verificar si hay sesión activa
 */
export const checkAuth = () => {
  const isAuth = sessionStorage.getItem('isAuthenticated') === 'true';
  const userStr = sessionStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  return {
    isAuthenticated: isAuth,
    user
  };
};

/**
 * Servicio 2: Obtener lista de productos
 */
export const getProducts = async (filters = {}) => {
  await delay();

  let products = [...productsData];

  // Aplicar filtros si existen
  if (filters.category) {
    products = products.filter(p => p.category === filters.category);
  }

  if (filters.isNew) {
    products = products.filter(p => p.isNew);
  }

  if (filters.isBestseller) {
    products = products.filter(p => p.isBestseller);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }

  return {
    success: true,
    data: products,
    total: products.length
  };
};

/**
 * Servicio 3: Obtener detalle de un producto
 */
export const getProductById = async (id) => {
  await delay(400);

  const product = productsData.find(p => p.id === parseInt(id));

  if (!product) {
    return {
      success: false,
      error: 'Producto no encontrado'
    };
  }

  // Añadir información adicional para la vista de detalle
  const detailedProduct = {
    ...product,
    material: 'Algodón 80%, Poliéster 20%',
    care: ['Lavar a máquina máx. 30º', 'No usar lejía', 'Planchar a baja temperatura'],
    features: [
      'Corte regular',
      'Cintura elástica',
      'Bolsillos laterales',
      'Bajo con puño elástico'
    ],
    details: 'Producto confeccionado con materiales de alta calidad. Diseño versátil perfecto para el día a día.',
    relatedProducts: productsData
      .filter(p => p.id !== product.id && p.category === product.category)
      .slice(0, 3)
      .map(p => ({ id: p.id, name: p.name, image: p.image, price: p.price }))
  };

  return {
    success: true,
    data: detailedProduct
  };
};

/**
 * Servicio 4: Obtener imágenes IA del usuario
 */
export const getAIImages = async (userId = 'user1') => {
  await delay(600);

  const userImages = aiImagesData.filter(img => img.userId === userId);

  // Añadir información del producto a cada imagen
  const imagesWithProducts = userImages.map(img => {
    const product = productsData.find(p => p.id === img.productId);
    return {
      ...img,
      product: product ? {
        id: product.id,
        name: product.name,
        price: product.price
      } : null
    };
  });

  return {
    success: true,
    data: imagesWithProducts,
    total: imagesWithProducts.length
  };
};

/**
 * Obtener categorías disponibles
 */
export const getCategories = async () => {
  await delay(200);

  const categories = [...new Set(productsData.map(p => p.category))];

  return {
    success: true,
    data: categories
  };
};

/**
 * Buscar productos
 */
export const searchProducts = async (query) => {
  await delay(300);

  const queryLower = query.toLowerCase();
  const results = productsData.filter(p =>
    p.name.toLowerCase().includes(queryLower) ||
    p.description.toLowerCase().includes(queryLower) ||
    p.category.toLowerCase().includes(queryLower)
  );

  return {
    success: true,
    data: results,
    total: results.length
  };
};
