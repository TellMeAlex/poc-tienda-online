import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { useGetLatestUserMoodQuery, useGetSuggestedProductsQuery } from '../store/services/airisApi';
import ProductGrid from '../components/ProductGrid';

const MoodRecommendations = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Get user mood
  const { 
    data: moodData, 
    isLoading: isMoodLoading, 
    error: moodError 
  } = useGetLatestUserMoodQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Get suggested products based on mood
  const { 
    data: suggestedProducts, 
    isLoading: isProductsLoading, 
    error: productsError 
  } = useGetSuggestedProductsQuery(moodData?.related_products_query || '', {
    skip: !isAuthenticated || !moodData?.related_products_query,
  });

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md px-4">
          <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Inicia sesión</h2>
          <p className="text-gray-600 mb-6">
            Debes iniciar sesión para ver recomendaciones personalizadas basadas en tu mood
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (isMoodLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-500">Analizando tu mood...</p>
        </div>
      </div>
    );
  }

  if (moodError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error al cargar tu mood</p>
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
      {/* Mood Section */}
      <div className="mb-12 text-center">
        <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-6 rounded-2xl shadow-lg mb-6">
          <h1 className="text-3xl font-bold mb-2">Tu Mood de Hoy</h1>
          <p className="text-xl italic">"{moodData?.mood_phrase}"</p>
        </div>
        
        <p className="text-gray-600 max-w-2xl mx-auto">
          Basándonos en tu estado de ánimo, hemos seleccionado estos productos especialmente para ti
        </p>
      </div>

      {/* Recommended Products */}
      {isProductsLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-500">Buscando productos perfectos para ti...</p>
          </div>
        </div>
      ) : productsError ? (
        <div className="text-center py-12">
          <p className="text-red-500">Error al cargar recomendaciones</p>
        </div>
      ) : suggestedProducts && suggestedProducts.length > 0 ? (
        <ProductGrid 
          products={suggestedProducts} 
          title="Recomendaciones Personalizadas" 
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay recomendaciones disponibles en este momento</p>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-2">¿Cómo funciona?</h3>
        <p className="text-gray-600 mb-4">
          Nuestro sistema de IA analiza tu comportamiento, preferencias y estado de ánimo para 
          ofrecerte recomendaciones de productos que se ajusten perfectamente a lo que necesitas en este momento.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-3xl mb-2">🧠</div>
            <h4 className="font-semibold mb-1">Análisis IA</h4>
            <p className="text-sm text-gray-600">Entendemos tu mood actual</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-semibold mb-1">Personalización</h4>
            <p className="text-sm text-gray-600">Productos adaptados a ti</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">✨</div>
            <h4 className="font-semibold mb-1">Experiencia única</h4>
            <p className="text-sm text-gray-600">Cada visita es diferente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodRecommendations;
