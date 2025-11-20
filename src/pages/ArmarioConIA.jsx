import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../store/slices/authSlice';
import { useAI } from '../hooks/useAI';
import { getAIImages } from '../services/api';

const ArmarioConIA = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const { isAICompleted } = useAI();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        
        // Primero, verificar si hay imágenes generadas en sessionStorage
        const generatedImagesStr = sessionStorage.getItem('aiGeneratedImages');
        
        if (generatedImagesStr) {
          const generatedImages = JSON.parse(generatedImagesStr);
          
          // Formatear las imágenes generadas para que coincidan con el formato esperado
          const formattedImages = generatedImages.map((img, index) => {
            const isAbsoluteUrl = img.image.startsWith('http');
            const imageUrl = isAbsoluteUrl 
              ? img.image 
              : `https://airis-api-711296505139.europe-southwest1.run.app/image/${img.image}`;
              
            return {
              id: `generated-${img.productId}-${index}`,
              imageUrl: imageUrl,
              description: `${img.productName} - Personalizado con IA`,
              product: {
                id: img.productId,
                name: img.originalProduct.product_name,
                price: img.originalProduct.product_price,
                discount: 0
              },
              generated: new Date().toISOString()
            };
          });
          
          setImages(formattedImages);
          
          // No limpiar el sessionStorage inmediatamente para evitar problemas con Strict Mode (doble ejecución)
          // sessionStorage.removeItem('aiGeneratedImages');
        } else {
          // Si no hay imágenes generadas, cargar las imágenes del usuario
          const response = await getAIImages(user?.username || 'user1');
          if (response.success) {
            setImages(response.data);
          }
        }
      } catch (err) {
        setError('Error al cargar tus imágenes personalizadas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadImages();
    }
  }, [isAuthenticated, user]);

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <h1 className="text-4xl font-bold">Tu Armario con IA</h1>
          </div>
          <p className="text-gray-300 text-lg">
            Descubre cómo luces con nuestros productos personalizados especialmente para ti
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
            <p className="text-gray-600">Cargando tu armario personalizado...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && images.length === 0 && (
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

        {!loading && !error && images.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Tus Looks Personalizados</h2>
              <p className="text-gray-600">
                {images.length} {images.length === 1 ? 'imagen' : 'imágenes'} generadas especialmente para ti
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div key={image.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Imagen personalizada */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={image.imageUrl}
                      alt={image.description}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Información */}
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-3">{image.description}</p>

                    {image.product && (
                      <div className="border-t pt-3">
                        <h3 className="font-semibold text-sm mb-1">{image.product.name}</h3>
                        <p className="text-lg font-bold mb-3">
                          {image.product.discount > 0 ? (
                            <>
                              <span className="text-red-600">
                                {(image.product.price * (1 - image.product.discount / 100)).toFixed(2)} €
                              </span>
                              <span className="text-gray-400 line-through ml-2 text-sm">
                                {image.product.price.toFixed(2)} €
                              </span>
                            </>
                          ) : (
                            <span>{image.product.price.toFixed(2)} €</span>
                          )}
                        </p>
                        <Link
                          to={`/product/${image.product.id}`}
                          className="block w-full bg-black text-white text-center py-2 rounded-md hover:bg-gray-800 transition-colors text-sm"
                        >
                          Ver producto
                        </Link>
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-3">
                      Generado el {new Date(image.generated).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ArmarioConIA;
