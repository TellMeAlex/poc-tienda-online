import { useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentToken } from '../store/slices/authSlice';
import ProductGrid from '../components/ProductGrid';
import { 
  useGetCatalogProductsQuery, 
  useGetSuggestedProductsQuery,
  useGetLatestUserMoodQuery
} from '../store/services/airisApi';
import useTypewriter from '../hooks/useTypewriter';
import { useAI } from '../hooks/useAI';

const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { customizedImagesMap, hasRecommendations } = useAI();

  // Show mood-based products if user has active recommendations
  const shouldShowMoodProducts = isAuthenticated && hasRecommendations;
  
  // Get user mood (uses persistent hasRecommendations flag)
  const {
    data: userMood,
    isLoading: isMoodLoading
  } = useGetLatestUserMoodQuery(undefined, {
    skip: !shouldShowMoodProducts || !!search,
  });

  // Typewriter effect for mood phrase (0.5s delay between characters)
  const typedMoodPhrase = useTypewriter(userMood?.mood_phrase || '', 50);

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

  // Determine which base data to use
  // Only show mood-based products after user clicks CTA (not during products_ready state)
  const baseProducts = search 
    ? searchProducts 
    : (shouldShowMoodProducts && moodBasedProducts) 
      ? moodBasedProducts 
      : catalogProducts;

  // Merge customized images into products in real-time
  const products = useMemo(() => {
    if (!baseProducts || Object.keys(customizedImagesMap).length === 0) {
      return baseProducts;
    }

    // Replace product images with customized ones if available
    return baseProducts.map(product => {
      const customizedImage = customizedImagesMap[product.product_id];
      
      if (customizedImage) {
        // Create a new product object with the customized image
        return {
          ...product,
          product_images_urls: [customizedImage, ...(product.product_images_urls || [])],
          isCustomized: true
        };
      }
      
      return product;
    });
  }, [baseProducts, customizedImagesMap]);
  
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
    if (shouldShowMoodProducts && userMood?.related_products_query && moodBasedProducts) {
      return typedMoodPhrase;
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
    // Default to "Novedades" when entering the shop
    return 'Novedades';
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
