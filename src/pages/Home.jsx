import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import ProductGrid from '../components/ProductGrid';
import { 
  useGetCatalogProductsQuery, 
  useGetSuggestedProductsQuery,
  useGetLatestUserMoodQuery,
  useCustomizeProductByUserMutation
} from '../store/services/airisApi';

const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [generatedImages, setGeneratedImages] = useState([]);

  // Get user mood (only if authenticated and no search)
  const { 
    data: userMood, 
    isLoading: isMoodLoading 
  } = useGetLatestUserMoodQuery(undefined, {
    skip: !isAuthenticated || !!search,
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
    skip: !!search || (isAuthenticated && !!userMood?.related_products_query),
  });

  // Get search-based products
  const { 
    data: searchProducts, 
    isLoading: isSearchLoading, 
    error: searchError 
  } = useGetSuggestedProductsQuery(search, {
    skip: !search,
  });

  const [customizeProduct] = useCustomizeProductByUserMutation();

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

    if (search) return `Resultados para "${search}"`;
    if (isAuthenticated && userMood?.related_products_query) return `Recomendaciones para ti: ${userMood.mood_phrase}`;
    if (category) return category;
    if (filter === 'new') return 'Novedades';
    if (filter === 'bestsellers') return 'Bestsellers';
    return 'Todos los productos';
  };

  const handleGenerateAIRecommendations = async () => {
    if (!products || products.length === 0) {
      alert('No hay productos para personalizar');
      return;
    }

    setIsGenerating(true);
    setProgress({ current: 0, total: products.length });
    setGeneratedImages([]);

    const images = [];

    try {
      // Personalizar cada producto en paralelo
      const promises = products.map(async (product, index) => {
        try {
          const result = await customizeProduct(product.product_id).unwrap();
          
          // La API devuelve las imágenes en product_images_urls
          const images = result.product_images_urls || result.images || [];
          const lastImage = images[images.length - 1] || images[0];
          
          setProgress(prev => ({ ...prev, current: prev.current + 1 }));
          
          return {
            productId: product.product_id,
            productName: product.product_name,
            image: lastImage,
            originalProduct: product
          };
        } catch (err) {
          console.error(`Error personalizando producto ${product.product_id}:`, err);
          setProgress(prev => ({ ...prev, current: prev.current + 1 }));
          return null;
        }
      });

      const results = await Promise.all(promises);
      const validImages = results.filter(r => r !== null);
      
      setGeneratedImages(validImages);
      
      // Navegar al armario de IA con las imágenes generadas
      if (validImages.length > 0) {
        // Guardar las imágenes en localStorage para que persistan entre recargas
        localStorage.setItem('aiGeneratedImages', JSON.stringify(validImages));
        navigate('/armario-con-ia');
      } else {
        alert('No se pudieron generar recomendaciones personalizadas');
      }
    } catch (err) {
      console.error('Error generando recomendaciones:', err);
      alert('Error al generar recomendaciones con IA');
    } finally {
      setIsGenerating(false);
    }
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
          <p className="text-red-500 mb-4">
            {error?.data?.message || 'Error al cargar productos'}
          </p>
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
      <ProductGrid products={products || []} title={getTitle()} />




      {/* Botón flotante de generar recomendaciones con IA (solo si está autenticado) */}
      {isAuthenticated && !search && (
        <>
          {!isGenerating ? (
            <>
              <button
                onClick={handleGenerateAIRecommendations}
                disabled={!products || products.length === 0}
                className="fixed bottom-20 right-4 md:bottom-4 md:right-[300px] z-40 bg-black text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Generar Recomendaciones
              </button>

              {/* Botón Temporal de Verificación de Display (Bypass Auth) - ELIMINADO DE AQUÍ */}
            </>
          ) : (
            <div className="fixed bottom-20 right-4 md:bottom-4 md:right-[300px] z-40 bg-white rounded-lg shadow-xl p-4 w-80 border border-gray-200">
               <div className="mb-3 text-sm font-medium text-gray-700 text-center flex items-center justify-center gap-2">
                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                 Generando...
               </div>
               <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                 <div
                   className="bg-black h-2 rounded-full transition-all duration-300"
                   style={{ width: `${(progress.current / progress.total) * 100}%` }}
                 />
               </div>
               <div className="text-xs text-gray-500 text-center">
                 {progress.current} / {progress.total} productos
               </div>
            </div>
          )}
        </>
      )}


    </div>
  );
};

export default Home;
