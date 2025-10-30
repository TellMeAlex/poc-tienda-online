import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { getProducts } from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Construir filtros desde URL params
        const filters = {};

        const category = searchParams.get('category');
        if (category) filters.category = category;

        const search = searchParams.get('search');
        if (search) filters.search = search;

        const filterParam = searchParams.get('filter');
        if (filterParam === 'new') filters.isNew = true;
        if (filterParam === 'bestsellers') filters.isBestseller = true;

        const response = await getProducts(filters);

        if (response.success) {
          setProducts(response.data);
        } else {
          setError('Error al cargar productos');
        }
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [searchParams]);

  const getTitle = () => {
    const category = searchParams.get('category');
    const filter = searchParams.get('filter');
    const search = searchParams.get('search');

    if (search) return `Resultados para "${search}"`;
    if (category) return category;
    if (filter === 'new') return 'Novedades';
    if (filter === 'bestsellers') return 'Bestsellers';
    return 'Todos los productos';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProductGrid products={products} title={getTitle()} />
    </div>
  );
};

export default Home;
