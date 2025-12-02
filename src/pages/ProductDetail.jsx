import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCatalogProductsQuery, useCustomizeProductByUserMutation } from '../store/services/airisApi';
import { addToCart } from '../store/slices/cartSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [aiGeneratedImages, setAiGeneratedImages] = useState([]);

  // Fetch all products and find the one we need
  const { data: products, isLoading, error } = useGetCatalogProductsQuery();
  const [customizeProduct, { isLoading: isCustomizing }] = useCustomizeProductByUserMutation();

  const product = products?.find(p => p.product_id === parseInt(id));

  // Load AI-generated images from localStorage and filter for current product
  useEffect(() => {
    const loadAIGeneratedImages = () => {
      try {
        const generatedImagesStr = localStorage.getItem('aiGeneratedImages');
        if (generatedImagesStr) {
          const generatedImages = JSON.parse(generatedImagesStr);
          
          // Filter images for the current product
          const currentProductImages = generatedImages.filter(
            img => img.productId === parseInt(id)
          );
          
          if (currentProductImages.length > 0) {
            // Convert AI-generated images to the expected format
            const formattedImages = currentProductImages.map(img => {
              const isAbsoluteUrl = img.image.startsWith('http');
              return isAbsoluteUrl 
                ? img.image 
                : `https://airis-api-711296505139.europe-southwest1.run.app/image/${img.image}`;
            });
            
            setAiGeneratedImages(formattedImages);
            // Reset current image index when AI images are loaded
            setCurrentImageIndex(0);
          }
        }
      } catch (error) {
        console.error('Error loading AI-generated images:', error);
      }
    };

    if (id) {
      loadAIGeneratedImages();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    dispatch(addToCart({
      product,
      quantity,
      size: selectedSize,
      color: selectedColor,
    }));

    // Show success message or navigate to cart
    alert('Producto añadido al carrito');
  };

  const handleCustomize = async () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para personalizar productos');
      return;
    }

    try {
      const customizedProduct = await customizeProduct(parseInt(id)).unwrap();
      console.log('Producto personalizado:', customizedProduct);
      alert('¡Producto personalizado con éxito!');
    } catch (error) {
      console.error('Error al personalizar producto:', error);
      alert('Error al personalizar el producto');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Producto no encontrado</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Combine AI-generated images with catalog images, prioritizing AI-generated ones
  const catalogImages = product.product_images_urls || [];
  const allImages = aiGeneratedImages.length > 0 ? [...aiGeneratedImages, ...catalogImages] : catalogImages;
  const currentImage = allImages[currentImageIndex] || '/placeholder-image.jpg';
  
  // Check if current image is AI-generated
  const isCurrentImageAI = aiGeneratedImages.length > 0 && currentImageIndex < aiGeneratedImages.length;

  // Mock sizes and colors (you can enhance this based on product characteristics)
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = ['Negro', 'Blanco', 'Gris', 'Azul'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Galería de imágenes */}
        <div>
          {/* Imagen principal */}
          <div className="aspect-[3/4] bg-gray-200 mb-4 overflow-hidden relative">
            <img
              src={currentImage}
              alt={product.product_name}
              className="w-full h-full object-cover"
            />
            {/* AI-generated badge */}
            {isCurrentImageAI && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                AI fitting room
              </div>
            )}
          </div>

          {/* Miniaturas */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {allImages.map((img, index) => {
                const isAIImage = index < aiGeneratedImages.length;
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square bg-gray-200 overflow-hidden border-2 relative ${
                      currentImageIndex === index ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.product_name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Small AI indicator for thumbnails */}
                    {isAIImage && (
                      <div className="absolute top-1 right-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-1">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.product_name}</h1>

          {/* Precio */}
          <div className="mb-6">
            <span className="text-2xl font-bold">{product.product_price.toFixed(2)} €</span>
          </div>

          {/* Descripción */}
          {product.product_description && (
            <div className="mb-6">
              <p className="text-gray-700">{product.product_description}</p>
            </div>
          )}

          {/* Características */}
          {product.product_characteristics && product.product_characteristics.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Características:</h3>
              <div className="flex flex-wrap gap-2">
                {product.product_characteristics.map((char, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Género */}
          {product.product_gender && (
            <div className="mb-6">
              <span className="text-sm text-gray-600">
                Género: <span className="font-semibold">{product.product_gender}</span>
              </span>
            </div>
          )}

          {/* Selector de talla */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Talla</label>
            <div className="flex gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border ${
                    selectedSize === size
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de color */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Color</label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border ${
                    selectedColor === color
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-black'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de cantidad */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Cantidad</label>
            <div className="flex items-center border border-gray-300 w-32">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100"
              >
                -
              </button>
              <span className="flex-1 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor}
              className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Añadir al carrito
            </button>

            {isAuthenticated && (
              <button
                onClick={handleCustomize}
                disabled={isCustomizing}
                className="w-full border-2 border-black text-black py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {isCustomizing ? 'Personalizando...' : '✨ Personalizar con IA'}
              </button>
            )}
          </div>

          {!selectedSize || !selectedColor ? (
            <p className="text-sm text-red-500 mt-2">
              Por favor, selecciona talla y color
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
