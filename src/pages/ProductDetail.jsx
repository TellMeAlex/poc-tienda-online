import { useState } from 'react';
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

  // Fetch all products and find the one we need
  const { data: products, isLoading, error } = useGetCatalogProductsQuery();
  const [customizeProduct, { isLoading: isCustomizing }] = useCustomizeProductByUserMutation();

  const product = products?.find(p => p.product_id === parseInt(id));

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

  const images = product.product_images_urls || [];
  const currentImage = images[currentImageIndex] || '/placeholder-image.jpg';

  // Mock sizes and colors (you can enhance this based on product characteristics)
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = ['Negro', 'Blanco', 'Gris', 'Azul'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Galería de imágenes */}
        <div>
          {/* Imagen principal */}
          <div className="aspect-[3/4] bg-gray-200 mb-4 overflow-hidden">
            <img
              src={currentImage}
              alt={product.product_name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Miniaturas */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square bg-gray-200 overflow-hidden border-2 ${
                    currentImageIndex === index ? 'border-black' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.product_name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
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
