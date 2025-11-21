import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentToken } from '../store/slices/authSlice';
import ProductGrid from '../components/ProductGrid';
import { 
  useGetCatalogProductsQuery, 
  useGetSuggestedProductsQuery,
  useGetLatestUserMoodQuery
} from '../store/services/airisApi';

const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Get user mood (only if authenticated and no search)
  const {
    data: userMood,
    isLoading: isMoodLoading
  } = useGetLatestUserMoodQuery(undefined, {
    skip: !isAuthenticated || !!search,
    refetchOnMountOrArgChange: true,
  });

  // Get suggested products based on mood (only if we have mood data)
  const { 
    data: moodBasedProducts, 
    isLoading: isMoodProductsLoading 
  } = useGetSuggestedProductsQuery(userMood?.related_products_query || '', {
    skip: !userMood?.related_products_query || !!search,
  });

  // Get catalog products (fallback)
  const { 
    data: catalogProducts, 
    isLoading: isCatalogLoading, 
    error: catalogError 
  } = useGetCatalogProductsQuery(undefined, {
    skip: !!search,
  });

  // Get search-based products
  const { 
    data: searchProducts, 
    isLoading: isSearchLoading, 
    error: searchError 
  } = useGetSuggestedProductsQuery(search, {
    skip: !search,
  });

  // Determine which data to use
  const products = search 
    ? searchProducts 
    : (isAuthenticated && moodBasedProducts) 
      ? moodBasedProducts 
      : catalogProducts;
  
  const loading = search 
    ? isSearchLoading 
    : isAuthenticated
      ? isMoodLoading || (userMood?.related_products_query && isMoodProductsLoading)
      : isCatalogLoading;
  
  const error = search ? searchError : catalogError;

  const getTitle = () => {
    const category = searchParams.get('category');
    const filter = searchParams.get('filter');

    if (search) {
      return 'Resultados para "' + search + '"';
    }
    if (isAuthenticated && userMood?.related_products_query && moodBasedProducts) {
      return 'Recomendaciones para ti: ' + userMood.mood_phrase;
    }
    if (category) {
      return category;
    }
    if (filter === 'new') {
      return 'Novedades';
    }
    if (filter === 'bestsellers') {
      return 'Bestsellers';
    }
    return 'Todos los productos';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error?.data?.message || 'Error al cargar productos'}</p>
        </div>
      )}
      
      <ProductGrid 
        products={products || []} 
        title={getTitle()} 
        loading={loading}
      />
    </div>
  );
};

export default Home;
