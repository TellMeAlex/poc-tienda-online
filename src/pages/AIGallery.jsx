import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getAIImages } from '../services/api';

const AIGallery = () => {
  const { isAuthenticated, user } = useUser();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadImages();
    }
  }, [isAuthenticated, user]);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAIImages(user.id);

      if (response.success) {
        setImages(response.data);
      } else {
        setError('Error al cargar imágenes');
      }
    } catch (err) {
      console.error('Error al cargar imágenes:', err);
      setError('Error al cargar imágenes');
    } finally {
      setLoading(false);
    }
  };

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando tu galería...</p>
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
            onClick={loadImages}
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mis looks con IA</h1>
        <p className="text-gray-600">
          Visualiza cómo te quedarían nuestros productos con tecnología de inteligencia artificial
        </p>
      </div>

      {/* Grid de imágenes */}
      {images.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 text-lg mb-4">Aún no tienes imágenes generadas</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              {/* Imagen */}
              <div className="aspect-[3/4] bg-gray-100 overflow-hidden relative">
                <img
                  src={image.imageUrl}
                  alt={image.description}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {/* Banda IA */}
                <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  IA
                </div>
              </div>

              {/* Información */}
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3">{image.description}</p>

                {image.product && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{image.product.name}</p>
                      <p className="text-sm font-bold">{image.product.price.toFixed(2)} €</p>
                    </div>
                    <Link
                      to={`/product/${image.product.id}`}
                      className="px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800"
                    >
                      Ver producto
                    </Link>
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-3">
                  Generada: {new Date(image.generated).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info adicional */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-bold mb-3">Sobre las imágenes generadas con IA</h2>
        <p className="text-sm text-gray-600 mb-2">
          Estas imágenes son simulaciones generadas mediante inteligencia artificial para ayudarte a visualizar
          cómo te quedarían nuestros productos.
        </p>
        <p className="text-sm text-gray-600">
          Los resultados reales pueden variar. Las imágenes son únicamente con fines ilustrativos y de referencia.
        </p>
      </div>
    </div>
  );
};

export default AIGallery;
