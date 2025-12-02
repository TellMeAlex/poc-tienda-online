import { useMemo } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../store/slices/authSlice';
import { useAI } from '../hooks/useAI';
import { useGetAllUserGenerationsQuery } from '../store/services/airisApi';

const ArmarioConIA = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const { isAICompleted } = useAI();

  // Fetch all user generations from API
  const { data: generationsData, isLoading, isFetching, error } = useGetAllUserGenerationsQuery(
    undefined,
    { skip: !isAuthenticated } // Only fetch if authenticated
  );

  // Helper function to determine height based on index pattern for masonry effect
  const getHeightClass = (index) => {
    const patterns = [
      'h-[450px]',   // Tall
      'h-[380px]',   // Medium tall
      'h-[320px]',   // Medium
      'h-[400px]',   // Tall-ish
      'h-[350px]',   // Medium
      'h-[420px]',   // Tall
      'h-[340px]',   // Medium short
      'h-[390px]',   // Medium tall
      'h-[360px]',   // Medium
      'h-[430px]',   // Tall
    ];
    return patterns[index % patterns.length];
  };

  // Transform API response to component format
  const images = useMemo(() => {
    if (!generationsData || !Array.isArray(generationsData)) return [];

    return generationsData.map((generation, index) => {
      // Get the generated image URL (usually the second image in the array)
      // or fallback to the first image in the product_images_urls array
      const imageUrls = generation.product_images_urls || [];
      const generatedImageUrl = imageUrls.length > 1
        ? imageUrls[1]  // User-generated image
        : imageUrls[0];  // Fallback to product image

      return {
        id: `generation-${generation.product_id}-${index}`,
        imageUrl: generatedImageUrl || `https://airis-api-711296505139.europe-southwest1.run.app/image/placeholder.jpg`,
        description: `${generation.product_name || 'Producto'} - Personalizado con IA`,
        product: {
          id: generation.product_id,
          name: generation.product_name,
          price: generation.product_price || 0,
          discount: 0
        },
        generated: generation.created_at || new Date().toISOString()
      };
    });
  }, [generationsData]);

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-12 px-4">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <h1 className="text-4xl font-bold">Tu AIrmario</h1>
          </div>
          <p className="text-gray-300 text-lg">
            Descubre cómo luces con nuestros productos personalizados especialmente para ti
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
            <p className="text-gray-600">Cargando tu armario personalizado...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error al cargar tus imágenes personalizadas
          </div>
        )}

        {!isLoading && !error && images.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="text-2xl font-bold mb-2">No hay imágenes disponibles</h2>
            <p className="text-gray-600 mb-6">
              Aún no hemos generado imágenes personalizadas para ti
            </p>
            <Link
              to="/"
              className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              Explorar productos
            </Link>
          </div>
        )}

        {!isLoading && !error && images.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Tus Looks Personalizados</h2>
              <p className="text-gray-600">
                {images.length} {images.length === 1 ? 'imagen' : 'imágenes'} generadas especialmente para ti
              </p>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
              {images.map((image, index) => {
                const heightClass = getHeightClass(index);
                return (
                <div key={image.id} className={`group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300 break-inside-avoid ${heightClass}`}>
                  {/* Imagen personalizada */}
                  <div className="relative w-full h-full overflow-hidden">
                    <img
                      src={image.imageUrl}
                      alt={image.description}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient overlay - appears on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>

                    {/* Información que aparece en hover */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500"
                        style={{ animationDelay: '100ms' }}>
                        {image.description}
                      </p>

                      {image.product && (
                        <>
                          <h3 className="text-white font-semibold text-sm mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500"
                            style={{ animationDelay: '200ms' }}>
                            {image.product.name}
                          </h3>
                          <p className="text-white font-bold text-base mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500"
                            style={{ animationDelay: '300ms' }}>
                            {image.product.discount > 0 ? (
                              <>
                                <span className="text-white">
                                  {(image.product.price * (1 - image.product.discount / 100)).toFixed(2)} €
                                </span>
                                <span className="text-gray-300 line-through ml-2 text-sm">
                                  {image.product.price.toFixed(2)} €
                                </span>
                              </>
                            ) : (
                              <span>{image.product.price.toFixed(2)} €</span>
                            )}
                          </p>
                          <Link
                            to={`/product/${image.product.id}`}
                            state={{ generatedImageUrl: image.imageUrl }}
                            className="block w-full bg-white text-black text-center py-2 rounded-md hover:bg-gray-100 transition-colors text-sm font-semibold transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500"
                            style={{ animationDelay: '400ms' }}
                          >
                            Ver producto
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default ArmarioConIA;
